import { PointLike } from './Point';
import { BoundingRect } from './BoundingRect';
/**
 * 计算 Cox-de Boor 递归 B 样条基函数
 *
 * N_{i,1}(u) = 1 if knot[i] <= u < knot[i+1], else 0
 * N_{i,p}(u) = (u - knot[i]) / (knot[i+p] - knot[i]) * N_{i,p-1}(u)
 *            + (knot[i+p+1] - u) / (knot[i+p+1] - knot[i+1]) * N_{i+1,p-1}(u)
 *
 * @param i  - 基函数索引
 * @param p  - 次数（degree）
 * @param u  - 参数值
 * @param knots - 节点向量（非递减序列）
 */
export declare function getBSplineBasisValue(i: number, p: number, u: number, knots: number[]): number;
/**
 * 计算所有基函数值（避免重复递归，动态规划）
 * 返回 N_{i,p}(u) for i = span-p .. span
 *
 * @param span - u 所在的节点区间索引
 * @param p    - 次数
 * @param u    - 参数值
 * @param knots - 节点向量
 * @returns 基函数值数组（长度 p+1）
 */
export declare function getBSplineBasisValues(span: number, p: number, u: number, knots: number[]): number[];
/**
 * 查找参数 u 所在的节点区间索引
 * @returns span 索引，使 knots[span] <= u < knots[span+1]
 */
export declare function findSpan(n: number, p: number, u: number, knots: number[]): number;
/**
 * 生成 clamped（两端重复度为 p+1）的均匀节点向量
 * @param n        - 控制点数 - 1
 * @param p        - 次数
 * @returns 节点向量数组（长度 n+p+2）
 */
export declare function generateClampedKnots(n: number, p: number): number[];
/**
 * 计算 NURBS 曲线上参数 u 处的点
 *
 * C(u) = Σ N_{i,p}(u) · w_i · P_i / Σ N_{i,p}(u) · w_i
 *
 * @param u        - 参数 ∈ [0, 1]
 * @param points   - 控制点
 * @param weights  - 权重（与控制点一一对应）
 * @param knots    - 节点向量
 * @param degree   - 次数
 */
export declare function getNURBSEvaluate(u: number, points: PointLike[], weights: number[], knots: number[], degree: number): PointLike;
/**
 * 计算 NURBS 曲线在 u 处的一阶导数
 */
export declare function getNURBSDerivative(u: number, points: PointLike[], weights: number[], knots: number[], degree: number): PointLike;
export declare class NURBS {
    /** 控制点 */
    points: PointLike[];
    /** 权重 */
    weights: number[];
    /** 节点向量 */
    knots: number[];
    /** 次数 */
    degree: number;
    constructor(points: PointLike[], weights?: number[], knots?: number[], degree?: number);
    /** 计算曲线上参数 u∈[0,1] 处的点 */
    evaluate(u: number): PointLike;
    /** 计算曲线在 u 处的一阶导数 */
    derivative(u: number): PointLike;
    /** 计算曲线在 u 处的法向量 */
    normal(u: number): PointLike;
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
