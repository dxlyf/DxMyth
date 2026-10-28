const EPS = 1e-9;
class Geometry {
  /** 点是否在边界上（epsilon 容差，无宽度） */
  isPointOnBoundary(x, y, epsilon = EPS) {
    return Math.abs(this.signedDistance(x, y)) <= epsilon;
  }
  /**
   * 点是否在描边带内
   * - center: 描边以边界为中心，内外各 lineWidth/2
   * - inner : 描边向内偏移，整条宽度位于图形内部一侧
   * - outer : 描边向外偏移，整条宽度位于图形外部一侧
   */
  isPointOnStroke(x, y, lineWidth, strokeAlign = "center") {
    const d = this.signedDistance(x, y);
    const half = lineWidth * 0.5;
    switch (strokeAlign) {
      case "center":
        return Math.abs(d) <= half;
      case "inner":
        return d >= 0 && d <= lineWidth;
      case "outer":
        return d <= 0 && d >= -lineWidth;
    }
    return false;
  }
}
function distPointToSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const ab2 = abx * abx + aby * aby;
  let t = ab2 > 0 ? (apx * abx + apy * aby) / ab2 : 0;
  if (t < 0) t = 0;
  else if (t > 1) t = 1;
  const cx = ax + t * abx;
  const cy = ay + t * aby;
  const dx = px - cx;
  const dy = py - cy;
  return Math.sqrt(dx * dx + dy * dy);
}
function distPointToSegmentSquared(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const ab2 = abx * abx + aby * aby;
  let t = ab2 > 0 ? (apx * abx + apy * aby) / ab2 : 0;
  if (t < 0) t = 0;
  else if (t > 1) t = 1;
  const cx = ax + t * abx;
  const cy = ay + t * aby;
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy;
}
function signedDistPointToLine(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const ab2 = abx * abx + aby * aby;
  let t = ab2 > 0 ? (apx * abx + apy * aby) / ab2 : 0;
  if (t < 0) t = 0;
  else if (t > 1) t = 1;
  const cx = ax + t * abx;
  const cy = ay + t * aby;
  const dx = px - cx;
  const dy = py - cy;
  const sign = abx * apy - aby * apx >= 0 ? 1 : -1;
  return sign * Math.sqrt(dx * dx + dy * dy);
}
function arcSegmentCount(radius, sweep, tolerance = 0.25) {
  if (sweep <= 0 || radius <= 0) return 0;
  const ratio = tolerance / radius;
  if (ratio >= 1) {
    return Math.max(1, Math.ceil(sweep / (Math.PI / 2)));
  }
  const maxStep = 2 * Math.acos(Math.max(-1, Math.min(1, 1 - ratio)));
  return Math.max(1, Math.ceil(sweep / maxStep));
}
function normalizeAnglePositive(a) {
  const TAU = Math.PI * 2;
  let r = a % TAU;
  if (r < 0) r += TAU;
  return r;
}
function isAngleInRange(angle, start, end, ccw) {
  let s = normalizeAnglePositive(start);
  let e = normalizeAnglePositive(end);
  let a = normalizeAnglePositive(angle);
  if (!ccw) {
    const t = s;
    s = e;
    e = t;
  }
  if (s <= e) {
    return a >= s - 1e-9 && a <= e + 1e-9;
  }
  return a >= s - 1e-9 || a <= e + 1e-9;
}
function angleDelta(a, b) {
  const TAU = Math.PI * 2;
  let d = (b - a) % TAU;
  if (d < -Math.PI) d += TAU;
  else if (d > Math.PI) d -= TAU;
  return Math.abs(d);
}
export {
  Geometry,
  angleDelta,
  arcSegmentCount,
  distPointToSegment,
  distPointToSegmentSquared,
  isAngleInRange,
  normalizeAnglePositive,
  signedDistPointToLine
};
