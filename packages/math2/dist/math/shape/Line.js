import { BoundingRect } from "../BoundingRect.js";
import { Geometry } from "./Geometry.js";
const EPS = 1e-9;
class Line extends Geometry {
  x1;
  y1;
  x2;
  y2;
  constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
    super();
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
  /** 线段长度 */
  length() {
    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    return Math.sqrt(dx * dx + dy * dy);
  }
  /** 线段长度的平方 */
  lengthSquared() {
    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    return dx * dx + dy * dy;
  }
  area() {
    return 0;
  }
  centroid(out) {
    const r = out || { x: 0, y: 0 };
    r.x = (this.x1 + this.x2) * 0.5;
    r.y = (this.y1 + this.y2) * 0.5;
    return r;
  }
  center(out) {
    return this.centroid(out);
  }
  perimeter() {
    return this.length();
  }
  /** 线段无内部，始终返回 false */
  contains(x, y) {
    return false;
  }
  /**
   * 带符号距离：以线段方向为基准，左侧为正，右侧为负
   * 对开放曲线，inner/outer 描边的语义基于此符号
   */
  signedDistance(x, y) {
    const abx = this.x2 - this.x1;
    const aby = this.y2 - this.y1;
    const apx = x - this.x1;
    const apy = y - this.y1;
    const ab2 = abx * abx + aby * aby;
    let t = ab2 > 0 ? (apx * abx + apy * aby) / ab2 : 0;
    if (t < 0) t = 0;
    else if (t > 1) t = 1;
    const cx = this.x1 + t * abx;
    const cy = this.y1 + t * aby;
    const dx = x - cx;
    const dy = y - cy;
    const cross = abx * apy - aby * apx;
    const sign = cross >= 0 ? 1 : -1;
    return sign * Math.sqrt(dx * dx + dy * dy);
  }
  getPoints(out) {
    const r = out || [];
    r.length = 0;
    r.push({ x: this.x1, y: this.y1 }, { x: this.x2, y: this.y2 });
    return r;
  }
  bounds(out) {
    const r = out || new BoundingRect();
    r.min.set(Math.min(this.x1, this.x2), Math.min(this.y1, this.y2));
    r.max.set(Math.max(this.x1, this.x2), Math.max(this.y1, this.y2));
    return r;
  }
  /**
   * 求两条线段的交点（各自限制在线段范围内）
   * 解 P1 + t·d1 = P2 + u·d2，仅当 t、u ∈ [0,1] 时两线段真正相交。
   * @returns 交点写入 out；平行/共线或交点在延长线上时返回 null
   */
  static intersectSegment(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2, out) {
    const dx1 = ax2 - ax1;
    const dy1 = ay2 - ay1;
    const dx2 = bx2 - bx1;
    const dy2 = by2 - by1;
    const denom = dx1 * dy2 - dy1 * dx2;
    if (Math.abs(denom) <= EPS) return null;
    const ex = bx1 - ax1;
    const ey = by1 - ay1;
    const t = (ex * dy2 - ey * dx2) / denom;
    const u = (ex * dy1 - ey * dx1) / denom;
    if (t < -EPS || t > 1 + EPS || u < -EPS || u > 1 + EPS) return null;
    const r = out || { x: 0, y: 0 };
    r.x = ax1 + t * dx1;
    r.y = ay1 + t * dy1;
    return r;
  }
  /**
   * 求两条直线的交点（无限延长），每条直线各由两个点给出。
   * @returns 交点写入 out；两直线平行/重合时返回 null
   */
  static intersectLine(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2, out) {
    return Line.intersectLineByDirection(
      ax1,
      ay1,
      ax2 - ax1,
      ay2 - ay1,
      bx1,
      by1,
      bx2 - bx1,
      by2 - by1,
      out
    );
  }
  /**
   * 求两条直线的交点，每条直线由「一点 + 方向」给出（方向无需单位化，但不能为零向量）。
   * @returns 交点写入 out；两直线平行/重合时返回 null
   */
  static intersectLineByDirection(px, py, dx, dy, qx, qy, ex, ey, out) {
    const denom = dx * ey - dy * ex;
    if (Math.abs(denom) <= EPS) return null;
    const t = ((qx - px) * ey - (qy - py) * ex) / denom;
    const r = out || { x: 0, y: 0 };
    r.x = px + t * dx;
    r.y = py + t * dy;
    return r;
  }
}
export {
  Line
};
