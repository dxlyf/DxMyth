import { bernstein } from "./MathUtils.js";
const isNearZero = (v, eps = 1e-10) => Math.abs(v) <= eps;
const deCasteljau = (points, t) => {
  const n = points.length;
  if (n === 0) return { x: 0, y: 0 };
  if (n === 1) return { x: points[0].x, y: points[0].y };
  const work = points.map((p) => ({ x: p.x, y: p.y }));
  for (let k = 1; k < n; k++) {
    for (let i = 0; i < n - k; i++) {
      work[i].x += (work[i + 1].x - work[i].x) * t;
      work[i].y += (work[i + 1].y - work[i].y) * t;
    }
  }
  return work[0];
};
const derivative = (points, t) => {
  return deCasteljau(derivativeControlPoints(points), t);
};
const derivativeControlPoints = (points) => {
  const n = points.length;
  if (n < 2) return [];
  const dp = [];
  for (let i = 0; i < n - 1; i++) {
    dp.push({
      x: (n - 1) * (points[i + 1].x - points[i].x),
      y: (n - 1) * (points[i + 1].y - points[i].y)
    });
  }
  return dp;
};
const evaluate = (points, t) => {
  const n = points.length - 1;
  let x = 0;
  let y = 0;
  for (let i = 0; i <= n; i++) {
    const b = bernstein(i, n, t);
    x += points[i].x * b;
    y += points[i].y * b;
  }
  return { x, y };
};
const evaluateValues = (values, t) => {
  const n = values.length - 1;
  let result = 0;
  for (let i = 0; i <= n; i++) {
    result += values[i] * bernstein(i, n, t);
  }
  return result;
};
const derivative1 = (points, t) => {
  const n = points.length - 1;
  if (n < 1) return { x: 0, y: 0 };
  const m = n - 1;
  let x = 0, y = 0;
  for (let i = 0; i <= m; i++) {
    const b = bernstein(i, m, t);
    x += (points[i + 1].x - points[i].x) * b;
    y += (points[i + 1].y - points[i].y) * b;
  }
  return { x: x * n, y: y * n };
};
const derivativeN = (points, k, t) => {
  const n = points.length - 1;
  if (k <= 0) return evaluate(points, t);
  if (k > n) return { x: 0, y: 0 };
  const diff = points.map((p) => ({ x: p.x, y: p.y }));
  for (let order = 0; order < k; order++) {
    for (let i = 0; i < n - order; i++) {
      diff[i].x = diff[i + 1].x - diff[i].x;
      diff[i].y = diff[i + 1].y - diff[i].y;
    }
  }
  const factor = factorial(n) / factorial(n - k);
  const m = n - k;
  let x = 0, y = 0;
  for (let i = 0; i <= m; i++) {
    const b = bernstein(i, m, t);
    x += diff[i].x * b;
    y += diff[i].y * b;
  }
  return { x: x * factor, y: y * factor };
};
const factorial = (n) => {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
};
const quadraticEvaluate = (p0, p1, p2, t) => {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
  };
};
const cubicEvaluate = (p0, p1, p2, p3, t) => {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y
  };
};
const quadraticToCubic = (p0, p1, p2) => {
  return [
    { x: p0.x, y: p0.y },
    { x: p0.x / 3 + 2 / 3 * p1.x, y: p0.y / 3 + 2 / 3 * p1.y },
    { x: 2 / 3 * p1.x + p2.x / 3, y: 2 / 3 * p1.y + p2.y / 3 },
    { x: p2.x, y: p2.y }
  ];
};
const elevateDegree = (points, times = 1) => {
  let result = points.map((p) => ({ x: p.x, y: p.y }));
  for (let t = 0; t < times; t++) {
    const n = result.length - 1;
    if (n < 1) return result;
    const m = n + 1;
    const next = [{ x: result[0].x, y: result[0].y }];
    for (let i = 1; i <= n; i++) {
      const a = i / m;
      next.push({
        x: a * result[i - 1].x + (1 - a) * result[i].x,
        y: a * result[i - 1].y + (1 - a) * result[i].y
      });
    }
    next.push({ x: result[n].x, y: result[n].y });
    result = next;
  }
  return result;
};
const binomial = (n, k) => {
  if (k < 0 || k > n) return 0;
  const kk = Math.min(k, n - k);
  let r = 1;
  for (let i = 1; i <= kk; i++) r = r * (n - kk + i) / i;
  return r;
};
const elevateDegreeN = (points, times = 1) => {
  const k = Math.floor(times);
  const n = points.length - 1;
  if (n < 1 || k <= 0) return points.map((p) => ({ x: p.x, y: p.y }));
  const m = n + k;
  const result = [];
  for (let i = 0; i <= m; i++) {
    const denom = binomial(m, i);
    const jStart = Math.max(0, i - k);
    const jEnd = Math.min(n, i);
    let x = 0, y = 0;
    for (let j = jStart; j <= jEnd; j++) {
      const w = binomial(n, j) * binomial(k, i - j) / denom;
      x += w * points[j].x;
      y += w * points[j].y;
    }
    result.push({ x, y });
  }
  return result;
};
const arcLength = (points, segments = 16) => {
  let length = 0;
  const dt = 1 / segments;
  let prev = deCasteljau(points, 0);
  for (let i = 1; i <= segments; i++) {
    const t = i * dt;
    const curr = deCasteljau(points, t);
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    length += Math.sqrt(dx * dx + dy * dy);
    prev = curr;
  }
  return length;
};
const normal = (points, t) => {
  const d = derivative(points, t);
  const len = Math.sqrt(d.x * d.x + d.y * d.y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: -d.y / len, y: d.x / len };
};
const curvature = (points, t) => {
  const n = points.length;
  if (n < 3) return 0;
  const d1 = derivative(points, t);
  const dp2 = [];
  for (let i = 0; i < n - 2; i++) {
    dp2.push({
      x: (n - 1) * (n - 2) * (points[i + 2].x - 2 * points[i + 1].x + points[i].x),
      y: (n - 1) * (n - 2) * (points[i + 2].y - 2 * points[i + 1].y + points[i].y)
    });
  }
  const d2 = dp2.length > 0 ? deCasteljau(dp2, t) : { x: 0, y: 0 };
  const cross = d1.x * d2.y - d1.y * d2.x;
  const lenSq = d1.x * d1.x + d1.y * d1.y;
  if (lenSq === 0) return 0;
  return Math.abs(cross) / Math.pow(lenSq, 1.5);
};
const extrema = (points) => {
  const n = points.length - 1;
  if (n < 1) return [];
  const roots = [];
  const dp = derivativeControlPoints(points);
  const findRoots = (values) => {
    const deg = values.length - 1;
    const res = [];
    const SAMPLES = Math.max(deg * 4, 20);
    const evaluateAt = (t) => {
      const tmp = values.map((v) => v);
      for (let k = 1; k <= deg; k++) {
        for (let i = 0; i <= deg - k; i++) {
          tmp[i] += (tmp[i + 1] - tmp[i]) * t;
        }
      }
      return tmp[0];
    };
    let prev = evaluateAt(0);
    for (let i = 1; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      const curr = evaluateAt(t);
      if (prev * curr < 0 || isNearZero(curr)) {
        let lo = (i - 1) / SAMPLES, hi = t;
        let mid = (lo + hi) / 2;
        if (!isNearZero(curr)) {
          for (let iter = 0; iter < 20; iter++) {
            mid = (lo + hi) / 2;
            const v = evaluateAt(mid);
            if (v * evaluateAt(lo) <= 0) hi = mid;
            else lo = mid;
            if (hi - lo < 1e-10) break;
          }
          if (mid > 0 && mid < 1) res.push(mid);
        } else if (t > 0 && t < 1) {
          res.push(t);
        }
      }
      prev = curr;
    }
    return res;
  };
  const xValues = dp.map((p) => p.x);
  for (const t of findRoots(xValues)) {
    if (t > 0 && t < 1 && !roots.some((r) => isNearZero(r - t))) {
      roots.push(t);
    }
  }
  const yValues = dp.map((p) => p.y);
  for (const t of findRoots(yValues)) {
    if (t > 0 && t < 1 && !roots.some((r) => isNearZero(r - t))) {
      roots.push(t);
    }
  }
  return roots.sort((a, b) => a - b);
};
const maxCurvature = (points, samples = 20) => {
  let bestT = 0;
  let maxK = -Infinity;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const k = curvature(points, t);
    if (k > maxK) {
      maxK = k;
      bestT = t;
    }
  }
  const phi = (Math.sqrt(5) - 1) / 2;
  let a = Math.max(0, bestT - 1 / samples);
  let b = Math.min(1, bestT + 1 / samples);
  let c = b - phi * (b - a);
  let d = a + phi * (b - a);
  const fc = curvature(points, c);
  const fd = curvature(points, d);
  for (let iter = 0; iter < 30; iter++) {
    if (Math.abs(b - a) < 1e-10) break;
    if (fc > fd) {
      b = d;
      d = c;
      c = b - phi * (b - a);
    } else {
      a = c;
      c = d;
      d = a + phi * (b - a);
    }
  }
  return (a + b) / 2;
};
const project = (points, px, py, samples = 16, iterations = 8) => {
  let bestT = 0;
  let minDist2 = Infinity;
  const evalPt = (t2) => {
    return deCasteljau(points, t2);
  };
  for (let i = 0; i <= samples; i++) {
    const t2 = i / samples;
    const p2 = evalPt(t2);
    const dx2 = p2.x - px;
    const dy2 = p2.y - py;
    const d22 = dx2 * dx2 + dy2 * dy2;
    if (d22 < minDist2) {
      minDist2 = d22;
      bestT = t2;
    }
  }
  let t = bestT;
  for (let iter = 0; iter < iterations; iter++) {
    const p2 = evalPt(t);
    const d1 = derivative(points, t);
    const d22 = derivativeN(points, 2, t);
    const fx = p2.x - px, fy = p2.y - py;
    const ft = fx * d1.x + fy * d1.y;
    const ft2 = d1.x * d1.x + d1.y * d1.y + fx * d22.x + fy * d22.y;
    if (isNearZero(ft2)) break;
    t = t - ft / ft2;
    t = Math.max(0, Math.min(1, t));
  }
  const p = evalPt(t);
  const dx = p.x - px, dy = p.y - py;
  const d2 = dx * dx + dy * dy;
  if (d2 < minDist2) minDist2 = d2;
  const p0 = evalPt(0), p1 = evalPt(1);
  const d0x = p0.x - px, d0y = p0.y - py;
  const d1x = p1.x - px, d1y = p1.y - py;
  const d02 = d0x * d0x + d0y * d0y;
  const d12 = d1x * d1x + d1y * d1y;
  if (d02 < minDist2) {
    minDist2 = d02;
    t = 0;
  }
  if (d12 < minDist2) {
    minDist2 = d12;
    t = 1;
  }
  return { t, distance: Math.sqrt(minDist2) };
};
function conicToQuadratic(x0, y0, x1, y1, x2, y2, w) {
  const P0 = [x0, y0];
  const P2 = [x2, y2];
  const Q = [
    (x0 + w * x1) / (1 + w),
    (y0 + w * y1) / (1 + w)
  ];
  const R = [
    (x2 + w * x1) / (1 + w),
    (y2 + w * y1) / (1 + w)
  ];
  const M = [
    (x0 + 2 * w * x1 + x2) / (2 * (1 + w)),
    (y0 + 2 * w * y1 + y2) / (2 * (1 + w))
  ];
  return [
    [P0, Q, M],
    [M, R, P2]
  ];
}
const controlPointsBounds = (points) => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
};
const splitControlPoints = (points, t = 0.5) => {
  const n = points.length;
  const work = points.map((p) => ({ x: p.x, y: p.y }));
  const left = [work[0]];
  const right = [work[n - 1]];
  for (let k = 1; k < n; k++) {
    for (let i = 0; i < n - k; i++) {
      work[i] = {
        x: work[i].x + (work[i + 1].x - work[i].x) * t,
        y: work[i].y + (work[i + 1].y - work[i].y) * t
      };
    }
    left.push(work[0]);
    right.unshift(work[n - k - 1]);
  }
  return [left, right];
};
const refineCurveCurveIntersection = (pointsA, pointsB, t1, t2) => {
  let u = t1;
  let v = t2;
  for (let iter = 0; iter < 8; iter++) {
    const pa = deCasteljau(pointsA, u);
    const pb = deCasteljau(pointsB, v);
    const fx = pa.x - pb.x;
    const fy = pa.y - pb.y;
    if (fx * fx + fy * fy < 1e-20) break;
    const da = derivative(pointsA, u);
    const db = derivative(pointsB, v);
    const det = -da.x * db.y + db.x * da.y;
    if (Math.abs(det) < 1e-12) break;
    const du = (fx * db.y - db.x * fy) / det;
    const dv = (-da.x * fy + fx * da.y) / det;
    u = Math.max(0, Math.min(1, u + du));
    v = Math.max(0, Math.min(1, v + dv));
    if (Math.abs(du) < 1e-10 && Math.abs(dv) < 1e-10) break;
  }
  return deCasteljau(pointsA, u);
};
const curveCurveIntersections = (pointsA, pointsB, epsilon = 1e-4) => {
  if (pointsA.length < 2 || pointsB.length < 2) return [];
  const tol = Math.max(epsilon, 1e-6);
  const MAX_DEPTH = 40;
  const MAX_NODES = 4096;
  const stack = [{ a: pointsA, b: pointsB, t0: 0, t1: 1, s0: 0, s1: 1, depth: 0 }];
  const found = [];
  let nodes = 0;
  while (stack.length > 0) {
    if (nodes++ > MAX_NODES) break;
    const node = stack.pop();
    const ba = controlPointsBounds(node.a);
    const bb = controlPointsBounds(node.b);
    if (ba.minX > bb.maxX || bb.minX > ba.maxX || ba.minY > bb.maxY || bb.minY > ba.maxY) continue;
    const sizeA = Math.max(ba.maxX - ba.minX, ba.maxY - ba.minY);
    const sizeB = Math.max(bb.maxX - bb.minX, bb.maxY - bb.minY);
    if (sizeA <= tol && sizeB <= tol || node.depth >= MAX_DEPTH) {
      const t = (node.t0 + node.t1) / 2;
      const s = (node.s0 + node.s1) / 2;
      found.push(refineCurveCurveIntersection(pointsA, pointsB, t, s));
      continue;
    }
    if (sizeA >= sizeB) {
      const [l, r] = splitControlPoints(node.a);
      const tm = (node.t0 + node.t1) / 2;
      stack.push({ a: l, b: node.b, t0: node.t0, t1: tm, s0: node.s0, s1: node.s1, depth: node.depth + 1 });
      stack.push({ a: r, b: node.b, t0: tm, t1: node.t1, s0: node.s0, s1: node.s1, depth: node.depth + 1 });
    } else {
      const [l, r] = splitControlPoints(node.b);
      const sm = (node.s0 + node.s1) / 2;
      stack.push({ a: node.a, b: l, t0: node.t0, t1: node.t1, s0: node.s0, s1: sm, depth: node.depth + 1 });
      stack.push({ a: node.a, b: r, t0: node.t0, t1: node.t1, s0: sm, s1: node.s1, depth: node.depth + 1 });
    }
  }
  const dedupeTol = tol * 2;
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const p of found) {
    const key = `${Math.round(p.x / dedupeTol)}:${Math.round(p.y / dedupeTol)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(p);
  }
  return result;
};
const maxCurvaturePoint = (points, samples = 32) => {
  if (points.length < 3) return { t: 0, curvature: 0 };
  let bestIndex = 0;
  let bestK = -Infinity;
  for (let i = 0; i <= samples; i++) {
    const k = curvature(points, i / samples);
    if (k > bestK) {
      bestK = k;
      bestIndex = i;
    }
  }
  if (bestK <= 0) return { t: bestIndex / samples, curvature: bestK };
  const step = 1 / samples;
  let a = Math.max(0, bestIndex * step - step);
  let b = Math.min(1, bestIndex * step + step);
  const phi = (Math.sqrt(5) - 1) / 2;
  let c = b - phi * (b - a);
  let d = a + phi * (b - a);
  let fc = curvature(points, c);
  let fd = curvature(points, d);
  for (let iter = 0; iter < 40 && b - a > 1e-10; iter++) {
    if (fc > fd) {
      b = d;
      d = c;
      fd = fc;
      c = b - phi * (b - a);
      fc = curvature(points, c);
    } else {
      a = c;
      c = d;
      fc = fd;
      d = a + phi * (b - a);
      fd = curvature(points, d);
    }
  }
  const t = (a + b) / 2;
  return { t, curvature: curvature(points, t) };
};
export {
  arcLength,
  conicToQuadratic,
  controlPointsBounds,
  cubicEvaluate,
  curvature,
  curveCurveIntersections,
  deCasteljau,
  derivative,
  derivative1,
  derivativeControlPoints,
  derivativeN,
  elevateDegree,
  elevateDegreeN,
  evaluate,
  evaluateValues,
  extrema,
  maxCurvature,
  maxCurvaturePoint,
  normal,
  project,
  quadraticEvaluate,
  quadraticToCubic,
  splitControlPoints
};
