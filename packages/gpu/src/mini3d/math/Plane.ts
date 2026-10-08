import { Vector3 } from './Vector3';
import { Matrix3 } from './Matrix3';
import { Matrix4 } from './Matrix4';
import { EPSILON } from './MathUtils';

/**
 * Plane in Hessian normal form: `normal · x + constant = 0` with a unit
 * normal. The six frustum planes are `Plane` instances.
 */
export class Plane {
  normal: Vector3;
  constant: number;

  constructor(normal: Vector3 = new Vector3(1, 0, 0), constant = 0) {
    this.normal = normal;
    this.constant = constant;
  }

  set(normal: Vector3, constant: number): this {
    this.normal.copy(normal);
    this.constant = constant;
    return this;
  }

  setComponents(x: number, y: number, z: number, w: number): this {
    this.normal.set(x, y, z);
    this.constant = w;
    return this;
  }

  /** Derives the plane from a normal and an arbitrary point on the plane. */
  setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): this {
    this.normal.copy(normal);
    this.constant = -point.dot(this.normal);
    return this;
  }

  /**
   * Derives the plane from three points (counter-clockwise winding gives the
   * normal by the right-hand rule).
   */
  setFromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): this {
    const normal = _v1.subVectors(c, b).cross(_v2.subVectors(a, b)).normalize();
    return this.setFromNormalAndCoplanarPoint(normal, a);
  }

  copy(plane: Plane): this {
    return this.set(plane.normal, plane.constant);
  }

  clone(): Plane {
    return new Plane(this.normal.clone(), this.constant);
  }

  normalize(): this {
    const inverseNormalLength = 1 / (this.normal.length() || 1);
    this.normal.multiplyScalar(inverseNormalLength);
    this.constant *= inverseNormalLength;
    return this;
  }

  negate(): this {
    this.normal.negate();
    this.constant = -this.constant;
    return this;
  }

  /** Signed distance from the plane to `point` (negative = behind). */
  distanceToPoint(point: Vector3): number {
    return this.normal.dot(point) + this.constant;
  }

  /** Signed distance to a sphere's surface. */
  distanceToSphere(sphere: { center: Vector3; radius: number }): number {
    return this.distanceToPoint(sphere.center) - sphere.radius;
  }

  projectPoint(point: Vector3, target: Vector3 = new Vector3()): Vector3 {
    return target
      .copy(this.normal)
      .multiplyScalar(-this.distanceToPoint(point))
      .add(point);
  }

  /**
   * Intersection point with a ray, or `null` when parallel. `target` is left
   * untouched in the null case.
   */
  intersectLine(
    line: { start: Vector3; end: Vector3 },
    target: Vector3 = new Vector3(),
  ): Vector3 | null {
    return this.intersectRay(
      _ray.set(line.start, _direction.subVectors(line.end, line.start).normalize()),
      target,
    );
  }

  intersectsLine(line: { start: Vector3; end: Vector3 }): boolean {
    const startSign = this.distanceToPoint(line.start);
    const endSign = this.distanceToPoint(line.end);
    return (startSign < 0 && endSign > 0) || (startSign > 0 && endSign < 0);
  }

  /** True when the box straddles (or touches) the plane. */
  intersectsBox(box: { min: Vector3; max: Vector3 }): boolean {
    // Project the box onto the plane normal: [min, max] of `n·x`.
    let minProjection = 0;
    let maxProjection = 0;
    const axes: [number, number, number][] = [
      [box.min.x, box.max.x, this.normal.x],
      [box.min.y, box.max.y, this.normal.y],
      [box.min.z, box.max.z, this.normal.z],
    ];
    for (const [lo, hi, n] of axes) {
      if (n > 0) {
        minProjection += n * lo;
        maxProjection += n * hi;
      } else {
        minProjection += n * hi;
        maxProjection += n * lo;
      }
    }
    // `n·x + constant` spans [minProjection + c, maxProjection + c].
    return minProjection + this.constant <= 0 && maxProjection + this.constant >= 0;
  }

  /** Intersection with an infinite ray. */
  intersectRay(
    ray: { origin: Vector3; direction: Vector3 },
    target: Vector3 = new Vector3(),
  ): Vector3 | null {
    const denominator = this.normal.dot(ray.direction);
    if (Math.abs(denominator) < EPSILON) return null;
    const t = -(ray.origin.dot(this.normal) + this.constant) / denominator;
    if (t < 0) return null;
    return target.copy(ray.direction).multiplyScalar(t).add(ray.origin);
  }

  coplanarPoint(target: Vector3 = new Vector3()): Vector3 {
    return target.copy(this.normal).multiplyScalar(-this.constant);
  }

  applyMatrix4(matrix: Matrix4, optionalNormalMatrix?: Matrix3): this {
    const normalMatrix = optionalNormalMatrix ?? _normalMatrix.getNormalMatrix(matrix);
    const referencePoint = this.coplanarPoint(_v1).applyMatrix4(matrix);
    const normal = this.normal.applyMatrix3(normalMatrix).normalize();
    this.constant = -referencePoint.dot(normal);
    return this;
  }

  translate(offset: Vector3): this {
    this.constant -= offset.dot(this.normal);
    return this;
  }

  equals(plane: Plane): boolean {
    return plane.normal.equals(this.normal) && plane.constant === this.constant;
  }
}

const _v1 = new Vector3();
const _v2 = new Vector3();
const _direction = new Vector3();
const _normalMatrix = new Matrix3();
const _ray = {
  origin: new Vector3(),
  direction: new Vector3(),
  set(origin: Vector3, direction: Vector3) {
    this.origin.copy(origin);
    this.direction.copy(direction);
    return this;
  },
};
