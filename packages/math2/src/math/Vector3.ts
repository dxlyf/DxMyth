// ============================================================
// Vector3 — 3D 向量
// 风格与 Vector2 保持一致：静态工厂 + 静态运算（out 可复用）+ 实例方法委托
// ============================================================

import { CachePool } from './CachePool'
import type { Matrix3Like } from './Matrix3'
import type { Matrix4Like } from './Matrix4'

export type Vector3Like = {
    x: number
    y: number
    z: number
}

export class Vector3 implements Vector3Like {
    static pool = CachePool.create({
        initSize: 20,
        create: () => new Vector3(0, 0, 0),
        init(item: Vector3) {
            item.set(0, 0, 0)
        }
    })

    // ---- 静态工厂 ----

    static default(): Vector3 {
        return this.create()
    }

    static create(x: number = 0, y: number = 0, z: number = 0): Vector3 {
        return new Vector3(x, y, z)
    }

    static zero(): Vector3 {
        return new Vector3(0, 0, 0)
    }

    static one(): Vector3 {
        return new Vector3(1, 1, 1)
    }

    static fromValues(x: number, y: number, z: number): Vector3 {
        return new Vector3(x, y, z)
    }

    static fromScalar(s: number): Vector3 {
        return new Vector3(s, s, s)
    }

    /** 从类向量对象创建 */
    static from(v: Vector3Like): Vector3 {
        return new Vector3(v.x, v.y, v.z)
    }

    /** 从数组创建 */
    static fromArray(arr: ArrayLike<number>): Vector3 {
        return new Vector3(arr[0], arr[1], arr[2])
    }

    /** X 轴单位向量 */
    static unitX(): Vector3 {
        return new Vector3(1, 0, 0)
    }

    /** Y 轴单位向量 */
    static unitY(): Vector3 {
        return new Vector3(0, 1, 0)
    }

    /** Z 轴单位向量 */
    static unitZ(): Vector3 {
        return new Vector3(0, 0, 1)
    }

    // ---- 静态运算（out 可复用） ----

    /** out = a + b */
    static add(out: Vector3, a: Vector3Like, b: Vector3Like): Vector3 {
        out.x = a.x + b.x
        out.y = a.y + b.y
        out.z = a.z + b.z
        return out
    }

    /** out = a - b */
    static subtract(out: Vector3, a: Vector3Like, b: Vector3Like): Vector3 {
        out.x = a.x - b.x
        out.y = a.y - b.y
        out.z = a.z - b.z
        return out
    }

    /** out = a ⊙ b（逐分量相乘） */
    static multiply(out: Vector3, a: Vector3Like, b: Vector3Like): Vector3 {
        out.x = a.x * b.x
        out.y = a.y * b.y
        out.z = a.z * b.z
        return out
    }

    /** out = v * s */
    static multiplyScalar(out: Vector3, v: Vector3Like, s: number): Vector3 {
        out.x = v.x * s
        out.y = v.y * s
        out.z = v.z * s
        return out
    }

    /** out = v / s */
    static divide(out: Vector3, v: Vector3Like, s: number): Vector3 {
        out.x = v.x / s
        out.y = v.y / s
        out.z = v.z / s
        return out
    }

    /** out = -v */
    static negate(out: Vector3, v: Vector3Like): Vector3 {
        out.x = -v.x
        out.y = -v.y
        out.z = -v.z
        return out
    }

    /** out = normalized(v)；零向量时返回零向量 */
    static normalize(out: Vector3, v: Vector3Like): Vector3 {
        const len = Math.hypot(v.x, v.y, v.z)
        if (len === 0) {
            out.x = 0
            out.y = 0
            out.z = 0
            return out
        }
        out.x = v.x / len
        out.y = v.y / len
        out.z = v.z / len
        return out
    }

    /** a · b */
    static dot(a: Vector3Like, b: Vector3Like): number {
        return a.x * b.x + a.y * b.y + a.z * b.z
    }

    /** out = a × b（3D 叉积） */
    static cross(out: Vector3, a: Vector3Like, b: Vector3Like): Vector3 {
        const ax = a.x, ay = a.y, az = a.z
        const bx = b.x, by = b.y, bz = b.z
        out.x = ay * bz - az * by
        out.y = az * bx - ax * bz
        out.z = ax * by - ay * bx
        return out
    }

    /** out = a 在 b 上的投影 */
    static project(out: Vector3, a: Vector3Like, b: Vector3Like): Vector3 {
        const dot = Vector3.dot(a, b)
        const lenSq = Vector3.dot(b, b)
        if (lenSq === 0) {
            out.x = 0
            out.y = 0
            out.z = 0
            return out
        }
        const s = dot / lenSq
        out.x = b.x * s
        out.y = b.y * s
        out.z = b.z * s
        return out
    }

    /** out = lerp(a, b, t)；t=0 得 a，t=1 得 b */
    static lerp(out: Vector3, a: Vector3Like, b: Vector3Like, t: number): Vector3 {
        out.x = a.x + (b.x - a.x) * t
        out.y = a.y + (b.y - a.y) * t
        out.z = a.z + (b.z - a.z) * t
        return out
    }

    /** |a - b| */
    static distance(a: Vector3Like, b: Vector3Like): number {
        return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z)
    }

    /** |a - b|²（避免 sqrt） */
    static distanceSquared(a: Vector3Like, b: Vector3Like): number {
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dz = a.z - b.z
        return dx * dx + dy * dy + dz * dz
    }

    /** a 和 b 之间的夹角 (rad) */
    static angleBetween(a: Vector3Like, b: Vector3Like): number {
        const dot = Vector3.dot(a, b)
        const lenProd = Math.hypot(a.x, a.y, a.z) * Math.hypot(b.x, b.y, b.z)
        if (lenProd === 0) return 0
        return Math.acos(Math.max(-1, Math.min(1, dot / lenProd)))
    }

    static equals(a: Vector3Like, b: Vector3Like): boolean {
        return a.x === b.x && a.y === b.y && a.z === b.z
    }

    /** 判断 a 与 b 是否近似相等 */
    static equalsEpsilon(a: Vector3Like, b: Vector3Like, epsilon: number = 1e-9): boolean {
        return Math.abs(a.x - b.x) <= epsilon
            && Math.abs(a.y - b.y) <= epsilon
            && Math.abs(a.z - b.z) <= epsilon
    }

    /** out = min(a, b)（逐分量取最小） */
    static min(out: Vector3, a: Vector3Like, b: Vector3Like): Vector3 {
        out.x = Math.min(a.x, b.x)
        out.y = Math.min(a.y, b.y)
        out.z = Math.min(a.z, b.z)
        return out
    }

    /** out = max(a, b)（逐分量取最大） */
    static max(out: Vector3, a: Vector3Like, b: Vector3Like): Vector3 {
        out.x = Math.max(a.x, b.x)
        out.y = Math.max(a.y, b.y)
        out.z = Math.max(a.z, b.z)
        return out
    }

    /** out = clamp(v, min, max) */
    static clamp(out: Vector3, v: Vector3Like, min: Vector3Like, max: Vector3Like): Vector3 {
        out.x = Math.max(min.x, Math.min(max.x, v.x))
        out.y = Math.max(min.y, Math.min(max.y, v.y))
        out.z = Math.max(min.z, Math.min(max.z, v.z))
        return out
    }

    /** out = reflect(v, normal)；normal 需为单位向量 */
    static reflect(out: Vector3, v: Vector3Like, normal: Vector3Like): Vector3 {
        const d = 2 * Vector3.dot(v, normal)
        out.x = v.x - d * normal.x
        out.y = v.y - d * normal.y
        out.z = v.z - d * normal.z
        return out
    }

    /** out = m * v（3x3 矩阵变换，列主序） */
    static applyMatrix3(out: Vector3, v: Vector3Like, m: Matrix3Like): Vector3 {
        const x = v.x, y = v.y, z = v.z
        out.x = m[0] * x + m[3] * y + m[6] * z
        out.y = m[1] * x + m[4] * y + m[7] * z
        out.z = m[2] * x + m[5] * y + m[8] * z
        return out
    }

    /** out = m * v（4x4 矩阵变换，w=1 带透视除法，列主序） */
    static applyMatrix4(out: Vector3, v: Vector3Like, m: Matrix4Like): Vector3 {
        const x = v.x, y = v.y, z = v.z
        const w = m[3] * x + m[7] * y + m[11] * z + m[15]
        const invW = w === 0 ? 1 : 1 / w
        out.x = (m[0] * x + m[4] * y + m[8] * z + m[12]) * invW
        out.y = (m[1] * x + m[5] * y + m[9] * z + m[13]) * invW
        out.z = (m[2] * x + m[6] * y + m[10] * z + m[14]) * invW
        return out
    }

    // ==================== 实例部分 ====================

    x: number
    y: number
    z: number
    isVector3: boolean = true
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    // ---- 写入 ----

    set(x: number, y: number, z: number): this {
        this.x = x
        this.y = y
        this.z = z
        return this
    }

    copy(v: Vector3Like): this {
        this.x = v.x
        this.y = v.y
        this.z = v.z
        return this
    }

    zero(): this {
        return this.set(0, 0, 0)
    }

    one(): this {
        return this.set(1, 1, 1)
    }

    // ---- 运算（委托给静态方法） ----

    add(v: Vector3Like): this {
        Vector3.add(this, this, v)
        return this
    }

    subtract(v: Vector3Like): this {
        Vector3.subtract(this, this, v)
        return this
    }

    multiply(v: Vector3Like): this {
        Vector3.multiply(this, this, v)
        return this
    }

    multiplyScalar(s: number): this {
        Vector3.multiplyScalar(this, this, s)
        return this
    }

    divide(s: number): this {
        Vector3.divide(this, this, s)
        return this
    }

    negate(): this {
        Vector3.negate(this, this)
        return this
    }

    normalize(): this {
        Vector3.normalize(this, this)
        return this
    }

    lerp(to: Vector3Like, t: number): this {
        Vector3.lerp(this, this, to, t)
        return this
    }

    project(onto: Vector3Like): this {
        Vector3.project(this, this, onto)
        return this
    }

    /** this = min(this, v)（逐分量取最小） */
    min(v: Vector3Like): this {
        Vector3.min(this, this, v)
        return this
    }

    /** this = max(this, v)（逐分量取最大） */
    max(v: Vector3Like): this {
        Vector3.max(this, this, v)
        return this
    }

    cross(v: Vector3Like): this {
        Vector3.cross(this, this, v)
        return this
    }

    /** this = m * this（3x3 矩阵变换） */
    applyMatrix3(m: Matrix3Like): this {
        Vector3.applyMatrix3(this, this, m)
        return this
    }

    /** this = m * this（4x4 矩阵变换，带透视除法） */
    applyMatrix4(m: Matrix4Like): this {
        Vector3.applyMatrix4(this, this, m)
        return this
    }

    // ---- 查询 ----

    /** 长度 */
    magnitude(): number {
        return Math.hypot(this.x, this.y, this.z)
    }

    /** 长度的平方 */
    magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z
    }

    dot(v: Vector3Like): number {
        return Vector3.dot(this, v)
    }

    crossWith(v: Vector3Like): Vector3 {
        const r = Vector3.cross(Vector3.pool.get(), this, v)
        return r
    }

    angle(v: Vector3Like): number {
        return Vector3.angleBetween(this, v)
    }

    distanceTo(v: Vector3Like): number {
        return Vector3.distance(this, v)
    }

    distanceSquaredTo(v: Vector3Like): number {
        return Vector3.distanceSquared(this, v)
    }

    equals(v: Vector3Like): boolean {
        return Vector3.equals(this, v)
    }

    equalsEpsilon(v: Vector3Like, epsilon?: number): boolean {
        return Vector3.equalsEpsilon(this, v, epsilon)
    }

    isFinite(): boolean {
        return Number.isFinite(this.x) && Number.isFinite(this.y) && Number.isFinite(this.z)
    }

    isZero(): boolean {
        return this.x === 0 && this.y === 0 && this.z === 0
    }

    isOne(): boolean {
        return this.x === 1 && this.y === 1 && this.z === 1
    }

    // ---- 工具 ----

    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z)
    }

    toArray(): [number, number, number] {
        return [this.x, this.y, this.z]
    }

    toString(): string {
        return `Vector3(${this.x}, ${this.y}, ${this.z})`
    }
}
