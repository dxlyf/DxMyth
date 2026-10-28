import { Vector2 } from "../../Vector2.js";
import { Curve } from "../Curve.js";
import { LineCurve } from "./LineCurve.js";
import { EllipseCurve } from "./EllipseCurve.js";
class ArcToCurve extends Curve {
  isArcToCurve = true;
  type = "ArcToCurve";
  /** 当前点（子路径起点） */
  v0;
  /** 角点（两条直线的交点，即 arcTo 的第一个控制点） */
  v1;
  /** 第二个控制点 */
  v2;
  /** 圆弧半径 */
  radius;
  /** 是否退化：退化为直线 v0→v1（此时 arcCurve 为 null） */
  degenerate = false;
  /** 直线段与圆弧的切点 T1（位于直线 v0→v1 上） */
  t1;
  /** 圆弧与另一条直线的切点 T2（位于直线 v1→v2 上） */
  t2;
  /** 圆弧圆心 */
  center;
  /** 圆弧起始角（弧度，相对圆心，从正 X 轴起） */
  startAngle = 0;
  /** 圆弧结束角（弧度，相对圆心，从正 X 轴起） */
  endAngle = 0;
  /** 圆弧方向：与 EllipseCurve 的 aClockwise 约定一致 */
  aClockwise = true;
  /** 直线段子曲线 v0→t1 */
  lineCurve;
  /** 圆弧子曲线 t1→t2（退化时为 null） */
  arcCurve = null;
  /** 直线长度占总长度比例，用于 getPoint 的弧长参数化 */
  _lineRatio = 0;
  constructor(v0 = new Vector2(), v1 = new Vector2(), v2 = new Vector2(), radius = 0) {
    super();
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.radius = radius;
    this.t1 = new Vector2();
    this.t2 = new Vector2();
    this.center = new Vector2();
    this.lineCurve = new LineCurve(v0.clone(), v1.clone());
    this._compute();
  }
  /** 根据 v0/v1/v2/radius 计算切点、圆心、起止角并构建两条子曲线 */
  _compute() {
    const { v0, v1, v2, radius } = this;
    const EPS = 1e-9;
    const aX = v0.x - v1.x;
    const aY = v0.y - v1.y;
    const bX = v2.x - v1.x;
    const bY = v2.y - v1.y;
    const lenA = Math.hypot(aX, aY);
    const lenB = Math.hypot(bX, bY);
    if (radius <= 0 || lenA < EPS || lenB < EPS) {
      this.degenerate = true;
      this.lineCurve.v1.copy(v1);
      this.arcCurve = null;
      this._lineRatio = 1;
      return;
    }
    const u1x = aX / lenA, u1y = aY / lenA;
    const u2x = bX / lenB, u2y = bY / lenB;
    const cosA = u1x * u2x + u1y * u2y;
    if (cosA >= 1 - EPS || cosA <= -1 + EPS) {
      this.degenerate = true;
      this.lineCurve.v1.copy(v1);
      this.arcCurve = null;
      this._lineRatio = 1;
      return;
    }
    const halfA = Math.acos(cosA) / 2;
    const d = radius / Math.tan(halfA);
    this.t1.set(v1.x + u1x * d, v1.y + u1y * d);
    this.t2.set(v1.x + u2x * d, v1.y + u2y * d);
    const bl = Math.hypot(u1x + u2x, u1y + u2y);
    const h = radius / Math.sin(halfA);
    this.center.set(
      v1.x + (u1x + u2x) / bl * h,
      v1.y + (u1y + u2y) / bl * h
    );
    this.startAngle = Math.atan2(this.t1.y - this.center.y, this.t1.x - this.center.x);
    this.endAngle = Math.atan2(this.t2.y - this.center.y, this.t2.x - this.center.x);
    let delta = this.endAngle - this.startAngle;
    if (delta > Math.PI) delta -= Math.PI * 2;
    else if (delta < -Math.PI) delta += Math.PI * 2;
    this.aClockwise = delta > 0;
    this.lineCurve.v1.copy(this.t1);
    this.arcCurve = new EllipseCurve(
      this.center.x,
      this.center.y,
      radius,
      radius,
      this.startAngle,
      this.endAngle,
      this.aClockwise,
      0
    );
    const lineLen = this.t1.distanceTo(v0);
    const arcLen = radius * Math.abs(delta);
    const total = lineLen + arcLen;
    this._lineRatio = total > EPS ? lineLen / total : 0;
  }
  /**
   * 返回曲线上参数 t 处的点。
   * 参数化与弧长成比例：t 小于 _lineRatio 时落在直线段 v0→t1，
   * 否则落在圆弧 t1→t2，保证匀速插值。
   */
  getPoint(t, optionalTarget = new Vector2()) {
    if (this.degenerate || !this.arcCurve) {
      return this.lineCurve.getPoint(t, optionalTarget);
    }
    if (this._lineRatio <= 0) {
      return this.arcCurve.getPoint(t, optionalTarget);
    }
    if (t <= this._lineRatio) {
      return this.lineCurve.getPoint(t / this._lineRatio, optionalTarget);
    }
    return this.arcCurve.getPoint((t - this._lineRatio) / (1 - this._lineRatio), optionalTarget);
  }
  /** 细分数量 = 直线段(1) + 圆弧(2×divisions) */
  getResolution(divisions) {
    return 1 + (this.arcCurve ? this.arcCurve.getResolution(divisions) : 0);
  }
  /** 解析切线：直线段为固定方向，圆弧用 EllipseCurve 的解析切线 */
  getTangent(t, optionalTarget = new Vector2()) {
    if (this.degenerate || !this.arcCurve) {
      return this.lineCurve.getTangent(t, optionalTarget);
    }
    if (this._lineRatio > 0 && t <= this._lineRatio) {
      return this.lineCurve.getTangent(t / this._lineRatio, optionalTarget);
    }
    const arcT = this._lineRatio <= 0 ? t : (t - this._lineRatio) / (1 - this._lineRatio);
    return this.arcCurve.getTangent(arcT, optionalTarget);
  }
  copy(source) {
    super.copy(source);
    this.v0.copy(source.v0);
    this.v1.copy(source.v1);
    this.v2.copy(source.v2);
    this.radius = source.radius;
    this._compute();
    return this;
  }
  toJSON() {
    const data = super.toJSON();
    data.v0 = this.v0.toArray();
    data.v1 = this.v1.toArray();
    data.v2 = this.v2.toArray();
    data.radius = this.radius;
    return data;
  }
  fromJSON(json) {
    super.fromJSON(json);
    this.v0.copy(Vector2.fromArray(json.v0));
    this.v1.copy(Vector2.fromArray(json.v1));
    this.v2.copy(Vector2.fromArray(json.v2));
    this.radius = json.radius;
    this._compute();
    return this;
  }
}
export {
  ArcToCurve
};
