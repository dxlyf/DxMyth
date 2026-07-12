import { PointLike } from './Point';
import { BoundingRect } from './BoundingRect';
/**
 * 计算拉格朗日基函数 L_i(t)
 *
 *   L_i(t) = Π_{j≠i} (t - t_j) / (t_i - t_j)
 *
 * @param i     - 基函数索引
 * @param t     - 参数值
 * @param knots - 参数节点数组
 */
export declare function getLagrangeBasis(i: number, t: number, knots: number[]): number;
/**
 * 计算拉格朗日插值曲线上参数 t 处的点
 *
 *   P(t) = Σ L_i(t) · P_i
 *
 * @param t      - 参数 ∈ [0, 1]
 * @param points - 插值点
 * @param knots  - 参数节点（默认均匀分布）
 */
export declare function getLagrangeEvaluate(t: number, points: PointLike[], knots?: number[]): PointLike;
/**
 * 计算拉格朗日插值曲线在 t 处的一阶导数（数值差分）
 */
export declare function getLagrangeDerivative(t: number, points: PointLike[], knots?: number[], eps?: number): PointLike;
/**
 * 使用重心坐标法计算拉格朗日插值（数值更稳定）
 *
 *   w_i = 1 / Π_{j≠i} (t_i - t_j)
 *   P(t) = Σ w_i·P_i / (t - t_i) / Σ w_i / (t - t_i)
 *
 * @param t      - 参数
 * @param points - 插值点
 * @param knots  - 参数节点
 */
export declare function getLagrangeEvaluateBarycentric(t: number, points: PointLike[], knots: number[]): PointLike;
export declare class Lagrange {
    /** 插值点（曲线过所有点） */
    points: PointLike[];
    /** 参数节点 */
    knots: number[];
    constructor(points: PointLike[], knots?: number[]);
    /** 计算曲线上参数 t∈[0,1] 处的点 */
    evaluate(t: number): PointLike;
    /** 计算曲线在 t 处的一阶导数 */
    derivative(t: number): PointLike;
    /** 计算曲线在 t 处的法向量 */
    normal(t: number): PointLike;
    /** 获取边界框（采样法） */
    getBounds(samples?: number): BoundingRect;
    /**
     * 将曲线扁平化为线段序列
     * @param epsilon - 近似误差容限（默认 0.5）
     * @param samples - 初始采样数（默认 32）
     */
    flatten(epsilon?: number, samples?: number): PointLike[];
    /**
     * 计算点到曲线的最小距离
     * @param samples - 采样数（默认 50）
     */
    distanceTo(px: number, py: number, samples?: number): number;
    /**
     * 计算点在曲线上的投影点（最近点）
     * @param samples - 采样数（默认 50）
     */
    projectPoint(px: number, py: number, samples?: number): PointLike;
}
