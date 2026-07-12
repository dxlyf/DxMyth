import { CachePool } from './CachePool';
import { Vector2Like } from './Vector2';
/** 矩阵元素索引常量 */
export declare const enum MatrixIndex {
    A = 0,// scaleX (cosθ)
    B = 1,// skewY  (sinθ)
    C = 2,// skewX  (-sinθ)
    D = 3,// scaleY (cosθ)
    TX = 4,// translateX
    TY = 5
}
export type Matrix2DLike = number[] | Float32Array;
/**
 * 基于 Float32Array 的 2D 仿射变换矩阵。
 * 直接继承 Float32Array，与 WebGL / Skia / CanvasKit 的底层数据格式兼容。
 */
export declare class Matrix2D extends Float32Array {
    static pool: CachePool<Matrix2D, []>;
    static identity(): Matrix2D;
    static fromArray(arr: ArrayLike<number>): Matrix2D;
    static fromTranslate(tx: number, ty: number): Matrix2D;
    static fromScale(sx: number, sy: number): Matrix2D;
    static fromRotate(angle: number): Matrix2D;
    static fromSkew(sx: number, sy: number): Matrix2D;
    /**
     * 通过变换参数组合构建仿射矩阵（静态，写入 out）。
     *
     * M = T(position) · Sk(skew) · S(scale) · R(rotation) · T(-origin)
     *
     * @param out      写入目标矩阵
     * @param position 平移 { x, y }
     * @param rotation 旋转角 (rad)
     * @param skew     倾斜 { x, y }
     * @param scale    缩放 { x, y }（默认 {1,1}）
     * @param origin   变换原点 { x, y }（默认 {0,0}）
     */
    static fromTranslateRotationSkewScaleOrigin(out: Matrix2DLike, position: Vector2Like, rotation: number, skew: Vector2Like, scale?: Vector2Like, origin?: Vector2Like): Matrix2DLike;
    /** out = a * b */
    static multiply(out: Matrix2DLike, a: Matrix2DLike, b: Matrix2DLike): Matrix2DLike;
    /** out = m 的逆矩阵；行列式为 0 时返回 null */
    static invert(out: Matrix2DLike, m: Matrix2DLike): Matrix2DLike;
    /** 判断两个矩阵是否相等 */
    static equals(a: Matrix2DLike, b: Matrix2DLike): boolean;
    static mapPoint(out: Vector2Like, matrix: Matrix2DLike, v: Vector2Like): Vector2Like;
    static mapPoints(out: Vector2Like[], matrix: Matrix2DLike, points: Vector2Like[]): Vector2Like[];
    constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
    get a(): number;
    set a(v: number);
    get b(): number;
    set b(v: number);
    get c(): number;
    set c(v: number);
    get d(): number;
    set d(v: number);
    get tx(): number;
    set tx(v: number);
    get ty(): number;
    set ty(v: number);
    fromValues(a: number, b: number, c: number, d: number, tx: number, ty: number): this;
    identity(): this;
    fromArray(m: Matrix2DLike): void;
    /** 重置为平移矩阵 */
    fromTranslate(tx: number, ty: number): this;
    /** 重置为缩放矩阵 */
    fromScale(sx: number, sy: number): this;
    /** 重置为旋转矩阵 */
    fromRotation(angle: number): this;
    /** 重置为倾斜矩阵 */
    fromSkew(sx: number, sy: number): this;
    copy(m: Matrix2D): this;
    multiplyMatrices(a: Matrix2DLike, b: Matrix2DLike): this;
    multiply(m: Matrix2DLike): this;
    /** this = m * this */
    premultiply(m: Matrix2DLike): this;
    translate(tx: number, ty: number): this;
    scale(sx: number, sy: number): this;
    rotate(angle: number): this;
    skew(sx: number, sy: number): this;
    /**
     * 通过变换参数组合构建仿射矩阵（实例，写入 this）。
     * 等价于 `Matrix2D.fromTranslateRotationSkewScaleOrigin(this, ...)`
     */
    composeFromTransform(position: Vector2Like, rotation: number, skew: Vector2Like, scale?: Vector2Like, origin?: Vector2Like): this;
    invert(): Matrix2D;
    /**
     * 从变换对象构建矩阵（实例，写入 this）。
     *
     * @param transform { position, scale?, skew?, rotation?, origin? }
     */
    fromTransform(transform: {
        position: Vector2Like;
        scale?: Vector2Like;
        skew?: Vector2Like;
        rotation?: number;
        origin?: Vector2Like;
    }): this;
    /** 行列式 */
    determinant(): number;
    isIdentity(): boolean;
    isSingular(): boolean;
    equals(m: Matrix2DLike): boolean;
    /** X 轴缩放量（含旋转影响） */
    getScaleX(): number;
    /** Y 轴缩放量（含旋转影响） */
    getScaleY(): number;
    /** 旋转角 (rad) */
    getRotation(): number;
    /** p = this * (x, y) */
    mapPoint(out: Vector2Like, v: Vector2Like): Vector2Like;
    mapPoints(out: Vector2Like[], points: Vector2Like[]): Vector2Like[];
    transformPoint(v: Vector2Like): Vector2Like;
    clone(): Matrix2D;
    toString(): string;
}
