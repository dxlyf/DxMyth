import { IMatrix2D, Matrix2DLike } from '../interface/IMatrix2D';
import { PointLike } from '../interface/IPoint';
export declare const copy: (out: Matrix2DLike, m: Matrix2DLike) => Matrix2DLike;
export declare const identity: (out: Matrix2DLike) => Matrix2DLike;
export declare const multiplyMatrices: (out: Matrix2DLike, m: Matrix2DLike, n: Matrix2DLike) => Matrix2DLike;
export declare const inverse: (out: Matrix2DLike, m: Matrix2DLike) => Matrix2DLike;
export declare const determinant: (m: Matrix2DLike) => number;
export declare const adjoint: (out: Matrix2DLike, m: Matrix2DLike) => Matrix2DLike;
export declare const mapPoint: (out: PointLike, point: PointLike, m: Matrix2DLike) => PointLike;
export declare const mapPoints: (out: PointLike[], points: PointLike[], m: Matrix2DLike) => PointLike[];
export declare const fromTranslateRotateScale: (out: Matrix2DLike, translate: PointLike, rotate: number, scale: PointLike) => Matrix2DLike;
export declare const fromTranslate: (out: Matrix2DLike, x: number, y: number) => Matrix2DLike;
export declare const fromRotate: (out: Matrix2DLike, rotate: number) => Matrix2DLike;
/**
 * 从倾斜角度创建矩阵
 * @param out
 * @param skewX 倾斜系数（斜率）
 * @param skewY 倾斜系数（斜率）
 * @returns
 */
export declare const fromSkew: (out: Matrix2DLike, skewX: number, skewY: number) => Matrix2DLike;
export declare const fromSkewAngle: (out: Matrix2DLike, angleX: number, angleY: number) => Matrix2DLike;
export declare const fromScale: (out: Matrix2DLike, scale: number) => Matrix2DLike;
export declare const fromTranslateSkewRotationScaleOrigin: (out: Matrix2DLike, translate: PointLike, skew: PointLike, rotate: number, scale: PointLike, origin: PointLike) => Matrix2DLike;
/**
 * 根
 * @param m
 * @param origin
 */
export declare const extractTranslateSkewRotationScaleOrigin: (m: Matrix2DLike, origin: PointLike) => {
    translate: {
        x: number;
        y: number;
    };
    skew: {
        x: number;
        y: number;
    };
    rotation: number;
    scale: {
        x: number;
        y: number;
    };
};
export declare class Matrix2D extends Float32Array implements IMatrix2D {
    clone(): IMatrix2D;
    copy(m: Matrix2DLike): IMatrix2D;
    isIdentity(): boolean;
    isScaleIdentity(): boolean;
    isTranslateIdentity(): boolean;
    isRotateIdentity(): boolean;
    identity(): IMatrix2D;
    multiplyMatrices(m: Matrix2DLike, n: Matrix2DLike): IMatrix2D;
    preMultiply(m: Matrix2DLike): IMatrix2D;
    postMultiply(m: Matrix2DLike): IMatrix2D;
    inverse(): IMatrix2D;
    determinant(): number;
    fromTranslateSkewRotationScaleOrigin(translate: PointLike, skew: PointLike, rotate: number, scale: PointLike, origin: PointLike): IMatrix2D;
    mapPoint(point: PointLike): PointLike;
    mapPoint(out: PointLike, point: PointLike): PointLike;
    mapPoints(points: PointLike[]): PointLike[];
    mapPoints(out: PointLike[], points: PointLike[]): PointLike[];
}
