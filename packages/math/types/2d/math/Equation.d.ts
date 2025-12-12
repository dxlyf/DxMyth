/**
 * 方程求根工具函数
 */
/** 二次方程求根 ax² + bx + c = 0 */
export declare function solveQuadratic(a: number, b: number, c: number): number[];
/** 三次方程求根 ax³ + bx² + cx + d = 0 (Cardano公式) */
export declare function solveCubic(a: number, b: number, c: number, d: number): number[];
/** 三次方程求根 Shengjin 公式 */
export declare function solveCubicByShengjin(a: number, b: number, c: number, d: number): number[];
/** 二分法求根 */
export declare function bisection(f: (x: number) => number, a: number, b: number, tolerance?: number, maxIterations?: number): number | null;
/** 牛顿法求根 */
export declare function newton(f: (x: number) => number, df: (x: number) => number, x0: number, tolerance?: number, maxIterations?: number): number | null;
/** 割线法求根 */
export declare function secant(f: (x: number) => number, x0: number, x1: number, tolerance?: number, maxIterations?: number): number | null;
/** 弦截法（改进的割线法）求根 */
export declare function falsePosition(f: (x: number) => number, a: number, b: number, tolerance?: number, maxIterations?: number): number | null;
/** Brent方法求根（二分法、割线法和逆二次插值的结合） */
export declare function brent(f: (x: number) => number, a: number, b: number, tolerance?: number, maxIterations?: number): number | null;
/** 多项式求根（使用伴随矩阵法） */
export declare function solvePolynomial(coefficients: number[]): number[];
export declare function getBezierPowerBasis(controls: {
    x: number;
    y: number;
}[]): any[];
/** 圆的参数方程 */
export declare function circleParametric(centerX: number, centerY: number, radius: number, t: number): {
    x: number;
    y: number;
};
/** 椭圆的参数方程 */
export declare function ellipseParametric(centerX: number, centerY: number, radiusX: number, radiusY: number, t: number): {
    x: number;
    y: number;
};
/** 抛物线的参数方程 */
export declare function parabolaParametric(a: number, b: number, c: number, t: number): {
    x: number;
    y: number;
};
/** 双曲线的参数方程 */
export declare function hyperbolaParametric(a: number, b: number, t: number): {
    x: number;
    y: number;
};
/** 螺旋线的参数方程（阿基米德螺旋） */
export declare function spiralParametric(a: number, t: number): {
    x: number;
    y: number;
};
/** 对数螺旋的参数方程 */
export declare function logarithmicSpiralParametric(a: number, b: number, t: number): {
    x: number;
    y: number;
};
/** 心形线的参数方程 */
export declare function cardioidParametric(a: number, t: number): {
    x: number;
    y: number;
};
/** 玫瑰线的参数方程 */
export declare function roseParametric(a: number, n: number, t: number): {
    x: number;
    y: number;
};
/** 李萨如图形的参数方程 */
export declare function lissajousParametric(a: number, b: number, aFreq: number, bFreq: number, delta: number, t: number): {
    x: number;
    y: number;
};
/** 三次贝塞尔曲线的参数方程 */
export declare function cubicBezierParametric(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, p3: {
    x: number;
    y: number;
}, t: number): {
    x: number;
    y: number;
};
/** 二次贝塞尔曲线的参数方程 */
export declare function quadBezierParametric(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, t: number): {
    x: number;
    y: number;
};
/** 直线方程：y = mx + b */
export declare function linearEquation(m: number, b: number, x: number): number;
/** 二次函数：y = ax² + bx + c */
export declare function quadraticEquation(a: number, b: number, c: number, x: number): number;
/** 三次函数：y = ax³ + bx² + cx + d */
export declare function cubicEquation(a: number, b: number, c: number, d: number, x: number): number;
/** 指数函数：y = a * e^(bx) */
export declare function exponentialEquation(a: number, b: number, x: number): number;
/** 对数函数：y = a * ln(bx) */
export declare function logarithmicEquation(a: number, b: number, x: number): number;
/** 正弦函数：y = a * sin(bx + c) */
export declare function sineEquation(a: number, b: number, c: number, x: number): number;
/** 余弦函数：y = a * cos(bx + c) */
export declare function cosineEquation(a: number, b: number, c: number, x: number): number;
/** 正切函数：y = a * tan(bx + c) */
export declare function tangentEquation(a: number, b: number, c: number, x: number): number;
/** 幂函数：y = a * x^b */
export declare function powerEquation(a: number, b: number, x: number): number;
/** 高斯函数：y = a * e^(-(x-b)²/(2c²)) */
export declare function gaussianEquation(a: number, b: number, c: number, x: number): number;
/** 逻辑斯谛函数：y = L / (1 + e^(-k(x-x0))) */
export declare function logisticEquation(L: number, k: number, x0: number, x: number): number;
/** 阶跃函数（海维赛德函数） */
export declare function stepEquation(x: number, threshold?: number): number;
/** 符号函数 */
export declare function signEquation(x: number): number;
/** 绝对值函数：y = |ax + b| */
export declare function absoluteEquation(a: number, b: number, x: number): number;
/** 分段线性函数 */
export declare function piecewiseLinearEquation(points: {
    x: number;
    y: number;
}[], x: number): number;
/** 方波函数 */
export declare function squareWaveEquation(amplitude: number, frequency: number, dutyCycle: number, x: number): number;
/** 锯齿波函数 */
export declare function sawtoothWaveEquation(amplitude: number, frequency: number, x: number): number;
/** 三角波函数 */
export declare function triangleWaveEquation(amplitude: number, frequency: number, x: number): number;
/** 参数方程转笛卡尔坐标（圆） */
export declare function parametricToCartesianCircle(centerX: number, centerY: number, radius: number, t: number): {
    equation: string;
    x: number;
    y: number;
};
/** 参数方程转笛卡尔坐标（椭圆） */
export declare function parametricToCartesianEllipse(centerX: number, centerY: number, radiusX: number, radiusY: number, t: number): {
    equation: string;
    x: number;
    y: number;
};
/** 极坐标转笛卡尔坐标 */
export declare function polarToCartesian(r: number, theta: number): {
    x: number;
    y: number;
};
/** 笛卡尔坐标转极坐标 */
export declare function cartesianToPolar(x: number, y: number): {
    r: number;
    theta: number;
};
/** 球坐标转笛卡尔坐标 */
export declare function sphericalToCartesian(r: number, theta: number, phi: number): {
    x: number;
    y: number;
    z: number;
};
/** 笛卡尔坐标转球坐标 */
export declare function cartesianToSpherical(x: number, y: number, z: number): {
    r: number;
    theta: number;
    phi: number;
};
/** 数值求导（一次导数）- 使用中心差分法 */
export declare function firstDerivative(func: (x: number) => number, x: number, h?: number): number;
/** 数值求二次导数 */
export declare function secondDerivative(func: (x: number) => number, x: number, h?: number): number;
/** 数值求n次导数 */
export declare function nthDerivative(func: (x: number) => number, n: number, x: number, h?: number): number;
/** 符号求导 - 多项式 */
export declare function polynomialDerivative(coefficients: number[]): number[];
/** 符号求导 - 三角函数 */
export declare function trigonometricDerivative(func: 'sin' | 'cos' | 'tan', coefficient?: number, phase?: number): (x: number) => number;
/** 符号求导 - 指数函数 */
export declare function exponentialDerivative(base: number, coefficient?: number): (x: number) => number;
/** 符号求导 - 对数函数 */
export declare function logarithmicDerivative(coefficient?: number): (x: number) => number;
/** 符号求导 - 幂函数 */
export declare function powerDerivative(exponent: number, coefficient?: number): (x: number) => number;
/** 数值积分 - 梯形法则 */
export declare function trapezoidalIntegration(func: (x: number) => number, a: number, b: number, n?: number): number;
/** 数值积分 - 辛普森法则 */
export declare function simpsonIntegration(func: (x: number) => number, a: number, b: number, n?: number): number;
/** 数值积分 - 龙贝格积分法 */
export declare function rombergIntegration(func: (x: number) => number, a: number, b: number, maxIterations?: number, tolerance?: number): number;
/** 不定积分 - 多项式 */
export declare function polynomialIntegral(coefficients: number[], constant?: number): number[];
/** 不定积分 - 基本函数 */
export declare function basicIntegral(func: 'sin' | 'cos' | 'exp' | 'ln' | 'power', coefficient?: number, exponent?: number, constant?: number): (x: number) => number;
/** 定积分 - 高斯积分法 */
export declare function gaussianIntegration(func: (x: number) => number, a: number, b: number, n?: number): number;
/** 多重积分 - 二重积分 */
export declare function doubleIntegral(func: (x: number, y: number) => number, xMin: number, xMax: number, yMin: number, yMax: number, nx?: number, ny?: number): number;
/** 路径积分 - 线积分 */
export declare function lineIntegral(xFunc: (t: number) => number, yFunc: (t: number) => number, integrand: (x: number, y: number, dx: number, dy: number) => number, tStart: number, tEnd: number, n?: number): number;
