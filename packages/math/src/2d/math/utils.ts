import { guid } from "../core/util";
import { Vector2 } from "./vec2";

export const PI = Math.PI;
export const PI2 = Math.PI * 2;
export const PI_2 = Math.PI * 0.5;
export const BEZIER_CIRCLE_GOLDEN_RATIO = 4 / 3 * (Math.sqrt(2) - 1) // 黄金分割率
export const DEGREES_RADIAN = PI / 180
export const INVERT_DEGREES_RADIAN = 1 / DEGREES_RADIAN

type PointLike = { x: number; y: number };
export function findIndexRight<T = any>(arr: T[], predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate.call(thisArg, arr[i], i, arr)) {
            return i;
        }
    }
}
// 创建掩码
export function createMask(...args: boolean[]) {
    var nMask = 0, nFlag = 0, nLen = args.length > 32 ? 32 : args.length;
    for (nFlag; nFlag < nLen; nMask |= Number(args[nFlag]) << nFlag++);
    return nMask;
}
// 逆算法：从掩码得到布尔数组节
// 如果你希望从掩码得到得到 Boolean Array ：
export function arrayFromMask(nMask: number) {
    // nMask 必须介于 -2147483648 和 2147483647 之间
    if (nMask > 0x7fffffff || nMask < -0x80000000) {
        throw new TypeError("arrayFromMask - out of range");
    }
    for (var nShifted = nMask, aFromMask = []; nShifted;
        aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);
    return aFromMask;
}
//  function createBinaryString(nMask) {
//             // nMask must be between -2147483648 and 2147483647
//             for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32;
//                  nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
//             return sMask;
//         }
// 十进制转为二进制
export function decimalToBit(v: number, bit = 32) {
   
    let str = ''
    for (let i = bit - 1; i >= 0; i--) {
        str += ((v >>> i) & 1)
    }
    return str;
}
// 将32位整数转换为有符号整数
export function as_signed(value: number, bits: number = 32) { var s = 32 - bits; return (value << s) >> s; }
// 将32位整数转换为无符号整数
export function as_unsigned(value: number, bits: number = 32) { var s = 32 - bits; return (value << s) >>> s; }
// 计算32位整数的最低位
export function calcLowBit(value:number){
    //  return value & ~(value - 1);
    return value & -value;
}
// 计算32位整数的最高位
export function calcHighBit(value:number){
    let bit=calc32Shift(value);
    return (value>>>bit)<<bit
}
export function includeBit(value:number,bit:number){
    return (value&bit)===bit;
}
export function removeBit(value:number,bit:number){
    return value&~bit;
}
export function calcBitIndex(value:number){
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
export function calcArcSteps(sweepAngle: number): number {
    return Math.ceil(Math.abs(sweepAngle) / PI);
}

// Math functions
export function allAreFinite(args: number[]) {
    for (var i = 0; i < args.length; i++) {
        if (args[i] !== undefined && !Number.isFinite(args[i])) {
            return false;
        }
    }
    return true;
}
export function equalsEpsilon(a: number, b: number, epsilon: number = 1e-6): boolean {
    return Math.abs(a - b) <= epsilon;
}

export function radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
}
export function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}
export function sqrt(n: number): number {
    return Math.sqrt(n);
}
export function pow(base: number, exponent: number): number {
    return Math.pow(base, exponent);
}

export function abs(n: number): number {
    return Math.abs(n);
}
export function min(n1: number, n2: number): number {
    return Math.min(n1, n2);
}
export function max(n1: number, n2: number): number {
    return Math.max(n1, n2);
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
export function usignfactorial(n: number): number {
    if (n < 0) return -1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}
// 组合 C(n,r) = n! / (r!(n-r)!)

export function fast_nCr(n: number, r: number): number {
    if (r > n) return 0;
    let result = 1;
    for (let i = 1; i <= r; i++) {
        result *= (n - i + 1) / i;
    }
    return result;
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

// 排列 P(n,r) = n! / (n-r)!
export function fast_nPr(n: number, r: number): number {
    if (r > n) return 0;
    let result = 1;
    for (let i = 1; i <= r; i++) {
        result *= (n - i + 1);
    }
    return result;
}


export function lerp(start: number, end: number, t: number) {
    return start * (1 - t) + end * t;
}
export function inverseLerp(start: number, end: number, value: number) {
    return (value - start) / (end - start);
}
// 平滑插值
export function smoothstep(start: number, end: number, amount: number) {
    const t = clamp((amount - start) / (end - start), 0, 1);
    return t * t * (3 - 2 * t);
}
export function easeInOut(start: number, end: number, amount: number) {
    const t = clamp((amount - start) / (end - start), 0, 1);
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
export function easeIn(start: number, end: number, amount: number) {
    const t = clamp((amount - start) / (end - start), 0, 1);
    return t * t * t;
}
export function easeOut(start: number, end: number, amount: number) {
    const t = clamp((amount - start) / (end - start), 0, 1);
    return (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
// 定义一个可扩展的构造函数类型
type Constructor<T = {}> = new (...args: any[]) => T;
type AnyFunction = (...args: any[]) => any;
type Mixin<T extends AnyFunction> = InstanceType<ReturnType<T>>;

// 定义 Mixin 创建函数
export function createMixin<M>(mixin: M) {
    return <T extends Constructor>(Base: T) => {
        return class extends Base {
            constructor(...args: any[]) {
                super(...args);
                Object.assign(this, mixin);
            }
        } as T & Constructor<M>;
    };
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
// 求一个函数的导数
// 数值微分，求近似导数
// 中心差分= ∫'(x)=dy/dx
// dy=dx*∫'(x)
export const centralDifference = (fn: any, h: number, ...args: any[]) => {
    return (fn(...args.map(d => d + h)) - fn(...args.map(d => d - h))) / (2 * h)
}

/***
 * 切线方程:y - f(x) = f'(x)(X - x)
 * @description 计算函数的导数
 * 想象一个函数曲线 y = f(x)：
    fx 是当前点 x 处的函数值（y坐标）
    fpx 是当前点 x 处的导数值（切线斜率）
    fx / fpx 表示从当前点沿着切线回到 x轴的水平距离
    x - fx / fpx 就是切线与 x轴交点的 x坐标
    泰勒展开视角
        在 x 点附近，函数可以近似为：f(x+Δx) = f(x)+f'(x)*Δx
        我们希望找到使 f(x + Δx) = 0 的 Δx：
            0 = f(x) + f'(x)Δx
            Δx = -f(x) / f'(x)

 * f(x+d)=f(x)+f'(d)*d
 * 中心差分= ∫'(x)=dy/dx
 * dy=dx*∫'(x)
 */
export function derivative(f: (x: number) => number, x: number, h: number = 1e-5) {
    return (f(x + h) - f(x - h)) / (2 * h);
}

/**
  * 使用中心差分法计算函数在x处的N阶导数（数值方法）
  * @param f 原始函数
  * @param n 导数阶数 (n >= 0)
  * @param x 求导点
  * @param h 步长 (默认1e-5)
  * @returns N阶导数的数值近似
  */
export function numericalNthDerivative(
    f: (x: number) => number,
    n: number,
    x: number,
    h: number = 1e-5
): number {
    if (n < 0) throw new Error("导数阶数必须为非负整数");
    if (n === 0) return f(x);

    // 使用中心差分公式的高阶版本
    const centralDifference = (g: (x: number) => number, x: number, h: number, order: number): number => {
        if (order === 1) {
            return (g(x + h) - g(x - h)) / (2 * h);
        } else if (order === 2) {
            return (g(x + h) - 2 * g(x) + g(x - h)) / (h * h);
        }

        // 对于高阶导数，使用递归或显式公式
        let sum = 0;
        for (let k = 0; k <= order; k++) {
            const coefficient = Math.pow(-1, k) * nCr(order, k);
            sum += coefficient * g(x + (order / 2 - k) * h);
        }
        return sum / Math.pow(h, order);
    };

    // 递归计算
    let currentFunction = f;
    for (let i = 0; i < n; i++) {
        const prevFunction = currentFunction;
        currentFunction = (x: number) => centralDifference(prevFunction, x, h, 1);
    }

    return currentFunction(x);
}
// 微积分求面积
export const integral = (fn: any, a: number, b: number, h: number = 1e-5) => {
    let sum = 0;
    for (let x = a; x < b; x += h) {
        sum += fn(x) * h;
    }
    return sum;
}
/**
 * 使用中心差分法数值计算导数
 * 直观展示dx作为x方向的微小位移
 */
function numericalDerivative(f: (x: number) => number, x: number, dx: number = 1e-8): number {
    // dx: x方向的微小位移量
    // dy: 函数值的变化量
    const dy = f(x + dx) - f(x - dx);  // 中心差分更精确
    return dy / (2 * dx);  // 导数 = dy/dx
}

/**
 * 前向差分法 - 更直观但精度稍差
 * @param f 函数 返回x处的y值
 * @param x 点
 * @param dx 微小位移量
 * @returns 导数
 */
function forwardDifference(f: (x: number) => number, x: number, dx: number = 1e-8): number {
    // dy = f(x+dx) - f(x)  ← y方向的变化
    // dx = 微小位移量       ← x方向的位移
    const dy = f(x + dx) - f(x);
    return dy / dx;
}
// 中心差分
// 中心差分= ∫'(x)=dy/dx
// dy=dx*∫'(x)
/** 
 * @description 中心差分
*/
export const centralDifferential = (fn: any, h: number, ...args: any[]) => {
    return (fn(...args.map(d => d + h)) - fn(...args.map(d => d - h))) / (2 * h)
}

// 前向差分
export const forwardDifferential = (fn: any, h: number, ...args: any[]) => {
    return (fn(...args.map(d => d + h)) - fn(...args)) / h
}
// 后向差分
export const backwardDifferential = (fn: any, h: number, ...args: any[]) => {
    return (fn(...args) - fn(...args.map(d => d - h))) / h
}

// 多变量偏导 d/dx, d/dy, d/dt
// 示例
// const g = (x, y) => x ** 2 + y ** 3;
// console.log(partialDerivative(g, 0, [2, 3])); // ∂g/∂x ≈4
export function partialDerivative(f: (...args: number[]) => number, varIndex: number, point: number[], h = 1e-5) {
    const shifted = [...point];
    shifted[varIndex] += h;
    const fPlus = f(...shifted);
    shifted[varIndex] -= 2 * h;
    const fMinus = f(...shifted);
    return (fPlus - fMinus) / (2 * h);
}


/**
 * 计算梯形面积
 * @param {number} x0 - 边起点的 x 坐标
 * @param {number} y0 - 边起点的 y 坐标
 * @param {number} x1 - 边终点的 x 坐标
 * @param {number} y1 - 边终点的 y 坐标
 * @returns {number} - 返回有符号面积
 */
export function computeEdgeContribution(x0: number, y0: number, x1: number, y1: number) {
    // 忽略水平边
    if (y0 === y1) return 0;

    // 确保 y0 < y1
    if (y0 > y1) {
        [x0, x1] = [x1, x0];
        [y0, y1] = [y1, y0];
    }

    // 计算交点的 x 坐标
    const dx = x1 - x0;
    const dy = y1 - y0;

    // 计算梯形的面积
    const area = (x0 + x1) * dy / 2;

    // 根据边的方向确定符号
    return dx > 0 ? area : -area;
}

export const degreesToRadian = (degrees: number) => {
    return degrees * DEGREES_RADIAN
}
export const radianToDegrees = (radian: number) => {
    return radian * INVERT_DEGREES_RADIAN
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
export const random = (min: number, max: number) => {
    return min + (max - min) * Math.random()
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
// 计算缩放
export const calcScalePan = (out: PointLike, oldScale: number, newScale: number, offset: PointLike, origin: PointLike) => {
    const scale = newScale / oldScale
    const dx = offset.x - origin.x
    const dy = offset.y - origin.y
    // // 相对原点，进行缩放平移
    out.x = origin.x + dx * scale
    out.y = origin.y + dy * scale
    return out
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

export const divmod = (dividend: number, divisor: number) => {
    let quotient = Math.trunc(dividend / divisor)
    let remainder = dividend % divisor
    if (remainder < 0) {
        quotient--
        remainder += divisor
    }
    return [quotient, remainder]
}
export const divmod2 = (dividend: number, divisor: number) => {
    let quotient = Math.floor(dividend / divisor)
    let remainder = dividend - quotient * divisor
    return [quotient, remainder]
}
// mod(a,b)=a%b
export const mod = (v: number, m: number) => {
    return v - Math.trunc(v / m) * m
}
// 正数向上取整，负数向下取整
// 2%10=-8 -2%10=-2
export const modUp = (a: number, b: number) => {
    return a - Math.ceil(a / b) * b
}
// 正数向下取整，负数向向取整
// -2%10 8 2%10=2 remainder
export const modDown = (a: number, b: number) => {
    return a - Math.floor(a / b) * b
}
export const clamp = (v: number, min: number, max: number) => {
    return Math.max(Math.min(v, max), min)
}
export const clamp01 = (v: number) => {
    return Math.max(Math.min(v, 1), 0)
}
export const interpolate = (start: number, end: number, t: number) => {
    return start + (end - start) * t
}

export const mix = (edge0: number, edge1: number, t: number) => {
    return edge0 * (1 - t) + edge1 * t
}
export const smoonthstep = (edge1: number, edge2: number, value: number) => {
    const t = clamp((value - edge1) / (edge2 - edge1), 0, 1);
    return t * t * (3 - 2 * t);
}
export const step = (edge: number, value: number) => {
    return value < edge ? 0 : 1;
}
export const swap = (arr: any[], from: any, to: any) => {
    let t = arr[from]
    arr[from] = arr[to]
    arr[to] = t
}

export const isFinite = (x: any) => {
    return Number.isFinite(x)
}
// 阶乘
export const factorial = (x: number): number => {
    const sign = Math.sign(1 / x)
    const absValue = Math.abs(x)
    if (absValue <= 1) {
        return sign;
    }
    return x * factorial(absValue - 1)
}
export const fastFactorial = (x: number): number => {
    if (x <= 1) {
        return 1;
    }
    return x * fastFactorial(x - 1)
}
// 求和
export const sum = (i: number, n: number, add: (sum: number, index: number, len: number) => number) => {
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

// 置换考虑排序 abc 有几种置换: 3!=6
export const substitution = (n: number) => {
    // n!
    return factorial(n)
}
// 排列
/**
 * n!/(n-r)! 或 (r~n)!
 * 排队问题。
    排班问题。
    生成所有可能的顺序。
 * @param {*} n 
 * @param {*} r 
 * @returns 
 */
export const nPr = (n: number, r: number) => {
    // n!/(n-r)! =((n-r)~n)!
    return factorial(n) / factorial(n - r)
}
// 组合，不考虑顺序
/**
 * 选择团队成员。
计算彩票中奖概率。
从菜单中选择固定数量的菜品。

 * @param {*} n 
 * @param {*} r 
 * @returns 
 */
export const nCr = (n: number, r: number) => {
    //n!/(n-r)!*r!
    // return nPr(n,r)/factorial(r)
    return factorial(n) / (factorial(n - r) * factorial(r))
}

// Helper: Compute combination C(n, k) 
// 组合等同nCr
export function combination(n: number, k: number) {
    if (k > n) return 0;
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result *= (n - i + 1) / i; // ((n-k)~n)!/k！// 排列数/置换数
    }
    return result;
}
// 四舍五入到指定精度
export function roundPrecision(value: number, p: number) {
    return Math.round(value * Math.pow(10, p)) * 1 / Math.pow(10, p)
}
export function truncPrecision(value: number, p: number) {
    return Math.trunc(value * Math.pow(10, p)) * 1 / Math.pow(10, p)
}
export function floorPrecision(value: number, p: number) {
    return Math.floor(value * Math.pow(10, p)) * 1 / Math.pow(10, p)
}
export function ceilPrecision(value: number, p: number) {
    return Math.ceil(value * Math.pow(10, p)) * 1 / Math.pow(10, p)
}
// 计算B样条基函数
export function bSplineBasis(i: number, k: number, t: number, knots: number[]) {
    if (k === 1) {
        return (t >= knots[i] && t < knots[i + 1]) ? 1 : 0;
    } else {
        const denom1 = knots[i + k - 1] - knots[i];
        const denom2 = knots[i + k] - knots[i + 1];
        let term1 = 0;
        let term2 = 0;

        if (denom1 !== 0) {
            term1 = ((t - knots[i]) / denom1) * bSplineBasis(i, k - 1, t, knots);
        }

        if (denom2 !== 0) {
            term2 = ((knots[i + k] - t) / denom2) * bSplineBasis(i + 1, k - 1, t, knots);
        }

        return term1 + term2;
    }
}

// 计算B样条曲线上的点
export function bSplineCurve(controlPoints: number[][], degree: number, knots: number[], t: number) {
    const n = controlPoints.length - 1;
    let point = [0, 0];

    for (let i = 0; i <= n; i++) {
        const basis = bSplineBasis(i, degree + 1, t, knots);
        point[0] += controlPoints[i][0] * basis;
        point[1] += controlPoints[i][1] * basis;
    }

    return point;
}



// 排除r行和c列的矩阵，不包括行列的元素。

export function createLowMatrix(r: number, c: number, n: number, m: Float32Array | number[]) {
    let len = (n - 1) ** 2
    let temp = new Float32Array(len)
    let mlen = m.length
    let k = 0;
    for (let i = 0; i < mlen; i++) {
        let r2 = i % n;
        let c2 = i / n >> 0
        if (!(c2 === c || r === r2)) {
            temp[k++] = m[i]
        }
    }
    return temp
}
export function determinantFromNthMatrix(m: Float32Array | number[]) {
    let n = Math.sqrt(m.length)
    if (n === 2) {
        return m[0] * m[3] - m[1] * m[2]
    }
    let det = 0
    for (let i = 0; i < n; i++) {
        // 选择一列或者一行。
        // let c=i/n>>0 // 选择行
        // let r=i;
        // 先择列
        let r = i / n >> 0
        let c = i;
        // let sign = (i % 2 == 0 ? 1 : -1)// 计算当前是正数还是负数
        let sign = ((r + c) % 2 == 0 ? 1 : -1)// 当前行+列，偶数为正,奇数为负
        let value = m[c * n + r]
        let lowMatrix = createLowMatrix(r, c, n, m) // 复制除当前行/列，低一阶矩阵
        let lowDet = determinantFromNthMatrix(lowMatrix) // 低一阶矩阵行列式
        det += value * lowDet * sign
    }
    return det
}
// 转置矩阵
export function transposeFromNthMatrix(m: Float32Array | number[]) {
    let n = Math.sqrt(m.length)
    let l = m.length
    let out = new Float32Array(l)
    for (let i = 0; i < l; i++) {
        let r = i % n
        let c = i / n >> 0;
        let value = m[i]
        out[r * n + c] = value
    }
    return out
}
// 伴随矩阵
export function adjointFromNthMatrix(m: Float32Array | number[]) {
    let n = Math.sqrt(m.length)
    let l = m.length
    let out = new Float32Array(l)
    // 默认以列主序形式存储，所以要转置成行主序，假始是行主序形式存储，则不需要转置
    let tm = transposeFromNthMatrix(m) // 转置矩阵，
    for (let i = 0; i < l; i++) {
        let r = i % n
        let c = i / n >> 0;
        // let value = tm[i]
        let sign = ((r + c) % 2 == 0 ? 1 : -1)// 当前行+列，偶数为正,奇数为负
        let cofactor = createLowMatrix(r, c, n, tm)
        let det = determinantFromNthMatrix(cofactor)
        out[i] = det * sign
    }
    return out
}
export function invertFromNMatrix(m: Float32Array | number[]) {
    let det = determinantFromNthMatrix(m) // 计算行列式值
    let adjoinM = adjointFromNthMatrix(m)// 计算伴随矩阵

    let invertDet = 1 / det
    let invertMatrix = adjoinM.map(d => d * invertDet) // 计算逆矩阵

    return invertMatrix
}

export function identityMatrix(out: Float32Array | number[], n: number) {
    for (let i = 0; i < n; i++) {
        out[i + i * n] = 1;
    }
    return out
}

export const getIntersectionGridCell = (options: { start: Vector2, dir: Vector2, rows: number, cols: number, cellWidth: number, cellHeight: number, onCollisionDetection?: (x: number, y: number) => boolean }) => {
    const { start, dir, rows, cols, cellWidth, cellHeight, onCollisionDetection } = options
    const cellSize = Vector2.create(cellWidth, cellHeight)
    const coord = start.clone().div(cellSize) // 屏幕坐标转换为网格坐标
    const mapCoord = coord.clone().floor() // 地图坐标 
    const offset = coord.clone().sub(mapCoord) // 在格子的偏移量
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

export const drawRays3d = (options: { getStrokeColor: (ray: any) => string, ctx: CanvasRenderingContext2D, rays: any[], map: number[][] }) => {
    const { ctx, rays, map, getStrokeColor } = options
    const height = ctx.canvas.height;
    const width = ctx.canvas.width
    const halfHeight = height * 0.5;
    const cellSize = width / map[0].length >> 0
    let x1, y1, x2, y2;
    rays.forEach((ray) => {
        let strokeColor = getStrokeColor(ray)
        let lineHeight = height / ray.noFishDistance

        x1 = ray.x;
        y1 = halfHeight - lineHeight * 0.5
        x2 = ray.x;
        y2 = halfHeight + lineHeight * 0.5

        y1 = Math.max(0, Math.min(y1, height))
        y2 = Math.max(0, Math.min(y2, height))

        ctx.beginPath()
        ctx.strokeStyle = strokeColor
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
    })
}
// 初等行变换求逆矩阵
export function invertFromNMatrixByElementary(m: Float32Array | number[]) {
    let n = Math.sqrt(m.length)
    let l = m.length
    let out = new Float32Array(l);
    // 初始化成单位矩阵
    for (let i = 0; i < n; i++) {
        out[i + i * n] = 1;
    }

    // 将a，通过倍增，减，交换行，变成单位矩阵
    let matrix = new Float32Array(m)


    // 交换行
    const swapRow = (matrix: Float32Array | number[], n: number, from: number, to: number) => {
        for (let i = 0; i < n; i++) {
            let col = i * n
            let tmp = matrix[from + col];
            matrix[from + col] = matrix[to + col];
            matrix[to + col] = tmp;
        }
    }

    // 迭代对角线元素
    for (let j = 0; j < n; j++) {
        let main_value = matrix[j + j * n];// 主元，对角线元素
        if (main_value === 0) {// 主元为0，则寻找下个不为0的对角元素，则交换行
            let swap = false
            for (let k = j + 1; j < n; k++) {

                if (matrix[k + k * n] !== 0) {// 找到不为零的行，交换
                    swapRow(matrix, n, j, k)
                    swapRow(out, n, j, k)
                    // 更新主元
                    main_value = matrix[j + j * n]
                    swap = true;
                    break;
                }
            }
            if (!swap) {
                throw new Error("矩阵不可逆")
            }
        }
        // 当前行除以主元，使当前主元归一化
        for (let i = 0; i < n; i++) {
            matrix[j + i * n] /= main_value
            out[j + i * n] /= main_value;
        }
        // 其他行减当前行乘以主元倍数，使其他行的对角线所在列的元素为0

        for (let i = 0; i < n; i++) {
            if (i !== j) {
                let value = matrix[i + j * n]
                for (let k = 0; k < n; k++) {
                    matrix[i + k * n] -= value * matrix[j + k * n];
                    out[i + k * n] -= value * out[j + k * n];
                }
            }
        }
    }

    return out
}
export function multiplyMatrices(result: Float32Array | number[] | null, a: Float32Array | number[], b: Float32Array | number[]) {

    let aRow = Math.sqrt(a.length)
    let bCol = Math.sqrt(b.length)

    if (aRow !== bCol) {
        throw new Error("矩阵维度不匹配，无法相乘");
    }
    result = result || new Float32Array(aRow * bCol);

    for (let i = 0; i < aRow; i++) {
        for (let j = 0; j < bCol; j++) {
            let sum = 0
            for (let k = 0; k < aRow; k++) {
                sum += a[i + k * aRow] * b[k + j * bCol]
            }
            result[i + j * aRow] = sum;
        }
    }
    return result
}

// LU求逆
export function invertFromNMatrixByLU(matrix: Float32Array | number[]) {
    let n = Math.sqrt(matrix.length)
    let l = matrix.length
    let out = new Float32Array(l);
    let L = new Float32Array(l) // 设成单位矩阵下三角矩阵
    let U = new Float32Array(l) // 设成为0的上三角矩阵


    // 初始化成单位矩阵
    for (let i = 0; i < n; i++) {
        L[i + i * n] = 1;
    }

    /***
     * Doolittle算法的步骤如下：

    初始化：设矩阵A的大小为n×n，创建n×n的单位下三角矩阵L和零上三角矩阵U。
    迭代计算：对于每一列k（从1到n）：

    计算U的第k行元素：对于列索引j从k到n，计算U[k, j] = A[k, j] - ∑(L[k, m] * U[m, j])，其中m从1到k-1。
    计算L的第k列元素：对于行索引i从k+1到n，计算L[i, k] = (A[i, k] - ∑(L[i, m] * U[m, k])) / U[k, k]，其中m从1到k-1。
    完成分解：经过上述步骤，矩阵A被分解为L和U的乘积，即A = LU。
     */
    for (let k = 0; k < n; k++) {
        for (let j = k; j < n; j++) {
            let sum = 0
            for (let m = 0; m < k; m++) {
                sum += L[k + m * n] * U[m + j * n]
            }
            U[k + j * n] = matrix[k + j * n] - sum;
        }
        for (let i = k + 1; i < n; i++) {
            let sum = 0
            for (let m = 0; m < k; m++) {
                sum += L[i + m * n] * U[m + k * n]
            }
            L[i + k * n] = (matrix[i + k * n] - sum) / U[k + k * n];
        }

    }
    // 利用前向替换法求解下三角矩阵系统 L * x = b
    // L 为下三角矩阵（对角线非0，通常为1），b 为列向量
    function forwardSubstitution(L: Float32Array | number[], b: number[]) {
        const n = Math.sqrt(L.length);
        const x = new Float32Array(n)
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < i; j++) {
                sum += L[i + j * n] * x[j];
            }
            x[i] = (b[i] - sum) / L[i + i * n];
        }
        return x;
    }

    // 利用后向替换法求解上三角矩阵系统 U * x = b
    function backwardSubstitution(U: Float32Array | number[], b: number[]) {
        const n = Math.sqrt(U.length);
        const x = new Float32Array(n);
        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < n; j++) {
                sum += U[i + j * n] * x[j];
            }
            if (U[i + i * n] === 0) {
                throw new Error("零主元，无法进行后向替换");
            }
            x[i] = (b[i] - sum) / U[i + i * n];
        }
        return x;
    }
    // 生成 n 阶单位矩阵
    function identityMatrix(n: number) {
        const I = new Float32Array(n * n);
        for (let i = 0; i < n; i++) {
            I[i + i * n] = 1; // 对角线元素为1，其余为0

        }
        return I;
    }
    function extractColumn(matrix: Float32Array | number[], colIndex: number) {
        const n = Math.sqrt(matrix.length);
        const column: number[] = new Array(n);
        for (let i = 0; i < n; i++) {
            column[i] = matrix[i + colIndex * n]
        }
        return column;
    }
    // 求下三角矩阵 L 的逆：逐列求解 L * x = e_i
    function invertLowerTriangular(L: Float32Array | number[]) {
        const n = Math.sqrt(L.length);
        const L_inv = new Float32Array(n * n);

        const I = identityMatrix(n);
        for (let i = 0; i < n; i++) {
            // 求解 L * x = e_i
            const x = forwardSubstitution(L, extractColumn(I, i)); // 取第 i 列的单位向量
            for (let j = 0; j < n; j++) {
                L_inv[j + i * n] = x[j];
            }
        }
        return L_inv;
    }

    // 求上三角矩阵 U 的逆：逐列求解 U * x = e_i
    function invertUpperTriangular(U: Float32Array | number[]) {
        const n = Math.sqrt(U.length);
        const U_inv = new Float32Array(n * n)

        const I = identityMatrix(n);
        for (let i = 0; i < n; i++) {
            // 求解 U * x = e_i，利用后向替换
            const x = backwardSubstitution(U, extractColumn(I, i));
            for (let j = 0; j < n; j++) {
                U_inv[j + i * n] = x[j];
            }
        }
        return U_inv;
    }
    // let a=multiplyMatrices(null,L,U)

    return multiplyMatrices(null, invertUpperTriangular(U), invertLowerTriangular(L))
}


export function trapezoidalIntegralArea(f: (x: number) => number, a: number, b: number, n: number) {
    const h = (b - a) / n;
    let sum = (f(a) + f(b)) / 2;
    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        sum += f(x);
    }
    return h * sum;
}


/**
 * 二维点接口
 */
interface Point {
    x: number;
    y: number;
}

/**
 * 贝塞尔曲线极值查找类
 */
export class BezierExtremaFinder {
    /**
     * 查找贝塞尔曲线在指定维度上的极值参数
     * @param controlPoints 控制点数组
     * @param dimension 维度 ('x' 或 'y')
     * @returns 极值对应的参数 t 数组
     */
    public static findExtremaParameters(
        controlPoints: Point[],
        dimension: 'x' | 'y'
    ): number[] {
        const n = controlPoints.length - 1; // 曲线阶数
        if (n < 1) return [];

        // 获取指定维度的坐标值数组
        const coords = controlPoints.map(p => p[dimension]);

        // 计算导数曲线的控制点
        const derivativePoints: number[] = [];
        for (let i = 0; i < n; i++) {
            derivativePoints.push(n * (coords[i + 1] - coords[i]));
        }

        // 求解导数多项式的根
        return this.findPolynomialRoots(derivativePoints);
    }

    /**
     * 查找贝塞尔曲线的所有极值点（包括x和y方向）
     * @param controlPoints 控制点数组
     * @returns 极值点数组（包含参数t和对应的点坐标）
     */
    public static findAllExtrema(controlPoints: Point[]): Array<{ t: number, point: Point }> {
        const extrema: Array<{ t: number, point: Point }> = [];

        // 查找x方向的极值参数
        const xExtremaParams = this.findExtremaParameters(controlPoints, 'x');
        // 查找y方向的极值参数
        const yExtremaParams = this.findExtremaParameters(controlPoints, 'y');

        // 合并并去重参数
        const allParams = [...new Set([...xExtremaParams, ...yExtremaParams])]
            .filter(t => t >= 0 && t <= 1)
            .sort((a, b) => a - b);

        // 计算每个参数对应的点
        for (const t of allParams) {
            extrema.push({
                t,
                point: this.evaluateBezier(controlPoints, t)
            });
        }

        return extrema;
    }

    /**
     * 计算贝塞尔曲线在参数t处的点
     * @param controlPoints 控制点数组
     * @param t 参数 [0, 1]
     * @returns 曲线上的点
     */
    public static evaluateBezier(controlPoints: Point[], t: number): Point {
        const n = controlPoints.length - 1;
        let x = 0;
        let y = 0;

        for (let i = 0; i <= n; i++) {
            const binomial = this.binomialCoefficient(n, i);
            const term = binomial * Math.pow(1 - t, n - i) * Math.pow(t, i);
            x += term * controlPoints[i].x;
            y += term * controlPoints[i].y;
        }

        return { x, y };
    }

    /**
     * 求解多项式方程的实根（使用数值方法）
     * @param coefficients 多项式系数，从高次到低次
     * @returns 在 [0, 1] 区间内的实根数组
     */
    private static findPolynomialRoots(coefficients: number[]): number[] {
        if (coefficients.length === 0) return [];

        // 对于低阶多项式，使用解析解
        switch (coefficients.length) {
            case 1: // 常数项，无根或无穷根
                return Math.abs(coefficients[0]) < 1e-10 ? [0.5] : [];

            case 2: // 线性方程: a*x + b = 0
                const root1 = -coefficients[1] / coefficients[0];
                return root1 >= 0 && root1 <= 1 ? [root1] : [];

            case 3: // 二次方程: a*x² + b*x + c = 0
                return this.solveQuadratic(
                    coefficients[0],
                    coefficients[1],
                    coefficients[2]
                );

            case 4: // 三次方程
                return this.solveCubic(
                    coefficients[0],
                    coefficients[1],
                    coefficients[2],
                    coefficients[3]
                );

            default:
                // 对于高阶多项式，使用数值方法（如牛顿迭代法）
                return this.solvePolynomialNumerically(coefficients);
        }
    }

    /**
     * 求解二次方程
     */
    private static solveQuadratic(a: number, b: number, c: number): number[] {
        if (Math.abs(a) < 1e-10) {
            // 退化为线性方程
            return this.solveQuadratic(1, b, c);
        }

        const discriminant = b * b - 4 * a * c;
        const roots: number[] = [];

        if (discriminant > 0) {
            const sqrtDiscriminant = Math.sqrt(discriminant);
            const root1 = (-b + sqrtDiscriminant) / (2 * a);
            const root2 = (-b - sqrtDiscriminant) / (2 * a);

            if (root1 >= 0 && root1 <= 1) roots.push(root1);
            if (root2 >= 0 && root2 <= 1 && Math.abs(root1 - root2) > 1e-10) {
                roots.push(root2);
            }
        } else if (Math.abs(discriminant) < 1e-10) {
            // 重根
            const root = -b / (2 * a);
            if (root >= 0 && root <= 1) roots.push(root);
        }

        return roots;
    }

    /**
     * 求解三次方程（使用Cardano公式）
     */
    private static solveCubic(a: number, b: number, c: number, d: number): number[] {
        // 实现三次方程求根公式...
        // 这里使用数值方法作为替代
        return this.solvePolynomialNumerically([a, b, c, d]);
    }

    /**
     * 使用牛顿迭代法数值求解多项式根
     */
    private static solvePolynomialNumerically(coefficients: number[]): number[] {
        const roots: number[] = [];
        const n = coefficients.length - 1;

        // 在 [0, 1] 区间内采样多个起点进行迭代
        const samplePoints = 20;
        for (let i = 0; i <= samplePoints; i++) {
            const startT = i / samplePoints;
            const root = this.newtonRaphson(coefficients, startT);

            if (root !== null &&
                root >= 0 && root <= 1 &&
                !roots.some(r => Math.abs(r - root) < 1e-8)) {
                roots.push(root);
            }
        }

        return roots;
    }

    /**
     * 牛顿迭代法
     */
    private static newtonRaphson(coefficients: number[], initialGuess: number): number | null {
        let x = initialGuess;
        const maxIterations = 50;
        const tolerance = 1e-10;

        for (let i = 0; i < maxIterations; i++) {
            const [fx, dfx] = this.evaluatePolynomialAndDerivative(coefficients, x);

            if (Math.abs(fx) < tolerance) {
                return x;
            }

            if (Math.abs(dfx) < tolerance) {
                break; // 导数为零，无法继续迭代
            }

            x = x - fx / dfx;

            // 如果超出 [0, 1] 范围，提前终止
            if (x < 0 || x > 1) {
                break;
            }
        }

        return null;
    }

    /**
     * 计算多项式及其导数在某点的值
     */
    private static evaluatePolynomialAndDerivative(coefficients: number[], x: number): [number, number] {
        let fx = 0;
        let dfx = 0;
        const n = coefficients.length - 1;

        for (let i = 0; i <= n; i++) {
            const power = n - i;
            const term = coefficients[i] * Math.pow(x, power);
            fx += term;

            if (power > 0) {
                dfx += coefficients[i] * power * Math.pow(x, power - 1);
            }
        }

        return [fx, dfx];
    }

    /**
     * 计算二项式系数 C(n, k)
     */
    private static binomialCoefficient(n: number, k: number): number {
        if (k < 0 || k > n) return 0;
        if (k === 0 || k === n) return 1;

        k = Math.min(k, n - k);
        let result = 1;

        for (let i = 1; i <= k; i++) {
            result = result * (n - k + i) / i;
        }

        return result;
    }
}
/**
 * 求解二次方程
 * @description 该函数使用二次方程的公式求解二次方程 ax² + bx + c = 0。
 * 公式：
 * x = (-b ± √(b² - 4ac)) / (2a)
 * 判别式：D = b² - 4ac
 * 根据判别式的符号，可分为以下情况：
 * 1. D > 0：有两个不相等的实数根。
 * 2. D = 0：有一个重根，两个相等的实数根。
 * 3. D < 0：有两个共轭复根。
 * 
 * @param a 二次项系数
 * @param b 一次项系数
 * @param c 常数项
 * @returns 实数根数组（可能有0-2个根）
 */
export function solveQuadratic(a: number, b: number, c: number): number[] {
    const discriminant = b * b - 4 * a * c;
    // a===0时，退化为一次方程
    if (a === 0) {
        if (b === 0) {
            return []
        }
        return [-c / b]
    }
    if (discriminant < 0) {
        return []
    }
    let roots: number[] = [];
    if (discriminant === 0) {
        // 一个根
        roots.push(-b / (2 * a));
    } else {
        // 两个根
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        roots.push(root1);
        roots.push(root2);
    }
    return roots
}
/**
 * 求解三次方程（使用Cardano公式）
 * @description 该函数使用Cardano公式求解三次方程 ax³ + bx² + cx + d = 0。
 * 计算公式：
 * x³ + px + q = 0
 * 其中 p = (3ac - b²) / (3a²)
 * q = (2b³ - 9abc + 27a²d) / (27a³)
 * 判别式：D = q² + (p/3)³
 * 根据判别式的符号，可分为以下情况：
 * 1. D > 0：有一个实根，两个复根。
 * 2. D = 0：有一个重根，两个复根。
 * 3. D < 0：有三个实根。
 * 
 * @param {number} a - 三次项系数
 * @param {number} b - 二次项系数
 * @param {number} c - 一次项系数
 * @param {number} d - 常数项
 * @returns {number[]} 实数根数组（可能有1-3个根）
*/
export function solveCubic(a: number, b: number, c: number, d: number): number[] {
    if (a === 0) throw new Error("Not a cubic equation");

    // 转换成主三次形式 y^3 + py + q = 0
    const p = (3 * a * c - b * b) / (3 * a * a);
    const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);

    const discriminant = (q / 2) ** 2 + (p / 3) ** 3;
    const roots: number[] = [];

    if (discriminant > 0) {
        // 一个实根，两个复根
        const sqrtDisc = Math.sqrt(discriminant);
        const u = Math.cbrt(-q / 2 + sqrtDisc);
        const v = Math.cbrt(-q / 2 - sqrtDisc);
        const y = u + v;
        roots.push(y - b / (3 * a));
    } else if (discriminant === 0) {
        // 重根情况
        const u = Math.cbrt(-q / 2);
        roots.push(2 * u - b / (3 * a));
        roots.push(-u - b / (3 * a));
    } else {
        // 三个实根
        const r = 2 * Math.sqrt(-p / 3);
        const theta = Math.acos((3 * q) / (2 * p) * Math.sqrt(-3 / p)) / 3;

        for (let k = 0; k < 3; k++) {
            const y = r * Math.cos(theta - (2 * Math.PI * k) / 3);
            roots.push(y - b / (3 * a));
        }
    }

    return roots;
}
/**
 * 使用Cardano公式求解三次方程 ax³ + bx² + cx + d = 0
 * @param {number} a - 三次项系数
 * @param {number} b - 二次项系数
 * @param {number} c - 一次项系数
 * @param {number} d - 常数项
 * @returns {number[]} 实数根数组（可能有1-3个根）
 */
export function solveCubicEpsilon(a: number, b: number, c: number, d: number, epsilon = 1e-10): number[] {
    // 处理特殊情况
    if (Math.abs(a) < epsilon) {
        // 退化为二次方程
        return solveQuadraticEpsilon(b, c, d);
    }

    // 归一化系数
    const A = b / a;
    const B = c / a;
    const C = d / a;

    // 消去二次项：令 x = y - A/3
    const p = B - A * A / 3;
    const q = (2 * A * A * A) / 27 - (A * B) / 3 + C;

    // 计算判别式
    const discriminant = (q * q) / 4 + (p * p * p) / 27;

    let roots = [];

    if (discriminant > 0) {
        // 一个实根，两个共轭复根
        const sqrtD = Math.sqrt(discriminant);
        const u = Math.cbrt(-q / 2 + sqrtD);
        const v = Math.cbrt(-q / 2 - sqrtD);
        const realRoot = u + v - A / 3;
        roots.push(realRoot);
    }
    else if (Math.abs(discriminant) < epsilon) {
        // 三个实根，至少两个相等
        if (Math.abs(p) < epsilon && Math.abs(q) < epsilon) {
            // 三重根
            const tripleRoot = -A / 3;
            roots = [tripleRoot, tripleRoot, tripleRoot];
        } else {
            // 一个单根和一个二重根
            const u = Math.cbrt(-q / 2);
            const root1 = 2 * u - A / 3;
            const root2 = -u - A / 3;
            roots = [root1, root2, root2];
        }
    }
    else {
        // 三个不同的实根（不可约情况）
        const phi = Math.acos(-q / 2 * Math.sqrt(-27 / (p * p * p)));
        const r = 2 * Math.sqrt(-p / 3);

        for (let k = 0; k < 3; k++) {
            const root = r * Math.cos((phi - 2 * Math.PI * k) / 3) - A / 3;
            roots.push(root);
        }
    }

    // 过滤NaN并排序
    return roots.filter(root => !isNaN(root))
        .sort((a, b) => a - b);
}

/**
 * 求解二次方程 ax² + bx + c = 0
 */
export function solveQuadraticEpsilon(a: number, b: number, c: number, epsilon = 1e-10) {
    if (Math.abs(a) < epsilon) {
        // 退化为一次方程
        if (Math.abs(b) < epsilon) {
            return []; // 无解或无穷多解
        }
        return [-c / b];
    }

    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return []; // 无实根
    }
    else if (Math.abs(discriminant) < epsilon) {
        return [-b / (2 * a)]; // 重根
    }
    else {
        const sqrtD = Math.sqrt(discriminant);
        return [
            (-b - sqrtD) / (2 * a),
            (-b + sqrtD) / (2 * a)
        ];
    }
}

/**
 * 求解四次方程 ax⁴ + bx³ + cx² + dx + e = 0
 * 使用Ferrari方法
 */
export function solveQuarticEpsilon(a: number, b: number, c: number, d: number, e: number, epsilon = 1e-12): number[] {
    if (Math.abs(a) < epsilon) {
        return solveCubicEpsilon(b, c, d, e); // 退化为三次方程
    }

    // 归一化系数
    const A = b / a;
    const B = c / a;
    const C = d / a;
    const D = e / a;

    // 消去三次项：令 x = y - A/4
    const p = B - (3 * A * A) / 8;
    const q = C - (A * B) / 2 + (A * A * A) / 8;
    const r = D - (A * C) / 4 + (A * A * B) / 16 - (3 * A * A * A * A) / 256;

    // 求解辅助三次方程
    const cubicRoots = solveCubicEpsilon(
        1,
        -p / 2,
        -r,
        (p * r) / 2 - (q * q) / 8
    );

    // 选择实根
    const z = cubicRoots.find(root => !isNaN(root) && isFinite(root));

    if (z === undefined) {
        throw new Error('无法找到合适的实根');
    }

    // 计算中间变量
    const sqrt2z = Math.sqrt(2 * z);
    const term1 = Math.sqrt(z * z - r);
    const term2 = q / (2 * sqrt2z);

    // 四个可能的根
    const roots = [];

    // 第一种组合
    const sqrt1 = Math.sqrt(z + term1 - term2);
    const sqrt2 = Math.sqrt(z - term1 - term2);
    roots.push(-A / 4 + (sqrt2z + sqrt1 + sqrt2) / 2);
    roots.push(-A / 4 + (sqrt2z - sqrt1 - sqrt2) / 2);

    // 第二种组合
    const sqrt3 = Math.sqrt(z + term1 + term2);
    const sqrt4 = Math.sqrt(z - term1 + term2);
    roots.push(-A / 4 + (-sqrt2z + sqrt3 + sqrt4) / 2);
    roots.push(-A / 4 + (-sqrt2z - sqrt3 - sqrt4) / 2);

    // 过滤有效根
    return roots.filter(root =>
        !isNaN(root) && isFinite(root)
    ).sort((a, b) => a - b);
}


//  二分法（Bisection Method）
export function bisection(f: (a: any) => number, a: any, b: any, tolerance = 1e-10, maxIterations = 1000) {
    if (f(a) * f(b) >= 0) {
        throw new Error('函数在区间端点同号');
    }

    let iteration = 0;
    while ((b - a) > tolerance && iteration < maxIterations) {
        const c = (a + b) / 2;
        if (Math.abs(f(c)) < tolerance) return c;

        if (f(a) * f(c) < 0) {
            b = c;
        } else {
            a = c;
        }
        iteration++;
    }
    return (a + b) / 2;
}
// 牛顿迭代法（Newton-Raphson Method）
export function newtonRaphson(f: (a: any) => number, df: (a: any) => number, x0: any, tolerance = 1e-10, maxIterations = 100) {
    let x = x0;
    for (let i = 0; i < maxIterations; i++) {
        const fx = f(x);
        if (Math.abs(fx) < tolerance) return x;

        const dfx = df(x);
        if (Math.abs(dfx) < tolerance) {
            throw new Error('导数为零，无法继续迭代');
        }

        x = x - fx / dfx;
    }
    return x;
}
// 割线法（Secant Method）
export function secant(f: (a: any) => number, x0: any, x1: any, tolerance = 1e-10, maxIterations = 100) {
    let xPrev = x0;
    let x = x1;

    for (let i = 0; i < maxIterations; i++) {
        const fPrev = f(xPrev);
        const fCurrent = f(x);

        if (Math.abs(fCurrent) < tolerance) return x;

        const denominator = fCurrent - fPrev;
        if (Math.abs(denominator) < tolerance) {
            throw new Error('除零错误');
        }

        const xNext = x - fCurrent * (x - xPrev) / denominator;
        xPrev = x;
        x = xNext;
    }
    return x;
}
/**
 * 布伦特方法求根 - 结合二分法、割线法和逆二次插值
 * @param {Function} f - 目标函数
 * @param {number} a - 区间左端点
 * @param {number} b - 区间右端点
 * @param {number} tolerance - 容差
 * @param {number} maxIterations - 最大迭代次数
 * @returns {number} 根的近似值
 */
export function brentMethod(f: (x: number) => number, a: number, b: number, tolerance = 1e-10, maxIterations = 100) {
    /**
 * 逆二次插值
 */
    function inverseQuadraticInterpolation(a: number, b: number, c: number, fa: number, fb: number, fc: number) {
        const L0 = a * fb * fc / ((fa - fb) * (fa - fc));
        const L1 = b * fa * fc / ((fb - fa) * (fb - fc));
        const L2 = c * fa * fb / ((fc - fa) * (fc - fb));
        return L0 + L1 + L2;
    }

    /**
     * 割线法
     */
    function secantMethod(a: number, b: number, fa: number, fb: number) {
        return b - fb * (b - a) / (fb - fa);
    }

    let fa = f(a);
    let fb = f(b);

    // 检查区间端点
    if (fa * fb >= 0) {
        throw new Error('函数在区间端点同号，无法保证有根');
    }

    // 确保 |f(b)| < |f(a)|
    if (Math.abs(fa) < Math.abs(fb)) {
        [a, b] = [b, a];
        [fa, fb] = [fb, fa];
    }

    let c = a;
    let fc = fa;
    let d = c;
    let mflag = true;
    let s = 0;
    let fs = 0;

    for (let iter = 0; iter < maxIterations; iter++) {
        // 检查是否收敛
        if (Math.abs(fb) < tolerance || Math.abs(b - a) < tolerance) {
            return b;
        }

        if (Math.abs(fa - fc) > tolerance && Math.abs(fb - fc) > tolerance) {
            // 尝试逆二次插值
            s = inverseQuadraticInterpolation(a, b, c, fa, fb, fc);
        } else {
            // 使用割线法
            s = secantMethod(a, b, fa, fb);
        }

        // 检查插值结果是否可接受
        const condition1 = (s - b) * (s - (3 * a + b) / 4) > 0;
        const condition2 = mflag && Math.abs(s - b) >= Math.abs(b - c) / 2;
        const condition3 = !mflag && Math.abs(s - b) >= Math.abs(c - d) / 2;
        const condition4 = mflag && Math.abs(b - c) < tolerance;
        const condition5 = !mflag && Math.abs(c - d) < tolerance;

        if (condition1 || condition2 || condition3 || condition4 || condition5) {
            // 使用二分法
            s = (a + b) / 2;
            mflag = true;
        } else {
            mflag = false;
        }

        // 计算f(s)
        fs = f(s);
        d = c;
        c = b;
        fc = fb;

        // 更新区间
        if (fa * fs < 0) {
            b = s;
            fb = fs;
        } else {
            a = s;
            fa = fs;
        }

        // 确保 |f(b)| < |f(a)|
        if (Math.abs(fa) < Math.abs(fb)) {
            [a, b] = [b, a];
            [fa, fb] = [fb, fa];
        }
    }

    throw new Error('达到最大迭代次数仍未收敛');
}

/*
周期函数:y = A sin(Bx + C) + D
频率 =  1/周期
周期 =  1/频率
振幅是A
周期是2π/B
相移是−C/B
垂直移位是D

**/
export function periodicFunction(a: number, b: number, c: number, d: number) {
    return (x: number) => {
        return a * Math.sin(b * x + c) + d
    }
}