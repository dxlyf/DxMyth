import { Point } from "./Point.js";
import { Size } from "./Size.js";
import { Formatter } from "../util/Formatter.js";
class Rectangle {
  x;
  y;
  width;
  height;
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  /** 一次性设置位置和尺寸。 */
  _set(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    return this;
  }
  equals(rect) {
    return rect === this || !!rect && this.x === rect.x && this.y === rect.y && this.width === rect.width && this.height === rect.height;
  }
  clone() {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }
  toString() {
    const f = Formatter.instance;
    return "{ x: " + f.number(this.x) + ", y: " + f.number(this.y) + ", width: " + f.number(this.width) + ", height: " + f.number(this.height) + " }";
  }
  /** 位置与尺寸数组，`[x, y, width, height]`。 */
  get values() {
    return [this.x, this.y, this.width, this.height];
  }
  // ---------------------------------------------------------------------
  // 位置与尺寸
  /** 左上角点。设置它会整体移动矩形。 */
  get point() {
    return new Point(this.x, this.y);
  }
  set point(point) {
    this.x = point.x;
    this.y = point.y;
  }
  /** 尺寸。设置它只改变宽高，不移动位置。 */
  get size() {
    return new Size(this.width, this.height);
  }
  set size(size) {
    this.width = size.width;
    this.height = size.height;
  }
  /** 左边位置。设置时右边不动。 */
  get left() {
    return this.x;
  }
  set left(left) {
    this.width -= left - this.x;
    this.x = left;
  }
  /** 上边位置。设置时下边不动。 */
  get top() {
    return this.y;
  }
  set top(top) {
    this.height -= top - this.y;
    this.y = top;
  }
  /** 右边位置。设置时左边不动。 */
  get right() {
    return this.x + this.width;
  }
  set right(right) {
    this.width = right - this.x;
  }
  /** 下边位置。设置时上边不动。 */
  get bottom() {
    return this.y + this.height;
  }
  set bottom(bottom) {
    this.height = bottom - this.y;
  }
  /** 中心 x 坐标。设置时整体水平移动。 */
  get centerX() {
    return this.x + this.width / 2;
  }
  set centerX(x) {
    this.x = x - this.width / 2;
  }
  /** 中心 y 坐标。设置时整体垂直移动。 */
  get centerY() {
    return this.y + this.height / 2;
  }
  set centerY(y) {
    this.y = y - this.height / 2;
  }
  /** 中心点。设置时整体移动。 */
  get center() {
    return new Point(this.centerX, this.centerY);
  }
  set center(center) {
    this.centerX = center.x;
    this.centerY = center.y;
  }
  /** 左上角点，只读。 */
  get topLeft() {
    return new Point(this.x, this.y);
  }
  /** 右上角点，只读。 */
  get topRight() {
    return new Point(this.x + this.width, this.y);
  }
  /** 左下角点，只读。 */
  get bottomLeft() {
    return new Point(this.x, this.y + this.height);
  }
  /** 右下角点，只读。 */
  get bottomRight() {
    return new Point(this.x + this.width, this.y + this.height);
  }
  /** 面积。 */
  get area() {
    return this.width * this.height;
  }
  /** 矩形是否为空（宽或高为 0）。 */
  isEmpty() {
    return this.width === 0 || this.height === 0;
  }
  // ---------------------------------------------------------------------
  // 几何判断
  /** 点是否在矩形边界内（含边界）。 */
  contains(point) {
    return this._containsPoint(point);
  }
  _containsPoint(point) {
    const x = point.x, y = point.y;
    return x >= this.x && y >= this.y && x <= this.x + this.width && y <= this.y + this.height;
  }
  /** 该矩形是否完整包含另一个矩形。 */
  _containsRectangle(rect) {
    const x = rect.x, y = rect.y;
    return x >= this.x && y >= this.y && x + rect.width <= this.x + this.width && y + rect.height <= this.y + this.height;
  }
  /**
   * 两个矩形的内部是否相交。仅相接触视为不相交，除非通过 `epsilon` 把本
   * 矩形放大后再比较。
   */
  intersects(rect, epsilon = 0) {
    return rect.x + rect.width > this.x - epsilon && rect.y + rect.height > this.y - epsilon && rect.x < this.x + this.width + epsilon && rect.y < this.y + this.height + epsilon;
  }
  /** 返回两个矩形的交集矩形。 */
  intersect(rect) {
    const x1 = Math.max(this.x, rect.x), y1 = Math.max(this.y, rect.y), x2 = Math.min(this.x + this.width, rect.x + rect.width), y2 = Math.min(this.y + this.height, rect.y + rect.height);
    return new Rectangle(x1, y1, x2 - x1, y2 - y1);
  }
  /** 返回同时包含两个矩形的最小矩形。 */
  unite(rect) {
    const x1 = Math.min(this.x, rect.x), y1 = Math.min(this.y, rect.y), x2 = Math.max(this.x + this.width, rect.x + rect.width), y2 = Math.max(this.y + this.height, rect.y + rect.height);
    return new Rectangle(x1, y1, x2 - x1, y2 - y1);
  }
  /** 返回同时包含本矩形和该点的最小矩形。 */
  include(point) {
    const x1 = Math.min(this.x, point.x), y1 = Math.min(this.y, point.y), x2 = Math.max(this.x + this.width, point.x), y2 = Math.max(this.y + this.height, point.y);
    return new Rectangle(x1, y1, x2 - x1, y2 - y1);
  }
  /** 返回水平和垂直方向各扩大 `hor`/`ver` 后的新矩形。 */
  expand(hor, ver = hor) {
    return new Rectangle(
      this.x - hor / 2,
      this.y - ver / 2,
      this.width + hor,
      this.height + ver
    );
  }
  /**
   * 返回以中心（或指定中心点）为基准缩放后的新矩形。
   * 负的缩放因子同样会得到规范化（宽高为正）的矩形。
   */
  scale(sx, sy = sx, center) {
    const c = center || this.center, factor = new Point(sx, sy), tl = this.topLeft.subtract(c).multiply(factor).add(c), br = this.bottomRight.subtract(c).multiply(factor).add(c);
    return new Rectangle(
      Math.min(tl.x, br.x),
      Math.min(tl.y, br.y),
      Math.abs(br.x - tl.x),
      Math.abs(br.y - tl.y)
    );
  }
  /** 返回平移后的新矩形。 */
  translate(dx, dy) {
    return new Rectangle(
      this.x + dx,
      this.y + dy,
      this.width,
      this.height
    );
  }
  /**
   * 返回用矩阵变换四个角后得到的新包围矩形。
   * （原文由 `Item#bounds` 通过 `Matrix#_transformBounds` 完成。）
   */
  transform(matrix) {
    const coords = [
      this.x,
      this.y,
      this.x + this.width,
      this.y,
      this.x + this.width,
      this.y + this.height,
      this.x,
      this.y + this.height
    ];
    matrix._transformCoordinates(coords, coords, 4);
    let minX = coords[0], maxX = coords[0], minY = coords[1], maxY = coords[1];
    for (let i = 2; i < 8; i += 2) {
      const x = coords[i], y = coords[i + 1];
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
  round() {
    return new Rectangle(
      Math.round(this.x),
      Math.round(this.y),
      Math.round(this.width),
      Math.round(this.height)
    );
  }
  ceil() {
    return new Rectangle(
      Math.ceil(this.x),
      Math.ceil(this.y),
      Math.ceil(this.width),
      Math.ceil(this.height)
    );
  }
  floor() {
    return new Rectangle(
      Math.floor(this.x),
      Math.floor(this.y),
      Math.floor(this.width),
      Math.floor(this.height)
    );
  }
}
export {
  Rectangle
};
