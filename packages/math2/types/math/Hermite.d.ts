import { PointLike } from './Point';
import { BoundingRect } from './BoundingRect';
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
export declare function getHermiteEvaluate(t: number, p0: PointLike, p1: PointLike, m0: PointLike, m1: PointLike): PointLike;
/**
 * 计算三次 Hermite 样条在 t 处的一阶导数
 */
export declare function getHermiteDerivative(t: number, p0: PointLike, p1: PointLike, m0: PointLike, m1: PointLike): PointLike;
/**
 * 计算三次 Hermite 样条在 t 处的二阶导数
 */
export declare function getHermiteSecondDerivative(t: number, p0: PointLike, p1: PointLike, m0: PointLike, m1: PointLike): PointLike;
/**
 * 获取三次 Hermite 样条的极值 t 值
 * 对导数的 x、y 分量分别求解二次方程
 */
export declare function getHermiteExtremaRoots(p0: PointLike, p1: PointLike, m0: PointLike, m1: PointLike): number[];
/**
 * 计算三次 Hermite 样条的边界框
 */
export declare function getHermiteBounds(p0: PointLike, p1: PointLike, m0: PointLike, m1: PointLike): BoundingRect;
/**
 * 将 Hermite 样条转换为三次贝塞尔曲线的控制点
 * B(t) 的 P1 = P0 + m0/3, P2 = P1 - m1/3
 */
export declare function hermiteToCubicBezier(p0: PointLike, p1: PointLike, m0: PointLike, m1: PointLike): [PointLike, PointLike, PointLike, PointLike];
export declare class Hermite {
    /** 起点和终点 */
    p0: PointLike;
    p1: PointLike;
    /** 起点和终点的切向量 */
    m0: PointLike;
    m1: PointLike;
    constructor(p0: PointLike, p1: PointLike, m0: PointLike, m1: PointLike);
    /** 计算曲线上参数 t 处的点 */
    evaluate(t: number): PointLike;
    /** 计算曲线在 t 处的一阶导数（切向量） */
    derivative(t: number): PointLike;
    /** 计算曲线在 t 处的二阶导数 */
    secondDerivative(t: number): PointLike;
    /** 计算曲线在 t 处的法向量 */
    normal(t: number): PointLike;
    /** 获取边界框 */
    getBounds(): BoundingRect;
    /**
     * 在参数 t 处分割曲线
     * @returns [左半曲线, 右半曲线]
     */
    split(t: number): [Hermite, Hermite];
    /**
     * 将曲线扁平化为线段序列
     * @param epsilon - 近似误差容限（默认 0.5）
     */
    flatten(epsilon?: number): PointLike[];
    /**
     * 计算点到曲线的最小距离
     * @param samples - 采样点数（默认 16）
     * @param iterations - Newton 迭代次数（默认 8）
     */
    distanceTo(px: number, py: number, samples?: number, iterations?: number): number;
    /**
     * 计算点在曲线上的投影点（最近点）
     * @param samples - 采样点数（默认 16）
     * @param iterations - Newton 迭代次数（默认 8）
     */
    projectPoint(px: number, py: number, samples?: number, iterations?: number): PointLike;
}
