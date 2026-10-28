import { Vector2 } from "../../Vector2.js";
const unitVectorX = new Vector2(1, 0);
const zero = new Vector2(0, 0);
const rotateVector = (vector, radians) => vector.rotate(radians);
const createVector = (from, to) => Vector2.from(to).subtract(from);
const magnitude = (point) => point.distanceTo(zero);
const calcAngleBetweenVectors = (a, b) => Math.atan2(crossProduct(a, b), dotProduct(a, b));
const calcVectorRotation = (v) => calcAngleBetweenVectors(unitVectorX, v);
const getUnitVector = (v) => v.equals(zero) ? v : v.divideScalar(magnitude(v));
const getOrthonormalVector = (v, counterClockwise = true) => getUnitVector(new Vector2(-v.y, v.x).multiplyScalar(counterClockwise ? 1 : -1));
const crossProduct = (a, b) => a.x * b.y - a.y * b.x;
const dotProduct = (a, b) => a.x * b.x + a.y * b.y;
const isBetweenVectors = (t, a, b) => {
  if (t.equals(a) || t.equals(b)) return true;
  const AxB = crossProduct(a, b), AxT = crossProduct(a, t), BxT = crossProduct(b, t);
  return AxB >= 0 ? AxT >= 0 && BxT <= 0 : !(AxT <= 0 && BxT >= 0);
};
export {
  calcAngleBetweenVectors,
  calcVectorRotation,
  createVector,
  crossProduct,
  dotProduct,
  getOrthonormalVector,
  getUnitVector,
  isBetweenVectors,
  magnitude,
  rotateVector
};
