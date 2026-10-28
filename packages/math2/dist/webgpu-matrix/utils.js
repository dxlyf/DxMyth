let EPSILON = 1e-6;
function setEpsilon(v) {
  const old = EPSILON;
  EPSILON = v;
  return old;
}
function degToRad(degrees) {
  return degrees * Math.PI / 180;
}
function radToDeg(radians) {
  return radians * 180 / Math.PI;
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function inverseLerp(a, b, v) {
  const d = b - a;
  return Math.abs(b - a) < EPSILON ? a : (v - a) / d;
}
function euclideanModulo(n, m) {
  return (n % m + m) % m;
}
export {
  EPSILON,
  degToRad,
  euclideanModulo,
  inverseLerp,
  lerp,
  radToDeg,
  setEpsilon
};
