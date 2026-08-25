// ══════════════════════════════════════════════
// SVG Arc 参数化转换
// 参考：https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
// ══════════════════════════════════════════════

import { Vector2,type Vector2Like } from "./Vector2"

/** SVG 弧线的端点参数化 */
export interface EndpointArcParams {
  x1: number
  y1: number
  x2: number
  y2: number
  /** 椭圆 x 半轴 */
  rx: number
  /** 椭圆 y 半轴 */
  ry: number
  /** x 轴旋转角（弧度） */
  xAxisRotation: number
  /** 是否走大弧（> 180°） */
  largeArcFlag: boolean
  /** 是否逆时针方向 */
  sweepFlag: boolean
}

/** 弧线的中心参数化 */
export interface CenterArcParams {
  /** 椭圆中心 x */
  cx: number
  /** 椭圆中心 y */
  cy: number
  /** 椭圆 x 半轴 */
  rx: number
  /** 椭圆 y 半轴 */
  ry: number
  /** 起始角（弧度） */
  startAngle: number
  /** 扫描角（弧度），正值为逆时针 */
  sweepAngle: number
  /** x 轴旋转角（弧度） */
  xAxisRotation: number
}

/** 中心参数化转回端点时的返回类型 */
export interface EndpointArcResult {
  x1: number
  y1: number
  x2: number
  y2: number
  largeArcFlag: boolean
  sweepFlag: boolean
}

export function normalizeAngles(startAngle: number, endAngle: number, ccw: boolean = false) {
  const tau = Math.PI * 2
  let newStartAngle = startAngle % tau;
  if (newStartAngle <= 0) {
    newStartAngle += tau;
  }
  let delta = newStartAngle - startAngle;
  startAngle = newStartAngle;
  endAngle += delta;

  if (!ccw && (endAngle - startAngle) >= tau) {
    endAngle = startAngle + tau;
  }
  else if (ccw && (startAngle - endAngle) >= tau) {
    endAngle = startAngle - tau;
  }
  else if (!ccw && startAngle > endAngle) {
    endAngle = startAngle + (tau - (startAngle - endAngle) % tau);
  }
  else if (ccw && startAngle < endAngle) {
    endAngle = startAngle - (tau - (endAngle - startAngle) % tau);
  }
  return { startAngle, endAngle }
}

/**
 * 将 SVG 端点参数化转换为中心参数化。
 *
 * 算法步骤（对应 SVG 规范 F.6.5）：
 * 1. 将端点变换到椭圆局部坐标系
 * 2. 修正 rx/ry（如果太小无法连接两端点，按比例放大）
 * 3. 计算椭圆中心在局部坐标系中的位置
 * 4. 将中心变换回全局坐标系
 * 5. 计算 startAngle 和 sweepAngle
 */
export function endpointToCenter(params: EndpointArcParams): CenterArcParams {
  let { x1, y1, x2, y2, rx, ry, xAxisRotation, largeArcFlag, sweepFlag } = params

  // 预计算旋转角的正弦和余弦
  const sinRot = Math.sin(xAxisRotation)
  const cosRot = Math.cos(xAxisRotation)

  // 步骤 1: 将端点转换到旋转后的中间坐标系
  const dx = (x1 - x2) / 2
  const dy = (y1 - y2) / 2
  const x1p = cosRot * dx + sinRot * dy
  const y1p = -sinRot * dx + cosRot * dy

  // 步骤 2: 确保 rx/ry 足够大以连接两端点
  // 按 SVG 规范 F.6.5 Step 2: Λ = x1'²/rx² + y1'²/ry²
  let rxSq = rx * rx
  let rySq = ry * ry
  const x1pSq = x1p * x1p
  const y1pSq = y1p * y1p

  const lambda = x1pSq / rxSq + y1pSq / rySq
  if (lambda > 1) {
    const s = Math.sqrt(lambda)
    rx *= s
    ry *= s
    rxSq = rx * rx
    rySq = ry * ry
  }

  // 计算中心因子：(rx²*ry² - rx²*y1'² - ry²*x1'²) / (rx²*y1'² + ry²*x1'²)
  const radicant = (rxSq * rySq - rxSq * y1pSq - rySq * x1pSq) / (rxSq * y1pSq + rySq * x1pSq)

  // 步骤 3: 计算中心点 (cxp, cyp) 在局部坐标系中
  // largeArcFlag === sweepFlag 时取负号，否则取正号
  const coeff = (largeArcFlag === sweepFlag ? -1 : 1) * Math.sqrt(radicant)
  const cxp = coeff * ((rx * y1p) / ry)
  const cyp = coeff * ((-ry * x1p) / rx)

  // 步骤 4: 将中心点变换回全局坐标系
  const cx = cosRot * cxp - sinRot * cyp + (x1 + x2) / 2
  const cy = sinRot * cxp + cosRot * cyp + (y1 + y2) / 2

  // 步骤 5: 计算 startAngle 和 sweepAngle
  const startAngle = angleBetween(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
  let sweepAngle = angleBetween(
    (x1p - cxp) / rx,
    (y1p - cyp) / ry,
    (-x1p - cxp) / rx,
    (-y1p - cyp) / ry,
  )

  // 根据 sweepFlag 调整 sweepAngle 使其方向正确
  if (!sweepFlag && sweepAngle > 0) {
    sweepAngle -= 2 * Math.PI
  } else if (sweepFlag && sweepAngle < 0) {
    sweepAngle += 2 * Math.PI
  }

  return { cx, cy, rx, ry, startAngle, sweepAngle, xAxisRotation }
}

/**
 * 将中心参数化转换回端点参数化（endpointToCenter 的逆运算）。
 *
 * 算法步骤：
 * 1. 在局部坐标系中根据 startAngle 和 sweepAngle 计算两端点
 * 2. 将端点旋转回全局坐标系
 * 3. 根据 sweepAngle 推导 largeArcFlag 和 sweepFlag
 */
export function centerToEndpoint(params: CenterArcParams): EndpointArcResult {
  const { cx, cy, rx, ry, startAngle, sweepAngle, xAxisRotation } = params

  const sinRot = Math.sin(xAxisRotation)
  const cosRot = Math.cos(xAxisRotation)

  const endAngle = startAngle + sweepAngle

  // 步骤 1: 在局部坐标系中计算起点和终点
  const x1p = rx * Math.cos(startAngle)
  const y1p = ry * Math.sin(startAngle)
  const x2p = rx * Math.cos(endAngle)
  const y2p = ry * Math.sin(endAngle)

  // 步骤 2: 旋转变换到全局坐标系，并平移到中心
  const x1 = cosRot * x1p - sinRot * y1p + cx
  const y1 = sinRot * x1p + cosRot * y1p + cy
  const x2 = cosRot * x2p - sinRot * y2p + cx
  const y2 = sinRot * x2p + cosRot * y2p + cy

  // 步骤 3: 推导 flag
  const largeArcFlag = Math.abs(sweepAngle) > Math.PI
  const sweepFlag = sweepAngle > 0

  return { x1, y1, x2, y2, largeArcFlag, sweepFlag }
}

/** 椭圆弧的几何表示 */
export interface ArcOvalResult {
  /** 椭圆中心 x */
  cx: number
  /** 椭圆中心 y */
  cy: number
  /** 椭圆 x 半轴 */
  rx: number
  /** 椭圆 y 半轴 */
  ry: number
  /** 起始角（弧度） */
  startAngle: number
  /** 结束角（弧度） */
  endAngle: number
  /** 是否逆时针 */
  counterclockwise: boolean
  /** x 轴旋转角（弧度） */
  xAxisRotation: number
}

/**
 * 将 SVG 弧线端点参数转换为椭圆弧几何表示。
 *
 * 组合 endpointToCenter，输出 startAngle 和 endAngle（而非 sweepAngle），
 * 方便直接用于 canvas arc() 等 API。
 */
export function arcToOval(params: EndpointArcParams): ArcOvalResult {
  const center = endpointToCenter(params)
  return {
    cx: center.cx,
    cy: center.cy,
    rx: center.rx,
    ry: center.ry,
    startAngle: center.startAngle,
    endAngle: center.startAngle + center.sweepAngle,
    counterclockwise: center.sweepAngle < 0,
    xAxisRotation: center.xAxisRotation,
  }
}
export function pointOnEllipse(cx: number, cy: number, rx: number, ry: number, xAxisRotation: number, theta: number) {
  const cos = Math.cos(theta) * rx
  const sin = Math.sin(theta) * ry
  const cosRx = Math.cos(xAxisRotation)
  const sinRx = Math.sin(xAxisRotation)
  return {
    x: cx + cosRx * cos - sinRx * sin,
    y: cy + sinRx * cos + cosRx * sin,
  }
}
// ══════════════════════════════════════════════
// 弧线 → 三次贝塞尔曲线近似
// ══════════════════════════════════════════════

/** 三次贝塞尔曲线段 */
export interface CubicBezierPoints {
  /** 起点 */
  p1: { x: number; y: number }
  /** 控制点 1 */
  cp1: { x: number; y: number }
  /** 控制点 2 */
  cp2: { x: number; y: number }
  /** 终点 */
  p2: { x: number; y: number }
}

/**
 * 四分之一椭圆弧转贝塞尔曲线段
 * @param cx 
 * @param cy 
 * @param rx 
 * @param ry 
 * @param theta1 
 * @param theta2 
 */
export function quarterArcToCubicBezier(cx: number, cy: number, rx: number, ry: number, xAxisRotation: number, theta1: number, theta2: number) {

  const deltaAngle = theta2 - theta1;
  const kappa = 4 / 3 * Math.tan(deltaAngle / 4);
  // 单位圆
  const p0 = Vector2.fromRotation(theta1)
  const p3 = Vector2.fromRotation(theta2)
  const p1 = Vector2.fromPoint(p0)
  const p2 = Vector2.fromPoint(p3)

  // 根据椭圆弧公式与贝赛尔曲线公式，推导楕圆B'(0)=R'(0)
  // 3(p1-p0)=delta*(-sin*rx,cos*ry), p1=p0-(delta/3)*(-sin*rx,cos*ry)  kappa=(delta/3) 
  // kappa= 4 / 3 * Math.tan(deltaAngle / 4);更精确

  p1.translate(-kappa * p0.y, kappa * p0.x);
  p2.translate(kappa * p3.y, -kappa * p3.x);

  p0.scale(rx, ry).rotate(xAxisRotation).translate(cx, cy)
  p1.scale(rx, ry).rotate(xAxisRotation).translate(cx, cy)
  p2.scale(rx, ry).rotate(xAxisRotation).translate(cx, cy)
  p3.scale(rx, ry).rotate(xAxisRotation).translate(cx, cy)

  return [p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y]
}

/**
 * 将椭圆弧近似为三次贝塞尔曲线。
 *
 * 基于公式 k = (4/3) * tan(θ/4)：
 * 1. 在单位圆上计算切点及切线方向的缩放因子
 * 2. 按 rx/ry 缩放到椭圆
 * 3. 按 xAxisRotation 旋转
 * 4. 平移到 (cx, cy)
 *
 * @param cx        椭圆中心 x
 * @param cy        椭圆中心 y
 * @param rx        椭圆 x 半轴
 * @param ry        椭圆 y 半轴
 * @param xAxisRotation x 轴旋转角（弧度）
 * @param startAngle 起始角（弧度）
 * @param deltaAngle 角度跨度（弧度），正值逆时针
 */
export function ellipticalArcToCubicBezier(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  xAxisRotation: number,
  startAngle: number,
  deltaAngle: number
): CubicBezierPoints {
  const sinRot = Math.sin(xAxisRotation)
  const cosRot = Math.cos(xAxisRotation)

  // 峰值切线距离系数：k = (4/3) * tan(θ/4)
  const k = (4 / 3) * Math.tan(deltaAngle / 4)

  // 单位圆上起点和终点
  const cosA0 = Math.cos(startAngle)
  const sinA0 = Math.sin(startAngle)
  const cosA1 = Math.cos(startAngle + deltaAngle)
  const sinA1 = Math.sin(startAngle + deltaAngle)

  // 起点、终点在椭圆局部坐标系中
  const p1LocalX = rx * cosA0
  const p1LocalY = ry * sinA0
  const p2LocalX = rx * cosA1
  const p2LocalY = ry * sinA1

  // 控制点 1：起点 + k * 切线，切线方向 = (-rx*sinA0, ry*cosA0)
  const cp1LocalX = p1LocalX + k * (-rx * sinA0)
  const cp1LocalY = p1LocalY + k * (ry * cosA0)

  // 控制点 2：终点 - k * 切线，切线方向 = (-rx*sinA1, ry*cosA1)
  const cp2LocalX = p2LocalX - k * (-rx * sinA1)
  const cp2LocalY = p2LocalY - k * (ry * cosA1)

  // 旋转变换到全局坐标系并平移
  const p1 = {
    x: cosRot * p1LocalX - sinRot * p1LocalY + cx,
    y: sinRot * p1LocalX + cosRot * p1LocalY + cy,
  }
  const cp1 = {
    x: cosRot * cp1LocalX - sinRot * cp1LocalY + cx,
    y: sinRot * cp1LocalX + cosRot * cp1LocalY + cy,
  }
  const cp2 = {
    x: cosRot * cp2LocalX - sinRot * cp2LocalY + cx,
    y: sinRot * cp2LocalX + cosRot * cp2LocalY + cy,
  }
  const p2 = {
    x: cosRot * p2LocalX - sinRot * p2LocalY + cx,
    y: sinRot * p2LocalX + cosRot * p2LocalY + cy,
  }

  return { p1, cp1, cp2, p2 }
}

/**
 * 将椭圆（或椭圆弧）近似为多段三次贝塞尔曲线。
 *
 * 会自动将弧度按每段不超过 segmentAngle（默认 π/2，即 90°）切分，
 * 保证每段近似精度。
 *
 * @param cx        椭圆中心 x
 * @param cy        椭圆中心 y
 * @param rx        椭圆 x 半轴
 * @param ry        椭圆 y 半轴
 * @param xAxisRotation x 轴旋转角（弧度）
 * @param startAngle 起始角（弧度）
 * @param endAngle   结束角（弧度）
 * @param counterclockwise 是否逆时针，默认 false（顺时针）
 * @param segmentAngle 每段最大角度（弧度），默认 π/2（90°）
 */
export function ellipseToCubicBezier(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  xAxisRotation: number = 0,
  startAngle: number,
  endAngle: number,
  counterclockwise: boolean = false,
  segmentAngle: number = Math.PI / 2,
): CubicBezierPoints[] {
  const result: CubicBezierPoints[] = []

  const { startAngle: newStartAngle, endAngle: newEndAngle } = normalizeAngles(startAngle, endAngle, counterclockwise)
  //  if (Math.abs(sweepAngle) < 1e-15) return result
  const sweepAngle = newEndAngle - newStartAngle

  // 计算分段数，保证每段不超过 segmentAngle

  const count = Math.max(1, Math.ceil(Math.abs(sweepAngle) / segmentAngle))
  const delta = sweepAngle / count

  let angle = newStartAngle
  for (let i = 0; i < count; i++) {
    const seg = ellipticalArcToCubicBezier(cx, cy, rx, ry, xAxisRotation, angle, delta)
    result.push(seg)
    angle += delta
  }

  return result
}


// 椭圆弧转换为二次贝塞尔曲线
export function ellipseToQuadraticBezier(x1: number, y1: number, x2: number, y2: number, radiusX: number, radiusY: number, axisAngle: number, largeArc: number | boolean, sweepClockwise: number | boolean) {

  const { cx, cy, rx, ry, startAngle: theta1, sweepAngle: deltaTheta } = endpointToCenter({
    x1,
    y1,
    x2,
    y2,
    rx: radiusX,
    ry: radiusY,
    xAxisRotation: axisAngle,
    largeArcFlag: largeArc == 1,
    sweepFlag: sweepClockwise == 1,
  })
  const nquads = Math.ceil(Math.abs(deltaTheta) * 4 / Math.PI);
  const anglePerSegment = deltaTheta / nquads;
  const quads: number[][] = []
  let currentX = x1
  let currentY = y1
  for (let i = 0; i < nquads; ++i) {
    let t1 = theta1 + i * anglePerSegment;
    let t2 = t1 + anglePerSegment;
    let tm = (t1 + t2) / 2;

    const { x: _x1, y: _y1 } = pointOnEllipse(cx, cy, rx, ry, axisAngle, t1)
    const { x: _x2, y: _y2 } = pointOnEllipse(cx, cy, rx, ry, axisAngle, t2)
    const { x: xm, y: ym } = pointOnEllipse(cx, cy, rx, ry, axisAngle, tm)// 中点
    // x1 = cos(phi) * rh * cos(t1) - sin(phi) * rv * sin(t1) + cx;
    // y1 = sin(phi) * rh * cos(t1) + cos(phi) * rv * sin(t1) + cy;

    // x2 = cos(phi) * rh * cos(t2) - sin(phi) * rv * sin(t2) + cx;
    // y2 = sin(phi) * rh * cos(t2) + cos(phi) * rv * sin(t2) + cy;

    // let xm = cos(phi) * rh * cos(tm) - sin(phi) * rv * sin(tm) + cx;
    // let ym = sin(phi) * rh * cos(tm) + cos(phi) * rv * sin(tm) + cy;
    // 计算控制点
    let xc = (xm * 4 - (_x1 + _x2)) / 2; // = xm*2-x1*0.5-x2*0.5;
    let yc = (ym * 4 - (_y1 + _y2)) / 2;
    quads.push([currentX, currentY, xc, yc, _x2, _y2])
    currentX = _x2;
    currentY = _y2;

    //  this.quadraticCurveTo(xc, yc, x2, y2)
  }
  return quads
}

export function ellipseCubicBezierFromPath(
  path: Pick<Path2D, 'moveTo' | 'lineTo' | 'bezierCurveTo'> & { isEmpty: boolean },
  x: number, y: number,
  radiusX: number, radiusY: number,
  rotation: number,
  startAngle: number, endAngle: number,
  counterclockwise = false,
): void {
  const { startAngle: startNorm, endAngle: endNorm } = normalizeAngles(startAngle, endAngle, counterclockwise)

  const delta = endNorm - startNorm
  const segments = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)))
  const segAngle = delta / segments

  const cosRot = Math.cos(rotation)
  const sinRot = Math.sin(rotation)

  let currentAngle = startNorm
  for (let i = 0; i < segments; i++) {
    const segStart = currentAngle
    const segEnd = currentAngle + segAngle

    // 参数化椭圆点，含旋转
    const cosStart = Math.cos(segStart)
    const sinStart = Math.sin(segStart)
    const startX = x + cosRot * radiusX * cosStart - sinRot * radiusY * sinStart
    const startY = y + sinRot * radiusX * cosStart + cosRot * radiusY * sinStart

    if (i === 0) {
      if (path.isEmpty) {
        path.moveTo(startX, startY)
      } else {
        path.lineTo(startX, startY)
      }
    }

    // 三次贝塞尔近似椭圆弧段
    const theta = segAngle
    const k = (4 / 3) * Math.tan(theta / 4)

    // 端点沿切线方向偏移，切线方向为旋转后的 (-rx·sin(t), ry·cos(t))
    const tanX1 = -radiusX * sinStart
    const tanY1 = radiusY * cosStart
    const cp1X = startX + k * (cosRot * tanX1 - sinRot * tanY1)
    const cp1Y = startY + k * (sinRot * tanX1 + cosRot * tanY1)

    const cosEnd = Math.cos(segEnd)
    const sinEnd = Math.sin(segEnd)
    const endX = x + cosRot * radiusX * cosEnd - sinRot * radiusY * sinEnd
    const endY = y + sinRot * radiusX * cosEnd + cosRot * radiusY * sinEnd

    const tanX2 = -radiusX * sinEnd
    const tanY2 = radiusY * cosEnd
    const cp2X = endX - k * (cosRot * tanX2 - sinRot * tanY2)
    const cp2Y = endY - k * (sinRot * tanX2 + cosRot * tanY2)

    path.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY)
    currentAngle = segEnd
  }
}
export function arcCubicBezierFromPath(path: Pick<Path2D, 'moveTo' | 'lineTo' | 'bezierCurveTo'> & { isEmpty: boolean }, x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise = false): void {
  const { startAngle: startNorm, endAngle: endNorm } = normalizeAngles(startAngle, endAngle, counterclockwise)

  const delta = endNorm - startNorm

  // 每段最多 90°，保证贝塞尔近似精度
  const segments = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)))
  const segAngle = delta / segments

  let currentAngle = startNorm
  for (let i = 0; i < segments; i++) {
    const segStart = currentAngle
    const segEnd = currentAngle + segAngle

    const startX = x + radius * Math.cos(segStart)
    const startY = y + radius * Math.sin(segStart)

    if (i === 0) {
      // 与 Canvas API 一致：有子路径则 lineTo 到起点，否则 moveTo
      if (path.isEmpty) {
        path.moveTo(startX, startY)
      } else {
        path.lineTo(startX, startY)
      }
    }

    // 三次贝塞尔近似圆弧段（k = 4/3 * tan(θ/4)）
    const theta = segAngle
    const k = (4 / 3) * Math.tan(theta / 4)

    // 起点控制点：沿起点切线方向外推
    const cp1X = startX - k * radius * Math.sin(segStart)
    const cp1Y = startY + k * radius * Math.cos(segStart)

    const endX = x + radius * Math.cos(segEnd)
    const endY = y + radius * Math.sin(segEnd)

    // 终点控制点：沿终点切线方向回推
    const cp2X = endX + k * radius * Math.sin(segEnd)
    const cp2Y = endY - k * radius * Math.cos(segEnd)

    path.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY)
    currentAngle = segEnd
  }

}
export function ellipseSvgArcFromPath(path: Pick<Path2D, 'lineTo' | 'ellipse'>, x1: number, y1: number, rx: number, ry: number, rotation: number, largeArcFlag: boolean, sweepFlag: boolean, x2: number, y2: number): void {
  // 起点终点重合时跳过
  if (Math.abs(x1 - x2) < 1e-10 && Math.abs(y1 - y2) < 1e-10) return

  // 半轴取绝对值
  rx = Math.abs(rx)
  ry = Math.abs(ry)
  if (rx < 1e-10 || ry < 1e-10) {
    path.lineTo(x2, y2)
    return
  }
  const {cx,cy,rx:rx2,ry:ry2,startAngle,sweepAngle}=endpointToCenter({
    x1,
    y1,
    x2,
    y2,
    rx,
    ry,
    xAxisRotation:rotation,
    largeArcFlag,
    sweepFlag
  })
   path.ellipse(cx, cy, rx2, ry2, rotation, startAngle, startAngle+sweepAngle, !sweepFlag)
  // const cosRot = Math.cos(rotation)
  // const sinRot = Math.sin(rotation)

  // // (1) 变换到未旋转坐标系
  // const dx = (x1 - x2) / 2
  // const dy = (y1 - y2) / 2
  // const x1p = cosRot * dx + sinRot * dy
  // const y1p = -sinRot * dx + cosRot * dy

  // // (2) 确保半径足够大（缩放半轴）
  // const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry)
  // if (lambda > 1) {
  //   const sqrtLambda = Math.sqrt(lambda)
  //   rx *= sqrtLambda
  //   ry *= sqrtLambda
  // }

  // // (3) 计算未旋转坐标系下的圆心 (cxp, cyp)
  // const rx2 = rx * rx
  // const ry2 = ry * ry
  // const x1p2 = x1p * x1p
  // const y1p2 = y1p * y1p
  // const sqrtArg = Math.max(0,
  //   (rx2 * ry2 - rx2 * y1p2 - ry2 * x1p2) / (rx2 * y1p2 + ry2 * x1p2),
  // )
  // const sign = largeArcFlag !== sweepFlag ? 1 : -1
  // const sqrtVal = Math.sqrt(sqrtArg)
  // const cxp = sign * sqrtVal * (rx * y1p / ry)
  // const cyp = sign * sqrtVal * (-ry * x1p / rx)

  // // (4) 变换回原始坐标系得到 (cx, cy)
  // const cx = cosRot * cxp - sinRot * cyp + (x1 + x2) / 2
  // const cy = sinRot * cxp + cosRot * cyp + (y1 + y2) / 2

  // // (5) 计算起止角度（在未旋转椭圆坐标系下，除以半轴做归一化）
  // const ux = (x1p - cxp) / rx
  // const uy = (y1p - cyp) / ry
  // const vx = (-x1p - cxp) / rx
  // const vy = (-y1p - cyp) / ry
  // const startAngle = Math.atan2(uy, ux)
  // const endAngle = Math.atan2(vy, vx)

  // // SVG sweepFlag=1 表示顺时针，对应 ellipse() 的 counterclockwise=false
  // path.ellipse(cx, cy, rx, ry, rotation, startAngle, endAngle, !sweepFlag)
}
/**
 * 计算从向量 u 到向量 v 的有向角（弧度），范围 [-π, π]。
 * 正值表示从 u 逆时针旋转到 v。
 */
function angleBetween(ux: number, uy: number, vx: number, vy: number): number {
  const dot = ux * vx + uy * vy
  const cross = ux * vy - uy * vx
  return Math.atan2(cross, dot)
}

