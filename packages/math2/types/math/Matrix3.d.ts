import { CachePool } from './CachePool';
import { Vector3Like } from './Vector3';
/** 类矩阵输入：number[] 或 Float32Array（含 Matrix3 实例） */
export type Matrix3Like = number[] | Float32Array;
/** 矩阵元素索引常量（列主序） */
export declare const enum Matrix3Index {
    M00 = 0,
    M10 = 1,
    M20 = 2,
    M01 = 3,
    M11 = 4,
    M21 = 5,
    M02 = 6,
    M12 = 7,
    M22 = 8
}
export declare class Matrix3 extends Float32Array {
    static pool: CachePool<Matrix3, []>;
    static identity(): Matrix3;
    static zero(): Matrix3;
    /** 按列主序 9 个元素构造：m00,m10,m20, m01,m11,m21, m02,m12,m22 */
    static fromValues(m00: number, m10: number, m20: number, m01: number, m11: number, m21: number, m02: number, m12: number, m22: number): Matrix3;
    static fromArray(arr: ArrayLike<number>): Matrix3;
    /** 2D 平移矩阵 */
    static fromTranslation(tx: number, ty: number): Matrix3;
    /** 2D 缩放矩阵 */
    static fromScaling(sx: number, sy: number): Matrix3;
    /** 2D 旋转矩阵（rad，逆时针为正） */
    static fromRotation(rad: number): Matrix3;
    /** 绕 X 轴旋转矩阵（rad） */
    static fromRotationX(rad: number): Matrix3;
    /** 绕 Y 轴旋转矩阵（rad） */
    static fromRotationY(rad: number): Matrix3;
    /** 绕 Z 轴旋转矩阵（rad） */
    static fromRotationZ(rad: number): Matrix3;
    /** 绕任意轴（单位方向向量）旋转矩阵（rad） */
    static fromRotationAxis(axis: Vector3Like, rad: number): Matrix3;
    /** 从 2D 仿射矩阵（Matrix2D 布局 [a,b,c,d,tx,ty]）构造 3x3 */
    static fromMatrix2D(m: ArrayLike<number>): Matrix3;
    /** out = a * b（列主序矩阵乘法） */
    static multiply(out: Matrix3Like, a: Matrix3Like, b: Matrix3Like): Matrix3Like;
    /** out = m * s */
    static multiplyScalar(out: Matrix3Like, m: Matrix3Like, s: number): Matrix3Like;
    /** out = m 的转置 */
    static transpose(out: Matrix3Like, m: Matrix3Like): Matrix3Like;
    /** 行列式 */
    static determinant(m: Matrix3Like): number;
    /** out = m 的伴随矩阵 */
    static adjoint(out: Matrix3Like, m: Matrix3Like): Matrix3Like;
    /** out = m 的逆矩阵；行列式为 0 时返回 null */
    static invert(out: Matrix3Like, m: Matrix3Like): Matrix3Like | null;
    static equals(a: Matrix3Like, b: Matrix3Like): boolean;
    /** 按列主序 9 个元素构造：m00,m10,m20, m01,m11,m21, m02,m12,m22 */
    constructor(m00?: number, m10?: number, m20?: number, m01?: number, m11?: number, m21?: number, m02?: number, m12?: number, m22?: number);
    get m00(): number;
    set m00(v: number);
    get m10(): number;
    set m10(v: number);
    get m20(): number;
    set m20(v: number);
    get m01(): number;
    set m01(v: number);
    get m11(): number;
    set m11(v: number);
    get m21(): number;
    set m21(v: number);
    get m02(): number;
    set m02(v: number);
    get m12(): number;
    set m12(v: number);
    get m22(): number;
    set m22(v: number);
    fromValues(m00: number, m10: number, m20: number, m01: number, m11: number, m21: number, m02: number, m12: number, m22: number): this;
    identity(): this;
    fromArray(m: Matrix3Like): this;
    copy(m: Matrix3Like): this;
    multiplyMatrices(a: Matrix3Like, b: Matrix3Like): this;
    multiply(m: Matrix3Like): this;
    /** this = m * this */
    premultiply(m: Matrix3Like): this;
    /** this = this * T(tx, ty) */
    translate(tx: number, ty: number): this;
    /** this = this * R(rad)（2D 旋转） */
    rotate(rad: number): this;
    /** this = this * S(sx, sy)（2D 缩放） */
    scale(sx: number, sy: number): this;
    transpose(): this;
    /** 求逆；行列式为 0 时返回 null */
    invert(): Matrix3 | null;
    adjoint(): this;
    determinant(): number;
    equals(m: Matrix3Like): boolean;
    isIdentity(): boolean;
    isSingular(): boolean;
    /** out = m * v */
    transformVector3(out: Vector3Like, v: Vector3Like): Vector3Like;
    /** 2D 点变换（齐次坐标，w=1） */
    transformPoint(out: Vector3Like, v: Vector3Like): Vector3Like;
    clone(): Matrix3;
    toArray(): number[];
    toString(): string;
}
