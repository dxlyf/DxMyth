/**
 * 多边形裁剪算法公共类型与几何工具。
 *
 * 本目录提供四种经典多边形裁剪算法的独立实现（不依赖曲线段）：
 *   - Weiler-Atherton：进出点标记 + 链表遍历
 *   - Greiner-Hormann：WA 的稳健改进，双链表 + 交点标记
 *   - Vatti：扫描线算法，支持自相交与孔洞
 *   - BSP：二叉空间分割，递归用裁剪边分割多边形
 *
 * 统一数据模型：
 *   - Ring  ：简单闭合环（点数组，首尾不重复，隐式闭合）
 *   - Polygon：外环 + 孔洞环数组，外环 CCW、孔洞 CW（屏幕坐标 y 向下时相反）
 *   - ClipOp：并/交/差/异或
 *
 * 所有算法输入输出均以 Polygon[] 表达，便于处理结果含多个连通分量。
 */

/** 二维点 */
export interface Point {
    x: number
    y: number
}

/** 简单闭合环：点按顺序排列，首尾不重复（最后一条边由末点→首点隐式闭合） */
export type Ring = Point[]

/** 多边形：一个外环 + 0..n 个孔洞环。
 *  方向约定（数学坐标系，y 向上）：外环 CCW（面积>0），孔洞 CW（面积<0）。
 *  屏幕坐标系（y 向下）正好相反，调用方负责归一化时统一即可。 */
export interface Polygon {
    outer: Ring
    holes: Ring[]
}

/** 布尔运算类型 */
export enum ClipOp {
    Union = 'union',           // A ∪ B
    Intersect = 'intersect',   // A ∩ B
    Difference = 'difference', // A - B
    Xor = 'xor',               // A ⊕ B（对称差）
}

/** 裁剪结果：可能产生多个独立多边形 */
export type ClipResult = Polygon[]

/** 通用浮点容差 */
export const EPS = 1e-9

// ── 几何工具 ─────────────────────────────────────────────

export function makePoint(x: number, y: number): Point {
    return { x, y }
}

/** 有符号面积（shoelace）。数学坐标系：>0 = CCW，<0 = CW。 */
export function ringArea(ring: Ring): number {
    let a = 0
    const n = ring.length
    for (let i = 0; i < n; i++) {
        const p = ring[i]
        const q = ring[(i + 1) % n]
        a += p.x * q.y - q.x * p.y
    }
    return a / 2
}

export function isCCW(ring: Ring): boolean {
    return ringArea(ring) > 0
}

/** 反转环方向 */
export function reverseRing(ring: Ring): Ring {
    return ring.slice().reverse()
}

/**
 * 方向归一化：outerCCW=true 时外环强制 CCW、孔洞强制 CW。
 *  屏幕坐标系（y 向下）调用方传 outerCCW=false 即可让外环 CW、孔洞 CCW，
 *  与 Canvas nonzero 填充规则对齐。
 */
export function normalizeOrientation(poly: Polygon, outerCCW = true): Polygon {
    const outer = isCCW(poly.outer) === outerCCW ? poly.outer : reverseRing(poly.outer)
    const holes = poly.holes.map(h => (isCCW(h) === !outerCCW ? h : reverseRing(h)))
    return { outer, holes }
}

/** 两点相等（容差） */
export function pointEq(a: Point, b: Point, eps = EPS): boolean {
    return Math.abs(a.x - b.x) <= eps && Math.abs(a.y - b.y) <= eps
}

/** 线段 p1p2 与 p3p4 求交。
 *  返回 { t1, t2, point } 或 null（不相交/共线）。
 *  t1、t2 ∈ [0,1] 表示交点落在两条线段内部。 */
export function segmentIntersect(
    p1: Point, p2: Point, p3: Point, p4: Point,
): { t1: number; t2: number; point: Point } | null {
    const r = { x: p2.x - p1.x, y: p2.y - p1.y }
    const s = { x: p4.x - p3.x, y: p4.y - p3.y }
    const rxs = r.x * s.y - r.y * s.x
    // 平行或共线
    if (Math.abs(rxs) < EPS) return null
    const qp = { x: p3.x - p1.x, y: p3.y - p1.y }
    const t1 = (qp.x * s.y - qp.y * s.x) / rxs
    const t2 = (qp.x * r.y - qp.y * r.x) / rxs
    if (t1 < -EPS || t1 > 1 + EPS || t2 < -EPS || t2 > 1 + EPS) return null
    return { t1, t2, point: { x: p1.x + t1 * r.x, y: p1.y + t1 * r.y } }
}

/** 射线法判断点是否在环内（even-odd 规则）。
 *  适用于任意方向环。 */
export function pointInRing(p: Point, ring: Ring): boolean {
    let inside = false
    const n = ring.length
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const a = ring[i], b = ring[j]
        const intersect = (a.y > p.y) !== (b.y > p.y) &&
            p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x
        if (intersect) inside = !inside
    }
    return inside
}

/** 有符号环绕数。CCW 环返回 +1，CW 环返回 -1，外部返回 0。 */
export function windingNumber(p: Point, ring: Ring): number {
    let w = 0
    const n = ring.length
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const a = ring[i], b = ring[j]
        if (a.y <= p.y) {
            if (b.y > p.y) {
                if ((b.x - a.x) * (p.y - a.y) - (p.x - a.x) * (b.y - a.y) > 0) w++
            }
        } else {
            if (b.y <= p.y) {
                if ((b.x - a.x) * (p.y - a.y) - (p.x - a.x) * (b.y - a.y) < 0) w--
            }
        }
    }
    return w
}

/** nonzero 规则判断点是否在多边形（外环 + 孔洞）内部 */
export function pointInPolygon(p: Point, poly: Polygon): boolean {
    let w = windingNumber(p, poly.outer)
    for (const h of poly.holes) w += windingNumber(p, h)
    return w !== 0
}

/** 环质心（用于采样嵌套深度判断） */
export function ringCentroid(ring: Ring): Point {
    let cx = 0, cy = 0, area = 0
    const n = ring.length
    for (let i = 0; i < n; i++) {
        const a = ring[i], b = ring[(i + 1) % n]
        const cross = a.x * b.y - b.x * a.y
        cx += (a.x + b.x) * cross
        cy += (a.y + b.y) * cross
        area += cross
    }
    area /= 2
    if (Math.abs(area) < EPS) {
        // 退化（零面积）回退为顶点平均
        let sx = 0, sy = 0
        for (const p of ring) { sx += p.x; sy += p.y }
        return { x: sx / n, y: sy / n }
    }
    return { x: cx / (6 * area), y: cy / (6 * area) }
}

/** 把多边形拆成环数组（外环在前，孔洞在后） */
export function polygonToRings(poly: Polygon): Ring[] {
    return [poly.outer, ...poly.holes]
}

/** 多个环合并为一个 Polygon[]。
 *  用 even-odd 嵌套深度判断：深度为偶数（含 0）的环作为外环，
 *  深度为奇数的环作为其最近外环的孔洞。
 *  调用前应保证方向已归一化（外环与孔洞方向相反）。 */
export function ringsToPolygons(rings: Ring[]): ClipResult {
    if (rings.length === 0) return []
    // 计算每个环的嵌套深度
    const depths = rings.map((r, i) => {
        const c = ringCentroid(r)
        let d = 0
        for (let j = 0; j < rings.length; j++) {
            if (j === i) continue
            if (pointInRing(c, rings[j])) d++
        }
        return d
    })
    const result: ClipResult = []
    const outerRings = rings.filter((_, i) => depths[i] % 2 === 0)
    for (const outer of outerRings) {
        const outerIdx = rings.indexOf(outer)
        const c = ringCentroid(outer)
        const holes: Ring[] = []
        for (let i = 0; i < rings.length; i++) {
            if (i === outerIdx) continue
            // 该环作为本外环孔洞的条件：在本外环内部，且深度 = 本外环深度 + 1
            if (depths[i] === depths[outerIdx] + 1 && pointInRing(c, rings[i])) {
                holes.push(rings[i])
            }
        }
        result.push({ outer, holes })
    }
    return result
}
