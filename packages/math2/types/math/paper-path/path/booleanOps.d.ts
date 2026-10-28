import { Point } from '../basic/Point';
import { Curve } from './Curve';
import { PathItem } from './PathItem';
import { Path } from './Path';
/** 绕数结果，见 `PathItem#_getWinding()`。 */
export interface Winding {
    winding: number;
    windingL: number;
    windingR: number;
    onPath: boolean;
}
/** 布尔运算的选项，原文里还有 `insert`，这里去掉（不涉及场景图）。 */
export interface BooleanOptions {
    /** 是否用追踪法；为 false 时只把第一个路径在交点处切开。 */
    trace?: boolean;
    /** 是否按描边轮廓做运算。 */
    stroke?: boolean;
    /** 结果是否做简化。 */
    simplify?: boolean;
}
/** 复合路径返回子路径，普通路径返回自身。 */
export declare function getPaths(item: PathItem): Path[];
/**
 * 把复合路径化简:去掉空子路径，只剩一个子路径时直接返回它。
 */
export declare function reducePath(item: PathItem): PathItem;
/**
 * 对两个路径项做布尔运算，返回结果。
 */
export declare function traceBoolean(path1: PathItem, path2?: PathItem | PathItem[] | null, operation?: string, options?: BooleanOptions): PathItem;
/**
 * 返回点相对于一组曲线的绕数贡献。
 *
 * 关于各类边界情况的处理思路，见 #1073#issuecomment-226942348 与
 * #1073#issuecomment-226946965 中 @iconexperience 的描述。
 */
export declare function getWinding(point: Point, curves: Curve[], dir?: boolean, dontFlip?: boolean): Winding;
/**
 * 用指定路径切开一个路径项:相当于把 subtract 与 intersect 的结果合成一个
 * 复合路径。`options.trace` 为 false 或按描边计算时，改成只切开第一个路径。
 */
export declare function divideBoolean(path1: PathItem, path2: PathItem, options?: BooleanOptions): PathItem;
/**
 * 解析一个路径项自身的绕数（用于 `PathItem#resolveCrossings()`）：按它的
 * 填充规则追踪所围区域的外轮廓，丢掉内部曲线。
 */
export declare function resolveCrossings(item: PathItem): PathItem;
/**
 * 重新调整路径项的方向，见 `PathItem#reorient()`。
 */
export declare function reorient(item: PathItem, nonZero?: boolean, clockwise?: boolean): PathItem;
/**
 * 返回一个保证位于路径内部的点。
 */
export declare function getInteriorPoint(item: PathItem): Point;
