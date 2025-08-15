import { Vector2Like, Vector2Point } from './vec2';
import { Matrix2D } from './mat2d';
export declare class ObservablePoint extends Float32Array {
    static create(x: number, y: number): ObservablePoint;
    constructor(x: number, y: number);
    get x(): number;
    get y(): number;
    set x(x: number);
    set y(y: number);
    _change(p: ObservablePoint): void;
    onChange(callback: (p: ObservablePoint) => void): void;
    copy(o: Vector2Like): void;
    setXY(x: number, y: number): void;
    set(a: any, length: number): void;
}
export interface TransformableProps {
    position?: Vector2Point;
    rotation?: number;
    angle?: number;
    scale?: Vector2Point;
    origin?: Vector2Point;
    pivot?: Vector2Point;
    skew?: Vector2Point;
}
export interface ITransformable {
    parent: ITransformable | null;
    position: ObservablePoint;
    skew: ObservablePoint;
    scale: ObservablePoint;
    origin: ObservablePoint;
    pivot: ObservablePoint;
    angle: number;
    rotation: number;
    readonly matrix: Matrix2D;
    readonly worldMatrix: Matrix2D;
    localMatrixDirty: boolean;
    worldMatrixId: number;
    parentWorldMatrixId: number;
    readonly hasWorldMatrixDirty: boolean;
    setTransformWithOptions(options?: Partial<TransformableProps>): void;
    setTransformFromMatrix(matrix: Matrix2D): void;
    updateMatrix(): void;
    updateWorldMatrix(): void;
    onTransformChange(): void;
}
export declare class Transformable<Props extends TransformableProps> implements ITransformable {
    position: ObservablePoint;
    _rotation: number;
    _cx: number;
    _sx: number;
    _cy: number;
    _sy: number;
    skew: ObservablePoint;
    scale: ObservablePoint;
    origin: ObservablePoint;
    pivot: ObservablePoint;
    _matrix: Matrix2D;
    _matrixWorld: Matrix2D;
    localMatrixDirty: boolean;
    worldMatrixId: number;
    parentWorldMatrixId: number;
    parent: ITransformable | null;
    children: ITransformable[] | null;
    constructor(props?: Partial<Props>);
    get rotation(): number;
    set rotation(rotation: number);
    get angle(): number;
    set angle(angle: number);
    get hasWorldMatrixDirty(): boolean;
    get matrix(): Matrix2D;
    get worldMatrix(): Matrix2D;
    setTransformWithOptions(options?: Partial<TransformableProps>): void;
    setTransformFromMatrix(matrix: Matrix2D): void;
    updateMatrix(): void;
    updateWorldMatrix(): void;
    onUpdateTransformable: (p?: ObservablePoint) => void;
    _updateSkew(): void;
    onTransformChange(): void;
}
