/**
 * 移植自 paper/src/basic/Rectangle.js，只保留几何核心。
 *
 * 构造形式只有 `new Rectangle(x, y, width, height)`。不移植参数解析机制、
 * 序列化、`LinkedRectangle`，也不依赖 `Item`。
 *
 * `transform()` / `round()` / `ceil()` / `floor()` 在原文中并不存在（原文只有
 * Point/Size 有），这里按需要补上，实现方式与 `Size` 保持一致。
 */

import { Point } from './Point';
import { Size } from './Size';
import type { Matrix } from './Matrix';
import { Formatter } from '../util/Formatter';

export class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /** 一次性设置位置和尺寸。 */
    _set(x: number, y: number, width: number, height: number): this {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    }

    equals(rect: Rectangle | null): boolean {
        return rect === this || !!rect
                && this.x === rect.x && this.y === rect.y
                && this.width === rect.width && this.height === rect.height;
    }

    clone(): Rectangle {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    toString(): string {
        const f = Formatter.instance;
        return '{ x: ' + f.number(this.x)
                + ', y: ' + f.number(this.y)
                + ', width: ' + f.number(this.width)
                + ', height: ' + f.number(this.height)
                + ' }';
    }

    /** 位置与尺寸数组，`[x, y, width, height]`。 */
    get values(): number[] {
        return [this.x, this.y, this.width, this.height];
    }

    // ---------------------------------------------------------------------
    // 位置与尺寸

    /** 左上角点。设置它会整体移动矩形。 */
    get point(): Point {
        return new Point(this.x, this.y);
    }

    set point(point: Point) {
        this.x = point.x;
        this.y = point.y;
    }

    /** 尺寸。设置它只改变宽高，不移动位置。 */
    get size(): Size {
        return new Size(this.width, this.height);
    }

    set size(size: Size) {
        this.width = size.width;
        this.height = size.height;
    }

    /** 左边位置。设置时右边不动。 */
    get left(): number {
        return this.x;
    }

    set left(left: number) {
        this.width -= left - this.x;
        this.x = left;
    }

    /** 上边位置。设置时下边不动。 */
    get top(): number {
        return this.y;
    }

    set top(top: number) {
        this.height -= top - this.y;
        this.y = top;
    }

    /** 右边位置。设置时左边不动。 */
    get right(): number {
        return this.x + this.width;
    }

    set right(right: number) {
        this.width = right - this.x;
    }

    /** 下边位置。设置时上边不动。 */
    get bottom(): number {
        return this.y + this.height;
    }

    set bottom(bottom: number) {
        this.height = bottom - this.y;
    }

    /** 中心 x 坐标。设置时整体水平移动。 */
    get centerX(): number {
        return this.x + this.width / 2;
    }

    set centerX(x: number) {
        this.x = x - this.width / 2;
    }

    /** 中心 y 坐标。设置时整体垂直移动。 */
    get centerY(): number {
        return this.y + this.height / 2;
    }

    set centerY(y: number) {
        this.y = y - this.height / 2;
    }

    /** 中心点。设置时整体移动。 */
    get center(): Point {
        return new Point(this.centerX, this.centerY);
    }

    set center(center: Point) {
        this.centerX = center.x;
        this.centerY = center.y;
    }

    /** 左上角点，只读。 */
    get topLeft(): Point {
        return new Point(this.x, this.y);
    }

    /** 右上角点，只读。 */
    get topRight(): Point {
        return new Point(this.x + this.width, this.y);
    }

    /** 左下角点，只读。 */
    get bottomLeft(): Point {
        return new Point(this.x, this.y + this.height);
    }

    /** 右下角点，只读。 */
    get bottomRight(): Point {
        return new Point(this.x + this.width, this.y + this.height);
    }

    /** 面积。 */
    get area(): number {
        return this.width * this.height;
    }

    /** 矩形是否为空（宽或高为 0）。 */
    isEmpty(): boolean {
        return this.width === 0 || this.height === 0;
    }

    // ---------------------------------------------------------------------
    // 几何判断

    /** 点是否在矩形边界内（含边界）。 */
    contains(point: Point): boolean {
        return this._containsPoint(point);
    }

    _containsPoint(point: Point): boolean {
        const x = point.x,
            y = point.y;
        return x >= this.x && y >= this.y
                && x <= this.x + this.width
                && y <= this.y + this.height;
    }

    /** 该矩形是否完整包含另一个矩形。 */
    _containsRectangle(rect: Rectangle): boolean {
        const x = rect.x,
            y = rect.y;
        return x >= this.x && y >= this.y
                && x + rect.width <= this.x + this.width
                && y + rect.height <= this.y + this.height;
    }

    /**
     * 两个矩形的内部是否相交。仅相接触视为不相交，除非通过 `epsilon` 把本
     * 矩形放大后再比较。
     */
    intersects(rect: Rectangle, epsilon = 0): boolean {
        return rect.x + rect.width > this.x - epsilon
                && rect.y + rect.height > this.y - epsilon
                && rect.x < this.x + this.width + epsilon
                && rect.y < this.y + this.height + epsilon;
    }

    /** 返回两个矩形的交集矩形。 */
    intersect(rect: Rectangle): Rectangle {
        const x1 = Math.max(this.x, rect.x),
            y1 = Math.max(this.y, rect.y),
            x2 = Math.min(this.x + this.width, rect.x + rect.width),
            y2 = Math.min(this.y + this.height, rect.y + rect.height);
        return new Rectangle(x1, y1, x2 - x1, y2 - y1);
    }

    /** 返回同时包含两个矩形的最小矩形。 */
    unite(rect: Rectangle): Rectangle {
        const x1 = Math.min(this.x, rect.x),
            y1 = Math.min(this.y, rect.y),
            x2 = Math.max(this.x + this.width, rect.x + rect.width),
            y2 = Math.max(this.y + this.height, rect.y + rect.height);
        return new Rectangle(x1, y1, x2 - x1, y2 - y1);
    }

    /** 返回同时包含本矩形和该点的最小矩形。 */
    include(point: Point): Rectangle {
        const x1 = Math.min(this.x, point.x),
            y1 = Math.min(this.y, point.y),
            x2 = Math.max(this.x + this.width, point.x),
            y2 = Math.max(this.y + this.height, point.y);
        return new Rectangle(x1, y1, x2 - x1, y2 - y1);
    }

    /** 返回水平和垂直方向各扩大 `hor`/`ver` 后的新矩形。 */
    expand(hor: number, ver = hor): Rectangle {
        return new Rectangle(this.x - hor / 2, this.y - ver / 2,
                this.width + hor, this.height + ver);
    }

    /**
     * 返回以中心（或指定中心点）为基准缩放后的新矩形。
     * 负的缩放因子同样会得到规范化（宽高为正）的矩形。
     */
    scale(sx: number, sy = sx, center?: Point): Rectangle {
        const c = center || this.center,
            factor = new Point(sx, sy),
            tl = this.topLeft.subtract(c).multiply(factor).add(c),
            br = this.bottomRight.subtract(c).multiply(factor).add(c);
        return new Rectangle(
            Math.min(tl.x, br.x),
            Math.min(tl.y, br.y),
            Math.abs(br.x - tl.x),
            Math.abs(br.y - tl.y));
    }

    /** 返回平移后的新矩形。 */
    translate(dx: number, dy: number): Rectangle {
        return new Rectangle(this.x + dx, this.y + dy,
                this.width, this.height);
    }

    /**
     * 返回用矩阵变换四个角后得到的新包围矩形。
     * （原文由 `Item#bounds` 通过 `Matrix#_transformBounds` 完成。）
     */
    transform(matrix: Matrix): Rectangle {
        const coords = [
            this.x, this.y,
            this.x + this.width, this.y,
            this.x + this.width, this.y + this.height,
            this.x, this.y + this.height
        ];
        matrix._transformCoordinates(coords, coords, 4);
        let minX = coords[0],
            maxX = coords[0],
            minY = coords[1],
            maxY = coords[1];
        for (let i = 2; i < 8; i += 2) {
            const x = coords[i],
                y = coords[i + 1];
            if (x < minX)
                minX = x;
            else if (x > maxX)
                maxX = x;
            if (y < minY)
                minY = y;
            else if (y > maxY)
                maxY = y;
        }
        return new Rectangle(minX, minY, maxX - minX, maxY - minY);
    }

    round(): Rectangle {
        return new Rectangle(Math.round(this.x), Math.round(this.y),
                Math.round(this.width), Math.round(this.height));
    }

    ceil(): Rectangle {
        return new Rectangle(Math.ceil(this.x), Math.ceil(this.y),
                Math.ceil(this.width), Math.ceil(this.height));
    }

    floor(): Rectangle {
        return new Rectangle(Math.floor(this.x), Math.floor(this.y),
                Math.floor(this.width), Math.floor(this.height));
    }
}
