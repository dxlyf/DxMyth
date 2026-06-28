

import type { Matrix2DLike } from './Matrix2D'
import { Point,PointLike } from './Point'
import { CachePool } from './CachePool'

export type Bounds={
    minX:number
    minY:number
    maxX:number
    maxY:number
}
export class BoundingRect   {
    static pool = CachePool.create({
        initSize:10,
        create: () => BoundingRect.default(),
        init: (item) => {
            item.setEmpty()
        }
    })
    static default() {
        return new BoundingRect(Infinity, Infinity, -Infinity, -Infinity)
    }
    private _min: Point;
    private _max: Point;

    constructor(minX?: number, minY?: number, maxX?: number, maxY?: number) {
        this._min = new Point(minX ?? Infinity, minY ?? Infinity);
        this._max = new Point(maxX ?? -Infinity, maxY ?? -Infinity);
    }

    get minX(): number { return this._min.x; }
    get minY(): number { return this._min.y; }
    get maxX(): number { return this._max.x; }
    get maxY(): number { return this._max.y; }

    get min(): Point { return this._min; }
    get max(): Point { return this._max; }

    set minX(value: number) { this._min.x = value; }
    set minY(value: number) { this._min.y = value; }
    set maxX(value: number) { this._max.x = value; }
    set maxY(value: number) { this._max.y = value; }

    get left(): number { return this.minX; }
    set left(value: number) { this.minX = value; }
    get top(): number { return this.minY; }
    set top(value: number) { this.minY = value; }

    get right(): number { return this.maxX; }
    set right(value: number) { this.maxX = value; }

    get bottom(): number { return this.maxY; }
    set bottom(value: number) { this.maxY = value; }

    get cx(): number { return (this.minX + this.maxX) * 0.5; }
    set cx(value: number) { this.minX = value; this.maxX = value; }

    get cy(): number { return (this.minY + this.maxY) * 0.5; }
    set cy(value: number) { this.minY = value; this.maxY = value; }

    clone() {
        return new BoundingRect(this.minX, this.minY, this.maxX, this.maxY);
    }

    copy(rect: BoundingRect) {
        this._min.copy(rect.min);
        this._max.copy(rect.max);
        return this
    }

    set(minX: number, minY: number, maxX: number, maxY: number) {
        this._min.set(minX, minY);
        this._max.set(maxX, maxY);
        return this;
    }

    fromPoint(point: PointLike): void {
        this._min.min(point)
        this._max.max(point)
    }

    fromPoints(points: PointLike[]) {
        points.forEach(p => {
            this.fromPoint(p)
        })
        return this
    }

    fromBounds(bounds: Bounds) {
        return this.set(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    }

    width(): number {
        return this.maxX - this.minX;
    }

    height(): number {
        return this.maxY - this.minY;
    }

    center(): PointLike {
        return { x: (this.minX + this.maxX) * 0.5, y: (this.minY + this.maxY) * 0.5 };
    }

    area(): number {
        return this.width() * this.height();
    }

    perimeter(): number {
        return 2 * (this.width() + this.height());
    }

    expand(x: number, y: number) {
        return this.set(
            this.minX - x,
            this.minY - y,
            this.maxX + x,
            this.maxY + y
        );
    }

    expandToPoint(point: PointLike) {
        const minX = Math.min(this.minX, point.x);
        const minY = Math.min(this.minY, point.y);
        const maxX = Math.max(this.maxX, point.x);
        const maxY = Math.max(this.maxY, point.y);
        return this.set(minX, minY, maxX, maxY);
    }

    expandToRect(rect: BoundingRect) {
        const minX = Math.min(this.minX, rect.minX);
        const minY = Math.min(this.minY, rect.minY);
        const maxX = Math.max(this.maxX, rect.maxX);
        const maxY = Math.max(this.maxY, rect.maxY);
        return this.set(minX, minY, maxX, maxY);
    }
    containsXY(x: number, y: number): boolean {
        return !(x < this.left || x > this.right || y < this.top || y > this.bottom)
    }

    containsPoint(point: PointLike): boolean {
        return this.containsXY(point.x, point.y)
    }

    containsRect(rect: BoundingRect): boolean {
        return rect.minX >= this.minX && rect.maxX <= this.maxX
            && rect.minY >= this.minY && rect.maxY <= this.maxY;
    }

    intersects(rect: BoundingRect): boolean {
        return this.maxX >= rect.minX && this.minX <= rect.maxX
            && this.maxY >= rect.minY && this.minY <= rect.maxY;
    }

    intersection(rect: BoundingRect): BoundingRect | null {
        const minX = Math.max(this.minX, rect.minX);
        const minY = Math.max(this.minY, rect.minY);
        const maxX = Math.min(this.maxX, rect.maxX);
        const maxY = Math.min(this.maxY, rect.maxY);
        if (minX > maxX || minY > maxY) {
            return null;
        }
        return new BoundingRect(minX, minY, maxX, maxY);
    }

    union(rect: BoundingRect) {
        const minX = Math.min(this.minX, rect.minX);
        const minY = Math.min(this.minY, rect.minY);
        const maxX = Math.max(this.maxX, rect.maxX);
        const maxY = Math.max(this.maxY, rect.maxY);
        return new BoundingRect(minX, minY, maxX, maxY);
    }

    offset(dx: number, dy: number) {
        return this.set(
            this.minX + dx,
            this.minY + dy,
            this.maxX + dx,
            this.maxY + dy
        );
    }

    scale(sx: number, sy: number) {
        return this.set(
            this.minX * sx,
            this.minY * sy,
            this.maxX * sx,
            this.maxY * sy
        );
    }

    applyMatrix2D(m: Matrix2DLike) {
        const corners = [
            { x: this.minX, y: this.minY },
            { x: this.maxX, y: this.minY },
            { x: this.maxX, y: this.maxY },
            { x: this.minX, y: this.maxY },
        ];
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (let i = 0; i < 4; i++) {
            const p = corners[i];
            const tx = m.a * p.x + m.c * p.y + m.tx;
            const ty = m.b * p.x + m.d * p.y + m.ty;
            if (tx < minX) minX = tx;
            if (ty < minY) minY = ty;
            if (tx > maxX) maxX = tx;
            if (ty > maxY) maxY = ty;
        }
        return this.set(minX, minY, maxX, maxY);
    }

    setEmpty() {
        return this.set(Infinity, Infinity, -Infinity, -Infinity);
    }

    equals(rect: BoundingRect): boolean {
        return this.minX === rect.minX && this.minY === rect.minY
            && this.maxX === rect.maxX && this.maxY === rect.maxY;
    }

    equalsEpsilon(rect: BoundingRect, epsilon: number): boolean {
        return Math.abs(this.minX - rect.minX) < epsilon
            && Math.abs(this.minY - rect.minY) < epsilon
            && Math.abs(this.maxX - rect.maxX) < epsilon
            && Math.abs(this.maxY - rect.maxY) < epsilon;
    }

    toString(): string {
        return `BoundingRect(${this.minX}, ${this.minY}, ${this.maxX}, ${this.maxY})`;
    }
}
