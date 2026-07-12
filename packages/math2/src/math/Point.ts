// ============================================================
// Point — 2D 坐标点，带 onChange 变更通知
// ============================================================

import type { Vector2Like } from './Vector2'
export type PointLike = { x: number, y: number }
export class Point implements PointLike {
    static default(){
        return this.create()
    }
    static fromPoint(point: PointLike) {
        return new Point(point.x, point.y)
    }
    static create(x: number = 0, y: number = 0) {
        return new Point(x, y)
    }
    private _x: number
    private _y: number
    private _onChange: (() => void) | null = null

    constructor(x: number = 0, y: number = 0) {
        this._x = x
        this._y = y
    }

    // ---- 属性访问器 ----
    get width(): number { return this._x }
    get height(): number { return this._y }
    set width(v: number) {
        if (this._x !== v) {
            this._x = v
            this._onChange?.()
        }
    }
    set height(v: number) {
        if (this._y !== v) {
            this._y = v
            this._onChange?.()
        }
    }
    get x(): number { return this._x }
    set x(v: number) {
        if (this._x !== v) {
            this._x = v
            this._onChange?.()
        }
    }

    get y(): number { return this._y }
    set y(v: number) {
        if (this._y !== v) {
            this._y = v
            this._onChange?.()
        }
    }

    // ---- 变更通知 ----

    /** 注册变更回调，x 或 y 变化时触发 */
    onChange(cb: () => void): this {
        this._onChange = cb
        return this
    }

    // ---- 写入 ----

    set(x: number, y: number): this {
        const changed = this._x !== x || this._y !== y
        this._x = x
        this._y = y
        if (changed) this._onChange?.()
        return this
    }

    copy(v: Vector2Like): this {
        return this.set(v.x, v.y)
    }

    zero(): this {
        return this.set(0, 0)
    }

    // ---- 运算（就地修改） ----

    add(v: Vector2Like): this {
        return this.set(this._x + v.x, this._y + v.y)
    }

    subtract(v: Vector2Like): this {
        return this.set(this._x - v.x, this._y - v.y)
    }
    multiply(v:Vector2Like){
        return this.set(this.x*v.x,this.y*v.y)
    }
    multiplyScalar(s: number): this {
        return this.set(this._x * s, this._y * s)
    }

    // ---- 查询 ----

    magnitude(): number {
        return Math.hypot(this._x, this._y)
    }

    magnitudeSquared(): number {
        return this._x * this._x + this._y * this._y
    }

    dot(v: Vector2Like) {
        return this._x * v.x + this._y * v.y
    }
    cross(v: Vector2Like) {
        return this.x * v.y - this.y * v.x
    }

    normalize() {
        const len = this.magnitude()
        if (len <= 0) {
            return this
        }
        return this.set(this.x / len, this.y / len)
    }
    perpendicular(){
        return this.set(-this.y,this.x)
    }
    negate(){
        return this.set(-this.x,-this.y)
    }
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
    isFinite() {
        return Number.isFinite(this.x) && Number.isFinite(this.y)
    }
    // ---- 工具 ----

    clone(): Point {
        return new Point(this._x, this._y)
    }
    equals( b: Vector2Like): boolean {
        return this.x===b.x&&this.y===b.y
    }
    equalsEpsilon(b: Vector2Like, epsilon: number = 1e-9): boolean {
        return Math.abs(this.x - b.x) <= epsilon && Math.abs(this.y - b.y) <= epsilon
    }
    toString(): string {
        return `Point(${this._x}, ${this._y})`
    }
}
