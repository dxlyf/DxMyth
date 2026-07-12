// ============================================================
// BSpline — 均匀三次 B 样条曲线
// 局部支撑性、不穿过控制点、C² 连续，广泛用于 CAD/CAM
// ============================================================

import { type PointLike, Point } from "./Point"
import { BoundingRect } from './BoundingRect'
import { clamp } from './MathUtils'

/**
 * 计算均匀三次 B 样条基函数值
 * 三次 B 样条的 4 个基函数（均匀节点向量，局部参数 u ∈ [0,1]）：
 *
 *   N0(u) = (1-u)³ / 6
 *   N1(u) = (3u³ - 6u² + 4) / 6
 *   N2(u) = (-3u³ + 3u² + 3u + 1) / 6
 *   N3(u) = u³ / 6
 */
export function getBSplineBasis(u: number): [number, number, number, number] {
    const u2 = u * u
    const u3 = u2 * u
    const inv6 = 1 / 6
    return [
        inv6 * (1 - 3 * u + 3 * u2 - u3),
        inv6 * (4 - 6 * u2 + 3 * u3),
        inv6 * (1 + 3 * u + 3 * u2 - 3 * u3),
        inv6 * u3,
    ]
}

/**
 * 计算均匀三次 B 样条基函数的一阶导数
 */
export function getBSplineBasisDerivative(u: number): [number, number, number, number] {
    const u2 = u * u
    const inv6 = 1 / 6
    return [
        inv6 * (-3 + 6 * u - 3 * u2),
        inv6 * (-12 * u + 9 * u2),
        inv6 * (3 + 6 * u - 9 * u2),
        inv6 * (3 * u2),
    ]
}

/**
 * 计算均匀三次 B 样条段上参数 u 处的点
 * @param u  - 段内参数 ∈ [0, 1]
 * @param p0 - 控制点 0
 * @param p1 - 控制点 1（段起点附近）
 * @param p2 - 控制点 2（段终点附近）
 * @param p3 - 控制点 3
 */
export function getBSplineEvaluate(
    u: number,
    p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike
): PointLike {
    const [b0, b1, b2, b3] = getBSplineBasis(u)
    return Point.create(
        b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
        b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y
    )
}

/**
 * 计算均匀三次 B 样条段在 u 处的一阶导数
 */
export function getBSplineDerivative(
    u: number,
    p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike
): PointLike {
    const [b0, b1, b2, b3] = getBSplineBasisDerivative(u)
    return Point.create(
        b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
        b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y
    )
}

/**
 * 计算均匀三次 B 样条段的边界框
 */
export function getBSplineSegmentBounds(
    p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike
): BoundingRect {
    // 采样足够多的点获取紧凑包围盒
    const points: PointLike[] = [p1, p2]
    const samples = 16
    for (let i = 1; i < samples; i++) {
        const u = i / samples
        points.push(getBSplineEvaluate(u, p0, p1, p2, p3))
    }
    return BoundingRect.default().fromPoints(points)
}

export class BSpline {
    /** 控制点序列（至少 4 个点） */
    points: PointLike[]

    constructor(points: PointLike[]) {
        this.points = points.map(p => ({ x: p.x, y: p.y }))
    }

    /** 段数 */
    get segmentCount(): number {
        return Math.max(0, this.points.length - 3)
    }

    /** 将全局参数 t∈[0,1] 映射到段索引和段内参数 */
    private _toSegment(t: number): { seg: number; localU: number } {
        const n = this.segmentCount
        if (n === 0) return { seg: 0, localU: 0 }
        const scaled = clamp(t, 0, 1) * n
        const seg = Math.min(Math.floor(scaled), n - 1)
        const localU = scaled - seg
        return { seg, localU }
    }

    /** 计算曲线上参数 t∈[0,1] 处的点 */
    evaluate(t: number): PointLike {
        const { seg, localU } = this._toSegment(t)
        const p = this.points
        return getBSplineEvaluate(localU, p[seg], p[seg + 1], p[seg + 2], p[seg + 3])
    }

    /** 计算曲线在 t 处的一阶导数（切向量） */
    derivative(t: number): PointLike {
        const { seg, localU } = this._toSegment(t)
        const p = this.points
        return getBSplineDerivative(localU, p[seg], p[seg + 1], p[seg + 2], p[seg + 3])
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
        if (n === 0) return rect
        for (let i = 0; i < n; i++) {
            const segBounds = getBSplineSegmentBounds(
                this.points[i], this.points[i + 1], this.points[i + 2], this.points[i + 3]
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
     */
    flatten(epsilon: number = 0.5): PointLike[] {
        const result: PointLike[] = []
        const n = this.segmentCount
        if (n === 0) return result

        for (let seg = 0; seg < n; seg++) {
            const p0 = this.points[seg]
            const p1 = this.points[seg + 1]
            const p2 = this.points[seg + 2]
            const p3 = this.points[seg + 3]
            if (seg === 0) result.push(getBSplineEvaluate(0, p0, p1, p2, p3))
            this._flattenSegment(p0, p1, p2, p3, epsilon, result)
        }
        return result
    }

    private _flattenSegment(
        p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike,
        epsilon: number, out: PointLike[]
    ): void {
        const subdivide = (t0: number, t1: number, a: PointLike) => {
            const tm = (t0 + t1) * 0.5
            const mid = getBSplineEvaluate(tm, p0, p1, p2, p3)
            const b = getBSplineEvaluate(t1, p0, p1, p2, p3)
            const dx = b.x - a.x
            const dy = b.y - a.y
            const len2 = dx * dx + dy * dy
            if (len2 < 1e-20) {
                out.push(b)
                return
            }
            const dist = Math.abs((mid.x - a.x) * dy - (mid.y - a.y) * dx) / Math.sqrt(len2)
            if (dist <= epsilon) {
                out.push(b)
            } else {
                subdivide(t0, tm, a)
                subdivide(tm, t1, mid)
            }
        }
        subdivide(0, 1, getBSplineEvaluate(0, p0, p1, p2, p3))
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
                const u = i / samples
                const pt = getBSplineEvaluate(u, p[seg], p[seg + 1], p[seg + 2], p[seg + 3])
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
                const u = i / samples
                const pt = getBSplineEvaluate(u, p[seg], p[seg + 1], p[seg + 2], p[seg + 3])
                const dx = pt.x - px
                const dy = pt.y - py
                const d2 = dx * dx + dy * dy
                if (d2 < minDist2) {
                    minDist2 = d2
                    bestT = (seg + u) / n
                }
            }
        }
        return this.evaluate(bestT)
    }
}
