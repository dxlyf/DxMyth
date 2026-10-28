import { Point } from '../basic/Point';
import { Segment } from './Segment';
import { Path } from './Path';
export declare class PathFitter {
    /** 参与拟合的点（已去掉相邻重复点）。 */
    points: Point[];
    /** 原路径是否闭合。 */
    closed: boolean;
    constructor(path: Path);
    /** 按给定误差拟合，返回新的 segment 数组（没有点时返回 `null`）。 */
    fit(error?: number): Segment[] | null;
    /** 对一组点拟合一段贝塞尔曲线。 */
    fitCubic(segments: Segment[], error: number, first: number, last: number, tan1: Point, tan2: Point): void;
    /** 把一段拟合结果追加为 segment。 */
    addCurve(segments: Segment[], curve: Point[]): void;
    /** 用最小二乘法求该区间贝塞尔曲线的控制点。 */
    generateBezier(first: number, last: number, uPrime: number[], tan1: Point, tan2: Point): Point[];
    /** 用给定参数化拟合后，尝试找出更好的参数化。 */
    reparameterize(first: number, last: number, u: number[], curve: Point[]): boolean;
    /** 用牛顿-拉夫逊迭代求更好的根。 */
    findRoot(curve: Point[], point: Point, u: number): number;
    /** 在给定参数处求贝塞尔曲线的值。 */
    evaluate(degree: number, curve: Point[], t: number): Point;
    /** 用相邻点之间的相对距离给点分配参数值。 */
    chordLengthParameterize(first: number, last: number): number[];
    /** 找出拟合曲线与数据点之间的最大平方距离。 */
    findMaxError(first: number, last: number, curve: Point[], u: number[]): {
        error: number;
        index: number;
    };
}
