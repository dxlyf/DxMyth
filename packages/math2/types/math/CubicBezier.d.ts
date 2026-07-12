import { PointLike } from './Point';
import { BoundingRect } from './BoundingRect';
export declare function getCubicBezierEvaluate(t: number, p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike): PointLike;
export declare function getCubicBezierBounds(p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike): BoundingRect;
export declare function getCubicBezierExtremaRoots(p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike): number[];
/**
 * 计算三次贝塞尔曲线的多项式系数
 * P(t) = a·t³ + b·t² + c·t + d
 */
export declare function getCubicCoefficients(p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike): {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    cx: number;
    cy: number;
    dx: number;
    dy: number;
};
export declare class CubicBezier {
    points: PointLike[];
    constructor(points: PointLike[]);
    get p0(): PointLike;
    get p1(): PointLike;
    get p2(): PointLike;
    get p3(): PointLike;
    evaluate(t: number): PointLike;
    getExtremaRoots(): number[];
    getBounds(): BoundingRect;
    /**
     * 在参数 t 处分割三次贝塞尔曲线
     * @param t - 分割参数 [0, 1]
     * @returns [左半曲线, 右半曲线]
     */
    split(t: number): [CubicBezier, CubicBezier];
    /**
     * 将三次贝塞尔曲线扁平化为线段序列
     * @param epsilon - 近似误差容限（默认 0.5）
     * @returns PointLike[] 点序列（包含起点和终点）
     */
    flatten(epsilon?: number): PointLike[];
    /**
     * 计算点到三次贝塞尔曲线的最小距离
     *
     * 三次贝塞尔的最小距离问题导数为五次方程，无解析解。
     * 采用采样 + Newton 迭代逼近：
     *   1. 均匀采样 N 个点，取最近点的 t 值
     *   2. 在该 t 附近用 Newton 法迭代求精
     *
     * @param px - 点 X
     * @param py - 点 Y
     * @param samples - 采样点数（默认 12）
     * @param iterations - Newton 迭代次数（默认 8）
     * @returns 点到曲线的最小距离
     */
    distanceTo(px: number, py: number, samples?: number, iterations?: number): number;
    /**
     * 计算点在三次贝塞尔曲线上的投影点（最近点）
     *
     * 采用采样 + Newton 迭代逼近：
     *   1. 均匀采样 N 个点，取最近点的 t 值
     *   2. 在该 t 附近用 Newton 法迭代求精
     *   3. 比较端点，取最近者
     *
     * @param px - 点 X
     * @param py - 点 Y
     * @param samples - 采样点数（默认 12）
     * @param iterations - Newton 迭代次数（默认 8）
     * @returns 曲线上距离给定点最近的点
     */
    projectPoint(px: number, py: number, samples?: number, iterations?: number): PointLike;
}
