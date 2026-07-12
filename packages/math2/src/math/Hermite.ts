// ============================================================
// Hermite — 三次 Hermite 样条曲线
// 由端点位置和切线定义，常用于插值和形状控制
// ============================================================

import { type PointLike, Point } from "./Point"
import { BoundingRect } from './BoundingRect'

/**
 * 计算三次 Hermite 样条上参数 t 处的点
 *
 * H(t) = (2t³-3t²+1)·P0 + (t³-2t²+t)·m0 + (-2t³+3t²)·P1 + (t³-t²)·m1
 *
 * @param t  - 参数 ∈ [0, 1]
 * @param p0 - 起点
 * @param p1 - 终点
 * @param m0 - 起点切向量
 * @param m1 - 终点切向量
 */
export function getHermiteEvaluate(
    t: number,
    p0: PointLike, p1: PointLike,
    m0: PointLike, m1: PointLike
): PointLike {
    const t2 = t * t
    const t3 = t2 * t

    // Hermite 基函数
    const h00 = 2 * t3 - 3 * t2 + 1
    const h10 = t3 - 2 * t2 + t
    const h01 = -2 * t3 + 3 * t2
    const h11 = t3 - t2

    return Point.create(
        h00 * p0.x + h10 * m0.x + h01 * p1.x + h11 * m1.x,
        h00 * p0.y + h10 * m0.y + h01 * p1.y + h11 * m1.y
    )
}

/**
 * 计算三次 Hermite 样条在 t 处的一阶导数
 */
export function getHermiteDerivative(
    t: number,
    p0: PointLike, p1: PointLike,
    m0: PointLike, m1: PointLike
): PointLike {
    const t2 = t * t

    // 基函数的导数
    const h00 = 6 * t2 - 6 * t
    const h10 = 3 * t2 - 4 * t + 1
    const h01 = -6 * t2 + 6 * t
    const h11 = 3 * t2 - 2 * t

    return Point.create(
        h00 * p0.x + h10 * m0.x + h01 * p1.x + h11 * m1.x,
        h00 * p0.y + h10 * m0.y + h01 * p1.y + h11 * m1.y
    )
}

/**
 * 计算三次 Hermite 样条在 t 处的二阶导数
 */
export function getHermiteSecondDerivative(
    t: number,
    p0: PointLike, p1: PointLike,
    m0: PointLike, m1: PointLike
): PointLike {
    // 基函数的二阶导数
    const h00 = 12 * t - 6
    const h10 = 6 * t - 4
    const h01 = -12 * t + 6
    const h11 = 6 * t - 2

    return Point.create(
        h00 * p0.x + h10 * m0.x + h01 * p1.x + h11 * m1.x,
        h00 * p0.y + h10 * m0.y + h01 * p1.y + h11 * m1.y
    )
}

/**
 * 获取三次 Hermite 样条的极值 t 值
 * 对导数的 x、y 分量分别求解二次方程
 */
export function getHermiteExtremaRoots(
    p0: PointLike, p1: PointLike,
    m0: PointLike, m1: PointLike
): number[] {
    const roots: number[] = []

    // 导数: 6t²·(2P0-m0-2P1+m1) + 2t·(-6P0+3m0+3P1-m1) + (-4P0+m0+2P1)
    // 整理为 at² + bt + c
    const ax = 12 * p0.x - 6 * m0.x - 12 * p1.x + 6 * m1.x
    const bx = -6 * p0.x + 3 * m0.x + 6 * p1.x - 2 * m1.x
    const cx = -4 * p0.x + m0.x + 2 * p1.x

    // 实际导数为 at² + bt + c，求解 at² + bt + c = 0
    // 但注意系数应统一，这里用归一化系数
    const solveComponent = (a: number, b: number, c: number) => {
        if (Math.abs(a) < 1e-12) {
            if (Math.abs(b) > 1e-12) {
                const t = -c / b
                if (t > 0 && t < 1) roots.push(t)
            }
            return
        }
        const delta = b * b - 4 * a * c
        if (delta < 0) return
        const sq = Math.sqrt(delta)
        const t1 = (-b - sq) / (2 * a)
        const t2 = (-b + sq) / (2 * a)
        if (t1 > 0 && t1 < 1) roots.push(t1)
        if (t2 > 0 && t2 < 1) roots.push(t2)
    }

    // 导数公式: H'(t) = (6t-6)P0 + (3t²-4t+1)m0 + (-6t+6)P1 + (3t²-2t)m1
    // = (3m0+3m1)·t² + (-6P0-4m0+6P1-2m1)·t + (-6P0+m0+6P1)
    // 简化后:
    const a2x = 3 * m0.x + 3 * m1.x
    const b2x = -6 * p0.x - 4 * m0.x + 6 * p1.x - 2 * m1.x
    const c2x = -6 * p0.x + m0.x + 6 * p1.x
    solveComponent(a2x, b2x, c2x)

    const a2y = 3 * m0.y + 3 * m1.y
    const b2y = -6 * p0.y - 4 * m0.y + 6 * p1.y - 2 * m1.y
    const c2y = -6 * p0.y + m0.y + 6 * p1.y
    solveComponent(a2y, b2y, c2y)

    return roots.sort((a, b) => a - b)
}

/**
 * 计算三次 Hermite 样条的边界框
 */
export function getHermiteBounds(
    p0: PointLike, p1: PointLike,
    m0: PointLike, m1: PointLike
): BoundingRect {
    const extrema = getHermiteExtremaRoots(p0, p1, m0, m1)
    const points: PointLike[] = [p0, p1]
    for (const t of extrema) {
        points.push(getHermiteEvaluate(t, p0, p1, m0, m1))
    }
    return BoundingRect.default().fromPoints(points)
}

/**
 * 将 Hermite 样条转换为三次贝塞尔曲线的控制点
 * B(t) 的 P1 = P0 + m0/3, P2 = P1 - m1/3
 */
export function hermiteToCubicBezier(
    p0: PointLike, p1: PointLike,
    m0: PointLike, m1: PointLike
): [PointLike, PointLike, PointLike, PointLike] {
    return [
        { x: p0.x, y: p0.y },
        { x: p0.x + m0.x / 3, y: p0.y + m0.y / 3 },
        { x: p1.x - m1.x / 3, y: p1.y - m1.y / 3 },
        { x: p1.x, y: p1.y },
    ]
}

export class Hermite {
    /** 起点和终点 */
    p0: PointLike
    p1: PointLike
    /** 起点和终点的切向量 */
    m0: PointLike
    m1: PointLike

    constructor(p0: PointLike, p1: PointLike, m0: PointLike, m1: PointLike) {
        this.p0 = { x: p0.x, y: p0.y }
        this.p1 = { x: p1.x, y: p1.y }
        this.m0 = { x: m0.x, y: m0.y }
        this.m1 = { x: m1.x, y: m1.y }
    }

    /** 计算曲线上参数 t 处的点 */
    evaluate(t: number): PointLike {
        return getHermiteEvaluate(t, this.p0, this.p1, this.m0, this.m1)
    }

    /** 计算曲线在 t 处的一阶导数（切向量） */
    derivative(t: number): PointLike {
        return getHermiteDerivative(t, this.p0, this.p1, this.m0, this.m1)
    }

    /** 计算曲线在 t 处的二阶导数 */
    secondDerivative(t: number): PointLike {
        return getHermiteSecondDerivative(t, this.p0, this.p1, this.m0, this.m1)
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
        return getHermiteBounds(this.p0, this.p1, this.m0, this.m1)
    }

    /**
     * 在参数 t 处分割曲线
     * @returns [左半曲线, 右半曲线]
     */
    split(t: number): [Hermite, Hermite] {
        const p = this.evaluate(t)
        const d = this.derivative(t)
        // 左半: P0→P(t), 切线 m0→P'(t)
        // 右半: P(t)→P1, 切线 P'(t)→m1
        const left = new Hermite(this.p0, p, this.m0, d)
        const right = new Hermite(p, this.p1, d, this.m1)
        return [left, right]
    }

    /**
     * 将曲线扁平化为线段序列
     * @param epsilon - 近似误差容限（默认 0.5）
     */
    flatten(epsilon: number = 0.5): PointLike[] {
        const result: PointLike[] = [{ x: this.p0.x, y: this.p0.y }]
        const subdivide = (t0: number, t1: number, a: PointLike) => {
            const tm = (t0 + t1) * 0.5
            const mid = this.evaluate(tm)
            const b = this.evaluate(t1)
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
                subdivide(t0, tm, a)
                subdivide(tm, t1, mid)
            }
        }
        subdivide(0, 1, this.p0)
        return result
    }

    /**
     * 计算点到曲线的最小距离
     * @param samples - 采样点数（默认 16）
     * @param iterations - Newton 迭代次数（默认 8）
     */
    distanceTo(px: number, py: number, samples: number = 16, iterations: number = 8): number {
        let bestT = 0
        let minDist2 = Infinity

        for (let i = 0; i <= samples; i++) {
            const t = i / samples
            const p = this.evaluate(t)
            const dx = p.x - px
            const dy = p.y - py
            const d2 = dx * dx + dy * dy
            if (d2 < minDist2) {
                minDist2 = d2
                bestT = t
            }
        }

        // Newton 迭代
        let t = bestT
        for (let i = 0; i < iterations; i++) {
            const p = this.evaluate(t)
            const d1 = this.derivative(t)
            const d2 = this.secondDerivative(t)
            const fx = p.x - px, fy = p.y - py
            const ft = fx * d1.x + fy * d1.y
            const ft2 = d1.x * d1.x + d1.y * d1.y + fx * d2.x + fy * d2.y
            if (Math.abs(ft2) < 1e-15) break
            t = t - ft / ft2
            t = Math.max(0, Math.min(1, t))
        }

        const p = this.evaluate(t)
        const dx = p.x - px, dy = p.y - py
        const d2 = dx * dx + dy * dy
        if (d2 < minDist2) minDist2 = d2

        return Math.sqrt(minDist2)
    }

    /**
     * 计算点在曲线上的投影点（最近点）
     * @param samples - 采样点数（默认 16）
     * @param iterations - Newton 迭代次数（默认 8）
     */
    projectPoint(px: number, py: number, samples: number = 16, iterations: number = 8): PointLike {
        let bestT = 0
        let minDist2 = Infinity

        for (let i = 0; i <= samples; i++) {
            const t = i / samples
            const p = this.evaluate(t)
            const dx = p.x - px
            const dy = p.y - py
            const d2 = dx * dx + dy * dy
            if (d2 < minDist2) {
                minDist2 = d2
                bestT = t
            }
        }

        let t = bestT
        for (let i = 0; i < iterations; i++) {
            const p = this.evaluate(t)
            const d1 = this.derivative(t)
            const d2 = this.secondDerivative(t)
            const fx = p.x - px, fy = p.y - py
            const ft = fx * d1.x + fy * d1.y
            const ft2 = d1.x * d1.x + d1.y * d1.y + fx * d2.x + fy * d2.y
            if (Math.abs(ft2) < 1e-15) break
            t = t - ft / ft2
            t = Math.max(0, Math.min(1, t))
        }

        // 检查端点
        const d0x = this.p0.x - px, d0y = this.p0.y - py
        const d1x = this.p1.x - px, d1y = this.p1.y - py
        const d02 = d0x * d0x + d0y * d0y
        const d12 = d1x * d1x + d1y * d1y
        if (d02 < minDist2) { minDist2 = d02; t = 0 }
        if (d12 < minDist2) { t = 1 }

        return this.evaluate(t)
    }
}
