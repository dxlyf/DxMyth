// ============================================================
// Quaternion — 四元数（用于 3D 旋转）
// 约定：单位四元数表示旋转，乘法为 Hamilton 积，与 three.js / gl-matrix 一致
// 旋转向量：v' = q * v * q⁻¹
// ============================================================

import { CachePool } from './CachePool'
import { Matrix3, Matrix3Like } from './Matrix3'
import { Matrix4, Matrix4Like } from './Matrix4'
import type { EulerLike } from './Euler'
import type { Vector3Like } from './Vector3'

export type QuaternionLike = {
    x: number
    y: number
    z: number
    w: number
}

export class Quaternion implements QuaternionLike {
    static pool = CachePool.create({
        initSize: 20,
        create: () => Quaternion.identity(),
        init(item: Quaternion) {
            item.identity()
        }
    })

    // ---- 静态工厂 ----

    static identity(): Quaternion {
        return new Quaternion(0, 0, 0, 1)
    }

    static zero(): Quaternion {
        return new Quaternion(0, 0, 0, 0)
    }

    static fromValues(x: number, y: number, z: number, w: number): Quaternion {
        return new Quaternion(x, y, z, w)
    }

    static from(q: QuaternionLike): Quaternion {
        return new Quaternion(q.x, q.y, q.z, q.w)
    }

    static fromArray(arr: ArrayLike<number>): Quaternion {
        return new Quaternion(arr[0], arr[1], arr[2], arr[3])
    }

    /** 绕任意轴（单位方向向量）旋转 angle（rad） */
    static fromAxisAngle(axis: Vector3Like, angle: number): Quaternion {
        return new Quaternion().setFromAxisAngle(axis, angle)
    }

    static fromRotationX(rad: number): Quaternion {
        const half = rad / 2
        return new Quaternion(Math.sin(half), 0, 0, Math.cos(half))
    }

    static fromRotationY(rad: number): Quaternion {
        const half = rad / 2
        return new Quaternion(0, Math.sin(half), 0, Math.cos(half))
    }

    static fromRotationZ(rad: number): Quaternion {
        const half = rad / 2
        return new Quaternion(0, 0, Math.sin(half), Math.cos(half))
    }

    /** 从欧拉角构造（旋转顺序由 euler.order 决定） */
    static fromEuler(euler: EulerLike): Quaternion {
        return new Quaternion().setFromEuler(euler)
    }

    /** 从 3x3 旋转矩阵提取四元数 */
    static fromMatrix3(m: Matrix3Like): Quaternion {
        return new Quaternion().setFromRotationMatrix3(m)
    }

    // ---- 静态运算 ----

    /** out = a + b */
    static add(out: Quaternion, a: QuaternionLike, b: QuaternionLike): Quaternion {
        out.x = a.x + b.x
        out.y = a.y + b.y
        out.z = a.z + b.z
        out.w = a.w + b.w
        return out
    }

    /** out = a - b */
    static subtract(out: Quaternion, a: QuaternionLike, b: QuaternionLike): Quaternion {
        out.x = a.x - b.x
        out.y = a.y - b.y
        out.z = a.z - b.z
        out.w = a.w - b.w
        return out
    }

    /** out = a * b（Hamilton 积，表示先 b 后 a 的复合旋转） */
    static multiply(out: Quaternion, a: QuaternionLike, b: QuaternionLike): Quaternion {
        const ax = a.x, ay = a.y, az = a.z, aw = a.w
        const bx = b.x, by = b.y, bz = b.z, bw = b.w
        out.x = ax * bw + aw * bx + ay * bz - az * by
        out.y = ay * bw + aw * by + az * bx - ax * bz
        out.z = az * bw + aw * bz + ax * by - ay * bx
        out.w = aw * bw - ax * bx - ay * by - az * bz
        return out
    }

    /** out = q * s */
    static multiplyScalar(out: Quaternion, q: QuaternionLike, s: number): Quaternion {
        out.x = q.x * s
        out.y = q.y * s
        out.z = q.z * s
        out.w = q.w * s
        return out
    }

    /** out = -q */
    static negate(out: Quaternion, q: QuaternionLike): Quaternion {
        out.x = -q.x
        out.y = -q.y
        out.z = -q.z
        out.w = -q.w
        return out
    }

    /** out = normalized(q)；零四元数返回零 */
    static normalize(out: Quaternion, q: QuaternionLike): Quaternion {
        const len = Math.hypot(q.x, q.y, q.z, q.w)
        if (len === 0) {
            out.x = 0
            out.y = 0
            out.z = 0
            out.w = 0
            return out
        }
        out.x = q.x / len
        out.y = q.y / len
        out.z = q.z / len
        out.w = q.w / len
        return out
    }

    /** a · b */
    static dot(a: QuaternionLike, b: QuaternionLike): number {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w
    }

    /** out = 共轭（-x, -y, -z, w）；单位四元数共轭即逆 */
    static conjugate(out: Quaternion, q: QuaternionLike): Quaternion {
        out.x = -q.x
        out.y = -q.y
        out.z = -q.z
        out.w = q.w
        return out
    }

    /** out = q⁻¹（共轭除以模长平方）；零四元数返回零 */
    static invert(out: Quaternion, q: QuaternionLike): Quaternion {
        const lenSq = q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w
        if (lenSq === 0) {
            out.x = 0
            out.y = 0
            out.z = 0
            out.w = 0
            return out
        }
        out.x = -q.x / lenSq
        out.y = -q.y / lenSq
        out.z = -q.z / lenSq
        out.w = q.w / lenSq
        return out
    }

    /** out = lerp(a, b, t)（线性插值，非球面） */
    static lerp(out: Quaternion, a: QuaternionLike, b: QuaternionLike, t: number): Quaternion {
        out.x = a.x + (b.x - a.x) * t
        out.y = a.y + (b.y - a.y) * t
        out.z = a.z + (b.z - a.z) * t
        out.w = a.w + (b.w - a.w) * t
        return out
    }

    /** out = slerp(a, b, t)（球面插值，自动取最短弧） */
    static slerp(out: Quaternion, a: QuaternionLike, b: QuaternionLike, t: number): Quaternion {
        let bx = b.x, by = b.y, bz = b.z, bw = b.w
        let cosHalfTheta = a.w * bw + a.x * bx + a.y * by + a.z * bz

        // 取最短弧：夹角为钝角时翻转 b
        if (cosHalfTheta < 0) {
            bw = -bw
            bx = -bx
            by = -by
            bz = -bz
            cosHalfTheta = -cosHalfTheta
        }

        if (cosHalfTheta >= 1) {
            out.x = a.x
            out.y = a.y
            out.z = a.z
            out.w = a.w
            return out
        }

        const sqrSinHalfTheta = 1 - cosHalfTheta * cosHalfTheta
        if (sqrSinHalfTheta <= 1e-12) {
            // 接近平行：用线性插值避免除零
            out.x = a.x + (bx - a.x) * t
            out.y = a.y + (by - a.y) * t
            out.z = a.z + (bz - a.z) * t
            out.w = a.w + (bw - a.w) * t
            return out
        }

        const sinHalfTheta = Math.sqrt(sqrSinHalfTheta)
        const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta)
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta
        const ratioB = Math.sin(t * halfTheta) / sinHalfTheta

        out.x = a.x * ratioA + bx * ratioB
        out.y = a.y * ratioA + by * ratioB
        out.z = a.z * ratioA + bz * ratioB
        out.w = a.w * ratioA + bw * ratioB
        return out
    }

    static equals(a: QuaternionLike, b: QuaternionLike): boolean {
        return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w
    }

    static equalsEpsilon(a: QuaternionLike, b: QuaternionLike, epsilon: number = 1e-9): boolean {
        return Math.abs(a.x - b.x) <= epsilon
            && Math.abs(a.y - b.y) <= epsilon
            && Math.abs(a.z - b.z) <= epsilon
            && Math.abs(a.w - b.w) <= epsilon
    }

    /** a 与 b 之间的夹角 (rad)：2·acos(|a·b|) */
    static angleBetween(a: QuaternionLike, b: QuaternionLike): number {
        const d = Math.min(1, Math.abs(Quaternion.dot(a, b)))
        return 2 * Math.acos(d)
    }

    /** out = q * v * q⁻¹（旋转向量 v，q 需为单位四元数） */
    static rotateVector(out: Vector3Like, v: Vector3Like, q: QuaternionLike): Vector3Like {
        const x = v.x, y = v.y, z = v.z
        const qx = q.x, qy = q.y, qz = q.z, qw = q.w

        const ix = qw * x + qy * z - qz * y
        const iy = qw * y + qz * x - qx * z
        const iz = qw * z + qx * y - qy * x
        const iw = -qx * x - qy * y - qz * z

        out.x = ix * qw - iw * qx - iy * qz + iz * qy
        out.y = iy * qw - iw * qy - iz * qx + ix * qz
        out.z = iz * qw - iw * qz - ix * qy + iy * qx
        return out
    }

    /** out = q 对应的 3x3 旋转矩阵（列主序） */
    static toMatrix3(q: QuaternionLike, out?: Matrix3): Matrix3 {
        const m = out ?? new Matrix3()
        const x = q.x, y = q.y, z = q.z, w = q.w
        const x2 = x + x, y2 = y + y, z2 = z + z
        const xx = x * x2, xy = x * y2, xz = x * z2
        const yy = y * y2, yz = y * z2, zz = z * z2
        const wx = w * x2, wy = w * y2, wz = w * z2

        m[0] = 1 - (yy + zz)
        m[1] = xy + wz
        m[2] = xz - wy
        m[3] = xy - wz
        m[4] = 1 - (xx + zz)
        m[5] = yz + wx
        m[6] = xz + wy
        m[7] = yz - wx
        m[8] = 1 - (xx + yy)
        return m
    }

    /** out = q 对应的 4x4 旋转矩阵（列主序，第四行/列单位） */
    static toMatrix4(q: QuaternionLike, out?: Matrix4): Matrix4 {
        const m = out ?? new Matrix4()
        const x = q.x, y = q.y, z = q.z, w = q.w
        const x2 = x + x, y2 = y + y, z2 = z + z
        const xx = x * x2, xy = x * y2, xz = x * z2
        const yy = y * y2, yz = y * z2, zz = z * z2
        const wx = w * x2, wy = w * y2, wz = w * z2

        m[0] = 1 - (yy + zz)
        m[1] = xy + wz
        m[2] = xz - wy
        m[3] = 0
        m[4] = xy - wz
        m[5] = 1 - (xx + zz)
        m[6] = yz + wx
        m[7] = 0
        m[8] = xz + wy
        m[9] = yz - wx
        m[10] = 1 - (xx + yy)
        m[11] = 0
        m[12] = 0
        m[13] = 0
        m[14] = 0
        m[15] = 1
        return m
    }

    // ==================== 实例 ====================

    x: number
    y: number
    z: number
    w: number

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

    copy(q: QuaternionLike): this {
        this.x = q.x
        this.y = q.y
        this.z = q.z
        this.w = q.w
        return this
    }

    identity(): this {
        return this.set(0, 0, 0, 1)
    }

    zero(): this {
        return this.set(0, 0, 0, 0)
    }

    /** 绕任意轴（axis 自动归一化）旋转 angle（rad） */
    setFromAxisAngle(axis: Vector3Like, angle: number): this {
        const half = angle / 2
        const s = Math.sin(half)
        const len = Math.hypot(axis.x, axis.y, axis.z)
        if (len === 0) {
            return this.identity()
        }
        this.x = (axis.x / len) * s
        this.y = (axis.y / len) * s
        this.z = (axis.z / len) * s
        this.w = Math.cos(half)
        return this
    }

    /** 从欧拉角构造（旋转顺序由 euler.order 决定） */
    setFromEuler(euler: EulerLike): this {
        const x = euler.x, y = euler.y, z = euler.z
        const c1 = Math.cos(x / 2), c2 = Math.cos(y / 2), c3 = Math.cos(z / 2)
        const s1 = Math.sin(x / 2), s2 = Math.sin(y / 2), s3 = Math.sin(z / 2)

        switch (euler.order ?? 'XYZ') {
            case 'XYZ':
                this.x = s1 * c2 * c3 + c1 * s2 * s3
                this.y = c1 * s2 * c3 - s1 * c2 * s3
                this.z = c1 * c2 * s3 + s1 * s2 * c3
                this.w = c1 * c2 * c3 - s1 * s2 * s3
                break
            case 'YXZ':
                this.x = s1 * c2 * c3 + c1 * s2 * s3
                this.y = c1 * s2 * c3 - s1 * c2 * s3
                this.z = c1 * c2 * s3 - s1 * s2 * c3
                this.w = c1 * c2 * c3 + s1 * s2 * s3
                break
            case 'ZXY':
                this.x = s1 * c2 * c3 - c1 * s2 * s3
                this.y = c1 * s2 * c3 + s1 * c2 * s3
                this.z = c1 * c2 * s3 + s1 * s2 * c3
                this.w = c1 * c2 * c3 - s1 * s2 * s3
                break
            case 'ZYX':
                this.x = s1 * c2 * c3 - c1 * s2 * s3
                this.y = c1 * s2 * c3 + s1 * c2 * s3
                this.z = c1 * c2 * s3 - s1 * s2 * c3
                this.w = c1 * c2 * c3 + s1 * s2 * s3
                break
            case 'YZX':
                this.x = s1 * c2 * c3 + c1 * s2 * s3
                this.y = c1 * s2 * c3 + s1 * c2 * s3
                this.z = c1 * c2 * s3 - s1 * s2 * c3
                this.w = c1 * c2 * c3 - s1 * s2 * s3
                break
            case 'XZY':
                this.x = s1 * c2 * c3 - c1 * s2 * s3
                this.y = c1 * s2 * c3 - s1 * c2 * s3
                this.z = c1 * c2 * s3 + s1 * s2 * c3
                this.w = c1 * c2 * c3 + s1 * s2 * s3
                break
        }
        return this
    }

    /** 从 3x3 旋转矩阵提取四元数 */
    setFromRotationMatrix3(m: Matrix3Like): this {
        // 列主序索引映射：m00=te[0], m01=te[3], m02=te[6], m10=te[1], m11=te[4], m12=te[7], m20=te[2], m21=te[5], m22=te[8]
        const m11 = m[0], m12 = m[3], m13 = m[6]
        const m21 = m[1], m22 = m[4], m23 = m[7]
        const m31 = m[2], m32 = m[5], m33 = m[8]

        const trace = m11 + m22 + m33
        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1)
            this.w = 0.25 / s
            this.x = (m32 - m23) * s
            this.y = (m13 - m31) * s
            this.z = (m21 - m12) * s
        } else if (m11 > m22 && m11 > m33) {
            const s = 2 * Math.sqrt(1 + m11 - m22 - m33)
            this.w = (m32 - m23) / s
            this.x = 0.25 * s
            this.y = (m12 + m21) / s
            this.z = (m13 + m31) / s
        } else if (m22 > m33) {
            const s = 2 * Math.sqrt(1 + m22 - m11 - m33)
            this.w = (m13 - m31) / s
            this.x = (m12 + m21) / s
            this.y = 0.25 * s
            this.z = (m23 + m32) / s
        } else {
            const s = 2 * Math.sqrt(1 + m33 - m11 - m22)
            this.w = (m21 - m12) / s
            this.x = (m13 + m31) / s
            this.y = (m23 + m32) / s
            this.z = 0.25 * s
        }
        return this
    }

    // ---- 运算（委托给静态方法） ----

    add(q: QuaternionLike): this {
        Quaternion.add(this, this, q)
        return this
    }

    subtract(q: QuaternionLike): this {
        Quaternion.subtract(this, this, q)
        return this
    }

    /** this = this * q */
    multiply(q: QuaternionLike): this {
        Quaternion.multiply(this, this, q)
        return this
    }

    /** this = q * this */
    premultiply(q: QuaternionLike): this {
        Quaternion.multiply(this, q, this)
        return this
    }

    multiplyScalar(s: number): this {
        Quaternion.multiplyScalar(this, this, s)
        return this
    }

    negate(): this {
        Quaternion.negate(this, this)
        return this
    }

    normalize(): this {
        Quaternion.normalize(this, this)
        return this
    }

    conjugate(): this {
        Quaternion.conjugate(this, this)
        return this
    }

    /** 求逆；零四元数返回零 */
    invert(): this {
        Quaternion.invert(this, this)
        return this
    }

    lerp(to: QuaternionLike, t: number): this {
        Quaternion.lerp(this, this, to, t)
        return this
    }

    slerp(to: QuaternionLike, t: number): this {
        Quaternion.slerp(this, this, to, t)
        return this
    }

    /** this = q * this * q⁻¹ 旋转向量 v（写入 out 并返回） */
    rotateVector(out: Vector3Like, v: Vector3Like): Vector3Like {
        return Quaternion.rotateVector(out, v, this)
    }

    // ---- 查询 ----

    length(): number {
        return Math.hypot(this.x, this.y, this.z, this.w)
    }

    lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    }

    dot(q: QuaternionLike): number {
        return Quaternion.dot(this, q)
    }

    /** 与 q 的夹角 (rad) */
    angleTo(q: QuaternionLike): number {
        return Quaternion.angleBetween(this, q)
    }

    equals(q: QuaternionLike): boolean {
        return Quaternion.equals(this, q)
    }

    equalsEpsilon(q: QuaternionLike, epsilon?: number): boolean {
        return Quaternion.equalsEpsilon(this, q, epsilon)
    }

    isFinite(): boolean {
        return Number.isFinite(this.x) && Number.isFinite(this.y)
            && Number.isFinite(this.z) && Number.isFinite(this.w)
    }

    isIdentity(): boolean {
        return this.x === 0 && this.y === 0 && this.z === 0 && this.w === 1
    }

    isZero(): boolean {
        return this.x === 0 && this.y === 0 && this.z === 0 && this.w === 0
    }

    // ---- 转换 ----

    toMatrix3(out?: Matrix3): Matrix3 {
        return Quaternion.toMatrix3(this, out)
    }

    toMatrix4(out?: Matrix4): Matrix4 {
        return Quaternion.toMatrix4(this, out)
    }

    // ---- 工具 ----

    clone(): Quaternion {
        return new Quaternion(this.x, this.y, this.z, this.w)
    }

    toArray(): [number, number, number, number] {
        return [this.x, this.y, this.z, this.w]
    }

    toString(): string {
        return `Quaternion(${this.x}, ${this.y}, ${this.z}, ${this.w})`
    }
}
