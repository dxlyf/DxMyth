var ClipType = /* @__PURE__ */ ((ClipType2) => {
  ClipType2[ClipType2["NoClip"] = 0] = "NoClip";
  ClipType2[ClipType2["Intersection"] = 1] = "Intersection";
  ClipType2[ClipType2["Union"] = 2] = "Union";
  ClipType2[ClipType2["Difference"] = 3] = "Difference";
  ClipType2[ClipType2["Xor"] = 4] = "Xor";
  return ClipType2;
})(ClipType || {});
var PathType = /* @__PURE__ */ ((PathType2) => {
  PathType2[PathType2["Subject"] = 0] = "Subject";
  PathType2[PathType2["Clip"] = 1] = "Clip";
  return PathType2;
})(PathType || {});
var FillRule = /* @__PURE__ */ ((FillRule2) => {
  FillRule2[FillRule2["EvenOdd"] = 0] = "EvenOdd";
  FillRule2[FillRule2["NonZero"] = 1] = "NonZero";
  FillRule2[FillRule2["Positive"] = 2] = "Positive";
  FillRule2[FillRule2["Negative"] = 3] = "Negative";
  return FillRule2;
})(FillRule || {});
var PointInPolygonResult = /* @__PURE__ */ ((PointInPolygonResult2) => {
  PointInPolygonResult2[PointInPolygonResult2["IsOn"] = 0] = "IsOn";
  PointInPolygonResult2[PointInPolygonResult2["IsInside"] = 1] = "IsInside";
  PointInPolygonResult2[PointInPolygonResult2["IsOutside"] = 2] = "IsOutside";
  return PointInPolygonResult2;
})(PointInPolygonResult || {});
const maxSafeInteger = Number.MAX_SAFE_INTEGER;
const maxDeltaForSafeProduct = Math.floor(Math.sqrt(maxSafeInteger));
function isSafeProduct(a, b) {
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b)) return false;
  if (a === 0 || b === 0) return true;
  return Math.abs(a) <= maxSafeInteger / Math.abs(b);
}
function isSafeSum(a, b) {
  return Math.abs(a) + Math.abs(b) <= maxSafeInteger;
}
function safeMultiplyDifference(a, b, c, d) {
  if (isSafeProduct(a, b) && isSafeProduct(c, d)) {
    const prod1 = a * b;
    const prod2 = c * d;
    if (isSafeSum(prod1, prod2)) {
      return prod1 - prod2;
    }
  }
  if (Number.isSafeInteger(a) && Number.isSafeInteger(b) && Number.isSafeInteger(c) && Number.isSafeInteger(d)) {
    return Number(BigInt(a) * BigInt(b) - BigInt(c) * BigInt(d));
  }
  return a * b - c * d;
}
function safeMultiplySum(a, b, c, d) {
  if (isSafeProduct(a, b) && isSafeProduct(c, d)) {
    const prod1 = a * b;
    const prod2 = c * d;
    if (isSafeSum(prod1, prod2)) {
      return prod1 + prod2;
    }
  }
  if (Number.isSafeInteger(a) && Number.isSafeInteger(b) && Number.isSafeInteger(c) && Number.isSafeInteger(d)) {
    return Number(BigInt(a) * BigInt(b) + BigInt(c) * BigInt(d));
  }
  return a * b + c * d;
}
const B0 = BigInt(0);
const B2 = BigInt(2);
const B4 = BigInt(4);
const B64 = BigInt(64);
const UINT64_MASK = BigInt("0xFFFFFFFFFFFFFFFF");
const IC_MaxInt64 = BigInt("9223372036854775807");
const IC_MaxCoord = Number(IC_MaxInt64 / B4);
const IC_Invalid64 = Number(IC_MaxInt64);
const IC_floatingPointTolerance = 1e-12;
const IC_defaultMinimumEdgeLength = 0.1;
const IC_maxCoordForSafeAreaProduct = Math.floor(maxDeltaForSafeProduct / 2);
const IC_maxCoordForSafeCrossSq = Math.floor(Math.sqrt(Math.sqrt(maxSafeInteger / 4)));
function maxSafeCoordinateForScale(scale) {
  if (!Number.isFinite(scale)) {
    throw new RangeError("Scale must be a finite number");
  }
  const absScale = Math.abs(scale);
  if (absScale === 0) return Number.POSITIVE_INFINITY;
  return maxSafeInteger / absScale;
}
function checkSafeScaleValue(value, maxAbs, context) {
  if (!Number.isFinite(value) || Math.abs(value) > maxAbs) {
    throw new RangeError(`Scaled coordinate exceeds Number.MAX_SAFE_INTEGER in ${context}`);
  }
}
function ensureSafeInteger(value, context) {
  if (!Number.isFinite(value) || Math.abs(value) > maxSafeInteger) {
    throw new RangeError(`Coordinate exceeds Number.MAX_SAFE_INTEGER in ${context}`);
  }
}
function crossProduct(pt1, pt2, pt3) {
  const a = pt2.x - pt1.x;
  const b = pt3.y - pt2.y;
  const c = pt2.y - pt1.y;
  const d = pt3.x - pt2.x;
  if (Math.abs(a) < maxDeltaForSafeProduct && Math.abs(b) < maxDeltaForSafeProduct && Math.abs(c) < maxDeltaForSafeProduct && Math.abs(d) < maxDeltaForSafeProduct) {
    return a * b - c * d;
  }
  return safeMultiplyDifference(a, b, c, d);
}
function crossProductSign(pt1, pt2, pt3) {
  const a = pt2.x - pt1.x;
  const b = pt3.y - pt2.y;
  const c = pt2.y - pt1.y;
  const d = pt3.x - pt2.x;
  if (Math.abs(a) < maxDeltaForSafeProduct && Math.abs(b) < maxDeltaForSafeProduct && Math.abs(c) < maxDeltaForSafeProduct && Math.abs(d) < maxDeltaForSafeProduct) {
    const prod1 = a * b;
    const prod2 = c * d;
    return prod1 > prod2 ? 1 : prod1 < prod2 ? -1 : 0;
  }
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || !Number.isSafeInteger(c) || !Number.isSafeInteger(d)) {
    const prod1 = a * b;
    const prod2 = c * d;
    return prod1 > prod2 ? 1 : prod1 < prod2 ? -1 : 0;
  }
  const bigProd1 = BigInt(a) * BigInt(b);
  const bigProd2 = BigInt(c) * BigInt(d);
  if (bigProd1 === bigProd2) return 0;
  return bigProd1 > bigProd2 ? 1 : -1;
}
function checkPrecision(precision) {
  if (precision < -8 || precision > 8) {
    throw new Error("Error: Precision is out of range.");
  }
}
function isAlmostZero(value) {
  return Math.abs(value) <= IC_floatingPointTolerance;
}
function triSign(x) {
  return x < 0 ? -1 : x > 0 ? 1 : 0;
}
function multiplyUInt64(a, b) {
  const aBig = BigInt(a);
  const bBig = BigInt(b);
  const res = aBig * bBig;
  return {
    lo64: res & UINT64_MASK,
    hi64: res >> B64
  };
}
function productsAreEqual(a, b, c, d) {
  const absA = Math.abs(a);
  const absB = Math.abs(b);
  const absC = Math.abs(c);
  const absD = Math.abs(d);
  if (absA < maxDeltaForSafeProduct && absB < maxDeltaForSafeProduct && absC < maxDeltaForSafeProduct && absD < maxDeltaForSafeProduct) {
    return a * b === c * d;
  }
  const signAb = (a < 0 ? -1 : a > 0 ? 1 : 0) * (b < 0 ? -1 : b > 0 ? 1 : 0);
  const signCd = (c < 0 ? -1 : c > 0 ? 1 : 0) * (d < 0 ? -1 : d > 0 ? 1 : 0);
  if (signAb !== signCd) return false;
  if (signAb === 0) return true;
  if (!Number.isSafeInteger(absA) || !Number.isSafeInteger(absB) || !Number.isSafeInteger(absC) || !Number.isSafeInteger(absD)) {
    return a * b === c * d;
  }
  const bigA = BigInt(absA);
  const bigB = BigInt(absB);
  const bigC = BigInt(absC);
  const bigD = BigInt(absD);
  return bigA * bigB === bigC * bigD;
}
function isCollinear(pt1, sharedPt, pt2) {
  const a = sharedPt.x - pt1.x;
  const b = pt2.y - sharedPt.y;
  const c = sharedPt.y - pt1.y;
  const d = pt2.x - sharedPt.x;
  return productsAreEqual(a, b, c, d);
}
function dotProduct(pt1, pt2, pt3) {
  const a = pt2.x - pt1.x;
  const b = pt3.x - pt2.x;
  const c = pt2.y - pt1.y;
  const d = pt3.y - pt2.y;
  if (Math.abs(a) < maxDeltaForSafeProduct && Math.abs(b) < maxDeltaForSafeProduct && Math.abs(c) < maxDeltaForSafeProduct && Math.abs(d) < maxDeltaForSafeProduct) {
    return a * b + c * d;
  }
  return safeMultiplySum(a, b, c, d);
}
function dotProductSign(pt1, pt2, pt3) {
  const a = pt2.x - pt1.x;
  const b = pt3.x - pt2.x;
  const c = pt2.y - pt1.y;
  const d = pt3.y - pt2.y;
  if (Math.abs(a) < maxDeltaForSafeProduct && Math.abs(b) < maxDeltaForSafeProduct && Math.abs(c) < maxDeltaForSafeProduct && Math.abs(d) < maxDeltaForSafeProduct) {
    const sum = a * b + c * d;
    return sum > 0 ? 1 : sum < 0 ? -1 : 0;
  }
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || !Number.isSafeInteger(c) || !Number.isSafeInteger(d)) {
    const sum = a * b + c * d;
    return sum > 0 ? 1 : sum < 0 ? -1 : 0;
  }
  const bigSum = BigInt(a) * BigInt(b) + BigInt(c) * BigInt(d);
  if (bigSum === B0) return 0;
  return bigSum > B0 ? 1 : -1;
}
function icArea(path) {
  const cnt = path.length;
  if (cnt < 3) return 0;
  let allSmall = true;
  for (let i = 0; i < cnt && allSmall; i++) {
    const pt = path[i];
    if (Math.abs(pt.x) >= IC_maxCoordForSafeAreaProduct || Math.abs(pt.y) >= IC_maxCoordForSafeAreaProduct) {
      allSmall = false;
    }
  }
  let prevPt = path[cnt - 1];
  if (allSmall) {
    let total = 0;
    for (const pt of path) {
      total += (prevPt.y + pt.y) * (prevPt.x - pt.x);
      prevPt = pt;
    }
    return total * 0.5;
  }
  let totalBig = B0;
  for (const pt of path) {
    const sum = prevPt.y + pt.y;
    const diff = prevPt.x - pt.x;
    if (Number.isSafeInteger(sum) && Number.isSafeInteger(diff)) {
      totalBig += BigInt(sum) * BigInt(diff);
    } else if (Number.isSafeInteger(prevPt.y) && Number.isSafeInteger(pt.y) && Number.isSafeInteger(prevPt.x) && Number.isSafeInteger(pt.x)) {
      const sumBig = BigInt(prevPt.y) + BigInt(pt.y);
      const diffBig = BigInt(prevPt.x) - BigInt(pt.x);
      totalBig += sumBig * diffBig;
    } else {
      totalBig += BigInt(Math.round(sum * diff));
    }
    prevPt = pt;
  }
  return Number(totalBig) * 0.5;
}
function crossProductD(vec1, vec2) {
  return vec1.y * vec2.x - vec2.y * vec1.x;
}
function dotProductD(vec1, vec2) {
  return vec1.x * vec2.x + vec1.y * vec2.y;
}
function roundToEven(value) {
  const r = Math.round(value);
  if (value === r - 0.5 && (r & 1) !== 0) return r - 1;
  return r;
}
function checkCastInt64(val) {
  if (val >= IC_MaxCoord || val <= -IC_MaxCoord) return IC_Invalid64;
  return Math.round(val);
}
function getLineIntersectPt(ln1a, ln1b, ln2a, ln2b) {
  const dy1 = ln1b.y - ln1a.y;
  const dx1 = ln1b.x - ln1a.x;
  const dy2 = ln2b.y - ln2a.y;
  const dx2 = ln2b.x - ln2a.x;
  const det = safeMultiplyDifference(dy1, dx2, dy2, dx1);
  if (det === 0) {
    return null;
  }
  const t = safeMultiplyDifference(
    ln1a.x - ln2a.x,
    dy2,
    ln1a.y - ln2a.y,
    dx2
  ) / det;
  if (t <= 0) {
    return { x: ln1a.x, y: ln1a.y, z: ln1a.z || 0 };
  } else if (t >= 1) {
    return { x: ln1b.x, y: ln1b.y, z: ln1b.z || 0 };
  } else {
    return {
      x: Math.trunc(ln1a.x + t * dx1),
      y: Math.trunc(ln1a.y + t * dy1),
      z: 0
    };
  }
}
function getLineIntersectPtD(ln1a, ln1b, ln2a, ln2b) {
  const dy1 = ln1b.y - ln1a.y;
  const dx1 = ln1b.x - ln1a.x;
  const dy2 = ln2b.y - ln2a.y;
  const dx2 = ln2b.x - ln2a.x;
  const det = dy1 * dx2 - dy2 * dx1;
  if (det === 0) {
    return { success: false, ip: { x: 0, y: 0, z: 0 } };
  }
  const t = ((ln1a.x - ln2a.x) * dy2 - (ln1a.y - ln2a.y) * dx2) / det;
  let ip;
  if (t <= 0) {
    ip = { ...ln1a, z: 0 };
  } else if (t >= 1) {
    ip = { ...ln1b, z: 0 };
  } else {
    ip = {
      x: ln1a.x + t * dx1,
      y: ln1a.y + t * dy1,
      z: 0
    };
  }
  return { success: true, ip };
}
function segsIntersect(seg1a, seg1b, seg2a, seg2b, inclusive = false) {
  if (!inclusive) {
    const s1 = crossProductSign(seg1a, seg2a, seg2b);
    const s2 = crossProductSign(seg1b, seg2a, seg2b);
    const s3 = crossProductSign(seg2a, seg1a, seg1b);
    const s4 = crossProductSign(seg2b, seg1a, seg1b);
    return s1 !== 0 && s2 !== 0 && s1 !== s2 && (s3 !== 0 && s4 !== 0 && s3 !== s4);
  }
  const res1 = crossProductSign(seg1a, seg2a, seg2b);
  const res2 = crossProductSign(seg1b, seg2a, seg2b);
  if (res1 !== 0 && res1 === res2) return false;
  const res3 = crossProductSign(seg2a, seg1a, seg1b);
  const res4 = crossProductSign(seg2b, seg1a, seg1b);
  if (res3 !== 0 && res3 === res4) return false;
  return res1 !== 0 || res2 !== 0 || res3 !== 0 || res4 !== 0;
}
function icGetBounds(path) {
  if (path.length === 0) return { left: 0, top: 0, right: 0, bottom: 0 };
  const result = {
    left: Number.MAX_SAFE_INTEGER,
    top: Number.MAX_SAFE_INTEGER,
    right: Number.MIN_SAFE_INTEGER,
    bottom: Number.MIN_SAFE_INTEGER
  };
  for (const pt of path) {
    if (pt.x < result.left) result.left = pt.x;
    if (pt.x > result.right) result.right = pt.x;
    if (pt.y < result.top) result.top = pt.y;
    if (pt.y > result.bottom) result.bottom = pt.y;
  }
  return result.left === Number.MAX_SAFE_INTEGER ? { left: 0, top: 0, right: 0, bottom: 0 } : result;
}
function getClosestPtOnSegment(offPt, seg1, seg2) {
  if (seg1.x === seg2.x && seg1.y === seg2.y) return { x: seg1.x, y: seg1.y, z: 0 };
  const dx = seg2.x - seg1.x;
  const dy = seg2.y - seg1.y;
  const q = safeMultiplySum(offPt.x - seg1.x, dx, offPt.y - seg1.y, dy) / safeMultiplySum(dx, dx, dy, dy);
  const qClamped = q < 0 ? 0 : q > 1 ? 1 : q;
  return {
    // use Math.round to match the C# MidpointRounding.ToEven behavior
    x: Math.round(seg1.x + qClamped * dx),
    y: Math.round(seg1.y + qClamped * dy),
    z: 0
  };
}
function icPointInPolygon(pt, polygon) {
  const len = polygon.length;
  let start = 0;
  if (len < 3) return 2;
  while (start < len && polygon[start].y === pt.y) start++;
  if (start === len) return 2;
  let isAbove = polygon[start].y < pt.y;
  const startingAbove = isAbove;
  let val = 0;
  let i = start + 1;
  let end = len;
  while (true) {
    if (i === end) {
      if (end === 0 || start === 0) break;
      end = start;
      i = 0;
    }
    if (isAbove) {
      while (i < end && polygon[i].y < pt.y) i++;
    } else {
      while (i < end && polygon[i].y > pt.y) i++;
    }
    if (i === end) continue;
    const curr = polygon[i];
    const prev = i > 0 ? polygon[i - 1] : polygon[len - 1];
    if (curr.y === pt.y) {
      if (curr.x === pt.x || curr.y === prev.y && pt.x < prev.x !== pt.x < curr.x) {
        return 0;
      }
      i++;
      if (i === start) break;
      continue;
    }
    if (pt.x < curr.x && pt.x < prev.x) ;
    else if (pt.x > prev.x && pt.x > curr.x) {
      val = 1 - val;
    } else {
      const cps2 = crossProductSign(prev, curr, pt);
      if (cps2 === 0) return 0;
      if (cps2 < 0 === isAbove) val = 1 - val;
    }
    isAbove = !isAbove;
    i++;
  }
  if (isAbove === startingAbove) {
    return val === 0 ? 2 : 1;
  }
  if (i === len) i = 0;
  const cps = i === 0 ? crossProductSign(polygon[len - 1], polygon[0], pt) : crossProductSign(polygon[i - 1], polygon[i], pt);
  if (cps === 0) return 0;
  if (cps < 0 === isAbove) val = 1 - val;
  return val === 0 ? 2 : 1;
}
function path2ContainsPath1(path1, path2) {
  let pip = 0;
  for (const pt of path1) {
    switch (icPointInPolygon(pt, path2)) {
      case 2:
        if (pip === 2) return false;
        pip = 2;
        break;
      case 1:
        if (pip === 1) return true;
        pip = 1;
        break;
    }
  }
  const mp = icGetBounds(path1);
  let midX, midY;
  if (Number.isSafeInteger(mp.left) && Number.isSafeInteger(mp.right) && Math.abs(mp.left) + Math.abs(mp.right) > Number.MAX_SAFE_INTEGER) {
    midX = Number((BigInt(mp.left) + BigInt(mp.right)) / B2);
    midY = Number((BigInt(mp.top) + BigInt(mp.bottom)) / B2);
  } else {
    midX = Math.round((mp.left + mp.right) / 2);
    midY = Math.round((mp.top + mp.bottom) / 2);
  }
  const midPt = { x: midX, y: midY };
  return icPointInPolygon(midPt, path2) !== 2;
}
const InternalClipper = {
  MaxInt64: IC_MaxInt64,
  MaxCoord: IC_MaxCoord,
  max_coord: IC_MaxCoord,
  min_coord: -IC_MaxCoord,
  Invalid64: IC_Invalid64,
  floatingPointTolerance: IC_floatingPointTolerance,
  defaultMinimumEdgeLength: IC_defaultMinimumEdgeLength,
  maxCoordForSafeAreaProduct: IC_maxCoordForSafeAreaProduct,
  maxCoordForSafeCrossSq: IC_maxCoordForSafeCrossSq,
  maxSafeCoordinateForScale,
  checkSafeScaleValue,
  ensureSafeInteger,
  crossProduct,
  crossProductSign,
  checkPrecision,
  isAlmostZero,
  triSign,
  multiplyUInt64,
  productsAreEqual,
  isCollinear,
  dotProduct,
  dotProductSign,
  area: icArea,
  crossProductD,
  dotProductD,
  roundToEven,
  checkCastInt64,
  getLineIntersectPt,
  getLineIntersectPtD,
  segsIntersect,
  getBounds: icGetBounds,
  getClosestPtOnSegment,
  pointInPolygon: icPointInPolygon,
  path2ContainsPath1
};
const Point64Utils = {
  create(x = 0, y = 0, z = 0) {
    return { x: Math.round(x), y: Math.round(y), z };
  },
  fromPointD(pt) {
    InternalClipper.ensureSafeInteger(pt.x, "Point64Utils.fromPointD");
    InternalClipper.ensureSafeInteger(pt.y, "Point64Utils.fromPointD");
    return { x: Math.round(pt.x), y: Math.round(pt.y), z: pt.z || 0 };
  },
  scale(pt, scale) {
    return {
      x: Math.round(pt.x * scale),
      y: Math.round(pt.y * scale),
      z: pt.z || 0
    };
  },
  equals(a, b) {
    return a.x === b.x && a.y === b.y;
  },
  add(a, b) {
    if (Number.isSafeInteger(a.x) && Number.isSafeInteger(b.x) && Number.isSafeInteger(a.y) && Number.isSafeInteger(b.y)) {
      const sumX = a.x + b.x;
      const sumY = a.y + b.y;
      if (Number.isSafeInteger(sumX) && Number.isSafeInteger(sumY)) {
        return { x: sumX, y: sumY, z: 0 };
      }
      return {
        x: Number(BigInt(a.x) + BigInt(b.x)),
        y: Number(BigInt(a.y) + BigInt(b.y)),
        z: 0
      };
    }
    return { x: a.x + b.x, y: a.y + b.y, z: 0 };
  },
  subtract(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: 0 };
  },
  toString(pt) {
    if (pt.z !== void 0 && pt.z !== 0) {
      return `${pt.x},${pt.y},${pt.z} `;
    }
    return `${pt.x},${pt.y} `;
  }
};
const PointDUtils = {
  create(x = 0, y = 0, z = 0) {
    return { x, y, z };
  },
  fromPoint64(pt) {
    return { x: pt.x, y: pt.y, z: pt.z || 0 };
  },
  scale(pt, scale) {
    return { x: pt.x * scale, y: pt.y * scale, z: pt.z || 0 };
  },
  equals(a, b) {
    return InternalClipper.isAlmostZero(a.x - b.x) && InternalClipper.isAlmostZero(a.y - b.y);
  },
  negate(pt) {
    pt.x = -pt.x;
    pt.y = -pt.y;
  },
  toString(pt, precision = 2) {
    if (pt.z !== void 0 && pt.z !== 0) {
      return `${pt.x.toFixed(precision)},${pt.y.toFixed(precision)},${pt.z}`;
    }
    return `${pt.x.toFixed(precision)},${pt.y.toFixed(precision)}`;
  }
};
const Rect64Utils = {
  create(l = 0, t = 0, r = 0, b = 0) {
    return { left: l, top: t, right: r, bottom: b };
  },
  createInvalid() {
    return {
      left: Number.MAX_SAFE_INTEGER,
      top: Number.MAX_SAFE_INTEGER,
      right: Number.MIN_SAFE_INTEGER,
      bottom: Number.MIN_SAFE_INTEGER
    };
  },
  width(rect) {
    return rect.right - rect.left;
  },
  height(rect) {
    return rect.bottom - rect.top;
  },
  isEmpty(rect) {
    return rect.bottom <= rect.top || rect.right <= rect.left;
  },
  isValid(rect) {
    return rect.left < Number.MAX_SAFE_INTEGER;
  },
  midPoint(rect) {
    if (Number.isSafeInteger(rect.left) && Number.isSafeInteger(rect.right) && Math.abs(rect.left) + Math.abs(rect.right) > Number.MAX_SAFE_INTEGER) {
      const midX = Number((BigInt(rect.left) + BigInt(rect.right)) / B2);
      const midY = Number((BigInt(rect.top) + BigInt(rect.bottom)) / B2);
      return { x: midX, y: midY };
    }
    return {
      x: Math.round((rect.left + rect.right) / 2),
      y: Math.round((rect.top + rect.bottom) / 2)
    };
  },
  contains(rect, pt) {
    return pt.x > rect.left && pt.x < rect.right && pt.y > rect.top && pt.y < rect.bottom;
  },
  containsRect(rect, rec) {
    return rec.left >= rect.left && rec.right <= rect.right && rec.top >= rect.top && rec.bottom <= rect.bottom;
  },
  intersects(rect, rec) {
    return Math.max(rect.left, rec.left) <= Math.min(rect.right, rec.right) && Math.max(rect.top, rec.top) <= Math.min(rect.bottom, rec.bottom);
  },
  asPath(rect) {
    return [
      { x: rect.left, y: rect.top, z: 0 },
      { x: rect.right, y: rect.top, z: 0 },
      { x: rect.right, y: rect.bottom, z: 0 },
      { x: rect.left, y: rect.bottom, z: 0 }
    ];
  }
};
const RectDUtils = {
  create(l = 0, t = 0, r = 0, b = 0) {
    return { left: l, top: t, right: r, bottom: b };
  },
  createInvalid() {
    return {
      left: Number.MAX_VALUE,
      top: Number.MAX_VALUE,
      right: -Number.MAX_VALUE,
      bottom: -Number.MAX_VALUE
    };
  },
  width(rect) {
    return rect.right - rect.left;
  },
  height(rect) {
    return rect.bottom - rect.top;
  },
  isEmpty(rect) {
    return rect.bottom <= rect.top || rect.right <= rect.left;
  },
  midPoint(rect) {
    return {
      x: (rect.left + rect.right) / 2,
      y: (rect.top + rect.bottom) / 2
    };
  },
  contains(rect, pt) {
    return pt.x > rect.left && pt.x < rect.right && pt.y > rect.top && pt.y < rect.bottom;
  },
  containsRect(rect, rec) {
    return rec.left >= rect.left && rec.right <= rect.right && rec.top >= rect.top && rec.bottom <= rect.bottom;
  },
  intersects(rect, rec) {
    return Math.max(rect.left, rec.left) < Math.min(rect.right, rec.right) && Math.max(rect.top, rec.top) < Math.min(rect.bottom, rec.bottom);
  },
  asPath(rect) {
    return [
      { x: rect.left, y: rect.top, z: 0 },
      { x: rect.right, y: rect.top, z: 0 },
      { x: rect.right, y: rect.bottom, z: 0 },
      { x: rect.left, y: rect.bottom, z: 0 }
    ];
  }
};
const PathUtils = {
  toString64(path) {
    let result = "";
    for (const pt of path) {
      result += Point64Utils.toString(pt);
    }
    return result + "\n";
  },
  toStringD(path, precision = 2) {
    let result = "";
    for (const pt of path) {
      result += PointDUtils.toString(pt, precision) + ", ";
    }
    if (result !== "") result = result.slice(0, -2);
    return result;
  },
  reverse64(path) {
    return [...path].reverse();
  },
  reverseD(path) {
    return [...path].reverse();
  }
};
const PathsUtils = {
  toString64(paths) {
    let result = "";
    for (const path of paths) {
      result += PathUtils.toString64(path);
    }
    return result;
  },
  toStringD(paths, precision = 2) {
    let result = "";
    for (const path of paths) {
      result += PathUtils.toStringD(path, precision) + "\n";
    }
    return result;
  },
  reverse64(paths) {
    return paths.map((path) => PathUtils.reverse64(path));
  },
  reverseD(paths) {
    return paths.map((path) => PathUtils.reverseD(path));
  }
};
const InvalidRect64 = Object.freeze(Rect64Utils.createInvalid());
const InvalidRectD = Object.freeze(RectDUtils.createInvalid());
export {
  ClipType,
  FillRule,
  InternalClipper,
  InvalidRect64,
  InvalidRectD,
  PathType,
  PathUtils,
  PathsUtils,
  Point64Utils,
  PointDUtils,
  PointInPolygonResult,
  Rect64Utils,
  RectDUtils
};
