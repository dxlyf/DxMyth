import {type PointLike } from './Point'
import { Vector2 } from './Vector2'
export const EPSILON = 1e-6
export const PI = Math.PI
export const PI_2 = PI / 2
export const PI_4 = PI / 4
export const TWO_PI = PI * 2
export const DEG_TO_RAD = PI / 180
export const RAD_TO_DEG = 180 / PI

export const degToRad = (deg: number) => {
    return deg * DEG_TO_RAD
}
export const radToDeg = (rad: number) => {
    return rad * RAD_TO_DEG
}

/**
 * 判断浮点数是否接近零
 */
function isNearZero(v: number, eps = EPSILON): boolean {
    return Math.abs(v) < eps
}
export const equalsEpsilon = (a: number, b: number, epsilon: number = EPSILON) => {
    return isNearZero(a - b, epsilon)
}
export const equals = (a: number, b: number) => {
    return a === b
}
export const isFinite = (v: number) => {
    return Number.isFinite(v)
}
export const interpolate = (a: number, b: number, t: number) => {
    return a + (b - a) * t
}
export function inverseLerp(start: number, end: number, value: number) {
    return (value - start) / (end - start);
}
export const random = (min: number, max: number) => {
    return min + Math.random() * (max - min)
}

export const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value))
}
export const smoothStep = (start: number, end: number, value: number) => {
    const t = (value - start) / (end - start)
    return clamp(t * t * (3 * t - 2), 0, 1)
}
export const mix = (start: number, end: number, value: number) => {
    return clamp((value - start) / (end - start), 0, 1)
}
export function findIndexRight<T = any>(arr: T[], predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate.call(thisArg, arr[i], i, arr)) {
            return i;
        }
    }
}
// 将32位整数转换为有符号整数
export function as_signed(value: number, bits: number = 32) { var s = 32 - bits; return (value << s) >> s; }
// 将32位整数转换为无符号整数
export function as_unsigned(value: number, bits: number = 32) { var s = 32 - bits; return (value << s) >>> s; }
// 计算32位整数的最低位
export function calcLowBit(value: number) {
    //  return value & ~(value - 1);
    return value & -value;
}
// 计算32位整数的最高位
export function calcHighBit(value: number) {
    let bit = calc32Shift(value);
    return (value >>> bit) << bit
}
export function includeBit(value: number, bit: number) {
    return (value & bit) === bit;
}
export function removeBit(value: number, bit: number) {
    return value & ~bit;
}
export function calcBitIndex(value: number) {
    return Math.trunc(Math.log2(value));
}
// 计算32位整数的有效位
export function calc32Shift(value: number) {
    return 31 - Math.clz32(value)
}
//  计算贝塞尔曲线圆弧的黄金分割率
export function calcArcGoldenRatio(delta: number): number {
    return 4 / 3 * Math.tan(delta / 4)
}
// 四分之一圆分分段数
export function calcArcCubicBezierSteps(sweepAngle: number): number {
    return Math.ceil(Math.abs(sweepAngle) / PI);
}
/**
  * 由容差反推圆弧的最大步进角：弦高 sagitta = R·(1 − cos(θ/2)) ≤ tol。
  *
  * 早期实现用 `max(16, …)` 之类的**固定段数**，半径一大弦高就超容差
  * （半径 22 的圆角只用 2 段 → 弦高约 1.7px，肉眼可见的“折角”）。
  */
export function arcStepCount(sweep: number, radius: number, tol: number): number {
    const r = Math.max(1e-6, radius);
    const ratio = Math.max(-1, Math.min(1, 1 - tol / r));
    const maxStep = 2 * Math.acos(ratio);
    // 半径极大时步进角趋近 0（段数 → ∞），加个上限避免病态输入把顶点数炸掉
    return Math.min(2048, Math.max(2, Math.ceil(Math.abs(sweep) / Math.max(1e-4, maxStep))));
}
/* ========================= 纯函数：视口数学 ========================= */
/** 视口状态：世界点 (0, 0) 落在屏幕 offset 处，放大 zoom 倍 */
interface Viewport { offset: PointLike; zoom: number }
/** screen = world · zoom + offset */
export function worldToScreen(vp: Viewport, wx: number, wy: number): PointLike {
    return { x: wx * vp.zoom + vp.offset.x, y: wy * vp.zoom + vp.offset.y }
}
/** world = (screen − offset) / zoom */
export function screenToWorld(vp: Viewport, sx: number, sy: number): PointLike {
    return { x: (sx - vp.offset.x) / vp.zoom, y: (sy - vp.offset.y) / vp.zoom }
}
/** 以屏幕点 (sx, sy) 为锚点缩放：offset' = 锚点屏幕坐标 − 锚点世界坐标 · zoom' */
export function zoomAt(vp: Viewport, sx: number, sy: number, next: number, min: number, max: number): Viewport {
    const zoom = next < min ? min : next > max ? max : next
    const a = screenToWorld(vp, sx, sy)
    return { zoom, offset: { x: sx - a.x * zoom, y: sy - a.y * zoom } }
}
// 计算缩放
export const calcZoomPan = (out: PointLike, oldScale: number, newScale: number, offset: PointLike, origin: PointLike) => {
    const scale = newScale / oldScale
    const dx = offset.x - origin.x
    const dy = offset.y - origin.y
    // // 相对原点，进行缩放平移
    out.x = origin.x + dx * scale
    out.y = origin.y + dy * scale
    return out
}
/**
 * 
 * @param value 映射值
 * @param inMin 定义域domain 输入
 * @param inMax 
 * @param outMin 值域range 输出
 * @param outMax 
 * @returns 
 */
export function map(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export const sign = (x: number) => {
    return x > 0 ? 1 : x === 0 ? 0 : -1
}
export const absSign = (x: number) => {
    return x > 0 ? 1 : x === 0 ? Object.is(x, 0) ? 1 : -1 : -1
}
export const randomFloor = (min: number, max: number) => {
    return Math.floor(min + (max - min) * Math.random())
}
export const randomCeil = (min: number, max: number) => {
    return Math.ceil(min + (max - min) * Math.random())
}
export const randomRound = (min: number, max: number) => {
    return Math.round(min + (max - min) * Math.random())
}
export const fract = (v: number) => {
    return v - Math.trunc(v)
}

// 向上取模 10%100=-90  -10%100=-10 
// 返回的永远是负数
export const ceilMod = (v: number, m: number) => {
    return v - Math.ceil(v / m) * m
}

// 向下取模 10%100=10 -10%100=90
// 返回的永远是正数
export const floorMod = (v: number, m: number) => {
    return v - Math.floor(v / m) * m
}
// 10%100=10  -10%100=-10 
export const truncMod = (v: number, m: number) => {
    return v - Math.trunc(v / m) * m
}
// 给定偏移和缩放和单位，计算起始坐标值
// 用于标尺或网格的计算起点坐标值
export const calcStartCoordinateValue = (unit: number, offset: number, scalar: number) => {
    //  const scalarUnit=unit*scalar
    // return offset>0?offset-scalarUnit:offset
    //return offset-Math.ceil(offset/scalarUnit)*scalarUnit
    return ceilMod(offset, unit * scalar)
}
// 计算起始刻度值
export const calcStartGraduationValue = (unit: number, offset: number, scalar: number) => {
    // return Math.floor(-offset/(unit*scalar))*unit
    return -Math.ceil(offset / (unit * scalar)) * unit
}
// 生成刻度
export const generateGraduations = (options: { width: number, height: number, tickSplitHeight: number, tickMarkHeight: number, rulerUnit: number, offset: number, scaleFactor: number, tickSplitStep: number }) => {
    const { width, height, tickSplitHeight, tickMarkHeight, rulerUnit, offset, tickSplitStep, scaleFactor } = options
    const tickValues: { value: number, x: number, y: number }[] = []
    const tickLines: { x0: number, y0: number, x1: number, y1: number }[] = []
    let scaleRulerUnit = rulerUnit * scaleFactor
    const splitCount = Math.ceil(width / scaleRulerUnit);
    const step = scaleRulerUnit / tickSplitStep; // 每个小废度坐标的步进
    // 刻度起始坐标
    let start = calcStartCoordinateValue(rulerUnit, offset, scaleFactor)
    let x0 = 0, y0 = 0, x1 = 0, y1 = 0;
    // 废度起始值
    let startGraduatedValue = calcStartGraduationValue(rulerUnit, offset, scaleFactor)
    // 大刻度
    for (let i = 0; i <= splitCount; i++) {
        // 小刻度
        for (let k = 0; k < tickSplitStep; k++) {
            const isSplitMark = k === 0
            x0 = Math.round(start)
            x1 = Math.round(start)
            y0 = height
            y1 = height - (isSplitMark ? tickMarkHeight : tickSplitHeight)
            tickLines.push({
                x0,
                y0,
                x1,
                y1
            })
            if (isSplitMark) {
                // 添加刻度值
                tickValues.push({
                    x: x0,
                    y: y1,
                    value: startGraduatedValue
                })
            }
            start += step;
        }
        startGraduatedValue += rulerUnit;
    }
}

// 三态函数，判断两个double在eps精度下的大小关系
export function dcmp(x: number, eps = 1e-6) {
    if (Math.abs(x) < eps) {
        return 0;
    }
    return x < 0 ? -1 : 1;
}
// 德卡斯特劳贝塞尔曲线
export const deCasteljauBezier = (out: PointLike, controls: PointLike[], t: number) => {
    const n = controls.length - 1
    if (n === 0) return { x: 0, y: 0 }
    if (n === 1) return { x: controls[0].x, y: controls[0].y }
    const c = controls.map(d => ({ x: d.x, y: d.y }))
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i; j++) {
            c[j].x = (1 - t) * c[j].x + t * c[j + 1].x
            c[j].y = (1 - t) * c[j].y + t * c[j + 1].y
        }
    }
    out.x = c[0].x
    out.y = c[0].y
    return out
}

// 求和
export const summation = (i: number, n: number, add: (sum: number, index: number, len: number) => number) => {
    let sum = 0
    for (; i <= n; i++) {
        sum += add(sum, i, n)
    }
    return sum;
}
// 伯恩斯坦基函数
export const bernstein = (n: number, i: number, t: number) => {
    return nCr(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i)
}
// 伯恩斯坦多项求贝塞尔曲线
export const bezier = (out: PointLike, controls: PointLike[], t: number) => {
    const n = controls.length - 1
    let x = 0, y = 0
    for (let i = 0; i <= n; i++) {
        let b = bernstein(n, i, t)
        x += b * controls[i].x
        y += b * controls[i].y

    }
    out.x = x
    out.y = y
    return out
}
// 有理贝塞尔曲线
export const rationalBezier = (out: PointLike, controls: PointLike[], weight: number[], t: number) => {
    const n = controls.length - 1
    let x = 0, y = 0
    for (let i = 0; i <= n; i++) {
        let b = bernstein(n, i, t) * weight[i]
        x += b * controls[i].x / b
        y += b * controls[i].y / b

    }
    out.x = x
    out.y = y
    return out
}
/**
 * 
我们定义屏幕坐标（screen）与世界坐标（world）的关系为：
screen=world*𝑠+𝑜
其中：
s = scale（缩放倍率）
o = offset（平移）
world = 世界坐标（理想数学坐标）
screen = 屏幕像素坐标
这是所有 2D 平移 + 缩放摄像机的标准形式。
先对世界坐标乘以 scale
然后再加一个偏移 offset
已知一个屏幕坐标 screen = c（例如鼠标位置），我们想知道它对应的世界坐标是什么。
c=w*s+0
解：
w=(c-o)/s

我们用以下约定（这是常见的画布变换约定）：
scale = s：当前缩放（屏幕每个像素对应世界单位的比例因子）。
offset = o：屏幕坐标 = 世界坐标 * s + o（向量运算）。
center = c：鼠标在屏幕坐标系的位置（screenX, screenY）。
zoomFactor = z，新的缩放 s' = s * z。
我们要保证：鼠标所在的世界点在放大前后仍映射到同一个屏幕点 c。
先求放大前该屏幕点对应的世界坐标 w：
w=(c-o)/s
放大后要求:
c=w*s'+o'
解出新的偏移量o'
o'=c-w*s' =c-(c-o)/s*s'=c-(c-o)*(s'/s)

 * 
 *      mat2d.translate(m, m, [mx, my])//设置原点
        mat2d.scale(m, m, [zoom / oldZoom, zoom / oldZoom])
        mat2d.translate(m, m, [-mx, -my])
       let xy = vec2.transformMat2d([], [x, y], m);

 * @param out 最新偏移，缩放后的偏移
 * @param mouse 鼠标位置
 * @param oldScale 旧缩放
 * @param newScale 新缩放
 * @param offset 当前偏移
 * @returns 
 */
export const wheelToScaleArtboard = (out: PointLike, oldScale: number, newScale: number, offset: PointLike, mouse: PointLike) => {
    out.x = mouse.x - (mouse.x - offset.x) * (newScale / oldScale)
    out.y = mouse.y - (mouse.y - offset.y) * (newScale / oldScale)
    return out
}
const factorialCache: number[] = [1, 1]

/**
 * 计算阶乘，使用缓存优化性能
 */
export const factorial = (n: number): number => {
    if (n < 0) return NaN
    if (n === 0 || n === 1) return 1

    // 如果缓存中已有，直接返回
    if (factorialCache[n] !== undefined) {
        return factorialCache[n]
    }

    // 从已缓存的最大值开始计算
    let result = factorialCache[factorialCache.length - 1]
    for (let i = factorialCache.length; i <= n; i++) {
        result *= i
        factorialCache[i] = result
    }

    return result
}
/**
   * 计算二项式系数 C(n, k)
   */
export function binomialCoefficient(n: number, k: number): number {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;

    let result = 1;
    for (let i = 1; i <= k; i++) {
        result *= (n - (k - i)) / i;
    }
    return Math.round(result);
}

// dot([1,0],p)
export enum AngleType {
    Nearly180, // 近似-1 ，角度为180度
    Sharp, // -1<dot<0，角度为90<x<180度
    Shallow, // 0<dot<1，角度为0<x<90度
    NearlyLine, // 返似1，角度为0度,几乎是直线
}
export function isNearlyZero(value: number, epsilon: number = 1e-6) {
    return Math.abs(value) <= epsilon
}
// 计算点剩cos值的角度类型
export function dotToAngleType(dot: number): AngleType {
    if (dot >= 0.0) {
        // shallow or line
        if (isNearlyZero(1.0 - dot)) {
            return AngleType.NearlyLine
        } else {
            return AngleType.Shallow
        }
    } else {
        // sharp or 180
        if (isNearlyZero(1.0 + dot)) {
            return AngleType.Nearly180
        } else {
            return AngleType.Sharp
        }
    }
}
/**
 * 计算组合数 C(n,k) = n! / (k! * (n-k)!)
 * 使用递推公式优化，避免大数溢出
 */
export const nCr = (n: number, k: number): number => {
    if (k < 0 || k > n) return 0
    if (k === 0 || k === n) return 1

    // 利用对称性减少计算
    if (k > n - k) {
        k = n - k
    }

    // 使用递推公式 C(n,k) = C(n,k-1) * (n-k+1) / k
    let result = 1
    for (let i = 1; i <= k; i++) {
        result = result * (n - i + 1) / i
    }

    return result
}

/**
 * 计算排列数 P(n,k) = n! / (n-k)!
 */
export const nPr = (n: number, k: number): number => {
    if (k < 0 || k > n) return 0
    if (k === 0) return 1

    // 直接连乘，避免计算完整阶乘
    let result = 1
    for (let i = 0; i < k; i++) {
        result *= n - i
    }

    return result
}

/**
 * 求解一元二次方程 ax² + bx + c = 0（a ≠ 0）
 * @param a - 二次项系数
 * @param b - 一次项系数
 * @param c - 常数项
 * @returns 实根数组（可能 0、1、2 个根）
 */
export function solveQuadratic(a: number, b: number, c: number): number[] {
    if (isNearZero(a)) {
        if (isNearZero(b)) return []
        return [-c / b]
    }

    const delta = b * b - 4 * a * c

    if (delta < -EPSILON) return []

    if (isNearZero(delta)) {
        return [-b / (2 * a)]
    }

    const sqrtDelta = Math.sqrt(delta)
    return [(-b - sqrtDelta) / (2 * a), (-b + sqrtDelta) / (2 * a)]
}

/**
 * 卡尔丹公式求解一元三次方程 ax³ + bx² + cx + d = 0（a ≠ 0）
 *
 * 令 x = y - b/(3a)，化为缺项三次方程 y³ + py + q = 0
 * 判别式 Δ = (q/2)² + (p/3)³
 *
 * @param a - 三次项系数
 * @param b - 二次项系数
 * @param c - 一次项系数
 * @param d - 常数项
 * @returns 实根数组（可能 1、2、3 个根）
 */
export function solveCubicByCardano(a: number, b: number, c: number, d: number): number[] {
    if (isNearZero(a)) return solveQuadratic(b, c, d)

    // 除以 a，化为首一三次方程
    const A = b / a
    const B = c / a
    const C = d / a

    // 令 x = y - A/3
    const p = B - A * A / 3
    const q = C - A * B / 3 + 2 * A * A * A / 27

    const offset = -A / 3

    // 判别式
    const delta = (q / 2) * (q / 2) + (p / 3) * (p / 3) * (p / 3)

    const roots: number[] = []

    if (delta > EPSILON) {
        // 一个实根
        const sqrtDelta = Math.sqrt(delta)
        const u = Math.cbrt(-q / 2 + sqrtDelta)
        const v = Math.cbrt(-q / 2 - sqrtDelta)
        roots.push(u + v + offset)
    } else if (isNearZero(delta)) {
        // 两个实根（一个单根和一个重根）
        const u = Math.cbrt(-q / 2)
        roots.push(2 * u + offset)
        roots.push(-u + offset)
    } else {
        // 三个实根（用三角函数法）
        const r = Math.sqrt(-(p / 3) * (p / 3) * (p / 3))
        const theta = Math.acos(-q / (2 * r))
        const sqrtP = Math.sqrt(-p / 3)
        for (let k = 0; k < 3; k++) {
            roots.push(2 * sqrtP * Math.cos((theta + 2 * Math.PI * k) / 3) + offset)
        }
    }

    return roots.sort((a, b) => a - b)
}

/**
 * 盛金公式求解一元三次方程 ax³ + bx² + cx + d = 0（a ≠ 0）
 *
 * A = b² - 3ac
 * B = bc - 9ad
 * C = c² - 3bd
 * Δ = B² - 4AC
 *
 * @param a - 三次项系数
 * @param b - 二次项系数
 * @param c - 一次项系数
 * @param d - 常数项
 * @returns 实根数组（可能 1、2、3 个根）
 */
export function solveCubicByShengjin(a: number, b: number, c: number, d: number): number[] {
    if (isNearZero(a)) return solveQuadratic(b, c, d)

    const A = b * b - 3 * a * c
    const B = b * c - 9 * a * d
    const C = c * c - 3 * b * d
    const delta = B * B - 4 * A * C

    if (isNearZero(A) && isNearZero(B)) {
        // 三重根
        return [-b / (3 * a)]
    }

    if (delta > EPSILON) {
        // 一个实根
        const y1 = A * b + 3 * a * ((-B + Math.sqrt(delta)) / 2)
        const y2 = A * b + 3 * a * ((-B - Math.sqrt(delta)) / 2)
        const x = (-b - (Math.cbrt(y1) + Math.cbrt(y2))) / (3 * a)
        return [x]
    }

    if (isNearZero(delta)) {
        // 两个实根（一个单根和一个重根）
        const K = B / A
        const x1 = -b / a + K
        const x2 = -K / 2
        return [x1, x2].sort((a, b) => a - b)
    }

    // 三个实根（Δ < 0）
    const T = (2 * A * b - 3 * a * B) / (2 * Math.sqrt(A * A * A))
    const theta = Math.acos(T)
    const sqrtA = Math.sqrt(A)
    const roots: number[] = []
    for (let k = 0; k < 3; k++) {
        const x = (-b - 2 * sqrtA * Math.cos((theta + 2 * Math.PI * k) / 3)) / (3 * a)
        roots.push(x)
    }
    return roots.sort((a, b) => a - b)
}



export const getIntersectionGridCell = (options: { start: Vector2, dir: Vector2, rows: number, cols: number, cellWidth: number, cellHeight: number, onCollisionDetection?: (x: number, y: number) => boolean }) => {
    const { start, dir, rows, cols, cellWidth, cellHeight, onCollisionDetection } = options
    const cellSize = Vector2.create(cellWidth, cellHeight)
    const coord = start.clone().divide(cellSize) // 屏幕坐标转换为网格坐标
    const mapCoord = coord.clone().floor() // 地图坐标 
    const offset = coord.clone().subtract(mapCoord) // 在格子的偏移量
    const sign = dir.clone().sign() // 方向符号
    // 判断正割
    const deltaX = dir.x === 0 ? 1e30 : Math.abs(1 / dir.x); // 正割,dist和x的比 计算x轴相对dir方向的距离
    const deltaY = dir.y === 0 ? 1e30 : Math.abs(1 / dir.y); // 余割 计算y轴相对dir方向的距离

    // 计算x轴和y轴的距离
    let sideDistX = sign.x === 1 ? (1 - offset.x) * deltaX : offset.x * deltaX // 计算start相对右侧或左侧的距离

    let sideDistY = sign.y === 1 ? (1 - offset.y) * deltaY : offset.y * deltaY;// 计算start相对上方和下方距离 

    const intersections = [] // 与线段方向相交的格子坐标

    let side = false; // 是否侧面
    let count = rows * cols
    while (count--) {

        // 如果x轴距离更小，应该向x轴移动，反之向y轴移动
        if (sideDistX < sideDistY) {
            side = true
            mapCoord.x += sign.x;
        } else {
            side = false
            mapCoord.y += sign.y;

        }
        let col = mapCoord.x
        let row = mapCoord.y


        if (side) {
            let x = start.x + sideDistX * cellWidth * dir.x;
            let y = start.y + sideDistX * cellWidth * dir.y
            intersections.push(Vector2.create(x, y))
            sideDistX += deltaX
        } else {
            let x = start.x + sideDistY * cellHeight * dir.x;
            let y = start.y + sideDistY * cellHeight * dir.y
            intersections.push(Vector2.create(x, y))
            sideDistY += deltaY
        }
        if (col < 0 || col >= cols || row < 0 || row >= rows || onCollisionDetection?.(mapCoord.x, mapCoord.y)) {
            break
        }
    }

    return intersections;
}
export const getRays3D = (player: { rotate: number, x: number, y: number }, map: number[][], fovAngle: number, width: number, height: number, cellSize: number, fish = true) => {
    const rays = []
    const fovRad = fovAngle / 180 * Math.PI
    const fov = Math.tan(fovRad * 0.5)// 视野（0-1）之间
    const origin = Vector2.create(player.x, player.y)
    for (let i = 0; i <= width; i++) {
        // 每个x像素相对光线方向的角度
        const theta = fov * (i / width * 2 - 1) + player.rotate;
        //   const theta=i/width*fov2+player.rotate-fov2/2
        const dir = Vector2.fromRotation(theta)
        // 计算射线与最近相交的格子
        const deltaX = dir.x === 0 ? 1e30 : Math.abs(1 / dir.x)
        const deltaY = dir.y === 0 ? 1e30 : Math.abs(1 / dir.y)

        let col = origin.x / cellSize >> 0
        let row = origin.y / cellSize >> 0
        let x = origin.x / cellSize - col;
        let y = origin.y / cellSize - row;

        let sideDistX = dir.x > 0 ? (1 - x) * deltaX : x * deltaX
        let sideDistY = dir.y > 0 ? (1 - y) * deltaY : y * deltaY
        let side = false
        while (true) {
            if (sideDistX < sideDistY) {
                side = true;
                sideDistX += deltaX
                col += Math.sign(dir.x)
            } else {
                side = false;
                sideDistY += deltaY
                row += Math.sign(dir.y)
            }
            if (map[row][col] > 0) {
                break
            }
        }
        let distance = side ? sideDistX - deltaX : sideDistY - deltaY
        // const target = dir.multiplyScalar(distance * cellSize).add(origin)
        // 移除鱼眼
        let noFishDistance = distance * Math.cos(theta - player.rotate);
        // 计算光线强度
        let lightDiffuse = Math.max(0, Math.cos(fov * (i / width * 2 - 1)))

        rays.push({
            diffuse: Math.pow(lightDiffuse, 64),
            x: i,
            row,
            col,
            value: map[row][col],
            side,
            dir,
            origin,
            distance,// 格子距离
            noFishDistance: noFishDistance
            //  target
        })
    }
    return rays
}
