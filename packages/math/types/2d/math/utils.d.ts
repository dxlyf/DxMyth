import { Vector2 } from './vec2';
export declare const PI: number;
export declare const PI2: number;
export declare const PI_2: number;
export declare const BEZIER_CIRCLE_GOLDEN_RATIO: number;
export declare const DEGREES_RADIAN: number;
export declare const INVERT_DEGREES_RADIAN: number;
type PointLike = {
    x: number;
    y: number;
};
export declare function findIndexRight<T = any>(arr: T[], predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): number;
export declare function createMask(...args: boolean[]): number;
export declare function arrayFromMask(nMask: number): boolean[];
export declare function decimalToBit(v: number, bit?: number): string;
export declare function as_signed(value: number, bits?: number): number;
export declare function as_unsigned(value: number, bits?: number): number;
export declare function calcLowBit(value: number): number;
export declare function calcHighBit(value: number): number;
export declare function includeBit(value: number, bit: number): boolean;
export declare function removeBit(value: number, bit: number): number;
export declare function calcBitIndex(value: number): number;
export declare function calc32Shift(value: number): number;
export declare function calcArcGoldenRatio(delta: number): number;
export declare function calcArcSteps(sweepAngle: number): number;
export declare function allAreFinite(args: number[]): boolean;
export declare function equalsEpsilon(a: number, b: number, epsilon?: number): boolean;
export declare function radiansToDegrees(radians: number): number;
export declare function degreesToRadians(degrees: number): number;
export declare function sqrt(n: number): number;
export declare function pow(base: number, exponent: number): number;
export declare function abs(n: number): number;
export declare function min(n1: number, n2: number): number;
export declare function max(n1: number, n2: number): number;
export declare enum AngleType {
    Nearly180 = 0,// 近似-1 ，角度为180度
    Sharp = 1,// -1<dot<0，角度为90<x<180度
    Shallow = 2,// 0<dot<1，角度为0<x<90度
    NearlyLine = 3
}
export declare function isNearlyZero(value: number, epsilon?: number): boolean;
export declare function dotToAngleType(dot: number): AngleType;
export declare function usignfactorial(n: number): number;
export declare function fast_nCr(n: number, r: number): number;
/**
   * 计算二项式系数 C(n, k)
   */
export declare function binomialCoefficient(n: number, k: number): number;
export declare function fast_nPr(n: number, r: number): number;
export declare function lerp(start: number, end: number, t: number): number;
export declare function inverseLerp(start: number, end: number, value: number): number;
export declare function smoothstep(start: number, end: number, amount: number): number;
export declare function easeInOut(start: number, end: number, amount: number): number;
export declare function easeIn(start: number, end: number, amount: number): number;
export declare function easeOut(start: number, end: number, amount: number): number;
type Constructor<T = {}> = new (...args: any[]) => T;
export declare function createMixin<M>(mixin: M): <T extends Constructor>(Base: T) => T & Constructor<M>;
export declare function dcmp(x: number, eps?: number): 0 | 1 | -1;
export declare const deCasteljauBezier: (out: PointLike, controls: PointLike[], t: number) => PointLike;
export declare const bezier: (out: PointLike, controls: PointLike[], t: number) => PointLike;
export declare const rationalBezier: (out: PointLike, controls: PointLike[], weight: number[], t: number) => PointLike;
export declare const centralDifference: (fn: any, h: number, ...args: any[]) => number;
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
export declare function derivative(f: (x: number) => number, x: number, h?: number): number;
/**
  * 使用中心差分法计算函数在x处的N阶导数（数值方法）
  * @param f 原始函数
  * @param n 导数阶数 (n >= 0)
  * @param x 求导点
  * @param h 步长 (默认1e-5)
  * @returns N阶导数的数值近似
  */
export declare function numericalNthDerivative(f: (x: number) => number, n: number, x: number, h?: number): number;
export declare const integral: (fn: any, a: number, b: number, h?: number) => number;
/**
 * @description 中心差分
*/
export declare const centralDifferential: (fn: any, h: number, ...args: any[]) => number;
export declare const forwardDifferential: (fn: any, h: number, ...args: any[]) => number;
export declare const backwardDifferential: (fn: any, h: number, ...args: any[]) => number;
export declare function partialDerivative(f: (...args: number[]) => number, varIndex: number, point: number[], h?: number): number;
/**
 * 计算梯形面积
 * @param {number} x0 - 边起点的 x 坐标
 * @param {number} y0 - 边起点的 y 坐标
 * @param {number} x1 - 边终点的 x 坐标
 * @param {number} y1 - 边终点的 y 坐标
 * @returns {number} - 返回有符号面积
 */
export declare function computeEdgeContribution(x0: number, y0: number, x1: number, y1: number): number;
export declare const degreesToRadian: (degrees: number) => number;
export declare const radianToDegrees: (radian: number) => number;
/**
 *
 * @param value 映射值
 * @param inMin 定义域domain 输入
 * @param inMax
 * @param outMin 值域range 输出
 * @param outMax
 * @returns
 */
export declare function map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number;
export declare const sign: (x: number) => 0 | 1 | -1;
export declare const absSign: (x: number) => 1 | -1;
export declare const random: (min: number, max: number) => number;
export declare const randomFloor: (min: number, max: number) => number;
export declare const randomCeil: (min: number, max: number) => number;
export declare const randomRound: (min: number, max: number) => number;
export declare const fract: (v: number) => number;
export declare const ceilMod: (v: number, m: number) => number;
export declare const floorMod: (v: number, m: number) => number;
export declare const truncMod: (v: number, m: number) => number;
export declare const calcStartCoordinateValue: (unit: number, offset: number, scalar: number) => number;
export declare const calcStartGraduationValue: (unit: number, offset: number, scalar: number) => number;
export declare const calcScalePan: (out: PointLike, oldScale: number, newScale: number, offset: PointLike, origin: PointLike) => PointLike;
export declare const generateGraduations: (options: {
    width: number;
    height: number;
    tickSplitHeight: number;
    tickMarkHeight: number;
    rulerUnit: number;
    offset: number;
    scaleFactor: number;
    tickSplitStep: number;
}) => void;
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
export declare const wheelToScaleArtboard: (out: PointLike, oldScale: number, newScale: number, offset: PointLike, mouse: PointLike) => PointLike;
export declare const divmod: (dividend: number, divisor: number) => number[];
export declare const divmod2: (dividend: number, divisor: number) => number[];
export declare const mod: (v: number, m: number) => number;
export declare const modUp: (a: number, b: number) => number;
export declare const modDown: (a: number, b: number) => number;
export declare const clamp: (v: number, min: number, max: number) => number;
export declare const clamp01: (v: number) => number;
export declare const interpolate: (start: number, end: number, t: number) => number;
export declare const mix: (edge0: number, edge1: number, t: number) => number;
export declare const smoonthstep: (edge1: number, edge2: number, value: number) => number;
export declare const step: (edge: number, value: number) => 0 | 1;
export declare const swap: (arr: any[], from: any, to: any) => void;
export declare const isFinite: (x: any) => boolean;
export declare const factorial: (x: number) => number;
export declare const fastFactorial: (x: number) => number;
type MathFunction = (x: number) => number;
type DerivativeFunction = (order: number, x: number) => number;
interface SeriesTerm {
    coefficient: number;
    exponent: number;
    factorial?: number;
}
interface SeriesResult {
    terms: SeriesTerm[];
    approximation: number;
    errorEstimate?: number;
}
export declare class MaclaurinSeries {
    /**
     * 计算函数的麦克劳林级数展开
     * @param fn 要展开的函数
     * @param center 展开中心（默认为0，对于麦克劳林）
     * @param maxTerms 最大项数
     * @param h 数值微分的步长（如果提供数值导数）
     */
    static expand(fn: MathFunction | DerivativeFunction, maxTerms?: number, h?: number): SeriesTerm[];
    /**
     * 计算n阶导数（数值方法或解析方法）
     */
    private static calculateNthDerivative;
    /**
     * 创建导函数
     */
    private static createDerivativeFunction;
    /**
     * 计算阶乘
     */
    static factorial(n: number): number;
    /**
     * 使用麦克劳林级数近似计算函数值
     */
    static approximate(fn: MathFunction | DerivativeFunction, x: number, maxTerms?: number): SeriesResult;
    /**
     * 估计截断误差（使用拉格朗日余项）
     */
    private static estimateError;
    /**
     * 预定义常见函数的麦克劳林展开
     */
    static predefined: {
        /**
         * 指数函数 e^x
         */
        exp(maxTerms?: number): SeriesTerm[];
        /**
         * 正弦函数 sin(x)
         */
        sin(maxTerms?: number): SeriesTerm[];
        /**
         * 余弦函数 cos(x)
         */
        cos(maxTerms?: number): SeriesTerm[];
        /**
         * 几何级数 1/(1-x)
         */
        geometric(maxTerms?: number): SeriesTerm[];
        /**
         * 自然对数 ln(1+x)
         */
        ln1px(maxTerms?: number): SeriesTerm[];
    };
    /**
     * 格式化显示级数
     */
    static formatSeries(terms: SeriesTerm[], variable?: string): string;
}
export declare const summation: (i: number, n: number, add: (sum: number, index: number, len: number) => number) => number;
export declare const bernstein: (n: number, i: number, t: number) => number;
export declare const substitution: (n: number) => number;
/**
 * n!/(n-r)! 或 (r~n)!
 * 排队问题。
    排班问题。
    生成所有可能的顺序。
 * @param {*} n
 * @param {*} r
 * @returns
 */
export declare const nPr: (n: number, r: number) => number;
/**
 * 选择团队成员。
计算彩票中奖概率。
从菜单中选择固定数量的菜品。

 * @param {*} n
 * @param {*} r
 * @returns
 */
export declare const nCr: (n: number, r: number) => number;
export declare function combination(n: number, k: number): number;
export declare function roundPrecision(value: number, p: number): number;
export declare function truncPrecision(value: number, p: number): number;
export declare function floorPrecision(value: number, p: number): number;
export declare function ceilPrecision(value: number, p: number): number;
export declare function bSplineBasis(i: number, k: number, t: number, knots: number[]): number;
export declare function bSplineCurve(controlPoints: number[][], degree: number, knots: number[], t: number): number[];
export declare function createLowMatrix(r: number, c: number, n: number, m: Float32Array | number[]): Float32Array<ArrayBuffer>;
export declare function determinantFromNthMatrix(m: Float32Array | number[]): number;
export declare function transposeFromNthMatrix(m: Float32Array | number[]): Float32Array<ArrayBuffer>;
export declare function adjointFromNthMatrix(m: Float32Array | number[]): Float32Array<ArrayBuffer>;
export declare function invertFromNMatrix(m: Float32Array | number[]): Float32Array<ArrayBuffer>;
export declare function identityMatrix(out: Float32Array | number[], n: number): number[] | Float32Array<ArrayBufferLike>;
export declare const getIntersectionGridCell: (options: {
    start: Vector2;
    dir: Vector2;
    rows: number;
    cols: number;
    cellWidth: number;
    cellHeight: number;
    onCollisionDetection?: (x: number, y: number) => boolean;
}) => Vector2[];
export declare const getRays3D: (player: {
    rotate: number;
    x: number;
    y: number;
}, map: number[][], fovAngle: number, width: number, height: number, cellSize: number, fish?: boolean) => {
    diffuse: number;
    x: number;
    row: number;
    col: number;
    value: number;
    side: boolean;
    dir: Vector2;
    origin: Vector2;
    distance: number;
    noFishDistance: number;
}[];
export declare const drawRays3d: (options: {
    getStrokeColor: (ray: any) => string;
    ctx: CanvasRenderingContext2D;
    rays: any[];
    map: number[][];
}) => void;
export declare function invertFromNMatrixByElementary(m: Float32Array | number[]): Float32Array<ArrayBuffer>;
export declare function multiplyMatrices(result: Float32Array | number[] | null, a: Float32Array | number[], b: Float32Array | number[]): number[] | Float32Array<ArrayBufferLike>;
export declare function invertFromNMatrixByLU(matrix: Float32Array | number[]): number[] | Float32Array<ArrayBufferLike>;
export declare function trapezoidalIntegralArea(f: (x: number) => number, a: number, b: number, n: number): number;
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
export declare class BezierExtremaFinder {
    /**
     * 查找贝塞尔曲线在指定维度上的极值参数
     * @param controlPoints 控制点数组
     * @param dimension 维度 ('x' 或 'y')
     * @returns 极值对应的参数 t 数组
     */
    static findExtremaParameters(controlPoints: Point[], dimension: 'x' | 'y'): number[];
    /**
     * 查找贝塞尔曲线的所有极值点（包括x和y方向）
     * @param controlPoints 控制点数组
     * @returns 极值点数组（包含参数t和对应的点坐标）
     */
    static findAllExtrema(controlPoints: Point[]): Array<{
        t: number;
        point: Point;
    }>;
    /**
     * 计算贝塞尔曲线在参数t处的点
     * @param controlPoints 控制点数组
     * @param t 参数 [0, 1]
     * @returns 曲线上的点
     */
    static evaluateBezier(controlPoints: Point[], t: number): Point;
    /**
     * 求解多项式方程的实根（使用数值方法）
     * @param coefficients 多项式系数，从高次到低次
     * @returns 在 [0, 1] 区间内的实根数组
     */
    private static findPolynomialRoots;
    /**
     * 求解二次方程
     */
    private static solveQuadratic;
    /**
     * 求解三次方程（使用Cardano公式）
     */
    private static solveCubic;
    /**
     * 使用牛顿迭代法数值求解多项式根
     */
    private static solvePolynomialNumerically;
    /**
     * 牛顿迭代法
     */
    private static newtonRaphson;
    /**
     * 计算多项式及其导数在某点的值
     */
    private static evaluatePolynomialAndDerivative;
    /**
     * 计算二项式系数 C(n, k)
     */
    private static binomialCoefficient;
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
export declare function solveQuadratic(a: number, b: number, c: number): number[];
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
export declare function solveCubic(a: number, b: number, c: number, d: number): number[];
/**
 * 使用Cardano公式求解三次方程 ax³ + bx² + cx + d = 0
 * @param {number} a - 三次项系数
 * @param {number} b - 二次项系数
 * @param {number} c - 一次项系数
 * @param {number} d - 常数项
 * @returns {number[]} 实数根数组（可能有1-3个根）
 */
export declare function solveCubicEpsilon(a: number, b: number, c: number, d: number, epsilon?: number): number[];
/**
 * 求解二次方程 ax² + bx + c = 0
 */
export declare function solveQuadraticEpsilon(a: number, b: number, c: number, epsilon?: number): number[];
/**
 * 求解四次方程 ax⁴ + bx³ + cx² + dx + e = 0
 * 使用Ferrari方法
 */
export declare function solveQuarticEpsilon(a: number, b: number, c: number, d: number, e: number, epsilon?: number): number[];
export declare function bisection(f: (a: any) => number, a: any, b: any, tolerance?: number, maxIterations?: number): number;
export declare function newtonRaphson(f: (a: any) => number, df: (a: any) => number, x0: any, tolerance?: number, maxIterations?: number): any;
export declare function secant(f: (a: any) => number, x0: any, x1: any, tolerance?: number, maxIterations?: number): any;
/**
 * 布伦特方法求根 - 结合二分法、割线法和逆二次插值
 * @param {Function} f - 目标函数
 * @param {number} a - 区间左端点
 * @param {number} b - 区间右端点
 * @param {number} tolerance - 容差
 * @param {number} maxIterations - 最大迭代次数
 * @returns {number} 根的近似值
 */
export declare function brentMethod(f: (x: number) => number, a: number, b: number, tolerance?: number, maxIterations?: number): number;
export declare function periodicFunction(a: number, b: number, c: number, d: number): (x: number) => number;
export {};
