// ============================================================
// Arc - 圆弧扇形（pie slice）
// 由圆心 (cx, cy)、半径 radius、起始角 startAngle、终止角 endAngle、方向 ccw 定义
// 边界包括：两段半径线段 + 一段圆弧
// area() 计算扇形面积；若需弓形（弦+弧）面积可用 sectorArea - triangleArea
// ============================================================

import { BoundingRect } from '../BoundingRect'
import { Geometry, PointOut, distPointToSegmentSquared, normalizeAnglePositive, angleDelta } from './Geometry'

export class Arc extends Geometry {
    cx: number
    cy: number
    radius: number
    startAngle: number
    endAngle: number
    /** true=逆时针，false=顺时针 */
    ccw: boolean

    constructor(
        cx: number = 0, cy: number = 0, radius: number = 0,
        startAngle: number = 0, endAngle: number = 0,
        ccw: boolean = false
    ) {
        super()
        this.cx = cx
        this.cy = cy
        this.radius = radius
        this.startAngle = startAngle
        this.endAngle = endAngle
        this.ccw = ccw
    }

    /** 扫过角度（绝对值，弧度） */
    sweep(): number {
        const TAU = Math.PI * 2
        let s = normalizeAnglePositive(this.startAngle)
        let e = normalizeAnglePositive(this.endAngle)
        let d = this.ccw ? (e - s + TAU) % TAU : (s - e + TAU) % TAU
        return d
    }

    /** 弦长 */
    chordLength(): number {
        const sweep = this.sweep()
        return 2 * this.radius * Math.sin(sweep * 0.5)
    }

    /** 扇形面积 = 0.5 * r² * sweep */
    area(): number {
        return 0.5 * this.radius * this.radius * this.sweep()
    }

    /** 弓形面积（弦+弧）= 扇形面积 - 三角形面积 */
    segmentArea(): number {
        const r = this.radius
        const sweep = this.sweep()
        const sector = 0.5 * r * r * sweep
        const triangle = 0.5 * r * r * Math.sin(sweep)
        return Math.abs(sector - triangle)
    }

    /**
     * 扇形重心
     * 沿角平分线方向，距圆心 (2 r sin(α/2)) / (3 α/2)，α=sweep
     */
    centroid(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        const sweep = this.sweep()
        if (sweep < 1e-9) {
            r.x = this.cx
            r.y = this.cy
            return r
        }
        // 角平分线方向（按 ccw 朝向）
        const bisect = this.ccw
            ? this.startAngle + sweep * 0.5
            : this.startAngle - sweep * 0.5
        const half = sweep * 0.5
        const dist = sweep < 1e-9
            ? 0
            : (2 * this.radius * Math.sin(half)) / (3 * half)
        r.x = this.cx + dist * Math.cos(bisect)
        r.y = this.cy + dist * Math.sin(bisect)
        return r
    }

    center(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        r.x = this.cx
        r.y = this.cy
        return r
    }

    /** 周长 = 弧长 + 两段半径 */
    perimeter(): number {
        return this.radius * this.sweep() + 2 * this.radius
    }

    /** 弧长（不含半径线段） */
    arcLength(): number {
        return this.radius * this.sweep()
    }

    /** 起点坐标 */
    startPoint(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        r.x = this.cx + this.radius * Math.cos(this.startAngle)
        r.y = this.cy + this.radius * Math.sin(this.startAngle)
        return r
    }

    /** 终点坐标 */
    endPoint(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        r.x = this.cx + this.radius * Math.cos(this.endAngle)
        r.y = this.cy + this.radius * Math.sin(this.endAngle)
        return r
    }

    /**
     * 点是否在扇形内
     * 条件：距圆心 < radius 且角度在扫过范围内
     */
    contains(x: number, y: number): boolean {
        const dx = x - this.cx
        const dy = y - this.cy
        const r = this.radius
        if (dx * dx + dy * dy >= r * r) return false
        // 圆心始终在内
        if (dx === 0 && dy === 0) return true
        const ang = Math.atan2(dy, dx)
        return this.angleInSweep(ang)
    }

    /** 角度是否在扫过范围内 */
    angleInSweep(angle: number): boolean {
        const TAU = Math.PI * 2
        let s = normalizeAnglePositive(this.startAngle)
        let e = normalizeAnglePositive(this.endAngle)
        let a = normalizeAnglePositive(angle)
        if (this.ccw) {
            // 从 s 沿 ccw 到 e
            if (s <= e) return a >= s - 1e-9 && a <= e + 1e-9
            return a >= s - 1e-9 || a <= e + 1e-9
        } else {
            // 从 s 沿 cw 到 e
            if (e <= s) return a >= e - 1e-9 && a <= s + 1e-9
            return a >= e - 1e-9 || a <= s + 1e-9
        }
    }

    /**
     * 带符号距离（到扇形边界：弧 + 两段半径）
     */
    signedDistance(x: number, y: number): number {
        const dx = x - this.cx
        const dy = y - this.cy
        const r = this.radius
        const distC = Math.sqrt(dx * dx + dy * dy)
        const ang = distC < 1e-12 ? this.startAngle : Math.atan2(dy, dx)
        const inAngle = this.angleInSweep(ang)

        // 距离到弧
        let minD2 = Infinity
        if (inAngle) {
            const dArc = Math.abs(distC - r)
            if (dArc < minD2) minD2 = dArc
        }
        // 距离到两段半径（线段：圆心 -> 起点 / 终点）
        const sx = this.cx + r * Math.cos(this.startAngle)
        const sy = this.cy + r * Math.sin(this.startAngle)
        const ex = this.cx + r * Math.cos(this.endAngle)
        const ey = this.cy + r * Math.sin(this.endAngle)
        const d1 = distPointToSegmentSquared(x, y, this.cx, this.cy, sx, sy)
        const d2 = distPointToSegmentSquared(x, y, this.cx, this.cy, ex, ey)
        if (d1 < minD2) minD2 = d1
        if (d2 < minD2) minD2 = d2

        const dist = minD2 === Infinity
            ? Math.abs(distC - r)
            : Math.sqrt(minD2)
        return this.contains(x, y) ? dist : -dist
    }

    bounds(out?: BoundingRect): BoundingRect {
        const r = out || new BoundingRect()
        const rad = this.radius
        // 简化：用包围圆的 AABB
        r.min.set(this.cx - rad, this.cy - rad)
        r.max.set(this.cx + rad, this.cy + rad)
        return r
    }
}
