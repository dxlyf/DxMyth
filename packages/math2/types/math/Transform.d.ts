import { Matrix2D, Matrix2DLike } from './Matrix2D';
import { Vector2Like } from './Vector2';
import { Point } from './Point';
export declare class Transform {
    position: Point;
    scale: Point;
    private _rotation;
    skew: Point;
    origin: Point;
    /** 父级变换（设置后 worldMatrix 自动跟随父级） */
    private _parent;
    private _matrix;
    private _worldMatrix;
    private _worldMatrixInvert;
    /** 当前局部属性版本（Point onChange 或 rotation setter 自动递增） */
    private _localVersion;
    /** 上次计算 _matrix 时的 _localVersion */
    private _lastLocalVersion;
    /** 上次计算 _worldMatrix 时的 _localVersion */
    private _lastWorldLocalVersion;
    /** 上次计算 _worldMatrix 时 parent.worldVersion 的值 */
    private _lastParentWorldVersion;
    /** 上次计算 _worldMatrixInvert 时的 _localVersion */
    private _lastInvertLocalVersion;
    /** 变化回调 */
    private _onChange;
    constructor();
    get rotation(): number;
    set rotation(v: number);
    /**
     * 注册变化回调。当任一变换属性发生变化时触发。
     * 与 Point.onChange 模式一致，返回 this 便于链式调用。
     */
    onChange(cb: () => void): this;
    /** 父级变换 */
    get parent(): Transform | null;
    set parent(v: Transform | null);
    /**
     * 世界矩阵版本号。
     * 子级可通过比较此值来检测父级世界矩阵是否变化，无需逐帧访问 worldMatrix getter。
     */
    get worldVersion(): number;
    /** 局部变换矩阵（只读，懒计算） */
    get matrix(): Matrix2D;
    /** 世界变换矩阵（只读，懒计算，自动跟随 parent 链） */
    get worldMatrix(): Matrix2D;
    /** 世界变换矩阵的逆（只读，懒计算） */
    get worldMatrixInvert(): Matrix2D;
    /** 本地矩阵是否需要重算 */
    private _isLocalDirty;
    /** 本地版本是否变化（触发 world 重算） */
    private _needsWorldUpdate;
    /**
     * 父级世界矩阵是否自上次计算后发生了变化。
     * 先访问 parent.worldMatrix 触发祖孙链的懒更新，
     * 确保 parent.worldVersion 已反映所有祖先的变更。
     */
    private _parentWorldVersionChanged;
    /**
     * M_local = T(position) · Sk(skew) · S(scale) · R(rotation) · T(-origin)
     */
    private _updateLocalMatrix;
    /**
     * 计算世界变换矩阵。
     *
     * 无 parent: M_world = M_local
     * 有 parent: M_world = M_parent · M_local
     */
    private _updateWorldMatrix;
    /**
     * 强制标记为脏，下次访问 matrix/worldMatrix 时会重算。
     * 适用于批量设置多个属性后仅触发一次重算的场景。
     */
    invalidate(): void;
    /** 重置所有变换为默认值 */
    reset(): void;
    /**
     * 将世界坐标转换为本地坐标。
     * result = M_world⁻¹ · point
     */
    worldToLocal<T extends Vector2Like>(point: Vector2Like, out: T): T;
    /**
     * 将本地坐标转换为世界坐标。
     * result = M_world · point
     */
    localToWorld<T extends Vector2Like>(point: Vector2Like, out: T): T;
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
    decomposeMatrix2D(matrix: Matrix2DLike): void;
    /** 批量设置变换属性 */
    setTransform(position?: Vector2Like, scale?: Vector2Like, rotation?: number, skew?: Vector2Like, origin?: Vector2Like): this;
    /** 从另一个 Transform 拷贝变换属性 */
    copyFrom(other: Transform): this;
    /** 清除世界矩阵缓存版本，强制下次 get 时重算（即使 local 未变） */
    protected _forceWorldUpdate(): void;
}
