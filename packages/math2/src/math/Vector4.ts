// ============================================================
// Vector4 — 4D 向量
// 风格与 Vector2/Vector3 保持一致：静态工厂 + 静态运算（out 可复用）+ 实例方法委托
// ============================================================

import { CachePool } from './CachePool'
import type { Matrix4Like } from './Matrix4'

export type Vector4Like = {
    x: number
    y: number
    z: number
    w: number
}

export class Vector4 implements Vector4Like {
    static pool = CachePool.create({
        initSize: 20,
        create: () => new Vector4(0, 0, 0, 1),
        init(item: Vector4) {
            item.set(0, 0, 0, 1)
        }
    })

    // ---- 静态工厂 ----

    static default(): Vector4 {
        return this.create()
    }

    static create(x: number = 0, y: number = 0, z: number = 0, w: number = 1): Vector4 {
        return new Vector4(x, y, z, w)
    }

    static zero(): Vector4 {
        return new Vector4(0, 0, 0, 0)
    }

    static one(): Vector4 {
        return new Vector4(1, 1, 1, 1)
    }

    static fromValues(x: number, y: number, z: number, w: number = 1): Vector4 {
        return new Vector4(x, y, z, w)
    }

    static fromScalar(s: number): Vector4 {
        return new Vector4(s, s, s, s)
    }

    /** 从类向量对象创建 */
    static from(v: Vector4Like): Vector4 {
        return new Vector4(v.x, v.y, v.z, v.w)
    }

    /** 从数组创建 */
    static fromArray(arr: ArrayLike<number>): Vector4 {
        return new Vector4(arr[0], arr[1], arr[2], arr[3])
    }

    /** 从 Vector3 创建（默认 w=1） */
    static fromVector3(v: { x: number, y: number, z: number }, w: number = 1): Vector4 {
        return new Vector4(v.x, v.y, v.z, w)
    }

    // ---- 静态运算（out 可复用） ----

    /** out = a + b */
    static add(out: Vector4, a: Vector4Like, b: Vector4Like): Vector4 {
        out.x = a.x + b.x
        out.y = a.y + b.y
        out.z = a.z + b.z
        out.w = a.w + b.w
        return out
    }

    /** out = a - b */
    static subtract(out: Vector4, a: Vector4Like, b: Vector4Like): Vector4 {
        out.x = a.x - b.x
        out.y = a.y - b.y
        out.z = a.z - b.z
        out.w = a.w - b.w
        return out
    }

    /** out = a ⊙ b（逐分量相乘） */
    static multiply(out: Vector4, a: Vector4Like, b: Vector4Like): Vector4 {
        out.x = a.x * b.x
        out.y = a.y * b.y
        out.z = a.z * b.z
        out.w = a.w * b.w
        return out
    }

    /** out = v * s */
    static multiplyScalar(out: Vector4, v: Vector4Like, s: number): Vector4 {
        out.x = v.x * s
        out.y = v.y * s
        out.z = v.z * s
        out.w = v.w * s
        return out
    }

    /** out = v / s */
    static divide(out: Vector4, v: Vector4Like, s: number): Vector4 {
        out.x = v.x / s
        out.y = v.y / s
        out.z = v.z / s
        out.w = v.w / s
        return out
    }

    /** out = -v */
    static negate(out: Vector4, v: Vector4Like): Vector4 {
        out.x = -v.x
        out.y = -v.y
        out.z = -v.z
        out.w = -v.w
        return out
    }

    /** out = normalized(v)；零向量时返回零向量 */
    static normalize(out: Vector4, v: Vector4Like): Vector4 {
        const len = Math.hypot(v.x, v.y, v.z, v.w)
        if (len === 0) {
            out.x = 0
            out.y = 0
            out.z = 0
            out.w = 0
            return out
        }
        out.x = v.x / len
        out.y = v.y / len
        out.z = v.z / len
        out.w = v.w / len
        return out
    }

    /** a · b */
    static dot(a: Vector4Like, b: Vector4Like): number {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w
    }

    /** out = a 在 b 上的投影 */
    static project(out: Vector4, a: Vector4Like, b: Vector4Like): Vector4 {
        const dot = Vector4.dot(a, b)
        const lenSq = Vector4.dot(b, b)
        if (lenSq === 0) {
            out.x = 0
            out.y = 0
            out.z = 0
            out.w = 0
            return out
        }
        const s = dot / lenSq
        out.x = b.x * s
        out.y = b.y * s
        out.z = b.z * s
        out.w = b.w * s
        return out
    }

    /** out = lerp(a, b, t)；t=0 得 a，t=1 得 b */
    static lerp(out: Vector4, a: Vector4Like, b: Vector4Like, t: number): Vector4 {
        out.x = a.x + (b.x - a.x) * t
        out.y = a.y + (b.y - a.y) * t
        out.z = a.z + (b.z - a.z) * t
        out.w = a.w + (b.w - a.w) * t
        return out
    }

    /** |a - b| */
    static distance(a: Vector4Like, b: Vector4Like): number {
        return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w)
    }

    /** |a - b|²（避免 sqrt） */
    static distanceSquared(a: Vector4Like, b: Vector4Like): number {
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dz = a.z - b.z
        const dw = a.w - b.w
        return dx * dx + dy * dy + dz * dz + dw * dw
    }

    static equals(a: Vector4Like, b: Vector4Like): boolean {
        return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w
    }

    /** 判断 a 与 b 是否近似相等 */
    static equalsEpsilon(a: Vector4Like, b: Vector4Like, epsilon: number = 1e-9): boolean {
        return Math.abs(a.x - b.x) <= epsilon
            && Math.abs(a.y - b.y) <= epsilon
            && Math.abs(a.z - b.z) <= epsilon
            && Math.abs(a.w - b.w) <= epsilon
    }

    /** out = min(a, b)（逐分量取最小） */
    static min(out: Vector4, a: Vector4Like, b: Vector4Like): Vector4 {
        out.x = Math.min(a.x, b.x)
        out.y = Math.min(a.y, b.y)
        out.z = Math.min(a.z, b.z)
        out.w = Math.min(a.w, b.w)
        return out
    }

    /** out = max(a, b)（逐分量取最大） */
    static max(out: Vector4, a: Vector4Like, b: Vector4Like): Vector4 {
        out.x = Math.max(a.x, b.x)
        out.y = Math.max(a.y, b.y)
        out.z = Math.max(a.z, b.z)
        out.w = Math.max(a.w, b.w)
        return out
    }

    /** out = clamp(v, min, max) */
    static clamp(out: Vector4, v: Vector4Like, min: Vector4Like, max: Vector4Like): Vector4 {
        out.x = Math.max(min.x, Math.min(max.x, v.x))
        out.y = Math.max(min.y, Math.min(max.y, v.y))
        out.z = Math.max(min.z, Math.min(max.z, v.z))
        out.w = Math.max(min.w, Math.min(max.w, v.w))
        return out
    }

    /** out = m * v（4x4 矩阵变换，含 w 分量，列主序） */
    static applyMatrix4(out: Vector4, v: Vector4Like, m: Matrix4Like): Vector4 {
        const x = v.x, y = v.y, z = v.z, w = v.w
        out.x = m[0] * x + m[4] * y + m[8] * z + m[12] * w
        out.y = m[1] * x + m[5] * y + m[9] * z + m[13] * w
        out.z = m[2] * x + m[6] * y + m[10] * z + m[14] * w
        out.w = m[3] * x + m[7] * y + m[11] * z + m[15] * w
        return out
    }

    // ==================== 实例部分 ====================

    x: number
    y: number
    z: number
    w: number
    isVector4: boolean = true
    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }

    // ---- 写入 ----

    set(x: number, y: number, z: number, w: number): this {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
        return this
    }

    copy(v: Vector4Like): this {
        this.x = v.x
        this.y = v.y
        this.z = v.z
        this.w = v.w
        return this
    }

    zero(): this {
        return this.set(0, 0, 0, 0)
    }

    one(): this {
        return this.set(1, 1, 1, 1)
    }

    // ---- 运算（委托给静态方法） ----

    add(v: Vector4Like): this {
        Vector4.add(this, this, v)
        return this
    }

    subtract(v: Vector4Like): this {
        Vector4.subtract(this, this, v)
        return this
    }

    multiply(v: Vector4Like): this {
        Vector4.multiply(this, this, v)
        return this
    }

    multiplyScalar(s: number): this {
        Vector4.multiplyScalar(this, this, s)
        return this
    }

    divide(s: number): this {
        Vector4.divide(this, this, s)
        return this
    }

    negate(): this {
        Vector4.negate(this, this)
        return this
    }

    normalize(): this {
        Vector4.normalize(this, this)
        return this
    }

    lerp(to: Vector4Like, t: number): this {
        Vector4.lerp(this, this, to, t)
        return this
    }

    project(onto: Vector4Like): this {
        Vector4.project(this, this, onto)
        return this
    }

    /** this = min(this, v)（逐分量取最小） */
    min(v: Vector4Like): this {
        Vector4.min(this, this, v)
        return this
    }

    /** this = max(this, v)（逐分量取最大） */
    max(v: Vector4Like): this {
        Vector4.max(this, this, v)
        return this
    }

    /** this = m * this（4x4 矩阵变换，含 w 分量） */
    applyMatrix4(m: Matrix4Like): this {
        Vector4.applyMatrix4(this, this, m)
        return this
    }

    // ---- 查询 ----

    /** 长度 */
    magnitude(): number {
        return Math.hypot(this.x, this.y, this.z, this.w)
    }

    /** 长度的平方 */
    magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    }

    dot(v: Vector4Like): number {
        return Vector4.dot(this, v)
    }

    distanceTo(v: Vector4Like): number {
        return Vector4.distance(this, v)
    }

    distanceSquaredTo(v: Vector4Like): number {
        return Vector4.distanceSquared(this, v)
    }

    equals(v: Vector4Like): boolean {
        return Vector4.equals(this, v)
    }

    equalsEpsilon(v: Vector4Like, epsilon?: number): boolean {
        return Vector4.equalsEpsilon(this, v, epsilon)
    }

    isFinite(): boolean {
        return Number.isFinite(this.x) && Number.isFinite(this.y)
            && Number.isFinite(this.z) && Number.isFinite(this.w)
    }

    isZero(): boolean {
        return this.x === 0 && this.y === 0 && this.z === 0 && this.w === 0
    }

    // ---- 工具 ----

    clone(): Vector4 {
        return new Vector4(this.x, this.y, this.z, this.w)
    }

    toArray(): [number, number, number, number] {
        return [this.x, this.y, this.z, this.w]
    }

    toString(): string {
        return `Vector4(${this.x}, ${this.y}, ${this.z}, ${this.w})`
    }
}
