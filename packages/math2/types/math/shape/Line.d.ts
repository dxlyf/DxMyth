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
    bounds(out?: BoundingRect): BoundingRect;
}
