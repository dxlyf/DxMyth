/**
 * BSP（二叉空间分割）多边形裁剪算法。
 *
 * 核心思想：用裁剪多边形（clip）的每条边所在直线作为分割平面，递归地把
 * 主体多边形（subject）切成凸/非凸单元，直到每个单元相对 clip 完全落在
 * 内部或外部；再用点-在-多边形（含孔洞）测试判定每个单元的
 * (inSubject, inClip)，按运算类型保留对应单元；最后把保留单元的边中
 * "出现两次（方向相反）"的内部边消解，剩余边追踪成闭合环，还原为 Polygon[]。
 *
 * 流程：
 *   1. 收集分割线 = clip 所有边（外环 + 孔洞）所在直线，
 *      另把 subject 自身孔洞边也作为分割线，防止单元跨越孔洞导致误分类。
 *   2. 递归 splitByLines：对当前一组 ring，取下一条分割线 L，
 *      把每条 ring 用 splitRingByLine 切成 front / back 两组（可能各多条），
 *      分别递归剩余分割线。最终叶节点 = 一组被所有线切透的简单 ring。
 *   3. 对每个叶 ring 取质心，判断 inSubject / inClip（均含孔洞，nonzero），
 *      按运算类型决定是否保留该 ring。
 *   4. 收集所有保留 ring 的有向边，统计出现次数；出现两次（反向）= 内部边 → 删除；
 *      剩余边 = 结果边界 → 追踪成闭合环 → ringsToPolygons 还原外环/孔洞。
 *
 * 特点：
 *   - 递归空间分割，结构清晰，适合教学；
 *   - 通过"共享边消解"自然得到结果边界，无需 entry/exit 标记；
 *   - 孔洞由质心 pointInPolygon（nonzero）+ 孔洞边作为分割线共同保证；
 *   - 自相交 subject 暂不完整支持（需额外把 subject 自身边也作分割线，
 *     退化情形较多，建议用 Vatti）。
 *
 * 局限：分割线用无限直线，单元数随分割线数指数增长，仅适合中等规模输入。
 */

import {
    type Point, type Ring, type Polygon, type ClipResult, ClipOp,
    ringCentroid, pointInRing, pointEq,
    normalizeOrientation, polygonToRings, ringsToPolygons, EPS,
} from './types'

/** 有向边子段（结果边界的一段） */
interface Seg { p0: Point; p1: Point }

/** 直线：过点 p0，方向 dir（单位化非必需），法向 n = (-dir.y, dir.x)。
 *  side(v) = dot(n, v - p0)：>0 = front，<0 = back，=0 = on line。 */
interface Line {
    p0: Point
    dir: Point
    n: Point
}

function makeLineFromEdge(a: Point, b: Point): Line {
    const dx = b.x - a.x, dy = b.y - a.y
    const len = Math.hypot(dx, dy) || 1
    const dir = { x: dx / len, y: dy / len }
    return { p0: a, dir, n: { x: -dir.y, y: dir.x } }
}
function lineSide(L: Line, p: Point): number {
    return L.n.x * (p.x - L.p0.x) + L.n.y * (p.y - L.p0.y)
}

/** 线段 a1a2 与直线 L 求交，返回交点或 null（平行/不相交） */
function segLineIntersect(a1: Point, a2: Point, L: Line): Point | null {
    const s1 = lineSide(L, a1)
    const s2 = lineSide(L, a2)
    if (s1 * s2 > 0) return null // 同侧，无交点
    if (s1 === 0 && s2 === 0) return null // 共线，视为无交点（不切）
    const t = s1 / (s1 - s2)
    return { x: a1.x + t * (a2.x - a1.x), y: a1.y + t * (a2.y - a1.y) }
}

/**
 * 把一条简单环按直线 L 切成 front / back 两组环（可能各多条，适用于凹多边形）。
 *  方法：沿边界行走，记录交点；按"前向弧 / 后向弧"配对交点闭合成环。
 *   - 前向弧：从一个交点出发，沿边界走（下一段在 front 侧）直到下一个交点，
 *     两端交点 + 中间 front 顶点 + 两交点间的直线段闭合 = 一个 front ring。
 *   - 后向弧同理。
 *  若环与 L 无交点：整环归到对应侧。
 */
function splitRingByLine(ring: Ring, L: Line): { front: Ring[]; back: Ring[] } {
    const n = ring.length
    // 收集边界点序列（顶点 + 交点），记录每点的 side 与是否交点
    interface Bp { pt: Point; side: number; isIsect: boolean }
    const bps: Bp[] = []
    for (let i = 0; i < n; i++) {
        const a = ring[i]
        const b = ring[(i + 1) % n]
        const sa = lineSide(L, a)
        bps.push({ pt: a, side: sa, isIsect: false })
        const hit = segLineIntersect(a, b, L)
        if (hit) {
            const sb = lineSide(L, b)
            bps.push({ pt: hit, side: 0, isIsect: true })
            void sb
        }
    }
    const m = bps.length
    const hasIsect = bps.some(p => p.isIsect)
    if (!hasIsect) {
        // 整环在某一侧
        if (bps[0].side >= 0) return { front: [ring], back: [] }
        return { front: [], back: [ring] }
    }

    // 构造 front / back 弧
    const front: Ring[] = []
    const back: Ring[] = []
    // 找第一个交点开始
    let start = bps.findIndex(p => p.isIsect)
    if (start < 0) return { front: [ring], back: [] }
    // 交替收集：从交点出发，走到下一个交点，期间的"非交点"若在 front 侧归 front 弧
    for (let seed = start; seed < start + m; seed++) {
        const p0 = bps[seed % m]
        if (!p0.isIsect) continue
        // 仅当该交点的"下一点"在某侧时，启动一条该侧弧（避免重复配对）
        const next = bps[(seed + 1) % m]
        if (next.side > 0) {
            // front 弧：从 p0 走到下一个交点
            const arc: Point[] = [p0.pt]
            let j = (seed + 1) % m
            while (bps[j].side >= 0 && !bps[j].isIsect) {
                arc.push(bps[j].pt)
                j = (j + 1) % m
                if (j === seed % m) break
            }
            arc.push(bps[j].pt) // 闭合到下一个交点
            // 两条交点之间的直线段隐式闭合（arc 末点与首点都在 L 上）
            front.push(arc)
        } else if (next.side < 0) {
            const arc: Point[] = [p0.pt]
            let j = (seed + 1) % m
            while (bps[j].side <= 0 && !bps[j].isIsect) {
                arc.push(bps[j].pt)
                j = (j + 1) % m
                if (j === seed % m) break
            }
            arc.push(bps[j].pt)
            back.push(arc)
        }
        // next.side === 0（下一点恰在 L 上，罕见）：跳过由该点再启动
    }
    return { front, back }
}

/** 递归：用 lines[li..] 切分 rings，返回叶节点 ring 列表 */
function splitByLines(rings: Ring[], lines: Line[], li: number): Ring[] {
    if (li >= lines.length) return rings
    const L = lines[li]
    let front: Ring[] = []
    let back: Ring[] = []
    for (const r of rings) {
        const { front: f, back: b } = splitRingByLine(r, L)
        front = front.concat(f)
        back = back.concat(b)
    }
    return [
        ...splitByLines(front, lines, li + 1),
        ...splitByLines(back, lines, li + 1),
    ]
}

/**
 * BSP 主入口。
 */
export function bspClip(subject: Polygon, clip: Polygon, op: ClipOp): ClipResult {
    const sPoly = normalizeOrientation(subject, true)
    const cPoly = normalizeOrientation(clip, true)
    const sRings = polygonToRings(sPoly)
    const cRings = polygonToRings(cPoly)

    // ── 1. 构造分割线：clip 所有边 + subject 孔洞边 ──
    // （孔洞边作分割线，防止单元跨越孔洞导致质心误判）
    const lines: Line[] = []
    const addRingLines = (r: Ring) => {
        const n = r.length
        for (let i = 0; i < n; i++) {
            lines.push(makeLineFromEdge(r[i], r[(i + 1) % n]))
        }
    }
    for (const r of cRings) addRingLines(r)
    // subject 孔洞边（外环自身在 splitRingByLine 中作为环被切，这里不重复）
    for (const h of sPoly.holes) addRingLines(h)

    // ── 2. 用分割线递归切分 subject 外环 ──
    // （孔洞通过质心 pointInPolygon 判定，不参与切分环本身）
    const cells = splitByLines([sPoly.outer], lines, 0)
    if (cells.length === 0) {
        return handleNoIntersection(sPoly, cPoly, op)
    }

    // ── 3. 分类每个叶单元 ──
    const keptCells: Ring[] = []
    for (const cell of cells) {
        const c = ringCentroid(cell)
        const inS = pointInRing(c, sPoly.outer) && !sPoly.holes.some(h => pointInRing(c, h))
        const inC = pointInRing(c, cPoly.outer) && !cPoly.holes.some(h => pointInRing(c, h))
        let keep = false
        switch (op) {
            case ClipOp.Union: keep = inS || inC; break
            case ClipOp.Intersect: keep = inS && inC; break
            case ClipOp.Difference: keep = inS && !inC; break
            case ClipOp.Xor: keep = inS !== inC; break
        }
        if (keep) keptCells.push(cell)
    }

    if (keptCells.length === 0) {
        return handleNoIntersection(sPoly, cPoly, op)
    }

    // ── 4. 消解共享边 + 追踪闭合环 ──
    const segs = collectAndDissolve(keptCells)
    if (segs.length === 0) {
        return handleNoIntersection(sPoly, cPoly, op)
    }
    const rings = traceRings(segs)
    if (rings.length === 0) {
        return handleNoIntersection(sPoly, cPoly, op)
    }
    return ringsToPolygons(rings)
}

/** 收集所有单元的有向边；出现两次（反向）的边视为内部边删除，返回剩余边界边。 */
function collectAndDissolve(cells: Ring[]): Seg[] {
    // 用容差匹配键
    const key = (p: Point): string =>
        `${p.x.toFixed(5)}|${p.y.toFixed(5)}`
    const map = new Map<string, Seg[]>()
    for (const cell of cells) {
        const n = cell.length
        for (let i = 0; i < n; i++) {
            const a = cell[i], b = cell[(i + 1) % n]
            const seg: Seg = { p0: a, p1: b }
            const k = `${key(a)},${key(b)}`
            const revK = `${key(b)},${key(a)}`
            const rev = map.get(revK)
            if (rev && rev.length > 0) {
                // 与反向边配对 → 内部边，抵消
                rev.pop()
                if (rev.length === 0) map.delete(revK)
            } else {
                const arr = map.get(k) || []
                arr.push(seg)
                map.set(k, arr)
            }
        }
    }
    const out: Seg[] = []
    for (const arr of map.values()) out.push(...arr)
    return out
}

/** 用端点匹配追踪闭合环（与 Vatti 中同名函数逻辑一致） */
function traceRings(segs: Seg[]): Ring[] {
    const rings: Ring[] = []
    const remaining = segs.map(s => ({ p0: s.p0, p1: s.p1, used: false }))
    const matchEnd = (a: Point, b: Point): boolean => pointEq(a, b, 1e-4)
    const maxRounds = remaining.length

    for (let i = 0; i < remaining.length; i++) {
        if (remaining[i].used) continue
        const ring: Point[] = [remaining[i].p0, remaining[i].p1]
        remaining[i].used = true
        let guard = 0
        while (guard++ < maxRounds) {
            const tail = ring[ring.length - 1]
            if (matchEnd(tail, ring[0])) break
            const idx = remaining.findIndex(s => !s.used && matchEnd(s.p0, tail))
            if (idx < 0) break
            remaining[idx].used = true
            ring.push(remaining[idx].p1)
        }
        guard = 0
        while (guard++ < maxRounds) {
            const headPt = ring[0]
            if (matchEnd(ring[ring.length - 1], headPt)) break
            const idx = remaining.findIndex(s => !s.used && matchEnd(s.p1, headPt))
            if (idx < 0) break
            remaining[idx].used = true
            ring.unshift(remaining[idx].p0)
        }
        if (ring.length > 1 && matchEnd(ring[0], ring[ring.length - 1])) ring.pop()
        if (ring.length >= 3) rings.push(ring)
    }
    return rings
}

/** 无交点时的包含关系处理 */
function handleNoIntersection(s: Polygon, c: Polygon, op: ClipOp): ClipResult {
    const result: Polygon[] = []
    const sC = ringCentroid(s.outer)
    const cC = ringCentroid(c.outer)
    let sInC = pointInRing(sC, c.outer) && !c.holes.some(h => pointInRing(sC, h))
    let cInS = pointInRing(cC, s.outer) && !s.holes.some(h => pointInRing(cC, h))

    if (op === ClipOp.Union) {
        if (!sInC) result.push(s)
        if (!cInS) result.push(c)
    } else if (op === ClipOp.Intersect) {
        if (sInC) result.push(s)
        else if (cInS) result.push(c)
    } else if (op === ClipOp.Difference) {
        if (!sInC) result.push(s)
    } else if (op === ClipOp.Xor) {
        if (!sInC) result.push(s)
        if (!cInS) result.push(c)
    }
    return result
}
