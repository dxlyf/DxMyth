/**
 * Greiner-Hormann 多边形裁剪算法。
 *
 * Weiler-Atherton 的稳健改进版，核心区别：
 *   - 使用双向链表（prev/next）表达环，插入交点时保持顺序；
 *   - 每个交点节点带 `alpha`（参数化位置，0..1，便于去重与排序）；
 *   - 用 `entry` 布尔标记区分进入/退出对方内部，遍历时严格按 entry 决定是否
 *     切换到 neighbor 链表，避免 WA 中 entry/exit 判定的歧义；
 *   - 对每个环独立处理 entry/exit 标记：从环上一点出发，用"该点是否在对方内部"
 *     作为初始 inside 状态，遇到交点则翻转，entry = 翻转后的 inside 值。
 *
 * 算法流程：
 *   1. 求所有环对边交点，按 alpha 插入两条环的双链表，配对 neighbor。
 *   2. 标记 entry/exit：遍历环上交点，inside 状态每次取反，entry=新 inside。
 *   3. 遍历：从某个未访问且 entry=true 的交点出发，沿当前环前进，
 *      遇到 exit 交点（entry=false）则切到 neighbor 继续沿对方环前进，
 *      直到回到起点。Intersect 用 entry 起点；Union/Difference 用对应的起点选择。
 *   4. 孤立环（无交点）按包含关系单独处理。
 *
 * 支持孔洞：方向归一化后多环一起参与，nonzero 规则统一判定。
 *
 * 限制：与 WA 同源，对共线重叠边仍不稳健；可配合扰动或退化处理增强。
 */

import {
    type Point, type Ring, type Polygon, type ClipResult, ClipOp,
    ringCentroid, pointInRing, segmentIntersect, pointEq,
    normalizeOrientation, ringsToPolygons, polygonToRings, EPS,
} from './types'

/** 双向链表节点 */
interface GHNode {
    pt: Point
    isIntersect: boolean
    /** 交点在所属边上的参数 0..1（原始顶点为 0） */
    alpha: number
    /** 对方环上同位交点 */
    neighbor: GHNode | null
    /** entry=true：进入对方内部；false：退出 */
    entry: boolean
    visited: boolean
    /** 该节点→下一节点的边是否在对方内部 */
    inside: boolean
    next: GHNode | null
    prev: GHNode | null
    /** 所属环索引 */
    ringIdx: number
}

/** 把环 + 该环各边交点展开为双向循环链表，返回头节点（首顶点） */
function buildList(
    ring: Ring, ringIdx: number,
    edgeIsects: { alpha: number; point: Point; pairId: number }[][],
): GHNode | null {
    if (ring.length === 0) return null
    let head: GHNode | null = null
    let tail: GHNode | null = null
    const n = ring.length
    for (let i = 0; i < n; i++) {
        // 原始顶点（alpha=0）
        const vNode: GHNode = {
            pt: ring[i], isIntersect: false, alpha: 0, neighbor: null,
            entry: false, visited: false, inside: false,
            next: null, prev: tail, ringIdx,
        }
        if (tail) tail.next = vNode
        else head = vNode
        tail = vNode
        // 该边上的交点按 alpha 排序插入
        const isects = (edgeIsects[i] || []).slice().sort((a, b) => a.alpha - b.alpha)
        for (const it of isects) {
            const iNode: GHNode = {
                pt: it.point, isIntersect: true, alpha: it.alpha, neighbor: null,
                entry: false, visited: false, inside: false,
                next: null, prev: tail, ringIdx,
            }
            ;(iNode as any)._pairId = it.pairId
            if (tail) tail.next = iNode
            tail = iNode
        }
    }
    // 闭合：tail -> head
    if (tail && head) {
        tail.next = head
        head.prev = tail
    }
    return head
}

/** 收集链表所有节点 */
function collectNodes(head: GHNode | null): GHNode[] {
    const out: GHNode[] = []
    if (!head) return out
    let cur: GHNode | null = head
    do {
        out.push(cur)
        cur = cur.next
    } while (cur && cur !== head)
    return out
}

/** 在节点环中找下一节点（处理末尾回环） */
function nextOf(node: GHNode): GHNode {
    return node.next || node
}

/**
 * Greiner-Hormann 主入口。
 */
export function greinerHormannClip(
    subject: Polygon, clip: Polygon, op: ClipOp,
): ClipResult {
    const sPoly = normalizeOrientation(subject, true)
    const cPoly = op === ClipOp.Difference
        ? normalizeOrientation(clip, false)
        : normalizeOrientation(clip, true)
    const sRings = polygonToRings(sPoly)
    const cRings = polygonToRings(cPoly)

    // ── 1. 求所有环对边交点 ──
    interface Isect {
        sRing: number; sEdge: number; alpha: number
        cRing: number; cEdge: number; beta: number
        point: Point; pairId: number
    }
    const isects: Isect[] = []
    let pairId = 0
    for (let si = 0; si < sRings.length; si++) {
        const sr = sRings[si]
        for (let ci = 0; ci < cRings.length; ci++) {
            const cr = cRings[ci]
            for (let sei = 0; sei < sr.length; sei++) {
                const a0 = sr[sei], a1 = sr[(sei + 1) % sr.length]
                for (let cei = 0; cei < cr.length; cei++) {
                    const b0 = cr[cei], b1 = cr[(cei + 1) % cr.length]
                    const hit = segmentIntersect(a0, a1, b0, b1)
                    if (!hit) continue
                    isects.push({
                        sRing: si, sEdge: sei, alpha: hit.t1,
                        cRing: ci, cEdge: cei, beta: hit.t2,
                        point: hit.point, pairId: pairId++,
                    })
                }
            }
        }
    }

    if (isects.length === 0) {
        return handleNoIntersection(sPoly, cPoly, op)
    }

    // ── 2. 为每条环每条边分配交点 ──
    type IsectEntry = { alpha: number; point: Point; pairId: number }
    const sEdgeIsects: IsectEntry[][][] = sRings.map(r => r.map((): IsectEntry[] => []))
    const cEdgeIsects: IsectEntry[][][] = cRings.map(r => r.map((): IsectEntry[] => []))
    for (const it of isects) {
        sEdgeIsects[it.sRing][it.sEdge].push({ alpha: it.alpha, point: it.point, pairId: it.pairId })
        cEdgeIsects[it.cRing][it.cEdge].push({ alpha: it.beta, point: it.point, pairId: it.pairId })
    }

    // ── 3. 构建双向链表 ──
    const sHeads = sRings.map((r, i) => buildList(r, i, sEdgeIsects[i]))
    const cHeads = cRings.map((r, i) => buildList(r, i, cEdgeIsects[i]))
    const sAllNodes = sHeads.map(collectNodes)
    const cAllNodes = cHeads.map(collectNodes)

    // ── 4. 配对 neighbor（按 pairId） ──
    const pairMap = new Map<number, { s?: GHNode; c?: GHNode }>()
    for (const ring of sAllNodes) {
        for (const nd of ring) {
            if (nd.isIntersect) pairMap.set((nd as any)._pairId, { s: nd })
        }
    }
    for (const ring of cAllNodes) {
        for (const nd of ring) {
            if (nd.isIntersect) {
                const e = pairMap.get((nd as any)._pairId)!
                e.c = nd
            }
        }
    }
    for (const { s, c } of pairMap.values()) {
        if (s && c) { s.neighbor = c; c.neighbor = s }
    }

    // ── 5. 标记 entry/exit ──
    // 从环起点出发，用第一段中点判定初始 inside（相对对方多边形），
    // 遇到交点则翻转 inside，entry = 翻转后值（true=进入对方内部）。
    const markEntryExit = (rings: GHNode[][], otherPoly: Polygon) => {
        for (const ring of rings) {
            if (ring.length === 0) continue
            const first = ring[0]
            const second = nextOf(first)
            const mid = { x: (first.pt.x + second.pt.x) / 2, y: (first.pt.y + second.pt.y) / 2 }
            let inside = pointInRing(mid, otherPoly.outer)
            for (const h of otherPoly.holes) {
                if (pointInRing(mid, h)) inside = !inside
            }
            for (const nd of ring) {
                if (nd.isIntersect) {
                    inside = !inside
                    nd.entry = inside
                }
            }
        }
    }
    markEntryExit(sAllNodes, cPoly)
    markEntryExit(cAllNodes, sPoly)

    // ── 6. 标记每条边 inside（用于选边） ──
    const tagInside = (rings: GHNode[][], otherPoly: Polygon) => {
        for (const ring of rings) {
            for (const nd of ring) {
                const nxt = nextOf(nd)
                const mid = { x: (nd.pt.x + nxt.pt.x) / 2, y: (nd.pt.y + nxt.pt.y) / 2 }
                let inside = pointInRing(mid, otherPoly.outer)
                for (const h of otherPoly.holes) {
                    if (pointInRing(mid, h)) inside = !inside
                }
                nd.inside = inside
            }
        }
    }
    tagInside(sAllNodes, cPoly)
    tagInside(cAllNodes, sPoly)

    // ── 7. 选边规则 ──
    const shouldKeep = (node: GHNode, fromS: boolean): boolean => {
        switch (op) {
            case ClipOp.Union: return !node.inside
            case ClipOp.Intersect: return node.inside
            case ClipOp.Difference: return fromS ? !node.inside : node.inside
        }
        return true
    }

    // ── 8. 遍历生成结果环 ──
    const resultRings: Ring[] = []
    const allSNodes = sAllNodes.flat()
    const allCNodes = cAllNodes.flat()
    const allNodes = [...allSNodes, ...allCNodes]

    const findRingOf = (nd: GHNode): GHNode[] => {
        for (const r of sAllNodes) if (r.includes(nd)) return r
        for (const r of cAllNodes) if (r.includes(nd)) return r
        return sAllNodes[0]
    }
    const isFromS = (nd: GHNode): boolean => sAllNodes.some(r => r.includes(nd))

    const follow = (start: GHNode): Ring | null => {
        const pts: Point[] = []
        let cur = start
        let iter = 0
        const maxIter = allNodes.length * 2 + 10
        while (iter++ < maxIter) {
            if (cur.visited && pts.length > 0 && pointEq(cur.pt, start.pt, EPS)) break
            cur.visited = true
            const fromS = isFromS(cur)
            if (cur.isIntersect && cur.neighbor) {
                const keep = shouldKeep(cur, fromS)
                if (!keep) {
                    pts.push(cur.pt)
                    cur = cur.neighbor
                    continue
                }
                pts.push(cur.pt)
                cur = nextOf(cur)
                continue
            }
            pts.push(cur.pt)
            cur = nextOf(cur)
        }
        if (pts.length < 3) return null
        if (pts.length > 1 && pointEq(pts[0], pts[pts.length - 1], EPS)) pts.pop()
        return pts.length >= 3 ? pts : null
    }

    for (const start of allNodes) {
        if (!start.isIntersect || start.visited) continue
        const ring = follow(start)
        if (ring) resultRings.push(ring)
    }

    // ── 9. 孤立环处理 ──
    const handleIsolatedRing = (ring: Ring, fromS: boolean) => {
        const c = ringCentroid(ring)
        const other = fromS ? cPoly : sPoly
        let inside = pointInRing(c, other.outer)
        for (const h of other.holes) if (pointInRing(c, h)) inside = !inside
        let keep = false
        switch (op) {
            case ClipOp.Union: keep = !inside; break
            case ClipOp.Intersect: keep = inside; break
            case ClipOp.Difference: keep = fromS ? !inside : inside; break
        }
        if (keep) resultRings.push(ring)
    }
    for (let i = 0; i < sRings.length; i++) {
        const hasIsect = sAllNodes[i].some(n => n.isIntersect)
        if (!hasIsect) handleIsolatedRing(sRings[i], true)
    }
    for (let i = 0; i < cRings.length; i++) {
        const hasIsect = cAllNodes[i].some(n => n.isIntersect)
        if (!hasIsect) handleIsolatedRing(cRings[i], false)
    }

    return ringsToPolygons(resultRings)
}

/** 无交点时的包含关系处理 */
function handleNoIntersection(s: Polygon, c: Polygon, op: ClipOp): ClipResult {
    const result: Polygon[] = []
    const sC = ringCentroid(s.outer)
    const cC = ringCentroid(c.outer)
    let sInC = pointInRing(sC, c.outer)
    for (const h of c.holes) if (pointInRing(sC, h)) sInC = !sInC
    let cInS = pointInRing(cC, s.outer)
    for (const h of s.holes) if (pointInRing(cC, h)) cInS = !cInS

    if (op === ClipOp.Union) {
        if (!sInC) result.push(s)
        if (!cInS) result.push(c)
    } else if (op === ClipOp.Intersect) {
        if (sInC) result.push(s)
        else if (cInS) result.push(c)
    } else if (op === ClipOp.Difference) {
        if (!sInC) result.push(s)
        if (cInS) result.push(c)
    } else if (op === ClipOp.Xor) {
        if (!sInC) result.push(s)
        if (!cInS) result.push(c)
    }
    return result
}
