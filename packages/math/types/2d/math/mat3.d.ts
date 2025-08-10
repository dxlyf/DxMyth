import { Vector2Like } from './vec2';
type Matrix3Like = number[] | Float32Array;
declare function identity<T extends Matrix3Like = Matrix3Like>(out: T): T;
declare function multiply<T extends Matrix3Like = Matrix3Like>(out: T, a: Matrix3Like, b: Matrix3Like): T;
declare function makeTranslation<T extends Matrix3Like = Matrix3Like>(out: T, vec: Vector2Like): T;
declare function makeRotation<T extends Matrix3Like = Matrix3Like>(out: T, rad: number): T;
declare function makeScale<T extends Matrix3Like = Matrix3Like>(out: T, vec: Vector2Like): T;
declare function makeSkew<T extends Matrix3Like = Matrix3Like>(out: T, k: Vector2Like): T;
declare function makeProjection<T extends Matrix3Like = Matrix3Like>(out: T, width: number, height: number): T;
declare function makeTranslationRotationScale<T extends Matrix3Like = Matrix3Like>(out: T, translation: Vector2Like, rotation: number, scale: Vector2Like): T;
declare function makeTranslationRotationScaleOrigin<T extends Matrix3Like = Matrix3Like>(out: T, translation: Vector2Like, rotation: number, scale: Vector2Like, origin: Vector2Like): T;
declare function makeTranslationRotationScaleOriginPivot<T extends Matrix3Like = Matrix3Like>(out: T, translation: Vector2Like, rotation: number, scale: Vector2Like, origin: Vector2Like, pivot: Vector2Like): T;
declare function makeTranslationSkewRotationScaleOriginPivot<T extends Matrix3Like = Matrix3Like>(out: T, translation: Vector2Like, skew: Vector2Like, rotation: number, scale: Vector2Like, origin: Vector2Like, pivot: Vector2Like): T;
declare function extractTranslation(out: Vector2Like, a: Matrix3Like): Vector2Like;
declare function extractRotation(a: Matrix3Like): number;
declare function extractScale(out: Vector2Like, a: Matrix3Like): Vector2Like;
/**
 * 矩阵分解
 * @param out 输出矩阵
 * @param a 输入矩阵
 * @returns 矩阵的行列式
*/
declare function decompose<T extends Matrix3Like = Matrix3Like>(out: T, a: Matrix3Like): number;
declare function adjugate<T extends Matrix3Like = Matrix3Like>(out: T, a: Matrix3Like): T;
declare function determinant(a: Matrix3Like): number;
declare function invert<T extends Matrix3Like = Matrix3Like>(out: T, a: Matrix3Like): T | null;
declare function transpose<T extends Matrix3Like = Matrix3Like>(out: T, a: Matrix3Like): void;
declare function fromValues<T extends Matrix3Like = Matrix3Like>(out: T, m00: number, m01: number, m02: number, m10: number, m11: number, m12: number, m20: number, m21: number, m22: number): T;
declare function mapPoint(out: Vector2Like, a: Matrix3Like, v: Vector2Like): Vector2Like;
declare function mapPoints(out: Vector2Like[], a: Matrix3Like, v: Vector2Like[]): Vector2Like[];
declare function projection<T extends Matrix3Like = Matrix3Like>(out: T, width: number, height: number): T;
/**
 * 列主序存储 [1,0,0,1,0,0,0,0,1]
 */
export declare class Matrix3 extends Float32Array {
    static default(): Matrix3;
    static identity: typeof identity;
    static multiply: typeof multiply;
    static invert: typeof invert;
    static makeProjection: typeof makeProjection;
    static makeTranslation: typeof makeTranslation;
    static makeRotation: typeof makeRotation;
    static makeScale: typeof makeScale;
    static makeTranslationRotationScale: typeof makeTranslationRotationScale;
    static makeTranslationRotationScaleOrigin: typeof makeTranslationRotationScaleOrigin;
    static makeTranslationRotationScaleOriginPivot: typeof makeTranslationRotationScaleOriginPivot;
    static makeTranslationSkewRotationScaleOriginPivot: typeof makeTranslationSkewRotationScaleOriginPivot;
    static extractTranslation: typeof extractTranslation;
    static extractRotation: typeof extractRotation;
    static extractScale: typeof extractScale;
    static decompose: typeof decompose;
    static adjugate: typeof adjugate;
    static determinant: typeof determinant;
    static transpose: typeof transpose;
    static fromValues: typeof fromValues;
    static makeSkew: typeof makeSkew;
    static mapPoint: typeof mapPoint;
    static mapPoints: typeof mapPoints;
    static projection: typeof projection;
    constructor();
    identity(): this;
    multiplyMatrices(a: Matrix3Like, b: Matrix3Like): this;
    premultiply(a: Matrix3Like): this;
    multiply(a: Matrix3Like): this;
    translate(vec: Matrix3Like): this;
    rotate(rad: number): this;
    scale(vec: Matrix3Like): this;
    makeTranslation(vec: Vector2Like): this;
    makeRotation(rad: number): this;
    makeScale(vec: Vector2Like): this;
    makeSkew(k: Vector2Like): this;
    makeTRS(v: Vector2Like, radian: number, scale: Vector2Like): this;
    adjugate(): this;
    determinant(): number;
    invert(): this | null;
    transpose(): void;
    hasTranslation(): boolean;
    hasRotation(): boolean;
    hasScale(): boolean;
    hasIdentity(): boolean;
    mapPoint(v: Vector2Like, out?: Vector2Like): Vector2Like;
    mapPoints(v: Vector2Like[], out?: Vector2Like[]): Vector2Like[];
    projection(width: number, height: number): this;
}
export {};
