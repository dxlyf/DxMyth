import { Point } from "../basic/Point.js";
import { Matrix } from "../basic/Matrix.js";
import { Rectangle } from "../basic/Rectangle.js";
import { Size } from "../basic/Size.js";
import { Numerical } from "../util/Numerical.js";
import { Formatter } from "../util/Formatter.js";
import { Curve } from "./Curve.js";
import { CurveLocation } from "./CurveLocation.js";
import { Line } from "../basic/Line.js";
import { PathItem } from "./PathItem.js";
import { CompoundPath } from "./CompoundPath.js";
import { PathFlattener } from "./PathFlattener.js";
import { PathFitter } from "./PathFitter.js";
import { Segment } from "./Segment.js";
import { StrokeProfileStop } from "./StrokeProfileStop.js";
import { parsePathData } from "./pathData.js";
const kappa = Numerical.KAPPA;
const ellipseSegments = [
  new Segment(new Point(-1, 0), new Point(0, kappa), new Point(0, -kappa)),
  new Segment(new Point(0, -1), new Point(-kappa, 0), new Point(kappa, 0)),
  new Segment(new Point(1, 0), new Point(0, -kappa), new Point(0, kappa)),
  new Segment(new Point(0, 1), new Point(kappa, 0), new Point(-kappa, 0))
];
const strokeTimeMin = Numerical.CURVETIME_EPSILON, strokeTimeMax = 1 - strokeTimeMin;
const penDefaults = { width: 1, aspect: 1, angle: 0 };
function getStrokeEntries(path) {
  const profile = path._strokeProfile || [];
  return profile.map((stop) => ({
    offset: stop.offset,
    width: stop._width,
    aspect: stop._aspect,
    angle: stop._angle,
    smooth: stop._smooth
  }));
}
function getStrokeValue(entries, key, offset, length, closed, after) {
  const stops = entries.filter((entry) => entry[key] != null), count = stops.length;
  let index = -1;
  function getStop(i) {
    const turns = Math.floor(i / count), stop = stops[i - turns * count];
    return {
      offset: stop.offset + turns * length,
      value: stop[key],
      smooth: stop.smooth
    };
  }
  function getSlope(i, forward) {
    const stop = getStop(i), other = getStop(forward ? i + 1 : i - 1);
    return stop.smooth ? 0 : (other.value - stop.value) / (other.offset - stop.offset);
  }
  if (count) {
    for (let i = 0; i < count; i++) {
      const stopOffset = stops[i].offset;
      if (stopOffset < offset || stopOffset === offset && after)
        index = i;
    }
    if (closed || index >= 0 && index < count - 1) {
      const stop1 = getStop(index), stop2 = getStop(index + 1), h = stop2.offset - stop1.offset, t = (offset - stop1.offset) / h, v1 = stop1.value, v2 = stop2.value, m1 = getSlope(index, true) * h, m2 = getSlope(index + 1, false) * h;
      return [
        ((2 * t - 3) * t * t + 1) * v1 + ((t - 2) * t + 1) * t * m1 + (3 - 2 * t) * t * t * v2 + (t - 1) * t * t * m2,
        (6 * (t - 1) * t * (v1 - v2) + ((3 * t - 4) * t + 1) * m1 + (3 * t - 2) * t * m2) / h,
        ((12 * t - 6) * (v1 - v2) + (6 * t - 4) * m1 + (6 * t - 2) * m2) / (h * h)
      ];
    }
    return [stops[index < 0 ? 0 : count - 1][key], 0, 0];
  }
  return null;
}
function getStrokeValues(entries, offset, length, closed, after) {
  const values = { offset };
  for (const key in penDefaults) {
    const value = getStrokeValue(entries, key, offset, length, closed, after);
    values[key] = value && value[0];
  }
  return values;
}
function getStrokePart(entries, from, to, length, closed, hasStart, hasEnd, fallbacks) {
  function getEnd(offset, after) {
    const values = getStrokeValues(
      entries,
      offset,
      length,
      closed,
      after
    );
    for (const key in fallbacks) {
      if (values[key] == null)
        values[key] = fallbacks[key];
    }
    let stop = null;
    for (let i = 0, l = entries.length; i < l; i++) {
      if (entries[i].offset === offset && (after || !stop))
        stop = entries[i];
    }
    values.smooth = !!stop && stop.smooth;
    return values;
  }
  const part = [];
  for (let i = 0, l = entries.length; i < l; i++) {
    const entry = entries[i];
    let offset = entry.offset;
    if (closed && offset < from)
      offset += length;
    if ((offset > from || offset === from && !hasStart) && (offset < to || offset === to && !hasEnd))
      part.push(Object.assign({}, entry, { offset: offset - from }));
  }
  part.sort((a, b) => a.offset - b.offset);
  if (hasStart)
    part.unshift(Object.assign(getEnd(from, true), { offset: 0 }));
  if (hasEnd) {
    part.push(Object.assign(
      getEnd(closed ? to % length : to),
      { offset: to - from }
    ));
  }
  return part;
}
function getStrokeSpanIndex(path, start, count, fraction) {
  const curves = path.curves, lengths = [];
  let total = 0;
  for (let i2 = 0; i2 < count; i2++) {
    const length = curves[(start + i2) % curves.length].length;
    lengths.push(length);
    total += length;
  }
  let rest = fraction * total, i = 0;
  while (i < count - 1 && rest >= lengths[i])
    rest -= lengths[i++];
  const index = start + i + (lengths[i] ? Math.min(rest / lengths[i], 1) : 0);
  return path._closed ? index % curves.length : index;
}
function pensEqual(a, b) {
  for (const key in penDefaults) {
    if (a[key] !== b[key])
      return false;
  }
  return a.offset === b.offset;
}
function getCurrentSegment(that) {
  const segments = that._segments;
  if (!segments.length)
    throw new Error("Use a moveTo() command first");
  return segments[segments.length - 1];
}
class Path extends PathItem {
  _length;
  _area;
  /** 描边轮廓的停靠点，按偏移排序，见 {@link #strokeProfile}。 */
  _strokeProfile = null;
  constructor(segments = [], closed = false) {
    super();
    this._closed = closed;
    this.setSegments(segments);
  }
  // ---------------------------------------------------------------------
  // 曲线与 segment
  /** 由 segments 构建（或复用）曲线数组。 */
  get curves() {
    let curves = this._curves;
    if (!curves) {
      const segments = this._segments, length = this._countCurves();
      curves = this._curves = new Array(length);
      for (let i = 0; i < length; i++) {
        const curve = new Curve(
          segments[i],
          // 闭合路径的最后一条曲线回到第一个 segment。
          segments[i + 1] || segments[0]
        );
        curve._path = this;
        curves[i] = curve;
      }
    }
    return curves;
  }
  /** 曲线的数量:闭合路径等于 segment 数量，开放路径少一条。 */
  _countCurves() {
    const length = this._segments.length;
    return this._closed ? length : Math.max(length - 1, 0);
  }
  /** 路径的 segment 数组。 */
  get segments() {
    return this._segments;
  }
  /** 用一组 segment 替换当前内容。 */
  set segments(segments) {
    this.setSegments(segments);
  }
  setSegments(segments) {
    this._segments.length = 0;
    this._curves = null;
    if (segments && segments.length)
      this._add(segments);
    this._changed();
  }
  /** 路径是否闭合。 */
  set closed(closed) {
    if (this._closed !== !!closed) {
      this._closed = !!closed;
      this._curves = null;
      this._changed();
    }
  }
  get closed() {
    return this._closed;
  }
  // ---------------------------------------------------------------------
  // 增删
  /**
   * 把一组 segment 插入到指定位置（省略位置则追加）。若 segment 已属于别的
   * 路径，会先克隆。
   */
  _add(segs, index) {
    const segments = this._segments, amount = segs.length, append = index == null, at = append ? segments.length : index;
    if (!amount)
      return;
    for (let i = 0; i < amount; i++) {
      let segment = segs[i];
      if (segment._path)
        segment = segs[i] = segment.clone();
      segment._path = this;
      segment._index = at + i;
    }
    if (append) {
      for (let i = 0; i < amount; i++)
        segments.push(segs[i]);
    } else {
      segments.splice(at, 0, ...segs);
      for (let i = at + amount; i < segments.length; i++)
        segments[i]._index = i;
    }
    if (this._strokeProfile)
      this._insertStrokeProfile(at, amount);
    this._curves = null;
    this._changed();
  }
  /** 追加一个或多个 segment。 */
  add(...segs) {
    if (segs.length)
      this._add(segs);
  }
  addSegment(segment) {
    this._add([segment]);
  }
  addSegments(segments) {
    this._add(segments);
  }
  /** 在指定位置插入一个或多个 segment。 */
  insert(index, ...segs) {
    if (segs.length)
      this._add(segs, index);
  }
  insertSegment(index, segment) {
    this._add([segment], index);
  }
  insertSegments(index, segments) {
    this._add(segments, index);
  }
  /** 移除指定索引的 segment。 */
  removeSegment(index) {
    const removed = this.removeSegments(index, index + 1);
    return !!removed;
  }
  /**
   * 移除 [start, end) 范围内的 segment，返回移除掉的数组。
   *
   * `includeCurves` 在原文中用于保留已建立曲线引用，供 `CurveLocation` 追踪
   * 被移动的曲线；本移植的曲线缓存是惰性重建的，因此该参数仅为签名兼容。
   */
  removeSegments(start = 0, end = this._segments.length, includeCurves) {
    if (start < 0)
      start = 0;
    if (end > this._segments.length)
      end = this._segments.length;
    if (start >= end)
      return [];
    if (this._strokeProfile)
      this._removeStrokeProfile(start, end);
    const segments = this._segments, removed = segments.splice(start, end - start);
    for (let i = 0; i < removed.length; i++) {
      removed[i]._path = null;
      removed[i]._index = void 0;
    }
    for (let i = start; i < segments.length; i++)
      segments[i]._index = i;
    this._curves = null;
    this._changed();
    return removed;
  }
  /** 清空所有 segment。 */
  clear() {
    this.removeSegments();
  }
  /** 路径是否没有 segment。 */
  isEmpty() {
    return !this._segments.length;
  }
  /** 是否有任何控制柄。 */
  hasHandles() {
    const segments = this._segments;
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].hasHandles())
        return true;
    }
    return false;
  }
  /** 清除所有控制柄。 */
  clearHandles() {
    const segments = this._segments;
    for (let i = 0; i < segments.length; i++)
      segments[i].clearHandles();
  }
  // ---------------------------------------------------------------------
  // 长度与面积
  /** 路径总长度。 */
  get length() {
    let length = this._length;
    if (length == null) {
      const curves = this.curves;
      length = 0;
      for (let i = 0, l = curves.length; i < l; i++)
        length += curves[i].length;
      this._length = length;
    }
    return length;
  }
  /** 路径覆盖的面积，自交部分的子面积会互相抵消。 */
  getArea() {
    let area = this._area;
    if (area == null) {
      const segments = this._segments, closed = this._closed;
      area = 0;
      for (let i = 0, l = segments.length; i < l; i++) {
        const last = i + 1 === l;
        area += Curve.getArea(Curve.getValues(
          segments[i],
          segments[last ? 0 : i + 1],
          // 最后一条曲线且路径未闭合时，用直线连接并忽略控制柄。
          null,
          last && !closed
        ));
      }
      this._area = area;
    }
    return area;
  }
  get area() {
    return this.getArea();
  }
  /** 路径变化时让长度/面积缓存失效。 */
  _changed() {
    super._changed();
    this._length = this._area = void 0;
  }
  // ---------------------------------------------------------------------
  // 边界
  /** 路径的边界矩形。 */
  get bounds() {
    return this._getBounds();
  }
  _getBounds(matrix) {
    return Path.getBounds(
      this._segments,
      this._closed,
      this,
      matrix || null
    );
  }
  /** 计算一组 segment 的包围矩形（不含描边）。 */
  static getBounds(segments, closed, path, matrix) {
    const first = segments[0];
    if (!first)
      return new Rectangle();
    let prevCoords = first._transformCoordinates(
      matrix || null,
      new Array(6)
    );
    let coords = new Array(6);
    const min = prevCoords.slice(0, 2), max = min.slice(), roots = new Array(2);
    function processSegment(segment) {
      segment._transformCoordinates(matrix || null, coords);
      for (let i = 0; i < 2; i++) {
        Curve._addBounds(
          prevCoords[i],
          // 上一段锚点
          prevCoords[i + 4],
          // 上一段出控制柄
          coords[i + 2],
          // 当前段入控制柄
          coords[i],
          // 当前段锚点
          i,
          0,
          min,
          max,
          roots
        );
      }
      const tmp = prevCoords;
      prevCoords = coords;
      coords = tmp;
    }
    for (let i = 1, l = segments.length; i < l; i++)
      processSegment(segments[i]);
    if (closed)
      processSegment(first);
    return new Rectangle(
      min[0],
      min[1],
      max[0] - min[0],
      max[1] - min[1]
    );
  }
  // ---------------------------------------------------------------------
  // SVG path data
  /** 把路径几何导出为 SVG path data 字符串。 */
  getPathData(precision) {
    const segments = this._segments, length = segments.length, f = new Formatter(precision), coords = new Array(6), parts = [];
    let first = true, curX = 0, curY = 0, prevX = 0, prevY = 0, inX = 0, inY = 0, outX = 0, outY = 0;
    function addSegment(segment, skipLine) {
      segment._transformCoordinates(null, coords);
      curX = coords[0];
      curY = coords[1];
      if (first) {
        parts.push("M" + f.pair(curX, curY));
        first = false;
      } else {
        inX = coords[2];
        inY = coords[3];
        if (inX === curX && inY === curY && outX === prevX && outY === prevY) {
          if (!skipLine) {
            const dx = curX - prevX, dy = curY - prevY;
            parts.push(
              dx === 0 ? "v" + f.number(dy) : dy === 0 ? "h" + f.number(dx) : "l" + f.pair(dx, dy)
            );
          }
        } else {
          parts.push("c" + f.pair(outX - prevX, outY - prevY) + " " + f.pair(inX - prevX, inY - prevY) + " " + f.pair(curX - prevX, curY - prevY));
        }
      }
      prevX = curX;
      prevY = curY;
      outX = coords[4];
      outY = coords[5];
    }
    if (!length)
      return "";
    for (let i = 0; i < length; i++)
      addSegment(segments[i]);
    if (this._closed && length > 0) {
      addSegment(segments[0], true);
      parts.push("z");
    }
    return parts.join("");
  }
  get pathData() {
    return this.getPathData();
  }
  set pathData(data) {
    this.setPathData(data);
  }
  /**
   * 按 SVG path data 重建路径。支持 m/l/h/v/c/s/q/t/z 与 a（椭圆弧）命令。
   */
  setPathData(data) {
    parsePathData(this, data);
  }
  // ---------------------------------------------------------------------
  // 绘图命令
  /** 在末尾添加一个锚点。 */
  moveTo(point) {
    this.add(new Segment(point));
  }
  /** 从上一个锚点画直线到该点。 */
  lineTo(point) {
    this.add(new Segment(point));
  }
  /** 三次贝塞尔曲线到该点。 */
  cubicCurveTo(handle1, handle2, to) {
    const last = this.lastSegment;
    if (!last) {
      this.moveTo(to);
      return;
    }
    last.handleOut = handle1.subtract(last.point);
    this.add(new Segment(to, handle2.subtract(to)));
  }
  /** 二次贝塞尔曲线到该点（换算成三次）。 */
  quadraticCurveTo(handle, to) {
    const last = this.lastSegment;
    if (!last) {
      this.moveTo(to);
      return;
    }
    const current = last.point;
    last.handleOut = handle.subtract(current).multiply(2 / 3);
    this.add(new Segment(
      to,
      handle.subtract(to).multiply(2 / 3)
    ));
  }
  /**
   * 闭合路径。若首尾锚点在 `tolerance` 内重合，则把它们合并成一个。
   */
  closePath(tolerance = 0) {
    const segments = this._segments, first = segments[0], last = segments[segments.length - 1];
    if (!first || !last)
      return;
    if (segments.length > 1 && first.point.isClose(last.point, tolerance)) {
      if (last.hasHandles())
        first.handleIn = last.handleIn;
      this.removeSegment(segments.length - 1);
    }
    this.closed = true;
  }
  // ---------------------------------------------------------------------
  // 位置与最近点
  /** 路径上离该点最近的位置。 */
  getNearestLocation(point) {
    return super.getNearestLocation(point);
  }
  /** 路径上离该点最近的点。 */
  getNearestPoint(point) {
    return super.getNearestPoint(point);
  }
  /**
   * 路径上指定偏移处的位置。偏移按弧长累加，超出范围时:
   * 闭合路径按总长度环绕，开放路径返回 null。
   */
  getLocationAt(offset) {
    const curves = this.curves;
    if (!curves.length)
      return null;
    const length = this.length;
    if (!length)
      return new CurveLocation(curves[0], 0);
    if (offset < 0 || offset > length) {
      if (!this._closed)
        return null;
      offset = (offset % length + length) % length;
    }
    let start = 0;
    for (let i = 0, l = curves.length; i < l; i++) {
      const curve = curves[i], curveLength = curve.length, end = start + curveLength;
      if (offset <= end || i === l - 1) {
        const time = curve.getTimeAt(offset - start);
        return time != null ? new CurveLocation(curve, time) : null;
      }
      start = end;
    }
    return null;
  }
  /** 若该点正好落在路径上，返回对应的位置，否则返回 null。 */
  getLocationOf(point) {
    const curves = this.curves;
    for (let i = 0, l = curves.length; i < l; i++) {
      const time = curves[i].getTimeOf(point);
      if (time != null)
        return new CurveLocation(curves[i], time);
    }
    return null;
  }
  /** 路径上该点对应的偏移，不存在时返回 null。 */
  getOffsetOf(point) {
    const loc = this.getLocationOf(point);
    return loc ? loc.offset : null;
  }
  /** 路径上指定偏移处的点。 */
  getPointAt(offset) {
    const loc = this.getLocationAt(offset);
    return loc ? loc.point : null;
  }
  /** 路径上指定偏移处的切向量。 */
  getTangentAt(offset) {
    const loc = this.getLocationAt(offset);
    return loc ? loc.tangent : null;
  }
  /** 路径上指定偏移处的法向量。 */
  getNormalAt(offset) {
    const loc = this.getLocationAt(offset);
    return loc ? loc.normal : null;
  }
  /** 路径上指定偏移处的曲率。 */
  getCurvatureAt(offset) {
    const loc = this.getLocationAt(offset);
    return loc ? loc.curvature : null;
  }
  // ---------------------------------------------------------------------
  // 编辑
  /** 原地反转路径方向。 */
  reverse() {
    const segments = this._segments;
    segments.reverse();
    for (let i = 0, l = segments.length; i < l; i++) {
      segments[i]._index = i;
      segments[i].reverse();
    }
    if (this._strokeProfile)
      this._reverseStrokeProfile();
    this._changed();
  }
  /** 返回反转后的路径副本。 */
  reversed() {
    const path = this.clone();
    path.reverse();
    return path;
  }
  clone() {
    const path = new Path(
      this._segments.map((segment) => segment.clone()),
      this._closed
    );
    if (this._strokeProfile)
      path.strokeProfile = this._strokeProfile;
    return path;
  }
  /**
   * 平滑路径。目前支持 `'catmull-rom'` 与 `'geometric'`，其余方式尚未移植。
   */
  smooth(options) {
    const type = options && options.type;
    if (type && type !== "catmull-rom" && type !== "geometric") {
      throw new Error("Smoothing method '" + type + "' 暂不支持");
    }
    const segments = this._segments, length = segments.length;
    for (let i = 0; i < length; i++)
      segments[i].smooth(options);
    this._changed();
  }
  /**
   * 在指定位置分割路径，返回新生成的那一半。
   * 与原文一致:位置可以是 CurveLocation，也可以是偏移。
   */
  divideAt(location) {
    const loc = typeof location === "number" ? this.getLocationAt(location) : location;
    if (!loc)
      return null;
    const curve = loc.curve;
    if (!curve)
      return null;
    const res = curve.divideAtTime(loc.time);
    return res ? this : null;
  }
  /**
   * 在指定位置拆分路径。位置可以是偏移量，也可以是 `CurveLocation`。
   *
   * 开放路径拆成两条，返回后半条；闭合路径先打开成一条，返回自身。
   */
  splitAt(location) {
    const loc = location instanceof CurveLocation ? location : this.getLocationAt(location), tMin = Numerical.CURVETIME_EPSILON;
    if (!loc)
      return null;
    let index = loc.index, time = loc.time;
    if (index == null || time == null)
      return null;
    if (time > 1 - tMin) {
      index++;
      time = 0;
    }
    const curves = this.curves;
    if (index >= curves.length)
      return null;
    const cut = loc.offset, profile = this._strokeProfile ? this._takeStrokeProfile() : null;
    if (time >= tMin)
      curves[index++].divideAtTime(time);
    const segs = this.removeSegments(index, this._segments.length, true);
    let path;
    if (this._closed) {
      this.closed = false;
      path = this;
    } else {
      path = new Path();
    }
    path._add(segs, 0);
    this.addSegment(segs[0]);
    if (profile) {
      if (path === this) {
        this._setStrokeProfilePart(profile, cut, cut + profile.length);
      } else {
        this._setStrokeProfilePart(profile, 0, cut);
        path._setStrokeProfilePart(profile, cut, profile.length);
      }
    }
    return path;
  }
  /** 兼容旧签名：按 `CurveLocation` 拆分，等价于 `splitAt(location)`。 */
  split(location) {
    return this.splitAt(location);
  }
  /**
   * 把另一条路径接到本路径上，返回本路径。
   *
   * 传入 `null` / `this` 时，只有首尾相接才会把路径闭合。相接处的控制柄会
   * 合并；描边轮廓按段搬移（`_takeStrokeProfile` / `_setStrokeProfileParts`）。
   */
  join(path, tolerance = 0) {
    const epsilon = tolerance || 0;
    let parts = null;
    if (path && path !== this) {
      const segments = path._segments, last1 = this.lastSegment;
      let last2 = path.lastSegment;
      if (!last2)
        return this;
      if (this._strokeProfile || path._strokeProfile)
        parts = [this._takeStrokeProfile()];
      if (last1 && last1.point.isClose(last2.point, epsilon))
        path.reverse();
      const first2 = path.firstSegment;
      if (last1 && first2 && last1.point.isClose(first2.point, epsilon)) {
        if (parts)
          parts.push(path._takeStrokeProfile());
        last1.handleOut = first2.handleOut;
        this._add(segments.slice(1));
      } else {
        const first1 = this.firstSegment;
        if (first1 && first2 && first1.point.isClose(first2.point, epsilon))
          path.reverse();
        last2 = path.lastSegment;
        if (parts)
          parts.push(path._takeStrokeProfile());
        if (first1 && last2 && first1.point.isClose(last2.point, epsilon)) {
          if (parts)
            parts.reverse();
          first1.handleIn = last2.handleIn;
          this._add(segments.slice(0, segments.length - 1), 0);
        } else {
          this._add(segments.slice());
        }
      }
      if (path._closed)
        this._add([segments[0]]);
      path.clear();
    }
    const first = this.firstSegment, last = this.lastSegment;
    if (first && last && first !== last && first.point.isClose(last.point, epsilon)) {
      if (!parts && this._strokeProfile)
        parts = [this._takeStrokeProfile()];
      first.handleIn = last.handleIn;
      last.remove();
      this.closed = true;
    }
    if (parts)
      this._setStrokeProfileParts(parts);
    return this;
  }
  /**
   * 删除长度为 0 的直线曲线；`simplify` 为真时还会删除近似零长的曲线，以及
   * 夹在两条共线直线之间的多余曲线。
   */
  reduce(options) {
    const curves = this.curves, simplify = options && options.simplify, tolerance = simplify ? Numerical.GEOMETRIC_EPSILON : 0;
    for (let i = curves.length - 1; i >= 0; i--) {
      const curve = curves[i];
      if (!curve.hasHandles() && (!curve.hasLength(tolerance) || !!(simplify && curve.isCollinear(curve.next))))
        curve.remove();
    }
    return this;
  }
  /**
   * 把曲线按 `flatness`（默认 0.25）细分，用直线段替换原有几何。
   * 只对 Path 有效；CompoundPath 会转发给每个子路径。
   */
  flatten(flatness) {
    const flattener = new PathFlattener(this, flatness || 0.25, 256, true), parts = flattener.parts, length = parts.length, segments = [];
    for (let i = 0; i < length; i++) {
      segments.push(new Segment(
        new Point(parts[i].curve[0], parts[i].curve[1])
      ));
    }
    if (!this._closed && length > 0) {
      const curve = parts[length - 1].curve;
      segments.push(new Segment(new Point(curve[6], curve[7])));
    }
    this.setSegments(segments);
  }
  /**
   * 用 PathFitter 以 `tolerance`（默认 2.5）的误差重新拟合路径。
   * 返回是否产生了新的 segment。
   */
  simplify(tolerance) {
    const segments = new PathFitter(this).fit(tolerance || 2.5);
    if (segments)
      this.setSegments(segments);
    return !!segments;
  }
  // ---------------------------------------------------------------------
  // 形状构造器
  /** 由两个点创建一条直线路径。 */
  static Line(from, to) {
    return new Path([new Segment(from), new Segment(to)], false);
  }
  /** 创建圆。 */
  static Circle(center, radius) {
    return Path._createEllipse(center, new Size(radius, radius));
  }
  /** 创建矩形，可指定圆角的尺寸。 */
  static Rectangle(rectangle, radius) {
    const bl = rectangle.bottomLeft, tl = rectangle.topLeft, tr = rectangle.topRight, br = rectangle.bottomRight;
    let segments;
    if (!radius || radius.isZero()) {
      segments = [
        new Segment(bl),
        new Segment(tl),
        new Segment(tr),
        new Segment(br)
      ];
    } else {
      const r = Size.min(radius, rectangle.size.divide(2)), rx = r.width, ry = r.height, hx = rx * kappa, hy = ry * kappa;
      segments = [
        new Segment(
          bl.add(new Point(rx, 0)),
          void 0,
          new Point(-hx, 0)
        ),
        new Segment(bl.subtract(new Point(0, ry)), new Point(0, hy)),
        new Segment(
          tl.add(new Point(0, ry)),
          void 0,
          new Point(0, -hy)
        ),
        new Segment(tl.add(new Point(rx, 0)), new Point(-hx, 0)),
        new Segment(
          tr.subtract(new Point(rx, 0)),
          void 0,
          new Point(hx, 0)
        ),
        new Segment(tr.add(new Point(0, ry)), new Point(0, -hy)),
        new Segment(
          br.subtract(new Point(0, ry)),
          void 0,
          new Point(0, hy)
        ),
        new Segment(br.subtract(new Point(rx, 0)), new Point(hx, 0))
      ];
    }
    return new Path(segments, true);
  }
  /** `Path.Rectangle` 的旧别名。 */
  static RoundRectangle(rectangle, radius) {
    return Path.Rectangle(rectangle, radius);
  }
  /** 创建内切于给定矩形的椭圆。 */
  static Ellipse(rectangle) {
    return Path._createEllipse(rectangle.center, rectangle.size.divide(2));
  }
  /** `Path.Ellipse` 的旧别名。 */
  static Oval(rectangle) {
    return Path.Ellipse(rectangle);
  }
  /** 创建经过三个点的圆弧。 */
  static Arc(from, through, to) {
    const path = new Path([new Segment(from)], false);
    path._arcThrough(through, to);
    return path;
  }
  /**
   * 创建正多边形。与 Illustrator 一致:底边水平，segment 从顶点开始逆时针
   * 排列；边数为偶数时从顶边的右端开始。
   */
  static RegularPolygon(center, sides, radius) {
    const step = -360 / sides, offset = sides % 2 ? 0 : -0.5, vector = new Point(0, -radius), segments = new Array(sides);
    for (let i = 0; i < sides; i++)
      segments[i] = new Segment(center.add(
        vector.rotate((i + offset) * step)
      ));
    return new Path(segments, true);
  }
  /**
   * 创建星形。`radius1` 与 `radius2` 中较大的作为外半径，较小的作为内半径。
   */
  static Star(center, points, radius1, radius2) {
    const count = points * 2, step = 360 / count, vector = new Point(0, -1), segments = new Array(count);
    for (let i = 0; i < count; i++) {
      segments[i] = new Segment(center.add(vector.rotate(step * i).multiply(i % 2 ? radius2 : radius1)));
    }
    return new Path(segments, true);
  }
  /** 把单位椭圆模板按半径缩放、平移到 center，生成闭合路径。 */
  static _createEllipse(center, radius) {
    const segments = new Array(4), r = new Point(radius.width, radius.height);
    for (let i = 0; i < 4; i++) {
      const s = ellipseSegments[i];
      segments[i] = new Segment(
        s._point.multiply(r).add(center),
        s._handleIn.multiply(r),
        s._handleOut.multiply(r)
      );
    }
    return new Path(segments, true);
  }
  // ---------------------------------------------------------------------
  // 圆弧
  /** 从当前点画一条经过 through、终点为 to 的圆弧。 */
  _arcThrough(through, to) {
    const from = this._segments[this._segments.length - 1]._point, l1 = new Line(
      from.add(through).divide(2),
      through.subtract(from).rotate(90),
      true
    ), l2 = new Line(
      through.add(to).divide(2),
      to.subtract(through).rotate(90),
      true
    ), line = new Line(from, to), throughSide = line.getSide(through), center = l1.intersect(l2, true);
    if (!center) {
      if (!throughSide) {
        this.lineTo(to);
        return;
      }
      throw new Error("Cannot create an arc with the given arguments");
    }
    const vector = from.subtract(center);
    let extent = vector.getDirectedAngle(to.subtract(center));
    const centerSide = line.getSide(center, true);
    if (centerSide === 0) {
      extent = throughSide * Math.abs(extent);
    } else if (throughSide === centerSide) {
      extent += extent < 0 ? 360 : -360;
    }
    this._addArc(center, vector, extent, to);
  }
  /** 以 center 为圆心、当前点到圆心的向量为起点，添加 extent 度的圆弧。 */
  _addArc(center, vector, extent, to, matrix) {
    const current = this._segments[this._segments.length - 1], epsilon = Numerical.ANGULAR_EPSILON, count = Math.ceil((Math.abs(extent) - epsilon) / 90);
    if (!current)
      throw new Error("Use a moveTo() command first");
    if (count) {
      const inc = extent / count, half = inc * Math.PI / 360, z = 4 / 3 * Math.sin(half) / (1 + Math.cos(half)), segments = [];
      for (let i = 0; i <= count; i++) {
        let pt = to, out = null;
        if (i < count) {
          out = vector.rotate(90).multiply(z);
          if (matrix) {
            pt = matrix._transformPoint(vector);
            out = matrix._transformPoint(vector.add(out)).subtract(pt);
          } else {
            pt = center.add(vector);
          }
        }
        if (!i) {
          current.handleOut = out || new Point();
        } else {
          let handleIn = vector.rotate(-90).multiply(z);
          if (matrix) {
            handleIn = matrix._transformPoint(vector.add(handleIn)).subtract(pt);
          }
          segments.push(new Segment(pt, handleIn, out || void 0));
        }
        vector = vector.rotate(inc);
      }
      this._add(segments);
    } else if (extent && !to.equals(current._point)) {
      this.lineTo(to);
    }
  }
  // ---------------------------------------------------------------------
  // stroke profile
  /**
   * 路径的描边轮廓:沿路径排列的停靠点，用来设置绘制描边的笔触（一个带
   * 宽度、纵横比和角度的椭圆），见 {@link StrokeProfileStop}。停靠点按偏移
   * 排序。在没有停靠点设置某项时，笔触沿全程保持描边宽度。
   *
   * 它是路径自身的属性而不是样式的一部分，因为它绑定在 segment 上。可以直接
   * 赋停靠点，也可以赋普通对象 `{ offset, width, aspect, angle, smooth }`。
   */
  get strokeProfile() {
    return this._strokeProfile;
  }
  set strokeProfile(stops) {
    const previous = this._strokeProfile;
    let profile = null;
    if (stops && stops.length) {
      profile = [];
      for (let i = 0, l = stops.length; i < l; i++) {
        const value = stops[i];
        let stop;
        if (!(value instanceof StrokeProfileStop)) {
          stop = new StrokeProfileStop(
            value
          );
        } else if (value._path && value._path !== this) {
          stop = value.clone();
        } else {
          stop = value;
        }
        if (stop._path !== this) {
          if (stop._index == null)
            stop._index = this._getIndexAt(stop._offset);
          stop._path = this;
        }
        profile.push(stop);
      }
    }
    for (let i = 0, l = previous ? previous.length : 0; i < l; i++) {
      const stop = previous[i];
      if (!profile || profile.indexOf(stop) === -1) {
        stop._offset = stop.offset;
        stop._index = stop._path = null;
      }
    }
    this._strokeProfile = profile;
    if (profile)
      this._sortStrokeProfile();
    this._changed();
  }
  /**
   * 返回路径在给定偏移处的笔触，作为一个不在路径上的停靠点，各项都已填好:
   * 宽度是描边宽度的倍数，没有停靠点设置时分别为 `1`、`1`、`0`。
   */
  getStrokeProfileAt(offset) {
    const values = getStrokeValues(
      getStrokeEntries(this),
      offset,
      this.length,
      this._closed,
      true
    );
    for (const key in penDefaults) {
      if (values[key] == null)
        values[key] = penDefaults[key];
    }
    return new StrokeProfileStop(values);
  }
  /**
   * 返回路径全程的笔触，作为条目:在路径两端、各停靠点以及值变化处取点。
   * 阶梯在同一偏移处有两个条目。
   */
  _getStrokeProfilePens() {
    const entries = getStrokeEntries(this), length = this.length, closed = this._closed, pens = [];
    function getPen(offset, after) {
      const values = getStrokeValues(
        entries,
        offset,
        length,
        closed,
        after
      );
      for (const key in penDefaults) {
        if (values[key] == null)
          values[key] = penDefaults[key];
      }
      return values;
    }
    const offsets = [0].concat(
      entries.map((entry) => entry.offset),
      [length]
    );
    for (let i = 0, l = offsets.length; i < l; i++) {
      const offset = offsets[i];
      if (!i || offset > offsets[i - 1]) {
        if (offset > 0)
          pens.push(getPen(offset, false));
        if (offset < length) {
          const pen = getPen(offset, true);
          if (!offset || !pensEqual(pen, pens[pens.length - 1]))
            pens.push(pen);
        }
      }
    }
    return pens;
  }
  /**
   * 返回一个函数，给出任意偏移处笔触各项的值及其一阶、二阶导数，形式为
   * `{ width: [value, d1, d2], aspect, angle }`。
   */
  _getStrokeProfileValues() {
    const entries = getStrokeEntries(this), length = this.length, closed = this._closed;
    return (offset, after) => {
      const values = {};
      for (const key in penDefaults) {
        values[key] = getStrokeValue(
          entries,
          key,
          offset,
          length,
          closed,
          after
        ) || [penDefaults[key], 0, 0];
      }
      return values;
    };
  }
  /**
   * 返回偏移对应的索引:它之前那个 segment 的索引，加上到下一条曲线的弧长
   * 比例。闭合路径的偏移会环绕，开放路径则夹在两端之间。
   */
  _getIndexAt(offset) {
    const length = this.length;
    offset = this._closed ? length ? (offset % length + length) % length : 0 : Math.min(Math.max(offset, 0), length);
    const loc = this.getLocationAt(offset);
    if (loc) {
      const time = loc.time, curve = loc.curve, curveLength = curve.length;
      return loc.index + (time < strokeTimeMin || !curveLength ? 0 : time > strokeTimeMax ? 1 : loc.curveOffset / curveLength);
    }
    return this.curves.length;
  }
  /** 把索引换算回弧长偏移。 */
  _getOffsetAtIndex(index) {
    const curves = this.curves, i = Math.floor(index);
    let offset = 0;
    for (let j = 0, l = Math.min(i, curves.length); j < l; j++)
      offset += curves[j].length;
    return i < curves.length ? offset + (index - i) * curves[i].length : offset;
  }
  /** 按索引给停靠点排序。 */
  _sortStrokeProfile() {
    if (this._strokeProfile) {
      this._strokeProfile.sort((a, b) => a._index - b._index);
    }
  }
  /** 只保留回调返回 true 的停靠点。 */
  _filterStrokeProfile(callback) {
    const profile = (this._strokeProfile || []).filter(callback);
    this.strokeProfile = profile;
  }
  /**
   * 在索引处插入 segment 之后，迁移停靠点，使落在被拆分曲线上的停靠点保持
   * 相同的长度比例。
   */
  _insertStrokeProfile(index, amount) {
    const profile = this._strokeProfile;
    if (!profile)
      return;
    const count = this._segments.length - amount, closed = this._closed, divided = closed ? (index + count - 1) % count : index > 0 && index < count ? index - 1 : -1, start = divided < index ? divided : divided + amount;
    if (count) {
      for (let i = 0, l = profile.length; i < l; i++) {
        const stop = profile[i], x = stop._index;
        if (divided >= 0 && x > divided && x < divided + 1) {
          stop._index = getStrokeSpanIndex(
            this,
            start,
            amount + 1,
            x - divided
          );
        } else if (x >= index) {
          stop._index = x + amount;
        }
      }
      this._sortStrokeProfile();
    }
  }
  /**
   * 在移除 [start, end) 的 segment 之前迁移停靠点:落在被移除区间内、但仍
   * 位于保留段之间的停靠点，按合并后曲线的长度比例重新定位；开放路径新端点
   * 之外的停靠点被丢弃。
   */
  _removeStrokeProfile(start, end) {
    const count = this._segments.length, closed = this._closed, amount = end - start, curves = this.curves, before = closed ? (start + count - 1) % count : start - 1, index = before < start ? before : before - amount, span = amount + 1;
    function isKept(stop) {
      const x = stop._index;
      return closed ? amount < count : start ? end < count || x <= before : x >= end;
    }
    this._filterStrokeProfile(isKept);
    const profile = this._strokeProfile || [];
    for (let i = 0, l = profile.length; i < l; i++) {
      const stop = profile[i], x = stop._index, d = closed ? (x - before + count) % count : x - before;
      if (before >= 0 && d > 0 && d < span) {
        let position = 0, total = 0;
        for (let j = 0; j < span; j++) {
          const length = curves[(before + j) % curves.length].length;
          if (j < Math.floor(d)) {
            position += length;
          } else if (j === Math.floor(d)) {
            position += (d - j) * length;
          }
          total += length;
        }
        stop._index = index + (total ? position / total : d / span);
      } else if (x >= end) {
        stop._index = x - amount;
      }
    }
    if (profile.length)
      this._sortStrokeProfile();
  }
  /** segment 反转之后迁移停靠点。 */
  _reverseStrokeProfile() {
    const profile = this._strokeProfile;
    if (!profile)
      return;
    const count = this._segments.length;
    for (let i = 0, l = profile.length; i < l; i++) {
      const stop = profile[i];
      stop._index = this._closed ? (2 * count - 1 - stop._index) % count : count - 1 - stop._index;
    }
    profile.reverse();
    this._sortStrokeProfile();
  }
  /**
   * 把 stroke profile 从路径上取下，转成按偏移排列的条目，供按偏移移动它的
   * 方法使用，见 `_setStrokeProfileParts()`。
   */
  _takeStrokeProfile() {
    const part = {
      entries: getStrokeEntries(this),
      length: this.length,
      closed: this._closed
    };
    if (this._strokeProfile)
      this.strokeProfile = null;
    return part;
  }
  /**
   * 用取下的片段设置 stroke profile:它们沿路径首尾相接，第一个在起点、最后
   * 一个在终点；相接处各自保留该处的值作为停靠点。
   */
  _setStrokeProfileParts(parts) {
    const length = this.length, closed = this._closed, entries = [], fallbacks = {};
    parts.forEach((part) => {
      part.entries.forEach((entry) => {
        for (const key in penDefaults) {
          if (entry[key] != null)
            fallbacks[key] = penDefaults[key];
        }
      });
    });
    for (let i = 0, l = parts.length; i < l; i++) {
      const part = parts[i], start = i ? length - part.length : 0, hasStart = closed || i > 0, hasEnd = closed || i < l - 1;
      if (part.entries.length || l > 1 || closed) {
        const shifted = getStrokePart(
          part.entries,
          0,
          part.length,
          part.length,
          part.closed,
          hasStart,
          hasEnd,
          fallbacks
        );
        for (let j = 0, m = shifted.length; j < m; j++) {
          const entry = shifted[j];
          entry.offset += start;
          entries.push(entry);
        }
      }
    }
    if (closed && entries.length)
      entries.unshift(entries.pop());
    this.strokeProfile = entries;
  }
  /**
   * 用取下的片段在两个偏移之间设置 stroke profile，见
   * `_takeStrokeProfile()`。
   */
  _setStrokeProfilePart(part, from, to) {
    const length = part.length;
    this.strokeProfile = getStrokePart(
      part.entries,
      from,
      to,
      length,
      part.closed,
      part.closed || from > 0,
      part.closed || to < length,
      {}
    );
  }
  arcTo(arg0, arg1, arg2, arg3, arg4) {
    getCurrentSegment(this);
    if (arg1 instanceof Point) {
      this._arcThrough(arg0, arg1);
      return;
    }
    if (arg1 === void 0 || typeof arg1 === "boolean") {
      const to = arg0, clockwise = arg1 === void 0 ? true : arg1, from = getCurrentSegment(this)._point, middle = from.add(to).divide(2), through = middle.add(middle.subtract(from).rotate(
        clockwise ? -90 : 90
      ));
      this._arcThrough(through, to);
      return;
    }
    this._arcSvg(
      arg0,
      arg1,
      arg2,
      arg3,
      arg4
    );
  }
  /**
   * SVG 风格椭圆弧，算法见:
   * https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
   */
  _arcSvg(to, radius, rotation, clockwise, large) {
    const from = getCurrentSegment(this)._point, isZero = Numerical.isZero;
    if (isZero(radius.width) || isZero(radius.height)) {
      this.lineTo(to);
      return;
    }
    if (from.equals(to))
      return;
    const middle = from.add(to).divide(2), pt = from.subtract(middle).rotate(-rotation), x = pt.x, y = pt.y, xSq = x * x, ySq = y * y;
    let rx = Math.abs(radius.width), ry = Math.abs(radius.height), rxSq = rx * rx, rySq = ry * ry;
    let factor = Math.sqrt(xSq / rxSq + ySq / rySq);
    if (factor > 1) {
      rx *= factor;
      ry *= factor;
      rxSq = rx * rx;
      rySq = ry * ry;
    }
    factor = (rxSq * rySq - rxSq * ySq - rySq * xSq) / (rxSq * ySq + rySq * xSq);
    if (Math.abs(factor) < Numerical.EPSILON)
      factor = 0;
    if (factor < 0)
      throw new Error("Cannot create an arc with the given arguments");
    const center = new Point(rx * y / ry, -ry * x / rx).multiply((large === clockwise ? -1 : 1) * Math.sqrt(factor)).rotate(rotation).add(middle), matrix = new Matrix().translate(center.x, center.y).rotate(rotation).scale(rx, ry), vector = matrix._inverseTransform(from), end = matrix._inverseTransform(to);
    let extent = vector.getDirectedAngle(end);
    if (!clockwise && extent > 0)
      extent -= 360;
    else if (clockwise && extent < 0)
      extent += 360;
    this._addArc(center, vector, extent, to, matrix);
  }
  /** 以 `center` 为圆心、当前点为起点，画 `angle` 度的圆弧。 */
  arcAround(center, angle) {
    const vector = getCurrentSegment(this)._point.subtract(center);
    this._addArc(center, vector, angle, center.add(vector.rotate(angle)));
  }
  /**
   * 沿当前路径的切线方向画圆弧到 `to`：圆心落在过当前点的法线上，圆弧在
   * 当前点处与路径相切。
   */
  arcTowards(to) {
    const current = getCurrentSegment(this), previous = current.previous, from = current._point, tangent = previous ? new Curve(previous, current).getTangentAtTime(1) : new Point(), normal = tangent.rotate(90), vector = to.subtract(from), distance = vector.dot(normal);
    if (!Numerical.isZero(distance)) {
      const center = from.add(normal.multiply(
        vector.dot(vector) / (2 * distance)
      )), start = from.subtract(center);
      let extent = start.getDirectedAngle(to.subtract(center));
      if (extent * distance < 0)
        extent += distance > 0 ? 360 : -360;
      this._addArc(center, start, extent, to);
    } else if (vector.dot(tangent) > 0) {
      this.lineTo(to);
    } else {
      throw new Error("Cannot create an arc with the given arguments");
    }
  }
}
PathItem._createPath = (segments, closed) => new Path(segments, closed);
PathItem._createCompoundPath = (children) => new CompoundPath(children);
PathItem._pathClass = Path;
export {
  Path
};
