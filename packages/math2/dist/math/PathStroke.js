import { CubicBezier } from "./CubicBezier.js";
import { QuadraticBezier } from "./QuadraticBezier.js";
import { PathBuilder } from "./PathBuilder.js";
import { Point } from "./Point.js";
var LineJoin = /* @__PURE__ */ ((LineJoin2) => {
  LineJoin2["Miter"] = "miter";
  LineJoin2["Round"] = "round";
  LineJoin2["Bevel"] = "bevel";
  return LineJoin2;
})(LineJoin || {});
var LineCap = /* @__PURE__ */ ((LineCap2) => {
  LineCap2["Butt"] = "butt";
  LineCap2["Round"] = "round";
  LineCap2["Square"] = "square";
  return LineCap2;
})(LineCap || {});
function setNormalUnitNormal(before, after, scale, radius, normal, unitNormal) {
  if (!unitNormal.setLengthTo((after.x - before.x) * scale, (after.y - before.y) * scale, 1)) {
    return false;
  }
  unitNormal.perpendicular().negate();
  normal.copy(unitNormal).multiplyScalar(radius);
  return true;
}
function handleInnerJoin(pivot, after, inner) {
  inner.lineTo(pivot.x, pivot.y);
  inner.lineTo(pivot.x - after.x, pivot.y - after.y);
}
function setLastPoint(path, x, y) {
  const lp = path.lastPoint;
  if (lp) {
    lp.x = x;
    lp.y = y;
  }
}
const roundJoin = (beforeUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit, prevIsLine, currIsLine, builders) => {
  const dir = beforeUnitNormal.cross(afterUnitNormal);
  if (dir === 0) {
    return;
  }
  const cosh = beforeUnitNormal.dot(afterUnitNormal);
  const halfSin = Math.sqrt((1 + cosh) / 2);
  const miterLen = radius / halfSin;
  let n0 = beforeUnitNormal;
  let n1 = afterUnitNormal;
  if (dir < 0) {
    builders.swap();
    n0 = beforeUnitNormal.clone().negate();
    n1 = afterUnitNormal.clone().negate();
  }
  const p0 = Point.fromPoint(pivot).add(Point.fromPoint(n0).multiplyScalar(radius));
  const p1 = Point.fromPoint(pivot).add(Point.fromPoint(n1).multiplyScalar(radius));
  const mid = Point.fromPoint(n0).add(n1).normalize().multiplyScalar(miterLen).add(pivot);
  if (prevIsLine) {
    setLastPoint(builders.outer, p0.x, p0.y);
  } else {
    builders.outer.lineTo(p0.x, p0.y);
  }
  builders.outer.arcTo(mid.x, mid.y, p1.x, p1.y, radius);
  handleInnerJoin(pivot, Point.fromPoint(n1).multiplyScalar(radius), builders.inner);
};
const miterJoin = (beforeUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit, prevIsLine, currIsLine, builders) => {
  const dir = beforeUnitNormal.cross(afterUnitNormal);
  if (dir === 0) {
    return;
  }
  const cosh = beforeUnitNormal.dot(afterUnitNormal);
  const halfSin = Math.sqrt((1 + cosh) / 2);
  if (halfSin < invMiterLimit) {
    bevelJoin(beforeUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit, prevIsLine, currIsLine, builders);
    return;
  }
  let n0 = beforeUnitNormal;
  let n1 = afterUnitNormal;
  if (dir < 0) {
    builders.swap();
    n0 = beforeUnitNormal.clone().negate();
    n1 = afterUnitNormal.clone().negate();
  }
  const miterLen = radius / halfSin;
  const miterPt = Point.fromPoint(n0).add(n1).normalize().multiplyScalar(miterLen).add(pivot);
  if (prevIsLine) {
    setLastPoint(builders.outer, miterPt.x, miterPt.y);
  } else {
    builders.outer.lineTo(miterPt.x, miterPt.y);
  }
  if (!currIsLine) {
    const afterPt = Point.fromPoint(pivot).add(Point.fromPoint(n1).multiplyScalar(radius));
    builders.outer.lineTo(afterPt.x, afterPt.y);
  }
  handleInnerJoin(pivot, Point.fromPoint(n1).multiplyScalar(radius), builders.inner);
};
const bevelJoin = (beforeUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit, prevIsLine, currIsLine, builders) => {
  const dir = beforeUnitNormal.cross(afterUnitNormal);
  if (dir === 0) {
    return;
  }
  const afterNormal = afterUnitNormal.clone().multiplyScalar(radius);
  if (dir < 0) {
    builders.swap();
    afterNormal.negate();
  }
  builders.outer.lineTo(pivot.x + afterNormal.x, pivot.y + afterNormal.y);
  handleInnerJoin(pivot, afterNormal, builders.inner);
};
const buttCap = (pivot, normal, stop, otherPath, path) => {
  path.lineTo(stop.x, stop.y);
};
const squareCap = (pivot, normal, stop, otherPath, path) => {
  const parallelNormal = normal.clone().perpendicular();
  const start = pivot.clone().add(parallelNormal).add(normal);
  const end = pivot.clone().add(parallelNormal).subtract(normal);
  if (otherPath) {
    setLastPoint(path, start.x, start.y);
    path.lineTo(end.x, end.y);
  } else {
    path.lineTo(start.x, start.y);
    path.lineTo(end.x, end.y);
    path.lineTo(stop.x, stop.y);
  }
};
const roundCap = (pivot, normal, stop, otherPath, path) => {
  const parallelNormal = normal.clone().perpendicular();
  const center = pivot.clone().add(parallelNormal);
  const start = center.clone().add(normal);
  path.conicTo(start.x, start.y, center.x, center.y, Math.SQRT1_2);
  start.copy(center).subtract(normal);
  path.conicTo(start.x, start.y, stop.x, stop.y, Math.SQRT1_2);
};
const joinFunc = {
  [
    "round"
    /* Round */
  ]: roundJoin,
  [
    "miter"
    /* Miter */
  ]: miterJoin,
  [
    "bevel"
    /* Bevel */
  ]: bevelJoin
};
const capFunc = {
  [
    "butt"
    /* Butt */
  ]: buttCap,
  [
    "round"
    /* Round */
  ]: roundCap,
  [
    "square"
    /* Square */
  ]: squareCap
};
class SwappableBuilders {
  constructor(inner, outer) {
    this.inner = inner;
    this.outer = outer;
  }
  swap() {
    [this.inner, this.outer] = [this.outer, this.inner];
    return this;
  }
}
class PathStroke {
  static default() {
    return new this();
  }
  radius;
  lineJoin = "miter";
  lineCap = "butt";
  miterLimit = 10;
  invertMiterLimit = 1 / 10;
  segmentCount = 0;
  resScale = 1;
  invResScale = 1;
  // 逆分辨率缩放系数
  firstPoint = Point.default();
  firstUnitNormal = Point.default();
  firstNormal = Point.default();
  prevPoint = Point.default();
  prevUnitNormal = Point.default();
  prevNormal = Point.default();
  prevIsLine = false;
  firstOuterPoint = Point.default();
  stroke(path, options) {
    this.lineJoin = options.lineJoin ?? "miter";
    this.lineCap = options.lineCap ?? "butt";
    this.miterLimit = options.miterLimit ?? 10;
    this.invertMiterLimit = 1 / this.miterLimit;
    this.radius = (options.lineWidth ?? 1) / 2;
    this.resScale = options.scale ?? 1;
    this.invResScale = 1 / this.resScale;
    this.outer = PathBuilder.default();
    this.inner = PathBuilder.default();
    this.capper = capFunc[this.lineCap];
    this.joiner = joinFunc[this.lineJoin];
    this.outer.reset();
    this.inner.reset();
    return this._stroke(path);
  }
  _stroke(path) {
    let lastSegmentLine = false;
    path.visit({
      moveTo: (p) => {
        this.moveTo(Point.fromPoint(p));
      },
      lineTo: (p0, p1) => {
        this.lineTo(Point.fromPoint(p1));
        lastSegmentLine = true;
      },
      quadraticCurveTo: (p0, p1, p2) => {
        this.quadTo(Point.fromPoint(p1), Point.fromPoint(p2));
        lastSegmentLine = false;
      },
      cubicCurveTo: (p0, p1, p2, p3) => {
        this.cubicTo(Point.fromPoint(p1), Point.fromPoint(p2), Point.fromPoint(p3));
        lastSegmentLine = false;
      },
      close: () => {
        if (this.lineCap !== "butt") {
          if (this.segmentCount == 0) {
            this.lineTo(this.firstPoint);
            return;
          }
        }
        if (this.segmentCount > 0 && !this.prevPoint.equalsEpsilon(this.firstPoint, this.invResScale)) {
          this.lineTo(this.firstPoint);
          lastSegmentLine = true;
        }
        this.close(lastSegmentLine);
      }
    });
    return this.finish(lastSegmentLine);
  }
  close(isLine) {
    this.finishContour(true, isLine);
  }
  moveTo(p) {
    if (this.segmentCount > 0) {
      this.finishContour(false, false);
    }
    this.firstPoint.copy(p);
    this.prevPoint.copy(p);
    this.segmentCount = 0;
  }
  lineTo(p) {
    this.lineToCore(p, true, true);
  }
  quadTo(p0, p1) {
    const points = new QuadraticBezier([this.prevPoint, p0, p1]).flatten();
    let first = true;
    for (let i = 1; i < points.length; i++) {
      if (this.lineToCore(Point.fromPoint(points[i]), true, first)) {
        first = false;
      }
    }
  }
  cubicTo(p0, p1, p2) {
    const points = new CubicBezier([this.prevPoint, p0, p1, p2]).flatten();
    let first = true;
    for (let i = 1; i < points.length; i++) {
      if (this.lineToCore(Point.fromPoint(points[i]), true, first)) {
        first = false;
      }
    }
  }
  /**
   * 核心线段处理。
   * @param p            本段终点
   * @param currentIsLine 本段是否为 lineTo（曲线展平段也按 line 处理）
   * @param runJoin      是否在拐点执行 joiner。
   *                     真实段边界（lineTo↔lineTo、lineTo↔曲线起点）为 true；
   *                     曲线展平后的内部线段为 false，仅直接延伸内外侧偏移折线，
   *                     避免 handleInnerJoin 在平滑曲线上密集下探 pivot 产生小三角。
   * @returns 是否实际写入了该段（零长段返回 false）
   */
  lineToCore(p, currentIsLine, runJoin) {
    if (this.prevPoint.equalsEpsilon(p, this.invResScale)) {
      return false;
    }
    const normal = Point.default();
    const unitNormal = Point.default();
    if (!setNormalUnitNormal(this.prevPoint, p, this.resScale, this.radius, normal, unitNormal)) {
      if (this.capper === buttCap) {
        return false;
      }
      normal.set(this.radius, 0);
      unitNormal.set(1, 0);
    }
    if (this.segmentCount === 0) {
      this.firstNormal.copy(normal);
      this.firstUnitNormal.copy(unitNormal);
      this.firstOuterPoint.copy(this.prevPoint).add(normal);
      this.outer.moveTo(this.prevPoint.x + normal.x, this.prevPoint.y + normal.y);
      this.inner.moveTo(this.prevPoint.x - normal.x, this.prevPoint.y - normal.y);
    } else if (runJoin && this.joiner) {
      this.joiner(
        this.prevUnitNormal,
        this.prevPoint,
        unitNormal,
        this.radius,
        this.invertMiterLimit,
        this.prevIsLine,
        currentIsLine,
        new SwappableBuilders(this.inner, this.outer)
      );
    }
    this.outer.lineTo(p.x + normal.x, p.y + normal.y);
    this.inner.lineTo(p.x - normal.x, p.y - normal.y);
    this.prevNormal.copy(normal);
    this.prevUnitNormal.copy(unitNormal);
    this.prevPoint.copy(p);
    this.prevIsLine = currentIsLine;
    this.segmentCount++;
    return true;
  }
  finishContour(close, currIsLine) {
    if (this.segmentCount > 0) {
      if (close) {
        this.joiner(
          this.prevUnitNormal,
          this.prevPoint,
          this.firstUnitNormal,
          this.radius,
          this.invertMiterLimit,
          this.prevIsLine,
          currIsLine,
          new SwappableBuilders(this.inner, this.outer)
        );
        this.outer.closePath();
        let pt = this.inner.lastPoint ?? Point.create(0, 0);
        this.outer.moveTo(pt.x, pt.y);
        this.outer.reversePathTo(this.inner);
        this.outer.closePath();
      } else {
        let otherPath = currIsLine ? this.inner : null;
        let lastPoint = this.inner.lastPoint ? Point.fromPoint(this.inner.lastPoint) : Point.default();
        this.capper(this.prevPoint, this.prevNormal, lastPoint, otherPath, this.outer);
        this.outer.reversePathTo(this.inner);
        otherPath = this.prevIsLine ? this.inner : null;
        this.capper(this.firstPoint, this.firstNormal.clone().negate(), this.firstOuterPoint, otherPath, this.outer);
        this.outer.closePath();
      }
    }
    this.inner.reset();
    this.segmentCount = -1;
  }
  finish(currIsLine) {
    this.finishContour(false, currIsLine);
    return this.outer;
  }
}
export {
  LineCap,
  LineJoin,
  PathStroke
};
