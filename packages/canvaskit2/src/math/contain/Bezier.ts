// ============================================================
// Bezier - 二次/三次贝塞尔曲线
// 开放曲线，area=0，contains=false
// signedDistance 通过求解最近点参数 t 计算
//   - 二次：解析法（求解一元三次方程）
//   - 三次：采样 + Newton-Raphson 精化
// 弧长使用 Gauss-Legendre 数值积分（5 节点，精度高）
// ============================================================

import { BoundingRect } from '../BoundingRect'
import { Geometry, PointOut } from './Geometry'
import { solveCubicByCardano } from '../MathUtils'

export type BezierType = 'quadratic' | 'cubic'

export class Bezier extends Geometry {
    type: BezierType
    // 控制点扁平存储 [p0x, p0y, p1x, p1y, ...]
    // 二次：6 个数；三次：8 个数
    points: number[]

    constructor(type: BezierType = 'cubic', points: number[] = []) {
        super()
        this.type = type
        this.points = points
    }

    static quadratic(
        x0: number, y0: number,
        c1x: number, c1y: number,
        x1: number, y1: number
    ): Bezier {
        return new Bezier('quadratic', [x0, y0, c1x, c1y, x1, y1])
    }

    static cubic(
        x0: number, y0: number,
        c1x: number, c1y: number,
        c2x: number, c2y: number,
        x1: number, y1: number
    ): Bezier {
        return new Bezier('cubic', [x0, y0, c1x, c1y, c2x, c2y, x1, y1])
    }

    area(): number {
        return 0
    }

    centroid(out?: PointOut): PointOut {
        return this.pointAt(0.5, out)
    }

    center(out?: PointOut): PointOut {
        return this.centroid(out)
    }

    /** 曲线长度（数值积分） */
    perimeter(): number {
        return this.arcLength()
    }

    contains(x: number, y: number): boolean {
        return false
    }

    /** 求曲线上参数 t 处的点 */
    pointAt(t: number, out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        const p = this.points
        const u = 1 - t
        if (this.type === 'quadratic') {
            // B(t) = u²P0 + 2utP1 + t²P2
            const u2 = u * u
            const t2 = t * t
            const ut2 = 2 * u * t
            r.x = u2 * p[0] + ut2 * p[2] + t2 * p[4]
            r.y = u2 * p[1] + ut2 * p[3] + t2 * p[5]
        } else {
            // B(t) = u³P0 + 3u²tP1 + 3ut²P2 + t³P3
            const u3 = u * u * u
            const t3 = t * t * t
            const u2t = 3 * u * u * t
            const ut2 = 3 * u * t * t
            r.x = u3 * p[0] + u2t * p[2] + ut2 * p[4] + t3 * p[6]
            r.y = u3 * p[1] + u2t * p[3] + ut2 * p[5] + t3 * p[7]
        }
        return r
    }

    /** 导数（切线向量） */
    derivativeAt(t: number, out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        const p = this.points
        const u = 1 - t
        if (this.type === 'quadratic') {
            // B'(t) = 2u(P1-P0) + 2t(P2-P1)
            r.x = 2 * u * (p[2] - p[0]) + 2 * t * (p[4] - p[2])
            r.y = 2 * u * (p[3] - p[1]) + 2 * t * (p[5] - p[3])
        } else {
            // B'(t) = 3u²(P1-P0) + 6ut(P2-P1) + 3t²(P3-P2)
            const u2 = u * u
            const t2 = t * t
            r.x = 3 * u2 * (p[2] - p[0]) + 6 * u * t * (p[4] - p[2]) + 3 * t2 * (p[6] - p[4])
            r.y = 3 * u2 * (p[3] - p[1]) + 6 * u * t * (p[5] - p[3]) + 3 * t2 * (p[7] - p[5])
        }
        return r
    }

    /**
     * 弧长 - Gauss-Legendre 5 节点积分
     * ∫₀¹ |B'(t)| dt
     */
    arcLength(): number {
        // 5 节点 Gauss-Legendre 的节点和权重
        const nodes = [
            0.5 - 0.5 * Math.sqrt(5 + 2 * Math.sqrt(10 / 7)) / 3,
            0.5 - 0.5 * Math.sqrt(5 - 2 * Math.sqrt(10 / 7)) / 3,
            0.5,
            0.5 + 0.5 * Math.sqrt(5 - 2 * Math.sqrt(10 / 7)) / 3,
            0.5 + 0.5 * Math.sqrt(5 + 2 * Math.sqrt(10 / 7)) / 3,
        ]
        const weights = [
            (322 - 13 * Math.sqrt(70)) / 1800,
            (322 + 13 * Math.sqrt(70)) / 1800,
            128 / 450,
            (322 + 13 * Math.sqrt(70)) / 1800,
            (322 - 13 * Math.sqrt(70)) / 1800,
        ]
        // 将 [0,1] 区间的积分变换到 [-1,1]：t = (x+1)/2, dt = 1/2
        let sum = 0
        const d = { x: 0, y: 0 }
        for (let i = 0; i < 5; i++) {
            const t = nodes[i]
            this.derivativeAt(t, d)
            sum += weights[i] * Math.sqrt(d.x * d.x + d.y * d.y)
        }
        return sum * 0.5
    }

    /**
     * 带符号距离 - 找到曲线上离点最近的点
     * 二次：解析（求导得到三次方程）
     * 三次：采样 + Newton 精化
     */
    signedDistance(x: number, y: number): number {
        const ts = this.closestParameter(x, y)
        const pt = this.pointAt(ts)
        const dx = x - pt.x
        const dy = y - pt.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    /** 最近点参数 t */
    closestParameter(x: number, y: number): number {
        const p = this.points
        if (this.type === 'quadratic') {
            return this._closestQuadratic(x, y, p)
        }
        return this._closestCubic(x, y, p)
    }

    /**
     * 二次贝塞尔最近点参数
     * 设 D(t) = |B(t) - Q|²，求 D'(t)=0
     * 化简后得到一元三次方程 at³+bt²+ct+d=0
     */
    private _closestQuadratic(x: number, y: number, p: number[]): number {
        const x0 = p[0], y0 = p[1]
        const x1 = p[2], y1 = p[3]
        const x2 = p[4], y2 = p[5]
        // B(t) - Q = (u²(x0-x) + 2ut(x1-x) + t²(x2-x), 同 y)
        // 令 a = x0 - 2x1 + x2, b = 2(x1-x0), c = x0 - x
        // 对 y 同理
        const ax = x0 - 2 * x1 + x2
        const bx = 2 * (x1 - x0)
        const cx = x0 - x
        const ay = y0 - 2 * y1 + y2
        const by = 2 * (y1 - y0)
        const cy = y0 - y

        // D(t) = (a_x t² + b_x t + c_x)² + (a_y t² + b_y t + c_y)²
        // D'(t) = 2 (a_x t² + b_x t + c_x)(2 a_x t + b_x) + (y 同)
        // 整理为三次方程：A t³ + B t² + C t + D = 0
        const A = 2 * (ax * ax + ay * ay)
        const B = 3 * (ax * bx + ay * by)
        const C = bx * bx + by * by + 2 * (ax * cx + ay * cy)
        const D = bx * cx + by * cy

        const roots = solveCubicByCardano(A, B, C, D)
        // 候选：所有实根 + 端点 0, 1
        const candidates = [0, 1]
        for (let i = 0; i < roots.length; i++) {
            const r = roots[i]
            if (r > 0 && r < 1) candidates.push(r)
        }
        let bestT = 0
        let bestD2 = Infinity
        const pt = { x: 0, y: 0 }
        for (let i = 0; i < candidates.length; i++) {
            this.pointAt(candidates[i], pt)
            const dx = x - pt.x
            const dy = y - pt.y
            const d2 = dx * dx + dy * dy
            if (d2 < bestD2) {
                bestD2 = d2
                bestT = candidates[i]
            }
        }
        return bestT
    }

    /**
     * 三次贝塞尔最近点参数
     * 采样 N 个点找近似最近，再 Newton-Raphson 精化 3 次
     */
    private _closestCubic(x: number, y: number, p: number[]): number {
        const N = 16
        let bestT = 0
        let bestD2 = Infinity
        const pt = { x: 0, y: 0 }
        for (let i = 0; i <= N; i++) {
            const t = i / N
            this.pointAt(t, pt)
            const dx = x - pt.x
            const dy = y - pt.y
            const d2 = dx * dx + dy * dy
            if (d2 < bestD2) {
                bestD2 = d2
                bestT = t
            }
        }
        // Newton-Raphson 精化
        // f(t) = (B(t) - Q) · B'(t) = 0
        // f'(t) = |B'(t)|² + (B(t) - Q) · B''(t)
        const d1 = { x: 0, y: 0 }
        const d2 = { x: 0, y: 0 }
        let t = bestT
        for (let iter = 0; iter < 4; iter++) {
            this.pointAt(t, pt)
            this.derivativeAt(t, d1)
            this._secondDerivativeAt(t, d2)
            const ex = pt.x - x
            const ey = pt.y - y
            const f = ex * d1.x + ey * d1.y
            const fp = d1.x * d1.x + d1.y * d1.y + ex * d2.x + ey * d2.y
            if (Math.abs(fp) < 1e-12) break
            let nt = t - f / fp
            if (nt < 0) nt = 0
            else if (nt > 1) nt = 1
            if (Math.abs(nt - t) < 1e-9) {
                t = nt
                break
            }
            t = nt
        }
        return t
    }

    private _secondDerivativeAt(t: number, out: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        const p = this.points
        const u = 1 - t
        if (this.type === 'quadratic') {
            // B''(t) = 2(P0 - 2P1 + P2)
            r.x = 2 * (p[0] - 2 * p[2] + p[4])
            r.y = 2 * (p[1] - 2 * p[3] + p[5])
        } else {
            // B''(t) = 6u²(P0-2P1+P2) + 6t(P1-2P2+P3) ... 实际为：
            // B''(t) = 6[(1-t)(P2-2P1+P0) + t(P3-2P2+P1)]
            r.x = 6 * (u * (p[4] - 2 * p[2] + p[0]) + t * (p[6] - 2 * p[4] + p[2]))
            r.y = 6 * (u * (p[5] - 2 * p[3] + p[1]) + t * (p[7] - 2 * p[5] + p[3]))
        }
        return r
    }

    bounds(out?: BoundingRect): BoundingRect {
        const r = out || new BoundingRect()
        const p = this.points
        r.min.set(Infinity, Infinity)
        r.max.set(-Infinity, -Infinity)
        for (let i = 0; i < p.length; i += 2) {
            r.add(p[i], p[i + 1])
        }
        return r
    }
}
