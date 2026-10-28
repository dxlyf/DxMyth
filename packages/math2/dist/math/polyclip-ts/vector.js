const crossProduct = (a, b) => a.x.times(b.y).minus(a.y.times(b.x));
const dotProduct = (a, b) => a.x.times(b.x).plus(a.y.times(b.y));
const length = (v) => dotProduct(v, v).sqrt();
const sineOfAngle = (pShared, pBase, pAngle) => {
  const vBase = { x: pBase.x.minus(pShared.x), y: pBase.y.minus(pShared.y) };
  const vAngle = { x: pAngle.x.minus(pShared.x), y: pAngle.y.minus(pShared.y) };
  return crossProduct(vAngle, vBase).div(length(vAngle)).div(length(vBase));
};
const cosineOfAngle = (pShared, pBase, pAngle) => {
  const vBase = { x: pBase.x.minus(pShared.x), y: pBase.y.minus(pShared.y) };
  const vAngle = { x: pAngle.x.minus(pShared.x), y: pAngle.y.minus(pShared.y) };
  return dotProduct(vAngle, vBase).div(length(vAngle)).div(length(vBase));
};
const horizontalIntersection = (pt, v, y) => {
  if (v.y.isZero()) return null;
  return { x: pt.x.plus(v.x.div(v.y).times(y.minus(pt.y))), y };
};
const verticalIntersection = (pt, v, x) => {
  if (v.x.isZero()) return null;
  return { x, y: pt.y.plus(v.y.div(v.x).times(x.minus(pt.x))) };
};
const intersection = (pt1, v1, pt2, v2) => {
  if (v1.x.isZero()) return verticalIntersection(pt2, v2, pt1.x);
  if (v2.x.isZero()) return verticalIntersection(pt1, v1, pt2.x);
  if (v1.y.isZero()) return horizontalIntersection(pt2, v2, pt1.y);
  if (v2.y.isZero()) return horizontalIntersection(pt1, v1, pt2.y);
  const kross = crossProduct(v1, v2);
  if (kross.isZero()) return null;
  const ve = { x: pt2.x.minus(pt1.x), y: pt2.y.minus(pt1.y) };
  const d1 = crossProduct(ve, v1).div(kross);
  const d2 = crossProduct(ve, v2).div(kross);
  const x1 = pt1.x.plus(d2.times(v1.x)), x2 = pt2.x.plus(d1.times(v2.x));
  const y1 = pt1.y.plus(d2.times(v1.y)), y2 = pt2.y.plus(d1.times(v2.y));
  const x = x1.plus(x2).div(2);
  const y = y1.plus(y2).div(2);
  return { x, y };
};
export {
  cosineOfAngle,
  crossProduct,
  dotProduct,
  horizontalIntersection,
  intersection,
  length,
  sineOfAngle,
  verticalIntersection
};
