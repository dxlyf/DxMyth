import { clamp, lerp } from './MathUtils';

/**
 * 3-component vector. This is the workhorse of the scene graph and of every
 * renderer backend (positions, normals, light directions, scale, ...).
 */
export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  setScalar(s: number): this {
    return this.set(s, s, s);
  }

  setX(x: number): this {
    this.x = x;
    return this;
  }

  setY(y: number): this {
    this.y = y;
    return this;
  }

  setZ(z: number): this {
    this.z = z;
    return this;
  }

  copy(v: Vector3): this {
    return this.set(v.x, v.y, v.z);
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  add(v: Vector3): this {
    return this.set(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  addScalar(s: number): this {
    return this.set(this.x + s, this.y + s, this.z + s);
  }

  addVectors(a: Vector3, b: Vector3): this {
    return this.set(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  addScaledVector(v: Vector3, s: number): this {
    return this.set(this.x + v.x * s, this.y + v.y * s, this.z + v.z * s);
  }

  sub(v: Vector3): this {
    return this.set(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  subScalar(s: number): this {
    return this.set(this.x - s, this.y - s, this.z - s);
  }

  subVectors(a: Vector3, b: Vector3): this {
    return this.set(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  multiply(v: Vector3): this {
    return this.set(this.x * v.x, this.y * v.y, this.z * v.z);
  }

  multiplyScalar(s: number): this {
    return this.set(this.x * s, this.y * s, this.z * s);
  }

  multiplyVectors(a: Vector3, b: Vector3): this {
    return this.set(a.x * b.x, a.y * b.y, a.z * b.z);
  }

  divide(v: Vector3): this {
    return this.set(this.x / v.x, this.y / v.y, this.z / v.z);
  }

  divideScalar(s: number): this {
    return this.multiplyScalar(1 / s);
  }

  negate(): this {
    return this.set(-this.x, -this.y, -this.z);
  }

  dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vector3): this {
    return this.crossVectors(this, v);
  }

  crossVectors(a: Vector3, b: Vector3): this {
    const ax = a.x;
    const ay = a.y;
    const az = a.z;
    const bx = b.x;
    const by = b.y;
    const bz = b.z;
    return this.set(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx);
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  length(): number {
    return Math.sqrt(this.lengthSq());
  }

  manhattanLength(): number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  normalize(): this {
    return this.divideScalar(this.length() || 1);
  }

  setLength(length: number): this {
    return this.normalize().multiplyScalar(length);
  }

  distanceTo(v: Vector3): number {
    return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  distanceToSquared(v: Vector3): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }

  manhattanDistanceTo(v: Vector3): number {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
  }

  lerp(v: Vector3, t: number): this {
    return this.set(
      lerp(this.x, v.x, t),
      lerp(this.y, v.y, t),
      lerp(this.z, v.z, t),
    );
  }

  lerpVectors(a: Vector3, b: Vector3, t: number): this {
    return this.set(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));
  }

  min(v: Vector3): this {
    return this.set(Math.min(this.x, v.x), Math.min(this.y, v.y), Math.min(this.z, v.z));
  }

  max(v: Vector3): this {
    return this.set(Math.max(this.x, v.x), Math.max(this.y, v.y), Math.max(this.z, v.z));
  }

  clamp(min: Vector3, max: Vector3): this {
    return this.set(
      clamp(this.x, min.x, max.x),
      clamp(this.y, min.y, max.y),
      clamp(this.z, min.z, max.z),
    );
  }

  clampScalar(min: number, max: number): this {
    return this.set(clamp(this.x, min, max), clamp(this.y, min, max), clamp(this.z, min, max));
  }

  floor(): this {
    return this.set(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
  }

  ceil(): this {
    return this.set(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
  }

  round(): this {
    return this.set(Math.round(this.x), Math.round(this.y), Math.round(this.z));
  }

  roundTo(): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }

  negateTo(): this {
    return this.negate();
  }

  /** Reflects this vector about a (normalised) plane normal. */
  reflect(normal: Vector3): this {
    return this.sub(normal.clone().multiplyScalar(2 * this.dot(normal)));
  }

  /** Projects this vector onto `v`. */
  projectOnVector(v: Vector3): this {
    const denominator = v.lengthSq();
    if (denominator === 0) return this.set(0, 0, 0);
    const scalar = v.dot(this) / denominator;
    return this.copy(v).multiplyScalar(scalar);
  }

  applyMatrix3(m: { elements: ArrayLike<number> }): this {
    const e = m.elements;
    const { x, y, z } = this;
    return this.set(
      e[0] * x + e[3] * y + e[6] * z,
      e[1] * x + e[4] * y + e[7] * z,
      e[2] * x + e[5] * y + e[8] * z,
    );
  }

  /** Full projective transform (divides by w when `w !== 1`). */
  applyMatrix4(m: { elements: ArrayLike<number> }): this {
    const e = m.elements;
    const { x, y, z } = this;
    const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15] || 1);
    return this.set(
      (e[0] * x + e[4] * y + e[8] * z + e[12]) * w,
      (e[1] * x + e[5] * y + e[9] * z + e[13]) * w,
      (e[2] * x + e[6] * y + e[10] * z + e[14]) * w,
    );
  }

  /** Rotation part only (implicit w = 0). */
  transformDirection(m: { elements: ArrayLike<number> }): this {
    const e = m.elements;
    const { x, y, z } = this;
    return this.set(
      e[0] * x + e[4] * y + e[8] * z,
      e[1] * x + e[5] * y + e[9] * z,
      e[2] * x + e[6] * y + e[10] * z,
    ).normalize();
  }

  /** Applies a quaternion rotation. */
  applyQuaternion(q: { x: number; y: number; z: number; w: number }): this {
    const vx = this.x;
    const vy = this.y;
    const vz = this.z;
    const qx = q.x;
    const qy = q.y;
    const qz = q.z;
    const qw = q.w;

    const ix = qw * vx + qy * vz - qz * vy;
    const iy = qw * vy + qz * vx - qx * vz;
    const iz = qw * vz + qx * vy - qy * vx;
    const iw = -qx * vx - qy * vy - qz * vz;

    return this.set(
      ix * qw + iw * -qx + iy * -qz - iz * -qy,
      iy * qw + iw * -qy + iz * -qx - ix * -qz,
      iz * qw + iw * -qz + ix * -qy - iy * -qx,
    );
  }

  /** Rotates around `axis` (must be normalised) by `angle` radians. */
  applyAxisAngle(axis: Vector3, angle: number): this {
    return this.applyQuaternion(
      _quatFromAxisAngle.setFromAxisAngle(axis, angle),
    );
  }

  /** Applies an Euler rotation (order XYZ, matching Euler's default). */
  applyEuler(euler: { x: number; y: number; z: number; order?: string }): this {
    return this.applyQuaternion(_quatFromEuler.setFromEuler(euler as never));
  }

  /**
   * Maps a normalised device coordinate back into world space by the given
   * camera's inverse projection and world matrices. Keeps the math layer free
   * of a hard dependency on the camera classes.
   */
  unproject(camera: {
    projectionMatrixInverse: { elements: ArrayLike<number> };
    matrixWorld: { elements: ArrayLike<number> };
  }): this {
    return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
  }

  equals(v: Vector3): boolean {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  }

  toArray(target: number[] | Float32Array = [], offset = 0): number[] | Float32Array {
    target[offset] = this.x;
    target[offset + 1] = this.y;
    target[offset + 2] = this.z;
    return target;
  }

  fromArray(source: ArrayLike<number>, offset = 0): this {
    return this.set(source[offset], source[offset + 1], source[offset + 2]);
  }

  /** Reads the translation column (12..14) out of a 4x4 matrix. */
  setFromMatrixPosition(m: { elements: ArrayLike<number> }): this {
    const e = m.elements;
    return this.set(e[12], e[13], e[14]);
  }

  /** Reads the scale (basis vector lengths) out of a 4x4 matrix. */
  setFromMatrixScale(m: { elements: ArrayLike<number> }): this {
    const e = m.elements;
    return this.set(
      Math.hypot(e[0], e[1], e[2]),
      Math.hypot(e[4], e[5], e[6]),
      Math.hypot(e[8], e[9], e[10]),
    );
  }

  /** Reads a column of a 4x4 matrix: 0 = X, 1 = Y, 2 = Z, 3 = translation. */
  setFromMatrixColumn(m: { elements: ArrayLike<number> }, index: number): this {
    return this.fromArray(m.elements, index * 4);
  }

  /**
   * Random direction on the unit sphere. Uses `Math.random` unless `rng` is
   * supplied, which keeps results reproducible in tests.
   */
  randomDirection(rng: () => number = Math.random): this {
    const u = rng() * 2 - 1;
    const theta = rng() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    return this.set(r * Math.cos(theta), r * Math.sin(theta), u);
  }

  *[Symbol.iterator](): Iterator<number> {
    yield this.x;
    yield this.y;
    yield this.z;
  }

  static up = new Vector3(0, 1, 0);
  static zero = new Vector3(0, 0, 0);
  static one = new Vector3(1, 1, 1);
  static right = new Vector3(1, 0, 0);
  static forward = new Vector3(0, 0, -1);
}

// Lazily-imported scratch objects avoid a circular import with Quat/Euler while
// keeping `applyAxisAngle` / `applyEuler` allocation free.
import { Quat } from './Quat';
import { Euler } from './Euler';
const _quatFromAxisAngle = new Quat();
const _quatFromEuler = new Quat();
