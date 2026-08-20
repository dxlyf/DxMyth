// ============================================================
// Ellipse - 椭圆（轴对齐）
// 注：精确带符号距离需要解四次方程，性能差。
// 此处使用径向近似：沿点-中心方向计算到边界的距离，
// 对于描边命中（lineWidth 较小）误差可忽略，且性能远优于迭代法。
// ============================================================

import { BoundingRect } from '../BoundingRect'
import { Geometry, PointOut, arcSegmentCount } from './Geometry'

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
     * 精确带符号距离（数值法）
     * 思路：椭圆点 q(θ) = (cx + a·cosθ, cy + b·sinθ)，最小化 |p - q(θ)|²。
     *       对 θ 求导令 f(θ)=0，用牛顿迭代求最近点对应的参数角 θ*，
     *       距离 = |p - q(θ*)|。初值取径向近似点对应的角 atan2(a·dy, b·dx)，
     *       通常 3~6 次迭代即可收敛到双精度精度。
     * 约定：内部为正、外部为负（与 Triangle 等一致）
     */
    signedDistance(x: number, y: number): number {
        const dx = x - this.cx
        const dy = y - this.cy
        const a = this.radiusX
        const b = this.radiusY
        const r = Math.sqrt(dx * dx + dy * dy)
        if (r < 1e-12) return Math.min(a, b)

        // f(θ) = (b²-a²)sinθcosθ + a·dx·sinθ - b·dy·cosθ = 0
        // f'(θ) = (b²-a²)(cos²θ-sin²θ) + a·dx·cosθ + b·dy·sinθ
        const k = b * b - a * a
        let theta = Math.atan2(a * dy, b * dx)
        for (let i = 0; i < 12; i++) {
            const sin = Math.sin(theta)
            const cos = Math.cos(theta)
            const f = a * dx * sin - b * dy * cos + k * sin * cos
            const df = a * dx * cos + b * dy * sin + k * (cos * cos - sin * sin)
            const delta = f / df
            theta -= delta
            if (Math.abs(delta) < 1e-13) break
        }

        // 最近点与距离
        const qx = this.cx + a * Math.cos(theta)
        const qy = this.cy + b * Math.sin(theta)
        const dist = Math.hypot(qx - x, qy - y)
        const inside = dx * dx / (a * a) + dy * dy / (b * b) < 1
        return inside ? dist : -dist
    }

    getPoints(out?: PointOut[]): PointOut[] {
        const r = out || []
        r.length = 0
        const TAU = Math.PI * 2
        // 按较短的半轴估算段数，保证弦高误差达标
        const n = arcSegmentCount(Math.min(this.radiusX, this.radiusY), TAU)
        for (let i = 0; i < n; i++) {
            const a = (TAU * i) / n
            r.push({ x: this.cx + this.radiusX * Math.cos(a), y: this.cy + this.radiusY * Math.sin(a) })
        }
        return r
    }

    bounds(out?: BoundingRect): BoundingRect {
        const r = out || new BoundingRect()
        r.min.set(this.cx - this.radiusX, this.cy - this.radiusY)
        r.max.set(this.cx + this.radiusX, this.cy + this.radiusY)
        return r
    }
}
