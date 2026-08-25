// ============================================================
// EllipseArc - 椭圆扇形
// 由圆心 (cx, cy)、半径 rx/ry、旋转角 xRotation、起始角 startAngle、
// 终止角 endAngle、方向 ccw 定义。
// 角度基于椭圆局部坐标系（先按 (rx, ry) 缩放、再旋转 xRotation），与 canvas ellipse() 一致。
// 边界包括：两段半径线段 + 一段椭圆弧
// area() 计算扇形面积；弓形面积 = sectorArea - triangleArea
// ============================================================

import { normalizeAngles } from '../Arc'
import { BoundingRect } from '../BoundingRect'
import { Geometry, PointOut, distPointToSegmentSquared, normalizeAnglePositive, arcSegmentCount } from './Geometry'

const TAU = Math.PI * 2

/** 椭圆弧长积分用 Gauss-Legendre 16 点节点/权重（[0,1] 区间取正节点，符号成对出现） */
const GL16: ReadonlyArray<readonly [number, number]> = [
    [0.0950125098376374, 0.1894506104550685],
    [0.2816035507792589, 0.1826034150449236],
    [0.4580167776572274, 0.1691565193950025],
    [0.6178762444026438, 0.1495959888165767],
    [0.7554044083550030, 0.1246289712555339],
    [0.8656312023878318, 0.0951585116824928],
    [0.9445750230732326, 0.0622535239386479],
    [0.9894009349916499, 0.0271524594117541],
]

export class EllipseArc extends Geometry {
    cx: number
    cy: number
    rx: number
    ry: number
    /** 长轴旋转角（弧度） */
    xRotation: number
    startAngle: number
    endAngle: number
    /** true=逆时针，false=顺时针 */
    ccw: boolean

    constructor(
        cx: number = 0, cy: number = 0, rx: number = 0, ry: number = 0,
        xRotation: number = 0,
        startAngle: number = 0, endAngle: number = 0,
        ccw: boolean = false
    ) {
        super()
        this.cx = cx
        this.cy = cy
        this.rx = rx
        this.ry = ry
        this.xRotation = xRotation
        this.startAngle = startAngle
        this.endAngle = endAngle
        this.ccw = ccw
    }

    /** 局部角（弧度）对应的世界坐标点 */
    pointAt(angle: number, out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        const cosT = Math.cos(this.xRotation)
        const sinT = Math.sin(this.xRotation)
        r.x = this.cx + this.rx * cos * cosT - this.ry * sin * sinT
        r.y = this.cy + this.rx * cos * sinT + this.ry * sin * cosT
        return r
    }

    /** 扫过角度（绝对值，弧度） */
    sweep(): number {
        const {startAngle, endAngle}=normalizeAngles(this.startAngle, this.endAngle, this.ccw)
        return Math.abs(endAngle-startAngle)
    }

    /** 弦长（起点到终点直线距离） */
    chordLength(): number {
        const s = this.startPoint()
        const e = this.endPoint()
        return Math.hypot(e.x - s.x, e.y - s.y)
    }

    /** 扇形面积 = 0.5 * rx * ry * sweep */
    area(): number {
        return 0.5 * this.rx * this.ry * this.sweep()
    }

    /** 弓形面积（弦+弧）= 扇形面积 - 三角形面积 */
    segmentArea(): number {
        const sweep = this.sweep()
        const sector = 0.5 * this.rx * this.ry * sweep
        const triangle = 0.5 * this.rx * this.ry * Math.sin(sweep)
        return Math.abs(sector - triangle)
    }

    /**
     * 扇形重心
     * 单位圆扇形重心距离 d = (2 sin(α/2)) / (3·α/2)，
     * 局部坐标按 (rx, ry) 缩放，再旋转 xRotation、平移 (cx, cy)
     */
    centroid(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        const sweep = this.sweep()
        if (sweep < 1e-9) {
            r.x = this.cx
            r.y = this.cy
            return r
        }
        const half = sweep * 0.5
        // 角平分线方向（按 ccw 朝向，局部角）
        const bisect = this.ccw ? this.startAngle + half : this.startAngle - half
        const d = (2 * Math.sin(half)) / (3 * half)
        const cosB = Math.cos(bisect)
        const sinB = Math.sin(bisect)
        const cosT = Math.cos(this.xRotation)
        const sinT = Math.sin(this.xRotation)
        const lx = d * this.rx * cosB
        const ly = d * this.ry * sinB
        r.x = this.cx + lx * cosT - ly * sinT
        r.y = this.cy + lx * sinT + ly * cosT
        return r
    }

    center(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        r.x = this.cx
        r.y = this.cy
        return r
    }

    /** 周长 = 椭圆弧长 + 两段半径 */
    perimeter(): number {
        return this.arcLength() + this.rx + this.ry
    }

    /**
     * 椭圆弧长（Gauss-Legendre 16 点数值积分）
     * |dP/dφ| = sqrt(rx²·sin²φ + ry²·cos²φ)，φ 为局部角
     */
    arcLength(): number {
        const a = this.rx
        const b = this.ry
        const sweep = this.sweep()
        if (a <= 0 || b <= 0 || sweep <= 0) return 0
        const dir = this.ccw ? 1 : -1
        const start = this.startAngle
        const end = start + dir * sweep
        const mid = 0.5 * (start + end)
        const halfSpan = 0.5 * (end - start)
        let sum = 0
        for (let i = 0; i < GL16.length; i++) {
            const t = GL16[i][0]
            const w = GL16[i][1]
            for (let s = 1; s >= -1; s -= 2) {
                const x = mid + s * halfSpan * t
                const sin = Math.sin(x)
                const cos = Math.cos(x)
                sum += w * Math.sqrt(a * a * sin * sin + b * b * cos * cos)
            }
        }
        return halfSpan * sum
    }

    /** 起点坐标 */
    startPoint(out?: PointOut): PointOut {
        return this.pointAt(this.startAngle, out)
    }

    /** 终点坐标 */
    endPoint(out?: PointOut): PointOut {
        return this.pointAt(this.endAngle, out)
    }

    /**
     * 点是否在扇形内
     * 条件：在椭圆内（逆旋转到局部坐标系后归一化距离 < 1）且角度在扫过范围内
     */
    contains(x: number, y: number): boolean {
        const dx = x - this.cx
        const dy = y - this.cy
        const cosT = Math.cos(this.xRotation)
        const sinT = Math.sin(this.xRotation)
        // 逆旋转到椭圆局部坐标系
        const lx = dx * cosT + dy * sinT
        const ly = -dx * sinT + dy * cosT
        const ux = lx / this.rx
        const uy = ly / this.ry
        if (ux * ux + uy * uy >= 1) return false
        // 圆心始终在内
        if (ux === 0 && uy === 0) return true
        return this.angleInSweep(Math.atan2(uy, ux))
    }

    /** 角度（局部角）是否在扫过范围内 */
    angleInSweep(angle: number): boolean {
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
     * 带符号距离（到扇形边界：椭圆弧 + 两段半径）
     * 弧距离：牛顿迭代求椭圆最近点，落在扫过范围内才计入
     */
    signedDistance(x: number, y: number): number {
        const a = this.rx
        const b = this.ry
        const dx = x - this.cx
        const dy = y - this.cy
        const cosT = Math.cos(this.xRotation)
        const sinT = Math.sin(this.xRotation)
        // 逆旋转到局部坐标系
        const lx = dx * cosT + dy * sinT
        const ly = -dx * sinT + dy * cosT
        const r = Math.sqrt(lx * lx + ly * ly)
        let minD2 = Infinity

        if (a > 1e-12 && b > 1e-12) {
            // f(θ) = (b²-a²)sinθcosθ + a·lx·sinθ - b·ly·cosθ = 0（牛顿迭代）
            const k = b * b - a * a
            let theta = Math.atan2(a * ly, b * lx)
            for (let i = 0; i < 12; i++) {
                const sin = Math.sin(theta)
                const cos = Math.cos(theta)
                const f = a * lx * sin - b * ly * cos + k * sin * cos
                const df = a * lx * cos + b * ly * sin + k * (cos * cos - sin * sin)
                const delta = f / df
                theta -= delta
                if (Math.abs(delta) < 1e-13) break
            }
            // 最近点落在扫过的弧范围内才计入弧距离
            if (this.angleInSweep(theta)) {
                const qx = this.cx + a * Math.cos(theta) * cosT - b * Math.sin(theta) * sinT
                const qy = this.cy + a * Math.cos(theta) * sinT + b * Math.sin(theta) * cosT
                const dArc = (qx - x) * (qx - x) + (qy - y) * (qy - y)
                if (dArc < minD2) minD2 = dArc
            }
        }

        // 两段半径线段：圆心 -> 起点 / 圆心 -> 终点
        const sx = this.cx + a * Math.cos(this.startAngle) * cosT - b * Math.sin(this.startAngle) * sinT
        const sy = this.cy + a * Math.cos(this.startAngle) * sinT + b * Math.sin(this.startAngle) * cosT
        const ex = this.cx + a * Math.cos(this.endAngle) * cosT - b * Math.sin(this.endAngle) * sinT
        const ey = this.cy + a * Math.cos(this.endAngle) * sinT + b * Math.sin(this.endAngle) * cosT
        const d1 = distPointToSegmentSquared(x, y, this.cx, this.cy, sx, sy)
        const d2 = distPointToSegmentSquared(x, y, this.cx, this.cy, ex, ey)
        if (d1 < minD2) minD2 = d1
        if (d2 < minD2) minD2 = d2

        // 退化椭圆的兜底：沿径向近似
        const dist = minD2 === Infinity
            ? Math.abs(r - Math.sqrt(a * a * Math.cos(Math.atan2(ly, lx)) ** 2 + b * b * Math.sin(Math.atan2(ly, lx)) ** 2))
            : Math.sqrt(minD2)
        return this.contains(x, y) ? dist : -dist
    }

    /** 边界细分：圆心 → 起点 → 弧采样 → 终点 */
    getPoints(out?: PointOut[]): PointOut[] {
        const r = out || []
        r.length = 0
        const sweep=this.sweep()
        // 按较短的半轴估算段数，保证弦高误差达标
        const n = arcSegmentCount(Math.min(this.rx, this.ry), sweep)
        const dir = this.ccw ? 1 : -1
      //  r.push({ x: this.cx, y: this.cy })
        r.push(this.startPoint())
        for (let i = 1; i < n; i++) {
            r.push(this.pointAt(this.startAngle + dir * (sweep * i) / n))
        }
        r.push(this.endPoint())
        return r
    }

    /** 包围盒：旋转后完整椭圆的精确 AABB（含扇形的超集） */
    bounds(out?: BoundingRect): BoundingRect {
        const r = out || new BoundingRect()
        const a = this.rx
        const b = this.ry
        const cosT = Math.cos(this.xRotation)
        const sinT = Math.sin(this.xRotation)
        if (a <= 1e-12 || b <= 1e-12) {
            // 退化椭圆：取圆心与起终点的包围盒
            const s = this.startPoint()
            const e = this.endPoint()
            r.min.set(Math.min(this.cx, s.x, e.x), Math.min(this.cy, s.y, e.y))
            r.max.set(Math.max(this.cx, s.x, e.x), Math.max(this.cy, s.y, e.y))
            return r
        }
        // x 极值：tanφ = -(b·sinT)/(a·cosT)；y 极值：tanφ = (b·cosT)/(a·sinT)
        const px = Math.atan2(-b * sinT, a * cosT)
        const py = Math.atan2(b * cosT, a * sinT)
        const cosPx = Math.cos(px)
        const sinPx = Math.sin(px)
        const cosPy = Math.cos(py)
        const sinPy = Math.sin(py)
        const x1 = this.cx + a * cosPx * cosT - b * sinPx * sinT
        const x2 = this.cx - a * cosPx * cosT + b * sinPx * sinT
        const y1 = this.cy + a * cosPy * sinT + b * sinPy * cosT
        const y2 = this.cy - a * cosPy * sinT - b * sinPy * cosT
        r.min.set(Math.min(x1, x2), Math.min(y1, y2))
        r.max.set(Math.max(x1, x2), Math.max(y1, y2))
        return r
    }
}
