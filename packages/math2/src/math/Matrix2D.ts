import { CachePool } from './CachePool'
import { Vector2, type Vector2Like } from './Vector2'
import { TWO_PI } from './MathUtils'
import { Transform } from './Transform'
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

export type Matrix2DLike = number[] | Float32Array

/** decomposeTransform 输出的分量结构 */
export interface DecomposedTransform {
    position: Vector2Like
    scale: Vector2Like
    skew: Vector2Like
    rotation: number
    origin: Vector2Like
    pivot: Vector2Like
}
export interface ITransform {
    position: Vector2Like
    scale: Vector2Like
    skew: Vector2Like
    rotation: number
    origin: Vector2Like
    pivot: Vector2Like
}

/**
 * 基于 Float32Array 的 2D 仿射变换矩阵。
 * 直接继承 Float32Array，与 WebGL / Skia / CanvasKit 的底层数据格式兼容。
 */
export class Matrix2D extends Float32Array {
    static pool = CachePool.create({
        initSize: 20,
        create: () => Matrix2D.identity(),
        init(item: Matrix2D) {
            item.identity()
        }
    })
    // ---- 静态工厂 ----

    static identity(): Matrix2D {
        return new Matrix2D(1, 0, 0, 1, 0, 0)
    }
    static from(arr: Matrix2DLike): Matrix2D {
        return new Matrix2D(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5])
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

        const x = position.x, y = position.y
        let ox = origin.x, oy = origin.y
        const sx = scale.x, sy = scale.y;
        const cos = rotation === 0 ? 1 : Math.cos(rotation);
        const sin = rotation === 0 ? 0 : Math.sin(rotation);
        const tanx = skew.x === 0 ? 0 : Math.tan(skew.x)
        const tany = skew.y === 0 ? 0 : Math.tan(skew.y)

        // t*o*r*skew*s*-o*-p

        // t*o
        let tx = x + ox;
        let ty = y + oy;

        // r*skew
        let a = cos - sin * tany
        let b = sin + cos * tany
        let c = cos * tanx - sin
        let d = sin * tanx + cos

        // m*s
        a *= sx
        b *= sx
        c *= sy
        d *= sy

        out[0] = a
        out[1] = b
        out[2] = c
        out[3] = d
        out[4] = tx - (a * ox + c * oy)
        out[5] = ty - (b * ox + d * oy)
        return this;
    }
    static fromTranslateRotationSkewScaleOriginPivot(out: Matrix2DLike, position: Vector2Like, rotation: number, skew: Vector2Like, scale: Vector2Like, origin: Vector2Like, pivot: Vector2Like) {
        const x = position.x, y = position.y
        let ox = origin.x, oy = origin.y
        const px = pivot.x, py = pivot.y
        const sx = scale.x, sy = scale.y;
        const cos = rotation === 0 ? 1 : Math.cos(rotation);
        const sin = rotation === 0 ? 0 : Math.sin(rotation);
        const tanx = skew.x === 0 ? 0 : Math.tan(skew.x)
        const tany = skew.y === 0 ? 0 : Math.tan(skew.y)

        // t*o*r*skew*s*-o*-p

        // t*o
        let tx = x + ox;
        let ty = y + oy;

        // r*skew
        let a = cos - sin * tany
        let b = sin + cos * tany
        let c = cos * tanx - sin
        let d = sin * tanx + cos

        // m*s
        a *= sx
        b *= sx
        c *= sy
        d *= sy

        ox += px
        oy += py

        out[0] = a
        out[1] = b
        out[2] = c
        out[3] = d
        out[4] = tx - (a * ox + c * oy)
        out[5] = ty - (b * ox + d * oy)
        return this;
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

    static mapPoint(out: Vector2Like, matrix: Matrix2DLike, v: Vector2Like) {
        const x = v.x, y = v.y
        out.x = matrix[0] * x + matrix[2] * y + matrix[4]
        out.y = matrix[1] * x + matrix[3] * y + matrix[5]
        return out
    }
    static mapPoints(out: Vector2Like[], matrix: Matrix2DLike, points: Vector2Like[]) {
        for (let i = 0; i < points.length; i++) {
            out[i] = Matrix2D.mapPoint(out[i] || { x: 0, y: 0 }, matrix, points[i])
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
    fromArray(m: Matrix2DLike) {
        this.fromValues(m[0], m[1], m[2], m[3], m[4], m[5])
    }

    /** 重置为平移矩阵 */
    fromTranslate(tx: number, ty: number): this {
        return this.fromValues(1, 0, 0, 1, tx, ty)
    }

    /** 重置为缩放矩阵 */
    fromScale(sx: number, sy: number): this {
        return this.fromValues(sx, 0, 0, sy, 0, 0)
    }

    /** 重置为旋转矩阵 */
    fromRotation(angle: number): this {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return this.fromValues(c, s, -s, c, 0, 0)
    }

    /** 重置为倾斜矩阵 */
    fromSkew(sx: number, sy: number): this {
        return this.fromValues(1, Math.tan(sy), Math.tan(sx), 1, 0, 0)
    }

    copy(m: Matrix2D): this {
        this[0] = m[0]; this[1] = m[1]; this[2] = m[2]
        this[3] = m[3]; this[4] = m[4]; this[5] = m[5]
        return this
    }

    // ---- 自身变换（this = this * op） ----
    multiplyMatrices(a: Matrix2DLike, b: Matrix2DLike) {
        return Matrix2D.multiply(this, a, b) as unknown as this
    }
    multiply(m: Matrix2DLike): this {
        return Matrix2D.multiply(this, this, m) as unknown as this
    }

    /** this = m * this */
    premultiply(m: Matrix2DLike): this {
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
    fromTranslationRotationScale(position: Vector2Like, angleInRad: number, scale: Vector2Like) {
        this.fromTranslationRotationScalePivot(position, angleInRad, scale, { x: 0, y: 0 })
        return this;
    }
    fromTranslationRotationSkewScalePivot(position: Vector2Like, angleInRad: number, skew: Vector2Like, scale: Vector2Like, pivot: Vector2Like) {
        const cos = Math.cos(angleInRad);
        const sin = Math.sin(angleInRad);
        const skewX=Math.tan(skew.x)
        const skewY=Math.tan(skew.y)
        let a=cos-sin*skewY
        let b=sin+cos*skewY
        let c=cos*skewX-sin
        let d=sin*skewX+cos
        a*=scale.x
        b*=scale.x
        c*=scale.y
        d*=scale.y
        const tx = position.x - (pivot.x * a - pivot.y * c);
        const ty = position.y - (pivot.x * b + pivot.y * d);
        this.fromValues(a, b, c, d, tx, ty)
        return this;
    }
    fromTranslationRotationScalePivot(position: Vector2Like, angleInRad: number, scale: Vector2Like, pivot: Vector2Like) {
        const cos = Math.cos(angleInRad);
        const sin = Math.sin(angleInRad);
        const a = scale.x * cos;
        const b = scale.x * sin;
        const c = -scale.y * sin;
        const d = scale.y * cos;
        const tx = position.x - (pivot.x * a - pivot.y * c);
        const ty = position.y - (pivot.x * b + pivot.y * d);
        this.fromValues(a, b, c, d, tx, ty)
        return this;
    }
    fromTranslateRotationSkewScaleOriginPivot(position: Vector2Like, rotation: number, skew: Vector2Like, scale: Vector2Like, origin: Vector2Like, pivot: Vector2Like) {
        Matrix2D.fromTranslateRotationSkewScaleOriginPivot(this, position, rotation, skew, scale, origin, pivot)
        return this;
    }
    fromTranslateRotationSkewScaleOrigin(
        position: Vector2Like,
        rotation: number,
        skew: Vector2Like,
        scale: Vector2Like = { x: 1, y: 1 },
        origin: Vector2Like = { x: 0, y: 0 },
    ) {
        Matrix2D.fromTranslateRotationSkewScaleOrigin(this, position, rotation, skew, scale, origin)
        return this
    }
    static decomposeAffine(matrix: Matrix2DLike) {
        const [a, b, c, d, tx, ty] = matrix;

        // 1. 平移
        const translate = { x: tx, y: ty };

        // 2. X轴和Y轴的缩放
        const scaleX = Math.sqrt(a * a + b * b);
        const scaleY = Math.sqrt(c * c + d * d);

        // 3. 旋转角度（X轴的旋转）
        const rotation = Math.atan2(b, a);  // 弧度

        // 4. 倾斜角（X轴和Y轴的夹角偏离90度的程度）
        // 计算Y轴相对于X轴垂直方向的偏离
        const skewX = Math.atan2(a * c + b * d, scaleX * scaleY);
        // 或者更常见的：
        const delta = a * d - b * c;  // 行列式（有符号面积缩放因子）
        // // 方法1：几何平均（推荐，保持面积比例）
        // const scale = Math.sqrt(scaleX * scaleY);

        // // 方法2：算术平均
        // const scale = (scaleX + scaleY) / 2;

        // // 方法3：取最大值（保守估计）
        // const scale = Math.max(scaleX, scaleY);
        return {
            translate,
            scaleX,
            scaleY,
            scale: Math.sqrt(Math.abs(delta)),  // 统一缩放 = sqrt(|det|)
            rotation,
            skewX: skewX,
            determinant: delta
        };
    }
    /**
     * 从组合矩阵逆解所有变换分量。
     *
     * 与 fromTranslationRotationSkewScaleOriginPivot 互为逆运算，
     * M = T(pos+origin) · R · Sk · S · T(-origin-pivot) 的矩阵可无损还原。
     *
     * 分解策略:
     *   - 线性部分 L = [a c; b d] 用 QR 分解提取 rotation / scale / skew
     *   - skewY 约定为 0（QR 唯一分解），若原矩阵 skewY ≠ 0 则信息并入 rotation
     *   - origin / pivot 无法从单矩阵唯一确定，约定 origin = (0,0), pivot = (0,0)
     *
     * @returns out 对象（含 position/scale/skew/rotation/origin/pivot）
     */
    static decomposeTransform(
        matrix: Matrix2DLike,
        transform:Transform
    ): Transform {
        // sort out rotation / skew..
        const a = matrix[0];
        const b = matrix[1];
        const c = matrix[2];
        const d = matrix[3];
        const pivot = transform.pivot;

        const skewX = -Math.atan2(-c, d);
        const skewY = Math.atan2(b, a);

        const delta = Math.abs(skewX + skewY);

        if (delta < 0.00001 || Math.abs(TWO_PI - delta) < 0.00001) {
            transform.rotation = skewY;
            transform.skew.x = transform.skew.y = 0;
        }
        else {
            transform.rotation = 0;
            transform.skew.x = skewX;
            transform.skew.y = skewY;
        }

        // next set scale
        transform.scale.x = Math.sqrt((a * a) + (b * b));
        transform.scale.y = Math.sqrt((c * c) + (d * d));

        // next set position
        const pivot_origin_x = pivot.x + transform.origin.x;
        const pivot_origin_y = pivot.y + transform.origin.y;

        // 处理origin偏移量，因为origin会影响到最终的position位置计算。
        transform.position.x = matrix[4] + ((pivot_origin_x * a) + (pivot_origin_y * c)) - transform.origin.x;
        transform.position.y = matrix[5] + ((pivot_origin_x * b) + (pivot_origin_y * d)) - transform.origin.y;
        return transform
    }
    decomposeTRSP(
        matrix: Matrix2D,
        out: {
            position?: Vector2Like,
            scale?: Vector2Like,
            rotation?: number,
            pivot?: Vector2Like
        } = {}
    ) {
        const position = out.position ?? { x: 0, y: 0 };
        const scale = out.scale ?? { x: 1, y: 1 };
        const pivot = out.pivot ?? { x: 0, y: 0 };

        // 1️⃣ 提取 position
        position.x = matrix[4];
        position.y = matrix[5];

        // 2️⃣ 提取 scale
        scale.x = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        scale.y = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

        if (scale.x === 0 || scale.y === 0) {
            throw new Error('Cannot decompose matrix with zero scale');
        }

        // 3️⃣ 提取 rotation
        const rotation = Math.atan2(matrix[1] / scale.x, matrix[0] / scale.x);

        // 4️⃣ 提取 pivot
        // 构造 R*S 矩阵
        const rs = new Matrix2D();
        rs.fromValues(matrix[0], matrix[1], matrix[2], matrix[3], 0, 0)

        // invert(R*S)
        const det = rs[0] * rs[3] - rs[1] * rs[2];
        if (det === 0) throw new Error('Matrix is not invertible for pivot extraction');

        const invRS = new Matrix2D();
        invRS.fromValues(rs[3] / det, -rs[1] / det, -rs[2] / det, rs[0] / det, 0, 0);

        // pivot = - inv(R*S) * 0 ?  => 实际上是逆算原 T(-pivot) 影响
        pivot.x = - (invRS[0] * matrix[4] + invRS[2] * matrix[5] - position.x);
        pivot.y = - (invRS[1] * matrix[4] + invRS[3] * matrix[5] - position.y);

        out.position.x = position.x
        out.position.y = position.y
        out.scale.x = scale.x;
        out.scale.y = scale.y;
        out.rotation = rotation;
        out.pivot.x = pivot.x
        out.pivot.y = pivot.y


        return out;
    }
    /** 实例版：从自身矩阵逆解分量 */
    decomposeTranslateRotationSkewScalePivotOrigin(out: Transform): Transform {
        const result = Matrix2D.decomposeTransform(this, out)
        return result
    }
    decomposeTranslateRotationSkewScalePivot(transform: ITransform): ITransform {
        // sort out rotation / skew..
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;
        const pivot = transform.pivot;

        const skewX = -Math.atan2(-c, d);
        const skewY = Math.atan2(b, a);

        const delta = Math.abs(skewX + skewY);

        if (delta < 0.00001 || Math.abs(TWO_PI - delta) < 0.00001) {
            transform.rotation = skewY;
            transform.skew.x = transform.skew.y = 0;
        }
        else {
            transform.rotation = 0;
            transform.skew.x = skewX;
            transform.skew.y = skewY;
        }

        // next set scale
        transform.scale.x = Math.sqrt((a * a) + (b * b));
        transform.scale.y = Math.sqrt((c * c) + (d * d));

        // next set position
        const pivot_origin_x = pivot.x + transform.origin.x;
        const pivot_origin_y = pivot.y + transform.origin.y;

        // 处理origin偏移量，因为origin会影响到最终的position位置计算。
        transform.position.x = this.tx + ((pivot_origin_x * a) + (pivot_origin_y * c)) - transform.origin.x;
        transform.position.y = this.ty + ((pivot_origin_x * b) + (pivot_origin_y * d)) - transform.origin.y;
        return transform;
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
        pivot?: Vector2Like
    }): this {
        Matrix2D.fromTranslateRotationSkewScaleOriginPivot(
            this,
            transform.position,
            transform.rotation ?? 0,
            transform.skew ?? { x: 0, y: 0 },
            transform.scale ?? { x: 1, y: 1 },
            transform.origin ?? { x: 0, y: 0 },
            transform.pivot ?? { x: 0, y: 0 },
        )
        return this
    }

    // ---- 查询 ----

    /** 行列式 */
    determinant(): number {
        return this[0] * this[3] - this[1] * this[2]
    }

    isIdentity(): boolean {
        return !(this[1] !== 0 || this[2] !== 0 || this[0] !== 1 || this[3] !== 1 || this[4] !== 0 || this[5] !== 0)
    }

    isSingular(): boolean {
        return this.determinant() === 0
    }

    equals(m: Matrix2DLike): boolean {
        return Matrix2D.equals(this, m)
    }

    /** X 轴缩放量 */
    getScaleX(): number {
        return Math.hypot(this[0], this[1])
    }

    /** Y 轴缩放量 */
    getScaleY(): number {
        return Math.hypot(this[2], this[3])
    }
    getScale() {
        return Math.sqrt(this.getScaleX() * this.getScaleY())
    }

    /** 旋转角 (rad) */
    getRotation(): number {
        return Math.atan2(this[1], this[0])
    }

    // ---- 点变换 ----

    /** p = this * (x, y) */
    mapPoint(out: Vector2Like, v: Vector2Like) {
        const x = v.x, y = v.y
        out.x = this[0] * x + this[2] * y + this[4]
        out.y = this[1] * x + this[3] * y + this[5]
        return out
    }
    mapPoints(out: Vector2Like[], points: Vector2Like[]) {
        for (let i = 0; i < points.length; i++) {
            out[i] = this.mapPoint(out[i] || { x: 0, y: 0 }, points[i])
        }
        return out
    }
    transformPoint(v: Vector2Like): Vector2Like {
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
