import { BoundingRect } from "../BoundingRect.js";
import { Vector2 } from "../Vector2.js";
import { Geometry, distPointToSegmentSquared } from "./Geometry.js";
import { buildArc } from "../Arc.js";
const isPointInPolygon = (points, x, y, fillRule = "nonzero") => {
  let winding = 0;
  let len = points.length;
  for (let k = 0; k < len; k++) {
    const p0 = points[k];
    const p1 = points[(k + 1) % len];
    if (p0.y > y !== p1.y > y && x <= p0.x + (p1.x - p0.x) * (y - p0.y) / (p1.y - p0.y)) {
      if (p0.y < p1.y) {
        winding++;
      } else {
        winding--;
      }
    }
  }
  return fillRule === "evenodd" ? winding % 2 !== 0 : winding !== 0;
};
const handleInnerJoin = (inner, pivot, afterNormal) => {
  inner.push({
    x: pivot.x,
    y: pivot.y
  });
  inner.push({
    x: pivot.x - afterNormal.x,
    y: pivot.y - afterNormal.y
  });
};
const processJoinRound = (outer, inner, prevUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit) => {
  const sinh = prevUnitNormal.cross(afterUnitNormal);
  const clockwise = sinh > 0;
  if (Math.abs(sinh) <= 0.01) {
    return;
  }
  const prevNormal = Vector2.from(prevUnitNormal).multiplyScalar(radius);
  const afterNormal = Vector2.from(afterUnitNormal).multiplyScalar(radius);
  if (!clockwise) {
    let tmp = outer;
    outer = inner;
    inner = tmp;
    prevNormal.negate();
    afterNormal.negate();
  }
  const startAngle = Math.atan2(prevNormal.y, prevNormal.x);
  const endAngle = Math.atan2(afterNormal.y, afterNormal.x);
  buildArc(outer, pivot.x, pivot.y, radius, startAngle, endAngle, !clockwise);
  handleInnerJoin(inner, pivot, afterNormal);
};
const processJoinMiter = (outer, inner, prevUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit) => {
  const cosh = prevUnitNormal.dot(afterUnitNormal);
  const sinh = prevUnitNormal.cross(afterUnitNormal);
  const clockwise = sinh > 0;
  if (Math.abs(sinh) <= 0.01) {
    return;
  }
  const halfCos = Math.sqrt((1 + cosh) / 2);
  const afterNormal = Vector2.from(afterUnitNormal).multiplyScalar(radius);
  if (halfCos < invMiterLimit) {
    processJoinBevel(outer, inner, prevUnitNormal, pivot, afterUnitNormal, radius);
    return;
  }
  const mid = Vector2.from(prevUnitNormal).add(afterUnitNormal).normalize().multiplyScalar(radius / halfCos);
  if (!clockwise) {
    let tmp = outer;
    outer = inner;
    inner = tmp;
    mid.negate();
    afterNormal.negate();
  }
  outer[outer.length - 1] = {
    x: pivot.x + mid.x,
    y: pivot.y + mid.y
  };
  handleInnerJoin(inner, pivot, afterNormal);
};
const processJoinBevel = (outer, inner, prevUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit) => {
  const sinh = prevUnitNormal.cross(afterUnitNormal);
  if (Math.abs(sinh) <= 0.01) {
    return;
  }
  const clockwise = sinh > 0;
  const afterNormal = Vector2.from(afterUnitNormal).multiplyScalar(radius);
  if (!clockwise) {
    let tmp = outer;
    outer = inner;
    inner = tmp;
    afterNormal.negate();
  }
  outer.push({
    x: pivot.x + afterNormal.x,
    y: pivot.y + afterNormal.y
  });
  handleInnerJoin(inner, pivot, afterNormal);
};
const processCapButt = (outer, inner, normal2, pivot, stop) => {
  outer.push({
    x: stop.x,
    y: stop.y
  });
};
const processCapSquare = (outer, inner, normal2, pivot, stop) => {
  const parallelNormal = Vector2.create(normal2.x, normal2.y).rotateCW();
  outer[outer.length - 1] = {
    x: pivot.x + parallelNormal.x + normal2.x,
    y: pivot.y + parallelNormal.y + normal2.y
  };
  outer.push({
    x: pivot.x + parallelNormal.x - normal2.x,
    y: pivot.y + parallelNormal.y - normal2.y
  });
};
const processCapRound = (outer, inner, normal2, pivot, stop, radius) => {
  const v0 = Vector2.from(normal2);
  const v1 = Vector2.from(normal2).negate();
  const startAngle = Math.atan2(v0.y, v0.x);
  const endAngle = Math.atan2(v1.y, v1.x);
  buildArc(outer, pivot.x, pivot.y, radius, startAngle, endAngle, false);
};
const joinFactor = {
  round: processJoinRound,
  miter: processJoinMiter,
  bevel: processJoinBevel
};
const capFactor = {
  round: processCapRound,
  butt: processCapButt,
  square: processCapSquare
};
function isPolygonClockwise(points) {
  let area = 0;
  for (let i = 0, len = points.length; i < len; i++) {
    area += Vector2.cross(points[i], points[(i + 1) % len]);
  }
  return area > 0;
}
function polygonOffset(points, width) {
  let absWidth = Math.abs(width);
  let newPoints = [];
  let firstUnitNormal = Vector2.create();
  let prevUnitNormal = Vector2.create();
  let unitNormal = Vector2.create();
  let prev = Vector2.create();
  let cur = Vector2.create();
  let normal2 = Vector2.create();
  const _isPolygonClockwise = isPolygonClockwise(points);
  const closed = Vector2.equalsEpsilon(points[0], points[points.length - 1], 1e-6);
  for (let i = 0, len = points.length; i < len; i++) {
    cur.copy(points[i]);
    if (i > 0) {
      if (width > 0) {
        unitNormal.copy(cur).subtract(prev).normalize().rotateCCW();
      } else {
        unitNormal.copy(cur).subtract(prev).normalize().rotateCW();
      }
      normal2.copy(unitNormal).multiplyScalar(absWidth);
      if (!_isPolygonClockwise) {
        normal2.negate();
      }
      if (i === 1) {
        if (!closed) {
          newPoints.push({
            x: prev.x + normal2.x,
            y: prev.y + normal2.y
          });
        }
        firstUnitNormal.copy(unitNormal);
      } else {
        const cosh = prevUnitNormal.dot(unitNormal);
        const sinh = prevUnitNormal.cross(unitNormal);
        if (Math.abs(sinh) > 0.01) {
          const halfCos = Math.sqrt((1 + cosh) / 2);
          const mid = Vector2.from(prevUnitNormal).add(unitNormal).normalize().multiplyScalar(absWidth / halfCos);
          if (!_isPolygonClockwise) {
            mid.negate();
          }
          newPoints[newPoints.length - 1] = {
            x: prev.x + mid.x,
            y: prev.y + mid.y
          };
        }
      }
      newPoints.push({
        x: cur.x + normal2.x,
        y: cur.y + normal2.y
      });
      if (i === len - 1) {
        if (closed) {
          const cosh = unitNormal.dot(firstUnitNormal);
          const sinh = unitNormal.cross(firstUnitNormal);
          if (Math.abs(sinh) > 0.01) {
            const halfCos = Math.sqrt((1 + cosh) / 2);
            const mid = Vector2.from(unitNormal).add(firstUnitNormal).normalize().multiplyScalar(absWidth / halfCos);
            if (!_isPolygonClockwise) {
              mid.negate();
            }
            newPoints[newPoints.length - 1] = {
              x: cur.x + mid.x,
              y: cur.y + mid.y
            };
          }
          newPoints.push({
            x: newPoints[0].x,
            y: newPoints[0].y
          });
        }
      }
      prevUnitNormal.copy(unitNormal);
    }
    prev.copy(cur);
  }
  return newPoints;
}
function buildStrokePoints(points, options) {
  let { miterLimit = 10, width = 1, cap = "butt", join = "miter", align = "center" } = options;
  const halfWidth = width / 2;
  const invMiterLimit = 1 / miterLimit;
  let newPoints = [];
  let lastPoint = points[0];
  for (let i = 1; i < points.length; i++) {
    if (!Vector2.equalsEpsilon(points[i], lastPoint, 1e-6)) {
      newPoints.push(points[i]);
      lastPoint = points[i];
    }
  }
  newPoints.unshift(points[0]);
  if (newPoints.length < 2) {
    return [];
  }
  if (align === "outside") {
    newPoints = polygonOffset(newPoints, halfWidth);
  } else if (align === "inside") {
    newPoints = polygonOffset(newPoints, -halfWidth);
  }
  const closed = Vector2.equalsEpsilon(newPoints[0], newPoints[points.length - 1], 1e-6);
  let newLength = newPoints.length;
  let innerPoints = [];
  let outerPoints = [];
  let first = Vector2.pool.get();
  let prev = Vector2.pool.get();
  let cur = Vector2.pool.get();
  let firstOffsetPoint = Vector2.pool.get();
  let firstNormal = Vector2.pool.get();
  let firstUnitNormal = Vector2.pool.get();
  let prevNormal = Vector2.pool.get();
  let prevUnitNormal = Vector2.pool.get();
  let normal2 = Vector2.pool.get();
  let unitNormal = Vector2.pool.get();
  const joinProc = joinFactor[join];
  const capProc = capFactor[cap];
  for (let i = 0; i < newLength; i++) {
    cur.copy(newPoints[i]);
    if (i > 0) {
      unitNormal.copy(cur).subtract(prev).normalize().rotateCCW();
      normal2.copy(unitNormal).multiplyScalar(halfWidth);
      if (i === 1) {
        firstNormal.copy(normal2);
        first.copy(prev);
        firstUnitNormal.copy(unitNormal);
        firstOffsetPoint.set(first.x + normal2.x, first.y + normal2.y);
        outerPoints.push({
          x: firstOffsetPoint.x,
          y: firstOffsetPoint.y
        });
        innerPoints.push({
          x: first.x - normal2.x,
          y: first.y - normal2.y
        });
      } else {
        joinProc(outerPoints, innerPoints, prevUnitNormal, prev, unitNormal, halfWidth, invMiterLimit);
      }
      outerPoints.push({
        x: cur.x + normal2.x,
        y: cur.y + normal2.y
      });
      innerPoints.push({
        x: cur.x - normal2.x,
        y: cur.y - normal2.y
      });
      if (i === newLength - 1) {
        if (closed) {
          joinProc(outerPoints, innerPoints, unitNormal, cur, firstUnitNormal, halfWidth, invMiterLimit);
          outerPoints.push({
            x: firstOffsetPoint.x,
            y: firstOffsetPoint.y
          });
          let lastX = innerPoints[innerPoints.length - 1].x;
          let lastY = innerPoints[innerPoints.length - 1].y;
          innerPoints.push({
            x: lastX,
            y: lastY
          });
          outerPoints = outerPoints.concat(innerPoints.reverse().slice(1));
          outerPoints.push({
            x: lastX,
            y: lastY
          });
        } else {
          capProc(outerPoints, innerPoints, normal2, cur, innerPoints[innerPoints.length - 1], halfWidth);
          outerPoints = outerPoints.concat(innerPoints.slice().reverse().slice(1));
          capProc(outerPoints, innerPoints, Vector2.create(-firstNormal.x, -firstNormal.y), first, firstOffsetPoint, halfWidth);
          if (!Vector2.equals(outerPoints[outerPoints.length - 1], firstOffsetPoint)) {
            outerPoints.push({
              x: firstOffsetPoint.x,
              y: firstOffsetPoint.y
            });
          }
        }
      }
      prevNormal.copy(normal2);
      prevUnitNormal.copy(unitNormal);
    }
    prev.copy(cur);
  }
  Vector2.pool.releaseAll();
  return outerPoints;
}
class Polygon extends Geometry {
  /** 扁平顶点数据 [x0,y0,x1,y1,...] */
  points;
  closed = false;
  constructor(points = []) {
    super();
    this.points = points;
  }
  /** 顶点数 */
  get vertexCount() {
    return this.points.length >> 1;
  }
  /** 从点对象数组构造 */
  static fromPoints(pts) {
    const flat = new Array(pts.length * 2);
    for (let i = 0; i < pts.length; i++) {
      flat[i * 2] = pts[i].x;
      flat[i * 2 + 1] = pts[i].y;
    }
    return new Polygon(flat);
  }
  /**
   * 面积（带符号面积取绝对值）
   * Shoelace 公式：A = 0.5 * Σ (x_i * y_{i+1} - x_{i+1} * y_i)
   */
  signedArea() {
    const p = this.points;
    const n = p.length;
    if (n < 6) return 0;
    let sum = 0;
    for (let i = 0; i < n; i += 2) {
      const x0 = p[i];
      const y0 = p[i + 1];
      const x1 = p[(i + 2) % n];
      const y1 = p[(i + 3) % n];
      sum += x0 * y1 - x1 * y0;
    }
    return sum * 0.5;
  }
  area() {
    return Math.abs(this.signedArea());
  }
  /**
   * 重心（面积加权形心）
   * Cx = (1/6A) Σ (x_i + x_{i+1})(x_i y_{i+1} - x_{i+1} y_i)
   * Cy = (1/6A) Σ (y_i + y_{i+1})(x_i y_{i+1} - x_{i+1} y_i)
   */
  centroid(out) {
    const r = out || { x: 0, y: 0 };
    const p = this.points;
    const n = p.length;
    if (n < 6) {
      if (n === 2) {
        r.x = p[0];
        r.y = p[1];
        return r;
      }
      if (n === 4) {
        r.x = (p[0] + p[2]) * 0.5;
        r.y = (p[1] + p[3]) * 0.5;
        return r;
      }
      r.x = 0;
      r.y = 0;
      return r;
    }
    let sumA = 0;
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < n; i += 2) {
      const x0 = p[i];
      const y0 = p[i + 1];
      const x1 = p[(i + 2) % n];
      const y1 = p[(i + 3) % n];
      const cross = x0 * y1 - x1 * y0;
      sumA += cross;
      cx += (x0 + x1) * cross;
      cy += (y0 + y1) * cross;
    }
    const a6 = sumA * 3;
    if (Math.abs(a6) > 1e-12) {
      r.x = cx / a6;
      r.y = cy / a6;
    } else {
      let sx = 0, sy = 0;
      const cnt = n >> 1;
      for (let i = 0; i < n; i += 2) {
        sx += p[i];
        sy += p[i + 1];
      }
      r.x = sx / cnt;
      r.y = sy / cnt;
    }
    return r;
  }
  center(out) {
    const r = out || { x: 0, y: 0 };
    const b = this.bounds();
    r.x = b.centerX;
    r.y = b.centerY;
    return r;
  }
  perimeter() {
    const p = this.points;
    const n = p.length;
    if (n < 4) return 0;
    let sum = 0;
    for (let i = 0; i < n; i += 2) {
      const x0 = p[i];
      const y0 = p[i + 1];
      const x1 = p[(i + 2) % n];
      const y1 = p[(i + 3) % n];
      const dx = x1 - x0;
      const dy = y1 - y0;
      sum += Math.sqrt(dx * dx + dy * dy);
    }
    return sum;
  }
  /**
   * 射线投射法（even-odd 规则）
   * 性能：O(n)，无内存分配
   */
  contains(x, y) {
    const p = this.points;
    const n = p.length;
    if (n < 6) return false;
    let inside = false;
    for (let i = 0, j = n - 2; i < n; j = i, i += 2) {
      const xi = p[i], yi = p[i + 1];
      const xj = p[j], yj = p[j + 1];
      const intersects = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (intersects) inside = !inside;
    }
    return inside;
  }
  signedDistance(x, y) {
    const p = this.points;
    const n = p.length;
    if (n < 4) return Infinity;
    let minD2 = Infinity;
    for (let i = 0, j = n - 2; i < n; j = i, i += 2) {
      const d2 = distPointToSegmentSquared(
        x,
        y,
        p[j],
        p[j + 1],
        p[i],
        p[i + 1]
      );
      if (d2 < minD2) minD2 = d2;
    }
    const dist = Math.sqrt(minD2);
    return this.contains(x, y) ? dist : -dist;
  }
  getPoints(out) {
    const r = out || [];
    r.length = 0;
    const p = this.points;
    for (let i = 0; i < p.length; i += 2) {
      r.push({ x: p[i], y: p[i + 1] });
    }
    return r;
  }
  bounds(out) {
    const r = out || new BoundingRect();
    const p = this.points;
    const n = p.length;
    if (n === 0) {
      r.setEmpty();
      return r;
    }
    let minX = p[0], minY = p[1];
    let maxX = p[0], maxY = p[1];
    for (let i = 2; i < n; i += 2) {
      const x = p[i];
      const y = p[i + 1];
      if (x < minX) minX = x;
      else if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      else if (y > maxY) maxY = y;
    }
    r.min.set(minX, minY);
    r.max.set(maxX, maxY);
    return r;
  }
}
export {
  Polygon,
  buildStrokePoints,
  isPointInPolygon,
  isPolygonClockwise,
  polygonOffset
};
