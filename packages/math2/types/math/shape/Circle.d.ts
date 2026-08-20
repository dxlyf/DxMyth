import { BoundingRect } from '../BoundingRect';
import { Geometry, PointOut } from './Geometry';
export declare class Circle extends Geometry {
    cx: number;
    cy: number;
    radius: number;
    constructor(cx?: number, cy?: number, radius?: number);
    area(): number;
    centroid(out?: PointOut): PointOut;
    center(out?: PointOut): PointOut;
    perimeter(): number;
    /** 严格内部（不含边界） */
    contains(x: number, y: number): boolean;
    /** 含边界 */
    containsInclusive(x: number, y: number): boolean;
    /**
     * 带符号距离：r - dist
     * 内部为正，外部为负，使用平方距离比较，避免 sqrt（仅在结果需要时调用）
     */
    signedDistance(x: number, y: number): number;
    getPoints(out?: PointOut[]): PointOut[];
    bounds(out?: BoundingRect): BoundingRect;
}
