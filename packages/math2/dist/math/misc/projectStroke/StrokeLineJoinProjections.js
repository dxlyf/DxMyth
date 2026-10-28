import { Vector2 } from "../../Vector2.js";
import { degToRad } from "../../MathUtils.js";
import { calcAngleBetweenVectors, calcVectorRotation, getUnitVector, rotateVector, getOrthonormalVector, magnitude, isBetweenVectors, crossProduct } from "./vectors.js";
import { StrokeProjectionsBase } from "./StrokeProjectionsBase.js";
const halfPI = Math.PI / 2;
const twoMathPi = Math.PI * 2;
const zeroVector = new Vector2(0, 0);
class StrokeLineJoinProjections extends StrokeProjectionsBase {
  /**
   * The AB vector
   */
  AB;
  /**
   * The AC vector
   */
  AC;
  /**
   * The angle of A (∠BAC)
   */
  alpha;
  /**
   * The bisector of A (∠BAC)
   */
  bisector;
  static getOrthogonalRotationFactor(vector1, vector2) {
    const angle = vector2 ? calcAngleBetweenVectors(vector1, vector2) : calcVectorRotation(vector1);
    return Math.abs(angle) < halfPI ? -1 : 1;
  }
  constructor(A, B, C, options) {
    super(options);
    this.A = Vector2.from(A);
    this.B = Vector2.from(B);
    this.C = Vector2.from(C);
    this.AB = this.createSideVector(this.A, this.B);
    this.AC = this.createSideVector(this.A, this.C);
    this.alpha = calcAngleBetweenVectors(this.AB, this.AC);
    this.bisector = getUnitVector(
      // if AC is also the zero vector nothing will be projected
      // in that case the next point will handle the projection
      rotateVector(this.AB.equals(zeroVector) ? this.AC : this.AB, this.alpha / 2)
    );
  }
  calcOrthogonalProjection(from, to, magnitude2 = this.strokeProjectionMagnitude) {
    const vector = this.createSideVector(from, to);
    const orthogonalProjection = getOrthonormalVector(vector);
    const correctSide = StrokeLineJoinProjections.getOrthogonalRotationFactor(
      orthogonalProjection,
      this.bisector
    );
    return this.scaleUnitVector(orthogonalProjection, magnitude2 * correctSide);
  }
  /**
   * BEVEL
   * Calculation: the projection points are formed by the vector orthogonal to the vertex.
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-2-bevel
   */
  projectBevel() {
    const projections = [];
    (this.alpha % twoMathPi === 0 ? [this.B] : [this.B, this.C]).forEach(
      (to) => {
        projections.push(this.projectOrthogonally(this.A, to));
        projections.push(
          this.projectOrthogonally(this.A, to, -this.strokeProjectionMagnitude)
        );
      }
    );
    return projections;
  }
  /**
   * MITER
   * Calculation: the corner is formed by extending the outer edges of the stroke
   * at the tangents of the path segments until they intersect.
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-1-miter
   */
  projectMiter() {
    const projections = [], alpha = Math.abs(this.alpha), hypotUnitScalar = 1 / Math.sin(alpha / 2), miterVector = this.scaleUnitVector(
      this.bisector,
      -this.strokeProjectionMagnitude * hypotUnitScalar
    );
    const strokeMiterLimit = this.options.strokeUniform ? magnitude(
      this.scaleUnitVector(this.bisector, this.options.strokeMiterLimit)
    ) : this.options.strokeMiterLimit;
    if (magnitude(miterVector) / this.strokeProjectionMagnitude <= strokeMiterLimit) {
      projections.push(this.applySkew(this.A.add(miterVector)));
    }
    projections.push(...this.projectBevel());
    return projections;
  }
  /**
   * ROUND (without skew)
   * Calculation: the projections are the two vectors parallel to X and Y axes
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-3-1-round-without-skew
   */
  projectRoundNoSkew(startCircle, endCircle) {
    const projections = [], correctSide = new Vector2(
      StrokeLineJoinProjections.getOrthogonalRotationFactor(this.bisector),
      StrokeLineJoinProjections.getOrthogonalRotationFactor(
        new Vector2(this.bisector.y, this.bisector.x)
      )
    ), radiusOnAxisX = new Vector2(1, 0).multiplyScalar(this.strokeProjectionMagnitude).multiply(this.strokeUniformScalar).multiply(correctSide), radiusOnAxisY = new Vector2(0, 1).multiplyScalar(this.strokeProjectionMagnitude).multiply(this.strokeUniformScalar).multiply(correctSide);
    [radiusOnAxisX, radiusOnAxisY].forEach((vector) => {
      if (isBetweenVectors(vector, startCircle, endCircle)) {
        projections.push(this.A.add(vector));
      }
    });
    return projections;
  }
  /**
   * ROUND (with skew)
   * Calculation: the projections are the points furthest from the vertex in
   * the direction of the X and Y axes after distortion.
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-3-2-round-skew
   */
  projectRoundWithSkew(startCircle, endCircle) {
    const projections = [];
    const { skewX, skewY, scaleX, scaleY, strokeUniform } = this.options, shearing = new Vector2(
      Math.tan(degToRad(skewX)),
      Math.tan(degToRad(skewY))
    );
    const circleRadius = this.strokeProjectionMagnitude, newY = strokeUniform ? circleRadius / scaleY / Math.sqrt(1 / scaleY ** 2 + 1 / scaleX ** 2 * shearing.y ** 2) : circleRadius / Math.sqrt(1 + shearing.y ** 2), furthestY = new Vector2(
      // Safe guard due to floating point precision. In some situations the square root
      // was returning NaN because of a negative number close to zero.
      Math.sqrt(Math.max(circleRadius ** 2 - newY ** 2, 0)),
      newY
    ), newX = strokeUniform ? circleRadius / Math.sqrt(
      1 + shearing.x ** 2 * (1 / scaleY) ** 2 / (1 / scaleX + 1 / scaleX * shearing.x * shearing.y) ** 2
    ) : circleRadius / Math.sqrt(1 + shearing.x ** 2 / (1 + shearing.x * shearing.y) ** 2), furthestX = new Vector2(
      newX,
      Math.sqrt(Math.max(circleRadius ** 2 - newX ** 2, 0))
    );
    [
      furthestX,
      furthestX.multiplyScalar(-1),
      furthestY,
      furthestY.multiplyScalar(-1)
    ].map(
      (vector) => this.applySkew(
        strokeUniform ? vector.multiply(this.strokeUniformScalar) : vector
      )
    ).forEach((vector) => {
      if (isBetweenVectors(vector, startCircle, endCircle)) {
        projections.push(this.applySkew(this.A).add(vector));
      }
    });
    return projections;
  }
  projectRound() {
    const projections = [];
    projections.push(...this.projectBevel());
    const isStraightLine = this.alpha % twoMathPi === 0, newOrigin = this.applySkew(this.A), proj0 = projections[isStraightLine ? 0 : 2].subtract(newOrigin), proj1 = projections[isStraightLine ? 1 : 0].subtract(newOrigin), comparisonVector = isStraightLine ? this.applySkew(this.AB.multiplyScalar(-1)) : this.applySkew(
      this.bisector.multiply(this.strokeUniformScalar).multiplyScalar(-1)
    ), isProj0Start = crossProduct(proj0, comparisonVector) > 0, startCircle = isProj0Start ? proj0 : proj1, endCircle = isProj0Start ? proj1 : proj0;
    if (!this.isSkewed()) {
      projections.push(...this.projectRoundNoSkew(startCircle, endCircle));
    } else {
      projections.push(...this.projectRoundWithSkew(startCircle, endCircle));
    }
    return projections;
  }
  /**
   * Project stroke width on points returning projections for each point as follows:
   * - `miter`: 1 point corresponding to the outer boundary. If the miter limit is exceeded, it will be 2 points (becomes bevel)
   * - `bevel`: 2 points corresponding to the bevel possible boundaries, orthogonal to the stroke.
   * - `round`: same as `bevel` when it has no skew, with skew are 4 points.
   */
  projectPoints() {
    switch (this.options.strokeLineJoin) {
      case "miter":
        return this.projectMiter();
      case "round":
        return this.projectRound();
      default:
        return this.projectBevel();
    }
  }
  project() {
    return this.projectPoints().map((point) => ({
      originPoint: this.A,
      projectedPoint: point,
      angle: this.alpha,
      bisector: this.bisector
    }));
  }
}
export {
  StrokeLineJoinProjections
};
