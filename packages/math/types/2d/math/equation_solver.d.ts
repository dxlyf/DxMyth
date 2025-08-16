/**
 * 通用方程求解器，支持求解常见的代数方程：
 * - 一元一次
 * - 一元二次
 * - 一元三次
 * - 一元四次（Ferrari 法）
 * - 任意阶多项式（数值法）
 * - 二元一次（联立）
 * - 特例：二元二次（圆与直线）
 */
export declare class EquationSolver {
    static EPS: number;
    /**
     * 求解一元一次方程 ax + b = 0
     * @param a 系数 a
     * @param b 常数 b
     * @returns 解 x 或 null（无解）
     */
    static solveLinear1(a: number, b: number): number | null;
    /**
    * 求解一元二次方程 ax^2 + bx + c = 0
    * @param a 系数 a
    * @param b 系数 b
    * @param c 常数 c
    * @returns 解的数组（0、1 或 2 个实数解）
    */
    static solveQuadratic1(a: number, b: number, c: number): number[];
    /**
     * 求解二元一次联立方程组：
     * a1 x + b1 y = c1
     * a2 x + b2 y = c2
     * @returns 解对象 { x, y } 或 null（无解或无唯一解）
     */
    static solveLinear2(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): {
        x: number;
        y: number;
    } | null;
    /**
 * 求解一元三次方程 ax^3 + bx^2 + cx + d = 0（实数根）
 * 使用卡尔丹公式 Cardano’s method
 * @returns 实数根数组（最多 3 个）
 */
    static solveCubic1(a: number, b: number, c: number, d: number): number[];
    /**
     * 求解二元二次联立方程（支持特例，如一个是圆，一个是直线）
     *
     * 示例：
     * x^2 + y^2 = r^2
     * y = kx + b
     *
     * @returns 交点数组（最多两个）
     */
    static solveCircleLineIntersection(r: number, k: number, b: number): {
        x: number;
        y: number;
    }[];
    /**
     * 求解一元二次方程（含复数根）ax^2 + bx + c = 0
     * @param a 系数 a
     * @param b 系数 b
     * @param c 常数 c
     * @returns 解的复数数组（re, im）
     */
    static solveQuadraticComplex(a: number, b: number, c: number): {
        re: number;
        im: number;
    }[];
    /**
     * 求解一元四次方程 ax^4 + bx^3 + cx^2 + dx + e = 0（Ferrari 法）
     * @param a,b,c,d,e 系数
     * @returns 实数根数组
     */
    static solveQuartic1(a: number, b: number, c: number, d: number, e: number): number[];
    /**
    * 求解任意多项式实根（牛顿法迭代）
    * @param coeffs 多项式系数数组，从最高次到最低次
    * @param guess 初始猜测值
    * @returns 实根数组
    */
    static solvePolynomialNumeric(coeffs: number[], guess?: number, maxIter?: number, tol?: number): number[];
    /**
     * 拉格朗日插值：给定 (xi, yi) 点，构造插值多项式在 x 处的值
     * @param points 点数组 [{x,y}]
     * @param x 要插值的位置
     * @returns 插值函数值 f(x)
     */
    static lagrangeInterpolation(points: {
        x: number;
        y: number;
    }[], x: number): number;
}
type Point = {
    x: number;
    y: number;
};
export declare class LineEquation {
    A: number;
    B: number;
    C: number;
    /**
     * 通过一般式 Ax + By + C = 0 构造直线
     */
    constructor(A: number, B: number, C: number);
    /**
     * (x-x0)(y1-y0)=(y-y0)(x1-x0)
     *
     * 创建：通过两点 (x0, y0) 和 (x1, y1) 定义直线
     */
    static fromTwoPoints(p0: Point, p1: Point): LineEquation;
    /**
     * 创建：通过斜率和截距 y = m*x + b
     */
    static fromSlopeIntercept(m: number, b: number): LineEquation;
    /**
     * 创建：通过点和斜率
     */
    static fromPointSlope(p: Point, m: number): LineEquation;
    /**
     * 创建：截距式（x/a + y/b = 1）
     * @param a x轴截距 ≠ 0
     * @param b y轴截距 ≠ 0
     */
    static fromIntercepts(a: number, b: number): LineEquation;
    /**
     * 创建：点向式，给定点 p 和方向向量 v
     * @param p 点 p(x0, y0)
     * @param v 方向向量 v(vx, vy)
     */
    static fromPointDirection(p: Point, v: Point): LineEquation;
    /**
     * 创建：法向式，通过一个法向量和一点
     * @param n 法向量 n(A, B)
     * @param p 点 p(x0, y0)
     */
    static fromNormalThroughPoint(n: Point, p: Point): LineEquation;
    /**
     * 创建：交点式，给定 x、y 轴交点
     * 即与 x 轴交于 (a, 0)，与 y 轴交于 (0, b)
     */
    static fromXYIntercepts(a: number, b: number): LineEquation;
    /**
     * 获取斜率（若为垂直线返回 Infinity）
     */
    getSlope(): number;
    /**
     * 获取 y 截距（若为垂直线返回 null）
     */
    getYIntercept(): number | null;
    /**
     * 计算 y = f(x)，即给定 x 计算 y 值（前提是 B ≠ 0）
     */
    getY(x: number): number | null;
    /**
     * 计算 x = f(y)，即给定 y 计算 x 值（前提是 A ≠ 0）
     */
    getX(y: number): number | null;
    /**
     * 判断点是否在直线上
     */
    isPointOnLine(p: Point, epsilon?: number): boolean;
    /**
     * 计算点到直线的距离
     */
    distanceToPoint(p: Point): number;
    /**
     * 构造与当前直线平行，经过给定点的直线
     */
    parallelThrough(p: Point): LineEquation;
    /**
     * 构造与当前直线垂直，经过给定点的直线
     */
    perpendicularThrough(p: Point): LineEquation;
    /**
     * 求两直线的交点（无交点返回 null）
     */
    static intersection(l1: LineEquation, l2: LineEquation): Point | null;
    /**
     * 将直线转换为字符串形式 Ax + By + C = 0
     */
    toString(): string;
}
export {};
