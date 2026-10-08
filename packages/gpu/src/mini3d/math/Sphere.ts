import { Vector3 } from './Vector3';
import { Box3 } from './Box3';

/** Bounding sphere, used for frustum culling and ray intersection. */
export class Sphere {
  center: Vector3;
  radius: number;

  constructor(center: Vector3 = new Vector3(), radius = -1) {
    this.center = center;
    this.radius = radius;
  }

  set(center: Vector3, radius: number): this {
    this.center.copy(center);
    this.radius = radius;
    return this;
  }

  setFromPoints(points: Vector3[], optionalCenter?: Vector3): this {
    const center = optionalCenter ?? _box.setFromPoints(points).getCenter(this.center);
    if (optionalCenter) this.center.copy(optionalCenter);
    else this.center.copy(center);

    let maxRadiusSq = 0;
    for (const p of points) {
      maxRadiusSq = Math.max(maxRadiusSq, this.center.distanceToSquared(p));
    }
    this.radius = Math.sqrt(maxRadiusSq);
    return this;
  }

  copy(sphere: Sphere): this {
    this.center.copy(sphere.center);
    this.radius = sphere.radius;
    return this;
  }

  clone(): Sphere {
    return new Sphere(this.center.clone(), this.radius);
  }

  isEmpty(): boolean {
    return this.radius < 0;
  }

  makeEmpty(): this {
    this.center.set(0, 0, 0);
    this.radius = -1;
    return this;
  }

  containsPoint(point: Vector3): boolean {
    return point.distanceToSquared(this.center) <= this.radius * this.radius;
  }

  distanceToPoint(point: Vector3): number {
    return point.distanceTo(this.center) - this.radius;
  }

  intersectsSphere(sphere: Sphere): boolean {
    const r = this.radius + sphere.radius;
    return sphere.center.distanceToSquared(this.center) <= r * r;
  }

  intersectsBox(box: Box3): boolean {
    return box.intersectsSphere(this);
  }

  intersectsPlane(plane: { distanceToPoint(p: Vector3): number }): boolean {
    return Math.abs(plane.distanceToPoint(this.center)) <= this.radius;
  }

  clampPoint(point: Vector3, target: Vector3 = new Vector3()): Vector3 {
    const deltaLengthSq = this.center.distanceToSquared(point);
    target.copy(point);
    if (deltaLengthSq > this.radius * this.radius) {
      target.sub(this.center).normalize();
      target.multiplyScalar(this.radius).add(this.center);
    }
    return target;
  }

  getBoundingBox(target: Box3 = new Box3()): Box3 {
    if (this.isEmpty()) return target.makeEmpty();
    target.set(this.center, this.center);
    target.expandByScalar(this.radius);
    return target;
  }

  /** Applies a 4x4 transform, rescaling by the largest basis-vector length. */
  applyMatrix4(matrix: { elements: ArrayLike<number> }): this {
    const e = matrix.elements;
    const sx = Math.hypot(e[0], e[1], e[2]);
    const sy = Math.hypot(e[4], e[5], e[6]);
    const sz = Math.hypot(e[8], e[9], e[10]);
    const scale = Math.max(sx, sy, sz);
    this.center.applyMatrix4(matrix);
    this.radius *= scale;
    return this;
  }

  translate(offset: Vector3): this {
    this.center.add(offset);
    return this;
  }

  expandByPoint(point: Vector3): this {
    if (this.isEmpty()) {
      this.center.copy(point);
      this.radius = 0;
      return this;
    }
    _v.subVectors(point, this.center);
    const lengthSq = _v.lengthSq();
    if (lengthSq > this.radius * this.radius) {
      const length = Math.sqrt(lengthSq);
      const shift = (length - this.radius) / 2;
      this.center.addScaledVector(_v, shift / length);
      this.radius += shift;
    }
    return this;
  }

  union(sphere: Sphere): this {
    if (sphere.isEmpty()) return this;
    if (this.isEmpty()) return this.copy(sphere);
    if (this.center.equals(sphere.center)) {
      this.radius = Math.max(this.radius, sphere.radius);
      return this;
    }
    _v2.subVectors(sphere.center, this.center);
    const dist = _v2.length();
    const r1 = this.radius;
    const r2 = sphere.radius;
    if (r1 >= dist + r2) return this;
    if (r2 >= dist + r1) return this.copy(sphere);
    const newRadius = (dist + r1 + r2) / 2;
    this.center.addScaledVector(_v2.normalize(), newRadius - r1);
    this.radius = newRadius;
    return this;
  }

  equals(sphere: Sphere): boolean {
    return this.center.equals(sphere.center) && this.radius === sphere.radius;
  }

  static fromPoints(points: Vector3[]): Sphere {
    return new Sphere().setFromPoints(points);
  }
}

const _box = new Box3();
const _v = new Vector3();
const _v2 = new Vector3();
