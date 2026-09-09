// ============================================================
// Vector2 — 2D 向量
// ============================================================

import { CachePool } from "./CachePool"
import { clamp, degToRad } from "./MathUtils"
import type { Matrix2DLike } from "./Matrix2D"

export type Vector2Like = {
    x: number
    y: number
}




export class Vector2 implements Vector2Like {
    static pool = CachePool.create({
        initSize: 20,
        create: () => new Vector2(0, 0),
        init(item: Vector2) {
            item.set(0, 0)
        }
    })
    // ---- 静态工厂 ----
    static default() {
        return this.create()
    }
    static create(x: number = 0, y: number = 0) {
        return new Vector2(x, y)
    }
    static zero(): Vector2 {
        return new Vector2(0, 0)
    }
    static fromPoint(v: Vector2Like): Vector2 {
        return new Vector2(v.x, v.y)
    }
    static fromValues(x: number, y: number): Vector2 {
        return new Vector2(x, y)
    }

    static fromScalar(s: number): Vector2 {
        return new Vector2(s, s)
    }
    static fromRotation(angle: number): Vector2 {
        return new Vector2(Math.cos(angle), Math.sin(angle))
    }
    /** 从夹角 (rad) 创建单位向量 */
    static fromAngle(angle: number): Vector2 {
        return new Vector2(Math.cos(degToRad(angle)), Math.sin(degToRad(angle)))
    }
    /** 从类向量对象创建 */
    static from(v: Vector2Like): Vector2 {
        return new Vector2(v.x, v.y)
    }

    /** 从数组创建 */
    static fromArray(arr: ArrayLike<number>): Vector2 {
        return new Vector2(arr[0], arr[1])
    }

    // ---- 静态运算（out 可复用） ----

    /** out = a + b */
    static add<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like) {
        out.x = a.x + b.x
        out.y = a.y + b.y
        return out
    }
    static addScalar<T extends Vector2Like>(out: T, a: Vector2Like, s: number) {
        out.x = a.x + s
        out.y = a.y + s;
        return out
    }
    static addScaledVector<T extends Vector2Like>(out: T, a: Vector2Like, v: Vector2Like, s: number) {
        out.x = a.x + v.x * s
        out.y = a.y + v.y * s
        return out
    }

    /** out = a - b */
    static subtract<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like) {
        out.x = a.x - b.x
        out.y = a.y - b.y
        return out
    }
    static multiply<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like) {
        out.x = a.x * b.x
        out.y = a.y * b.y
        return out
    }
    /** out = v * s */
    static multiplyScalar<T extends Vector2Like>(out: T, v: Vector2Like, s: number) {
        out.x = v.x * s
        out.y = v.y * s
        return out
    }

    /** out = v / s */
    static divide<T extends Vector2Like>(out: T, v: Vector2Like, s: number) {
        out.x = v.x / s
        out.y = v.y / s
        return out
    }

    /** out = -v */
    static negate<T extends Vector2Like>(out: T, v: Vector2Like) {
        out.x = -v.x
        out.y = -v.y
        return out
    }

    /** out = normalized(v)；零向量时返回零向量 */
    static normalize<T extends Vector2Like>(out: T, v: Vector2Like) {
        const len = Vector2.magnitude(v)
        if (len === 0) {
            out.x = 0
            out.y = 0
            return out
        }
        out.x = v.x / len
        out.y = v.y / len
        return out
    }

    /** a · b */
    static dot(a: Vector2Like, b: Vector2Like): number {
        return a.x * b.x + a.y * b.y
    }

    /** a × b (2D 叉积 = 标量) */
    static cross(a: Vector2Like, b: Vector2Like): number {
        return a.x * b.y - a.y * b.x
    }

    /** out = a 在 b 上的投影 */
    static project<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like) {
        const dot = Vector2.dot(a, b)
        const lenSq = Vector2.dot(b, b)
        if (lenSq === 0) {
            out.x = 0
            out.y = 0
            return out
        }
        const s = dot / lenSq
        out.x = b.x * s
        out.y = b.y * s
        return out
    }
    static set<T extends Vector2Like>(out: T, x: number, y: number) {
        out.x = x
        out.y = y
        return out
    }
    static perpendicular<T extends Vector2Like>(out: T, v: Vector2Like) {
        return Vector2.set(out, -v.y, v.x)
    }
    static rotateCW<T extends Vector2Like>(out: T, v: Vector2Like) {
        return Vector2.set(out, -v.y, v.x)
    }
    static rotateCCW<T extends Vector2Like>(out: T, v: Vector2Like) {
        return Vector2.set(out, v.y, -v.x)
    }
    /** out = lerp(a, b, t)；t=0 得 a，t=1 得 b */
    static lerp<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like, t: number) {
        out.x = a.x + (b.x - a.x) * t
        out.y = a.y + (b.y - a.y) * t
        return out
    }

    /** out = a 沿 b 方向按指定距离移动 */
    static moveTo<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like, distance: number) {
        const dx = b.x - a.x
        const dy = b.y - a.y
        const len = Math.hypot(dx, dy)
        if (len === 0) {
            out.x = a.x
            out.y = a.y
            return out
        }
        out.x = a.x + (dx / len) * distance
        out.y = a.y + (dy / len) * distance
        return out
    }

    /** |a - b| */
    static distance(a: Vector2Like, b: Vector2Like): number {
        return Math.hypot(a.x - b.x, a.y - b.y)
    }

    /** |a - b|^2（避免 sqrt） */
    static distanceSquared(a: Vector2Like, b: Vector2Like): number {
        const dx = a.x - b.x
        const dy = a.y - b.y
        return dx * dx + dy * dy
    }

    /** a 和 b 之间的夹角 (rad),[0,PI] */
    static angleTo(a: Vector2Like, b: Vector2Like): number {
        const dot = Vector2.dot(a, b)
        const lenProd = Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y)
        if (lenProd === 0) return 0
        return Math.acos(Math.max(-1, Math.min(1, dot / lenProd)))
    }
    // [-pi,pi]
    static angleToSigned(a: Vector2Like, b: Vector2Like): number {
        return Math.atan2(Vector2.cross(a, b), Vector2.dot(a, b))
    }
    // [-PI,PI]
    static angle(v: Vector2Like): number {
        return Math.atan2(v.y, v.x)
    }


    static equals(a: Vector2Like, b: Vector2Like): boolean {
        return a.x === b.x && a.y === b.y
    }
    /** 判断 a 与 b 是否近似相等 */
    static equalsEpsilon(a: Vector2Like, b: Vector2Like, epsilon: number = 1e-9): boolean {
        return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon
    }

    /** out = min(a, b)（逐分量取最小） */
    static min<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like) {
        out.x = Math.min(a.x, b.x)
        out.y = Math.min(a.y, b.y)
        return out
    }

    /** out = max(a, b)（逐分量取最大） */
    static max<T extends Vector2Like>(out: T, a: Vector2Like, b: Vector2Like) {
        out.x = Math.max(a.x, b.x)
        out.y = Math.max(a.y, b.y)
        return out
    }

    /** out = clamp(v, min, max) */
    static clamp<T extends Vector2Like>(out: T, v: Vector2Like, min: Vector2Like, max: Vector2Like) {
        out.x = clamp(v.x, min.x, max.x)
        out.y = clamp(v.y, min.y, max.y)
        return out
    }
    static clampScalar<T extends Vector2Like>(out: T, v: Vector2Like, min: number, max: number) {
        out.x = clamp(v.x, min, max)
        out.y = clamp(v.y, min, max)
        return out
    }
    static clampLength<T extends Vector2Like>(out: T, v: Vector2Like, min: number, max: number) {
        const length = Vector2.magnitude(v) || 1
        const s = clamp(length, min, max)
        out.x = v.x / length * s
        out.y = v.y / length * s
        return out
    }
    static magnitude(v: Vector2Like) {
        return Math.sqrt(v.x * v.x + v.y * v.y)
    }
    /** out = reflect(v, normal)；normal 需为单位向量 */
    static reflect<T extends Vector2Like>(out: T, v: Vector2Like, normal: Vector2Like) {
        const d = 2 * Vector2.dot(v, normal)
        out.x = v.x - d * normal.x
        out.y = v.y - d * normal.y
        return out
    }

    /**
     * out = m * v（矩阵变换）
     */
    static applyMatrix2D<T extends Vector2Like>(out: T, v: Vector2Like, m: Matrix2DLike) {
        const x = v.x, y = v.y
        out.x = m[0] * x + m[2] * y + m[4]
        out.y = m[1] * x + m[3] * y + m[5]
        return out
    }
    static translate<T extends Vector2Like>(out: T, v: Vector2Like, tx: number, ty: number) {
        out.x = v.x + tx
        out.y = v.y + ty
        return out
    }
    static rotate<T extends Vector2Like>(out: T, v: Vector2Like, angle: number, origin?: Vector2Like) {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        const ox = origin?.x ?? 0
        const oy = origin?.y ?? 0
        const x = v.x - ox
        const y = v.y - oy
        out.x = x * c - y * s + ox
        out.y = y * s + x * c + oy
        return out
    }
    static scale<T extends Vector2Like>(out: T, v: Vector2Like, sx: number, sy: number) {
        out.x = v.x * sx
        out.y = v.y * sy
        return out
    }

    /**
     * 计算点到线段的最短距离
     */
    static pointToSegmentDistance(p: Vector2Like, a: Vector2Like, b: Vector2Like): number {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const lenSq = dx * dx + dy * dy;

        if (lenSq === 0) {
            return this.distance(p, a);
        }

        // 计算投影参数 t
        let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
        t = Math.max(0, Math.min(1, t));

        // 投影点
        const projX = a.x + t * dx;
        const projY = a.y + t * dy;

        return this.distance(p, { x: projX, y: projY });
    }

    /**
     * 计算点到折线的距离
     */
    static pointToPolylineDistance(p: Vector2Like, points: Vector2Like[]): number {
        if (points.length < 2) return Infinity;

        let minDist = Infinity;
        for (let i = 0; i < points.length - 1; i++) {
            const dist = this.pointToSegmentDistance(p, points[i], points[i + 1]);
            if (dist < minDist) minDist = dist;
        }
        return minDist;
    }

    /**
     * 判断点是否在线段上（考虑线宽）
     */
    static isPointOnSegment(p: Vector2Like, a: Vector2Like, b: Vector2Like, lineWidth: number): boolean {
        const dist = this.pointToSegmentDistance(p, a, b);
        return dist <= lineWidth / 2;
    }

    /**
     * 计算两条线段的交点
     */
    static segmentIntersection(a1: Vector2Like, a2: Vector2Like, b1: Vector2Like, b2: Vector2Like) {
        const d1x = a2.x - a1.x;
        const d1y = a2.y - a1.y;
        const d2x = b2.x - b1.x;
        const d2y = b2.y - b1.y;

        const denom = d1x * d2y - d1y * d2x;
        if (Math.abs(denom) < 1e-10) return null;

        const t = ((b1.x - a1.x) * d2y - (b1.y - a1.y) * d2x) / denom;
        const u = ((b1.x - a1.x) * d1y - (b1.y - a1.y) * d1x) / denom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: a1.x + t * d1x,
                y: a1.y + t * d1y
            };
        }
        return null;
    }
    static random<T extends Vector2Like>(out: T, min: Vector2Like, max: Vector2Like) {
        out.x = Math.floor(Math.random() * (max.x - min.x + 1) + min.x);
        out.y = Math.floor(Math.random() * (max.y - min.y + 1) + min.y);
        return out
    }
    static randomScalar<T extends Vector2Like>(out: T, min: number, max: number) {
        out.x = Math.floor(Math.random() * (max - min + 1) + min);
        out.y = Math.floor(Math.random() * (max - min + 1) + min);
        return out
    }
    // ==================== 实例部分 ====================

    x: number
    y: number
    isVector2: boolean = true
    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }

    // ---- 写入 ----

    set(x: number, y: number) {
        this.x = x
        this.y = y
        return this
    }

    copy(v: Vector2Like) {
        this.x = v.x
        this.y = v.y
        return this
    }

    zero() {
        return this.set(0, 0)
    }

    // ---- 运算（委托给静态方法） ----

    add(v: Vector2Like) {
        Vector2.add(this, this, v)
        return this
    }
    addScalar(s: number) {
        Vector2.addScalar(this, this, s)
        return this
    }
    addScaledVector(v: Vector2Like, s: number) {
        Vector2.addScaledVector(this, this, v, s)
        return this
    }
    subtract(v: Vector2Like) {
        Vector2.subtract(this, this, v)
        return this
    }
    multiply(v: Vector2Like) {
        Vector2.multiply(this, this, v)
        return this
    }

    multiplyScalar(s: number) {
        Vector2.multiplyScalar(this, this, s)
        return this
    }

    divide(s: number) {
        Vector2.divide(this, this, s)
        return this
    }
    divideScalar(scalar: number) {
        return this.multiplyScalar(1 / scalar)
    }
    negate() {
        Vector2.negate(this, this)
        return this
    }

    normalize() {
        Vector2.normalize(this, this)
        return this
    }


    lerp(to: Vector2Like, t: number) {
        Vector2.lerp(this, this, to, t)
        return this
    }

    project(onto: Vector2Like) {
        Vector2.project(this, this, onto)
        return this
    }

    /** this = min(this, v)（逐分量取最小） */
    min(v: Vector2Like) {
        Vector2.min(this, this, v)
        return this
    }

    /** this = max(this, v)（逐分量取最大） */
    max(v: Vector2Like) {
        Vector2.max(this, this, v)
        return this
    }
    perp() {
        Vector2.perpendicular(this, this)
        return this
    }
    perpendicular() {
        Vector2.perpendicular(this, this)
        return this
    }
    rotateCW() {
        Vector2.rotateCW(this, this)
        return this
    }
    rotateCCW() {
        Vector2.rotateCCW(this, this)
        return this
    }
    setLength(len: number) {
        return this.normalize().multiplyScalar(len)
    }
    setLengthTo(x: number, y: number, length: number, originLength?: { value: number }) {
        const dmag = Math.sqrt(x * x + y * y)
        const dscale = length / dmag
        const nx = x * dscale
        const ny = y * dscale
        if (!Number.isFinite(x) || !Number.isFinite(y) || (x == 0 && y == 0)) {
            this.set(0, 0);
            return false;
        }
        if (originLength) {
            originLength.value = dmag
        }
        this.set(nx, ny)
        return true
    }
    /** 应用矩阵变换 this = m * this */
    applyMatrix2D(m: Matrix2DLike) {
        Vector2.applyMatrix2D(this, this, m)
        return this
    }
    clamp(min: Vector2Like, max: Vector2Like) {
        Vector2.clamp(this, this, min, max)
        return this;
    }
    clampScalar(min: number, max: number) {
        Vector2.clampScalar(this, this, min, max)
        return this
    }
    clampLength(min: number, max: number) {
        Vector2.clampLength(this, this, min, max)
        return this
    }
    // ---- 查询 ----

    /** 长度 */
    magnitude(): number {
        return Math.hypot(this.x, this.y)
    }

    /** 长度的平方 */
    magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y
    }

    dot(v: Vector2Like): number {
        return Vector2.dot(this, v)
    }

    cross(v: Vector2Like): number {
        return Vector2.cross(this, v)
    }
    angle() {
        return Vector2.angle(this)
    }
    angleTo(v: Vector2Like): number {
        return Vector2.angleTo(this, v)
    }
    angleToSigned(v: Vector2Like): number {
        return Vector2.angleToSigned(this, v)
    }
    distanceTo(v: Vector2Like): number {
        return Vector2.distance(this, v)
    }
    distanceSquaredTo(v: Vector2Like): number {
        return Vector2.distanceSquared(this, v)
    }
    translate(tx: number, ty: number) {
        return Vector2.translate(this, this, tx, ty)
    }
    scale(sx: number, sy: number) {
        return Vector2.scale(this, this, sx, sy)
    }
    rotate(angle: number, origin?: Vector2Like) {
        Vector2.rotate(this, this, angle, origin)
        return this
    }
    isFinite() {
        return Number.isFinite(this.x) && Number.isFinite(this.y)
    }
    isZero(): boolean {
        return this.x === 0 && this.y === 0
    }
    isOne(): boolean {
        return this.x === 1 && this.y === 1
    }

    // ---- 工具 ----

    clone(): Vector2 {
        return new (this.constructor as typeof Vector2)(this.x, this.y)
    }

    toArray(): [number, number] {
        return [this.x, this.y]
    }

    toString(): string {
        return `Vector2(${this.x}, ${this.y})`
    }
    equals(v: Vector2Like): boolean {
        return Vector2.equals(this, v)
    }
    equalsEpsilon(v: Vector2Like, epsilon?: number): boolean {
        return Vector2.equalsEpsilon(this, v, epsilon)
    }
}
