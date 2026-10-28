import { BoundingRect } from '../BoundingRect';
/** 描边对齐方式 */
type StrokeAlign = 'inner' | 'outer' | 'center';
/** 输出点（避免分配） */
export interface PointOut {
    x: number;
    y: number;
}
export declare abstract class Geometry {
    /** 面积 */
    abstract area(): number;
    /** 重心（几何形心，面积加权） */
    abstract centroid(out?: PointOut): PointOut;
    /** 中心点（包围盒中心） */
    abstract center(out?: PointOut): PointOut;
    /** 周长（边界总长度，开放曲线为曲线长度） */
    abstract perimeter(): number;
    /** 点是否在图形内部（不含边界） */
    abstract contains(x: number, y: number): boolean;
    /**
     * 点到边界的带符号距离
     * @returns 内部为正（到最近边界距离），外部为负，边界上为 0
     */
    abstract signedDistance(x: number, y: number): number;
    /** 轴对齐包围盒（就地写入 out，避免分配） */
    abstract bounds(out?: BoundingRect): BoundingRect;
    /**
     * 将边界细分为折线段顶点，写入 out 并返回
     * - 直线图形直接输出顶点；曲线/圆弧按弦高误差自适应细分
     * - 闭合图形不重复首尾点（末边由首尾隐式闭合）
     */
    abstract getPoints(out?: PointOut[]): PointOut[];
    /** 点是否在边界上（epsilon 容差，无宽度） */
    isPointOnBoundary(x: number, y: number, epsilon?: number): boolean;
    /**
     * 点是否在描边带内
     * - center: 描边以边界为中心，内外各 lineWidth/2
     * - inner : 描边向内偏移，整条宽度位于图形内部一侧
     * - outer : 描边向外偏移，整条宽度位于图形外部一侧
     */
    isPointOnStroke(x: number, y: number, lineWidth: number, strokeAlign?: StrokeAlign): boolean;
}
/**
 * 点到线段的最近距离（无符号）
 * 算法：投影参数 t = clamp(dot(p-a, b-a)/|b-a|², 0, 1)，最近点 = a + t*(b-a)
 */
export declare function distPointToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number;
/**
 * 点到线段的平方距离（避免 sqrt，用于比较）
 */
export declare function distPointToSegmentSquared(px: number, py: number, ax: number, ay: number, bx: number, by: number): number;
/**
 * 点到线段的带符号距离
 * 符号由线段方向决定：点在线段左侧（逆时针方向）为正，右侧为负
 * 注意：此处符号基于法线方向，与封闭区域的 inside/outside 含义不同
 */
export declare function signedDistPointToLine(px: number, py: number, ax: number, ay: number, bx: number, by: number): number;
/**
 * 根据半径、圆心角（弧度）和容差，计算圆弧离散成线段所需的段数。
 *
 * 容差 tolerance 定义为「弦中点到弧的最大垂距（矢高 sagitta）」。
 * 对半角 α，弦到圆心的距离为 r·cosα，矢高为 r(1 - cosα)；
 * 令 r(1 - cosα) = tolerance，解得 α = acos(1 - tolerance/r)，
 * 故单段最大圆心角 θ = 2α = 2·acos(1 - tolerance/r)。
 *  θ = 2·acos(1 - e/r) = acos(2(1 - e/r)² - 1)
 * @param radius    圆弧半径（像素）
 * @param sweep     圆弧扫过的圆心角，单位弧度；整圆为 2π
 * @param tolerance 允许的最大矢高误差（像素），默认 0.25
 * @returns         需要的线段数；sweep <= 0 或 radius <= 0 时返回 0
 */
export declare function arcSegmentCount(radius: number, sweep: number, tolerance?: number): number;
/** 角度归一化到 [0, 2π) */
export declare function normalizeAnglePositive(a: number): number;
/** 判断角度 angle 是否在 [start, end]（按 ccw 方向）范围内 */
export declare function isAngleInRange(angle: number, start: number, end: number, ccw: boolean): boolean;
/** 两个角度之间的最短角度差（绝对值） */
export declare function angleDelta(a: number, b: number): number;
export {};
