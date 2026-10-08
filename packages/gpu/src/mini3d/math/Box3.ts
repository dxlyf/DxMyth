import { Vector3 } from './Vector3';
import { Matrix4 } from './Matrix4';

/**
 * Axis-aligned bounding box. Used for frustum culling, ray casting and as the
 * source volume for generated geometry.
 */
export class Box3 {
  min: Vector3;
  max: Vector3;

  constructor(
    min: Vector3 = new Vector3(+Infinity, +Infinity, +Infinity),
    max: Vector3 = new Vector3(-Infinity, -Infinity, -Infinity),
  ) {
    this.min = min;
    this.max = max;
  }

  set(min: Vector3, max: Vector3): this {
    this.min.copy(min);
    this.max.copy(max);
    return this;
  }

  setFromArray(array: ArrayLike<number>): this {
    this.makeEmpty();
    for (let i = 0; i < array.length; i += 3) {
      this.expandByPoint(_v.fromArray(array, i));
    }
    return this;
  }

  setFromPoints(points: Vector3[]): this {
    this.makeEmpty();
    for (const p of points) this.expandByPoint(p);
    return this;
  }

  setFromCenterAndSize(center: Vector3, size: Vector3): this {
    const half = _v.copy(size).multiplyScalar(0.5);
    this.min.copy(center).sub(half);
    this.max.copy(center).add(half);
    return this;
  }

  clone(): Box3 {
    return new Box3(this.min.clone(), this.max.clone());
  }

  copy(box: Box3): this {
    return this.set(box.min, box.max);
  }

  makeEmpty(): this {
    this.min.set(+Infinity, +Infinity, +Infinity);
    this.max.set(-Infinity, -Infinity, -Infinity);
    return this;
  }

  isEmpty(): boolean {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }

  getCenter(target: Vector3 = new Vector3()): Vector3 {
    return this.isEmpty()
      ? target.set(0, 0, 0)
      : target.addVectors(this.min, this.max).multiplyScalar(0.5);
  }

  getSize(target: Vector3 = new Vector3()): Vector3 {
    return this.isEmpty() ? target.set(0, 0, 0) : target.subVectors(this.max, this.min);
  }

  expandByPoint(point: Vector3): this {
    this.min.min(point);
    this.max.max(point);
    return this;
  }

  expandByVector(vector: Vector3): this {
    this.min.sub(vector);
    this.max.add(vector);
    return this;
  }

  expandByScalar(scalar: number): this {
    this.min.addScalar(-scalar);
    this.max.addScalar(scalar);
    return this;
  }

  expandByObject(object: { boundingBox?: Box3 | null; matrixWorld: Matrix4 }): this {
    const box = object.boundingBox ?? null;
    if (!box) return this;
    this.union(box.clone().applyMatrix4(object.matrixWorld));
    return this;
  }

  containsPoint(point: Vector3): boolean {
    return (
      point.x >= this.min.x && point.x <= this.max.x &&
      point.y >= this.min.y && point.y <= this.max.y &&
      point.z >= this.min.z && point.z <= this.max.z
    );
  }

  containsBox(box: Box3): boolean {
    return (
      this.min.x <= box.min.x && box.max.x <= this.max.x &&
      this.min.y <= box.min.y && box.max.y <= this.max.y &&
      this.min.z <= box.min.z && box.max.z <= this.max.z
    );
  }

  getParameter(point: Vector3, target: Vector3 = new Vector3()): Vector3 {
    return target.set(
      (point.x - this.min.x) / (this.max.x - this.min.x),
      (point.y - this.min.y) / (this.max.y - this.min.y),
      (point.z - this.min.z) / (this.max.z - this.min.z),
    );
  }

  intersectsBox(box: Box3): boolean {
    return !(
      box.max.x < this.min.x || box.min.x > this.max.x ||
      box.max.y < this.min.y || box.min.y > this.max.y ||
      box.max.z < this.min.z || box.min.z > this.max.z
    );
  }

  intersectsSphere(sphere: { center: Vector3; radius: number }): boolean {
    const closest = _clampPoint.copy(sphere.center).clamp(this.min, this.max);
    return closest.distanceToSquared(sphere.center) <= sphere.radius * sphere.radius;
  }

  intersectsPlane(plane: { normal: Vector3; constant: number }): boolean {
    let min = 0;
    let max = 0;
    const d = plane.normal.dot(_v.subVectors(this.max, this.min));
    void d;
    for (let axis = 0; axis < 3; axis++) {
      const n = axis === 0 ? plane.normal.x : axis === 1 ? plane.normal.y : plane.normal.z;
      const lo = axis === 0 ? this.min.x : axis === 1 ? this.min.y : this.min.z;
      const hi = axis === 0 ? this.max.x : axis === 1 ? this.max.y : this.max.z;
      if (n > 0) {
        min += n * lo;
        max += n * hi;
      } else {
        min += n * hi;
        max += n * lo;
      }
    }
    return min <= -plane.constant && max >= -plane.constant;
  }

  clampPoint(point: Vector3, target: Vector3 = new Vector3()): Vector3 {
    return target.copy(point).clamp(this.min, this.max);
  }

  distanceToPoint(point: Vector3): number {
    return this.clampPoint(point, _clampPoint).distanceTo(point);
  }

  /**
   * Exact triangle/AABB overlap test (Akenine-Möller's separating axis test).
   * Used by raycasters that prune against a box before hitting triangles.
   */
  intersectsTriangle(triangle: { a: Vector3; b: Vector3; c: Vector3 }): boolean {
    const { min, max } = this;
    const cx = (min.x + max.x) * 0.5;
    const cy = (min.y + max.y) * 0.5;
    const cz = (min.z + max.z) * 0.5;
    const ex = max.x - cx;
    const ey = max.y - cy;
    const ez = max.z - cz;

    const v0 = _triA.copy(triangle.a);
    const v1 = _triB.copy(triangle.b);
    const v2 = _triC.copy(triangle.c);
    // Translate the triangle so the box is centred on the origin.
    v0.set(v0.x - cx, v0.y - cy, v0.z - cz);
    v1.set(v1.x - cx, v1.y - cy, v1.z - cz);
    v2.set(v2.x - cx, v2.y - cy, v2.z - cz);

    const f0 = _f0.subVectors(v1, v0);
    const f1 = _f1.subVectors(v2, v1);
    const f2 = _f2.subVectors(v0, v2);

    // Edge cross-product axes: 9 tests.
    const axes: [Vector3, Vector3][] = [
      [_a00.set(0, -f0.z, f0.y), v0],
      [_a01.set(0, -f1.z, f1.y), v1],
      [_a02.set(0, -f2.z, f2.y), v2],
      [_a10.set(f0.z, 0, -f0.x), v0],
      [_a11.set(f1.z, 0, -f1.x), v1],
      [_a12.set(f2.z, 0, -f2.x), v2],
      [_a20.set(-f0.y, f0.x, 0), v0],
      [_a21.set(-f1.y, f1.x, 0), v1],
      [_a22.set(-f2.y, f2.x, 0), v2],
    ];
    for (const [axis, vertex] of axes) {
      const p0 = vertex.dot(axis);
      const p1 = v1.dot(axis);
      const p2 = v2.dot(axis);
      const r = ex * Math.abs(axis.x) + ey * Math.abs(axis.y) + ez * Math.abs(axis.z);
      const pMin = Math.min(p0, p1, p2);
      const pMax = Math.max(p0, p1, p2);
      if (pMin > r || pMax < -r) return false;
    }

    // Box face normals vs triangle plane: 3 tests.
    if (Math.min(v0.x, v1.x, v2.x) > ex || Math.max(v0.x, v1.x, v2.x) < -ex) return false;
    if (Math.min(v0.y, v1.y, v2.y) > ey || Math.max(v0.y, v1.y, v2.y) < -ey) return false;
    if (Math.min(v0.z, v1.z, v2.z) > ez || Math.max(v0.z, v1.z, v2.z) < -ez) return false;

    // Triangle normal axis.
    const normal = _normal.crossVectors(f0, f1);
    const d = normal.dot(v0);
    const r = ex * Math.abs(normal.x) + ey * Math.abs(normal.y) + ez * Math.abs(normal.z);
    return Math.abs(d) <= r;
  }

  union(box: Box3): this {
    this.min.min(box.min);
    this.max.max(box.max);
    return this;
  }

  /** Applies a 4x4 transform to the box, re-fitting the result. */
  applyMatrix4(matrix: Matrix4): this {
    if (this.isEmpty()) return this;
    const { min, max } = this;
    const corners = [
      _corner1.set(min.x, min.y, min.z).applyMatrix4(matrix),
      _corner2.set(min.x, min.y, max.z).applyMatrix4(matrix),
      _corner3.set(min.x, max.y, min.z).applyMatrix4(matrix),
      _corner4.set(min.x, max.y, max.z).applyMatrix4(matrix),
      _corner5.set(max.x, min.y, min.z).applyMatrix4(matrix),
      _corner6.set(max.x, min.y, max.z).applyMatrix4(matrix),
      _corner7.set(max.x, max.y, min.z).applyMatrix4(matrix),
      _corner8.set(max.x, max.y, max.z).applyMatrix4(matrix),
    ];
    this.makeEmpty();
    for (const c of corners) this.expandByPoint(c);
    return this;
  }

  translate(offset: Vector3): this {
    this.min.add(offset);
    this.max.add(offset);
    return this;
  }

  equals(box: Box3): boolean {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }

  toJSON(): { min: number[]; max: number[] } {
    return {
      min: [this.min.x, this.min.y, this.min.z],
      max: [this.max.x, this.max.y, this.max.z],
    };
  }

  static fromCenterAndSize(center: Vector3, size: Vector3): Box3 {
    return new Box3().setFromCenterAndSize(center, size);
  }
}

const _v = new Vector3();
const _clampPoint = new Vector3();
const _triA = new Vector3();
const _triB = new Vector3();
const _triC = new Vector3();
const _f0 = new Vector3();
const _f1 = new Vector3();
const _f2 = new Vector3();
const _normal = new Vector3();
const _a00 = new Vector3();
const _a01 = new Vector3();
const _a02 = new Vector3();
const _a10 = new Vector3();
const _a11 = new Vector3();
const _a12 = new Vector3();
const _a20 = new Vector3();
const _a21 = new Vector3();
const _a22 = new Vector3();
const _corner1 = new Vector3();
const _corner2 = new Vector3();
const _corner3 = new Vector3();
const _corner4 = new Vector3();
const _corner5 = new Vector3();
const _corner6 = new Vector3();
const _corner7 = new Vector3();
const _corner8 = new Vector3();
