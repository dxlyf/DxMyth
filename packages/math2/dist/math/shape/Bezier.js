import { BoundingRect } from "../BoundingRect.js";
import { Geometry, distPointToSegmentSquared } from "./Geometry.js";
import { solveCubicByCardano } from "../MathUtils.js";
const FLATTEN_TOL = 0.25;
class Bezier extends Geometry {
  type;
  // 控制点扁平存储 [p0x, p0y, p1x, p1y, ...]
  // 二次：6 个数；三次：8 个数
  points;
  constructor(type = "cubic", points = []) {
    super();
    this.type = type;
    this.points = points;
  }
  static quadratic(x0, y0, c1x, c1y, x1, y1) {
    return new Bezier("quadratic", [x0, y0, c1x, c1y, x1, y1]);
  }
  static cubic(x0, y0, c1x, c1y, c2x, c2y, x1, y1) {
    return new Bezier("cubic", [x0, y0, c1x, c1y, c2x, c2y, x1, y1]);
  }
  area() {
    return 0;
  }
  centroid(out) {
    return this.pointAt(0.5, out);
  }
  center(out) {
    return this.centroid(out);
  }
  /** 曲线长度（数值积分） */
  perimeter() {
    return this.arcLength();
  }
  contains(x, y) {
    return false;
  }
  /** 求曲线上参数 t 处的点 */
  pointAt(t, out) {
    const r = out || { x: 0, y: 0 };
    const p = this.points;
    const u = 1 - t;
    if (this.type === "quadratic") {
      const u2 = u * u;
      const t2 = t * t;
      const ut2 = 2 * u * t;
      r.x = u2 * p[0] + ut2 * p[2] + t2 * p[4];
      r.y = u2 * p[1] + ut2 * p[3] + t2 * p[5];
    } else {
      const u3 = u * u * u;
      const t3 = t * t * t;
      const u2t = 3 * u * u * t;
      const ut2 = 3 * u * t * t;
      r.x = u3 * p[0] + u2t * p[2] + ut2 * p[4] + t3 * p[6];
      r.y = u3 * p[1] + u2t * p[3] + ut2 * p[5] + t3 * p[7];
    }
    return r;
  }
  /** 导数（切线向量） */
  derivativeAt(t, out) {
    const r = out || { x: 0, y: 0 };
    const p = this.points;
    const u = 1 - t;
    if (this.type === "quadratic") {
      r.x = 2 * u * (p[2] - p[0]) + 2 * t * (p[4] - p[2]);
      r.y = 2 * u * (p[3] - p[1]) + 2 * t * (p[5] - p[3]);
    } else {
      const u2 = u * u;
      const t2 = t * t;
      r.x = 3 * u2 * (p[2] - p[0]) + 6 * u * t * (p[4] - p[2]) + 3 * t2 * (p[6] - p[4]);
      r.y = 3 * u2 * (p[3] - p[1]) + 6 * u * t * (p[5] - p[3]) + 3 * t2 * (p[7] - p[5]);
    }
    return r;
  }
  /**
   * 弧长 - Gauss-Legendre 5 节点积分
   * ∫₀¹ |B'(t)| dt
   */
  arcLength() {
    const nodes = [
      0.5 - 0.5 * Math.sqrt(5 + 2 * Math.sqrt(10 / 7)) / 3,
      0.5 - 0.5 * Math.sqrt(5 - 2 * Math.sqrt(10 / 7)) / 3,
      0.5,
      0.5 + 0.5 * Math.sqrt(5 - 2 * Math.sqrt(10 / 7)) / 3,
      0.5 + 0.5 * Math.sqrt(5 + 2 * Math.sqrt(10 / 7)) / 3
    ];
    const weights = [
      (322 - 13 * Math.sqrt(70)) / 1800,
      (322 + 13 * Math.sqrt(70)) / 1800,
      128 / 450,
      (322 + 13 * Math.sqrt(70)) / 1800,
      (322 - 13 * Math.sqrt(70)) / 1800
    ];
    let sum = 0;
    const d = { x: 0, y: 0 };
    for (let i = 0; i < 5; i++) {
      const t = nodes[i];
      this.derivativeAt(t, d);
      sum += weights[i] * Math.sqrt(d.x * d.x + d.y * d.y);
    }
    return sum * 0.5;
  }
  /**
   * 带符号距离 - 找到曲线上离点最近的点
   * 二次：解析（求导得到三次方程）
   * 三次：采样 + Newton 精化
   */
  signedDistance(x, y) {
    const ts = this.closestParameter(x, y);
    const pt = this.pointAt(ts);
    const dx = x - pt.x;
    const dy = y - pt.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  /** 最近点参数 t */
  closestParameter(x, y) {
    const p = this.points;
    if (this.type === "quadratic") {
      return this._closestQuadratic(x, y, p);
    }
    return this._closestCubic(x, y, p);
  }
  /**
   * 二次贝塞尔最近点参数
   * 设 D(t) = |B(t) - Q|²，求 D'(t)=0
   * 化简后得到一元三次方程 at³+bt²+ct+d=0
   */
  _closestQuadratic(x, y, p) {
    const x0 = p[0], y0 = p[1];
    const x1 = p[2], y1 = p[3];
    const x2 = p[4], y2 = p[5];
    const ax = x0 - 2 * x1 + x2;
    const bx = 2 * (x1 - x0);
    const cx = x0 - x;
    const ay = y0 - 2 * y1 + y2;
    const by = 2 * (y1 - y0);
    const cy = y0 - y;
    const A = 2 * (ax * ax + ay * ay);
    const B = 3 * (ax * bx + ay * by);
    const C = bx * bx + by * by + 2 * (ax * cx + ay * cy);
    const D = bx * cx + by * cy;
    const roots = solveCubicByCardano(A, B, C, D);
    const candidates = [0, 1];
    for (let i = 0; i < roots.length; i++) {
      const r = roots[i];
      if (r > 0 && r < 1) candidates.push(r);
    }
    let bestT = 0;
    let bestD2 = Infinity;
    const pt = { x: 0, y: 0 };
    for (let i = 0; i < candidates.length; i++) {
      this.pointAt(candidates[i], pt);
      const dx = x - pt.x;
      const dy = y - pt.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD2) {
        bestD2 = d2;
        bestT = candidates[i];
      }
    }
    return bestT;
  }
  /**
   * 三次贝塞尔最近点参数
   * 采样 N 个点找近似最近，再 Newton-Raphson 精化 3 次
   */
  _closestCubic(x, y, p) {
    const N = 16;
    let bestT = 0;
    let bestD2 = Infinity;
    const pt = { x: 0, y: 0 };
    for (let i = 0; i <= N; i++) {
      const t2 = i / N;
      this.pointAt(t2, pt);
      const dx = x - pt.x;
      const dy = y - pt.y;
      const d22 = dx * dx + dy * dy;
      if (d22 < bestD2) {
        bestD2 = d22;
        bestT = t2;
      }
    }
    const d1 = { x: 0, y: 0 };
    const d2 = { x: 0, y: 0 };
    let t = bestT;
    for (let iter = 0; iter < 4; iter++) {
      this.pointAt(t, pt);
      this.derivativeAt(t, d1);
      this._secondDerivativeAt(t, d2);
      const ex = pt.x - x;
      const ey = pt.y - y;
      const f = ex * d1.x + ey * d1.y;
      const fp = d1.x * d1.x + d1.y * d1.y + ex * d2.x + ey * d2.y;
      if (Math.abs(fp) < 1e-12) break;
      let nt = t - f / fp;
      if (nt < 0) nt = 0;
      else if (nt > 1) nt = 1;
      if (Math.abs(nt - t) < 1e-9) {
        t = nt;
        break;
      }
      t = nt;
    }
    return t;
  }
  _secondDerivativeAt(t, out) {
    const r = out || { x: 0, y: 0 };
    const p = this.points;
    const u = 1 - t;
    if (this.type === "quadratic") {
      r.x = 2 * (p[0] - 2 * p[2] + p[4]);
      r.y = 2 * (p[1] - 2 * p[3] + p[5]);
    } else {
      r.x = 6 * (u * (p[4] - 2 * p[2] + p[0]) + t * (p[6] - 2 * p[4] + p[2]));
      r.y = 6 * (u * (p[5] - 2 * p[3] + p[1]) + t * (p[7] - 2 * p[5] + p[3]));
    }
    return r;
  }
  getPoints(out) {
    const r = out || [];
    r.length = 0;
    const p = this.points;
    if (p.length < 6) return r;
    r.push({ x: p[0], y: p[1] });
    const tol2 = FLATTEN_TOL * FLATTEN_TOL;
    if (this.type === "quadratic") {
      this._flattenQuadratic(r, tol2, p[0], p[1], p[2], p[3], p[4], p[5]);
    } else {
      this._flattenCubic(r, tol2, p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]);
    }
    return r;
  }
  /**
   * 递归展平二次贝塞尔：控制点 P1 到弦 P0P2 距离 ≤ tol 时终止，否则 de Casteljau 对半分
   */
  _flattenQuadratic(out, tol2, x0, y0, x1, y1, x2, y2, depth = 0) {
    const d2 = distPointToSegmentSquared(x1, y1, x0, y0, x2, y2);
    if (d2 <= tol2 || depth >= 16) {
      out.push({ x: x2, y: y2 });
      return;
    }
    const mx0 = (x0 + x1) * 0.5, my0 = (y0 + y1) * 0.5;
    const mx1 = (x1 + x2) * 0.5, my1 = (y1 + y2) * 0.5;
    const mx = (mx0 + mx1) * 0.5, my = (my0 + my1) * 0.5;
    this._flattenQuadratic(out, tol2, x0, y0, mx0, my0, mx, my, depth + 1);
    this._flattenQuadratic(out, tol2, mx, my, mx1, my1, x2, y2, depth + 1);
  }
  /**
   * 递归展平三次贝塞尔：P1、P2 到弦 P0P3 距离均 ≤ tol 时终止，否则 de Casteljau 对半分
   */
  _flattenCubic(out, tol2, x0, y0, x1, y1, x2, y2, x3, y3, depth = 0) {
    const d1 = distPointToSegmentSquared(x1, y1, x0, y0, x3, y3);
    const d2 = distPointToSegmentSquared(x2, y2, x0, y0, x3, y3);
    if (d1 <= tol2 && d2 <= tol2 || depth >= 16) {
      out.push({ x: x3, y: y3 });
      return;
    }
    const ax = (x0 + x1) * 0.5, ay = (y0 + y1) * 0.5;
    const bx = (x1 + x2) * 0.5, by = (y1 + y2) * 0.5;
    const cx = (x2 + x3) * 0.5, cy = (y2 + y3) * 0.5;
    const dx = (ax + bx) * 0.5, dy = (ay + by) * 0.5;
    const ex = (bx + cx) * 0.5, ey = (by + cy) * 0.5;
    const fx = (dx + ex) * 0.5, fy = (dy + ey) * 0.5;
    this._flattenCubic(out, tol2, x0, y0, ax, ay, dx, dy, fx, fy, depth + 1);
    this._flattenCubic(out, tol2, fx, fy, ex, ey, cx, cy, x3, y3, depth + 1);
  }
  bounds(out) {
    const r = out || new BoundingRect();
    const p = this.points;
    r.min.set(Infinity, Infinity);
    r.max.set(-Infinity, -Infinity);
    for (let i = 0; i < p.length; i += 2) {
      r.add(p[i], p[i + 1]);
    }
    return r;
  }
}
export {
  Bezier
};
