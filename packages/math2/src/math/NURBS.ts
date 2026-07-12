// ============================================================
// NURBS — 非均匀有理 B 样条曲线
// 最通用的参数曲线表示，可精确表示圆锥曲线，广泛用于 CAD/工业建模
// ============================================================

import { type PointLike, Point } from "./Point"
import { BoundingRect } from './BoundingRect'
import { clamp } from './MathUtils'

/**
 * 计算 Cox-de Boor 递归 B 样条基函数
 *
 * N_{i,1}(u) = 1 if knot[i] <= u < knot[i+1], else 0
 * N_{i,p}(u) = (u - knot[i]) / (knot[i+p] - knot[i]) * N_{i,p-1}(u)
 *            + (knot[i+p+1] - u) / (knot[i+p+1] - knot[i+1]) * N_{i+1,p-1}(u)
 *
 * @param i  - 基函数索引
 * @param p  - 次数（degree）
 * @param u  - 参数值
 * @param knots - 节点向量（非递减序列）
 */
export function getBSplineBasisValue(
    i: number, p: number, u: number, knots: number[]
): number {
    if (p === 0) {
        // 阶数 0 的基函数：区间内为 1
        if (u >= knots[i] && u < knots[i + 1]) return 1
        // 最后一个区间包含右端点
        if (u === knots[knots.length - 1] && i === knots.length - 2) return 1
        return 0
    }

    let result = 0

    // 左半部分
    const denom1 = knots[i + p] - knots[i]
    if (denom1 > 1e-12) {
        result += (u - knots[i]) / denom1 * getBSplineBasisValue(i, p - 1, u, knots)
    }

    // 右半部分
    const denom2 = knots[i + p + 1] - knots[i + 1]
    if (denom2 > 1e-12) {
        result += (knots[i + p + 1] - u) / denom2 * getBSplineBasisValue(i + 1, p - 1, u, knots)
    }

    return result
}

/**
 * 计算所有基函数值（避免重复递归，动态规划）
 * 返回 N_{i,p}(u) for i = span-p .. span
 *
 * @param span - u 所在的节点区间索引
 * @param p    - 次数
 * @param u    - 参数值
 * @param knots - 节点向量
 * @returns 基函数值数组（长度 p+1）
 */
export function getBSplineBasisValues(
    span: number, p: number, u: number, knots: number[]
): number[] {
    const N: number[] = new Array(p + 1).fill(0)
    N[0] = 1

    // 辅助数组
    const left: number[] = new Array(p + 1)
    const right: number[] = new Array(p + 1)

    for (let j = 1; j <= p; j++) {
        left[j] = u - knots[span + 1 - j]
        right[j] = knots[span + j] - u
        let saved = 0.0
        for (let r = 0; r < j; r++) {
            const temp = N[r] / (right[r + 1] + left[j - r])
            N[r] = saved + right[r + 1] * temp
            saved = left[j - r] * temp
        }
        N[j] = saved
    }

    return N
}

/**
 * 查找参数 u 所在的节点区间索引
 * @returns span 索引，使 knots[span] <= u < knots[span+1]
 */
export function findSpan(
    n: number, p: number, u: number, knots: number[]
): number {
    // 特殊处理：u 在最后一个节点上
    if (u >= knots[n + 1]) return n
    if (u <= knots[p]) return p

    let low = p
    let high = n + 1
    let mid = Math.floor((low + high) / 2)

    while (u < knots[mid] || u >= knots[mid + 1]) {
        if (u < knots[mid]) {
            high = mid
        } else {
            low = mid
        }
        mid = Math.floor((low + high) / 2)
    }

    return mid
}

/**
 * 生成 clamped（两端重复度为 p+1）的均匀节点向量
 * @param n        - 控制点数 - 1
 * @param p        - 次数
 * @returns 节点向量数组（长度 n+p+2）
 */
export function generateClampedKnots(n: number, p: number): number[] {
    const knots: number[] = new Array(n + p + 2)
    // 前 p+1 个为 0
    for (let i = 0; i <= p; i++) knots[i] = 0
    // 中间均匀分布
    const m = n - p
    for (let i = 1; i <= m; i++) knots[p + i] = i / (m + 1)
    // 后 p+1 个为 1
    for (let i = n + 1; i <= n + p + 1; i++) knots[i] = 1
    return knots
}

/**
 * 计算 NURBS 曲线上参数 u 处的点
 *
 * C(u) = Σ N_{i,p}(u) · w_i · P_i / Σ N_{i,p}(u) · w_i
 *
 * @param u        - 参数 ∈ [0, 1]
 * @param points   - 控制点
 * @param weights  - 权重（与控制点一一对应）
 * @param knots    - 节点向量
 * @param degree   - 次数
 */
export function getNURBSEvaluate(
    u: number,
    points: PointLike[],
    weights: number[],
    knots: number[],
    degree: number
): PointLike {
    const n = points.length - 1
    const span = findSpan(n, degree, u, knots)
    const basis = getBSplineBasisValues(span, degree, u, knots)

    let x = 0, y = 0
    let wSum = 0

    for (let i = 0; i <= degree; i++) {
        const idx = span - degree + i
        const w = weights[idx]
        const nw = basis[i] * w
        x += nw * points[idx].x
        y += nw * points[idx].y
        wSum += nw
    }

    if (wSum === 0) return Point.create(0, 0)
    return Point.create(x / wSum, y / wSum)
}

/**
 * 计算 NURBS 曲线在 u 处的一阶导数
 */
export function getNURBSDerivative(
    u: number,
    points: PointLike[],
    weights: number[],
    knots: number[],
    degree: number
): PointLike {
    const n = points.length - 1
    const span = findSpan(n, degree, u, knots)

    // 计算基函数及其导数
    // 简化：用数值差分
    const eps = 1e-6
    const u0 = clamp(u - eps, 0, 1)
    const u1 = clamp(u + eps, 0, 1)
    const p0 = getNURBSEvaluate(u0, points, weights, knots, degree)
    const p1 = getNURBSEvaluate(u1, points, weights, knots, degree)
    const dt = u1 - u0
    if (dt === 0) return Point.create(0, 0)
    return Point.create((p1.x - p0.x) / dt, (p1.y - p0.y) / dt)
}

export class NURBS {
    /** 控制点 */
    points: PointLike[]
    /** 权重 */
    weights: number[]
    /** 节点向量 */
    knots: number[]
    /** 次数 */
    degree: number

    constructor(
        points: PointLike[],
        weights?: number[],
        knots?: number[],
        degree: number = 3
    ) {
        this.points = points.map(p => ({ x: p.x, y: p.y }))
        this.weights = weights ?? new Array(points.length).fill(1)
        this.degree = degree
        if (knots) {
            this.knots = knots
        } else {
            this.knots = generateClampedKnots(points.length - 1, degree)
        }
    }

    /** 计算曲线上参数 u∈[0,1] 处的点 */
    evaluate(u: number): PointLike {
        return getNURBSEvaluate(u, this.points, this.weights, this.knots, this.degree)
    }

    /** 计算曲线在 u 处的一阶导数 */
    derivative(u: number): PointLike {
        return getNURBSDerivative(u, this.points, this.weights, this.knots, this.degree)
    }

    /** 计算曲线在 u 处的法向量 */
    normal(u: number): PointLike {
        const d = this.derivative(u)
        const len = Math.sqrt(d.x * d.x + d.y * d.y)
        if (len === 0) return { x: 0, y: 0 }
        return { x: -d.y / len, y: d.x / len }
    }

    /** 获取边界框（采样法） */
    getBounds(samples: number = 50): BoundingRect {
        const rect = BoundingRect.default()
        for (let i = 0; i <= samples; i++) {
            const u = i / samples
            const p = this.evaluate(u)
            rect.add(p.x, p.y)
        }
        return rect
    }

    /**
     * 将曲线扁平化为线段序列
     * @param epsilon - 近似误差容限（默认 0.5）
     * @param samples - 初始采样数（默认 32）
     */
    flatten(epsilon: number = 0.5, samples: number = 32): PointLike[] {
        const result: PointLike[] = []
        // 先采样
        const pts: PointLike[] = []
        for (let i = 0; i <= samples; i++) {
            pts.push(this.evaluate(i / samples))
        }

        // 递归细分
        const subdivide = (i0: number, i1: number, a: PointLike) => {
            const im = Math.floor((i0 + i1) / 2)
            if (im === i0 || im === i1) {
                result.push(pts[i1])
                return
            }
            const mid = pts[im]
            const b = pts[i1]
            const dx = b.x - a.x
            const dy = b.y - a.y
            const len2 = dx * dx + dy * dy
            if (len2 < 1e-20) {
                result.push(b)
                return
            }
            const dist = Math.abs((mid.x - a.x) * dy - (mid.y - a.y) * dx) / Math.sqrt(len2)
            if (dist <= epsilon) {
                result.push(b)
            } else {
                subdivide(i0, im, a)
                subdivide(im, i1, mid)
            }
        }

        result.push(pts[0])
        for (let i = 1; i < pts.length; i++) {
            subdivide(i - 1, i, pts[i - 1])
        }
        return result
    }

    /**
     * 计算点到曲线的最小距离
     * @param samples - 采样数（默认 50）
     */
    distanceTo(px: number, py: number, samples: number = 50): number {
        let minDist2 = Infinity
        for (let i = 0; i <= samples; i++) {
            const p = this.evaluate(i / samples)
            const dx = p.x - px
            const dy = p.y - py
            const d2 = dx * dx + dy * dy
            if (d2 < minDist2) minDist2 = d2
        }
        return Math.sqrt(minDist2)
    }

    /**
     * 计算点在曲线上的投影点（最近点）
     * @param samples - 采样数（默认 50）
     */
    projectPoint(px: number, py: number, samples: number = 50): PointLike {
        let bestU = 0
        let minDist2 = Infinity
        for (let i = 0; i <= samples; i++) {
            const u = i / samples
            const p = this.evaluate(u)
            const dx = p.x - px
            const dy = p.y - py
            const d2 = dx * dx + dy * dy
            if (d2 < minDist2) {
                minDist2 = d2
                bestU = u
            }
        }

        // Newton 精炼
        const eps = 1e-4
        let u = bestU
        for (let iter = 0; iter < 8; iter++) {
            const p = this.evaluate(u)
            const d = this.derivative(u)
            const fx = p.x - px, fy = p.y - py
            const ft = fx * d.x + fy * d.y
            const ft2 = d.x * d.x + d.y * d.y
            if (Math.abs(ft2) < 1e-15) break
            u = u - ft / ft2
            u = clamp(u, 0, 1)
        }

        return this.evaluate(u)
    }
}
