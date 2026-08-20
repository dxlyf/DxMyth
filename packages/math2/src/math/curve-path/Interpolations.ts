// ============================================================
// Interpolations — 样条与贝塞尔插值函数（由具体曲线类内部使用）
// 贝塞尔公式参考: https://en.wikipedia.org/wiki/B%C3%A9zier_curve
// ============================================================

/**
 * Catmull-Rom 样条上的点
 * @param t 插值因子
 * @param p0 控制点 0
 * @param p1 控制点 1
 * @param p2 控制点 2
 * @param p3 控制点 3
 */
export function CatmullRom(t: number, p0: number, p1: number, p2: number, p3: number): number {
    const v0 = (p2 - p0) * 0.5
    const v1 = (p3 - p1) * 0.5
    const t2 = t * t
    const t3 = t * t2
    return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1
}

function QuadraticBezierP0(t: number, p: number): number {
    const k = 1 - t
    return k * k * p
}

function QuadraticBezierP1(t: number, p: number): number {
    return 2 * (1 - t) * t * p
}

function QuadraticBezierP2(t: number, p: number): number {
    return t * t * p
}

/**
 * 二次贝塞尔曲线上的点
 * @param t 插值因子
 * @param p0 起点
 * @param p1 控制点
 * @param p2 终点
 */
export function QuadraticBezier(t: number, p0: number, p1: number, p2: number): number {
    return QuadraticBezierP0(t, p0) + QuadraticBezierP1(t, p1) + QuadraticBezierP2(t, p2)
}

function CubicBezierP0(t: number, p: number): number {
    const k = 1 - t
    return k * k * k * p
}

function CubicBezierP1(t: number, p: number): number {
    const k = 1 - t
    return 3 * k * k * t * p
}

function CubicBezierP2(t: number, p: number): number {
    return 3 * (1 - t) * t * t * p
}

function CubicBezierP3(t: number, p: number): number {
    return t * t * t * p
}

/**
 * 三次贝塞尔曲线上的点
 * @param t 插值因子
 * @param p0 起点
 * @param p1 控制点 1
 * @param p2 控制点 2
 * @param p3 终点
 */
export function CubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    return CubicBezierP0(t, p0) + CubicBezierP1(t, p1) + CubicBezierP2(t, p2) + CubicBezierP3(t, p3)
}
