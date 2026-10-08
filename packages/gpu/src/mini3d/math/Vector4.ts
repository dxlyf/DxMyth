import { clamp } from './MathUtils';

/** 4-component vector (homogeneous coordinates, tangents, colours, uv bounds). */
export class Vector4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  get width(): number {
    return this.z;
  }
  set width(value: number) {
    this.z = value;
  }

  get height(): number {
    return this.w;
  }
  set height(value: number) {
    this.w = value;
  }

  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  setScalar(s: number): this {
    return this.set(s, s, s, s);
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
  setW(w: number): this {
    this.w = w;
    return this;
  }

  copy(v: Vector4): this {
    return this.set(v.x, v.y, v.z, v.w);
  }

  clone(): Vector4 {
    return new Vector4(this.x, this.y, this.z, this.w);
  }

  add(v: Vector4): this {
    return this.set(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
  }

  addScalar(s: number): this {
    return this.set(this.x + s, this.y + s, this.z + s, this.w + s);
  }

  addVectors(a: Vector4, b: Vector4): this {
    return this.set(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
  }

  addScaledVector(v: Vector4, s: number): this {
    return this.set(this.x + v.x * s, this.y + v.y * s, this.z + v.z * s, this.w + v.w * s);
  }

  sub(v: Vector4): this {
    return this.set(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
  }

  subScalar(s: number): this {
    return this.set(this.x - s, this.y - s, this.z - s, this.w - s);
  }

  subVectors(a: Vector4, b: Vector4): this {
    return this.set(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
  }

  multiply(v: Vector4): this {
    return this.set(this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w);
  }

  multiplyScalar(s: number): this {
    return this.set(this.x * s, this.y * s, this.z * s, this.w * s);
  }

  divideScalar(s: number): this {
    return this.multiplyScalar(1 / s);
  }

  negate(): this {
    return this.set(-this.x, -this.y, -this.z, -this.w);
  }

  dot(v: Vector4): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  length(): number {
    return Math.sqrt(this.lengthSq());
  }

  normalize(): this {
    return this.divideScalar(this.length() || 1);
  }

  setLength(length: number): this {
    return this.normalize().multiplyScalar(length);
  }

  distanceTo(v: Vector4): number {
    return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
  }

  manhattanLength(): number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }

  lerp(v: Vector4, t: number): this {
    return this.set(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t,
      this.z + (v.z - this.z) * t,
      this.w + (v.w - this.w) * t,
    );
  }

  lerpVectors(a: Vector4, b: Vector4, t: number): this {
    return this.set(
      a.x + (b.x - a.x) * t,
      a.y + (b.y - a.y) * t,
      a.z + (b.z - a.z) * t,
      a.w + (b.w - a.w) * t,
    );
  }

  min(v: Vector4): this {
    return this.set(
      Math.min(this.x, v.x),
      Math.min(this.y, v.y),
      Math.min(this.z, v.z),
      Math.min(this.w, v.w),
    );
  }

  max(v: Vector4): this {
    return this.set(
      Math.max(this.x, v.x),
      Math.max(this.y, v.y),
      Math.max(this.z, v.z),
      Math.max(this.w, v.w),
    );
  }

  clamp(min: Vector4, max: Vector4): this {
    return this.set(
      clamp(this.x, min.x, max.x),
      clamp(this.y, min.y, max.y),
      clamp(this.z, min.z, max.z),
      clamp(this.w, min.w, max.w),
    );
  }

  clampScalar(min: number, max: number): this {
    return this.set(
      clamp(this.x, min, max),
      clamp(this.y, min, max),
      clamp(this.z, min, max),
      clamp(this.w, min, max),
    );
  }

  floor(): this {
    return this.set(
      Math.floor(this.x),
      Math.floor(this.y),
      Math.floor(this.z),
      Math.floor(this.w),
    );
  }

  round(): this {
    return this.set(
      Math.round(this.x),
      Math.round(this.y),
      Math.round(this.z),
      Math.round(this.w),
    );
  }

  applyMatrix4(m: { elements: ArrayLike<number> }): this {
    const e = m.elements;
    const { x, y, z, w } = this;
    return this.set(
      e[0] * x + e[4] * y + e[8] * z + e[12] * w,
      e[1] * x + e[5] * y + e[9] * z + e[13] * w,
      e[2] * x + e[6] * y + e[10] * z + e[14] * w,
      e[3] * x + e[7] * y + e[11] * z + e[15] * w,
    );
  }

  equals(v: Vector4): boolean {
    return this.x === v.x && this.y === v.y && this.z === v.z && this.w === v.w;
  }

  toArray(target: number[] | Float32Array = [], offset = 0): number[] | Float32Array {
    target[offset] = this.x;
    target[offset + 1] = this.y;
    target[offset + 2] = this.z;
    target[offset + 3] = this.w;
    return target;
  }

  fromArray(source: ArrayLike<number>, offset = 0): this {
    return this.set(source[offset], source[offset + 1], source[offset + 2], source[offset + 3]);
  }

  *[Symbol.iterator](): Iterator<number> {
    yield this.x;
    yield this.y;
    yield this.z;
    yield this.w;
  }
}
