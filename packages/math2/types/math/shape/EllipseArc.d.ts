import { BoundingRect } from '../BoundingRect';
import { Geometry, PointOut } from './Geometry';
export declare class EllipseArc extends Geometry {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    /** 长轴旋转角（弧度） */
    xRotation: number;
    startAngle: number;
    endAngle: number;
    /** true=逆时针，false=顺时针 */
    ccw: boolean;
    constructor(cx?: number, cy?: number, rx?: number, ry?: number, xRotation?: number, startAngle?: number, endAngle?: number, ccw?: boolean);
    /** 局部角（弧度）对应的世界坐标点 */
    pointAt(angle: number, out?: PointOut): PointOut;
    /** 扫过角度（绝对值，弧度） */
    sweep(): number;
    /** 弦长（起点到终点直线距离） */
    chordLength(): number;
    /** 扇形面积 = 0.5 * rx * ry * sweep */
    area(): number;
    /** 弓形面积（弦+弧）= 扇形面积 - 三角形面积 */
    segmentArea(): number;
    /**
     * 扇形重心
     * 单位圆扇形重心距离 d = (2 sin(α/2)) / (3·α/2)，
     * 局部坐标按 (rx, ry) 缩放，再旋转 xRotation、平移 (cx, cy)
     */
    centroid(out?: PointOut): PointOut;
    center(out?: PointOut): PointOut;
    /** 周长 = 椭圆弧长 + 两段半径 */
    perimeter(): number;
    /**
     * 椭圆弧长（Gauss-Legendre 16 点数值积分）
     * |dP/dφ| = sqrt(rx²·sin²φ + ry²·cos²φ)，φ 为局部角
     */
    arcLength(): number;
    /** 起点坐标 */
    startPoint(out?: PointOut): PointOut;
    /** 终点坐标 */
    endPoint(out?: PointOut): PointOut;
    /**
     * 点是否在扇形内
     * 条件：在椭圆内（逆旋转到局部坐标系后归一化距离 < 1）且角度在扫过范围内
     */
    contains(x: number, y: number): boolean;
    /** 角度（局部角）是否在扫过范围内 */
    angleInSweep(angle: number): boolean;
    /**
     * 带符号距离（到扇形边界：椭圆弧 + 两段半径）
     * 弧距离：牛顿迭代求椭圆最近点，落在扫过范围内才计入
     */
    signedDistance(x: number, y: number): number;
    /** 边界细分：圆心 → 起点 → 弧采样 → 终点 */
    getPoints(out?: PointOut[]): PointOut[];
    /** 包围盒：旋转后完整椭圆的精确 AABB（含扇形的超集） */
    bounds(out?: BoundingRect): BoundingRect;
}
