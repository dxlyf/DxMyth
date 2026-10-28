import { solveQuadratic, solveCubicByCardano } from "./MathUtils.js";
import { Point } from "./Point.js";
import { BoundingRect } from "./BoundingRect.js";
import { maxCurvaturePoint, curveCurveIntersections } from "./Bezier.js";
function getCubicBezierEvaluate(t, p0, p1, p2, p3) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;
  return Point.create(
    mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y
  );
}
function getCubicBezierBounds(p0, p1, p2, p3) {
  const extrema = getCubicBezierExtremaRoots(p0, p1, p2, p3);
  const points = [p0, p3];
  for (const t of extrema) {
    points.push(getCubicBezierEvaluate(t, p0, p1, p2, p3));
  }
  return BoundingRect.default().fromPoints(points);
}
function getCubicBezierExtremaRoots(p0, p1, p2, p3) {
  const roots = [];
  const ax = 3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x);
  const bx = 6 * (p0.x - 2 * p1.x + p2.x);
  const cx = 3 * (p1.x - p0.x);
  const xRoots = solveQuadratic(ax, bx, cx);
  for (const t of xRoots) {
    if (t > 0 && t < 1) {
      roots.push(t);
    }
  }
  const ay = 3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y);
  const by = 6 * (p0.y - 2 * p1.y + p2.y);
  const cy = 3 * (p1.y - p0.y);
  const yRoots = solveQuadratic(ay, by, cy);
  for (const t of yRoots) {
    if (t > 0 && t < 1 && !roots.includes(t)) {
      roots.push(t);
    }
  }
  return roots.sort((a, b) => a - b);
}
function getCubicCoefficients(p0, p1, p2, p3) {
  const ax = -p0.x + 3 * p1.x - 3 * p2.x + p3.x;
  const ay = -p0.y + 3 * p1.y - 3 * p2.y + p3.y;
  const bx = 3 * p0.x - 6 * p1.x + 3 * p2.x;
  const by = 3 * p0.y - 6 * p1.y + 3 * p2.y;
  const cx = -3 * p0.x + 3 * p1.x;
  const cy = -3 * p0.y + 3 * p1.y;
  const dx = p0.x;
  const dy = p0.y;
  return { ax, ay, bx, by, cx, cy, dx, dy };
}
class CubicBezier {
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
  get p3() {
    return this.points[3];
  }
  // 计算贝塞尔曲线上的点
  evaluate(t) {
    return getCubicBezierEvaluate(t, this.p0, this.p1, this.p2, this.p3);
  }
  // 获取极值的根（t值）
  getExtremaRoots() {
    return getCubicBezierExtremaRoots(this.p0, this.p1, this.p2, this.p3);
  }
  // 获取边界框
  getBounds() {
    return getCubicBezierBounds(this.p0, this.p1, this.p2, this.p3);
  }
  /**
   * 计算 t 处的一阶导数（切向量）
   * B'(t) = 3(1-t)²(P1-P0) + 6t(1-t)(P2-P1) + 3t²(P3-P2)
   * @param t - 参数 [0, 1]
   */
  getDerivative(t) {
    const { p0, p1, p2, p3 } = this;
    const mt = 1 - t;
    const k0 = 3 * mt * mt;
    const k1 = 6 * t * mt;
    const k2 = 3 * t * t;
    return {
      x: k0 * (p1.x - p0.x) + k1 * (p2.x - p1.x) + k2 * (p3.x - p2.x),
      y: k0 * (p1.y - p0.y) + k1 * (p2.y - p1.y) + k2 * (p3.y - p2.y)
    };
  }
  /**
   * 计算 t 处的二阶导数（加速度向量）
   * B''(t) = 6(1-t)(P0-2P1+P2) + 6t(P1-2P2+P3)
   * @param t - 参数 [0, 1]
   */
  getSecondDerivative(t) {
    const { p0, p1, p2, p3 } = this;
    const mt = 1 - t;
    return {
      x: 6 * (mt * (p0.x - 2 * p1.x + p2.x) + t * (p1.x - 2 * p2.x + p3.x)),
      y: 6 * (mt * (p0.y - 2 * p1.y + p2.y) + t * (p1.y - 2 * p2.y + p3.y))
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
   * 计算线段与三次贝塞尔曲线的交点
   *
   * 将线段写成隐式直线 A·x + B·y + C = 0，代入曲线参数多项式后
   * 得到关于 t 的一元三次方程，解出 t ∈ [0, 1] 且落在线段内的点。
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
    const { ax, ay, bx, by, cx, cy, dx: ex, dy: ey } = getCubicCoefficients(this.p0, this.p1, this.p2, this.p3);
    const qa = A * ax + B * ay;
    const qb = A * bx + B * by;
    const qc = A * cx + B * cy;
    const qd = A * ex + B * ey + C;
    const results = [];
    for (const t of solveCubicByCardano(qa, qb, qc, qd)) {
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
   * 计算与另一条三次贝塞尔曲线的交点
   * @param other - 另一条三次贝塞尔曲线
   * @param epsilon - 交点精度（默认 1e-4）
   */
  intersectCubic(other, epsilon = 1e-4) {
    return curveCurveIntersections(this.points, other.points, epsilon);
  }
  /**
   * 计算与二次贝塞尔曲线的交点
   * @param other - 二次贝塞尔曲线
   * @param epsilon - 交点精度（默认 1e-4）
   */
  intersectQuadratic(other, epsilon = 1e-4) {
    return curveCurveIntersections(this.points, other.points, epsilon);
  }
  /**
   * 在参数 t 处分割三次贝塞尔曲线
   * @param t - 分割参数 [0, 1]
   * @returns [左半曲线, 右半曲线]
   */
  split(t) {
    const { p0, p1, p2, p3 } = this;
    const mt = 1 - t;
    const a = { x: mt * p0.x + t * p1.x, y: mt * p0.y + t * p1.y };
    const b = { x: mt * p1.x + t * p2.x, y: mt * p1.y + t * p2.y };
    const c = { x: mt * p2.x + t * p3.x, y: mt * p2.y + t * p3.y };
    const d = { x: mt * a.x + t * b.x, y: mt * a.y + t * b.y };
    const e = { x: mt * b.x + t * c.x, y: mt * b.y + t * c.y };
    const f = { x: mt * d.x + t * e.x, y: mt * d.y + t * e.y };
    return [
      new CubicBezier([p0, a, d, f]),
      new CubicBezier([f, e, c, p3])
    ];
  }
  /**
   * 将三次贝塞尔曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   * @returns PointLike[] 点序列（包含起点和终点）
   */
  flatten(epsilon = 0.5) {
    const points = [this.p0];
    const recursive = (p0, p1, p2, p3) => {
      const dx = p3.x - p0.x;
      const dy = p3.y - p0.y;
      const len2 = dx * dx + dy * dy;
      if (len2 <= 1e-20) {
        const cpLen2 = (p1.x - p0.x) ** 2 + (p1.y - p0.y) ** 2 + (p2.x - p0.x) ** 2 + (p2.y - p0.y) ** 2;
        if (cpLen2 <= epsilon * epsilon) {
          points.push(p3);
          return;
        }
      } else {
        const d1 = Math.abs((p1.x - p3.x) * dy - (p1.y - p3.y) * dx) / Math.sqrt(len2);
        const d2 = Math.abs((p2.x - p3.x) * dy - (p2.y - p3.y) * dx) / Math.sqrt(len2);
        if (d1 <= epsilon && d2 <= epsilon) {
          points.push(p3);
          return;
        }
      }
      const mt = 0.5;
      const a = { x: (p0.x + p1.x) * mt, y: (p0.y + p1.y) * mt };
      const b = { x: (p1.x + p2.x) * mt, y: (p1.y + p2.y) * mt };
      const c = { x: (p2.x + p3.x) * mt, y: (p2.y + p3.y) * mt };
      const d = { x: (a.x + b.x) * mt, y: (a.y + b.y) * mt };
      const e = { x: (b.x + c.x) * mt, y: (b.y + c.y) * mt };
      const f = { x: (d.x + e.x) * mt, y: (d.y + e.y) * mt };
      recursive(p0, a, d, f);
      recursive(f, e, c, p3);
    };
    recursive(this.p0, this.p1, this.p2, this.p3);
    return points;
  }
  /**
   * 计算点到三次贝塞尔曲线的最小距离
   *
   * 三次贝塞尔的最小距离问题导数为五次方程，无解析解。
   * 采用采样 + Newton 迭代逼近：
   *   1. 均匀采样 N 个点，取最近点的 t 值
   *   2. 在该 t 附近用 Newton 法迭代求精
   *
   * @param px - 点 X
   * @param py - 点 Y
   * @param samples - 采样点数（默认 12）
   * @param iterations - Newton 迭代次数（默认 8）
   * @returns 点到曲线的最小距离
   */
  distanceTo(px, py, samples = 12, iterations = 8) {
    const { p0, p1, p2, p3 } = this;
    const ax = -p0.x + 3 * p1.x - 3 * p2.x + p3.x;
    const ay = -p0.y + 3 * p1.y - 3 * p2.y + p3.y;
    const bx = 3 * p0.x - 6 * p1.x + 3 * p2.x;
    const by = 3 * p0.y - 6 * p1.y + 3 * p2.y;
    const cx = -3 * p0.x + 3 * p1.x;
    const cy = -3 * p0.y + 3 * p1.y;
    p0.x - px;
    p0.y - py;
    const ddx = 3 * ax, ddy = 3 * ay;
    const ddx2 = ddx * 2, ddy2 = ddy * 2;
    const nddx = 6 * ax, nddy = 6 * ay;
    const nddx2 = 2 * bx * 2, nddy2 = 2 * by * 2;
    let bestT = 0;
    let minDist2 = Infinity;
    for (let i = 0; i <= samples; i++) {
      const t2 = i / samples;
      const mt = 1 - t2;
      const mt2 = mt * mt;
      const mt3 = mt2 * mt;
      const t22 = t2 * t2;
      const t3 = t22 * t2;
      const x = mt3 * p0.x + 3 * mt2 * t2 * p1.x + 3 * mt * t22 * p2.x + t3 * p3.x - px;
      const y = mt3 * p0.y + 3 * mt2 * t2 * p1.y + 3 * mt * t22 * p2.y + t3 * p3.y - py;
      const d2 = x * x + y * y;
      if (d2 < minDist2) {
        minDist2 = d2;
        bestT = t2;
      }
    }
    let t = bestT;
    for (let i = 0; i < iterations; i++) {
      const mt = 1 - t;
      const mt2 = mt * mt;
      const mt3 = mt2 * mt;
      const t2 = t * t;
      const t3 = t2 * t;
      const fx = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x - px;
      const fy = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y - py;
      const ddx_t = ddx * t2 + ddx2 * t + cx;
      const ddy_t = ddy * t2 + ddy2 * t + cy;
      const nddx_t = nddx * t + nddx2;
      const nddy_t = nddy * t + nddy2;
      const ft = fx * ddx_t + fy * ddy_t;
      const ft2 = ddx_t * ddx_t + ddy_t * ddy_t + fx * nddx_t + fy * nddy_t;
      if (Math.abs(ft2) < 1e-15) break;
      t = t - ft / ft2;
      t = Math.max(0, Math.min(1, t));
    }
    {
      const mt = 1 - t;
      const x = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x - px;
      const y = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y - py;
      const d2 = x * x + y * y;
      if (d2 < minDist2) minDist2 = d2;
    }
    const d0x = p0.x - px, d0y = p0.y - py;
    const d3x = p3.x - px, d3y = p3.y - py;
    minDist2 = Math.min(minDist2, d0x * d0x + d0y * d0y, d3x * d3x + d3y * d3y);
    return Math.sqrt(minDist2);
  }
  /**
   * 计算点在三次贝塞尔曲线上的投影点（最近点）
   *
   * 采用采样 + Newton 迭代逼近：
   *   1. 均匀采样 N 个点，取最近点的 t 值
   *   2. 在该 t 附近用 Newton 法迭代求精
   *   3. 比较端点，取最近者
   *
   * @param px - 点 X
   * @param py - 点 Y
   * @param samples - 采样点数（默认 12）
   * @param iterations - Newton 迭代次数（默认 8）
   * @returns 曲线上距离给定点最近的点
   */
  projectPoint(px, py, samples = 12, iterations = 8) {
    const { p0, p1, p2, p3 } = this;
    const ax = -p0.x + 3 * p1.x - 3 * p2.x + p3.x;
    const ay = -p0.y + 3 * p1.y - 3 * p2.y + p3.y;
    const bx = 3 * p0.x - 6 * p1.x + 3 * p2.x;
    const by = 3 * p0.y - 6 * p1.y + 3 * p2.y;
    const cx = -3 * p0.x + 3 * p1.x;
    const cy = -3 * p0.y + 3 * p1.y;
    const ddx = 3 * ax, ddy = 3 * ay;
    const ddx2 = ddx * 2, ddy2 = ddy * 2;
    const nddx = 6 * ax, nddy = 6 * ay;
    const nddx2 = 2 * bx * 2, nddy2 = 2 * by * 2;
    let bestT = 0;
    let minDist2 = Infinity;
    for (let i = 0; i <= samples; i++) {
      const t2 = i / samples;
      const mt2 = 1 - t2;
      const mt22 = mt2 * mt2;
      const mt3 = mt22 * mt2;
      const t22 = t2 * t2;
      const t3 = t22 * t2;
      const x = mt3 * p0.x + 3 * mt22 * t2 * p1.x + 3 * mt2 * t22 * p2.x + t3 * p3.x - px;
      const y = mt3 * p0.y + 3 * mt22 * t2 * p1.y + 3 * mt2 * t22 * p2.y + t3 * p3.y - py;
      const d2 = x * x + y * y;
      if (d2 < minDist2) {
        minDist2 = d2;
        bestT = t2;
      }
    }
    let t = bestT;
    for (let i = 0; i < iterations; i++) {
      const mt2 = 1 - t;
      const mt22 = mt2 * mt2;
      const mt3 = mt22 * mt2;
      const t2 = t * t;
      const t3 = t2 * t;
      const fx = mt3 * p0.x + 3 * mt22 * t * p1.x + 3 * mt2 * t2 * p2.x + t3 * p3.x - px;
      const fy = mt3 * p0.y + 3 * mt22 * t * p1.y + 3 * mt2 * t2 * p2.y + t3 * p3.y - py;
      const ddx_t = ddx * t2 + ddx2 * t + cx;
      const ddy_t = ddy * t2 + ddy2 * t + cy;
      const nddx_t = nddx * t + nddx2;
      const nddy_t = nddy * t + nddy2;
      const ft = fx * ddx_t + fy * ddy_t;
      const ft2 = ddx_t * ddx_t + ddy_t * ddy_t + fx * nddx_t + fy * nddy_t;
      if (Math.abs(ft2) < 1e-15) break;
      t = t - ft / ft2;
      t = Math.max(0, Math.min(1, t));
    }
    {
      const mt2 = 1 - t;
      const x = mt2 * mt2 * mt2 * p0.x + 3 * mt2 * mt2 * t * p1.x + 3 * mt2 * t * t * p2.x + t * t * t * p3.x - px;
      const y = mt2 * mt2 * mt2 * p0.y + 3 * mt2 * mt2 * t * p1.y + 3 * mt2 * t * t * p2.y + t * t * t * p3.y - py;
      const d2 = x * x + y * y;
      if (d2 < minDist2) {
        minDist2 = d2;
        bestT = t;
      }
    }
    const d0x = p0.x - px, d0y = p0.y - py;
    const d3x = p3.x - px, d3y = p3.y - py;
    const d02 = d0x * d0x + d0y * d0y;
    const d32 = d3x * d3x + d3y * d3y;
    if (d02 < minDist2) {
      minDist2 = d02;
      bestT = 0;
    }
    if (d32 < minDist2) {
      bestT = 1;
    }
    const mt = 1 - bestT;
    return {
      x: mt * mt * mt * p0.x + 3 * mt * mt * bestT * p1.x + 3 * mt * bestT * bestT * p2.x + bestT * bestT * bestT * p3.x,
      y: mt * mt * mt * p0.y + 3 * mt * mt * bestT * p1.y + 3 * mt * bestT * bestT * p2.y + bestT * bestT * bestT * p3.y
    };
  }
}
export {
  CubicBezier,
  getCubicBezierBounds,
  getCubicBezierEvaluate,
  getCubicBezierExtremaRoots,
  getCubicCoefficients
};
