import { PointLike } from './Point';
import { BoundingRect } from './BoundingRect';
import { CubicBezier } from './CubicBezier';
export declare function getQuadraticBezierEvaluate(t: number, p0: PointLike, p1: PointLike, p2: PointLike): PointLike;
export declare function getQuadraticBezierExtremaRoots(p0: PointLike, p1: PointLike, p2: PointLike): number[];
export declare function getQuadraticBezierBounds(p0: PointLike, p1: PointLike, p2: PointLike): BoundingRect;
/**
 * 计算二次贝塞尔曲线的多项式系数
 * P(t) = a·t² + b·t + c
 */
export declare function getQuadraticCoefficients(p0: PointLike, p1: PointLike, p2: PointLike): {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    cx: number;
    cy: number;
};
export declare class QuadraticBezier {
    points: PointLike[];
    constructor(points: PointLike[]);
    get p0(): PointLike;
    get p1(): PointLike;
    get p2(): PointLike;
    evaluate(t: number): PointLike;
    getExtremaRoots(): number[];
    getBounds(): BoundingRect;
    /**
     * 计算 t 处的一阶导数（切向量）
     * B'(t) = 2[(1-t)(P1-P0) + t(P2-P1)]
     * @param t - 参数 [0, 1]
     */
    getDerivative(t: number): PointLike;
    /**
     * 计算 t 处的二阶导数（加速度向量）
     * B''(t) = 2(P0 - 2P1 + P2)，二次贝塞尔曲线的二阶导数为常量
     */
    getSecondDerivative(_t?: number): PointLike;
    /**
     * 计算 t 处的曲率
     * k = |x'·y'' - y'·x''| / (x'² + y'²)^(3/2)
     * @param t - 参数 [0, 1]
     */
    getCurvature(t: number): number;
    /**
     * 获取曲率最大的位置及曲率值（采样 + 黄金分割搜索）
     * @param samples - 初始采样段数（默认 32）
     */
    getMaxCurvature(samples?: number): {
        t: number;
        curvature: number;
    };
    /**
     * 计算线段与二次贝塞尔曲线的交点
     *
     * 将线段写成隐式直线 A·x + B·y + C = 0，代入曲线参数多项式后
     * 得到关于 t 的一元二次方程，解出 t ∈ [0, 1] 且落在线段内的点。
     *
     * @param x1 - 线段起点 X
     * @param y1 - 线段起点 Y
     * @param x2 - 线段终点 X
     * @param y2 - 线段终点 Y
     * @returns 交点数组（已去重）
     */
    intersectSegment(x1: number, y1: number, x2: number, y2: number): PointLike[];
    /**
     * 计算与另一条二次贝塞尔曲线的交点
     * @param other - 另一条二次贝塞尔曲线
     * @param epsilon - 交点精度（默认 1e-4）
     */
    intersectQuadratic(other: QuadraticBezier, epsilon?: number): PointLike[];
    /**
     * 计算与三次贝塞尔曲线的交点
     * @param other - 三次贝塞尔曲线
     * @param epsilon - 交点精度（默认 1e-4）
     */
    intersectCubic(other: CubicBezier, epsilon?: number): PointLike[];
    /**
     * 在参数 t 处分割二次贝塞尔曲线
     * @param t - 分割参数 [0, 1]
     * @returns [左半曲线, 右半曲线]
     */
    split(t: number): [QuadraticBezier, QuadraticBezier];
    /**
     * 将二次贝塞尔曲线扁平化为线段序列
     * @param epsilon - 近似误差容限（默认 0.5）
     * @returns PointLike[] 点序列（包含起点和终点）
     */
    flatten(epsilon?: number): PointLike[];
    /**
     * 计算点到二次贝塞尔曲线的最小距离
     * @param px - 点 X
     * @param py - 点 Y
     * @returns 点到曲线的最小距离
     */
    distanceTo(px: number, py: number): number;
    /**
     * 计算点在二次贝塞尔曲线上的投影点（最近点）
     * @param px - 点 X
     * @param py - 点 Y
     * @returns 曲线上距离给定点最近的点
     */
    projectPoint(px: number, py: number): PointLike;
}
