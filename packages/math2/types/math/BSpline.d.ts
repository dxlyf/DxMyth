import { PointLike } from './Point';
import { BoundingRect } from './BoundingRect';
/**
 * 计算均匀三次 B 样条基函数值
 * 三次 B 样条的 4 个基函数（均匀节点向量，局部参数 u ∈ [0,1]）：
 *
 *   N0(u) = (1-u)³ / 6
 *   N1(u) = (3u³ - 6u² + 4) / 6
 *   N2(u) = (-3u³ + 3u² + 3u + 1) / 6
 *   N3(u) = u³ / 6
 */
export declare function getBSplineBasis(u: number): [number, number, number, number];
/**
 * 计算均匀三次 B 样条基函数的一阶导数
 */
export declare function getBSplineBasisDerivative(u: number): [number, number, number, number];
/**
 * 计算均匀三次 B 样条段上参数 u 处的点
 * @param u  - 段内参数 ∈ [0, 1]
 * @param p0 - 控制点 0
 * @param p1 - 控制点 1（段起点附近）
 * @param p2 - 控制点 2（段终点附近）
 * @param p3 - 控制点 3
 */
export declare function getBSplineEvaluate(u: number, p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike): PointLike;
/**
 * 计算均匀三次 B 样条段在 u 处的一阶导数
 */
export declare function getBSplineDerivative(u: number, p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike): PointLike;
/**
 * 计算均匀三次 B 样条段的边界框
 */
export declare function getBSplineSegmentBounds(p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike): BoundingRect;
export declare class BSpline {
    /** 控制点序列（至少 4 个点） */
    points: PointLike[];
    constructor(points: PointLike[]);
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
