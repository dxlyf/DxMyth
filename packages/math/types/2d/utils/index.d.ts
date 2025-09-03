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
export declare function usignfactorial(n: number): number;
export declare function fast_nCr(n: number, r: number): number;
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
export declare function derivative(f: (x: number) => number, x: number, h?: number): number;
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
export declare const forwardDifferential: (fn: any, h: number, ...args: any[]) => number;
export declare const backwardDifferential: (fn: any, h: number, ...args: any[]) => number;
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
export declare const sum: (i: number, n: number, add: (sum: number, index: number, len: number) => number) => number;
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
export declare function solveQuadratic(a: number, b: number, c: number): number[];
export declare function solveCubic(a: number, b: number, c: number, d: number): number[];
export {};
