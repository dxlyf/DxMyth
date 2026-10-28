import { PointLike } from "./Point"
import { bernstein } from "./MathUtils"

/** 判断浮点数是否接近零 */
const isNearZero = (v: number, eps = 1e-10): boolean => Math.abs(v) <= eps

/** 德卡斯特里奥算法计算 N 阶贝塞尔曲线上参数 t 处的点 */
const deCasteljau = (points: PointLike[], t: number): PointLike => {
    const n = points.length
    if (n === 0) return { x: 0, y: 0 }
    if (n === 1) return { x: points[0].x, y: points[0].y }

    // 迭代线性插值，每次减少一个点
    const work = points.map(p => ({ x: p.x, y: p.y }))
    for (let k = 1; k < n; k++) {
        for (let i = 0; i < n - k; i++) {
            work[i].x += (work[i + 1].x - work[i].x) * t
            work[i].y += (work[i + 1].y - work[i].y) * t
        }
    }
    return work[0]
}

/** 计算 N 阶贝塞尔曲线在 t 处的一阶导数（切向量） */
const derivative = (points: PointLike[], t: number): PointLike => {
    return deCasteljau(derivativeControlPoints(points), t)
}

/** 计算 N 阶贝塞尔曲线一阶导数的控制点（共 n-1 个点） */
const derivativeControlPoints = (points: PointLike[]): PointLike[] => {
    const n = points.length
    if (n < 2) return []
    const dp: PointLike[] = []
    for (let i = 0; i < n - 1; i++) {
        dp.push({
            x: (n - 1) * (points[i + 1].x - points[i].x),
            y: (n - 1) * (points[i + 1].y - points[i].y),
        })
    }
    return dp
}



/** 基于伯恩斯坦基函数计算 N 阶贝塞尔曲线上参数 t 处的点: sum(P[i] * B(i, n, t), i=0..n) */
const evaluate = (points: PointLike[], t: number): PointLike => {
    const n = points.length - 1
    let x = 0
    let y = 0
    for (let i = 0; i <= n; i++) {
        const b = bernstein(i, n, t)
        x += points[i].x * b
        y += points[i].y * b
    }
    return { x, y }
}

/** 基于伯恩斯坦基函数对数值序列求值: Σ values[i] * B(i, n, t) */
const evaluateValues = (values: number[], t: number): number => {
    const n = values.length - 1
    let result = 0
    for (let i = 0; i <= n; i++) {
        result += values[i] * bernstein(i, n, t)
    }
    return result
}

/** 基于伯恩斯坦基函数计算 N 阶贝塞尔曲线在 t 处的一阶导数: n * Σ_{i=0}^{n-1} (P_{i+1} - P_i) * B_{i, n-1}(t) */
const derivative1 = (points: PointLike[], t: number): PointLike => {
    const n = points.length - 1
    if (n < 1) return { x: 0, y: 0 }
    const m = n - 1
    let x = 0, y = 0
    for (let i = 0; i <= m; i++) {
        const b = bernstein(i, m, t)
        x += (points[i + 1].x - points[i].x) * b
        y += (points[i + 1].y - points[i].y) * b
    }
    return { x: x * n, y: y * n }
}

/** 基于伯恩斯坦基函数计算 N 阶贝塞尔曲线在 t 处的 k 阶导数
 *  d^k/dt^k B(t) = n!/(n-k)! * Σ_{i=0}^{n-k} Δ^k P_i * B_{i, n-k}(t)
 */
const derivativeN = (points: PointLike[], k: number, t: number): PointLike => {
    const n = points.length - 1
    if (k <= 0) return evaluate(points, t)
    if (k > n) return { x: 0, y: 0 }

    // 计算 k 阶前向差分 Δ^k P_i
    const diff = points.map(p => ({ x: p.x, y: p.y }))
    for (let order = 0; order < k; order++) {
        for (let i = 0; i < n - order; i++) {
            diff[i].x = diff[i + 1].x - diff[i].x
            diff[i].y = diff[i + 1].y - diff[i].y
        }
    }

    // 阶乘因子: n!/(n-k)!
    const factor = factorial(n) / factorial(n - k)

    // 用降阶后的伯恩斯坦基求和
    const m = n - k
    let x = 0, y = 0
    for (let i = 0; i <= m; i++) {
        const b = bernstein(i, m, t)
        x += diff[i].x * b
        y += diff[i].y * b
    }

    return { x: x * factor, y: y * factor }
}

/** 阶乘 */
const factorial = (n: number): number => {
    let result = 1
    for (let i = 2; i <= n; i++) result *= i
    return result
}

/** 二阶贝塞尔曲线 evaluate */
const quadraticEvaluate = (p0: PointLike, p1: PointLike, p2: PointLike, t: number): PointLike => {
    const mt = 1 - t
    return {
        x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
        y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
    }
}

/** 三阶贝塞尔曲线 evaluate */
const cubicEvaluate = (p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike, t: number): PointLike => {
    const mt = 1 - t
    const mt2 = mt * mt
    const mt3 = mt2 * mt
    const t2 = t * t
    const t3 = t2 * t
    return {
        x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
        y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
    }
}

/** 二阶贝塞尔提升为三阶 */
const quadraticToCubic = (p0: PointLike, p1: PointLike, p2: PointLike): [PointLike, PointLike, PointLike, PointLike] => {
    return [
        { x: p0.x, y: p0.y },
        { x: p0.x / 3 + (2 / 3) * p1.x, y: p0.y / 3 + (2 / 3) * p1.y },
        { x: (2 / 3) * p1.x + p2.x / 3, y: (2 / 3) * p1.y + p2.y / 3 },
        { x: p2.x, y: p2.y },
    ]
}

/**
 * 将任意阶贝塞尔曲线升阶（degree elevation）
 * 升阶后曲线几何形状与原曲线完全一致，仅阶数提高
 * @param points - 原曲线控制点（阶数 = points.length - 1）
 * @param times - 升阶次数（每次阶数 +1），默认 1
 * @returns 升阶后的控制点（个数 = points.length + times）
 */
const elevateDegree = (points: PointLike[], times: number = 1): PointLike[] => {
    let result = points.map(p => ({ x: p.x, y: p.y }))
    for (let t = 0; t < times; t++) {
        const n = result.length - 1
        if (n < 1) return result
        const m = n + 1 // 升阶后的阶数
        const next: PointLike[] = [{ x: result[0].x, y: result[0].y }]
        for (let i = 1; i <= n; i++) {
            const a = i / m
            next.push({
                x: a * result[i - 1].x + (1 - a) * result[i].x,
                y: a * result[i - 1].y + (1 - a) * result[i].y,
            })
        }
        next.push({ x: result[n].x, y: result[n].y })
        result = next
    }
    return result
}

/** 二项式系数 C(n, k)（浮点乘法，避免阶乘溢出） */
const binomial = (n: number, k: number): number => {
    if (k < 0 || k > n) return 0
    const kk = Math.min(k, n - k)
    let r = 1
    for (let i = 1; i <= kk; i++) r = r * (n - kk + i) / i
    return r
}

/**
 * 将任意阶贝塞尔曲线一次提升 N 阶（闭式公式）
 *
 * 升阶次数为 k、原阶数为 n、目标阶数为 m = n + k 时：
 *   Q_i = Σ_{j} [ C(n, j)·C(k, i-j) / C(m, i) ] · P_j
 * 其中 j ∈ [max(0, i-k), min(n, i)]
 *
 * 与逐次调用 elevateDegree 相比，一次计算不累积浮点误差，复杂度也更低。
 *
 * @param points - 原曲线控制点（阶数 = points.length - 1）
 * @param times - 提升的阶数 N（默认 1）
 * @returns 升阶后的控制点（个数 = points.length + times）
 */
const elevateDegreeN = (points: PointLike[], times: number = 1): PointLike[] => {
    const k = Math.floor(times)
    const n = points.length - 1
    if (n < 1 || k <= 0) return points.map(p => ({ x: p.x, y: p.y }))

    const m = n + k
    const result: PointLike[] = []
    for (let i = 0; i <= m; i++) {
        const denom = binomial(m, i)
        const jStart = Math.max(0, i - k)
        const jEnd = Math.min(n, i)
        let x = 0, y = 0
        for (let j = jStart; j <= jEnd; j++) {
            const w = binomial(n, j) * binomial(k, i - j) / denom
            x += w * points[j].x
            y += w * points[j].y
        }
        result.push({ x, y })
    }
    return result
}

/** 贝塞尔曲线的弧长（数值积分 - Simpson 法则） */
const arcLength = (points: PointLike[], segments: number = 16): number => {
    let length = 0
    const dt = 1 / segments
    let prev = deCasteljau(points, 0)
    for (let i = 1; i <= segments; i++) {
        const t = i * dt
        const curr = deCasteljau(points, t)
        const dx = curr.x - prev.x
        const dy = curr.y - prev.y
        length += Math.sqrt(dx * dx + dy * dy)
        prev = curr
    }
    return length
}

/** 贝塞尔曲线上 t 处的法向量（旋转 90° 的归一化切向量） */
const normal = (points: PointLike[], t: number): PointLike => {
    const d = derivative(points, t)
    const len = Math.sqrt(d.x * d.x + d.y * d.y)
    if (len === 0) return { x: 0, y: 0 }
    return { x: -d.y / len, y: d.x / len }
}

/** 贝塞尔曲线在 t 处的曲率 */
const curvature = (points: PointLike[], t: number): number => {
    const n = points.length
    if (n < 3) return 0

    // 一阶和二阶导数
    const d1 = derivative(points, t)

    // 二阶导数的控制点 = (n-1)(n-2) * (P[i+2] - 2P[i+1] + P[i])
    const dp2 = []
    for (let i = 0; i < n - 2; i++) {
        dp2.push({
            x: (n - 1) * (n - 2) * (points[i + 2].x - 2 * points[i + 1].x + points[i].x),
            y: (n - 1) * (n - 2) * (points[i + 2].y - 2 * points[i + 1].y + points[i].y),
        })
    }
    const d2 = dp2.length > 0 ? deCasteljau(dp2, t) : { x: 0, y: 0 }

    // k = |d1 × d2| / |d1|³
    const cross = d1.x * d2.y - d1.y * d2.x
    const lenSq = d1.x * d1.x + d1.y * d1.y
    if (lenSq === 0) return 0
    return Math.abs(cross) / Math.pow(lenSq, 1.5)
}

/**
 * 查找 N 阶贝塞尔曲线的极值 t 值（一阶导数为零处）
 * 对 N<=3 使用解析求解，更高阶使用数值方法
 * @returns 在 (0,1) 区间内的极值 t 值数组（已排序去重）
 */
const extrema = (points: PointLike[]): number[] => {
    const n = points.length - 1
    if (n < 1) return []
    const roots: number[] = []

    const dp = derivativeControlPoints(points) // degree m = n-1

    // 通用方法：采样 + 二分法精炼
    const findRoots = (values: number[]): number[] => {
        const deg = values.length - 1
        const res: number[] = []

        // 采样 sign 变化
        const SAMPLES = Math.max(deg * 4, 20)
        const evaluateAt = (t: number): number => {
            // 用 deCasteljau 计算导数值
            const tmp = values.map(v => v)
            for (let k = 1; k <= deg; k++) {
                for (let i = 0; i <= deg - k; i++) {
                    tmp[i] += (tmp[i + 1] - tmp[i]) * t
                }
            }
            return tmp[0]
        }

        let prev = evaluateAt(0)
        for (let i = 1; i <= SAMPLES; i++) {
            const t = i / SAMPLES
            const curr = evaluateAt(t)
            if (prev * curr < 0 || isNearZero(curr)) {
                // 二分法精炼
                let lo = (i - 1) / SAMPLES, hi = t
                let mid = (lo + hi) / 2
                if (!isNearZero(curr)) {
                    for (let iter = 0; iter < 20; iter++) {
                        mid = (lo + hi) / 2
                        const v = evaluateAt(mid)
                        if (v * evaluateAt(lo) <= 0) hi = mid
                        else lo = mid
                        if (hi - lo < 1e-10) break
                    }
                    if (mid > 0 && mid < 1) res.push(mid)
                } else if (t > 0 && t < 1) {
                    res.push(t)
                }
            }
            prev = curr
        }

        return res
    }

    // x 分量导数的根
    const xValues = dp.map(p => p.x)
    for (const t of findRoots(xValues)) {
        if (t > 0 && t < 1 && !roots.some(r => isNearZero(r - t))) {
            roots.push(t)
        }
    }

    // y 分量导数的根
    const yValues = dp.map(p => p.y)
    for (const t of findRoots(yValues)) {
        if (t > 0 && t < 1 && !roots.some(r => isNearZero(r - t))) {
            roots.push(t)
        }
    }

    return roots.sort((a, b) => a - b)
}

/**
 * 查找贝塞尔曲线上最大曲率处的 t 值
 * @param samples - 初始采样点数（默认 20）
 * @returns 最大曲率对应的 t 值
 */
const maxCurvature = (points: PointLike[], samples: number = 20): number => {
    // 采样找最佳初始值
    let bestT = 0
    let maxK = -Infinity
    for (let i = 0; i <= samples; i++) {
        const t = i / samples
        const k = curvature(points, t)
        if (k > maxK) {
            maxK = k
            bestT = t
        }
    }

    // 黄金分割搜索精炼
    const phi = (Math.sqrt(5) - 1) / 2
    let a = Math.max(0, bestT - 1 / samples)
    let b = Math.min(1, bestT + 1 / samples)
    let c = b - phi * (b - a)
    let d = a + phi * (b - a)
    const fc = curvature(points, c)
    const fd = curvature(points, d)

    for (let iter = 0; iter < 30; iter++) {
        if (Math.abs(b - a) < 1e-10) break
        if (fc > fd) {
            b = d
            d = c
            c = b - phi * (b - a)
        } else {
            a = c
            c = d
            d = a + phi * (b - a)
        }
    }

    return (a + b) / 2
}

/**
 * 计算点到 N 阶贝塞尔曲线的最小距离及对应 t 值
 * 采样 + Newton 迭代精炼
 * @param samples - 采样点数（默认 16）
 * @param iterations - Newton 迭代次数（默认 8）
 * @returns { t, distance } 最近点的 t 值和距离
 */
const project = (points: PointLike[], px: number, py: number, samples: number = 16, iterations: number = 8): { t: number; distance: number } => {
    // 采样找最佳初始 t
    let bestT = 0
    let minDist2 = Infinity

    const evalPt = (t: number): { x: number; y: number } => {
        return deCasteljau(points, t)
    }

    for (let i = 0; i <= samples; i++) {
        const t = i / samples
        const p = evalPt(t)
        const dx = p.x - px
        const dy = p.y - py
        const d2 = dx * dx + dy * dy
        if (d2 < minDist2) {
            minDist2 = d2
            bestT = t
        }
    }

    // Newton 迭代求解 (B(t) - P) · B'(t) = 0
    let t = bestT
    for (let iter = 0; iter < iterations; iter++) {
        const p = evalPt(t)
        const d1 = derivative(points, t)
        const d2 = derivativeN(points, 2, t)

        // f(t) = (B-P) · B'
        const fx = p.x - px, fy = p.y - py
        const ft = fx * d1.x + fy * d1.y
        // f'(t) = B'·B' + (B-P)·B''
        const ft2 = d1.x * d1.x + d1.y * d1.y + fx * d2.x + fy * d2.y

        if (isNearZero(ft2)) break
        t = t - ft / ft2
        t = Math.max(0, Math.min(1, t))
    }

    // 用最终 t 计算距离
    const p = evalPt(t)
    const dx = p.x - px, dy = p.y - py
    const d2 = dx * dx + dy * dy
    if (d2 < minDist2) minDist2 = d2

    // 检查端点
    const p0 = evalPt(0), p1 = evalPt(1)
    const d0x = p0.x - px, d0y = p0.y - py
    const d1x = p1.x - px, d1y = p1.y - py
    const d02 = d0x * d0x + d0y * d0y
    const d12 = d1x * d1x + d1y * d1y

    if (d02 < minDist2) {
        minDist2 = d02
        t = 0
    }
    if (d12 < minDist2) {
        minDist2 = d12
        t = 1
    }

    return { t, distance: Math.sqrt(minDist2) }
}

// 圆锥曲线(有理曲线)转换为二次 Bézier 曲线(有理贝塞尔曲线转换)
function conicToQuadratic(
    x0: number, y0: number,
    x1: number, y1: number,
    x2: number, y2: number,
    w: number
) {
    // 定义原有理曲线的三个控制点
    const P0 = [x0, y0];
    const P1 = [x1, y1];
    const P2 = [x2, y2];

    // 计算左侧中间控制点 Q = (P0 + w*P1) / (1+w)
    const Q = [
        (x0 + w * x1) / (1 + w),
        (y0 + w * y1) / (1 + w)
    ];

    // 计算右侧中间控制点 R = (P2 + w*P1) / (1+w)
    const R = [
        (x2 + w * x1) / (1 + w),
        (y2 + w * y1) / (1 + w)
    ];

    // 计算在 t = 0.5 处的分割点 M = (P0 + 2w*P1 + P2) / (2*(1+w))
    const M = [
        (x0 + 2 * w * x1 + x2) / (2 * (1 + w)),
        (y0 + 2 * w * y1 + y2) / (2 * (1 + w))
    ];

    // 返回两段标准二次 Bézier 曲线
    // 第一段：P0, Q, M
    // 第二段：M, R, P2
    return [
        [P0, Q, M],
        [M, R, P2]
    ]
}

/** 计算控制点包围盒（控制点凸包包含整条曲线） */
const controlPointsBounds = (points: PointLike[]) => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const p of points) {
        if (p.x < minX) minX = p.x
        if (p.y < minY) minY = p.y
        if (p.x > maxX) maxX = p.x
        if (p.y > maxY) maxY = p.y
    }
    return { minX, minY, maxX, maxY }
}

/**
 * 在参数 t 处用 de Casteljau 算法分割控制点，返回左右两段控制点
 */
const splitControlPoints = (points: PointLike[], t: number = 0.5): [PointLike[], PointLike[]] => {
    const n = points.length
    const work = points.map(p => ({ x: p.x, y: p.y }))
    const left: PointLike[] = [work[0]]
    const right: PointLike[] = [work[n - 1]]

    for (let k = 1; k < n; k++) {
        for (let i = 0; i < n - k; i++) {
            work[i] = {
                x: work[i].x + (work[i + 1].x - work[i].x) * t,
                y: work[i].y + (work[i + 1].y - work[i].y) * t,
            }
        }
        left.push(work[0])
        right.unshift(work[n - k - 1])
    }

    return [left, right]
}

/**
 * 用二维 Newton 法精炼曲线-曲线交点的参数
 * 求解 A(t1) - B(t2) = 0，雅可比矩阵为 [A'(t1), -B'(t2)]
 */
const refineCurveCurveIntersection = (pointsA: PointLike[], pointsB: PointLike[], t1: number, t2: number): PointLike => {
    let u = t1
    let v = t2

    for (let iter = 0; iter < 8; iter++) {
        const pa = deCasteljau(pointsA, u)
        const pb = deCasteljau(pointsB, v)
        const fx = pa.x - pb.x
        const fy = pa.y - pb.y
        if (fx * fx + fy * fy < 1e-20) break

        const da = derivative(pointsA, u)
        const db = derivative(pointsB, v)

        // 雅可比矩阵 [[da.x, -db.x], [da.y, -db.y]] 的行列式
        const det = -da.x * db.y + db.x * da.y
        if (Math.abs(det) < 1e-12) break

        // 解 J·[du, dv] = -F
        const du = (fx * db.y - db.x * fy) / det
        const dv = (-da.x * fy + fx * da.y) / det

        u = Math.max(0, Math.min(1, u + du))
        v = Math.max(0, Math.min(1, v + dv))
        if (Math.abs(du) < 1e-10 && Math.abs(dv) < 1e-10) break
    }

    return deCasteljau(pointsA, u)
}

/**
 * 计算两条任意阶贝塞尔曲线的交点
 *
 * 采用「递归包围盒细分 + 二维 Newton 精炼」：
 *   1. 用控制点包围盒做粗筛，盒子不相交直接丢弃
 *   2. 每次细分包围盒较大的那条曲线，直到两条曲线的盒子都小于 epsilon
 *   3. 用区间中点作为初值，Newton 迭代精炼提高精度
 *
 * @param pointsA - 曲线 A 的控制点
 * @param pointsB - 曲线 B 的控制点
 * @param epsilon - 交点精度（包围盒尺寸阈值），默认 1e-4
 * @returns 交点数组（已去重）
 */
const curveCurveIntersections = (pointsA: PointLike[], pointsB: PointLike[], epsilon: number = 1e-4): PointLike[] => {
    if (pointsA.length < 2 || pointsB.length < 2) return []

    const tol = Math.max(epsilon, 1e-6)
    const MAX_DEPTH = 40
    const MAX_NODES = 4096

    const stack: {
        a: PointLike[]; b: PointLike[]
        t0: number; t1: number
        s0: number; s1: number
        depth: number
    }[] = [{ a: pointsA, b: pointsB, t0: 0, t1: 1, s0: 0, s1: 1, depth: 0 }]

    const found: PointLike[] = []
    let nodes = 0

    while (stack.length > 0) {
        if (nodes++ > MAX_NODES) break
        const node = stack.pop()!

        const ba = controlPointsBounds(node.a)
        const bb = controlPointsBounds(node.b)
        // 包围盒不相交则无交点
        if (ba.minX > bb.maxX || bb.minX > ba.maxX || ba.minY > bb.maxY || bb.minY > ba.maxY) continue

        const sizeA = Math.max(ba.maxX - ba.minX, ba.maxY - ba.minY)
        const sizeB = Math.max(bb.maxX - bb.minX, bb.maxY - bb.minY)

        if ((sizeA <= tol && sizeB <= tol) || node.depth >= MAX_DEPTH) {
            const t = (node.t0 + node.t1) / 2
            const s = (node.s0 + node.s1) / 2
            found.push(refineCurveCurveIntersection(pointsA, pointsB, t, s))
            continue
        }

        // 优先细分包围盒较大的曲线，加速收敛
        if (sizeA >= sizeB) {
            const [l, r] = splitControlPoints(node.a)
            const tm = (node.t0 + node.t1) / 2
            stack.push({ a: l, b: node.b, t0: node.t0, t1: tm, s0: node.s0, s1: node.s1, depth: node.depth + 1 })
            stack.push({ a: r, b: node.b, t0: tm, t1: node.t1, s0: node.s0, s1: node.s1, depth: node.depth + 1 })
        } else {
            const [l, r] = splitControlPoints(node.b)
            const sm = (node.s0 + node.s1) / 2
            stack.push({ a: node.a, b: l, t0: node.t0, t1: node.t1, s0: node.s0, s1: sm, depth: node.depth + 1 })
            stack.push({ a: node.a, b: r, t0: node.t0, t1: node.t1, s0: sm, s1: node.s1, depth: node.depth + 1 })
        }
    }

    // 按网格去重（重合曲线会产生大量重复交点，避免 O(n²) 比较）
    const dedupeTol = tol * 2
    const seen = new Set<string>()
    const result: PointLike[] = []
    for (const p of found) {
        const key = `${Math.round(p.x / dedupeTol)}:${Math.round(p.y / dedupeTol)}`
        if (seen.has(key)) continue
        seen.add(key)
        result.push(p)
    }
    return result
}

/**
 * 查找贝塞尔曲线上曲率最大的位置（采样 + 黄金分割搜索）
 * @param samples - 初始采样段数（默认 32）
 * @returns 最大曲率处的 t 值及曲率
 */
const maxCurvaturePoint = (points: PointLike[], samples: number = 32): { t: number; curvature: number } => {
    if (points.length < 3) return { t: 0, curvature: 0 }

    // 粗采样定位峰值
    let bestIndex = 0
    let bestK = -Infinity
    for (let i = 0; i <= samples; i++) {
        const k = curvature(points, i / samples)
        if (k > bestK) {
            bestK = k
            bestIndex = i
        }
    }
    if (bestK <= 0) return { t: bestIndex / samples, curvature: bestK }

    // 在峰值相邻区间内做黄金分割搜索
    const step = 1 / samples
    let a = Math.max(0, bestIndex * step - step)
    let b = Math.min(1, bestIndex * step + step)
    const phi = (Math.sqrt(5) - 1) / 2

    let c = b - phi * (b - a)
    let d = a + phi * (b - a)
    let fc = curvature(points, c)
    let fd = curvature(points, d)

    for (let iter = 0; iter < 40 && b - a > 1e-10; iter++) {
        if (fc > fd) {
            b = d
            d = c
            fd = fc
            c = b - phi * (b - a)
            fc = curvature(points, c)
        } else {
            a = c
            c = d
            fc = fd
            d = a + phi * (b - a)
            fd = curvature(points, d)
        }
    }

    const t = (a + b) / 2
    return { t, curvature: curvature(points, t) }
}

export {
    deCasteljau,
    derivative,
    derivativeControlPoints,
    evaluate,
    evaluateValues,
    derivative1,
    derivativeN,
    quadraticEvaluate,
    cubicEvaluate,
    quadraticToCubic,
    elevateDegree,
    elevateDegreeN,
    arcLength,
    normal,
    curvature,
    extrema,
    maxCurvature,
    project,
    conicToQuadratic,
    controlPointsBounds,
    splitControlPoints,
    curveCurveIntersections,
    maxCurvaturePoint,
}
