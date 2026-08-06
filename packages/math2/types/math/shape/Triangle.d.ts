import { BoundingRect } from '../BoundingRect';
import { Geometry, PointOut } from './Geometry';
/** 重心坐标输出（避免分配）：P = u*A + v*B + w*C，u + v + w = 1 */
export interface BarycentricOut {
    /** 顶点 A 的权重 */
    u: number;
    /** 顶点 B 的权重 */
    v: number;
    /** 顶点 C 的权重 */
    w: number;
}
export declare class Triangle extends Geometry {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    cx: number;
    cy: number;
    constructor(ax?: number, ay?: number, bx?: number, by?: number, cx?: number, cy?: number);
    /** 有向面积（带符号，CCW 为正） */
    signedArea(): number;
    area(): number;
    centroid(out?: PointOut): PointOut;
    center(out?: PointOut): PointOut;
    perimeter(): number;
    /**
     * 重心坐标法判断点是否在三角形内部
     * 使用同向法：点在三边的同侧
     */
    contains(x: number, y: number): boolean;
    signedDistance(x: number, y: number): number;
    bounds(out?: BoundingRect): BoundingRect;
    /**
     * 计算点 P 相对三角形 ABC 的重心坐标 (u, v, w)
     * 满足 P = u*A + v*B + w*C，且 u + v + w = 1
     * - 点在三角形内部（含边界）时，u, v, w ∈ [0, 1]
     * - 点在外部时，至少有一个坐标为负
     * - 退化三角形（面积为 0）返回 (0, 0, 0)
     * 算法：基于子三角形有符号面积之比，2 倍面积因子在分子分母中抵消
     */
    static barycentric(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, px: number, py: number, out?: BarycentricOut): BarycentricOut;
}
