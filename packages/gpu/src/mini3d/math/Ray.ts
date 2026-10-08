import { Vector3 } from './Vector3';
import { Sphere } from './Sphere';
import { Plane } from './Plane';
import { Matrix4 } from './Matrix4';
import { Box3 } from './Box3';

/** Half-open ray used for picking and ray marching. */
export class Ray {
  origin: Vector3;
  direction: Vector3;

  constructor(origin: Vector3 = new Vector3(), direction: Vector3 = new Vector3(0, 0, -1)) {
    this.origin = origin;
    this.direction = direction;
  }

  set(origin: Vector3, direction: Vector3): this {
    this.origin.copy(origin);
    this.direction.copy(direction);
    return this;
  }

  copy(ray: Ray): this {
    return this.set(ray.origin, ray.direction);
  }

  clone(): Ray {
    return new Ray(this.origin.clone(), this.direction.clone());
  }

  at(t: number, target: Vector3 = new Vector3()): Vector3 {
    return target.copy(this.direction).multiplyScalar(t).add(this.origin);
  }

  lookAt(v: Vector3): this {
    this.direction.copy(v).sub(this.origin).normalize();
    return this;
  }

  recast(t: number): this {
    this.origin.copy(this.at(t, _v1));
    return this;
  }

  closestPointToPoint(point: Vector3, target: Vector3 = new Vector3()): Vector3 {
    target.subVectors(point, this.origin);
    const directionDistance = target.dot(this.direction);
    if (directionDistance < 0) return target.copy(this.origin);
    return target.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);
  }

  distanceSqToPoint(point: Vector3): number {
    const directionDistance = _v1.subVectors(point, this.origin).dot(this.direction);
    if (directionDistance < 0) return this.origin.distanceToSquared(point);
    _v1.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);
    return _v1.distanceToSquared(point);
  }

  distanceToPoint(point: Vector3): number {
    return Math.sqrt(this.distanceSqToPoint(point));
  }

  distanceSqToSegment(
    v0: Vector3,
    v1: Vector3,
    optionalPointOnRay?: Vector3,
    optionalPointOnSegment?: Vector3,
  ): number {
    _segCenter.copy(v0).add(v1).multiplyScalar(0.5);
    _segDir.copy(v1).sub(v0).normalize();
    _diff.copy(this.origin).sub(_segCenter);

    const segExtent = v0.distanceTo(v1) * 0.5;
    const a01 = -this.direction.dot(_segDir);
    const b0 = _diff.dot(this.direction);
    const b1 = -_diff.dot(_segDir);
    const c = _diff.lengthSq();
    const det = Math.abs(1 - a01 * a01);
    let s0: number;
    let s1: number;
    let sqrDist: number;

    if (det > 0) {
      s0 = Math.max(-segExtent, Math.min(segExtent, -(b0 + a01 * b1) / det));
      s1 = b0 + a01 * s0;
      sqrDist = s0 * s0 + s1 * s1 + c + 2 * (a01 * s0 * s1 - b0 * s1 - b1 * s0);
    } else {
      // Parallel.
      s1 = a01 > 0 ? -segExtent : segExtent;
      s0 = Math.max(-segExtent, Math.min(segExtent, -(a01 * s1 + b0)));
      sqrDist = -s0 * s0 + s1 * s1 + c + 2 * (a01 * s0 * s1 - b0 * s1 - b1 * s0);
    }

    if (optionalPointOnRay) {
      optionalPointOnRay.copy(this.direction).multiplyScalar(s0).add(this.origin);
    }
    if (optionalPointOnSegment) {
      optionalPointOnSegment.copy(_segDir).multiplyScalar(s1).add(_segCenter);
    }
    return Math.max(sqrDist, 0);
  }

  intersectSphere(sphere: Sphere, target: Vector3 = new Vector3()): Vector3 | null {
    _v1.subVectors(sphere.center, this.origin);
    const tca = _v1.dot(this.direction);
    const d2 = _v1.dot(_v1) - tca * tca;
    const radius2 = sphere.radius * sphere.radius;
    if (d2 > radius2) return null;
    const thc = Math.sqrt(radius2 - d2);
    const t0 = tca - thc;
    const t1 = tca + thc;
    if (t1 < 0) return null;
    return this.at(t0 < 0 ? t1 : t0, target);
  }

  intersectsSphere(sphere: Sphere): boolean {
    return this.distanceSqToPoint(sphere.center) <= sphere.radius * sphere.radius;
  }

  intersectPlane(plane: Plane, target: Vector3 = new Vector3()): Vector3 | null {
    const denominator = plane.normal.dot(this.direction);
    if (denominator === 0) {
      // Ray is parallel: hit only if it starts on the plane.
      return plane.distanceToPoint(this.origin) === 0 ? target.copy(this.origin) : null;
    }
    const t = -(this.origin.dot(plane.normal) + plane.constant) / denominator;
    return t >= 0 ? this.at(t, target) : null;
  }

  intersectBox(box: Box3, target: Vector3 = new Vector3()): Vector3 | null {
    _invDir.set(1 / this.direction.x, 1 / this.direction.y, 1 / this.direction.z);
    const tmin = _boxMin.copy(box.min).sub(this.origin).multiply(_invDir);
    const tmax = _boxMax.copy(box.max).sub(this.origin).multiply(_invDir);
    for (let i = 0; i < 3; i++) {
      const a = i === 0 ? tmin.x : i === 1 ? tmin.y : tmin.z;
      const b = i === 0 ? tmax.x : i === 1 ? tmax.y : tmax.z;
      if (a > b) {
        if (i === 0) {
          const tmp = tmin.x;
          tmin.x = tmax.x;
          tmax.x = tmp;
        } else if (i === 1) {
          const tmp = tmin.y;
          tmin.y = tmax.y;
          tmax.y = tmp;
        } else {
          const tmp = tmin.z;
          tmin.z = tmax.z;
          tmax.z = tmp;
        }
      }
    }
    const tNear = Math.max(tmin.x, tmin.y, tmin.z);
    const tFar = Math.min(tmax.x, tmax.y, tmax.z);
    if (tNear > tFar || tFar < 0) return null;
    return this.at(tNear < 0 ? tFar : tNear, target);
  }

  intersectsBox(box: Box3): boolean {
    return this.intersectBox(box, _v1) !== null;
  }

  /**
   * Möller–Trumbore ray/triangle test. Returns the hit distance or `null`, and
   * writes the hit point / barycentric coordinates when targets are supplied.
   */
  intersectTriangle(
    a: Vector3,
    b: Vector3,
    c: Vector3,
    backfaceCulling: boolean,
    target: Vector3 = new Vector3(),
  ): Vector3 | null {
    _edge1.subVectors(b, a);
    _edge2.subVectors(c, a);
    _normal.crossVectors(_edge1, _edge2);

    let d = this.direction.dot(_normal);
    let sign: number;
    if (d > 0) {
      if (backfaceCulling) return null;
      sign = 1;
    } else if (d < 0) {
      sign = -1;
    } else {
      return null;
    }
    d = Math.abs(d);
    _diff.subVectors(this.origin, a);
    const dD = sign * this.direction.dot(_normal);
    void dD;
    const b1 = (sign * _diff.dot(_normal)) / d;
    if (b1 < 0 || b1 > 1) return null;

    _normal.crossVectors(_diff, _edge1);
    const b2 = (sign * this.direction.dot(_normal)) / d;
    if (b2 < 0 || b1 + b2 > 1) return null;

    const t = (sign * _edge2.dot(_normal)) / d;
    return t >= 0 ? this.at(t, target) : null;
  }

  applyMatrix4(matrix: Matrix4): this {
    this.origin.applyMatrix4(matrix);
    this.direction.transformDirection(matrix);
    return this;
  }

  equals(ray: Ray): boolean {
    return ray.origin.equals(this.origin) && ray.direction.equals(this.direction);
  }
}

const _v1 = new Vector3();
const _invDir = new Vector3();
const _boxMin = new Vector3();
const _boxMax = new Vector3();
const _edge1 = new Vector3();
const _edge2 = new Vector3();
const _normal = new Vector3();
const _diff = new Vector3();
const _segCenter = new Vector3();
const _segDir = new Vector3();
