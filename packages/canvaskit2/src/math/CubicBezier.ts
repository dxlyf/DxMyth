import { solveCubicByCardano, solveQuadratic } from "./MathUtils"
import { type PointLike, Point } from "./Point"
import { BoundingRect } from './BoundingRect'


export function getCubicBezierEvaluate(t: number, p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike): PointLike {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;
    return Point.create(
        mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
        mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y
    )
}
export function getCubicBezierBounds(p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike): BoundingRect {
    const extrema = getCubicBezierExtremaRoots(p0, p1, p2, p3);
    const points: PointLike[] = [p0, p3];

    // 添加极值点
    for (const t of extrema) {
        points.push(getCubicBezierEvaluate(t,p0,p1,p2,p3));
    }

    return  BoundingRect.default().fromPoints(points);
}
export function getCubicBezierExtremaRoots(p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike): number[] {

    const roots: number[] = [];

    // 三次贝塞尔曲线的导数为二次
    // B(t) = (1-t)^3 * P0 + 3t(1-t)^2 * P1 + 3t^2(1-t) * P2 + t^3 * P3
    // B'(t) = 3(1-t)^2(P1-P0) + 6t(1-t)(P2-P1) + 3t^2(P3-P2)
    // 整理得：3[(P0-3P1+3P2-P3)t^2 + 2(-P0+2P1-P2)t + (P1-P0)] = 0

    const ax = 3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x);
    const bx = 6 * (p0.x - 2 * p1.x + p2.x);
    const cx = 3 * (p1.x - p0.x);

    const xRoots = solveQuadratic(ax, bx, cx);
    for (const t of xRoots) {
        if (t > 0 && t < 1) {
            roots.push(t);
        }
    }

    const ay = 3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y);
    const by = 6 * (p0.y - 2 * p1.y + p2.y);
    const cy = 3 * (p1.y - p0.y);

    const yRoots = solveQuadratic(ay, by, cy);
    for (const t of yRoots) {
        if (t > 0 && t < 1 && !roots.includes(t)) {
            roots.push(t);
        }
    }
    return roots.sort((a, b) => a - b);

}

 
/**
 * 计算三次贝塞尔曲线的多项式系数
 * P(t) = a·t³ + b·t² + c·t + d
 */
export function getCubicCoefficients(p0:PointLike, p1:PointLike, p2:PointLike, p3:PointLike): {
    ax: number; ay: number;
    bx: number; by: number;
    cx: number; cy: number;
    dx: number; dy: number;
} {
  
    // 三次项系数：a = -P0 + 3·P1 - 3·P2 + P3
    const ax = -p0.x + 3 * p1.x - 3 * p2.x + p3.x;
    const ay = -p0.y + 3 * p1.y - 3 * p2.y + p3.y;
    
    // 二次项系数：b = 3·P0 - 6·P1 + 3·P2
    const bx = 3 * p0.x - 6 * p1.x + 3 * p2.x;
    const by = 3 * p0.y - 6 * p1.y + 3 * p2.y;
    
    // 一次项系数：c = -3·P0 + 3·P1
    const cx = -3 * p0.x + 3 * p1.x;
    const cy = -3 * p0.y + 3 * p1.y;
    
    // 常数项：d = P0
    const dx = p0.x;
    const dy = p0.y;
    
    return { ax, ay, bx, by, cx, cy, dx, dy };
}

export class CubicBezier {
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
    get p3() {
        return this.points[3]
    }
    // 计算贝塞尔曲线上的点
    evaluate(t: number) {
        return getCubicBezierEvaluate(t, this.p0, this.p1, this.p2, this.p3)
    }

    // 获取极值的根（t值）
    getExtremaRoots(): number[] {
       return getCubicBezierExtremaRoots(this.p0, this.p1, this.p2, this.p3)
    }

    // 获取边界框
    getBounds(): BoundingRect {
        return getCubicBezierBounds(this.p0, this.p1, this.p2, this.p3)
    }
    /**
     * 在参数 t 处分割三次贝塞尔曲线
     * @param t - 分割参数 [0, 1]
     * @returns [左半曲线, 右半曲线]
     */
    split(t: number): [CubicBezier, CubicBezier] {
        const { p0, p1, p2, p3 } = this
        const mt = 1 - t

        // 德卡斯特里奥（De Casteljau）算法
        const a = { x: mt * p0.x + t * p1.x, y: mt * p0.y + t * p1.y }
        const b = { x: mt * p1.x + t * p2.x, y: mt * p1.y + t * p2.y }
        const c = { x: mt * p2.x + t * p3.x, y: mt * p2.y + t * p3.y }
        const d = { x: mt * a.x + t * b.x, y: mt * a.y + t * b.y }
        const e = { x: mt * b.x + t * c.x, y: mt * b.y + t * c.y }
        const f = { x: mt * d.x + t * e.x, y: mt * d.y + t * e.y }

        return [
            new CubicBezier([p0, a, d, f]),
            new CubicBezier([f, e, c, p3]),
        ]
    }

    /**
     * 将三次贝塞尔曲线扁平化为线段序列
     * @param epsilon - 近似误差容限（默认 0.5）
     * @returns PointLike[] 点序列（包含起点和终点）
     */
    flatten(epsilon = 0.5): PointLike[] {
        const points: PointLike[] = [this.p0]

        const recursive = (p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike) => {
            // 判断曲线是否足够平坦：弦与中间控制点的最大距离 < epsilon
            const dx = p3.x - p0.x
            const dy = p3.y - p0.y
            const len2 = dx * dx + dy * dy

            // 弦长为零（p0 与 p3 重合）：若控制点也重合则已退化，否则用控制点跨度判断
            if (len2 <= 1e-20) {
                const cpLen2 = (p1.x - p0.x) ** 2 + (p1.y - p0.y) ** 2 + (p2.x - p0.x) ** 2 + (p2.y - p0.y) ** 2
                if (cpLen2 <= epsilon * epsilon) {
                    points.push(p3)
                    return
                }
            } else {
                // 控制点到弦的距离近似
                const d1 = Math.abs((p1.x - p3.x) * dy - (p1.y - p3.y) * dx) / Math.sqrt(len2)
                const d2 = Math.abs((p2.x - p3.x) * dy - (p2.y - p3.y) * dx) / Math.sqrt(len2)
                if (d1 <= epsilon && d2 <= epsilon) {
                    points.push(p3)
                    return
                }
            }

            // 在 t=0.5 处分割并递归
            const mt = 0.5
            const a = { x: (p0.x + p1.x) * mt, y: (p0.y + p1.y) * mt }
            const b = { x: (p1.x + p2.x) * mt, y: (p1.y + p2.y) * mt }
            const c = { x: (p2.x + p3.x) * mt, y: (p2.y + p3.y) * mt }
            const d = { x: (a.x + b.x) * mt, y: (a.y + b.y) * mt }
            const e = { x: (b.x + c.x) * mt, y: (b.y + c.y) * mt }
            const f = { x: (d.x + e.x) * mt, y: (d.y + e.y) * mt }

            recursive(p0, a, d, f)
            recursive(f, e, c, p3)
        }

        recursive(this.p0, this.p1, this.p2, this.p3)
        return points
    }

    /**
     * 计算点到三次贝塞尔曲线的最小距离
     *
     * 三次贝塞尔的最小距离问题导数为五次方程，无解析解。
     * 采用采样 + Newton 迭代逼近：
     *   1. 均匀采样 N 个点，取最近点的 t 值
     *   2. 在该 t 附近用 Newton 法迭代求精
     *
     * @param px - 点 X
     * @param py - 点 Y
     * @param samples - 采样点数（默认 12）
     * @param iterations - Newton 迭代次数（默认 8）
     * @returns 点到曲线的最小距离
     */
    distanceTo(px: number, py: number, samples = 12, iterations = 8): number {
        const { p0, p1, p2, p3 } = this

        // 系数表示：C(t) = a·t³ + b·t² + c·t + d
        const ax = -p0.x + 3 * p1.x - 3 * p2.x + p3.x
        const ay = -p0.y + 3 * p1.y - 3 * p2.y + p3.y
        const bx = 3 * p0.x - 6 * p1.x + 3 * p2.x
        const by = 3 * p0.y - 6 * p1.y + 3 * p2.y
        const cx = -3 * p0.x + 3 * p1.x
        const cy = -3 * p0.y + 3 * p1.y
        const dx = p0.x - px
        const dy = p0.y - py

        // C'(t) = 3a·t² + 2b·t + c
        const ddx = 3 * ax, ddy = 3 * ay
        const ddx2 = ddx * 2, ddy2 = ddy * 2
        // C''(t) = 6a·t + 2b
        const nddx = 6 * ax, nddy = 6 * ay
        const nddx2 = 2 * bx * 2, nddy2 = 2 * by * 2

        // 粗采样找最佳初始 t
        let bestT = 0
        let minDist2 = Infinity

        for (let i = 0; i <= samples; i++) {
            const t = i / samples
            const mt = 1 - t
            const mt2 = mt * mt
            const mt3 = mt2 * mt
            const t2 = t * t
            const t3 = t2 * t
            const x = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x - px
            const y = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y - py
            const d2 = x * x + y * y
            if (d2 < minDist2) {
                minDist2 = d2
                bestT = t
            }
        }

        // Newton 迭代：f(t) = (C(t)-P)·C'(t) = 0
        // t_{n+1} = t - f(t) / f'(t)
        // f'(t) = C'(t)·C'(t) + (C(t)-P)·C''(t)
        let t = bestT

        for (let i = 0; i < iterations; i++) {
            // C(t) - P
            const mt = 1 - t
            const mt2 = mt * mt
            const mt3 = mt2 * mt
            const t2 = t * t
            const t3 = t2 * t
            const fx = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x - px
            const fy = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y - py

            // C'(t)
            const ddx_t = ddx * t2 + ddx2 * t + cx
            const ddy_t = ddy * t2 + ddy2 * t + cy

            // C''(t)
            const nddx_t = nddx * t + nddx2
            const nddy_t = nddy * t + nddy2

            // f(t) = (C-P)·C'
            const ft = fx * ddx_t + fy * ddy_t
            // f'(t) = C'·C' + (C-P)·C''
            const ft2 = ddx_t * ddx_t + ddy_t * ddy_t + fx * nddx_t + fy * nddy_t

            if (Math.abs(ft2) < 1e-15) break
            t = t - ft / ft2
            t = Math.max(0, Math.min(1, t))
        }

        // 用最终 t 计算距离
        {
            const mt = 1 - t
            const x = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x - px
            const y = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y - py
            const d2 = x * x + y * y
            if (d2 < minDist2) minDist2 = d2
        }

        // 检查端点
        const d0x = p0.x - px, d0y = p0.y - py
        const d3x = p3.x - px, d3y = p3.y - py
        minDist2 = Math.min(minDist2, d0x * d0x + d0y * d0y, d3x * d3x + d3y * d3y)

        return Math.sqrt(minDist2)
    }

    /**
     * 计算点在三次贝塞尔曲线上的投影点（最近点）
     *
     * 采用采样 + Newton 迭代逼近：
     *   1. 均匀采样 N 个点，取最近点的 t 值
     *   2. 在该 t 附近用 Newton 法迭代求精
     *   3. 比较端点，取最近者
     *
     * @param px - 点 X
     * @param py - 点 Y
     * @param samples - 采样点数（默认 12）
     * @param iterations - Newton 迭代次数（默认 8）
     * @returns 曲线上距离给定点最近的点
     */
    projectPoint(px: number, py: number, samples = 12, iterations = 8): PointLike {
        const { p0, p1, p2, p3 } = this

        // 系数表示：C(t) = a·t³ + b·t² + c·t + d
        const ax = -p0.x + 3 * p1.x - 3 * p2.x + p3.x
        const ay = -p0.y + 3 * p1.y - 3 * p2.y + p3.y
        const bx = 3 * p0.x - 6 * p1.x + 3 * p2.x
        const by = 3 * p0.y - 6 * p1.y + 3 * p2.y
        const cx = -3 * p0.x + 3 * p1.x
        const cy = -3 * p0.y + 3 * p1.y

        // C'(t) = 3a·t² + 2b·t + c
        const ddx = 3 * ax, ddy = 3 * ay
        const ddx2 = ddx * 2, ddy2 = ddy * 2
        // C''(t) = 6a·t + 2b
        const nddx = 6 * ax, nddy = 6 * ay
        const nddx2 = 2 * bx * 2, nddy2 = 2 * by * 2

        // 粗采样找最佳初始 t
        let bestT = 0
        let minDist2 = Infinity

        for (let i = 0; i <= samples; i++) {
            const t = i / samples
            const mt = 1 - t
            const mt2 = mt * mt
            const mt3 = mt2 * mt
            const t2 = t * t
            const t3 = t2 * t
            const x = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x - px
            const y = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y - py
            const d2 = x * x + y * y
            if (d2 < minDist2) {
                minDist2 = d2
                bestT = t
            }
        }

        // Newton 迭代：f(t) = (C(t)-P)·C'(t) = 0
        let t = bestT

        for (let i = 0; i < iterations; i++) {
            const mt = 1 - t
            const mt2 = mt * mt
            const mt3 = mt2 * mt
            const t2 = t * t
            const t3 = t2 * t
            const fx = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x - px
            const fy = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y - py

            // C'(t)
            const ddx_t = ddx * t2 + ddx2 * t + cx
            const ddy_t = ddy * t2 + ddy2 * t + cy

            // C''(t)
            const nddx_t = nddx * t + nddx2
            const nddy_t = nddy * t + nddy2

            // f(t) = (C-P)·C'
            const ft = fx * ddx_t + fy * ddy_t
            // f'(t) = C'·C' + (C-P)·C''
            const ft2 = ddx_t * ddx_t + ddy_t * ddy_t + fx * nddx_t + fy * nddy_t

            if (Math.abs(ft2) < 1e-15) break
            t = t - ft / ft2
            t = Math.max(0, Math.min(1, t))
        }

        // 用最终 t 计算距离平方，并与端点比较
        {
            const mt = 1 - t
            const x = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x - px
            const y = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y - py
            const d2 = x * x + y * y
            if (d2 < minDist2) {
                minDist2 = d2
                bestT = t
            }
        }

        // 检查端点是否更近
        const d0x = p0.x - px, d0y = p0.y - py
        const d3x = p3.x - px, d3y = p3.y - py
        const d02 = d0x * d0x + d0y * d0y
        const d32 = d3x * d3x + d3y * d3y
        if (d02 < minDist2) {
            minDist2 = d02
            bestT = 0
        }
        if (d32 < minDist2) {
            bestT = 1
        }

        // 用最优 t 计算曲线上的投影点
        const mt = 1 - bestT
        return {
            x: mt * mt * mt * p0.x + 3 * mt * mt * bestT * p1.x + 3 * mt * bestT * bestT * p2.x + bestT * bestT * bestT * p3.x,
            y: mt * mt * mt * p0.y + 3 * mt * mt * bestT * p1.y + 3 * mt * bestT * bestT * p2.y + bestT * bestT * bestT * p3.y,
        }
    }
}