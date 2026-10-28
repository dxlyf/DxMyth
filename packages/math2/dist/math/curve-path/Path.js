import { Vector2 } from "../Vector2.js";
import { CurvePath } from "./CurvePath.js";
import { EllipseCurve } from "./curves/EllipseCurve.js";
import { SplineCurve } from "./curves/SplineCurve.js";
import { CubicBezierCurve } from "./curves/CubicBezierCurve.js";
import { QuadraticBezierCurve } from "./curves/QuadraticBezierCurve.js";
import { LineCurve } from "./curves/LineCurve.js";
import { ArcToCurve } from "./curves/ArcToCurve.js";
class Path extends CurvePath {
  type = "Path";
  /** 当前偏移点：之后添加的曲线都从这里开始 */
  currentPoint;
  constructor(points) {
    super();
    this.currentPoint = new Vector2();
    if (points) {
      this.setFromPoints(points);
    }
  }
  /** 从点列表创建路径（每段作为 LineCurve） */
  setFromPoints(points) {
    this.moveTo(points[0].x, points[0].y);
    for (let i = 1, l = points.length; i < l; i++) {
      this.lineTo(points[i].x, points[i].y);
    }
    return this;
  }
  /** 将 currentPoint 移动到给定点 */
  moveTo(x, y) {
    this.currentPoint.set(x, y);
    return this;
  }
  /** 添加一条连接当前点与给定点的 LineCurve */
  lineTo(x, y) {
    const curve = new LineCurve(this.currentPoint.clone(), new Vector2(x, y));
    this.curves.push(curve);
    this.currentPoint.set(x, y);
    return this;
  }
  /** 添加一条连接当前点与给定点的 QuadraticBezierCurve */
  quadraticCurveTo(aCPx, aCPy, aX, aY) {
    const curve = new QuadraticBezierCurve(
      this.currentPoint.clone(),
      new Vector2(aCPx, aCPy),
      new Vector2(aX, aY)
    );
    this.curves.push(curve);
    this.currentPoint.set(aX, aY);
    return this;
  }
  /** 添加一条连接当前点与给定点的 CubicBezierCurve */
  bezierCurveTo(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY) {
    const curve = new CubicBezierCurve(
      this.currentPoint.clone(),
      new Vector2(aCP1x, aCP1y),
      new Vector2(aCP2x, aCP2y),
      new Vector2(aX, aY)
    );
    this.curves.push(curve);
    this.currentPoint.set(aX, aY);
    return this;
  }
  /** 添加一条经过给定点列表的 SplineCurve（起点为当前点） */
  splineThru(pts) {
    const npts = [this.currentPoint.clone()].concat(pts);
    const curve = new SplineCurve(npts);
    this.curves.push(curve);
    this.currentPoint.copy(pts[pts.length - 1]);
    return this;
  }
  arcTo(x0, y0, x, y, radius) {
    const curve = new ArcToCurve(this.currentPoint.clone(), Vector2.create(x0, y0), Vector2.create(x, y), radius);
    this.curves.push(curve);
    this.currentPoint.set(x, y);
    return this;
  }
  /** 添加一条相对当前点的圆弧（作为 EllipseCurve） */
  arc(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
    const x0 = this.currentPoint.x;
    const y0 = this.currentPoint.y;
    this.absarc(aX + x0, aY + y0, aRadius, aStartAngle, aEndAngle, aClockwise);
    return this;
  }
  /** 添加一条绝对定位的圆弧（作为 EllipseCurve） */
  absarc(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
    this.absellipse(aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise, 0);
    return this;
  }
  /** 添加一条相对当前点的椭圆（作为 EllipseCurve） */
  ellipse(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
    const x0 = this.currentPoint.x;
    const y0 = this.currentPoint.y;
    this.absellipse(aX + x0, aY + y0, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation);
    return this;
  }
  /** 添加一条绝对定位的椭圆（作为 EllipseCurve） */
  absellipse(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
    const curve = new EllipseCurve(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation);
    if (this.curves.length > 0) {
      const firstPoint = curve.getPoint(0);
      if (!firstPoint.equals(this.currentPoint)) {
        this.lineTo(firstPoint.x, firstPoint.y);
      }
    }
    this.curves.push(curve);
    const lastPoint = curve.getPoint(1);
    this.currentPoint.copy(lastPoint);
    return this;
  }
  /**
   * 添加一个矩形子路径（Canvas 2D rect 语义，隐式闭合）。
   * @param x 左上角 X
   * @param y 左上角 Y
   * @param width 宽度
   * @param height 高度
   */
  rect(x, y, width, height) {
    this.moveTo(x, y);
    this.lineTo(x + width, y);
    this.lineTo(x + width, y + height);
    this.lineTo(x, y + height);
    this.lineTo(x, y);
    return this;
  }
  /**
   * 添加一个圆角矩形子路径（Canvas 2D roundRect 语义，隐式闭合）。
   * @param x 左上角 X
   * @param y 左上角 Y
   * @param w 宽度
   * @param h 高度
   * @param radii 圆角半径，支持：
   *   - number: 四个角统一半径
   *   - [all]: 四角统一半径
   *   - [tl, br]: 左上/右下与右上/左下两两相同（CSS 2 值规则）
   *   - [tl, tr, br, bl]: 分别指定四个角
   */
  roundRect(x, y, w, h, radii) {
    let r = 0, r2 = 0, r3 = 0, r4 = 0;
    if (radii === void 0 || radii === 0) {
      return this.rect(x, y, w, h);
    }
    if (typeof radii === "number") {
      r = r2 = r3 = r4 = radii;
    } else {
      const arr = radii;
      const len = arr.length;
      if (len === 0) {
        return this.rect(x, y, w, h);
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
    const hScale = w > 0 ? Math.min(1, w / (r + r2), w / (r4 + r3)) : 0;
    const vScale = h > 0 ? Math.min(1, h / (r + r4), h / (r2 + r3)) : 0;
    const scale = Math.min(hScale, vScale);
    if (scale < 1) {
      r *= scale;
      r2 *= scale;
      r3 *= scale;
      r4 *= scale;
    }
    this.moveTo(x + r, y);
    this.lineTo(x + w - r2, y);
    if (r2 > 0) {
      this.curves.push(new EllipseCurve(x + w - r2, y + r2, r2, r2, -Math.PI / 2, 0, false, 0));
      this.currentPoint.set(x + w, y + r2);
    }
    this.lineTo(x + w, y + h - r3);
    if (r3 > 0) {
      this.curves.push(new EllipseCurve(x + w - r3, y + h - r3, r3, r3, 0, Math.PI / 2, false, 0));
      this.currentPoint.set(x + w - r3, y + h);
    }
    this.lineTo(x + r4, y + h);
    if (r4 > 0) {
      this.curves.push(new EllipseCurve(x + r4, y + h - r4, r4, r4, Math.PI / 2, Math.PI, false, 0));
      this.currentPoint.set(x, y + h - r4);
    }
    this.lineTo(x, y + r);
    if (r > 0) {
      this.curves.push(new EllipseCurve(x + r, y + r, r, r, Math.PI, -Math.PI / 2, false, 0));
      this.currentPoint.set(x + r, y);
    }
    return this;
  }
  copy(source) {
    super.copy(source);
    this.currentPoint.copy(source.currentPoint);
    return this;
  }
  toJSON() {
    const data = super.toJSON();
    data.currentPoint = this.currentPoint.toArray();
    return data;
  }
  fromJSON(json) {
    super.fromJSON(json);
    this.currentPoint.copy(Vector2.fromArray(json.currentPoint ?? [0, 0]));
    return this;
  }
}
export {
  Path
};
