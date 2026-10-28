import { Numerical } from "../util/Numerical.js";
import { Formatter } from "../util/Formatter.js";
import { Curve } from "./Curve.js";
const pathIds = /* @__PURE__ */ new WeakMap();
let nextPathId = 1;
function getPathId(path) {
  let id = pathIds.get(path);
  if (id === void 0)
    pathIds.set(path, id = nextPathId++);
  return id;
}
class CurveLocation {
  _curve;
  _path;
  _version;
  /** 距离该位置最近的线段，按需计算。 */
  _segment;
  _segment1;
  _segment2;
  _time;
  _point;
  _offset;
  _curveOffset;
  _distance;
  _overlap;
  /** 与之关联的交点位置。 */
  _intersection;
  constructor(curve, time, point, overlap, distance) {
    if (time >= 1 - Numerical.CURVETIME_EPSILON) {
      const next = curve.next;
      if (next) {
        time = 0;
        curve = next;
      }
    }
    this._setCurve(curve);
    this._time = time;
    this._point = point || curve.getPointAtTime(time);
    this._overlap = overlap;
    this._distance = distance;
    this._intersection = null;
  }
  _setPath(path) {
    this._path = path;
    this._version = path ? path._version : 0;
  }
  _setCurve(curve) {
    this._setPath(curve._path);
    this._curve = curve;
    this._segment = null;
    this._segment1 = curve._segment1;
    this._segment2 = curve._segment2;
  }
  _setSegment(segment) {
    const curve = segment.curve;
    if (curve) {
      this._setCurve(curve);
    } else {
      this._setPath(segment._path || null);
      this._segment1 = segment;
      this._segment2 = null;
    }
    this._segment = segment;
    this._time = segment === this._segment1 ? 0 : 1;
    this._point = segment._point.clone();
  }
  // ---------------------------------------------------------------------
  // segment、curve、path、index
  /** 曲线上距离该位置最近的线段。 */
  get segment() {
    let segment = this._segment;
    if (!segment) {
      const curve = this.curve, time = this.time;
      if (curve) {
        if (time === 0) {
          segment = curve._segment1;
        } else if (time === 1) {
          segment = curve._segment2;
        } else if (time != null) {
          segment = curve.getPartLength(0, time) < curve.getPartLength(time, 1) ? curve._segment1 : curve._segment2;
        }
      }
      this._segment = segment;
    }
    return segment;
  }
  /** 该位置所属的曲线。 */
  get curve() {
    const path = this._path, that = this;
    if (path && path._version !== this._version) {
      this._time = this._offset = this._curveOffset = null;
      this._curve = null;
    }
    function trySegment(segment) {
      const curve = segment && segment.curve;
      if (curve && (that._time = curve.getTimeOf(that._point)) != null) {
        that._setCurve(curve);
        return curve;
      }
    }
    return this._curve || trySegment(this._segment) || trySegment(this._segment1) || trySegment(this._segment2 && this._segment2.previous) || null;
  }
  /** 该位置所在的路径。 */
  get path() {
    const curve = this.curve;
    return curve && curve._path || null;
  }
  /** 曲线在路径曲线数组中的下标。 */
  get index() {
    const curve = this.curve;
    return curve ? curve.index : null;
  }
  // ---------------------------------------------------------------------
  // time、point、offsets
  /**
   * curve-time 参数，供各种贝塞尔曲线计算使用。取值 0（曲线起点）到 1
   * （曲线终点）。
   */
  get time() {
    const curve = this.curve, time = this._time;
    return curve && time == null ? this._time = curve.getTimeOf(this._point) : time;
  }
  /** 由 curve 与 time 确定的点。 */
  get point() {
    return this._point;
  }
  /**
   * 从路径起点到该位置的长度。若曲线不属于路径，则返回曲线内的长度。
   */
  get offset() {
    let offset = this._offset;
    if (offset == null) {
      offset = 0;
      const path = this.path, index = this.index;
      if (path && index != null) {
        const curves = path.curves;
        for (let i = 0; i < index; i++)
          offset += curves[i].length;
      }
      this._offset = offset += this.curveOffset;
    }
    return offset;
  }
  /** 从曲线起点到该位置的长度。 */
  get curveOffset() {
    let offset = this._curveOffset;
    if (offset == null) {
      const curve = this.curve, time = this.time;
      this._curveOffset = offset = time != null && curve ? curve.getPartLength(0, time) : null;
    }
    return offset;
  }
  // ---------------------------------------------------------------------
  // 交点
  /**
   * 相交曲线上的对应位置；若该位置是 `PathItem#getIntersections()` 或
   * `Curve#getIntersections()` 的结果，则该值不为空。
   */
  get intersection() {
    return this._intersection;
  }
  /** 查询点到该位置的距离。 */
  get distance() {
    return this._distance;
  }
  /** 该位置处曲线的切向量。 */
  get tangent() {
    const curve = this.curve, time = this.time;
    return time != null && curve ? curve.getTangentAtTime(time) : null;
  }
  /** 该位置处曲线的法向量。 */
  get normal() {
    const curve = this.curve, time = this.time;
    return time != null && curve ? curve.getNormalAtTime(time) : null;
  }
  /** 该位置处曲线的曲率。 */
  get curvature() {
    const curve = this.curve, time = this.time;
    return time != null && curve ? curve.getCurvatureAtTime(time) : null;
  }
  // ---------------------------------------------------------------------
  divide() {
    const curve = this.curve, res = curve && curve.divideAtTime(this.time);
    if (res)
      this._setSegment(res._segment1);
    return res;
  }
  split() {
    const curve = this.curve, path = curve && curve._path, res = curve && curve.splitAtTime(this.time);
    if (res && path)
      this._setSegment(path.lastSegment);
    return res;
  }
  /**
   * 判断两个 CurveLocation 是否描述路径上的同一位置，采用与处理
   * curve-time 参数一致的容差。
   */
  equals(location, _ignoreOther) {
    let res = this === location;
    if (!res && location instanceof CurveLocation) {
      const c1 = this.curve, c2 = location.curve, p1 = c1 && c1._path, p2 = c2 && c2._path;
      if (p1 === p2) {
        const epsilon = Numerical.GEOMETRIC_EPSILON, diff = Math.abs(this.offset - location.offset), i1 = !_ignoreOther && this._intersection, i2 = !_ignoreOther && location._intersection;
        res = (diff < epsilon || !!p1 && Math.abs(p1.length - diff) < epsilon) && (!i1 && !i2 || !!i1 && !!i2 && i1.equals(i2, true));
      }
    }
    return res;
  }
  toString() {
    const parts = [], point = this.point, f = Formatter.instance;
    if (point)
      parts.push("point: " + point);
    const index = this.index;
    if (index != null)
      parts.push("index: " + index);
    const time = this.time;
    if (time != null)
      parts.push("time: " + f.number(time));
    if (this._distance != null)
      parts.push("distance: " + f.number(this._distance));
    return "{ " + parts.join(", ") + " }";
  }
  // ---------------------------------------------------------------------
  // 判断
  /**
   * 若该位置是与其他曲线的交点，判断它只是接触另一条曲线，而不是穿过。
   */
  isTouching() {
    const inter = this._intersection, tangent = this.tangent;
    if (inter && tangent) {
      const interTangent = inter.tangent;
      if (interTangent && tangent.isCollinear(interTangent)) {
        const curve1 = this.curve, curve2 = inter.curve;
        return !(curve1 && curve2 && curve1.isStraight() && curve2.isStraight() && curve1.getLine().intersect(curve2.getLine()));
      }
    }
    return false;
  }
  /**
   * 若该位置是与其他曲线的交点，判断它是穿过另一条曲线，而不只是接触。
   */
  isCrossing() {
    const inter = this._intersection;
    if (!inter)
      return false;
    const t1 = this.time, t2 = inter.time, tMin = Numerical.CURVETIME_EPSILON, tMax = 1 - tMin, t1Inside = t1 != null && t1 >= tMin && t1 <= tMax, t2Inside = t2 != null && t2 >= tMin && t2 <= tMax;
    if (t1Inside && t2Inside)
      return !this.isTouching();
    let c2 = this.curve, c1 = c2 && t1 < tMin ? c2.previous : c2, c4 = inter.curve, c3 = c4 && t2 < tMin ? c4.previous : c4;
    if (t1 > tMax)
      c2 = c2 && c2.next;
    if (t2 > tMax)
      c4 = c4 && c4.next;
    if (!c1 || !c2 || !c3 || !c4)
      return false;
    const offsets = [];
    function addOffsets(curve, end) {
      const v = curve.getValues(), roots = Curve.classify(v).roots || Curve.getPeaks(v), count = roots.length, offset2 = Curve.getLength(
        v,
        end && count ? roots[count - 1] : 0,
        !end && count ? roots[0] : 1
      );
      offsets.push(count ? offset2 : offset2 / 32);
    }
    function isInRange(angle, min, max) {
      return min < max ? angle > min && angle < max : angle > min || angle < max;
    }
    if (!t1Inside) {
      addOffsets(c1, true);
      addOffsets(c2, false);
    }
    if (!t2Inside) {
      addOffsets(c3, true);
      addOffsets(c4, false);
    }
    const pt = this.point, offset = Math.min.apply(Math, offsets), v2 = t1Inside ? c2.getTangentAtTime(t1) : c2.getPointAt(offset).subtract(pt), v1 = t1Inside ? v2.negate() : c1.getPointAt(-offset).subtract(pt), v4 = t2Inside ? c4.getTangentAtTime(t2) : c4.getPointAt(offset).subtract(pt), v3 = t2Inside ? v4.negate() : c3.getPointAt(-offset).subtract(pt), a1 = v1.angle, a2 = v2.angle, a3 = v3.angle, a4 = v4.angle;
    return !!(t1Inside ? isInRange(a1, a3, a4) !== isInRange(a2, a3, a4) && isInRange(a1, a4, a3) !== isInRange(a2, a4, a3) : isInRange(a3, a1, a2) !== isInRange(a4, a1, a2) && isInRange(a3, a2, a1) !== isInRange(a4, a2, a1));
  }
  /** 该位置是否属于两条路径的重叠部分。 */
  hasOverlap() {
    return !!this._overlap;
  }
  // ---------------------------------------------------------------------
  // 静态方法
  /**
   * 把一个位置插入已排序的列表；若已有描述同一处的位置，则与之合并。
   *
   * @return 插入的位置，或合并到的已有位置
   */
  static insert(locations, location, merge) {
    const length = locations.length;
    let l = 0, r = length - 1;
    function search(index, dir) {
      for (let i = index + dir; i >= -1 && i <= length; i += dir) {
        const loc2 = locations[(i % length + length) % length];
        if (!location.point.isClose(
          loc2.point,
          Numerical.GEOMETRIC_EPSILON
        ))
          break;
        if (location.equals(loc2))
          return loc2;
      }
      return null;
    }
    while (l <= r) {
      const m = l + r >>> 1, loc2 = locations[m];
      let found = null;
      if (merge && (found = location.equals(loc2) ? loc2 : search(m, -1) || search(m, 1))) {
        if (location._overlap && found._intersection)
          found._intersection._overlap = true;
        found._overlap = true;
        return found;
      }
      const path1 = location.path, path2 = loc2.path, diff = path1 !== path2 && path1 && path2 ? getPathId(path1) - getPathId(path2) : (location.index || 0) + (location.time || 0) - ((loc2.index || 0) + (loc2.time || 0));
      if (diff < 0) {
        r = m - 1;
      } else {
        l = m + 1;
      }
    }
    locations.splice(l, 0, location);
    return location;
  }
  /**
   * 把传入的位置列表与其关联的交点位置一起展开，并按顺序排好。
   */
  static expand(locations) {
    const expanded = locations.slice();
    for (let i = locations.length - 1; i >= 0; i--) {
      const inter = locations[i]._intersection;
      if (inter)
        CurveLocation.insert(expanded, inter);
    }
    return expanded;
  }
}
export {
  CurveLocation
};
