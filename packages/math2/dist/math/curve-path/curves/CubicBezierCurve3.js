import { Vector3 } from "../../Vector3.js";
import { Curve } from "../Curve.js";
import { CubicBezier } from "../Interpolations.js";
class CubicBezierCurve3 extends Curve {
  isCubicBezierCurve3 = true;
  type = "CubicBezierCurve3";
  /** 起点 */
  v0;
  /** 控制点 1 */
  v1;
  /** 控制点 2 */
  v2;
  /** 终点 */
  v3;
  constructor(v0 = new Vector3(), v1 = new Vector3(), v2 = new Vector3(), v3 = new Vector3()) {
    super();
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
  }
  getPoint(t, optionalTarget = new Vector3()) {
    const point = optionalTarget;
    const v0 = this.v0, v1 = this.v1, v2 = this.v2, v3 = this.v3;
    point.set(
      CubicBezier(t, v0.x, v1.x, v2.x, v3.x),
      CubicBezier(t, v0.y, v1.y, v2.y, v3.y),
      CubicBezier(t, v0.z, v1.z, v2.z, v3.z)
    );
    return point;
  }
  copy(source) {
    super.copy(source);
    this.v0.copy(source.v0);
    this.v1.copy(source.v1);
    this.v2.copy(source.v2);
    this.v3.copy(source.v3);
    return this;
  }
  toJSON() {
    const data = super.toJSON();
    data.v0 = this.v0.toArray();
    data.v1 = this.v1.toArray();
    data.v2 = this.v2.toArray();
    data.v3 = this.v3.toArray();
    return data;
  }
  fromJSON(json) {
    super.fromJSON(json);
    this.v0.copy(Vector3.fromArray(json.v0));
    this.v1.copy(Vector3.fromArray(json.v1));
    this.v2.copy(Vector3.fromArray(json.v2));
    this.v3.copy(Vector3.fromArray(json.v3));
    return this;
  }
}
export {
  CubicBezierCurve3
};
