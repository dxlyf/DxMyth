// ============================================================
// CatmullRom — Catmull-Rom 样条曲线
// 过所有控制点的平滑插值曲线，广泛用于路径动画和形状平滑
// ============================================================

import { type PointLike, Point } from "./Point"
import { BoundingRect } from './BoundingRect'
import { clamp } from './MathUtils'

/**
 * 计算 Catmull-Rom 样条段上参数 t 处的点
 * 每段由 4 个控制点 P0 P1 P2 P3 定义，曲线从 P1 到 P2
 *
 * 基矩阵形式：
 *   q(t) = 0.5 * [1  t  t²  t³] * M * [P0  P1  P2  P3]ᵀ
 *
 *   M = |  0   2   0   0 |
 *       | -1   0   1   0 |
 *       |  2  -5   4  -1 |
 *       | -1   3  -3   1 |
 */
export function getCatmullRomEvaluate(
    t: number,
    p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike,
    tension: number = 0.5
): PointLike {
    const t2 = t * t
    const t3 = t2 * t
    const s = 2 - tension * 2  // tension=0.5 → s=1（标准 Catmull-Rom）

    // 系数
    const c0 = -s * t3 + 2 * s * t2 - s * t
    const c1 = (2 - s) * t3 + (s - 3) * t2 + 1
    const c2 = (s - 2) * t3 + (3 - 2 * s) * t2 + s * t
    const c3 = s * t3 - s * t2

    return Point.create(
        c0 * p0.x + c1 * p1.x + c2 * p2.x + c3 * p3.x,
        c0 * p0.y + c1 * p1.y + c2 * p2.y + c3 * p3.y
    )
}

/**
 * 计算 Catmull-Rom 样条段在 t 处的一阶导数（切向量）
 */
export function getCatmullRomDerivative(
    t: number,
    p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike,
    tension: number = 0.5
): PointLike {
    const t2 = t * t
    const s = 2 - tension * 2

    const c0 = -3 * s * t2 + 4 * s * t - s
    const c1 = 3 * (2 - s) * t2 + 2 * (s - 3) * t
    const c2 = 3 * (s - 2) * t2 + 2 * (3 - 2 * s) * t + s
    const c3 = 3 * s * t2 - 2 * s * t

    return Point.create(
        c0 * p0.x + c1 * p1.x + c2 * p2.x + c3 * p3.x,
        c0 * p0.y + c1 * p1.y + c2 * p2.y + c3 * p3.y
    )
}

/**
 * 获取 Catmull-Rom 样条段的极值 t 值
 * 对导数的 x、y 分量分别求解二次方程
 */
export function getCatmullRomExtremaRoots(
    p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike,
    tension: number = 0.5
): number[] {
    const s = 2 - tension * 2
    const roots: number[] = []

    // 导数为二次多项式: at² + bt + c
    // a = -3s, b = 4s, c = -s → 对 P0
    // a = 3(2-s), b = 2(s-3), c = 0 → 对 P1
    // a = 3(s-2), b = 2(3-2s), c = s → 对 P2
    // a = 3s, b = -2s, c = 0 → 对 P3
    // 合并后:
    const ax = -3 * s * p0.x + 3 * (2 - s) * p1.x + 3 * (s - 2) * p2.x + 3 * s * p3.x
    const bx = 4 * s * p0.x + 2 * (s - 3) * p1.x + 2 * (3 - 2 * s) * p2.x - 2 * s * p3.x
    const cx = -s * p0.x + s * p2.x

    if (Math.abs(ax) < 1e-12) {
        if (Math.abs(bx) > 1e-12) {
            const t = -cx / bx
            if (t > 0 && t < 1) roots.push(t)
        }
    } else {
        const delta = bx * bx - 4 * ax * cx
        if (delta >= 0) {
            const sq = Math.sqrt(delta)
            const t1 = (-bx - sq) / (2 * ax)
            const t2 = (-bx + sq) / (2 * ax)
            if (t1 > 0 && t1 < 1) roots.push(t1)
            if (t2 > 0 && t2 < 1) roots.push(t2)
        }
    }

    const ay = -3 * s * p0.y + 3 * (2 - s) * p1.y + 3 * (s - 2) * p2.y + 3 * s * p3.y
    const by = 4 * s * p0.y + 2 * (s - 3) * p1.y + 2 * (3 - 2 * s) * p2.y - 2 * s * p3.y
    const cy = -s * p0.y + s * p2.y

    if (Math.abs(ay) < 1e-12) {
        if (Math.abs(by) > 1e-12) {
            const t = -cy / by
            if (t > 0 && t < 1 && !roots.some(r => Math.abs(r - t) < 1e-6)) roots.push(t)
        }
    } else {
        const delta = by * by - 4 * ay * cy
        if (delta >= 0) {
            const sq = Math.sqrt(delta)
            const t1 = (-by - sq) / (2 * ay)
            const t2 = (-by + sq) / (2 * ay)
            if (t1 > 0 && t1 < 1 && !roots.some(r => Math.abs(r - t1) < 1e-6)) roots.push(t1)
            if (t2 > 0 && t2 < 1 && !roots.some(r => Math.abs(r - t2) < 1e-6)) roots.push(t2)
        }
    }

    return roots.sort((a, b) => a - b)
}

/**
 * 计算 Catmull-Rom 样条段的边界框
 */
export function getCatmullRomBounds(
    p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike,
    tension: number = 0.5
): BoundingRect {
    const extrema = getCatmullRomExtremaRoots(p0, p1, p2, p3, tension)
    const points: PointLike[] = [p1, p2]
    for (const t of extrema) {
        points.push(getCatmullRomEvaluate(t, p0, p1, p2, p3, tension))
    }
    return BoundingRect.default().fromPoints(points)
}

export class CatmullRom {
    /** 控制点序列（至少 2 个点，曲线过 p1..p(n-2)） */
    points: PointLike[]
    /** 张力参数，0.5 为标准 Catmull-Rom，0 为紧致，1 为松弛 */
    tension: number

    constructor(points: PointLike[], tension: number = 0.5) {
        this.points = points.map(p => ({ x: p.x, y: p.y }))
        this.tension = tension
    }

    /** 段数 */
    get segmentCount(): number {
        return Math.max(0, this.points.length - 3)
    }

    /** 将全局参数 t∈[0,1] 映射到段索引和段内参数 */
    private _toSegment(t: number): { seg: number; localT: number } {
        const n = this.segmentCount
        if (n === 0) return { seg: 0, localT: 0 }
        const scaled = clamp(t, 0, 1) * n
        const seg = Math.min(Math.floor(scaled), n - 1)
        const localT = scaled - seg
        return { seg, localT }
    }

    /** 计算曲线上参数 t∈[0,1] 处的点 */
    evaluate(t: number): PointLike {
        const { seg, localT } = this._toSegment(t)
        const p = this.points
        return getCatmullRomEvaluate(localT, p[seg], p[seg + 1], p[seg + 2], p[seg + 3], this.tension)
    }

    /** 计算曲线在 t 处的一阶导数（切向量） */
    derivative(t: number): PointLike {
        const { seg, localT } = this._toSegment(t)
        const p = this.points
        return getCatmullRomDerivative(localT, p[seg], p[seg + 1], p[seg + 2], p[seg + 3], this.tension)
    }

    /** 计算曲线在 t 处的法向量 */
    normal(t: number): PointLike {
        const d = this.derivative(t)
        const len = Math.sqrt(d.x * d.x + d.y * d.y)
        if (len === 0) return { x: 0, y: 0 }
        return { x: -d.y / len, y: d.x / len }
    }

    /** 获取边界框 */
    getBounds(): BoundingRect {
        const rect = BoundingRect.default()
        const n = this.segmentCount
        for (let i = 0; i < n; i++) {
            const segBounds = getCatmullRomBounds(
                this.points[i], this.points[i + 1], this.points[i + 2], this.points[i + 3], this.tension
            )
            if (i === 0) {
                rect.min.x = segBounds.min.x; rect.min.y = segBounds.min.y
                rect.max.x = segBounds.max.x; rect.max.y = segBounds.max.y
            } else {
                rect.min.x = Math.min(rect.min.x, segBounds.min.x)
                rect.min.y = Math.min(rect.min.y, segBounds.min.y)
                rect.max.x = Math.max(rect.max.x, segBounds.max.x)
                rect.max.y = Math.max(rect.max.y, segBounds.max.y)
            }
        }
        return rect
    }

    /**
     * 将曲线扁平化为线段序列
     * @param epsilon - 近似误差容限（默认 0.5）
     * @returns 点序列
     */
    flatten(epsilon: number = 0.5): PointLike[] {
        const result: PointLike[] = []
        const n = this.segmentCount
        if (n === 0) return this.points.length > 0 ? [{ ...this.points[0] }] : result

        for (let seg = 0; seg < n; seg++) {
            const p0 = this.points[seg]
            const p1 = this.points[seg + 1]
            const p2 = this.points[seg + 2]
            const p3 = this.points[seg + 3]
            if (seg === 0) result.push({ x: p1.x, y: p1.y })
            this._flattenSegment(p0, p1, p2, p3, epsilon, result)
        }
        return result
    }

    private _flattenSegment(
        p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike,
        epsilon: number, out: PointLike[]
    ): void {
        const subdivide = (t0: number, t1: number, a: PointLike, b: PointLike) => {
            const tm = (t0 + t1) * 0.5
            const mid = getCatmullRomEvaluate(tm, p0, p1, p2, p3, this.tension)
            const dx = b.x - a.x
            const dy = b.y - a.y
            const len2 = dx * dx + dy * dy
            if (len2 < 1e-20) {
                out.push(b)
                return
            }
            // 中点到弦的距离
            const dist = Math.abs((mid.x - a.x) * dy - (mid.y - a.y) * dx) / Math.sqrt(len2)
            if (dist <= epsilon) {
                out.push(b)
            } else {
                subdivide(t0, tm, a, mid)
                subdivide(tm, t1, mid, b)
            }
        }
        const end = getCatmullRomEvaluate(1, p0, p1, p2, p3, this.tension)
        subdivide(0, 1, p1, end)
    }

    /**
     * 计算点到曲线的最小距离
     * @param samples - 每段采样数（默认 16）
     */
    distanceTo(px: number, py: number, samples: number = 16): number {
        const n = this.segmentCount
        if (n === 0) return Infinity
        let minDist2 = Infinity
        for (let seg = 0; seg < n; seg++) {
            const p = this.points
            for (let i = 0; i <= samples; i++) {
                const t = i / samples
                const pt = getCatmullRomEvaluate(t, p[seg], p[seg + 1], p[seg + 2], p[seg + 3], this.tension)
                const dx = pt.x - px
                const dy = pt.y - py
                const d2 = dx * dx + dy * dy
                if (d2 < minDist2) minDist2 = d2
            }
        }
        return Math.sqrt(minDist2)
    }

    /**
     * 计算点在曲线上的投影点（最近点）
     * @param samples - 每段采样数（默认 16）
     */
    projectPoint(px: number, py: number, samples: number = 16): PointLike {
        const n = this.segmentCount
        if (n === 0) return { x: 0, y: 0 }
        let bestT = 0
        let minDist2 = Infinity
        for (let seg = 0; seg < n; seg++) {
            const p = this.points
            for (let i = 0; i <= samples; i++) {
                const localT = i / samples
                const pt = getCatmullRomEvaluate(localT, p[seg], p[seg + 1], p[seg + 2], p[seg + 3], this.tension)
                const dx = pt.x - px
                const dy = pt.y - py
                const d2 = dx * dx + dy * dy
                if (d2 < minDist2) {
                    minDist2 = d2
                    bestT = (seg + localT) / n
                }
            }
        }
        return this.evaluate(bestT)
    }
}
