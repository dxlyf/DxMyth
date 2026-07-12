import { PointLike } from './Point';
import { BoundingRect } from './BoundingRect';
/**
 * 计算 Catmull-Rom 样条段上参数 t 处的点
 * 每段由 4 个控制点 P0 P1 P2 P3 定义，曲线从 P1 到 P2
 *
 * 基矩阵形式：
 *   q(t) = 0.5 * [1  t  t²  t³] * M * [P0  P1  P2  P3]ᵀ
 *
 *   M = |  0   2   0   0 |
 *       | -1   0   1   0 |
 *       |  2  -5   4  -1 |
 *       | -1   3  -3   1 |
 */
export declare function getCatmullRomEvaluate(t: number, p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike, tension?: number): PointLike;
/**
 * 计算 Catmull-Rom 样条段在 t 处的一阶导数（切向量）
 */
export declare function getCatmullRomDerivative(t: number, p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike, tension?: number): PointLike;
/**
 * 获取 Catmull-Rom 样条段的极值 t 值
 * 对导数的 x、y 分量分别求解二次方程
 */
export declare function getCatmullRomExtremaRoots(p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike, tension?: number): number[];
/**
 * 计算 Catmull-Rom 样条段的边界框
 */
export declare function getCatmullRomBounds(p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike, tension?: number): BoundingRect;
export declare class CatmullRom {
    /** 控制点序列（至少 2 个点，曲线过 p1..p(n-2)） */
    points: PointLike[];
    /** 张力参数，0.5 为标准 Catmull-Rom，0 为紧致，1 为松弛 */
    tension: number;
    constructor(points: PointLike[], tension?: number);
    /** 段数 */
    get segmentCount(): number;
    /** 将全局参数 t∈[0,1] 映射到段索引和段内参数 */
    private _toSegment;
    /** 计算曲线上参数 t∈[0,1] 处的点 */
    evaluate(t: number): PointLike;
    /** 计算曲线在 t 处的一阶导数（切向量） */
    derivative(t: number): PointLike;
    /** 计算曲线在 t 处的法向量 */
    normal(t: number): PointLike;
    /** 获取边界框 */
    getBounds(): BoundingRect;
    /**
     * 将曲线扁平化为线段序列
     * @param epsilon - 近似误差容限（默认 0.5）
     * @returns 点序列
     */
    flatten(epsilon?: number): PointLike[];
    private _flattenSegment;
    /**
     * 计算点到曲线的最小距离
     * @param samples - 每段采样数（默认 16）
     */
    distanceTo(px: number, py: number, samples?: number): number;
    /**
     * 计算点在曲线上的投影点（最近点）
     * @param samples - 每段采样数（默认 16）
     */
    projectPoint(px: number, py: number, samples?: number): PointLike;
}
