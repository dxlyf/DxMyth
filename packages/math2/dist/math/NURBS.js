import { Point } from "./Point.js";
import { BoundingRect } from "./BoundingRect.js";
import { clamp } from "./MathUtils.js";
function getBSplineBasisValue(i, p, u, knots) {
  if (p === 0) {
    if (u >= knots[i] && u < knots[i + 1]) return 1;
    if (u === knots[knots.length - 1] && i === knots.length - 2) return 1;
    return 0;
  }
  let result = 0;
  const denom1 = knots[i + p] - knots[i];
  if (denom1 > 1e-12) {
    result += (u - knots[i]) / denom1 * getBSplineBasisValue(i, p - 1, u, knots);
  }
  const denom2 = knots[i + p + 1] - knots[i + 1];
  if (denom2 > 1e-12) {
    result += (knots[i + p + 1] - u) / denom2 * getBSplineBasisValue(i + 1, p - 1, u, knots);
  }
  return result;
}
function getBSplineBasisValues(span, p, u, knots) {
  const N = new Array(p + 1).fill(0);
  N[0] = 1;
  const left = new Array(p + 1);
  const right = new Array(p + 1);
  for (let j = 1; j <= p; j++) {
    left[j] = u - knots[span + 1 - j];
    right[j] = knots[span + j] - u;
    let saved = 0;
    for (let r = 0; r < j; r++) {
      const temp = N[r] / (right[r + 1] + left[j - r]);
      N[r] = saved + right[r + 1] * temp;
      saved = left[j - r] * temp;
    }
    N[j] = saved;
  }
  return N;
}
function findSpan(n, p, u, knots) {
  if (u >= knots[n + 1]) return n;
  if (u <= knots[p]) return p;
  let low = p;
  let high = n + 1;
  let mid = Math.floor((low + high) / 2);
  while (u < knots[mid] || u >= knots[mid + 1]) {
    if (u < knots[mid]) {
      high = mid;
    } else {
      low = mid;
    }
    mid = Math.floor((low + high) / 2);
  }
  return mid;
}
function generateClampedKnots(n, p) {
  const knots = new Array(n + p + 2);
  for (let i = 0; i <= p; i++) knots[i] = 0;
  const m = n - p;
  for (let i = 1; i <= m; i++) knots[p + i] = i / (m + 1);
  for (let i = n + 1; i <= n + p + 1; i++) knots[i] = 1;
  return knots;
}
function getNURBSEvaluate(u, points, weights, knots, degree) {
  const n = points.length - 1;
  const span = findSpan(n, degree, u, knots);
  const basis = getBSplineBasisValues(span, degree, u, knots);
  let x = 0, y = 0;
  let wSum = 0;
  for (let i = 0; i <= degree; i++) {
    const idx = span - degree + i;
    const w = weights[idx];
    const nw = basis[i] * w;
    x += nw * points[idx].x;
    y += nw * points[idx].y;
    wSum += nw;
  }
  if (wSum === 0) return Point.create(0, 0);
  return Point.create(x / wSum, y / wSum);
}
function getNURBSDerivative(u, points, weights, knots, degree) {
  const n = points.length - 1;
  findSpan(n, degree, u, knots);
  const eps = 1e-6;
  const u0 = clamp(u - eps, 0, 1);
  const u1 = clamp(u + eps, 0, 1);
  const p0 = getNURBSEvaluate(u0, points, weights, knots, degree);
  const p1 = getNURBSEvaluate(u1, points, weights, knots, degree);
  const dt = u1 - u0;
  if (dt === 0) return Point.create(0, 0);
  return Point.create((p1.x - p0.x) / dt, (p1.y - p0.y) / dt);
}
class NURBS {
  /** 控制点 */
  points;
  /** 权重 */
  weights;
  /** 节点向量 */
  knots;
  /** 次数 */
  degree;
  constructor(points, weights, knots, degree = 3) {
    this.points = points.map((p) => ({ x: p.x, y: p.y }));
    this.weights = weights ?? new Array(points.length).fill(1);
    this.degree = degree;
    if (knots) {
      this.knots = knots;
    } else {
      this.knots = generateClampedKnots(points.length - 1, degree);
    }
  }
  /** 计算曲线上参数 u∈[0,1] 处的点 */
  evaluate(u) {
    return getNURBSEvaluate(u, this.points, this.weights, this.knots, this.degree);
  }
  /** 计算曲线在 u 处的一阶导数 */
  derivative(u) {
    return getNURBSDerivative(u, this.points, this.weights, this.knots, this.degree);
  }
  /** 计算曲线在 u 处的法向量 */
  normal(u) {
    const d = this.derivative(u);
    const len = Math.sqrt(d.x * d.x + d.y * d.y);
    if (len === 0) return { x: 0, y: 0 };
    return { x: -d.y / len, y: d.x / len };
  }
  /** 获取边界框（采样法） */
  getBounds(samples = 50) {
    const rect = BoundingRect.default();
    for (let i = 0; i <= samples; i++) {
      const u = i / samples;
      const p = this.evaluate(u);
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
    let bestU = 0;
    let minDist2 = Infinity;
    for (let i = 0; i <= samples; i++) {
      const u2 = i / samples;
      const p = this.evaluate(u2);
      const dx = p.x - px;
      const dy = p.y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < minDist2) {
        minDist2 = d2;
        bestU = u2;
      }
    }
    let u = bestU;
    for (let iter = 0; iter < 8; iter++) {
      const p = this.evaluate(u);
      const d = this.derivative(u);
      const fx = p.x - px, fy = p.y - py;
      const ft = fx * d.x + fy * d.y;
      const ft2 = d.x * d.x + d.y * d.y;
      if (Math.abs(ft2) < 1e-15) break;
      u = u - ft / ft2;
      u = clamp(u, 0, 1);
    }
    return this.evaluate(u);
  }
}
export {
  NURBS,
  findSpan,
  generateClampedKnots,
  getBSplineBasisValue,
  getBSplineBasisValues,
  getNURBSDerivative,
  getNURBSEvaluate
};
