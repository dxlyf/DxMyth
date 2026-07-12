import { BoundingRect } from '../BoundingRect';
import { Geometry, PointOut } from './Geometry';
export declare class Arc extends Geometry {
    cx: number;
    cy: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    /** true=逆时针，false=顺时针 */
    ccw: boolean;
    constructor(cx?: number, cy?: number, radius?: number, startAngle?: number, endAngle?: number, ccw?: boolean);
    /** 扫过角度（绝对值，弧度） */
    sweep(): number;
    /** 弦长 */
    chordLength(): number;
    /** 扇形面积 = 0.5 * r² * sweep */
    area(): number;
    /** 弓形面积（弦+弧）= 扇形面积 - 三角形面积 */
    segmentArea(): number;
    /**
     * 扇形重心
     * 沿角平分线方向，距圆心 (2 r sin(α/2)) / (3 α/2)，α=sweep
     */
    centroid(out?: PointOut): PointOut;
    center(out?: PointOut): PointOut;
    /** 周长 = 弧长 + 两段半径 */
    perimeter(): number;
    /** 弧长（不含半径线段） */
    arcLength(): number;
    /** 起点坐标 */
    startPoint(out?: PointOut): PointOut;
    /** 终点坐标 */
    endPoint(out?: PointOut): PointOut;
    /**
     * 点是否在扇形内
     * 条件：距圆心 < radius 且角度在扫过范围内
     */
    contains(x: number, y: number): boolean;
    /** 角度是否在扫过范围内 */
    angleInSweep(angle: number): boolean;
    /**
     * 带符号距离（到扇形边界：弧 + 两段半径）
     */
    signedDistance(x: number, y: number): number;
    bounds(out?: BoundingRect): BoundingRect;
}
