import { Vector2 } from "./Vector2.js";
const EPSILON = 1e-6;
const PI = Math.PI;
const PI_2 = PI / 2;
const PI_4 = PI / 4;
const TWO_PI = PI * 2;
const DEG_TO_RAD = PI / 180;
const RAD_TO_DEG = 180 / PI;
const degToRad = (deg) => {
  return deg * DEG_TO_RAD;
};
const radToDeg = (rad) => {
  return rad * RAD_TO_DEG;
};
function isNearZero(v, eps = EPSILON) {
  return Math.abs(v) < eps;
}
const equalsEpsilon = (a, b, epsilon = EPSILON) => {
  return isNearZero(a - b, epsilon);
};
const equals = (a, b) => {
  return a === b;
};
const isFinite = (v) => {
  return Number.isFinite(v);
};
const interpolate = (a, b, t) => {
  return a + (b - a) * t;
};
function inverseLerp(start, end, value) {
  return (value - start) / (end - start);
}
const random = (min, max) => {
  return min + Math.random() * (max - min);
};
const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};
const smoothStep = (start, end, value) => {
  const t = (value - start) / (end - start);
  return clamp(t * t * (3 * t - 2), 0, 1);
};
const mix = (start, end, value) => {
  return clamp((value - start) / (end - start), 0, 1);
};
function findIndexRight(arr, predicate, thisArg) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate.call(thisArg, arr[i], i, arr)) {
      return i;
    }
  }
}
function as_signed(value, bits = 32) {
  var s = 32 - bits;
  return value << s >> s;
}
function as_unsigned(value, bits = 32) {
  var s = 32 - bits;
  return value << s >>> s;
}
function calcLowBit(value) {
  return value & -value;
}
function calcHighBit(value) {
  let bit = calc32Shift(value);
  return value >>> bit << bit;
}
function includeBit(value, bit) {
  return (value & bit) === bit;
}
function removeBit(value, bit) {
  return value & ~bit;
}
function calcBitIndex(value) {
  return Math.trunc(Math.log2(value));
}
function calc32Shift(value) {
  return 31 - Math.clz32(value);
}
function calcArcGoldenRatio(delta) {
  return 4 / 3 * Math.tan(delta / 4);
}
function calcArcCubicBezierSteps(sweepAngle) {
  return Math.ceil(Math.abs(sweepAngle) / PI);
}
function arcStepCount(sweep, radius, tol) {
  const r = Math.max(1e-6, radius);
  const ratio = Math.max(-1, Math.min(1, 1 - tol / r));
  const maxStep = 2 * Math.acos(ratio);
  return Math.min(2048, Math.max(2, Math.ceil(Math.abs(sweep) / Math.max(1e-4, maxStep))));
}
function worldToScreen(vp, wx, wy) {
  return { x: wx * vp.zoom + vp.offset.x, y: wy * vp.zoom + vp.offset.y };
}
function screenToWorld(vp, sx, sy) {
  return { x: (sx - vp.offset.x) / vp.zoom, y: (sy - vp.offset.y) / vp.zoom };
}
function zoomAt(vp, sx, sy, next, min, max) {
  const zoom = next < min ? min : next > max ? max : next;
  const a = screenToWorld(vp, sx, sy);
  return { zoom, offset: { x: sx - a.x * zoom, y: sy - a.y * zoom } };
}
const calcZoomPan = (out, oldScale, newScale, offset, origin) => {
  const scale = newScale / oldScale;
  const dx = offset.x - origin.x;
  const dy = offset.y - origin.y;
  out.x = origin.x + dx * scale;
  out.y = origin.y + dy * scale;
  return out;
};
function map(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
const sign = (x) => {
  return x > 0 ? 1 : x === 0 ? 0 : -1;
};
const absSign = (x) => {
  return x > 0 ? 1 : x === 0 ? Object.is(x, 0) ? 1 : -1 : -1;
};
const randomFloor = (min, max) => {
  return Math.floor(min + (max - min) * Math.random());
};
const randomCeil = (min, max) => {
  return Math.ceil(min + (max - min) * Math.random());
};
const randomRound = (min, max) => {
  return Math.round(min + (max - min) * Math.random());
};
const fract = (v) => {
  return v - Math.trunc(v);
};
const ceilMod = (v, m) => {
  return v - Math.ceil(v / m) * m;
};
const floorMod = (v, m) => {
  return v - Math.floor(v / m) * m;
};
const truncMod = (v, m) => {
  return v - Math.trunc(v / m) * m;
};
const calcStartCoordinateValue = (unit, offset, scalar) => {
  return ceilMod(offset, unit * scalar);
};
const calcStartGraduationValue = (unit, offset, scalar) => {
  return -Math.ceil(offset / (unit * scalar)) * unit;
};
const generateGraduations = (options) => {
  const { width, height, tickSplitHeight, tickMarkHeight, rulerUnit, offset, tickSplitStep, scaleFactor } = options;
};
function dcmp(x, eps = 1e-6) {
  if (Math.abs(x) < eps) {
    return 0;
  }
  return x < 0 ? -1 : 1;
}
const deCasteljauBezier = (out, controls, t) => {
  const n = controls.length - 1;
  if (n === 0) return { x: 0, y: 0 };
  if (n === 1) return { x: controls[0].x, y: controls[0].y };
  const c = controls.map((d) => ({ x: d.x, y: d.y }));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i; j++) {
      c[j].x = (1 - t) * c[j].x + t * c[j + 1].x;
      c[j].y = (1 - t) * c[j].y + t * c[j + 1].y;
    }
  }
  out.x = c[0].x;
  out.y = c[0].y;
  return out;
};
const summation = (i, n, add) => {
  let sum = 0;
  for (; i <= n; i++) {
    sum += add(sum, i, n);
  }
  return sum;
};
const bernstein = (n, i, t) => {
  return nCr(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
};
const rationalBezier = (out, controls, weight, t) => {
  const n = controls.length - 1;
  let x = 0, y = 0, den = 0;
  for (let i = 0; i <= n; i++) {
    let b = bernstein(n, i, t) * weight[i];
    x += b * controls[i].x;
    y += b * controls[i].y;
    den += b;
  }
  if (den === 0) {
    out.x = 0;
    out.y = 0;
    return out;
  }
  out.x = x / den;
  out.y = y / den;
  return out;
};
const wheelToScaleArtboard = (out, oldScale, newScale, offset, mouse) => {
  out.x = mouse.x - (mouse.x - offset.x) * (newScale / oldScale);
  out.y = mouse.y - (mouse.y - offset.y) * (newScale / oldScale);
  return out;
};
const factorialCache = [1, 1];
const factorial = (n) => {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  if (factorialCache[n] !== void 0) {
    return factorialCache[n];
  }
  let result = factorialCache[factorialCache.length - 1];
  for (let i = factorialCache.length; i <= n; i++) {
    result *= i;
    factorialCache[i] = result;
  }
  return result;
};
function binomialCoefficient(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result *= (n - (k - i)) / i;
  }
  return Math.round(result);
}
var AngleType = /* @__PURE__ */ ((AngleType2) => {
  AngleType2[AngleType2["Nearly180"] = 0] = "Nearly180";
  AngleType2[AngleType2["Sharp"] = 1] = "Sharp";
  AngleType2[AngleType2["Shallow"] = 2] = "Shallow";
  AngleType2[AngleType2["NearlyLine"] = 3] = "NearlyLine";
  return AngleType2;
})(AngleType || {});
function isNearlyZero(value, epsilon = 1e-6) {
  return Math.abs(value) <= epsilon;
}
function dotToAngleType(dot) {
  if (dot >= 0) {
    if (isNearlyZero(1 - dot)) {
      return 3;
    } else {
      return 2;
    }
  } else {
    if (isNearlyZero(1 + dot)) {
      return 0;
    } else {
      return 1;
    }
  }
}
const nCr = (n, k) => {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n - k) {
    k = n - k;
  }
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = result * (n - i + 1) / i;
  }
  return result;
};
const nPr = (n, k) => {
  if (k < 0 || k > n) return 0;
  if (k === 0) return 1;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result *= n - i;
  }
  return result;
};
function solveQuadratic(a, b, c) {
  if (isNearZero(a)) {
    if (isNearZero(b)) return [];
    return [-c / b];
  }
  const delta = b * b - 4 * a * c;
  if (delta < -EPSILON) return [];
  if (isNearZero(delta)) {
    return [-b / (2 * a)];
  }
  const sqrtDelta = Math.sqrt(delta);
  return [(-b - sqrtDelta) / (2 * a), (-b + sqrtDelta) / (2 * a)];
}
function solveCubicByCardano(a, b, c, d) {
  if (isNearZero(a)) return solveQuadratic(b, c, d);
  const A = b / a;
  const B = c / a;
  const C = d / a;
  const p = B - A * A / 3;
  const q = C - A * B / 3 + 2 * A * A * A / 27;
  const offset = -A / 3;
  const delta = q / 2 * (q / 2) + p / 3 * (p / 3) * (p / 3);
  const roots = [];
  if (delta > EPSILON) {
    const sqrtDelta = Math.sqrt(delta);
    const u = Math.cbrt(-q / 2 + sqrtDelta);
    const v = Math.cbrt(-q / 2 - sqrtDelta);
    roots.push(u + v + offset);
  } else if (isNearZero(delta)) {
    const u = Math.cbrt(-q / 2);
    roots.push(2 * u + offset);
    roots.push(-u + offset);
  } else {
    const r = Math.sqrt(-(p / 3) * (p / 3) * (p / 3));
    const theta = Math.acos(-q / (2 * r));
    const sqrtP = Math.sqrt(-p / 3);
    for (let k = 0; k < 3; k++) {
      roots.push(2 * sqrtP * Math.cos((theta + 2 * Math.PI * k) / 3) + offset);
    }
  }
  return roots.sort((a2, b2) => a2 - b2);
}
function solveCubicByShengjin(a, b, c, d) {
  if (isNearZero(a)) return solveQuadratic(b, c, d);
  const A = b * b - 3 * a * c;
  const B = b * c - 9 * a * d;
  const C = c * c - 3 * b * d;
  const delta = B * B - 4 * A * C;
  if (isNearZero(A) && isNearZero(B)) {
    return [-b / (3 * a)];
  }
  if (delta > EPSILON) {
    const y1 = A * b + 3 * a * ((-B + Math.sqrt(delta)) / 2);
    const y2 = A * b + 3 * a * ((-B - Math.sqrt(delta)) / 2);
    const x = (-b - (Math.cbrt(y1) + Math.cbrt(y2))) / (3 * a);
    return [x];
  }
  if (isNearZero(delta)) {
    const K = B / A;
    const x1 = -b / a + K;
    const x2 = -K / 2;
    return [x1, x2].sort((a2, b2) => a2 - b2);
  }
  const T = (2 * A * b - 3 * a * B) / (2 * Math.sqrt(A * A * A));
  const theta = Math.acos(T);
  const sqrtA = Math.sqrt(A);
  const roots = [];
  for (let k = 0; k < 3; k++) {
    const x = (-b - 2 * sqrtA * Math.cos((theta + 2 * Math.PI * k) / 3)) / (3 * a);
    roots.push(x);
  }
  return roots.sort((a2, b2) => a2 - b2);
}
const getIntersectionGridCell = (options) => {
  const { start, dir, rows, cols, cellWidth, cellHeight, onCollisionDetection } = options;
  const cellSize = Vector2.create(cellWidth, cellHeight);
  const coord = start.clone().divide(cellSize);
  const mapCoord = coord.clone().floor();
  const offset = coord.clone().subtract(mapCoord);
  const sign2 = dir.clone().sign();
  const deltaX = dir.x === 0 ? 1e30 : Math.abs(1 / dir.x);
  const deltaY = dir.y === 0 ? 1e30 : Math.abs(1 / dir.y);
  let sideDistX = sign2.x === 1 ? (1 - offset.x) * deltaX : offset.x * deltaX;
  let sideDistY = sign2.y === 1 ? (1 - offset.y) * deltaY : offset.y * deltaY;
  const intersections = [];
  let side = false;
  let count = rows * cols;
  while (count--) {
    if (sideDistX < sideDistY) {
      side = true;
      mapCoord.x += sign2.x;
    } else {
      side = false;
      mapCoord.y += sign2.y;
    }
    let col = mapCoord.x;
    let row = mapCoord.y;
    if (side) {
      let x = start.x + sideDistX * cellWidth * dir.x;
      let y = start.y + sideDistX * cellWidth * dir.y;
      intersections.push(Vector2.create(x, y));
      sideDistX += deltaX;
    } else {
      let x = start.x + sideDistY * cellHeight * dir.x;
      let y = start.y + sideDistY * cellHeight * dir.y;
      intersections.push(Vector2.create(x, y));
      sideDistY += deltaY;
    }
    if (col < 0 || col >= cols || row < 0 || row >= rows || onCollisionDetection?.(mapCoord.x, mapCoord.y)) {
      break;
    }
  }
  return intersections;
};
const getRays3D = (player, map2, fovAngle, width, height, cellSize, fish = true) => {
  const rays = [];
  const fovRad = fovAngle / 180 * Math.PI;
  const fov = Math.tan(fovRad * 0.5);
  const origin = Vector2.create(player.x, player.y);
  for (let i = 0; i <= width; i++) {
    const theta = fov * (i / width * 2 - 1) + player.rotate;
    const dir = Vector2.fromRotation(theta);
    const deltaX = dir.x === 0 ? 1e30 : Math.abs(1 / dir.x);
    const deltaY = dir.y === 0 ? 1e30 : Math.abs(1 / dir.y);
    let col = origin.x / cellSize >> 0;
    let row = origin.y / cellSize >> 0;
    let x = origin.x / cellSize - col;
    let y = origin.y / cellSize - row;
    let sideDistX = dir.x > 0 ? (1 - x) * deltaX : x * deltaX;
    let sideDistY = dir.y > 0 ? (1 - y) * deltaY : y * deltaY;
    let side = false;
    while (true) {
      if (sideDistX < sideDistY) {
        side = true;
        sideDistX += deltaX;
        col += Math.sign(dir.x);
      } else {
        side = false;
        sideDistY += deltaY;
        row += Math.sign(dir.y);
      }
      if (map2[row][col] > 0) {
        break;
      }
    }
    let distance = side ? sideDistX - deltaX : sideDistY - deltaY;
    const target = dir.multiplyScalar(distance * cellSize).add(origin);
    let noFishDistance = distance * Math.cos(theta - player.rotate);
    let lightDiffuse = Math.max(0, Math.cos(fov * (i / width * 2 - 1)));
    rays.push({
      diffuse: Math.pow(lightDiffuse, 64),
      x: i,
      row,
      col,
      value: map2[row][col],
      side,
      dir,
      origin,
      distance,
      // 格子距离
      noFishDistance,
      target
    });
  }
  return rays;
};
export {
  AngleType,
  DEG_TO_RAD,
  EPSILON,
  PI,
  PI_2,
  PI_4,
  RAD_TO_DEG,
  TWO_PI,
  absSign,
  arcStepCount,
  as_signed,
  as_unsigned,
  bernstein,
  binomialCoefficient,
  calc32Shift,
  calcArcCubicBezierSteps,
  calcArcGoldenRatio,
  calcBitIndex,
  calcHighBit,
  calcLowBit,
  calcStartCoordinateValue,
  calcStartGraduationValue,
  calcZoomPan,
  ceilMod,
  clamp,
  dcmp,
  deCasteljauBezier,
  degToRad,
  dotToAngleType,
  equals,
  equalsEpsilon,
  factorial,
  findIndexRight,
  floorMod,
  fract,
  generateGraduations,
  getIntersectionGridCell,
  getRays3D,
  includeBit,
  interpolate,
  inverseLerp,
  isFinite,
  isNearlyZero,
  map,
  mix,
  nCr,
  nPr,
  radToDeg,
  random,
  randomCeil,
  randomFloor,
  randomRound,
  rationalBezier,
  removeBit,
  screenToWorld,
  sign,
  smoothStep,
  solveCubicByCardano,
  solveCubicByShengjin,
  solveQuadratic,
  summation,
  truncMod,
  wheelToScaleArtboard,
  worldToScreen,
  zoomAt
};
