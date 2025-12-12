/**
 * 数值方法库
 * 提供求解方程和线性系统的各种数值方法
 */
/**
 * 数值方法结果接口
 */
interface NumericalResult {
    root: number;
    iterations: number;
    converged: boolean;
    error?: number;
    history?: IterationStep[];
}
/**
 * 单次迭代步骤信息
 */
interface IterationStep {
    iteration: number;
    x?: number;
    fx?: number;
    error: number;
    [key: string]: any;
}
/**
 * 数学函数类型
 */
type MathFunction = (x: number) => number;
/**
 * 矩阵类型
 */
type Matrix = number[][];
/**
 * 牛顿迭代法 - 使用函数和导数信息快速收敛
 * @param f 目标函数 f(x) = 0
 * @param df 目标函数的导数
 * @param x0 初始猜测值
 * @param tolerance 容差，默认 1e-10
 * @param maxIterations 最大迭代次数，默认 100
 * @returns 数值结果对象
 */
declare function newtonRaphson(f: MathFunction, df: MathFunction, x0: number, tolerance?: number, maxIterations?: number): NumericalResult;
/**
 * 弦截法 - 不需要导数信息的牛顿法变种
 * 使用两点间的弦来近似导数
 * @param f 目标函数
 * @param x0 第一个初始点
 * @param x1 第二个初始点
 * @param tolerance 容差
 * @param maxIterations 最大迭代次数
 * @returns 数值结果对象
 */
declare function secantMethod(f: MathFunction, x0: number, x1: number, tolerance?: number, maxIterations?: number): NumericalResult;
/**
 * 不动点迭代法 - 将方程改写为 x = g(x) 形式
 * @param g 迭代函数，满足 x = g(x)
 * @param x0 初始猜测值
 * @param tolerance 容差
 * @param maxIterations 最大迭代次数
 * @returns 数值结果对象
 */
declare function fixedPointIteration(g: MathFunction, x0: number, tolerance?: number, maxIterations?: number): NumericalResult;
/**
 * 二分法 - 在区间内可靠地寻找根
 * 要求函数在区间端点异号
 * @param f 目标函数
 * @param a 区间左端点
 * @param b 区间右端点
 * @param tolerance 容差
 * @param maxIterations 最大迭代次数
 * @returns 数值结果对象
 */
declare function bisection(f: MathFunction, a: number, b: number, tolerance?: number, maxIterations?: number): NumericalResult;
/**
 * 试位法 - 改进的二分法，使用线性插值
 * 比二分法通常收敛更快
 * @param f 目标函数
 * @param a 区间左端点
 * @param b 区间右端点
 * @param tolerance 容差
 * @param maxIterations 最大迭代次数
 * @returns 数值结果对象
 */
declare function falsePosition(f: MathFunction, a: number, b: number, tolerance?: number, maxIterations?: number): NumericalResult;
/**
 * 高斯消元法 - 求解线性方程组 Ax = b
 * 通过前向消元和回代求解
 * @param A 系数矩阵
 * @param b 右侧向量
 * @returns 解向量 x
 */
declare function gaussianElimination(A: Matrix, b: number[]): number[];
/**
 * LU分解 - 将矩阵分解为下三角矩阵L和上三角矩阵U
 * 用于多次求解同一矩阵不同右侧向量的情况
 * @param A 待分解矩阵
 * @returns 包含L和U矩阵的对象
 */
declare function luDecomposition(A: Matrix): {
    L: Matrix;
    U: Matrix;
};
/**
 * 使用LU分解求解线性方程组
 * 分解后可以高效求解多个右侧向量
 * @param A 系数矩阵
 * @param b 右侧向量
 * @returns 解向量 x
 */
declare function solveWithLU(A: Matrix, b: number[]): number[];
/**
 * 雅可比迭代法 - 求解线性方程组的迭代方法
 * 适用于大型稀疏矩阵
 * @param A 系数矩阵
 * @param b 右侧向量
 * @param x0 初始猜测解，默认为零向量
 * @param tolerance 容差
 * @param maxIterations 最大迭代次数
 * @returns 包含解和迭代信息的对象
 */
declare function jacobiIteration(A: Matrix, b: number[], x0?: number[], tolerance?: number, maxIterations?: number): {
    solution: number[];
    iterations: number;
    converged: boolean;
};
/**
 * 计算两个向量的最大绝对误差
 * @param x1 第一个向量
 * @param x2 第二个向量
 * @returns 最大绝对误差
 */
declare function vectorError(x1: number[], x2: number[]): number;
/**
 * 矩阵乘法
 * @param A 第一个矩阵
 * @param B 第二个矩阵
 * @returns 乘积矩阵
 */
declare function matrixMultiply(A: Matrix, B: Matrix): Matrix;
/**
 * 打印矩阵
 * @param matrix 要打印的矩阵
 * @param name 矩阵名称
 */
declare function printMatrix(matrix: Matrix, name?: string): void;
export { type NumericalResult, type IterationStep, type MathFunction, type Matrix, newtonRaphson, secantMethod, fixedPointIteration, bisection, falsePosition, gaussianElimination, luDecomposition, solveWithLU, jacobiIteration, vectorError, matrixMultiply, printMatrix };
