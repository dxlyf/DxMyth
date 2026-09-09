import { BoundingRect } from '../BoundingRect';
import { Vector2Like } from '../Vector2';
import { Geometry, PointOut } from './Geometry';
export declare const isPointInPolygon: (points: Vector2Like[], x: number, y: number, fillRule?: CanvasFillRule) => boolean;
export declare function isPolygonClockwise(points: Vector2Like[]): boolean;
export declare function polygonOffset(points: Vector2Like[], width: number): Vector2Like[];
export declare function buildStrokePoints(points: Vector2Like[], options: {
    align?: 'outside' | 'inside' | 'center';
    width?: number;
    join?: 'round' | 'bevel' | 'miter';
    cap?: 'round' | 'butt' | 'square';
    miterLimit?: number;
}): Vector2Like[];
export declare class Polygon extends Geometry {
    /** 扁平顶点数据 [x0,y0,x1,y1,...] */
    points: number[];
    closed: boolean;
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
    getPoints(out?: PointOut[]): PointOut[];
    bounds(out?: BoundingRect): BoundingRect;
}
