import { Vector2 } from "./Vector2.js";
import { getQuadraticBezierBounds, QuadraticBezier } from "./QuadraticBezier.js";
import { getCubicBezierBounds, CubicBezier } from "./CubicBezier.js";
import { BoundingRect } from "./BoundingRect.js";
import { arcCubicBezierFromPath, ellipseCubicBezierFromPath, ellipseSvgArcFromPath } from "./Arc.js";
import { windingLine, windingCubicBezier, windingQuadraticBezier } from "./PathIntersection.js";
import { Matrix2D } from "./Matrix2D.js";
import { fromSvgPath } from "./ParseSvgPath.js";
import { Conic } from "./Conic.js";
import { CachePool } from "./CachePool.js";
var PathVerb = /* @__PURE__ */ ((PathVerb2) => {
  PathVerb2[PathVerb2["MoveTo"] = 1] = "MoveTo";
  PathVerb2[PathVerb2["LineTo"] = 2] = "LineTo";
  PathVerb2[PathVerb2["QuadraticTo"] = 4] = "QuadraticTo";
  PathVerb2[PathVerb2["CubicTo"] = 8] = "CubicTo";
  PathVerb2[PathVerb2["Close"] = 16] = "Close";
  return PathVerb2;
})(PathVerb || {});
const PathSegmentType = {
  Arc: 1 << 0,
  Rect: 1 << 1,
  Ellipse: 1 << 2,
  RoundRect: 1 << 3,
  EllipseSvgArc: 1 << 4
};
const PathVerbCount = {
  [
    1
    /* MoveTo */
  ]: 1,
  [
    2
    /* LineTo */
  ]: 1,
  [
    4
    /* QuadraticTo */
  ]: 2,
  [
    8
    /* CubicTo */
  ]: 3,
  [
    16
    /* Close */
  ]: 0
};
var PathCmd = /* @__PURE__ */ ((PathCmd2) => {
  PathCmd2["M"] = "M";
  PathCmd2["L"] = "L";
  PathCmd2["Q"] = "Q";
  PathCmd2["C"] = "C";
  PathCmd2["Z"] = "Z";
  PathCmd2["A"] = "A";
  PathCmd2["R"] = "R";
  PathCmd2["E"] = "E";
  PathCmd2["RR"] = "RR";
  return PathCmd2;
})(PathCmd || {});
var PathDirection = /* @__PURE__ */ ((PathDirection2) => {
  PathDirection2[PathDirection2["CW"] = 0] = "CW";
  PathDirection2[PathDirection2["CCW"] = 1] = "CCW";
  PathDirection2[PathDirection2["Unknown"] = 2147483647] = "Unknown";
  return PathDirection2;
})(PathDirection || {});
let pathBuilderUid = 0;
class PathBuilder {
  static fromSvgPath(svgPath) {
    return fromSvgPath(svgPath);
  }
  static default() {
    return new PathBuilder();
  }
  static pool = CachePool.create({
    create: () => new PathBuilder(),
    init: (path) => path.reset(),
    release: (path) => path.reset()
  });
  verbs;
  // 路径命令
  points;
  // 路径点
  lastMoveIndex = -1;
  // 最后一个移动点的索引
  needMoveTo = true;
  // 是否需要移动到下一个点
  segmentType = 0;
  // 路径段类型
  /** 包围盒缓存（null 表示未计算或路径为空） */
  _bounds = null;
  /** 紧凑包围盒缓存（null 表示未计算或路径为空） */
  _tightBounds = null;
  /** 包围盒是否需要重新计算 */
  _boundsDirty = true;
  _tightBoundsDirty = true;
  /**路径发生变变化 */
  drity = false;
  version = 0;
  uid = 0;
  constructor(path) {
    this.uid = pathBuilderUid++;
    this.verbs = [];
    this.points = [];
    if (path instanceof PathBuilder) {
      this.copy(path);
    } else if (typeof path === "string") {
      this.copy(fromSvgPath(path));
    }
  }
  get lastVerb() {
    return this.verbs[this.verbs.length - 1];
  }
  get lastPoint() {
    return this.points[this.points.length - 1];
  }
  get lastMovePoint() {
    return this.points[this.lastMoveIndex];
  }
  get size() {
    return this.verbs.length;
  }
  clone() {
    const path = new PathBuilder();
    path.copy(this);
    return path;
  }
  copy(path) {
    this.verbs = path.verbs.slice();
    this.points = path.points.map((p) => ({ x: p.x, y: p.y }));
    this.lastMoveIndex = path.lastMoveIndex;
    this.needMoveTo = path.needMoveTo;
    this.segmentType = path.segmentType;
    this.markDirty();
  }
  reset() {
    this.version = -1;
    this.verbs = [];
    this.points = [];
    this.lastMoveIndex = -1;
    this.segmentType = 0;
    this.needMoveTo = true;
    this.drity = true;
    this._boundsDirty = true;
    this._tightBoundsDirty = true;
  }
  markDirty() {
    this.drity = true;
    this.version++;
    this._boundsDirty = true;
    this._tightBoundsDirty = true;
  }
  transform(matrix) {
    Matrix2D.mapPoints(this.points, matrix, this.points);
    this.markDirty();
  }
  addPath(path, matrix) {
    path = path.clone();
    if (matrix) {
      path.transform(matrix);
    }
    const len = this.points.length;
    this.segmentType |= path.segmentType;
    this.lastMoveIndex = len + path.lastMoveIndex;
    this.needMoveTo = path.needMoveTo;
    this.verbs = this.verbs.concat(path.verbs);
    this.points = this.points.concat(path.points);
    this.markDirty();
    return this;
  }
  addReversePath(path) {
    path.invertVisit({
      moveTo: (p) => {
        this.moveTo(p.x, p.y);
      },
      lineTo: (p0, p1) => {
        this.lineTo(p1.x, p1.y);
      },
      quadraticCurveTo: (p0, p1, p2) => {
        this.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
      },
      cubicCurveTo: (p0, p1, p2, p3) => {
        this.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      },
      close: () => {
        this.closePath();
      }
    });
  }
  // ignore move
  reversePathTo(other) {
    if (other.isEmpty) {
      return;
    }
    other.invertVisit({
      moveTo: (p) => {
      },
      lineTo: (p0, p1) => {
        this.lineTo(p1.x, p1.y);
      },
      quadraticCurveTo: (p0, p1, p2) => {
        this.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
      },
      cubicCurveTo: (p0, p1, p2, p3) => {
        this.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      },
      close: () => {
        this.closePath();
      }
    });
  }
  offset(x, y) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].x += x;
      this.points[i].y += y;
    }
  }
  get isEmpty() {
    return this.verbs.length === 0;
  }
  ensureMove() {
    if (this.needMoveTo) {
      if (this.isEmpty) {
        this.moveTo(0, 0);
      } else {
        this.moveTo(this.lastPoint.x, this.lastPoint.y);
      }
    }
  }
  moveTo(x, y) {
    if (this.lastVerb === 1) {
      this.lastPoint.x = x;
      this.lastPoint.y = y;
    } else {
      this.verbs.push(
        1
        /* MoveTo */
      );
      this.points.push({ x, y });
    }
    this.lastMoveIndex = this.points.length - 1;
    this.needMoveTo = false;
    this.markDirty();
  }
  lineTo(x, y) {
    this.ensureMove();
    this.verbs.push(
      2
      /* LineTo */
    );
    this.points.push({ x, y });
    this.markDirty();
  }
  quadraticCurveTo(cpX, cpY, x, y) {
    this.ensureMove();
    this.verbs.push(
      4
      /* QuadraticTo */
    );
    this.points.push({ x: cpX, y: cpY });
    this.points.push({ x, y });
    this.markDirty();
  }
  bezierCurveTo(cpX1, cpY1, cpX2, cpY2, x, y) {
    this.ensureMove();
    this.verbs.push(
      8
      /* CubicTo */
    );
    this.points.push({ x: cpX1, y: cpY1 });
    this.points.push({ x: cpX2, y: cpY2 });
    this.points.push({ x, y });
    this.markDirty();
  }
  conicTo(cpX, cpY, x, y, weight) {
    if (!(weight > 0)) {
      this.lineTo(x, y);
    } else if (!Number.isFinite(weight)) {
      this.lineTo(cpX, cpY);
      this.lineTo(x, y);
    } else if (weight == 1) {
      this.quadraticCurveTo(cpX, cpY, x, y);
    } else {
      this.ensureMove;
      const k = 4 * weight / (3 * (weight + 1));
      const lastPoint = this.lastPoint;
      const cp1X = lastPoint.x + (cpX - lastPoint.x) * k;
      const cp1Y = lastPoint.y + (cpY - lastPoint.y) * k;
      const cp2X = x + (cpX - x) * k;
      const cp2Y = y + (cpY - y) * k;
      this.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, x, y);
    }
  }
  conicToQuad(cpX, cpY, x, y, weight) {
    const conic = new Conic([{ x: this.lastPoint.x, y: this.lastPoint.y }, { x: cpX, y: cpY }, { x, y }], weight);
    const ptsList = conic.toQuadraticBeziers();
    for (let i = 0; i < ptsList.length; i++) {
      const [p0, p1, p2] = ptsList[i];
      this.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
    }
  }
  rect(x, y, width, height) {
    this.moveTo(x, y);
    this.lineTo(x + width, y);
    this.lineTo(x + width, y + height);
    this.lineTo(x, y + height);
    this.closePath();
    this.segmentType |= PathSegmentType.Rect;
  }
  /**
   * 添加圆弧路径
   *
   * 将圆弧分成最多 90° 一段，每段用三次贝塞尔曲线近似。
   * 近似公式：k = 4/3 * tan(θ/4)，控制点沿切线方向偏移 k * radius。
   *
   * @param x - 圆心 X
   * @param y - 圆心 Y
   * @param radius - 半径
   * @param startAngle - 起始角度（弧度）
   * @param endAngle - 结束角度（弧度）
   * @param counterclockwise - 是否逆时针（默认顺时针）
   */
  arc(x, y, radius, startAngle, endAngle, counterclockwise = false) {
    arcCubicBezierFromPath(this, x, y, radius, startAngle, endAngle, counterclockwise);
    this.segmentType |= PathSegmentType.Arc;
  }
  /**
   * 添加椭圆路径
   *
   * 参数化：E(t) = center + R(rotation) * (rx·cos(t), ry·sin(t))
   * 每段用三次贝塞尔曲线近似，控制点沿切线方向偏移。
   *
   * @param x - 椭圆中心 X
   * @param y - 椭圆中心 Y
   * @param radiusX - X 轴半径
   * @param radiusY - Y 轴半径
   * @param rotation - 旋转角度（弧度）
   * @param startAngle - 起始角度（弧度）
   * @param endAngle - 结束角度（弧度）
   * @param counterclockwise - 是否逆时针（默认顺时针）
   */
  ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise = false) {
    ellipseCubicBezierFromPath(this, x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise);
    this.segmentType |= PathSegmentType.Ellipse;
  }
  /**
   * 添加圆弧连接（arcTo）
   *
   * 从当前点到 (x1, y1) 的线段与 (x1, y1) 到 (x2, y2) 的线段之间，
   * 绘制一个半径为 radius 的圆弧（与两条线段相切）。
   * 如果当前点与 (x1, y1) 不重合，会先画一条 lineTo 到切点。
   *
   * @param x1 - 第一条切线的终点 X
   * @param y1 - 第一条切线的终点 Y
   * @param x2 - 第二条切线的终点 X
   * @param y2 - 第二条切线的终点 Y
   * @param radius - 圆弧半径
   */
  conicArcTo(x1, y1, x2, y2, radius) {
    this.ensureMove();
    if (radius === 0) {
      this.lineTo(x1, y1);
      return;
    }
    const lastPoint = this.lastPoint;
    const p0 = Vector2.fromPoint(lastPoint);
    const p1 = Vector2.create(x1, y1);
    const p2 = Vector2.create(x2, y2);
    let d0 = p1.clone().subtract(p0).normalize();
    let d1 = p2.clone().subtract(p1).normalize();
    let cosh = d0.dot(d1);
    let sinh = d0.cross(d1);
    if (!d0.isFinite() || !d1.isFinite() || Math.abs(sinh) <= 1e-6) {
      return this.lineTo(x1, y1);
    }
    let dist = Math.abs(radius * (1 - cosh) / sinh);
    let start = p1.clone().subtract(d0.multiplyScalar(dist));
    let end = p1.clone().add(d1.multiplyScalar(dist));
    let weight = Math.sqrt(0.5 + cosh * 0.5);
    this.lineTo(start.x, start.y);
    this.conicTo(x1, y1, end.x, end.y, weight);
  }
  svgArcTo(x1, y1, x2, y2, radius) {
    this.ensureMove();
    if (radius === 0) {
      this.lineTo(x1, y1);
      return;
    }
    const lastPoint = this.lastPoint;
    const p0 = Vector2.fromPoint(lastPoint);
    const p1 = Vector2.create(x1, y1);
    const p2 = Vector2.create(x2, y2);
    let d0 = p1.clone().subtract(p0).normalize();
    let d1 = p2.clone().subtract(p1).normalize();
    let cosh = d0.dot(d1);
    let sinh = d0.cross(d1);
    if (Math.abs(sinh) <= 1e-6) {
      this.lineTo(x1, y1);
      return;
    }
    let dist = Math.abs(radius * (1 - cosh) / sinh);
    let start = p1.clone().subtract(d0.multiplyScalar(dist));
    let end = p1.clone().add(d1.multiplyScalar(dist));
    let sweepFag = sinh > 0 ? true : false;
    this.lineTo(start.x, start.y);
    this.arcToSvg(start.x, start.y, radius, radius, 0, false, sweepFag, end.x, end.y);
  }
  /**
   * 添加圆弧连接（arcTo）
   *
   * 从当前点到 (x1, y1) 的线段与 (x1, y1) 到 (x2, y2) 的线段之间，
   * 绘制一个半径为 radius 的圆弧（与两条线段相切）。
   * 如果当前点与 (x1, y1) 不重合，会先画一条 lineTo 到切点。
   *
   * @param x1 - 第一条切线的终点 X
   * @param y1 - 第一条切线的终点 Y
   * @param x2 - 第二条切线的终点 X
   * @param y2 - 第二条切线的终点 Y
   * @param radius - 圆弧半径
   */
  arcTo(x1, y1, x2, y2, radius) {
    this.ensureMove();
    const p0 = this.lastPoint;
    const p0x = p0.x;
    const p0y = p0.y;
    const dx1 = x1 - p0x;
    const dy1 = y1 - p0y;
    const dx2 = x2 - x1;
    const dy2 = y2 - y1;
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    if (len1 < 1e-10 || len2 < 1e-10 || radius < 1e-10) {
      this.lineTo(x1, y1);
      return;
    }
    const ux1 = dx1 / len1;
    const uy1 = dy1 / len1;
    const ux2 = dx2 / len2;
    const uy2 = dy2 / len2;
    const cosAngle = ux1 * ux2 + uy1 * uy2;
    const sinAngle = ux1 * uy2 - uy1 * ux2;
    if (Math.abs(sinAngle) < 1e-10) {
      this.lineTo(x1, y1);
      return;
    }
    const sign = sinAngle > 0 ? 1 : -1;
    const d = Math.abs(radius * Math.tan(Math.acos(cosAngle) / 2));
    const t1x = x1 - d * ux1;
    const t1y = y1 - d * uy1;
    const t2x = x1 + d * ux2;
    const t2y = y1 + d * uy2;
    const nx = -uy1;
    const ny = ux1;
    const cx = t1x + sign * radius * nx;
    const cy = t1y + sign * radius * ny;
    const startAngle = Math.atan2(t1y - cy, t1x - cx);
    const endAngle = Math.atan2(t2y - cy, t2x - cx);
    this.lineTo(t1x, t1y);
    const counterclockwise = sign < 0;
    this.arc(cx, cy, radius, startAngle, endAngle, counterclockwise);
  }
  /**
   * 添加圆角矩形路径
   *
   * 支持统一圆角或多个圆角分别指定。
   *
   * @param x - 矩形左上角 X
   * @param y - 矩形左上角 Y
   * @param w - 矩形宽度
   * @param h - 矩形高度
   * @param radii - 圆角半径（支持多种格式）
   *   - number: 所有角统一半径
   *   - [all]: 四个角统一半径 [r]
   *   - [tl, br]: 左上和右下相同，右上和左下相同
   *   - [tl, tr, br, bl]: 分别指定四个角
   */
  roundRect(x, y, w, h, radii) {
    let r = 0, r2 = 0, r3 = 0, r4 = 0;
    if (radii === void 0 || radii === 0) {
      this.rect(x, y, w, h);
      return;
    }
    if (typeof radii === "number") {
      r = r2 = r3 = r4 = radii;
    } else {
      const arr = radii;
      const len = arr.length;
      if (len === 0) {
        this.rect(x, y, w, h);
        return;
      }
      r = arr[0];
      if (len === 1) {
        r2 = r3 = r4 = r;
      } else if (len === 2) {
        r2 = arr[1];
        r3 = r;
        r4 = r2;
      } else if (len === 3) {
        r2 = arr[1];
        r3 = arr[2];
        r4 = r2;
      } else {
        r2 = arr[1];
        r3 = arr[2];
        r4 = arr[3];
      }
    }
    r = Math.max(0, r);
    r2 = Math.max(0, r2);
    r3 = Math.max(0, r3);
    r4 = Math.max(0, r4);
    let scale = 1;
    const hScale = w > 0 ? Math.min(1, w / (r + r2), w / (r4 + r3)) : 0;
    const vScale = h > 0 ? Math.min(1, h / (r + r4), h / (r2 + r3)) : 0;
    scale = Math.min(hScale, vScale);
    if (scale < 1) {
      r *= scale;
      r2 *= scale;
      r3 *= scale;
      r4 *= scale;
    }
    this.moveTo(x + r, y);
    this.lineTo(x + w - r2, y);
    if (r2 > 0) this.arcTo(x + w, y, x + w, y + r2, r2);
    this.lineTo(x + w, y + h - r3);
    if (r3 > 0) this.arcTo(x + w, y + h, x + w - r3, y + h, r3);
    this.lineTo(x + r4, y + h);
    if (r4 > 0) this.arcTo(x, y + h, x, y + h - r4, r4);
    this.lineTo(x, y + r);
    if (r > 0) this.arcTo(x, y, x + r, y, r);
    this.closePath();
    this.segmentType |= PathSegmentType.RoundRect;
  }
  /**
   * 添加正多边形路径
   *
   * 顶点均匀分布在以 (x, y) 为圆心、radius 为半径的圆周上，
   * 首顶点位于 rotation 角度处（默认朝上），相邻顶点以直线连接并闭合。
   *
   * @param x - 中心 X
   * @param y - 中心 Y
   * @param radius - 外接圆半径
   * @param sides - 边数（默认 3，即三角形）
   * @param rotation - 起始角度（弧度，默认 -π/2，首顶点朝上）
   */
  polygon(x, y, radius, sides = 3, rotation = -Math.PI / 2) {
    sides = Math.max(3, Math.floor(sides));
    const step = Math.PI * 2 / sides;
    for (let i = 0; i < sides; i++) {
      const angle = rotation + step * i;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) {
        this.moveTo(px, py);
      } else {
        this.lineTo(px, py);
      }
    }
    this.closePath();
  }
  /**
   * 添加星形路径
   *
   * 由 points 个尖角组成：外顶点位于半径 outerRadius 的圆周，
   * 内顶点位于半径 innerRadius 的圆周，二者交替连接并闭合。
   *
   * @param x - 中心 X
   * @param y - 中心 Y
   * @param outerRadius - 外顶点半径
   * @param innerRadius - 内顶点半径（默认 outerRadius * 0.5）
   * @param points - 尖角数量（默认 5）
   * @param rotation - 起始角度（弧度，默认 -π/2，首个尖角朝上）
   */
  star(x, y, outerRadius, innerRadius = outerRadius * 0.5, points = 5, rotation = -Math.PI / 2) {
    points = Math.max(2, Math.floor(points));
    const step = Math.PI / points;
    const count = points * 2;
    for (let i = 0; i < count; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = rotation + step * i;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (i === 0) {
        this.moveTo(px, py);
      } else {
        this.lineTo(px, py);
      }
    }
    this.closePath();
  }
  /**
   * 添加玫瑰花路径（数学玫瑰线 r = radius · |cos(kθ)|，k = petals / 2）
   *
   * 由 petals 片花瓣围绕中心均匀辐射构成：花瓣尖端位于半径 radius 的外接圆上，
   * 相邻花瓣在中轴两侧的零点（半径 0，即中心）处交于一点，整体即标准玫瑰线。
   * 每片花瓣从中心出发再回到中心，以极角均分为 4 段三次贝塞尔曲线，段端点位置与
   * 切线均取自玫瑰线的解析值（Hermite 构造），故曲线与玫瑰线高度吻合、花瓣饱满。
   * 全程使用贝塞尔命令，不做折线细分。
   *
   * @param x - 中心 X
   * @param y - 中心 Y
   * @param radius - 花瓣长度（外接圆半径）
   * @param petals - 花瓣数量（默认 5）
   * @param rotation - 起始角度（弧度，默认 -π/2，首批花瓣朝上）
   */
  rose(x, y, radius, petals = 5, rotation = -Math.PI / 2) {
    petals = Math.max(1, Math.floor(petals));
    const k = petals / 2;
    const halfSpan = Math.PI / (2 * k);
    const step = Math.PI / k;
    const pointAt = (theta, mid) => {
      const r = radius * Math.cos(k * (theta - mid));
      return { x: x + Math.cos(theta) * r, y: y + Math.sin(theta) * r };
    };
    const derivAt = (theta, mid) => {
      const r = radius * Math.cos(k * (theta - mid));
      const dr = -radius * k * Math.sin(k * (theta - mid));
      const c = Math.cos(theta);
      const s = Math.sin(theta);
      return { x: dr * c - r * s, y: dr * s + r * c };
    };
    const segment = (t0, t1, mid) => {
      const p0 = pointAt(t0, mid);
      const p1 = pointAt(t1, mid);
      const d0 = derivAt(t0, mid);
      const d1 = derivAt(t1, mid);
      const dt = (t1 - t0) / 3;
      this.bezierCurveTo(
        p0.x + d0.x * dt,
        p0.y + d0.y * dt,
        p1.x - d1.x * dt,
        p1.y - d1.y * dt,
        p1.x,
        p1.y
      );
    };
    for (let j = 0; j < petals; j++) {
      const mid = rotation + step * j;
      if (j === 0) {
        this.moveTo(x, y);
      }
      segment(mid - halfSpan, mid - halfSpan / 2, mid);
      segment(mid - halfSpan / 2, mid, mid);
      segment(mid, mid + halfSpan / 2, mid);
      segment(mid + halfSpan / 2, mid + halfSpan, mid);
    }
    this.closePath();
  }
  /**
   * 添加心形路径
   *
   * 由两段圆弧（上方左右两个圆瓣）与两段二次贝塞尔曲线（两侧收拢到底部尖端）构成，
   * 全程使用弧与贝塞尔命令精确绘制，不做折线细分。
   * 归一化后心形的水平宽度为 2·radius，并以 (x, y) 为中心。
   *
   * @param x - 中心 X
   * @param y - 中心 Y
   * @param radius - 半宽（心形水平方向的半径）
   * @param rotation - 旋转角度（弧度，默认 0）
   */
  heart(x, y, radius, rotation = 0) {
    const s = radius / 40;
    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);
    const tx = (px, py) => {
      const lx = (px - 50) * s;
      const ly = (py - 50) * s;
      return { x: x + lx * cosR - ly * sinR, y: y + lx * sinR + ly * cosR };
    };
    const lobeRadius = 20 * s;
    const p0 = tx(10, 30);
    this.moveTo(p0.x, p0.y);
    const cl = tx(30, 30);
    this.arc(cl.x, cl.y, lobeRadius, Math.PI + rotation, Math.PI * 2 + rotation);
    const cr = tx(70, 30);
    this.arc(cr.x, cr.y, lobeRadius, Math.PI + rotation, Math.PI * 2 + rotation);
    const q1c = tx(90, 60);
    const q1e = tx(50, 90);
    this.quadraticCurveTo(q1c.x, q1c.y, q1e.x, q1e.y);
    const q2c = tx(10, 60);
    const q2e = tx(10, 30);
    this.quadraticCurveTo(q2c.x, q2c.y, q2e.x, q2e.y);
    this.closePath();
  }
  /**
   * 添加水滴路径
   *
   * 底部为半径 radius 的半圆，两侧以三次贝塞尔曲线收拢到顶部尖端，
   * 顶部为一个尖角（cusp），整体形如水滴。
   *
   * @param x - 底部圆心 X
   * @param y - 底部圆心 Y
   * @param radius - 底部半圆半径（水滴半宽）
   * @param height - 尖端高出圆心的距离（默认 radius * 1.6）
   */
  droplet(x, y, radius, height = radius * 1.6) {
    const tipY = y - height;
    const cpX = radius * 0.35;
    const cpY = y - height * 0.75;
    const poleY = y - height * 0.4;
    this.moveTo(x, tipY);
    this.bezierCurveTo(x + cpX, cpY, x + radius, poleY, x + radius, y);
    this.arc(x, y, radius, 0, Math.PI);
    this.bezierCurveTo(x - radius, poleY, x - cpX, cpY, x, tipY);
    this.closePath();
  }
  /**
   * 添加 SVG 椭圆弧路径（SVG Arc A/a 命令转换）
   *
   * 将 SVG 弧线的端点参数化（起点+终点+半径+旋转+大弧/扫掠标志）
   * 转换为中心参数化（圆心+半径+起始/终止角度），再委托 ellipse() 绘制。
   *
   * 算法遵循 SVG 规范：
   *   https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
   *
   * @param x1 - 起点 X
   * @param y1 - 起点 Y
   * @param rx - X 轴半径
   * @param ry - Y 轴半径
   * @param rotation - 椭圆的旋转角度（弧度）
   * @param largeArcFlag - true=大弧, false=小弧
   * @param sweepFlag - true=顺时针, false=逆时针
   * @param x - 终点 X
   * @param y - 终点 Y
   */
  arcToSvg(x1, y1, rx, ry, rotation, largeArcFlag, sweepFlag, x, y) {
    ellipseSvgArcFromPath(this, x1, y1, rx, ry, rotation, largeArcFlag, sweepFlag, x, y);
    this.segmentType |= PathSegmentType.EllipseSvgArc;
  }
  closePath() {
    if (!this.isEmpty) {
      if (this.lastVerb !== 16) {
        this.verbs.push(
          16
          /* Close */
        );
      }
      this.needMoveTo = true;
    }
  }
  /**
   * 判断点是否在路径填充区域内
   *
   * 先用包围盒快速拒绝，再根据填充规则用绕数法判断：
   * - 'nonzero'（默认）：绕数不为 0 则在内部
   * - 'evenodd'：绕数为奇数则在内部
   *
   * @param px - 测试点 X
   * @param py - 测试点 Y
   * @param fillRule - 填充规则，默认 'nonzero'
   */
  isPointInPath(px, py, fillRule = "nonzero") {
    const bounds = this.computeTightBounds();
    if (!bounds || !bounds.contains(px, py)) {
      return false;
    }
    let wind = 0;
    this.visit({
      lineTo: (start, end) => {
        wind += windingLine(px, py, start.x, start.y, end.x, end.y);
      },
      quadraticCurveTo: (p0, p1, p2) => {
        wind += windingQuadraticBezier(
          px,
          py,
          p0,
          p1,
          p2
        );
      },
      cubicCurveTo: (p0, p1, p2, p3) => {
        wind += windingCubicBezier(
          px,
          py,
          p0,
          p1,
          p2,
          p3
        );
      },
      close: (lastPoint, movePoint) => {
        if (!Vector2.equalsEpsilon(lastPoint, movePoint)) {
          wind += windingLine(px, py, lastPoint.x, lastPoint.y, movePoint.x, movePoint.y);
        }
      }
    });
    return fillRule === "evenodd" ? (wind & 1) !== 0 : wind !== 0;
  }
  invertVisit(visitor) {
    const points = this.points, verbs = this.verbs;
    let lastMoveIndex = 0, needMove = true, needClose = false;
    let lastPont = Vector2.create();
    for (let i = verbs.length - 1, k = points.length; i >= 0; i--) {
      let verb = verbs[i];
      if (needMove) {
        k -= 1;
        needMove = false;
        visitor.moveTo?.(points[k]);
        lastPont.copy(points[k]);
        lastMoveIndex = k;
      }
      switch (verb) {
        case 1:
          if (needClose) {
            visitor.close?.(lastPont, points[lastMoveIndex]);
            needClose = false;
          }
          needMove = true;
          break;
        case 2:
          k -= 1;
          visitor.lineTo?.(lastPont, points[k]);
          lastPont.copy(points[k]);
          break;
        case 4:
          k -= 2;
          visitor.quadraticCurveTo?.(lastPont, points[k + 1], points[k]);
          lastPont.copy(points[k]);
          break;
        case 8:
          k -= 3;
          visitor.cubicCurveTo?.(lastPont, points[k + 2], points[k + 1], points[k]);
          lastPont.copy(points[k]);
          break;
        case 16:
          needClose = true;
          break;
      }
    }
  }
  visit(cbs) {
    const points = this.points;
    const size = this.size;
    let k = 0, movePoint = Vector2.default();
    for (let i = 0; i < size; i++) {
      const verb = this.verbs[i];
      const len = PathVerbCount[verb];
      k += len;
      switch (verb) {
        case 1:
          movePoint.copy(points[k - 1]);
          cbs.moveTo?.(points[k - 1]);
          break;
        case 2:
          cbs.lineTo?.(points[k - 2], points[k - 1]);
          break;
        case 4:
          cbs.quadraticCurveTo?.(points[k - 3], points[k - 2], points[k - 1]);
          break;
        case 8:
          cbs.cubicCurveTo?.(points[k - 4], points[k - 3], points[k - 2], points[k - 1]);
          break;
        case 16:
          cbs.close?.(points[k - 1], movePoint);
          break;
      }
    }
  }
  /**
   * 迭代路径段，产出内容与 visit 的回调一一对应
   *
   * 用法：
   * for (const seg of path) {
   *     if (seg.type === 'lineTo') console.log(seg.start, seg.end)
   * }
   */
  *[Symbol.iterator]() {
    const points = this.points;
    const size = this.size;
    let k = 0;
    const movePoint = Vector2.default();
    for (let i = 0; i < size; i++) {
      const verb = this.verbs[i];
      k += PathVerbCount[verb];
      switch (verb) {
        case 1:
          movePoint.copy(points[k - 1]);
          yield { type: "moveTo", point: points[k - 1] };
          break;
        case 2:
          yield { type: "lineTo", start: points[k - 2], end: points[k - 1] };
          break;
        case 4:
          yield {
            type: "quadraticCurveTo",
            start: points[k - 3],
            control: points[k - 2],
            end: points[k - 1]
          };
          break;
        case 8:
          yield {
            type: "cubicCurveTo",
            start: points[k - 4],
            control1: points[k - 3],
            control2: points[k - 2],
            end: points[k - 1]
          };
          break;
        case 16:
          yield { type: "close", last: points[k - 1], move: { x: movePoint.x, y: movePoint.y } };
          break;
      }
    }
  }
  /**
   * 计算路径的包围盒（带缓存）
   * 路径未变化时返回缓存，避免重复遍历。
   * @returns { minX, minY, maxX, maxY } 包围盒，路径为空时返回 null
   */
  computeBounds() {
    if (!this._boundsDirty) {
      return this._bounds;
    }
    if (!this._bounds) {
      this._bounds = BoundingRect.default();
    }
    this._bounds.setEmpty();
    this.points.forEach((p) => {
      this._bounds.expandPoint(p);
    });
    if (this.isEmpty) {
      this._bounds.fromLTRB(0, 0, 0, 0);
    }
    this._boundsDirty = false;
    return this._bounds;
  }
  /**
   * 计算路径的紧凑包围盒（带缓存）
   *
   * 路径未变化时返回缓存，避免重复遍历。
   * @returns { minX, minY, maxX, maxY } 包围盒，路径为空时返回 null
   */
  computeTightBounds() {
    if (!this._tightBoundsDirty) {
      return this._tightBounds;
    }
    if (!this._tightBounds) {
      this._tightBounds = BoundingRect.default();
    }
    let hasPoints = false;
    this._tightBounds.setEmpty();
    const update = (x, y) => {
      this._tightBounds.add(x, y);
      hasPoints = true;
    };
    this.visit({
      moveTo: (p) => update(p.x, p.y),
      lineTo: (start, end) => {
        update(end.x, end.y);
      },
      quadraticCurveTo: (p0, p1, p2) => {
        const b = getQuadraticBezierBounds(p0, p1, p2);
        update(b.minX, b.minY);
        update(b.maxX, b.maxY);
      },
      cubicCurveTo: (p0, p1, p2, p3) => {
        const b = getCubicBezierBounds(
          p0,
          p1,
          p2,
          p3
        );
        update(b.minX, b.minY);
        update(b.maxX, b.maxY);
      }
    });
    if (!hasPoints) {
      this._tightBounds.fromLTRB(0, 0, 0, 0);
    }
    this._tightBoundsDirty = false;
    return this._tightBounds;
  }
  toPolygons(autoClose = false, epsilon = 0.5) {
    const paths = [];
    let subPath = [];
    let lastMovePoint = Vector2.create();
    const handleAutoClose = () => {
      if (autoClose && !Vector2.equalsEpsilon(subPath[subPath.length - 1], lastMovePoint)) {
        subPath.push({ x: lastMovePoint.x, y: lastMovePoint.y });
      }
    };
    this.visit({
      moveTo: (p) => {
        if (subPath.length > 0) {
          handleAutoClose();
          paths.push(subPath);
          subPath = [];
        }
        lastMovePoint.copy(p);
        subPath.push({ x: p.x, y: p.y });
      },
      lineTo: (start, end) => {
        subPath.push({ x: end.x, y: end.y });
      },
      quadraticCurveTo: (p0, p1, p2) => {
        const quad = new QuadraticBezier([p0, p1, p2]);
        quad.flatten(epsilon).forEach((p) => {
          subPath.push(p);
        });
      },
      cubicCurveTo: (p0, p1, p2, p3) => {
        const quad = new CubicBezier([p0, p1, p2, p3]);
        quad.flatten(epsilon).forEach((p) => {
          subPath.push(p);
        });
      },
      close: (lastPoint, movePoint) => {
        handleAutoClose();
        paths.push(subPath);
        subPath = [];
      }
    });
    if (subPath.length > 0) {
      handleAutoClose();
      paths.push(subPath);
    }
    return paths;
  }
  /**
   * 将路径拆分为多个子路径（按 MoveTo 分段）
   * 二次/三次贝塞尔曲线按 epsilon 公差展平为折线
   *
   * @param epsilon - 曲线展平公差，默认 0.25
   * @returns 子路径数组，每项为展平后的点序列及其是否闭合
   *   - points：子路径的折线点序列
   *   - closed：是否有 Close 命令（闭合时末点与起点重合）
   */
  getSubPaths(options = {}) {
    const { tolerance = 0.25, autoClose = false, skipDegenerate = false } = options;
    const subPaths = [];
    let subPath = null;
    const finish = (closed) => {
      const contour = subPath;
      subPath = null;
      if (!contour || contour.points.length === 0) return;
      const points = contour.points;
      if (autoClose && !Vector2.equalsEpsilon(points[points.length - 1], points[0])) {
        points.push({ x: points[0].x, y: points[0].y });
      }
      contour.closed = autoClose || closed;
      if (skipDegenerate) {
        let degenerate = points.length < 2;
        if (!degenerate) {
          degenerate = true;
          for (let i = 1; i < points.length; i++) {
            if (!Vector2.equalsEpsilon(points[i], points[0])) {
              degenerate = false;
              break;
            }
          }
        }
        if (degenerate) return;
      }
      subPaths.push(contour);
    };
    this.visit({
      moveTo: (p) => {
        finish(false);
        subPath = { points: [{ x: p.x, y: p.y }], closed: false };
      },
      lineTo: (start, end) => {
        subPath?.points.push({ x: end.x, y: end.y });
      },
      quadraticCurveTo: (p0, p1, p2) => {
        const quad = new QuadraticBezier([p0, p1, p2]);
        quad.flatten(tolerance).forEach((p) => {
          subPath?.points.push({ x: p.x, y: p.y });
        });
      },
      cubicCurveTo: (p0, p1, p2, p3) => {
        const curve = new CubicBezier([p0, p1, p2, p3]);
        curve.flatten(tolerance).forEach((p) => {
          subPath?.points.push({ x: p.x, y: p.y });
        });
      },
      close: (lastPoint, movePoint) => {
        finish(true);
      }
    });
    if (subPath && subPath.points.length > 0) {
      finish(false);
    }
    return subPaths;
  }
  fromPolygons(polygons) {
    let movePoint = { x: 0, y: 0 };
    for (let i = 0, len = polygons.length; i < len; i++) {
      const polygon = polygons[i];
      for (let j = 0, len2 = polygon.length; j < len2; j++) {
        const p = polygon[j];
        if (j === 0) {
          movePoint.x = p.x;
          movePoint.y = p.y;
          this.moveTo(p.x, p.y);
        } else {
          if (j === len2 - 1 && Vector2.equalsEpsilon(p, movePoint)) {
            this.closePath();
          } else {
            this.lineTo(p.x, p.y);
          }
        }
      }
    }
    return this;
  }
  /**
   * 将路径数据导出为 SVG path d 属性字符串命令数组。
   * 每条命令为独立的 SVG 指令段，如 ["M 10 20", "L 30 40", "C ...", "Z"]。
   *
   * @param precision - 数值精度（保留小数位数），默认 2
   * @returns SVG 命令字符串数组
   */
  toSvgCmds(precision = 2) {
    const cmds = [];
    const p = precision;
    const fmt = (v) => parseFloat(v.toFixed(p)).toString();
    this.visit({
      moveTo: (pt) => {
        cmds.push(`M ${fmt(pt.x)} ${fmt(pt.y)}`);
      },
      lineTo: (_start, end) => {
        cmds.push(`L ${fmt(end.x)} ${fmt(end.y)}`);
      },
      quadraticCurveTo: (_p0, p1, p2) => {
        cmds.push(`Q ${fmt(p1.x)} ${fmt(p1.y)} ${fmt(p2.x)} ${fmt(p2.y)}`);
      },
      cubicCurveTo: (_p0, p1, p2, p3) => {
        cmds.push(`C ${fmt(p1.x)} ${fmt(p1.y)} ${fmt(p2.x)} ${fmt(p2.y)} ${fmt(p3.x)} ${fmt(p3.y)}`);
      },
      close: () => {
        cmds.push("Z");
      }
    });
    return cmds;
  }
  /**
   * 导出为完整的 SVG path d 属性字符串
   * @param precision - 数值精度，默认 2
   */
  toSvgPath(precision = 2) {
    return this.toSvgCmds(precision).join(" ");
  }
  getPath2D() {
    const path = new window.Path2D();
    this.applyContext(path);
    return path;
  }
  applyContext(path = new Path2D()) {
    this.visit({
      moveTo: (p) => path.moveTo(p.x, p.y),
      lineTo: (start, end) => path.lineTo(end.x, end.y),
      quadraticCurveTo: (p0, p1, p2) => path.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y),
      cubicCurveTo: (p0, p1, p2, p3) => path.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y),
      close: (lastPoint, movePoint) => path.closePath()
    });
    return path;
  }
}
export {
  PathBuilder,
  PathCmd,
  PathDirection,
  PathSegmentType,
  PathVerb,
  PathVerbCount
};
