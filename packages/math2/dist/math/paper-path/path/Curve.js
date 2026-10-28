import { Point } from "../basic/Point.js";
import { Line } from "../basic/Line.js";
import { Numerical } from "../util/Numerical.js";
import { findCurveBoundsCollisions } from "../util/CollisionDetection.js";
import { Segment } from "./Segment.js";
import { CurveLocation } from "./CurveLocation.js";
const CURVETIME_EPSILON = Numerical.CURVETIME_EPSILON;
function getLengthIntegrand(v) {
  const c = getCoefficients(v), ax = 3 * c[0], bx = 2 * c[1], cx = c[2], ay = 3 * c[3], by = 2 * c[4], cy = c[5];
  return function(t) {
    const dx = (ax * t + bx) * t + cx, dy = (ay * t + by) * t + cy;
    return Math.sqrt(dx * dx + dy * dy);
  };
}
function getIterations(a, b) {
  return Math.max(2, Math.min(16, Math.ceil(Math.abs(b - a) * 32)));
}
function getCoefficients(v) {
  const x0 = v[0], y0 = v[1], x3 = v[6], y3 = v[7], isZero = Numerical.isZero;
  let x1 = v[2], y1 = v[3], x2 = v[4], y2 = v[5];
  if (isZero(x1 - x0) && isZero(y1 - y0)) {
    x1 = x0;
    y1 = y0;
  }
  if (isZero(x2 - x3) && isZero(y2 - y3)) {
    x2 = x3;
    y2 = y3;
  }
  const cx = 3 * (x1 - x0), bx = 3 * (x2 - x1) - cx, ax = x3 - x0 - cx - bx, cy = 3 * (y1 - y0), by = 3 * (y2 - y1) - cy, ay = y3 - y0 - cy - by;
  return [ax, bx, cx, ay, by, cy, x1, y1, x2, y2];
}
function getCoordinate(v0, v3, a, b, c, t) {
  return t === 0 ? v0 : t === 1 ? v3 : ((a * t + b) * t + c) * t + v0;
}
function evaluate(v, t, type, normalized) {
  if (t == null || t < 0 || t > 1)
    return null;
  const x0 = v[0], y0 = v[1], x3 = v[6], y3 = v[7], c = getCoefficients(v), ax = c[0], bx = c[1], cx = c[2], ay = c[3], by = c[4], cy = c[5], x1 = c[6], y1 = c[7], x2 = c[8], y2 = c[9];
  let x, y;
  if (type === 0) {
    x = getCoordinate(x0, x3, ax, bx, cx, t);
    y = getCoordinate(y0, y3, ay, by, cy, t);
  } else {
    const tMin = CURVETIME_EPSILON, tMax = 1 - tMin;
    if (t < tMin) {
      x = cx;
      y = cy;
    } else if (t > tMax) {
      x = 3 * (x3 - x2);
      y = 3 * (y3 - y2);
    } else {
      x = (3 * ax * t + 2 * bx) * t + cx;
      y = (3 * ay * t + 2 * by) * t + cy;
    }
    if (normalized) {
      if (x === 0 && y === 0 && (t < tMin || t > tMax)) {
        x = x2 - x1;
        y = y2 - y1;
      }
      const len = Math.sqrt(x * x + y * y);
      if (len) {
        x /= len;
        y /= len;
      }
    }
    if (type === 3) {
      const x2d = 6 * ax * t + 2 * bx, y2d = 6 * ay * t + 2 * by, d = Math.pow(x * x + y * y, 3 / 2);
      x = d !== 0 ? (x * y2d - y * x2d) / d : 0;
      y = 0;
    }
  }
  return type === 2 ? new Point(y, -x) : new Point(x, y);
}
function curveFromValues(v) {
  const x1 = v[0], y1 = v[1], x2 = v[6], y2 = v[7];
  return new Curve(
    new Segment(
      new Point(x1, y1),
      void 0,
      new Point(v[2] - x1, v[3] - y1)
    ),
    new Segment(
      new Point(x2, y2),
      new Point(v[4] - x2, v[5] - y2),
      void 0
    )
  );
}
function isStraightTest(x1, y1, h1x, h1y, h2x, h2y, x2, y2) {
  const isZero = Numerical.isZero;
  if (isZero(h1x) && isZero(h1y) && isZero(h2x) && isZero(h2y)) {
    return true;
  } else {
    const isCollinear = Point.isCollinear, vx = x2 - x1, vy = y2 - y1;
    if (isZero(vx) && isZero(vy)) {
      return false;
    } else if (isCollinear(vx, vy, h1x, h1y) && isCollinear(vx, vy, h2x, h2y)) {
      const getDistance = Line.getDistance, epsilon = Numerical.GEOMETRIC_EPSILON;
      if (getDistance(x1, y1, vx, vy, x1 + h1x, y1 + h1y, true) < epsilon && getDistance(x1, y1, vx, vy, x2 + h2x, y2 + h2y, true) < epsilon) {
        const div = vx * vx + vy * vy, s1 = (vx * h1x + vy * h1y) / div, s2 = (vx * h2x + vy * h2y) / div;
        return s1 >= 0 && s1 <= 1 && s2 <= 0 && s2 >= -1;
      }
    }
  }
  return false;
}
function isLinearTest(x1, y1, h1x, h1y, h2x, h2y, x2, y2) {
  const x = (x2 - x1) / 3, y = (y2 - y1) / 3;
  return h1x === x && h1y === y && -h2x === x && -h2y === y;
}
function addLocation(locations, include, c1, t1, c2, t2, overlap) {
  const excludeStart = !overlap && c1.previous === c2, excludeEnd = !overlap && c1 !== c2 && c1.next === c2, tMin = CURVETIME_EPSILON, tMax = 1 - tMin;
  if (t1 !== null && t1 >= (excludeStart ? tMin : 0) && t1 <= (excludeEnd ? tMax : 1)) {
    if (t2 !== null && t2 >= (excludeEnd ? tMin : 0) && t2 <= (excludeStart ? tMax : 1)) {
      const loc1 = new CurveLocation(c1, t1, void 0, overlap), loc2 = new CurveLocation(c2, t2, void 0, overlap);
      loc1._intersection = loc2;
      loc2._intersection = loc1;
      if (!include || include(loc1))
        CurveLocation.insert(locations, loc1, true);
    }
  }
}
function addCurveIntersections(v1, v2, c1, c2, locations, include, flip, recursion, calls, tMin, tMax, uMin, uMax, tolerance) {
  if (++calls >= 4096 || ++recursion >= 40)
    return calls;
  const fatLineEpsilon = 1e-9, q0x = v2[0], q0y = v2[1], q3x = v2[6], q3y = v2[7], getSignedDistance = Line.getSignedDistance, d1 = getSignedDistance(q0x, q0y, q3x, q3y, v2[2], v2[3]), d2 = getSignedDistance(q0x, q0y, q3x, q3y, v2[4], v2[5]), factor = d1 * d2 > 0 ? 3 / 4 : 4 / 9, dMin = factor * Math.min(0, d1, d2), dMax = factor * Math.max(0, d1, d2), dp0 = getSignedDistance(q0x, q0y, q3x, q3y, v1[0], v1[1]), dp1 = getSignedDistance(q0x, q0y, q3x, q3y, v1[2], v1[3]), dp2 = getSignedDistance(q0x, q0y, q3x, q3y, v1[4], v1[5]), dp3 = getSignedDistance(q0x, q0y, q3x, q3y, v1[6], v1[7]), hull = getConvexHull(dp0, dp1, dp2, dp3), top = hull[0], bottom = hull[1];
  let tMinClip, tMaxClip;
  if (d1 === 0 && d2 === 0 && dp0 === 0 && dp1 === 0 && dp2 === 0 && dp3 === 0 || (tMinClip = clipConvexHull(top, bottom, dMin, dMax)) == null || (tMaxClip = clipConvexHull(
    top.reverse(),
    bottom.reverse(),
    dMin,
    dMax
  )) == null)
    return calls;
  let tMinNew = tMin + (tMax - tMin) * tMinClip, tMaxNew = tMin + (tMax - tMin) * tMaxClip;
  if (Math.max(uMax - uMin, tMaxNew - tMinNew) < fatLineEpsilon) {
    const t = (tMinNew + tMaxNew) / 2, u = (uMin + uMax) / 2;
    addLocation(
      locations,
      include,
      flip ? c2 : c1,
      flip ? u : t,
      flip ? c1 : c2,
      flip ? t : u
    );
  } else {
    v1 = Curve.getPart(v1, tMinClip, tMaxClip);
    const uDiff = uMax - uMin;
    if (tMaxClip - tMinClip > 0.8) {
      const isNext = tolerance && tMaxNew === 1 && uMin === 0 && c1.next === c2, isPrevious = tolerance && !isNext && tMinNew === 0 && uMax === 1 && c1.previous === c2;
      if (isNext || isPrevious) {
        const offset = isNext ? tolerance : -tolerance, s1 = Curve.getTimeAt(v1, -offset), s2 = Curve.getTimeAt(v2, offset);
        if (s1 !== null && s2 !== null) {
          const t = tMinNew + (tMaxNew - tMinNew) * s1, u = uMin + (uMax - uMin) * s2;
          if (isNext) {
            v1 = Curve.getPart(v1, 0, s1);
            v2 = Curve.getPart(v2, s2, 1);
            tMaxNew = t;
            uMin = u;
          } else {
            v1 = Curve.getPart(v1, s1, 1);
            v2 = Curve.getPart(v2, 0, s2);
            tMinNew = t;
            uMax = u;
          }
          calls = addCurveIntersections(
            v1,
            v2,
            c1,
            c2,
            locations,
            include,
            flip,
            recursion,
            calls,
            tMinNew,
            tMaxNew,
            uMin,
            uMax,
            tolerance
          );
        }
      } else if (!(tolerance && addImplicitIntersections(
        v1,
        v2,
        c1,
        c2,
        locations,
        include,
        flip,
        tMinNew,
        tMaxNew,
        uMin,
        uMax,
        tolerance
      ))) {
        if (tMaxNew - tMinNew > uDiff) {
          const parts = Curve.subdivide(v1, 0.5), t = (tMinNew + tMaxNew) / 2;
          calls = addCurveIntersections(
            v2,
            parts[0],
            c2,
            c1,
            locations,
            include,
            !flip,
            recursion,
            calls,
            uMin,
            uMax,
            tMinNew,
            t,
            tolerance
          );
          calls = addCurveIntersections(
            v2,
            parts[1],
            c2,
            c1,
            locations,
            include,
            !flip,
            recursion,
            calls,
            uMin,
            uMax,
            t,
            tMaxNew,
            tolerance
          );
        } else {
          const parts = Curve.subdivide(v2, 0.5), u = (uMin + uMax) / 2;
          calls = addCurveIntersections(
            parts[0],
            v1,
            c2,
            c1,
            locations,
            include,
            !flip,
            recursion,
            calls,
            uMin,
            u,
            tMinNew,
            tMaxNew,
            tolerance
          );
          calls = addCurveIntersections(
            parts[1],
            v1,
            c2,
            c1,
            locations,
            include,
            !flip,
            recursion,
            calls,
            u,
            uMax,
            tMinNew,
            tMaxNew,
            tolerance
          );
        }
      }
    } else {
      if (uDiff === 0 || uDiff >= fatLineEpsilon) {
        calls = addCurveIntersections(
          v2,
          v1,
          c2,
          c1,
          locations,
          include,
          !flip,
          recursion,
          calls,
          uMin,
          uMax,
          tMinNew,
          tMaxNew,
          tolerance
        );
      } else {
        calls = addCurveIntersections(
          v1,
          v2,
          c1,
          c2,
          locations,
          include,
          flip,
          recursion,
          calls,
          tMinNew,
          tMaxNew,
          uMin,
          uMax,
          tolerance
        );
      }
    }
  }
  return calls;
}
function addImplicitIntersections(v1, v2, c1, c2, locations, include, flip, tMin, tMax, uMin, uMax, tolerance) {
  const x0 = v2[0], y0 = v2[1];
  let size = 0;
  for (let i = 0; i < 8; i += 2) {
    size = Math.max(
      size,
      Math.abs(v1[i] - x0),
      Math.abs(v1[i + 1] - y0),
      Math.abs(v2[i] - x0),
      Math.abs(v2[i + 1] - y0)
    );
  }
  if (size) {
    const p = getLocalPoints(v1, x0, y0, size), q = getLocalPoints(v2, x0, y0, size), dx = v2[6] - 3 * (v2[4] - v2[2]) - x0, dy = v2[7] - 3 * (v2[5] - v2[3]) - y0, isQuadratic = 4 / 27 * Math.sqrt(dx * dx + dy * dy) <= tolerance, polynomial = isQuadratic ? getQuadraticImplicit(p, [q[0], getQuadraticHandle(q), q[3]]) : getCubicImplicit(p, q), roots = [];
    let speed = 0;
    for (let i = 0; i < 6; i += 2) {
      speed = Math.max(
        speed,
        3 * Math.sqrt(Math.pow(v1[i + 2] - v1[i], 2) + Math.pow(v1[i + 3] - v1[i + 1], 2))
      );
    }
    if (polynomial.coefficients.every(function(coefficient, i) {
      return Math.abs(coefficient) <= polynomial.errors[i];
    }))
      return false;
    const count = Numerical.solveBernstein(
      polynomial.coefficients,
      polynomial.errors,
      roots,
      speed ? tolerance / speed : 1
    );
    if (count >= polynomial.coefficients.length)
      return false;
    for (let i = 0; i < count; i++) {
      let t = roots[i];
      const u = Curve.getTimeOf(
        v2,
        Curve.getPoint(v1, t),
        tolerance
      );
      if (u !== null) {
        t = tMin + (tMax - tMin) * t;
        const uu = uMin + (uMax - uMin) * u;
        addLocation(
          locations,
          include,
          flip ? c2 : c1,
          flip ? uu : t,
          flip ? c1 : c2,
          flip ? t : uu
        );
      }
    }
    return true;
  }
  return false;
}
function getLocalPoints(v, x0, y0, size) {
  const u = Numerical.MACHINE_EPSILON, points = [];
  for (let i = 0; i < 8; i += 2) {
    const x = (v[i] - x0) / size, y = (v[i + 1] - y0) / size;
    points.push({
      x,
      y,
      ex: 2 * u * Math.abs(x),
      ey: 2 * u * Math.abs(y)
    });
  }
  return points;
}
function getProductError(a, ea, b, eb) {
  return Math.abs(a) * eb + Math.abs(b) * ea + ea * eb + Numerical.MACHINE_EPSILON * Math.abs(a * b);
}
function getLinearFactor(p, q, i, j, factor) {
  const u = Numerical.MACHINE_EPSILON, coefficients = [], errors = [];
  for (let k = 0; k < 4; k++) {
    const r = p[k], dx1 = q[i].x - r.x, dy1 = q[j].y - r.y, dx2 = q[j].x - r.x, dy2 = q[i].y - r.y, error1 = getProductError(
      dx1,
      q[i].ex + r.ex + u * Math.abs(dx1),
      dy1,
      q[j].ey + r.ey + u * Math.abs(dy1)
    ), error2 = getProductError(
      dx2,
      q[j].ex + r.ex + u * Math.abs(dx2),
      dy2,
      q[i].ey + r.ey + u * Math.abs(dy2)
    ), difference = dx1 * dy1 - dx2 * dy2, value = factor * difference;
    coefficients.push(value);
    errors.push(factor * (error1 + error2 + u * Math.abs(difference)) + u * Math.abs(value));
  }
  return { coefficients, errors };
}
const binomials = [[1]];
for (let i = 1; i <= 9; i++) {
  const row = [1];
  for (let j = 1; j < i; j++)
    row.push(binomials[i - 1][j - 1] + binomials[i - 1][j]);
  row.push(1);
  binomials.push(row);
}
function multiplyPoly(a, b) {
  const u = Numerical.MACHINE_EPSILON, m = a.coefficients.length - 1, n = b.coefficients.length - 1, coefficients = [], errors = [];
  for (let k = 0; k <= m + n; k++) {
    let sum = 0, error = 0;
    for (let i = Math.max(0, k - n), l = Math.min(m, k); i <= l; i++) {
      const factor = binomials[m][i] * binomials[n][k - i] / binomials[m + n][k], a1 = a.coefficients[i], b1 = b.coefficients[k - i], term = factor * (a1 * b1);
      sum += term;
      error += factor * getProductError(
        a1,
        a.errors[i],
        b1,
        b.errors[k - i]
      ) + u * (2 * Math.abs(term) + Math.abs(sum));
    }
    coefficients.push(sum);
    errors.push(error);
  }
  return { coefficients, errors };
}
function addPoly(a, b, sign) {
  const coefficients = [], errors = [];
  for (let i = 0, l = a.coefficients.length; i < l; i++) {
    const sum = a.coefficients[i] + sign * b.coefficients[i];
    coefficients.push(sum);
    errors.push(a.errors[i] + b.errors[i] + Numerical.MACHINE_EPSILON * Math.abs(sum));
  }
  return { coefficients, errors };
}
function getCubicImplicit(p, q) {
  const l32 = getLinearFactor(p, q, 3, 2, 1 * 3), l31 = getLinearFactor(p, q, 3, 1, 1 * 3), l30 = getLinearFactor(p, q, 3, 0, 1 * 1), l21 = getLinearFactor(p, q, 2, 1, 3 * 3), l20 = getLinearFactor(p, q, 2, 0, 3 * 1), l10 = getLinearFactor(p, q, 1, 0, 3 * 1), m = addPoly(l30, l21, 1);
  return addPoly(
    addPoly(
      multiplyPoly(l32, addPoly(
        multiplyPoly(m, l10),
        multiplyPoly(l20, l20),
        -1
      )),
      multiplyPoly(l31, addPoly(
        multiplyPoly(l31, l10),
        multiplyPoly(l20, l30),
        -1
      )),
      -1
    ),
    multiplyPoly(l30, addPoly(
      multiplyPoly(l31, l20),
      multiplyPoly(m, l30),
      -1
    )),
    1
  );
}
function getQuadraticHandle(q) {
  const u = Numerical.MACHINE_EPSILON, x = (3 * q[1].x - q[0].x) / 2, y = (3 * q[1].y - q[0].y) / 2;
  return {
    x,
    y,
    ex: (3 * q[1].ex + q[0].ex) / 2 + 2 * u * Math.abs(x),
    ey: (3 * q[1].ey + q[0].ey) / 2 + 2 * u * Math.abs(y)
  };
}
function getQuadraticImplicit(p, q) {
  const l21 = getLinearFactor(p, q, 2, 1, 1 * 2), l20 = getLinearFactor(p, q, 2, 0, 1 * 1), l10 = getLinearFactor(p, q, 1, 0, 2 * 1);
  return addPoly(multiplyPoly(l21, l10), multiplyPoly(l20, l20), -1);
}
function getConvexHull(dq0, dq1, dq2, dq3) {
  const p0 = [0, dq0], p1 = [1 / 3, dq1], p2 = [2 / 3, dq2], p3 = [1, dq3], dist1 = dq1 - (2 * dq0 + dq3) / 3, dist2 = dq2 - (dq0 + 2 * dq3) / 3;
  let hull;
  if (dist1 * dist2 < 0) {
    hull = [[p0, p1, p3], [p0, p2, p3]];
  } else {
    const distRatio = dist1 / dist2;
    hull = [
      // p2 在内侧，凸包为三角形。
      distRatio >= 2 ? [p0, p1, p3] : distRatio <= 0.5 ? [p0, p2, p3] : [p0, p1, p2, p3],
      // 线段 [p0, p3] 属于凸包。
      [p0, p3]
    ];
  }
  return (dist1 || dist2) < 0 ? hull.reverse() : hull;
}
function clipConvexHull(hullTop, hullBottom, dMin, dMax) {
  if (hullTop[0][1] < dMin) {
    return clipConvexHullPart(hullTop, true, dMin);
  } else if (hullBottom[0][1] > dMax) {
    return clipConvexHullPart(hullBottom, false, dMax);
  } else {
    return hullTop[0][0];
  }
}
function clipConvexHullPart(part, top, threshold) {
  let px = part[0][0], py = part[0][1];
  for (let i = 1, l = part.length; i < l; i++) {
    const qx = part[i][0], qy = part[i][1];
    if (top ? qy >= threshold : qy <= threshold) {
      return qy === threshold ? qx : px + (threshold - py) * (qx - px) / (qy - py);
    }
    px = qx;
    py = qy;
  }
  return null;
}
function getCurveLineIntersections(v, px, py, vx, vy) {
  const isZero = Numerical.isZero;
  if (isZero(vx) && isZero(vy)) {
    const t = Curve.getTimeOf(v, new Point(px, py));
    return t === null ? [] : [t];
  }
  const angle = Math.atan2(-vy, vx), sin = Math.sin(angle), cos = Math.cos(angle), rv = [], roots = [];
  for (let i = 0; i < 8; i += 2) {
    const x = v[i] - px, y = v[i + 1] - py;
    rv.push(
      x * cos - y * sin,
      x * sin + y * cos
    );
  }
  Curve.solveCubic(rv, 1, 0, roots, 0, 1);
  const epsilon = Numerical.GEOMETRIC_EPSILON;
  if (Math.abs(rv[1]) < epsilon)
    roots.push(0);
  if (Math.abs(rv[7]) < epsilon)
    roots.push(1);
  return roots;
}
function addCurveLineIntersections(v1, v2, c1, c2, locations, include, flip) {
  const x1 = v2[0], y1 = v2[1], x2 = v2[6], y2 = v2[7], roots = getCurveLineIntersections(v1, x1, y1, x2 - x1, y2 - y1);
  for (let i = 0, l = roots.length; i < l; i++) {
    const t1 = roots[i], p1 = Curve.getPoint(v1, t1), t2 = Curve.getTimeOf(v2, p1);
    if (t2 !== null) {
      addLocation(
        locations,
        include,
        flip ? c2 : c1,
        flip ? t2 : t1,
        flip ? c1 : c2,
        flip ? t1 : t2
      );
    }
  }
}
function addLineIntersection(v1, v2, c1, c2, locations, include) {
  const pt = Line.intersect(
    v1[0],
    v1[1],
    v1[6],
    v1[7],
    v2[0],
    v2[1],
    v2[6],
    v2[7]
  );
  if (pt) {
    addLocation(
      locations,
      include,
      c1,
      Curve.getTimeOf(v1, pt),
      c2,
      Curve.getTimeOf(v2, pt)
    );
  }
}
function getCurveIntersections(v1, v2, c1, c2, locations, include, tolerance) {
  const min = Math.min, max = Math.max, abs = Math.abs, minX1 = min(v1[0], v1[2], v1[4], v1[6]), maxX1 = max(v1[0], v1[2], v1[4], v1[6]), minY1 = min(v1[1], v1[3], v1[5], v1[7]), maxY1 = max(v1[1], v1[3], v1[5], v1[7]), minX2 = min(v2[0], v2[2], v2[4], v2[6]), maxX2 = max(v2[0], v2[2], v2[4], v2[6]), minY2 = min(v2[1], v2[3], v2[5], v2[7]), maxY2 = max(v2[1], v2[3], v2[5], v2[7]), epsilon = Numerical.getEpsilon(max(
    abs(minX1),
    abs(maxX1),
    abs(minY1),
    abs(maxY1),
    abs(minX2),
    abs(maxX2),
    abs(minY2),
    abs(maxY2)
  ));
  const boundsEpsilon = max(
    epsilon,
    tolerance || Numerical.GEOMETRIC_EPSILON
  );
  if (maxX1 + boundsEpsilon > minX2 && minX1 - boundsEpsilon < maxX2 && maxY1 + boundsEpsilon > minY2 && minY1 - boundsEpsilon < maxY2) {
    const overlaps = findOverlaps(v1, v2, tolerance);
    if (overlaps) {
      for (let i = 0; i < 2; i++) {
        const overlap = overlaps[i];
        addLocation(
          locations,
          include,
          c1,
          overlap[0],
          c2,
          overlap[1],
          true
        );
      }
    } else {
      const straight1 = Curve.isStraight(v1), straight2 = Curve.isStraight(v2), straight = straight1 && straight2, flip = straight1 && !straight2, before = locations.length;
      if (straight) {
        addLineIntersection(
          flip ? v2 : v1,
          flip ? v1 : v2,
          flip ? c2 : c1,
          flip ? c1 : c2,
          locations,
          include
        );
      } else if (straight1 || straight2) {
        addCurveLineIntersections(
          flip ? v2 : v1,
          flip ? v1 : v2,
          flip ? c2 : c1,
          flip ? c1 : c2,
          locations,
          include,
          flip
        );
      } else {
        addCurveIntersections(
          flip ? v2 : v1,
          flip ? v1 : v2,
          flip ? c2 : c1,
          flip ? c1 : c2,
          locations,
          include,
          flip,
          // recursion、calls、tMin、tMax、uMin、uMax
          0,
          0,
          0,
          1,
          0,
          1,
          tolerance
        );
      }
      if (!straight || locations.length === before) {
        const endEpsilon = tolerance || epsilon;
        for (let i = 0; i < 4; i++) {
          const isSecond = i >> 1, t = i & 1, v = isSecond ? v2 : v1, x = v[t * 6], y = v[t * 6 + 1];
          if (isSecond ? x >= minX1 - endEpsilon && x <= maxX1 + endEpsilon && y >= minY1 - endEpsilon && y <= maxY1 + endEpsilon : x >= minX2 - endEpsilon && x <= maxX2 + endEpsilon && y >= minY2 - endEpsilon && y <= maxY2 + endEpsilon) {
            const u = Curve.getTimeOf(
              isSecond ? v1 : v2,
              new Point(x, y),
              endEpsilon
            );
            if (u !== null) {
              addLocation(
                locations,
                include,
                c1,
                isSecond ? u : t,
                c2,
                isSecond ? t : u
              );
            }
          }
        }
      }
    }
  }
  return locations;
}
function getSelfIntersection(v1, c1, locations, include) {
  const info = Curve.classify(v1);
  if (info.type === "loop") {
    const roots = info.roots;
    addLocation(
      locations,
      include,
      c1,
      roots[0],
      c1,
      roots[1]
    );
  }
  return locations;
}
function findIntersections(curves1, curves2, include, matrix1, matrix2, _returnFirst, _tolerance, _collisions) {
  const self = !curves2;
  if (self)
    curves2 = curves1;
  const length1 = curves1.length, length2 = curves2.length, values1 = new Array(length1), values2 = self ? values1 : new Array(length2), locations = [];
  for (let i = 0; i < length1; i++) {
    values1[i] = curves1[i].getValues(matrix1);
  }
  if (!self) {
    for (let i = 0; i < length2; i++) {
      values2[i] = curves2[i].getValues(matrix2);
    }
  }
  const boundsCollisions = _collisions || findCurveBoundsCollisions(
    values1,
    values2,
    _tolerance || Numerical.GEOMETRIC_EPSILON
  );
  for (let index1 = 0; index1 < length1; index1++) {
    const curve1 = curves1[index1], v1 = values1[index1];
    if (self) {
      getSelfIntersection(v1, curve1, locations, include);
    }
    const collisions1 = boundsCollisions[index1];
    if (collisions1) {
      for (let j = 0; j < collisions1.length; j++) {
        if (_returnFirst && locations.length)
          return locations;
        const index2 = collisions1[j];
        if (!self || index2 > index1) {
          const curve2 = curves2[index2], v2 = values2[index2];
          getCurveIntersections(
            v1,
            v2,
            curve1,
            curve2,
            locations,
            include,
            _tolerance
          );
        }
      }
    }
  }
  return locations;
}
function findOverlaps(v1, v2, tolerance) {
  function getSquaredLineLength(v3) {
    const x = v3[6] - v3[0], y = v3[7] - v3[1];
    return x * x + y * y;
  }
  const abs = Math.abs, getDistance = Line.getDistance, timeEpsilon = CURVETIME_EPSILON, geomEpsilon = tolerance || Numerical.GEOMETRIC_EPSILON, flip = getSquaredLineLength(v1) < getSquaredLineLength(v2), l1 = flip ? v2 : v1, l2 = flip ? v1 : v2, px = l1[0], py = l1[1], vx = l1[6] - px, vy = l1[7] - py;
  let straight1 = Curve.isStraight(v1), straight2 = Curve.isStraight(v2), straightBoth = straight1 && straight2;
  if (getDistance(px, py, vx, vy, l2[0], l2[1], true) < geomEpsilon && getDistance(px, py, vx, vy, l2[6], l2[7], true) < geomEpsilon) {
    if (!straightBoth && getDistance(px, py, vx, vy, l1[2], l1[3], true) < geomEpsilon && getDistance(px, py, vx, vy, l1[4], l1[5], true) < geomEpsilon && getDistance(px, py, vx, vy, l2[2], l2[3], true) < geomEpsilon && getDistance(px, py, vx, vy, l2[4], l2[5], true) < geomEpsilon) {
      straight1 = straight2 = straightBoth = true;
    }
  } else if (straightBoth) {
    return null;
  }
  if (straight1 !== straight2) {
    return null;
  }
  const v = [v1, v2];
  let pairs = [];
  for (let i = 0; i < 4 && pairs.length < 2; i++) {
    const i1 = i & 1, i2 = i1 ^ 1, t1 = i >> 1, t2 = Curve.getTimeOf(v[i1], new Point(
      v[i2][t1 ? 6 : 0],
      v[i2][t1 ? 7 : 1]
    ), geomEpsilon);
    if (t2 != null) {
      const pair = i1 ? [t1, t2] : [t2, t1];
      const current = pairs;
      if (!current.length || abs(pair[0] - current[0][0]) > timeEpsilon && abs(pair[1] - current[0][1]) > timeEpsilon) {
        current.push(pair);
      }
    }
    if (i > 2 && !pairs.length)
      break;
  }
  if (pairs.length !== 2) {
    pairs = null;
  } else if (!straightBoth) {
    const found = pairs, o1 = Curve.getPart(v1, found[0][0], found[1][0]), o2 = Curve.getPart(v2, found[0][1], found[1][1]);
    if (abs(o2[2] - o1[2]) > geomEpsilon || abs(o2[3] - o1[3]) > geomEpsilon || abs(o2[4] - o1[4]) > geomEpsilon || abs(o2[5] - o1[5]) > geomEpsilon)
      pairs = null;
  }
  return pairs;
}
class Curve {
  _segment1;
  _segment2;
  _path;
  /** 缓存的长度，由 `_changed()` 清除。 */
  _length;
  constructor(segment1, segment2) {
    this._segment1 = segment1 || new Segment();
    this._segment2 = segment2 || new Segment();
  }
  _changed() {
    this._length = void 0;
  }
  /** 返回曲线的副本。 */
  clone() {
    return new Curve(this._segment1, this._segment2);
  }
  toString() {
    const parts = ["point1: " + this._segment1._point];
    if (!this._segment1._handleOut.isZero())
      parts.push("handle1: " + this._segment1._handleOut);
    if (!this._segment2._handleIn.isZero())
      parts.push("handle2: " + this._segment2._handleIn);
    parts.push("point2: " + this._segment2._point);
    return "{ " + parts.join(", ") + " }";
  }
  /** 从路径中移除该曲线，并合并相关线段的手柄。 */
  remove() {
    let removed = false;
    if (this._path) {
      const segment2 = this._segment2, handleOut = segment2._handleOut;
      removed = segment2.remove();
      if (removed)
        this._segment1._handleOut._set(handleOut.x, handleOut.y);
    }
    return removed;
  }
  // ---------------------------------------------------------------------
  // 点与手柄
  /** 曲线的第一个锚点。 */
  get point1() {
    return this._segment1._point;
  }
  set point1(point) {
    this._segment1._point._set(point.x, point.y);
  }
  /** 曲线的第二个锚点。 */
  get point2() {
    return this._segment2._point;
  }
  set point2(point) {
    this._segment2._point._set(point.x, point.y);
  }
  /** 描述第一个锚点处切线的手柄。 */
  get handle1() {
    return this._segment1._handleOut;
  }
  set handle1(handle) {
    this._segment1._handleOut._set(handle.x, handle.y);
  }
  /** 描述第二个锚点处切线的手柄。 */
  get handle2() {
    return this._segment2._handleIn;
  }
  set handle2(handle) {
    this._segment2._handleIn._set(handle.x, handle.y);
  }
  /** 曲线的第一个线段。 */
  get segment1() {
    return this._segment1;
  }
  /** 曲线的第二个线段。 */
  get segment2() {
    return this._segment2;
  }
  /** 曲线所属的路径。 */
  get path() {
    return this._path || null;
  }
  /** 曲线在路径曲线数组中的下标。 */
  get index() {
    const index = this._segment1._index;
    return index !== void 0 ? index : null;
  }
  /** 路径曲线数组中的下一条曲线。 */
  get next() {
    const path = this._path, curves = path && path._curves;
    return curves && (curves[this._segment1._index + 1] || path._closed && curves[0]) || null;
  }
  /** 路径曲线数组中的上一条曲线。 */
  get previous() {
    const path = this._path, curves = path && path._curves;
    return curves && (curves[this._segment1._index - 1] || path._closed && curves[curves.length - 1]) || null;
  }
  /** 是否为路径曲线数组中的第一条曲线。 */
  isFirst() {
    return !this._segment1._index;
  }
  /** 是否为路径曲线数组中的最后一条曲线。 */
  isLast() {
    const path = this._path;
    return path && this._segment1._index === path._curves.length - 1 || false;
  }
  /** 曲线几何的 8 个值：point1、handle1、handle2、point2。 */
  getValues(matrix) {
    return Curve.getValues(this._segment1, this._segment2, matrix);
  }
  /** 曲线几何的 4 个绝对坐标点。 */
  getPoints() {
    const coords = this.getValues(), points = [];
    for (let i = 0; i < 8; i += 2)
      points.push(new Point(coords[i], coords[i + 1]));
    return points;
  }
  /** 曲线的近似长度。 */
  get length() {
    if (this._length == null)
      this._length = Curve.getLength(this.getValues(), 0, 1);
    return this._length;
  }
  /** 曲线几何覆盖的面积。 */
  get area() {
    return Curve.getArea(this.getValues());
  }
  /** 两个锚点之间的直线，供 `isCollinear()` 使用。 */
  getLine() {
    return new Line(this._segment1._point, this._segment2._point);
  }
  /** 在给定 curve-time 区间内取子曲线。 */
  getPart(from, to) {
    return curveFromValues(Curve.getPart(this.getValues(), from, to));
  }
  /** 给定 curve-time 区间内的曲线长度。 */
  getPartLength(from, to) {
    return Curve.getLength(this.getValues(), from, to);
  }
  /** 给定 curve-time 处的曲线偏移。 */
  getOffsetAtTime(time) {
    return this.getPartLength(0, time);
  }
  /**
   * 在给定偏移或位置处分割曲线。曲线本身
   * 成为第一部分，返回第二部分。
   */
  divideAt(location) {
    const time = location && location.curve === this ? location.time : this.getTimeAt(location);
    return time == null ? null : this.divideAtTime(time);
  }
  /**
   * 在给定 curve-time 处分割曲线。曲线本身成为
   * 第一部分，返回第二部分；若曲线属于某条路径，
   * 还会插入该路径。
   */
  divideAtTime(time) {
    const tMin = CURVETIME_EPSILON, tMax = 1 - tMin;
    let res = null;
    if (time >= tMin && time <= tMax) {
      const parts = Curve.subdivide(this.getValues(), time), left = parts[0], right = parts[1], setHandles = this.hasHandles(), seg1 = this._segment1, seg2 = this._segment2, path = this._path;
      if (setHandles) {
        seg1._handleOut._set(left[2] - left[0], left[3] - left[1]);
        seg2._handleIn._set(right[4] - right[6], right[5] - right[7]);
      }
      const x = left[6], y = left[7], segment = new Segment(
        new Point(x, y),
        setHandles ? new Point(left[4] - x, left[5] - y) : void 0,
        setHandles ? new Point(right[2] - x, right[3] - y) : void 0
      );
      if (path) {
        path.insert(seg1._index + 1, segment);
        res = this.next;
      } else {
        this._segment2 = segment;
        this._changed();
        res = new Curve(segment, seg2);
      }
    }
    return res;
  }
  /** 在给定偏移或位置处拆分曲线所属的路径。 */
  splitAt(location) {
    const path = this._path;
    if (!path || location == null)
      return null;
    return typeof location === "number" ? path.splitAt(location) : path.split(location);
  }
  /** 在给定 curve-time 处拆分曲线所属的路径。 */
  splitAtTime(time) {
    return this.splitAt(this.getLocationAtTime(time));
  }
  /** 返回反向的曲线副本，不修改原曲线。 */
  reversed() {
    return new Curve(this._segment2.reversed(), this._segment1.reversed());
  }
  /** 清除手柄，使曲线变为直线。 */
  clearHandles() {
    this._segment1._handleOut._set(0, 0);
    this._segment2._handleIn._set(0, 0);
  }
  // ---------------------------------------------------------------------
  // 判断
  /** 曲线是否设置了手柄。 */
  hasHandles() {
    return !this._segment1._handleOut.isZero() || !this._segment2._handleIn.isZero();
  }
  /** 曲线长度是否大于给定 epsilon。 */
  hasLength(epsilon) {
    return (!this.point1.equals(this.point2) || this.hasHandles()) && this.length > (epsilon || 0);
  }
  /**
   * 曲线是否表现为直线：没有手柄，
   * 或手柄与锚点连线共线且
   * 不超出该线段。
   */
  isStraight() {
    const p1 = this._segment1._point, h1 = this._segment1._handleOut, h2 = this._segment2._handleIn, p2 = this._segment2._point;
    return isStraightTest(
      p1._x,
      p1._y,
      h1._x,
      h1._y,
      h2._x,
      h2._y,
      p2._x,
      p2._y
    );
  }
  /** 曲线是否是参数线性的。 */
  isLinear() {
    const p1 = this._segment1._point, h1 = this._segment1._handleOut, h2 = this._segment2._handleIn, p2 = this._segment2._point;
    return isLinearTest(
      p1._x,
      p1._y,
      h1._x,
      h1._y,
      h2._x,
      h2._y,
      p2._x,
      p2._y
    );
  }
  /** 两条曲线是否描述共线的直线。 */
  isCollinear(curve) {
    return !!curve && this.isStraight() && curve.isStraight() && this.getLine().isCollinear(curve.getLine());
  }
  /** 曲线是否为水平直线。 */
  isHorizontal() {
    const tangent = this.getTangentAtTime(0.5);
    return this.isStraight() && !!tangent && Math.abs(tangent.y) < Numerical.TRIGONOMETRIC_EPSILON;
  }
  /** 曲线是否为竖直直线。 */
  isVertical() {
    const tangent = this.getTangentAtTime(0.5);
    return this.isStraight() && !!tangent && Math.abs(tangent.x) < Numerical.TRIGONOMETRIC_EPSILON;
  }
  // ---------------------------------------------------------------------
  // 曲线上的位置
  /** 给定偏移处的曲线位置；超出范围时为 `null`。 */
  getLocationAt(offset) {
    return this.getLocationAtTime(this.getTimeAt(offset));
  }
  /** 给定 curve-time 处的曲线位置；超出范围时为 `null`。 */
  getLocationAtTime(time) {
    return time != null && time >= 0 && time <= 1 ? new CurveLocation(this, time) : null;
  }
  /**
   * 给定偏移处相对可选起点的 curve-time，
   * 若偏移超出曲线长度则返回 `null`。
   */
  getTimeAt(offset, start) {
    return Curve.getTimeAt(this.getValues(), offset, start);
  }
  /** 若点在曲线上，返回其 curve-time。 */
  getTimeOf(point) {
    return Curve.getTimeOf(this.getValues(), point);
  }
  /**
   * 曲线与给定切线相切处的 curve-time 参数，
   * 至多两个。起点或终点处的切线也包含在内。
   */
  getTimesWithTangent(tangent) {
    return tangent.isZero() ? [] : Curve.getTimesWithTangent(this.getValues(), tangent);
  }
  /** 若点在曲线上，返回到该点的路径长度。 */
  getOffsetOf(point) {
    const location = this.getLocationAtTime(this.getTimeOf(point));
    return location ? location.offset : null;
  }
  /** 曲线上距离给定点最近的位置。 */
  getNearestLocation(point) {
    const values = this.getValues(), time = Curve.getNearestTime(values, point), pt = Curve.getPoint(values, time);
    return new CurveLocation(
      this,
      time,
      pt,
      void 0,
      point.getDistance(pt)
    );
  }
  /** 曲线上距离给定点最近的点。 */
  getNearestPoint(point) {
    const location = this.getNearestLocation(point);
    return location ? location.point : null;
  }
  // ---------------------------------------------------------------------
  // 求值：按偏移的形式与按 curve-time 的形式
  getPointAt(location) {
    const values = this.getValues();
    return Curve.getPoint(values, Curve.getTimeAt(values, location));
  }
  getPointAtTime(time) {
    return Curve.getPoint(this.getValues(), time);
  }
  getTangentAt(location) {
    const values = this.getValues();
    return Curve.getTangent(values, Curve.getTimeAt(values, location));
  }
  getTangentAtTime(time) {
    return Curve.getTangent(this.getValues(), time);
  }
  getNormalAt(location) {
    const values = this.getValues();
    return Curve.getNormal(values, Curve.getTimeAt(values, location));
  }
  getNormalAtTime(time) {
    return Curve.getNormal(this.getValues(), time);
  }
  getWeightedTangentAt(location) {
    const values = this.getValues();
    return Curve.getWeightedTangent(values, Curve.getTimeAt(values, location));
  }
  getWeightedTangentAtTime(time) {
    return Curve.getWeightedTangent(this.getValues(), time);
  }
  getWeightedNormalAt(location) {
    const values = this.getValues();
    return Curve.getWeightedNormal(values, Curve.getTimeAt(values, location));
  }
  getWeightedNormalAtTime(time) {
    return Curve.getWeightedNormal(this.getValues(), time);
  }
  getCurvatureAt(location) {
    const values = this.getValues();
    return Curve.getCurvature(values, Curve.getTimeAt(values, location));
  }
  getCurvatureAtTime(time) {
    return Curve.getCurvature(this.getValues(), time);
  }
  // ---------------------------------------------------------------------
  // 求交
  /** 与另一条曲线的所有交点；不传则为自交点。 */
  getIntersections(curve) {
    const v1 = this.getValues(), v2 = curve && curve !== this && curve.getValues();
    return v2 ? getCurveIntersections(v1, v2, this, curve, []) : getSelfIntersection(v1, this, []);
  }
  // ---------------------------------------------------------------------
  // 静态方法
  /** 曲线几何的 8 个值：point1、handle1、handle2、point2。 */
  static getValues(segment1, segment2, matrix, straight) {
    const p1 = segment1._point, h1 = segment1._handleOut, h2 = segment2._handleIn, p2 = segment2._point, x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y, values = straight ? [x1, y1, x1, y1, x2, y2, x2, y2] : [
      x1,
      y1,
      x1 + h1._x,
      y1 + h1._y,
      x2 + h2._x,
      y2 + h2._y,
      x2,
      y2
    ];
    if (matrix)
      matrix._transformCoordinates(values, values, 4);
    return values;
  }
  /** 在 `t` 处把曲线值分成左右两条子曲线。 */
  static subdivide(v, t) {
    const x0 = v[0], y0 = v[1], x1 = v[2], y1 = v[3], x2 = v[4], y2 = v[5], x3 = v[6], y3 = v[7];
    if (t === void 0)
      t = 0.5;
    const u = 1 - t, x4 = u * x0 + t * x1, y4 = u * y0 + t * y1, x5 = u * x1 + t * x2, y5 = u * y1 + t * y2, x6 = u * x2 + t * x3, y6 = u * y2 + t * y3, x7 = u * x4 + t * x5, y7 = u * y4 + t * y5, x8 = u * x5 + t * x6, y8 = u * y5 + t * y6, x9 = u * x7 + t * x8, y9 = u * y7 + t * y8;
    return [
      [x0, y0, x4, y4, x7, y7, x9, y9],
      // left
      [x9, y9, x8, y8, x6, y6, x3, y3]
      // right
    ];
  }
  /**
   * 把曲线值拆成在指定坐标方向上单调的若干曲线，
   * `dir` 为 false 表示 x 方向，为 true 表示 y 方向。
   */
  static getMonoCurves(v, dir) {
    const curves = [], io = dir ? 0 : 1, o0 = v[io + 0], o1 = v[io + 2], o2 = v[io + 4], o3 = v[io + 6];
    if (o0 >= o1 === o1 >= o2 && o1 >= o2 === o2 >= o3 || Curve.isStraight(v)) {
      curves.push(v);
    } else {
      const a = 3 * (o1 - o2) - o0 + o3, b = 2 * (o0 + o2) - 4 * o1, c = o1 - o0, tMin = CURVETIME_EPSILON, tMax = 1 - tMin, roots = [], n = Numerical.solveQuadratic(a, b, c, roots, tMin, tMax);
      if (!n) {
        curves.push(v);
      } else {
        roots.sort();
        let t = roots[0], parts = Curve.subdivide(v, t);
        curves.push(parts[0]);
        if (n > 1) {
          t = (roots[1] - t) / (1 - t);
          parts = Curve.subdivide(parts[1], t);
          curves.push(parts[0]);
        }
        curves.push(parts[1]);
      }
    }
    return curves;
  }
  /**
   * 把某一坐标轴上的点坐标 (p0, p1, p2, p3) 转换为
   * 多项式系数，并对 `val` 求解该多项式。
   */
  static solveCubic(v, coord, val, roots, min, max) {
    const v0 = v[coord], v1 = v[coord + 2], v2 = v[coord + 4], v3 = v[coord + 6];
    if (!(v0 < val && v3 < val && v1 < val && v2 < val || v0 > val && v3 > val && v1 > val && v2 > val)) {
      const c = 3 * (v1 - v0), b = 3 * (v2 - v1) - c, a = v3 - v0 - c - b;
      return Numerical.solveCubic(a, b, c, v0 - val, roots, min, max);
    }
    return 0;
  }
  /** 给定 curve-time 区间内的子曲线；`from > to` 时反向。 */
  static getPart(v, from, to) {
    const flip = from > to;
    if (flip) {
      const tmp = from;
      from = to;
      to = tmp;
    }
    if (from > 0)
      v = Curve.subdivide(v, from)[1];
    if (to < 1)
      v = Curve.subdivide(v, (to - from) / (1 - from))[0];
    return flip ? [v[6], v[7], v[4], v[5], v[2], v[3], v[0], v[1]] : v;
  }
  /**
   * 曲线是否足够平坦，即表现为一条
   * 偏差在 `flatness` 容差内的直线。
   */
  static isFlatEnough(v, flatness) {
    const x0 = v[0], y0 = v[1], x1 = v[2], y1 = v[3], x2 = v[4], y2 = v[5], x3 = v[6], y3 = v[7], ux = 3 * x1 - 2 * x0 - x3, uy = 3 * y1 - 2 * y0 - y3, vx = 3 * x2 - 2 * x3 - x0, vy = 3 * y2 - 2 * y3 - y0;
    return Math.max(ux * ux, vx * vx) + Math.max(uy * uy, vy * vy) <= 16 * flatness * flatness;
  }
  /** 曲线几何覆盖的面积。 */
  static getArea(v) {
    const x0 = v[0], y0 = v[1], x1 = v[2], y1 = v[3], x2 = v[4], y2 = v[5], x3 = v[6], y3 = v[7];
    return 3 * ((y3 - y0) * (x1 + x2) - (x3 - x0) * (y1 + y2) + y1 * (x0 - x2) - x1 * (y0 - y2) + y3 * (x2 + x0 / 3) - x3 * (y2 + y0 / 3)) / 20;
  }
  /**
   * `Path.getBounds()` 的私有辅助函数：求贝塞尔曲线导数多项式的
   * 零交点，以确定计算曲线边界时的
   * 潜在极值。
   */
  static _addBounds(v0, v1, v2, v3, coord, padding, min, max, roots) {
    function add(value, pad) {
      const left = value - pad, right = value + pad;
      if (left < min[coord])
        min[coord] = left;
      if (right > max[coord])
        max[coord] = right;
    }
    const minPad = min[coord] + padding, maxPad = max[coord] - padding;
    if (v0 < minPad || v1 < minPad || v2 < minPad || v3 < minPad || v0 > maxPad || v1 > maxPad || v2 > maxPad || v3 > maxPad) {
      if (v1 < v0 !== v1 < v3 && v2 < v0 !== v2 < v3) {
        add(v0, 0);
        add(v3, 0);
      } else {
        const a = 3 * (v1 - v2) - v0 + v3, b = 2 * (v0 + v2) - 4 * v1, c = v1 - v0, count = Numerical.solveQuadratic(a, b, c, roots), tMin = CURVETIME_EPSILON, tMax = 1 - tMin;
        add(v3, 0);
        for (let i = 0; i < count; i++) {
          const t = roots[i], u = 1 - t;
          if (tMin <= t && t <= tMax)
            add(
              u * u * u * v0 + 3 * u * u * t * v1 + 3 * u * t * t * v2 + t * t * t * v3,
              padding
            );
        }
      }
    }
  }
  /** 判断三次贝塞尔曲线的类型，并求出其根。 */
  static classify(v) {
    const x0 = v[0], y0 = v[1], x1 = v[2], y1 = v[3], x2 = v[4], y2 = v[5], x3 = v[6], y3 = v[7], a1 = x0 * (y3 - y2) + y0 * (x2 - x3) + x3 * y2 - y3 * x2, a2 = x1 * (y0 - y3) + y1 * (x3 - x0) + x0 * y3 - y0 * x3, a3 = x2 * (y1 - y0) + y2 * (x0 - x1) + x1 * y0 - y1 * x0, isZero = Numerical.isZero;
    let d3 = 3 * a3, d2 = d3 - a2, d1 = d2 - a2 + a1;
    const l = Math.sqrt(d1 * d1 + d2 * d2 + d3 * d3), magnitude = Math.max(
      Math.abs(x0),
      Math.abs(y0),
      Math.abs(x1),
      Math.abs(y1),
      Math.abs(x2),
      Math.abs(y2),
      Math.abs(x3),
      Math.abs(y3)
    ), s = l > magnitude * Numerical.getEpsilon(magnitude) ? 1 / l : 0;
    d1 *= s;
    d2 *= s;
    d3 *= s;
    function build(type, t1, t2) {
      const tMin = CURVETIME_EPSILON, tMax = 1 - tMin, hasRoots = t1 !== void 0;
      let t1Ok = hasRoots && t1 > tMin && t1 < tMax, t2Ok = hasRoots && t2 > tMin && t2 < tMax, resultType = type;
      if (hasRoots && (!(t1Ok || t2Ok) || type === "loop" && !(t1Ok && t2Ok))) {
        resultType = "arch";
        t1Ok = t2Ok = false;
      }
      return {
        type: resultType,
        roots: t1Ok || t2Ok ? t1Ok && t2Ok ? t1 < t2 ? [t1, t2] : [t2, t1] : [t1Ok ? t1 : t2] : null
      };
    }
    if (isZero(d1)) {
      return isZero(d2) ? build(isZero(d3) ? "line" : "quadratic") : build("serpentine", d3 / (3 * d2));
    }
    const d = 3 * d2 * d2 - 4 * d1 * d3;
    if (isZero(d)) {
      return build("cusp", d2 / (2 * d1));
    }
    const f1 = d > 0 ? Math.sqrt(d / 3) : Math.sqrt(-d), f2 = 2 * d1;
    return build(
      d > 0 ? "serpentine" : "loop",
      // 1. / 2.
      (d2 + f1) / f2,
      (d2 - f1) / f2
    );
  }
  /** 曲线长度，或 `a` 到 `b` 之间部分的长度。 */
  static getLength(v, a, b, ds) {
    if (a === void 0)
      a = 0;
    if (b === void 0)
      b = 1;
    if (Curve.isStraight(v)) {
      let c = v;
      if (b < 1) {
        c = Curve.subdivide(c, b)[0];
        a /= b;
      }
      if (a > 0) {
        c = Curve.subdivide(c, a)[1];
      }
      const dx = c[6] - c[0], dy = c[7] - c[1];
      return Math.sqrt(dx * dx + dy * dy);
    }
    return Numerical.integrate(
      ds || getLengthIntegrand(v),
      a,
      b,
      getIterations(a, b)
    );
  }
  /** 给定偏移处相对可选起点的 curve-time。 */
  static getTimeAt(v, offset, start) {
    if (start === void 0)
      start = offset < 0 ? 1 : 0;
    if (offset === 0)
      return start;
    const abs = Math.abs, epsilon = Numerical.EPSILON, forward = offset > 0, a = forward ? start : 0, b = forward ? 1 : start, ds = getLengthIntegrand(v), rangeLength = Curve.getLength(v, a, b, ds), diff = abs(offset) - rangeLength;
    if (abs(diff) < epsilon) {
      return forward ? b : a;
    } else if (diff > epsilon) {
      return null;
    }
    const guess = offset / rangeLength;
    let length = 0;
    function f(t) {
      length += Numerical.integrate(
        ds,
        start,
        t,
        getIterations(start, t)
      );
      start = t;
      return length - offset;
    }
    return Numerical.findRoot(
      f,
      ds,
      start + guess,
      a,
      b,
      32,
      Numerical.EPSILON
    );
  }
  /** 若点在曲线上，返回其 curve-time。 */
  static getTimeOf(v, point, tolerance) {
    const abs = Math.abs, x0 = v[0], y0 = v[1], x3 = v[6], y3 = v[7], px = point.x, py = point.y, epsilon = tolerance || Numerical.getEpsilon(
      Math.max(
        abs(x0),
        abs(y0),
        abs(v[2]),
        abs(v[3]),
        abs(v[4]),
        abs(v[5]),
        abs(x3),
        abs(y3)
      ),
      Numerical.GEOMETRIC_EPSILON
    );
    function isClose(x, y) {
      const dx = x - px, dy = y - py;
      return Math.sqrt(dx * dx + dy * dy) <= epsilon;
    }
    if (isClose(x0, y0))
      return 0;
    if (isClose(x3, y3))
      return 1;
    const c = getCoefficients(v), ax = c[0], bx = c[1], cx = c[2], ay = c[3], by = c[4], cy = c[5], roots = [];
    for (let i = 0; i < 2; i++) {
      const count = Curve.solveCubic(v, i, i ? py : px, roots, 0, 1);
      for (let j = 0; j < count; j++) {
        let t = roots[j];
        const x = getCoordinate(x0, x3, ax, bx, cx, t), y = getCoordinate(y0, y3, ay, by, cy, t);
        if (isClose(x, y))
          return t;
        const dx = (3 * ax * t + 2 * bx) * t + cx, dy = (3 * ay * t + 2 * by) * t + cy, length2 = dx * dx + dy * dy;
        if (length2) {
          t = Math.max(0, Math.min(
            1,
            t + ((px - x) * dx + (py - y) * dy) / length2
          ));
          if (isClose(
            getCoordinate(x0, x3, ax, bx, cx, t),
            getCoordinate(y0, y3, ay, by, cy, t)
          ))
            return t;
        }
      }
    }
    return null;
  }
  /** 距离给定点最近的 curve-time。 */
  static getNearestTime(v, point) {
    const x0 = v[0], y0 = v[1], x3 = v[6], y3 = v[7], px = point.x, py = point.y;
    if (Curve.isStraight(v)) {
      const vx = x3 - x0, vy = y3 - y0, det = vx * vx + vy * vy;
      if (det === 0)
        return 0;
      const u = ((px - x0) * vx + (py - y0) * vy) / det;
      const time = u < Numerical.EPSILON ? 0 : u > 1 - Numerical.EPSILON ? 1 : Curve.getTimeOf(
        v,
        new Point(x0 + u * vx, y0 + u * vy)
      );
      return time;
    }
    const c = getCoefficients(v), ax = c[0], bx = c[1], cx = c[2], ay = c[3], by = c[4], cy = c[5], count = 100, distances = [];
    let minDist = Infinity, minT = 0;
    function getDistance(t) {
      const dx = getCoordinate(x0, x3, ax, bx, cx, t) - px, dy = getCoordinate(y0, y3, ay, by, cy, t) - py;
      return dx * dx + dy * dy;
    }
    for (let i = 0; i <= count; i++)
      distances.push(getDistance(i / count));
    for (let i = 0; i <= count; i++) {
      let dist = distances[i];
      if ((i === 0 || dist < distances[i - 1]) && (i === count || dist <= distances[i + 1])) {
        let t = i / count, step = 1 / (count * 2);
        while (step > CURVETIME_EPSILON) {
          const t1 = t - step, t2 = t + step, dist1 = t1 >= 0 ? getDistance(t1) : Infinity, dist2 = t2 <= 1 ? getDistance(t2) : Infinity;
          if (dist1 < dist && dist1 <= dist2) {
            t = t1;
            dist = dist1;
          } else if (dist2 < dist) {
            t = t2;
            dist = dist2;
          } else {
            step /= 2;
          }
        }
        if (dist < minDist) {
          minDist = dist;
          minT = t;
        }
      }
    }
    return minT;
  }
  /** 给定 curve-time 处的曲线点。 */
  static getPoint(v, t) {
    return evaluate(v, t, 0, false);
  }
  /** 给定 curve-time 处的归一化切线。 */
  static getTangent(v, t) {
    return evaluate(v, t, 1, true);
  }
  /** 给定 curve-time 处的加权切线。 */
  static getWeightedTangent(v, t) {
    return evaluate(v, t, 1, false);
  }
  /** 给定 curve-time 处的归一化法线。 */
  static getNormal(v, t) {
    return evaluate(v, t, 2, true);
  }
  /** 给定 curve-time 处的加权法线。 */
  static getWeightedNormal(v, t) {
    return evaluate(v, t, 2, false);
  }
  /** 给定 curve-time 处的曲率。 */
  static getCurvature(v, t) {
    return evaluate(v, t, 3, false).x;
  }
  /**
   * 曲线“峰值”处的 t 值，即一阶与二阶导数
   * 点积的根。峰值与曲率极值有相似性质，
   * 但计算代价更低。
   */
  static getPeaks(v) {
    const c = getCoefficients(v), ax = c[0], bx = c[1], cx = c[2], ay = c[3], by = c[4], cy = c[5], tMin = CURVETIME_EPSILON, tMax = 1 - tMin, roots = [];
    Numerical.solveCubic(
      9 * (ax * ax + ay * ay),
      9 * (ax * bx + by * ay),
      2 * (bx * bx + by * by) + 3 * (cx * ax + cy * ay),
      cx * bx + by * cy,
      // 排除 0 与 1，因为它们不算峰值。
      roots,
      tMin,
      tMax
    );
    return roots.sort();
  }
  /**
   * 曲线沿其所有控制点所在直线（容差内）反向处的
   * 时间值，若存在。
   */
  static getReversals(v, tolerance) {
    let dx = v[6] - v[0], dy = v[7] - v[1];
    for (let i = 0; i < 4; i += 2) {
      const hx = v[i + 2] - v[i], hy = v[i + 3] - v[i + 1];
      if (hx * hx + hy * hy > dx * dx + dy * dy) {
        dx = hx;
        dy = hy;
      }
    }
    const length = Math.sqrt(dx * dx + dy * dy), o = [];
    if (!length)
      return [];
    for (let i = 0; i < 8; i += 2) {
      const x = v[i] - v[0], y = v[i + 1] - v[1];
      if (Math.abs(x * dy - y * dx) > tolerance * length)
        return [];
      o.push((x * dx + y * dy) / length);
    }
    const roots = [], count = Numerical.solveQuadratic(
      3 * (o[1] - o[2]) - o[0] + o[3],
      2 * (o[0] + o[2]) - 4 * o[1],
      o[1] - o[0],
      roots,
      CURVETIME_EPSILON,
      1 - CURVETIME_EPSILON
    );
    return count > 0 ? roots.slice(0, count).sort((a, b) => a - b) : [];
  }
  /**
   * 曲线与给定切线相切处的 curve-time 参数，
   * 至多两个。起点或终点处的切线也包含在内。
   */
  static getTimesWithTangent(v, tangent) {
    const c = getCoefficients(v), ax = 3 * c[0], bx = 2 * c[1], cx = c[2], ay = 3 * c[3], by = 2 * c[4], cy = c[5], normalized = tangent.normalize(), tx = normalized.x, ty = normalized.y, den = 2 * ax * ty - 2 * ay * tx, times = [];
    if (Math.abs(den) < CURVETIME_EPSILON) {
      const num = cx * ty - cy * tx, den2 = bx * ty - by * tx;
      if (den2 != 0) {
        const t = -num / den2;
        if (t >= 0 && t <= 1)
          times.push(t);
      }
    } else {
      const delta = (bx * bx - 4 * ax * cx) * ty * ty + (-2 * bx * by + 4 * ay * cx + 4 * ax * cy) * tx * ty + (by * by - 4 * ay * cy) * tx * tx, k = bx * ty - by * tx;
      if (delta >= 0 && den != 0) {
        const d = Math.sqrt(delta), t0 = -(k + d) / den, t1 = (-k + d) / den;
        if (t0 >= 0 && t0 <= 1)
          times.push(t0);
        if (t1 >= 0 && t1 <= 1)
          times.push(t1);
      }
    }
    return times;
  }
  /** 曲线值是否描述一条直线。 */
  static isStraight(v, epsilon) {
    const x1 = v[0], y1 = v[1], x2 = v[6], y2 = v[7];
    return isStraightTest(
      x1,
      y1,
      v[2] - x1,
      v[3] - y1,
      v[4] - x2,
      v[5] - y2,
      x2,
      y2
    );
  }
  /** 曲线值是否描述参数线性的曲线。 */
  static isLinear(v, epsilon) {
    const x1 = v[0], y1 = v[1], x2 = v[6], y2 = v[7];
    return isLinearTest(
      x1,
      y1,
      v[2] - x1,
      v[3] - y1,
      v[4] - x2,
      v[5] - y2,
      x2,
      y2
    );
  }
  /** 两条曲线的重叠部分，以 curve-time 对表示。 */
  static getOverlaps(v1, v2, tolerance) {
    return findOverlaps(v1, v2, tolerance);
  }
  /** 两组曲线之间的所有交点。 */
  static getIntersections(curves1, curves2, include, matrix1, matrix2, _returnFirst, _tolerance, _collisions) {
    return findIntersections(
      curves1,
      curves2,
      include,
      matrix1,
      matrix2,
      _returnFirst,
      _tolerance,
      _collisions
    );
  }
}
export {
  Curve
};
