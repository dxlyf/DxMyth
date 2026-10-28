/**
 * 移植自 paper/src/basic/Point.js，只保留几何核心。
 *
 * 构造形式只有 `new Point(x, y)`：参数解析机制（`Point.read()`、数组、
 * `{x, y}` 字面量、字符串）已移除，序列化、选中状态和 Base 类也不再保留。
 * 调用方直接传数字。
 *
 * 坐标存放在 `_x`/`_y` 上，通过 `x`/`y` 访问器读写，这样 SegmentPoint 可以
 * 覆盖访问器并通知它所属的 segment。
 */

import { Formatter } from '../util/Formatter';
import { Numerical } from '../util/Numerical';
import type { Matrix } from './Matrix';

/** 把数字转成两个坐标都等于它的点。 */
function toPoint(value: Point | number): Point {
    return typeof value === 'number' ? new Point(value, value) : value;
}

export class Point {
    _x: number;
    _y: number;
    /** 向量长度被设为 0 时保留的角度。 */
    _angle?: number;

    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    set x(x: number) {
        this._x = x;
    }

    get y(): number {
        return this._y;
    }

    set y(y: number) {
        this._y = y;
    }

    /** 一次性设置两个坐标。 */
    _set(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }

    equals(point: Point): boolean {
        return this === point || this.x === point.x && this.y === point.y;
    }

    clone(): Point {
        return new Point(this.x, this.y);
    }

    toString(): string {
        const f = Formatter.instance;
        return '{ x: ' + f.number(this.x) + ', y: ' + f.number(this.y) + ' }';
    }

    // ---------------------------------------------------------------------
    // 坐标、长度、角度

    /** 点的坐标数组，`[x, y]`。 */
    get values(): number[] {
        return [this.x, this.y];
    }

    /** 该点所表示向量的长度。 */
    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set length(length: number) {
        if (this.isZero()) {
            const angle = this._angle || 0;
            this._set(
                Math.cos(angle) * length,
                Math.sin(angle) * length
            );
        } else {
            const scale = length / this.length;
            // 立即计算角度，这样即使 x、y 之后变成 0 也能保留它。
            if (Numerical.isZero(scale))
                void this.angle;
            this._set(
                this.x * scale,
                this.y * scale
            );
        }
    }

    /** 向量角度，单位为度，从 x 轴量起。 */
    get angle(): number {
        return this.angleInRadians * 180 / Math.PI;
    }

    set angle(angle: number) {
        this.angleInRadians = angle * Math.PI / 180;
    }

    /** 向量角度，单位为弧度，从 x 轴量起。 */
    get angleInRadians(): number {
        // 向量没有长度时返回保留的角度，有长度时顺便更新内部的 _angle。
        return this.isZero()
                ? this._angle || 0
                : this._angle = Math.atan2(this.y, this.x);
    }

    set angleInRadians(angle: number) {
        // 保留 _angle，使它在长度被设为 0 之后仍然存在。
        this._angle = angle;
        if (!this.isZero()) {
            const length = this.length;
            this._set(
                Math.cos(angle) * length,
                Math.sin(angle) * length
            );
        }
    }

    /**
     * {@link #angle} 所在的象限:0-90 度为 1，90-180 度为 2，
     * 180-270 度为 3，270-360 度为 4。
     */
    get quadrant(): number {
        return this.x >= 0 ? this.y >= 0 ? 1 : 4 : this.y >= 0 ? 2 : 3;
    }

    /** 两个向量之间的较小夹角，单位为度。 */
    getAngle(point: Point): number {
        return this.getAngleInRadians(point) * 180 / Math.PI;
    }

    /** 两个向量之间的较小夹角，单位为弧度。 */
    getAngleInRadians(point: Point): number {
        const div = this.length * point.length;
        if (Numerical.isZero(div)) {
            return NaN;
        } else {
            const a = this.dot(point) / div;
            return Math.acos(a < -1 ? -1 : a > 1 ? 1 : a);
        }
    }

    /** 两个向量之间的有向夹角，单位为度。 */
    getDirectedAngle(point: Point): number {
        return Math.atan2(this.cross(point), this.dot(point)) * 180 / Math.PI;
    }

    /** 到另一个点的距离；`squared` 为真时返回距离的平方。 */
    getDistance(point: Point, squared?: boolean): number {
        const x = point.x - this.x,
            y = point.y - this.y,
            d = x * x + y * y;
        return squared ? d : Math.sqrt(d);
    }

    /** 长度归一化为 `length`、角度不变的新点。 */
    normalize(length = 1): Point {
        const current = this.length,
            scale = current !== 0 ? length / current : 0,
            point = new Point(this.x * scale, this.y * scale);
        // 保留角度。
        if (scale >= 0)
            point._angle = this._angle;
        return point;
    }

    /** 绕可选的中心点旋转指定角度后的新点。 */
    rotate(angle: number, center?: Point): Point {
        if (angle === 0)
            return this.clone();
        angle = angle * Math.PI / 180;
        let point = center ? this.subtract(center) : this;
        const sin = Math.sin(angle),
            cos = Math.cos(angle);
        point = new Point(
            point.x * cos - point.y * sin,
            point.x * sin + point.y * cos
        );
        return center ? point.add(center) : point;
    }

    /** 用矩阵变换该点后返回新点。 */
    transform(matrix: Matrix): Point {
        return matrix._transformPoint(this);
    }

    add(value: Point | number): Point {
        const point = toPoint(value);
        return new Point(this.x + point.x, this.y + point.y);
    }

    subtract(value: Point | number): Point {
        const point = toPoint(value);
        return new Point(this.x - point.x, this.y - point.y);
    }

    multiply(value: Point | number): Point {
        const point = toPoint(value);
        return new Point(this.x * point.x, this.y * point.y);
    }

    divide(value: Point | number): Point {
        const point = toPoint(value);
        return new Point(this.x / point.x, this.y / point.y);
    }

    modulo(value: Point | number): Point {
        const point = toPoint(value);
        return new Point(this.x % point.x, this.y % point.y);
    }

    /** 两个坐标都取负的新点。 */
    negate(): Point {
        return new Point(-this.x, -this.y);
    }

    /** 该点与另一个点的距离是否在 `tolerance` 之内。 */
    isClose(point: Point, tolerance: number): boolean {
        return this.getDistance(point) <= tolerance;
    }

    /** 该向量与另一个向量是否共线（平行）。 */
    isCollinear(point: Point): boolean {
        return Point.isCollinear(this.x, this.y, point.x, point.y);
    }

    /** 该向量与另一个向量是否正交（垂直）。 */
    isOrthogonal(point: Point): boolean {
        return Point.isOrthogonal(this.x, this.y, point.x, point.y);
    }

    /** 两个坐标是否在 1e-12 容差内都为 0。 */
    isZero(): boolean {
        const isZero = Numerical.isZero;
        return isZero(this.x) && isZero(this.y);
    }

    /** 是否至少有一个坐标不是数字。 */
    isNaN(): boolean {
        return isNaN(this.x) || isNaN(this.y);
    }

    /** 向量是否落在指定象限内。 */
    isInQuadrant(q: number): boolean {
        // 1: [ 1,  1]，2: [-1,  1]，3: [-1, -1]，4: [ 1, -1]
        return this.x * (q > 1 && q < 4 ? -1 : 1) >= 0
            && this.y * (q > 2 ? -1 : 1) >= 0;
    }

    /** 该点与另一个点的点积。 */
    dot(point: Point): number {
        return this.x * point.x + this.y * point.y;
    }

    /** 该点与另一个点的叉积。 */
    cross(point: Point): number {
        return this.x * point.y - this.y * point.x;
    }

    /** 该点在另一个点上的投影。 */
    project(point: Point): Point {
        const scale = point.isZero() ? 0 : this.dot(point) / point.dot(point);
        return new Point(
            point.x * scale,
            point.y * scale
        );
    }

    /** 坐标被限制在给定范围内的新点。 */
    clamp(min: Point, max: Point): Point {
        return new Point(
            Numerical.clamp(this.x, min.x, max.x),
            Numerical.clamp(this.y, min.y, max.y)
        );
    }

    /** 坐标四舍五入后的新点。 */
    round(): Point {
        return new Point(Math.round(this.x), Math.round(this.y));
    }

    /** 坐标向上取整后的新点。 */
    ceil(): Point {
        return new Point(Math.ceil(this.x), Math.ceil(this.y));
    }

    /** 坐标向下取整后的新点。 */
    floor(): Point {
        return new Point(Math.floor(this.x), Math.floor(this.y));
    }

    /** 坐标取绝对值后的新点。 */
    abs(): Point {
        return new Point(Math.abs(this.x), Math.abs(this.y));
    }

    // ---------------------------------------------------------------------
    // 静态方法

    /** 取两个点中 x、y 各自最小的新点。 */
    static min(point1: Point, point2: Point): Point {
        return new Point(
            Math.min(point1.x, point2.x),
            Math.min(point1.y, point2.y)
        );
    }

    /** 取两个点中 x、y 各自最大的新点。 */
    static max(point1: Point, point2: Point): Point {
        return new Point(
            Math.max(point1.x, point2.x),
            Math.max(point1.y, point2.y)
        );
    }

    /** x、y 为 0 到 1 之间随机值的点。 */
    static random(): Point {
        return new Point(Math.random(), Math.random());
    }

    static isCollinear(x1: number, y1: number, x2: number, y2: number): boolean {
        // 注意:这里不归一化向量，而是相应地缩放 epsilon。
        return Math.abs(x1 * y2 - y1 * x2)
                <= Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2))
                    * Numerical.TRIGONOMETRIC_EPSILON;
    }

    static isOrthogonal(x1: number, y1: number, x2: number, y2: number): boolean {
        // 参见 Point.isCollinear()
        return Math.abs(x1 * x2 + y1 * y2)
                <= Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2))
                    * Numerical.TRIGONOMETRIC_EPSILON;
    }
}
