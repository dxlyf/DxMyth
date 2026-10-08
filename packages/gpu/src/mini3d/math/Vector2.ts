import { clamp } from './MathUtils';

/** 2-component vector. Same shape/conventions as the other vector classes. */
export class Vector2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get width(): number {
    return this.x;
  }
  set width(value: number) {
    this.x = value;
  }

  get height(): number {
    return this.y;
  }
  set height(value: number) {
    this.y = value;
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  setScalar(s: number): this {
    return this.set(s, s);
  }

  setX(x: number): this {
    this.x = x;
    return this;
  }

  setY(y: number): this {
    this.y = y;
    return this;
  }

  copy(v: Vector2): this {
    return this.set(v.x, v.y);
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  add(v: Vector2): this {
    return this.set(this.x + v.x, this.y + v.y);
  }

  addScalar(s: number): this {
    return this.set(this.x + s, this.y + s);
  }

  addVectors(a: Vector2, b: Vector2): this {
    return this.set(a.x + b.x, a.y + b.y);
  }

  addScaledVector(v: Vector2, s: number): this {
    return this.set(this.x + v.x * s, this.y + v.y * s);
  }

  sub(v: Vector2): this {
    return this.set(this.x - v.x, this.y - v.y);
  }

  subScalar(s: number): this {
    return this.set(this.x - s, this.y - s);
  }

  subVectors(a: Vector2, b: Vector2): this {
    return this.set(a.x - b.x, a.y - b.y);
  }

  multiply(v: Vector2): this {
    return this.set(this.x * v.x, this.y * v.y);
  }

  multiplyScalar(s: number): this {
    return this.set(this.x * s, this.y * s);
  }

  multiplyVectors(a: Vector2, b: Vector2): this {
    return this.set(a.x * b.x, a.y * b.y);
  }

  divide(v: Vector2): this {
    return this.set(this.x / v.x, this.y / v.y);
  }

  divideScalar(s: number): this {
    return this.multiplyScalar(1 / s);
  }

  negate(): this {
    return this.set(-this.x, -this.y);
  }

  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  cross(v: Vector2): number {
    return this.x * v.y - this.y * v.x;
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  length(): number {
    return Math.sqrt(this.lengthSq());
  }

  manhattanLength(): number {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  normalize(): this {
    return this.divideScalar(this.length() || 1);
  }

  setLength(length: number): this {
    return this.normalize().multiplyScalar(length);
  }

  distanceTo(v: Vector2): number {
    return Math.hypot(this.x - v.x, this.y - v.y);
  }

  distanceToSquared(v: Vector2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  lerp(v: Vector2, t: number): this {
    return this.set(this.x + (v.x - this.x) * t, this.y + (v.y - this.y) * t);
  }

  lerpVectors(a: Vector2, b: Vector2, t: number): this {
    return this.set(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
  }

  /** Angle of the vector in radians, measured from +X towards +Y. */
  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  setAngle(angle: number): this {
    return this.set(Math.cos(angle), Math.sin(angle));
  }

  rotateAround(center: Vector2, angle: number): this {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const dx = this.x - center.x;
    const dy = this.y - center.y;
    return this.set(center.x + dx * c - dy * s, center.y + dx * s + dy * c);
  }

  min(v: Vector2): this {
    return this.set(Math.min(this.x, v.x), Math.min(this.y, v.y));
  }

  max(v: Vector2): this {
    return this.set(Math.max(this.x, v.x), Math.max(this.y, v.y));
  }

  clamp(min: Vector2, max: Vector2): this {
    return this.set(clamp(this.x, min.x, max.x), clamp(this.y, min.y, max.y));
  }

  clampScalar(min: number, max: number): this {
    return this.set(clamp(this.x, min, max), clamp(this.y, min, max));
  }

  floor(): this {
    return this.set(Math.floor(this.x), Math.floor(this.y));
  }

  ceil(): this {
    return this.set(Math.ceil(this.x), Math.ceil(this.y));
  }

  round(): this {
    return this.set(Math.round(this.x), Math.round(this.y));
  }

  roundTo(): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  applyMatrix3(m: { elements: ArrayLike<number> }): this {
    const e = m.elements;
    const x = this.x;
    const y = this.y;
    return this.set(e[0] * x + e[3] * y + e[6], e[1] * x + e[4] * y + e[7]);
  }

  equals(v: Vector2): boolean {
    return this.x === v.x && this.y === v.y;
  }

  toArray(target: number[] | Float32Array = [], offset = 0): number[] | Float32Array {
    target[offset] = this.x;
    target[offset + 1] = this.y;
    return target;
  }

  fromArray(source: ArrayLike<number>, offset = 0): this {
    return this.set(source[offset], source[offset + 1]);
  }

  *[Symbol.iterator](): Iterator<number> {
    yield this.x;
    yield this.y;
  }
}
