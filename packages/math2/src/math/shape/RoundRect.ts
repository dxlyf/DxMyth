// ============================================================
// RoundRect - 圆角矩形
// 边界 = 4 条直边 + 4 个四分之一圆角
// 面积 = w*h - (4-π) r²
// 周长 = 2(w+h) - 8r + 2πr
// ============================================================

import { BoundingRect } from '../BoundingRect'
import { Geometry, PointOut, arcSegmentCount } from './Geometry'

export class RoundRect extends Geometry {
    x: number
    y: number
    width: number
    height: number
    /** 圆角半径（统一） */
    radius: number

    constructor(
        x: number = 0, y: number = 0,
        width: number = 0, height: number = 0,
        radius: number = 0
    ) {
        super()
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        // 限制 radius 不超过 w/h 的一半
        this.radius = Math.max(0, Math.min(radius, Math.min(width, height) * 0.5))
    }

    get right(): number {
        return this.x + this.width
    }

    get bottom(): number {
        return this.y + this.height
    }

    /** 面积 = 矩形面积 - 4 个角方块（r²） + 4 个四分之一圆（πr²） */
    area(): number {
        const r = this.radius
        return this.width * this.height - (4 - Math.PI) * r * r
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

    /** 周长 = 2(w+h) - 8r + 2πr */
    perimeter(): number {
        const r = this.radius
        return 2 * (this.width + this.height) - 8 * r + 2 * Math.PI * r
    }

    /**
     * 点是否在圆角矩形内（不含边界）
     * 算法：
     *   - 在内矩形（去除四角）内 → true
     *   - 在角区域内 → 看是否在对应圆角圆内
     */
    contains(x: number, y: number): boolean {
        const r = this.radius
        const x1 = this.x, y1 = this.y
        const x2 = this.right, y2 = this.bottom
        if (x <= x1 || x >= x2 || y <= y1 || y >= y2) return false
        // 检查四个角的圆心
        const cx1 = x1 + r, cy1 = y1 + r
        const cx2 = x2 - r, cy2 = y2 - r
        // 左上角
        if (x < cx1 && y < cy1) {
            const dx = x - cx1, dy = y - cy1
            return dx * dx + dy * dy < r * r
        }
        // 右上角
        if (x > cx2 && y < cy1) {
            const dx = x - cx2, dy = y - cy1
            return dx * dx + dy * dy < r * r
        }
        // 左下角
        if (x < cx1 && y > cy2) {
            const dx = x - cx1, dy = y - cy2
            return dx * dx + dy * dy < r * r
        }
        // 右下角
        if (x > cx2 && y > cy2) {
            const dx = x - cx2, dy = y - cy2
            return dx * dx + dy * dy < r * r
        }
        // 中间区域
        return true
    }

    /**
     * 带符号距离
     * 内部为正，外部为负
     * 算法：
     *   1. 将点坐标变换到 "角圆心" 坐标系下
     *   2. 用 max(|dx|-innerW, |dy|-innerH) 找到最近的角区域
     *   3. 若在角区域内：距角圆心的距离差
     *   4. 若在内十字区域：min 到四条直边的距离
     */
    signedDistance(x: number, y: number): number {
        const r = this.radius
        const x1 = this.x, y1 = this.y
        const x2 = this.right, y2 = this.bottom
        const cx1 = x1 + r, cy1 = y1 + r
        const cx2 = x2 - r, cy2 = y2 - r

        // 判断点在哪个角区域
        let cornerX: number, cornerY: number
        let inCornerX = false, inCornerY = false

        if (x < cx1) {
            cornerX = cx1
            inCornerX = true
        } else if (x > cx2) {
            cornerX = cx2
            inCornerX = true
        } else {
            cornerX = x
        }

        if (y < cy1) {
            cornerY = cy1
            inCornerY = true
        } else if (y > cy2) {
            cornerY = cy2
            inCornerY = true
        } else {
            cornerY = y
        }

        if (inCornerX && inCornerY) {
            // 在角区域内：到对应角圆心的距离 - r
            const dx = x - cornerX
            const dy = y - cornerY
            const d = Math.sqrt(dx * dx + dy * dy)
            return r - d // 内部为正
        } else {
            // 在内十字区域或在直边外
            // 距离到最近直边
            const dx1 = x - x1
            const dx2 = x2 - x
            const dy1 = y - y1
            const dy2 = y2 - y
            // 若在矩形 AABB 内（含直边区域），距离 = min(dx1, dx2, dy1, dy2)
            // 否则需要考虑外角
            if (dx1 >= 0 && dx2 >= 0 && dy1 >= 0 && dy2 >= 0) {
                return Math.min(dx1, dx2, dy1, dy2)
            }
            // 外部：到外角（已变形为圆角）的距离
            // 这种情况下点在 AABB 外但在角圆角外
            // 找到最近的角圆心
            const nearCx = x < cx1 ? cx1 : (x > cx2 ? cx2 : x)
            const nearCy = y < cy1 ? cy1 : (y > cy2 ? cy2 : y)
            const dx = x - nearCx
            const dy = y - nearCy
            const d = Math.sqrt(dx * dx + dy * dy)
            // 距离边界 = -(d - r)
            return -(d - r)
        }
    }

    getPoints(out?: PointOut[]): PointOut[] {
        const r = out || []
        r.length = 0
        const { x, y, radius } = this
        const x2 = x + this.width
        const y2 = y + this.height
        // 无圆角：退化为矩形四角
        if (radius <= 0) {
            r.push(
                { x, y },
                { x: x2, y },
                { x: x2, y: y2 },
                { x, y: y2 }
            )
            return r
        }
        // 顺时针从 (x+r, y) 开始：直边端点 + 四个四分之一圆弧
        // 顶部圆角圆心 (x+r, y+r)，向右下… 依次为右上/右下/左下/左上
        const pushArc = (cx: number, cy: number, a0: number, a1: number): void => {
            const n = arcSegmentCount(radius, Math.PI * 0.5)
            for (let i = 1; i < n; i++) {
                const a = a0 + (a1 - a0) * (i / n)
                r.push({ x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) })
            }
        }
        // 上边（左 → 右）
        r.push({ x: x + radius, y }, { x: x2 - radius, y })
        // 右上圆角：圆心 (x2-r, y+r)，角度 -π/2 → 0
        pushArc(x2 - radius, y + radius, -Math.PI * 0.5, 0)
        // 右边（上 → 下）
        r.push({ x: x2, y: y2 - radius })
        // 右下圆角：圆心 (x2-r, y2-r)，角度 0 → π/2
        pushArc(x2 - radius, y2 - radius, 0, Math.PI * 0.5)
        // 下边（右 → 左）
        r.push({ x: x + radius, y: y2 })
        // 左下圆角：圆心 (x+r, y2-r)，角度 π/2 → π
        pushArc(x + radius, y2 - radius, Math.PI * 0.5, Math.PI)
        // 左边（下 → 上）
        r.push({ x, y: y + radius })
        // 左上圆角：圆心 (x+r, y+r)，角度 π → 3π/2（闭合回起点）
        pushArc(x + radius, y + radius, Math.PI, Math.PI * 1.5)
        return r
    }

    bounds(out?: BoundingRect): BoundingRect {
        const r = out || new BoundingRect()
        r.min.set(this.x, this.y)
        r.max.set(this.right, this.bottom)
        return r
    }
}
