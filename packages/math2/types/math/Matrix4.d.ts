import { CachePool } from './CachePool';
import { EulerLike, EulerOrder } from './Euler';
import { QuaternionLike } from './Quaternion';
import { Vector3Like } from './Vector3';
import { Vector4Like } from './Vector4';
/** 类矩阵输入：number[] 或 Float32Array（含 Matrix4 实例） */
export type Matrix4Like = number[] | Float32Array;
/** 矩阵元素索引常量（列主序） */
export declare const enum Matrix4Index {
    M00 = 0,
    M10 = 1,
    M20 = 2,
    M30 = 3,
    M01 = 4,
    M11 = 5,
    M21 = 6,
    M31 = 7,
    M02 = 8,
    M12 = 9,
    M22 = 10,
    M32 = 11,
    M03 = 12,
    M13 = 13,
    M23 = 14,
    M33 = 15
}
export declare class Matrix4 extends Float32Array {
    static pool: CachePool<Matrix4, []>;
    static identity(): Matrix4;
    static zero(): Matrix4;
    /** 按列主序 16 个元素构造 */
    static fromValues(m00: number, m10: number, m20: number, m30: number, m01: number, m11: number, m21: number, m31: number, m02: number, m12: number, m22: number, m32: number, m03: number, m13: number, m23: number, m33: number): Matrix4;
    static fromArray(arr: ArrayLike<number>): Matrix4;
    /** 平移矩阵 */
    static fromTranslation(tx: number, ty: number, tz: number): Matrix4;
    /** 缩放矩阵 */
    static fromScaling(sx: number, sy: number, sz: number): Matrix4;
    /** 绕任意轴（单位方向向量）旋转矩阵（rad） */
    static fromRotation(axis: Vector3Like, rad: number): Matrix4;
    /** 绕 X 轴旋转矩阵（rad） */
    static fromRotationX(rad: number): Matrix4;
    /** 绕 Y 轴旋转矩阵（rad） */
    static fromRotationY(rad: number): Matrix4;
    /** 绕 Z 轴旋转矩阵（rad） */
    static fromRotationZ(rad: number): Matrix4;
    /**
     * 从 旋转(轴角) + 平移 + 缩放 组合构造（列主序）
     * M = T(t) · R(axis, rad) · S(s)
     */
    static fromRotationTranslationScale(axis: Vector3Like, rad: number, translation: Vector3Like, scale: Vector3Like): Matrix4;
    /** 从 3x3 矩阵构造（左上 3x3 部分 + 单位第四行/列） */
    static fromMatrix3(m: ArrayLike<number>): Matrix4;
    /** 从四元数构造旋转矩阵（左上 3x3，第四行/列单位；q 需为单位四元数） */
    static fromQuaternion(q: QuaternionLike): Matrix4;
    /** 从欧拉角构造旋转矩阵（旋转顺序由 euler.order 决定，默认 XYZ） */
    static fromEuler(euler: EulerLike): Matrix4;
    /**
     * 透视投影矩阵
     * @param fovy   垂直视场角（rad）
     * @param aspect 宽高比 width/height
     * @param near   近裁剪面（> 0）
     * @param far    远裁剪面（> near）
     */
    static perspective(fovy: number, aspect: number, near: number, far: number): Matrix4;
    /** 正交投影矩阵 */
    static ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    /**
     * 观察矩阵（右手坐标系，gl-matrix 约定）
     * @param eye    相机位置
     * @param center 观察目标点
     * @param up     上方向
     */
    static lookAt(eye: Vector3Like, center: Vector3Like, up: Vector3Like): Matrix4;
    /** out = a * b（列主序矩阵乘法） */
    static multiply(out: Matrix4Like, a: Matrix4Like, b: Matrix4Like): Matrix4Like;
    /** out = m * s */
    static multiplyScalar(out: Matrix4Like, m: Matrix4Like, s: number): Matrix4Like;
    /** out = m 的转置 */
    static transpose(out: Matrix4Like, m: Matrix4Like): Matrix4Like;
    /** 行列式 */
    static determinant(m: Matrix4Like): number;
    /** out = m 的伴随矩阵 */
    static adjoint(out: Matrix4Like, m: Matrix4Like): Matrix4Like;
    /** out = m 的逆矩阵；行列式为 0 时返回 null */
    static invert(out: Matrix4Like, m: Matrix4Like): Matrix4Like | null;
    static equals(a: Matrix4Like, b: Matrix4Like): boolean;
    /** 按列主序 16 个元素构造，默认单位矩阵 */
    constructor(m00?: number, m10?: number, m20?: number, m30?: number, m01?: number, m11?: number, m21?: number, m31?: number, m02?: number, m12?: number, m22?: number, m32?: number, m03?: number, m13?: number, m23?: number, m33?: number);
    fromValues(m00: number, m10: number, m20: number, m30: number, m01: number, m11: number, m21: number, m31: number, m02: number, m12: number, m22: number, m32: number, m03: number, m13: number, m23: number, m33: number): this;
    identity(): this;
    fromArray(m: Matrix4Like): this;
    copy(m: Matrix4Like): this;
    /** 将左上 3x3 设置为四元数 q 对应的旋转矩阵（第四行/列单位；q 需为单位四元数） */
    setFromQuaternion(q: QuaternionLike): this;
    /**
     * 将左上 3x3 设置为欧拉角对应的旋转矩阵（第四行/列单位）
     * @param order 旋转顺序，默认取 euler.order ?? 'XYZ'
     */
    setFromEuler(euler: EulerLike, order?: EulerOrder): this;
    multiplyMatrices(a: Matrix4Like, b: Matrix4Like): this;
    multiply(m: Matrix4Like): this;
    /** this = m * this */
    premultiply(m: Matrix4Like): this;
    /** this = this * T(tx, ty, tz) */
    translate(tx: number, ty: number, tz: number): this;
    /** this = this * R(axis, rad) */
    rotate(axis: Vector3Like, rad: number): this;
    rotateX(rad: number): this;
    rotateY(rad: number): this;
    rotateZ(rad: number): this;
    /** this = this * S(sx, sy, sz) */
    scale(sx: number, sy: number, sz: number): this;
    transpose(): this;
    /** 求逆；行列式为 0 时返回 null */
    invert(): Matrix4 | null;
    adjoint(): this;
    determinant(): number;
    equals(m: Matrix4Like): boolean;
    isIdentity(): boolean;
    isSingular(): boolean;
    /** out = m * v（w=1，带透视除法） */
    transformVector3(out: Vector3Like, v: Vector3Like): Vector3Like;
    /** out = m * v（含 w 分量，不做透视除法） */
    transformVector4(out: Vector4Like, v: Vector4Like): Vector4Like;
    /** 2D 点变换（z=0, w=1，带透视除法） */
    transformPoint(out: Vector3Like, v: Vector3Like): Vector3Like;
    clone(): Matrix4;
    toArray(): number[];
    toString(): string;
}
