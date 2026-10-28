import { solveQuadratic, solveCubicByCardano } from "./MathUtils.js";
function windingCubicBezier(px, py, p0, p1, p2, p3) {
  const minY = Math.min(p0.y, p1.y, p2.y, p3.y);
  const maxY = Math.max(p0.y, p1.y, p2.y, p3.y);
  if (py < minY || py > maxY) return 0;
  const cay = p3.y - 3 * p2.y + 3 * p1.y - p0.y;
  const cby = 3 * (p2.y - 2 * p1.y + p0.y);
  const ccy = 3 * (p1.y - p0.y);
  const cdy = p0.y - py;
  const roots = solveCubicByCardano(cay, cby, ccy, cdy);
  let wind = 0;
  for (const t of roots) {
    if (t <= 0 || t >= 1) continue;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;
    const x = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x;
    if (x < px) continue;
    const dydt = 3 * cay * t2 + 2 * cby * t + ccy;
    if (dydt > 0) wind += 1;
    else if (dydt < 0) wind -= 1;
  }
  return wind;
}
function windingQuadraticBezier(px, py, p0, p1, p2) {
  const minY = Math.min(p0.y, p1.y, p2.y);
  const maxY = Math.max(p0.y, p1.y, p2.y);
  if (py < minY || py > maxY) return 0;
  const ay = p0.y - 2 * p1.y + p2.y;
  const by = 2 * (p1.y - p0.y);
  const cy = p0.y - py;
  const roots = solveQuadratic(ay, by, cy);
  let wind = 0;
  for (const t of roots) {
    if (t <= 0 || t >= 1) continue;
    const mt = 1 - t;
    const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x;
    if (x < px) continue;
    const dy = 2 * ay * t + by;
    if (dy > 0) wind += 1;
    else if (dy < 0) wind -= 1;
  }
  return wind;
}
function windingLine(x, y, x0, y0, x1, y1) {
  if (y0 === y1) return 0;
  if (y < Math.min(y0, y1) || y >= Math.max(y0, y1)) return 0;
  if (x <= x0 + (x1 - x0) * (y - y0) / (y1 - y0)) {
    return y1 > y0 ? 1 : -1;
  }
  return 0;
}
function windingConic(px, py, p0, p1, p2, w) {
  const minY = Math.min(p0.y, p1.y, p2.y);
  const maxY = Math.max(p0.y, p1.y, p2.y);
  if (py < minY || py > maxY) return 0;
  const nAx = p2.x - 2 * w * p1.x + p0.x, nAy = p2.y - 2 * w * p1.y + p0.y;
  const nBx = 2 * (w * p1.x - p0.x), nBy = 2 * (w * p1.y - p0.y);
  const nCx = p0.x, nCy = p0.y;
  const dA = 2 * (1 - w), dB = 2 * (w - 1), dC = 1;
  const roots = solveQuadratic(nAy - py * dA, nBy - py * dB, nCy - py * dC);
  let wind = 0;
  for (const t of roots) {
    if (t <= 0 || t >= 1) continue;
    const tt = t * t;
    const d = dA * tt + dB * t + dC;
    const x = (nAx * tt + nBx * t + nCx) / d;
    if (x < px) continue;
    const dy = (2 * nAy * t + nBy) * d - (nAy * tt + nBy * t + nCy) * (2 * dA * t + dB);
    if (dy > 0) wind += 1;
    else if (dy < 0) wind -= 1;
  }
  return wind;
}
function tangentLine(px, py, x0, y0, x1, y1, epsilon = 1e-6) {
  const vx = x1 - x0, vy = y1 - y0;
  const len2 = vx * vx + vy * vy;
  const e2 = epsilon * epsilon;
  if (len2 < 1e-20) {
    const dx2 = px - x0, dy2 = py - y0;
    return dx2 * dx2 + dy2 * dy2 <= e2;
  }
  let t = ((px - x0) * vx + (py - y0) * vy) / len2;
  if (t < 0) t = 0;
  else if (t > 1) t = 1;
  const fx = x0 + t * vx, fy = y0 + t * vy;
  const dx = px - fx, dy = py - fy;
  return dx * dx + dy * dy <= e2;
}
function tangentQuad(px, py, p0, p1, p2, epsilon = 1e-6) {
  const e2 = epsilon * epsilon;
  const ax = p0.x - 2 * p1.x + p2.x, ay = p0.y - 2 * p1.y + p2.y;
  const bx = 2 * (p1.x - p0.x), by = 2 * (p1.y - p0.y);
  const cx = p0.x, cy = p0.y;
  const dx = px - cx, dy = py - cy;
  const aa = ax * ax + ay * ay;
  const ab = ax * bx + ay * by;
  const bb = bx * bx + by * by;
  const da = dx * ax + dy * ay;
  const db = dx * bx + dy * by;
  const roots = solveCubicByCardano(2 * aa, 3 * ab, bb - 2 * da, -db);
  let minD2 = Infinity;
  for (const t of roots) {
    if (t < 0 || t > 1) continue;
    const mt = 1 - t;
    const qx = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x;
    const qy = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y;
    const ox = px - qx, oy = py - qy;
    const d2 = ox * ox + oy * oy;
    if (d2 < minD2) minD2 = d2;
  }
  for (const [ex, ey] of [[p0.x, p0.y], [p2.x, p2.y]]) {
    const ox = px - ex, oy = py - ey;
    const d2 = ox * ox + oy * oy;
    if (d2 < minD2) minD2 = d2;
  }
  return minD2 <= e2;
}
function tangentCubic(px, py, p0, p1, p2, p3, epsilon = 1e-6) {
  const e2 = epsilon * epsilon;
  const c0x = p0.x, c0y = p0.y;
  const c1x = 3 * (p1.x - p0.x), c1y = 3 * (p1.y - p0.y);
  const c2x = 3 * (p2.x - 2 * p1.x + p0.x), c2y = 3 * (p2.y - 2 * p1.y + p0.y);
  const c3x = p3.x - 3 * p2.x + 3 * p1.x - p0.x, c3y = p3.y - 3 * p2.y + 3 * p1.y - p0.y;
  const evalQ = (t2) => {
    const qx2 = c0x + t2 * (c1x + t2 * (c2x + t2 * c3x));
    const qy2 = c0y + t2 * (c1y + t2 * (c2y + t2 * c3y));
    const qpx = c1x + t2 * (2 * c2x + t2 * 3 * c3x);
    const qpy = c1y + t2 * (2 * c2y + t2 * 3 * c3y);
    return [qx2, qy2, qpx, qpy];
  };
  const N = 16;
  let t = 0, bestD2 = Infinity;
  for (let i = 0; i <= N; i++) {
    const s = i / N;
    const [qx2, qy2] = evalQ(s);
    const ox2 = px - qx2, oy2 = py - qy2;
    const d2 = ox2 * ox2 + oy2 * oy2;
    if (d2 < bestD2) {
      bestD2 = d2;
      t = s;
    }
  }
  for (let i = 0; i < 12; i++) {
    const [qx2, qy2, qpx, qpy] = evalQ(t);
    const ox2 = px - qx2, oy2 = py - qy2;
    const qppx = 2 * c2x + 6 * c3x * t;
    const qppy = 2 * c2y + 6 * c3y * t;
    const g = ox2 * qpx + oy2 * qpy;
    const gp = -(qpx * qpx + qpy * qpy) + (ox2 * qppx + oy2 * qppy);
    if (Math.abs(gp) < 1e-20) break;
    t -= g / gp;
    if (t < 0) t = 0;
    else if (t > 1) t = 1;
    if (Math.abs(g) < 1e-14) break;
  }
  const [qx, qy] = evalQ(t);
  const ox = px - qx, oy = py - qy;
  let minD2 = ox * ox + oy * oy;
  for (const [ex, ey] of [[p0.x, p0.y], [p3.x, p3.y]]) {
    const odx = px - ex, ody = py - ey;
    const d2 = odx * odx + ody * ody;
    if (d2 < minD2) minD2 = d2;
  }
  return minD2 <= e2;
}
function tangentConic(px, py, p0, p1, p2, w, epsilon = 1e-6) {
  const e2 = epsilon * epsilon;
  const nAx = p2.x - 2 * w * p1.x + p0.x, nAy = p2.y - 2 * w * p1.y + p0.y;
  const nBx = 2 * (w * p1.x - p0.x), nBy = 2 * (w * p1.y - p0.y);
  const nCx = p0.x, nCy = p0.y;
  const dA = 2 * (1 - w), dB = 2 * (w - 1), dC = 1;
  const nppx = 2 * nAx, nppy = 2 * nAy, dpp = 2 * dA;
  const N = 16;
  let t = 0, bestD2 = Infinity;
  for (let i = 0; i <= N; i++) {
    const s = i / N, ss = s * s;
    const d2 = dA * ss + dB * s + dC;
    const qx2 = (nAx * ss + nBx * s + nCx) / d2;
    const qy2 = (nAy * ss + nBy * s + nCy) / d2;
    const ox2 = px - qx2, oy2 = py - qy2;
    const d22 = ox2 * ox2 + oy2 * oy2;
    if (d22 < bestD2) {
      bestD2 = d22;
      t = s;
    }
  }
  for (let i = 0; i < 12; i++) {
    const tt2 = t * t;
    const d2 = dA * tt2 + dB * t + dC;
    const dp = 2 * dA * t + dB;
    const nx = nAx * tt2 + nBx * t + nCx, ny = nAy * tt2 + nBy * t + nCy;
    const npx = 2 * nAx * t + nBx, npy = 2 * nAy * t + nBy;
    const fx = px * d2 - nx, fy = py * d2 - ny;
    const fpx = px * dp - npx, fpy = py * dp - npy;
    const tx = npx * d2 - nx * dp, ty = npy * d2 - ny * dp;
    const tpx = nppx * d2 - nx * dpp, tpy = nppy * d2 - ny * dpp;
    const g = fx * tx + fy * ty;
    const gp = fpx * tx + fpy * ty + (fx * tpx + fy * tpy);
    if (Math.abs(gp) < 1e-20) break;
    t -= g / gp;
    if (t < 0) t = 0;
    else if (t > 1) t = 1;
    if (Math.abs(g) < 1e-14) break;
  }
  const tt = t * t;
  const d = dA * tt + dB * t + dC;
  const qx = (nAx * tt + nBx * t + nCx) / d;
  const qy = (nAy * tt + nBy * t + nCy) / d;
  const ox = px - qx, oy = py - qy;
  let minD2 = ox * ox + oy * oy;
  for (const [ex, ey] of [[p0.x, p0.y], [p2.x, p2.y]]) {
    const odx = px - ex, ody = py - ey;
    const d2 = odx * odx + ody * ody;
    if (d2 < minD2) minD2 = d2;
  }
  return minD2 <= e2;
}
export {
  tangentConic,
  tangentCubic,
  tangentLine,
  tangentQuad,
  windingConic,
  windingCubicBezier,
  windingLine,
  windingQuadraticBezier
};
