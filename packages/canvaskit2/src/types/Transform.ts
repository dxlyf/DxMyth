/**
 * 二维变换接口
 * 管理 position / scale / skew / rotation / origin / pivot 等变换分量，
 * 通过 Point.onChange 监听分量变更并标记脏，惰性计算 localMatrix / worldMatrix / worldInverseMatrix
 */
import type { Point, PointLike } from './Point'
import type { Matrix2D, Matrix2DLike } from './Matrix2D'

export interface Transform {
  // ---- 变换分量 ----
  uid:number
  /** 平移（Point，变更时自动标记脏） */
  position: Point
  /** 缩放（Point，变更时自动标记脏） */
  scale: Point
  /** 倾斜（Point，变更时自动标记脏） */
  skew: Point
  /** 变换原点（Point，变更时自动标记脏） */
  origin: Point
  /** 轴心（Point，变更时自动标记脏） */
  pivot: Point
  /** 旋转角（弧度），设置时自动标记脏 */
  rotation: number

  // ---- 惰性矩阵 ----

  /** 本地变换矩阵，由各分量组合生成（惰性计算） */
  readonly localMatrix: Matrix2D
  /** 世界矩阵 = localMatrix × parent.worldMatrix（惰性计算） */
  readonly worldMatrix: Matrix2D
  /** 世界逆矩阵，用于世界→本地坐标转换（惰性计算） */
  readonly worldInverseMatrix: Matrix2D

  // ---- 父子层级 ----

  /** 父变换，用于计算世界矩阵 */
  parent: Transform | null

  // ---- 脏标记管理 ----

  /** 标记本地矩阵为脏，下次访问时重新计算 */
  markDirty(): void

  /** 注册变更回调，任意变换分量变化时触发 */
  onChange(cb: () => void): this
  /** 强制更新本地矩阵（各分量 → localMatrix） */
  updateMatrix(): void

  // ---- 矩阵分解 ----

  /** 从矩阵逆解变换分量，写入 position / scale / skew / rotation */
  setTransformFromMatrix(matrix: Matrix2DLike): void

  // ---- 坐标转换 ----

  /** 世界坐标 → 本地坐标 */
  worldToLocal(point: PointLike): { x: number; y: number }
  /** 本地坐标 → 世界坐标 */
  localToWorld(point: PointLike): { x: number; y: number }

  // ---- 工具 ----

  /** 克隆变换 */
  clone(): Transform
}
