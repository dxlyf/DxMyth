import { Point } from "./Point.js";
import { BoundingRect } from "./BoundingRect.js";
import { clamp } from "./MathUtils.js";
function getLagrangeBasis(i, t, knots) {
  let result = 1;
  const ti = knots[i];
  for (let j = 0; j < knots.length; j++) {
    if (j === i) continue;
    const denom = ti - knots[j];
    if (Math.abs(denom) < 1e-12) continue;
    result *= (t - knots[j]) / denom;
  }
  return result;
}
function getLagrangeEvaluate(t, points, knots) {
  const n = points.length;
  const ts = knots ?? Array.from({ length: n }, (_, i) => n === 1 ? 0 : i / (n - 1));
  let x = 0, y = 0;
  for (let i = 0; i < n; i++) {
    const basis = getLagrangeBasis(i, t, ts);
    x += basis * points[i].x;
    y += basis * points[i].y;
  }
  return Point.create(x, y);
}
function getLagrangeDerivative(t, points, knots, eps = 1e-6) {
  const t0 = clamp(t - eps, 0, 1);
  const t1 = clamp(t + eps, 0, 1);
  const p0 = getLagrangeEvaluate(t0, points, knots);
  const p1 = getLagrangeEvaluate(t1, points, knots);
  const dt = t1 - t0;
  if (dt === 0) return Point.create(0, 0);
  return Point.create((p1.x - p0.x) / dt, (p1.y - p0.y) / dt);
}
function getLagrangeEvaluateBarycentric(t, points, knots) {
  const n = points.length;
  const w = new Array(n);
  for (let i = 0; i < n; i++) {
    let wi = 1;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const denom2 = knots[i] - knots[j];
      if (Math.abs(denom2) < 1e-12) continue;
      wi *= denom2;
    }
    w[i] = 1 / wi;
  }
  for (let i = 0; i < n; i++) {
    if (Math.abs(t - knots[i]) < 1e-14) {
      return Point.create(points[i].x, points[i].y);
    }
  }
  let xNum = 0, yNum = 0, denom = 0;
  for (let i = 0; i < n; i++) {
    const term = w[i] / (t - knots[i]);
    xNum += term * points[i].x;
    yNum += term * points[i].y;
    denom += term;
  }
  if (denom === 0) return Point.create(0, 0);
  return Point.create(xNum / denom, yNum / denom);
}
class Lagrange {
  /** 插值点（曲线过所有点） */
  points;
  /** 参数节点 */
  knots;
  constructor(points, knots) {
    this.points = points.map((p) => ({ x: p.x, y: p.y }));
    const n = points.length;
    this.knots = knots ?? Array.from({ length: n }, (_, i) => n === 1 ? 0 : i / (n - 1));
  }
  /** 计算曲线上参数 t∈[0,1] 处的点 */
  evaluate(t) {
    return getLagrangeEvaluate(t, this.points, this.knots);
  }
  /** 计算曲线在 t 处的一阶导数 */
  derivative(t) {
    return getLagrangeDerivative(t, this.points, this.knots);
  }
  /** 计算曲线在 t 处的法向量 */
  normal(t) {
    const d = this.derivative(t);
    const len = Math.sqrt(d.x * d.x + d.y * d.y);
    if (len === 0) return { x: 0, y: 0 };
    return { x: -d.y / len, y: d.x / len };
  }
  /** 获取边界框（采样法） */
  getBounds(samples = 50) {
    const rect = BoundingRect.default();
    for (const p of this.points) rect.add(p.x, p.y);
    for (let i = 0; i <= samples; i++) {
      const p = this.evaluate(i / samples);
      rect.add(p.x, p.y);
    }
    return rect;
  }
  /**
   * 将曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   * @param samples - 初始采样数（默认 32）
   */
  flatten(epsilon = 0.5, samples = 32) {
    const result = [];
    const pts = [];
    for (let i = 0; i <= samples; i++) {
      pts.push(this.evaluate(i / samples));
    }
    const subdivide = (i0, i1, a) => {
      const im = Math.floor((i0 + i1) / 2);
      if (im === i0 || im === i1) {
        result.push(pts[i1]);
        return;
      }
      const mid = pts[im];
      const b = pts[i1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len2 = dx * dx + dy * dy;
      if (len2 < 1e-20) {
        result.push(b);
        return;
      }
      const dist = Math.abs((mid.x - a.x) * dy - (mid.y - a.y) * dx) / Math.sqrt(len2);
      if (dist <= epsilon) {
        result.push(b);
      } else {
        subdivide(i0, im, a);
        subdivide(im, i1, mid);
      }
    };
    result.push(pts[0]);
    for (let i = 1; i < pts.length; i++) {
      subdivide(i - 1, i, pts[i - 1]);
    }
    return result;
  }
  /**
   * 计算点到曲线的最小距离
   * @param samples - 采样数（默认 50）
   */
  distanceTo(px, py, samples = 50) {
    let minDist2 = Infinity;
    for (let i = 0; i <= samples; i++) {
      const p = this.evaluate(i / samples);
      const dx = p.x - px;
      const dy = p.y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < minDist2) minDist2 = d2;
    }
    return Math.sqrt(minDist2);
  }
  /**
   * 计算点在曲线上的投影点（最近点）
   * @param samples - 采样数（默认 50）
   */
  projectPoint(px, py, samples = 50) {
    let bestT = 0;
    let minDist2 = Infinity;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const p = this.evaluate(t);
      const dx = p.x - px;
      const dy = p.y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < minDist2) {
        minDist2 = d2;
        bestT = t;
      }
    }
    return this.evaluate(bestT);
  }
}
export {
  Lagrange,
  getLagrangeBasis,
  getLagrangeDerivative,
  getLagrangeEvaluate,
  getLagrangeEvaluateBarycentric
};
