// 2D样曲线相关方法
// 定义基础的点和向量接口
export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

// 样曲线类型枚举
export enum SplineType {
  LINEAR = 'linear',
  CUBIC = 'cubic',
  BSPLINE = 'b-spline',
  NATURAL_CUBIC = 'natural-cubic'
}

/**
 * 线性样条插值 - 简单地连接相邻点
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @returns 插值点
 */
export function linearSpline(points: Point[], t: number): Point {
  if (points.length < 2) {
    throw new Error('线性样条至少需要2个点');
  }
  
  // 确保t在[0, 1]范围内
  t = Math.max(0, Math.min(1, t));
  
  // 计算分段索引
  const n = points.length - 1;
  const segmentIndex = Math.min(Math.floor(t * n), n - 1);
  const localT = (t * n) - segmentIndex;
  
  // 线性插值
  const p0 = points[segmentIndex];
  const p1 = points[segmentIndex + 1];
  
  return {
    x: p0.x + (p1.x - p0.x) * localT,
    y: p0.y + (p1.y - p0.y) * localT
  };
}

/**
 * 计算三次样条的系数
 * @param points 控制点数组
 * @param type 样条类型
 * @returns 系数数组 [a, b, c, d] 其中 y = a + b(x-x_i) + c(x-x_i)^2 + d(x-x_i)^3
 */
export function calculateCubicSplineCoefficients(points: Point[], type: SplineType = SplineType.CUBIC): number[][] {
  const n = points.length - 1;
  const h: number[] = []; // 相邻控制点之间的间距
  const a: number[] = []; // y_i
  const alpha: number[] = [];
  const l: number[] = [];
  const mu: number[] = [];
  const z: number[] = [];
  const c: number[] = [];
  const b: number[] = [];
  const d: number[] = [];
  const coefficients: number[][] = [];
  
  // 计算h和a数组
  for (let i = 0; i < n; i++) {
    h[i] = Math.sqrt(Math.pow(points[i + 1].x - points[i].x, 2) + Math.pow(points[i + 1].y - points[i].y, 2));
    a[i] = points[i].y;
  }
  a[n] = points[n].y;
  
  // 计算alpha数组
  for (let i = 1; i < n; i++) {
    alpha[i] = (3 / h[i]) * (a[i + 1] - a[i]) - (3 / h[i - 1]) * (a[i] - a[i - 1]);
  }
  
  // 边界条件
  if (type === SplineType.NATURAL_CUBIC) {
    // 自然边界条件：二阶导数为0
    l[0] = 1;
    mu[0] = 0;
    z[0] = 0;
    l[n] = 1;
    z[n] = 0;
  } else {
    // 固定边界条件
    l[0] = 2 * h[0];
    mu[0] = 0.5;
    z[0] = (3 / h[0]) * (a[1] - a[0]);
    l[n] = 2 * h[n - 1];
    z[n] = (3 / h[n - 1]) * (a[n] - a[n - 1]);
  }
  
  // 前向消元
  for (let i = 1; i < n; i++) {
    l[i] = 2 * (points[i + 1].x - points[i - 1].x) - h[i - 1] * mu[i - 1];
    mu[i] = h[i] / l[i];
    z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
  }
  
  // 回代求解
  c[n] = z[n];
  for (let i = n - 1; i >= 0; i--) {
    c[i] = z[i] - mu[i] * c[i + 1];
    b[i] = (a[i + 1] - a[i]) / h[i] - h[i] * (c[i + 1] + 2 * c[i]) / 3;
    d[i] = (c[i + 1] - c[i]) / (3 * h[i]);
  }
  
  // 组装系数
  for (let i = 0; i < n; i++) {
    coefficients[i] = [a[i], b[i], c[i], d[i]];
  }
  
  return coefficients;
}

/**
 * 三次样条插值
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @param type 样条类型
 * @returns 插值点
 */
export function cubicSpline(points: Point[], t: number, type: SplineType = SplineType.CUBIC): Point {
  if (points.length < 3) {
    throw new Error('三次样条至少需要3个点');
  }
  
  // 确保t在[0, 1]范围内
  t = Math.max(0, Math.min(1, t));
  
  // 计算分段索引
  const n = points.length - 1;
  const segmentIndex = Math.min(Math.floor(t * n), n - 1);
  const localT = (t * n) - segmentIndex;
  
  // 获取系数
  const coefficients = calculateCubicSplineCoefficients(points, type);
  const [a, b, c, d] = coefficients[segmentIndex];
  
  // 计算插值
  const dx = localT;
  const y = a + b * dx + c * dx * dx + d * dx * dx * dx;
  
  // 计算x坐标
  const x = points[segmentIndex].x + (points[segmentIndex + 1].x - points[segmentIndex].x) * localT;
  
  return { x, y };
}

/**
 * B样条基函数
 * @param i 节点索引
 * @param k 阶数
 * @param t 参数值
 * @param knots 节点向量
 * @returns 基函数值
 */
function bSplineBasis(i: number, k: number, t: number, knots: number[]): number {
  // 递归基例：零阶B样条
  if (k === 0) {
    return knots[i] <= t && t < knots[i + 1] ? 1 : 0;
  }
  
  let left = 0;
  let right = 0;
  
  if (knots[i + k] - knots[i] !== 0) {
    left = ((t - knots[i]) / (knots[i + k] - knots[i])) * bSplineBasis(i, k - 1, t, knots);
  }
  
  if (knots[i + k + 1] - knots[i + 1] !== 0) {
    right = ((knots[i + k + 1] - t) / (knots[i + k + 1] - knots[i + 1])) * bSplineBasis(i + 1, k - 1, t, knots);
  }
  
  return left + right;
}

/**
 * 生成均匀B样条节点向量
 * @param n 控制点数量
 * @param k 阶数
 * @returns 节点向量
 */
function generateUniformKnotVector(n: number, k: number): number[] {
  const m = n + k + 1;
  const knots: number[] = [];
  
  // 重复的开始节点
  for (let i = 0; i <= k; i++) {
    knots[i] = 0;
  }
  
  // 中间均匀节点
  for (let i = k + 1; i <= m - k - 1; i++) {
    knots[i] = (i - k) / (n - k + 1);
  }
  
  // 重复的结束节点
  for (let i = m - k; i < m; i++) {
    knots[i] = 1;
  }
  
  return knots;
}

/**
 * B样条插值
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @param degree 次数（阶数-1），默认为3（四次B样条）
 * @returns 插值点
 */
export function bSpline(points: Point[], t: number, degree: number = 3): Point {
  if (points.length < degree + 1) {
    throw new Error(`B样条需要至少${degree + 1}个控制点`);
  }
  
  // 确保t在[0, 1]范围内
  t = Math.max(0, Math.min(1, t));
  
  const k = degree; // 次数
  const n = points.length - 1; // 控制点索引最大值
  const knots = generateUniformKnotVector(n + 1, k + 1); // 阶数 = 次数 + 1
  
  let x = 0;
  let y = 0;
  
  // 计算加权和
  for (let i = 0; i <= n; i++) {
    const basis = bSplineBasis(i, k, t, knots);
    x += points[i].x * basis;
    y += points[i].y * basis;
  }
  
  return { x, y };
}

/**
 * 通用样曲线插值函数
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @param type 样曲线类型
 * @param options 其他选项
 * @returns 插值点
 */
export function splineInterpolate(
  points: Point[],
  t: number,
  type: SplineType = SplineType.CUBIC,
  options: { degree?: number } = {}
): Point {
  switch (type) {
    case SplineType.LINEAR:
      return linearSpline(points, t);
    case SplineType.CUBIC:
    case SplineType.NATURAL_CUBIC:
      return cubicSpline(points, t, type);
    case SplineType.BSPLINE:
      return bSpline(points, t, options.degree || 3);
    default:
      throw new Error(`不支持的样曲线类型: ${type}`);
  }
}

/**
 * 生成样曲线点数组
 * @param points 控制点数组
 * @param segments 分段数
 * @param type 样曲线类型
 * @param options 其他选项
 * @returns 生成的点数组
 */
export function generateSplineCurve(
  points: Point[],
  segments: number = 100,
  type: SplineType = SplineType.CUBIC,
  options: { degree?: number } = {}
): Point[] {
  const result: Point[] = [];
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    result.push(splineInterpolate(points, t, type, options));
  }
  
  return result;
}

/**
 * 计算线性样条的导数
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @returns 导数值（向量）
 */
export function linearSplineDerivative(points: Point[], t: number): Vector {
  if (points.length < 2) {
    throw new Error('线性样条至少需要2个点');
  }
  
  // 确保t在[0, 1]范围内
  t = Math.max(0, Math.min(1, t));
  
  // 计算分段索引
  const n = points.length - 1;
  const segmentIndex = Math.min(Math.floor(t * n), n - 1);
  
  // 导数就是线段的斜率
  const p0 = points[segmentIndex];
  const p1 = points[segmentIndex + 1];
  
  return {
    x: (p1.x - p0.x) * n, // 乘以n以归一化
    y: (p1.y - p0.y) * n
  };
}

/**
 * 计算三次样条的一阶导数
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @param type 样条类型
 * @returns 导数值（向量）
 */
export function cubicSplineDerivative(points: Point[], t: number, type: SplineType = SplineType.CUBIC): Vector {
  if (points.length < 3) {
    throw new Error('三次样条至少需要3个点');
  }
  
  // 确保t在[0, 1]范围内
  t = Math.max(0, Math.min(1, t));
  
  // 计算分段索引
  const n = points.length - 1;
  const segmentIndex = Math.min(Math.floor(t * n), n - 1);
  const localT = (t * n) - segmentIndex;
  
  // 获取系数
  const coefficients = calculateCubicSplineCoefficients(points, type);
  const [a, b, c, d] = coefficients[segmentIndex];
  
  // 一阶导数: dy/dx = (b + 2cx + 3dx^2) / 1
  const dx = localT;
  const dy = b + 2 * c * dx + 3 * d * dx * dx;
  
  // 计算x方向的导数
  const dxdT = (points[segmentIndex + 1].x - points[segmentIndex].x) * n;
  
  return {
    x: dxdT,
    y: dy * dxdT // 链式法则：dy/dt = dy/dx * dx/dt
  };
}

/**
 * 计算B样条的一阶导数
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @param degree 次数
 * @returns 导数值（向量）
 */
export function bSplineDerivative(points: Point[], t: number, degree: number = 3): Vector {
  if (points.length < degree + 1) {
    throw new Error(`B样条需要至少${degree + 1}个控制点`);
  }
  
  // 确保t在[0, 1]范围内
  t = Math.max(0, Math.min(1, t));
  
  const k = degree;
  const n = points.length - 1;
  const knots = generateUniformKnotVector(n + 1, k + 1);
  
  let dx = 0;
  let dy = 0;
  
  // B样条导数公式：k * Σ (P_i - P_{i-1}) * B_{i,k-1}(t) / (knots[i+k] - knots[i])
  for (let i = 0; i <= n; i++) {
    if (i > 0 && knots[i + k] - knots[i] !== 0) {
      const basis = bSplineBasis(i, k - 1, t, knots);
      const weight = k / (knots[i + k] - knots[i]);
      dx += (points[i].x - points[i - 1].x) * weight * basis;
      dy += (points[i].y - points[i - 1].y) * weight * basis;
    }
  }
  
  return { x: dx, y: dy };
}

/**
 * 通用样曲线导数计算函数
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @param type 样曲线类型
 * @param options 其他选项
 * @returns 导数值（向量）
 */
export function splineDerivative(
  points: Point[],
  t: number,
  type: SplineType = SplineType.CUBIC,
  options: { degree?: number } = {}
): Vector {
  switch (type) {
    case SplineType.LINEAR:
      return linearSplineDerivative(points, t);
    case SplineType.CUBIC:
    case SplineType.NATURAL_CUBIC:
      return cubicSplineDerivative(points, t, type);
    case SplineType.BSPLINE:
      return bSplineDerivative(points, t, options.degree || 3);
    default:
      throw new Error(`不支持的样曲线类型: ${type}`);
  }
}

/**
 * 计算向量的模长
 * @param vector 向量
 * @returns 模长
 */
function vectorLength(vector: Vector): number {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

/**
 * 使用数值积分计算样曲线段长度
 * @param points 控制点数组
 * @param t0 起始参数
 * @param t1 结束参数
 * @param type 样曲线类型
 * @param options 其他选项
 * @param samples 采样次数，默认为1000
 * @returns 曲线长度
 */
export function splineLength(
  points: Point[],
  t0: number = 0,
  t1: number = 1,
  type: SplineType = SplineType.CUBIC,
  options: { degree?: number } = {},
  samples: number = 1000
): number {
  let length = 0;
  const dt = (t1 - t0) / samples;
  
  for (let i = 0; i < samples; i++) {
    const t = t0 + i * dt;
    const derivative = splineDerivative(points, t, type, options);
    length += vectorLength(derivative) * dt;
  }
  
  return length;
}

/**
 * 细分样曲线
 * @param points 控制点数组
 * @param segments 细分段数
 * @param type 样曲线类型
 * @param options 其他选项
 * @returns 细分后的点数组
 */
export function subdivideSpline(
  points: Point[],
  segments: number = 2,
  type: SplineType = SplineType.CUBIC,
  options: { degree?: number } = {}
): Point[] {
  const result: Point[] = [];
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    result.push(splineInterpolate(points, t, type, options));
  }
  
  return result;
}

/**
 * 计算样曲线的曲率
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @param type 样曲线类型
 * @param options 其他选项
 * @returns 曲率值
 */
export function splineCurvature(
  points: Point[],
  t: number,
  type: SplineType = SplineType.CUBIC,
  options: { degree?: number } = {}
): number {
  // 对于线性样条，曲率为0
  if (type === SplineType.LINEAR) {
    return 0;
  }
  
  // TODO: 实现二阶导数计算以得到更精确的曲率
  // 这里使用近似方法：计算相邻点的导数变化
  const h = 0.001;
  const t1 = Math.max(0, t - h);
  const t2 = Math.min(1, t + h);
  
  const deriv1 = splineDerivative(points, t1, type, options);
  const deriv2 = splineDerivative(points, t2, type, options);
  
  // 计算导数的变化率（近似二阶导数）
  const ddx = (deriv2.x - deriv1.x) / (2 * h);
  const ddy = (deriv2.y - deriv1.y) / (2 * h);
  
  // 曲率公式：|x'y'' - x''y'| / (x'^2 + y'^2)^(3/2)
  const dx = deriv1.x + (deriv2.x - deriv1.x) / 2; // 中点导数
  const dy = deriv1.y + (deriv2.y - deriv1.y) / 2;
  
  const numerator = Math.abs(dx * ddy - ddx * dy);
  const denominator = Math.pow(dx * dx + dy * dy, 1.5);
  
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * 查找样曲线上距离给定点最近的点
 * @param points 控制点数组
 * @param targetPoint 目标点
 * @param type 样曲线类型
 * @param options 其他选项
 * @param iterations 迭代次数，默认为100
 * @returns 最近点和对应的参数t
 */
export function findClosestPointOnSpline(
  points: Point[],
  targetPoint: Point,
  type: SplineType = SplineType.CUBIC,
  options: { degree?: number } = {},
  iterations: number = 100
): { point: Point; t: number } {
  let minDistance = Infinity;
  let closestPoint: Point = { x: 0, y: 0 };
  let closestT = 0;
  
  // 先进行粗略采样
  const samples = 100;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const curvePoint = splineInterpolate(points, t, type, options);
    const distance = Math.pow(curvePoint.x - targetPoint.x, 2) + Math.pow(curvePoint.y - targetPoint.y, 2);
    
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = curvePoint;
      closestT = t;
    }
  }
  
  // 然后在找到的粗略位置附近进行更精确的二分查找
  let t0 = Math.max(0, closestT - 0.1);
  let t1 = Math.min(1, closestT + 0.1);
  
  for (let i = 0; i < iterations; i++) {
    const mid1 = t0 + (t1 - t0) / 3;
    const mid2 = t1 - (t1 - t0) / 3;
    
    const point1 = splineInterpolate(points, mid1, type, options);
    const point2 = splineInterpolate(points, mid2, type, options);
    
    const dist1 = Math.pow(point1.x - targetPoint.x, 2) + Math.pow(point1.y - targetPoint.y, 2);
    const dist2 = Math.pow(point2.x - targetPoint.x, 2) + Math.pow(point2.y - targetPoint.y, 2);
    
    if (dist1 < dist2) {
      t1 = mid2;
    } else {
      t0 = mid1;
    }
  }
  
  const bestT = (t0 + t1) / 2;
  return {
    point: splineInterpolate(points, bestT, type, options),
    t: bestT
  };
}

/**
 * 将样曲线转换为贝塞尔曲线
 * @param points 控制点数组
 * @param type 样曲线类型
 * @param options 其他选项
 * @returns 贝塞尔曲线段数组，每个段包含控制点
 */
export function splineToBezierCurves(
  points: Point[],
  type: SplineType = SplineType.CUBIC,
  options: { degree?: number } = {}
): Point[][] {
  const curves: Point[][] = [];
  const n = points.length - 1;
  
  // 对于三次样条，每个段可以转换为一个三次贝塞尔曲线
  if (type === SplineType.CUBIC || type === SplineType.NATURAL_CUBIC) {
    const coefficients = calculateCubicSplineCoefficients(points, type);
    
    for (let i = 0; i < n; i++) {
      const p0 = points[i];
      const p3 = points[i + 1];
      const [a, b, c, d] = coefficients[i];
      
      // 计算贝塞尔控制点
      const h = Math.sqrt(Math.pow(p3.x - p0.x, 2) + Math.pow(p3.y - p0.y, 2));
      const p1 = {
        x: p0.x + (p3.x - p0.x) / 3,
        y: p0.y + b * h / 3
      };
      const p2 = {
        x: p3.x - (p3.x - p0.x) / 3,
        y: p3.y - (b + 2 * c * h + 3 * d * h * h) * h / 3
      };
      
      curves.push([p0, p1, p2, p3]);
    }
  } else if (type === SplineType.BSPLINE) {
    // B样条转换为贝塞尔曲线的实现较复杂，这里使用采样近似
    const samplesPerSegment = 10;
    for (let i = 0; i < n; i++) {
      const t0 = i / n;
      const t1 = (i + 1) / n;
      const segmentPoints: Point[] = [];
      
      for (let j = 0; j <= samplesPerSegment; j++) {
        const t = t0 + (t1 - t0) * j / samplesPerSegment;
        segmentPoints.push(splineInterpolate(points, t, type, options));
      }
      
      // 简化为三次贝塞尔曲线（这里使用近似方法）
      curves.push([segmentPoints[0], segmentPoints[3], segmentPoints[6], segmentPoints[10]]);
    }
  } else if (type === SplineType.LINEAR) {
    // 线性样条可以直接表示为线段（一阶贝塞尔曲线）
    for (let i = 0; i < n; i++) {
      curves.push([points[i], points[i + 1]]);
    }
  }
  
  return curves;
}
