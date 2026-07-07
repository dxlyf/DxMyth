// ============================================================
// Ellipse - 椭圆（轴对齐）
// 注：精确带符号距离需要解四次方程，性能差。
// 此处使用径向近似：沿点-中心方向计算到边界的距离，
// 对于描边命中（lineWidth 较小）误差可忽略，且性能远优于迭代法。
// ============================================================

import { BoundingRect } from '../BoundingRect'
import { Geometry, PointOut } from './Geometry'

export class Ellipse extends Geometry {
    cx: number
    cy: number
    radiusX: number
    radiusY: number

    constructor(cx: number = 0, cy: number = 0, radiusX: number = 0, radiusY: number = 0) {
        super()
        this.cx = cx
        this.cy = cy
        this.radiusX = radiusX
        this.radiusY = radiusY
    }

    area(): number {
        return Math.PI * this.radiusX * this.radiusY
    }

    /**
     * 周长（Ramanujan 近似，精度极高）
     * π [3(a+b) - sqrt((3a+b)(a+3b))]
     */
    perimeter(): number {
        const a = this.radiusX
        const b = this.radiusY
        return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)))
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

    /** 严格内部（不含边界） */
    contains(x: number, y: number): boolean {
        const dx = (x - this.cx) / this.radiusX
        const dy = (y - this.cy) / this.radiusY
        return dx * dx + dy * dy < 1
    }

    containsInclusive(x: number, y: number): boolean {
        const dx = (x - this.cx) / this.radiusX
        const dy = (y - this.cy) / this.radiusY
        return dx * dx + dy * dy <= 1
    }

    /**
     * 径向近似带符号距离
     * 思路：射线 (cx, cy) -> (x, y) 与椭圆边界交点距中心为 r_b，
     *       点距中心为 r_p，带符号距离 ≈ r_b - r_p（正为内）
     */
    signedDistance(x: number, y: number): number {
        const dx = x - this.cx
        const dy = y - this.cy
        const a = this.radiusX
        const b = this.radiusY
        const r = Math.sqrt(dx * dx + dy * dy)
        if (r < 1e-12) return Math.min(a, b)
        // 归一化坐标上的模长
        const nx = dx / a
        const ny = dy / b
        const nMag = Math.sqrt(nx * nx + ny * ny)
        // 边界点 = (dx, dy) / nMag，距中心 r/nMag
        // signedDistance = r/nMag - r
        return r / nMag - r
    }

    bounds(out?: BoundingRect): BoundingRect {
        const r = out || new BoundingRect()
        r.min.set(this.cx - this.radiusX, this.cy - this.radiusY)
        r.max.set(this.cx + this.radiusX, this.cy + this.radiusY)
        return r
    }
}
