import { Matrix2D } from "./Matrix2D.js";
import { Vector2 } from "./Vector2.js";
function normalizeAngles(startAngle, endAngle, ccw = false) {
  const tau = Math.PI * 2;
  let newStartAngle = startAngle % tau;
  if (newStartAngle <= 0) {
    newStartAngle += tau;
  }
  let delta = newStartAngle - startAngle;
  startAngle = newStartAngle;
  endAngle += delta;
  if (!ccw && endAngle - startAngle >= tau) {
    endAngle = startAngle + tau;
  } else if (ccw && startAngle - endAngle >= tau) {
    endAngle = startAngle - tau;
  } else if (!ccw && startAngle > endAngle) {
    endAngle = startAngle + (tau - (startAngle - endAngle) % tau);
  } else if (ccw && startAngle < endAngle) {
    endAngle = startAngle - (tau - (endAngle - startAngle) % tau);
  }
  return { startAngle, endAngle };
}
function endpointToCenter(params) {
  let { x1, y1, x2, y2, rx, ry, xAxisRotation, largeArcFlag, sweepFlag } = params;
  const sinRot = Math.sin(xAxisRotation);
  const cosRot = Math.cos(xAxisRotation);
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cosRot * dx + sinRot * dy;
  const y1p = -sinRot * dx + cosRot * dy;
  let rxSq = rx * rx;
  let rySq = ry * ry;
  const x1pSq = x1p * x1p;
  const y1pSq = y1p * y1p;
  const lambda = x1pSq / rxSq + y1pSq / rySq;
  if (lambda > 1) {
    const s = Math.sqrt(lambda);
    rx *= s;
    ry *= s;
    rxSq = rx * rx;
    rySq = ry * ry;
  }
  const radicant = (rxSq * rySq - rxSq * y1pSq - rySq * x1pSq) / (rxSq * y1pSq + rySq * x1pSq);
  const coeff = (largeArcFlag === sweepFlag ? -1 : 1) * Math.sqrt(radicant);
  const cxp = coeff * (rx * y1p / ry);
  const cyp = coeff * (-ry * x1p / rx);
  const cx = cosRot * cxp - sinRot * cyp + (x1 + x2) / 2;
  const cy = sinRot * cxp + cosRot * cyp + (y1 + y2) / 2;
  const startAngle = angleBetween(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let sweepAngle = angleBetween(
    (x1p - cxp) / rx,
    (y1p - cyp) / ry,
    (-x1p - cxp) / rx,
    (-y1p - cyp) / ry
  );
  if (!sweepFlag && sweepAngle > 0) {
    sweepAngle -= 2 * Math.PI;
  } else if (sweepFlag && sweepAngle < 0) {
    sweepAngle += 2 * Math.PI;
  }
  return { cx, cy, rx, ry, startAngle, sweepAngle, xAxisRotation };
}
function centerToEndpoint(params) {
  const { cx, cy, rx, ry, startAngle, sweepAngle, xAxisRotation } = params;
  const sinRot = Math.sin(xAxisRotation);
  const cosRot = Math.cos(xAxisRotation);
  const endAngle = startAngle + sweepAngle;
  const x1p = rx * Math.cos(startAngle);
  const y1p = ry * Math.sin(startAngle);
  const x2p = rx * Math.cos(endAngle);
  const y2p = ry * Math.sin(endAngle);
  const x1 = cosRot * x1p - sinRot * y1p + cx;
  const y1 = sinRot * x1p + cosRot * y1p + cy;
  const x2 = cosRot * x2p - sinRot * y2p + cx;
  const y2 = sinRot * x2p + cosRot * y2p + cy;
  const largeArcFlag = Math.abs(sweepAngle) > Math.PI;
  const sweepFlag = sweepAngle > 0;
  return { x1, y1, x2, y2, largeArcFlag, sweepFlag };
}
function arcToOval(params) {
  const center = endpointToCenter(params);
  return {
    cx: center.cx,
    cy: center.cy,
    rx: center.rx,
    ry: center.ry,
    startAngle: center.startAngle,
    endAngle: center.startAngle + center.sweepAngle,
    counterclockwise: center.sweepAngle < 0,
    xAxisRotation: center.xAxisRotation
  };
}
function pointOnEllipse(cx, cy, rx, ry, xAxisRotation, theta) {
  const cos = Math.cos(theta) * rx;
  const sin = Math.sin(theta) * ry;
  const cosRx = Math.cos(xAxisRotation);
  const sinRx = Math.sin(xAxisRotation);
  return {
    x: cx + cosRx * cos - sinRx * sin,
    y: cy + sinRx * cos + cosRx * sin
  };
}
function ellipseMatrix(cx, cy, rx, ry, rotation) {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  return Matrix2D.fromValues(rx * cos, rx * sin, -ry * sin, ry * cos, cx, cy);
}
function appendUnitArcCubics(path, m, theta0, sweep) {
  const n = Math.max(1, Math.ceil(Math.abs(sweep) / (Math.PI / 2)));
  const seg = sweep / n;
  const k = 4 / 3 * Math.tan(seg / 4);
  let t0 = theta0;
  for (let i = 0; i < n; i++) {
    const t1 = t0 + seg;
    const c0 = Math.cos(t0);
    const s0 = Math.sin(t0);
    const c1 = Math.cos(t1);
    const s1 = Math.sin(t1);
    const u1 = c0 - k * s0;
    const v1 = s0 + k * c0;
    const u2 = c1 + k * s1;
    const v2 = s1 - k * c1;
    path.bezierCurveTo(
      m.a * u1 + m.c * v1 + m.tx,
      m.b * u1 + m.d * v1 + m.ty,
      m.a * u2 + m.c * v2 + m.tx,
      m.b * u2 + m.d * v2 + m.ty,
      m.a * c1 + m.c * s1 + m.tx,
      m.b * c1 + m.d * s1 + m.ty
    );
    t0 = t1;
  }
}
function quarterArcToCubicBezier(cx, cy, rx, ry, xAxisRotation, theta1, theta2) {
  const deltaAngle = theta2 - theta1;
  const kappa = 4 / 3 * Math.tan(deltaAngle / 4);
  const p0 = Vector2.fromRotation(theta1);
  const p3 = Vector2.fromRotation(theta2);
  const p1 = Vector2.fromPoint(p0);
  const p2 = Vector2.fromPoint(p3);
  p1.translate(-kappa * p0.y, kappa * p0.x);
  p2.translate(kappa * p3.y, -kappa * p3.x);
  p0.scale(rx, ry).rotate(xAxisRotation).translate(cx, cy);
  p1.scale(rx, ry).rotate(xAxisRotation).translate(cx, cy);
  p2.scale(rx, ry).rotate(xAxisRotation).translate(cx, cy);
  p3.scale(rx, ry).rotate(xAxisRotation).translate(cx, cy);
  return [p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y];
}
function ellipticalArcToCubicBezier(cx, cy, rx, ry, xAxisRotation, startAngle, deltaAngle) {
  const sinRot = Math.sin(xAxisRotation);
  const cosRot = Math.cos(xAxisRotation);
  const k = 4 / 3 * Math.tan(deltaAngle / 4);
  const cosA0 = Math.cos(startAngle);
  const sinA0 = Math.sin(startAngle);
  const cosA1 = Math.cos(startAngle + deltaAngle);
  const sinA1 = Math.sin(startAngle + deltaAngle);
  const p1LocalX = rx * cosA0;
  const p1LocalY = ry * sinA0;
  const p2LocalX = rx * cosA1;
  const p2LocalY = ry * sinA1;
  const cp1LocalX = p1LocalX + k * (-rx * sinA0);
  const cp1LocalY = p1LocalY + k * (ry * cosA0);
  const cp2LocalX = p2LocalX - k * (-rx * sinA1);
  const cp2LocalY = p2LocalY - k * (ry * cosA1);
  const p1 = {
    x: cosRot * p1LocalX - sinRot * p1LocalY + cx,
    y: sinRot * p1LocalX + cosRot * p1LocalY + cy
  };
  const cp1 = {
    x: cosRot * cp1LocalX - sinRot * cp1LocalY + cx,
    y: sinRot * cp1LocalX + cosRot * cp1LocalY + cy
  };
  const cp2 = {
    x: cosRot * cp2LocalX - sinRot * cp2LocalY + cx,
    y: sinRot * cp2LocalX + cosRot * cp2LocalY + cy
  };
  const p2 = {
    x: cosRot * p2LocalX - sinRot * p2LocalY + cx,
    y: sinRot * p2LocalX + cosRot * p2LocalY + cy
  };
  return { p1, cp1, cp2, p2 };
}
function ellipseToCubicBezier(cx, cy, rx, ry, xAxisRotation = 0, startAngle, endAngle, counterclockwise = false, segmentAngle = Math.PI / 2) {
  const result = [];
  const { startAngle: newStartAngle, endAngle: newEndAngle } = normalizeAngles(startAngle, endAngle, counterclockwise);
  const sweepAngle = newEndAngle - newStartAngle;
  const count = Math.max(1, Math.ceil(Math.abs(sweepAngle) / segmentAngle));
  const delta = sweepAngle / count;
  let angle = newStartAngle;
  for (let i = 0; i < count; i++) {
    const seg = ellipticalArcToCubicBezier(cx, cy, rx, ry, xAxisRotation, angle, delta);
    result.push(seg);
    angle += delta;
  }
  return result;
}
function ellipseToQuadraticBezier(x1, y1, x2, y2, radiusX, radiusY, axisAngle, largeArc, sweepClockwise) {
  const { cx, cy, rx, ry, startAngle: theta1, sweepAngle: deltaTheta } = endpointToCenter({
    x1,
    y1,
    x2,
    y2,
    rx: radiusX,
    ry: radiusY,
    xAxisRotation: axisAngle,
    largeArcFlag: largeArc == 1,
    sweepFlag: sweepClockwise == 1
  });
  const nquads = Math.ceil(Math.abs(deltaTheta) * 4 / Math.PI);
  const anglePerSegment = deltaTheta / nquads;
  const quads = [];
  let currentX = x1;
  let currentY = y1;
  for (let i = 0; i < nquads; ++i) {
    let t1 = theta1 + i * anglePerSegment;
    let t2 = t1 + anglePerSegment;
    let tm = (t1 + t2) / 2;
    const { x: _x1, y: _y1 } = pointOnEllipse(cx, cy, rx, ry, axisAngle, t1);
    const { x: _x2, y: _y2 } = pointOnEllipse(cx, cy, rx, ry, axisAngle, t2);
    const { x: xm, y: ym } = pointOnEllipse(cx, cy, rx, ry, axisAngle, tm);
    let xc = (xm * 4 - (_x1 + _x2)) / 2;
    let yc = (ym * 4 - (_y1 + _y2)) / 2;
    quads.push([currentX, currentY, xc, yc, _x2, _y2]);
    currentX = _x2;
    currentY = _y2;
  }
  return quads;
}
function ellipseCubicBezierFromPath(path, x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise = false) {
  const { startAngle: startNorm, endAngle: endNorm } = normalizeAngles(startAngle, endAngle, counterclockwise);
  const delta = endNorm - startNorm;
  const segments = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)));
  const segAngle = delta / segments;
  const cosRot = Math.cos(rotation);
  const sinRot = Math.sin(rotation);
  let currentAngle = startNorm;
  for (let i = 0; i < segments; i++) {
    const segStart = currentAngle;
    const segEnd = currentAngle + segAngle;
    const cosStart = Math.cos(segStart);
    const sinStart = Math.sin(segStart);
    const startX = x + cosRot * radiusX * cosStart - sinRot * radiusY * sinStart;
    const startY = y + sinRot * radiusX * cosStart + cosRot * radiusY * sinStart;
    if (i === 0) {
      if (path.isEmpty) {
        path.moveTo(startX, startY);
      } else {
        path.lineTo(startX, startY);
      }
    }
    const theta = segAngle;
    const k = 4 / 3 * Math.tan(theta / 4);
    const tanX1 = -radiusX * sinStart;
    const tanY1 = radiusY * cosStart;
    const cp1X = startX + k * (cosRot * tanX1 - sinRot * tanY1);
    const cp1Y = startY + k * (sinRot * tanX1 + cosRot * tanY1);
    const cosEnd = Math.cos(segEnd);
    const sinEnd = Math.sin(segEnd);
    const endX = x + cosRot * radiusX * cosEnd - sinRot * radiusY * sinEnd;
    const endY = y + sinRot * radiusX * cosEnd + cosRot * radiusY * sinEnd;
    const tanX2 = -radiusX * sinEnd;
    const tanY2 = radiusY * cosEnd;
    const cp2X = endX - k * (cosRot * tanX2 - sinRot * tanY2);
    const cp2Y = endY - k * (sinRot * tanX2 + cosRot * tanY2);
    path.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
    currentAngle = segEnd;
  }
}
function arcCubicBezierFromPath(path, x, y, radius, startAngle, endAngle, counterclockwise = false) {
  const { startAngle: startNorm, endAngle: endNorm } = normalizeAngles(startAngle, endAngle, counterclockwise);
  const delta = endNorm - startNorm;
  const segments = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)));
  const segAngle = delta / segments;
  let currentAngle = startNorm;
  for (let i = 0; i < segments; i++) {
    const segStart = currentAngle;
    const segEnd = currentAngle + segAngle;
    const startX = x + radius * Math.cos(segStart);
    const startY = y + radius * Math.sin(segStart);
    if (i === 0) {
      if (path.isEmpty) {
        path.moveTo(startX, startY);
      } else {
        path.lineTo(startX, startY);
      }
    }
    const theta = segAngle;
    const k = 4 / 3 * Math.tan(theta / 4);
    const cp1X = startX - k * radius * Math.sin(segStart);
    const cp1Y = startY + k * radius * Math.cos(segStart);
    const endX = x + radius * Math.cos(segEnd);
    const endY = y + radius * Math.sin(segEnd);
    const cp2X = endX + k * radius * Math.sin(segEnd);
    const cp2Y = endY - k * radius * Math.cos(segEnd);
    path.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
    currentAngle = segEnd;
  }
}
function ellipseSvgArcFromPath(path, x1, y1, rx, ry, rotation, largeArcFlag, sweepFlag, x2, y2) {
  if (Math.abs(x1 - x2) < 1e-10 && Math.abs(y1 - y2) < 1e-10) return;
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  if (rx < 1e-10 || ry < 1e-10) {
    path.lineTo(x2, y2);
    return;
  }
  const { cx, cy, rx: rx2, ry: ry2, startAngle, sweepAngle } = endpointToCenter({
    x1,
    y1,
    x2,
    y2,
    rx,
    ry,
    xAxisRotation: rotation,
    largeArcFlag,
    sweepFlag
  });
  path.ellipse(cx, cy, rx2, ry2, rotation, startAngle, startAngle + sweepAngle, !sweepFlag);
}
function angleBetween(ux, uy, vx, vy) {
  const dot = ux * vx + uy * vy;
  const cross = ux * vy - uy * vx;
  return Math.atan2(cross, dot);
}
const buildArc = (out, cx, cy, r, start, end, ccw = false, tolerance = 0.5) => {
  const { startAngle, endAngle } = normalizeAngles(start, end, ccw);
  const delta = endAngle - startAngle;
  if (Math.abs(delta) <= 1e-6) {
    return;
  }
  let segmentCount = Math.max(6, Math.floor(6 * Math.pow(r, 1 / 3) * (Math.abs(delta) / Math.PI)));
  let segmentAngle = delta / segmentCount;
  let angle = startAngle;
  for (let i = 0; i <= segmentCount; i++) {
    let x = cx + r * Math.cos(angle);
    let y = cy + r * Math.sin(angle);
    out.push({ x, y });
    angle += segmentAngle;
  }
};
function buildRound(out, cx, cy, sx, sy, ex, ey, clockwise) {
  const cx2p0x = sx - cx;
  const cy2p0y = sy - cy;
  let angle0 = Math.atan2(cx2p0x, cy2p0y);
  let angle1 = Math.atan2(ex - cx, ey - cy);
  if (clockwise && angle0 < angle1) {
    angle0 += Math.PI * 2;
  } else if (!clockwise && angle0 > angle1) {
    angle1 += Math.PI * 2;
  }
  let startAngle = angle0;
  const angleDiff = angle1 - angle0;
  const absAngleDiff = Math.abs(angleDiff);
  const radius = Math.sqrt(cx2p0x * cx2p0x + cy2p0y * cy2p0y);
  const segCount = (15 * absAngleDiff * Math.sqrt(radius) / Math.PI >> 0) + 1;
  const angleInc = angleDiff / segCount;
  startAngle += angleInc;
  if (clockwise) {
    out.push({ x: cx, y: cy });
    out.push({ x: sx, y: sy });
    for (let i = 1, angle = startAngle; i < segCount; i++, angle += angleInc) {
      out.push({ x: cx, y: cy });
      out.push({
        x: cx + Math.sin(angle) * radius,
        y: cy + Math.cos(angle) * radius
      });
    }
    out.push({ x: cx, y: cy });
    out.push({ x: ex, y: ey });
  } else {
    out.push({ x: sx, y: sy });
    out.push({ x: cx, y: cy });
    for (let i = 1, angle = startAngle; i < segCount; i++, angle += angleInc) {
      out.push({
        x: cx + Math.sin(angle) * radius,
        y: cy + Math.cos(angle) * radius
      });
      out.push({ x: cx, y: cy });
    }
    out.push({ x: ex, y: ey });
    out.push({ x: cx, y: cy });
  }
  return segCount * 2;
}
export {
  appendUnitArcCubics,
  arcCubicBezierFromPath,
  arcToOval,
  buildArc,
  buildRound,
  centerToEndpoint,
  ellipseCubicBezierFromPath,
  ellipseMatrix,
  ellipseSvgArcFromPath,
  ellipseToCubicBezier,
  ellipseToQuadraticBezier,
  ellipticalArcToCubicBezier,
  endpointToCenter,
  normalizeAngles,
  pointOnEllipse,
  quarterArcToCubicBezier
};
