import { normalizeRadian } from "./util.js";
const PI2 = Math.PI * 2;
function containStroke(cx, cy, r, startAngle, endAngle, anticlockwise, lineWidth, x, y) {
  if (lineWidth === 0) {
    return false;
  }
  const _l = lineWidth;
  x -= cx;
  y -= cy;
  const d = Math.sqrt(x * x + y * y);
  if (d - _l > r || d + _l < r) {
    return false;
  }
  if (Math.abs(startAngle - endAngle) % PI2 < 1e-4) {
    return true;
  }
  if (anticlockwise) {
    const tmp = startAngle;
    startAngle = normalizeRadian(endAngle);
    endAngle = normalizeRadian(tmp);
  } else {
    startAngle = normalizeRadian(startAngle);
    endAngle = normalizeRadian(endAngle);
  }
  if (startAngle > endAngle) {
    endAngle += PI2;
  }
  let angle = Math.atan2(y, x);
  if (angle < 0) {
    angle += PI2;
  }
  return angle >= startAngle && angle <= endAngle || angle + PI2 >= startAngle && angle + PI2 <= endAngle;
}
export {
  containStroke
};
