import { Point } from "./Point.js";
import { BoundingRect } from "./BoundingRect.js";
import { clamp } from "./MathUtils.js";
function getBSplineBasis(u) {
  const u2 = u * u;
  const u3 = u2 * u;
  const inv6 = 1 / 6;
  return [
    inv6 * (1 - 3 * u + 3 * u2 - u3),
    inv6 * (4 - 6 * u2 + 3 * u3),
    inv6 * (1 + 3 * u + 3 * u2 - 3 * u3),
    inv6 * u3
  ];
}
function getBSplineBasisDerivative(u) {
  const u2 = u * u;
  const inv6 = 1 / 6;
  return [
    inv6 * (-3 + 6 * u - 3 * u2),
    inv6 * (-12 * u + 9 * u2),
    inv6 * (3 + 6 * u - 9 * u2),
    inv6 * (3 * u2)
  ];
}
function getBSplineEvaluate(u, p0, p1, p2, p3) {
  const [b0, b1, b2, b3] = getBSplineBasis(u);
  return Point.create(
    b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
    b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y
  );
}
function getBSplineDerivative(u, p0, p1, p2, p3) {
  const [b0, b1, b2, b3] = getBSplineBasisDerivative(u);
  return Point.create(
    b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
    b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y
  );
}
function getBSplineSegmentBounds(p0, p1, p2, p3) {
  const points = [p1, p2];
  const samples = 16;
  for (let i = 1; i < samples; i++) {
    const u = i / samples;
    points.push(getBSplineEvaluate(u, p0, p1, p2, p3));
  }
  return BoundingRect.default().fromPoints(points);
}
class BSpline {
  /** 控制点序列（至少 4 个点） */
  points;
  constructor(points) {
    this.points = points.map((p) => ({ x: p.x, y: p.y }));
  }
  /** 段数 */
  get segmentCount() {
    return Math.max(0, this.points.length - 3);
  }
  /** 将全局参数 t∈[0,1] 映射到段索引和段内参数 */
  _toSegment(t) {
    const n = this.segmentCount;
    if (n === 0) return { seg: 0, localU: 0 };
    const scaled = clamp(t, 0, 1) * n;
    const seg = Math.min(Math.floor(scaled), n - 1);
    const localU = scaled - seg;
    return { seg, localU };
  }
  /** 计算曲线上参数 t∈[0,1] 处的点 */
  evaluate(t) {
    const { seg, localU } = this._toSegment(t);
    const p = this.points;
    return getBSplineEvaluate(localU, p[seg], p[seg + 1], p[seg + 2], p[seg + 3]);
  }
  /** 计算曲线在 t 处的一阶导数（切向量） */
  derivative(t) {
    const { seg, localU } = this._toSegment(t);
    const p = this.points;
    return getBSplineDerivative(localU, p[seg], p[seg + 1], p[seg + 2], p[seg + 3]);
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
    const rect = BoundingRect.default();
    const n = this.segmentCount;
    if (n === 0) return rect;
    for (let i = 0; i < n; i++) {
      const segBounds = getBSplineSegmentBounds(
        this.points[i],
        this.points[i + 1],
        this.points[i + 2],
        this.points[i + 3]
      );
      if (i === 0) {
        rect.min.x = segBounds.min.x;
        rect.min.y = segBounds.min.y;
        rect.max.x = segBounds.max.x;
        rect.max.y = segBounds.max.y;
      } else {
        rect.min.x = Math.min(rect.min.x, segBounds.min.x);
        rect.min.y = Math.min(rect.min.y, segBounds.min.y);
        rect.max.x = Math.max(rect.max.x, segBounds.max.x);
        rect.max.y = Math.max(rect.max.y, segBounds.max.y);
      }
    }
    return rect;
  }
  /**
   * 将曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   */
  flatten(epsilon = 0.5) {
    const result = [];
    const n = this.segmentCount;
    if (n === 0) return result;
    for (let seg = 0; seg < n; seg++) {
      const p0 = this.points[seg];
      const p1 = this.points[seg + 1];
      const p2 = this.points[seg + 2];
      const p3 = this.points[seg + 3];
      if (seg === 0) result.push(getBSplineEvaluate(0, p0, p1, p2, p3));
      this._flattenSegment(p0, p1, p2, p3, epsilon, result);
    }
    return result;
  }
  _flattenSegment(p0, p1, p2, p3, epsilon, out) {
    const subdivide = (t0, t1, a) => {
      const tm = (t0 + t1) * 0.5;
      const mid = getBSplineEvaluate(tm, p0, p1, p2, p3);
      const b = getBSplineEvaluate(t1, p0, p1, p2, p3);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len2 = dx * dx + dy * dy;
      if (len2 < 1e-20) {
        out.push(b);
        return;
      }
      const dist = Math.abs((mid.x - a.x) * dy - (mid.y - a.y) * dx) / Math.sqrt(len2);
      if (dist <= epsilon) {
        out.push(b);
      } else {
        subdivide(t0, tm, a);
        subdivide(tm, t1, mid);
      }
    };
    subdivide(0, 1, getBSplineEvaluate(0, p0, p1, p2, p3));
  }
  /**
   * 计算点到曲线的最小距离
   * @param samples - 每段采样数（默认 16）
   */
  distanceTo(px, py, samples = 16) {
    const n = this.segmentCount;
    if (n === 0) return Infinity;
    let minDist2 = Infinity;
    for (let seg = 0; seg < n; seg++) {
      const p = this.points;
      for (let i = 0; i <= samples; i++) {
        const u = i / samples;
        const pt = getBSplineEvaluate(u, p[seg], p[seg + 1], p[seg + 2], p[seg + 3]);
        const dx = pt.x - px;
        const dy = pt.y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < minDist2) minDist2 = d2;
      }
    }
    return Math.sqrt(minDist2);
  }
  /**
   * 计算点在曲线上的投影点（最近点）
   * @param samples - 每段采样数（默认 16）
   */
  projectPoint(px, py, samples = 16) {
    const n = this.segmentCount;
    if (n === 0) return { x: 0, y: 0 };
    let bestT = 0;
    let minDist2 = Infinity;
    for (let seg = 0; seg < n; seg++) {
      const p = this.points;
      for (let i = 0; i <= samples; i++) {
        const u = i / samples;
        const pt = getBSplineEvaluate(u, p[seg], p[seg + 1], p[seg + 2], p[seg + 3]);
        const dx = pt.x - px;
        const dy = pt.y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < minDist2) {
          minDist2 = d2;
          bestT = (seg + u) / n;
        }
      }
    }
    return this.evaluate(bestT);
  }
}
export {
  BSpline,
  getBSplineBasis,
  getBSplineBasisDerivative,
  getBSplineDerivative,
  getBSplineEvaluate,
  getBSplineSegmentBounds
};
