// ============================================================
// Triangle - 三角形
// ============================================================

import { BoundingRect } from '../BoundingRect'
import { Geometry, PointOut, distPointToSegmentSquared } from './Geometry'

/** 重心坐标输出（避免分配）：P = u*A + v*B + w*C，u + v + w = 1 */
export interface BarycentricOut {
    /** 顶点 A 的权重 */
    u: number
    /** 顶点 B 的权重 */
    v: number
    /** 顶点 C 的权重 */
    w: number
}

export class Triangle extends Geometry {
    ax: number
    ay: number
    bx: number
    by: number
    cx: number
    cy: number

    constructor(
        ax: number = 0, ay: number = 0,
        bx: number = 0, by: number = 0,
        cx: number = 0, cy: number = 0
    ) {
        super()
        this.ax = ax
        this.ay = ay
        this.bx = bx
        this.by = by
        this.cx = cx
        this.cy = cy
    }

    /** 有向面积（带符号，CCW 为正） */
    signedArea(): number {
        return (
            (this.bx - this.ax) * (this.cy - this.ay) -
            (this.by - this.ay) * (this.cx - this.ax)
        ) * 0.5
    }

    area(): number {
        return Math.abs(this.signedArea())
    }

    centroid(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        r.x = (this.ax + this.bx + this.cx) / 3
        r.y = (this.ay + this.by + this.cy) / 3
        return r
    }

    center(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        r.x = (Math.max(this.ax, this.bx, this.cx) + Math.min(this.ax, this.bx, this.cx)) * 0.5
        r.y = (Math.max(this.ay, this.by, this.cy) + Math.min(this.ay, this.by, this.cy)) * 0.5
        return r
    }

    perimeter(): number {
        const abx = this.bx - this.ax, aby = this.by - this.ay
        const bcx = this.cx - this.bx, bcy = this.cy - this.by
        const cax = this.ax - this.cx, cay = this.ay - this.cy
        return (
            Math.sqrt(abx * abx + aby * aby) +
            Math.sqrt(bcx * bcx + bcy * bcy) +
            Math.sqrt(cax * cax + cay * cay)
        )
    }

    /**
     * 重心坐标法判断点是否在三角形内部
     * 使用同向法：点在三边的同侧
     */
    contains(x: number, y: number): boolean {
        const ax = this.ax, ay = this.ay
        const bx = this.bx, by = this.by
        const cx = this.cx, cy = this.cy
        const d1 = (x - bx) * (ay - by) - (ax - bx) * (y - by)
        const d2 = (x - cx) * (by - cy) - (bx - cx) * (y - cy)
        const d3 = (x - ax) * (cy - ay) - (cx - ax) * (y - ay)
        const hasNeg = d1 < 0 || d2 < 0 || d3 < 0
        const hasPos = d1 > 0 || d2 > 0 || d3 > 0
        return !(hasNeg && hasPos)
    }

    signedDistance(x: number, y: number): number {
        const dAB = distPointToSegmentSquared(x, y, this.ax, this.ay, this.bx, this.by)
        const dBC = distPointToSegmentSquared(x, y, this.bx, this.by, this.cx, this.cy)
        const dCA = distPointToSegmentSquared(x, y, this.cx, this.cy, this.ax, this.ay)
        const minD2 = Math.min(dAB, dBC, dCA)
        const dist = Math.sqrt(minD2)
        return this.contains(x, y) ? dist : -dist
    }

    bounds(out?: BoundingRect): BoundingRect {
        const r = out || new BoundingRect()
        r.min.set(
            Math.min(this.ax, this.bx, this.cx),
            Math.min(this.ay, this.by, this.cy)
        )
        r.max.set(
            Math.max(this.ax, this.bx, this.cx),
            Math.max(this.ay, this.by, this.cy)
        )
        return r
    }

    /**
     * 计算点 P 相对三角形 ABC 的重心坐标 (u, v, w)
     * 满足 P = u*A + v*B + w*C，且 u + v + w = 1
     * - 点在三角形内部（含边界）时，u, v, w ∈ [0, 1]
     * - 点在外部时，至少有一个坐标为负
     * - 退化三角形（面积为 0）返回 (0, 0, 0)
     * 算法：基于子三角形有符号面积之比，2 倍面积因子在分子分母中抵消
     */
    static barycentric(
        ax: number, ay: number,
        bx: number, by: number,
        cx: number, cy: number,
        px: number, py: number,
        out?: BarycentricOut
    ): BarycentricOut {
        const r = out || { u: 0, v: 0, w: 0 }
        // 2 倍有符号面积（CCW 为正）
        const denom = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
        if (denom === 0) {
            r.u = 0
            r.v = 0
            r.w = 0
            return r
        }
        const inv = 1 / denom
        r.u = ((bx - px) * (cy - py) - (by - py) * (cx - px)) * inv
        r.v = ((cx - px) * (ay - py) - (cy - py) * (ax - px)) * inv
        r.w = ((ax - px) * (by - py) - (ay - py) * (bx - px)) * inv
        return r
    }
}
