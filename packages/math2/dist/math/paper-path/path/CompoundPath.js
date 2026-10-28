import { Rectangle } from "../basic/Rectangle.js";
import { PathItem } from "./PathItem.js";
import { Path } from "./Path.js";
import { parsePathData } from "./pathData.js";
class CompoundPath extends PathItem {
  /** 子路径。 */
  _children = [];
  constructor(children = []) {
    super();
    this.addChildren(children);
  }
  // ---------------------------------------------------------------------
  // 子路径
  get children() {
    return this._children;
  }
  set children(children) {
    this.removeChildren();
    this.addChildren(children);
  }
  /** 追加一个子路径，可指定插入位置。 */
  addChild(path, index) {
    const children = this._children;
    if (index == null || index < 0 || index > children.length)
      index = children.length;
    children.splice(index, 0, path);
    this._changed();
    return path;
  }
  /** 追加多个子路径。 */
  addChildren(paths) {
    for (let i = 0, l = paths.length; i < l; i++)
      this.addChild(paths[i]);
  }
  /** 移除全部子路径并返回它们。 */
  removeChildren() {
    const children = this._children;
    this._children = [];
    this._changed();
    return children;
  }
  // ---------------------------------------------------------------------
  // 与 Path 一致的访问器
  /** 所有子路径的 segment 平铺后的数组。 */
  get segments() {
    const segments = [];
    for (let i = 0, l = this._children.length; i < l; i++)
      segments.push(...this._children[i]._segments);
    return segments;
  }
  /** 简化处理:用一个子路径承载全部 segment。 */
  set segments(segments) {
    this._children = [new Path(segments, this._closed)];
    this._changed();
  }
  /** 所有子路径是否都闭合。没有子路径时返回 true（与原文一致）。 */
  get closed() {
    const children = this._children;
    for (let i = 0, l = children.length; i < l; i++) {
      if (!children[i]._closed)
        return false;
    }
    return true;
  }
  set closed(closed) {
    const children = this._children;
    for (let i = 0, l = children.length; i < l; i++)
      children[i].closed = closed;
    this._changed();
  }
  /** 所有子路径的曲线。 */
  get curves() {
    const curves = [];
    for (let i = 0, l = this._children.length; i < l; i++)
      curves.push(...this._children[i].curves);
    return curves;
  }
  /** 第一个子路径的第一个 segment。 */
  get firstSegment() {
    const first = this._children[0];
    return first ? first.firstSegment : null;
  }
  /** 最后一个子路径的最后一个 segment。 */
  get lastSegment() {
    const children = this._children, last = children[children.length - 1];
    return last ? last.lastSegment : null;
  }
  /** 第一个子路径的第一条曲线。 */
  get firstCurve() {
    const first = this._children[0];
    return first ? first.firstCurve : null;
  }
  /** 最后一个子路径的最后一条曲线。 */
  get lastCurve() {
    const children = this._children, last = children[children.length - 1];
    return last ? last.lastCurve : null;
  }
  /** 所有子路径长度之和。 */
  get length() {
    let length = 0;
    for (let i = 0, l = this._children.length; i < l; i++)
      length += this._children[i].length;
    return length;
  }
  /** 各子路径面积之和（方向相反时会相互抵消）。 */
  getArea() {
    let area = 0;
    for (let i = 0, l = this._children.length; i < l; i++)
      area += this._children[i].getArea();
    return area;
  }
  get area() {
    return this.getArea();
  }
  /** 所有子路径边界盒的并集。 */
  get bounds() {
    return this._getBounds();
  }
  _getBounds(matrix) {
    const children = this._children;
    if (!children.length)
      return new Rectangle();
    let bounds = null;
    for (let i = 0, l = children.length; i < l; i++) {
      const childBounds = children[i]._getBounds(matrix);
      bounds = bounds ? bounds.unite(childBounds) : childBounds.clone();
    }
    return bounds;
  }
  // ---------------------------------------------------------------------
  // SVG path data
  /** 各子路径 path data 的拼接。 */
  getPathData(precision) {
    const paths = [];
    for (let i = 0, l = this._children.length; i < l; i++)
      paths.push(this._children[i].getPathData(precision));
    return paths.join("");
  }
  /** 按 SVG path data 重建:每遇到一个 `M`/`m` 就新建一个子路径。 */
  setPathData(data) {
    parsePathData(this, data);
    this._changed();
  }
  // ---------------------------------------------------------------------
  // 供 parsePathData() 使用的绘图命令
  /** 清空所有子路径。 */
  clear() {
    this._children = [];
    this._changed();
  }
  /** 取当前（最后一个）子路径，必要时新建。 */
  _getCurrentPath(check) {
    const children = this._children;
    if (check && !children.length)
      throw new Error("请先调用 moveTo()");
    return children[children.length - 1];
  }
  /** 开始一个新的子路径，若当前子路径还是空的则复用它。 */
  moveTo(point) {
    let current = this._children[this._children.length - 1];
    if (!current || !current.isEmpty()) {
      current = new Path();
      this.addChild(current);
    }
    current.moveTo(point);
  }
  lineTo(point) {
    this._getCurrentPath(true).lineTo(point);
  }
  cubicCurveTo(handle1, handle2, to) {
    this._getCurrentPath(true).cubicCurveTo(handle1, handle2, to);
  }
  quadraticCurveTo(handle, to) {
    this._getCurrentPath(true).quadraticCurveTo(handle, to);
  }
  arcTo(...args) {
    this._getCurrentPath(true).arcTo.apply(
      this._getCurrentPath(true),
      args
    );
  }
  closePath(tolerance = 0) {
    this._getCurrentPath(true).closePath(tolerance);
  }
  // ---------------------------------------------------------------------
  // 几何操作
  /** 反转每个子路径的方向。 */
  reverse() {
    const children = this._children;
    for (let i = 0, l = children.length; i < l; i++)
      children[i].reverse();
    this._changed();
  }
  /** 把矩阵直接作用到所有子路径上。 */
  transform(matrix) {
    const children = this._children;
    for (let i = 0, l = children.length; i < l; i++)
      children[i].transform(matrix);
    this._changed();
  }
  /** 展平所有子路径。 */
  flatten(tolerance) {
    const children = this._children;
    for (let i = 0, l = children.length; i < l; i++)
      children[i].flatten(tolerance);
    this._changed();
  }
  /** 简化所有子路径，任一子路径被简化即返回 true。 */
  simplify(tolerance) {
    const children = this._children;
    let res = false;
    for (let i = 0, l = children.length; i < l; i++)
      res = children[i].simplify(tolerance) || res;
    return res;
  }
  /** 平滑所有子路径。 */
  smooth(options) {
    const children = this._children;
    for (let i = 0, l = children.length; i < l; i++)
      children[i].smooth(options);
    this._changed();
  }
  /** 是否没有任何子路径含有 segment。 */
  isEmpty() {
    const children = this._children;
    for (let i = 0, l = children.length; i < l; i++) {
      if (!children[i].isEmpty())
        return false;
    }
    return true;
  }
  /** 子路径数量与顺序都一致，且对应子路径几何相同。 */
  compare(path) {
    if (!path || !(path instanceof CompoundPath))
      return false;
    const children1 = this._children, children2 = path._children;
    if (children1.length !== children2.length)
      return false;
    for (let i = 0, l = children1.length; i < l; i++) {
      if (!children1[i].compare(children2[i]))
        return false;
    }
    return true;
  }
  clone() {
    return new CompoundPath(
      this._children.map((child) => child.clone())
    );
  }
  toString() {
    return "{ " + this._children.map((child) => child.toString()).join(", ") + " }";
  }
}
PathItem._createCompoundPath = (children) => new CompoundPath(children);
export {
  CompoundPath
};
