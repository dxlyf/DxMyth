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
     *       对 θ 求导令 f(θ)=0，用牛顿迭代求最近点对应的参数角 θ*，距离 = |p - q(θ*)|。
     *       先将点反射到第一象限再迭代（带符号坐标下轴点初值会向错误方向发散），
     *       外部点初值取径向近似角 atan2(a·py, b·px)，内部点按 iq 方案取轴点初值 0 或 π/2，
     *       通常 3~6 次迭代即可收敛到双精度精度。
     * 约定：内部为正、外部为负（与 Triangle 等一致）
     */
    signedDistance(x: number, y: number): number {
        const dx = x - this.cx
        const dy = y - this.cy
        const a = this.radiusX
        const b = this.radiusY

        // 圆特例：直接套圆公式，避免牛顿法在 k=0 时退化
        if (a === b) {
            return a - Math.hypot(dx, dy)
        }
        if (dx === 0 && dy === 0) return Math.min(a, b)

        // 点在坐标轴上：初值 atan2(a·dy, b·dx) 恰好落在驻点上，f 与 f' 同为 0 得 0/0 → NaN，
        // 且该驻点可能并非最近点（轴内点最近点可在轴外），改走一维解析解。
        const eps = 1e-9 * Math.max(a, b)
        if (Math.abs(dy) <= eps || Math.abs(dx) <= eps) {
            return this._signedDistanceOnAxis(x, y)
        }

        // f(θ) = (b²-a²)sinθcosθ + a·px·sinθ - b·py·cosθ = 0
        // f'(θ) = (b²-a²)(cos²θ-sin²θ) + a·px·cosθ + b·py·sinθ
        // 反射到第一象限（px=|dx|, py=|dy|）再迭代：带符号坐标下轴点初值可能
        // 向错误方向发散（如 a=8,b=1 的 (-7.6,-0.3)），反射后即可稳健收敛。
        const px = Math.abs(dx)
        const py = Math.abs(dy)
        const k = b * b - a * a
        const outside = px * px / (a * a) + py * py / (b * b) > 1
        // 初值：外部点用径向近似角 atan2(a·py, b·px) 即可收敛；
        // 内部点该初值可能收敛到错误驻点（极扁椭圆轴外内部点，如 a=8,b=1 的 (-7.33,-0.2)），
        // 故按 iq 方案改用轴点初值：梯度间断线 a(px-a)=b(py-b) 一侧取 0、另一侧取 π/2。
        let theta = outside
            ? Math.atan2(a * py, b * px)
            : (a * (px - a) < b * (py - b) ? Math.PI / 2 : 0)
        for (let i = 0; i < 12; i++) {
            const sin = Math.sin(theta)
            const cos = Math.cos(theta)
            const f = a * px * sin - b * py * cos + k * sin * cos
            const df = a * px * cos + b * py * sin + k * (cos * cos - sin * sin)
            const delta = f / df
            theta -= delta
            if (Math.abs(delta) < 1e-13) break
        }

        // 最近点与距离（第一象限内距离与带符号坐标一致，符号由内外侧决定）
        const dist = Math.hypot(px - a * Math.cos(theta), py - b * Math.sin(theta))
        return outside ? -dist : dist
    }

    /**
     * 带符号距离（解析法：解一元四次方程）
     * 参考：https://iquilezles.org/articles/ellipsedist/
     * 思路：最近点 q(θ) = (cx + a·cosθ, cy + b·sinθ)，令 |p - q(θ)|² 对 θ 导数为 0，
     *       代换 λ = cosθ 化为一元四次方程，利用系数对称性直接解析求解，无需迭代。
     * 注意：近圆（a ≈ b）或极扁时该法数值不稳定（iq 原文亦注明），请优先用于常规椭圆；
     *       a === b 时为圆，直接套圆公式；点在坐标轴上时预解式退化，改走一维解析解。
     * 约定：内部为正、外部为负（与 signedDistance 一致）
     */
    signedDistanceQuartic(x: number, y: number): number {
        const a = this.radiusX
        const b = this.radiusY
        // 圆特例：退化为圆公式，避免 (b² - a²) 作除数；约定内正外负
        if (a === b) {
            return a - Math.hypot(x - this.cx, y - this.cy)
        }
        const dx = x - this.cx
        const dy = y - this.cy
        // 点在坐标轴上：四次方程的预解式退化（s=0 导致除零），改走一维解析解
        const eps = 1e-9 * Math.max(a, b)
        if (Math.abs(dy) <= eps || Math.abs(dx) <= eps) {
            return this._signedDistanceOnAxis(x, y)
        }
        // 反射到第一象限，并保证 p.y >= p.x（相应交换半轴），利用对称性提升分支稳定性
        let px = Math.abs(dx)
        let py = Math.abs(dy)
        let rx = a
        let ry = b
        if (px > py) {
            const t1 = px
            px = py
            py = t1
            const t2 = rx
            rx = ry
            ry = t2
        }
        const l = ry * ry - rx * rx
        const m = (rx * px) / l
        const m2 = m * m
        const n = (ry * py) / l
        const n2 = n * n
        const c = (m2 + n2 - 1) / 3
        const c2 = c * c
        const c3 = c2 * c
        const d = c3 + m2 * n2
        const q = d + m2 * n2
        const g = m + m * n2

        // 三次预解式实根个数由 d 的符号决定，分别对应两种解析分支
        let co: number
        if (d < 0) {
            const h = Math.acos(q / c3) / 3
            const s = Math.cos(h) + 2
            const t = Math.sin(h) * Math.sqrt(3)
            const r1 = Math.sqrt(m2 - c * (s + t))
            const r2 = Math.sqrt(m2 - c * (s - t))
            co = r2 + Math.sign(l) * r1 + Math.abs(g) / (r1 * r2)
        } else {
            const h = 2 * m * n * Math.sqrt(d)
            const s = Math.cbrt(q + h)
            const t = c2 / s
            const r1 = -(s + t) - c * 4 + 2 * m2
            const r2 = (s - t) * Math.sqrt(3)
            const rm = Math.sqrt(r1 * r1 + r2 * r2)
            co = r2 / Math.sqrt(rm - r1) + (2 * g) / rm
        }
        co = (co - m) / 2
        // 数值误差可能使 cos(θ*) 略超出 [-1, 1]，裁剪后求 sin
        if (co < -1) co = -1
        else if (co > 1) co = 1
        const si = Math.sqrt(1 - co * co)
        const dist = Math.hypot(px - rx * co, py - ry * si)
        const inside = (px * px) / (rx * rx) + (py * py) / (ry * ry) < 1
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

    /**
     * 点在坐标轴上的带符号距离（一维解析解）
     * 距离平方 |p - q(θ)|² 的驻点只有两种：sinθ=0（θ=0/π，即轴端点）
     * 或 cosθ = A·d/(A²-B²)（轴外点），取各驻点距离最小值。
     * 约定：内部为正、外部为负。要求 a ≠ b（圆走圆公式，此处避免除零）。
     */
    private _signedDistanceOnAxis(x: number, y: number): number {
        const dx = Math.abs(x - this.cx)
        const dy = Math.abs(y - this.cy)
        // 投影到点所在的轴：A = 沿轴向半轴，B = 垂向半轴，d = 点在该轴上的距离
        let A = this.radiusX
        let B = this.radiusY
        let d = dx
        if (dy > dx) {
            A = this.radiusY
            B = this.radiusX
            d = dy
        }
        const k = A * A - B * B
        const cosA = Math.max(-1, Math.min(1, (A * d) / k))
        const c1 = Math.abs(d - A)
        const c2 = d + A
        const c3 = Math.sqrt((d - A * cosA) * (d - A * cosA) + B * B * (1 - cosA * cosA))
        const dist = Math.min(c1, c2, c3)
        return d < A ? dist : -dist
    }
}
