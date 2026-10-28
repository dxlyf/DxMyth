import { Vector2 } from "../../Vector2.js";
import { Curve } from "../Curve.js";
class LineCurve extends Curve {
  isLineCurve = true;
  type = "LineCurve";
  /** 起点 */
  v1;
  /** 终点 */
  v2;
  constructor(v1 = new Vector2(), v2 = new Vector2()) {
    super();
    this.v1 = v1;
    this.v2 = v2;
  }
  getPoint(t, optionalTarget = new Vector2()) {
    const point = optionalTarget;
    if (t === 1) {
      point.copy(this.v2);
    } else {
      point.copy(this.v2).subtract(this.v1);
      point.multiplyScalar(t).add(this.v1);
    }
    return point;
  }
  // 直线是线性的，可覆盖默认的 getPointAt
  getPointAt(u, optionalTarget) {
    return this.getPoint(u, optionalTarget);
  }
  /** 直线只需首尾两个点 */
  getResolution() {
    return 1;
  }
  getTangent(t, optionalTarget = new Vector2()) {
    return Vector2.subtract(optionalTarget, this.v2, this.v1).normalize();
  }
  getTangentAt(u, optionalTarget) {
    return this.getTangent(u, optionalTarget);
  }
  copy(source) {
    super.copy(source);
    this.v1.copy(source.v1);
    this.v2.copy(source.v2);
    return this;
  }
  toJSON() {
    const data = super.toJSON();
    data.v1 = this.v1.toArray();
    data.v2 = this.v2.toArray();
    return data;
  }
  fromJSON(json) {
    super.fromJSON(json);
    this.v1.copy(Vector2.fromArray(json.v1));
    this.v2.copy(Vector2.fromArray(json.v2));
    return this;
  }
}
export {
  LineCurve
};
