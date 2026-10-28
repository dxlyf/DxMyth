import { Point } from "./Point.js";
import { BoundingRect } from "./BoundingRect.js";
import { clamp } from "./MathUtils.js";
var ConicType = /* @__PURE__ */ ((ConicType2) => {
  ConicType2[ConicType2["Ellipse"] = 0] = "Ellipse";
  ConicType2[ConicType2["Parabola"] = 1] = "Parabola";
  ConicType2[ConicType2["Hyperbola"] = 2] = "Hyperbola";
  return ConicType2;
})(ConicType || {});
function getConicType(e) {
  if (Math.abs(e - 1) < 1e-10) return 1;
  if (e < 1) return 0;
  return 2;
}
function getEllipseEvaluate(t, a, b) {
  return Point.create(a * Math.cos(t), b * Math.sin(t));
}
function getEllipseDerivative(t, a, b) {
  return Point.create(-a * Math.sin(t), b * Math.cos(t));
}
function getEllipsePerimeter(a, b) {
  if (a === b) return 2 * Math.PI * a;
  const h = ((a - b) / (a + b)) ** 2;
  return Math.PI * (a + b) * (1 + 3 * h / (10 + Math.sqrt(4 - 3 * h)));
}
function getEllipseArea(a, b) {
  return Math.PI * a * b;
}
function getEllipseBounds(a, b) {
  return BoundingRect.fromLTRB(-a, -b, a, b);
}
function isPointInEllipse(px, py, a, b) {
  const nx = px / a;
  const ny = py / b;
  return nx * nx + ny * ny <= 1;
}
function getDistanceToEllipse(px, py, a, b, iterations = 8) {
  const absX = Math.abs(px);
  const absY = Math.abs(py);
  const aa = Math.max(a, b);
  const bb = Math.min(a, b);
  if (absY === 0) {
    return Math.abs(absX - aa);
  }
  let t = Math.atan2(absY * aa, absX * bb);
  for (let i = 0; i < iterations; i++) {
    const cosT2 = Math.cos(t);
    const sinT2 = Math.sin(t);
    const ex2 = aa * cosT2;
    const ey2 = bb * sinT2;
    const rx = aa * aa * (ex2 - absX);
    const ry = bb * bb * (ey2 - absY);
    const q = (ex2 - absX) * rx + (ey2 - absY) * ry;
    const p = rx * rx + ry * ry;
    if (Math.abs(q) < 1e-12 || Math.abs(p) < 1e-12) break;
    t -= q / p;
    t = clamp(t, 0, Math.PI / 2);
  }
  const cosT = Math.cos(t);
  const sinT = Math.sin(t);
  const ex = aa * cosT;
  const ey = bb * sinT;
  const dx = ex - absX;
  const dy = ey - absY;
  return Math.sqrt(dx * dx + dy * dy);
}
function getParabolaEvaluate(t, p) {
  return Point.create(p * t * t, 2 * p * t);
}
function getParabolaDerivative(t, p) {
  return Point.create(2 * p * t, 2 * p);
}
function getParabolaArcLength(t1, t2, p) {
  const integrate = (t) => {
    const sq = Math.sqrt(t * t + 1);
    return p * (t * sq + Math.log(t + sq));
  };
  return Math.abs(integrate(t2) - integrate(t1));
}
function getDistanceToParabola(px, py, p, samples = 32, iterations = 8) {
  const tMax = Math.sqrt(Math.abs(px) / Math.max(Math.abs(p), 1e-6)) + 1;
  let bestT = 0;
  let minDist2 = Infinity;
  for (let i = 0; i <= samples; i++) {
    const t2 = 2 * tMax * i / samples - tMax;
    const x2 = p * t2 * t2;
    const y2 = 2 * p * t2;
    const dx = x2 - px;
    const dy = y2 - py;
    const d22 = dx * dx + dy * dy;
    if (d22 < minDist2) {
      minDist2 = d22;
      bestT = t2;
    }
  }
  let t = bestT;
  for (let i = 0; i < iterations; i++) {
    const x2 = p * t * t - px;
    const y2 = 2 * p * t - py;
    const dx = 2 * p * t;
    const dy = 2 * p;
    const ddx = 2 * p;
    const ddy = 0;
    const ft = x2 * dx + y2 * dy;
    const ft2 = dx * dx + dy * dy + x2 * ddx + y2 * ddy;
    if (Math.abs(ft2) < 1e-15) break;
    t = t - ft / ft2;
  }
  const x = p * t * t - px;
  const y = 2 * p * t - py;
  const d2 = x * x + y * y;
  if (d2 < minDist2) minDist2 = d2;
  return Math.sqrt(minDist2);
}
function getHyperbolaEvaluate(t, a, b, branch = 1) {
  return Point.create(branch * a * Math.cosh(t), b * Math.sinh(t));
}
function getHyperbolaDerivative(t, a, b, branch = 1) {
  return Point.create(branch * a * Math.sinh(t), b * Math.cosh(t));
}
function getHyperbolaAsymptoteSlope(a, b) {
  return b / a;
}
function getHyperbolaEccentricity(a, b) {
  return Math.sqrt(1 + b * b / (a * a));
}
function getHyperbolaFoci(a, b) {
  const c = Math.sqrt(a * a + b * b);
  return [{ x: -c, y: 0 }, { x: c, y: 0 }];
}
function isPointInHyperbola(px, py, a, b) {
  const nx = px / a;
  const ny = py / b;
  return nx * nx - ny * ny >= 1;
}
class ConicSection {
  /** 离心率 */
  eccentricity;
  /** 焦点距离（半长轴或半实轴） */
  a;
  /** 半短轴或半虚轴 */
  b;
  /** 曲线类型 */
  type;
  constructor(eccentricity, a, b) {
    this.eccentricity = eccentricity;
    this.a = a;
    this.b = b;
    this.type = getConicType(eccentricity);
  }
  /** 创建椭圆 */
  static ellipse(a, b) {
    const e = a === b ? 0 : Math.sqrt(1 - b * b / (a * a));
    return new ConicSection(e, a, b);
  }
  /** 创建抛物线 */
  static parabola(p) {
    return new ConicSection(1, p, 0);
  }
  /** 创建双曲线 */
  static hyperbola(a, b) {
    const e = Math.sqrt(1 + b * b / (a * a));
    return new ConicSection(e, a, b);
  }
  /** 计算曲线上参数 t 处的点 */
  evaluate(t) {
    switch (this.type) {
      case 0:
        return getEllipseEvaluate(t, this.a, this.b);
      case 1:
        return getParabolaEvaluate(t, this.a);
      case 2:
        return getHyperbolaEvaluate(t, this.a, this.b);
    }
  }
  /** 计算曲线在 t 处的一阶导数 */
  derivative(t) {
    switch (this.type) {
      case 0:
        return getEllipseDerivative(t, this.a, this.b);
      case 1:
        return getParabolaDerivative(t, this.a);
      case 2:
        return getHyperbolaDerivative(t, this.a, this.b);
    }
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
    switch (this.type) {
      case 0:
        return getEllipseBounds(this.a, this.b);
      case 1:
        return BoundingRect.fromLTRB(0, -100, 100, 100);
      case 2:
        return BoundingRect.fromLTRB(this.a, -100, 100, 100);
    }
  }
  /** 计算点到曲线的最小距离 */
  distanceTo(px, py) {
    switch (this.type) {
      case 0:
        return getDistanceToEllipse(px, py, this.a, this.b);
      case 1:
        return getDistanceToParabola(px, py, this.a);
      case 2: {
        let minDist2 = Infinity;
        for (let i = -20; i <= 20; i++) {
          const t = i * 0.5;
          const p = this.evaluate(t);
          const dx = p.x - px;
          const dy = p.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < minDist2) minDist2 = d2;
        }
        return Math.sqrt(minDist2);
      }
    }
  }
  /**
   * 将曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   * @param range   - 参数范围 [tMin, tMax]（默认根据曲线类型自动）
   */
  flatten(epsilon = 0.5, range) {
    const [tMin, tMax] = range ?? this._defaultRange();
    const result = [];
    const samples = 64;
    const pts = [];
    for (let i = 0; i <= samples; i++) {
      const t = tMin + (tMax - tMin) * i / samples;
      pts.push(this.evaluate(t));
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
  _defaultRange() {
    switch (this.type) {
      case 0:
        return [0, 2 * Math.PI];
      case 1:
        return [-5, 5];
      case 2:
        return [-3, 3];
    }
  }
}
export {
  ConicSection,
  ConicType,
  getConicType,
  getDistanceToEllipse,
  getDistanceToParabola,
  getEllipseArea,
  getEllipseBounds,
  getEllipseDerivative,
  getEllipseEvaluate,
  getEllipsePerimeter,
  getHyperbolaAsymptoteSlope,
  getHyperbolaDerivative,
  getHyperbolaEccentricity,
  getHyperbolaEvaluate,
  getHyperbolaFoci,
  getParabolaArcLength,
  getParabolaDerivative,
  getParabolaEvaluate,
  isPointInEllipse,
  isPointInHyperbola
};
