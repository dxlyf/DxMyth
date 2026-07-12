export declare const EPSILON = 0.000001;
export declare const PI: number;
export declare const PI_2: number;
export declare const PI_4: number;
export declare const TWO_PI: number;
export declare const DEG_TO_RAD: number;
export declare const RAD_TO_DEG: number;
export declare const degToRad: (deg: number) => number;
export declare const radToDeg: (rad: number) => number;
export declare const equalsEpsilon: (a: number, b: number, epsilon?: number) => boolean;
export declare const equals: (a: number, b: number) => boolean;
export declare const isFinite: (v: number) => boolean;
export declare const interpolate: (a: number, b: number, t: number) => number;
export declare const random: (min: number, max: number) => number;
export declare const clamp: (value: number, min: number, max: number) => number;
export declare const smoothStep: (t: number) => number;
export declare const mix: (value: number, start: number, end: number) => number;
/**
 * 计算阶乘，使用缓存优化性能
 */
export declare const factorial: (n: number) => number;
/**
 * 计算组合数 C(n,k) = n! / (k! * (n-k)!)
 * 使用递推公式优化，避免大数溢出
 */
export declare const nCr: (n: number, k: number) => number;
/**
 * 计算排列数 P(n,k) = n! / (n-k)!
 */
export declare const nPr: (n: number, k: number) => number;
/**
 * 求解一元二次方程 ax² + bx + c = 0（a ≠ 0）
 * @param a - 二次项系数
 * @param b - 一次项系数
 * @param c - 常数项
 * @returns 实根数组（可能 0、1、2 个根）
 */
export declare function solveQuadratic(a: number, b: number, c: number): number[];
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
export declare function solveCubicByCardano(a: number, b: number, c: number, d: number): number[];
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
export declare function solveCubicByShengjin(a: number, b: number, c: number, d: number): number[];
