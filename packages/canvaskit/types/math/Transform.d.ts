import { EventEmitter } from '../../../../../../../src/events';
import { Vector2, Vector2Like } from './Vector2';
import { Matrix2D } from './Matrix2D';
export interface TransformOptions {
    position?: Vector2Like;
    rotation?: number;
    angle?: number;
    scale?: Vector2Like;
    pivot?: Vector2Like;
}
export declare class Transform<Options, E extends EventEmitter.ValidEventTypes> extends EventEmitter<E> {
    parent: Transform<Options, E> | null;
    pivot: Vector2;
    position: Vector2;
    protected _rotation: number;
    scale: Vector2;
    protected _matrix: Matrix2D;
    protected _worldMatrix: Matrix2D;
    protected _worldInverseMatrix: Matrix2D;
    protected _matrixDirty: boolean;
    protected _matrixId: number;
    /**
     * -1：表示父矩阵无效，需要重新计算世界矩阵
     * 0： 表示世界矩阵有效，不需要重新计算世界矩阵
    */
    protected _parentMatrixId: number;
    constructor(options?: TransformOptions);
    get rotation(): number;
    set rotation(v: number);
    get angle(): number;
    set angle(v: number);
    get matrix(): Matrix2D;
    get worldMatrix(): Matrix2D;
    get worldInverseMatrix(): Matrix2D;
    protected shouldUpdateWorldMatrix(): boolean;
    setTransformFromMatrix(matrix: Matrix2D): void;
    worldToLocal(vec: Vector2Like, out?: Vector2): Vector2Like;
    localToWorld(vec: Vector2Like, out?: Vector2): Vector2Like;
    updateTransform(): void;
    updateMatrix(): void;
    updateWorldMatrix(): void;
}
