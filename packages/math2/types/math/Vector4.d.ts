import { CachePool } from './CachePool';
import { Matrix4Like } from './Matrix4';
export type Vector4Like = {
    x: number;
    y: number;
    z: number;
    w: number;
};
export declare class Vector4 implements Vector4Like {
    static pool: CachePool<Vector4, []>;
    static default(): Vector4;
    static create(x?: number, y?: number, z?: number, w?: number): Vector4;
    static zero(): Vector4;
    static one(): Vector4;
    static fromValues(x: number, y: number, z: number, w?: number): Vector4;
    static fromScalar(s: number): Vector4;
    /** 从类向量对象创建 */
    static from(v: Vector4Like): Vector4;
    /** 从数组创建 */
    static fromArray(arr: ArrayLike<number>): Vector4;
    /** 从 Vector3 创建（默认 w=1） */
    static fromVector3(v: {
        x: number;
        y: number;
        z: number;
    }, w?: number): Vector4;
    /** out = a + b */
    static add(out: Vector4, a: Vector4Like, b: Vector4Like): Vector4;
    /** out = a - b */
    static subtract(out: Vector4, a: Vector4Like, b: Vector4Like): Vector4;
    /** out = a ⊙ b（逐分量相乘） */
    static multiply(out: Vector4, a: Vector4Like, b: Vector4Like): Vector4;
    /** out = v * s */
    static multiplyScalar(out: Vector4, v: Vector4Like, s: number): Vector4;
    /** out = v / s */
    static divide(out: Vector4, v: Vector4Like, s: number): Vector4;
    /** out = -v */
    static negate(out: Vector4, v: Vector4Like): Vector4;
    /** out = normalized(v)；零向量时返回零向量 */
    static normalize(out: Vector4, v: Vector4Like): Vector4;
    /** a · b */
    static dot(a: Vector4Like, b: Vector4Like): number;
    /** out = a 在 b 上的投影 */
    static project(out: Vector4, a: Vector4Like, b: Vector4Like): Vector4;
    /** out = lerp(a, b, t)；t=0 得 a，t=1 得 b */
    static lerp(out: Vector4, a: Vector4Like, b: Vector4Like, t: number): Vector4;
    /** |a - b| */
    static distance(a: Vector4Like, b: Vector4Like): number;
    /** |a - b|²（避免 sqrt） */
    static distanceSquared(a: Vector4Like, b: Vector4Like): number;
    static equals(a: Vector4Like, b: Vector4Like): boolean;
    /** 判断 a 与 b 是否近似相等 */
    static equalsEpsilon(a: Vector4Like, b: Vector4Like, epsilon?: number): boolean;
    /** out = min(a, b)（逐分量取最小） */
    static min(out: Vector4, a: Vector4Like, b: Vector4Like): Vector4;
    /** out = max(a, b)（逐分量取最大） */
    static max(out: Vector4, a: Vector4Like, b: Vector4Like): Vector4;
    /** out = clamp(v, min, max) */
    static clamp(out: Vector4, v: Vector4Like, min: Vector4Like, max: Vector4Like): Vector4;
    /** out = m * v（4x4 矩阵变换，含 w 分量，列主序） */
    static applyMatrix4(out: Vector4, v: Vector4Like, m: Matrix4Like): Vector4;
    x: number;
    y: number;
    z: number;
    w: number;
    isVector4: boolean;
    constructor(x?: number, y?: number, z?: number, w?: number);
    set(x: number, y: number, z: number, w: number): this;
    copy(v: Vector4Like): this;
    zero(): this;
    one(): this;
    add(v: Vector4Like): this;
    subtract(v: Vector4Like): this;
    multiply(v: Vector4Like): this;
    multiplyScalar(s: number): this;
    divide(s: number): this;
    negate(): this;
    normalize(): this;
    lerp(to: Vector4Like, t: number): this;
    project(onto: Vector4Like): this;
    /** this = min(this, v)（逐分量取最小） */
    min(v: Vector4Like): this;
    /** this = max(this, v)（逐分量取最大） */
    max(v: Vector4Like): this;
    /** this = m * this（4x4 矩阵变换，含 w 分量） */
    applyMatrix4(m: Matrix4Like): this;
    /** 长度 */
    magnitude(): number;
    /** 长度的平方 */
    magnitudeSquared(): number;
    dot(v: Vector4Like): number;
    distanceTo(v: Vector4Like): number;
    distanceSquaredTo(v: Vector4Like): number;
    equals(v: Vector4Like): boolean;
    equalsEpsilon(v: Vector4Like, epsilon?: number): boolean;
    isFinite(): boolean;
    isZero(): boolean;
    clone(): Vector4;
    toArray(): [number, number, number, number];
    toString(): string;
}
