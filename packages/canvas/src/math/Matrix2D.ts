
import type { PointLike } from './Point'
import { CachePool } from './CachePool';

export type Matrix2DLike = {
    a: number
    b: number
    c: number
    d: number
    tx: number
    ty: number
}
function mapPoint(out: PointLike, m: Matrix2DLike, point: PointLike): PointLike {
    const x = point.x, y = point.y
    out.x = m.a * x + m.c * y + m.tx
    out.y = m.b * x + m.d * y + m.ty
    return out;
}
function mapPoints(out: PointLike[], m: Matrix2DLike, points: PointLike[]): PointLike[] {
    for (let i = 0; i < points.length; i++) {
        mapPoint(out[i], m, points[i]);
    }
    return out;
}
export const fromValues=(out:Matrix2DLike,a:number,b:number,c:number,d:number,tx:number,ty:number)=>{
    out.a=a;
    out.b=b;
    out.c=c;
    out.d=d;
    out.tx=tx;
    out.ty=ty
    return out
}
export const multiply=(out:Matrix2DLike,a:Matrix2DLike,b:Matrix2DLike)=>{
    return fromValues(out,
        a.a*b.a+a.c*b.b,
        a.b*b.a+a.d*b.b,
        a.a*b.c+a.c*b.d,
        a.b*b.c+a.d*b.d,
        a.a*b.tx+a.c*b.ty+a.tx,
        a.b*b.tx+a.d*b.ty+a.ty,
    )
}
export  const translate=(out:Matrix2DLike,a:Matrix2DLike,tx:number,ty:number)=>{
    return fromValues(out,
        a.a,
        a.b,
        a.c,
        a.d,
        a.a*tx+a.c*ty+a.tx,
        a.b*tx+a.d*ty+a.ty,
    )
}
export const scale=(out:Matrix2DLike,a:Matrix2DLike,sx:number,sy:number)=>{
    return fromValues(out,
        a.a*sx,
        a.b*sx,
        a.c*sy,
        a.d*sy,
        a.tx,
        a.ty
    )
}
export const rotate=(out:Matrix2DLike,a:Matrix2DLike,angle:number)=>{
    const cos=Math.cos(angle),sin=Math.sin(angle)
    return fromValues(out,
        a.a*cos+a.c*sin,
        a.b*cos+a.d*sin,
        a.a*-sin+a.c*cos,
        a.b*-sin+a.d*cos,
        a.tx,
        a.ty,
    )
}

export class Matrix2D {
    static pool = CachePool.create({
        initSize: 20,
        create: () => Matrix2D.identity(),
        init: (item) => {
            item.identity()
        }
    })
    // ---- 静态工厂方法 ----

    /** 创建单位矩阵 */
    static identity() {
        return new Matrix2D(1, 0, 0, 1, 0, 0);
    }

    /** 从数组创建矩阵 */
    static fromArray(arr: number[]) {
        return new Matrix2D(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
    }

    /** 从源对象创建矩阵 */
    static from(source: Matrix2DLike) {
        return new Matrix2D(source.a, source.b, source.c, source.d, source.tx, source.ty);
    }

    /** 创建平移矩阵 */
    static fromTranslate(tx: number, ty: number) {
        return new Matrix2D(1, 0, 0, 1, tx, ty);
    }

    /** 创建缩放矩阵 */
    static fromScale(sx: number, sy: number) {
        return new Matrix2D(sx, 0, 0, sy, 0, 0);
    }

    /** 创建旋转矩阵 */
    static fromRotate(angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Matrix2D(cos, sin, -sin, cos, 0, 0);
    }

    /** 创建倾斜矩阵 */
    static fromSkew(sx: number, sy: number) {
        return new Matrix2D(1, Math.tan(sy), Math.tan(sx), 1, 0, 0);
    }

    /** 计算矩阵的逆 */
    static invert(m: Matrix2DLike) {
        const det = m.a * m.d - m.b * m.c;
        if (det === 0) return null;
        const invDet = 1 / det;
        return new Matrix2D(
            m.d * invDet,
            -m.b * invDet,
            -m.c * invDet,
            m.a * invDet,
            (m.c * m.ty - m.d * m.tx) * invDet,
            (m.b * m.tx - m.a * m.ty) * invDet
        );
    }

    /** 对点应用矩阵变换 */
    static transformPoint(m: Matrix2DLike, x: number, y: number): PointLike {
        return {
            x: m.a * x + m.c * y + m.tx,
            y: m.b * x + m.d * y + m.ty
        };
    }

    static mapPoint = mapPoint
    static mapPoints = mapPoints
    /** 判断两个矩阵是否相等 */
    static equals(a: Matrix2DLike, b: Matrix2DLike): boolean {
        return a.a === b.a && a.b === b.b && a.c === b.c && a.d === b.d && a.tx === b.tx && a.ty === b.ty;
    }
    a: number = 1;
    b: number = 0;
    c: number = 0;
    d: number = 1;
    tx: number = 0;
    ty: number = 0;

    constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number) {
        if (a !== undefined) this.a = a;
        if (b !== undefined) this.b = b;
        if (c !== undefined) this.c = c;
        if (d !== undefined) this.d = d;
        if (tx !== undefined) this.tx = tx;
        if (ty !== undefined) this.ty = ty;
    }

    identity(): this {
        return this.set(1, 0, 0, 1, 0, 0);
    }
    fromValues(a: number, b: number, c: number, d: number, tx: number, ty: number) {
        return this.set(a, b, c, d, tx, ty)
    }
    set(a: number, b: number, c: number, d: number, tx: number, ty: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        return this;
    }

    fromArray(arr: number[]): this {
        return this.set(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
    }

    fromTranslateRotationScale(translate: PointLike, rotation: number, scale: PointLike) {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        return this.set(
            cos * scale.x, sin * scale.x,
            -sin * scale.y, cos * scale.y,
            translate.x, translate.y
        );
    }

    fromTranslateRotationScaleOrigin(translate: PointLike, rotation: number, scale: PointLike, origin: PointLike): this {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const ox = origin.x;
        const oy = origin.y;
        // M = T(t) * T(o) * R * S * T(-o)
        // tx = translate.x + ox - a*ox - c*oy
        // ty = translate.y + oy - b*ox - d*oy
        const a = cos * scale.x;
        const b = sin * scale.x;
        const c = -sin * scale.y;
        const d = cos * scale.y;
        return this.set(
            a, b,
            c, d,
            translate.x + ox - a * ox - c * oy,
            translate.y + oy - b * ox - d * oy
        );
    }

    fromTranslateRotationSkewScaleOrigin(translate: PointLike, rotation: number, skew: PointLike, scale: PointLike, origin: PointLike): this {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const tanSx = Math.tan(skew.x);
        const tanSy = Math.tan(skew.y);
        const ox = origin.x;
        const oy = origin.y;
        // M = T(t) * T(o) * R * Sk * S * T(-o)
        const a = (cos - sin * tanSy) * scale.x;
        const b = (sin + cos * tanSy) * scale.x;
        const c = (-sin + cos * tanSx) * scale.y;
        const d = (cos + sin * tanSx) * scale.y;
        return this.set(
            a, b,
            c, d,
            translate.x + ox - a * ox - c * oy,
            translate.y + oy - b * ox - d * oy
        );
    }

    toArray(out: number[] = []): number[] {
        out[0] = this.a;
        out[1] = this.b;
        out[2] = this.c;
        out[3] = this.d;
        out[4] = this.tx;
        out[5] = this.ty;
        return out
    }
    clone() {
        return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }

    copy(m: Matrix2DLike) {
        return this.set(m.a, m.b, m.c, m.d, m.tx, m.ty);
    }

    multiply(m: Matrix2DLike) {
        return this.multiplyMatrices(this, m)
    }

    premultiply(m: Matrix2DLike) {
        return this.multiplyMatrices(m, this)
    }

    multiplyMatrices(a: Matrix2DLike, b: Matrix2DLike) {
        return this.set(
            a.a * b.a + a.c * b.b,
            a.b * b.a + a.d * b.b,
            a.a * b.c + a.c * b.d,
            a.b * b.c + a.d * b.d,
            a.a * b.tx + a.c * b.ty + a.tx,
            a.b * b.tx + a.d * b.ty + a.ty
        );
    }

    translate(tx: number, ty: number) {
        return this.set(
            this.a, this.b,
            this.c, this.d,
            this.a * tx + this.c * ty + this.tx,
            this.b * tx + this.d * ty + this.ty
        );
    }

    scale(sx: number, sy: number) {
        return this.set(
            this.a * sx, this.b * sx,
            this.c * sy, this.d * sy,
            this.tx, this.ty
        );
    }

    rotate(angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;
        return this.set(
            a * cos + c * sin,
            b * cos + d * sin,
            a * -sin + c * cos,
            b * -sin + d * cos,
            this.tx,
            this.ty
        );
    }

    skew(sx: number, sy: number) {
        const tanSx = Math.tan(sx);
        const tanSy = Math.tan(sy);
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;
        return this.set(
            a + c * tanSy,
            b + d * tanSy,
            a * tanSx + c,
            b * tanSx + d,
            this.tx,
            this.ty
        );
    }

    invert(): this {
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;
        const tx = this.tx;
        const ty = this.ty;
        const det = a * d - b * c;
        if (det === 0) {
            return this.identity();
        }
        const invDet = 1 / det;
        return this.set(
            d * invDet,
            -b * invDet,
            -c * invDet,
            a * invDet,
            (c * ty - d * tx) * invDet,
            (b * tx - a * ty) * invDet
        );
    }

    isSingular(): boolean {
        return this.a * this.d - this.b * this.c === 0;
    }

    isIdentity(): boolean {
        return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
    }

    mapPoint(out: PointLike, v: PointLike): PointLike {
        return mapPoint(out, this, v);
    }

    mapPoints(out: PointLike[], v: PointLike[]): PointLike[] {
        return mapPoints(out, this, v);
    }

    transformPoint(x: number, y: number): PointLike {
        return { x: this.a * x + this.c * y + this.tx, y: this.b * x + this.d * y + this.ty };
    }
    getScaleX(): number {
        if (this.a === 0 && this.c === 0) return 0;
        return Math.sqrt(this.a * this.a + this.c * this.c);
    }

    getScaleY(): number {
        if (this.b === 0 && this.d === 0) return 0;
        return Math.sqrt(this.b * this.b + this.d * this.d);
    }

    getRotation(): number {
        return Math.atan2(this.b, this.a);
    }

    reset(): this {
        return this.identity();
    }

    equals(m: Matrix2DLike): boolean {
        return this.a === m.a && this.b === m.b && this.c === m.c && this.d === m.d && this.tx === m.tx && this.ty === m.ty;
    }

    toString(): string {
        return `Matrix2D(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.tx}, ${this.ty})`;
    }

}
