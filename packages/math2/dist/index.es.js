function cr(o, e, n = !1) {
  const s = Math.PI * 2;
  let i = o % s;
  i <= 0 && (i += s);
  let r = i - o;
  return o = i, e += r, !n && e - o >= s ? e = o + s : n && o - e >= s ? e = o - s : !n && o > e ? e = o + (s - (o - e) % s) : n && o < e && (e = o - (s - (e - o) % s)), { startAngle: o, endAngle: e };
}
function Ha(o) {
  let { x1: e, y1: n, x2: s, y2: i, rx: r, ry: c, xAxisRotation: a, largeArcFlag: l, sweepFlag: h } = o;
  const u = Math.sin(a), f = Math.cos(a), d = (e - s) / 2, y = (n - i) / 2, x = f * d + u * y, g = -u * d + f * y;
  let w = r * r, M = c * c;
  const P = x * x, S = g * g, k = P / w + S / M;
  if (k > 1) {
    const ct = Math.sqrt(k);
    r *= ct, c *= ct, w = r * r, M = c * c;
  }
  const O = (w * M - w * S - M * P) / (w * S + M * P), R = (l === h ? -1 : 1) * Math.sqrt(O), F = R * (r * g / c), Y = R * (-c * x / r), N = f * F - u * Y + (e + s) / 2, $ = u * F + f * Y + (n + i) / 2, W = so(1, 0, (x - F) / r, (g - Y) / c);
  let Q = so(
    (x - F) / r,
    (g - Y) / c,
    (-x - F) / r,
    (-g - Y) / c
  );
  return !h && Q > 0 ? Q -= 2 * Math.PI : h && Q < 0 && (Q += 2 * Math.PI), { cx: N, cy: $, rx: r, ry: c, startAngle: W, sweepAngle: Q, xAxisRotation: a };
}
function _f(o) {
  const { cx: e, cy: n, rx: s, ry: i, startAngle: r, sweepAngle: c, xAxisRotation: a } = o, l = Math.sin(a), h = Math.cos(a), u = r + c, f = s * Math.cos(r), d = i * Math.sin(r), y = s * Math.cos(u), x = i * Math.sin(u), g = h * f - l * d + e, w = l * f + h * d + n, M = h * y - l * x + e, P = l * y + h * x + n, S = Math.abs(c) > Math.PI, k = c > 0;
  return { x1: g, y1: w, x2: M, y2: P, largeArcFlag: S, sweepFlag: k };
}
function Tf(o) {
  const e = Ha(o);
  return {
    cx: e.cx,
    cy: e.cy,
    rx: e.rx,
    ry: e.ry,
    startAngle: e.startAngle,
    endAngle: e.startAngle + e.sweepAngle,
    counterclockwise: e.sweepAngle < 0,
    xAxisRotation: e.xAxisRotation
  };
}
function Ba(o, e, n, s, i, r, c) {
  const a = Math.sin(i), l = Math.cos(i), h = 4 / 3 * Math.tan(c / 4), u = Math.cos(r), f = Math.sin(r), d = Math.cos(r + c), y = Math.sin(r + c), x = n * u, g = s * f, w = n * d, M = s * y, P = x + h * (-n * f), S = g + h * (s * u), k = w - h * (-n * y), O = M - h * (s * d), R = {
    x: l * x - a * g + o,
    y: a * x + l * g + e
  }, F = {
    x: l * P - a * S + o,
    y: a * P + l * S + e
  }, Y = {
    x: l * k - a * O + o,
    y: a * k + l * O + e
  }, N = {
    x: l * w - a * M + o,
    y: a * w + l * M + e
  };
  return { p1: R, cp1: F, cp2: Y, p2: N };
}
function Pf(o, e, n, s, i = 0, r, c, a = !1, l = Math.PI / 2) {
  const h = [], { startAngle: u, endAngle: f } = cr(r, c, a), d = f - u, y = Math.max(1, Math.ceil(Math.abs(d) / l)), x = d / y;
  let g = u;
  for (let w = 0; w < y; w++) {
    const M = Ba(o, e, n, s, i, g, x);
    h.push(M), g += x;
  }
  return h;
}
function so(o, e, n, s) {
  const i = o * n + e * s, r = o * s - e * n;
  return Math.atan2(r, i);
}
const Hs = 1e-6, Bs = Math.PI, Af = Bs / 2, Ef = Bs / 4, Lf = Bs * 2, Ya = Bs / 180, Va = 180 / Bs, Ua = (o) => o * Ya, Xa = (o) => o * Va;
function Xe(o, e = Hs) {
  return Math.abs(o) < e;
}
const Sf = (o, e, n = Hs) => Xe(o - e, n), If = (o, e) => o === e, qf = (o) => Number.isFinite(o), Df = (o, e, n) => o + (e - o) * n, Of = (o, e) => o + Math.random() * (e - o), nn = (o, e, n) => Math.max(e, Math.min(n, o)), kf = (o) => o * o * (3 * o - 2), Rf = (o, e, n) => nn((o - e) / (n - e), 0, 1), Dn = [1, 1], Ff = (o) => {
  if (o < 0) return NaN;
  if (o === 0 || o === 1) return 1;
  if (Dn[o] !== void 0)
    return Dn[o];
  let e = Dn[Dn.length - 1];
  for (let n = Dn.length; n <= o; n++)
    e *= n, Dn[n] = e;
  return e;
}, Wa = (o, e) => {
  if (e < 0 || e > o) return 0;
  if (e === 0 || e === o) return 1;
  e > o - e && (e = o - e);
  let n = 1;
  for (let s = 1; s <= e; s++)
    n = n * (o - s + 1) / s;
  return n;
}, zf = (o, e) => {
  if (e < 0 || e > o) return 0;
  if (e === 0) return 1;
  let n = 1;
  for (let s = 0; s < e; s++)
    n *= o - s;
  return n;
};
function Qn(o, e, n) {
  if (Xe(o))
    return Xe(e) ? [] : [-n / e];
  const s = e * e - 4 * o * n;
  if (s < -Hs) return [];
  if (Xe(s))
    return [-e / (2 * o)];
  const i = Math.sqrt(s);
  return [(-e - i) / (2 * o), (-e + i) / (2 * o)];
}
function bi(o, e, n, s) {
  if (Xe(o)) return Qn(e, n, s);
  const i = e / o, r = n / o, c = s / o, a = r - i * i / 3, l = c - i * r / 3 + 2 * i * i * i / 27, h = -i / 3, u = l / 2 * (l / 2) + a / 3 * (a / 3) * (a / 3), f = [];
  if (u > Hs) {
    const d = Math.sqrt(u), y = Math.cbrt(-l / 2 + d), x = Math.cbrt(-l / 2 - d);
    f.push(y + x + h);
  } else if (Xe(u)) {
    const d = Math.cbrt(-l / 2);
    f.push(2 * d + h), f.push(-d + h);
  } else {
    const d = Math.sqrt(-(a / 3) * (a / 3) * (a / 3)), y = Math.acos(-l / (2 * d)), x = Math.sqrt(-a / 3);
    for (let g = 0; g < 3; g++)
      f.push(2 * x * Math.cos((y + 2 * Math.PI * g) / 3) + h);
  }
  return f.sort((d, y) => d - y);
}
function Cf(o, e, n, s) {
  if (Xe(o)) return Qn(e, n, s);
  const i = e * e - 3 * o * n, r = e * n - 9 * o * s, c = n * n - 3 * e * s, a = r * r - 4 * i * c;
  if (Xe(i) && Xe(r))
    return [-e / (3 * o)];
  if (a > Hs) {
    const d = i * e + 3 * o * ((-r + Math.sqrt(a)) / 2), y = i * e + 3 * o * ((-r - Math.sqrt(a)) / 2);
    return [(-e - (Math.cbrt(d) + Math.cbrt(y))) / (3 * o)];
  }
  if (Xe(a)) {
    const d = r / i, y = -e / o + d, x = -d / 2;
    return [y, x].sort((g, w) => g - w);
  }
  const l = (2 * i * e - 3 * o * r) / (2 * Math.sqrt(i * i * i)), h = Math.acos(l), u = Math.sqrt(i), f = [];
  for (let d = 0; d < 3; d++) {
    const y = (-e - 2 * u * Math.cos((h + 2 * Math.PI * d) / 3)) / (3 * o);
    f.push(y);
  }
  return f.sort((d, y) => d - y);
}
const ys = (o, e = 1e-10) => Math.abs(o) <= e, _s = (o, e) => {
  const n = o.length;
  if (n === 0) return { x: 0, y: 0 };
  if (n === 1) return { x: o[0].x, y: o[0].y };
  const s = o.map((i) => ({ x: i.x, y: i.y }));
  for (let i = 1; i < n; i++)
    for (let r = 0; r < n - i; r++)
      s[r].x += (s[r + 1].x - s[r].x) * e, s[r].y += (s[r + 1].y - s[r].y) * e;
  return s[0];
}, Br = (o, e) => _s(mc(o), e), mc = (o) => {
  const e = o.length;
  if (e < 2) return [];
  const n = [];
  for (let s = 0; s < e - 1; s++)
    n.push({
      x: (e - 1) * (o[s + 1].x - o[s].x),
      y: (e - 1) * (o[s + 1].y - o[s].y)
    });
  return n;
}, Oi = (o, e, n) => Wa(e, o) * Math.pow(n, o) * Math.pow(1 - n, e - o), $a = (o, e) => {
  const n = o.length - 1;
  let s = 0, i = 0;
  for (let r = 0; r <= n; r++) {
    const c = Oi(r, n, e);
    s += o[r].x * c, i += o[r].y * c;
  }
  return { x: s, y: i };
}, Nf = (o, e) => {
  const n = o.length - 1;
  let s = 0;
  for (let i = 0; i <= n; i++)
    s += o[i] * Oi(i, n, e);
  return s;
}, Hf = (o, e) => {
  const n = o.length - 1;
  if (n < 1) return { x: 0, y: 0 };
  const s = n - 1;
  let i = 0, r = 0;
  for (let c = 0; c <= s; c++) {
    const a = Oi(c, s, e);
    i += (o[c + 1].x - o[c].x) * a, r += (o[c + 1].y - o[c].y) * a;
  }
  return { x: i * n, y: r * n };
}, ja = (o, e, n) => {
  const s = o.length - 1;
  if (e <= 0) return $a(o, n);
  if (e > s) return { x: 0, y: 0 };
  const i = o.map((h) => ({ x: h.x, y: h.y }));
  for (let h = 0; h < e; h++)
    for (let u = 0; u < s - h; u++)
      i[u].x = i[u + 1].x - i[u].x, i[u].y = i[u + 1].y - i[u].y;
  const r = io(s) / io(s - e), c = s - e;
  let a = 0, l = 0;
  for (let h = 0; h <= c; h++) {
    const u = Oi(h, c, n);
    a += i[h].x * u, l += i[h].y * u;
  }
  return { x: a * r, y: l * r };
}, io = (o) => {
  let e = 1;
  for (let n = 2; n <= o; n++) e *= n;
  return e;
}, Bf = (o, e, n, s) => {
  const i = 1 - s;
  return {
    x: i * i * o.x + 2 * i * s * e.x + s * s * n.x,
    y: i * i * o.y + 2 * i * s * e.y + s * s * n.y
  };
}, Yf = (o, e, n, s, i) => {
  const r = 1 - i, c = r * r, a = c * r, l = i * i, h = l * i;
  return {
    x: a * o.x + 3 * c * i * e.x + 3 * r * l * n.x + h * s.x,
    y: a * o.y + 3 * c * i * e.y + 3 * r * l * n.y + h * s.y
  };
}, Vf = (o, e, n) => [
  { x: o.x, y: o.y },
  { x: o.x / 3 + 2 / 3 * e.x, y: o.y / 3 + 2 / 3 * e.y },
  { x: 2 / 3 * e.x + n.x / 3, y: 2 / 3 * e.y + n.y / 3 },
  { x: n.x, y: n.y }
], Uf = (o, e = 16) => {
  let n = 0;
  const s = 1 / e;
  let i = _s(o, 0);
  for (let r = 1; r <= e; r++) {
    const c = r * s, a = _s(o, c), l = a.x - i.x, h = a.y - i.y;
    n += Math.sqrt(l * l + h * h), i = a;
  }
  return n;
}, Xf = (o, e) => {
  const n = Br(o, e), s = Math.sqrt(n.x * n.x + n.y * n.y);
  return s === 0 ? { x: 0, y: 0 } : { x: -n.y / s, y: n.x / s };
}, Ri = (o, e) => {
  const n = o.length;
  if (n < 3) return 0;
  const s = Br(o, e), i = [];
  for (let l = 0; l < n - 2; l++)
    i.push({
      x: (n - 1) * (n - 2) * (o[l + 2].x - 2 * o[l + 1].x + o[l].x),
      y: (n - 1) * (n - 2) * (o[l + 2].y - 2 * o[l + 1].y + o[l].y)
    });
  const r = i.length > 0 ? _s(i, e) : { x: 0, y: 0 }, c = s.x * r.y - s.y * r.x, a = s.x * s.x + s.y * s.y;
  return a === 0 ? 0 : Math.abs(c) / Math.pow(a, 1.5);
}, Wf = (o) => {
  if (o.length - 1 < 1) return [];
  const n = [], s = mc(o), i = (a) => {
    const l = a.length - 1, h = [], u = Math.max(l * 4, 20), f = (y) => {
      const x = a.map((g) => g);
      for (let g = 1; g <= l; g++)
        for (let w = 0; w <= l - g; w++)
          x[w] += (x[w + 1] - x[w]) * y;
      return x[0];
    };
    let d = f(0);
    for (let y = 1; y <= u; y++) {
      const x = y / u, g = f(x);
      if (d * g < 0 || ys(g)) {
        let w = (y - 1) / u, M = x, P = (w + M) / 2;
        if (ys(g))
          x > 0 && x < 1 && h.push(x);
        else {
          for (let S = 0; S < 20 && (P = (w + M) / 2, f(P) * f(w) <= 0 ? M = P : w = P, !(M - w < 1e-10)); S++)
            ;
          P > 0 && P < 1 && h.push(P);
        }
      }
      d = g;
    }
    return h;
  }, r = s.map((a) => a.x);
  for (const a of i(r))
    a > 0 && a < 1 && !n.some((l) => ys(l - a)) && n.push(a);
  const c = s.map((a) => a.y);
  for (const a of i(c))
    a > 0 && a < 1 && !n.some((l) => ys(l - a)) && n.push(a);
  return n.sort((a, l) => a - l);
}, $f = (o, e = 20) => {
  let n = 0, s = -1 / 0;
  for (let f = 0; f <= e; f++) {
    const d = f / e, y = Ri(o, d);
    y > s && (s = y, n = d);
  }
  const i = (Math.sqrt(5) - 1) / 2;
  let r = Math.max(0, n - 1 / e), c = Math.min(1, n + 1 / e), a = c - i * (c - r), l = r + i * (c - r);
  const h = Ri(o, a), u = Ri(o, l);
  for (let f = 0; f < 30 && !(Math.abs(c - r) < 1e-10); f++)
    h > u ? (c = l, l = a, a = c - i * (c - r)) : (r = a, a = l, l = r + i * (c - r));
  return (r + c) / 2;
}, jf = (o, e, n, s = 16, i = 8) => {
  let r = 0, c = 1 / 0;
  const a = (O) => _s(o, O);
  for (let O = 0; O <= s; O++) {
    const R = O / s, F = a(R), Y = F.x - e, N = F.y - n, $ = Y * Y + N * N;
    $ < c && (c = $, r = R);
  }
  let l = r;
  for (let O = 0; O < i; O++) {
    const R = a(l), F = Br(o, l), Y = ja(o, 2, l), N = R.x - e, $ = R.y - n, W = N * F.x + $ * F.y, Q = F.x * F.x + F.y * F.y + N * Y.x + $ * Y.y;
    if (ys(Q)) break;
    l = l - W / Q, l = Math.max(0, Math.min(1, l));
  }
  const h = a(l), u = h.x - e, f = h.y - n, d = u * u + f * f;
  d < c && (c = d);
  const y = a(0), x = a(1), g = y.x - e, w = y.y - n, M = x.x - e, P = x.y - n, S = g * g + w * w, k = M * M + P * P;
  return S < c && (c = S, l = 0), k < c && (c = k, l = 1), { t: l, distance: Math.sqrt(c) };
};
class qn {
  static create(e) {
    return new qn(e);
  }
  pools;
  options;
  constructor(e) {
    this.options = { maxSize: 100, initSize: 0, ...e || {} }, this.pools = [], this.options.initSize > 0 && this.initPoolSize(this.options.initSize);
  }
  initPoolSize(e) {
    for (let n = 0; n < e; n++)
      this.options.add ? this.pools.push(this.options.add()) : this.pools.push(this.options.create());
  }
  get(...e) {
    if (this.pools.length > 0) {
      const n = this.pools.pop();
      return this.options.init?.(n, ...e), n;
    }
    return this.options.create(...e);
  }
  release(e) {
    this.pools.length < this.options.maxSize && (this.options.release?.(e), this.pools.push(e));
  }
}
class ht {
  static pool = qn.create({
    initSize: 20,
    create: () => new ht(0, 0),
    init(e) {
      e.set(0, 0);
    }
  });
  // ---- 静态工厂 ----
  static default() {
    return this.create();
  }
  static create(e = 0, n = 0) {
    return new ht(e, n);
  }
  static zero() {
    return new ht(0, 0);
  }
  static fromPoint(e) {
    return new ht(e.x, e.y);
  }
  static fromValues(e, n) {
    return new ht(e, n);
  }
  static fromScalar(e) {
    return new ht(e, e);
  }
  /** 从夹角 (rad) 创建单位向量 */
  static fromAngle(e) {
    return new ht(Math.cos(e), Math.sin(e));
  }
  /** 从类向量对象创建 */
  static from(e) {
    return new ht(e.x, e.y);
  }
  /** 从数组创建 */
  static fromArray(e) {
    return new ht(e[0], e[1]);
  }
  // ---- 静态运算（out 可复用） ----
  /** out = a + b */
  static add(e, n, s) {
    return e.x = n.x + s.x, e.y = n.y + s.y, e;
  }
  /** out = a - b */
  static subtract(e, n, s) {
    return e.x = n.x - s.x, e.y = n.y - s.y, e;
  }
  static multiply(e, n, s) {
    return e.x = n.x * s.x, e.y = n.y * s.y, e;
  }
  /** out = v * s */
  static multiplyScalar(e, n, s) {
    return e.x = n.x * s, e.y = n.y * s, e;
  }
  /** out = v / s */
  static divide(e, n, s) {
    return e.x = n.x / s, e.y = n.y / s, e;
  }
  /** out = -v */
  static negate(e, n) {
    return e.x = -n.x, e.y = -n.y, e;
  }
  /** out = normalized(v)；零向量时返回零向量 */
  static normalize(e, n) {
    const s = Math.hypot(n.x, n.y);
    return s === 0 ? (e.x = 0, e.y = 0, e) : (e.x = n.x / s, e.y = n.y / s, e);
  }
  /** a · b */
  static dot(e, n) {
    return e.x * n.x + e.y * n.y;
  }
  /** a × b (2D 叉积 = 标量) */
  static cross(e, n) {
    return e.x * n.y - e.y * n.x;
  }
  /** out = a 在 b 上的投影 */
  static project(e, n, s) {
    const i = ht.dot(n, s), r = ht.dot(s, s);
    if (r === 0)
      return e.x = 0, e.y = 0, e;
    const c = i / r;
    return e.x = s.x * c, e.y = s.y * c, e;
  }
  static perp(e, n) {
    return e.x = -n.y, e.y = n.x, e;
  }
  /** out = a 在 b 上的垂直（正交）分量 */
  static perpendicular(e, n, s) {
    const i = ht.pool.get();
    return ht.project(i, n, s), ht.subtract(e, n, i), ht.pool.release(i), e;
  }
  /** out = lerp(a, b, t)；t=0 得 a，t=1 得 b */
  static lerp(e, n, s, i) {
    return e.x = n.x + (s.x - n.x) * i, e.y = n.y + (s.y - n.y) * i, e;
  }
  /** out = a 沿 b 方向按指定距离移动 */
  static moveTo(e, n, s, i) {
    const r = s.x - n.x, c = s.y - n.y, a = Math.hypot(r, c);
    return a === 0 ? (e.x = n.x, e.y = n.y, e) : (e.x = n.x + r / a * i, e.y = n.y + c / a * i, e);
  }
  /** |a - b| */
  static distance(e, n) {
    return Math.hypot(e.x - n.x, e.y - n.y);
  }
  /** |a - b|^2（避免 sqrt） */
  static distanceSquared(e, n) {
    const s = e.x - n.x, i = e.y - n.y;
    return s * s + i * i;
  }
  /** a 和 b 之间的夹角 (rad) */
  static angleBetween(e, n) {
    const s = ht.dot(e, n), i = Math.hypot(e.x, e.y) * Math.hypot(n.x, n.y);
    return i === 0 ? 0 : Math.acos(Math.max(-1, Math.min(1, s / i)));
  }
  static equals(e, n) {
    return e.x === n.x && e.y === n.y;
  }
  /** 判断 a 与 b 是否近似相等 */
  static equalsEpsilon(e, n, s = 1e-9) {
    return Math.abs(e.x - n.x) <= s && Math.abs(e.y - n.y) <= s;
  }
  /** out = min(a, b)（逐分量取最小） */
  static min(e, n, s) {
    return e.x = Math.min(n.x, s.x), e.y = Math.min(n.y, s.y), e;
  }
  /** out = max(a, b)（逐分量取最大） */
  static max(e, n, s) {
    return e.x = Math.max(n.x, s.x), e.y = Math.max(n.y, s.y), e;
  }
  /** out = clamp(v, min, max) */
  static clamp(e, n, s, i) {
    return e.x = Math.max(s.x, Math.min(i.x, n.x)), e.y = Math.max(s.y, Math.min(i.y, n.y)), e;
  }
  /** out = reflect(v, normal)；normal 需为单位向量 */
  static reflect(e, n, s) {
    const i = 2 * ht.dot(n, s);
    return e.x = n.x - i * s.x, e.y = n.y - i * s.y, e;
  }
  /**
   * out = m * v（矩阵变换）
   */
  static applyMatrix2D(e, n, s) {
    const i = n.x, r = n.y;
    return e.x = s[0] * i + s[2] * r + s[4], e.y = s[1] * i + s[3] * r + s[5], e;
  }
  static translate(e, n, s, i) {
    return e.x = n.x + s, e.y = n.y + i, e;
  }
  static rotate(e, n, s) {
    const i = Math.cos(s), r = Math.sin(s), c = n.x, a = n.y;
    return e.x = c * i - a * r, e.y = a * r + c * i, e;
  }
  static scale(e, n, s, i) {
    return e.x = n.x * s, e.y = n.y * i, e;
  }
  /**
   * 计算点到线段的最短距离
   */
  static pointToSegmentDistance(e, n, s) {
    const i = s.x - n.x, r = s.y - n.y, c = i * i + r * r;
    if (c === 0)
      return this.distance(e, n);
    let a = ((e.x - n.x) * i + (e.y - n.y) * r) / c;
    a = Math.max(0, Math.min(1, a));
    const l = n.x + a * i, h = n.y + a * r;
    return this.distance(e, { x: l, y: h });
  }
  /**
   * 计算点到折线的距离
   */
  static pointToPolylineDistance(e, n) {
    if (n.length < 2) return 1 / 0;
    let s = 1 / 0;
    for (let i = 0; i < n.length - 1; i++) {
      const r = this.pointToSegmentDistance(e, n[i], n[i + 1]);
      r < s && (s = r);
    }
    return s;
  }
  /**
   * 判断点是否在线段上（考虑线宽）
   */
  static isPointOnSegment(e, n, s, i) {
    return this.pointToSegmentDistance(e, n, s) <= i / 2;
  }
  /**
   * 计算两条线段的交点
   */
  static segmentIntersection(e, n, s, i) {
    const r = n.x - e.x, c = n.y - e.y, a = i.x - s.x, l = i.y - s.y, h = r * l - c * a;
    if (Math.abs(h) < 1e-10) return null;
    const u = ((s.x - e.x) * l - (s.y - e.y) * a) / h, f = ((s.x - e.x) * c - (s.y - e.y) * r) / h;
    return u >= 0 && u <= 1 && f >= 0 && f <= 1 ? {
      x: e.x + u * r,
      y: e.y + u * c
    } : null;
  }
  // ==================== 实例部分 ====================
  x;
  y;
  constructor(e = 0, n = 0) {
    this.x = e, this.y = n;
  }
  // ---- 写入 ----
  set(e, n) {
    return this.x = e, this.y = n, this;
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this;
  }
  zero() {
    return this.set(0, 0);
  }
  // ---- 运算（委托给静态方法） ----
  add(e) {
    return ht.add(this, this, e), this;
  }
  subtract(e) {
    return ht.subtract(this, this, e), this;
  }
  multiply(e) {
    return ht.multiply(this, this, e), this;
  }
  multiplyScalar(e) {
    return ht.multiplyScalar(this, this, e), this;
  }
  divide(e) {
    return ht.divide(this, this, e), this;
  }
  negate() {
    return ht.negate(this, this), this;
  }
  normalize() {
    return ht.normalize(this, this), this;
  }
  lerp(e, n) {
    return ht.lerp(this, this, e, n), this;
  }
  project(e) {
    return ht.project(this, this, e), this;
  }
  /** this = min(this, v)（逐分量取最小） */
  min(e) {
    return ht.min(this, this, e), this;
  }
  /** this = max(this, v)（逐分量取最大） */
  max(e) {
    return ht.max(this, this, e), this;
  }
  perp() {
    return ht.perp(this, this), this;
  }
  setLengthTo(e, n, s, i) {
    const r = Math.sqrt(e * e + n * n), c = s / r, a = e * c, l = n * c;
    return !Number.isFinite(e) || !Number.isFinite(n) || e == 0 && n == 0 ? (this.set(0, 0), !1) : (i && (i.value = r), this.set(a, l), !0);
  }
  /** 应用矩阵变换 this = m * this */
  applyMatrix2D(e) {
    return ht.applyMatrix2D(this, this, e), this;
  }
  // ---- 查询 ----
  /** 长度 */
  magnitude() {
    return Math.hypot(this.x, this.y);
  }
  /** 长度的平方 */
  magnitudeSquared() {
    return this.x * this.x + this.y * this.y;
  }
  dot(e) {
    return ht.dot(this, e);
  }
  cross(e) {
    return ht.cross(this, e);
  }
  angle(e) {
    return ht.angleBetween(this, e);
  }
  distanceTo(e) {
    return ht.distance(this, e);
  }
  distanceSquaredTo(e) {
    return ht.distanceSquared(this, e);
  }
  translate(e, n) {
    return ht.translate(this, this, e, n);
  }
  scale(e, n) {
    return ht.scale(this, this, e, n);
  }
  rotate(e) {
    return ht.rotate(this, this, e), this;
  }
  equals(e) {
    return ht.equals(this, e);
  }
  equalsEpsilon(e, n) {
    return ht.equalsEpsilon(this, e, n);
  }
  isFinite() {
    return Number.isFinite(this.x) && Number.isFinite(this.y);
  }
  isZero() {
    return this.x === 0 && this.y === 0;
  }
  isOne() {
    return this.x === 1 && this.y === 1;
  }
  // ---- 工具 ----
  clone() {
    return new ht(this.x, this.y);
  }
  toArray() {
    return [this.x, this.y];
  }
  toString() {
    return `Vector2(${this.x}, ${this.y})`;
  }
}
class Lt {
  static pool = qn.create({
    initSize: 10,
    create: () => new Lt(),
    init: (e) => {
      e.setEmpty();
    }
  });
  // ---- 静态工厂 ----
  static default() {
    return new Lt();
  }
  static zero() {
    return new Lt(0, 0, 0, 0);
  }
  /** 从点列表计算包围盒 */
  static fromPoints(e) {
    const n = new Lt();
    for (const s of e)
      n.add(s.x, s.y);
    return n;
  }
  /** 从 (x, y, width, height) 创建 */
  static fromXYWH(e, n, s, i) {
    return new Lt(e, n, e + s, n + i);
  }
  /** 从 (left, top, right, bottom) 创建 */
  static fromLTRB(e, n, s, i) {
    return new Lt(e, n, s, i);
  }
  /** 左下角（最小坐标） */
  min;
  /** 右上角（最大坐标） */
  max;
  constructor(e = 1 / 0, n = 1 / 0, s = -1 / 0, i = -1 / 0) {
    this.min = new ht(e, n), this.max = new ht(s, i);
  }
  // ---- 查询 ----
  get centerX() {
    return (this.min.x + this.max.x) / 2;
  }
  get centerY() {
    return (this.min.y + this.max.y) / 2;
  }
  get minX() {
    return this.min.x;
  }
  get minY() {
    return this.min.y;
  }
  get maxX() {
    return this.max.x;
  }
  get maxY() {
    return this.max.y;
  }
  /** 中心点 */
  get center() {
    return { x: this.centerX, y: this.centerY };
  }
  get left() {
    return this.min.x;
  }
  get top() {
    return this.min.y;
  }
  get right() {
    return this.max.x;
  }
  get bottom() {
    return this.max.y;
  }
  get x() {
    return this.min.x;
  }
  get y() {
    return this.min.y;
  }
  get width() {
    return this.max.x - this.min.x;
  }
  get height() {
    return this.max.y - this.min.y;
  }
  /** 面积 */
  area() {
    return this.width * this.height;
  }
  /** 是否为空（无有效范围） */
  isEmpty() {
    return this.min.x > this.max.x || this.min.y > this.max.y;
  }
  isZero() {
    return this.min.isZero() && this.max.isZero();
  }
  /** 点是否在包围盒内（含边界） */
  // contains(x: number, y: number): boolean {
  //     return x >= this.min.x && x <= this.max.x && y >= this.min.y && y <= this.max.y
  // }
  contains(e, n) {
    return !(e < this.left || e > this.right || n < this.top || n > this.bottom);
  }
  containsPoint(e) {
    return this.contains(e.x, e.y);
  }
  intersectionBox(e) {
    return !(this.left > e.right || this.right < e.left || this.top > e.bottom || this.bottom < e.top);
  }
  /** 是否与另一个包围盒相交 */
  intersects(e) {
    return !(this.max.x < e.min.x || this.min.x > e.max.x || this.max.y < e.min.y || this.min.y > e.max.y);
  }
  // ---- 写入 ----
  /** 重置为空 */
  setEmpty() {
    return this.min.set(1 / 0, 1 / 0), this.max.set(-1 / 0, -1 / 0), this;
  }
  makeEmpty() {
    return this.min.x = this.min.y = 1 / 0, this.max.x = this.max.y = -1 / 0, this;
  }
  makeZero() {
    return this.min.x = this.min.y = 0, this.max.x = this.max.y = 0, this;
  }
  isInfinity() {
    return this.min.x === 1 / 0 || this.min.y === 1 / 0 || this.max.x === -1 / 0 || this.max.y === -1 / 0;
  }
  copy(e) {
    return this.min.copy(e.min), this.max.copy(e.max), this;
  }
  // ---- 扩展 ----
  /** 扩展包围盒以包含指定点 */
  add(e, n) {
    return this.expandPoint({ x: e, y: n }), this;
  }
  fromCircle(e, n, s) {
    return this.min.set(e - s, n - s), this.max.set(e + s, n + s), this;
  }
  fromLine(e, n, s, i, r) {
    const c = s - e, a = i - n, l = Math.sqrt(c * c + a * a);
    if (l === 0) {
      this.makeZero();
      return;
    }
    const h = c / l, f = -(a / l), d = h, y = f * r / 2, x = d * r / 2, g = [
      { x: e - y, y: n - x },
      // 起点左侧
      { x: e + y, y: n + x },
      // 起点右侧
      { x: s - y, y: i - x },
      // 终点左侧
      { x: s + y, y: i + x }
      // 终点右侧
    ];
    return this.fromPoints(g), this;
  }
  fromXYWH(e, n, s, i) {
    this.min.set(e, n), this.max.set(e + s, n + i);
  }
  fromLTRB(e, n, s, i) {
    this.min.set(e, n), this.max.set(s, i);
  }
  fromPoints(e) {
    this.setEmpty();
    for (const n of e)
      this.add(n.x, n.y);
    return this;
  }
  expandPoints(e) {
    return e.forEach((n) => {
      this.expandPoint(n);
    }), this;
  }
  /** 同 add，扩展包围盒以包含指定点 */
  expandPoint(e) {
    return this.min.min(e), this.max.max(e), this;
  }
  translate(e, n) {
    this.min.translate(e, n), this.max.translate(e, n);
  }
  inset(e, n) {
    this.min.translate(e, n), this.max.translate(-e, -n);
  }
  outset(e, n) {
    this.inset(-e, -n);
  }
  /**
   * 联合：将自身扩展为包含 other 的最小包围盒（就地修改）。
   * 等同于 addRect，语义更清晰。
   */
  union(e) {
    return this.min.min(e.min), this.max.max(e.max), this;
  }
  /**
   * 相交：将自身裁剪为与 other 的重叠区域（就地修改）。
   * 若无重叠则变为空包围盒。
   */
  intersect(e) {
    return this.min.max(e.min), this.max.min(e.max), this;
  }
  // ---- 工具 ----
  /**
   * 对包围盒的 min/max 两点分别应用矩阵变换，重新计算轴对齐包围盒。
   * 注意：旋转/倾斜等非轴对齐变换会使包围盒膨胀。
   */
  applyMatrix2D(e) {
    const n = this.min.x, s = this.min.y, i = this.max.x, r = this.max.y, c = ht.pool.get();
    c.set(n, s);
    const a = ht.pool.get();
    a.set(i, s);
    const l = ht.pool.get();
    l.set(i, r);
    const h = ht.pool.get();
    return h.set(n, r), ht.applyMatrix2D(c, c, e), ht.applyMatrix2D(a, a, e), ht.applyMatrix2D(l, l, e), ht.applyMatrix2D(h, h, e), this.setEmpty(), this.add(c.x, c.y).add(a.x, a.y).add(l.x, l.y).add(h.x, h.y), ht.pool.release(c), ht.pool.release(a), ht.pool.release(l), ht.pool.release(h), this;
  }
  clone() {
    const e = new Lt();
    return e.min.copy(this.min), e.max.copy(this.max), e;
  }
  equals(e) {
    return e.min.equals(this.min) && e.max.equals(this.max);
  }
  isValid() {
    return this.left <= this.right && this.top <= this.bottom;
  }
  toString() {
    return `BoundingRect(min=(${this.min.x},${this.min.y}), max=(${this.max.x},${this.max.y}))`;
  }
}
class st {
  static default() {
    return this.create();
  }
  static fromPoint(e) {
    return new st(e.x, e.y);
  }
  static create(e = 0, n = 0) {
    return new st(e, n);
  }
  _x;
  _y;
  _onChange = null;
  constructor(e = 0, n = 0) {
    this._x = e, this._y = n;
  }
  // ---- 属性访问器 ----
  get width() {
    return this._x;
  }
  get height() {
    return this._y;
  }
  set width(e) {
    this._x !== e && (this._x = e, this._onChange?.());
  }
  set height(e) {
    this._y !== e && (this._y = e, this._onChange?.());
  }
  get x() {
    return this._x;
  }
  set x(e) {
    this._x !== e && (this._x = e, this._onChange?.());
  }
  get y() {
    return this._y;
  }
  set y(e) {
    this._y !== e && (this._y = e, this._onChange?.());
  }
  // ---- 变更通知 ----
  /** 注册变更回调，x 或 y 变化时触发 */
  onChange(e) {
    return this._onChange = e, this;
  }
  // ---- 写入 ----
  set(e, n) {
    const s = this._x !== e || this._y !== n;
    return this._x = e, this._y = n, s && this._onChange?.(), this;
  }
  copy(e) {
    return this.set(e.x, e.y);
  }
  zero() {
    return this.set(0, 0);
  }
  // ---- 运算（就地修改） ----
  add(e) {
    return this.set(this._x + e.x, this._y + e.y);
  }
  subtract(e) {
    return this.set(this._x - e.x, this._y - e.y);
  }
  multiply(e) {
    return this.set(this.x * e.x, this.y * e.y);
  }
  multiplyScalar(e) {
    return this.set(this._x * e, this._y * e);
  }
  // ---- 查询 ----
  magnitude() {
    return Math.hypot(this._x, this._y);
  }
  magnitudeSquared() {
    return this._x * this._x + this._y * this._y;
  }
  dot(e) {
    return this._x * e.x + this._y * e.y;
  }
  cross(e) {
    return this.x * e.y - this.y * e.x;
  }
  normalize() {
    const e = this.magnitude();
    return e <= 0 ? this : this.set(this.x / e, this.y / e);
  }
  perpendicular() {
    return this.set(-this.y, this.x);
  }
  negate() {
    return this.set(-this.x, -this.y);
  }
  setLengthTo(e, n, s, i) {
    const r = Math.sqrt(e * e + n * n), c = s / r, a = e * c, l = n * c;
    return !Number.isFinite(e) || !Number.isFinite(n) || e == 0 && n == 0 ? (this.set(0, 0), !1) : (i && (i.value = r), this.set(a, l), !0);
  }
  isFinite() {
    return Number.isFinite(this.x) && Number.isFinite(this.y);
  }
  // ---- 工具 ----
  clone() {
    return new st(this._x, this._y);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  equalsEpsilon(e, n = 1e-9) {
    return Math.abs(this.x - e.x) <= n && Math.abs(this.y - e.y) <= n;
  }
  toString() {
    return `Point(${this._x}, ${this._y})`;
  }
}
function Ga(o) {
  const e = o * o, n = e * o, s = 1 / 6;
  return [
    s * (1 - 3 * o + 3 * e - n),
    s * (4 - 6 * e + 3 * n),
    s * (1 + 3 * o + 3 * e - 3 * n),
    s * n
  ];
}
function Za(o) {
  const e = o * o, n = 1 / 6;
  return [
    n * (-3 + 6 * o - 3 * e),
    n * (-12 * o + 9 * e),
    n * (3 + 6 * o - 9 * e),
    n * (3 * e)
  ];
}
function an(o, e, n, s, i) {
  const [r, c, a, l] = Ga(o);
  return st.create(
    r * e.x + c * n.x + a * s.x + l * i.x,
    r * e.y + c * n.y + a * s.y + l * i.y
  );
}
function Ja(o, e, n, s, i) {
  const [r, c, a, l] = Za(o);
  return st.create(
    r * e.x + c * n.x + a * s.x + l * i.x,
    r * e.y + c * n.y + a * s.y + l * i.y
  );
}
function Qa(o, e, n, s) {
  const i = [e, n], r = 16;
  for (let c = 1; c < r; c++) {
    const a = c / r;
    i.push(an(a, o, e, n, s));
  }
  return Lt.default().fromPoints(i);
}
class Gf {
  /** 控制点序列（至少 4 个点） */
  points;
  constructor(e) {
    this.points = e.map((n) => ({ x: n.x, y: n.y }));
  }
  /** 段数 */
  get segmentCount() {
    return Math.max(0, this.points.length - 3);
  }
  /** 将全局参数 t∈[0,1] 映射到段索引和段内参数 */
  _toSegment(e) {
    const n = this.segmentCount;
    if (n === 0) return { seg: 0, localU: 0 };
    const s = nn(e, 0, 1) * n, i = Math.min(Math.floor(s), n - 1), r = s - i;
    return { seg: i, localU: r };
  }
  /** 计算曲线上参数 t∈[0,1] 处的点 */
  evaluate(e) {
    const { seg: n, localU: s } = this._toSegment(e), i = this.points;
    return an(s, i[n], i[n + 1], i[n + 2], i[n + 3]);
  }
  /** 计算曲线在 t 处的一阶导数（切向量） */
  derivative(e) {
    const { seg: n, localU: s } = this._toSegment(e), i = this.points;
    return Ja(s, i[n], i[n + 1], i[n + 2], i[n + 3]);
  }
  /** 计算曲线在 t 处的法向量 */
  normal(e) {
    const n = this.derivative(e), s = Math.sqrt(n.x * n.x + n.y * n.y);
    return s === 0 ? { x: 0, y: 0 } : { x: -n.y / s, y: n.x / s };
  }
  /** 获取边界框 */
  getBounds() {
    const e = Lt.default(), n = this.segmentCount;
    if (n === 0) return e;
    for (let s = 0; s < n; s++) {
      const i = Qa(
        this.points[s],
        this.points[s + 1],
        this.points[s + 2],
        this.points[s + 3]
      );
      s === 0 ? (e.min.x = i.min.x, e.min.y = i.min.y, e.max.x = i.max.x, e.max.y = i.max.y) : (e.min.x = Math.min(e.min.x, i.min.x), e.min.y = Math.min(e.min.y, i.min.y), e.max.x = Math.max(e.max.x, i.max.x), e.max.y = Math.max(e.max.y, i.max.y));
    }
    return e;
  }
  /**
   * 将曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   */
  flatten(e = 0.5) {
    const n = [], s = this.segmentCount;
    if (s === 0) return n;
    for (let i = 0; i < s; i++) {
      const r = this.points[i], c = this.points[i + 1], a = this.points[i + 2], l = this.points[i + 3];
      i === 0 && n.push(an(0, r, c, a, l)), this._flattenSegment(r, c, a, l, e, n);
    }
    return n;
  }
  _flattenSegment(e, n, s, i, r, c) {
    const a = (l, h, u) => {
      const f = (l + h) * 0.5, d = an(f, e, n, s, i), y = an(h, e, n, s, i), x = y.x - u.x, g = y.y - u.y, w = x * x + g * g;
      if (w < 1e-20) {
        c.push(y);
        return;
      }
      Math.abs((d.x - u.x) * g - (d.y - u.y) * x) / Math.sqrt(w) <= r ? c.push(y) : (a(l, f, u), a(f, h, d));
    };
    a(0, 1, an(0, e, n, s, i));
  }
  /**
   * 计算点到曲线的最小距离
   * @param samples - 每段采样数（默认 16）
   */
  distanceTo(e, n, s = 16) {
    const i = this.segmentCount;
    if (i === 0) return 1 / 0;
    let r = 1 / 0;
    for (let c = 0; c < i; c++) {
      const a = this.points;
      for (let l = 0; l <= s; l++) {
        const h = l / s, u = an(h, a[c], a[c + 1], a[c + 2], a[c + 3]), f = u.x - e, d = u.y - n, y = f * f + d * d;
        y < r && (r = y);
      }
    }
    return Math.sqrt(r);
  }
  /**
   * 计算点在曲线上的投影点（最近点）
   * @param samples - 每段采样数（默认 16）
   */
  projectPoint(e, n, s = 16) {
    const i = this.segmentCount;
    if (i === 0) return { x: 0, y: 0 };
    let r = 0, c = 1 / 0;
    for (let a = 0; a < i; a++) {
      const l = this.points;
      for (let h = 0; h <= s; h++) {
        const u = h / s, f = an(u, l[a], l[a + 1], l[a + 2], l[a + 3]), d = f.x - e, y = f.y - n, x = d * d + y * y;
        x < c && (c = x, r = (a + u) / i);
      }
    }
    return this.evaluate(r);
  }
}
function zn(o, e, n, s, i, r = 0.5) {
  const c = o * o, a = c * o, l = 2 - r * 2, h = -l * a + 2 * l * c - l * o, u = (2 - l) * a + (l - 3) * c + 1, f = (l - 2) * a + (3 - 2 * l) * c + l * o, d = l * a - l * c;
  return st.create(
    h * e.x + u * n.x + f * s.x + d * i.x,
    h * e.y + u * n.y + f * s.y + d * i.y
  );
}
function Ka(o, e, n, s, i, r = 0.5) {
  const c = o * o, a = 2 - r * 2, l = -3 * a * c + 4 * a * o - a, h = 3 * (2 - a) * c + 2 * (a - 3) * o, u = 3 * (a - 2) * c + 2 * (3 - 2 * a) * o + a, f = 3 * a * c - 2 * a * o;
  return st.create(
    l * e.x + h * n.x + u * s.x + f * i.x,
    l * e.y + h * n.y + u * s.y + f * i.y
  );
}
function tl(o, e, n, s, i = 0.5) {
  const r = 2 - i * 2, c = [], a = -3 * r * o.x + 3 * (2 - r) * e.x + 3 * (r - 2) * n.x + 3 * r * s.x, l = 4 * r * o.x + 2 * (r - 3) * e.x + 2 * (3 - 2 * r) * n.x - 2 * r * s.x, h = -r * o.x + r * n.x;
  if (Math.abs(a) < 1e-12) {
    if (Math.abs(l) > 1e-12) {
      const y = -h / l;
      y > 0 && y < 1 && c.push(y);
    }
  } else {
    const y = l * l - 4 * a * h;
    if (y >= 0) {
      const x = Math.sqrt(y), g = (-l - x) / (2 * a), w = (-l + x) / (2 * a);
      g > 0 && g < 1 && c.push(g), w > 0 && w < 1 && c.push(w);
    }
  }
  const u = -3 * r * o.y + 3 * (2 - r) * e.y + 3 * (r - 2) * n.y + 3 * r * s.y, f = 4 * r * o.y + 2 * (r - 3) * e.y + 2 * (3 - 2 * r) * n.y - 2 * r * s.y, d = -r * o.y + r * n.y;
  if (Math.abs(u) < 1e-12) {
    if (Math.abs(f) > 1e-12) {
      const y = -d / f;
      y > 0 && y < 1 && !c.some((x) => Math.abs(x - y) < 1e-6) && c.push(y);
    }
  } else {
    const y = f * f - 4 * u * d;
    if (y >= 0) {
      const x = Math.sqrt(y), g = (-f - x) / (2 * u), w = (-f + x) / (2 * u);
      g > 0 && g < 1 && !c.some((M) => Math.abs(M - g) < 1e-6) && c.push(g), w > 0 && w < 1 && !c.some((M) => Math.abs(M - w) < 1e-6) && c.push(w);
    }
  }
  return c.sort((y, x) => y - x);
}
function el(o, e, n, s, i = 0.5) {
  const r = tl(o, e, n, s, i), c = [e, n];
  for (const a of r)
    c.push(zn(a, o, e, n, s, i));
  return Lt.default().fromPoints(c);
}
class Zf {
  /** 控制点序列（至少 2 个点，曲线过 p1..p(n-2)） */
  points;
  /** 张力参数，0.5 为标准 Catmull-Rom，0 为紧致，1 为松弛 */
  tension;
  constructor(e, n = 0.5) {
    this.points = e.map((s) => ({ x: s.x, y: s.y })), this.tension = n;
  }
  /** 段数 */
  get segmentCount() {
    return Math.max(0, this.points.length - 3);
  }
  /** 将全局参数 t∈[0,1] 映射到段索引和段内参数 */
  _toSegment(e) {
    const n = this.segmentCount;
    if (n === 0) return { seg: 0, localT: 0 };
    const s = nn(e, 0, 1) * n, i = Math.min(Math.floor(s), n - 1), r = s - i;
    return { seg: i, localT: r };
  }
  /** 计算曲线上参数 t∈[0,1] 处的点 */
  evaluate(e) {
    const { seg: n, localT: s } = this._toSegment(e), i = this.points;
    return zn(s, i[n], i[n + 1], i[n + 2], i[n + 3], this.tension);
  }
  /** 计算曲线在 t 处的一阶导数（切向量） */
  derivative(e) {
    const { seg: n, localT: s } = this._toSegment(e), i = this.points;
    return Ka(s, i[n], i[n + 1], i[n + 2], i[n + 3], this.tension);
  }
  /** 计算曲线在 t 处的法向量 */
  normal(e) {
    const n = this.derivative(e), s = Math.sqrt(n.x * n.x + n.y * n.y);
    return s === 0 ? { x: 0, y: 0 } : { x: -n.y / s, y: n.x / s };
  }
  /** 获取边界框 */
  getBounds() {
    const e = Lt.default(), n = this.segmentCount;
    for (let s = 0; s < n; s++) {
      const i = el(
        this.points[s],
        this.points[s + 1],
        this.points[s + 2],
        this.points[s + 3],
        this.tension
      );
      s === 0 ? (e.min.x = i.min.x, e.min.y = i.min.y, e.max.x = i.max.x, e.max.y = i.max.y) : (e.min.x = Math.min(e.min.x, i.min.x), e.min.y = Math.min(e.min.y, i.min.y), e.max.x = Math.max(e.max.x, i.max.x), e.max.y = Math.max(e.max.y, i.max.y));
    }
    return e;
  }
  /**
   * 将曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   * @returns 点序列
   */
  flatten(e = 0.5) {
    const n = [], s = this.segmentCount;
    if (s === 0) return this.points.length > 0 ? [{ ...this.points[0] }] : n;
    for (let i = 0; i < s; i++) {
      const r = this.points[i], c = this.points[i + 1], a = this.points[i + 2], l = this.points[i + 3];
      i === 0 && n.push({ x: c.x, y: c.y }), this._flattenSegment(r, c, a, l, e, n);
    }
    return n;
  }
  _flattenSegment(e, n, s, i, r, c) {
    const a = (h, u, f, d) => {
      const y = (h + u) * 0.5, x = zn(y, e, n, s, i, this.tension), g = d.x - f.x, w = d.y - f.y, M = g * g + w * w;
      if (M < 1e-20) {
        c.push(d);
        return;
      }
      Math.abs((x.x - f.x) * w - (x.y - f.y) * g) / Math.sqrt(M) <= r ? c.push(d) : (a(h, y, f, x), a(y, u, x, d));
    }, l = zn(1, e, n, s, i, this.tension);
    a(0, 1, n, l);
  }
  /**
   * 计算点到曲线的最小距离
   * @param samples - 每段采样数（默认 16）
   */
  distanceTo(e, n, s = 16) {
    const i = this.segmentCount;
    if (i === 0) return 1 / 0;
    let r = 1 / 0;
    for (let c = 0; c < i; c++) {
      const a = this.points;
      for (let l = 0; l <= s; l++) {
        const h = l / s, u = zn(h, a[c], a[c + 1], a[c + 2], a[c + 3], this.tension), f = u.x - e, d = u.y - n, y = f * f + d * d;
        y < r && (r = y);
      }
    }
    return Math.sqrt(r);
  }
  /**
   * 计算点在曲线上的投影点（最近点）
   * @param samples - 每段采样数（默认 16）
   */
  projectPoint(e, n, s = 16) {
    const i = this.segmentCount;
    if (i === 0) return { x: 0, y: 0 };
    let r = 0, c = 1 / 0;
    for (let a = 0; a < i; a++) {
      const l = this.points;
      for (let h = 0; h <= s; h++) {
        const u = h / s, f = zn(u, l[a], l[a + 1], l[a + 2], l[a + 3], this.tension), d = f.x - e, y = f.y - n, x = d * d + y * y;
        x < c && (c = x, r = (a + u) / i);
      }
    }
    return this.evaluate(r);
  }
}
var nl = /* @__PURE__ */ ((o) => (o[o.Ellipse = 0] = "Ellipse", o[o.Parabola = 1] = "Parabola", o[o.Hyperbola = 2] = "Hyperbola", o))(nl || {});
function sl(o) {
  return Math.abs(o - 1) < 1e-10 ? 1 : o < 1 ? 0 : 2;
}
function il(o, e, n) {
  return st.create(e * Math.cos(o), n * Math.sin(o));
}
function rl(o, e, n) {
  return st.create(-e * Math.sin(o), n * Math.cos(o));
}
function Jf(o, e) {
  if (o === e) return 2 * Math.PI * o;
  const n = ((o - e) / (o + e)) ** 2;
  return Math.PI * (o + e) * (1 + 3 * n / (10 + Math.sqrt(4 - 3 * n)));
}
function Qf(o, e) {
  return Math.PI * o * e;
}
function ol(o, e) {
  return Lt.fromLTRB(-o, -e, o, e);
}
function Kf(o, e, n, s) {
  const i = o / n, r = e / s;
  return i * i + r * r <= 1;
}
function cl(o, e, n, s, i = 8) {
  const r = Math.abs(o), c = Math.abs(e), a = Math.max(n, s), l = Math.min(n, s);
  if (c === 0)
    return Math.abs(r - a);
  let h = Math.atan2(c * a, r * l);
  for (let w = 0; w < i; w++) {
    const M = Math.cos(h), P = Math.sin(h), S = a * M, k = l * P, O = a * a * (S - r), R = l * l * (k - c), F = (S - r) * O + (k - c) * R, Y = O * O + R * R;
    if (Math.abs(F) < 1e-12 || Math.abs(Y) < 1e-12) break;
    h -= F / Y, h = nn(h, 0, Math.PI / 2);
  }
  const u = Math.cos(h), f = Math.sin(h), d = a * u, y = l * f, x = d - r, g = y - c;
  return Math.sqrt(x * x + g * g);
}
function al(o, e) {
  return st.create(e * o * o, 2 * e * o);
}
function ll(o, e) {
  return st.create(2 * e * o, 2 * e);
}
function t1(o, e, n) {
  const s = (i) => {
    const r = Math.sqrt(i * i + 1);
    return n * (i * r + Math.log(i + r));
  };
  return Math.abs(s(e) - s(o));
}
function hl(o, e, n, s = 32, i = 8) {
  const r = Math.sqrt(Math.abs(o) / Math.max(Math.abs(n), 1e-6)) + 1;
  let c = 0, a = 1 / 0;
  for (let d = 0; d <= s; d++) {
    const y = 2 * r * d / s - r, x = n * y * y, g = 2 * n * y, w = x - o, M = g - e, P = w * w + M * M;
    P < a && (a = P, c = y);
  }
  let l = c;
  for (let d = 0; d < i; d++) {
    const y = n * l * l - o, x = 2 * n * l - e, g = 2 * n * l, w = 2 * n, M = 2 * n, P = 0, S = y * g + x * w, k = g * g + w * w + y * M + x * P;
    if (Math.abs(k) < 1e-15) break;
    l = l - S / k;
  }
  const h = n * l * l - o, u = 2 * n * l - e, f = h * h + u * u;
  return f < a && (a = f), Math.sqrt(a);
}
function ul(o, e, n, s = 1) {
  return st.create(s * e * Math.cosh(o), n * Math.sinh(o));
}
function fl(o, e, n, s = 1) {
  return st.create(s * e * Math.sinh(o), n * Math.cosh(o));
}
function e1(o, e) {
  return e / o;
}
function n1(o, e) {
  return Math.sqrt(1 + e * e / (o * o));
}
function s1(o, e) {
  const n = Math.sqrt(o * o + e * e);
  return [{ x: -n, y: 0 }, { x: n, y: 0 }];
}
function i1(o, e, n, s) {
  const i = o / n, r = e / s;
  return i * i - r * r >= 1;
}
class xi {
  /** 离心率 */
  eccentricity;
  /** 焦点距离（半长轴或半实轴） */
  a;
  /** 半短轴或半虚轴 */
  b;
  /** 曲线类型 */
  type;
  constructor(e, n, s) {
    this.eccentricity = e, this.a = n, this.b = s, this.type = sl(e);
  }
  /** 创建椭圆 */
  static ellipse(e, n) {
    const s = e === n ? 0 : Math.sqrt(1 - n * n / (e * e));
    return new xi(s, e, n);
  }
  /** 创建抛物线 */
  static parabola(e) {
    return new xi(1, e, 0);
  }
  /** 创建双曲线 */
  static hyperbola(e, n) {
    const s = Math.sqrt(1 + n * n / (e * e));
    return new xi(s, e, n);
  }
  /** 计算曲线上参数 t 处的点 */
  evaluate(e) {
    switch (this.type) {
      case 0:
        return il(e, this.a, this.b);
      case 1:
        return al(e, this.a);
      case 2:
        return ul(e, this.a, this.b);
    }
  }
  /** 计算曲线在 t 处的一阶导数 */
  derivative(e) {
    switch (this.type) {
      case 0:
        return rl(e, this.a, this.b);
      case 1:
        return ll(e, this.a);
      case 2:
        return fl(e, this.a, this.b);
    }
  }
  /** 计算曲线在 t 处的法向量 */
  normal(e) {
    const n = this.derivative(e), s = Math.sqrt(n.x * n.x + n.y * n.y);
    return s === 0 ? { x: 0, y: 0 } : { x: -n.y / s, y: n.x / s };
  }
  /** 获取边界框 */
  getBounds() {
    switch (this.type) {
      case 0:
        return ol(this.a, this.b);
      case 1:
        return Lt.fromLTRB(0, -100, 100, 100);
      case 2:
        return Lt.fromLTRB(this.a, -100, 100, 100);
    }
  }
  /** 计算点到曲线的最小距离 */
  distanceTo(e, n) {
    switch (this.type) {
      case 0:
        return cl(e, n, this.a, this.b);
      case 1:
        return hl(e, n, this.a);
      case 2: {
        let s = 1 / 0;
        for (let i = -20; i <= 20; i++) {
          const r = i * 0.5, c = this.evaluate(r), a = c.x - e, l = c.y - n, h = a * a + l * l;
          h < s && (s = h);
        }
        return Math.sqrt(s);
      }
    }
  }
  /**
   * 将曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   * @param range   - 参数范围 [tMin, tMax]（默认根据曲线类型自动）
   */
  flatten(e = 0.5, n) {
    const [s, i] = n ?? this._defaultRange(), r = [], c = 64, a = [];
    for (let h = 0; h <= c; h++) {
      const u = s + (i - s) * h / c;
      a.push(this.evaluate(u));
    }
    const l = (h, u, f) => {
      const d = Math.floor((h + u) / 2);
      if (d === h || d === u) {
        r.push(a[u]);
        return;
      }
      const y = a[d], x = a[u], g = x.x - f.x, w = x.y - f.y, M = g * g + w * w;
      if (M < 1e-20) {
        r.push(x);
        return;
      }
      Math.abs((y.x - f.x) * w - (y.y - f.y) * g) / Math.sqrt(M) <= e ? r.push(x) : (l(h, d, f), l(d, u, y));
    };
    r.push(a[0]);
    for (let h = 1; h < a.length; h++)
      l(h - 1, h, a[h - 1]);
    return r;
  }
  _defaultRange() {
    switch (this.type) {
      case 0:
        return [0, 2 * Math.PI];
      case 1:
        return [-5, 5];
      case 2:
        return [-3, 3];
    }
  }
}
var dl = /* @__PURE__ */ ((o) => (o[o.R = 0] = "R", o[o.G = 1] = "G", o[o.B = 2] = "B", o[o.A = 3] = "A", o))(dl || {});
let Ve = class St extends Float32Array {
  // ---- 静态工厂 ----
  static toCSS_RGBA(e) {
    return `rgba(${e[0] * 255},${e[1] * 255},${e[2] * 255},${e[3]})`;
  }
  static fromRGBA(e, n, s, i = 1) {
    return new St(e, n, s, i);
  }
  /** 从 0-255 字节值创建（自动归一化） */
  static fromBytes(e, n, s, i = 255) {
    return new St(e / 255, n / 255, s / 255, i / 255);
  }
  /** 从 ColorValue 创建 */
  static fromColorValue(e) {
    return new St(e[0], e[1], e[2], e[3] ?? 1);
  }
  /**
   * 从多种格式字符串、数值或数组解析颜色。
   *
   * 支持格式:
   *   - 0xRRGGBB / 0xRRGGBBAA  (十六进制数值)
   *   - "#RGB" / "#RRGGBB" / "#RGBA" / "#RRGGBBAA"  (hex 字符串)
   *   - "rgb(r, g, b)" / "rgba(r, g, b, a)"
   *   - "hsl(h, s%, l%)" / "hsla(h, s%, l%, a)"
   *   - "hsv(h, s%, v%)" / "hsva(h, s%, v%, a)"
   *   - [r, g, b, a?]  (归一化 0-1 数值数组，a 可选，默认 1)
   *   - 关键词 "transparent" → rgba(0,0,0,0)
   */
  static fromInput(e) {
    if (typeof e == "number")
      return St._fromHexNumber(e);
    if (Array.isArray(e))
      return new St(e[0], e[1], e[2], e[3] ?? 1);
    const n = e.trim();
    if (n === "transparent")
      return new St(0, 0, 0, 0);
    if (n.startsWith("#"))
      return St._fromHexString(n);
    const s = n.toLowerCase();
    return s.startsWith("rgba(") || s.startsWith("rgb(") ? St._fromRGBString(s) : s.startsWith("hsla(") || s.startsWith("hsl(") ? St._fromHSLString(s) : s.startsWith("hsva(") || s.startsWith("hsv(") ? St._fromHSVString(s) : /^[0-9a-fA-F]{3,8}$/.test(n) ? St._fromHexString("#" + n) : new St(0, 0, 0, 1);
  }
  // ---- 内部解析 ----
  /** "0xRRGGBB" 或 "0xRRGGBBAA" 十六进制整数 */
  static _fromHexNumber(e) {
    return e > 16777215 ? new St(
      (e >>> 24 & 255) / 255,
      (e >>> 16 & 255) / 255,
      (e >>> 8 & 255) / 255,
      (e & 255) / 255
    ) : new St(
      (e >>> 16 & 255) / 255,
      (e >>> 8 & 255) / 255,
      (e & 255) / 255,
      1
    );
  }
  /** "#RGB" / "#RRGGBB" / "#RGBA" / "#RRGGBBAA" */
  static _fromHexString(e) {
    let n = e.slice(1);
    return n.length === 3 ? n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2] : n.length === 4 && (n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2] + n[3] + n[3]), new St(
      parseInt(n.slice(0, 2), 16) / 255,
      parseInt(n.slice(2, 4), 16) / 255,
      parseInt(n.slice(4, 6), 16) / 255,
      n.length >= 8 ? parseInt(n.slice(6, 8), 16) / 255 : 1
    );
  }
  /** "rgb(r, g, b)" / "rgba(r, g, b, a)" */
  static _fromRGBString(e) {
    const n = e.match(/[\d.]+/g);
    return !n || n.length < 3 ? new St(0, 0, 0, 1) : new St(
      Math.max(0, Math.min(1, parseFloat(n[0]) / 255)),
      Math.max(0, Math.min(1, parseFloat(n[1]) / 255)),
      Math.max(0, Math.min(1, parseFloat(n[2]) / 255)),
      Math.max(0, Math.min(1, n.length >= 4 ? parseFloat(n[3]) : 1))
    );
  }
  /** "hsl(h, s%, l%)" / "hsla(h, s%, l%, a)" */
  static _fromHSLString(e) {
    const n = e.match(/[\d.]+/g);
    return !n || n.length < 3 ? new St(0, 0, 0, 1) : St._hslToRgba(
      parseFloat(n[0]) / 360,
      parseFloat(n[1]) / 100,
      parseFloat(n[2]) / 100,
      n.length >= 4 ? parseFloat(n[3]) : 1
    );
  }
  /** "hsv(h, s%, v%)" / "hsva(h, s%, v%, a)" */
  static _fromHSVString(e) {
    const n = e.match(/[\d.]+/g);
    return !n || n.length < 3 ? new St(0, 0, 0, 1) : St._hsvToRgba(
      parseFloat(n[0]) / 360,
      parseFloat(n[1]) / 100,
      parseFloat(n[2]) / 100,
      n.length >= 4 ? parseFloat(n[3]) : 1
    );
  }
  // ---- HSL / HSV → Color ----
  static _hslToRgba(e, n, s, i) {
    if (n === 0)
      return new St(s, s, s, i);
    const r = (l, h, u) => (u < 0 && (u += 1), u > 1 && (u -= 1), u < 1 / 6 ? l + (h - l) * 6 * u : u < 1 / 2 ? h : u < 2 / 3 ? l + (h - l) * (2 / 3 - u) * 6 : l), c = s < 0.5 ? s * (1 + n) : s + n - s * n, a = 2 * s - c;
    return new St(
      r(a, c, e + 1 / 3),
      r(a, c, e),
      r(a, c, e - 1 / 3),
      i
    );
  }
  static _hsvToRgba(e, n, s, i) {
    const r = Math.floor(e * 6), c = e * 6 - r, a = s * (1 - n), l = s * (1 - c * n), h = s * (1 - (1 - c) * n);
    let u, f, d;
    switch (r % 6) {
      case 0:
        u = s, f = h, d = a;
        break;
      case 1:
        u = l, f = s, d = a;
        break;
      case 2:
        u = a, f = s, d = h;
        break;
      case 3:
        u = a, f = l, d = s;
        break;
      case 4:
        u = h, f = a, d = s;
        break;
      default:
        u = s, f = a, d = l;
        break;
    }
    return new St(u, f, d, i);
  }
  // ==================== 实例 API ====================
  constructor(e = 0, n = 0, s = 0, i = 1) {
    super(4), this[0] = e, this[1] = n, this[2] = s, this[3] = i;
  }
  // ---- 命名属性访问器 ----
  get r() {
    return this[0];
  }
  set r(e) {
    this[0] = e;
  }
  get g() {
    return this[1];
  }
  set g(e) {
    this[1] = e;
  }
  get b() {
    return this[2];
  }
  set b(e) {
    this[2] = e;
  }
  get a() {
    return this[3];
  }
  set a(e) {
    this[3] = e;
  }
  // ---- 写入 ----
  fromValues(e, n, s, i = 1) {
    return this[0] = e, this[1] = n, this[2] = s, this[3] = i, this;
  }
  copy(e) {
    return this[0] = e[0], this[1] = e[1], this[2] = e[2], this[3] = e[3], this;
  }
  // ---- 输出 ----
  /** 转为 CSS rgba() 字符串 */
  toRGBAString() {
    return `rgba(${Math.round(this[0] * 255)},${Math.round(this[1] * 255)},${Math.round(this[2] * 255)},${this[3]})`;
  }
  /** 转为 CSS hex 字符串 */
  toHexString() {
    const e = (s) => Math.round(s * 255).toString(16).padStart(2, "0"), n = `#${e(this[0])}${e(this[1])}${e(this[2])}`;
    return this[3] < 1 ? n + e(this[3]) : n;
  }
  clone() {
    return new St(this[0], this[1], this[2], this[3]);
  }
  toString() {
    return this.toRGBAString();
  }
  // ==================== 颜色空间转换 ====================
  /** 获取 HSL 表示 { h:0-360, s:0-1, l:0-1 } */
  toHSL() {
    const e = this[0], n = this[1], s = this[2], i = Math.max(e, n, s), r = Math.min(e, n, s), c = (i + r) / 2;
    if (i === r) return { h: 0, s: 0, l: c };
    const a = i - r, l = c > 0.5 ? a / (2 - i - r) : a / (i + r);
    let h = 0;
    switch (i) {
      case e:
        h = ((n - s) / a + (n < s ? 6 : 0)) / 6;
        break;
      case n:
        h = ((s - e) / a + 2) / 6;
        break;
      case s:
        h = ((e - n) / a + 4) / 6;
        break;
    }
    return { h: h * 360, s: l, l: c };
  }
  /** 从 HSL 设置颜色值 */
  fromHSL(e, n, s, i = this[3]) {
    const r = St._hslToRgba(e / 360, n, s, i);
    return this[0] = r[0], this[1] = r[1], this[2] = r[2], this[3] = r[3], this;
  }
  /** 获取 HSV 表示 { h:0-360, s:0-1, v:0-1 } */
  toHSV() {
    const e = this[0], n = this[1], s = this[2], i = Math.max(e, n, s), r = Math.min(e, n, s), c = i - r, a = i, l = i === 0 ? 0 : c / i;
    if (c === 0) return { h: 0, s: l, v: a };
    let h = 0;
    switch (i) {
      case e:
        h = ((n - s) / c + (n < s ? 6 : 0)) / 6;
        break;
      case n:
        h = ((s - e) / c + 2) / 6;
        break;
      case s:
        h = ((e - n) / c + 4) / 6;
        break;
    }
    return { h: h * 360, s: l, v: a };
  }
  // ---- 亮度 ----
  /** 相对亮度（ITU-R BT.709，用于 WCAG 对比度计算） */
  luminance() {
    const e = (n) => n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    return 0.2126 * e(this[0]) + 0.7152 * e(this[1]) + 0.0722 * e(this[2]);
  }
  /** WCAG 对比度比率 */
  contrastRatio(e) {
    const n = this.luminance() + 0.05, s = e.luminance() + 0.05;
    return n > s ? n / s : s / n;
  }
  /** 感知亮度（加权灰度值） */
  get brightness() {
    return 0.299 * this[0] + 0.587 * this[1] + 0.114 * this[2];
  }
  // ---- 颜色变换（就地修改） ----
  /** 变亮 */
  brighten(e) {
    const n = this.toHSL();
    return n.l = Math.min(1, n.l + e), this.fromHSL(n.h, n.s, n.l);
  }
  /** 变暗 */
  darken(e) {
    const n = this.toHSL();
    return n.l = Math.max(0, n.l - e), this.fromHSL(n.h, n.s, n.l);
  }
  /** 增加饱和度 */
  saturate(e) {
    const n = this.toHSL();
    return n.s = Math.min(1, n.s + e), this.fromHSL(n.h, n.s, n.l);
  }
  /** 降低饱和度 */
  desaturate(e) {
    const n = this.toHSL();
    return n.s = Math.max(0, n.s - e), this.fromHSL(n.h, n.s, n.l);
  }
  /** 完全去饱和转为灰度 */
  grayscale() {
    const e = this.brightness;
    return this[0] = e, this[1] = e, this[2] = e, this;
  }
  /** 反转颜色 */
  invert() {
    return this[0] = 1 - this[0], this[1] = 1 - this[1], this[2] = 1 - this[2], this;
  }
  /** 色调旋转（角度制） */
  rotateHue(e) {
    const n = this.toHSL();
    return n.h = (n.h + e) % 360, n.h < 0 && (n.h += 360), this.fromHSL(n.h, n.s, n.l);
  }
  /** 设置不透明度 */
  setAlpha(e) {
    return this[3] = Math.max(0, Math.min(1, e)), this;
  }
  /** 叠加混合（Porter-Duff over） */
  blendOver(e) {
    const n = e[3], s = this[3], i = n + s * (1 - n);
    return i === 0 ? (this[0] = this[1] = this[2] = this[3] = 0, this) : (this[0] = (e[0] * n + this[0] * s * (1 - n)) / i, this[1] = (e[1] * n + this[1] * s * (1 - n)) / i, this[2] = (e[2] * n + this[2] * s * (1 - n)) / i, this[3] = i, this);
  }
  /** 与另一个颜色混合 */
  mix(e, n) {
    const s = 1 - n;
    return this[0] = this[0] * s + e[0] * n, this[1] = this[1] * s + e[1] * n, this[2] = this[2] * s + e[2] * n, this[3] = this[3] * s + e[3] * n, this;
  }
  /** 获取互补色（返回新实例） */
  complementary() {
    return this.clone().rotateHue(180);
  }
  /** 返回前乘以 alpha（预乘 alpha） */
  premultiply() {
    const e = this[3];
    return this[0] *= e, this[1] *= e, this[2] *= e, this;
  }
  // ==================== 静态插值器 ====================
  /** RGB 空间线性插值 */
  static lerp(e, n, s, i = new St()) {
    const r = 1 - s;
    return i[0] = e[0] * r + n[0] * s, i[1] = e[1] * r + n[1] * s, i[2] = e[2] * r + n[2] * s, i[3] = e[3] * r + n[3] * s, i;
  }
  /** HSL 空间插值（色相走最短路径），更适合渐变过渡 */
  static lerpHSL(e, n, s, i = new St()) {
    const r = e.toHSL(), c = n.toHSL(), a = 1 - s;
    let l = c.h - r.h;
    Math.abs(l) > 180 && (l = l > 0 ? l - 360 : l + 360);
    const h = r.h + l * s, u = r.s * a + c.s * s, f = r.l * a + c.l * s, d = e[3] * a + n[3] * s;
    return i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3], i.fromHSL(h < 0 ? h + 360 : h >= 360 ? h - 360 : h, u, f, d), i;
  }
  /** LAB 空间插值（感知均匀），色带过渡最自然 */
  static lerpLAB(e, n, s, i = new St()) {
    const r = St._rgbToLAB(e), c = St._rgbToLAB(n), a = 1 - s, l = {
      l: r.l * a + c.l * s,
      a: r.a * a + c.a * s,
      b: r.b * a + c.b * s
    }, h = e[3] * a + n[3] * s;
    return St._labToRGB(l, i), i[3] = h, i;
  }
  /** 生成随机颜色 */
  static random(e = 1) {
    return new St(Math.random(), Math.random(), Math.random(), e);
  }
  /** 生成随机鲜艳颜色（高饱和度 HSL） */
  static randomVibrant(e = 1) {
    const n = Math.random() * 360;
    return new St().fromHSL(n, 0.7 + Math.random() * 0.3, 0.5 + Math.random() * 0.15, e);
  }
  // ---- LAB 内部转换 ----
  static _rgbToLAB(e) {
    const n = (y) => (y = y > 0.04045 ? ((y + 0.055) / 1.055) ** 2.4 : y / 12.92, y * 100), s = n(e[0]), i = n(e[1]), r = n(e[2]), c = s * 0.4124564 + i * 0.3575761 + r * 0.1804375, a = s * 0.2126729 + i * 0.7151522 + r * 0.072175, l = s * 0.0193339 + i * 0.119192 + r * 0.9503041, h = (y) => y > 8856e-6 ? Math.cbrt(y) : 7.787 * y + 16 / 116, u = h(c / 95.047), f = h(a / 100), d = h(l / 108.883);
    return {
      l: 116 * f - 16,
      a: 500 * (u - f),
      b: 200 * (f - d)
    };
  }
  static _labToRGB(e, n) {
    const s = (e.l + 16) / 116, i = e.a / 500 + s, r = s - e.b / 200, c = (f) => {
      const d = f * f * f;
      return d > 8856e-6 ? d : (f - 16 / 116) / 7.787;
    }, a = c(i) * 95.047, l = c(s) * 100, h = c(r) * 108.883, u = (f) => (f /= 100, f > 31308e-7 ? 1.055 * f ** (1 / 2.4) - 0.055 : 12.92 * f);
    n[0] = Math.max(0, Math.min(1, u(a * 3.2404542 + l * -1.5371385 + h * -0.4985314))), n[1] = Math.max(0, Math.min(1, u(a * -0.969266 + l * 1.8760108 + h * 0.041556))), n[2] = Math.max(0, Math.min(1, u(a * 0.0556434 + l * -0.2040259 + h * 1.0572252)));
  }
};
function gc(o, e, n, s, i) {
  const r = 1 - o, c = r * r, a = c * r, l = o * o, h = l * o;
  return st.create(
    a * e.x + 3 * c * o * n.x + 3 * r * l * s.x + h * i.x,
    a * e.y + 3 * c * o * n.y + 3 * r * l * s.y + h * i.y
  );
}
function wc(o, e, n, s) {
  const i = vc(o, e, n, s), r = [o, s];
  for (const c of i)
    r.push(gc(c, o, e, n, s));
  return Lt.default().fromPoints(r);
}
function vc(o, e, n, s) {
  const i = [], r = 3 * (-o.x + 3 * e.x - 3 * n.x + s.x), c = 6 * (o.x - 2 * e.x + n.x), a = 3 * (e.x - o.x), l = Qn(r, c, a);
  for (const y of l)
    y > 0 && y < 1 && i.push(y);
  const h = 3 * (-o.y + 3 * e.y - 3 * n.y + s.y), u = 6 * (o.y - 2 * e.y + n.y), f = 3 * (e.y - o.y), d = Qn(h, u, f);
  for (const y of d)
    y > 0 && y < 1 && !i.includes(y) && i.push(y);
  return i.sort((y, x) => y - x);
}
function r1(o, e, n, s) {
  const i = -o.x + 3 * e.x - 3 * n.x + s.x, r = -o.y + 3 * e.y - 3 * n.y + s.y, c = 3 * o.x - 6 * e.x + 3 * n.x, a = 3 * o.y - 6 * e.y + 3 * n.y, l = -3 * o.x + 3 * e.x, h = -3 * o.y + 3 * e.y, u = o.x, f = o.y;
  return { ax: i, ay: r, bx: c, by: a, cx: l, cy: h, dx: u, dy: f };
}
class Ts {
  points;
  constructor(e) {
    this.points = e.map((n) => ({ x: n.x, y: n.y }));
  }
  get p0() {
    return this.points[0];
  }
  get p1() {
    return this.points[1];
  }
  get p2() {
    return this.points[2];
  }
  get p3() {
    return this.points[3];
  }
  // 计算贝塞尔曲线上的点
  evaluate(e) {
    return gc(e, this.p0, this.p1, this.p2, this.p3);
  }
  // 获取极值的根（t值）
  getExtremaRoots() {
    return vc(this.p0, this.p1, this.p2, this.p3);
  }
  // 获取边界框
  getBounds() {
    return wc(this.p0, this.p1, this.p2, this.p3);
  }
  /**
   * 在参数 t 处分割三次贝塞尔曲线
   * @param t - 分割参数 [0, 1]
   * @returns [左半曲线, 右半曲线]
   */
  split(e) {
    const { p0: n, p1: s, p2: i, p3: r } = this, c = 1 - e, a = { x: c * n.x + e * s.x, y: c * n.y + e * s.y }, l = { x: c * s.x + e * i.x, y: c * s.y + e * i.y }, h = { x: c * i.x + e * r.x, y: c * i.y + e * r.y }, u = { x: c * a.x + e * l.x, y: c * a.y + e * l.y }, f = { x: c * l.x + e * h.x, y: c * l.y + e * h.y }, d = { x: c * u.x + e * f.x, y: c * u.y + e * f.y };
    return [
      new Ts([n, a, u, d]),
      new Ts([d, f, h, r])
    ];
  }
  /**
   * 将三次贝塞尔曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   * @returns PointLike[] 点序列（包含起点和终点）
   */
  flatten(e = 0.5) {
    const n = [this.p0], s = (i, r, c, a) => {
      const l = a.x - i.x, h = a.y - i.y, u = l * l + h * h;
      if (u <= 1e-20) {
        if ((r.x - i.x) ** 2 + (r.y - i.y) ** 2 + (c.x - i.x) ** 2 + (c.y - i.y) ** 2 <= e * e) {
          n.push(a);
          return;
        }
      } else {
        const P = Math.abs((r.x - a.x) * h - (r.y - a.y) * l) / Math.sqrt(u), S = Math.abs((c.x - a.x) * h - (c.y - a.y) * l) / Math.sqrt(u);
        if (P <= e && S <= e) {
          n.push(a);
          return;
        }
      }
      const f = 0.5, d = { x: (i.x + r.x) * f, y: (i.y + r.y) * f }, y = { x: (r.x + c.x) * f, y: (r.y + c.y) * f }, x = { x: (c.x + a.x) * f, y: (c.y + a.y) * f }, g = { x: (d.x + y.x) * f, y: (d.y + y.y) * f }, w = { x: (y.x + x.x) * f, y: (y.y + x.y) * f }, M = { x: (g.x + w.x) * f, y: (g.y + w.y) * f };
      s(i, d, g, M), s(M, w, x, a);
    };
    return s(this.p0, this.p1, this.p2, this.p3), n;
  }
  /**
   * 计算点到三次贝塞尔曲线的最小距离
   *
   * 三次贝塞尔的最小距离问题导数为五次方程，无解析解。
   * 采用采样 + Newton 迭代逼近：
   *   1. 均匀采样 N 个点，取最近点的 t 值
   *   2. 在该 t 附近用 Newton 法迭代求精
   *
   * @param px - 点 X
   * @param py - 点 Y
   * @param samples - 采样点数（默认 12）
   * @param iterations - Newton 迭代次数（默认 8）
   * @returns 点到曲线的最小距离
   */
  distanceTo(e, n, s = 12, i = 8) {
    const { p0: r, p1: c, p2: a, p3: l } = this, h = -r.x + 3 * c.x - 3 * a.x + l.x, u = -r.y + 3 * c.y - 3 * a.y + l.y, f = 3 * r.x - 6 * c.x + 3 * a.x, d = 3 * r.y - 6 * c.y + 3 * a.y, y = -3 * r.x + 3 * c.x, x = -3 * r.y + 3 * c.y;
    r.x - e, r.y - n;
    const g = 3 * h, w = 3 * u, M = g * 2, P = w * 2, S = 6 * h, k = 6 * u, O = 2 * f * 2, R = 2 * d * 2;
    let F = 0, Y = 1 / 0;
    for (let K = 0; K <= s; K++) {
      const j = K / s, V = 1 - j, at = V * V, pt = at * V, Et = j * j, vt = Et * j, kt = pt * r.x + 3 * at * j * c.x + 3 * V * Et * a.x + vt * l.x - e, Rt = pt * r.y + 3 * at * j * c.y + 3 * V * Et * a.y + vt * l.y - n, zt = kt * kt + Rt * Rt;
      zt < Y && (Y = zt, F = j);
    }
    let N = F;
    for (let K = 0; K < i; K++) {
      const j = 1 - N, V = j * j, at = V * j, pt = N * N, Et = pt * N, vt = at * r.x + 3 * V * N * c.x + 3 * j * pt * a.x + Et * l.x - e, kt = at * r.y + 3 * V * N * c.y + 3 * j * pt * a.y + Et * l.y - n, Rt = g * pt + M * N + y, zt = w * pt + P * N + x, Ht = S * N + O, Vt = k * N + R, Ut = vt * Rt + kt * zt, U = Rt * Rt + zt * zt + vt * Ht + kt * Vt;
      if (Math.abs(U) < 1e-15) break;
      N = N - Ut / U, N = Math.max(0, Math.min(1, N));
    }
    {
      const K = 1 - N, j = K * K * K * r.x + 3 * K * K * N * c.x + 3 * K * N * N * a.x + N * N * N * l.x - e, V = K * K * K * r.y + 3 * K * K * N * c.y + 3 * K * N * N * a.y + N * N * N * l.y - n, at = j * j + V * V;
      at < Y && (Y = at);
    }
    const $ = r.x - e, W = r.y - n, Q = l.x - e, ct = l.y - n;
    return Y = Math.min(Y, $ * $ + W * W, Q * Q + ct * ct), Math.sqrt(Y);
  }
  /**
   * 计算点在三次贝塞尔曲线上的投影点（最近点）
   *
   * 采用采样 + Newton 迭代逼近：
   *   1. 均匀采样 N 个点，取最近点的 t 值
   *   2. 在该 t 附近用 Newton 法迭代求精
   *   3. 比较端点，取最近者
   *
   * @param px - 点 X
   * @param py - 点 Y
   * @param samples - 采样点数（默认 12）
   * @param iterations - Newton 迭代次数（默认 8）
   * @returns 曲线上距离给定点最近的点
   */
  projectPoint(e, n, s = 12, i = 8) {
    const { p0: r, p1: c, p2: a, p3: l } = this, h = -r.x + 3 * c.x - 3 * a.x + l.x, u = -r.y + 3 * c.y - 3 * a.y + l.y, f = 3 * r.x - 6 * c.x + 3 * a.x, d = 3 * r.y - 6 * c.y + 3 * a.y, y = -3 * r.x + 3 * c.x, x = -3 * r.y + 3 * c.y, g = 3 * h, w = 3 * u, M = g * 2, P = w * 2, S = 6 * h, k = 6 * u, O = 2 * f * 2, R = 2 * d * 2;
    let F = 0, Y = 1 / 0;
    for (let at = 0; at <= s; at++) {
      const pt = at / s, Et = 1 - pt, vt = Et * Et, kt = vt * Et, Rt = pt * pt, zt = Rt * pt, Ht = kt * r.x + 3 * vt * pt * c.x + 3 * Et * Rt * a.x + zt * l.x - e, Vt = kt * r.y + 3 * vt * pt * c.y + 3 * Et * Rt * a.y + zt * l.y - n, Ut = Ht * Ht + Vt * Vt;
      Ut < Y && (Y = Ut, F = pt);
    }
    let N = F;
    for (let at = 0; at < i; at++) {
      const pt = 1 - N, Et = pt * pt, vt = Et * pt, kt = N * N, Rt = kt * N, zt = vt * r.x + 3 * Et * N * c.x + 3 * pt * kt * a.x + Rt * l.x - e, Ht = vt * r.y + 3 * Et * N * c.y + 3 * pt * kt * a.y + Rt * l.y - n, Vt = g * kt + M * N + y, Ut = w * kt + P * N + x, U = S * N + O, J = k * N + R, D = zt * Vt + Ht * Ut, m = Vt * Vt + Ut * Ut + zt * U + Ht * J;
      if (Math.abs(m) < 1e-15) break;
      N = N - D / m, N = Math.max(0, Math.min(1, N));
    }
    {
      const at = 1 - N, pt = at * at * at * r.x + 3 * at * at * N * c.x + 3 * at * N * N * a.x + N * N * N * l.x - e, Et = at * at * at * r.y + 3 * at * at * N * c.y + 3 * at * N * N * a.y + N * N * N * l.y - n, vt = pt * pt + Et * Et;
      vt < Y && (Y = vt, F = N);
    }
    const $ = r.x - e, W = r.y - n, Q = l.x - e, ct = l.y - n, K = $ * $ + W * W, j = Q * Q + ct * ct;
    K < Y && (Y = K, F = 0), j < Y && (F = 1);
    const V = 1 - F;
    return {
      x: V * V * V * r.x + 3 * V * V * F * c.x + 3 * V * F * F * a.x + F * F * F * l.x,
      y: V * V * V * r.y + 3 * V * V * F * c.y + 3 * V * F * F * a.y + F * F * F * l.y
    };
  }
}
function Mc(o, e, n, s, i) {
  const r = o * o, c = r * o, a = 2 * c - 3 * r + 1, l = c - 2 * r + o, h = -2 * c + 3 * r, u = c - r;
  return st.create(
    a * e.x + l * s.x + h * n.x + u * i.x,
    a * e.y + l * s.y + h * n.y + u * i.y
  );
}
function yl(o, e, n, s, i) {
  const r = o * o, c = 6 * r - 6 * o, a = 3 * r - 4 * o + 1, l = -6 * r + 6 * o, h = 3 * r - 2 * o;
  return st.create(
    c * e.x + a * s.x + l * n.x + h * i.x,
    c * e.y + a * s.y + l * n.y + h * i.y
  );
}
function xl(o, e, n, s, i) {
  const r = 12 * o - 6, c = 6 * o - 4, a = -12 * o + 6, l = 6 * o - 2;
  return st.create(
    r * e.x + c * s.x + a * n.x + l * i.x,
    r * e.y + c * s.y + a * n.y + l * i.y
  );
}
function pl(o, e, n, s) {
  const i = [];
  12 * o.x - 6 * n.x - 12 * e.x + 6 * s.x, -6 * o.x + 3 * n.x + 6 * e.x - 2 * s.x, -4 * o.x + n.x + 2 * e.x;
  const r = (d, y, x) => {
    if (Math.abs(d) < 1e-12) {
      if (Math.abs(y) > 1e-12) {
        const S = -x / y;
        S > 0 && S < 1 && i.push(S);
      }
      return;
    }
    const g = y * y - 4 * d * x;
    if (g < 0) return;
    const w = Math.sqrt(g), M = (-y - w) / (2 * d), P = (-y + w) / (2 * d);
    M > 0 && M < 1 && i.push(M), P > 0 && P < 1 && i.push(P);
  }, c = 3 * n.x + 3 * s.x, a = -6 * o.x - 4 * n.x + 6 * e.x - 2 * s.x, l = -6 * o.x + n.x + 6 * e.x;
  r(c, a, l);
  const h = 3 * n.y + 3 * s.y, u = -6 * o.y - 4 * n.y + 6 * e.y - 2 * s.y, f = -6 * o.y + n.y + 6 * e.y;
  return r(h, u, f), i.sort((d, y) => d - y);
}
function ml(o, e, n, s) {
  const i = pl(o, e, n, s), r = [o, e];
  for (const c of i)
    r.push(Mc(c, o, e, n, s));
  return Lt.default().fromPoints(r);
}
function o1(o, e, n, s) {
  return [
    { x: o.x, y: o.y },
    { x: o.x + n.x / 3, y: o.y + n.y / 3 },
    { x: e.x - s.x / 3, y: e.y - s.y / 3 },
    { x: e.x, y: e.y }
  ];
}
class ar {
  /** 起点和终点 */
  p0;
  p1;
  /** 起点和终点的切向量 */
  m0;
  m1;
  constructor(e, n, s, i) {
    this.p0 = { x: e.x, y: e.y }, this.p1 = { x: n.x, y: n.y }, this.m0 = { x: s.x, y: s.y }, this.m1 = { x: i.x, y: i.y };
  }
  /** 计算曲线上参数 t 处的点 */
  evaluate(e) {
    return Mc(e, this.p0, this.p1, this.m0, this.m1);
  }
  /** 计算曲线在 t 处的一阶导数（切向量） */
  derivative(e) {
    return yl(e, this.p0, this.p1, this.m0, this.m1);
  }
  /** 计算曲线在 t 处的二阶导数 */
  secondDerivative(e) {
    return xl(e, this.p0, this.p1, this.m0, this.m1);
  }
  /** 计算曲线在 t 处的法向量 */
  normal(e) {
    const n = this.derivative(e), s = Math.sqrt(n.x * n.x + n.y * n.y);
    return s === 0 ? { x: 0, y: 0 } : { x: -n.y / s, y: n.x / s };
  }
  /** 获取边界框 */
  getBounds() {
    return ml(this.p0, this.p1, this.m0, this.m1);
  }
  /**
   * 在参数 t 处分割曲线
   * @returns [左半曲线, 右半曲线]
   */
  split(e) {
    const n = this.evaluate(e), s = this.derivative(e), i = new ar(this.p0, n, this.m0, s), r = new ar(n, this.p1, s, this.m1);
    return [i, r];
  }
  /**
   * 将曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   */
  flatten(e = 0.5) {
    const n = [{ x: this.p0.x, y: this.p0.y }], s = (i, r, c) => {
      const a = (i + r) * 0.5, l = this.evaluate(a), h = this.evaluate(r), u = h.x - c.x, f = h.y - c.y, d = u * u + f * f;
      if (d < 1e-20) {
        n.push(h);
        return;
      }
      Math.abs((l.x - c.x) * f - (l.y - c.y) * u) / Math.sqrt(d) <= e ? n.push(h) : (s(i, a, c), s(a, r, l));
    };
    return s(0, 1, this.p0), n;
  }
  /**
   * 计算点到曲线的最小距离
   * @param samples - 采样点数（默认 16）
   * @param iterations - Newton 迭代次数（默认 8）
   */
  distanceTo(e, n, s = 16, i = 8) {
    let r = 0, c = 1 / 0;
    for (let d = 0; d <= s; d++) {
      const y = d / s, x = this.evaluate(y), g = x.x - e, w = x.y - n, M = g * g + w * w;
      M < c && (c = M, r = y);
    }
    let a = r;
    for (let d = 0; d < i; d++) {
      const y = this.evaluate(a), x = this.derivative(a), g = this.secondDerivative(a), w = y.x - e, M = y.y - n, P = w * x.x + M * x.y, S = x.x * x.x + x.y * x.y + w * g.x + M * g.y;
      if (Math.abs(S) < 1e-15) break;
      a = a - P / S, a = Math.max(0, Math.min(1, a));
    }
    const l = this.evaluate(a), h = l.x - e, u = l.y - n, f = h * h + u * u;
    return f < c && (c = f), Math.sqrt(c);
  }
  /**
   * 计算点在曲线上的投影点（最近点）
   * @param samples - 采样点数（默认 16）
   * @param iterations - Newton 迭代次数（默认 8）
   */
  projectPoint(e, n, s = 16, i = 8) {
    let r = 0, c = 1 / 0;
    for (let x = 0; x <= s; x++) {
      const g = x / s, w = this.evaluate(g), M = w.x - e, P = w.y - n, S = M * M + P * P;
      S < c && (c = S, r = g);
    }
    let a = r;
    for (let x = 0; x < i; x++) {
      const g = this.evaluate(a), w = this.derivative(a), M = this.secondDerivative(a), P = g.x - e, S = g.y - n, k = P * w.x + S * w.y, O = w.x * w.x + w.y * w.y + P * M.x + S * M.y;
      if (Math.abs(O) < 1e-15) break;
      a = a - k / O, a = Math.max(0, Math.min(1, a));
    }
    const l = this.p0.x - e, h = this.p0.y - n, u = this.p1.x - e, f = this.p1.y - n, d = l * l + h * h, y = u * u + f * f;
    return d < c && (c = d, a = 0), y < c && (a = 1), this.evaluate(a);
  }
}
function gl(o, e, n) {
  let s = 1;
  const i = n[o];
  for (let r = 0; r < n.length; r++) {
    if (r === o) continue;
    const c = i - n[r];
    Math.abs(c) < 1e-12 || (s *= (e - n[r]) / c);
  }
  return s;
}
function lr(o, e, n) {
  const s = e.length, i = n ?? Array.from({ length: s }, (a, l) => s === 1 ? 0 : l / (s - 1));
  let r = 0, c = 0;
  for (let a = 0; a < s; a++) {
    const l = gl(a, o, i);
    r += l * e[a].x, c += l * e[a].y;
  }
  return st.create(r, c);
}
function wl(o, e, n, s = 1e-6) {
  const i = nn(o - s, 0, 1), r = nn(o + s, 0, 1), c = lr(i, e, n), a = lr(r, e, n), l = r - i;
  return l === 0 ? st.create(0, 0) : st.create((a.x - c.x) / l, (a.y - c.y) / l);
}
function c1(o, e, n) {
  const s = e.length, i = new Array(s);
  for (let l = 0; l < s; l++) {
    let h = 1;
    for (let u = 0; u < s; u++) {
      if (u === l) continue;
      const f = n[l] - n[u];
      Math.abs(f) < 1e-12 || (h *= f);
    }
    i[l] = 1 / h;
  }
  for (let l = 0; l < s; l++)
    if (Math.abs(o - n[l]) < 1e-14)
      return st.create(e[l].x, e[l].y);
  let r = 0, c = 0, a = 0;
  for (let l = 0; l < s; l++) {
    const h = i[l] / (o - n[l]);
    r += h * e[l].x, c += h * e[l].y, a += h;
  }
  return a === 0 ? st.create(0, 0) : st.create(r / a, c / a);
}
class a1 {
  /** 插值点（曲线过所有点） */
  points;
  /** 参数节点 */
  knots;
  constructor(e, n) {
    this.points = e.map((i) => ({ x: i.x, y: i.y }));
    const s = e.length;
    this.knots = n ?? Array.from({ length: s }, (i, r) => s === 1 ? 0 : r / (s - 1));
  }
  /** 计算曲线上参数 t∈[0,1] 处的点 */
  evaluate(e) {
    return lr(e, this.points, this.knots);
  }
  /** 计算曲线在 t 处的一阶导数 */
  derivative(e) {
    return wl(e, this.points, this.knots);
  }
  /** 计算曲线在 t 处的法向量 */
  normal(e) {
    const n = this.derivative(e), s = Math.sqrt(n.x * n.x + n.y * n.y);
    return s === 0 ? { x: 0, y: 0 } : { x: -n.y / s, y: n.x / s };
  }
  /** 获取边界框（采样法） */
  getBounds(e = 50) {
    const n = Lt.default();
    for (const s of this.points) n.add(s.x, s.y);
    for (let s = 0; s <= e; s++) {
      const i = this.evaluate(s / e);
      n.add(i.x, i.y);
    }
    return n;
  }
  /**
   * 将曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   * @param samples - 初始采样数（默认 32）
   */
  flatten(e = 0.5, n = 32) {
    const s = [], i = [];
    for (let c = 0; c <= n; c++)
      i.push(this.evaluate(c / n));
    const r = (c, a, l) => {
      const h = Math.floor((c + a) / 2);
      if (h === c || h === a) {
        s.push(i[a]);
        return;
      }
      const u = i[h], f = i[a], d = f.x - l.x, y = f.y - l.y, x = d * d + y * y;
      if (x < 1e-20) {
        s.push(f);
        return;
      }
      Math.abs((u.x - l.x) * y - (u.y - l.y) * d) / Math.sqrt(x) <= e ? s.push(f) : (r(c, h, l), r(h, a, u));
    };
    s.push(i[0]);
    for (let c = 1; c < i.length; c++)
      r(c - 1, c, i[c - 1]);
    return s;
  }
  /**
   * 计算点到曲线的最小距离
   * @param samples - 采样数（默认 50）
   */
  distanceTo(e, n, s = 50) {
    let i = 1 / 0;
    for (let r = 0; r <= s; r++) {
      const c = this.evaluate(r / s), a = c.x - e, l = c.y - n, h = a * a + l * l;
      h < i && (i = h);
    }
    return Math.sqrt(i);
  }
  /**
   * 计算点在曲线上的投影点（最近点）
   * @param samples - 采样数（默认 50）
   */
  projectPoint(e, n, s = 50) {
    let i = 0, r = 1 / 0;
    for (let c = 0; c <= s; c++) {
      const a = c / s, l = this.evaluate(a), h = l.x - e, u = l.y - n, f = h * h + u * u;
      f < r && (r = f, i = a);
    }
    return this.evaluate(i);
  }
}
var vl = /* @__PURE__ */ ((o) => (o[o.A = 0] = "A", o[o.B = 1] = "B", o[o.C = 2] = "C", o[o.D = 3] = "D", o[o.TX = 4] = "TX", o[o.TY = 5] = "TY", o))(vl || {});
class It extends Float32Array {
  static pool = qn.create({
    initSize: 20,
    create: () => It.identity(),
    init(e) {
      e.identity();
    }
  });
  // ---- 静态工厂 ----
  static identity() {
    return new It(1, 0, 0, 1, 0, 0);
  }
  static fromArray(e) {
    return new It(e[0], e[1], e[2], e[3], e[4], e[5]);
  }
  static fromTranslate(e, n) {
    return new It(1, 0, 0, 1, e, n);
  }
  static fromScale(e, n) {
    return new It(e, 0, 0, n, 0, 0);
  }
  static fromRotate(e) {
    const n = Math.cos(e), s = Math.sin(e);
    return new It(n, s, -s, n, 0, 0);
  }
  static fromSkew(e, n) {
    return new It(1, Math.tan(n), Math.tan(e), 1, 0, 0);
  }
  /**
   * 通过变换参数组合构建仿射矩阵（静态，写入 out）。
   *
   * M = T(position) · Sk(skew) · S(scale) · R(rotation) · T(-origin)
   *
   * @param out      写入目标矩阵
   * @param position 平移 { x, y }
   * @param rotation 旋转角 (rad)
   * @param skew     倾斜 { x, y }
   * @param scale    缩放 { x, y }（默认 {1,1}）
   * @param origin   变换原点 { x, y }（默认 {0,0}）
   */
  static fromTranslateRotationSkewScaleOrigin(e, n, s, i, r = { x: 1, y: 1 }, c = { x: 0, y: 0 }) {
    const a = n.x, l = n.y;
    let h = c.x, u = c.y;
    const f = r.x, d = r.y, y = s === 0 ? 1 : Math.cos(s), x = s === 0 ? 0 : Math.sin(s), g = i.x === 0 ? 0 : Math.tan(i.x), w = i.y === 0 ? 0 : Math.tan(i.y);
    let M = a + h, P = l + u, S = y - x * w, k = x + y * w, O = y * g - x, R = x * g + y;
    return S *= f, k *= f, O *= d, R *= d, e[0] = S, e[1] = k, e[2] = O, e[3] = R, e[4] = M - (S * h + O * u), e[5] = P - (k * h + R * u), this;
  }
  static fromTranslationRotationSkewScaleOriginPivot(e, n, s, i, r, c, a) {
    const l = n.x, h = n.y;
    let u = c.x, f = c.y;
    const d = a.x, y = a.y, x = r.x, g = r.y, w = s === 0 ? 1 : Math.cos(s), M = s === 0 ? 0 : Math.sin(s), P = i.x === 0 ? 0 : Math.tan(i.x), S = i.y === 0 ? 0 : Math.tan(i.y);
    let k = l + u, O = h + f, R = w - M * S, F = M + w * S, Y = w * P - M, N = M * P + w;
    return R *= x, F *= x, Y *= g, N *= g, u += d, f += y, e[0] = R, e[1] = F, e[2] = Y, e[3] = N, e[4] = k - (R * u + Y * f), e[5] = O - (F * u + N * f), this;
  }
  // ---- 静态工具 ----
  /** out = a * b */
  static multiply(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = n[4], h = n[5], u = s[0], f = s[1], d = s[2], y = s[3], x = s[4], g = s[5];
    return e[0] = i * u + c * f, e[1] = r * u + a * f, e[2] = i * d + c * y, e[3] = r * d + a * y, e[4] = i * x + c * g + l, e[5] = r * x + a * g + h, e;
  }
  /** out = m 的逆矩阵；行列式为 0 时返回 null */
  static invert(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[3], a = n[4], l = n[5], h = s * c - i * r;
    if (h === 0) return null;
    const u = 1 / h;
    return e[0] = c * u, e[1] = -i * u, e[2] = -r * u, e[3] = s * u, e[4] = (r * l - c * a) * u, e[5] = (i * a - s * l) * u, e;
  }
  /** 判断两个矩阵是否相等 */
  static equals(e, n) {
    return e[0] === n[0] && e[1] === n[1] && e[2] === n[2] && e[3] === n[3] && e[4] === n[4] && e[5] === n[5];
  }
  static mapPoint(e, n, s) {
    const i = s.x, r = s.y;
    return e.x = n[0] * i + n[2] * r + n[4], e.y = n[1] * i + n[3] * r + n[5], e;
  }
  static mapPoints(e, n, s) {
    for (let i = 0; i < s.length; i++)
      e[i] = It.mapPoint(e[i] || { x: 0, y: 0 }, n, s[i]);
    return e;
  }
  // ==================== 实例 API ====================
  constructor(e = 1, n = 0, s = 0, i = 1, r = 0, c = 0) {
    super(6), this[0] = e, this[1] = n, this[2] = s, this[3] = i, this[4] = r, this[5] = c;
  }
  // ---- 命名属性访问器（兼容 Matrix2DLike 接口） ----
  get a() {
    return this[0];
  }
  set a(e) {
    this[0] = e;
  }
  get b() {
    return this[1];
  }
  set b(e) {
    this[1] = e;
  }
  get c() {
    return this[2];
  }
  set c(e) {
    this[2] = e;
  }
  get d() {
    return this[3];
  }
  set d(e) {
    this[3] = e;
  }
  get tx() {
    return this[4];
  }
  set tx(e) {
    this[4] = e;
  }
  get ty() {
    return this[5];
  }
  set ty(e) {
    this[5] = e;
  }
  // ---- 写入 ----
  fromValues(e, n, s, i, r, c) {
    return this[0] = e, this[1] = n, this[2] = s, this[3] = i, this[4] = r, this[5] = c, this;
  }
  identity() {
    return this.fromValues(1, 0, 0, 1, 0, 0);
  }
  fromArray(e) {
    this.fromValues(e[0], e[1], e[2], e[3], e[4], e[5]);
  }
  /** 重置为平移矩阵 */
  fromTranslate(e, n) {
    return this.fromValues(1, 0, 0, 1, e, n);
  }
  /** 重置为缩放矩阵 */
  fromScale(e, n) {
    return this.fromValues(e, 0, 0, n, 0, 0);
  }
  /** 重置为旋转矩阵 */
  fromRotation(e) {
    const n = Math.cos(e), s = Math.sin(e);
    return this.fromValues(n, s, -s, n, 0, 0);
  }
  /** 重置为倾斜矩阵 */
  fromSkew(e, n) {
    return this.fromValues(1, Math.tan(n), Math.tan(e), 1, 0, 0);
  }
  copy(e) {
    return this[0] = e[0], this[1] = e[1], this[2] = e[2], this[3] = e[3], this[4] = e[4], this[5] = e[5], this;
  }
  // ---- 自身变换（this = this * op） ----
  multiplyMatrices(e, n) {
    return It.multiply(this, e, n);
  }
  multiply(e) {
    return It.multiply(this, this, e);
  }
  /** this = m * this */
  premultiply(e) {
    return It.multiply(this, e, this);
  }
  translate(e, n) {
    return this[4] = this[0] * e + this[2] * n + this[4], this[5] = this[1] * e + this[3] * n + this[5], this;
  }
  scale(e, n) {
    return this[0] *= e, this[1] *= e, this[2] *= n, this[3] *= n, this;
  }
  rotate(e) {
    const n = Math.cos(e), s = Math.sin(e), i = this[0], r = this[1], c = this[2], a = this[3];
    return this[0] = i * n + c * s, this[1] = r * n + a * s, this[2] = i * -s + c * n, this[3] = r * -s + a * n, this;
  }
  skew(e, n) {
    const s = Math.tan(e), i = Math.tan(n), r = this[0], c = this[1], a = this[2], l = this[3];
    return this[0] = r + a * i, this[1] = c + l * i, this[2] = r * s + a, this[3] = c * s + l, this;
  }
  fromTranslationRotationScale(e, n, s) {
    return this.fromTranslationRotationScalePivot(e, n, s, { x: 0, y: 0 }), this;
  }
  fromTranslationRotationScalePivot(e, n, s, i) {
    const r = Math.cos(n), c = Math.sin(n), a = s.x * r, l = s.x * c, h = -s.y * c, u = s.y * r, f = e.x - (i.x * a - i.y * h), d = e.y - (i.x * l + i.y * u);
    return this.fromValues(a, l, h, u, f, d), this;
  }
  fromTranslationRotationSkewScaleOriginPivot(e, n, s, i, r, c) {
    return It.fromTranslationRotationSkewScaleOriginPivot(this, e, n, s, i, r, c), this;
  }
  /**
   * 从组合矩阵逆解所有变换分量。
   *
   * 与 fromTranslationRotationSkewScaleOriginPivot 互为逆运算，
   * M = T(pos+origin) · R · Sk · S · T(-origin-pivot) 的矩阵可无损还原。
   *
   * 分解策略:
   *   - 线性部分 L = [a c; b d] 用 QR 分解提取 rotation / scale / skew
   *   - skewY 约定为 0（QR 唯一分解），若原矩阵 skewY ≠ 0 则信息并入 rotation
   *   - origin / pivot 无法从单矩阵唯一确定，约定 origin = (0,0), pivot = (0,0)
   *
   * @returns out 对象（含 position/scale/skew/rotation/origin/pivot）
   */
  static decomposeTransform(e, n = {}) {
    const s = e[0], i = e[1], r = e[2], c = e[3], a = e[4], l = e[5], h = n.position ?? (n.position = { x: 0, y: 0 }), u = n.scale ?? (n.scale = { x: 1, y: 1 });
    h.x = a, h.y = l;
    const f = Math.sqrt(s * s + i * i), d = s / f, y = i / f, x = Math.atan2(y, d), g = s * d + i * y, w = r * d + c * y, M = -r * y + c * d;
    u.x = g, u.y = M;
    const P = w / M, S = n.skew ?? (n.skew = { x: 0, y: 0 });
    S.x = Math.atan(P), S.y = 0, n.rotation = x;
    const k = n.origin ?? (n.origin = { x: 0, y: 0 });
    k.x = 0, k.y = 0;
    const O = n.pivot ?? (n.pivot = { x: 0, y: 0 });
    return O.x = 0, O.y = 0, n.position = h, n.scale = u, n.rotation = x, n;
  }
  decomposeTRSP(e, n = {}) {
    const s = n.position ?? { x: 0, y: 0 }, i = n.scale ?? { x: 1, y: 1 }, r = n.pivot ?? { x: 0, y: 0 };
    if (s.x = e[4], s.y = e[5], i.x = Math.sqrt(e[0] * e[0] + e[1] * e[1]), i.y = Math.sqrt(e[2] * e[2] + e[3] * e[3]), i.x === 0 || i.y === 0)
      throw new Error("Cannot decompose matrix with zero scale");
    const c = Math.atan2(e[1] / i.x, e[0] / i.x), a = new It();
    a.fromValues(e[0], e[1], e[2], e[3], 0, 0);
    const l = a[0] * a[3] - a[1] * a[2];
    if (l === 0) throw new Error("Matrix is not invertible for pivot extraction");
    const h = new It();
    return h.fromValues(a[3] / l, -a[1] / l, -a[2] / l, a[0] / l, 0, 0), r.x = -(h[0] * e[4] + h[2] * e[5] - s.x), r.y = -(h[1] * e[4] + h[3] * e[5] - s.y), n.position.x = s.x, n.position.y = s.y, n.scale.x = i.x, n.scale.y = i.y, n.rotation = c, n.pivot.x = r.x, n.pivot.y = r.y, n;
  }
  /** 实例版：从自身矩阵逆解分量 */
  decomposeTransform(e = {}) {
    return It.decomposeTransform(this, e);
  }
  decomposeTransform2(e = {}) {
    return It.decomposeTransform(this, e);
  }
  fromTranslateRotationSkewScaleOrigin(e, n, s, i = { x: 1, y: 1 }, r = { x: 0, y: 0 }) {
    return It.fromTranslateRotationSkewScaleOrigin(this, e, n, s, i, r), this;
  }
  invert() {
    return It.invert(this, this);
  }
  /**
   * 从变换对象构建矩阵（实例，写入 this）。
   *
   * @param transform { position, scale?, skew?, rotation?, origin? }
   */
  fromTransform(e) {
    return It.fromTranslationRotationSkewScaleOriginPivot(
      this,
      e.position,
      e.rotation ?? 0,
      e.skew ?? { x: 0, y: 0 },
      e.scale ?? { x: 1, y: 1 },
      e.origin ?? { x: 0, y: 0 },
      e.pivot ?? { x: 0, y: 0 }
    ), this;
  }
  // ---- 查询 ----
  /** 行列式 */
  determinant() {
    return this[0] * this[3] - this[1] * this[2];
  }
  isIdentity() {
    return !(this[1] !== 0 || this[2] !== 0 || this[0] !== 1 || this[3] !== 1 || this[4] !== 0 || this[5] !== 0);
  }
  isSingular() {
    return this.determinant() === 0;
  }
  equals(e) {
    return It.equals(this, e);
  }
  /** X 轴缩放量（含旋转影响） */
  getScaleX() {
    return Math.hypot(this[0], this[2]);
  }
  /** Y 轴缩放量（含旋转影响） */
  getScaleY() {
    return Math.hypot(this[1], this[3]);
  }
  /** 旋转角 (rad) */
  getRotation() {
    return Math.atan2(this[1], this[0]);
  }
  // ---- 点变换 ----
  /** p = this * (x, y) */
  mapPoint(e, n) {
    const s = n.x, i = n.y;
    return e.x = this[0] * s + this[2] * i + this[4], e.y = this[1] * s + this[3] * i + this[5], e;
  }
  mapPoints(e, n) {
    for (let s = 0; s < n.length; s++)
      e[s] = this.mapPoint(e[s] || { x: 0, y: 0 }, n[s]);
    return e;
  }
  transformPoint(e) {
    return {
      x: this[0] * e.x + this[2] * e.y + this[4],
      y: this[1] * e.x + this[3] * e.y + this[5]
    };
  }
  // ---- 工具 ----
  clone() {
    return new It(this[0], this[1], this[2], this[3], this[4], this[5]);
  }
  toString() {
    return `Matrix2D(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]}, ${this[4]}, ${this[5]})`;
  }
}
function ro(o, e, n, s) {
  if (e === 0)
    return n >= s[o] && n < s[o + 1] || n === s[s.length - 1] && o === s.length - 2 ? 1 : 0;
  let i = 0;
  const r = s[o + e] - s[o];
  r > 1e-12 && (i += (n - s[o]) / r * ro(o, e - 1, n, s));
  const c = s[o + e + 1] - s[o + 1];
  return c > 1e-12 && (i += (s[o + e + 1] - n) / c * ro(o + 1, e - 1, n, s)), i;
}
function Ml(o, e, n, s) {
  const i = new Array(e + 1).fill(0);
  i[0] = 1;
  const r = new Array(e + 1), c = new Array(e + 1);
  for (let a = 1; a <= e; a++) {
    r[a] = n - s[o + 1 - a], c[a] = s[o + a] - n;
    let l = 0;
    for (let h = 0; h < a; h++) {
      const u = i[h] / (c[h + 1] + r[a - h]);
      i[h] = l + c[h + 1] * u, l = r[a - h] * u;
    }
    i[a] = l;
  }
  return i;
}
function bc(o, e, n, s) {
  if (n >= s[o + 1]) return o;
  if (n <= s[e]) return e;
  let i = e, r = o + 1, c = Math.floor((i + r) / 2);
  for (; n < s[c] || n >= s[c + 1]; )
    n < s[c] ? r = c : i = c, c = Math.floor((i + r) / 2);
  return c;
}
function bl(o, e) {
  const n = new Array(o + e + 2);
  for (let i = 0; i <= e; i++) n[i] = 0;
  const s = o - e;
  for (let i = 1; i <= s; i++) n[e + i] = i / (s + 1);
  for (let i = o + 1; i <= o + e + 1; i++) n[i] = 1;
  return n;
}
function hr(o, e, n, s, i) {
  const r = e.length - 1, c = bc(r, i, o, s), a = Ml(c, i, o, s);
  let l = 0, h = 0, u = 0;
  for (let f = 0; f <= i; f++) {
    const d = c - i + f, y = n[d], x = a[f] * y;
    l += x * e[d].x, h += x * e[d].y, u += x;
  }
  return u === 0 ? st.create(0, 0) : st.create(l / u, h / u);
}
function _l(o, e, n, s, i) {
  const r = e.length - 1;
  bc(r, i, o, s);
  const c = 1e-6, a = nn(o - c, 0, 1), l = nn(o + c, 0, 1), h = hr(a, e, n, s, i), u = hr(l, e, n, s, i), f = l - a;
  return f === 0 ? st.create(0, 0) : st.create((u.x - h.x) / f, (u.y - h.y) / f);
}
class l1 {
  /** 控制点 */
  points;
  /** 权重 */
  weights;
  /** 节点向量 */
  knots;
  /** 次数 */
  degree;
  constructor(e, n, s, i = 3) {
    this.points = e.map((r) => ({ x: r.x, y: r.y })), this.weights = n ?? new Array(e.length).fill(1), this.degree = i, s ? this.knots = s : this.knots = bl(e.length - 1, i);
  }
  /** 计算曲线上参数 u∈[0,1] 处的点 */
  evaluate(e) {
    return hr(e, this.points, this.weights, this.knots, this.degree);
  }
  /** 计算曲线在 u 处的一阶导数 */
  derivative(e) {
    return _l(e, this.points, this.weights, this.knots, this.degree);
  }
  /** 计算曲线在 u 处的法向量 */
  normal(e) {
    const n = this.derivative(e), s = Math.sqrt(n.x * n.x + n.y * n.y);
    return s === 0 ? { x: 0, y: 0 } : { x: -n.y / s, y: n.x / s };
  }
  /** 获取边界框（采样法） */
  getBounds(e = 50) {
    const n = Lt.default();
    for (let s = 0; s <= e; s++) {
      const i = s / e, r = this.evaluate(i);
      n.add(r.x, r.y);
    }
    return n;
  }
  /**
   * 将曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   * @param samples - 初始采样数（默认 32）
   */
  flatten(e = 0.5, n = 32) {
    const s = [], i = [];
    for (let c = 0; c <= n; c++)
      i.push(this.evaluate(c / n));
    const r = (c, a, l) => {
      const h = Math.floor((c + a) / 2);
      if (h === c || h === a) {
        s.push(i[a]);
        return;
      }
      const u = i[h], f = i[a], d = f.x - l.x, y = f.y - l.y, x = d * d + y * y;
      if (x < 1e-20) {
        s.push(f);
        return;
      }
      Math.abs((u.x - l.x) * y - (u.y - l.y) * d) / Math.sqrt(x) <= e ? s.push(f) : (r(c, h, l), r(h, a, u));
    };
    s.push(i[0]);
    for (let c = 1; c < i.length; c++)
      r(c - 1, c, i[c - 1]);
    return s;
  }
  /**
   * 计算点到曲线的最小距离
   * @param samples - 采样数（默认 50）
   */
  distanceTo(e, n, s = 50) {
    let i = 1 / 0;
    for (let r = 0; r <= s; r++) {
      const c = this.evaluate(r / s), a = c.x - e, l = c.y - n, h = a * a + l * l;
      h < i && (i = h);
    }
    return Math.sqrt(i);
  }
  /**
   * 计算点在曲线上的投影点（最近点）
   * @param samples - 采样数（默认 50）
   */
  projectPoint(e, n, s = 50) {
    let i = 0, r = 1 / 0;
    for (let a = 0; a <= s; a++) {
      const l = a / s, h = this.evaluate(l), u = h.x - e, f = h.y - n, d = u * u + f * f;
      d < r && (r = d, i = l);
    }
    let c = i;
    for (let a = 0; a < 8; a++) {
      const l = this.evaluate(c), h = this.derivative(c), u = l.x - e, f = l.y - n, d = u * h.x + f * h.y, y = h.x * h.x + h.y * h.y;
      if (Math.abs(y) < 1e-15) break;
      c = c - d / y, c = nn(c, 0, 1);
    }
    return this.evaluate(c);
  }
}
class De {
  static pool = qn.create({
    initSize: 10,
    create: () => new De(),
    init: (e) => {
      e.topLeft.set(0, 0), e.topRight.set(0, 0), e.bottomRight.set(0, 0), e.bottomLeft.set(0, 0);
    }
  });
  /** 4 个角点（逆时针顺序：topLeft→topRight→bottomRight→bottomLeft） */
  topLeft;
  topRight;
  bottomRight;
  bottomLeft;
  constructor(e = 0, n = 0, s = 0, i = 0, r = 0, c = 0, a = 0, l = 0) {
    this.topLeft = new ht(e, n), this.topRight = new ht(s, i), this.bottomRight = new ht(r, c), this.bottomLeft = new ht(a, l);
  }
  // ---- 派生属性 ----
  /** 中心点（对角线 topLeft-bottomRight 中点） */
  get center() {
    return { x: (this.topLeft.x + this.bottomRight.x) * 0.5, y: (this.topLeft.y + this.bottomRight.y) * 0.5 };
  }
  /** 旋转角（弧度），topLeft→topRight 方向 */
  get rotation() {
    return Math.atan2(this.topRight.y - this.topLeft.y, this.topRight.x - this.topLeft.x);
  }
  /** 宽度 */
  get width() {
    const e = this.topRight.x - this.topLeft.x, n = this.topRight.y - this.topLeft.y;
    return Math.sqrt(e * e + n * n);
  }
  /** 高度 */
  get height() {
    const e = this.bottomLeft.x - this.topLeft.x, n = this.bottomLeft.y - this.topLeft.y;
    return Math.sqrt(e * e + n * n);
  }
  /** 半宽 */
  get halfWidth() {
    return this.width * 0.5;
  }
  /** 半高 */
  get halfHeight() {
    return this.height * 0.5;
  }
  /** 面积 */
  get area() {
    return this.width * this.height;
  }
  /** 局部 X 轴（topLeft→topRight 方向单位向量） */
  getAxisX() {
    const e = this.topRight.x - this.topLeft.x, n = this.topRight.y - this.topLeft.y, s = Math.sqrt(e * e + n * n);
    return s === 0 ? { x: 1, y: 0 } : { x: e / s, y: n / s };
  }
  /** 局部 Y 轴（topLeft→bottomLeft 方向单位向量） */
  getAxisY() {
    const e = this.bottomLeft.x - this.topLeft.x, n = this.bottomLeft.y - this.topLeft.y, s = Math.sqrt(e * e + n * n);
    return s === 0 ? { x: 0, y: 1 } : { x: e / s, y: n / s };
  }
  // ---- 静态工厂 ----
  static default() {
    return new De();
  }
  /** 从 4 个角点创建（逆时针：topLeft→topRight→bottomRight→bottomLeft） */
  static fromCorners(e, n, s, i) {
    return new De(
      e.x,
      e.y,
      n.x,
      n.y,
      s.x,
      s.y,
      i.x,
      i.y
    );
  }
  /** 从 AABB 创建（旋转角为 0） */
  static fromBoundingRect(e) {
    return new De(
      e.left,
      e.top,
      e.right,
      e.top,
      e.right,
      e.bottom,
      e.left,
      e.bottom
    );
  }
  /** 从中心、半尺寸、旋转角创建 */
  static fromCenterRotation(e, n, s, i, r) {
    const c = Math.cos(r), a = Math.sin(r), l = (M, P) => [
      e + M * c - P * a,
      n + M * a + P * c
    ], [h, u] = l(-s, -i), [f, d] = l(s, -i), [y, x] = l(s, i), [g, w] = l(-s, i);
    return new De(h, u, f, d, y, x, g, w);
  }
  /** 从点集计算最小面积 OBB（PCA 方法） */
  static fromPoints(e) {
    if (e.length === 0) return new De();
    let n = 0, s = 0;
    for (const k of e)
      n += k.x, s += k.y;
    n /= e.length, s /= e.length;
    let i = 0, r = 0, c = 0;
    for (const k of e) {
      const O = k.x - n, R = k.y - s;
      i += O * O, r += R * R, c += O * R;
    }
    i /= e.length, r /= e.length, c /= e.length;
    const a = 0.5 * Math.atan2(2 * c, i - r), l = Math.cos(a), h = Math.sin(a);
    let u = 1 / 0, f = 1 / 0, d = -1 / 0, y = -1 / 0;
    for (const k of e) {
      const O = k.x - n, R = k.y - s, F = O * l + R * h, Y = -O * h + R * l;
      F < u && (u = F), Y < f && (f = Y), F > d && (d = F), Y > y && (y = Y);
    }
    const x = (d - u) * 0.5, g = (y - f) * 0.5, w = (u + d) * 0.5, M = (f + y) * 0.5, P = n + w * l - M * h, S = s + w * h + M * l;
    return De.fromCenterRotation(P, S, x, g, a);
  }
  // ---- 获取角点 ----
  /** 获取 4 个角点（逆时针），存入 out */
  getCorners(e) {
    return e[0] || (e[0] = new ht()), e[0].copy(this.topLeft), e[1] || (e[1] = new ht()), e[1].copy(this.topRight), e[2] || (e[2] = new ht()), e[2].copy(this.bottomRight), e[3] || (e[3] = new ht()), e[3].copy(this.bottomLeft), e;
  }
  /** 获取轴对齐包围盒 */
  getBoundingRect() {
    const e = Lt.default();
    return e.add(this.topLeft.x, this.topLeft.y), e.add(this.topRight.x, this.topRight.y), e.add(this.bottomRight.x, this.bottomRight.y), e.add(this.bottomLeft.x, this.bottomLeft.y), e;
  }
  // ---- 包含与相交检测 ----
  /**
   * 判断点是否在 OBB 内部（含边界）
   * 使用叉积符号法：点与每条边形成的三角形方向一致则在内部
   */
  contains(e, n) {
    const s = [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
    for (let i = 0; i < 4; i++) {
      const r = s[i], c = s[(i + 1) % 4];
      if ((c.x - r.x) * (n - r.y) - (c.y - r.y) * (e - r.x) < 0) return !1;
    }
    return !0;
  }
  /**
   * 判断是否与另一个 OBB 相交（分离轴定理 SAT）
   * 2D 中检查 4 个分离轴：两个 OBB 的边法线方向
   */
  intersects(e) {
    const n = [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft], s = [e.topLeft, e.topRight, e.bottomRight, e.bottomLeft], i = (c) => {
      const a = [];
      for (let l = 0; l < 2; l++) {
        const h = c[l + 1].x - c[l].x, u = c[l + 1].y - c[l].y, f = Math.sqrt(h * h + u * u);
        f > 0 && a.push([u / f, h / f]);
      }
      return a;
    }, r = [...i(n), ...i(s)];
    for (const [c, a] of r) {
      let l = 1 / 0, h = -1 / 0;
      for (const d of n) {
        const y = d.x * c + d.y * a;
        y < l && (l = y), y > h && (h = y);
      }
      let u = 1 / 0, f = -1 / 0;
      for (const d of s) {
        const y = d.x * c + d.y * a;
        y < u && (u = y), y > f && (f = y);
      }
      if (h < u || f < l) return !1;
    }
    return !0;
  }
  /** 判断是否与 AABB 相交 */
  intersectsRect(e) {
    const n = De.fromBoundingRect(e);
    return this.intersects(n);
  }
  // ---- 写入 / 变换 ----
  copy(e) {
    return this.topLeft.copy(e.topLeft), this.topRight.copy(e.topRight), this.bottomRight.copy(e.bottomRight), this.bottomLeft.copy(e.bottomLeft), this;
  }
  /** 用中心+半尺寸+旋转角设置 OBB */
  setFromCenterRotation(e, n, s, i, r) {
    const c = Math.cos(r), a = Math.sin(r), l = (M, P) => [
      e + M * c - P * a,
      n + M * a + P * c
    ], [h, u] = l(-s, -i), [f, d] = l(s, -i), [y, x] = l(s, i), [g, w] = l(-s, i);
    return this.topLeft.set(h, u), this.topRight.set(f, d), this.bottomRight.set(y, x), this.bottomLeft.set(g, w), this;
  }
  /**
   * 应用 2D 仿射矩阵变换 OBB。
   * 变换 4 个角点后用 PCA 重新计算紧致包围盒。
   */
  applyMatrix2D(e) {
    const n = [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
    for (const s of n) {
      const i = s.x * e[0] + s.y * e[2] + e[4], r = s.x * e[1] + s.y * e[3] + e[5];
      s.set(i, r);
    }
    return this;
  }
  /** 平移 OBB */
  translate(e, n) {
    return this.topLeft.x += e, this.topLeft.y += n, this.topRight.x += e, this.topRight.y += n, this.bottomRight.x += e, this.bottomRight.y += n, this.bottomLeft.x += e, this.bottomLeft.y += n, this;
  }
  /**
   * 将 OBB 扩展以包含指定点（放宽版，不再是最紧密包围）。
   */
  expandPoint(e, n) {
    if (this.contains(e, n)) return this;
    const s = [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft].map((r) => ({ x: r.x, y: r.y }));
    s.push({ x: e, y: n });
    const i = De.fromPoints(s);
    return this.copy(i), this;
  }
  /** 设置角点 */
  setCorners(e, n, s, i) {
    return this.topLeft.set(e.x, e.y), this.topRight.set(n.x, n.y), this.bottomRight.set(s.x, s.y), this.bottomLeft.set(i.x, i.y), this;
  }
  clone() {
    return new De(
      this.topLeft.x,
      this.topLeft.y,
      this.topRight.x,
      this.topRight.y,
      this.bottomRight.x,
      this.bottomRight.y,
      this.bottomLeft.x,
      this.bottomLeft.y
    );
  }
  toString() {
    return `OrientedBoundingRect(topLeft=(${this.topLeft.x},${this.topLeft.y}) topRight=(${this.topRight.x},${this.topRight.y}) bottomRight=(${this.bottomRight.x},${this.bottomRight.y}) bottomLeft=(${this.bottomLeft.x},${this.bottomLeft.y}))`;
  }
}
function _c(o, e, n, s) {
  const i = 1 - o, r = i * i, c = o * o;
  return st.create(
    r * e.x + 2 * i * o * n.x + c * s.x,
    r * e.y + 2 * i * o * n.y + c * s.y
  );
}
function Tc(o, e, n) {
  const s = [], i = o.x - 2 * e.x + n.x, r = e.x - o.x;
  if (i !== 0) {
    const l = r / i;
    l > 0 && l < 1 && s.push(l);
  }
  const c = o.y - 2 * e.y + n.y, a = e.y - o.y;
  if (c !== 0) {
    const l = a / c;
    l > 0 && l < 1 && !s.includes(l) && s.push(l);
  }
  return s.sort((l, h) => l - h);
}
function Pc(o, e, n) {
  const s = Tc(o, e, n), i = [o, n];
  for (const r of s)
    i.push(_c(r, o, e, n));
  return Lt.default().fromPoints(i);
}
function h1(o, e, n) {
  const s = o.x - 2 * e.x + n.x, i = o.y - 2 * e.y + n.y, r = -2 * o.x + 2 * e.x, c = -2 * o.y + 2 * e.y, a = o.x, l = o.y;
  return { ax: s, ay: i, bx: r, by: c, cx: a, cy: l };
}
class Ps {
  points;
  constructor(e) {
    this.points = e.map((n) => ({ x: n.x, y: n.y }));
  }
  get p0() {
    return this.points[0];
  }
  get p1() {
    return this.points[1];
  }
  get p2() {
    return this.points[2];
  }
  // 计算贝塞尔曲线上的点
  evaluate(e) {
    return _c(e, this.p0, this.p1, this.p2);
  }
  // 获取极值的根（t值）
  getExtremaRoots() {
    return Tc(this.p0, this.p1, this.p2);
  }
  // 获取边界框
  getBounds() {
    return Pc(this.p0, this.p1, this.p2);
  }
  /**
   * 在参数 t 处分割二次贝塞尔曲线
   * @param t - 分割参数 [0, 1]
   * @returns [左半曲线, 右半曲线]
   */
  split(e) {
    const { p0: n, p1: s, p2: i } = this, r = 1 - e, c = { x: r * n.x + e * s.x, y: r * n.y + e * s.y }, a = { x: r * s.x + e * i.x, y: r * s.y + e * i.y }, l = { x: r * c.x + e * a.x, y: r * c.y + e * a.y };
    return [
      new Ps([n, c, l]),
      new Ps([l, a, i])
    ];
  }
  /**
   * 将二次贝塞尔曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   * @returns PointLike[] 点序列（包含起点和终点）
   */
  flatten(e = 0.5) {
    const n = [this.p0], s = (i, r, c) => {
      const a = c.x - i.x, l = c.y - i.y, h = a * a + l * l;
      if (h <= 1e-20) {
        if ((r.x - i.x) ** 2 + (r.y - i.y) ** 2 <= e * e) {
          n.push(c);
          return;
        }
      } else {
        const x = ((r.x - i.x) * a + (r.y - i.y) * l) / h, g = Math.max(0, Math.min(1, x)), w = i.x + g * a, M = i.y + g * l, P = r.x - w, S = r.y - M;
        if (P * P + S * S < e * e) {
          n.push(c);
          return;
        }
      }
      const u = 0.5, f = { x: (i.x + r.x) * u, y: (i.y + r.y) * u }, d = { x: (r.x + c.x) * u, y: (r.y + c.y) * u }, y = { x: (f.x + d.x) * u, y: (f.y + d.y) * u };
      s(i, f, y), s(y, d, c);
    };
    return s(this.p0, this.p1, this.p2), n;
  }
  /**
   * 计算点到二次贝塞尔曲线的最小距离
   * @param px - 点 X
   * @param py - 点 Y
   * @returns 点到曲线的最小距离
   */
  distanceTo(e, n) {
    const { p0: s, p1: i, p2: r } = this, c = s.x - 2 * i.x + r.x, a = s.y - 2 * i.y + r.y, l = 2 * (i.x - s.x), h = 2 * (i.y - s.y), u = s.x - e, f = s.y - n, d = 2 * (c * c + a * a), y = 3 * (c * l + a * h), x = 2 * (c * u + a * f) + (l * l + h * h), g = l * u + h * f, w = bi(d, y, x, g);
    w.push(0, 1);
    let M = 1 / 0;
    for (const P of w) {
      if (P < 0 || P > 1) continue;
      const S = 1 - P, k = S * S * s.x + 2 * S * P * i.x + P * P * r.x, O = S * S * s.y + 2 * S * P * i.y + P * P * r.y, R = k - e, F = O - n, Y = R * R + F * F;
      Y < M && (M = Y);
    }
    return Math.sqrt(M);
  }
  /**
   * 计算点在二次贝塞尔曲线上的投影点（最近点）
   * @param px - 点 X
   * @param py - 点 Y
   * @returns 曲线上距离给定点最近的点
   */
  projectPoint(e, n) {
    const { p0: s, p1: i, p2: r } = this, c = s.x - 2 * i.x + r.x, a = s.y - 2 * i.y + r.y, l = 2 * (i.x - s.x), h = 2 * (i.y - s.y), u = s.x - e, f = s.y - n, d = 2 * (c * c + a * a), y = 3 * (c * l + a * h), x = 2 * (c * u + a * f) + (l * l + h * h), g = l * u + h * f, w = bi(d, y, x, g);
    w.push(0, 1);
    let M = 0, P = 1 / 0;
    for (const k of w) {
      if (k < 0 || k > 1) continue;
      const O = 1 - k, R = O * O * s.x + 2 * O * k * i.x + k * k * r.x, F = O * O * s.y + 2 * O * k * i.y + k * k * r.y, Y = R - e, N = F - n, $ = Y * Y + N * N;
      $ < P && (P = $, M = k);
    }
    const S = 1 - M;
    return {
      x: S * S * s.x + 2 * S * M * i.x + M * M * r.x,
      y: S * S * s.y + 2 * S * M * i.y + M * M * r.y
    };
  }
}
function Tl(o, e, n, s, i, r) {
  const c = Math.min(n.y, s.y, i.y, r.y), a = Math.max(n.y, s.y, i.y, r.y);
  if (e < c || e > a) return 0;
  const l = r.y - 3 * i.y + 3 * s.y - n.y, h = 3 * (i.y - 2 * s.y + n.y), u = 3 * (s.y - n.y), f = n.y - e, d = bi(l, h, u, f);
  let y = 0;
  for (const x of d) {
    if (x <= 0 || x >= 1) continue;
    const g = 1 - x, w = g * g, M = w * g, P = x * x, S = P * x;
    if (M * n.x + 3 * w * x * s.x + 3 * g * P * i.x + S * r.x < o) continue;
    const O = 3 * l * P + 2 * h * x + u;
    O > 0 ? y += 1 : O < 0 && (y -= 1);
  }
  return y;
}
function Pl(o, e, n, s, i) {
  const r = Math.min(n.y, s.y, i.y), c = Math.max(n.y, s.y, i.y);
  if (e < r || e > c) return 0;
  const a = n.y - 2 * s.y + i.y, l = 2 * (s.y - n.y), h = n.y - e, u = Qn(a, l, h);
  let f = 0;
  for (const d of u) {
    if (d <= 0 || d >= 1) continue;
    const y = 1 - d;
    if (y * y * n.x + 2 * y * d * s.x + d * d * i.x < o) continue;
    const g = 2 * a * d + l;
    g > 0 ? f += 1 : g < 0 && (f -= 1);
  }
  return f;
}
function oo(o, e, n, s, i, r) {
  return s === r || e < Math.min(s, r) || e >= Math.max(s, r) ? 0 : o <= n + (i - n) * (e - s) / (r - s) ? r > s ? 1 : -1 : 0;
}
const co = 5;
function Zs(o) {
  return o > 0 && Number.isFinite(o);
}
function Al(o, e) {
  const n = Math.sqrt(o.x * o.x + o.y * o.y), s = Math.sqrt(e.x * e.x + e.y * e.y);
  return n === 0 && s === 0 ? { x: 1, y: 0 } : n === 0 ? { x: e.x / s, y: e.y / s } : s === 0 ? { x: o.x / n, y: o.y / n } : { x: o.x / n + e.x / s, y: o.y / n + e.y / s };
}
function Fi(o, e) {
  return o.x * e.x + o.y * e.y;
}
function On(o, e) {
  return { x: o.x - e.x, y: o.y - e.y };
}
function Js(o, e) {
  return { x: o.x * e, y: o.y * e };
}
function El(o, e, n) {
  const s = e * e - 4 * o * n;
  if (s < 0) return 0.5;
  const i = Math.sqrt(s), r = -0.5 * (e + (e >= 0 ? i : -i)), c = r / o, a = n / r, l = -0.5 * r * o, h = Math.abs(r * r + l) < Math.abs(o * n + l) ? c : a;
  return h > 0 && h < 1 ? h : 0.5;
}
function Ll(o, e) {
  return [
    { x: o[0].x, y: o[0].y, z: 1 },
    { x: o[1].x * e, y: o[1].y * e, z: e },
    { x: o[2].x, y: o[2].y, z: 1 }
  ];
}
function zi(o) {
  return { x: o.x / o.z, y: o.y / o.z };
}
function Ci(o, e, n) {
  const s = o[0] + (o[3] - o[0]) * n, i = o[3] + (o[6] - o[3]) * n;
  e[0] = s, e[3] = s + (i - s) * n, e[6] = i;
}
function Sl(o) {
  return Math.sqrt(0.5 + o * 0.5);
}
class As {
  ax;
  ay;
  bx;
  by;
  cx;
  cy;
  constructor(e, n, s, i, r, c) {
    this.ax = e, this.ay = n, this.bx = s, this.by = i, this.cx = r, this.cy = c;
  }
  static fromPoints(e) {
    const n = e[0], s = e[1], i = e[2], r = n.x, c = n.y, a = 2 * (s.x - r), l = 2 * (s.y - c), h = i.x - 2 * s.x + r, u = i.y - 2 * s.y + c;
    return new As(h, u, a, l, r, c);
  }
  eval(e) {
    return {
      x: (this.ax * e + this.bx) * e + this.cx,
      y: (this.ay * e + this.by) * e + this.cy
    };
  }
}
class ao {
  numer;
  denom;
  constructor(e, n) {
    const s = e[0], i = e[1], r = e[2], c = i.x * n, a = i.y * n;
    this.numer = new As(
      r.x - 2 * c + s.x,
      r.y - 2 * a + s.y,
      2 * (c - s.x),
      2 * (a - s.y),
      s.x,
      s.y
    ), this.denom = new As(
      2 * (1 - n),
      0,
      2 * (n - 1),
      0,
      1,
      0
    );
  }
  eval(e) {
    const n = this.numer.eval(e), s = this.denom.eval(e).x;
    return { x: n.x / s, y: n.y / s };
  }
}
class Yn {
  /** 控制点 [P0, P1, P2] */
  points;
  /** 权重 w，P0 和 P2 恒为 1 */
  weight;
  /** 创建 conic */
  constructor(e, n) {
    this.points = e.map((s) => ({ x: s.x, y: s.y })), this.weight = Zs(n) ? n : 1;
  }
  // ---- 属性 ----
  get p0() {
    return this.points[0];
  }
  get p1() {
    return this.points[1];
  }
  get p2() {
    return this.points[2];
  }
  get w() {
    return this.weight;
  }
  setWeight(e) {
    this.weight = Zs(e) ? e : 1;
  }
  // ---- 求值 ----
  /** 计算曲线上参数 t ∈ [0,1] 处的点 */
  evaluate(e) {
    return ao.prototype.eval.call(
      new ao(this.points, this.weight),
      e
    );
  }
  /** 计算曲线上 t 处的切向量（长度任意，仅方向有意义） */
  evaluateTangentAt(e) {
    const { p0: n, p1: s, p2: i } = this, r = this.weight;
    if (e === 0 && n.x === s.x && n.y === s.y || e === 1 && s.x === i.x && s.y === i.y)
      return { x: i.x - n.x, y: i.y - n.y };
    const c = i.x - n.x, a = i.y - n.y, l = s.x - n.x, h = s.y - n.y, u = r * l, f = r * h, d = r * c - c, y = r * a - a, x = c - 2 * u, g = a - 2 * f;
    return new As(d, y, x, g, u, f).eval(e);
  }
  /** 同时求值和求切线 */
  evaluateWithTangent(e) {
    return {
      point: this.evaluate(e),
      tangent: this.evaluateTangentAt(e)
    };
  }
  // ---- 分割 ----
  /**
   * 在参数 t 处分割，返回两段 conic
   * 基于有理 de Casteljau（在 3D 中做普通 de Casteljau 再投影）
   */
  chopAt(e) {
    const n = this.points, s = this.weight, i = Ll(n, s), r = [i[0].x, 0, 0, i[1].x, 0, 0, i[2].x], c = [i[0].y, 0, 0, i[1].y, 0, 0, i[2].y], a = [i[0].z, 0, 0, i[1].z, 0, 0, i[2].z], l = new Array(7).fill(0), h = new Array(7).fill(0), u = new Array(7).fill(0);
    Ci(r, l, e), Ci(c, h, e), Ci(a, u, e);
    const f = zi({ x: l[0], y: h[0], z: u[0] }), d = zi({ x: l[3], y: h[3], z: u[3] }), y = zi({ x: l[6], y: h[6], z: u[6] }), x = Math.sqrt(u[3]), g = u[0] / x, w = u[6] / x;
    if (!Number.isFinite(g) || !Number.isFinite(w) || !Number.isFinite(f.x) || !Number.isFinite(f.y) || !Number.isFinite(d.x) || !Number.isFinite(d.y) || !Number.isFinite(y.x) || !Number.isFinite(y.y)) return null;
    const M = new Yn([n[0], f, d], g), P = new Yn([d, y, n[2]], w);
    return [M, P];
  }
  /** 在 t=0.5 处分割 */
  chop() {
    const e = this.points, n = this.weight, s = 1 / (1 + n), i = e[0], r = e[1], c = e[2], a = n * s, l = i.x * s, h = i.y * s, u = r.x * a, f = r.y * a, d = c.x * s, y = c.y * s, x = { x: l + u, y: h + f }, g = { x: u + d, y: f + y }, w = { x: 0.5 * l + u + 0.5 * d, y: 0.5 * h + f + 0.5 * y }, M = Sl(n);
    return [
      new Yn([i, x, w], M),
      new Yn([w, g, c], M)
    ];
  }
  // ---- 近似误差 ----
  /** 计算用二次贝塞尔近似此 conic 的误差向量 */
  computeAsQuadError() {
    const e = this.weight, { p0: n, p1: s, p2: i } = this, r = e - 1, c = r / (4 * (2 + r));
    return {
      x: c * (n.x - 2 * s.x + i.x),
      y: c * (n.y - 2 * s.y + i.y)
    };
  }
  /** 判断用二次贝塞尔近似是否在容差内 */
  asQuadTol(e) {
    const n = this.computeAsQuadError();
    return n.x * n.x + n.y * n.y <= e * e;
  }
  /** 计算近似所需二次曲线的 2 的幂次数 */
  computeQuadPOW2(e) {
    if (e < 0 || !Number.isFinite(e) || !Zs(this.weight)) return 0;
    const n = this.computeAsQuadError();
    let s = Math.sqrt(n.x * n.x + n.y * n.y), i = 0;
    for (; i < co && !(s <= e); )
      s *= 0.25, i++;
    return i;
  }
  // ---- 转为二次贝塞尔序列 ----
  /**
   * 将 conic 近似为 2^pow2 段二次贝塞尔曲线
   * 返回点数组，相邻三段为一段二次贝塞尔 [p0,p1,p2, p0,p1,p2, ...]
   * 相邻段共享端点，总点数 = 2 * 2^pow2 + 1
   */
  chopIntoQuadsPOW2(e) {
    e = Math.max(0, Math.min(e, co));
    const n = this.weight;
    Zs(n) || (e = 0);
    const i = 2 * (1 << e) + 1, r = new Array(i);
    if (r[0] = { x: this.p0.x, y: this.p0.y }, e > 0) {
      const a = this._subdivide(e);
      for (let l = 0; l < a.length; l++)
        r[l + 1] = a[l];
    } else
      r[1] = { x: this.p1.x, y: this.p1.y }, r[2] = { x: this.p2.x, y: this.p2.y };
    let c = !0;
    for (let a = 0; a < i; a++)
      if (!Number.isFinite(r[a].x) || !Number.isFinite(r[a].y)) {
        c = !1;
        break;
      }
    if (!c)
      for (let a = 1; a < i - 1; a++)
        r[a] = { x: this.p1.x, y: this.p1.y };
    return r;
  }
  /** 递归细分，返回中间点（不含首尾） */
  _subdivide(e) {
    if (e <= 0)
      return [
        { x: this.p1.x, y: this.p1.y },
        { x: this.p2.x, y: this.p2.y }
      ];
    const [n, s] = this.chop(), i = this.p0.y, r = this.p2.y, c = n.points;
    if (this._between(i, this.p1.y, r)) {
      const h = c[2].y;
      if (!this._between(i, h, r)) {
        const u = Math.abs(h - i) < Math.abs(h - r) ? i : r;
        n.points[2].y = s.points[0].y = u;
      }
      this._between(i, c[1].y, c[2].y) || (n.points[1].y = i), this._between(s.points[0].y, s.points[1].y, r) || (s.points[1].y = r);
    }
    const a = n._subdivide(e - 1), l = s._subdivide(e - 1);
    return [...a, ...l];
  }
  _between(e, n, s) {
    return (e - n) * (s - n) <= 0;
  }
  /**
   * 将 conic 转为二次贝塞尔曲线数组
   * @param tol - 近似容差，默认 0.25
   * @returns QuadraticBezier 控制点数组 [[p0,p1,p2], [p0,p1,p2], ...]
   */
  toQuadraticBeziers(e = 0.25) {
    const n = this.computeQuadPOW2(e), s = this.chopIntoQuadsPOW2(n), i = 1 << n, r = [];
    for (let c = 0; c < i; c++)
      r.push([
        s[c * 2],
        s[c * 2 + 1],
        s[c * 2 + 2]
      ]);
    return r;
  }
  // ---- 极值 ----
  /** 查找 X 极值的参数 t */
  findXExtrema() {
    return this._findExtrema("x");
  }
  /** 查找 Y 极值的参数 t */
  findYExtrema() {
    return this._findExtrema("y");
  }
  _findExtrema(e) {
    const n = this.weight, s = this.points, i = e === "x" ? s[2].x - s[0].x : s[2].y - s[0].y, r = e === "x" ? s[1].x - s[0].x : s[1].y - s[0].y, c = n * r, a = n * i - i, l = i - 2 * c, u = Qn(a, l, c);
    if (u.length === 1 && u[0] > 0 && u[0] < 1)
      return u[0];
    for (const f of u)
      if (f > 0 && f < 1) return f;
    return null;
  }
  /** 在 X 极值处分割 */
  chopAtXExtrema() {
    const e = this.findXExtrema();
    if (e === null) return null;
    const n = this.chopAt(e);
    if (!n) return null;
    const s = n[0].points[2].x;
    return n[0].points[1].x = s, n[1].points[0].x = s, n[1].points[1].x = s, n;
  }
  /** 在 Y 极值处分割 */
  chopAtYExtrema() {
    const e = this.findYExtrema();
    if (e === null) return null;
    const n = this.chopAt(e);
    if (!n) return null;
    const s = n[0].points[2].y;
    return n[0].points[1].y = s, n[1].points[0].y = s, n[1].points[1].y = s, n;
  }
  // ---- 包围盒 ----
  /** 计算紧凑包围盒 */
  computeTightBounds() {
    const e = [{ x: this.p0.x, y: this.p0.y }, { x: this.p2.x, y: this.p2.y }];
    let n;
    return n = this.findXExtrema(), n !== null && e.push(this.evaluate(n)), n = this.findYExtrema(), n !== null && e.push(this.evaluate(n)), Lt.default().fromPoints(e);
  }
  /** 计算快速包围盒（仅用控制点） */
  computeFastBounds() {
    return Lt.default().fromPoints(this.points);
  }
  /** 获取包围盒（紧凑版） */
  getBounds() {
    return this.computeTightBounds();
  }
  // ---- 中间切线 ----
  /** 找到中间切线的参数 t */
  findMidTangent() {
    const { p0: e, p1: n, p2: s } = this, i = this.weight, r = On(n, e), c = On(s, n), a = Js(c, -1), l = Al(r, a), h = On(s, e), u = Js(h, i - 1), f = On(h, Js(On(n, e), i * 2)), d = Js(On(n, e), i), y = Fi(l, u), x = Fi(l, f), g = Fi(l, d);
    return El(y, x, g);
  }
}
var Il = /* @__PURE__ */ ((o) => (o[o.MoveTo = 1] = "MoveTo", o[o.LineTo = 2] = "LineTo", o[o.QuadraticTo = 4] = "QuadraticTo", o[o.CubicTo = 8] = "CubicTo", o[o.Close = 16] = "Close", o))(Il || {});
const Qs = {
  Arc: 1,
  Rect: 2,
  Ellipse: 4,
  RoundRect: 8
}, ql = {
  1: 1,
  2: 1,
  4: 2,
  8: 3,
  16: 0
};
var Dl = /* @__PURE__ */ ((o) => (o.M = "M", o.L = "L", o.Q = "Q", o.C = "C", o.Z = "Z", o.A = "A", o.R = "R", o.E = "E", o.RR = "RR", o))(Dl || {}), Ol = /* @__PURE__ */ ((o) => (o[o.CW = 0] = "CW", o[o.CCW = 1] = "CCW", o[o.Unknown = 2147483647] = "Unknown", o))(Ol || {});
class tn {
  static fromSvgPath(e) {
    return lo(e);
  }
  static default() {
    return new tn();
  }
  cmds;
  verbs;
  // 路径命令
  points;
  // 路径点
  lastMoveIndex = -1;
  // 最后一个移动点的索引
  needMoveTo = !0;
  // 是否需要移动到下一个点
  segmentType = 0;
  // 路径段类型
  /** 包围盒缓存（null 表示未计算或路径为空） */
  _bounds = null;
  /** 紧凑包围盒缓存（null 表示未计算或路径为空） */
  _tightBounds = null;
  /** 包围盒是否需要重新计算 */
  _boundsDirty = !0;
  _tightBoundsDirty = !0;
  /**路径发生变变化 */
  drity = !1;
  constructor(e) {
    this.verbs = [], this.points = [], this.cmds = [], e instanceof tn ? this.copy(e) : typeof e == "string" && this.copy(lo(e));
  }
  get lastVerb() {
    return this.verbs[this.verbs.length - 1];
  }
  get lastPoint() {
    return this.points[this.points.length - 1];
  }
  get lastMovePoint() {
    return this.points[this.lastMoveIndex];
  }
  get size() {
    return this.verbs.length;
  }
  clone() {
    const e = new tn();
    return e.copy(this), e;
  }
  copy(e) {
    this.cmds = e.cmds.map((n) => n.slice()), this.verbs = e.verbs.slice(), this.points = e.points.map((n) => ({ x: n.x, y: n.y })), this.lastMoveIndex = e.lastMoveIndex, this.needMoveTo = e.needMoveTo, this.segmentType = e.segmentType, this.drity = e.drity, this._boundsDirty = e._boundsDirty;
  }
  reset() {
    this.cmds = [], this.verbs = [], this.points = [], this.lastMoveIndex = -1, this.segmentType = 0, this.needMoveTo = !0, this.drity = !0, this._boundsDirty = !0, this._tightBoundsDirty = !0;
  }
  markDirty() {
    this.drity = !0, this._boundsDirty = !0, this._tightBoundsDirty = !0;
  }
  transform(e) {
    It.mapPoints(this.points, e, this.points), this.markDirty();
  }
  addPath(e, n) {
    e = e.clone(), n && e.transform(n);
    const s = this.points.length;
    this.segmentType |= e.segmentType, this.lastMoveIndex = s + e.lastMoveIndex, this.needMoveTo = e.needMoveTo, this.verbs = this.verbs.concat(e.verbs), this.points = this.points.concat(e.points), this.markDirty();
  }
  addReversePath(e) {
    e.invertVisit({
      moveTo: (n) => {
        this.moveTo(n.x, n.y);
      },
      lineTo: (n, s) => {
        this.lineTo(s.x, s.y);
      },
      quadraticCurveTo: (n, s, i) => {
        this.quadraticCurveTo(s.x, s.y, i.x, i.y);
      },
      cubicCurveTo: (n, s, i, r) => {
        this.bezierCurveTo(s.x, s.y, i.x, i.y, r.x, r.y);
      },
      close: () => {
        this.closePath();
      }
    });
  }
  // ignore move
  reversePathTo(e) {
    e.isEmpty || e.invertVisit({
      moveTo: (n) => {
      },
      lineTo: (n, s) => {
        this.lineTo(s.x, s.y);
      },
      quadraticCurveTo: (n, s, i) => {
        this.quadraticCurveTo(s.x, s.y, i.x, i.y);
      },
      cubicCurveTo: (n, s, i, r) => {
        this.bezierCurveTo(s.x, s.y, i.x, i.y, r.x, r.y);
      },
      close: () => {
        this.closePath();
      }
    });
  }
  offset(e, n) {
    for (let s = 0; s < this.points.length; s++)
      this.points[s].x += e, this.points[s].y += n;
  }
  get isEmpty() {
    return this.verbs.length === 0;
  }
  ensureMove() {
    this.needMoveTo && (this.isEmpty ? this.moveTo(0, 0) : this.moveTo(this.lastPoint.x, this.lastPoint.y));
  }
  moveTo(e, n) {
    this.lastVerb === 1 ? (this.lastPoint.x = e, this.lastPoint.y = n) : (this.verbs.push(
      1
      /* MoveTo */
    ), this.points.push({ x: e, y: n })), this.lastMoveIndex = this.points.length - 1, this.needMoveTo = !1, this.markDirty();
  }
  lineTo(e, n) {
    this.ensureMove(), this.verbs.push(
      2
      /* LineTo */
    ), this.points.push({ x: e, y: n }), this.markDirty();
  }
  quadraticCurveTo(e, n, s, i) {
    this.ensureMove(), this.verbs.push(
      4
      /* QuadraticTo */
    ), this.points.push({ x: e, y: n }), this.points.push({ x: s, y: i }), this.markDirty();
  }
  bezierCurveTo(e, n, s, i, r, c) {
    this.ensureMove(), this.verbs.push(
      8
      /* CubicTo */
    ), this.points.push({ x: e, y: n }), this.points.push({ x: s, y: i }), this.points.push({ x: r, y: c }), this.markDirty();
  }
  conicTo(e, n, s, i, r) {
    if (r <= 0)
      return this.quadraticCurveTo(e, n, s, i);
    const c = 4 * r / (3 * (r + 1)), a = this.lastPoint, l = a.x + (e - a.x) * c, h = a.y + (n - a.y) * c, u = s + (e - s) * c, f = i + (n - i) * c;
    this.bezierCurveTo(l, h, u, f, s, i);
  }
  conicToQuad(e, n, s, i, r) {
    const a = new Yn([{ x: this.lastPoint.x, y: this.lastPoint.y }, { x: e, y: n }, { x: s, y: i }], r).toQuadraticBeziers();
    for (let l = 0; l < a.length; l++) {
      const [h, u, f] = a[l];
      this.quadraticCurveTo(u.x, u.y, f.x, f.y);
    }
  }
  rect(e, n, s, i) {
    this.moveTo(e, n), this.lineTo(e + s, n), this.lineTo(e + s, n + i), this.lineTo(e, n + i), this.lineTo(e, n), this.segmentType |= Qs.Rect;
  }
  /**
   * 添加圆弧路径
   *
   * 将圆弧分成最多 90° 一段，每段用三次贝塞尔曲线近似。
   * 近似公式：k = 4/3 * tan(θ/4)，控制点沿切线方向偏移 k * radius。
   *
   * @param x - 圆心 X
   * @param y - 圆心 Y
   * @param radius - 半径
   * @param startAngle - 起始角度（弧度）
   * @param endAngle - 结束角度（弧度）
   * @param counterclockwise - 是否逆时针（默认顺时针）
   */
  arc(e, n, s, i, r, c = !1) {
    const { startAngle: a, endAngle: l } = cr(i, r, c), h = l - a, u = Math.max(1, Math.ceil(Math.abs(h) / (Math.PI / 2))), f = h / u;
    let d = a;
    for (let y = 0; y < u; y++) {
      const x = d, g = d + f, w = e + s * Math.cos(x), M = n + s * Math.sin(x);
      y === 0 && (this.isEmpty ? this.moveTo(w, M) : this.lineTo(w, M));
      const P = f, S = 4 / 3 * Math.tan(P / 4), k = w - S * s * Math.sin(x), O = M + S * s * Math.cos(x), R = e + s * Math.cos(g), F = n + s * Math.sin(g), Y = R + S * s * Math.sin(g), N = F - S * s * Math.cos(g);
      this.bezierCurveTo(k, O, Y, N, R, F), d = g;
    }
    this.segmentType |= Qs.Arc;
  }
  /**
   * 添加椭圆路径
   *
   * 参数化：E(t) = center + R(rotation) * (rx·cos(t), ry·sin(t))
   * 每段用三次贝塞尔曲线近似，控制点沿切线方向偏移。
   *
   * @param x - 椭圆中心 X
   * @param y - 椭圆中心 Y
   * @param radiusX - X 轴半径
   * @param radiusY - Y 轴半径
   * @param rotation - 旋转角度（弧度）
   * @param startAngle - 起始角度（弧度）
   * @param endAngle - 结束角度（弧度）
   * @param counterclockwise - 是否逆时针（默认顺时针）
   */
  ellipse(e, n, s, i, r, c, a, l = !1) {
    const { startAngle: h, endAngle: u } = cr(c, a, l), f = u - h, d = Math.max(1, Math.ceil(Math.abs(f) / (Math.PI / 2))), y = f / d, x = Math.cos(r), g = Math.sin(r);
    let w = h;
    for (let M = 0; M < d; M++) {
      const P = w, S = w + y, k = Math.cos(P), O = Math.sin(P), R = e + x * s * k - g * i * O, F = n + g * s * k + x * i * O;
      M === 0 && (this.isEmpty ? this.moveTo(R, F) : this.lineTo(R, F));
      const Y = y, N = 4 / 3 * Math.tan(Y / 4), $ = -s * O, W = i * k, Q = R + N * (x * $ - g * W), ct = F + N * (g * $ + x * W), K = Math.cos(S), j = Math.sin(S), V = e + x * s * K - g * i * j, at = n + g * s * K + x * i * j, pt = -s * j, Et = i * K, vt = V - N * (x * pt - g * Et), kt = at - N * (g * pt + x * Et);
      this.bezierCurveTo(Q, ct, vt, kt, V, at), w = S;
    }
    this.segmentType |= Qs.Ellipse;
  }
  /**
   * 添加圆弧连接（arcTo）
   *
   * 从当前点到 (x1, y1) 的线段与 (x1, y1) 到 (x2, y2) 的线段之间，
   * 绘制一个半径为 radius 的圆弧（与两条线段相切）。
   * 如果当前点与 (x1, y1) 不重合，会先画一条 lineTo 到切点。
   *
   * @param x1 - 第一条切线的终点 X
   * @param y1 - 第一条切线的终点 Y
   * @param x2 - 第二条切线的终点 X
   * @param y2 - 第二条切线的终点 Y
   * @param radius - 圆弧半径
   */
  arcToConic(e, n, s, i, r) {
    if (this.ensureMove(), r === 0) {
      this.lineTo(e, n);
      return;
    }
    const c = this.lastPoint, a = ht.fromPoint(c), l = ht.create(e, n), h = ht.create(s, i);
    let u = l.clone().subtract(a).normalize(), f = h.clone().subtract(l).normalize(), d = u.dot(f), y = u.cross(f);
    if (!u.isFinite() || !f.isFinite() || Math.abs(y) <= 1e-6)
      return this.lineTo(e, n);
    let x = Math.abs(r * (1 - d) / y), g = l.clone().subtract(u.multiplyScalar(x)), w = l.clone().add(f.multiplyScalar(x)), M = Math.sqrt(0.5 + d * 0.5);
    this.lineTo(g.x, g.y), this.conicTo(e, n, w.x, w.y, M);
  }
  /**
   * 添加圆弧连接（arcTo）
   *
   * 从当前点到 (x1, y1) 的线段与 (x1, y1) 到 (x2, y2) 的线段之间，
   * 绘制一个半径为 radius 的圆弧（与两条线段相切）。
   * 如果当前点与 (x1, y1) 不重合，会先画一条 lineTo 到切点。
   *
   * @param x1 - 第一条切线的终点 X
   * @param y1 - 第一条切线的终点 Y
   * @param x2 - 第二条切线的终点 X
   * @param y2 - 第二条切线的终点 Y
   * @param radius - 圆弧半径
   */
  arcTo(e, n, s, i, r) {
    this.ensureMove();
    const c = this.lastPoint, a = c.x, l = c.y, h = e - a, u = n - l, f = s - e, d = i - n, y = Math.sqrt(h * h + u * u), x = Math.sqrt(f * f + d * d);
    if (y < 1e-10 || x < 1e-10 || r < 1e-10) {
      this.lineTo(e, n);
      return;
    }
    const g = h / y, w = u / y, M = f / x, P = d / x, S = g * M + w * P, k = g * P - w * M;
    if (Math.abs(k) < 1e-10) {
      this.lineTo(e, n);
      return;
    }
    const O = k > 0 ? 1 : -1, R = Math.abs(r * Math.tan(Math.acos(S) / 2)), F = e - R * g, Y = n - R * w, N = e + R * M, $ = n + R * P, W = -w, Q = g, ct = F + O * r * W, K = Y + O * r * Q, j = Math.atan2(Y - K, F - ct), V = Math.atan2($ - K, N - ct);
    this.lineTo(F, Y);
    const at = O < 0;
    this.arc(ct, K, r, j, V, at);
  }
  /**
   * 添加圆角矩形路径
   *
   * 支持统一圆角或多个圆角分别指定。
   *
   * @param x - 矩形左上角 X
   * @param y - 矩形左上角 Y
   * @param w - 矩形宽度
   * @param h - 矩形高度
   * @param radii - 圆角半径（支持多种格式）
   *   - number: 所有角统一半径
   *   - [all]: 四个角统一半径 [r]
   *   - [tl, br]: 左上和右下相同，右上和左下相同
   *   - [tl, tr, br, bl]: 分别指定四个角
   */
  roundRect(e, n, s, i, r) {
    let c = 0, a = 0, l = 0, h = 0;
    if (r === void 0 || r === 0) {
      this.rect(e, n, s, i);
      return;
    }
    if (typeof r == "number")
      c = a = l = h = r;
    else {
      const y = r, x = y.length;
      if (x === 0) {
        this.rect(e, n, s, i);
        return;
      }
      c = y[0], x === 1 ? a = l = h = c : x === 2 ? (a = y[1], l = c, h = a) : x === 3 ? (a = y[1], l = y[2], h = a) : (a = y[1], l = y[2], h = y[3]);
    }
    c = Math.max(0, c), a = Math.max(0, a), l = Math.max(0, l), h = Math.max(0, h);
    let u = 1;
    const f = s > 0 ? Math.min(1, s / (c + a), s / (h + l)) : 0, d = i > 0 ? Math.min(1, i / (c + h), i / (a + l)) : 0;
    u = Math.min(f, d), u < 1 && (c *= u, a *= u, l *= u, h *= u), this.moveTo(e + c, n), this.lineTo(e + s - a, n), a > 0 && this.arcTo(e + s, n, e + s, n + a, a), this.lineTo(e + s, n + i - l), l > 0 && this.arcTo(e + s, n + i, e + s - l, n + i, l), this.lineTo(e + h, n + i), h > 0 && this.arcTo(e, n + i, e, n + i - h, h), this.lineTo(e, n + c), c > 0 && this.arcTo(e, n, e + c, n, c), this.closePath(), this.segmentType |= Qs.RoundRect;
  }
  /**
   * 添加 SVG 椭圆弧路径（SVG Arc A/a 命令转换）
   *
   * 将 SVG 弧线的端点参数化（起点+终点+半径+旋转+大弧/扫掠标志）
   * 转换为中心参数化（圆心+半径+起始/终止角度），再委托 ellipse() 绘制。
   *
   * 算法遵循 SVG 规范：
   *   https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
   *
   * @param x1 - 起点 X
   * @param y1 - 起点 Y
   * @param x2 - 终点 X
   * @param y2 - 终点 Y
   * @param rx - X 轴半径
   * @param ry - Y 轴半径
   * @param rotation - 椭圆的旋转角度（弧度）
   * @param largeArcFlag - true=大弧, false=小弧
   * @param sweepFlag - true=顺时针, false=逆时针
   */
  ellipseSvgArc(e, n, s, i, r, c, a, l, h) {
    if (Math.abs(e - s) < 1e-10 && Math.abs(n - i) < 1e-10) return;
    if (r = Math.abs(r), c = Math.abs(c), r < 1e-10 || c < 1e-10) {
      this.lineTo(s, i);
      return;
    }
    const u = Math.cos(a), f = Math.sin(a), d = (e - s) / 2, y = (n - i) / 2, x = u * d + f * y, g = -f * d + u * y, w = x * x / (r * r) + g * g / (c * c);
    if (w > 1) {
      const pt = Math.sqrt(w);
      r *= pt, c *= pt;
    }
    const M = r * r, P = c * c, S = x * x, k = g * g, O = Math.max(
      0,
      (M * P - M * k - P * S) / (M * k + P * S)
    ), R = l !== h ? 1 : -1, F = Math.sqrt(O), Y = R * F * (r * g / c), N = R * F * (-c * x / r), $ = u * Y - f * N + (e + s) / 2, W = f * Y + u * N + (n + i) / 2, Q = (x - Y) / r, ct = (g - N) / c, K = (-x - Y) / r, j = (-g - N) / c, V = Math.atan2(ct, Q), at = Math.atan2(j, K);
    this.ellipse($, W, r, c, a, V, at, !h);
  }
  closePath() {
    this.isEmpty || (this.lastVerb !== 16 && this.verbs.push(
      16
      /* Close */
    ), this.needMoveTo = !0);
  }
  /**
   * 判断点是否在路径填充区域内
   *
   * 先用包围盒快速拒绝，再根据填充规则用绕数法判断：
   * - 'nonzero'（默认）：绕数不为 0 则在内部
   * - 'evenodd'：绕数为奇数则在内部
   *
   * @param px - 测试点 X
   * @param py - 测试点 Y
   * @param fillRule - 填充规则，默认 'nonzero'
   */
  isPointInPath(e, n, s = "nonzero") {
    const i = this.computeTightBounds();
    if (!i || !i.contains(e, n))
      return !1;
    let r = 0;
    return this.visit({
      lineTo: (c, a) => {
        r += oo(e, n, c.x, c.y, a.x, a.y);
      },
      quadraticCurveTo: (c, a, l) => {
        r += Pl(
          e,
          n,
          c,
          a,
          l
        );
      },
      cubicCurveTo: (c, a, l, h) => {
        r += Tl(
          e,
          n,
          c,
          a,
          l,
          h
        );
      },
      close: (c, a) => {
        ht.equalsEpsilon(c, a) || (r += oo(e, n, c.x, c.y, a.x, a.y));
      }
    }), s === "evenodd" ? (r & 1) !== 0 : r !== 0;
  }
  invertVisit(e) {
    const n = this.points, s = this.verbs;
    let i = 0, r = !0, c = !1, a = ht.create();
    for (let l = s.length - 1, h = n.length; l >= 0; l--) {
      let u = s[l];
      switch (r && (h -= 1, r = !1, e.moveTo?.(n[h]), a.copy(n[h]), i = h), u) {
        case 1:
          c && (e.close?.(a, n[i]), c = !1), r = !0;
          break;
        case 2:
          h -= 1, e.lineTo?.(a, n[h]), a.copy(n[h]);
          break;
        case 4:
          h -= 2, e.quadraticCurveTo?.(a, n[h + 1], n[h]), a.copy(n[h]);
          break;
        case 8:
          h -= 3, e.cubicCurveTo?.(a, n[h + 2], n[h + 1], n[h]), a.copy(n[h]);
          break;
        case 16:
          c = !0;
          break;
      }
    }
  }
  visit(e) {
    const n = this.points, s = this.size;
    let i = 0, r = ht.default();
    for (let c = 0; c < s; c++) {
      const a = this.verbs[c], l = ql[a];
      switch (i += l, a) {
        case 1:
          r.copy(n[i - 1]), e.moveTo?.(n[i - 1]);
          break;
        case 2:
          e.lineTo?.(n[i - 2], n[i - 1]);
          break;
        case 4:
          e.quadraticCurveTo?.(n[i - 3], n[i - 2], n[i - 1]);
          break;
        case 8:
          e.cubicCurveTo?.(n[i - 4], n[i - 3], n[i - 2], n[i - 1]);
          break;
        case 16:
          e.close?.(n[i - 1], r);
          break;
      }
    }
  }
  /**
   * 计算路径的包围盒（带缓存）
   * 路径未变化时返回缓存，避免重复遍历。
   * @returns { minX, minY, maxX, maxY } 包围盒，路径为空时返回 null
   */
  computeBounds() {
    return this._boundsDirty ? (this._bounds || (this._bounds = Lt.default()), this._bounds.setEmpty(), this.points.forEach((e) => {
      this._bounds.expandPoint(e);
    }), this.isEmpty && this._bounds.fromLTRB(0, 0, 0, 0), this._boundsDirty = !1, this._bounds) : this._bounds;
  }
  /**
   * 计算路径的紧凑包围盒（带缓存）
   *
   * 路径未变化时返回缓存，避免重复遍历。
   * @returns { minX, minY, maxX, maxY } 包围盒，路径为空时返回 null
   */
  computeTightBounds() {
    if (!this._tightBoundsDirty)
      return this._tightBounds;
    this._tightBounds || (this._tightBounds = Lt.default());
    let e = !1;
    this._tightBounds.setEmpty();
    const n = (s, i) => {
      this._tightBounds.add(s, i), e = !0;
    };
    return this.visit({
      moveTo: (s) => n(s.x, s.y),
      lineTo: (s, i) => {
        n(i.x, i.y);
      },
      quadraticCurveTo: (s, i, r) => {
        const c = Pc(s, i, r);
        n(c.minX, c.minY), n(c.maxX, c.maxY);
      },
      cubicCurveTo: (s, i, r, c) => {
        const a = wc(
          s,
          i,
          r,
          c
        );
        n(a.minX, a.minY), n(a.maxX, a.maxY);
      }
    }), e || this._tightBounds.fromLTRB(0, 0, 0, 0), this._tightBoundsDirty = !1, this._tightBounds;
  }
  toPolygons(e = !1, n = 0.5) {
    const s = [];
    let i = [], r = ht.create();
    const c = () => {
      e && !ht.equalsEpsilon(i[i.length - 1], r) && i.push({ x: r.x, y: r.y });
    };
    return this.visit({
      moveTo: (a) => {
        i.length > 0 && (c(), s.push(i), i = []), r.copy(a), i.push({ x: a.x, y: a.y });
      },
      lineTo: (a, l) => {
        i.push({ x: l.x, y: l.y });
      },
      quadraticCurveTo: (a, l, h) => {
        new Ps([a, l, h]).flatten(n).forEach((f) => {
          i.push(f);
        });
      },
      cubicCurveTo: (a, l, h, u) => {
        new Ts([a, l, h, u]).flatten(n).forEach((d) => {
          i.push(d);
        });
      },
      close: (a, l) => {
        c(), s.push(i), i = [];
      }
    }), i.length > 0 && c(), s;
  }
  getPath2D() {
    const e = new window.Path2D();
    return this.applyContext(e), e;
  }
  applyContext(e = new Path2D()) {
    return this.visit({
      moveTo: (n) => e.moveTo(n.x, n.y),
      lineTo: (n, s) => e.lineTo(s.x, s.y),
      quadraticCurveTo: (n, s, i) => e.quadraticCurveTo(s.x, s.y, i.x, i.y),
      cubicCurveTo: (n, s, i, r) => e.bezierCurveTo(s.x, s.y, i.x, i.y, r.x, r.y),
      close: (n, s) => e.closePath()
    }), e;
  }
}
const kl = (o) => {
  const e = [];
  let n = "";
  const s = [], i = /[MLHVCSQTAZmlhvcsqtaz]/;
  for (let r = 0; r < o.length; r++) {
    const c = o[r];
    if (i.test(c))
      n && s.length > 0 ? (e.push({ cmd: n, params: [...s] }), s.length = 0) : n && s.length === 0 && (n === "z" || n === "Z") && e.push({ cmd: n, params: [] }), n = c;
    else {
      if (c === "," || c === " ")
        continue;
      if (c === "-" || c === "+" || c === "." || c >= "0" && c <= "9" || c === "e" || c === "E") {
        let a = r + 1;
        for (; a < o.length && /[0-9.eE+\-]/.test(o[a]) && !((o[a] === "+" || o[a] === "-") && !(o[a - 1] === "e" || o[a - 1] === "E") || i.test(o[a])); ) {
          if (o[a] === "," || o[a] === " ") {
            a++;
            break;
          }
          a++;
        }
        const l = o.substring(r, a).trim();
        if (l && !i.test(l)) {
          const h = parseFloat(l);
          isNaN(h) || s.push(h);
        }
        r = a - 1;
      }
    }
  }
  return n && e.push({ cmd: n, params: [...s] }), e;
};
function lo(o) {
  const e = new tn();
  if (!o || !o.trim()) return e;
  const n = kl(o);
  let s = st.fromPoint({ x: 0, y: 0 }), i = null;
  for (let r = 0; r < n.length; r++) {
    const { cmd: c, params: a } = n[r], l = c === c.toLowerCase(), h = c.toUpperCase();
    let u = 0;
    switch (h) {
      case "M": {
        for (; u + 1 <= a.length; ) {
          const f = a[u++], d = a[u++], y = l ? s.x + f : f, x = l ? s.y + d : d;
          if (u === 2 ? e.moveTo(y, x) : e.lineTo(y, x), s = st.fromPoint({ x: y, y: x }), l) break;
        }
        i = null;
        break;
      }
      case "L": {
        for (; u + 1 <= a.length; ) {
          const f = a[u++], d = a[u++], y = l ? s.x + f : f, x = l ? s.y + d : d;
          e.lineTo(y, x), s = st.fromPoint({ x: y, y: x });
        }
        i = null;
        break;
      }
      case "H": {
        for (; u < a.length; ) {
          const f = a[u++], d = l ? s.x + f : f;
          e.lineTo(d, s.y), s = st.fromPoint({ x: d, y: s.y });
        }
        i = null;
        break;
      }
      case "V": {
        for (; u < a.length; ) {
          const f = a[u++], d = l ? s.y + f : f;
          e.lineTo(s.x, d), s = st.fromPoint({ x: s.x, y: d });
        }
        i = null;
        break;
      }
      case "C": {
        for (; u + 5 <= a.length; ) {
          const f = a[u++], d = a[u++], y = a[u++], x = a[u++], g = a[u++], w = a[u++], M = l ? s.x + f : f, P = l ? s.y + d : d, S = l ? s.x + y : y, k = l ? s.y + x : x, O = l ? s.x + g : g, R = l ? s.y + w : w;
          e.bezierCurveTo(M, P, S, k, O, R), i = { x: S, y: k }, s = st.fromPoint({ x: O, y: R });
        }
        break;
      }
      case "S": {
        for (; u + 3 <= a.length; ) {
          const f = a[u++], d = a[u++], y = a[u++], x = a[u++];
          let g, w;
          i ? (g = 2 * s.x - i.x, w = 2 * s.y - i.y) : (g = s.x, w = s.y);
          const M = l ? s.x + f : f, P = l ? s.y + d : d, S = l ? s.x + y : y, k = l ? s.y + x : x;
          e.bezierCurveTo(g, w, M, P, S, k), i = { x: M, y: P }, s = st.fromPoint({ x: S, y: k });
        }
        break;
      }
      case "Q": {
        for (; u + 3 <= a.length; ) {
          const f = a[u++], d = a[u++], y = a[u++], x = a[u++], g = l ? s.x + f : f, w = l ? s.y + d : d, M = l ? s.x + y : y, P = l ? s.y + x : x;
          e.quadraticCurveTo(g, w, M, P), i = { x: g, y: w }, s = st.fromPoint({ x: M, y: P });
        }
        break;
      }
      case "T": {
        for (; u + 1 <= a.length; ) {
          const f = a[u++], d = a[u++];
          let y, x;
          i ? (y = 2 * s.x - i.x, x = 2 * s.y - i.y) : (y = s.x, x = s.y);
          const g = l ? s.x + f : f, w = l ? s.y + d : d;
          e.quadraticCurveTo(y, x, g, w), i = { x: y, y: x }, s = st.fromPoint({ x: g, y: w });
        }
        break;
      }
      case "A": {
        for (; u + 6 <= a.length; ) {
          const f = a[u++], d = a[u++], y = a[u++] * Math.PI / 180, x = a[u++], g = a[u++], w = a[u++], M = a[u++], P = l ? s.x + w : w, S = l ? s.y + M : M;
          e.ellipseSvgArc(
            s.x,
            s.y,
            P,
            S,
            f,
            d,
            y,
            x !== 0,
            g !== 0
          ), s = st.fromPoint({ x: P, y: S }), i = null;
        }
        break;
      }
      case "Z": {
        e.closePath(), i = null;
        break;
      }
    }
  }
  return e;
}
var Rl = /* @__PURE__ */ ((o) => (o.Union = "union", o.Intersect = "intersect", o.Difference = "difference", o.Xor = "xor", o))(Rl || {});
const hn = 1e-10, Ni = 0.25, Fl = 20, Kn = (o, e) => ({ x: o, y: e }), Ac = (o, e) => Kn(o.x + e.x, o.y + e.y), Ke = (o, e) => Kn(o.x - e.x, o.y - e.y), Ec = (o, e) => Kn(o.x * e, o.y * e), Oe = (o, e, n) => Kn(o.x + (e.x - o.x) * n, o.y + (e.y - o.y) * n), ws = (o, e) => o.x * e.y - o.y * e.x, Un = (o, e, n = hn) => Math.abs(o.x - e.x) < n && Math.abs(o.y - e.y) < n;
function _i(o, e) {
  switch (o.type) {
    case "line":
      return Oe(o.p0, o.p1, e);
    case "quad": {
      const n = 1 - e;
      return Kn(
        n * n * o.p0.x + 2 * n * e * o.cp.x + e * e * o.p1.x,
        n * n * o.p0.y + 2 * n * e * o.cp.y + e * e * o.p1.y
      );
    }
    case "cubic": {
      const n = 1 - e;
      return Kn(
        n * n * n * o.p0.x + 3 * n * n * e * o.cp1.x + 3 * n * e * e * o.cp2.x + e * e * e * o.p1.x,
        n * n * n * o.p0.y + 3 * n * n * e * o.cp1.y + 3 * n * e * e * o.cp2.y + e * e * e * o.p1.y
      );
    }
  }
}
function Es(o) {
  return _i(o, 0.5);
}
function Ti(o) {
  let e = 1 / 0, n = 1 / 0, s = -1 / 0, i = -1 / 0;
  const r = o.type === "line" ? [o.p0, o.p1] : o.type === "quad" ? [o.p0, o.cp, o.p1] : [o.p0, o.cp1, o.cp2, o.p1];
  for (const c of r)
    c.x < e && (e = c.x), c.x > s && (s = c.x), c.y < n && (n = c.y), c.y > i && (i = c.y);
  return { minX: e, minY: n, maxX: s, maxY: i };
}
function Lc(o, e, n = hn) {
  return o.maxX + n >= e.minX && e.maxX + n >= o.minX && o.maxY + n >= e.minY && e.maxY + n >= o.minY;
}
function Hi(o, e, n) {
  const s = Ke(n, e), i = s.x * s.x + s.y * s.y;
  if (i < 1e-14) return Math.hypot(o.x - e.x, o.y - e.y);
  const r = Math.max(0, Math.min(1, ((o.x - e.x) * s.x + (o.y - e.y) * s.y) / i)), c = Ac(e, Ec(s, r));
  return Math.hypot(o.x - c.x, o.y - c.y);
}
function ho(o) {
  switch (o.type) {
    case "line":
      return !0;
    case "quad":
      return Hi(o.cp, o.p0, o.p1) <= Ni;
    case "cubic":
      return Hi(o.cp1, o.p0, o.p1) <= Ni && Hi(o.cp2, o.p0, o.p1) <= Ni;
  }
}
function ur(o, e) {
  switch (o.type) {
    case "line": {
      const n = Oe(o.p0, o.p1, e);
      return [
        { type: "line", p0: o.p0, p1: n },
        { type: "line", p0: n, p1: o.p1 }
      ];
    }
    case "quad": {
      const n = Oe(o.p0, o.cp, e), s = Oe(o.cp, o.p1, e), i = Oe(n, s, e);
      return [
        { type: "quad", p0: o.p0, cp: n, p1: i },
        { type: "quad", p0: i, cp: s, p1: o.p1 }
      ];
    }
    case "cubic": {
      const n = Oe(o.p0, o.cp1, e), s = Oe(o.cp1, o.cp2, e), i = Oe(o.cp2, o.p1, e), r = Oe(n, s, e), c = Oe(s, i, e), a = Oe(r, c, e);
      return [
        { type: "cubic", p0: o.p0, cp1: n, cp2: r, p1: a },
        { type: "cubic", p0: a, cp1: c, cp2: i, p1: o.p1 }
      ];
    }
  }
}
function Ls(o) {
  return o.type === "line", o.p0;
}
function un(o) {
  return o.type === "line", o.p1;
}
function uo(o, e, n, s) {
  const i = Ke(e, o), r = Ke(s, n), c = ws(i, r);
  if (Math.abs(c) < 1e-12) return null;
  const a = ws(Ke(n, o), r) / c, l = ws(Ke(n, o), i) / c;
  return a < -hn || a > 1 + hn || l < -hn || l > 1 + hn ? null : {
    t: Math.max(0, Math.min(1, a)),
    u: Math.max(0, Math.min(1, l)),
    point: Ac(o, Ec(i, a))
  };
}
function Ks(o, e, n) {
  return e + o * (n - e);
}
function xs(o, e, n, s) {
  if (n >= Fl) {
    const l = uo(o.edge.p0, un(o.edge), e.edge.p0, un(e.edge));
    l && s.push({
      tA: Ks(l.t, o.t0, o.t1),
      tB: Ks(l.u, e.t0, e.t1),
      point: l.point
    });
    return;
  }
  const i = Ti(o.edge), r = Ti(e.edge);
  if (!Lc(i, r)) return;
  if (ho(o.edge) && ho(e.edge)) {
    const l = uo(o.edge.p0, un(o.edge), e.edge.p0, un(e.edge));
    l && s.push({
      tA: Ks(l.t, o.t0, o.t1),
      tB: Ks(l.u, e.t0, e.t1),
      point: l.point
    });
    return;
  }
  const c = Math.hypot(i.maxX - i.minX, i.maxY - i.minY), a = Math.hypot(r.maxX - r.minX, r.maxY - r.minY);
  if (c >= a) {
    const l = (o.t0 + o.t1) / 2, [h, u] = ur(o.edge, 0.5);
    xs({ edge: h, t0: o.t0, t1: l }, e, n + 1, s), xs({ edge: u, t0: l, t1: o.t1 }, e, n + 1, s);
  } else {
    const l = (e.t0 + e.t1) / 2, [h, u] = ur(e.edge, 0.5);
    xs(o, { edge: h, t0: e.t0, t1: l }, n + 1, s), xs(o, { edge: u, t0: l, t1: e.t1 }, n + 1, s);
  }
}
function fo(o) {
  const e = [];
  let n = [], s = { x: 0, y: 0 }, i = { x: 0, y: 0 }, r = !1;
  const c = (a) => {
    if (a.length === 0) return;
    const l = un(a[a.length - 1]);
    Un(l, s) || a.push({ type: "line", p0: l, p1: s });
  };
  return o.visit({
    moveTo: (a) => {
      r && n.length > 0 && (c(n), e.push(n)), n = [], s = { x: a.x, y: a.y }, i = { x: a.x, y: a.y }, r = !0;
    },
    lineTo: (a, l) => {
      n.push({ type: "line", p0: { ...i }, p1: { x: l.x, y: l.y } }), i = { x: l.x, y: l.y };
    },
    quadraticCurveTo: (a, l, h) => {
      n.push({
        type: "quad",
        p0: { ...i },
        cp: { x: l.x, y: l.y },
        p1: { x: h.x, y: h.y }
      }), i = { x: h.x, y: h.y };
    },
    cubicCurveTo: (a, l, h, u) => {
      n.push({
        type: "cubic",
        p0: { ...i },
        cp1: { x: l.x, y: l.y },
        cp2: { x: h.x, y: h.y },
        p1: { x: u.x, y: u.y }
      }), i = { x: u.x, y: u.y };
    },
    close: (a, l) => {
      if (n.length > 0) {
        const h = un(n[n.length - 1]);
        Un(h, s) || n.push({ type: "line", p0: h, p1: s });
      }
      i = s;
    }
  }), r && n.length > 0 && (c(n), e.push(n)), e;
}
function Bi(o) {
  const e = new tn();
  for (const n of o) {
    if (n.length < 1) continue;
    const s = Ls(n[0]);
    e.moveTo(s.x, s.y);
    let i = s;
    for (const r of n) {
      const c = Ls(r);
      Un(i, c, 1e-8) || e.lineTo(c.x, c.y);
      const a = un(r);
      switch (r.type) {
        case "line":
          e.lineTo(a.x, a.y);
          break;
        case "quad":
          e.quadraticCurveTo(r.cp.x, r.cp.y, a.x, a.y);
          break;
        case "cubic":
          e.bezierCurveTo(r.cp1.x, r.cp1.y, r.cp2.x, r.cp2.y, a.x, a.y);
          break;
      }
      i = a;
    }
    e.closePath();
  }
  return e;
}
function Sc(o, e = 0.5) {
  const n = [];
  for (const s of o) {
    if (!(s.type === "quad" || s.type === "cubic")) {
      n.push(Ls(s));
      continue;
    }
    const r = Math.max(2, Math.ceil(
      Math.hypot(
        s.type === "quad" ? Math.hypot(s.cp.x - s.p0.x, s.cp.y - s.p0.y) + Math.hypot(s.p1.x - s.cp.x, s.p1.y - s.cp.y) : Math.hypot(s.cp1.x - s.p0.x, s.cp1.y - s.p0.y) + Math.hypot(s.cp2.x - s.cp1.x, s.cp2.y - s.cp1.y) + Math.hypot(s.p1.x - s.cp2.x, s.p1.y - s.cp2.y)
      ) / e
    ));
    for (let c = 0; c <= r; c++) n.push(_i(s, c / r));
  }
  return n;
}
function Ic(o, e) {
  let n = 0;
  const s = e.length;
  for (let i = 0; i < s; i++) {
    const r = e[i], c = e[(i + 1) % s];
    r.y <= o.y ? c.y > o.y && ws(Ke(c, r), Ke(o, r)) > 0 && n++ : c.y <= o.y && ws(Ke(c, r), Ke(o, r)) < 0 && n--;
  }
  return n;
}
function Pi(o, e) {
  let n = 0;
  for (const s of e)
    n += Ic(o, Sc(s));
  return n !== 0;
}
function qc(o) {
  let e = 0;
  for (const n of o) {
    const s = Ls(n), i = un(n);
    e += s.x * i.y - i.x * s.y;
  }
  return e / 2;
}
function zl(o) {
  return qc(o) <= 0 ? o : Dc(o);
}
function Cl(o) {
  return qc(o) >= 0 ? o : Dc(o);
}
function Yi(o, e) {
  return o.map((n, s) => {
    const i = Es(n[0]);
    let r = 0;
    for (let l = 0; l < o.length; l++)
      l !== s && Math.abs(Ic(i, Sc(o[l]))) % 2 === 1 && r++;
    return (r % 2 === 1 ? !e : e) ? zl(n) : Cl(n);
  });
}
function Dc(o) {
  const e = [];
  for (let n = o.length - 1; n >= 0; n--)
    e.push(Nl(o[n]));
  return e;
}
function Nl(o) {
  switch (o.type) {
    case "line":
      return { type: "line", p0: o.p1, p1: o.p0 };
    case "quad":
      return { type: "quad", p0: o.p1, cp: o.cp, p1: o.p0 };
    case "cubic":
      return { type: "cubic", p0: o.p1, cp1: o.cp2, cp2: o.cp1, p1: o.p0 };
  }
}
function yo(o, e) {
  if (e.length === 0) return [o];
  const n = [];
  let s = o, i = 0;
  for (const r of e) {
    if (r <= i + hn || r >= 1 - hn) continue;
    const c = (r - i) / (1 - i), [a, l] = ur(s, c);
    n.push(a), s = l, i = r;
  }
  return n.push(s), n;
}
function xo(o, e) {
  const n = [];
  for (const s of o) {
    const i = {
      pt: Ls(s),
      next: null,
      prev: null,
      edgeToNext: s,
      isIntersection: !1,
      neighbor: null,
      visited: !1,
      fromSubject: e
    };
    n.push(i);
  }
  for (let s = 0; s < n.length; s++)
    n[s].next = n[(s + 1) % n.length], n[s].prev = n[(s + n.length - 1) % n.length];
  return n;
}
function Hl(o, e, n) {
  const s = [];
  for (const i of o) {
    const r = Pi(Es(i[0]), e);
    (n === "union" && !r || n === "intersect" && r || n === "difference" && !r) && s.push(i);
  }
  for (const i of e) {
    const r = Pi(Es(i[0]), o);
    (n === "union" && !r || n === "intersect" && r || n === "difference" && r) && s.push(i);
  }
  return s;
}
function fr(o, e, n) {
  if (n === "xor")
    return [
      ...fr(
        o,
        e,
        "difference"
        /* Difference */
      ),
      ...fr(
        e,
        o,
        "difference"
        /* Difference */
      )
    ];
  const s = Yi(o, !0), i = n === "difference" ? Yi(e, !1) : Yi(e, !0), r = [];
  for (let R = 0; R < s.length; R++) {
    const F = s[R];
    for (let Y = 0; Y < i.length; Y++) {
      const N = i[Y];
      for (let $ = 0; $ < F.length; $++)
        for (let W = 0; W < N.length; W++) {
          if (!Lc(Ti(F[$]), Ti(N[W]), 1)) continue;
          const Q = [];
          xs(
            { edge: F[$], t0: 0, t1: 1 },
            { edge: N[W], t0: 0, t1: 1 },
            0,
            Q
          );
          for (const ct of Q) {
            const K = _i(F[$], ct.tA), j = _i(N[W], ct.tB);
            r.push({
              point: { x: (K.x + j.x) / 2, y: (K.y + j.y) / 2 },
              ptA: K,
              ptB: j,
              tA: ct.tA,
              tB: ct.tB,
              contourIdxA: R,
              contourIdxB: Y,
              edgeIdxA: $,
              edgeIdxB: W
            });
          }
        }
    }
  }
  const c = [];
  for (const R of r)
    c.find((F) => Un(F.point, R.point, 0.01)) || c.push(R);
  if (c.length === 0)
    return Hl(s, i, n);
  const a = [];
  for (let R = 0; R < s.length; R++) {
    const F = s[R], Y = [];
    for (let N = 0; N < F.length; N++) {
      const $ = c.filter((W) => W.contourIdxA === R && W.edgeIdxA === N).map((W) => W.tA).sort((W, Q) => W - Q);
      Y.push(...yo(F[N], $));
    }
    a.push(Y);
  }
  const l = [];
  for (let R = 0; R < i.length; R++) {
    const F = i[R], Y = [];
    for (let N = 0; N < F.length; N++) {
      const $ = c.filter((W) => W.contourIdxB === R && W.edgeIdxB === N).map((W) => W.tB).sort((W, Q) => W - Q);
      Y.push(...yo(F[N], $));
    }
    l.push(Y);
  }
  const h = a.map((R) => xo(R, !0)), u = l.map((R) => xo(R, !1)), f = h.flat(), d = u.flat(), y = new Array(s.length).fill(!1), x = new Array(i.length).fill(!1);
  for (const R of c)
    for (let F = 0; F < h.length; F++) {
      const Y = h[F].find((N) => !N.isIntersection && Un(N.pt, R.ptA, 0.01));
      if (Y)
        for (let N = 0; N < u.length; N++) {
          const $ = u[N].find((W) => !W.isIntersection && Un(W.pt, R.ptB, 0.01));
          $ && (Y.isIntersection = !0, $.isIntersection = !0, Y.neighbor = $, $.neighbor = Y, y[F] = !0, x[N] = !0);
        }
    }
  const g = (R, F) => {
    for (const Y of R)
      Y.edgeToNext && (Y.insideOther = Pi(Es(Y.edgeToNext), F));
  };
  g(f, i), g(d, s);
  const w = [], M = [...f, ...d], P = (R, F) => {
    const Y = R.insideOther;
    switch (F) {
      case "union":
        return !Y;
      case "intersect":
        return Y;
      case "difference":
        return R.fromSubject ? !Y : Y;
    }
    return !0;
  }, S = (R) => {
    const F = [];
    let Y = R, N = 0;
    const $ = M.length * 3;
    for (; N < $ && (N++, !(Y.visited && Y === R && F.length > 0)); ) {
      Y.visited = !0;
      const W = Y.next;
      Y.isIntersection && Y.neighbor ? P(Y, n) ? (Y.edgeToNext && F.push(Y.edgeToNext), Y = W) : Y = Y.neighbor : (Y.edgeToNext && F.push(Y.edgeToNext), Y = W);
    }
    return F.length < 2 ? null : F;
  }, k = M.filter((R) => R.isIntersection);
  for (let R of k) {
    if (R.visited || (!P(R, n) && R.neighbor && !R.neighbor.visited && (R = R.neighbor), R.visited)) continue;
    const F = S(R);
    F && w.push(F);
  }
  const O = (R, F) => {
    const Y = Es(R[0]), $ = Pi(Y, F ? i : s);
    let W = !1;
    switch (n) {
      case "union":
        W = !$;
        break;
      case "intersect":
        W = $;
        break;
      case "difference":
        W = F ? !$ : $;
        break;
    }
    W && w.push(R);
  };
  for (let R = 0; R < s.length; R++)
    y[R] || O(s[R], !0);
  for (let R = 0; R < i.length; R++)
    x[R] || O(i[R], !1);
  return w.length === 0 && n !== "intersect" ? s : w;
}
function u1(o, e, n) {
  const s = fo(o), i = fo(e);
  if (s.length === 0 || i.length === 0)
    return n === "union" || n === "xor" ? Bi([...s, ...i]) : n === "difference" ? Bi(s) : new tn();
  const r = fr(s, i, n);
  return Bi(r);
}
var Bl = /* @__PURE__ */ ((o) => (o.BeginPath = "beginPath", o.MoveTo = "moveTo", o.LineTo = "lineTo", o.QuadraticCurveTo = "quadraticCurveTo", o.BezierCurveTo = "bezierCurveTo", o.Arc = "arc", o.ArcTo = "arcTo", o.Ellipse = "ellipse", o.Rect = "rect", o.RoundRect = "roundRect", o.ClosePath = "closePath", o))(Bl || {});
class Nt {
  type;
  args;
  /** 圆角矩形的圆角参数 */
  radii;
  /** Arc / Ellipse 的逆时针标志 */
  counterclockwise;
  constructor(e, n = [], s) {
    this.type = e, this.args = n, s?.radii !== void 0 && (this.radii = s.radii), s?.counterclockwise !== void 0 && (this.counterclockwise = s.counterclockwise);
  }
  /** 开始新路径 */
  static beginPath() {
    return new Nt(
      "beginPath"
      /* BeginPath */
    );
  }
  /** 移动到 (x, y) */
  static moveTo(e, n) {
    return new Nt("moveTo", [e, n]);
  }
  /** 直线到 (x, y) */
  static lineTo(e, n) {
    return new Nt("lineTo", [e, n]);
  }
  /** 二次贝塞尔曲线 */
  static quadraticCurveTo(e, n, s, i) {
    return new Nt("quadraticCurveTo", [e, n, s, i]);
  }
  /** 三次贝塞尔曲线 */
  static bezierCurveTo(e, n, s, i, r, c) {
    return new Nt("bezierCurveTo", [e, n, s, i, r, c]);
  }
  /** 圆弧 */
  static arc(e, n, s, i, r, c) {
    return new Nt(
      "arc",
      [e, n, s, i, r],
      { counterclockwise: c }
    );
  }
  /** 切线圆弧 */
  static arcTo(e, n, s, i, r) {
    return new Nt("arcTo", [e, n, s, i, r]);
  }
  /** 椭圆弧 */
  static ellipse(e, n, s, i, r, c, a, l) {
    return new Nt(
      "ellipse",
      [e, n, s, i, r, c, a],
      { counterclockwise: l }
    );
  }
  /** 矩形 */
  static rect(e, n, s, i) {
    return new Nt("rect", [e, n, s, i]);
  }
  /** 圆角矩形 */
  static roundRect(e, n, s, i, r) {
    return new Nt("roundRect", [e, n, s, i], { radii: r });
  }
  /** 关闭路径 */
  static closePath() {
    return new Nt(
      "closePath"
      /* ClosePath */
    );
  }
  /** 克隆当前命令 */
  clone() {
    const e = new Nt(this.type, this.args.slice());
    return this.radii !== void 0 && (e.radii = this.radii), this.counterclockwise !== void 0 && (e.counterclockwise = this.counterclockwise), e;
  }
  /** 应用到 Path2D / CanvasRenderingContext2D 类目标 */
  apply(e) {
    const n = this.args;
    switch (this.type) {
      case "beginPath":
        e.beginPath();
        break;
      case "moveTo":
        e.moveTo(n[0], n[1]);
        break;
      case "lineTo":
        e.lineTo(n[0], n[1]);
        break;
      case "quadraticCurveTo":
        e.quadraticCurveTo(n[0], n[1], n[2], n[3]);
        break;
      case "bezierCurveTo":
        e.bezierCurveTo(n[0], n[1], n[2], n[3], n[4], n[5]);
        break;
      case "arc":
        e.arc(n[0], n[1], n[2], n[3], n[4], this.counterclockwise);
        break;
      case "arcTo":
        e.arcTo(n[0], n[1], n[2], n[3], n[4]);
        break;
      case "ellipse":
        e.ellipse(n[0], n[1], n[2], n[3], n[4], n[5], n[6], this.counterclockwise);
        break;
      case "rect":
        e.rect(n[0], n[1], n[2], n[3]);
        break;
      case "roundRect":
        e.roundRect(n[0], n[1], n[2], n[3], this.radii);
        break;
      case "closePath":
        e.closePath();
        break;
    }
  }
}
class Oc {
  /** 命令列表 */
  commands = [];
  constructor(e) {
    if (e)
      for (let n = 0; n < e.length; n++)
        this.commands.push(e[n].clone());
  }
  /** 命令数量 */
  get length() {
    return this.commands.length;
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/beginPath) */
  beginPath() {
    this.commands.push(Nt.beginPath());
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/moveTo) */
  moveTo(e, n) {
    this.commands.push(Nt.moveTo(e, n));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineTo) */
  lineTo(e, n) {
    this.commands.push(Nt.lineTo(e, n));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo) */
  quadraticCurveTo(e, n, s, i) {
    this.commands.push(Nt.quadraticCurveTo(e, n, s, i));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo) */
  bezierCurveTo(e, n, s, i, r, c) {
    this.commands.push(Nt.bezierCurveTo(e, n, s, i, r, c));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arc) */
  arc(e, n, s, i, r, c) {
    this.commands.push(Nt.arc(e, n, s, i, r, c));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arcTo) */
  arcTo(e, n, s, i, r) {
    this.commands.push(Nt.arcTo(e, n, s, i, r));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/ellipse) */
  ellipse(e, n, s, i, r, c, a, l) {
    this.commands.push(
      Nt.ellipse(e, n, s, i, r, c, a, l)
    );
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rect) */
  rect(e, n, s, i) {
    this.commands.push(Nt.rect(e, n, s, i));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/roundRect) */
  roundRect(e, n, s, i, r) {
    this.commands.push(Nt.roundRect(e, n, s, i, r));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/closePath) */
  closePath() {
    this.commands.push(Nt.closePath());
  }
  /** 追加一条命令 */
  push(e) {
    this.commands.push(e.clone());
  }
  /** 追加多条命令 */
  pushAll(e) {
    for (let n = 0; n < e.length; n++)
      this.commands.push(e[n].clone());
  }
  /** 清空所有命令 */
  clear() {
    this.commands.length = 0;
  }
  /** 克隆当前路径数据 */
  clone() {
    const e = new Oc();
    for (let n = 0; n < this.commands.length; n++)
      e.commands.push(this.commands[n].clone());
    return e;
  }
  /**
   * 将所有命令应用到目标对象（Path2D / CanvasRenderingContext2D / PathBuilder 等）
   */
  applyTo(e) {
    for (let n = 0; n < this.commands.length; n++)
      this.commands[n].apply(e);
  }
  /** 遍历命令 */
  forEach(e) {
    for (let n = 0; n < this.commands.length; n++)
      e(this.commands[n], n);
  }
  /** 转换为 Path2D（DOM 原生） */
  toPath2D() {
    const e = new Path2D();
    return this.applyTo(e), e;
  }
}
var Yl = /* @__PURE__ */ ((o) => (o.Miter = "miter", o.Round = "round", o.Bevel = "bevel", o))(Yl || {}), Vl = /* @__PURE__ */ ((o) => (o.Butt = "butt", o.Round = "round", o.Square = "square", o))(Vl || {});
function Ul(o, e, n, s, i, r) {
  return r.setLengthTo((e.x - o.x) * n, (e.y - o.y) * n, 1) ? (r.perpendicular().negate(), i.copy(r).multiplyScalar(s), !0) : !1;
}
function Yr(o, e, n) {
  n.lineTo(o.x, o.y), n.lineTo(o.x - e.x, o.y - e.y);
}
function Vr(o, e, n) {
  const s = o.lastPoint;
  s && (s.x = e, s.y = n);
}
const Xl = (o, e, n, s, i, r, c, a) => {
  const l = o.cross(n);
  if (l === 0)
    return;
  const h = o.dot(n), u = Math.sqrt((1 + h) / 2), f = s / u;
  let d = o, y = n;
  l < 0 && (a.swap(), d = o.clone().negate(), y = n.clone().negate());
  const x = st.fromPoint(e).add(st.fromPoint(d).multiplyScalar(s)), g = st.fromPoint(e).add(st.fromPoint(y).multiplyScalar(s)), w = st.fromPoint(d).add(y).normalize().multiplyScalar(f).add(e);
  r ? Vr(a.outer, x.x, x.y) : a.outer.lineTo(x.x, x.y), a.outer.arcTo(w.x, w.y, g.x, g.y, s), Yr(e, st.fromPoint(y).multiplyScalar(s), a.inner);
}, Wl = (o, e, n, s, i, r, c, a) => {
  const l = o.cross(n);
  if (l === 0)
    return;
  const h = o.dot(n), u = Math.sqrt((1 + h) / 2);
  if (u < i) {
    kc(o, e, n, s, i, r, c, a);
    return;
  }
  let f = o, d = n;
  l < 0 && (a.swap(), f = o.clone().negate(), d = n.clone().negate());
  const y = s / u, x = st.fromPoint(f).add(d).normalize().multiplyScalar(y).add(e);
  if (r ? Vr(a.outer, x.x, x.y) : a.outer.lineTo(x.x, x.y), !c) {
    const g = st.fromPoint(e).add(st.fromPoint(d).multiplyScalar(s));
    a.outer.lineTo(g.x, g.y);
  }
  Yr(e, st.fromPoint(d).multiplyScalar(s), a.inner);
}, kc = (o, e, n, s, i, r, c, a) => {
  const l = o.cross(n);
  if (l === 0)
    return;
  const h = n.clone().multiplyScalar(s);
  l < 0 && (a.swap(), h.negate()), a.outer.lineTo(e.x + h.x, e.y + h.y), Yr(e, h, a.inner);
}, Rc = (o, e, n, s, i) => {
  i.lineTo(n.x, n.y);
}, $l = (o, e, n, s, i) => {
  const r = e.clone().perpendicular(), c = o.clone().add(r).add(e), a = o.clone().add(r).subtract(e);
  s ? (Vr(i, c.x, c.y), i.lineTo(a.x, a.y)) : (i.lineTo(c.x, c.y), i.lineTo(a.x, a.y), i.lineTo(n.x, n.y));
}, jl = (o, e, n, s, i) => {
  const r = e.clone().perpendicular(), c = o.clone().add(r), a = c.clone().add(e);
  i.conicTo(a.x, a.y, c.x, c.y, Math.SQRT1_2), a.copy(c).subtract(e), i.conicTo(a.x, a.y, n.x, n.y, Math.SQRT1_2);
}, Gl = {
  round: Xl,
  miter: Wl,
  bevel: kc
}, Zl = {
  butt: Rc,
  round: jl,
  square: $l
};
class po {
  constructor(e, n) {
    this.inner = e, this.outer = n;
  }
  swap() {
    return [this.inner, this.outer] = [this.outer, this.inner], this;
  }
}
class f1 {
  static default() {
    return new this();
  }
  radius;
  lineJoin = "miter";
  lineCap = "butt";
  miterLimit = 10;
  invertMiterLimit = 1 / 10;
  segmentCount = 0;
  resScale = 1;
  invResScale = 1;
  // 逆分辨率缩放系数
  firstPoint = st.default();
  firstUnitNormal = st.default();
  firstNormal = st.default();
  prevPoint = st.default();
  prevUnitNormal = st.default();
  prevNormal = st.default();
  prevIsLine = !1;
  firstOuterPoint = st.default();
  stroke(e, n) {
    return this.lineJoin = n.lineJoin ?? "miter", this.lineCap = n.lineCap ?? "butt", this.miterLimit = n.miterLimit ?? 10, this.invertMiterLimit = 1 / this.miterLimit, this.radius = (n.lineWidth ?? 1) / 2, this.resScale = n.scale ?? 1, this.invResScale = 1 / this.resScale, this.outer = tn.default(), this.inner = tn.default(), this.capper = Zl[this.lineCap], this.joiner = Gl[this.lineJoin], this.outer.reset(), this.inner.reset(), this._stroke(e);
  }
  _stroke(e) {
    let n = !1;
    return e.visit({
      moveTo: (s) => {
        this.moveTo(st.fromPoint(s));
      },
      lineTo: (s, i) => {
        this.lineTo(st.fromPoint(i)), n = !0;
      },
      quadraticCurveTo: (s, i, r) => {
        this.quadTo(st.fromPoint(i), st.fromPoint(r)), n = !1;
      },
      cubicCurveTo: (s, i, r, c) => {
        this.cubicTo(st.fromPoint(i), st.fromPoint(r), st.fromPoint(c)), n = !1;
      },
      close: () => {
        if (this.lineCap !== "butt" && this.segmentCount == 0) {
          this.lineTo(this.firstPoint);
          return;
        }
        this.segmentCount > 0 && !this.prevPoint.equalsEpsilon(this.firstPoint, this.invResScale) && (this.lineTo(this.firstPoint), n = !0), this.close(n);
      }
    }), this.finish(n);
  }
  close(e) {
    this.finishContour(!0, e);
  }
  moveTo(e) {
    this.segmentCount > 0 && this.finishContour(!1, !1), this.firstPoint.copy(e), this.prevPoint.copy(e), this.segmentCount = 0;
  }
  lineTo(e) {
    this.lineToCore(e, !0, !0);
  }
  quadTo(e, n) {
    const s = new Ps([this.prevPoint, e, n]).flatten();
    let i = !0;
    for (let r = 1; r < s.length; r++)
      this.lineToCore(st.fromPoint(s[r]), !0, i) && (i = !1);
  }
  cubicTo(e, n, s) {
    const i = new Ts([this.prevPoint, e, n, s]).flatten();
    let r = !0;
    for (let c = 1; c < i.length; c++)
      this.lineToCore(st.fromPoint(i[c]), !0, r) && (r = !1);
  }
  /**
   * 核心线段处理。
   * @param p            本段终点
   * @param currentIsLine 本段是否为 lineTo（曲线展平段也按 line 处理）
   * @param runJoin      是否在拐点执行 joiner。
   *                     真实段边界（lineTo↔lineTo、lineTo↔曲线起点）为 true；
   *                     曲线展平后的内部线段为 false，仅直接延伸内外侧偏移折线，
   *                     避免 handleInnerJoin 在平滑曲线上密集下探 pivot 产生小三角。
   * @returns 是否实际写入了该段（零长段返回 false）
   */
  lineToCore(e, n, s) {
    if (this.prevPoint.equalsEpsilon(e, this.invResScale))
      return !1;
    const i = st.default(), r = st.default();
    if (!Ul(this.prevPoint, e, this.resScale, this.radius, i, r)) {
      if (this.capper === Rc)
        return !1;
      i.set(this.radius, 0), r.set(1, 0);
    }
    return this.segmentCount === 0 ? (this.firstNormal.copy(i), this.firstUnitNormal.copy(r), this.firstOuterPoint.copy(this.prevPoint).add(i), this.outer.moveTo(this.prevPoint.x + i.x, this.prevPoint.y + i.y), this.inner.moveTo(this.prevPoint.x - i.x, this.prevPoint.y - i.y)) : s && this.joiner && this.joiner(
      this.prevUnitNormal,
      this.prevPoint,
      r,
      this.radius,
      this.invertMiterLimit,
      this.prevIsLine,
      n,
      new po(this.inner, this.outer)
    ), this.outer.lineTo(e.x + i.x, e.y + i.y), this.inner.lineTo(e.x - i.x, e.y - i.y), this.prevNormal.copy(i), this.prevUnitNormal.copy(r), this.prevPoint.copy(e), this.prevIsLine = n, this.segmentCount++, !0;
  }
  finishContour(e, n) {
    if (this.segmentCount > 0)
      if (e) {
        this.joiner(
          this.prevUnitNormal,
          this.prevPoint,
          this.firstUnitNormal,
          this.radius,
          this.invertMiterLimit,
          this.prevIsLine,
          n,
          new po(this.inner, this.outer)
        ), this.outer.closePath();
        let s = this.inner.lastPoint ?? st.create(0, 0);
        this.outer.moveTo(s.x, s.y), this.outer.reversePathTo(this.inner), this.outer.closePath();
      } else {
        let s = n ? this.inner : null, i = this.inner.lastPoint ? st.fromPoint(this.inner.lastPoint) : st.default();
        this.capper(this.prevPoint, this.prevNormal, i, s, this.outer), this.outer.reversePathTo(this.inner), s = this.prevIsLine ? this.inner : null, this.capper(this.firstPoint, this.firstNormal.clone().negate(), this.firstOuterPoint, s, this.outer), this.outer.closePath();
      }
    this.inner.reset(), this.segmentCount = -1;
  }
  finish(e) {
    return this.finishContour(!1, e), this.outer;
  }
}
var Jl = /* @__PURE__ */ ((o) => (o[o.ClosePath = 0] = "ClosePath", o[o.MoveTo = 1] = "MoveTo", o[o.LineTo = 2] = "LineTo", o[o.QuadraticCurveTo = 3] = "QuadraticCurveTo", o[o.BezierCurveTo = 4] = "BezierCurveTo", o[o.Arc = 5] = "Arc", o[o.ArcTo = 6] = "ArcTo", o[o.Ellipse = 7] = "Ellipse", o[o.Rect = 8] = "Rect", o[o.RoundRect = 9] = "RoundRect", o[o.BeginPath = 10] = "BeginPath", o))(Jl || {});
const Ql = {
  0: 0,
  1: 2,
  2: 2,
  3: 4,
  4: 6,
  5: 6,
  6: 5,
  7: 8,
  8: 4,
  9: 5,
  10: 0
};
class Fc {
  /** 底层原生 Path2D（可能为空） */
  ctx;
  /** 扁平编码的命令数组 */
  commandData = [];
  dirty = !0;
  constructor(e) {
    this.ctx = e;
  }
  // ============ Path2D API ============
  addPath(e, n) {
    this.ctx?.addPath(e.ctx, n);
  }
  moveTo(e, n) {
    this._push(1, e, n), this.ctx?.moveTo(e, n);
  }
  lineTo(e, n) {
    this._push(2, e, n), this.ctx?.lineTo(e, n);
  }
  quadraticCurveTo(e, n, s, i) {
    this._push(3, e, n, s, i), this.ctx?.quadraticCurveTo(e, n, s, i);
  }
  bezierCurveTo(e, n, s, i, r, c) {
    this._push(4, e, n, s, i, r, c), this.ctx?.bezierCurveTo(e, n, s, i, r, c);
  }
  arc(e, n, s, i, r, c) {
    this._push(5, e, n, s, i, r, c ? 1 : 0), this.ctx?.arc(e, n, s, i, r, c);
  }
  arcTo(e, n, s, i, r) {
    this._push(6, e, n, s, i, r), this.ctx?.arcTo(e, n, s, i, r);
  }
  ellipse(e, n, s, i, r, c, a, l) {
    this._push(7, e, n, s, i, r, c, a, l ? 1 : 0), this.ctx?.ellipse(e, n, s, i, r, c, a, l);
  }
  closePath() {
    this._push(
      0
      /* ClosePath */
    ), this.ctx?.closePath();
  }
  rect(e, n, s, i) {
    this._push(8, e, n, s, i), this.ctx?.rect(e, n, s, i);
  }
  /** roundRect: 复杂 radii 降级为 PathCommand 存储（罕见） */
  roundRect(e, n, s, i, r) {
    this._push(9, e, n, s, i, r), this.ctx?.roundRect(e, n, s, i, r);
  }
  // ============ 内部编码 ============
  /** 向 commandData 末尾追加一条命令 */
  _push(e, ...n) {
    const s = this.commandData;
    s[s.length] = e;
    for (let i = 0; i < n.length; i++)
      s[s.length] = n[i];
    this.dirty = !0;
  }
  /** 直接拼接另一个扁平数组 */
  _appendRaw(e) {
    const n = this.commandData;
    for (let s = 0; s < e.length; s++)
      n[n.length] = e[s];
    this.dirty = !0;
  }
  // ============ 工具 ============
  clear() {
    this.dirty = !0, this.commandData.length = 0;
  }
  isEmpty() {
    return this.commandData.length === 0;
  }
  /** 克隆（深拷贝扁平数组） */
  clone() {
    const e = new Fc();
    e.ctx = this.ctx;
    const n = this.commandData, s = e.commandData;
    for (let i = 0; i < n.length; i++)
      s[i] = n[i];
    return e;
  }
  /** 将命令回放到目标 Path2D / CanvasRenderingContext2D */
  replayTo(e) {
    const n = this.commandData;
    for (let s = 0; s < n.length; )
      switch (n[s++]) {
        case 10:
          e.beginPath();
          break;
        case 0:
          e.closePath();
          break;
        case 1:
          e.moveTo(n[s++], n[s++]);
          break;
        case 2:
          e.lineTo(n[s++], n[s++]);
          break;
        case 3:
          e.quadraticCurveTo(n[s++], n[s++], n[s++], n[s++]);
          break;
        case 4:
          e.bezierCurveTo(n[s++], n[s++], n[s++], n[s++], n[s++], n[s++]);
          break;
        case 5:
          e.arc(n[s++], n[s++], n[s++], n[s++], n[s++], !!n[s++]);
          break;
        case 6:
          e.arcTo(n[s++], n[s++], n[s++], n[s++], n[s++]);
          break;
        case 7:
          e.ellipse(n[s++], n[s++], n[s++], n[s++], n[s++], n[s++], n[s++], !!n[s++]);
          break;
        case 8:
          e.rect(n[s++], n[s++], n[s++], n[s++]);
          break;
        case 9:
          e.roundRect(n[s++], n[s++], n[s++], n[s++], n[s++]);
          break;
      }
  }
  /** 按命令类型遍历（回调接收 cmd 类型和 arg 数组引用） */
  forEach(e) {
    const n = this.commandData;
    for (let s = 0; s < n.length; ) {
      const i = n[s], r = Ql[i] ?? 0, c = n.slice(s + 1, s + 1 + r);
      e(i, c, s), s += 1 + r;
    }
  }
  /** 转换为原生 Path2D */
  applyContext(e) {
    this.replayTo(e);
  }
}
const Kl = {
  minX: 1 / 0,
  minY: 1 / 0,
  maxX: -1 / 0,
  maxY: -1 / 0
};
function Vi(o, e) {
  return o.minX <= e.minX && o.minY <= e.minY && o.maxX >= e.maxX && o.maxY >= e.maxY;
}
function rn(o, e) {
  return o.minX <= e.maxX && o.maxX >= e.minX && o.minY <= e.maxY && o.maxY >= e.minY;
}
function vn(o, e) {
  return {
    minX: Math.min(o.minX, e.minX),
    minY: Math.min(o.minY, e.minY),
    maxX: Math.max(o.maxX, e.maxX),
    maxY: Math.max(o.maxY, e.maxY)
  };
}
function Xn(o) {
  return (o.maxX - o.minX) * (o.maxY - o.minY);
}
function ps(o, e) {
  const n = Math.max(o.maxX, e.maxX) - Math.min(o.minX, e.minX), s = Math.max(o.maxY, e.maxY) - Math.min(o.minY, e.minY);
  return n * s - Xn(o);
}
function Ui(o, e, n) {
  let s = 0, i = 0;
  return o < n.minX ? s = n.minX - o : o > n.maxX && (s = o - n.maxX), e < n.minY ? i = n.minY - e : e > n.maxY && (i = e - n.maxY), s * s + i * i;
}
function Pn(o) {
  let e = { ...Kl };
  for (const n of o) e = vn(e, n);
  return e;
}
function Ae(o) {
  return o.height === 0;
}
function en(o) {
  return {
    bbox: Pn(o.map((e) => e.bbox)),
    children: null,
    items: o,
    height: 0
  };
}
function dr(o, e) {
  return {
    bbox: Pn(o.map((n) => n.bbox)),
    children: o,
    items: null,
    height: e
  };
}
function _n(o) {
  Ae(o) && o.items ? o.bbox = Pn(o.items.map((e) => e.bbox)) : o.children && (o.bbox = Pn(o.children.map((e) => e.bbox)));
}
function zc(o, e) {
  let n = -1 / 0, s = 0, i = 0;
  for (let u = 0; u < o.length; u++)
    for (let f = u + 1; f < o.length; f++) {
      const d = vn(o[u].bbox, o[f].bbox), y = Xn(d) - Xn(o[u].bbox) - Xn(o[f].bbox);
      y > n && (n = y, s = u, i = f);
    }
  const r = [o[s]], c = [o[i]];
  let a = o[s].bbox, l = o[i].bbox;
  const h = o.filter((u, f) => f !== s && f !== i);
  for (; h.length > 0; ) {
    if (r.length + h.length === e) {
      for (const g of h)
        r.push(g), a = vn(a, g.bbox);
      break;
    }
    if (c.length + h.length === e) {
      for (const g of h)
        c.push(g), l = vn(l, g.bbox);
      break;
    }
    let u = -1 / 0, f = 0;
    for (let g = 0; g < h.length; g++) {
      const w = ps(a, h[g].bbox), M = ps(l, h[g].bbox), P = Math.abs(w - M);
      P > u && (u = P, f = g);
    }
    const d = h.splice(f, 1)[0], y = ps(a, d.bbox), x = ps(l, d.bbox);
    y < x || y === x && r.length <= c.length ? (r.push(d), a = vn(a, d.bbox)) : (c.push(d), l = vn(l, d.bbox));
  }
  return [r, c];
}
function th(o, e) {
  let n = 0, s = 1 / 0, i = 1 / 0;
  for (let r = 0; r < o.children.length; r++) {
    const c = o.children[r], a = ps(c.bbox, e), l = Xn(c.bbox);
    (a < s || a === s && l < i) && (s = a, i = l, n = r);
  }
  return n;
}
function eh(o, e, n, s) {
  for (; o.length > 1; ) {
    o.pop();
    const c = o[o.length - 1];
    if (c.children.push(e), _n(c), c.children.length <= n) {
      for (let u = o.length - 2; u >= 0; u--)
        _n(o[u]);
      return null;
    }
    const a = c.children.map((u) => ({ bbox: u.bbox, node: u })), [l, h] = zc(a, s);
    c.children = l.map((u) => u.node), e = dr(h.map((u) => u.node), c.height), e.bbox = Pn(e.children.map((u) => u.bbox));
  }
  const i = o[0], r = dr([i, e], i.height + 1);
  return r.bbox = Pn([i.bbox, e.bbox]), r;
}
function Ur(o, e, n, s, i, r) {
  if (r.push(o), Ae(o)) {
    const l = { bbox: e, data: n };
    if (o.items.push(l), o.bbox = vn(o.bbox, e), o.items.length <= s) return null;
    const h = o.items.map((y) => ({ bbox: y.bbox, item: y })), [u, f] = zc(h, i);
    o.items = u.map((y) => y.item);
    const d = en(f.map((y) => y.item));
    return o.bbox = Pn(o.items.map((y) => y.bbox)), eh(r, d, s, i);
  }
  const c = th(o, e), a = Ur(o.children[c], e, n, s, i, r);
  return a || (_n(o), null);
}
function Cc(o, e, n, s) {
  if (Ae(o)) {
    const i = o.items.findIndex(e);
    return i === -1 ? !1 : (o.items.splice(i, 1), _n(o), !0);
  }
  for (let i = 0; i < o.children.length; i++) {
    const r = o.children[i];
    if (n.push(o), s.push(i), Cc(r, e, n, s))
      return !0;
    n.pop(), s.pop();
  }
  return !1;
}
function nh(o, e, n, s, i) {
  const r = [];
  for (let c = e.length - 1; c >= 0; c--) {
    const a = e[c];
    if (n[c], Ae(a))
      if (a.items.length < s) {
        if (r.push(...a.items), c === 0)
          return en([]);
        e[c - 1].children.splice(n[c - 1], 1);
      } else
        _n(a);
    else if (a.children.length < s) {
      if (r.push(...a.children), c === 0)
        return a.children.length === 0 ? en([]) : a.children.length === 1 ? a.children[0] : (_n(a), a);
      e[c - 1].children.splice(n[c - 1], 1);
    } else
      _n(a);
  }
  for (const c of r)
    if ("height" in c && c.children) {
      const a = [];
      Nc(c, a);
      for (const l of a)
        o = mo(o, l.bbox, l.data, i, s);
    } else {
      const a = c;
      o = mo(o, a.bbox, a.data, i, s);
    }
  for (; o.children && o.children.length === 1 && !Ae(o); )
    o = o.children[0];
  return o;
}
function Nc(o, e) {
  if (Ae(o))
    o.items && e.push(...o.items);
  else if (o.children)
    for (const n of o.children) Nc(n, e);
}
function mo(o, e, n, s, i) {
  return Ur(o, e, n, s, i, []) ?? o;
}
function sh(o, e) {
  if (o.length === 0) return en([]);
  const n = o.length, s = Math.ceil(n / e);
  if (s === 1) return en(o);
  const i = Math.ceil(Math.sqrt(s));
  o.sort((a, l) => {
    const h = (a.bbox.minX + a.bbox.maxX) / 2, u = (l.bbox.minX + l.bbox.maxX) / 2;
    return h - u;
  });
  const r = [];
  for (let a = 0; a < n; a += i * e)
    r.push(o.slice(a, a + i * e));
  const c = [];
  for (const a of r) {
    a.sort((l, h) => {
      const u = (l.bbox.minY + l.bbox.maxY) / 2, f = (h.bbox.minY + h.bbox.maxY) / 2;
      return u - f;
    });
    for (let l = 0; l < a.length; l += e) {
      const h = a.slice(l, l + e);
      c.push(en(h));
    }
  }
  return Hc(c, e);
}
function Hc(o, e) {
  if (o.length === 0) return en([]);
  if (o.length === 1) return o[0];
  const n = [];
  for (let s = 0; s < o.length; s += e) {
    const i = o.slice(s, s + e);
    n.push(dr(i, i[0].height + 1));
  }
  return Hc(n, e);
}
class ih {
  constructor(e) {
    this.compare = e;
  }
  heap = [];
  get size() {
    return this.heap.length;
  }
  push(e) {
    this.heap.push(e), this.siftUp(this.heap.length - 1);
  }
  pop() {
    if (this.heap.length === 0) return;
    const e = this.heap[0], n = this.heap.pop();
    return this.heap.length > 0 && (this.heap[0] = n, this.siftDown(0)), e;
  }
  peek() {
    return this.heap[0];
  }
  siftUp(e) {
    for (; e > 0; ) {
      const n = e - 1 >> 1;
      if (this.compare(this.heap[e], this.heap[n]) >= 0) break;
      [this.heap[e], this.heap[n]] = [this.heap[n], this.heap[e]], e = n;
    }
  }
  siftDown(e) {
    const n = this.heap.length;
    for (; ; ) {
      let s = e;
      const i = 2 * e + 1, r = 2 * e + 2;
      if (i < n && this.compare(this.heap[i], this.heap[s]) < 0 && (s = i), r < n && this.compare(this.heap[r], this.heap[s]) < 0 && (s = r), s === e) break;
      [this.heap[e], this.heap[s]] = [this.heap[s], this.heap[e]], e = s;
    }
  }
}
class d1 {
  root;
  _maxEntries;
  _minEntries;
  _size = 0;
  constructor(e = {}) {
    this._maxEntries = Math.max(4, e.maxEntries ?? 9), this._minEntries = Math.max(2, Math.floor(this._maxEntries * 0.4)), this.root = en([]);
  }
  // ── 基本信息 ──
  /** 树中元素总数 */
  get size() {
    return this._size;
  }
  /** 整棵树的包围盒（所有元素的 MBR） */
  get bbox() {
    return this.root.bbox;
  }
  /** 清空树 */
  clear() {
    this.root = en([]), this._size = 0;
  }
  // ── 插入 ──
  /**
   * 插入单个元素。
   * 复杂度 O(log n)。
   */
  insert(e) {
    const n = [], s = Ur(
      this.root,
      e.bbox,
      e.data,
      this._maxEntries,
      this._minEntries,
      n
    );
    s && (this.root = s), this._size++;
  }
  /**
   * 批量插入（STR 策略）。
   * 比逐个 insert 高效 ~10x，适合初始加载。
   *
   * @param items - 要插入的全部元素
   */
  bulkInsert(e) {
    if (e.length === 0) return;
    const n = this.all();
    n.push(...e), this.root = sh(n, this._maxEntries), this._size = n.length;
  }
  // ── 删除 ──
  /**
   * 删除一个元素（引用相等判断）。
   * 复杂度 O(log n)，可能触发重新平衡。
   *
   * @returns 是否成功删除
   */
  remove(e) {
    const n = [], s = [];
    return Cc(this.root, (r) => r === e, n, s) ? (this._size--, this.root = nh(this.root, n, s, this._minEntries, this._maxEntries), !0) : !1;
  }
  /**
   * 按谓词删除元素。
   *
   * @returns 删除的元素数量
   */
  removeBy(e) {
    let n = 0;
    const s = this.search(this.bbox).filter((i) => e(i.item));
    for (const { item: i } of s)
      this.remove(i) && n++;
    return n;
  }
  // ── 查询 ──
  /**
   * 范围查询：返回所有与 query 相交的元素。
   * 复杂度 O(log n + k)，k 为结果数。
   */
  search(e) {
    const n = [];
    if (!rn(this.root.bbox, e)) return n;
    const s = [this.root];
    for (; s.length > 0; ) {
      const i = s.pop();
      if (rn(i.bbox, e))
        if (Ae(i))
          for (const r of i.items)
            rn(r.bbox, e) && n.push({ item: r });
        else
          for (const r of i.children)
            s.push(r);
    }
    return n;
  }
  /**
   * 点查询：返回所有包含点 (px, py) 的元素。
   */
  searchPoint(e, n) {
    const s = { minX: e, minY: n, maxX: e, maxY: n };
    return this.search(s);
  }
  /**
   * 判断是否存在与 query 相交的元素。
   * 比 search().length > 0 更高效（无结果收集开销）。
   */
  collides(e) {
    if (!rn(this.root.bbox, e)) return !1;
    const n = [this.root];
    for (; n.length > 0; ) {
      const s = n.pop();
      if (rn(s.bbox, e))
        if (Ae(s)) {
          for (const i of s.items)
            if (rn(i.bbox, e)) return !0;
        } else
          for (const i of s.children)
            n.push(i);
    }
    return !1;
  }
  /**
   * k 近邻搜索（kNN）。
   *
   * 使用优先级队列 + 最佳优先策略（BFS）。
   *
   * @param k - 返回前 k 个最近元素
   * @param maxDist - 最大搜索半径（Infinity = 不限）
   * @returns 按距离升序排列的最近元素列表
   */
  nearest(e, n, s = 1, i = 1 / 0) {
    const r = [], c = i * i, a = new ih((l, h) => l.dist - h.dist);
    for (a.push({ node: this.root, dist: Ui(e, n, this.root.bbox) }); a.size > 0; ) {
      const l = a.pop();
      if (r.length >= s && l.dist > r[r.length - 1].distSq) break;
      if (Ae(l.node))
        for (const h of l.node.items) {
          const u = Ui(e, n, h.bbox);
          if (u > c) continue;
          let f = 0;
          for (; f < r.length && r[f].distSq < u; ) f++;
          f !== s && (r.splice(f, 0, { item: h, distSq: u }), r.length > s && r.pop());
        }
      else
        for (const h of l.node.children) {
          const u = Ui(e, n, h.bbox);
          u > c || a.push({ node: h, dist: u });
        }
    }
    return r;
  }
  /**
   * 查找距离点 (px, py) 最近的单个元素。
   * 比 nearest(px, py, 1) 更快（提前剪枝）。
   */
  nearestOne(e, n, s = 1 / 0) {
    const i = this.nearest(e, n, 1, s);
    return i.length > 0 ? i[0] : null;
  }
  // ── 包含判断 ──
  /**
   * 查找所有完全包含 query 的元素。
   */
  searchContaining(e) {
    const n = [];
    if (!rn(this.root.bbox, e)) return n;
    const s = [this.root];
    for (; s.length > 0; ) {
      const i = s.pop();
      if (rn(i.bbox, e))
        if (Ae(i))
          for (const r of i.items)
            Vi(r.bbox, e) && n.push({ item: r });
        else
          for (const r of i.children)
            s.push(r);
    }
    return n;
  }
  // ── 遍历 ──
  /** 获取所有元素 */
  all() {
    const e = [];
    return this._collect(this.root, e), e;
  }
  /** 遍历所有元素 */
  forEach(e) {
    const n = [this.root];
    for (; n.length > 0; ) {
      const s = n.pop();
      if (Ae(s))
        for (const i of s.items) e(i);
      else
        for (const i of s.children) n.push(i);
    }
  }
  // ── 内部 ──
  _collect(e, n) {
    if (Ae(e))
      e.items && n.push(...e.items);
    else if (e.children)
      for (const s of e.children) this._collect(s, n);
  }
  // ── 诊断 / 调试 ──
  /**
   * 树的高度。
   */
  get height() {
    return this.root.height;
  }
  /**
   * 树中所有节点的总包围盒面积（衡量空间利用率）。
   * 值越大表示重叠越多、查询效率越差。
   */
  totalNodeArea() {
    let e = 0;
    const n = [this.root];
    for (; n.length > 0; ) {
      const s = n.pop();
      if (e += Xn(s.bbox), s.children)
        for (const i of s.children) n.push(i);
    }
    return e;
  }
  /**
   * 验证树结构完整性（用于调试）。
   * 返回 null 表示验证通过，否则返回错误描述。
   */
  validate() {
    return this._validateNode(this.root);
  }
  _validateNode(e) {
    if (Ae(e)) {
      if (!e.items) return "叶子节点 items 为 null";
      if (e.items.length > this._maxEntries) return "叶子节点元素数超 maxEntries";
      if (e.height !== 0) return "叶子节点 height 不为 0";
      for (const n of e.items)
        if (!Vi(e.bbox, n.bbox)) return "元素的 bbox 不在节点 bbox 内";
    } else {
      if (!e.children) return "内部节点 children 为 null";
      if (e.children.length < this._minEntries && e !== this.root)
        return "内部节点子节点数 < minEntries";
      if (e.children.length > this._maxEntries) return "内部节点子节点数 > maxEntries";
      for (const n of e.children) {
        if (n.height >= e.height) return "子节点 height 不递减";
        if (!Vi(e.bbox, n.bbox)) return "子节点 bbox 不在父节点 bbox 内";
        const s = this._validateNode(n);
        if (s) return s;
      }
    }
    return null;
  }
}
class y1 {
  // ---- 内部存储 ----
  position;
  scale;
  _rotation = 0;
  skew;
  origin;
  pivot;
  /** 父级变换（设置后 worldMatrix 自动跟随父级） */
  _parent = null;
  // ---- 矩阵缓存 ----
  _matrix = It.identity();
  _worldMatrix = It.identity();
  _worldMatrixInvert = It.identity();
  // ---- 版本追踪 ----
  /** 当前局部属性版本（Point onChange 或 rotation setter 自动递增） */
  _localVersion = 0;
  /** 上次计算 _matrix 时的 _localVersion */
  _lastLocalVersion = -1;
  /** 上次计算 _worldMatrix 时的 _localVersion */
  _lastWorldLocalVersion = -1;
  /** 上次计算 _worldMatrix 时 parent.worldVersion 的值 */
  _lastParentWorldVersion = -1;
  /** 上次计算 _worldMatrixInvert 时的 _localVersion */
  _lastInvertLocalVersion = -1;
  /** 变化回调 */
  _onChange = null;
  constructor(e = {}) {
    this.updateTransform = this.updateTransform.bind(this), this.position = st.fromPoint(e.position ?? { x: 0, y: 0 }).onChange(this.updateTransform), this.scale = st.fromPoint(e.scale ?? { x: 1, y: 1 }).onChange(this.updateTransform), this.skew = st.fromPoint(e.skew ?? { x: 0, y: 0 }).onChange(this.updateTransform), this.origin = st.fromPoint(e.origin ?? { x: 0, y: 0 }).onChange(this.updateTransform), this.pivot = st.fromPoint(e.pivot ?? { x: 0, y: 0 }).onChange(this.updateTransform);
  }
  // ==================== 访问器 ====================
  get rotation() {
    return this._rotation;
  }
  set rotation(e) {
    this._rotation !== e && (this._rotation = e, this.updateTransform());
  }
  get angle() {
    return Xa(this._rotation);
  }
  set angle(e) {
    this.rotation = Ua(e);
  }
  /**
   * 注册变化回调。当任一变换属性发生变化时触发。
   * 与 Point.onChange 模式一致，返回 this 便于链式调用。
   */
  onChange(e) {
    return this._onChange = e, this;
  }
  /** 父级变换 */
  get parent() {
    return this._parent;
  }
  set parent(e) {
    this._parent !== e && (this._parent = e, this._forceWorldUpdate());
  }
  /**
   * 世界矩阵版本号。
   * 子级可通过比较此值来检测父级世界矩阵是否变化，无需逐帧访问 worldMatrix getter。
   */
  get worldVersion() {
    return this._lastWorldLocalVersion;
  }
  /** 局部变换矩阵（只读，懒计算） */
  get matrix() {
    return this._localVersion !== this._lastLocalVersion && this._updateLocalMatrix(), this._matrix;
  }
  /** 世界变换矩阵（只读，懒计算，自动跟随 parent 链） */
  get worldMatrix() {
    return this._needsWorldUpdate() && this._updateWorldMatrix(), this._worldMatrix;
  }
  /** 世界变换矩阵的逆（只读，懒计算） */
  get worldMatrixInvert() {
    const e = this.worldMatrix;
    return this._lastInvertLocalVersion !== this._lastWorldLocalVersion && (It.invert(this._worldMatrixInvert, e), this._lastInvertLocalVersion = this._lastWorldLocalVersion), this._worldMatrixInvert;
  }
  // ==================== 脏标记检查 ====================
  /** 本地矩阵是否需要重算 */
  _isLocalDirty() {
    return this._localVersion !== this._lastLocalVersion;
  }
  /** 本地版本是否变化（触发 world 重算） */
  _needsWorldUpdate() {
    return !!(this._lastWorldLocalVersion !== this._localVersion || this._parent && this._parentWorldVersionChanged());
  }
  /**
   * 父级世界矩阵是否自上次计算后发生了变化。
   * 先访问 parent.worldMatrix 触发祖孙链的懒更新，
   * 确保 parent.worldVersion 已反映所有祖先的变更。
   */
  _parentWorldVersionChanged() {
    return this._parent === null ? !1 : (this._parent.worldMatrix, this._parent.worldVersion !== this._lastParentWorldVersion);
  }
  // ==================== 矩阵计算 ====================
  /**
   * M_local = T(position) · Sk(skew) · S(scale) · R(rotation) · T(-origin)
   */
  _updateLocalMatrix() {
    It.fromTranslationRotationSkewScaleOriginPivot(
      this._matrix,
      this.position,
      this._rotation,
      this.skew,
      this.scale,
      this.origin,
      this.pivot
    ), this._lastLocalVersion = this._localVersion;
  }
  /**
   * 计算世界变换矩阵。
   *
   * 无 parent: M_world = M_local
   * 有 parent: M_world = M_parent · M_local
   */
  _updateWorldMatrix() {
    this._isLocalDirty() && this._updateLocalMatrix(), this._parent ? (It.multiply(this._worldMatrix, this._parent.worldMatrix, this._matrix), this._lastParentWorldVersion = this._parent.worldVersion) : this._worldMatrix.copy(this._matrix), this._lastWorldLocalVersion = this._localVersion;
  }
  // ==================== 公开方法 ====================
  /**
   * 强制标记为脏，下次访问 matrix/worldMatrix 时会重算。
   * 适用于批量设置多个属性后仅触发一次重算的场景。
   */
  updateTransform() {
    this._localVersion++, this._onChange?.();
  }
  /** 重置所有变换为默认值 */
  reset() {
    this.position.set(0, 0), this.scale.set(1, 1), this._rotation = 0, this.skew.set(0, 0), this.origin.set(0, 0);
  }
  /**
   * 将世界坐标转换为本地坐标。
   * result = M_world⁻¹ · point
   */
  worldToLocal(e, n) {
    const [s, i, r, c, a, l] = this.worldMatrixInvert;
    return n.x = s * e.x + r * e.y + a, n.y = i * e.x + c * e.y + l, n;
  }
  /**
   * 将本地坐标转换为世界坐标。
   * result = M_world · point
   */
  localToWorld(e, n) {
    const [s, i, r, c, a, l] = this.worldMatrix;
    return n.x = s * e.x + r * e.y + a, n.y = i * e.x + c * e.y + l, n;
  }
  decompose(e) {
    It.decomposeTransform(e, this);
  }
  // ---- 便捷设置（批量操作仅触发一次版本变更） ----
  /** 批量设置变换属性 */
  setTransform(e) {
    return e.position && this.position.copy(e.position), e.scale && this.scale.copy(e.scale), e.rotation !== void 0 && (this.rotation = e.rotation), e.skew && this.skew.copy(e.skew), e.origin && this.origin.copy(e.origin), e.pivot && this.pivot.copy(e.pivot), this;
  }
  /** 从另一个 Transform 拷贝变换属性 */
  copyFrom(e) {
    return this.position.copy(e.position), this.scale.copy(e.scale), this._rotation = e._rotation, this.skew.copy(e.skew), this.origin.copy(e.origin), this.pivot.copy(e.pivot), this;
  }
  // ---- 受保护的内部方法（供子类或同包使用） ----
  /** 清除世界矩阵缓存版本，强制下次 get 时重算（即使 local 未变） */
  _forceWorldUpdate() {
    this._lastWorldLocalVersion = -1, this._lastInvertLocalVersion = -1;
  }
}
class x1 {
  position;
  size;
  _zoom = 1;
  _rotation = 0;
  // 缓存变换矩阵（用于性能优化）
  _worldToScreenMatrix = null;
  _screenToWorldMatrix = null;
  _dirty = !0;
  _screenToWorldMatrixDirty = !0;
  // 可见区域缓存
  _cachedVisibleBounds = null;
  _visibleBoundsDirty = !0;
  constructor(e, n) {
    this._worldToScreenMatrix = It.identity(), this._screenToWorldMatrix = It.identity(), this._cachedVisibleBounds = Lt.fromLTRB(0, 0, e, n), this.position = new st(0, 0), this.position.onChange(() => {
      this.markMatrixUpdate();
    }), this.size = new st(e, n), this.size.onChange(() => {
      this.markMatrixUpdate();
    }), this.size.set(e, n);
  }
  // ============ 属性访问器 ============
  get zoom() {
    return this._zoom;
  }
  set zoom(e) {
    this._zoom = Math.max(0.01, Math.min(100, e)), this.markMatrixUpdate();
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(e) {
    this._rotation = e, this.markMatrixUpdate();
  }
  get width() {
    return this.size.x;
  }
  set width(e) {
    this.size.x = e;
  }
  get height() {
    return this.size.y;
  }
  set height(e) {
    this.size.y = e;
  }
  markMatrixUpdate() {
    this._dirty = !0, this._visibleBoundsDirty = !0;
  }
  // ============ 坐标转换 ============
  /**
   * 世界坐标 → 屏幕坐标
   */
  worldToScreen(e) {
    return this.getWorldToScreenMatrix().transformPoint(e);
  }
  /**
   * 屏幕坐标 → 世界坐标
   */
  screenToWorld(e) {
    return this.getScreenToWorldMatrix().transformPoint(e);
  }
  /**
   * 世界矩形 → 屏幕矩形
   */
  worldRectToScreen(e) {
    const n = this.worldToScreen({ x: e.x, y: e.y }), s = this.worldToScreen({
      x: e.x + e.width,
      y: e.y + e.height
    });
    return Lt.fromLTRB(n.x, n.y, s.x, s.y);
  }
  /**
   * 屏幕矩形 → 世界矩形
   */
  screenRectToWorld(e) {
    const n = this.screenToWorld({ x: e.x, y: e.y }), s = this.screenToWorld({
      x: e.x + e.width,
      y: e.y + e.height
    });
    return Lt.fromLTRB(n.x, n.y, s.x, s.y);
  }
  // ============ 变换矩阵 ============
  /**
   * 获取世界→屏幕变换矩阵
   */
  getWorldToScreenMatrix() {
    return this._dirty && (this.updateWorldToScreenMatrix(), this._dirty = !1, this._screenToWorldMatrixDirty = !0), this._worldToScreenMatrix;
  }
  /**
   * 获取屏幕→世界变换矩阵
   */
  getScreenToWorldMatrix() {
    const e = this.getWorldToScreenMatrix();
    return this._screenToWorldMatrixDirty && (this._screenToWorldMatrix.copy(e).invert(), this._screenToWorldMatrixDirty = !1), this._screenToWorldMatrix;
  }
  /**
   * 构建世界→屏幕变换矩阵
   * 变换顺序：世界 → 视口变换 → 屏幕
   */
  updateWorldToScreenMatrix() {
    const e = this._worldToScreenMatrix;
    return e.identity(), e.translate(-this.position.x, -this.position.y), this._rotation !== 0 && e.rotate(-this._rotation), e.scale(this._zoom, this._zoom), e;
  }
  // ============ 视口操作 ============
  /**
   * 平移视口
   */
  pan(e, n) {
    const s = this.screenToWorld({ x: e, y: n }), i = this.screenToWorld({ x: 0, y: 0 });
    this.position.x = i.x - s.x, this.position.y = i.y - s.y, this.markMatrixUpdate();
  }
  /**
   * 在指定点缩放
   * @param zoomFactor 缩放因子（>1 放大，<1 缩小）
   * @param centerScreen 缩放中心（屏幕坐标），默认在视口中心
   */
  zoomAt(e, n) {
    const s = n || { x: this.size.x / 2, y: this.size.y / 2 }, i = this.screenToWorld(s);
    this._zoom = Math.max(0.01, Math.min(100, this._zoom * e)), this.markMatrixUpdate();
    const r = this.screenToWorld(s);
    this.position.x += i.x - r.x, this.position.y += i.y - r.y;
  }
  /**
   * 使视口适应指定的边界
   */
  fitToBounds(e, n = 20) {
    const s = this.size.width / this.size.height, i = e.width / e.height;
    let r;
    i > s ? r = (this.size.width - n * 2) / e.width : r = (this.size.height - n * 2) / e.height;
    const c = e.x + e.width / 2, a = e.y + e.height / 2;
    this._zoom = r, this.position.set(c, a), this.markMatrixUpdate();
  }
  /**
   * 重置视口
   */
  reset() {
    this.position.set(0, 0), this._zoom = 1, this._rotation = 0, this._dirty = !0, this._cachedVisibleBounds = null;
  }
  // ============ 可见区域计算 ============
  /**
   * 获取在世界坐标系中的可见区域
   */
  getVisibleWorldBounds() {
    if (!this._visibleBoundsDirty)
      return this._cachedVisibleBounds;
    const e = [
      this.screenToWorld({ x: 0, y: 0 }),
      this.screenToWorld({ x: this.size.width, y: 0 }),
      this.screenToWorld({ x: 0, y: this.size.height }),
      this.screenToWorld({ x: this.size.width, y: this.size.height })
    ];
    return this._cachedVisibleBounds.fromPoints(e), this._cachedVisibleBounds;
  }
  /**
   * 检查一个世界矩形是否在可见区域内
   */
  isVisible(e, n = 0) {
    const s = this.getVisibleWorldBounds(), i = {
      x: s.x - n,
      y: s.y - n,
      width: s.width + n * 2,
      height: s.height + n * 2
    };
    return !(e.x + e.width < i.x || e.x > i.x + i.width || e.y + e.height < i.y || e.y > i.y + i.height);
  }
}
class rh {
  value;
  key;
  next;
  prev;
  constructor(e) {
    this.value = e;
  }
}
class p1 {
  head;
  tail;
  _len = 0;
  /**
   * Insert a new value at the tail
   */
  insert(e) {
    const n = new rh(e);
    return this.insertEntry(n), n;
  }
  /**
   * Insert an entry at the tail
   */
  insertEntry(e) {
    this.head ? (this.tail.next = e, e.prev = this.tail, e.next = null, this.tail = e) : this.head = this.tail = e, this._len++;
  }
  /**
   * Remove entry.
   */
  remove(e) {
    const n = e.prev, s = e.next;
    n ? n.next = s : this.head = s, s ? s.prev = n : this.tail = n, e.next = e.prev = null, this._len--;
  }
  /**
   * Get length
   */
  len() {
    return this._len;
  }
  /**
   * Clear list
   */
  clear() {
    this.head = this.tail = null, this._len = 0;
  }
}
const dt = 1e-6, oh = "zyx";
class Pt extends Float32Array {
  /**
   * The number of bytes in a {@link Vec2}.
   */
  static BYTE_LENGTH = 2 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Vec2}.
   */
  constructor(...e) {
    switch (e.length) {
      case 2: {
        const n = e[0];
        typeof n == "number" ? super([n, e[1]]) : super(n, e[1], 2);
        break;
      }
      case 1: {
        const n = e[0];
        n === void 0 ? super(2) : typeof n == "number" ? super([n, n]) : super(n, 0, 2);
        break;
      }
      default:
        super(2);
        break;
    }
  }
  //============
  // Attributes
  //============
  // Getters and setters to make component access read better.
  // These are likely to be a little bit slower than direct array access.
  /**
   * The x component of the vector. Equivalent to `this[0];`
   * @category Vector components
   */
  get x() {
    return this[0];
  }
  set x(e) {
    this[0] = e;
  }
  /**
   * The y component of the vector. Equivalent to `this[1];`
   * @category Vector components
   */
  get y() {
    return this[1];
  }
  set y(e) {
    this[1] = e;
  }
  // Alternate set of getters and setters in case this is being used to define
  // a color.
  /**
   * The r component of the vector. Equivalent to `this[0];`
   * @category Color components
   */
  get r() {
    return this[0];
  }
  set r(e) {
    this[0] = e;
  }
  /**
   * The g component of the vector. Equivalent to `this[1];`
   * @category Color components
   */
  get g() {
    return this[1];
  }
  set g(e) {
    this[1] = e;
  }
  /**
   * The magnitude (length) of this.
   * Equivalent to `Vec2.magnitude(this);`
   *
   * Magnitude is used because the `length` attribute is already defined by
   * TypedArrays to mean the number of elements in the array.
   */
  get magnitude() {
    return Math.hypot(this[0], this[1]);
  }
  /**
   * Alias for {@link Vec2.magnitude}
   */
  get mag() {
    return this.magnitude;
  }
  /**
   * The squared magnitude (length) of `this`.
   * Equivalent to `Vec2.squaredMagnitude(this);`
   */
  get squaredMagnitude() {
    const e = this[0], n = this[1];
    return e * e + n * n;
  }
  /**
   * Alias for {@link Vec2.squaredMagnitude}
   */
  get sqrMag() {
    return this.squaredMagnitude;
  }
  /**
   * A string representation of `this`
   * Equivalent to `Vec2.str(this);`
   */
  get str() {
    return Pt.str(this);
  }
  //===================
  // Instances methods
  //===================
  /**
   * Copy the values from another {@link Vec2} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(e) {
    return this.set(e), this;
  }
  // Instead of zero(), use a.fill(0) for instances;
  /**
   * Adds a {@link Vec2} to `this`.
   * Equivalent to `Vec2.add(this, this, b);`
   *
   * @param b - The vector to add to `this`
   * @returns `this`
   */
  add(e) {
    return this[0] += e[0], this[1] += e[1], this;
  }
  /**
   * Subtracts a {@link Vec2} from `this`.
   * Equivalent to `Vec2.subtract(this, this, b);`
   *
   * @param b - The vector to subtract from `this`
   * @returns `this`
   */
  subtract(e) {
    return this[0] -= e[0], this[1] -= e[1], this;
  }
  /**
   * Alias for {@link Vec2.subtract}
   */
  sub(e) {
    return this;
  }
  /**
   * Multiplies `this` by a {@link Vec2}.
   * Equivalent to `Vec2.multiply(this, this, b);`
   *
   * @param b - The vector to multiply `this` by
   * @returns `this`
   */
  multiply(e) {
    return this[0] *= e[0], this[1] *= e[1], this;
  }
  /**
   * Alias for {@link Vec2.multiply}
   */
  mul(e) {
    return this;
  }
  /**
   * Divides `this` by a {@link Vec2}.
   * Equivalent to `Vec2.divide(this, this, b);`
   *
   * @param b - The vector to divide `this` by
   * @returns {Vec2} `this`
   */
  divide(e) {
    return this[0] /= e[0], this[1] /= e[1], this;
  }
  /**
   * Alias for {@link Vec2.divide}
   */
  div(e) {
    return this;
  }
  /**
   * Scales `this` by a scalar number.
   * Equivalent to `Vec2.scale(this, this, b);`
   *
   * @param b - Amount to scale `this` by
   * @returns `this`
   */
  scale(e) {
    return this[0] *= e, this[1] *= e, this;
  }
  /**
   * Calculates `this` scaled by a scalar value then adds the result to `this`.
   * Equivalent to `Vec2.scaleAndAdd(this, this, b, scale);`
   *
   * @param b - The vector to add to `this`
   * @param scale - The amount to scale `b` by before adding
   * @returns `this`
   */
  scaleAndAdd(e, n) {
    return this[0] += e[0] * n, this[1] += e[1] * n, this;
  }
  /**
   * Calculates the euclidian distance between another {@link Vec2} and `this`.
   * Equivalent to `Vec2.distance(this, b);`
   *
   * @param b - The vector to calculate the distance to
   * @returns Distance between `this` and `b`
   */
  distance(e) {
    return Pt.distance(this, e);
  }
  /**
   * Alias for {@link Vec2.distance}
   */
  dist(e) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between another {@link Vec2} and `this`.
   * Equivalent to `Vec2.squaredDistance(this, b);`
   *
   * @param b The vector to calculate the squared distance to
   * @returns Squared distance between `this` and `b`
   */
  squaredDistance(e) {
    return Pt.squaredDistance(this, e);
  }
  /**
   * Alias for {@link Vec2.squaredDistance}
   */
  sqrDist(e) {
    return 0;
  }
  /**
   * Negates the components of `this`.
   * Equivalent to `Vec2.negate(this, this);`
   *
   * @returns `this`
   */
  negate() {
    return this[0] *= -1, this[1] *= -1, this;
  }
  /**
   * Inverts the components of `this`.
   * Equivalent to `Vec2.inverse(this, this);`
   *
   * @returns `this`
   */
  invert() {
    return this[0] = 1 / this[0], this[1] = 1 / this[1], this;
  }
  /**
   * Sets each component of `this` to it's absolute value.
   * Equivalent to `Vec2.abs(this, this);`
   *
   * @returns `this`
   */
  abs() {
    return this[0] = Math.abs(this[0]), this[1] = Math.abs(this[1]), this;
  }
  /**
   * Calculates the dot product of this and another {@link Vec2}.
   * Equivalent to `Vec2.dot(this, b);`
   *
   * @param b - The second operand
   * @returns Dot product of `this` and `b`
   */
  dot(e) {
    return this[0] * e[0] + this[1] * e[1];
  }
  /**
   * Normalize `this`.
   * Equivalent to `Vec2.normalize(this, this);`
   *
   * @returns `this`
   */
  normalize() {
    return Pt.normalize(this, this);
  }
  //================
  // Static methods
  //================
  /**
   * Creates a new, empty {@link Vec2}
   * @category Static
   *
   * @returns A new 2D vector
   */
  static create() {
    return new Pt();
  }
  /**
   * Creates a new {@link Vec2} initialized with values from an existing vector
   * @category Static
   *
   * @param a - Vector to clone
   * @returns A new 2D vector
   */
  static clone(e) {
    return new Pt(e);
  }
  /**
   * Creates a new {@link Vec2} initialized with the given values
   * @category Static
   *
   * @param x - X component
   * @param y - Y component
   * @returns A new 2D vector
   */
  static fromValues(e, n) {
    return new Pt(e, n);
  }
  /**
   * Copy the values from one {@link Vec2} to another
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - The source vector
   * @returns `out`
   */
  static copy(e, n) {
    return e[0] = n[0], e[1] = n[1], e;
  }
  /**
   * Set the components of a {@link Vec2} to the given values
   * @category Static
   *
   * @param out - The receiving vector
   * @param x - X component
   * @param y - Y component
   * @returns `out`
   */
  static set(e, n, s) {
    return e[0] = n, e[1] = s, e;
  }
  /**
   * Adds two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static add(e, n, s) {
    return e[0] = n[0] + s[0], e[1] = n[1] + s[1], e;
  }
  /**
   * Subtracts vector b from vector a
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static subtract(e, n, s) {
    return e[0] = n[0] - s[0], e[1] = n[1] - s[1], e;
  }
  /**
   * Alias for {@link Vec2.subtract}
   * @category Static
   */
  static sub(e, n, s) {
    return e;
  }
  /**
   * Multiplies two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static multiply(e, n, s) {
    return e[0] = n[0] * s[0], e[1] = n[1] * s[1], e;
  }
  /**
   * Alias for {@link Vec2.multiply}
   * @category Static
   */
  static mul(e, n, s) {
    return e;
  }
  /**
   * Divides two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static divide(e, n, s) {
    return e[0] = n[0] / s[0], e[1] = n[1] / s[1], e;
  }
  /**
   * Alias for {@link Vec2.divide}
   * @category Static
   */
  static div(e, n, s) {
    return e;
  }
  /**
   * Math.ceil the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to ceil
   * @returns `out`
   */
  static ceil(e, n) {
    return e[0] = Math.ceil(n[0]), e[1] = Math.ceil(n[1]), e;
  }
  /**
   * Math.floor the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to floor
   * @returns `out`
   */
  static floor(e, n) {
    return e[0] = Math.floor(n[0]), e[1] = Math.floor(n[1]), e;
  }
  /**
   * Returns the minimum of two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static min(e, n, s) {
    return e[0] = Math.min(n[0], s[0]), e[1] = Math.min(n[1], s[1]), e;
  }
  /**
   * Returns the maximum of two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static max(e, n, s) {
    return e[0] = Math.max(n[0], s[0]), e[1] = Math.max(n[1], s[1]), e;
  }
  /**
   * Math.round the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to round
   * @returns `out`
   */
  static round(e, n) {
    return e[0] = Math.round(n[0]), e[1] = Math.round(n[1]), e;
  }
  /**
   * Scales a {@link Vec2} by a scalar number
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The vector to scale
   * @param b - Amount to scale the vector by
   * @returns `out`
   */
  static scale(e, n, s) {
    return e[0] = n[0] * s, e[1] = n[1] * s, e;
  }
  /**
   * Adds two Vec2's after scaling the second operand by a scalar value
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @param scale - The amount to scale b by before adding
   * @returns `out`
   */
  static scaleAndAdd(e, n, s, i) {
    return e[0] = n[0] + s[0] * i, e[1] = n[1] + s[1] * i, e;
  }
  /**
   * Calculates the euclidian distance between two {@link Vec2}s
   * @category Static
   *
   * @param a - The first operand
   * @param b - The second operand
   * @returns distance between `a` and `b`
   */
  static distance(e, n) {
    return Math.hypot(n[0] - e[0], n[1] - e[1]);
  }
  /**
   * Alias for {@link Vec2.distance}
   * @category Static
   */
  static dist(e, n) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between two {@link Vec2}s
   * @category Static
   *
   * @param a - The first operand
   * @param b - The second operand
   * @returns Squared distance between `a` and `b`
   */
  static squaredDistance(e, n) {
    const s = n[0] - e[0], i = n[1] - e[1];
    return s * s + i * i;
  }
  /**
   * Alias for {@link Vec2.distance}
   * @category Static
   */
  static sqrDist(e, n) {
    return 0;
  }
  /**
   * Calculates the magnitude (length) of a {@link Vec2}
   * @category Static
   *
   * @param a - Vector to calculate magnitude of
   * @returns Magnitude of a
   */
  static magnitude(e) {
    let n = e[0], s = e[1];
    return Math.sqrt(n * n + s * s);
  }
  /**
   * Alias for {@link Vec2.magnitude}
   * @category Static
   */
  static mag(e) {
    return 0;
  }
  /**
   * Alias for {@link Vec2.magnitude}
   * @category Static
   * @deprecated Use {@link Vec2.magnitude} to avoid conflicts with builtin `length` methods/attribs
   *
   * @param a - vector to calculate length of
   * @returns length of a
   */
  // @ts-ignore: Length conflicts with Function.length
  static length(e) {
    return 0;
  }
  /**
   * Alias for {@link Vec2.magnitude}
   * @category Static
   * @deprecated Use {@link Vec2.mag}
   */
  static len(e) {
    return 0;
  }
  /**
   * Calculates the squared length of a {@link Vec2}
   * @category Static
   *
   * @param a - Vector to calculate squared length of
   * @returns Squared length of a
   */
  static squaredLength(e) {
    const n = e[0], s = e[1];
    return n * n + s * s;
  }
  /**
   * Alias for {@link Vec2.squaredLength}
   */
  static sqrLen(e, n) {
    return 0;
  }
  /**
   * Negates the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to negate
   * @returns `out`
   */
  static negate(e, n) {
    return e[0] = -n[0], e[1] = -n[1], e;
  }
  /**
   * Returns the inverse of the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to invert
   * @returns `out`
   */
  static inverse(e, n) {
    return e[0] = 1 / n[0], e[1] = 1 / n[1], e;
  }
  /**
   * Returns the absolute value of the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to compute the absolute values of
   * @returns `out`
   */
  static abs(e, n) {
    return e[0] = Math.abs(n[0]), e[1] = Math.abs(n[1]), e;
  }
  /**
   * Normalize a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to normalize
   * @returns `out`
   */
  static normalize(e, n) {
    const s = n[0], i = n[1];
    let r = s * s + i * i;
    return r > 0 && (r = 1 / Math.sqrt(r)), e[0] = n[0] * r, e[1] = n[1] * r, e;
  }
  /**
   * Calculates the dot product of two {@link Vec2}s
   * @category Static
   *
   * @param a - The first operand
   * @param b - The second operand
   * @returns Dot product of `a` and `b`
   */
  static dot(e, n) {
    return e[0] * n[0] + e[1] * n[1];
  }
  /**
   * Computes the cross product of two {@link Vec2}s
   * Note that the cross product must by definition produce a 3D vector.
   * For this reason there is also not instance equivalent for this function.
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static cross(e, n, s) {
    const i = n[0] * s[1] - n[1] * s[0];
    return e[0] = e[1] = 0, e[2] = i, e;
  }
  /**
   * Performs a linear interpolation between two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @param t - Interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static lerp(e, n, s, i) {
    const r = n[0], c = n[1];
    return e[0] = r + i * (s[0] - r), e[1] = c + i * (s[1] - c), e;
  }
  /**
   * Transforms the {@link Vec2} with a {@link Mat2}
   *
   * @param out - The receiving vector
   * @param a - The vector to transform
   * @param m - Matrix to transform with
   * @returns `out`
   */
  static transformMat2(e, n, s) {
    const i = n[0], r = n[1];
    return e[0] = s[0] * i + s[2] * r, e[1] = s[1] * i + s[3] * r, e;
  }
  /**
   * Transforms the {@link Vec2} with a {@link Mat2d}
   *
   * @param out - The receiving vector
   * @param a - The vector to transform
   * @param m - Matrix to transform with
   * @returns `out`
   */
  static transformMat2d(e, n, s) {
    const i = n[0], r = n[1];
    return e[0] = s[0] * i + s[2] * r + s[4], e[1] = s[1] * i + s[3] * r + s[5], e;
  }
  /**
   * Transforms the {@link Vec2} with a {@link Mat3}
   * 3rd vector component is implicitly '1'
   *
   * @param out - The receiving vector
   * @param a - The vector to transform
   * @param m - Matrix to transform with
   * @returns `out`
   */
  static transformMat3(e, n, s) {
    const i = n[0], r = n[1];
    return e[0] = s[0] * i + s[3] * r + s[6], e[1] = s[1] * i + s[4] * r + s[7], e;
  }
  /**
   * Transforms the {@link Vec2} with a {@link Mat4}
   * 3rd vector component is implicitly '0'
   * 4th vector component is implicitly '1'
   *
   * @param out - The receiving vector
   * @param a - The vector to transform
   * @param m - Matrix to transform with
   * @returns `out`
   */
  static transformMat4(e, n, s) {
    const i = n[0], r = n[1];
    return e[0] = s[0] * i + s[4] * r + s[12], e[1] = s[1] * i + s[5] * r + s[13], e;
  }
  /**
   * Rotate a 2D vector
   * @category Static
   *
   * @param out - The receiving {@link Vec2}
   * @param a - The {@link Vec2} point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotate(e, n, s, i) {
    const r = n[0] - s[0], c = n[1] - s[1], a = Math.sin(i), l = Math.cos(i);
    return e[0] = r * l - c * a + s[0], e[1] = r * a + c * l + s[1], e;
  }
  /**
   * Get the angle between two 2D vectors
   * @category Static
   *
   * @param a - The first operand
   * @param b - The second operand
   * @returns The angle in radians
   */
  static angle(e, n) {
    const s = e[0], i = e[1], r = n[0], c = n[1], a = Math.sqrt(s * s + i * i) * Math.sqrt(r * r + c * c), l = a && (s * r + i * c) / a;
    return Math.acos(Math.min(Math.max(l, -1), 1));
  }
  /**
   * Set the components of a {@link Vec2} to zero
   * @category Static
   *
   * @param out - The receiving vector
   * @returns `out`
   */
  static zero(e) {
    return e[0] = 0, e[1] = 0, e;
  }
  /**
   * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns `true` if the vectors components are ===, `false` otherwise.
   */
  static exactEquals(e, n) {
    return e[0] === n[0] && e[1] === n[1];
  }
  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns `true` if the vectors are approximately equal, `false` otherwise.
   */
  static equals(e, n) {
    const s = e[0], i = e[1], r = n[0], c = n[1];
    return Math.abs(s - r) <= dt * Math.max(1, Math.abs(s), Math.abs(r)) && Math.abs(i - c) <= dt * Math.max(1, Math.abs(i), Math.abs(c));
  }
  /**
   * Returns a string representation of a vector
   * @category Static
   *
   * @param a - Vector to represent as a string
   * @returns String representation of the vector
   */
  static str(e) {
    return `Vec2(${e.join(", ")})`;
  }
}
Pt.prototype.sub = Pt.prototype.subtract;
Pt.prototype.mul = Pt.prototype.multiply;
Pt.prototype.div = Pt.prototype.divide;
Pt.prototype.dist = Pt.prototype.distance;
Pt.prototype.sqrDist = Pt.prototype.squaredDistance;
Pt.sub = Pt.subtract;
Pt.mul = Pt.multiply;
Pt.div = Pt.divide;
Pt.dist = Pt.distance;
Pt.sqrDist = Pt.squaredDistance;
Pt.sqrLen = Pt.squaredLength;
Pt.mag = Pt.magnitude;
Pt.length = Pt.magnitude;
Pt.len = Pt.magnitude;
const ch = Pt, Wn = Pt.squaredDistance, ti = Math.pow, yn = Math.sqrt, Ai = 1e-8, Bc = 1e-4, go = yn(3), ei = 1 / 3, Ue = Pt.create(), Se = Pt.create(), $n = Pt.create();
function fn(o) {
  return o > -Ai && o < Ai;
}
function Yc(o) {
  return o > Ai || o < -Ai;
}
function He(o, e, n, s, i) {
  const r = 1 - i;
  return r * r * (r * o + 3 * i * e) + i * i * (i * s + 3 * r * n);
}
function m1(o, e, n, s, i) {
  const r = 1 - i;
  return 3 * (((e - o) * r + 2 * (n - e) * i) * r + (s - n) * i * i);
}
function g1(o, e, n, s, i, r) {
  const c = s + 3 * (e - n) - o, a = 3 * (n - e * 2 + o), l = 3 * (e - o), h = o - i, u = a * a - 3 * c * l, f = a * l - 9 * c * h, d = l * l - 3 * a * h;
  let y = 0;
  if (fn(u) && fn(f))
    if (fn(a))
      r[0] = 0;
    else {
      const x = -l / a;
      x >= 0 && x <= 1 && (r[y++] = x);
    }
  else {
    const x = f * f - 4 * u * d;
    if (fn(x)) {
      const g = f / u, w = -a / c + g, M = -g / 2;
      w >= 0 && w <= 1 && (r[y++] = w), M >= 0 && M <= 1 && (r[y++] = M);
    } else if (x > 0) {
      const g = yn(x);
      let w = u * a + 1.5 * c * (-f + g), M = u * a + 1.5 * c * (-f - g);
      w < 0 ? w = -ti(-w, ei) : w = ti(w, ei), M < 0 ? M = -ti(-M, ei) : M = ti(M, ei);
      const P = (-a - (w + M)) / (3 * c);
      P >= 0 && P <= 1 && (r[y++] = P);
    } else {
      const g = (2 * u * a - 3 * c * f) / (2 * yn(u * u * u)), w = Math.acos(g) / 3, M = yn(u), P = Math.cos(w), S = (-a - 2 * M * P) / (3 * c), k = (-a + M * (P + go * Math.sin(w))) / (3 * c), O = (-a + M * (P - go * Math.sin(w))) / (3 * c);
      S >= 0 && S <= 1 && (r[y++] = S), k >= 0 && k <= 1 && (r[y++] = k), O >= 0 && O <= 1 && (r[y++] = O);
    }
  }
  return y;
}
function w1(o, e, n, s, i) {
  const r = 6 * n - 12 * e + 6 * o, c = 9 * e + 3 * s - 3 * o - 9 * n, a = 3 * e - 3 * o;
  let l = 0;
  if (fn(c)) {
    if (Yc(r)) {
      const h = -a / r;
      h >= 0 && h <= 1 && (i[l++] = h);
    }
  } else {
    const h = r * r - 4 * c * a;
    if (fn(h))
      i[0] = -r / (2 * c);
    else if (h > 0) {
      const u = yn(h), f = (-r + u) / (2 * c), d = (-r - u) / (2 * c);
      f >= 0 && f <= 1 && (i[l++] = f), d >= 0 && d <= 1 && (i[l++] = d);
    }
  }
  return l;
}
function v1(o, e, n, s, i, r) {
  const c = (e - o) * i + o, a = (n - e) * i + e, l = (s - n) * i + n, h = (a - c) * i + c, u = (l - a) * i + a, f = (u - h) * i + h;
  r[0] = o, r[1] = c, r[2] = h, r[3] = f, r[4] = f, r[5] = u, r[6] = l, r[7] = s;
}
function M1(o, e, n, s, i, r, c, a, l, h, u) {
  let f = 0, d = 5e-3, y = 1 / 0, x, g, w, M;
  Ue[0] = l, Ue[1] = h;
  for (let P = 0; P < 1; P += 0.05)
    Se[0] = He(o, n, i, c, P), Se[1] = He(e, s, r, a, P), w = Wn(Ue, Se), w < y && (f = P, y = w);
  y = 1 / 0;
  for (let P = 0; P < 32 && !(d < Bc); P++)
    x = f - d, g = f + d, Se[0] = He(o, n, i, c, x), Se[1] = He(e, s, r, a, x), w = Wn(Se, Ue), x >= 0 && w < y ? (f = x, y = w) : ($n[0] = He(o, n, i, c, g), $n[1] = He(e, s, r, a, g), M = Wn($n, Ue), g <= 1 && M < y ? (f = g, y = M) : d *= 0.5);
  return u && (u[0] = He(o, n, i, c, f), u[1] = He(e, s, r, a, f)), yn(y);
}
function b1(o, e, n, s, i, r, c, a, l) {
  let h = o, u = e, f = 0;
  const d = 1 / l;
  for (let y = 1; y <= l; y++) {
    let x = y * d;
    const g = He(o, n, i, c, x), w = He(e, s, r, a, x), M = g - h, P = w - u;
    f += Math.sqrt(M * M + P * P), h = g, u = w;
  }
  return f;
}
function Be(o, e, n, s) {
  const i = 1 - s;
  return i * (i * o + 2 * s * e) + s * s * n;
}
function _1(o, e, n, s) {
  return 2 * ((1 - s) * (e - o) + s * (n - e));
}
function T1(o, e, n, s, i) {
  const r = o - 2 * e + n, c = 2 * (e - o), a = o - s;
  let l = 0;
  if (fn(r)) {
    if (Yc(c)) {
      const h = -a / c;
      h >= 0 && h <= 1 && (i[l++] = h);
    }
  } else {
    const h = c * c - 4 * r * a;
    if (fn(h)) {
      const u = -c / (2 * r);
      u >= 0 && u <= 1 && (i[l++] = u);
    } else if (h > 0) {
      const u = yn(h), f = (-c + u) / (2 * r), d = (-c - u) / (2 * r);
      f >= 0 && f <= 1 && (i[l++] = f), d >= 0 && d <= 1 && (i[l++] = d);
    }
  }
  return l;
}
function P1(o, e, n) {
  const s = o + n - 2 * e;
  return s === 0 ? 0.5 : (o - e) / s;
}
function A1(o, e, n, s, i) {
  const r = (e - o) * s + o, c = (n - e) * s + e, a = (c - r) * s + r;
  i[0] = o, i[1] = r, i[2] = a, i[3] = a, i[4] = c, i[5] = n;
}
function E1(o, e, n, s, i, r, c, a, l) {
  let h = 0, u = 5e-3, f = 1 / 0;
  Ue[0] = c, Ue[1] = a;
  for (let d = 0; d < 1; d += 0.05) {
    Se[0] = Be(o, n, i, d), Se[1] = Be(e, s, r, d);
    const y = Wn(Ue, Se);
    y < f && (h = d, f = y);
  }
  f = 1 / 0;
  for (let d = 0; d < 32 && !(u < Bc); d++) {
    const y = h - u, x = h + u;
    Se[0] = Be(o, n, i, y), Se[1] = Be(e, s, r, y);
    const g = Wn(Se, Ue);
    if (y >= 0 && g < f)
      h = y, f = g;
    else {
      $n[0] = Be(o, n, i, x), $n[1] = Be(e, s, r, x);
      const w = Wn($n, Ue);
      x <= 1 && w < f ? (h = x, f = w) : u *= 0.5;
    }
  }
  return l && (l[0] = Be(o, n, i, h), l[1] = Be(e, s, r, h)), yn(f);
}
function L1(o, e, n, s, i, r, c) {
  let a = o, l = e, h = 0;
  const u = 1 / c;
  for (let f = 1; f <= c; f++) {
    let d = f * u;
    const y = Be(o, n, i, d), x = Be(e, s, r, d), g = y - a, w = x - l;
    h += Math.sqrt(g * g + w * w), a = y, l = x;
  }
  return h;
}
function kn(o, e = 0, n = 1) {
  return Math.min(Math.max(o, e), n);
}
function Vc(o, e, n) {
  o /= 255, e /= 255, n /= 255;
  const s = Math.max(o, e, n), i = Math.min(o, e, n);
  let r = 0, c, a = (s + i) / 2;
  if (s == i)
    r = c = 0;
  else {
    const l = s - i;
    switch (c = a > 0.5 ? l / (2 - s - i) : l / (s + i), s) {
      case o:
        r = (e - n) / l + (e < n ? 6 : 0);
        break;
      case e:
        r = (n - o) / l + 2;
        break;
      case n:
        r = (o - e) / l + 4;
        break;
    }
    r /= 6;
  }
  return { h: r, s: c, l: a };
}
function yr(o, e, n) {
  let s, i, r;
  if (e == 0)
    s = i = r = n;
  else {
    const c = (h, u, f) => (f < 0 && (f += 1), f > 1 && (f -= 1), f < 0.16666666666666666 ? h + (u - h) * 6 * f : f < 0.5 ? u : f < 0.6666666666666666 ? h + (u - h) * (0.6666666666666666 - f) * 6 : h), a = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - a;
    s = c(l, a, o + 1 / 3), i = c(l, a, o), r = c(l, a, o - 1 / 3);
  }
  return { r: s * 255, g: i * 255, b: r * 255 };
}
function ah(o, e, n) {
  o /= 255, e /= 255, n /= 255;
  const s = Math.max(o, e, n), i = Math.min(o, e, n);
  let r = 0, c, a = s;
  const l = s - i;
  if (c = s == 0 ? 0 : l / s, s == i)
    r = 0;
  else {
    switch (s) {
      case o:
        r = (e - n) / l + (e < n ? 6 : 0);
        break;
      case e:
        r = (n - o) / l + 2;
        break;
      case n:
        r = (o - e) / l + 4;
        break;
    }
    r /= 6;
  }
  return { h: r, s: c, v: a };
}
function Uc(o, e, n) {
  let s = 0, i = 0, r = 0;
  const c = Math.floor(o * 6), a = o * 6 - c, l = n * (1 - e), h = n * (1 - a * e), u = n * (1 - (1 - a) * e);
  switch (c % 6) {
    case 0:
      s = n, i = u, r = l;
      break;
    case 1:
      s = h, i = n, r = l;
      break;
    case 2:
      s = l, i = n, r = u;
      break;
    case 3:
      s = l, i = h, r = n;
      break;
    case 4:
      s = u, i = l, r = n;
      break;
    case 5:
      s = n, i = l, r = h;
      break;
  }
  return { r: s * 255, g: i * 255, b: r * 255 };
}
function lh(o, e, n) {
  const s = n + e * Math.min(n, 1 - n), i = s === 0 ? 0 : 2 * (1 - n / s);
  return { h: o, s: i, v: s };
}
function hh(o, e, n) {
  const s = (2 - e) * n / 2, i = e === 0 ? e : s <= 1 ? e * n / (2 - e * n) : e * n / (2 - e);
  return { h: o, s: i, l: s };
}
function Xc(o) {
  typeof o == "string" && (o = o.replace("#", ""), o = o.length === 3 ? o.replace(/(\w)/g, "$1$1") : o, o = parseInt("0x" + o, 16));
  const e = o, n = e >> 16 & 255, s = e >> 8 & 255, i = e & 255;
  return { r: n, g: s, b: i };
}
function Wc(o, e, n) {
  const s = o.r + (e.r - o.r) * n, i = o.g + (e.g - o.g) * n, r = o.b + (e.b - o.b) * n;
  return { r: s, g: i, b: r };
}
const wo = {
  aliceblue: Float32Array.of(0.941, 0.973, 1, 1),
  antiquewhite: Float32Array.of(0.98, 0.922, 0.843, 1),
  aqua: Float32Array.of(0, 1, 1, 1),
  aquamarine: Float32Array.of(0.498, 1, 0.831, 1),
  azure: Float32Array.of(0.941, 1, 1, 1),
  beige: Float32Array.of(0.961, 0.961, 0.863, 1),
  bisque: Float32Array.of(1, 0.894, 0.769, 1),
  black: Float32Array.of(0, 0, 0, 1),
  blanchedalmond: Float32Array.of(1, 0.922, 0.804, 1),
  blue: Float32Array.of(0, 0, 1, 1),
  blueviolet: Float32Array.of(0.541, 0.169, 0.886, 1),
  brown: Float32Array.of(0.647, 0.165, 0.165, 1),
  burlywood: Float32Array.of(0.871, 0.722, 0.529, 1),
  cadetblue: Float32Array.of(0.373, 0.62, 0.627, 1),
  chartreuse: Float32Array.of(0.498, 1, 0, 1),
  chocolate: Float32Array.of(0.824, 0.412, 0.118, 1),
  coral: Float32Array.of(1, 0.498, 0.314, 1),
  cornflowerblue: Float32Array.of(0.392, 0.584, 0.929, 1),
  cornsilk: Float32Array.of(1, 0.973, 0.863, 1),
  crimson: Float32Array.of(0.863, 0.078, 0.235, 1),
  cyan: Float32Array.of(0, 1, 1, 1),
  darkblue: Float32Array.of(0, 0, 0.545, 1),
  darkcyan: Float32Array.of(0, 0.545, 0.545, 1),
  darkgoldenrod: Float32Array.of(0.722, 0.525, 0.043, 1),
  darkgray: Float32Array.of(0.663, 0.663, 0.663, 1),
  darkgreen: Float32Array.of(0, 0.392, 0, 1),
  darkgrey: Float32Array.of(0.663, 0.663, 0.663, 1),
  darkkhaki: Float32Array.of(0.741, 0.718, 0.42, 1),
  darkmagenta: Float32Array.of(0.545, 0, 0.545, 1),
  darkolivegreen: Float32Array.of(0.333, 0.42, 0.184, 1),
  darkorange: Float32Array.of(1, 0.549, 0, 1),
  darkorchid: Float32Array.of(0.6, 0.196, 0.8, 1),
  darkred: Float32Array.of(0.545, 0, 0, 1),
  darksalmon: Float32Array.of(0.914, 0.588, 0.478, 1),
  darkseagreen: Float32Array.of(0.561, 0.737, 0.561, 1),
  darkslateblue: Float32Array.of(0.282, 0.239, 0.545, 1),
  darkslategray: Float32Array.of(0.184, 0.31, 0.31, 1),
  darkslategrey: Float32Array.of(0.184, 0.31, 0.31, 1),
  darkturquoise: Float32Array.of(0, 0.808, 0.82, 1),
  darkviolet: Float32Array.of(0.58, 0, 0.827, 1),
  deeppink: Float32Array.of(1, 0.078, 0.576, 1),
  deepskyblue: Float32Array.of(0, 0.749, 1, 1),
  dimgray: Float32Array.of(0.412, 0.412, 0.412, 1),
  dimgrey: Float32Array.of(0.412, 0.412, 0.412, 1),
  dodgerblue: Float32Array.of(0.118, 0.565, 1, 1),
  firebrick: Float32Array.of(0.698, 0.133, 0.133, 1),
  floralwhite: Float32Array.of(1, 0.98, 0.941, 1),
  forestgreen: Float32Array.of(0.133, 0.545, 0.133, 1),
  fuchsia: Float32Array.of(1, 0, 1, 1),
  gainsboro: Float32Array.of(0.863, 0.863, 0.863, 1),
  ghostwhite: Float32Array.of(0.973, 0.973, 1, 1),
  gold: Float32Array.of(1, 0.843, 0, 1),
  goldenrod: Float32Array.of(0.855, 0.647, 0.125, 1),
  gray: Float32Array.of(0.502, 0.502, 0.502, 1),
  green: Float32Array.of(0, 0.502, 0, 1),
  greenyellow: Float32Array.of(0.678, 1, 0.184, 1),
  grey: Float32Array.of(0.502, 0.502, 0.502, 1),
  honeydew: Float32Array.of(0.941, 1, 0.941, 1),
  hotpink: Float32Array.of(1, 0.412, 0.706, 1),
  indianred: Float32Array.of(0.804, 0.361, 0.361, 1),
  indigo: Float32Array.of(0.294, 0, 0.51, 1),
  ivory: Float32Array.of(1, 1, 0.941, 1),
  khaki: Float32Array.of(0.941, 0.902, 0.549, 1),
  lavender: Float32Array.of(0.902, 0.902, 0.98, 1),
  lavenderblush: Float32Array.of(1, 0.941, 0.961, 1),
  lawngreen: Float32Array.of(0.486, 0.988, 0, 1),
  lemonchiffon: Float32Array.of(1, 0.98, 0.804, 1),
  lightblue: Float32Array.of(0.678, 0.847, 0.902, 1),
  lightcoral: Float32Array.of(0.941, 0.502, 0.502, 1),
  lightcyan: Float32Array.of(0.878, 1, 1, 1),
  lightgoldenrodyellow: Float32Array.of(0.98, 0.98, 0.824, 1),
  lightgray: Float32Array.of(0.827, 0.827, 0.827, 1),
  lightgreen: Float32Array.of(0.565, 0.933, 0.565, 1),
  lightgrey: Float32Array.of(0.827, 0.827, 0.827, 1),
  lightpink: Float32Array.of(1, 0.714, 0.757, 1),
  lightsalmon: Float32Array.of(1, 0.627, 0.478, 1),
  lightseagreen: Float32Array.of(0.125, 0.698, 0.667, 1),
  lightskyblue: Float32Array.of(0.529, 0.808, 0.98, 1),
  lightslategray: Float32Array.of(0.467, 0.533, 0.6, 1),
  lightslategrey: Float32Array.of(0.467, 0.533, 0.6, 1),
  lightsteelblue: Float32Array.of(0.69, 0.769, 0.871, 1),
  lightyellow: Float32Array.of(1, 1, 0.878, 1),
  lime: Float32Array.of(0, 1, 0, 1),
  limegreen: Float32Array.of(0.196, 0.804, 0.196, 1),
  linen: Float32Array.of(0.98, 0.941, 0.902, 1),
  magenta: Float32Array.of(1, 0, 1, 1),
  maroon: Float32Array.of(0.502, 0, 0, 1),
  mediumaquamarine: Float32Array.of(0.4, 0.804, 0.667, 1),
  mediumblue: Float32Array.of(0, 0, 0.804, 1),
  mediumorchid: Float32Array.of(0.729, 0.333, 0.827, 1),
  mediumpurple: Float32Array.of(0.576, 0.439, 0.859, 1),
  mediumseagreen: Float32Array.of(0.235, 0.702, 0.443, 1),
  mediumslateblue: Float32Array.of(0.482, 0.408, 0.933, 1),
  mediumspringgreen: Float32Array.of(0, 0.98, 0.604, 1),
  mediumturquoise: Float32Array.of(0.282, 0.82, 0.8, 1),
  mediumvioletred: Float32Array.of(0.78, 0.082, 0.522, 1),
  midnightblue: Float32Array.of(0.098, 0.098, 0.439, 1),
  mintcream: Float32Array.of(0.961, 1, 0.98, 1),
  mistyrose: Float32Array.of(1, 0.894, 0.882, 1),
  moccasin: Float32Array.of(1, 0.894, 0.71, 1),
  navajowhite: Float32Array.of(1, 0.871, 0.678, 1),
  navy: Float32Array.of(0, 0, 0.502, 1),
  oldlace: Float32Array.of(0.992, 0.961, 0.902, 1),
  olive: Float32Array.of(0.502, 0.502, 0, 1),
  olivedrab: Float32Array.of(0.42, 0.557, 0.137, 1),
  orange: Float32Array.of(1, 0.647, 0, 1),
  orangered: Float32Array.of(1, 0.271, 0, 1),
  orchid: Float32Array.of(0.855, 0.439, 0.839, 1),
  palegoldenrod: Float32Array.of(0.933, 0.91, 0.667, 1),
  palegreen: Float32Array.of(0.596, 0.984, 0.596, 1),
  paleturquoise: Float32Array.of(0.686, 0.933, 0.933, 1),
  palevioletred: Float32Array.of(0.859, 0.439, 0.576, 1),
  papayawhip: Float32Array.of(1, 0.937, 0.835, 1),
  peachpuff: Float32Array.of(1, 0.855, 0.725, 1),
  peru: Float32Array.of(0.804, 0.522, 0.247, 1),
  pink: Float32Array.of(1, 0.753, 0.796, 1),
  plum: Float32Array.of(0.867, 0.627, 0.867, 1),
  powderblue: Float32Array.of(0.69, 0.878, 0.902, 1),
  purple: Float32Array.of(0.502, 0, 0.502, 1),
  rebeccapurple: Float32Array.of(0.4, 0.2, 0.6, 1),
  red: Float32Array.of(1, 0, 0, 1),
  rosybrown: Float32Array.of(0.737, 0.561, 0.561, 1),
  royalblue: Float32Array.of(0.255, 0.412, 0.882, 1),
  saddlebrown: Float32Array.of(0.545, 0.271, 0.075, 1),
  salmon: Float32Array.of(0.98, 0.502, 0.447, 1),
  sandybrown: Float32Array.of(0.957, 0.643, 0.376, 1),
  seagreen: Float32Array.of(0.18, 0.545, 0.341, 1),
  seashell: Float32Array.of(1, 0.961, 0.933, 1),
  sienna: Float32Array.of(0.627, 0.322, 0.176, 1),
  silver: Float32Array.of(0.753, 0.753, 0.753, 1),
  skyblue: Float32Array.of(0.529, 0.808, 0.922, 1),
  slateblue: Float32Array.of(0.416, 0.353, 0.804, 1),
  slategray: Float32Array.of(0.439, 0.502, 0.565, 1),
  slategrey: Float32Array.of(0.439, 0.502, 0.565, 1),
  snow: Float32Array.of(1, 0.98, 0.98, 1),
  springgreen: Float32Array.of(0, 1, 0.498, 1),
  steelblue: Float32Array.of(0.275, 0.51, 0.706, 1),
  tan: Float32Array.of(0.824, 0.706, 0.549, 1),
  teal: Float32Array.of(0, 0.502, 0.502, 1),
  thistle: Float32Array.of(0.847, 0.749, 0.847, 1),
  tomato: Float32Array.of(1, 0.388, 0.278, 1),
  transparent: Float32Array.of(0, 0, 0, 0),
  turquoise: Float32Array.of(0.251, 0.878, 0.816, 1),
  violet: Float32Array.of(0.933, 0.51, 0.933, 1),
  wheat: Float32Array.of(0.961, 0.871, 0.702, 1),
  white: Float32Array.of(1, 1, 1, 1),
  whitesmoke: Float32Array.of(0.961, 0.961, 0.961, 1),
  yellow: Float32Array.of(1, 1, 0, 1),
  yellowgreen: Float32Array.of(0.604, 0.804, 0.196, 1)
};
class ge extends Float32Array {
  static Transparent = ge.fromRGBA(0, 0, 0, 0);
  static BLACK = ge.fromRGB(0, 0, 0);
  static WHITE = ge.fromRGB(1, 1, 1);
  static isColor(e) {
    return e == null || e === "none" ? !1 : typeof e == "string" || typeof e == "number" || e instanceof ge;
  }
  static parse(e) {
    const n = typeof e == "string";
    if (!this.isColor(e))
      return this.fromRGB(0, 0, 0);
    if (n && e.toLowerCase().startsWith("rgb")) {
      const s = e.match(/rgba?\s*\(([^)]+)\)\s*/i);
      if (s) {
        const i = s[1].split(",").map(parseInt), r = this.fromRGB(i[0], i[1], i[2]);
        return i.length === 4 && (r.alpha = i[3]), r;
      }
    } else if (n && e.startsWith("#") || typeof e == "number")
      return this.fromRGB(Xc(e));
    if (n && wo[e]) {
      const s = wo[e];
      return this.fromRGB(s[0] * 255 >> 0, s[1] * 255 >> 0, s[2] * 255 >> 0);
    } else if (typeof e == "object" && e !== null)
      return this.fromRGB(e);
    return this.fromRGB(0, 0, 0);
  }
  static fromRGB(e, n, s) {
    return e !== null && typeof e == "object" ? new ge(e.r, e.g, e.b) : new ge(e, n, s);
  }
  static fromRGBA(e, n, s, i) {
    return e !== null && typeof e == "object" ? new ge(e.r, e.g, e.b, n) : new ge(e, n, s, i);
  }
  static fromHSL(e, n, s) {
    const { r: i, g: r, b: c } = yr(e, n, s);
    return new ge(i, r, c);
  }
  static fromHSV(e, n, s) {
    const { r: i, g: r, b: c } = Uc(e, n, s);
    return new ge(i, r, c);
  }
  type = "Color";
  isColor = !0;
  // 构造函数，支持RGB、HSL和HSV初始化
  constructor(e = 0, n = 0, s = 0, i = 1) {
    super(4), this[0] = e, this[1] = n, this[2] = s, this[3] = i;
  }
  copy(e) {
    return this[0] = e[0], this[1] = e[1], this[2] = e[2], this.alpha = e.alpha, this;
  }
  clone() {
    return ge.fromRGB(0, 0, 0).copy(this);
  }
  setRGB(e, n, s) {
    return this.r = e, this.g = n, this.b = s, this;
  }
  normalize() {
    return this.r = kn(this.r / 255, 0, 1), this.g = kn(this.g / 255, 0, 1), this.b = kn(this.b / 255, 0, 1), this;
  }
  set r(e) {
    this[0] = e;
  }
  get r() {
    return this[0];
  }
  set g(e) {
    this[1] = e;
  }
  get g() {
    return this[1];
  }
  set b(e) {
    this[2] = e;
  }
  get b() {
    return this[2];
  }
  get a() {
    return this.alpha;
  }
  set a(e) {
    this.alpha = e;
  }
  set alpha(e) {
    this[3] = Math.max(0, Math.min(1, e));
  }
  get alpha() {
    return this[3];
  }
  equals(e) {
    return this.r !== e.r || this.g !== e.g || this.b !== e.b || this.alpha !== e.alpha;
  }
  setOpacity(e) {
    return this.alpha = e, this;
  }
  // 颜色混合
  mix(e, n, s = 0.5) {
    const { r: i, g: r, b: c } = Wc(e, n, s);
    return new ge(i, r, c);
  }
  setRBG(e, n, s) {
    return this.r = e, this.g = n, this.b = s, this;
  }
  setRGBColor(e) {
    return this.r = e.r, this.g = e.g, this.b = e.b, this;
  }
  // 变亮
  brighten(e) {
    const { h: n, s, l: i } = Vc(this.r, this.g, this.b);
    return this.setRGBColor(yr(n, s, i * (1 + e)));
  }
  multiplyScalar(e) {
    return this.r *= e, this.g *= e, this.b *= e, this;
  }
  multiply(e) {
    return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
  }
  add(e) {
    return this.r += e.r, this.g += e.g, this.b += e.b, this;
  }
  round() {
    return this.r = Math.round(this.r), this.g = Math.round(this.g), this.b = Math.round(this.b), this;
  }
  floor() {
    return this.r = Math.floor(this.r), this.g = Math.floor(this.g), this.b = Math.floor(this.b), this;
  }
  clamp(e = 0, n = 1) {
    return this.r = kn(this.r, e, n), this.g = kn(this.g, e, n), this.b = kn(this.b, e, n), this;
  }
  toCssRGB() {
    return `rgb(${Math.round(this.r)},${Math.round(this.g)},${Math.round(this.b)})`;
  }
  toCssRGBA() {
    return `rgba(${Math.round(this.r)},${Math.round(this.g)},${Math.round(this.b)},${this.alpha})`;
  }
  dispose() {
  }
}
const S1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Color: ge,
  hexToRgb: Xc,
  hslToHsv: lh,
  hslToRgb: yr,
  hsvToHsl: hh,
  hsvToRgb: Uc,
  lerpColor: Wc,
  rgbToHsl: Vc,
  rgbToHsv: ah
}, Symbol.toStringTag, { value: "Module" }));
function xr(o, e, n) {
  return o + (e - o) * n;
}
function wn(o, e, n) {
  return [xr(o[0], e[0], n), xr(o[1], e[1], n)];
}
function $c(o, e) {
  const [n, s] = o, [i, r] = e;
  return !(n[0] > r[0] || s[0] < i[0] || n[1] > r[1] || s[1] < i[1]);
}
let jc = class {
};
class Gc extends jc {
  epsilon;
  constructor(e = 1e-10) {
    super(), this.epsilon = e;
  }
  snap0(e) {
    return Math.abs(e) < this.epsilon ? 0 : e;
  }
  snap01(e) {
    return Math.abs(e) < this.epsilon ? 0 : Math.abs(1 - e) < this.epsilon ? 1 : e;
  }
  isCollinear(e, n, s) {
    const i = e[0] - n[0], r = e[1] - n[1], c = n[0] - s[0], a = n[1] - s[1];
    return Math.abs(i * a - c * r) < this.epsilon;
  }
  solveCubicNormalized(e, n, s) {
    const i = e / 3, r = n / 3, c = i * i - r, a = i * (i * i - n / 2) + s / 2;
    if (Math.abs(a) < this.epsilon && Math.abs(c) < this.epsilon)
      return [-i];
    const l = i * (i * (4 * i * s - r * n) - 2 * n * s) + 4 * r * r * r + s * s;
    if (Math.abs(l) < this.epsilon) {
      const f = Math.sqrt(c);
      return a > 0 ? [-2 * f - e / 3, f - e / 3] : [-f - e / 3, 2 * f - e / 3];
    }
    const h = c * c * c, u = a * a;
    if (u < h) {
      const f = (a < 0 ? -1 : 1) * Math.sqrt(u / h), d = Math.acos(f), y = -2 * Math.sqrt(c), x = y * Math.cos(d / 3) - i, g = y * Math.cos((d + 2 * Math.PI) / 3) - i, w = y * Math.cos((d - 2 * Math.PI) / 3) - i;
      return [x, g, w].sort((M, P) => M - P);
    } else {
      const f = (a < 0 ? 1 : -1) * Math.pow(Math.abs(a) + Math.sqrt(u - h), 0.3333333333333333), d = Math.abs(f) >= this.epsilon ? c / f : 0;
      return [f + d - i];
    }
  }
  solveCubic(e, n, s, i) {
    if (Math.abs(e) < this.epsilon) {
      if (Math.abs(n) < this.epsilon)
        return Math.abs(s) < this.epsilon ? Math.abs(i) < this.epsilon ? [0] : [] : [-i / s];
      const r = 2 * n;
      let c = s * s - 4 * n * i;
      return Math.abs(c) < this.epsilon ? [-s / r] : c > 0 ? (c = Math.sqrt(c), [(-s + c) / r, (-s - c) / r].sort((a, l) => a - l)) : [];
    }
    return this.solveCubicNormalized(n / e, s / e, i / e);
  }
  isEqualVec2(e, n) {
    return Math.abs(e[0] - n[0]) < this.epsilon && Math.abs(e[1] - n[1]) < this.epsilon;
  }
  compareVec2(e, n) {
    return Math.abs(n[0] - e[0]) < this.epsilon ? Math.abs(n[1] - e[1]) < this.epsilon ? 0 : e[1] < n[1] ? -1 : 1 : e[0] < n[0] ? -1 : 1;
  }
}
class pr {
  tValues = [];
  geo;
  constructor(e) {
    this.geo = e;
  }
  addArray(e) {
    for (const n of e)
      this.tValues.push(n);
    return this;
  }
  add(e) {
    if (e = this.geo.snap01(e), e < 0 || e > 1)
      return this;
    for (const n of this.tValues)
      if (this.geo.snap0(e - n) === 0)
        return this;
    return this.tValues.push(e), this;
  }
  list() {
    return this.tValues.sort((e, n) => e - n), this.tValues;
  }
}
class Ss {
  tValuePairs = [];
  allowOutOfRange;
  geo;
  constructor(e, n) {
    this.allowOutOfRange = e, this.geo = n;
  }
  add(e, n) {
    if (e = this.geo.snap01(e), n = this.geo.snap01(n), !this.allowOutOfRange && (e < 0 || e > 1 || n < 0 || n > 1))
      return this;
    for (const s of this.tValuePairs)
      if (this.geo.snap0(e - s[0]) === 0 || this.geo.snap0(n - s[1]) === 0)
        return this;
    return this.tValuePairs.push([e, n]), this;
  }
  list() {
    return this.tValuePairs.sort((e, n) => e[0] - n[0]), this.tValuePairs;
  }
  done() {
    return this.tValuePairs.length <= 0 ? null : {
      kind: "tValuePairs",
      tValuePairs: this.list()
    };
  }
}
class Xr {
}
class jt extends Xr {
  p0;
  p1;
  geo;
  constructor(e, n, s) {
    super(), this.p0 = e, this.p1 = n, this.geo = s;
  }
  copy() {
    return new jt(this.p0, this.p1, this.geo);
  }
  isEqual(e) {
    return this.geo.isEqualVec2(this.p0, e.p0) && this.geo.isEqualVec2(this.p1, e.p1);
  }
  start() {
    return this.p0;
  }
  start2() {
    return this.p1;
  }
  end2() {
    return this.p0;
  }
  end() {
    return this.p1;
  }
  setStart(e) {
    this.p0 = e;
  }
  setEnd(e) {
    this.p1 = e;
  }
  point(e) {
    const n = this.p0, s = this.p1;
    return e === 0 ? n : e === 1 ? s : [n[0] + (s[0] - n[0]) * e, n[1] + (s[1] - n[1]) * e];
  }
  split(e) {
    if (e.length <= 0)
      return [this];
    const n = e.map((r) => this.point(r));
    n.push(this.p1);
    const s = [];
    let i = this.p0;
    for (const r of n)
      s.push(new jt(i, r, this.geo)), i = r;
    return s;
  }
  reverse() {
    return new jt(this.p1, this.p0, this.geo);
  }
  boundingBox() {
    const e = this.p0, n = this.p1;
    return [
      [Math.min(e[0], n[0]), Math.min(e[1], n[1])],
      [Math.max(e[0], n[0]), Math.max(e[1], n[1])]
    ];
  }
  pointOn(e) {
    return this.geo.isCollinear(e, this.p0, this.p1);
  }
  draw(e) {
    const n = this.p0, s = this.p1;
    return e.moveTo(n[0], n[1]), e.lineTo(s[0], s[1]), e;
  }
}
class $t extends Xr {
  p0;
  p1;
  p2;
  p3;
  geo;
  constructor(e, n, s, i, r) {
    super(), this.p0 = e, this.p1 = n, this.p2 = s, this.p3 = i, this.geo = r;
  }
  copy() {
    return new $t(this.p0, this.p1, this.p2, this.p3, this.geo);
  }
  isEqual(e) {
    return this.geo.isEqualVec2(this.p0, e.p0) && this.geo.isEqualVec2(this.p1, e.p1) && this.geo.isEqualVec2(this.p2, e.p2) && this.geo.isEqualVec2(this.p3, e.p3);
  }
  start() {
    return this.p0;
  }
  start2() {
    return this.p1;
  }
  end2() {
    return this.p2;
  }
  end() {
    return this.p3;
  }
  setStart(e) {
    this.p0 = e;
  }
  setEnd(e) {
    this.p3 = e;
  }
  point(e) {
    const n = this.p0, s = this.p1, i = this.p2, r = this.p3;
    if (e === 0)
      return n;
    if (e === 1)
      return r;
    const c = (1 - e) * (1 - e), a = e * e, l = c * (1 - e), h = 3 * c * e, u = 3 * a * (1 - e), f = a * e;
    return [
      n[0] * l + s[0] * h + i[0] * u + r[0] * f,
      n[1] * l + s[1] * h + i[1] * u + r[1] * f
    ];
  }
  split(e) {
    if (e.length <= 0)
      return [this];
    const n = [], s = (c, a) => {
      const [l, h, u, f] = c, d = wn(l, h, a), y = wn(h, u, a), x = wn(u, f, a), g = wn(d, y, a), w = wn(y, x, a), M = wn(g, w, a);
      return n.push(new $t(l, d, g, M, this.geo)), [M, w, x, f];
    };
    let i = [this.p0, this.p1, this.p2, this.p3], r = 0;
    for (const c of e)
      i = s(i, (c - r) / (1 - r)), r = c;
    return n.push(new $t(i[0], i[1], i[2], i[3], this.geo)), n;
  }
  reverse() {
    return new $t(this.p3, this.p2, this.p1, this.p0, this.geo);
  }
  getCubicCoefficients(e) {
    const n = this.p0[e], s = this.p1[e], i = this.p2[e];
    return [
      this.p3[e] - 3 * i + 3 * s - n,
      3 * i - 6 * s + 3 * n,
      3 * s - 3 * n,
      n
    ];
  }
  boundingTValues() {
    const e = new pr(this.geo), n = (a, l, h, u) => {
      const f = 3 * u - 9 * h + 9 * l - 3 * a, d = 6 * a - 12 * l + 6 * h, y = 3 * l - 3 * a;
      if (this.geo.snap0(f) === 0)
        e.add(-y / d);
      else {
        const x = d * d - 4 * f * y;
        if (x >= 0) {
          const g = Math.sqrt(x);
          e.add((-d + g) / (2 * f)), e.add((-d - g) / (2 * f));
        }
      }
      return e;
    }, s = this.p0, i = this.p1, r = this.p2, c = this.p3;
    return n(s[0], i[0], r[0], c[0]), n(s[1], i[1], r[1], c[1]), e.list();
  }
  inflectionTValues() {
    const e = new pr(this.geo);
    e.addArray(this.boundingTValues());
    const n = this.p0, s = this.p1, i = this.p2, r = this.p3, c = 3 * (s[0] - n[0]), a = 3 * (s[1] - n[1]), l = 6 * (i[0] - s[0]), h = 6 * (i[1] - s[1]), u = 3 * (r[0] - i[0]), f = 3 * (r[1] - i[1]), d = 6 * (i[0] - 2 * s[0] + n[0]), y = 6 * (i[1] - 2 * s[1] + n[1]), x = 6 * (r[0] - 2 * i[0] + s[0]), g = 6 * (r[1] - 2 * i[1] + s[1]), w = c - l + u, M = a - h + f, P = l - 2 * c, S = h - 2 * a, k = c, O = a, R = x - d, F = g - y, Y = d, N = y, $ = w * F - M * R, W = w * N + P * F - M * Y - S * R, Q = P * N + k * F - S * Y - O * R, ct = k * N - O * Y;
    for (const K of this.geo.solveCubic($, W, Q, ct))
      e.add(K);
    return e.list();
  }
  boundingBox() {
    const e = this.p0, n = this.p3, s = [Math.min(e[0], n[0]), Math.min(e[1], n[1])], i = [Math.max(e[0], n[0]), Math.max(e[1], n[1])];
    for (const r of this.boundingTValues()) {
      const c = this.point(r);
      s[0] = Math.min(s[0], c[0]), s[1] = Math.min(s[1], c[1]), i[0] = Math.max(i[0], c[0]), i[1] = Math.max(i[1], c[1]);
    }
    return [s, i];
  }
  mapXtoT(e, n = !1) {
    if (this.geo.snap0(this.p0[0] - e) === 0)
      return 0;
    if (this.geo.snap0(this.p3[0] - e) === 0)
      return 1;
    const s = this.p0[0] - e, i = this.p1[0] - e, r = this.p2[0] - e, a = [
      this.p3[0] - e - 3 * r + 3 * i - s,
      3 * r - 6 * i + 3 * s,
      3 * i - 3 * s,
      s
    ];
    for (const l of this.geo.solveCubic(a[0], a[1], a[2], a[3])) {
      const h = this.geo.snap01(l);
      if (h >= 0 && h <= 1)
        return l;
    }
    if (n || e >= Math.min(this.p0[0], this.p3[0]) && e <= Math.max(this.p0[0], this.p3[0]))
      for (let l = 0; l < 4; l++) {
        let h = -1;
        for (let u = 0; u < 4; u++)
          a[u] !== 0 && (h < 0 || Math.abs(a[u]) < Math.abs(a[h])) && (h = u);
        if (h < 0)
          return 0;
        a[h] = 0;
        for (const u of this.geo.solveCubic(a[0], a[1], a[2], a[3])) {
          const f = this.geo.snap01(u);
          if (f >= 0 && f <= 1)
            return u;
        }
      }
    return !1;
  }
  mapXtoY(e, n = !1) {
    const s = this.mapXtoT(e, n);
    return s === !1 ? !1 : this.point(s)[1];
  }
  pointOn(e) {
    if (this.geo.isEqualVec2(this.p0, e) || this.geo.isEqualVec2(this.p3, e))
      return !0;
    const n = this.mapXtoY(e[0]);
    return n === !1 ? !1 : this.geo.snap0(n - e[1]) === 0;
  }
  toLine() {
    const e = this.p0, n = this.p1, s = this.p2, i = this.p3;
    return (
      // vertical line
      this.geo.snap0(e[0] - n[0]) === 0 && this.geo.snap0(e[0] - s[0]) === 0 && this.geo.snap0(e[0] - i[0]) === 0 || // horizontal line
      this.geo.snap0(e[1] - n[1]) === 0 && this.geo.snap0(e[1] - s[1]) === 0 && this.geo.snap0(e[1] - i[1]) === 0 ? new jt(e, i, this.geo) : null
    );
  }
  draw(e) {
    const n = this.p0, s = this.p1, i = this.p2, r = this.p3;
    return e.moveTo(n[0], n[1]), e.bezierCurveTo(s[0], s[1], i[0], i[1], r[0], r[1]), e;
  }
}
function ms(o, e) {
  const n = e.p1[0] - e.p0[0], s = e.p1[1] - e.p0[1], i = o[0] - e.p0[0], r = o[1] - e.p0[1], c = n * n + s * s;
  return (i * n + r * s) / c;
}
function Zc(o, e, n) {
  const s = o.geo, i = o.p0, r = o.p1, c = e.p0, a = e.p1, l = r[0] - i[0], h = r[1] - i[1], u = a[0] - c[0], f = a[1] - c[1], d = l * f - h * u;
  if (s.snap0(d) === 0) {
    if (!s.isCollinear(i, r, c))
      return null;
    const g = ms(e.p0, o), w = ms(e.p1, o), M = s.snap01(Math.min(g, w)), P = s.snap01(Math.max(g, w));
    if (P < 0 || M > 1)
      return null;
    const S = ms(o.p0, e), k = ms(o.p1, e), O = s.snap01(Math.min(S, k)), R = s.snap01(Math.max(S, k));
    return R < 0 || O > 1 ? null : {
      kind: "tRangePairs",
      tStart: [Math.max(0, M), Math.max(0, O)],
      tEnd: [Math.min(1, P), Math.min(1, R)]
    };
  }
  const y = i[0] - c[0], x = i[1] - c[1];
  return new Ss(n, s).add((u * x - f * y) / d, (l * x - h * y) / d).done();
}
function mr(o, e, n, s) {
  const i = o.geo, r = o.p0, c = o.p1, a = c[1] - r[1], l = r[0] - c[0];
  if (i.snap0(l) === 0) {
    const P = e.mapXtoT(r[0], !1);
    if (P === !1)
      return null;
    const k = (e.point(P)[1] - r[1]) / a, O = new Ss(n, i);
    return s ? O.add(P, k) : O.add(k, P), O.done();
  }
  const h = a * r[0] + l * r[1], u = e.getCubicCoefficients(0), f = e.getCubicCoefficients(1), d = a * u[0] + l * f[0], y = a * u[1] + l * f[1], x = a * u[2] + l * f[2], g = a * u[3] + l * f[3] - h, w = i.solveCubic(d, y, x, g), M = new Ss(n, i);
  if (i.snap0(a) === 0)
    for (const P of w) {
      const S = u[0] * P * P * P + u[1] * P * P + u[2] * P + u[3], k = (r[0] - S) / l;
      s ? M.add(P, k) : M.add(k, P);
    }
  else
    for (const P of w) {
      const k = (f[0] * P * P * P + f[1] * P * P + f[2] * P + f[3] - r[1]) / a;
      s ? M.add(P, k) : M.add(k, P);
    }
  return M.done();
}
function Jc(o, e, n) {
  const s = o.geo;
  if (s.isEqualVec2(o.p0, e.p0))
    return s.isEqualVec2(o.p3, e.p3) ? s.isEqualVec2(o.p1, e.p1) && s.isEqualVec2(o.p2, e.p2) ? {
      kind: "tRangePairs",
      tStart: [0, 0],
      tEnd: [1, 1]
    } : {
      kind: "tValuePairs",
      tValuePairs: [
        [0, 0],
        [1, 1]
      ]
    } : {
      kind: "tValuePairs",
      tValuePairs: [[0, 0]]
    };
  if (s.isEqualVec2(o.p0, e.p3))
    return {
      kind: "tValuePairs",
      tValuePairs: [[0, 1]]
    };
  if (s.isEqualVec2(o.p3, e.p0))
    return {
      kind: "tValuePairs",
      tValuePairs: [[1, 0]]
    };
  if (s.isEqualVec2(o.p3, e.p3))
    return {
      kind: "tValuePairs",
      tValuePairs: [[1, 1]]
    };
  const i = new Ss(n, s), r = (c, a, l, h, u, f) => {
    const d = c.boundingBox(), y = h.boundingBox();
    if (!$c(d, y))
      return;
    const x = (a + l) / 2, g = (u + f) / 2;
    if (s.snap0(l - a) === 0 && s.snap0(f - u) === 0) {
      i.add(x, g);
      return;
    }
    const [w, M] = c.split([0.5]), [P, S] = h.split([0.5]);
    r(w, a, x, P, u, g), r(M, x, l, P, u, g), r(w, a, x, S, g, f), r(M, x, l, S, g, f);
  };
  return r(o, 0, 1, e, 0, 1), i.done();
}
function gr(o, e, n) {
  if (o instanceof jt) {
    if (e instanceof jt)
      return Zc(o, e, n);
    if (e instanceof $t)
      return mr(
        o,
        e,
        n,
        !1
      );
  } else if (o instanceof $t) {
    if (e instanceof jt)
      return mr(
        e,
        o,
        n,
        !0
      );
    if (e instanceof $t)
      return Jc(o, e, n);
  }
  throw new Error("PolyBool: Unknown segment instance in segmentsIntersect");
}
class Wr {
  id;
  data;
  myFill;
  otherFill = null;
  closed;
  constructor(e, n = null, s = !1, i = null) {
    this.id = i?.segmentId() ?? -1, this.data = e, this.myFill = {
      above: n?.above ?? null,
      below: n?.below ?? null
    }, this.closed = s;
  }
}
class An extends Wr {
}
class En extends Wr {
}
function wr(o, e) {
  if (o instanceof An)
    return new An(o.data, o.myFill, o.closed, e);
  if (o instanceof En)
    return new En(o.data, o.myFill, o.closed, e);
  throw new Error("PolyBool: Unknown SegmentBool in copySegmentBool");
}
class vr {
  isStart;
  p;
  seg;
  primary;
  other;
  status = null;
  constructor(e, n, s, i) {
    this.isStart = e, this.p = n, this.seg = s, this.primary = i;
  }
}
class Mr {
  nodes = [];
  remove(e) {
    const n = this.nodes.indexOf(e);
    n >= 0 && this.nodes.splice(n, 1);
  }
  getIndex(e) {
    return this.nodes.indexOf(e);
  }
  isEmpty() {
    return this.nodes.length <= 0;
  }
  getHead() {
    return this.nodes[0];
  }
  removeHead() {
    this.nodes.shift();
  }
  insertBefore(e, n) {
    this.findTransition(e, n).insert(e);
  }
  findTransition(e, n) {
    const s = (c, a) => n(a) - n(c);
    let i = 0, r = this.nodes.length;
    for (; i < r; ) {
      const c = i + r >> 1;
      s(this.nodes[c], e) > 0 ? r = c : i = c + 1;
    }
    return {
      before: i <= 0 ? null : this.nodes[i - 1] ?? null,
      after: this.nodes[i] ?? null,
      insert: (c) => (this.nodes.splice(i, 0, c), c)
    };
  }
}
class br {
  selfIntersection;
  geo;
  events = new Mr();
  status = new Mr();
  log;
  currentPath = [];
  constructor(e, n, s = null) {
    this.selfIntersection = e, this.geo = n, this.log = s;
  }
  compareEvents(e, n, s, i, r, c, a, l) {
    const h = this.geo.compareVec2(n, c);
    return h !== 0 ? h : i instanceof jt && l instanceof jt && this.geo.isEqualVec2(s, a) ? 0 : e !== r ? e ? 1 : -1 : this.compareSegments(l, i);
  }
  addEvent(e) {
    this.events.insertBefore(e, (n) => n === e ? 0 : this.compareEvents(
      e.isStart,
      e.p,
      e.other.p,
      e.seg.data,
      n.isStart,
      n.p,
      n.other.p,
      n.seg.data
    ));
  }
  divideEvent(e, n, s) {
    this.log?.segmentDivide(e.seg, s);
    const [i, r] = e.seg.data.split([n]);
    i.setEnd(s), r.setStart(s);
    const c = r instanceof jt ? new An(r, e.seg.myFill, e.seg.closed, this.log) : r instanceof $t ? new En(r, e.seg.myFill, e.seg.closed, this.log) : null;
    if (!c)
      throw new Error("PolyBool: Unknown segment data in divideEvent");
    return this.events.remove(e.other), e.seg.data = i, this.log?.segmentChop(e.seg), e.other.p = s, this.addEvent(e.other), this.addSegment(c, e.primary);
  }
  beginPath() {
    this.currentPath = [];
  }
  closePath() {
    for (const e of this.currentPath)
      e.closed = !0;
  }
  addSegment(e, n) {
    const s = new vr(!0, e.data.start(), e, n), i = new vr(!1, e.data.end(), e, n);
    return s.other = i, i.other = s, this.addEvent(s), this.addEvent(i), s;
  }
  addLine(e, n, s = !0) {
    const i = this.geo.compareVec2(e, n);
    if (i === 0)
      return;
    const r = new An(
      new jt(i < 0 ? e : n, i < 0 ? n : e, this.geo),
      null,
      !1,
      this.log
    );
    this.currentPath.push(r), this.addSegment(r, s);
  }
  addCurve(e, n, s, i, r = !0) {
    const c = new $t(e, n, s, i, this.geo), a = c.split(c.inflectionTValues());
    for (const l of a) {
      const h = this.geo.compareVec2(l.start(), l.end());
      if (h === 0)
        continue;
      const u = l.toLine();
      if (u)
        this.addLine(u.p0, u.p1, r);
      else {
        const f = new En(
          h < 0 ? l : l.reverse(),
          null,
          !1,
          this.log
        );
        this.currentPath.push(f), this.addSegment(f, r);
      }
    }
  }
  compareSegments(e, n) {
    let s = e.start(), i = n.start2();
    const r = n.start();
    if (n.pointOn(s)) {
      if (s = e.start2(), n.pointOn(s)) {
        if (e instanceof jt) {
          if (n instanceof jt)
            return 0;
          n instanceof $t && (s = e.point(0.5));
        }
        e instanceof $t && (s = e.end());
      }
      if (n instanceof $t && this.geo.snap0(s[0] - r[0]) === 0 && this.geo.snap0(i[0] - r[0]) === 0)
        return Math.sign(r[1] - s[1]);
    } else {
      if (n instanceof $t) {
        const d = n.mapXtoY(s[0], !0);
        if (d !== !1)
          return Math.sign(d - s[1]);
      }
      if (e instanceof $t) {
        const d = gr(e, n, !0);
        if (d && d.kind === "tValuePairs")
          for (const y of d.tValuePairs) {
            const x = this.geo.snap01(y[0]);
            if (x > 0 && x < 1) {
              i = e.point(x);
              break;
            }
          }
      }
    }
    const [c, a] = s, [l, h] = i, [u, f] = r;
    return Math.sign((l - c) * (f - a) - (h - a) * (u - c));
  }
  statusFindSurrounding(e) {
    return this.status.findTransition(e, (n) => {
      if (e === n)
        return 0;
      const s = this.compareSegments(e.seg.data, n.seg.data);
      return s === 0 ? -1 : s;
    });
  }
  checkIntersection(e, n) {
    const s = e.seg, i = n.seg;
    this.log?.checkIntersection(s, i);
    const r = gr(s.data, i.data, !1);
    if (r === null)
      return null;
    if (r.kind === "tRangePairs") {
      const {
        tStart: [c, a],
        tEnd: [l, h]
      } = r;
      if (c === 1 && l === 1 && a === 0 && h === 0 || c === 0 && l === 0 && a === 1 && h === 1)
        return null;
      if (c === 0 && l === 1 && a === 0 && h === 1)
        return n;
      const u = s.data.start(), f = s.data.end(), d = i.data.end();
      return c === 0 && a === 0 ? (l === 1 ? this.divideEvent(n, h, f) : this.divideEvent(e, l, d), n) : (a > 0 && a < 1 && (l === 1 && h === 1 ? this.divideEvent(n, a, u) : (l === 1 ? this.divideEvent(n, h, f) : this.divideEvent(e, l, d), this.divideEvent(n, a, u))), null);
    } else if (r.kind === "tValuePairs") {
      if (r.tValuePairs.length <= 0)
        return null;
      let c = r.tValuePairs[0];
      for (let u = 1; u < r.tValuePairs.length && (c[0] === 0 && c[1] === 0 || c[0] === 0 && c[1] === 1 || c[0] === 1 && c[1] === 0 || c[0] === 1 && c[1] === 1); u++)
        c = r.tValuePairs[u];
      const [a, l] = c, h = l === 0 ? i.data.start() : l === 1 ? i.data.end() : a === 0 ? s.data.start() : a === 1 ? s.data.end() : s.data.point(a);
      return a > 0 && a < 1 && this.divideEvent(e, a, h), l > 0 && l < 1 && this.divideEvent(n, l, h), null;
    }
    throw new Error("PolyBool: Unknown intersection type");
  }
  calculate() {
    const e = [];
    for (; !this.events.isEmpty(); ) {
      const n = this.events.getHead();
      if (this.log?.vert(n.p[0]), n.isStart) {
        this.log?.segmentNew(n.seg, n.primary);
        const s = this.statusFindSurrounding(n), i = s.before, r = s.after;
        this.log?.tempStatus(
          n.seg,
          i ? i.seg : !1,
          r ? r.seg : !1
        );
        const a = (() => {
          if (i) {
            const l = this.checkIntersection(n, i);
            if (l)
              return l;
          }
          return r ? this.checkIntersection(n, r) : null;
        })();
        if (a) {
          if (this.selfIntersection) {
            let l;
            n.seg.myFill.below === null ? l = n.seg.closed : l = n.seg.myFill.above !== n.seg.myFill.below, l && (a.seg.myFill.above = !a.seg.myFill.above);
          } else
            a.seg.otherFill = n.seg.myFill;
          this.log?.segmentUpdate(a.seg), this.events.remove(n.other), this.events.remove(n);
        }
        if (this.events.getHead() !== n) {
          this.log?.rewind(n.seg);
          continue;
        }
        if (this.selfIntersection) {
          let l;
          n.seg.myFill.below === null ? l = n.seg.closed : l = n.seg.myFill.above !== n.seg.myFill.below, r ? n.seg.myFill.below = r.seg.myFill.above : n.seg.myFill.below = !1, n.seg.myFill.above = l ? !n.seg.myFill.below : n.seg.myFill.below;
        } else if (n.seg.otherFill === null) {
          let l;
          if (!r)
            l = !1;
          else if (n.primary === r.primary) {
            if (r.seg.otherFill === null)
              throw new Error(
                "PolyBool: Unexpected state of otherFill (null)"
              );
            l = r.seg.otherFill.above;
          } else
            l = r.seg.myFill.above;
          n.seg.otherFill = {
            above: l,
            below: l
          };
        }
        this.log?.status(
          n.seg,
          i ? i.seg : !1,
          r ? r.seg : !1
        ), n.other.status = s.insert(n);
      } else {
        const s = n.status;
        if (s === null)
          throw new Error(
            "PolyBool: Zero-length segment detected; your epsilon is probably too small or too large"
          );
        const i = this.status.getIndex(s);
        if (i > 0 && i < this.status.nodes.length - 1) {
          const r = this.status.nodes[i - 1], c = this.status.nodes[i + 1];
          this.checkIntersection(r, c);
        }
        if (this.log?.statusRemove(s.seg), this.status.remove(s), !n.primary) {
          if (!n.seg.otherFill)
            throw new Error("PolyBool: Unexpected state of otherFill (null)");
          const r = n.seg.myFill;
          n.seg.myFill = n.seg.otherFill, n.seg.otherFill = r;
        }
        e.push(n.seg);
      }
      this.events.removeHead();
    }
    return this.log?.done(), e;
  }
}
function es(o, e, n) {
  const s = [];
  for (const i of o) {
    const r = (i.myFill.above ? 8 : 0) + (i.myFill.below ? 4 : 0) + (i.otherFill && i.otherFill.above ? 2 : 0) + (i.otherFill && i.otherFill.below ? 1 : 0), c = e[r], a = (c & 1) !== 0, l = (c & 2) !== 0;
    if (!i.closed && c !== 0 || i.closed && a !== l) {
      const h = { above: a, below: l };
      if (i instanceof An)
        s.push(new An(i.data, h, i.closed, n));
      else if (i instanceof En)
        s.push(new En(i.data, h, i.closed, n));
      else
        throw new Error(
          "PolyBool: Unknown SegmentBool type in SegmentSelector"
        );
    }
  }
  return n?.selected(s), s;
}
class Cn {
  // prettier-ignore
  static union(e, n) {
    return es(
      e,
      [
        4,
        2,
        1,
        0,
        2,
        2,
        0,
        0,
        1,
        0,
        1,
        0,
        0,
        0,
        0,
        0
      ],
      n
    );
  }
  // prettier-ignore
  static intersect(e, n) {
    return es(
      e,
      [
        0,
        0,
        0,
        4,
        0,
        2,
        0,
        2,
        0,
        0,
        1,
        1,
        4,
        2,
        1,
        0
      ],
      n
    );
  }
  // prettier-ignore
  static difference(e, n) {
    return es(
      e,
      [
        4,
        0,
        0,
        0,
        2,
        0,
        2,
        0,
        1,
        1,
        0,
        0,
        0,
        1,
        2,
        0
      ],
      n
    );
  }
  // prettier-ignore
  static differenceRev(e, n) {
    return es(
      e,
      [
        4,
        2,
        1,
        0,
        0,
        0,
        1,
        1,
        0,
        2,
        0,
        2,
        0,
        0,
        0,
        0
      ],
      n
    );
  }
  // prettier-ignore
  static xor(e, n) {
    return es(
      e,
      [
        4,
        2,
        1,
        0,
        2,
        0,
        0,
        1,
        1,
        0,
        0,
        2,
        0,
        1,
        2,
        0
      ],
      n
    );
  }
}
function Qc(o, e, n) {
  return n.isCollinear(o.p0, o.p1, e.p1) ? new jt(o.p0, e.p1, n) : !1;
}
function Kc(o, e, n) {
  if (n.isCollinear(o.p2, o.p3, e.p1)) {
    const s = e.p1[0] - o.p2[0], i = e.p1[1] - o.p2[1], r = Math.abs(s) > Math.abs(i) ? (o.p3[0] - o.p2[0]) / s : (o.p3[1] - o.p2[1]) / i, c = n.snap01(r);
    if (c !== 0 && c !== 1) {
      const a = new $t(
        o.p0,
        [
          o.p0[0] + (o.p1[0] - o.p0[0]) / r,
          o.p0[1] + (o.p1[1] - o.p0[1]) / r
        ],
        [
          e.p2[0] - r * (e.p3[0] - e.p2[0]) / (1 - r),
          e.p2[1] - r * (e.p3[1] - e.p2[1]) / (1 - r)
        ],
        e.p3,
        n
      ), [l, h] = a.split([r]);
      if (l.isEqual(o) && h.isEqual(e))
        return a;
    }
  }
  return !1;
}
function Nn(o, e, n) {
  return o === e ? !1 : o instanceof jt && e instanceof jt ? Qc(o, e, n) : o instanceof $t && e instanceof $t ? Kc(o, e, n) : !1;
}
function ta(o, e, n) {
  const s = [], i = [], r = [];
  for (const c of o) {
    let a = function(M, P, S) {
      return w && (w.index = M, w.matchesHead = P, w.matchesPt1 = S), w === x ? (w = g, !1) : (w = null, !0);
    }, l = c.data;
    const h = c.closed, u = h ? s : i, f = l.start(), d = l.end(), y = (M) => {
      n?.chainReverse(M, h);
      const P = [];
      for (const S of u[M].segs)
        P.unshift(S.reverse());
      return u[M] = {
        segs: P,
        fill: !u[M].fill
      }, P;
    };
    if (l instanceof jt && e.isEqualVec2(f, d)) {
      console.warn(
        "PolyBool: Warning: Zero-length segment detected; your epsilon is probably too small or too large"
      );
      continue;
    }
    n?.chainStart({ seg: l, fill: !!c.myFill.above }, h);
    const x = {
      index: 0,
      matchesHead: !1,
      matchesPt1: !1
    }, g = {
      index: 0,
      matchesHead: !1,
      matchesPt1: !1
    };
    let w = x;
    for (let M = 0; M < u.length; M++) {
      const P = u[M].segs, S = P[0].start(), k = P[P.length - 1].end();
      if (e.isEqualVec2(S, f)) {
        if (a(M, !0, !0))
          break;
      } else if (e.isEqualVec2(S, d)) {
        if (a(M, !0, !1))
          break;
      } else if (e.isEqualVec2(k, f)) {
        if (a(M, !1, !0))
          break;
      } else if (e.isEqualVec2(k, d) && a(M, !1, !1))
        break;
    }
    if (w === x) {
      const M = !!c.myFill.above;
      u.push({ segs: [l], fill: M }), n?.chainNew({ seg: l, fill: M }, h);
    } else if (w === g) {
      const M = x.index;
      n?.chainMatch(M, h);
      const { segs: P, fill: S } = u[M];
      if (x.matchesHead ? x.matchesPt1 ? (l = l.reverse(), n?.chainAddHead(M, { seg: l, fill: S }, h), P.unshift(l)) : (n?.chainAddHead(M, { seg: l, fill: S }, h), P.unshift(l)) : x.matchesPt1 ? (n?.chainAddTail(M, { seg: l, fill: S }, h), P.push(l)) : (l = l.reverse(), n?.chainAddTail(M, { seg: l, fill: S }, h), P.push(l)), x.matchesHead) {
        const k = P[1], O = Nn(l, k, e);
        O && (P.shift(), P[0] = O, n?.chainSimplifyHead(M, { seg: O, fill: S }, h));
      } else {
        const k = P[P.length - 2], O = Nn(k, l, e);
        O && (P.pop(), P[P.length - 1] = O, n?.chainSimplifyTail(M, { seg: O, fill: S }, h));
      }
      if (h) {
        let k = P, O = k[0], R = k[k.length - 1];
        if (k.length > 0 && e.isEqualVec2(O.start(), R.end())) {
          let F = 0, Y = k[0].start();
          for (const W of k) {
            const Q = W.end();
            F += Q[1] * Y[0] - Q[0] * Y[1], Y = Q;
          }
          F < 0 === S && (k = y(M), O = k[0], R = k[k.length - 1]);
          const $ = Nn(R, O, e);
          $ && (k.pop(), k[0] = $, n?.chainSimplifyClose(M, { seg: $, fill: S }, h)), n?.chainClose(M, h), u.splice(M, 1), r.push(k);
        }
      }
    } else {
      const M = (O, R) => {
        const { segs: F, fill: Y } = u[O], { segs: N } = u[R];
        n?.chainAddTail(O, { seg: l, fill: Y }, h), F.push(l);
        const $ = F[F.length - 2], W = Nn($, l, e);
        W && (F.pop(), F[F.length - 1] = W, n?.chainSimplifyTail(O, { seg: W, fill: Y }, h));
        const Q = F[F.length - 1], ct = N[0], K = Nn(Q, ct, e);
        K && (N.shift(), F[F.length - 1] = K, n?.chainSimplifyJoin(
          O,
          R,
          { seg: K, fill: Y },
          h
        )), n?.chainJoin(O, R, h), u[O].segs = F.concat(N), u.splice(R, 1);
      }, P = x.index, S = g.index;
      n?.chainConnect(P, S, h);
      const k = u[P].segs.length < u[S].segs.length;
      x.matchesHead ? g.matchesHead ? k ? (x.matchesPt1 || (l = l.reverse()), y(P), M(P, S)) : (x.matchesPt1 && (l = l.reverse()), y(S), M(S, P)) : (x.matchesPt1 && (l = l.reverse()), M(S, P)) : g.matchesHead ? (x.matchesPt1 || (l = l.reverse()), M(P, S)) : k ? (x.matchesPt1 && (l = l.reverse()), y(P), M(S, P)) : (x.matchesPt1 || (l = l.reverse()), y(S), M(P, S));
    }
  }
  for (const { segs: c } of i)
    r.push(c);
  return r;
}
function ea(o, e, n, s) {
  const [i, r, c, a, l, h] = s;
  n.beginPath();
  for (const u of o) {
    if (u.length <= 0)
      continue;
    for (let y = 0; y < u.length; y++) {
      const x = u[y];
      if (y === 0) {
        const [g, w] = x.start();
        n.moveTo(i * g + c * w + l, r * g + a * w + h);
      }
      if (x instanceof jt) {
        const [g, w] = x.p1;
        n.lineTo(i * g + c * w + l, r * g + a * w + h);
      } else if (x instanceof $t) {
        const [g, w] = x.p1, [M, P] = x.p2, [S, k] = x.p3;
        n.bezierCurveTo(
          i * g + c * w + l,
          r * g + a * w + h,
          i * M + c * P + l,
          r * M + a * P + h,
          i * S + c * k + l,
          r * S + a * k + h
        );
      } else
        throw new Error("PolyBool: Unknown segment instance");
    }
    const f = u[0], d = u[u.length - 1];
    e.isEqualVec2(f.start(), d.end()) && n.closePath();
  }
  return n;
}
class Mn {
  geo;
  log;
  pathState = { kind: "beginPath" };
  resultState;
  saveStack = [];
  matrix = [1, 0, 0, 1, 0, 0];
  constructor(e, n = null, s = null) {
    this.geo = e, this.log = s, n ? this.resultState = { state: "seg", segments: n } : this.resultState = {
      state: "new",
      selfIntersect: new br(!0, this.geo, this.log)
    };
  }
  setTransform(e, n, s, i, r, c) {
    if (this.resultState.state !== "new")
      throw new Error(
        "PolyBool: Cannot change shape after using it in an operation"
      );
    return this.matrix = [e, n, s, i, r, c], this;
  }
  resetTransform() {
    return this.matrix = [1, 0, 0, 1, 0, 0], this;
  }
  getTransform() {
    if (this.resultState.state !== "new")
      throw new Error(
        "PolyBool: Cannot change shape after using it in an operation"
      );
    const [e, n, s, i, r, c] = this.matrix;
    return { a: e, b: n, c: s, d: i, e: r, f: c };
  }
  transform(e, n, s, i, r, c) {
    const [a, l, h, u, f, d] = this.matrix;
    return this.matrix = [
      a * e + h * n,
      l * e + u * n,
      a * s + h * i,
      l * s + u * i,
      a * r + h * c + f,
      l * r + u * c + d
    ], this;
  }
  rotate(e) {
    const n = Math.cos(e), s = Math.sin(e), [i, r, c, a, l, h] = this.matrix;
    return this.matrix = [
      i * n + c * s,
      r * n + a * s,
      c * n - i * s,
      a * n - r * s,
      l,
      h
    ], this;
  }
  rotateDeg(e) {
    const n = (e % 360 + 360) % 360;
    if (n === 0)
      return this;
    let s = 0, i = 0;
    if (n === 90)
      i = 1;
    else if (n === 180)
      s = -1;
    else if (n === 270)
      i = -1;
    else if (n === 45)
      s = i = Math.SQRT1_2;
    else if (n === 135)
      i = Math.SQRT1_2, s = -Math.SQRT1_2;
    else if (n === 225)
      s = i = -Math.SQRT1_2;
    else if (n === 315)
      s = Math.SQRT1_2, i = -Math.SQRT1_2;
    else if (n === 30)
      s = Math.sqrt(3) / 2, i = 0.5;
    else if (n === 60)
      s = 0.5, i = Math.sqrt(3) / 2;
    else if (n === 120)
      s = -0.5, i = Math.sqrt(3) / 2;
    else if (n === 150)
      s = -Math.sqrt(3) / 2, i = 0.5;
    else if (n === 210)
      s = -Math.sqrt(3) / 2, i = -0.5;
    else if (n === 240)
      s = -0.5, i = -Math.sqrt(3) / 2;
    else if (n === 300)
      s = 0.5, i = -Math.sqrt(3) / 2;
    else if (n === 330)
      s = Math.sqrt(3) / 2, i = -0.5;
    else {
      const f = Math.PI * n / 180;
      s = Math.cos(f), i = Math.sin(f);
    }
    const [r, c, a, l, h, u] = this.matrix;
    return this.matrix = [
      r * s + a * i,
      c * s + l * i,
      a * s - r * i,
      l * s - c * i,
      h,
      u
    ], this;
  }
  scale(e, n) {
    const [s, i, r, c, a, l] = this.matrix;
    return this.matrix = [s * e, i * e, r * n, c * n, a, l], this;
  }
  translate(e, n) {
    const [s, i, r, c, a, l] = this.matrix;
    return this.matrix = [
      s,
      i,
      r,
      c,
      s * e + r * n + a,
      i * e + c * n + l
    ], this;
  }
  save() {
    if (this.resultState.state !== "new")
      throw new Error(
        "PolyBool: Cannot change shape after using it in an operation"
      );
    return this.saveStack.push({ matrix: this.matrix }), this;
  }
  restore() {
    if (this.resultState.state !== "new")
      throw new Error(
        "PolyBool: Cannot change shape after using it in an operation"
      );
    const e = this.saveStack.pop();
    return e && (this.matrix = e.matrix), this;
  }
  transformPoint(e, n) {
    const [s, i, r, c, a, l] = this.matrix;
    return [s * e + r * n + a, i * e + c * n + l];
  }
  beginPath() {
    if (this.resultState.state !== "new")
      throw new Error(
        "PolyBool: Cannot change shape after using it in an operation"
      );
    return this.resultState.selfIntersect.beginPath(), this.endPath();
  }
  moveTo(e, n) {
    if (this.resultState.state !== "new")
      throw new Error(
        "PolyBool: Cannot change shape after using it in an operation"
      );
    this.pathState.kind !== "beginPath" && this.beginPath();
    const s = this.transformPoint(e, n);
    return this.pathState = {
      kind: "moveTo",
      start: s,
      current: s
    }, this;
  }
  lineTo(e, n) {
    if (this.resultState.state !== "new")
      throw new Error(
        "PolyBool: Cannot change shape after using it in an operation"
      );
    if (this.pathState.kind !== "moveTo")
      throw new Error("PolyBool: Must call moveTo prior to calling lineTo");
    const s = this.transformPoint(e, n);
    return this.resultState.selfIntersect.addLine(this.pathState.current, s), this.pathState.current = s, this;
  }
  rect(e, n, s, i) {
    return this.moveTo(e, n).lineTo(e + s, n).lineTo(e + s, n + i).lineTo(e, n + i).closePath().moveTo(e, n);
  }
  bezierCurveTo(e, n, s, i, r, c) {
    if (this.resultState.state !== "new")
      throw new Error(
        "PolyBool: Cannot change shape after using it in an operation"
      );
    if (this.pathState.kind !== "moveTo")
      throw new Error(
        "PolyBool: Must call moveTo prior to calling bezierCurveTo"
      );
    const a = this.transformPoint(r, c);
    return this.resultState.selfIntersect.addCurve(
      this.pathState.current,
      this.transformPoint(e, n),
      this.transformPoint(s, i),
      a
    ), this.pathState.current = a, this;
  }
  closePath() {
    if (this.resultState.state !== "new")
      throw new Error(
        "PolyBool: Cannot change shape after using it in an operation"
      );
    return this.pathState.kind === "moveTo" && !this.geo.isEqualVec2(this.pathState.start, this.pathState.current) && (this.resultState.selfIntersect.addLine(
      this.pathState.current,
      this.pathState.start
    ), this.pathState.current = this.pathState.start), this.resultState.selfIntersect.closePath(), this.endPath();
  }
  endPath() {
    if (this.resultState.state !== "new")
      throw new Error(
        "PolyBool: Cannot change shape after using it in an operation"
      );
    return this.pathState = { kind: "beginPath" }, this;
  }
  selfIntersect() {
    return this.resultState.state === "new" && (this.resultState = {
      state: "seg",
      segments: this.resultState.selfIntersect.calculate()
    }), this.resultState.segments;
  }
  segments() {
    if (this.resultState.state !== "reg") {
      const e = this.selfIntersect();
      this.resultState = {
        state: "reg",
        segments: e,
        regions: ta(e, this.geo, this.log)
      };
    }
    return this.resultState.regions;
  }
  output(e, n = [1, 0, 0, 1, 0, 0]) {
    return ea(this.segments(), this.geo, e, n);
  }
  combine(e) {
    const n = new br(!1, this.geo, this.log);
    for (const s of this.selfIntersect())
      n.addSegment(wr(s, this.log), !0);
    for (const s of e.selfIntersect())
      n.addSegment(wr(s, this.log), !1);
    return new na(n.calculate(), this.geo, this.log);
  }
}
class na {
  geo;
  log;
  segments;
  constructor(e, n, s = null) {
    this.geo = n, this.segments = e, this.log = s;
  }
  union() {
    return new Mn(
      this.geo,
      Cn.union(this.segments, this.log),
      this.log
    );
  }
  intersect() {
    return new Mn(
      this.geo,
      Cn.intersect(this.segments, this.log),
      this.log
    );
  }
  difference() {
    return new Mn(
      this.geo,
      Cn.difference(this.segments, this.log),
      this.log
    );
  }
  differenceRev() {
    return new Mn(
      this.geo,
      Cn.differenceRev(this.segments, this.log),
      this.log
    );
  }
  xor() {
    return new Mn(
      this.geo,
      Cn.xor(this.segments, this.log),
      this.log
    );
  }
}
class uh {
  list = [];
  nextSegmentId = 0;
  curVert = NaN;
  push(e, n) {
    this.list.push({
      type: e,
      data: JSON.parse(JSON.stringify(n))
    });
  }
  info(e, n) {
    this.push("info", { msg: e, data: n });
  }
  segmentId() {
    return this.nextSegmentId++;
  }
  checkIntersection(e, n) {
    this.push("check", { seg1: e, seg2: n });
  }
  segmentDivide(e, n) {
    this.push("div_seg", { seg: e, p: n });
  }
  segmentChop(e) {
    this.push("chop", { seg: e });
  }
  statusRemove(e) {
    this.push("pop_seg", { seg: e });
  }
  segmentUpdate(e) {
    this.push("seg_update", { seg: e });
  }
  segmentNew(e, n) {
    this.push("new_seg", { seg: e, primary: n });
  }
  tempStatus(e, n, s) {
    this.push("temp_status", { seg: e, above: n, below: s });
  }
  rewind(e) {
    this.push("rewind", { seg: e });
  }
  status(e, n, s) {
    this.push("status", { seg: e, above: n, below: s });
  }
  vert(e) {
    e !== this.curVert && (this.push("vert", { x: e }), this.curVert = e);
  }
  selected(e) {
    this.push("selected", { segs: e });
  }
  chainStart(e, n) {
    this.push("chain_start", { sf: e, closed: n });
  }
  chainNew(e, n) {
    this.push("chain_new", { sf: e, closed: n });
  }
  chainMatch(e, n) {
    this.push("chain_match", { index: e, closed: n });
  }
  chainClose(e, n) {
    this.push("chain_close", { index: e, closed: n });
  }
  chainAddHead(e, n, s) {
    this.push("chain_add_head", { index: e, sf: n, closed: s });
  }
  chainAddTail(e, n, s) {
    this.push("chain_add_tail", { index: e, sf: n, closed: s });
  }
  chainSimplifyHead(e, n, s) {
    this.push("chain_simp_head", { index: e, sf: n, closed: s });
  }
  chainSimplifyTail(e, n, s) {
    this.push("chain_simp_tail", { index: e, sf: n, closed: s });
  }
  chainSimplifyClose(e, n, s) {
    this.push("chain_simp_close", { index: e, sf: n, closed: s });
  }
  chainSimplifyJoin(e, n, s, i) {
    this.push("chain_simp_join", { index1: e, index2: n, sf: s, closed: i });
  }
  chainConnect(e, n, s) {
    this.push("chain_con", { index1: e, index2: n, closed: s });
  }
  chainReverse(e, n) {
    this.push("chain_rev", { index: e, closed: n });
  }
  chainJoin(e, n, s) {
    this.push("chain_join", { index1: e, index2: n, closed: s });
  }
  done() {
    this.push("done", null);
  }
}
class sa {
  geo;
  log;
  constructor(e = new Gc(), n = null) {
    this.geo = e, this.log = n;
  }
  shape() {
    return new Mn(this.geo, null, this.log);
  }
  buildLog(e) {
    return this.log = e ? new uh() : null, this.log?.list;
  }
  segments(e) {
    const n = this.shape();
    n.beginPath();
    for (const s of e.regions) {
      const i = s[s.length - 1];
      n.moveTo(
        i[i.length - 2],
        i[i.length - 1]
      );
      for (const r of s)
        if (r.length === 2)
          n.lineTo(r[0], r[1]);
        else if (r.length === 6)
          n.bezierCurveTo(r[0], r[1], r[2], r[3], r[4], r[5]);
        else
          throw new Error("PolyBool: Invalid point in region");
      n.closePath();
    }
    return { shape: n, inverted: e.inverted };
  }
  combine(e, n) {
    return {
      shape: e.shape.combine(n.shape),
      inverted1: e.inverted,
      inverted2: n.inverted
    };
  }
  selectUnion(e) {
    return {
      shape: e.inverted1 ? e.inverted2 ? e.shape.intersect() : e.shape.difference() : e.inverted2 ? e.shape.differenceRev() : e.shape.union(),
      inverted: e.inverted1 || e.inverted2
    };
  }
  selectIntersect(e) {
    return {
      shape: e.inverted1 ? e.inverted2 ? e.shape.union() : e.shape.differenceRev() : e.inverted2 ? e.shape.difference() : e.shape.intersect(),
      inverted: e.inverted1 && e.inverted2
    };
  }
  selectDifference(e) {
    return {
      shape: e.inverted1 ? e.inverted2 ? e.shape.differenceRev() : e.shape.union() : e.inverted2 ? e.shape.intersect() : e.shape.difference(),
      inverted: e.inverted1 && !e.inverted2
    };
  }
  selectDifferenceRev(e) {
    return {
      shape: e.inverted1 ? e.inverted2 ? e.shape.difference() : e.shape.intersect() : e.inverted2 ? e.shape.union() : e.shape.differenceRev(),
      inverted: !e.inverted1 && e.inverted2
    };
  }
  selectXor(e) {
    return {
      shape: e.shape.xor(),
      inverted: e.inverted1 !== e.inverted2
    };
  }
  polygon(e) {
    const n = [], s = {
      beginPath: () => {
      },
      moveTo: () => {
        n.push([]);
      },
      lineTo: (i, r) => {
        n[n.length - 1].push([i, r]);
      },
      bezierCurveTo: (i, r, c, a, l, h) => {
        n[n.length - 1].push([i, r, c, a, l, h]);
      },
      closePath: () => {
      }
    };
    return e.shape.output(s), { regions: n, inverted: e.inverted };
  }
  // helper functions for common operations
  union(e, n) {
    const s = this.segments(e), i = this.segments(n), r = this.combine(s, i), c = this.selectUnion(r);
    return this.polygon(c);
  }
  intersect(e, n) {
    const s = this.segments(e), i = this.segments(n), r = this.combine(s, i), c = this.selectIntersect(r);
    return this.polygon(c);
  }
  difference(e, n) {
    const s = this.segments(e), i = this.segments(n), r = this.combine(s, i), c = this.selectDifference(r);
    return this.polygon(c);
  }
  differenceRev(e, n) {
    const s = this.segments(e), i = this.segments(n), r = this.combine(s, i), c = this.selectDifferenceRev(r);
    return this.polygon(c);
  }
  xor(e, n) {
    const s = this.segments(e), i = this.segments(n), r = this.combine(s, i), c = this.selectXor(r);
    return this.polygon(c);
  }
}
const fh = new sa(), q1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  EventBool: vr,
  Geometry: jc,
  GeometryEpsilon: Gc,
  Intersecter: br,
  ListBool: Mr,
  PolyBool: sa,
  SegmentBase: Xr,
  SegmentBoolBase: Wr,
  SegmentBoolCurve: En,
  SegmentBoolLine: An,
  SegmentChainer: ta,
  SegmentCurve: $t,
  SegmentLine: jt,
  SegmentSelector: Cn,
  SegmentTValuePairsBuilder: Ss,
  SegmentTValuesBuilder: pr,
  Shape: Mn,
  ShapeCombined: na,
  boundingBoxesIntersect: $c,
  copySegmentBool: wr,
  default: fh,
  joinCurves: Kc,
  joinLines: Qc,
  joinSegments: Nn,
  lerp: xr,
  lerpVec2: wn,
  projectPointOntoSegmentLine: ms,
  segmentCurveIntersectSegmentCurve: Jc,
  segmentLineIntersectSegmentCurve: mr,
  segmentLineIntersectSegmentLine: Zc,
  segmentsIntersect: gr,
  segmentsToReceiver: ea
}, Symbol.toStringTag, { value: "Module" })), Ye = Math.pow(2, 32), dh = Math.pow(2, 64), yh = Math.pow(2, 96), xh = Math.pow(2, 63), ph = -Math.pow(2, 63), mh = Math.pow(2, 127), gh = -Math.pow(2, 127);
class ot {
  high_;
  low_;
  constructor(e, n) {
    this.low_ = e >>> 0, this.high_ = n | 0;
  }
  get high() {
    return this.high_;
  }
  get low() {
    return this.low_;
  }
  clone() {
    return new ot(this.low_, this.high_);
  }
  isZero() {
    return this.high_ == 0 && this.low_ == 0;
  }
  isNegative() {
    return this.high_ < 0;
  }
  isPositive() {
    return this.high_ > 0 || this.high_ == 0 && this.low_ != 0;
  }
  isOdd() {
    return (this.low_ & 1) == 1;
  }
  equals(e) {
    return this.high_ == e.high_ && this.low_ == e.low_;
  }
  notEquals(e) {
    return this.high_ != e.high_ || this.low_ != e.low_;
  }
  not() {
    return ut.function64_64(this, "not64");
  }
  neg() {
    return ut.function64_64(this, "neg64");
  }
  negate() {
    return this.neg();
  }
  and(e) {
    return ut.function64_64_64(this, e, "and64");
  }
  or(e) {
    return ut.function64_64_64(this, e, "or64");
  }
  xor(e) {
    return ut.function64_64_64(this, e, "xor64");
  }
  add(e) {
    if (typeof e == "number") {
      if (Math.trunc(e) != e)
        return ot.fromRoundNumber(this.toNumber() + e);
      e = ot.fromRoundNumber(e);
    }
    return ut.function64_64_64(this, e, "add64");
  }
  sub(e) {
    if (typeof e == "number") {
      if (Math.trunc(e) != e)
        return ot.fromRoundNumber(this.toNumber() - e);
      e = ot.fromRoundNumber(e);
    }
    return ut.function64_64_64(this, e, "sub64");
  }
  subtract(e) {
    return this.sub(e);
  }
  mul(e) {
    if (typeof e == "number") {
      if (Math.trunc(e) != e)
        return ot.fromRoundNumber(this.toNumber() * e);
      e = ot.fromRoundNumber(e);
    }
    return ut.function64_64_64(this, e, "mul64");
  }
  multiply(e) {
    return this.mul(e);
  }
  div(e) {
    if (typeof e == "number") {
      if (Math.trunc(e) != e)
        return ot.fromRoundNumber(this.toNumber() / e);
      e = ot.fromRoundNumber(e);
    }
    return ut.function64_64_64(this, e, "divs64");
  }
  divide(e) {
    return this.div(e);
  }
  mod(e) {
    return ut.function64_64_64(this, e, "rems64");
  }
  modulo(e) {
    return this.mod(e);
  }
  shr(e) {
    return ut.function64_32_64(this, e, "shrs64");
  }
  shrUnsigned(e) {
    return ut.function64_32_64(this, e, "shru64");
  }
  shl(e) {
    return ut.function64_32_64(this, e, "shl64");
  }
  rotr(e) {
    return ut.function64_32_64(this, e, "rotr64");
  }
  rotl(e) {
    return ut.function64_32_64(this, e, "rotl64");
  }
  clz() {
    return ut.function64_64(this, "clz64");
  }
  ctz() {
    return ut.function64_64(this, "ctz64");
  }
  compare(e) {
    if (this.equals(e))
      return 0;
    let n = this.isNegative(), s = e.isNegative();
    return n && !s ? -1 : !n && s ? 1 : this.sub(e).isNegative() ? -1 : 1;
  }
  lessThan(e) {
    return ut.function64_64_32(this, e, "lts64") != 0;
  }
  lessThanOrEqual(e) {
    return ut.function64_64_32(this, e, "les64") != 0;
  }
  greaterThan(e) {
    return ut.function64_64_32(this, e, "gts64") != 0;
  }
  greaterThanOrEqual(e) {
    return ut.function64_64_32(this, e, "ges64") != 0;
  }
  abs() {
    return this.isNegative() ? this.neg() : this;
  }
  static fromNumber(e) {
    return isNaN(e) ? new ot(0, 0) : e < ph ? vo : e > xh ? wh : e < 0 ? this.fromNumber(-e).neg() : new ot(
      e % Ye | 0,
      e / Ye | 0
    );
  }
  static fromRoundNumber(e) {
    return ot.fromNumber(Math.round(e));
  }
  static fromInt(e) {
    let n = e | 0;
    if (n !== e)
      throw new Error("Value is not an int value");
    return new ot(n, n < 0 ? -1 : 0);
  }
  static fromString(e, n = 10) {
    if (e.length == 0)
      throw Error("number format error: empty string");
    if (n < 2 || 36 < n)
      throw Error("radix out of range: " + n);
    if (e.charAt(0) == "-")
      return ot.fromString(e.substring(1), n).neg();
    if (e.indexOf("-") >= 0)
      throw Error('number format error: interior "-" character: ' + e);
    let s = ot.fromNumber(Math.pow(n, 8)), i = new ot(0, 0);
    for (let r = 0; r < e.length; r += 8) {
      let c = Math.min(8, e.length - r), a = parseInt(e.substring(r, r + c), n);
      if (c < 8) {
        let l = ot.fromNumber(Math.pow(n, c));
        i = i.mul(l).add(ot.fromNumber(a));
      } else
        i = i.mul(s), i = i.add(ot.fromNumber(a));
    }
    return i;
  }
  toNumber() {
    return (this.low_ >>> 0) + this.high_ * Ye;
  }
  toInt() {
    return this.low_;
  }
  toString(e = 10) {
    if (e < 2 || 36 < e)
      throw Error("radix out of range: " + e);
    if (this.isZero())
      return "0";
    if (this.isNegative())
      if (this.equals(vo)) {
        let r = ot.fromNumber(e), c = this.div(r), a = c.mul(r).sub(this);
        return c.toString(e) + a.toInt().toString(e);
      } else
        return "-" + this.neg().toString(e);
    let n = ot.fromNumber(Math.pow(e, 6)), s = new ot(this.low_, this.high_), i = "";
    for (; ; ) {
      let r = s.div(n), a = (s.sub(r.mul(n)).toInt() >>> 0).toString(e);
      if (s = r, s.isZero())
        return a + i;
      for (; a.length < 6; )
        a = "0" + a;
      i = "" + a + i;
    }
  }
  static Swap(e, n) {
    let s = e.low_, i = e.high_;
    e.low_ = n.low_, e.high_ = n.high_, n.low_ = s, n.high_ = i;
  }
  static max(e, n) {
    return e.greaterThan(n) ? e : n;
  }
  static min(e, n) {
    return e.lessThan(n) ? e : n;
  }
  static init() {
    return ut.init();
  }
}
class Dt {
  d0_;
  d1_;
  d2_;
  d3_;
  constructor(e, n, s, i) {
    this.d0_ = e >>> 0, this.d1_ = n >>> 0, this.d2_ = s >>> 0, this.d3_ = i | 0;
  }
  get d0() {
    return this.d0_;
  }
  get d1() {
    return this.d1_;
  }
  get d2() {
    return this.d2_;
  }
  get d3() {
    return this.d3_;
  }
  clone() {
    return new Dt(this.d0_, this.d1_, this.d2_, this.d3_);
  }
  isZero() {
    return this.d3_ == 0 && this.d2_ == 0 && this.d1_ == 0 && this.d0_ == 0;
  }
  isNegative() {
    return this.d3_ < 0;
  }
  isPositive() {
    return this.d3_ > 0 || this.d3_ == 0 && (this.d2_ != 0 || this.d1_ != 0 || this.d0_ != 0);
  }
  isOdd() {
    return (this.d0_ & 1) == 1;
  }
  equals(e) {
    return this.d3_ == e.d3_ && this.d2_ == e.d2_ && this.d1_ == e.d1_ && this.d0_ == e.d0_;
  }
  notEquals(e) {
    return this.d3_ != e.d3_ || this.d2_ != e.d2_ || this.d1_ != e.d1_ || this.d0_ != e.d0_;
  }
  not() {
    return ut.function128_128(this, "not128");
  }
  neg() {
    return ut.function128_128(this, "neg128");
  }
  negate() {
    return this.neg();
  }
  and(e) {
    return ut.function128_128_128(this, e, "and128");
  }
  or(e) {
    return ut.function128_128_128(this, e, "or128");
  }
  xor(e) {
    return ut.function128_128_128(this, e, "xor128");
  }
  add(e) {
    return ut.function128_128_128(this, e, "add128");
  }
  sub(e) {
    return ut.function128_128_128(this, e, "sub128");
  }
  subtract(e) {
    return this.sub(e);
  }
  compare(e) {
    if (this.equals(e))
      return 0;
    let n = this.isNegative(), s = e.isNegative();
    return n && !s ? -1 : !n && s ? 1 : this.sub(e).isNegative() ? -1 : 1;
  }
  lessThan(e) {
    return this.compare(e) < 0;
  }
  lessThanOrEqual(e) {
    return this.compare(e) <= 0;
  }
  greaterThan(e) {
    return this.compare(e) > 0;
  }
  greaterThanOrEqual(e) {
    return this.compare(e) >= 0;
  }
  mul(e) {
    return this.isZero() || e.isZero() ? new Dt(0, 0, 0, 0) : this.isNegative() ? e.isNegative() ? this.neg().mul(e.neg()) : this.neg().mul(e).neg() : e.isNegative() ? this.mul(e.neg()).neg() : ut.function128_128_128(this, e, "mul128");
  }
  multiply(e) {
    return this.mul(e);
  }
  shiftLeft(e) {
    return e &= 127, e == 0 ? this.clone() : (this.clone(), e >= 96 ? (e -= 96, new Dt(0, 0, 0, this.d0_ << e)) : e >= 64 ? (e -= 64, new Dt(
      0,
      0,
      this.d0_ << e,
      this.d1_ << e | this.d0_ >>> 32 - e
    )) : e >= 32 ? (e -= 32, new Dt(
      0,
      this.d0_ << e,
      this.d1_ << e | this.d0_ >>> 32 - e,
      this.d2_ << e | this.d1_ >>> 32 - e
    )) : new Dt(
      this.d0_ << e,
      this.d1_ << e | this.d0_ >>> 32 - e,
      this.d2_ << e | this.d1_ >>> 32 - e,
      this.d3_ << e | this.d2_ >>> 32 - e
    ));
  }
  shiftRight(e) {
    return e &= 127, e == 0 ? this.clone() : (this.clone(), e >= 96 ? (e -= 96, new Dt(this.d3_ >> e, 0, 0, 0)) : e >= 64 ? (e -= 64, new Dt(
      this.d3_ >> e | this.d2_ << 32 - e,
      this.d3_ >> e,
      0,
      0
    )) : e >= 32 ? (e -= 32, new Dt(
      this.d2_ >>> e | this.d1_ << 32 - e,
      this.d3_ >> e | this.d2_ << 32 - e,
      this.d3_ >> e,
      0
    )) : new Dt(
      this.d1_ >>> e | this.d0_ << 32 - e,
      this.d2_ >>> e | this.d1_ << 32 - e,
      this.d3_ >> e | this.d2_ << 32 - e,
      this.d3_ >> e
    ));
  }
  shiftRightUnsigned(e) {
    return e &= 127, e == 0 ? this.clone() : (this.clone(), e >= 96 ? (e -= 96, new Dt(this.d3_ >>> e, 0, 0, 0)) : e >= 64 ? (e -= 64, new Dt(
      this.d3_ >>> e | this.d2_ << 32 - e,
      this.d3_ >>> e,
      0,
      0
    )) : e >= 32 ? (e -= 32, new Dt(
      this.d2_ >>> e | this.d1_ << 32 - e,
      this.d3_ >>> e | this.d2_ << 32 - e,
      this.d3_ >>> e,
      0
    )) : new Dt(
      this.d1_ >>> e | this.d0_ << 32 - e,
      this.d2_ >>> e | this.d1_ << 32 - e,
      this.d3_ >>> e | this.d2_ << 32 - e,
      this.d3_ >>> e
    ));
  }
  toNumber() {
    return (this.d0_ >>> 0) + (this.d1_ >>> 0) * Ye + (this.d2_ >>> 0) * dh + (this.d3_ >>> 0) * yh;
  }
  abs() {
    return this.isNegative() ? this.neg() : this;
  }
  static fromInt64(e) {
    let n = e.high < 0 ? -1 : 0;
    return new Dt(e.low, e.high, n, n);
  }
  static fromNumber(e) {
    if (isNaN(e))
      return new Dt(0, 0, 0, 0);
    if (e < gh)
      return vh;
    if (e > mh)
      return Mh;
    if (e < 0)
      return this.fromNumber(-e).neg();
    {
      let n = e & Ye;
      e /= Ye;
      let s = e & Ye;
      e /= Ye;
      let i = e & Ye;
      e /= Ye;
      let r = e;
      return new Dt(n, s, i, r);
    }
  }
  static fromRoundNumber(e) {
    return Dt.fromNumber(Math.round(e));
  }
  static fromInt(e) {
    let n = e | 0;
    if (n !== e)
      throw new Error("Value is not an int value");
    let s = e < 0 ? -1 : 0;
    return new Dt(n, s, s, s);
  }
  static mul64(e, n) {
    return Dt.fromInt64(e).mul(Dt.fromInt64(n));
  }
  static Swap(e, n) {
    let s = e.clone();
    e.d0_ = n.d0_, e.d1_ = n.d1_, e.d2_ = n.d2_, e.d3_ = n.d3_, n.d0_ = s.d0_, n.d1_ = s.d1_, n.d2_ = s.d2_, n.d3_ = s.d3_;
  }
  static max(e, n) {
    return e.greaterThan(n) ? e : n;
  }
  static min(e, n) {
    return e.lessThan(n) ? e : n;
  }
}
const vo = new ot(0, 2147483648), wh = new ot(4294967295, 2147483647), vh = new Dt(0, 0, 0, 2147483648), Mh = new Dt(4294967295, 4294967295, 4294967295, 2147483647);
class ut {
  static instance;
  static mem32;
  static setArg128(e, n) {
    ut.mem32[n] = e.d0, ut.mem32[n + 1] = e.d1, ut.mem32[n + 2] = e.d2, ut.mem32[n + 3] = e.d3;
  }
  static setArg64(e, n) {
    ut.mem32[n] = e.low, ut.mem32[n + 1] = e.high;
  }
  static setArg32(e, n) {
    ut.mem32[n] = e | 0;
  }
  static function64_32_64(e, n, s) {
    return ut.setArg64(e, 0), ut.setArg32(n, 2), ut.instance.exports[s](), this.result64();
  }
  static function64_64_64(e, n, s) {
    return ut.setArg64(e, 0), ut.setArg64(n, 2), ut.instance.exports[s](), this.result64();
  }
  static function64_64(e, n) {
    return ut.setArg64(e, 0), ut.instance.exports[n](), this.result64();
  }
  static function64_64_32(e, n, s) {
    return ut.setArg64(e, 0), ut.setArg64(n, 2), ut.instance.exports[s](), this.result32();
  }
  static function128_128_128(e, n, s) {
    return ut.setArg128(e, 0), ut.setArg128(n, 4), ut.instance.exports[s](), this.result128();
  }
  static function128_128(e, n) {
    return ut.setArg128(e, 0), ut.instance.exports[n](), this.result128();
  }
  static result128() {
    return new Dt(
      ut.mem32[8],
      ut.mem32[9],
      ut.mem32[10],
      ut.mem32[11]
    );
  }
  static result64() {
    return new ot(ut.mem32[8], ut.mem32[9]);
  }
  static result32() {
    return ut.mem32[8];
  }
  static init() {
    return ut.instance != null ? Promise.resolve() : ut.fetchAndInstantiate("intmath.wasm").then((e) => {
      ut.instance = e, ut.mem32 = new Uint32Array(e.exports.mem.buffer);
    });
  }
  static fetchAndInstantiate(e) {
    if (typeof fetch == "function")
      return fetch(e).then((s) => s.arrayBuffer()).then((s) => WebAssembly.instantiate(s, void 0)).then((s) => s.instance);
    let n = require("fs");
    return new Promise((s, i) => {
      try {
        n.readFile(e, (r, c) => {
          r ? i(r) : s(c);
        });
      } catch (r) {
        i(r);
      }
    }).then((s) => WebAssembly.instantiate(s.buffer, void 0)).then((s) => s.instance);
  }
}
const te = -34e37, _e = -2, ue = -1, bh = 1e-20, ni = new ot(1073741823, 0), si = new ot(4294967295, 1073741823), _h = 1, Th = 2, Ph = 4, Xi = Math.PI * 2, ii = 0.25;
var ia = /* @__PURE__ */ ((o) => (o[o.ctIntersection = 0] = "ctIntersection", o[o.ctUnion = 1] = "ctUnion", o[o.ctDifference = 2] = "ctDifference", o[o.ctXor = 3] = "ctXor", o))(ia || {}), ra = /* @__PURE__ */ ((o) => (o[o.ptSubject = 0] = "ptSubject", o[o.ptClip = 1] = "ptClip", o))(ra || {}), oa = /* @__PURE__ */ ((o) => (o[o.jtSquare = 0] = "jtSquare", o[o.jtRound = 1] = "jtRound", o[o.jtMiter = 2] = "jtMiter", o))(oa || {}), ca = /* @__PURE__ */ ((o) => (o[o.pftEvenOdd = 0] = "pftEvenOdd", o[o.pftNonZero = 1] = "pftNonZero", o[o.pftPositive = 2] = "pftPositive", o[o.pftNegative = 3] = "pftNegative", o))(ca || {}), aa = /* @__PURE__ */ ((o) => (o[o.etClosedPolygon = 0] = "etClosedPolygon", o[o.etClosedLine = 1] = "etClosedLine", o[o.etOpenButt = 2] = "etOpenButt", o[o.etOpenSquare = 3] = "etOpenSquare", o[o.etOpenRound = 4] = "etOpenRound", o))(aa || {});
class ft {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  equals(e) {
    return this.x.equals(e.x) && this.y.equals(e.y);
  }
  notEquals(e) {
    return this.x.notEquals(e.x) || this.y.notEquals(e.y);
  }
  static copy(e) {
    return new ft(e.x, e.y);
  }
  static fromXY(e, n) {
    return new ft(ot.fromRoundNumber(e), ot.fromRoundNumber(n));
  }
}
class Fe {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  equals(e) {
    return this.x == e.x && this.y == e.y;
  }
  notEquals(e) {
    return this.x != e.x || this.y != e.y;
  }
  static copy(e) {
    return new Fe(e.x, e.y);
  }
  static fromIntPoint(e) {
    return new Fe(e.x.toNumber(), e.y.toNumber());
  }
}
class Is {
  constructor(e, n, s, i) {
    this.left = e, this.top = n, this.right = s, this.bottom = i;
  }
  static copy(e) {
    return new Is(e.left, e.top, e.right, e.bottom);
  }
}
class qs {
  parent = null;
  polygon = new Array();
  index;
  joinType;
  endType;
  children = new Array();
  isOpen;
  get isHole() {
    let e = !0, n = this.parent;
    for (; n != null; )
      e = !e, n = n.parent;
    return e;
  }
  get childCount() {
    return this.children.length;
  }
  get contour() {
    return this.polygon;
  }
  addChild(e) {
    e.parent = this, e.index = this.children.length, this.children.push(e);
  }
  get next() {
    return this.children.length > 0 ? this.children[0] : this.nextSiblingUp;
  }
  get nextSiblingUp() {
    return this.parent == null ? null : this.index == this.parent.children.length - 1 ? this.parent.nextSiblingUp : this.parent.children[this.index + 1];
  }
}
class la extends qs {
  allPolys = new Array();
  clear() {
    this.allPolys.length = 0, this.children.length = 0;
  }
  get first() {
    return this.children.length > 0 ? this.children[0] : null;
  }
  get total() {
    let e = this.allPolys.length;
    return e > 0 && this.children[0] != this.allPolys[0] && e--, e;
  }
}
class Ah {
  bot;
  curr;
  //current (updated for every new scanbeam)
  top;
  delta;
  dx;
  polyTyp;
  side;
  //side only refers to current side of solution poly
  windDelta;
  //1 or -1 depending on winding direction
  windCnt;
  windCnt2;
  //winding count of the opposite polytype
  outIdx;
  next = null;
  prev = null;
  nextInLML = null;
  nextInAEL = null;
  prevInAEL = null;
  nextInSEL = null;
  prevInSEL = null;
}
class Eh {
  constructor(e, n, s) {
    this.edge1 = e, this.edge2 = n, this.pt = s;
  }
}
class ri {
  constructor(e, n, s) {
    this.y = e, this.leftBound = n, this.rightBound = s, this.next = null;
  }
  next;
  clearLeftBound() {
    this.leftBound = null;
  }
  clearRightBound() {
    this.rightBound = null;
  }
}
class Wi {
  constructor(e) {
    this.y = e, this.next = null;
  }
  next;
}
class Lh {
  constructor(e) {
    this.x = e, this.next = null, this.prev = null;
  }
  next = null;
  prev = null;
}
class jn {
  idx;
  pt;
  next = null;
  prev = null;
}
class ha {
  idx;
  isHole;
  isOpen;
  firstLeft;
  //see comments in clipper.pas
  pts;
  bottomPt;
  polyNode;
  constructor() {
    this.idx = ue, this.isHole = !1, this.isOpen = !1, this.firstLeft = null, this.pts = null, this.bottomPt = null, this.polyNode = null;
  }
}
class Mo {
  constructor(e, n, s) {
    this.outPt1 = e, this.outPt2 = n, this.offPt = s;
  }
}
function Sh(o, e) {
  return e.pt.y.compare(o.pt.y);
}
function Ih(o) {
  return Math.abs(o) < bh;
}
function Re(o) {
  return o.delta.y.isZero();
}
function bo(o, e, n) {
  return n ? Dt.mul64(o.delta.y, e.delta.y).equals(
    Dt.mul64(o.delta.x, e.delta.y)
  ) : o.delta.y.mul(e.delta.x).equals(
    o.delta.x.mul(e.delta.y)
  );
}
function Hn(o, e, n, s) {
  return s ? Dt.mul64(o.y.sub(e.y), e.x.sub(n.x)).equals(
    Dt.mul64(o.x.sub(e.x), e.y.sub(n.y))
  ) : o.y.sub(e.y).mul(e.x.sub(n.x)).equals(
    o.x.sub(e.x).mul(e.y.sub(n.y))
  );
}
function ns(o, e, n, s, i) {
  return i ? Dt.mul64(o.y.sub(e.y), n.x.sub(s.x)).equals(
    Dt.mul64(o.x.sub(e.x), n.y.sub(s.y))
  ) : o.y.sub(e.y).mul(n.x.sub(s.x)).equals(
    o.x.sub(e.x).mul(n.y.sub(s.y))
  );
}
function pi(o, e) {
  if (e) {
    if (o.x.greaterThan(si) || o.y.greaterThan(si) || o.x.neg().greaterThan(si) || o.y.neg().greaterThan(si))
      throw new Error("Coordinate outside allowed range");
    return !0;
  } else if (o.x.greaterThan(ni) || o.y.greaterThan(ni) || o.x.neg().greaterThan(ni) || o.y.neg().greaterThan(ni))
    return pi(o, !0);
  return !1;
}
function qh(o) {
  let e = o.top.x.sub(o.bot.x), n = o.top.y.sub(o.bot.y);
  o.delta = new ft(e, n), n.isZero() ? o.dx = te : o.dx = o.delta.x.toNumber() / o.delta.y.toNumber();
}
function $i(o, e, n, s) {
  o.next = e, o.prev = n, o.curr = new ft(s.x, s.y), o.outIdx = ue;
}
function Dh(o, e) {
  o.curr.y.greaterThanOrEqual(o.next.curr.y) ? (o.bot = new ft(o.curr.x, o.curr.y), o.top = new ft(o.next.curr.x, o.next.curr.y)) : (o.top = new ft(o.curr.x, o.curr.y), o.bot = new ft(o.next.curr.x, o.next.curr.y)), qh(o), o.polyTyp = e;
}
function Oh(o) {
  let e;
  for (; ; ) {
    for (; o.bot.notEquals(o.prev.bot) || o.curr.equals(o.top); )
      o = o.next;
    if (o.dx != te && o.prev.dx != te)
      break;
    for (; o.prev.dx == te; )
      o = o.prev;
    for (e = o; o.dx == te; )
      o = o.next;
    if (!o.top.y.equals(o.prev.bot.y)) {
      e.prev.bot.x.lessThan(o.bot.x) && (o = e);
      break;
    }
  }
  return o;
}
function ua(o, e, n) {
  return o.equals(n) || o.equals(e) || n.equals(e) ? !1 : o.x.notEquals(n.x) ? e.x.greaterThan(o.x) == e.x.lessThan(n.x) : e.y.greaterThan(o.y) == e.y.lessThan(n.y);
}
function _o(o) {
  o.prev.next = o.next, o.next.prev = o.prev;
  let e = o.next;
  return o.prev = null, e;
}
function pn(o) {
  let e = new ft(o.bot.x, o.top.y), n = new ft(o.top.x, o.bot.y);
  o.top = e, o.bot = n;
}
function Ie(o, e) {
  return e.equals(o.top.y) ? o.top.x : o.bot.x.add(
    ot.fromRoundNumber(o.dx * e.sub(o.bot.y).toNumber())
  );
}
function To(o, e) {
  return e.curr.x.equals(o.curr.x) ? e.top.y.greaterThan(o.top.y) ? e.top.x.lessThan(Ie(o, e.top.y)) : o.top.x.greaterThan(Ie(e, o.top.y)) : e.curr.x.lessThan(o.curr.x);
}
function ji(o, e, n, s) {
  let i = o.clone(), r = e.clone(), c = n.clone(), a = s.clone();
  return i.greaterThan(r) && ot.Swap(i, r), c.greaterThan(a) && ot.Swap(c, a), i.lessThan(a) && c.lessThan(r);
}
function oi(o, e) {
  return o.y.equals(e.y) ? te : e.x.sub(o.x).div(e.y.sub(o.y)).toNumber();
}
function fa(o, e) {
  let n = o.prev;
  for (; n.pt.equals(o.pt) && n != o; )
    n = n.prev;
  let s = Math.abs(oi(o.pt, n.pt));
  for (n = o.next; n.pt.equals(o.pt) && n != o; )
    n = n.next;
  let i = Math.abs(oi(o.pt, n.pt));
  for (n = e.prev; n.pt.equals(e.pt) && n != e; )
    n = n.prev;
  let r = Math.abs(oi(e.pt, n.pt));
  for (n = e.next; n.pt.equals(e.pt) && n != e; )
    n = n.next;
  let c = Math.abs(oi(e.pt, n.pt));
  return Math.max(s, i) == Math.max(r, c) && Math.min(s, i) == Math.min(r, c) ? this.Area(o) > 0 : s >= r && s >= c || i >= r && i >= c;
}
function Po(o) {
  let e = null, n = o.next;
  for (; n != o; )
    n.pt.y.greaterThan(o.pt.y) ? (o = n, e = null) : n.pt.y.equals(o.pt.y) && n.pt.x.lessThanOrEqual(o.pt.x) && (n.pt.x.lessThan(o.pt.x) ? (e = null, o = n) : n.next != o && n.prev != o && (e = n)), n = n.next;
  if (e != null)
    for (; e != n; )
      for (fa(n, e) || (o = e), e = e.next; e.pt.notEquals(o.pt); )
        e = e.next;
  return o;
}
function Ao(o, e) {
  o.bottomPt == null && (o.bottomPt = Po(o.pts)), e.bottomPt == null && (e.bottomPt = Po(e.pts));
  let n = o.bottomPt, s = e.bottomPt;
  return n.pt.y.greaterThan(s.pt.y) ? o : n.pt.y.lessThan(s.pt.y) ? e : n.pt.x.lessThan(s.pt.x) ? o : n.pt.x.greaterThan(s.pt.x) || n.next == n ? e : s.next == s || fa(n, s) ? o : e;
}
function ci(o, e) {
  do
    if (o = o.firstLeft, o == e)
      return !0;
  while (o != null);
  return !1;
}
function ss(o) {
  if (o == null)
    return;
  let e, n;
  e = o;
  do
    n = e.next, e.next = e.prev, e.prev = n, e = n;
  while (e != o);
}
function ai(o, e) {
  let n = o.side;
  o.side = e.side, e.side = n;
}
function Gi(o, e) {
  let n = o.outIdx;
  o.outIdx = e.outIdx, e.outIdx = n;
}
function Eo(o) {
  return o.bot.x.lessThan(o.top.x) ? {
    Left: o.bot.x,
    Right: o.top.x,
    Dir: 1
    /* dLeftToRight */
  } : {
    Left: o.top.x,
    Right: o.bot.x,
    Dir: 0
    /* dRightToLeft */
  };
}
function Lo(o, e) {
  return e == 1 ? o.nextInAEL : o.prevInAEL;
}
function kh(o, e) {
  return o != null && o.top.y.equals(e) && o.nextInLML == null;
}
function So(o, e) {
  return o.top.y.equals(e) && o.nextInLML != null;
}
function da(o) {
  return o.next.top.equals(o.top) && o.next.nextInLML == null ? o.next : o.prev.top.equals(o.top) && o.prev.nextInLML == null ? o.prev : null;
}
function Io(o) {
  let e = da(o);
  return e == null || e.outIdx == _e || e.nextInAEL == e.prevInAEL && !Re(e) ? null : e;
}
function Rh(o, e) {
  let n, s, i, r;
  if (o.dx == e.dx)
    return r = o.curr.y, i = Ie(o, r), new ft(i, r);
  if (o.delta.x.isZero())
    i = o.bot.x, Re(e) ? r = e.bot.y : (s = e.bot.y.toNumber() - e.bot.x.toNumber() / e.dx, r = ot.fromRoundNumber(i.toNumber() / e.dx + s));
  else if (e.delta.x.isZero())
    i = e.bot.x, Re(o) ? r = o.bot.y : (n = o.bot.y.toNumber() - o.bot.x.toNumber() / o.dx, r = ot.fromRoundNumber(i.toNumber() / o.dx + n));
  else {
    n = o.bot.x.toNumber() - o.bot.y.toNumber() * o.dx, s = e.bot.x.toNumber() - e.bot.y.toNumber() * e.dx;
    let c = (s - n) / (o.dx - e.dx);
    r = ot.fromRoundNumber(c), Math.abs(o.dx) < Math.abs(e.dx) ? i = ot.fromRoundNumber(o.dx * c + n) : i = ot.fromRoundNumber(e.dx * c + s);
  }
  return (r.lessThan(o.top.y) || r.lessThan(e.top.y)) && (o.top.y.greaterThan(e.top.y) ? r = o.top.y : r = e.top.y, Math.abs(o.dx) < Math.abs(e.dx) ? i = Ie(o, r) : i = Ie(e, r)), r.greaterThan(o.curr.y) && (r = o.curr.y, Math.abs(o.dx) > Math.abs(e.dx) ? i = Ie(e, r) : i = Ie(o, r)), new ft(i, r);
}
function qo(o) {
  return o.edge1.nextInSEL == o.edge2 || o.edge1.prevInSEL == o.edge2;
}
function Fh(o) {
  let e = o.length;
  if (e < 3)
    return 0;
  let n = ot.fromInt(0);
  for (let s = 0, i = e - 1; s < e; ++s)
    n = n.add(o[i].x.add(o[s].x).mul(o[i].y.sub(o[s].y))), i = s;
  return -n.toNumber() * 0.5;
}
function zh(o) {
  return ya(o.pts);
}
function ya(o) {
  let e = o;
  if (o == null)
    return 0;
  let n = ot.fromInt(0);
  do
    n = n.add(o.prev.pt.x.add(o.pt.x).mul(o.prev.pt.y.sub(o.pt.y))), o = o.next;
  while (o != e);
  return n.toNumber() * 0.5;
}
function mi(o) {
  return o instanceof jn ? ya(o) : o instanceof ha ? zh(o) : Fh(o);
}
function vs(o) {
  return mi(o) >= 0;
}
function Do(o) {
  if (o == null)
    return 0;
  let e = 0, n = o;
  do
    e++, n = n.next;
  while (n != o);
  return e;
}
function he(o, e) {
  let n = new jn();
  return n.pt = new ft(o.pt.x, o.pt.y), n.idx = o.idx, e ? (n.next = o.next, n.prev = o, o.next.prev = n, o.next = n) : (n.prev = o.prev, n.next = o, o.prev.next = n, o.prev = n), n;
}
function Ch(o, e, n, s) {
  let i, r;
  return o.lessThan(e) ? n.lessThan(s) ? (i = ot.max(o, n), r = ot.min(e, s)) : (i = ot.max(o, s), r = ot.min(e, n)) : n.lessThan(s) ? (i = ot.max(e, n), r = ot.min(o, s)) : (i = ot.max(e, s), r = ot.min(o, n)), {
    r: i.lessThan(r),
    Left: i,
    Right: r
  };
}
function Nh(o, e) {
  let n = 0, s = e.length;
  if (s < 3)
    return 0;
  let i = e[0];
  for (let r = 1; r <= s; ++r) {
    let c = r == s ? e[0] : e[r];
    if (c.y.equals(o.y) && (c.x.equals(o.x) || i.y.equals(o.y) && c.x.greaterThan(o.x) == i.x.lessThan(o.x)))
      return -1;
    if (i.y.lessThan(o.y) != c.y.lessThan(o.y)) {
      if (i.x.greaterThanOrEqual(o.x))
        if (c.x.greaterThan(o.x))
          n = 1 - n;
        else {
          let a = i.x.sub(o.x).mul(c.y.sub(o.y)).toNumber() - c.x.sub(o.x).mul(i.y.sub(o.y)).toNumber();
          if (a == 0)
            return -1;
          a > 0 == c.y.greaterThan(i.y) && (n = 1 - n);
        }
      else if (c.x.greaterThan(o.x)) {
        let a = i.x.sub(o.x).mul(c.y.sub(o.y)).toNumber() - c.x.sub(o.x).mul(i.y.sub(o.y)).toNumber();
        if (a == 0)
          return -1;
        a > 0 == c.y.greaterThan(i.y) && (n = 1 - n);
      }
    }
    i = c;
  }
  return n;
}
function Hh(o, e) {
  let n = 0, s = e, i = o.x, r = o.y, c = e.pt.x, a = e.pt.y;
  do {
    e = e.next;
    let l = e.pt.x, h = e.pt.y;
    if (h.equals(r) && (l.equals(i) || a.equals(r) && l.greaterThan(i) == c.lessThan(i)))
      return -1;
    if (a.lessThan(r) != h.lessThan(r)) {
      if (c.greaterThanOrEqual(i))
        if (l.greaterThan(i))
          n = 1 - n;
        else {
          let u = c.sub(i).mul(h.sub(r)).toNumber() - l.sub(i).mul(a.sub(r)).toNumber();
          if (u == 0)
            return -1;
          u > 0 == h.greaterThan(a) && (n = 1 - n);
        }
      else if (l.greaterThan(i)) {
        let u = c.sub(i).mul(h.sub(r)).toNumber() - l.sub(i).mul(a.sub(r)).toNumber();
        if (u == 0)
          return -1;
        u > 0 == h.greaterThan(a) && (n = 1 - n);
      }
    }
    c = l, a = h;
  } while (s != e);
  return n;
}
function Bh(o, e) {
  return e instanceof jn ? Hh(o, e) : Nh(o, e);
}
function mn(o, e) {
  let n = o;
  do {
    let s = Bh(n.pt, e);
    if (s >= 0)
      return s > 0;
    n = n.next;
  } while (n != o);
  return !0;
}
function Zi(o) {
  for (; o != null && o.pts == null; )
    o = o.firstLeft;
  return o;
}
function Oo(o) {
  let e = o.pts;
  do
    e.idx = o.idx, e = e.prev;
  while (e != o.pts);
}
function Yh(o, e) {
  let n = o.x.sub(e.x).toNumber(), s = o.y.sub(e.y).toNumber();
  return n * n + s * s;
}
function Rn(o, e, n) {
  let s = e.y.sub(n.y).toNumber(), i = n.x.sub(e.x).toNumber(), r = s * e.x.toNumber() + i * e.y.toNumber();
  return r = s * o.x.toNumber() + i * o.y.toNumber() - r, r * r / (s * s + i * i);
}
function Vh(o, e, n, s) {
  return o.x.sub(e.x).abs().greaterThan(o.y.sub(e.y).abs()) ? o.x.greaterThan(e.x) == o.x.lessThan(n.x) ? Rn(o, e, n) < s : e.x.greaterThan(o.x) == e.x.lessThan(n.x) ? Rn(e, o, n) < s : Rn(n, o, e) < s : o.y.greaterThan(e.y) == o.y.lessThan(n.y) ? Rn(o, e, n) < s : e.y.greaterThan(o.y) == e.y.lessThan(n.y) ? Rn(e, o, n) < s : Rn(n, o, e) < s;
}
function ko(o, e, n) {
  return Yh(o, e) <= n;
}
function li(o) {
  let e = o.prev;
  return e.next = o.next, o.next.prev = e, e.idx = 0, e;
}
function Ji(o, e) {
  return (o || e) && !(o && e);
}
function Ro(o, e) {
  let n = e.x.sub(o.x).toNumber(), s = e.y.sub(o.y).toNumber();
  if (n == 0 && s == 0)
    return new Fe(0, 0);
  let i = 1 / Math.sqrt(n * n + s * s);
  return n *= i, s *= i, new Fe(s, -n);
}
class Uh {
  m_MinimaList;
  m_CurrentLM;
  m_edges = new Array();
  m_Scanbeam;
  m_PolyOuts;
  m_ActiveEdges;
  m_UseFullRange;
  m_HasOpenPaths;
  PreserveCollinear;
  constructor() {
    this.m_MinimaList = null, this.m_CurrentLM = null, this.m_UseFullRange = !1, this.m_HasOpenPaths = !1;
  }
  Clear() {
    this.DisposeLocalMinimaList(), this.m_edges.length = 0, this.m_UseFullRange = !1, this.m_HasOpenPaths = !1;
  }
  DisposeLocalMinimaList() {
    this.m_MinimaList = null, this.m_CurrentLM = null;
  }
  InsertLocalMinima(e) {
    if (this.m_MinimaList == null)
      this.m_MinimaList = e;
    else if (e.y.greaterThanOrEqual(this.m_MinimaList.y))
      e.next = this.m_MinimaList, this.m_MinimaList = e;
    else {
      let n = this.m_MinimaList;
      for (; n.next != null && e.y.lessThan(n.next.y); )
        n = n.next;
      e.next = n.next, n.next = e;
    }
  }
  PopLocalMinima(e) {
    let n = this.m_CurrentLM;
    return this.m_CurrentLM != null && this.m_CurrentLM.y.equals(e) ? (this.m_CurrentLM = this.m_CurrentLM.next, n) : null;
  }
  ProcessBound(e, n) {
    let s, i = e, r;
    if (i.outIdx == _e) {
      if (e = i, n) {
        for (; e.top.y.equals(e.next.bot.y); ) e = e.next;
        for (; e != i && e.dx == te; ) e = e.prev;
      } else {
        for (; e.top.y.equals(e.prev.bot.y); ) e = e.prev;
        for (; e != i && e.dx == te; ) e = e.next;
      }
      if (e == i)
        i = n ? e.next : e.prev;
      else {
        e = n ? i.next : i.prev;
        let c = new ri(e.bot.y, null, e);
        e.windDelta = 0, i = this.ProcessBound(e, n), this.InsertLocalMinima(c);
      }
      return i;
    }
    if (e.dx == te && (s = n ? e.prev : e.next, s.dx == te ? s.bot.x.notEquals(e.bot.x) && s.top.x.notEquals(e.bot.x) && pn(e) : s.bot.x.notEquals(e.bot.x) && pn(e)), s = e, n) {
      for (; i.top.y.equals(i.next.bot.y) && i.next.outIdx != _e; )
        i = i.next;
      if (i.dx == te && i.next.outIdx != _e) {
        for (r = i; r.prev.dx == te; )
          r = r.prev;
        r.prev.top.x.greaterThan(i.next.top.x) && (i = r.prev);
      }
      for (; e != i; )
        e.nextInLML = e.next, e.dx == te && e != s && e.bot.x.notEquals(e.prev.top.x) && pn(e), e = e.next;
      e.dx == te && e != s && e.bot.x.notEquals(e.prev.top.x) && pn(e), i = i.next;
    } else {
      for (; i.top.y.equals(i.prev.bot.y) && i.prev.outIdx != _e; )
        i = i.prev;
      if (i.dx == te && i.prev.outIdx != _e) {
        for (r = i; r.next.dx == te; ) r = r.next;
        r.next.top.x.greaterThanOrEqual(i.prev.top.x) && (i = r.next);
      }
      for (; e != i; )
        e.nextInLML = e.prev, e.dx == te && e != s && e.bot.x.notEquals(e.next.top.x) && pn(e), e = e.prev;
      e.dx == te && e != s && e.bot.x.notEquals(e.next.top.x) && pn(e), i = i.prev;
    }
    return i;
  }
  Reset() {
    if (this.m_CurrentLM = this.m_MinimaList, this.m_CurrentLM == null) return;
    this.m_Scanbeam = null;
    let e = this.m_MinimaList;
    for (; e != null; ) {
      this.InsertScanbeam(e.y);
      let n = e.leftBound;
      n != null && (n.curr = new ft(n.bot.x, n.bot.y), n.outIdx = ue), n = e.rightBound, n != null && (n.curr = new ft(n.bot.x, n.bot.y), n.outIdx = ue), e = e.next;
    }
    this.m_ActiveEdges = null;
  }
  InsertScanbeam(e) {
    if (this.m_Scanbeam == null)
      this.m_Scanbeam = new Wi(e);
    else if (e.greaterThan(this.m_Scanbeam.y)) {
      let n = new Wi(e);
      n.next = this.m_Scanbeam, this.m_Scanbeam = n;
    } else {
      let n = this.m_Scanbeam;
      for (; n.next != null && e.lessThanOrEqual(n.next.y); ) n = n.next;
      if (e.equals(n.y)) return;
      let s = new Wi(e);
      s.next = n.next, n.next = s;
    }
  }
  static GetBounds(e) {
    let n = 0, s = e.length;
    for (; n < s && e[n].length == 0; ) n++;
    let i = ot.fromInt(0);
    if (n == s)
      return new Is(i, i, i, i);
    let r = e[n][0].x, c = r, a = e[n][0].y, l = a;
    for (; n < s; n++)
      for (let h = 0; h < e[n].length; h++)
        e[n][h].x.lessThan(r) ? r = e[n][h].x : e[n][h].x.greaterThan(c) && (c = e[n][h].x), e[n][h].y.lessThan(a) ? a = e[n][h].y : e[n][h].y.greaterThan(l) && (l = e[n][h].y);
    return new Is(r, a, c, l);
  }
  PopScanbeam() {
    if (this.m_Scanbeam == null)
      return { Y: ot.fromInt(0), r: !1 };
    let e = this.m_Scanbeam.y;
    return this.m_Scanbeam = this.m_Scanbeam.next, { Y: e, r: !0 };
  }
  get LocalMinimaPending() {
    return this.m_CurrentLM != null;
  }
  CreateOutRec() {
    let e = new ha();
    return this.m_PolyOuts.push(e), e.idx = this.m_PolyOuts.length - 1, e;
  }
  DisposeOutRec(e) {
    this.m_PolyOuts[e] = null;
  }
  UpdateEdgeIntoAEL(e) {
    if (e.nextInLML == null)
      throw new Error("UpdateEdgeIntoAEL: invalid call");
    let n = e.prevInAEL, s = e.nextInAEL;
    return e.nextInLML.outIdx = e.outIdx, n != null ? n.nextInAEL = e.nextInLML : this.m_ActiveEdges = e.nextInLML, s != null && (s.prevInAEL = e.nextInLML), e.nextInLML.side = e.side, e.nextInLML.windDelta = e.windDelta, e.nextInLML.windCnt = e.windCnt, e.nextInLML.windCnt2 = e.windCnt2, e = e.nextInLML, e.curr = new ft(e.bot.x, e.bot.y), e.prevInAEL = n, e.nextInAEL = s, Re(e) || this.InsertScanbeam(e.top.y), e;
  }
  SwapPositionsInAEL(e, n) {
    if (!(e.nextInAEL == e.prevInAEL || n.nextInAEL == n.prevInAEL)) {
      if (e.nextInAEL == n) {
        let s = n.nextInAEL;
        s != null && (s.prevInAEL = e);
        let i = e.prevInAEL;
        i != null && (i.nextInAEL = n), n.prevInAEL = i, n.nextInAEL = e, e.prevInAEL = n, e.nextInAEL = s;
      } else if (n.nextInAEL == e) {
        let s = e.nextInAEL;
        s != null && (s.prevInAEL = n);
        let i = n.prevInAEL;
        i != null && (i.nextInAEL = e), e.prevInAEL = i, e.nextInAEL = n, n.prevInAEL = e, n.nextInAEL = s;
      } else {
        let s = e.nextInAEL, i = e.prevInAEL;
        e.nextInAEL = n.nextInAEL, e.nextInAEL != null && (e.nextInAEL.prevInAEL = e), e.prevInAEL = n.prevInAEL, e.prevInAEL != null && (e.prevInAEL.nextInAEL = e), n.nextInAEL = s, n.nextInAEL != null && (n.nextInAEL.prevInAEL = n), n.prevInAEL = i, n.prevInAEL != null && (n.prevInAEL.nextInAEL = n);
      }
      e.prevInAEL == null ? this.m_ActiveEdges = e : n.prevInAEL == null && (this.m_ActiveEdges = n);
    }
  }
  DeleteFromAEL(e) {
    let n = e.prevInAEL, s = e.nextInAEL;
    n == null && s == null && e != this.m_ActiveEdges || (n != null ? n.nextInAEL = s : this.m_ActiveEdges = s, s != null && (s.prevInAEL = n), e.nextInAEL = null, e.prevInAEL = null);
  }
  AddPath(e, n, s) {
    if (!s && n == 1)
      throw new Error("AddPath: Open paths must be subject.");
    let i = e.length - 1;
    if (s)
      for (; i > 0 && e[i].equals(e[0]); )
        i--;
    for (; i > 0 && e[i].equals(e[i - 1]); )
      i--;
    if (s && i < 2 || !s && i < 1)
      return !1;
    let r = new Array(i + 1);
    for (let d = 0; d <= i; d++)
      r[d] = new Ah();
    let c = !0;
    r[1].curr = e[1], this.m_UseFullRange = pi(e[0], this.m_UseFullRange), this.m_UseFullRange = pi(e[i], this.m_UseFullRange), $i(r[0], r[1], r[i], e[0]), $i(r[i], r[0], r[i - 1], e[i]);
    for (let d = i - 1; d >= 1; --d)
      this.m_UseFullRange = pi(e[d], this.m_UseFullRange), $i(r[d], r[d + 1], r[d - 1], e[d]);
    let a = r[0], l = a, h = a;
    for (; ; ) {
      if (l.curr.equals(l.next.curr) && (s || l.next != a)) {
        if (l == l.next) break;
        l == a && (a = l.next), l = _o(l), h = l;
        continue;
      }
      if (l.prev == l.next)
        break;
      if (s && Hn(l.prev.curr, l.curr, l.next.curr, this.m_UseFullRange) && (!this.PreserveCollinear || !ua(l.prev.curr, l.curr, l.next.curr))) {
        l == a && (a = l.next), l = _o(l), l = l.prev, h = l;
        continue;
      }
      if (l = l.next, l == h || !s && l.next == a) break;
    }
    if (!s && l == l.next || s && l.prev == l.next)
      return !1;
    s || (this.m_HasOpenPaths = !0, a.prev.outIdx = _e), l = a;
    do
      Dh(l, n), l = l.next, c && l.curr.y.notEquals(a.curr.y) && (c = !1);
    while (l != a);
    if (c) {
      if (s)
        return !1;
      l.prev.outIdx = _e;
      let d = new ri(l.bot.y, null, l);
      for (d.rightBound.side = 1, d.rightBound.windDelta = 0; l.bot.x.notEquals(l.prev.top.x) && pn(l), l.next.outIdx != _e; )
        l.nextInLML = l.next, l = l.next;
      return this.InsertLocalMinima(d), this.m_edges.push(r), !0;
    }
    this.m_edges.push(r);
    let u, f = null;
    for (l.prev.bot.equals(l.prev.top) && (l = l.next); l = Oh(l), l != f; ) {
      f == null && (f = l);
      let d;
      l.dx < l.prev.dx ? (d = new ri(l.bot.y, l.prev, l), u = !1) : (d = new ri(l.bot.y, l, l.prev), u = !0), d.leftBound.side = 0, d.rightBound.side = 1, s ? d.leftBound.next == d.rightBound ? d.leftBound.windDelta = -1 : d.leftBound.windDelta = 1 : d.leftBound.windDelta = 0, d.rightBound.windDelta = -d.leftBound.windDelta, l = this.ProcessBound(d.leftBound, u), l.outIdx == _e && (l = this.ProcessBound(l, u));
      let y = this.ProcessBound(d.rightBound, !u);
      y.outIdx == _e && (y = this.ProcessBound(y, !u)), d.leftBound.outIdx == _e ? d.clearLeftBound() : d.rightBound.outIdx == _e && d.clearRightBound(), this.InsertLocalMinima(d), u || (l = y);
    }
    return !0;
  }
  AddPaths(e, n, s) {
    let i = !1;
    for (let r of e)
      this.AddPath(r, n, s) && (i = !0);
    return i;
  }
}
class Kt extends Uh {
  //InitOptions that can be passed to the constructor ...
  m_ClipType;
  m_Maxima;
  m_SortedEdges;
  m_IntersectList;
  m_ExecuteLocked;
  m_ClipFillType;
  m_SubjFillType;
  m_Joins;
  m_GhostJoins;
  m_UsingPolyTree;
  ReverseSolution;
  StrictlySimple;
  constructor(e = 0) {
    super(), this.m_Scanbeam = null, this.m_Maxima = null, this.m_ActiveEdges = null, this.m_SortedEdges = null, this.m_IntersectList = new Array(), this.m_ExecuteLocked = !1, this.m_UsingPolyTree = !1, this.m_PolyOuts = new Array(), this.m_Joins = new Array(), this.m_GhostJoins = new Array(), this.ReverseSolution = (_h & e) != 0, this.StrictlySimple = (Th & e) != 0, this.PreserveCollinear = (Ph & e) != 0;
  }
  InsertMaxima(e) {
    let n = new Lh(e);
    if (this.m_Maxima == null)
      this.m_Maxima = n, this.m_Maxima.next = null, this.m_Maxima.prev = null;
    else if (e.lessThan(this.m_Maxima.x))
      n.next = this.m_Maxima, n.prev = null, this.m_Maxima = n;
    else {
      let s = this.m_Maxima;
      for (; s.next != null && e.greaterThanOrEqual(s.next.x); )
        s = s.next;
      if (e.equals(s.x))
        return;
      n.next = s.next, n.prev = s, s.next != null && (s.next.prev = n), s.next = n;
    }
  }
  Execute(e, n, s = 0) {
    return n instanceof la ? this.ExecutePolyTree(e, n, s, s) : this.ExecutePaths(e, n, s, s);
  }
  ExecutePaths(e, n, s, i) {
    if (this.m_ExecuteLocked)
      return !1;
    if (this.m_HasOpenPaths)
      throw new Error("Error: PolyTree struct is needed for open path clipping.");
    this.m_ExecuteLocked = !0, n.length = 0, this.m_SubjFillType = s, this.m_ClipFillType = i, this.m_ClipType = e, this.m_UsingPolyTree = !1;
    let r;
    try {
      r = this.ExecuteInternal(), r && this.BuildResult(n);
    } finally {
      this.DisposeAllPolyPts(), this.m_ExecuteLocked = !1;
    }
    return r;
  }
  ExecutePolyTree(e, n, s, i) {
    if (this.m_ExecuteLocked)
      return !1;
    this.m_ExecuteLocked = !0, this.m_SubjFillType = s, this.m_ClipFillType = i, this.m_ClipType = e, this.m_UsingPolyTree = !0;
    let r;
    try {
      r = this.ExecuteInternal(), r && this.BuildResult2(n);
    } finally {
      this.DisposeAllPolyPts(), this.m_ExecuteLocked = !1;
    }
    return r;
  }
  FixHoleLinkage(e) {
    if (e.firstLeft == null || e.isHole != e.firstLeft.isHole && e.firstLeft.pts != null)
      return;
    let n = e.firstLeft;
    for (; n != null && (n.isHole == e.isHole || n.pts == null); )
      n = n.firstLeft;
    e.firstLeft = n;
  }
  ExecuteInternal() {
    try {
      this.Reset(), this.m_SortedEdges = null, this.m_Maxima = null;
      let e, n, s = this.PopScanbeam();
      if (!s.r)
        return !1;
      for (e = s.Y, this.InsertLocalMinimaIntoAEL(e), s = this.PopScanbeam(); s.r || this.LocalMinimaPending; ) {
        if (n = s.Y, this.ProcessHorizontals(), this.m_GhostJoins.length = 0, !this.ProcessIntersections(n))
          return !1;
        this.ProcessEdgesAtTopOfScanbeam(n), e = n, this.InsertLocalMinimaIntoAEL(e), s = this.PopScanbeam();
      }
      for (let i of this.m_PolyOuts)
        i.pts == null || i.isOpen || Ji(i.isHole, this.ReverseSolution) == mi(i) > 0 && ss(i.pts);
      this.JoinCommonEdges();
      for (let i of this.m_PolyOuts)
        i.pts != null && (i.isOpen ? this.FixupOutPolyline(i) : this.FixupOutPolygon(i));
      return this.StrictlySimple && this.DoSimplePolygons(), !0;
    } finally {
      this.m_Joins.length = 0, this.m_GhostJoins.length = 0;
    }
  }
  DisposeAllPolyPts() {
    for (let e = 0; e < this.m_PolyOuts.length; ++e)
      this.DisposeOutRec(e);
    this.m_PolyOuts.length = 0;
  }
  AddJoin(e, n, s) {
    let i = new Mo(e, n, s);
    this.m_Joins.push(i);
  }
  AddGhostJoin(e, n) {
    let s = new Mo(e, null, n);
    this.m_GhostJoins.push(s);
  }
  InsertLocalMinimaIntoAEL(e) {
    let n;
    for (; (n = this.PopLocalMinima(e)) != null; ) {
      let s = n.leftBound, i = n.rightBound, r = null;
      if (s == null ? (this.InsertEdgeIntoAEL(i, null), this.SetWindingCount(i), this.IsContributing(i) && (r = this.AddOutPt(i, i.bot))) : i == null ? (this.InsertEdgeIntoAEL(s, null), this.SetWindingCount(s), this.IsContributing(s) && (r = this.AddOutPt(s, s.bot)), this.InsertScanbeam(s.top.y)) : (this.InsertEdgeIntoAEL(s, null), this.InsertEdgeIntoAEL(i, s), this.SetWindingCount(s), i.windCnt = s.windCnt, i.windCnt2 = s.windCnt2, this.IsContributing(s) && (r = this.AddLocalMinPoly(s, i, s.bot)), this.InsertScanbeam(s.top.y)), i != null && (Re(i) ? (i.nextInLML != null && this.InsertScanbeam(i.nextInLML.top.y), this.AddEdgeToSEL(i)) : this.InsertScanbeam(i.top.y)), !(s == null || i == null)) {
        if (r != null && Re(i) && this.m_GhostJoins.length > 0 && i.windDelta != 0)
          for (let c = 0; c < this.m_GhostJoins.length; c++) {
            let a = this.m_GhostJoins[c];
            ji(a.outPt1.pt.x, a.offPt.x, i.bot.x, i.top.x) && this.AddJoin(a.outPt1, r, a.offPt);
          }
        if (s.outIdx >= 0 && s.prevInAEL != null && s.prevInAEL.curr.x.equals(s.bot.x) && s.prevInAEL.outIdx >= 0 && ns(s.prevInAEL.curr, s.prevInAEL.top, s.curr, s.top, this.m_UseFullRange) && s.windDelta != 0 && s.prevInAEL.windDelta != 0) {
          let c = this.AddOutPt(s.prevInAEL, s.bot);
          this.AddJoin(r, c, s.top);
        }
        if (s.nextInAEL != i) {
          if (i.outIdx >= 0 && i.prevInAEL.outIdx >= 0 && ns(i.prevInAEL.curr, i.prevInAEL.top, i.curr, i.top, this.m_UseFullRange) && i.windDelta != 0 && i.prevInAEL.windDelta != 0) {
            let a = this.AddOutPt(i.prevInAEL, i.bot);
            this.AddJoin(r, a, i.top);
          }
          let c = s.nextInAEL;
          if (c != null)
            for (; c != i; )
              this.IntersectEdges(i, c, s.curr), c = c.nextInAEL;
        }
      }
    }
  }
  InsertEdgeIntoAEL(e, n) {
    if (this.m_ActiveEdges == null)
      e.prevInAEL = null, e.nextInAEL = null, this.m_ActiveEdges = e;
    else if (n == null && To(this.m_ActiveEdges, e))
      e.prevInAEL = null, e.nextInAEL = this.m_ActiveEdges, this.m_ActiveEdges.prevInAEL = e, this.m_ActiveEdges = e;
    else {
      for (n == null && (n = this.m_ActiveEdges); n.nextInAEL != null && !To(n.nextInAEL, e); )
        n = n.nextInAEL;
      e.nextInAEL = n.nextInAEL, n.nextInAEL != null && (n.nextInAEL.prevInAEL = e), e.prevInAEL = n, n.nextInAEL = e;
    }
  }
  IsEvenOddFillType(e) {
    return e.polyTyp == 0 ? this.m_SubjFillType == 0 : this.m_ClipFillType == 0;
  }
  IsEvenOddAltFillType(e) {
    return e.polyTyp == 0 ? this.m_ClipFillType == 0 : this.m_SubjFillType == 0;
  }
  IsContributing(e) {
    let n, s;
    switch (e.polyTyp == 0 ? (n = this.m_SubjFillType, s = this.m_ClipFillType) : (n = this.m_ClipFillType, s = this.m_SubjFillType), n) {
      case 0:
        if (e.windDelta == 0 && e.windCnt != 1)
          return !1;
        break;
      case 1:
        if (Math.abs(e.windCnt) != 1)
          return !1;
        break;
      case 2:
        if (e.windCnt != 1)
          return !1;
        break;
      default:
        if (e.windCnt != -1)
          return !1;
        break;
    }
    switch (this.m_ClipType) {
      case 0:
        switch (s) {
          case 0:
          case 1:
            return e.windCnt2 != 0;
          case 2:
            return e.windCnt2 > 0;
          default:
            return e.windCnt2 < 0;
        }
      case 1:
        switch (s) {
          case 0:
          case 1:
            return e.windCnt2 == 0;
          case 2:
            return e.windCnt2 <= 0;
          default:
            return e.windCnt2 >= 0;
        }
      case 2:
        if (e.polyTyp == 0)
          switch (s) {
            case 0:
            case 1:
              return e.windCnt2 == 0;
            case 2:
              return e.windCnt2 <= 0;
            default:
              return e.windCnt2 >= 0;
          }
        else
          switch (s) {
            case 0:
            case 1:
              return e.windCnt2 != 0;
            case 2:
              return e.windCnt2 > 0;
            default:
              return e.windCnt2 < 0;
          }
      case 3:
        if (e.windDelta == 0)
          switch (s) {
            case 0:
            case 1:
              return e.windCnt2 == 0;
            case 2:
              return e.windCnt2 <= 0;
            default:
              return e.windCnt2 >= 0;
          }
        return !0;
    }
    return !0;
  }
  SetWindingCount(e) {
    let n = e.prevInAEL;
    for (; n != null && (n.polyTyp != e.polyTyp || n.windDelta == 0); )
      n = n.prevInAEL;
    if (n == null) {
      let s;
      s = e.polyTyp == 0 ? this.m_SubjFillType : this.m_ClipFillType, e.windDelta == 0 ? e.windCnt = s == 3 ? -1 : 1 : e.windCnt = e.windDelta, e.windCnt2 = 0, n = this.m_ActiveEdges;
    } else if (e.windDelta == 0 && this.m_ClipType != 1)
      e.windCnt = 1, e.windCnt2 = n.windCnt2, n = n.nextInAEL;
    else if (this.IsEvenOddFillType(e)) {
      if (e.windDelta == 0) {
        let s = !0, i = n.prevInAEL;
        for (; i != null; )
          i.polyTyp == n.polyTyp && i.windDelta != 0 && (s = !s), i = i.prevInAEL;
        e.windCnt = s ? 0 : 1;
      } else
        e.windCnt = e.windDelta;
      e.windCnt2 = n.windCnt2, n = n.nextInAEL;
    } else
      n.windCnt * n.windDelta < 0 ? Math.abs(n.windCnt) > 1 ? n.windDelta * e.windDelta < 0 ? e.windCnt = n.windCnt : e.windCnt = n.windCnt + e.windDelta : e.windCnt = e.windDelta == 0 ? 1 : e.windDelta : e.windDelta == 0 ? e.windCnt = n.windCnt < 0 ? n.windCnt - 1 : n.windCnt + 1 : n.windDelta * e.windDelta < 0 ? e.windCnt = n.windCnt : e.windCnt = n.windCnt + e.windDelta, e.windCnt2 = n.windCnt2, n = n.nextInAEL;
    if (this.IsEvenOddAltFillType(e))
      for (; n != e; )
        n.windDelta != 0 && (e.windCnt2 = e.windCnt2 == 0 ? 1 : 0), n = n.nextInAEL;
    else
      for (; n != e; )
        e.windCnt2 += n.windDelta, n = n.nextInAEL;
  }
  AddEdgeToSEL(e) {
    this.m_SortedEdges == null ? (this.m_SortedEdges = e, e.prevInSEL = null, e.nextInSEL = null) : (e.nextInSEL = this.m_SortedEdges, e.prevInSEL = null, this.m_SortedEdges.prevInSEL = e, this.m_SortedEdges = e);
  }
  PopEdgeFromSEL() {
    if (this.m_SortedEdges == null)
      return null;
    let e = this.m_SortedEdges;
    return this.m_SortedEdges = this.m_SortedEdges.nextInSEL, this.m_SortedEdges != null && (this.m_SortedEdges.prevInSEL = null), e.nextInSEL = null, e.prevInSEL = null, e;
  }
  CopyAELToSEL() {
    let e = this.m_ActiveEdges;
    for (this.m_SortedEdges = e; e != null; )
      e.prevInSEL = e.prevInAEL, e.nextInSEL = e.nextInAEL, e = e.nextInAEL;
  }
  SwapPositionsInSEL(e, n) {
    if (!(e.nextInSEL == null && e.prevInSEL == null) && !(n.nextInSEL == null && n.prevInSEL == null)) {
      if (e.nextInSEL == n) {
        let s = n.nextInSEL;
        s != null && (s.prevInSEL = e);
        let i = e.prevInSEL;
        i != null && (i.nextInSEL = n), n.prevInSEL = i, n.nextInSEL = e, e.prevInSEL = n, e.nextInSEL = s;
      } else if (n.nextInSEL == e) {
        let s = e.nextInSEL;
        s != null && (s.prevInSEL = n);
        let i = n.prevInSEL;
        i != null && (i.nextInSEL = e), e.prevInSEL = i, e.nextInSEL = n, n.prevInSEL = e, n.nextInSEL = s;
      } else {
        let s = e.nextInSEL, i = e.prevInSEL;
        e.nextInSEL = n.nextInSEL, e.nextInSEL != null && (e.nextInSEL.prevInSEL = e), e.prevInSEL = n.prevInSEL, e.prevInSEL != null && (e.prevInSEL.nextInSEL = e), n.nextInSEL = s, n.nextInSEL != null && (n.nextInSEL.prevInSEL = n), n.prevInSEL = i, n.prevInSEL != null && (n.prevInSEL.nextInSEL = n);
      }
      e.prevInSEL == null ? this.m_SortedEdges = e : n.prevInSEL == null && (this.m_SortedEdges = n);
    }
  }
  AddLocalMaxPoly(e, n, s) {
    this.AddOutPt(e, s), n.windDelta == 0 && this.AddOutPt(n, s), e.outIdx == n.outIdx ? (e.outIdx = ue, n.outIdx = ue) : e.outIdx < n.outIdx ? this.AppendPolygon(e, n) : this.AppendPolygon(n, e);
  }
  AddLocalMinPoly(e, n, s) {
    let i, r, c;
    if (Re(n) || e.dx > n.dx ? (i = this.AddOutPt(e, s), n.outIdx = e.outIdx, e.side = 0, n.side = 1, r = e, r.prevInAEL == n ? c = n.prevInAEL : c = r.prevInAEL) : (i = this.AddOutPt(n, s), e.outIdx = n.outIdx, e.side = 1, n.side = 0, r = n, r.prevInAEL == e ? c = e.prevInAEL : c = r.prevInAEL), c != null && c.outIdx >= 0 && c.top.y.lessThan(s.y) && r.top.y.lessThan(s.y)) {
      let a = Ie(c, s.y), l = Ie(r, s.y);
      if (a.equals(l) && r.windDelta != 0 && c.windDelta != 0 && ns(
        new ft(a, s.y),
        c.top,
        new ft(l, s.y),
        r.top,
        this.m_UseFullRange
      )) {
        let h = this.AddOutPt(c, s);
        this.AddJoin(i, h, r.top);
      }
    }
    return i;
  }
  AddOutPt(e, n) {
    if (e.outIdx < 0) {
      let s = this.CreateOutRec();
      s.isOpen = e.windDelta == 0;
      let i = new jn();
      return s.pts = i, i.idx = s.idx, i.pt = new ft(n.x, n.y), i.next = i, i.prev = i, s.isOpen || this.SetHoleState(e, s), e.outIdx = s.idx, i;
    } else {
      let s = this.m_PolyOuts[e.outIdx], i = s.pts, r = e.side == 0;
      if (r && n.equals(i.pt))
        return i;
      if (!r && n.equals(i.prev.pt))
        return i.prev;
      let c = new jn();
      return c.idx = s.idx, c.pt = new ft(n.x, n.y), c.next = i, c.prev = i.prev, c.prev.next = c, i.prev = c, r && (s.pts = c), c;
    }
  }
  GetLastOutPt(e) {
    let n = this.m_PolyOuts[e.outIdx];
    return e.side == 0 ? n.pts : n.pts.prev;
  }
  SetHoleState(e, n) {
    let s = e.prevInAEL, i = null;
    for (; s != null; )
      s.outIdx >= 0 && s.windDelta != 0 && (i == null ? i = s : i.outIdx == s.outIdx && (i = null)), s = s.prevInAEL;
    i == null ? (n.firstLeft = null, n.isHole = !1) : (n.firstLeft = this.m_PolyOuts[i.outIdx], n.isHole = !n.firstLeft.isHole);
  }
  GetOutRec(e) {
    let n = this.m_PolyOuts[e];
    for (; n != this.m_PolyOuts[n.idx]; )
      n = this.m_PolyOuts[n.idx];
    return n;
  }
  AppendPolygon(e, n) {
    let s = this.m_PolyOuts[e.outIdx], i = this.m_PolyOuts[n.outIdx], r;
    ci(s, i) ? r = i : ci(i, s) ? r = s : r = Ao(s, i);
    let c = s.pts, a = c.prev, l = i.pts, h = l.prev;
    e.side == 0 ? n.side == 0 ? (ss(l), l.next = c, c.prev = l, a.next = h, h.prev = a, s.pts = h) : (h.next = c, c.prev = h, l.prev = a, a.next = l, s.pts = l) : n.side == 1 ? (ss(l), a.next = h, h.prev = a, l.next = c, c.prev = l) : (a.next = l, l.prev = a, c.prev = h, h.next = c), s.bottomPt = null, r == i && (i.firstLeft != s && (s.firstLeft = i.firstLeft), s.isHole = i.isHole), i.pts = null, i.bottomPt = null, i.firstLeft = s;
    let u = e.outIdx, f = n.outIdx;
    e.outIdx = ue, n.outIdx = ue;
    let d = this.m_ActiveEdges;
    for (; d != null; ) {
      if (d.outIdx == f) {
        d.outIdx = u, d.side = e.side;
        break;
      }
      d = d.nextInAEL;
    }
    i.idx = s.idx;
  }
  IntersectEdges(e, n, s) {
    let i = e.outIdx >= 0, r = n.outIdx >= 0;
    if (e.windDelta == 0 || n.windDelta == 0) {
      if (e.windDelta == 0 && n.windDelta == 0)
        return;
      e.polyTyp == n.polyTyp && e.windDelta != n.windDelta && this.m_ClipType == 1 ? e.windDelta == 0 ? r && (this.AddOutPt(e, s), i && (e.outIdx = ue)) : i && (this.AddOutPt(n, s), r && (n.outIdx = ue)) : e.polyTyp != n.polyTyp && (e.windDelta == 0 && Math.abs(n.windCnt) == 1 && (this.m_ClipType != 1 || n.windCnt2 == 0) ? (this.AddOutPt(e, s), i && (e.outIdx = ue)) : n.windDelta == 0 && Math.abs(e.windCnt) == 1 && (this.m_ClipType != 1 || e.windCnt2 == 0) && (this.AddOutPt(n, s), r && (n.outIdx = ue)));
      return;
    }
    if (e.polyTyp == n.polyTyp)
      if (this.IsEvenOddFillType(e)) {
        let d = e.windCnt;
        e.windCnt = n.windCnt, n.windCnt = d;
      } else
        e.windCnt + n.windDelta == 0 ? e.windCnt = -e.windCnt : e.windCnt += n.windDelta, n.windCnt - e.windDelta == 0 ? n.windCnt = -n.windCnt : n.windCnt -= e.windDelta;
    else
      this.IsEvenOddFillType(n) ? e.windCnt2 = e.windCnt2 == 0 ? 1 : 0 : e.windCnt2 += n.windDelta, this.IsEvenOddFillType(e) ? n.windCnt2 = n.windCnt2 == 0 ? 1 : 0 : n.windCnt2 -= e.windDelta;
    let c, a, l, h;
    e.polyTyp == 0 ? (c = this.m_SubjFillType, l = this.m_ClipFillType) : (c = this.m_ClipFillType, l = this.m_SubjFillType), n.polyTyp == 0 ? (a = this.m_SubjFillType, h = this.m_ClipFillType) : (a = this.m_ClipFillType, h = this.m_SubjFillType);
    let u, f;
    switch (c) {
      case 2:
        u = e.windCnt;
        break;
      case 3:
        u = -e.windCnt;
        break;
      default:
        u = Math.abs(e.windCnt);
        break;
    }
    switch (a) {
      case 2:
        f = n.windCnt;
        break;
      case 3:
        f = -n.windCnt;
        break;
      default:
        f = Math.abs(n.windCnt);
        break;
    }
    if (i && r)
      u != 0 && u != 1 || f != 0 && f != 1 || e.polyTyp != n.polyTyp && this.m_ClipType != 3 ? this.AddLocalMaxPoly(e, n, s) : (this.AddOutPt(e, s), this.AddOutPt(n, s), ai(e, n), Gi(e, n));
    else if (i)
      (f == 0 || f == 1) && (this.AddOutPt(e, s), ai(e, n), Gi(e, n));
    else if (r)
      (u == 0 || u == 1) && (this.AddOutPt(n, s), ai(e, n), Gi(e, n));
    else if ((u == 0 || u == 1) && (f == 0 || f == 1)) {
      let d, y;
      switch (l) {
        case 2:
          d = e.windCnt2;
          break;
        case 3:
          d = -e.windCnt2;
          break;
        default:
          d = Math.abs(e.windCnt2);
          break;
      }
      switch (h) {
        case 2:
          y = n.windCnt2;
          break;
        case 3:
          y = -n.windCnt2;
          break;
        default:
          y = Math.abs(n.windCnt2);
          break;
      }
      if (e.polyTyp != n.polyTyp)
        this.AddLocalMinPoly(e, n, s);
      else if (u == 1 && f == 1)
        switch (this.m_ClipType) {
          case 0:
            d > 0 && y > 0 && this.AddLocalMinPoly(e, n, s);
            break;
          case 1:
            d <= 0 && y <= 0 && this.AddLocalMinPoly(e, n, s);
            break;
          case 2:
            (e.polyTyp == 1 && d > 0 && y > 0 || e.polyTyp == 0 && d <= 0 && y <= 0) && this.AddLocalMinPoly(e, n, s);
            break;
          case 3:
            this.AddLocalMinPoly(e, n, s);
            break;
        }
      else
        ai(e, n);
    }
  }
  DeleteFromSEL(e) {
    let n = e.prevInSEL, s = e.nextInSEL;
    n == null && s == null && e != this.m_SortedEdges || (n != null ? n.nextInSEL = s : this.m_SortedEdges = s, s != null && (s.prevInSEL = n), e.nextInSEL = null, e.prevInSEL = null);
  }
  ProcessHorizontals() {
    let e;
    for (; (e = this.PopEdgeFromSEL()) != null; )
      this.ProcessHorizontal(e);
  }
  ProcessHorizontal(e) {
    let n, s, i, r = e.windDelta == 0, c = Eo(e);
    n = c.Dir, s = c.Left, i = c.Right;
    let a = e, l = null;
    for (; a.nextInLML != null && Re(a.nextInLML); )
      a = a.nextInLML;
    a.nextInLML == null && (l = da(a));
    let h = this.m_Maxima;
    if (h != null)
      if (n == 1) {
        for (; h != null && h.x.lessThan(e.bot.x); )
          h = h.next;
        h != null && h.x.greaterThanOrEqual(a.top.x) && (h = null);
      } else {
        for (; h.next != null && h.next.x.lessThan(e.bot.x); )
          h = h.next;
        h.x.lessThanOrEqual(a.top.x) && (h = null);
      }
    let u = null;
    for (; ; ) {
      let f = e == a, d = Lo(e, n);
      for (; d != null; ) {
        if (h != null)
          if (n == 1)
            for (; h != null && h.x.lessThan(d.curr.x); )
              e.outIdx >= 0 && !r && this.AddOutPt(e, new ft(h.x, e.bot.y)), h = h.next;
          else
            for (; h != null && h.x.greaterThan(d.curr.x); )
              e.outIdx >= 0 && !r && this.AddOutPt(e, new ft(h.x, e.bot.y)), h = h.prev;
        if (n == 1 && d.curr.x.greaterThan(i) || n == 0 && d.curr.x.lessThan(s) || d.curr.x.equals(e.top.x) && e.nextInLML != null && d.dx < e.nextInLML.dx)
          break;
        if (e.outIdx >= 0 && !r) {
          u = this.AddOutPt(e, d.curr);
          let x = this.m_SortedEdges;
          for (; x != null; ) {
            if (x.outIdx >= 0 && ji(e.bot.x, e.top.x, x.bot.x, x.top.x)) {
              let g = this.GetLastOutPt(x);
              this.AddJoin(g, u, x.top);
            }
            x = x.nextInSEL;
          }
          this.AddGhostJoin(u, e.bot);
        }
        if (d == l && f) {
          e.outIdx >= 0 && this.AddLocalMaxPoly(e, l, e.top), this.DeleteFromAEL(e), this.DeleteFromAEL(l);
          return;
        }
        if (n == 1) {
          let x = new ft(d.curr.x, e.curr.y);
          this.IntersectEdges(e, d, x);
        } else {
          let x = new ft(d.curr.x, e.curr.y);
          this.IntersectEdges(d, e, x);
        }
        let y = Lo(d, n);
        this.SwapPositionsInAEL(e, d), d = y;
      }
      if (e.nextInLML == null || !Re(e.nextInLML))
        break;
      e = this.UpdateEdgeIntoAEL(e), e.outIdx >= 0 && this.AddOutPt(e, e.bot), c = Eo(e), n = c.Dir, s = c.Left, i = c.Right;
    }
    if (e.outIdx >= 0 && u == null) {
      u = this.GetLastOutPt(e);
      let f = this.m_SortedEdges;
      for (; f != null; ) {
        if (f.outIdx >= 0 && ji(e.bot.x, e.top.x, f.bot.x, f.top.x)) {
          let d = this.GetLastOutPt(f);
          this.AddJoin(d, u, f.top);
        }
        f = f.nextInSEL;
      }
      this.AddGhostJoin(u, e.top);
    }
    if (e.nextInLML != null)
      if (e.outIdx >= 0) {
        if (u = this.AddOutPt(e, e.top), e = this.UpdateEdgeIntoAEL(e), e.windDelta == 0)
          return;
        let f = e.prevInAEL, d = e.nextInAEL;
        if (f != null && f.curr.x.equals(e.bot.x) && f.curr.y.equals(e.bot.y) && f.windDelta != 0 && f.outIdx >= 0 && f.curr.y.greaterThan(f.top.y) && bo(e, f, this.m_UseFullRange)) {
          let y = this.AddOutPt(f, e.bot);
          this.AddJoin(u, y, e.top);
        } else if (d != null && d.curr.x.equals(e.bot.x) && d.curr.y.equals(e.bot.y) && d.windDelta != 0 && d.outIdx >= 0 && d.curr.y.greaterThan(d.top.y) && bo(e, d, this.m_UseFullRange)) {
          let y = this.AddOutPt(d, e.bot);
          this.AddJoin(u, y, e.top);
        }
      } else
        e = this.UpdateEdgeIntoAEL(e);
    else
      e.outIdx >= 0 && this.AddOutPt(e, e.top), this.DeleteFromAEL(e);
  }
  ProcessIntersections(e) {
    if (this.m_ActiveEdges == null)
      return !0;
    try {
      if (this.BuildIntersectList(e), this.m_IntersectList.length == 0)
        return !0;
      if (this.m_IntersectList.length == 1 || this.FixupIntersectionOrder())
        this.ProcessIntersectList();
      else
        return !1;
    } catch {
      throw this.m_SortedEdges = null, this.m_IntersectList.length = 0, new Error("ProcessIntersections error");
    }
    return this.m_SortedEdges = null, !0;
  }
  BuildIntersectList(e) {
    if (this.m_ActiveEdges == null)
      return;
    let n = this.m_ActiveEdges;
    for (this.m_SortedEdges = n; n != null; )
      n.prevInSEL = n.prevInAEL, n.nextInSEL = n.nextInAEL, n.curr = new ft(Ie(n, e), n.curr.y), n = n.nextInAEL;
    let s = !0;
    for (; s && this.m_SortedEdges != null; ) {
      for (s = !1, n = this.m_SortedEdges; n.nextInSEL != null; ) {
        let i = n.nextInSEL, r;
        n.curr.x.greaterThan(i.curr.x) ? (r = Rh(n, i), r.y.lessThan(e) && (r = new ft(Ie(n, e), e)), this.m_IntersectList.push(new Eh(n, i, r)), this.SwapPositionsInSEL(n, i), s = !0) : n = i;
      }
      if (n.prevInSEL != null)
        n.prevInSEL.nextInSEL = null;
      else
        break;
    }
    this.m_SortedEdges = null;
  }
  FixupIntersectionOrder() {
    this.m_IntersectList.sort(Sh), this.CopyAELToSEL();
    let e = this.m_IntersectList.length;
    for (let n = 0; n < e; n++) {
      if (!qo(this.m_IntersectList[n])) {
        let s = n + 1;
        for (; s < e && !qo(this.m_IntersectList[s]); )
          s++;
        if (s == e)
          return !1;
        let i = this.m_IntersectList[n];
        this.m_IntersectList[n] = this.m_IntersectList[s], this.m_IntersectList[s] = i;
      }
      this.SwapPositionsInSEL(this.m_IntersectList[n].edge1, this.m_IntersectList[n].edge2);
    }
    return !0;
  }
  ProcessIntersectList() {
    for (let e of this.m_IntersectList)
      this.IntersectEdges(e.edge1, e.edge2, e.pt), this.SwapPositionsInAEL(e.edge1, e.edge2);
    this.m_IntersectList.length = 0;
  }
  ProcessEdgesAtTopOfScanbeam(e) {
    let n = this.m_ActiveEdges;
    for (; n != null; ) {
      let s = kh(n, e);
      if (s) {
        let i = Io(n);
        s = i == null || !Re(i);
      }
      if (s) {
        this.StrictlySimple && this.InsertMaxima(n.top.x);
        let i = n.prevInAEL;
        this.DoMaxima(n), i == null ? n = this.m_ActiveEdges : n = i.nextInAEL;
      } else {
        if (So(n, e) && Re(n.nextInLML) ? (n = this.UpdateEdgeIntoAEL(n), n.outIdx >= 0 && this.AddOutPt(n, n.bot), this.AddEdgeToSEL(n)) : n.curr = new ft(Ie(n, e), e), this.StrictlySimple) {
          let i = n.prevInAEL;
          if (n.outIdx >= 0 && n.windDelta != 0 && i != null && i.outIdx >= 0 && i.curr.x.equals(n.curr.x) && i.windDelta != 0) {
            let r = new ft(n.curr.x, n.curr.y), c = this.AddOutPt(i, r), a = this.AddOutPt(n, r);
            this.AddJoin(c, a, r);
          }
        }
        n = n.nextInAEL;
      }
    }
    for (this.ProcessHorizontals(), this.m_Maxima = null, n = this.m_ActiveEdges; n != null; ) {
      if (So(n, e)) {
        let s = null;
        n.outIdx >= 0 && (s = this.AddOutPt(n, n.top)), n = this.UpdateEdgeIntoAEL(n);
        let i = n.prevInAEL, r = n.nextInAEL;
        if (i != null && i.curr.x.equals(n.bot.x) && i.curr.y.equals(n.bot.y) && s != null && i.outIdx >= 0 && i.curr.y.greaterThan(i.top.y) && ns(n.curr, n.top, i.curr, i.top, this.m_UseFullRange) && n.windDelta != 0 && i.windDelta != 0) {
          let c = this.AddOutPt(i, n.bot);
          this.AddJoin(s, c, n.top);
        } else if (r != null && r.curr.x.equals(n.bot.x) && r.curr.y.equals(n.bot.y) && s != null && r.outIdx >= 0 && r.curr.y.greaterThan(r.top.y) && ns(n.curr, n.top, r.curr, r.top, this.m_UseFullRange) && n.windDelta != 0 && r.windDelta != 0) {
          let c = this.AddOutPt(r, n.bot);
          this.AddJoin(s, c, n.top);
        }
      }
      n = n.nextInAEL;
    }
  }
  DoMaxima(e) {
    let n = Io(e);
    if (n == null) {
      e.outIdx >= 0 && this.AddOutPt(e, e.top), this.DeleteFromAEL(e);
      return;
    }
    let s = e.nextInAEL;
    for (; s != null && s != n; )
      this.IntersectEdges(e, s, e.top), this.SwapPositionsInAEL(e, s), s = e.nextInAEL;
    if (e.outIdx == ue && n.outIdx == ue)
      this.DeleteFromAEL(e), this.DeleteFromAEL(n);
    else if (e.outIdx >= 0 && n.outIdx >= 0)
      e.outIdx >= 0 && this.AddLocalMaxPoly(e, n, e.top), this.DeleteFromAEL(e), this.DeleteFromAEL(n);
    else if (e.windDelta == 0)
      e.outIdx >= 0 && (this.AddOutPt(e, e.top), e.outIdx = ue), this.DeleteFromAEL(e), n.outIdx >= 0 && (this.AddOutPt(n, e.top), n.outIdx = ue), this.DeleteFromAEL(n);
    else
      throw new Error("DoMaxima error");
  }
  BuildResult(e) {
    e.length = 0;
    for (let n of this.m_PolyOuts) {
      if (n.pts == null)
        continue;
      let s = n.pts.prev, i = Do(s);
      if (i < 2)
        continue;
      let r = new Array();
      for (let c = 0; c < i; c++)
        r.push(s.pt), s = s.prev;
      e.push(r);
    }
  }
  BuildResult2(e) {
    e.clear();
    for (let n of this.m_PolyOuts) {
      let s = Do(n.pts);
      if (n.isOpen && s < 2 || !n.isOpen && s < 3)
        continue;
      this.FixHoleLinkage(n);
      let i = new qs();
      e.allPolys.push(i), n.polyNode = i;
      let r = n.pts.prev;
      for (let c = 0; c < s; c++)
        i.polygon.push(r.pt), r = r.prev;
    }
    for (let n of this.m_PolyOuts)
      n.polyNode != null && (n.isOpen ? (n.polyNode.isOpen = !0, e.addChild(n.polyNode)) : n.firstLeft != null && n.firstLeft.polyNode != null ? n.firstLeft.polyNode.addChild(n.polyNode) : e.addChild(n.polyNode));
  }
  FixupOutPolyline(e) {
    let n = e.pts, s = n.prev;
    for (; n != s; )
      if (n = n.next, n.pt.equals(n.prev.pt)) {
        n == s && (s = n.prev);
        let i = n.prev;
        i.next = n.next, n.next.prev = i, n = i;
      }
    n == n.prev && (e.pts = null);
  }
  FixupOutPolygon(e) {
    let n = null;
    e.bottomPt = null;
    let s = e.pts, i = this.PreserveCollinear || this.StrictlySimple;
    for (; ; ) {
      if (s.prev == s || s.prev == s.next) {
        e.pts = null;
        return;
      }
      if (s.pt.equals(s.next.pt) || s.pt.equals(s.prev.pt) || Hn(s.prev.pt, s.pt, s.next.pt, this.m_UseFullRange) && (!i || !ua(s.prev.pt, s.pt, s.next.pt)))
        n = null, s.prev.next = s.next, s.next.prev = s.prev, s = s.prev;
      else {
        if (s == n)
          break;
        n == null && (n = s), s = s.next;
      }
    }
    e.pts = s;
  }
  JoinHorz(e, n, s, i, r, c) {
    let a = e.pt.x.greaterThan(n.pt.x) ? 0 : 1, l = s.pt.x.greaterThan(i.pt.x) ? 0 : 1;
    if (a == l)
      return !1;
    if (a == 1) {
      for (; e.next.pt.x.lessThanOrEqual(r.x) && e.next.pt.x.greaterThanOrEqual(e.pt.x) && e.next.pt.y.equals(r.y); )
        e = e.next;
      c && e.pt.x.notEquals(r.x) && (e = e.next), n = he(e, !c), n.pt.notEquals(r) && (e = n, e.pt = new ft(r.x, r.y), n = he(e, !c));
    } else {
      for (; e.next.pt.x.greaterThanOrEqual(r.x) && e.next.pt.x.lessThanOrEqual(e.pt.x) && e.next.pt.y.equals(r.y); )
        e = e.next;
      !c && e.pt.x.notEquals(r.x) && (e = e.next), n = he(e, c), n.pt.notEquals(r) && (e = n, e.pt = new ft(r.x, r.y), n = he(e, c));
    }
    if (l == 1) {
      for (; s.next.pt.x.lessThanOrEqual(r.x) && s.next.pt.x.greaterThanOrEqual(s.pt.x) && s.next.pt.y.equals(r.y); )
        s = s.next;
      c && s.pt.x.notEquals(r.x) && (s = s.next), i = he(s, !c), i.pt.notEquals(r) && (s = i, s.pt = new ft(r.x, r.y), i = he(s, !c));
    } else {
      for (; s.next.pt.x.greaterThanOrEqual(r.x) && s.next.pt.x.lessThanOrEqual(s.pt.x) && s.next.pt.y.equals(r.y); )
        s = s.next;
      !c && s.pt.x.notEquals(r.x) && (s = s.next), i = he(s, c), i.pt.notEquals(r) && (s = i, s.pt = new ft(r.x, r.y), i = he(s, c));
    }
    return a == 1 == c ? (e.prev = s, s.next = e, n.next = i, i.prev = n) : (e.next = s, s.prev = e, n.prev = i, i.next = n), !0;
  }
  JoinPoints(e, n, s) {
    let i = e.outPt1, r, c = e.outPt2, a, l = e.outPt1.pt.y.equals(e.offPt.y);
    if (l && e.offPt.equals(e.outPt1.pt) && e.offPt.equals(e.outPt2.pt)) {
      if (n != s)
        return !1;
      for (r = e.outPt1.next; r != i && r.pt.equals(e.offPt); )
        r = r.next;
      let h = r.pt.y.greaterThan(e.offPt.y);
      for (a = e.outPt2.next; a != c && a.pt.equals(e.offPt); )
        a = a.next;
      let u = a.pt.y.greaterThan(e.offPt.y);
      return h == u ? !1 : h ? (r = he(i, !1), a = he(c, !0), i.prev = c, c.next = i, r.next = a, a.prev = r, e.outPt1 = i, e.outPt2 = r, !0) : (r = he(i, !0), a = he(c, !1), i.next = c, c.prev = i, r.prev = a, a.next = r, e.outPt1 = i, e.outPt2 = r, !0);
    } else if (l) {
      for (r = i; i.prev.pt.y.equals(i.pt.y) && i.prev != r && i.prev != c; )
        i = i.prev;
      for (; r.next.pt.y.equals(r.pt.y) && r.next != i && r.next != c; )
        r = r.next;
      if (r.next == i || r.next == c)
        return !1;
      for (a = c; c.prev.pt.y.equals(c.pt.y) && c.prev != a && c.prev != r; )
        c = c.prev;
      for (; a.next.pt.y.equals(a.pt.y) && a.next != c && a.next != i; )
        a = a.next;
      if (a.next == c || a.next == i)
        return !1;
      let h = Ch(i.pt.x, r.pt.x, c.pt.x, a.pt.x);
      if (!h.r)
        return !1;
      let u = h.Left, f = h.Right, d, y;
      return i.pt.x.greaterThanOrEqual(u) && i.pt.x.lessThanOrEqual(f) ? (d = i.pt, y = i.pt.x.greaterThan(r.pt.x)) : c.pt.x.greaterThanOrEqual(u) && c.pt.x.lessThanOrEqual(f) ? (d = c.pt, y = c.pt.x.greaterThan(a.pt.x)) : r.pt.x.greaterThanOrEqual(u) && r.pt.x.lessThanOrEqual(f) ? (d = r.pt, y = r.pt.x.greaterThan(i.pt.x)) : (d = a.pt, y = a.pt.x.greaterThan(c.pt.x)), e.outPt1 = i, e.outPt2 = c, this.JoinHorz(i, r, c, a, d, y);
    } else {
      for (r = i.next; r.pt.equals(i.pt) && r != i; )
        r = r.next;
      let h = r.pt.y.greaterThan(i.pt.y) || !Hn(i.pt, r.pt, e.offPt, this.m_UseFullRange);
      if (h) {
        for (r = i.prev; r.pt.equals(i.pt) && r != i; )
          r = r.prev;
        if (r.pt.y.greaterThan(i.pt.y) || !Hn(i.pt, r.pt, e.offPt, this.m_UseFullRange))
          return !1;
      }
      for (a = c.next; a.pt.equals(c.pt) && a != c; )
        a = a.next;
      let u = a.pt.y.greaterThan(c.pt.y) || !Hn(c.pt, a.pt, e.offPt, this.m_UseFullRange);
      if (u) {
        for (a = c.prev; a.pt.equals(c.pt) && a != c; )
          a = a.prev;
        if (a.pt.y.greaterThan(c.pt.y) || !Hn(c.pt, a.pt, e.offPt, this.m_UseFullRange))
          return !1;
      }
      return r == i || a == c || r == a || n == s && h == u ? !1 : h ? (r = he(i, !1), a = he(c, !0), i.prev = c, c.next = i, r.next = a, a.prev = r, e.outPt1 = i, e.outPt2 = r, !0) : (r = he(i, !0), a = he(c, !1), i.next = c, c.prev = i, r.prev = a, a.next = r, e.outPt1 = i, e.outPt2 = r, !0);
    }
  }
  FixupFirstLefts1(e, n) {
    for (let s of this.m_PolyOuts) {
      let i = Zi(s.firstLeft);
      s.pts != null && i == e && mn(s.pts, n.pts) && (s.firstLeft = n);
    }
  }
  FixupFirstLefts2(e, n) {
    let s = n.firstLeft;
    for (let i of this.m_PolyOuts) {
      if (i.pts == null || i == n || i == e)
        continue;
      let r = Zi(i.firstLeft);
      r != s && r != e && r != n || (mn(i.pts, e.pts) ? i.firstLeft = e : mn(i.pts, n.pts) ? i.firstLeft = n : (i.firstLeft == e || i.firstLeft == n) && (i.firstLeft = s));
    }
  }
  FixupFirstLefts3(e, n) {
    for (let s of this.m_PolyOuts) {
      let i = Zi(s.firstLeft);
      s.pts != null && i == e && (s.firstLeft = n);
    }
  }
  JoinCommonEdges() {
    for (let e of this.m_Joins) {
      let n = this.GetOutRec(e.outPt1.idx), s = this.GetOutRec(e.outPt2.idx);
      if (n.pts == null || s.pts == null || n.isOpen || s.isOpen)
        continue;
      let i;
      n == s ? i = n : ci(n, s) ? i = s : ci(s, n) ? i = n : i = Ao(n, s), this.JoinPoints(e, n, s) && (n == s ? (n.pts = e.outPt1, n.bottomPt = null, s = this.CreateOutRec(), s.pts = e.outPt2, Oo(s), mn(s.pts, n.pts) ? (s.isHole = !n.isHole, s.firstLeft = n, this.m_UsingPolyTree && this.FixupFirstLefts2(s, n), Ji(s.isHole, this.ReverseSolution) == mi(s) > 0 && ss(s.pts)) : mn(n.pts, s.pts) ? (s.isHole = n.isHole, n.isHole = !s.isHole, s.firstLeft = n.firstLeft, n.firstLeft = s, this.m_UsingPolyTree && this.FixupFirstLefts2(n, s), Ji(n.isHole, this.ReverseSolution) == mi(n) > 0 && ss(n.pts)) : (s.isHole = n.isHole, s.firstLeft = n.firstLeft, this.m_UsingPolyTree && this.FixupFirstLefts1(n, s))) : (s.pts = null, s.bottomPt = null, s.idx = n.idx, n.isHole = i.isHole, i == s && (n.firstLeft = s.firstLeft), s.firstLeft = n, this.m_UsingPolyTree && this.FixupFirstLefts3(s, n)));
    }
  }
  DoSimplePolygons() {
    let e = 0;
    for (; e < this.m_PolyOuts.length; ) {
      let n = this.m_PolyOuts[e++], s = n.pts;
      if (!(s == null || n.isOpen))
        do {
          let i = s.next;
          for (; i != n.pts; ) {
            if (s.pt.equals(i.pt) && i.next != s && i.prev != s) {
              let r = s.prev, c = i.prev;
              s.prev = c, c.next = s, i.prev = r, r.next = i, n.pts = s;
              let a = this.CreateOutRec();
              a.pts = i, Oo(a), mn(a.pts, n.pts) ? (a.isHole = !n.isHole, a.firstLeft = n, this.m_UsingPolyTree && this.FixupFirstLefts2(a, n)) : mn(n.pts, a.pts) ? (a.isHole = n.isHole, n.isHole = !a.isHole, a.firstLeft = n.firstLeft, n.firstLeft = a, this.m_UsingPolyTree && this.FixupFirstLefts2(n, a)) : (a.isHole = n.isHole, a.firstLeft = n.firstLeft, this.m_UsingPolyTree && this.FixupFirstLefts1(n, a)), i = s;
            }
            i = i.next;
          }
          s = s.next;
        } while (s != n.pts);
    }
  }
  // SimplifyPolygon functions ...
  // Convert self-intersecting polygons into simple polygons
  static SimplifyPolygon(e, n = 0) {
    let s = new Array(), i = new Kt();
    return i.StrictlySimple = !0, i.AddPath(e, 0, !0), i.ExecutePaths(1, s, n, n), s;
  }
  static SimplifyPolygons(e, n = 0) {
    let s = new Array(), i = new Kt();
    return i.StrictlySimple = !0, i.AddPaths(e, 0, !0), i.ExecutePaths(1, s, n, n), s;
  }
  static CleanPolygon(e, n = 1.415) {
    let s = e.length, i = new Array();
    if (s == 0)
      return i;
    let r = new Array(s);
    for (let l = 0; l < s; ++l)
      r[l] = new jn();
    for (let l = 0; l < s; ++l)
      r[l].pt = new ft(e[l].x, e[l].y), r[l].next = r[(l + 1) % s], r[l].next.prev = r[l], r[l].idx = 0;
    let c = n * n, a = r[0];
    for (; a.idx == 0 && a.next != a.prev; )
      ko(a.pt, a.prev.pt, c) ? (a = li(a), s--) : ko(a.prev.pt, a.next.pt, c) ? (li(a.next), a = li(a), s -= 2) : Vh(a.prev.pt, a.pt, a.next.pt, c) ? (a = li(a), s--) : (a.idx = 1, a = a.next);
    s < 3 && (s = 0);
    for (let l = 0; l < s; ++l)
      i.push(a.pt), a = a.next;
    return r = null, i;
  }
  static CleanPolygons(e, n = 1.415) {
    let s = new Array();
    for (let i of e)
      s.push(Kt.CleanPolygon(i, n));
    return s;
  }
  static Minkowski(e, n, s, i) {
    let r = i ? 1 : 0, c = e.length, a = n.length, l = new Array();
    if (s)
      for (let u = 0; u < a; u++) {
        let f = new Array();
        for (let d of e)
          f.push(new ft(n[u].x.add(d.x), n[u].y.add(d.y)));
        l.push(f);
      }
    else
      for (let u = 0; u < a; u++) {
        let f = new Array();
        for (let d of e)
          f.push(new ft(n[u].x.sub(d.x), n[u].y.sub(d.y)));
        l.push(f);
      }
    let h = new Array();
    for (let u = 0; u < a - 1 + r; u++)
      for (let f = 0; f < c; f++) {
        let d = new Array(4);
        d[0] = l[u % a][f % c], d[1] = l[(u + 1) % a][f % c], d[2] = l[(u + 1) % a][(f + 1) % c], d[3] = l[u % a][(f + 1) % c], vs(d) || d.reverse(), h.push(d);
      }
    return h;
  }
  static MinkowskiSumPath(e, n, s) {
    let i = Kt.Minkowski(e, n, !0, s), r = new Kt();
    return r.AddPaths(i, 0, !0), r.ExecutePaths(
      1,
      i,
      1,
      1
      /* pftNonZero */
    ), i;
  }
  static TranslatePath(e, n) {
    let s = new Array(e.length);
    for (let i = 0; i < e.length; i++)
      s[i] = new ft(e[i].x.add(n.x), e[i].y.add(n.y));
    return s;
  }
  static MinkowskiSumPaths(e, n, s) {
    let i = new Array(), r = new Kt();
    for (let c = 0; c < n.length; ++c) {
      let a = Kt.Minkowski(e, n[c], !0, s);
      if (r.AddPaths(a, 0, !0), s) {
        let l = Kt.TranslatePath(n[c], e[0]);
        r.AddPath(l, 1, !0);
      }
    }
    return r.ExecutePaths(
      1,
      i,
      1,
      1
      /* pftNonZero */
    ), i;
  }
  static MinkowskiDiff(e, n) {
    let s = Kt.Minkowski(e, n, !1, !0), i = new Kt();
    return i.AddPaths(s, 0, !0), i.ExecutePaths(
      1,
      s,
      1,
      1
      /* pftNonZero */
    ), s;
  }
  static PolyTreeToPaths(e) {
    let n = new Array();
    return Kt.AddPolyNodeToPaths(e, 0, n), n;
  }
  static AddPolyNodeToPaths(e, n, s) {
    let i = !0;
    switch (n) {
      case 1:
        return;
      case 2:
        i = !e.isOpen;
        break;
    }
    e.polygon.length > 0 && i && s.push(e.polygon);
    for (let r of e.children)
      Kt.AddPolyNodeToPaths(r, n, s);
  }
  static OpenPathsFromPolyTree(e) {
    let n = new Array();
    for (let s of e.children)
      s.isOpen && n.push(s.polygon);
    return n;
  }
  static ClosedPathsFromPolyTree(e) {
    let n = new Array();
    return Kt.AddPolyNodeToPaths(e, 2, n), n;
  }
}
class Xh {
  m_destPolys;
  m_srcPoly;
  m_destPoly;
  m_normals = new Array();
  m_delta;
  m_sinA;
  m_sin;
  m_cos;
  m_miterLim;
  m_StepsPerRad;
  m_lowest;
  m_polyNodes = new qs();
  ArcTolerance;
  MiterLimit;
  constructor(e = 2, n = ii) {
    this.MiterLimit = e, this.ArcTolerance = n, this.m_lowest.x = -1;
  }
  clear() {
    this.m_polyNodes.children.length = 0, this.m_lowest.x = -1;
  }
  AddPath(e, n, s) {
    let i = e.length - 1;
    if (i < 0)
      return;
    let r = new qs();
    if (r.joinType = n, r.endType = s, s == 1 || s == 0)
      for (; i > 0 && e[0] == e[i]; )
        i--;
    r.polygon.push(e[0]);
    let c = 0, a = 0;
    for (let l = 1; l <= i; l++)
      r.polygon[c] != e[l] && (c++, r.polygon.push(e[l]), (e[l].y.greaterThan(r.polygon[a].y) || e[l].y.equals(r.polygon[a].y) && e[l].x.lessThan(r.polygon[a].x)) && (a = c));
    if (!(s == 0 && c < 2) && (this.m_polyNodes.addChild(r), s == 0))
      if (this.m_lowest.x < 0)
        this.m_lowest = { x: this.m_polyNodes.childCount - 1, y: a };
      else {
        let l = this.m_polyNodes.children[this.m_lowest.x].polygon[this.m_lowest.y];
        (r.polygon[a].y.greaterThan(l.y) || r.polygon[a].y.equals(l.y) && r.polygon[a].x.lessThan(l.x)) && (this.m_lowest = { x: this.m_polyNodes.childCount - 1, y: a });
      }
  }
  AddPaths(e, n, s) {
    for (let i of e)
      this.AddPath(i, n, s);
  }
  FixOrientations() {
    if (this.m_lowest.x >= 0 && !vs(this.m_polyNodes.children[this.m_lowest.x].polygon))
      for (let e = 0; e < this.m_polyNodes.childCount; e++) {
        let n = this.m_polyNodes.children[e];
        (n.endType == 0 || n.endType == 1 && vs(n.polygon)) && n.polygon.reverse();
      }
    else
      for (let e = 0; e < this.m_polyNodes.childCount; e++) {
        let n = this.m_polyNodes.children[e];
        n.endType == 1 && !vs(n.polygon) && n.polygon.reverse();
      }
  }
  DoOffset(e) {
    if (this.m_destPolys = new Array(), this.m_delta = e, Ih(e)) {
      for (let i = 0; i < this.m_polyNodes.childCount; i++) {
        let r = this.m_polyNodes.children[i];
        r.endType == 0 && this.m_destPolys.push(r.polygon);
      }
      return;
    }
    this.MiterLimit > 2 ? this.m_miterLim = 2 / (this.MiterLimit * this.MiterLimit) : this.m_miterLim = 0.5;
    let n;
    this.ArcTolerance <= 0 ? n = ii : this.ArcTolerance > Math.abs(e) * ii ? n = Math.abs(e) * ii : n = this.ArcTolerance;
    let s = Math.PI / Math.acos(1 - n / Math.abs(e));
    this.m_sin = Math.sin(Xi / s), this.m_cos = Math.cos(Xi / s), this.m_StepsPerRad = s / Xi, e < 0 && (this.m_sin = -this.m_sin);
    for (let i = 0; i < this.m_polyNodes.childCount; i++) {
      let r = this.m_polyNodes.children[i];
      this.m_srcPoly = r.polygon;
      let c = this.m_srcPoly.length;
      if (!(c == 0 || e <= 0 && (c < 3 || r.endType != 0))) {
        if (this.m_destPoly = new Array(), c == 1) {
          if (r.joinType == 1) {
            let a = 1, l = 0;
            for (let h = 1; h <= s; h++) {
              this.m_destPoly.push(
                new ft(
                  this.m_srcPoly[0].x.add(ot.fromRoundNumber(a * e)),
                  this.m_srcPoly[0].y.add(ot.fromRoundNumber(l * e))
                )
              );
              let u = a;
              a = a * this.m_cos - this.m_sin * l, l = u * this.m_sin + l * this.m_cos;
            }
          } else {
            let a = -1, l = -1;
            for (let h = 0; h < 4; ++h)
              this.m_destPoly.push(
                new ft(
                  this.m_srcPoly[0].x.add(ot.fromRoundNumber(a * e)),
                  this.m_srcPoly[0].y.add(ot.fromRoundNumber(l * e))
                )
              ), a < 0 ? a = 1 : l < 0 ? l = 1 : a = -1;
          }
          this.m_destPolys.push(this.m_destPoly);
          continue;
        }
        this.m_normals.length = 0;
        for (let a = 0; a < c - 1; a++)
          this.m_normals.push(
            Ro(this.m_srcPoly[a], this.m_srcPoly[a + 1])
          );
        if (r.endType == 1 || r.endType == 0 ? this.m_normals.push(
          Ro(this.m_srcPoly[c - 1], this.m_srcPoly[0])
        ) : this.m_normals.push(
          new Fe(this.m_normals[c - 2].x, this.m_normals[c - 2].y)
        ), r.endType == 0) {
          let a = c - 1;
          for (let l = 0; l < c; l++)
            a = this.OffsetPoint(l, a, r.joinType);
          this.m_destPolys.push(this.m_destPoly);
        } else if (r.endType == 1) {
          let a = c - 1;
          for (let h = 0; h < c; h++)
            a = this.OffsetPoint(h, a, r.joinType);
          this.m_destPolys.push(this.m_destPoly), this.m_destPoly = new Array();
          let l = this.m_normals[c - 1];
          for (let h = c - 1; h > 0; h--)
            this.m_normals[h] = new Fe(-this.m_normals[h - 1].x, -this.m_normals[h - 1].y);
          this.m_normals[0] = new Fe(-l.x, -l.y), a = 0;
          for (let h = c - 1; h >= 0; h--)
            a = this.OffsetPoint(h, a, r.joinType);
          this.m_destPolys.push(this.m_destPoly);
        } else {
          let a = 0;
          for (let h = 1; h < c - 1; ++h)
            a = this.OffsetPoint(h, a, r.joinType);
          let l;
          if (r.endType == 2) {
            let h = c - 1;
            l = new ft(
              this.m_srcPoly[h].x.add(ot.fromRoundNumber(this.m_normals[h].x * e)),
              this.m_srcPoly[h].y.add(ot.fromRoundNumber(this.m_normals[h].y * e))
            ), this.m_destPoly.push(l), l = new ft(
              this.m_srcPoly[h].x.sub(ot.fromRoundNumber(this.m_normals[h].x * e)),
              this.m_srcPoly[h].y.sub(ot.fromRoundNumber(this.m_normals[h].y * e))
            ), this.m_destPoly.push(l);
          } else {
            let h = c - 1;
            a = c - 2, this.m_sinA = 0, this.m_normals[h] = new Fe(-this.m_normals[h].x, -this.m_normals[h].y), r.endType == 3 ? this.DoSquare(h, a) : this.DoRound(h, a);
          }
          for (let h = c - 1; h > 0; h--)
            this.m_normals[h] = new Fe(-this.m_normals[h - 1].x, -this.m_normals[h - 1].y);
          this.m_normals[0] = new Fe(-this.m_normals[1].x, -this.m_normals[1].y), a = c - 1;
          for (let h = a - 1; h > 0; --h)
            a = this.OffsetPoint(h, a, r.joinType);
          r.endType == 2 ? (l = new ft(
            this.m_srcPoly[0].x.sub(ot.fromRoundNumber(this.m_normals[0].x * e)),
            this.m_srcPoly[0].y.sub(ot.fromRoundNumber(this.m_normals[0].y * e))
          ), this.m_destPoly.push(l), l = new ft(
            this.m_srcPoly[0].x.add(ot.fromRoundNumber(this.m_normals[0].x * e)),
            this.m_srcPoly[0].y.add(ot.fromRoundNumber(this.m_normals[0].y * e))
          ), this.m_destPoly.push(l)) : (a = 1, this.m_sinA = 0, r.endType == 3 ? this.DoSquare(0, 1) : this.DoRound(0, 1)), this.m_destPolys.push(this.m_destPoly);
        }
      }
    }
  }
  Execute(e, n) {
    return e instanceof Array ? this.ExecutePaths(e, n) : this.ExecutePolyTree(e, n);
  }
  ExecutePaths(e, n) {
    e.length = 0, this.FixOrientations(), this.DoOffset(n);
    let s = new Kt();
    if (s.AddPaths(this.m_destPolys, 0, !0), n > 0)
      s.ExecutePaths(
        1,
        e,
        2,
        2
        /* pftPositive */
      );
    else {
      let i = Kt.GetBounds(this.m_destPolys), r = new Array(4), c = ot.fromInt(10);
      r[0] = new ft(i.left.sub(c), i.bottom.add(c)), r[1] = new ft(i.right.add(c), i.bottom.add(c)), r[2] = new ft(i.right.add(c), i.top.sub(c)), r[3] = new ft(i.left.sub(c), i.top.sub(c)), s.AddPath(r, 0, !0), s.ReverseSolution = !0, s.ExecutePaths(
        1,
        e,
        3,
        3
        /* pftNegative */
      ), e.length > 0 && e.splice(0, 1);
    }
  }
  ExecutePolyTree(e, n) {
    e.clear(), this.FixOrientations(), this.DoOffset(n);
    let s = new Kt();
    if (s.AddPaths(this.m_destPolys, 0, !0), n > 0)
      s.ExecutePolyTree(
        1,
        e,
        2,
        2
        /* pftPositive */
      );
    else {
      let i = Kt.GetBounds(this.m_destPolys), r = new Array(4), c = ot.fromInt(10);
      if (r[0] = new ft(i.left.sub(c), i.bottom.add(c)), r[1] = new ft(i.right.add(c), i.bottom.add(c)), r[2] = new ft(i.right.add(c), i.top.sub(c)), r[3] = new ft(i.left.sub(c), i.top.sub(c)), s.AddPath(r, 0, !0), s.ReverseSolution = !0, s.ExecutePolyTree(
        1,
        e,
        3,
        3
        /* pftNegative */
      ), e.childCount == 1 && e.children[0].childCount > 0) {
        let a = e.children[0];
        e.children[0] = a.children[0], e.children[0].parent = e;
        for (let l = 1; l < a.childCount; l++)
          e.addChild(a.children[l]);
      } else
        e.clear();
    }
  }
  OffsetPoint(e, n, s) {
    if (this.m_sinA = this.m_normals[n].x * this.m_normals[e].y - this.m_normals[e].x * this.m_normals[n].y, Math.abs(this.m_sinA * this.m_delta) < 1) {
      if (this.m_normals[n].x * this.m_normals[e].x + this.m_normals[e].y * this.m_normals[n].y > 0)
        return this.m_destPoly.push(
          new ft(
            this.m_srcPoly[e].x.add(ot.fromRoundNumber(this.m_normals[n].x * this.m_delta)),
            this.m_srcPoly[e].y.add(ot.fromRoundNumber(this.m_normals[n].y * this.m_delta))
          )
        ), n;
    } else this.m_sinA > 1 ? this.m_sinA = 1 : this.m_sinA < -1 && (this.m_sinA = -1);
    if (this.m_sinA * this.m_delta < 0)
      this.m_destPoly.push(
        new ft(
          this.m_srcPoly[e].x.add(ot.fromRoundNumber(this.m_normals[n].x * this.m_delta)),
          this.m_srcPoly[e].y.add(ot.fromRoundNumber(this.m_normals[n].y * this.m_delta))
        )
      ), this.m_destPoly.push(this.m_srcPoly[e]), this.m_destPoly.push(
        new ft(
          this.m_srcPoly[e].x.add(ot.fromRoundNumber(this.m_normals[e].x * this.m_delta)),
          this.m_srcPoly[e].y.add(ot.fromRoundNumber(this.m_normals[e].y * this.m_delta))
        )
      );
    else
      switch (s) {
        case 2:
          let i = 1 + (this.m_normals[e].x * this.m_normals[n].x + this.m_normals[e].y * this.m_normals[n].y);
          i >= this.m_miterLim ? this.DoMiter(e, n, i) : this.DoSquare(e, n);
          break;
        case 0:
          this.DoSquare(e, n);
          break;
        case 1:
          this.DoRound(e, n);
          break;
      }
    return n = e, n;
  }
  DoSquare(e, n) {
    let s = Math.tan(
      Math.atan2(
        this.m_sinA,
        this.m_normals[n].x * this.m_normals[e].x + this.m_normals[n].y * this.m_normals[e].y
      ) / 4
    );
    this.m_destPoly.push(
      new ft(
        this.m_srcPoly[e].x.add(ot.fromRoundNumber(this.m_delta * (this.m_normals[n].x - this.m_normals[n].y * s))),
        this.m_srcPoly[e].y.add(ot.fromRoundNumber(this.m_delta * (this.m_normals[n].y - this.m_normals[n].x * s)))
      )
    ), this.m_destPoly.push(
      new ft(
        this.m_srcPoly[e].x.add(ot.fromRoundNumber(this.m_delta * (this.m_normals[e].x - this.m_normals[e].y * s))),
        this.m_srcPoly[e].y.add(ot.fromRoundNumber(this.m_delta * (this.m_normals[e].y - this.m_normals[e].x * s)))
      )
    );
  }
  DoMiter(e, n, s) {
    let i = this.m_delta / s;
    this.m_destPoly.push(
      new ft(
        this.m_srcPoly[e].x.add(ot.fromRoundNumber((this.m_normals[n].x + this.m_normals[e].x) * i)),
        this.m_srcPoly[e].y.add(ot.fromRoundNumber((this.m_normals[n].y + this.m_normals[e].y) * i))
      )
    );
  }
  DoRound(e, n) {
    let s = Math.atan2(
      this.m_sinA,
      this.m_normals[n].x * this.m_normals[e].x + this.m_normals[n].y * this.m_normals[e].y
    ), i = Math.max(Math.round(this.m_StepsPerRad * Math.abs(s)), 1), r = this.m_normals[n].x, c = this.m_normals[n].y, a;
    for (let l = 0; l < i; ++l)
      this.m_destPoly.push(
        new ft(
          this.m_srcPoly[e].x.add(ot.fromRoundNumber(r * this.m_delta)),
          this.m_srcPoly[e].y.add(ot.fromRoundNumber(c * this.m_delta))
        )
      ), a = r, r = r * this.m_cos - this.m_sin * c, c = a * this.m_sin + c * this.m_cos;
    this.m_destPoly.push(
      new ft(
        this.m_srcPoly[e].x.add(ot.fromRoundNumber(this.m_normals[e].x * this.m_delta)),
        this.m_srcPoly[e].y.add(ot.fromRoundNumber(this.m_normals[e].y * this.m_delta))
      )
    );
  }
}
const D1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ClipType: ia,
  Clipper: Kt,
  ClipperOffset: Xh,
  EndType: aa,
  IntPoint: ft,
  IntRect: Is,
  JoinType: oa,
  Orientation: vs,
  PolyFillType: ca,
  PolyNode: qs,
  PolyTree: la,
  PolyType: ra
}, Symbol.toStringTag, { value: "Module" })), is = {
  a: 7,
  // arc: rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y
  c: 6,
  // cubic curve: x1, y1, x2, y2, x, y
  h: 1,
  // horizontal line: x
  l: 2,
  // line: x, y
  m: 2,
  // move: x, y
  q: 4,
  // quadratic curve: x1, y1, x, y
  s: 4,
  // smooth cubic curve: x2, y2, x, y
  t: 2,
  // smooth quadratic curve: x, y
  v: 1,
  // vertical line: y
  z: 0
  // close path: no arguments
}, Wh = /([astvzqmhlc])([^astvzqmhlc]*)/gi, $h = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;
function jh(o) {
  const e = o.match($h);
  return e ? e.map(Number) : [];
}
function xa(o) {
  const e = [], n = String(o).trim();
  return n[0] !== "M" && n[0] !== "m" || n.replace(Wh, (s, i, r) => {
    const c = jh(r);
    let a = i.toLowerCase(), l = i;
    if (a === "m" && c.length > 2 && (e.push([l, ...c.splice(0, 2)]), a = "l", l = l === "m" ? "l" : "L"), c.length < is[a])
      return "";
    for (e.push([l, ...c.splice(0, is[a])]); c.length >= is[a] && c.length && is[a]; )
      e.push([l, ...c.splice(0, is[a])]);
    return "";
  }), e;
}
function Fo(o, e) {
  const n = o.x * Math.cos(e) - o.y * Math.sin(e), s = o.y * Math.cos(e) + o.x * Math.sin(e);
  o.x = n, o.y = s;
}
function Gh(o, e, n) {
  o.x += e, o.y += n;
}
function zo(o, e) {
  o.x *= e, o.y *= e;
}
let gi = class _r {
  /** Internal storage for path commands */
  #t;
  /**
   * Creates a new Path2D object.
   *
   * @param path - Optional path to initialize from. Can be another Path2D object or an SVG path string
   *
   * @example
   * ```typescript
   * // Empty path
   * const path1 = new Path2D();
   *
   * // From SVG path string
   * const path2 = new Path2D("M10,10 L100,100 Z");
   *
   * // Copy from another Path2D
   * const path3 = new Path2D(path1);
   * ```
   */
  constructor(e) {
    this.#t = [], e && e instanceof _r ? this.#t.push(...e.#t) : typeof e == "string" && (this.#t = xa(e));
  }
  /**
   * Adds a custom command to the path's command list.
   * This is primarily used internally for extending functionality.
   *
   * @param command - The path command to add
   */
  addCustomCommand(e) {
    this.#t.push(e);
  }
  /**
   * Adds the commands from another Path2D object to this path.
   *
   * @param path - The Path2D object whose commands should be added to this path
   *
   * @example
   * ```typescript
   * const path1 = new Path2D("M10,10 L20,20");
   * const path2 = new Path2D("L30,30 Z");
   * path1.addPath(path2); // path1 now contains both sets of commands
   * ```
   */
  addPath(e) {
    e && e instanceof _r && this.#t.push(...e.#t);
  }
  /**
   * Moves the starting point of a new sub-path to the specified coordinates.
   *
   * @param x - The x-coordinate of the new starting point
   * @param y - The y-coordinate of the new starting point
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.moveTo(10, 10);
   * ```
   */
  moveTo(e, n) {
    this.#t.push(["M", e, n]);
  }
  /**
   * Connects the last point in the current sub-path to the specified coordinates with a straight line.
   *
   * @param x - The x-coordinate of the end point
   * @param y - The y-coordinate of the end point
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.moveTo(10, 10);
   * path.lineTo(100, 100);
   * ```
   */
  lineTo(e, n) {
    this.#t.push(["L", e, n]);
  }
  /**
   * Adds a circular arc to the current path.
   *
   * @param x - The x-coordinate of the arc's center
   * @param y - The y-coordinate of the arc's center
   * @param radius - The arc's radius
   * @param startAngle - The starting angle in radians
   * @param endAngle - The ending angle in radians
   * @param counterclockwise - Whether the arc should be drawn counterclockwise (default: false)
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.arc(50, 50, 25, 0, Math.PI * 2); // Full circle
   * path.arc(100, 100, 30, 0, Math.PI, true); // Half circle, counterclockwise
   * ```
   */
  arc(e, n, s, i, r, c) {
    this.#t.push(["AC", e, n, s, i, r, !!c]);
  }
  /**
   * Adds an arc to the current path with the given control points and radius.
   *
   * @param x1 - The x-coordinate of the first control point
   * @param y1 - The y-coordinate of the first control point
   * @param x2 - The x-coordinate of the second control point
   * @param y2 - The y-coordinate of the second control point
   * @param r - The arc's radius
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.moveTo(20, 20);
   * path.arcTo(100, 20, 100, 100, 50);
   * ```
   */
  arcTo(e, n, s, i, r) {
    this.#t.push(["AT", e, n, s, i, r]);
  }
  /**
   * Adds an elliptical arc to the current path.
   *
   * @param x - The x-coordinate of the ellipse's center
   * @param y - The y-coordinate of the ellipse's center
   * @param radiusX - The ellipse's major-axis radius
   * @param radiusY - The ellipse's minor-axis radius
   * @param rotation - The rotation angle of the ellipse in radians
   * @param startAngle - The starting angle in radians
   * @param endAngle - The ending angle in radians
   * @param counterclockwise - Whether the arc should be drawn counterclockwise (default: false)
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.ellipse(50, 50, 30, 20, Math.PI / 4, 0, Math.PI * 2);
   * ```
   */
  ellipse(e, n, s, i, r, c, a, l) {
    this.#t.push(["E", e, n, s, i, r, c, a, !!l]);
  }
  /**
   * Closes the current sub-path by connecting the last point to the first point with a straight line.
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.moveTo(10, 10);
   * path.lineTo(100, 10);
   * path.lineTo(100, 100);
   * path.closePath(); // Creates a triangle
   * ```
   */
  closePath() {
    this.#t.push(["Z"]);
  }
  /**
   * Adds a cubic Bézier curve to the current path.
   *
   * @param cp1x - The x-coordinate of the first control point
   * @param cp1y - The y-coordinate of the first control point
   * @param cp2x - The x-coordinate of the second control point
   * @param cp2y - The y-coordinate of the second control point
   * @param x - The x-coordinate of the end point
   * @param y - The y-coordinate of the end point
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.moveTo(20, 20);
   * path.bezierCurveTo(20, 100, 200, 100, 200, 20);
   * ```
   */
  bezierCurveTo(e, n, s, i, r, c) {
    this.#t.push(["C", e, n, s, i, r, c]);
  }
  /**
   * Adds a quadratic Bézier curve to the current path.
   *
   * @param cpx - The x-coordinate of the control point
   * @param cpy - The y-coordinate of the control point
   * @param x - The x-coordinate of the end point
   * @param y - The y-coordinate of the end point
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.moveTo(20, 20);
   * path.quadraticCurveTo(100, 100, 200, 20);
   * ```
   */
  quadraticCurveTo(e, n, s, i) {
    this.#t.push(["Q", e, n, s, i]);
  }
  /**
   * Adds a rectangle to the current path.
   *
   * @param x - The x-coordinate of the rectangle's top-left corner
   * @param y - The y-coordinate of the rectangle's top-left corner
   * @param width - The rectangle's width
   * @param height - The rectangle's height
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.rect(10, 10, 100, 50);
   * ```
   */
  rect(e, n, s, i) {
    this.#t.push(["R", e, n, s, i]);
  }
  /**
   * Adds a rounded rectangle to the current path.
   *
   * @param x - The x-coordinate of the rectangle's top-left corner
   * @param y - The y-coordinate of the rectangle's top-left corner
   * @param w - The rectangle's width
   * @param h - The rectangle's height
   * @param radii - The corner radii. Can be a number, DOMPointInit, or array of up to 4 values
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.roundRect(10, 10, 100, 50, 10); // All corners with radius 10
   * path.roundRect(10, 70, 100, 50, [10, 20]); // Different horizontal/vertical radii
   * path.roundRect(10, 130, 100, 50, [5, 10, 15, 20]); // Each corner different
   * ```
   */
  roundRect(e, n, s, i, r) {
    typeof r > "u" ? this.#t.push(["RR", e, n, s, i, 0]) : this.#t.push(["RR", e, n, s, i, r]);
  }
  /**
   * Builds the path in a canvas rendering context by executing all stored commands.
   * This method translates the internal path commands into actual canvas drawing operations.
   *
   * @param ctx - The canvas rendering context to draw the path in
   *
   * @internal This method is primarily used internally by the polyfill system
   * to render Path2D objects on contexts that don't natively support them.
   */
  buildPathInCanvas(e) {
    let n = 0, s = 0, i, r, c, a, l, h, u, f, d, y, x, g, w, M, P, S, k, O, R, F, Y, N = null, $ = null, W = null, Q = null, ct = null, K = null;
    e.beginPath();
    for (let j = 0; j < this.#t.length; ++j) {
      O = this.#t[j][0], O !== "S" && O !== "s" && O !== "C" && O !== "c" && (N = null, $ = null), O !== "T" && O !== "t" && O !== "Q" && O !== "q" && (W = null, Q = null);
      let V;
      switch (O) {
        case "m":
        case "M":
          V = this.#t[j], O === "m" ? (n += V[1], s += V[2]) : (n = V[1], s = V[2]), (O === "M" || !ct) && (ct = { x: n, y: s }), e.moveTo(n, s);
          break;
        case "l":
          V = this.#t[j], n += V[1], s += V[2], e.lineTo(n, s);
          break;
        case "L":
          V = this.#t[j], n = V[1], s = V[2], e.lineTo(n, s);
          break;
        case "H":
          V = this.#t[j], n = V[1], e.lineTo(n, s);
          break;
        case "h":
          V = this.#t[j], n += V[1], e.lineTo(n, s);
          break;
        case "V":
          V = this.#t[j], s = V[1], e.lineTo(n, s);
          break;
        case "v":
          V = this.#t[j], s += V[1], e.lineTo(n, s);
          break;
        case "a":
        case "A":
          if (V = this.#t[j], K === null)
            throw new Error("This should never happen");
          O === "a" ? (n += V[6], s += V[7]) : (n = V[6], s = V[7]), M = V[1], P = V[2], u = V[3] * Math.PI / 180, c = !!V[4], a = !!V[5], l = { x: n, y: s }, h = {
            x: (K.x - l.x) / 2,
            y: (K.y - l.y) / 2
          }, Fo(h, -u), f = h.x * h.x / (M * M) + h.y * h.y / (P * P), f > 1 && (f = Math.sqrt(f), M *= f, P *= f), R = {
            x: M * h.y / P,
            y: -(P * h.x) / M
          }, d = M * M * P * P, y = M * M * h.y * h.y + P * P * h.x * h.x, a !== c ? zo(R, Math.sqrt((d - y) / y) || 0) : zo(R, -Math.sqrt((d - y) / y) || 0), r = Math.atan2((h.y - R.y) / P, (h.x - R.x) / M), i = Math.atan2(-(h.y + R.y) / P, -(h.x + R.x) / M), Fo(R, u), Gh(R, (l.x + K.x) / 2, (l.y + K.y) / 2), e.save(), e.translate(R.x, R.y), e.rotate(u), e.scale(M, P), e.arc(0, 0, 1, r, i, !a), e.restore();
          break;
        case "C":
          V = this.#t[j], N = V[3], $ = V[4], n = V[5], s = V[6], e.bezierCurveTo(V[1], V[2], N, $, n, s);
          break;
        case "c":
          V = this.#t[j], e.bezierCurveTo(V[1] + n, V[2] + s, V[3] + n, V[4] + s, V[5] + n, V[6] + s), N = V[3] + n, $ = V[4] + s, n += V[5], s += V[6];
          break;
        case "S":
          V = this.#t[j], (N === null || $ === null) && (N = n, $ = s), e.bezierCurveTo(2 * n - N, 2 * s - $, V[1], V[2], V[3], V[4]), N = V[1], $ = V[2], n = V[3], s = V[4];
          break;
        case "s":
          V = this.#t[j], (N === null || $ === null) && (N = n, $ = s), e.bezierCurveTo(2 * n - N, 2 * s - $, V[1] + n, V[2] + s, V[3] + n, V[4] + s), N = V[1] + n, $ = V[2] + s, n += V[3], s += V[4];
          break;
        case "Q":
          V = this.#t[j], W = V[1], Q = V[2], n = V[3], s = V[4], e.quadraticCurveTo(W, Q, n, s);
          break;
        case "q":
          V = this.#t[j], W = V[1] + n, Q = V[2] + s, n += V[3], s += V[4], e.quadraticCurveTo(W, Q, n, s);
          break;
        case "T":
          V = this.#t[j], (W === null || Q === null) && (W = n, Q = s), W = 2 * n - W, Q = 2 * s - Q, n = V[1], s = V[2], e.quadraticCurveTo(W, Q, n, s);
          break;
        case "t":
          V = this.#t[j], (W === null || Q === null) && (W = n, Q = s), W = 2 * n - W, Q = 2 * s - Q, n += V[1], s += V[2], e.quadraticCurveTo(W, Q, n, s);
          break;
        case "z":
        case "Z":
          ct && (n = ct.x, s = ct.y), ct = null, e.closePath();
          break;
        case "AC":
          V = this.#t[j], n = V[1], s = V[2], w = V[3], r = V[4], i = V[5], F = V[6], e.arc(n, s, w, r, i, F);
          break;
        case "AT":
          V = this.#t[j], x = V[1], g = V[2], n = V[3], s = V[4], w = V[5], e.arcTo(x, g, n, s, w);
          break;
        case "E":
          V = this.#t[j], n = V[1], s = V[2], M = V[3], P = V[4], u = V[5], r = V[6], i = V[7], F = V[8], e.save(), e.translate(n, s), e.rotate(u), e.scale(M, P), e.arc(0, 0, 1, r, i, F), e.restore();
          break;
        case "R":
          V = this.#t[j], n = V[1], s = V[2], S = V[3], k = V[4], ct = { x: n, y: s }, e.rect(n, s, S, k);
          break;
        case "RR":
          V = this.#t[j], n = V[1], s = V[2], S = V[3], k = V[4], Y = V[5], ct = { x: n, y: s }, e.roundRect(n, s, S, k, Y);
          break;
        default:
          throw new Error(`Invalid path command: ${O}`);
      }
      K ? (K.x = n, K.y = s) : K = { x: n, y: s };
    }
  }
};
function Co(o) {
  return o !== null && typeof o == "object" && ("x" in o || "y" in o) && (typeof o.x == "number" || typeof o.y == "number" || typeof o.x > "u" || typeof o.y > "u");
}
function Zh(o) {
  return typeof o == "number" ? { x: o, y: o } : {
    x: typeof o.x == "number" ? o.x : 0,
    y: typeof o.y == "number" ? o.y : 0
  };
}
function $r(o, e, n, s, i = 0) {
  if (typeof i == "number")
    i = [i];
  else if (Co(i))
    i = [i];
  else if (!Array.isArray(i))
    return;
  if (Array.isArray(i)) {
    if (i.length === 0 || i.length > 4)
      throw new RangeError(
        `Failed to execute 'roundRect' on '${this.constructor.name}': ${i.length} radii provided. Between one and four radii are necessary.`
      );
    i.forEach((d) => {
      if (Co(d)) {
        const y = d;
        if (typeof y.x == "number" && y.x < 0)
          throw new RangeError(
            `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${y.x} is negative.`
          );
        if (typeof y.y == "number" && y.y < 0)
          throw new RangeError(
            `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${y.y} is negative.`
          );
      } else {
        if (typeof d != "number")
          throw new TypeError(
            `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value is not a number or DOMPointInit.`
          );
        if (typeof d == "number" && d < 0)
          throw new RangeError(
            `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${d} is negative.`
          );
      }
    });
  }
  const r = i.map(Zh);
  if (i.length === 1 && r[0].x === 0 && r[0].y === 0) {
    this.rect(o, e, n, s);
    return;
  }
  const c = n / 2, a = s / 2, l = {
    x: Math.min(c, r[0].x),
    y: Math.min(a, r[0].y)
  };
  let h = l, u = l, f = l;
  r.length === 2 && (h = { x: Math.min(c, r[1].x), y: Math.min(a, r[1].y) }, f = h), r.length === 3 && (h = { x: Math.min(c, r[1].x), y: Math.min(a, r[1].y) }, f = h, u = { x: Math.min(c, r[2].x), y: Math.min(a, r[2].y) }), r.length === 4 && (h = { x: Math.min(c, r[1].x), y: Math.min(a, r[1].y) }, u = { x: Math.min(c, r[2].x), y: Math.min(a, r[2].y) }, f = { x: Math.min(c, r[3].x), y: Math.min(a, r[3].y) }), this.moveTo(o, e + s - f.y), l.x === l.y && l.x > 0 ? this.arcTo(o, e, o + l.x, e, l.x) : l.x > 0 || l.y > 0 ? this.ellipse(o + l.x, e + l.y, l.x, l.y, 0, Math.PI, Math.PI * 1.5, !1) : this.lineTo(o, e), this.lineTo(o + n - h.x, e), h.x === h.y && h.x > 0 ? this.arcTo(o + n, e, o + n, e + h.y, h.x) : h.x > 0 || h.y > 0 ? this.ellipse(o + n - h.x, e + h.y, h.x, h.y, 0, Math.PI * 1.5, 0, !1) : this.lineTo(o + n, e), this.lineTo(o + n, e + s - u.y), u.x === u.y && u.x > 0 ? this.arcTo(o + n, e + s, o + n - u.x, e + s, u.x) : u.x > 0 || u.y > 0 ? this.ellipse(o + n - u.x, e + s - u.y, u.x, u.y, 0, 0, Math.PI * 0.5, !1) : this.lineTo(o + n, e + s), this.lineTo(o + f.x, e + s), f.x === f.y && f.x > 0 ? this.arcTo(o, e + s, o, e + s - f.y, f.x) : f.x > 0 || f.y > 0 ? this.ellipse(o + f.x, e + s - f.y, f.x, f.y, 0, Math.PI * 0.5, Math.PI, !1) : this.lineTo(o, e + s), this.closePath(), this.moveTo(o, e);
}
function Jh(o) {
  if (!o) return;
  const e = o.prototype.clip, n = o.prototype.fill, s = o.prototype.stroke, i = o.prototype.isPointInPath;
  o.prototype.clip = function(...c) {
    if (c[0] instanceof gi) {
      const l = c[0], h = c[1] !== void 0 ? c[1] : "nonzero";
      l.buildPathInCanvas(this), e.apply(this, [h]);
      return;
    }
    const a = c[0] !== void 0 ? c[0] : "nonzero";
    e.apply(this, [a]);
  }, o.prototype.fill = function(...c) {
    if (c[0] instanceof gi) {
      const l = c[0], h = c[1] !== void 0 ? c[1] : "nonzero";
      l.buildPathInCanvas(this), n.apply(this, [h]);
      return;
    }
    const a = c[0] !== void 0 ? c[0] : "nonzero";
    n.apply(this, [a]);
  }, o.prototype.stroke = function(c) {
    c && c.buildPathInCanvas(this), s.apply(this);
  }, o.prototype.isPointInPath = function(...c) {
    if (c[0] instanceof gi) {
      const a = c[0], l = c[1], h = c[2], u = c[3] !== void 0 ? c[3] : "nonzero";
      return a.buildPathInCanvas(this), i.apply(this, [l, h, u]);
    }
    return i.apply(this, c);
  };
}
function Qh(o) {
  o && !o.prototype.roundRect && (o.prototype.roundRect = $r);
}
function Kh(o) {
  o && !o.prototype.roundRect && (o.prototype.roundRect = $r);
}
const O1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Path2D: gi,
  applyPath2DToCanvasRenderingContext: Jh,
  applyRoundRectToCanvasRenderingContext2D: Qh,
  applyRoundRectToPath2D: Kh,
  parsePath: xa,
  roundRect: $r
}, Symbol.toStringTag, { value: "Module" }));
var me = /* @__PURE__ */ ((o) => (o[o.ODD = 0] = "ODD", o[o.NONZERO = 1] = "NONZERO", o[o.POSITIVE = 2] = "POSITIVE", o[o.NEGATIVE = 3] = "NEGATIVE", o[o.ABS_GEQ_TWO = 4] = "ABS_GEQ_TWO", o))(me || {}), ze = /* @__PURE__ */ ((o) => (o[o.POLYGONS = 0] = "POLYGONS", o[o.CONNECTED_POLYGONS = 1] = "CONNECTED_POLYGONS", o[o.BOUNDARY_CONTOURS = 2] = "BOUNDARY_CONTOURS", o))(ze || {});
function gt(o, e) {
  if (!o)
    throw e || "Assertion Failed!";
}
class nt {
  static vertEq(e, n) {
    return e.s === n.s && e.t === n.t;
  }
  /* Returns TRUE if u is lexicographically <= v. */
  static vertLeq(e, n) {
    return e.s < n.s || e.s === n.s && e.t <= n.t;
  }
  /* Versions of VertLeq, EdgeSign, EdgeEval with s and t transposed. */
  static transLeq(e, n) {
    return e.t < n.t || e.t === n.t && e.s <= n.s;
  }
  static edgeGoesLeft(e) {
    return nt.vertLeq(e.Dst, e.Org);
  }
  static edgeGoesRight(e) {
    return nt.vertLeq(e.Org, e.Dst);
  }
  static vertL1dist(e, n) {
    return Math.abs(e.s - n.s) + Math.abs(e.t - n.t);
  }
  //TESSreal tesedgeEval( TESSvertex *u, TESSvertex *v, TESSvertex *w )
  static edgeEval(e, n, s) {
    gt(nt.vertLeq(e, n) && nt.vertLeq(n, s));
    var i = n.s - e.s, r = s.s - n.s;
    return i + r > 0 ? i < r ? n.t - e.t + (e.t - s.t) * (i / (i + r)) : n.t - s.t + (s.t - e.t) * (r / (i + r)) : 0;
  }
  //TESSreal tesedgeSign( TESSvertex *u, TESSvertex *v, TESSvertex *w )
  static edgeSign(e, n, s) {
    gt(nt.vertLeq(e, n) && nt.vertLeq(n, s));
    var i = n.s - e.s, r = s.s - n.s;
    return i + r > 0 ? (n.t - s.t) * i + (n.t - e.t) * r : 0;
  }
  /***********************************************************************
   * Define versions of EdgeSign, EdgeEval with s and t transposed.
   */
  //TESSreal testransEval( TESSvertex *u, TESSvertex *v, TESSvertex *w )
  static transEval(e, n, s) {
    gt(nt.transLeq(e, n) && nt.transLeq(n, s));
    var i = n.t - e.t, r = s.t - n.t;
    return i + r > 0 ? i < r ? n.s - e.s + (e.s - s.s) * (i / (i + r)) : n.s - s.s + (s.s - e.s) * (r / (i + r)) : 0;
  }
  //TESSreal testransSign( TESSvertex *u, TESSvertex *v, TESSvertex *w )
  static transSign(e, n, s) {
    gt(nt.transLeq(e, n) && nt.transLeq(n, s));
    var i = n.t - e.t, r = s.t - n.t;
    return i + r > 0 ? (n.s - s.s) * i + (n.s - e.s) * r : 0;
  }
  //int tesvertCCW( TESSvertex *u, TESSvertex *v, TESSvertex *w )
  static vertCCW(e, n, s) {
    return e.s * (n.t - s.t) + n.s * (s.t - e.t) + s.s * (e.t - n.t) >= 0;
  }
  /* Given parameters a,x,b,y returns the value (b*x+a*y)/(a+b),
   * or (x+y)/2 if a==b==0.  It requires that a,b >= 0, and enforces
   * this in the rare case that one argument is slightly negative.
   * The implementation is extremely stable numerically.
   * In particular it guarantees that the result r satisfies
   * MIN(x,y) <= r <= MAX(x,y), and the results are very accurate
   * even when a and b differ greatly in magnitude.
   */
  static interpolate(e, n, s, i) {
    return e = e < 0 ? 0 : e, s = s < 0 ? 0 : s, e <= s ? s === 0 ? (n + i) / 2 : n + (i - n) * (e / (e + s)) : i + (n - i) * (s / (e + s));
  }
  /*
  	#ifndef FOR_TRITE_TEST_PROGRAM
  	#define Interpolate(a,x,b,y)	RealInterpolate(a,x,b,y)
  	#else
  
  	// Claim: the ONLY property the sweep algorithm relies on is that
  	// MIN(x,y) <= r <= MAX(x,y).  This is a nasty way to test that.
  	#include <stdlib.h>
  	extern int RandomInterpolate;
  
  	double Interpolate( double a, double x, double b, double y)
  	{
  		printf("*********************%d\n",RandomInterpolate);
  		if( RandomInterpolate ) {
  			a = 1.2 * drand48() - 0.1;
  			a = (a < 0) ? 0 : ((a > 1) ? 1 : a);
  			b = 1.0 - a;
  		}
  		return RealInterpolate(a,x,b,y);
  	}
  	#endif*/
  static intersect(e, n, s, i, r) {
    var c, a, l;
    nt.vertLeq(e, n) || (l = e, e = n, n = l), nt.vertLeq(s, i) || (l = s, s = i, i = l), nt.vertLeq(e, s) || (l = e, e = s, s = l, l = n, n = i, i = l), nt.vertLeq(s, n) ? nt.vertLeq(n, i) ? (c = nt.edgeEval(e, s, n), a = nt.edgeEval(s, n, i), c + a < 0 && (c = -c, a = -a), r.s = nt.interpolate(c, s.s, a, n.s)) : (c = nt.edgeSign(e, s, n), a = -nt.edgeSign(e, i, n), c + a < 0 && (c = -c, a = -a), r.s = nt.interpolate(c, s.s, a, i.s)) : r.s = (s.s + n.s) / 2, nt.transLeq(e, n) || (l = e, e = n, n = l), nt.transLeq(s, i) || (l = s, s = i, i = l), nt.transLeq(e, s) || (l = e, e = s, s = l, l = n, n = i, i = l), nt.transLeq(s, n) ? nt.transLeq(n, i) ? (c = nt.transEval(e, s, n), a = nt.transEval(s, n, i), c + a < 0 && (c = -c, a = -a), r.t = nt.interpolate(c, s.t, a, n.t)) : (c = nt.transSign(e, s, n), a = -nt.transSign(e, i, n), c + a < 0 && (c = -c, a = -a), r.t = nt.interpolate(c, s.t, a, i.t)) : r.t = (s.t + n.t) / 2;
  }
}
class rs {
  next = null;
  /* next face (never NULL) */
  prev = null;
  /* previous face (never NULL) */
  anEdge = null;
  /* a half edge with this left face */
  /* Internal data (keep hidden) */
  trail = null;
  /* "stack" for conversion to strips */
  n = 0;
  /* to allow identiy unique faces */
  marked = !1;
  /* flag for conversion to strips */
  inside = !1;
  /* this face is in the polygon interior */
}
class hi {
  /* change in winding number when crossing from the right face to the left face */
  constructor(e) {
    this.side = e;
  }
  next = null;
  /* doubly-linked list (prev==Sym->next) */
  Org = null;
  /* origin vertex (Overtex too long) */
  Sym = null;
  /* same edge, opposite direction */
  Onext = null;
  /* next edge CCW around origin */
  Lnext = null;
  /* next edge CCW around left face */
  Lface = null;
  /* left face */
  /* Internal data (keep hidden) */
  activeRegion = null;
  /* a region with this upper edge (sweep.c) */
  winding = 0;
  get Rface() {
    return this.Sym.Lface;
  }
  set Rface(e) {
    this.Sym.Lface = e;
  }
  get Dst() {
    return this.Sym.Org;
  }
  set Dst(e) {
    this.Sym.Org = e;
  }
  get Oprev() {
    return this.Sym.Lnext;
  }
  set Oprev(e) {
    this.Sym.Lnext = e;
  }
  get Lprev() {
    return this.Onext.Sym;
  }
  set Lprev(e) {
    this.Onext.Sym = e;
  }
  get Dprev() {
    return this.Lnext.Sym;
  }
  set Dprev(e) {
    this.Lnext.Sym = e;
  }
  get Rprev() {
    return this.Sym.Onext;
  }
  set Rprev(e) {
    this.Sym.Onext = e;
  }
  get Dnext() {
    return this.Sym.Onext.Sym;
  }
  set Dnext(e) {
    this.Sym.Onext.Sym = e;
  }
  get Rnext() {
    return this.Sym.Lnext.Sym;
  }
  set Rnext(e) {
    this.Sym.Lnext.Sym = e;
  }
}
class Bn {
  next = null;
  /* next vertex (never NULL) */
  prev = null;
  /* previous vertex (never NULL) */
  anEdge = null;
  /* a half-edge with this origin */
  /* Internal data (keep hidden) */
  coords = [0, 0, 0];
  /* vertex location in 3D */
  s = 0;
  t = 0;
  /* projection onto the sweep plane */
  pqHandle = 0;
  /* to allow deletion from priority queue */
  n = 0;
  /* to allow identify unique vertices */
  idx = 0;
  /* to allow map result to original verts */
}
class No {
  vHead;
  /* dummy header for vertex list */
  fHead;
  /* dummy header for face list */
  eHead;
  /* dummy header for edge list */
  eHeadSym;
  /* and its symmetric counterpart */
  constructor() {
    const e = new Bn(), n = new rs(), s = new hi(0), i = new hi(1);
    e.next = e.prev = e, e.anEdge = null, n.next = n.prev = n, s.next = s, s.Sym = i, i.next = i, i.Sym = s, this.vHead = e, this.fHead = n, this.eHead = s, this.eHeadSym = i;
  }
  /* MakeEdge creates a new pair of half-edges which form their own loop.
   * No vertex or face structures are allocated, but these must be assigned
   * before the current edge operation is completed.
   */
  //static TESShalfEdge *MakeEdge( TESSmesh* mesh, TESShalfEdge *eNext )
  makeEdge_(e) {
    var n = new hi(0), s = new hi(1);
    e.Sym.side < e.side && (e = e.Sym);
    var i = e.Sym.next;
    return s.next = i, i.Sym.next = n, n.next = e, e.Sym.next = s, n.Sym = s, n.Onext = n, n.Lnext = s, n.Org = null, n.Lface = null, n.winding = 0, n.activeRegion = null, s.Sym = n, s.Onext = s, s.Lnext = n, s.Org = null, s.Lface = null, s.winding = 0, s.activeRegion = null, n;
  }
  /* Splice( a, b ) is best described by the Guibas/Stolfi paper or the
   * CS348a notes (see mesh.h).  Basically it modifies the mesh so that
   * a->Onext and b->Onext are exchanged.  This can have various effects
   * depending on whether a and b belong to different face or vertex rings.
   * For more explanation see tessMeshSplice() below.
   */
  // static void Splice( TESShalfEdge *a, TESShalfEdge *b )
  splice_(e, n) {
    var s = e.Onext, i = n.Onext;
    s.Sym.Lnext = n, i.Sym.Lnext = e, e.Onext = i, n.Onext = s;
  }
  /* MakeVertex( newVertex, eOrig, vNext ) attaches a new vertex and makes it the
   * origin of all edges in the vertex loop to which eOrig belongs. "vNext" gives
   * a place to insert the new vertex in the global vertex list.  We insert
   * the new vertex *before* vNext so that algorithms which walk the vertex
   * list will not see the newly created vertices.
   */
  //static void MakeVertex( TESSvertex *newVertex, TESShalfEdge *eOrig, TESSvertex *vNext )
  makeVertex_(e, n, s) {
    var i = e;
    gt(i, "Vertex can't be null!");
    var r = s.prev;
    i.prev = r, r.next = i, i.next = s, s.prev = i, i.anEdge = n;
    var c = n;
    do
      c.Org = i, c = c.Onext;
    while (c !== n);
  }
  /* MakeFace( newFace, eOrig, fNext ) attaches a new face and makes it the left
   * face of all edges in the face loop to which eOrig belongs.  "fNext" gives
   * a place to insert the new face in the global face list.  We insert
   * the new face *before* fNext so that algorithms which walk the face
   * list will not see the newly created faces.
   */
  // static void MakeFace( TESSface *newFace, TESShalfEdge *eOrig, TESSface *fNext )
  makeFace_(e, n, s) {
    var i = e;
    gt(i, "Face can't be null");
    var r = s.prev;
    i.prev = r, r.next = i, i.next = s, s.prev = i, i.anEdge = n, i.trail = null, i.marked = !1, i.inside = s.inside;
    var c = n;
    do
      c.Lface = i, c = c.Lnext;
    while (c !== n);
  }
  /* KillEdge( eDel ) destroys an edge (the half-edges eDel and eDel->Sym),
   * and removes from the global edge list.
   */
  //static void KillEdge( TESSmesh *mesh, TESShalfEdge *eDel )
  killEdge_(e) {
    e.Sym.side < e.side && (e = e.Sym);
    var n = e.next, s = e.Sym.next;
    n.Sym.next = s, s.Sym.next = n;
  }
  /* KillVertex( vDel ) destroys a vertex and removes it from the global
   * vertex list.  It updates the vertex loop to point to a given new vertex.
   */
  //static void KillVertex( TESSmesh *mesh, TESSvertex *vDel, TESSvertex *newOrg )
  killVertex_(e, n) {
    var s = e.anEdge, i = s;
    do
      i.Org = n, i = i.Onext;
    while (i !== s);
    var r = e.prev, c = e.next;
    c.prev = r, r.next = c;
  }
  /* KillFace( fDel ) destroys a face and removes it from the global face
   * list.  It updates the face loop to point to a given new face.
   */
  //static void KillFace( TESSmesh *mesh, TESSface *fDel, TESSface *newLface )
  killFace_(e, n) {
    var s = e.anEdge, i = s;
    do
      i.Lface = n, i = i.Lnext;
    while (i !== s);
    var r = e.prev, c = e.next;
    c.prev = r, r.next = c;
  }
  /****************** Basic Edge Operations **********************/
  /* tessMeshMakeEdge creates one edge, two vertices, and a loop (face).
   * The loop consists of the two new half-edges.
   */
  //TESShalfEdge *tessMeshMakeEdge( TESSmesh *mesh )
  makeEdge() {
    var e = new Bn(), n = new Bn(), s = new rs(), i = this.makeEdge_(this.eHead);
    return this.makeVertex_(e, i, this.vHead), this.makeVertex_(n, i.Sym, this.vHead), this.makeFace_(s, i, this.fHead), i;
  }
  /* tessMeshSplice( eOrg, eDst ) is the basic operation for changing the
   * mesh connectivity and topology.  It changes the mesh so that
   *	eOrg->Onext <- OLD( eDst->Onext )
   *	eDst->Onext <- OLD( eOrg->Onext )
   * where OLD(...) means the value before the meshSplice operation.
   *
   * This can have two effects on the vertex structure:
   *  - if eOrg->Org != eDst->Org, the two vertices are merged together
   *  - if eOrg->Org == eDst->Org, the origin is split into two vertices
   * In both cases, eDst->Org is changed and eOrg->Org is untouched.
   *
   * Similarly (and independently) for the face structure,
   *  - if eOrg->Lface == eDst->Lface, one loop is split into two
   *  - if eOrg->Lface != eDst->Lface, two distinct loops are joined into one
   * In both cases, eDst->Lface is changed and eOrg->Lface is unaffected.
   *
   * Some special cases:
   * If eDst == eOrg, the operation has no effect.
   * If eDst == eOrg->Lnext, the new face will have a single edge.
   * If eDst == eOrg->Lprev, the old face will have a single edge.
   * If eDst == eOrg->Onext, the new vertex will have a single edge.
   * If eDst == eOrg->Oprev, the old vertex will have a single edge.
   */
  //int tessMeshSplice( TESSmesh* mesh, TESShalfEdge *eOrg, TESShalfEdge *eDst )
  splice(e, n) {
    var s = !1, i = !1;
    if (e !== n) {
      if (n.Org !== e.Org && (i = !0, this.killVertex_(n.Org, e.Org)), n.Lface !== e.Lface && (s = !0, this.killFace_(n.Lface, e.Lface)), this.splice_(n, e), !i) {
        var r = new Bn();
        this.makeVertex_(r, n, e.Org), e.Org.anEdge = e;
      }
      if (!s) {
        var c = new rs();
        this.makeFace_(c, n, e.Lface), e.Lface.anEdge = e;
      }
    }
  }
  /* tessMeshDelete( eDel ) removes the edge eDel.  There are several cases:
   * if (eDel->Lface != eDel->Rface), we join two loops into one; the loop
   * eDel->Lface is deleted.  Otherwise, we are splitting one loop into two;
   * the newly created loop will contain eDel->Dst.  If the deletion of eDel
   * would create isolated vertices, those are deleted as well.
   *
   * This function could be implemented as two calls to tessMeshSplice
   * plus a few calls to memFree, but this would allocate and delete
   * unnecessary vertices and faces.
   */
  //int tessMeshDelete( TESSmesh *mesh, TESShalfEdge *eDel )
  delete(e) {
    var n = e.Sym, s = !1;
    if (e.Lface !== e.Rface && (s = !0, this.killFace_(e.Lface, e.Rface)), e.Onext === e)
      this.killVertex_(e.Org, null);
    else if (e.Rface.anEdge = e.Oprev, e.Org.anEdge = e.Onext, this.splice_(e, e.Oprev), !s) {
      var i = new rs();
      this.makeFace_(i, e, e.Lface);
    }
    n.Onext === n ? (this.killVertex_(n.Org, null), this.killFace_(n.Lface, null)) : (e.Lface.anEdge = n.Oprev, n.Org.anEdge = n.Onext, this.splice_(n, n.Oprev)), this.killEdge_(e);
  }
  /******************** Other Edge Operations **********************/
  /* All these routines can be implemented with the basic edge
   * operations above.  They are provided for convenience and efficiency.
   */
  /* tessMeshAddEdgeVertex( eOrg ) creates a new edge eNew such that
   * eNew == eOrg->Lnext, and eNew->Dst is a newly created vertex.
   * eOrg and eNew will have the same left face.
   */
  // TESShalfEdge *tessMeshAddEdgeVertex( TESSmesh *mesh, TESShalfEdge *eOrg );
  addEdgeVertex(e) {
    var n = this.makeEdge_(e), s = n.Sym;
    this.splice_(n, e.Lnext), n.Org = e.Dst;
    var i = new Bn();
    return this.makeVertex_(i, s, n.Org), n.Lface = s.Lface = e.Lface, n;
  }
  /* tessMeshSplitEdge( eOrg ) splits eOrg into two edges eOrg and eNew,
   * such that eNew == eOrg->Lnext.  The new vertex is eOrg->Dst == eNew->Org.
   * eOrg and eNew will have the same left face.
   */
  // TESShalfEdge *tessMeshSplitEdge( TESSmesh *mesh, TESShalfEdge *eOrg );
  splitEdge(e) {
    var n = this.addEdgeVertex(e), s = n.Sym;
    return this.splice_(e.Sym, e.Sym.Oprev), this.splice_(e.Sym, s), e.Dst = s.Org, s.Dst.anEdge = s.Sym, s.Rface = e.Rface, s.winding = e.winding, s.Sym.winding = e.Sym.winding, s;
  }
  /* tessMeshConnect( eOrg, eDst ) creates a new edge from eOrg->Dst
   * to eDst->Org, and returns the corresponding half-edge eNew.
   * If eOrg->Lface == eDst->Lface, this splits one loop into two,
   * and the newly created loop is eNew->Lface.  Otherwise, two disjoint
   * loops are merged into one, and the loop eDst->Lface is destroyed.
   *
   * If (eOrg == eDst), the new face will have only two edges.
   * If (eOrg->Lnext == eDst), the old face is reduced to a single edge.
   * If (eOrg->Lnext->Lnext == eDst), the old face is reduced to two edges.
   */
  // TESShalfEdge *tessMeshConnect( TESSmesh *mesh, TESShalfEdge *eOrg, TESShalfEdge *eDst );
  connect(e, n) {
    var s = !1, i = this.makeEdge_(e), r = i.Sym;
    if (n.Lface !== e.Lface && (s = !0, this.killFace_(n.Lface, e.Lface)), this.splice_(i, e.Lnext), this.splice_(r, n), i.Org = e.Dst, r.Org = n.Org, i.Lface = r.Lface = e.Lface, e.Lface.anEdge = r, !s) {
      var c = new rs();
      this.makeFace_(c, i, e.Lface);
    }
    return i;
  }
  /* tessMeshZapFace( fZap ) destroys a face and removes it from the
   * global face list.  All edges of fZap will have a NULL pointer as their
   * left face.  Any edges which also have a NULL pointer as their right face
   * are deleted entirely (along with any isolated vertices this produces).
   * An entire mesh can be deleted by zapping its faces, one at a time,
   * in any order.  Zapped faces cannot be used in further mesh operations!
   */
  zapFace(e) {
    var n = e.anEdge, s, i, r, c, a;
    i = n.Lnext;
    do
      s = i, i = s.Lnext, s.Lface = null, s.Rface === null && (s.Onext === s ? this.killVertex_(s.Org, null) : (s.Org.anEdge = s.Onext, this.splice_(s, s.Oprev)), r = s.Sym, r.Onext === r ? this.killVertex_(r.Org, null) : (r.Org.anEdge = r.Onext, this.splice_(r, r.Oprev)), this.killEdge_(s));
    while (s != n);
    c = e.prev, a = e.next, a.prev = c, c.next = a;
  }
  countFaceVerts_(e) {
    var n = e.anEdge, s = 0;
    do
      s++, n = n.Lnext;
    while (n !== e.anEdge);
    return s;
  }
  //int tessMeshMergeConvexFaces( TESSmesh *mesh, int maxVertsPerFace )
  mergeConvexFaces(e) {
    var n, s, i, r, c, a, l;
    for (n = this.fHead.next; n !== this.fHead; n = n.next)
      if (n.inside)
        for (s = n.anEdge, c = s.Org; i = s.Lnext, r = s.Sym, r && r.Lface && r.Lface.inside && (a = this.countFaceVerts_(n), l = this.countFaceVerts_(r.Lface), a + l - 2 <= e && nt.vertCCW(
          s.Lprev.Org,
          s.Org,
          r.Lnext.Lnext.Org
        ) && nt.vertCCW(
          r.Lprev.Org,
          r.Org,
          s.Lnext.Lnext.Org
        ) && (i = r.Lnext, this.delete(r), s = null, r = null)), !(s && s.Lnext.Org === c); )
          s = i;
    return !0;
  }
  /* tessMeshCheckMesh( mesh ) checks a mesh for self-consistency.
   */
  check() {
    var e = this.fHead, n = this.vHead, s = this.eHead, i, r, c, a, l, h;
    for (r = e, r = e; (i = r.next) !== e; r = i) {
      gt(i.prev === r), l = i.anEdge;
      do
        gt(l.Sym !== l), gt(l.Sym.Sym === l), gt(l.Lnext.Onext.Sym === l), gt(l.Onext.Sym.Lnext === l), gt(l.Lface === i), l = l.Lnext;
      while (l !== i.anEdge);
    }
    for (gt(i.prev === r && i.anEdge === null), a = n, a = n; (c = a.next) !== n; a = c) {
      gt(c.prev === a), l = c.anEdge;
      do
        gt(l.Sym !== l), gt(l.Sym.Sym === l), gt(l.Lnext.Onext.Sym === l), gt(l.Onext.Sym.Lnext === l), gt(l.Org === c), l = l.Onext;
      while (l !== c.anEdge);
    }
    for (gt(c.prev === a && c.anEdge === null), h = s, h = s; (l = h.next) !== s; h = l)
      gt(l.Sym.next === h.Sym), gt(l.Sym !== l), gt(l.Sym.Sym === l), gt(l.Org !== null), gt(l.Dst !== null), gt(l.Lnext.Onext.Sym === l), gt(l.Onext.Sym.Lnext === l);
    gt(
      l.Sym.next === h.Sym && l.Sym === this.eHeadSym && l.Sym.Sym === l && l.Org === null && l.Dst === null && l.Lface === null && l.Rface === null
    );
  }
}
class Ho {
  handle = null;
}
class Bo {
  key = null;
  node = 0;
}
class t0 {
  constructor(e, n) {
    this.leq = n, this.max = e, this.nodes = [], this.handles = [];
    for (let s = 0; s < e + 1; s++)
      this.nodes[s] = new Ho(), this.handles[s] = new Bo();
    this.initialized = !1, this.nodes[1].handle = 1, this.handles[1].key = null;
  }
  max = 0;
  nodes = [];
  handles = [];
  initialized = !1;
  freeList = 0;
  size = 0;
  floatDown_(e) {
    var n = this.nodes, s = this.handles, i, r, c;
    for (i = n[e].handle; ; ) {
      if (c = e << 1, c < this.size && this.leq(s[n[c + 1].handle].key, s[n[c].handle].key) && ++c, gt(c <= this.max), r = n[c].handle, c > this.size || this.leq(s[i].key, s[r].key)) {
        n[e].handle = i, s[i].node = e;
        break;
      }
      n[e].handle = r, s[r].node = e, e = c;
    }
  }
  floatUp_(e) {
    var n = this.nodes, s = this.handles, i, r, c;
    for (i = n[e].handle; ; ) {
      if (c = e >> 1, r = n[c].handle, c === 0 || this.leq(s[r].key, s[i].key)) {
        n[e].handle = i, s[i].node = e;
        break;
      }
      n[e].handle = r, s[r].node = e, e = c;
    }
  }
  init() {
    for (let e = this.size; e >= 1; --e)
      this.floatDown_(e);
    this.initialized = !0;
  }
  min() {
    return this.handles[this.nodes[1].handle].key;
  }
  /* really pqHeapInsert */
  /* returns INV_HANDLE iff out of memory */
  //PQhandle pqHeapInsert( TESSalloc* alloc, PriorityQHeap *pq, PQkey keyNew )
  insert(e) {
    var n, s;
    if (n = ++this.size, n * 2 > this.max) {
      this.max *= 2;
      var i, r;
      for (r = this.nodes.length, this.nodes.length = this.max + 1, i = r; i < this.nodes.length; i++)
        this.nodes[i] = new Ho();
      for (r = this.handles.length, this.handles.length = this.max + 1, i = r; i < this.handles.length; i++)
        this.handles[i] = new Bo();
    }
    return this.freeList === 0 ? s = n : (s = this.freeList, this.freeList = this.handles[s].node), this.nodes[n].handle = s, this.handles[s].node = n, this.handles[s].key = e, this.initialized && this.floatUp_(n), s;
  }
  //PQkey pqHeapExtractMin( PriorityQHeap *pq )
  extractMin() {
    var e = this.nodes, n = this.handles, s = e[1].handle, i = n[s].key;
    return this.size > 0 && (e[1].handle = e[this.size].handle, n[e[1].handle].node = 1, n[s].key = null, n[s].node = this.freeList, this.freeList = s, --this.size, this.size > 0 && this.floatDown_(1)), i;
  }
  delete(e) {
    var n = this.nodes, s = this.handles, i;
    gt(e >= 1 && e <= this.max && s[e].key !== null), i = s[e].node, n[i].handle = n[this.size].handle, s[n[i].handle].node = i, --this.size, i <= this.size && (i <= 1 || this.leq(s[n[i >> 1].handle].key, s[n[i].handle].key) ? this.floatDown_(i) : this.floatUp_(i)), s[e].key = null, s[e].node = this.freeList, this.freeList = e;
  }
}
class Qi {
  eUp = null;
  /* upper edge, directed right to left */
  nodeUp = null;
  /* dictionary node corresponding to eUp */
  windingNumber = 0;
  /* used to determine which regions are
   * inside the polygon */
  inside = !1;
  /* is this region inside the polygon? */
  sentinel = !1;
  /* marks fake edges at t = +/-infinity */
  dirty = !1;
  /* marks regions where the upper or lower
   * edge has changed, but we haven't checked
   * whether they intersect yet */
  fixUpperEdge = !1;
  /* marks temporary edges introduced when
   * we process a "right vertex" (one without
   * any edges leaving to the right) */
}
class Yo {
  key = null;
  next = null;
  prev = null;
}
class e0 {
  constructor(e, n) {
    this.frame = e, this.leq = n, this.head.next = this.head, this.head.prev = this.head;
  }
  head = new Yo();
  min() {
    return this.head.next;
  }
  max() {
    return this.head.prev;
  }
  insert(e) {
    return this.insertBefore(this.head, e);
  }
  search(e) {
    let n = this.head;
    do
      n = n.next;
    while (n.key !== null && !this.leq(this.frame, e, n.key));
    return n;
  }
  insertBefore(e, n) {
    do
      e = e.prev;
    while (e.key !== null && !this.leq(this.frame, e.key, n));
    const s = new Yo();
    return s.key = n, s.next = e.next, e.next.prev = s, s.prev = e, e.next = s, s;
  }
  delete(e) {
    e.next.prev = e.prev, e.prev.next = e.next;
  }
}
class tt {
  static regionBelow(e) {
    return e.nodeUp.prev.key;
  }
  static regionAbove(e) {
    return e.nodeUp.next.key;
  }
  static debugEvent(e) {
  }
  /*
   * Invariants for the Edge Dictionary.
   * - each pair of adjacent edges e2=Succ(e1) satisfies EdgeLeq(e1,e2)
   *   at any valid location of the sweep event
   * - if EdgeLeq(e2,e1) as well (at any valid sweep event), then e1 and e2
   *   share a common endpoint
   * - for each e, e->Dst has been processed, but not e->Org
   * - each edge e satisfies VertLeq(e->Dst,event) && VertLeq(event,e->Org)
   *   where "event" is the current sweep line event.
   * - no edge e has zero length
   *
   * Invariants for the Mesh (the processed portion).
   * - the portion of the mesh left of the sweep line is a planar graph,
   *   ie. there is *some* way to embed it in the plane
   * - no processed edge has zero length
   * - no two processed vertices have identical coordinates
   * - each "inside" region is monotone, ie. can be broken into two chains
   *   of monotonically increasing vertices according to VertLeq(v1,v2)
   *   - a non-invariant: these chains may intersect (very slightly)
   *
   * Invariants for the Sweep.
   * - if none of the edges incident to the event vertex have an activeRegion
   *   (ie. none of these edges are in the edge dictionary), then the vertex
   *   has only right-going edges.
   * - if an edge is marked "fixUpperEdge" (it is a temporary edge introduced
   *   by ConnectRightVertex), then it is the only right-going edge from
   *   its associated vertex.  (This says that these edges exist only
   *   when it is necessary.)
   */
  /* When we merge two edges into one, we need to compute the combined
   * winding of the new edge.
   */
  static addWinding(e, n) {
    e.winding += n.winding, e.Sym.winding += n.Sym.winding;
  }
  //static int EdgeLeq( TESStesselator *tess, ActiveRegion *reg1, ActiveRegion *reg2 )
  static edgeLeq(e, n, s) {
    var i = e.event, r = n.eUp, c = s.eUp;
    if (r.Dst === i)
      return c.Dst === i ? nt.vertLeq(r.Org, c.Org) ? nt.edgeSign(c.Dst, r.Org, c.Org) <= 0 : nt.edgeSign(r.Dst, c.Org, r.Org) >= 0 : nt.edgeSign(c.Dst, i, c.Org) <= 0;
    if (c.Dst === i)
      return nt.edgeSign(r.Dst, i, r.Org) >= 0;
    const a = nt.edgeEval(r.Dst, i, r.Org), l = nt.edgeEval(c.Dst, i, c.Org);
    return a >= l;
  }
  //static void DeleteRegion( TESStesselator *tess, ActiveRegion *reg )
  static deleteRegion(e, n) {
    n.fixUpperEdge && gt(n.eUp.winding === 0), n.eUp.activeRegion = null, e.dict.delete(n.nodeUp);
  }
  //static int FixUpperEdge( TESStesselator *tess, ActiveRegion *reg, TESShalfEdge *newEdge )
  static fixUpperEdge(e, n, s) {
    gt(n.fixUpperEdge), e.mesh.delete(n.eUp), n.fixUpperEdge = !1, n.eUp = s, s.activeRegion = n;
  }
  //static ActiveRegion *TopLeftRegion( TESStesselator *tess, ActiveRegion *reg )
  static topLeftRegion(e, n) {
    var s = n.eUp.Org, i;
    do
      n = tt.regionAbove(n);
    while (n.eUp.Org === s);
    if (n.fixUpperEdge) {
      if (i = e.mesh.connect(
        tt.regionBelow(n).eUp.Sym,
        n.eUp.Lnext
      ), i === null) return null;
      tt.fixUpperEdge(e, n, i), n = tt.regionAbove(n);
    }
    return n;
  }
  //static ActiveRegion *TopRightRegion( ActiveRegion *reg )
  static topRightRegion(e) {
    var n = e.eUp.Dst;
    do
      e = tt.regionAbove(e);
    while (e.eUp.Dst === n);
    return e;
  }
  //static ActiveRegion *AddRegionBelow( TESStesselator *tess, ActiveRegion *regAbove, TESShalfEdge *eNewUp )
  static addRegionBelow(e, n, s) {
    var i = new Qi();
    return i.eUp = s, i.nodeUp = e.dict.insertBefore(n.nodeUp, i), i.fixUpperEdge = !1, i.sentinel = !1, i.dirty = !1, s.activeRegion = i, i;
  }
  //static int IsWindingInside( TESStesselator *tess, int n )
  static isWindingInside(e, n) {
    switch (e.windingRule) {
      case me.ODD:
        return (n & 1) !== 0;
      case me.NONZERO:
        return n !== 0;
      case me.POSITIVE:
        return n > 0;
      case me.NEGATIVE:
        return n < 0;
      case me.ABS_GEQ_TWO:
        return n >= 2 || n <= -2;
    }
    throw new Error("Invalid winding rulle");
  }
  //static void ComputeWinding( TESStesselator *tess, ActiveRegion *reg )
  static computeWinding(e, n) {
    n.windingNumber = tt.regionAbove(n).windingNumber + n.eUp.winding, n.inside = tt.isWindingInside(e, n.windingNumber);
  }
  //static void FinishRegion( TESStesselator *tess, ActiveRegion *reg )
  static finishRegion(e, n) {
    var s = n.eUp, i = s.Lface;
    i.inside = n.inside, i.anEdge = s, tt.deleteRegion(e, n);
  }
  //static TESShalfEdge *FinishLeftRegions( TESStesselator *tess, ActiveRegion *regFirst, ActiveRegion *regLast )
  static finishLeftRegions(e, n, s) {
    for (var i, r = null, c = n, a = n.eUp; c !== s; ) {
      if (c.fixUpperEdge = !1, r = tt.regionBelow(c), i = r.eUp, i.Org != a.Org) {
        if (!r.fixUpperEdge) {
          tt.finishRegion(e, c);
          break;
        }
        i = e.mesh.connect(a.Lprev, i.Sym), tt.fixUpperEdge(e, r, i);
      }
      a.Onext !== i && (e.mesh.splice(i.Oprev, i), e.mesh.splice(a, i)), tt.finishRegion(e, c), a = r.eUp, c = r;
    }
    return a;
  }
  //static void AddRightEdges( TESStesselator *tess, ActiveRegion *regUp, TESShalfEdge *eFirst, TESShalfEdge *eLast, TESShalfEdge *eTopLeft, int cleanUp )
  static addRightEdges(e, n, s, i, r, c) {
    var a, l, h, u, f = !0;
    h = s;
    do
      gt(nt.vertLeq(h.Org, h.Dst)), tt.addRegionBelow(e, n, h.Sym), h = h.Onext;
    while (h !== i);
    for (r === null && (r = tt.regionBelow(n).eUp.Rprev), l = n, u = r; a = tt.regionBelow(l), h = a.eUp.Sym, h.Org === u.Org; )
      h.Onext !== u && (e.mesh.splice(h.Oprev, h), e.mesh.splice(u.Oprev, h)), a.windingNumber = l.windingNumber - h.winding, a.inside = tt.isWindingInside(e, a.windingNumber), l.dirty = !0, !f && tt.checkForRightSplice(e, l) && (tt.addWinding(h, u), tt.deleteRegion(e, l), e.mesh.delete(u)), f = !1, l = a, u = h;
    l.dirty = !0, gt(l.windingNumber - h.winding === a.windingNumber), c && tt.walkDirtyRegions(e, l);
  }
  //static void SpliceMergeVertices( TESStesselator *tess, TESShalfEdge *e1, TESShalfEdge *e2 )
  static spliceMergeVertices(e, n, s) {
    e.mesh.splice(n, s);
  }
  //static void VertexWeights( TESSvertex *isect, TESSvertex *org, TESSvertex *dst, TESSreal *weights )
  static vertexWeights(e, n, s) {
    var i = nt.vertL1dist(n, e), r = nt.vertL1dist(s, e), c = 0.5 * r / (i + r), a = 0.5 * i / (i + r);
    e.coords[0] += c * n.coords[0] + a * s.coords[0], e.coords[1] += c * n.coords[1] + a * s.coords[1], e.coords[2] += c * n.coords[2] + a * s.coords[2];
  }
  //static void GetIntersectData( TESStesselator *tess, TESSvertex *isect, TESSvertex *orgUp, TESSvertex *dstUp, TESSvertex *orgLo, TESSvertex *dstLo )
  static getIntersectData(e, n, s, i, r, c) {
    n.coords[0] = n.coords[1] = n.coords[2] = 0, n.idx = -1, tt.vertexWeights(n, s, i), tt.vertexWeights(n, r, c);
  }
  //static int CheckForRightSplice( TESStesselator *tess, ActiveRegion *regUp )
  static checkForRightSplice(e, n) {
    var s = tt.regionBelow(n), i = n.eUp, r = s.eUp;
    if (nt.vertLeq(i.Org, r.Org)) {
      if (nt.edgeSign(r.Dst, i.Org, r.Org) > 0) return !1;
      nt.vertEq(i.Org, r.Org) ? i.Org !== r.Org && (e.pq.delete(i.Org.pqHandle), tt.spliceMergeVertices(e, r.Oprev, i)) : (e.mesh.splitEdge(r.Sym), e.mesh.splice(i, r.Oprev), n.dirty = s.dirty = !0);
    } else {
      if (nt.edgeSign(i.Dst, r.Org, i.Org) < 0) return !1;
      tt.regionAbove(n).dirty = n.dirty = !0, e.mesh.splitEdge(i.Sym), e.mesh.splice(r.Oprev, i);
    }
    return !0;
  }
  //static int CheckForLeftSplice( TESStesselator *tess, ActiveRegion *regUp )
  static checkForLeftSplice(e, n) {
    var s = tt.regionBelow(n), i = n.eUp, r = s.eUp, c;
    if (gt(!nt.vertEq(i.Dst, r.Dst)), nt.vertLeq(i.Dst, r.Dst)) {
      if (nt.edgeSign(i.Dst, r.Dst, i.Org) < 0) return !1;
      tt.regionAbove(n).dirty = n.dirty = !0, c = e.mesh.splitEdge(i), e.mesh.splice(r.Sym, c), c.Lface.inside = n.inside;
    } else {
      if (nt.edgeSign(r.Dst, i.Dst, r.Org) > 0) return !1;
      n.dirty = s.dirty = !0, c = e.mesh.splitEdge(r), e.mesh.splice(i.Lnext, r.Sym), c.Rface.inside = n.inside;
    }
    return !0;
  }
  //static int CheckForIntersect( TESStesselator *tess, ActiveRegion *regUp )
  static checkForIntersect(e, n) {
    var s = tt.regionBelow(n), i = n.eUp, r = s.eUp, c = i.Org, a = r.Org, l = i.Dst, h = r.Dst, u, f, d = new Bn(), y, x;
    if (gt(!nt.vertEq(h, l)), gt(nt.edgeSign(l, e.event, c) <= 0), gt(nt.edgeSign(h, e.event, a) >= 0), gt(c !== e.event && a !== e.event), gt(!n.fixUpperEdge && !s.fixUpperEdge), c === a || (u = Math.min(c.t, l.t), f = Math.max(a.t, h.t), u > f)) return !1;
    if (nt.vertLeq(c, a)) {
      if (nt.edgeSign(h, c, a) > 0) return !1;
    } else if (nt.edgeSign(l, a, c) < 0) return !1;
    return nt.intersect(l, c, h, a, d), gt(Math.min(c.t, l.t) <= d.t), gt(d.t <= Math.max(a.t, h.t)), gt(Math.min(h.s, l.s) <= d.s), gt(d.s <= Math.max(a.s, c.s)), nt.vertLeq(d, e.event) && (d.s = e.event.s, d.t = e.event.t), y = nt.vertLeq(c, a) ? c : a, nt.vertLeq(y, d) && (d.s = y.s, d.t = y.t), nt.vertEq(d, c) || nt.vertEq(d, a) ? (tt.checkForRightSplice(e, n), !1) : !nt.vertEq(l, e.event) && nt.edgeSign(l, e.event, d) >= 0 || !nt.vertEq(h, e.event) && nt.edgeSign(h, e.event, d) <= 0 ? h === e.event ? (e.mesh.splitEdge(i.Sym), e.mesh.splice(r.Sym, i), n = tt.topLeftRegion(e, n), i = tt.regionBelow(n).eUp, tt.finishLeftRegions(e, tt.regionBelow(n), s), tt.addRightEdges(e, n, i.Oprev, i, i, !0), !0) : l === e.event ? (e.mesh.splitEdge(r.Sym), e.mesh.splice(i.Lnext, r.Oprev), s = n, n = tt.topRightRegion(n), x = tt.regionBelow(n).eUp.Rprev, s.eUp = r.Oprev, r = tt.finishLeftRegions(e, s, null), tt.addRightEdges(e, n, r.Onext, i.Rprev, x, !0), !0) : (nt.edgeSign(l, e.event, d) >= 0 && (tt.regionAbove(n).dirty = n.dirty = !0, e.mesh.splitEdge(i.Sym), i.Org.s = e.event.s, i.Org.t = e.event.t), nt.edgeSign(h, e.event, d) <= 0 && (n.dirty = s.dirty = !0, e.mesh.splitEdge(r.Sym), r.Org.s = e.event.s, r.Org.t = e.event.t), !1) : (e.mesh.splitEdge(i.Sym), e.mesh.splitEdge(r.Sym), e.mesh.splice(r.Oprev, i), i.Org.s = d.s, i.Org.t = d.t, i.Org.pqHandle = e.pq.insert(i.Org), tt.getIntersectData(e, i.Org, c, l, a, h), tt.regionAbove(n).dirty = n.dirty = s.dirty = !0, !1);
  }
  //static void WalkDirtyRegions( TESStesselator *tess, ActiveRegion *regUp )
  static walkDirtyRegions(e, n) {
    for (var s = tt.regionBelow(n), i, r; ; ) {
      for (; s.dirty; )
        n = s, s = tt.regionBelow(s);
      if (!n.dirty && (s = n, n = tt.regionAbove(n), n === null || !n.dirty))
        return;
      if (n.dirty = !1, i = n.eUp, r = s.eUp, i.Dst !== r.Dst && tt.checkForLeftSplice(e, n) && (s.fixUpperEdge ? (tt.deleteRegion(e, s), e.mesh.delete(r), s = tt.regionBelow(n), r = s.eUp) : n.fixUpperEdge && (tt.deleteRegion(e, n), e.mesh.delete(i), n = tt.regionAbove(s), i = n.eUp)), i.Org !== r.Org)
        if (i.Dst !== r.Dst && !n.fixUpperEdge && !s.fixUpperEdge && (i.Dst === e.event || r.Dst === e.event)) {
          if (tt.checkForIntersect(e, n))
            return;
        } else
          tt.checkForRightSplice(e, n);
      i.Org === r.Org && i.Dst === r.Dst && (tt.addWinding(r, i), tt.deleteRegion(e, n), e.mesh.delete(i), n = tt.regionAbove(s));
    }
  }
  //static void ConnectRightVertex( TESStesselator *tess, ActiveRegion *regUp, TESShalfEdge *eBottomLeft )
  static connectRightVertex(e, n, s) {
    var i, r = s.Onext, c = tt.regionBelow(n), a = n.eUp, l = c.eUp, h = !1;
    if (a.Dst !== l.Dst && tt.checkForIntersect(e, n), nt.vertEq(a.Org, e.event) && (e.mesh.splice(r.Oprev, a), n = tt.topLeftRegion(e, n), r = tt.regionBelow(n).eUp, tt.finishLeftRegions(e, tt.regionBelow(n), c), h = !0), nt.vertEq(l.Org, e.event) && (e.mesh.splice(s, l.Oprev), s = tt.finishLeftRegions(e, c, null), h = !0), h) {
      tt.addRightEdges(
        e,
        n,
        s.Onext,
        r,
        r,
        !0
      );
      return;
    }
    nt.vertLeq(l.Org, a.Org) ? i = l.Oprev : i = a, i = e.mesh.connect(s.Lprev, i), tt.addRightEdges(e, n, i, i.Onext, i.Onext, !1), i.Sym.activeRegion.fixUpperEdge = !0, tt.walkDirtyRegions(e, n);
  }
  /* Because vertices at exactly the same location are merged together
   * before we process the sweep event, some degenerate cases can't occur.
   * However if someone eventually makes the modifications required to
   * merge features which are close together, the cases below marked
   * TOLERANCE_NONZERO will be useful.  They were debugged before the
   * code to merge identical vertices in the main loop was added.
   */
  //#define TOLERANCE_NONZERO	FALSE
  //static void ConnectLeftDegenerate( TESStesselator *tess, ActiveRegion *regUp, TESSvertex *vEvent )
  static connectLeftDegenerate(e, n, s) {
    var i, r, c, a, l;
    if (i = n.eUp, nt.vertEq(i.Org, s)) {
      gt(
        !1
        /*TOLERANCE_NONZERO*/
      ), tt.spliceMergeVertices(e, i, s.anEdge);
      return;
    }
    if (!nt.vertEq(i.Dst, s)) {
      e.mesh.splitEdge(i.Sym), n.fixUpperEdge && (e.mesh.delete(i.Onext), n.fixUpperEdge = !1), e.mesh.splice(s.anEdge, i), tt.sweepEvent(e, s);
      return;
    }
    gt(
      !1
      /*TOLERANCE_NONZERO*/
    ), n = tt.topRightRegion(n), l = tt.regionBelow(n), c = l.eUp.Sym, r = a = c.Onext, l.fixUpperEdge && (gt(r !== c), tt.deleteRegion(e, l), e.mesh.delete(c), c = r.Oprev), e.mesh.splice(s.anEdge, c), nt.edgeGoesLeft(r) || (r = null), tt.addRightEdges(
      e,
      n,
      c.Onext,
      a,
      r,
      !0
    );
  }
  //static void ConnectLeftVertex( TESStesselator *tess, TESSvertex *vEvent )
  static connectLeftVertex(e, n) {
    var s, i, r, c, a, l, h = new Qi();
    if (h.eUp = n.anEdge.Sym, s = e.dict.search(h).key, i = tt.regionBelow(s), !!i) {
      if (c = s.eUp, a = i.eUp, nt.edgeSign(c.Dst, n, c.Org) === 0) {
        tt.connectLeftDegenerate(e, s, n);
        return;
      }
      if (r = nt.vertLeq(a.Dst, c.Dst) ? s : i, s.inside || r.fixUpperEdge) {
        if (r === s)
          l = e.mesh.connect(n.anEdge.Sym, c.Lnext);
        else {
          var u = e.mesh.connect(a.Dnext, n.anEdge);
          l = u.Sym;
        }
        r.fixUpperEdge ? tt.fixUpperEdge(e, r, l) : tt.computeWinding(
          e,
          tt.addRegionBelow(e, s, l)
        ), tt.sweepEvent(e, n);
      } else
        tt.addRightEdges(
          e,
          s,
          n.anEdge,
          n.anEdge,
          null,
          !0
        );
    }
  }
  //static void SweepEvent( TESStesselator *tess, TESSvertex *vEvent )
  static sweepEvent(e, n) {
    e.event = n;
    for (var s = n.anEdge; s.activeRegion === null; )
      if (s = s.Onext, s === n.anEdge) {
        tt.connectLeftVertex(e, n);
        return;
      }
    var i = tt.topLeftRegion(e, s.activeRegion);
    gt(i !== null);
    var r = tt.regionBelow(i), c = r.eUp, a = tt.finishLeftRegions(e, r, null);
    a.Onext === c ? tt.connectRightVertex(e, i, a) : tt.addRightEdges(
      e,
      i,
      a.Onext,
      c,
      c,
      !0
    );
  }
  /* Make the sentinel coordinates big enough that they will never be
   * merged with real input features.
   */
  //static void AddSentinel( TESStesselator *tess, TESSreal smin, TESSreal smax, TESSreal t )
  static addSentinel(e, n, s, i) {
    var r = new Qi(), c = e.mesh.makeEdge();
    c.Org.s = s, c.Org.t = i, c.Dst.s = n, c.Dst.t = i, e.event = c.Dst, r.eUp = c, r.windingNumber = 0, r.inside = !1, r.fixUpperEdge = !1, r.sentinel = !0, r.dirty = !1, r.nodeUp = e.dict.insert(r);
  }
  //static void InitEdgeDict( TESStesselator *tess )
  static initEdgeDict(e) {
    e.dict = new e0(e, tt.edgeLeq);
    var n = e.bmax[0] - e.bmin[0], s = e.bmax[1] - e.bmin[1], i = e.bmin[0] - n, r = e.bmax[0] + n, c = e.bmin[1] - s, a = e.bmax[1] + s;
    tt.addSentinel(e, i, r, c), tt.addSentinel(e, i, r, a);
  }
  static doneEdgeDict(e) {
    for (var n, s = 0; (n = e.dict.min().key) !== null; )
      n.sentinel || (gt(n.fixUpperEdge), gt(++s === 1)), gt(n.windingNumber === 0), tt.deleteRegion(e, n);
  }
  static removeDegenerateEdges(e) {
    var n, s, i, r = e.mesh.eHead;
    for (n = r.next; n !== r; n = s)
      s = n.next, i = n.Lnext, nt.vertEq(n.Org, n.Dst) && n.Lnext.Lnext !== n && (tt.spliceMergeVertices(e, i, n), e.mesh.delete(n), n = i, i = n.Lnext), i.Lnext === n && (i !== n && ((i === s || i === s.Sym) && (s = s.next), e.mesh.delete(i)), (n === s || n === s.Sym) && (s = s.next), e.mesh.delete(n));
  }
  static initPriorityQ(e) {
    var n, s, i, r = 0;
    for (i = e.mesh.vHead, s = i.next; s !== i; s = s.next)
      r++;
    for (r += 8, n = e.pq = new t0(r, nt.vertLeq), i = e.mesh.vHead, s = i.next; s !== i; s = s.next)
      s.pqHandle = n.insert(s);
    return s !== i ? !1 : (n.init(), !0);
  }
  static donePriorityQ(e) {
    e.pq = null;
  }
  static removeDegenerateFaces(e, n) {
    var s, i, r;
    for (s = n.fHead.next; s !== n.fHead; s = i)
      i = s.next, r = s.anEdge, gt(r.Lnext !== r), r.Lnext.Lnext === r && (tt.addWinding(r.Onext, r), e.mesh.delete(r));
    return !0;
  }
  static computeInterior(e, n = !0) {
    var s, i;
    if (tt.removeDegenerateEdges(e), !tt.initPriorityQ(e))
      return !1;
    for (tt.initEdgeDict(e); (s = e.pq.extractMin()) !== null; ) {
      for (; i = e.pq.min(), !(i === null || !nt.vertEq(i, s)); )
        i = e.pq.extractMin(), tt.spliceMergeVertices(e, s.anEdge, i.anEdge);
      tt.sweepEvent(e, s);
    }
    return e.event = e.dict.min().key.eUp.Org, tt.doneEdgeDict(e), tt.donePriorityQ(e), tt.removeDegenerateFaces(e, e.mesh), n && e.mesh.check(), !0;
  }
}
class pa {
  /*** state needed for collecting the input data ***/
  /* stores the input contours, and eventually the tessellation itself */
  mesh = new No();
  /*** state needed for projecting onto the sweep plane ***/
  normal = [0, 0, 0];
  /* user-specified normal (if provided) */
  sUnit = [0, 0, 0];
  /* unit vector in s-direction (debugging) */
  tUnit = [0, 0, 0];
  /* unit vector in t-direction (debugging) */
  bmin = [0, 0];
  bmax = [0, 0];
  /*** state needed for the line sweep ***/
  /* rule for determining polygon interior */
  windingRule = me.ODD;
  dict = null;
  /* edge dictionary for sweep line */
  pq = null;
  /* priority queue of vertex events */
  event = null;
  /* current sweep event being processed */
  vertexIndexCounter = 0;
  vertices = [];
  vertexIndices = [];
  vertexCount = 0;
  elements = [];
  elementCount = 0;
  dot_(e, n) {
    return e[0] * n[0] + e[1] * n[1] + e[2] * n[2];
  }
  normalize_(e) {
    let n = e[0] * e[0] + e[1] * e[1] + e[2] * e[2];
    if (!n)
      throw "Zero-size vector!";
    n = Math.sqrt(n), e[0] /= n, e[1] /= n, e[2] /= n;
  }
  longAxis_(e) {
    let n = 0;
    return Math.abs(e[1]) > Math.abs(e[0]) && (n = 1), Math.abs(e[2]) > Math.abs(e[n]) && (n = 2), n;
  }
  computeNormal_(e) {
    let n, s, i, r, c, a, l = [0, 0, 0], h = [0, 0, 0], u = [0, 0, 0], f = [0, 0, 0], d = [0, 0, 0];
    const y = [null, null, null], x = [null, null, null], g = this.mesh.vHead;
    n = g.next;
    for (let M = 0; M < 3; ++M)
      r = n.coords[M], h[M] = r, x[M] = n, l[M] = r, y[M] = n;
    for (n = g.next; n !== g; n = n.next)
      for (let M = 0; M < 3; ++M)
        r = n.coords[M], r < h[M] && (h[M] = r, x[M] = n), r > l[M] && (l[M] = r, y[M] = n);
    let w = 0;
    if (l[1] - h[1] > l[0] - h[0] && (w = 1), l[2] - h[2] > l[w] - h[w] && (w = 2), h[w] >= l[w]) {
      e[0] = 0, e[1] = 0, e[2] = 1;
      return;
    }
    for (a = 0, s = x[w], i = y[w], u[0] = s.coords[0] - i.coords[0], u[1] = s.coords[1] - i.coords[1], u[2] = s.coords[2] - i.coords[2], n = g.next; n !== g; n = n.next)
      f[0] = n.coords[0] - i.coords[0], f[1] = n.coords[1] - i.coords[1], f[2] = n.coords[2] - i.coords[2], d[0] = u[1] * f[2] - u[2] * f[1], d[1] = u[2] * f[0] - u[0] * f[2], d[2] = u[0] * f[1] - u[1] * f[0], c = d[0] * d[0] + d[1] * d[1] + d[2] * d[2], c > a && (a = c, e[0] = d[0], e[1] = d[1], e[2] = d[2]);
    a <= 0 && (e[0] = e[1] = e[2] = 0, e[this.longAxis_(u)] = 1);
  }
  checkOrientation_() {
    var e = this.mesh.fHead, n, s = this.mesh.vHead, i;
    let r = 0;
    for (let c = e.next; c !== e; c = c.next)
      if (i = c.anEdge, !(i.winding <= 0))
        do
          r += (i.Org.s - i.Dst.s) * (i.Org.t + i.Dst.t), i = i.Lnext;
        while (i !== c.anEdge);
    if (r < 0) {
      for (n = s.next; n !== s; n = n.next)
        n.t = -n.t;
      this.tUnit[0] = -this.tUnit[0], this.tUnit[1] = -this.tUnit[1], this.tUnit[2] = -this.tUnit[2];
    }
  }
  /*	#ifdef FOR_TRITE_TEST_PROGRAM
  	#include <stdlib.h>
  	extern int RandomSweep;
  	#define S_UNIT_X	(RandomSweep ? (2*drand48()-1) : 1.0)
  	#define S_UNIT_Y	(RandomSweep ? (2*drand48()-1) : 0.0)
  	#else
  	#if defined(SLANTED_SWEEP) */
  /* The "feature merging" is not intended to be complete.  There are
   * special cases where edges are nearly parallel to the sweep line
   * which are not implemented.  The algorithm should still behave
   * robustly (ie. produce a reasonable tesselation) in the presence
   * of such edges, however it may miss features which could have been
   * merged.  We could minimize this effect by choosing the sweep line
   * direction to be something unusual (ie. not parallel to one of the
   * coordinate axes).
   */
  /*	#define S_UNIT_X	(TESSreal)0.50941539564955385	// Pre-normalized
  	#define S_UNIT_Y	(TESSreal)0.86052074622010633
  	#else
  	#define S_UNIT_X	(TESSreal)1.0
  	#define S_UNIT_Y	(TESSreal)0.0
  	#endif
  	#endif*/
  /* Determine the polygon normal and project vertices onto the plane
   * of the polygon.
   */
  projectPolygon_() {
    let e = this.mesh.vHead, n = [0, 0, 0], s, i, r = !1;
    n[0] = this.normal[0], n[1] = this.normal[1], n[2] = this.normal[2], !n[0] && !n[1] && !n[2] && (this.computeNormal_(n), r = !0), s = this.sUnit, i = this.tUnit;
    let c = this.longAxis_(n);
    s[c] = 0, s[(c + 1) % 3] = 1, s[(c + 2) % 3] = 0, i[c] = 0, i[(c + 1) % 3] = 0, i[(c + 2) % 3] = n[c] > 0 ? 1 : -1;
    for (let l = e.next; l !== e; l = l.next)
      l.s = this.dot_(l.coords, s), l.t = this.dot_(l.coords, i);
    r && this.checkOrientation_();
    let a = !0;
    for (let l = e.next; l !== e; l = l.next)
      a ? (this.bmin[0] = this.bmax[0] = l.s, this.bmin[1] = this.bmax[1] = l.t, a = !1) : (l.s < this.bmin[0] && (this.bmin[0] = l.s), l.s > this.bmax[0] && (this.bmax[0] = l.s), l.t < this.bmin[1] && (this.bmin[1] = l.t), l.t > this.bmax[1] && (this.bmax[1] = l.t));
  }
  addWinding_(e, n) {
    e.winding += n.winding, e.Sym.winding += n.Sym.winding;
  }
  /* tessMeshTessellateMonoRegion( face ) tessellates a monotone region
   * (what else would it do??)  The region must consist of a single
   * loop of half-edges (see mesh.h) oriented CCW.  "Monotone" in this
   * case means that any vertical line intersects the interior of the
   * region in a single interval.
   *
   * Tessellation consists of adding interior edges (actually pairs of
   * half-edges), to split the region into non-overlapping triangles.
   *
   * The basic idea is explained in Preparata and Shamos (which I don''t
   * have handy right now), although their implementation is more
   * complicated than this one.  The are two edge chains, an upper chain
   * and a lower chain.  We process all vertices from both chains in order,
   * from right to left.
   *
   * The algorithm ensures that the following invariant holds after each
   * vertex is processed: the untessellated region consists of two
   * chains, where one chain (say the upper) is a single edge, and
   * the other chain is concave.  The left vertex of the single edge
   * is always to the left of all vertices in the concave chain.
   *
   * Each step consists of adding the rightmost unprocessed vertex to one
   * of the two chains, and forming a fan of triangles from the rightmost
   * of two chain endpoints.  Determining whether we can add each triangle
   * to the fan is a simple orientation test.  By making the fan as large
   * as possible, we restore the invariant (check it yourself).
   */
  //	int tessMeshTessellateMonoRegion( TESSmesh *mesh, TESSface *face )
  tessellateMonoRegion_(e, n) {
    let s, i;
    if (s = n.anEdge, !(s.Lnext !== s && s.Lnext.Lnext !== s))
      throw "Mono region invalid";
    for (; nt.vertLeq(s.Dst, s.Org); s = s.Lprev) ;
    for (; nt.vertLeq(s.Org, s.Dst); s = s.Lnext) ;
    i = s.Lprev;
    let r;
    for (; s.Lnext !== i; )
      if (nt.vertLeq(s.Dst, i.Org)) {
        for (; i.Lnext !== s && (nt.edgeGoesLeft(i.Lnext) || nt.edgeSign(i.Org, i.Dst, i.Lnext.Dst) <= 0); )
          r = e.connect(i.Lnext, i), i = r.Sym;
        i = i.Lprev;
      } else {
        for (; i.Lnext !== s && (nt.edgeGoesRight(s.Lprev) || nt.edgeSign(s.Dst, s.Org, s.Lprev.Org) >= 0); )
          r = e.connect(s, s.Lprev), s = r.Sym;
        s = s.Lnext;
      }
    if (i.Lnext === s)
      throw "Mono region invalid";
    for (; i.Lnext.Lnext !== s; )
      r = e.connect(i.Lnext, i), i = r.Sym;
    return !0;
  }
  /* tessMeshTessellateInterior( mesh ) tessellates each region of
   * the mesh which is marked "inside" the polygon.  Each such region
   * must be monotone.
   */
  //int tessMeshTessellateInterior( TESSmesh *mesh )
  tessellateInterior_(e) {
    let n;
    for (let s = e.fHead.next; s !== e.fHead; s = n)
      if (n = s.next, s.inside && !this.tessellateMonoRegion_(e, s))
        return !1;
    return !0;
  }
  /* tessMeshDiscardExterior( mesh ) zaps (ie. sets to NULL) all faces
   * which are not marked "inside" the polygon.  Since further mesh operations
   * on NULL faces are not allowed, the main purpose is to clean up the
   * mesh so that exterior loops are not represented in the data structure.
   */
  //void tessMeshDiscardExterior( TESSmesh *mesh )
  discardExterior_(e) {
    let n;
    for (let s = e.fHead.next; s !== e.fHead; s = n)
      n = s.next, s.inside || e.zapFace(s);
  }
  /* tessMeshSetWindingNumber( mesh, value, keepOnlyBoundary ) resets the
   * winding numbers on all edges so that regions marked "inside" the
   * polygon have a winding number of "value", and regions outside
   * have a winding number of 0.
   *
   * If keepOnlyBoundary is TRUE, it also deletes all edges which do not
   * separate an interior region from an exterior one.
   */
  //	int tessMeshSetWindingNumber( TESSmesh *mesh, int value, int keepOnlyBoundary )
  setWindingNumber_(e, n, s) {
    let i;
    for (let r = e.eHead.next; r !== e.eHead; r = i)
      i = r.next, r.Rface.inside !== r.Lface.inside ? r.winding = r.Lface.inside ? n : -n : s ? e.delete(r) : r.winding = 0;
  }
  getNeighbourFace_(e) {
    return !e.Rface || !e.Rface.inside ? -1 : e.Rface.n;
  }
  outputPolymesh_(e, n, s, i) {
    let r, c = 0, a = 0, l;
    s > 3 && e.mergeConvexFaces(s);
    for (let f = e.vHead.next; f !== e.vHead; f = f.next)
      f.n = -1;
    for (let f = e.fHead.next; f !== e.fHead; f = f.next)
      if (f.n = -1, !!f.inside) {
        r = f.anEdge, l = 0;
        do {
          let d = r.Org;
          d.n === -1 && (d.n = a, a++), l++, r = r.Lnext;
        } while (r !== f.anEdge);
        if (l > s)
          throw "Face vertex greater that support polygon";
        f.n = c, ++c;
      }
    this.elementCount = c, n === ze.CONNECTED_POLYGONS && (c *= 2), this.elements = [], this.elements.length = c * s, this.vertexCount = a, this.vertices = [], this.vertices.length = a * i, this.vertexIndices = [], this.vertexIndices.length = a;
    for (let f = e.vHead.next; f !== e.vHead; f = f.next)
      if (f.n !== -1) {
        var h = f.n * i;
        this.vertices[h + 0] = f.coords[0], this.vertices[h + 1] = f.coords[1], i > 2 && (this.vertices[h + 2] = f.coords[2]), this.vertexIndices[f.n] = f.idx;
      }
    let u = 0;
    for (let f = e.fHead.next; f !== e.fHead; f = f.next)
      if (f.inside) {
        r = f.anEdge, l = 0;
        do {
          let d = r.Org;
          this.elements[u++] = d.n, l++, r = r.Lnext;
        } while (r !== f.anEdge);
        for (let d = l; d < s; ++d)
          this.elements[u++] = -1;
        if (n === ze.CONNECTED_POLYGONS) {
          r = f.anEdge;
          do
            this.elements[u++] = this.getNeighbourFace_(r), r = r.Lnext;
          while (r !== f.anEdge);
          for (let d = l; d < s; ++d)
            this.elements[u++] = -1;
        }
      }
  }
  //	void OutputContours( TESStesselator *tess, TESSmesh *mesh, int vertexSize )
  outputContours_(e, n) {
    let s, i, r = 0, c = 0;
    this.vertexCount = 0, this.elementCount = 0;
    for (let u = e.fHead.next; u !== e.fHead; u = u.next)
      if (u.inside) {
        i = s = u.anEdge;
        do
          this.vertexCount++, s = s.Lnext;
        while (s !== i);
        this.elementCount++;
      }
    this.elements = [], this.elements.length = this.elementCount * 2, this.vertices = [], this.vertices.length = this.vertexCount * n, this.vertexIndices = [], this.vertexIndices.length = this.vertexCount;
    let a = 0, l = 0, h = 0;
    r = 0;
    for (let u = e.fHead.next; u !== e.fHead; u = u.next)
      if (u.inside) {
        c = 0, i = s = u.anEdge;
        do
          this.vertices[a++] = s.Org.coords[0], this.vertices[a++] = s.Org.coords[1], n > 2 && (this.vertices[a++] = s.Org.coords[2]), this.vertexIndices[l++] = s.Org.idx, c++, s = s.Lnext;
        while (s !== i);
        this.elements[h++] = r, this.elements[h++] = c, r += c;
      }
  }
  addContour(e, n) {
    this.mesh === null && (this.mesh = new No()), e < 2 && (e = 2), e > 3 && (e = 3);
    let s = null;
    for (let i = 0; i < n.length; i += e)
      s === null ? (s = this.mesh.makeEdge(), this.mesh.splice(s, s.Sym)) : (this.mesh.splitEdge(s), s = s.Lnext), s.Org.coords[0] = n[i + 0], s.Org.coords[1] = n[i + 1], e > 2 ? s.Org.coords[2] = n[i + 2] : s.Org.coords[2] = 0, s.Org.idx = this.vertexIndexCounter++, s.winding = 1, s.Sym.winding = -1;
  }
  //	int tessTesselate( TESStesselator *tess, int windingRule, int elementType, int polySize, int vertexSize, const TESSreal* normal )
  /**
   * Run tesselation
   * @param windingRule 
   * @param elementType 
   * @param polySize 
   * @param vertexSize 
   * @param normal 
   * @param validate UNSAFE! Skip mesh validation pass, may throw any error.
   */
  tesselate(e = me.ODD, n = ze.POLYGONS, s, i, r, c = !0) {
    if (this.vertices = [], this.elements = [], this.vertexIndices = [], this.vertexIndexCounter = 0, r && (this.normal[0] = r[0], this.normal[1] = r[1], this.normal[2] = r[2]), this.windingRule = e, i < 2 && (i = 2), i > 3 && (i = 3), !this.mesh)
      return !1;
    this.projectPolygon_(), tt.computeInterior(this, c);
    var a = this.mesh;
    return n === ze.BOUNDARY_CONTOURS ? this.setWindingNumber_(a, 1, !0) : this.tessellateInterior_(a), c && a.check(), n === ze.BOUNDARY_CONTOURS ? this.outputContours_(a, i) : this.outputPolymesh_(
      a,
      n,
      s,
      i
    ), !0;
  }
}
function n0({
  windingRule: o = me.ODD,
  elementType: e = ze.POLYGONS,
  polySize: n = 3,
  vertexSize: s = 2,
  normal: i = [0, 0, 1],
  contours: r = [],
  strict: c = !0,
  debug: a = !1
}) {
  if (!r && c)
    throw new Error("Contours can't be empty");
  if (!r)
    return;
  const l = new pa();
  for (let h = 0; h < r.length; h++)
    l.addContour(s || 2, r[h]);
  return l.tesselate(
    o,
    e,
    n,
    s,
    i,
    c
  ), {
    vertices: l.vertices,
    vertexIndices: l.vertexIndices,
    vertexCount: l.vertexCount,
    elements: l.elements,
    elementCount: l.elementCount,
    mesh: a ? l.mesh : void 0
  };
}
const s0 = me.ODD, i0 = me.NONZERO, r0 = me.POSITIVE, o0 = me.NEGATIVE, c0 = me.ABS_GEQ_TWO, a0 = ze.POLYGONS, l0 = ze.CONNECTED_POLYGONS, h0 = ze.BOUNDARY_CONTOURS, k1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BOUNDARY_CONTOURS: h0,
  CONNECTED_POLYGONS: l0,
  ELEMENT: ze,
  POLYGONS: a0,
  Tesselator: pa,
  WINDING: me,
  WINDING_ABS_GEQ_TWO: c0,
  WINDING_NEGATIVE: o0,
  WINDING_NONZERO: i0,
  WINDING_ODD: s0,
  WINDING_POSITIVE: r0,
  tesselate: n0
}, Symbol.toStringTag, { value: "Module" })), Ds = /* @__PURE__ */ new Set();
let Tr = !1;
function u0(o, e, n = 2) {
  const s = e && e.length, i = s ? e[0] * n : o.length;
  Ds.size && Ds.clear();
  let r = ma(o, 0, i, n, !0);
  const c = [];
  if (!r || r.next === r.prev) return c;
  let a = 0, l = 0, h = 0;
  if (s && (r = p0(o, e, r, n)), o.length > 80 * n) {
    a = o[0], l = o[1];
    let u = a, f = l;
    for (let d = n; d < i; d += n) {
      const y = o[d], x = o[d + 1];
      y < a && (a = y), x < l && (l = x), y > u && (u = y), x > f && (f = x);
    }
    h = Math.max(u - a, f - l), h = h !== 0 ? 32767 / h : 0;
  }
  return Pr(r, c, a, l, h), c;
}
function ma(o, e, n, s, i) {
  let r = null;
  if (i === qr(o, e, n, s) > 0)
    for (let c = e; c < n; c += s) r = Xo(c / s | 0, o[c], o[c + 1], r);
  else
    for (let c = n - s; c >= e; c -= s) r = Xo(c / s | 0, o[c], o[c + 1], r);
  return r && Os(r, r.next) && (Rs(r), r = r.next), r;
}
function Ln(o, e = o) {
  const n = e === o;
  let s = o, i;
  do
    i = !1, s !== s.next && (Ds.size === 0 || !Ds.has(s)) && (Os(s, s.next) || Gt(s.prev, s, s.next) === 0) ? ((n || s === e) && (e = s.prev), Tr = !0, Rs(s), s = s.prev, i = !0) : (n || s !== e) && (s = s.next, i = !n);
  while (i || s !== e);
  return e;
}
function Pr(o, e, n, s, i) {
  i && _0(o, n, s, i);
  let r = o, c = !1;
  for (; o.prev !== o.next; ) {
    const a = o.prev, l = o.next;
    if (Gt(a, o, l) < 0 && (i ? d0(o, n, s, i) : f0(o))) {
      e.push(a.i, o.i, l.i), Rs(o), o = l, r = l;
      continue;
    }
    if (o = l, o === r) {
      if (Tr = !1, o = Ln(o), Tr) {
        r = o;
        continue;
      }
      if (!c) {
        o = y0(o, e), r = o, c = !0;
        continue;
      }
      x0(o, e, n, s, i);
      break;
    }
  }
}
function f0(o) {
  const e = o.prev, n = o, s = o.next, i = e.x, r = n.x, c = s.x, a = e.y, l = n.y, h = s.y, u = Math.min(i, r, c), f = Math.min(a, l, h), d = Math.max(i, r, c), y = Math.max(a, l, h);
  let x = s.next;
  for (; x !== e; ) {
    if (x.x >= u && x.x <= d && x.y >= f && x.y <= y && !(i === x.x && a === x.y) && Li(i, a, r, l, c, h, x.x, x.y) && Gt(x.prev, x, x.next) >= 0) return !1;
    x = x.next;
  }
  return !0;
}
function d0(o, e, n, s) {
  const i = o.prev, r = o, c = o.next, a = i.x, l = r.x, h = c.x, u = i.y, f = r.y, d = c.y, y = Math.min(a, l, h), x = Math.min(u, f, d), g = Math.max(a, l, h), w = Math.max(u, f, d), M = Sr(y, x, e, n, s), P = Sr(g, w, e, n, s);
  let S = o.prevZ;
  for (; S && S.z >= M; ) {
    if (S.x >= y && S.x <= g && S.y >= x && S.y <= w && S !== c && !(a === S.x && u === S.y) && Li(a, u, l, f, h, d, S.x, S.y) && Gt(S.prev, S, S.next) >= 0) return !1;
    S = S.prevZ;
  }
  let k = o.nextZ;
  for (; k && k.z <= P; ) {
    if (k.x >= y && k.x <= g && k.y >= x && k.y <= w && k !== c && !(a === k.x && u === k.y) && Li(a, u, l, f, h, d, k.x, k.y) && Gt(k.prev, k, k.next) >= 0) return !1;
    k = k.nextZ;
  }
  return !0;
}
function y0(o, e) {
  let n = o, s = !1;
  do {
    const i = n.prev, r = n.next.next;
    va(i, n, n.next, r, !1) && ks(i, r) && ks(r, i) && (e.push(i.i, n.i, r.i), Rs(n), Rs(n.next), n = o = r, s = !0), n = n.next;
  } while (n !== o);
  return s ? Ln(n) : n;
}
function x0(o, e, n, s, i) {
  let r = o;
  do {
    let c = r.next.next;
    for (; c !== r.prev; ) {
      if (r.i !== c.i && A0(r, c)) {
        let a = Ma(r, c);
        r = Ln(r, r.next), a = Ln(a, a.next), Pr(r, e, n, s, i), Pr(a, e, n, s, i);
        return;
      }
      c = c.next;
    }
    r = r.next;
  } while (r !== o);
}
let Ar = !1;
function p0(o, e, n, s) {
  const i = [];
  for (let r = 0, c = e.length; r < c; r++) {
    const a = e[r] * s, l = r < c - 1 ? e[r + 1] * s : o.length, h = ma(o, a, l, s, !1);
    h === h.next && Ds.add(h), i.push(P0(h));
  }
  i.sort(m0), w0(o.length / s, e.length), wa(n, n), Ar = !0;
  for (let r = 0; r < i.length; r++)
    n = g0(i[r], n);
  return Ar = !1, Ln(n);
}
function m0(o, e) {
  return o.x - e.x || o.y - e.y || (o.next.y - o.y) / (o.next.x - o.x) - (e.next.y - e.y) / (e.next.x - e.x);
}
function g0(o, e) {
  const n = M0(o, e);
  if (!n)
    return e;
  const s = Ma(n, o), i = s.next;
  return wa(n, i.next), Ln(s, s.next), Ln(n, n.next);
}
const ga = 16;
let Yt = new Float64Array(0), Ei = 0;
const Er = [], Lr = [];
function w0(o, e) {
  const n = Math.ceil((o + 2 * e) / ga) + e + 2;
  Yt.length < n * 4 && (Yt = new Float64Array(n * 4)), Ei = 0;
}
function wa(o, e) {
  let n = o;
  do {
    const s = Ei++;
    Er[s] = n;
    let i = 1 / 0, r = 1 / 0, c = -1 / 0, a = -1 / 0, l = 0;
    do {
      const u = n.next;
      n.z = s, n.x < i && (i = n.x), n.x > c && (c = n.x), n.y < r && (r = n.y), n.y > a && (a = n.y), u.x < i && (i = u.x), u.x > c && (c = u.x), u.y < r && (r = u.y), u.y > a && (a = u.y), n = u;
    } while (++l < ga && n !== e);
    Lr[s] = n;
    const h = s * 4;
    Yt[h] = i, Yt[h + 1] = r, Yt[h + 2] = c, Yt[h + 3] = a;
  } while (n !== e);
}
function v0(o, e) {
  const n = o.z * 4;
  e.x < Yt[n] && (Yt[n] = e.x), e.y < Yt[n + 1] && (Yt[n + 1] = e.y), e.x > Yt[n + 2] && (Yt[n + 2] = e.x), e.y > Yt[n + 3] && (Yt[n + 3] = e.y);
}
function Vo(o) {
  let e = Lr[o];
  for (; e.prev.next !== e; ) e = e.next;
  return Lr[o] = e, e;
}
function Uo(o) {
  let e = Er[o];
  for (; e.prev.next !== e; ) e = e.next;
  return Er[o] = e, e;
}
function M0(o, e) {
  let n = e;
  const s = o.x, i = o.y;
  let r = -1 / 0, c;
  if (Os(o, n)) return n;
  for (let d = 0, y = 0; d < Ei; d++, y += 4) {
    if (i < Yt[y + 1] || i > Yt[y + 3] || Yt[y] > s || Yt[y + 2] <= r) continue;
    const x = Vo(d);
    n = Uo(d);
    do {
      if (n.prev.next === n) {
        if (Os(o, n.next)) return n.next;
        if (i <= n.y && i >= n.next.y && n.next.y !== n.y) {
          const g = n.x + (i - n.y) * (n.next.x - n.x) / (n.next.y - n.y);
          if (g <= s && g > r && (r = g, c = n.x < n.next.x ? n : n.next, g === s))
            return c;
        }
      }
      n = n.next;
    } while (n !== x);
  }
  if (!c) return null;
  const a = c.x, l = c.y, h = Math.min(i, l), u = Math.max(i, l);
  let f = 1 / 0;
  for (let d = 0, y = 0; d < Ei; d++, y += 4) {
    if (Yt[y + 2] < a || Yt[y] > s || Yt[y + 3] < h || Yt[y + 1] > u) continue;
    const x = Vo(d);
    n = Uo(d);
    do {
      if (n.prev.next === n && s >= n.x && n.x >= a && s !== n.x && Li(i < l ? s : r, i, a, l, i < l ? r : s, i, n.x, n.y)) {
        const g = Math.abs(i - n.y) / (s - n.x);
        (ks(n, o) || n.y === i && n.next.y === i && n.next.x > s) && (g < f || g === f && (n.x > c.x || n.x === c.x && b0(c, n))) && (c = n, f = g);
      }
      n = n.next;
    } while (n !== x);
  }
  return c;
}
function b0(o, e) {
  return Gt(o.prev, o, e.prev) < 0 && Gt(e.next, o, o.next) < 0;
}
const Ee = [];
let os = [], gn = new Uint32Array(0), cs = new Uint32Array(0);
const as = new Uint32Array(256);
function _0(o, e, n, s) {
  let i = o, r = 0;
  do
    i.z = Sr(i.x, i.y, e, n, s), Ee[r++] = i, i = i.next;
  while (i !== o);
  T0(r);
  let c = null;
  for (let a = 0; a < r; a++) {
    const l = Ee[a];
    l.prevZ = c, c && (c.nextZ = l), c = l;
  }
  c.nextZ = null;
}
function T0(o) {
  if (o <= 32) {
    for (let e = 1; e < o; e++) {
      const n = Ee[e], s = n.z;
      let i = e - 1;
      for (; i >= 0 && Ee[i].z > s; )
        Ee[i + 1] = Ee[i], i--;
      Ee[i + 1] = n;
    }
    return;
  }
  gn.length < o && (gn = new Uint32Array(o), cs = new Uint32Array(o), os = new Array(o));
  for (let e = 0; e < o; e++) gn[e] = Ee[e].z;
  ui(o, Ee, gn, os, cs, 0), ui(o, os, cs, Ee, gn, 8), ui(o, Ee, gn, os, cs, 16), ui(o, os, cs, Ee, gn, 24);
}
function ui(o, e, n, s, i, r) {
  as.fill(0);
  for (let a = 0; a < o; a++) as[n[a] >>> r & 255]++;
  let c = 0;
  for (let a = 0; a < 256; a++) {
    const l = as[a];
    as[a] = c, c += l;
  }
  for (let a = 0; a < o; a++) {
    const l = n[a], h = as[l >>> r & 255]++;
    s[h] = e[a], i[h] = l;
  }
}
function Sr(o, e, n, s, i) {
  return o = (o - n) * i | 0, e = (e - s) * i | 0, o = (o | o << 8) & 16711935, o = (o | o << 4) & 252645135, o = (o | o << 2) & 858993459, o = (o | o << 1) & 1431655765, e = (e | e << 8) & 16711935, e = (e | e << 4) & 252645135, e = (e | e << 2) & 858993459, e = (e | e << 1) & 1431655765, o | e << 1;
}
function P0(o) {
  let e = o, n = o;
  do
    (e.x < n.x || e.x === n.x && e.y < n.y) && (n = e), e = e.next;
  while (e !== o);
  return n;
}
function Li(o, e, n, s, i, r, c, a) {
  return (i - c) * (e - a) >= (o - c) * (r - a) && (o - c) * (s - a) >= (n - c) * (e - a) && (n - c) * (r - a) >= (i - c) * (s - a);
}
function A0(o, e) {
  const n = Os(o, e) && Gt(o.prev, o, o.next) > 0 && Gt(e.prev, e, e.next) > 0;
  return o.next.i !== e.i && (n || ks(o, e) && ks(e, o) && (Gt(o.prev, o, e.prev) !== 0 || Gt(o, e.prev, e) !== 0)) && !E0(o, e) && (n || L0(o, e));
}
function Gt(o, e, n) {
  return (e.y - o.y) * (n.x - e.x) - (e.x - o.x) * (n.y - e.y);
}
function Os(o, e) {
  return o.x === e.x && o.y === e.y;
}
function va(o, e, n, s, i = !0) {
  const r = Gt(o, e, n), c = Gt(o, e, s), a = Gt(n, s, o), l = Gt(n, s, e);
  return (r > 0 && c < 0 || r < 0 && c > 0) && (a > 0 && l < 0 || a < 0 && l > 0) ? !0 : i ? !!(r === 0 && fi(o, n, e) || c === 0 && fi(o, s, e) || a === 0 && fi(n, o, s) || l === 0 && fi(n, e, s)) : !1;
}
function fi(o, e, n) {
  return e.x <= Math.max(o.x, n.x) && e.x >= Math.min(o.x, n.x) && e.y <= Math.max(o.y, n.y) && e.y >= Math.min(o.y, n.y);
}
function E0(o, e) {
  const n = Math.min(o.x, e.x), s = Math.max(o.x, e.x), i = Math.min(o.y, e.y), r = Math.max(o.y, e.y);
  let c = o;
  do {
    const a = c.next;
    if (c.x > s && a.x > s || c.x < n && a.x < n || c.y > r && a.y > r || c.y < i && a.y < i) {
      c = a;
      continue;
    }
    if (c.i !== o.i && a.i !== o.i && c.i !== e.i && a.i !== e.i && va(c, a, o, e)) return !0;
    c = a;
  } while (c !== o);
  return !1;
}
function ks(o, e) {
  return Gt(o.prev, o, o.next) < 0 ? Gt(o, e, o.next) >= 0 && Gt(o, o.prev, e) >= 0 : Gt(o, e, o.prev) < 0 || Gt(o, o.next, e) < 0;
}
function L0(o, e) {
  let n = o, s = !1;
  const i = (o.x + e.x) / 2, r = (o.y + e.y) / 2;
  do {
    const c = n.next;
    n.y > r != c.y > r && i < (c.x - n.x) * (r - n.y) / (c.y - n.y) + n.x && (s = !s), n = c;
  } while (n !== o);
  return s;
}
function Ma(o, e) {
  const n = Ir(o.i, o.x, o.y), s = Ir(e.i, e.x, e.y), i = o.next, r = e.prev;
  return o.next = e, e.prev = o, n.next = i, i.prev = n, s.next = n, n.prev = s, r.next = s, s.prev = r, s;
}
function Xo(o, e, n, s) {
  const i = Ir(o, e, n);
  return s ? (i.next = s.next, i.prev = s, s.next.prev = i, s.next = i) : (i.prev = i, i.next = i), i;
}
function Rs(o) {
  o.next.prev = o.prev, o.prev.next = o.next, o.prevZ && (o.prevZ.nextZ = o.nextZ), o.nextZ && (o.nextZ.prevZ = o.prevZ), Ar && v0(o.prev, o.next);
}
function Ir(o, e, n) {
  return { i: o, x: e, y: n, prev: null, next: null, z: 0, prevZ: null, nextZ: null };
}
function S0(o, e, n, s) {
  const i = e && e.length, r = i ? e[0] * n : o.length;
  let c = Math.abs(qr(o, 0, r, n));
  if (i)
    for (let l = 0, h = e.length; l < h; l++) {
      const u = e[l] * n, f = l < h - 1 ? e[l + 1] * n : o.length;
      c -= Math.abs(qr(o, u, f, n));
    }
  let a = 0;
  for (let l = 0; l < s.length; l += 3) {
    const h = s[l] * n, u = s[l + 1] * n, f = s[l + 2] * n;
    a += Math.abs(
      (o[h] - o[f]) * (o[u + 1] - o[h + 1]) - (o[h] - o[u]) * (o[f + 1] - o[h + 1])
    );
  }
  return c === 0 && a === 0 ? 0 : Math.abs((a - c) / c);
}
function qr(o, e, n, s) {
  let i = 0;
  for (let r = e, c = n - s; r < n; r += s)
    i += (o[c] - o[r]) * (o[r + 1] + o[c + 1]), c = r;
  return i;
}
function I0(o) {
  const e = [], n = [], s = o[0][0].length;
  let i = 0, r = 0;
  for (const c of o) {
    for (const a of c)
      for (let l = 0; l < s; l++) e.push(a[l]);
    r && (i += r, n.push(i)), r = c.length;
  }
  return { vertices: e, holes: n, dimensions: s };
}
let Je, ne, Gn, wi, Pe, Dr = 0, di = 0;
function q0(o, e, n = 2) {
  const s = o, i = s.length;
  if (i < 6) return;
  O0(i), di++, ne.fill(-1, 0, i);
  let r = 0;
  for (let c = 0; c < i; c++) {
    const a = s[c], l = s[$o(c)], h = a < l ? a : l, u = a < l ? l : a;
    let f = (Math.imul(h, 2654435761) ^ Math.imul(u, 2246822507)) & Dr;
    for (; wi[f] === di; ) {
      const d = Gn[f];
      if (d !== -1) {
        const y = s[d], x = s[$o(d)];
        if (y === h && x === u || y === u && x === h) {
          ne[c] = d, ne[d] = c, Gn[f] = -1, Pe[d] = 1, Je[r++] = d;
          break;
        }
      }
      f = f + 1 & Dr;
    }
    wi[f] !== di && (Gn[f] = c, wi[f] = di);
  }
  for (; r > 0; ) {
    const c = Je[--r];
    Pe[c] = 0;
    const a = ne[c];
    if (a === -1) continue;
    const l = c - c % 3, h = a - a % 3, u = l + (c + 2) % 3, f = l + (c + 1) % 3, d = h + (a + 2) % 3, y = h + (a + 1) % 3, x = s[u], g = s[c], w = s[f], M = s[d], P = e[x * n], S = e[x * n + 1], k = e[g * n], O = e[g * n + 1], R = e[w * n], F = e[w * n + 1], Y = e[M * n], N = e[M * n + 1];
    if (!D0(P, S, k, O, R, F, Y, N) && Wo(P, S, k, O, Y, N) > 0 && Wo(P, S, Y, N, R, F) > 0) {
      s[c] = M, s[a] = x;
      const $ = ne[d], W = ne[u];
      ne[c] = $, $ !== -1 && (ne[$] = c), ne[a] = W, W !== -1 && (ne[W] = a), ne[u] = d, ne[d] = u, $ !== -1 && Pe[c] === 0 && (Pe[c] = 1, Je[r++] = c), W !== -1 && Pe[a] === 0 && (Pe[a] = 1, Je[r++] = a), ne[f] !== -1 && Pe[f] === 0 && (Pe[f] = 1, Je[r++] = f), ne[y] !== -1 && Pe[y] === 0 && (Pe[y] = 1, Je[r++] = y);
    }
  }
}
function Wo(o, e, n, s, i, r) {
  return (n - o) * (r - e) - (s - e) * (i - o);
}
function D0(o, e, n, s, i, r, c, a) {
  const l = o - c, h = e - a, u = n - c, f = s - a, d = i - c, y = r - a, x = l * l + h * h, g = u * u + f * f, w = d * d + y * y, M = x + g + w;
  return l * (f * w - g * y) - h * (u * w - g * d) + x * (u * y - f * d) <= 1e-13 * M * M;
}
function $o(o) {
  return o - o % 3 + (o + 1) % 3;
}
function O0(o) {
  (!Je || Je.length < o) && (Je = new Int32Array(o)), (!ne || ne.length < o) && (ne = new Int32Array(o)), (!Pe || Pe.length < o) && (Pe = new Uint8Array(o));
  let e = 1;
  for (; e < o * 4; ) e <<= 1;
  (!Gn || Gn.length < e) && (Gn = new Int32Array(e), wi = new Uint32Array(e)), Dr = e - 1;
}
const R1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: u0,
  deviation: S0,
  flatten: I0,
  refine: q0
}, Symbol.toStringTag, { value: "Module" })), k0 = 1e-9;
class sn {
  /** 点是否在边界上（epsilon 容差，无宽度） */
  isPointOnBoundary(e, n, s = k0) {
    return Math.abs(this.signedDistance(e, n)) <= s;
  }
  /**
   * 点是否在描边带内
   * - center: 描边以边界为中心，内外各 lineWidth/2
   * - inner : 描边向内偏移，整条宽度位于图形内部一侧
   * - outer : 描边向外偏移，整条宽度位于图形外部一侧
   */
  isPointOnStroke(e, n, s, i = "center") {
    const r = this.signedDistance(e, n), c = s * 0.5;
    switch (i) {
      case "center":
        return Math.abs(r) <= c;
      case "inner":
        return r >= 0 && r <= s;
      case "outer":
        return r <= 0 && r >= -s;
    }
    return !1;
  }
}
function F1(o, e, n, s, i, r) {
  const c = i - n, a = r - s, l = o - n, h = e - s, u = c * c + a * a;
  let f = u > 0 ? (l * c + h * a) / u : 0;
  f < 0 ? f = 0 : f > 1 && (f = 1);
  const d = n + f * c, y = s + f * a, x = o - d, g = e - y;
  return Math.sqrt(x * x + g * g);
}
function Zn(o, e, n, s, i, r) {
  const c = i - n, a = r - s, l = o - n, h = e - s, u = c * c + a * a;
  let f = u > 0 ? (l * c + h * a) / u : 0;
  f < 0 ? f = 0 : f > 1 && (f = 1);
  const d = n + f * c, y = s + f * a, x = o - d, g = e - y;
  return x * x + g * g;
}
function z1(o, e, n, s, i, r) {
  const c = i - n, a = r - s, l = o - n, h = e - s, u = c * c + a * a;
  let f = u > 0 ? (l * c + h * a) / u : 0;
  f < 0 ? f = 0 : f > 1 && (f = 1);
  const d = n + f * c, y = s + f * a, x = o - d, g = e - y;
  return (c * h - a * l >= 0 ? 1 : -1) * Math.sqrt(x * x + g * g);
}
function ln(o) {
  const e = Math.PI * 2;
  let n = o % e;
  return n < 0 && (n += e), n;
}
function C1(o, e, n, s) {
  let i = ln(e), r = ln(n), c = ln(o);
  if (!s) {
    const a = i;
    i = r, r = a;
  }
  return i <= r ? c >= i - 1e-9 && c <= r + 1e-9 : c >= i - 1e-9 || c <= r + 1e-9;
}
function N1(o, e) {
  const n = Math.PI * 2;
  let s = (e - o) % n;
  return s < -Math.PI ? s += n : s > Math.PI && (s -= n), Math.abs(s);
}
class H1 extends sn {
  x1;
  y1;
  x2;
  y2;
  constructor(e = 0, n = 0, s = 0, i = 0) {
    super(), this.x1 = e, this.y1 = n, this.x2 = s, this.y2 = i;
  }
  /** 线段长度 */
  length() {
    const e = this.x2 - this.x1, n = this.y2 - this.y1;
    return Math.sqrt(e * e + n * n);
  }
  /** 线段长度的平方 */
  lengthSquared() {
    const e = this.x2 - this.x1, n = this.y2 - this.y1;
    return e * e + n * n;
  }
  area() {
    return 0;
  }
  centroid(e) {
    const n = e || { x: 0, y: 0 };
    return n.x = (this.x1 + this.x2) * 0.5, n.y = (this.y1 + this.y2) * 0.5, n;
  }
  center(e) {
    return this.centroid(e);
  }
  perimeter() {
    return this.length();
  }
  /** 线段无内部，始终返回 false */
  contains(e, n) {
    return !1;
  }
  /**
   * 带符号距离：以线段方向为基准，左侧为正，右侧为负
   * 对开放曲线，inner/outer 描边的语义基于此符号
   */
  signedDistance(e, n) {
    const s = this.x2 - this.x1, i = this.y2 - this.y1, r = e - this.x1, c = n - this.y1, a = s * s + i * i;
    let l = a > 0 ? (r * s + c * i) / a : 0;
    l < 0 ? l = 0 : l > 1 && (l = 1);
    const h = this.x1 + l * s, u = this.y1 + l * i, f = e - h, d = n - u;
    return (s * c - i * r >= 0 ? 1 : -1) * Math.sqrt(f * f + d * d);
  }
  bounds(e) {
    const n = e || new Lt();
    return n.min.set(Math.min(this.x1, this.x2), Math.min(this.y1, this.y2)), n.max.set(Math.max(this.x1, this.x2), Math.max(this.y1, this.y2)), n;
  }
}
class B1 extends sn {
  x;
  y;
  width;
  height;
  constructor(e = 0, n = 0, s = 0, i = 0) {
    super(), this.x = e, this.y = n, this.width = s, this.height = i;
  }
  get right() {
    return this.x + this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  area() {
    return this.width * this.height;
  }
  centroid(e) {
    const n = e || { x: 0, y: 0 };
    return n.x = this.x + this.width * 0.5, n.y = this.y + this.height * 0.5, n;
  }
  center(e) {
    return this.centroid(e);
  }
  perimeter() {
    return 2 * (this.width + this.height);
  }
  contains(e, n) {
    return e > this.x && e < this.right && n > this.y && n < this.bottom;
  }
  /** 点在矩形内（含边界） */
  containsInclusive(e, n) {
    return e >= this.x && e <= this.right && n >= this.y && n <= this.bottom;
  }
  signedDistance(e, n) {
    const s = e - this.x, i = this.right - e, r = n - this.y, c = this.bottom - n;
    if (s >= 0 && i >= 0 && r >= 0 && c >= 0)
      return Math.min(s, i, r, c);
    const a = s < 0 ? this.x - e : i < 0 ? e - this.right : 0, l = r < 0 ? this.y - n : c < 0 ? n - this.bottom : 0;
    return -Math.sqrt(a * a + l * l);
  }
  bounds(e) {
    const n = e || new Lt();
    return n.min.set(this.x, this.y), n.max.set(this.right, this.bottom), n;
  }
}
class Y1 extends sn {
  ax;
  ay;
  bx;
  by;
  cx;
  cy;
  constructor(e = 0, n = 0, s = 0, i = 0, r = 0, c = 0) {
    super(), this.ax = e, this.ay = n, this.bx = s, this.by = i, this.cx = r, this.cy = c;
  }
  /** 有向面积（带符号，CCW 为正） */
  signedArea() {
    return ((this.bx - this.ax) * (this.cy - this.ay) - (this.by - this.ay) * (this.cx - this.ax)) * 0.5;
  }
  area() {
    return Math.abs(this.signedArea());
  }
  centroid(e) {
    const n = e || { x: 0, y: 0 };
    return n.x = (this.ax + this.bx + this.cx) / 3, n.y = (this.ay + this.by + this.cy) / 3, n;
  }
  center(e) {
    const n = e || { x: 0, y: 0 };
    return n.x = (Math.max(this.ax, this.bx, this.cx) + Math.min(this.ax, this.bx, this.cx)) * 0.5, n.y = (Math.max(this.ay, this.by, this.cy) + Math.min(this.ay, this.by, this.cy)) * 0.5, n;
  }
  perimeter() {
    const e = this.bx - this.ax, n = this.by - this.ay, s = this.cx - this.bx, i = this.cy - this.by, r = this.ax - this.cx, c = this.ay - this.cy;
    return Math.sqrt(e * e + n * n) + Math.sqrt(s * s + i * i) + Math.sqrt(r * r + c * c);
  }
  /**
   * 重心坐标法判断点是否在三角形内部
   * 使用同向法：点在三边的同侧
   */
  contains(e, n) {
    const s = this.ax, i = this.ay, r = this.bx, c = this.by, a = this.cx, l = this.cy, h = (e - r) * (i - c) - (s - r) * (n - c), u = (e - a) * (c - l) - (r - a) * (n - l), f = (e - s) * (l - i) - (a - s) * (n - i), d = h < 0 || u < 0 || f < 0, y = h > 0 || u > 0 || f > 0;
    return !(d && y);
  }
  signedDistance(e, n) {
    const s = Zn(e, n, this.ax, this.ay, this.bx, this.by), i = Zn(e, n, this.bx, this.by, this.cx, this.cy), r = Zn(e, n, this.cx, this.cy, this.ax, this.ay), c = Math.min(s, i, r), a = Math.sqrt(c);
    return this.contains(e, n) ? a : -a;
  }
  bounds(e) {
    const n = e || new Lt();
    return n.min.set(
      Math.min(this.ax, this.bx, this.cx),
      Math.min(this.ay, this.by, this.cy)
    ), n.max.set(
      Math.max(this.ax, this.bx, this.cx),
      Math.max(this.ay, this.by, this.cy)
    ), n;
  }
}
class ba extends sn {
  /** 扁平顶点数据 [x0,y0,x1,y1,...] */
  points;
  constructor(e = []) {
    super(), this.points = e;
  }
  /** 顶点数 */
  get vertexCount() {
    return this.points.length >> 1;
  }
  /** 从点对象数组构造 */
  static fromPoints(e) {
    const n = new Array(e.length * 2);
    for (let s = 0; s < e.length; s++)
      n[s * 2] = e[s].x, n[s * 2 + 1] = e[s].y;
    return new ba(n);
  }
  /**
   * 面积（带符号面积取绝对值）
   * Shoelace 公式：A = 0.5 * Σ (x_i * y_{i+1} - x_{i+1} * y_i)
   */
  signedArea() {
    const e = this.points, n = e.length;
    if (n < 6) return 0;
    let s = 0;
    for (let i = 0; i < n; i += 2) {
      const r = e[i], c = e[i + 1], a = e[(i + 2) % n], l = e[(i + 3) % n];
      s += r * l - a * c;
    }
    return s * 0.5;
  }
  area() {
    return Math.abs(this.signedArea());
  }
  /**
   * 重心（面积加权形心）
   * Cx = (1/6A) Σ (x_i + x_{i+1})(x_i y_{i+1} - x_{i+1} y_i)
   * Cy = (1/6A) Σ (y_i + y_{i+1})(x_i y_{i+1} - x_{i+1} y_i)
   */
  centroid(e) {
    const n = e || { x: 0, y: 0 }, s = this.points, i = s.length;
    if (i < 6)
      return i === 2 ? (n.x = s[0], n.y = s[1], n) : i === 4 ? (n.x = (s[0] + s[2]) * 0.5, n.y = (s[1] + s[3]) * 0.5, n) : (n.x = 0, n.y = 0, n);
    let r = 0, c = 0, a = 0;
    for (let h = 0; h < i; h += 2) {
      const u = s[h], f = s[h + 1], d = s[(h + 2) % i], y = s[(h + 3) % i], x = u * y - d * f;
      r += x, c += (u + d) * x, a += (f + y) * x;
    }
    const l = r * 3;
    if (Math.abs(l) > 1e-12)
      n.x = c / l, n.y = a / l;
    else {
      let h = 0, u = 0;
      const f = i >> 1;
      for (let d = 0; d < i; d += 2)
        h += s[d], u += s[d + 1];
      n.x = h / f, n.y = u / f;
    }
    return n;
  }
  center(e) {
    const n = e || { x: 0, y: 0 }, s = this.bounds();
    return n.x = s.centerX, n.y = s.centerY, n;
  }
  perimeter() {
    const e = this.points, n = e.length;
    if (n < 4) return 0;
    let s = 0;
    for (let i = 0; i < n; i += 2) {
      const r = e[i], c = e[i + 1], a = e[(i + 2) % n], l = e[(i + 3) % n], h = a - r, u = l - c;
      s += Math.sqrt(h * h + u * u);
    }
    return s;
  }
  /**
   * 射线投射法（even-odd 规则）
   * 性能：O(n)，无内存分配
   */
  contains(e, n) {
    const s = this.points, i = s.length;
    if (i < 6) return !1;
    let r = !1;
    for (let c = 0, a = i - 2; c < i; a = c, c += 2) {
      const l = s[c], h = s[c + 1], u = s[a], f = s[a + 1];
      h > n != f > n && e < (u - l) * (n - h) / (f - h) + l && (r = !r);
    }
    return r;
  }
  signedDistance(e, n) {
    const s = this.points, i = s.length;
    if (i < 4) return 1 / 0;
    let r = 1 / 0;
    for (let a = 0, l = i - 2; a < i; l = a, a += 2) {
      const h = Zn(
        e,
        n,
        s[l],
        s[l + 1],
        s[a],
        s[a + 1]
      );
      h < r && (r = h);
    }
    const c = Math.sqrt(r);
    return this.contains(e, n) ? c : -c;
  }
  bounds(e) {
    const n = e || new Lt(), s = this.points, i = s.length;
    if (i === 0)
      return n.setEmpty(), n;
    let r = s[0], c = s[1], a = s[0], l = s[1];
    for (let h = 2; h < i; h += 2) {
      const u = s[h], f = s[h + 1];
      u < r ? r = u : u > a && (a = u), f < c ? c = f : f > l && (l = f);
    }
    return n.min.set(r, c), n.max.set(a, l), n;
  }
}
class V1 extends sn {
  cx;
  cy;
  radius;
  constructor(e = 0, n = 0, s = 0) {
    super(), this.cx = e, this.cy = n, this.radius = s;
  }
  area() {
    const e = this.radius;
    return Math.PI * e * e;
  }
  centroid(e) {
    const n = e || { x: 0, y: 0 };
    return n.x = this.cx, n.y = this.cy, n;
  }
  center(e) {
    return this.centroid(e);
  }
  perimeter() {
    return 2 * Math.PI * this.radius;
  }
  /** 严格内部（不含边界） */
  contains(e, n) {
    const s = e - this.cx, i = n - this.cy, r = this.radius;
    return s * s + i * i < r * r;
  }
  /** 含边界 */
  containsInclusive(e, n) {
    const s = e - this.cx, i = n - this.cy, r = this.radius;
    return s * s + i * i <= r * r;
  }
  /**
   * 带符号距离：r - dist
   * 内部为正，外部为负，使用平方距离比较，避免 sqrt（仅在结果需要时调用）
   */
  signedDistance(e, n) {
    const s = e - this.cx, i = n - this.cy, r = Math.sqrt(s * s + i * i);
    return this.radius - r;
  }
  bounds(e) {
    const n = e || new Lt(), s = this.radius;
    return n.min.set(this.cx - s, this.cy - s), n.max.set(this.cx + s, this.cy + s), n;
  }
}
class U1 extends sn {
  cx;
  cy;
  radiusX;
  radiusY;
  constructor(e = 0, n = 0, s = 0, i = 0) {
    super(), this.cx = e, this.cy = n, this.radiusX = s, this.radiusY = i;
  }
  area() {
    return Math.PI * this.radiusX * this.radiusY;
  }
  /**
   * 周长（Ramanujan 近似，精度极高）
   * π [3(a+b) - sqrt((3a+b)(a+3b))]
   */
  perimeter() {
    const e = this.radiusX, n = this.radiusY;
    return Math.PI * (3 * (e + n) - Math.sqrt((3 * e + n) * (e + 3 * n)));
  }
  centroid(e) {
    const n = e || { x: 0, y: 0 };
    return n.x = this.cx, n.y = this.cy, n;
  }
  center(e) {
    return this.centroid(e);
  }
  /** 严格内部（不含边界） */
  contains(e, n) {
    const s = (e - this.cx) / this.radiusX, i = (n - this.cy) / this.radiusY;
    return s * s + i * i < 1;
  }
  containsInclusive(e, n) {
    const s = (e - this.cx) / this.radiusX, i = (n - this.cy) / this.radiusY;
    return s * s + i * i <= 1;
  }
  /**
   * 径向近似带符号距离
   * 思路：射线 (cx, cy) -> (x, y) 与椭圆边界交点距中心为 r_b，
   *       点距中心为 r_p，带符号距离 ≈ r_b - r_p（正为内）
   */
  signedDistance(e, n) {
    const s = e - this.cx, i = n - this.cy, r = this.radiusX, c = this.radiusY, a = Math.sqrt(s * s + i * i);
    if (a < 1e-12) return Math.min(r, c);
    const l = s / r, h = i / c, u = Math.sqrt(l * l + h * h);
    return a / u - a;
  }
  bounds(e) {
    const n = e || new Lt();
    return n.min.set(this.cx - this.radiusX, this.cy - this.radiusY), n.max.set(this.cx + this.radiusX, this.cy + this.radiusY), n;
  }
}
class X1 extends sn {
  cx;
  cy;
  radius;
  startAngle;
  endAngle;
  /** true=逆时针，false=顺时针 */
  ccw;
  constructor(e = 0, n = 0, s = 0, i = 0, r = 0, c = !1) {
    super(), this.cx = e, this.cy = n, this.radius = s, this.startAngle = i, this.endAngle = r, this.ccw = c;
  }
  /** 扫过角度（绝对值，弧度） */
  sweep() {
    const e = Math.PI * 2;
    let n = ln(this.startAngle), s = ln(this.endAngle);
    return this.ccw ? (s - n + e) % e : (n - s + e) % e;
  }
  /** 弦长 */
  chordLength() {
    const e = this.sweep();
    return 2 * this.radius * Math.sin(e * 0.5);
  }
  /** 扇形面积 = 0.5 * r² * sweep */
  area() {
    return 0.5 * this.radius * this.radius * this.sweep();
  }
  /** 弓形面积（弦+弧）= 扇形面积 - 三角形面积 */
  segmentArea() {
    const e = this.radius, n = this.sweep(), s = 0.5 * e * e * n, i = 0.5 * e * e * Math.sin(n);
    return Math.abs(s - i);
  }
  /**
   * 扇形重心
   * 沿角平分线方向，距圆心 (2 r sin(α/2)) / (3 α/2)，α=sweep
   */
  centroid(e) {
    const n = e || { x: 0, y: 0 }, s = this.sweep();
    if (s < 1e-9)
      return n.x = this.cx, n.y = this.cy, n;
    const i = this.ccw ? this.startAngle + s * 0.5 : this.startAngle - s * 0.5, r = s * 0.5, c = s < 1e-9 ? 0 : 2 * this.radius * Math.sin(r) / (3 * r);
    return n.x = this.cx + c * Math.cos(i), n.y = this.cy + c * Math.sin(i), n;
  }
  center(e) {
    const n = e || { x: 0, y: 0 };
    return n.x = this.cx, n.y = this.cy, n;
  }
  /** 周长 = 弧长 + 两段半径 */
  perimeter() {
    return this.radius * this.sweep() + 2 * this.radius;
  }
  /** 弧长（不含半径线段） */
  arcLength() {
    return this.radius * this.sweep();
  }
  /** 起点坐标 */
  startPoint(e) {
    const n = e || { x: 0, y: 0 };
    return n.x = this.cx + this.radius * Math.cos(this.startAngle), n.y = this.cy + this.radius * Math.sin(this.startAngle), n;
  }
  /** 终点坐标 */
  endPoint(e) {
    const n = e || { x: 0, y: 0 };
    return n.x = this.cx + this.radius * Math.cos(this.endAngle), n.y = this.cy + this.radius * Math.sin(this.endAngle), n;
  }
  /**
   * 点是否在扇形内
   * 条件：距圆心 < radius 且角度在扫过范围内
   */
  contains(e, n) {
    const s = e - this.cx, i = n - this.cy, r = this.radius;
    if (s * s + i * i >= r * r) return !1;
    if (s === 0 && i === 0) return !0;
    const c = Math.atan2(i, s);
    return this.angleInSweep(c);
  }
  /** 角度是否在扫过范围内 */
  angleInSweep(e) {
    let n = ln(this.startAngle), s = ln(this.endAngle), i = ln(e);
    return this.ccw ? n <= s ? i >= n - 1e-9 && i <= s + 1e-9 : i >= n - 1e-9 || i <= s + 1e-9 : s <= n ? i >= s - 1e-9 && i <= n + 1e-9 : i >= s - 1e-9 || i <= n + 1e-9;
  }
  /**
   * 带符号距离（到扇形边界：弧 + 两段半径）
   */
  signedDistance(e, n) {
    const s = e - this.cx, i = n - this.cy, r = this.radius, c = Math.sqrt(s * s + i * i), a = c < 1e-12 ? this.startAngle : Math.atan2(i, s), l = this.angleInSweep(a);
    let h = 1 / 0;
    if (l) {
      const M = Math.abs(c - r);
      M < h && (h = M);
    }
    const u = this.cx + r * Math.cos(this.startAngle), f = this.cy + r * Math.sin(this.startAngle), d = this.cx + r * Math.cos(this.endAngle), y = this.cy + r * Math.sin(this.endAngle), x = Zn(e, n, this.cx, this.cy, u, f), g = Zn(e, n, this.cx, this.cy, d, y);
    x < h && (h = x), g < h && (h = g);
    const w = h === 1 / 0 ? Math.abs(c - r) : Math.sqrt(h);
    return this.contains(e, n) ? w : -w;
  }
  bounds(e) {
    const n = e || new Lt(), s = this.radius;
    return n.min.set(this.cx - s, this.cy - s), n.max.set(this.cx + s, this.cy + s), n;
  }
}
let W1 = class Or extends sn {
  type;
  // 控制点扁平存储 [p0x, p0y, p1x, p1y, ...]
  // 二次：6 个数；三次：8 个数
  points;
  constructor(e = "cubic", n = []) {
    super(), this.type = e, this.points = n;
  }
  static quadratic(e, n, s, i, r, c) {
    return new Or("quadratic", [e, n, s, i, r, c]);
  }
  static cubic(e, n, s, i, r, c, a, l) {
    return new Or("cubic", [e, n, s, i, r, c, a, l]);
  }
  area() {
    return 0;
  }
  centroid(e) {
    return this.pointAt(0.5, e);
  }
  center(e) {
    return this.centroid(e);
  }
  /** 曲线长度（数值积分） */
  perimeter() {
    return this.arcLength();
  }
  contains(e, n) {
    return !1;
  }
  /** 求曲线上参数 t 处的点 */
  pointAt(e, n) {
    const s = n || { x: 0, y: 0 }, i = this.points, r = 1 - e;
    if (this.type === "quadratic") {
      const c = r * r, a = e * e, l = 2 * r * e;
      s.x = c * i[0] + l * i[2] + a * i[4], s.y = c * i[1] + l * i[3] + a * i[5];
    } else {
      const c = r * r * r, a = e * e * e, l = 3 * r * r * e, h = 3 * r * e * e;
      s.x = c * i[0] + l * i[2] + h * i[4] + a * i[6], s.y = c * i[1] + l * i[3] + h * i[5] + a * i[7];
    }
    return s;
  }
  /** 导数（切线向量） */
  derivativeAt(e, n) {
    const s = n || { x: 0, y: 0 }, i = this.points, r = 1 - e;
    if (this.type === "quadratic")
      s.x = 2 * r * (i[2] - i[0]) + 2 * e * (i[4] - i[2]), s.y = 2 * r * (i[3] - i[1]) + 2 * e * (i[5] - i[3]);
    else {
      const c = r * r, a = e * e;
      s.x = 3 * c * (i[2] - i[0]) + 6 * r * e * (i[4] - i[2]) + 3 * a * (i[6] - i[4]), s.y = 3 * c * (i[3] - i[1]) + 6 * r * e * (i[5] - i[3]) + 3 * a * (i[7] - i[5]);
    }
    return s;
  }
  /**
   * 弧长 - Gauss-Legendre 5 节点积分
   * ∫₀¹ |B'(t)| dt
   */
  arcLength() {
    const e = [
      0.5 - 0.5 * Math.sqrt(5 + 2 * Math.sqrt(1.4285714285714286)) / 3,
      0.5 - 0.5 * Math.sqrt(5 - 2 * Math.sqrt(1.4285714285714286)) / 3,
      0.5,
      0.5 + 0.5 * Math.sqrt(5 - 2 * Math.sqrt(1.4285714285714286)) / 3,
      0.5 + 0.5 * Math.sqrt(5 + 2 * Math.sqrt(1.4285714285714286)) / 3
    ], n = [
      (322 - 13 * Math.sqrt(70)) / 1800,
      (322 + 13 * Math.sqrt(70)) / 1800,
      128 / 450,
      (322 + 13 * Math.sqrt(70)) / 1800,
      (322 - 13 * Math.sqrt(70)) / 1800
    ];
    let s = 0;
    const i = { x: 0, y: 0 };
    for (let r = 0; r < 5; r++) {
      const c = e[r];
      this.derivativeAt(c, i), s += n[r] * Math.sqrt(i.x * i.x + i.y * i.y);
    }
    return s * 0.5;
  }
  /**
   * 带符号距离 - 找到曲线上离点最近的点
   * 二次：解析（求导得到三次方程）
   * 三次：采样 + Newton 精化
   */
  signedDistance(e, n) {
    const s = this.closestParameter(e, n), i = this.pointAt(s), r = e - i.x, c = n - i.y;
    return Math.sqrt(r * r + c * c);
  }
  /** 最近点参数 t */
  closestParameter(e, n) {
    const s = this.points;
    return this.type === "quadratic" ? this._closestQuadratic(e, n, s) : this._closestCubic(e, n, s);
  }
  /**
   * 二次贝塞尔最近点参数
   * 设 D(t) = |B(t) - Q|²，求 D'(t)=0
   * 化简后得到一元三次方程 at³+bt²+ct+d=0
   */
  _closestQuadratic(e, n, s) {
    const i = s[0], r = s[1], c = s[2], a = s[3], l = s[4], h = s[5], u = i - 2 * c + l, f = 2 * (c - i), d = i - e, y = r - 2 * a + h, x = 2 * (a - r), g = r - n, w = 2 * (u * u + y * y), M = 3 * (u * f + y * x), P = f * f + x * x + 2 * (u * d + y * g), S = f * d + x * g, k = bi(w, M, P, S), O = [0, 1];
    for (let N = 0; N < k.length; N++) {
      const $ = k[N];
      $ > 0 && $ < 1 && O.push($);
    }
    let R = 0, F = 1 / 0;
    const Y = { x: 0, y: 0 };
    for (let N = 0; N < O.length; N++) {
      this.pointAt(O[N], Y);
      const $ = e - Y.x, W = n - Y.y, Q = $ * $ + W * W;
      Q < F && (F = Q, R = O[N]);
    }
    return R;
  }
  /**
   * 三次贝塞尔最近点参数
   * 采样 N 个点找近似最近，再 Newton-Raphson 精化 3 次
   */
  _closestCubic(e, n, s) {
    let r = 0, c = 1 / 0;
    const a = { x: 0, y: 0 };
    for (let f = 0; f <= 16; f++) {
      const d = f / 16;
      this.pointAt(d, a);
      const y = e - a.x, x = n - a.y, g = y * y + x * x;
      g < c && (c = g, r = d);
    }
    const l = { x: 0, y: 0 }, h = { x: 0, y: 0 };
    let u = r;
    for (let f = 0; f < 4; f++) {
      this.pointAt(u, a), this.derivativeAt(u, l), this._secondDerivativeAt(u, h);
      const d = a.x - e, y = a.y - n, x = d * l.x + y * l.y, g = l.x * l.x + l.y * l.y + d * h.x + y * h.y;
      if (Math.abs(g) < 1e-12) break;
      let w = u - x / g;
      if (w < 0 ? w = 0 : w > 1 && (w = 1), Math.abs(w - u) < 1e-9) {
        u = w;
        break;
      }
      u = w;
    }
    return u;
  }
  _secondDerivativeAt(e, n) {
    const s = n || { x: 0, y: 0 }, i = this.points, r = 1 - e;
    return this.type === "quadratic" ? (s.x = 2 * (i[0] - 2 * i[2] + i[4]), s.y = 2 * (i[1] - 2 * i[3] + i[5])) : (s.x = 6 * (r * (i[4] - 2 * i[2] + i[0]) + e * (i[6] - 2 * i[4] + i[2])), s.y = 6 * (r * (i[5] - 2 * i[3] + i[1]) + e * (i[7] - 2 * i[5] + i[3]))), s;
  }
  bounds(e) {
    const n = e || new Lt(), s = this.points;
    n.min.set(1 / 0, 1 / 0), n.max.set(-1 / 0, -1 / 0);
    for (let i = 0; i < s.length; i += 2)
      n.add(s[i], s[i + 1]);
    return n;
  }
};
class $1 extends sn {
  x;
  y;
  width;
  height;
  /** 圆角半径（统一） */
  radius;
  constructor(e = 0, n = 0, s = 0, i = 0, r = 0) {
    super(), this.x = e, this.y = n, this.width = s, this.height = i, this.radius = Math.max(0, Math.min(r, Math.min(s, i) * 0.5));
  }
  get right() {
    return this.x + this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  /** 面积 = 矩形面积 - 4 个角方块（r²） + 4 个四分之一圆（πr²） */
  area() {
    const e = this.radius;
    return this.width * this.height - (4 - Math.PI) * e * e;
  }
  centroid(e) {
    const n = e || { x: 0, y: 0 };
    return n.x = this.x + this.width * 0.5, n.y = this.y + this.height * 0.5, n;
  }
  center(e) {
    return this.centroid(e);
  }
  /** 周长 = 2(w+h) - 8r + 2πr */
  perimeter() {
    const e = this.radius;
    return 2 * (this.width + this.height) - 8 * e + 2 * Math.PI * e;
  }
  /**
   * 点是否在圆角矩形内（不含边界）
   * 算法：
   *   - 在内矩形（去除四角）内 → true
   *   - 在角区域内 → 看是否在对应圆角圆内
   */
  contains(e, n) {
    const s = this.radius, i = this.x, r = this.y, c = this.right, a = this.bottom;
    if (e <= i || e >= c || n <= r || n >= a) return !1;
    const l = i + s, h = r + s, u = c - s, f = a - s;
    if (e < l && n < h) {
      const d = e - l, y = n - h;
      return d * d + y * y < s * s;
    }
    if (e > u && n < h) {
      const d = e - u, y = n - h;
      return d * d + y * y < s * s;
    }
    if (e < l && n > f) {
      const d = e - l, y = n - f;
      return d * d + y * y < s * s;
    }
    if (e > u && n > f) {
      const d = e - u, y = n - f;
      return d * d + y * y < s * s;
    }
    return !0;
  }
  /**
   * 带符号距离
   * 内部为正，外部为负
   * 算法：
   *   1. 将点坐标变换到 "角圆心" 坐标系下
   *   2. 用 max(|dx|-innerW, |dy|-innerH) 找到最近的角区域
   *   3. 若在角区域内：距角圆心的距离差
   *   4. 若在内十字区域：min 到四条直边的距离
   */
  signedDistance(e, n) {
    const s = this.radius, i = this.x, r = this.y, c = this.right, a = this.bottom, l = i + s, h = r + s, u = c - s, f = a - s;
    let d, y, x = !1, g = !1;
    if (e < l ? (d = l, x = !0) : e > u ? (d = u, x = !0) : d = e, n < h ? (y = h, g = !0) : n > f ? (y = f, g = !0) : y = n, x && g) {
      const w = e - d, M = n - y, P = Math.sqrt(w * w + M * M);
      return s - P;
    } else {
      const w = e - i, M = c - e, P = n - r, S = a - n;
      if (w >= 0 && M >= 0 && P >= 0 && S >= 0)
        return Math.min(w, M, P, S);
      const k = e < l ? l : e > u ? u : e, O = n < h ? h : n > f ? f : n, R = e - k, F = n - O;
      return -(Math.sqrt(R * R + F * F) - s);
    }
  }
  bounds(e) {
    const n = e || new Lt();
    return n.min.set(this.x, this.y), n.max.set(this.right, this.bottom), n;
  }
}
class xn {
  /**
   * 创建事件实例的工厂方法
   * @param type 事件类型
   * @param data 事件数据
   */
  static create(e, n) {
    return new xn(e, n);
  }
  /** 事件类型 */
  type;
  /** 委托事件类型（当通过事件委托触发时，记录原始事件类型） */
  delegateType;
  /** 事件携带的自定义数据 */
  data;
  /** 事件触发的原始目标节点 */
  target;
  /** 当前正在处理事件的节点（事件传播过程中的当前节点） */
  currentTarget;
  /** 原生 DOM 事件引用 */
  nativeEvent;
  /** 是否已调用 preventDefault */
  defaultPrevented = !1;
  /** 是否停止冒泡（不影响同级的其他监听器） */
  cancelBubble = !1;
  /** 是否立即停止传播（连当前节点剩余的监听器也不再执行） */
  immediateCancelBubble = !1;
  constructor(e, n) {
    this.type = e, this.data = n, this.target = null, this.currentTarget = null, this.nativeEvent = null;
  }
  /** 停止事件传播（后续节点不再收到事件） */
  stopPropagation() {
    this.cancelBubble = !0;
  }
  /** 立即停止事件传播（当前节点剩余监听器也不再执行） */
  stopImmediatePropagation() {
    this.immediateCancelBubble = !0;
  }
  /** 阻止默认行为 */
  preventDefault() {
    this.defaultPrevented = !0;
  }
  /**
   * 获取事件传播路径（从 target 到根节点的节点链）
   * 用于事件捕获和冒泡阶段的遍历
   */
  composedPath() {
    let e = this.target, n = [];
    for (; e; )
      n.push(e), e = e.parent;
    return n;
  }
}
class j1 {
  /** NodeEvent 类引用，方便外部创建事件 */
  static NodeEvent = xn;
  /** 事件监听器存储，key 格式为 "type"（冒泡）或 "type_capture"（捕获） */
  listeners = /* @__PURE__ */ new Map();
  /**
   * 注册事件监听器
   * @param type 事件类型
   * @param handler 事件处理函数或对象
   * @param options 布尔值表示是否捕获阶段，对象可配置 capture/once
   */
  addEventListener(e, n, s) {
    const i = this._resolveKey(e, s), r = this.listeners.get(i);
    if (typeof s == "object" && s.once) {
      let c = n;
      n = (a) => {
        this._invokeHandler(c, a), this.removeEventListener(e, n, s);
      };
    }
    r ? r.includes(n) || r.push(n) : this.listeners.set(i, [n]);
  }
  /** addEventListener 的别名 */
  on(e, n, s) {
    this.addEventListener(e, n, s);
  }
  /**
   * 移除事件监听器
   * @param type 事件类型
   * @param handler 不传则移除该类型下所有监听器
   * @param options 与注册时一致的配置
   */
  removeEventListener(e, n, s) {
    const i = this._resolveKey(e, s);
    if (!n) {
      this.listeners.delete(i);
      return;
    }
    const r = this.listeners.get(i);
    if (!r) return;
    const c = r.filter((a) => a !== n);
    c.length !== r.length && this.listeners.set(i, c), c.length === 0 && this.listeners.delete(i);
  }
  /** removeEventListener 的别名 */
  off(e, n, s) {
    this.removeEventListener(e, n, s);
  }
  /**
   * 派发事件，沿节点路径依次触发事件：
   * 1. 捕获阶段：从父节点到目标节点  2. 冒泡阶段：从目标节点到父节点
   * @param e 事件对象
   */
  dispatchEvent(e) {
    const n = this._makeKey(e.type, !0), s = this._makeKey(e.type, !1);
    e.target = this;
    const i = e.composedPath();
    for (let r = i.length - 1; r >= 0; r--) {
      const c = i[r];
      e.currentTarget = c;
      const a = c.listeners.get(n);
      if (a)
        for (const l of a) {
          if (e.immediateCancelBubble) break;
          this._invokeHandler(l, e);
        }
      if (e.cancelBubble) break;
    }
    if (!e.cancelBubble)
      for (let r = 0, c = i.length; r < c; r++) {
        const a = i[r];
        e.currentTarget = a;
        const l = a.listeners.get(s);
        if (l)
          for (const h of l) {
            if (e.immediateCancelBubble) break;
            this._invokeHandler(h, e);
          }
        if (e.cancelBubble) break;
      }
  }
  /**
   * 快捷触发事件（自动创建事件对象）
   * @param type 事件类型
   * @param data 事件数据
   */
  emit(e, n) {
    const s = new xn(e, n);
    this.dispatchEvent(s);
  }
  /** 移除当前节点上所有事件监听器 */
  removeAllListeners() {
    this.listeners.clear();
  }
  /**
   * 获取指定事件类型的所有监听器（包含捕获和冒泡）
   * @param type 事件类型
   */
  getEventListeners(e) {
    const n = this._makeKey(e, !0), s = this._makeKey(e, !1), i = this.listeners.get(n) || [], r = this.listeners.get(s) || [];
    return [...i, ...r];
  }
  /** 生成事件存储 key：捕获阶段追加 "_capture" 后缀 */
  _makeKey(e, n) {
    return n ? `${e}_capture` : e;
  }
  /** 解析 options 参数，确定是捕获还是冒泡 */
  _resolveKey(e, n) {
    let s = !1;
    return typeof n == "boolean" ? s = n : n?.capture && (s = !0), this._makeKey(e, s);
  }
  /** 执行监听器（兼容函数和 handleEvent 对象两种形式） */
  _invokeHandler(e, n) {
    typeof e == "function" ? e(n) : e.handleEvent(n);
  }
}
class G1 {
  options;
  /** 当前输入模式 */
  inputType;
  /** 实际生效的输入类型（auto 解析后） */
  resolvedType;
  /** 是否已经启动监听 */
  _started = !1;
  /** DOM 监听目标 */
  _dom = null;
  /** 绑定的 DOM 事件处理函数引用（用于解绑） */
  _handlers = {};
  /** 当前 hover 的元素链（从目标到根） */
  _hoverEl;
  /** 当前按下的元素（用于 click 判定） */
  _pressedTarget = null;
  /** 按下时的坐标（用于 click 移动阈值） */
  _pressedX = 0;
  _pressedY = 0;
  /** 双击间隔阈值（毫秒） */
  dblClickInterval = 300;
  /** click 移动阈值（像素） */
  clickMoveThreshold = 5;
  /** drag 触发阈值（像素，按下后移动超过此距离才触发 dragstart） */
  dragStartThreshold = 4;
  /** 上次 click 时间 */
  _lastClickTime = 0;
  /** 上次 click 目标 */
  _lastClickTarget = null;
  /** 上次 pointermove 的屏幕坐标（用于计算 deltaX/deltaY） */
  _lastMoveX = 0;
  _lastMoveY = 0;
  // ============ Drag 状态 ============
  /** 当前是否处于拖拽中 */
  _dragging = !1;
  /** 拖拽源元素 */
  _dragSource = null;
  /** 拖拽按下时的屏幕坐标 */
  _dragStartX = 0;
  _dragStartY = 0;
  /** 拖拽按下时的世界坐标 */
  _dragStartWorldX = 0;
  _dragStartWorldY = 0;
  /** 按下时是否已移动超过阈值（用于决定是否触发 dragstart） */
  _dragThresholdMet = !1;
  /** 当前拖拽悬停的元素链（用于 dragenter/leave/over） */
  _dragHoverEl = null;
  constructor(e) {
    this.options = e, this.inputType = "auto", this.resolvedType = "pointer";
  }
  /** 启动事件监听 */
  start(e = "auto") {
    this._started && this.stop(), this.inputType = e, this.resolvedType = this._resolveType(e);
    const n = this.options.domEventTarget;
    this._dom = n, this._attachListeners(), this._started = !0;
  }
  /** 停止事件监听 */
  stop() {
    if (!(!this._started || !this._dom)) {
      for (const e in this._handlers)
        this._dom.removeEventListener(e, this._handlers[e]);
      this._handlers = {}, this._dom = null, this._started = !1, this._hoverEl = null, this._pressedTarget = null, this._dragging = !1, this._dragSource = null, this._dragHoverEl = null;
    }
  }
  /** 切换输入模式（运行时） */
  setInputType(e) {
    this.inputType !== e && (this._started ? (this.stop(), this.start(e)) : (this.inputType = e, this.resolvedType = this._resolveType(e)));
  }
  /** 自动解析输入类型 */
  _resolveType(e) {
    return e === "auto" ? typeof window < "u" && window.PointerEvent ? "pointer" : typeof window < "u" && "ontouchstart" in window ? "touch" : "mouse" : e;
  }
  /** 挂载 DOM 监听 */
  _attachListeners() {
    const e = this._dom, n = this.resolvedType;
    n === "pointer" ? (this._add(e, "pointerdown", this._onPointerDown), this._add(e, "pointermove", this._onPointerMove), this._add(e, "pointerup", this._onPointerUp), this._add(e, "pointerleave", this._onPointerLeave), this._add(e, "pointercancel", this._onPointerUp)) : n === "mouse" ? (this._add(e, "mousedown", this._onMouseDown), this._add(e, "mousemove", this._onMouseMove), this._add(e, "mouseup", this._onMouseUp), this._add(e, "mouseleave", this._onMouseLeave)) : (this._add(e, "touchstart", this._onTouchStart), this._add(e, "touchmove", this._onTouchMove), this._add(e, "touchend", this._onTouchEnd), this._add(e, "touchcancel", this._onTouchEnd));
  }
  _add(e, n, s) {
    e.addEventListener(n, s, { passive: !1 }), this._handlers[n] = s;
  }
  // ============ PointerEvent ============
  _onPointerDown = (e) => {
    this._dispatchPointer(e, "pointerdown", e.button, e.pointerId, !1);
  };
  _onPointerMove = (e) => {
    this._dispatchPointer(e, "pointermove", 0, e.pointerId, !1);
  };
  _onPointerUp = (e) => {
    this._dispatchPointer(e, "pointerup", e.button, e.pointerId, !1);
  };
  _onPointerLeave = (e) => {
    this._clearHover(e);
  };
  // ============ MouseEvent ============
  _onMouseDown = (e) => {
    this._dispatchPointer(e, "pointerdown", e.button, 1, !1);
  };
  _onMouseMove = (e) => {
    this._dispatchPointer(e, "pointermove", 0, 1, !1);
  };
  _onMouseUp = (e) => {
    this._dispatchPointer(e, "pointerup", e.button, 1, !1);
  };
  _onMouseLeave = (e) => {
    this._clearHover(e);
  };
  // ============ TouchEvent ============
  _onTouchStart = (e) => {
    if (e.touches.length === 0) return;
    const n = e.touches[0];
    this._dispatchPointer(e, "pointerdown", 0, n.identifier, !0, n.clientX, n.clientY);
  };
  _onTouchMove = (e) => {
    if (e.touches.length === 0) return;
    const n = e.touches[0];
    this._dispatchPointer(e, "pointermove", 0, n.identifier, !0, n.clientX, n.clientY);
  };
  _onTouchEnd = (e) => {
    const n = e.changedTouches[0];
    n && this._dispatchPointer(e, "pointerup", 0, n.identifier, !0, n.clientX, n.clientY);
  };
  // ============ 核心派发 ============
  /**
   * 统一事件派发入口
   * @param native 原生事件
   * @param eventName 派发到 EventTarget 的事件名
   * @param button 鼠标按钮
   * @param pointerId 指针/触摸 ID
   * @param isTouch 是否触摸来源
   * @param clientX 屏幕坐标 X（touch 事件需手动传入，因为 e.clientX 是 undefined）
   * @param clientY 屏幕坐标 Y
   */
  _dispatchPointer(e, n, s, i, r, c, a) {
    const l = this._dom;
    if (!l) return;
    const h = c !== void 0 ? c : e.clientX, u = a !== void 0 ? a : e.clientY, f = l.getBoundingClientRect(), d = h - f.left, y = u - f.top, g = this.options.viewport.screenToWorld({ x: d, y }), w = g.x, M = g.y;
    let P = 0, S = 0;
    n === "pointermove" && (P = d - this._lastMoveX, S = y - this._lastMoveY), this._lastMoveX = d, this._lastMoveY = y;
    const k = {
      screenX: d,
      screenY: y,
      worldX: w,
      worldY: M,
      button: s,
      pointerId: i,
      isTouch: r,
      ctrlKey: e.ctrlKey || !1,
      shiftKey: e.shiftKey || !1,
      altKey: e.altKey || !1,
      metaKey: e.metaKey || !1,
      nativeEvent: e,
      deltaX: P,
      deltaY: S
    }, O = this.options.pick(w, M), R = new xn(n, k);
    if (R.nativeEvent = e, n === "pointermove" && this._updateHover(O, e, d, y, w, M), n === "pointermove" && this._pressedTarget) {
      if (this._handleDragMove(O, e, k))
        return;
    } else if (n === "pointerup" && this._dragging) {
      this._handleDragEnd(O, e, d, y, w, M), this._pressedTarget = null;
      return;
    }
    O && O.dispatchEvent(R), n === "pointerdown" ? (this._pressedTarget = O, this._pressedX = d, this._pressedY = y, this._dragStartX = d, this._dragStartY = y, this._dragStartWorldX = w, this._dragStartWorldY = M, this._dragSource = O, this._dragThresholdMet = !1) : n === "pointerup" && this._tryClick(O, e, d, y, w, M);
  }
  /**
   * 处理拖拽中的移动
   * @returns true 表示已作为 drag 处理，不再派发 pointermove
   */
  _handleDragMove(e, n, s) {
    const i = s.screenX - this._dragStartX, r = s.screenY - this._dragStartY, c = i * i + r * r;
    if (!this._dragThresholdMet) {
      if (c < this.dragStartThreshold * this.dragStartThreshold)
        return !1;
      this._dragThresholdMet = !0, this._dragging = !0;
      const l = this._dragSource, h = {
        ...s,
        screenX: this._dragStartX,
        screenY: this._dragStartY,
        worldX: this._dragStartWorldX,
        worldY: this._dragStartWorldY,
        deltaX: 0,
        deltaY: 0,
        totalDeltaX: 0,
        totalDeltaY: 0
      };
      this._emitNamedEventWithData(l, "dragstart", n, h), this._dragHoverEl = e, this._emitNamedEventWithData(e, "dragenter", n, {
        ...s,
        dragSource: this._dragSource || void 0
      });
    }
    const a = {
      ...s,
      totalDeltaX: i,
      totalDeltaY: r,
      dragSource: this._dragSource || void 0
    };
    return this._emitNamedEventWithData(this._dragSource, "drag", n, a), this._updateDragHover(e, n, s), !0;
  }
  /** 更新拖拽悬停元素，派发 dragenter/leave/over */
  _updateDragHover(e, n, s) {
    const i = this._dragHoverEl;
    e && this._emitNamedEventWithData(e, "dragover", n, {
      ...s,
      dragSource: this._dragSource || void 0
    }), i !== e && (i && this._emitNamedEventWithData(i, "dragleave", n, {
      ...s,
      dragSource: this._dragSource || void 0
    }), e && this._emitNamedEventWithData(e, "dragenter", n, {
      ...s,
      dragSource: this._dragSource || void 0
    }), this._dragHoverEl = e);
  }
  /** 处理拖拽结束：派发 drop 到目标，dragend 到源 */
  _handleDragEnd(e, n, s, i, r, c) {
    const a = this._dragSource, l = s - this._dragStartX, h = i - this._dragStartY, u = {
      screenX: s,
      screenY: i,
      worldX: r,
      worldY: c,
      button: 0,
      pointerId: 1,
      isTouch: !1,
      ctrlKey: n.ctrlKey || !1,
      shiftKey: n.shiftKey || !1,
      altKey: n.altKey || !1,
      metaKey: n.metaKey || !1,
      nativeEvent: n,
      totalDeltaX: l,
      totalDeltaY: h,
      dragSource: a || void 0
    };
    e && this._emitNamedEventWithData(e, "drop", n, u);
    const f = this._dragHoverEl;
    f && f !== e && this._emitNamedEventWithData(f, "dragleave", n, u), a && this._emitNamedEventWithData(a, "dragend", n, u), this._dragging = !1, this._dragSource = null, this._dragThresholdMet = !1, this._dragHoverEl = null;
  }
  /** 更新 hover 链，派发 enter/leave/over/out */
  _updateHover(e, n, s, i, r, c) {
    const a = this._hoverEl;
    a !== e && (a && this._emitNamedEvent(a, "pointerleave", n, s, i, r, c), e && this._emitNamedEvent(e, "pointerenter", n, s, i, r, c), this._hoverEl = e);
  }
  /** 清空 hover 链 */
  _clearHover(e) {
    const n = this._hoverEl;
    n && this._emitNamedEvent(n, "pointerleave", e, 0, 0, 0, 0), this._hoverEl = null;
  }
  /** 派发事件到指定元素（基础坐标版本，复用减少函数数量） */
  _emitNamedEvent(e, n, s, i, r, c, a) {
    const l = {
      screenX: i,
      screenY: r,
      worldX: c,
      worldY: a,
      button: 0,
      pointerId: 1,
      isTouch: !1,
      ctrlKey: !1,
      shiftKey: !1,
      altKey: !1,
      metaKey: !1,
      nativeEvent: s
    }, h = new xn(n, l);
    h.nativeEvent = s, e.dispatchEvent(h);
  }
  /** 派发事件到指定元素（完整 data 版本，用于 drag 系列） */
  _emitNamedEventWithData(e, n, s, i) {
    const r = new xn(n, i);
    r.nativeEvent = s, e.dispatchEvent(r);
  }
  /** click 判定：同一目标 + 移动距离小于阈值 */
  _tryClick(e, n, s, i, r, c) {
    const a = this._pressedTarget;
    if (this._pressedTarget = null, !a) return;
    let l = !1, h = e;
    for (; h; ) {
      if (h === a) {
        l = !0;
        break;
      }
      h = h.parent;
    }
    if (!l) return;
    const u = s - this._pressedX, f = i - this._pressedY;
    if (u * u + f * f > this.clickMoveThreshold * this.clickMoveThreshold) return;
    this._emitNamedEvent(a, "click", n, s, i, r, c);
    const d = performance.now();
    this._lastClickTarget === a && d - this._lastClickTime <= this.dblClickInterval ? (this._emitNamedEvent(a, "dblclick", n, s, i, r, c), this._lastClickTarget = null) : (this._lastClickTime = d, this._lastClickTarget = a);
  }
}
class R0 {
  _events = /* @__PURE__ */ new Map();
  /**
   * 注册事件监听器。
   *
   * @param event 事件名
   * @param fn 回调函数或 handleEvent 对象
   * @param context 回调执行时的 this 上下文
   */
  on(e, n, s) {
    return this._addListener(e, n, !1, s);
  }
  /**
   * 注册一次性事件监听器（触发后自动移除）。
   */
  once(e, n, s) {
    return this._addListener(e, n, !0, s);
  }
  /**
   * 移除事件监听器。
   *
   * @param event 事件名，不传则移除所有事件
   * @param fn 指定回调，不传则移除该事件下全部监听器
   * @param context 指定上下文（需与注册时一致才匹配）
   * @param once 是否只移除 once 监听器
   */
  off(e, n, s, i) {
    if (!e)
      return this._events.clear(), this;
    const r = this._events.get(e);
    if (!r) return this;
    if (!n)
      return this._events.delete(e), this;
    for (let c = r.length - 1; c >= 0; c--) {
      const a = r[c];
      a.fn === n && (i === void 0 || a.once === i) && (s === void 0 || a.context === s) && r.splice(c, 1);
    }
    return r.length === 0 && this._events.delete(e), this;
  }
  /**
   * 触发事件。
   *
   * @param event 事件名
   * @param args 传递给监听器的参数
   * @returns 是否有监听器被调用
   */
  emit(e, ...n) {
    const s = this._events.get(e);
    if (!s || s.length === 0) return !1;
    const i = s.slice();
    for (let r = 0; r < i.length; r++) {
      const c = i[r];
      c.once && this.off(e, c.fn, c.context, !0), this._invoke(c, n);
    }
    return !0;
  }
  /**
   * 获取指定事件的所有监听器列表。
   */
  listeners(e) {
    const n = this._events.get(e);
    return n ? n.map((s) => s.fn) : [];
  }
  /**
   * 指定事件是否有监听器。
   * 不传 event 则检查是否有任意监听器。
   */
  hasListeners(e) {
    if (e) {
      const n = this._events.get(e);
      return !!n && n.length > 0;
    }
    for (const n of this._events.values())
      if (n.length > 0) return !0;
    return !1;
  }
  /**
   * 移除所有监听器。不传 event 则移除所有事件，传 event 则只移除该事件。
   */
  removeAllListeners(e) {
    return e ? this._events.delete(e) : this._events.clear(), this;
  }
  /**
   * 获取指定事件的监听器数量。
   */
  listenerCount(e) {
    const n = this._events.get(e);
    return n ? n.length : 0;
  }
  /**
   * 获取所有已注册的事件名。
   */
  eventNames() {
    return Array.from(this._events.keys());
  }
  // ---- 内部 ----
  _addListener(e, n, s, i) {
    let r = this._events.get(e);
    return r || (r = [], this._events.set(e, r)), r.push({ fn: n, once: s, context: i }), this;
  }
  _invoke(e, n) {
    const { fn: s, context: i } = e;
    typeof s == "function" ? s.apply(i, n) : typeof s.handleEvent == "function" && s.handleEvent.apply(i, n);
  }
}
class Fs extends xn {
  static pool = qn.create({
    initSize: 20,
    create: () => new Fs("", {}),
    init(e) {
      e.reset();
    }
  });
  downPoint = st.default();
  // 按下时的坐标
  point = st.default();
  // 当前事件坐标
  offsetPoint = st.default();
  // 距离按下时的偏移量
  deltaPoint = st.default();
  // 上次事件的偏移量
  constructor(e, n) {
    super(e, n);
  }
  reset() {
    this.downPoint.set(0, 0), this.point.set(0, 0), this.offsetPoint.set(0, 0), this.deltaPoint.set(0, 0), this.data = {}, this.defaultPrevented = !1, this.cancelBubble = !1, this.immediateCancelBubble = !1, this.delegateType = "", this.target = null, this.currentTarget = null, this.nativeEvent = null;
  }
  copy(e) {
    this.type = e.type, this.data = e.data, this.nativeEvent = e.nativeEvent, this.target = e.target, this.currentTarget = e.currentTarget, this.delegateType = e.delegateType, this.cancelBubble = e.cancelBubble, this.immediateCancelBubble = e.immediateCancelBubble, this.defaultPrevented = e.defaultPrevented, this.downPoint.copy(e.downPoint), this.point.copy(e.point), this.offsetPoint.copy(e.offsetPoint), this.deltaPoint.copy(e.deltaPoint);
  }
  clone() {
    const e = Fs.pool.get();
    return e.copy(this), e;
  }
}
const F0 = {
  pointerdown: "pointerdown",
  pointermove: "pointermove",
  pointerup: "pointerup",
  pointerleave: "pointerleave",
  pointerenter: "pointerenter",
  wheel: "wheel"
};
class Z1 extends R0 {
  options;
  handlers = /* @__PURE__ */ new Map();
  // 阈值缓存（平方距离）
  _dragThresholdSq;
  _dblclickInterval;
  // 状态
  _lastPoint = st.create();
  _downPoint = st.create();
  _isPointerDown = !1;
  _isDragging = !1;
  _lastClickTime = 0;
  _lastClickPoint = st.create();
  // hitTest 追踪
  _hoverTarget = null;
  // 当前悬停的元素
  _downTarget = null;
  // pointerdown 时的命中元素
  _dragHoverTarget = null;
  // 拖拽时当前悬停的元素
  constructor(e) {
    super(), this.options = e, this.onPointerEvent = this.onPointerEvent.bind(this);
    const n = e.dragThreshold ?? 4;
    this._dragThresholdSq = n * n, this._dblclickInterval = e.dblclickInterval ?? 300;
  }
  _getPointerEvents() {
    return this.options.pointerEvents ?? F0;
  }
  attachEvents() {
    const e = this._getPointerEvents();
    for (const [n, s] of Object.entries(e)) {
      const i = this.onPointerEvent.bind(this, n);
      this.options.target.addEventListener(s, i, !1), this.handlers.set(n, i);
    }
  }
  detachEvents() {
    const e = this._getPointerEvents();
    for (const [n, s] of Object.entries(e)) {
      const i = this.handlers.get(n);
      i && this.options.target.removeEventListener(s, i, !1);
    }
    this.handlers.clear();
  }
  createEvent(e, n) {
    const s = Fs.pool.get();
    return s.type = e, s.data = {}, s.nativeEvent = n, s;
  }
  onPointerEvent(e, n) {
    const s = [], i = this.createEvent(e, n);
    s.push(i);
    const r = n.clientX, c = n.clientY, a = i.point;
    this.options.screenToWorld(a, r, c, this.options.target), i.deltaPoint.set(a.x - this._lastPoint.x, a.y - this._lastPoint.y), this._lastPoint.copy(a), this._isPointerDown && i.offsetPoint.set(a.x - this._downPoint.x, a.y - this._downPoint.y), i.downPoint.copy(this._downPoint);
    const l = this.options.hitTest(a.x, a.y);
    switch (i.target = l, e) {
      case "pointerdown": {
        if (this._isPointerDown = !0, this._isDragging = !1, this._downPoint.copy(a), this._downTarget = l, i.downPoint.copy(a), i.offsetPoint.set(0, 0), l && l !== this._hoverTarget) {
          if (this._hoverTarget) {
            const h = this.createEvent("pointerleave", n);
            s.push(h), h.copy(i), h.target = this._hoverTarget, this.emit("pointerleave", h);
          }
          this._hoverTarget = l, i.type = "pointerenter", this.emit("pointerenter", i);
        }
        i.type = "pointerdown", this.emit("pointerdown", i);
        break;
      }
      case "pointermove": {
        if (l !== this._hoverTarget) {
          if (this._hoverTarget) {
            const h = this.createEvent("pointerleave", n);
            s.push(h), h.copy(i), h.target = this._hoverTarget, this.emit("pointerleave", h);
          }
          l ? (this._hoverTarget = l, i.type = "pointerenter", this.emit("pointerenter", i)) : this._hoverTarget = null;
        }
        if (i.type = "pointermove", this.emit("pointermove", i), this._isPointerDown) {
          if (!this._isDragging) {
            const h = a.x - this._downPoint.x, u = a.y - this._downPoint.y;
            h * h + u * u >= this._dragThresholdSq && (this._isDragging = !0, this._dragHoverTarget = this._downTarget, i.type = "dragstart", this.emit("dragstart", i));
          }
          if (this._isDragging && (i.type = "drag", this.emit("drag", i), l !== this._dragHoverTarget)) {
            if (this._dragHoverTarget) {
              const h = this.createEvent("dragleave", n);
              s.push(h), h.copy(i), h.target = this._dragHoverTarget, this.emit("dragleave", h);
            }
            if (l) {
              const h = this.createEvent("dragenter", n);
              s.push(h), h.copy(i), h.target = l, this.emit("dragenter", h);
              const u = this.createEvent("dragover", n);
              s.push(u), u.copy(i), u.target = l, this.emit("dragover", u);
            }
            this._dragHoverTarget = l;
          }
        }
        break;
      }
      case "pointerup": {
        if (i.type = "pointerup", this.emit("pointerup", i), this._isDragging) {
          if (l && l !== this._downTarget) {
            const h = this.createEvent("drop", n);
            s.push(h), h.copy(i), h.target = l, this.emit("drop", h);
          }
          if (this._dragHoverTarget) {
            const h = this.createEvent("dragleave", n);
            s.push(h), h.copy(i), h.target = this._dragHoverTarget, this.emit("dragleave", h), this._dragHoverTarget = null;
          }
          this._isDragging = !1, i.type = "dragend", this.emit("dragend", i);
        }
        if (this._isPointerDown) {
          const h = a.x - this._downPoint.x, u = a.y - this._downPoint.y;
          if (h * h + u * u < this._dragThresholdSq) {
            i.type = "click", this.emit("click", i);
            const f = Date.now(), d = a.x - this._lastClickPoint.x, y = a.y - this._lastClickPoint.y;
            f - this._lastClickTime < this._dblclickInterval && d * d + y * y < this._dragThresholdSq ? (i.type = "dblclick", this.emit("dblclick", i), this._lastClickTime = 0) : (this._lastClickTime = f, this._lastClickPoint.copy(a));
          }
        }
        this._isPointerDown = !1, this._downTarget = null;
        break;
      }
      case "pointerleave": {
        if (this._hoverTarget) {
          const h = this.createEvent("pointerleave", n);
          s.push(h), h.copy(i), h.target = this._hoverTarget, this.emit("pointerleave", h), this._hoverTarget = null;
        }
        if (this._isDragging && this._dragHoverTarget) {
          const h = this.createEvent("dragleave", n);
          s.push(h), h.copy(i), h.target = this._dragHoverTarget, this.emit("dragleave", h), this._dragHoverTarget = null;
        }
        break;
      }
      case "pointerenter": {
        l && l !== this._hoverTarget && (this._hoverTarget = l, i.type = "pointerenter", this.emit("pointerenter", i));
        break;
      }
      case "wheel": {
        i.type = "wheel", this.emit("wheel", i);
        break;
      }
    }
    for (const h of s)
      Fs.pool.release(h);
  }
}
const { abs: ls, cos: Ge, sin: Fn, acos: z0, atan2: hs, sqrt: on, pow: Le } = Math;
function us(o) {
  return o < 0 ? -Le(-o, 1 / 3) : Le(o, 1 / 3);
}
const _a = Math.PI, yi = 2 * _a, cn = _a / 2, C0 = 1e-6, Ki = Number.MAX_SAFE_INTEGER || 9007199254740991, tr = Number.MIN_SAFE_INTEGER || -9007199254740991, N0 = { x: 0, y: 0, z: 0 }, et = {
  // Legendre-Gauss abscissae with n=24 (x_i values, defined at i=n as the roots of the nth order Legendre polynomial Pn(x))
  Tvalues: [
    -0.06405689286260563,
    0.06405689286260563,
    -0.1911188674736163,
    0.1911188674736163,
    -0.3150426796961634,
    0.3150426796961634,
    -0.4337935076260451,
    0.4337935076260451,
    -0.5454214713888396,
    0.5454214713888396,
    -0.6480936519369755,
    0.6480936519369755,
    -0.7401241915785544,
    0.7401241915785544,
    -0.820001985973903,
    0.820001985973903,
    -0.8864155270044011,
    0.8864155270044011,
    -0.9382745520027328,
    0.9382745520027328,
    -0.9747285559713095,
    0.9747285559713095,
    -0.9951872199970213,
    0.9951872199970213
  ],
  // Legendre-Gauss weights with n=24 (w_i values, defined by a function linked to in the Bezier primer article)
  Cvalues: [
    0.12793819534675216,
    0.12793819534675216,
    0.1258374563468283,
    0.1258374563468283,
    0.12167047292780339,
    0.12167047292780339,
    0.1155056680537256,
    0.1155056680537256,
    0.10744427011596563,
    0.10744427011596563,
    0.09761865210411388,
    0.09761865210411388,
    0.08619016153195327,
    0.08619016153195327,
    0.0733464814110803,
    0.0733464814110803,
    0.05929858491543678,
    0.05929858491543678,
    0.04427743881741981,
    0.04427743881741981,
    0.028531388628933663,
    0.028531388628933663,
    0.0123412297999872,
    0.0123412297999872
  ],
  arcfn: function(o, e) {
    const n = e(o);
    let s = n.x * n.x + n.y * n.y;
    return typeof n.z < "u" && (s += n.z * n.z), on(s);
  },
  compute: function(o, e, n) {
    if (o === 0)
      return e[0].t = 0, e[0];
    const s = e.length - 1;
    if (o === 1)
      return e[s].t = 1, e[s];
    const i = 1 - o;
    let r = e;
    if (s === 0)
      return e[0].t = o, e[0];
    if (s === 1) {
      const a = {
        x: i * r[0].x + o * r[1].x,
        y: i * r[0].y + o * r[1].y,
        t: o
      };
      return n && (a.z = i * r[0].z + o * r[1].z), a;
    }
    if (s < 4) {
      let a = i * i, l = o * o, h, u, f, d = 0;
      s === 2 ? (r = [r[0], r[1], r[2], N0], h = a, u = i * o * 2, f = l) : s === 3 && (h = a * i, u = a * o * 3, f = i * l * 3, d = o * l);
      const y = {
        x: h * r[0].x + u * r[1].x + f * r[2].x + d * r[3].x,
        y: h * r[0].y + u * r[1].y + f * r[2].y + d * r[3].y,
        t: o
      };
      return n && (y.z = h * r[0].z + u * r[1].z + f * r[2].z + d * r[3].z), y;
    }
    const c = JSON.parse(JSON.stringify(e));
    for (; c.length > 1; ) {
      for (let a = 0; a < c.length - 1; a++)
        c[a] = {
          x: c[a].x + (c[a + 1].x - c[a].x) * o,
          y: c[a].y + (c[a + 1].y - c[a].y) * o
        }, typeof c[a].z < "u" && (c[a].z = c[a].z + (c[a + 1].z - c[a].z) * o);
      c.splice(c.length - 1, 1);
    }
    return c[0].t = o, c[0];
  },
  computeWithRatios: function(o, e, n, s) {
    const i = 1 - o, r = n, c = e;
    let a = r[0], l = r[1], h = r[2], u = r[3], f;
    if (a *= i, l *= o, c.length === 2)
      return f = a + l, {
        x: (a * c[0].x + l * c[1].x) / f,
        y: (a * c[0].y + l * c[1].y) / f,
        z: s ? (a * c[0].z + l * c[1].z) / f : !1,
        t: o
      };
    if (a *= i, l *= 2 * i, h *= o * o, c.length === 3)
      return f = a + l + h, {
        x: (a * c[0].x + l * c[1].x + h * c[2].x) / f,
        y: (a * c[0].y + l * c[1].y + h * c[2].y) / f,
        z: s ? (a * c[0].z + l * c[1].z + h * c[2].z) / f : !1,
        t: o
      };
    if (a *= i, l *= 1.5 * i, h *= 3 * i, u *= o * o * o, c.length === 4)
      return f = a + l + h + u, {
        x: (a * c[0].x + l * c[1].x + h * c[2].x + u * c[3].x) / f,
        y: (a * c[0].y + l * c[1].y + h * c[2].y + u * c[3].y) / f,
        z: s ? (a * c[0].z + l * c[1].z + h * c[2].z + u * c[3].z) / f : !1,
        t: o
      };
  },
  // 导数控制点计算函数
  derive: function(o, e) {
    const n = [];
    for (let s = o, i = s.length, r = i - 1; i > 1; i--, r--) {
      const c = [];
      for (let a = 0, l; a < r; a++)
        l = {
          x: r * (s[a + 1].x - s[a].x),
          y: r * (s[a + 1].y - s[a].y)
        }, e && (l.z = r * (s[a + 1].z - s[a].z)), c.push(l);
      n.push(c), s = c;
    }
    return n;
  },
  between: function(o, e, n) {
    return e <= o && o <= n || et.approximately(o, e) || et.approximately(o, n);
  },
  approximately: function(o, e, n) {
    return ls(o - e) <= (n || C0);
  },
  length: function(o) {
    const n = et.Tvalues.length;
    let s = 0;
    for (let i = 0, r; i < n; i++)
      r = 0.5 * et.Tvalues[i] + 0.5, s += et.Cvalues[i] * et.arcfn(r, o);
    return 0.5 * s;
  },
  map: function(o, e, n, s, i) {
    const r = n - e, c = i - s, a = o - e, l = a / r;
    return s + c * l;
  },
  lerp: function(o, e, n) {
    const s = {
      x: e.x + o * (n.x - e.x),
      y: e.y + o * (n.y - e.y)
    };
    return e.z !== void 0 && n.z !== void 0 && (s.z = e.z + o * (n.z - e.z)), s;
  },
  pointToString: function(o) {
    let e = o.x + "/" + o.y;
    return typeof o.z < "u" && (e += "/" + o.z), e;
  },
  pointsToString: function(o) {
    return "[" + o.map(et.pointToString).join(", ") + "]";
  },
  copy: function(o) {
    return JSON.parse(JSON.stringify(o));
  },
  angle: function(o, e, n) {
    const s = e.x - o.x, i = e.y - o.y, r = n.x - o.x, c = n.y - o.y, a = s * c - i * r, l = s * r + i * c;
    return hs(a, l);
  },
  // round as string, to avoid rounding errors
  round: function(o, e) {
    const n = "" + o, s = n.indexOf(".");
    return parseFloat(n.substring(0, s + 1 + e));
  },
  dist: function(o, e) {
    const n = o.x - e.x, s = o.y - e.y;
    return on(n * n + s * s);
  },
  closest: function(o, e) {
    let n = Le(2, 63), s, i;
    return o.forEach(function(r, c) {
      i = et.dist(e, r), i < n && (n = i, s = c);
    }), { mdist: n, mpos: s };
  },
  abcratio: function(o, e) {
    if (e !== 2 && e !== 3)
      return !1;
    if (typeof o > "u")
      o = 0.5;
    else if (o === 0 || o === 1)
      return o;
    const n = Le(o, e) + Le(1 - o, e), s = n - 1;
    return ls(s / n);
  },
  projectionratio: function(o, e) {
    if (e !== 2 && e !== 3)
      return !1;
    if (typeof o > "u")
      o = 0.5;
    else if (o === 0 || o === 1)
      return o;
    const n = Le(1 - o, e), s = Le(o, e) + n;
    return n / s;
  },
  lli8: function(o, e, n, s, i, r, c, a) {
    const l = (o * s - e * n) * (i - c) - (o - n) * (i * a - r * c), h = (o * s - e * n) * (r - a) - (e - s) * (i * a - r * c), u = (o - n) * (r - a) - (e - s) * (i - c);
    return u == 0 ? !1 : { x: l / u, y: h / u };
  },
  lli4: function(o, e, n, s) {
    const i = o.x, r = o.y, c = e.x, a = e.y, l = n.x, h = n.y, u = s.x, f = s.y;
    return et.lli8(i, r, c, a, l, h, u, f);
  },
  lli: function(o, e) {
    return et.lli4(o, o.c, e, e.c);
  },
  makeline: function(o, e) {
    return new Ct(
      o.x,
      o.y,
      (o.x + e.x) / 2,
      (o.y + e.y) / 2,
      e.x,
      e.y
    );
  },
  findbbox: function(o) {
    let e = Ki, n = Ki, s = tr, i = tr;
    return o.forEach(function(r) {
      const c = r.bbox();
      e > c.x.min && (e = c.x.min), n > c.y.min && (n = c.y.min), s < c.x.max && (s = c.x.max), i < c.y.max && (i = c.y.max);
    }), {
      x: { min: e, mid: (e + s) / 2, max: s, size: s - e },
      y: { min: n, mid: (n + i) / 2, max: i, size: i - n }
    };
  },
  shapeintersections: function(o, e, n, s, i) {
    if (!et.bboxoverlap(e, s)) return [];
    const r = [], c = [o.startcap, o.forward, o.back, o.endcap], a = [n.startcap, n.forward, n.back, n.endcap];
    return c.forEach(function(l) {
      l.virtual || a.forEach(function(h) {
        if (h.virtual) return;
        const u = l.intersects(h, i);
        u.length > 0 && (u.c1 = l, u.c2 = h, u.s1 = o, u.s2 = n, r.push(u));
      });
    }), r;
  },
  makeshape: function(o, e, n) {
    const s = e.points.length, i = o.points.length, r = et.makeline(e.points[s - 1], o.points[0]), c = et.makeline(o.points[i - 1], e.points[0]), a = {
      startcap: r,
      forward: o,
      back: e,
      endcap: c,
      bbox: et.findbbox([r, o, e, c])
    };
    return a.intersections = function(l) {
      return et.shapeintersections(
        a,
        a.bbox,
        l,
        l.bbox,
        n
      );
    }, a;
  },
  getminmax: function(o, e, n) {
    if (!n) return { min: 0, max: 0 };
    let s = Ki, i = tr, r, c;
    n.indexOf(0) === -1 && (n = [0].concat(n)), n.indexOf(1) === -1 && n.push(1);
    for (let a = 0, l = n.length; a < l; a++)
      r = n[a], c = o.get(r), c[e] < s && (s = c[e]), c[e] > i && (i = c[e]);
    return { min: s, mid: (s + i) / 2, max: i, size: i - s };
  },
  align: function(o, e) {
    const n = e.p1.x, s = e.p1.y, i = -hs(e.p2.y - s, e.p2.x - n), r = function(c) {
      return {
        x: (c.x - n) * Ge(i) - (c.y - s) * Fn(i),
        y: (c.x - n) * Fn(i) + (c.y - s) * Ge(i)
      };
    };
    return o.map(r);
  },
  // 根据控制点求根
  roots: function(o, e) {
    e = e || { p1: { x: 0, y: 0 }, p2: { x: 1, y: 0 } };
    const n = o.length - 1, s = et.align(o, e), i = function(F) {
      return 0 <= F && F <= 1;
    };
    if (n === 2) {
      const F = s[0].y, Y = s[1].y, N = s[2].y, $ = F - 2 * Y + N;
      if ($ !== 0) {
        const W = -on(Y * Y - F * N), Q = -F + Y, ct = -(W + Q) / $, K = -(-W + Q) / $;
        return [ct, K].filter(i);
      } else if (Y !== N && $ === 0)
        return [(2 * Y - N) / (2 * Y - 2 * N)].filter(i);
      return [];
    }
    const r = s[0].y, c = s[1].y, a = s[2].y, l = s[3].y;
    let h = -r + 3 * c - 3 * a + l, u = 3 * r - 6 * c + 3 * a, f = -3 * r + 3 * c, d = r;
    if (et.approximately(h, 0)) {
      if (et.approximately(u, 0))
        return et.approximately(f, 0) ? [] : [-d / f].filter(i);
      const F = on(f * f - 4 * u * d), Y = 2 * u;
      return [(F - f) / Y, (-f - F) / Y].filter(i);
    }
    u /= h, f /= h, d /= h;
    const y = (3 * f - u * u) / 3, x = y / 3, g = (2 * u * u * u - 9 * u * f + 27 * d) / 27, w = g / 2, M = w * w + x * x * x;
    let P, S, k, O, R;
    if (M < 0) {
      const F = -y / 3, Y = F * F * F, N = on(Y), $ = -g / (2 * N), W = $ < -1 ? -1 : $ > 1 ? 1 : $, Q = z0(W), ct = us(N), K = 2 * ct;
      return k = K * Ge(Q / 3) - u / 3, O = K * Ge((Q + yi) / 3) - u / 3, R = K * Ge((Q + 2 * yi) / 3) - u / 3, [k, O, R].filter(i);
    } else {
      if (M === 0)
        return P = w < 0 ? us(-w) : -us(w), k = 2 * P - u / 3, O = -P - u / 3, [k, O].filter(i);
      {
        const F = on(M);
        return P = us(-w + F), S = us(w + F), [P - S - u / 3].filter(i);
      }
    }
  },
  // 根据导数控制点计算根，即曲线切线为零的点
  droots: function(o) {
    if (o.length === 3) {
      const e = o[0], n = o[1], s = o[2], i = e - 2 * n + s;
      if (i !== 0) {
        const r = -on(n * n - e * s), c = -e + n, a = -(r + c) / i, l = -(-r + c) / i;
        return [a, l];
      } else if (n !== s && i === 0)
        return [(2 * n - s) / (2 * (n - s))];
      return [];
    }
    if (o.length === 2) {
      const e = o[0], n = o[1];
      return e !== n ? [e / (e - n)] : [];
    }
    return [];
  },
  curvature: function(o, e, n, s, i) {
    let r, c, a, l, h = 0, u = 0;
    const f = et.compute(o, e), d = et.compute(o, n), y = f.x * f.x + f.y * f.y;
    if (s ? (r = on(
      Le(f.y * d.z - d.y * f.z, 2) + Le(f.z * d.x - d.z * f.x, 2) + Le(f.x * d.y - d.x * f.y, 2)
    ), c = Le(y + f.z * f.z, 3 / 2)) : (r = f.x * d.y - f.y * d.x, c = Le(y, 3 / 2)), r === 0 || c === 0)
      return { k: 0, r: 0 };
    if (h = r / c, u = c / r, !i) {
      const x = et.curvature(o - 1e-3, e, n, s, !0).k, g = et.curvature(o + 1e-3, e, n, s, !0).k;
      l = (g - h + (h - x)) / 2, a = (ls(g - h) + ls(h - x)) / 2;
    }
    return { k: h, r: u, dk: l, adk: a };
  },
  inflections: function(o) {
    if (o.length < 4) return [];
    const e = et.align(o, { p1: o[0], p2: o.slice(-1)[0] }), n = e[2].x * e[1].y, s = e[3].x * e[1].y, i = e[1].x * e[2].y, r = e[3].x * e[2].y, c = 18 * (-3 * n + 2 * s + 3 * i - r), a = 18 * (3 * n - s - 3 * i), l = 18 * (i - n);
    if (et.approximately(c, 0)) {
      if (!et.approximately(a, 0)) {
        let d = -l / a;
        if (0 <= d && d <= 1) return [d];
      }
      return [];
    }
    const h = 2 * c;
    if (et.approximately(h, 0)) return [];
    const u = a * a - 4 * c * l;
    if (u < 0) return [];
    const f = Math.sqrt(u);
    return [(f - a) / h, -(a + f) / h].filter(function(d) {
      return 0 <= d && d <= 1;
    });
  },
  bboxoverlap: function(o, e) {
    const n = ["x", "y"], s = n.length;
    for (let i = 0, r, c, a, l; i < s; i++)
      if (r = n[i], c = o[r].mid, a = e[r].mid, l = (o[r].size + e[r].size) / 2, ls(c - a) >= l) return !1;
    return !0;
  },
  expandbox: function(o, e) {
    e.x.min < o.x.min && (o.x.min = e.x.min), e.y.min < o.y.min && (o.y.min = e.y.min), e.z && e.z.min < o.z.min && (o.z.min = e.z.min), e.x.max > o.x.max && (o.x.max = e.x.max), e.y.max > o.y.max && (o.y.max = e.y.max), e.z && e.z.max > o.z.max && (o.z.max = e.z.max), o.x.mid = (o.x.min + o.x.max) / 2, o.y.mid = (o.y.min + o.y.max) / 2, o.z && (o.z.mid = (o.z.min + o.z.max) / 2), o.x.size = o.x.max - o.x.min, o.y.size = o.y.max - o.y.min, o.z && (o.z.size = o.z.max - o.z.min);
  },
  pairiteration: function(o, e, n) {
    const s = o.bbox(), i = e.bbox(), r = 1e5, c = n || 0.5;
    if (s.x.size + s.y.size < c && i.x.size + i.y.size < c)
      return [
        (r * (o._t1 + o._t2) / 2 | 0) / r + "/" + (r * (e._t1 + e._t2) / 2 | 0) / r
      ];
    let a = o.split(0.5), l = e.split(0.5), h = [
      { left: a.left, right: l.left },
      { left: a.left, right: l.right },
      { left: a.right, right: l.right },
      { left: a.right, right: l.left }
    ];
    h = h.filter(function(f) {
      return et.bboxoverlap(f.left.bbox(), f.right.bbox());
    });
    let u = [];
    return h.length === 0 || (h.forEach(function(f) {
      u = u.concat(
        et.pairiteration(f.left, f.right, c)
      );
    }), u = u.filter(function(f, d) {
      return u.indexOf(f) === d;
    })), u;
  },
  getccenter: function(o, e, n) {
    const s = e.x - o.x, i = e.y - o.y, r = n.x - e.x, c = n.y - e.y, a = s * Ge(cn) - i * Fn(cn), l = s * Fn(cn) + i * Ge(cn), h = r * Ge(cn) - c * Fn(cn), u = r * Fn(cn) + c * Ge(cn), f = (o.x + e.x) / 2, d = (o.y + e.y) / 2, y = (e.x + n.x) / 2, x = (e.y + n.y) / 2, g = f + a, w = d + l, M = y + h, P = x + u, S = et.lli8(f, d, g, w, y, x, M, P), k = et.dist(S, o);
    let O = hs(o.y - S.y, o.x - S.x), R = hs(e.y - S.y, e.x - S.x), F = hs(n.y - S.y, n.x - S.x), Y;
    return O < F ? ((O > R || R > F) && (O += yi), O > F && (Y = F, F = O, O = Y)) : F < R && R < O ? (Y = F, F = O, O = Y) : F += yi, S.s = O, S.e = F, S.r = k, S;
  },
  numberSort: function(o, e) {
    return o - e;
  }
};
class Ms {
  constructor(e) {
    this.curves = [], this._3d = !1, e && (this.curves = e, this._3d = this.curves[0]._3d);
  }
  valueOf() {
    return this.toString();
  }
  toString() {
    return "[" + this.curves.map(function(e) {
      return et.pointsToString(e.points);
    }).join(", ") + "]";
  }
  addCurve(e) {
    this.curves.push(e), this._3d = this._3d || e._3d;
  }
  length() {
    return this.curves.map(function(e) {
      return e.length();
    }).reduce(function(e, n) {
      return e + n;
    });
  }
  curve(e) {
    return this.curves[e];
  }
  bbox() {
    const e = this.curves;
    for (var n = e[0].bbox(), s = 1; s < e.length; s++)
      et.expandbox(n, e[s].bbox());
    return n;
  }
  offset(e) {
    const n = [];
    return this.curves.forEach(function(s) {
      n.push(...s.offset(e));
    }), new Ms(n);
  }
}
const { abs: fs, min: jo, max: Go, cos: H0, sin: B0, acos: Y0, sqrt: ds } = Math, V0 = Math.PI;
class Ct {
  constructor(e) {
    let n = e && e.forEach ? e : Array.from(arguments).slice(), s = !1;
    if (typeof n[0] == "object") {
      s = n.length;
      const y = [];
      n.forEach(function(x) {
        ["x", "y", "z"].forEach(function(g) {
          typeof x[g] < "u" && y.push(x[g]);
        });
      }), n = y;
    }
    let i = !1;
    const r = n.length;
    if (s) {
      if (s > 4) {
        if (arguments.length !== 1)
          throw new Error(
            "Only new Bezier(point[]) is accepted for 4th and higher order curves"
          );
        i = !0;
      }
    } else if (r !== 6 && r !== 8 && r !== 9 && r !== 12 && arguments.length !== 1)
      throw new Error(
        "Only new Bezier(point[]) is accepted for 4th and higher order curves"
      );
    const c = this._3d = !i && (r === 9 || r === 12) || e && e[0] && typeof e[0].z < "u", a = this.points = [];
    for (let y = 0, x = c ? 3 : 2; y < r; y += x) {
      var l = {
        x: n[y],
        y: n[y + 1]
      };
      c && (l.z = n[y + 2]), a.push(l);
    }
    const h = this.order = a.length - 1, u = this.dims = ["x", "y"];
    c && u.push("z"), this.dimlen = u.length;
    const f = et.align(a, { p1: a[0], p2: a[h] }), d = et.dist(a[0], a[h]);
    this._linear = f.reduce((y, x) => y + fs(x.y), 0) < d / 50, this._lut = [], this._t1 = 0, this._t2 = 1, this.update();
  }
  // 根据t和二次控制点创建基于t的二次贝塞曲线
  static quadraticFromPoints(e, n, s, i) {
    if (typeof i > "u" && (i = 0.5), i === 0)
      return new Ct(n, n, s);
    if (i === 1)
      return new Ct(e, n, n);
    const r = Ct.getABC(2, e, n, s, i);
    return new Ct(e, r.A, s);
  }
  // 根据t和三次控制点创建基于t的三次贝塞曲线
  static cubicFromPoints(e, n, s, i, r) {
    typeof i > "u" && (i = 0.5);
    const c = Ct.getABC(3, e, n, s, i);
    typeof r > "u" && (r = et.dist(n, c.C));
    const a = r * (1 - i) / i, l = et.dist(e, s), h = (s.x - e.x) / l, u = (s.y - e.y) / l, f = r * h, d = r * u, y = a * h, x = a * u, g = { x: n.x - f, y: n.y - d }, w = { x: n.x + y, y: n.y + x }, M = c.A, P = { x: M.x + (g.x - M.x) / (1 - i), y: M.y + (g.y - M.y) / (1 - i) }, S = { x: M.x + (w.x - M.x) / i, y: M.y + (w.y - M.y) / i }, k = { x: e.x + (P.x - e.x) / i, y: e.y + (P.y - e.y) / i }, O = {
      x: s.x + (S.x - s.x) / (1 - i),
      y: s.y + (S.y - s.y) / (1 - i)
    };
    return new Ct(e, k, O, s);
  }
  static getUtils() {
    return et;
  }
  getUtils() {
    return Ct.getUtils();
  }
  static get PolyBezier() {
    return Ms;
  }
  valueOf() {
    return this.toString();
  }
  toString() {
    return et.pointsToString(this.points);
  }
  toSVG() {
    if (this._3d) return !1;
    const e = this.points, n = e[0].x, s = e[0].y, i = ["M", n, s, this.order === 2 ? "Q" : "C"];
    for (let r = 1, c = e.length; r < c; r++)
      i.push(e[r].x), i.push(e[r].y);
    return i.join(" ");
  }
  setRatios(e) {
    if (e.length !== this.points.length)
      throw new Error("incorrect number of ratio values");
    this.ratios = e, this._lut = [];
  }
  verify() {
    const e = this.coordDigest();
    e !== this._print && (this._print = e, this.update());
  }
  coordDigest() {
    return this.points.map(function(e, n) {
      return "" + n + e.x + e.y + (e.z ? e.z : 0);
    }).join("");
  }
  update() {
    this._lut = [], this.dpoints = et.derive(this.points, this._3d), this.computedirection();
  }
  computedirection() {
    const e = this.points, n = et.angle(e[0], e[this.order], e[1]);
    this.clockwise = n > 0;
  }
  length() {
    return et.length(this.derivative.bind(this));
  }
  static getABC(e = 2, n, s, i, r = 0.5) {
    const c = et.projectionratio(r, e), a = 1 - c, l = {
      x: c * n.x + a * i.x,
      y: c * n.y + a * i.y
    }, h = et.abcratio(r, e);
    return { A: {
      x: s.x + (s.x - l.x) / h,
      y: s.y + (s.y - l.y) / h
    }, B: s, C: l, S: n, E: i };
  }
  getABC(e, n) {
    n = n || this.get(e);
    let s = this.points[0], i = this.points[this.order];
    return Ct.getABC(this.order, s, n, i, e);
  }
  // 根据步骤数分割贝塞尔曲线为多个点，并返回这些点的数组
  getLUT(e) {
    if (this.verify(), e = e || 100, this._lut.length === e + 1)
      return this._lut;
    this._lut = [], e++, this._lut = [];
    for (let n = 0, s, i; n < e; n++)
      i = n / (e - 1), s = this.compute(i), s.t = i, this._lut.push(s);
    return this._lut;
  }
  // 判断点是否在贝塞尔曲线上，并返回t值
  on(e, n) {
    n = n || 5;
    const s = this.getLUT(), i = [];
    for (let r = 0, c, a = 0; r < s.length; r++)
      c = s[r], et.dist(c, e) < n && (i.push(c), a += r / s.length);
    return i.length ? t /= i.length : !1;
  }
  // 投影点至贝塞尔曲线
  //使用基于曲线查找表 (LUT) 的两遍投影测试，查找最接近特定曲线外点的曲线内点。通过距离比较找到最接近的匹配项，然后检查该匹配项周围的精细区间，看看是否可以找到更优的投影
  project(e) {
    const n = this.getLUT(), s = n.length - 1, i = et.closest(n, e), r = i.mpos, c = (r - 1) / s, a = (r + 1) / s, l = 0.1 / s;
    let h = i.mdist, u = c, f = u, d;
    h += 1;
    for (let y; u < a + l; u += l)
      d = this.compute(u), y = et.dist(e, d), y < h && (h = y, f = u);
    return f = f < 0 ? 0 : f > 1 ? 1 : f, d = this.compute(f), d.t = f, d.d = h, d;
  }
  get(e) {
    return this.compute(e);
  }
  point(e) {
    return this.points[e];
  }
  // 计算贝塞尔曲线在t时刻的点
  compute(e) {
    return this.ratios ? et.computeWithRatios(e, this.points, this.ratios, this._3d) : et.compute(e, this.points, this._3d, this.ratios);
  }
  // 向上提升曲线阶数，使之成为更高阶的贝塞尔曲线
  raise() {
    const e = this.points, n = [e[0]], s = e.length;
    for (let i = 1, r, c; i < s; i++)
      r = e[i], c = e[i - 1], n[i] = {
        x: (s - i) / s * r.x + i / s * c.x,
        y: (s - i) / s * r.y + i / s * c.y
      };
    return n[s] = e[s - 1], new Ct(n);
  }
  //计算指定值处的曲线切线t。注意，这将生成一个非标准化的向量{x: dx, y: dy}。
  derivative(e) {
    return et.compute(e, this.dpoints[0], this._3d);
  }
  dderivative(e) {
    return et.compute(e, this.dpoints[1], this._3d);
  }
  align() {
    let e = this.points;
    return new Ct(et.align(e, { p1: e[0], p2: e[e.length - 1] }));
  }
  //t使用曲率公式计算点处的曲线曲率：
  curvature(e) {
    return et.curvature(e, this.dpoints[0], this.dpoints[1], this._3d);
  }
  //计算曲线上的所有拐点。即曲线曲率符号发生变化的所有点。
  inflections() {
    return et.inflections(this.points);
  }
  /**
   * 计算指定t值处的曲线法线。注意，这将生成一个法线化的向量{x: nx, y: ny}。
  在二维空间中，法线就是将法线向量旋转四分之一圈。在三维空间中，法线就是将法线向量绕切平面旋转四分之一圈。
   */
  normal(e) {
    return this._3d ? this.__normal3(e) : this.__normal2(e);
  }
  __normal2(e) {
    const n = this.derivative(e), s = ds(n.x * n.x + n.y * n.y);
    return { t: e, x: -n.y / s, y: n.x / s };
  }
  __normal3(e) {
    const n = this.derivative(e), s = this.derivative(e + 0.01), i = ds(n.x * n.x + n.y * n.y + n.z * n.z), r = ds(s.x * s.x + s.y * s.y + s.z * s.z);
    n.x /= i, n.y /= i, n.z /= i, s.x /= r, s.y /= r, s.z /= r;
    const c = {
      x: s.y * n.z - s.z * n.y,
      y: s.z * n.x - s.x * n.z,
      z: s.x * n.y - s.y * n.x
    }, a = ds(c.x * c.x + c.y * c.y + c.z * c.z);
    c.x /= a, c.y /= a, c.z /= a;
    const l = [
      c.x * c.x,
      c.x * c.y - c.z,
      c.x * c.z + c.y,
      c.x * c.y + c.z,
      c.y * c.y,
      c.y * c.z - c.x,
      c.x * c.z - c.y,
      c.y * c.z + c.x,
      c.z * c.z
    ];
    return {
      t: e,
      x: l[0] * n.x + l[1] * n.y + l[2] * n.z,
      y: l[3] * n.x + l[4] * n.y + l[5] * n.z,
      z: l[6] * n.x + l[7] * n.y + l[8] * n.z
    };
  }
  //在所有迭代中，为指定 t 值的曲线上点生成所有包点
  hull(e) {
    let n = this.points, s = [], i = [], r = 0;
    for (i[r++] = n[0], i[r++] = n[1], i[r++] = n[2], this.order === 3 && (i[r++] = n[3]); n.length > 1; ) {
      s = [];
      for (let c = 0, a, l = n.length - 1; c < l; c++)
        a = et.lerp(e, n[c], n[c + 1]), i[r++] = a, s.push(a);
      n = s;
    }
    return i;
  }
  //当仅给出一个值时，此函数将把曲线分成t=... 两条新曲线，这两条新曲线合在一起相当于原始曲线。
  //当提供两个t值时，曲线在 上分割t1，之后得到的第二个子曲线在 （缩放） 上分割t2，从而产生一条与区间 上的原始曲线等价的新曲线[t1,t2]。
  split(e, n) {
    if (e === 0 && n)
      return this.split(n).left;
    if (n === 1)
      return this.split(e).right;
    const s = this.hull(e), i = {
      left: this.order === 2 ? new Ct([s[0], s[3], s[5]]) : new Ct([s[0], s[4], s[7], s[9]]),
      right: this.order === 2 ? new Ct([s[5], s[4], s[2]]) : new Ct([s[9], s[8], s[6], s[3]]),
      span: s
    };
    return i.left._t1 = et.map(0, 0, 1, this._t1, this._t2), i.left._t2 = et.map(e, 0, 1, this._t1, this._t2), i.right._t1 = et.map(e, 0, 1, this._t1, this._t2), i.right._t2 = et.map(1, 0, 1, this._t1, this._t2), n ? (n = et.map(n, e, 1, 0, 1), i.right.split(n).left) : i;
  }
  /*** 
   * 计算曲线上的所有极值。极值是针对每个维度而不是整条曲线计算的，因此结果不是凸/凹过渡的数量，而是每个单独维度的过渡数量。
   * 此函数生成一个对象，其中每个维度列出了出现极值的值 {x: [num, num, ...], y: [...], z: [...], values: [...]} 数组，仅当曲线是 3d 曲线时才存在，并且该属性是所有维度上的值的总和。tzvaluest
  */
  extrema() {
    const e = {};
    let n = [];
    return this.dims.forEach(
      (function(s) {
        let i = function(c) {
          return c[s];
        }, r = this.dpoints[0].map(i);
        e[s] = et.droots(r), this.order === 3 && (r = this.dpoints[1].map(i), e[s] = e[s].concat(et.droots(r))), e[s] = e[s].filter(function(c) {
          return c >= 0 && c <= 1;
        }), n = n.concat(e[s].sort(et.numberSort));
      }).bind(this)
    ), e.values = n.sort(et.numberSort).filter(function(s, i) {
      return n.indexOf(s) === i;
    }), e;
  }
  // 根据其外壳坐标和极值计算（如果未缓存）此曲线的边界框。
  bbox() {
    const e = this.extrema(), n = {};
    return this.dims.forEach(
      (function(s) {
        n[s] = et.getminmax(this, s, e[s]);
      }).bind(this)
    ), n;
  }
  overlaps(e) {
    const n = this.bbox(), s = e.bbox();
    return et.bboxoverlap(n, s);
  }
  /**
   * 如果仅使用距离参数调用此函数，则会创建一条沿曲线法线偏移距离为 的新曲线d。请注意，这里隐藏着深奥的魔法，贝塞尔曲线的偏移曲线永远不可能是另一条贝塞尔曲线。因此，此函数“作弊”并生成一个曲线数组，这些曲线组合在一起，形成一条与理论上的偏移曲线等同的连续曲线。
  
  如果同时给出了距离和t值，则返回坐标，表示曲线上位于 处的点t=...，沿其法线偏移距离d。
   * @param {*} t 
   * @param {*} d 
   * @returns 
   */
  offset(e, n) {
    if (typeof n < "u") {
      const s = this.get(e), i = this.normal(e), r = {
        c: s,
        n: i,
        x: s.x + i.x * n,
        y: s.y + i.y * n
      };
      return this._3d && (r.z = s.z + i.z * n), r;
    }
    if (this._linear) {
      const s = this.normal(0), i = this.points.map(function(r) {
        const c = {
          x: r.x + e * s.x,
          y: r.y + e * s.y
        };
        return r.z && s.z && (c.z = r.z + e * s.z), c;
      });
      return [new Ct(i)];
    }
    return this.reduce().map(function(s) {
      return s._linear ? s.offset(e)[0] : s.scale(e);
    });
  }
  simple() {
    if (this.order === 3) {
      const i = et.angle(this.points[0], this.points[3], this.points[1]), r = et.angle(this.points[0], this.points[3], this.points[2]);
      if (i > 0 && r < 0 || i < 0 && r > 0) return !1;
    }
    const e = this.normal(0), n = this.normal(1);
    let s = e.x * n.x + e.y * n.y;
    return this._3d && (s += e.z * n.z), fs(Y0(s)) < V0 / 3;
  }
  /**
   * 将曲线简化为“简单”子曲线的集合，其中简单性定义为所有控制点都在基线的同一侧（三次曲线具有控制到端点线不得交叉的附加约束），并且端点法线之间的角度不大于 60 度。
   * @returns 
   */
  reduce() {
    let e, n = 0, s = 0, i = 0.01, r, c = [], a = [], l = this.extrema().values;
    for (l.indexOf(0) === -1 && (l = [0].concat(l)), l.indexOf(1) === -1 && l.push(1), n = l[0], e = 1; e < l.length; e++)
      s = l[e], r = this.split(n, s), r._t1 = n, r._t2 = s, c.push(r), n = s;
    return c.forEach(function(h) {
      for (n = 0, s = 0; s <= 1; )
        for (s = n + i; s <= 1 + i; s += i)
          if (r = h.split(n, s), !r.simple()) {
            if (s -= i, fs(n - s) < i)
              return [];
            r = h.split(n, s), r._t1 = et.map(n, 0, 1, h._t1, h._t2), r._t2 = et.map(s, 0, 1, h._t1, h._t2), a.push(r), n = s;
            break;
          }
      n < 1 && (r = h.split(n, 1), r._t1 = et.map(n, 0, 1, h._t1, h._t2), r._t2 = h._t2, a.push(r));
    }), a;
  }
  translate(e, n, s) {
    s = typeof s == "number" ? s : n;
    const i = this.order;
    let r = this.points.map((c, a) => (1 - a / i) * n + a / i * s);
    return new Ct(
      this.points.map((c, a) => ({
        x: c.x + e.x * r[a],
        y: c.y + e.y * r[a]
      }))
    );
  }
  scale(e) {
    const n = this.order;
    let s = !1;
    if (typeof e == "function" && (s = e), s && n === 2)
      return this.raise().scale(s);
    const i = this.clockwise, r = this.points;
    if (this._linear)
      return this.translate(
        this.normal(0),
        s ? s(0) : e,
        s ? s(1) : e
      );
    const c = s ? s(0) : e, a = s ? s(1) : e, l = [this.offset(0, 10), this.offset(1, 10)], h = [], u = et.lli4(l[0], l[0].c, l[1], l[1].c);
    if (!u)
      throw new Error("cannot scale this curve. Try reducing it first.");
    return [0, 1].forEach(function(f) {
      const d = h[f * n] = et.copy(r[f * n]);
      d.x += (f ? a : c) * l[f].n.x, d.y += (f ? a : c) * l[f].n.y;
    }), s ? ([0, 1].forEach(function(f) {
      if (!(n === 2 && f)) {
        var d = r[f + 1], y = {
          x: d.x - u.x,
          y: d.y - u.y
        }, x = s ? s((f + 1) / n) : e;
        s && !i && (x = -x);
        var g = ds(y.x * y.x + y.y * y.y);
        y.x /= g, y.y /= g, h[f + 1] = {
          x: d.x + x * y.x,
          y: d.y + x * y.y
        };
      }
    }), new Ct(h)) : ([0, 1].forEach((f) => {
      if (n === 2 && f) return;
      const d = h[f * n], y = this.derivative(f), x = { x: d.x + y.x, y: d.y + y.y };
      h[f + 1] = et.lli4(d, x, u, r[f + 1]);
    }), new Ct(h));
  }
  /**
   * 这将生成一条曲线的轮廓，该轮廓沿着曲线法线和反向法线方向的一定距离d。结果是一个曲线数组，这些曲线组合在一起构成了该曲线的轮廓路径。顶点是三次贝塞尔曲线，其控制点的方向形成一条直线。
   通过使用四个距离测量来实现渐进偏移，其中d1 是沿法线的初始偏移，d2沿反法线的初始距离，d3沿法线的最终偏移，以及d4沿反法线的最终偏移。
  * @param {*} d1 
   * @param {*} d2 
   * @param {*} d3 
   * @param {*} d4 
   * @returns 
   */
  outline(e, n, s, i) {
    if (n = n === void 0 ? e : n, this._linear) {
      const O = this.normal(0), R = this.points[0], F = this.points[this.points.length - 1];
      let Y, N, $;
      s === void 0 && (s = e, i = n), Y = { x: R.x + O.x * e, y: R.y + O.y * e }, $ = { x: F.x + O.x * s, y: F.y + O.y * s }, N = { x: (Y.x + $.x) / 2, y: (Y.y + $.y) / 2 };
      const W = [Y, N, $];
      Y = { x: R.x - O.x * n, y: R.y - O.y * n }, $ = { x: F.x - O.x * i, y: F.y - O.y * i }, N = { x: (Y.x + $.x) / 2, y: (Y.y + $.y) / 2 };
      const Q = [$, N, Y], ct = et.makeline(Q[2], W[0]), K = et.makeline(W[2], Q[0]), j = [ct, new Ct(W), K, new Ct(Q)];
      return new Ms(j);
    }
    const r = this.reduce(), c = r.length, a = [];
    let l = [], h, u = 0, f = this.length();
    const d = typeof s < "u" && typeof i < "u";
    function y(O, R, F, Y, N) {
      return function($) {
        const W = Y / F, Q = (Y + N) / F, ct = R - O;
        return et.map($, 0, 1, O + W * ct, O + Q * ct);
      };
    }
    r.forEach(function(O) {
      const R = O.length();
      d ? (a.push(
        O.scale(y(e, s, f, u, R))
      ), l.push(
        O.scale(y(-n, -i, f, u, R))
      )) : (a.push(O.scale(e)), l.push(O.scale(-n))), u += R;
    }), l = l.map(function(O) {
      return h = O.points, h[3] ? O.points = [h[3], h[2], h[1], h[0]] : O.points = [h[2], h[1], h[0]], O;
    }).reverse();
    const x = a[0].points[0], g = a[c - 1].points[a[c - 1].points.length - 1], w = l[c - 1].points[l[c - 1].points.length - 1], M = l[0].points[0], P = et.makeline(w, x), S = et.makeline(g, M), k = [P].concat(a).concat([S]).concat(l);
    return new Ms(k);
  }
  /**
   * 这会将曲线轮廓生成为一系列形状，而不是路径序列。每个形状都是一个对象{startcap: (bezier), forward: (bezier), endcap: (bezier), back: (bezier)}。此外，每个端点都有一个.virtual属性，用于指示它是原始曲线轮廓的真正端点，还是轮廓形状集合中某个位置的中间端点。
   * @param {*} d1 
   * @param {*} d2 
   * @param {*} curveIntersectionThreshold 
   * @returns 
   */
  outlineshapes(e, n, s) {
    n = n || e;
    const i = this.outline(e, n).curves, r = [];
    for (let c = 1, a = i.length; c < a / 2; c++) {
      const l = et.makeshape(
        i[c],
        i[a - c],
        s
      );
      l.startcap.virtual = c > 1, l.endcap.virtual = c < a / 2 - 1, r.push(l);
    }
    return r;
  }
  /**
   * 如果不带参数，此函数将检查自相交。这意味着它对二次曲线没有意义，二次曲线若自相交则为退化曲线（即所有坐标都位于同一条线上，因此与其说是“曲线”，不如说是一种“奇怪的画线方法”）。相交结果将返回一个字符串数组float/float，其中两个浮点数由字符分隔/，并且两个浮点数都对应于t相交点处的曲线值。
   * @param {*} curve 
   * @param {*} curveIntersectionThreshold 
   * @returns 
   */
  intersects(e, n) {
    return e ? e.p1 && e.p2 ? this.lineIntersects(e) : (e instanceof Ct && (e = e.reduce()), this.curveintersects(
      this.reduce(),
      e,
      n
    )) : this.selfintersects(n);
  }
  /**
    * 查找此曲线与某条线的交点{p1: {x:... ,y:...}, p2: ... }。交点是t此曲线上的值的数组。
  首先对曲线进行对齐（平移/旋转），使曲线的第一个坐标为 (0,0)，然后旋转曲线，使相交线与 x 轴重合。这样做会将“查找交点”转换为简单的“查找根点”。
  作为求根解决方案，使用您可能在高中时记得的标准平方根函数以及绝对非标准的 Cardano 求解立方根函数算法，以符号方式计算二次和三次曲线的根。
    * @param {*} line 
    * @returns 
    */
  lineIntersects(e) {
    const n = jo(e.p1.x, e.p2.x), s = jo(e.p1.y, e.p2.y), i = Go(e.p1.x, e.p2.x), r = Go(e.p1.y, e.p2.y);
    return et.roots(this.points, e).filter((c) => {
      var a = this.get(c);
      return et.between(a.x, n, i) && et.between(a.y, s, r);
    });
  }
  selfintersects(e) {
    const n = this.reduce(), s = n.length - 2, i = [];
    for (let r = 0, c, a, l; r < s; r++)
      a = n.slice(r, r + 1), l = n.slice(r + 2), c = this.curveintersects(a, l, e), i.push(...c);
    return i;
  }
  curveintersects(e, n, s) {
    const i = [];
    e.forEach(function(c) {
      n.forEach(function(a) {
        c.overlaps(a) && i.push({ left: c, right: a });
      });
    });
    let r = [];
    return i.forEach(function(c) {
      const a = et.pairiteration(
        c.left,
        c.right,
        s
      );
      a.length > 0 && (r = r.concat(a));
    }), r;
  }
  /** 
   * 将贝塞尔曲线近似为一系列圆弧。可选的阈值参数控制圆弧需要达到何种程度的拟合才能被视为合理的近似值。阈值越高，圆弧拟合的精度越低。如果未设置明确的阈值，则使用threshold的值。0.5
  */
  arcs(e) {
    return e = e || 0.5, this._iterate(e, []);
  }
  _error(e, n, s, i) {
    const r = (i - s) / 4, c = this.get(s + r), a = this.get(i - r), l = et.dist(e, n), h = et.dist(e, c), u = et.dist(e, a);
    return fs(h - l) + fs(u - l);
  }
  _iterate(e, n) {
    let s = 0, i = 1, r;
    do {
      r = 0, i = 1;
      let c = this.get(s), a, l, h, u, f = !1, d = !1, y, x = i, g = 1;
      do
        if (d = f, u = h, x = (s + i) / 2, a = this.get(x), l = this.get(i), h = et.getccenter(c, a, l), h.interval = {
          start: s,
          end: i
        }, f = this._error(h, c, s, i) <= e, y = d && !f, y || (g = i), f) {
          if (i >= 1) {
            if (h.interval.end = g = 1, u = h, i > 1) {
              let M = {
                x: h.x + h.r * H0(h.e),
                y: h.y + h.r * B0(h.e)
              };
              h.e += et.angle({ x: h.x, y: h.y }, M, this.get(1));
            }
            break;
          }
          i = i + (i - s) / 2;
        } else
          i = x;
      while (!y && r++ < 100);
      if (r >= 100)
        break;
      u = u || h, n.push(u), s = g;
    } while (i < 1);
    return n;
  }
}
const J1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Bezier: Ct
}, Symbol.toStringTag, { value: "Module" })), er = new Float32Array([
  1,
  0,
  0,
  1
]);
class se extends Float32Array {
  /**
   * The number of bytes in a {@link Mat2}.
   */
  static BYTE_LENGTH = 4 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Mat2}.
   */
  constructor(...e) {
    switch (e.length) {
      case 4:
        super(e);
        break;
      case 2:
        super(e[0], e[1], 4);
        break;
      case 1:
        const n = e[0];
        n === void 0 ? super(er) : typeof n == "number" ? super([
          n,
          n,
          n,
          n
        ]) : super(n, 0, 4);
        break;
      default:
        super(er);
        break;
    }
  }
  //============
  // Attributes
  //============
  /**
   * A string representation of `this`
   * Equivalent to `Mat2.str(this);`
   */
  get str() {
    return se.str(this);
  }
  //===================
  // Instance methods
  //===================
  /**
   * Copy the values from another {@link Mat2} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(e) {
    return this.set(e), this;
  }
  /**
   * Set `this` to the identity matrix
   * Equivalent to Mat2.identity(this)
   *
   * @returns `this`
   */
  identity() {
    return this.set(er), this;
  }
  /**
   * Multiplies this {@link Mat2} against another one
   * Equivalent to `Mat2.multiply(this, this, b);`
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `this`
   */
  multiply(e) {
    return se.multiply(this, this, e);
  }
  /**
   * Alias for {@link Mat2.multiply}
   */
  mul(e) {
    return this;
  }
  /**
   * Transpose this {@link Mat2}
   * Equivalent to `Mat2.transpose(this, this);`
   *
   * @returns `this`
   */
  transpose() {
    return se.transpose(this, this);
  }
  /**
   * Inverts this {@link Mat2}
   * Equivalent to `Mat2.invert(this, this);`
   *
   * @returns `this`
   */
  invert() {
    return se.invert(this, this);
  }
  /**
   * Scales this {@link Mat2} by the dimensions in the given vec3 not using vectorization
   * Equivalent to `Mat2.scale(this, this, v);`
   *
   * @param v - The {@link Vec2} to scale the matrix by
   * @returns `this`
   */
  scale(e) {
    return se.scale(this, this, e);
  }
  /**
   * Rotates this {@link Mat2} by the given angle around the given axis
   * Equivalent to `Mat2.rotate(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  rotate(e) {
    return se.rotate(this, this, e);
  }
  //================
  // Static methods
  //================
  /**
   * Creates a new, identity {@link Mat2}
   * @category Static
   *
   * @returns A new {@link Mat2}
   */
  static create() {
    return new se();
  }
  /**
   * Creates a new {@link Mat2} initialized with values from an existing matrix
   * @category Static
   *
   * @param a - Matrix to clone
   * @returns A new {@link Mat2}
   */
  static clone(e) {
    return new se(e);
  }
  /**
   * Copy the values from one {@link Mat2} to another
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - Matrix to copy
   * @returns `out`
   */
  static copy(e, n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e;
  }
  /**
   * Create a new {@link Mat2} with the given values
   * @category Static
   *
   * @param values - Matrix components
   * @returns A new {@link Mat2}
   */
  static fromValues(...e) {
    return new se(...e);
  }
  /**
   * Set the components of a {@link Mat2} to the given values
   * @category Static
   *
   * @param out - The receiving matrix
   * @param values - Matrix components
   * @returns `out`
   */
  static set(e, ...n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e;
  }
  /**
   * Set a {@link Mat2} to the identity matrix
   * @category Static
   *
   * @param out - The receiving matrix
   * @returns `out`
   */
  static identity(e) {
    return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e;
  }
  /**
   * Transpose the values of a {@link Mat2}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static transpose(e, n) {
    if (e === n) {
      let s = n[1];
      e[1] = n[2], e[2] = s;
    } else
      e[0] = n[0], e[1] = n[2], e[2] = n[1], e[3] = n[3];
    return e;
  }
  /**
   * Inverts a {@link Mat2}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out` or `null` if the matrix is not invertable
   */
  static invert(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[3];
    let a = s * c - r * i;
    return a ? (a = 1 / a, e[0] = c * a, e[1] = -i * a, e[2] = -r * a, e[3] = s * a, e) : null;
  }
  /**
   * Calculates the adjugate of a {@link Mat2}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static adjoint(e, n) {
    const s = n[0];
    return e[0] = n[3], e[1] = -n[1], e[2] = -n[2], e[3] = s, e;
  }
  /**
   * Calculates the determinant of a {@link Mat2}
   * @category Static
   *
   * @param a - the source matrix
   * @returns determinant of a
   */
  static determinant(e) {
    return e[0] * e[3] - e[2] * e[1];
  }
  /**
   * Adds two {@link Mat2}'s
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static add(e, n, s) {
    return e[0] = n[0] + s[0], e[1] = n[1] + s[1], e[2] = n[2] + s[2], e[3] = n[3] + s[3], e;
  }
  /**
   * Subtracts matrix b from matrix a
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static subtract(e, n, s) {
    return e[0] = n[0] - s[0], e[1] = n[1] - s[1], e[2] = n[2] - s[2], e[3] = n[3] - s[3], e;
  }
  /**
   * Alias for {@link Mat2.subtract}
   * @category Static
   */
  static sub(e, n, s) {
    return e;
  }
  /**
   * Multiplies two {@link Mat2}s
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static multiply(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = s[0], h = s[1], u = s[2], f = s[3];
    return e[0] = i * l + c * h, e[1] = r * l + a * h, e[2] = i * u + c * f, e[3] = r * u + a * f, e;
  }
  /**
   * Alias for {@link Mat2.multiply}
   * @category Static
   */
  static mul(e, n, s) {
    return e;
  }
  /**
   * Rotates a {@link Mat2} by the given angle
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotate(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = Math.sin(s), h = Math.cos(s);
    return e[0] = i * h + c * l, e[1] = r * h + a * l, e[2] = i * -l + c * h, e[3] = r * -l + a * h, e;
  }
  /**
   * Scales the {@link Mat2} by the dimensions in the given {@link Vec2}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param v - the {@link Vec2} to scale the matrix by
   * @returns `out`
   **/
  static scale(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = s[0], h = s[1];
    return e[0] = i * l, e[1] = r * l, e[2] = c * h, e[3] = a * h, e;
  }
  /**
   * Creates a {@link Mat2} from a given angle around a given axis
   * This is equivalent to (but much faster than):
   *
   *     mat2.identity(dest);
   *     mat2.rotate(dest, dest, rad);
   * @category Static
   *
   * @param out - {@link Mat2} receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromRotation(e, n) {
    const s = Math.sin(n), i = Math.cos(n);
    return e[0] = i, e[1] = s, e[2] = -s, e[3] = i, e;
  }
  /**
   * Creates a {@link Mat2} from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat2.identity(dest);
   *     mat2.scale(dest, dest, vec);
   * @category Static
   *
   * @param out - {@link Mat2} receiving operation result
   * @param v - Scaling vector
   * @returns `out`
   */
  static fromScaling(e, n) {
    return e[0] = n[0], e[1] = 0, e[2] = 0, e[3] = n[1], e;
  }
  /**
   * Returns Frobenius norm of a {@link Mat2}
   * @category Static
   *
   * @param a - the matrix to calculate Frobenius norm of
   * @returns Frobenius norm
   */
  static frob(e) {
    return Math.sqrt(e[0] * e[0] + e[1] * e[1] + e[2] * e[2] + e[3] * e[3]);
  }
  /**
   * Multiply each element of a {@link Mat2} by a scalar.
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param b - amount to scale the matrix's elements by
   * @returns `out`
   */
  static multiplyScalar(e, n, s) {
    return e[0] = n[0] * s, e[1] = n[1] * s, e[2] = n[2] * s, e[3] = n[3] * s, e;
  }
  /**
   * Adds two {@link Mat2}'s after multiplying each element of the second operand by a scalar value.
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param scale - the amount to scale b's elements by before adding
   * @returns `out`
   */
  static multiplyScalarAndAdd(e, n, s, i) {
    return e[0] = n[0] + s[0] * i, e[1] = n[1] + s[1] * i, e[2] = n[2] + s[2] * i, e[3] = n[3] + s[3] * i, e;
  }
  /**
   * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
   * @category Static
   *
   * @param L - the lower triangular matrix
   * @param D - the diagonal matrix
   * @param U - the upper triangular matrix
   * @param a - the input matrix to factorize
   */
  static LDU(e, n, s, i) {
    return e[2] = i[2] / i[0], s[0] = i[0], s[1] = i[1], s[3] = i[3] - e[2] * s[1], [e, n, s];
  }
  /**
   * Returns whether or not two {@link Mat2}s have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static exactEquals(e, n) {
    return e[0] === n[0] && e[1] === n[1] && e[2] === n[2] && e[3] === n[3];
  }
  /**
   * Returns whether or not two {@link Mat2}s have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static equals(e, n) {
    const s = e[0], i = e[1], r = e[2], c = e[3], a = n[0], l = n[1], h = n[2], u = n[3];
    return Math.abs(s - a) <= dt * Math.max(1, Math.abs(s), Math.abs(a)) && Math.abs(i - l) <= dt * Math.max(1, Math.abs(i), Math.abs(l)) && Math.abs(r - h) <= dt * Math.max(1, Math.abs(r), Math.abs(h)) && Math.abs(c - u) <= dt * Math.max(1, Math.abs(c), Math.abs(u));
  }
  /**
   * Returns a string representation of a {@link Mat2}
   * @category Static
   *
   * @param a - matrix to represent as a string
   * @returns string representation of the matrix
   */
  static str(e) {
    return `Mat2(${e.join(", ")})`;
  }
}
se.prototype.mul = se.prototype.multiply;
se.mul = se.multiply;
se.sub = se.subtract;
const U0 = se, nr = new Float32Array([
  1,
  0,
  0,
  1,
  0,
  0
]);
class we extends Float32Array {
  /**
   * The number of bytes in a {@link Mat2d}.
   */
  static BYTE_LENGTH = 6 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Mat2}.
   */
  constructor(...e) {
    switch (e.length) {
      case 6:
        super(e);
        break;
      case 2:
        super(e[0], e[1], 6);
        break;
      case 1:
        const n = e[0];
        n === void 0 ? super(nr) : typeof n == "number" ? super([
          n,
          n,
          n,
          n,
          n,
          n
        ]) : super(n, 0, 6);
        break;
      default:
        super(nr);
        break;
    }
  }
  //============
  // Attributes
  //============
  /**
   * A string representation of `this`
   * Equivalent to `Mat2d.str(this);`
   */
  get str() {
    return we.str(this);
  }
  //===================
  // Instances methods
  //===================
  /**
   * Copy the values from another {@link Mat2d} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(e) {
    return this.set(e), this;
  }
  /**
   * Set `this` to the identity matrix
   * Equivalent to Mat2d.identity(this)
   *
   * @returns `this`
   */
  identity() {
    return this.set(nr), this;
  }
  /**
   * Multiplies this {@link Mat2d} against another one
   * Equivalent to `Mat2d.multiply(this, this, b);`
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `this`
   */
  multiply(e) {
    return we.multiply(this, this, e);
  }
  /**
   * Alias for {@link Mat2d.multiply}
   */
  mul(e) {
    return this;
  }
  /**
   * Translate this {@link Mat2d} by the given vector
   * Equivalent to `Mat2d.translate(this, this, v);`
   *
   * @param v - The {@link Vec2} to translate by
   * @returns `this`
   */
  translate(e) {
    return we.translate(this, this, e);
  }
  /**
   * Rotates this {@link Mat2d} by the given angle around the given axis
   * Equivalent to `Mat2d.rotate(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  rotate(e) {
    return we.rotate(this, this, e);
  }
  /**
   * Scales this {@link Mat2d} by the dimensions in the given vec3 not using vectorization
   * Equivalent to `Mat2d.scale(this, this, v);`
   *
   * @param v - The {@link Vec2} to scale the matrix by
   * @returns `this`
   */
  scale(e) {
    return we.scale(this, this, e);
  }
  //================
  // Static methods
  //================
  /**
   * Creates a new, identity {@link Mat2d}
   * @category Static
   *
   * @returns A new {@link Mat2d}
   */
  static create() {
    return new we();
  }
  /**
   * Creates a new {@link Mat2d} initialized with values from an existing matrix
   * @category Static
   *
   * @param a - Matrix to clone
   * @returns A new {@link Mat2d}
   */
  static clone(e) {
    return new we(e);
  }
  /**
   * Copy the values from one {@link Mat2d} to another
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - Matrix to copy
   * @returns `out`
   */
  static copy(e, n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e;
  }
  /**
   * Create a new {@link Mat2d} with the given values
   * @category Static
   *
   * @param values - Matrix components
   * @returns A new {@link Mat2d}
   */
  static fromValues(...e) {
    return new we(...e);
  }
  /**
   * Set the components of a {@link Mat2d} to the given values
   * @category Static
   *
   * @param out - The receiving matrix
   * @param values - Matrix components
   * @returns `out`
   */
  static set(e, ...n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e;
  }
  /**
   * Set a {@link Mat2d} to the identity matrix
   * @category Static
   *
   * @param out - The receiving matrix
   * @returns `out`
   */
  static identity(e) {
    return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = 0, e[5] = 0, e;
  }
  /**
   * Inverts a {@link Mat2d}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out` or `null` if the matrix is not invertable
   */
  static invert(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[3], a = n[4], l = n[5];
    let h = s * c - i * r;
    return h ? (h = 1 / h, e[0] = c * h, e[1] = -i * h, e[2] = -r * h, e[3] = s * h, e[4] = (r * l - c * a) * h, e[5] = (i * a - s * l) * h, e) : null;
  }
  /**
   * Calculates the determinant of a {@link Mat2d}
   * @category Static
   *
   * @param a - the source matrix
   * @returns determinant of a
   */
  static determinant(e) {
    return e[0] * e[3] - e[1] * e[2];
  }
  /**
   * Adds two {@link Mat2d}'s
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static add(e, n, s) {
    return e[0] = n[0] + s[0], e[1] = n[1] + s[1], e[2] = n[2] + s[2], e[3] = n[3] + s[3], e[4] = n[4] + s[4], e[5] = n[5] + s[5], e;
  }
  /**
   * Subtracts matrix b from matrix a
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static subtract(e, n, s) {
    return e[0] = n[0] - s[0], e[1] = n[1] - s[1], e[2] = n[2] - s[2], e[3] = n[3] - s[3], e[4] = n[4] - s[4], e[5] = n[5] - s[5], e;
  }
  /**
   * Alias for {@link Mat2d.subtract}
   * @category Static
   */
  static sub(e, n, s) {
    return e;
  }
  /**
   * Multiplies two {@link Mat2d}s
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static multiply(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = n[4], h = n[5], u = s[0], f = s[1], d = s[2], y = s[3], x = s[4], g = s[5];
    return e[0] = i * u + c * f, e[1] = r * u + a * f, e[2] = i * d + c * y, e[3] = r * d + a * y, e[4] = i * x + c * g + l, e[5] = r * x + a * g + h, e;
  }
  /**
   * Alias for {@link Mat2d.multiply}
   * @category Static
   */
  static mul(e, n, s) {
    return e;
  }
  /**
   * Translate a {@link Mat2d} by the given vector
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to translate
   * @param v - vector to translate by
   * @returns `out`
   */
  static translate(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = n[4], h = n[5], u = s[0], f = s[1];
    return e[0] = i, e[1] = r, e[2] = c, e[3] = a, e[4] = i * u + c * f + l, e[5] = r * u + a * f + h, e;
  }
  /**
   * Rotates a {@link Mat2d} by the given angle
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotate(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = n[4], h = n[5], u = Math.sin(s), f = Math.cos(s);
    return e[0] = i * f + c * u, e[1] = r * f + a * u, e[2] = i * -u + c * f, e[3] = r * -u + a * f, e[4] = l, e[5] = h, e;
  }
  /**
   * Scales the {@link Mat2d} by the dimensions in the given {@link Vec2}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param v - the {@link Vec2} to scale the matrix by
   * @returns `out`
   **/
  static scale(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = n[4], h = n[5], u = s[0], f = s[1];
    return e[0] = i * u, e[1] = r * u, e[2] = c * f, e[3] = a * f, e[4] = l, e[5] = h, e;
  }
  // TODO: Got to fromRotation
  /**
   * Creates a {@link Mat2d} from a vector translation
   * This is equivalent to (but much faster than):
   *
   *     Mat2d.identity(dest);
   *     Mat2d.translate(dest, dest, vec);
   * @category Static
   *
   * @param out - {@link Mat2d} receiving operation result
   * @param v - Translation vector
   * @returns `out`
   */
  static fromTranslation(e, n) {
    return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = n[0], e[5] = n[1], e;
  }
  /**
   * Creates a {@link Mat2d} from a given angle around a given axis
   * This is equivalent to (but much faster than):
   *
   *     Mat2d.identity(dest);
   *     Mat2d.rotate(dest, dest, rad);
   * @category Static
   *
   * @param out - {@link Mat2d} receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromRotation(e, n) {
    const s = Math.sin(n), i = Math.cos(n);
    return e[0] = i, e[1] = s, e[2] = -s, e[3] = i, e[4] = 0, e[5] = 0, e;
  }
  /**
   * Creates a {@link Mat2d} from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     Mat2d.identity(dest);
   *     Mat2d.scale(dest, dest, vec);
   * @category Static
   *
   * @param out - {@link Mat2d} receiving operation result
   * @param v - Scaling vector
   * @returns `out`
   */
  static fromScaling(e, n) {
    return e[0] = n[0], e[1] = 0, e[2] = 0, e[3] = n[1], e[4] = 0, e[5] = 0, e;
  }
  /**
   * Returns Frobenius norm of a {@link Mat2d}
   * @category Static
   *
   * @param a - the matrix to calculate Frobenius norm of
   * @returns Frobenius norm
   */
  static frob(e) {
    return Math.sqrt(e[0] * e[0] + e[1] * e[1] + e[2] * e[2] + e[3] * e[3] + e[4] * e[4] + e[5] * e[5] + 1);
  }
  /**
   * Multiply each element of a {@link Mat2d} by a scalar.
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param b - amount to scale the matrix's elements by
   * @returns `out`
   */
  static multiplyScalar(e, n, s) {
    return e[0] = n[0] * s, e[1] = n[1] * s, e[2] = n[2] * s, e[3] = n[3] * s, e[4] = n[4] * s, e[5] = n[5] * s, e;
  }
  /**
   * Adds two {@link Mat2d}'s after multiplying each element of the second operand by a scalar value.
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param scale - the amount to scale b's elements by before adding
   * @returns `out`
   */
  static multiplyScalarAndAdd(e, n, s, i) {
    return e[0] = n[0] + s[0] * i, e[1] = n[1] + s[1] * i, e[2] = n[2] + s[2] * i, e[3] = n[3] + s[3] * i, e[4] = n[4] + s[4] * i, e[5] = n[5] + s[5] * i, e;
  }
  /**
   * Returns whether or not two {@link Mat2d}s have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static exactEquals(e, n) {
    return e[0] === n[0] && e[1] === n[1] && e[2] === n[2] && e[3] === n[3] && e[4] === n[4] && e[5] === n[5];
  }
  /**
   * Returns whether or not two {@link Mat2d}s have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static equals(e, n) {
    const s = e[0], i = e[1], r = e[2], c = e[3], a = e[4], l = e[5], h = n[0], u = n[1], f = n[2], d = n[3], y = n[4], x = n[5];
    return Math.abs(s - h) <= dt * Math.max(1, Math.abs(s), Math.abs(h)) && Math.abs(i - u) <= dt * Math.max(1, Math.abs(i), Math.abs(u)) && Math.abs(r - f) <= dt * Math.max(1, Math.abs(r), Math.abs(f)) && Math.abs(c - d) <= dt * Math.max(1, Math.abs(c), Math.abs(d)) && Math.abs(a - y) <= dt * Math.max(1, Math.abs(a), Math.abs(y)) && Math.abs(l - x) <= dt * Math.max(1, Math.abs(l), Math.abs(x));
  }
  /**
   * Returns a string representation of a {@link Mat2d}
   * @category Static
   *
   * @param a - matrix to represent as a string
   * @returns string representation of the matrix
   */
  static str(e) {
    return `Mat2d(${e.join(", ")})`;
  }
}
we.mul = we.multiply;
we.sub = we.subtract;
const X0 = we, sr = new Float32Array([
  1,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  1
]);
class Xt extends Float32Array {
  /**
   * The number of bytes in a {@link Mat3}.
   */
  static BYTE_LENGTH = 9 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Mat3}.
   */
  constructor(...e) {
    switch (e.length) {
      case 9:
        super(e);
        break;
      case 2:
        super(e[0], e[1], 9);
        break;
      case 1:
        const n = e[0];
        n === void 0 ? super(sr) : typeof n == "number" ? super([
          n,
          n,
          n,
          n,
          n,
          n,
          n,
          n,
          n
        ]) : super(n, 0, 9);
        break;
      default:
        super(sr);
        break;
    }
  }
  //============
  // Attributes
  //============
  /**
   * A string representation of `this`
   * Equivalent to `Mat3.str(this);`
   */
  get str() {
    return Xt.str(this);
  }
  //===================
  // Instance methods
  //===================
  /**
   * Copy the values from another {@link Mat3} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(e) {
    return this.set(e), this;
  }
  /**
   * Set `this` to the identity matrix
   * Equivalent to Mat3.identity(this)
   *
   * @returns `this`
   */
  identity() {
    return this.set(sr), this;
  }
  /**
   * Multiplies this {@link Mat3} against another one
   * Equivalent to `Mat3.multiply(this, this, b);`
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `this`
   */
  multiply(e) {
    return Xt.multiply(this, this, e);
  }
  /**
   * Alias for {@link Mat3.multiply}
   */
  mul(e) {
    return this;
  }
  /**
   * Transpose this {@link Mat3}
   * Equivalent to `Mat3.transpose(this, this);`
   *
   * @returns `this`
   */
  transpose() {
    return Xt.transpose(this, this);
  }
  /**
   * Inverts this {@link Mat3}
   * Equivalent to `Mat4.invert(this, this);`
   *
   * @returns `this`
   */
  invert() {
    return Xt.invert(this, this);
  }
  /**
   * Translate this {@link Mat3} by the given vector
   * Equivalent to `Mat3.translate(this, this, v);`
   *
   * @param v - The {@link Vec2} to translate by
   * @returns `this`
   */
  translate(e) {
    return Xt.translate(this, this, e);
  }
  /**
   * Rotates this {@link Mat3} by the given angle around the given axis
   * Equivalent to `Mat3.rotate(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  rotate(e) {
    return Xt.rotate(this, this, e);
  }
  /**
   * Scales this {@link Mat3} by the dimensions in the given vec3 not using vectorization
   * Equivalent to `Mat3.scale(this, this, v);`
   *
   * @param v - The {@link Vec2} to scale the matrix by
   * @returns `this`
   */
  scale(e) {
    return Xt.scale(this, this, e);
  }
  //================
  // Static methods
  //================
  /**
   * Creates a new, identity {@link Mat3}
   * @category Static
   *
   * @returns A new {@link Mat3}
   */
  static create() {
    return new Xt();
  }
  /**
   * Creates a new {@link Mat3} initialized with values from an existing matrix
   * @category Static
   *
   * @param a - Matrix to clone
   * @returns A new {@link Mat3}
   */
  static clone(e) {
    return new Xt(e);
  }
  /**
   * Copy the values from one {@link Mat3} to another
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - Matrix to copy
   * @returns `out`
   */
  static copy(e, n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], e;
  }
  /**
   * Create a new {@link Mat3} with the given values
   * @category Static
   *
   * @param values - Matrix components
   * @returns A new {@link Mat3}
   */
  static fromValues(...e) {
    return new Xt(...e);
  }
  /**
   * Set the components of a {@link Mat3} to the given values
   * @category Static
   *
   * @param out - The receiving matrix
   * @param values - Matrix components
   * @returns `out`
   */
  static set(e, ...n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], e;
  }
  /**
   * Set a {@link Mat3} to the identity matrix
   * @category Static
   *
   * @param out - The receiving matrix
   * @returns `out`
   */
  static identity(e) {
    return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
  }
  /**
   * Transpose the values of a {@link Mat3}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static transpose(e, n) {
    if (e === n) {
      const s = n[1], i = n[2], r = n[5];
      e[1] = n[3], e[2] = n[6], e[3] = s, e[5] = n[7], e[6] = i, e[7] = r;
    } else
      e[0] = n[0], e[1] = n[3], e[2] = n[6], e[3] = n[1], e[4] = n[4], e[5] = n[7], e[6] = n[2], e[7] = n[5], e[8] = n[8];
    return e;
  }
  /**
   * Inverts a {@link Mat3}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out` or `null` if the matrix is not invertable
   */
  static invert(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[3], a = n[4], l = n[5], h = n[6], u = n[7], f = n[8], d = f * a - l * u, y = -f * c + l * h, x = u * c - a * h;
    let g = s * d + i * y + r * x;
    return g ? (g = 1 / g, e[0] = d * g, e[1] = (-f * i + r * u) * g, e[2] = (l * i - r * a) * g, e[3] = y * g, e[4] = (f * s - r * h) * g, e[5] = (-l * s + r * c) * g, e[6] = x * g, e[7] = (-u * s + i * h) * g, e[8] = (a * s - i * c) * g, e) : null;
  }
  /**
   * Calculates the adjugate of a {@link Mat3}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static adjoint(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[3], a = n[4], l = n[5], h = n[6], u = n[7], f = n[8];
    return e[0] = a * f - l * u, e[1] = r * u - i * f, e[2] = i * l - r * a, e[3] = l * h - c * f, e[4] = s * f - r * h, e[5] = r * c - s * l, e[6] = c * u - a * h, e[7] = i * h - s * u, e[8] = s * a - i * c, e;
  }
  /**
   * Calculates the determinant of a {@link Mat3}
   * @category Static
   *
   * @param a - the source matrix
   * @returns determinant of a
   */
  static determinant(e) {
    const n = e[0], s = e[1], i = e[2], r = e[3], c = e[4], a = e[5], l = e[6], h = e[7], u = e[8];
    return n * (u * c - a * h) + s * (-u * r + a * l) + i * (h * r - c * l);
  }
  /**
   * Adds two {@link Mat3}'s
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static add(e, n, s) {
    return e[0] = n[0] + s[0], e[1] = n[1] + s[1], e[2] = n[2] + s[2], e[3] = n[3] + s[3], e[4] = n[4] + s[4], e[5] = n[5] + s[5], e[6] = n[6] + s[6], e[7] = n[7] + s[7], e[8] = n[8] + s[8], e;
  }
  /**
   * Subtracts matrix b from matrix a
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static subtract(e, n, s) {
    return e[0] = n[0] - s[0], e[1] = n[1] - s[1], e[2] = n[2] - s[2], e[3] = n[3] - s[3], e[4] = n[4] - s[4], e[5] = n[5] - s[5], e[6] = n[6] - s[6], e[7] = n[7] - s[7], e[8] = n[8] - s[8], e;
  }
  /**
   * Alias for {@link Mat3.subtract}
   * @category Static
   */
  static sub(e, n, s) {
    return e;
  }
  /**
   * Multiplies two {@link Mat3}s
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static multiply(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = n[4], h = n[5], u = n[6], f = n[7], d = n[8];
    let y = s[0], x = s[1], g = s[2];
    return e[0] = y * i + x * a + g * u, e[1] = y * r + x * l + g * f, e[2] = y * c + x * h + g * d, y = s[3], x = s[4], g = s[5], e[3] = y * i + x * a + g * u, e[4] = y * r + x * l + g * f, e[5] = y * c + x * h + g * d, y = s[6], x = s[7], g = s[8], e[6] = y * i + x * a + g * u, e[7] = y * r + x * l + g * f, e[8] = y * c + x * h + g * d, e;
  }
  /**
   * Alias for {@link Mat3.multiply}
   * @category Static
   */
  static mul(e, n, s) {
    return e;
  }
  /**
   * Translate a {@link Mat3} by the given vector
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to translate
   * @param v - vector to translate by
   * @returns `out`
   */
  static translate(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = n[4], h = n[5], u = n[6], f = n[7], d = n[8], y = s[0], x = s[1];
    return e[0] = i, e[1] = r, e[2] = c, e[3] = a, e[4] = l, e[5] = h, e[6] = y * i + x * a + u, e[7] = y * r + x * l + f, e[8] = y * c + x * h + d, e;
  }
  /**
   * Rotates a {@link Mat3} by the given angle
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotate(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = n[4], h = n[5], u = n[6], f = n[7], d = n[8], y = Math.sin(s), x = Math.cos(s);
    return e[0] = x * i + y * a, e[1] = x * r + y * l, e[2] = x * c + y * h, e[3] = x * a - y * i, e[4] = x * l - y * r, e[5] = x * h - y * c, e[6] = u, e[7] = f, e[8] = d, e;
  }
  /**
   * Scales the {@link Mat3} by the dimensions in the given {@link Vec2}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param v - the {@link Vec2} to scale the matrix by
   * @returns `out`
   **/
  static scale(e, n, s) {
    const i = s[0], r = s[1];
    return e[0] = i * n[0], e[1] = i * n[1], e[2] = i * n[2], e[3] = r * n[3], e[4] = r * n[4], e[5] = r * n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], e;
  }
  /**
   * Creates a {@link Mat3} from a vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.translate(dest, dest, vec);
   * @category Static
   *
   * @param out - {@link Mat3} receiving operation result
   * @param v - Translation vector
   * @returns `out`
   */
  static fromTranslation(e, n) {
    return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = n[0], e[7] = n[1], e[8] = 1, e;
  }
  /**
   * Creates a {@link Mat3} from a given angle around a given axis
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.rotate(dest, dest, rad);
   * @category Static
   *
   * @param out - {@link Mat3} receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromRotation(e, n) {
    const s = Math.sin(n), i = Math.cos(n);
    return e[0] = i, e[1] = s, e[2] = 0, e[3] = -s, e[4] = i, e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
  }
  /**
   * Creates a {@link Mat3} from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.scale(dest, dest, vec);
   * @category Static
   *
   * @param out - {@link Mat3} receiving operation result
   * @param v - Scaling vector
   * @returns `out`
   */
  static fromScaling(e, n) {
    return e[0] = n[0], e[1] = 0, e[2] = 0, e[3] = 0, e[4] = n[1], e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
  }
  /**
   * Copies the upper-left 3x3 values of a {@link Mat2d} into the given
   * {@link Mat3}.
   * @category Static
   *
   * @param out - the receiving 3x3 matrix
   * @param a - the source 2x3 matrix
   * @returns `out`
   */
  static fromMat2d(e, n) {
    return e[0] = n[0], e[1] = n[1], e[2] = 0, e[3] = n[2], e[4] = n[3], e[5] = 0, e[6] = n[4], e[7] = n[5], e[8] = 1, e;
  }
  /**
   * Calculates a {@link Mat3} from the given quaternion
   *
   * @param out - {@link Mat3} receiving operation result
   * @param q - {@link Quat} to create matrix from
   * @returns `out`
   */
  static fromQuat(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[3], a = s + s, l = i + i, h = r + r, u = s * a, f = i * a, d = i * l, y = r * a, x = r * l, g = r * h, w = c * a, M = c * l, P = c * h;
    return e[0] = 1 - d - g, e[3] = f - P, e[6] = y + M, e[1] = f + P, e[4] = 1 - u - g, e[7] = x - w, e[2] = y - M, e[5] = x + w, e[8] = 1 - u - d, e;
  }
  /**
   * Copies the upper-left 3x3 values of a {@link Mat4} into the given
   * {@link Mat3}.
   * @category Static
   *
   * @param out - the receiving 3x3 matrix
   * @param a - the source 4x4 matrix
   * @returns `out`
   */
  static fromMat4(e, n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[4], e[4] = n[5], e[5] = n[6], e[6] = n[8], e[7] = n[9], e[8] = n[10], e;
  }
  /**
   * Calculates a {@link Mat3} normal matrix (adjoint) from the upper 3x3 of a {@link Mat4}.
   * See https://www.shadertoy.com/view/3s33zj for details.
   * @category Static
   *
   * @param {mat3} out mat3 receiving operation result
   * @param {ReadonlyMat4} a Mat4 to derive the normal matrix from
   * @returns `out` or `null` if the matrix is not invertable
   */
  static normalFromMat4(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[4], a = n[5], l = n[6], h = n[8], u = n[9], f = n[10];
    return e[0] = a * f - l * u, e[1] = r * u - i * f, e[2] = i * l - r * a, e[3] = l * h - c * f, e[4] = s * f - r * h, e[5] = r * c - s * l, e[6] = c * u - a * h, e[7] = i * h - s * u, e[8] = s * a - i * c, e;
  }
  /**
   * Alias for {@link Mat3.adjointFromMat4}
   * @category Static
   * @deprecated Use {@link Mat3.normalFromMat4}
   */
  static normalFromMat4Fast(e, n) {
    return e;
  }
  /**
   * Generates a 2D projection matrix with the given bounds
   * @category Static
   *
   * @param out mat3 frustum matrix will be written into
   * @param width Width of your gl context
   * @param height Height of gl context
   * @returns `out`
   */
  static projection(e, n, s) {
    return e[0] = 2 / n, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = -2 / s, e[5] = 0, e[6] = -1, e[7] = 1, e[8] = 1, e;
  }
  /**
   * Returns Frobenius norm of a {@link Mat3}
   * @category Static
   *
   * @param a - the matrix to calculate Frobenius norm of
   * @returns Frobenius norm
   */
  static frob(e) {
    return Math.sqrt(
      e[0] * e[0] + e[1] * e[1] + e[2] * e[2] + e[3] * e[3] + e[4] * e[4] + e[5] * e[5] + e[6] * e[6] + e[7] * e[7] + e[8] * e[8]
    );
  }
  /**
   * Multiply each element of a {@link Mat3} by a scalar.
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param b - amount to scale the matrix's elements by
   * @returns `out`
   */
  static multiplyScalar(e, n, s) {
    return e[0] = n[0] * s, e[1] = n[1] * s, e[2] = n[2] * s, e[3] = n[3] * s, e[4] = n[4] * s, e[5] = n[5] * s, e[6] = n[6] * s, e[7] = n[7] * s, e[8] = n[8] * s, e;
  }
  /**
   * Adds two {@link Mat3}'s after multiplying each element of the second operand by a scalar value.
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param scale - the amount to scale b's elements by before adding
   * @returns `out`
   */
  static multiplyScalarAndAdd(e, n, s, i) {
    return e[0] = n[0] + s[0] * i, e[1] = n[1] + s[1] * i, e[2] = n[2] + s[2] * i, e[3] = n[3] + s[3] * i, e[4] = n[4] + s[4] * i, e[5] = n[5] + s[5] * i, e[6] = n[6] + s[6] * i, e[7] = n[7] + s[7] * i, e[8] = n[8] + s[8] * i, e;
  }
  /**
   * Returns whether or not two {@link Mat3}s have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static exactEquals(e, n) {
    return e[0] === n[0] && e[1] === n[1] && e[2] === n[2] && e[3] === n[3] && e[4] === n[4] && e[5] === n[5] && e[6] === n[6] && e[7] === n[7] && e[8] === n[8];
  }
  /**
   * Returns whether or not two {@link Mat3}s have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static equals(e, n) {
    const s = e[0], i = e[1], r = e[2], c = e[3], a = e[4], l = e[5], h = e[6], u = e[7], f = e[8], d = n[0], y = n[1], x = n[2], g = n[3], w = n[4], M = n[5], P = n[6], S = n[7], k = n[8];
    return Math.abs(s - d) <= dt * Math.max(1, Math.abs(s), Math.abs(d)) && Math.abs(i - y) <= dt * Math.max(1, Math.abs(i), Math.abs(y)) && Math.abs(r - x) <= dt * Math.max(1, Math.abs(r), Math.abs(x)) && Math.abs(c - g) <= dt * Math.max(1, Math.abs(c), Math.abs(g)) && Math.abs(a - w) <= dt * Math.max(1, Math.abs(a), Math.abs(w)) && Math.abs(l - M) <= dt * Math.max(1, Math.abs(l), Math.abs(M)) && Math.abs(h - P) <= dt * Math.max(1, Math.abs(h), Math.abs(P)) && Math.abs(u - S) <= dt * Math.max(1, Math.abs(u), Math.abs(S)) && Math.abs(f - k) <= dt * Math.max(1, Math.abs(f), Math.abs(k));
  }
  /**
   * Returns a string representation of a {@link Mat3}
   * @category Static
   *
   * @param a - matrix to represent as a string
   * @returns string representation of the matrix
   */
  static str(e) {
    return `Mat3(${e.join(", ")})`;
  }
}
Xt.prototype.mul = Xt.prototype.multiply;
Xt.mul = Xt.multiply;
Xt.sub = Xt.subtract;
Xt.normalFromMat4Fast = Xt.normalFromMat4;
const W0 = Xt, ir = new Float32Array([
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1
]);
class At extends Float32Array {
  /**
   * The number of bytes in a {@link Mat4}.
   */
  static BYTE_LENGTH = 16 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Mat4}.
   */
  constructor(...e) {
    switch (e.length) {
      case 16:
        super(e);
        break;
      case 2:
        super(e[0], e[1], 16);
        break;
      case 1:
        const n = e[0];
        n === void 0 ? super(ir) : typeof n == "number" ? super([
          n,
          n,
          n,
          n,
          n,
          n,
          n,
          n,
          n,
          n,
          n,
          n,
          n,
          n,
          n,
          n
        ]) : super(n, 0, 16);
        break;
      default:
        super(ir);
        break;
    }
  }
  //============
  // Attributes
  //============
  /**
   * A string representation of `this`
   * Equivalent to `Mat4.str(this);`
   */
  get str() {
    return At.str(this);
  }
  //===================
  // Instance methods
  //===================
  /**
   * Copy the values from another {@link Mat4} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(e) {
    return this.set(e), this;
  }
  /**
   * Set `this` to the identity matrix
   * Equivalent to Mat4.identity(this)
   *
   * @returns `this`
   */
  identity() {
    return this.set(ir), this;
  }
  /**
   * Multiplies this {@link Mat4} against another one
   * Equivalent to `Mat4.multiply(this, this, b);`
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `this`
   */
  multiply(e) {
    return At.multiply(this, this, e);
  }
  /**
   * Alias for {@link Mat4.multiply}
   */
  mul(e) {
    return this;
  }
  /**
   * Transpose this {@link Mat4}
   * Equivalent to `Mat4.transpose(this, this);`
   *
   * @returns `this`
   */
  transpose() {
    return At.transpose(this, this);
  }
  /**
   * Inverts this {@link Mat4}
   * Equivalent to `Mat4.invert(this, this);`
   *
   * @returns `this`
   */
  invert() {
    return At.invert(this, this);
  }
  /**
   * Translate this {@link Mat4} by the given vector
   * Equivalent to `Mat4.translate(this, this, v);`
   *
   * @param v - The {@link Vec3} to translate by
   * @returns `this`
   */
  translate(e) {
    return At.translate(this, this, e);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the given axis
   * Equivalent to `Mat4.rotate(this, this, rad, axis);`
   *
   * @param rad - the angle to rotate the matrix by
   * @param axis - the axis to rotate around
   * @returns `out`
   */
  rotate(e, n) {
    return At.rotate(this, this, e, n);
  }
  /**
   * Scales this {@link Mat4} by the dimensions in the given vec3 not using vectorization
   * Equivalent to `Mat4.scale(this, this, v);`
   *
   * @param v - The {@link Vec3} to scale the matrix by
   * @returns `this`
   */
  scale(e) {
    return At.scale(this, this, e);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the X axis
   * Equivalent to `Mat4.rotateX(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateX(e) {
    return At.rotateX(this, this, e);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the Y axis
   * Equivalent to `Mat4.rotateY(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateY(e) {
    return At.rotateY(this, this, e);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the Z axis
   * Equivalent to `Mat4.rotateZ(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateZ(e) {
    return At.rotateZ(this, this, e);
  }
  /**
   * Generates a perspective projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * Equivalent to `Mat4.perspectiveNO(this, fovy, aspect, near, far);`
   *
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `this`
   */
  perspectiveNO(e, n, s, i) {
    return At.perspectiveNO(this, e, n, s, i);
  }
  /**
   * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * Equivalent to `Mat4.perspectiveZO(this, fovy, aspect, near, far);`
   *
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `this`
   */
  perspectiveZO(e, n, s, i) {
    return At.perspectiveZO(this, e, n, s, i);
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Equivalent to `Mat4.orthoNO(this, left, right, bottom, top, near, far);`
   *
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `this`
   */
  orthoNO(e, n, s, i, r, c) {
    return At.orthoNO(this, e, n, s, i, r, c);
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Equivalent to `Mat4.orthoZO(this, left, right, bottom, top, near, far);`
   *
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `this`
   */
  orthoZO(e, n, s, i, r, c) {
    return At.orthoZO(this, e, n, s, i, r, c);
  }
  //================
  // Static methods
  //================
  /**
   * Creates a new, identity {@link Mat4}
   * @category Static
   *
   * @returns A new {@link Mat4}
   */
  static create() {
    return new At();
  }
  /**
   * Creates a new {@link Mat4} initialized with values from an existing matrix
   * @category Static
   *
   * @param a - Matrix to clone
   * @returns A new {@link Mat4}
   */
  static clone(e) {
    return new At(e);
  }
  /**
   * Copy the values from one {@link Mat4} to another
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - Matrix to copy
   * @returns `out`
   */
  static copy(e, n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], e[9] = n[9], e[10] = n[10], e[11] = n[11], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15], e;
  }
  /**
   * Create a new mat4 with the given values
   * @category Static
   *
   * @param values - Matrix components
   * @returns A new {@link Mat4}
   */
  static fromValues(...e) {
    return new At(...e);
  }
  /**
   * Set the components of a mat4 to the given values
   * @category Static
   *
   * @param out - The receiving matrix
   * @param values - Matrix components
   * @returns `out`
   */
  static set(e, ...n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], e[9] = n[9], e[10] = n[10], e[11] = n[11], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15], e;
  }
  /**
   * Set a {@link Mat4} to the identity matrix
   * @category Static
   *
   * @param out - The receiving Matrix
   * @returns `out`
   */
  static identity(e) {
    return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
  }
  /**
   * Transpose the values of a {@link Mat4}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static transpose(e, n) {
    if (e === n) {
      const s = n[1], i = n[2], r = n[3], c = n[6], a = n[7], l = n[11];
      e[1] = n[4], e[2] = n[8], e[3] = n[12], e[4] = s, e[6] = n[9], e[7] = n[13], e[8] = i, e[9] = c, e[11] = n[14], e[12] = r, e[13] = a, e[14] = l;
    } else
      e[0] = n[0], e[1] = n[4], e[2] = n[8], e[3] = n[12], e[4] = n[1], e[5] = n[5], e[6] = n[9], e[7] = n[13], e[8] = n[2], e[9] = n[6], e[10] = n[10], e[11] = n[14], e[12] = n[3], e[13] = n[7], e[14] = n[11], e[15] = n[15];
    return e;
  }
  /**
   * Inverts a {@link Mat4}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out` or `null` if the matrix is not invertable
   */
  static invert(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[3], a = n[4], l = n[5], h = n[6], u = n[7], f = n[8], d = n[9], y = n[10], x = n[11], g = n[12], w = n[13], M = n[14], P = n[15], S = s * l - i * a, k = s * h - r * a, O = s * u - c * a, R = i * h - r * l, F = i * u - c * l, Y = r * u - c * h, N = f * w - d * g, $ = f * M - y * g, W = f * P - x * g, Q = d * M - y * w, ct = d * P - x * w, K = y * P - x * M;
    let j = S * K - k * ct + O * Q + R * W - F * $ + Y * N;
    return j ? (j = 1 / j, e[0] = (l * K - h * ct + u * Q) * j, e[1] = (r * ct - i * K - c * Q) * j, e[2] = (w * Y - M * F + P * R) * j, e[3] = (y * F - d * Y - x * R) * j, e[4] = (h * W - a * K - u * $) * j, e[5] = (s * K - r * W + c * $) * j, e[6] = (M * O - g * Y - P * k) * j, e[7] = (f * Y - y * O + x * k) * j, e[8] = (a * ct - l * W + u * N) * j, e[9] = (i * W - s * ct - c * N) * j, e[10] = (g * F - w * O + P * S) * j, e[11] = (d * O - f * F - x * S) * j, e[12] = (l * $ - a * Q - h * N) * j, e[13] = (s * Q - i * $ + r * N) * j, e[14] = (w * k - g * R - M * S) * j, e[15] = (f * R - d * k + y * S) * j, e) : null;
  }
  /**
   * Calculates the adjugate of a {@link Mat4}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static adjoint(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[3], a = n[4], l = n[5], h = n[6], u = n[7], f = n[8], d = n[9], y = n[10], x = n[11], g = n[12], w = n[13], M = n[14], P = n[15], S = s * l - i * a, k = s * h - r * a, O = s * u - c * a, R = i * h - r * l, F = i * u - c * l, Y = r * u - c * h, N = f * w - d * g, $ = f * M - y * g, W = f * P - x * g, Q = d * M - y * w, ct = d * P - x * w, K = y * P - x * M;
    return e[0] = l * K - h * ct + u * Q, e[1] = r * ct - i * K - c * Q, e[2] = w * Y - M * F + P * R, e[3] = y * F - d * Y - x * R, e[4] = h * W - a * K - u * $, e[5] = s * K - r * W + c * $, e[6] = M * O - g * Y - P * k, e[7] = f * Y - y * O + x * k, e[8] = a * ct - l * W + u * N, e[9] = i * W - s * ct - c * N, e[10] = g * F - w * O + P * S, e[11] = d * O - f * F - x * S, e[12] = l * $ - a * Q - h * N, e[13] = s * Q - i * $ + r * N, e[14] = w * k - g * R - M * S, e[15] = f * R - d * k + y * S, e;
  }
  /**
   * Calculates the determinant of a {@link Mat4}
   * @category Static
   *
   * @param a - the source matrix
   * @returns determinant of a
   */
  static determinant(e) {
    const n = e[0], s = e[1], i = e[2], r = e[3], c = e[4], a = e[5], l = e[6], h = e[7], u = e[8], f = e[9], d = e[10], y = e[11], x = e[12], g = e[13], w = e[14], M = e[15], P = n * a - s * c, S = n * l - i * c, k = s * l - i * a, O = u * g - f * x, R = u * w - d * x, F = f * w - d * g, Y = n * F - s * R + i * O, N = c * F - a * R + l * O, $ = u * k - f * S + d * P, W = x * k - g * S + w * P;
    return h * Y - r * N + M * $ - y * W;
  }
  /**
   * Multiplies two {@link Mat4}s
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static multiply(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = n[4], h = n[5], u = n[6], f = n[7], d = n[8], y = n[9], x = n[10], g = n[11], w = n[12], M = n[13], P = n[14], S = n[15];
    let k = s[0], O = s[1], R = s[2], F = s[3];
    return e[0] = k * i + O * l + R * d + F * w, e[1] = k * r + O * h + R * y + F * M, e[2] = k * c + O * u + R * x + F * P, e[3] = k * a + O * f + R * g + F * S, k = s[4], O = s[5], R = s[6], F = s[7], e[4] = k * i + O * l + R * d + F * w, e[5] = k * r + O * h + R * y + F * M, e[6] = k * c + O * u + R * x + F * P, e[7] = k * a + O * f + R * g + F * S, k = s[8], O = s[9], R = s[10], F = s[11], e[8] = k * i + O * l + R * d + F * w, e[9] = k * r + O * h + R * y + F * M, e[10] = k * c + O * u + R * x + F * P, e[11] = k * a + O * f + R * g + F * S, k = s[12], O = s[13], R = s[14], F = s[15], e[12] = k * i + O * l + R * d + F * w, e[13] = k * r + O * h + R * y + F * M, e[14] = k * c + O * u + R * x + F * P, e[15] = k * a + O * f + R * g + F * S, e;
  }
  /**
   * Alias for {@link Mat4.multiply}
   * @category Static
   */
  static mul(e, n, s) {
    return e;
  }
  /**
   * Translate a {@link Mat4} by the given vector
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to translate
   * @param v - vector to translate by
   * @returns `out`
   */
  static translate(e, n, s) {
    const i = s[0], r = s[1], c = s[2];
    if (n === e)
      e[12] = n[0] * i + n[4] * r + n[8] * c + n[12], e[13] = n[1] * i + n[5] * r + n[9] * c + n[13], e[14] = n[2] * i + n[6] * r + n[10] * c + n[14], e[15] = n[3] * i + n[7] * r + n[11] * c + n[15];
    else {
      const a = n[0], l = n[1], h = n[2], u = n[3], f = n[4], d = n[5], y = n[6], x = n[7], g = n[8], w = n[9], M = n[10], P = n[11];
      e[0] = a, e[1] = l, e[2] = h, e[3] = u, e[4] = f, e[5] = d, e[6] = y, e[7] = x, e[8] = g, e[9] = w, e[10] = M, e[11] = P, e[12] = a * i + f * r + g * c + n[12], e[13] = l * i + d * r + w * c + n[13], e[14] = h * i + y * r + M * c + n[14], e[15] = u * i + x * r + P * c + n[15];
    }
    return e;
  }
  /**
   * Scales the {@link Mat4} by the dimensions in the given {@link Vec3} not using vectorization
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param v - the {@link Vec3} to scale the matrix by
   * @returns `out`
   **/
  static scale(e, n, s) {
    const i = s[0], r = s[1], c = s[2];
    return e[0] = n[0] * i, e[1] = n[1] * i, e[2] = n[2] * i, e[3] = n[3] * i, e[4] = n[4] * r, e[5] = n[5] * r, e[6] = n[6] * r, e[7] = n[7] * r, e[8] = n[8] * c, e[9] = n[9] * c, e[10] = n[10] * c, e[11] = n[11] * c, e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15], e;
  }
  /**
   * Rotates a {@link Mat4} by the given angle around the given axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @param axis - the axis to rotate around
   * @returns `out` or `null` if axis has a length of 0
   */
  static rotate(e, n, s, i) {
    let r = i[0], c = i[1], a = i[2], l = Math.sqrt(r * r + c * c + a * a);
    if (l < dt)
      return null;
    l = 1 / l, r *= l, c *= l, a *= l;
    const h = Math.sin(s), u = Math.cos(s), f = 1 - u, d = n[0], y = n[1], x = n[2], g = n[3], w = n[4], M = n[5], P = n[6], S = n[7], k = n[8], O = n[9], R = n[10], F = n[11], Y = r * r * f + u, N = c * r * f + a * h, $ = a * r * f - c * h, W = r * c * f - a * h, Q = c * c * f + u, ct = a * c * f + r * h, K = r * a * f + c * h, j = c * a * f - r * h, V = a * a * f + u;
    return e[0] = d * Y + w * N + k * $, e[1] = y * Y + M * N + O * $, e[2] = x * Y + P * N + R * $, e[3] = g * Y + S * N + F * $, e[4] = d * W + w * Q + k * ct, e[5] = y * W + M * Q + O * ct, e[6] = x * W + P * Q + R * ct, e[7] = g * W + S * Q + F * ct, e[8] = d * K + w * j + k * V, e[9] = y * K + M * j + O * V, e[10] = x * K + P * j + R * V, e[11] = g * K + S * j + F * V, n !== e && (e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15]), e;
  }
  /**
   * Rotates a matrix by the given angle around the X axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotateX(e, n, s) {
    let i = Math.sin(s), r = Math.cos(s), c = n[4], a = n[5], l = n[6], h = n[7], u = n[8], f = n[9], d = n[10], y = n[11];
    return n !== e && (e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15]), e[4] = c * r + u * i, e[5] = a * r + f * i, e[6] = l * r + d * i, e[7] = h * r + y * i, e[8] = u * r - c * i, e[9] = f * r - a * i, e[10] = d * r - l * i, e[11] = y * r - h * i, e;
  }
  /**
   * Rotates a matrix by the given angle around the Y axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotateY(e, n, s) {
    let i = Math.sin(s), r = Math.cos(s), c = n[0], a = n[1], l = n[2], h = n[3], u = n[8], f = n[9], d = n[10], y = n[11];
    return n !== e && (e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15]), e[0] = c * r - u * i, e[1] = a * r - f * i, e[2] = l * r - d * i, e[3] = h * r - y * i, e[8] = c * i + u * r, e[9] = a * i + f * r, e[10] = l * i + d * r, e[11] = h * i + y * r, e;
  }
  /**
   * Rotates a matrix by the given angle around the Z axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotateZ(e, n, s) {
    let i = Math.sin(s), r = Math.cos(s), c = n[0], a = n[1], l = n[2], h = n[3], u = n[4], f = n[5], d = n[6], y = n[7];
    return n !== e && (e[8] = n[8], e[9] = n[9], e[10] = n[10], e[11] = n[11], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15]), e[0] = c * r + u * i, e[1] = a * r + f * i, e[2] = l * r + d * i, e[3] = h * r + y * i, e[4] = u * r - c * i, e[5] = f * r - a * i, e[6] = d * r - l * i, e[7] = y * r - h * i, e;
  }
  /**
   * Creates a {@link Mat4} from a vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, dest, vec);
   * @category Static
   *
   * @param out - {@link Mat4} receiving operation result
   * @param v - Translation vector
   * @returns `out`
   */
  static fromTranslation(e, n) {
    return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = n[0], e[13] = n[1], e[14] = n[2], e[15] = 1, e;
  }
  /**
   * Creates a {@link Mat4} from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.scale(dest, dest, vec);
   * @category Static
   *
   * @param out - {@link Mat4} receiving operation result
   * @param v - Scaling vector
   * @returns `out`
   */
  static fromScaling(e, n) {
    return e[0] = n[0], e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = n[1], e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = n[2], e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
  }
  /**
   * Creates a {@link Mat4} from a given angle around a given axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotate(dest, dest, rad, axis);
   * @category Static
   *
   * @param out - {@link Mat4} receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @param axis - the axis to rotate around
   * @returns `out` or `null` if `axis` has a length of 0
   */
  static fromRotation(e, n, s) {
    let i = s[0], r = s[1], c = s[2], a = Math.sqrt(i * i + r * r + c * c);
    if (a < dt)
      return null;
    a = 1 / a, i *= a, r *= a, c *= a;
    const l = Math.sin(n), h = Math.cos(n), u = 1 - h;
    return e[0] = i * i * u + h, e[1] = r * i * u + c * l, e[2] = c * i * u - r * l, e[3] = 0, e[4] = i * r * u - c * l, e[5] = r * r * u + h, e[6] = c * r * u + i * l, e[7] = 0, e[8] = i * c * u + r * l, e[9] = r * c * u - i * l, e[10] = c * c * u + h, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
  }
  /**
   * Creates a matrix from the given angle around the X axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateX(dest, dest, rad);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromXRotation(e, n) {
    let s = Math.sin(n), i = Math.cos(n);
    return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = i, e[6] = s, e[7] = 0, e[8] = 0, e[9] = -s, e[10] = i, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
  }
  /**
   * Creates a matrix from the given angle around the Y axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateY(dest, dest, rad);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromYRotation(e, n) {
    let s = Math.sin(n), i = Math.cos(n);
    return e[0] = i, e[1] = 0, e[2] = -s, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = s, e[9] = 0, e[10] = i, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
  }
  /**
   * Creates a matrix from the given angle around the Z axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateZ(dest, dest, rad);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromZRotation(e, n) {
    const s = Math.sin(n), i = Math.cos(n);
    return e[0] = i, e[1] = s, e[2] = 0, e[3] = 0, e[4] = -s, e[5] = i, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
  }
  /**
   * Creates a matrix from a quaternion rotation and vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Rotation quaternion
   * @param v - Translation vector
   * @returns `out`
   */
  static fromRotationTranslation(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = i + i, h = r + r, u = c + c, f = i * l, d = i * h, y = i * u, x = r * h, g = r * u, w = c * u, M = a * l, P = a * h, S = a * u;
    return e[0] = 1 - (x + w), e[1] = d + S, e[2] = y - P, e[3] = 0, e[4] = d - S, e[5] = 1 - (f + w), e[6] = g + M, e[7] = 0, e[8] = y + P, e[9] = g - M, e[10] = 1 - (f + x), e[11] = 0, e[12] = s[0], e[13] = s[1], e[14] = s[2], e[15] = 1, e;
  }
  /**
   * Sets a {@link Mat4} from a {@link Quat2}.
   * @category Static
   *
   * @param out - Matrix
   * @param a - Dual Quaternion
   * @returns `out`
   */
  static fromQuat2(e, n) {
    const s = -n[0], i = -n[1], r = -n[2], c = n[3], a = n[4], l = n[5], h = n[6], u = n[7];
    let f = s * s + i * i + r * r + c * c;
    return f > 0 ? (qe[0] = (a * c + u * s + l * r - h * i) * 2 / f, qe[1] = (l * c + u * i + h * s - a * r) * 2 / f, qe[2] = (h * c + u * r + a * i - l * s) * 2 / f) : (qe[0] = (a * c + u * s + l * r - h * i) * 2, qe[1] = (l * c + u * i + h * s - a * r) * 2, qe[2] = (h * c + u * r + a * i - l * s) * 2), At.fromRotationTranslation(e, n, qe), e;
  }
  /**
   * Calculates a {@link Mat4} normal matrix (adjoint) from a {@link Mat4}
   * See https://www.shadertoy.com/view/3s33zj for details.
   * @category Static
   *
   * @param out - Matrix receiving operation result
   * @param a - Mat4 to derive the normal matrix from
   * @returns `out`
   */
  static normalFromMat4(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[4], a = n[5], l = n[6], h = n[8], u = n[9], f = n[10];
    return e[0] = a * f - l * u, e[1] = r * u - i * f, e[2] = i * l - r * a, e[3] = 0, e[4] = l * h - c * f, e[5] = s * f - r * h, e[6] = r * c - s * l, e[7] = 0, e[8] = c * u - a * h, e[9] = i * h - s * u, e[10] = s * a - i * c, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
  }
  /**
   * Alias for {@link Mat4.adjointFromMat4}
   * @category Static
   * @deprecated Use {@link Mat4.normalFromMat4}
   */
  static normalFromMat4Fast(e, n) {
    return e;
  }
  /**
   * Returns the translation vector component of a transformation
   * matrix. If a matrix is built with fromRotationTranslation,
   * the returned vector will be the same as the translation vector
   * originally supplied.
   * @category Static
   *
   * @param  {vec3} out Vector to receive translation component
   * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
   * @return {vec3} out
   */
  static getTranslation(e, n) {
    return e[0] = n[12], e[1] = n[13], e[2] = n[14], e;
  }
  /**
   * Returns the scaling factor component of a transformation
   * matrix. If a matrix is built with fromRotationTranslationScale
   * with a normalized Quaternion parameter, the returned vector will be
   * the same as the scaling vector
   * originally supplied.
   * @category Static
   *
   * @param  {vec3} out Vector to receive scaling factor component
   * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
   * @return {vec3} out
   */
  static getScaling(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[4], a = n[5], l = n[6], h = n[8], u = n[9], f = n[10];
    return e[0] = Math.sqrt(s * s + i * i + r * r), e[1] = Math.sqrt(c * c + a * a + l * l), e[2] = Math.sqrt(h * h + u * u + f * f), e;
  }
  /**
   * Returns a quaternion representing the rotational component
   * of a transformation matrix. If a matrix is built with
   * fromRotationTranslation, the returned quaternion will be the
   * same as the quaternion originally supplied.
   * @category Static
   *
   * @param out - Quaternion to receive the rotation component
   * @param mat - Matrix to be decomposed (input)
   * @return `out`
   */
  static getRotation(e, n) {
    At.getScaling(qe, n);
    const s = 1 / qe[0], i = 1 / qe[1], r = 1 / qe[2], c = n[0] * s, a = n[1] * i, l = n[2] * r, h = n[4] * s, u = n[5] * i, f = n[6] * r, d = n[8] * s, y = n[9] * i, x = n[10] * r, g = c + u + x;
    let w = 0;
    return g > 0 ? (w = Math.sqrt(g + 1) * 2, e[3] = 0.25 * w, e[0] = (f - y) / w, e[1] = (d - l) / w, e[2] = (a - h) / w) : c > u && c > x ? (w = Math.sqrt(1 + c - u - x) * 2, e[3] = (f - y) / w, e[0] = 0.25 * w, e[1] = (a + h) / w, e[2] = (d + l) / w) : u > x ? (w = Math.sqrt(1 + u - c - x) * 2, e[3] = (d - l) / w, e[0] = (a + h) / w, e[1] = 0.25 * w, e[2] = (f + y) / w) : (w = Math.sqrt(1 + x - c - u) * 2, e[3] = (a - h) / w, e[0] = (d + l) / w, e[1] = (f + y) / w, e[2] = 0.25 * w), e;
  }
  /**
   * Decomposes a transformation matrix into its rotation, translation
   * and scale components. Returns only the rotation component
   * @category Static
   *
   * @param out_r - Quaternion to receive the rotation component
   * @param out_t - Vector to receive the translation vector
   * @param out_s - Vector to receive the scaling factor
   * @param mat - Matrix to be decomposed (input)
   * @returns `out_r`
   */
  static decompose(e, n, s, i) {
    n[0] = i[12], n[1] = i[13], n[2] = i[14];
    const r = i[0], c = i[1], a = i[2], l = i[4], h = i[5], u = i[6], f = i[8], d = i[9], y = i[10];
    s[0] = Math.sqrt(r * r + c * c + a * a), s[1] = Math.sqrt(l * l + h * h + u * u), s[2] = Math.sqrt(f * f + d * d + y * y);
    const x = 1 / s[0], g = 1 / s[1], w = 1 / s[2], M = r * x, P = c * g, S = a * w, k = l * x, O = h * g, R = u * w, F = f * x, Y = d * g, N = y * w, $ = M + O + N;
    let W = 0;
    return $ > 0 ? (W = Math.sqrt($ + 1) * 2, e[3] = 0.25 * W, e[0] = (R - Y) / W, e[1] = (F - S) / W, e[2] = (P - k) / W) : M > O && M > N ? (W = Math.sqrt(1 + M - O - N) * 2, e[3] = (R - Y) / W, e[0] = 0.25 * W, e[1] = (P + k) / W, e[2] = (F + S) / W) : O > N ? (W = Math.sqrt(1 + O - M - N) * 2, e[3] = (F - S) / W, e[0] = (P + k) / W, e[1] = 0.25 * W, e[2] = (R + Y) / W) : (W = Math.sqrt(1 + N - M - O) * 2, e[3] = (P - k) / W, e[0] = (F + S) / W, e[1] = (R + Y) / W, e[2] = 0.25 * W), e;
  }
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *     mat4.scale(dest, scale);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Rotation quaternion
   * @param v - Translation vector
   * @param s - Scaling vector
   * @returns `out`
   */
  static fromRotationTranslationScale(e, n, s, i) {
    const r = n[0], c = n[1], a = n[2], l = n[3], h = r + r, u = c + c, f = a + a, d = r * h, y = r * u, x = r * f, g = c * u, w = c * f, M = a * f, P = l * h, S = l * u, k = l * f, O = i[0], R = i[1], F = i[2];
    return e[0] = (1 - (g + M)) * O, e[1] = (y + k) * O, e[2] = (x - S) * O, e[3] = 0, e[4] = (y - k) * R, e[5] = (1 - (d + M)) * R, e[6] = (w + P) * R, e[7] = 0, e[8] = (x + S) * F, e[9] = (w - P) * F, e[10] = (1 - (d + g)) * F, e[11] = 0, e[12] = s[0], e[13] = s[1], e[14] = s[2], e[15] = 1, e;
  }
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     mat4.translate(dest, origin);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *     mat4.scale(dest, scale)
   *     mat4.translate(dest, negativeOrigin);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Rotation quaternion
   * @param v - Translation vector
   * @param s - Scaling vector
   * @param o - The origin vector around which to scale and rotate
   * @returns `out`
   */
  static fromRotationTranslationScaleOrigin(e, n, s, i, r) {
    const c = n[0], a = n[1], l = n[2], h = n[3], u = c + c, f = a + a, d = l + l, y = c * u, x = c * f, g = c * d, w = a * f, M = a * d, P = l * d, S = h * u, k = h * f, O = h * d, R = i[0], F = i[1], Y = i[2], N = r[0], $ = r[1], W = r[2], Q = (1 - (w + P)) * R, ct = (x + O) * R, K = (g - k) * R, j = (x - O) * F, V = (1 - (y + P)) * F, at = (M + S) * F, pt = (g + k) * Y, Et = (M - S) * Y, vt = (1 - (y + w)) * Y;
    return e[0] = Q, e[1] = ct, e[2] = K, e[3] = 0, e[4] = j, e[5] = V, e[6] = at, e[7] = 0, e[8] = pt, e[9] = Et, e[10] = vt, e[11] = 0, e[12] = s[0] + N - (Q * N + j * $ + pt * W), e[13] = s[1] + $ - (ct * N + V * $ + Et * W), e[14] = s[2] + W - (K * N + at * $ + vt * W), e[15] = 1, e;
  }
  /**
   * Calculates a 4x4 matrix from the given quaternion
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Quaternion to create matrix from
   * @returns `out`
   */
  static fromQuat(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[3], a = s + s, l = i + i, h = r + r, u = s * a, f = i * a, d = i * l, y = r * a, x = r * l, g = r * h, w = c * a, M = c * l, P = c * h;
    return e[0] = 1 - d - g, e[1] = f + P, e[2] = y - M, e[3] = 0, e[4] = f - P, e[5] = 1 - u - g, e[6] = x + w, e[7] = 0, e[8] = y + M, e[9] = x - w, e[10] = 1 - u - d, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
  }
  /**
   * Generates a frustum matrix with the given bounds
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far -  Far bound of the frustum, can be null or Infinity
   * @returns `out`
   */
  static frustumNO(e, n, s, i, r, c, a = 1 / 0) {
    const l = 1 / (s - n), h = 1 / (r - i);
    if (e[0] = c * 2 * l, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = c * 2 * h, e[6] = 0, e[7] = 0, e[8] = (s + n) * l, e[9] = (r + i) * h, e[11] = -1, e[12] = 0, e[13] = 0, e[15] = 0, a != null && a !== 1 / 0) {
      const u = 1 / (c - a);
      e[10] = (a + c) * u, e[14] = 2 * a * c * u;
    } else
      e[10] = -1, e[14] = -2 * c;
    return e;
  }
  /**
   * Alias for {@link Mat4.frustumNO}
   * @category Static
   * @deprecated Use {@link Mat4.frustumNO} or {@link Mat4.frustumZO} explicitly
   */
  static frustum(e, n, s, i, r, c, a = 1 / 0) {
    return e;
  }
  /**
   * Generates a frustum matrix with the given bounds
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `out`
   */
  static frustumZO(e, n, s, i, r, c, a = 1 / 0) {
    const l = 1 / (s - n), h = 1 / (r - i);
    if (e[0] = c * 2 * l, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = c * 2 * h, e[6] = 0, e[7] = 0, e[8] = (s + n) * l, e[9] = (r + i) * h, e[11] = -1, e[12] = 0, e[13] = 0, e[15] = 0, a != null && a !== 1 / 0) {
      const u = 1 / (c - a);
      e[10] = a * u, e[14] = a * c * u;
    } else
      e[10] = -1, e[14] = -c;
    return e;
  }
  /**
   * Generates a perspective projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `out`
   */
  static perspectiveNO(e, n, s, i, r = 1 / 0) {
    const c = 1 / Math.tan(n / 2);
    if (e[0] = c / s, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = c, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[11] = -1, e[12] = 0, e[13] = 0, e[15] = 0, r != null && r !== 1 / 0) {
      const a = 1 / (i - r);
      e[10] = (r + i) * a, e[14] = 2 * r * i * a;
    } else
      e[10] = -1, e[14] = -2 * i;
    return e;
  }
  /**
   * Alias for {@link Mat4.perspectiveNO}
   * @category Static
   * @deprecated Use {@link Mat4.perspectiveNO} or {@link Mat4.perspectiveZO} explicitly
   */
  static perspective(e, n, s, i, r = 1 / 0) {
    return e;
  }
  /**
   * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `out`
   */
  static perspectiveZO(e, n, s, i, r = 1 / 0) {
    const c = 1 / Math.tan(n / 2);
    if (e[0] = c / s, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = c, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[11] = -1, e[12] = 0, e[13] = 0, e[15] = 0, r != null && r !== 1 / 0) {
      const a = 1 / (i - r);
      e[10] = r * a, e[14] = r * i * a;
    } else
      e[10] = -1, e[14] = -i;
    return e;
  }
  /**
   * Generates a perspective projection matrix with the given field of view.
   * This is primarily useful for generating projection matrices to be used
   * with the still experiemental WebVR API.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param fov - Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `out`
   * @deprecated
   */
  static perspectiveFromFieldOfView(e, n, s, i) {
    const r = Math.tan(n.upDegrees * Math.PI / 180), c = Math.tan(n.downDegrees * Math.PI / 180), a = Math.tan(n.leftDegrees * Math.PI / 180), l = Math.tan(n.rightDegrees * Math.PI / 180), h = 2 / (a + l), u = 2 / (r + c);
    return e[0] = h, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = u, e[6] = 0, e[7] = 0, e[8] = -((a - l) * h * 0.5), e[9] = (r - c) * u * 0.5, e[10] = i / (s - i), e[11] = -1, e[12] = 0, e[13] = 0, e[14] = i * s / (s - i), e[15] = 0, e;
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `out`
   */
  static orthoNO(e, n, s, i, r, c, a) {
    const l = 1 / (n - s), h = 1 / (i - r), u = 1 / (c - a);
    return e[0] = -2 * l, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = -2 * h, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 2 * u, e[11] = 0, e[12] = (n + s) * l, e[13] = (r + i) * h, e[14] = (a + c) * u, e[15] = 1, e;
  }
  /**
   * Alias for {@link Mat4.orthoNO}
   * @category Static
   * @deprecated Use {@link Mat4.orthoNO} or {@link Mat4.orthoZO} explicitly
   */
  static ortho(e, n, s, i, r, c, a) {
    return e;
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `out`
   */
  static orthoZO(e, n, s, i, r, c, a) {
    const l = 1 / (n - s), h = 1 / (i - r), u = 1 / (c - a);
    return e[0] = -2 * l, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = -2 * h, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = u, e[11] = 0, e[12] = (n + s) * l, e[13] = (r + i) * h, e[14] = c * u, e[15] = 1, e;
  }
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis.
   * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param eye - Position of the viewer
   * @param center - Point the viewer is looking at
   * @param up - vec3 pointing up
   * @returns `out`
   */
  static lookAt(e, n, s, i) {
    const r = n[0], c = n[1], a = n[2], l = i[0], h = i[1], u = i[2], f = s[0], d = s[1], y = s[2];
    if (Math.abs(r - f) < dt && Math.abs(c - d) < dt && Math.abs(a - y) < dt)
      return At.identity(e);
    let x = r - f, g = c - d, w = a - y, M = 1 / Math.sqrt(x * x + g * g + w * w);
    x *= M, g *= M, w *= M;
    let P = h * w - u * g, S = u * x - l * w, k = l * g - h * x;
    M = Math.sqrt(P * P + S * S + k * k), M ? (M = 1 / M, P *= M, S *= M, k *= M) : (P = 0, S = 0, k = 0);
    let O = g * k - w * S, R = w * P - x * k, F = x * S - g * P;
    return M = Math.sqrt(O * O + R * R + F * F), M ? (M = 1 / M, O *= M, R *= M, F *= M) : (O = 0, R = 0, F = 0), e[0] = P, e[1] = O, e[2] = x, e[3] = 0, e[4] = S, e[5] = R, e[6] = g, e[7] = 0, e[8] = k, e[9] = F, e[10] = w, e[11] = 0, e[12] = -(P * r + S * c + k * a), e[13] = -(O * r + R * c + F * a), e[14] = -(x * r + g * c + w * a), e[15] = 1, e;
  }
  /**
   * Generates a matrix that makes something look at something else.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param eye - Position of the viewer
   * @param target - Point the viewer is looking at
   * @param up - vec3 pointing up
   * @returns `out`
   */
  static targetTo(e, n, s, i) {
    const r = n[0], c = n[1], a = n[2], l = i[0], h = i[1], u = i[2];
    let f = r - s[0], d = c - s[1], y = a - s[2], x = f * f + d * d + y * y;
    x > 0 && (x = 1 / Math.sqrt(x), f *= x, d *= x, y *= x);
    let g = h * y - u * d, w = u * f - l * y, M = l * d - h * f;
    return x = g * g + w * w + M * M, x > 0 && (x = 1 / Math.sqrt(x), g *= x, w *= x, M *= x), e[0] = g, e[1] = w, e[2] = M, e[3] = 0, e[4] = d * M - y * w, e[5] = y * g - f * M, e[6] = f * w - d * g, e[7] = 0, e[8] = f, e[9] = d, e[10] = y, e[11] = 0, e[12] = r, e[13] = c, e[14] = a, e[15] = 1, e;
  }
  /**
   * Returns Frobenius norm of a {@link Mat4}
   * @category Static
   *
   * @param a - the matrix to calculate Frobenius norm of
   * @returns Frobenius norm
   */
  static frob(e) {
    return Math.sqrt(
      e[0] * e[0] + e[1] * e[1] + e[2] * e[2] + e[3] * e[3] + e[4] * e[4] + e[5] * e[5] + e[6] * e[6] + e[7] * e[7] + e[8] * e[8] + e[9] * e[9] + e[10] * e[10] + e[11] * e[11] + e[12] * e[12] + e[13] * e[13] + e[14] * e[14] + e[15] * e[15]
    );
  }
  /**
   * Adds two {@link Mat4}'s
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static add(e, n, s) {
    return e[0] = n[0] + s[0], e[1] = n[1] + s[1], e[2] = n[2] + s[2], e[3] = n[3] + s[3], e[4] = n[4] + s[4], e[5] = n[5] + s[5], e[6] = n[6] + s[6], e[7] = n[7] + s[7], e[8] = n[8] + s[8], e[9] = n[9] + s[9], e[10] = n[10] + s[10], e[11] = n[11] + s[11], e[12] = n[12] + s[12], e[13] = n[13] + s[13], e[14] = n[14] + s[14], e[15] = n[15] + s[15], e;
  }
  /**
   * Subtracts matrix b from matrix a
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static subtract(e, n, s) {
    return e[0] = n[0] - s[0], e[1] = n[1] - s[1], e[2] = n[2] - s[2], e[3] = n[3] - s[3], e[4] = n[4] - s[4], e[5] = n[5] - s[5], e[6] = n[6] - s[6], e[7] = n[7] - s[7], e[8] = n[8] - s[8], e[9] = n[9] - s[9], e[10] = n[10] - s[10], e[11] = n[11] - s[11], e[12] = n[12] - s[12], e[13] = n[13] - s[13], e[14] = n[14] - s[14], e[15] = n[15] - s[15], e;
  }
  /**
   * Alias for {@link Mat4.subtract}
   * @category Static
   */
  static sub(e, n, s) {
    return e;
  }
  /**
   * Multiply each element of the matrix by a scalar.
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param b - amount to scale the matrix's elements by
   * @returns `out`
   */
  static multiplyScalar(e, n, s) {
    return e[0] = n[0] * s, e[1] = n[1] * s, e[2] = n[2] * s, e[3] = n[3] * s, e[4] = n[4] * s, e[5] = n[5] * s, e[6] = n[6] * s, e[7] = n[7] * s, e[8] = n[8] * s, e[9] = n[9] * s, e[10] = n[10] * s, e[11] = n[11] * s, e[12] = n[12] * s, e[13] = n[13] * s, e[14] = n[14] * s, e[15] = n[15] * s, e;
  }
  /**
   * Adds two mat4's after multiplying each element of the second operand by a scalar value.
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param scale - the amount to scale b's elements by before adding
   * @returns `out`
   */
  static multiplyScalarAndAdd(e, n, s, i) {
    return e[0] = n[0] + s[0] * i, e[1] = n[1] + s[1] * i, e[2] = n[2] + s[2] * i, e[3] = n[3] + s[3] * i, e[4] = n[4] + s[4] * i, e[5] = n[5] + s[5] * i, e[6] = n[6] + s[6] * i, e[7] = n[7] + s[7] * i, e[8] = n[8] + s[8] * i, e[9] = n[9] + s[9] * i, e[10] = n[10] + s[10] * i, e[11] = n[11] + s[11] * i, e[12] = n[12] + s[12] * i, e[13] = n[13] + s[13] * i, e[14] = n[14] + s[14] * i, e[15] = n[15] + s[15] * i, e;
  }
  /**
   * Returns whether or not two {@link Mat4}s have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static exactEquals(e, n) {
    return e[0] === n[0] && e[1] === n[1] && e[2] === n[2] && e[3] === n[3] && e[4] === n[4] && e[5] === n[5] && e[6] === n[6] && e[7] === n[7] && e[8] === n[8] && e[9] === n[9] && e[10] === n[10] && e[11] === n[11] && e[12] === n[12] && e[13] === n[13] && e[14] === n[14] && e[15] === n[15];
  }
  /**
   * Returns whether or not two {@link Mat4}s have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static equals(e, n) {
    const s = e[0], i = e[1], r = e[2], c = e[3], a = e[4], l = e[5], h = e[6], u = e[7], f = e[8], d = e[9], y = e[10], x = e[11], g = e[12], w = e[13], M = e[14], P = e[15], S = n[0], k = n[1], O = n[2], R = n[3], F = n[4], Y = n[5], N = n[6], $ = n[7], W = n[8], Q = n[9], ct = n[10], K = n[11], j = n[12], V = n[13], at = n[14], pt = n[15];
    return Math.abs(s - S) <= dt * Math.max(1, Math.abs(s), Math.abs(S)) && Math.abs(i - k) <= dt * Math.max(1, Math.abs(i), Math.abs(k)) && Math.abs(r - O) <= dt * Math.max(1, Math.abs(r), Math.abs(O)) && Math.abs(c - R) <= dt * Math.max(1, Math.abs(c), Math.abs(R)) && Math.abs(a - F) <= dt * Math.max(1, Math.abs(a), Math.abs(F)) && Math.abs(l - Y) <= dt * Math.max(1, Math.abs(l), Math.abs(Y)) && Math.abs(h - N) <= dt * Math.max(1, Math.abs(h), Math.abs(N)) && Math.abs(u - $) <= dt * Math.max(1, Math.abs(u), Math.abs($)) && Math.abs(f - W) <= dt * Math.max(1, Math.abs(f), Math.abs(W)) && Math.abs(d - Q) <= dt * Math.max(1, Math.abs(d), Math.abs(Q)) && Math.abs(y - ct) <= dt * Math.max(1, Math.abs(y), Math.abs(ct)) && Math.abs(x - K) <= dt * Math.max(1, Math.abs(x), Math.abs(K)) && Math.abs(g - j) <= dt * Math.max(1, Math.abs(g), Math.abs(j)) && Math.abs(w - V) <= dt * Math.max(1, Math.abs(w), Math.abs(V)) && Math.abs(M - at) <= dt * Math.max(1, Math.abs(M), Math.abs(at)) && Math.abs(P - pt) <= dt * Math.max(1, Math.abs(P), Math.abs(pt));
  }
  /**
   * Returns a string representation of a {@link Mat4}
   * @category Static
   *
   * @param a - matrix to represent as a string
   * @returns string representation of the matrix
   */
  static str(e) {
    return `Mat4(${e.join(", ")})`;
  }
}
const qe = new Float32Array(3);
At.prototype.mul = At.prototype.multiply;
At.sub = At.subtract;
At.mul = At.multiply;
At.frustum = At.frustumNO;
At.perspective = At.perspectiveNO;
At.ortho = At.orthoNO;
At.normalFromMat4Fast = At.normalFromMat4;
const $0 = At;
class _t extends Float32Array {
  /**
  * The number of bytes in a {@link Vec3}.
  */
  static BYTE_LENGTH = 3 * Float32Array.BYTES_PER_ELEMENT;
  /**
  * Create a {@link Vec3}.
  */
  constructor(...e) {
    switch (e.length) {
      case 3:
        super(e);
        break;
      case 2:
        super(e[0], e[1], 3);
        break;
      case 1: {
        const n = e[0];
        n === void 0 ? super(3) : typeof n == "number" ? super([n, n, n]) : super(n, 0, 3);
        break;
      }
      default:
        super(3);
        break;
    }
  }
  //============
  // Attributes
  //============
  // Getters and setters to make component access read better.
  // These are likely to be a little bit slower than direct array access.
  /**
   * The x component of the vector. Equivalent to `this[0];`
   * @category Vector components
   */
  get x() {
    return this[0];
  }
  set x(e) {
    this[0] = e;
  }
  /**
   * The y component of the vector. Equivalent to `this[1];`
   * @category Vector components
   */
  get y() {
    return this[1];
  }
  set y(e) {
    this[1] = e;
  }
  /**
   * The z component of the vector. Equivalent to `this[2];`
   * @category Vector components
   */
  get z() {
    return this[2];
  }
  set z(e) {
    this[2] = e;
  }
  // Alternate set of getters and setters in case this is being used to define
  // a color.
  /**
   * The r component of the vector. Equivalent to `this[0];`
   * @category Color components
   */
  get r() {
    return this[0];
  }
  set r(e) {
    this[0] = e;
  }
  /**
   * The g component of the vector. Equivalent to `this[1];`
   * @category Color components
   */
  get g() {
    return this[1];
  }
  set g(e) {
    this[1] = e;
  }
  /**
   * The b component of the vector. Equivalent to `this[2];`
   * @category Color components
   */
  get b() {
    return this[2];
  }
  set b(e) {
    this[2] = e;
  }
  /**
   * The magnitude (length) of this.
   * Equivalent to `Vec3.magnitude(this);`
   *
   * Magnitude is used because the `length` attribute is already defined by
   * TypedArrays to mean the number of elements in the array.
   */
  get magnitude() {
    const e = this[0], n = this[1], s = this[2];
    return Math.sqrt(e * e + n * n + s * s);
  }
  /**
   * Alias for {@link Vec3.magnitude}
   */
  get mag() {
    return this.magnitude;
  }
  /**
   * The squared magnitude (length) of `this`.
   * Equivalent to `Vec3.squaredMagnitude(this);`
   */
  get squaredMagnitude() {
    const e = this[0], n = this[1], s = this[2];
    return e * e + n * n + s * s;
  }
  /**
   * Alias for {@link Vec3.squaredMagnitude}
   */
  get sqrMag() {
    return this.squaredMagnitude;
  }
  /**
   * A string representation of `this`
   * Equivalent to `Vec3.str(this);`
   */
  get str() {
    return _t.str(this);
  }
  //===================
  // Instances methods
  //===================
  /**
   * Copy the values from another {@link Vec3} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(e) {
    return this.set(e), this;
  }
  /**
   * Adds a {@link Vec3} to `this`.
   * Equivalent to `Vec3.add(this, this, b);`
   *
   * @param b - The vector to add to `this`
   * @returns `this`
   */
  add(e) {
    return this[0] += e[0], this[1] += e[1], this[2] += e[2], this;
  }
  /**
   * Subtracts a {@link Vec3} from `this`.
   * Equivalent to `Vec3.subtract(this, this, b);`
   *
   * @param b - The vector to subtract from `this`
   * @returns `this`
   */
  subtract(e) {
    return this[0] -= e[0], this[1] -= e[1], this[2] -= e[2], this;
  }
  /**
   * Alias for {@link Vec3.subtract}
   */
  sub(e) {
    return this;
  }
  /**
   * Multiplies `this` by a {@link Vec3}.
   * Equivalent to `Vec3.multiply(this, this, b);`
   *
   * @param b - The vector to multiply `this` by
   * @returns `this`
   */
  multiply(e) {
    return this[0] *= e[0], this[1] *= e[1], this[2] *= e[2], this;
  }
  /**
   * Alias for {@link Vec3.multiply}
   */
  mul(e) {
    return this;
  }
  /**
   * Divides `this` by a {@link Vec3}.
   * Equivalent to `Vec3.divide(this, this, b);`
   *
   * @param b - The vector to divide `this` by
   * @returns `this`
   */
  divide(e) {
    return this[0] /= e[0], this[1] /= e[1], this[2] /= e[2], this;
  }
  /**
   * Alias for {@link Vec3.divide}
   */
  div(e) {
    return this;
  }
  /**
   * Scales `this` by a scalar number.
   * Equivalent to `Vec3.scale(this, this, b);`
   *
   * @param b - Amount to scale `this` by
   * @returns `this`
   */
  scale(e) {
    return this[0] *= e, this[1] *= e, this[2] *= e, this;
  }
  /**
   * Calculates `this` scaled by a scalar value then adds the result to `this`.
   * Equivalent to `Vec3.scaleAndAdd(this, this, b, scale);`
   *
   * @param b - The vector to add to `this`
   * @param scale - The amount to scale `b` by before adding
   * @returns `this`
   */
  scaleAndAdd(e, n) {
    return this[0] += e[0] * n, this[1] += e[1] * n, this[2] += e[2] * n, this;
  }
  /**
   * Calculates the euclidian distance between another {@link Vec3} and `this`.
   * Equivalent to `Vec3.distance(this, b);`
   *
   * @param b - The vector to calculate the distance to
   * @returns Distance between `this` and `b`
   */
  distance(e) {
    return _t.distance(this, e);
  }
  /**
   * Alias for {@link Vec3.distance}
   */
  dist(e) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between another {@link Vec3} and `this`.
   * Equivalent to `Vec3.squaredDistance(this, b);`
   *
   * @param b The vector to calculate the squared distance to
   * @returns Squared distance between `this` and `b`
   */
  squaredDistance(e) {
    return _t.squaredDistance(this, e);
  }
  /**
   * Alias for {@link Vec3.squaredDistance}
   */
  sqrDist(e) {
    return 0;
  }
  /**
   * Negates the components of `this`.
   * Equivalent to `Vec3.negate(this, this);`
   *
   * @returns `this`
   */
  negate() {
    return this[0] *= -1, this[1] *= -1, this[2] *= -1, this;
  }
  /**
   * Inverts the components of `this`.
   * Equivalent to `Vec3.inverse(this, this);`
   *
   * @returns `this`
   */
  invert() {
    return this[0] = 1 / this[0], this[1] = 1 / this[1], this[2] = 1 / this[2], this;
  }
  /**
   * Sets each component of `this` to it's absolute value.
   * Equivalent to `Vec3.abs(this, this);`
   *
   * @returns `this`
   */
  abs() {
    return this[0] = Math.abs(this[0]), this[1] = Math.abs(this[1]), this[2] = Math.abs(this[2]), this;
  }
  /**
   * Calculates the dot product of this and another {@link Vec3}.
   * Equivalent to `Vec3.dot(this, b);`
   *
   * @param b - The second operand
   * @returns Dot product of `this` and `b`
   */
  dot(e) {
    return this[0] * e[0] + this[1] * e[1] + this[2] * e[2];
  }
  /**
   * Normalize `this`.
   * Equivalent to `Vec3.normalize(this, this);`
   *
   * @returns `this`
   */
  normalize() {
    return _t.normalize(this, this);
  }
  //================
  // Static methods
  //================
  /**
   * Creates a new, empty vec3
   * @category Static
   *
   * @returns a new 3D vector
   */
  static create() {
    return new _t();
  }
  /**
   * Creates a new vec3 initialized with values from an existing vector
   * @category Static
   *
   * @param a - vector to clone
   * @returns a new 3D vector
   */
  static clone(e) {
    return new _t(e);
  }
  /**
   * Calculates the magnitude (length) of a {@link Vec3}
   * @category Static
   *
   * @param a - Vector to calculate magnitude of
   * @returns Magnitude of a
   */
  static magnitude(e) {
    let n = e[0], s = e[1], i = e[2];
    return Math.sqrt(n * n + s * s + i * i);
  }
  /**
   * Alias for {@link Vec3.magnitude}
   * @category Static
   */
  static mag(e) {
    return 0;
  }
  /**
   * Alias for {@link Vec3.magnitude}
   * @category Static
   * @deprecated Use {@link Vec3.magnitude} to avoid conflicts with builtin `length` methods/attribs
   *
   * @param a - vector to calculate length of
   * @returns length of a
   */
  // @ts-ignore: Length conflicts with Function.length
  static length(e) {
    return 0;
  }
  /**
   * Alias for {@link Vec3.magnitude}
   * @category Static
   * @deprecated Use {@link Vec3.mag}
   */
  static len(e) {
    return 0;
  }
  /**
   * Creates a new vec3 initialized with the given values
   * @category Static
   *
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @returns a new 3D vector
   */
  static fromValues(e, n, s) {
    return new _t(e, n, s);
  }
  /**
   * Copy the values from one vec3 to another
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the source vector
   * @returns `out`
   */
  static copy(e, n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e;
  }
  /**
   * Set the components of a vec3 to the given values
   * @category Static
   *
   * @param out - the receiving vector
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @returns `out`
   */
  static set(e, n, s, i) {
    return e[0] = n, e[1] = s, e[2] = i, e;
  }
  /**
   * Adds two {@link Vec3}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static add(e, n, s) {
    return e[0] = n[0] + s[0], e[1] = n[1] + s[1], e[2] = n[2] + s[2], e;
  }
  /**
   * Subtracts vector b from vector a
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static subtract(e, n, s) {
    return e[0] = n[0] - s[0], e[1] = n[1] - s[1], e[2] = n[2] - s[2], e;
  }
  /**
   * Alias for {@link Vec3.subtract}
   * @category Static
   */
  static sub(e, n, s) {
    return e;
  }
  /**
   * Multiplies two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static multiply(e, n, s) {
    return e[0] = n[0] * s[0], e[1] = n[1] * s[1], e[2] = n[2] * s[2], e;
  }
  /**
   * Alias for {@link Vec3.multiply}
   * @category Static
   */
  static mul(e, n, s) {
    return e;
  }
  /**
   * Divides two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static divide(e, n, s) {
    return e[0] = n[0] / s[0], e[1] = n[1] / s[1], e[2] = n[2] / s[2], e;
  }
  /**
   * Alias for {@link Vec3.divide}
   * @category Static
   */
  static div(e, n, s) {
    return e;
  }
  /**
   * Math.ceil the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to ceil
   * @returns `out`
   */
  static ceil(e, n) {
    return e[0] = Math.ceil(n[0]), e[1] = Math.ceil(n[1]), e[2] = Math.ceil(n[2]), e;
  }
  /**
   * Math.floor the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to floor
   * @returns `out`
   */
  static floor(e, n) {
    return e[0] = Math.floor(n[0]), e[1] = Math.floor(n[1]), e[2] = Math.floor(n[2]), e;
  }
  /**
   * Returns the minimum of two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static min(e, n, s) {
    return e[0] = Math.min(n[0], s[0]), e[1] = Math.min(n[1], s[1]), e[2] = Math.min(n[2], s[2]), e;
  }
  /**
   * Returns the maximum of two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static max(e, n, s) {
    return e[0] = Math.max(n[0], s[0]), e[1] = Math.max(n[1], s[1]), e[2] = Math.max(n[2], s[2]), e;
  }
  /**
   * symmetric round the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to round
   * @returns `out`
   */
  /*static round(out: Vec3Like, a: Readonly<Vec3Like>): Vec3Like {
    out[0] = glMatrix.round(a[0]);
    out[1] = glMatrix.round(a[1]);
    out[2] = glMatrix.round(a[2]);
    return out;
  }*/
  /**
   * Scales a vec3 by a scalar number
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to scale
   * @param scale - amount to scale the vector by
   * @returns `out`
   */
  static scale(e, n, s) {
    return e[0] = n[0] * s, e[1] = n[1] * s, e[2] = n[2] * s, e;
  }
  /**
   * Adds two vec3's after scaling the second operand by a scalar value
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param scale - the amount to scale b by before adding
   * @returns `out`
   */
  static scaleAndAdd(e, n, s, i) {
    return e[0] = n[0] + s[0] * i, e[1] = n[1] + s[1] * i, e[2] = n[2] + s[2] * i, e;
  }
  /**
   * Calculates the euclidian distance between two vec3's
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns distance between a and b
   */
  static distance(e, n) {
    const s = n[0] - e[0], i = n[1] - e[1], r = n[2] - e[2];
    return Math.sqrt(s * s + i * i + r * r);
  }
  /**
   * Alias for {@link Vec3.distance}
   */
  static dist(e, n) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between two vec3's
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns squared distance between a and b
   */
  static squaredDistance(e, n) {
    const s = n[0] - e[0], i = n[1] - e[1], r = n[2] - e[2];
    return s * s + i * i + r * r;
  }
  /**
   * Alias for {@link Vec3.squaredDistance}
   */
  static sqrDist(e, n) {
    return 0;
  }
  /**
   * Calculates the squared length of a vec3
   * @category Static
   *
   * @param a - vector to calculate squared length of
   * @returns squared length of a
   */
  static squaredLength(e) {
    const n = e[0], s = e[1], i = e[2];
    return n * n + s * s + i * i;
  }
  /**
   * Alias for {@link Vec3.squaredLength}
   */
  static sqrLen(e, n) {
    return 0;
  }
  /**
   * Negates the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to negate
   * @returns `out`
   */
  static negate(e, n) {
    return e[0] = -n[0], e[1] = -n[1], e[2] = -n[2], e;
  }
  /**
   * Returns the inverse of the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to invert
   * @returns `out`
   */
  static inverse(e, n) {
    return e[0] = 1 / n[0], e[1] = 1 / n[1], e[2] = 1 / n[2], e;
  }
  /**
   * Returns the absolute value of the components of a {@link Vec3}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to compute the absolute values of
   * @returns `out`
   */
  static abs(e, n) {
    return e[0] = Math.abs(n[0]), e[1] = Math.abs(n[1]), e[2] = Math.abs(n[2]), e;
  }
  /**
   * Normalize a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to normalize
   * @returns `out`
   */
  static normalize(e, n) {
    const s = n[0], i = n[1], r = n[2];
    let c = s * s + i * i + r * r;
    return c > 0 && (c = 1 / Math.sqrt(c)), e[0] = n[0] * c, e[1] = n[1] * c, e[2] = n[2] * c, e;
  }
  /**
   * Calculates the dot product of two vec3's
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns dot product of a and b
   */
  static dot(e, n) {
    return e[0] * n[0] + e[1] * n[1] + e[2] * n[2];
  }
  /**
   * Computes the cross product of two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static cross(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = s[0], l = s[1], h = s[2];
    return e[0] = r * h - c * l, e[1] = c * a - i * h, e[2] = i * l - r * a, e;
  }
  /**
   * Performs a linear interpolation between two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static lerp(e, n, s, i) {
    const r = n[0], c = n[1], a = n[2];
    return e[0] = r + i * (s[0] - r), e[1] = c + i * (s[1] - c), e[2] = a + i * (s[2] - a), e;
  }
  /**
   * Performs a spherical linear interpolation between two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static slerp(e, n, s, i) {
    const r = Math.acos(Math.min(Math.max(_t.dot(n, s), -1), 1)), c = Math.sin(r), a = Math.sin((1 - i) * r) / c, l = Math.sin(i * r) / c;
    return e[0] = a * n[0] + l * s[0], e[1] = a * n[1] + l * s[1], e[2] = a * n[2] + l * s[2], e;
  }
  /**
   * Performs a hermite interpolation with two control points
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param c - the third operand
   * @param d - the fourth operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static hermite(e, n, s, i, r, c) {
    const a = c * c, l = a * (2 * c - 3) + 1, h = a * (c - 2) + c, u = a * (c - 1), f = a * (3 - 2 * c);
    return e[0] = n[0] * l + s[0] * h + i[0] * u + r[0] * f, e[1] = n[1] * l + s[1] * h + i[1] * u + r[1] * f, e[2] = n[2] * l + s[2] * h + i[2] * u + r[2] * f, e;
  }
  /**
   * Performs a bezier interpolation with two control points
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param c - the third operand
   * @param d - the fourth operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static bezier(e, n, s, i, r, c) {
    const a = 1 - c, l = a * a, h = c * c, u = l * a, f = 3 * c * l, d = 3 * h * a, y = h * c;
    return e[0] = n[0] * u + s[0] * f + i[0] * d + r[0] * y, e[1] = n[1] * u + s[1] * f + i[1] * d + r[1] * y, e[2] = n[2] * u + s[2] * f + i[2] * d + r[2] * y, e;
  }
  /**
   * Generates a random vector with the given scale
   * @category Static
   *
   * @param out - the receiving vector
   * @param {Number} [scale] Length of the resulting vector. If omitted, a unit vector will be returned
   * @returns `out`
   */
  /*static random(out: Vec3Like, scale) {
      scale = scale === undefined ? 1.0 : scale;
  
      let r = glMatrix.RANDOM() * 2.0 * Math.PI;
      let z = glMatrix.RANDOM() * 2.0 - 1.0;
      let zScale = Math.sqrt(1.0 - z * z) * scale;
  
      out[0] = Math.cos(r) * zScale;
      out[1] = Math.sin(r) * zScale;
      out[2] = z * scale;
      return out;
    }*/
  /**
   * Transforms the vec3 with a mat4.
   * 4th vector component is implicitly '1'
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param m - matrix to transform with
   * @returns `out`
   */
  static transformMat4(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = s[3] * i + s[7] * r + s[11] * c + s[15] || 1;
    return e[0] = (s[0] * i + s[4] * r + s[8] * c + s[12]) / a, e[1] = (s[1] * i + s[5] * r + s[9] * c + s[13]) / a, e[2] = (s[2] * i + s[6] * r + s[10] * c + s[14]) / a, e;
  }
  /**
   * Transforms the vec3 with a mat3.
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param m - the 3x3 matrix to transform with
   * @returns `out`
   */
  static transformMat3(e, n, s) {
    let i = n[0], r = n[1], c = n[2];
    return e[0] = i * s[0] + r * s[3] + c * s[6], e[1] = i * s[1] + r * s[4] + c * s[7], e[2] = i * s[2] + r * s[5] + c * s[8], e;
  }
  /**
   * Transforms the vec3 with a quat
   * Can also be used for dual quaternions. (Multiply it with the real part)
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param q - quaternion to transform with
   * @returns `out`
   */
  static transformQuat(e, n, s) {
    const i = s[0], r = s[1], c = s[2], a = s[3] * 2, l = n[0], h = n[1], u = n[2], f = r * u - c * h, d = c * l - i * u, y = i * h - r * l, x = (r * y - c * d) * 2, g = (c * f - i * y) * 2, w = (i * d - r * f) * 2;
    return e[0] = l + f * a + x, e[1] = h + d * a + g, e[2] = u + y * a + w, e;
  }
  /**
   * Rotate a 3D vector around the x-axis
   * @param out - The receiving vec3
   * @param a - The vec3 point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotateX(e, n, s, i) {
    const r = s[1], c = s[2], a = n[1] - r, l = n[2] - c;
    return e[0] = n[0], e[1] = a * Math.cos(i) - l * Math.sin(i) + r, e[2] = a * Math.sin(i) + l * Math.cos(i) + c, e;
  }
  /**
   * Rotate a 3D vector around the y-axis
   * @param out - The receiving vec3
   * @param a - The vec3 point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotateY(e, n, s, i) {
    const r = s[0], c = s[2], a = n[0] - r, l = n[2] - c;
    return e[0] = l * Math.sin(i) + a * Math.cos(i) + r, e[1] = n[1], e[2] = l * Math.cos(i) - a * Math.sin(i) + c, e;
  }
  /**
   * Rotate a 3D vector around the z-axis
   * @param out - The receiving vec3
   * @param a - The vec3 point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotateZ(e, n, s, i) {
    const r = s[0], c = s[1], a = n[0] - r, l = n[1] - c;
    return e[0] = a * Math.cos(i) - l * Math.sin(i) + r, e[1] = a * Math.sin(i) + l * Math.cos(i) + c, e[2] = s[2], e;
  }
  /**
   * Get the angle between two 3D vectors
   * @param a - The first operand
   * @param b - The second operand
   * @returns The angle in radians
   */
  static angle(e, n) {
    const s = e[0], i = e[1], r = e[2], c = n[0], a = n[1], l = n[2], h = Math.sqrt((s * s + i * i + r * r) * (c * c + a * a + l * l)), u = h && _t.dot(e, n) / h;
    return Math.acos(Math.min(Math.max(u, -1), 1));
  }
  /**
   * Set the components of a vec3 to zero
   * @category Static
   *
   * @param out - the receiving vector
   * @returns `out`
   */
  static zero(e) {
    return e[0] = 0, e[1] = 0, e[2] = 0, e;
  }
  /**
   * Returns a string representation of a vector
   * @category Static
   *
   * @param a - vector to represent as a string
   * @returns string representation of the vector
   */
  static str(e) {
    return `Vec3(${e.join(", ")})`;
  }
  /**
   * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are equal, false otherwise.
   */
  static exactEquals(e, n) {
    return e[0] === n[0] && e[1] === n[1] && e[2] === n[2];
  }
  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are equal, false otherwise.
   */
  static equals(e, n) {
    const s = e[0], i = e[1], r = e[2], c = n[0], a = n[1], l = n[2];
    return Math.abs(s - c) <= dt * Math.max(1, Math.abs(s), Math.abs(c)) && Math.abs(i - a) <= dt * Math.max(1, Math.abs(i), Math.abs(a)) && Math.abs(r - l) <= dt * Math.max(1, Math.abs(r), Math.abs(l));
  }
}
_t.prototype.sub = _t.prototype.subtract;
_t.prototype.mul = _t.prototype.multiply;
_t.prototype.div = _t.prototype.divide;
_t.prototype.dist = _t.prototype.distance;
_t.prototype.sqrDist = _t.prototype.squaredDistance;
_t.sub = _t.subtract;
_t.mul = _t.multiply;
_t.div = _t.divide;
_t.dist = _t.distance;
_t.sqrDist = _t.squaredDistance;
_t.sqrLen = _t.squaredLength;
_t.mag = _t.magnitude;
_t.length = _t.magnitude;
_t.len = _t.magnitude;
const j0 = _t;
class bt extends Float32Array {
  /**
   * The number of bytes in a {@link Vec4}.
   */
  static BYTE_LENGTH = 4 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Vec4}.
   */
  constructor(...e) {
    switch (e.length) {
      case 4:
        super(e);
        break;
      case 2:
        super(e[0], e[1], 4);
        break;
      case 1: {
        const n = e[0];
        n === void 0 ? super(4) : typeof n == "number" ? super([n, n, n, n]) : super(n, 0, 4);
        break;
      }
      default:
        super(4);
        break;
    }
  }
  //============
  // Attributes
  //============
  // Getters and setters to make component access read better.
  // These are likely to be a little bit slower than direct array access.
  /**
   * The x component of the vector. Equivalent to `this[0];`
   * @category Vector components
   */
  get x() {
    return this[0];
  }
  set x(e) {
    this[0] = e;
  }
  /**
   * The y component of the vector. Equivalent to `this[1];`
   * @category Vector components
   */
  get y() {
    return this[1];
  }
  set y(e) {
    this[1] = e;
  }
  /**
   * The z component of the vector. Equivalent to `this[2];`
   * @category Vector components
   */
  get z() {
    return this[2];
  }
  set z(e) {
    this[2] = e;
  }
  /**
   * The w component of the vector. Equivalent to `this[3];`
   * @category Vector components
   */
  get w() {
    return this[3];
  }
  set w(e) {
    this[3] = e;
  }
  // Alternate set of getters and setters in case this is being used to define
  // a color.
  /**
   * The r component of the vector. Equivalent to `this[0];`
   * @category Color components
   */
  get r() {
    return this[0];
  }
  set r(e) {
    this[0] = e;
  }
  /**
   * The g component of the vector. Equivalent to `this[1];`
   * @category Color components
   */
  get g() {
    return this[1];
  }
  set g(e) {
    this[1] = e;
  }
  /**
   * The b component of the vector. Equivalent to `this[2];`
   * @category Color components
   */
  get b() {
    return this[2];
  }
  set b(e) {
    this[2] = e;
  }
  /**
   * The a component of the vector. Equivalent to `this[3];`
   * @category Color components
   */
  get a() {
    return this[3];
  }
  set a(e) {
    this[3] = e;
  }
  /**
   * The magnitude (length) of this.
   * Equivalent to `Vec4.magnitude(this);`
   *
   * Magnitude is used because the `length` attribute is already defined by
   * TypedArrays to mean the number of elements in the array.
   */
  get magnitude() {
    const e = this[0], n = this[1], s = this[2], i = this[3];
    return Math.sqrt(e * e + n * n + s * s + i * i);
  }
  /**
   * Alias for {@link Vec4.magnitude}
   */
  get mag() {
    return this.magnitude;
  }
  /**
   * A string representation of `this`
   * Equivalent to `Vec4.str(this);`
   */
  get str() {
    return bt.str(this);
  }
  //===================
  // Instances methods
  //===================
  /**
   * Copy the values from another {@link Vec4} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(e) {
    return super.set(e), this;
  }
  /**
   * Adds a {@link Vec4} to `this`.
   * Equivalent to `Vec4.add(this, this, b);`
   *
   * @param b - The vector to add to `this`
   * @returns `this`
   */
  add(e) {
    return this[0] += e[0], this[1] += e[1], this[2] += e[2], this[3] += e[3], this;
  }
  /**
   * Subtracts a {@link Vec4} from `this`.
   * Equivalent to `Vec4.subtract(this, this, b);`
   *
   * @param b - The vector to subtract from `this`
   * @returns `this`
   */
  subtract(e) {
    return this[0] -= e[0], this[1] -= e[1], this[2] -= e[2], this[3] -= e[3], this;
  }
  /**
   * Alias for {@link Vec4.subtract}
   */
  sub(e) {
    return this;
  }
  /**
   * Multiplies `this` by a {@link Vec4}.
   * Equivalent to `Vec4.multiply(this, this, b);`
   *
   * @param b - The vector to multiply `this` by
   * @returns `this`
   */
  multiply(e) {
    return this[0] *= e[0], this[1] *= e[1], this[2] *= e[2], this[3] *= e[3], this;
  }
  /**
   * Alias for {@link Vec4.multiply}
   */
  mul(e) {
    return this;
  }
  /**
   * Divides `this` by a {@link Vec4}.
   * Equivalent to `Vec4.divide(this, this, b);`
   *
   * @param b - The vector to divide `this` by
   * @returns `this`
   */
  divide(e) {
    return this[0] /= e[0], this[1] /= e[1], this[2] /= e[2], this[3] /= e[3], this;
  }
  /**
   * Alias for {@link Vec4.divide}
   */
  div(e) {
    return this;
  }
  /**
   * Scales `this` by a scalar number.
   * Equivalent to `Vec4.scale(this, this, b);`
   *
   * @param b - Amount to scale `this` by
   * @returns `this`
   */
  scale(e) {
    return this[0] *= e, this[1] *= e, this[2] *= e, this[3] *= e, this;
  }
  /**
   * Calculates `this` scaled by a scalar value then adds the result to `this`.
   * Equivalent to `Vec4.scaleAndAdd(this, this, b, scale);`
   *
   * @param b - The vector to add to `this`
   * @param scale - The amount to scale `b` by before adding
   * @returns `this`
   */
  scaleAndAdd(e, n) {
    return this[0] += e[0] * n, this[1] += e[1] * n, this[2] += e[2] * n, this[3] += e[3] * n, this;
  }
  /**
   * Calculates the euclidian distance between another {@link Vec4} and `this`.
   * Equivalent to `Vec4.distance(this, b);`
   *
   * @param b - The vector to calculate the distance to
   * @returns Distance between `this` and `b`
   */
  distance(e) {
    return bt.distance(this, e);
  }
  /**
   * Alias for {@link Vec4.distance}
   */
  dist(e) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between another {@link Vec4} and `this`.
   * Equivalent to `Vec4.squaredDistance(this, b);`
   *
   * @param b The vector to calculate the squared distance to
   * @returns Squared distance between `this` and `b`
   */
  squaredDistance(e) {
    return bt.squaredDistance(this, e);
  }
  /**
   * Alias for {@link Vec4.squaredDistance}
   */
  sqrDist(e) {
    return 0;
  }
  /**
   * Negates the components of `this`.
   * Equivalent to `Vec4.negate(this, this);`
   *
   * @returns `this`
   */
  negate() {
    return this[0] *= -1, this[1] *= -1, this[2] *= -1, this[3] *= -1, this;
  }
  /**
   * Inverts the components of `this`.
   * Equivalent to `Vec4.inverse(this, this);`
   *
   * @returns `this`
   */
  invert() {
    return this[0] = 1 / this[0], this[1] = 1 / this[1], this[2] = 1 / this[2], this[3] = 1 / this[3], this;
  }
  /**
   * Sets each component of `this` to it's absolute value.
   * Equivalent to `Vec4.abs(this, this);`
   *
   * @returns `this`
   */
  abs() {
    return this[0] = Math.abs(this[0]), this[1] = Math.abs(this[1]), this[2] = Math.abs(this[2]), this[3] = Math.abs(this[3]), this;
  }
  /**
   * Calculates the dot product of this and another {@link Vec4}.
   * Equivalent to `Vec4.dot(this, b);`
   *
   * @param b - The second operand
   * @returns Dot product of `this` and `b`
   */
  dot(e) {
    return this[0] * e[0] + this[1] * e[1] + this[2] * e[2] + this[3] * e[3];
  }
  /**
   * Normalize `this`.
   * Equivalent to `Vec4.normalize(this, this);`
   *
   * @returns `this`
   */
  normalize() {
    return bt.normalize(this, this);
  }
  //===================
  // Static methods
  //===================
  /**
   * Creates a new, empty {@link Vec4}
   * @category Static
   *
   * @returns a new 4D vector
   */
  static create() {
    return new bt();
  }
  /**
   * Creates a new {@link Vec4} initialized with values from an existing vector
   * @category Static
   *
   * @param a - vector to clone
   * @returns a new 4D vector
   */
  static clone(e) {
    return new bt(e);
  }
  /**
   * Creates a new {@link Vec4} initialized with the given values
   * @category Static
   *
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @param w - W component
   * @returns a new 4D vector
   */
  static fromValues(e, n, s, i) {
    return new bt(e, n, s, i);
  }
  /**
   * Copy the values from one {@link Vec4} to another
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the source vector
   * @returns `out`
   */
  static copy(e, n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e;
  }
  /**
   * Set the components of a {@link Vec4} to the given values
   * @category Static
   *
   * @param out - the receiving vector
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @param w - W component
   * @returns `out`
   */
  static set(e, n, s, i, r) {
    return e[0] = n, e[1] = s, e[2] = i, e[3] = r, e;
  }
  /**
   * Adds two {@link Vec4}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static add(e, n, s) {
    return e[0] = n[0] + s[0], e[1] = n[1] + s[1], e[2] = n[2] + s[2], e[3] = n[3] + s[3], e;
  }
  /**
   * Subtracts vector b from vector a
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static subtract(e, n, s) {
    return e[0] = n[0] - s[0], e[1] = n[1] - s[1], e[2] = n[2] - s[2], e[3] = n[3] - s[3], e;
  }
  /**
   * Alias for {@link Vec4.subtract}
   * @category Static
   */
  static sub(e, n, s) {
    return e;
  }
  /**
   * Multiplies two {@link Vec4}'s
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static multiply(e, n, s) {
    return e[0] = n[0] * s[0], e[1] = n[1] * s[1], e[2] = n[2] * s[2], e[3] = n[3] * s[3], e;
  }
  /**
   * Alias for {@link Vec4.multiply}
   * @category Static
   */
  static mul(e, n, s) {
    return e;
  }
  /**
   * Divides two {@link Vec4}'s
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static divide(e, n, s) {
    return e[0] = n[0] / s[0], e[1] = n[1] / s[1], e[2] = n[2] / s[2], e[3] = n[3] / s[3], e;
  }
  /**
   * Alias for {@link Vec4.divide}
   * @category Static
   */
  static div(e, n, s) {
    return e;
  }
  /**
   * Math.ceil the components of a {@link Vec4}
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to ceil
   * @returns `out`
   */
  static ceil(e, n) {
    return e[0] = Math.ceil(n[0]), e[1] = Math.ceil(n[1]), e[2] = Math.ceil(n[2]), e[3] = Math.ceil(n[3]), e;
  }
  /**
   * Math.floor the components of a {@link Vec4}
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to floor
   * @returns `out`
   */
  static floor(e, n) {
    return e[0] = Math.floor(n[0]), e[1] = Math.floor(n[1]), e[2] = Math.floor(n[2]), e[3] = Math.floor(n[3]), e;
  }
  /**
   * Returns the minimum of two {@link Vec4}'s
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static min(e, n, s) {
    return e[0] = Math.min(n[0], s[0]), e[1] = Math.min(n[1], s[1]), e[2] = Math.min(n[2], s[2]), e[3] = Math.min(n[3], s[3]), e;
  }
  /**
   * Returns the maximum of two {@link Vec4}'s
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static max(e, n, s) {
    return e[0] = Math.max(n[0], s[0]), e[1] = Math.max(n[1], s[1]), e[2] = Math.max(n[2], s[2]), e[3] = Math.max(n[3], s[3]), e;
  }
  /**
   * Math.round the components of a {@link Vec4}
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to round
   * @returns `out`
   */
  static round(e, n) {
    return e[0] = Math.round(n[0]), e[1] = Math.round(n[1]), e[2] = Math.round(n[2]), e[3] = Math.round(n[3]), e;
  }
  /**
   * Scales a {@link Vec4} by a scalar number
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to scale
   * @param scale - amount to scale the vector by
   * @returns `out`
   */
  static scale(e, n, s) {
    return e[0] = n[0] * s, e[1] = n[1] * s, e[2] = n[2] * s, e[3] = n[3] * s, e;
  }
  /**
   * Adds two {@link Vec4}'s after scaling the second operand by a scalar value
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param scale - the amount to scale b by before adding
   * @returns `out`
   */
  static scaleAndAdd(e, n, s, i) {
    return e[0] = n[0] + s[0] * i, e[1] = n[1] + s[1] * i, e[2] = n[2] + s[2] * i, e[3] = n[3] + s[3] * i, e;
  }
  /**
   * Calculates the euclidian distance between two {@link Vec4}'s
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns distance between a and b
   */
  static distance(e, n) {
    const s = n[0] - e[0], i = n[1] - e[1], r = n[2] - e[2], c = n[3] - e[3];
    return Math.hypot(s, i, r, c);
  }
  /**
   * Alias for {@link Vec4.distance}
   * @category Static
   */
  static dist(e, n) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between two {@link Vec4}'s
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns squared distance between a and b
   */
  static squaredDistance(e, n) {
    const s = n[0] - e[0], i = n[1] - e[1], r = n[2] - e[2], c = n[3] - e[3];
    return s * s + i * i + r * r + c * c;
  }
  /**
   * Alias for {@link Vec4.squaredDistance}
   * @category Static
   */
  static sqrDist(e, n) {
    return 0;
  }
  /**
   * Calculates the magnitude (length) of a {@link Vec4}
   * @category Static
   *
   * @param a - vector to calculate length of
   * @returns length of `a`
   */
  static magnitude(e) {
    const n = e[0], s = e[1], i = e[2], r = e[3];
    return Math.sqrt(n * n + s * s + i * i + r * r);
  }
  /**
   * Alias for {@link Vec4.magnitude}
   * @category Static
   */
  static mag(e) {
    return 0;
  }
  /**
   * Alias for {@link Vec4.magnitude}
   * @category Static
   * @deprecated Use {@link Vec4.magnitude} to avoid conflicts with builtin `length` methods/attribs
   */
  // @ts-ignore: Length conflicts with Function.length
  static length(e) {
    return 0;
  }
  /**
   * Alias for {@link Vec4.magnitude}
   * @category Static
   * @deprecated Use {@link Vec4.mag}
   */
  static len(e) {
    return 0;
  }
  /**
   * Calculates the squared length of a {@link Vec4}
   * @category Static
   *
   * @param a - vector to calculate squared length of
   * @returns squared length of a
   */
  static squaredLength(e) {
    const n = e[0], s = e[1], i = e[2], r = e[3];
    return n * n + s * s + i * i + r * r;
  }
  /**
   * Alias for {@link Vec4.squaredLength}
   * @category Static
   */
  static sqrLen(e) {
    return 0;
  }
  /**
   * Negates the components of a {@link Vec4}
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to negate
   * @returns `out`
   */
  static negate(e, n) {
    return e[0] = -n[0], e[1] = -n[1], e[2] = -n[2], e[3] = -n[3], e;
  }
  /**
   * Returns the inverse of the components of a {@link Vec4}
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to invert
   * @returns `out`
   */
  static inverse(e, n) {
    return e[0] = 1 / n[0], e[1] = 1 / n[1], e[2] = 1 / n[2], e[3] = 1 / n[3], e;
  }
  /**
   * Returns the absolute value of the components of a {@link Vec4}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to compute the absolute values of
   * @returns `out`
   */
  static abs(e, n) {
    return e[0] = Math.abs(n[0]), e[1] = Math.abs(n[1]), e[2] = Math.abs(n[2]), e[3] = Math.abs(n[3]), e;
  }
  /**
   * Normalize a {@link Vec4}
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to normalize
   * @returns `out`
   */
  static normalize(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[3];
    let a = s * s + i * i + r * r + c * c;
    return a > 0 && (a = 1 / Math.sqrt(a)), e[0] = s * a, e[1] = i * a, e[2] = r * a, e[3] = c * a, e;
  }
  /**
   * Calculates the dot product of two {@link Vec4}'s
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns dot product of a and b
   */
  static dot(e, n) {
    return e[0] * n[0] + e[1] * n[1] + e[2] * n[2] + e[3] * n[3];
  }
  /**
   * Returns the cross-product of three vectors in a 4-dimensional space
   * @category Static
   *
   * @param out the receiving vector
   * @param u - the first vector
   * @param v - the second vector
   * @param w - the third vector
   * @returns result
   */
  static cross(e, n, s, i) {
    const r = s[0] * i[1] - s[1] * i[0], c = s[0] * i[2] - s[2] * i[0], a = s[0] * i[3] - s[3] * i[0], l = s[1] * i[2] - s[2] * i[1], h = s[1] * i[3] - s[3] * i[1], u = s[2] * i[3] - s[3] * i[2], f = n[0], d = n[1], y = n[2], x = n[3];
    return e[0] = d * u - y * h + x * l, e[1] = -(f * u) + y * a - x * c, e[2] = f * h - d * a + x * r, e[3] = -(f * l) + d * c - y * r, e;
  }
  /**
   * Performs a linear interpolation between two {@link Vec4}'s
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static lerp(e, n, s, i) {
    const r = n[0], c = n[1], a = n[2], l = n[3];
    return e[0] = r + i * (s[0] - r), e[1] = c + i * (s[1] - c), e[2] = a + i * (s[2] - a), e[3] = l + i * (s[3] - l), e;
  }
  /**
   * Generates a random vector with the given scale
   * @category Static
   *
   * @param out - the receiving vector
   * @param [scale] - Length of the resulting vector. If ommitted, a unit vector will be returned
   * @returns `out`
   */
  /*static random(out: Vec4Like, scale): Vec4Like {
      scale = scale || 1.0;
  
      // Marsaglia, George. Choosing a Point from the Surface of a
      // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
      // http://projecteuclid.org/euclid.aoms/1177692644;
      var v1, v2, v3, v4;
      var s1, s2;
      do {
        v1 = glMatrix.RANDOM() * 2 - 1;
        v2 = glMatrix.RANDOM() * 2 - 1;
        s1 = v1 * v1 + v2 * v2;
      } while (s1 >= 1);
      do {
        v3 = glMatrix.RANDOM() * 2 - 1;
        v4 = glMatrix.RANDOM() * 2 - 1;
        s2 = v3 * v3 + v4 * v4;
      } while (s2 >= 1);
  
      var d = Math.sqrt((1 - s1) / s2);
      out[0] = scale * v1;
      out[1] = scale * v2;
      out[2] = scale * v3 * d;
      out[3] = scale * v4 * d;
      return out;
    }*/
  /**
   * Transforms the {@link Vec4} with a {@link Mat4}.
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param m - matrix to transform with
   * @returns `out`
   */
  static transformMat4(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3];
    return e[0] = s[0] * i + s[4] * r + s[8] * c + s[12] * a, e[1] = s[1] * i + s[5] * r + s[9] * c + s[13] * a, e[2] = s[2] * i + s[6] * r + s[10] * c + s[14] * a, e[3] = s[3] * i + s[7] * r + s[11] * c + s[15] * a, e;
  }
  /**
   * Transforms the {@link Vec4} with a {@link Quat}
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param q - quaternion to transform with
   * @returns `out`
   */
  static transformQuat(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = s[0], l = s[1], h = s[2], u = s[3], f = u * i + l * c - h * r, d = u * r + h * i - a * c, y = u * c + a * r - l * i, x = -a * i - l * r - h * c;
    return e[0] = f * u + x * -a + d * -h - y * -l, e[1] = d * u + x * -l + y * -a - f * -h, e[2] = y * u + x * -h + f * -l - d * -a, e[3] = n[3], e;
  }
  /**
   * Set the components of a {@link Vec4} to zero
   * @category Static
   *
   * @param out - the receiving vector
   * @returns `out`
   */
  static zero(e) {
    return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0, e;
  }
  /**
   * Returns a string representation of a {@link Vec4}
   * @category Static
   *
   * @param a - vector to represent as a string
   * @returns string representation of the vector
   */
  static str(e) {
    return `Vec4(${e.join(", ")})`;
  }
  /**
   * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are equal, false otherwise.
   */
  static exactEquals(e, n) {
    return e[0] === n[0] && e[1] === n[1] && e[2] === n[2] && e[3] === n[3];
  }
  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are equal, false otherwise.
   */
  static equals(e, n) {
    const s = e[0], i = e[1], r = e[2], c = e[3], a = n[0], l = n[1], h = n[2], u = n[3];
    return Math.abs(s - a) <= dt * Math.max(1, Math.abs(s), Math.abs(a)) && Math.abs(i - l) <= dt * Math.max(1, Math.abs(i), Math.abs(l)) && Math.abs(r - h) <= dt * Math.max(1, Math.abs(r), Math.abs(h)) && Math.abs(c - u) <= dt * Math.max(1, Math.abs(c), Math.abs(u));
  }
}
bt.prototype.sub = bt.prototype.subtract;
bt.prototype.mul = bt.prototype.multiply;
bt.prototype.div = bt.prototype.divide;
bt.prototype.dist = bt.prototype.distance;
bt.prototype.sqrDist = bt.prototype.squaredDistance;
bt.sub = bt.subtract;
bt.mul = bt.multiply;
bt.div = bt.divide;
bt.dist = bt.distance;
bt.sqrDist = bt.squaredDistance;
bt.sqrLen = bt.squaredLength;
bt.mag = bt.magnitude;
bt.length = bt.magnitude;
bt.len = bt.magnitude;
const G0 = bt, rr = new Float32Array([
  0,
  0,
  0,
  1
]);
class wt extends Float32Array {
  /**
   * The number of bytes in a {@link Quat}.
   */
  static BYTE_LENGTH = 4 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Quat}.
   */
  constructor(...e) {
    switch (e.length) {
      case 4:
        super(e);
        break;
      case 2:
        super(e[0], e[1], 4);
        break;
      case 1: {
        const n = e[0];
        n === void 0 ? super(rr) : typeof n == "number" ? super([n, n, n, n]) : super(n, 0, 4);
        break;
      }
      default:
        super(rr);
        break;
    }
  }
  //============
  // Attributes
  //============
  // Getters and setters to make component access read better.
  // These are likely to be a little bit slower than direct array access.
  /**
   * The x component of the quaternion. Equivalent to `this[0];`
   * @category Quaternion components
   */
  get x() {
    return this[0];
  }
  set x(e) {
    this[0] = e;
  }
  /**
   * The y component of the quaternion. Equivalent to `this[1];`
   * @category Quaternion components
   */
  get y() {
    return this[1];
  }
  set y(e) {
    this[1] = e;
  }
  /**
   * The z component of the quaternion. Equivalent to `this[2];`
   * @category Quaternion components
   */
  get z() {
    return this[2];
  }
  set z(e) {
    this[2] = e;
  }
  /**
   * The w component of the quaternion. Equivalent to `this[3];`
   * @category Quaternion components
   */
  get w() {
    return this[3];
  }
  set w(e) {
    this[3] = e;
  }
  /**
   * The magnitude (length) of this.
   * Equivalent to `Quat.magnitude(this);`
   *
   * Magnitude is used because the `length` attribute is already defined by
   * TypedArrays to mean the number of elements in the array.
   */
  get magnitude() {
    const e = this[0], n = this[1], s = this[2], i = this[3];
    return Math.sqrt(e * e + n * n + s * s + i * i);
  }
  /**
   * Alias for {@link Quat.magnitude}
   */
  get mag() {
    return this.magnitude;
  }
  /**
   * A string representation of `this`
   * Equivalent to `Quat.str(this);`
   */
  get str() {
    return wt.str(this);
  }
  //===================
  // Instances methods
  //===================
  /**
   * Copy the values from another {@link Quat} into `this`.
   *
   * @param a the source quaternion
   * @returns `this`
   */
  copy(e) {
    return super.set(e), this;
  }
  /**
   * Set `this` to the identity quaternion
   * Equivalent to Quat.identity(this)
   *
   * @returns `this`
   */
  identity() {
    return this.set(rr), this;
  }
  /**
   * Multiplies `this` by a {@link Quat}.
   * Equivalent to `Quat.multiply(this, this, b);`
   *
   * @param b - The vector to multiply `this` by
   * @returns `this`
   */
  multiply(e) {
    return wt.multiply(this, this, e);
  }
  /**
   * Alias for {@link Quat.multiply}
   */
  mul(e) {
    return this;
  }
  /**
   * Rotates `this` by the given angle about the X axis
   * Equivalent to `Quat.rotateX(this, this, rad);`
   *
   * @param rad - angle (in radians) to rotate
   * @returns `this`
   */
  rotateX(e) {
    return wt.rotateX(this, this, e);
  }
  /**
   * Rotates `this` by the given angle about the Y axis
   * Equivalent to `Quat.rotateY(this, this, rad);`
   *
   * @param rad - angle (in radians) to rotate
   * @returns `this`
   */
  rotateY(e) {
    return wt.rotateY(this, this, e);
  }
  /**
   * Rotates `this` by the given angle about the Z axis
   * Equivalent to `Quat.rotateZ(this, this, rad);`
   *
   * @param rad - angle (in radians) to rotate
   * @returns `this`
   */
  rotateZ(e) {
    return wt.rotateZ(this, this, e);
  }
  /**
   * Inverts `this`
   * Equivalent to `Quat.invert(this, this);`
   *
   * @returns `this`
   */
  invert() {
    return wt.invert(this, this);
  }
  /**
   * Scales `this` by a scalar number
   * Equivalent to `Quat.scale(this, this, scale);`
   *
   * @param out - the receiving vector
   * @param a - the vector to scale
   * @param scale - amount to scale the vector by
   * @returns `this`
   */
  scale(e) {
    return this[0] *= e, this[1] *= e, this[2] *= e, this[3] *= e, this;
  }
  /**
   * Calculates the dot product of `this` and another {@link Quat}
   * Equivalent to `Quat.dot(this, b);`
   *
   * @param b - the second operand
   * @returns dot product of `this` and b
   */
  dot(e) {
    return wt.dot(this, e);
  }
  //===================
  // Static methods
  //===================
  /**
   * Creates a new identity quat
   * @category Static
   *
   * @returns a new quaternion
   */
  static create() {
    return new wt();
  }
  /**
   * Set a quat to the identity quaternion
   * @category Static
   *
   * @param out - the receiving quaternion
   * @returns `out`
   */
  static identity(e) {
    return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, e;
  }
  /**
   * Sets a quat from the given angle and rotation axis,
   * then returns it.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param axis - the axis around which to rotate
   * @param rad - the angle in radians
   * @returns `out`
   **/
  static setAxisAngle(e, n, s) {
    s = s * 0.5;
    const i = Math.sin(s);
    return e[0] = i * n[0], e[1] = i * n[1], e[2] = i * n[2], e[3] = Math.cos(s), e;
  }
  /**
   * Gets the rotation axis and angle for a given
   *  quaternion. If a quaternion is created with
   *  setAxisAngle, this method will return the same
   *  values as providied in the original parameter list
   *  OR functionally equivalent values.
   * Example: The quaternion formed by axis [0, 0, 1] and
   *  angle -90 is the same as the quaternion formed by
   *  [0, 0, 1] and 270. This method favors the latter.
   * @category Static
   *
   * @param out_axis - Vector receiving the axis of rotation
   * @param q - Quaternion to be decomposed
   * @return Angle, in radians, of the rotation
   */
  static getAxisAngle(e, n) {
    const s = Math.acos(n[3]) * 2, i = Math.sin(s / 2);
    return i > dt ? (e[0] = n[0] / i, e[1] = n[1] / i, e[2] = n[2] / i) : (e[0] = 1, e[1] = 0, e[2] = 0), s;
  }
  /**
   * Gets the angular distance between two unit quaternions
   * @category Static
   *
   * @param  {ReadonlyQuat} a     Origin unit quaternion
   * @param  {ReadonlyQuat} b     Destination unit quaternion
   * @return {Number}     Angle, in radians, between the two quaternions
   */
  static getAngle(e, n) {
    const s = wt.dot(e, n);
    return Math.acos(2 * s * s - 1);
  }
  /**
   * Multiplies two quat's
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static multiply(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = s[0], h = s[1], u = s[2], f = s[3];
    return e[0] = i * f + a * l + r * u - c * h, e[1] = r * f + a * h + c * l - i * u, e[2] = c * f + a * u + i * h - r * l, e[3] = a * f - i * l - r * h - c * u, e;
  }
  /**
   * Rotates a quaternion by the given angle about the X axis
   * @category Static
   *
   * @param out - quat receiving operation result
   * @param a - quat to rotate
   * @param rad - angle (in radians) to rotate
   * @returns `out`
   */
  static rotateX(e, n, s) {
    s *= 0.5;
    const i = n[0], r = n[1], c = n[2], a = n[3], l = Math.sin(s), h = Math.cos(s);
    return e[0] = i * h + a * l, e[1] = r * h + c * l, e[2] = c * h - r * l, e[3] = a * h - i * l, e;
  }
  /**
   * Rotates a quaternion by the given angle about the Y axis
   * @category Static
   *
   * @param out - quat receiving operation result
   * @param a - quat to rotate
   * @param rad - angle (in radians) to rotate
   * @returns `out`
   */
  static rotateY(e, n, s) {
    s *= 0.5;
    const i = n[0], r = n[1], c = n[2], a = n[3], l = Math.sin(s), h = Math.cos(s);
    return e[0] = i * h - c * l, e[1] = r * h + a * l, e[2] = c * h + i * l, e[3] = a * h - r * l, e;
  }
  /**
   * Rotates a quaternion by the given angle about the Z axis
   * @category Static
   *
   * @param out - quat receiving operation result
   * @param a - quat to rotate
   * @param rad - angle (in radians) to rotate
   * @returns `out`
   */
  static rotateZ(e, n, s) {
    s *= 0.5;
    const i = n[0], r = n[1], c = n[2], a = n[3], l = Math.sin(s), h = Math.cos(s);
    return e[0] = i * h + r * l, e[1] = r * h - i * l, e[2] = c * h + a * l, e[3] = a * h - c * l, e;
  }
  /**
   * Calculates the W component of a quat from the X, Y, and Z components.
   * Assumes that quaternion is 1 unit in length.
   * Any existing W component will be ignored.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - quat to calculate W component of
   * @returns `out`
   */
  static calculateW(e, n) {
    const s = n[0], i = n[1], r = n[2];
    return e[0] = s, e[1] = i, e[2] = r, e[3] = Math.sqrt(Math.abs(1 - s * s - i * i - r * r)), e;
  }
  /**
   * Calculate the exponential of a unit quaternion.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - quat to calculate the exponential of
   * @returns `out`
   */
  static exp(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[3], a = Math.sqrt(s * s + i * i + r * r), l = Math.exp(c), h = a > 0 ? l * Math.sin(a) / a : 0;
    return e[0] = s * h, e[1] = i * h, e[2] = r * h, e[3] = l * Math.cos(a), e;
  }
  /**
   * Calculate the natural logarithm of a unit quaternion.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - quat to calculate the exponential of
   * @returns `out`
   */
  static ln(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[3], a = Math.sqrt(s * s + i * i + r * r), l = a > 0 ? Math.atan2(a, c) / a : 0;
    return e[0] = s * l, e[1] = i * l, e[2] = r * l, e[3] = 0.5 * Math.log(s * s + i * i + r * r + c * c), e;
  }
  /**
   * Calculate the scalar power of a unit quaternion.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - quat to calculate the exponential of
   * @param b - amount to scale the quaternion by
   * @returns `out`
   */
  static pow(e, n, s) {
    return wt.ln(e, n), wt.scale(e, e, s), wt.exp(e, e), e;
  }
  /**
   * Performs a spherical linear interpolation between two quat
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static slerp(e, n, s, i) {
    const r = n[0], c = n[1], a = n[2], l = n[3];
    let h = s[0], u = s[1], f = s[2], d = s[3], y, x, g = r * h + c * u + a * f + l * d;
    if (g < 0 && (g = -g, h = -h, u = -u, f = -f, d = -d), 1 - g > dt) {
      const w = Math.acos(g), M = Math.sin(w);
      y = Math.sin((1 - i) * w) / M, x = Math.sin(i * w) / M;
    } else
      y = 1 - i, x = i;
    return e[0] = y * r + x * h, e[1] = y * c + x * u, e[2] = y * a + x * f, e[3] = y * l + x * d, e;
  }
  /**
   * Generates a random unit quaternion
   * @category Static
   *
   * @param out - the receiving quaternion
   * @returns `out`
   */
  /*static random(out: QuatLike): QuatLike {
      // Implementation of http://planning.cs.uiuc.edu/node198.html
      // TODO: Calling random 3 times is probably not the fastest solution
      let u1 = glMatrix.RANDOM();
      let u2 = glMatrix.RANDOM();
      let u3 = glMatrix.RANDOM();
  
      let sqrt1MinusU1 = Math.sqrt(1 - u1);
      let sqrtU1 = Math.sqrt(u1);
  
      out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
      out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
      out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
      out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
      return out;
    }*/
  /**
   * Calculates the inverse of a quat
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - quat to calculate inverse of
   * @returns `out`
   */
  static invert(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[3], a = s * s + i * i + r * r + c * c, l = a ? 1 / a : 0;
    return e[0] = -s * l, e[1] = -i * l, e[2] = -r * l, e[3] = c * l, e;
  }
  /**
   * Calculates the conjugate of a quat
   * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - quat to calculate conjugate of
   * @returns `out`
   */
  static conjugate(e, n) {
    return e[0] = -n[0], e[1] = -n[1], e[2] = -n[2], e[3] = n[3], e;
  }
  /**
   * Creates a quaternion from the given 3x3 rotation matrix.
   *
   * NOTE: The resultant quaternion is not normalized, so you should be sure
   * to renormalize the quaternion yourself where necessary.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param m - rotation matrix
   * @returns `out`
   */
  static fromMat3(e, n) {
    const s = n[0] + n[4] + n[8];
    let i;
    if (s > 0)
      i = Math.sqrt(s + 1), e[3] = 0.5 * i, i = 0.5 / i, e[0] = (n[5] - n[7]) * i, e[1] = (n[6] - n[2]) * i, e[2] = (n[1] - n[3]) * i;
    else {
      let r = 0;
      n[4] > n[0] && (r = 1), n[8] > n[r * 3 + r] && (r = 2);
      let c = (r + 1) % 3, a = (r + 2) % 3;
      i = Math.sqrt(n[r * 3 + r] - n[c * 3 + c] - n[a * 3 + a] + 1), e[r] = 0.5 * i, i = 0.5 / i, e[3] = (n[c * 3 + a] - n[a * 3 + c]) * i, e[c] = (n[c * 3 + r] + n[r * 3 + c]) * i, e[a] = (n[a * 3 + r] + n[r * 3 + a]) * i;
    }
    return e;
  }
  /**
   * Creates a quaternion from the given euler angle x, y, z.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param x - Angle to rotate around X axis in degrees.
   * @param y - Angle to rotate around Y axis in degrees.
   * @param z - Angle to rotate around Z axis in degrees.
   * @param {'xyz'|'xzy'|'yxz'|'yzx'|'zxy'|'zyx'} order - Intrinsic order for conversion, default is zyx.
   * @returns `out`
   */
  static fromEuler(e, n, s, i, r = oh) {
    let c = 0.5 * Math.PI / 180;
    n *= c, s *= c, i *= c;
    let a = Math.sin(n), l = Math.cos(n), h = Math.sin(s), u = Math.cos(s), f = Math.sin(i), d = Math.cos(i);
    switch (r) {
      case "xyz":
        e[0] = a * u * d + l * h * f, e[1] = l * h * d - a * u * f, e[2] = l * u * f + a * h * d, e[3] = l * u * d - a * h * f;
        break;
      case "xzy":
        e[0] = a * u * d - l * h * f, e[1] = l * h * d - a * u * f, e[2] = l * u * f + a * h * d, e[3] = l * u * d + a * h * f;
        break;
      case "yxz":
        e[0] = a * u * d + l * h * f, e[1] = l * h * d - a * u * f, e[2] = l * u * f - a * h * d, e[3] = l * u * d + a * h * f;
        break;
      case "yzx":
        e[0] = a * u * d + l * h * f, e[1] = l * h * d + a * u * f, e[2] = l * u * f - a * h * d, e[3] = l * u * d - a * h * f;
        break;
      case "zxy":
        e[0] = a * u * d - l * h * f, e[1] = l * h * d + a * u * f, e[2] = l * u * f + a * h * d, e[3] = l * u * d - a * h * f;
        break;
      case "zyx":
        e[0] = a * u * d - l * h * f, e[1] = l * h * d + a * u * f, e[2] = l * u * f - a * h * d, e[3] = l * u * d + a * h * f;
        break;
      default:
        throw new Error("Unknown angle order " + r);
    }
    return e;
  }
  /**
   * Returns a string representation of a quatenion
   * @category Static
   *
   * @param a - vector to represent as a string
   * @returns string representation of the vector
   */
  static str(e) {
    return `Quat(${e.join(", ")})`;
  }
  /**
   * Creates a new quat initialized with values from an existing quaternion
   * @category Static
   *
   * @param a - quaternion to clone
   * @returns a new quaternion
   */
  static clone(e) {
    return new wt(e);
  }
  /**
   * Creates a new quat initialized with the given values
   * @category Static
   *
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @param w - W component
   * @returns a new quaternion
   */
  static fromValues(e, n, s, i) {
    return new wt(e, n, s, i);
  }
  /**
   * Copy the values from one quat to another
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - the source quaternion
   * @returns `out`
   */
  static copy(e, n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e;
  }
  /**
   * Set the components of a {@link Quat} to the given values
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @param w - W component
   * @returns `out`
   */
  static set(e, n, s, i, r) {
    return e;
  }
  /**
   * Adds two {@link Quat}'s
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static add(e, n, s) {
    return e;
  }
  /**
   * Alias for {@link Quat.multiply}
   * @category Static
   */
  static mul(e, n, s) {
    return e;
  }
  /**
   * Scales a quat by a scalar number
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to scale
   * @param b - amount to scale the vector by
   * @returns `out`
   */
  static scale(e, n, s) {
    return e[0] = n[0] * s, e[1] = n[1] * s, e[2] = n[2] * s, e[3] = n[3] * s, e;
  }
  /**
   * Calculates the dot product of two quat's
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns dot product of a and b
   */
  static dot(e, n) {
    return e[0] * n[0] + e[1] * n[1] + e[2] * n[2] + e[3] * n[3];
  }
  /**
   * Performs a linear interpolation between two quat's
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static lerp(e, n, s, i) {
    return e;
  }
  /**
   * Calculates the magnitude (length) of a {@link Quat}
   * @category Static
   *
   * @param a - quaternion to calculate length of
   * @returns length of `a`
   */
  static magnitude(e) {
    return 0;
  }
  /**
   * Alias for {@link Quat.magnitude}
   * @category Static
   */
  static mag(e) {
    return 0;
  }
  /**
   * Alias for {@link Quat.magnitude}
   * @category Static
   * @deprecated Use {@link Quat.magnitude} to avoid conflicts with builtin `length` methods/attribs
   */
  // @ts-ignore: Length conflicts with Function.length
  static length(e) {
    return 0;
  }
  /**
   * Alias for {@link Quat.magnitude}
   * @category Static
   * @deprecated Use {@link Quat.mag}
   */
  static len(e) {
    return 0;
  }
  /**
   * Calculates the squared length of a {@link Quat}
   * @category Static
   *
   * @param a - quaternion to calculate squared length of
   * @returns squared length of a
   */
  static squaredLength(e) {
    return 0;
  }
  /**
   * Alias for {@link Quat.squaredLength}
   * @category Static
   */
  static sqrLen(e) {
    return 0;
  }
  /**
   * Normalize a {@link Quat}
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - quaternion to normalize
   * @returns `out`
   */
  static normalize(e, n) {
    return e;
  }
  /**
   * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first quaternion.
   * @param b - The second quaternion.
   * @returns True if the vectors are equal, false otherwise.
   */
  static exactEquals(e, n) {
    return !1;
  }
  /**
   * Returns whether or not the quaternions have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are equal, false otherwise.
   */
  static equals(e, n) {
    return !1;
  }
  /**
   * Sets a quaternion to represent the shortest rotation from one
   * vector to another.
   *
   * Both vectors are assumed to be unit length.
   * @category Static
   *
   * @param out - the receiving quaternion.
   * @param a - the initial vector
   * @param b - the destination vector
   * @returns `out`
   */
  static rotationTo(e, n, s) {
    let i = _t.dot(n, s);
    return i < -0.999999 ? (_t.cross(Ne, Z0, n), _t.mag(Ne) < 1e-6 && _t.cross(Ne, J0, n), _t.normalize(Ne, Ne), wt.setAxisAngle(e, Ne, Math.PI), e) : i > 0.999999 ? (e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, e) : (_t.cross(Ne, n, s), e[0] = Ne[0], e[1] = Ne[1], e[2] = Ne[2], e[3] = 1 + i, wt.normalize(e, e));
  }
  /**
   * Performs a spherical linear interpolation with two control points
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - the first operand
   * @param b - the second operand
   * @param c - the third operand
   * @param d - the fourth operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static sqlerp(e, n, s, i, r, c) {
    return wt.slerp(Zo, n, r, c), wt.slerp(Jo, s, i, c), wt.slerp(e, Zo, Jo, 2 * c * (1 - c)), e;
  }
  /**
   * Sets the specified quaternion with values corresponding to the given
   * axes. Each axis is a vec3 and is expected to be unit length and
   * perpendicular to all other specified axes.
   * @category Static
   *
   * @param out - The receiving quaternion
   * @param view - the vector representing the viewing direction
   * @param right - the vector representing the local "right" direction
   * @param up - the vector representing the local "up" direction
   * @returns `out`
   */
  static setAxes(e, n, s, i) {
    return Ce[0] = s[0], Ce[3] = s[1], Ce[6] = s[2], Ce[1] = i[0], Ce[4] = i[1], Ce[7] = i[2], Ce[2] = -n[0], Ce[5] = -n[1], Ce[8] = -n[2], wt.normalize(e, wt.fromMat3(e, Ce));
  }
}
const Zo = new Float32Array(4), Jo = new Float32Array(4), Ce = new Float32Array(9), Ne = new Float32Array(3), Z0 = new Float32Array([1, 0, 0]), J0 = new Float32Array([0, 1, 0]);
wt.set = bt.set;
wt.add = bt.add;
wt.lerp = bt.lerp;
wt.normalize = bt.normalize;
wt.squaredLength = bt.squaredLength;
wt.sqrLen = bt.squaredLength;
wt.exactEquals = bt.exactEquals;
wt.equals = bt.equals;
wt.magnitude = bt.magnitude;
wt.prototype.mul = wt.prototype.multiply;
wt.mul = wt.multiply;
wt.mag = wt.magnitude;
wt.length = wt.magnitude;
wt.len = wt.magnitude;
const Q0 = wt, Qo = new Float32Array([
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0
]);
class Wt extends Float32Array {
  /**
   * The number of bytes in a {@link Quat}.
   */
  static BYTE_LENGTH = 8 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Quat2}.
   */
  constructor(...e) {
    switch (e.length) {
      case 8:
        super(e);
        break;
      case 2:
        super(e[0], e[1], 8);
        break;
      case 1: {
        const n = e[0];
        n === void 0 ? super(Qo) : typeof n == "number" ? super([n, n, n, n, n, n, n, n]) : super(n, 0, 8);
        break;
      }
      default:
        super(Qo);
        break;
    }
  }
  //============
  // Attributes
  //============
  /**
   * A string representation of `this`
   * Equivalent to `Quat2.str(this);`
   */
  get str() {
    return Wt.str(this);
  }
  //===================
  // Instances methods
  //===================
  /**
   * Copy the values from another {@link Quat2} into `this`.
   *
   * @param a the source dual quaternion
   * @returns `this`
   */
  copy(e) {
    return super.set(e), this;
  }
  //===================
  // Static methods
  //===================
  /**
   * Creates a new identity {@link Quat2}
   * @category Static
   *
   * @returns a new dual quaternion [real -> rotation, dual -> translation]
   */
  static create() {
    return new Wt();
  }
  /**
   * Creates a {@link Quat2} quat initialized with values from an existing quaternion
   * @category Static
   *
   * @param a - dual quaternion to clone
   * @returns a new dual quaternion
   */
  static clone(e) {
    return new Wt(e);
  }
  /**
   * Creates a new {@link Quat2}  initialized with the given values
   * @category Static
   *
   * @param x1 - 1st X component
   * @param y1 - 1st Y component
   * @param z1 - 1st Z component
   * @param w1 - 1st W component
   * @param x2 - 2nd X component
   * @param y2 - 2nd Y component
   * @param z2 - 2nd Z component
   * @param w2 - 2nd W component
   * @returns a new dual quaternion
   */
  static fromValues(e, n, s, i, r, c, a, l) {
    return new Wt(e, n, s, i, r, c, a, l);
  }
  /**
   * Creates a new {@link Quat2} from the given values (quat and translation)
   * @category Static
   *
   * @param x1 - X component (rotation)
   * @param y1 - Y component (rotation)
   * @param z1 - Z component (rotation)
   * @param w1 - W component (rotation)
   * @param x2 - X component (translation)
   * @param y2 - Y component (translation)
   * @param z2 - Z component (translation)
   * @returns a new dual quaternion
   */
  static fromRotationTranslationValues(e, n, s, i, r, c, a) {
    const l = r * 0.5, h = c * 0.5, u = a * 0.5;
    return new Wt(
      e,
      n,
      s,
      i,
      l * i + h * s - u * n,
      h * i + u * e - l * s,
      u * i + l * n - h * e,
      -l * e - h * n - u * s
    );
  }
  /**
   * Sets a {@link Quat2} from a quaternion and a translation
   * @category Static
   *
   * @param out - dual quaternion receiving operation result
   * @param q - a normalized quaternion
   * @param t - translation vector
   * @returns `out`
   */
  static fromRotationTranslation(e, n, s) {
    const i = s[0] * 0.5, r = s[1] * 0.5, c = s[2] * 0.5, a = n[0], l = n[1], h = n[2], u = n[3];
    return e[0] = a, e[1] = l, e[2] = h, e[3] = u, e[4] = i * u + r * h - c * l, e[5] = r * u + c * a - i * h, e[6] = c * u + i * l - r * a, e[7] = -i * a - r * l - c * h, e;
  }
  /**
   * Sets a {@link Quat2} from a translation
   * @category Static
   *
   * @param out - dual quaternion receiving operation result
   * @param t - translation vector
   * @returns `out`
   */
  static fromTranslation(e, n) {
    return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = n[0] * 0.5, e[5] = n[1] * 0.5, e[6] = n[2] * 0.5, e[7] = 0, e;
  }
  /**
   * Sets a {@link Quat2} from a quaternion
   * @category Static
   *
   * @param out - dual quaternion receiving operation result
   * @param q - a normalized quaternion
   * @returns `out`
   */
  static fromRotation(e, n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = 0, e[5] = 0, e[6] = 0, e[7] = 0, e;
  }
  /**
   * Sets a {@link Quat2} from a quaternion
   * @category Static
   *
   * @param out - dual quaternion receiving operation result
   * @param a - the matrix
   * @returns `out`
   */
  static fromMat4(e, n) {
    return At.getRotation(Ko, n), At.getTranslation(tc, n), Wt.fromRotationTranslation(e, Ko, tc);
  }
  /**
   * Copy the values from one {@link Quat2} to another
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param a - the source dual quaternion
   * @returns `out`
   */
  static copy(e, n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e;
  }
  /**
   * Set a {@link Quat2} to the identity dual quaternion
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @returns `out`
   */
  static identity(e) {
    return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = 0, e[5] = 0, e[6] = 0, e[7] = 0, e;
  }
  /**
   * Set the components of a {@link Quat2} to the given values
   * @category Static
   *
   * @param out - the receiving vector
   * @param x1 - 1st X component
   * @param y1 - 1st Y component
   * @param z1 - 1st Z component
   * @param w1 - 1st W component
   * @param x2 - 2nd X component
   * @param y2 - 2nd Y component
   * @param z2 - 2nd Z component
   * @param w2 - 2nd W component
   * @returns `out`
   */
  static set(e, n, s, i, r, c, a, l, h) {
    return e[0] = n, e[1] = s, e[2] = i, e[3] = r, e[4] = c, e[5] = a, e[6] = l, e[7] = h, e;
  }
  /**
   * Gets the real part of a dual quat
   * @category Static
   *
   * @param out - real part
   * @param a - Dual Quaternion
   * @return `out`
   */
  static getReal(e, n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e;
  }
  /**
   * Gets the dual part of a dual quat
   * @category Static
   *
   * @param out - dual part
   * @param a - Dual Quaternion
   * @return `out`
   */
  static getDual(e, n) {
    return e[0] = n[4], e[1] = n[5], e[2] = n[6], e[3] = n[7], e;
  }
  /**
   * Set the real component of a {@link Quat2} to the given quaternion
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param a - a quaternion representing the real part
   * @return `out`
   */
  static setReal(e, n) {
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e;
  }
  /**
   * Set the dual component of a {@link Quat2} to the given quaternion
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param a - a quaternion representing the dual part
   * @return `out`
   */
  static setDual(e, n) {
    return e[4] = n[0], e[5] = n[1], e[6] = n[2], e[7] = n[3], e;
  }
  /**
   * Gets the translation of a normalized {@link Quat2}
   * @category Static
   *
   * @param out - the receiving translation vector
   * @param a - Dual Quaternion to be decomposed
   * @return `out`
   */
  static getTranslation(e, n) {
    const s = n[4], i = n[5], r = n[6], c = n[7], a = -n[0], l = -n[1], h = -n[2], u = n[3];
    return e[0] = (s * u + c * a + i * h - r * l) * 2, e[1] = (i * u + c * l + r * a - s * h) * 2, e[2] = (r * u + c * h + s * l - i * a) * 2, e;
  }
  /**
   * Translates a {@link Quat2} by the given vector
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param a - the dual quaternion to translate
   * @param v - vector to translate by
   * @returns `out`
   */
  static translate(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = s[0] * 0.5, h = s[1] * 0.5, u = s[2] * 0.5, f = n[4], d = n[5], y = n[6], x = n[7];
    return e[0] = i, e[1] = r, e[2] = c, e[3] = a, e[4] = a * l + r * u - c * h + f, e[5] = a * h + c * l - i * u + d, e[6] = a * u + i * h - r * l + y, e[7] = -i * l - r * h - c * u + x, e;
  }
  /**
   * Rotates a {@link Quat2} around the X axis
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param a - the dual quaternion to rotate
   * @param rad - angle (in radians) to rotate
   * @returns `out`
   */
  static rotateX(e, n, s) {
    let i = -n[0], r = -n[1], c = -n[2], a = n[3];
    const l = n[4], h = n[5], u = n[6], f = n[7], d = l * a + f * i + h * c - u * r, y = h * a + f * r + u * i - l * c, x = u * a + f * c + l * r - h * i, g = f * a - l * i - h * r - u * c;
    return wt.rotateX(e, n, s), i = e[0], r = e[1], c = e[2], a = e[3], e[4] = d * a + g * i + y * c - x * r, e[5] = y * a + g * r + x * i - d * c, e[6] = x * a + g * c + d * r - y * i, e[7] = g * a - d * i - y * r - x * c, e;
  }
  /**
   * Rotates a {@link Quat2} around the Y axis
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param a - the dual quaternion to rotate
   * @param rad - angle (in radians) to rotate
   * @returns `out`
   */
  static rotateY(e, n, s) {
    let i = -n[0], r = -n[1], c = -n[2], a = n[3];
    const l = n[4], h = n[5], u = n[6], f = n[7], d = l * a + f * i + h * c - u * r, y = h * a + f * r + u * i - l * c, x = u * a + f * c + l * r - h * i, g = f * a - l * i - h * r - u * c;
    return wt.rotateY(e, n, s), i = e[0], r = e[1], c = e[2], a = e[3], e[4] = d * a + g * i + y * c - x * r, e[5] = y * a + g * r + x * i - d * c, e[6] = x * a + g * c + d * r - y * i, e[7] = g * a - d * i - y * r - x * c, e;
  }
  /**
   * Rotates a {@link Quat2} around the Z axis
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param a - the dual quaternion to rotate
   * @param rad - angle (in radians) to rotate
   * @returns `out`
   */
  static rotateZ(e, n, s) {
    let i = -n[0], r = -n[1], c = -n[2], a = n[3];
    const l = n[4], h = n[5], u = n[6], f = n[7], d = l * a + f * i + h * c - u * r, y = h * a + f * r + u * i - l * c, x = u * a + f * c + l * r - h * i, g = f * a - l * i - h * r - u * c;
    return wt.rotateZ(e, n, s), i = e[0], r = e[1], c = e[2], a = e[3], e[4] = d * a + g * i + y * c - x * r, e[5] = y * a + g * r + x * i - d * c, e[6] = x * a + g * c + d * r - y * i, e[7] = g * a - d * i - y * r - x * c, e;
  }
  /**
   * Rotates a {@link Quat2} by a given quaternion (a * q)
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param a - the dual quaternion to rotate
   * @param q - quaternion to rotate by
   * @returns `out`
   */
  static rotateByQuatAppend(e, n, s) {
    const i = s[0], r = s[1], c = s[2], a = s[3];
    let l = n[0], h = n[1], u = n[2], f = n[3];
    return e[0] = l * a + f * i + h * c - u * r, e[1] = h * a + f * r + u * i - l * c, e[2] = u * a + f * c + l * r - h * i, e[3] = f * a - l * i - h * r - u * c, l = n[4], h = n[5], u = n[6], f = n[7], e[4] = l * a + f * i + h * c - u * r, e[5] = h * a + f * r + u * i - l * c, e[6] = u * a + f * c + l * r - h * i, e[7] = f * a - l * i - h * r - u * c, e;
  }
  /**
   * Rotates a {@link Quat2} by a given quaternion (q * a)
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param q - quaternion to rotate by
   * @param a - the dual quaternion to rotate
   * @returns `out`
   */
  static rotateByQuatPrepend(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3];
    let l = s[0], h = s[1], u = s[2], f = s[3];
    return e[0] = i * f + a * l + r * u - c * h, e[1] = r * f + a * h + c * l - i * u, e[2] = c * f + a * u + i * h - r * l, e[3] = a * f - i * l - r * h - c * u, l = s[4], h = s[5], u = s[6], f = s[7], e[4] = i * f + a * l + r * u - c * h, e[5] = r * f + a * h + c * l - i * u, e[6] = c * f + a * u + i * h - r * l, e[7] = a * f - i * l - r * h - c * u, e;
  }
  /**
   * Rotates a {@link Quat2} around a given axis. Does the normalization automatically
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param a - the dual quaternion to rotate
   * @param axis - the axis to rotate around
   * @param rad - how far the rotation should be
   * @returns `out`
   */
  static rotateAroundAxis(e, n, s, i) {
    if (Math.abs(i) < dt)
      return Wt.copy(e, n);
    const r = Math.sqrt(s[0] * s[0] + s[1] * s[1] + s[2] * s[2]);
    i = i * 0.5;
    const c = Math.sin(i), a = c * s[0] / r, l = c * s[1] / r, h = c * s[2] / r, u = Math.cos(i), f = n[0], d = n[1], y = n[2], x = n[3];
    e[0] = f * u + x * a + d * h - y * l, e[1] = d * u + x * l + y * a - f * h, e[2] = y * u + x * h + f * l - d * a, e[3] = x * u - f * a - d * l - y * h;
    const g = n[4], w = n[5], M = n[6], P = n[7];
    return e[4] = g * u + P * a + w * h - M * l, e[5] = w * u + P * l + M * a - g * h, e[6] = M * u + P * h + g * l - w * a, e[7] = P * u - g * a - w * l - M * h, e;
  }
  /**
   * Adds two {@link Quat2}s
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static add(e, n, s) {
    return e[0] = n[0] + s[0], e[1] = n[1] + s[1], e[2] = n[2] + s[2], e[3] = n[3] + s[3], e[4] = n[4] + s[4], e[5] = n[5] + s[5], e[6] = n[6] + s[6], e[7] = n[7] + s[7], e;
  }
  /**
   * Multiplies two {@link Quat2}s
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param a - the first operand
   * @param b - the second operand
   * @returns {quat2} out
   */
  static multiply(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], l = s[4], h = s[5], u = s[6], f = s[7], d = n[4], y = n[5], x = n[6], g = n[7], w = s[0], M = s[1], P = s[2], S = s[3];
    return e[0] = i * S + a * w + r * P - c * M, e[1] = r * S + a * M + c * w - i * P, e[2] = c * S + a * P + i * M - r * w, e[3] = a * S - i * w - r * M - c * P, e[4] = i * f + a * l + r * u - c * h + d * S + g * w + y * P - x * M, e[5] = r * f + a * h + c * l - i * u + y * S + g * M + x * w - d * P, e[6] = c * f + a * u + i * h - r * l + x * S + g * P + d * M - y * w, e[7] = a * f - i * l - r * h - c * u + g * S - d * w - y * M - x * P, e;
  }
  /**
   * Alias for {@link Quat2.multiply}
   * @category Static
   */
  static mul(e, n, s) {
    return e;
  }
  /**
   * Scales a {@link Quat2} by a scalar value
   * @category Static
   *
   * @param out - the receiving dual quaterion
   * @param a - the dual quaternion to scale
   * @param b - scalar value to scale the dual quaterion by
   * @returns `out`
   */
  static scale(e, n, s) {
    return e[0] = n[0] * s, e[1] = n[1] * s, e[2] = n[2] * s, e[3] = n[3] * s, e[4] = n[4] * s, e[5] = n[5] * s, e[6] = n[6] * s, e[7] = n[7] * s, e;
  }
  /**
   * Calculates the dot product of two {@link Quat2}s (The dot product of the real parts)
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns dot product of a and b
   */
  static dot(e, n) {
    return 0;
  }
  /**
   * Performs a linear interpolation between two {@link Quat2}s
   * NOTE: The resulting dual quaternions won't always be normalized (The error is most noticeable when `t = 0.5`)
   * @category Static
   *
   * @param out - the receiving dual quat
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static lerp(e, n, s, i) {
    const r = 1 - i;
    return Wt.dot(n, s) < 0 && (i = -i), e[0] = n[0] * r + s[0] * i, e[1] = n[1] * r + s[1] * i, e[2] = n[2] * r + s[2] * i, e[3] = n[3] * r + s[3] * i, e[4] = n[4] * r + s[4] * i, e[5] = n[5] * r + s[5] * i, e[6] = n[6] * r + s[6] * i, e[7] = n[7] * r + s[7] * i, e;
  }
  /**
   * Calculates the inverse of a {@link Quat2}. If they are normalized, conjugate is cheaper
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param a - dual quat to calculate inverse of
   * @returns `out`
   */
  static invert(e, n) {
    const s = Wt.squaredLength(n);
    return e[0] = -n[0] / s, e[1] = -n[1] / s, e[2] = -n[2] / s, e[3] = n[3] / s, e[4] = -n[4] / s, e[5] = -n[5] / s, e[6] = -n[6] / s, e[7] = n[7] / s, e;
  }
  /**
   * Calculates the conjugate of a {@link Quat2}
   * If the dual quaternion is normalized, this function is faster than {@link Quat2.invert} and produces the same result.
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param a - dual quaternion to calculate conjugate of
   * @returns `out`
   */
  static conjugate(e, n) {
    return e[0] = -n[0], e[1] = -n[1], e[2] = -n[2], e[3] = n[3], e[4] = -n[4], e[5] = -n[5], e[6] = -n[6], e[7] = n[7], e;
  }
  /**
   * Calculates the magnitude (length) of a {@link Quat2}
   * @category Static
   *
   * @param a - dual quaternion to calculate length of
   * @returns length of `a`
   */
  static magnitude(e) {
    return 0;
  }
  /**
   * Alias for {@link Quat2.magnitude}
   * @category Static
   */
  static mag(e) {
    return 0;
  }
  /**
   * Alias for {@link Quat2.magnitude}
   * @category Static
   * @deprecated Use {@link Quat2.magnitude} to avoid conflicts with builtin `length` methods/attribs
   */
  // @ts-ignore: Length conflicts with Function.length
  static length(e) {
    return 0;
  }
  /**
   * Alias for {@link Quat2.magnitude}
   * @category Static
   * @deprecated Use {@link Quat2.mag}
   */
  static len(e) {
    return 0;
  }
  /**
   * Calculates the squared length of a {@link Quat2}
   * @category Static
   *
   * @param a - dual quaternion to calculate squared length of
   * @returns squared length of a
   */
  static squaredLength(e) {
    return 0;
  }
  /**
   * Alias for {@link Quat2.squaredLength}
   * @category Static
   */
  static sqrLen(e) {
    return 0;
  }
  /**
   * Normalize a {@link Quat2}
   * @category Static
   *
   * @param out - the receiving dual quaternion
   * @param a - dual quaternion to normalize
   * @returns `out`
   */
  static normalize(e, n) {
    let s = Wt.squaredLength(n);
    if (s > 0) {
      s = Math.sqrt(s);
      const i = n[0] / s, r = n[1] / s, c = n[2] / s, a = n[3] / s, l = n[4], h = n[5], u = n[6], f = n[7], d = i * l + r * h + c * u + a * f;
      e[0] = i, e[1] = r, e[2] = c, e[3] = a, e[4] = (l - i * d) / s, e[5] = (h - r * d) / s, e[6] = (u - c * d) / s, e[7] = (f - a * d) / s;
    }
    return e;
  }
  /**
   * Returns a string representation of a {@link Quat2}
   * @category Static
   *
   * @param a - dual quaternion to represent as a string
   * @returns string representation of the vector
   */
  static str(e) {
    return `Quat2(${e.join(", ")})`;
  }
  /**
   * Returns whether or not the {@link Quat2}s have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first dual quaternion.
   * @param b - The second dual quaternion.
   * @returns True if the dual quaternions are equal, false otherwise.
   */
  static exactEquals(e, n) {
    return e[0] === n[0] && e[1] === n[1] && e[2] === n[2] && e[3] === n[3] && e[4] === n[4] && e[5] === n[5] && e[6] === n[6] && e[7] === n[7];
  }
  /**
   * Returns whether or not the {@link Quat2}s have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first dual quaternion.
   * @param b - The second dual quaternion.
   * @returns True if the dual quaternions are equal, false otherwise.
   */
  static equals(e, n) {
    const s = e[0], i = e[1], r = e[2], c = e[3], a = e[4], l = e[5], h = e[6], u = e[7], f = n[0], d = n[1], y = n[2], x = n[3], g = n[4], w = n[5], M = n[6], P = n[7];
    return Math.abs(s - f) <= dt * Math.max(1, Math.abs(s), Math.abs(f)) && Math.abs(i - d) <= dt * Math.max(1, Math.abs(i), Math.abs(d)) && Math.abs(r - y) <= dt * Math.max(1, Math.abs(r), Math.abs(y)) && Math.abs(c - x) <= dt * Math.max(1, Math.abs(c), Math.abs(x)) && Math.abs(a - g) <= dt * Math.max(1, Math.abs(a), Math.abs(g)) && Math.abs(l - w) <= dt * Math.max(1, Math.abs(l), Math.abs(w)) && Math.abs(h - M) <= dt * Math.max(1, Math.abs(h), Math.abs(M)) && Math.abs(u - P) <= dt * Math.max(1, Math.abs(u), Math.abs(P));
  }
}
const Ko = new Float32Array(4), tc = new Float32Array(3);
Wt.dot = wt.dot;
Wt.squaredLength = wt.squaredLength;
Wt.sqrLen = wt.squaredLength;
Wt.mag = wt.magnitude;
Wt.length = wt.magnitude;
Wt.len = wt.magnitude;
Wt.mul = Wt.multiply;
const K0 = Wt, Q1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  mat2: U0,
  mat2d: X0,
  mat3: W0,
  mat4: $0,
  quat: Q0,
  quat2: K0,
  vec2: ch,
  vec3: j0,
  vec4: G0
}, Symbol.toStringTag, { value: "Module" }));
function tu(o, e) {
  return class extends o {
    constructor(...n) {
      super(...n), e(this);
    }
  };
}
const eu = tu(Array, (o) => o.fill(0));
let Tt = 1e-6;
function nu(o) {
  const e = Tt;
  return Tt = o, e;
}
function su(o) {
  return o * Math.PI / 180;
}
function iu(o) {
  return o * 180 / Math.PI;
}
function ru(o, e, n) {
  return o + (e - o) * n;
}
function ou(o, e, n) {
  const s = e - o;
  return Math.abs(e - o) < Tt ? o : (n - o) / s;
}
function cu(o, e) {
  return (o % e + e) % e;
}
const au = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get EPSILON() {
    return Tt;
  },
  degToRad: su,
  euclideanModulo: cu,
  inverseLerp: ou,
  lerp: ru,
  radToDeg: iu,
  setEpsilon: nu
}, Symbol.toStringTag, { value: "Module" }));
function lu(o) {
  function e(C = 0, H = 0) {
    const B = new o(2);
    return C !== void 0 && (B[0] = C, H !== void 0 && (B[1] = H)), B;
  }
  const n = e;
  function s(C, H, B) {
    const p = B ?? new o(2);
    return p[0] = C, p[1] = H, p;
  }
  function i(C, H) {
    const B = H ?? new o(2);
    return B[0] = Math.ceil(C[0]), B[1] = Math.ceil(C[1]), B;
  }
  function r(C, H) {
    const B = H ?? new o(2);
    return B[0] = Math.floor(C[0]), B[1] = Math.floor(C[1]), B;
  }
  function c(C, H) {
    const B = H ?? new o(2);
    return B[0] = Math.round(C[0]), B[1] = Math.round(C[1]), B;
  }
  function a(C, H = 0, B = 1, p) {
    const L = p ?? new o(2);
    return L[0] = Math.min(B, Math.max(H, C[0])), L[1] = Math.min(B, Math.max(H, C[1])), L;
  }
  function l(C, H, B) {
    const p = B ?? new o(2);
    return p[0] = C[0] + H[0], p[1] = C[1] + H[1], p;
  }
  function h(C, H, B, p) {
    const L = p ?? new o(2);
    return L[0] = C[0] + H[0] * B, L[1] = C[1] + H[1] * B, L;
  }
  function u(C, H) {
    const B = C[0], p = C[1], L = H[0], b = H[1], T = Math.sqrt(B * B + p * p), v = Math.sqrt(L * L + b * b), A = T * v, z = A && N(C, H) / A;
    return Math.acos(z);
  }
  function f(C, H, B) {
    const p = B ?? new o(2);
    return p[0] = C[0] - H[0], p[1] = C[1] - H[1], p;
  }
  const d = f;
  function y(C, H) {
    return Math.abs(C[0] - H[0]) < Tt && Math.abs(C[1] - H[1]) < Tt;
  }
  function x(C, H) {
    return C[0] === H[0] && C[1] === H[1];
  }
  function g(C, H, B, p) {
    const L = p ?? new o(2);
    return L[0] = C[0] + B * (H[0] - C[0]), L[1] = C[1] + B * (H[1] - C[1]), L;
  }
  function w(C, H, B, p) {
    const L = p ?? new o(2);
    return L[0] = C[0] + B[0] * (H[0] - C[0]), L[1] = C[1] + B[1] * (H[1] - C[1]), L;
  }
  function M(C, H, B) {
    const p = B ?? new o(2);
    return p[0] = Math.max(C[0], H[0]), p[1] = Math.max(C[1], H[1]), p;
  }
  function P(C, H, B) {
    const p = B ?? new o(2);
    return p[0] = Math.min(C[0], H[0]), p[1] = Math.min(C[1], H[1]), p;
  }
  function S(C, H, B) {
    const p = B ?? new o(2);
    return p[0] = C[0] * H, p[1] = C[1] * H, p;
  }
  const k = S;
  function O(C, H, B) {
    const p = B ?? new o(2);
    return p[0] = C[0] / H, p[1] = C[1] / H, p;
  }
  function R(C, H) {
    const B = H ?? new o(2);
    return B[0] = 1 / C[0], B[1] = 1 / C[1], B;
  }
  const F = R;
  function Y(C, H, B) {
    const p = B ?? new o(3), L = C[0] * H[1] - C[1] * H[0];
    return p[0] = 0, p[1] = 0, p[2] = L, p;
  }
  function N(C, H) {
    return C[0] * H[0] + C[1] * H[1];
  }
  function $(C) {
    const H = C[0], B = C[1];
    return Math.sqrt(H * H + B * B);
  }
  const W = $;
  function Q(C) {
    const H = C[0], B = C[1];
    return H * H + B * B;
  }
  const ct = Q;
  function K(C, H) {
    const B = C[0] - H[0], p = C[1] - H[1];
    return Math.sqrt(B * B + p * p);
  }
  const j = K;
  function V(C, H) {
    const B = C[0] - H[0], p = C[1] - H[1];
    return B * B + p * p;
  }
  const at = V;
  function pt(C, H) {
    const B = H ?? new o(2), p = C[0], L = C[1], b = p * p + L * L, T = b > 0 ? 1 / Math.sqrt(b) : 1;
    return B[0] = p * T, B[1] = L * T, B;
  }
  function Et(C, H) {
    const B = H ?? new o(2);
    return B[0] = -C[0], B[1] = -C[1], B;
  }
  function vt(C, H) {
    const B = H ?? new o(2);
    return B[0] = C[0], B[1] = C[1], B;
  }
  const kt = vt;
  function Rt(C, H, B) {
    const p = B ?? new o(2);
    return p[0] = C[0] * H[0], p[1] = C[1] * H[1], p;
  }
  const zt = Rt;
  function Ht(C, H, B) {
    const p = B ?? new o(2);
    return p[0] = C[0] / H[0], p[1] = C[1] / H[1], p;
  }
  const Vt = Ht;
  function Ut(C = 1, H) {
    const B = H ?? new o(2), p = Math.random() * 2 * Math.PI;
    return B[0] = Math.cos(p) * C, B[1] = Math.sin(p) * C, B;
  }
  function U(C) {
    const H = C ?? new o(2);
    return H[0] = 0, H[1] = 0, H;
  }
  function J(C, H, B) {
    const p = B ?? new o(2), L = C[0], b = C[1];
    return p[0] = L * H[0] + b * H[4] + H[12], p[1] = L * H[1] + b * H[5] + H[13], p;
  }
  function D(C, H, B) {
    const p = B ?? new o(2), L = C[0], b = C[1];
    return p[0] = H[0] * L + H[4] * b + H[8], p[1] = H[1] * L + H[5] * b + H[9], p;
  }
  function m(C, H, B, p) {
    const L = p ?? new o(2), b = C[0] - H[0], T = C[1] - H[1], v = Math.sin(B), A = Math.cos(B);
    return L[0] = b * A - T * v + H[0], L[1] = b * v + T * A + H[1], L;
  }
  function E(C, H, B) {
    const p = B ?? new o(2);
    return pt(C, p), S(p, H, p);
  }
  function _(C, H, B) {
    const p = B ?? new o(2);
    return $(C) > H ? E(C, H, p) : vt(C, p);
  }
  function I(C, H, B) {
    const p = B ?? new o(2);
    return g(C, H, 0.5, p);
  }
  return {
    create: e,
    fromValues: n,
    set: s,
    ceil: i,
    floor: r,
    round: c,
    clamp: a,
    add: l,
    addScaled: h,
    angle: u,
    subtract: f,
    sub: d,
    equalsApproximately: y,
    equals: x,
    lerp: g,
    lerpV: w,
    max: M,
    min: P,
    mulScalar: S,
    scale: k,
    divScalar: O,
    inverse: R,
    invert: F,
    cross: Y,
    dot: N,
    length: $,
    len: W,
    lengthSq: Q,
    lenSq: ct,
    distance: K,
    dist: j,
    distanceSq: V,
    distSq: at,
    normalize: pt,
    negate: Et,
    copy: vt,
    clone: kt,
    multiply: Rt,
    mul: zt,
    divide: Ht,
    div: Vt,
    random: Ut,
    zero: U,
    transformMat4: J,
    transformMat3: D,
    rotate: m,
    setLength: E,
    truncate: _,
    midpoint: I
  };
}
const ec = /* @__PURE__ */ new Map();
function Ta(o) {
  let e = ec.get(o);
  return e || (e = lu(o), ec.set(o, e)), e;
}
function hu(o) {
  function e(v, A, z) {
    const q = new o(3);
    return v !== void 0 && (q[0] = v, A !== void 0 && (q[1] = A, z !== void 0 && (q[2] = z))), q;
  }
  const n = e;
  function s(v, A, z, q) {
    const X = q ?? new o(3);
    return X[0] = v, X[1] = A, X[2] = z, X;
  }
  function i(v, A) {
    const z = A ?? new o(3);
    return z[0] = Math.ceil(v[0]), z[1] = Math.ceil(v[1]), z[2] = Math.ceil(v[2]), z;
  }
  function r(v, A) {
    const z = A ?? new o(3);
    return z[0] = Math.floor(v[0]), z[1] = Math.floor(v[1]), z[2] = Math.floor(v[2]), z;
  }
  function c(v, A) {
    const z = A ?? new o(3);
    return z[0] = Math.round(v[0]), z[1] = Math.round(v[1]), z[2] = Math.round(v[2]), z;
  }
  function a(v, A = 0, z = 1, q) {
    const X = q ?? new o(3);
    return X[0] = Math.min(z, Math.max(A, v[0])), X[1] = Math.min(z, Math.max(A, v[1])), X[2] = Math.min(z, Math.max(A, v[2])), X;
  }
  function l(v, A, z) {
    const q = z ?? new o(3);
    return q[0] = v[0] + A[0], q[1] = v[1] + A[1], q[2] = v[2] + A[2], q;
  }
  function h(v, A, z, q) {
    const X = q ?? new o(3);
    return X[0] = v[0] + A[0] * z, X[1] = v[1] + A[1] * z, X[2] = v[2] + A[2] * z, X;
  }
  function u(v, A) {
    const z = v[0], q = v[1], X = v[2], G = A[0], Z = A[1], lt = A[2], it = Math.sqrt(z * z + q * q + X * X), rt = Math.sqrt(G * G + Z * Z + lt * lt), yt = it * rt, Mt = yt && N(v, A) / yt;
    return Math.acos(Mt);
  }
  function f(v, A, z) {
    const q = z ?? new o(3);
    return q[0] = v[0] - A[0], q[1] = v[1] - A[1], q[2] = v[2] - A[2], q;
  }
  const d = f;
  function y(v, A) {
    return Math.abs(v[0] - A[0]) < Tt && Math.abs(v[1] - A[1]) < Tt && Math.abs(v[2] - A[2]) < Tt;
  }
  function x(v, A) {
    return v[0] === A[0] && v[1] === A[1] && v[2] === A[2];
  }
  function g(v, A, z, q) {
    const X = q ?? new o(3);
    return X[0] = v[0] + z * (A[0] - v[0]), X[1] = v[1] + z * (A[1] - v[1]), X[2] = v[2] + z * (A[2] - v[2]), X;
  }
  function w(v, A, z, q) {
    const X = q ?? new o(3);
    return X[0] = v[0] + z[0] * (A[0] - v[0]), X[1] = v[1] + z[1] * (A[1] - v[1]), X[2] = v[2] + z[2] * (A[2] - v[2]), X;
  }
  function M(v, A, z) {
    const q = z ?? new o(3);
    return q[0] = Math.max(v[0], A[0]), q[1] = Math.max(v[1], A[1]), q[2] = Math.max(v[2], A[2]), q;
  }
  function P(v, A, z) {
    const q = z ?? new o(3);
    return q[0] = Math.min(v[0], A[0]), q[1] = Math.min(v[1], A[1]), q[2] = Math.min(v[2], A[2]), q;
  }
  function S(v, A, z) {
    const q = z ?? new o(3);
    return q[0] = v[0] * A, q[1] = v[1] * A, q[2] = v[2] * A, q;
  }
  const k = S;
  function O(v, A, z) {
    const q = z ?? new o(3);
    return q[0] = v[0] / A, q[1] = v[1] / A, q[2] = v[2] / A, q;
  }
  function R(v, A) {
    const z = A ?? new o(3);
    return z[0] = 1 / v[0], z[1] = 1 / v[1], z[2] = 1 / v[2], z;
  }
  const F = R;
  function Y(v, A, z) {
    const q = z ?? new o(3), X = v[2] * A[0] - v[0] * A[2], G = v[0] * A[1] - v[1] * A[0];
    return q[0] = v[1] * A[2] - v[2] * A[1], q[1] = X, q[2] = G, q;
  }
  function N(v, A) {
    return v[0] * A[0] + v[1] * A[1] + v[2] * A[2];
  }
  function $(v) {
    const A = v[0], z = v[1], q = v[2];
    return Math.sqrt(A * A + z * z + q * q);
  }
  const W = $;
  function Q(v) {
    const A = v[0], z = v[1], q = v[2];
    return A * A + z * z + q * q;
  }
  const ct = Q;
  function K(v, A) {
    const z = v[0] - A[0], q = v[1] - A[1], X = v[2] - A[2];
    return Math.sqrt(z * z + q * q + X * X);
  }
  const j = K;
  function V(v, A) {
    const z = v[0] - A[0], q = v[1] - A[1], X = v[2] - A[2];
    return z * z + q * q + X * X;
  }
  const at = V;
  function pt(v, A) {
    const z = A ?? new o(3), q = v[0], X = v[1], G = v[2], Z = q * q + X * X + G * G, lt = Z > 0 ? 1 / Math.sqrt(Z) : 1;
    return z[0] = q * lt, z[1] = X * lt, z[2] = G * lt, z;
  }
  function Et(v, A) {
    const z = A ?? new o(3);
    return z[0] = -v[0], z[1] = -v[1], z[2] = -v[2], z;
  }
  function vt(v, A) {
    const z = A ?? new o(3);
    return z[0] = v[0], z[1] = v[1], z[2] = v[2], z;
  }
  const kt = vt;
  function Rt(v, A, z) {
    const q = z ?? new o(3);
    return q[0] = v[0] * A[0], q[1] = v[1] * A[1], q[2] = v[2] * A[2], q;
  }
  const zt = Rt;
  function Ht(v, A, z) {
    const q = z ?? new o(3);
    return q[0] = v[0] / A[0], q[1] = v[1] / A[1], q[2] = v[2] / A[2], q;
  }
  const Vt = Ht;
  function Ut(v = 1, A) {
    const z = A ?? new o(3), q = Math.random() * 2 * Math.PI, X = Math.random() * 2 - 1, G = Math.sqrt(1 - X * X) * v;
    return z[0] = Math.cos(q) * G, z[1] = Math.sin(q) * G, z[2] = X * v, z;
  }
  function U(v) {
    const A = v ?? new o(3);
    return A[0] = 0, A[1] = 0, A[2] = 0, A;
  }
  function J(v, A, z) {
    const q = z ?? new o(3), X = v[0], G = v[1], Z = v[2], lt = A[3] * X + A[7] * G + A[11] * Z + A[15] || 1;
    return q[0] = (A[0] * X + A[4] * G + A[8] * Z + A[12]) / lt, q[1] = (A[1] * X + A[5] * G + A[9] * Z + A[13]) / lt, q[2] = (A[2] * X + A[6] * G + A[10] * Z + A[14]) / lt, q;
  }
  function D(v, A, z) {
    const q = z ?? new o(3), X = v[0], G = v[1], Z = v[2];
    return q[0] = X * A[0] + G * A[4] + Z * A[8], q[1] = X * A[1] + G * A[5] + Z * A[9], q[2] = X * A[2] + G * A[6] + Z * A[10], q;
  }
  function m(v, A, z) {
    const q = z ?? new o(3), X = v[0], G = v[1], Z = v[2];
    return q[0] = X * A[0] + G * A[4] + Z * A[8], q[1] = X * A[1] + G * A[5] + Z * A[9], q[2] = X * A[2] + G * A[6] + Z * A[10], q;
  }
  function E(v, A, z) {
    const q = z ?? new o(3), X = A[0], G = A[1], Z = A[2], lt = A[3] * 2, it = v[0], rt = v[1], yt = v[2], Mt = G * yt - Z * rt, xt = Z * it - X * yt, mt = X * rt - G * it;
    return q[0] = it + Mt * lt + (G * mt - Z * xt) * 2, q[1] = rt + xt * lt + (Z * Mt - X * mt) * 2, q[2] = yt + mt * lt + (X * xt - G * Mt) * 2, q;
  }
  function _(v, A) {
    const z = A ?? new o(3);
    return z[0] = v[12], z[1] = v[13], z[2] = v[14], z;
  }
  function I(v, A, z) {
    const q = z ?? new o(3), X = A * 4;
    return q[0] = v[X + 0], q[1] = v[X + 1], q[2] = v[X + 2], q;
  }
  function C(v, A) {
    const z = A ?? new o(3), q = v[0], X = v[1], G = v[2], Z = v[4], lt = v[5], it = v[6], rt = v[8], yt = v[9], Mt = v[10];
    return z[0] = Math.sqrt(q * q + X * X + G * G), z[1] = Math.sqrt(Z * Z + lt * lt + it * it), z[2] = Math.sqrt(rt * rt + yt * yt + Mt * Mt), z;
  }
  function H(v, A, z, q) {
    const X = q ?? new o(3), G = [], Z = [];
    return G[0] = v[0] - A[0], G[1] = v[1] - A[1], G[2] = v[2] - A[2], Z[0] = G[0], Z[1] = G[1] * Math.cos(z) - G[2] * Math.sin(z), Z[2] = G[1] * Math.sin(z) + G[2] * Math.cos(z), X[0] = Z[0] + A[0], X[1] = Z[1] + A[1], X[2] = Z[2] + A[2], X;
  }
  function B(v, A, z, q) {
    const X = q ?? new o(3), G = [], Z = [];
    return G[0] = v[0] - A[0], G[1] = v[1] - A[1], G[2] = v[2] - A[2], Z[0] = G[2] * Math.sin(z) + G[0] * Math.cos(z), Z[1] = G[1], Z[2] = G[2] * Math.cos(z) - G[0] * Math.sin(z), X[0] = Z[0] + A[0], X[1] = Z[1] + A[1], X[2] = Z[2] + A[2], X;
  }
  function p(v, A, z, q) {
    const X = q ?? new o(3), G = [], Z = [];
    return G[0] = v[0] - A[0], G[1] = v[1] - A[1], G[2] = v[2] - A[2], Z[0] = G[0] * Math.cos(z) - G[1] * Math.sin(z), Z[1] = G[0] * Math.sin(z) + G[1] * Math.cos(z), Z[2] = G[2], X[0] = Z[0] + A[0], X[1] = Z[1] + A[1], X[2] = Z[2] + A[2], X;
  }
  function L(v, A, z) {
    const q = z ?? new o(3);
    return pt(v, q), S(q, A, q);
  }
  function b(v, A, z) {
    const q = z ?? new o(3);
    return $(v) > A ? L(v, A, q) : vt(v, q);
  }
  function T(v, A, z) {
    const q = z ?? new o(3);
    return g(v, A, 0.5, q);
  }
  return {
    create: e,
    fromValues: n,
    set: s,
    ceil: i,
    floor: r,
    round: c,
    clamp: a,
    add: l,
    addScaled: h,
    angle: u,
    subtract: f,
    sub: d,
    equalsApproximately: y,
    equals: x,
    lerp: g,
    lerpV: w,
    max: M,
    min: P,
    mulScalar: S,
    scale: k,
    divScalar: O,
    inverse: R,
    invert: F,
    cross: Y,
    dot: N,
    length: $,
    len: W,
    lengthSq: Q,
    lenSq: ct,
    distance: K,
    dist: j,
    distanceSq: V,
    distSq: at,
    normalize: pt,
    negate: Et,
    copy: vt,
    clone: kt,
    multiply: Rt,
    mul: zt,
    divide: Ht,
    div: Vt,
    random: Ut,
    zero: U,
    transformMat4: J,
    transformMat4Upper3x3: D,
    transformMat3: m,
    transformQuat: E,
    getTranslation: _,
    getAxis: I,
    getScaling: C,
    rotateX: H,
    rotateY: B,
    rotateZ: p,
    setLength: L,
    truncate: b,
    midpoint: T
  };
}
const nc = /* @__PURE__ */ new Map();
function ki(o) {
  let e = nc.get(o);
  return e || (e = hu(o), nc.set(o, e)), e;
}
function uu(o) {
  const e = Ta(o), n = ki(o);
  function s(m, E, _, I, C, H, B, p, L) {
    const b = new o(12);
    return b[3] = 0, b[7] = 0, b[11] = 0, m !== void 0 && (b[0] = m, E !== void 0 && (b[1] = E, _ !== void 0 && (b[2] = _, I !== void 0 && (b[4] = I, C !== void 0 && (b[5] = C, H !== void 0 && (b[6] = H, B !== void 0 && (b[8] = B, p !== void 0 && (b[9] = p, L !== void 0 && (b[10] = L))))))))), b;
  }
  function i(m, E, _, I, C, H, B, p, L, b) {
    const T = b ?? new o(12);
    return T[0] = m, T[1] = E, T[2] = _, T[3] = 0, T[4] = I, T[5] = C, T[6] = H, T[7] = 0, T[8] = B, T[9] = p, T[10] = L, T[11] = 0, T;
  }
  function r(m, E) {
    const _ = E ?? new o(12);
    return _[0] = m[0], _[1] = m[1], _[2] = m[2], _[3] = 0, _[4] = m[4], _[5] = m[5], _[6] = m[6], _[7] = 0, _[8] = m[8], _[9] = m[9], _[10] = m[10], _[11] = 0, _;
  }
  function c(m, E) {
    const _ = E ?? new o(12), I = m[0], C = m[1], H = m[2], B = m[3], p = I + I, L = C + C, b = H + H, T = I * p, v = C * p, A = C * L, z = H * p, q = H * L, X = H * b, G = B * p, Z = B * L, lt = B * b;
    return _[0] = 1 - A - X, _[1] = v + lt, _[2] = z - Z, _[3] = 0, _[4] = v - lt, _[5] = 1 - T - X, _[6] = q + G, _[7] = 0, _[8] = z + Z, _[9] = q - G, _[10] = 1 - T - A, _[11] = 0, _;
  }
  function a(m, E) {
    const _ = E ?? new o(12);
    return _[0] = -m[0], _[1] = -m[1], _[2] = -m[2], _[4] = -m[4], _[5] = -m[5], _[6] = -m[6], _[8] = -m[8], _[9] = -m[9], _[10] = -m[10], _;
  }
  function l(m, E, _) {
    const I = _ ?? new o(12);
    return I[0] = m[0] * E, I[1] = m[1] * E, I[2] = m[2] * E, I[4] = m[4] * E, I[5] = m[5] * E, I[6] = m[6] * E, I[8] = m[8] * E, I[9] = m[9] * E, I[10] = m[10] * E, I;
  }
  const h = l;
  function u(m, E, _) {
    const I = _ ?? new o(12);
    return I[0] = m[0] + E[0], I[1] = m[1] + E[1], I[2] = m[2] + E[2], I[4] = m[4] + E[4], I[5] = m[5] + E[5], I[6] = m[6] + E[6], I[8] = m[8] + E[8], I[9] = m[9] + E[9], I[10] = m[10] + E[10], I;
  }
  function f(m, E) {
    const _ = E ?? new o(12);
    return _[0] = m[0], _[1] = m[1], _[2] = m[2], _[4] = m[4], _[5] = m[5], _[6] = m[6], _[8] = m[8], _[9] = m[9], _[10] = m[10], _;
  }
  const d = f;
  function y(m, E) {
    return Math.abs(m[0] - E[0]) < Tt && Math.abs(m[1] - E[1]) < Tt && Math.abs(m[2] - E[2]) < Tt && Math.abs(m[4] - E[4]) < Tt && Math.abs(m[5] - E[5]) < Tt && Math.abs(m[6] - E[6]) < Tt && Math.abs(m[8] - E[8]) < Tt && Math.abs(m[9] - E[9]) < Tt && Math.abs(m[10] - E[10]) < Tt;
  }
  function x(m, E) {
    return m[0] === E[0] && m[1] === E[1] && m[2] === E[2] && m[4] === E[4] && m[5] === E[5] && m[6] === E[6] && m[8] === E[8] && m[9] === E[9] && m[10] === E[10];
  }
  function g(m) {
    const E = m ?? new o(12);
    return E[0] = 1, E[1] = 0, E[2] = 0, E[4] = 0, E[5] = 1, E[6] = 0, E[8] = 0, E[9] = 0, E[10] = 1, E;
  }
  function w(m, E) {
    const _ = E ?? new o(12);
    if (_ === m) {
      let A;
      return A = m[1], m[1] = m[4], m[4] = A, A = m[2], m[2] = m[8], m[8] = A, A = m[6], m[6] = m[9], m[9] = A, _;
    }
    const I = m[0], C = m[1], H = m[2], B = m[4], p = m[5], L = m[6], b = m[8], T = m[9], v = m[10];
    return _[0] = I, _[1] = B, _[2] = b, _[4] = C, _[5] = p, _[6] = T, _[8] = H, _[9] = L, _[10] = v, _;
  }
  function M(m, E) {
    const _ = E ?? new o(12), I = m[0], C = m[1], H = m[2], B = m[4], p = m[5], L = m[6], b = m[8], T = m[9], v = m[10], A = v * p - L * T, z = -v * B + L * b, q = T * B - p * b, X = 1 / (I * A + C * z + H * q);
    return _[0] = A * X, _[1] = (-v * C + H * T) * X, _[2] = (L * C - H * p) * X, _[4] = z * X, _[5] = (v * I - H * b) * X, _[6] = (-L * I + H * B) * X, _[8] = q * X, _[9] = (-T * I + C * b) * X, _[10] = (p * I - C * B) * X, _;
  }
  function P(m) {
    const E = m[0], _ = m[1], I = m[2], C = m[4], H = m[5], B = m[6], p = m[8], L = m[9], b = m[10];
    return E * (H * b - L * B) - C * (_ * b - L * I) + p * (_ * B - H * I);
  }
  const S = M;
  function k(m, E, _) {
    const I = _ ?? new o(12), C = m[0], H = m[1], B = m[2], p = m[4], L = m[5], b = m[6], T = m[8], v = m[9], A = m[10], z = E[0], q = E[1], X = E[2], G = E[4], Z = E[5], lt = E[6], it = E[8], rt = E[9], yt = E[10];
    return I[0] = C * z + p * q + T * X, I[1] = H * z + L * q + v * X, I[2] = B * z + b * q + A * X, I[4] = C * G + p * Z + T * lt, I[5] = H * G + L * Z + v * lt, I[6] = B * G + b * Z + A * lt, I[8] = C * it + p * rt + T * yt, I[9] = H * it + L * rt + v * yt, I[10] = B * it + b * rt + A * yt, I;
  }
  const O = k;
  function R(m, E, _) {
    const I = _ ?? g();
    return m !== I && (I[0] = m[0], I[1] = m[1], I[2] = m[2], I[4] = m[4], I[5] = m[5], I[6] = m[6]), I[8] = E[0], I[9] = E[1], I[10] = 1, I;
  }
  function F(m, E) {
    const _ = E ?? e.create();
    return _[0] = m[8], _[1] = m[9], _;
  }
  function Y(m, E, _) {
    const I = _ ?? e.create(), C = E * 4;
    return I[0] = m[C + 0], I[1] = m[C + 1], I;
  }
  function N(m, E, _, I) {
    const C = I === m ? m : f(m, I), H = _ * 4;
    return C[H + 0] = E[0], C[H + 1] = E[1], C;
  }
  function $(m, E) {
    const _ = E ?? e.create(), I = m[0], C = m[1], H = m[4], B = m[5];
    return _[0] = Math.sqrt(I * I + C * C), _[1] = Math.sqrt(H * H + B * B), _;
  }
  function W(m, E) {
    const _ = E ?? n.create(), I = m[0], C = m[1], H = m[2], B = m[4], p = m[5], L = m[6], b = m[8], T = m[9], v = m[10];
    return _[0] = Math.sqrt(I * I + C * C + H * H), _[1] = Math.sqrt(B * B + p * p + L * L), _[2] = Math.sqrt(b * b + T * T + v * v), _;
  }
  function Q(m, E) {
    const _ = E ?? new o(12);
    return _[0] = 1, _[1] = 0, _[2] = 0, _[4] = 0, _[5] = 1, _[6] = 0, _[8] = m[0], _[9] = m[1], _[10] = 1, _;
  }
  function ct(m, E, _) {
    const I = _ ?? new o(12), C = E[0], H = E[1], B = m[0], p = m[1], L = m[2], b = m[4], T = m[5], v = m[6], A = m[8], z = m[9], q = m[10];
    return m !== I && (I[0] = B, I[1] = p, I[2] = L, I[4] = b, I[5] = T, I[6] = v), I[8] = B * C + b * H + A, I[9] = p * C + T * H + z, I[10] = L * C + v * H + q, I;
  }
  function K(m, E) {
    const _ = E ?? new o(12), I = Math.cos(m), C = Math.sin(m);
    return _[0] = I, _[1] = C, _[2] = 0, _[4] = -C, _[5] = I, _[6] = 0, _[8] = 0, _[9] = 0, _[10] = 1, _;
  }
  function j(m, E, _) {
    const I = _ ?? new o(12), C = m[0], H = m[1], B = m[2], p = m[4], L = m[5], b = m[6], T = Math.cos(E), v = Math.sin(E);
    return I[0] = T * C + v * p, I[1] = T * H + v * L, I[2] = T * B + v * b, I[4] = T * p - v * C, I[5] = T * L - v * H, I[6] = T * b - v * B, m !== I && (I[8] = m[8], I[9] = m[9], I[10] = m[10]), I;
  }
  function V(m, E) {
    const _ = E ?? new o(12), I = Math.cos(m), C = Math.sin(m);
    return _[0] = 1, _[1] = 0, _[2] = 0, _[4] = 0, _[5] = I, _[6] = C, _[8] = 0, _[9] = -C, _[10] = I, _;
  }
  function at(m, E, _) {
    const I = _ ?? new o(12), C = m[4], H = m[5], B = m[6], p = m[8], L = m[9], b = m[10], T = Math.cos(E), v = Math.sin(E);
    return I[4] = T * C + v * p, I[5] = T * H + v * L, I[6] = T * B + v * b, I[8] = T * p - v * C, I[9] = T * L - v * H, I[10] = T * b - v * B, m !== I && (I[0] = m[0], I[1] = m[1], I[2] = m[2]), I;
  }
  function pt(m, E) {
    const _ = E ?? new o(12), I = Math.cos(m), C = Math.sin(m);
    return _[0] = I, _[1] = 0, _[2] = -C, _[4] = 0, _[5] = 1, _[6] = 0, _[8] = C, _[9] = 0, _[10] = I, _;
  }
  function Et(m, E, _) {
    const I = _ ?? new o(12), C = m[0], H = m[1], B = m[2], p = m[8], L = m[9], b = m[10], T = Math.cos(E), v = Math.sin(E);
    return I[0] = T * C - v * p, I[1] = T * H - v * L, I[2] = T * B - v * b, I[8] = T * p + v * C, I[9] = T * L + v * H, I[10] = T * b + v * B, m !== I && (I[4] = m[4], I[5] = m[5], I[6] = m[6]), I;
  }
  const vt = K, kt = j;
  function Rt(m, E) {
    const _ = E ?? new o(12);
    return _[0] = m[0], _[1] = 0, _[2] = 0, _[4] = 0, _[5] = m[1], _[6] = 0, _[8] = 0, _[9] = 0, _[10] = 1, _;
  }
  function zt(m, E, _) {
    const I = _ ?? new o(12), C = E[0], H = E[1];
    return I[0] = C * m[0], I[1] = C * m[1], I[2] = C * m[2], I[4] = H * m[4], I[5] = H * m[5], I[6] = H * m[6], m !== I && (I[8] = m[8], I[9] = m[9], I[10] = m[10]), I;
  }
  function Ht(m, E) {
    const _ = E ?? new o(12);
    return _[0] = m[0], _[1] = 0, _[2] = 0, _[4] = 0, _[5] = m[1], _[6] = 0, _[8] = 0, _[9] = 0, _[10] = m[2], _;
  }
  function Vt(m, E, _) {
    const I = _ ?? new o(12), C = E[0], H = E[1], B = E[2];
    return I[0] = C * m[0], I[1] = C * m[1], I[2] = C * m[2], I[4] = H * m[4], I[5] = H * m[5], I[6] = H * m[6], I[8] = B * m[8], I[9] = B * m[9], I[10] = B * m[10], I;
  }
  function Ut(m, E) {
    const _ = E ?? new o(12);
    return _[0] = m, _[1] = 0, _[2] = 0, _[4] = 0, _[5] = m, _[6] = 0, _[8] = 0, _[9] = 0, _[10] = 1, _;
  }
  function U(m, E, _) {
    const I = _ ?? new o(12);
    return I[0] = E * m[0], I[1] = E * m[1], I[2] = E * m[2], I[4] = E * m[4], I[5] = E * m[5], I[6] = E * m[6], m !== I && (I[8] = m[8], I[9] = m[9], I[10] = m[10]), I;
  }
  function J(m, E) {
    const _ = E ?? new o(12);
    return _[0] = m, _[1] = 0, _[2] = 0, _[4] = 0, _[5] = m, _[6] = 0, _[8] = 0, _[9] = 0, _[10] = m, _;
  }
  function D(m, E, _) {
    const I = _ ?? new o(12);
    return I[0] = E * m[0], I[1] = E * m[1], I[2] = E * m[2], I[4] = E * m[4], I[5] = E * m[5], I[6] = E * m[6], I[8] = E * m[8], I[9] = E * m[9], I[10] = E * m[10], I;
  }
  return {
    add: u,
    clone: d,
    copy: f,
    create: s,
    determinant: P,
    equals: x,
    equalsApproximately: y,
    fromMat4: r,
    fromQuat: c,
    get3DScaling: W,
    getAxis: Y,
    getScaling: $,
    getTranslation: F,
    identity: g,
    inverse: M,
    invert: S,
    mul: O,
    mulScalar: h,
    multiply: k,
    multiplyScalar: l,
    negate: a,
    rotate: j,
    rotateX: at,
    rotateY: Et,
    rotateZ: kt,
    rotation: K,
    rotationX: V,
    rotationY: pt,
    rotationZ: vt,
    scale: zt,
    scale3D: Vt,
    scaling: Rt,
    scaling3D: Ht,
    set: i,
    setAxis: N,
    setTranslation: R,
    translate: ct,
    translation: Q,
    transpose: w,
    uniformScale: U,
    uniformScale3D: D,
    uniformScaling: Ut,
    uniformScaling3D: J
  };
}
const sc = /* @__PURE__ */ new Map();
function fu(o) {
  let e = sc.get(o);
  return e || (e = uu(o), sc.set(o, e)), e;
}
function du(o) {
  const e = ki(o);
  function n(p, L, b, T, v, A, z, q, X, G, Z, lt, it, rt, yt, Mt) {
    const xt = new o(16);
    return p !== void 0 && (xt[0] = p, L !== void 0 && (xt[1] = L, b !== void 0 && (xt[2] = b, T !== void 0 && (xt[3] = T, v !== void 0 && (xt[4] = v, A !== void 0 && (xt[5] = A, z !== void 0 && (xt[6] = z, q !== void 0 && (xt[7] = q, X !== void 0 && (xt[8] = X, G !== void 0 && (xt[9] = G, Z !== void 0 && (xt[10] = Z, lt !== void 0 && (xt[11] = lt, it !== void 0 && (xt[12] = it, rt !== void 0 && (xt[13] = rt, yt !== void 0 && (xt[14] = yt, Mt !== void 0 && (xt[15] = Mt)))))))))))))))), xt;
  }
  function s(p, L, b, T, v, A, z, q, X, G, Z, lt, it, rt, yt, Mt, xt) {
    const mt = xt ?? new o(16);
    return mt[0] = p, mt[1] = L, mt[2] = b, mt[3] = T, mt[4] = v, mt[5] = A, mt[6] = z, mt[7] = q, mt[8] = X, mt[9] = G, mt[10] = Z, mt[11] = lt, mt[12] = it, mt[13] = rt, mt[14] = yt, mt[15] = Mt, mt;
  }
  function i(p, L) {
    const b = L ?? new o(16);
    return b[0] = p[0], b[1] = p[1], b[2] = p[2], b[3] = 0, b[4] = p[4], b[5] = p[5], b[6] = p[6], b[7] = 0, b[8] = p[8], b[9] = p[9], b[10] = p[10], b[11] = 0, b[12] = 0, b[13] = 0, b[14] = 0, b[15] = 1, b;
  }
  function r(p, L) {
    const b = L ?? new o(16), T = p[0], v = p[1], A = p[2], z = p[3], q = T + T, X = v + v, G = A + A, Z = T * q, lt = v * q, it = v * X, rt = A * q, yt = A * X, Mt = A * G, xt = z * q, mt = z * X, Ot = z * G;
    return b[0] = 1 - it - Mt, b[1] = lt + Ot, b[2] = rt - mt, b[3] = 0, b[4] = lt - Ot, b[5] = 1 - Z - Mt, b[6] = yt + xt, b[7] = 0, b[8] = rt + mt, b[9] = yt - xt, b[10] = 1 - Z - it, b[11] = 0, b[12] = 0, b[13] = 0, b[14] = 0, b[15] = 1, b;
  }
  function c(p, L) {
    const b = L ?? new o(16);
    return b[0] = -p[0], b[1] = -p[1], b[2] = -p[2], b[3] = -p[3], b[4] = -p[4], b[5] = -p[5], b[6] = -p[6], b[7] = -p[7], b[8] = -p[8], b[9] = -p[9], b[10] = -p[10], b[11] = -p[11], b[12] = -p[12], b[13] = -p[13], b[14] = -p[14], b[15] = -p[15], b;
  }
  function a(p, L, b) {
    const T = b ?? new o(16);
    return T[0] = p[0] + L[0], T[1] = p[1] + L[1], T[2] = p[2] + L[2], T[3] = p[3] + L[3], T[4] = p[4] + L[4], T[5] = p[5] + L[5], T[6] = p[6] + L[6], T[7] = p[7] + L[7], T[8] = p[8] + L[8], T[9] = p[9] + L[9], T[10] = p[10] + L[10], T[11] = p[11] + L[11], T[12] = p[12] + L[12], T[13] = p[13] + L[13], T[14] = p[14] + L[14], T[15] = p[15] + L[15], T;
  }
  function l(p, L, b) {
    const T = b ?? new o(16);
    return T[0] = p[0] * L, T[1] = p[1] * L, T[2] = p[2] * L, T[3] = p[3] * L, T[4] = p[4] * L, T[5] = p[5] * L, T[6] = p[6] * L, T[7] = p[7] * L, T[8] = p[8] * L, T[9] = p[9] * L, T[10] = p[10] * L, T[11] = p[11] * L, T[12] = p[12] * L, T[13] = p[13] * L, T[14] = p[14] * L, T[15] = p[15] * L, T;
  }
  const h = l;
  function u(p, L) {
    const b = L ?? new o(16);
    return b[0] = p[0], b[1] = p[1], b[2] = p[2], b[3] = p[3], b[4] = p[4], b[5] = p[5], b[6] = p[6], b[7] = p[7], b[8] = p[8], b[9] = p[9], b[10] = p[10], b[11] = p[11], b[12] = p[12], b[13] = p[13], b[14] = p[14], b[15] = p[15], b;
  }
  const f = u;
  function d(p, L) {
    return Math.abs(p[0] - L[0]) < Tt && Math.abs(p[1] - L[1]) < Tt && Math.abs(p[2] - L[2]) < Tt && Math.abs(p[3] - L[3]) < Tt && Math.abs(p[4] - L[4]) < Tt && Math.abs(p[5] - L[5]) < Tt && Math.abs(p[6] - L[6]) < Tt && Math.abs(p[7] - L[7]) < Tt && Math.abs(p[8] - L[8]) < Tt && Math.abs(p[9] - L[9]) < Tt && Math.abs(p[10] - L[10]) < Tt && Math.abs(p[11] - L[11]) < Tt && Math.abs(p[12] - L[12]) < Tt && Math.abs(p[13] - L[13]) < Tt && Math.abs(p[14] - L[14]) < Tt && Math.abs(p[15] - L[15]) < Tt;
  }
  function y(p, L) {
    return p[0] === L[0] && p[1] === L[1] && p[2] === L[2] && p[3] === L[3] && p[4] === L[4] && p[5] === L[5] && p[6] === L[6] && p[7] === L[7] && p[8] === L[8] && p[9] === L[9] && p[10] === L[10] && p[11] === L[11] && p[12] === L[12] && p[13] === L[13] && p[14] === L[14] && p[15] === L[15];
  }
  function x(p) {
    const L = p ?? new o(16);
    return L[0] = 1, L[1] = 0, L[2] = 0, L[3] = 0, L[4] = 0, L[5] = 1, L[6] = 0, L[7] = 0, L[8] = 0, L[9] = 0, L[10] = 1, L[11] = 0, L[12] = 0, L[13] = 0, L[14] = 0, L[15] = 1, L;
  }
  function g(p, L) {
    const b = L ?? new o(16);
    if (b === p) {
      let qt;
      return qt = p[1], p[1] = p[4], p[4] = qt, qt = p[2], p[2] = p[8], p[8] = qt, qt = p[3], p[3] = p[12], p[12] = qt, qt = p[6], p[6] = p[9], p[9] = qt, qt = p[7], p[7] = p[13], p[13] = qt, qt = p[11], p[11] = p[14], p[14] = qt, b;
    }
    const T = p[0], v = p[1], A = p[2], z = p[3], q = p[4], X = p[5], G = p[6], Z = p[7], lt = p[8], it = p[9], rt = p[10], yt = p[11], Mt = p[12], xt = p[13], mt = p[14], Ot = p[15];
    return b[0] = T, b[1] = q, b[2] = lt, b[3] = Mt, b[4] = v, b[5] = X, b[6] = it, b[7] = xt, b[8] = A, b[9] = G, b[10] = rt, b[11] = mt, b[12] = z, b[13] = Z, b[14] = yt, b[15] = Ot, b;
  }
  function w(p, L) {
    const b = L ?? new o(16), T = p[0], v = p[1], A = p[2], z = p[3], q = p[4], X = p[5], G = p[6], Z = p[7], lt = p[8], it = p[9], rt = p[10], yt = p[11], Mt = p[12], xt = p[13], mt = p[14], Ot = p[15], qt = rt * Ot, Zt = mt * yt, Jt = G * Ot, Qt = mt * Z, ee = G * yt, ie = rt * Z, re = A * Ot, oe = mt * z, ce = A * yt, ae = rt * z, de = A * Z, ye = G * z, xe = lt * xt, pe = Mt * it, ve = q * xt, Me = Mt * X, be = q * it, Vs = lt * X, Us = T * xt, Xs = Mt * v, Ws = T * it, $s = lt * v, js = T * X, Gs = q * v, Kr = qt * X + Qt * it + ee * xt - (Zt * X + Jt * it + ie * xt), to = Zt * v + re * it + ae * xt - (qt * v + oe * it + ce * xt), eo = Jt * v + oe * X + de * xt - (Qt * v + re * X + ye * xt), no = ie * v + ce * X + ye * it - (ee * v + ae * X + de * it), le = 1 / (T * Kr + q * to + lt * eo + Mt * no);
    return b[0] = le * Kr, b[1] = le * to, b[2] = le * eo, b[3] = le * no, b[4] = le * (Zt * q + Jt * lt + ie * Mt - (qt * q + Qt * lt + ee * Mt)), b[5] = le * (qt * T + oe * lt + ce * Mt - (Zt * T + re * lt + ae * Mt)), b[6] = le * (Qt * T + re * q + ye * Mt - (Jt * T + oe * q + de * Mt)), b[7] = le * (ee * T + ae * q + de * lt - (ie * T + ce * q + ye * lt)), b[8] = le * (xe * Z + Me * yt + be * Ot - (pe * Z + ve * yt + Vs * Ot)), b[9] = le * (pe * z + Us * yt + $s * Ot - (xe * z + Xs * yt + Ws * Ot)), b[10] = le * (ve * z + Xs * Z + js * Ot - (Me * z + Us * Z + Gs * Ot)), b[11] = le * (Vs * z + Ws * Z + Gs * yt - (be * z + $s * Z + js * yt)), b[12] = le * (ve * rt + Vs * mt + pe * G - (be * mt + xe * G + Me * rt)), b[13] = le * (Ws * mt + xe * A + Xs * rt - (Us * rt + $s * mt + pe * A)), b[14] = le * (Us * G + Gs * mt + Me * A - (js * mt + ve * A + Xs * G)), b[15] = le * (js * rt + be * A + $s * G - (Ws * G + Gs * rt + Vs * A)), b;
  }
  function M(p) {
    const L = p[0], b = p[1], T = p[2], v = p[3], A = p[4], z = p[5], q = p[6], X = p[7], G = p[8], Z = p[9], lt = p[10], it = p[11], rt = p[12], yt = p[13], Mt = p[14], xt = p[15], mt = lt * xt, Ot = Mt * it, qt = q * xt, Zt = Mt * X, Jt = q * it, Qt = lt * X, ee = T * xt, ie = Mt * v, re = T * it, oe = lt * v, ce = T * X, ae = q * v, de = mt * z + Zt * Z + Jt * yt - (Ot * z + qt * Z + Qt * yt), ye = Ot * b + ee * Z + oe * yt - (mt * b + ie * Z + re * yt), xe = qt * b + ie * z + ce * yt - (Zt * b + ee * z + ae * yt), pe = Qt * b + re * z + ae * Z - (Jt * b + oe * z + ce * Z);
    return L * de + A * ye + G * xe + rt * pe;
  }
  const P = w;
  function S(p, L, b) {
    const T = b ?? new o(16), v = p[0], A = p[1], z = p[2], q = p[3], X = p[4], G = p[5], Z = p[6], lt = p[7], it = p[8], rt = p[9], yt = p[10], Mt = p[11], xt = p[12], mt = p[13], Ot = p[14], qt = p[15], Zt = L[0], Jt = L[1], Qt = L[2], ee = L[3], ie = L[4], re = L[5], oe = L[6], ce = L[7], ae = L[8], de = L[9], ye = L[10], xe = L[11], pe = L[12], ve = L[13], Me = L[14], be = L[15];
    return T[0] = v * Zt + X * Jt + it * Qt + xt * ee, T[1] = A * Zt + G * Jt + rt * Qt + mt * ee, T[2] = z * Zt + Z * Jt + yt * Qt + Ot * ee, T[3] = q * Zt + lt * Jt + Mt * Qt + qt * ee, T[4] = v * ie + X * re + it * oe + xt * ce, T[5] = A * ie + G * re + rt * oe + mt * ce, T[6] = z * ie + Z * re + yt * oe + Ot * ce, T[7] = q * ie + lt * re + Mt * oe + qt * ce, T[8] = v * ae + X * de + it * ye + xt * xe, T[9] = A * ae + G * de + rt * ye + mt * xe, T[10] = z * ae + Z * de + yt * ye + Ot * xe, T[11] = q * ae + lt * de + Mt * ye + qt * xe, T[12] = v * pe + X * ve + it * Me + xt * be, T[13] = A * pe + G * ve + rt * Me + mt * be, T[14] = z * pe + Z * ve + yt * Me + Ot * be, T[15] = q * pe + lt * ve + Mt * Me + qt * be, T;
  }
  const k = S;
  function O(p, L, b) {
    const T = b ?? x();
    return p !== T && (T[0] = p[0], T[1] = p[1], T[2] = p[2], T[3] = p[3], T[4] = p[4], T[5] = p[5], T[6] = p[6], T[7] = p[7], T[8] = p[8], T[9] = p[9], T[10] = p[10], T[11] = p[11]), T[12] = L[0], T[13] = L[1], T[14] = L[2], T[15] = 1, T;
  }
  function R(p, L) {
    const b = L ?? e.create();
    return b[0] = p[12], b[1] = p[13], b[2] = p[14], b;
  }
  function F(p, L, b) {
    const T = b ?? e.create(), v = L * 4;
    return T[0] = p[v + 0], T[1] = p[v + 1], T[2] = p[v + 2], T;
  }
  function Y(p, L, b, T) {
    const v = T === p ? T : u(p, T), A = b * 4;
    return v[A + 0] = L[0], v[A + 1] = L[1], v[A + 2] = L[2], v;
  }
  function N(p, L) {
    const b = L ?? e.create(), T = p[0], v = p[1], A = p[2], z = p[4], q = p[5], X = p[6], G = p[8], Z = p[9], lt = p[10];
    return b[0] = Math.sqrt(T * T + v * v + A * A), b[1] = Math.sqrt(z * z + q * q + X * X), b[2] = Math.sqrt(G * G + Z * Z + lt * lt), b;
  }
  function $(p, L, b, T, v) {
    const A = v ?? new o(16), z = Math.tan(Math.PI * 0.5 - 0.5 * p);
    if (A[0] = z / L, A[1] = 0, A[2] = 0, A[3] = 0, A[4] = 0, A[5] = z, A[6] = 0, A[7] = 0, A[8] = 0, A[9] = 0, A[11] = -1, A[12] = 0, A[13] = 0, A[15] = 0, Number.isFinite(T)) {
      const q = 1 / (b - T);
      A[10] = T * q, A[14] = T * b * q;
    } else
      A[10] = -1, A[14] = -b;
    return A;
  }
  function W(p, L, b, T = 1 / 0, v) {
    const A = v ?? new o(16), z = 1 / Math.tan(p * 0.5);
    if (A[0] = z / L, A[1] = 0, A[2] = 0, A[3] = 0, A[4] = 0, A[5] = z, A[6] = 0, A[7] = 0, A[8] = 0, A[9] = 0, A[11] = -1, A[12] = 0, A[13] = 0, A[15] = 0, T === 1 / 0)
      A[10] = 0, A[14] = b;
    else {
      const q = 1 / (T - b);
      A[10] = b * q, A[14] = T * b * q;
    }
    return A;
  }
  function Q(p, L, b, T, v, A, z) {
    const q = z ?? new o(16);
    return q[0] = 2 / (L - p), q[1] = 0, q[2] = 0, q[3] = 0, q[4] = 0, q[5] = 2 / (T - b), q[6] = 0, q[7] = 0, q[8] = 0, q[9] = 0, q[10] = 1 / (v - A), q[11] = 0, q[12] = (L + p) / (p - L), q[13] = (T + b) / (b - T), q[14] = v / (v - A), q[15] = 1, q;
  }
  function ct(p, L, b, T, v, A, z) {
    const q = z ?? new o(16), X = L - p, G = T - b, Z = v - A;
    return q[0] = 2 * v / X, q[1] = 0, q[2] = 0, q[3] = 0, q[4] = 0, q[5] = 2 * v / G, q[6] = 0, q[7] = 0, q[8] = (p + L) / X, q[9] = (T + b) / G, q[10] = A / Z, q[11] = -1, q[12] = 0, q[13] = 0, q[14] = v * A / Z, q[15] = 0, q;
  }
  function K(p, L, b, T, v, A = 1 / 0, z) {
    const q = z ?? new o(16), X = L - p, G = T - b;
    if (q[0] = 2 * v / X, q[1] = 0, q[2] = 0, q[3] = 0, q[4] = 0, q[5] = 2 * v / G, q[6] = 0, q[7] = 0, q[8] = (p + L) / X, q[9] = (T + b) / G, q[11] = -1, q[12] = 0, q[13] = 0, q[15] = 0, A === 1 / 0)
      q[10] = 0, q[14] = v;
    else {
      const Z = 1 / (A - v);
      q[10] = v * Z, q[14] = A * v * Z;
    }
    return q;
  }
  const j = e.create(), V = e.create(), at = e.create();
  function pt(p, L, b, T) {
    const v = T ?? new o(16);
    return e.normalize(e.subtract(L, p, at), at), e.normalize(e.cross(b, at, j), j), e.normalize(e.cross(at, j, V), V), v[0] = j[0], v[1] = j[1], v[2] = j[2], v[3] = 0, v[4] = V[0], v[5] = V[1], v[6] = V[2], v[7] = 0, v[8] = at[0], v[9] = at[1], v[10] = at[2], v[11] = 0, v[12] = p[0], v[13] = p[1], v[14] = p[2], v[15] = 1, v;
  }
  function Et(p, L, b, T) {
    const v = T ?? new o(16);
    return e.normalize(e.subtract(p, L, at), at), e.normalize(e.cross(b, at, j), j), e.normalize(e.cross(at, j, V), V), v[0] = j[0], v[1] = j[1], v[2] = j[2], v[3] = 0, v[4] = V[0], v[5] = V[1], v[6] = V[2], v[7] = 0, v[8] = at[0], v[9] = at[1], v[10] = at[2], v[11] = 0, v[12] = p[0], v[13] = p[1], v[14] = p[2], v[15] = 1, v;
  }
  function vt(p, L, b, T) {
    const v = T ?? new o(16);
    return e.normalize(e.subtract(p, L, at), at), e.normalize(e.cross(b, at, j), j), e.normalize(e.cross(at, j, V), V), v[0] = j[0], v[1] = V[0], v[2] = at[0], v[3] = 0, v[4] = j[1], v[5] = V[1], v[6] = at[1], v[7] = 0, v[8] = j[2], v[9] = V[2], v[10] = at[2], v[11] = 0, v[12] = -(j[0] * p[0] + j[1] * p[1] + j[2] * p[2]), v[13] = -(V[0] * p[0] + V[1] * p[1] + V[2] * p[2]), v[14] = -(at[0] * p[0] + at[1] * p[1] + at[2] * p[2]), v[15] = 1, v;
  }
  function kt(p, L) {
    const b = L ?? new o(16);
    return b[0] = 1, b[1] = 0, b[2] = 0, b[3] = 0, b[4] = 0, b[5] = 1, b[6] = 0, b[7] = 0, b[8] = 0, b[9] = 0, b[10] = 1, b[11] = 0, b[12] = p[0], b[13] = p[1], b[14] = p[2], b[15] = 1, b;
  }
  function Rt(p, L, b) {
    const T = b ?? new o(16), v = L[0], A = L[1], z = L[2], q = p[0], X = p[1], G = p[2], Z = p[3], lt = p[4], it = p[5], rt = p[6], yt = p[7], Mt = p[8], xt = p[9], mt = p[10], Ot = p[11], qt = p[12], Zt = p[13], Jt = p[14], Qt = p[15];
    return p !== T && (T[0] = q, T[1] = X, T[2] = G, T[3] = Z, T[4] = lt, T[5] = it, T[6] = rt, T[7] = yt, T[8] = Mt, T[9] = xt, T[10] = mt, T[11] = Ot), T[12] = q * v + lt * A + Mt * z + qt, T[13] = X * v + it * A + xt * z + Zt, T[14] = G * v + rt * A + mt * z + Jt, T[15] = Z * v + yt * A + Ot * z + Qt, T;
  }
  function zt(p, L) {
    const b = L ?? new o(16), T = Math.cos(p), v = Math.sin(p);
    return b[0] = 1, b[1] = 0, b[2] = 0, b[3] = 0, b[4] = 0, b[5] = T, b[6] = v, b[7] = 0, b[8] = 0, b[9] = -v, b[10] = T, b[11] = 0, b[12] = 0, b[13] = 0, b[14] = 0, b[15] = 1, b;
  }
  function Ht(p, L, b) {
    const T = b ?? new o(16), v = p[4], A = p[5], z = p[6], q = p[7], X = p[8], G = p[9], Z = p[10], lt = p[11], it = Math.cos(L), rt = Math.sin(L);
    return T[4] = it * v + rt * X, T[5] = it * A + rt * G, T[6] = it * z + rt * Z, T[7] = it * q + rt * lt, T[8] = it * X - rt * v, T[9] = it * G - rt * A, T[10] = it * Z - rt * z, T[11] = it * lt - rt * q, p !== T && (T[0] = p[0], T[1] = p[1], T[2] = p[2], T[3] = p[3], T[12] = p[12], T[13] = p[13], T[14] = p[14], T[15] = p[15]), T;
  }
  function Vt(p, L) {
    const b = L ?? new o(16), T = Math.cos(p), v = Math.sin(p);
    return b[0] = T, b[1] = 0, b[2] = -v, b[3] = 0, b[4] = 0, b[5] = 1, b[6] = 0, b[7] = 0, b[8] = v, b[9] = 0, b[10] = T, b[11] = 0, b[12] = 0, b[13] = 0, b[14] = 0, b[15] = 1, b;
  }
  function Ut(p, L, b) {
    const T = b ?? new o(16), v = p[0], A = p[1], z = p[2], q = p[3], X = p[8], G = p[9], Z = p[10], lt = p[11], it = Math.cos(L), rt = Math.sin(L);
    return T[0] = it * v - rt * X, T[1] = it * A - rt * G, T[2] = it * z - rt * Z, T[3] = it * q - rt * lt, T[8] = it * X + rt * v, T[9] = it * G + rt * A, T[10] = it * Z + rt * z, T[11] = it * lt + rt * q, p !== T && (T[4] = p[4], T[5] = p[5], T[6] = p[6], T[7] = p[7], T[12] = p[12], T[13] = p[13], T[14] = p[14], T[15] = p[15]), T;
  }
  function U(p, L) {
    const b = L ?? new o(16), T = Math.cos(p), v = Math.sin(p);
    return b[0] = T, b[1] = v, b[2] = 0, b[3] = 0, b[4] = -v, b[5] = T, b[6] = 0, b[7] = 0, b[8] = 0, b[9] = 0, b[10] = 1, b[11] = 0, b[12] = 0, b[13] = 0, b[14] = 0, b[15] = 1, b;
  }
  function J(p, L, b) {
    const T = b ?? new o(16), v = p[0], A = p[1], z = p[2], q = p[3], X = p[4], G = p[5], Z = p[6], lt = p[7], it = Math.cos(L), rt = Math.sin(L);
    return T[0] = it * v + rt * X, T[1] = it * A + rt * G, T[2] = it * z + rt * Z, T[3] = it * q + rt * lt, T[4] = it * X - rt * v, T[5] = it * G - rt * A, T[6] = it * Z - rt * z, T[7] = it * lt - rt * q, p !== T && (T[8] = p[8], T[9] = p[9], T[10] = p[10], T[11] = p[11], T[12] = p[12], T[13] = p[13], T[14] = p[14], T[15] = p[15]), T;
  }
  function D(p, L, b) {
    const T = b ?? new o(16);
    let v = p[0], A = p[1], z = p[2];
    const q = Math.sqrt(v * v + A * A + z * z);
    v /= q, A /= q, z /= q;
    const X = v * v, G = A * A, Z = z * z, lt = Math.cos(L), it = Math.sin(L), rt = 1 - lt;
    return T[0] = X + (1 - X) * lt, T[1] = v * A * rt + z * it, T[2] = v * z * rt - A * it, T[3] = 0, T[4] = v * A * rt - z * it, T[5] = G + (1 - G) * lt, T[6] = A * z * rt + v * it, T[7] = 0, T[8] = v * z * rt + A * it, T[9] = A * z * rt - v * it, T[10] = Z + (1 - Z) * lt, T[11] = 0, T[12] = 0, T[13] = 0, T[14] = 0, T[15] = 1, T;
  }
  const m = D;
  function E(p, L, b, T) {
    const v = T ?? new o(16);
    let A = L[0], z = L[1], q = L[2];
    const X = Math.sqrt(A * A + z * z + q * q);
    A /= X, z /= X, q /= X;
    const G = A * A, Z = z * z, lt = q * q, it = Math.cos(b), rt = Math.sin(b), yt = 1 - it, Mt = G + (1 - G) * it, xt = A * z * yt + q * rt, mt = A * q * yt - z * rt, Ot = A * z * yt - q * rt, qt = Z + (1 - Z) * it, Zt = z * q * yt + A * rt, Jt = A * q * yt + z * rt, Qt = z * q * yt - A * rt, ee = lt + (1 - lt) * it, ie = p[0], re = p[1], oe = p[2], ce = p[3], ae = p[4], de = p[5], ye = p[6], xe = p[7], pe = p[8], ve = p[9], Me = p[10], be = p[11];
    return v[0] = Mt * ie + xt * ae + mt * pe, v[1] = Mt * re + xt * de + mt * ve, v[2] = Mt * oe + xt * ye + mt * Me, v[3] = Mt * ce + xt * xe + mt * be, v[4] = Ot * ie + qt * ae + Zt * pe, v[5] = Ot * re + qt * de + Zt * ve, v[6] = Ot * oe + qt * ye + Zt * Me, v[7] = Ot * ce + qt * xe + Zt * be, v[8] = Jt * ie + Qt * ae + ee * pe, v[9] = Jt * re + Qt * de + ee * ve, v[10] = Jt * oe + Qt * ye + ee * Me, v[11] = Jt * ce + Qt * xe + ee * be, p !== v && (v[12] = p[12], v[13] = p[13], v[14] = p[14], v[15] = p[15]), v;
  }
  const _ = E;
  function I(p, L) {
    const b = L ?? new o(16);
    return b[0] = p[0], b[1] = 0, b[2] = 0, b[3] = 0, b[4] = 0, b[5] = p[1], b[6] = 0, b[7] = 0, b[8] = 0, b[9] = 0, b[10] = p[2], b[11] = 0, b[12] = 0, b[13] = 0, b[14] = 0, b[15] = 1, b;
  }
  function C(p, L, b) {
    const T = b ?? new o(16), v = L[0], A = L[1], z = L[2];
    return T[0] = v * p[0], T[1] = v * p[1], T[2] = v * p[2], T[3] = v * p[3], T[4] = A * p[4], T[5] = A * p[5], T[6] = A * p[6], T[7] = A * p[7], T[8] = z * p[8], T[9] = z * p[9], T[10] = z * p[10], T[11] = z * p[11], p !== T && (T[12] = p[12], T[13] = p[13], T[14] = p[14], T[15] = p[15]), T;
  }
  function H(p, L) {
    const b = L ?? new o(16);
    return b[0] = p, b[1] = 0, b[2] = 0, b[3] = 0, b[4] = 0, b[5] = p, b[6] = 0, b[7] = 0, b[8] = 0, b[9] = 0, b[10] = p, b[11] = 0, b[12] = 0, b[13] = 0, b[14] = 0, b[15] = 1, b;
  }
  function B(p, L, b) {
    const T = b ?? new o(16);
    return T[0] = L * p[0], T[1] = L * p[1], T[2] = L * p[2], T[3] = L * p[3], T[4] = L * p[4], T[5] = L * p[5], T[6] = L * p[6], T[7] = L * p[7], T[8] = L * p[8], T[9] = L * p[9], T[10] = L * p[10], T[11] = L * p[11], p !== T && (T[12] = p[12], T[13] = p[13], T[14] = p[14], T[15] = p[15]), T;
  }
  return {
    add: a,
    aim: pt,
    axisRotate: E,
    axisRotation: D,
    cameraAim: Et,
    clone: f,
    copy: u,
    create: n,
    determinant: M,
    equals: y,
    equalsApproximately: d,
    fromMat3: i,
    fromQuat: r,
    frustum: ct,
    frustumReverseZ: K,
    getAxis: F,
    getScaling: N,
    getTranslation: R,
    identity: x,
    inverse: w,
    invert: P,
    lookAt: vt,
    mul: k,
    mulScalar: h,
    multiply: S,
    multiplyScalar: l,
    negate: c,
    ortho: Q,
    perspective: $,
    perspectiveReverseZ: W,
    rotate: _,
    rotateX: Ht,
    rotateY: Ut,
    rotateZ: J,
    rotation: m,
    rotationX: zt,
    rotationY: Vt,
    rotationZ: U,
    scale: C,
    scaling: I,
    set: s,
    setAxis: Y,
    setTranslation: O,
    translate: Rt,
    translation: kt,
    transpose: g,
    uniformScale: B,
    uniformScaling: H
  };
}
const ic = /* @__PURE__ */ new Map();
function yu(o) {
  let e = ic.get(o);
  return e || (e = du(o), ic.set(o, e)), e;
}
function xu(o) {
  const e = ki(o);
  function n(U, J, D, m) {
    const E = new o(4);
    return U !== void 0 && (E[0] = U, J !== void 0 && (E[1] = J, D !== void 0 && (E[2] = D, m !== void 0 && (E[3] = m)))), E;
  }
  const s = n;
  function i(U, J, D, m, E) {
    const _ = E ?? new o(4);
    return _[0] = U, _[1] = J, _[2] = D, _[3] = m, _;
  }
  function r(U, J, D) {
    const m = D ?? new o(4), E = J * 0.5, _ = Math.sin(E);
    return m[0] = _ * U[0], m[1] = _ * U[1], m[2] = _ * U[2], m[3] = Math.cos(E), m;
  }
  function c(U, J) {
    const D = J ?? e.create(3), m = Math.acos(U[3]) * 2, E = Math.sin(m * 0.5);
    return E > Tt ? (D[0] = U[0] / E, D[1] = U[1] / E, D[2] = U[2] / E) : (D[0] = 1, D[1] = 0, D[2] = 0), { angle: m, axis: D };
  }
  function a(U, J) {
    const D = $(U, J);
    return Math.acos(2 * D * D - 1);
  }
  function l(U, J, D) {
    const m = D ?? new o(4), E = U[0], _ = U[1], I = U[2], C = U[3], H = J[0], B = J[1], p = J[2], L = J[3];
    return m[0] = E * L + C * H + _ * p - I * B, m[1] = _ * L + C * B + I * H - E * p, m[2] = I * L + C * p + E * B - _ * H, m[3] = C * L - E * H - _ * B - I * p, m;
  }
  const h = l;
  function u(U, J, D) {
    const m = D ?? new o(4), E = J * 0.5, _ = U[0], I = U[1], C = U[2], H = U[3], B = Math.sin(E), p = Math.cos(E);
    return m[0] = _ * p + H * B, m[1] = I * p + C * B, m[2] = C * p - I * B, m[3] = H * p - _ * B, m;
  }
  function f(U, J, D) {
    const m = D ?? new o(4), E = J * 0.5, _ = U[0], I = U[1], C = U[2], H = U[3], B = Math.sin(E), p = Math.cos(E);
    return m[0] = _ * p - C * B, m[1] = I * p + H * B, m[2] = C * p + _ * B, m[3] = H * p - I * B, m;
  }
  function d(U, J, D) {
    const m = D ?? new o(4), E = J * 0.5, _ = U[0], I = U[1], C = U[2], H = U[3], B = Math.sin(E), p = Math.cos(E);
    return m[0] = _ * p + I * B, m[1] = I * p - _ * B, m[2] = C * p + H * B, m[3] = H * p - C * B, m;
  }
  function y(U, J, D, m) {
    const E = m ?? new o(4), _ = U[0], I = U[1], C = U[2], H = U[3];
    let B = J[0], p = J[1], L = J[2], b = J[3], T = _ * B + I * p + C * L + H * b;
    T < 0 && (T = -T, B = -B, p = -p, L = -L, b = -b);
    let v, A;
    if (1 - T > Tt) {
      const z = Math.acos(T), q = Math.sin(z);
      v = Math.sin((1 - D) * z) / q, A = Math.sin(D * z) / q;
    } else
      v = 1 - D, A = D;
    return E[0] = v * _ + A * B, E[1] = v * I + A * p, E[2] = v * C + A * L, E[3] = v * H + A * b, E;
  }
  function x(U, J) {
    const D = J ?? new o(4), m = U[0], E = U[1], _ = U[2], I = U[3], C = m * m + E * E + _ * _ + I * I, H = C ? 1 / C : 0;
    return D[0] = -m * H, D[1] = -E * H, D[2] = -_ * H, D[3] = I * H, D;
  }
  function g(U, J) {
    const D = J ?? new o(4);
    return D[0] = -U[0], D[1] = -U[1], D[2] = -U[2], D[3] = U[3], D;
  }
  function w(U, J) {
    const D = J ?? new o(4), m = U[0] + U[5] + U[10];
    if (m > 0) {
      const E = Math.sqrt(m + 1);
      D[3] = 0.5 * E;
      const _ = 0.5 / E;
      D[0] = (U[6] - U[9]) * _, D[1] = (U[8] - U[2]) * _, D[2] = (U[1] - U[4]) * _;
    } else {
      let E = 0;
      U[5] > U[0] && (E = 1), U[10] > U[E * 4 + E] && (E = 2);
      const _ = (E + 1) % 3, I = (E + 2) % 3, C = Math.sqrt(U[E * 4 + E] - U[_ * 4 + _] - U[I * 4 + I] + 1);
      D[E] = 0.5 * C;
      const H = 0.5 / C;
      D[3] = (U[_ * 4 + I] - U[I * 4 + _]) * H, D[_] = (U[_ * 4 + E] + U[E * 4 + _]) * H, D[I] = (U[I * 4 + E] + U[E * 4 + I]) * H;
    }
    return D;
  }
  function M(U, J, D, m, E) {
    const _ = E ?? new o(4), I = U * 0.5, C = J * 0.5, H = D * 0.5, B = Math.sin(I), p = Math.cos(I), L = Math.sin(C), b = Math.cos(C), T = Math.sin(H), v = Math.cos(H);
    switch (m) {
      case "xyz":
        _[0] = B * b * v + p * L * T, _[1] = p * L * v - B * b * T, _[2] = p * b * T + B * L * v, _[3] = p * b * v - B * L * T;
        break;
      case "xzy":
        _[0] = B * b * v - p * L * T, _[1] = p * L * v - B * b * T, _[2] = p * b * T + B * L * v, _[3] = p * b * v + B * L * T;
        break;
      case "yxz":
        _[0] = B * b * v + p * L * T, _[1] = p * L * v - B * b * T, _[2] = p * b * T - B * L * v, _[3] = p * b * v + B * L * T;
        break;
      case "yzx":
        _[0] = B * b * v + p * L * T, _[1] = p * L * v + B * b * T, _[2] = p * b * T - B * L * v, _[3] = p * b * v - B * L * T;
        break;
      case "zxy":
        _[0] = B * b * v - p * L * T, _[1] = p * L * v + B * b * T, _[2] = p * b * T + B * L * v, _[3] = p * b * v - B * L * T;
        break;
      case "zyx":
        _[0] = B * b * v - p * L * T, _[1] = p * L * v + B * b * T, _[2] = p * b * T - B * L * v, _[3] = p * b * v + B * L * T;
        break;
      default:
        throw new Error(`Unknown rotation order: ${m}`);
    }
    return _;
  }
  function P(U, J) {
    const D = J ?? new o(4);
    return D[0] = U[0], D[1] = U[1], D[2] = U[2], D[3] = U[3], D;
  }
  const S = P;
  function k(U, J, D) {
    const m = D ?? new o(4);
    return m[0] = U[0] + J[0], m[1] = U[1] + J[1], m[2] = U[2] + J[2], m[3] = U[3] + J[3], m;
  }
  function O(U, J, D) {
    const m = D ?? new o(4);
    return m[0] = U[0] - J[0], m[1] = U[1] - J[1], m[2] = U[2] - J[2], m[3] = U[3] - J[3], m;
  }
  const R = O;
  function F(U, J, D) {
    const m = D ?? new o(4);
    return m[0] = U[0] * J, m[1] = U[1] * J, m[2] = U[2] * J, m[3] = U[3] * J, m;
  }
  const Y = F;
  function N(U, J, D) {
    const m = D ?? new o(4);
    return m[0] = U[0] / J, m[1] = U[1] / J, m[2] = U[2] / J, m[3] = U[3] / J, m;
  }
  function $(U, J) {
    return U[0] * J[0] + U[1] * J[1] + U[2] * J[2] + U[3] * J[3];
  }
  function W(U, J, D, m) {
    const E = m ?? new o(4);
    return E[0] = U[0] + D * (J[0] - U[0]), E[1] = U[1] + D * (J[1] - U[1]), E[2] = U[2] + D * (J[2] - U[2]), E[3] = U[3] + D * (J[3] - U[3]), E;
  }
  function Q(U) {
    const J = U[0], D = U[1], m = U[2], E = U[3];
    return Math.sqrt(J * J + D * D + m * m + E * E);
  }
  const ct = Q;
  function K(U) {
    const J = U[0], D = U[1], m = U[2], E = U[3];
    return J * J + D * D + m * m + E * E;
  }
  const j = K;
  function V(U, J) {
    const D = J ?? new o(4), m = U[0], E = U[1], _ = U[2], I = U[3], C = Math.sqrt(m * m + E * E + _ * _ + I * I);
    return C > 1e-5 ? (D[0] = m / C, D[1] = E / C, D[2] = _ / C, D[3] = I / C) : (D[0] = 0, D[1] = 0, D[2] = 0, D[3] = 1), D;
  }
  function at(U, J) {
    return Math.abs(U[0] - J[0]) < Tt && Math.abs(U[1] - J[1]) < Tt && Math.abs(U[2] - J[2]) < Tt && Math.abs(U[3] - J[3]) < Tt;
  }
  function pt(U, J) {
    return U[0] === J[0] && U[1] === J[1] && U[2] === J[2] && U[3] === J[3];
  }
  function Et(U) {
    const J = U ?? new o(4);
    return J[0] = 0, J[1] = 0, J[2] = 0, J[3] = 1, J;
  }
  const vt = e.create(), kt = e.create(), Rt = e.create();
  function zt(U, J, D) {
    const m = D ?? new o(4), E = e.dot(U, J);
    return E < -0.999999 ? (e.cross(kt, U, vt), e.len(vt) < 1e-6 && e.cross(Rt, U, vt), e.normalize(vt, vt), r(vt, Math.PI, m), m) : E > 0.999999 ? (m[0] = 0, m[1] = 0, m[2] = 0, m[3] = 1, m) : (e.cross(U, J, vt), m[0] = vt[0], m[1] = vt[1], m[2] = vt[2], m[3] = 1 + E, V(m, m));
  }
  const Ht = new o(4), Vt = new o(4);
  function Ut(U, J, D, m, E, _) {
    const I = _ ?? new o(4);
    return y(U, m, E, Ht), y(J, D, E, Vt), y(Ht, Vt, 2 * E * (1 - E), I), I;
  }
  return {
    create: n,
    fromValues: s,
    set: i,
    fromAxisAngle: r,
    toAxisAngle: c,
    angle: a,
    multiply: l,
    mul: h,
    rotateX: u,
    rotateY: f,
    rotateZ: d,
    slerp: y,
    inverse: x,
    conjugate: g,
    fromMat: w,
    fromEuler: M,
    copy: P,
    clone: S,
    add: k,
    subtract: O,
    sub: R,
    mulScalar: F,
    scale: Y,
    divScalar: N,
    dot: $,
    lerp: W,
    length: Q,
    len: ct,
    lengthSq: K,
    lenSq: j,
    normalize: V,
    equalsApproximately: at,
    equals: pt,
    identity: Et,
    rotationTo: zt,
    sqlerp: Ut
  };
}
const rc = /* @__PURE__ */ new Map();
function pu(o) {
  let e = rc.get(o);
  return e || (e = xu(o), rc.set(o, e)), e;
}
function mu(o) {
  function e(D, m, E, _) {
    const I = new o(4);
    return D !== void 0 && (I[0] = D, m !== void 0 && (I[1] = m, E !== void 0 && (I[2] = E, _ !== void 0 && (I[3] = _)))), I;
  }
  const n = e;
  function s(D, m, E, _, I) {
    const C = I ?? new o(4);
    return C[0] = D, C[1] = m, C[2] = E, C[3] = _, C;
  }
  function i(D, m) {
    const E = m ?? new o(4);
    return E[0] = Math.ceil(D[0]), E[1] = Math.ceil(D[1]), E[2] = Math.ceil(D[2]), E[3] = Math.ceil(D[3]), E;
  }
  function r(D, m) {
    const E = m ?? new o(4);
    return E[0] = Math.floor(D[0]), E[1] = Math.floor(D[1]), E[2] = Math.floor(D[2]), E[3] = Math.floor(D[3]), E;
  }
  function c(D, m) {
    const E = m ?? new o(4);
    return E[0] = Math.round(D[0]), E[1] = Math.round(D[1]), E[2] = Math.round(D[2]), E[3] = Math.round(D[3]), E;
  }
  function a(D, m = 0, E = 1, _) {
    const I = _ ?? new o(4);
    return I[0] = Math.min(E, Math.max(m, D[0])), I[1] = Math.min(E, Math.max(m, D[1])), I[2] = Math.min(E, Math.max(m, D[2])), I[3] = Math.min(E, Math.max(m, D[3])), I;
  }
  function l(D, m, E) {
    const _ = E ?? new o(4);
    return _[0] = D[0] + m[0], _[1] = D[1] + m[1], _[2] = D[2] + m[2], _[3] = D[3] + m[3], _;
  }
  function h(D, m, E, _) {
    const I = _ ?? new o(4);
    return I[0] = D[0] + m[0] * E, I[1] = D[1] + m[1] * E, I[2] = D[2] + m[2] * E, I[3] = D[3] + m[3] * E, I;
  }
  function u(D, m, E) {
    const _ = E ?? new o(4);
    return _[0] = D[0] - m[0], _[1] = D[1] - m[1], _[2] = D[2] - m[2], _[3] = D[3] - m[3], _;
  }
  const f = u;
  function d(D, m) {
    return Math.abs(D[0] - m[0]) < Tt && Math.abs(D[1] - m[1]) < Tt && Math.abs(D[2] - m[2]) < Tt && Math.abs(D[3] - m[3]) < Tt;
  }
  function y(D, m) {
    return D[0] === m[0] && D[1] === m[1] && D[2] === m[2] && D[3] === m[3];
  }
  function x(D, m, E, _) {
    const I = _ ?? new o(4);
    return I[0] = D[0] + E * (m[0] - D[0]), I[1] = D[1] + E * (m[1] - D[1]), I[2] = D[2] + E * (m[2] - D[2]), I[3] = D[3] + E * (m[3] - D[3]), I;
  }
  function g(D, m, E, _) {
    const I = _ ?? new o(4);
    return I[0] = D[0] + E[0] * (m[0] - D[0]), I[1] = D[1] + E[1] * (m[1] - D[1]), I[2] = D[2] + E[2] * (m[2] - D[2]), I[3] = D[3] + E[3] * (m[3] - D[3]), I;
  }
  function w(D, m, E) {
    const _ = E ?? new o(4);
    return _[0] = Math.max(D[0], m[0]), _[1] = Math.max(D[1], m[1]), _[2] = Math.max(D[2], m[2]), _[3] = Math.max(D[3], m[3]), _;
  }
  function M(D, m, E) {
    const _ = E ?? new o(4);
    return _[0] = Math.min(D[0], m[0]), _[1] = Math.min(D[1], m[1]), _[2] = Math.min(D[2], m[2]), _[3] = Math.min(D[3], m[3]), _;
  }
  function P(D, m, E) {
    const _ = E ?? new o(4);
    return _[0] = D[0] * m, _[1] = D[1] * m, _[2] = D[2] * m, _[3] = D[3] * m, _;
  }
  const S = P;
  function k(D, m, E) {
    const _ = E ?? new o(4);
    return _[0] = D[0] / m, _[1] = D[1] / m, _[2] = D[2] / m, _[3] = D[3] / m, _;
  }
  function O(D, m) {
    const E = m ?? new o(4);
    return E[0] = 1 / D[0], E[1] = 1 / D[1], E[2] = 1 / D[2], E[3] = 1 / D[3], E;
  }
  const R = O;
  function F(D, m) {
    return D[0] * m[0] + D[1] * m[1] + D[2] * m[2] + D[3] * m[3];
  }
  function Y(D) {
    const m = D[0], E = D[1], _ = D[2], I = D[3];
    return Math.sqrt(m * m + E * E + _ * _ + I * I);
  }
  const N = Y;
  function $(D) {
    const m = D[0], E = D[1], _ = D[2], I = D[3];
    return m * m + E * E + _ * _ + I * I;
  }
  const W = $;
  function Q(D, m) {
    const E = D[0] - m[0], _ = D[1] - m[1], I = D[2] - m[2], C = D[3] - m[3];
    return Math.sqrt(E * E + _ * _ + I * I + C * C);
  }
  const ct = Q;
  function K(D, m) {
    const E = D[0] - m[0], _ = D[1] - m[1], I = D[2] - m[2], C = D[3] - m[3];
    return E * E + _ * _ + I * I + C * C;
  }
  const j = K;
  function V(D, m) {
    const E = m ?? new o(4), _ = D[0], I = D[1], C = D[2], H = D[3], B = _ * _ + I * I + C * C + H * H, p = B > 0 ? 1 / Math.sqrt(B) : 1;
    return E[0] = _ * p, E[1] = I * p, E[2] = C * p, E[3] = H * p, E;
  }
  function at(D, m) {
    const E = m ?? new o(4);
    return E[0] = -D[0], E[1] = -D[1], E[2] = -D[2], E[3] = -D[3], E;
  }
  function pt(D, m) {
    const E = m ?? new o(4);
    return E[0] = D[0], E[1] = D[1], E[2] = D[2], E[3] = D[3], E;
  }
  const Et = pt;
  function vt(D, m, E) {
    const _ = E ?? new o(4);
    return _[0] = D[0] * m[0], _[1] = D[1] * m[1], _[2] = D[2] * m[2], _[3] = D[3] * m[3], _;
  }
  const kt = vt;
  function Rt(D, m, E) {
    const _ = E ?? new o(4);
    return _[0] = D[0] / m[0], _[1] = D[1] / m[1], _[2] = D[2] / m[2], _[3] = D[3] / m[3], _;
  }
  const zt = Rt;
  function Ht(D) {
    const m = D ?? new o(4);
    return m[0] = 0, m[1] = 0, m[2] = 0, m[3] = 0, m;
  }
  function Vt(D, m, E) {
    const _ = E ?? new o(4), I = D[0], C = D[1], H = D[2], B = D[3];
    return _[0] = m[0] * I + m[4] * C + m[8] * H + m[12] * B, _[1] = m[1] * I + m[5] * C + m[9] * H + m[13] * B, _[2] = m[2] * I + m[6] * C + m[10] * H + m[14] * B, _[3] = m[3] * I + m[7] * C + m[11] * H + m[15] * B, _;
  }
  function Ut(D, m, E) {
    const _ = E ?? new o(4);
    return V(D, _), P(_, m, _);
  }
  function U(D, m, E) {
    const _ = E ?? new o(4);
    return Y(D) > m ? Ut(D, m, _) : pt(D, _);
  }
  function J(D, m, E) {
    const _ = E ?? new o(4);
    return x(D, m, 0.5, _);
  }
  return {
    create: e,
    fromValues: n,
    set: s,
    ceil: i,
    floor: r,
    round: c,
    clamp: a,
    add: l,
    addScaled: h,
    subtract: u,
    sub: f,
    equalsApproximately: d,
    equals: y,
    lerp: x,
    lerpV: g,
    max: w,
    min: M,
    mulScalar: P,
    scale: S,
    divScalar: k,
    inverse: O,
    invert: R,
    dot: F,
    length: Y,
    len: N,
    lengthSq: $,
    lenSq: W,
    distance: Q,
    dist: ct,
    distanceSq: K,
    distSq: j,
    normalize: V,
    negate: at,
    copy: pt,
    clone: Et,
    multiply: vt,
    mul: kt,
    divide: Rt,
    div: zt,
    zero: Ht,
    transformMat4: Vt,
    setLength: Ut,
    truncate: U,
    midpoint: J
  };
}
const oc = /* @__PURE__ */ new Map();
function gu(o) {
  let e = oc.get(o);
  return e || (e = mu(o), oc.set(o, e)), e;
}
function jr(o, e, n, s, i, r) {
  return {
    /** @namespace mat3 */
    mat3: fu(o),
    /** @namespace mat4 */
    mat4: yu(e),
    /** @namespace quat */
    quat: pu(n),
    /** @namespace vec2 */
    vec2: Ta(s),
    /** @namespace vec3 */
    vec3: ki(i),
    /** @namespace vec4 */
    vec4: gu(r)
  };
}
const {
  /**
   * 3x3 Matrix functions that default to returning `Float32Array`
   * @namespace
   */
  mat3: wu,
  /**
   * 4x4 Matrix functions that default to returning `Float32Array`
   * @namespace
   */
  mat4: vu,
  /**
   * Quaternion functions that default to returning `Float32Array`
   * @namespace
   */
  quat: Mu,
  /**
   * Vec2 functions that default to returning `Float32Array`
   * @namespace
   */
  vec2: bu,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec3: _u,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec4: Tu
} = jr(
  Float32Array,
  Float32Array,
  Float32Array,
  Float32Array,
  Float32Array,
  Float32Array
), {
  /**
   * 3x3 Matrix functions that default to returning `Float64Array`
   * @namespace
   */
  mat3: Pu,
  /**
   * 4x4 Matrix functions that default to returning `Float64Array`
   * @namespace
   */
  mat4: Au,
  /**
   * Quaternion functions that default to returning `Float64Array`
   * @namespace
   */
  quat: Eu,
  /**
   * Vec2 functions that default to returning `Float64Array`
   * @namespace
   */
  vec2: Lu,
  /**
   * Vec3 functions that default to returning `Float64Array`
   * @namespace
   */
  vec3: Su,
  /**
   * Vec3 functions that default to returning `Float64Array`
   * @namespace
   */
  vec4: Iu
} = jr(
  Float64Array,
  Float64Array,
  Float64Array,
  Float64Array,
  Float64Array,
  Float64Array
), {
  /**
   * 3x3 Matrix functions that default to returning `number[]`
   * @namespace
   */
  mat3: qu,
  /**
   * 4x4 Matrix functions that default to returning `number[]`
   * @namespace
   */
  mat4: Du,
  /**
   * Quaternion functions that default to returning `number[]`
   * @namespace
   */
  quat: Ou,
  /**
   * Vec2 functions that default to returning `number[]`
   * @namespace
   */
  vec2: ku,
  /**
   * Vec3 functions that default to returning `number[]`
   * @namespace
   */
  vec3: Ru,
  /**
   * Vec3 functions that default to returning `number[]`
   * @namespace
   */
  vec4: Fu
} = jr(
  eu,
  Array,
  Array,
  Array,
  Array,
  Array
), K1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  mat3: wu,
  mat3d: Pu,
  mat3n: qu,
  mat4: vu,
  mat4d: Au,
  mat4n: Du,
  quat: Mu,
  quatd: Eu,
  quatn: Ou,
  utils: au,
  vec2: bu,
  vec2d: Lu,
  vec2n: ku,
  vec3: _u,
  vec3d: Su,
  vec3n: Ru,
  vec4: Tu,
  vec4d: Iu,
  vec4n: Fu
}, Symbol.toStringTag, { value: "Module" }));
class td {
  constructor(e, n) {
    this.config = n, this.context = e, this.config && this.initPresetsAndPlugins(this.config);
  }
  hooks = /* @__PURE__ */ new Map();
  methods = /* @__PURE__ */ new Map();
  plugins = /* @__PURE__ */ new Map();
  extraPresets = [];
  extraPlugins = [];
  context;
  initPresetsAndPlugins(e) {
    this.extraPlugins = [], this.extraPresets = [], this.resolvePresets(e.presets ?? []), this.resolvePlugins(e.plugins ?? []);
  }
  resolvePresets(e) {
    Array.isArray(e) && e.forEach((s) => {
      this.initPreset(s);
    });
    const n = this.extraPresets;
    for (; n.length; )
      this.initPreset(n.shift());
  }
  resolvePlugins(e) {
    Array.isArray(e) && e.forEach((s) => {
      this.initPlugin(s);
    });
    const n = this.extraPlugins;
    for (; n.length; )
      this.initPlugin(n.shift());
  }
  getApplyMethods(e) {
    const n = this.methods.get(e) ?? [];
    return (...s) => n.length === 1 ? n[0](...s) : n.reduceRight((i, r) => (...c) => r(i(...c)))(...s);
  }
  applyMethods(e, ...n) {
    const s = this.methods.get(e) ?? [];
    return s.length === 1 ? s[0](...n) : s.reduceRight((i, r) => (...c) => r(i(...c)))(...n);
  }
  getPluginContext(e) {
    const n = {
      pluginName: e.name,
      ctx: this.context,
      registerMethod: this.registerMethod.bind(this),
      register: this.register.bind(this)
    };
    return new Proxy(n, {
      get: (s, i, r) => this.methods.has(i) ? this.getApplyMethods(i) : Reflect.get(s, i, r)
    });
  }
  initPreset(e) {
    this.registerPlugin(e);
    const n = this.getPluginContext(e), { plugins: s, presets: i } = e.apply(n, e.config);
    i && this.extraPresets.push(...i), s && this.extraPlugins.push(...s);
  }
  initPlugin(e) {
    this.registerPlugin(e);
    const n = this.getPluginContext(e);
    e.apply(n, e.config);
  }
  registerPlugin(e) {
    if (this.plugins.has(e.name))
      throw `${e.name}:已存在`;
    this.plugins.set(e.name, e);
  }
  register(e) {
    const n = this.hooks.get(e.name) ?? [];
    n.push(e), this.hooks.set(e.name, n);
  }
  registerMethod(e, n) {
    const s = this.methods.get(e) ?? [];
    s.push(n || ((i) => {
      this.register({ name: e, fn: i });
    })), this.methods.set(e, s);
  }
  async applyPlugins(e) {
    const n = typeof e == "string" ? { name: e, type: void 0 } : e;
    let { name: s, type: i } = n;
    i || (s.startsWith("modify") && (i = "modify"), s.startsWith("add") && (i = "add"), s.startsWith("on") && (i = "event"), s.startsWith("create") && (i = "create"));
    const r = (this.hooks.get(s) ?? []).slice();
    switch (r.sort((c, a) => {
      let l = c.order ?? 0, h = a.order ?? 0;
      return l - h;
    }), i) {
      case "create": {
        let c = n.initalValue;
        for (let a of r) {
          let l = await Promise.resolve().then(() => a.fn(n.args));
          if (l != null)
            return l;
        }
        return c;
      }
      case "add": {
        let c = n.initalValue ?? [];
        for (let a of r) {
          let l = await Promise.resolve().then(() => a.fn(n.args));
          l != null && c.push(l);
        }
        return c;
      }
      case "modify": {
        let c = n.initalValue ?? {};
        for (let a of r) {
          let l = await Promise.resolve().then(() => a.fn(c, n.args));
          l != null && (c = l);
        }
        return c;
      }
      case "event": {
        if (n.sync)
          for (let c of r)
            c.fn(n.args);
        else {
          let c = Promise.resolve();
          for (let a of r)
            c = c.then(() => {
              a.fn(n.args);
            });
        }
        break;
      }
    }
  }
  uninstallPlugin(e) {
    if (this.plugins.has(e.name)) {
      const n = this.getPluginContext(e);
      e.dispose?.(n), this.plugins.delete(e.name);
    }
  }
  dispose() {
    this.plugins.forEach((e) => {
      e?.dispose?.(this.getPluginContext(e));
    }), this.extraPlugins = [], this.extraPresets = [], this.plugins.clear(), this.hooks.clear(), this.methods.clear();
  }
}
const cc = typeof requestAnimationFrame < "u" ? {
  request: (o) => requestAnimationFrame(o),
  cancel: (o) => cancelAnimationFrame(o)
} : {
  // 兜底：setTimeout 16ms
  request: (o) => window.setTimeout(o, 16),
  cancel: (o) => clearTimeout(o)
}, ac = () => typeof performance < "u" ? performance.now() : Date.now();
class Ft {
  static _instance = null;
  /** 获取使用默认 rAF 的全局单例 */
  static get shared() {
    return Ft._instance || (Ft._instance = new Ft(cc)), Ft._instance;
  }
  /**
   * 创建自定义 Ticker 实例
   * @param scheduler - 自定义帧调度器，不传则使用 requestAnimationFrame
   *
   * @example
   *   // Node.js 测试环境
   *   const ticker = Ticker.create({
   *     request: (cb) => setTimeout(cb, 16),
   *     cancel: (id) => clearTimeout(id),
   *   })
   *
   *   // Worker 环境
   *   const ticker = Ticker.create({
   *     request: (cb) => setTimeout(cb, 16),
   *     cancel: (id) => clearTimeout(id),
   *   })
   */
  static create(e = cc) {
    return new Ft(e);
  }
  /** 帧率上限（0 = 不限制），默认 60 */
  static targetFPS = 60;
  _listeners = [];
  _frameId = 0;
  _running = !1;
  _lastTime = 0;
  _elapsed = 0;
  _minInterval = 0;
  _scheduler;
  constructor(e) {
    this._scheduler = e;
  }
  get running() {
    return this._running;
  }
  get elapsed() {
    return this._elapsed;
  }
  /** 添加帧回调 */
  add(e) {
    return this._listeners.includes(e) || this._listeners.push(e), this;
  }
  /** 移除帧回调 */
  remove(e) {
    const n = this._listeners.indexOf(e);
    return n >= 0 && this._listeners.splice(n, 1), this;
  }
  /** 启动时钟 */
  start() {
    return this._running ? this : (this._running = !0, this._lastTime = ac(), this._elapsed = 0, this._minInterval = Ft.targetFPS > 0 ? 1e3 / Ft.targetFPS : 0, this._frameId = this._scheduler.request(this._tick), this);
  }
  /** 停止时钟 */
  stop() {
    return this._running = !1, this._frameId && (this._scheduler.cancel(this._frameId), this._frameId = 0), this;
  }
  _tick = () => {
    if (!this._running) return;
    this._frameId = this._scheduler.request(this._tick);
    const e = ac();
    let n = e - this._lastTime;
    if (n < this._minInterval) return;
    n > 500 && (n = 500), this._lastTime = e - (n % this._minInterval || 0), this._elapsed += n;
    const s = this._listeners;
    for (let i = 0; i < s.length; i++)
      s[i](n, this._elapsed);
  };
}
const Jn = {
  // ---- 线性 ----
  linear: (o) => o,
  // ---- 二次方 (quadratic) ----
  quadraticIn: (o) => o * o,
  quadraticOut: (o) => o * (2 - o),
  quadraticInOut: (o) => (o *= 2) < 1 ? 0.5 * o * o : -0.5 * (--o * (o - 2) - 1),
  // ---- 三次方 (cubic) ----
  cubicIn: (o) => o * o * o,
  cubicOut: (o) => --o * o * o + 1,
  cubicInOut: (o) => (o *= 2) < 1 ? 0.5 * o * o * o : 0.5 * ((o -= 2) * o * o + 2),
  // ---- 四次方 (quartic) ----
  quarticIn: (o) => o * o * o * o,
  quarticOut: (o) => 1 - --o * o * o * o,
  quarticInOut: (o) => (o *= 2) < 1 ? 0.5 * o * o * o * o : -0.5 * ((o -= 2) * o * o * o - 2),
  // ---- 五次方 (quintic) ----
  quinticIn: (o) => o * o * o * o * o,
  quinticOut: (o) => --o * o * o * o * o + 1,
  quinticInOut: (o) => (o *= 2) < 1 ? 0.5 * o * o * o * o * o : 0.5 * ((o -= 2) * o * o * o * o + 2),
  // ---- 正弦 (sinusoidal) ----
  sinusoidalIn: (o) => 1 - Math.cos(o * Math.PI / 2),
  sinusoidalOut: (o) => Math.sin(o * Math.PI / 2),
  sinusoidalInOut: (o) => 0.5 * (1 - Math.cos(Math.PI * o)),
  // ---- 指数 (exponential) ----
  exponentialIn: (o) => o === 0 ? 0 : Math.pow(1024, o - 1),
  exponentialOut: (o) => o === 1 ? 1 : 1 - Math.pow(2, -10 * o),
  exponentialInOut: (o) => o === 0 ? 0 : o === 1 ? 1 : (o *= 2) < 1 ? 0.5 * Math.pow(1024, o - 1) : 0.5 * (-Math.pow(2, -10 * (o - 1)) + 2),
  // ---- 圆形 (circular) ----
  circularIn: (o) => 1 - Math.sqrt(1 - o * o),
  circularOut: (o) => Math.sqrt(1 - --o * o),
  circularInOut: (o) => (o *= 2) < 1 ? -0.5 * (Math.sqrt(1 - o * o) - 1) : 0.5 * (Math.sqrt(1 - (o -= 2) * o) + 1),
  // ---- 弹性 (elastic) ----
  elasticIn: (o) => {
    if (o === 0) return 0;
    if (o === 1) return 1;
    const e = 0.3, n = e / 4;
    return -Math.pow(2, 10 * (o -= 1)) * Math.sin((o - n) * (2 * Math.PI) / e);
  },
  elasticOut: (o) => {
    if (o === 0) return 0;
    if (o === 1) return 1;
    const e = 0.3, n = e / 4;
    return Math.pow(2, -10 * o) * Math.sin((o - n) * (2 * Math.PI) / e) + 1;
  },
  elasticInOut: (o) => {
    if (o === 0) return 0;
    if (o === 1) return 1;
    const e = 0.3 * 1.5, n = e / 4;
    return (o *= 2) < 1 ? -0.5 * Math.pow(2, 10 * (o -= 1)) * Math.sin((o - n) * (2 * Math.PI) / e) : Math.pow(2, -10 * (o -= 1)) * Math.sin((o - n) * (2 * Math.PI) / e) * 0.5 + 1;
  },
  // ---- 回退 (back) ----
  backIn: (o) => o * o * ((1.70158 + 1) * o - 1.70158),
  backOut: (o) => --o * o * ((1.70158 + 1) * o + 1.70158) + 1,
  backInOut: (o) => {
    const e = 2.5949095;
    return (o *= 2) < 1 ? 0.5 * (o * o * ((e + 1) * o - e)) : 0.5 * ((o -= 2) * o * ((e + 1) * o + e) + 2);
  },
  // ---- 弹跳 (bounce) ----
  bounceIn: (o) => 1 - Jn.bounceOut(1 - o),
  bounceOut: (o) => o < 1 / 2.75 ? 7.5625 * o * o : o < 2 / 2.75 ? 7.5625 * (o -= 1.5 / 2.75) * o + 0.75 : o < 2.5 / 2.75 ? 7.5625 * (o -= 2.25 / 2.75) * o + 0.9375 : 7.5625 * (o -= 2.625 / 2.75) * o + 0.984375,
  bounceInOut: (o) => o < 0.5 ? Jn.bounceIn(o * 2) * 0.5 : Jn.bounceOut(o * 2 - 1) * 0.5 + 0.5
};
function zu(o, e, n, s) {
  const i = 3 * o, r = 3 * (n - o) - i, c = 1 - i - r, a = 3 * e, l = 3 * (s - e) - a, h = 1 - a - l, u = (x) => ((c * x + r) * x + i) * x, f = (x) => ((h * x + l) * x + a) * x, d = (x) => (3 * c * x + 2 * r) * x + i, y = (x, g = 1e-6) => {
    let w, M = 0, P = 1;
    for (let S = 0; S < 8; S++) {
      w = (M + P) / 2;
      const k = u(w);
      if (Math.abs(k - x) < g) return w;
      x > k ? M = w : P = w;
    }
    w = (M + P) / 2;
    for (let S = 0; S < 4; S++) {
      const k = d(w);
      if (Math.abs(k) < 1e-8) break;
      w -= (u(w) - x) / k, w = Math.max(0, Math.min(1, w));
    }
    return w;
  };
  return (x) => x <= 0 ? 0 : x >= 1 ? 1 : f(y(x));
}
function Pa(o) {
  return typeof o == "function" ? o : typeof o == "string" ? Jn[o] ?? Jn.linear : Array.isArray(o) && o.length === 4 ? zu(o[0], o[1], o[2], o[3]) : Jn.linear;
}
function Cu(o, e) {
  if (o.length === 0) return [];
  const n = [...o].sort((i, r) => i.time - r.time);
  return n[0].time > 0 && n.unshift({ time: 0, value: n[0].value, easing: n[0].easing }), n.map((i) => ({
    time: i.time,
    percent: e > 0 ? Math.min(i.time / e, 1) : 0,
    value: i.value,
    easingFunc: Pa(i.easing ?? "linear")
  }));
}
function lc(o, e) {
  const n = o.length;
  if (n === 0) throw new Error("No keyframes");
  if (n === 1) return [o[0], o[0], 1];
  if (e <= o[0].percent)
    return [o[0], o[0], 0];
  if (e >= o[n - 1].percent)
    return [o[n - 1], o[n - 1], 1];
  let s = 0, i = n - 1;
  for (; s < i - 1; ) {
    const u = s + i >> 1;
    o[u].percent <= e ? s = u : i = u;
  }
  const r = o[s], c = o[i], a = c.percent - r.percent, l = a > 0 ? (e - r.percent) / a : 0, h = c.easingFunc(Math.min(Math.max(l, 0), 1));
  return [r, c, h];
}
function Ys(o, e, n) {
  return o + (e - o) * n;
}
function ed(o, e, n) {
  const s = {};
  for (const i in o)
    Object.prototype.hasOwnProperty.call(o, i) && (s[i] = Ys(o[i], e[i] ?? o[i], n));
  return s;
}
function Nu(o, e, n, s = []) {
  const i = Math.max(o.length, e.length);
  for (let r = 0; r < i; r++)
    s[r] = Ys(o[r] ?? 0, e[r] ?? 0, n);
  return s;
}
function Hu(o, e, n, s = []) {
  const i = Math.max(o.length, e.length);
  for (let r = 0; r < i; r++) {
    s[r] || (s[r] = []);
    const c = o[r] ?? [], a = e[r] ?? [], l = Math.max(c.length, a.length);
    for (let h = 0; h < l; h++)
      s[r][h] = Ys(c[h] ?? 0, a[h] ?? 0, n);
  }
  return s;
}
function nd(o, e, n, s = []) {
  for (let i = 0; i < 4; i++)
    s[i] = Ys(o[i] ?? 0, e[i] ?? 0, n);
  return s;
}
function hc(o) {
  return typeof o == "number" && !isNaN(o);
}
function uc(o) {
  return Array.isArray(o) && o.length > 0 && typeof o[0] == "number";
}
function fc(o) {
  return Array.isArray(o) && o.length > 0 && Array.isArray(o[0]) && typeof o[0][0] == "number";
}
function dc(o, e, n) {
  return hc(o) && hc(e) ? Ys(o, e, n) : uc(o) && uc(e) ? Nu(o, e, n) : fc(o) && fc(e) ? Hu(o, e, n) : n < 1 ? o : e;
}
class Bu {
  /** 属性名 */
  property;
  /** 目标对象 */
  target;
  /** 初始值（动画开始前快照） */
  _startValue;
  /** 关键帧运行时数据 */
  _keyframes = [];
  /** 是否已准备（已调用 prepare） */
  _prepared = !1;
  constructor(e) {
    if (this.property = e.property, this.target = e.target, this._startValue = e.target[e.property], e.keyframes.length > 0) {
      const n = [...e.keyframes];
      n[0].time > 0 && n.unshift({ time: 0, value: this._startValue }), this._keyframes = Cu(
        n,
        n[n.length - 1].time
      );
    }
  }
  /** 是否有关键帧 */
  get hasKeyframes() {
    return this._keyframes.length > 0;
  }
  /** 最后一个关键帧的时间（毫秒） */
  get endTime() {
    return this._keyframes.length > 0 ? this._keyframes[this._keyframes.length - 1].time : 0;
  }
  /**
   * 根据归一化进度计算并写入属性值
   * @param percent - 总动画进度 [0, 1]
   */
  tick(e) {
    const n = this._keyframes;
    if (n.length === 0) return;
    const [s, i, r] = lc(n, e), c = dc(s.value, i.value, r);
    this.target[this.property] = c;
  }
  /** 获取指定进度的值（不写入 target） */
  getValueAt(e) {
    const n = this._keyframes;
    if (n.length === 0) return this._startValue;
    const [s, i, r] = lc(n, e);
    return dc(s.value, i.value, r);
  }
  /** 重置到初始值 */
  reset() {
    this.target[this.property] = this._startValue;
  }
}
var Yu = /* @__PURE__ */ ((o) => (o[o.Forward = 1] = "Forward", o[o.Backward = -1] = "Backward", o))(Yu || {}), ke = /* @__PURE__ */ ((o) => (o.Idle = "idle", o.Playing = "playing", o.Paused = "paused", o.Completed = "completed", o))(ke || {});
class Aa {
  /** 目标对象 */
  target;
  // 配置
  _duration;
  _delay;
  _repeat;
  _yoyo;
  _easingFunc;
  // 轨道
  _tracks = [];
  // 状态
  _state = "idle";
  _direction = 1;
  _repeatCount = 0;
  // 时间
  _startTime = 0;
  _pauseTime = 0;
  _pausedElapsed = 0;
  _progress = 0;
  // 回调
  onStart;
  onUpdate;
  onRepeat;
  onComplete;
  constructor(e) {
    this.target = e.target, this._duration = e.duration ?? 1e3, this._delay = e.delay ?? 0, e.loop ? this._repeat = -1 : this._repeat = e.repeat ?? 0, this._yoyo = e.yoyo ?? !1, this._easingFunc = Pa(e.easing ?? "linear"), this.onStart = e.onStart, this.onUpdate = e.onUpdate, this.onRepeat = e.onRepeat, this.onComplete = e.onComplete;
    for (const n of e.tracks)
      this._tracks.push(new Bu({
        property: n.property,
        keyframes: n.keyframes,
        target: e.target
      }));
  }
  // ---- 属性 ----
  get state() {
    return this._state;
  }
  get duration() {
    return this._duration;
  }
  get progress() {
    return this._progress;
  }
  get repeat() {
    return this._repeat;
  }
  get yoyo() {
    return this._yoyo;
  }
  /** 当前播放方向 */
  get direction() {
    return this._direction;
  }
  set direction(e) {
    this._direction = e;
  }
  // ---- 播放控制 ----
  /** 开始播放 */
  play() {
    return this._state === "playing" ? this : (this._state === "completed" && this._reset(), this._state = "playing", this._direction = 1, this._startTime = Ft.shared.elapsed, this._pausedElapsed = 0, Ft.shared.add(this._tick), this.onStart?.(), this);
  }
  /** 暂停 */
  pause() {
    return this._state !== "playing" ? this : (this._state = "paused", this._pauseTime = Ft.shared.elapsed, Ft.shared.remove(this._tick), this);
  }
  /** 恢复 */
  resume() {
    return this._state !== "paused" ? this : (this._state = "playing", this._pausedElapsed += Ft.shared.elapsed - this._pauseTime, Ft.shared.add(this._tick), this);
  }
  /** 停止并重置 */
  stop() {
    return Ft.shared.remove(this._tick), this._reset(), this._state = "idle", this;
  }
  /** 跳到指定进度并立即更新 */
  seek(e) {
    const n = Math.max(0, Math.min(1, e));
    return this._applyProgress(n), this;
  }
  /** 立即完成 */
  complete() {
    return this._applyProgress(1), this._finish(), this;
  }
  // ---- 内部 ----
  _reset() {
    this._progress = 0, this._repeatCount = 0, this._direction = 1;
    for (const e of this._tracks)
      e.reset();
  }
  _tick = (e, n) => {
    if (this._state !== "playing") return;
    const s = n - this._startTime - this._pausedElapsed;
    if (s < this._delay) return;
    const i = s - this._delay, r = this._duration;
    if (r <= 0) {
      this._applyProgress(1), this._finish();
      return;
    }
    let c = i / r;
    if (c > 1) {
      const h = Math.floor(c);
      c -= h, this._repeat < 0 ? (this.onRepeat?.(), this._repeatCount++) : (this._repeatCount += h, this._repeatCount > this._repeat && (c = 1));
    }
    let a = c;
    this._yoyo && (Math.floor(i / r) % 2 === 1 ? (this._direction = -1, a = 1 - c) : this._direction = 1);
    const l = this._easingFunc(Math.min(a, 1));
    this._applyProgress(l), a >= 1 && this._repeat >= 0 && this._repeatCount >= this._repeat && this._finish();
  };
  _applyProgress(e) {
    this._progress = e;
    for (const n of this._tracks)
      n.tick(e);
    this.onUpdate?.(e);
  }
  _finish() {
    this._state = "completed", Ft.shared.remove(this._tick), this.onComplete?.();
  }
}
class Vu {
  _children = [];
  _labels = /* @__PURE__ */ new Map();
  _defaults;
  _repeat;
  _yoyo;
  _repeatCount = 0;
  _state = ke.Idle;
  _startTime = 0;
  _pauseTime = 0;
  _pausedElapsed = 0;
  /**
   * 总时长（毫秒），由所有子动画的最晚结束时间决定
   */
  get duration() {
    let e = 0;
    for (const n of this._children) {
      const s = n.startTime + n.animation.duration;
      s > e && (e = s);
    }
    return e;
  }
  get state() {
    return this._state;
  }
  onStart;
  onUpdate;
  onComplete;
  constructor(e = {}) {
    this._repeat = e.repeat ?? 0, this._yoyo = e.yoyo ?? !1, this._defaults = e.defaults ?? {}, this.onStart = e.onStart, this.onUpdate = e.onUpdate, this.onComplete = e.onComplete;
  }
  // ---- 添加动画 ----
  /**
   * 添加一个动画到 Timeline
   * @param animation - 动画实例
   * @param position - 时间位置（毫秒，绝对时间）或偏移字符串（如 "+200" / "-100" / "labelName"）
   */
  add(e, n = 0) {
    const s = this._resolvePosition(n);
    return this._children.push({
      animation: e,
      startTime: s
    }), this;
  }
  /**
   * 快捷方法：创建动画并添加到 Timeline
   */
  to(e, n) {
    const s = {
      ...this._defaults,
      ...e
    }, i = new Aa(s);
    return this.add(i, n);
  }
  /**
   * 快捷方法：从当前值动画到指定值
   */
  fromTo(e, n, s, i, r) {
    const c = [];
    for (const a of Object.keys(s))
      c.push({
        property: a,
        keyframes: [
          { time: 0, value: n[a] },
          { time: i ?? this._defaults.duration ?? 1e3, value: s[a] }
        ]
      });
    return this.to({ target: e, tracks: c, duration: i }, r);
  }
  /** 添加一个标签标记 */
  addLabel(e, n) {
    return this._labels.set(e, n), this;
  }
  // ---- 播放控制 ----
  play() {
    return this._state === ke.Playing ? this : (this._state = ke.Playing, this._startTime = Ft.shared.elapsed, this._pausedElapsed = 0, this._repeatCount = 0, Ft.shared.add(this._tick), this.onStart?.(), this);
  }
  pause() {
    return this._state !== ke.Playing ? this : (this._state = ke.Paused, this._pauseTime = Ft.shared.elapsed, Ft.shared.remove(this._tick), this);
  }
  resume() {
    return this._state !== ke.Paused ? this : (this._state = ke.Playing, this._pausedElapsed += Ft.shared.elapsed - this._pauseTime, Ft.shared.add(this._tick), this);
  }
  stop() {
    Ft.shared.remove(this._tick);
    for (const e of this._children)
      e.animation.stop();
    return this._state = ke.Idle, this;
  }
  /** 跳转到指定进度 */
  seek(e) {
    const s = Math.max(0, Math.min(1, e)) * this.duration;
    return this._seekTime(s), this;
  }
  /** 清除所有子动画 */
  clear() {
    return this.stop(), this._children = [], this._labels.clear(), this;
  }
  // ---- 内部 ----
  _resolvePosition(e) {
    if (typeof e == "number") return e;
    if (e.startsWith("+") || e.startsWith("-")) {
      const s = parseFloat(e);
      if (this._children.length === 0) return Math.max(0, s);
      const i = this._children[this._children.length - 1];
      return Math.max(0, i.startTime + i.animation.duration + s);
    }
    const n = this._labels.get(e);
    return n !== void 0 ? n : 0;
  }
  _tick = (e, n) => {
    if (this._state !== ke.Playing) return;
    const s = n - this._startTime - this._pausedElapsed, i = this.duration;
    if (i <= 0) return;
    let r = s / i;
    this._repeat < 0 ? r = r % 1 : r > 1 && (this._repeatCount = Math.floor(r), this._repeatCount > this._repeat ? r = 1 : r -= this._repeatCount), this._yoyo && Math.floor(s / i) % 2 === 1 && (r = 1 - r);
    const c = Math.min(r, 1) * i;
    this._seekTime(c), this.onUpdate?.(Math.min(r, 1)), r >= 1 && this._repeat >= 0 && this._repeatCount >= this._repeat && (this._state = ke.Completed, Ft.shared.remove(this._tick), this.onComplete?.());
  };
  _seekTime(e) {
    this.duration;
    for (const n of this._children) {
      const { animation: s, startTime: i } = n, r = i + s.duration;
      if (e < i)
        s.seek(0);
      else if (e >= r)
        s.seek(1);
      else if (s.duration > 0) {
        const c = (e - i) / s.duration;
        s.seek(c);
      }
    }
  }
}
class sd {
  _animations = /* @__PURE__ */ new Set();
  _timelines = /* @__PURE__ */ new Set();
  _enabled = !1;
  /** 是否已启用（注册到 Ticker） */
  get enabled() {
    return this._enabled;
  }
  /** 活跃动画数量 */
  get activeCount() {
    return this._animations.size + this._timelines.size;
  }
  /**
   * 创建动画
   * @example
   *   system.animate({
   *     target: rect,
   *     tracks: [
   *       { property: 'x', keyframes: [{ time: 1000, value: 200 }] }
   *     ],
   *     duration: 1000,
   *     easing: 'cubicOut',
   *   })
   */
  animate(e) {
    const n = new Aa(e);
    this._animations.add(n), this._enabled || this._start(), n.play();
    const s = n.onComplete;
    return n.onComplete = () => {
      s?.(), this._animations.delete(n), this.activeCount === 0 && this._stop();
    }, n;
  }
  /**
   * 创建时间线
   * @example
   *   const tl = system.timeline()
   *     .to({ target: rect, tracks: [...] })
   *     .to({ target: circle, tracks: [...] }, '+=200')
   *     .play()
   */
  timeline(e) {
    const n = new Vu(e), s = n.play.bind(n);
    n.play = () => (this._timelines.add(n), this._enabled || this._start(), s());
    const i = n.onComplete;
    return n.onComplete = () => {
      i?.(), this._timelines.delete(n), this.activeCount === 0 && this._stop();
    }, n;
  }
  /**
   * 停止所有动画
   */
  stopAll() {
    for (const e of this._animations) e.stop();
    this._animations.clear();
    for (const e of this._timelines) e.stop();
    this._timelines.clear(), this._stop();
  }
  /** 暂停所有 */
  pauseAll() {
    for (const e of this._animations) e.pause();
    for (const e of this._timelines) e.pause();
  }
  /** 恢复所有 */
  resumeAll() {
    for (const e of this._animations) e.resume();
    for (const e of this._timelines) e.resume();
  }
  _start() {
    this._enabled = !0, Ft.shared.start();
  }
  _stop() {
    this._enabled = !1;
  }
}
function Uu(o, e) {
  return Array.isArray(e) ? e.includes(o) : e === o;
}
function $e(o, e, n) {
  return o.context ? o.callback(n, ...e) : o.callback(...e);
}
class Xu {
  interceptions;
  interceptionKeySet;
  constructor() {
    this.interceptions = [], this.interceptionKeySet = /* @__PURE__ */ new Set();
  }
  isUsed() {
    return this.interceptions.length > 0;
  }
  intercept(e) {
    this.interceptions.push(e), Object.keys(e).forEach((n) => {
      this.interceptionKeySet.add(n);
    });
  }
  tap(e) {
    this.interceptionKeySet.has("tap") && this.interceptions.forEach((n) => {
      n.tap?.(e);
    });
  }
  call(e, ...n) {
    this.interceptionKeySet.has("call") && this.interceptions.forEach((s) => {
      s.context ? s.call?.(e, ...n) : s.call?.(...n);
    });
  }
  loop(...e) {
    this.interceptionKeySet.has("loop") && this.interceptions.forEach((n) => {
      n.loop?.(...e);
    });
  }
  error(e) {
    if (this.interceptionKeySet.has("error") && e instanceof Error) {
      const n = e;
      this.interceptions.forEach((s) => {
        s.error?.(n);
      });
    }
  }
  result(e) {
    this.interceptionKeySet.has("result") && this.interceptions.forEach((n) => {
      n.result?.(e);
    });
  }
  done() {
    this.interceptionKeySet.has("done") && this.interceptions.forEach((e) => {
      e.done?.();
    });
  }
}
class je {
  taps;
  interceptions;
  constructor() {
    this.taps = [], this.interceptions = new Xu();
  }
  tap(e, n) {
    const s = typeof e == "string" ? {
      name: e,
      context: !1
    } : {
      context: !1,
      ...e
    }, r = {
      key: Symbol(s.name),
      ...s,
      callback: n
    };
    if (r.before) {
      let c = this.taps.length;
      const a = new Set(
        Array.isArray(r.before) ? r.before : [r.before]
      );
      for (c; c > 0 && a.size > 0; c--) {
        const l = this.taps[c - 1];
        if (a.has(l.name) && a.delete(l.name), l.before && Uu(r.name, l.before))
          break;
      }
      this.taps.splice(c, 0, r);
    } else
      this.taps.push(r);
    return this.interceptions.tap(r), r;
  }
  untap(e) {
    this.taps = this.taps.filter((n) => n.key !== e.key);
  }
  isUsed() {
    return this.taps.length > 0 || this.interceptions.isUsed();
  }
  intercept(e) {
    this.interceptions.intercept(e);
  }
}
class id extends je {
  call(...e) {
    if (!this.isUsed())
      return;
    const n = {};
    this.interceptions.call(n, ...e);
    try {
      this.taps.forEach((s) => {
        $e(s, e, n);
      });
    } catch (s) {
      throw this.interceptions.error(s), s;
    }
    this.interceptions.done();
  }
}
class rd extends je {
  call(...e) {
    if (!this.isUsed())
      return;
    const n = {};
    this.interceptions.call(n, ...e);
    for (let s = 0; s < this.taps.length; s += 1) {
      const i = $e(this.taps[s], e, n);
      if (i !== void 0)
        return this.interceptions.result(i), i;
    }
    this.interceptions.done();
  }
}
class od extends je {
  call(...e) {
    const n = {};
    this.interceptions.call(n, ...e);
    let [s, ...i] = e;
    for (let r = 0; r < this.taps.length; r += 1) {
      const c = $e(this.taps[r], [s, ...i], n);
      c !== void 0 && (s = c);
    }
    return this.interceptions.result(s), s;
  }
}
class cd extends je {
  call(...e) {
    let n = !1;
    const s = {};
    this.interceptions.call(s, ...e);
    try {
      for (; n !== !0; ) {
        n = !0, this.interceptions.loop(...e);
        for (let i = 0; i < this.taps.length; i += 1)
          if ($e(this.taps[i], e, s) !== void 0) {
            n = !1;
            break;
          }
      }
    } catch (i) {
      throw this.interceptions.error(i), i;
    }
    this.interceptions.done();
  }
}
class ad extends je {
  async call(...e) {
    const n = {};
    this.interceptions.call(n, ...e), await Promise.allSettled(this.taps.map((s) => $e(s, e, n))), this.interceptions.done();
  }
}
class ld extends je {
  async call(...e) {
    const n = {};
    this.interceptions.call(n, ...e);
    try {
      const s = await Promise.race(
        this.taps.map((i) => $e(i, e, n))
      );
      return this.interceptions.result(s), s;
    } catch (s) {
      throw this.interceptions.error(s), s;
    }
  }
}
class hd extends je {
  async call(...e) {
    const n = {};
    this.interceptions.call(n, ...e);
    try {
      for (let s = 0; s < this.taps.length; s += 1)
        await $e(this.taps[s], e, n);
    } catch (s) {
      throw this.interceptions.error(s), s;
    }
    this.interceptions.done();
  }
}
class ud extends je {
  async call(...e) {
    const n = {};
    this.interceptions.call(n, ...e);
    try {
      for (let s = 0; s < this.taps.length; s += 1) {
        const i = await $e(this.taps[s], e, n);
        if (i !== void 0)
          return this.interceptions.result(i), i;
      }
    } catch (s) {
      throw this.interceptions.error(s), s;
    }
    this.interceptions.done();
  }
}
class fd extends je {
  async call(...e) {
    let [n, ...s] = e;
    const i = {};
    this.interceptions.call(i, ...e);
    try {
      for (let r = 0; r < this.taps.length; r += 1) {
        const c = await $e(
          this.taps[r],
          [n, ...s],
          i
        );
        c !== void 0 && (n = c);
      }
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
    return this.interceptions.result(n), n;
  }
}
class dd extends je {
  async call(...e) {
    let n = !1;
    const s = {};
    this.interceptions.call(s, ...e);
    try {
      for (; n !== !0; ) {
        n = !0, this.interceptions.loop(...e);
        for (let i = 0; i < this.taps.length; i += 1)
          if (await $e(this.taps[i], e, s) !== void 0) {
            n = !1;
            break;
          }
      }
    } catch (i) {
      throw this.interceptions.error(i), i;
    }
    this.interceptions.done();
  }
}
const Wu = Object.prototype.hasOwnProperty;
function $u(o, e) {
  return Wu.call(o, e);
}
function ju(o) {
  if (Array.isArray(o)) {
    const n = new Array(o.length);
    for (let s = 0; s < n.length; s++)
      n[s] = "" + s;
    return n;
  }
  if (Object.keys)
    return Object.keys(o);
  let e = [];
  for (let n in o)
    $u(o, n) && e.push(n);
  return e;
}
function Sn(o) {
  switch (typeof o) {
    case "object":
      return JSON.parse(JSON.stringify(o));
    //Faster than ES5 clone - http://jsperf.com/deep-cloning-of-objects/5
    case "undefined":
      return null;
    //this is how JSON.stringify behaves for array items
    default:
      return o;
  }
}
function kr(o) {
  let e = 0;
  const n = o.length;
  let s;
  for (; e < n; ) {
    if (s = o.charCodeAt(e), s >= 48 && s <= 57) {
      e++;
      continue;
    }
    return !1;
  }
  return !0;
}
function Gu(o) {
  return o.replace(/~1/g, "/").replace(/~0/g, "~");
}
function Rr(o) {
  if (o === void 0)
    return !0;
  if (o) {
    if (Array.isArray(o)) {
      for (let n = 0, s = o.length; n < s; n++)
        if (Rr(o[n]))
          return !0;
    } else if (typeof o == "object") {
      const n = ju(o), s = n.length;
      for (var e = 0; e < s; e++)
        if (Rr(o[n[e]]))
          return !0;
    }
  }
  return !1;
}
function yc(o, e) {
  const n = [o];
  for (const s in e) {
    const i = typeof e[s] == "object" ? JSON.stringify(e[s], null, 2) : e[s];
    typeof i < "u" && n.push(`${s}: ${i}`);
  }
  return n.join(`
`);
}
class Zu extends Error {
  constructor(e, n, s, i, r) {
    super(yc(e, { name: n, index: s, operation: i, tree: r })), this.name = n, this.index = s, this.operation = i, this.tree = r, Object.setPrototypeOf(this, new.target.prototype), this.message = yc(e, { name: n, index: s, operation: i, tree: r });
  }
}
const Bt = Zu, Ju = Sn, Vn = {
  add: function(o, e, n) {
    return o[e] = this.value, { newDocument: n };
  },
  remove: function(o, e, n) {
    var s = o[e];
    return delete o[e], { newDocument: n, removed: s };
  },
  replace: function(o, e, n) {
    var s = o[e];
    return o[e] = this.value, { newDocument: n, removed: s };
  },
  move: function(o, e, n) {
    let s = Si(n, this.path);
    s && (s = Sn(s));
    const i = Tn(
      n,
      { op: "remove", path: this.from }
    ).removed;
    return Tn(n, { op: "add", path: this.path, value: i }), { newDocument: n, removed: s };
  },
  copy: function(o, e, n) {
    const s = Si(n, this.from);
    return Tn(
      n,
      { op: "add", path: this.path, value: Sn(s) }
    ), { newDocument: n };
  },
  test: function(o, e, n) {
    return { newDocument: n, test: zs(o[e], this.value) };
  },
  _get: function(o, e, n) {
    return this.value = o[e], { newDocument: n };
  }
};
var Qu = {
  add: function(o, e, n) {
    return kr(e) ? o.splice(e, 0, this.value) : o[e] = this.value, { newDocument: n, index: e };
  },
  remove: function(o, e, n) {
    var s = o.splice(e, 1);
    return { newDocument: n, removed: s[0] };
  },
  replace: function(o, e, n) {
    var s = o[e];
    return o[e] = this.value, { newDocument: n, removed: s };
  },
  move: Vn.move,
  copy: Vn.copy,
  test: Vn.test,
  _get: Vn._get
};
function Si(o, e) {
  if (e == "")
    return o;
  var n = { op: "_get", path: e };
  return Tn(o, n), n.value;
}
function Tn(o, e, n = !1, s = !0, i = !0, r = 0) {
  if (n && (typeof n == "function" ? n(e, 0, o, e.path) : Ii(e, 0)), e.path === "") {
    let c = { newDocument: o };
    if (e.op === "add")
      return c.newDocument = e.value, c;
    if (e.op === "replace")
      return c.newDocument = e.value, c.removed = o, c;
    if (e.op === "move" || e.op === "copy")
      return c.newDocument = Si(o, e.from), e.op === "move" && (c.removed = o), c;
    if (e.op === "test") {
      if (c.test = zs(o, e.value), c.test === !1)
        throw new Bt("Test operation failed", "TEST_OPERATION_FAILED", r, e, o);
      return c.newDocument = o, c;
    } else {
      if (e.op === "remove")
        return c.removed = o, c.newDocument = null, c;
      if (e.op === "_get")
        return e.value = o, c;
      if (n)
        throw new Bt("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", r, e, o);
      return c;
    }
  } else {
    s || (o = Sn(o));
    const a = (e.path || "").split("/");
    let l = o, h = 1, u = a.length, f, d, y;
    for (typeof n == "function" ? y = n : y = Ii; ; ) {
      if (d = a[h], d && d.indexOf("~") != -1 && (d = Gu(d)), i && (d == "__proto__" || d == "prototype" && h > 0 && a[h - 1] == "constructor"))
        throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");
      if (n && f === void 0 && (l[d] === void 0 ? f = a.slice(0, h).join("/") : h == u - 1 && (f = e.path), f !== void 0 && y(e, 0, o, f)), h++, Array.isArray(l)) {
        if (d === "-")
          d = l.length;
        else {
          if (n && !kr(d))
            throw new Bt("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", r, e, o);
          kr(d) && (d = ~~d);
        }
        if (h >= u) {
          if (n && e.op === "add" && d > l.length)
            throw new Bt("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", r, e, o);
          const x = Qu[e.op].call(e, l, d, o);
          if (x.test === !1)
            throw new Bt("Test operation failed", "TEST_OPERATION_FAILED", r, e, o);
          return x;
        }
      } else if (h >= u) {
        const x = Vn[e.op].call(e, l, d, o);
        if (x.test === !1)
          throw new Bt("Test operation failed", "TEST_OPERATION_FAILED", r, e, o);
        return x;
      }
      if (l = l[d], n && h < u && (!l || typeof l != "object"))
        throw new Bt("Cannot perform operation at the desired path", "OPERATION_PATH_UNRESOLVABLE", r, e, o);
    }
  }
}
function Ea(o, e, n, s = !0, i = !0) {
  if (n && !Array.isArray(e))
    throw new Bt("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
  s || (o = Sn(o));
  const r = new Array(e.length);
  for (let c = 0, a = e.length; c < a; c++)
    r[c] = Tn(o, e[c], n, !0, i, c), o = r[c].newDocument;
  return r.newDocument = o, r;
}
function Ku(o, e, n) {
  const s = Tn(o, e);
  if (s.test === !1)
    throw new Bt("Test operation failed", "TEST_OPERATION_FAILED", n, e, o);
  return s.newDocument;
}
function Ii(o, e, n, s) {
  if (typeof o != "object" || o === null || Array.isArray(o))
    throw new Bt("Operation is not an object", "OPERATION_NOT_AN_OBJECT", e, o, n);
  if (Vn[o.op]) {
    if (typeof o.path != "string")
      throw new Bt("Operation `path` property is not a string", "OPERATION_PATH_INVALID", e, o, n);
    if (o.path.indexOf("/") !== 0 && o.path.length > 0)
      throw new Bt('Operation `path` property must start with "/"', "OPERATION_PATH_INVALID", e, o, n);
    if ((o.op === "move" || o.op === "copy") && typeof o.from != "string")
      throw new Bt("Operation `from` property is not present (applicable in `move` and `copy` operations)", "OPERATION_FROM_REQUIRED", e, o, n);
    if ((o.op === "add" || o.op === "replace" || o.op === "test") && o.value === void 0)
      throw new Bt("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_REQUIRED", e, o, n);
    if ((o.op === "add" || o.op === "replace" || o.op === "test") && Rr(o.value))
      throw new Bt("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED", e, o, n);
    if (n) {
      if (o.op == "add") {
        var i = o.path.split("/").length, r = s.split("/").length;
        if (i !== r + 1 && i !== r)
          throw new Bt("Cannot perform an `add` operation at the desired path", "OPERATION_PATH_CANNOT_ADD", e, o, n);
      } else if (o.op === "replace" || o.op === "remove" || o.op === "_get") {
        if (o.path !== s)
          throw new Bt("Cannot perform the operation at a path that does not exist", "OPERATION_PATH_UNRESOLVABLE", e, o, n);
      } else if (o.op === "move" || o.op === "copy") {
        var c = { op: "_get", path: o.from, value: void 0 }, a = La([c], n);
        if (a && a.name === "OPERATION_PATH_UNRESOLVABLE")
          throw new Bt("Cannot perform the operation from a path that does not exist", "OPERATION_FROM_UNRESOLVABLE", e, o, n);
      }
    }
  } else throw new Bt("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", e, o, n);
}
function La(o, e, n) {
  try {
    if (!Array.isArray(o))
      throw new Bt("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
    if (e)
      Ea(Sn(e), Sn(o), n || !0);
    else {
      n = n || Ii;
      for (var s = 0; s < o.length; s++)
        n(o[s], s, e, void 0);
    }
  } catch (i) {
    if (i instanceof Bt)
      return i;
    throw i;
  }
}
function zs(o, e) {
  if (o === e) return !0;
  if (o && e && typeof o == "object" && typeof e == "object") {
    var n = Array.isArray(o), s = Array.isArray(e), i, r, c;
    if (n && s) {
      if (r = o.length, r != e.length) return !1;
      for (i = r; i-- !== 0; )
        if (!zs(o[i], e[i])) return !1;
      return !0;
    }
    if (n != s) return !1;
    var a = Object.keys(o);
    if (r = a.length, r !== Object.keys(e).length)
      return !1;
    for (i = r; i-- !== 0; )
      if (!e.hasOwnProperty(a[i])) return !1;
    for (i = r; i-- !== 0; )
      if (c = a[i], !zs(o[c], e[c])) return !1;
    return !0;
  }
  return o !== o && e !== e;
}
const yd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JsonPatchError: Bt,
  _areEquals: zs,
  applyOperation: Tn,
  applyPatch: Ea,
  applyReducer: Ku,
  deepClone: Ju,
  getValueByPointer: Si,
  validate: La,
  validator: Ii
}, Symbol.toStringTag, { value: "Module" }));
class xd {
  currentState;
  context;
  config;
  listeners = [];
  constructor(e) {
    this.config = e, this.currentState = e.initial, this.context = e.context;
  }
  // 获取当前状态
  getState() {
    return this.currentState;
  }
  // 获取当前上下文
  getContext() {
    return this.context;
  }
  // 发送事件
  send(e, n) {
    const s = this.config.states[this.currentState], i = s.on?.[e];
    if (!i)
      return console.warn(
        `事件 "${e}" 在当前状态 "${this.currentState}" 下无效`
      ), !1;
    s.onExit?.(this.context, this);
    const r = this.currentState;
    return i.action && (this.context = i.action(this.context, {
      type: e,
      prevState: r,
      payload: n
    }, this)), this.currentState = i.target, this.config.states[this.currentState].onEnter?.(this.context, this), this.listeners.forEach(
      (c) => c(this.currentState, this.context)
    ), !0;
  }
  // 监听状态变化
  subscribe(e) {
    return this.listeners.push(e), () => {
      this.listeners = this.listeners.filter((n) => n !== e);
    };
  }
  // 重置到初始状态
  reset() {
    this.currentState = this.config.initial, this.context = this.config.context, this.listeners.forEach(
      (e) => e(this.currentState, this.context)
    );
  }
}
class Sa {
  ctx;
  current;
  options;
  dirty = !1;
  version = 0;
  constructor(e, n) {
    this.ctx = e, this.options = n, this.current = this.options.default ? this.options.default(this.ctx) : null;
  }
  // 重置状态值为默认值
  default() {
    this.update(this.options.default ? this.options.default(this.ctx) : null, !0);
  }
  markDrity() {
    this.dirty = !0;
  }
  refresh() {
    this.update(this.current, !0);
  }
  get() {
    return this.current;
  }
  map(e) {
    return this.options.map ? this.options.map(this.ctx, e) : e;
  }
  equals(e, n) {
    return this.options.equals ? this.options.equals(this.ctx, e, n) : e === n;
  }
  update(e, n = !1) {
    const s = this.current;
    return n || this.dirty || !this.equals(s, e) ? (this.dirty = !1, this.version++, this.current = e, this.options.update?.(this.ctx, this.current, s), !0) : !1;
  }
  set(e) {
    const n = this.map(e);
    return this.update(n);
  }
  copy(e) {
    return this.ctx = e.ctx, this.current = e.current, this.dirty = e.dirty, this.version = e.version, this.options = { ...e.options }, this;
  }
  clone() {
    return new Sa(this.ctx, this.options).copy(this);
  }
}
const tf = (o) => {
  bn && bn.add(o);
};
let bn = null;
class pd {
  static add = tf;
  static mixin(e, n = {}) {
    const s = e.prototype.dispose;
    e.prototype.isDisposed = !1, e.prototype.dispose = function() {
      this.isDisposed || (this.isDisposed = !0, n.dispose?.(this), s?.call(e));
    }, e.prototype.disposeLater = function() {
      bn && !this.__isDisposed && bn.add(this);
    };
  }
  disposables = [];
  persistentDisposables = [];
  add(e) {
    this.disposables.push(e);
  }
  addPersistent(e) {
    this.persistentDisposables.push(e);
  }
  destroy() {
    this.dispose();
    for (let e = 0; e < this.persistentDisposables.length; e++)
      this.persistentDisposables[e].dispose();
    this.persistentDisposables.length = 0;
  }
  dispose() {
    for (let e = 0; e < this.disposables.length; e++)
      this.disposables[e].dispose();
    this.disposables.length = 0;
  }
  run(e) {
    let n = bn;
    try {
      return bn = this, e();
    } finally {
      this.dispose(), bn = n;
    }
  }
}
class md {
  // 标志要知道列表当前是否正在触发
  firing = !1;
  // 非遗忘列表的最后火值
  memory;
  // 标志要知道清单是否已经被解雇
  fired = !1;
  // 标志以防止射击
  locked = !1;
  // 实际回调列表
  list = [];
  // 可重复列表的执行数据队列
  queue = [];
  // 当前发射回调的索引（根据需要通过add/删除修改）
  firingIndex = -1;
  destroyedList = !1;
  options = { once: !1, memory: !0, unique: !0, stopOnFalse: !1 };
  constructor(e) {
    this.options = Object.assign(this.options, e ?? {});
  }
  // Fire callbacks
  _fire() {
    const e = this.queue;
    for (this.locked = this.locked || this.options.once, this.fired = this.firing = !0; e.length; this.firingIndex = -1)
      for (this.memory = e.shift(); ++this.firingIndex < this.list.length; )
        this.list[this.firingIndex].apply(this.memory[0], this.memory[1]) === !1 && this.options.stopOnFalse && (this.firingIndex = this.list.length, this.memory = !1);
    this.options.memory || (this.memory = !1), this.firing = !1, this.locked && (this.memory ? this.list = [] : (this.list = [], this.destroyedList = !0));
  }
  add(...e) {
    return this.destroyedList || (this.memory && !this.firing && (this.firingIndex = this.list.length - 1, this.queue.push(this.memory)), e.forEach((n) => {
      typeof n == "function" ? (!this.options.unique || !this.has(n)) && this.list.push(n) : n && n.length && Array.isArray(n) && this.add(...n);
    }), this.memory && !this.firing && this._fire()), this;
  }
  // Remove a callback from the list
  remove(...e) {
    return e.forEach((n) => {
      for (var s = 0; (s = this.list.indexOf(n, s)) > -1; )
        this.list.splice(s, 1), s <= this.firingIndex && this.firingIndex--;
    }), this;
  }
  // Check if a given callback is in the list.
  // If no argument is given, return whether or not list has callbacks attached.
  has(e) {
    return e ? this.list.indexOf(e) > -1 : this.list.length > 0;
  }
  // Remove all callbacks from the list
  empty() {
    return this.list && (this.list = []), this;
  }
  //禁用.fire和.add
  //流产任何当前/待处理的执行
  //清除所有回调和值
  disable() {
    return this.locked = !0, this.queue = [], this.list = [], this.destroyedList = !0, this.memory = null, this;
  }
  disabled() {
    return this.destroyedList;
  }
  //禁用.fire
  //也禁用.ADD，除非我们有内存（因为它没有效果）
  //中止任何待处理的执行
  lock() {
    return this.locked = !0, this.queue = [], !this.memory && !this.firing && (this.list = [], this.memory = null, this.destroyedList = !0), this;
  }
  // 用给定上下文和参数调用所有回调    
  fireWith(e, n) {
    return this.locked || (n = n || [], n = [e, n.slice ? n.slice() : n], this.queue.push(n), this.firing || this._fire()), this;
  }
  // 用给定参数调用所有回调   
  fire(...e) {
    return this.fireWith(this, e), this;
  }
}
class gd {
  proxy;
  listeners = [];
  rawToProxy = /* @__PURE__ */ new WeakMap();
  proxyToRaw = /* @__PURE__ */ new WeakMap();
  constructor(e) {
    this.proxy = this.createProxy(e, "");
  }
  get value() {
    return this.proxy;
  }
  subscribe(e) {
    return this.listeners.push(e), () => {
      this.listeners = this.listeners.filter((n) => n !== e);
    };
  }
  notify(e) {
    this.listeners.forEach((n) => n(e));
  }
  createProxy(e, n) {
    if (this.proxyToRaw.has(e))
      return this.proxyToRaw.get(e);
    const s = this.rawToProxy.get(e);
    if (s) return s;
    const i = {
      get: (c, a, l) => {
        const h = Reflect.get(c, a, l);
        if (typeof h == "object" && h !== null) {
          const u = n ? `${n}.${String(a)}` : String(a);
          return this.createProxy(h, u);
        }
        return h;
      },
      set: (c, a, l, h) => {
        const u = Reflect.get(c, a, h);
        if (u !== l) {
          const f = Reflect.set(c, a, l, h), d = n ? `${n}.${String(a)}` : String(a);
          return this.notify({ path: d, parent: n, field: String(a), newValue: l, oldValue: u }), f;
        }
        return !0;
      }
      // 可能需要处理删除属性等
    }, r = new Proxy(e, i);
    return this.rawToProxy.set(e, r), this.proxyToRaw.set(r, e), r;
  }
}
function Fr(o, e) {
  let n = o.length;
  o.push(e);
  t: for (; 0 < n; ) {
    let s = n - 1 >>> 1, i = o[s];
    if (0 < vi(i, e))
      o[s] = e, o[n] = i, n = s;
    else break t;
  }
}
function We(o) {
  return o.length === 0 ? null : o[0];
}
function qi(o) {
  if (o.length === 0)
    return null;
  let e = o[0], n = o.pop();
  if (n !== e) {
    o[0] = n;
    t: for (let s = 0, i = o.length, r = i >>> 1; s < r; ) {
      let c = 2 * (s + 1) - 1, a = o[c], l = c + 1, h = o[l];
      if (0 > vi(a, n))
        l < i && 0 > vi(h, a) ? (o[s] = h, o[l] = n, s = l) : (o[s] = a, o[c] = n, s = c);
      else if (l < i && 0 > vi(h, n))
        o[s] = h, o[l] = n, s = l;
      else
        break t;
    }
  }
  return e;
}
function vi(o, e) {
  const n = o.sortIndex - e.sortIndex;
  return n !== 0 ? n : o.id - e.id;
}
const wd = 0, Gr = 1, Zr = 2, ts = 3, Ia = 4, qa = 5, ef = !1, Da = 5, nf = 250, sf = 5e3, rf = 1e4, vd = !0, Md = !0;
let In;
const of = (
  // $FlowFixMe[method-unbinding]
  typeof performance == "object" && typeof performance.now == "function"
);
if (of) {
  const o = performance;
  In = () => o.now();
} else {
  const o = Date, e = o.now();
  In = () => o.now() - e;
}
let cf = 1073741823, Qe = [], dn = [], af = 1, Te = null, fe = ts, zr = !1, Cs = !1, Ns = !1;
const Oa = typeof setTimeout == "function" ? setTimeout : null, lf = typeof clearTimeout == "function" ? clearTimeout : null, xc = typeof globalThis.setImmediate < "u" ? globalThis.setImmediate : null;
function Mi(o) {
  let e = We(dn);
  for (; e !== null; ) {
    if (e.callback === null)
      qi(dn);
    else if (e.startTime <= o)
      qi(dn), e.sortIndex = e.expirationTime, Fr(Qe, e);
    else
      return;
    e = We(dn);
  }
}
function Jr(o) {
  if (Ns = !1, Mi(o), !Cs)
    if (We(Qe) !== null)
      Cs = !0, Ra();
    else {
      const e = We(dn);
      e !== null && Qr(Jr, e.startTime - o);
    }
}
function hf(o) {
  Cs = !1, Ns && (Ns = !1, Fa()), zr = !0;
  const e = fe;
  try {
    if (!ef) return uf(o);
  } finally {
    Te = null, fe = e, zr = !1;
  }
}
function uf(o) {
  let e = o;
  for (Mi(e), Te = We(Qe); Te !== null; ) {
    const n = Te.callback;
    if (typeof n == "function") {
      Te.callback = null, fe = Te.priorityLevel;
      const s = Te.expirationTime <= e, i = n(s);
      if (e = In(), typeof i == "function")
        return Te.callback = i, Mi(e), !0;
      Te === We(Qe) && qi(Qe), Mi(e);
    } else
      qi(Qe);
    if (Te = We(Qe), Te === null || Te.expirationTime > e)
      break;
  }
  if (Te !== null)
    return !0;
  {
    const n = We(dn);
    return n !== null && Qr(Jr, n.startTime - e), !1;
  }
}
function bd(o, e) {
  switch (o) {
    case Gr:
    case Zr:
    case ts:
    case Ia:
    case qa:
      break;
    default:
      o = ts;
  }
  let n = fe;
  fe = o;
  try {
    return e();
  } finally {
    fe = n;
  }
}
function _d(o) {
  let e;
  switch (fe) {
    case Gr:
    case Zr:
    case ts:
      e = ts;
      break;
    default:
      e = fe;
      break;
  }
  let n = fe;
  fe = e;
  try {
    return o();
  } finally {
    fe = n;
  }
}
function Td(o) {
  let e = fe;
  return function(...n) {
    let s = fe;
    fe = e;
    try {
      return o.apply(this, n);
    } finally {
      fe = s;
    }
  };
}
function Pd(o, e, n) {
  let s = In(), i;
  if (typeof n == "object" && n !== null) {
    let l = n.delay;
    typeof l == "number" && l > 0 ? i = s + l : i = s;
  } else
    i = s;
  let r;
  switch (o) {
    case Gr:
      r = -1;
      break;
    case Zr:
      r = nf;
      break;
    case qa:
      r = cf;
      break;
    case Ia:
      r = rf;
      break;
    case ts:
    default:
      r = sf;
      break;
  }
  let c = i + r, a = {
    id: af++,
    callback: e,
    priorityLevel: o,
    startTime: i,
    expirationTime: c,
    sortIndex: -1
  };
  return i > s ? (a.sortIndex = i, Fr(dn, a), We(Qe) === null && a === We(dn) && (Ns ? Fa() : Ns = !0, Qr(Jr, i - s))) : (a.sortIndex = c, Fr(Qe, a), !Cs && !zr && (Cs = !0, Ra())), a;
}
function Ad(o) {
  o.callback = null;
}
function Ed() {
  return fe;
}
let Di = !1, Cr = -1, Nr = Da, ka = -1;
function Ld() {
  return !(In() - ka < Nr);
}
function Sd() {
}
function Id(o) {
  if (o < 0 || o > 125) {
    console.error(
      "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
    );
    return;
  }
  o > 0 ? Nr = Math.floor(1e3 / o) : Nr = Da;
}
const or = () => {
  if (Di) {
    const o = In();
    ka = o;
    let e = !0;
    try {
      e = hf(o);
    } finally {
      e ? bs() : Di = !1;
    }
  }
};
let bs;
if (typeof xc == "function")
  bs = () => {
    xc(or);
  };
else if (typeof MessageChannel < "u") {
  const o = new MessageChannel(), e = o.port2;
  o.port1.onmessage = or, bs = () => {
    e.postMessage(null);
  };
} else
  bs = () => {
    Oa(or, 0);
  };
function Ra() {
  Di || (Di = !0, bs());
}
function Qr(o, e) {
  Cr = Oa(() => {
    o(In());
  }, e);
}
function Fa() {
  lf(Cr), Cr = -1;
}
class qd {
  heap;
  compare;
  /**
   * 创建优先队列
   * @param compare 比较函数 (a, b) => 负数表示a应排在b前面
   */
  constructor(e) {
    this.heap = [], this.compare = e;
  }
  /**
   * 获取队列元素数量
   */
  get size() {
    return this.heap.length;
  }
  /**
   * 判断队列是否为空
   */
  isEmpty() {
    return this.size === 0;
  }
  top() {
    return this.peek();
  }
  /**
   * 查看队首元素
   */
  peek() {
    return this.isEmpty() ? null : this.heap[0];
  }
  /**
   * 入队
   * @param value 要添加的元素
   */
  enqueue(e) {
    this.heap.push(e), this.siftUp(this.size - 1);
  }
  push(e) {
    this.enqueue(e);
  }
  pop() {
    return this.dequeue();
  }
  /**
   * 出队
   * @returns 队首元素或null（空队列时）
   */
  dequeue() {
    if (this.isEmpty()) return null;
    const e = this.heap[0], n = this.heap.pop();
    return this.isEmpty() || (this.heap[0] = n, this.siftDown(0)), e;
  }
  // 上浮操作
  siftUp(e) {
    for (; e > 0; ) {
      const n = Math.floor((e - 1) / 2);
      if (this.compare(this.heap[e], this.heap[n]) >= 0) break;
      this.swap(e, n), e = n;
    }
  }
  // 下沉操作
  siftDown(e) {
    const n = this.size;
    for (; e < n; ) {
      const s = 2 * e + 1, i = 2 * e + 2;
      let r = e;
      if (s < n && this.compare(this.heap[s], this.heap[r]) < 0 && (r = s), i < n && this.compare(this.heap[i], this.heap[r]) < 0 && (r = i), r === e) break;
      this.swap(e, r), e = r;
    }
  }
  // 交换元素
  swap(e, n) {
    [this.heap[e], this.heap[n]] = [this.heap[n], this.heap[e]];
  }
  /**
   * 清空队列
   */
  clear() {
    this.heap = [];
  }
}
const Hr = [];
let gs = -1;
const Dd = (o) => ({
  current: o
}), Od = (o, e) => {
  Hr[++gs] = o.current, o.current = e;
}, kd = (o) => {
  gs < 0 || (o.current = Hr[gs], Hr[gs] = null, gs--);
};
var za = /* @__PURE__ */ ((o) => (o[o.Butt = 0] = "Butt", o[o.Round = 1] = "Round", o[o.Square = 2] = "Square", o))(za || {}), Ca = /* @__PURE__ */ ((o) => (o[o.Miter = 0] = "Miter", o[o.Round = 1] = "Round", o[o.Bevel = 2] = "Bevel", o))(Ca || {});
const ff = {
  0: "butt",
  1: "round",
  2: "square"
}, df = {
  0: "miter",
  1: "round",
  2: "bevel"
};
function yf(o) {
  return ff[o];
}
function xf(o) {
  return df[o];
}
function pf(o, e) {
  let n;
  switch (e.elementType) {
    case "linear-gradient": {
      const s = e;
      n = o.createLinearGradient(s.x0, s.y0, s.x1, s.y1);
      break;
    }
    case "radial-gradient": {
      const s = e;
      n = o.createRadialGradient(s.x0, s.y0, s.r0, s.x1, s.y1, s.r1);
      break;
    }
    case "conic-gradient": {
      const s = e, i = o;
      i.createConicGradient ? n = i.createConicGradient(s.startAngle, s.x, s.y) : n = o.createRadialGradient(s.x, s.y, 0, s.x, s.y, Math.max(o.canvas.width, o.canvas.height));
      break;
    }
    default:
      throw new Error(`Unknown gradient type: ${e.elementType}`);
  }
  for (const s of e.stops)
    n.addColorStop(s.offset, Ve.toCSS_RGBA(s.color));
  return n;
}
function pc(o, e, n) {
  if (!n)
    return Ve.toCSS_RGBA(e);
  if (n.type === "pattern") {
    const s = n;
    return o.createPattern(s.source, s.repeat ?? "repeat");
  }
  return n.type === "gradient" ? pf(o, n) : Ve.toCSS_RGBA(e);
}
function mf(o, e, n = 0) {
  e ? (o.setLineDash(e), o.lineDashOffset = n) : o.setLineDash([]);
}
var gf = /* @__PURE__ */ ((o) => (o[o.Fill = 0] = "Fill", o[o.Stroke = 1] = "Stroke", o[o.FillAndStroke = 2] = "FillAndStroke", o))(gf || {}), wf = /* @__PURE__ */ ((o) => (o.SourceOver = "source-over", o.SourceIn = "source-in", o.SourceOut = "source-out", o.SourceAtop = "source-atop", o.DestinationOver = "destination-over", o.DestinationIn = "destination-in", o.DestinationOut = "destination-out", o.DestinationAtop = "destination-atop", o.Lighter = "lighter", o.Copy = "copy", o.Xor = "xor", o.Multiply = "multiply", o.Screen = "screen", o.Overlay = "overlay", o.Darken = "darken", o.Lighten = "lighten", o.ColorDodge = "color-dodge", o.ColorBurn = "color-burn", o.HardLight = "hard-light", o.SoftLight = "soft-light", o.Difference = "difference", o.Exclusion = "exclusion", o.Hue = "hue", o.Saturation = "saturation", o.Color = "color", o.Luminosity = "luminosity", o))(wf || {});
class Na {
  // ---- 核心属性 ----
  /** 填充/描边颜色 */
  color;
  /** 绘制样式 */
  style;
  /** 描边宽度（像素） */
  strokeWidth;
  /** 描边端点样式 */
  strokeCap;
  /** 描边连接样式 */
  strokeJoin;
  /** 斜接限制（仅 StrokeJoin.Miter 时生效） */
  strokeMiter;
  /** 全局透明度 (0-1) */
  alpha;
  /** 是否开启抗锯齿 */
  antiAlias;
  /** 混合模式 */
  blendMode;
  /** shader（渐变/图案/纯色），优先级高于 color。类似 Skia 的 setShader */
  shader;
  // ---- 虚线 ----
  /** 虚线间隔数组（如 [5, 3] 表示 5px 实线 + 3px 空白），null 表示实线 */
  dashIntervals;
  /** 虚线偏移（相位） */
  dashOffset;
  constructor() {
    this.color = new Ve(0, 0, 0, 1), this.style = 0, this.strokeWidth = 1, this.strokeCap = za.Butt, this.strokeJoin = Ca.Miter, this.strokeMiter = 10, this.alpha = 1, this.antiAlias = !0, this.blendMode = "source-over", this.shader = null, this.dashIntervals = null, this.dashOffset = 0;
  }
  // ==================== 便捷设置方法 ====================
  /** 设置颜色 */
  setColor(e) {
    return this.color.set(e), this;
  }
  /** 设置描边宽度 */
  setStrokeWidth(e) {
    return this.strokeWidth = e, this;
  }
  /** 设置透明度 */
  setAlpha(e) {
    return this.alpha = Math.max(0, Math.min(1, e)), this;
  }
  /** 设置抗锯齿 */
  setAntiAlias(e) {
    return this.antiAlias = e, this;
  }
  /** 设置混合模式 */
  setBlendMode(e) {
    return this.blendMode = e, this;
  }
  /** 设置 shader，替代纯色 */
  setShader(e) {
    return this.shader = e, this;
  }
  /** 设置虚线 */
  setDash(e, n = 0) {
    return this.dashIntervals = e.slice(), this.dashOffset = n, this;
  }
  // ==================== 应用方法 ====================
  /**
   * 将 Paint 的填充属性应用到 Canvas 2D 上下文。
   */
  applyFillTo(e) {
    e.globalAlpha = this.alpha, e.globalCompositeOperation = this.blendMode, e.fillStyle = this.shader ? this.shader.toCanvasStyle(e, this.color) : pc(e, this.color);
  }
  /**
   * 将 Paint 的描边属性应用到 Canvas 2D 上下文。
   */
  applyStrokeTo(e) {
    e.globalAlpha = this.alpha, e.globalCompositeOperation = this.blendMode, e.lineWidth = this.strokeWidth, e.lineCap = yf(this.strokeCap), e.lineJoin = xf(this.strokeJoin), e.miterLimit = this.strokeMiter, e.strokeStyle = this.shader ? this.shader.toCanvasStyle(e, this.color) : pc(e, this.color), mf(e, this.dashIntervals, this.dashOffset);
  }
  /**
   * 根据当前 style 应用全部绘制属性。
   * - PaintStyle.Fill → 仅填充
   * - PaintStyle.Stroke → 仅描边
   * - PaintStyle.FillAndStroke → 两者
   */
  applyTo(e) {
    (this.style === 0 || this.style === 2) && this.applyFillTo(e), (this.style === 1 || this.style === 2) && this.applyStrokeTo(e);
  }
  // ==================== 复制 / 克隆 ====================
  /** 深拷贝到目标 Paint */
  copy(e) {
    e.color.set(this.color), e.style = this.style, e.strokeWidth = this.strokeWidth, e.strokeCap = this.strokeCap, e.strokeJoin = this.strokeJoin, e.strokeMiter = this.strokeMiter, e.alpha = this.alpha, e.antiAlias = this.antiAlias, e.blendMode = this.blendMode, e.shader = this.shader, e.dashIntervals = this.dashIntervals ? this.dashIntervals.slice() : null, e.dashOffset = this.dashOffset;
  }
  /** 创建副本 */
  clone() {
    const e = new Na();
    return this.copy(e), e;
  }
}
var vf = /* @__PURE__ */ ((o) => (o.Clamp = "clamp", o.Repeat = "repeat", o.Mirror = "mirror", o.Decal = "decal", o))(vf || {}), Mf = /* @__PURE__ */ ((o) => (o[o.Color = 0] = "Color", o[o.LinearGradient = 1] = "LinearGradient", o[o.RadialGradient = 2] = "RadialGradient", o[o.SweepGradient = 3] = "SweepGradient", o[o.Image = 4] = "Image", o))(Mf || {});
class Ze {
  // ---- 实例 ----
  constructor(e, n = null) {
    this._data = e, this._localMatrix = n;
  }
  // ---- 静态工厂 ----
  /** 纯色着色器 */
  static makeColor(e) {
    return new Ze({
      kind: 0,
      color: [e[0], e[1], e[2], e[3] ?? 1]
    });
  }
  /** 线性渐变着色器 */
  static makeLinearGradient(e, n, s, i, r) {
    return new Ze({
      kind: 1,
      startX: e,
      startY: n,
      endX: s,
      endY: i,
      stops: r.slice()
    });
  }
  /** 径向渐变着色器（圆心 + 半径） */
  static makeRadialGradient(e, n, s, i) {
    return new Ze({
      kind: 2,
      centerX: e,
      centerY: n,
      radius: s,
      stops: i.slice()
    });
  }
  /** 扫描渐变（锥形渐变）着色器 */
  static makeSweepGradient(e, n, s, i) {
    return new Ze({
      kind: 3,
      centerX: e,
      centerY: n,
      startAngle: s,
      stops: i.slice()
    });
  }
  /** 图片着色器 */
  static makeImage(e, n = "clamp", s = "clamp") {
    return new Ze({
      kind: 4,
      image: e,
      tileModeX: n,
      tileModeY: s
    });
  }
  /** 着色器类型 */
  get kind() {
    return this._data.kind;
  }
  /** 本地变换矩阵（没有则为 null） */
  get localMatrix() {
    return this._localMatrix;
  }
  // ---- Skia 风格 API ----
  setMatrix(e) {
    this._localMatrix || (this._localMatrix = It.identity()), this._localMatrix.fromArray(e);
  }
  /**
   * 返回一个新的 shader，将给定矩阵作为其本地变换。
   * 本地矩阵在 shader 生成的坐标空间中生效。
   */
  withLocalMatrix(e) {
    const n = this._localMatrix ? this._localMatrix.clone().multiply(e) : It.fromArray(e);
    return new Ze(this._data, n);
  }
  /**
   * 返回一个新的 shader，重置本地矩阵为单位矩阵。
   */
  resetLocalMatrix() {
    return this._localMatrix ? new Ze(this._data, null) : this;
  }
  // ---- 转换到 Canvas ----
  /**
   * 将 shader 转换为 Canvas fillStyle / strokeStyle 可接受的值。
   * 如果 shader 无法应用（如图片未加载），回退到 fallbackColor。
   */
  toCanvasStyle(e, n) {
    const s = this._localMatrix !== null;
    if (s) {
      e.save();
      const r = this._localMatrix;
      e.setTransform(r[0], r[1], r[2], r[3], r[4], r[5]);
    }
    let i;
    switch (this._data.kind) {
      case 0: {
        i = Ve.toCSS_RGBA(this._data.color);
        break;
      }
      case 1: {
        const r = this._data, c = e.createLinearGradient(r.startX, r.startY, r.endX, r.endY);
        for (const a of r.stops)
          c.addColorStop(a.offset, Ve.toCSS_RGBA(a.color));
        i = c;
        break;
      }
      case 2: {
        const r = this._data, c = e.createRadialGradient(r.centerX, r.centerY, 0, r.centerX, r.centerY, r.radius);
        for (const a of r.stops)
          c.addColorStop(a.offset, Ve.toCSS_RGBA(a.color));
        i = c;
        break;
      }
      case 3: {
        const r = this._data, c = e;
        let a;
        c.createConicGradient ? a = c.createConicGradient(r.startAngle, r.centerX, r.centerY) : a = e.createRadialGradient(
          r.centerX,
          r.centerY,
          0,
          r.centerX,
          r.centerY,
          Math.max(e.canvas.width, e.canvas.height)
        );
        for (const l of r.stops)
          a.addColorStop(l.offset, Ve.toCSS_RGBA(l.color));
        i = a;
        break;
      }
      case 4: {
        const r = this._data, c = bf(r.tileModeX, r.tileModeY), a = e.createPattern(r.image, c);
        a ? i = a : i = Ve.toCSS_RGBA(n);
        break;
      }
      default:
        i = Ve.toCSS_RGBA(n);
    }
    return s && e.restore(), i;
  }
  // ---- 复制 ----
  /** 深拷贝 */
  clone() {
    return new Ze(this._cloneData(), this._localMatrix?.clone() ?? null);
  }
  _cloneData() {
    const e = this._data;
    switch (e.kind) {
      case 0:
        return { kind: e.kind, color: [e.color[0], e.color[1], e.color[2], e.color[3] ?? 1] };
      case 1:
        return {
          kind: e.kind,
          startX: e.startX,
          startY: e.startY,
          endX: e.endX,
          endY: e.endY,
          stops: e.stops.map((n) => ({
            offset: n.offset,
            color: n.color.slice()
          }))
        };
      case 2:
        return {
          kind: e.kind,
          centerX: e.centerX,
          centerY: e.centerY,
          radius: e.radius,
          stops: e.stops.map((n) => ({
            offset: n.offset,
            color: n.color.slice()
          }))
        };
      case 3:
        return {
          kind: e.kind,
          centerX: e.centerX,
          centerY: e.centerY,
          startAngle: e.startAngle,
          stops: e.stops.map((n) => ({
            offset: n.offset,
            color: n.color.slice()
          }))
        };
      case 4:
        return { kind: e.kind, image: e.image, tileModeX: e.tileModeX, tileModeY: e.tileModeY };
    }
  }
}
function bf(o, e) {
  const n = o === "repeat" || o === "mirror", s = e === "repeat" || e === "mirror";
  return n && s ? "repeat" : n && !s ? "repeat-x" : !n && s ? "repeat-y" : "no-repeat";
}
export {
  Aa as Animation,
  Yu as AnimationDirection,
  ke as AnimationState,
  sd as AnimationSystem,
  Bu as AnimationTrack,
  X1 as Arc,
  ld as AsyncParallelBailHook,
  ad as AsyncParallelHook,
  ud as AsyncSeriesBailHook,
  hd as AsyncSeriesHook,
  dd as AsyncSeriesLoopHook,
  fd as AsyncSeriesWaterfallHook,
  Gf as BSpline,
  W1 as Bezier,
  wf as BlendMode,
  Rl as BoolOp,
  Lt as BoundingRect,
  qn as CachePool,
  md as Callbacks,
  Zf as CatmullRom,
  V1 as Circle,
  Jl as Cmd,
  Ve as Color,
  S1 as Color2,
  dl as ColorIndex,
  Yn as Conic,
  xi as ConicSection,
  nl as ConicType,
  Ts as CubicBezier,
  Ya as DEG_TO_RAD,
  pd as DisposableManager,
  Hs as EPSILON,
  Jn as Easing,
  U1 as Ellipse,
  rh as Entry,
  R0 as EventEmitter,
  G1 as EventSystem,
  j1 as EventTarget,
  sn as Geometry,
  ar as Hermite,
  qa as IdlePriority,
  Gr as ImmediatePriority,
  a1 as Lagrange,
  H1 as Line,
  Vl as LineCap,
  Yl as LineJoin,
  p1 as LinkedList,
  Ia as LowPriority,
  It as Matrix2D,
  vl as MatrixIndex,
  l1 as NURBS,
  wd as NoPriority,
  xn as NodeEvent,
  ts as NormalPriority,
  gd as ObservableObject,
  Sa as Option,
  De as OrientedBoundingRect,
  Bs as PI,
  Af as PI_2,
  Ef as PI_4,
  Na as Paint,
  Ze as PaintShader,
  gf as PaintStyle,
  tn as PathBuilder,
  Dl as PathCmd,
  Nt as PathCommand,
  Oc as PathCommandData,
  Bl as PathCommandType,
  Ol as PathDirection,
  Qs as PathSegmentType,
  f1 as PathStroke,
  Il as PathVerb,
  ql as PathVerbCount,
  td as PluginService,
  st as Point,
  Fs as PointerEvent,
  Z1 as PointerEventSystem,
  ba as Polygon,
  qd as PriorityQueue,
  Fc as ProxyPath2D,
  Ps as QuadraticBezier,
  Va as RAD_TO_DEG,
  d1 as RTree,
  B1 as Rect,
  $1 as RoundRect,
  Mf as ShaderKind,
  xd as StateMachine,
  za as StrokeCap,
  Ca as StrokeJoin,
  rd as SyncBailHook,
  id as SyncHook,
  cd as SyncLoopHook,
  od as SyncWaterfallHook,
  Lf as TWO_PI,
  Ft as Ticker,
  vf as TileMode,
  Vu as Timeline,
  y1 as Transform,
  Y1 as Triangle,
  Zr as UserBlockingPriority,
  ht as Vector2,
  x1 as Viewport,
  tf as addDisposable,
  N1 as angleDelta,
  mf as applyCanvasDash,
  Uf as arcLength,
  Ba as arcToCubic,
  Tf as arcToOval,
  Oi as bernstein,
  J1 as bezier,
  Cu as buildKeyframes,
  _f as centerToEndpoint,
  nn as clamp,
  D1 as clipper,
  zu as createCubicBezierEasing,
  Dd as createCursor,
  He as cubicAt,
  m1 as cubicDerivativeAt,
  Yf as cubicEvaluate,
  w1 as cubicExtrema,
  b1 as cubicLength,
  M1 as cubicProjectPoint,
  g1 as cubicRootAt,
  v1 as cubicSubdivide,
  Ri as curvature,
  _s as deCasteljau,
  Ua as degToRad,
  Br as derivative,
  Hf as derivative1,
  mc as derivativeControlPoints,
  ja as derivativeN,
  F1 as distPointToSegment,
  Zn as distPointToSegmentSquared,
  R1 as earcut,
  Pf as ellipseToCubics,
  Md as enableAlwaysYieldScheduler,
  ef as enableProfiling,
  vd as enableRequestPaint,
  Ha as endpointToCenter,
  Uu as equalToOrIn,
  If as equals,
  Sf as equalsEpsilon,
  $a as evaluate,
  Nf as evaluateValues,
  Wf as extrema,
  Ff as factorial,
  yd as fastJsonPatch,
  lc as findKeyframeInterval,
  bc as findSpan,
  Da as frameYieldMs,
  lo as fromSvgPath,
  kl as fromSvgPathToCmds,
  bl as generateClampedKnots,
  Ga as getBSplineBasis,
  Za as getBSplineBasisDerivative,
  ro as getBSplineBasisValue,
  Ml as getBSplineBasisValues,
  Ja as getBSplineDerivative,
  an as getBSplineEvaluate,
  Qa as getBSplineSegmentBounds,
  el as getCatmullRomBounds,
  Ka as getCatmullRomDerivative,
  zn as getCatmullRomEvaluate,
  tl as getCatmullRomExtremaRoots,
  sl as getConicType,
  wc as getCubicBezierBounds,
  gc as getCubicBezierEvaluate,
  vc as getCubicBezierExtremaRoots,
  r1 as getCubicCoefficients,
  cl as getDistanceToEllipse,
  hl as getDistanceToParabola,
  Qf as getEllipseArea,
  ol as getEllipseBounds,
  rl as getEllipseDerivative,
  il as getEllipseEvaluate,
  Jf as getEllipsePerimeter,
  ml as getHermiteBounds,
  yl as getHermiteDerivative,
  Mc as getHermiteEvaluate,
  pl as getHermiteExtremaRoots,
  xl as getHermiteSecondDerivative,
  e1 as getHyperbolaAsymptoteSlope,
  fl as getHyperbolaDerivative,
  n1 as getHyperbolaEccentricity,
  ul as getHyperbolaEvaluate,
  s1 as getHyperbolaFoci,
  gl as getLagrangeBasis,
  wl as getLagrangeDerivative,
  lr as getLagrangeEvaluate,
  c1 as getLagrangeEvaluateBarycentric,
  _l as getNURBSDerivative,
  hr as getNURBSEvaluate,
  t1 as getParabolaArcLength,
  ll as getParabolaDerivative,
  al as getParabolaEvaluate,
  Pc as getQuadraticBezierBounds,
  _c as getQuadraticBezierEvaluate,
  Tc as getQuadraticBezierExtremaRoots,
  h1 as getQuadraticCoefficients,
  Q1 as glMatrix,
  o1 as hermiteToCubicBezier,
  Df as interpolate,
  dc as interpolateValue,
  C1 as isAngleInRange,
  qf as isFinite,
  uc as isNumberArray,
  fc as isNumberArray2D,
  hc as isNumberValue,
  Kf as isPointInEllipse,
  i1 as isPointInHyperbola,
  Ys as lerp,
  Nu as lerpArray,
  Hu as lerpArray2D,
  nd as lerpColor,
  ed as lerpObject,
  rf as lowPriorityTimeout,
  $f as maxCurvature,
  Rf as mix,
  Wa as nCr,
  zf as nPr,
  Xf as normal,
  sf as normalPriorityTimeout,
  ln as normalizeAnglePositive,
  cr as normalizeAngles,
  O1 as path2d,
  u1 as pathBooleanOp,
  q1 as polybool,
  kd as pop,
  jf as project,
  Od as push,
  Be as quadraticAt,
  _1 as quadraticDerivativeAt,
  Bf as quadraticEvaluate,
  P1 as quadraticExtremum,
  L1 as quadraticLength,
  E1 as quadraticProjectPoint,
  T1 as quadraticRootAt,
  A1 as quadraticSubdivide,
  Vf as quadraticToCubic,
  Xa as radToDeg,
  Of as random,
  Pa as resolveEasing,
  z1 as signedDistPointToLine,
  kf as smoothStep,
  bi as solveCubicByCardano,
  Cf as solveCubicByShengjin,
  Qn as solveQuadratic,
  k1 as tess2,
  pf as toCanvasGradient,
  yf as toCanvasLineCap,
  xf as toCanvasLineJoin,
  pc as toCanvasStyle,
  qa as unstable_IdlePriority,
  Gr as unstable_ImmediatePriority,
  Ia as unstable_LowPriority,
  ts as unstable_NormalPriority,
  Zr as unstable_UserBlockingPriority,
  Ad as unstable_cancelCallback,
  Id as unstable_forceFrameRate,
  Ed as unstable_getCurrentPriorityLevel,
  _d as unstable_next,
  In as unstable_now,
  Sd as unstable_requestPaint,
  bd as unstable_runWithPriority,
  Pd as unstable_scheduleCallback,
  Ld as unstable_shouldYield,
  Td as unstable_wrapCallback,
  nf as userBlockingPriorityTimeout,
  K1 as webgpuMatrix,
  Tl as windCubicBezier,
  oo as windLine,
  Pl as windQuadraticBezier
};
