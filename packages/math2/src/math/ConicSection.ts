// ============================================================
// ConicSection — 圆锥曲线（椭圆、抛物线、双曲线）
// 由焦点-准线定义: 离心率 e 决定曲线类型
//   e < 1: 椭圆 (e=0 退化为圆)
//   e = 1: 抛物线
//   e > 1: 双曲线
// ============================================================

import { type PointLike, Point } from "./Point"
import { BoundingRect } from './BoundingRect'
import { clamp } from './MathUtils'

/** 圆锥曲线类型 */
export enum ConicType {
    Ellipse = 0,    // 椭圆 (e < 1)
    Parabola = 1,   // 抛物线 (e = 1)
    Hyperbola = 2,  // 双曲线 (e > 1)
}

/**
 * 根据离心率判断圆锥曲线类型
 */
export function getConicType(e: number): ConicType {
    if (Math.abs(e - 1) < 1e-10) return ConicType.Parabola
    if (e < 1) return ConicType.Ellipse
    return ConicType.Hyperbola
}

// ============================================================
// 椭圆曲线（标准形式: x²/a² + y²/b² = 1）
// ============================================================

/**
 * 计算椭圆上参数 t∈[0, 2π) 处的点
 * @param t - 角度参数
 * @param a - 半长轴
 * @param b - 半短轴
 */
export function getEllipseEvaluate(t: number, a: number, b: number): PointLike {
    return Point.create(a * Math.cos(t), b * Math.sin(t))
}

/**
 * 计算椭圆在 t 处的一阶导数（切向量）
 */
export function getEllipseDerivative(t: number, a: number, b: number): PointLike {
    return Point.create(-a * Math.sin(t), b * Math.cos(t))
}

/**
 * 计算椭圆的周长（Ramanujan 近似公式，精度极高）
 */
export function getEllipsePerimeter(a: number, b: number): number {
    if (a === b) return 2 * Math.PI * a
    const h = ((a - b) / (a + b)) ** 2
    return Math.PI * (a + b) * (1 + 3 * h / (10 + Math.sqrt(4 - 3 * h)))
}

/**
 * 计算椭圆的面积
 */
export function getEllipseArea(a: number, b: number): number {
    return Math.PI * a * b
}

/**
 * 计算椭圆的边界框
 */
export function getEllipseBounds(a: number, b: number): BoundingRect {
    return BoundingRect.fromLTRB(-a, -b, a, b)
}

/**
 * 判断点是否在椭圆内部
 */
export function isPointInEllipse(px: number, py: number, a: number, b: number): boolean {
    const nx = px / a
    const ny = py / b
    return nx * nx + ny * ny <= 1
}

/**
 * 计算点到椭圆的最小距离
 * 使用迭代法求解
 */
export function getDistanceToEllipse(
    px: number, py: number, a: number, b: number,
    iterations: number = 8
): number {
    // 归一化到第一象限
    const absX = Math.abs(px)
    const absY = Math.abs(py)
    const aa = Math.max(a, b)
    const bb = Math.min(a, b)

    if (absY === 0) {
        // 点在 x 轴上
        return Math.abs(absX - aa)
    }

    // Newton 迭代求最近点参数 t
    let t = Math.atan2(absY * aa, absX * bb) // 初始猜测
    for (let i = 0; i < iterations; i++) {
        const cosT = Math.cos(t)
        const sinT = Math.sin(t)
        // 椭圆上的点
        const ex = aa * cosT
        const ey = bb * sinT
        // 梯度
        const rx = aa * aa * (ex - absX)
        const ry = bb * bb * (ey - absY)
        const q = (ex - absX) * rx + (ey - absY) * ry
        const p = rx * rx + ry * ry
        if (Math.abs(q) < 1e-12 || Math.abs(p) < 1e-12) break
        t -= q / p
        t = clamp(t, 0, Math.PI / 2)
    }

    const cosT = Math.cos(t)
    const sinT = Math.sin(t)
    const ex = aa * cosT
    const ey = bb * sinT
    const dx = ex - absX
    const dy = ey - absY
    return Math.sqrt(dx * dx + dy * dy)
}

// ============================================================
// 抛物线（标准形式: y² = 4px，焦点在 (p, 0)，准线 x = -p）
// ============================================================

/**
 * 计算抛物线上参数 t 处的点
 * 参数化: x = p·t², y = 2p·t
 * @param t - 参数（t=0 为顶点）
 * @param p - 焦点到顶点的距离
 */
export function getParabolaEvaluate(t: number, p: number): PointLike {
    return Point.create(p * t * t, 2 * p * t)
}

/**
 * 计算抛物线在 t 处的一阶导数
 */
export function getParabolaDerivative(t: number, p: number): PointLike {
    return Point.create(2 * p * t, 2 * p)
}

/**
 * 计算抛物线在 t1 到 t2 之间的弧长
 */
export function getParabolaArcLength(t1: number, t2: number, p: number): number {
    // x = p·t², dx/dt = 2p·t; y = 2p·t, dy/dt = 2p
    // ds/dt = sqrt((2pt)² + (2p)²) = 2p·sqrt(t² + 1)
    // 积分: p·(t·sqrt(t²+1) + ln(t + sqrt(t²+1)))
    const integrate = (t: number): number => {
        const sq = Math.sqrt(t * t + 1)
        return p * (t * sq + Math.log(t + sq))
    }
    return Math.abs(integrate(t2) - integrate(t1))
}

/**
 * 计算点到抛物线的最小距离
 * 采样 + Newton 精炼
 */
export function getDistanceToParabola(
    px: number, py: number, p: number,
    samples: number = 32, iterations: number = 8
): number {
    // 采样范围：根据点位置估计
    const tMax = Math.sqrt(Math.abs(px) / Math.max(Math.abs(p), 1e-6)) + 1
    let bestT = 0
    let minDist2 = Infinity

    for (let i = 0; i <= samples; i++) {
        const t = (2 * tMax * i / samples) - tMax
        const x = p * t * t
        const y = 2 * p * t
        const dx = x - px
        const dy = y - py
        const d2 = dx * dx + dy * dy
        if (d2 < minDist2) {
            minDist2 = d2
            bestT = t
        }
    }

    // Newton 精炼: f(t) = (P(t) - P) · P'(t) = 0
    let t = bestT
    for (let i = 0; i < iterations; i++) {
        const x = p * t * t - px
        const y = 2 * p * t - py
        const dx = 2 * p * t   // P'(t).x
        const dy = 2 * p       // P'(t).y
        const ddx = 2 * p      // P''(t).x
        const ddy = 0          // P''(t).y
        const ft = x * dx + y * dy
        const ft2 = dx * dx + dy * dy + x * ddx + y * ddy
        if (Math.abs(ft2) < 1e-15) break
        t = t - ft / ft2
    }

    const x = p * t * t - px
    const y = 2 * p * t - py
    const d2 = x * x + y * y
    if (d2 < minDist2) minDist2 = d2
    return Math.sqrt(minDist2)
}

// ============================================================
// 双曲线（标准形式: x²/a² - y²/b² = 1）
// ============================================================

/**
 * 计算双曲线上参数 t 处的点
 * 参数化: x = a·cosh(t), y = b·sinh(t)（右支）
 * @param t - 参数（t=0 为顶点）
 * @param a - 半实轴
 * @param b - 半虚轴
 * @param branch - 1=右支, -1=左支
 */
export function getHyperbolaEvaluate(
    t: number, a: number, b: number, branch: number = 1
): PointLike {
    return Point.create(branch * a * Math.cosh(t), b * Math.sinh(t))
}

/**
 * 计算双曲线在 t 处的一阶导数
 */
export function getHyperbolaDerivative(
    t: number, a: number, b: number, branch: number = 1
): PointLike {
    return Point.create(branch * a * Math.sinh(t), b * Math.cosh(t))
}

/**
 * 计算双曲线的渐近线斜率
 */
export function getHyperbolaAsymptoteSlope(a: number, b: number): number {
    return b / a
}

/**
 * 计算双曲线的离心率
 */
export function getHyperbolaEccentricity(a: number, b: number): number {
    return Math.sqrt(1 + (b * b) / (a * a))
}

/**
 * 计算双曲线的焦点位置
 */
export function getHyperbolaFoci(a: number, b: number): [PointLike, PointLike] {
    const c = Math.sqrt(a * a + b * b)
    return [{ x: -c, y: 0 }, { x: c, y: 0 }]
}

/**
 * 判断点是否在双曲线内部（右支与渐近线围成的区域）
 */
export function isPointInHyperbola(
    px: number, py: number, a: number, b: number
): boolean {
    const nx = px / a
    const ny = py / b
    return nx * nx - ny * ny >= 1
}

// ============================================================
// 通用圆锥曲线类（基于焦点-准线定义）
// ============================================================

export class ConicSection {
    /** 离心率 */
    eccentricity: number
    /** 焦点距离（半长轴或半实轴） */
    a: number
    /** 半短轴或半虚轴 */
    b: number
    /** 曲线类型 */
    type: ConicType

    constructor(eccentricity: number, a: number, b: number) {
        this.eccentricity = eccentricity
        this.a = a
        this.b = b
        this.type = getConicType(eccentricity)
    }

    /** 创建椭圆 */
    static ellipse(a: number, b: number): ConicSection {
        const e = a === b ? 0 : Math.sqrt(1 - (b * b) / (a * a))
        return new ConicSection(e, a, b)
    }

    /** 创建抛物线 */
    static parabola(p: number): ConicSection {
        return new ConicSection(1, p, 0)
    }

    /** 创建双曲线 */
    static hyperbola(a: number, b: number): ConicSection {
        const e = Math.sqrt(1 + (b * b) / (a * a))
        return new ConicSection(e, a, b)
    }

    /** 计算曲线上参数 t 处的点 */
    evaluate(t: number): PointLike {
        switch (this.type) {
            case ConicType.Ellipse:
                return getEllipseEvaluate(t, this.a, this.b)
            case ConicType.Parabola:
                return getParabolaEvaluate(t, this.a)
            case ConicType.Hyperbola:
                return getHyperbolaEvaluate(t, this.a, this.b)
        }
    }

    /** 计算曲线在 t 处的一阶导数 */
    derivative(t: number): PointLike {
        switch (this.type) {
            case ConicType.Ellipse:
                return getEllipseDerivative(t, this.a, this.b)
            case ConicType.Parabola:
                return getParabolaDerivative(t, this.a)
            case ConicType.Hyperbola:
                return getHyperbolaDerivative(t, this.a, this.b)
        }
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
        switch (this.type) {
            case ConicType.Ellipse:
                return getEllipseBounds(this.a, this.b)
            case ConicType.Parabola:
                // 抛物线无界，返回有限范围的近似包围盒
                return BoundingRect.fromLTRB(0, -100, 100, 100)
            case ConicType.Hyperbola:
                // 双曲线无界
                return BoundingRect.fromLTRB(this.a, -100, 100, 100)
        }
    }

    /** 计算点到曲线的最小距离 */
    distanceTo(px: number, py: number): number {
        switch (this.type) {
            case ConicType.Ellipse:
                return getDistanceToEllipse(px, py, this.a, this.b)
            case ConicType.Parabola:
                return getDistanceToParabola(px, py, this.a)
            case ConicType.Hyperbola:
                // 采样法
                {
                    let minDist2 = Infinity
                    for (let i = -20; i <= 20; i++) {
                        const t = i * 0.5
                        const p = this.evaluate(t)
                        const dx = p.x - px
                        const dy = p.y - py
                        const d2 = dx * dx + dy * dy
                        if (d2 < minDist2) minDist2 = d2
                    }
                    return Math.sqrt(minDist2)
                }
        }
    }

    /**
     * 将曲线扁平化为线段序列
     * @param epsilon - 近似误差容限（默认 0.5）
     * @param range   - 参数范围 [tMin, tMax]（默认根据曲线类型自动）
     */
    flatten(epsilon: number = 0.5, range?: [number, number]): PointLike[] {
        const [tMin, tMax] = range ?? this._defaultRange()
        const result: PointLike[] = []
        const samples = 64
        const pts: PointLike[] = []
        for (let i = 0; i <= samples; i++) {
            const t = tMin + (tMax - tMin) * i / samples
            pts.push(this.evaluate(t))
        }

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

    private _defaultRange(): [number, number] {
        switch (this.type) {
            case ConicType.Ellipse:
                return [0, 2 * Math.PI]
            case ConicType.Parabola:
                return [-5, 5]
            case ConicType.Hyperbola:
                return [-3, 3]
        }
    }
}
