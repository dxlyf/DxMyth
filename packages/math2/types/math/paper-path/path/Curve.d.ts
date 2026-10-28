import { Point } from '../basic/Point';
import { Line } from '../basic/Line';
import { Segment } from './Segment';
import { CurveLocation } from './CurveLocation';
import { Matrix } from '../basic/Matrix';
import { Path } from './Path';
/** 三次贝塞尔曲线的类型，见 `Curve.classify()`。 */
export interface CurveClassification {
    type: string;
    roots: number[] | null;
}
export declare class Curve {
    _segment1: Segment;
    _segment2: Segment;
    _path?: Path | null;
    /** 缓存的长度，由 `_changed()` 清除。 */
    _length?: number;
    constructor(segment1?: Segment, segment2?: Segment);
    _changed(): void;
    /** 返回曲线的副本。 */
    clone(): Curve;
    toString(): string;
    /** 从路径中移除该曲线，并合并相关线段的手柄。 */
    remove(): boolean;
    /** 曲线的第一个锚点。 */
    get point1(): Point;
    set point1(point: Point);
    /** 曲线的第二个锚点。 */
    get point2(): Point;
    set point2(point: Point);
    /** 描述第一个锚点处切线的手柄。 */
    get handle1(): Point;
    set handle1(handle: Point);
    /** 描述第二个锚点处切线的手柄。 */
    get handle2(): Point;
    set handle2(handle: Point);
    /** 曲线的第一个线段。 */
    get segment1(): Segment;
    /** 曲线的第二个线段。 */
    get segment2(): Segment;
    /** 曲线所属的路径。 */
    get path(): Path | null;
    /** 曲线在路径曲线数组中的下标。 */
    get index(): number | null;
    /** 路径曲线数组中的下一条曲线。 */
    get next(): Curve | null;
    /** 路径曲线数组中的上一条曲线。 */
    get previous(): Curve | null;
    /** 是否为路径曲线数组中的第一条曲线。 */
    isFirst(): boolean;
    /** 是否为路径曲线数组中的最后一条曲线。 */
    isLast(): boolean;
    /** 曲线几何的 8 个值：point1、handle1、handle2、point2。 */
    getValues(matrix?: Matrix): number[];
    /** 曲线几何的 4 个绝对坐标点。 */
    getPoints(): Point[];
    /** 曲线的近似长度。 */
    get length(): number;
    /** 曲线几何覆盖的面积。 */
    get area(): number;
    /** 两个锚点之间的直线，供 `isCollinear()` 使用。 */
    getLine(): Line;
    /** 在给定 curve-time 区间内取子曲线。 */
    getPart(from: number, to: number): Curve;
    /** 给定 curve-time 区间内的曲线长度。 */
    getPartLength(from: number, to: number): number;
    /** 给定 curve-time 处的曲线偏移。 */
    getOffsetAtTime(time: number): number;
    /**
     * 在给定偏移或位置处分割曲线。曲线本身
     * 成为第一部分，返回第二部分。
     */
    divideAt(location: number | CurveLocation): Curve | null;
    /**
     * 在给定 curve-time 处分割曲线。曲线本身成为
     * 第一部分，返回第二部分；若曲线属于某条路径，
     * 还会插入该路径。
     */
    divideAtTime(time: number): Curve | null;
    /** 在给定偏移或位置处拆分曲线所属的路径。 */
    splitAt(location: number | CurveLocation | null): Path | null;
    /** 在给定 curve-time 处拆分曲线所属的路径。 */
    splitAtTime(time: number): Path | null;
    /** 返回反向的曲线副本，不修改原曲线。 */
    reversed(): Curve;
    /** 清除手柄，使曲线变为直线。 */
    clearHandles(): void;
    /** 曲线是否设置了手柄。 */
    hasHandles(): boolean;
    /** 曲线长度是否大于给定 epsilon。 */
    hasLength(epsilon?: number): boolean;
    /**
     * 曲线是否表现为直线：没有手柄，
     * 或手柄与锚点连线共线且
     * 不超出该线段。
     */
    isStraight(): boolean;
    /** 曲线是否是参数线性的。 */
    isLinear(): boolean;
    /** 两条曲线是否描述共线的直线。 */
    isCollinear(curve: Curve | null): boolean;
    /** 曲线是否为水平直线。 */
    isHorizontal(): boolean;
    /** 曲线是否为竖直直线。 */
    isVertical(): boolean;
    /** 给定偏移处的曲线位置；超出范围时为 `null`。 */
    getLocationAt(offset: number): CurveLocation | null;
    /** 给定 curve-time 处的曲线位置；超出范围时为 `null`。 */
    getLocationAtTime(time: number | null): CurveLocation | null;
    /**
     * 给定偏移处相对可选起点的 curve-time，
     * 若偏移超出曲线长度则返回 `null`。
     */
    getTimeAt(offset: number, start?: number): number | null;
    /** 若点在曲线上，返回其 curve-time。 */
    getTimeOf(point: Point): number | null;
    /**
     * 曲线与给定切线相切处的 curve-time 参数，
     * 至多两个。起点或终点处的切线也包含在内。
     */
    getTimesWithTangent(tangent: Point): number[];
    /** 若点在曲线上，返回到该点的路径长度。 */
    getOffsetOf(point: Point): number | null;
    /** 曲线上距离给定点最近的位置。 */
    getNearestLocation(point: Point): CurveLocation;
    /** 曲线上距离给定点最近的点。 */
    getNearestPoint(point: Point): Point | null;
    getPointAt(location: number): Point | null;
    getPointAtTime(time: number): Point | null;
    getTangentAt(location: number): Point | null;
    getTangentAtTime(time: number): Point | null;
    getNormalAt(location: number): Point | null;
    getNormalAtTime(time: number): Point | null;
    getWeightedTangentAt(location: number): Point | null;
    getWeightedTangentAtTime(time: number): Point | null;
    getWeightedNormalAt(location: number): Point | null;
    getWeightedNormalAtTime(time: number): Point | null;
    getCurvatureAt(location: number): number;
    getCurvatureAtTime(time: number): number;
    /** 与另一条曲线的所有交点；不传则为自交点。 */
    getIntersections(curve?: Curve | null): CurveLocation[];
    /** 曲线几何的 8 个值：point1、handle1、handle2、point2。 */
    static getValues(segment1: Segment, segment2: Segment, matrix?: Matrix, straight?: boolean): number[];
    /** 在 `t` 处把曲线值分成左右两条子曲线。 */
    static subdivide(v: number[], t?: number): number[][];
    /**
     * 把曲线值拆成在指定坐标方向上单调的若干曲线，
     * `dir` 为 false 表示 x 方向，为 true 表示 y 方向。
     */
    static getMonoCurves(v: number[], dir?: boolean): number[][];
    /**
     * 把某一坐标轴上的点坐标 (p0, p1, p2, p3) 转换为
     * 多项式系数，并对 `val` 求解该多项式。
     */
    static solveCubic(v: number[], coord: number, val: number, roots: number[], min?: number, max?: number): number;
    /** 给定 curve-time 区间内的子曲线；`from > to` 时反向。 */
    static getPart(v: number[], from: number, to: number): number[];
    /**
     * 曲线是否足够平坦，即表现为一条
     * 偏差在 `flatness` 容差内的直线。
     */
    static isFlatEnough(v: number[], flatness: number): boolean;
    /** 曲线几何覆盖的面积。 */
    static getArea(v: number[]): number;
    /**
     * `Path.getBounds()` 的私有辅助函数：求贝塞尔曲线导数多项式的
     * 零交点，以确定计算曲线边界时的
     * 潜在极值。
     */
    static _addBounds(v0: number, v1: number, v2: number, v3: number, coord: number, padding: number, min: number[], max: number[], roots: number[]): void;
    /** 判断三次贝塞尔曲线的类型，并求出其根。 */
    static classify(v: number[]): CurveClassification;
    /** 曲线长度，或 `a` 到 `b` 之间部分的长度。 */
    static getLength(v: number[], a?: number, b?: number, ds?: (t: number) => number): number;
    /** 给定偏移处相对可选起点的 curve-time。 */
    static getTimeAt(v: number[], offset: number, start?: number): number | null;
    /** 若点在曲线上，返回其 curve-time。 */
    static getTimeOf(v: number[], point: Point, tolerance?: number): number | null;
    /** 距离给定点最近的 curve-time。 */
    static getNearestTime(v: number[], point: Point): number;
    /** 给定 curve-time 处的曲线点。 */
    static getPoint(v: number[], t: number | null): Point | null;
    /** 给定 curve-time 处的归一化切线。 */
    static getTangent(v: number[], t: number | null): Point | null;
    /** 给定 curve-time 处的加权切线。 */
    static getWeightedTangent(v: number[], t: number | null): Point | null;
    /** 给定 curve-time 处的归一化法线。 */
    static getNormal(v: number[], t: number | null): Point | null;
    /** 给定 curve-time 处的加权法线。 */
    static getWeightedNormal(v: number[], t: number | null): Point | null;
    /** 给定 curve-time 处的曲率。 */
    static getCurvature(v: number[], t: number | null): number;
    /**
     * 曲线“峰值”处的 t 值，即一阶与二阶导数
     * 点积的根。峰值与曲率极值有相似性质，
     * 但计算代价更低。
     */
    static getPeaks(v: number[]): number[];
    /**
     * 曲线沿其所有控制点所在直线（容差内）反向处的
     * 时间值，若存在。
     */
    static getReversals(v: number[], tolerance: number): number[];
    /**
     * 曲线与给定切线相切处的 curve-time 参数，
     * 至多两个。起点或终点处的切线也包含在内。
     */
    static getTimesWithTangent(v: number[], tangent: Point): number[];
    /** 曲线值是否描述一条直线。 */
    static isStraight(v: number[], epsilon?: number): boolean;
    /** 曲线值是否描述参数线性的曲线。 */
    static isLinear(v: number[], epsilon?: number): boolean;
    /** 两条曲线的重叠部分，以 curve-time 对表示。 */
    static getOverlaps(v1: number[], v2: number[], tolerance?: number): number[][] | null;
    /** 两组曲线之间的所有交点。 */
    static getIntersections(curves1: Curve[], curves2?: Curve[] | null, include?: ((location: CurveLocation) => boolean) | null, matrix1?: Matrix, matrix2?: Matrix, _returnFirst?: boolean, _tolerance?: number, _collisions?: (number[] | null)[] | null): CurveLocation[];
}
