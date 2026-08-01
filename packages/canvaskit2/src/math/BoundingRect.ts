// ============================================================
// BoundingRect — 包围盒实现
// 采用 minX/minY/maxX/maxY（LTRB）表示
// ============================================================

import type { BoundingRect as IBoundingRect, BoundingRectLike } from '../types/BoundingRect'
import type { Matrix2DLike } from '../types/Matrix2D'
import type { PointLike } from '../types/Point'

export class BoundingRect implements IBoundingRect {
  minX: number = 0
  minY: number = 0
  maxX: number = 0
  maxY: number = 0

  constructor(minX: number = 0, minY: number = 0, maxX: number = 0, maxY: number = 0) {
    this.minX = minX
    this.minY = minY
    this.maxX = maxX
    this.maxY = maxY
  }

  // ---- 推导属性 ----

  get left(): number { return this.minX }
  get top(): number { return this.minY }
  get right(): number { return this.maxX }
  get bottom(): number { return this.maxY }
  get width(): number { return this.maxX - this.minX }
  get height(): number { return this.maxY - this.minY }
  get centerX(): number { return (this.minX + this.maxX) / 2 }
  get centerY(): number { return (this.minY + this.maxY) / 2 }
  get topLeft(): PointLike { return { x: this.minX, y: this.minY } }
  get topRight(): PointLike { return { x: this.maxX, y: this.minY } }
  get bottomLeft(): PointLike { return { x: this.minX, y: this.maxY } }
  get bottomRight(): PointLike { return { x: this.maxX, y: this.maxY } }

  // ---- 写入 ----

  set(minX: number, minY: number, maxX: number, maxY: number): this {
    this.minX = minX
    this.minY = minY
    this.maxX = maxX
    this.maxY = maxY
    return this
  }

  copy(r: BoundingRectLike): this {
    this.minX = r.minX
    this.minY = r.minY
    this.maxX = r.maxX
    this.maxY = r.maxY
    return this
  }

  zero(): this {
    this.minX = 0
    this.minY = 0
    this.maxX = 0
    this.maxY = 0
    return this
  }

  infinity(): this {
    this.minX = Infinity
    this.minY = Infinity
    this.maxX = -Infinity
    this.maxY = -Infinity
    return this
  }

  // ---- 包含 / 相交 ----

  containsPoint(px: number, py: number): boolean {
    return px >= this.minX && px <= this.maxX && py >= this.minY && py <= this.maxY
  }

  contains(p: PointLike): boolean {
    return this.containsPoint(p.x, p.y)
  }

  containsRect(r: BoundingRectLike): boolean {
    return r.minX >= this.minX && r.minY >= this.minY && r.maxX <= this.maxX && r.maxY <= this.maxY
  }

  intersects(r: BoundingRectLike): boolean {
    return this.minX < r.maxX && this.maxX > r.minX && this.minY < r.maxY && this.maxY > r.minY
  }

  // ---- 运算 ----

  expandToPoint(px: number, py: number): this {
    if (px < this.minX) this.minX = px
    if (py < this.minY) this.minY = py
    if (px > this.maxX) this.maxX = px
    if (py > this.maxY) this.maxY = py
    return this
  }

  union(r: BoundingRectLike): this {
    if (r.minX < this.minX) this.minX = r.minX
    if (r.minY < this.minY) this.minY = r.minY
    if (r.maxX > this.maxX) this.maxX = r.maxX
    if (r.maxY > this.maxY) this.maxY = r.maxY
    return this
  }

  intersect(r: BoundingRectLike): this {
    if (r.minX > this.minX) this.minX = r.minX
    if (r.minY > this.minY) this.minY = r.minY
    if (r.maxX < this.maxX) this.maxX = r.maxX
    if (r.maxY < this.maxY) this.maxY = r.maxY
    // 保证空包围盒
    if (this.maxX < this.minX) this.maxX = this.minX
    if (this.maxY < this.minY) this.maxY = this.minY
    return this
  }

  inflate(padding: number): this {
    this.minX -= padding
    this.minY -= padding
    this.maxX += padding
    this.maxY += padding
    return this
  }

  inflateLRBT(l: number, r: number, b: number, t: number): this {
    this.minX -= l
    this.minY -= t
    this.maxX += r
    this.maxY += b
    return this
  }

  translate(dx: number, dy: number): this {
    this.minX += dx
    this.minY += dy
    this.maxX += dx
    this.maxY += dy
    return this
  }

  scale(sx: number, sy: number): this {
    const cx = this.centerX
    const cy = this.centerY
    const hw = (this.maxX - this.minX) / 2 * sx
    const hh = (this.maxY - this.minY) / 2 * sy
    this.minX = cx - hw
    this.minY = cy - hh
    this.maxX = cx + hw
    this.maxY = cy + hh
    return this
  }

  applyMatrix2D(matrix: Matrix2DLike): this {
    const a = matrix[0], b = matrix[1], c = matrix[2], d = matrix[3]
    const tx = matrix[4], ty = matrix[5]

    const x0 = this.minX, y0 = this.minY
    const x1 = this.maxX, y1 = this.maxY

    // 变换 4 个角点
    const px = [
      a * x0 + c * y0 + tx,
      a * x1 + c * y0 + tx,
      a * x0 + c * y1 + tx,
      a * x1 + c * y1 + tx,
    ]
    const py = [
      b * x0 + d * y0 + ty,
      b * x1 + d * y0 + ty,
      b * x0 + d * y1 + ty,
      b * x1 + d * y1 + ty,
    ]

    let nMinX = px[0], nMaxX = px[0]
    let nMinY = py[0], nMaxY = py[0]
    for (let i = 1; i < 4; i++) {
      if (px[i] < nMinX) nMinX = px[i]
      if (px[i] > nMaxX) nMaxX = px[i]
      if (py[i] < nMinY) nMinY = py[i]
      if (py[i] > nMaxY) nMaxY = py[i]
    }

    this.minX = nMinX
    this.minY = nMinY
    this.maxX = nMaxX
    this.maxY = nMaxY
    return this
  }

  // ---- 查询 ----

  isEmpty(): boolean {
    return this.maxX <= this.minX || this.maxY <= this.minY
  }

  isValid(): boolean {
    return isFinite(this.minX) && isFinite(this.minY) && isFinite(this.maxX) && isFinite(this.maxY)
  }

  area(): number {
    const w = this.maxX - this.minX
    const h = this.maxY - this.minY
    return w * h
  }

  perimeter(): number {
    const w = this.maxX - this.minX
    const h = this.maxY - this.minY
    return (w + h) * 2
  }

  distanceToPoint(px: number, py: number): number {
    const dx = Math.max(this.minX - px, 0, px - this.maxX)
    const dy = Math.max(this.minY - py, 0, py - this.maxY)
    return Math.hypot(dx, dy)
  }

  distanceToRect(r: BoundingRectLike): number {
    if (this.intersects(r)) return 0
    const dx = Math.max(this.minX - r.maxX, r.minX - this.maxX, 0)
    const dy = Math.max(this.minY - r.maxY, r.minY - this.maxY, 0)
    return Math.hypot(dx, dy)
  }

  equals(r: BoundingRectLike): boolean {
    return this.minX === r.minX && this.minY === r.minY && this.maxX === r.maxX && this.maxY === r.maxY
  }

  // ---- 转换 ----

  toArray(): [number, number, number, number] {
    return [this.minX, this.minY, this.maxX, this.maxY]
  }

  toObject(): { minX: number; minY: number; maxX: number; maxY: number } {
    return { minX: this.minX, minY: this.minY, maxX: this.maxX, maxY: this.maxY }
  }

  clone(): BoundingRect {
    return new BoundingRect(this.minX, this.minY, this.maxX, this.maxY)
  }

  // ==================== 静态工厂 ====================

  /** 从多个点计算包围盒 */
  static fromPoints(points: PointLike[]): BoundingRect {
    if (points.length === 0) return new BoundingRect()
    let minX = points[0].x, minY = points[0].y
    let maxX = minX, maxY = minY
    for (let i = 1; i < points.length; i++) {
      const { x, y } = points[i]
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
    return new BoundingRect(minX, minY, maxX, maxY)
  }

  /** 从多个包围盒计算并集 */
  static fromRects(rects: BoundingRectLike[]): BoundingRect {
    if (rects.length === 0) return new BoundingRect()
    const r = new BoundingRect()
    r.copy(rects[0])
    for (let i = 1; i < rects.length; i++) {
      r.union(rects[i])
    }
    return r
  }

  /** 创建空包围盒（minX=minY=maxX=maxY=0） */
  static empty(): BoundingRect {
    return new BoundingRect(0, 0, 0, 0)
  }

  /** 从 BoundingRectLike 转换 */
  static from(r: BoundingRectLike): BoundingRect {
    return new BoundingRect(r.minX, r.minY, r.maxX, r.maxY)
  }
}
