import { BoundingRect } from "../BoundingRect.js";
import { Geometry, arcSegmentCount } from "./Geometry.js";
class Ellipse extends Geometry {
  cx;
  cy;
  radiusX;
  radiusY;
  constructor(cx = 0, cy = 0, radiusX = 0, radiusY = 0) {
    super();
    this.cx = cx;
    this.cy = cy;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
  }
  area() {
    return Math.PI * this.radiusX * this.radiusY;
  }
  /**
   * 周长（Ramanujan 近似，精度极高）
   * π [3(a+b) - sqrt((3a+b)(a+3b))]
   */
  perimeter() {
    const a = this.radiusX;
    const b = this.radiusY;
    return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
  }
  centroid(out) {
    const r = out || { x: 0, y: 0 };
    r.x = this.cx;
    r.y = this.cy;
    return r;
  }
  center(out) {
    return this.centroid(out);
  }
  /** 严格内部（不含边界） */
  contains(x, y) {
    const dx = (x - this.cx) / this.radiusX;
    const dy = (y - this.cy) / this.radiusY;
    return dx * dx + dy * dy < 1;
  }
  containsInclusive(x, y) {
    const dx = (x - this.cx) / this.radiusX;
    const dy = (y - this.cy) / this.radiusY;
    return dx * dx + dy * dy <= 1;
  }
  /**
   * 精确带符号距离（数值法）
   * 思路：椭圆点 q(θ) = (cx + a·cosθ, cy + b·sinθ)，最小化 |p - q(θ)|²。
   *       对 θ 求导令 f(θ)=0，用牛顿迭代求最近点对应的参数角 θ*，距离 = |p - q(θ*)|。
   *       先将点反射到第一象限再迭代（带符号坐标下轴点初值会向错误方向发散），
   *       外部点初值取径向近似角 atan2(a·py, b·px)，内部点按 iq 方案取轴点初值 0 或 π/2，
   *       通常 3~6 次迭代即可收敛到双精度精度。
   * 约定：内部为正、外部为负（与 Triangle 等一致）
   */
  signedDistance(x, y) {
    const dx = x - this.cx;
    const dy = y - this.cy;
    const a = this.radiusX;
    const b = this.radiusY;
    if (a === b) {
      return a - Math.hypot(dx, dy);
    }
    if (dx === 0 && dy === 0) return Math.min(a, b);
    const eps = 1e-9 * Math.max(a, b);
    if (Math.abs(dy) <= eps || Math.abs(dx) <= eps) {
      return this._signedDistanceOnAxis(x, y);
    }
    const px = Math.abs(dx);
    const py = Math.abs(dy);
    const k = b * b - a * a;
    const outside = px * px / (a * a) + py * py / (b * b) > 1;
    let theta = outside ? Math.atan2(a * py, b * px) : a * (px - a) < b * (py - b) ? Math.PI / 2 : 0;
    for (let i = 0; i < 12; i++) {
      const sin = Math.sin(theta);
      const cos = Math.cos(theta);
      const f = a * px * sin - b * py * cos + k * sin * cos;
      const df = a * px * cos + b * py * sin + k * (cos * cos - sin * sin);
      const delta = f / df;
      theta -= delta;
      if (Math.abs(delta) < 1e-13) break;
    }
    const dist = Math.hypot(px - a * Math.cos(theta), py - b * Math.sin(theta));
    return outside ? -dist : dist;
  }
  /**
   * 带符号距离（解析法：解一元四次方程）
   * 参考：https://iquilezles.org/articles/ellipsedist/
   * 思路：最近点 q(θ) = (cx + a·cosθ, cy + b·sinθ)，令 |p - q(θ)|² 对 θ 导数为 0，
   *       代换 λ = cosθ 化为一元四次方程，利用系数对称性直接解析求解，无需迭代。
   * 注意：近圆（a ≈ b）或极扁时该法数值不稳定（iq 原文亦注明），请优先用于常规椭圆；
   *       a === b 时为圆，直接套圆公式；点在坐标轴上时预解式退化，改走一维解析解。
   * 约定：内部为正、外部为负（与 signedDistance 一致）
   */
  signedDistanceQuartic(x, y) {
    const a = this.radiusX;
    const b = this.radiusY;
    if (a === b) {
      return a - Math.hypot(x - this.cx, y - this.cy);
    }
    const dx = x - this.cx;
    const dy = y - this.cy;
    const eps = 1e-9 * Math.max(a, b);
    if (Math.abs(dy) <= eps || Math.abs(dx) <= eps) {
      return this._signedDistanceOnAxis(x, y);
    }
    let px = Math.abs(dx);
    let py = Math.abs(dy);
    let rx = a;
    let ry = b;
    if (px > py) {
      const t1 = px;
      px = py;
      py = t1;
      const t2 = rx;
      rx = ry;
      ry = t2;
    }
    const l = ry * ry - rx * rx;
    const m = rx * px / l;
    const m2 = m * m;
    const n = ry * py / l;
    const n2 = n * n;
    const c = (m2 + n2 - 1) / 3;
    const c2 = c * c;
    const c3 = c2 * c;
    const d = c3 + m2 * n2;
    const q = d + m2 * n2;
    const g = m + m * n2;
    let co;
    if (d < 0) {
      const h = Math.acos(q / c3) / 3;
      const s = Math.cos(h) + 2;
      const t = Math.sin(h) * Math.sqrt(3);
      const r1 = Math.sqrt(m2 - c * (s + t));
      const r2 = Math.sqrt(m2 - c * (s - t));
      co = r2 + Math.sign(l) * r1 + Math.abs(g) / (r1 * r2);
    } else {
      const h = 2 * m * n * Math.sqrt(d);
      const s = Math.cbrt(q + h);
      const t = c2 / s;
      const r1 = -(s + t) - c * 4 + 2 * m2;
      const r2 = (s - t) * Math.sqrt(3);
      const rm = Math.sqrt(r1 * r1 + r2 * r2);
      co = r2 / Math.sqrt(rm - r1) + 2 * g / rm;
    }
    co = (co - m) / 2;
    if (co < -1) co = -1;
    else if (co > 1) co = 1;
    const si = Math.sqrt(1 - co * co);
    const dist = Math.hypot(px - rx * co, py - ry * si);
    const inside = px * px / (rx * rx) + py * py / (ry * ry) < 1;
    return inside ? dist : -dist;
  }
  getPoints(out) {
    const r = out || [];
    r.length = 0;
    const TAU = Math.PI * 2;
    const n = arcSegmentCount(Math.min(this.radiusX, this.radiusY), TAU);
    for (let i = 0; i < n; i++) {
      const a = TAU * i / n;
      r.push({ x: this.cx + this.radiusX * Math.cos(a), y: this.cy + this.radiusY * Math.sin(a) });
    }
    return r;
  }
  bounds(out) {
    const r = out || new BoundingRect();
    r.min.set(this.cx - this.radiusX, this.cy - this.radiusY);
    r.max.set(this.cx + this.radiusX, this.cy + this.radiusY);
    return r;
  }
  /**
   * 点在坐标轴上的带符号距离（一维解析解）
   * 距离平方 |p - q(θ)|² 的驻点只有两种：sinθ=0（θ=0/π，即轴端点）
   * 或 cosθ = A·d/(A²-B²)（轴外点），取各驻点距离最小值。
   * 约定：内部为正、外部为负。要求 a ≠ b（圆走圆公式，此处避免除零）。
   */
  _signedDistanceOnAxis(x, y) {
    const dx = Math.abs(x - this.cx);
    const dy = Math.abs(y - this.cy);
    let A = this.radiusX;
    let B = this.radiusY;
    let d = dx;
    if (dy > dx) {
      A = this.radiusY;
      B = this.radiusX;
      d = dy;
    }
    const k = A * A - B * B;
    const cosA = Math.max(-1, Math.min(1, A * d / k));
    const c1 = Math.abs(d - A);
    const c2 = d + A;
    const c3 = Math.sqrt((d - A * cosA) * (d - A * cosA) + B * B * (1 - cosA * cosA));
    const dist = Math.min(c1, c2, c3);
    return d < A ? dist : -dist;
  }
}
export {
  Ellipse
};
