import { CachePool } from './CachePool'
import {type Vector2Like } from './Vector2'
// ============================================================
// Matrix2D — 基于 Float32Array 的 2D 仿射变换矩阵
// 内存布局: [0]=a, [1]=b, [2]=c, [3]=d, [4]=tx, [5]=ty
// 矩阵形式:
//   | a  c  tx |
//   | b  d  ty |
//   | 0  0  1  |
// ============================================================

/** 矩阵元素索引常量 */
export const enum MatrixIndex {
    A = 0,  // scaleX (cosθ)
    B = 1,  // skewY  (sinθ)
    C = 2,  // skewX  (-sinθ)
    D = 3,  // scaleY (cosθ)
    TX = 4, // translateX
    TY = 5, // translateY
}

export type Matrix2DLike = number[]|Float32Array

/**
 * 基于 Float32Array 的 2D 仿射变换矩阵。
 * 直接继承 Float32Array，与 WebGL / Skia / CanvasKit 的底层数据格式兼容。
 */
export class Matrix2D extends Float32Array {
    static pool=CachePool.create({
            initSize:20,
            create:()=>Matrix2D.identity(),
            init(item:Matrix2D){
                item.identity()
            }
        })
    // ---- 静态工厂 ----

    static identity(): Matrix2D {
        return new Matrix2D(1, 0, 0, 1, 0, 0)
    }

    static fromArray(arr: ArrayLike<number>): Matrix2D {
        return new Matrix2D(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5])
    }

    static fromTranslate(tx: number, ty: number): Matrix2D {
        return new Matrix2D(1, 0, 0, 1, tx, ty)
    }

    static fromScale(sx: number, sy: number): Matrix2D {
        return new Matrix2D(sx, 0, 0, sy, 0, 0)
    }

    static fromRotate(angle: number): Matrix2D {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return new Matrix2D(c, s, -s, c, 0, 0)
    }

    static fromSkew(sx: number, sy: number): Matrix2D {
        return new Matrix2D(1, Math.tan(sy), Math.tan(sx), 1, 0, 0)
    }

    /**
     * 通过变换参数组合构建仿射矩阵（静态，写入 out）。
     *
     * M = T(position) · Sk(skew) · S(scale) · R(rotation) · T(-origin)
     *
     * @param out      写入目标矩阵
     * @param position 平移 { x, y }
     * @param rotation 旋转角 (rad)
     * @param skew     倾斜 { x, y }
     * @param scale    缩放 { x, y }（默认 {1,1}）
     * @param origin   变换原点 { x, y }（默认 {0,0}）
     */
    static fromTranslateRotationSkewScaleOrigin(
        out: Matrix2DLike,
        position: Vector2Like,
        rotation: number,
        skew: Vector2Like,
        scale: Vector2Like = { x: 1, y: 1 },
        origin: Vector2Like = { x: 0, y: 0 },
    ) {
        const px = position.x, py = position.y
        const sx = scale.x, sy = scale.y
        const skx = skew.x, sky = skew.y
        const ox = origin.x, oy = origin.y

        const cos = rotation === 0 ? 1 : Math.cos(rotation)
        const sin = rotation === 0 ? 0 : Math.sin(rotation)
        const tanX = skx === 0 ? 0 : Math.tan(skx)
        const tanY = sky === 0 ? 0 : Math.tan(sky)

        // R · T(-origin)
        const rt_ox = -cos * ox + sin * oy
        const rt_oy = -sin * ox - cos * oy

        // S · R · T
        const s_a = sx * cos
        const s_b = sy * sin
        const s_c = sx * -sin
        const s_d = sy * cos
        const s_tx = sx * rt_ox
        const s_ty = sy * rt_oy

        // Sk · S · R · T
        const sk_a = s_a + tanX * s_b
        const sk_b = tanY * s_a + s_b
        const sk_c = s_c + tanX * s_d
        const sk_d = tanY * s_c + s_d
        const sk_tx = s_tx + tanX * s_ty
        const sk_ty = tanY * s_tx + s_ty

        // T(position) · Sk · S · R · T
        out[0] = sk_a
        out[1] = sk_b
        out[2] = sk_c
        out[3] = sk_d
        out[4] = sk_a * px + sk_c * py + sk_tx
        out[5] = sk_b * px + sk_d * py + sk_ty

        return out
    }

    // ---- 静态工具 ----

    /** out = a * b */
    static multiply(out: Matrix2DLike, a: Matrix2DLike, b: Matrix2DLike) {
        const a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5]
        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5]
        out[0] = a0 * b0 + a2 * b1
        out[1] = a1 * b0 + a3 * b1
        out[2] = a0 * b2 + a2 * b3
        out[3] = a1 * b2 + a3 * b3
        out[4] = a0 * b4 + a2 * b5 + a4
        out[5] = a1 * b4 + a3 * b5 + a5
        return out
    }

    /** out = m 的逆矩阵；行列式为 0 时返回 null */
    static invert(out: Matrix2DLike, m: Matrix2DLike) {
        const a = m[0], b = m[1], c = m[2], d = m[3], tx = m[4], ty = m[5]
        const det = a * d - b * c
        if (det === 0) return null
        const invDet = 1 / det
        out[0] = d * invDet
        out[1] = -b * invDet
        out[2] = -c * invDet
        out[3] = a * invDet
        out[4] = (c * ty - d * tx) * invDet
        out[5] = (b * tx - a * ty) * invDet
        return out
    }

    /** 判断两个矩阵是否相等 */
    static equals(a: Matrix2DLike, b: Matrix2DLike): boolean {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5]
    }

    static mapPoint(out:Vector2Like,matrix:Matrix2DLike,v:Vector2Like){
        const x = v.x, y = v.y
        out.x = matrix[0] * x + matrix[2] * y + matrix[4]
        out.y = matrix[1] * x + matrix[3] * y + matrix[5]
        return out
    }
   static mapPoints(out:Vector2Like[],matrix:Matrix2DLike,points:Vector2Like[]){
        for(let i=0;i<points.length;i++){
            out[i]=Matrix2D.mapPoint(out[i]||{x:0,y:0},matrix,points[i])
        }
        return out
    }
    // ==================== 实例 API ====================

    constructor(
        a: number = 1, b: number = 0, c: number = 0,
        d: number = 1, tx: number = 0, ty: number = 0,
    ) {
        super(6)
        this[0] = a
        this[1] = b
        this[2] = c
        this[3] = d
        this[4] = tx
        this[5] = ty
    }

    // ---- 命名属性访问器（兼容 Matrix2DLike 接口） ----

    get a(): number { return this[0] }
    set a(v: number) { this[0] = v }
    get b(): number { return this[1] }
    set b(v: number) { this[1] = v }
    get c(): number { return this[2] }
    set c(v: number) { this[2] = v }
    get d(): number { return this[3] }
    set d(v: number) { this[3] = v }
    get tx(): number { return this[4] }
    set tx(v: number) { this[4] = v }
    get ty(): number { return this[5] }
    set ty(v: number) { this[5] = v }

    // ---- 写入 ----

    fromValues(a: number, b: number, c: number, d: number, tx: number, ty: number): this {
        this[0] = a; this[1] = b; this[2] = c
        this[3] = d; this[4] = tx; this[5] = ty
        return this
    }

    identity(): this {
        return this.fromValues(1, 0, 0, 1, 0, 0)
    }

    copy(m: Matrix2D): this {
        this[0] = m[0]; this[1] = m[1]; this[2] = m[2]
        this[3] = m[3]; this[4] = m[4]; this[5] = m[5]
        return this
    }

    // ---- 自身变换（this = this * op） ----
    multiplyMatrices(a:Matrix2DLike,b:Matrix2DLike){
             return Matrix2D.multiply(this, a, b) as unknown as this
    }
    multiply(m: Matrix2D): this {
        return Matrix2D.multiply(this, this, m) as unknown as this
    }

    /** this = m * this */
    premultiply(m: Matrix2D): this {
        return Matrix2D.multiply(this, m, this) as unknown as this
    }

    translate(tx: number, ty: number): this {
        this[4] = this[0] * tx + this[2] * ty + this[4]
        this[5] = this[1] * tx + this[3] * ty + this[5]
        return this
    }

    scale(sx: number, sy: number): this {
        this[0] *= sx; this[1] *= sx
        this[2] *= sy; this[3] *= sy
        return this
    }

    rotate(angle: number): this {
        const c = Math.cos(angle), s = Math.sin(angle)
        const a = this[0], b = this[1], c0 = this[2], d = this[3]
        this[0] = a * c + c0 * s
        this[1] = b * c + d * s
        this[2] = a * -s + c0 * c
        this[3] = b * -s + d * c
        return this
    }

    skew(sx: number, sy: number): this {
        const tanSx = Math.tan(sx), tanSy = Math.tan(sy)
        const a = this[0], b = this[1], c = this[2], d = this[3]
        this[0] = a + c * tanSy
        this[1] = b + d * tanSy
        this[2] = a * tanSx + c
        this[3] = b * tanSx + d
        return this
    }

    /**
     * 通过变换参数组合构建仿射矩阵（实例，写入 this）。
     * 等价于 `Matrix2D.fromTranslateRotationSkewScaleOrigin(this, ...)`
     */
    composeFromTransform(
        position: Vector2Like,
        rotation: number,
        skew: Vector2Like,
        scale: Vector2Like = { x: 1, y: 1 },
        origin: Vector2Like = { x: 0, y: 0 },
    ) {
        Matrix2D.fromTranslateRotationSkewScaleOrigin(this, position, rotation, skew, scale, origin)
        return this
    }

    invert() {
        return Matrix2D.invert(this, this) as Matrix2D
    }

    /**
     * 从变换对象构建矩阵（实例，写入 this）。
     *
     * @param transform { position, scale?, skew?, rotation?, origin? }
     */
    fromTransform(transform: {
        position: Vector2Like
        scale?: Vector2Like
        skew?: Vector2Like
        rotation?: number
        origin?: Vector2Like
    }): this {
        Matrix2D.fromTranslateRotationSkewScaleOrigin(
            this,
            transform.position,
            transform.rotation ?? 0,
            transform.skew ?? { x: 0, y: 0 },
            transform.scale ?? { x: 1, y: 1 },
            transform.origin ?? { x: 0, y: 0 },
        )
        return this
    }

    // ---- 查询 ----

    /** 行列式 */
    determinant(): number {
        return this[0] * this[3] - this[1] * this[2]
    }

    isIdentity(): boolean {
        return this[0] === 1 && this[1] === 0 && this[2] === 0 && this[3] === 1 && this[4] === 0 && this[5] === 0
    }

    isSingular(): boolean {
        return this.determinant() === 0
    }

    equals(m: Matrix2DLike): boolean {
        return Matrix2D.equals(this, m)
    }

    /** X 轴缩放量（含旋转影响） */
    getScaleX(): number {
        return Math.hypot(this[0], this[2])
    }

    /** Y 轴缩放量（含旋转影响） */
    getScaleY(): number {
        return Math.hypot(this[1], this[3])
    }

    /** 旋转角 (rad) */
    getRotation(): number {
        return Math.atan2(this[1], this[0])
    }

    // ---- 点变换 ----

    /** p = this * (x, y) */
    mapPoint(out:Vector2Like,v:Vector2Like){
        const x = v.x, y = v.y
        out.x = this[0] * x + this[2] * y + this[4]
        out.y = this[1] * x + this[3] * y + this[5]
        return out
    }
    mapPoints(out:Vector2Like[],points:Vector2Like[]){
        for(let i=0;i<points.length;i++){
            out[i]=this.mapPoint(out[i]||{x:0,y:0},points[i])
        }
        return out
    }
    transformPoint(v:Vector2Like): Vector2Like {
        return {
            x: this[0] * v.x + this[2] * v.y + this[4],
            y: this[1] * v.x + this[3] * v.y + this[5],
        }
    }

    // ---- 工具 ----

    clone(): Matrix2D {
        return new Matrix2D(this[0], this[1], this[2], this[3], this[4], this[5])
    }

    toString(): string {
        return `Matrix2D(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]}, ${this[4]}, ${this[5]})`
    }
}
