import { EPSILON } from "./MathUtils.js";
import { Sphere } from "./Sphere.js";
import { Vector3 } from "./Vector3.js";
class Box3 {
  min;
  max;
  constructor(min = Vector3.create(Infinity, Infinity, Infinity), max = Vector3.create(-Infinity, -Infinity, -Infinity)) {
    this.min = min;
    this.max = max;
  }
  set(min, max) {
    this.min.copy(min);
    this.max.copy(max);
    return this;
  }
  setFromCenterAndSize(center, size) {
    const halfX = size.x / 2;
    const halfY = size.y / 2;
    const halfZ = size.z / 2;
    this.min.set(center.x - halfX, center.y - halfY, center.z - halfZ);
    this.max.set(center.x + halfX, center.y + halfY, center.z + halfZ);
    return this;
  }
  makeEmpty() {
    this.min.set(Infinity, Infinity, Infinity);
    this.max.set(-Infinity, -Infinity, -Infinity);
    return this;
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  copy(box) {
    return this.set(box.min, box.max);
  }
  clone() {
    return new Box3(this.min.clone(), this.max.clone());
  }
  setFromPoints(points) {
    this.makeEmpty();
    for (const p of points) this.expandByPoint(p);
    return this;
  }
  getCenter(out = new Vector3()) {
    return this.isEmpty() ? out.set(0, 0, 0) : out.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(out = new Vector3()) {
    return this.isEmpty() ? out.set(0, 0, 0) : out.subtractVectors(this.max, this.min);
  }
  getBoundingSphere(out = new Sphere()) {
    const center = this.getCenter();
    const radius = this.isEmpty() ? 0 : this.max.distanceTo(this.min) / 2;
    out.center.copy(center);
    out.radius = radius;
    return out;
  }
  expandByPoint(p) {
    this.min.set(Math.min(this.min.x, p.x), Math.min(this.min.y, p.y), Math.min(this.min.z, p.z));
    this.max.set(Math.max(this.max.x, p.x), Math.max(this.max.y, p.y), Math.max(this.max.z, p.z));
    return this;
  }
  expandByScalar(s) {
    this.min.x -= s;
    this.min.y -= s;
    this.min.z -= s;
    this.max.x += s;
    this.max.y += s;
    this.max.z += s;
    return this;
  }
  expandByBox(box) {
    this.min.x = Math.min(this.min.x, box.min.x);
    this.min.y = Math.min(this.min.y, box.min.y);
    this.min.z = Math.min(this.min.z, box.min.z);
    this.max.x = Math.max(this.max.x, box.max.x);
    this.max.y = Math.max(this.max.y, box.max.y);
    this.max.z = Math.max(this.max.z, box.max.z);
    return this;
  }
  containsPoint(p) {
    return p.x >= this.min.x && p.x <= this.max.x && p.y >= this.min.y && p.y <= this.max.y && p.z >= this.min.z && p.z <= this.max.z;
  }
  containsBox(box) {
    return this.min.x <= box.min.x && box.max.x <= this.max.x && this.min.y <= box.min.y && box.max.y <= this.max.y && this.min.z <= box.min.z && box.max.z <= this.max.z;
  }
  intersectsBox(box) {
    return !(box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z);
  }
  intersectsSphere(sphere) {
    return this.distanceToPoint(sphere.center) <= sphere.radius;
  }
  distanceToPoint(p) {
    const dx = Math.max(this.min.x - p.x, 0, p.x - this.max.x);
    const dy = Math.max(this.min.y - p.y, 0, p.y - this.max.y);
    const dz = Math.max(this.min.z - p.z, 0, p.z - this.max.z);
    return Math.hypot(dx, dy, dz);
  }
  clampPoint(p, out = new Vector3()) {
    return out.set(
      Math.min(Math.max(p.x, this.min.x), this.max.x),
      Math.min(Math.max(p.y, this.min.y), this.max.y),
      Math.min(Math.max(p.z, this.min.z), this.max.z)
    );
  }
  union(box) {
    return this.expandByBox(box);
  }
  intersection(box) {
    this.min.x = Math.max(this.min.x, box.min.x);
    this.min.y = Math.max(this.min.y, box.min.y);
    this.min.z = Math.max(this.min.z, box.min.z);
    this.max.x = Math.min(this.max.x, box.max.x);
    this.max.y = Math.min(this.max.y, box.max.y);
    this.max.z = Math.min(this.max.z, box.max.z);
    return this;
  }
  applyMatrix4(m) {
    if (this.isEmpty()) return this;
    const points = [
      new Vector3(this.min.x, this.min.y, this.min.z),
      new Vector3(this.min.x, this.min.y, this.max.z),
      new Vector3(this.min.x, this.max.y, this.min.z),
      new Vector3(this.min.x, this.max.y, this.max.z),
      new Vector3(this.max.x, this.min.y, this.min.z),
      new Vector3(this.max.x, this.min.y, this.max.z),
      new Vector3(this.max.x, this.max.y, this.min.z),
      new Vector3(this.max.x, this.max.y, this.max.z)
    ];
    this.makeEmpty();
    for (const p of points) this.expandByPoint(p.applyMatrix4(m));
    return this;
  }
  translate(offset) {
    this.min.add(offset);
    this.max.add(offset);
    return this;
  }
  equals(box, epsilon = EPSILON) {
    return this.min.equalsEpsilon(box.min, epsilon) && this.max.equalsEpsilon(box.max, epsilon);
  }
  static EMPTY = Object.freeze(new Box3());
}
export {
  Box3
};
