// ============================================================
// Matrix2D — 基于 Float32Array 的 2D 仿射变换矩阵
// 内存布局: [0]=a, [1]=b, [2]=c, [3]=d, [4]=tx, [5]=ty
// 矩阵形式:
//   | a  c  tx |
//   | b  d  ty |
//   | 0  0  1  |
// ============================================================

import type { Matrix2D as IMatrix2D, Matrix2DLike } from '../types/Matrix2D'

/**
 * 二维仿射变换矩阵类，继承 Float32Array，与 WebGL / CanvasKit 底层数据格式兼容
 */
export class Matrix2D extends Float32Array implements IMatrix2D {
  // ---- 静态工厂 ----

  /** 单位矩阵 */
  static identity(): Matrix2D {
    return new Matrix2D(1, 0, 0, 1, 0, 0)
  }

  /** 平移矩阵 */
  static fromTranslate(tx: number, ty: number): Matrix2D {
    return new Matrix2D(1, 0, 0, 1, tx, ty)
  }

  /** 缩放矩阵 */
  static fromScale(sx: number, sy: number): Matrix2D {
    return new Matrix2D(sx, 0, 0, sy, 0, 0)
  }

  /** 旋转矩阵（angle 为弧度） */
  static fromRotate(angle: number): Matrix2D {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return new Matrix2D(c, s, -s, c, 0, 0)
  }

  /** 倾斜矩阵 */
  static fromSkew(sx: number, sy: number): Matrix2D {
    return new Matrix2D(1, Math.tan(sy), Math.tan(sx), 1, 0, 0)
  }

  /** 从数组创建 */
  static fromArray(arr: ArrayLike<number>): Matrix2D {
    return new Matrix2D(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5])
  }

  // ---- 静态工具 ----

  /** out = a * b */
  static multiply(out: Matrix2DLike, a: Matrix2DLike, b: Matrix2DLike): Matrix2DLike {
    const a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5]
    const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5]
    out[0] = a0 * b0 + a2 * b1
    out[1] = a1 * b0 + a3 * b1
    out[2] = a0 * b2 + a2 * b3
    out[3] = a1 * b2 + a3 * b3
    out[4] = a0 * b4 + a2 * b5 + a4
    out[5] = a1 * b4 + a3 * b5 + a5
    return out
  }

  /** out = m 的逆矩阵；行列式为 0 时返回 null */
  static invert(out: Matrix2DLike, m: Matrix2DLike): Matrix2DLike | null {
    const a = m[0], b = m[1], c = m[2], d = m[3], tx = m[4], ty = m[5]
    const det = a * d - b * c
    if (det === 0) return null
    const invDet = 1 / det
    out[0] = d * invDet
    out[1] = -b * invDet
    out[2] = -c * invDet
    out[3] = a * invDet
    out[4] = (c * ty - d * tx) * invDet
    out[5] = (b * tx - a * ty) * invDet
    return out
  }

  constructor(
    a: number = 1, b: number = 0, c: number = 0,
    d: number = 1, tx: number = 0, ty: number = 0,
  ) {
    super(6)
    this[0] = a
    this[1] = b
    this[2] = c
    this[3] = d
    this[4] = tx
    this[5] = ty
  }

  // ---- 命名属性访问器 ----

  get a(): number { return this[0] }
  set a(v: number) { this[0] = v }
  get b(): number { return this[1] }
  set b(v: number) { this[1] = v }
  get c(): number { return this[2] }
  set c(v: number) { this[2] = v }
  get d(): number { return this[3] }
  set d(v: number) { this[3] = v }
  get tx(): number { return this[4] }
  set tx(v: number) { this[4] = v }
  get ty(): number { return this[5] }
  set ty(v: number) { this[5] = v }

  // ---- 写入 ----

  private _set(a: number, b: number, c: number, d: number, tx: number, ty: number): this {
    this[0] = a
    this[1] = b
    this[2] = c
    this[3] = d
    this[4] = tx
    this[5] = ty
    return this
  }

  fromValues(a: number, b: number, c: number, d: number, tx: number, ty: number): this {
    return this._set(a, b, c, d, tx, ty)
  }

  identity(): this {
    return this._set(1, 0, 0, 1, 0, 0)
  }

  fromArray(m: Matrix2DLike): this {
    return this._set(m[0], m[1], m[2], m[3], m[4], m[5])
  }

  copy(m: Matrix2DLike): this {
    return this.fromArray(m)
  }

  fromTranslate(tx: number, ty: number): this {
    return this._set(1, 0, 0, 1, tx, ty)
  }

  fromScale(sx: number, sy: number): this {
    return this._set(sx, 0, 0, sy, 0, 0)
  }

  fromRotation(angle: number): this {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return this._set(c, s, -s, c, 0, 0)
  }

  fromSkew(sx: number, sy: number): this {
    return this._set(1, Math.tan(sy), Math.tan(sx), 1, 0, 0)
  }

  // ---- 自身变换 ----

  translate(tx: number, ty: number): this {
    this[4] = this[0] * tx + this[2] * ty + this[4]
    this[5] = this[1] * tx + this[3] * ty + this[5]
    return this
  }

  scale(sx: number, sy: number): this {
    this[0] *= sx
    this[1] *= sx
    this[2] *= sy
    this[3] *= sy
    return this
  }

  rotate(angle: number): this {
    const c = Math.cos(angle), s = Math.sin(angle)
    const a = this[0], b = this[1]
    const c0 = this[2], d = this[3]
    this[0] = a * c + c0 * s
    this[1] = b * c + d * s
    this[2] = a * -s + c0 * c
    this[3] = b * -s + d * c
    return this
  }

  skew(sx: number, sy: number): this {
    const tanSx = Math.tan(sx), tanSy = Math.tan(sy)
    const a = this[0], b = this[1]
    const c = this[2], d = this[3]
    this[0] = a + c * tanSy
    this[1] = b + d * tanSy
    this[2] = a * tanSx + c
    this[3] = b * tanSx + d
    return this
  }

  multiply(m: Matrix2DLike): this {
    Matrix2D.multiply(this, this, m)
    return this
  }

  premultiply(m: Matrix2DLike): this {
    Matrix2D.multiply(this, m, this)
    return this
  }

  multiplyMatrices(a: Matrix2DLike, b: Matrix2DLike): this {
    Matrix2D.multiply(this, a, b)
    return this
  }

  invert(): this | null {
    const result = Matrix2D.invert(this, this)
    return result ? this : null
  }

  // ---- 组合构建 ----

  fromTranslationRotationScale(
    position: { x: number; y: number },
    angleInRad: number,
    scale: { x: number; y: number },
  ): this {
    return this.fromTranslationRotationScalePivot(position, angleInRad, scale, { x: 0, y: 0 })
  }

  fromTranslationRotationScalePivot(
    position: { x: number; y: number },
    angleInRad: number,
    scale: { x: number; y: number },
    pivot: { x: number; y: number },
  ): this {
    const cos = Math.cos(angleInRad)
    const sin = Math.sin(angleInRad)
    const a = scale.x * cos
    const b = scale.x * sin
    const c = -scale.y * sin
    const d = scale.y * cos
    const tx = position.x - (pivot.x * a - pivot.y * c)
    const ty = position.y - (pivot.x * b + pivot.y * d)
    return this._set(a, b, c, d, tx, ty)
  }

  fromTransform(transform: {
    position: { x: number; y: number }
    scale?: { x: number; y: number }
    skew?: { x: number; y: number }
    rotation?: number
    origin?: { x: number; y: number }
    pivot?: { x: number; y: number }
  }): this {
    const { position, rotation = 0, skew: sk = { x: 0, y: 0 }, scale: sc = { x: 1, y: 1 }, origin = { x: 0, y: 0 }, pivot = { x: 0, y: 0 } } = transform
    const cos = rotation === 0 ? 1 : Math.cos(rotation)
    const sin = rotation === 0 ? 0 : Math.sin(rotation)
    const tanx = sk.x === 0 ? 0 : Math.tan(sk.x)
    const tany = sk.y === 0 ? 0 : Math.tan(sk.y)

    let ox = origin.x, oy = origin.y

    // t * o
    let tx = position.x + ox
    let ty = position.y + oy

    // r * skew
    let a = cos - sin * tany
    let b = sin + cos * tany
    let c = cos * tanx - sin
    let d = sin * tanx + cos

    // m * s
    a *= sc.x
    b *= sc.x
    c *= sc.y
    d *= sc.y

    ox += pivot.x
    oy += pivot.y

    return this._set(
      a, b, c, d,
      tx - (a * ox + c * oy),
      ty - (b * ox + d * oy),
    )
  }

  fromTranslateRotationSkewScaleOrigin(
    position: { x: number; y: number },
    rotation: number,
    skew: { x: number; y: number },
    scale: { x: number; y: number } = { x: 1, y: 1 },
    origin: { x: number; y: number } = { x: 0, y: 0 },
  ): this {
    return this.fromTransform({ position, rotation, skew, scale, origin })
  }

  // ---- 查询 ----

  determinant(): number {
    return this[0] * this[3] - this[1] * this[2]
  }

  isIdentity(): boolean {
    return !(
      this[1] !== 0 || this[2] !== 0 ||
      this[0] !== 1 || this[3] !== 1 ||
      this[4] !== 0 || this[5] !== 0
    )
  }

  isSingular(): boolean {
    return this.determinant() === 0
  }

  equals(m: Matrix2DLike): boolean {
    return (
      this[0] === m[0] && this[1] === m[1] &&
      this[2] === m[2] && this[3] === m[3] &&
      this[4] === m[4] && this[5] === m[5]
    )
  }

  getScaleX(): number {
    return Math.hypot(this[0], this[1])
  }

  getScaleY(): number {
    return Math.hypot(this[2], this[3])
  }

  getScale(): number {
    const sx = this.getScaleX()
    const sy = this.getScaleY()
    return Math.sqrt(sx * sy)
  }

  getRotation(): number {
    return Math.atan2(this[1], this[0])
  }

  // ---- 点变换 ----

  mapPoint(out: { x: number; y: number }, v: { x: number; y: number }): { x: number; y: number } {
    const x = v.x, y = v.y
    out.x = this[0] * x + this[2] * y + this[4]
    out.y = this[1] * x + this[3] * y + this[5]
    return out
  }

  mapPoints(out: { x: number; y: number }[], points: { x: number; y: number }[]): { x: number; y: number }[] {
    for (let i = 0; i < points.length; i++) {
      this.mapPoint(out[i] || { x: 0, y: 0 }, points[i])
    }
    return out
  }

  transformPoint(v: { x: number; y: number }): { x: number; y: number } {
    return {
      x: this[0] * v.x + this[2] * v.y + this[4],
      y: this[1] * v.x + this[3] * v.y + this[5],
    }
  }

  // ---- 工具 ----

  clone(): Matrix2D {
    return new Matrix2D(
      this[0], this[1],
      this[2], this[3],
      this[4], this[5],
    )
  }

  toArray(): number[] {
    return [
      this[0], this[1],
      this[2], this[3],
      this[4], this[5],
    ]
  }

  toString(): string {
    return `Matrix2D(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]}, ${this[4]}, ${this[5]})`
  }
}
