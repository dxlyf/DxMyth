import { EPSILON } from "./MathUtils.js";
import { Box3 } from "./Box3.js";
import { Vector3 } from "./Vector3.js";
class Sphere {
  center;
  radius;
  constructor(center = new Vector3(), radius = 0) {
    this.center = center;
    this.radius = radius;
  }
  set(center, radius) {
    this.center.copy(center);
    this.radius = radius;
    return this;
  }
  copy(sphere) {
    return this.set(sphere.center, sphere.radius);
  }
  clone() {
    return new Sphere(this.center.clone(), this.radius);
  }
  makeEmpty() {
    this.center.set(0, 0, 0);
    this.radius = -1;
    return this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  setFromPoints(points) {
    if (points.length === 0) return this.makeEmpty();
    const center = new Vector3();
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (const p of points) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      minZ = Math.min(minZ, p.z);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
      maxZ = Math.max(maxZ, p.z);
    }
    center.set((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
    let radiusSq = 0;
    for (const p of points) radiusSq = Math.max(radiusSq, center.distanceSquaredTo(p));
    this.center.copy(center);
    this.radius = Math.sqrt(radiusSq);
    return this;
  }
  applyMatrix4(m) {
    this.center.applyMatrix4(m);
    this.radius *= m.getMaxScaleOnAxis();
    return this;
  }
  translate(offset) {
    this.center.add(offset);
    return this;
  }
  containsPoint(p) {
    return p.distanceSquaredTo(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(p) {
    return this.center.distanceTo(p) - this.radius;
  }
  intersectsSphere(other) {
    const r = this.radius + other.radius;
    return this.center.distanceSquaredTo(other.center) <= r * r;
  }
  intersectsBox(box) {
    const cx = Math.min(Math.max(this.center.x, box.min.x), box.max.x);
    const cy = Math.min(Math.max(this.center.y, box.min.y), box.max.y);
    const cz = Math.min(Math.max(this.center.z, box.min.z), box.max.z);
    const dx = cx - this.center.x;
    const dy = cy - this.center.y;
    const dz = cz - this.center.z;
    return dx * dx + dy * dy + dz * dz <= this.radius * this.radius;
  }
  intersectsPlane(plane) {
    return Math.abs(plane.distanceToPoint(this.center)) <= this.radius;
  }
  getBoundingBox(out = new Box3()) {
    out.min.set(this.center.x - this.radius, this.center.y - this.radius, this.center.z - this.radius);
    out.max.set(this.center.x + this.radius, this.center.y + this.radius, this.center.z + this.radius);
    return out;
  }
  union(sphere) {
    if (this.isEmpty()) return this.copy(sphere);
    if (sphere.isEmpty()) return this;
    const r1 = this.radius;
    const r2 = sphere.radius;
    const distance = this.center.distanceTo(sphere.center);
    if (r1 >= distance + r2) return this;
    if (r2 >= distance + r1) return this.copy(sphere);
    if (distance > 0) {
      const newRadius = (distance + r1 + r2) / 2;
      const k = (newRadius - r1) / distance;
      this.center.lerp(sphere.center, k);
      this.radius = newRadius;
    }
    return this;
  }
  equals(sphere, epsilon = EPSILON) {
    return this.center.equalsEpsilon(sphere.center, epsilon) && Math.abs(this.radius - sphere.radius) <= epsilon;
  }
}
export {
  Sphere
};
