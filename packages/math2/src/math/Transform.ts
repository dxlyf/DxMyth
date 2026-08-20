// ============================================================
// Transform — 带版本追踪的懒计算 2D 变换
//
// 变换顺序: T(-origin) → R(rotation) → S(scale) → Sk(skew) → T(position)
// 矩阵形式: M_local = T(position) · Sk(skew) · S(scale) · R(rotation) · T(-origin)
//
// 性能策略:
//   - 所有矩阵属性懒计算，仅当 localVersion 变化或父级变换变化时才重算
//   - 版本号对比 O(1) 判定脏标记，避免逐帧矩阵乘法
//   - 父子链通过 worldVersion 传播变更，逐级按需重算
// ============================================================

import { Matrix2D, type Matrix2DLike } from './Matrix2D'
import { type Vector2Like } from './Vector2'
import { Point } from './Point'
import { degToRad, radToDeg } from './MathUtils'
export type TransformProps = {
    position?: Vector2Like
    rotation?: number
    scale?: Vector2Like
    skew?: Vector2Like
    origin?: Vector2Like
    pivot?: Vector2Like
}
export class Transform {
    // ---- 内部存储 ----

    public position: Point
    public scale: Point
    private _rotation: number = 0
    public skew: Point
    public origin: Point
    public pivot: Point

    /** 父级变换（设置后 worldMatrix 自动跟随父级） */
    private _parent: Transform | null = null

    // ---- 矩阵缓存 ----

    private _matrix: Matrix2D = Matrix2D.identity()
    private _worldMatrix: Matrix2D = Matrix2D.identity()
    private _worldMatrixInvert: Matrix2D = Matrix2D.identity()
    private _worldScale: number = 1

    // ---- 版本追踪 ----

    /** 当前局部属性版本（Point onChange 或 rotation setter 自动递增） */
    private _localMatrixDirty: boolean = true
    private _worldMatrixDirty: boolean = true

    private _worldVersion: number = 0
    private _parentWorldVersion: number = -1

    /** 变化回调 */
    private _onChange: (() => void) | null = null

    constructor(options: TransformProps = {}) {
        this.updateTransform = this.updateTransform.bind(this)
        this.position = Point.fromPoint(options.position ?? { x: 0, y: 0 }).onChange(this.updateTransform)
        this.scale = Point.fromPoint(options.scale ?? { x: 1, y: 1 }).onChange(this.updateTransform)
        this.skew = Point.fromPoint(options.skew ?? { x: 0, y: 0 }).onChange(this.updateTransform)
        this.origin = Point.fromPoint(options.origin ?? { x: 0, y: 0 }).onChange(this.updateTransform)
        this.pivot = Point.fromPoint(options.pivot ?? { x: 0, y: 0 }).onChange(this.updateTransform)
    }

    // ==================== 访问器 ====================

    get rotation(): number {
        return this._rotation
    }
    set rotation(v: number) {
        if (this._rotation !== v) {
            this._rotation = v
            this.updateTransform()
        }
    }
    get angle() {
        return radToDeg(this._rotation)
    }
    set angle(v: number) {
        this.rotation = degToRad(v)
    }


    /**
     * 注册变化回调。当任一变换属性发生变化时触发。
     * 与 Point.onChange 模式一致，返回 this 便于链式调用。
     */
    onChange(cb: () => void): this {
        this._onChange = cb
        return this
    }

    /** 父级变换 */
    get parent(): Transform | null {
        return this._parent
    }
    set parent(v: Transform | null) {
        if (this._parent !== v) {
            this._parent = v
            this.updateTransform()
        }
    }


    /** 局部变换矩阵（只读，懒计算） */
    get matrix(): Matrix2D {
        this.updateMatrix()
        return this._matrix
    }
    /** 获取世界矩阵的全局缩放系数 */
    get worldScale(): number {
        this.updateWorldMatrix()
        return this._worldScale
    }
    /** 世界变换矩阵（只读，懒计算，自动跟随 parent 链） */
    get worldMatrix(): Matrix2D {
        this.updateWorldMatrix()
        return this._worldMatrix
    }

    /** 世界变换矩阵的逆（只读，懒计算） */
    get worldMatrixInvert(): Matrix2D {
        this.updateWorldMatrix()
        return this._worldMatrixInvert
    }

    /** 本地版本是否变化（触发 world 重算） */
    _needsWorldUpdate(): boolean {
        if(this._parent){
            return this._worldMatrixDirty||this._parent._worldVersion !== this._parentWorldVersion||this._parent._needsWorldUpdate()
        }
        return this._worldMatrixDirty
    }
    public updateMatrix(force: boolean = false): void {
        if (!force && !this._localMatrixDirty) {
            return
        }
        Matrix2D.fromTranslationRotationSkewScaleOriginPivot(
            this._matrix,
            this.position,
            this._rotation,
            this.skew,
            this.scale,
            this.origin,
            this.pivot
        )
        this._localMatrixDirty = false
        this._worldMatrixDirty = true
    }

    /**
     * 计算世界变换矩阵。
     *
     * 无 parent: M_world = M_local
     * 有 parent: M_world = M_parent · M_local
     */
    public updateWorldMatrix(force=false): void {
        if (!force&&!this._needsWorldUpdate()) {
            return
        }
         this.updateMatrix()
        if (this._parent) {
            Matrix2D.multiply(this._worldMatrix, this._parent.worldMatrix, this._matrix)
            this._parentWorldVersion = this._parent._worldVersion
        } else {
            this._worldMatrix.copy(this._matrix)
        }
        this._worldMatrixInvert.copy(this._worldMatrix).invert()
        this._worldScale = this._worldMatrix.getScale()
        this._worldVersion++
        this._worldMatrixDirty = false
    }

    // ==================== 公开方法 ====================

    /**
     * 强制标记为脏，下次访问 matrix/worldMatrix 时会重算。
     * 适用于批量设置多个属性后仅触发一次重算的场景。
     */
    updateTransform(): void {
        this._localMatrixDirty = true
        this._worldMatrixDirty = true
        this._onChange?.()
    }

    /** 重置所有变换为默认值 */
    reset(): void {
        this.position.set(0, 0)
        this.scale.set(1, 1)
        this._rotation = 0
        this.skew.set(0, 0)
        this.origin.set(0, 0)
    }

    /**
     * 将世界坐标转换为本地坐标。
     * result = M_world⁻¹ · point
     */
    worldToLocal<T extends Vector2Like>(point: Vector2Like, out: T): T {
        const [a, b, c, d, tx, ty] = this.worldMatrixInvert
        out.x = a * point.x + c * point.y + tx
        out.y = b * point.x + d * point.y + ty
        return out
    }

    /**
     * 将本地坐标转换为世界坐标。
     * result = M_world · point
     */
    localToWorld<T extends Vector2Like>(point: Vector2Like, out: T): T {
        const [a, b, c, d, tx, ty] = this.worldMatrix
        out.x = a * point.x + c * point.y + tx
        out.y = b * point.x + d * point.y + ty
        return out
    }


    decompose(matrix: Matrix2DLike): void {
        Matrix2D.decomposeTransform(matrix, this)
    }

    // ---- 便捷设置（批量操作仅触发一次版本变更） ----

    /** 批量设置变换属性 */
    setTransform(options: TransformProps): this {
        if (options.position) this.position.copy(options.position)
        if (options.scale) this.scale.copy(options.scale)
        if (options.rotation !== undefined) this.rotation = options.rotation
        if (options.skew) this.skew.copy(options.skew)
        if (options.origin) this.origin.copy(options.origin)
        if (options.pivot) this.pivot.copy(options.pivot)
        return this
    }

    /** 从另一个 Transform 拷贝变换属性 */
    copyFrom(other: Transform): this {
        this.position.copy(other.position)
        this.scale.copy(other.scale)
        this._rotation = other._rotation
        this.skew.copy(other.skew)
        this.origin.copy(other.origin)
        this.pivot.copy(other.pivot)
        return this
    }
}
