import { solveCubicByCardano,solveQuadratic } from "./MathUtils"
import { PointLike } from "./Point"

function windCubicBezier(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike) {
    const minY = Math.min(p0.y,p1.y,p2.y, p3.y)
    const maxY = Math.max(p0.y,p1.y,p2.y, p3.y)
    if (py < minY || py > maxY) return 0

    // y(t) = (1-t)³·y0 + 3t(1-t)²·y1 + 3t²(1-t)·y2 + t³·y3
    // 整理得：ay·t³ + by·t² + cy·t + dy = 0
    // ay = y3 - 3y2 + 3y1 - y0
    // by = 3(y2 - 2y1 + y0)
    // cy = 3(y1 - y0)
    // dy = y0 - py
    const cay = p3.y - 3 * p2.y + 3 * p1.y - p0.y
    const cby = 3 * (p2.y - 2 * p1.y + p0.y)
    const ccy = 3 * (p1.y - p0.y)
    const cdy = p0.y - py

    const roots = solveCubicByCardano(cay, cby, ccy, cdy)
    let wind = 0

    for (const t of roots) {
        if (t <= 0 || t >= 1) continue

        const mt = 1 - t
        const mt2 = mt * mt
        const mt3 = mt2 * mt
        const t2 = t * t
        const t3 = t2 * t
        const x = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x
        if (x < px) continue

        // dy/dt = 3·ay·t² + 2·by·t + cy
        const dydt = 3 * cay * t2 + 2 * cby * t + ccy
        if (dydt > 0) wind += 1
        else if (dydt < 0) wind -= 1
    }

    return wind
}

function windQuadraticBezier(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike): number {
    const minY = Math.min(p0.y,p1.y, p2.y)
    const maxY = Math.max(p0.y,p1.y, p2.y)
    if (py < minY || py > maxY) return 0

    // y(t) = (1-t)²·y0 + 2t(1-t)·y1 + t²·y2
    // 整理得：ay·t² + by·t + cy = 0
    // ay = y0 - 2y1 + y2, by = 2(y1 - y0), cy = y0 - py
    const ay = p0.y - 2 * p1.y + p2.y
    const by = 2 * (p1.y - p0.y)
    const cy = p0.y - py

    const roots = solveQuadratic(ay, by, cy)
    let wind = 0

    for (const t of roots) {
        if (t <= 0 || t >= 1) continue

        // x(t) = (1-t)²·x0 + 2t(1-t)·x1 + t²·x2
        const mt = 1 - t
        const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x
        if (x < px) continue // 在射线左侧

        // dy/dt = 2·ay·t + by
        const dy = 2 * ay * t + by
        if (dy > 0) wind += 1      // 从下往上穿过
        else if (dy < 0) wind -= 1 // 从上往下穿过
    }

    return wind
}

function windLine(x: number, y: number, x0: number, y0: number, x1: number, y1: number): number {
    // 水平线段：射线与线段平行，不贡献绕数
    if (y0 === y1) return 0

    // 半开区间 [min, max)：射线穿过顶点时只被一端计入，避免重复计数
    if (y < Math.min(y0, y1) || y >= Math.max(y0, y1)) return 0

    // 计算线段在 y 处的交点 x 坐标，若交点在射线左侧则计数
    if (x <= x0 + (x1 - x0) * (y - y0) / (y1 - y0)) {
        // 从下往上穿 → +1，从上往下穿 → -1
        return y1 > y0 ? 1 : -1
    }
    return 0
}

export {
    windLine,
    windQuadraticBezier,
    windCubicBezier,
}