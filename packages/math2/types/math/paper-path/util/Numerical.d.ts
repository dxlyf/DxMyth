/**
 * 移植自 paper/src/util/Numerical.js。
 *
 * 数值工具:epsilon 比较、求根与积分。这里只是一个普通命名空间对象，不需要类。
 */
/** 把数值限制在给定区间内。 */
export declare function clamp(value: number, min: number, max: number): number;
export declare const Numerical: {
    /** 判断数值是否接近 0 时使用的极小绝对值。 */
    EPSILON: number;
    /** 双精度（Javascript Number）机器 epsilon 的一半。 */
    MACHINE_EPSILON: number;
    /** 处理 curve-time 参数时使用的 epsilon。 */
    CURVETIME_EPSILON: number;
    /** 做"几何"判断（如点到直线的距离）时使用的 epsilon。 */
    GEOMETRIC_EPSILON: number;
    /** 做"三角"判断（如共线性）时使用的 epsilon。 */
    TRIGONOMETRIC_EPSILON: number;
    /** 按角度（度）判断时使用的 epsilon，例如 `arcTo()` 中。 */
    ANGULAR_EPSILON: number;
    /**
     * Kappa 是用贝塞尔曲线绘制圆时缩放控制柄所用的值。
     */
    KAPPA: number;
    /**
     * 返回按给定量级比较坐标时的容差:EPSILON 或更大的可选 epsilon，或在低于
     * 坐标分辨率时取最后一位的两个单位，使相接的数值仍被判定为相接 (#1940)。
     */
    getEpsilon(magnitude: number, epsilon?: number): number;
    /** 判断数值在 EPSILON 容差内是否为 0。 */
    isZero(val: number): boolean;
    isMachineZero(val: number): boolean;
    clamp: typeof clamp;
    /** 高斯-勒让德数值积分。 */
    integrate(f: (x: number) => number, a: number, b: number, n: number): number;
    /** 结合二分法的牛顿-拉夫逊求根。 */
    findRoot(f: (x: number) => number, df: (x: number) => number, x: number, a: number, b: number, n: number, tolerance: number): number;
    /**
     * 用 ITP 方法找出函数在 `a` 与 `b` 之间变号的位置，已知两端取值 `fa`、
     * `fb` 异号。它在该快的地方和割线法一样快，且永远不会慢于二分法。
     * 参考 kurbo 的 solve_itp()。
     */
    findSignChange(f: (x: number) => number, a: number, b: number, fa: number, fb: number, tolerance: number): number;
    /**
     * 以数值稳定的方式求解一元二次方程 ax^2 + bx + c = 0 的 x 值。
     *
     * @return 找到的实根个数；如果有无穷多解则返回 -1
     */
    solveQuadratic(a: number, b: number, c: number, roots: number[], min?: number, max?: number): number;
    /**
     * 用数值稳定的方法求解一元三次方程 ax^3 + bx^2 + cx + d = 0。
     *
     * @return 找到的实根个数；如果有无穷多解则返回 -1
     */
    solveCubic(a: number, b: number, c: number, d: number, roots: number[], min?: number, max?: number): number;
    /**
     * 求出 Bernstein 形式多项式在 [0, 1] 上的根:不断细分，直到每一段的系数
     * 至多变号一次。没有变号的段没有根，变号一次的段恰有一个根，因为
     * Bernstein 形式具有变差缩减性。落在舍入误差内的系数按 0 处理:只有这类
     * 系数的段算作一个根，比给定宽度还窄、仍可能含根的段也算作一个根。
     */
    solveBernstein(coefficients: number[], errors: number[], roots: number[], width: number): number;
};
