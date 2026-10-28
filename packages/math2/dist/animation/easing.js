const Easing = {
  // ---- 线性 ----
  linear: (k) => k,
  // ---- 二次方 (quadratic) ----
  quadraticIn: (k) => k * k,
  quadraticOut: (k) => k * (2 - k),
  quadraticInOut: (k) => {
    if ((k *= 2) < 1) return 0.5 * k * k;
    return -0.5 * (--k * (k - 2) - 1);
  },
  // ---- 三次方 (cubic) ----
  cubicIn: (k) => k * k * k,
  cubicOut: (k) => --k * k * k + 1,
  cubicInOut: (k) => {
    if ((k *= 2) < 1) return 0.5 * k * k * k;
    return 0.5 * ((k -= 2) * k * k + 2);
  },
  // ---- 四次方 (quartic) ----
  quarticIn: (k) => k * k * k * k,
  quarticOut: (k) => 1 - --k * k * k * k,
  quarticInOut: (k) => {
    if ((k *= 2) < 1) return 0.5 * k * k * k * k;
    return -0.5 * ((k -= 2) * k * k * k - 2);
  },
  // ---- 五次方 (quintic) ----
  quinticIn: (k) => k * k * k * k * k,
  quinticOut: (k) => --k * k * k * k * k + 1,
  quinticInOut: (k) => {
    if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
    return 0.5 * ((k -= 2) * k * k * k * k + 2);
  },
  // ---- 正弦 (sinusoidal) ----
  sinusoidalIn: (k) => 1 - Math.cos(k * Math.PI / 2),
  sinusoidalOut: (k) => Math.sin(k * Math.PI / 2),
  sinusoidalInOut: (k) => 0.5 * (1 - Math.cos(Math.PI * k)),
  // ---- 指数 (exponential) ----
  exponentialIn: (k) => k === 0 ? 0 : Math.pow(1024, k - 1),
  exponentialOut: (k) => k === 1 ? 1 : 1 - Math.pow(2, -10 * k),
  exponentialInOut: (k) => {
    if (k === 0) return 0;
    if (k === 1) return 1;
    if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
    return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
  },
  // ---- 圆形 (circular) ----
  circularIn: (k) => 1 - Math.sqrt(1 - k * k),
  circularOut: (k) => Math.sqrt(1 - --k * k),
  circularInOut: (k) => {
    if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
    return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
  },
  // ---- 弹性 (elastic) ----
  elasticIn: (k) => {
    if (k === 0) return 0;
    if (k === 1) return 1;
    const p = 0.3;
    const s = p / 4;
    return -Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p);
  },
  elasticOut: (k) => {
    if (k === 0) return 0;
    if (k === 1) return 1;
    const p = 0.3;
    const s = p / 4;
    return Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
  },
  elasticInOut: (k) => {
    if (k === 0) return 0;
    if (k === 1) return 1;
    const p = 0.3 * 1.5;
    const s = p / 4;
    if ((k *= 2) < 1) {
      return -0.5 * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p);
    }
    return Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
  },
  // ---- 回退 (back) ----
  backIn: (k) => {
    const s = 1.70158;
    return k * k * ((s + 1) * k - s);
  },
  backOut: (k) => {
    const s = 1.70158;
    return --k * k * ((s + 1) * k + s) + 1;
  },
  backInOut: (k) => {
    const s = 1.70158 * 1.525;
    if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
  },
  // ---- 弹跳 (bounce) ----
  bounceIn: (k) => 1 - Easing.bounceOut(1 - k),
  bounceOut: (k) => {
    if (k < 1 / 2.75) return 7.5625 * k * k;
    if (k < 2 / 2.75) return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
    if (k < 2.5 / 2.75) return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
    return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
  },
  bounceInOut: (k) => {
    if (k < 0.5) return Easing.bounceIn(k * 2) * 0.5;
    return Easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
  }
};
function createCubicBezierEasing(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleCurveX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t) => ((ay * t + by) * t + cy) * t;
  const sampleCurveDerivativeX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  const solveCurveX = (x, epsilon = 1e-6) => {
    let t2;
    let a = 0, b = 1;
    for (let i = 0; i < 8; i++) {
      t2 = (a + b) / 2;
      const x22 = sampleCurveX(t2);
      if (Math.abs(x22 - x) < epsilon) return t2;
      if (x > x22) a = t2;
      else b = t2;
    }
    t2 = (a + b) / 2;
    for (let i = 0; i < 4; i++) {
      const dx = sampleCurveDerivativeX(t2);
      if (Math.abs(dx) < 1e-8) break;
      t2 -= (sampleCurveX(t2) - x) / dx;
      t2 = Math.max(0, Math.min(1, t2));
    }
    return t2;
  };
  return (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return sampleCurveY(solveCurveX(t));
  };
}
function resolveEasing(easing) {
  if (typeof easing === "function") return easing;
  if (typeof easing === "string") {
    const fn = Easing[easing];
    return fn ?? Easing.linear;
  }
  if (Array.isArray(easing) && easing.length === 4) {
    return createCubicBezierEasing(easing[0], easing[1], easing[2], easing[3]);
  }
  return Easing.linear;
}
export {
  Easing,
  createCubicBezierEasing,
  resolveEasing
};
