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
    /**
     * 内心（Incenter）：三条角平分线的交点，即内切圆圆心。
     * 坐标为顶点按对边边长加权的重心组合：
     *   I = (a·A + b·B + c·C) / (a + b + c)
     * 其中 a = |BC|（顶点 A 的对边）、b = |CA|、c = |AB|。
     * 推导：内心到三边距离均为内切圆半径 r，故每个顶点处的
     * 权重正比于该顶点对边的长度（面积法：S = a·r/2 + b·r/2 + c·r/2）。
     * @param out 可选输出对象，避免分配
     */
    incenter(out?: PointOut): PointOut;
    /**
     * 外心（Circumcenter）：三条垂直平分线的交点，即外接圆圆心。
     * 采用行列式推导的解析公式（2D 平面）：
     *   d  = 2 * [ ax*(by-cy) + bx*(cy-ay) + cx*(ay-by) ]
     *   ux = [ (ax²+ay²)*(by-cy) + (bx²+by²)*(cy-ay) + (cx²+cy²)*(ay-by) ] / d
     *   uy = [ (ax²+ay²)*(cx-bx) + (bx²+by²)*(ax-cx) + (cx²+cy²)*(bx-ax) ] / d
     * 推导：外心到三顶点距离相等，令 |U-A|² = |U-B|² = |U-C|²，
     * 两两相减得两条线性方程（垂直平分线），联立解出 U。
     * 注意：三点共线时无外心（d = 0），返回 (0, 0)。
     * @param out 可选输出对象，避免分配
     */
    circumcenter(out?: PointOut): PointOut;
    perimeter(): number;
    /**
     * 重心坐标法判断点是否在三角形内部
     * 使用同向法：点在三边的同侧
     */
    contains(x: number, y: number): boolean;
    signedDistance(x: number, y: number): number;
    getPoints(out?: PointOut[]): PointOut[];
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
