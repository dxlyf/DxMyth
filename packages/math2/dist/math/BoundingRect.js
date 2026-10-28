import { Vector2 } from "./Vector2.js";
import { CachePool } from "./CachePool.js";
class BoundingRect {
  static pool = CachePool.create({
    initSize: 10,
    create: () => BoundingRect.default(),
    init: (item) => {
      item.setEmpty();
    }
  });
  // ---- 静态工厂 ----
  static default() {
    return new BoundingRect();
  }
  static zero() {
    return new BoundingRect(0, 0, 0, 0);
  }
  /** 从点列表计算包围盒 */
  static fromPoints(points) {
    const r = new BoundingRect();
    for (const p of points) {
      r.add(p.x, p.y);
    }
    return r;
  }
  /** 从 (x, y, width, height) 创建 */
  static fromXYWH(x, y, w, h) {
    return new BoundingRect(x, y, x + w, y + h);
  }
  /** 从 (left, top, right, bottom) 创建 */
  static fromLTRB(left, top, right, bottom) {
    return new BoundingRect(left, top, right, bottom);
  }
  /** 左下角（最小坐标） */
  min;
  /** 右上角（最大坐标） */
  max;
  constructor(minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity) {
    this.min = new Vector2(minX, minY);
    this.max = new Vector2(maxX, maxY);
  }
  // ---- 查询 ----
  get centerX() {
    return (this.min.x + this.max.x) / 2;
  }
  get centerY() {
    return (this.min.y + this.max.y) / 2;
  }
  get minX() {
    return this.min.x;
  }
  get minY() {
    return this.min.y;
  }
  get maxX() {
    return this.max.x;
  }
  get maxY() {
    return this.max.y;
  }
  /** 中心点 */
  get center() {
    return { x: this.centerX, y: this.centerY };
  }
  get left() {
    return this.min.x;
  }
  get top() {
    return this.min.y;
  }
  get right() {
    return this.max.x;
  }
  get bottom() {
    return this.max.y;
  }
  get x() {
    return this.min.x;
  }
  get y() {
    return this.min.y;
  }
  get width() {
    return this.max.x - this.min.x;
  }
  get height() {
    return this.max.y - this.min.y;
  }
  /** 面积 */
  area() {
    return this.width * this.height;
  }
  /** 是否为空（无有效范围） */
  isEmpty() {
    return this.min.x > this.max.x || this.min.y > this.max.y;
  }
  isZero() {
    return this.min.isZero() && this.max.isZero();
  }
  /** 点是否在包围盒内（含边界） */
  // contains(x: number, y: number): boolean {
  //     return x >= this.min.x && x <= this.max.x && y >= this.min.y && y <= this.max.y
  // }
  contains(x, y) {
    return !(x < this.left || x > this.right || y < this.top || y > this.bottom);
  }
  containsPoint(p) {
    return this.contains(p.x, p.y);
  }
  intersectionBox(box) {
    return !(this.left > box.right || this.right < box.left || this.top > box.bottom || this.bottom < box.top);
  }
  /** 是否与另一个包围盒相交 */
  intersects(other) {
    return !(this.max.x < other.min.x || this.min.x > other.max.x || this.max.y < other.min.y || this.min.y > other.max.y);
  }
  // ---- 写入 ----
  /** 重置为空 */
  setEmpty() {
    this.min.set(Infinity, Infinity);
    this.max.set(-Infinity, -Infinity);
    return this;
  }
  makeEmpty() {
    this.min.x = this.min.y = Infinity;
    this.max.x = this.max.y = -Infinity;
    return this;
  }
  makeZero() {
    this.min.x = this.min.y = 0;
    this.max.x = this.max.y = 0;
    return this;
  }
  isInfinity() {
    return this.min.x === Infinity || this.min.y === Infinity || this.max.x === -Infinity || this.max.y === -Infinity;
  }
  copy(other) {
    this.min.copy(other.min);
    this.max.copy(other.max);
    return this;
  }
  // ---- 扩展 ----
  /** 扩展包围盒以包含指定点 */
  add(x, y) {
    this.expandPoint({ x, y });
    return this;
  }
  fromCircle(cx, cy, radius) {
    this.min.set(cx - radius, cy - radius);
    this.max.set(cx + radius, cy + radius);
    return this;
  }
  fromLine(x0, y0, x1, y1, strokeWidth) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) {
      this.makeZero();
      return;
    }
    const ux = dx / length;
    const uy = dy / length;
    const nx = -uy;
    const ny = ux;
    const offsetX = nx * strokeWidth / 2;
    const offsetY = ny * strokeWidth / 2;
    const points = [
      { x: x0 - offsetX, y: y0 - offsetY },
      // 起点左侧
      { x: x0 + offsetX, y: y0 + offsetY },
      // 起点右侧
      { x: x1 - offsetX, y: y1 - offsetY },
      // 终点左侧
      { x: x1 + offsetX, y: y1 + offsetY }
      // 终点右侧
    ];
    this.fromPoints(points);
    return this;
  }
  fromXYWH(x, y, w, h) {
    this.min.set(x, y);
    this.max.set(x + w, y + h);
  }
  fromLTRB(left, top, right, bottom) {
    this.min.set(left, top);
    this.max.set(right, bottom);
  }
  fromPoints(points) {
    this.setEmpty();
    for (const p of points) {
      this.add(p.x, p.y);
    }
    return this;
  }
  expandPoints(points) {
    points.forEach((p) => {
      this.expandPoint(p);
    });
    return this;
  }
  /** 同 add，扩展包围盒以包含指定点 */
  expandPoint(point) {
    this.min.min(point);
    this.max.max(point);
    return this;
  }
  translate(tx, ty) {
    this.min.translate(tx, ty);
    this.max.translate(tx, ty);
  }
  inset(dx, dy) {
    this.min.translate(dx, dy);
    this.max.translate(-dx, -dy);
  }
  outset(dx, dy) {
    this.inset(-dx, -dy);
  }
  /**
   * 联合：将自身扩展为包含 other 的最小包围盒（就地修改）。
   * 等同于 addRect，语义更清晰。
   */
  union(other) {
    this.min.min(other.min);
    this.max.max(other.max);
    return this;
  }
  /**
   * 相交：将自身裁剪为与 other 的重叠区域（就地修改）。
   * 若无重叠则变为空包围盒。
   */
  intersect(other) {
    this.min.max(other.min);
    this.max.min(other.max);
    return this;
  }
  // ---- 工具 ----
  /**
   * 对包围盒的 min/max 两点分别应用矩阵变换，重新计算轴对齐包围盒。
   * 注意：旋转/倾斜等非轴对齐变换会使包围盒膨胀。
   */
  applyMatrix2D(m) {
    if (this.isEmpty()) return this;
    const minX = this.min.x, minY = this.min.y;
    const maxX = this.max.x, maxY = this.max.y;
    const p0 = Vector2.pool.get();
    p0.set(minX, minY);
    const p1 = Vector2.pool.get();
    p1.set(maxX, minY);
    const p2 = Vector2.pool.get();
    p2.set(maxX, maxY);
    const p3 = Vector2.pool.get();
    p3.set(minX, maxY);
    Vector2.applyMatrix2D(p0, p0, m);
    Vector2.applyMatrix2D(p1, p1, m);
    Vector2.applyMatrix2D(p2, p2, m);
    Vector2.applyMatrix2D(p3, p3, m);
    this.setEmpty();
    this.add(p0.x, p0.y).add(p1.x, p1.y).add(p2.x, p2.y).add(p3.x, p3.y);
    Vector2.pool.release(p0);
    Vector2.pool.release(p1);
    Vector2.pool.release(p2);
    Vector2.pool.release(p3);
    return this;
  }
  clone() {
    const r = new BoundingRect();
    r.min.copy(this.min);
    r.max.copy(this.max);
    return r;
  }
  equals(box) {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }
  isValid() {
    return this.left <= this.right && this.top <= this.bottom;
  }
  toString() {
    return `BoundingRect(min=(${this.min.x},${this.min.y}), max=(${this.max.x},${this.max.y}))`;
  }
}
export {
  BoundingRect
};
