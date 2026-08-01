// ============================================================
// Transform — 二维变换
// position / scale / skew / origin / pivot 使用 Point 管理，
// 通过 Point.onChange 自动标记脏，惰性计算矩阵
// ============================================================

import type { Transform as ITransform } from '../types/Transform'
import type { PointLike } from '../types/Point'
import type { Matrix2DLike } from '../types/Matrix2D'
import { Point } from './Point'
import { Matrix2D } from './Matrix2D'

/**
 * 二维变换类
 * position/scale/skew/origin/pivot 变更时自动标记脏，惰性计算 three 矩阵
 */
export class Transform implements ITransform {
  static uid=0
  // ---- 变换分量 ----
  uid:number
  position: Point
  scale: Point
  skew: Point
  origin: Point
  pivot: Point

  /** 旋转角（弧度） */
  private _rotation: number = 0
  get rotation(): number { return this._rotation }
  set rotation(v: number) {
    if (this._rotation !== v) {
      this._rotation = v
      this.markDirty()
    }
  }

  // ---- 惰性矩阵 ----

  private _localMatrix: Matrix2D | null = null
  private _worldMatrix: Matrix2D | null = null
  private _worldInverseMatrix: Matrix2D | null = null

  private _localDirty: boolean = true
  private _worldDirty: boolean = true

  /** 本地矩阵版本号，每次更新时递增；子节点通过对比父级版本感知变化 */
  private _version: number = 0
  /** 上次计算世界矩阵时父级的版本号，用于检测父级/祖先变化 */
  private _parentVersion: number = -1

  /** 变更回调 */
  private _onChange: (() => void) | null = null

  // ---- 父子层级 ----

  private _parent: ITransform | null = null
  get parent(): ITransform | null {
    return this._parent
  }
  set parent(v: ITransform | null) {
    if (this._parent !== v) {
      this._parent = v
      // 父级变化后世界矩阵必须重算
      this._worldDirty = true
      this._parentVersion = -1
    }
  }

  constructor() {
    this.uid=Transform.uid++
    this.position = new Point(0, 0)
    this.scale = new Point(1, 1)
    this.skew = new Point(0, 0)
    this.origin = new Point(0, 0)
    this.pivot = new Point(0, 0)

    // 各分量变更时自动标记脏
    const onComponentChange = (): void => { this.markDirty() }
    this.position.onChange(onComponentChange)
    this.scale.onChange(onComponentChange)
    this.skew.onChange(onComponentChange)
    this.origin.onChange(onComponentChange)
    this.pivot.onChange(onComponentChange)
  }

  // ---- 矩阵惰性求值 ----

  get localMatrix(): Matrix2D {
    if (this._localDirty) this.updateMatrix()
    return this._localMatrix!
  }

  /** 世界矩阵是否已脏（自身脏标记 + 父级/祖先版本变化）
   *  递归检查父级的 _isWorldDirty，确保祖先变化也能被检测到 */
  private _isWorldDirty(): boolean {
    if (this._worldDirty) return true
    if (this.parent) {
      const p = this.parent as Transform
      // 父级本地变化
      if (p._version !== this._parentVersion) return true
      // 父级的父级或祖先变化（递归检查）
      if (p._isWorldDirty()) return true
    }
    return false
  }

  get worldMatrix(): Matrix2D {
    if (this._isWorldDirty()) this._updateWorldMatrix()
    return this._worldMatrix!
  }

  get worldInverseMatrix(): Matrix2D {
    if (this._isWorldDirty()) this._updateWorldMatrix()
    return this._worldInverseMatrix!
  }

  // ---- 脏标记管理 ----

  markDirty(): void {
    this._localDirty = true
    this._worldDirty = true
    this._version = (this._version + 1) & 0x7FFFFFFF
    this._onChange?.()
  }

  onChange(cb: () => void): this {
    this._onChange = cb
    return this
  }

  updateMatrix(): void {
    if (!this._localMatrix) {
      this._localMatrix = Matrix2D.identity()
    }
    this._localMatrix.fromTransform({
      position: this.position,
      scale: this.scale,
      skew: this.skew,
      rotation: this._rotation,
      origin: this.origin,
      pivot: this.pivot,
    })
    this._localDirty = false
  }

  /** 更新世界矩阵及其逆矩阵 */
  private _updateWorldMatrix(): void {
    console.log('_updateWorldMatrix',this.uid)
    // 确保本地矩阵最新
    if (this._localDirty) this.updateMatrix()

    if (!this._worldMatrix) {
      this._worldMatrix = Matrix2D.identity()
    }

    if (this.parent) {
      // world = parent.world * local
      this._worldMatrix.multiplyMatrices(this.parent.worldMatrix, this._localMatrix!)
    } else {
      this._worldMatrix.fromArray(this._localMatrix!)
    }

    // 更新逆矩阵
    if (!this._worldInverseMatrix) {
      this._worldInverseMatrix = Matrix2D.identity()
    }
    this._worldInverseMatrix.fromArray(this._worldMatrix)
    const result = Matrix2D.invert(this._worldInverseMatrix, this._worldMatrix)
    if (!result) {
      // 不可逆时回退为单位矩阵
      this._worldInverseMatrix.identity()
    }

    // 记录当前父级版本，用于后续检测父级变化
    this._parentVersion = this.parent ? (this.parent as Transform)._version : -1
    this._worldDirty = false
  }

  // ---- 矩阵分解 ----

  setTransformFromMatrix(matrix: Matrix2DLike): void {
    const a = matrix[0], b = matrix[1], c = matrix[2], d = matrix[3]
    const tx = matrix[4], ty = matrix[5]

    this.position.set(tx, ty)

    const scaleX = Math.hypot(a, b)
    const scaleY = Math.hypot(c, d)
    this.scale.set(scaleX, scaleY)

    this._rotation = Math.atan2(b, a)

    // QR 分解约定 skewY = 0
    if (scaleX !== 0 && scaleY !== 0) {
      const skewX = Math.atan2(a * c + b * d, scaleX * scaleY)
      this.skew.set(skewX, 0)
    }

    this.markDirty()
  }

  // ---- 坐标转换 ----

  worldToLocal(point: PointLike): { x: number; y: number } {
    const inv = this.worldInverseMatrix
    return {
      x: inv[0] * point.x + inv[2] * point.y + inv[4],
      y: inv[1] * point.x + inv[3] * point.y + inv[5],
    }
  }

  localToWorld(point: PointLike): { x: number; y: number } {
    const m = this.worldMatrix
    return {
      x: m[0] * point.x + m[2] * point.y + m[4],
      y: m[1] * point.x + m[3] * point.y + m[5],
    }
  }

  // ---- 工具 ----

  clone(): Transform {
    const t = new Transform()
    t.position.copy(this.position)
    t.scale.copy(this.scale)
    t.skew.copy(this.skew)
    t.origin.copy(this.origin)
    t.pivot.copy(this.pivot)
    t._rotation = this._rotation
    t.parent = this.parent
    return t
  }
}
