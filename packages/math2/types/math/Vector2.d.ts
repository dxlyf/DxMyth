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
    static fromRotation(angle: number): Vector2;
    /** 从夹角 (rad) 创建单位向量 */
    static fromAngle(angle: number): Vector2;
    /** 从类向量对象创建 */
    static from(v: Vector2Like): Vector2;
    /** 从数组创建 */
    static fromArray(arr: ArrayLike<number>): Vector2;
    /** out = a + b */
    static add<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like): T;
    static addScalar<T extends Vector2Like>(out: T, a: Vector2Like, s: number): T;
    static addScaledVector<T extends Vector2Like>(out: T, a: Vector2Like, v: Vector2Like, s: number): T;
    /** out = a - b */
    static subtract<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like): T;
    static multiply<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like): T;
    /** out = v * s */
    static multiplyScalar<T extends Vector2Like>(out: T, v: Vector2Like, s: number): T;
    /** out = v / s */
    static divide<T extends Vector2Like>(out: T, v: Vector2Like, s: Vector2Like): T;
    /** out = -v */
    static negate<T extends Vector2Like>(out: T, v: Vector2Like): T;
    /** out = normalized(v)；零向量时返回零向量 */
    static normalize<T extends Vector2Like>(out: T, v: Vector2Like): T;
    /** a · b */
    static dot(a: Vector2Like, b: Vector2Like): number;
    /** a × b (2D 叉积 = 标量) */
    static cross(a: Vector2Like, b: Vector2Like): number;
    /** out = a 在 b 上的投影 */
    static project<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like): T;
    static set<T extends Vector2Like>(out: T, x: number, y: number): T;
    static perpendicular<T extends Vector2Like>(out: T, v: Vector2Like): T;
    static rotateCW<T extends Vector2Like>(out: T, v: Vector2Like): T;
    static rotateCCW<T extends Vector2Like>(out: T, v: Vector2Like): T;
    /** out = lerp(a, b, t)；t=0 得 a，t=1 得 b */
    static lerp<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like, t: number): T;
    /** out = a 沿 b 方向按指定距离移动 */
    static moveTo<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like, distance: number): T;
    /** |a - b| */
    static distance(a: Vector2Like, b: Vector2Like): number;
    /** |a - b|^2（避免 sqrt） */
    static distanceSquared(a: Vector2Like, b: Vector2Like): number;
    /** a 和 b 之间的夹角 (rad),[0,PI] */
    static angleTo(a: Vector2Like, b: Vector2Like): number;
    static angleToSigned(a: Vector2Like, b: Vector2Like): number;
    static angle(v: Vector2Like): number;
    static equals(a: Vector2Like, b: Vector2Like): boolean;
    /** 判断 a 与 b 是否近似相等 */
    static equalsEpsilon(a: Vector2Like, b: Vector2Like, epsilon?: number): boolean;
    /** out = min(a, b)（逐分量取最小） */
    static min<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like): T;
    /** out = max(a, b)（逐分量取最大） */
    static max<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like): T;
    /** out = clamp(v, min, max) */
    static clamp<T extends Vector2Like>(out: T, v: Vector2Like, min: Vector2Like, max: Vector2Like): T;
    static clampScalar<T extends Vector2Like>(out: T, v: Vector2Like, min: number, max: number): T;
    static clampLength<T extends Vector2Like>(out: T, v: Vector2Like, min: number, max: number): T;
    static magnitude(v: Vector2Like): number;
    /** out = reflect(v, normal)；normal 需为单位向量 */
    static reflect<T extends Vector2Like>(out: T, v: Vector2Like, normal: Vector2Like): T;
    /**
     * out = m * v（矩阵变换）
     */
    static applyMatrix2D<T extends Vector2Like>(out: T, v: Vector2Like, m: Matrix2DLike): T;
    static translate<T extends Vector2Like>(out: T, v: Vector2Like, tx: number, ty: number): T;
    static rotate<T extends Vector2Like>(out: T, v: Vector2Like, angle: number, origin?: Vector2Like): T;
    static scale<T extends Vector2Like>(out: T, v: Vector2Like, sx: number, sy: number): T;
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
    static isPointOnSegment(p: Vector2Like, a: Vector2Like, b: Vector2Like, lineWidth: number): boolean;
    /**
     * 计算两条线段的交点
     */
    static segmentIntersection(a1: Vector2Like, a2: Vector2Like, b1: Vector2Like, b2: Vector2Like): {
        x: number;
        y: number;
    };
    static random<T extends Vector2Like>(out: T, min: Vector2Like, max: Vector2Like): T;
    static randomScalar<T extends Vector2Like>(out: T, min: number, max: number): T;
    x: number;
    y: number;
    isVector2: boolean;
    constructor(x?: number, y?: number);
    set(x: number, y: number): this;
    copy(v: Vector2Like): this;
    zero(): this;
    add(v: Vector2Like): this;
    addScalar(s: number): this;
    addScaledVector(v: Vector2Like, s: number): this;
    subtract(v: Vector2Like): this;
    multiply(v: Vector2Like): this;
    multiplyScalar(s: number): this;
    divide(v: Vector2Like): this;
    divideScalar(scalar: number): this;
    negate(): this;
    normalize(): this;
    lerp(to: Vector2Like, t: number): this;
    project(onto: Vector2Like): this;
    /** this = min(this, v)（逐分量取最小） */
    min(v: Vector2Like): this;
    /** this = max(this, v)（逐分量取最大） */
    max(v: Vector2Like): this;
    perp(): this;
    perpendicular(): this;
    rotateCW(): this;
    rotateCCW(): this;
    setLength(len: number): this;
    setLengthTo(x: number, y: number, length: number, originLength?: {
        value: number;
    }): boolean;
    /** 应用矩阵变换 this = m * this */
    applyMatrix2D(m: Matrix2DLike): this;
    clamp(min: Vector2Like, max: Vector2Like): this;
    clampScalar(min: number, max: number): this;
    clampLength(min: number, max: number): this;
    /** 长度 */
    magnitude(): number;
    /** 长度的平方 */
    magnitudeSquared(): number;
    dot(v: Vector2Like): number;
    cross(v: Vector2Like): number;
    angle(): number;
    angleTo(v: Vector2Like): number;
    angleToSigned(v: Vector2Like): number;
    distance(v: Vector2Like): number;
    distanceTo(v: Vector2Like): number;
    distanceSquaredTo(v: Vector2Like): number;
    translate(tx: number, ty: number): this;
    scale(sx: number, sy: number): this;
    rotate(angle: number, origin?: Vector2Like): this;
    floor(): this;
    ceil(): this;
    round(): this;
    truncate(): this;
    abs(): this;
    sign(): this;
    fract(): this;
    isFinite(): boolean;
    isZero(): boolean;
    isOne(): boolean;
    clone(): Vector2;
    toArray(): [number, number];
    toString(): string;
    equals(v: Vector2Like): boolean;
    equalsEpsilon(v: Vector2Like, epsilon?: number): boolean;
}
