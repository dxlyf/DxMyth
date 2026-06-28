import { Matrix2DLike } from "./Matrix2D"
import { CachePool } from "./CachePool"
import { equalsEpsilon } from "./MathUtils"
export type PointLike={
    x:number
    y:number
}
export class Point   {
    static pool = CachePool.create({
        initSize: 20,
        create: () => Point.create(0, 0),
        init: (item) => {
            item.set(0, 0)
        }
    })
    static default() {
        return new Point(0, 0)
    }
    static create(x: number = 0, y: number = 0) {
        return new Point(x, y)
    }
    static fromPoint(point: PointLike) {
        return this.create(point.x, point.y)
    }

    static equals(a: PointLike, b: PointLike) {
        return a.x === b.x && a.y === b.y
    }
    static equalsEpsilon(a: PointLike, b: PointLike, epsilon = 0.5) {
        return equalsEpsilon(a.x, b.x, epsilon) && equalsEpsilon(a.y, b.y, epsilon)
    }
    _x: number = 0;
    _y: number = 0;
    private _onChange: ((target: Point) => void) | null = null;

    constructor(x: number = 0, y: number = 0) {
        this._x = x
        this._y = y
    }
    get x() {
        return this._x
    }
    get y() {
        return this._y
    }
    set x(v: number) {
        this._x = v
        this._notifyChange()
    }
    set y(v: number) {
        this._y = v
        this._notifyChange()
    }
    clone(): Point {
        return new Point(this.x, this.y);
    }

    copy(source: PointLike): Point {
        return this.set(source.x, source.y);
    }

    onChange(cb: (target: Point) => void): void {
        this._onChange = cb;
    }

    private _notifyChange(): void {
        if (this._onChange) {
            this._onChange(this);
        }
    }

    set(x: number, y: number) {
        if (this.x !== x || this._y !== y) {
            this._x = x;
            this._y = y;
            this._notifyChange();
        }
        return this;
    }
    negate() {
        return this.set(-this.x, -this.y)
    }
    addVectors(a: PointLike, b: PointLike) {
        return this.set(a.x + b.x, a.y + b.y);
    }

    add(v: PointLike) {
        return this.set(this.x + v.x, this.y + v.y);
    }

    subtractVectors(a: PointLike, b: PointLike) {
        return this.set(a.x - b.x, a.y - b.y);
    }

    subtract(v: PointLike) {
        return this.set(this.x - v.x, this.y - v.y);
    }

    multiplyVectors(a: PointLike, b: PointLike) {
        return this.set(a.x * b.x, a.y * b.y);
    }

    multiply(v: PointLike) {
        return this.set(this.x * v.x, this.y * v.y);
    }

    multiplyScalar(scalar: number) {
        return this.set(this.x * scalar, this.y * scalar);
    }

    divideScalar(scalar: number) {
        if (scalar === 0) return this;
        return this.set(this.x / scalar, this.y / scalar);
    }

    divideVectors(a: PointLike, b: PointLike) {
        return this.set(a.x / b.x, a.y / b.y);
    }

    divide(v: PointLike): Point {
        return this.set(this.x / v.x, this.y / v.y);
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Point {
        const len = this.length();
        if (len === 0) return this;
        return this.set(this.x / len, this.y / len);
    }

    dot(v: PointLike): number {
        return this.x * v.x + this.y * v.y;
    }

    cross(v: PointLike): number {
        return this.x * v.y - this.y * v.x;
    }

    perpendicular() {
        return this.set(-this.y, this.x);
    }

    project(v: PointLike) {
        const d = this.dot(v) / (v.x * v.x + v.y * v.y);
        return this.set(d * v.x, d * v.y);
    }

    reflect(n: PointLike) {
        const d = 2 * this.dot(n);
        return this.set(this.x - d * n.x, this.y - d * n.y);
    }

    refract(n: PointLike, eta: number): Point {
        const d = this.dot(n);
        const k = 1 - eta * eta * (1 - d * d);
        if (k < 0) {
            return this.set(0, 0);
        }
        const sqrtK = Math.sqrt(k);
        return this.set(
            eta * this.x - (eta * d + sqrtK) * n.x,
            eta * this.y - (eta * d + sqrtK) * n.y
        );
    }

    distance(v: PointLike): number {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    distanceTo(v: PointLike): number {
        return this.distance(v);
    }

    angleTo(v: PointLike): number {
        const d = this.dot(v);
        const c = this.cross(v);
        return Math.atan2(c, d);
    }

    angle(): number {
        return Math.atan2(this.y, this.x);
    }

    min(v: PointLike) {
        return this.set(Math.min(this.x, v.x), Math.min(this.y, v.y));
    }

    max(v: PointLike) {
        return this.set(Math.max(this.x, v.x), Math.max(this.y, v.y));
    }

    clamp(min: number, max: number) {
        return this.set(
            Math.max(min, Math.min(max, this.x)),
            Math.max(min, Math.min(max, this.y))
        );
    }
    setLength(len:number){
        return this.setLengthTo(this.x,this.y,len)
    }
    // 设置长度
    setLengthTo(x:number,y:number,length:number,originLength?:{value:number}){
        const dmag=Math.sqrt(x*x+y*y)
        const dscale=length/dmag
        const nx=x*dscale
        const ny=y*dscale
        if (!Number.isFinite(x) || !Number.isFinite(y) || (x == 0 && y == 0)) {
            this.set(0, 0);
            return false;
        }
        if(originLength){
            originLength.value=dmag
        }
        this.set(nx,ny)
        return true
    }

    isFinite(): boolean {
        return isFinite(this.x) && isFinite(this.y);
    }

    isZero(): boolean {
        return this.x === 0 && this.y === 0;
    }

    isOne(): boolean {
        return this.x === 1 && this.y === 1;
    }

    equals(v: PointLike): boolean {
        return this.x === v.x && this.y === v.y;
    }

    equalsEpsilon(v: PointLike, epsilon: number): boolean {
        return Math.abs(this.x - v.x) < epsilon && Math.abs(this.y - v.y) < epsilon;
    }

    applyMatrix2D(m: Matrix2DLike) {
        const x = this.x;
        const y = this.y;
        return this.set(
            m.a * x + m.c * y + m.tx,
            m.b * x + m.d * y + m.ty
        );
    }

    toString(): string {
        return `Point(${this.x}, ${this.y})`;
    }
}
