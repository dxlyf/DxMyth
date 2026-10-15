import { BoundingRect } from '../BoundingRect';
import { Geometry, PointOut } from './Geometry';
export declare class Line extends Geometry {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    constructor(x1?: number, y1?: number, x2?: number, y2?: number);
    /** 线段长度 */
    length(): number;
    /** 线段长度的平方 */
    lengthSquared(): number;
    area(): number;
    centroid(out?: PointOut): PointOut;
    center(out?: PointOut): PointOut;
    perimeter(): number;
    /** 线段无内部，始终返回 false */
    contains(x: number, y: number): boolean;
    /**
     * 带符号距离：以线段方向为基准，左侧为正，右侧为负
     * 对开放曲线，inner/outer 描边的语义基于此符号
     */
    signedDistance(x: number, y: number): number;
    getPoints(out?: PointOut[]): PointOut[];
    bounds(out?: BoundingRect): BoundingRect;
    /**
     * 求两条线段的交点（各自限制在线段范围内）
     * 解 P1 + t·d1 = P2 + u·d2，仅当 t、u ∈ [0,1] 时两线段真正相交。
     * @returns 交点写入 out；平行/共线或交点在延长线上时返回 null
     */
    static intersectSegment(ax1: number, ay1: number, ax2: number, ay2: number, bx1: number, by1: number, bx2: number, by2: number, out?: PointOut): PointOut | null;
    /**
     * 求两条直线的交点（无限延长），每条直线各由两个点给出。
     * @returns 交点写入 out；两直线平行/重合时返回 null
     */
    static intersectLine(ax1: number, ay1: number, ax2: number, ay2: number, bx1: number, by1: number, bx2: number, by2: number, out?: PointOut): PointOut | null;
    /**
     * 求两条直线的交点，每条直线由「一点 + 方向」给出（方向无需单位化，但不能为零向量）。
     * @returns 交点写入 out；两直线平行/重合时返回 null
     */
    static intersectLineByDirection(px: number, py: number, dx: number, dy: number, qx: number, qy: number, ex: number, ey: number, out?: PointOut): PointOut | null;
}
