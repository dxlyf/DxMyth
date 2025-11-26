/**
 * 数值方法库
 * 提供求解方程和线性系统的各种数值方法
 */

// ==================== 类型定义 ====================

/**
 * 数值方法结果接口
 */
interface NumericalResult {
  root: number;                    // 求得的根
  iterations: number;              // 迭代次数
  converged: boolean;              // 是否收敛
  error?: number;                  // 最终误差
  history?: IterationStep[];       // 迭代历史记录
}

/**
 * 单次迭代步骤信息
 */
interface IterationStep {
  iteration: number;               // 迭代次数
  x?: number;                      // 当前x值
  fx?: number;                     // 函数值
  error: number;                   // 当前误差
  [key: string]: any;              // 其他可选字段
}

/**
 * 数学函数类型
 */
type MathFunction = (x: number) => number;

/**
 * 矩阵类型
 */
type Matrix = number[][];

// ==================== 迭代法 ====================

/**
 * 牛顿迭代法 - 使用函数和导数信息快速收敛
 * @param f 目标函数 f(x) = 0
 * @param df 目标函数的导数
 * @param x0 初始猜测值
 * @param tolerance 容差，默认 1e-10
 * @param maxIterations 最大迭代次数，默认 100
 * @returns 数值结果对象
 */
function newtonRaphson(
  f: MathFunction,
  df: MathFunction,
  x0: number,
  tolerance: number = 1e-10,
  maxIterations: number = 100
): NumericalResult {
  let x = x0;
  const history: IterationStep[] = [];

  for (let i = 0; i < maxIterations; i++) {
    const fx = f(x);
    const dfx = df(x);

    // 检查导数是否为零，避免除零错误
    if (Math.abs(dfx) < 1e-15) {
      throw new Error('导数为零，无法继续迭代');
    }

    // 牛顿迭代公式: x_{n+1} = x_n - f(x_n) / f'(x_n)
    const xNew = x - fx / dfx;
    const error = Math.abs(xNew - x);

    // 记录迭代历史
    history.push({
      iteration: i + 1,
      x: x,
      fx: fx,
      dfx: dfx,
      xNew: xNew,
      error: error
    });

    // 检查是否收敛
    if (error < tolerance) {
      return {
        root: xNew,
        iterations: i + 1,
        converged: true,
        error: error,
        history: history
      };
    }

    x = xNew;
  }

  // 未在最大迭代次数内收敛
  return {
    root: x,
    iterations: maxIterations,
    converged: false,
    history: history
  };
}

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
function secantMethod(
  f: MathFunction,
  x0: number,
  x1: number,
  tolerance: number = 1e-10,
  maxIterations: number = 100
): NumericalResult {
  let xPrev = x0;
  let x = x1;
  const history: IterationStep[] = [];

  for (let i = 0; i < maxIterations; i++) {
    const fPrev = f(xPrev);
    const fCurrent = f(x);

    // 检查函数值变化，避免数值不稳定
    if (Math.abs(fCurrent - fPrev) < 1e-15) {
      throw new Error('函数值变化太小，可能导致除零错误');
    }

    // 弦截法公式: x_{n+1} = x_n - f(x_n) * (x_n - x_{n-1}) / (f(x_n) - f(x_{n-1}))
    const xNew = x - fCurrent * (x - xPrev) / (fCurrent - fPrev);
    const error = Math.abs(xNew - x);

    history.push({
      iteration: i + 1,
      xPrev: xPrev,
      x: x,
      xNew: xNew,
      error: error
    });

    if (error < tolerance) {
      return {
        root: xNew,
        iterations: i + 1,
        converged: true,
        error: error,
        history: history
      };
    }

    // 更新迭代点
    xPrev = x;
    x = xNew;
  }

  return {
    root: x,
    iterations: maxIterations,
    converged: false,
    history: history
  };
}

/**
 * 不动点迭代法 - 将方程改写为 x = g(x) 形式
 * @param g 迭代函数，满足 x = g(x)
 * @param x0 初始猜测值
 * @param tolerance 容差
 * @param maxIterations 最大迭代次数
 * @returns 数值结果对象
 */
function fixedPointIteration(
  g: MathFunction,
  x0: number,
  tolerance: number = 1e-10,
  maxIterations: number = 100
): NumericalResult {
  let x = x0;
  const history: IterationStep[] = [];

  for (let i = 0; i < maxIterations; i++) {
    // 不动点迭代公式: x_{n+1} = g(x_n)
    const xNew = g(x);
    const error = Math.abs(xNew - x);

    history.push({
      iteration: i + 1,
      x: x,
      xNew: xNew,
      error: error
    });

    if (error < tolerance) {
      return {
        root: xNew,
        iterations: i + 1,
        converged: true,
        error: error,
        history: history
      };
    }

    x = xNew;
  }

  return {
    root: x,
    iterations: maxIterations,
    converged: false,
    history: history
  };
}

// ==================== 区间法 ====================

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
function bisection(
  f: MathFunction,
  a: number,
  b: number,
  tolerance: number = 1e-10,
  maxIterations: number = 100
): NumericalResult {
  // 检查区间有效性
  if (f(a) * f(b) >= 0) {
    throw new Error('区间两端函数值同号，无法使用二分法');
  }

  let left = a;
  let right = b;
  const history: IterationStep[] = [];

  for (let i = 0; i < maxIterations; i++) {
    const mid = (left + right) / 2;
    const fMid = f(mid);
    const fLeft = f(left);
    const error = (right - left) / 2;  // 误差界

    history.push({
      iteration: i + 1,
      left: left,
      right: right,
      mid: mid,
      fMid: fMid,
      error: error
    });

    // 检查是否满足精度要求
    if (error < tolerance) {
      return {
        root: mid,
        iterations: i + 1,
        converged: true,
        error: error,
        history: history
      };
    }

    // 根据中点函数值更新区间
    if (fLeft * fMid < 0) {
      right = mid;  // 根在左半区间
    } else {
      left = mid;   // 根在右半区间
    }
  }

  // 返回最终近似解
  const finalMid = (left + right) / 2;
  return {
    root: finalMid,
    iterations: maxIterations,
    converged: false,
    history: history
  };
}

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
function falsePosition(
  f: MathFunction,
  a: number,
  b: number,
  tolerance: number = 1e-10,
  maxIterations: number = 100
): NumericalResult {
  // 检查区间有效性
  if (f(a) * f(b) >= 0) {
    throw new Error('区间两端函数值同号，无法使用试位法');
  }

  let x0 = a;
  let x1 = b;
  const history: IterationStep[] = [];

  for (let i = 0; i < maxIterations; i++) {
    const f0 = f(x0);
    const f1 = f(x1);
    
    // 试位法公式: x = (x0*f1 - x1*f0) / (f1 - f0)
    const xNew = (x0 * f1 - x1 * f0) / (f1 - f0);
    const fNew = f(xNew);
    const error = Math.abs(fNew);  // 使用函数值作为误差度量

    history.push({
      iteration: i + 1,
      x0: x0,
      x1: x1,
      xNew: xNew,
      fNew: fNew,
      error: error
    });

    if (error < tolerance) {
      return {
        root: xNew,
        iterations: i + 1,
        converged: true,
        error: error,
        history: history
      };
    }

    // 根据新点的函数值更新区间
    if (f0 * fNew < 0) {
      x1 = xNew;  // 根在 [x0, xNew] 区间
    } else {
      x0 = xNew;  // 根在 [xNew, x1] 区间
    }
  }

  const finalX = (x0 * f(x1) - x1 * f(x0)) / (f(x1) - f(x0));
  return {
    root: finalX,
    iterations: maxIterations,
    converged: false,
    history: history
  };
}

// ==================== 矩阵法 ====================

/**
 * 高斯消元法 - 求解线性方程组 Ax = b
 * 通过前向消元和回代求解
 * @param A 系数矩阵
 * @param b 右侧向量
 * @returns 解向量 x
 */
function gaussianElimination(A: Matrix, b: number[]): number[] {
  const n = A.length;
  
  // 创建增广矩阵 [A | b]
  const augmented: Matrix = A.map((row, i) => [...row, b[i]]);
  
  // 前向消元：将矩阵化为上三角矩阵
  for (let i = 0; i < n; i++) {
    // 部分主元选择：寻找第i列中绝对值最大的行
    let maxRow = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = j;
      }
    }
    
    // 交换当前行与主元行
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
    
    // 检查主元是否为零
    if (Math.abs(augmented[i][i]) < 1e-15) {
      throw new Error('矩阵奇异或接近奇异，无法求解');
    }
    
    // 消去下方行的第i列元素
    for (let j = i + 1; j < n; j++) {
      const factor = augmented[j][i] / augmented[i][i];
      for (let k = i; k <= n; k++) {
        augmented[j][k] -= factor * augmented[i][k];
      }
    }
  }
  
  // 回代：从最后一行开始求解
  const x: number[] = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += augmented[i][j] * x[j];
    }
    x[i] = (augmented[i][n] - sum) / augmented[i][i];
  }
  
  return x;
}

/**
 * LU分解 - 将矩阵分解为下三角矩阵L和上三角矩阵U
 * 用于多次求解同一矩阵不同右侧向量的情况
 * @param A 待分解矩阵
 * @returns 包含L和U矩阵的对象
 */
function luDecomposition(A: Matrix): { L: Matrix; U: Matrix } {
  const n = A.length;
  const L: Matrix = Array(n).fill(0).map(() => Array(n).fill(0));
  const U: Matrix = Array(n).fill(0).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    // 计算U的第i行
    for (let k = i; k < n; k++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += L[i][j] * U[j][k];
      }
      U[i][k] = A[i][k] - sum;
    }
    
    // 计算L的第i列
    for (let k = i; k < n; k++) {
      if (i === k) {
        L[i][i] = 1;  // L的对角线元素为1
      } else {
        let sum = 0;
        for (let j = 0; j < i; j++) {
          sum += L[k][j] * U[j][i];
        }
        L[k][i] = (A[k][i] - sum) / U[i][i];
      }
    }
  }
  
  return { L, U };
}

/**
 * 使用LU分解求解线性方程组
 * 分解后可以高效求解多个右侧向量
 * @param A 系数矩阵
 * @param b 右侧向量
 * @returns 解向量 x
 */
function solveWithLU(A: Matrix, b: number[]): number[] {
  const { L, U } = luDecomposition(A);
  const n = A.length;
  
  // 前向替换：解 Ly = b
  const y: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) {
      sum += L[i][j] * y[j];
    }
    y[i] = (b[i] - sum) / L[i][i];
  }
  
  // 回代：解 Ux = y
  const x: number[] = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += U[i][j] * x[j];
    }
    x[i] = (y[i] - sum) / U[i][i];
  }
  
  return x;
}

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
function jacobiIteration(
  A: Matrix,
  b: number[],
  x0: number[] = Array(b.length).fill(0),
  tolerance: number = 1e-10,
  maxIterations: number = 100
): { solution: number[]; iterations: number; converged: boolean } {
  const n = A.length;
  let x = [...x0];      // 当前迭代解
  let xNew = new Array(n); // 新迭代解
  
  for (let iter = 0; iter < maxIterations; iter++) {
    let maxError = 0;  // 记录最大误差
    
    // 对每个方程进行迭代
    for (let i = 0; i < n; i++) {
      let sum = 0;
      // 计算除对角线外其他项的贡献
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          sum += A[i][j] * x[j];
        }
      }
      // 雅可比迭代公式: x_i^{(k+1)} = (b_i - Σ_{j≠i} a_ij * x_j^{(k)}) / a_ii
      xNew[i] = (b[i] - sum) / A[i][i];
      maxError = Math.max(maxError, Math.abs(xNew[i] - x[i]));
    }
    
    // 检查收敛条件
    if (maxError < tolerance) {
      return {
        solution: xNew,
        iterations: iter + 1,
        converged: true
      };
    }
    
    // 更新解向量
    x = [...xNew];
  }
  
  // 未收敛
  return {
    solution: x,
    iterations: maxIterations,
    converged: false
  };
}

// ==================== 工具函数 ====================

/**
 * 计算两个向量的最大绝对误差
 * @param x1 第一个向量
 * @param x2 第二个向量
 * @returns 最大绝对误差
 */
function vectorError(x1: number[], x2: number[]): number {
  if (x1.length !== x2.length) {
    throw new Error('向量长度不匹配');
  }
  
  let maxError = 0;
  for (let i = 0; i < x1.length; i++) {
    maxError = Math.max(maxError, Math.abs(x1[i] - x2[i]));
  }
  return maxError;
}

/**
 * 矩阵乘法
 * @param A 第一个矩阵
 * @param B 第二个矩阵
 * @returns 乘积矩阵
 */
function matrixMultiply(A: Matrix, B: Matrix): Matrix {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;
  
  if (colsA !== rowsB) {
    throw new Error('矩阵维度不匹配，无法相乘');
  }
  
  const result: Matrix = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));
  
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  
  return result;
}

/**
 * 打印矩阵
 * @param matrix 要打印的矩阵
 * @param name 矩阵名称
 */
function printMatrix(matrix: Matrix, name: string = 'Matrix'): void {
  console.log(`${name}:`);
  matrix.forEach(row => {
    console.log(`  [${row.map(x => x.toFixed(4)).join(', ')}]`);
  });
}

// ==================== 导出所有函数 ====================

export {
  // 类型
  type NumericalResult,
  type IterationStep,
  type MathFunction,
  type Matrix,
  
  // 迭代法
  newtonRaphson,
  secantMethod,
  fixedPointIteration,
  
  // 区间法
  bisection,
  falsePosition,
  
  // 矩阵法
  gaussianElimination,
  luDecomposition,
  solveWithLU,
  jacobiIteration,
  
  // 工具函数
  vectorError,
  matrixMultiply,
  printMatrix
};