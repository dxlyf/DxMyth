import { Vector2 } from "../../Vector2.js";
import { degToRad } from "../../MathUtils.js";
import { createVector } from "./vectors.js";
class StrokeProjectionsBase {
  constructor(options) {
    this.options = options;
    this.strokeProjectionMagnitude = this.options.strokeWidth / 2;
    this.scale = new Vector2(this.options.scaleX, this.options.scaleY);
    this.strokeUniformScalar = this.options.strokeUniform ? new Vector2(1 / this.options.scaleX, 1 / this.options.scaleY) : new Vector2(1, 1);
  }
  /**
   * When the stroke is uniform, scaling affects the arrangement of points. So we must take it into account.
   */
  createSideVector(from, to) {
    const v = createVector(from, to);
    return this.options.strokeUniform ? v.multiply(this.scale) : v;
  }
  projectOrthogonally(from, to, magnitude) {
    return this.applySkew(
      from.add(this.calcOrthogonalProjection(from, to, magnitude))
    );
  }
  isSkewed() {
    return this.options.skewX !== 0 || this.options.skewY !== 0;
  }
  applySkew(point) {
    const p = Vector2.from(point);
    p.y += p.x * Math.tan(degToRad(this.options.skewY));
    p.x += p.y * Math.tan(degToRad(this.options.skewX));
    return p;
  }
  scaleUnitVector(unitVector, scalar) {
    return unitVector.multiply(this.strokeUniformScalar).multiplyScalar(scalar);
  }
}
export {
  StrokeProjectionsBase
};
