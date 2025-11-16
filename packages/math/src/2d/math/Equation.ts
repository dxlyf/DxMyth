/**
 * 方程求根工具函数
 */

/** 二次方程求根 ax² + bx + c = 0 */
export function solveQuadratic(a: number, b: number, c: number): number[] {
  if (Math.abs(a) < Number.EPSILON) {
    // 退化为线性方程 bx + c = 0
    if (Math.abs(b) < Number.EPSILON) {
      return Math.abs(c) < Number.EPSILON ? [] : []; // 无解或无穷多解
    }
    return [-c / b];
  }

  const discriminant = b * b - 4 * a * c; // 判别式
  
  if (discriminant < 0) {
    return []; // 无实数根
  } else if (Math.abs(discriminant) < Number.EPSILON) {
    return [-b / (2 * a)]; // 重根
  } else {
    // 两个不同的实数根
    const sqrtDiscriminant = Math.sqrt(discriminant);
    return [
      (-b - sqrtDiscriminant) / (2 * a),
      (-b + sqrtDiscriminant) / (2 * a)
    ];
  }
}

/** 三次方程求根 ax³ + bx² + cx + d = 0 (Cardano公式) */
export function solveCubic(a: number, b: number, c: number, d: number): number[] {
  if (Math.abs(a) < Number.EPSILON) {
    return solveQuadratic(b, c, d);
  }

  // 归一化: x³ + px² + qx + r = 0
  const p = b / a;
  const q = c / a;
  const r = d / a;

  // 令 x = y - p/3 消去二次项: y³ + py + q = 0
  const shift = p / 3;
  const A = q - p * shift;
  const B = 2 * p * shift * shift - 3 * q * shift + 2 * r;

  const discriminant = B * B - 4 * A * A * A;

  if (discriminant > 0) {
    // 一个实数根
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const u = Math.cbrt((-B + sqrtDiscriminant) / 2);
    const v = Math.cbrt((-B - sqrtDiscriminant) / 2);
    return [u + v - shift];
  } else if (Math.abs(discriminant) < Number.EPSILON) {
    // 三个实数根，其中两个相等
    const u = Math.cbrt(-B / 2);
    return [
      2 * u - shift,
      -u - shift,
      -u - shift
    ];
  } else {
    // 三个不同的实数根
    const phi = Math.acos(-B / (2 * Math.sqrt(A * A * A)));
    const t = 2 * Math.sqrt(-A);
    return [
      t * Math.cos(phi / 3) - shift,
      t * Math.cos((phi + 2 * Math.PI) / 3) - shift,
      t * Math.cos((phi + 4 * Math.PI) / 3) - shift
    ];
  }
}

/** 二分法求根 */
export function bisection(
  f: (x: number) => number,
  a: number,
  b: number,
  tolerance = 1e-10,
  maxIterations = 1000
): number | null {
  let fa = f(a);
  let fb = f(b);

  // 检查端点是否有根
  if (Math.abs(fa) < tolerance) return a;
  if (Math.abs(fb) < tolerance) return b;

  // 检查是否有根存在
  if (fa * fb > 0) return null;

  let left = a;
  let right = b;

  for (let i = 0; i < maxIterations; i++) {
    const mid = (left + right) / 2;
    const fm = f(mid);

    if (Math.abs(fm) < tolerance || (right - left) / 2 < tolerance) {
      return mid;
    }

    if (fa * fm < 0) {
      right = mid;
      fb = fm;
    } else {
      left = mid;
      fa = fm;
    }
  }

  return (left + right) / 2;
}

/** 牛顿法求根 */
export function newton(
  f: (x: number) => number,
  df: (x: number) => number,
  x0: number,
  tolerance = 1e-10,
  maxIterations = 1000
): number | null {
  let x = x0;

  for (let i = 0; i < maxIterations; i++) {
    const fx = f(x);
    
    if (Math.abs(fx) < tolerance) {
      return x;
    }

    const dfx = df(x);
    if (Math.abs(dfx) < Number.EPSILON) {
      return null; // 导数为零，无法继续
    }

    const xNext = x - fx / dfx;
    
    if (Math.abs(xNext - x) < tolerance) {
      return xNext;
    }

    x = xNext;
  }

  return null;
}

/** 割线法求根 */
export function secant(
  f: (x: number) => number,
  x0: number,
  x1: number,
  tolerance = 1e-10,
  maxIterations = 1000
): number | null {
  let xPrev = x0;
  let xCurr = x1;
  let fPrev = f(xPrev);
  let fCurr = f(xCurr);

  for (let i = 0; i < maxIterations; i++) {
    if (Math.abs(fCurr) < tolerance) {
      return xCurr;
    }

    if (Math.abs(fCurr - fPrev) < Number.EPSILON) {
      return null; // 无法继续
    }

    const xNext = xCurr - fCurr * (xCurr - xPrev) / (fCurr - fPrev);

    if (Math.abs(xNext - xCurr) < tolerance) {
      return xNext;
    }

    xPrev = xCurr;
    fPrev = fCurr;
    xCurr = xNext;
    fCurr = f(xCurr);
  }

  return null;
}

/** 弦截法（改进的割线法）求根 */
export function falsePosition(
  f: (x: number) => number,
  a: number,
  b: number,
  tolerance = 1e-10,
  maxIterations = 1000
): number | null {
  let fa = f(a);
  let fb = f(b);

  if (fa * fb > 0) return null;

  let left = a;
  let right = b;

  for (let i = 0; i < maxIterations; i++) {
    const x = left - fa * (right - left) / (fb - fa);
    const fx = f(x);

    if (Math.abs(fx) < tolerance) {
      return x;
    }

    if (fa * fx < 0) {
      right = x;
      fb = fx;
    } else {
      left = x;
      fa = fx;
    }
  }

  return (left + right) / 2;
}

/** Brent方法求根（二分法、割线法和逆二次插值的结合） */
export function brent(
  f: (x: number) => number,
  a: number,
  b: number,
  tolerance = 1e-10,
  maxIterations = 1000
): number | null {
  let fa = f(a);
  let fb = f(b);

  if (fa * fb > 0) return null;

  let c = a;
  let fc = fa;
  let d = b;
  let e = b;

  for (let i = 0; i < maxIterations; i++) {
    if (fb * fc > 0) {
      c = a;
      fc = fa;
      d = b - a;
      e = d;
    }

    if (Math.abs(fc) < Math.abs(fb)) {
      a = b;
      b = c;
      c = a;
      fa = fb;
      fb = fc;
      fc = fa;
    }

    const tol1 = 2 * Number.EPSILON * Math.abs(b) + tolerance / 2;
    const xm = 0.5 * (c - b);

    if (Math.abs(xm) <= tol1 || Math.abs(fb) < Number.EPSILON) {
      return b;
    }

    if (Math.abs(e) >= tol1 && Math.abs(fa) > Math.abs(fb)) {
      let s = fb / fa;
      let p: number;
      let q: number;

      if (a === c) {
        p = 2 * xm * s;
        q = 1 - s;
      } else {
        q = fa / fc;
        const r = fb / fc;
        p = s * (2 * xm * q * (q - r) - (b - a) * (r - 1));
        q = (q - 1) * (r - 1) * (s - 1);
      }

      if (p > 0) q = -q;
      p = Math.abs(p);

      const min1 = 3 * xm * q - Math.abs(tol1 * q);
      const min2 = Math.abs(e * q);

      if (2 * p < (min1 < min2 ? min1 : min2)) {
        e = d;
        d = p / q;
      } else {
        d = xm;
        e = d;
      }
    } else {
      d = xm;
      e = d;
    }

    a = b;
    fa = fb;

    if (Math.abs(d) > tol1) {
      b += d;
    } else {
      b += (xm > 0 ? tol1 : -tol1);
    }

    fb = f(b);
  }

  return b;
}

/** 多项式求根（使用伴随矩阵法） */
export function solvePolynomial(coefficients: number[]): number[] {
  const n = coefficients.length - 1;
  
  if (n === 0) return [];
  if (n === 1) return solveQuadratic(coefficients[0], coefficients[1], coefficients[2]);
  if (n === 2) return solveCubic(coefficients[0], coefficients[1], coefficients[2], coefficients[3]);
  
  // 对于更高次多项式，使用数值方法
  const roots: number[] = [];
  
  // 寻找有理根
  const leadingCoeff = coefficients[0];
  const constantTerm = coefficients[coefficients.length - 1];
  
  if (Math.abs(constantTerm) > Number.EPSILON) {
    const possibleFactors = getRationalRoots(leadingCoeff, constantTerm);
    
    for (const root of possibleFactors) {
      if (isRoot(coefficients, root)) {
        roots.push(root);
        const reducedCoeffs = polynomialDivision(coefficients, root);
        const remainingRoots = solvePolynomial(reducedCoeffs);
        roots.push(...remainingRoots);
        return roots;
      }
    }
  }
  
  // 如果没有找到有理根，使用牛顿法寻找一个根
  const f = (x: number) => evaluatePolynomial(coefficients, x);
  const df = (x: number) => evaluatePolynomialDerivative(coefficients, x);
  
  // 尝试不同的初始值
  for (let x0 = -10; x0 <= 10; x0 += 2) {
    const root = newton(f, df, x0);
    if (root !== null && !roots.some(r => Math.abs(r - root) < 1e-6)) {
      roots.push(root);
      const reducedCoeffs = polynomialDivision(coefficients, root);
      const remainingRoots = solvePolynomial(reducedCoeffs);
      roots.push(...remainingRoots);
      return roots;
    }
  }
  
  return roots;
}

/** 检查是否为根 */
function isRoot(coefficients: number[], x: number): boolean {
  return Math.abs(evaluatePolynomial(coefficients, x)) < 1e-10;
}
// 二项式系数
function binomial(n: number, r: number): number {
   if(n < r) return 0;
   if(r === 0 || r === n) return 1;
   return binomial(n - 1, r - 1) + binomial(n - 1, r);
}
export function getBezierPowerBasis(controls:{x:number,y:number}[]){
    const n = controls.length - 1;
    const coefficients =new Array(n+1);
    
    for (let i = 0; i <= n; i++) {
        const binomialCoeff = binomial(n, i);
        coefficients[i]={x:0,y:0};
        for(let j = 0; j <=(n-i); j++){
            const subbinomialCoeff = binomial(n, j);
            const sign= i % 2 === 0 ? 1 : -1;
            coefficients[i].x += controls[j].x * subbinomialCoeff * sign;
            coefficients[i].y += controls[j].y * subbinomialCoeff * sign;
        }
        coefficients[i].x*=binomialCoeff;
        coefficients[i].y*=binomialCoeff;
    }
    return coefficients;
}

/** 计算多项式值 */
function evaluatePolynomial(coefficients: number[], x: number): number {
  let result = 0;
  for (let i = 0; i < coefficients.length; i++) {
    result = result * x + coefficients[i];
  }
  return result;
}

/** 计算多项式导数值 */
function evaluatePolynomialDerivative(coefficients: number[], x: number): number {
  let result = 0;
  for (let i = 0; i < coefficients.length - 1; i++) {
    result = result * x + coefficients[i] * (coefficients.length - 1 - i);
  }
  return result;
}

/** 多项式除法（除以 (x - root)） */
function polynomialDivision(coefficients: number[], root: number): number[] {
  const n = coefficients.length - 1;
  const result = new Array(n);
  result[0] = coefficients[0];
  
  for (let i = 1; i < n; i++) {
    result[i] = coefficients[i] + result[i - 1] * root;
  }
  
  return result;
}

/** 获取可能的有理根 */
function getRationalRoots(leadingCoeff: number, constantTerm: number): number[] {
  const factors = (n: number): number[] => {
    const absN = Math.abs(n);
    const result: number[] = [];
    
    for (let i = 1; i <= Math.sqrt(absN); i++) {
      if (absN % i === 0) {
        result.push(i, -i);
        if (i !== absN / i) {
          result.push(absN / i, -absN / i);
        }
      }
    }
    
    return result;
  };
  
  const leadingFactors = factors(leadingCoeff);
  const constantFactors = factors(constantTerm);
  const roots: Set<number> = new Set();
  
  for (const p of constantFactors) {
    for (const q of leadingFactors) {
      roots.add(p / q);
    }
  }
  
  return Array.from(roots);
}

// ==================== 常用参数方程 ====================

/** 圆的参数方程 */
export function circleParametric(
  centerX: number,
  centerY: number,
  radius: number,
  t: number
): { x: number; y: number } {
  return {
    x: centerX + radius * Math.cos(t),
    y: centerY + radius * Math.sin(t)
  };
}

/** 椭圆的参数方程 */
export function ellipseParametric(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  t: number
): { x: number; y: number } {
  return {
    x: centerX + radiusX * Math.cos(t),
    y: centerY + radiusY * Math.sin(t)
  };
}

/** 抛物线的参数方程 */
export function parabolaParametric(
  a: number,
  b: number,
  c: number,
  t: number
): { x: number; y: number } {
  return {
    x: t,
    y: a * t * t + b * t + c
  };
}

/** 双曲线的参数方程 */
export function hyperbolaParametric(
  a: number,
  b: number,
  t: number
): { x: number; y: number } {
  return {
    x: a * Math.cosh(t),
    y: b * Math.sinh(t)
  };
}

/** 螺旋线的参数方程（阿基米德螺旋） */
export function spiralParametric(
  a: number,
  t: number
): { x: number; y: number } {
  return {
    x: a * t * Math.cos(t),
    y: a * t * Math.sin(t)
  };
}

/** 对数螺旋的参数方程 */
export function logarithmicSpiralParametric(
  a: number,
  b: number,
  t: number
): { x: number; y: number } {
  const r = a * Math.exp(b * t);
  return {
    x: r * Math.cos(t),
    y: r * Math.sin(t)
  };
}

/** 心形线的参数方程 */
export function cardioidParametric(
  a: number,
  t: number
): { x: number; y: number } {
  return {
    x: a * (2 * Math.cos(t) - Math.cos(2 * t)),
    y: a * (2 * Math.sin(t) - Math.sin(2 * t))
  };
}

/** 玫瑰线的参数方程 */
export function roseParametric(
  a: number,
  n: number,
  t: number
): { x: number; y: number } {
  const r = a * Math.cos(n * t);
  return {
    x: r * Math.cos(t),
    y: r * Math.sin(t)
  };
}

/** 李萨如图形的参数方程 */
export function lissajousParametric(
  a: number,
  b: number,
  aFreq: number,
  bFreq: number,
  delta: number,
  t: number
): { x: number; y: number } {
  return {
    x: a * Math.sin(aFreq * t + delta),
    y: b * Math.sin(bFreq * t)
  };
}

/** 三次贝塞尔曲线的参数方程 */
export function cubicBezierParametric(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  
  return {
    x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
    y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y
  };
}

/** 二次贝塞尔曲线的参数方程 */
export function quadBezierParametric(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
  };
}

// ==================== 常用一般方程 ====================

/** 直线方程：y = mx + b */
export function linearEquation(m: number, b: number, x: number): number {
  return m * x + b;
}

/** 二次函数：y = ax² + bx + c */
export function quadraticEquation(a: number, b: number, c: number, x: number): number {
  return a * x * x + b * x + c;
}

/** 三次函数：y = ax³ + bx² + cx + d */
export function cubicEquation(a: number, b: number, c: number, d: number, x: number): number {
  return a * x * x * x + b * x * x + c * x + d;
}

/** 指数函数：y = a * e^(bx) */
export function exponentialEquation(a: number, b: number, x: number): number {
  return a * Math.exp(b * x);
}

/** 对数函数：y = a * ln(bx) */
export function logarithmicEquation(a: number, b: number, x: number): number {
  return a * Math.log(b * x);
}

/** 正弦函数：y = a * sin(bx + c) */
export function sineEquation(a: number, b: number, c: number, x: number): number {
  return a * Math.sin(b * x + c);
}

/** 余弦函数：y = a * cos(bx + c) */
export function cosineEquation(a: number, b: number, c: number, x: number): number {
  return a * Math.cos(b * x + c);
}

/** 正切函数：y = a * tan(bx + c) */
export function tangentEquation(a: number, b: number, c: number, x: number): number {
  return a * Math.tan(b * x + c);
}

/** 幂函数：y = a * x^b */
export function powerEquation(a: number, b: number, x: number): number {
  return a * Math.pow(x, b);
}

/** 高斯函数：y = a * e^(-(x-b)²/(2c²)) */
export function gaussianEquation(a: number, b: number, c: number, x: number): number {
  return a * Math.exp(-Math.pow(x - b, 2) / (2 * c * c));
}

/** 逻辑斯谛函数：y = L / (1 + e^(-k(x-x0))) */
export function logisticEquation(L: number, k: number, x0: number, x: number): number {
  return L / (1 + Math.exp(-k * (x - x0)));
}

/** 阶跃函数（海维赛德函数） */
export function stepEquation(x: number, threshold = 0): number {
  return x >= threshold ? 1 : 0;
}

/** 符号函数 */
export function signEquation(x: number): number {
  if (x > 0) return 1;
  if (x < 0) return -1;
  return 0;
}

/** 绝对值函数：y = |ax + b| */
export function absoluteEquation(a: number, b: number, x: number): number {
  return Math.abs(a * x + b);
}

/** 分段线性函数 */
export function piecewiseLinearEquation(
  points: { x: number; y: number }[],
  x: number
): number {
  if (points.length === 0) return 0;
  if (x <= points[0].x) return points[0].y;
  if (x >= points[points.length - 1].x) return points[points.length - 1].y;
  
  for (let i = 0; i < points.length - 1; i++) {
    if (x >= points[i].x && x <= points[i + 1].x) {
      const t = (x - points[i].x) / (points[i + 1].x - points[i].x);
      return points[i].y + t * (points[i + 1].y - points[i].y);
    }
  }
  
  return 0;
}

/** 方波函数 */
export function squareWaveEquation(
  amplitude: number,
  frequency: number,
  dutyCycle: number,
  x: number
): number {
  const phase = (x * frequency) % (2 * Math.PI);
  return phase < dutyCycle * 2 * Math.PI ? amplitude : -amplitude;
}

/** 锯齿波函数 */
export function sawtoothWaveEquation(
  amplitude: number,
  frequency: number,
  x: number
): number {
  const phase = (x * frequency) % (2 * Math.PI);
  return amplitude * (phase / Math.PI - 1);
}

/** 三角波函数 */
export function triangleWaveEquation(
  amplitude: number,
  frequency: number,
  x: number
): number {
  const phase = (x * frequency) % (2 * Math.PI);
  return amplitude * (2 * Math.abs(phase / Math.PI - 1) - 1);
}

// ==================== 方程转换工具 ====================

/** 参数方程转笛卡尔坐标（圆） */
export function parametricToCartesianCircle(
  centerX: number,
  centerY: number,
  radius: number,
  t: number
): { equation: string; x: number; y: number } {
  const point = circleParametric(centerX, centerY, radius, t);
  const equation = `(x - ${centerX})² + (y - ${centerY})² = ${radius * radius}`;
  return { equation, ...point };
}

/** 参数方程转笛卡尔坐标（椭圆） */
export function parametricToCartesianEllipse(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  t: number
): { equation: string; x: number; y: number } {
  const point = ellipseParametric(centerX, centerY, radiusX, radiusY, t);
  const equation = `((x - ${centerX})/${radiusX})² + ((y - ${centerY})/${radiusY})² = 1`;
  return { equation, ...point };
}

/** 极坐标转笛卡尔坐标 */
export function polarToCartesian(r: number, theta: number): { x: number; y: number } {
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta)
  };
}

/** 笛卡尔坐标转极坐标 */
export function cartesianToPolar(x: number, y: number): { r: number; theta: number } {
  return {
    r: Math.sqrt(x * x + y * y),
    theta: Math.atan2(y, x)
  };
}

/** 球坐标转笛卡尔坐标 */
export function sphericalToCartesian(
  r: number,
  theta: number,
  phi: number
): { x: number; y: number; z: number } {
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.sin(phi) * Math.sin(theta),
    z: r * Math.cos(phi)
  };
}

/** 笛卡尔坐标转球坐标 */
export function cartesianToSpherical(
  x: number,
  y: number,
  z: number
): { r: number; theta: number; phi: number } {
  const r = Math.sqrt(x * x + y * y + z * z);
  return {
    r,
    theta: Math.atan2(y, x),
    phi: Math.acos(z / r)
  };
}

// ==================== 微积分函数 ====================

/** 数值求导（一次导数）- 使用中心差分法 */
export function firstDerivative(
  func: (x: number) => number,
  x: number,
  h = 1e-6
): number {
  return (func(x + h) - func(x - h)) / (2 * h);
}

/** 数值求二次导数 */
export function secondDerivative(
  func: (x: number) => number,
  x: number,
  h = 1e-6
): number {
  return (func(x + h) - 2 * func(x) + func(x - h)) / (h * h);
}

/** 数值求n次导数 */
export function nthDerivative(
  func: (x: number) => number,
  n: number,
  x: number,
  h = 1e-6
): number {
  if (n === 0) return func(x);
  if (n === 1) return firstDerivative(func, x, h);
  if (n === 2) return secondDerivative(func, x, h);
  
  // 使用有限差分法计算高阶导数
  const coefficients: number[] = [];
  for (let k = 0; k <= n; k++) {
    let coeff = 0;
    for (let j = 0; j <= k; j++) {
      coeff += Math.pow(-1, j) * binomialCoefficient(n, j) * Math.pow(k - j, n);
    }
    coefficients.push(coeff / Math.pow(h, n));
  }
  
  let result = 0;
  const halfN = Math.floor(n / 2);
  for (let k = 0; k <= n; k++) {
    const x_k = x + (k - halfN) * h;
    result += coefficients[k] * func(x_k);
  }
  
  return result;
}

/** 符号求导 - 多项式 */
export function polynomialDerivative(coefficients: number[]): number[] {
  if (coefficients.length <= 1) return [0];
  
  const derivative: number[] = [];
  for (let i = 1; i < coefficients.length; i++) {
    derivative.push(coefficients[i] * i);
  }
  
  return derivative;
}

/** 符号求导 - 三角函数 */
export function trigonometricDerivative(
  func: 'sin' | 'cos' | 'tan',
  coefficient = 1,
  phase = 0
): (x: number) => number {
  switch (func) {
    case 'sin':
      return (x: number) => coefficient * Math.cos(coefficient * x + phase);
    case 'cos':
      return (x: number) => -coefficient * Math.sin(coefficient * x + phase);
    case 'tan':
      return (x: number) => coefficient / Math.pow(Math.cos(coefficient * x + phase), 2);
    default:
      throw new Error(`Unsupported trigonometric function: ${func}`);
  }
}

/** 符号求导 - 指数函数 */
export function exponentialDerivative(
  base: number,
  coefficient = 1
): (x: number) => number {
  return (x: number) => coefficient * base * Math.exp(coefficient * x);
}

/** 符号求导 - 对数函数 */
export function logarithmicDerivative(
  coefficient = 1
): (x: number) => number {
  return (x: number) => coefficient / x;
}

/** 符号求导 - 幂函数 */
export function powerDerivative(
  exponent: number,
  coefficient = 1
): (x: number) => number {
  return (x: number) => coefficient * exponent * Math.pow(x, exponent - 1);
}

/** 数值积分 - 梯形法则 */
export function trapezoidalIntegration(
  func: (x: number) => number,
  a: number,
  b: number,
  n = 1000
): number {
  const h = (b - a) / n;
  let sum = func(a) + func(b);
  
  for (let i = 1; i < n; i++) {
    sum += 2 * func(a + i * h);
  }
  
  return sum * h / 2;
}

/** 数值积分 - 辛普森法则 */
export function simpsonIntegration(
  func: (x: number) => number,
  a: number,
  b: number,
  n = 1000
): number {
  if (n % 2 !== 0) n++; // 辛普森法则需要偶数个区间
  
  const h = (b - a) / n;
  let sum = func(a) + func(b);
  
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += (i % 2 === 0 ? 2 : 4) * func(x);
  }
  
  return sum * h / 3;
}

/** 数值积分 - 龙贝格积分法 */
export function rombergIntegration(
  func: (x: number) => number,
  a: number,
  b: number,
  maxIterations = 10,
  tolerance = 1e-10
): number {
  const R: number[][] = [];
  
  // 初始化第一列（梯形法则）
  for (let k = 0; k < maxIterations; k++) {
    const n = Math.pow(2, k);
    R[k] = [trapezoidalIntegration(func, a, b, n)];
  }
  
  // 龙贝格外推
  for (let j = 1; j < maxIterations; j++) {
    for (let k = j; k < maxIterations; k++) {
      const factor = Math.pow(4, j) - 1;
      R[k][j] = R[k][j - 1] + (R[k][j - 1] - R[k - 1][j - 1]) / factor;
    }
    
    // 检查收敛性
    if (maxIterations - 1 > j && Math.abs(R[maxIterations - 1][j] - R[maxIterations - 1][j - 1]) < tolerance) {
      return R[maxIterations - 1][j];
    }
  }
  
  return R[maxIterations - 1][maxIterations - 1];
}

/** 不定积分 - 多项式 */
export function polynomialIntegral(coefficients: number[], constant = 0): number[] {
  const integral: number[] = [constant];
  
  for (let i = 0; i < coefficients.length; i++) {
    integral.push(coefficients[i] / (i + 1));
  }
  
  return integral;
}

/** 不定积分 - 基本函数 */
export function basicIntegral(
  func: 'sin' | 'cos' | 'exp' | 'ln' | 'power',
  coefficient = 1,
  exponent?: number,
  constant = 0
): (x: number) => number {
  switch (func) {
    case 'sin':
      return (x: number) => -coefficient * Math.cos(coefficient * x) / coefficient + constant;
    case 'cos':
      return (x: number) => coefficient * Math.sin(coefficient * x) / coefficient + constant;
    case 'exp':
      return (x: number) => Math.exp(coefficient * x) / coefficient + constant;
    case 'ln':
      return (x: number) => coefficient * (x * Math.log(x) - x) + constant;
    case 'power':
      if (exponent === undefined) throw new Error('Exponent required for power function');
      if (exponent === -1) {
        return (x: number) => coefficient * Math.log(Math.abs(x)) + constant;
      }
      return (x: number) => coefficient * Math.pow(x, exponent + 1) / (exponent + 1) + constant;
    default:
      throw new Error(`Unsupported function type: ${func}`);
  }
}

/** 定积分 - 高斯积分法 */
export function gaussianIntegration(
  func: (x: number) => number,
  a: number,
  b: number,
  n = 5
): number {
  // 高斯点和权重（n=5）
  const points = [-0.9061798459, -0.5384693101, 0, 0.5384693101, 0.9061798459];
  const weights = [0.2369268851, 0.4786286705, 0.5688888889, 0.4786286705, 0.2369268851];
  
  const transform = (t: number) => (b - a) * t / 2 + (a + b) / 2;
  let sum = 0;
  
  for (let i = 0; i < n; i++) {
    sum += weights[i] * func(transform(points[i]));
  }
  
  return (b - a) * sum / 2;
}

/** 多重积分 - 二重积分 */
export function doubleIntegral(
  func: (x: number, y: number) => number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  nx = 100,
  ny = 100
): number {
  const hx = (xMax - xMin) / nx;
  const hy = (yMax - yMin) / ny;
  let sum = 0;
  
  for (let i = 0; i <= nx; i++) {
    for (let j = 0; j <= ny; j++) {
      const x = xMin + i * hx;
      const y = yMin + j * hy;
      let weight = 1;
      
      // 边界权重
      if (i === 0 || i === nx) weight *= 0.5;
      if (j === 0 || j === ny) weight *= 0.5;
      
      sum += weight * func(x, y);
    }
  }
  
  return sum * hx * hy;
}

/** 路径积分 - 线积分 */
export function lineIntegral(
  xFunc: (t: number) => number,
  yFunc: (t: number) => number,
  integrand: (x: number, y: number, dx: number, dy: number) => number,
  tStart: number,
  tEnd: number,
  n = 1000
): number {
  const h = (tEnd - tStart) / n;
  let sum = 0;
  
  for (let i = 0; i < n; i++) {
    const t1 = tStart + i * h;
    const t2 = tStart + (i + 1) * h;
    
    const x1 = xFunc(t1);
    const y1 = yFunc(t1);
    const x2 = xFunc(t2);
    const y2 = yFunc(t2);
    
    const dx = x2 - x1;
    const dy = y2 - y1;
    const xMid = (x1 + x2) / 2;
    const yMid = (y1 + y2) / 2;
    
    sum += integrand(xMid, yMid, dx, dy);
  }
  
  return sum;
}

// ==================== 辅助函数 ====================

/** 二项式系数 */
function binomialCoefficient(n: number, k: number): number {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }
  
  return result;
}