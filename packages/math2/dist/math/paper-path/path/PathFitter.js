import { Numerical } from "../util/Numerical.js";
import { Segment } from "./Segment.js";
class PathFitter {
  /** 参与拟合的点（已去掉相邻重复点）。 */
  points = [];
  /** 原路径是否闭合。 */
  closed;
  constructor(path) {
    const points = this.points, segments = path._segments, closed = path._closed;
    let prev;
    for (let i = 0, l = segments.length; i < l; i++) {
      const point = segments[i].point;
      if (!prev || !prev.equals(point)) {
        points.push(prev = point.clone());
      }
    }
    if (closed) {
      points.unshift(points[points.length - 1]);
      points.push(points[1]);
    }
    this.closed = closed;
  }
  /** 按给定误差拟合，返回新的 segment 数组（没有点时返回 `null`）。 */
  fit(error) {
    const points = this.points, length = points.length;
    let segments = null;
    if (length > 0) {
      segments = [new Segment(points[0])];
      if (length > 1) {
        this.fitCubic(
          segments,
          error,
          0,
          length - 1,
          // 左切线
          points[1].subtract(points[0]),
          // 右切线
          points[length - 2].subtract(points[length - 1])
        );
        if (this.closed) {
          segments.shift();
          segments.pop();
        }
      }
    }
    return segments;
  }
  /** 对一组点拟合一段贝塞尔曲线。 */
  fitCubic(segments, error, first, last, tan1, tan2) {
    const points = this.points;
    if (last - first === 1) {
      const pt1 = points[first], pt2 = points[last], dist = pt1.getDistance(pt2) / 3;
      this.addCurve(segments, [
        pt1,
        pt1.add(tan1.normalize(dist)),
        pt2.add(tan2.normalize(dist)),
        pt2
      ]);
      return;
    }
    const uPrime = this.chordLengthParameterize(first, last);
    let maxError = Math.max(error, error * error), split, parametersInOrder = true;
    for (let i = 0; i <= 4; i++) {
      const curve = this.generateBezier(first, last, uPrime, tan1, tan2);
      const max = this.findMaxError(first, last, curve, uPrime);
      if (max.error < error && parametersInOrder) {
        this.addCurve(segments, curve);
        return;
      }
      split = max.index;
      if (max.error >= maxError)
        break;
      parametersInOrder = this.reparameterize(first, last, uPrime, curve);
      maxError = max.error;
    }
    const tanCenter = points[split - 1].subtract(points[split + 1]);
    this.fitCubic(segments, error, first, split, tan1, tanCenter);
    this.fitCubic(segments, error, split, last, tanCenter.negate(), tan2);
  }
  /** 把一段拟合结果追加为 segment。 */
  addCurve(segments, curve) {
    const prev = segments[segments.length - 1];
    prev.handleOut = curve[1].subtract(curve[0]);
    segments.push(new Segment(curve[3], curve[2].subtract(curve[3])));
  }
  /** 用最小二乘法求该区间贝塞尔曲线的控制点。 */
  generateBezier(first, last, uPrime, tan1, tan2) {
    const epsilon = Numerical.EPSILON, abs = Math.abs, points = this.points, pt1 = points[first], pt2 = points[last], C = [[0, 0], [0, 0]], X = [0, 0];
    for (let i = 0, l = last - first + 1; i < l; i++) {
      const u = uPrime[i], t = 1 - u, b = 3 * u * t, b0 = t * t * t, b1 = b * t, b2 = b * u, b3 = u * u * u, a1 = tan1.normalize(b1), a2 = tan2.normalize(b2), tmp = points[first + i].subtract(pt1.multiply(b0 + b1)).subtract(pt2.multiply(b2 + b3));
      C[0][0] += a1.dot(a1);
      C[0][1] += a1.dot(a2);
      C[1][0] = C[0][1];
      C[1][1] += a2.dot(a2);
      X[0] += a1.dot(tmp);
      X[1] += a2.dot(tmp);
    }
    const detC0C1 = C[0][0] * C[1][1] - C[1][0] * C[0][1];
    let alpha1, alpha2;
    if (abs(detC0C1) > epsilon) {
      const detC0X = C[0][0] * X[1] - C[1][0] * X[0], detXC1 = X[0] * C[1][1] - X[1] * C[0][1];
      alpha1 = detXC1 / detC0C1;
      alpha2 = detC0X / detC0C1;
    } else {
      const c0 = C[0][0] + C[0][1], c1 = C[1][0] + C[1][1];
      alpha1 = alpha2 = abs(c0) > epsilon ? X[0] / c0 : abs(c1) > epsilon ? X[1] / c1 : 0;
    }
    const segLength = pt2.getDistance(pt1), eps = epsilon * segLength;
    let handle1 = null, handle2 = null;
    if (alpha1 < eps || alpha2 < eps) {
      alpha1 = alpha2 = segLength / 3;
    } else {
      const line = pt2.subtract(pt1);
      handle1 = tan1.normalize(alpha1);
      handle2 = tan2.normalize(alpha2);
      if (handle1.dot(line) - handle2.dot(line) > segLength * segLength) {
        alpha1 = alpha2 = segLength / 3;
        handle1 = handle2 = null;
      }
    }
    return [
      pt1,
      pt1.add(handle1 || tan1.normalize(alpha1)),
      pt2.add(handle2 || tan2.normalize(alpha2)),
      pt2
    ];
  }
  /** 用给定参数化拟合后，尝试找出更好的参数化。 */
  reparameterize(first, last, u, curve) {
    for (let i = first; i <= last; i++) {
      u[i - first] = this.findRoot(curve, this.points[i], u[i - first]);
    }
    for (let i = 1, l = u.length; i < l; i++) {
      if (u[i] <= u[i - 1])
        return false;
    }
    return true;
  }
  /** 用牛顿-拉夫逊迭代求更好的根。 */
  findRoot(curve, point, u) {
    const curve1 = [], curve2 = [];
    for (let i = 0; i <= 2; i++) {
      curve1[i] = curve[i + 1].subtract(curve[i]).multiply(3);
    }
    for (let i = 0; i <= 1; i++) {
      curve2[i] = curve1[i + 1].subtract(curve1[i]).multiply(2);
    }
    const pt = this.evaluate(3, curve, u), pt1 = this.evaluate(2, curve1, u), pt2 = this.evaluate(1, curve2, u), diff = pt.subtract(point), df = pt1.dot(pt1) + diff.dot(pt2);
    return Numerical.isMachineZero(df) ? u : u - diff.dot(pt1) / df;
  }
  /** 在给定参数处求贝塞尔曲线的值。 */
  evaluate(degree, curve, t) {
    const tmp = curve.slice();
    for (let i = 1; i <= degree; i++) {
      for (let j = 0; j <= degree - i; j++) {
        tmp[j] = tmp[j].multiply(1 - t).add(tmp[j + 1].multiply(t));
      }
    }
    return tmp[0];
  }
  /** 用相邻点之间的相对距离给点分配参数值。 */
  chordLengthParameterize(first, last) {
    const u = [0];
    for (let i = first + 1; i <= last; i++) {
      u[i - first] = u[i - first - 1] + this.points[i].getDistance(this.points[i - 1]);
    }
    for (let i = 1, m = last - first; i <= m; i++) {
      u[i] /= u[m];
    }
    return u;
  }
  /** 找出拟合曲线与数据点之间的最大平方距离。 */
  findMaxError(first, last, curve, u) {
    let index = Math.floor((last - first + 1) / 2), maxDist = 0;
    for (let i = first + 1; i < last; i++) {
      const P = this.evaluate(3, curve, u[i - first]), v = P.subtract(this.points[i]), dist = v.x * v.x + v.y * v.y;
      if (dist >= maxDist) {
        maxDist = dist;
        index = i;
      }
    }
    return {
      error: maxDist,
      index
    };
  }
}
export {
  PathFitter
};
