import { solveCubicByCardano,solveQuadratic } from "./MathUtils"
import { PointLike } from "./Point"

function windingCubicBezier(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike) {
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

function windingQuadraticBezier(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike): number {
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

function windingLine(x: number, y: number, x0: number, y0: number, x1: number, y1: number): number {
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

/**
 * 判断 conic（有理二次贝塞尔）对射线 (px,py)→(+x) 的绕数贡献
 * C(t) = N(t)/D(t)，由 y(t)=py 解二次方程得交点参数 t
 * @param px 射线起点 x
 * @param py 射线起点 y
 * @param p0 起点控制点
 * @param p1 中间控制点
 * @param p2 终点控制点
 * @param w  权重（P0/P2 权重恒为 1）
 */
function windingConic(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike, w: number): number {
    // 正权重下曲线位于控制点凸包内，可先做 y 范围裁剪
    const minY = Math.min(p0.y, p1.y, p2.y)
    const maxY = Math.max(p0.y, p1.y, p2.y)
    if (py < minY || py > maxY) return 0

    // 分子 N(t) = nA·t² + nB·t + nC（x/y 两轴）
    const nAx = p2.x - 2 * w * p1.x + p0.x, nAy = p2.y - 2 * w * p1.y + p0.y
    const nBx = 2 * (w * p1.x - p0.x), nBy = 2 * (w * p1.y - p0.y)
    const nCx = p0.x, nCy = p0.y
    // 分母 D(t) = dA·t² + dB·t + dC
    const dA = 2 * (1 - w), dB = 2 * (w - 1), dC = 1

    // y(t) = py → (nAy - py·dA)·t² + (nBy - py·dB)·t + (nCy - py·dC) = 0
    const roots = solveQuadratic(nAy - py * dA, nBy - py * dB, nCy - py * dC)
    let wind = 0

    for (const t of roots) {
        if (t <= 0 || t >= 1) continue
        const tt = t * t
        const d = dA * tt + dB * t + dC
        const x = (nAx * tt + nBx * t + nCx) / d
        if (x < px) continue // 交点在射线左侧

        // dy/dt 的符号 = (N'D - ND') 的 y 分量（分母 D² 恒正，忽略）
        const dy = (2 * nAy * t + nBy) * d - (nAy * tt + nBy * t + nCy) * (2 * dA * t + dB)
        if (dy > 0) wind += 1
        else if (dy < 0) wind -= 1
    }

    return wind
}

/**
 * 判断点是否在线段上（含端点），误差容差 epsilon
 * 垂足条件：P 在线段上的投影点与 P 的距离 ≤ epsilon
 */
function tangentLine(px: number, py: number, x0: number, y0: number, x1: number, y1: number, epsilon: number = 1e-6): boolean {
    const vx = x1 - x0, vy = y1 - y0
    const len2 = vx * vx + vy * vy
    const e2 = epsilon * epsilon
    if (len2 < 1e-20) {
        // 退化为点
        const dx = px - x0, dy = py - y0
        return dx * dx + dy * dy <= e2
    }
    // 垂足参数 t，裁剪到 [0,1]
    let t = ((px - x0) * vx + (py - y0) * vy) / len2
    if (t < 0) t = 0
    else if (t > 1) t = 1
    const fx = x0 + t * vx, fy = y0 + t * vy
    const dx = px - fx, dy = py - fy
    return dx * dx + dy * dy <= e2
}



/**
 * 判断点是否在二次贝塞尔曲线上，误差容差 epsilon
 * 切线条件：最近点满足 (P - Q(t))·Q'(t) = 0，
 * 对二次曲线该式为 t 的三次方程，用 Cardano 解析求解
 */
function tangentQuad(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike, epsilon: number = 1e-6): boolean {
    const e2 = epsilon * epsilon
    // 幂基：Q(t) = a·t² + b·t + c
    const ax = p0.x - 2 * p1.x + p2.x, ay = p0.y - 2 * p1.y + p2.y
    const bx = 2 * (p1.x - p0.x), by = 2 * (p1.y - p0.y)
    const cx = p0.x, cy = p0.y
    // d = P - c
    const dx = px - cx, dy = py - cy

    // (P - Q(t))·Q'(t) = 0 展开为三次：
    // 2(a·a)t³ + 3(a·b)t² + [(b·b) - 2(d·a)]t - (d·b) = 0
    const aa = ax * ax + ay * ay
    const ab = ax * bx + ay * by
    const bb = bx * bx + by * by
    const da = dx * ax + dy * ay
    const db = dx * bx + dy * by
    const roots = solveCubicByCardano(2 * aa, 3 * ab, bb - 2 * da, -db)

    let minD2 = Infinity
    for (const t of roots) {
        if (t < 0 || t > 1) continue
        const mt = 1 - t
        const qx = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x
        const qy = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
        const ox = px - qx, oy = py - qy
        const d2 = ox * ox + oy * oy
        if (d2 < minD2) minD2 = d2
    }
    // 端点 t=0 / t=1
    for (const [ex, ey] of [[p0.x, p0.y], [p2.x, p2.y]] as [number, number][]) {
        const ox = px - ex, oy = py - ey
        const d2 = ox * ox + oy * oy
        if (d2 < minD2) minD2 = d2
    }
    return minD2 <= e2
}


/**
 * 判断点是否在三次贝塞尔曲线上，误差容差 epsilon
 * 切线条件：(P - Q(t))·Q'(t) = 0 是 t 的五次方程（无解析解），
 * 用均匀采样取最近初值，再牛顿迭代精化
 */
function tangentCubic(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike, epsilon: number = 1e-6): boolean {
    const e2 = epsilon * epsilon
    // 幂基：Q(t) = c0 + c1·t + c2·t² + c3·t³
    const c0x = p0.x, c0y = p0.y
    const c1x = 3 * (p1.x - p0.x), c1y = 3 * (p1.y - p0.y)
    const c2x = 3 * (p2.x - 2 * p1.x + p0.x), c2y = 3 * (p2.y - 2 * p1.y + p0.y)
    const c3x = p3.x - 3 * p2.x + 3 * p1.x - p0.x, c3y = p3.y - 3 * p2.y + 3 * p1.y - p0.y

    const evalQ = (t: number): [number, number, number, number] => {
        // 返回 Q(t) 与 Q'(t)
        const qx = c0x + t * (c1x + t * (c2x + t * c3x))
        const qy = c0y + t * (c1y + t * (c2y + t * c3y))
        const qpx = c1x + t * (2 * c2x + t * 3 * c3x)
        const qpy = c1y + t * (2 * c2y + t * 3 * c3y)
        return [qx, qy, qpx, qpy]
    }

    // 均匀采样取最近点作为牛顿初值
    const N = 16
    let t = 0, bestD2 = Infinity
    for (let i = 0; i <= N; i++) {
        const s = i / N
        const [qx, qy] = evalQ(s)
        const ox = px - qx, oy = py - qy
        const d2 = ox * ox + oy * oy
        if (d2 < bestD2) { bestD2 = d2; t = s }
    }

    // 牛顿迭代：g(t) = (P - Q)·Q' = 0
    // g'(t) = -|Q'|² + (P - Q)·Q''
    for (let i = 0; i < 12; i++) {
        const [qx, qy, qpx, qpy] = evalQ(t)
        const ox = px - qx, oy = py - qy
        // Q''(t) = 2c2 + 6c3·t
        const qppx = 2 * c2x + 6 * c3x * t
        const qppy = 2 * c2y + 6 * c3y * t
        const g = ox * qpx + oy * qpy
        const gp = -(qpx * qpx + qpy * qpy) + (ox * qppx + oy * qppy)
        if (Math.abs(gp) < 1e-20) break
        t -= g / gp
        if (t < 0) t = 0
        else if (t > 1) t = 1
        if (Math.abs(g) < 1e-14) break
    }

    // 精化后的最近点距离
    const [qx, qy] = evalQ(t)
    const ox = px - qx, oy = py - qy
    let minD2 = ox * ox + oy * oy
    // 端点 t=0 / t=1
    for (const [ex, ey] of [[p0.x, p0.y], [p3.x, p3.y]] as [number, number][]) {
        const odx = px - ex, ody = py - ey
        const d2 = odx * odx + ody * ody
        if (d2 < minD2) minD2 = d2
    }
    return minD2 <= e2
}



/**
 * 判断点是否在 conic（有理二次贝塞尔）曲线上，误差容差 epsilon
 * C(t) = N(t)/D(t)，切线条件 (P - C(t))·C'(t) = 0 展开为 t 的五次方程（无解析解），
 * 用均匀采样取最近初值，再牛顿迭代精化。
 * 注意乘以正因子 D⁴ 消去分母：g = (P·D - N)·(N'D - ND')，其零点与 g 在 [0,1] 上一致（D>0）
 */
function tangentConic(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike, w: number, epsilon: number = 1e-6): boolean {
    const e2 = epsilon * epsilon
    // 分子 N(t) = nA·t² + nB·t + nC（x/y 两轴）
    const nAx = p2.x - 2 * w * p1.x + p0.x, nAy = p2.y - 2 * w * p1.y + p0.y
    const nBx = 2 * (w * p1.x - p0.x), nBy = 2 * (w * p1.y - p0.y)
    const nCx = p0.x, nCy = p0.y
    // 分母 D(t) = dA·t² + dB·t + dC
    const dA = 2 * (1 - w), dB = 2 * (w - 1), dC = 1
    // N'' = 2·nA，D'' = 2·dA（常量）
    const nppx = 2 * nAx, nppy = 2 * nAy, dpp = 2 * dA

    // 均匀采样取最近点作为牛顿初值（直接求 C(t) = N/D 的坐标）
    const N = 16
    let t = 0, bestD2 = Infinity
    for (let i = 0; i <= N; i++) {
        const s = i / N, ss = s * s
        const d = dA * ss + dB * s + dC
        const qx = (nAx * ss + nBx * s + nCx) / d
        const qy = (nAy * ss + nBy * s + nCy) / d
        const ox = px - qx, oy = py - qy
        const d2 = ox * ox + oy * oy
        if (d2 < bestD2) { bestD2 = d2; t = s }
    }

    // 牛顿迭代：g(t) = F·T，F = P·D - N，T = N'D - ND'（= C'·D²）
    // g'(t) = F'·T + F·T'，F' = P·D' - N'，T' = N''·D - N·D''
    for (let i = 0; i < 12; i++) {
        const tt = t * t
        const d = dA * tt + dB * t + dC
        const dp = 2 * dA * t + dB
        const nx = nAx * tt + nBx * t + nCx, ny = nAy * tt + nBy * t + nCy
        const npx = 2 * nAx * t + nBx, npy = 2 * nAy * t + nBy
        // F = P·D - N
        const fx = px * d - nx, fy = py * d - ny
        // F' = P·D' - N'
        const fpx = px * dp - npx, fpy = py * dp - npy
        // T = N'D - ND'
        const tx = npx * d - nx * dp, ty = npy * d - ny * dp
        // T' = N''·D - N·D''
        const tpx = nppx * d - nx * dpp, tpy = nppy * d - ny * dpp
        const g = fx * tx + fy * ty
        const gp = (fpx * tx + fpy * ty) + (fx * tpx + fy * tpy)
        if (Math.abs(gp) < 1e-20) break
        t -= g / gp
        if (t < 0) t = 0
        else if (t > 1) t = 1
        if (Math.abs(g) < 1e-14) break
    }

    // 精化后的最近点距离
    const tt = t * t
    const d = dA * tt + dB * t + dC
    const qx = (nAx * tt + nBx * t + nCx) / d
    const qy = (nAy * tt + nBy * t + nCy) / d
    const ox = px - qx, oy = py - qy
    let minD2 = ox * ox + oy * oy
    // 端点 t=0 / t=1（即 P0 / P2）
    for (const [ex, ey] of [[p0.x, p0.y], [p2.x, p2.y]] as [number, number][]) {
        const odx = px - ex, ody = py - ey
        const d2 = odx * odx + ody * ody
        if (d2 < minD2) minD2 = d2
    }
    return minD2 <= e2
}

export {
    windingLine,
    windingQuadraticBezier,
    windingCubicBezier,
    windingConic,
    tangentLine,
    tangentQuad,
    tangentCubic,
    tangentConic,
}