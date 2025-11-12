import { mat2d, glMatrix } from 'gl-matrix'
import { Vector2, Vector2Like } from './Vector2';

export type Matrix2DLike = number[] | Float32Array
class Matrix2D extends Float32Array {
    static identity() {
        return new this()
    }
    static fromValues(a: number, b: number, c: number, d: number, tx: number, ty: number) {
        const m = this.identity()
        return m.fromValues(a, b, c, d, tx, ty);
    }
    static fromRotation(angleInRad: number) {
        const m = this.identity()
        mat2d.fromRotation(m, angleInRad)
        return m;
    }
    static fromTranslation(v: Vector2Like) {
        const m = this.identity()
        mat2d.fromTranslation(m, v)
        return m;
    }
    static fromScaling(v: Vector2Like) {
        const m = this.identity()
        mat2d.fromScaling(m, v)
        return m;
    }
    constructor() {
        super(6);
        mat2d.identity(this);
    }
    copy(m: Matrix2D) {
        return this.fromValues(m[0], m[1], m[2], m[3], m[4], m[5]);
    }
    clone() {
        return (this.constructor as typeof Matrix2D).fromValues(this[0], this[1], this[2], this[3], this[4], this[5]);
    }
    hasIdentity() {
        return this[0] === 1 && this[1] === 0 && this[2] === 0 && this[3] === 1 && this[4] === 0 && this[5] === 0;
    }
    fromValues(a: number, b: number, c: number, d: number, tx: number, ty: number) {
        mat2d.set(this, a, b, c, d, tx, ty)
        return this;
    }
    fromRotation(angleInRad: number) {
        mat2d.fromRotation(this, angleInRad)
        return this;
    }
    fromTranslation(v: Vector2Like) {
        mat2d.fromTranslation(this, v)
        return this;
    }
    fromScaling(v: Vector2Like) {
        mat2d.fromScaling(this, v)
        return this;
    }
    fromTranslationRotationScale(position: Vector2Like, angleInRad: number, scale: Vector2Like) {
        this.fromTranslationRotationScalePivot(position, angleInRad, scale, new Vector2(0, 0))
        return this;
    }
    fromTranslationRotationScalePivot(position: Vector2Like, angleInRad: number, scale: Vector2Like, pivot: Vector2Like) {
        const cos = Math.cos(angleInRad);
        const sin = Math.sin(angleInRad);
        const a = scale[0] * cos;
        const b = scale[0] * sin;
        const c = -scale[1] * sin;
        const d = scale[1] * cos;
        const tx = position[0] - (pivot[0] * a - pivot[1] * c);
        const ty = position[1] - (pivot[0] * b + pivot[1] * d);
        mat2d.set(this, a, b, c, d, tx, ty)
        return this;
    }
    translate(v: Vector2Like) {
        mat2d.translate(this, this, v)
        return this;
    }
    rotateDegrees(degress: number) {
        this.rotate(glMatrix.toRadian(degress));
    }
    rotate(angleInRad: number) {
        mat2d.rotate(this, this, angleInRad)
        return this
    }
    scale(v: Vector2Like) {
        mat2d.scale(this, this, v)
        return this;
    }
    getTranslation(out: Vector2Like = Vector2.default()) {
        out[0] = this[4]
        out[1] = this[5]
        return out
    }
    getRotation() {
        return Math.atan2(this[1], this[0]);
    }
    getScale(out: Vector2Like = Vector2.default()) {
        out[0] = Math.sqrt(this[0] * this[0] + this[1] * this[1])
        out[1] = Math.sqrt(this[2] * this[2] + this[3] * this[3])
        return out
    }
    invert() {
        mat2d.invert(this, this)
        return this;
    }
    multiply(m: Matrix2D) {
        return this.multiplyMatrices(this, m)
    }
    premultiply(m: Matrix2D) {
        return this.multiplyMatrices(m, this)
    }
    multiplyMatrices(a: Matrix2D, b: Matrix2D) {
        mat2d.multiply(this, a, b)
        return this;
    }
    mapVector(v: Vector2Like, out: Vector2Like = Vector2.create()) {
        const x = v[0], y = v[1];
        out[0]=x * this[0] + y * this[2] + this[4]
        out[1]=x * this[1] + y * this[3] + this[5]
        return out
    }
    mapPoints(v: number[] | Float32Array, out: number[] | Float32Array = []) {
        for (let i = 0; i < v.length; i += 2) {
            out[i] = v[i] * this[0] + v[i + 1] * this[2] + this[4]
            out[i + 1] = v[i] * this[1] + v[i + 1] * this[3] + this[5]
        }
        return out
    }
    mapVectors(vectors: Vector2Like[], out: Vector2Like[] = []) {
        return vectors.map((v, i) => this.mapVector(v, out[i]))
    }
    decomposeTransform(
        matrix: Matrix2D,
        out: {
            position?: Vector2,
            scale?: Vector2,
            rotation?: number,
            pivot?: Vector2
        } = {}
    ) {
        const position = out.position ?? Vector2.create();
        const scale = out.scale ?? Vector2.create();
        const pivot = out.pivot ?? Vector2.create();

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

        out.position.copy(position);
        out.scale.copy(scale);
        out.rotation = rotation;
        out.pivot.copy(pivot);

        return out;
    }

    equals(m: Matrix2D) {
        return this.every((v, i) => v === m[i]);
    }
    equalsWithEpsilon(m: Matrix2D, epsilon = 1e-6) {
        return this.every((v, i) => Math.abs(v - m[i]) <= epsilon);
    }
    fromRowMajorOrderMatrix3x3(m: Matrix2DLike) {
        this[0] = m[0]
        this[1] = m[3]
        this[2] = m[1]
        this[3] = m[4]
        this[4] = m[2]
        this[5] = m[5]
        return this
    }
    fromColumnMajorOrderMatrix3x3(m: Matrix2DLike) {
        this[0] = m[0]
        this[1] = m[1]
        this[2] = m[3]
        this[3] = m[4]
        this[4] = m[2]
        this[5] = m[5]
        return this
    }
    // column-major order  列主序
    toMatrix3x3(out: Matrix2DLike = new Float32Array(9)) {
        out[0] = this[0]
        out[1] = this[1]
        out[2] = 0
        out[3] = this[2]
        out[4] = this[3]
        out[5] = 0
        out[6] = this[4]
        out[7] = this[5]
        out[8] = 1
        return out
    }
    //row-major order 行主序
    toRowMajorOrderMatrix3x3(out: Matrix2DLike = new Float32Array(9)) {
        out[0] = this[0]
        out[1] = this[2]
        out[2] = this[4]
        out[3] = this[1]
        out[4] = this[3]
        out[5] = this[5]
        out[6] = 0
        out[7] = 0
        out[8] = 1
        return out
    }

    toString(): string {
        return `Matrix2D(${this.join(',')})`;
    }

}

export {
    Matrix2D
}