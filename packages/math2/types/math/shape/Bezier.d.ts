import { BoundingRect } from '../BoundingRect';
import { Geometry, PointOut } from './Geometry';
export type BezierType = 'quadratic' | 'cubic';
export declare class Bezier extends Geometry {
    type: BezierType;
    points: number[];
    constructor(type?: BezierType, points?: number[]);
    static quadratic(x0: number, y0: number, c1x: number, c1y: number, x1: number, y1: number): Bezier;
    static cubic(x0: number, y0: number, c1x: number, c1y: number, c2x: number, c2y: number, x1: number, y1: number): Bezier;
    area(): number;
    centroid(out?: PointOut): PointOut;
    center(out?: PointOut): PointOut;
    /** 曲线长度（数值积分） */
    perimeter(): number;
    contains(x: number, y: number): boolean;
    /** 求曲线上参数 t 处的点 */
    pointAt(t: number, out?: PointOut): PointOut;
    /** 导数（切线向量） */
    derivativeAt(t: number, out?: PointOut): PointOut;
    /**
     * 弧长 - Gauss-Legendre 5 节点积分
     * ∫₀¹ |B'(t)| dt
     */
    arcLength(): number;
    /**
     * 带符号距离 - 找到曲线上离点最近的点
     * 二次：解析（求导得到三次方程）
     * 三次：采样 + Newton 精化
     */
    signedDistance(x: number, y: number): number;
    /** 最近点参数 t */
    closestParameter(x: number, y: number): number;
    /**
     * 二次贝塞尔最近点参数
     * 设 D(t) = |B(t) - Q|²，求 D'(t)=0
     * 化简后得到一元三次方程 at³+bt²+ct+d=0
     */
    private _closestQuadratic;
    /**
     * 三次贝塞尔最近点参数
     * 采样 N 个点找近似最近，再 Newton-Raphson 精化 3 次
     */
    private _closestCubic;
    private _secondDerivativeAt;
    getPoints(out?: PointOut[]): PointOut[];
    /**
     * 递归展平二次贝塞尔：控制点 P1 到弦 P0P2 距离 ≤ tol 时终止，否则 de Casteljau 对半分
     */
    private _flattenQuadratic;
    /**
     * 递归展平三次贝塞尔：P1、P2 到弦 P0P3 距离均 ≤ tol 时终止，否则 de Casteljau 对半分
     */
    private _flattenCubic;
    bounds(out?: BoundingRect): BoundingRect;
}
