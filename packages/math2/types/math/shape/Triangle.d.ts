import { BoundingRect } from '../BoundingRect';
import { Geometry, PointOut } from './Geometry';
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
}
