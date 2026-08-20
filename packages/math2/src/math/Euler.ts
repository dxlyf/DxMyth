// ============================================================
// Euler — 欧拉角（弧度）
// 旋转顺序支持六种：XYZ、YXZ、ZXY、ZYX、YZX、XZY（与 three.js 一致，默认 XYZ）
// 角度为弧度，绕轴正方向为逆时针（右手系）
// ============================================================

import { Quaternion, QuaternionLike } from './Quaternion'
import { Matrix3, Matrix3Like } from './Matrix3'
import { Matrix4 } from './Matrix4'
import { clamp } from './MathUtils'

export type EulerOrder = 'XYZ' | 'YXZ' | 'ZXY' | 'ZYX' | 'YZX' | 'XZY'

export type EulerLike = {
    x: number
    y: number
    z: number
    order?: EulerOrder
}

export class Euler {
    // ---- 静态工厂 ----

    static zero(): Euler {
        return new Euler(0, 0, 0, 'XYZ')
    }

    static fromValues(x: number = 0, y: number = 0, z: number = 0, order: EulerOrder = 'XYZ'): Euler {
        return new Euler(x, y, z, order)
    }

    static from(e: EulerLike): Euler {
        return new Euler(e.x, e.y, e.z, e.order)
    }

    static fromArray(arr: ArrayLike<number>): Euler {
        return new Euler(arr[0], arr[1], arr[2])
    }

    /** 从旋转矩阵（3x3，仅旋转部分）提取欧拉角 */
    static fromMatrix3(m: Matrix3Like, order: EulerOrder = 'XYZ'): Euler {
        return new Euler(0, 0, 0, order).setFromRotationMatrix3(m)
    }

    /** 从四元数提取欧拉角 */
    static fromQuaternion(q: QuaternionLike, order: EulerOrder = 'XYZ'): Euler {
        return new Euler(0, 0, 0, order).setFromQuaternion(q)
    }

    static equals(a: EulerLike, b: EulerLike): boolean {
        return a.x === b.x && a.y === b.y && a.z === b.z && (a.order ?? 'XYZ') === (b.order ?? 'XYZ')
    }

    static equalsEpsilon(a: EulerLike, b: EulerLike, epsilon: number = 1e-9): boolean {
        return Math.abs(a.x - b.x) <= epsilon
            && Math.abs(a.y - b.y) <= epsilon
            && Math.abs(a.z - b.z) <= epsilon
    }

    static add(out: Euler, a: EulerLike, b: EulerLike): Euler {
        out.x = a.x + b.x
        out.y = a.y + b.y
        out.z = a.z + b.z
        out.order = b.order ?? a.order ?? 'XYZ'
        return out
    }

    static subtract(out: Euler, a: EulerLike, b: EulerLike): Euler {
        out.x = a.x - b.x
        out.y = a.y - b.y
        out.z = a.z - b.z
        out.order = a.order ?? 'XYZ'
        return out
    }

    static lerp(out: Euler, a: EulerLike, b: EulerLike, t: number): Euler {
        out.x = a.x + (b.x - a.x) * t
        out.y = a.y + (b.y - a.y) * t
        out.z = a.z + (b.z - a.z) * t
        out.order = b.order ?? a.order ?? 'XYZ'
        return out
    }

    // ==================== 实例 ====================

    x: number
    y: number
    z: number
    order: EulerOrder

    constructor(x: number = 0, y: number = 0, z: number = 0, order: EulerOrder = 'XYZ') {
        this.x = x
        this.y = y
        this.z = z
        this.order = order
    }

    set(x: number, y: number, z: number, order: EulerOrder = this.order): this {
        this.x = x
        this.y = y
        this.z = z
        this.order = order
        return this
    }

    copy(e: EulerLike): this {
        this.x = e.x
        this.y = e.y
        this.z = e.z
        this.order = e.order ?? 'XYZ'
        return this
    }

    zero(): this {
        return this.set(0, 0, 0)
    }

    add(e: EulerLike): this {
        Euler.add(this, this, e)
        return this
    }

    subtract(e: EulerLike): this {
        Euler.subtract(this, this, e)
        return this
    }

    lerp(to: EulerLike, t: number): this {
        Euler.lerp(this, this, to, t)
        return this
    }

    equals(e: EulerLike): boolean {
        return Euler.equals(this, e)
    }

    equalsEpsilon(e: EulerLike, epsilon?: number): boolean {
        return Euler.equalsEpsilon(this, e, epsilon)
    }

    /** 从旋转矩阵（3x3，仅旋转部分）提取欧拉角，支持六种旋转顺序（three.js 算法） */
    setFromRotationMatrix3(m: Matrix3Like, order: EulerOrder = this.order): this {
        this.order = order
        // 列主序：m00=te[0], m01=te[3], m02=te[6], m10=te[1], m11=te[4], m12=te[7], m20=te[2], m21=te[5], m22=te[8]
        const m11 = m[0], m12 = m[3], m13 = m[6]
        const m21 = m[1], m22 = m[4], m23 = m[7]
        const m31 = m[2], m32 = m[5], m33 = m[8]

        const ord = order
        if (ord === 'XYZ') {
            this.y = Math.asin(clamp(m13, -1, 1))
            if (Math.abs(m13) < 0.9999999) {
                this.x = Math.atan2(-m23, m33)
                this.z = Math.atan2(-m12, m11)
            } else {
                this.x = Math.atan2(m32, m22)
                this.z = 0
            }
        } else if (ord === 'YXZ') {
            this.x = Math.asin(clamp(-m23, -1, 1))
            if (Math.abs(m23) < 0.9999999) {
                this.y = Math.atan2(m13, m33)
                this.z = Math.atan2(m21, m22)
            } else {
                this.y = Math.atan2(-m31, m11)
                this.z = 0
            }
        } else if (ord === 'ZXY') {
            this.x = Math.asin(clamp(m32, -1, 1))
            if (Math.abs(m32) < 0.9999999) {
                this.y = Math.atan2(-m31, m33)
                this.z = Math.atan2(-m12, m22)
            } else {
                this.y = 0
                this.z = Math.atan2(m21, m11)
            }
        } else if (ord === 'ZYX') {
            this.y = Math.asin(clamp(-m31, -1, 1))
            if (Math.abs(m31) < 0.9999999) {
                this.x = Math.atan2(m32, m33)
                this.z = Math.atan2(m21, m11)
            } else {
                this.x = 0
                this.z = Math.atan2(-m12, m22)
            }
        } else if (ord === 'YZX') {
            this.z = Math.asin(clamp(m21, -1, 1))
            if (Math.abs(m21) < 0.9999999) {
                this.x = Math.atan2(-m23, m22)
                this.y = Math.atan2(-m31, m11)
            } else {
                this.x = 0
                this.y = Math.atan2(m13, m33)
            }
        } else if (ord === 'XZY') {
            this.z = Math.asin(clamp(-m12, -1, 1))
            if (Math.abs(m12) < 0.9999999) {
                this.x = Math.atan2(m32, m22)
                this.y = Math.atan2(m13, m11)
            } else {
                this.x = Math.atan2(-m23, m33)
                this.y = 0
            }
        }
        return this
    }

    /** 从四元数提取欧拉角（q → 旋转矩阵 → 欧拉角） */
    setFromQuaternion(q: QuaternionLike, order: EulerOrder = this.order): this {
        return this.setFromRotationMatrix3(Quaternion.toMatrix3(q), order)
    }

    /** 转换为四元数（旋转顺序决定乘法次序，three.js 算法） */
    toQuaternion(out?: Quaternion): Quaternion {
        const q = out ?? new Quaternion()
        const x = this.x, y = this.y, z = this.z
        const c1 = Math.cos(x / 2), c2 = Math.cos(y / 2), c3 = Math.cos(z / 2)
        const s1 = Math.sin(x / 2), s2 = Math.sin(y / 2), s3 = Math.sin(z / 2)

        switch (this.order) {
            case 'XYZ':
                q.x = s1 * c2 * c3 + c1 * s2 * s3
                q.y = c1 * s2 * c3 - s1 * c2 * s3
                q.z = c1 * c2 * s3 + s1 * s2 * c3
                q.w = c1 * c2 * c3 - s1 * s2 * s3
                break
            case 'YXZ':
                q.x = s1 * c2 * c3 + c1 * s2 * s3
                q.y = c1 * s2 * c3 - s1 * c2 * s3
                q.z = c1 * c2 * s3 - s1 * s2 * c3
                q.w = c1 * c2 * c3 + s1 * s2 * s3
                break
            case 'ZXY':
                q.x = s1 * c2 * c3 - c1 * s2 * s3
                q.y = c1 * s2 * c3 + s1 * c2 * s3
                q.z = c1 * c2 * s3 + s1 * s2 * c3
                q.w = c1 * c2 * c3 - s1 * s2 * s3
                break
            case 'ZYX':
                q.x = s1 * c2 * c3 - c1 * s2 * s3
                q.y = c1 * s2 * c3 + s1 * c2 * s3
                q.z = c1 * c2 * s3 - s1 * s2 * c3
                q.w = c1 * c2 * c3 + s1 * s2 * s3
                break
            case 'YZX':
                q.x = s1 * c2 * c3 + c1 * s2 * s3
                q.y = c1 * s2 * c3 + s1 * c2 * s3
                q.z = c1 * c2 * s3 - s1 * s2 * c3
                q.w = c1 * c2 * c3 - s1 * s2 * s3
                break
            case 'XZY':
                q.x = s1 * c2 * c3 - c1 * s2 * s3
                q.y = c1 * s2 * c3 - s1 * c2 * s3
                q.z = c1 * c2 * s3 + s1 * s2 * c3
                q.w = c1 * c2 * c3 + s1 * s2 * s3
                break
        }
        return q
    }

    /** 转换为 3x3 旋转矩阵 */
    toMatrix3(out?: Matrix3): Matrix3 {
        const m = out ?? new Matrix3()
        return Quaternion.toMatrix3(this.toQuaternion(), m)
    }

    /** 转换为 4x4 旋转矩阵（左上 3x3 + 单位第四行/列） */
    toMatrix4(out?: Matrix4): Matrix4 {
        const m = out ?? Matrix4.identity()
        return Quaternion.toMatrix4(this.toQuaternion(), m)
    }

    clone(): Euler {
        return new Euler(this.x, this.y, this.z, this.order)
    }

    toArray(): [number, number, number] {
        return [this.x, this.y, this.z]
    }

    toString(): string {
        return `Euler(${this.x}, ${this.y}, ${this.z}, ${this.order})`
    }
}
