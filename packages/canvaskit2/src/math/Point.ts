// ============================================================
// Point — 二维坐标点，实现 types/Point 接口
// ============================================================

import type { Point as IPoint, PointLike } from '../types/Point'

/**
 * 二维坐标点类
 * 支持链式调用的向量/点运算
 */
export class Point implements IPoint {
  /** 从坐标值创建 Point */
  static create(x: number = 0, y: number = 0): Point {
    return new Point(x, y)
  }

  /** 从类 Point 对象创建副本 */
  static from(v: PointLike): Point {
    return new Point(v.x, v.y)
  }

  /** 从数组 [x, y] 创建 */
  static fromArray(arr: ArrayLike<number>): Point {
    return new Point(arr[0], arr[1])
  }

  /** 零向量 */
  static zero(): Point {
    return new Point(0, 0)
  }

  x: number
  y: number

  /** 变更回调 */
  private _onChange: (() => void) | null = null

  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  // ---- 变更通知 ----

  onChange(cb: () => void): this {
    this._onChange = cb
    return this
  }

  /** 触发变更回调 */
  private _notifyChange(): void {
    this._onChange?.()
  }

  // ---- 写入 ----

  set(x: number, y: number): this {
    if (this.x !== x || this.y !== y) {
      this.x = x
      this.y = y
      this._notifyChange()
    }
    return this
  }

  copy(v: PointLike): this {
    return this.set(v.x, v.y)
  }

  zero(): this {
    return this.set(0, 0)
  }

  // ---- 运算 ----

  add(v: PointLike): this {
    return this.set(this.x + v.x, this.y + v.y)
  }

  subtract(v: PointLike): this {
    return this.set(this.x - v.x, this.y - v.y)
  }

  multiply(v: PointLike): this {
    return this.set(this.x * v.x, this.y * v.y)
  }

  multiplyScalar(s: number): this {
    return this.set(this.x * s, this.y * s)
  }

  divide(s: number): this {
    return this.set(this.x / s, this.y / s)
  }

  negate(): this {
    return this.set(-this.x, -this.y)
  }

  normalize(): this {
    const len = Math.hypot(this.x, this.y)
    if (len === 0) return this
    return this.set(this.x / len, this.y / len)
  }

  translate(tx: number, ty: number): this {
    return this.set(this.x + tx, this.y + ty)
  }

  rotate(angle: number, center?: PointLike): this {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    if (center) {
      const dx = this.x - center.x
      const dy = this.y - center.y
      return this.set(
        dx * cos - dy * sin + center.x,
        dx * sin + dy * cos + center.y,
      )
    }
    return this.set(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos,
    )
  }

  scale(sx: number, sy: number): this {
    return this.set(this.x * sx, this.y * sy)
  }

  perpendicular(): this {
    return this.set(-this.y, this.x)
  }

  // ---- 查询 ----

  magnitude(): number {
    return Math.hypot(this.x, this.y)
  }

  magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y
  }

  dot(v: PointLike): number {
    return this.x * v.x + this.y * v.y
  }

  cross(v: PointLike): number {
    return this.x * v.y - this.y * v.x
  }

  distanceTo(v: PointLike): number {
    return Math.hypot(this.x - v.x, this.y - v.y)
  }

  distanceSquaredTo(v: PointLike): number {
    const dx = this.x - v.x
    const dy = this.y - v.y
    return dx * dx + dy * dy
  }

  angle(v: PointLike): number {
    const dot = this.dot(v)
    const lenProd = this.magnitude() * Math.hypot(v.x, v.y)
    if (lenProd === 0) return 0
    return Math.acos(Math.max(-1, Math.min(1, dot / lenProd)))
  }

  equals(v: PointLike): boolean {
    return this.x === v.x && this.y === v.y
  }

  equalsEpsilon(v: PointLike, epsilon: number = 1e-9): boolean {
    return Math.abs(this.x - v.x) <= epsilon && Math.abs(this.y - v.y) <= epsilon
  }

  isFinite(): boolean {
    return Number.isFinite(this.x) && Number.isFinite(this.y)
  }

  isZero(): boolean {
    return this.x === 0 && this.y === 0
  }

  // ---- 工具 ----

  clone(): Point {
    return new Point(this.x, this.y)
  }

  toArray(): [number, number] {
    return [this.x, this.y]
  }

  toString(): string {
    return `Point(${this.x}, ${this.y})`
  }
}
