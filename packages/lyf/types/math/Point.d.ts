import { Matrix2DLike } from '../interface/IMatrix2D';
import { IPoint, PointLike } from '../interface/IPoint';
export declare class Point implements IPoint {
    _x: number;
    _y: number;
    _cb: (point: IPoint) => void;
    constructor(x?: number, y?: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    onChange: (cb: (point: IPoint) => void) => void;
    change(): void;
    clone(): IPoint;
    copy(point: PointLike): IPoint;
    set(x: number, y: number): IPoint;
    add(point: PointLike): IPoint;
    subtract(point: PointLike): IPoint;
    multiply(point: PointLike): IPoint;
    divide(point: PointLike): IPoint;
    multiplyScalar(scalar: number): IPoint;
    applyMatrix2D(matrix: Matrix2DLike): IPoint;
}
