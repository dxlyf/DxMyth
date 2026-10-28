function lerp(a, b, t) {
  return a + (b - a) * t;
}
function lerpObject(a, b, t) {
  const result = {};
  for (const key in a) {
    if (Object.prototype.hasOwnProperty.call(a, key)) {
      result[key] = lerp(a[key], b[key] ?? a[key], t);
    }
  }
  return result;
}
function lerpArray(a, b, t, out = []) {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    out[i] = lerp(a[i] ?? 0, b[i] ?? 0, t);
  }
  return out;
}
function lerpArray2D(a, b, t, out = []) {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (!out[i]) out[i] = [];
    const rowA = a[i] ?? [];
    const rowB = b[i] ?? [];
    const rowLen = Math.max(rowA.length, rowB.length);
    for (let j = 0; j < rowLen; j++) {
      out[i][j] = lerp(rowA[j] ?? 0, rowB[j] ?? 0, t);
    }
  }
  return out;
}
function lerpColor(a, b, t, out = []) {
  for (let i = 0; i < 4; i++) {
    out[i] = lerp(a[i] ?? 0, b[i] ?? 0, t);
  }
  return out;
}
function isNumberValue(v) {
  return typeof v === "number" && !isNaN(v);
}
function isNumberArray(v) {
  return Array.isArray(v) && v.length > 0 && typeof v[0] === "number";
}
function isNumberArray2D(v) {
  return Array.isArray(v) && v.length > 0 && Array.isArray(v[0]) && typeof v[0][0] === "number";
}
function interpolateValue(a, b, t) {
  if (isNumberValue(a) && isNumberValue(b)) {
    return lerp(a, b, t);
  }
  if (isNumberArray(a) && isNumberArray(b)) {
    return lerpArray(a, b, t);
  }
  if (isNumberArray2D(a) && isNumberArray2D(b)) {
    return lerpArray2D(a, b, t);
  }
  return t < 1 ? a : b;
}
export {
  interpolateValue,
  isNumberArray,
  isNumberArray2D,
  isNumberValue,
  lerp,
  lerpArray,
  lerpArray2D,
  lerpColor,
  lerpObject
};
