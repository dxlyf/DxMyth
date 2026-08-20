// ============================================================
// Circle - 圆
// ============================================================

import { BoundingRect } from '../BoundingRect'
import { Geometry, PointOut, arcSegmentCount } from './Geometry'

export class Circle extends Geometry {
    cx: number
    cy: number
    radius: number

    constructor(cx: number = 0, cy: number = 0, radius: number = 0) {
        super()
        this.cx = cx
        this.cy = cy
        this.radius = radius
    }

    area(): number {
        const r = this.radius
        return Math.PI * r * r
    }

    centroid(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        r.x = this.cx
        r.y = this.cy
        return r
    }

    center(out?: PointOut): PointOut {
        return this.centroid(out)
    }

    perimeter(): number {
        return 2 * Math.PI * this.radius
    }

    /** 严格内部（不含边界） */
    contains(x: number, y: number): boolean {
        const dx = x - this.cx
        const dy = y - this.cy
        const r = this.radius
        return dx * dx + dy * dy < r * r
    }

    /** 含边界 */
    containsInclusive(x: number, y: number): boolean {
        const dx = x - this.cx
        const dy = y - this.cy
        const r = this.radius
        return dx * dx + dy * dy <= r * r
    }

    /**
     * 带符号距离：r - dist
     * 内部为正，外部为负，使用平方距离比较，避免 sqrt（仅在结果需要时调用）
     */
    signedDistance(x: number, y: number): number {
        const dx = x - this.cx
        const dy = y - this.cy
        const d = Math.sqrt(dx * dx + dy * dy)
        return this.radius - d
    }

    getPoints(out?: PointOut[]): PointOut[] {
        const r = out || []
        r.length = 0
        const TAU = Math.PI * 2
        const n = arcSegmentCount(this.radius, TAU)
        for (let i = 0; i < n; i++) {
            const a = (TAU * i) / n
            r.push({ x: this.cx + this.radius * Math.cos(a), y: this.cy + this.radius * Math.sin(a) })
        }
        return r
    }

    bounds(out?: BoundingRect): BoundingRect {
        const r = out || new BoundingRect()
        const rad = this.radius
        r.min.set(this.cx - rad, this.cy - rad)
        r.max.set(this.cx + rad, this.cy + rad)
        return r
    }
}
