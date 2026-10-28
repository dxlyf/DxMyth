import { solveQuadratic, solveCubicByCardano } from "./MathUtils.js";
import { Point } from "./Point.js";
import { BoundingRect } from "./BoundingRect.js";
import { maxCurvaturePoint, curveCurveIntersections } from "./Bezier.js";
function getQuadraticBezierEvaluate(t, p0, p1, p2) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return Point.create(
    mt2 * p0.x + 2 * mt * t * p1.x + t2 * p2.x,
    mt2 * p0.y + 2 * mt * t * p1.y + t2 * p2.y
  );
}
function getQuadraticBezierExtremaRoots(p0, p1, p2) {
  const roots = [];
  const ax = p0.x - 2 * p1.x + p2.x;
  const bx = p1.x - p0.x;
  if (ax !== 0) {
    const tx = bx / ax;
    if (tx > 0 && tx < 1) {
      roots.push(tx);
    }
  }
  const ay = p0.y - 2 * p1.y + p2.y;
  const by = p1.y - p0.y;
  if (ay !== 0) {
    const ty = by / ay;
    if (ty > 0 && ty < 1 && !roots.includes(ty)) {
      roots.push(ty);
    }
  }
  return roots.sort((a, b) => a - b);
}
function getQuadraticBezierBounds(p0, p1, p2) {
  const extrema = getQuadraticBezierExtremaRoots(p0, p1, p2);
  const points = [p0, p2];
  for (const t of extrema) {
    points.push(getQuadraticBezierEvaluate(t, p0, p1, p2));
  }
  return BoundingRect.default().fromPoints(points);
}
function getQuadraticCoefficients(p0, p1, p2) {
  const ax = p0.x - 2 * p1.x + p2.x;
  const ay = p0.y - 2 * p1.y + p2.y;
  const bx = -2 * p0.x + 2 * p1.x;
  const by = -2 * p0.y + 2 * p1.y;
  const cx = p0.x;
  const cy = p0.y;
  return { ax, ay, bx, by, cx, cy };
}
class QuadraticBezier {
  points;
  constructor(points) {
    this.points = points.map((p) => ({ x: p.x, y: p.y }));
  }
  get p0() {
    return this.points[0];
  }
  get p1() {
    return this.points[1];
  }
  get p2() {
    return this.points[2];
  }
  // 计算贝塞尔曲线上的点
  evaluate(t) {
    return getQuadraticBezierEvaluate(t, this.p0, this.p1, this.p2);
  }
  // 获取极值的根（t值）
  getExtremaRoots() {
    return getQuadraticBezierExtremaRoots(this.p0, this.p1, this.p2);
  }
  // 获取边界框
  getBounds() {
    return getQuadraticBezierBounds(this.p0, this.p1, this.p2);
  }
  /**
   * 计算 t 处的一阶导数（切向量）
   * B'(t) = 2[(1-t)(P1-P0) + t(P2-P1)]
   * @param t - 参数 [0, 1]
   */
  getDerivative(t) {
    const { p0, p1, p2 } = this;
    const mt = 1 - t;
    return {
      x: 2 * (mt * (p1.x - p0.x) + t * (p2.x - p1.x)),
      y: 2 * (mt * (p1.y - p0.y) + t * (p2.y - p1.y))
    };
  }
  /**
   * 计算 t 处的二阶导数（加速度向量）
   * B''(t) = 2(P0 - 2P1 + P2)，二次贝塞尔曲线的二阶导数为常量
   */
  getSecondDerivative(_t = 0) {
    const { p0, p1, p2 } = this;
    return {
      x: 2 * (p0.x - 2 * p1.x + p2.x),
      y: 2 * (p0.y - 2 * p1.y + p2.y)
    };
  }
  /**
   * 计算 t 处的曲率
   * k = |x'·y'' - y'·x''| / (x'² + y'²)^(3/2)
   * @param t - 参数 [0, 1]
   */
  getCurvature(t) {
    const d1 = this.getDerivative(t);
    const d2 = this.getSecondDerivative(t);
    const cross = d1.x * d2.y - d1.y * d2.x;
    const lenSq = d1.x * d1.x + d1.y * d1.y;
    if (lenSq <= 1e-20) return 0;
    return Math.abs(cross) / Math.pow(lenSq, 1.5);
  }
  /**
   * 获取曲率最大的位置及曲率值（采样 + 黄金分割搜索）
   * @param samples - 初始采样段数（默认 32）
   */
  getMaxCurvature(samples = 32) {
    return maxCurvaturePoint(this.points, samples);
  }
  /**
   * 计算线段与二次贝塞尔曲线的交点
   *
   * 将线段写成隐式直线 A·x + B·y + C = 0，代入曲线参数多项式后
   * 得到关于 t 的一元二次方程，解出 t ∈ [0, 1] 且落在线段内的点。
   *
   * @param x1 - 线段起点 X
   * @param y1 - 线段起点 Y
   * @param x2 - 线段终点 X
   * @param y2 - 线段终点 Y
   * @returns 交点数组（已去重）
   */
  intersectSegment(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    if (len2 <= 1e-20) return [];
    const A = dy;
    const B = -dx;
    const C = dx * y1 - dy * x1;
    const { ax, ay, bx, by, cx, cy } = getQuadraticCoefficients(this.p0, this.p1, this.p2);
    const qa = A * ax + B * ay;
    const qb = A * bx + B * by;
    const qc = A * cx + B * cy + C;
    const results = [];
    for (const t of solveQuadratic(qa, qb, qc)) {
      if (t < -1e-9 || t > 1 + 1e-9) continue;
      const p = this.evaluate(Math.max(0, Math.min(1, t)));
      const u = ((p.x - x1) * dx + (p.y - y1) * dy) / len2;
      if (u < -1e-9 || u > 1 + 1e-9) continue;
      if (results.some((q) => Math.abs(q.x - p.x) <= 1e-9 && Math.abs(q.y - p.y) <= 1e-9)) continue;
      results.push(p);
    }
    return results;
  }
  /**
   * 计算与另一条二次贝塞尔曲线的交点
   * @param other - 另一条二次贝塞尔曲线
   * @param epsilon - 交点精度（默认 1e-4）
   */
  intersectQuadratic(other, epsilon = 1e-4) {
    return curveCurveIntersections(this.points, other.points, epsilon);
  }
  /**
   * 计算与三次贝塞尔曲线的交点
   * @param other - 三次贝塞尔曲线
   * @param epsilon - 交点精度（默认 1e-4）
   */
  intersectCubic(other, epsilon = 1e-4) {
    return curveCurveIntersections(this.points, other.points, epsilon);
  }
  /**
   * 在参数 t 处分割二次贝塞尔曲线
   * @param t - 分割参数 [0, 1]
   * @returns [左半曲线, 右半曲线]
   */
  split(t) {
    const { p0, p1, p2 } = this;
    const mt = 1 - t;
    const a = { x: mt * p0.x + t * p1.x, y: mt * p0.y + t * p1.y };
    const b = { x: mt * p1.x + t * p2.x, y: mt * p1.y + t * p2.y };
    const c = { x: mt * a.x + t * b.x, y: mt * a.y + t * b.y };
    return [
      new QuadraticBezier([p0, a, c]),
      new QuadraticBezier([c, b, p2])
    ];
  }
  /**
   * 将二次贝塞尔曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   * @returns PointLike[] 点序列（包含起点和终点）
   */
  flatten(epsilon = 0.5) {
    const points = [this.p0];
    const recursive = (p0, p1, p2) => {
      const vx = p2.x - p0.x;
      const vy = p2.y - p0.y;
      const len2 = vx * vx + vy * vy;
      if (len2 <= 1e-20) {
        const cpLen2 = (p1.x - p0.x) ** 2 + (p1.y - p0.y) ** 2;
        if (cpLen2 <= epsilon * epsilon) {
          points.push(p2);
          return;
        }
      } else {
        const t = ((p1.x - p0.x) * vx + (p1.y - p0.y) * vy) / len2;
        const tClamped = Math.max(0, Math.min(1, t));
        const px = p0.x + tClamped * vx;
        const py = p0.y + tClamped * vy;
        const dx = p1.x - px;
        const dy = p1.y - py;
        if (dx * dx + dy * dy < epsilon * epsilon) {
          points.push(p2);
          return;
        }
      }
      const mt = 0.5;
      const a = { x: (p0.x + p1.x) * mt, y: (p0.y + p1.y) * mt };
      const b = { x: (p1.x + p2.x) * mt, y: (p1.y + p2.y) * mt };
      const c = { x: (a.x + b.x) * mt, y: (a.y + b.y) * mt };
      recursive(p0, a, c);
      recursive(c, b, p2);
    };
    recursive(this.p0, this.p1, this.p2);
    return points;
  }
  /**
   * 计算点到二次贝塞尔曲线的最小距离
   * @param px - 点 X
   * @param py - 点 Y
   * @returns 点到曲线的最小距离
   */
  distanceTo(px, py) {
    const { p0, p1, p2 } = this;
    const ax = p0.x - 2 * p1.x + p2.x;
    const ay = p0.y - 2 * p1.y + p2.y;
    const bx = 2 * (p1.x - p0.x);
    const by = 2 * (p1.y - p0.y);
    const cx = p0.x - px;
    const cy = p0.y - py;
    const a = 2 * (ax * ax + ay * ay);
    const b = 3 * (ax * bx + ay * by);
    const c = 2 * (ax * cx + ay * cy) + (bx * bx + by * by);
    const d = bx * cx + by * cy;
    const candidates = solveCubicByCardano(a, b, c, d);
    candidates.push(0, 1);
    let minDist2 = Infinity;
    for (const t of candidates) {
      if (t < 0 || t > 1) continue;
      const mt = 1 - t;
      const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x;
      const y = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y;
      const dx = x - px, dy = y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < minDist2) minDist2 = d2;
    }
    return Math.sqrt(minDist2);
  }
  /**
   * 计算点在二次贝塞尔曲线上的投影点（最近点）
   * @param px - 点 X
   * @param py - 点 Y
   * @returns 曲线上距离给定点最近的点
   */
  projectPoint(px, py) {
    const { p0, p1, p2 } = this;
    const ax = p0.x - 2 * p1.x + p2.x;
    const ay = p0.y - 2 * p1.y + p2.y;
    const bx = 2 * (p1.x - p0.x);
    const by = 2 * (p1.y - p0.y);
    const cx = p0.x - px;
    const cy = p0.y - py;
    const a = 2 * (ax * ax + ay * ay);
    const b = 3 * (ax * bx + ay * by);
    const c = 2 * (ax * cx + ay * cy) + (bx * bx + by * by);
    const d = bx * cx + by * cy;
    const candidates = solveCubicByCardano(a, b, c, d);
    candidates.push(0, 1);
    let bestT = 0;
    let minDist2 = Infinity;
    for (const t of candidates) {
      if (t < 0 || t > 1) continue;
      const mt2 = 1 - t;
      const x = mt2 * mt2 * p0.x + 2 * mt2 * t * p1.x + t * t * p2.x;
      const y = mt2 * mt2 * p0.y + 2 * mt2 * t * p1.y + t * t * p2.y;
      const dx = x - px, dy = y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < minDist2) {
        minDist2 = d2;
        bestT = t;
      }
    }
    const mt = 1 - bestT;
    return {
      x: mt * mt * p0.x + 2 * mt * bestT * p1.x + bestT * bestT * p2.x,
      y: mt * mt * p0.y + 2 * mt * bestT * p1.y + bestT * bestT * p2.y
    };
  }
}
export {
  QuadraticBezier,
  getQuadraticBezierBounds,
  getQuadraticBezierEvaluate,
  getQuadraticBezierExtremaRoots,
  getQuadraticCoefficients
};
