import { EPSILON } from './MathUtils';
import type { Box3 } from './/Box3';
import type { Matrix4 } from './Matrix4';
import type { Plane } from './Plane';
import type { Sphere } from './Sphere';
import { Vector3 } from './Vector3';

const _edge1 = new Vector3();
const _edge2 = new Vector3();
const _pvec = new Vector3();
const _tvec = new Vector3();
const _qvec = new Vector3();

/** Ray with normalized direction. */
export class Ray {
  readonly origin: Vector3;
  readonly direction: Vector3;

  constructor(origin = new Vector3(), direction = new Vector3(0, 0, -1)) {
    this.origin = origin;
    this.direction = direction;
  }

  set(origin: Readonly<Vector3>, direction: Readonly<Vector3>): this {
    this.origin.copy(origin);
    this.direction.copy(direction).normalize();
    return this;
  }

  copy(ray: Readonly<Ray>): this {
    return this.set(ray.origin, ray.direction);
  }

  clone(): Ray {
    return new Ray(this.origin.clone(), this.direction.clone());
  }

  /** Point at distance `t` along the ray. */
  at(t: number, out = new Vector3()): Vector3 {
    return out.copy(this.direction).multiplyScalar(t).add(this.origin);
  }

  /** Make the ray point from its origin towards `target`. */
  lookAt(target: Readonly<Vector3>): this {
    this.direction.copy(target).subtract(this.origin).normalize();
    return this;
  }

  recast(t: number): this {
    this.origin.copy(this.at(t, new Vector3()));
    return this;
  }

  closestPointToPoint(point: Readonly<Vector3>, out = new Vector3()): Vector3 {
    const t = Math.max(0, new Vector3().subtractVectors(point, this.origin).dot(this.direction));
    return this.at(t, out);
  }

  distanceToPoint(point: Readonly<Vector3>): number {
    const t = Math.max(0, new Vector3().subtractVectors(point, this.origin).dot(this.direction));
    return this.at(t, new Vector3()).distanceTo(point);
  }

  distanceSqToPoint(point: Readonly<Vector3>): number {
    const d = this.distanceToPoint(point);
    return d * d;
  }

  intersectsSphere(sphere: Readonly<Sphere>): boolean {
    const d = this.distanceSqToPoint(sphere.center);
    return d <= sphere.radius * sphere.radius;
  }

  /** First intersection with a sphere, or null. */
  intersectSphere(sphere: Readonly<Sphere>, out = new Vector3()): Vector3 | null {
    const v = new Vector3().subtractVectors(sphere.center, this.origin);
    const tca = v.dot(this.direction);
    const d2 = v.dot(v) - tca * tca;
    const r2 = sphere.radius * sphere.radius;
    if (d2 > r2) return null;
    const thc = Math.sqrt(r2 - d2);
    let t = tca - thc;
    if (t < 0) t = tca + thc;
    if (t < 0) return null;
    return this.at(t, out);
  }

  intersectPlane(plane: Readonly<Plane>, out = new Vector3()): Vector3 | null {
    const denom = plane.normal.dot(this.direction);
    if (Math.abs(denom) < EPSILON) return null;
    const t = -(this.origin.dot(plane.normal) + plane.constant) / denom;
    if (t < 0) return null;
    return this.at(t, out);
  }

  /** Slab test; returns the entry point or null when the ray misses the box. */
  intersectBox(box: Readonly<Box3>, out = new Vector3()): Vector3 | null {
    let tmin = -Infinity;
    let tmax = Infinity;
    const { origin: o, direction: d } = this;
    const axes: Array<[number, number, number]> = [
      [o.x, d.x, box.min.x],
      [o.y, d.y, box.min.y],
      [o.z, d.z, box.min.z],
    ];
    const maxes = [box.max.x, box.max.y, box.max.z];
    for (let i = 0; i < 3; i++) {
      const [origin, direction, min] = axes[i]!;
      const max = maxes[i]!;
      if (Math.abs(direction) < EPSILON) {
        if (origin < min || origin > max) return null;
      } else {
        const inv = 1 / direction;
        let t1 = (min - origin) * inv;
        let t2 = (max - origin) * inv;
        if (t1 > t2) [t1, t2] = [t2, t1];
        tmin = Math.max(tmin, t1);
        tmax = Math.min(tmax, t2);
        if (tmin > tmax) return null;
      }
    }
    if (tmax < 0) return null;
    const t = tmin >= 0 ? tmin : tmax;
    if (t < 0) return null;
    return this.at(t, out);
  }

  /** Möller–Trumbore ray/triangle intersection. */
  intersectTriangle(
    a: Readonly<Vector3>,
    b: Readonly<Vector3>,
    c: Readonly<Vector3>,
    backfaceCulling = false,
    out = new Vector3(),
  ): Vector3 | null {
    _edge1.subtractVectors(b, a);
    _edge2.subtractVectors(c, a);
    _pvec.crossVectors(this.direction, _edge2);
    const det = _edge1.dot(_pvec);
    if (backfaceCulling ? det < EPSILON : Math.abs(det) < EPSILON) return null;
    const invDet = 1 / det;
    _tvec.subtractVectors(this.origin, a);
    const u = _tvec.dot(_pvec) * invDet;
    if (u < 0 || u > 1) return null;
    _qvec.crossVectors(_tvec, _edge1);
    const v = this.direction.dot(_qvec) * invDet;
    if (v < 0 || u + v > 1) return null;
    const t = _edge2.dot(_qvec) * invDet;
    if (t < 0) return null;
    return this.at(t, out);
  }

  applyMatrix4(m: Readonly<Matrix4>): this {
    this.origin.applyMatrix4(m);
    this.direction.transformDirection(m);
    return this;
  }

  equals(ray: Readonly<Ray>, epsilon = EPSILON): boolean {
    return this.origin.equalsEpsilon(ray.origin, epsilon) && this.direction.equalsEpsilon(ray.direction, epsilon);
  }
}
