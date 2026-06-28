import { solveCubicByCardano, solveQuadratic } from "./MathUtils"
import { type PointLike, Point } from "./Point"
import { BoundingRect } from './BoundingRect'


export function getQuadraticBezierEvaluate(t: number, p0: PointLike, p1: PointLike, p2: PointLike): PointLike {
    const mt = 1 - t
    const mt2 = mt * mt
    const t2 = t * t
    return Point.create(
        mt2 * p0.x + 2 * mt * t * p1.x + t2 * p2.x,
        mt2 * p0.y + 2 * mt * t * p1.y + t2 * p2.y
    )
}

export function getQuadraticBezierExtremaRoots(p0: PointLike, p1: PointLike, p2: PointLike): number[] {
    const roots: number[] = []
    // B(t) = (1-t)²·P0 + 2t(1-t)·P1 + t²·P2
    // B'(t) = 2(1-t)(P1-P0) + 2t(P2-P1) = 2[(P1-P0) + t(P0 - 2P1 + P2)]
    // 令 B'(t) = 0，解得 t = (P0 - P1) / (P0 - 2P1 + P2)

    const ax = p0.x - 2 * p1.x + p2.x
    const bx = p1.x - p0.x
    if (ax !== 0) {
        const tx = bx / ax
        if (tx > 0 && tx < 1) {
            roots.push(tx)
        }
    }

    const ay = p0.y - 2 * p1.y + p2.y
    const by = p1.y - p0.y
    if (ay !== 0) {
        const ty = by / ay
        if (ty > 0 && ty < 1 && !roots.includes(ty)) {
            roots.push(ty)
        }
    }

    return roots.sort((a, b) => a - b)
}

export function getQuadraticBezierBounds(p0: PointLike, p1: PointLike, p2: PointLike): BoundingRect {
    const extrema = getQuadraticBezierExtremaRoots(p0, p1, p2)
    const points: PointLike[] = [p0, p2]

    for (const t of extrema) {
        points.push(getQuadraticBezierEvaluate(t, p0, p1, p2))
    }

    return  BoundingRect.default().fromPoints(points)
}

/**
 * 计算二次贝塞尔曲线的多项式系数
 * P(t) = a·t² + b·t + c
 */
export function getQuadraticCoefficients(p0:PointLike, p1:PointLike, p2:PointLike): {
    ax: number; ay: number;
    bx: number; by: number;
    cx: number; cy: number;
} {

    // 二次项系数：a = P0 - 2·P1 + P2
    const ax = p0.x - 2 * p1.x + p2.x;
    const ay = p0.y - 2 * p1.y + p2.y;
    
    // 一次项系数：b = -2·P0 + 2·P1
    const bx = -2 * p0.x + 2 * p1.x;
    const by = -2 * p0.y + 2 * p1.y;
    
    // 常数项：c = P0
    const cx = p0.x;
    const cy = p0.y;
    
    return { ax, ay, bx, by, cx, cy };
}



export class QuadraticBezier {
    points: PointLike[]
    constructor(points: PointLike[]) {
        this.points = points.map(p=>({x:p.x,y:p.y}))
    }
    get p0() {
        return this.points[0]
    }
    get p1() {
        return this.points[1]
    }
    get p2() {
        return this.points[2]
    }
    // 计算贝塞尔曲线上的点
    evaluate(t: number) {
        return getQuadraticBezierEvaluate(t, this.p0, this.p1, this.p2)
    }

    // 获取极值的根（t值）
    getExtremaRoots(): number[] {
        return getQuadraticBezierExtremaRoots(this.p0, this.p1, this.p2)
    }

    // 获取边界框
    getBounds(): BoundingRect {
        return getQuadraticBezierBounds(this.p0, this.p1, this.p2)
    }
    /**
     * 在参数 t 处分割二次贝塞尔曲线
     * @param t - 分割参数 [0, 1]
     * @returns [左半曲线, 右半曲线]
     */
    split(t: number): [QuadraticBezier, QuadraticBezier] {
        const { p0, p1, p2 } = this
        const mt = 1 - t

        // 德卡斯特里奥（De Casteljau）算法
        const a = { x: mt * p0.x + t * p1.x, y: mt * p0.y + t * p1.y }
        const b = { x: mt * p1.x + t * p2.x, y: mt * p1.y + t * p2.y }
        const c = { x: mt * a.x + t * b.x, y: mt * a.y + t * b.y }

        return [
            new QuadraticBezier([p0, a, c]),
            new QuadraticBezier([c, b, p2]),
        ]
    }

    /**
     * 将二次贝塞尔曲线扁平化为线段序列
     * @param epsilon - 近似误差容限（默认 0.5）
     * @returns PointLike[] 点序列（包含起点和终点）
     */
    flatten(epsilon = 0.5): PointLike[] {
        const points: PointLike[] = [this.p0]

        const recursive = (p0: PointLike, p1: PointLike, p2: PointLike) => {
            // 判断曲线是否足够平坦：控制点到弦的距离 < epsilon
            const vx = p2.x - p0.x
            const vy = p2.y - p0.y
            const len2 = vx * vx + vy * vy
            if (len2 <= 1e-20) {
                // 弦长为零（p0 与 p2 重合）：用控制点跨度判断
                const cpLen2 = (p1.x - p0.x) ** 2 + (p1.y - p0.y) ** 2
                if (cpLen2 <= epsilon * epsilon) {
                    points.push(p2)
                    return
                }
            } else {
                const t = ((p1.x - p0.x) * vx + (p1.y - p0.y) * vy) / len2
                const tClamped = Math.max(0, Math.min(1, t))
                const px = p0.x + tClamped * vx
                const py = p0.y + tClamped * vy
                const dx = p1.x - px
                const dy = p1.y - py
                if (dx * dx + dy * dy < epsilon * epsilon) {
                    points.push(p2)
                    return
                }
            }

            // 在 t=0.5 处分割并递归
            const mt = 0.5
            const a = { x: (p0.x + p1.x) * mt, y: (p0.y + p1.y) * mt }
            const b = { x: (p1.x + p2.x) * mt, y: (p1.y + p2.y) * mt }
            const c = { x: (a.x + b.x) * mt, y: (a.y + b.y) * mt }

            recursive(p0, a, c)
            recursive(c, b, p2)
        }

        recursive(this.p0, this.p1, this.p2)
        return points
    }

    /**
     * 计算点到二次贝塞尔曲线的最小距离
     * @param px - 点 X
     * @param py - 点 Y
     * @returns 点到曲线的最小距离
     */
    distanceTo(px: number, py: number): number {
        const { p0, p1, p2 } = this

        // Q(t) = A·t² + B·t + C
        // A = P0 - 2P1 + P2, B = 2(P1 - P0), C = P0
        const ax = p0.x - 2 * p1.x + p2.x
        const ay = p0.y - 2 * p1.y + p2.y
        const bx = 2 * (p1.x - p0.x)
        const by = 2 * (p1.y - p0.y)
        const cx = p0.x - px
        const cy = p0.y - py

        // 最小化 |Q(t) - P|² → 求导得三次方程
        // (2A·A)t³ + (3A·B)t² + (2A·C + B·B)t + B·C = 0
        const a = 2 * (ax * ax + ay * ay)
        const b = 3 * (ax * bx + ay * by)
        const c = 2 * (ax * cx + ay * cy) + (bx * bx + by * by)
        const d = bx * cx + by * cy

        // 提取实根并加入端点候选
        const candidates = solveCubicByCardano(a, b, c, d)
        candidates.push(0, 1)

        let minDist2 = Infinity
        for (const t of candidates) {
            if (t < 0 || t > 1) continue
            const mt = 1 - t
            const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x
            const y = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
            const dx = x - px, dy = y - py
            const d2 = dx * dx + dy * dy
            if (d2 < minDist2) minDist2 = d2
        }

        return Math.sqrt(minDist2)
    }

    /**
     * 计算点在二次贝塞尔曲线上的投影点（最近点）
     * @param px - 点 X
     * @param py - 点 Y
     * @returns 曲线上距离给定点最近的点
     */
    projectPoint(px: number, py: number): PointLike {
        const { p0, p1, p2 } = this

        // 将曲线表示为 Q(t) = A·t² + B·t + C
        // A = P0 - 2P1 + P2, B = 2(P1 - P0), C = P0
        const ax = p0.x - 2 * p1.x + p2.x
        const ay = p0.y - 2 * p1.y + p2.y
        const bx = 2 * (p1.x - p0.x)
        const by = 2 * (p1.y - p0.y)
        // 平移坐标系，将目标点移到原点：C' = P0 - P
        const cx = p0.x - px
        const cy = p0.y - py

        // 最小化距离平方 |Q(t) - P|²，对 t 求导得三次方程
        // (2A·A)t³ + (3A·B)t² + (2A·C + B·B)t + B·C = 0
        const a = 2 * (ax * ax + ay * ay)
        const b = 3 * (ax * bx + ay * by)
        const c = 2 * (ax * cx + ay * cy) + (bx * bx + by * by)
        const d = bx * cx + by * cy

        // 解三次方程获取极小值候选 t，并加入端点 0、1
        const candidates = solveCubicByCardano(a, b, c, d)
        candidates.push(0, 1)

        // 在所有候选中找出距离最小的 t
        let bestT = 0
        let minDist2 = Infinity
        for (const t of candidates) {
            if (t < 0 || t > 1) continue
            const mt = 1 - t
            const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x
            const y = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
            const dx = x - px, dy = y - py
            const d2 = dx * dx + dy * dy
            if (d2 < minDist2) {
                minDist2 = d2
                bestT = t
            }
        }

        // 用最优 t 计算曲线上的投影点
        const mt = 1 - bestT
        return {
            x: mt * mt * p0.x + 2 * mt * bestT * p1.x + bestT * bestT * p2.x,
            y: mt * mt * p0.y + 2 * mt * bestT * p1.y + bestT * bestT * p2.y,
        }
    }
}