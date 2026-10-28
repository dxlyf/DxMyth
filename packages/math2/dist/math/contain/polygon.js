import windingLine from "./windingLine.js";
const EPSILON = 1e-8;
function isAroundEqual(a, b) {
  return Math.abs(a - b) < EPSILON;
}
function contain(points, x, y) {
  let w = 0;
  let p = points[0];
  if (!p) {
    return false;
  }
  for (let i = 1; i < points.length; i++) {
    const p2 = points[i];
    w += windingLine(p[0], p[1], p2[0], p2[1], x, y);
    p = p2;
  }
  const p0 = points[0];
  if (!isAroundEqual(p[0], p0[0]) || !isAroundEqual(p[1], p0[1])) {
    w += windingLine(p[0], p[1], p0[0], p0[1], x, y);
  }
  return w !== 0;
}
export {
  contain
};
