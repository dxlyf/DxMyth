import { EPSILON } from "./MathUtils.js";
import { Matrix3 } from "./Matrix3.js";
import { Vector3 } from "./Vector3.js";
class Plane {
  normal;
  constant;
  constructor(normal = new Vector3(0, 1, 0), constant = 0) {
    this.normal = normal;
    this.constant = constant;
  }
  set(normal, constant) {
    this.normal.copy(normal);
    this.constant = constant;
    return this;
  }
  setComponents(x, y, z, constant) {
    this.normal.set(x, y, z);
    this.constant = constant;
    return this;
  }
  setFromNormalAndCoplanarPoint(normal, point) {
    this.normal.copy(normal).normalize();
    this.constant = -point.dot(this.normal);
    return this;
  }
  setFromCoplanarPoints(a, b, c) {
    const cb = Vector3.pool.get().subtractVectors(c, b);
    const ab = Vector3.pool.get().subtractVectors(a, b);
    this.normal.crossVectors(cb, ab).normalize();
    this.constant = -a.dot(this.normal);
    Vector3.pool.releaseAll();
    return this;
  }
  copy(plane) {
    return this.set(plane.normal, plane.constant);
  }
  clone() {
    return new Plane(this.normal.clone(), this.constant);
  }
  normalize() {
    const len = this.normal.magnitude();
    if (len > EPSILON) {
      const inv = 1 / len;
      this.normal.multiplyScalar(inv);
      this.constant *= inv;
    }
    return this;
  }
  negate() {
    this.normal.negate();
    this.constant = -this.constant;
    return this;
  }
  distanceToPoint(point) {
    return this.normal.dot(point) + this.constant;
  }
  distanceToSphere(sphere) {
    return this.distanceToPoint(sphere.center) - sphere.radius;
  }
  projectPoint(point, out = new Vector3()) {
    return out.copy(point).addScaled(this.normal, -this.distanceToPoint(point));
  }
  coplanarPoint(out = new Vector3()) {
    return out.copy(this.normal).multiplyScalar(-this.constant);
  }
  translate(offset) {
    this.constant -= offset.dot(this.normal);
    return this;
  }
  applyMatrix4(m, normalMatrix) {
    const point = this.coplanarPoint(new Vector3()).applyMatrix4(m);
    const nm = normalMatrix ?? new Matrix3().getNormalMatrix(m);
    this.normal.applyMatrix3(nm).normalize();
    this.constant = -point.dot(this.normal);
    return this;
  }
  equals(plane, epsilon = EPSILON) {
    return this.normal.equalsEpsilon(plane.normal, epsilon) && Math.abs(this.constant - plane.constant) <= epsilon;
  }
}
export {
  Plane
};
