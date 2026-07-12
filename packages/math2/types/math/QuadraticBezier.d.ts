import { PointLike } from './Point';
import { BoundingRect } from './BoundingRect';
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
