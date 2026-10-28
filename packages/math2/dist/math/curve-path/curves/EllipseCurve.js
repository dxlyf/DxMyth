import { normalizeAngles } from "../../Arc.js";
import { Vector2 } from "../../Vector2.js";
import { Curve } from "../Curve.js";
class EllipseCurve extends Curve {
  isEllipseCurve = true;
  type = "EllipseCurve";
  /** 椭圆中心 X */
  aX;
  /** 椭圆中心 Y */
  aY;
  /** X 方向半径 */
  xRadius;
  /** Y 方向半径 */
  yRadius;
  /** 起始角（弧度，从正 X 轴起） */
  aStartAngle;
  /** 结束角（弧度，从正 X 轴起） */
  aEndAngle;
  /** 是否顺时针绘制 */
  aClockwise;
  /** 椭圆旋转角（弧度，逆时针，相对正 X 轴） */
  aRotation;
  constructor(aX = 0, aY = 0, xRadius = 1, yRadius = 1, aStartAngle = 0, aEndAngle = Math.PI * 2, aClockwise = false, aRotation = 0) {
    super();
    this.aX = aX;
    this.aY = aY;
    this.xRadius = xRadius;
    this.yRadius = yRadius;
    this.aStartAngle = aStartAngle;
    this.aEndAngle = aEndAngle;
    this.aClockwise = aClockwise;
    this.aRotation = aRotation;
  }
  getPoint(t, optionalTarget = new Vector2()) {
    const point = optionalTarget;
    const { startAngle, endAngle } = normalizeAngles(this.aStartAngle, this.aEndAngle, this.aClockwise);
    let deltaAngle = endAngle - startAngle;
    const angle = this.aStartAngle + t * deltaAngle;
    let x = this.aX + this.xRadius * Math.cos(angle);
    let y = this.aY + this.yRadius * Math.sin(angle);
    if (this.aRotation !== 0) {
      const cos = Math.cos(this.aRotation);
      const sin = Math.sin(this.aRotation);
      const tx = x - this.aX;
      const ty = y - this.aY;
      x = tx * cos - ty * sin + this.aX;
      y = tx * sin + ty * cos + this.aY;
    }
    return point.set(x, y);
  }
  /** 椭圆是曲线，加倍细分以获得更平滑的采样 */
  getResolution(divisions) {
    return divisions * 2;
  }
  copy(source) {
    super.copy(source);
    this.aX = source.aX;
    this.aY = source.aY;
    this.xRadius = source.xRadius;
    this.yRadius = source.yRadius;
    this.aStartAngle = source.aStartAngle;
    this.aEndAngle = source.aEndAngle;
    this.aClockwise = source.aClockwise;
    this.aRotation = source.aRotation;
    return this;
  }
  toJSON() {
    const data = super.toJSON();
    data.aX = this.aX;
    data.aY = this.aY;
    data.xRadius = this.xRadius;
    data.yRadius = this.yRadius;
    data.aStartAngle = this.aStartAngle;
    data.aEndAngle = this.aEndAngle;
    data.aClockwise = this.aClockwise;
    data.aRotation = this.aRotation;
    return data;
  }
  fromJSON(json) {
    super.fromJSON(json);
    this.aX = json.aX;
    this.aY = json.aY;
    this.xRadius = json.xRadius;
    this.yRadius = json.yRadius;
    this.aStartAngle = json.aStartAngle;
    this.aEndAngle = json.aEndAngle;
    this.aClockwise = json.aClockwise;
    this.aRotation = json.aRotation;
    return this;
  }
}
export {
  EllipseCurve
};
