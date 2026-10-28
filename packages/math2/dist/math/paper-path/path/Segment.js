import { Point } from "../basic/Point.js";
import { SegmentPoint } from "./SegmentPoint.js";
import { CurveLocation } from "./CurveLocation.js";
class Segment {
  _point;
  _handleIn;
  _handleOut;
  _path;
  _index;
  _curves;
  constructor(point, handleIn, handleOut) {
    this._point = new SegmentPoint(point, this);
    this._handleIn = new SegmentPoint(handleIn, this);
    this._handleOut = new SegmentPoint(handleOut, this);
  }
  _changed(point) {
    const path = this._path;
    if (!path)
      return;
    const curves = path._curves, index = this._index;
    let curve;
    if (curves) {
      if ((!point || point === this._point || point === this._handleIn) && (curve = index > 0 ? curves[index - 1] : path._closed ? curves[curves.length - 1] : null))
        curve._changed();
      if ((!point || point === this._point || point === this._handleOut) && (curve = curves[index]))
        curve._changed();
    }
    path._changed();
  }
  // ---------------------------------------------------------------------
  // point、handleIn、handleOut
  /** segment 的锚点。 */
  get point() {
    return this._point;
  }
  set point(point) {
    this._point._set(point.x, point.y);
  }
  /** 描述入切线的控制柄，相对于锚点。 */
  get handleIn() {
    return this._handleIn;
  }
  set handleIn(handleIn) {
    this._handleIn._set(handleIn.x, handleIn.y);
  }
  /** 描述出切线的控制柄，相对于锚点。 */
  get handleOut() {
    return this._handleOut;
  }
  set handleOut(handleOut) {
    this._handleOut._set(handleOut.x, handleOut.y);
  }
  /** segment 是否设置了任何控制柄。 */
  hasHandles() {
    return !this._handleIn.isZero() || !this._handleOut.isZero();
  }
  /**
   * segment 处的两条曲线是否平滑连接，即两个控制柄共线且不构成尖角。
   */
  isSmooth() {
    const handleIn = this._handleIn, handleOut = this._handleOut;
    return !handleIn.isZero() && !handleOut.isZero() && handleIn.isCollinear(handleOut);
  }
  /** 把控制柄坐标清零，使 segment 变成尖角。 */
  clearHandles() {
    this._handleIn._set(0, 0);
    this._handleOut._set(0, 0);
  }
  // ---------------------------------------------------------------------
  // 层级关系
  /** segment 在路径 segments 数组中的索引。 */
  get index() {
    return this._index !== void 0 ? this._index : null;
  }
  /** segment 所属的路径。 */
  get path() {
    return this._path || null;
  }
  /**
   * segment 所属的曲线。对于开放路径的最后一个 segment，返回它前面那条曲线。
   */
  get curve() {
    const path = this._path;
    let index = this._index;
    if (path) {
      if (index > 0 && !path._closed && index === path._segments.length - 1)
        index--;
      return path.curves[index] || null;
    }
    return null;
  }
  /** 描述该 segment 在路径上位置的 CurveLocation。 */
  get location() {
    const curve = this.curve;
    return curve ? new CurveLocation(curve, this === curve._segment1 ? 0 : 1) : null;
  }
  /** 路径 segments 数组中的下一个 segment。 */
  get next() {
    const path = this._path, segments = path && path._segments;
    return segments && (segments[this._index + 1] || path._closed && segments[0]) || null;
  }
  /** 路径 segments 数组中的上一个 segment。 */
  get previous() {
    const path = this._path, segments = path && path._segments;
    return segments && (segments[this._index - 1] || path._closed && segments[segments.length - 1]) || null;
  }
  // ---------------------------------------------------------------------
  /**
   * 通过调整控制柄的方向和长度，平滑穿过该 segment 的贝塞尔曲线，但不移动
   * segment 本身。
   *
   * `type` 为 `'catmull-rom'`（默认）或 `'geometric'`；`factor` 是该方法的
   * 参数:节点参数化（默认 `0.5`）或张力（默认 `0.4`）。
   */
  smooth(options, _first, _last) {
    const opts = options || {}, type = opts.type, factor = opts.factor, prev = this.previous, next = this.next, p0 = (prev || this)._point, p1 = this._point, p2 = (next || this)._point, d1 = p0.getDistance(p1), d2 = p1.getDistance(p2);
    if (!type || type === "catmull-rom") {
      const a = factor === void 0 ? 0.5 : factor, d1_a = Math.pow(d1, a), d1_2a = d1_a * d1_a, d2_a = Math.pow(d2, a), d2_2a = d2_a * d2_a;
      if (!_first && prev) {
        const A = 2 * d2_2a + 3 * d2_a * d1_a + d1_2a, N = 3 * d2_a * (d2_a + d1_a);
        this.handleIn = N !== 0 ? new Point(
          (d2_2a * p0._x + A * p1._x - d1_2a * p2._x) / N - p1._x,
          (d2_2a * p0._y + A * p1._y - d1_2a * p2._y) / N - p1._y
        ) : new Point();
      }
      if (!_last && next) {
        const A = 2 * d1_2a + 3 * d1_a * d2_a + d2_2a, N = 3 * d1_a * (d1_a + d2_a);
        this.handleOut = N !== 0 ? new Point(
          (d1_2a * p2._x + A * p1._x - d2_2a * p0._x) / N - p1._x,
          (d1_2a * p2._y + A * p1._y - d2_2a * p0._y) / N - p1._y
        ) : new Point();
      }
    } else if (type === "geometric") {
      if (prev && next) {
        const vector = p0.subtract(p2), t = factor === void 0 ? 0.4 : factor, k = t * d1 / (d1 + d2);
        if (!_first)
          this.handleIn = vector.multiply(k);
        if (!_last)
          this.handleOut = vector.multiply(k - t);
      }
    } else {
      throw new Error("Smoothing method '" + type + "' not supported.");
    }
  }
  /** 该 segment 是否是路径 segments 数组中的第一个。 */
  isFirst() {
    return !this._index;
  }
  /** 该 segment 是否是路径 segments 数组中的最后一个。 */
  isLast() {
    const path = this._path;
    return path && this._index === path._segments.length - 1 || false;
  }
  /** 原地交换该 segment 的 `handleIn` 与 `handleOut`。 */
  reverse() {
    const handleIn = this._handleIn, handleOut = this._handleOut, tmp = handleIn.clone();
    handleIn._set(handleOut.x, handleOut.y);
    handleOut._set(tmp.x, tmp.y);
  }
  /** 返回反转后的 segment 副本。 */
  reversed() {
    return new Segment(this._point, this._handleOut, this._handleIn);
  }
  /** 把它从所属路径中移除。 */
  remove() {
    return this._path ? !!this._path.removeSegment(this._index) : false;
  }
  clone() {
    return new Segment(this._point, this._handleIn, this._handleOut);
  }
  equals(segment) {
    return segment === this || !!segment && this._point.equals(segment._point) && this._handleIn.equals(segment._handleIn) && this._handleOut.equals(segment._handleOut) || false;
  }
  toString() {
    const parts = ["point: " + this._point];
    if (!this._handleIn.isZero())
      parts.push("handleIn: " + this._handleIn);
    if (!this._handleOut.isZero())
      parts.push("handleOut: " + this._handleOut);
    return "{ " + parts.join(", ") + " }";
  }
  /**
   * 在两个指定 segment 之间插值，并据此设置该 segment 的锚点和控制柄。
   */
  interpolate(from, to, factor) {
    const u = 1 - factor, v = factor, point1 = from._point, point2 = to._point, handleIn1 = from._handleIn, handleIn2 = to._handleIn, handleOut2 = to._handleOut, handleOut1 = from._handleOut;
    this._point._set(
      u * point1._x + v * point2._x,
      u * point1._y + v * point2._y,
      true
    );
    this._handleIn._set(
      u * handleIn1._x + v * handleIn2._x,
      u * handleIn1._y + v * handleIn2._y,
      true
    );
    this._handleOut._set(
      u * handleOut1._x + v * handleOut2._x,
      u * handleOut1._y + v * handleOut2._y,
      true
    );
    this._changed();
  }
  /** 用指定矩阵变换该 segment。 */
  transform(matrix) {
    this._transformCoordinates(matrix, new Array(6), true);
    this._changed();
  }
  /**
   * 变换 segment 的锚点和控制柄。`change` 为真时只变换已设置的控制柄，并把
   * 结果写回，以节省计算；为假时总是填满 coords 数组。
   */
  _transformCoordinates(matrix, coords, change) {
    const point = this._point, handleIn = !change || !this._handleIn.isZero() ? this._handleIn : null, handleOut = !change || !this._handleOut.isZero() ? this._handleOut : null, x = point._x, y = point._y;
    let i = 2;
    coords[0] = x;
    coords[1] = y;
    if (handleIn) {
      coords[i++] = handleIn._x + x;
      coords[i++] = handleIn._y + y;
    }
    if (handleOut) {
      coords[i++] = handleOut._x + x;
      coords[i++] = handleOut._y + y;
    }
    if (matrix) {
      matrix._transformCoordinates(coords, coords, i / 2);
      const tx = coords[0], ty = coords[1];
      if (change) {
        point._x = tx;
        point._y = ty;
        i = 2;
        if (handleIn) {
          handleIn._x = coords[i++] - tx;
          handleIn._y = coords[i++] - ty;
        }
        if (handleOut) {
          handleOut._x = coords[i++] - tx;
          handleOut._y = coords[i++] - ty;
        }
      } else {
        if (!handleIn) {
          coords[i++] = tx;
          coords[i++] = ty;
        }
        if (!handleOut) {
          coords[i++] = tx;
          coords[i++] = ty;
        }
      }
    }
    return coords;
  }
}
export {
  Segment
};
