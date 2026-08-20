import { CachePool } from './CachePool';
import { Matrix2DLike } from './Matrix2D';
export type Vector2Like = {
    x: number;
    y: number;
};
export declare class Vector2 implements Vector2Like {
    static pool: CachePool<Vector2, []>;
    static default(): Vector2;
    static create(x?: number, y?: number): Vector2;
    static zero(): Vector2;
    static fromPoint(v: Vector2Like): Vector2;
    static fromValues(x: number, y: number): Vector2;
    static fromScalar(s: number): Vector2;
    /** 从夹角 (rad) 创建单位向量 */
    static fromAngle(angle: number): Vector2;
    /** 从类向量对象创建 */
    static from(v: Vector2Like): Vector2;
    /** 从数组创建 */
    static fromArray(arr: ArrayLike<number>): Vector2;
    /** out = a + b */
    static add(out: Vector2, a: Vector2Like, b: Vector2Like): Vector2;
    /** out = a - b */
    static subtract(out: Vector2, a: Vector2Like, b: Vector2Like): Vector2;
    static multiply(out: Vector2, a: Vector2Like, b: Vector2Like): Vector2;
    /** out = v * s */
    static multiplyScalar(out: Vector2, v: Vector2Like, s: number): Vector2;
    /** out = v / s */
    static divide(out: Vector2, v: Vector2Like, s: number): Vector2;
    /** out = -v */
    static negate(out: Vector2, v: Vector2Like): Vector2;
    /** out = normalized(v)；零向量时返回零向量 */
    static normalize(out: Vector2, v: Vector2Like): Vector2;
    /** a · b */
    static dot(a: Vector2Like, b: Vector2Like): number;
    /** a × b (2D 叉积 = 标量) */
    static cross(a: Vector2Like, b: Vector2Like): number;
    /** out = a 在 b 上的投影 */
    static project(out: Vector2, a: Vector2Like, b: Vector2Like): Vector2;
    static perp(out: Vector2, v: Vector2Like): Vector2;
    /** out = a 在 b 上的垂直（正交）分量 */
    static perpendicular(out: Vector2, a: Vector2Like, b: Vector2Like): Vector2;
    /** out = lerp(a, b, t)；t=0 得 a，t=1 得 b */
    static lerp(out: Vector2, a: Vector2Like, b: Vector2Like, t: number): Vector2;
    /** out = a 沿 b 方向按指定距离移动 */
    static moveTo(out: Vector2, a: Vector2Like, b: Vector2Like, distance: number): Vector2;
    /** |a - b| */
    static distance(a: Vector2Like, b: Vector2Like): number;
    /** |a - b|^2（避免 sqrt） */
    static distanceSquared(a: Vector2Like, b: Vector2Like): number;
    /** a 和 b 之间的夹角 (rad) */
    static angleBetween(a: Vector2Like, b: Vector2Like): number;
    static equals(a: Vector2Like, b: Vector2Like): boolean;
    /** 判断 a 与 b 是否近似相等 */
    static equalsEpsilon(a: Vector2Like, b: Vector2Like, epsilon?: number): boolean;
    /** out = min(a, b)（逐分量取最小） */
    static min(out: Vector2, a: Vector2Like, b: Vector2Like): Vector2;
    /** out = max(a, b)（逐分量取最大） */
    static max(out: Vector2, a: Vector2Like, b: Vector2Like): Vector2;
    /** out = clamp(v, min, max) */
    static clamp(out: Vector2, v: Vector2Like, min: Vector2Like, max: Vector2Like): Vector2;
    /** out = reflect(v, normal)；normal 需为单位向量 */
    static reflect(out: Vector2, v: Vector2Like, normal: Vector2Like): Vector2;
    /**
     * out = m * v（矩阵变换）
     */
    static applyMatrix2D(out: Vector2, v: Vector2Like, m: Matrix2DLike): Vector2;
    static translate(out: Vector2, v: Vector2Like, tx: number, ty: number): Vector2;
    static rotate(out: Vector2, v: Vector2Like, angle: number): Vector2;
    static scale(out: Vector2, v: Vector2Like, sx: number, sy: number): Vector2;
    /**
     * 计算点到线段的最短距离
     */
    static pointToSegmentDistance(p: Vector2Like, a: Vector2Like, b: Vector2Like): number;
    /**
     * 计算点到折线的距离
     */
    static pointToPolylineDistance(p: Vector2Like, points: Vector2Like[]): number;
    /**
     * 判断点是否在线段上（考虑线宽）
     */
    static isPointOnSegment(p: Vector2, a: Vector2, b: Vector2, lineWidth: number): boolean;
    /**
     * 计算两条线段的交点
     */
    static segmentIntersection(a1: Vector2Like, a2: Vector2Like, b1: Vector2Like, b2: Vector2Like): Vector2Like | null;
    x: number;
    y: number;
    isVector2: boolean;
    constructor(x?: number, y?: number);
    set(x: number, y: number): this;
    copy(v: Vector2Like): this;
    zero(): this;
    add(v: Vector2Like): this;
    subtract(v: Vector2Like): this;
    multiply(v: Vector2Like): this;
    multiplyScalar(s: number): this;
    divide(s: number): this;
    negate(): this;
    normalize(): this;
    lerp(to: Vector2Like, t: number): this;
    project(onto: Vector2Like): this;
    /** this = min(this, v)（逐分量取最小） */
    min(v: Vector2Like): this;
    /** this = max(this, v)（逐分量取最大） */
    max(v: Vector2Like): this;
    perp(): this;
    setLengthTo(x: number, y: number, length: number, originLength?: {
        value: number;
    }): boolean;
    /** 应用矩阵变换 this = m * this */
    applyMatrix2D(m: Matrix2DLike): this;
    /** 长度 */
    magnitude(): number;
    /** 长度的平方 */
    magnitudeSquared(): number;
    dot(v: Vector2Like): number;
    cross(v: Vector2Like): number;
    angle(v: Vector2Like): number;
    distanceTo(v: Vector2Like): number;
    distanceSquaredTo(v: Vector2Like): number;
    translate(tx: number, ty: number): Vector2;
    scale(sx: number, sy: number): Vector2;
    rotate(angle: number): this;
    equals(v: Vector2Like): boolean;
    equalsEpsilon(v: Vector2Like, epsilon?: number): boolean;
    isFinite(): boolean;
    isZero(): boolean;
    isOne(): boolean;
    clone(): Vector2;
    toArray(): [number, number];
    toString(): string;
}
