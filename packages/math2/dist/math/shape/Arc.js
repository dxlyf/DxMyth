import { normalizeAngles } from "../Arc.js";
import { BoundingRect } from "../BoundingRect.js";
import { Geometry, normalizeAnglePositive, distPointToSegmentSquared, arcSegmentCount } from "./Geometry.js";
class Arc extends Geometry {
  cx;
  cy;
  radius;
  startAngle;
  endAngle;
  /** true=逆时针，false=顺时针 */
  ccw;
  constructor(cx = 0, cy = 0, radius = 0, startAngle = 0, endAngle = 0, ccw = false) {
    super();
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.ccw = ccw;
  }
  /** 扫过角度（绝对值，弧度） */
  sweep() {
    const { startAngle, endAngle } = normalizeAngles(this.startAngle, this.endAngle, this.ccw);
    return Math.abs(endAngle - startAngle);
  }
  /** 弦长 */
  chordLength() {
    const sweep = this.sweep();
    return 2 * this.radius * Math.sin(sweep * 0.5);
  }
  /** 扇形面积 = 0.5 * r² * sweep */
  area() {
    return 0.5 * this.radius * this.radius * this.sweep();
  }
  /** 弓形面积（弦+弧）= 扇形面积 - 三角形面积 */
  segmentArea() {
    const r = this.radius;
    const sweep = this.sweep();
    const sector = 0.5 * r * r * sweep;
    const triangle = 0.5 * r * r * Math.sin(sweep);
    return Math.abs(sector - triangle);
  }
  /**
   * 扇形重心
   * 沿角平分线方向，距圆心 (2 r sin(α/2)) / (3 α/2)，α=sweep
   */
  centroid(out) {
    const r = out || { x: 0, y: 0 };
    const sweep = this.sweep();
    if (sweep < 1e-9) {
      r.x = this.cx;
      r.y = this.cy;
      return r;
    }
    const bisect = this.ccw ? this.startAngle + sweep * 0.5 : this.startAngle - sweep * 0.5;
    const half = sweep * 0.5;
    const dist = sweep < 1e-9 ? 0 : 2 * this.radius * Math.sin(half) / (3 * half);
    r.x = this.cx + dist * Math.cos(bisect);
    r.y = this.cy + dist * Math.sin(bisect);
    return r;
  }
  center(out) {
    const r = out || { x: 0, y: 0 };
    r.x = this.cx;
    r.y = this.cy;
    return r;
  }
  /** 周长 = 弧长 + 两段半径 */
  perimeter() {
    return this.radius * this.sweep() + 2 * this.radius;
  }
  /** 弧长（不含半径线段） */
  arcLength() {
    return this.radius * this.sweep();
  }
  /** 起点坐标 */
  startPoint(out) {
    const r = out || { x: 0, y: 0 };
    r.x = this.cx + this.radius * Math.cos(this.startAngle);
    r.y = this.cy + this.radius * Math.sin(this.startAngle);
    return r;
  }
  /** 终点坐标 */
  endPoint(out) {
    const r = out || { x: 0, y: 0 };
    r.x = this.cx + this.radius * Math.cos(this.endAngle);
    r.y = this.cy + this.radius * Math.sin(this.endAngle);
    return r;
  }
  /**
   * 点是否在扇形内
   * 条件：距圆心 < radius 且角度在扫过范围内
   */
  contains(x, y) {
    const dx = x - this.cx;
    const dy = y - this.cy;
    const r = this.radius;
    if (dx * dx + dy * dy >= r * r) return false;
    if (dx === 0 && dy === 0) return true;
    const ang = Math.atan2(dy, dx);
    return this.angleInSweep(ang);
  }
  /** 角度是否在扫过范围内 */
  angleInSweep(angle) {
    let s = normalizeAnglePositive(this.startAngle);
    let e = normalizeAnglePositive(this.endAngle);
    let a = normalizeAnglePositive(angle);
    if (this.ccw) {
      if (s <= e) return a >= s - 1e-9 && a <= e + 1e-9;
      return a >= s - 1e-9 || a <= e + 1e-9;
    } else {
      if (e <= s) return a >= e - 1e-9 && a <= s + 1e-9;
      return a >= e - 1e-9 || a <= s + 1e-9;
    }
  }
  /**
   * 带符号距离（到扇形边界：弧 + 两段半径）
   */
  signedDistance(x, y) {
    const dx = x - this.cx;
    const dy = y - this.cy;
    const r = this.radius;
    const distC = Math.sqrt(dx * dx + dy * dy);
    const ang = distC < 1e-12 ? this.startAngle : Math.atan2(dy, dx);
    const inAngle = this.angleInSweep(ang);
    let minD2 = Infinity;
    if (inAngle) {
      const dArc = Math.abs(distC - r);
      if (dArc < minD2) minD2 = dArc;
    }
    const sx = this.cx + r * Math.cos(this.startAngle);
    const sy = this.cy + r * Math.sin(this.startAngle);
    const ex = this.cx + r * Math.cos(this.endAngle);
    const ey = this.cy + r * Math.sin(this.endAngle);
    const d1 = distPointToSegmentSquared(x, y, this.cx, this.cy, sx, sy);
    const d2 = distPointToSegmentSquared(x, y, this.cx, this.cy, ex, ey);
    if (d1 < minD2) minD2 = d1;
    if (d2 < minD2) minD2 = d2;
    const dist = minD2 === Infinity ? Math.abs(distC - r) : Math.sqrt(minD2);
    return this.contains(x, y) ? dist : -dist;
  }
  getPoints(out) {
    const r = out || [];
    r.length = 0;
    const { cx, cy, radius } = this;
    r.push({
      x: cx + radius * Math.cos(this.startAngle),
      y: cy + radius * Math.sin(this.startAngle)
    });
    const sweep = this.sweep();
    const n = arcSegmentCount(radius, sweep);
    const dir = this.ccw ? 1 : -1;
    for (let i = 1; i < n; i++) {
      const a = this.startAngle + dir * (sweep * i) / n;
      r.push({ x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) });
    }
    r.push({
      x: cx + radius * Math.cos(this.endAngle),
      y: cy + radius * Math.sin(this.endAngle)
    });
    return r;
  }
  bounds(out) {
    const r = out || new BoundingRect();
    const rad = this.radius;
    r.min.set(this.cx - rad, this.cy - rad);
    r.max.set(this.cx + rad, this.cy + rad);
    return r;
  }
}
export {
  Arc
};
