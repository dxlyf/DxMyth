import { PointLike } from './IPoint';
export type Matrix2DLike = number[] | Float32Array;
export interface IMatrix2D extends Float32Array {
    clone(): IMatrix2D;
    copy(m: Matrix2DLike): IMatrix2D;
    isIdentity(): boolean;
    isScaleIdentity(): boolean;
    isTranslateIdentity(): boolean;
    isRotateIdentity(): boolean;
    identity(): IMatrix2D;
    fromTranslateSkewRotationScaleOrigin(translate: PointLike, skew: PointLike, rotate: number, scale: PointLike, origin: PointLike): IMatrix2D;
    multiplyMatrices(m: Matrix2DLike, n: Matrix2DLike): IMatrix2D;
    preMultiply(m: Matrix2DLike): IMatrix2D;
    postMultiply(m: Matrix2DLike): IMatrix2D;
    inverse(): IMatrix2D;
    determinant(): number;
    mapPoint(point: PointLike): PointLike;
    mapPoint(out: PointLike, point: PointLike): PointLike;
    mapPoints(points: PointLike[]): PointLike[];
    mapPoints(out: PointLike[], points: PointLike[]): PointLike[];
}
