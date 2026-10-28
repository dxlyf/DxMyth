import { Curve, pointEquals, isVector2Point } from "./Curve.js";
import { LineCurve } from "./curves/LineCurve.js";
import { LineCurve3 } from "./curves/LineCurve3.js";
import { SplineCurve } from "./curves/SplineCurve.js";
import { QuadraticBezierCurve3 } from "./curves/QuadraticBezierCurve3.js";
import { QuadraticBezierCurve } from "./curves/QuadraticBezierCurve.js";
import { EllipseCurve } from "./curves/EllipseCurve.js";
import { CubicBezierCurve3 } from "./curves/CubicBezierCurve3.js";
import { CubicBezierCurve } from "./curves/CubicBezierCurve.js";
import { CatmullRomCurve3 } from "./curves/CatmullRomCurve3.js";
import { ArcCurve } from "./curves/ArcCurve.js";
const curveRegistry = {
  ArcCurve,
  CatmullRomCurve3,
  CubicBezierCurve,
  CubicBezierCurve3,
  EllipseCurve,
  LineCurve,
  LineCurve3,
  QuadraticBezierCurve,
  QuadraticBezierCurve3,
  SplineCurve
};
class CurvePath extends Curve {
  type = "CurvePath";
  /** 定义路径的曲线数组 */
  curves = [];
  /** 是否自动用一条直线曲线闭合路径 */
  autoClose = false;
  /** 各子曲线累计长度缓存 */
  cacheLengths = null;
  /** 添加一条曲线到路径 */
  add(curve) {
    this.curves.push(curve);
  }
  /**
   * 若起点与终点未连接，则添加一条直线曲线闭合路径。
   * @return 当前路径
   */
  closePath() {
    const startPoint = this.curves[0].getPoint(0);
    const endPoint = this.curves[this.curves.length - 1].getPoint(1);
    if (!pointEquals(startPoint, endPoint)) {
      if (isVector2Point(startPoint)) {
        this.curves.push(new LineCurve(endPoint, startPoint));
      } else {
        this.curves.push(new LineCurve3(endPoint, startPoint));
      }
    }
    return this;
  }
  /**
   * 返回参数 t 处的点：先按整条路径弧长定位子曲线，再在子曲线上取点。
   */
  getPoint(t, optionalTarget) {
    const d = t * this.getLength();
    const curveLengths = this.getCurveLengths();
    let i = 0;
    while (i < curveLengths.length) {
      if (curveLengths[i] >= d) {
        const diff = curveLengths[i] - d;
        const curve = this.curves[i];
        const segmentLength = curve.getLength();
        const u = segmentLength === 0 ? 0 : 1 - diff / segmentLength;
        return curve.getPointAt(u, optionalTarget);
      }
      i++;
    }
    return null;
  }
  getLength() {
    const lens = this.getCurveLengths();
    return lens[lens.length - 1];
  }
  updateArcLengths() {
    this.needsUpdate = true;
    this.cacheLengths = null;
    this.getCurveLengths();
  }
  /** 返回各子曲线累计长度的数组 */
  getCurveLengths() {
    if (this.cacheLengths && this.cacheLengths.length === this.curves.length) {
      return this.cacheLengths;
    }
    const lengths = [];
    let sums = 0;
    for (let i = 0, l = this.curves.length; i < l; i++) {
      sums += this.curves[i].getLength();
      lengths.push(sums);
    }
    this.cacheLengths = lengths;
    return lengths;
  }
  getSpacedPoints(divisions = 40) {
    const points = [];
    for (let i = 0; i <= divisions; i++) {
      points.push(this.getPoint(i / divisions));
    }
    if (this.autoClose) {
      points.push(points[0]);
    }
    return points;
  }
  getPoints(divisions = 12) {
    const points = [];
    let last;
    for (let i = 0, curves = this.curves; i < curves.length; i++) {
      const curve = curves[i];
      const resolution = curve.getResolution(divisions);
      const pts = curve.getPoints(resolution);
      for (let j = 0; j < pts.length; j++) {
        const point = pts[j];
        if (last && pointEquals(last, point)) continue;
        points.push(point);
        last = point;
      }
    }
    if (this.autoClose && points.length > 1 && !pointEquals(points[points.length - 1], points[0])) {
      points.push(points[0]);
    }
    return points;
  }
  copy(source) {
    super.copy(source);
    this.curves = [];
    for (let i = 0, l = source.curves.length; i < l; i++) {
      this.curves.push(source.curves[i].clone());
    }
    this.autoClose = source.autoClose;
    return this;
  }
  toJSON() {
    const data = super.toJSON();
    data.autoClose = this.autoClose;
    data.curves = [];
    for (let i = 0, l = this.curves.length; i < l; i++) {
      data.curves.push(this.curves[i].toJSON());
    }
    return data;
  }
  fromJSON(json) {
    super.fromJSON(json);
    this.autoClose = json.autoClose ?? this.autoClose;
    this.curves = [];
    const list = json.curves ?? [];
    for (let i = 0, l = list.length; i < l; i++) {
      const curveJSON = list[i];
      const ctor = curveRegistry[curveJSON.type ?? ""];
      if (ctor) {
        this.curves.push(new ctor().fromJSON(curveJSON));
      }
    }
    return this;
  }
}
export {
  CurvePath
};
