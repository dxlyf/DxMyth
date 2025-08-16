export const PI=Math.PI;
export const PI2=Math.PI*2;
export const PI_2=Math.PI *0.5;
export const BEZIER_CIRCLE_GOLDEN_RATIO=4/3*(Math.sqrt(2)-1) // 黄金分割率
export const DEGREES_RADIAN = PI / 180
export const INVERT_DEGREES_RADIAN = 1 / DEGREES_RADIAN

type PointLike = { x: number; y: number };
export function calc32Shift(value:number){
    return 31-Math.clz32(value)
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
export function equalsEpsilon(a: number, b: number, epsilon: number = 0.00001): boolean {
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
export const deCasteljauBezier = (out:PointLike,controls: PointLike[], t: number) => {
    const n = controls.length - 1
    const c = controls.map(d =>({x:d.x,y:d.y}))
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

export const bezier = (out:PointLike,controls: PointLike[], t: number) => {
    const n = controls.length - 1
    let x = 0, y = 0
    for (let i = 0; i <= n; i++) {
        let b = bernstein(n, i, t)
        x += b * controls[i].x
        y += b * controls[i].y

    }
    out.x=x
    out.y=y
    return out
}
// 有理贝塞尔曲线

export const rationalBezier = (out:PointLike,controls: PointLike[], weight: number[], t: number) => {
    const n = controls.length - 1
    let x = 0, y = 0
    for (let i = 0; i <= n; i++) {
        let b = bernstein(n, i, t) * weight[i]
        x += b * controls[i].x / b
        y += b * controls[i].y / b

    }
    out.x=x
    out.y=y
    return out
}
// 求一个函数的导数
// 数值微分，求近似导数
// 中心差分= ∫'(x)=dy/dx
// dy=dx*∫'(x)
export const centralDifference = (fn: any, h: number, ...args: any[]) => {
    return (fn(...args.map(d => d + h)) - fn(...args.map(d => d - h))) / (2 * h)
}
// 求导
// 计算 d/dx f(x)
export function derivative(f: (x: number) => number, x: number, h: number = 1e-5) {
    return (f(x + h) - f(x - h)) / (2 * h);
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
export function computeEdgeContribution(x0:number, y0:number, x1:number, y1:number) {
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
// 前向差分
export const forwardDifferential = (fn: any, h: number, ...args: any[]) => {
    return (fn(...args.map(d => d + h)) - fn(...args)) / h
}
// 后向差分
export const backwardDifferential = (fn: any, h: number, ...args: any[]) => {
    return (fn(...args) - fn(...args.map(d => d - h))) / h
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
export function map(value:number,inMin:number,inMax:number,outMin:number,outMax:number){
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
export const calcScalePan=(out:PointLike,oldScale:number,newScale:number,offset:PointLike,origin:PointLike)=>{
    const scale=newScale/oldScale
    const dx=offset.x-origin.x 
    const dy=offset.y-origin.y
    // // 相对原点，进行缩放平移
    out.x=origin.x+dx*scale
    out.y=origin.y+dy*scale
    return out
}
// 生成刻度
export const generateGraduations=(options:{width:number,height:number,tickSplitHeight:number,tickMarkHeight:number,rulerUnit:number,offset:number,scaleFactor:number,tickSplitStep:number})=>{
    const {width,height,tickSplitHeight,tickMarkHeight,rulerUnit,offset,tickSplitStep,scaleFactor}=options
    const tickValues:{value:number,x:number,y:number}[] =[]
    const tickLines:{x0:number,y0:number,x1:number,y1:number}[] =[]
    let scaleRulerUnit = rulerUnit * scaleFactor
    const splitCount = Math.ceil(width / scaleRulerUnit);
    const step = scaleRulerUnit / tickSplitStep; // 每个小废度坐标的步进
    // 刻度起始坐标
    let start = calcStartCoordinateValue(rulerUnit,offset, scaleFactor)
    let x0=0, y0=0, x1=0, y1=0;
    // 废度起始值
    let startGraduatedValue = calcStartGraduationValue(rulerUnit,offset, scaleFactor)
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
                    value:startGraduatedValue
                })
            }
            start += step;
        }
        startGraduatedValue += rulerUnit;
    }
}
/**
 *      mat2d.translate(m, m, [mx, my])//设置原点
        mat2d.scale(m, m, [zoom / oldZoom, zoom / oldZoom])
        mat2d.translate(m, m, [-mx, -my])
       let xy = vec2.transformMat2d([], [x, y], m);
 * @param out 
 * @param mouse 
 * @param oldScale 
 * @param newScale 
 * @param offset 
 * @returns 
 */
export const wheelToScaleArtboard=(out:PointLike,oldScale:number,newScale:number,offset:PointLike,mouse:PointLike)=>{
    out.x = mouse.x-(mouse.x-offset.x)*(newScale/oldScale)
    out.y= mouse.y-(mouse.y-offset.y)*(newScale/oldScale)
    return out
}

export const divmod = (dividend: number, divisor: number) => {
    let quotient=Math.trunc(dividend/divisor)
    let remainder=dividend%divisor
    if(remainder<0){
        quotient--
        remainder+=divisor
    }
    return [quotient,remainder]
}
export const divmod2 = (dividend: number, divisor: number) => {
    let quotient=Math.floor(dividend/divisor)
    let remainder=dividend-quotient*divisor
    return [quotient,remainder]
}
// mod(a,b)=a%b
export const mod = (v: number, m: number) => {
    return v - Math.trunc(v / m) * m
}
// 正数向上取整，负数向下取整
// 2%10=-8 -2%10=-2
export const  modUp=(a:number,b:number)=>{
    return a-Math.ceil(a/b)*b
}
// 正数向下取整，负数向向取整
// -2%10 8 2%10=2 remainder
export const  modDown=(a:number,b:number)=>{
    return a-Math.floor(a/b)*b
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
export const factorial = (x: number):number => {
    const sign = Math.sign(1 / x)
    const absValue = Math.abs(x)
    if (absValue <= 1) {
        return sign;
    }
    return x * factorial(absValue - 1)
}
export const fastFactorial = (x: number):number => {
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
export function bSplineCurve(controlPoints:number[][], degree:number, knots:number[], t:number) {
    const n = controlPoints.length - 1;
    let point = [0, 0];

    for (let i = 0; i <= n; i++) {
        const basis = bSplineBasis(i, degree + 1, t, knots);
        point[0] += controlPoints[i][0] * basis;
        point[1] += controlPoints[i][1] * basis;
    }

    return point;
}
