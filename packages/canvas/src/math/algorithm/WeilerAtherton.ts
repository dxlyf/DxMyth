/**
 * Weiler-Atherton 多边形裁剪算法。
 *
 * 经典进出点标记法：
 *   1. 在 subject 与 clip 的所有边对上求交，将交点按参数插入各自的环顶点链表，
 *      每个交点同时记录在两条链表中的对应节点（neighbor）。
 *   2. 标记每个交点是 "进入(entry)" 还是 "退出(exit)"：
 *      以 subject 视角，从外部走到内部 = entry，从内部走到外部 = exit。
 *      用点是否在对方多边形内部判断（非交点处的环顶点作为参照）。
 *   3. 遍历构造结果：从某个未访问的 entry 交点出发，
 *        - Intersect/Union：按 entry/exit 决定在 subject 与 clip 之间切换；
 *        - Difference：clip 方向取反后等同 Union 的切换逻辑。
 *      到达 exit 交点时切换到另一条链表的对应 neighbor 继续走，
 *      直到回到起点形成闭合结果环。
 *
 * 支持孔洞：把多边形展开成"外环 + 孔洞"多条环一起参与求交，
 *  方向归一化后用 nonzero 规则统一判定内外，遍历自动在孔洞边界切换。
 *
 * 限制：共线重叠、相切等退化情形不完全稳健（经典 WA 通病），
 *  生产场景建议用 Vatti 或 Greiner-Hormann。
 */

import {
    type Point, type Ring, type Polygon, type ClipResult, ClipOp,
    ringCentroid, pointInRing, segmentIntersect, pointEq,
    normalizeOrientation, ringsToPolygons, polygonToRings, EPS,
} from './types'

/**
 * 基于数组的环节点实现：在每条边的原始顶点之间插入交点节点，
 * 每个交点带 neighbor 引用（指向对方环上同位交点）与 entry/exit 标记。
 */

/** 带交点的边：原始边 p0->p1，中间可能插入多个交点 */
interface EdgeNode {
    pt: Point
    isIntersect: boolean
    /** 交点配对 id（同一交点在两条环上共享） */
    pairId: number
    /** 对方环上同位节点（交点才有） */
    neighbor?: EdgeNode
    entry: boolean
    visited: boolean
    /** 该节点到下一节点的边是否在对方内部 */
    inside: boolean
}

/** 把环 + 该环各边交点，展开为有序节点环数组（含交点插入） */
function expandRing(
    ring: Ring, ringIdx: number,
    /** 本环每条边上的交点：edgeIsects[edgeIdx] = [{t, point, pairId}] */
    edgeIsects: { t: number; point: Point; pairId: number }[][],
): EdgeNode[] {
    const nodes: EdgeNode[] = []
    const n = ring.length
    for (let i = 0; i < n; i++) {
        nodes.push({
            pt: ring[i], isIntersect: false, pairId: -1,
            entry: false, visited: false, inside: false,
        })
        const isects = (edgeIsects[i] || []).slice().sort((a, b) => a.t - b.t)
        for (const it of isects) {
            nodes.push({
                pt: it.point, isIntersect: true, pairId: it.pairId,
                entry: false, visited: false, inside: false,
            })
        }
    }
    // 不需要显式闭合：取模访问 next/prev
    return nodes
}

/** 按环索引分组取节点（数组形式） */
function getNodeAt(nodes: EdgeNode[], i: number): EdgeNode {
    return nodes[((i % nodes.length) + nodes.length) % nodes.length]
}

/**
 * Weiler-Atherton 主入口。
 * @param subject 主体多边形（可含孔洞）
 * @param clip    裁剪多边形（可含孔洞）
 * @param op      布尔运算类型
 */
export function weilerAthertonClip(
    subject: Polygon, clip: Polygon, op: ClipOp,
): ClipResult {
    const sPoly = normalizeOrientation(subject, true)  // 外环 CCW、孔洞 CW
    // Difference 时 clip 反向，使其与 subject 方向相反，便于遍历切换
    const cPoly = op === ClipOp.Difference
        ? normalizeOrientation(clip, false)
        : normalizeOrientation(clip, true)

    const sRings = polygonToRings(sPoly)
    const cRings = polygonToRings(cPoly)

    // ── 1. 收集所有环对的边交点 ──
    // pairId 给每个交点一个全局唯一 id，便于在两条环上配对
    interface Isect {
        sRing: number; sEdge: number; tS: number
        cRing: number; cEdge: number; tC: number
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
                    // 去除端点重复（容差内视为同一点）
                    isects.push({
                        sRing: si, sEdge: sei, tS: hit.t1,
                        cRing: ci, cEdge: cei, tC: hit.t2,
                        point: hit.point, pairId: pairId++,
                    })
                }
            }
        }
    }

    // ── 2. 无交点：纯包含关系处理 ──
    if (isects.length === 0) {
        return handleNoIntersection(sPoly, cPoly, op)
    }

    // ── 3. 为每条环的每条边准备交点列表 ──
    type IsectEntry = { t: number; point: Point; pairId: number }
    const sEdgeIsects: IsectEntry[][][] = sRings.map(r => r.map((): IsectEntry[] => []))
    const cEdgeIsects: IsectEntry[][][] = cRings.map(r => r.map((): IsectEntry[] => []))
    for (const it of isects) {
        sEdgeIsects[it.sRing][it.sEdge].push({ t: it.tS, point: it.point, pairId: it.pairId })
        cEdgeIsects[it.cRing][it.cEdge].push({ t: it.tC, point: it.point, pairId: it.pairId })
    }

    // ── 4. 展开成带交点的节点环 ──
    const sNodesPerRing = sRings.map((r, i) => expandRing(r, i, sEdgeIsects[i]))
    const cNodesPerRing = cRings.map((r, i) => expandRing(r, i, cEdgeIsects[i]))

    // 建立 pairId -> (sNode, cNode) 索引，配对 neighbor
    const pairMap = new Map<number, { s?: EdgeNode; c?: EdgeNode }>()
    for (const ringNodes of sNodesPerRing) {
        for (const nd of ringNodes) {
            if (nd.isIntersect) pairMap.get(nd.pairId)!.s = nd
        }
    }
    for (const ringNodes of cNodesPerRing) {
        for (const nd of ringNodes) {
            if (nd.isIntersect) {
                const entry = pairMap.get(nd.pairId) || { s: undefined }
                entry.c = nd
                pairMap.set(nd.pairId, entry)
            }
        }
    }
    for (const { s, c } of pairMap.values()) {
        if (s && c) { s.neighbor = c; c.neighbor = s }
    }

    // ── 5. 标记每个交点是 entry 还是 exit ──
    // 用"该交点在对方多边形内部"判断：
    //   交点恰好落在边界上，取"下一节点边中点"判定 inside，
    //   inside 与上一段状态相反 → 该交点为 entry/exit 分界。
    // 简化：对每条环，从首节点开始遍历，用中点采样判定 inside，
    //   状态翻转处即交点，依次标记 entry(true)/exit(false)。
    const allSNodes = sNodesPerRing.flat()
    const allCNodes = cNodesPerRing.flat()

    const markEntries = (nodesPerRing: EdgeNode[][], otherPoly: Polygon) => {
        for (const ringNodes of nodesPerRing) {
            // 用第一段中点判定环起点处的 inside 状态
            const first = ringNodes[0]
            const second = getNodeAt(ringNodes, 1)
            const mid0 = { x: (first.pt.x + second.pt.x) / 2, y: (first.pt.y + second.pt.y) / 2 }
            let inside = pointInRing(mid0, otherPoly.outer)
            for (const h of otherPoly.holes) {
                if (pointInRing(mid0, h)) inside = !inside
            }
            const n = ringNodes.length
            for (let i = 0; i < n; i++) {
                const cur = ringNodes[i]
                const nxt = getNodeAt(ringNodes, i + 1)
                if (cur.isIntersect) {
                    // 用下一段中点判断该交点之后是否进入对方内部
                    const segMid = { x: (cur.pt.x + nxt.pt.x) / 2, y: (cur.pt.y + nxt.pt.y) / 2 }
                    let segInside = pointInRing(segMid, otherPoly.outer)
                    for (const h of otherPoly.holes) {
                        if (pointInRing(segMid, h)) segInside = !segInside
                    }
                    // entry = 进入对方内部 = 状态由 false 翻转为 true
                    cur.entry = segInside
                    inside = segInside
                }
            }
        }
    }
    markEntries(sNodesPerRing, cPoly)
    markEntries(cNodesPerRing, sPoly)

    // ── 6. 标记每条边的 inside（用于 Difference/Union 选边） ──
    const tagInside = (nodesPerRing: EdgeNode[][], otherPoly: Polygon) => {
        for (const ringNodes of nodesPerRing) {
            const n = ringNodes.length
            for (let i = 0; i < n; i++) {
                const cur = ringNodes[i]
                const nxt = getNodeAt(ringNodes, i + 1)
                const mid = { x: (cur.pt.x + nxt.pt.x) / 2, y: (cur.pt.y + nxt.pt.y) / 2 }
                let inside = pointInRing(mid, otherPoly.outer)
                for (const h of otherPoly.holes) {
                    if (pointInRing(mid, h)) inside = !inside
                }
                cur.inside = inside
            }
        }
    }
    tagInside(sNodesPerRing, cPoly)
    tagInside(cNodesPerRing, sPoly)

    // ── 7. 遍历生成结果环 ──
    // 选边规则：
    //   Union       : subject 边 !inside 保留；clip 边 !inside 保留
    //   Intersect   : subject 边  inside 保留；clip 边  inside 保留
    //   Difference  : subject 边 !inside 保留；clip 边(已反向) inside 保留（作孔洞）
    const shouldKeep = (node: EdgeNode, fromS: boolean): boolean => {
        switch (op) {
            case ClipOp.Union: return !node.inside
            case ClipOp.Intersect: return node.inside
            case ClipOp.Difference: return fromS ? !node.inside : node.inside
        }
        return true
    }

    const resultRings: Ring[] = []
    const allNodes = [...allSNodes, ...allCNodes]

    const findRingIndex = (nd: EdgeNode): number => {
        for (let r = 0; r < sNodesPerRing.length; r++) {
            if (sNodesPerRing[r].includes(nd)) return r
        }
        for (let r = 0; r < cNodesPerRing.length; r++) {
            if (cNodesPerRing[r].includes(nd)) return r
        }
        return -1
    }

    const follow = (start: EdgeNode): Ring | null => {
        const pts: Point[] = []
        let cur: EdgeNode = start
        let iter = 0
        const maxIter = allNodes.length * 2 + 10
        while (iter++ < maxIter) {
            if (cur.visited && pts.length > 0 && pointEq(cur.pt, start.pt, EPS)) break
            cur.visited = true
            // 找该节点在其所在环中的索引
            const ringNodes = findRingIndex(cur) < sNodesPerRing.length
                ? sNodesPerRing[findRingIndex(cur)]
                : cNodesPerRing[findRingIndex(cur) - sNodesPerRing.length]
            const idxInRing = ringNodes.indexOf(cur)
            const nxt = getNodeAt(ringNodes, idxInRing + 1)
            const fromS = sNodesPerRing.some(r => r.includes(cur))
            if (cur.isIntersect && cur.neighbor) {
                const keep = shouldKeep(cur, fromS)
                if (!keep) {
                    // 切换到对方环对应交点，继续沿对方方向
                    pts.push(cur.pt)
                    cur = cur.neighbor
                    continue
                } else {
                    pts.push(cur.pt)
                    cur = nxt
                    continue
                }
            } else {
                pts.push(cur.pt)
                cur = nxt
            }
        }
        if (pts.length < 3) return null
        // 去掉末尾与首点重复
        if (pts.length > 1 && pointEq(pts[0], pts[pts.length - 1], EPS)) pts.pop()
        return pts.length >= 3 ? pts : null
    }

    // 从交点开始遍历
    for (const start of allNodes) {
        if (!start.isIntersect || start.visited) continue
        const ring = follow(start)
        if (ring) resultRings.push(ring)
    }

    // 处理孤立环（无交点的环）：按包含关系决定是否保留
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
        const hasIsect = sNodesPerRing[i].some(n => n.isIntersect)
        if (!hasIsect) handleIsolatedRing(sRings[i], true)
    }
    for (let i = 0; i < cRings.length; i++) {
        const hasIsect = cNodesPerRing[i].some(n => n.isIntersect)
        if (!hasIsect) handleIsolatedRing(cRings[i], false)
    }

    return ringsToPolygons(resultRings)
}

/** 无交点时的包含关系处理 */
function handleNoIntersection(s: Polygon, c: Polygon, op: ClipOp): ClipResult {
    const result: Polygon[] = []
    const sCentroid = ringCentroid(s.outer)
    const cCentroid = ringCentroid(c.outer)
    let sInsideC = pointInRing(sCentroid, c.outer)
    for (const h of c.holes) if (pointInRing(sCentroid, h)) sInsideC = !sInsideC
    let cInsideS = pointInRing(cCentroid, s.outer)
    for (const h of s.holes) if (pointInRing(cCentroid, h)) cInsideS = !cInsideS

    if (op === ClipOp.Union) {
        if (!sInsideC) result.push(s)
        if (!cInsideS) result.push(c)
    } else if (op === ClipOp.Intersect) {
        if (sInsideC) result.push(s)
        else if (cInsideS) result.push(c)
    } else if (op === ClipOp.Difference) {
        if (!sInsideC) result.push(s)
        // Difference 时 clip 已反向，若在 subject 内则作孔洞加入
        if (cInsideS) result.push(c)
    } else if (op === ClipOp.Xor) {
        if (!sInsideC) result.push(s)
        if (!cInsideS) result.push(c)
    }
    return result
}
