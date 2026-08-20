// ============================================================
// Line - 线段
// ============================================================

import { BoundingRect } from '../BoundingRect'
import { Geometry, PointOut, distPointToSegment } from './Geometry'

export class Line extends Geometry {
    x1: number
    y1: number
    x2: number
    y2: number

    constructor(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0) {
        super()
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
    }

    /** 线段长度 */
    length(): number {
        const dx = this.x2 - this.x1
        const dy = this.y2 - this.y1
        return Math.sqrt(dx * dx + dy * dy)
    }

    /** 线段长度的平方 */
    lengthSquared(): number {
        const dx = this.x2 - this.x1
        const dy = this.y2 - this.y1
        return dx * dx + dy * dy
    }

    area(): number {
        return 0
    }

    centroid(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        r.x = (this.x1 + this.x2) * 0.5
        r.y = (this.y1 + this.y2) * 0.5
        return r
    }

    center(out?: PointOut): PointOut {
        return this.centroid(out)
    }

    perimeter(): number {
        return this.length()
    }

    /** 线段无内部，始终返回 false */
    contains(x: number, y: number): boolean {
        return false
    }

    /**
     * 带符号距离：以线段方向为基准，左侧为正，右侧为负
     * 对开放曲线，inner/outer 描边的语义基于此符号
     */
    signedDistance(x: number, y: number): number {
        const abx = this.x2 - this.x1
        const aby = this.y2 - this.y1
        const apx = x - this.x1
        const apy = y - this.y1
        const ab2 = abx * abx + aby * aby
        let t = ab2 > 0 ? (apx * abx + apy * aby) / ab2 : 0
        if (t < 0) t = 0
        else if (t > 1) t = 1
        const cx = this.x1 + t * abx
        const cy = this.y1 + t * aby
        const dx = x - cx
        const dy = y - cy
        // 法线 (-aby, abx) 指向左侧
        const cross = abx * apy - aby * apx
        const sign = cross >= 0 ? 1 : -1
        return sign * Math.sqrt(dx * dx + dy * dy)
    }

    getPoints(out?: PointOut[]): PointOut[] {
        const r = out || []
        r.length = 0
        r.push({ x: this.x1, y: this.y1 }, { x: this.x2, y: this.y2 })
        return r
    }

    bounds(out?: BoundingRect): BoundingRect {
        const r = out || new BoundingRect()
        r.min.set(Math.min(this.x1, this.x2), Math.min(this.y1, this.y2))
        r.max.set(Math.max(this.x1, this.x2), Math.max(this.y1, this.y2))
        return r
    }
}
