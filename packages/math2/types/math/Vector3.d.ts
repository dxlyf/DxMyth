import { CachePool } from './CachePool';
import { Matrix3Like } from './Matrix3';
import { Matrix4Like } from './Matrix4';
export type Vector3Like = {
    x: number;
    y: number;
    z: number;
};
export declare class Vector3 implements Vector3Like {
    static pool: CachePool<Vector3, []>;
    static default(): Vector3;
    static create(x?: number, y?: number, z?: number): Vector3;
    static zero(): Vector3;
    static one(): Vector3;
    static fromValues(x: number, y: number, z: number): Vector3;
    static fromScalar(s: number): Vector3;
    /** 从类向量对象创建 */
    static from(v: Vector3Like): Vector3;
    /** 从数组创建 */
    static fromArray(arr: ArrayLike<number>): Vector3;
    /** X 轴单位向量 */
    static unitX(): Vector3;
    /** Y 轴单位向量 */
    static unitY(): Vector3;
    /** Z 轴单位向量 */
    static unitZ(): Vector3;
    /** out = a + b */
    static add(out: Vector3, a: Vector3Like, b: Vector3Like): Vector3;
    /** out = a - b */
    static subtract(out: Vector3, a: Vector3Like, b: Vector3Like): Vector3;
    /** out = a ⊙ b（逐分量相乘） */
    static multiply(out: Vector3, a: Vector3Like, b: Vector3Like): Vector3;
    /** out = v * s */
    static multiplyScalar(out: Vector3, v: Vector3Like, s: number): Vector3;
    /** out = v / s */
    static divide(out: Vector3, v: Vector3Like, s: number): Vector3;
    /** out = -v */
    static negate(out: Vector3, v: Vector3Like): Vector3;
    /** out = normalized(v)；零向量时返回零向量 */
    static normalize(out: Vector3, v: Vector3Like): Vector3;
    /** a · b */
    static dot(a: Vector3Like, b: Vector3Like): number;
    /** out = a × b（3D 叉积） */
    static cross(out: Vector3, a: Vector3Like, b: Vector3Like): Vector3;
    /** out = a 在 b 上的投影 */
    static project(out: Vector3, a: Vector3Like, b: Vector3Like): Vector3;
    /** out = lerp(a, b, t)；t=0 得 a，t=1 得 b */
    static lerp(out: Vector3, a: Vector3Like, b: Vector3Like, t: number): Vector3;
    /** |a - b| */
    static distance(a: Vector3Like, b: Vector3Like): number;
    /** |a - b|²（避免 sqrt） */
    static distanceSquared(a: Vector3Like, b: Vector3Like): number;
    /** a 和 b 之间的夹角 (rad) */
    static angleBetween(a: Vector3Like, b: Vector3Like): number;
    static equals(a: Vector3Like, b: Vector3Like): boolean;
    /** 判断 a 与 b 是否近似相等 */
    static equalsEpsilon(a: Vector3Like, b: Vector3Like, epsilon?: number): boolean;
    /** out = min(a, b)（逐分量取最小） */
    static min(out: Vector3, a: Vector3Like, b: Vector3Like): Vector3;
    /** out = max(a, b)（逐分量取最大） */
    static max(out: Vector3, a: Vector3Like, b: Vector3Like): Vector3;
    /** out = clamp(v, min, max) */
    static clamp(out: Vector3, v: Vector3Like, min: Vector3Like, max: Vector3Like): Vector3;
    /** out = reflect(v, normal)；normal 需为单位向量 */
    static reflect(out: Vector3, v: Vector3Like, normal: Vector3Like): Vector3;
    /** out = m * v（3x3 矩阵变换，列主序） */
    static applyMatrix3(out: Vector3, v: Vector3Like, m: Matrix3Like): Vector3;
    /** out = m * v（4x4 矩阵变换，w=1 带透视除法，列主序） */
    static applyMatrix4(out: Vector3, v: Vector3Like, m: Matrix4Like): Vector3;
    x: number;
    y: number;
    z: number;
    isVector3: boolean;
    constructor(x?: number, y?: number, z?: number);
    set(x: number, y: number, z: number): this;
    copy(v: Vector3Like): this;
    zero(): this;
    one(): this;
    add(v: Vector3Like): this;
    subtract(v: Vector3Like): this;
    multiply(v: Vector3Like): this;
    multiplyScalar(s: number): this;
    divide(s: number): this;
    negate(): this;
    normalize(): this;
    lerp(to: Vector3Like, t: number): this;
    project(onto: Vector3Like): this;
    /** this = min(this, v)（逐分量取最小） */
    min(v: Vector3Like): this;
    /** this = max(this, v)（逐分量取最大） */
    max(v: Vector3Like): this;
    cross(v: Vector3Like): this;
    /** this = m * this（3x3 矩阵变换） */
    applyMatrix3(m: Matrix3Like): this;
    /** this = m * this（4x4 矩阵变换，带透视除法） */
    applyMatrix4(m: Matrix4Like): this;
    /** 长度 */
    magnitude(): number;
    /** 长度的平方 */
    magnitudeSquared(): number;
    dot(v: Vector3Like): number;
    crossWith(v: Vector3Like): Vector3;
    angle(v: Vector3Like): number;
    distanceTo(v: Vector3Like): number;
    distanceSquaredTo(v: Vector3Like): number;
    equals(v: Vector3Like): boolean;
    equalsEpsilon(v: Vector3Like, epsilon?: number): boolean;
    isFinite(): boolean;
    isZero(): boolean;
    isOne(): boolean;
    clone(): Vector3;
    toArray(): [number, number, number];
    toString(): string;
}
