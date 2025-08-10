import { Vector2Like as VectorArray } from '../math/vec2';
/**
 * 计算三次贝塞尔值
 */
export declare function cubicAt(p0: number, p1: number, p2: number, p3: number, t: number): number;
/**
 * 计算三次贝塞尔导数值
 */
export declare function cubicDerivativeAt(p0: number, p1: number, p2: number, p3: number, t: number): number;
/**
 * 计算三次贝塞尔方程根，使用盛金公式
 */
export declare function cubicRootAt(p0: number, p1: number, p2: number, p3: number, val: number, roots: number[]): number;
/**
 * 计算三次贝塞尔方程极限值的位置
 * @return 有效数目
 */
export declare function cubicExtrema(p0: number, p1: number, p2: number, p3: number, extrema: number[]): number;
/**
 * 细分三次贝塞尔曲线
 */
export declare function cubicSubdivide(p0: number, p1: number, p2: number, p3: number, t: number, out: number[]): void;
/**
 * 投射点到三次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 */
export declare function cubicProjectPoint(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x: number, y: number, out: VectorArray): number;
/**
 * 计算三次贝塞尔曲线长度
 */
export declare function cubicLength(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, iteration: number): number;
/**
 * 计算二次方贝塞尔值
 */
export declare function quadraticAt(p0: number, p1: number, p2: number, t: number): number;
/**
 * 计算二次方贝塞尔导数值
 */
export declare function quadraticDerivativeAt(p0: number, p1: number, p2: number, t: number): number;
/**
 * 计算二次方贝塞尔方程根
 * @return 有效根数目
 */
export declare function quadraticRootAt(p0: number, p1: number, p2: number, val: number, roots: number[]): number;
/**
 * 计算二次贝塞尔方程极限值
 */
export declare function quadraticExtremum(p0: number, p1: number, p2: number): number;
/**
 * 细分二次贝塞尔曲线
 */
export declare function quadraticSubdivide(p0: number, p1: number, p2: number, t: number, out: number[]): void;
/**
 * 投射点到二次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x
 * @param {number} y
 * @param {Array.<number>} out 投射点
 * @return {number}
 */
export declare function quadraticProjectPoint(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x: number, y: number, out: VectorArray): number;
/**
 * 计算二次贝塞尔曲线长度
 */
export declare function quadraticLength(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, iteration: number): number;
