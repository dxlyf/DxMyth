import { BoundingRect } from '../BoundingRect';
import { Geometry, PointOut } from './Geometry';
export declare class Polygon extends Geometry {
    /** 扁平顶点数据 [x0,y0,x1,y1,...] */
    points: number[];
    constructor(points?: number[]);
    /** 顶点数 */
    get vertexCount(): number;
    /** 从点对象数组构造 */
    static fromPoints(pts: Array<{
        x: number;
        y: number;
    }>): Polygon;
    /**
     * 面积（带符号面积取绝对值）
     * Shoelace 公式：A = 0.5 * Σ (x_i * y_{i+1} - x_{i+1} * y_i)
     */
    signedArea(): number;
    area(): number;
    /**
     * 重心（面积加权形心）
     * Cx = (1/6A) Σ (x_i + x_{i+1})(x_i y_{i+1} - x_{i+1} y_i)
     * Cy = (1/6A) Σ (y_i + y_{i+1})(x_i y_{i+1} - x_{i+1} y_i)
     */
    centroid(out?: PointOut): PointOut;
    center(out?: PointOut): PointOut;
    perimeter(): number;
    /**
     * 射线投射法（even-odd 规则）
     * 性能：O(n)，无内存分配
     */
    contains(x: number, y: number): boolean;
    signedDistance(x: number, y: number): number;
    bounds(out?: BoundingRect): BoundingRect;
}
