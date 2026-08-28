// ============================================================
// Polygon - 多边形（支持凸/凹，使用 even-odd 规则）
// 顶点按数组顺序存储：[x0,y0,x1,y1,...] 或 [{x,y},...]
// 内部使用扁平数组 [x0,y0,x1,y1,...] 以提高缓存命中率
// ============================================================

import { BoundingRect } from '../BoundingRect'
import { Geometry, PointOut, distPointToSegmentSquared } from './Geometry'

export class Polygon extends Geometry {
    /** 扁平顶点数据 [x0,y0,x1,y1,...] */
    points: number[]
    closed: boolean = false
    constructor(points: number[] = []) {
        super()
        this.points = points
    }

    /** 顶点数 */
    get vertexCount(): number {
        return this.points.length >> 1
    }

    /** 从点对象数组构造 */
    static fromPoints(pts: Array<{ x: number, y: number }>): Polygon {
        const flat = new Array(pts.length * 2)
        for (let i = 0; i < pts.length; i++) {
            flat[i * 2] = pts[i].x
            flat[i * 2 + 1] = pts[i].y
        }
        return new Polygon(flat)
    }

    /**
     * 面积（带符号面积取绝对值）
     * Shoelace 公式：A = 0.5 * Σ (x_i * y_{i+1} - x_{i+1} * y_i)
     */
    signedArea(): number {
        const p = this.points
        const n = p.length
        if (n < 6) return 0
        let sum = 0
        for (let i = 0; i < n; i += 2) {
            const x0 = p[i]
            const y0 = p[i + 1]
            const x1 = p[(i + 2) % n]
            const y1 = p[(i + 3) % n]
            sum += x0 * y1 - x1 * y0
        }
        return sum * 0.5
    }

    area(): number {
        return Math.abs(this.signedArea())
    }

    /**
     * 重心（面积加权形心）
     * Cx = (1/6A) Σ (x_i + x_{i+1})(x_i y_{i+1} - x_{i+1} y_i)
     * Cy = (1/6A) Σ (y_i + y_{i+1})(x_i y_{i+1} - x_{i+1} y_i)
     */
    centroid(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        const p = this.points
        const n = p.length
        if (n < 6) {
            if (n === 2) { r.x = p[0]; r.y = p[1]; return r }
            if (n === 4) { r.x = (p[0] + p[2]) * 0.5; r.y = (p[1] + p[3]) * 0.5; return r }
            r.x = 0; r.y = 0
            return r
        }
        let sumA = 0
        let cx = 0
        let cy = 0
        for (let i = 0; i < n; i += 2) {
            const x0 = p[i]
            const y0 = p[i + 1]
            const x1 = p[(i + 2) % n]
            const y1 = p[(i + 3) % n]
            const cross = x0 * y1 - x1 * y0
            sumA += cross
            cx += (x0 + x1) * cross
            cy += (y0 + y1) * cross
        }
        const a6 = sumA * 3 // 6 * (sumA/2)
        if (Math.abs(a6) > 1e-12) {
            r.x = cx / a6
            r.y = cy / a6
        } else {
            // 退化：用顶点平均
            let sx = 0, sy = 0
            const cnt = n >> 1
            for (let i = 0; i < n; i += 2) {
                sx += p[i]
                sy += p[i + 1]
            }
            r.x = sx / cnt
            r.y = sy / cnt
        }
        return r
    }

    center(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        const b = this.bounds()
        r.x = b.centerX
        r.y = b.centerY
        return r
    }

    perimeter(): number {
        const p = this.points
        const n = p.length
        if (n < 4) return 0
        let sum = 0
        for (let i = 0; i < n; i += 2) {
            const x0 = p[i]
            const y0 = p[i + 1]
            const x1 = p[(i + 2) % n]
            const y1 = p[(i + 3) % n]
            const dx = x1 - x0
            const dy = y1 - y0
            sum += Math.sqrt(dx * dx + dy * dy)
        }
        return sum
    }

    /**
     * 射线投射法（even-odd 规则）
     * 性能：O(n)，无内存分配
     */
    contains(x: number, y: number): boolean {
        const p = this.points
        const n = p.length
        if (n < 6) return false
        let inside = false
        for (let i = 0, j = n - 2; i < n; j = i, i += 2) {
            const xi = p[i], yi = p[i + 1]
            const xj = p[j], yj = p[j + 1]
            const intersects =
                yi > y !== yj > y &&
                x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
            if (intersects) inside = !inside
        }
        return inside
    }

    signedDistance(x: number, y: number): number {
        const p = this.points
        const n = p.length
        if (n < 4) return Infinity
        let minD2 = Infinity
        for (let i = 0, j = n - 2; i < n; j = i, i += 2) {
            const d2 = distPointToSegmentSquared(
                x, y,
                p[j], p[j + 1],
                p[i], p[i + 1]
            )
            if (d2 < minD2) minD2 = d2
        }
        const dist = Math.sqrt(minD2)
        return this.contains(x, y) ? dist : -dist
    }

    getPoints(out?: PointOut[]): PointOut[] {
        const r = out || []
        r.length = 0
        const p = this.points
        for (let i = 0; i < p.length; i += 2) {
            r.push({ x: p[i], y: p[i + 1] })
        }
        return r
    }

    bounds(out?: BoundingRect): BoundingRect {
        const r = out || new BoundingRect()
        const p = this.points
        const n = p.length
        if (n === 0) {
            r.setEmpty()
            return r
        }
        let minX = p[0], minY = p[1]
        let maxX = p[0], maxY = p[1]
        for (let i = 2; i < n; i += 2) {
            const x = p[i]
            const y = p[i + 1]
            if (x < minX) minX = x
            else if (x > maxX) maxX = x
            if (y < minY) minY = y
            else if (y > maxY) maxY = y
        }
        r.min.set(minX, minY)
        r.max.set(maxX, maxY)
        return r
    }
}
