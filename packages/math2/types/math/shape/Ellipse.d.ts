import { BoundingRect } from '../BoundingRect';
import { Geometry, PointOut } from './Geometry';
export declare class Ellipse extends Geometry {
    cx: number;
    cy: number;
    radiusX: number;
    radiusY: number;
    constructor(cx?: number, cy?: number, radiusX?: number, radiusY?: number);
    area(): number;
    /**
     * 周长（Ramanujan 近似，精度极高）
     * π [3(a+b) - sqrt((3a+b)(a+3b))]
     */
    perimeter(): number;
    centroid(out?: PointOut): PointOut;
    center(out?: PointOut): PointOut;
    /** 严格内部（不含边界） */
    contains(x: number, y: number): boolean;
    containsInclusive(x: number, y: number): boolean;
    /**
     * 径向近似带符号距离
     * 思路：射线 (cx, cy) -> (x, y) 与椭圆边界交点距中心为 r_b，
     *       点距中心为 r_p，带符号距离 ≈ r_b - r_p（正为内）
     */
    signedDistance(x: number, y: number): number;
    bounds(out?: BoundingRect): BoundingRect;
}
