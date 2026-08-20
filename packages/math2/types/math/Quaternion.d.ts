import { CachePool } from './CachePool';
import { Matrix3, Matrix3Like } from './Matrix3';
import { Matrix4 } from './Matrix4';
import { EulerLike } from './Euler';
import { Vector3Like } from './Vector3';
export type QuaternionLike = {
    x: number;
    y: number;
    z: number;
    w: number;
};
export declare class Quaternion implements QuaternionLike {
    static pool: CachePool<Quaternion, []>;
    static identity(): Quaternion;
    static zero(): Quaternion;
    static fromValues(x: number, y: number, z: number, w: number): Quaternion;
    static from(q: QuaternionLike): Quaternion;
    static fromArray(arr: ArrayLike<number>): Quaternion;
    /** 绕任意轴（单位方向向量）旋转 angle（rad） */
    static fromAxisAngle(axis: Vector3Like, angle: number): Quaternion;
    static fromRotationX(rad: number): Quaternion;
    static fromRotationY(rad: number): Quaternion;
    static fromRotationZ(rad: number): Quaternion;
    /** 从欧拉角构造（旋转顺序由 euler.order 决定） */
    static fromEuler(euler: EulerLike): Quaternion;
    /** 从 3x3 旋转矩阵提取四元数 */
    static fromMatrix3(m: Matrix3Like): Quaternion;
    /** out = a + b */
    static add(out: Quaternion, a: QuaternionLike, b: QuaternionLike): Quaternion;
    /** out = a - b */
    static subtract(out: Quaternion, a: QuaternionLike, b: QuaternionLike): Quaternion;
    /** out = a * b（Hamilton 积，表示先 b 后 a 的复合旋转） */
    static multiply(out: Quaternion, a: QuaternionLike, b: QuaternionLike): Quaternion;
    /** out = q * s */
    static multiplyScalar(out: Quaternion, q: QuaternionLike, s: number): Quaternion;
    /** out = -q */
    static negate(out: Quaternion, q: QuaternionLike): Quaternion;
    /** out = normalized(q)；零四元数返回零 */
    static normalize(out: Quaternion, q: QuaternionLike): Quaternion;
    /** a · b */
    static dot(a: QuaternionLike, b: QuaternionLike): number;
    /** out = 共轭（-x, -y, -z, w）；单位四元数共轭即逆 */
    static conjugate(out: Quaternion, q: QuaternionLike): Quaternion;
    /** out = q⁻¹（共轭除以模长平方）；零四元数返回零 */
    static invert(out: Quaternion, q: QuaternionLike): Quaternion;
    /** out = lerp(a, b, t)（线性插值，非球面） */
    static lerp(out: Quaternion, a: QuaternionLike, b: QuaternionLike, t: number): Quaternion;
    /** out = slerp(a, b, t)（球面插值，自动取最短弧） */
    static slerp(out: Quaternion, a: QuaternionLike, b: QuaternionLike, t: number): Quaternion;
    static equals(a: QuaternionLike, b: QuaternionLike): boolean;
    static equalsEpsilon(a: QuaternionLike, b: QuaternionLike, epsilon?: number): boolean;
    /** a 与 b 之间的夹角 (rad)：2·acos(|a·b|) */
    static angleBetween(a: QuaternionLike, b: QuaternionLike): number;
    /** out = q * v * q⁻¹（旋转向量 v，q 需为单位四元数） */
    static rotateVector(out: Vector3Like, v: Vector3Like, q: QuaternionLike): Vector3Like;
    /** out = q 对应的 3x3 旋转矩阵（列主序） */
    static toMatrix3(q: QuaternionLike, out?: Matrix3): Matrix3;
    /** out = q 对应的 4x4 旋转矩阵（列主序，第四行/列单位） */
    static toMatrix4(q: QuaternionLike, out?: Matrix4): Matrix4;
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    set(x: number, y: number, z: number, w: number): this;
    copy(q: QuaternionLike): this;
    identity(): this;
    zero(): this;
    /** 绕任意轴（axis 自动归一化）旋转 angle（rad） */
    setFromAxisAngle(axis: Vector3Like, angle: number): this;
    /** 从欧拉角构造（旋转顺序由 euler.order 决定） */
    setFromEuler(euler: EulerLike): this;
    /** 从 3x3 旋转矩阵提取四元数 */
    setFromRotationMatrix3(m: Matrix3Like): this;
    add(q: QuaternionLike): this;
    subtract(q: QuaternionLike): this;
    /** this = this * q */
    multiply(q: QuaternionLike): this;
    /** this = q * this */
    premultiply(q: QuaternionLike): this;
    multiplyScalar(s: number): this;
    negate(): this;
    normalize(): this;
    conjugate(): this;
    /** 求逆；零四元数返回零 */
    invert(): this;
    lerp(to: QuaternionLike, t: number): this;
    slerp(to: QuaternionLike, t: number): this;
    /** this = q * this * q⁻¹ 旋转向量 v（写入 out 并返回） */
    rotateVector(out: Vector3Like, v: Vector3Like): Vector3Like;
    length(): number;
    lengthSquared(): number;
    dot(q: QuaternionLike): number;
    /** 与 q 的夹角 (rad) */
    angleTo(q: QuaternionLike): number;
    equals(q: QuaternionLike): boolean;
    equalsEpsilon(q: QuaternionLike, epsilon?: number): boolean;
    isFinite(): boolean;
    isIdentity(): boolean;
    isZero(): boolean;
    toMatrix3(out?: Matrix3): Matrix3;
    toMatrix4(out?: Matrix4): Matrix4;
    clone(): Quaternion;
    toArray(): [number, number, number, number];
    toString(): string;
}
