// ============================================================
// Matrix3 — 3x3 矩阵
// 基于 Float32Array，列主序存储（与 gl-matrix / WebGL 兼容）：
//   | m0 m3 m6 |
//   | m1 m4 m7 |
//   | m2 m5 m8 |
// ============================================================

import { CachePool } from './CachePool'
import type { Vector3Like } from './Vector3'

/** 类矩阵输入：number[] 或 Float32Array（含 Matrix3 实例） */
export type Matrix3Like = number[] | Float32Array

/** 矩阵元素索引常量（列主序） */
export const enum Matrix3Index {
    M00 = 0, M10 = 1, M20 = 2,
    M01 = 3, M11 = 4, M21 = 5,
    M02 = 6, M12 = 7, M22 = 8,
}

export class Matrix3 extends Float32Array {
    static pool = CachePool.create({
        initSize: 20,
        create: () => Matrix3.identity(),
        init(item: Matrix3) {
            item.identity()
        }
    })

    // ---- 静态工厂 ----

    static identity(): Matrix3 {
        return new Matrix3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        )
    }

    static zero(): Matrix3 {
        return new Matrix3(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        )
    }

    /** 按列主序 9 个元素构造：m00,m10,m20, m01,m11,m21, m02,m12,m22 */
    static fromValues(
        m00: number, m10: number, m20: number,
        m01: number, m11: number, m21: number,
        m02: number, m12: number, m22: number
    ): Matrix3 {
        return new Matrix3(m00, m10, m20, m01, m11, m21, m02, m12, m22)
    }

    static fromArray(arr: ArrayLike<number>): Matrix3 {
        return new Matrix3(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], arr[8])
    }

    /** 2D 平移矩阵 */
    static fromTranslation(tx: number, ty: number): Matrix3 {
        return new Matrix3(
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1
        )
    }

    /** 2D 缩放矩阵 */
    static fromScaling(sx: number, sy: number): Matrix3 {
        return new Matrix3(
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        )
    }

    /** 2D 旋转矩阵（rad，逆时针为正） */
    static fromRotation(rad: number): Matrix3 {
        const s = Math.sin(rad)
        const c = Math.cos(rad)
        return new Matrix3(
            c, s, 0,
            -s, c, 0,
            0, 0, 1
        )
    }

    /** 绕 X 轴旋转矩阵（rad） */
    static fromRotationX(rad: number): Matrix3 {
        const s = Math.sin(rad)
        const c = Math.cos(rad)
        return new Matrix3(
            1, 0, 0,
            0, c, s,
            0, -s, c
        )
    }

    /** 绕 Y 轴旋转矩阵（rad） */
    static fromRotationY(rad: number): Matrix3 {
        const s = Math.sin(rad)
        const c = Math.cos(rad)
        return new Matrix3(
            c, 0, -s,
            0, 1, 0,
            s, 0, c
        )
    }

    /** 绕 Z 轴旋转矩阵（rad） */
    static fromRotationZ(rad: number): Matrix3 {
        const s = Math.sin(rad)
        const c = Math.cos(rad)
        return new Matrix3(
            c, s, 0,
            -s, c, 0,
            0, 0, 1
        )
    }

    /** 绕任意轴（单位方向向量）旋转矩阵（rad） */
    static fromRotationAxis(axis: Vector3Like, rad: number): Matrix3 {
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        const t = 1 - c
        const x = axis.x, y = axis.y, z = axis.z
        return new Matrix3(
            t * x * x + c, t * x * y + s * z, t * x * z - s * y,
            t * x * y - s * z, t * y * y + c, t * y * z + s * x,
            t * x * z + s * y, t * y * z - s * x, t * z * z + c
        )
    }

    /** 从 2D 仿射矩阵（Matrix2D 布局 [a,b,c,d,tx,ty]）构造 3x3 */
    static fromMatrix2D(m: ArrayLike<number>): Matrix3 {
        return new Matrix3(
            m[0], m[1], 0,
            m[2], m[3], 0,
            m[4], m[5], 1
        )
    }

    // ---- 静态运算 ----

    /** out = a * b（列主序矩阵乘法） */
    static multiply(out: Matrix3Like, a: Matrix3Like, b: Matrix3Like): Matrix3Like {
        const a00 = a[0], a01 = a[1], a02 = a[2]
        const a10 = a[3], a11 = a[4], a12 = a[5]
        const a20 = a[6], a21 = a[7], a22 = a[8]

        const b00 = b[0], b01 = b[1], b02 = b[2]
        const b10 = b[3], b11 = b[4], b12 = b[5]
        const b20 = b[6], b21 = b[7], b22 = b[8]

        out[0] = b00 * a00 + b01 * a10 + b02 * a20
        out[1] = b00 * a01 + b01 * a11 + b02 * a21
        out[2] = b00 * a02 + b01 * a12 + b02 * a22

        out[3] = b10 * a00 + b11 * a10 + b12 * a20
        out[4] = b10 * a01 + b11 * a11 + b12 * a21
        out[5] = b10 * a02 + b11 * a12 + b12 * a22

        out[6] = b20 * a00 + b21 * a10 + b22 * a20
        out[7] = b20 * a01 + b21 * a11 + b22 * a21
        out[8] = b20 * a02 + b21 * a12 + b22 * a22
        return out
    }

    /** out = m * s */
    static multiplyScalar(out: Matrix3Like, m: Matrix3Like, s: number): Matrix3Like {
        out[0] = m[0] * s
        out[1] = m[1] * s
        out[2] = m[2] * s
        out[3] = m[3] * s
        out[4] = m[4] * s
        out[5] = m[5] * s
        out[6] = m[6] * s
        out[7] = m[7] * s
        out[8] = m[8] * s
        return out
    }

    /** out = m 的转置 */
    static transpose(out: Matrix3Like, m: Matrix3Like): Matrix3Like {
        const m00 = m[0], m01 = m[1], m02 = m[2]
        const m10 = m[3], m11 = m[4], m12 = m[5]
        const m20 = m[6], m21 = m[7], m22 = m[8]
        out[0] = m00
        out[1] = m10
        out[2] = m20
        out[3] = m01
        out[4] = m11
        out[5] = m21
        out[6] = m02
        out[7] = m12
        out[8] = m22
        return out
    }

    /** 行列式 */
    static determinant(m: Matrix3Like): number {
        const m00 = m[0], m01 = m[1], m02 = m[2]
        const m10 = m[3], m11 = m[4], m12 = m[5]
        const m20 = m[6], m21 = m[7], m22 = m[8]
        return m00 * (m11 * m22 - m12 * m21)
            - m10 * (m01 * m22 - m02 * m21)
            + m20 * (m01 * m12 - m02 * m11)
    }

    /** out = m 的伴随矩阵 */
    static adjoint(out: Matrix3Like, m: Matrix3Like): Matrix3Like {
        const m00 = m[0], m01 = m[1], m02 = m[2]
        const m10 = m[3], m11 = m[4], m12 = m[5]
        const m20 = m[6], m21 = m[7], m22 = m[8]

        out[0] = m11 * m22 - m12 * m21
        out[1] = m02 * m21 - m01 * m22
        out[2] = m01 * m12 - m02 * m11
        out[3] = m12 * m20 - m10 * m22
        out[4] = m00 * m22 - m02 * m20
        out[5] = m02 * m10 - m00 * m12
        out[6] = m10 * m21 - m11 * m20
        out[7] = m01 * m20 - m00 * m21
        out[8] = m00 * m11 - m01 * m10
        return out
    }

    /** out = m 的逆矩阵；行列式为 0 时返回 null */
    static invert(out: Matrix3Like, m: Matrix3Like): Matrix3Like | null {
        const m00 = m[0], m01 = m[1], m02 = m[2]
        const m10 = m[3], m11 = m[4], m12 = m[5]
        const m20 = m[6], m21 = m[7], m22 = m[8]

        const b01 = m22 * m11 - m12 * m21
        const b11 = -m22 * m10 + m12 * m20
        const b21 = m21 * m10 - m11 * m20

        let det = m00 * b01 + m01 * b11 + m02 * b21
        if (det === 0) return null
        det = 1.0 / det

        out[0] = b01 * det
        out[1] = (-m22 * m01 + m02 * m21) * det
        out[2] = (m12 * m01 - m02 * m11) * det
        out[3] = b11 * det
        out[4] = (m22 * m00 - m02 * m20) * det
        out[5] = (-m12 * m00 + m02 * m10) * det
        out[6] = b21 * det
        out[7] = (-m21 * m00 + m01 * m20) * det
        out[8] = (m11 * m00 - m01 * m10) * det
        return out
    }

    static equals(a: Matrix3Like, b: Matrix3Like): boolean {
        for (let i = 0; i < 9; i++) {
            if (a[i] !== b[i]) return false
        }
        return true
    }

    // ==================== 实例 API ====================

    /** 按列主序 9 个元素构造：m00,m10,m20, m01,m11,m21, m02,m12,m22 */
    constructor(
        m00: number = 1, m10: number = 0, m20: number = 0,
        m01: number = 0, m11: number = 1, m21: number = 0,
        m02: number = 0, m12: number = 0, m22: number = 1
    ) {
        super(9)
        this[0] = m00
        this[1] = m10
        this[2] = m20
        this[3] = m01
        this[4] = m11
        this[5] = m21
        this[6] = m02
        this[7] = m12
        this[8] = m22
    }

    // ---- 命名属性访问器 ----

    get m00(): number { return this[0] }
    set m00(v: number) { this[0] = v }
    get m10(): number { return this[1] }
    set m10(v: number) { this[1] = v }
    get m20(): number { return this[2] }
    set m20(v: number) { this[2] = v }
    get m01(): number { return this[3] }
    set m01(v: number) { this[3] = v }
    get m11(): number { return this[4] }
    set m11(v: number) { this[4] = v }
    get m21(): number { return this[5] }
    set m21(v: number) { this[5] = v }
    get m02(): number { return this[6] }
    set m02(v: number) { this[6] = v }
    get m12(): number { return this[7] }
    set m12(v: number) { this[7] = v }
    get m22(): number { return this[8] }
    set m22(v: number) { this[8] = v }

    // ---- 写入 ----

    fromValues(
        m00: number, m10: number, m20: number,
        m01: number, m11: number, m21: number,
        m02: number, m12: number, m22: number
    ): this {
        this[0] = m00; this[1] = m10; this[2] = m20
        this[3] = m01; this[4] = m11; this[5] = m21
        this[6] = m02; this[7] = m12; this[8] = m22
        return this
    }

    identity(): this {
        return this.fromValues(1, 0, 0, 0, 1, 0, 0, 0, 1)
    }

    fromArray(m: Matrix3Like): this {
        return this.fromValues(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8])
    }

    copy(m: Matrix3Like): this {
        for (let i = 0; i < 9; i++) {
            this[i] = m[i]
        }
        return this
    }

    // ---- 自身变换（this = this * op） ----

    multiplyMatrices(a: Matrix3Like, b: Matrix3Like): this {
        Matrix3.multiply(this, a, b)
        return this
    }

    multiply(m: Matrix3Like): this {
        Matrix3.multiply(this, this, m)
        return this
    }

    /** this = m * this */
    premultiply(m: Matrix3Like): this {
        Matrix3.multiply(this, m, this)
        return this
    }

    /** this = this * T(tx, ty) */
    translate(tx: number, ty: number): this {
        const a00 = this[0], a01 = this[1], a02 = this[2]
        const a10 = this[3], a11 = this[4], a12 = this[5]
        const a20 = this[6], a21 = this[7], a22 = this[8]
        this[6] = tx * a00 + ty * a10 + a20
        this[7] = tx * a01 + ty * a11 + a21
        this[8] = tx * a02 + ty * a12 + a22
        return this
    }

    /** this = this * R(rad)（2D 旋转） */
    rotate(rad: number): this {
        const s = Math.sin(rad)
        const c = Math.cos(rad)
        const a00 = this[0], a01 = this[1], a02 = this[2]
        const a10 = this[3], a11 = this[4], a12 = this[5]
        const a20 = this[6], a21 = this[7], a22 = this[8]
        this[0] = c * a00 + s * a10
        this[1] = c * a01 + s * a11
        this[2] = c * a02 + s * a12
        this[3] = -s * a00 + c * a10
        this[4] = -s * a01 + c * a11
        this[5] = -s * a02 + c * a12
        this[6] = a20
        this[7] = a21
        this[8] = a22
        return this
    }

    /** this = this * S(sx, sy)（2D 缩放） */
    scale(sx: number, sy: number): this {
        this[0] *= sx
        this[1] *= sx
        this[2] *= sx
        this[3] *= sy
        this[4] *= sy
        this[5] *= sy
        return this
    }

    transpose(): this {
        Matrix3.transpose(this, this)
        return this
    }

    /** 求逆；行列式为 0 时返回 null */
    invert(): Matrix3 | null {
        return Matrix3.invert(this, this) as Matrix3 | null
    }

    adjoint(): this {
        Matrix3.adjoint(this, this)
        return this
    }

    determinant(): number {
        return Matrix3.determinant(this)
    }

    equals(m: Matrix3Like): boolean {
        return Matrix3.equals(this, m)
    }

    isIdentity(): boolean {
        return this[0] === 1 && this[4] === 1 && this[8] === 1
            && this[1] === 0 && this[2] === 0 && this[3] === 0
            && this[5] === 0 && this[6] === 0 && this[7] === 0
    }

    isSingular(): boolean {
        return this.determinant() === 0
    }

    // ---- 向量变换 ----

    /** out = m * v */
    transformVector3(out: Vector3Like, v: Vector3Like): Vector3Like {
        const x = v.x, y = v.y, z = v.z
        out.x = this[0] * x + this[3] * y + this[6] * z
        out.y = this[1] * x + this[4] * y + this[7] * z
        out.z = this[2] * x + this[5] * y + this[8] * z
        return out
    }

    /** 2D 点变换（齐次坐标，w=1） */
    transformPoint(out: Vector3Like, v: Vector3Like): Vector3Like {
        return this.transformVector3(out, v)
    }

    // ---- 工具 ----

    clone(): Matrix3 {
        return new Matrix3(this[0], this[1], this[2], this[3], this[4], this[5], this[6], this[7], this[8])
    }

    toArray(): number[] {
        return [this[0], this[1], this[2], this[3], this[4], this[5], this[6], this[7], this[8]]
    }

    toString(): string {
        return `Matrix3(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]}, ${this[4]}, ${this[5]}, ${this[6]}, ${this[7]}, ${this[8]})`
    }
}
