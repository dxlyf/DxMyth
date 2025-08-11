import { Vector2Like } from './vec2';
import { ITransformable } from './transformable';
export type Matrix2dLike = number[] | Float32Array;
declare function identity<T extends Matrix2dLike = Matrix2dLike>(out: T): T;
declare function translate<T extends Matrix2dLike = Matrix2dLike>(out: T, a: Matrix2dLike, v: Vector2Like): T;
declare function rotation<T extends Matrix2dLike = Matrix2dLike>(out: T, a: Matrix2dLike, radian: number): T;
declare function scale<T extends Matrix2dLike = Matrix2dLike>(out: T, a: Matrix2dLike, v: Vector2Like): T;
declare function makeTranslation<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like): T;
declare function makeRotation<T extends Matrix2dLike = Matrix2dLike>(out: T, radian: number): T;
declare function makeScale<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like): T;
declare function makeTranslationRotationScale<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like, radian: number, scale: Vector2Like): T;
declare function makeTranslationRotationScaleOrigin<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like, radian: number, scale: Vector2Like, origin: Vector2Like): T;
declare function makeTranslationSkewRotationScaleOrigin<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like, skew: Vector2Like, radian: number, scale: Vector2Like, origin: Vector2Like): T;
declare function makeTranslationRotationScaleOriginPivot<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like, radian: number, scale: Vector2Like, origin: Vector2Like, pivot: Vector2Like): T;
declare function makeTranslationSkewRotationScaleOriginPivot<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like, skew: Vector2Like, radian: number, scale: Vector2Like, origin: Vector2Like, pivot: Vector2Like): T;
declare function extractTranslation(out: Vector2Like, a: Matrix2dLike): Vector2Like;
declare function extractRotation(a: Matrix2dLike): number;
declare function extractScale(out: Vector2Like, a: Matrix2dLike): Vector2Like;
declare function extractOrigin(out: Vector2Like, a: Matrix2dLike): Vector2Like;
declare function decomposeTKRSPO(matrix: Matrix2dLike, transform: ITransformable): void;
/**
 * 分解 2D 变换矩阵，还原为平移、旋转和缩放值
 * @param out 输出数组，按顺序存储 [tx, ty, rotation, scaleX, scaleY]
 * @param a 输入的 2D 变换矩阵
 * @returns 输出数组
 */
declare function decompose(a: Matrix2dLike): {
    position: {
        x: number;
        y: number;
    };
    rotation: number;
    scale: {
        x: number;
        y: number;
    };
};
declare function multiply<T extends Matrix2dLike = Matrix2dLike>(out: T, a: Matrix2dLike, b: Matrix2dLike): T;
declare function invert<T extends Matrix2dLike = Matrix2dLike>(out: T, a: Matrix2dLike): T;
declare function mapPoint(out: Vector2Like, a: Matrix2dLike, v: Vector2Like): Vector2Like;
declare function mapPoints(out: Vector2Like[], a: Matrix2dLike, v: Vector2Like[]): Vector2Like[];
declare function hasIdentity(a: Matrix2dLike): boolean;
declare function hasTranslation(a: Matrix2dLike): boolean;
declare function hasRotation(a: Matrix2dLike): boolean;
declare function hasScale(a: Matrix2dLike): boolean;
/**
 * 列主序存储
 * 行主序(Row-major order) 优先存储每一行的数据，而列主序(Column-major order) 优先存储每一列的数据
 *
 * 如果是列主序，前面三个元素代表一列，如果是行主序，前面三个元素代表一行。
 * [1,0,0,0,1,0,0,0,1]
 *
 * 列主序每一列代表轴的朝向，行主序每一行代表轴的朝向。
 *
 * [1,0,0]
 * [0,1,0]
 * [0,0,1]
 *

 */
export declare class Matrix2D extends Float32Array {
    static IENTITY_MATRIX: Matrix2D;
    static default(): Matrix2D;
    static fromColumns(a: number, b: number, c: number, d: number, e: number, f: number): Matrix2D;
    static fromRows(a: number, c: number, e: number, b: number, d: number, f: number): Matrix2D;
    static fromMatrix2D(a: Matrix2dLike): Matrix2D;
    static fromSinCos(sin: number, cos: number): Matrix2D;
    static fromScale(sx: number, sy: number): Matrix2D;
    static fromTranslate(tx: number, ty: number): Matrix2D;
    static fromRotation(rad: number): Matrix2D;
    static fromAngle(deg: number): Matrix2D;
    static identity: typeof identity;
    static multiply: typeof multiply;
    static invert: typeof invert;
    static translate: typeof translate;
    static scale: typeof scale;
    static rotation: typeof rotation;
    static makeTranslation: typeof makeTranslation;
    static makeRotation: typeof makeRotation;
    static makeScale: typeof makeScale;
    static makeTranslationRotationScale: typeof makeTranslationRotationScale;
    static makeTranslationRotationScaleOrigin: typeof makeTranslationRotationScaleOrigin;
    static makeTranslationSkewRotationScaleOrigin: typeof makeTranslationSkewRotationScaleOrigin;
    static makeTranslationRotationScaleOriginPivot: typeof makeTranslationRotationScaleOriginPivot;
    static makeTranslationSkewRotationScaleOriginPivot: typeof makeTranslationSkewRotationScaleOriginPivot;
    static extractTranslation: typeof extractTranslation;
    static extractRotation: typeof extractRotation;
    static extractScale: typeof extractScale;
    static extractOrigin: typeof extractOrigin;
    static decomposeTKRSPO: typeof decomposeTKRSPO;
    static decompose: typeof decompose;
    static mapPoint: typeof mapPoint;
    static mapPoints: typeof mapPoints;
    static hasTranslation: typeof hasTranslation;
    static hasRotation: typeof hasRotation;
    static hasScale: typeof hasScale;
    static hasIdentity: typeof hasIdentity;
    constructor();
    get a(): number;
    set a(v: number);
    get b(): number;
    set b(v: number);
    get c(): number;
    set c(v: number);
    get d(): number;
    set d(v: number);
    get e(): number;
    set e(v: number);
    get f(): number;
    set f(v: number);
    get tx(): number;
    set tx(v: number);
    get ty(): number;
    set ty(v: number);
    copy(out: Matrix2dLike): this;
    clone(): Matrix2D;
    identity(): this;
    multiplyMatrices(a: Matrix2dLike, b: Matrix2dLike): this;
    premultiply(a: Matrix2dLike): this;
    multiply(a: Matrix2dLike): this;
    invert(): this;
    translate(v: Vector2Like): this;
    rotate(radian: number): this;
    scale(v: Vector2Like): this;
    makeTranslation(v: Vector2Like): this;
    makeRotation(radian: number): this;
    makeScale(v: Vector2Like): this;
    makeSkew(v: Vector2Like): this;
    makeTRS(v: Vector2Like, radian: number, scale: Vector2Like): this;
    makeTKRSOP(translate: Vector2Like, skew: Vector2Like, radian: number, scale: Vector2Like, origin: Vector2Like, pivot: Vector2Like): this;
    extractTranslation(out: Vector2Like): Vector2Like;
    extractRotation(): number;
    extractScale(out: Vector2Like): Vector2Like;
    extractOrigin(out: Vector2Like): Vector2Like;
    preScale(sx: number, sy: number): this;
    postScale(sx: number, sy: number): this;
    preRotate(angle: number): this;
    preRotateDegrees(angle: number): this;
    postRotate(angle: number): this;
    postRotateDegrees(angle: number): this;
    preTranslate(tx: number, ty: number): this;
    postTranslate(tx: number, ty: number): this;
    mapPoint(v: Vector2Like, out?: Vector2Like): Vector2Like;
    mapPoints(v: Vector2Like[], out?: Vector2Like[]): Vector2Like[];
    hasIdentity(): boolean;
    hasRotation(): boolean;
    hasScale(): boolean;
    decompose(transform: ITransformable): ITransformable;
    toMatrix3x3(columnMajorOrder?: boolean): Float32Array<ArrayBuffer>;
}
export {};
