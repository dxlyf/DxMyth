/**
 * BoundingRect — 包围盒接口
 *
 * 表示矩形包围盒（轴对齐），用于边界计算、空间查询和碰撞检测。
 * 采用 minX/minY/maxX/maxY（LTRB）表示，提供 width/height/centerX/centerY 推导属性。
 */
import type { PointLike } from './Point'
import type { Matrix2DLike } from './Matrix2D'

/** 类包围盒对象 */
export type BoundingRectLike = { minX: number; minY: number; maxX: number; maxY: number }

export interface BoundingRect {
  // ---- 基本属性 ----

  /** 左边界 */
  minX: number
  /** 上边界 */
  minY: number
  /** 右边界 */
  maxX: number
  /** 下边界 */
  maxY: number

  // ---- 推导属性（只读） ----

  /** 左边界（同 minX） */
  readonly left: number
  /** 上边界（同 minY） */
  readonly top: number
  /** 右边界（同 maxX） */
  readonly right: number
  /** 下边界（同 maxY） */
  readonly bottom: number
  /** 宽度（maxX - minX） */
  readonly width: number
  /** 高度（maxY - minY） */
  readonly height: number
  /** 中心点 x */
  readonly centerX: number
  /** 中心点 y */
  readonly centerY: number
  /** 左上角坐标 */
  readonly topLeft: PointLike
  /** 右上角坐标 */
  readonly topRight: PointLike
  /** 左下角坐标 */
  readonly bottomLeft: PointLike
  /** 右下角坐标 */
  readonly bottomRight: PointLike

  // ---- 写入 ----

  /** 设置 minX/minY/maxX/maxY */
  set(minX: number, minY: number, maxX: number, maxY: number): this
  /** 从另一个 BoundingRectLike 拷贝 */
  copy(r: BoundingRectLike): this
  /** 置空（minX=minY=maxX=maxY=0） */
  zero(): this
  /** 置为无限大（minX=minY=Infinity, maxX=maxY=-Infinity） */
  infinity(): this

  // ---- 包含 / 相交 ----

  /** 点是否在包围盒内 */
  containsPoint(px: number, py: number): boolean
  /** 点（PointLike）是否在包围盒内 */
  contains(p: PointLike): boolean
  /** 是否完全包含另一个包围盒 */
  containsRect(r: BoundingRectLike): boolean
  /** 是否与另一个包围盒相交 */
  intersects(r: BoundingRectLike): boolean

  // ---- 运算 ----

  /** 扩展包围盒以包含指定点 */
  expandToPoint(px: number, py: number): this
  /** 扩展包围盒以包含另一个包围盒 */
  union(r: BoundingRectLike): this
  /** 收缩为与另一个包围盒的交集 */
  intersect(r: BoundingRectLike): this
  /** 均匀扩展 / 收缩（负数为收缩） */
  inflate(padding: number): this
  /** 分别向四个方向扩展 / 收缩 */
  inflateLRBT(left: number, right: number, bottom: number, top: number): this
  /** 平移 (dx, dy) */
  translate(dx: number, dy: number): this
  /** 缩放，以中心为原点 */
  scale(sx: number, sy: number): this
  /** 应用 2D 矩阵变换，更新为变换后 4 个角点的轴对齐包围盒 */
  applyMatrix2D(matrix: Matrix2DLike): this

  // ---- 查询 ----

  /** 是否为空（maxX ≤ minX 或 maxY ≤ minY） */
  isEmpty(): boolean
  /** 是否有效（所有属性为有限数） */
  isValid(): boolean
  /** 面积 */
  area(): number
  /** 周长 */
  perimeter(): number
  /** 到边界框的最近距离；点在内部返回 0 */
  distanceToPoint(px: number, py: number): number
  /** 与另一个包围盒的距离 */
  distanceToRect(r: BoundingRectLike): number
  /** 是否与另一个包围盒相等 */
  equals(r: BoundingRectLike): boolean

  // ---- 转换 ----

  /** 转为 [minX, minY, maxX, maxY] */
  toArray(): [number, number, number, number]
  /** 转为 { minX, minY, maxX, maxY } */
  toObject(): { minX: number; minY: number; maxX: number; maxY: number }
  /** 克隆 */
  clone(): BoundingRect
}
