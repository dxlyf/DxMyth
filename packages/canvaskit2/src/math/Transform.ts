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

export class Transform {
    // ---- 内部存储 ----

    public position: Point
    public scale: Point
    private _rotation: number = 0
    public skew: Point
    public origin: Point

    /** 父级变换（设置后 worldMatrix 自动跟随父级） */
    private _parent: Transform | null = null

    // ---- 矩阵缓存 ----

    private _matrix: Matrix2D = Matrix2D.identity()
    private _worldMatrix: Matrix2D = Matrix2D.identity()
    private _worldMatrixInvert: Matrix2D = Matrix2D.identity()

    // ---- 版本追踪 ----

    /** 当前局部属性版本（Point onChange 或 rotation setter 自动递增） */
    private _localVersion: number = 0

    /** 上次计算 _matrix 时的 _localVersion */
    private _lastLocalVersion: number = -1

    /** 上次计算 _worldMatrix 时的 _localVersion */
    private _lastWorldLocalVersion: number = -1

    /** 上次计算 _worldMatrix 时 parent.worldVersion 的值 */
    private _lastParentWorldVersion: number = -1

    /** 上次计算 _worldMatrixInvert 时的 _localVersion */
    private _lastInvertLocalVersion: number = -1

    /** 变化回调 */
    private _onChange: (() => void) | null = null

    constructor() {
        this.invalidate=this.invalidate.bind(this)
        this.position = new Point(0, 0).onChange(this.invalidate)
        this.scale = new Point(1, 1).onChange(this.invalidate)
        this.skew = new Point(0, 0).onChange(this.invalidate)
        this.origin = new Point(0, 0).onChange(this.invalidate)
    }

    // ==================== 访问器 ====================

    get rotation(): number {
        return this._rotation
    }
    set rotation(v: number) {
        if (this._rotation !== v) {
            this._rotation = v
            this.invalidate()
        }
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
            this._forceWorldUpdate()
        }
    }

    /**
     * 世界矩阵版本号。
     * 子级可通过比较此值来检测父级世界矩阵是否变化，无需逐帧访问 worldMatrix getter。
     */
    get worldVersion(): number {
        return this._lastWorldLocalVersion
    }

    /** 局部变换矩阵（只读，懒计算） */
    get matrix(): Matrix2D {
        if (this._localVersion !== this._lastLocalVersion) {
            this._updateLocalMatrix()
        }
        return this._matrix
    }

    /** 世界变换矩阵（只读，懒计算，自动跟随 parent 链） */
    get worldMatrix(): Matrix2D {
        if (this._needsWorldUpdate()) {
            this._updateWorldMatrix()
        }
        return this._worldMatrix
    }

    /** 世界变换矩阵的逆（只读，懒计算） */
    get worldMatrixInvert(): Matrix2D {
        // 先访问 worldMatrix 触发所有懒更新（含父级链）
        const wm = this.worldMatrix
        // 逆矩阵的版本号与世界矩阵版本一致则无需重算
        if (this._lastInvertLocalVersion !== this._lastWorldLocalVersion) {
            Matrix2D.invert(this._worldMatrixInvert, wm)
            this._lastInvertLocalVersion = this._lastWorldLocalVersion
        }
        return this._worldMatrixInvert
    }

    // ==================== 脏标记检查 ====================

    /** 本地矩阵是否需要重算 */
    private _isLocalDirty(): boolean {
        return this._localVersion !== this._lastLocalVersion
    }

    /** 本地版本是否变化（触发 world 重算） */
    private _needsWorldUpdate(): boolean {
        if (this._lastWorldLocalVersion !== this._localVersion) return true
        if (this._parent && this._parentWorldVersionChanged()) return true
        return false
    }

    /**
     * 父级世界矩阵是否自上次计算后发生了变化。
     * 先访问 parent.worldMatrix 触发祖孙链的懒更新，
     * 确保 parent.worldVersion 已反映所有祖先的变更。
     */
    private _parentWorldVersionChanged(): boolean {
        if (this._parent === null) return false
        // 触发 parent 递归更新（若 parent 的父级链有变化也会一并处理）
        void (this._parent.worldMatrix)
        return this._parent.worldVersion !== this._lastParentWorldVersion
    }

    // ==================== 矩阵计算 ====================

    /**
     * M_local = T(position) · Sk(skew) · S(scale) · R(rotation) · T(-origin)
     */
    private _updateLocalMatrix(): void {
        Matrix2D.fromTranslateRotationSkewScaleOrigin(
            this._matrix,
            this.position,
            this._rotation,
            this.skew,
            this.scale,
            this.origin,
        )
        this._lastLocalVersion = this._localVersion
    }

    /**
     * 计算世界变换矩阵。
     *
     * 无 parent: M_world = M_local
     * 有 parent: M_world = M_parent · M_local
     */
    private _updateWorldMatrix(): void {
        if (this._isLocalDirty()) {
            this._updateLocalMatrix()
        }

        if (this._parent) {
            Matrix2D.multiply(this._worldMatrix, this._parent.worldMatrix, this._matrix)
            this._lastParentWorldVersion = this._parent.worldVersion
        } else {
            this._worldMatrix.copy(this._matrix)
        }

        this._lastWorldLocalVersion = this._localVersion
    }

    // ==================== 公开方法 ====================

    /**
     * 强制标记为脏，下次访问 matrix/worldMatrix 时会重算。
     * 适用于批量设置多个属性后仅触发一次重算的场景。
     */
    invalidate(): void {
        this._localVersion++
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
        const [ a, b, c, d, tx, ty ] = this.worldMatrixInvert
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

    /**
     * 从矩阵反解变换属性写入自身。
     *
     * 分解顺序与 compose 一致，假定原点 (0, 0)。
     * 分解结果经 round-trip（分解后再 compose）与原矩阵等价。
     *
     * 步骤:
     *   1. 提取 scaleX 与 rotation（列向量模与方向）
     *   2. 移除旋转得 Sk·S 矩阵
     *   3. 提取 scaleY 与 skew
     *   4. 平移直接取 tx/ty
     */
    decomposeMatrix2D(matrix: Matrix2DLike): void {
        const a = matrix[0], b = matrix[1]
        const c = matrix[2], d = matrix[3]
        const px = matrix[4], py = matrix[5]

        // 1. scaleX 与 rotation — 从第一列提取
        const sx = Math.hypot(a, b)
        const rotation = sx > 1e-9 ? Math.atan2(b, a) : 0

        // 2. 移除旋转: M₂×₂ · R⁻¹ = Sk · S
        const cos = Math.cos(rotation)
        const sin = Math.sin(rotation)
        const a_p = a * cos - c * sin   // sx (before skew)
        const b_p = b * cos - d * sin   // tanY * sx
        const c_p = a * sin + c * cos   // tanX * sy
        const d_p = b * sin + d * cos   // sy (before skew)

        // 3. 提取 scaleY 与 skew
        const sy = d_p
        const tanX = sy !== 0 ? c_p / sy : 0
        const tanY = sx !== 0 ? b_p / sx : 0

        // 4. 写入内部属性（origin 固定为 0）
        this.position.set(px, py)
        this.scale.set(sx, sy)
        this._rotation = rotation
        this.skew.set(Math.atan(tanX), Math.atan(tanY))
        this.origin.set(0, 0)
    }

    // ---- 便捷设置（批量操作仅触发一次版本变更） ----

    /** 批量设置变换属性 */
    setTransform(
        position?: Vector2Like,
        scale?: Vector2Like,
        rotation?: number,
        skew?: Vector2Like,
        origin?: Vector2Like,
    ): this {
        if (position) this.position.copy(position)
        if (scale) this.scale.copy(scale)
        if (rotation !== undefined) this._rotation = rotation
        if (skew) this.skew.copy(skew)
        if (origin) this.origin.copy(origin)
        return this
    }

    /** 从另一个 Transform 拷贝变换属性 */
    copyFrom(other: Transform): this {
        this.position.copy(other.position)
        this.scale.copy(other.scale)
        this._rotation = other._rotation
        this.skew.copy(other.skew)
        this.origin.copy(other.origin)
        return this
    }

    // ---- 受保护的内部方法（供子类或同包使用） ----

    /** 清除世界矩阵缓存版本，强制下次 get 时重算（即使 local 未变） */
    protected _forceWorldUpdate(): void {
        this._lastWorldLocalVersion = -1
        this._lastInvertLocalVersion = -1
    }
}
