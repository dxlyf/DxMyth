// ============================================================
// Vector2 — 2D 向量
// ============================================================

import { CachePool } from "./CachePool"
import { degToRad } from "./MathUtils"
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
    static add(out: Vector2, a: Vector2Like, b: Vector2Like): Vector2 {
        out.x = a.x + b.x
        out.y = a.y + b.y
        return out
    }

    /** out = a - b */
    static subtract(out: Vector2, a: Vector2Like, b: Vector2Like): Vector2 {
        out.x = a.x - b.x
        out.y = a.y - b.y
        return out
    }
    static multiply(out: Vector2, a: Vector2Like, b: Vector2Like): Vector2 {
        out.x = a.x * b.x
        out.y = a.y * b.y
        return out
    }
    /** out = v * s */
    static multiplyScalar(out: Vector2, v: Vector2Like, s: number): Vector2 {
        out.x = v.x * s
        out.y = v.y * s
        return out
    }

    /** out = v / s */
    static divide(out: Vector2, v: Vector2Like, s: number): Vector2 {
        out.x = v.x / s
        out.y = v.y / s
        return out
    }

    /** out = -v */
    static negate(out: Vector2, v: Vector2Like): Vector2 {
        out.x = -v.x
        out.y = -v.y
        return out
    }

    /** out = normalized(v)；零向量时返回零向量 */
    static normalize(out: Vector2, v: Vector2Like): Vector2 {
        const len = Math.hypot(v.x, v.y)
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
    static project(out: Vector2, a: Vector2Like, b: Vector2Like): Vector2 {
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
    static perp(out: Vector2, v: Vector2Like): Vector2 {
        out.x = -v.y
        out.y = v.x
        return out
    }
    /** out = a 在 b 上的垂直（正交）分量 */
    static perpendicular(out: Vector2, a: Vector2Like, b: Vector2Like): Vector2 {
        const proj = Vector2.pool.get()
        Vector2.project(proj, a, b)
        Vector2.subtract(out, a, proj)
        Vector2.pool.release(proj)
        return out
    }

    /** out = lerp(a, b, t)；t=0 得 a，t=1 得 b */
    static lerp(out: Vector2, a: Vector2Like, b: Vector2Like, t: number): Vector2 {
        out.x = a.x + (b.x - a.x) * t
        out.y = a.y + (b.y - a.y) * t
        return out
    }

    /** out = a 沿 b 方向按指定距离移动 */
    static moveTo(out: Vector2, a: Vector2Like, b: Vector2Like, distance: number): Vector2 {
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

    /** a 和 b 之间的夹角 (rad) */
    static angleBetween(a: Vector2Like, b: Vector2Like): number {
        const dot = Vector2.dot(a, b)
        const lenProd = Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y)
        if (lenProd === 0) return 0
        return Math.acos(Math.max(-1, Math.min(1, dot / lenProd)))
    }
    static equals(a: Vector2Like, b: Vector2Like): boolean {
        return a.x === b.x && a.y === b.y
    }
    /** 判断 a 与 b 是否近似相等 */
    static equalsEpsilon(a: Vector2Like, b: Vector2Like, epsilon: number = 1e-9): boolean {
        return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon
    }

    /** out = min(a, b)（逐分量取最小） */
    static min(out: Vector2, a: Vector2Like, b: Vector2Like): Vector2 {
        out.x = Math.min(a.x, b.x)
        out.y = Math.min(a.y, b.y)
        return out
    }

    /** out = max(a, b)（逐分量取最大） */
    static max(out: Vector2, a: Vector2Like, b: Vector2Like): Vector2 {
        out.x = Math.max(a.x, b.x)
        out.y = Math.max(a.y, b.y)
        return out
    }

    /** out = clamp(v, min, max) */
    static clamp(out: Vector2, v: Vector2Like, min: Vector2Like, max: Vector2Like): Vector2 {
        out.x = Math.max(min.x, Math.min(max.x, v.x))
        out.y = Math.max(min.y, Math.min(max.y, v.y))
        return out
    }

    /** out = reflect(v, normal)；normal 需为单位向量 */
    static reflect(out: Vector2, v: Vector2Like, normal: Vector2Like): Vector2 {
        const d = 2 * Vector2.dot(v, normal)
        out.x = v.x - d * normal.x
        out.y = v.y - d * normal.y
        return out
    }

    /**
     * out = m * v（矩阵变换）
     */
    static applyMatrix2D(out: Vector2, v: Vector2Like, m: Matrix2DLike): Vector2 {
        const x = v.x, y = v.y
        out.x = m[0] * x + m[2] * y + m[4]
        out.y = m[1] * x + m[3] * y + m[5]
        return out
    }
    static translate(out: Vector2, v: Vector2Like, tx: number, ty: number): Vector2 {
        out.x = v.x + tx
        out.y = v.y + ty
        return out
    }
    static rotate(out: Vector2, v: Vector2Like, angle: number, origin?: Vector2Like): Vector2 {
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
    static scale(out: Vector2, v: Vector2Like, sx: number, sy: number): Vector2 {
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
    static isPointOnSegment(p: Vector2, a: Vector2, b: Vector2, lineWidth: number): boolean {
        const dist = this.pointToSegmentDistance(p, a, b);
        return dist <= lineWidth / 2;
    }

    /**
     * 计算两条线段的交点
     */
    static segmentIntersection(a1: Vector2Like, a2: Vector2Like, b1: Vector2Like, b2: Vector2Like): Vector2Like | null {
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
    // ==================== 实例部分 ====================

    x: number
    y: number
    isVector2: boolean = true
    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }

    // ---- 写入 ----

    set(x: number, y: number): this {
        this.x = x
        this.y = y
        return this
    }

    copy(v: Vector2Like): this {
        this.x = v.x
        this.y = v.y
        return this
    }

    zero(): this {
        return this.set(0, 0)
    }

    // ---- 运算（委托给静态方法） ----

    add(v: Vector2Like): this {
        Vector2.add(this, this, v)
        return this
    }

    subtract(v: Vector2Like): this {
        Vector2.subtract(this, this, v)
        return this
    }
    multiply(v: Vector2Like): this {
        Vector2.multiply(this, this, v)
        return this
    }

    multiplyScalar(s: number): this {
        Vector2.multiplyScalar(this, this, s)
        return this
    }

    divide(s: number): this {
        Vector2.divide(this, this, s)
        return this
    }

    negate(): this {
        Vector2.negate(this, this)
        return this
    }

    normalize(): this {
        Vector2.normalize(this, this)
        return this
    }


    lerp(to: Vector2Like, t: number): this {
        Vector2.lerp(this, this, to, t)
        return this
    }

    project(onto: Vector2Like): this {
        Vector2.project(this, this, onto)
        return this
    }

    /** this = min(this, v)（逐分量取最小） */
    min(v: Vector2Like): this {
        Vector2.min(this, this, v)
        return this
    }

    /** this = max(this, v)（逐分量取最大） */
    max(v: Vector2Like): this {
        Vector2.max(this, this, v)
        return this
    }
    perp(): this {
        Vector2.perp(this, this)
        return this
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
    applyMatrix2D(m: Matrix2DLike): this {
        Vector2.applyMatrix2D(this, this, m)
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

    angle(v: Vector2Like): number {
        return Vector2.angleBetween(this, v)
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
    equals(v: Vector2Like): boolean {
        return Vector2.equals(this, v)
    }
    equalsEpsilon(v: Vector2Like, epsilon?: number): boolean {
        return Vector2.equalsEpsilon(this, v, epsilon)
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
        return new Vector2(this.x, this.y)
    }

    toArray(): [number, number] {
        return [this.x, this.y]
    }

    toString(): string {
        return `Vector2(${this.x}, ${this.y})`
    }
}
