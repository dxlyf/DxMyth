import { Formatter } from "../util/Formatter.js";
import { Numerical } from "../util/Numerical.js";
function toPoint(value) {
  return typeof value === "number" ? new Point(value, value) : value;
}
class Point {
  _x;
  _y;
  /** 向量长度被设为 0 时保留的角度。 */
  _angle;
  constructor(x = 0, y = 0) {
    this._x = x;
    this._y = y;
  }
  get x() {
    return this._x;
  }
  set x(x) {
    this._x = x;
  }
  get y() {
    return this._y;
  }
  set y(y) {
    this._y = y;
  }
  /** 一次性设置两个坐标。 */
  _set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  equals(point) {
    return this === point || this.x === point.x && this.y === point.y;
  }
  clone() {
    return new Point(this.x, this.y);
  }
  toString() {
    const f = Formatter.instance;
    return "{ x: " + f.number(this.x) + ", y: " + f.number(this.y) + " }";
  }
  // ---------------------------------------------------------------------
  // 坐标、长度、角度
  /** 点的坐标数组，`[x, y]`。 */
  get values() {
    return [this.x, this.y];
  }
  /** 该点所表示向量的长度。 */
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  set length(length) {
    if (this.isZero()) {
      const angle = this._angle || 0;
      this._set(
        Math.cos(angle) * length,
        Math.sin(angle) * length
      );
    } else {
      const scale = length / this.length;
      if (Numerical.isZero(scale))
        void this.angle;
      this._set(
        this.x * scale,
        this.y * scale
      );
    }
  }
  /** 向量角度，单位为度，从 x 轴量起。 */
  get angle() {
    return this.angleInRadians * 180 / Math.PI;
  }
  set angle(angle) {
    this.angleInRadians = angle * Math.PI / 180;
  }
  /** 向量角度，单位为弧度，从 x 轴量起。 */
  get angleInRadians() {
    return this.isZero() ? this._angle || 0 : this._angle = Math.atan2(this.y, this.x);
  }
  set angleInRadians(angle) {
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
  get quadrant() {
    return this.x >= 0 ? this.y >= 0 ? 1 : 4 : this.y >= 0 ? 2 : 3;
  }
  /** 两个向量之间的较小夹角，单位为度。 */
  getAngle(point) {
    return this.getAngleInRadians(point) * 180 / Math.PI;
  }
  /** 两个向量之间的较小夹角，单位为弧度。 */
  getAngleInRadians(point) {
    const div = this.length * point.length;
    if (Numerical.isZero(div)) {
      return NaN;
    } else {
      const a = this.dot(point) / div;
      return Math.acos(a < -1 ? -1 : a > 1 ? 1 : a);
    }
  }
  /** 两个向量之间的有向夹角，单位为度。 */
  getDirectedAngle(point) {
    return Math.atan2(this.cross(point), this.dot(point)) * 180 / Math.PI;
  }
  /** 到另一个点的距离；`squared` 为真时返回距离的平方。 */
  getDistance(point, squared) {
    const x = point.x - this.x, y = point.y - this.y, d = x * x + y * y;
    return squared ? d : Math.sqrt(d);
  }
  /** 长度归一化为 `length`、角度不变的新点。 */
  normalize(length = 1) {
    const current = this.length, scale = current !== 0 ? length / current : 0, point = new Point(this.x * scale, this.y * scale);
    if (scale >= 0)
      point._angle = this._angle;
    return point;
  }
  /** 绕可选的中心点旋转指定角度后的新点。 */
  rotate(angle, center) {
    if (angle === 0)
      return this.clone();
    angle = angle * Math.PI / 180;
    let point = center ? this.subtract(center) : this;
    const sin = Math.sin(angle), cos = Math.cos(angle);
    point = new Point(
      point.x * cos - point.y * sin,
      point.x * sin + point.y * cos
    );
    return center ? point.add(center) : point;
  }
  /** 用矩阵变换该点后返回新点。 */
  transform(matrix) {
    return matrix._transformPoint(this);
  }
  add(value) {
    const point = toPoint(value);
    return new Point(this.x + point.x, this.y + point.y);
  }
  subtract(value) {
    const point = toPoint(value);
    return new Point(this.x - point.x, this.y - point.y);
  }
  multiply(value) {
    const point = toPoint(value);
    return new Point(this.x * point.x, this.y * point.y);
  }
  divide(value) {
    const point = toPoint(value);
    return new Point(this.x / point.x, this.y / point.y);
  }
  modulo(value) {
    const point = toPoint(value);
    return new Point(this.x % point.x, this.y % point.y);
  }
  /** 两个坐标都取负的新点。 */
  negate() {
    return new Point(-this.x, -this.y);
  }
  /** 该点与另一个点的距离是否在 `tolerance` 之内。 */
  isClose(point, tolerance) {
    return this.getDistance(point) <= tolerance;
  }
  /** 该向量与另一个向量是否共线（平行）。 */
  isCollinear(point) {
    return Point.isCollinear(this.x, this.y, point.x, point.y);
  }
  /** 该向量与另一个向量是否正交（垂直）。 */
  isOrthogonal(point) {
    return Point.isOrthogonal(this.x, this.y, point.x, point.y);
  }
  /** 两个坐标是否在 1e-12 容差内都为 0。 */
  isZero() {
    const isZero = Numerical.isZero;
    return isZero(this.x) && isZero(this.y);
  }
  /** 是否至少有一个坐标不是数字。 */
  isNaN() {
    return isNaN(this.x) || isNaN(this.y);
  }
  /** 向量是否落在指定象限内。 */
  isInQuadrant(q) {
    return this.x * (q > 1 && q < 4 ? -1 : 1) >= 0 && this.y * (q > 2 ? -1 : 1) >= 0;
  }
  /** 该点与另一个点的点积。 */
  dot(point) {
    return this.x * point.x + this.y * point.y;
  }
  /** 该点与另一个点的叉积。 */
  cross(point) {
    return this.x * point.y - this.y * point.x;
  }
  /** 该点在另一个点上的投影。 */
  project(point) {
    const scale = point.isZero() ? 0 : this.dot(point) / point.dot(point);
    return new Point(
      point.x * scale,
      point.y * scale
    );
  }
  /** 坐标被限制在给定范围内的新点。 */
  clamp(min, max) {
    return new Point(
      Numerical.clamp(this.x, min.x, max.x),
      Numerical.clamp(this.y, min.y, max.y)
    );
  }
  /** 坐标四舍五入后的新点。 */
  round() {
    return new Point(Math.round(this.x), Math.round(this.y));
  }
  /** 坐标向上取整后的新点。 */
  ceil() {
    return new Point(Math.ceil(this.x), Math.ceil(this.y));
  }
  /** 坐标向下取整后的新点。 */
  floor() {
    return new Point(Math.floor(this.x), Math.floor(this.y));
  }
  /** 坐标取绝对值后的新点。 */
  abs() {
    return new Point(Math.abs(this.x), Math.abs(this.y));
  }
  // ---------------------------------------------------------------------
  // 静态方法
  /** 取两个点中 x、y 各自最小的新点。 */
  static min(point1, point2) {
    return new Point(
      Math.min(point1.x, point2.x),
      Math.min(point1.y, point2.y)
    );
  }
  /** 取两个点中 x、y 各自最大的新点。 */
  static max(point1, point2) {
    return new Point(
      Math.max(point1.x, point2.x),
      Math.max(point1.y, point2.y)
    );
  }
  /** x、y 为 0 到 1 之间随机值的点。 */
  static random() {
    return new Point(Math.random(), Math.random());
  }
  static isCollinear(x1, y1, x2, y2) {
    return Math.abs(x1 * y2 - y1 * x2) <= Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2)) * Numerical.TRIGONOMETRIC_EPSILON;
  }
  static isOrthogonal(x1, y1, x2, y2) {
    return Math.abs(x1 * x2 + y1 * y2) <= Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2)) * Numerical.TRIGONOMETRIC_EPSILON;
  }
}
export {
  Point
};
