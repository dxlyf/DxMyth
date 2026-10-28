import { EPSILON } from './MathUtils';
import { Matrix3 } from './Matrix3';
import type { Matrix4 } from './Matrix4';
import type { Sphere } from './Sphere';
import { Vector3 } from './Vector3';

/** Infinite plane described by `normal · p + constant = 0`. */
export class Plane {
  readonly normal: Vector3;
  constant: number;

  constructor(normal = new Vector3(0, 1, 0), constant = 0) {
    this.normal = normal;
    this.constant = constant;
  }

  set(normal: Readonly<Vector3>, constant: number): this {
    this.normal.copy(normal);
    this.constant = constant;
    return this;
  }

  setComponents(x: number, y: number, z: number, constant: number): this {
    this.normal.set(x, y, z);
    this.constant = constant;
    return this;
  }

  setFromNormalAndCoplanarPoint(normal: Readonly<Vector3>, point: Readonly<Vector3>): this {
    this.normal.copy(normal).normalize();
    this.constant = -point.dot(this.normal);
    return this;
  }

  setFromCoplanarPoints(a: Readonly<Vector3>, b: Readonly<Vector3>, c: Readonly<Vector3>): this {
    const cb = Vector3.pool.get().subtractVectors(c, b);
    const ab = Vector3.pool.get().subtractVectors(a, b);
    this.normal.crossVectors(cb, ab).normalize();
    this.constant = -a.dot(this.normal);
    Vector3.pool.releaseAll()
    return this;
  }

  copy(plane: Readonly<Plane>): this {
    return this.set(plane.normal, plane.constant);
  }

  clone(): Plane {
    return new Plane(this.normal.clone(), this.constant);
  }

  normalize(): this {
    const len = this.normal.magnitude();
    if (len > EPSILON) {
      const inv = 1 / len;
      this.normal.multiplyScalar(inv);
      this.constant *= inv;
    }
    return this;
  }

  negate(): this {
    this.normal.negate();
    this.constant = -this.constant;
    return this;
  }

  distanceToPoint(point: Readonly<Vector3>): number {
    return this.normal.dot(point) + this.constant;
  }

  distanceToSphere(sphere: Readonly<Sphere>): number {
    return this.distanceToPoint(sphere.center) - sphere.radius;
  }

  projectPoint(point: Readonly<Vector3>, out = new Vector3()): Vector3 {
    return out.copy(point).addScaled(this.normal, -this.distanceToPoint(point));
  }

  coplanarPoint(out = new Vector3()): Vector3 {
    return out.copy(this.normal).multiplyScalar(-this.constant);
  }

  translate(offset: Readonly<Vector3>): this {
    this.constant -= offset.dot(this.normal);
    return this;
  }

  applyMatrix4(m: Readonly<Matrix4>, normalMatrix?: Matrix3): this {
    const point = this.coplanarPoint(new Vector3()).applyMatrix4(m);
    const nm = normalMatrix ?? new Matrix3().getNormalMatrix(m);
    this.normal.applyMatrix3(nm).normalize();
    this.constant = -point.dot(this.normal);
    return this;
  }

  equals(plane: Readonly<Plane>, epsilon = EPSILON): boolean {
    return this.normal.equalsEpsilon(plane.normal, epsilon) && Math.abs(this.constant - plane.constant) <= epsilon;
  }
}
