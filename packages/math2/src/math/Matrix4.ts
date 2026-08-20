// ============================================================
// Matrix4 — 4x4 矩阵
// 基于 Float32Array，列主序存储（与 gl-matrix / WebGL / WebGPU 兼容）：
//   | m0 m4 m8  m12 |
//   | m1 m5 m9  m13 |
//   | m2 m6 m10 m14 |
//   | m3 m7 m11 m15 |
// ============================================================

import { CachePool } from './CachePool'
import type { EulerLike, EulerOrder } from './Euler'
import type { QuaternionLike } from './Quaternion'
import type { Vector3Like } from './Vector3'
import type { Vector4Like } from './Vector4'

/** 类矩阵输入：number[] 或 Float32Array（含 Matrix4 实例） */
export type Matrix4Like = number[] | Float32Array

/** 矩阵元素索引常量（列主序） */
export const enum Matrix4Index {
    M00 = 0, M10 = 1, M20 = 2, M30 = 3,
    M01 = 4, M11 = 5, M21 = 6, M31 = 7,
    M02 = 8, M12 = 9, M22 = 10, M32 = 11,
    M03 = 12, M13 = 13, M23 = 14, M33 = 15,
}

export class Matrix4 extends Float32Array {
    static pool = CachePool.create({
        initSize: 20,
        create: () => Matrix4.identity(),
        init(item: Matrix4) {
            item.identity()
        }
    })

    // ---- 静态工厂 ----

    static identity(): Matrix4 {
        return new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }

    static zero(): Matrix4 {
        return new Matrix4(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        )
    }

    /** 按列主序 16 个元素构造 */
    static fromValues(
        m00: number, m10: number, m20: number, m30: number,
        m01: number, m11: number, m21: number, m31: number,
        m02: number, m12: number, m22: number, m32: number,
        m03: number, m13: number, m23: number, m33: number
    ): Matrix4 {
        return new Matrix4(
            m00, m10, m20, m30,
            m01, m11, m21, m31,
            m02, m12, m22, m32,
            m03, m13, m23, m33
        )
    }

    static fromArray(arr: ArrayLike<number>): Matrix4 {
        return new Matrix4(
            arr[0], arr[1], arr[2], arr[3],
            arr[4], arr[5], arr[6], arr[7],
            arr[8], arr[9], arr[10], arr[11],
            arr[12], arr[13], arr[14], arr[15]
        )
    }

    /** 平移矩阵 */
    static fromTranslation(tx: number, ty: number, tz: number): Matrix4 {
        return new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        )
    }

    /** 缩放矩阵 */
    static fromScaling(sx: number, sy: number, sz: number): Matrix4 {
        return new Matrix4(
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        )
    }

    /** 绕任意轴（单位方向向量）旋转矩阵（rad） */
    static fromRotation(axis: Vector3Like, rad: number): Matrix4 {
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        const t = 1 - c
        const x = axis.x, y = axis.y, z = axis.z
        return new Matrix4(
            t * x * x + c, t * x * y + s * z, t * x * z - s * y, 0,
            t * x * y - s * z, t * y * y + c, t * y * z + s * x, 0,
            t * x * z + s * y, t * y * z - s * x, t * z * z + c, 0,
            0, 0, 0, 1
        )
    }

    /** 绕 X 轴旋转矩阵（rad） */
    static fromRotationX(rad: number): Matrix4 {
        const s = Math.sin(rad)
        const c = Math.cos(rad)
        return new Matrix4(
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        )
    }

    /** 绕 Y 轴旋转矩阵（rad） */
    static fromRotationY(rad: number): Matrix4 {
        const s = Math.sin(rad)
        const c = Math.cos(rad)
        return new Matrix4(
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        )
    }

    /** 绕 Z 轴旋转矩阵（rad） */
    static fromRotationZ(rad: number): Matrix4 {
        const s = Math.sin(rad)
        const c = Math.cos(rad)
        return new Matrix4(
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }

    /**
     * 从 旋转(轴角) + 平移 + 缩放 组合构造（列主序）
     * M = T(t) · R(axis, rad) · S(s)
     */
    static fromRotationTranslationScale(
        axis: Vector3Like, rad: number,
        translation: Vector3Like,
        scale: Vector3Like
    ): Matrix4 {
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        const t = 1 - c
        const x = axis.x, y = axis.y, z = axis.z
        const sx = scale.x, sy = scale.y, sz = scale.z
        return new Matrix4(
            sx * (t * x * x + c), sx * (t * x * y + s * z), sx * (t * x * z - s * y), 0,
            sy * (t * x * y - s * z), sy * (t * y * y + c), sy * (t * y * z + s * x), 0,
            sz * (t * x * z + s * y), sz * (t * y * z - s * x), sz * (t * z * z + c), 0,
            translation.x, translation.y, translation.z, 1
        )
    }

    /** 从 3x3 矩阵构造（左上 3x3 部分 + 单位第四行/列） */
    static fromMatrix3(m: ArrayLike<number>): Matrix4 {
        return new Matrix4(
            m[0], m[1], m[2], 0,
            m[3], m[4], m[5], 0,
            m[6], m[7], m[8], 0,
            0, 0, 0, 1
        )
    }

    /** 从四元数构造旋转矩阵（左上 3x3，第四行/列单位；q 需为单位四元数） */
    static fromQuaternion(q: QuaternionLike): Matrix4 {
        return new Matrix4().setFromQuaternion(q)
    }

    /** 从欧拉角构造旋转矩阵（旋转顺序由 euler.order 决定，默认 XYZ） */
    static fromEuler(euler: EulerLike): Matrix4 {
        return new Matrix4().setFromEuler(euler)
    }

    /**
     * 透视投影矩阵
     * @param fovy   垂直视场角（rad）
     * @param aspect 宽高比 width/height
     * @param near   近裁剪面（> 0）
     * @param far    远裁剪面（> near）
     */
    static perspective(fovy: number, aspect: number, near: number, far: number): Matrix4 {
        const f = 1.0 / Math.tan(fovy / 2)
        const nf = 1 / (near - far)
        return new Matrix4(
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, 2 * far * near * nf, 0
        )
    }

    /** 正交投影矩阵 */
    static ortho(
        left: number, right: number,
        bottom: number, top: number,
        near: number, far: number
    ): Matrix4 {
        const lr = 1 / (left - right)
        const bt = 1 / (bottom - top)
        const nf = 1 / (near - far)
        return new Matrix4(
            -2 * lr, 0, 0, 0,
            0, -2 * bt, 0, 0,
            0, 0, 2 * nf, 0,
            (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1
        )
    }

    /**
     * 观察矩阵（右手坐标系，gl-matrix 约定）
     * @param eye    相机位置
     * @param center 观察目标点
     * @param up     上方向
     */
    static lookAt(eye: Vector3Like, center: Vector3Like, up: Vector3Like): Matrix4 {
        const eyex = eye.x, eyey = eye.y, eyez = eye.z
        const upx = up.x, upy = up.y, upz = up.z

        let z0 = eyex - center.x, z1 = eyey - center.y, z2 = eyez - center.z
        let len = 1 / Math.hypot(z0, z1, z2)
        z0 *= len
        z1 *= len
        z2 *= len

        let x0 = upy * z2 - upz * z1
        let x1 = upz * z0 - upx * z2
        let x2 = upx * z1 - upy * z0
        len = 1 / Math.hypot(x0, x1, x2)
        x0 *= len
        x1 *= len
        x2 *= len

        const y0 = z1 * x2 - z2 * x1
        const y1 = z2 * x0 - z0 * x2
        const y2 = z0 * x1 - z1 * x0

        return new Matrix4(
            x0, y0, z0, 0,
            x1, y1, z1, 0,
            x2, y2, z2, 0,
            -(x0 * eyex + x1 * eyey + x2 * eyez),
            -(y0 * eyex + y1 * eyey + y2 * eyez),
            -(z0 * eyex + z1 * eyey + z2 * eyez),
            1
        )
    }

    // ---- 静态运算 ----

    /** out = a * b（列主序矩阵乘法） */
    static multiply(out: Matrix4Like, a: Matrix4Like, b: Matrix4Like): Matrix4Like {
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3]
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7]
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11]
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15]

        const b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3]
        const b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7]
        const b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11]
        const b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15]

        out[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30
        out[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31
        out[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32
        out[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33

        out[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30
        out[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31
        out[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32
        out[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33

        out[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30
        out[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31
        out[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32
        out[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33

        out[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30
        out[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31
        out[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32
        out[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
        return out
    }

    /** out = m * s */
    static multiplyScalar(out: Matrix4Like, m: Matrix4Like, s: number): Matrix4Like {
        for (let i = 0; i < 16; i++) {
            out[i] = m[i] * s
        }
        return out
    }

    /** out = m 的转置 */
    static transpose(out: Matrix4Like, m: Matrix4Like): Matrix4Like {
        const m00 = m[0], m01 = m[1], m02 = m[2], m03 = m[3]
        const m10 = m[4], m11 = m[5], m12 = m[6], m13 = m[7]
        const m20 = m[8], m21 = m[9], m22 = m[10], m23 = m[11]
        const m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15]

        out[0] = m00
        out[1] = m10
        out[2] = m20
        out[3] = m30
        out[4] = m01
        out[5] = m11
        out[6] = m21
        out[7] = m31
        out[8] = m02
        out[9] = m12
        out[10] = m22
        out[11] = m32
        out[12] = m03
        out[13] = m13
        out[14] = m23
        out[15] = m33
        return out
    }

    /** 行列式 */
    static determinant(m: Matrix4Like): number {
        const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3]
        const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7]
        const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11]
        const a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15]

        const b00 = a00 * a11 - a01 * a10
        const b01 = a00 * a12 - a02 * a10
        const b02 = a00 * a13 - a03 * a10
        const b03 = a01 * a12 - a02 * a11
        const b04 = a01 * a13 - a03 * a11
        const b05 = a02 * a13 - a03 * a12
        const b06 = a20 * a31 - a21 * a30
        const b07 = a20 * a32 - a22 * a30
        const b08 = a20 * a33 - a23 * a30
        const b09 = a21 * a32 - a22 * a31
        const b10 = a21 * a33 - a23 * a31
        const b11 = a22 * a33 - a23 * a32

        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
    }

    /** out = m 的伴随矩阵 */
    static adjoint(out: Matrix4Like, m: Matrix4Like): Matrix4Like {
        const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3]
        const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7]
        const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11]
        const a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15]

        const b00 = a00 * a11 - a01 * a10
        const b01 = a00 * a12 - a02 * a10
        const b02 = a00 * a13 - a03 * a10
        const b03 = a01 * a12 - a02 * a11
        const b04 = a01 * a13 - a03 * a11
        const b05 = a02 * a13 - a03 * a12
        const b06 = a20 * a31 - a21 * a30
        const b07 = a20 * a32 - a22 * a30
        const b08 = a20 * a33 - a23 * a30
        const b09 = a21 * a32 - a22 * a31
        const b10 = a21 * a33 - a23 * a31
        const b11 = a22 * a33 - a23 * a32

        out[0] = a11 * b11 - a12 * b10 + a13 * b09
        out[1] = a02 * b10 - a01 * b11 - a03 * b09
        out[2] = a31 * b05 - a32 * b04 + a33 * b03
        out[3] = a22 * b04 - a21 * b05 - a23 * b03
        out[4] = a12 * b08 - a10 * b11 - a13 * b07
        out[5] = a00 * b11 - a02 * b08 + a03 * b07
        out[6] = a32 * b02 - a30 * b05 - a33 * b01
        out[7] = a20 * b05 - a22 * b02 + a23 * b01
        out[8] = a10 * b10 - a11 * b08 + a13 * b06
        out[9] = a01 * b08 - a00 * b10 - a03 * b06
        out[10] = a30 * b04 - a31 * b02 + a33 * b00
        out[11] = a21 * b02 - a20 * b04 - a23 * b00
        out[12] = a11 * b07 - a10 * b09 - a12 * b06
        out[13] = a00 * b09 - a01 * b07 + a02 * b06
        out[14] = a31 * b01 - a30 * b03 - a32 * b00
        out[15] = a20 * b03 - a21 * b01 + a22 * b00
        return out
    }

    /** out = m 的逆矩阵；行列式为 0 时返回 null */
    static invert(out: Matrix4Like, m: Matrix4Like): Matrix4Like | null {
        const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3]
        const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7]
        const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11]
        const a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15]

        const b00 = a00 * a11 - a01 * a10
        const b01 = a00 * a12 - a02 * a10
        const b02 = a00 * a13 - a03 * a10
        const b03 = a01 * a12 - a02 * a11
        const b04 = a01 * a13 - a03 * a11
        const b05 = a02 * a13 - a03 * a12
        const b06 = a20 * a31 - a21 * a30
        const b07 = a20 * a32 - a22 * a30
        const b08 = a20 * a33 - a23 * a30
        const b09 = a21 * a32 - a22 * a31
        const b10 = a21 * a33 - a23 * a31
        const b11 = a22 * a33 - a23 * a32

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
        if (!det) return null
        det = 1.0 / det

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det
        return out
    }

    static equals(a: Matrix4Like, b: Matrix4Like): boolean {
        for (let i = 0; i < 16; i++) {
            if (a[i] !== b[i]) return false
        }
        return true
    }

    // ==================== 实例 API ====================

    /** 按列主序 16 个元素构造，默认单位矩阵 */
    constructor(
        m00: number = 1, m10: number = 0, m20: number = 0, m30: number = 0,
        m01: number = 0, m11: number = 1, m21: number = 0, m31: number = 0,
        m02: number = 0, m12: number = 0, m22: number = 1, m32: number = 0,
        m03: number = 0, m13: number = 0, m23: number = 0, m33: number = 1
    ) {
        super(16)
        this[0] = m00; this[1] = m10; this[2] = m20; this[3] = m30
        this[4] = m01; this[5] = m11; this[6] = m21; this[7] = m31
        this[8] = m02; this[9] = m12; this[10] = m22; this[11] = m32
        this[12] = m03; this[13] = m13; this[14] = m23; this[15] = m33
    }

    // ---- 写入 ----

    fromValues(
        m00: number, m10: number, m20: number, m30: number,
        m01: number, m11: number, m21: number, m31: number,
        m02: number, m12: number, m22: number, m32: number,
        m03: number, m13: number, m23: number, m33: number
    ): this {
        this[0] = m00; this[1] = m10; this[2] = m20; this[3] = m30
        this[4] = m01; this[5] = m11; this[6] = m21; this[7] = m31
        this[8] = m02; this[9] = m12; this[10] = m22; this[11] = m32
        this[12] = m03; this[13] = m13; this[14] = m23; this[15] = m33
        return this
    }

    identity(): this {
        return this.fromValues(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }

    fromArray(m: Matrix4Like): this {
        for (let i = 0; i < 16; i++) {
            this[i] = m[i]
        }
        return this
    }

    copy(m: Matrix4Like): this {
        for (let i = 0; i < 16; i++) {
            this[i] = m[i]
        }
        return this
    }

    /** 将左上 3x3 设置为四元数 q 对应的旋转矩阵（第四行/列单位；q 需为单位四元数） */
    setFromQuaternion(q: QuaternionLike): this {
        const x = q.x, y = q.y, z = q.z, w = q.w
        const x2 = x + x, y2 = y + y, z2 = z + z
        const xx = x * x2, xy = x * y2, xz = x * z2
        const yy = y * y2, yz = y * z2, zz = z * z2
        const wx = w * x2, wy = w * y2, wz = w * z2

        this[0] = 1 - (yy + zz)
        this[1] = xy + wz
        this[2] = xz - wy
        this[3] = 0
        this[4] = xy - wz
        this[5] = 1 - (xx + zz)
        this[6] = yz + wx
        this[7] = 0
        this[8] = xz + wy
        this[9] = yz - wx
        this[10] = 1 - (xx + yy)
        this[11] = 0
        this[12] = 0
        this[13] = 0
        this[14] = 0
        this[15] = 1
        return this
    }

    /**
     * 将左上 3x3 设置为欧拉角对应的旋转矩阵（第四行/列单位）
     * @param order 旋转顺序，默认取 euler.order ?? 'XYZ'
     */
    setFromEuler(euler: EulerLike, order: EulerOrder = euler.order ?? 'XYZ'): this {
        const x = euler.x, y = euler.y, z = euler.z
        const c1 = Math.cos(x / 2), c2 = Math.cos(y / 2), c3 = Math.cos(z / 2)
        const s1 = Math.sin(x / 2), s2 = Math.sin(y / 2), s3 = Math.sin(z / 2)

        let qx: number, qy: number, qz: number, qw: number
        switch (order) {
            case 'XYZ':
                qx = s1 * c2 * c3 + c1 * s2 * s3
                qy = c1 * s2 * c3 - s1 * c2 * s3
                qz = c1 * c2 * s3 + s1 * s2 * c3
                qw = c1 * c2 * c3 - s1 * s2 * s3
                break
            case 'YXZ':
                qx = s1 * c2 * c3 + c1 * s2 * s3
                qy = c1 * s2 * c3 - s1 * c2 * s3
                qz = c1 * c2 * s3 - s1 * s2 * c3
                qw = c1 * c2 * c3 + s1 * s2 * s3
                break
            case 'ZXY':
                qx = s1 * c2 * c3 - c1 * s2 * s3
                qy = c1 * s2 * c3 + s1 * c2 * s3
                qz = c1 * c2 * s3 + s1 * s2 * c3
                qw = c1 * c2 * c3 - s1 * s2 * s3
                break
            case 'ZYX':
                qx = s1 * c2 * c3 - c1 * s2 * s3
                qy = c1 * s2 * c3 + s1 * c2 * s3
                qz = c1 * c2 * s3 - s1 * s2 * c3
                qw = c1 * c2 * c3 + s1 * s2 * s3
                break
            case 'YZX':
                qx = s1 * c2 * c3 + c1 * s2 * s3
                qy = c1 * s2 * c3 + s1 * c2 * s3
                qz = c1 * c2 * s3 - s1 * s2 * c3
                qw = c1 * c2 * c3 - s1 * s2 * s3
                break
            case 'XZY':
                qx = s1 * c2 * c3 - c1 * s2 * s3
                qy = c1 * s2 * c3 - s1 * c2 * s3
                qz = c1 * c2 * s3 + s1 * s2 * c3
                qw = c1 * c2 * c3 + s1 * s2 * s3
                break
        }
        return this.setFromQuaternion({ x: qx, y: qy, z: qz, w: qw })
    }

    // ---- 自身变换（this = this * op） ----

    multiplyMatrices(a: Matrix4Like, b: Matrix4Like): this {
        Matrix4.multiply(this, a, b)
        return this
    }

    multiply(m: Matrix4Like): this {
        Matrix4.multiply(this, this, m)
        return this
    }

    /** this = m * this */
    premultiply(m: Matrix4Like): this {
        Matrix4.multiply(this, m, this)
        return this
    }

    /** this = this * T(tx, ty, tz) */
    translate(tx: number, ty: number, tz: number): this {
        const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3]
        const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7]
        const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11]
        const a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15]
        this[12] = a00 * tx + a10 * ty + a20 * tz + a30
        this[13] = a01 * tx + a11 * ty + a21 * tz + a31
        this[14] = a02 * tx + a12 * ty + a22 * tz + a32
        this[15] = a03 * tx + a13 * ty + a23 * tz + a33
        return this
    }

    /** this = this * R(axis, rad) */
    rotate(axis: Vector3Like, rad: number): this {
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        const t = 1 - c
        const x = axis.x, y = axis.y, z = axis.z
        // 旋转矩阵列（列主序）
        const r00 = t * x * x + c, r01 = t * x * y + s * z, r02 = t * x * z - s * y
        const r10 = t * x * y - s * z, r11 = t * y * y + c, r12 = t * y * z + s * x
        const r20 = t * x * z + s * y, r21 = t * y * z - s * x, r22 = t * z * z + c

        const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3]
        const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7]
        const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11]

        this[0] = r00 * a00 + r01 * a10 + r02 * a20
        this[1] = r00 * a01 + r01 * a11 + r02 * a21
        this[2] = r00 * a02 + r01 * a12 + r02 * a22
        this[3] = r00 * a03 + r01 * a13 + r02 * a23
        this[4] = r10 * a00 + r11 * a10 + r12 * a20
        this[5] = r10 * a01 + r11 * a11 + r12 * a21
        this[6] = r10 * a02 + r11 * a12 + r12 * a22
        this[7] = r10 * a03 + r11 * a13 + r12 * a23
        this[8] = r20 * a00 + r21 * a10 + r22 * a20
        this[9] = r20 * a01 + r21 * a11 + r22 * a21
        this[10] = r20 * a02 + r21 * a12 + r22 * a22
        this[11] = r20 * a03 + r21 * a13 + r22 * a23
        return this
    }

    rotateX(rad: number): this {
        return this.rotate({ x: 1, y: 0, z: 0 }, rad)
    }

    rotateY(rad: number): this {
        return this.rotate({ x: 0, y: 1, z: 0 }, rad)
    }

    rotateZ(rad: number): this {
        return this.rotate({ x: 0, y: 0, z: 1 }, rad)
    }

    /** this = this * S(sx, sy, sz) */
    scale(sx: number, sy: number, sz: number): this {
        this[0] *= sx
        this[1] *= sx
        this[2] *= sx
        this[3] *= sx
        this[4] *= sy
        this[5] *= sy
        this[6] *= sy
        this[7] *= sy
        this[8] *= sz
        this[9] *= sz
        this[10] *= sz
        this[11] *= sz
        return this
    }

    transpose(): this {
        Matrix4.transpose(this, this)
        return this
    }

    /** 求逆；行列式为 0 时返回 null */
    invert(): Matrix4 | null {
        return Matrix4.invert(this, this) as Matrix4 | null
    }

    adjoint(): this {
        Matrix4.adjoint(this, this)
        return this
    }

    determinant(): number {
        return Matrix4.determinant(this)
    }

    equals(m: Matrix4Like): boolean {
        return Matrix4.equals(this, m)
    }

    isIdentity(): boolean {
        return this[0] === 1 && this[5] === 1 && this[10] === 1 && this[15] === 1
            && this[1] === 0 && this[2] === 0 && this[3] === 0 && this[4] === 0
            && this[6] === 0 && this[7] === 0 && this[8] === 0 && this[9] === 0
            && this[11] === 0 && this[12] === 0 && this[13] === 0 && this[14] === 0
    }

    isSingular(): boolean {
        return this.determinant() === 0
    }

    // ---- 向量变换 ----

    /** out = m * v（w=1，带透视除法） */
    transformVector3(out: Vector3Like, v: Vector3Like): Vector3Like {
        const x = v.x, y = v.y, z = v.z
        const w = this[3] * x + this[7] * y + this[11] * z + this[15]
        const invW = w === 0 ? 1 : 1 / w
        out.x = (this[0] * x + this[4] * y + this[8] * z + this[12]) * invW
        out.y = (this[1] * x + this[5] * y + this[9] * z + this[13]) * invW
        out.z = (this[2] * x + this[6] * y + this[10] * z + this[14]) * invW
        return out
    }

    /** out = m * v（含 w 分量，不做透视除法） */
    transformVector4(out: Vector4Like, v: Vector4Like): Vector4Like {
        const x = v.x, y = v.y, z = v.z, w = v.w
        out.x = this[0] * x + this[4] * y + this[8] * z + this[12] * w
        out.y = this[1] * x + this[5] * y + this[9] * z + this[13] * w
        out.z = this[2] * x + this[6] * y + this[10] * z + this[14] * w
        out.w = this[3] * x + this[7] * y + this[11] * z + this[15] * w
        return out
    }

    /** 2D 点变换（z=0, w=1，带透视除法） */
    transformPoint(out: Vector3Like, v: Vector3Like): Vector3Like {
        const x = v.x, y = v.y
        const w = this[3] * x + this[7] * y + this[15]
        const invW = w === 0 ? 1 : 1 / w
        out.x = (this[0] * x + this[4] * y + this[12]) * invW
        out.y = (this[1] * x + this[5] * y + this[13]) * invW
        out.z = (this[2] * x + this[6] * y + this[14]) * invW
        return out
    }

    // ---- 工具 ----

    clone(): Matrix4 {
        return new Matrix4(
            this[0], this[1], this[2], this[3],
            this[4], this[5], this[6], this[7],
            this[8], this[9], this[10], this[11],
            this[12], this[13], this[14], this[15]
        )
    }

    toArray(): number[] {
        return [
            this[0], this[1], this[2], this[3],
            this[4], this[5], this[6], this[7],
            this[8], this[9], this[10], this[11],
            this[12], this[13], this[14], this[15]
        ]
    }

    toString(): string {
        return `Matrix4(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]}, ${this[4]}, ${this[5]}, ${this[6]}, ${this[7]}, ${this[8]}, ${this[9]}, ${this[10]}, ${this[11]}, ${this[12]}, ${this[13]}, ${this[14]}, ${this[15]})`
    }
}
