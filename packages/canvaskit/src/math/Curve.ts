/**
 * 常用曲线处理工具函数
 */

import { solveQuadratic } from './Equation';

/** 线性插值 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 二次贝塞尔 */
export function quadBezier(p0: number, p1: number, p2: number, t: number): number {
  const mt = 1 - t;
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
}

/** 三次贝塞尔 */
export function cubicBezier(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return mt2 * mt * p0 + 3 * mt2 * t * p1 + 3 * mt * t2 * p2 + t2 * t * p3;
}

/** 缓动函数：ease-in */
export function easeIn(t: number, power = 2): number {
  return Math.pow(t, power);
}

/** 缓动函数：ease-out */
export function easeOut(t: number, power = 2): number {
  return 1 - Math.pow(1 - t, power);
}

/** 缓动函数：ease-in-out */
export function easeInOut(t: number, power = 2): number {
  return t < 0.5
    ? Math.pow(2, power - 1) * Math.pow(t, power)
    : 1 - Math.pow(-2 * t + 2, power) / 2;
}

/** 样条插值（Catmull-Rom） */
export function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

/** 将 t 映射到分段贝塞尔曲线，segments 为每段控制点数组 */
export function piecewiseBezier(segments: number[][], t: number): number {
  const len = segments.length;
  if (len === 0) return 0;
  const idx = Math.min(Math.floor(t * len), len - 1);
  const localT = (t * len) - idx;
  const seg = segments[idx];
  switch (seg.length) {
    case 3: return quadBezier(seg[0], seg[1], seg[2], localT);
    case 4: return cubicBezier(seg[0], seg[1], seg[2], seg[3], localT);
    default: return seg[0];
  }
}

/** 计算贝塞尔曲线长度（近似） */
export function bezierLength(points: number[], steps = 20): number {
  let len = 0;
  let prev = points[0];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const curr = points.length === 3
      ? quadBezier(points[0], points[1], points[2], t)
      : cubicBezier(points[0], points[1], points[2], points[3], t);
    len += Math.abs(curr - prev);
    prev = curr;
  }
  return len;
}

/** 角度转弧度 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** 弧度转角度 */
export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** SVG arc: 从端点参数计算圆心坐标 */
export function svgArcToCenter(
  x1: number,
  y1: number,
  rx: number,
  ry: number,
  xAxisRotation: number,
  largeArcFlag: boolean,
  sweepFlag: boolean,
  x2: number,
  y2: number
): {
  centerX: number;
  centerY: number;
  startAngleRad: number;
  endAngleRad: number;
  radiusX: number;
  radiusY: number;
  xAxisRotationRad: number;
} {
  // 转换为弧度
  const xAxisRotationRad = (xAxisRotation * Math.PI) / 180;
  
  // 确保半径不为0
  if (rx === 0 || ry === 0) {
    return {
      centerX: (x1 + x2) / 2,
      centerY: (y1 + y2) / 2,
      startAngleRad: 0,
      endAngleRad: 0,
      radiusX: rx,
      radiusY: ry,
      xAxisRotationRad
    };
  }
  
  // 将端点旋转到椭圆坐标系
  const cos = Math.cos(xAxisRotationRad);
  const sin = Math.sin(xAxisRotationRad);
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy;
  const y1p = -sin * dx + cos * dy;
  
  // 确保半径足够大
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    const sqrtLambda = Math.sqrt(lambda);
    rx *= sqrtLambda;
    ry *= sqrtLambda;
  }
  
  // 计算圆心
  const rx2 = rx * rx;
  const ry2 = ry * ry;
  const x1p2 = x1p * x1p;
  const y1p2 = y1p * y1p;
  
  const factor = (largeArcFlag === sweepFlag ? -1 : 1) * 
    Math.sqrt(Math.max(0, (rx2 * ry2 - rx2 * y1p2 - ry2 * x1p2) / (rx2 * y1p2 + ry2 * x1p2)));
  
  const cxp = factor * (rx * y1p) / ry;
  const cyp = factor * (-ry * x1p) / rx;
  
  // 将圆心旋转回原始坐标系
  const centerX = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const centerY = sin * cxp + cos * cyp + (y1 + y2) / 2;
  
  // 计算起始和结束角度
  const startAngleRad = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx);
  const endAngleRad = Math.atan2((y1p + cyp) / ry, (x1p + cxp) / rx);
  
  return {
    centerX,
    centerY,
    startAngleRad,
    endAngleRad,
    radiusX: rx,
    radiusY: ry,
    xAxisRotationRad
  };
}

/** SVG arc: 从圆心坐标计算端点参数 */
export function svgArcFromCenter(
  centerX: number,
  centerY: number,
  rx: number,
  ry: number,
  xAxisRotationRad: number,
  startAngleRad: number,
  endAngleRad: number,
  sweepFlag = true
): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  xAxisRotation: number;
  largeArcFlag: boolean;
  sweepFlag: boolean;
} {
  // 计算起始点
  const cos = Math.cos(xAxisRotationRad);
  const sin = Math.sin(xAxisRotationRad);
  
  const x1 = centerX + rx * Math.cos(startAngleRad) * cos - ry * Math.sin(startAngleRad) * sin;
  const y1 = centerY + rx * Math.cos(startAngleRad) * sin + ry * Math.sin(startAngleRad) * cos;
  
  // 计算结束点
  const x2 = centerX + rx * Math.cos(endAngleRad) * cos - ry * Math.sin(endAngleRad) * sin;
  const y2 = centerY + rx * Math.cos(endAngleRad) * sin + ry * Math.sin(endAngleRad) * cos;
  
  // 计算角度差
  let angleDiff = endAngleRad - startAngleRad;
  
  // 标准化角度差到 [-π, π]
  while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
  while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
  
  // 确定largeArcFlag
  const largeArcFlag = Math.abs(angleDiff) > Math.PI;
  
  return {
    x1,
    y1,
    x2,
    y2,
    xAxisRotation: (xAxisRotationRad * 180) / Math.PI,
    largeArcFlag,
    sweepFlag
  };
}

/** SVG arc: 计算圆弧上的点 */
export function svgArcPoint(
  centerX: number,
  centerY: number,
  rx: number,
  ry: number,
  xAxisRotationRad: number,
  angleRad: number
): { x: number; y: number } {
  const cos = Math.cos(xAxisRotationRad);
  const sin = Math.sin(xAxisRotationRad);
  const x = centerX + rx * Math.cos(angleRad) * cos - ry * Math.sin(angleRad) * sin;
  const y = centerY + rx * Math.cos(angleRad) * sin + ry * Math.sin(angleRad) * cos;
  return { x, y };
}

// ==================== 贝塞尔曲线高级处理 ====================

/** 二次贝塞尔曲线细分（德卡斯特里奥算法） */
export function subdivideQuadBezier(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  t = 0.5
): {
  left: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }];
  right: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }];
} {
  const q0 = {
    x: p0.x + (p1.x - p0.x) * t,
    y: p0.y + (p1.y - p0.y) * t
  };
  const q1 = {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
  const r = {
    x: q0.x + (q1.x - q0.x) * t,
    y: q0.y + (q1.y - q0.y) * t
  };

  return {
    left: [p0, q0, r],
    right: [r, q1, p2]
  };
}

/** 三次贝塞尔曲线细分（德卡斯特里奥算法） */
export function subdivideCubicBezier(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t = 0.5
): {
  left: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }, { x: number; y: number }];
  right: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }, { x: number; y: number }];
} {
  const q0 = {
    x: p0.x + (p1.x - p0.x) * t,
    y: p0.y + (p1.y - p0.y) * t
  };
  const q1 = {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
  const q2 = {
    x: p2.x + (p3.x - p2.x) * t,
    y: p2.y + (p3.y - p2.y) * t
  };

  const r0 = {
    x: q0.x + (q1.x - q0.x) * t,
    y: q0.y + (q1.y - q0.y) * t
  };
  const r1 = {
    x: q1.x + (q2.x - q1.x) * t,
    y: q1.y + (q2.y - q1.y) * t
  };

  const s = {
    x: r0.x + (r1.x - r0.x) * t,
    y: r0.y + (r1.y - r0.y) * t
  };

  return {
    left: [p0, q0, r0, s],
    right: [s, r1, q2, p3]
  };
}

/** 二次贝塞尔曲线升阶到三次 */
export function elevateQuadToCubic(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }, { x: number; y: number }] {
  return [
    p0,
    {
      x: p0.x + (2 * (p1.x - p0.x)) / 3,
      y: p0.y + (2 * (p1.y - p0.y)) / 3
    },
    {
      x: p2.x + (2 * (p1.x - p2.x)) / 3,
      y: p2.y + (2 * (p1.y - p2.y)) / 3
    },
    p2
  ];
}

/** 三次贝塞尔曲线降阶到二次（近似） */
export function reduceCubicToQuad(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }] {
  return [
    p0,
    {
      x: (-p0.x + 3 * p1.x + 3 * p2.x - p3.x) / 4,
      y: (-p0.y + 3 * p1.y + 3 * p2.y - p3.y) / 4
    },
    p3
  ];
}

/** 二次贝塞尔曲线求导（切线向量） */
export function quadBezierDerivative(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  t: number
): { x: number; y: number } {
  return {
    x: 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x),
    y: 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
  };
}

/** 三次贝塞尔曲线求导（切线向量） */
export function cubicBezierDerivative(
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
    x: 3 * mt2 * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t2 * (p3.x - p2.x),
    y: 3 * mt2 * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t2 * (p3.y - p2.y)
  };
}

/** 二次贝塞尔曲线求二次导数 */
export function quadBezierSecondDerivative(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  t: number
): { x: number; y: number } {
  return {
    x: 2 * (p2.x - 2 * p1.x + p0.x),
    y: 2 * (p2.y - 2 * p1.y + p0.y)
  };
}

/** 三次贝塞尔曲线求二次导数 */
export function cubicBezierSecondDerivative(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const mt = 1 - t;
  return {
    x: 6 * mt * (p2.x - 2 * p1.x + p0.x) + 6 * t * (p3.x - 2 * p2.x + p1.x),
    y: 6 * mt * (p2.y - 2 * p1.y + p0.y) + 6 * t * (p3.y - 2 * p2.y + p1.y)
  };
}

/** 二次贝塞尔曲线求极值点 */
export function quadBezierExtrema(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): { xExtrema: number[]; yExtrema: number[] } {
  const xExtrema: number[] = [];
  const yExtrema: number[] = [];

  // X方向极值
  const xDenom = p0.x - 2 * p1.x + p2.x;
  if (Math.abs(xDenom) > 1e-10) {
    const t = (p0.x - p1.x) / xDenom;
    if (t >= 0 && t <= 1) {
      xExtrema.push(t);
    }
  }

  // Y方向极值
  const yDenom = p0.y - 2 * p1.y + p2.y;
  if (Math.abs(yDenom) > 1e-10) {
    const t = (p0.y - p1.y) / yDenom;
    if (t >= 0 && t <= 1) {
      yExtrema.push(t);
    }
  }

  return { xExtrema, yExtrema };
}

/** 三次贝塞尔曲线求极值点 */
export function cubicBezierExtrema(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): { xExtrema: number[]; yExtrema: number[] } {
  const xExtrema: number[] = [];
  const yExtrema: number[] = [];

  // X方向极值 - 解二次方程
  const a = -p0.x + 3 * p1.x - 3 * p2.x + p3.x;
  const b = 2 * p0.x - 4 * p1.x + 2 * p2.x;
  const c = -p0.x + p1.x;

  const xRoots = solveQuadratic(a, b, c);
  for (const t of xRoots) {
    if (t >= 0 && t <= 1) {
      xExtrema.push(t);
    }
  }

  // Y方向极值 - 解二次方程
  const ay = -p0.y + 3 * p1.y - 3 * p2.y + p3.y;
  const by = 2 * p0.y - 4 * p1.y + 2 * p2.y;
  const cy = -p0.y + p1.y;

  const yRoots = solveQuadratic(ay, by, cy);
  for (const t of yRoots) {
    if (t >= 0 && t <= 1) {
      yExtrema.push(t);
    }
  }

  return { xExtrema, yExtrema };
}

/** 计算二次贝塞尔曲线的曲率 */
export function quadBezierCurvature(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  t: number
): number {
  const first = quadBezierDerivative(p0, p1, p2, t);
  const second = quadBezierSecondDerivative(p0, p1, p2, t);
  
  const cross = first.x * second.y - first.y * second.x;
  const firstMag = Math.sqrt(first.x * first.x + first.y * first.y);
  
  if (firstMag < 1e-10) return 0;
  
  return Math.abs(cross) / Math.pow(firstMag, 3);
}

/** 计算三次贝塞尔曲线的曲率 */
export function cubicBezierCurvature(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
): number {
  const first = cubicBezierDerivative(p0, p1, p2, p3, t);
  const second = cubicBezierSecondDerivative(p0, p1, p2, p3, t);
  
  const cross = first.x * second.y - first.y * second.x;
  const firstMag = Math.sqrt(first.x * first.x + first.y * first.y);
  
  if (firstMag < 1e-10) return 0;
  
  return Math.abs(cross) / Math.pow(firstMag, 3);
}

/** 求二次贝塞尔曲线的最大曲率点 */
export function quadBezierMaxCurvature(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  samples = 100
): { maxCurvature: number; t: number; point: { x: number; y: number } } {
  let maxCurvature = 0;
  let maxT = 0;
  
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const curvature = quadBezierCurvature(p0, p1, p2, t);
    
    if (curvature > maxCurvature) {
      maxCurvature = curvature;
      maxT = t;
    }
  }
  
  // 在最大值附近进行精细搜索
  const refinedT = refineMaxCurvature(p0, p1, p2, maxT, 'quad');
  const point = quadBezierParametric(p0, p1, p2, refinedT);
  
  return {
    maxCurvature: quadBezierCurvature(p0, p1, p2, refinedT),
    t: refinedT,
    point
  };
}

/** 求三次贝塞尔曲线的最大曲率点 */
export function cubicBezierMaxCurvature(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  samples = 100
): { maxCurvature: number; t: number; point: { x: number; y: number } } {
  let maxCurvature = 0;
  let maxT = 0;
  
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const curvature = cubicBezierCurvature(p0, p1, p2, p3, t);
    
    if (curvature > maxCurvature) {
      maxCurvature = curvature;
      maxT = t;
    }
  }
  
  // 在最大值附近进行精细搜索
  const refinedT = refineMaxCurvature(p0, p1, p2, maxT, 'cubic', p3);
  const point = cubicBezierParametric(p0, p1, p2, p3, refinedT);
  
  return {
    maxCurvature: cubicBezierCurvature(p0, p1, p2, p3, refinedT),
    t: refinedT,
    point
  };
}

/** 精细搜索最大曲率点（内部函数） */
function refineMaxCurvature(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  initialT: number,
  type: 'quad' | 'cubic',
  p3?: { x: number; y: number }
): number {
  let bestT = initialT;
  let maxCurvature = type === 'quad' 
    ? quadBezierCurvature(p0, p1, p2, initialT)
    : cubicBezierCurvature(p0, p1, p2, p3!, initialT);
  
  // 黄金分割搜索
  const phi = (1 + Math.sqrt(5)) / 2;
  const resphi = 2 - phi;
  
  let a = Math.max(0, initialT - 0.1);
  let b = Math.min(1, initialT + 0.1);
  
  for (let i = 0; i < 20; i++) {
    const c = b - resphi * (b - a);
    const d = a + resphi * (b - a);
    
    const curC = type === 'quad' 
      ? quadBezierCurvature(p0, p1, p2, c)
      : cubicBezierCurvature(p0, p1, p2, p3!, c);
    
    const curD = type === 'quad' 
      ? quadBezierCurvature(p0, p1, p2, d)
      : cubicBezierCurvature(p0, p1, p2, p3!, d);
    
    if (curC > curD) {
      b = d;
      if (curC > maxCurvature) {
        maxCurvature = curC;
        bestT = c;
      }
    } else {
      a = c;
      if (curD > maxCurvature) {
        maxCurvature = curD;
        bestT = d;
      }
    }
  }
  
  return bestT;
}

/** 二次贝塞尔曲线参数方程（为了与其他函数保持一致） */
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

/** 三次贝塞尔曲线参数方程（为了与其他函数保持一致） */
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

// ==================== N阶贝塞尔曲线处理 ====================

/** N阶贝塞尔曲线参数方程 */
export function nBezierParametric(
  controlPoints: { x: number; y: number }[],
  t: number
): { x: number; y: number } {
  const n = controlPoints.length - 1;
  let x = 0;
  let y = 0;
  
  for (let i = 0; i <= n; i++) {
    const coefficient = binomialCoefficient(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i);
    x += coefficient * controlPoints[i].x;
    y += coefficient * controlPoints[i].y;
  }
  
  return { x, y };
}

/** N阶贝塞尔曲线求导 - 返回求导后的控制点 */
export function nBezierDerivative(
  controlPoints: { x: number; y: number }[]
): { x: number; y: number }[] {
  const n = controlPoints.length - 1;
  
  if (n === 0) {
    return [{ x: 0, y: 0 }];
  }
  
  const derivativePoints: { x: number; y: number }[] = [];
  
  for (let i = 0; i < n; i++) {
    derivativePoints.push({
      x: n * (controlPoints[i + 1].x - controlPoints[i].x),
      y: n * (controlPoints[i + 1].y - controlPoints[i].y)
    });
  }
  
  return derivativePoints;
}

/** N阶贝塞尔曲线求k阶导数 - 返回k阶导数后的控制点 */
export function nBezierKthDerivative(
  controlPoints: { x: number; y: number }[],
  k: number
): { x: number; y: number }[] {
  if (k <= 0) {
    return [...controlPoints];
  }
  
  let currentPoints = [...controlPoints];
  let currentOrder = currentPoints.length - 1;
  
  for (let derivativeOrder = 1; derivativeOrder <= k; derivativeOrder++) {
    if (currentOrder === 0) {
      // 零阶导数，返回原点
      return [{ x: 0, y: 0 }];
    }
    
    const nextPoints: { x: number; y: number }[] = [];
    
    for (let i = 0; i < currentOrder; i++) {
      nextPoints.push({
        x: currentOrder * (currentPoints[i + 1].x - currentPoints[i].x),
        y: currentOrder * (currentPoints[i + 1].y - currentPoints[i].y)
      });
    }
    
    currentPoints = nextPoints;
    currentOrder--;
  }
  
  return currentPoints;
}

/** N阶贝塞尔曲线在指定点的导数值（切线向量） */
export function nBezierDerivativeAt(
  controlPoints: { x: number; y: number }[],
  t: number
): { x: number; y: number } {
  const derivativePoints = nBezierDerivative(controlPoints);
  return nBezierParametric(derivativePoints, t);
}

/** N阶贝塞尔曲线在指定点的k阶导数值 */
export function nBezierKthDerivativeAt(
  controlPoints: { x: number; y: number }[],
  t: number,
  k: number
): { x: number; y: number } {
  const kthDerivativePoints = nBezierKthDerivative(controlPoints, k);
  return nBezierParametric(kthDerivativePoints, t);
}

/** 计算二项式系数（内部辅助函数） */
function binomialCoefficient(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  let result = 1;
  const minK = Math.min(k, n - k);
  
  for (let i = 0; i < minK; i++) {
    result = result * (n - i) / (i + 1);
  }
  
  return result;
}

/** N阶贝塞尔曲线细分（德卡斯特里奥算法） */
export function nBezierSubdivide(
  controlPoints: { x: number; y: number }[],
  t = 0.5
): {
  left: { x: number; y: number }[];
  right: { x: number; y: number }[];
} {
  const n = controlPoints.length - 1;
  const leftPoints: { x: number; y: number }[] = [];
  const rightPoints: { x: number; y: number }[] = [];
  
  // 创建工作副本
  const workingPoints = controlPoints.map(p => ({ ...p }));
  
  // 德卡斯特里奥算法
  for (let j = 0; j <= n; j++) {
    leftPoints.push({ ...workingPoints[0] });
    rightPoints.unshift({ ...workingPoints[workingPoints.length - 1] });
    
    for (let i = 0; i < n - j; i++) {
      workingPoints[i] = {
        x: workingPoints[i].x + t * (workingPoints[i + 1].x - workingPoints[i].x),
        y: workingPoints[i].y + t * (workingPoints[i + 1].y - workingPoints[i].y)
      };
    }
  }
  
  return { left: leftPoints, right: rightPoints };
}

/** N阶贝塞尔曲线升阶 */
export function nBezierElevate(
  controlPoints: { x: number; y: number }[]
): { x: number; y: number }[] {
  const n = controlPoints.length - 1;
  const elevatedPoints: { x: number; y: number }[] = [];
  
  // 第一个点保持不变
  elevatedPoints.push({ ...controlPoints[0] });
  
  // 中间点
  for (let i = 1; i <= n; i++) {
    const alpha = i / (n + 1);
    elevatedPoints.push({
      x: alpha * controlPoints[i - 1].x + (1 - alpha) * controlPoints[i].x,
      y: alpha * controlPoints[i - 1].y + (1 - alpha) * controlPoints[i].y
    });
  }
  
  // 最后一个点保持不变
  elevatedPoints.push({ ...controlPoints[n] });
  
  return elevatedPoints;
}

/** N阶贝塞尔曲线降阶（近似） */
export function nBezierReduce(
  controlPoints: { x: number; y: number }[],
  targetOrder?: number
): { x: number; y: number }[] {
  const currentOrder = controlPoints.length - 1;
  const reductionOrder = targetOrder !== undefined ? targetOrder : currentOrder - 1;
  
  if (reductionOrder >= currentOrder) {
    return [...controlPoints];
  }
  
  if (reductionOrder < 1) {
    // 降阶到直线，返回起点和终点
    return [controlPoints[0], controlPoints[controlPoints.length - 1]];
  }
  
  const reducedPoints: { x: number; y: number }[] = [];
  const n = currentOrder;
  const r = reductionOrder;
  
  for (let i = 0; i <= r; i++) {
    let x = 0;
    let y = 0;
    
    for (let j = 0; j <= n; j++) {
      let coefficient = 0;
      
      if (j >= i - 1 && j <= i + n - r) {
        const alpha = j - i + 1;
        const beta = i + n - r - j;
        
        coefficient = (binomialCoefficient(r, i) * binomialCoefficient(n - r, alpha)) / binomialCoefficient(n, j);
        
        if (alpha % 2 === 1) {
          coefficient = -coefficient;
        }
      }
      
      x += coefficient * controlPoints[j].x;
      y += coefficient * controlPoints[j].y;
    }
    
    reducedPoints.push({ x, y });
  }
  
  return reducedPoints;
}

/** N阶贝塞尔曲线求极值点 */
export function nBezierExtrema(
  controlPoints: { x: number; y: number }[]
): { xExtrema: number[]; yExtrema: number[] } {
  const derivativePoints = nBezierDerivative(controlPoints);
  const xExtrema: number[] = [];
  const yExtrema: number[] = [];
  
  // 对于高阶导数，使用数值方法求根
  const samples = 100;
  for (let i = 0; i < samples - 1; i++) {
    const t1 = i / samples;
    const t2 = (i + 1) / samples;
    
    const derivative1 = nBezierParametric(derivativePoints, t1);
    const derivative2 = nBezierParametric(derivativePoints, t2);
    
    // X方向极值
    if (derivative1.x * derivative2.x < 0) {
      // 符号变化，存在根
      const root = bisectionMethod(t1, t2, (t: number) => nBezierParametric(derivativePoints, t).x);
      if (root !== null) {
        xExtrema.push(root);
      }
    }
    
    // Y方向极值
    if (derivative1.y * derivative2.y < 0) {
      // 符号变化，存在根
      const root = bisectionMethod(t1, t2, (t: number) => nBezierParametric(derivativePoints, t).y);
      if (root !== null) {
        yExtrema.push(root);
      }
    }
  }
  
  return { xExtrema, yExtrema };
}

/** 二分法求根（内部辅助函数） */
function bisectionMethod(
  a: number,
  b: number,
  f: (x: number) => number,
  tolerance = 1e-10,
  maxIterations = 100
): number | null {
  let fa = f(a);
  let fb = f(b);
  
  if (fa * fb > 0) {
    return null; // 没有根
  }
  
  for (let i = 0; i < maxIterations; i++) {
    const c = (a + b) / 2;
    const fc = f(c);
    
    if (Math.abs(fc) < tolerance || Math.abs(b - a) < tolerance) {
      return c;
    }
    
    if (fa * fc < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }
  }
  
  return (a + b) / 2;
}

/** 计算N阶贝塞尔曲线的曲率 */
export function nBezierCurvature(
  controlPoints: { x: number; y: number }[],
  t: number
): number {
  const firstDerivative = nBezierDerivativeAt(controlPoints, t);
  const secondDerivativePoints = nBezierKthDerivative(controlPoints, 2);
  const secondDerivative = nBezierParametric(secondDerivativePoints, t);
  
  const cross = firstDerivative.x * secondDerivative.y - firstDerivative.y * secondDerivative.x;
  const firstMag = Math.sqrt(firstDerivative.x * firstDerivative.x + firstDerivative.y * firstDerivative.y);
  
  if (firstMag < 1e-10) return 0;
  
  return Math.abs(cross) / Math.pow(firstMag, 3);
}

/** 求N阶贝塞尔曲线的最大曲率点 */
export function nBezierMaxCurvature(
  controlPoints: { x: number; y: number }[],
  samples = 100
): { maxCurvature: number; t: number; point: { x: number; y: number } } {
  let maxCurvature = 0;
  let maxT = 0;
  
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const curvature = nBezierCurvature(controlPoints, t);
    
    if (curvature > maxCurvature) {
      maxCurvature = curvature;
      maxT = t;
    }
  }
  
  // 在最大值附近进行精细搜索
  const refinedT = refineNBezierMaxCurvature(controlPoints, maxT);
  const point = nBezierParametric(controlPoints, refinedT);
  
  return {
    maxCurvature: nBezierCurvature(controlPoints, refinedT),
    t: refinedT,
    point
  };
}

/** 精细搜索N阶贝塞尔曲线最大曲率点（内部函数） */
function refineNBezierMaxCurvature(
  controlPoints: { x: number; y: number }[],
  initialT: number
): number {
  let bestT = initialT;
  let maxCurvature = nBezierCurvature(controlPoints, initialT);
  
  // 黄金分割搜索
  const phi = (1 + Math.sqrt(5)) / 2;
  const resphi = 2 - phi;
  
  let a = Math.max(0, initialT - 0.1);
  let b = Math.min(1, initialT + 0.1);
  
  for (let i = 0; i < 20; i++) {
    const c = b - resphi * (b - a);
    const d = a + resphi * (b - a);
    
    const curC = nBezierCurvature(controlPoints, c);
    const curD = nBezierCurvature(controlPoints, d);
    
    if (curC > curD) {
      b = d;
      if (curC > maxCurvature) {
        maxCurvature = curC;
        bestT = c;
      }
    } else {
      a = c;
      if (curD > maxCurvature) {
        maxCurvature = curD;
        bestT = d;
      }
    }
  }
  
  return bestT;
}
