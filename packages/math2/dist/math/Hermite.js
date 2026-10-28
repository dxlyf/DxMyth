import { Point } from "./Point.js";
import { BoundingRect } from "./BoundingRect.js";
function getHermiteEvaluate(t, p0, p1, m0, m1) {
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  return Point.create(
    h00 * p0.x + h10 * m0.x + h01 * p1.x + h11 * m1.x,
    h00 * p0.y + h10 * m0.y + h01 * p1.y + h11 * m1.y
  );
}
function getHermiteDerivative(t, p0, p1, m0, m1) {
  const t2 = t * t;
  const h00 = 6 * t2 - 6 * t;
  const h10 = 3 * t2 - 4 * t + 1;
  const h01 = -6 * t2 + 6 * t;
  const h11 = 3 * t2 - 2 * t;
  return Point.create(
    h00 * p0.x + h10 * m0.x + h01 * p1.x + h11 * m1.x,
    h00 * p0.y + h10 * m0.y + h01 * p1.y + h11 * m1.y
  );
}
function getHermiteSecondDerivative(t, p0, p1, m0, m1) {
  const h00 = 12 * t - 6;
  const h10 = 6 * t - 4;
  const h01 = -12 * t + 6;
  const h11 = 6 * t - 2;
  return Point.create(
    h00 * p0.x + h10 * m0.x + h01 * p1.x + h11 * m1.x,
    h00 * p0.y + h10 * m0.y + h01 * p1.y + h11 * m1.y
  );
}
function getHermiteExtremaRoots(p0, p1, m0, m1) {
  const roots = [];
  12 * p0.x - 6 * m0.x - 12 * p1.x + 6 * m1.x;
  -6 * p0.x + 3 * m0.x + 6 * p1.x - 2 * m1.x;
  -4 * p0.x + m0.x + 2 * p1.x;
  const solveComponent = (a, b, c) => {
    if (Math.abs(a) < 1e-12) {
      if (Math.abs(b) > 1e-12) {
        const t = -c / b;
        if (t > 0 && t < 1) roots.push(t);
      }
      return;
    }
    const delta = b * b - 4 * a * c;
    if (delta < 0) return;
    const sq = Math.sqrt(delta);
    const t1 = (-b - sq) / (2 * a);
    const t2 = (-b + sq) / (2 * a);
    if (t1 > 0 && t1 < 1) roots.push(t1);
    if (t2 > 0 && t2 < 1) roots.push(t2);
  };
  const a2x = 3 * m0.x + 3 * m1.x;
  const b2x = -6 * p0.x - 4 * m0.x + 6 * p1.x - 2 * m1.x;
  const c2x = -6 * p0.x + m0.x + 6 * p1.x;
  solveComponent(a2x, b2x, c2x);
  const a2y = 3 * m0.y + 3 * m1.y;
  const b2y = -6 * p0.y - 4 * m0.y + 6 * p1.y - 2 * m1.y;
  const c2y = -6 * p0.y + m0.y + 6 * p1.y;
  solveComponent(a2y, b2y, c2y);
  return roots.sort((a, b) => a - b);
}
function getHermiteBounds(p0, p1, m0, m1) {
  const extrema = getHermiteExtremaRoots(p0, p1, m0, m1);
  const points = [p0, p1];
  for (const t of extrema) {
    points.push(getHermiteEvaluate(t, p0, p1, m0, m1));
  }
  return BoundingRect.default().fromPoints(points);
}
function hermiteToCubicBezier(p0, p1, m0, m1) {
  return [
    { x: p0.x, y: p0.y },
    { x: p0.x + m0.x / 3, y: p0.y + m0.y / 3 },
    { x: p1.x - m1.x / 3, y: p1.y - m1.y / 3 },
    { x: p1.x, y: p1.y }
  ];
}
class Hermite {
  /** 起点和终点 */
  p0;
  p1;
  /** 起点和终点的切向量 */
  m0;
  m1;
  constructor(p0, p1, m0, m1) {
    this.p0 = { x: p0.x, y: p0.y };
    this.p1 = { x: p1.x, y: p1.y };
    this.m0 = { x: m0.x, y: m0.y };
    this.m1 = { x: m1.x, y: m1.y };
  }
  /** 计算曲线上参数 t 处的点 */
  evaluate(t) {
    return getHermiteEvaluate(t, this.p0, this.p1, this.m0, this.m1);
  }
  /** 计算曲线在 t 处的一阶导数（切向量） */
  derivative(t) {
    return getHermiteDerivative(t, this.p0, this.p1, this.m0, this.m1);
  }
  /** 计算曲线在 t 处的二阶导数 */
  secondDerivative(t) {
    return getHermiteSecondDerivative(t, this.p0, this.p1, this.m0, this.m1);
  }
  /** 计算曲线在 t 处的法向量 */
  normal(t) {
    const d = this.derivative(t);
    const len = Math.sqrt(d.x * d.x + d.y * d.y);
    if (len === 0) return { x: 0, y: 0 };
    return { x: -d.y / len, y: d.x / len };
  }
  /** 获取边界框 */
  getBounds() {
    return getHermiteBounds(this.p0, this.p1, this.m0, this.m1);
  }
  /**
   * 在参数 t 处分割曲线
   * @returns [左半曲线, 右半曲线]
   */
  split(t) {
    const p = this.evaluate(t);
    const d = this.derivative(t);
    const left = new Hermite(this.p0, p, this.m0, d);
    const right = new Hermite(p, this.p1, d, this.m1);
    return [left, right];
  }
  /**
   * 将曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   */
  flatten(epsilon = 0.5) {
    const result = [{ x: this.p0.x, y: this.p0.y }];
    const subdivide = (t0, t1, a) => {
      const tm = (t0 + t1) * 0.5;
      const mid = this.evaluate(tm);
      const b = this.evaluate(t1);
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
        subdivide(t0, tm, a);
        subdivide(tm, t1, mid);
      }
    };
    subdivide(0, 1, this.p0);
    return result;
  }
  /**
   * 计算点到曲线的最小距离
   * @param samples - 采样点数（默认 16）
   * @param iterations - Newton 迭代次数（默认 8）
   */
  distanceTo(px, py, samples = 16, iterations = 8) {
    let bestT = 0;
    let minDist2 = Infinity;
    for (let i = 0; i <= samples; i++) {
      const t2 = i / samples;
      const p2 = this.evaluate(t2);
      const dx2 = p2.x - px;
      const dy2 = p2.y - py;
      const d22 = dx2 * dx2 + dy2 * dy2;
      if (d22 < minDist2) {
        minDist2 = d22;
        bestT = t2;
      }
    }
    let t = bestT;
    for (let i = 0; i < iterations; i++) {
      const p2 = this.evaluate(t);
      const d1 = this.derivative(t);
      const d22 = this.secondDerivative(t);
      const fx = p2.x - px, fy = p2.y - py;
      const ft = fx * d1.x + fy * d1.y;
      const ft2 = d1.x * d1.x + d1.y * d1.y + fx * d22.x + fy * d22.y;
      if (Math.abs(ft2) < 1e-15) break;
      t = t - ft / ft2;
      t = Math.max(0, Math.min(1, t));
    }
    const p = this.evaluate(t);
    const dx = p.x - px, dy = p.y - py;
    const d2 = dx * dx + dy * dy;
    if (d2 < minDist2) minDist2 = d2;
    return Math.sqrt(minDist2);
  }
  /**
   * 计算点在曲线上的投影点（最近点）
   * @param samples - 采样点数（默认 16）
   * @param iterations - Newton 迭代次数（默认 8）
   */
  projectPoint(px, py, samples = 16, iterations = 8) {
    let bestT = 0;
    let minDist2 = Infinity;
    for (let i = 0; i <= samples; i++) {
      const t2 = i / samples;
      const p = this.evaluate(t2);
      const dx = p.x - px;
      const dy = p.y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < minDist2) {
        minDist2 = d2;
        bestT = t2;
      }
    }
    let t = bestT;
    for (let i = 0; i < iterations; i++) {
      const p = this.evaluate(t);
      const d1 = this.derivative(t);
      const d2 = this.secondDerivative(t);
      const fx = p.x - px, fy = p.y - py;
      const ft = fx * d1.x + fy * d1.y;
      const ft2 = d1.x * d1.x + d1.y * d1.y + fx * d2.x + fy * d2.y;
      if (Math.abs(ft2) < 1e-15) break;
      t = t - ft / ft2;
      t = Math.max(0, Math.min(1, t));
    }
    const d0x = this.p0.x - px, d0y = this.p0.y - py;
    const d1x = this.p1.x - px, d1y = this.p1.y - py;
    const d02 = d0x * d0x + d0y * d0y;
    const d12 = d1x * d1x + d1y * d1y;
    if (d02 < minDist2) {
      minDist2 = d02;
      t = 0;
    }
    if (d12 < minDist2) {
      t = 1;
    }
    return this.evaluate(t);
  }
}
export {
  Hermite,
  getHermiteBounds,
  getHermiteDerivative,
  getHermiteEvaluate,
  getHermiteExtremaRoots,
  getHermiteSecondDerivative,
  hermiteToCubicBezier
};
