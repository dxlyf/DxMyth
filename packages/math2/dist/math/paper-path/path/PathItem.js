import { Matrix } from "../basic/Matrix.js";
import { Numerical } from "../util/Numerical.js";
import { Curve } from "./Curve.js";
import { Segment } from "./Segment.js";
import { getWinding, traceBoolean, divideBoolean, resolveCrossings, reorient, getInteriorPoint } from "./booleanOps.js";
import { offsetItem, outlineItem } from "./offsetOps.js";
const abs = Math.abs;
class PathItem {
  _segments = [];
  _closed = false;
  _curves = null;
  _version = 0;
  /**
   * 结果对象的创建函数，由 `Path` / `CompoundPath` 在模块加载时注册。
   *
   * 布尔运算与偏移算法需要创建 `Path` / `CompoundPath`，而这两个类又继承
   * `PathItem`，直接 import 会形成"初始化阶段就要用完对方"的循环。注册把
   * 依赖反转：算法只调用这里，类的模块自己把自己注册进来。
   */
  static _createPath = null;
  static _createCompoundPath = null;
  /** `Path` 构造函数，供需要静态构造器（如 Circle/Rectangle）的地方使用。 */
  static _pathClass = null;
  // ---------------------------------------------------------------------
  // 状态与访问器
  /** 路径的 segment 数组。 */
  get segments() {
    return this._segments;
  }
  set segments(segments) {
    this._segments = segments;
    for (let i = 0; i < segments.length; i++) {
      segments[i]._path = this;
      segments[i]._index = i;
    }
    this._changed();
  }
  /** 路径是否闭合。 */
  get closed() {
    return this._closed;
  }
  set closed(closed) {
    if (this._closed !== !!closed) {
      this._closed = !!closed;
      this._changed();
    }
  }
  /** 路径的曲线数组。由子类实现。 */
  get curves() {
    throw new Error("get curves() 未实现");
  }
  /** 路径的第一个 segment。 */
  get firstSegment() {
    return this._segments[0] || null;
  }
  /** 路径的最后一个 segment。 */
  get lastSegment() {
    return this._segments[this._segments.length - 1] || null;
  }
  /** 路径的第一条曲线。 */
  get firstCurve() {
    return this.curves[0] || null;
  }
  /** 路径的最后一条曲线。 */
  get lastCurve() {
    const curves = this.curves;
    return curves[curves.length - 1] || null;
  }
  /**
   * 路径整体是否按顺时针方向。看的是路径面积:自交路径或方向互相抵消的
   * 子路径可能得到相互抵消的面积。
   */
  get clockwise() {
    return this.isClockwise();
  }
  set clockwise(clockwise) {
    this.setClockwise(clockwise);
  }
  /** 路径几何的 SVG path data 字符串。由子类实现。 */
  get pathData() {
    return this.getPathData();
  }
  set pathData(data) {
    this.setPathData(data);
  }
  // ---------------------------------------------------------------------
  // 基础方法
  /** 路径变化时调用:更新版本号并让缓存的曲线和边界失效。 */
  _changed() {
    this._version++;
    this._curves = null;
  }
  _asPathItem() {
    return this;
  }
  /** 只含填充或只含描边时可以直接参与合成。这里没有样式，固定返回 true。 */
  _canComposite() {
    return true;
  }
  /** 面积，由子类实现（Path 用各曲线面积之和）。 */
  getArea() {
    throw new Error("getArea() 未实现");
  }
  /** 由子类实现:返回路径的边界矩形。 */
  _getBounds(matrix) {
    throw new Error("_getBounds() 未实现");
  }
  /** 由子类实现:返回路径的 SVG path data。 */
  getPathData() {
    throw new Error("getPathData() 未实现");
  }
  /** 由子类实现:按 SVG path data 重建路径。 */
  setPathData(data) {
    throw new Error("setPathData() 未实现");
  }
  /** 由子类实现:反向路径。 */
  reverse() {
    throw new Error("reverse() 未实现");
  }
  // ---------------------------------------------------------------------
  // 方向
  /** 路径整体是否顺时针（面积 >= 0）。 */
  isClockwise() {
    return this.getArea() >= 0;
  }
  /** 设置路径方向为顺时针或逆时针，必要时反转路径。 */
  setClockwise(clockwise) {
    if (this.isClockwise() !== !!(clockwise = !!clockwise))
      this.reverse();
  }
  // ---------------------------------------------------------------------
  // 命中与相交
  /**
   * 点是否在路径内部。没有 Style，固定使用非零绕数规则。
   */
  contains(point) {
    const winding = this._getWinding(point);
    return winding.onPath || !!winding.winding;
  }
  /** 计算点相对于该路径的绕数贡献。 */
  _getWinding(point, dir, dontFlip) {
    return getWinding(point, this.curves, dir, dontFlip);
  }
  /**
   * 两条路径的所有交点，返回 CurveLocation 数组。
   * 传入空值时会求自交点。
   *
   * 原文用两条路径的边界盒做快速筛选；这里用 `_getBounds()` 做同样的粗略
   * 判断。
   */
  getIntersections(path, include) {
    const self = !path || this === path;
    if (!self) {
      const bounds1 = this._getBounds(), bounds2 = path._getBounds();
      if (!bounds1.intersects(bounds2, Numerical.getEpsilon(Math.max(
        abs(bounds1.left),
        abs(bounds1.right),
        abs(bounds1.top),
        abs(bounds1.bottom),
        abs(bounds2.left),
        abs(bounds2.right),
        abs(bounds2.top),
        abs(bounds2.bottom)
      )))) {
        return [];
      }
    }
    return Curve.getIntersections(
      this.curves,
      self ? null : path.curves,
      include
    );
  }
  /** 两条路径的所有交叉点（真正穿过对方，而不是只接触）。 */
  getCrossings(path) {
    return this.getIntersections(path, (inter) => inter.isCrossing());
  }
  /** 路径上离该点最近的位置。 */
  getNearestLocation(point) {
    const curves = this.curves;
    let minDist = Infinity, minLoc = null;
    for (let i = 0, l = curves.length; i < l; i++) {
      const loc = curves[i].getNearestLocation(point);
      if (loc._distance !== void 0 && loc._distance < minDist) {
        minDist = loc._distance;
        minLoc = loc;
      }
    }
    return minLoc;
  }
  /** 路径上离该点最近的点。 */
  getNearestPoint(point) {
    const loc = this.getNearestLocation(point);
    return loc ? loc.point : null;
  }
  // ---------------------------------------------------------------------
  // 几何变换
  /** 把矩阵直接作用到所有 segment 上（不保留矩阵）。 */
  transform(matrix) {
    for (let i = 0, l = this._segments.length; i < l; i++)
      this._segments[i].transform(matrix);
    this._changed();
  }
  translate(dx, dy) {
    this.transform(new Matrix().translate(dx, dy));
  }
  rotate(angle, center) {
    this.transform(new Matrix().rotate(angle, center));
  }
  /**
   * 缩放路径。未指定中心点时以路径边界盒的中心为基准（与 Item#scale 的
   * 文档行为一致）。
   */
  scale(sx, sy = sx, center) {
    this.transform(new Matrix().scale(
      sx,
      sy,
      center || this._getBounds().center
    ));
  }
  // ---------------------------------------------------------------------
  // 插值与比较
  /**
   * 用两个路径项插值的结果作为自己的几何。两个操作数的 segment 数量必须
   * 相同。
   */
  interpolate(from, to, factor) {
    const itemsFrom = from._segments, itemsTo = to._segments, items = this._segments;
    if (!itemsFrom || !itemsTo || itemsFrom.length !== itemsTo.length) {
      throw new Error("Invalid operands in interpolate() call: " + from + ", " + to);
    }
    const current = items.length, length = itemsTo.length;
    if (current < length) {
      for (let i = current; i < length; i++)
        items.push(new Segment());
    } else if (current > length) {
      items.splice(length, current - length);
    }
    for (let i = 0; i < length; i++) {
      items[i].interpolate(itemsFrom[i], itemsTo[i], factor);
    }
    this.closed = from._closed;
    this._changed();
  }
  /**
   * 比较两个路径的几何是否描述同一形状。这里只比较单个路径（还没有
   * CompoundPath），逐个 segment 平移比较，允许起点不同但方向相同。
   */
  compare(path) {
    if (!path)
      return false;
    const segments1 = this._segments, segments2 = path._segments, length1 = segments1.length, length2 = segments2.length;
    if (length1 !== length2)
      return false;
    for (let offset = 0; offset < length2; offset++) {
      let ok = true;
      for (let i = 0; i < length1 && ok; i++) {
        if (!segments1[i].equals(segments2[(i + offset) % length2]))
          ok = false;
      }
      if (ok)
        return true;
    }
    return false;
  }
  // ---------------------------------------------------------------------
  // 布尔运算
  /** 与指定路径求并集，返回新的路径项。 */
  unite(path, options) {
    return traceBoolean(this, path, "unite", options);
  }
  /** 与指定路径求交集，返回新的路径项。 */
  intersect(path, options) {
    return traceBoolean(this, path, "intersect", options);
  }
  /** 从自身减去指定路径，返回新的路径项。 */
  subtract(path, options) {
    return traceBoolean(this, path, "subtract", options);
  }
  /** 与指定路径求异或，返回新的路径项。 */
  exclude(path, options) {
    return traceBoolean(this, path, "exclude", options);
  }
  /**
   * 用指定路径切开自身，结果相当于 subtract 与 intersect 合并后的复合路径。
   */
  divide(path, options) {
    return divideBoolean(this, path, options);
  }
  /** 消解自交:在每个自交点处切开并重新追踪填充区域。 */
  resolveCrossings() {
    return resolveCrossings(this);
  }
  /** 重新调整子路径的方向。 */
  reorient(nonZero, clockwise) {
    return reorient(this, nonZero, clockwise);
  }
  /** 返回一个保证位于路径内部的点。 */
  getInteriorPoint() {
    return getInteriorPoint(this);
  }
  // ---------------------------------------------------------------------
  // 偏移与描边轮廓
  /** 按给定距离偏移路径项，返回新的路径项。 */
  offset(distance, options) {
    return offsetItem(this, distance, options);
  }
  /**
   * 返回描边所覆盖的区域。没有 Style，宽度必须通过 `options.width` 传入
   * （默认 0）。
   */
  outline(options) {
    return outlineItem(this, options);
  }
}
export {
  PathItem,
  getWinding
};
