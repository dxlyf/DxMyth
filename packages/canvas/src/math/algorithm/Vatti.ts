/**
 * Vatti 扫描线多边形裁剪算法（参考实现）。
 *
 * 通用裁剪算法，能处理带孔洞多边形与自相交。本实现采用 Vatti 的"事件分裂 +
 * 子段分类"核心思想，用更紧凑的方式重构输出：
 *
 *   1. 把 subject / clip 的每条边在所有交点（含与对方边的交点）处分裂成子段，
 *      使每条子段两侧的拓扑（在不在某个多边形内部）保持稳定。
 *   2. 对每条子段采集中点，沿边法向取左右两个近邻采样点，分别计算
 *      (subjWinding, clipWinding) 并依据运算类型判断两侧是否属于"结果内部"。
 *   3. 仅当两侧"结果内部"状态不同（一内一外）时，该子段是结果边界。
 *      方向取"内部在左侧"以保证外环 CCW、孔洞 CW，便于还原。
 *   4. 把所有边界子段按端点配对追踪成闭合环，再按 even-odd 嵌套深度
 *      还原为 Polygon[]（外环 + 孔洞）。
 *
 * 为什么这等价于 Vatti 扫描线：扫描线的本质是找出"事件 y"（顶点/交点），
 * 在两次事件之间边表稳定、可对每段独立分类；本实现直接用所有交点分裂边，
 * 等价于把扫描线停在每对相邻事件之间并分类，省去显式 AEL。
 *
 * 优点：
 *   - 自相交天然被处理（每条边被所有交点分裂，子段独立分类）；
 *   - 孔洞通过方向归一化 + nonzero 规则 + 嵌套深度还原处理；
 *   - 不依赖 entry/exit 标记，退化情形更稳健。
 *
 * 复杂度：交点检测为 O(n²) 全对比较（参考实现，可替换为扫描线 O((n+k)logn)）。
 */

import {
    type Point, type Ring, type Polygon, type ClipResult, ClipOp,
    ringCentroid, pointInRing, segmentIntersect, pointEq,
    normalizeOrientation, polygonToRings, ringsToPolygons, EPS,
} from './types'

/** 有向边子段（结果边界的一段） */
interface Seg {
    p0: Point
    p1: Point
}

/** 计算 (subjWinding, clipWinding) at point p */
function windingAt(p: Point, sRings: Ring[], cRings: Ring[]): [number, number] {
    let sw = 0, cw = 0
    for (const r of sRings) {
        const w = windingLocal(p, r)
        sw += w
    }
    for (const r of cRings) {
        const w = windingLocal(p, r)
        cw += w
    }
    return [sw, cw]
}

/** 单环环绕数（与 types.windingNumber 等价，内联以避免导入冲突） */
function windingLocal(p: Point, ring: Ring): number {
    let w = 0
    const n = ring.length
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const a = ring[i], b = ring[j]
        if (a.y <= p.y) {
            if (b.y > p.y && cross(a, b, p) > 0) w++
        } else {
            if (b.y <= p.y && cross(a, b, p) < 0) w--
        }
    }
    return w
}
function cross(a: Point, b: Point, p: Point): number {
    return (b.x - a.x) * (p.y - a.y) - (p.x - a.x) * (b.y - a.y)
}

/** 判断点是否属于结果内部（依据运算类型与双侧 winding） */
function isInsideResult(sw: number, cw: number, op: ClipOp): boolean {
    const sIn = sw !== 0
    const cIn = cw !== 0
    switch (op) {
        case ClipOp.Union: return sIn || cIn
        case ClipOp.Intersect: return sIn && cIn
        case ClipOp.Difference: return sIn && !cIn
        case ClipOp.Xor: return sIn !== cIn
    }
    return false
}

/**
 * Vatti 主入口。
 */
export function vattiClip(
    subject: Polygon, clip: Polygon, op: ClipOp,
): ClipResult {
    const sPoly = normalizeOrientation(subject, true)
    const cPoly = normalizeOrientation(clip, true)
    const sRings = polygonToRings(sPoly)
    const cRings = polygonToRings(cPoly)

    // ── 1. 求所有环对边交点，把每条边在交点处分裂成子段 ──
    // 同时保留每条子段归属的多边形类型与原始方向。
    interface SubSeg {
        p0: Point; p1: Point
        poly: 0 | 1
        /** 垂直于边方向、指向"右侧"的法向量（用于两侧采样） */
        nx: number; ny: number
    }
    // 先收集原始边（带 poly 与方向）
    interface OrigEdge { a: Point; b: Point; poly: 0 | 1 }
    const origEdges: OrigEdge[] = []
    for (const r of sRings) {
        const n = r.length
        for (let i = 0; i < n; i++) origEdges.push({ a: r[i], b: r[(i + 1) % n], poly: 0 })
    }
    for (const r of cRings) {
        const n = r.length
        for (let i = 0; i < n; i++) origEdges.push({ a: r[i], b: r[(i + 1) % n], poly: 1 })
    }

    // 收集所有交点（按所属原始边分组）
    const isectsByEdge: Map<number, Point[]> = new Map()
    for (let i = 0; i < origEdges.length; i++) {
        for (let j = i + 1; j < origEdges.length; j++) {
            const A = origEdges[i], B = origEdges[j]
            const hit = segmentIntersect(A.a, A.b, B.a, B.b)
            if (!hit) continue
            // 端点容差去重由后续 sort+dedup 处理
            pushIsect(isectsByEdge, i, hit.point)
            pushIsect(isectsByEdge, j, hit.point)
        }
    }
    function pushIsect(m: Map<number, Point[]>, k: number, p: Point) {
        const arr = m.get(k) || []
        // 去重（容差）
        if (!arr.some(q => pointEq(q, p, EPS))) arr.push(p)
        m.set(k, arr)
    }

    // 按参数 t 沿 a→b 排序交点，生成分裂子段
    const subSegs: SubSeg[] = []
    for (let i = 0; i < origEdges.length; i++) {
        const e = origEdges[i]
        const pts = (isectsByEdge.get(i) || []).slice()
        // 按参数 t 沿 a→b 排序
        const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y
        const len2 = dx * dx + dy * dy || 1
        pts.sort((p, q) => {
            const tp = ((p.x - e.a.x) * dx + (p.y - e.a.y) * dy) / len2
            const tq = ((q.x - e.a.x) * dx + (q.y - e.a.y) * dy) / len2
            return tp - tq
        })
        const chain = [e.a, ...pts, e.b]
        // 方向法向量（右侧）：(dy, -dx)/len
        const invLen = 1 / Math.sqrt(len2)
        const nx = dy * invLen
        const ny = -dx * invLen
        for (let k = 0; k < chain.length - 1; k++) {
            const p0 = chain[k], p1 = chain[k + 1]
            if (pointEq(p0, p1, EPS)) continue
            subSegs.push({ p0, p1, poly: e.poly, nx, ny })
        }
    }

    // ── 2. 对每个子段分类：采样子段中点两侧，判断是否为结果边界 ──
    const boundarySegs: Seg[] = []
    for (const ss of subSegs) {
        const mx = (ss.p0.x + ss.p1.x) / 2
        const my = (ss.p0.y + ss.p1.y) / 2
        const off = Math.max(Math.abs(ss.p1.x - ss.p0.x), Math.abs(ss.p1.y - ss.p0.y)) * 1e-3 + 1e-6
        // 两侧采样点（沿法向偏移）
        const left = { x: mx - ss.nx * off, y: my - ss.ny * off }
        const right = { x: mx + ss.nx * off, y: my + ss.ny * off }
        const [slw, scw] = windingAt(left, sRings, cRings)
        const [srw, scwR] = windingAt(right, sRings, cRings)
        const leftIn = isInsideResult(slw, scw, op)
        const rightIn = isInsideResult(srw, scwR, op)
        if (leftIn !== rightIn) {
            // 该子段为结果边界：方向取"内部在左侧"（CCW 外环方向）
            // 这样追踪出的外环自然 CCW、孔洞 CW，便于后续还原。
            const seg: Seg = leftIn
                ? { p0: ss.p0, p1: ss.p1 }
                : { p0: ss.p1, p1: ss.p0 }
            boundarySegs.push(seg)
        }
    }

    if (boundarySegs.length === 0) {
        // 无边界 → 可能完全包含或完全不相交，回退包含处理
        return handleNoIntersection(sPoly, cPoly, op)
    }

    // ── 3. 端点配对追踪成闭合环 ──
    // 用网格索引端点，匹配起始/终止端点相同的段。
    const rings = traceRings(boundarySegs)
    if (rings.length === 0) {
        return handleNoIntersection(sPoly, cPoly, op)
    }

    // ── 4. 还原为 Polygon[]（外环 + 孔洞） ──
    return ringsToPolygons(rings)
}

/** 用端点匹配追踪闭合环。
 *  算法：每条段视为有向边 p0→p1。从任一未用段出发，不断找 p0==当前环尾 p1 的段接上，
 *  同时向前找 p1==环首 p0 的段插到首部，直到环闭合。 */
function traceRings(segs: Seg[]): Ring[] {
    const rings: Ring[] = []
    const remaining = segs.map(s => ({ p0: s.p0, p1: s.p1, used: false }))
    const matchEnd = (a: Point, b: Point): boolean => pointEq(a, b, EPS * 1000 + 1e-6)
    const maxRounds = remaining.length

    for (let i = 0; i < remaining.length; i++) {
        if (remaining[i].used) continue
        const ring: Point[] = [remaining[i].p0, remaining[i].p1]
        remaining[i].used = true
        // 向后延伸
        let guard = 0
        while (guard++ < maxRounds) {
            const tail = ring[ring.length - 1]
            if (matchEnd(tail, ring[0])) break
            const idx = remaining.findIndex(s => !s.used && matchEnd(s.p0, tail))
            if (idx < 0) break
            remaining[idx].used = true
            ring.push(remaining[idx].p1)
        }
        // 向前延伸
        guard = 0
        while (guard++ < maxRounds) {
            const headPt = ring[0]
            if (matchEnd(ring[ring.length - 1], headPt)) break
            const idx = remaining.findIndex(s => !s.used && matchEnd(s.p1, headPt))
            if (idx < 0) break
            remaining[idx].used = true
            ring.unshift(remaining[idx].p0)
        }
        // 去掉与末点重复的首点（闭合）
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
    } else if (op === ClipOp.Xor) {
        if (!sInC) result.push(s)
        if (!cInS) result.push(c)
    }
    return result
}
