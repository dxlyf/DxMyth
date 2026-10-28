import { BoundingRect } from "./BoundingRect.js";
import { solveQuadratic } from "./MathUtils.js";
const kMaxConicToQuadPOW2 = 5;
function isValidWeight(w) {
  return w > 0 && Number.isFinite(w);
}
function findBisector(a, b) {
  const la = Math.sqrt(a.x * a.x + a.y * a.y);
  const lb = Math.sqrt(b.x * b.x + b.y * b.y);
  if (la === 0 && lb === 0) return { x: 1, y: 0 };
  if (la === 0) return { x: b.x / lb, y: b.y / lb };
  if (lb === 0) return { x: a.x / la, y: a.y / la };
  return { x: a.x / la + b.x / lb, y: a.y / la + b.y / lb };
}
function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}
function sub(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}
function scale(v, s) {
  return { x: v.x * s, y: v.y * s };
}
function solveMidTangent(a, b, c) {
  const discr = b * b - 4 * a * c;
  if (discr < 0) return 0.5;
  const sqrtDiscr = Math.sqrt(discr);
  const q = -0.5 * (b + (b >= 0 ? sqrtDiscr : -sqrtDiscr));
  const r1 = q / a;
  const r2 = c / q;
  const halfQA = -0.5 * q * a;
  const T = Math.abs(q * q + halfQA) < Math.abs(a * c + halfQA) ? r1 : r2;
  if (!(T > 0 && T < 1)) return 0.5;
  return T;
}
function ratquadMapTo3D(pts, w) {
  return [
    { x: pts[0].x, y: pts[0].y, z: 1 },
    { x: pts[1].x * w, y: pts[1].y * w, z: w },
    { x: pts[2].x, y: pts[2].y, z: 1 }
  ];
}
function projectDown(p) {
  return { x: p.x / p.z, y: p.y / p.z };
}
function p3dInterp(src, dst, t) {
  const ab = src[0] + (src[3] - src[0]) * t;
  const bc = src[3] + (src[6] - src[3]) * t;
  dst[0] = ab;
  dst[3] = ab + (bc - ab) * t;
  dst[6] = bc;
}
function subdivideWValue(w) {
  return Math.sqrt(0.5 + w * 0.5);
}
class QuadCoeff {
  ax;
  ay;
  bx;
  by;
  cx;
  cy;
  constructor(ax, ay, bx, by, cx, cy) {
    this.ax = ax;
    this.ay = ay;
    this.bx = bx;
    this.by = by;
    this.cx = cx;
    this.cy = cy;
  }
  static fromPoints(pts) {
    const p0 = pts[0], p1 = pts[1], p2 = pts[2];
    const cx = p0.x, cy = p0.y;
    const bx = 2 * (p1.x - cx), by = 2 * (p1.y - cy);
    const ax = p2.x - 2 * p1.x + cx, ay = p2.y - 2 * p1.y + cy;
    return new QuadCoeff(ax, ay, bx, by, cx, cy);
  }
  eval(t) {
    return {
      x: (this.ax * t + this.bx) * t + this.cx,
      y: (this.ay * t + this.by) * t + this.cy
    };
  }
}
class ConicCoeff {
  numer;
  denom;
  constructor(pts, w) {
    const p0 = pts[0], p1 = pts[1], p2 = pts[2];
    const wP1x = p1.x * w, wP1y = p1.y * w;
    this.numer = new QuadCoeff(
      p2.x - 2 * wP1x + p0.x,
      p2.y - 2 * wP1y + p0.y,
      2 * (wP1x - p0.x),
      2 * (wP1y - p0.y),
      p0.x,
      p0.y
    );
    this.denom = new QuadCoeff(
      2 * (1 - w),
      0,
      2 * (w - 1),
      0,
      1,
      0
    );
  }
  eval(t) {
    const n = this.numer.eval(t);
    const d = this.denom.eval(t).x;
    return { x: n.x / d, y: n.y / d };
  }
}
class Conic {
  /** 控制点 [P0, P1, P2] */
  points;
  /** 权重 w，P0 和 P2 恒为 1 */
  weight;
  /** 创建 conic */
  constructor(points, weight) {
    this.points = points.map((p) => ({ x: p.x, y: p.y }));
    this.weight = isValidWeight(weight) ? weight : 1;
  }
  // ---- 属性 ----
  get p0() {
    return this.points[0];
  }
  get p1() {
    return this.points[1];
  }
  get p2() {
    return this.points[2];
  }
  get w() {
    return this.weight;
  }
  setWeight(w) {
    this.weight = isValidWeight(w) ? w : 1;
  }
  // ---- 求值 ----
  /** 计算曲线上参数 t ∈ [0,1] 处的点 */
  evaluate(t) {
    return ConicCoeff.prototype.eval.call(
      new ConicCoeff(this.points, this.weight),
      t
    );
  }
  /** 计算曲线上 t 处的切向量（长度任意，仅方向有意义） */
  evaluateTangentAt(t) {
    const { p0, p1, p2 } = this;
    const w = this.weight;
    if (t === 0 && p0.x === p1.x && p0.y === p1.y || t === 1 && p1.x === p2.x && p1.y === p2.y) {
      return { x: p2.x - p0.x, y: p2.y - p0.y };
    }
    const p20x = p2.x - p0.x, p20y = p2.y - p0.y;
    const p10x = p1.x - p0.x, p10y = p1.y - p0.y;
    const cx = w * p10x, cy = w * p10y;
    const ax = w * p20x - p20x, ay = w * p20y - p20y;
    const bx = p20x - 2 * cx, by = p20y - 2 * cy;
    return new QuadCoeff(ax, ay, bx, by, cx, cy).eval(t);
  }
  /** 同时求值和求切线 */
  evaluateWithTangent(t) {
    return {
      point: this.evaluate(t),
      tangent: this.evaluateTangentAt(t)
    };
  }
  // ---- 分割 ----
  /**
   * 在参数 t 处分割，返回两段 conic
   * 基于有理 de Casteljau（在 3D 中做普通 de Casteljau 再投影）
   */
  chopAt(t) {
    const pts = this.points;
    const w = this.weight;
    const tmp = ratquadMapTo3D(pts, w);
    const tmpX = [tmp[0].x, 0, 0, tmp[1].x, 0, 0, tmp[2].x];
    const tmpY = [tmp[0].y, 0, 0, tmp[1].y, 0, 0, tmp[2].y];
    const tmpZ = [tmp[0].z, 0, 0, tmp[1].z, 0, 0, tmp[2].z];
    const tmp2X = new Array(7).fill(0);
    const tmp2Y = new Array(7).fill(0);
    const tmp2Z = new Array(7).fill(0);
    p3dInterp(tmpX, tmp2X, t);
    p3dInterp(tmpY, tmp2Y, t);
    p3dInterp(tmpZ, tmp2Z, t);
    const proj0 = projectDown({ x: tmp2X[0], y: tmp2Y[0], z: tmp2Z[0] });
    const proj1 = projectDown({ x: tmp2X[3], y: tmp2Y[3], z: tmp2Z[3] });
    const proj2 = projectDown({ x: tmp2X[6], y: tmp2Y[6], z: tmp2Z[6] });
    const root = Math.sqrt(tmp2Z[3]);
    const w0 = tmp2Z[0] / root;
    const w1 = tmp2Z[6] / root;
    if (!Number.isFinite(w0) || !Number.isFinite(w1)) return null;
    if (!Number.isFinite(proj0.x) || !Number.isFinite(proj0.y) || !Number.isFinite(proj1.x) || !Number.isFinite(proj1.y) || !Number.isFinite(proj2.x) || !Number.isFinite(proj2.y)) return null;
    const dst0 = new Conic([pts[0], proj0, proj1], w0);
    const dst1 = new Conic([proj1, proj2, pts[2]], w1);
    return [dst0, dst1];
  }
  /** 在 t=0.5 处分割 */
  chop() {
    const pts = this.points;
    const w = this.weight;
    const scale2 = 1 / (1 + w);
    const p0 = pts[0], p1 = pts[1], p2 = pts[2];
    const wScale = w * scale2;
    const t0x = p0.x * scale2, t0y = p0.y * scale2;
    const t1x = p1.x * wScale, t1y = p1.y * wScale;
    const t2x = p2.x * scale2, t2y = p2.y * scale2;
    const newP1 = { x: t0x + t1x, y: t0y + t1y };
    const newP3 = { x: t1x + t2x, y: t1y + t2y };
    const newP2 = { x: 0.5 * t0x + t1x + 0.5 * t2x, y: 0.5 * t0y + t1y + 0.5 * t2y };
    const newW = subdivideWValue(w);
    return [
      new Conic([p0, newP1, newP2], newW),
      new Conic([newP2, newP3, p2], newW)
    ];
  }
  // ---- 近似误差 ----
  /** 计算用二次贝塞尔近似此 conic 的误差向量 */
  computeAsQuadError() {
    const w = this.weight;
    const { p0, p1, p2 } = this;
    const a = w - 1;
    const k = a / (4 * (2 + a));
    return {
      x: k * (p0.x - 2 * p1.x + p2.x),
      y: k * (p0.y - 2 * p1.y + p2.y)
    };
  }
  /** 判断用二次贝塞尔近似是否在容差内 */
  asQuadTol(tol) {
    const err = this.computeAsQuadError();
    return err.x * err.x + err.y * err.y <= tol * tol;
  }
  /** 计算近似所需二次曲线的 2 的幂次数 */
  computeQuadPOW2(tol) {
    if (tol < 0 || !Number.isFinite(tol) || !isValidWeight(this.weight)) return 0;
    const err = this.computeAsQuadError();
    let error = Math.sqrt(err.x * err.x + err.y * err.y);
    let pow2 = 0;
    while (pow2 < kMaxConicToQuadPOW2) {
      if (error <= tol) break;
      error *= 0.25;
      pow2++;
    }
    return pow2;
  }
  // ---- 转为二次贝塞尔序列 ----
  /**
   * 将 conic 近似为 2^pow2 段二次贝塞尔曲线
   * 返回点数组，相邻三段为一段二次贝塞尔 [p0,p1,p2, p0,p1,p2, ...]
   * 相邻段共享端点，总点数 = 2 * 2^pow2 + 1
   */
  chopIntoQuadsPOW2(pow2) {
    pow2 = Math.max(0, Math.min(pow2, kMaxConicToQuadPOW2));
    const w = this.weight;
    if (!isValidWeight(w)) pow2 = 0;
    const quadCount = 1 << pow2;
    const ptCount = 2 * quadCount + 1;
    const pts = new Array(ptCount);
    pts[0] = { x: this.p0.x, y: this.p0.y };
    if (pow2 > 0) {
      const subPts = this._subdivide(pow2);
      for (let i = 0; i < subPts.length; i++) {
        pts[i + 1] = subPts[i];
      }
    } else {
      pts[1] = { x: this.p1.x, y: this.p1.y };
      pts[2] = { x: this.p2.x, y: this.p2.y };
    }
    let allFinite = true;
    for (let i = 0; i < ptCount; i++) {
      if (!Number.isFinite(pts[i].x) || !Number.isFinite(pts[i].y)) {
        allFinite = false;
        break;
      }
    }
    if (!allFinite) {
      for (let i = 1; i < ptCount - 1; i++) {
        pts[i] = { x: this.p1.x, y: this.p1.y };
      }
    }
    return pts;
  }
  /** 递归细分，返回中间点（不含首尾） */
  _subdivide(level) {
    if (level <= 0) {
      return [
        { x: this.p1.x, y: this.p1.y },
        { x: this.p2.x, y: this.p2.y }
      ];
    }
    const [dst0, dst1] = this.chop();
    const startY = this.p0.y;
    const endY = this.p2.y;
    const midPts = dst0.points;
    if (this._between(startY, this.p1.y, endY)) {
      const midY = midPts[2].y;
      if (!this._between(startY, midY, endY)) {
        const closerY = Math.abs(midY - startY) < Math.abs(midY - endY) ? startY : endY;
        dst0.points[2].y = dst1.points[0].y = closerY;
      }
      if (!this._between(startY, midPts[1].y, midPts[2].y)) {
        dst0.points[1].y = startY;
      }
      if (!this._between(dst1.points[0].y, dst1.points[1].y, endY)) {
        dst1.points[1].y = endY;
      }
    }
    const leftPts = dst0._subdivide(level - 1);
    const rightPts = dst1._subdivide(level - 1);
    return [...leftPts, ...rightPts];
  }
  _between(a, b, c) {
    return (a - b) * (c - b) <= 0;
  }
  /**
   * 将 conic 转为二次贝塞尔曲线数组
   * @param tol - 近似容差，默认 0.25
   * @returns QuadraticBezier 控制点数组 [[p0,p1,p2], [p0,p1,p2], ...]
   */
  toQuadraticBeziers(tol = 0.25) {
    const pow2 = this.computeQuadPOW2(tol);
    const pts = this.chopIntoQuadsPOW2(pow2);
    const quadCount = 1 << pow2;
    const result = [];
    for (let i = 0; i < quadCount; i++) {
      result.push([
        pts[i * 2],
        pts[i * 2 + 1],
        pts[i * 2 + 2]
      ]);
    }
    return result;
  }
  // ---- 极值 ----
  /** 查找 X 极值的参数 t */
  findXExtrema() {
    return this._findExtrema("x");
  }
  /** 查找 Y 极值的参数 t */
  findYExtrema() {
    return this._findExtrema("y");
  }
  _findExtrema(axis) {
    const w = this.weight;
    const src = this.points;
    const p20 = axis === "x" ? src[2].x - src[0].x : src[2].y - src[0].y;
    const p10 = axis === "x" ? src[1].x - src[0].x : src[1].y - src[0].y;
    const wP10 = w * p10;
    const a = w * p20 - p20;
    const b = p20 - 2 * wP10;
    const c = wP10;
    const roots = solveQuadratic(a, b, c);
    if (roots.length === 1 && roots[0] > 0 && roots[0] < 1) {
      return roots[0];
    }
    for (const r of roots) {
      if (r > 0 && r < 1) return r;
    }
    return null;
  }
  /** 在 X 极值处分割 */
  chopAtXExtrema() {
    const t = this.findXExtrema();
    if (t === null) return null;
    const result = this.chopAt(t);
    if (!result) return null;
    const value = result[0].points[2].x;
    result[0].points[1].x = value;
    result[1].points[0].x = value;
    result[1].points[1].x = value;
    return result;
  }
  /** 在 Y 极值处分割 */
  chopAtYExtrema() {
    const t = this.findYExtrema();
    if (t === null) return null;
    const result = this.chopAt(t);
    if (!result) return null;
    const value = result[0].points[2].y;
    result[0].points[1].y = value;
    result[1].points[0].y = value;
    result[1].points[1].y = value;
    return result;
  }
  // ---- 包围盒 ----
  /** 计算紧凑包围盒 */
  computeTightBounds() {
    const pts = [{ x: this.p0.x, y: this.p0.y }, { x: this.p2.x, y: this.p2.y }];
    let t;
    t = this.findXExtrema();
    if (t !== null) pts.push(this.evaluate(t));
    t = this.findYExtrema();
    if (t !== null) pts.push(this.evaluate(t));
    return BoundingRect.default().fromPoints(pts);
  }
  /** 计算快速包围盒（仅用控制点） */
  computeFastBounds() {
    return BoundingRect.default().fromPoints(this.points);
  }
  /** 获取包围盒（紧凑版） */
  getBounds() {
    return this.computeTightBounds();
  }
  // ---- 中间切线 ----
  /** 找到中间切线的参数 t */
  findMidTangent() {
    const { p0, p1, p2 } = this;
    const w = this.weight;
    const tan0 = sub(p1, p0);
    const tan1 = sub(p2, p1);
    const negTan1 = scale(tan1, -1);
    const bisector = findBisector(tan0, negTan1);
    const p20 = sub(p2, p0);
    const A = scale(p20, w - 1);
    const B = sub(p20, scale(sub(p1, p0), w * 2));
    const C = scale(sub(p1, p0), w);
    const a = dot(bisector, A);
    const b = dot(bisector, B);
    const c = dot(bisector, C);
    return solveMidTangent(a, b, c);
  }
}
export {
  Conic
};
