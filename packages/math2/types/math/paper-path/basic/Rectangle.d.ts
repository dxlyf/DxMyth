import { Point } from './Point';
import { Size } from './Size';
import { Matrix } from './Matrix';
export declare class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x?: number, y?: number, width?: number, height?: number);
    /** 一次性设置位置和尺寸。 */
    _set(x: number, y: number, width: number, height: number): this;
    equals(rect: Rectangle | null): boolean;
    clone(): Rectangle;
    toString(): string;
    /** 位置与尺寸数组，`[x, y, width, height]`。 */
    get values(): number[];
    /** 左上角点。设置它会整体移动矩形。 */
    get point(): Point;
    set point(point: Point);
    /** 尺寸。设置它只改变宽高，不移动位置。 */
    get size(): Size;
    set size(size: Size);
    /** 左边位置。设置时右边不动。 */
    get left(): number;
    set left(left: number);
    /** 上边位置。设置时下边不动。 */
    get top(): number;
    set top(top: number);
    /** 右边位置。设置时左边不动。 */
    get right(): number;
    set right(right: number);
    /** 下边位置。设置时上边不动。 */
    get bottom(): number;
    set bottom(bottom: number);
    /** 中心 x 坐标。设置时整体水平移动。 */
    get centerX(): number;
    set centerX(x: number);
    /** 中心 y 坐标。设置时整体垂直移动。 */
    get centerY(): number;
    set centerY(y: number);
    /** 中心点。设置时整体移动。 */
    get center(): Point;
    set center(center: Point);
    /** 左上角点，只读。 */
    get topLeft(): Point;
    /** 右上角点，只读。 */
    get topRight(): Point;
    /** 左下角点，只读。 */
    get bottomLeft(): Point;
    /** 右下角点，只读。 */
    get bottomRight(): Point;
    /** 面积。 */
    get area(): number;
    /** 矩形是否为空（宽或高为 0）。 */
    isEmpty(): boolean;
    /** 点是否在矩形边界内（含边界）。 */
    contains(point: Point): boolean;
    _containsPoint(point: Point): boolean;
    /** 该矩形是否完整包含另一个矩形。 */
    _containsRectangle(rect: Rectangle): boolean;
    /**
     * 两个矩形的内部是否相交。仅相接触视为不相交，除非通过 `epsilon` 把本
     * 矩形放大后再比较。
     */
    intersects(rect: Rectangle, epsilon?: number): boolean;
    /** 返回两个矩形的交集矩形。 */
    intersect(rect: Rectangle): Rectangle;
    /** 返回同时包含两个矩形的最小矩形。 */
    unite(rect: Rectangle): Rectangle;
    /** 返回同时包含本矩形和该点的最小矩形。 */
    include(point: Point): Rectangle;
    /** 返回水平和垂直方向各扩大 `hor`/`ver` 后的新矩形。 */
    expand(hor: number, ver?: number): Rectangle;
    /**
     * 返回以中心（或指定中心点）为基准缩放后的新矩形。
     * 负的缩放因子同样会得到规范化（宽高为正）的矩形。
     */
    scale(sx: number, sy?: number, center?: Point): Rectangle;
    /** 返回平移后的新矩形。 */
    translate(dx: number, dy: number): Rectangle;
    /**
     * 返回用矩阵变换四个角后得到的新包围矩形。
     * （原文由 `Item#bounds` 通过 `Matrix#_transformBounds` 完成。）
     */
    transform(matrix: Matrix): Rectangle;
    round(): Rectangle;
    ceil(): Rectangle;
    floor(): Rectangle;
}
