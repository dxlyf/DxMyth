// Catmull-Rom曲线相关方法

/**
 * 二维坐标点
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * 二维向量
 */
export interface Vector {
  x: number;
  y: number;
}

/**
 * Catmull-Rom曲线类型枚举
 */
export enum CatmullRomType {
  /** 均匀参数化 */
  UNIFORM = 'uniform',
  /** 准均匀参数化 */
  CENTRIPETAL = 'centripetal',
  /** 弦长参数化 */
  CHORDAL = 'chordal'
}

/**
 * 使用四个控制点计算Catmull-Rom曲线在参数t处的点
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param t 曲线参数 [0, 1]
 * @param tension 张力参数，默认为0.5（标准Catmull-Rom）
 * @returns 曲线上对应点的坐标
 */
export function catmullRomPoint(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number,
  tension: number = 0.5
): Point {
  // 计算插值系数
  const s = t;
  const s2 = s * s;
  const s3 = s2 * s;
  
  // 计算张力系数
  const c = 1 - tension;
  
  // Catmull-Rom基函数系数
  const a0 = -c * s3 + 2 * c * s2 - c * s;
  const a1 = (2 - c) * s3 + (c - 3) * s2 + 1;
  const a2 = (c - 2) * s3 + (3 - 2 * c) * s2 + c * s;
  const a3 = c * s3 - c * s2;
  
  // 计算插值点
  return {
    x: a0 * p0.x + a1 * p1.x + a2 * p2.x + a3 * p3.x,
    y: a0 * p0.y + a1 * p1.y + a2 * p2.y + a3 * p3.y
  };
}

/**
 * 计算点之间的距离
 */
function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 根据控制点数组生成Catmull-Rom曲线上的点
 * @param points 控制点数组（至少需要4个点）
 * @param segments 每段曲线生成的点数（不包括端点）
 * @param type Catmull-Rom曲线类型
 * @param tension 张力参数
 * @returns 生成的曲线上的点数组
 */
export function catmullRomCurve(
  points: Point[],
  segments: number = 10,
  type: CatmullRomType = CatmullRomType.UNIFORM,
  tension: number = 0.5
): Point[] {
  if (points.length < 4) {
    throw new Error('Catmull-Rom曲线需要至少4个控制点');
  }
  
  const result: Point[] = [];
  
  // 处理每个曲线段
  for (let i = 1; i < points.length - 2; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2];
    
    // 对于第一段，添加起始点
    if (i === 1) {
      result.push({ ...p1 });
    }
    
    // 生成中间点
    for (let j = 1; j <= segments; j++) {
      const t = j / (segments + 1);
      const point = catmullRomPoint(p0, p1, p2, p3, t, tension);
      result.push(point);
    }
    
    // 添加段的结束点
    result.push({ ...p2 });
  }
  
  return result;
}

/**
 * 为开环Catmull-Rom曲线生成端点扩展点
 * @param points 原始控制点数组
 * @returns 扩展后的控制点数组，包含额外的端点
 */
export function createExtendedPoints(points: Point[]): Point[] {
  if (points.length < 2) {
    return points;
  }
  
  // 生成起始点前的扩展点
  const startExtension = {
    x: 2 * points[0].x - points[1].x,
    y: 2 * points[0].y - points[1].y
  };
  
  // 生成结束点后的扩展点
  const endExtension = {
    x: 2 * points[points.length - 1].x - points[points.length - 2].x,
    y: 2 * points[points.length - 1].y - points[points.length - 2].y
  };
  
  return [startExtension, ...points, endExtension];
}

/**
 * 生成闭合的Catmull-Rom曲线点
 * @param points 控制点数组（形成闭合曲线）
 * @param segments 每段曲线生成的点数
 * @param tension 张力参数
 * @returns 闭合曲线上的点数组
 */
export function closedCatmullRomCurve(
  points: Point[],
  segments: number = 10,
  tension: number = 0.5
): Point[] {
  if (points.length < 3) {
    throw new Error('闭合Catmull-Rom曲线需要至少3个控制点');
  }
  
  // 创建闭环的扩展点数组
  const closedPoints = [
    points[points.length - 2],
    points[points.length - 1],
    ...points,
    points[0],
    points[1]
  ];
  
  const result: Point[] = [];
  
  // 处理每个曲线段
  for (let i = 1; i <= points.length; i++) {
    const p0 = closedPoints[i - 1];
    const p1 = closedPoints[i];
    const p2 = closedPoints[i + 1];
    const p3 = closedPoints[i + 2];
    
    // 生成中间点
    for (let j = 1; j <= segments; j++) {
      const t = j / (segments + 1);
      const point = catmullRomPoint(p0, p1, p2, p3, t, tension);
      result.push(point);
    }
    
    // 添加段的结束点
    result.push({ ...p2 });
  }
  
  return result;
}

/**
 * 计算Catmull-Rom曲线在参数t处的一阶导数（切线向量）
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param t 曲线参数 [0, 1]
 * @param tension 张力参数
 * @returns 切线向量
 */
export function catmullRomDerivative(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number,
  tension: number = 0.5
): Vector {
  const s = t;
  const s2 = s * s;
  
  const c = 1 - tension;
  
  // 一阶导数系数
  const a0 = -3 * c * s2 + 4 * c * s - c;
  const a1 = 3 * (2 - c) * s2 + 2 * (c - 3) * s;
  const a2 = 3 * (c - 2) * s2 + 2 * (3 - 2 * c) * s + c;
  const a3 = 3 * c * s2 - 2 * c * s;
  
  return {
    x: a0 * p0.x + a1 * p1.x + a2 * p2.x + a3 * p3.x,
    y: a0 * p0.y + a1 * p1.y + a2 * p2.y + a3 * p3.y
  };
}

/**
 * 计算Catmull-Rom曲线在参数t处的二阶导数
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param t 曲线参数 [0, 1]
 * @param tension 张力参数
 * @returns 二阶导数向量
 */
export function catmullRomSecondDerivative(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number,
  tension: number = 0.5
): Vector {
  const s = t;
  const c = 1 - tension;
  
  // 二阶导数系数
  const a0 = -6 * c * s + 4 * c;
  const a1 = 6 * (2 - c) * s + 2 * (c - 3);
  const a2 = 6 * (c - 2) * s + 2 * (3 - 2 * c);
  const a3 = 6 * c * s - 2 * c;
  
  return {
    x: a0 * p0.x + a1 * p1.x + a2 * p2.x + a3 * p3.x,
    y: a0 * p0.y + a1 * p1.y + a2 * p2.y + a3 * p3.y
  };
}

/**
 * 使用数值积分计算Catmull-Rom曲线段的长度
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param tension 张力参数
 * @param numSamples 采样点数，默认为100
 * @returns 曲线段长度
 */
export function catmullRomSegmentLength(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  tension: number = 0.5,
  numSamples: number = 100
): number {
  let length = 0;
  let prevPoint = catmullRomPoint(p0, p1, p2, p3, 0, tension);
  
  for (let i = 1; i <= numSamples; i++) {
    const t = i / numSamples;
    const currentPoint = catmullRomPoint(p0, p1, p2, p3, t, tension);
    length += distance(prevPoint, currentPoint);
    prevPoint = currentPoint;
  }
  
  return length;
}

/**
 * 计算Catmull-Rom曲线的总长度
 * @param points 控制点数组
 * @param tension 张力参数
 * @param numSamplesPerSegment 每段的采样点数
 * @returns 曲线总长度
 */
export function catmullRomCurveLength(
  points: Point[],
  tension: number = 0.5,
  numSamplesPerSegment: number = 100
): number {
  if (points.length < 4) {
    throw new Error('Catmull-Rom曲线需要至少4个控制点');
  }
  
  let totalLength = 0;
  
  for (let i = 1; i < points.length - 2; i++) {
    totalLength += catmullRomSegmentLength(
      points[i - 1],
      points[i],
      points[i + 1],
      points[i + 2],
      tension,
      numSamplesPerSegment
    );
  }
  
  return totalLength;
}

/**
 * 细分Catmull-Rom曲线段
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param tension 张力参数
 * @param divisions 细分次数
 * @returns 细分后的控制点数组
 */
export function subdivideCatmullRomSegment(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  tension: number = 0.5,
  divisions: number = 1
): Point[] {
  const points: Point[] = [p1];
  
  for (let d = 0; d < divisions; d++) {
    const newPoints: Point[] = [points[0]];
    
    for (let i = 0; i < points.length - 1; i++) {
      // 为每个相邻点对创建中点
      const midT = 0.5;
      const midPoint = catmullRomPoint(p0, p1, p2, p3, midT, tension);
      newPoints.push(midPoint);
      newPoints.push(points[i + 1]);
    }
    
    points.length = 0;
    points.push(...newPoints);
  }
  
  points.push(p2);
  return points;
}

/**
 * 将点投影到Catmull-Rom曲线段上
 * @param point 要投影的点
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param tension 张力参数
 * @param iterations 二分迭代次数
 * @returns 投影点信息
 */
export function projectPointToCatmullRomSegment(
  point: Point,
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  tension: number = 0.5,
  iterations: number = 10
): { projection: Point; t: number; distance: number } {
  let tLow = 0;
  let tHigh = 1;
  
  // 使用二分法寻找最近点
  for (let i = 0; i < iterations; i++) {
    const tMid = (tLow + tHigh) * 0.5;
    const tLowMid = (tLow + tMid) * 0.5;
    const tMidHigh = (tMid + tHigh) * 0.5;
    
    const pLowMid = catmullRomPoint(p0, p1, p2, p3, tLowMid, tension);
    const pMid = catmullRomPoint(p0, p1, p2, p3, tMid, tension);
    const pMidHigh = catmullRomPoint(p0, p1, p2, p3, tMidHigh, tension);
    
    const dLowMid = distance(point, pLowMid);
    const dMid = distance(point, pMid);
    const dMidHigh = distance(point, pMidHigh);
    
    if (dLowMid < dMidHigh) {
      tHigh = tMid;
    } else {
      tLow = tMid;
    }
  }
  
  const t = (tLow + tHigh) * 0.5;
  const projection = catmullRomPoint(p0, p1, p2, p3, t, tension);
  const dist = distance(point, projection);
  
  return { projection, t, distance: dist };
}

/**
 * 计算Catmull-Rom曲线段的曲率
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param t 曲线参数 [0, 1]
 * @param tension 张力参数
 * @returns 曲率值
 */
export function catmullRomCurvature(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number,
  tension: number = 0.5
): number {
  const firstDeriv = catmullRomDerivative(p0, p1, p2, p3, t, tension);
  const secondDeriv = catmullRomSecondDerivative(p0, p1, p2, p3, t, tension);
  
  // 计算一阶导数的模长立方
  const ds = Math.sqrt(firstDeriv.x * firstDeriv.x + firstDeriv.y * firstDeriv.y);
  const ds3 = ds * ds * ds;
  
  if (Math.abs(ds3) < 1e-10) {
    return 0;
  }
  
  // 计算曲率
  const curvature = Math.abs(firstDeriv.x * secondDeriv.y - firstDeriv.y * secondDeriv.x) / ds3;
  return curvature;
}

/**
 * 寻找Catmull-Rom曲线段上的最大曲率点
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param tension 张力参数
 * @param samples 采样点数
 * @returns 最大曲率点信息
 */
export function findCatmullRomMaxCurvaturePoint(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  tension: number = 0.5,
  samples: number = 100
): { t: number; curvature: number; point: Point } {
  let maxCurvature = -Infinity;
  let maxCurvatureT = 0;
  let maxCurvaturePoint: Point = p1;
  
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const curvature = catmullRomCurvature(p0, p1, p2, p3, t, tension);
    
    if (curvature > maxCurvature) {
      maxCurvature = curvature;
      maxCurvatureT = t;
      maxCurvaturePoint = catmullRomPoint(p0, p1, p2, p3, t, tension);
    }
  }
  
  return { t: maxCurvatureT, curvature: maxCurvature, point: maxCurvaturePoint };
}

/**
 * 使用向心参数化生成Catmull-Rom曲线点
 * @param points 控制点数组
 * @param alpha 向心参数，默认为0.5（标准向心型）
 * @param segments 每段曲线生成的点数
 * @param tension 张力参数
 * @returns 生成的曲线上的点数组
 */
export function centripetalCatmullRomCurve(
  points: Point[],
  alpha: number = 0.5,
  segments: number = 10,
  tension: number = 0.5
): Point[] {
  if (points.length < 4) {
    throw new Error('Catmull-Rom曲线需要至少4个控制点');
  }
  
  const result: Point[] = [];
  
  // 为每个曲线段生成参数化点
  for (let i = 1; i < points.length - 2; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2];
    
    // 计算向心参数化的节点值
    const d1 = Math.pow(distance(p0, p1), alpha);
    const d2 = Math.pow(distance(p1, p2), alpha);
    const d3 = Math.pow(distance(p2, p3), alpha);
    
    // 创建向心参数化的控制点
    const t0 = 0;
    const t1 = t0 + d1;
    const t2 = t1 + d2;
    const t3 = t2 + d3;
    
    // 生成曲线点
    for (let j = 0; j <= segments; j++) {
      const t = t1 + (t2 - t1) * j / segments;
      const point = centripetalCatmullRomPoint(p0, p1, p2, p3, t, t0, t1, t2, t3, tension);
      result.push(point);
    }
  }
  
  return result;
}

/**
 * 使用向心参数化计算Catmull-Rom曲线点
 */
function centripetalCatmullRomPoint(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number,
  t0: number,
  t1: number,
  t2: number,
  t3: number,
  tension: number = 0.5
): Point {
  const c = 1 - tension;
  
  // 计算插值权重
  const w1_0 = (t1 - t) / (t1 - t0);
  const w1_1 = (t - t0) / (t1 - t0);
  const w2_0 = (t2 - t) / (t2 - t1);
  const w2_1 = (t - t1) / (t2 - t1);
  const w3_0 = (t3 - t) / (t3 - t2);
  const w3_1 = (t - t2) / (t3 - t2);
  
  // 线性插值
  const A_x = w1_0 * p0.x + w1_1 * p1.x;
  const A_y = w1_0 * p0.y + w1_1 * p1.y;
  
  const B_x = w2_0 * p1.x + w2_1 * p2.x;
  const B_y = w2_0 * p1.y + w2_1 * p2.y;
  
  const C_x = w3_0 * p2.x + w3_1 * p3.x;
  const C_y = w3_0 * p2.y + w3_1 * p3.y;
  
  // 二次插值
  const w4_0 = (t2 - t) / (t2 - t0);
  const w4_1 = (t - t0) / (t2 - t0);
  const w5_0 = (t3 - t) / (t3 - t1);
  const w5_1 = (t - t1) / (t3 - t1);
  
  const D_x = w4_0 * A_x + w4_1 * B_x;
  const D_y = w4_0 * A_y + w4_1 * B_y;
  
  const E_x = w5_0 * B_x + w5_1 * C_x;
  const E_y = w5_0 * B_y + w5_1 * C_y;
  
  // 三次插值
  const w6_0 = (t2 - t) / (t2 - t1);
  const w6_1 = (t - t1) / (t2 - t1);
  
  // 最终插值，考虑张力参数
  const x = c * (w6_0 * D_x + w6_1 * E_x) + (1 - c) * B_x;
  const y = c * (w6_0 * D_y + w6_1 * E_y) + (1 - c) * B_y;
  
  return { x, y };
}