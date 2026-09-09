import { Matrix2D, Matrix2DLike } from './Matrix2D';
import { Vector2Like } from './Vector2';
import { Point } from './Point';
import { EventEmitter } from '../events/EventEmitter';
export type TransformProps = {
    position?: Vector2Like;
    rotation?: number;
    scale?: Vector2Like;
    skew?: Vector2Like;
    origin?: Vector2Like;
    pivot?: Vector2Like;
};
export type TransformEvents = {
    'transform:change': [transform: Transform<TransformEvents>];
};
export declare class Transform<Events extends TransformEvents = any> extends EventEmitter<TransformEvents> {
    position: Point;
    scale: Point;
    private _rotation;
    skew: Point;
    origin: Point;
    pivot: Point;
    /** 父级变换（设置后 worldMatrix 自动跟随父级） */
    parent: Transform<Events> | null;
    private _matrix;
    private _worldMatrix;
    private _worldMatrixInvert;
    private _worldScale;
    /** 当前局部属性版本（Point onChange 或 rotation setter 自动递增） */
    private _localMatrixDirty;
    private _worldMatrixDirty;
    private _worldVersion;
    private _parentWorldVersion;
    constructor(options?: TransformProps);
    get rotation(): number;
    set rotation(v: number);
    get angle(): number;
    set angle(v: number);
    /** 局部变换矩阵（只读，懒计算） */
    get matrix(): Matrix2D;
    /** 获取世界矩阵的全局缩放系数 */
    get worldScale(): number;
    /** 世界变换矩阵（只读，懒计算，自动跟随 parent 链） */
    get worldMatrix(): Matrix2D;
    /** 世界变换矩阵的逆（只读，懒计算） */
    get worldMatrixInvert(): Matrix2D;
    /** 本地版本是否变化（触发 world 重算） */
    _needsWorldUpdate(): boolean;
    updateMatrix(force?: boolean): void;
    /**
     * 计算世界变换矩阵。
     *
     * 无 parent: M_world = M_local
     * 有 parent: M_world = M_parent · M_local
     */
    updateWorldMatrix(force?: boolean): void;
    /**
     * 强制标记为脏，下次访问 matrix/worldMatrix 时会重算。
     * 适用于批量设置多个属性后仅触发一次重算的场景。
     */
    updateTransform(): void;
    onTransformChange(): void;
    /** 重置所有变换为默认值 */
    resetTransform(): void;
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
    decompose(matrix: Matrix2DLike): void;
    /** 批量设置变换属性 */
    setTransform(options: TransformProps): this;
    /** 从另一个 Transform 拷贝变换属性 */
    copyFrom(other: Transform): this;
}
