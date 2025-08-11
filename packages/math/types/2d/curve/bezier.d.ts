import { BoundingRect } from '../math/bounding_rect';
import { Vector2 } from '../math/vec2';
export declare class QuadBezier {
    static fromPoints(p0: Vector2, p1: Vector2, p2: Vector2): QuadBezier;
    static fromXY(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number): QuadBezier;
    p0: Vector2;
    p1: Vector2;
    p2: Vector2;
    constructor(p0: Vector2, p1: Vector2, p2: Vector2);
    getBoundingBox(): BoundingRect;
    split(t: number): Vector2[];
    /**
     * 获取贝塞尔曲线上某一点的坐标
     * @param {number} t
     * @returns
     * @memberof QuadBezier
     */
    getPoint(t: number): Vector2;
    getPoints(tolerance?: number): Vector2[];
    getExtermas(extrenas: Vector2[]): number;
    fatten(tessellationTolerance?: number): Vector2[];
}
export declare class CubicBezier {
    static fromQuadBezier(q: QuadBezier): CubicBezier;
    static fromPoints(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2): CubicBezier;
    static fromXY(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): CubicBezier;
    p0: Vector2;
    p1: Vector2;
    p2: Vector2;
    p3: Vector2;
    constructor(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2);
    getBoundingBox(): BoundingRect;
    split(t: number): Vector2[];
    getPoint(t: number): Vector2;
    getPoints(tolerance?: number): Vector2[];
    getExtermas(extrenas: Vector2[]): number;
    fatten(tessellationTolerance?: number): Vector2[];
}
export declare function bernstein(n: number, i: number, t: number): number;
/**
 * 伯恩斯坦多项式，用于计算贝塞尔曲线上的点
 * B(t)=∑(nCi)ti(1-t)(n-i)p_i
 */
export declare function getBezierPointWithBernstein(points: Vector2[], t: number): Vector2;
/**
 * 使用德卡斯特尔朱算法计算贝塞尔曲线上的点
 */
export declare function getBezierPointWithDeCasteljau(points: Vector2[], t: number): Vector2;
export declare function conicBezierAt(p0: number, p1: number, p2: number, weight: number, t: number): number;
export declare function conicBezierPointAt(p0: Vector2, p1: Vector2, p2: Vector2, weight: number, t: number): Vector2;
/**
 * 如conicTo(p0, p1,p2, weight)=getRationalBezierPointWithBernstein([p0,p1,p2],[1,weight,1])
 * 有理贝塞尔曲线，使用伯恩斯坦多项式计算
 * @param points
 * @param weight
 * @param t
 * @returns
 */
export declare function getRationalBezierPointWithBernstein(points: Vector2[], weight: number[], t: number): Vector2;
/**
 * 获取贝塞尔曲线的曲率
    曲率半径=1/k
*/
export declare function bezierCurvatureAt(points: Vector2[], t: number): number;
export declare function quadBezierWithMatrixAt(p0: Vector2, p1: Vector2, p2: Vector2, t: number): Vector2;
export declare function cubicBezierWithMatrixAt(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, t: number): Vector2;
export declare function quadraticBezierAt(v0: number, v1: number, v2: number, t: number): number;
/**
 * 根据二次贝塞尔曲线上的参数 t 计算对应的点
 *
 * @param p0 二次贝塞尔曲线的起点
 * @param p1 二次贝塞尔曲线的控制点
 * @param p2 二次贝塞尔曲线的终点
 * @param t 参数 t 的值，取值范围 [0, 1]
 * @returns 返回二次贝塞尔曲线上对应参数 t 的点
 */
export declare function quadraticBezierPointAt(p0: Vector2, p1: Vector2, p2: Vector2, t: number): Vector2;
export declare function cubicBezierAt(v0: number, v1: number, v2: number, v3: number, t: number): number;
/**
 * 根据贝塞尔曲线的四个控制点和一个时间参数 t，计算贝塞尔曲线上的点
 *
 * @param p0 贝塞尔曲线的第一个控制点（起始点）
 * @param p1 贝塞尔曲线的第二个控制点
 * @param p2 贝塞尔曲线的第三个控制点
 * @param p3 贝塞尔曲线的第四个控制点（终点）
 * @param t 时间参数，取值范围在 [0, 1] 之间
 * @returns 返回贝塞尔曲线上对应时间参数 t 的点
 */
export declare function cubicBezierPointAt(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, t: number): Vector2;
export declare function raiseBezier(points: Vector2[]): Vector2[];
/**
 * 获取贝塞尔曲线的一阶导数 (方向和速度向量)
 * @param points
 * @param t
 * @returns
 */
export declare function bezierFirstDerivative(points: Vector2[], t: number): Vector2;
/**
 * 计算N阶贝塞尔曲线在参数t处的二阶导数 （加速度向量)
 * @param {Array} points - 控制点数组 [{x, y}, ...]
 * @param {number} t - 参数值 [0, 1]
 * @returns {Object} 二阶导数向量 {x, y}
 */
export declare function bezierSecondDerivative(points: Vector2[], t: number): Vector2;
/**
 * 获取贝塞尔曲线在t处的k阶导数
 * !n/(n-k)!*nCr()*Δ^k P_i(t)的和

 * @param points
 * @param t
 * @param k 阶数
 * @returns
 */
export declare function bezierDerivative(points: Vector2[], t: number, k: number): Vector2;
/**
 * 计算贝塞尔曲线的N阶导数控制点
 * 求t的导
 * const  derivativeControls=getBezierDerivativeControlPoints(points)
 * const  tangent =getBezierPointWithDeCasteljau(derivativeControls, t)
*  计算p0点切线方向直线
* (x-p0.x)*tangent.y=(y-p0.y)*tangent.x
*
*   求二阶导数控制点
const  firstDerivativeControls=getBezierDerivativeControlPoints(points)
const  secondDerivativeControls=getBezierDerivativeControlPoints(firstDerivativeControls)
 */
export declare function getBezierDerivativeControlPoints(points: Vector2[]): Vector2[];
export declare function chopBezierBetween(points: Vector2[], t0: number, t1: number): Vector2[];
/**
 * N阶贝塞尔曲线细分（使用德卡斯特里奥算法）
 * @param {Array} points - 控制点数组，格式 [{x, y}, ...]
 * @param {number} t - 分割参数 (0 < t < 1)
 * @returns {Array} [leftCurve, rightCurve] 分割后的两条曲线控制点
 */
export declare function chopBezierAt(points: Vector2[], t?: number): {
    left: Vector2[];
    right: Vector2[];
};
export declare function chopQuadBezierAt(p0: Vector2, p1: Vector2, p2: Vector2, t?: number): Vector2[];
export declare function chopQuadBezierAtMaxCurature(src: Vector2[], dst: Vector2[]): Vector2[];
export declare function chopCubicBezierAt(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, t?: number): Vector2[];
export declare function pointOnSegmentDistance(x: number, y: number, x1: number, y1: number, x2: number, y2: number): number;
export declare function pointOnLineDistance(x: number, y: number, x1: number, y1: number, x2: number, y2: number): number;
export declare function flattenQuadBezier(p0: Vector2, p1: Vector2, p2: Vector2, tessellationTolerance?: number, maxDepth?: number): Vector2[];
export declare function flattenCubicBezier(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, tessellationTolerance?: number, maxDepth?: number): Vector2[];
/**
 * 两次贝塞尔曲线转换为三次贝塞尔曲线。
 * @param p0
 * @param p1
 * @param p2
 * @returns
 */
export declare function quadBezierToCubic(p0: Vector2, p1: Vector2, p2: Vector2): Vector2[];
/**
 * 计算在t位置的二次贝塞曲线的一阶导数（斜率）
 * 二次导数：2(p1-p0)(1-t)+2(p2-p1)t=2(p1-p0)+2t(p2-2p1+p0)
*/
export declare function evalQuadBezierTangentAt(p0: Vector2, p1: Vector2, p2: Vector2, t: number): Vector2;
/**
 * 计算在t位置的二次贝塞曲线的二阶导数（曲率）
 *  F(t)    = a (1 - t) ^ 2 + 2 b t (1 - t) + c t ^ 2
 *  F'(t)   = 2 (b - a) + 2 (a - 2b + c) t
 *  F''(t)  = 2 (a - 2b + c)
 *
 *  A = 2 (b - a)
 *  B = 2 (a - 2b + c)
 *
 *  Maximum curvature for a quadratic means solving
 *   Fx' Fx'' + Fy' Fy'' = 0
 *
 *   t = - (Ax Bx + Ay By) / (Bx ^ 2 + By ^ 2)
*/
export declare function findQuadMaxCurvature(p0: Vector2, p1: Vector2, p2: Vector2): number;
/**
 * 计算在t位置的三次贝塞曲线的一阶导数（斜率）
 * 3t^2(p3-3p2+3p1-p0)+6t(p2-2p1+p0)+3(p1-p0)
*/
export declare function evalCubicBezierTangentAt(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, t: number): Vector2;
export declare function findCubicMaxCurvature(src: Vector2[], tValues: number[]): number;
/**
 * 获取二次贝塞尔曲线极值。
 * Quad'(t) = At + B, where
    A = 2(a - 2b + c)
    B = 2(b - a)
    Solve for t, only if it fits between 0 < t < 1
*/
export declare function findQuadExtrema(a: number, b: number, c: number, tValue: number[]): 0 | 1;
/**
 * 获取三次贝塞尔曲线极值。
 * Cubic'(t) = At^2 + Bt + C, where
    A = 3(-a + 3(b - c) + d)
    B = 6(a - 2b + c)
    C = 3(b - a)
    Solve for t, keeping only those that fit betwee 0 < t < 1
*/
export declare function findCubicExtrema(a: number, b: number, c: number, d: number, tValue: number[]): number;
/** From Numerical Recipes in C.

    Q = -1/2 (B + sign(B) sqrt[B*B - 4*A*C])
    x1 = Q / A
    x2 = C / Q
*/
export declare function findUnitQuadRoots(A: number, B: number, C: number, roots: number[]): number;
/**
 * 计算二次贝塞尔曲线极值点。
 * @param src 控制点
 * @param extremas 极值点
 * @returns 极值点个数
 */
export declare function computeQuadExtremas(src: Vector2[], extremas: Vector2[]): number;
/**
 *  计算三次贝塞尔曲线极值点。
 * @param src 控制点数组
 * @param extremas  极值点数组
 * @returns  极值点个数
 */
export declare function computeCubicExtremas(src: Vector2[], extremas: Vector2[]): number;
/**
 * 投射点到二次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x
 * @param {number} y
 * @param {Array.<number>} out 投射点
 * @return {number}
 */
export declare function quadraticProjectPoint(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x: number, y: number, out: Vector2 | null): number;
/**
 * 计算二次贝塞尔曲线长度
 */
export declare function quadraticLength(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, iteration: number): number;
/**
 * 投射点到三次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 */
export declare function cubicProjectPoint(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x: number, y: number, out: Vector2 | null): number;
/**
 * 计算三次贝塞尔曲线长度
 */
export declare function cubicLength(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, iteration: number): number;
