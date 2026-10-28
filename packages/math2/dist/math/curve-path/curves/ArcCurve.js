import { EllipseCurve } from "./EllipseCurve.js";
class ArcCurve extends EllipseCurve {
  isArcCurve = true;
  type = "ArcCurve";
  constructor(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
    super(aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise);
  }
}
export {
  ArcCurve
};
