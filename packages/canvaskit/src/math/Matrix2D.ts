import { mat2d, glMatrix } from 'gl-matrix'
import { Vector2 } from './Vector2';

 
 class Matrix2D extends Float32Array {
    static identity() {
        return new this()
    }
    static fromValues(a: number, b: number, c: number, d: number, tx: number, ty: number) {
        const m = this.identity()
        return m.formValues(a, b, c, d, tx, ty);
    }
    static fromRotation(angleInRad: number) {
        const m = this.identity()
        mat2d.fromRotation(m, angleInRad)
        return m;
    }
    static fromTranslation(v: Vector2) {
        const m = this.identity()
        mat2d.fromTranslation(m, v)
        return m;
    }
    static fromScaling(v: Vector2) {
        const m = this.identity()
        mat2d.fromScaling(m, v)
        return m;
    }
    constructor() {
        super(6);
        mat2d.identity(this);
    }
    copy(m: Matrix2D) {
        return (this.constructor as typeof Matrix2D).fromValues(m[0], m[1], m[2], m[3], m[4], m[5]);
    }
    clone() {
        return (this.constructor as typeof Matrix2D).fromValues(this[0], this[1], this[2], this[3], this[4], this[5]);
    }
    hasIdentity(){
        return this[0]===1 && this[1]===0 && this[2]===0 && this[3]===1 && this[4]===0 && this[5]===0;
    }
    formValues(a: number, b: number, c: number, d: number, tx: number, ty: number) {
        mat2d.set(this, a, b, c, d, tx, ty)
        return this;
    }
    fromRotation(angleInRad: number) {
        mat2d.fromRotation(this, angleInRad)
        return this;
    }
    fromTranslation(v: Vector2) {
        mat2d.fromTranslation(this, v)
        return this;
    }
    fromScaling(v: Vector2) {
        mat2d.fromScaling(this, v)
        return this;
    }
    fromTranslationRotationScale(position: Vector2, angleInRad: number, scale: Vector2) {
        this.fromTranslationRotationScalePivot(position, angleInRad, scale,new Vector2(0,0))
        return this;
    }
    fromTranslationRotationScalePivot(position: Vector2, angleInRad: number, scale: Vector2,pivot:Vector2) {
        const cos = Math.cos(angleInRad);
        const sin = Math.sin(angleInRad);
        const a = scale.x * cos;
        const b = scale.x * sin;
        const c = -scale.y * sin;
        const d = scale.y * cos;
        const tx = position.x-(pivot.x*a-pivot.y*c);
        const ty = position.y-(pivot.x*b+pivot.y*d);
        mat2d.set(this, a, b, c, d, tx, ty)
        return this;
    }
    translate(v: Vector2) {
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
    scale(v: Vector2) {
        mat2d.scale(this, this, v)
        return this;
    }
    getTranslation(out:Vector2= Vector2.default()){
        return out.set(this[4],this[5])
    }
    getRotation() {
        return Math.atan2(this[1], this[0]);
    }
    getScale(out:Vector2= Vector2.default()){
        return out.set(Math.sqrt(this[0]*this[0]+this[1]*this[1]),
                        Math.sqrt(this[2]*this[2]+this[3]*this[3]))
    }
    invert() {
        mat2d.invert(this, this)
        return this;
    }
    multiply(m: Matrix2D) {
        return this.multiplyMatrices(this,m)
    }
    premultiply(m: Matrix2D) {
        return this.multiplyMatrices(m,this)
    }
    multiplyMatrices(a: Matrix2D, b: Matrix2D) {
        mat2d.multiply(this, a, b)
        return this;
    }
    mapPoint(v: Vector2,out:Vector2=Vector2.create()) {
        const x=v.x,y=v.y;
        return out.set(
            x*this[0]+y*this[2]+this[4],
            x*this[1]+y*this[3]+this[5]
        );
    }
    mapPoints(out:Vector2[],v: Vector2[]) {
        return out.map((o,i)=>this.mapPoint(v[i],o))
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
        rs.formValues(matrix[0], matrix[1], matrix[2], matrix[3], 0, 0)
    
        // invert(R*S)
        const det = rs[0] * rs[3] - rs[1] * rs[2];
        if (det === 0) throw new Error('Matrix is not invertible for pivot extraction');
    
        const invRS = new Matrix2D();
        invRS.formValues(rs[3] / det,-rs[1] / det,-rs[2] / det,rs[0] / det, 0, 0);
    
        // pivot = - inv(R*S) * 0 ?  => 实际上是逆算原 T(-pivot) 影响
        pivot.x = - (invRS[0] * matrix[4] + invRS[2] * matrix[5] - position.x);
        pivot.y = - (invRS[1] * matrix[4] + invRS[3] * matrix[5] - position.y);
    
        out.position.copy(position);
        out.scale.copy(scale);
        out.rotation=rotation;
        out.pivot.copy(pivot);

        return out;
    }
    
    equals(m: Matrix2D) {
        return this.every((v, i) => v === m[i]);
    }
    equalsWithEpsilon(m: Matrix2D, epsilon = 1e-6) {
        return this.every((v, i) => Math.abs(v - m[i]) <= epsilon);
    }
    toString(): string {
        return `Matrix2D(${this.join(',')})`;
    }

}

export {
    Matrix2D
}