// ============================================================
// Rect - 轴对齐矩形
// ============================================================

import { BoundingRect } from '../BoundingRect'
import { Geometry, PointOut } from './Geometry'

export class Rect extends Geometry {
    x: number
    y: number
    width: number
    height: number

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        super()
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    get right(): number {
        return this.x + this.width
    }

    get bottom(): number {
        return this.y + this.height
    }

    area(): number {
        return this.width * this.height
    }

    centroid(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        r.x = this.x + this.width * 0.5
        r.y = this.y + this.height * 0.5
        return r
    }

    center(out?: PointOut): PointOut {
        return this.centroid(out)
    }

    perimeter(): number {
        return 2 * (this.width + this.height)
    }

    contains(x: number, y: number): boolean {
        return x > this.x && x < this.right && y > this.y && y < this.bottom
    }

    /** 点在矩形内（含边界） */
    containsInclusive(x: number, y: number): boolean {
        return x >= this.x && x <= this.right && y >= this.y && y <= this.bottom
    }

    signedDistance(x: number, y: number): number {
        const dx1 = x - this.x
        const dx2 = this.right - x
        const dy1 = y - this.y
        const dy2 = this.bottom - y
        if (dx1 >= 0 && dx2 >= 0 && dy1 >= 0 && dy2 >= 0) {
            // 内部：到最近边的距离
            return Math.min(dx1, dx2, dy1, dy2)
        }
        // 外部：到最近角的距离
        const cx = dx1 < 0 ? this.x - x : (dx2 < 0 ? x - this.right : 0)
        const cy = dy1 < 0 ? this.y - y : (dy2 < 0 ? y - this.bottom : 0)
        return -Math.sqrt(cx * cx + cy * cy)
    }

    bounds(out?: BoundingRect): BoundingRect {
        const r = out || new BoundingRect()
        r.min.set(this.x, this.y)
        r.max.set(this.right, this.bottom)
        return r
    }
}
