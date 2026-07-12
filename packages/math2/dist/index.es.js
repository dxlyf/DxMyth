function ir(o, e, n = !1) {
  const s = Math.PI * 2;
  let i = o % s;
  i <= 0 && (i += s);
  let r = i - o;
  return o = i, e += r, !n && e - o >= s ? e = o + s : n && o - e >= s ? e = o - s : !n && o > e ? e = o + (s - (o - e) % s) : n && o < e && (e = o - (s - (e - o) % s)), { startAngle: o, endAngle: e };
}
function qa(o) {
  let { x1: e, y1: n, x2: s, y2: i, rx: r, ry: c, xAxisRotation: a, largeArcFlag: h, sweepFlag: l } = o;
  const u = Math.sin(a), f = Math.cos(a), d = (e - s) / 2, x = (n - i) / 2, y = f * d + u * x, g = -u * d + f * x;
  let w = r * r, M = c * c;
  const E = y * y, I = g * g, N = E / w + I / M;
  if (N > 1) {
    const ot = Math.sqrt(N);
    r *= ot, c *= ot, w = r * r, M = c * c;
  }
  const O = (w * M - w * I - M * E) / (w * I + M * E), z = (h === l ? -1 : 1) * Math.sqrt(O), k = z * (r * g / c), Y = z * (-c * y / r), H = f * k - u * Y + (e + s) / 2, $ = u * k + f * Y + (n + i) / 2, W = Kr(1, 0, (y - k) / r, (g - Y) / c);
  let J = Kr(
    (y - k) / r,
    (g - Y) / c,
    (-y - k) / r,
    (-g - Y) / c
  );
  return !l && J > 0 ? J -= 2 * Math.PI : l && J < 0 && (J += 2 * Math.PI), { cx: H, cy: $, rx: r, ry: c, startAngle: W, sweepAngle: J, xAxisRotation: a };
}
function hf(o) {
  const { cx: e, cy: n, rx: s, ry: i, startAngle: r, sweepAngle: c, xAxisRotation: a } = o, h = Math.sin(a), l = Math.cos(a), u = r + c, f = s * Math.cos(r), d = i * Math.sin(r), x = s * Math.cos(u), y = i * Math.sin(u), g = l * f - h * d + e, w = h * f + l * d + n, M = l * x - h * y + e, E = h * x + l * y + n, I = Math.abs(c) > Math.PI, N = c > 0;
  return { x1: g, y1: w, x2: M, y2: E, largeArcFlag: I, sweepFlag: N };
}
function lf(o) {
  const e = qa(o);
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
function Da(o, e, n, s, i, r, c) {
  const a = Math.sin(i), h = Math.cos(i), l = 4 / 3 * Math.tan(c / 4), u = Math.cos(r), f = Math.sin(r), d = Math.cos(r + c), x = Math.sin(r + c), y = n * u, g = s * f, w = n * d, M = s * x, E = y + l * (-n * f), I = g + l * (s * u), N = w - l * (-n * x), O = M - l * (s * d), z = {
    x: h * y - a * g + o,
    y: a * y + h * g + e
  }, k = {
    x: h * E - a * I + o,
    y: a * E + h * I + e
  }, Y = {
    x: h * N - a * O + o,
    y: a * N + h * O + e
  }, H = {
    x: h * w - a * M + o,
    y: a * w + h * M + e
  };
  return { p1: z, cp1: k, cp2: Y, p2: H };
}
function uf(o, e, n, s, i = 0, r, c, a = !1, h = Math.PI / 2) {
  const l = [], { startAngle: u, endAngle: f } = ir(r, c, a), d = f - u, x = Math.max(1, Math.ceil(Math.abs(d) / h)), y = d / x;
  let g = u;
  for (let w = 0; w < x; w++) {
    const M = Da(o, e, n, s, i, g, y);
    l.push(M), g += y;
  }
  return l;
}
function Kr(o, e, n, s) {
  const i = o * n + e * s, r = o * s - e * n;
  return Math.atan2(r, i);
}
const Ns = 1e-6, Cs = Math.PI, ff = Cs / 2, df = Cs / 4, xf = Cs * 2, Oa = Cs / 180, ka = 180 / Cs, yf = (o) => o * Oa, pf = (o) => o * ka;
function Ve(o, e = Ns) {
  return Math.abs(o) < e;
}
const mf = (o, e, n = Ns) => Ve(o - e, n), gf = (o, e) => o === e, wf = (o) => Number.isFinite(o), vf = (o, e, n) => o + (e - o) * n, Mf = (o, e) => o + Math.random() * (e - o), tn = (o, e, n) => Math.max(e, Math.min(n, o)), bf = (o) => o * o * (3 * o - 2), _f = (o, e, n) => tn((o - e) / (n - e), 0, 1), In = [1, 1], Tf = (o) => {
  if (o < 0) return NaN;
  if (o === 0 || o === 1) return 1;
  if (In[o] !== void 0)
    return In[o];
  let e = In[In.length - 1];
  for (let n = In.length; n <= o; n++)
    e *= n, In[n] = e;
  return e;
}, Ra = (o, e) => {
  if (e < 0 || e > o) return 0;
  if (e === 0 || e === o) return 1;
  e > o - e && (e = o - e);
  let n = 1;
  for (let s = 1; s <= e; s++)
    n = n * (o - s + 1) / s;
  return n;
}, Pf = (o, e) => {
  if (e < 0 || e > o) return 0;
  if (e === 0) return 1;
  let n = 1;
  for (let s = 0; s < e; s++)
    n *= o - s;
  return n;
};
function jn(o, e, n) {
  if (Ve(o))
    return Ve(e) ? [] : [-n / e];
  const s = e * e - 4 * o * n;
  if (s < -Ns) return [];
  if (Ve(s))
    return [-e / (2 * o)];
  const i = Math.sqrt(s);
  return [(-e - i) / (2 * o), (-e + i) / (2 * o)];
}
function wi(o, e, n, s) {
  if (Ve(o)) return jn(e, n, s);
  const i = e / o, r = n / o, c = s / o, a = r - i * i / 3, h = c - i * r / 3 + 2 * i * i * i / 27, l = -i / 3, u = h / 2 * (h / 2) + a / 3 * (a / 3) * (a / 3), f = [];
  if (u > Ns) {
    const d = Math.sqrt(u), x = Math.cbrt(-h / 2 + d), y = Math.cbrt(-h / 2 - d);
    f.push(x + y + l);
  } else if (Ve(u)) {
    const d = Math.cbrt(-h / 2);
    f.push(2 * d + l), f.push(-d + l);
  } else {
    const d = Math.sqrt(-(a / 3) * (a / 3) * (a / 3)), x = Math.acos(-h / (2 * d)), y = Math.sqrt(-a / 3);
    for (let g = 0; g < 3; g++)
      f.push(2 * y * Math.cos((x + 2 * Math.PI * g) / 3) + l);
  }
  return f.sort((d, x) => d - x);
}
function Ef(o, e, n, s) {
  if (Ve(o)) return jn(e, n, s);
  const i = e * e - 3 * o * n, r = e * n - 9 * o * s, c = n * n - 3 * e * s, a = r * r - 4 * i * c;
  if (Ve(i) && Ve(r))
    return [-e / (3 * o)];
  if (a > Ns) {
    const d = i * e + 3 * o * ((-r + Math.sqrt(a)) / 2), x = i * e + 3 * o * ((-r - Math.sqrt(a)) / 2);
    return [(-e - (Math.cbrt(d) + Math.cbrt(x))) / (3 * o)];
  }
  if (Ve(a)) {
    const d = r / i, x = -e / o + d, y = -d / 2;
    return [x, y].sort((g, w) => g - w);
  }
  const h = (2 * i * e - 3 * o * r) / (2 * Math.sqrt(i * i * i)), l = Math.acos(h), u = Math.sqrt(i), f = [];
  for (let d = 0; d < 3; d++) {
    const x = (-e - 2 * u * Math.cos((l + 2 * Math.PI * d) / 3)) / (3 * o);
    f.push(x);
  }
  return f.sort((d, x) => d - x);
}
const ls = (o, e = 1e-10) => Math.abs(o) <= e, vs = (o, e) => {
  const n = o.length;
  if (n === 0) return { x: 0, y: 0 };
  if (n === 1) return { x: o[0].x, y: o[0].y };
  const s = o.map((i) => ({ x: i.x, y: i.y }));
  for (let i = 1; i < n; i++)
    for (let r = 0; r < n - i; r++)
      s[r].x += (s[r + 1].x - s[r].x) * e, s[r].y += (s[r + 1].y - s[r].y) * e;
  return s[0];
}, Nr = (o, e) => vs(fc(o), e), fc = (o) => {
  const e = o.length;
  if (e < 2) return [];
  const n = [];
  for (let s = 0; s < e - 1; s++)
    n.push({
      x: (e - 1) * (o[s + 1].x - o[s].x),
      y: (e - 1) * (o[s + 1].y - o[s].y)
    });
  return n;
}, Ii = (o, e, n) => Ra(e, o) * Math.pow(n, o) * Math.pow(1 - n, e - o), za = (o, e) => {
  const n = o.length - 1;
  let s = 0, i = 0;
  for (let r = 0; r <= n; r++) {
    const c = Ii(r, n, e);
    s += o[r].x * c, i += o[r].y * c;
  }
  return { x: s, y: i };
}, Lf = (o, e) => {
  const n = o.length - 1;
  let s = 0;
  for (let i = 0; i <= n; i++)
    s += o[i] * Ii(i, n, e);
  return s;
}, Af = (o, e) => {
  const n = o.length - 1;
  if (n < 1) return { x: 0, y: 0 };
  const s = n - 1;
  let i = 0, r = 0;
  for (let c = 0; c <= s; c++) {
    const a = Ii(c, s, e);
    i += (o[c + 1].x - o[c].x) * a, r += (o[c + 1].y - o[c].y) * a;
  }
  return { x: i * n, y: r * n };
}, Na = (o, e, n) => {
  const s = o.length - 1;
  if (e <= 0) return za(o, n);
  if (e > s) return { x: 0, y: 0 };
  const i = o.map((l) => ({ x: l.x, y: l.y }));
  for (let l = 0; l < e; l++)
    for (let u = 0; u < s - l; u++)
      i[u].x = i[u + 1].x - i[u].x, i[u].y = i[u + 1].y - i[u].y;
  const r = to(s) / to(s - e), c = s - e;
  let a = 0, h = 0;
  for (let l = 0; l <= c; l++) {
    const u = Ii(l, c, n);
    a += i[l].x * u, h += i[l].y * u;
  }
  return { x: a * r, y: h * r };
}, to = (o) => {
  let e = 1;
  for (let n = 2; n <= o; n++) e *= n;
  return e;
}, Sf = (o, e, n, s) => {
  const i = 1 - s;
  return {
    x: i * i * o.x + 2 * i * s * e.x + s * s * n.x,
    y: i * i * o.y + 2 * i * s * e.y + s * s * n.y
  };
}, If = (o, e, n, s, i) => {
  const r = 1 - i, c = r * r, a = c * r, h = i * i, l = h * i;
  return {
    x: a * o.x + 3 * c * i * e.x + 3 * r * h * n.x + l * s.x,
    y: a * o.y + 3 * c * i * e.y + 3 * r * h * n.y + l * s.y
  };
}, qf = (o, e, n) => [
  { x: o.x, y: o.y },
  { x: o.x / 3 + 2 / 3 * e.x, y: o.y / 3 + 2 / 3 * e.y },
  { x: 2 / 3 * e.x + n.x / 3, y: 2 / 3 * e.y + n.y / 3 },
  { x: n.x, y: n.y }
], Df = (o, e = 16) => {
  let n = 0;
  const s = 1 / e;
  let i = vs(o, 0);
  for (let r = 1; r <= e; r++) {
    const c = r * s, a = vs(o, c), h = a.x - i.x, l = a.y - i.y;
    n += Math.sqrt(h * h + l * l), i = a;
  }
  return n;
}, Of = (o, e) => {
  const n = Nr(o, e), s = Math.sqrt(n.x * n.x + n.y * n.y);
  return s === 0 ? { x: 0, y: 0 } : { x: -n.y / s, y: n.x / s };
}, Di = (o, e) => {
  const n = o.length;
  if (n < 3) return 0;
  const s = Nr(o, e), i = [];
  for (let h = 0; h < n - 2; h++)
    i.push({
      x: (n - 1) * (n - 2) * (o[h + 2].x - 2 * o[h + 1].x + o[h].x),
      y: (n - 1) * (n - 2) * (o[h + 2].y - 2 * o[h + 1].y + o[h].y)
    });
  const r = i.length > 0 ? vs(i, e) : { x: 0, y: 0 }, c = s.x * r.y - s.y * r.x, a = s.x * s.x + s.y * s.y;
  return a === 0 ? 0 : Math.abs(c) / Math.pow(a, 1.5);
}, kf = (o) => {
  if (o.length - 1 < 1) return [];
  const n = [], s = fc(o), i = (a) => {
    const h = a.length - 1, l = [], u = Math.max(h * 4, 20), f = (x) => {
      const y = a.map((g) => g);
      for (let g = 1; g <= h; g++)
        for (let w = 0; w <= h - g; w++)
          y[w] += (y[w + 1] - y[w]) * x;
      return y[0];
    };
    let d = f(0);
    for (let x = 1; x <= u; x++) {
      const y = x / u, g = f(y);
      if (d * g < 0 || ls(g)) {
        let w = (x - 1) / u, M = y, E = (w + M) / 2;
        if (ls(g))
          y > 0 && y < 1 && l.push(y);
        else {
          for (let I = 0; I < 20 && (E = (w + M) / 2, f(E) * f(w) <= 0 ? M = E : w = E, !(M - w < 1e-10)); I++)
            ;
          E > 0 && E < 1 && l.push(E);
        }
      }
      d = g;
    }
    return l;
  }, r = s.map((a) => a.x);
  for (const a of i(r))
    a > 0 && a < 1 && !n.some((h) => ls(h - a)) && n.push(a);
  const c = s.map((a) => a.y);
  for (const a of i(c))
    a > 0 && a < 1 && !n.some((h) => ls(h - a)) && n.push(a);
  return n.sort((a, h) => a - h);
}, Rf = (o, e = 20) => {
  let n = 0, s = -1 / 0;
  for (let f = 0; f <= e; f++) {
    const d = f / e, x = Di(o, d);
    x > s && (s = x, n = d);
  }
  const i = (Math.sqrt(5) - 1) / 2;
  let r = Math.max(0, n - 1 / e), c = Math.min(1, n + 1 / e), a = c - i * (c - r), h = r + i * (c - r);
  const l = Di(o, a), u = Di(o, h);
  for (let f = 0; f < 30 && !(Math.abs(c - r) < 1e-10); f++)
    l > u ? (c = h, h = a, a = c - i * (c - r)) : (r = a, a = h, h = r + i * (c - r));
  return (r + c) / 2;
}, zf = (o, e, n, s = 16, i = 8) => {
  let r = 0, c = 1 / 0;
  const a = (O) => vs(o, O);
  for (let O = 0; O <= s; O++) {
    const z = O / s, k = a(z), Y = k.x - e, H = k.y - n, $ = Y * Y + H * H;
    $ < c && (c = $, r = z);
  }
  let h = r;
  for (let O = 0; O < i; O++) {
    const z = a(h), k = Nr(o, h), Y = Na(o, 2, h), H = z.x - e, $ = z.y - n, W = H * k.x + $ * k.y, J = k.x * k.x + k.y * k.y + H * Y.x + $ * Y.y;
    if (ls(J)) break;
    h = h - W / J, h = Math.max(0, Math.min(1, h));
  }
  const l = a(h), u = l.x - e, f = l.y - n, d = u * u + f * f;
  d < c && (c = d);
  const x = a(0), y = a(1), g = x.x - e, w = x.y - n, M = y.x - e, E = y.y - n, I = g * g + w * w, N = M * M + E * E;
  return I < c && (c = I, h = 0), N < c && (c = N, h = 1), { t: h, distance: Math.sqrt(c) };
};
class Sn {
  static create(e) {
    return new Sn(e);
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
class lt {
  static pool = Sn.create({
    initSize: 20,
    create: () => new lt(0, 0),
    init(e) {
      e.set(0, 0);
    }
  });
  // ---- 静态工厂 ----
  static default() {
    return this.create();
  }
  static create(e = 0, n = 0) {
    return new lt(e, n);
  }
  static zero() {
    return new lt(0, 0);
  }
  static fromPoint(e) {
    return new lt(e.x, e.y);
  }
  static fromValues(e, n) {
    return new lt(e, n);
  }
  static fromScalar(e) {
    return new lt(e, e);
  }
  /** 从夹角 (rad) 创建单位向量 */
  static fromAngle(e) {
    return new lt(Math.cos(e), Math.sin(e));
  }
  /** 从类向量对象创建 */
  static from(e) {
    return new lt(e.x, e.y);
  }
  /** 从数组创建 */
  static fromArray(e) {
    return new lt(e[0], e[1]);
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
    const i = lt.dot(n, s), r = lt.dot(s, s);
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
    const i = lt.pool.get();
    return lt.project(i, n, s), lt.subtract(e, n, i), lt.pool.release(i), e;
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
    const s = lt.dot(e, n), i = Math.hypot(e.x, e.y) * Math.hypot(n.x, n.y);
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
    const i = 2 * lt.dot(n, s);
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
    const h = n.x + a * i, l = n.y + a * r;
    return this.distance(e, { x: h, y: l });
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
    const r = n.x - e.x, c = n.y - e.y, a = i.x - s.x, h = i.y - s.y, l = r * h - c * a;
    if (Math.abs(l) < 1e-10) return null;
    const u = ((s.x - e.x) * h - (s.y - e.y) * a) / l, f = ((s.x - e.x) * c - (s.y - e.y) * r) / l;
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
    return lt.add(this, this, e), this;
  }
  subtract(e) {
    return lt.subtract(this, this, e), this;
  }
  multiply(e) {
    return lt.multiply(this, this, e), this;
  }
  multiplyScalar(e) {
    return lt.multiplyScalar(this, this, e), this;
  }
  divide(e) {
    return lt.divide(this, this, e), this;
  }
  negate() {
    return lt.negate(this, this), this;
  }
  normalize() {
    return lt.normalize(this, this), this;
  }
  lerp(e, n) {
    return lt.lerp(this, this, e, n), this;
  }
  project(e) {
    return lt.project(this, this, e), this;
  }
  /** this = min(this, v)（逐分量取最小） */
  min(e) {
    return lt.min(this, this, e), this;
  }
  /** this = max(this, v)（逐分量取最大） */
  max(e) {
    return lt.max(this, this, e), this;
  }
  perp() {
    return lt.perp(this, this), this;
  }
  setLengthTo(e, n, s, i) {
    const r = Math.sqrt(e * e + n * n), c = s / r, a = e * c, h = n * c;
    return !Number.isFinite(e) || !Number.isFinite(n) || e == 0 && n == 0 ? (this.set(0, 0), !1) : (i && (i.value = r), this.set(a, h), !0);
  }
  /** 应用矩阵变换 this = m * this */
  applyMatrix2D(e) {
    return lt.applyMatrix2D(this, this, e), this;
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
    return lt.dot(this, e);
  }
  cross(e) {
    return lt.cross(this, e);
  }
  angle(e) {
    return lt.angleBetween(this, e);
  }
  distanceTo(e) {
    return lt.distance(this, e);
  }
  distanceSquaredTo(e) {
    return lt.distanceSquared(this, e);
  }
  translate(e, n) {
    return lt.translate(this, this, e, n);
  }
  scale(e, n) {
    return lt.scale(this, this, e, n);
  }
  rotate(e) {
    return lt.rotate(this, this, e), this;
  }
  equals(e) {
    return lt.equals(this, e);
  }
  equalsEpsilon(e, n) {
    return lt.equalsEpsilon(this, e, n);
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
    return new lt(this.x, this.y);
  }
  toArray() {
    return [this.x, this.y];
  }
  toString() {
    return `Vector2(${this.x}, ${this.y})`;
  }
}
class St {
  static pool = Sn.create({
    initSize: 10,
    create: () => new St(),
    init: (e) => {
      e.setEmpty();
    }
  });
  // ---- 静态工厂 ----
  static default() {
    return new St();
  }
  static zero() {
    return new St(0, 0, 0, 0);
  }
  /** 从点列表计算包围盒 */
  static fromPoints(e) {
    const n = new St();
    for (const s of e)
      n.add(s.x, s.y);
    return n;
  }
  /** 从 (x, y, width, height) 创建 */
  static fromXYWH(e, n, s, i) {
    return new St(e, n, e + s, n + i);
  }
  /** 从 (left, top, right, bottom) 创建 */
  static fromLTRB(e, n, s, i) {
    return new St(e, n, s, i);
  }
  /** 左下角（最小坐标） */
  min;
  /** 右上角（最大坐标） */
  max;
  constructor(e = 1 / 0, n = 1 / 0, s = -1 / 0, i = -1 / 0) {
    this.min = new lt(e, n), this.max = new lt(s, i);
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
  /** 是否与另一个包围盒相交 */
  intersects(e) {
    return !(this.max.x < e.min.x || this.min.x > e.max.x || this.max.y < e.min.y || this.min.y > e.max.y);
  }
  // ---- 写入 ----
  /** 重置为空 */
  setEmpty() {
    return this.min.set(1 / 0, 1 / 0), this.max.set(-1 / 0, -1 / 0), this;
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
    return e < this.min.x && (this.min.x = e), n < this.min.y && (this.min.y = n), e > this.max.x && (this.max.x = e), n > this.max.y && (this.max.y = n), this;
  }
  fromXYWH(e, n, s, i) {
    this.setEmpty(), this.min.set(e, n), this.max.set(e + s, n + i);
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
    for (const n of e)
      this.add(n.x, n.y);
    return this;
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
    const n = this.min.x, s = this.min.y, i = this.max.x, r = this.max.y, c = lt.pool.get();
    c.set(n, s);
    const a = lt.pool.get();
    a.set(i, s);
    const h = lt.pool.get();
    h.set(i, r);
    const l = lt.pool.get();
    return l.set(n, r), lt.applyMatrix2D(c, c, e), lt.applyMatrix2D(a, a, e), lt.applyMatrix2D(h, h, e), lt.applyMatrix2D(l, l, e), this.setEmpty(), this.add(c.x, c.y).add(a.x, a.y).add(h.x, h.y).add(l.x, l.y), lt.pool.release(c), lt.pool.release(a), lt.pool.release(h), lt.pool.release(l), this;
  }
  clone() {
    const e = new St();
    return e.min.copy(this.min), e.max.copy(this.max), e;
  }
  toString() {
    return `BoundingRect(min=(${this.min.x},${this.min.y}), max=(${this.max.x},${this.max.y}))`;
  }
}
class rt {
  static default() {
    return this.create();
  }
  static fromPoint(e) {
    return new rt(e.x, e.y);
  }
  static create(e = 0, n = 0) {
    return new rt(e, n);
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
    const r = Math.sqrt(e * e + n * n), c = s / r, a = e * c, h = n * c;
    return !Number.isFinite(e) || !Number.isFinite(n) || e == 0 && n == 0 ? (this.set(0, 0), !1) : (i && (i.value = r), this.set(a, h), !0);
  }
  isFinite() {
    return Number.isFinite(this.x) && Number.isFinite(this.y);
  }
  // ---- 工具 ----
  clone() {
    return new rt(this._x, this._y);
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
function Ca(o) {
  const e = o * o, n = e * o, s = 1 / 6;
  return [
    s * (1 - 3 * o + 3 * e - n),
    s * (4 - 6 * e + 3 * n),
    s * (1 + 3 * o + 3 * e - 3 * n),
    s * n
  ];
}
function Fa(o) {
  const e = o * o, n = 1 / 6;
  return [
    n * (-3 + 6 * o - 3 * e),
    n * (-12 * o + 9 * e),
    n * (3 + 6 * o - 9 * e),
    n * (3 * e)
  ];
}
function on(o, e, n, s, i) {
  const [r, c, a, h] = Ca(o);
  return rt.create(
    r * e.x + c * n.x + a * s.x + h * i.x,
    r * e.y + c * n.y + a * s.y + h * i.y
  );
}
function Ha(o, e, n, s, i) {
  const [r, c, a, h] = Fa(o);
  return rt.create(
    r * e.x + c * n.x + a * s.x + h * i.x,
    r * e.y + c * n.y + a * s.y + h * i.y
  );
}
function Ba(o, e, n, s) {
  const i = [e, n], r = 16;
  for (let c = 1; c < r; c++) {
    const a = c / r;
    i.push(on(a, o, e, n, s));
  }
  return St.default().fromPoints(i);
}
class Nf {
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
    const s = tn(e, 0, 1) * n, i = Math.min(Math.floor(s), n - 1), r = s - i;
    return { seg: i, localU: r };
  }
  /** 计算曲线上参数 t∈[0,1] 处的点 */
  evaluate(e) {
    const { seg: n, localU: s } = this._toSegment(e), i = this.points;
    return on(s, i[n], i[n + 1], i[n + 2], i[n + 3]);
  }
  /** 计算曲线在 t 处的一阶导数（切向量） */
  derivative(e) {
    const { seg: n, localU: s } = this._toSegment(e), i = this.points;
    return Ha(s, i[n], i[n + 1], i[n + 2], i[n + 3]);
  }
  /** 计算曲线在 t 处的法向量 */
  normal(e) {
    const n = this.derivative(e), s = Math.sqrt(n.x * n.x + n.y * n.y);
    return s === 0 ? { x: 0, y: 0 } : { x: -n.y / s, y: n.x / s };
  }
  /** 获取边界框 */
  getBounds() {
    const e = St.default(), n = this.segmentCount;
    if (n === 0) return e;
    for (let s = 0; s < n; s++) {
      const i = Ba(
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
      const r = this.points[i], c = this.points[i + 1], a = this.points[i + 2], h = this.points[i + 3];
      i === 0 && n.push(on(0, r, c, a, h)), this._flattenSegment(r, c, a, h, e, n);
    }
    return n;
  }
  _flattenSegment(e, n, s, i, r, c) {
    const a = (h, l, u) => {
      const f = (h + l) * 0.5, d = on(f, e, n, s, i), x = on(l, e, n, s, i), y = x.x - u.x, g = x.y - u.y, w = y * y + g * g;
      if (w < 1e-20) {
        c.push(x);
        return;
      }
      Math.abs((d.x - u.x) * g - (d.y - u.y) * y) / Math.sqrt(w) <= r ? c.push(x) : (a(h, f, u), a(f, l, d));
    };
    a(0, 1, on(0, e, n, s, i));
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
      for (let h = 0; h <= s; h++) {
        const l = h / s, u = on(l, a[c], a[c + 1], a[c + 2], a[c + 3]), f = u.x - e, d = u.y - n, x = f * f + d * d;
        x < r && (r = x);
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
      const h = this.points;
      for (let l = 0; l <= s; l++) {
        const u = l / s, f = on(u, h[a], h[a + 1], h[a + 2], h[a + 3]), d = f.x - e, x = f.y - n, y = d * d + x * x;
        y < c && (c = y, r = (a + u) / i);
      }
    }
    return this.evaluate(r);
  }
}
function kn(o, e, n, s, i, r = 0.5) {
  const c = o * o, a = c * o, h = 2 - r * 2, l = -h * a + 2 * h * c - h * o, u = (2 - h) * a + (h - 3) * c + 1, f = (h - 2) * a + (3 - 2 * h) * c + h * o, d = h * a - h * c;
  return rt.create(
    l * e.x + u * n.x + f * s.x + d * i.x,
    l * e.y + u * n.y + f * s.y + d * i.y
  );
}
function Ya(o, e, n, s, i, r = 0.5) {
  const c = o * o, a = 2 - r * 2, h = -3 * a * c + 4 * a * o - a, l = 3 * (2 - a) * c + 2 * (a - 3) * o, u = 3 * (a - 2) * c + 2 * (3 - 2 * a) * o + a, f = 3 * a * c - 2 * a * o;
  return rt.create(
    h * e.x + l * n.x + u * s.x + f * i.x,
    h * e.y + l * n.y + u * s.y + f * i.y
  );
}
function Va(o, e, n, s, i = 0.5) {
  const r = 2 - i * 2, c = [], a = -3 * r * o.x + 3 * (2 - r) * e.x + 3 * (r - 2) * n.x + 3 * r * s.x, h = 4 * r * o.x + 2 * (r - 3) * e.x + 2 * (3 - 2 * r) * n.x - 2 * r * s.x, l = -r * o.x + r * n.x;
  if (Math.abs(a) < 1e-12) {
    if (Math.abs(h) > 1e-12) {
      const x = -l / h;
      x > 0 && x < 1 && c.push(x);
    }
  } else {
    const x = h * h - 4 * a * l;
    if (x >= 0) {
      const y = Math.sqrt(x), g = (-h - y) / (2 * a), w = (-h + y) / (2 * a);
      g > 0 && g < 1 && c.push(g), w > 0 && w < 1 && c.push(w);
    }
  }
  const u = -3 * r * o.y + 3 * (2 - r) * e.y + 3 * (r - 2) * n.y + 3 * r * s.y, f = 4 * r * o.y + 2 * (r - 3) * e.y + 2 * (3 - 2 * r) * n.y - 2 * r * s.y, d = -r * o.y + r * n.y;
  if (Math.abs(u) < 1e-12) {
    if (Math.abs(f) > 1e-12) {
      const x = -d / f;
      x > 0 && x < 1 && !c.some((y) => Math.abs(y - x) < 1e-6) && c.push(x);
    }
  } else {
    const x = f * f - 4 * u * d;
    if (x >= 0) {
      const y = Math.sqrt(x), g = (-f - y) / (2 * u), w = (-f + y) / (2 * u);
      g > 0 && g < 1 && !c.some((M) => Math.abs(M - g) < 1e-6) && c.push(g), w > 0 && w < 1 && !c.some((M) => Math.abs(M - w) < 1e-6) && c.push(w);
    }
  }
  return c.sort((x, y) => x - y);
}
function Ua(o, e, n, s, i = 0.5) {
  const r = Va(o, e, n, s, i), c = [e, n];
  for (const a of r)
    c.push(kn(a, o, e, n, s, i));
  return St.default().fromPoints(c);
}
class Cf {
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
    const s = tn(e, 0, 1) * n, i = Math.min(Math.floor(s), n - 1), r = s - i;
    return { seg: i, localT: r };
  }
  /** 计算曲线上参数 t∈[0,1] 处的点 */
  evaluate(e) {
    const { seg: n, localT: s } = this._toSegment(e), i = this.points;
    return kn(s, i[n], i[n + 1], i[n + 2], i[n + 3], this.tension);
  }
  /** 计算曲线在 t 处的一阶导数（切向量） */
  derivative(e) {
    const { seg: n, localT: s } = this._toSegment(e), i = this.points;
    return Ya(s, i[n], i[n + 1], i[n + 2], i[n + 3], this.tension);
  }
  /** 计算曲线在 t 处的法向量 */
  normal(e) {
    const n = this.derivative(e), s = Math.sqrt(n.x * n.x + n.y * n.y);
    return s === 0 ? { x: 0, y: 0 } : { x: -n.y / s, y: n.x / s };
  }
  /** 获取边界框 */
  getBounds() {
    const e = St.default(), n = this.segmentCount;
    for (let s = 0; s < n; s++) {
      const i = Ua(
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
      const r = this.points[i], c = this.points[i + 1], a = this.points[i + 2], h = this.points[i + 3];
      i === 0 && n.push({ x: c.x, y: c.y }), this._flattenSegment(r, c, a, h, e, n);
    }
    return n;
  }
  _flattenSegment(e, n, s, i, r, c) {
    const a = (l, u, f, d) => {
      const x = (l + u) * 0.5, y = kn(x, e, n, s, i, this.tension), g = d.x - f.x, w = d.y - f.y, M = g * g + w * w;
      if (M < 1e-20) {
        c.push(d);
        return;
      }
      Math.abs((y.x - f.x) * w - (y.y - f.y) * g) / Math.sqrt(M) <= r ? c.push(d) : (a(l, x, f, y), a(x, u, y, d));
    }, h = kn(1, e, n, s, i, this.tension);
    a(0, 1, n, h);
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
      for (let h = 0; h <= s; h++) {
        const l = h / s, u = kn(l, a[c], a[c + 1], a[c + 2], a[c + 3], this.tension), f = u.x - e, d = u.y - n, x = f * f + d * d;
        x < r && (r = x);
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
      const h = this.points;
      for (let l = 0; l <= s; l++) {
        const u = l / s, f = kn(u, h[a], h[a + 1], h[a + 2], h[a + 3], this.tension), d = f.x - e, x = f.y - n, y = d * d + x * x;
        y < c && (c = y, r = (a + u) / i);
      }
    }
    return this.evaluate(r);
  }
}
var Xa = /* @__PURE__ */ ((o) => (o[o.Ellipse = 0] = "Ellipse", o[o.Parabola = 1] = "Parabola", o[o.Hyperbola = 2] = "Hyperbola", o))(Xa || {});
function Wa(o) {
  return Math.abs(o - 1) < 1e-10 ? 1 : o < 1 ? 0 : 2;
}
function $a(o, e, n) {
  return rt.create(e * Math.cos(o), n * Math.sin(o));
}
function ja(o, e, n) {
  return rt.create(-e * Math.sin(o), n * Math.cos(o));
}
function Ff(o, e) {
  if (o === e) return 2 * Math.PI * o;
  const n = ((o - e) / (o + e)) ** 2;
  return Math.PI * (o + e) * (1 + 3 * n / (10 + Math.sqrt(4 - 3 * n)));
}
function Hf(o, e) {
  return Math.PI * o * e;
}
function Ga(o, e) {
  return St.fromLTRB(-o, -e, o, e);
}
function Bf(o, e, n, s) {
  const i = o / n, r = e / s;
  return i * i + r * r <= 1;
}
function Za(o, e, n, s, i = 8) {
  const r = Math.abs(o), c = Math.abs(e), a = Math.max(n, s), h = Math.min(n, s);
  if (c === 0)
    return Math.abs(r - a);
  let l = Math.atan2(c * a, r * h);
  for (let w = 0; w < i; w++) {
    const M = Math.cos(l), E = Math.sin(l), I = a * M, N = h * E, O = a * a * (I - r), z = h * h * (N - c), k = (I - r) * O + (N - c) * z, Y = O * O + z * z;
    if (Math.abs(k) < 1e-12 || Math.abs(Y) < 1e-12) break;
    l -= k / Y, l = tn(l, 0, Math.PI / 2);
  }
  const u = Math.cos(l), f = Math.sin(l), d = a * u, x = h * f, y = d - r, g = x - c;
  return Math.sqrt(y * y + g * g);
}
function Ja(o, e) {
  return rt.create(e * o * o, 2 * e * o);
}
function Qa(o, e) {
  return rt.create(2 * e * o, 2 * e);
}
function Yf(o, e, n) {
  const s = (i) => {
    const r = Math.sqrt(i * i + 1);
    return n * (i * r + Math.log(i + r));
  };
  return Math.abs(s(e) - s(o));
}
function Ka(o, e, n, s = 32, i = 8) {
  const r = Math.sqrt(Math.abs(o) / Math.max(Math.abs(n), 1e-6)) + 1;
  let c = 0, a = 1 / 0;
  for (let d = 0; d <= s; d++) {
    const x = 2 * r * d / s - r, y = n * x * x, g = 2 * n * x, w = y - o, M = g - e, E = w * w + M * M;
    E < a && (a = E, c = x);
  }
  let h = c;
  for (let d = 0; d < i; d++) {
    const x = n * h * h - o, y = 2 * n * h - e, g = 2 * n * h, w = 2 * n, M = 2 * n, E = 0, I = x * g + y * w, N = g * g + w * w + x * M + y * E;
    if (Math.abs(N) < 1e-15) break;
    h = h - I / N;
  }
  const l = n * h * h - o, u = 2 * n * h - e, f = l * l + u * u;
  return f < a && (a = f), Math.sqrt(a);
}
function th(o, e, n, s = 1) {
  return rt.create(s * e * Math.cosh(o), n * Math.sinh(o));
}
function eh(o, e, n, s = 1) {
  return rt.create(s * e * Math.sinh(o), n * Math.cosh(o));
}
function Vf(o, e) {
  return e / o;
}
function Uf(o, e) {
  return Math.sqrt(1 + e * e / (o * o));
}
function Xf(o, e) {
  const n = Math.sqrt(o * o + e * e);
  return [{ x: -n, y: 0 }, { x: n, y: 0 }];
}
function Wf(o, e, n, s) {
  const i = o / n, r = e / s;
  return i * i - r * r >= 1;
}
class fi {
  /** 离心率 */
  eccentricity;
  /** 焦点距离（半长轴或半实轴） */
  a;
  /** 半短轴或半虚轴 */
  b;
  /** 曲线类型 */
  type;
  constructor(e, n, s) {
    this.eccentricity = e, this.a = n, this.b = s, this.type = Wa(e);
  }
  /** 创建椭圆 */
  static ellipse(e, n) {
    const s = e === n ? 0 : Math.sqrt(1 - n * n / (e * e));
    return new fi(s, e, n);
  }
  /** 创建抛物线 */
  static parabola(e) {
    return new fi(1, e, 0);
  }
  /** 创建双曲线 */
  static hyperbola(e, n) {
    const s = Math.sqrt(1 + n * n / (e * e));
    return new fi(s, e, n);
  }
  /** 计算曲线上参数 t 处的点 */
  evaluate(e) {
    switch (this.type) {
      case 0:
        return $a(e, this.a, this.b);
      case 1:
        return Ja(e, this.a);
      case 2:
        return th(e, this.a, this.b);
    }
  }
  /** 计算曲线在 t 处的一阶导数 */
  derivative(e) {
    switch (this.type) {
      case 0:
        return ja(e, this.a, this.b);
      case 1:
        return Qa(e, this.a);
      case 2:
        return eh(e, this.a, this.b);
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
        return Ga(this.a, this.b);
      case 1:
        return St.fromLTRB(0, -100, 100, 100);
      case 2:
        return St.fromLTRB(this.a, -100, 100, 100);
    }
  }
  /** 计算点到曲线的最小距离 */
  distanceTo(e, n) {
    switch (this.type) {
      case 0:
        return Za(e, n, this.a, this.b);
      case 1:
        return Ka(e, n, this.a);
      case 2: {
        let s = 1 / 0;
        for (let i = -20; i <= 20; i++) {
          const r = i * 0.5, c = this.evaluate(r), a = c.x - e, h = c.y - n, l = a * a + h * h;
          l < s && (s = l);
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
    for (let l = 0; l <= c; l++) {
      const u = s + (i - s) * l / c;
      a.push(this.evaluate(u));
    }
    const h = (l, u, f) => {
      const d = Math.floor((l + u) / 2);
      if (d === l || d === u) {
        r.push(a[u]);
        return;
      }
      const x = a[d], y = a[u], g = y.x - f.x, w = y.y - f.y, M = g * g + w * w;
      if (M < 1e-20) {
        r.push(y);
        return;
      }
      Math.abs((x.x - f.x) * w - (x.y - f.y) * g) / Math.sqrt(M) <= e ? r.push(y) : (h(l, d, f), h(d, u, x));
    };
    r.push(a[0]);
    for (let l = 1; l < a.length; l++)
      h(l - 1, l, a[l - 1]);
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
var nh = /* @__PURE__ */ ((o) => (o[o.R = 0] = "R", o[o.G = 1] = "G", o[o.B = 2] = "B", o[o.A = 3] = "A", o))(nh || {});
class _t extends Float32Array {
  // ---- 静态工厂 ----
  static toCSS_RGBA(e) {
    return `rgba(${e[0] * 255},${e[1] * 255},${e[2] * 255},${e[3]})`;
  }
  static fromRGBA(e, n, s, i = 1) {
    return new _t(e, n, s, i);
  }
  /** 从 0-255 字节值创建（自动归一化） */
  static fromBytes(e, n, s, i = 255) {
    return new _t(e / 255, n / 255, s / 255, i / 255);
  }
  /** 从 ColorValue 创建 */
  static fromColorValue(e) {
    return new _t(e[0], e[1], e[2], e[3] ?? 1);
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
      return _t._fromHexNumber(e);
    if (Array.isArray(e))
      return new _t(e[0], e[1], e[2], e[3] ?? 1);
    const n = e.trim();
    if (n === "transparent")
      return new _t(0, 0, 0, 0);
    if (n.startsWith("#"))
      return _t._fromHexString(n);
    const s = n.toLowerCase();
    return s.startsWith("rgba(") || s.startsWith("rgb(") ? _t._fromRGBString(s) : s.startsWith("hsla(") || s.startsWith("hsl(") ? _t._fromHSLString(s) : s.startsWith("hsva(") || s.startsWith("hsv(") ? _t._fromHSVString(s) : /^[0-9a-fA-F]{3,8}$/.test(n) ? _t._fromHexString("#" + n) : new _t(0, 0, 0, 1);
  }
  // ---- 内部解析 ----
  /** "0xRRGGBB" 或 "0xRRGGBBAA" 十六进制整数 */
  static _fromHexNumber(e) {
    return e > 16777215 ? new _t(
      (e >>> 24 & 255) / 255,
      (e >>> 16 & 255) / 255,
      (e >>> 8 & 255) / 255,
      (e & 255) / 255
    ) : new _t(
      (e >>> 16 & 255) / 255,
      (e >>> 8 & 255) / 255,
      (e & 255) / 255,
      1
    );
  }
  /** "#RGB" / "#RRGGBB" / "#RGBA" / "#RRGGBBAA" */
  static _fromHexString(e) {
    let n = e.slice(1);
    return n.length === 3 ? n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2] : n.length === 4 && (n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2] + n[3] + n[3]), new _t(
      parseInt(n.slice(0, 2), 16) / 255,
      parseInt(n.slice(2, 4), 16) / 255,
      parseInt(n.slice(4, 6), 16) / 255,
      n.length >= 8 ? parseInt(n.slice(6, 8), 16) / 255 : 1
    );
  }
  /** "rgb(r, g, b)" / "rgba(r, g, b, a)" */
  static _fromRGBString(e) {
    const n = e.match(/[\d.]+/g);
    return !n || n.length < 3 ? new _t(0, 0, 0, 1) : new _t(
      Math.max(0, Math.min(1, parseFloat(n[0]) / 255)),
      Math.max(0, Math.min(1, parseFloat(n[1]) / 255)),
      Math.max(0, Math.min(1, parseFloat(n[2]) / 255)),
      Math.max(0, Math.min(1, n.length >= 4 ? parseFloat(n[3]) : 1))
    );
  }
  /** "hsl(h, s%, l%)" / "hsla(h, s%, l%, a)" */
  static _fromHSLString(e) {
    const n = e.match(/[\d.]+/g);
    return !n || n.length < 3 ? new _t(0, 0, 0, 1) : _t._hslToRgba(
      parseFloat(n[0]) / 360,
      parseFloat(n[1]) / 100,
      parseFloat(n[2]) / 100,
      n.length >= 4 ? parseFloat(n[3]) : 1
    );
  }
  /** "hsv(h, s%, v%)" / "hsva(h, s%, v%, a)" */
  static _fromHSVString(e) {
    const n = e.match(/[\d.]+/g);
    return !n || n.length < 3 ? new _t(0, 0, 0, 1) : _t._hsvToRgba(
      parseFloat(n[0]) / 360,
      parseFloat(n[1]) / 100,
      parseFloat(n[2]) / 100,
      n.length >= 4 ? parseFloat(n[3]) : 1
    );
  }
  // ---- HSL / HSV → Color ----
  static _hslToRgba(e, n, s, i) {
    if (n === 0)
      return new _t(s, s, s, i);
    const r = (h, l, u) => (u < 0 && (u += 1), u > 1 && (u -= 1), u < 1 / 6 ? h + (l - h) * 6 * u : u < 1 / 2 ? l : u < 2 / 3 ? h + (l - h) * (2 / 3 - u) * 6 : h), c = s < 0.5 ? s * (1 + n) : s + n - s * n, a = 2 * s - c;
    return new _t(
      r(a, c, e + 1 / 3),
      r(a, c, e),
      r(a, c, e - 1 / 3),
      i
    );
  }
  static _hsvToRgba(e, n, s, i) {
    const r = Math.floor(e * 6), c = e * 6 - r, a = s * (1 - n), h = s * (1 - c * n), l = s * (1 - (1 - c) * n);
    let u, f, d;
    switch (r % 6) {
      case 0:
        u = s, f = l, d = a;
        break;
      case 1:
        u = h, f = s, d = a;
        break;
      case 2:
        u = a, f = s, d = l;
        break;
      case 3:
        u = a, f = h, d = s;
        break;
      case 4:
        u = l, f = a, d = s;
        break;
      default:
        u = s, f = a, d = h;
        break;
    }
    return new _t(u, f, d, i);
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
    return new _t(this[0], this[1], this[2], this[3]);
  }
  toString() {
    return this.toRGBAString();
  }
  // ==================== 颜色空间转换 ====================
  /** 获取 HSL 表示 { h:0-360, s:0-1, l:0-1 } */
  toHSL() {
    const e = this[0], n = this[1], s = this[2], i = Math.max(e, n, s), r = Math.min(e, n, s), c = (i + r) / 2;
    if (i === r) return { h: 0, s: 0, l: c };
    const a = i - r, h = c > 0.5 ? a / (2 - i - r) : a / (i + r);
    let l = 0;
    switch (i) {
      case e:
        l = ((n - s) / a + (n < s ? 6 : 0)) / 6;
        break;
      case n:
        l = ((s - e) / a + 2) / 6;
        break;
      case s:
        l = ((e - n) / a + 4) / 6;
        break;
    }
    return { h: l * 360, s: h, l: c };
  }
  /** 从 HSL 设置颜色值 */
  fromHSL(e, n, s, i = this[3]) {
    const r = _t._hslToRgba(e / 360, n, s, i);
    return this[0] = r[0], this[1] = r[1], this[2] = r[2], this[3] = r[3], this;
  }
  /** 获取 HSV 表示 { h:0-360, s:0-1, v:0-1 } */
  toHSV() {
    const e = this[0], n = this[1], s = this[2], i = Math.max(e, n, s), r = Math.min(e, n, s), c = i - r, a = i, h = i === 0 ? 0 : c / i;
    if (c === 0) return { h: 0, s: h, v: a };
    let l = 0;
    switch (i) {
      case e:
        l = ((n - s) / c + (n < s ? 6 : 0)) / 6;
        break;
      case n:
        l = ((s - e) / c + 2) / 6;
        break;
      case s:
        l = ((e - n) / c + 4) / 6;
        break;
    }
    return { h: l * 360, s: h, v: a };
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
  static lerp(e, n, s, i = new _t()) {
    const r = 1 - s;
    return i[0] = e[0] * r + n[0] * s, i[1] = e[1] * r + n[1] * s, i[2] = e[2] * r + n[2] * s, i[3] = e[3] * r + n[3] * s, i;
  }
  /** HSL 空间插值（色相走最短路径），更适合渐变过渡 */
  static lerpHSL(e, n, s, i = new _t()) {
    const r = e.toHSL(), c = n.toHSL(), a = 1 - s;
    let h = c.h - r.h;
    Math.abs(h) > 180 && (h = h > 0 ? h - 360 : h + 360);
    const l = r.h + h * s, u = r.s * a + c.s * s, f = r.l * a + c.l * s, d = e[3] * a + n[3] * s;
    return i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3], i.fromHSL(l < 0 ? l + 360 : l >= 360 ? l - 360 : l, u, f, d), i;
  }
  /** LAB 空间插值（感知均匀），色带过渡最自然 */
  static lerpLAB(e, n, s, i = new _t()) {
    const r = _t._rgbToLAB(e), c = _t._rgbToLAB(n), a = 1 - s, h = {
      l: r.l * a + c.l * s,
      a: r.a * a + c.a * s,
      b: r.b * a + c.b * s
    }, l = e[3] * a + n[3] * s;
    return _t._labToRGB(h, i), i[3] = l, i;
  }
  /** 生成随机颜色 */
  static random(e = 1) {
    return new _t(Math.random(), Math.random(), Math.random(), e);
  }
  /** 生成随机鲜艳颜色（高饱和度 HSL） */
  static randomVibrant(e = 1) {
    const n = Math.random() * 360;
    return new _t().fromHSL(n, 0.7 + Math.random() * 0.3, 0.5 + Math.random() * 0.15, e);
  }
  // ---- LAB 内部转换 ----
  static _rgbToLAB(e) {
    const n = (x) => (x = x > 0.04045 ? ((x + 0.055) / 1.055) ** 2.4 : x / 12.92, x * 100), s = n(e[0]), i = n(e[1]), r = n(e[2]), c = s * 0.4124564 + i * 0.3575761 + r * 0.1804375, a = s * 0.2126729 + i * 0.7151522 + r * 0.072175, h = s * 0.0193339 + i * 0.119192 + r * 0.9503041, l = (x) => x > 8856e-6 ? Math.cbrt(x) : 7.787 * x + 16 / 116, u = l(c / 95.047), f = l(a / 100), d = l(h / 108.883);
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
    }, a = c(i) * 95.047, h = c(s) * 100, l = c(r) * 108.883, u = (f) => (f /= 100, f > 31308e-7 ? 1.055 * f ** (1 / 2.4) - 0.055 : 12.92 * f);
    n[0] = Math.max(0, Math.min(1, u(a * 3.2404542 + h * -1.5371385 + l * -0.4985314))), n[1] = Math.max(0, Math.min(1, u(a * -0.969266 + h * 1.8760108 + l * 0.041556))), n[2] = Math.max(0, Math.min(1, u(a * 0.0556434 + h * -0.2040259 + l * 1.0572252)));
  }
}
function dc(o, e, n, s, i) {
  const r = 1 - o, c = r * r, a = c * r, h = o * o, l = h * o;
  return rt.create(
    a * e.x + 3 * c * o * n.x + 3 * r * h * s.x + l * i.x,
    a * e.y + 3 * c * o * n.y + 3 * r * h * s.y + l * i.y
  );
}
function xc(o, e, n, s) {
  const i = yc(o, e, n, s), r = [o, s];
  for (const c of i)
    r.push(dc(c, o, e, n, s));
  return St.default().fromPoints(r);
}
function yc(o, e, n, s) {
  const i = [], r = 3 * (-o.x + 3 * e.x - 3 * n.x + s.x), c = 6 * (o.x - 2 * e.x + n.x), a = 3 * (e.x - o.x), h = jn(r, c, a);
  for (const x of h)
    x > 0 && x < 1 && i.push(x);
  const l = 3 * (-o.y + 3 * e.y - 3 * n.y + s.y), u = 6 * (o.y - 2 * e.y + n.y), f = 3 * (e.y - o.y), d = jn(l, u, f);
  for (const x of d)
    x > 0 && x < 1 && !i.includes(x) && i.push(x);
  return i.sort((x, y) => x - y);
}
function $f(o, e, n, s) {
  const i = -o.x + 3 * e.x - 3 * n.x + s.x, r = -o.y + 3 * e.y - 3 * n.y + s.y, c = 3 * o.x - 6 * e.x + 3 * n.x, a = 3 * o.y - 6 * e.y + 3 * n.y, h = -3 * o.x + 3 * e.x, l = -3 * o.y + 3 * e.y, u = o.x, f = o.y;
  return { ax: i, ay: r, bx: c, by: a, cx: h, cy: l, dx: u, dy: f };
}
class Ms {
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
    return dc(e, this.p0, this.p1, this.p2, this.p3);
  }
  // 获取极值的根（t值）
  getExtremaRoots() {
    return yc(this.p0, this.p1, this.p2, this.p3);
  }
  // 获取边界框
  getBounds() {
    return xc(this.p0, this.p1, this.p2, this.p3);
  }
  /**
   * 在参数 t 处分割三次贝塞尔曲线
   * @param t - 分割参数 [0, 1]
   * @returns [左半曲线, 右半曲线]
   */
  split(e) {
    const { p0: n, p1: s, p2: i, p3: r } = this, c = 1 - e, a = { x: c * n.x + e * s.x, y: c * n.y + e * s.y }, h = { x: c * s.x + e * i.x, y: c * s.y + e * i.y }, l = { x: c * i.x + e * r.x, y: c * i.y + e * r.y }, u = { x: c * a.x + e * h.x, y: c * a.y + e * h.y }, f = { x: c * h.x + e * l.x, y: c * h.y + e * l.y }, d = { x: c * u.x + e * f.x, y: c * u.y + e * f.y };
    return [
      new Ms([n, a, u, d]),
      new Ms([d, f, l, r])
    ];
  }
  /**
   * 将三次贝塞尔曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   * @returns PointLike[] 点序列（包含起点和终点）
   */
  flatten(e = 0.5) {
    const n = [this.p0], s = (i, r, c, a) => {
      const h = a.x - i.x, l = a.y - i.y, u = h * h + l * l;
      if (u <= 1e-20) {
        if ((r.x - i.x) ** 2 + (r.y - i.y) ** 2 + (c.x - i.x) ** 2 + (c.y - i.y) ** 2 <= e * e) {
          n.push(a);
          return;
        }
      } else {
        const E = Math.abs((r.x - a.x) * l - (r.y - a.y) * h) / Math.sqrt(u), I = Math.abs((c.x - a.x) * l - (c.y - a.y) * h) / Math.sqrt(u);
        if (E <= e && I <= e) {
          n.push(a);
          return;
        }
      }
      const f = 0.5, d = { x: (i.x + r.x) * f, y: (i.y + r.y) * f }, x = { x: (r.x + c.x) * f, y: (r.y + c.y) * f }, y = { x: (c.x + a.x) * f, y: (c.y + a.y) * f }, g = { x: (d.x + x.x) * f, y: (d.y + x.y) * f }, w = { x: (x.x + y.x) * f, y: (x.y + y.y) * f }, M = { x: (g.x + w.x) * f, y: (g.y + w.y) * f };
      s(i, d, g, M), s(M, w, y, a);
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
    const { p0: r, p1: c, p2: a, p3: h } = this, l = -r.x + 3 * c.x - 3 * a.x + h.x, u = -r.y + 3 * c.y - 3 * a.y + h.y, f = 3 * r.x - 6 * c.x + 3 * a.x, d = 3 * r.y - 6 * c.y + 3 * a.y, x = -3 * r.x + 3 * c.x, y = -3 * r.y + 3 * c.y;
    r.x - e, r.y - n;
    const g = 3 * l, w = 3 * u, M = g * 2, E = w * 2, I = 6 * l, N = 6 * u, O = 2 * f * 2, z = 2 * d * 2;
    let k = 0, Y = 1 / 0;
    for (let K = 0; K <= s; K++) {
      const j = K / s, V = 1 - j, at = V * V, pt = at * V, At = j * j, vt = At * j, Ot = pt * r.x + 3 * at * j * c.x + 3 * V * At * a.x + vt * h.x - e, kt = pt * r.y + 3 * at * j * c.y + 3 * V * At * a.y + vt * h.y - n, Nt = Ot * Ot + kt * kt;
      Nt < Y && (Y = Nt, k = j);
    }
    let H = k;
    for (let K = 0; K < i; K++) {
      const j = 1 - H, V = j * j, at = V * j, pt = H * H, At = pt * H, vt = at * r.x + 3 * V * H * c.x + 3 * j * pt * a.x + At * h.x - e, Ot = at * r.y + 3 * V * H * c.y + 3 * j * pt * a.y + At * h.y - n, kt = g * pt + M * H + x, Nt = w * pt + E * H + y, Ht = I * H + O, Vt = N * H + z, Ut = vt * kt + Ot * Nt, U = kt * kt + Nt * Nt + vt * Ht + Ot * Vt;
      if (Math.abs(U) < 1e-15) break;
      H = H - Ut / U, H = Math.max(0, Math.min(1, H));
    }
    {
      const K = 1 - H, j = K * K * K * r.x + 3 * K * K * H * c.x + 3 * K * H * H * a.x + H * H * H * h.x - e, V = K * K * K * r.y + 3 * K * K * H * c.y + 3 * K * H * H * a.y + H * H * H * h.y - n, at = j * j + V * V;
      at < Y && (Y = at);
    }
    const $ = r.x - e, W = r.y - n, J = h.x - e, ot = h.y - n;
    return Y = Math.min(Y, $ * $ + W * W, J * J + ot * ot), Math.sqrt(Y);
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
    const { p0: r, p1: c, p2: a, p3: h } = this, l = -r.x + 3 * c.x - 3 * a.x + h.x, u = -r.y + 3 * c.y - 3 * a.y + h.y, f = 3 * r.x - 6 * c.x + 3 * a.x, d = 3 * r.y - 6 * c.y + 3 * a.y, x = -3 * r.x + 3 * c.x, y = -3 * r.y + 3 * c.y, g = 3 * l, w = 3 * u, M = g * 2, E = w * 2, I = 6 * l, N = 6 * u, O = 2 * f * 2, z = 2 * d * 2;
    let k = 0, Y = 1 / 0;
    for (let at = 0; at <= s; at++) {
      const pt = at / s, At = 1 - pt, vt = At * At, Ot = vt * At, kt = pt * pt, Nt = kt * pt, Ht = Ot * r.x + 3 * vt * pt * c.x + 3 * At * kt * a.x + Nt * h.x - e, Vt = Ot * r.y + 3 * vt * pt * c.y + 3 * At * kt * a.y + Nt * h.y - n, Ut = Ht * Ht + Vt * Vt;
      Ut < Y && (Y = Ut, k = pt);
    }
    let H = k;
    for (let at = 0; at < i; at++) {
      const pt = 1 - H, At = pt * pt, vt = At * pt, Ot = H * H, kt = Ot * H, Nt = vt * r.x + 3 * At * H * c.x + 3 * pt * Ot * a.x + kt * h.x - e, Ht = vt * r.y + 3 * At * H * c.y + 3 * pt * Ot * a.y + kt * h.y - n, Vt = g * Ot + M * H + x, Ut = w * Ot + E * H + y, U = I * H + O, Q = N * H + z, D = Nt * Vt + Ht * Ut, m = Vt * Vt + Ut * Ut + Nt * U + Ht * Q;
      if (Math.abs(m) < 1e-15) break;
      H = H - D / m, H = Math.max(0, Math.min(1, H));
    }
    {
      const at = 1 - H, pt = at * at * at * r.x + 3 * at * at * H * c.x + 3 * at * H * H * a.x + H * H * H * h.x - e, At = at * at * at * r.y + 3 * at * at * H * c.y + 3 * at * H * H * a.y + H * H * H * h.y - n, vt = pt * pt + At * At;
      vt < Y && (Y = vt, k = H);
    }
    const $ = r.x - e, W = r.y - n, J = h.x - e, ot = h.y - n, K = $ * $ + W * W, j = J * J + ot * ot;
    K < Y && (Y = K, k = 0), j < Y && (k = 1);
    const V = 1 - k;
    return {
      x: V * V * V * r.x + 3 * V * V * k * c.x + 3 * V * k * k * a.x + k * k * k * h.x,
      y: V * V * V * r.y + 3 * V * V * k * c.y + 3 * V * k * k * a.y + k * k * k * h.y
    };
  }
}
function pc(o, e, n, s, i) {
  const r = o * o, c = r * o, a = 2 * c - 3 * r + 1, h = c - 2 * r + o, l = -2 * c + 3 * r, u = c - r;
  return rt.create(
    a * e.x + h * s.x + l * n.x + u * i.x,
    a * e.y + h * s.y + l * n.y + u * i.y
  );
}
function sh(o, e, n, s, i) {
  const r = o * o, c = 6 * r - 6 * o, a = 3 * r - 4 * o + 1, h = -6 * r + 6 * o, l = 3 * r - 2 * o;
  return rt.create(
    c * e.x + a * s.x + h * n.x + l * i.x,
    c * e.y + a * s.y + h * n.y + l * i.y
  );
}
function ih(o, e, n, s, i) {
  const r = 12 * o - 6, c = 6 * o - 4, a = -12 * o + 6, h = 6 * o - 2;
  return rt.create(
    r * e.x + c * s.x + a * n.x + h * i.x,
    r * e.y + c * s.y + a * n.y + h * i.y
  );
}
function rh(o, e, n, s) {
  const i = [];
  12 * o.x - 6 * n.x - 12 * e.x + 6 * s.x, -6 * o.x + 3 * n.x + 6 * e.x - 2 * s.x, -4 * o.x + n.x + 2 * e.x;
  const r = (d, x, y) => {
    if (Math.abs(d) < 1e-12) {
      if (Math.abs(x) > 1e-12) {
        const I = -y / x;
        I > 0 && I < 1 && i.push(I);
      }
      return;
    }
    const g = x * x - 4 * d * y;
    if (g < 0) return;
    const w = Math.sqrt(g), M = (-x - w) / (2 * d), E = (-x + w) / (2 * d);
    M > 0 && M < 1 && i.push(M), E > 0 && E < 1 && i.push(E);
  }, c = 3 * n.x + 3 * s.x, a = -6 * o.x - 4 * n.x + 6 * e.x - 2 * s.x, h = -6 * o.x + n.x + 6 * e.x;
  r(c, a, h);
  const l = 3 * n.y + 3 * s.y, u = -6 * o.y - 4 * n.y + 6 * e.y - 2 * s.y, f = -6 * o.y + n.y + 6 * e.y;
  return r(l, u, f), i.sort((d, x) => d - x);
}
function oh(o, e, n, s) {
  const i = rh(o, e, n, s), r = [o, e];
  for (const c of i)
    r.push(pc(c, o, e, n, s));
  return St.default().fromPoints(r);
}
function jf(o, e, n, s) {
  return [
    { x: o.x, y: o.y },
    { x: o.x + n.x / 3, y: o.y + n.y / 3 },
    { x: e.x - s.x / 3, y: e.y - s.y / 3 },
    { x: e.x, y: e.y }
  ];
}
class rr {
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
    return pc(e, this.p0, this.p1, this.m0, this.m1);
  }
  /** 计算曲线在 t 处的一阶导数（切向量） */
  derivative(e) {
    return sh(e, this.p0, this.p1, this.m0, this.m1);
  }
  /** 计算曲线在 t 处的二阶导数 */
  secondDerivative(e) {
    return ih(e, this.p0, this.p1, this.m0, this.m1);
  }
  /** 计算曲线在 t 处的法向量 */
  normal(e) {
    const n = this.derivative(e), s = Math.sqrt(n.x * n.x + n.y * n.y);
    return s === 0 ? { x: 0, y: 0 } : { x: -n.y / s, y: n.x / s };
  }
  /** 获取边界框 */
  getBounds() {
    return oh(this.p0, this.p1, this.m0, this.m1);
  }
  /**
   * 在参数 t 处分割曲线
   * @returns [左半曲线, 右半曲线]
   */
  split(e) {
    const n = this.evaluate(e), s = this.derivative(e), i = new rr(this.p0, n, this.m0, s), r = new rr(n, this.p1, s, this.m1);
    return [i, r];
  }
  /**
   * 将曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   */
  flatten(e = 0.5) {
    const n = [{ x: this.p0.x, y: this.p0.y }], s = (i, r, c) => {
      const a = (i + r) * 0.5, h = this.evaluate(a), l = this.evaluate(r), u = l.x - c.x, f = l.y - c.y, d = u * u + f * f;
      if (d < 1e-20) {
        n.push(l);
        return;
      }
      Math.abs((h.x - c.x) * f - (h.y - c.y) * u) / Math.sqrt(d) <= e ? n.push(l) : (s(i, a, c), s(a, r, h));
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
      const x = d / s, y = this.evaluate(x), g = y.x - e, w = y.y - n, M = g * g + w * w;
      M < c && (c = M, r = x);
    }
    let a = r;
    for (let d = 0; d < i; d++) {
      const x = this.evaluate(a), y = this.derivative(a), g = this.secondDerivative(a), w = x.x - e, M = x.y - n, E = w * y.x + M * y.y, I = y.x * y.x + y.y * y.y + w * g.x + M * g.y;
      if (Math.abs(I) < 1e-15) break;
      a = a - E / I, a = Math.max(0, Math.min(1, a));
    }
    const h = this.evaluate(a), l = h.x - e, u = h.y - n, f = l * l + u * u;
    return f < c && (c = f), Math.sqrt(c);
  }
  /**
   * 计算点在曲线上的投影点（最近点）
   * @param samples - 采样点数（默认 16）
   * @param iterations - Newton 迭代次数（默认 8）
   */
  projectPoint(e, n, s = 16, i = 8) {
    let r = 0, c = 1 / 0;
    for (let y = 0; y <= s; y++) {
      const g = y / s, w = this.evaluate(g), M = w.x - e, E = w.y - n, I = M * M + E * E;
      I < c && (c = I, r = g);
    }
    let a = r;
    for (let y = 0; y < i; y++) {
      const g = this.evaluate(a), w = this.derivative(a), M = this.secondDerivative(a), E = g.x - e, I = g.y - n, N = E * w.x + I * w.y, O = w.x * w.x + w.y * w.y + E * M.x + I * M.y;
      if (Math.abs(O) < 1e-15) break;
      a = a - N / O, a = Math.max(0, Math.min(1, a));
    }
    const h = this.p0.x - e, l = this.p0.y - n, u = this.p1.x - e, f = this.p1.y - n, d = h * h + l * l, x = u * u + f * f;
    return d < c && (c = d, a = 0), x < c && (a = 1), this.evaluate(a);
  }
}
function ch(o, e, n) {
  let s = 1;
  const i = n[o];
  for (let r = 0; r < n.length; r++) {
    if (r === o) continue;
    const c = i - n[r];
    Math.abs(c) < 1e-12 || (s *= (e - n[r]) / c);
  }
  return s;
}
function or(o, e, n) {
  const s = e.length, i = n ?? Array.from({ length: s }, (a, h) => s === 1 ? 0 : h / (s - 1));
  let r = 0, c = 0;
  for (let a = 0; a < s; a++) {
    const h = ch(a, o, i);
    r += h * e[a].x, c += h * e[a].y;
  }
  return rt.create(r, c);
}
function ah(o, e, n, s = 1e-6) {
  const i = tn(o - s, 0, 1), r = tn(o + s, 0, 1), c = or(i, e, n), a = or(r, e, n), h = r - i;
  return h === 0 ? rt.create(0, 0) : rt.create((a.x - c.x) / h, (a.y - c.y) / h);
}
function Gf(o, e, n) {
  const s = e.length, i = new Array(s);
  for (let h = 0; h < s; h++) {
    let l = 1;
    for (let u = 0; u < s; u++) {
      if (u === h) continue;
      const f = n[h] - n[u];
      Math.abs(f) < 1e-12 || (l *= f);
    }
    i[h] = 1 / l;
  }
  for (let h = 0; h < s; h++)
    if (Math.abs(o - n[h]) < 1e-14)
      return rt.create(e[h].x, e[h].y);
  let r = 0, c = 0, a = 0;
  for (let h = 0; h < s; h++) {
    const l = i[h] / (o - n[h]);
    r += l * e[h].x, c += l * e[h].y, a += l;
  }
  return a === 0 ? rt.create(0, 0) : rt.create(r / a, c / a);
}
class Zf {
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
    return or(e, this.points, this.knots);
  }
  /** 计算曲线在 t 处的一阶导数 */
  derivative(e) {
    return ah(e, this.points, this.knots);
  }
  /** 计算曲线在 t 处的法向量 */
  normal(e) {
    const n = this.derivative(e), s = Math.sqrt(n.x * n.x + n.y * n.y);
    return s === 0 ? { x: 0, y: 0 } : { x: -n.y / s, y: n.x / s };
  }
  /** 获取边界框（采样法） */
  getBounds(e = 50) {
    const n = St.default();
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
    const r = (c, a, h) => {
      const l = Math.floor((c + a) / 2);
      if (l === c || l === a) {
        s.push(i[a]);
        return;
      }
      const u = i[l], f = i[a], d = f.x - h.x, x = f.y - h.y, y = d * d + x * x;
      if (y < 1e-20) {
        s.push(f);
        return;
      }
      Math.abs((u.x - h.x) * x - (u.y - h.y) * d) / Math.sqrt(y) <= e ? s.push(f) : (r(c, l, h), r(l, a, u));
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
      const c = this.evaluate(r / s), a = c.x - e, h = c.y - n, l = a * a + h * h;
      l < i && (i = l);
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
      const a = c / s, h = this.evaluate(a), l = h.x - e, u = h.y - n, f = l * l + u * u;
      f < r && (r = f, i = a);
    }
    return this.evaluate(i);
  }
}
var hh = /* @__PURE__ */ ((o) => (o[o.A = 0] = "A", o[o.B = 1] = "B", o[o.C = 2] = "C", o[o.D = 3] = "D", o[o.TX = 4] = "TX", o[o.TY = 5] = "TY", o))(hh || {});
class Rt extends Float32Array {
  static pool = Sn.create({
    initSize: 20,
    create: () => Rt.identity(),
    init(e) {
      e.identity();
    }
  });
  // ---- 静态工厂 ----
  static identity() {
    return new Rt(1, 0, 0, 1, 0, 0);
  }
  static fromArray(e) {
    return new Rt(e[0], e[1], e[2], e[3], e[4], e[5]);
  }
  static fromTranslate(e, n) {
    return new Rt(1, 0, 0, 1, e, n);
  }
  static fromScale(e, n) {
    return new Rt(e, 0, 0, n, 0, 0);
  }
  static fromRotate(e) {
    const n = Math.cos(e), s = Math.sin(e);
    return new Rt(n, s, -s, n, 0, 0);
  }
  static fromSkew(e, n) {
    return new Rt(1, Math.tan(n), Math.tan(e), 1, 0, 0);
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
    const a = n.x, h = n.y, l = r.x, u = r.y, f = i.x, d = i.y, x = c.x, y = c.y, g = s === 0 ? 1 : Math.cos(s), w = s === 0 ? 0 : Math.sin(s), M = f === 0 ? 0 : Math.tan(f), E = d === 0 ? 0 : Math.tan(d), I = -g * x + w * y, N = -w * x - g * y, O = l * g, z = u * w, k = l * -w, Y = u * g, H = l * I, $ = u * N, W = O + M * z, J = E * O + z, ot = k + M * Y, K = E * k + Y, j = H + M * $, V = E * H + $;
    return e[0] = W, e[1] = J, e[2] = ot, e[3] = K, e[4] = W * a + ot * h + j, e[5] = J * a + K * h + V, e;
  }
  // ---- 静态工具 ----
  /** out = a * b */
  static multiply(e, n, s) {
    const i = n[0], r = n[1], c = n[2], a = n[3], h = n[4], l = n[5], u = s[0], f = s[1], d = s[2], x = s[3], y = s[4], g = s[5];
    return e[0] = i * u + c * f, e[1] = r * u + a * f, e[2] = i * d + c * x, e[3] = r * d + a * x, e[4] = i * y + c * g + h, e[5] = r * y + a * g + l, e;
  }
  /** out = m 的逆矩阵；行列式为 0 时返回 null */
  static invert(e, n) {
    const s = n[0], i = n[1], r = n[2], c = n[3], a = n[4], h = n[5], l = s * c - i * r;
    if (l === 0) return null;
    const u = 1 / l;
    return e[0] = c * u, e[1] = -i * u, e[2] = -r * u, e[3] = s * u, e[4] = (r * h - c * a) * u, e[5] = (i * a - s * h) * u, e;
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
      e[i] = Rt.mapPoint(e[i] || { x: 0, y: 0 }, n, s[i]);
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
    return Rt.multiply(this, e, n);
  }
  multiply(e) {
    return Rt.multiply(this, this, e);
  }
  /** this = m * this */
  premultiply(e) {
    return Rt.multiply(this, e, this);
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
    const s = Math.tan(e), i = Math.tan(n), r = this[0], c = this[1], a = this[2], h = this[3];
    return this[0] = r + a * i, this[1] = c + h * i, this[2] = r * s + a, this[3] = c * s + h, this;
  }
  /**
   * 通过变换参数组合构建仿射矩阵（实例，写入 this）。
   * 等价于 `Matrix2D.fromTranslateRotationSkewScaleOrigin(this, ...)`
   */
  composeFromTransform(e, n, s, i = { x: 1, y: 1 }, r = { x: 0, y: 0 }) {
    return Rt.fromTranslateRotationSkewScaleOrigin(this, e, n, s, i, r), this;
  }
  invert() {
    return Rt.invert(this, this);
  }
  /**
   * 从变换对象构建矩阵（实例，写入 this）。
   *
   * @param transform { position, scale?, skew?, rotation?, origin? }
   */
  fromTransform(e) {
    return Rt.fromTranslateRotationSkewScaleOrigin(
      this,
      e.position,
      e.rotation ?? 0,
      e.skew ?? { x: 0, y: 0 },
      e.scale ?? { x: 1, y: 1 },
      e.origin ?? { x: 0, y: 0 }
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
    return Rt.equals(this, e);
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
    return new Rt(this[0], this[1], this[2], this[3], this[4], this[5]);
  }
  toString() {
    return `Matrix2D(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]}, ${this[4]}, ${this[5]})`;
  }
}
function eo(o, e, n, s) {
  if (e === 0)
    return n >= s[o] && n < s[o + 1] || n === s[s.length - 1] && o === s.length - 2 ? 1 : 0;
  let i = 0;
  const r = s[o + e] - s[o];
  r > 1e-12 && (i += (n - s[o]) / r * eo(o, e - 1, n, s));
  const c = s[o + e + 1] - s[o + 1];
  return c > 1e-12 && (i += (s[o + e + 1] - n) / c * eo(o + 1, e - 1, n, s)), i;
}
function lh(o, e, n, s) {
  const i = new Array(e + 1).fill(0);
  i[0] = 1;
  const r = new Array(e + 1), c = new Array(e + 1);
  for (let a = 1; a <= e; a++) {
    r[a] = n - s[o + 1 - a], c[a] = s[o + a] - n;
    let h = 0;
    for (let l = 0; l < a; l++) {
      const u = i[l] / (c[l + 1] + r[a - l]);
      i[l] = h + c[l + 1] * u, h = r[a - l] * u;
    }
    i[a] = h;
  }
  return i;
}
function mc(o, e, n, s) {
  if (n >= s[o + 1]) return o;
  if (n <= s[e]) return e;
  let i = e, r = o + 1, c = Math.floor((i + r) / 2);
  for (; n < s[c] || n >= s[c + 1]; )
    n < s[c] ? r = c : i = c, c = Math.floor((i + r) / 2);
  return c;
}
function uh(o, e) {
  const n = new Array(o + e + 2);
  for (let i = 0; i <= e; i++) n[i] = 0;
  const s = o - e;
  for (let i = 1; i <= s; i++) n[e + i] = i / (s + 1);
  for (let i = o + 1; i <= o + e + 1; i++) n[i] = 1;
  return n;
}
function cr(o, e, n, s, i) {
  const r = e.length - 1, c = mc(r, i, o, s), a = lh(c, i, o, s);
  let h = 0, l = 0, u = 0;
  for (let f = 0; f <= i; f++) {
    const d = c - i + f, x = n[d], y = a[f] * x;
    h += y * e[d].x, l += y * e[d].y, u += y;
  }
  return u === 0 ? rt.create(0, 0) : rt.create(h / u, l / u);
}
function fh(o, e, n, s, i) {
  const r = e.length - 1;
  mc(r, i, o, s);
  const c = 1e-6, a = tn(o - c, 0, 1), h = tn(o + c, 0, 1), l = cr(a, e, n, s, i), u = cr(h, e, n, s, i), f = h - a;
  return f === 0 ? rt.create(0, 0) : rt.create((u.x - l.x) / f, (u.y - l.y) / f);
}
class Jf {
  /** 控制点 */
  points;
  /** 权重 */
  weights;
  /** 节点向量 */
  knots;
  /** 次数 */
  degree;
  constructor(e, n, s, i = 3) {
    this.points = e.map((r) => ({ x: r.x, y: r.y })), this.weights = n ?? new Array(e.length).fill(1), this.degree = i, s ? this.knots = s : this.knots = uh(e.length - 1, i);
  }
  /** 计算曲线上参数 u∈[0,1] 处的点 */
  evaluate(e) {
    return cr(e, this.points, this.weights, this.knots, this.degree);
  }
  /** 计算曲线在 u 处的一阶导数 */
  derivative(e) {
    return fh(e, this.points, this.weights, this.knots, this.degree);
  }
  /** 计算曲线在 u 处的法向量 */
  normal(e) {
    const n = this.derivative(e), s = Math.sqrt(n.x * n.x + n.y * n.y);
    return s === 0 ? { x: 0, y: 0 } : { x: -n.y / s, y: n.x / s };
  }
  /** 获取边界框（采样法） */
  getBounds(e = 50) {
    const n = St.default();
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
    const r = (c, a, h) => {
      const l = Math.floor((c + a) / 2);
      if (l === c || l === a) {
        s.push(i[a]);
        return;
      }
      const u = i[l], f = i[a], d = f.x - h.x, x = f.y - h.y, y = d * d + x * x;
      if (y < 1e-20) {
        s.push(f);
        return;
      }
      Math.abs((u.x - h.x) * x - (u.y - h.y) * d) / Math.sqrt(y) <= e ? s.push(f) : (r(c, l, h), r(l, a, u));
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
      const c = this.evaluate(r / s), a = c.x - e, h = c.y - n, l = a * a + h * h;
      l < i && (i = l);
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
      const h = a / s, l = this.evaluate(h), u = l.x - e, f = l.y - n, d = u * u + f * f;
      d < r && (r = d, i = h);
    }
    let c = i;
    for (let a = 0; a < 8; a++) {
      const h = this.evaluate(c), l = this.derivative(c), u = h.x - e, f = h.y - n, d = u * l.x + f * l.y, x = l.x * l.x + l.y * l.y;
      if (Math.abs(x) < 1e-15) break;
      c = c - d / x, c = tn(c, 0, 1);
    }
    return this.evaluate(c);
  }
}
class qe {
  static pool = Sn.create({
    initSize: 10,
    create: () => new qe(),
    init: (e) => {
      e.topLeft.set(0, 0), e.topRight.set(0, 0), e.bottomRight.set(0, 0), e.bottomLeft.set(0, 0);
    }
  });
  /** 4 个角点（逆时针顺序：topLeft→topRight→bottomRight→bottomLeft） */
  topLeft;
  topRight;
  bottomRight;
  bottomLeft;
  constructor(e = 0, n = 0, s = 0, i = 0, r = 0, c = 0, a = 0, h = 0) {
    this.topLeft = new lt(e, n), this.topRight = new lt(s, i), this.bottomRight = new lt(r, c), this.bottomLeft = new lt(a, h);
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
    return new qe();
  }
  /** 从 4 个角点创建（逆时针：topLeft→topRight→bottomRight→bottomLeft） */
  static fromCorners(e, n, s, i) {
    return new qe(
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
    return new qe(
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
    const c = Math.cos(r), a = Math.sin(r), h = (M, E) => [
      e + M * c - E * a,
      n + M * a + E * c
    ], [l, u] = h(-s, -i), [f, d] = h(s, -i), [x, y] = h(s, i), [g, w] = h(-s, i);
    return new qe(l, u, f, d, x, y, g, w);
  }
  /** 从点集计算最小面积 OBB（PCA 方法） */
  static fromPoints(e) {
    if (e.length === 0) return new qe();
    let n = 0, s = 0;
    for (const N of e)
      n += N.x, s += N.y;
    n /= e.length, s /= e.length;
    let i = 0, r = 0, c = 0;
    for (const N of e) {
      const O = N.x - n, z = N.y - s;
      i += O * O, r += z * z, c += O * z;
    }
    i /= e.length, r /= e.length, c /= e.length;
    const a = 0.5 * Math.atan2(2 * c, i - r), h = Math.cos(a), l = Math.sin(a);
    let u = 1 / 0, f = 1 / 0, d = -1 / 0, x = -1 / 0;
    for (const N of e) {
      const O = N.x - n, z = N.y - s, k = O * h + z * l, Y = -O * l + z * h;
      k < u && (u = k), Y < f && (f = Y), k > d && (d = k), Y > x && (x = Y);
    }
    const y = (d - u) * 0.5, g = (x - f) * 0.5, w = (u + d) * 0.5, M = (f + x) * 0.5, E = n + w * h - M * l, I = s + w * l + M * h;
    return qe.fromCenterRotation(E, I, y, g, a);
  }
  // ---- 获取角点 ----
  /** 获取 4 个角点（逆时针），存入 out */
  getCorners(e) {
    return e[0] || (e[0] = new lt()), e[0].copy(this.topLeft), e[1] || (e[1] = new lt()), e[1].copy(this.topRight), e[2] || (e[2] = new lt()), e[2].copy(this.bottomRight), e[3] || (e[3] = new lt()), e[3].copy(this.bottomLeft), e;
  }
  /** 获取轴对齐包围盒 */
  getBoundingRect() {
    const e = St.default();
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
      for (let h = 0; h < 2; h++) {
        const l = c[h + 1].x - c[h].x, u = c[h + 1].y - c[h].y, f = Math.sqrt(l * l + u * u);
        f > 0 && a.push([u / f, l / f]);
      }
      return a;
    }, r = [...i(n), ...i(s)];
    for (const [c, a] of r) {
      let h = 1 / 0, l = -1 / 0;
      for (const d of n) {
        const x = d.x * c + d.y * a;
        x < h && (h = x), x > l && (l = x);
      }
      let u = 1 / 0, f = -1 / 0;
      for (const d of s) {
        const x = d.x * c + d.y * a;
        x < u && (u = x), x > f && (f = x);
      }
      if (l < u || f < h) return !1;
    }
    return !0;
  }
  /** 判断是否与 AABB 相交 */
  intersectsRect(e) {
    const n = qe.fromBoundingRect(e);
    return this.intersects(n);
  }
  // ---- 写入 / 变换 ----
  copy(e) {
    return this.topLeft.copy(e.topLeft), this.topRight.copy(e.topRight), this.bottomRight.copy(e.bottomRight), this.bottomLeft.copy(e.bottomLeft), this;
  }
  /** 用中心+半尺寸+旋转角设置 OBB */
  setFromCenterRotation(e, n, s, i, r) {
    const c = Math.cos(r), a = Math.sin(r), h = (M, E) => [
      e + M * c - E * a,
      n + M * a + E * c
    ], [l, u] = h(-s, -i), [f, d] = h(s, -i), [x, y] = h(s, i), [g, w] = h(-s, i);
    return this.topLeft.set(l, u), this.topRight.set(f, d), this.bottomRight.set(x, y), this.bottomLeft.set(g, w), this;
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
    const i = qe.fromPoints(s);
    return this.copy(i), this;
  }
  /** 设置角点 */
  setCorners(e, n, s, i) {
    return this.topLeft.set(e.x, e.y), this.topRight.set(n.x, n.y), this.bottomRight.set(s.x, s.y), this.bottomLeft.set(i.x, i.y), this;
  }
  clone() {
    return new qe(
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
function gc(o, e, n, s) {
  const i = 1 - o, r = i * i, c = o * o;
  return rt.create(
    r * e.x + 2 * i * o * n.x + c * s.x,
    r * e.y + 2 * i * o * n.y + c * s.y
  );
}
function wc(o, e, n) {
  const s = [], i = o.x - 2 * e.x + n.x, r = e.x - o.x;
  if (i !== 0) {
    const h = r / i;
    h > 0 && h < 1 && s.push(h);
  }
  const c = o.y - 2 * e.y + n.y, a = e.y - o.y;
  if (c !== 0) {
    const h = a / c;
    h > 0 && h < 1 && !s.includes(h) && s.push(h);
  }
  return s.sort((h, l) => h - l);
}
function vc(o, e, n) {
  const s = wc(o, e, n), i = [o, n];
  for (const r of s)
    i.push(gc(r, o, e, n));
  return St.default().fromPoints(i);
}
function Qf(o, e, n) {
  const s = o.x - 2 * e.x + n.x, i = o.y - 2 * e.y + n.y, r = -2 * o.x + 2 * e.x, c = -2 * o.y + 2 * e.y, a = o.x, h = o.y;
  return { ax: s, ay: i, bx: r, by: c, cx: a, cy: h };
}
class bs {
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
    return gc(e, this.p0, this.p1, this.p2);
  }
  // 获取极值的根（t值）
  getExtremaRoots() {
    return wc(this.p0, this.p1, this.p2);
  }
  // 获取边界框
  getBounds() {
    return vc(this.p0, this.p1, this.p2);
  }
  /**
   * 在参数 t 处分割二次贝塞尔曲线
   * @param t - 分割参数 [0, 1]
   * @returns [左半曲线, 右半曲线]
   */
  split(e) {
    const { p0: n, p1: s, p2: i } = this, r = 1 - e, c = { x: r * n.x + e * s.x, y: r * n.y + e * s.y }, a = { x: r * s.x + e * i.x, y: r * s.y + e * i.y }, h = { x: r * c.x + e * a.x, y: r * c.y + e * a.y };
    return [
      new bs([n, c, h]),
      new bs([h, a, i])
    ];
  }
  /**
   * 将二次贝塞尔曲线扁平化为线段序列
   * @param epsilon - 近似误差容限（默认 0.5）
   * @returns PointLike[] 点序列（包含起点和终点）
   */
  flatten(e = 0.5) {
    const n = [this.p0], s = (i, r, c) => {
      const a = c.x - i.x, h = c.y - i.y, l = a * a + h * h;
      if (l <= 1e-20) {
        if ((r.x - i.x) ** 2 + (r.y - i.y) ** 2 <= e * e) {
          n.push(c);
          return;
        }
      } else {
        const y = ((r.x - i.x) * a + (r.y - i.y) * h) / l, g = Math.max(0, Math.min(1, y)), w = i.x + g * a, M = i.y + g * h, E = r.x - w, I = r.y - M;
        if (E * E + I * I < e * e) {
          n.push(c);
          return;
        }
      }
      const u = 0.5, f = { x: (i.x + r.x) * u, y: (i.y + r.y) * u }, d = { x: (r.x + c.x) * u, y: (r.y + c.y) * u }, x = { x: (f.x + d.x) * u, y: (f.y + d.y) * u };
      s(i, f, x), s(x, d, c);
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
    const { p0: s, p1: i, p2: r } = this, c = s.x - 2 * i.x + r.x, a = s.y - 2 * i.y + r.y, h = 2 * (i.x - s.x), l = 2 * (i.y - s.y), u = s.x - e, f = s.y - n, d = 2 * (c * c + a * a), x = 3 * (c * h + a * l), y = 2 * (c * u + a * f) + (h * h + l * l), g = h * u + l * f, w = wi(d, x, y, g);
    w.push(0, 1);
    let M = 1 / 0;
    for (const E of w) {
      if (E < 0 || E > 1) continue;
      const I = 1 - E, N = I * I * s.x + 2 * I * E * i.x + E * E * r.x, O = I * I * s.y + 2 * I * E * i.y + E * E * r.y, z = N - e, k = O - n, Y = z * z + k * k;
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
    const { p0: s, p1: i, p2: r } = this, c = s.x - 2 * i.x + r.x, a = s.y - 2 * i.y + r.y, h = 2 * (i.x - s.x), l = 2 * (i.y - s.y), u = s.x - e, f = s.y - n, d = 2 * (c * c + a * a), x = 3 * (c * h + a * l), y = 2 * (c * u + a * f) + (h * h + l * l), g = h * u + l * f, w = wi(d, x, y, g);
    w.push(0, 1);
    let M = 0, E = 1 / 0;
    for (const N of w) {
      if (N < 0 || N > 1) continue;
      const O = 1 - N, z = O * O * s.x + 2 * O * N * i.x + N * N * r.x, k = O * O * s.y + 2 * O * N * i.y + N * N * r.y, Y = z - e, H = k - n, $ = Y * Y + H * H;
      $ < E && (E = $, M = N);
    }
    const I = 1 - M;
    return {
      x: I * I * s.x + 2 * I * M * i.x + M * M * r.x,
      y: I * I * s.y + 2 * I * M * i.y + M * M * r.y
    };
  }
}
function dh(o, e, n, s, i, r) {
  const c = Math.min(n.y, s.y, i.y, r.y), a = Math.max(n.y, s.y, i.y, r.y);
  if (e < c || e > a) return 0;
  const h = r.y - 3 * i.y + 3 * s.y - n.y, l = 3 * (i.y - 2 * s.y + n.y), u = 3 * (s.y - n.y), f = n.y - e, d = wi(h, l, u, f);
  let x = 0;
  for (const y of d) {
    if (y <= 0 || y >= 1) continue;
    const g = 1 - y, w = g * g, M = w * g, E = y * y, I = E * y;
    if (M * n.x + 3 * w * y * s.x + 3 * g * E * i.x + I * r.x < o) continue;
    const O = 3 * h * E + 2 * l * y + u;
    O > 0 ? x += 1 : O < 0 && (x -= 1);
  }
  return x;
}
function xh(o, e, n, s, i) {
  const r = Math.min(n.y, s.y, i.y), c = Math.max(n.y, s.y, i.y);
  if (e < r || e > c) return 0;
  const a = n.y - 2 * s.y + i.y, h = 2 * (s.y - n.y), l = n.y - e, u = jn(a, h, l);
  let f = 0;
  for (const d of u) {
    if (d <= 0 || d >= 1) continue;
    const x = 1 - d;
    if (x * x * n.x + 2 * x * d * s.x + d * d * i.x < o) continue;
    const g = 2 * a * d + h;
    g > 0 ? f += 1 : g < 0 && (f -= 1);
  }
  return f;
}
function no(o, e, n, s, i, r) {
  return s === r || e < Math.min(s, r) || e >= Math.max(s, r) ? 0 : o <= n + (i - n) * (e - s) / (r - s) ? r > s ? 1 : -1 : 0;
}
var yh = /* @__PURE__ */ ((o) => (o[o.MoveTo = 1] = "MoveTo", o[o.LineTo = 2] = "LineTo", o[o.QuadraticTo = 4] = "QuadraticTo", o[o.CubicTo = 8] = "CubicTo", o[o.Close = 16] = "Close", o))(yh || {});
const $s = {
  Arc: 1,
  Rect: 2,
  Ellipse: 4,
  RoundRect: 8
}, ph = {
  1: 1,
  2: 1,
  4: 2,
  8: 3,
  16: 0
};
var mh = /* @__PURE__ */ ((o) => (o.M = "M", o.L = "L", o.Q = "Q", o.C = "C", o.Z = "Z", o.A = "A", o.R = "R", o.E = "E", o.RR = "RR", o))(mh || {}), gh = /* @__PURE__ */ ((o) => (o[o.CW = 0] = "CW", o[o.CCW = 1] = "CCW", o[o.Unknown = 2147483647] = "Unknown", o))(gh || {});
class Qe {
  static fromSvgPath(e) {
    return so(e);
  }
  static default() {
    return new Qe();
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
    this.verbs = [], this.points = [], this.cmds = [], e instanceof Qe ? this.copy(e) : typeof e == "string" && this.copy(so(e));
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
    const e = new Qe();
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
    Rt.mapPoints(this.points, e, this.points), this.markDirty();
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
    const c = 4 * r / (3 * (r + 1)), a = this.lastPoint, h = a.x + (e - a.x) * c, l = a.y + (n - a.y) * c, u = s + (e - s) * c, f = i + (n - i) * c;
    this.bezierCurveTo(h, l, u, f, s, i);
  }
  rect(e, n, s, i) {
    this.moveTo(e, n), this.lineTo(e + s, n), this.lineTo(e + s, n + i), this.lineTo(e, n + i), this.lineTo(e, n), this.segmentType |= $s.Rect;
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
    const { startAngle: a, endAngle: h } = ir(i, r, c), l = h - a, u = Math.max(1, Math.ceil(Math.abs(l) / (Math.PI / 2))), f = l / u;
    let d = a;
    for (let x = 0; x < u; x++) {
      const y = d, g = d + f, w = e + s * Math.cos(y), M = n + s * Math.sin(y);
      x === 0 && (this.isEmpty ? this.moveTo(w, M) : this.lineTo(w, M));
      const E = f, I = 4 / 3 * Math.tan(E / 4), N = w - I * s * Math.sin(y), O = M + I * s * Math.cos(y), z = e + s * Math.cos(g), k = n + s * Math.sin(g), Y = z + I * s * Math.sin(g), H = k - I * s * Math.cos(g);
      this.bezierCurveTo(N, O, Y, H, z, k), d = g;
    }
    this.segmentType |= $s.Arc;
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
  ellipse(e, n, s, i, r, c, a, h = !1) {
    const { startAngle: l, endAngle: u } = ir(c, a, h), f = u - l, d = Math.max(1, Math.ceil(Math.abs(f) / (Math.PI / 2))), x = f / d, y = Math.cos(r), g = Math.sin(r);
    let w = l;
    for (let M = 0; M < d; M++) {
      const E = w, I = w + x, N = Math.cos(E), O = Math.sin(E), z = e + y * s * N - g * i * O, k = n + g * s * N + y * i * O;
      M === 0 && (this.isEmpty ? this.moveTo(z, k) : this.lineTo(z, k));
      const Y = x, H = 4 / 3 * Math.tan(Y / 4), $ = -s * O, W = i * N, J = z + H * (y * $ - g * W), ot = k + H * (g * $ + y * W), K = Math.cos(I), j = Math.sin(I), V = e + y * s * K - g * i * j, at = n + g * s * K + y * i * j, pt = -s * j, At = i * K, vt = V - H * (y * pt - g * At), Ot = at - H * (g * pt + y * At);
      this.bezierCurveTo(J, ot, vt, Ot, V, at), w = I;
    }
    this.segmentType |= $s.Ellipse;
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
    const c = this.lastPoint, a = lt.fromPoint(c), h = lt.create(e, n), l = lt.create(s, i);
    let u = h.clone().subtract(a).normalize(), f = l.clone().subtract(h).normalize(), d = u.dot(f), x = u.cross(f);
    if (!u.isFinite() || !f.isFinite() || Math.abs(x) <= 1e-6)
      return this.lineTo(e, n);
    let y = Math.abs(r * (1 - d) / x), g = h.clone().subtract(u.multiplyScalar(y)), w = h.clone().add(f.multiplyScalar(y)), M = Math.sqrt(0.5 + d * 0.5);
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
    const c = this.lastPoint, a = c.x, h = c.y, l = e - a, u = n - h, f = s - e, d = i - n, x = Math.sqrt(l * l + u * u), y = Math.sqrt(f * f + d * d);
    if (x < 1e-10 || y < 1e-10 || r < 1e-10) {
      this.lineTo(e, n);
      return;
    }
    const g = l / x, w = u / x, M = f / y, E = d / y, I = g * M + w * E, N = g * E - w * M;
    if (Math.abs(N) < 1e-10) {
      this.lineTo(e, n);
      return;
    }
    const O = N > 0 ? 1 : -1, z = Math.abs(r * Math.tan(Math.acos(I) / 2)), k = e - z * g, Y = n - z * w, H = e + z * M, $ = n + z * E, W = -w, J = g, ot = k + O * r * W, K = Y + O * r * J, j = Math.atan2(Y - K, k - ot), V = Math.atan2($ - K, H - ot);
    this.lineTo(k, Y);
    const at = O < 0;
    this.arc(ot, K, r, j, V, at);
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
    let c = 0, a = 0, h = 0, l = 0;
    if (r === void 0 || r === 0) {
      this.rect(e, n, s, i);
      return;
    }
    if (typeof r == "number")
      c = a = h = l = r;
    else {
      const x = r, y = x.length;
      if (y === 0) {
        this.rect(e, n, s, i);
        return;
      }
      c = x[0], y === 1 ? a = h = l = c : y === 2 ? (a = x[1], h = c, l = a) : y === 3 ? (a = x[1], h = x[2], l = a) : (a = x[1], h = x[2], l = x[3]);
    }
    c = Math.max(0, c), a = Math.max(0, a), h = Math.max(0, h), l = Math.max(0, l);
    let u = 1;
    const f = s > 0 ? Math.min(1, s / (c + a), s / (l + h)) : 0, d = i > 0 ? Math.min(1, i / (c + l), i / (a + h)) : 0;
    u = Math.min(f, d), u < 1 && (c *= u, a *= u, h *= u, l *= u), this.moveTo(e + c, n), this.lineTo(e + s - a, n), a > 0 && this.arcTo(e + s, n, e + s, n + a, a), this.lineTo(e + s, n + i - h), h > 0 && this.arcTo(e + s, n + i, e + s - h, n + i, h), this.lineTo(e + l, n + i), l > 0 && this.arcTo(e, n + i, e, n + i - l, l), this.lineTo(e, n + c), c > 0 && this.arcTo(e, n, e + c, n, c), this.closePath(), this.segmentType |= $s.RoundRect;
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
  ellipseSvgArc(e, n, s, i, r, c, a, h, l) {
    if (Math.abs(e - s) < 1e-10 && Math.abs(n - i) < 1e-10) return;
    if (r = Math.abs(r), c = Math.abs(c), r < 1e-10 || c < 1e-10) {
      this.lineTo(s, i);
      return;
    }
    const u = Math.cos(a), f = Math.sin(a), d = (e - s) / 2, x = (n - i) / 2, y = u * d + f * x, g = -f * d + u * x, w = y * y / (r * r) + g * g / (c * c);
    if (w > 1) {
      const pt = Math.sqrt(w);
      r *= pt, c *= pt;
    }
    const M = r * r, E = c * c, I = y * y, N = g * g, O = Math.max(
      0,
      (M * E - M * N - E * I) / (M * N + E * I)
    ), z = h !== l ? 1 : -1, k = Math.sqrt(O), Y = z * k * (r * g / c), H = z * k * (-c * y / r), $ = u * Y - f * H + (e + s) / 2, W = f * Y + u * H + (n + i) / 2, J = (y - Y) / r, ot = (g - H) / c, K = (-y - Y) / r, j = (-g - H) / c, V = Math.atan2(ot, J), at = Math.atan2(j, K);
    this.ellipse($, W, r, c, a, V, at, !l);
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
        r += no(e, n, c.x, c.y, a.x, a.y);
      },
      quadraticCurveTo: (c, a, h) => {
        r += xh(
          e,
          n,
          c,
          a,
          h
        );
      },
      cubicCurveTo: (c, a, h, l) => {
        r += dh(
          e,
          n,
          c,
          a,
          h,
          l
        );
      },
      close: (c, a) => {
        lt.equalsEpsilon(c, a) || (r += no(e, n, c.x, c.y, a.x, a.y));
      }
    }), s === "evenodd" ? (r & 1) !== 0 : r !== 0;
  }
  invertVisit(e) {
    const n = this.points, s = this.verbs;
    let i = 0, r = !0, c = !1, a = lt.create();
    for (let h = s.length - 1, l = n.length; h >= 0; h--) {
      let u = s[h];
      switch (r && (l -= 1, r = !1, e.moveTo?.(n[l]), a.copy(n[l]), i = l), u) {
        case 1:
          c && (e.close?.(a, n[i]), c = !1), r = !0;
          break;
        case 2:
          l -= 1, e.lineTo?.(a, n[l]), a.copy(n[l]);
          break;
        case 4:
          l -= 2, e.quadraticCurveTo?.(a, n[l + 1], n[l]), a.copy(n[l]);
          break;
        case 8:
          l -= 3, e.cubicCurveTo?.(a, n[l + 2], n[l + 1], n[l]), a.copy(n[l]);
          break;
        case 16:
          c = !0;
          break;
      }
    }
  }
  visit(e) {
    const n = this.points, s = this.size;
    let i = 0, r = lt.default();
    for (let c = 0; c < s; c++) {
      const a = this.verbs[c], h = ph[a];
      switch (i += h, a) {
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
    return this._boundsDirty ? (this._bounds || (this._bounds = St.default()), this._bounds.setEmpty(), this.points.forEach((e) => {
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
    this._tightBounds || (this._tightBounds = St.default());
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
        const c = vc(s, i, r);
        n(c.minX, c.minY), n(c.maxX, c.maxY);
      },
      cubicCurveTo: (s, i, r, c) => {
        const a = xc(
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
    let i = [], r = lt.create();
    const c = () => {
      e && !lt.equalsEpsilon(i[i.length - 1], r) && i.push({ x: r.x, y: r.y });
    };
    return this.visit({
      moveTo: (a) => {
        i.length > 0 && (c(), s.push(i), i = []), r.copy(a), i.push({ x: a.x, y: a.y });
      },
      lineTo: (a, h) => {
        i.push({ x: h.x, y: h.y });
      },
      quadraticCurveTo: (a, h, l) => {
        new bs([a, h, l]).flatten(n).forEach((f) => {
          i.push(f);
        });
      },
      cubicCurveTo: (a, h, l, u) => {
        new Ms([a, h, l, u]).flatten(n).forEach((d) => {
          i.push(d);
        });
      },
      close: (a, h) => {
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
const wh = (o) => {
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
        const h = o.substring(r, a).trim();
        if (h && !i.test(h)) {
          const l = parseFloat(h);
          isNaN(l) || s.push(l);
        }
        r = a - 1;
      }
    }
  }
  return n && e.push({ cmd: n, params: [...s] }), e;
};
function so(o) {
  const e = new Qe();
  if (!o || !o.trim()) return e;
  const n = wh(o);
  let s = rt.fromPoint({ x: 0, y: 0 }), i = null;
  for (let r = 0; r < n.length; r++) {
    const { cmd: c, params: a } = n[r], h = c === c.toLowerCase(), l = c.toUpperCase();
    let u = 0;
    switch (l) {
      case "M": {
        for (; u + 1 <= a.length; ) {
          const f = a[u++], d = a[u++], x = h ? s.x + f : f, y = h ? s.y + d : d;
          if (u === 2 ? e.moveTo(x, y) : e.lineTo(x, y), s = rt.fromPoint({ x, y }), h) break;
        }
        i = null;
        break;
      }
      case "L": {
        for (; u + 1 <= a.length; ) {
          const f = a[u++], d = a[u++], x = h ? s.x + f : f, y = h ? s.y + d : d;
          e.lineTo(x, y), s = rt.fromPoint({ x, y });
        }
        i = null;
        break;
      }
      case "H": {
        for (; u < a.length; ) {
          const f = a[u++], d = h ? s.x + f : f;
          e.lineTo(d, s.y), s = rt.fromPoint({ x: d, y: s.y });
        }
        i = null;
        break;
      }
      case "V": {
        for (; u < a.length; ) {
          const f = a[u++], d = h ? s.y + f : f;
          e.lineTo(s.x, d), s = rt.fromPoint({ x: s.x, y: d });
        }
        i = null;
        break;
      }
      case "C": {
        for (; u + 5 <= a.length; ) {
          const f = a[u++], d = a[u++], x = a[u++], y = a[u++], g = a[u++], w = a[u++], M = h ? s.x + f : f, E = h ? s.y + d : d, I = h ? s.x + x : x, N = h ? s.y + y : y, O = h ? s.x + g : g, z = h ? s.y + w : w;
          e.bezierCurveTo(M, E, I, N, O, z), i = { x: I, y: N }, s = rt.fromPoint({ x: O, y: z });
        }
        break;
      }
      case "S": {
        for (; u + 3 <= a.length; ) {
          const f = a[u++], d = a[u++], x = a[u++], y = a[u++];
          let g, w;
          i ? (g = 2 * s.x - i.x, w = 2 * s.y - i.y) : (g = s.x, w = s.y);
          const M = h ? s.x + f : f, E = h ? s.y + d : d, I = h ? s.x + x : x, N = h ? s.y + y : y;
          e.bezierCurveTo(g, w, M, E, I, N), i = { x: M, y: E }, s = rt.fromPoint({ x: I, y: N });
        }
        break;
      }
      case "Q": {
        for (; u + 3 <= a.length; ) {
          const f = a[u++], d = a[u++], x = a[u++], y = a[u++], g = h ? s.x + f : f, w = h ? s.y + d : d, M = h ? s.x + x : x, E = h ? s.y + y : y;
          e.quadraticCurveTo(g, w, M, E), i = { x: g, y: w }, s = rt.fromPoint({ x: M, y: E });
        }
        break;
      }
      case "T": {
        for (; u + 1 <= a.length; ) {
          const f = a[u++], d = a[u++];
          let x, y;
          i ? (x = 2 * s.x - i.x, y = 2 * s.y - i.y) : (x = s.x, y = s.y);
          const g = h ? s.x + f : f, w = h ? s.y + d : d;
          e.quadraticCurveTo(x, y, g, w), i = { x, y }, s = rt.fromPoint({ x: g, y: w });
        }
        break;
      }
      case "A": {
        for (; u + 6 <= a.length; ) {
          const f = a[u++], d = a[u++], x = a[u++] * Math.PI / 180, y = a[u++], g = a[u++], w = a[u++], M = a[u++], E = h ? s.x + w : w, I = h ? s.y + M : M;
          e.ellipseSvgArc(
            s.x,
            s.y,
            E,
            I,
            f,
            d,
            x,
            y !== 0,
            g !== 0
          ), s = rt.fromPoint({ x: E, y: I }), i = null;
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
var vh = /* @__PURE__ */ ((o) => (o.Union = "union", o.Intersect = "intersect", o.Difference = "difference", o.Xor = "xor", o))(vh || {});
const an = 1e-10, Oi = 0.25, Mh = 20, Gn = (o, e) => ({ x: o, y: e }), Mc = (o, e) => Gn(o.x + e.x, o.y + e.y), Je = (o, e) => Gn(o.x - e.x, o.y - e.y), bc = (o, e) => Gn(o.x * e, o.y * e), De = (o, e, n) => Gn(o.x + (e.x - o.x) * n, o.y + (e.y - o.y) * n), ps = (o, e) => o.x * e.y - o.y * e.x, Hn = (o, e, n = an) => Math.abs(o.x - e.x) < n && Math.abs(o.y - e.y) < n;
function vi(o, e) {
  switch (o.type) {
    case "line":
      return De(o.p0, o.p1, e);
    case "quad": {
      const n = 1 - e;
      return Gn(
        n * n * o.p0.x + 2 * n * e * o.cp.x + e * e * o.p1.x,
        n * n * o.p0.y + 2 * n * e * o.cp.y + e * e * o.p1.y
      );
    }
    case "cubic": {
      const n = 1 - e;
      return Gn(
        n * n * n * o.p0.x + 3 * n * n * e * o.cp1.x + 3 * n * e * e * o.cp2.x + e * e * e * o.p1.x,
        n * n * n * o.p0.y + 3 * n * n * e * o.cp1.y + 3 * n * e * e * o.cp2.y + e * e * e * o.p1.y
      );
    }
  }
}
function _s(o) {
  return vi(o, 0.5);
}
function Mi(o) {
  let e = 1 / 0, n = 1 / 0, s = -1 / 0, i = -1 / 0;
  const r = o.type === "line" ? [o.p0, o.p1] : o.type === "quad" ? [o.p0, o.cp, o.p1] : [o.p0, o.cp1, o.cp2, o.p1];
  for (const c of r)
    c.x < e && (e = c.x), c.x > s && (s = c.x), c.y < n && (n = c.y), c.y > i && (i = c.y);
  return { minX: e, minY: n, maxX: s, maxY: i };
}
function _c(o, e, n = an) {
  return o.maxX + n >= e.minX && e.maxX + n >= o.minX && o.maxY + n >= e.minY && e.maxY + n >= o.minY;
}
function ki(o, e, n) {
  const s = Je(n, e), i = s.x * s.x + s.y * s.y;
  if (i < 1e-14) return Math.hypot(o.x - e.x, o.y - e.y);
  const r = Math.max(0, Math.min(1, ((o.x - e.x) * s.x + (o.y - e.y) * s.y) / i)), c = Mc(e, bc(s, r));
  return Math.hypot(o.x - c.x, o.y - c.y);
}
function io(o) {
  switch (o.type) {
    case "line":
      return !0;
    case "quad":
      return ki(o.cp, o.p0, o.p1) <= Oi;
    case "cubic":
      return ki(o.cp1, o.p0, o.p1) <= Oi && ki(o.cp2, o.p0, o.p1) <= Oi;
  }
}
function ar(o, e) {
  switch (o.type) {
    case "line": {
      const n = De(o.p0, o.p1, e);
      return [
        { type: "line", p0: o.p0, p1: n },
        { type: "line", p0: n, p1: o.p1 }
      ];
    }
    case "quad": {
      const n = De(o.p0, o.cp, e), s = De(o.cp, o.p1, e), i = De(n, s, e);
      return [
        { type: "quad", p0: o.p0, cp: n, p1: i },
        { type: "quad", p0: i, cp: s, p1: o.p1 }
      ];
    }
    case "cubic": {
      const n = De(o.p0, o.cp1, e), s = De(o.cp1, o.cp2, e), i = De(o.cp2, o.p1, e), r = De(n, s, e), c = De(s, i, e), a = De(r, c, e);
      return [
        { type: "cubic", p0: o.p0, cp1: n, cp2: r, p1: a },
        { type: "cubic", p0: a, cp1: c, cp2: i, p1: o.p1 }
      ];
    }
  }
}
function Ts(o) {
  return o.type === "line", o.p0;
}
function hn(o) {
  return o.type === "line", o.p1;
}
function ro(o, e, n, s) {
  const i = Je(e, o), r = Je(s, n), c = ps(i, r);
  if (Math.abs(c) < 1e-12) return null;
  const a = ps(Je(n, o), r) / c, h = ps(Je(n, o), i) / c;
  return a < -an || a > 1 + an || h < -an || h > 1 + an ? null : {
    t: Math.max(0, Math.min(1, a)),
    u: Math.max(0, Math.min(1, h)),
    point: Mc(o, bc(i, a))
  };
}
function js(o, e, n) {
  return e + o * (n - e);
}
function us(o, e, n, s) {
  if (n >= Mh) {
    const h = ro(o.edge.p0, hn(o.edge), e.edge.p0, hn(e.edge));
    h && s.push({
      tA: js(h.t, o.t0, o.t1),
      tB: js(h.u, e.t0, e.t1),
      point: h.point
    });
    return;
  }
  const i = Mi(o.edge), r = Mi(e.edge);
  if (!_c(i, r)) return;
  if (io(o.edge) && io(e.edge)) {
    const h = ro(o.edge.p0, hn(o.edge), e.edge.p0, hn(e.edge));
    h && s.push({
      tA: js(h.t, o.t0, o.t1),
      tB: js(h.u, e.t0, e.t1),
      point: h.point
    });
    return;
  }
  const c = Math.hypot(i.maxX - i.minX, i.maxY - i.minY), a = Math.hypot(r.maxX - r.minX, r.maxY - r.minY);
  if (c >= a) {
    const h = (o.t0 + o.t1) / 2, [l, u] = ar(o.edge, 0.5);
    us({ edge: l, t0: o.t0, t1: h }, e, n + 1, s), us({ edge: u, t0: h, t1: o.t1 }, e, n + 1, s);
  } else {
    const h = (e.t0 + e.t1) / 2, [l, u] = ar(e.edge, 0.5);
    us(o, { edge: l, t0: e.t0, t1: h }, n + 1, s), us(o, { edge: u, t0: h, t1: e.t1 }, n + 1, s);
  }
}
function oo(o) {
  const e = [];
  let n = [], s = { x: 0, y: 0 }, i = { x: 0, y: 0 }, r = !1;
  const c = (a) => {
    if (a.length === 0) return;
    const h = hn(a[a.length - 1]);
    Hn(h, s) || a.push({ type: "line", p0: h, p1: s });
  };
  return o.visit({
    moveTo: (a) => {
      r && n.length > 0 && (c(n), e.push(n)), n = [], s = { x: a.x, y: a.y }, i = { x: a.x, y: a.y }, r = !0;
    },
    lineTo: (a, h) => {
      n.push({ type: "line", p0: { ...i }, p1: { x: h.x, y: h.y } }), i = { x: h.x, y: h.y };
    },
    quadraticCurveTo: (a, h, l) => {
      n.push({
        type: "quad",
        p0: { ...i },
        cp: { x: h.x, y: h.y },
        p1: { x: l.x, y: l.y }
      }), i = { x: l.x, y: l.y };
    },
    cubicCurveTo: (a, h, l, u) => {
      n.push({
        type: "cubic",
        p0: { ...i },
        cp1: { x: h.x, y: h.y },
        cp2: { x: l.x, y: l.y },
        p1: { x: u.x, y: u.y }
      }), i = { x: u.x, y: u.y };
    },
    close: (a, h) => {
      if (n.length > 0) {
        const l = hn(n[n.length - 1]);
        Hn(l, s) || n.push({ type: "line", p0: l, p1: s });
      }
      i = s;
    }
  }), r && n.length > 0 && (c(n), e.push(n)), e;
}
function Ri(o) {
  const e = new Qe();
  for (const n of o) {
    if (n.length < 1) continue;
    const s = Ts(n[0]);
    e.moveTo(s.x, s.y);
    let i = s;
    for (const r of n) {
      const c = Ts(r);
      Hn(i, c, 1e-8) || e.lineTo(c.x, c.y);
      const a = hn(r);
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
function Tc(o, e = 0.5) {
  const n = [];
  for (const s of o) {
    if (!(s.type === "quad" || s.type === "cubic")) {
      n.push(Ts(s));
      continue;
    }
    const r = Math.max(2, Math.ceil(
      Math.hypot(
        s.type === "quad" ? Math.hypot(s.cp.x - s.p0.x, s.cp.y - s.p0.y) + Math.hypot(s.p1.x - s.cp.x, s.p1.y - s.cp.y) : Math.hypot(s.cp1.x - s.p0.x, s.cp1.y - s.p0.y) + Math.hypot(s.cp2.x - s.cp1.x, s.cp2.y - s.cp1.y) + Math.hypot(s.p1.x - s.cp2.x, s.p1.y - s.cp2.y)
      ) / e
    ));
    for (let c = 0; c <= r; c++) n.push(vi(s, c / r));
  }
  return n;
}
function Pc(o, e) {
  let n = 0;
  const s = e.length;
  for (let i = 0; i < s; i++) {
    const r = e[i], c = e[(i + 1) % s];
    r.y <= o.y ? c.y > o.y && ps(Je(c, r), Je(o, r)) > 0 && n++ : c.y <= o.y && ps(Je(c, r), Je(o, r)) < 0 && n--;
  }
  return n;
}
function bi(o, e) {
  let n = 0;
  for (const s of e)
    n += Pc(o, Tc(s));
  return n !== 0;
}
function Ec(o) {
  let e = 0;
  for (const n of o) {
    const s = Ts(n), i = hn(n);
    e += s.x * i.y - i.x * s.y;
  }
  return e / 2;
}
function bh(o) {
  return Ec(o) <= 0 ? o : Lc(o);
}
function _h(o) {
  return Ec(o) >= 0 ? o : Lc(o);
}
function zi(o, e) {
  return o.map((n, s) => {
    const i = _s(n[0]);
    let r = 0;
    for (let h = 0; h < o.length; h++)
      h !== s && Math.abs(Pc(i, Tc(o[h]))) % 2 === 1 && r++;
    return (r % 2 === 1 ? !e : e) ? bh(n) : _h(n);
  });
}
function Lc(o) {
  const e = [];
  for (let n = o.length - 1; n >= 0; n--)
    e.push(Th(o[n]));
  return e;
}
function Th(o) {
  switch (o.type) {
    case "line":
      return { type: "line", p0: o.p1, p1: o.p0 };
    case "quad":
      return { type: "quad", p0: o.p1, cp: o.cp, p1: o.p0 };
    case "cubic":
      return { type: "cubic", p0: o.p1, cp1: o.cp2, cp2: o.cp1, p1: o.p0 };
  }
}
function co(o, e) {
  if (e.length === 0) return [o];
  const n = [];
  let s = o, i = 0;
  for (const r of e) {
    if (r <= i + an || r >= 1 - an) continue;
    const c = (r - i) / (1 - i), [a, h] = ar(s, c);
    n.push(a), s = h, i = r;
  }
  return n.push(s), n;
}
function ao(o, e) {
  const n = [];
  for (const s of o) {
    const i = {
      pt: Ts(s),
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
function Ph(o, e, n) {
  const s = [];
  for (const i of o) {
    const r = bi(_s(i[0]), e);
    (n === "union" && !r || n === "intersect" && r || n === "difference" && !r) && s.push(i);
  }
  for (const i of e) {
    const r = bi(_s(i[0]), o);
    (n === "union" && !r || n === "intersect" && r || n === "difference" && r) && s.push(i);
  }
  return s;
}
function hr(o, e, n) {
  if (n === "xor")
    return [
      ...hr(
        o,
        e,
        "difference"
        /* Difference */
      ),
      ...hr(
        e,
        o,
        "difference"
        /* Difference */
      )
    ];
  const s = zi(o, !0), i = n === "difference" ? zi(e, !1) : zi(e, !0), r = [];
  for (let z = 0; z < s.length; z++) {
    const k = s[z];
    for (let Y = 0; Y < i.length; Y++) {
      const H = i[Y];
      for (let $ = 0; $ < k.length; $++)
        for (let W = 0; W < H.length; W++) {
          if (!_c(Mi(k[$]), Mi(H[W]), 1)) continue;
          const J = [];
          us(
            { edge: k[$], t0: 0, t1: 1 },
            { edge: H[W], t0: 0, t1: 1 },
            0,
            J
          );
          for (const ot of J) {
            const K = vi(k[$], ot.tA), j = vi(H[W], ot.tB);
            r.push({
              point: { x: (K.x + j.x) / 2, y: (K.y + j.y) / 2 },
              ptA: K,
              ptB: j,
              tA: ot.tA,
              tB: ot.tB,
              contourIdxA: z,
              contourIdxB: Y,
              edgeIdxA: $,
              edgeIdxB: W
            });
          }
        }
    }
  }
  const c = [];
  for (const z of r)
    c.find((k) => Hn(k.point, z.point, 0.01)) || c.push(z);
  if (c.length === 0)
    return Ph(s, i, n);
  const a = [];
  for (let z = 0; z < s.length; z++) {
    const k = s[z], Y = [];
    for (let H = 0; H < k.length; H++) {
      const $ = c.filter((W) => W.contourIdxA === z && W.edgeIdxA === H).map((W) => W.tA).sort((W, J) => W - J);
      Y.push(...co(k[H], $));
    }
    a.push(Y);
  }
  const h = [];
  for (let z = 0; z < i.length; z++) {
    const k = i[z], Y = [];
    for (let H = 0; H < k.length; H++) {
      const $ = c.filter((W) => W.contourIdxB === z && W.edgeIdxB === H).map((W) => W.tB).sort((W, J) => W - J);
      Y.push(...co(k[H], $));
    }
    h.push(Y);
  }
  const l = a.map((z) => ao(z, !0)), u = h.map((z) => ao(z, !1)), f = l.flat(), d = u.flat(), x = new Array(s.length).fill(!1), y = new Array(i.length).fill(!1);
  for (const z of c)
    for (let k = 0; k < l.length; k++) {
      const Y = l[k].find((H) => !H.isIntersection && Hn(H.pt, z.ptA, 0.01));
      if (Y)
        for (let H = 0; H < u.length; H++) {
          const $ = u[H].find((W) => !W.isIntersection && Hn(W.pt, z.ptB, 0.01));
          $ && (Y.isIntersection = !0, $.isIntersection = !0, Y.neighbor = $, $.neighbor = Y, x[k] = !0, y[H] = !0);
        }
    }
  const g = (z, k) => {
    for (const Y of z)
      Y.edgeToNext && (Y.insideOther = bi(_s(Y.edgeToNext), k));
  };
  g(f, i), g(d, s);
  const w = [], M = [...f, ...d], E = (z, k) => {
    const Y = z.insideOther;
    switch (k) {
      case "union":
        return !Y;
      case "intersect":
        return Y;
      case "difference":
        return z.fromSubject ? !Y : Y;
    }
    return !0;
  }, I = (z) => {
    const k = [];
    let Y = z, H = 0;
    const $ = M.length * 3;
    for (; H < $ && (H++, !(Y.visited && Y === z && k.length > 0)); ) {
      Y.visited = !0;
      const W = Y.next;
      Y.isIntersection && Y.neighbor ? E(Y, n) ? (Y.edgeToNext && k.push(Y.edgeToNext), Y = W) : Y = Y.neighbor : (Y.edgeToNext && k.push(Y.edgeToNext), Y = W);
    }
    return k.length < 2 ? null : k;
  }, N = M.filter((z) => z.isIntersection);
  for (let z of N) {
    if (z.visited || (!E(z, n) && z.neighbor && !z.neighbor.visited && (z = z.neighbor), z.visited)) continue;
    const k = I(z);
    k && w.push(k);
  }
  const O = (z, k) => {
    const Y = _s(z[0]), $ = bi(Y, k ? i : s);
    let W = !1;
    switch (n) {
      case "union":
        W = !$;
        break;
      case "intersect":
        W = $;
        break;
      case "difference":
        W = k ? !$ : $;
        break;
    }
    W && w.push(z);
  };
  for (let z = 0; z < s.length; z++)
    x[z] || O(s[z], !0);
  for (let z = 0; z < i.length; z++)
    y[z] || O(i[z], !1);
  return w.length === 0 && n !== "intersect" ? s : w;
}
function Kf(o, e, n) {
  const s = oo(o), i = oo(e);
  if (s.length === 0 || i.length === 0)
    return n === "union" || n === "xor" ? Ri([...s, ...i]) : n === "difference" ? Ri(s) : new Qe();
  const r = hr(s, i, n);
  return Ri(r);
}
var Eh = /* @__PURE__ */ ((o) => (o.BeginPath = "beginPath", o.MoveTo = "moveTo", o.LineTo = "lineTo", o.QuadraticCurveTo = "quadraticCurveTo", o.BezierCurveTo = "bezierCurveTo", o.Arc = "arc", o.ArcTo = "arcTo", o.Ellipse = "ellipse", o.Rect = "rect", o.RoundRect = "roundRect", o.ClosePath = "closePath", o))(Eh || {});
class Ft {
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
    return new Ft(
      "beginPath"
      /* BeginPath */
    );
  }
  /** 移动到 (x, y) */
  static moveTo(e, n) {
    return new Ft("moveTo", [e, n]);
  }
  /** 直线到 (x, y) */
  static lineTo(e, n) {
    return new Ft("lineTo", [e, n]);
  }
  /** 二次贝塞尔曲线 */
  static quadraticCurveTo(e, n, s, i) {
    return new Ft("quadraticCurveTo", [e, n, s, i]);
  }
  /** 三次贝塞尔曲线 */
  static bezierCurveTo(e, n, s, i, r, c) {
    return new Ft("bezierCurveTo", [e, n, s, i, r, c]);
  }
  /** 圆弧 */
  static arc(e, n, s, i, r, c) {
    return new Ft(
      "arc",
      [e, n, s, i, r],
      { counterclockwise: c }
    );
  }
  /** 切线圆弧 */
  static arcTo(e, n, s, i, r) {
    return new Ft("arcTo", [e, n, s, i, r]);
  }
  /** 椭圆弧 */
  static ellipse(e, n, s, i, r, c, a, h) {
    return new Ft(
      "ellipse",
      [e, n, s, i, r, c, a],
      { counterclockwise: h }
    );
  }
  /** 矩形 */
  static rect(e, n, s, i) {
    return new Ft("rect", [e, n, s, i]);
  }
  /** 圆角矩形 */
  static roundRect(e, n, s, i, r) {
    return new Ft("roundRect", [e, n, s, i], { radii: r });
  }
  /** 关闭路径 */
  static closePath() {
    return new Ft(
      "closePath"
      /* ClosePath */
    );
  }
  /** 克隆当前命令 */
  clone() {
    const e = new Ft(this.type, this.args.slice());
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
class Ac {
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
    this.commands.push(Ft.beginPath());
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/moveTo) */
  moveTo(e, n) {
    this.commands.push(Ft.moveTo(e, n));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineTo) */
  lineTo(e, n) {
    this.commands.push(Ft.lineTo(e, n));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo) */
  quadraticCurveTo(e, n, s, i) {
    this.commands.push(Ft.quadraticCurveTo(e, n, s, i));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo) */
  bezierCurveTo(e, n, s, i, r, c) {
    this.commands.push(Ft.bezierCurveTo(e, n, s, i, r, c));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arc) */
  arc(e, n, s, i, r, c) {
    this.commands.push(Ft.arc(e, n, s, i, r, c));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arcTo) */
  arcTo(e, n, s, i, r) {
    this.commands.push(Ft.arcTo(e, n, s, i, r));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/ellipse) */
  ellipse(e, n, s, i, r, c, a, h) {
    this.commands.push(
      Ft.ellipse(e, n, s, i, r, c, a, h)
    );
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rect) */
  rect(e, n, s, i) {
    this.commands.push(Ft.rect(e, n, s, i));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/roundRect) */
  roundRect(e, n, s, i, r) {
    this.commands.push(Ft.roundRect(e, n, s, i, r));
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/closePath) */
  closePath() {
    this.commands.push(Ft.closePath());
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
    const e = new Ac();
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
var Lh = /* @__PURE__ */ ((o) => (o.Miter = "miter", o.Round = "round", o.Bevel = "bevel", o))(Lh || {}), Ah = /* @__PURE__ */ ((o) => (o.Butt = "butt", o.Round = "round", o.Square = "square", o))(Ah || {});
function Sh(o, e, n, s, i, r) {
  return r.setLengthTo((e.x - o.x) * n, (e.y - o.y) * n, 1) ? (r.perpendicular().negate(), i.copy(r).multiplyScalar(s), !0) : !1;
}
function Cr(o, e, n) {
  n.lineTo(o.x, o.y), n.lineTo(o.x - e.x, o.y - e.y);
}
function Fr(o, e, n) {
  const s = o.lastPoint;
  s && (s.x = e, s.y = n);
}
const Ih = (o, e, n, s, i, r, c, a) => {
  const h = o.cross(n);
  if (h === 0)
    return;
  const l = o.dot(n), u = Math.sqrt((1 + l) / 2), f = s / u;
  let d = o, x = n;
  h < 0 && (a.swap(), d = o.clone().negate(), x = n.clone().negate());
  const y = rt.fromPoint(e).add(rt.fromPoint(d).multiplyScalar(s)), g = rt.fromPoint(e).add(rt.fromPoint(x).multiplyScalar(s)), w = rt.fromPoint(d).add(x).normalize().multiplyScalar(f).add(e);
  r ? Fr(a.outer, y.x, y.y) : a.outer.lineTo(y.x, y.y), a.outer.arcTo(w.x, w.y, g.x, g.y, s), Cr(e, rt.fromPoint(x).multiplyScalar(s), a.inner);
}, qh = (o, e, n, s, i, r, c, a) => {
  const h = o.cross(n);
  if (h === 0)
    return;
  const l = o.dot(n), u = Math.sqrt((1 + l) / 2);
  if (u < i) {
    Sc(o, e, n, s, i, r, c, a);
    return;
  }
  let f = o, d = n;
  h < 0 && (a.swap(), f = o.clone().negate(), d = n.clone().negate());
  const x = s / u, y = rt.fromPoint(f).add(d).normalize().multiplyScalar(x).add(e);
  if (r ? Fr(a.outer, y.x, y.y) : a.outer.lineTo(y.x, y.y), !c) {
    const g = rt.fromPoint(e).add(rt.fromPoint(d).multiplyScalar(s));
    a.outer.lineTo(g.x, g.y);
  }
  Cr(e, rt.fromPoint(d).multiplyScalar(s), a.inner);
}, Sc = (o, e, n, s, i, r, c, a) => {
  const h = o.cross(n);
  if (h === 0)
    return;
  const l = n.clone().multiplyScalar(s);
  h < 0 && (a.swap(), l.negate()), a.outer.lineTo(e.x + l.x, e.y + l.y), Cr(e, l, a.inner);
}, Ic = (o, e, n, s, i) => {
  i.lineTo(n.x, n.y);
}, Dh = (o, e, n, s, i) => {
  const r = e.clone().perpendicular(), c = o.clone().add(r).add(e), a = o.clone().add(r).subtract(e);
  s ? (Fr(i, c.x, c.y), i.lineTo(a.x, a.y)) : (i.lineTo(c.x, c.y), i.lineTo(a.x, a.y), i.lineTo(n.x, n.y));
}, Oh = (o, e, n, s, i) => {
  const r = e.clone().perpendicular(), c = o.clone().add(r), a = c.clone().add(e);
  i.conicTo(a.x, a.y, c.x, c.y, Math.SQRT1_2), a.copy(c).subtract(e), i.conicTo(a.x, a.y, n.x, n.y, Math.SQRT1_2);
}, kh = {
  round: Ih,
  miter: qh,
  bevel: Sc
}, Rh = {
  butt: Ic,
  round: Oh,
  square: Dh
};
class ho {
  constructor(e, n) {
    this.inner = e, this.outer = n;
  }
  swap() {
    return [this.inner, this.outer] = [this.outer, this.inner], this;
  }
}
class t1 {
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
  firstPoint = rt.default();
  firstUnitNormal = rt.default();
  firstNormal = rt.default();
  prevPoint = rt.default();
  prevUnitNormal = rt.default();
  prevNormal = rt.default();
  prevIsLine = !1;
  firstOuterPoint = rt.default();
  stroke(e, n) {
    return this.lineJoin = n.lineJoin ?? "miter", this.lineCap = n.lineCap ?? "butt", this.miterLimit = n.miterLimit ?? 10, this.invertMiterLimit = 1 / this.miterLimit, this.radius = (n.lineWidth ?? 1) / 2, this.resScale = n.scale ?? 1, this.invResScale = 1 / this.resScale, this.outer = Qe.default(), this.inner = Qe.default(), this.capper = Rh[this.lineCap], this.joiner = kh[this.lineJoin], this.outer.reset(), this.inner.reset(), this._stroke(e);
  }
  _stroke(e) {
    let n = !1;
    return e.visit({
      moveTo: (s) => {
        this.moveTo(rt.fromPoint(s));
      },
      lineTo: (s, i) => {
        this.lineTo(rt.fromPoint(i)), n = !0;
      },
      quadraticCurveTo: (s, i, r) => {
        this.quadTo(rt.fromPoint(i), rt.fromPoint(r)), n = !1;
      },
      cubicCurveTo: (s, i, r, c) => {
        this.cubicTo(rt.fromPoint(i), rt.fromPoint(r), rt.fromPoint(c)), n = !1;
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
    const s = new bs([this.prevPoint, e, n]).flatten();
    let i = !0;
    for (let r = 1; r < s.length; r++)
      this.lineToCore(rt.fromPoint(s[r]), !0, i) && (i = !1);
  }
  cubicTo(e, n, s) {
    const i = new Ms([this.prevPoint, e, n, s]).flatten();
    let r = !0;
    for (let c = 1; c < i.length; c++)
      this.lineToCore(rt.fromPoint(i[c]), !0, r) && (r = !1);
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
    const i = rt.default(), r = rt.default();
    if (!Sh(this.prevPoint, e, this.resScale, this.radius, i, r)) {
      if (this.capper === Ic)
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
      new ho(this.inner, this.outer)
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
          new ho(this.inner, this.outer)
        ), this.outer.closePath();
        let s = this.inner.lastPoint ?? rt.create(0, 0);
        this.outer.moveTo(s.x, s.y), this.outer.reversePathTo(this.inner), this.outer.closePath();
      } else {
        let s = n ? this.inner : null, i = this.inner.lastPoint ? rt.fromPoint(this.inner.lastPoint) : rt.default();
        this.capper(this.prevPoint, this.prevNormal, i, s, this.outer), this.outer.reversePathTo(this.inner), s = this.prevIsLine ? this.inner : null, this.capper(this.firstPoint, this.firstNormal.clone().negate(), this.firstOuterPoint, s, this.outer), this.outer.closePath();
      }
    this.inner.reset(), this.segmentCount = -1;
  }
  finish(e) {
    return this.finishContour(!1, e), this.outer;
  }
}
var zh = /* @__PURE__ */ ((o) => (o[o.ClosePath = 0] = "ClosePath", o[o.MoveTo = 1] = "MoveTo", o[o.LineTo = 2] = "LineTo", o[o.QuadraticCurveTo = 3] = "QuadraticCurveTo", o[o.BezierCurveTo = 4] = "BezierCurveTo", o[o.Arc = 5] = "Arc", o[o.ArcTo = 6] = "ArcTo", o[o.Ellipse = 7] = "Ellipse", o[o.Rect = 8] = "Rect", o[o.RoundRect = 9] = "RoundRect", o[o.BeginPath = 10] = "BeginPath", o))(zh || {});
const Nh = {
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
class qc {
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
  ellipse(e, n, s, i, r, c, a, h) {
    this._push(7, e, n, s, i, r, c, a, h ? 1 : 0), this.ctx?.ellipse(e, n, s, i, r, c, a, h);
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
    const e = new qc();
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
      const i = n[s], r = Nh[i] ?? 0, c = n.slice(s + 1, s + 1 + r);
      e(i, c, s), s += 1 + r;
    }
  }
  /** 转换为原生 Path2D */
  applyContext(e) {
    this.replayTo(e);
  }
}
const Ch = {
  minX: 1 / 0,
  minY: 1 / 0,
  maxX: -1 / 0,
  maxY: -1 / 0
};
function Ni(o, e) {
  return o.minX <= e.minX && o.minY <= e.minY && o.maxX >= e.maxX && o.maxY >= e.maxY;
}
function nn(o, e) {
  return o.minX <= e.maxX && o.maxX >= e.minX && o.minY <= e.maxY && o.maxY >= e.minY;
}
function gn(o, e) {
  return {
    minX: Math.min(o.minX, e.minX),
    minY: Math.min(o.minY, e.minY),
    maxX: Math.max(o.maxX, e.maxX),
    maxY: Math.max(o.maxY, e.maxY)
  };
}
function Bn(o) {
  return (o.maxX - o.minX) * (o.maxY - o.minY);
}
function fs(o, e) {
  const n = Math.max(o.maxX, e.maxX) - Math.min(o.minX, e.minX), s = Math.max(o.maxY, e.maxY) - Math.min(o.minY, e.minY);
  return n * s - Bn(o);
}
function Ci(o, e, n) {
  let s = 0, i = 0;
  return o < n.minX ? s = n.minX - o : o > n.maxX && (s = o - n.maxX), e < n.minY ? i = n.minY - e : e > n.maxY && (i = e - n.maxY), s * s + i * i;
}
function _n(o) {
  let e = { ...Ch };
  for (const n of o) e = gn(e, n);
  return e;
}
function Pe(o) {
  return o.height === 0;
}
function Ke(o) {
  return {
    bbox: _n(o.map((e) => e.bbox)),
    children: null,
    items: o,
    height: 0
  };
}
function lr(o, e) {
  return {
    bbox: _n(o.map((n) => n.bbox)),
    children: o,
    items: null,
    height: e
  };
}
function Mn(o) {
  Pe(o) && o.items ? o.bbox = _n(o.items.map((e) => e.bbox)) : o.children && (o.bbox = _n(o.children.map((e) => e.bbox)));
}
function Dc(o, e) {
  let n = -1 / 0, s = 0, i = 0;
  for (let u = 0; u < o.length; u++)
    for (let f = u + 1; f < o.length; f++) {
      const d = gn(o[u].bbox, o[f].bbox), x = Bn(d) - Bn(o[u].bbox) - Bn(o[f].bbox);
      x > n && (n = x, s = u, i = f);
    }
  const r = [o[s]], c = [o[i]];
  let a = o[s].bbox, h = o[i].bbox;
  const l = o.filter((u, f) => f !== s && f !== i);
  for (; l.length > 0; ) {
    if (r.length + l.length === e) {
      for (const g of l)
        r.push(g), a = gn(a, g.bbox);
      break;
    }
    if (c.length + l.length === e) {
      for (const g of l)
        c.push(g), h = gn(h, g.bbox);
      break;
    }
    let u = -1 / 0, f = 0;
    for (let g = 0; g < l.length; g++) {
      const w = fs(a, l[g].bbox), M = fs(h, l[g].bbox), E = Math.abs(w - M);
      E > u && (u = E, f = g);
    }
    const d = l.splice(f, 1)[0], x = fs(a, d.bbox), y = fs(h, d.bbox);
    x < y || x === y && r.length <= c.length ? (r.push(d), a = gn(a, d.bbox)) : (c.push(d), h = gn(h, d.bbox));
  }
  return [r, c];
}
function Fh(o, e) {
  let n = 0, s = 1 / 0, i = 1 / 0;
  for (let r = 0; r < o.children.length; r++) {
    const c = o.children[r], a = fs(c.bbox, e), h = Bn(c.bbox);
    (a < s || a === s && h < i) && (s = a, i = h, n = r);
  }
  return n;
}
function Hh(o, e, n, s) {
  for (; o.length > 1; ) {
    o.pop();
    const c = o[o.length - 1];
    if (c.children.push(e), Mn(c), c.children.length <= n) {
      for (let u = o.length - 2; u >= 0; u--)
        Mn(o[u]);
      return null;
    }
    const a = c.children.map((u) => ({ bbox: u.bbox, node: u })), [h, l] = Dc(a, s);
    c.children = h.map((u) => u.node), e = lr(l.map((u) => u.node), c.height), e.bbox = _n(e.children.map((u) => u.bbox));
  }
  const i = o[0], r = lr([i, e], i.height + 1);
  return r.bbox = _n([i.bbox, e.bbox]), r;
}
function Hr(o, e, n, s, i, r) {
  if (r.push(o), Pe(o)) {
    const h = { bbox: e, data: n };
    if (o.items.push(h), o.bbox = gn(o.bbox, e), o.items.length <= s) return null;
    const l = o.items.map((x) => ({ bbox: x.bbox, item: x })), [u, f] = Dc(l, i);
    o.items = u.map((x) => x.item);
    const d = Ke(f.map((x) => x.item));
    return o.bbox = _n(o.items.map((x) => x.bbox)), Hh(r, d, s, i);
  }
  const c = Fh(o, e), a = Hr(o.children[c], e, n, s, i, r);
  return a || (Mn(o), null);
}
function Oc(o, e, n, s) {
  if (Pe(o)) {
    const i = o.items.findIndex(e);
    return i === -1 ? !1 : (o.items.splice(i, 1), Mn(o), !0);
  }
  for (let i = 0; i < o.children.length; i++) {
    const r = o.children[i];
    if (n.push(o), s.push(i), Oc(r, e, n, s))
      return !0;
    n.pop(), s.pop();
  }
  return !1;
}
function Bh(o, e, n, s, i) {
  const r = [];
  for (let c = e.length - 1; c >= 0; c--) {
    const a = e[c];
    if (n[c], Pe(a))
      if (a.items.length < s) {
        if (r.push(...a.items), c === 0)
          return Ke([]);
        e[c - 1].children.splice(n[c - 1], 1);
      } else
        Mn(a);
    else if (a.children.length < s) {
      if (r.push(...a.children), c === 0)
        return a.children.length === 0 ? Ke([]) : a.children.length === 1 ? a.children[0] : (Mn(a), a);
      e[c - 1].children.splice(n[c - 1], 1);
    } else
      Mn(a);
  }
  for (const c of r)
    if ("height" in c && c.children) {
      const a = [];
      kc(c, a);
      for (const h of a)
        o = lo(o, h.bbox, h.data, i, s);
    } else {
      const a = c;
      o = lo(o, a.bbox, a.data, i, s);
    }
  for (; o.children && o.children.length === 1 && !Pe(o); )
    o = o.children[0];
  return o;
}
function kc(o, e) {
  if (Pe(o))
    o.items && e.push(...o.items);
  else if (o.children)
    for (const n of o.children) kc(n, e);
}
function lo(o, e, n, s, i) {
  return Hr(o, e, n, s, i, []) ?? o;
}
function Yh(o, e) {
  if (o.length === 0) return Ke([]);
  const n = o.length, s = Math.ceil(n / e);
  if (s === 1) return Ke(o);
  const i = Math.ceil(Math.sqrt(s));
  o.sort((a, h) => {
    const l = (a.bbox.minX + a.bbox.maxX) / 2, u = (h.bbox.minX + h.bbox.maxX) / 2;
    return l - u;
  });
  const r = [];
  for (let a = 0; a < n; a += i * e)
    r.push(o.slice(a, a + i * e));
  const c = [];
  for (const a of r) {
    a.sort((h, l) => {
      const u = (h.bbox.minY + h.bbox.maxY) / 2, f = (l.bbox.minY + l.bbox.maxY) / 2;
      return u - f;
    });
    for (let h = 0; h < a.length; h += e) {
      const l = a.slice(h, h + e);
      c.push(Ke(l));
    }
  }
  return Rc(c, e);
}
function Rc(o, e) {
  if (o.length === 0) return Ke([]);
  if (o.length === 1) return o[0];
  const n = [];
  for (let s = 0; s < o.length; s += e) {
    const i = o.slice(s, s + e);
    n.push(lr(i, i[0].height + 1));
  }
  return Rc(n, e);
}
class Vh {
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
class e1 {
  root;
  _maxEntries;
  _minEntries;
  _size = 0;
  constructor(e = {}) {
    this._maxEntries = Math.max(4, e.maxEntries ?? 9), this._minEntries = Math.max(2, Math.floor(this._maxEntries * 0.4)), this.root = Ke([]);
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
    this.root = Ke([]), this._size = 0;
  }
  // ── 插入 ──
  /**
   * 插入单个元素。
   * 复杂度 O(log n)。
   */
  insert(e) {
    const n = [], s = Hr(
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
    n.push(...e), this.root = Yh(n, this._maxEntries), this._size = n.length;
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
    return Oc(this.root, (r) => r === e, n, s) ? (this._size--, this.root = Bh(this.root, n, s, this._minEntries, this._maxEntries), !0) : !1;
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
    if (!nn(this.root.bbox, e)) return n;
    const s = [this.root];
    for (; s.length > 0; ) {
      const i = s.pop();
      if (nn(i.bbox, e))
        if (Pe(i))
          for (const r of i.items)
            nn(r.bbox, e) && n.push({ item: r });
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
    if (!nn(this.root.bbox, e)) return !1;
    const n = [this.root];
    for (; n.length > 0; ) {
      const s = n.pop();
      if (nn(s.bbox, e))
        if (Pe(s)) {
          for (const i of s.items)
            if (nn(i.bbox, e)) return !0;
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
    const r = [], c = i * i, a = new Vh((h, l) => h.dist - l.dist);
    for (a.push({ node: this.root, dist: Ci(e, n, this.root.bbox) }); a.size > 0; ) {
      const h = a.pop();
      if (r.length >= s && h.dist > r[r.length - 1].distSq) break;
      if (Pe(h.node))
        for (const l of h.node.items) {
          const u = Ci(e, n, l.bbox);
          if (u > c) continue;
          let f = 0;
          for (; f < r.length && r[f].distSq < u; ) f++;
          f !== s && (r.splice(f, 0, { item: l, distSq: u }), r.length > s && r.pop());
        }
      else
        for (const l of h.node.children) {
          const u = Ci(e, n, l.bbox);
          u > c || a.push({ node: l, dist: u });
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
    if (!nn(this.root.bbox, e)) return n;
    const s = [this.root];
    for (; s.length > 0; ) {
      const i = s.pop();
      if (nn(i.bbox, e))
        if (Pe(i))
          for (const r of i.items)
            Ni(r.bbox, e) && n.push({ item: r });
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
      if (Pe(s))
        for (const i of s.items) e(i);
      else
        for (const i of s.children) n.push(i);
    }
  }
  // ── 内部 ──
  _collect(e, n) {
    if (Pe(e))
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
      if (e += Bn(s.bbox), s.children)
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
    if (Pe(e)) {
      if (!e.items) return "叶子节点 items 为 null";
      if (e.items.length > this._maxEntries) return "叶子节点元素数超 maxEntries";
      if (e.height !== 0) return "叶子节点 height 不为 0";
      for (const n of e.items)
        if (!Ni(e.bbox, n.bbox)) return "元素的 bbox 不在节点 bbox 内";
    } else {
      if (!e.children) return "内部节点 children 为 null";
      if (e.children.length < this._minEntries && e !== this.root)
        return "内部节点子节点数 < minEntries";
      if (e.children.length > this._maxEntries) return "内部节点子节点数 > maxEntries";
      for (const n of e.children) {
        if (n.height >= e.height) return "子节点 height 不递减";
        if (!Ni(e.bbox, n.bbox)) return "子节点 bbox 不在父节点 bbox 内";
        const s = this._validateNode(n);
        if (s) return s;
      }
    }
    return null;
  }
}
class n1 {
  // ---- 内部存储 ----
  position;
  scale;
  _rotation = 0;
  skew;
  origin;
  /** 父级变换（设置后 worldMatrix 自动跟随父级） */
  _parent = null;
  // ---- 矩阵缓存 ----
  _matrix = Rt.identity();
  _worldMatrix = Rt.identity();
  _worldMatrixInvert = Rt.identity();
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
  constructor() {
    this.invalidate = this.invalidate.bind(this), this.position = new rt(0, 0).onChange(this.invalidate), this.scale = new rt(1, 1).onChange(this.invalidate), this.skew = new rt(0, 0).onChange(this.invalidate), this.origin = new rt(0, 0).onChange(this.invalidate);
  }
  // ==================== 访问器 ====================
  get rotation() {
    return this._rotation;
  }
  set rotation(e) {
    this._rotation !== e && (this._rotation = e, this.invalidate());
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
    return this._lastInvertLocalVersion !== this._lastWorldLocalVersion && (Rt.invert(this._worldMatrixInvert, e), this._lastInvertLocalVersion = this._lastWorldLocalVersion), this._worldMatrixInvert;
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
    Rt.fromTranslateRotationSkewScaleOrigin(
      this._matrix,
      this.position,
      this._rotation,
      this.skew,
      this.scale,
      this.origin
    ), this._lastLocalVersion = this._localVersion;
  }
  /**
   * 计算世界变换矩阵。
   *
   * 无 parent: M_world = M_local
   * 有 parent: M_world = M_parent · M_local
   */
  _updateWorldMatrix() {
    this._isLocalDirty() && this._updateLocalMatrix(), this._parent ? (Rt.multiply(this._worldMatrix, this._parent.worldMatrix, this._matrix), this._lastParentWorldVersion = this._parent.worldVersion) : this._worldMatrix.copy(this._matrix), this._lastWorldLocalVersion = this._localVersion;
  }
  // ==================== 公开方法 ====================
  /**
   * 强制标记为脏，下次访问 matrix/worldMatrix 时会重算。
   * 适用于批量设置多个属性后仅触发一次重算的场景。
   */
  invalidate() {
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
    const [s, i, r, c, a, h] = this.worldMatrixInvert;
    return n.x = s * e.x + r * e.y + a, n.y = i * e.x + c * e.y + h, n;
  }
  /**
   * 将本地坐标转换为世界坐标。
   * result = M_world · point
   */
  localToWorld(e, n) {
    const [s, i, r, c, a, h] = this.worldMatrix;
    return n.x = s * e.x + r * e.y + a, n.y = i * e.x + c * e.y + h, n;
  }
  /**
   * 从矩阵反解变换属性写入自身。
   *
   * 分解顺序与 compose 一致，假定原点 (0, 0)。
   * 分解结果经 round-trip（分解后再 compose）与原矩阵等价。
   *
   * 步骤:
   *   1. 提取 scaleX 与 rotation（列向量模与方向）
   *   2. 移除旋转得 Sk·S 矩阵
   *   3. 提取 scaleY 与 skew
   *   4. 平移直接取 tx/ty
   */
  decomposeMatrix2D(e) {
    const n = e[0], s = e[1], i = e[2], r = e[3], c = e[4], a = e[5], h = Math.hypot(n, s), l = h > 1e-9 ? Math.atan2(s, n) : 0, u = Math.cos(l), f = Math.sin(l), d = s * u - r * f, x = n * f + i * u, g = s * f + r * u, w = g !== 0 ? x / g : 0, M = h !== 0 ? d / h : 0;
    this.position.set(c, a), this.scale.set(h, g), this._rotation = l, this.skew.set(Math.atan(w), Math.atan(M)), this.origin.set(0, 0);
  }
  // ---- 便捷设置（批量操作仅触发一次版本变更） ----
  /** 批量设置变换属性 */
  setTransform(e, n, s, i, r) {
    return e && this.position.copy(e), n && this.scale.copy(n), s !== void 0 && (this._rotation = s), i && this.skew.copy(i), r && this.origin.copy(r), this;
  }
  /** 从另一个 Transform 拷贝变换属性 */
  copyFrom(e) {
    return this.position.copy(e.position), this.scale.copy(e.scale), this._rotation = e._rotation, this.skew.copy(e.skew), this.origin.copy(e.origin), this;
  }
  // ---- 受保护的内部方法（供子类或同包使用） ----
  /** 清除世界矩阵缓存版本，强制下次 get 时重算（即使 local 未变） */
  _forceWorldUpdate() {
    this._lastWorldLocalVersion = -1, this._lastInvertLocalVersion = -1;
  }
}
class s1 {
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
    this._worldToScreenMatrix = Rt.identity(), this._screenToWorldMatrix = Rt.identity(), this._cachedVisibleBounds = St.fromLTRB(0, 0, e, n), this.position = new rt(0, 0), this.position.onChange(() => {
      this.markMatrixUpdate();
    }), this.size = new rt(e, n), this.size.onChange(() => {
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
    return St.fromLTRB(n.x, n.y, s.x, s.y);
  }
  /**
   * 屏幕矩形 → 世界矩形
   */
  screenRectToWorld(e) {
    const n = this.screenToWorld({ x: e.x, y: e.y }), s = this.screenToWorld({
      x: e.x + e.width,
      y: e.y + e.height
    });
    return St.fromLTRB(n.x, n.y, s.x, s.y);
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
class Uh {
  value;
  key;
  next;
  prev;
  constructor(e) {
    this.value = e;
  }
}
class i1 {
  head;
  tail;
  _len = 0;
  /**
   * Insert a new value at the tail
   */
  insert(e) {
    const n = new Uh(e);
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
const dt = 1e-6, Xh = "zyx";
class Et extends Float32Array {
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
    return Et.str(this);
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
    return Et.distance(this, e);
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
    return Et.squaredDistance(this, e);
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
    return Et.normalize(this, this);
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
    return new Et();
  }
  /**
   * Creates a new {@link Vec2} initialized with values from an existing vector
   * @category Static
   *
   * @param a - Vector to clone
   * @returns A new 2D vector
   */
  static clone(e) {
    return new Et(e);
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
    return new Et(e, n);
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
    const r = n[0] - s[0], c = n[1] - s[1], a = Math.sin(i), h = Math.cos(i);
    return e[0] = r * h - c * a + s[0], e[1] = r * a + c * h + s[1], e;
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
    const s = e[0], i = e[1], r = n[0], c = n[1], a = Math.sqrt(s * s + i * i) * Math.sqrt(r * r + c * c), h = a && (s * r + i * c) / a;
    return Math.acos(Math.min(Math.max(h, -1), 1));
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
Et.prototype.sub = Et.prototype.subtract;
Et.prototype.mul = Et.prototype.multiply;
Et.prototype.div = Et.prototype.divide;
Et.prototype.dist = Et.prototype.distance;
Et.prototype.sqrDist = Et.prototype.squaredDistance;
Et.sub = Et.subtract;
Et.mul = Et.multiply;
Et.div = Et.divide;
Et.dist = Et.distance;
Et.sqrDist = Et.squaredDistance;
Et.sqrLen = Et.squaredLength;
Et.mag = Et.magnitude;
Et.length = Et.magnitude;
Et.len = Et.magnitude;
const Wh = Et, Yn = Et.squaredDistance, Gs = Math.pow, fn = Math.sqrt, _i = 1e-8, zc = 1e-4, uo = fn(3), Zs = 1 / 3, Ye = Et.create(), Ae = Et.create(), Vn = Et.create();
function ln(o) {
  return o > -_i && o < _i;
}
function Nc(o) {
  return o > _i || o < -_i;
}
function Fe(o, e, n, s, i) {
  const r = 1 - i;
  return r * r * (r * o + 3 * i * e) + i * i * (i * s + 3 * r * n);
}
function r1(o, e, n, s, i) {
  const r = 1 - i;
  return 3 * (((e - o) * r + 2 * (n - e) * i) * r + (s - n) * i * i);
}
function o1(o, e, n, s, i, r) {
  const c = s + 3 * (e - n) - o, a = 3 * (n - e * 2 + o), h = 3 * (e - o), l = o - i, u = a * a - 3 * c * h, f = a * h - 9 * c * l, d = h * h - 3 * a * l;
  let x = 0;
  if (ln(u) && ln(f))
    if (ln(a))
      r[0] = 0;
    else {
      const y = -h / a;
      y >= 0 && y <= 1 && (r[x++] = y);
    }
  else {
    const y = f * f - 4 * u * d;
    if (ln(y)) {
      const g = f / u, w = -a / c + g, M = -g / 2;
      w >= 0 && w <= 1 && (r[x++] = w), M >= 0 && M <= 1 && (r[x++] = M);
    } else if (y > 0) {
      const g = fn(y);
      let w = u * a + 1.5 * c * (-f + g), M = u * a + 1.5 * c * (-f - g);
      w < 0 ? w = -Gs(-w, Zs) : w = Gs(w, Zs), M < 0 ? M = -Gs(-M, Zs) : M = Gs(M, Zs);
      const E = (-a - (w + M)) / (3 * c);
      E >= 0 && E <= 1 && (r[x++] = E);
    } else {
      const g = (2 * u * a - 3 * c * f) / (2 * fn(u * u * u)), w = Math.acos(g) / 3, M = fn(u), E = Math.cos(w), I = (-a - 2 * M * E) / (3 * c), N = (-a + M * (E + uo * Math.sin(w))) / (3 * c), O = (-a + M * (E - uo * Math.sin(w))) / (3 * c);
      I >= 0 && I <= 1 && (r[x++] = I), N >= 0 && N <= 1 && (r[x++] = N), O >= 0 && O <= 1 && (r[x++] = O);
    }
  }
  return x;
}
function c1(o, e, n, s, i) {
  const r = 6 * n - 12 * e + 6 * o, c = 9 * e + 3 * s - 3 * o - 9 * n, a = 3 * e - 3 * o;
  let h = 0;
  if (ln(c)) {
    if (Nc(r)) {
      const l = -a / r;
      l >= 0 && l <= 1 && (i[h++] = l);
    }
  } else {
    const l = r * r - 4 * c * a;
    if (ln(l))
      i[0] = -r / (2 * c);
    else if (l > 0) {
      const u = fn(l), f = (-r + u) / (2 * c), d = (-r - u) / (2 * c);
      f >= 0 && f <= 1 && (i[h++] = f), d >= 0 && d <= 1 && (i[h++] = d);
    }
  }
  return h;
}
function a1(o, e, n, s, i, r) {
  const c = (e - o) * i + o, a = (n - e) * i + e, h = (s - n) * i + n, l = (a - c) * i + c, u = (h - a) * i + a, f = (u - l) * i + l;
  r[0] = o, r[1] = c, r[2] = l, r[3] = f, r[4] = f, r[5] = u, r[6] = h, r[7] = s;
}
function h1(o, e, n, s, i, r, c, a, h, l, u) {
  let f = 0, d = 5e-3, x = 1 / 0, y, g, w, M;
  Ye[0] = h, Ye[1] = l;
  for (let E = 0; E < 1; E += 0.05)
    Ae[0] = Fe(o, n, i, c, E), Ae[1] = Fe(e, s, r, a, E), w = Yn(Ye, Ae), w < x && (f = E, x = w);
  x = 1 / 0;
  for (let E = 0; E < 32 && !(d < zc); E++)
    y = f - d, g = f + d, Ae[0] = Fe(o, n, i, c, y), Ae[1] = Fe(e, s, r, a, y), w = Yn(Ae, Ye), y >= 0 && w < x ? (f = y, x = w) : (Vn[0] = Fe(o, n, i, c, g), Vn[1] = Fe(e, s, r, a, g), M = Yn(Vn, Ye), g <= 1 && M < x ? (f = g, x = M) : d *= 0.5);
  return u && (u[0] = Fe(o, n, i, c, f), u[1] = Fe(e, s, r, a, f)), fn(x);
}
function l1(o, e, n, s, i, r, c, a, h) {
  let l = o, u = e, f = 0;
  const d = 1 / h;
  for (let x = 1; x <= h; x++) {
    let y = x * d;
    const g = Fe(o, n, i, c, y), w = Fe(e, s, r, a, y), M = g - l, E = w - u;
    f += Math.sqrt(M * M + E * E), l = g, u = w;
  }
  return f;
}
function He(o, e, n, s) {
  const i = 1 - s;
  return i * (i * o + 2 * s * e) + s * s * n;
}
function u1(o, e, n, s) {
  return 2 * ((1 - s) * (e - o) + s * (n - e));
}
function f1(o, e, n, s, i) {
  const r = o - 2 * e + n, c = 2 * (e - o), a = o - s;
  let h = 0;
  if (ln(r)) {
    if (Nc(c)) {
      const l = -a / c;
      l >= 0 && l <= 1 && (i[h++] = l);
    }
  } else {
    const l = c * c - 4 * r * a;
    if (ln(l)) {
      const u = -c / (2 * r);
      u >= 0 && u <= 1 && (i[h++] = u);
    } else if (l > 0) {
      const u = fn(l), f = (-c + u) / (2 * r), d = (-c - u) / (2 * r);
      f >= 0 && f <= 1 && (i[h++] = f), d >= 0 && d <= 1 && (i[h++] = d);
    }
  }
  return h;
}
function d1(o, e, n) {
  const s = o + n - 2 * e;
  return s === 0 ? 0.5 : (o - e) / s;
}
function x1(o, e, n, s, i) {
  const r = (e - o) * s + o, c = (n - e) * s + e, a = (c - r) * s + r;
  i[0] = o, i[1] = r, i[2] = a, i[3] = a, i[4] = c, i[5] = n;
}
function y1(o, e, n, s, i, r, c, a, h) {
  let l = 0, u = 5e-3, f = 1 / 0;
  Ye[0] = c, Ye[1] = a;
  for (let d = 0; d < 1; d += 0.05) {
    Ae[0] = He(o, n, i, d), Ae[1] = He(e, s, r, d);
    const x = Yn(Ye, Ae);
    x < f && (l = d, f = x);
  }
  f = 1 / 0;
  for (let d = 0; d < 32 && !(u < zc); d++) {
    const x = l - u, y = l + u;
    Ae[0] = He(o, n, i, x), Ae[1] = He(e, s, r, x);
    const g = Yn(Ae, Ye);
    if (x >= 0 && g < f)
      l = x, f = g;
    else {
      Vn[0] = He(o, n, i, y), Vn[1] = He(e, s, r, y);
      const w = Yn(Vn, Ye);
      y <= 1 && w < f ? (l = y, f = w) : u *= 0.5;
    }
  }
  return h && (h[0] = He(o, n, i, l), h[1] = He(e, s, r, l)), fn(f);
}
function p1(o, e, n, s, i, r, c) {
  let a = o, h = e, l = 0;
  const u = 1 / c;
  for (let f = 1; f <= c; f++) {
    let d = f * u;
    const x = He(o, n, i, d), y = He(e, s, r, d), g = x - a, w = y - h;
    l += Math.sqrt(g * g + w * w), a = x, h = y;
  }
  return l;
}
const fo = 5;
function Js(o) {
  return o > 0 && Number.isFinite(o);
}
function $h(o, e) {
  const n = Math.sqrt(o.x * o.x + o.y * o.y), s = Math.sqrt(e.x * e.x + e.y * e.y);
  return n === 0 && s === 0 ? { x: 1, y: 0 } : n === 0 ? { x: e.x / s, y: e.y / s } : s === 0 ? { x: o.x / n, y: o.y / n } : { x: o.x / n + e.x / s, y: o.y / n + e.y / s };
}
function Fi(o, e) {
  return o.x * e.x + o.y * e.y;
}
function qn(o, e) {
  return { x: o.x - e.x, y: o.y - e.y };
}
function Qs(o, e) {
  return { x: o.x * e, y: o.y * e };
}
function jh(o, e, n) {
  const s = e * e - 4 * o * n;
  if (s < 0) return 0.5;
  const i = Math.sqrt(s), r = -0.5 * (e + (e >= 0 ? i : -i)), c = r / o, a = n / r, h = -0.5 * r * o, l = Math.abs(r * r + h) < Math.abs(o * n + h) ? c : a;
  return l > 0 && l < 1 ? l : 0.5;
}
function Gh(o, e) {
  return [
    { x: o[0].x, y: o[0].y, z: 1 },
    { x: o[1].x * e, y: o[1].y * e, z: e },
    { x: o[2].x, y: o[2].y, z: 1 }
  ];
}
function Hi(o) {
  return { x: o.x / o.z, y: o.y / o.z };
}
function Bi(o, e, n) {
  const s = o[0] + (o[3] - o[0]) * n, i = o[3] + (o[6] - o[3]) * n;
  e[0] = s, e[3] = s + (i - s) * n, e[6] = i;
}
function Zh(o) {
  return Math.sqrt(0.5 + o * 0.5);
}
class Ps {
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
    const n = e[0], s = e[1], i = e[2], r = n.x, c = n.y, a = 2 * (s.x - r), h = 2 * (s.y - c), l = i.x - 2 * s.x + r, u = i.y - 2 * s.y + c;
    return new Ps(l, u, a, h, r, c);
  }
  eval(e) {
    return {
      x: (this.ax * e + this.bx) * e + this.cx,
      y: (this.ay * e + this.by) * e + this.cy
    };
  }
}
class xo {
  numer;
  denom;
  constructor(e, n) {
    const s = e[0], i = e[1], r = e[2], c = i.x * n, a = i.y * n;
    this.numer = new Ps(
      r.x - 2 * c + s.x,
      r.y - 2 * a + s.y,
      2 * (c - s.x),
      2 * (a - s.y),
      s.x,
      s.y
    ), this.denom = new Ps(
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
class ds {
  /** 控制点 [P0, P1, P2] */
  points;
  /** 权重 w，P0 和 P2 恒为 1 */
  weight;
  /** 创建 conic */
  constructor(e, n) {
    this.points = e.map((s) => ({ x: s.x, y: s.y })), this.weight = Js(n) ? n : 1;
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
    this.weight = Js(e) ? e : 1;
  }
  // ---- 求值 ----
  /** 计算曲线上参数 t ∈ [0,1] 处的点 */
  evaluate(e) {
    return xo.prototype.eval.call(
      new xo(this.points, this.weight),
      e
    );
  }
  /** 计算曲线上 t 处的切向量（长度任意，仅方向有意义） */
  evaluateTangentAt(e) {
    const { p0: n, p1: s, p2: i } = this, r = this.weight;
    if (e === 0 && n.x === s.x && n.y === s.y || e === 1 && s.x === i.x && s.y === i.y)
      return { x: i.x - n.x, y: i.y - n.y };
    const c = i.x - n.x, a = i.y - n.y, h = s.x - n.x, l = s.y - n.y, u = r * h, f = r * l, d = r * c - c, x = r * a - a, y = c - 2 * u, g = a - 2 * f;
    return new Ps(d, x, y, g, u, f).eval(e);
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
    const n = this.points, s = this.weight, i = Gh(n, s), r = [i[0].x, 0, 0, i[1].x, 0, 0, i[2].x], c = [i[0].y, 0, 0, i[1].y, 0, 0, i[2].y], a = [i[0].z, 0, 0, i[1].z, 0, 0, i[2].z], h = new Array(7).fill(0), l = new Array(7).fill(0), u = new Array(7).fill(0);
    Bi(r, h, e), Bi(c, l, e), Bi(a, u, e);
    const f = Hi({ x: h[0], y: l[0], z: u[0] }), d = Hi({ x: h[3], y: l[3], z: u[3] }), x = Hi({ x: h[6], y: l[6], z: u[6] }), y = Math.sqrt(u[3]), g = u[0] / y, w = u[6] / y;
    if (!Number.isFinite(g) || !Number.isFinite(w) || !Number.isFinite(f.x) || !Number.isFinite(f.y) || !Number.isFinite(d.x) || !Number.isFinite(d.y) || !Number.isFinite(x.x) || !Number.isFinite(x.y)) return null;
    const M = new ds([n[0], f, d], g), E = new ds([d, x, n[2]], w);
    return [M, E];
  }
  /** 在 t=0.5 处分割 */
  chop() {
    const e = this.points, n = this.weight, s = 1 / (1 + n), i = e[0], r = e[1], c = e[2], a = n * s, h = i.x * s, l = i.y * s, u = r.x * a, f = r.y * a, d = c.x * s, x = c.y * s, y = { x: h + u, y: l + f }, g = { x: u + d, y: f + x }, w = { x: 0.5 * h + u + 0.5 * d, y: 0.5 * l + f + 0.5 * x }, M = Zh(n);
    return [
      new ds([i, y, w], M),
      new ds([w, g, c], M)
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
    if (e < 0 || !Number.isFinite(e) || !Js(this.weight)) return 0;
    const n = this.computeAsQuadError();
    let s = Math.sqrt(n.x * n.x + n.y * n.y), i = 0;
    for (; i < fo && !(s <= e); )
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
    e = Math.max(0, Math.min(e, fo));
    const n = this.weight;
    Js(n) || (e = 0);
    const i = 2 * (1 << e) + 1, r = new Array(i);
    if (r[0] = { x: this.p0.x, y: this.p0.y }, e > 0) {
      const a = this._subdivide(e);
      for (let h = 0; h < a.length; h++)
        r[h + 1] = a[h];
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
      const l = c[2].y;
      if (!this._between(i, l, r)) {
        const u = Math.abs(l - i) < Math.abs(l - r) ? i : r;
        n.points[2].y = s.points[0].y = u;
      }
      this._between(i, c[1].y, c[2].y) || (n.points[1].y = i), this._between(s.points[0].y, s.points[1].y, r) || (s.points[1].y = r);
    }
    const a = n._subdivide(e - 1), h = s._subdivide(e - 1);
    return [...a, ...h];
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
    const n = this.weight, s = this.points, i = e === "x" ? s[2].x - s[0].x : s[2].y - s[0].y, r = e === "x" ? s[1].x - s[0].x : s[1].y - s[0].y, c = n * r, a = n * i - i, h = i - 2 * c, u = jn(a, h, c);
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
    return n = this.findXExtrema(), n !== null && e.push(this.evaluate(n)), n = this.findYExtrema(), n !== null && e.push(this.evaluate(n)), St.default().fromPoints(e);
  }
  /** 计算快速包围盒（仅用控制点） */
  computeFastBounds() {
    return St.default().fromPoints(this.points);
  }
  /** 获取包围盒（紧凑版） */
  getBounds() {
    return this.computeTightBounds();
  }
  // ---- 中间切线 ----
  /** 找到中间切线的参数 t */
  findMidTangent() {
    const { p0: e, p1: n, p2: s } = this, i = this.weight, r = qn(n, e), c = qn(s, n), a = Qs(c, -1), h = $h(r, a), l = qn(s, e), u = Qs(l, i - 1), f = qn(l, Qs(qn(n, e), i * 2)), d = Qs(qn(n, e), i), x = Fi(h, u), y = Fi(h, f), g = Fi(h, d);
    return jh(x, y, g);
  }
}
function ur(o, e, n) {
  return o + (e - o) * n;
}
function mn(o, e, n) {
  return [ur(o[0], e[0], n), ur(o[1], e[1], n)];
}
function Cc(o, e) {
  const [n, s] = o, [i, r] = e;
  return !(n[0] > r[0] || s[0] < i[0] || n[1] > r[1] || s[1] < i[1]);
}
let Fc = class {
};
class Hc extends Fc {
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
    const h = i * (i * (4 * i * s - r * n) - 2 * n * s) + 4 * r * r * r + s * s;
    if (Math.abs(h) < this.epsilon) {
      const f = Math.sqrt(c);
      return a > 0 ? [-2 * f - e / 3, f - e / 3] : [-f - e / 3, 2 * f - e / 3];
    }
    const l = c * c * c, u = a * a;
    if (u < l) {
      const f = (a < 0 ? -1 : 1) * Math.sqrt(u / l), d = Math.acos(f), x = -2 * Math.sqrt(c), y = x * Math.cos(d / 3) - i, g = x * Math.cos((d + 2 * Math.PI) / 3) - i, w = x * Math.cos((d - 2 * Math.PI) / 3) - i;
      return [y, g, w].sort((M, E) => M - E);
    } else {
      const f = (a < 0 ? 1 : -1) * Math.pow(Math.abs(a) + Math.sqrt(u - l), 0.3333333333333333), d = Math.abs(f) >= this.epsilon ? c / f : 0;
      return [f + d - i];
    }
  }
  solveCubic(e, n, s, i) {
    if (Math.abs(e) < this.epsilon) {
      if (Math.abs(n) < this.epsilon)
        return Math.abs(s) < this.epsilon ? Math.abs(i) < this.epsilon ? [0] : [] : [-i / s];
      const r = 2 * n;
      let c = s * s - 4 * n * i;
      return Math.abs(c) < this.epsilon ? [-s / r] : c > 0 ? (c = Math.sqrt(c), [(-s + c) / r, (-s - c) / r].sort((a, h) => a - h)) : [];
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
class fr {
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
class Es {
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
class Br {
}
class jt extends Br {
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
class $t extends Br {
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
    const c = (1 - e) * (1 - e), a = e * e, h = c * (1 - e), l = 3 * c * e, u = 3 * a * (1 - e), f = a * e;
    return [
      n[0] * h + s[0] * l + i[0] * u + r[0] * f,
      n[1] * h + s[1] * l + i[1] * u + r[1] * f
    ];
  }
  split(e) {
    if (e.length <= 0)
      return [this];
    const n = [], s = (c, a) => {
      const [h, l, u, f] = c, d = mn(h, l, a), x = mn(l, u, a), y = mn(u, f, a), g = mn(d, x, a), w = mn(x, y, a), M = mn(g, w, a);
      return n.push(new $t(h, d, g, M, this.geo)), [M, w, y, f];
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
    const e = new fr(this.geo), n = (a, h, l, u) => {
      const f = 3 * u - 9 * l + 9 * h - 3 * a, d = 6 * a - 12 * h + 6 * l, x = 3 * h - 3 * a;
      if (this.geo.snap0(f) === 0)
        e.add(-x / d);
      else {
        const y = d * d - 4 * f * x;
        if (y >= 0) {
          const g = Math.sqrt(y);
          e.add((-d + g) / (2 * f)), e.add((-d - g) / (2 * f));
        }
      }
      return e;
    }, s = this.p0, i = this.p1, r = this.p2, c = this.p3;
    return n(s[0], i[0], r[0], c[0]), n(s[1], i[1], r[1], c[1]), e.list();
  }
  inflectionTValues() {
    const e = new fr(this.geo);
    e.addArray(this.boundingTValues());
    const n = this.p0, s = this.p1, i = this.p2, r = this.p3, c = 3 * (s[0] - n[0]), a = 3 * (s[1] - n[1]), h = 6 * (i[0] - s[0]), l = 6 * (i[1] - s[1]), u = 3 * (r[0] - i[0]), f = 3 * (r[1] - i[1]), d = 6 * (i[0] - 2 * s[0] + n[0]), x = 6 * (i[1] - 2 * s[1] + n[1]), y = 6 * (r[0] - 2 * i[0] + s[0]), g = 6 * (r[1] - 2 * i[1] + s[1]), w = c - h + u, M = a - l + f, E = h - 2 * c, I = l - 2 * a, N = c, O = a, z = y - d, k = g - x, Y = d, H = x, $ = w * k - M * z, W = w * H + E * k - M * Y - I * z, J = E * H + N * k - I * Y - O * z, ot = N * H - O * Y;
    for (const K of this.geo.solveCubic($, W, J, ot))
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
    for (const h of this.geo.solveCubic(a[0], a[1], a[2], a[3])) {
      const l = this.geo.snap01(h);
      if (l >= 0 && l <= 1)
        return h;
    }
    if (n || e >= Math.min(this.p0[0], this.p3[0]) && e <= Math.max(this.p0[0], this.p3[0]))
      for (let h = 0; h < 4; h++) {
        let l = -1;
        for (let u = 0; u < 4; u++)
          a[u] !== 0 && (l < 0 || Math.abs(a[u]) < Math.abs(a[l])) && (l = u);
        if (l < 0)
          return 0;
        a[l] = 0;
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
function xs(o, e) {
  const n = e.p1[0] - e.p0[0], s = e.p1[1] - e.p0[1], i = o[0] - e.p0[0], r = o[1] - e.p0[1], c = n * n + s * s;
  return (i * n + r * s) / c;
}
function Bc(o, e, n) {
  const s = o.geo, i = o.p0, r = o.p1, c = e.p0, a = e.p1, h = r[0] - i[0], l = r[1] - i[1], u = a[0] - c[0], f = a[1] - c[1], d = h * f - l * u;
  if (s.snap0(d) === 0) {
    if (!s.isCollinear(i, r, c))
      return null;
    const g = xs(e.p0, o), w = xs(e.p1, o), M = s.snap01(Math.min(g, w)), E = s.snap01(Math.max(g, w));
    if (E < 0 || M > 1)
      return null;
    const I = xs(o.p0, e), N = xs(o.p1, e), O = s.snap01(Math.min(I, N)), z = s.snap01(Math.max(I, N));
    return z < 0 || O > 1 ? null : {
      kind: "tRangePairs",
      tStart: [Math.max(0, M), Math.max(0, O)],
      tEnd: [Math.min(1, E), Math.min(1, z)]
    };
  }
  const x = i[0] - c[0], y = i[1] - c[1];
  return new Es(n, s).add((u * y - f * x) / d, (h * y - l * x) / d).done();
}
function dr(o, e, n, s) {
  const i = o.geo, r = o.p0, c = o.p1, a = c[1] - r[1], h = r[0] - c[0];
  if (i.snap0(h) === 0) {
    const E = e.mapXtoT(r[0], !1);
    if (E === !1)
      return null;
    const N = (e.point(E)[1] - r[1]) / a, O = new Es(n, i);
    return s ? O.add(E, N) : O.add(N, E), O.done();
  }
  const l = a * r[0] + h * r[1], u = e.getCubicCoefficients(0), f = e.getCubicCoefficients(1), d = a * u[0] + h * f[0], x = a * u[1] + h * f[1], y = a * u[2] + h * f[2], g = a * u[3] + h * f[3] - l, w = i.solveCubic(d, x, y, g), M = new Es(n, i);
  if (i.snap0(a) === 0)
    for (const E of w) {
      const I = u[0] * E * E * E + u[1] * E * E + u[2] * E + u[3], N = (r[0] - I) / h;
      s ? M.add(E, N) : M.add(N, E);
    }
  else
    for (const E of w) {
      const N = (f[0] * E * E * E + f[1] * E * E + f[2] * E + f[3] - r[1]) / a;
      s ? M.add(E, N) : M.add(N, E);
    }
  return M.done();
}
function Yc(o, e, n) {
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
  const i = new Es(n, s), r = (c, a, h, l, u, f) => {
    const d = c.boundingBox(), x = l.boundingBox();
    if (!Cc(d, x))
      return;
    const y = (a + h) / 2, g = (u + f) / 2;
    if (s.snap0(h - a) === 0 && s.snap0(f - u) === 0) {
      i.add(y, g);
      return;
    }
    const [w, M] = c.split([0.5]), [E, I] = l.split([0.5]);
    r(w, a, y, E, u, g), r(M, y, h, E, u, g), r(w, a, y, I, g, f), r(M, y, h, I, g, f);
  };
  return r(o, 0, 1, e, 0, 1), i.done();
}
function xr(o, e, n) {
  if (o instanceof jt) {
    if (e instanceof jt)
      return Bc(o, e, n);
    if (e instanceof $t)
      return dr(
        o,
        e,
        n,
        !1
      );
  } else if (o instanceof $t) {
    if (e instanceof jt)
      return dr(
        e,
        o,
        n,
        !0
      );
    if (e instanceof $t)
      return Yc(o, e, n);
  }
  throw new Error("PolyBool: Unknown segment instance in segmentsIntersect");
}
class Yr {
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
class Tn extends Yr {
}
class Pn extends Yr {
}
function yr(o, e) {
  if (o instanceof Tn)
    return new Tn(o.data, o.myFill, o.closed, e);
  if (o instanceof Pn)
    return new Pn(o.data, o.myFill, o.closed, e);
  throw new Error("PolyBool: Unknown SegmentBool in copySegmentBool");
}
class pr {
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
class mr {
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
class gr {
  selfIntersection;
  geo;
  events = new mr();
  status = new mr();
  log;
  currentPath = [];
  constructor(e, n, s = null) {
    this.selfIntersection = e, this.geo = n, this.log = s;
  }
  compareEvents(e, n, s, i, r, c, a, h) {
    const l = this.geo.compareVec2(n, c);
    return l !== 0 ? l : i instanceof jt && h instanceof jt && this.geo.isEqualVec2(s, a) ? 0 : e !== r ? e ? 1 : -1 : this.compareSegments(h, i);
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
    const c = r instanceof jt ? new Tn(r, e.seg.myFill, e.seg.closed, this.log) : r instanceof $t ? new Pn(r, e.seg.myFill, e.seg.closed, this.log) : null;
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
    const s = new pr(!0, e.data.start(), e, n), i = new pr(!1, e.data.end(), e, n);
    return s.other = i, i.other = s, this.addEvent(s), this.addEvent(i), s;
  }
  addLine(e, n, s = !0) {
    const i = this.geo.compareVec2(e, n);
    if (i === 0)
      return;
    const r = new Tn(
      new jt(i < 0 ? e : n, i < 0 ? n : e, this.geo),
      null,
      !1,
      this.log
    );
    this.currentPath.push(r), this.addSegment(r, s);
  }
  addCurve(e, n, s, i, r = !0) {
    const c = new $t(e, n, s, i, this.geo), a = c.split(c.inflectionTValues());
    for (const h of a) {
      const l = this.geo.compareVec2(h.start(), h.end());
      if (l === 0)
        continue;
      const u = h.toLine();
      if (u)
        this.addLine(u.p0, u.p1, r);
      else {
        const f = new Pn(
          l < 0 ? h : h.reverse(),
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
        const d = xr(e, n, !0);
        if (d && d.kind === "tValuePairs")
          for (const x of d.tValuePairs) {
            const y = this.geo.snap01(x[0]);
            if (y > 0 && y < 1) {
              i = e.point(y);
              break;
            }
          }
      }
    }
    const [c, a] = s, [h, l] = i, [u, f] = r;
    return Math.sign((h - c) * (f - a) - (l - a) * (u - c));
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
    const r = xr(s.data, i.data, !1);
    if (r === null)
      return null;
    if (r.kind === "tRangePairs") {
      const {
        tStart: [c, a],
        tEnd: [h, l]
      } = r;
      if (c === 1 && h === 1 && a === 0 && l === 0 || c === 0 && h === 0 && a === 1 && l === 1)
        return null;
      if (c === 0 && h === 1 && a === 0 && l === 1)
        return n;
      const u = s.data.start(), f = s.data.end(), d = i.data.end();
      return c === 0 && a === 0 ? (h === 1 ? this.divideEvent(n, l, f) : this.divideEvent(e, h, d), n) : (a > 0 && a < 1 && (h === 1 && l === 1 ? this.divideEvent(n, a, u) : (h === 1 ? this.divideEvent(n, l, f) : this.divideEvent(e, h, d), this.divideEvent(n, a, u))), null);
    } else if (r.kind === "tValuePairs") {
      if (r.tValuePairs.length <= 0)
        return null;
      let c = r.tValuePairs[0];
      for (let u = 1; u < r.tValuePairs.length && (c[0] === 0 && c[1] === 0 || c[0] === 0 && c[1] === 1 || c[0] === 1 && c[1] === 0 || c[0] === 1 && c[1] === 1); u++)
        c = r.tValuePairs[u];
      const [a, h] = c, l = h === 0 ? i.data.start() : h === 1 ? i.data.end() : a === 0 ? s.data.start() : a === 1 ? s.data.end() : s.data.point(a);
      return a > 0 && a < 1 && this.divideEvent(e, a, l), h > 0 && h < 1 && this.divideEvent(n, h, l), null;
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
            const h = this.checkIntersection(n, i);
            if (h)
              return h;
          }
          return r ? this.checkIntersection(n, r) : null;
        })();
        if (a) {
          if (this.selfIntersection) {
            let h;
            n.seg.myFill.below === null ? h = n.seg.closed : h = n.seg.myFill.above !== n.seg.myFill.below, h && (a.seg.myFill.above = !a.seg.myFill.above);
          } else
            a.seg.otherFill = n.seg.myFill;
          this.log?.segmentUpdate(a.seg), this.events.remove(n.other), this.events.remove(n);
        }
        if (this.events.getHead() !== n) {
          this.log?.rewind(n.seg);
          continue;
        }
        if (this.selfIntersection) {
          let h;
          n.seg.myFill.below === null ? h = n.seg.closed : h = n.seg.myFill.above !== n.seg.myFill.below, r ? n.seg.myFill.below = r.seg.myFill.above : n.seg.myFill.below = !1, n.seg.myFill.above = h ? !n.seg.myFill.below : n.seg.myFill.below;
        } else if (n.seg.otherFill === null) {
          let h;
          if (!r)
            h = !1;
          else if (n.primary === r.primary) {
            if (r.seg.otherFill === null)
              throw new Error(
                "PolyBool: Unexpected state of otherFill (null)"
              );
            h = r.seg.otherFill.above;
          } else
            h = r.seg.myFill.above;
          n.seg.otherFill = {
            above: h,
            below: h
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
function Jn(o, e, n) {
  const s = [];
  for (const i of o) {
    const r = (i.myFill.above ? 8 : 0) + (i.myFill.below ? 4 : 0) + (i.otherFill && i.otherFill.above ? 2 : 0) + (i.otherFill && i.otherFill.below ? 1 : 0), c = e[r], a = (c & 1) !== 0, h = (c & 2) !== 0;
    if (!i.closed && c !== 0 || i.closed && a !== h) {
      const l = { above: a, below: h };
      if (i instanceof Tn)
        s.push(new Tn(i.data, l, i.closed, n));
      else if (i instanceof Pn)
        s.push(new Pn(i.data, l, i.closed, n));
      else
        throw new Error(
          "PolyBool: Unknown SegmentBool type in SegmentSelector"
        );
    }
  }
  return n?.selected(s), s;
}
class Rn {
  // prettier-ignore
  static union(e, n) {
    return Jn(
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
    return Jn(
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
    return Jn(
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
    return Jn(
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
    return Jn(
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
function Vc(o, e, n) {
  return n.isCollinear(o.p0, o.p1, e.p1) ? new jt(o.p0, e.p1, n) : !1;
}
function Uc(o, e, n) {
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
      ), [h, l] = a.split([r]);
      if (h.isEqual(o) && l.isEqual(e))
        return a;
    }
  }
  return !1;
}
function zn(o, e, n) {
  return o === e ? !1 : o instanceof jt && e instanceof jt ? Vc(o, e, n) : o instanceof $t && e instanceof $t ? Uc(o, e, n) : !1;
}
function Xc(o, e, n) {
  const s = [], i = [], r = [];
  for (const c of o) {
    let a = function(M, E, I) {
      return w && (w.index = M, w.matchesHead = E, w.matchesPt1 = I), w === y ? (w = g, !1) : (w = null, !0);
    }, h = c.data;
    const l = c.closed, u = l ? s : i, f = h.start(), d = h.end(), x = (M) => {
      n?.chainReverse(M, l);
      const E = [];
      for (const I of u[M].segs)
        E.unshift(I.reverse());
      return u[M] = {
        segs: E,
        fill: !u[M].fill
      }, E;
    };
    if (h instanceof jt && e.isEqualVec2(f, d)) {
      console.warn(
        "PolyBool: Warning: Zero-length segment detected; your epsilon is probably too small or too large"
      );
      continue;
    }
    n?.chainStart({ seg: h, fill: !!c.myFill.above }, l);
    const y = {
      index: 0,
      matchesHead: !1,
      matchesPt1: !1
    }, g = {
      index: 0,
      matchesHead: !1,
      matchesPt1: !1
    };
    let w = y;
    for (let M = 0; M < u.length; M++) {
      const E = u[M].segs, I = E[0].start(), N = E[E.length - 1].end();
      if (e.isEqualVec2(I, f)) {
        if (a(M, !0, !0))
          break;
      } else if (e.isEqualVec2(I, d)) {
        if (a(M, !0, !1))
          break;
      } else if (e.isEqualVec2(N, f)) {
        if (a(M, !1, !0))
          break;
      } else if (e.isEqualVec2(N, d) && a(M, !1, !1))
        break;
    }
    if (w === y) {
      const M = !!c.myFill.above;
      u.push({ segs: [h], fill: M }), n?.chainNew({ seg: h, fill: M }, l);
    } else if (w === g) {
      const M = y.index;
      n?.chainMatch(M, l);
      const { segs: E, fill: I } = u[M];
      if (y.matchesHead ? y.matchesPt1 ? (h = h.reverse(), n?.chainAddHead(M, { seg: h, fill: I }, l), E.unshift(h)) : (n?.chainAddHead(M, { seg: h, fill: I }, l), E.unshift(h)) : y.matchesPt1 ? (n?.chainAddTail(M, { seg: h, fill: I }, l), E.push(h)) : (h = h.reverse(), n?.chainAddTail(M, { seg: h, fill: I }, l), E.push(h)), y.matchesHead) {
        const N = E[1], O = zn(h, N, e);
        O && (E.shift(), E[0] = O, n?.chainSimplifyHead(M, { seg: O, fill: I }, l));
      } else {
        const N = E[E.length - 2], O = zn(N, h, e);
        O && (E.pop(), E[E.length - 1] = O, n?.chainSimplifyTail(M, { seg: O, fill: I }, l));
      }
      if (l) {
        let N = E, O = N[0], z = N[N.length - 1];
        if (N.length > 0 && e.isEqualVec2(O.start(), z.end())) {
          let k = 0, Y = N[0].start();
          for (const W of N) {
            const J = W.end();
            k += J[1] * Y[0] - J[0] * Y[1], Y = J;
          }
          k < 0 === I && (N = x(M), O = N[0], z = N[N.length - 1]);
          const $ = zn(z, O, e);
          $ && (N.pop(), N[0] = $, n?.chainSimplifyClose(M, { seg: $, fill: I }, l)), n?.chainClose(M, l), u.splice(M, 1), r.push(N);
        }
      }
    } else {
      const M = (O, z) => {
        const { segs: k, fill: Y } = u[O], { segs: H } = u[z];
        n?.chainAddTail(O, { seg: h, fill: Y }, l), k.push(h);
        const $ = k[k.length - 2], W = zn($, h, e);
        W && (k.pop(), k[k.length - 1] = W, n?.chainSimplifyTail(O, { seg: W, fill: Y }, l));
        const J = k[k.length - 1], ot = H[0], K = zn(J, ot, e);
        K && (H.shift(), k[k.length - 1] = K, n?.chainSimplifyJoin(
          O,
          z,
          { seg: K, fill: Y },
          l
        )), n?.chainJoin(O, z, l), u[O].segs = k.concat(H), u.splice(z, 1);
      }, E = y.index, I = g.index;
      n?.chainConnect(E, I, l);
      const N = u[E].segs.length < u[I].segs.length;
      y.matchesHead ? g.matchesHead ? N ? (y.matchesPt1 || (h = h.reverse()), x(E), M(E, I)) : (y.matchesPt1 && (h = h.reverse()), x(I), M(I, E)) : (y.matchesPt1 && (h = h.reverse()), M(I, E)) : g.matchesHead ? (y.matchesPt1 || (h = h.reverse()), M(E, I)) : N ? (y.matchesPt1 && (h = h.reverse()), x(E), M(I, E)) : (y.matchesPt1 || (h = h.reverse()), x(I), M(E, I));
    }
  }
  for (const { segs: c } of i)
    r.push(c);
  return r;
}
function Wc(o, e, n, s) {
  const [i, r, c, a, h, l] = s;
  n.beginPath();
  for (const u of o) {
    if (u.length <= 0)
      continue;
    for (let x = 0; x < u.length; x++) {
      const y = u[x];
      if (x === 0) {
        const [g, w] = y.start();
        n.moveTo(i * g + c * w + h, r * g + a * w + l);
      }
      if (y instanceof jt) {
        const [g, w] = y.p1;
        n.lineTo(i * g + c * w + h, r * g + a * w + l);
      } else if (y instanceof $t) {
        const [g, w] = y.p1, [M, E] = y.p2, [I, N] = y.p3;
        n.bezierCurveTo(
          i * g + c * w + h,
          r * g + a * w + l,
          i * M + c * E + h,
          r * M + a * E + l,
          i * I + c * N + h,
          r * I + a * N + l
        );
      } else
        throw new Error("PolyBool: Unknown segment instance");
    }
    const f = u[0], d = u[u.length - 1];
    e.isEqualVec2(f.start(), d.end()) && n.closePath();
  }
  return n;
}
class wn {
  geo;
  log;
  pathState = { kind: "beginPath" };
  resultState;
  saveStack = [];
  matrix = [1, 0, 0, 1, 0, 0];
  constructor(e, n = null, s = null) {
    this.geo = e, this.log = s, n ? this.resultState = { state: "seg", segments: n } : this.resultState = {
      state: "new",
      selfIntersect: new gr(!0, this.geo, this.log)
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
    const [a, h, l, u, f, d] = this.matrix;
    return this.matrix = [
      a * e + l * n,
      h * e + u * n,
      a * s + l * i,
      h * s + u * i,
      a * r + l * c + f,
      h * r + u * c + d
    ], this;
  }
  rotate(e) {
    const n = Math.cos(e), s = Math.sin(e), [i, r, c, a, h, l] = this.matrix;
    return this.matrix = [
      i * n + c * s,
      r * n + a * s,
      c * n - i * s,
      a * n - r * s,
      h,
      l
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
    const [r, c, a, h, l, u] = this.matrix;
    return this.matrix = [
      r * s + a * i,
      c * s + h * i,
      a * s - r * i,
      h * s - c * i,
      l,
      u
    ], this;
  }
  scale(e, n) {
    const [s, i, r, c, a, h] = this.matrix;
    return this.matrix = [s * e, i * e, r * n, c * n, a, h], this;
  }
  translate(e, n) {
    const [s, i, r, c, a, h] = this.matrix;
    return this.matrix = [
      s,
      i,
      r,
      c,
      s * e + r * n + a,
      i * e + c * n + h
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
    const [s, i, r, c, a, h] = this.matrix;
    return [s * e + r * n + a, i * e + c * n + h];
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
        regions: Xc(e, this.geo, this.log)
      };
    }
    return this.resultState.regions;
  }
  output(e, n = [1, 0, 0, 1, 0, 0]) {
    return Wc(this.segments(), this.geo, e, n);
  }
  combine(e) {
    const n = new gr(!1, this.geo, this.log);
    for (const s of this.selfIntersect())
      n.addSegment(yr(s, this.log), !0);
    for (const s of e.selfIntersect())
      n.addSegment(yr(s, this.log), !1);
    return new $c(n.calculate(), this.geo, this.log);
  }
}
class $c {
  geo;
  log;
  segments;
  constructor(e, n, s = null) {
    this.geo = n, this.segments = e, this.log = s;
  }
  union() {
    return new wn(
      this.geo,
      Rn.union(this.segments, this.log),
      this.log
    );
  }
  intersect() {
    return new wn(
      this.geo,
      Rn.intersect(this.segments, this.log),
      this.log
    );
  }
  difference() {
    return new wn(
      this.geo,
      Rn.difference(this.segments, this.log),
      this.log
    );
  }
  differenceRev() {
    return new wn(
      this.geo,
      Rn.differenceRev(this.segments, this.log),
      this.log
    );
  }
  xor() {
    return new wn(
      this.geo,
      Rn.xor(this.segments, this.log),
      this.log
    );
  }
}
class Jh {
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
class jc {
  geo;
  log;
  constructor(e = new Hc(), n = null) {
    this.geo = e, this.log = n;
  }
  shape() {
    return new wn(this.geo, null, this.log);
  }
  buildLog(e) {
    return this.log = e ? new Jh() : null, this.log?.list;
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
      bezierCurveTo: (i, r, c, a, h, l) => {
        n[n.length - 1].push([i, r, c, a, h, l]);
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
const Qh = new jc(), g1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  EventBool: pr,
  Geometry: Fc,
  GeometryEpsilon: Hc,
  Intersecter: gr,
  ListBool: mr,
  PolyBool: jc,
  SegmentBase: Br,
  SegmentBoolBase: Yr,
  SegmentBoolCurve: Pn,
  SegmentBoolLine: Tn,
  SegmentChainer: Xc,
  SegmentCurve: $t,
  SegmentLine: jt,
  SegmentSelector: Rn,
  SegmentTValuePairsBuilder: Es,
  SegmentTValuesBuilder: fr,
  Shape: wn,
  ShapeCombined: $c,
  boundingBoxesIntersect: Cc,
  copySegmentBool: yr,
  default: Qh,
  joinCurves: Uc,
  joinLines: Vc,
  joinSegments: zn,
  lerp: ur,
  lerpVec2: mn,
  projectPointOntoSegmentLine: xs,
  segmentCurveIntersectSegmentCurve: Yc,
  segmentLineIntersectSegmentCurve: dr,
  segmentLineIntersectSegmentLine: Bc,
  segmentsIntersect: xr,
  segmentsToReceiver: Wc
}, Symbol.toStringTag, { value: "Module" })), Be = Math.pow(2, 32), Kh = Math.pow(2, 64), tl = Math.pow(2, 96), el = Math.pow(2, 63), nl = -Math.pow(2, 63), sl = Math.pow(2, 127), il = -Math.pow(2, 127);
class ct {
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
    return new ct(this.low_, this.high_);
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
        return ct.fromRoundNumber(this.toNumber() + e);
      e = ct.fromRoundNumber(e);
    }
    return ut.function64_64_64(this, e, "add64");
  }
  sub(e) {
    if (typeof e == "number") {
      if (Math.trunc(e) != e)
        return ct.fromRoundNumber(this.toNumber() - e);
      e = ct.fromRoundNumber(e);
    }
    return ut.function64_64_64(this, e, "sub64");
  }
  subtract(e) {
    return this.sub(e);
  }
  mul(e) {
    if (typeof e == "number") {
      if (Math.trunc(e) != e)
        return ct.fromRoundNumber(this.toNumber() * e);
      e = ct.fromRoundNumber(e);
    }
    return ut.function64_64_64(this, e, "mul64");
  }
  multiply(e) {
    return this.mul(e);
  }
  div(e) {
    if (typeof e == "number") {
      if (Math.trunc(e) != e)
        return ct.fromRoundNumber(this.toNumber() / e);
      e = ct.fromRoundNumber(e);
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
    return isNaN(e) ? new ct(0, 0) : e < nl ? yo : e > el ? rl : e < 0 ? this.fromNumber(-e).neg() : new ct(
      e % Be | 0,
      e / Be | 0
    );
  }
  static fromRoundNumber(e) {
    return ct.fromNumber(Math.round(e));
  }
  static fromInt(e) {
    let n = e | 0;
    if (n !== e)
      throw new Error("Value is not an int value");
    return new ct(n, n < 0 ? -1 : 0);
  }
  static fromString(e, n = 10) {
    if (e.length == 0)
      throw Error("number format error: empty string");
    if (n < 2 || 36 < n)
      throw Error("radix out of range: " + n);
    if (e.charAt(0) == "-")
      return ct.fromString(e.substring(1), n).neg();
    if (e.indexOf("-") >= 0)
      throw Error('number format error: interior "-" character: ' + e);
    let s = ct.fromNumber(Math.pow(n, 8)), i = new ct(0, 0);
    for (let r = 0; r < e.length; r += 8) {
      let c = Math.min(8, e.length - r), a = parseInt(e.substring(r, r + c), n);
      if (c < 8) {
        let h = ct.fromNumber(Math.pow(n, c));
        i = i.mul(h).add(ct.fromNumber(a));
      } else
        i = i.mul(s), i = i.add(ct.fromNumber(a));
    }
    return i;
  }
  toNumber() {
    return (this.low_ >>> 0) + this.high_ * Be;
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
      if (this.equals(yo)) {
        let r = ct.fromNumber(e), c = this.div(r), a = c.mul(r).sub(this);
        return c.toString(e) + a.toInt().toString(e);
      } else
        return "-" + this.neg().toString(e);
    let n = ct.fromNumber(Math.pow(e, 6)), s = new ct(this.low_, this.high_), i = "";
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
class qt {
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
    return new qt(this.d0_, this.d1_, this.d2_, this.d3_);
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
    return this.isZero() || e.isZero() ? new qt(0, 0, 0, 0) : this.isNegative() ? e.isNegative() ? this.neg().mul(e.neg()) : this.neg().mul(e).neg() : e.isNegative() ? this.mul(e.neg()).neg() : ut.function128_128_128(this, e, "mul128");
  }
  multiply(e) {
    return this.mul(e);
  }
  shiftLeft(e) {
    return e &= 127, e == 0 ? this.clone() : (this.clone(), e >= 96 ? (e -= 96, new qt(0, 0, 0, this.d0_ << e)) : e >= 64 ? (e -= 64, new qt(
      0,
      0,
      this.d0_ << e,
      this.d1_ << e | this.d0_ >>> 32 - e
    )) : e >= 32 ? (e -= 32, new qt(
      0,
      this.d0_ << e,
      this.d1_ << e | this.d0_ >>> 32 - e,
      this.d2_ << e | this.d1_ >>> 32 - e
    )) : new qt(
      this.d0_ << e,
      this.d1_ << e | this.d0_ >>> 32 - e,
      this.d2_ << e | this.d1_ >>> 32 - e,
      this.d3_ << e | this.d2_ >>> 32 - e
    ));
  }
  shiftRight(e) {
    return e &= 127, e == 0 ? this.clone() : (this.clone(), e >= 96 ? (e -= 96, new qt(this.d3_ >> e, 0, 0, 0)) : e >= 64 ? (e -= 64, new qt(
      this.d3_ >> e | this.d2_ << 32 - e,
      this.d3_ >> e,
      0,
      0
    )) : e >= 32 ? (e -= 32, new qt(
      this.d2_ >>> e | this.d1_ << 32 - e,
      this.d3_ >> e | this.d2_ << 32 - e,
      this.d3_ >> e,
      0
    )) : new qt(
      this.d1_ >>> e | this.d0_ << 32 - e,
      this.d2_ >>> e | this.d1_ << 32 - e,
      this.d3_ >> e | this.d2_ << 32 - e,
      this.d3_ >> e
    ));
  }
  shiftRightUnsigned(e) {
    return e &= 127, e == 0 ? this.clone() : (this.clone(), e >= 96 ? (e -= 96, new qt(this.d3_ >>> e, 0, 0, 0)) : e >= 64 ? (e -= 64, new qt(
      this.d3_ >>> e | this.d2_ << 32 - e,
      this.d3_ >>> e,
      0,
      0
    )) : e >= 32 ? (e -= 32, new qt(
      this.d2_ >>> e | this.d1_ << 32 - e,
      this.d3_ >>> e | this.d2_ << 32 - e,
      this.d3_ >>> e,
      0
    )) : new qt(
      this.d1_ >>> e | this.d0_ << 32 - e,
      this.d2_ >>> e | this.d1_ << 32 - e,
      this.d3_ >>> e | this.d2_ << 32 - e,
      this.d3_ >>> e
    ));
  }
  toNumber() {
    return (this.d0_ >>> 0) + (this.d1_ >>> 0) * Be + (this.d2_ >>> 0) * Kh + (this.d3_ >>> 0) * tl;
  }
  abs() {
    return this.isNegative() ? this.neg() : this;
  }
  static fromInt64(e) {
    let n = e.high < 0 ? -1 : 0;
    return new qt(e.low, e.high, n, n);
  }
  static fromNumber(e) {
    if (isNaN(e))
      return new qt(0, 0, 0, 0);
    if (e < il)
      return ol;
    if (e > sl)
      return cl;
    if (e < 0)
      return this.fromNumber(-e).neg();
    {
      let n = e & Be;
      e /= Be;
      let s = e & Be;
      e /= Be;
      let i = e & Be;
      e /= Be;
      let r = e;
      return new qt(n, s, i, r);
    }
  }
  static fromRoundNumber(e) {
    return qt.fromNumber(Math.round(e));
  }
  static fromInt(e) {
    let n = e | 0;
    if (n !== e)
      throw new Error("Value is not an int value");
    let s = e < 0 ? -1 : 0;
    return new qt(n, s, s, s);
  }
  static mul64(e, n) {
    return qt.fromInt64(e).mul(qt.fromInt64(n));
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
const yo = new ct(0, 2147483648), rl = new ct(4294967295, 2147483647), ol = new qt(0, 0, 0, 2147483648), cl = new qt(4294967295, 4294967295, 4294967295, 2147483647);
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
    return new qt(
      ut.mem32[8],
      ut.mem32[9],
      ut.mem32[10],
      ut.mem32[11]
    );
  }
  static result64() {
    return new ct(ut.mem32[8], ut.mem32[9]);
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
const te = -34e37, be = -2, ue = -1, al = 1e-20, Ks = new ct(1073741823, 0), ti = new ct(4294967295, 1073741823), hl = 1, ll = 2, ul = 4, Yi = Math.PI * 2, ei = 0.25;
var Gc = /* @__PURE__ */ ((o) => (o[o.ctIntersection = 0] = "ctIntersection", o[o.ctUnion = 1] = "ctUnion", o[o.ctDifference = 2] = "ctDifference", o[o.ctXor = 3] = "ctXor", o))(Gc || {}), Zc = /* @__PURE__ */ ((o) => (o[o.ptSubject = 0] = "ptSubject", o[o.ptClip = 1] = "ptClip", o))(Zc || {}), Jc = /* @__PURE__ */ ((o) => (o[o.jtSquare = 0] = "jtSquare", o[o.jtRound = 1] = "jtRound", o[o.jtMiter = 2] = "jtMiter", o))(Jc || {}), Qc = /* @__PURE__ */ ((o) => (o[o.pftEvenOdd = 0] = "pftEvenOdd", o[o.pftNonZero = 1] = "pftNonZero", o[o.pftPositive = 2] = "pftPositive", o[o.pftNegative = 3] = "pftNegative", o))(Qc || {}), Kc = /* @__PURE__ */ ((o) => (o[o.etClosedPolygon = 0] = "etClosedPolygon", o[o.etClosedLine = 1] = "etClosedLine", o[o.etOpenButt = 2] = "etOpenButt", o[o.etOpenSquare = 3] = "etOpenSquare", o[o.etOpenRound = 4] = "etOpenRound", o))(Kc || {});
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
    return new ft(ct.fromRoundNumber(e), ct.fromRoundNumber(n));
  }
}
class Re {
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
    return new Re(e.x, e.y);
  }
  static fromIntPoint(e) {
    return new Re(e.x.toNumber(), e.y.toNumber());
  }
}
class Ls {
  constructor(e, n, s, i) {
    this.left = e, this.top = n, this.right = s, this.bottom = i;
  }
  static copy(e) {
    return new Ls(e.left, e.top, e.right, e.bottom);
  }
}
class As {
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
class ta extends As {
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
class fl {
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
class dl {
  constructor(e, n, s) {
    this.edge1 = e, this.edge2 = n, this.pt = s;
  }
}
class ni {
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
class Vi {
  constructor(e) {
    this.y = e, this.next = null;
  }
  next;
}
class xl {
  constructor(e) {
    this.x = e, this.next = null, this.prev = null;
  }
  next = null;
  prev = null;
}
class Un {
  idx;
  pt;
  next = null;
  prev = null;
}
class ea {
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
class po {
  constructor(e, n, s) {
    this.outPt1 = e, this.outPt2 = n, this.offPt = s;
  }
}
function yl(o, e) {
  return e.pt.y.compare(o.pt.y);
}
function pl(o) {
  return Math.abs(o) < al;
}
function ke(o) {
  return o.delta.y.isZero();
}
function mo(o, e, n) {
  return n ? qt.mul64(o.delta.y, e.delta.y).equals(
    qt.mul64(o.delta.x, e.delta.y)
  ) : o.delta.y.mul(e.delta.x).equals(
    o.delta.x.mul(e.delta.y)
  );
}
function Nn(o, e, n, s) {
  return s ? qt.mul64(o.y.sub(e.y), e.x.sub(n.x)).equals(
    qt.mul64(o.x.sub(e.x), e.y.sub(n.y))
  ) : o.y.sub(e.y).mul(e.x.sub(n.x)).equals(
    o.x.sub(e.x).mul(e.y.sub(n.y))
  );
}
function Qn(o, e, n, s, i) {
  return i ? qt.mul64(o.y.sub(e.y), n.x.sub(s.x)).equals(
    qt.mul64(o.x.sub(e.x), n.y.sub(s.y))
  ) : o.y.sub(e.y).mul(n.x.sub(s.x)).equals(
    o.x.sub(e.x).mul(n.y.sub(s.y))
  );
}
function di(o, e) {
  if (e) {
    if (o.x.greaterThan(ti) || o.y.greaterThan(ti) || o.x.neg().greaterThan(ti) || o.y.neg().greaterThan(ti))
      throw new Error("Coordinate outside allowed range");
    return !0;
  } else if (o.x.greaterThan(Ks) || o.y.greaterThan(Ks) || o.x.neg().greaterThan(Ks) || o.y.neg().greaterThan(Ks))
    return di(o, !0);
  return !1;
}
function ml(o) {
  let e = o.top.x.sub(o.bot.x), n = o.top.y.sub(o.bot.y);
  o.delta = new ft(e, n), n.isZero() ? o.dx = te : o.dx = o.delta.x.toNumber() / o.delta.y.toNumber();
}
function Ui(o, e, n, s) {
  o.next = e, o.prev = n, o.curr = new ft(s.x, s.y), o.outIdx = ue;
}
function gl(o, e) {
  o.curr.y.greaterThanOrEqual(o.next.curr.y) ? (o.bot = new ft(o.curr.x, o.curr.y), o.top = new ft(o.next.curr.x, o.next.curr.y)) : (o.top = new ft(o.curr.x, o.curr.y), o.bot = new ft(o.next.curr.x, o.next.curr.y)), ml(o), o.polyTyp = e;
}
function wl(o) {
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
function na(o, e, n) {
  return o.equals(n) || o.equals(e) || n.equals(e) ? !1 : o.x.notEquals(n.x) ? e.x.greaterThan(o.x) == e.x.lessThan(n.x) : e.y.greaterThan(o.y) == e.y.lessThan(n.y);
}
function go(o) {
  o.prev.next = o.next, o.next.prev = o.prev;
  let e = o.next;
  return o.prev = null, e;
}
function xn(o) {
  let e = new ft(o.bot.x, o.top.y), n = new ft(o.top.x, o.bot.y);
  o.top = e, o.bot = n;
}
function Se(o, e) {
  return e.equals(o.top.y) ? o.top.x : o.bot.x.add(
    ct.fromRoundNumber(o.dx * e.sub(o.bot.y).toNumber())
  );
}
function wo(o, e) {
  return e.curr.x.equals(o.curr.x) ? e.top.y.greaterThan(o.top.y) ? e.top.x.lessThan(Se(o, e.top.y)) : o.top.x.greaterThan(Se(e, o.top.y)) : e.curr.x.lessThan(o.curr.x);
}
function Xi(o, e, n, s) {
  let i = o.clone(), r = e.clone(), c = n.clone(), a = s.clone();
  return i.greaterThan(r) && ct.Swap(i, r), c.greaterThan(a) && ct.Swap(c, a), i.lessThan(a) && c.lessThan(r);
}
function si(o, e) {
  return o.y.equals(e.y) ? te : e.x.sub(o.x).div(e.y.sub(o.y)).toNumber();
}
function sa(o, e) {
  let n = o.prev;
  for (; n.pt.equals(o.pt) && n != o; )
    n = n.prev;
  let s = Math.abs(si(o.pt, n.pt));
  for (n = o.next; n.pt.equals(o.pt) && n != o; )
    n = n.next;
  let i = Math.abs(si(o.pt, n.pt));
  for (n = e.prev; n.pt.equals(e.pt) && n != e; )
    n = n.prev;
  let r = Math.abs(si(e.pt, n.pt));
  for (n = e.next; n.pt.equals(e.pt) && n != e; )
    n = n.next;
  let c = Math.abs(si(e.pt, n.pt));
  return Math.max(s, i) == Math.max(r, c) && Math.min(s, i) == Math.min(r, c) ? this.Area(o) > 0 : s >= r && s >= c || i >= r && i >= c;
}
function vo(o) {
  let e = null, n = o.next;
  for (; n != o; )
    n.pt.y.greaterThan(o.pt.y) ? (o = n, e = null) : n.pt.y.equals(o.pt.y) && n.pt.x.lessThanOrEqual(o.pt.x) && (n.pt.x.lessThan(o.pt.x) ? (e = null, o = n) : n.next != o && n.prev != o && (e = n)), n = n.next;
  if (e != null)
    for (; e != n; )
      for (sa(n, e) || (o = e), e = e.next; e.pt.notEquals(o.pt); )
        e = e.next;
  return o;
}
function Mo(o, e) {
  o.bottomPt == null && (o.bottomPt = vo(o.pts)), e.bottomPt == null && (e.bottomPt = vo(e.pts));
  let n = o.bottomPt, s = e.bottomPt;
  return n.pt.y.greaterThan(s.pt.y) ? o : n.pt.y.lessThan(s.pt.y) ? e : n.pt.x.lessThan(s.pt.x) ? o : n.pt.x.greaterThan(s.pt.x) || n.next == n ? e : s.next == s || sa(n, s) ? o : e;
}
function ii(o, e) {
  do
    if (o = o.firstLeft, o == e)
      return !0;
  while (o != null);
  return !1;
}
function Kn(o) {
  if (o == null)
    return;
  let e, n;
  e = o;
  do
    n = e.next, e.next = e.prev, e.prev = n, e = n;
  while (e != o);
}
function ri(o, e) {
  let n = o.side;
  o.side = e.side, e.side = n;
}
function Wi(o, e) {
  let n = o.outIdx;
  o.outIdx = e.outIdx, e.outIdx = n;
}
function bo(o) {
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
function _o(o, e) {
  return e == 1 ? o.nextInAEL : o.prevInAEL;
}
function vl(o, e) {
  return o != null && o.top.y.equals(e) && o.nextInLML == null;
}
function To(o, e) {
  return o.top.y.equals(e) && o.nextInLML != null;
}
function ia(o) {
  return o.next.top.equals(o.top) && o.next.nextInLML == null ? o.next : o.prev.top.equals(o.top) && o.prev.nextInLML == null ? o.prev : null;
}
function Po(o) {
  let e = ia(o);
  return e == null || e.outIdx == be || e.nextInAEL == e.prevInAEL && !ke(e) ? null : e;
}
function Ml(o, e) {
  let n, s, i, r;
  if (o.dx == e.dx)
    return r = o.curr.y, i = Se(o, r), new ft(i, r);
  if (o.delta.x.isZero())
    i = o.bot.x, ke(e) ? r = e.bot.y : (s = e.bot.y.toNumber() - e.bot.x.toNumber() / e.dx, r = ct.fromRoundNumber(i.toNumber() / e.dx + s));
  else if (e.delta.x.isZero())
    i = e.bot.x, ke(o) ? r = o.bot.y : (n = o.bot.y.toNumber() - o.bot.x.toNumber() / o.dx, r = ct.fromRoundNumber(i.toNumber() / o.dx + n));
  else {
    n = o.bot.x.toNumber() - o.bot.y.toNumber() * o.dx, s = e.bot.x.toNumber() - e.bot.y.toNumber() * e.dx;
    let c = (s - n) / (o.dx - e.dx);
    r = ct.fromRoundNumber(c), Math.abs(o.dx) < Math.abs(e.dx) ? i = ct.fromRoundNumber(o.dx * c + n) : i = ct.fromRoundNumber(e.dx * c + s);
  }
  return (r.lessThan(o.top.y) || r.lessThan(e.top.y)) && (o.top.y.greaterThan(e.top.y) ? r = o.top.y : r = e.top.y, Math.abs(o.dx) < Math.abs(e.dx) ? i = Se(o, r) : i = Se(e, r)), r.greaterThan(o.curr.y) && (r = o.curr.y, Math.abs(o.dx) > Math.abs(e.dx) ? i = Se(e, r) : i = Se(o, r)), new ft(i, r);
}
function Eo(o) {
  return o.edge1.nextInSEL == o.edge2 || o.edge1.prevInSEL == o.edge2;
}
function bl(o) {
  let e = o.length;
  if (e < 3)
    return 0;
  let n = ct.fromInt(0);
  for (let s = 0, i = e - 1; s < e; ++s)
    n = n.add(o[i].x.add(o[s].x).mul(o[i].y.sub(o[s].y))), i = s;
  return -n.toNumber() * 0.5;
}
function _l(o) {
  return ra(o.pts);
}
function ra(o) {
  let e = o;
  if (o == null)
    return 0;
  let n = ct.fromInt(0);
  do
    n = n.add(o.prev.pt.x.add(o.pt.x).mul(o.prev.pt.y.sub(o.pt.y))), o = o.next;
  while (o != e);
  return n.toNumber() * 0.5;
}
function xi(o) {
  return o instanceof Un ? ra(o) : o instanceof ea ? _l(o) : bl(o);
}
function ms(o) {
  return xi(o) >= 0;
}
function Lo(o) {
  if (o == null)
    return 0;
  let e = 0, n = o;
  do
    e++, n = n.next;
  while (n != o);
  return e;
}
function le(o, e) {
  let n = new Un();
  return n.pt = new ft(o.pt.x, o.pt.y), n.idx = o.idx, e ? (n.next = o.next, n.prev = o, o.next.prev = n, o.next = n) : (n.prev = o.prev, n.next = o, o.prev.next = n, o.prev = n), n;
}
function Tl(o, e, n, s) {
  let i, r;
  return o.lessThan(e) ? n.lessThan(s) ? (i = ct.max(o, n), r = ct.min(e, s)) : (i = ct.max(o, s), r = ct.min(e, n)) : n.lessThan(s) ? (i = ct.max(e, n), r = ct.min(o, s)) : (i = ct.max(e, s), r = ct.min(o, n)), {
    r: i.lessThan(r),
    Left: i,
    Right: r
  };
}
function Pl(o, e) {
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
function El(o, e) {
  let n = 0, s = e, i = o.x, r = o.y, c = e.pt.x, a = e.pt.y;
  do {
    e = e.next;
    let h = e.pt.x, l = e.pt.y;
    if (l.equals(r) && (h.equals(i) || a.equals(r) && h.greaterThan(i) == c.lessThan(i)))
      return -1;
    if (a.lessThan(r) != l.lessThan(r)) {
      if (c.greaterThanOrEqual(i))
        if (h.greaterThan(i))
          n = 1 - n;
        else {
          let u = c.sub(i).mul(l.sub(r)).toNumber() - h.sub(i).mul(a.sub(r)).toNumber();
          if (u == 0)
            return -1;
          u > 0 == l.greaterThan(a) && (n = 1 - n);
        }
      else if (h.greaterThan(i)) {
        let u = c.sub(i).mul(l.sub(r)).toNumber() - h.sub(i).mul(a.sub(r)).toNumber();
        if (u == 0)
          return -1;
        u > 0 == l.greaterThan(a) && (n = 1 - n);
      }
    }
    c = h, a = l;
  } while (s != e);
  return n;
}
function Ll(o, e) {
  return e instanceof Un ? El(o, e) : Pl(o, e);
}
function yn(o, e) {
  let n = o;
  do {
    let s = Ll(n.pt, e);
    if (s >= 0)
      return s > 0;
    n = n.next;
  } while (n != o);
  return !0;
}
function $i(o) {
  for (; o != null && o.pts == null; )
    o = o.firstLeft;
  return o;
}
function Ao(o) {
  let e = o.pts;
  do
    e.idx = o.idx, e = e.prev;
  while (e != o.pts);
}
function Al(o, e) {
  let n = o.x.sub(e.x).toNumber(), s = o.y.sub(e.y).toNumber();
  return n * n + s * s;
}
function Dn(o, e, n) {
  let s = e.y.sub(n.y).toNumber(), i = n.x.sub(e.x).toNumber(), r = s * e.x.toNumber() + i * e.y.toNumber();
  return r = s * o.x.toNumber() + i * o.y.toNumber() - r, r * r / (s * s + i * i);
}
function Sl(o, e, n, s) {
  return o.x.sub(e.x).abs().greaterThan(o.y.sub(e.y).abs()) ? o.x.greaterThan(e.x) == o.x.lessThan(n.x) ? Dn(o, e, n) < s : e.x.greaterThan(o.x) == e.x.lessThan(n.x) ? Dn(e, o, n) < s : Dn(n, o, e) < s : o.y.greaterThan(e.y) == o.y.lessThan(n.y) ? Dn(o, e, n) < s : e.y.greaterThan(o.y) == e.y.lessThan(n.y) ? Dn(e, o, n) < s : Dn(n, o, e) < s;
}
function So(o, e, n) {
  return Al(o, e) <= n;
}
function oi(o) {
  let e = o.prev;
  return e.next = o.next, o.next.prev = e, e.idx = 0, e;
}
function ji(o, e) {
  return (o || e) && !(o && e);
}
function Io(o, e) {
  let n = e.x.sub(o.x).toNumber(), s = e.y.sub(o.y).toNumber();
  if (n == 0 && s == 0)
    return new Re(0, 0);
  let i = 1 / Math.sqrt(n * n + s * s);
  return n *= i, s *= i, new Re(s, -n);
}
class Il {
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
    if (i.outIdx == be) {
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
        let c = new ni(e.bot.y, null, e);
        e.windDelta = 0, i = this.ProcessBound(e, n), this.InsertLocalMinima(c);
      }
      return i;
    }
    if (e.dx == te && (s = n ? e.prev : e.next, s.dx == te ? s.bot.x.notEquals(e.bot.x) && s.top.x.notEquals(e.bot.x) && xn(e) : s.bot.x.notEquals(e.bot.x) && xn(e)), s = e, n) {
      for (; i.top.y.equals(i.next.bot.y) && i.next.outIdx != be; )
        i = i.next;
      if (i.dx == te && i.next.outIdx != be) {
        for (r = i; r.prev.dx == te; )
          r = r.prev;
        r.prev.top.x.greaterThan(i.next.top.x) && (i = r.prev);
      }
      for (; e != i; )
        e.nextInLML = e.next, e.dx == te && e != s && e.bot.x.notEquals(e.prev.top.x) && xn(e), e = e.next;
      e.dx == te && e != s && e.bot.x.notEquals(e.prev.top.x) && xn(e), i = i.next;
    } else {
      for (; i.top.y.equals(i.prev.bot.y) && i.prev.outIdx != be; )
        i = i.prev;
      if (i.dx == te && i.prev.outIdx != be) {
        for (r = i; r.next.dx == te; ) r = r.next;
        r.next.top.x.greaterThanOrEqual(i.prev.top.x) && (i = r.next);
      }
      for (; e != i; )
        e.nextInLML = e.prev, e.dx == te && e != s && e.bot.x.notEquals(e.next.top.x) && xn(e), e = e.prev;
      e.dx == te && e != s && e.bot.x.notEquals(e.next.top.x) && xn(e), i = i.prev;
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
      this.m_Scanbeam = new Vi(e);
    else if (e.greaterThan(this.m_Scanbeam.y)) {
      let n = new Vi(e);
      n.next = this.m_Scanbeam, this.m_Scanbeam = n;
    } else {
      let n = this.m_Scanbeam;
      for (; n.next != null && e.lessThanOrEqual(n.next.y); ) n = n.next;
      if (e.equals(n.y)) return;
      let s = new Vi(e);
      s.next = n.next, n.next = s;
    }
  }
  static GetBounds(e) {
    let n = 0, s = e.length;
    for (; n < s && e[n].length == 0; ) n++;
    let i = ct.fromInt(0);
    if (n == s)
      return new Ls(i, i, i, i);
    let r = e[n][0].x, c = r, a = e[n][0].y, h = a;
    for (; n < s; n++)
      for (let l = 0; l < e[n].length; l++)
        e[n][l].x.lessThan(r) ? r = e[n][l].x : e[n][l].x.greaterThan(c) && (c = e[n][l].x), e[n][l].y.lessThan(a) ? a = e[n][l].y : e[n][l].y.greaterThan(h) && (h = e[n][l].y);
    return new Ls(r, a, c, h);
  }
  PopScanbeam() {
    if (this.m_Scanbeam == null)
      return { Y: ct.fromInt(0), r: !1 };
    let e = this.m_Scanbeam.y;
    return this.m_Scanbeam = this.m_Scanbeam.next, { Y: e, r: !0 };
  }
  get LocalMinimaPending() {
    return this.m_CurrentLM != null;
  }
  CreateOutRec() {
    let e = new ea();
    return this.m_PolyOuts.push(e), e.idx = this.m_PolyOuts.length - 1, e;
  }
  DisposeOutRec(e) {
    this.m_PolyOuts[e] = null;
  }
  UpdateEdgeIntoAEL(e) {
    if (e.nextInLML == null)
      throw new Error("UpdateEdgeIntoAEL: invalid call");
    let n = e.prevInAEL, s = e.nextInAEL;
    return e.nextInLML.outIdx = e.outIdx, n != null ? n.nextInAEL = e.nextInLML : this.m_ActiveEdges = e.nextInLML, s != null && (s.prevInAEL = e.nextInLML), e.nextInLML.side = e.side, e.nextInLML.windDelta = e.windDelta, e.nextInLML.windCnt = e.windCnt, e.nextInLML.windCnt2 = e.windCnt2, e = e.nextInLML, e.curr = new ft(e.bot.x, e.bot.y), e.prevInAEL = n, e.nextInAEL = s, ke(e) || this.InsertScanbeam(e.top.y), e;
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
      r[d] = new fl();
    let c = !0;
    r[1].curr = e[1], this.m_UseFullRange = di(e[0], this.m_UseFullRange), this.m_UseFullRange = di(e[i], this.m_UseFullRange), Ui(r[0], r[1], r[i], e[0]), Ui(r[i], r[0], r[i - 1], e[i]);
    for (let d = i - 1; d >= 1; --d)
      this.m_UseFullRange = di(e[d], this.m_UseFullRange), Ui(r[d], r[d + 1], r[d - 1], e[d]);
    let a = r[0], h = a, l = a;
    for (; ; ) {
      if (h.curr.equals(h.next.curr) && (s || h.next != a)) {
        if (h == h.next) break;
        h == a && (a = h.next), h = go(h), l = h;
        continue;
      }
      if (h.prev == h.next)
        break;
      if (s && Nn(h.prev.curr, h.curr, h.next.curr, this.m_UseFullRange) && (!this.PreserveCollinear || !na(h.prev.curr, h.curr, h.next.curr))) {
        h == a && (a = h.next), h = go(h), h = h.prev, l = h;
        continue;
      }
      if (h = h.next, h == l || !s && h.next == a) break;
    }
    if (!s && h == h.next || s && h.prev == h.next)
      return !1;
    s || (this.m_HasOpenPaths = !0, a.prev.outIdx = be), h = a;
    do
      gl(h, n), h = h.next, c && h.curr.y.notEquals(a.curr.y) && (c = !1);
    while (h != a);
    if (c) {
      if (s)
        return !1;
      h.prev.outIdx = be;
      let d = new ni(h.bot.y, null, h);
      for (d.rightBound.side = 1, d.rightBound.windDelta = 0; h.bot.x.notEquals(h.prev.top.x) && xn(h), h.next.outIdx != be; )
        h.nextInLML = h.next, h = h.next;
      return this.InsertLocalMinima(d), this.m_edges.push(r), !0;
    }
    this.m_edges.push(r);
    let u, f = null;
    for (h.prev.bot.equals(h.prev.top) && (h = h.next); h = wl(h), h != f; ) {
      f == null && (f = h);
      let d;
      h.dx < h.prev.dx ? (d = new ni(h.bot.y, h.prev, h), u = !1) : (d = new ni(h.bot.y, h, h.prev), u = !0), d.leftBound.side = 0, d.rightBound.side = 1, s ? d.leftBound.next == d.rightBound ? d.leftBound.windDelta = -1 : d.leftBound.windDelta = 1 : d.leftBound.windDelta = 0, d.rightBound.windDelta = -d.leftBound.windDelta, h = this.ProcessBound(d.leftBound, u), h.outIdx == be && (h = this.ProcessBound(h, u));
      let x = this.ProcessBound(d.rightBound, !u);
      x.outIdx == be && (x = this.ProcessBound(x, !u)), d.leftBound.outIdx == be ? d.clearLeftBound() : d.rightBound.outIdx == be && d.clearRightBound(), this.InsertLocalMinima(d), u || (h = x);
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
class Kt extends Il {
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
    super(), this.m_Scanbeam = null, this.m_Maxima = null, this.m_ActiveEdges = null, this.m_SortedEdges = null, this.m_IntersectList = new Array(), this.m_ExecuteLocked = !1, this.m_UsingPolyTree = !1, this.m_PolyOuts = new Array(), this.m_Joins = new Array(), this.m_GhostJoins = new Array(), this.ReverseSolution = (hl & e) != 0, this.StrictlySimple = (ll & e) != 0, this.PreserveCollinear = (ul & e) != 0;
  }
  InsertMaxima(e) {
    let n = new xl(e);
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
    return n instanceof ta ? this.ExecutePolyTree(e, n, s, s) : this.ExecutePaths(e, n, s, s);
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
        i.pts == null || i.isOpen || ji(i.isHole, this.ReverseSolution) == xi(i) > 0 && Kn(i.pts);
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
    let i = new po(e, n, s);
    this.m_Joins.push(i);
  }
  AddGhostJoin(e, n) {
    let s = new po(e, null, n);
    this.m_GhostJoins.push(s);
  }
  InsertLocalMinimaIntoAEL(e) {
    let n;
    for (; (n = this.PopLocalMinima(e)) != null; ) {
      let s = n.leftBound, i = n.rightBound, r = null;
      if (s == null ? (this.InsertEdgeIntoAEL(i, null), this.SetWindingCount(i), this.IsContributing(i) && (r = this.AddOutPt(i, i.bot))) : i == null ? (this.InsertEdgeIntoAEL(s, null), this.SetWindingCount(s), this.IsContributing(s) && (r = this.AddOutPt(s, s.bot)), this.InsertScanbeam(s.top.y)) : (this.InsertEdgeIntoAEL(s, null), this.InsertEdgeIntoAEL(i, s), this.SetWindingCount(s), i.windCnt = s.windCnt, i.windCnt2 = s.windCnt2, this.IsContributing(s) && (r = this.AddLocalMinPoly(s, i, s.bot)), this.InsertScanbeam(s.top.y)), i != null && (ke(i) ? (i.nextInLML != null && this.InsertScanbeam(i.nextInLML.top.y), this.AddEdgeToSEL(i)) : this.InsertScanbeam(i.top.y)), !(s == null || i == null)) {
        if (r != null && ke(i) && this.m_GhostJoins.length > 0 && i.windDelta != 0)
          for (let c = 0; c < this.m_GhostJoins.length; c++) {
            let a = this.m_GhostJoins[c];
            Xi(a.outPt1.pt.x, a.offPt.x, i.bot.x, i.top.x) && this.AddJoin(a.outPt1, r, a.offPt);
          }
        if (s.outIdx >= 0 && s.prevInAEL != null && s.prevInAEL.curr.x.equals(s.bot.x) && s.prevInAEL.outIdx >= 0 && Qn(s.prevInAEL.curr, s.prevInAEL.top, s.curr, s.top, this.m_UseFullRange) && s.windDelta != 0 && s.prevInAEL.windDelta != 0) {
          let c = this.AddOutPt(s.prevInAEL, s.bot);
          this.AddJoin(r, c, s.top);
        }
        if (s.nextInAEL != i) {
          if (i.outIdx >= 0 && i.prevInAEL.outIdx >= 0 && Qn(i.prevInAEL.curr, i.prevInAEL.top, i.curr, i.top, this.m_UseFullRange) && i.windDelta != 0 && i.prevInAEL.windDelta != 0) {
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
    else if (n == null && wo(this.m_ActiveEdges, e))
      e.prevInAEL = null, e.nextInAEL = this.m_ActiveEdges, this.m_ActiveEdges.prevInAEL = e, this.m_ActiveEdges = e;
    else {
      for (n == null && (n = this.m_ActiveEdges); n.nextInAEL != null && !wo(n.nextInAEL, e); )
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
    if (ke(n) || e.dx > n.dx ? (i = this.AddOutPt(e, s), n.outIdx = e.outIdx, e.side = 0, n.side = 1, r = e, r.prevInAEL == n ? c = n.prevInAEL : c = r.prevInAEL) : (i = this.AddOutPt(n, s), e.outIdx = n.outIdx, e.side = 1, n.side = 0, r = n, r.prevInAEL == e ? c = e.prevInAEL : c = r.prevInAEL), c != null && c.outIdx >= 0 && c.top.y.lessThan(s.y) && r.top.y.lessThan(s.y)) {
      let a = Se(c, s.y), h = Se(r, s.y);
      if (a.equals(h) && r.windDelta != 0 && c.windDelta != 0 && Qn(
        new ft(a, s.y),
        c.top,
        new ft(h, s.y),
        r.top,
        this.m_UseFullRange
      )) {
        let l = this.AddOutPt(c, s);
        this.AddJoin(i, l, r.top);
      }
    }
    return i;
  }
  AddOutPt(e, n) {
    if (e.outIdx < 0) {
      let s = this.CreateOutRec();
      s.isOpen = e.windDelta == 0;
      let i = new Un();
      return s.pts = i, i.idx = s.idx, i.pt = new ft(n.x, n.y), i.next = i, i.prev = i, s.isOpen || this.SetHoleState(e, s), e.outIdx = s.idx, i;
    } else {
      let s = this.m_PolyOuts[e.outIdx], i = s.pts, r = e.side == 0;
      if (r && n.equals(i.pt))
        return i;
      if (!r && n.equals(i.prev.pt))
        return i.prev;
      let c = new Un();
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
    ii(s, i) ? r = i : ii(i, s) ? r = s : r = Mo(s, i);
    let c = s.pts, a = c.prev, h = i.pts, l = h.prev;
    e.side == 0 ? n.side == 0 ? (Kn(h), h.next = c, c.prev = h, a.next = l, l.prev = a, s.pts = l) : (l.next = c, c.prev = l, h.prev = a, a.next = h, s.pts = h) : n.side == 1 ? (Kn(h), a.next = l, l.prev = a, h.next = c, c.prev = h) : (a.next = h, h.prev = a, c.prev = l, l.next = c), s.bottomPt = null, r == i && (i.firstLeft != s && (s.firstLeft = i.firstLeft), s.isHole = i.isHole), i.pts = null, i.bottomPt = null, i.firstLeft = s;
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
    let c, a, h, l;
    e.polyTyp == 0 ? (c = this.m_SubjFillType, h = this.m_ClipFillType) : (c = this.m_ClipFillType, h = this.m_SubjFillType), n.polyTyp == 0 ? (a = this.m_SubjFillType, l = this.m_ClipFillType) : (a = this.m_ClipFillType, l = this.m_SubjFillType);
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
      u != 0 && u != 1 || f != 0 && f != 1 || e.polyTyp != n.polyTyp && this.m_ClipType != 3 ? this.AddLocalMaxPoly(e, n, s) : (this.AddOutPt(e, s), this.AddOutPt(n, s), ri(e, n), Wi(e, n));
    else if (i)
      (f == 0 || f == 1) && (this.AddOutPt(e, s), ri(e, n), Wi(e, n));
    else if (r)
      (u == 0 || u == 1) && (this.AddOutPt(n, s), ri(e, n), Wi(e, n));
    else if ((u == 0 || u == 1) && (f == 0 || f == 1)) {
      let d, x;
      switch (h) {
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
      switch (l) {
        case 2:
          x = n.windCnt2;
          break;
        case 3:
          x = -n.windCnt2;
          break;
        default:
          x = Math.abs(n.windCnt2);
          break;
      }
      if (e.polyTyp != n.polyTyp)
        this.AddLocalMinPoly(e, n, s);
      else if (u == 1 && f == 1)
        switch (this.m_ClipType) {
          case 0:
            d > 0 && x > 0 && this.AddLocalMinPoly(e, n, s);
            break;
          case 1:
            d <= 0 && x <= 0 && this.AddLocalMinPoly(e, n, s);
            break;
          case 2:
            (e.polyTyp == 1 && d > 0 && x > 0 || e.polyTyp == 0 && d <= 0 && x <= 0) && this.AddLocalMinPoly(e, n, s);
            break;
          case 3:
            this.AddLocalMinPoly(e, n, s);
            break;
        }
      else
        ri(e, n);
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
    let n, s, i, r = e.windDelta == 0, c = bo(e);
    n = c.Dir, s = c.Left, i = c.Right;
    let a = e, h = null;
    for (; a.nextInLML != null && ke(a.nextInLML); )
      a = a.nextInLML;
    a.nextInLML == null && (h = ia(a));
    let l = this.m_Maxima;
    if (l != null)
      if (n == 1) {
        for (; l != null && l.x.lessThan(e.bot.x); )
          l = l.next;
        l != null && l.x.greaterThanOrEqual(a.top.x) && (l = null);
      } else {
        for (; l.next != null && l.next.x.lessThan(e.bot.x); )
          l = l.next;
        l.x.lessThanOrEqual(a.top.x) && (l = null);
      }
    let u = null;
    for (; ; ) {
      let f = e == a, d = _o(e, n);
      for (; d != null; ) {
        if (l != null)
          if (n == 1)
            for (; l != null && l.x.lessThan(d.curr.x); )
              e.outIdx >= 0 && !r && this.AddOutPt(e, new ft(l.x, e.bot.y)), l = l.next;
          else
            for (; l != null && l.x.greaterThan(d.curr.x); )
              e.outIdx >= 0 && !r && this.AddOutPt(e, new ft(l.x, e.bot.y)), l = l.prev;
        if (n == 1 && d.curr.x.greaterThan(i) || n == 0 && d.curr.x.lessThan(s) || d.curr.x.equals(e.top.x) && e.nextInLML != null && d.dx < e.nextInLML.dx)
          break;
        if (e.outIdx >= 0 && !r) {
          u = this.AddOutPt(e, d.curr);
          let y = this.m_SortedEdges;
          for (; y != null; ) {
            if (y.outIdx >= 0 && Xi(e.bot.x, e.top.x, y.bot.x, y.top.x)) {
              let g = this.GetLastOutPt(y);
              this.AddJoin(g, u, y.top);
            }
            y = y.nextInSEL;
          }
          this.AddGhostJoin(u, e.bot);
        }
        if (d == h && f) {
          e.outIdx >= 0 && this.AddLocalMaxPoly(e, h, e.top), this.DeleteFromAEL(e), this.DeleteFromAEL(h);
          return;
        }
        if (n == 1) {
          let y = new ft(d.curr.x, e.curr.y);
          this.IntersectEdges(e, d, y);
        } else {
          let y = new ft(d.curr.x, e.curr.y);
          this.IntersectEdges(d, e, y);
        }
        let x = _o(d, n);
        this.SwapPositionsInAEL(e, d), d = x;
      }
      if (e.nextInLML == null || !ke(e.nextInLML))
        break;
      e = this.UpdateEdgeIntoAEL(e), e.outIdx >= 0 && this.AddOutPt(e, e.bot), c = bo(e), n = c.Dir, s = c.Left, i = c.Right;
    }
    if (e.outIdx >= 0 && u == null) {
      u = this.GetLastOutPt(e);
      let f = this.m_SortedEdges;
      for (; f != null; ) {
        if (f.outIdx >= 0 && Xi(e.bot.x, e.top.x, f.bot.x, f.top.x)) {
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
        if (f != null && f.curr.x.equals(e.bot.x) && f.curr.y.equals(e.bot.y) && f.windDelta != 0 && f.outIdx >= 0 && f.curr.y.greaterThan(f.top.y) && mo(e, f, this.m_UseFullRange)) {
          let x = this.AddOutPt(f, e.bot);
          this.AddJoin(u, x, e.top);
        } else if (d != null && d.curr.x.equals(e.bot.x) && d.curr.y.equals(e.bot.y) && d.windDelta != 0 && d.outIdx >= 0 && d.curr.y.greaterThan(d.top.y) && mo(e, d, this.m_UseFullRange)) {
          let x = this.AddOutPt(d, e.bot);
          this.AddJoin(u, x, e.top);
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
      n.prevInSEL = n.prevInAEL, n.nextInSEL = n.nextInAEL, n.curr = new ft(Se(n, e), n.curr.y), n = n.nextInAEL;
    let s = !0;
    for (; s && this.m_SortedEdges != null; ) {
      for (s = !1, n = this.m_SortedEdges; n.nextInSEL != null; ) {
        let i = n.nextInSEL, r;
        n.curr.x.greaterThan(i.curr.x) ? (r = Ml(n, i), r.y.lessThan(e) && (r = new ft(Se(n, e), e)), this.m_IntersectList.push(new dl(n, i, r)), this.SwapPositionsInSEL(n, i), s = !0) : n = i;
      }
      if (n.prevInSEL != null)
        n.prevInSEL.nextInSEL = null;
      else
        break;
    }
    this.m_SortedEdges = null;
  }
  FixupIntersectionOrder() {
    this.m_IntersectList.sort(yl), this.CopyAELToSEL();
    let e = this.m_IntersectList.length;
    for (let n = 0; n < e; n++) {
      if (!Eo(this.m_IntersectList[n])) {
        let s = n + 1;
        for (; s < e && !Eo(this.m_IntersectList[s]); )
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
      let s = vl(n, e);
      if (s) {
        let i = Po(n);
        s = i == null || !ke(i);
      }
      if (s) {
        this.StrictlySimple && this.InsertMaxima(n.top.x);
        let i = n.prevInAEL;
        this.DoMaxima(n), i == null ? n = this.m_ActiveEdges : n = i.nextInAEL;
      } else {
        if (To(n, e) && ke(n.nextInLML) ? (n = this.UpdateEdgeIntoAEL(n), n.outIdx >= 0 && this.AddOutPt(n, n.bot), this.AddEdgeToSEL(n)) : n.curr = new ft(Se(n, e), e), this.StrictlySimple) {
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
      if (To(n, e)) {
        let s = null;
        n.outIdx >= 0 && (s = this.AddOutPt(n, n.top)), n = this.UpdateEdgeIntoAEL(n);
        let i = n.prevInAEL, r = n.nextInAEL;
        if (i != null && i.curr.x.equals(n.bot.x) && i.curr.y.equals(n.bot.y) && s != null && i.outIdx >= 0 && i.curr.y.greaterThan(i.top.y) && Qn(n.curr, n.top, i.curr, i.top, this.m_UseFullRange) && n.windDelta != 0 && i.windDelta != 0) {
          let c = this.AddOutPt(i, n.bot);
          this.AddJoin(s, c, n.top);
        } else if (r != null && r.curr.x.equals(n.bot.x) && r.curr.y.equals(n.bot.y) && s != null && r.outIdx >= 0 && r.curr.y.greaterThan(r.top.y) && Qn(n.curr, n.top, r.curr, r.top, this.m_UseFullRange) && n.windDelta != 0 && r.windDelta != 0) {
          let c = this.AddOutPt(r, n.bot);
          this.AddJoin(s, c, n.top);
        }
      }
      n = n.nextInAEL;
    }
  }
  DoMaxima(e) {
    let n = Po(e);
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
      let s = n.pts.prev, i = Lo(s);
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
      let s = Lo(n.pts);
      if (n.isOpen && s < 2 || !n.isOpen && s < 3)
        continue;
      this.FixHoleLinkage(n);
      let i = new As();
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
      if (s.pt.equals(s.next.pt) || s.pt.equals(s.prev.pt) || Nn(s.prev.pt, s.pt, s.next.pt, this.m_UseFullRange) && (!i || !na(s.prev.pt, s.pt, s.next.pt)))
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
    let a = e.pt.x.greaterThan(n.pt.x) ? 0 : 1, h = s.pt.x.greaterThan(i.pt.x) ? 0 : 1;
    if (a == h)
      return !1;
    if (a == 1) {
      for (; e.next.pt.x.lessThanOrEqual(r.x) && e.next.pt.x.greaterThanOrEqual(e.pt.x) && e.next.pt.y.equals(r.y); )
        e = e.next;
      c && e.pt.x.notEquals(r.x) && (e = e.next), n = le(e, !c), n.pt.notEquals(r) && (e = n, e.pt = new ft(r.x, r.y), n = le(e, !c));
    } else {
      for (; e.next.pt.x.greaterThanOrEqual(r.x) && e.next.pt.x.lessThanOrEqual(e.pt.x) && e.next.pt.y.equals(r.y); )
        e = e.next;
      !c && e.pt.x.notEquals(r.x) && (e = e.next), n = le(e, c), n.pt.notEquals(r) && (e = n, e.pt = new ft(r.x, r.y), n = le(e, c));
    }
    if (h == 1) {
      for (; s.next.pt.x.lessThanOrEqual(r.x) && s.next.pt.x.greaterThanOrEqual(s.pt.x) && s.next.pt.y.equals(r.y); )
        s = s.next;
      c && s.pt.x.notEquals(r.x) && (s = s.next), i = le(s, !c), i.pt.notEquals(r) && (s = i, s.pt = new ft(r.x, r.y), i = le(s, !c));
    } else {
      for (; s.next.pt.x.greaterThanOrEqual(r.x) && s.next.pt.x.lessThanOrEqual(s.pt.x) && s.next.pt.y.equals(r.y); )
        s = s.next;
      !c && s.pt.x.notEquals(r.x) && (s = s.next), i = le(s, c), i.pt.notEquals(r) && (s = i, s.pt = new ft(r.x, r.y), i = le(s, c));
    }
    return a == 1 == c ? (e.prev = s, s.next = e, n.next = i, i.prev = n) : (e.next = s, s.prev = e, n.prev = i, i.next = n), !0;
  }
  JoinPoints(e, n, s) {
    let i = e.outPt1, r, c = e.outPt2, a, h = e.outPt1.pt.y.equals(e.offPt.y);
    if (h && e.offPt.equals(e.outPt1.pt) && e.offPt.equals(e.outPt2.pt)) {
      if (n != s)
        return !1;
      for (r = e.outPt1.next; r != i && r.pt.equals(e.offPt); )
        r = r.next;
      let l = r.pt.y.greaterThan(e.offPt.y);
      for (a = e.outPt2.next; a != c && a.pt.equals(e.offPt); )
        a = a.next;
      let u = a.pt.y.greaterThan(e.offPt.y);
      return l == u ? !1 : l ? (r = le(i, !1), a = le(c, !0), i.prev = c, c.next = i, r.next = a, a.prev = r, e.outPt1 = i, e.outPt2 = r, !0) : (r = le(i, !0), a = le(c, !1), i.next = c, c.prev = i, r.prev = a, a.next = r, e.outPt1 = i, e.outPt2 = r, !0);
    } else if (h) {
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
      let l = Tl(i.pt.x, r.pt.x, c.pt.x, a.pt.x);
      if (!l.r)
        return !1;
      let u = l.Left, f = l.Right, d, x;
      return i.pt.x.greaterThanOrEqual(u) && i.pt.x.lessThanOrEqual(f) ? (d = i.pt, x = i.pt.x.greaterThan(r.pt.x)) : c.pt.x.greaterThanOrEqual(u) && c.pt.x.lessThanOrEqual(f) ? (d = c.pt, x = c.pt.x.greaterThan(a.pt.x)) : r.pt.x.greaterThanOrEqual(u) && r.pt.x.lessThanOrEqual(f) ? (d = r.pt, x = r.pt.x.greaterThan(i.pt.x)) : (d = a.pt, x = a.pt.x.greaterThan(c.pt.x)), e.outPt1 = i, e.outPt2 = c, this.JoinHorz(i, r, c, a, d, x);
    } else {
      for (r = i.next; r.pt.equals(i.pt) && r != i; )
        r = r.next;
      let l = r.pt.y.greaterThan(i.pt.y) || !Nn(i.pt, r.pt, e.offPt, this.m_UseFullRange);
      if (l) {
        for (r = i.prev; r.pt.equals(i.pt) && r != i; )
          r = r.prev;
        if (r.pt.y.greaterThan(i.pt.y) || !Nn(i.pt, r.pt, e.offPt, this.m_UseFullRange))
          return !1;
      }
      for (a = c.next; a.pt.equals(c.pt) && a != c; )
        a = a.next;
      let u = a.pt.y.greaterThan(c.pt.y) || !Nn(c.pt, a.pt, e.offPt, this.m_UseFullRange);
      if (u) {
        for (a = c.prev; a.pt.equals(c.pt) && a != c; )
          a = a.prev;
        if (a.pt.y.greaterThan(c.pt.y) || !Nn(c.pt, a.pt, e.offPt, this.m_UseFullRange))
          return !1;
      }
      return r == i || a == c || r == a || n == s && l == u ? !1 : l ? (r = le(i, !1), a = le(c, !0), i.prev = c, c.next = i, r.next = a, a.prev = r, e.outPt1 = i, e.outPt2 = r, !0) : (r = le(i, !0), a = le(c, !1), i.next = c, c.prev = i, r.prev = a, a.next = r, e.outPt1 = i, e.outPt2 = r, !0);
    }
  }
  FixupFirstLefts1(e, n) {
    for (let s of this.m_PolyOuts) {
      let i = $i(s.firstLeft);
      s.pts != null && i == e && yn(s.pts, n.pts) && (s.firstLeft = n);
    }
  }
  FixupFirstLefts2(e, n) {
    let s = n.firstLeft;
    for (let i of this.m_PolyOuts) {
      if (i.pts == null || i == n || i == e)
        continue;
      let r = $i(i.firstLeft);
      r != s && r != e && r != n || (yn(i.pts, e.pts) ? i.firstLeft = e : yn(i.pts, n.pts) ? i.firstLeft = n : (i.firstLeft == e || i.firstLeft == n) && (i.firstLeft = s));
    }
  }
  FixupFirstLefts3(e, n) {
    for (let s of this.m_PolyOuts) {
      let i = $i(s.firstLeft);
      s.pts != null && i == e && (s.firstLeft = n);
    }
  }
  JoinCommonEdges() {
    for (let e of this.m_Joins) {
      let n = this.GetOutRec(e.outPt1.idx), s = this.GetOutRec(e.outPt2.idx);
      if (n.pts == null || s.pts == null || n.isOpen || s.isOpen)
        continue;
      let i;
      n == s ? i = n : ii(n, s) ? i = s : ii(s, n) ? i = n : i = Mo(n, s), this.JoinPoints(e, n, s) && (n == s ? (n.pts = e.outPt1, n.bottomPt = null, s = this.CreateOutRec(), s.pts = e.outPt2, Ao(s), yn(s.pts, n.pts) ? (s.isHole = !n.isHole, s.firstLeft = n, this.m_UsingPolyTree && this.FixupFirstLefts2(s, n), ji(s.isHole, this.ReverseSolution) == xi(s) > 0 && Kn(s.pts)) : yn(n.pts, s.pts) ? (s.isHole = n.isHole, n.isHole = !s.isHole, s.firstLeft = n.firstLeft, n.firstLeft = s, this.m_UsingPolyTree && this.FixupFirstLefts2(n, s), ji(n.isHole, this.ReverseSolution) == xi(n) > 0 && Kn(n.pts)) : (s.isHole = n.isHole, s.firstLeft = n.firstLeft, this.m_UsingPolyTree && this.FixupFirstLefts1(n, s))) : (s.pts = null, s.bottomPt = null, s.idx = n.idx, n.isHole = i.isHole, i == s && (n.firstLeft = s.firstLeft), s.firstLeft = n, this.m_UsingPolyTree && this.FixupFirstLefts3(s, n)));
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
              a.pts = i, Ao(a), yn(a.pts, n.pts) ? (a.isHole = !n.isHole, a.firstLeft = n, this.m_UsingPolyTree && this.FixupFirstLefts2(a, n)) : yn(n.pts, a.pts) ? (a.isHole = n.isHole, n.isHole = !a.isHole, a.firstLeft = n.firstLeft, n.firstLeft = a, this.m_UsingPolyTree && this.FixupFirstLefts2(n, a)) : (a.isHole = n.isHole, a.firstLeft = n.firstLeft, this.m_UsingPolyTree && this.FixupFirstLefts1(n, a)), i = s;
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
    for (let h = 0; h < s; ++h)
      r[h] = new Un();
    for (let h = 0; h < s; ++h)
      r[h].pt = new ft(e[h].x, e[h].y), r[h].next = r[(h + 1) % s], r[h].next.prev = r[h], r[h].idx = 0;
    let c = n * n, a = r[0];
    for (; a.idx == 0 && a.next != a.prev; )
      So(a.pt, a.prev.pt, c) ? (a = oi(a), s--) : So(a.prev.pt, a.next.pt, c) ? (oi(a.next), a = oi(a), s -= 2) : Sl(a.prev.pt, a.pt, a.next.pt, c) ? (a = oi(a), s--) : (a.idx = 1, a = a.next);
    s < 3 && (s = 0);
    for (let h = 0; h < s; ++h)
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
    let r = i ? 1 : 0, c = e.length, a = n.length, h = new Array();
    if (s)
      for (let u = 0; u < a; u++) {
        let f = new Array();
        for (let d of e)
          f.push(new ft(n[u].x.add(d.x), n[u].y.add(d.y)));
        h.push(f);
      }
    else
      for (let u = 0; u < a; u++) {
        let f = new Array();
        for (let d of e)
          f.push(new ft(n[u].x.sub(d.x), n[u].y.sub(d.y)));
        h.push(f);
      }
    let l = new Array();
    for (let u = 0; u < a - 1 + r; u++)
      for (let f = 0; f < c; f++) {
        let d = new Array(4);
        d[0] = h[u % a][f % c], d[1] = h[(u + 1) % a][f % c], d[2] = h[(u + 1) % a][(f + 1) % c], d[3] = h[u % a][(f + 1) % c], ms(d) || d.reverse(), l.push(d);
      }
    return l;
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
        let h = Kt.TranslatePath(n[c], e[0]);
        r.AddPath(h, 1, !0);
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
class ql {
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
  m_polyNodes = new As();
  ArcTolerance;
  MiterLimit;
  constructor(e = 2, n = ei) {
    this.MiterLimit = e, this.ArcTolerance = n, this.m_lowest.x = -1;
  }
  clear() {
    this.m_polyNodes.children.length = 0, this.m_lowest.x = -1;
  }
  AddPath(e, n, s) {
    let i = e.length - 1;
    if (i < 0)
      return;
    let r = new As();
    if (r.joinType = n, r.endType = s, s == 1 || s == 0)
      for (; i > 0 && e[0] == e[i]; )
        i--;
    r.polygon.push(e[0]);
    let c = 0, a = 0;
    for (let h = 1; h <= i; h++)
      r.polygon[c] != e[h] && (c++, r.polygon.push(e[h]), (e[h].y.greaterThan(r.polygon[a].y) || e[h].y.equals(r.polygon[a].y) && e[h].x.lessThan(r.polygon[a].x)) && (a = c));
    if (!(s == 0 && c < 2) && (this.m_polyNodes.addChild(r), s == 0))
      if (this.m_lowest.x < 0)
        this.m_lowest = { x: this.m_polyNodes.childCount - 1, y: a };
      else {
        let h = this.m_polyNodes.children[this.m_lowest.x].polygon[this.m_lowest.y];
        (r.polygon[a].y.greaterThan(h.y) || r.polygon[a].y.equals(h.y) && r.polygon[a].x.lessThan(h.x)) && (this.m_lowest = { x: this.m_polyNodes.childCount - 1, y: a });
      }
  }
  AddPaths(e, n, s) {
    for (let i of e)
      this.AddPath(i, n, s);
  }
  FixOrientations() {
    if (this.m_lowest.x >= 0 && !ms(this.m_polyNodes.children[this.m_lowest.x].polygon))
      for (let e = 0; e < this.m_polyNodes.childCount; e++) {
        let n = this.m_polyNodes.children[e];
        (n.endType == 0 || n.endType == 1 && ms(n.polygon)) && n.polygon.reverse();
      }
    else
      for (let e = 0; e < this.m_polyNodes.childCount; e++) {
        let n = this.m_polyNodes.children[e];
        n.endType == 1 && !ms(n.polygon) && n.polygon.reverse();
      }
  }
  DoOffset(e) {
    if (this.m_destPolys = new Array(), this.m_delta = e, pl(e)) {
      for (let i = 0; i < this.m_polyNodes.childCount; i++) {
        let r = this.m_polyNodes.children[i];
        r.endType == 0 && this.m_destPolys.push(r.polygon);
      }
      return;
    }
    this.MiterLimit > 2 ? this.m_miterLim = 2 / (this.MiterLimit * this.MiterLimit) : this.m_miterLim = 0.5;
    let n;
    this.ArcTolerance <= 0 ? n = ei : this.ArcTolerance > Math.abs(e) * ei ? n = Math.abs(e) * ei : n = this.ArcTolerance;
    let s = Math.PI / Math.acos(1 - n / Math.abs(e));
    this.m_sin = Math.sin(Yi / s), this.m_cos = Math.cos(Yi / s), this.m_StepsPerRad = s / Yi, e < 0 && (this.m_sin = -this.m_sin);
    for (let i = 0; i < this.m_polyNodes.childCount; i++) {
      let r = this.m_polyNodes.children[i];
      this.m_srcPoly = r.polygon;
      let c = this.m_srcPoly.length;
      if (!(c == 0 || e <= 0 && (c < 3 || r.endType != 0))) {
        if (this.m_destPoly = new Array(), c == 1) {
          if (r.joinType == 1) {
            let a = 1, h = 0;
            for (let l = 1; l <= s; l++) {
              this.m_destPoly.push(
                new ft(
                  this.m_srcPoly[0].x.add(ct.fromRoundNumber(a * e)),
                  this.m_srcPoly[0].y.add(ct.fromRoundNumber(h * e))
                )
              );
              let u = a;
              a = a * this.m_cos - this.m_sin * h, h = u * this.m_sin + h * this.m_cos;
            }
          } else {
            let a = -1, h = -1;
            for (let l = 0; l < 4; ++l)
              this.m_destPoly.push(
                new ft(
                  this.m_srcPoly[0].x.add(ct.fromRoundNumber(a * e)),
                  this.m_srcPoly[0].y.add(ct.fromRoundNumber(h * e))
                )
              ), a < 0 ? a = 1 : h < 0 ? h = 1 : a = -1;
          }
          this.m_destPolys.push(this.m_destPoly);
          continue;
        }
        this.m_normals.length = 0;
        for (let a = 0; a < c - 1; a++)
          this.m_normals.push(
            Io(this.m_srcPoly[a], this.m_srcPoly[a + 1])
          );
        if (r.endType == 1 || r.endType == 0 ? this.m_normals.push(
          Io(this.m_srcPoly[c - 1], this.m_srcPoly[0])
        ) : this.m_normals.push(
          new Re(this.m_normals[c - 2].x, this.m_normals[c - 2].y)
        ), r.endType == 0) {
          let a = c - 1;
          for (let h = 0; h < c; h++)
            a = this.OffsetPoint(h, a, r.joinType);
          this.m_destPolys.push(this.m_destPoly);
        } else if (r.endType == 1) {
          let a = c - 1;
          for (let l = 0; l < c; l++)
            a = this.OffsetPoint(l, a, r.joinType);
          this.m_destPolys.push(this.m_destPoly), this.m_destPoly = new Array();
          let h = this.m_normals[c - 1];
          for (let l = c - 1; l > 0; l--)
            this.m_normals[l] = new Re(-this.m_normals[l - 1].x, -this.m_normals[l - 1].y);
          this.m_normals[0] = new Re(-h.x, -h.y), a = 0;
          for (let l = c - 1; l >= 0; l--)
            a = this.OffsetPoint(l, a, r.joinType);
          this.m_destPolys.push(this.m_destPoly);
        } else {
          let a = 0;
          for (let l = 1; l < c - 1; ++l)
            a = this.OffsetPoint(l, a, r.joinType);
          let h;
          if (r.endType == 2) {
            let l = c - 1;
            h = new ft(
              this.m_srcPoly[l].x.add(ct.fromRoundNumber(this.m_normals[l].x * e)),
              this.m_srcPoly[l].y.add(ct.fromRoundNumber(this.m_normals[l].y * e))
            ), this.m_destPoly.push(h), h = new ft(
              this.m_srcPoly[l].x.sub(ct.fromRoundNumber(this.m_normals[l].x * e)),
              this.m_srcPoly[l].y.sub(ct.fromRoundNumber(this.m_normals[l].y * e))
            ), this.m_destPoly.push(h);
          } else {
            let l = c - 1;
            a = c - 2, this.m_sinA = 0, this.m_normals[l] = new Re(-this.m_normals[l].x, -this.m_normals[l].y), r.endType == 3 ? this.DoSquare(l, a) : this.DoRound(l, a);
          }
          for (let l = c - 1; l > 0; l--)
            this.m_normals[l] = new Re(-this.m_normals[l - 1].x, -this.m_normals[l - 1].y);
          this.m_normals[0] = new Re(-this.m_normals[1].x, -this.m_normals[1].y), a = c - 1;
          for (let l = a - 1; l > 0; --l)
            a = this.OffsetPoint(l, a, r.joinType);
          r.endType == 2 ? (h = new ft(
            this.m_srcPoly[0].x.sub(ct.fromRoundNumber(this.m_normals[0].x * e)),
            this.m_srcPoly[0].y.sub(ct.fromRoundNumber(this.m_normals[0].y * e))
          ), this.m_destPoly.push(h), h = new ft(
            this.m_srcPoly[0].x.add(ct.fromRoundNumber(this.m_normals[0].x * e)),
            this.m_srcPoly[0].y.add(ct.fromRoundNumber(this.m_normals[0].y * e))
          ), this.m_destPoly.push(h)) : (a = 1, this.m_sinA = 0, r.endType == 3 ? this.DoSquare(0, 1) : this.DoRound(0, 1)), this.m_destPolys.push(this.m_destPoly);
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
      let i = Kt.GetBounds(this.m_destPolys), r = new Array(4), c = ct.fromInt(10);
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
      let i = Kt.GetBounds(this.m_destPolys), r = new Array(4), c = ct.fromInt(10);
      if (r[0] = new ft(i.left.sub(c), i.bottom.add(c)), r[1] = new ft(i.right.add(c), i.bottom.add(c)), r[2] = new ft(i.right.add(c), i.top.sub(c)), r[3] = new ft(i.left.sub(c), i.top.sub(c)), s.AddPath(r, 0, !0), s.ReverseSolution = !0, s.ExecutePolyTree(
        1,
        e,
        3,
        3
        /* pftNegative */
      ), e.childCount == 1 && e.children[0].childCount > 0) {
        let a = e.children[0];
        e.children[0] = a.children[0], e.children[0].parent = e;
        for (let h = 1; h < a.childCount; h++)
          e.addChild(a.children[h]);
      } else
        e.clear();
    }
  }
  OffsetPoint(e, n, s) {
    if (this.m_sinA = this.m_normals[n].x * this.m_normals[e].y - this.m_normals[e].x * this.m_normals[n].y, Math.abs(this.m_sinA * this.m_delta) < 1) {
      if (this.m_normals[n].x * this.m_normals[e].x + this.m_normals[e].y * this.m_normals[n].y > 0)
        return this.m_destPoly.push(
          new ft(
            this.m_srcPoly[e].x.add(ct.fromRoundNumber(this.m_normals[n].x * this.m_delta)),
            this.m_srcPoly[e].y.add(ct.fromRoundNumber(this.m_normals[n].y * this.m_delta))
          )
        ), n;
    } else this.m_sinA > 1 ? this.m_sinA = 1 : this.m_sinA < -1 && (this.m_sinA = -1);
    if (this.m_sinA * this.m_delta < 0)
      this.m_destPoly.push(
        new ft(
          this.m_srcPoly[e].x.add(ct.fromRoundNumber(this.m_normals[n].x * this.m_delta)),
          this.m_srcPoly[e].y.add(ct.fromRoundNumber(this.m_normals[n].y * this.m_delta))
        )
      ), this.m_destPoly.push(this.m_srcPoly[e]), this.m_destPoly.push(
        new ft(
          this.m_srcPoly[e].x.add(ct.fromRoundNumber(this.m_normals[e].x * this.m_delta)),
          this.m_srcPoly[e].y.add(ct.fromRoundNumber(this.m_normals[e].y * this.m_delta))
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
        this.m_srcPoly[e].x.add(ct.fromRoundNumber(this.m_delta * (this.m_normals[n].x - this.m_normals[n].y * s))),
        this.m_srcPoly[e].y.add(ct.fromRoundNumber(this.m_delta * (this.m_normals[n].y - this.m_normals[n].x * s)))
      )
    ), this.m_destPoly.push(
      new ft(
        this.m_srcPoly[e].x.add(ct.fromRoundNumber(this.m_delta * (this.m_normals[e].x - this.m_normals[e].y * s))),
        this.m_srcPoly[e].y.add(ct.fromRoundNumber(this.m_delta * (this.m_normals[e].y - this.m_normals[e].x * s)))
      )
    );
  }
  DoMiter(e, n, s) {
    let i = this.m_delta / s;
    this.m_destPoly.push(
      new ft(
        this.m_srcPoly[e].x.add(ct.fromRoundNumber((this.m_normals[n].x + this.m_normals[e].x) * i)),
        this.m_srcPoly[e].y.add(ct.fromRoundNumber((this.m_normals[n].y + this.m_normals[e].y) * i))
      )
    );
  }
  DoRound(e, n) {
    let s = Math.atan2(
      this.m_sinA,
      this.m_normals[n].x * this.m_normals[e].x + this.m_normals[n].y * this.m_normals[e].y
    ), i = Math.max(Math.round(this.m_StepsPerRad * Math.abs(s)), 1), r = this.m_normals[n].x, c = this.m_normals[n].y, a;
    for (let h = 0; h < i; ++h)
      this.m_destPoly.push(
        new ft(
          this.m_srcPoly[e].x.add(ct.fromRoundNumber(r * this.m_delta)),
          this.m_srcPoly[e].y.add(ct.fromRoundNumber(c * this.m_delta))
        )
      ), a = r, r = r * this.m_cos - this.m_sin * c, c = a * this.m_sin + c * this.m_cos;
    this.m_destPoly.push(
      new ft(
        this.m_srcPoly[e].x.add(ct.fromRoundNumber(this.m_normals[e].x * this.m_delta)),
        this.m_srcPoly[e].y.add(ct.fromRoundNumber(this.m_normals[e].y * this.m_delta))
      )
    );
  }
}
const w1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ClipType: Gc,
  Clipper: Kt,
  ClipperOffset: ql,
  EndType: Kc,
  IntPoint: ft,
  IntRect: Ls,
  JoinType: Jc,
  Orientation: ms,
  PolyFillType: Qc,
  PolyNode: As,
  PolyTree: ta,
  PolyType: Zc
}, Symbol.toStringTag, { value: "Module" })), ts = {
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
}, Dl = /([astvzqmhlc])([^astvzqmhlc]*)/gi, Ol = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;
function kl(o) {
  const e = o.match(Ol);
  return e ? e.map(Number) : [];
}
function oa(o) {
  const e = [], n = String(o).trim();
  return n[0] !== "M" && n[0] !== "m" || n.replace(Dl, (s, i, r) => {
    const c = kl(r);
    let a = i.toLowerCase(), h = i;
    if (a === "m" && c.length > 2 && (e.push([h, ...c.splice(0, 2)]), a = "l", h = h === "m" ? "l" : "L"), c.length < ts[a])
      return "";
    for (e.push([h, ...c.splice(0, ts[a])]); c.length >= ts[a] && c.length && ts[a]; )
      e.push([h, ...c.splice(0, ts[a])]);
    return "";
  }), e;
}
function qo(o, e) {
  const n = o.x * Math.cos(e) - o.y * Math.sin(e), s = o.y * Math.cos(e) + o.x * Math.sin(e);
  o.x = n, o.y = s;
}
function Rl(o, e, n) {
  o.x += e, o.y += n;
}
function Do(o, e) {
  o.x *= e, o.y *= e;
}
let yi = class wr {
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
    this.#t = [], e && e instanceof wr ? this.#t.push(...e.#t) : typeof e == "string" && (this.#t = oa(e));
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
    e && e instanceof wr && this.#t.push(...e.#t);
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
  ellipse(e, n, s, i, r, c, a, h) {
    this.#t.push(["E", e, n, s, i, r, c, a, !!h]);
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
    let n = 0, s = 0, i, r, c, a, h, l, u, f, d, x, y, g, w, M, E, I, N, O, z, k, Y, H = null, $ = null, W = null, J = null, ot = null, K = null;
    e.beginPath();
    for (let j = 0; j < this.#t.length; ++j) {
      O = this.#t[j][0], O !== "S" && O !== "s" && O !== "C" && O !== "c" && (H = null, $ = null), O !== "T" && O !== "t" && O !== "Q" && O !== "q" && (W = null, J = null);
      let V;
      switch (O) {
        case "m":
        case "M":
          V = this.#t[j], O === "m" ? (n += V[1], s += V[2]) : (n = V[1], s = V[2]), (O === "M" || !ot) && (ot = { x: n, y: s }), e.moveTo(n, s);
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
          O === "a" ? (n += V[6], s += V[7]) : (n = V[6], s = V[7]), M = V[1], E = V[2], u = V[3] * Math.PI / 180, c = !!V[4], a = !!V[5], h = { x: n, y: s }, l = {
            x: (K.x - h.x) / 2,
            y: (K.y - h.y) / 2
          }, qo(l, -u), f = l.x * l.x / (M * M) + l.y * l.y / (E * E), f > 1 && (f = Math.sqrt(f), M *= f, E *= f), z = {
            x: M * l.y / E,
            y: -(E * l.x) / M
          }, d = M * M * E * E, x = M * M * l.y * l.y + E * E * l.x * l.x, a !== c ? Do(z, Math.sqrt((d - x) / x) || 0) : Do(z, -Math.sqrt((d - x) / x) || 0), r = Math.atan2((l.y - z.y) / E, (l.x - z.x) / M), i = Math.atan2(-(l.y + z.y) / E, -(l.x + z.x) / M), qo(z, u), Rl(z, (h.x + K.x) / 2, (h.y + K.y) / 2), e.save(), e.translate(z.x, z.y), e.rotate(u), e.scale(M, E), e.arc(0, 0, 1, r, i, !a), e.restore();
          break;
        case "C":
          V = this.#t[j], H = V[3], $ = V[4], n = V[5], s = V[6], e.bezierCurveTo(V[1], V[2], H, $, n, s);
          break;
        case "c":
          V = this.#t[j], e.bezierCurveTo(V[1] + n, V[2] + s, V[3] + n, V[4] + s, V[5] + n, V[6] + s), H = V[3] + n, $ = V[4] + s, n += V[5], s += V[6];
          break;
        case "S":
          V = this.#t[j], (H === null || $ === null) && (H = n, $ = s), e.bezierCurveTo(2 * n - H, 2 * s - $, V[1], V[2], V[3], V[4]), H = V[1], $ = V[2], n = V[3], s = V[4];
          break;
        case "s":
          V = this.#t[j], (H === null || $ === null) && (H = n, $ = s), e.bezierCurveTo(2 * n - H, 2 * s - $, V[1] + n, V[2] + s, V[3] + n, V[4] + s), H = V[1] + n, $ = V[2] + s, n += V[3], s += V[4];
          break;
        case "Q":
          V = this.#t[j], W = V[1], J = V[2], n = V[3], s = V[4], e.quadraticCurveTo(W, J, n, s);
          break;
        case "q":
          V = this.#t[j], W = V[1] + n, J = V[2] + s, n += V[3], s += V[4], e.quadraticCurveTo(W, J, n, s);
          break;
        case "T":
          V = this.#t[j], (W === null || J === null) && (W = n, J = s), W = 2 * n - W, J = 2 * s - J, n = V[1], s = V[2], e.quadraticCurveTo(W, J, n, s);
          break;
        case "t":
          V = this.#t[j], (W === null || J === null) && (W = n, J = s), W = 2 * n - W, J = 2 * s - J, n += V[1], s += V[2], e.quadraticCurveTo(W, J, n, s);
          break;
        case "z":
        case "Z":
          ot && (n = ot.x, s = ot.y), ot = null, e.closePath();
          break;
        case "AC":
          V = this.#t[j], n = V[1], s = V[2], w = V[3], r = V[4], i = V[5], k = V[6], e.arc(n, s, w, r, i, k);
          break;
        case "AT":
          V = this.#t[j], y = V[1], g = V[2], n = V[3], s = V[4], w = V[5], e.arcTo(y, g, n, s, w);
          break;
        case "E":
          V = this.#t[j], n = V[1], s = V[2], M = V[3], E = V[4], u = V[5], r = V[6], i = V[7], k = V[8], e.save(), e.translate(n, s), e.rotate(u), e.scale(M, E), e.arc(0, 0, 1, r, i, k), e.restore();
          break;
        case "R":
          V = this.#t[j], n = V[1], s = V[2], I = V[3], N = V[4], ot = { x: n, y: s }, e.rect(n, s, I, N);
          break;
        case "RR":
          V = this.#t[j], n = V[1], s = V[2], I = V[3], N = V[4], Y = V[5], ot = { x: n, y: s }, e.roundRect(n, s, I, N, Y);
          break;
        default:
          throw new Error(`Invalid path command: ${O}`);
      }
      K ? (K.x = n, K.y = s) : K = { x: n, y: s };
    }
  }
};
function Oo(o) {
  return o !== null && typeof o == "object" && ("x" in o || "y" in o) && (typeof o.x == "number" || typeof o.y == "number" || typeof o.x > "u" || typeof o.y > "u");
}
function zl(o) {
  return typeof o == "number" ? { x: o, y: o } : {
    x: typeof o.x == "number" ? o.x : 0,
    y: typeof o.y == "number" ? o.y : 0
  };
}
function Vr(o, e, n, s, i = 0) {
  if (typeof i == "number")
    i = [i];
  else if (Oo(i))
    i = [i];
  else if (!Array.isArray(i))
    return;
  if (Array.isArray(i)) {
    if (i.length === 0 || i.length > 4)
      throw new RangeError(
        `Failed to execute 'roundRect' on '${this.constructor.name}': ${i.length} radii provided. Between one and four radii are necessary.`
      );
    i.forEach((d) => {
      if (Oo(d)) {
        const x = d;
        if (typeof x.x == "number" && x.x < 0)
          throw new RangeError(
            `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${x.x} is negative.`
          );
        if (typeof x.y == "number" && x.y < 0)
          throw new RangeError(
            `Failed to execute 'roundRect' on '${this.constructor.name}': Radius value ${x.y} is negative.`
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
  const r = i.map(zl);
  if (i.length === 1 && r[0].x === 0 && r[0].y === 0) {
    this.rect(o, e, n, s);
    return;
  }
  const c = n / 2, a = s / 2, h = {
    x: Math.min(c, r[0].x),
    y: Math.min(a, r[0].y)
  };
  let l = h, u = h, f = h;
  r.length === 2 && (l = { x: Math.min(c, r[1].x), y: Math.min(a, r[1].y) }, f = l), r.length === 3 && (l = { x: Math.min(c, r[1].x), y: Math.min(a, r[1].y) }, f = l, u = { x: Math.min(c, r[2].x), y: Math.min(a, r[2].y) }), r.length === 4 && (l = { x: Math.min(c, r[1].x), y: Math.min(a, r[1].y) }, u = { x: Math.min(c, r[2].x), y: Math.min(a, r[2].y) }, f = { x: Math.min(c, r[3].x), y: Math.min(a, r[3].y) }), this.moveTo(o, e + s - f.y), h.x === h.y && h.x > 0 ? this.arcTo(o, e, o + h.x, e, h.x) : h.x > 0 || h.y > 0 ? this.ellipse(o + h.x, e + h.y, h.x, h.y, 0, Math.PI, Math.PI * 1.5, !1) : this.lineTo(o, e), this.lineTo(o + n - l.x, e), l.x === l.y && l.x > 0 ? this.arcTo(o + n, e, o + n, e + l.y, l.x) : l.x > 0 || l.y > 0 ? this.ellipse(o + n - l.x, e + l.y, l.x, l.y, 0, Math.PI * 1.5, 0, !1) : this.lineTo(o + n, e), this.lineTo(o + n, e + s - u.y), u.x === u.y && u.x > 0 ? this.arcTo(o + n, e + s, o + n - u.x, e + s, u.x) : u.x > 0 || u.y > 0 ? this.ellipse(o + n - u.x, e + s - u.y, u.x, u.y, 0, 0, Math.PI * 0.5, !1) : this.lineTo(o + n, e + s), this.lineTo(o + f.x, e + s), f.x === f.y && f.x > 0 ? this.arcTo(o, e + s, o, e + s - f.y, f.x) : f.x > 0 || f.y > 0 ? this.ellipse(o + f.x, e + s - f.y, f.x, f.y, 0, Math.PI * 0.5, Math.PI, !1) : this.lineTo(o, e + s), this.closePath(), this.moveTo(o, e);
}
function Nl(o) {
  if (!o) return;
  const e = o.prototype.clip, n = o.prototype.fill, s = o.prototype.stroke, i = o.prototype.isPointInPath;
  o.prototype.clip = function(...c) {
    if (c[0] instanceof yi) {
      const h = c[0], l = c[1] !== void 0 ? c[1] : "nonzero";
      h.buildPathInCanvas(this), e.apply(this, [l]);
      return;
    }
    const a = c[0] !== void 0 ? c[0] : "nonzero";
    e.apply(this, [a]);
  }, o.prototype.fill = function(...c) {
    if (c[0] instanceof yi) {
      const h = c[0], l = c[1] !== void 0 ? c[1] : "nonzero";
      h.buildPathInCanvas(this), n.apply(this, [l]);
      return;
    }
    const a = c[0] !== void 0 ? c[0] : "nonzero";
    n.apply(this, [a]);
  }, o.prototype.stroke = function(c) {
    c && c.buildPathInCanvas(this), s.apply(this);
  }, o.prototype.isPointInPath = function(...c) {
    if (c[0] instanceof yi) {
      const a = c[0], h = c[1], l = c[2], u = c[3] !== void 0 ? c[3] : "nonzero";
      return a.buildPathInCanvas(this), i.apply(this, [h, l, u]);
    }
    return i.apply(this, c);
  };
}
function Cl(o) {
  o && !o.prototype.roundRect && (o.prototype.roundRect = Vr);
}
function Fl(o) {
  o && !o.prototype.roundRect && (o.prototype.roundRect = Vr);
}
const v1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Path2D: yi,
  applyPath2DToCanvasRenderingContext: Nl,
  applyRoundRectToCanvasRenderingContext2D: Cl,
  applyRoundRectToPath2D: Fl,
  parsePath: oa,
  roundRect: Vr
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
    var c, a, h;
    nt.vertLeq(e, n) || (h = e, e = n, n = h), nt.vertLeq(s, i) || (h = s, s = i, i = h), nt.vertLeq(e, s) || (h = e, e = s, s = h, h = n, n = i, i = h), nt.vertLeq(s, n) ? nt.vertLeq(n, i) ? (c = nt.edgeEval(e, s, n), a = nt.edgeEval(s, n, i), c + a < 0 && (c = -c, a = -a), r.s = nt.interpolate(c, s.s, a, n.s)) : (c = nt.edgeSign(e, s, n), a = -nt.edgeSign(e, i, n), c + a < 0 && (c = -c, a = -a), r.s = nt.interpolate(c, s.s, a, i.s)) : r.s = (s.s + n.s) / 2, nt.transLeq(e, n) || (h = e, e = n, n = h), nt.transLeq(s, i) || (h = s, s = i, i = h), nt.transLeq(e, s) || (h = e, e = s, s = h, h = n, n = i, i = h), nt.transLeq(s, n) ? nt.transLeq(n, i) ? (c = nt.transEval(e, s, n), a = nt.transEval(s, n, i), c + a < 0 && (c = -c, a = -a), r.t = nt.interpolate(c, s.t, a, n.t)) : (c = nt.transSign(e, s, n), a = -nt.transSign(e, i, n), c + a < 0 && (c = -c, a = -a), r.t = nt.interpolate(c, s.t, a, i.t)) : r.t = (s.t + n.t) / 2;
  }
}
class es {
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
class ci {
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
class Cn {
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
class ko {
  vHead;
  /* dummy header for vertex list */
  fHead;
  /* dummy header for face list */
  eHead;
  /* dummy header for edge list */
  eHeadSym;
  /* and its symmetric counterpart */
  constructor() {
    const e = new Cn(), n = new es(), s = new ci(0), i = new ci(1);
    e.next = e.prev = e, e.anEdge = null, n.next = n.prev = n, s.next = s, s.Sym = i, i.next = i, i.Sym = s, this.vHead = e, this.fHead = n, this.eHead = s, this.eHeadSym = i;
  }
  /* MakeEdge creates a new pair of half-edges which form their own loop.
   * No vertex or face structures are allocated, but these must be assigned
   * before the current edge operation is completed.
   */
  //static TESShalfEdge *MakeEdge( TESSmesh* mesh, TESShalfEdge *eNext )
  makeEdge_(e) {
    var n = new ci(0), s = new ci(1);
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
    var e = new Cn(), n = new Cn(), s = new es(), i = this.makeEdge_(this.eHead);
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
        var r = new Cn();
        this.makeVertex_(r, n, e.Org), e.Org.anEdge = e;
      }
      if (!s) {
        var c = new es();
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
      var i = new es();
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
    var i = new Cn();
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
      var c = new es();
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
    var n, s, i, r, c, a, h;
    for (n = this.fHead.next; n !== this.fHead; n = n.next)
      if (n.inside)
        for (s = n.anEdge, c = s.Org; i = s.Lnext, r = s.Sym, r && r.Lface && r.Lface.inside && (a = this.countFaceVerts_(n), h = this.countFaceVerts_(r.Lface), a + h - 2 <= e && nt.vertCCW(
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
    var e = this.fHead, n = this.vHead, s = this.eHead, i, r, c, a, h, l;
    for (r = e, r = e; (i = r.next) !== e; r = i) {
      gt(i.prev === r), h = i.anEdge;
      do
        gt(h.Sym !== h), gt(h.Sym.Sym === h), gt(h.Lnext.Onext.Sym === h), gt(h.Onext.Sym.Lnext === h), gt(h.Lface === i), h = h.Lnext;
      while (h !== i.anEdge);
    }
    for (gt(i.prev === r && i.anEdge === null), a = n, a = n; (c = a.next) !== n; a = c) {
      gt(c.prev === a), h = c.anEdge;
      do
        gt(h.Sym !== h), gt(h.Sym.Sym === h), gt(h.Lnext.Onext.Sym === h), gt(h.Onext.Sym.Lnext === h), gt(h.Org === c), h = h.Onext;
      while (h !== c.anEdge);
    }
    for (gt(c.prev === a && c.anEdge === null), l = s, l = s; (h = l.next) !== s; l = h)
      gt(h.Sym.next === l.Sym), gt(h.Sym !== h), gt(h.Sym.Sym === h), gt(h.Org !== null), gt(h.Dst !== null), gt(h.Lnext.Onext.Sym === h), gt(h.Onext.Sym.Lnext === h);
    gt(
      h.Sym.next === l.Sym && h.Sym === this.eHeadSym && h.Sym.Sym === h && h.Org === null && h.Dst === null && h.Lface === null && h.Rface === null
    );
  }
}
class Ro {
  handle = null;
}
class zo {
  key = null;
  node = 0;
}
class Hl {
  constructor(e, n) {
    this.leq = n, this.max = e, this.nodes = [], this.handles = [];
    for (let s = 0; s < e + 1; s++)
      this.nodes[s] = new Ro(), this.handles[s] = new zo();
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
        this.nodes[i] = new Ro();
      for (r = this.handles.length, this.handles.length = this.max + 1, i = r; i < this.handles.length; i++)
        this.handles[i] = new zo();
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
class Gi {
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
class No {
  key = null;
  next = null;
  prev = null;
}
class Bl {
  constructor(e, n) {
    this.frame = e, this.leq = n, this.head.next = this.head, this.head.prev = this.head;
  }
  head = new No();
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
    const s = new No();
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
    const a = nt.edgeEval(r.Dst, i, r.Org), h = nt.edgeEval(c.Dst, i, c.Org);
    return a >= h;
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
    var i = new Gi();
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
    var a, h, l, u, f = !0;
    l = s;
    do
      gt(nt.vertLeq(l.Org, l.Dst)), tt.addRegionBelow(e, n, l.Sym), l = l.Onext;
    while (l !== i);
    for (r === null && (r = tt.regionBelow(n).eUp.Rprev), h = n, u = r; a = tt.regionBelow(h), l = a.eUp.Sym, l.Org === u.Org; )
      l.Onext !== u && (e.mesh.splice(l.Oprev, l), e.mesh.splice(u.Oprev, l)), a.windingNumber = h.windingNumber - l.winding, a.inside = tt.isWindingInside(e, a.windingNumber), h.dirty = !0, !f && tt.checkForRightSplice(e, h) && (tt.addWinding(l, u), tt.deleteRegion(e, h), e.mesh.delete(u)), f = !1, h = a, u = l;
    h.dirty = !0, gt(h.windingNumber - l.winding === a.windingNumber), c && tt.walkDirtyRegions(e, h);
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
    var s = tt.regionBelow(n), i = n.eUp, r = s.eUp, c = i.Org, a = r.Org, h = i.Dst, l = r.Dst, u, f, d = new Cn(), x, y;
    if (gt(!nt.vertEq(l, h)), gt(nt.edgeSign(h, e.event, c) <= 0), gt(nt.edgeSign(l, e.event, a) >= 0), gt(c !== e.event && a !== e.event), gt(!n.fixUpperEdge && !s.fixUpperEdge), c === a || (u = Math.min(c.t, h.t), f = Math.max(a.t, l.t), u > f)) return !1;
    if (nt.vertLeq(c, a)) {
      if (nt.edgeSign(l, c, a) > 0) return !1;
    } else if (nt.edgeSign(h, a, c) < 0) return !1;
    return nt.intersect(h, c, l, a, d), gt(Math.min(c.t, h.t) <= d.t), gt(d.t <= Math.max(a.t, l.t)), gt(Math.min(l.s, h.s) <= d.s), gt(d.s <= Math.max(a.s, c.s)), nt.vertLeq(d, e.event) && (d.s = e.event.s, d.t = e.event.t), x = nt.vertLeq(c, a) ? c : a, nt.vertLeq(x, d) && (d.s = x.s, d.t = x.t), nt.vertEq(d, c) || nt.vertEq(d, a) ? (tt.checkForRightSplice(e, n), !1) : !nt.vertEq(h, e.event) && nt.edgeSign(h, e.event, d) >= 0 || !nt.vertEq(l, e.event) && nt.edgeSign(l, e.event, d) <= 0 ? l === e.event ? (e.mesh.splitEdge(i.Sym), e.mesh.splice(r.Sym, i), n = tt.topLeftRegion(e, n), i = tt.regionBelow(n).eUp, tt.finishLeftRegions(e, tt.regionBelow(n), s), tt.addRightEdges(e, n, i.Oprev, i, i, !0), !0) : h === e.event ? (e.mesh.splitEdge(r.Sym), e.mesh.splice(i.Lnext, r.Oprev), s = n, n = tt.topRightRegion(n), y = tt.regionBelow(n).eUp.Rprev, s.eUp = r.Oprev, r = tt.finishLeftRegions(e, s, null), tt.addRightEdges(e, n, r.Onext, i.Rprev, y, !0), !0) : (nt.edgeSign(h, e.event, d) >= 0 && (tt.regionAbove(n).dirty = n.dirty = !0, e.mesh.splitEdge(i.Sym), i.Org.s = e.event.s, i.Org.t = e.event.t), nt.edgeSign(l, e.event, d) <= 0 && (n.dirty = s.dirty = !0, e.mesh.splitEdge(r.Sym), r.Org.s = e.event.s, r.Org.t = e.event.t), !1) : (e.mesh.splitEdge(i.Sym), e.mesh.splitEdge(r.Sym), e.mesh.splice(r.Oprev, i), i.Org.s = d.s, i.Org.t = d.t, i.Org.pqHandle = e.pq.insert(i.Org), tt.getIntersectData(e, i.Org, c, h, a, l), tt.regionAbove(n).dirty = n.dirty = s.dirty = !0, !1);
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
    var i, r = s.Onext, c = tt.regionBelow(n), a = n.eUp, h = c.eUp, l = !1;
    if (a.Dst !== h.Dst && tt.checkForIntersect(e, n), nt.vertEq(a.Org, e.event) && (e.mesh.splice(r.Oprev, a), n = tt.topLeftRegion(e, n), r = tt.regionBelow(n).eUp, tt.finishLeftRegions(e, tt.regionBelow(n), c), l = !0), nt.vertEq(h.Org, e.event) && (e.mesh.splice(s, h.Oprev), s = tt.finishLeftRegions(e, c, null), l = !0), l) {
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
    nt.vertLeq(h.Org, a.Org) ? i = h.Oprev : i = a, i = e.mesh.connect(s.Lprev, i), tt.addRightEdges(e, n, i, i.Onext, i.Onext, !1), i.Sym.activeRegion.fixUpperEdge = !0, tt.walkDirtyRegions(e, n);
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
    var i, r, c, a, h;
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
    ), n = tt.topRightRegion(n), h = tt.regionBelow(n), c = h.eUp.Sym, r = a = c.Onext, h.fixUpperEdge && (gt(r !== c), tt.deleteRegion(e, h), e.mesh.delete(c), c = r.Oprev), e.mesh.splice(s.anEdge, c), nt.edgeGoesLeft(r) || (r = null), tt.addRightEdges(
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
    var s, i, r, c, a, h, l = new Gi();
    if (l.eUp = n.anEdge.Sym, s = e.dict.search(l).key, i = tt.regionBelow(s), !!i) {
      if (c = s.eUp, a = i.eUp, nt.edgeSign(c.Dst, n, c.Org) === 0) {
        tt.connectLeftDegenerate(e, s, n);
        return;
      }
      if (r = nt.vertLeq(a.Dst, c.Dst) ? s : i, s.inside || r.fixUpperEdge) {
        if (r === s)
          h = e.mesh.connect(n.anEdge.Sym, c.Lnext);
        else {
          var u = e.mesh.connect(a.Dnext, n.anEdge);
          h = u.Sym;
        }
        r.fixUpperEdge ? tt.fixUpperEdge(e, r, h) : tt.computeWinding(
          e,
          tt.addRegionBelow(e, s, h)
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
    var r = new Gi(), c = e.mesh.makeEdge();
    c.Org.s = s, c.Org.t = i, c.Dst.s = n, c.Dst.t = i, e.event = c.Dst, r.eUp = c, r.windingNumber = 0, r.inside = !1, r.fixUpperEdge = !1, r.sentinel = !0, r.dirty = !1, r.nodeUp = e.dict.insert(r);
  }
  //static void InitEdgeDict( TESStesselator *tess )
  static initEdgeDict(e) {
    e.dict = new Bl(e, tt.edgeLeq);
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
    for (r += 8, n = e.pq = new Hl(r, nt.vertLeq), i = e.mesh.vHead, s = i.next; s !== i; s = s.next)
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
class ca {
  /*** state needed for collecting the input data ***/
  /* stores the input contours, and eventually the tessellation itself */
  mesh = new ko();
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
    let n, s, i, r, c, a, h = [0, 0, 0], l = [0, 0, 0], u = [0, 0, 0], f = [0, 0, 0], d = [0, 0, 0];
    const x = [null, null, null], y = [null, null, null], g = this.mesh.vHead;
    n = g.next;
    for (let M = 0; M < 3; ++M)
      r = n.coords[M], l[M] = r, y[M] = n, h[M] = r, x[M] = n;
    for (n = g.next; n !== g; n = n.next)
      for (let M = 0; M < 3; ++M)
        r = n.coords[M], r < l[M] && (l[M] = r, y[M] = n), r > h[M] && (h[M] = r, x[M] = n);
    let w = 0;
    if (h[1] - l[1] > h[0] - l[0] && (w = 1), h[2] - l[2] > h[w] - l[w] && (w = 2), l[w] >= h[w]) {
      e[0] = 0, e[1] = 0, e[2] = 1;
      return;
    }
    for (a = 0, s = y[w], i = x[w], u[0] = s.coords[0] - i.coords[0], u[1] = s.coords[1] - i.coords[1], u[2] = s.coords[2] - i.coords[2], n = g.next; n !== g; n = n.next)
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
    for (let h = e.next; h !== e; h = h.next)
      h.s = this.dot_(h.coords, s), h.t = this.dot_(h.coords, i);
    r && this.checkOrientation_();
    let a = !0;
    for (let h = e.next; h !== e; h = h.next)
      a ? (this.bmin[0] = this.bmax[0] = h.s, this.bmin[1] = this.bmax[1] = h.t, a = !1) : (h.s < this.bmin[0] && (this.bmin[0] = h.s), h.s > this.bmax[0] && (this.bmax[0] = h.s), h.t < this.bmin[1] && (this.bmin[1] = h.t), h.t > this.bmax[1] && (this.bmax[1] = h.t));
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
    let r, c = 0, a = 0, h;
    s > 3 && e.mergeConvexFaces(s);
    for (let f = e.vHead.next; f !== e.vHead; f = f.next)
      f.n = -1;
    for (let f = e.fHead.next; f !== e.fHead; f = f.next)
      if (f.n = -1, !!f.inside) {
        r = f.anEdge, h = 0;
        do {
          let d = r.Org;
          d.n === -1 && (d.n = a, a++), h++, r = r.Lnext;
        } while (r !== f.anEdge);
        if (h > s)
          throw "Face vertex greater that support polygon";
        f.n = c, ++c;
      }
    this.elementCount = c, n === ze.CONNECTED_POLYGONS && (c *= 2), this.elements = [], this.elements.length = c * s, this.vertexCount = a, this.vertices = [], this.vertices.length = a * i, this.vertexIndices = [], this.vertexIndices.length = a;
    for (let f = e.vHead.next; f !== e.vHead; f = f.next)
      if (f.n !== -1) {
        var l = f.n * i;
        this.vertices[l + 0] = f.coords[0], this.vertices[l + 1] = f.coords[1], i > 2 && (this.vertices[l + 2] = f.coords[2]), this.vertexIndices[f.n] = f.idx;
      }
    let u = 0;
    for (let f = e.fHead.next; f !== e.fHead; f = f.next)
      if (f.inside) {
        r = f.anEdge, h = 0;
        do {
          let d = r.Org;
          this.elements[u++] = d.n, h++, r = r.Lnext;
        } while (r !== f.anEdge);
        for (let d = h; d < s; ++d)
          this.elements[u++] = -1;
        if (n === ze.CONNECTED_POLYGONS) {
          r = f.anEdge;
          do
            this.elements[u++] = this.getNeighbourFace_(r), r = r.Lnext;
          while (r !== f.anEdge);
          for (let d = h; d < s; ++d)
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
    let a = 0, h = 0, l = 0;
    r = 0;
    for (let u = e.fHead.next; u !== e.fHead; u = u.next)
      if (u.inside) {
        c = 0, i = s = u.anEdge;
        do
          this.vertices[a++] = s.Org.coords[0], this.vertices[a++] = s.Org.coords[1], n > 2 && (this.vertices[a++] = s.Org.coords[2]), this.vertexIndices[h++] = s.Org.idx, c++, s = s.Lnext;
        while (s !== i);
        this.elements[l++] = r, this.elements[l++] = c, r += c;
      }
  }
  addContour(e, n) {
    this.mesh === null && (this.mesh = new ko()), e < 2 && (e = 2), e > 3 && (e = 3);
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
function Yl({
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
  const h = new ca();
  for (let l = 0; l < r.length; l++)
    h.addContour(s || 2, r[l]);
  return h.tesselate(
    o,
    e,
    n,
    s,
    i,
    c
  ), {
    vertices: h.vertices,
    vertexIndices: h.vertexIndices,
    vertexCount: h.vertexCount,
    elements: h.elements,
    elementCount: h.elementCount,
    mesh: a ? h.mesh : void 0
  };
}
const Vl = me.ODD, Ul = me.NONZERO, Xl = me.POSITIVE, Wl = me.NEGATIVE, $l = me.ABS_GEQ_TWO, jl = ze.POLYGONS, Gl = ze.CONNECTED_POLYGONS, Zl = ze.BOUNDARY_CONTOURS, M1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BOUNDARY_CONTOURS: Zl,
  CONNECTED_POLYGONS: Gl,
  ELEMENT: ze,
  POLYGONS: jl,
  Tesselator: ca,
  WINDING: me,
  WINDING_ABS_GEQ_TWO: $l,
  WINDING_NEGATIVE: Wl,
  WINDING_NONZERO: Ul,
  WINDING_ODD: Vl,
  WINDING_POSITIVE: Xl,
  tesselate: Yl
}, Symbol.toStringTag, { value: "Module" })), Ss = /* @__PURE__ */ new Set();
let vr = !1;
function Jl(o, e, n = 2) {
  const s = e && e.length, i = s ? e[0] * n : o.length;
  Ss.size && Ss.clear();
  let r = aa(o, 0, i, n, !0);
  const c = [];
  if (!r || r.next === r.prev) return c;
  let a = 0, h = 0, l = 0;
  if (s && (r = nu(o, e, r, n)), o.length > 80 * n) {
    a = o[0], h = o[1];
    let u = a, f = h;
    for (let d = n; d < i; d += n) {
      const x = o[d], y = o[d + 1];
      x < a && (a = x), y < h && (h = y), x > u && (u = x), y > f && (f = y);
    }
    l = Math.max(u - a, f - h), l = l !== 0 ? 32767 / l : 0;
  }
  return Mr(r, c, a, h, l), c;
}
function aa(o, e, n, s, i) {
  let r = null;
  if (i === Lr(o, e, n, s) > 0)
    for (let c = e; c < n; c += s) r = Ho(c / s | 0, o[c], o[c + 1], r);
  else
    for (let c = n - s; c >= e; c -= s) r = Ho(c / s | 0, o[c], o[c + 1], r);
  return r && Is(r, r.next) && (Ds(r), r = r.next), r;
}
function En(o, e = o) {
  const n = e === o;
  let s = o, i;
  do
    i = !1, s !== s.next && (Ss.size === 0 || !Ss.has(s)) && (Is(s, s.next) || Gt(s.prev, s, s.next) === 0) ? ((n || s === e) && (e = s.prev), vr = !0, Ds(s), s = s.prev, i = !0) : (n || s !== e) && (s = s.next, i = !n);
  while (i || s !== e);
  return e;
}
function Mr(o, e, n, s, i) {
  i && hu(o, n, s, i);
  let r = o, c = !1;
  for (; o.prev !== o.next; ) {
    const a = o.prev, h = o.next;
    if (Gt(a, o, h) < 0 && (i ? Kl(o, n, s, i) : Ql(o))) {
      e.push(a.i, o.i, h.i), Ds(o), o = h, r = h;
      continue;
    }
    if (o = h, o === r) {
      if (vr = !1, o = En(o), vr) {
        r = o;
        continue;
      }
      if (!c) {
        o = tu(o, e), r = o, c = !0;
        continue;
      }
      eu(o, e, n, s, i);
      break;
    }
  }
}
function Ql(o) {
  const e = o.prev, n = o, s = o.next, i = e.x, r = n.x, c = s.x, a = e.y, h = n.y, l = s.y, u = Math.min(i, r, c), f = Math.min(a, h, l), d = Math.max(i, r, c), x = Math.max(a, h, l);
  let y = s.next;
  for (; y !== e; ) {
    if (y.x >= u && y.x <= d && y.y >= f && y.y <= x && !(i === y.x && a === y.y) && Pi(i, a, r, h, c, l, y.x, y.y) && Gt(y.prev, y, y.next) >= 0) return !1;
    y = y.next;
  }
  return !0;
}
function Kl(o, e, n, s) {
  const i = o.prev, r = o, c = o.next, a = i.x, h = r.x, l = c.x, u = i.y, f = r.y, d = c.y, x = Math.min(a, h, l), y = Math.min(u, f, d), g = Math.max(a, h, l), w = Math.max(u, f, d), M = Pr(x, y, e, n, s), E = Pr(g, w, e, n, s);
  let I = o.prevZ;
  for (; I && I.z >= M; ) {
    if (I.x >= x && I.x <= g && I.y >= y && I.y <= w && I !== c && !(a === I.x && u === I.y) && Pi(a, u, h, f, l, d, I.x, I.y) && Gt(I.prev, I, I.next) >= 0) return !1;
    I = I.prevZ;
  }
  let N = o.nextZ;
  for (; N && N.z <= E; ) {
    if (N.x >= x && N.x <= g && N.y >= y && N.y <= w && N !== c && !(a === N.x && u === N.y) && Pi(a, u, h, f, l, d, N.x, N.y) && Gt(N.prev, N, N.next) >= 0) return !1;
    N = N.nextZ;
  }
  return !0;
}
function tu(o, e) {
  let n = o, s = !1;
  do {
    const i = n.prev, r = n.next.next;
    ua(i, n, n.next, r, !1) && qs(i, r) && qs(r, i) && (e.push(i.i, n.i, r.i), Ds(n), Ds(n.next), n = o = r, s = !0), n = n.next;
  } while (n !== o);
  return s ? En(n) : n;
}
function eu(o, e, n, s, i) {
  let r = o;
  do {
    let c = r.next.next;
    for (; c !== r.prev; ) {
      if (r.i !== c.i && fu(r, c)) {
        let a = fa(r, c);
        r = En(r, r.next), a = En(a, a.next), Mr(r, e, n, s, i), Mr(a, e, n, s, i);
        return;
      }
      c = c.next;
    }
    r = r.next;
  } while (r !== o);
}
let br = !1;
function nu(o, e, n, s) {
  const i = [];
  for (let r = 0, c = e.length; r < c; r++) {
    const a = e[r] * s, h = r < c - 1 ? e[r + 1] * s : o.length, l = aa(o, a, h, s, !1);
    l === l.next && Ss.add(l), i.push(uu(l));
  }
  i.sort(su), ru(o.length / s, e.length), la(n, n), br = !0;
  for (let r = 0; r < i.length; r++)
    n = iu(i[r], n);
  return br = !1, En(n);
}
function su(o, e) {
  return o.x - e.x || o.y - e.y || (o.next.y - o.y) / (o.next.x - o.x) - (e.next.y - e.y) / (e.next.x - e.x);
}
function iu(o, e) {
  const n = cu(o, e);
  if (!n)
    return e;
  const s = fa(n, o), i = s.next;
  return la(n, i.next), En(s, s.next), En(n, n.next);
}
const ha = 16;
let Yt = new Float64Array(0), Ti = 0;
const _r = [], Tr = [];
function ru(o, e) {
  const n = Math.ceil((o + 2 * e) / ha) + e + 2;
  Yt.length < n * 4 && (Yt = new Float64Array(n * 4)), Ti = 0;
}
function la(o, e) {
  let n = o;
  do {
    const s = Ti++;
    _r[s] = n;
    let i = 1 / 0, r = 1 / 0, c = -1 / 0, a = -1 / 0, h = 0;
    do {
      const u = n.next;
      n.z = s, n.x < i && (i = n.x), n.x > c && (c = n.x), n.y < r && (r = n.y), n.y > a && (a = n.y), u.x < i && (i = u.x), u.x > c && (c = u.x), u.y < r && (r = u.y), u.y > a && (a = u.y), n = u;
    } while (++h < ha && n !== e);
    Tr[s] = n;
    const l = s * 4;
    Yt[l] = i, Yt[l + 1] = r, Yt[l + 2] = c, Yt[l + 3] = a;
  } while (n !== e);
}
function ou(o, e) {
  const n = o.z * 4;
  e.x < Yt[n] && (Yt[n] = e.x), e.y < Yt[n + 1] && (Yt[n + 1] = e.y), e.x > Yt[n + 2] && (Yt[n + 2] = e.x), e.y > Yt[n + 3] && (Yt[n + 3] = e.y);
}
function Co(o) {
  let e = Tr[o];
  for (; e.prev.next !== e; ) e = e.next;
  return Tr[o] = e, e;
}
function Fo(o) {
  let e = _r[o];
  for (; e.prev.next !== e; ) e = e.next;
  return _r[o] = e, e;
}
function cu(o, e) {
  let n = e;
  const s = o.x, i = o.y;
  let r = -1 / 0, c;
  if (Is(o, n)) return n;
  for (let d = 0, x = 0; d < Ti; d++, x += 4) {
    if (i < Yt[x + 1] || i > Yt[x + 3] || Yt[x] > s || Yt[x + 2] <= r) continue;
    const y = Co(d);
    n = Fo(d);
    do {
      if (n.prev.next === n) {
        if (Is(o, n.next)) return n.next;
        if (i <= n.y && i >= n.next.y && n.next.y !== n.y) {
          const g = n.x + (i - n.y) * (n.next.x - n.x) / (n.next.y - n.y);
          if (g <= s && g > r && (r = g, c = n.x < n.next.x ? n : n.next, g === s))
            return c;
        }
      }
      n = n.next;
    } while (n !== y);
  }
  if (!c) return null;
  const a = c.x, h = c.y, l = Math.min(i, h), u = Math.max(i, h);
  let f = 1 / 0;
  for (let d = 0, x = 0; d < Ti; d++, x += 4) {
    if (Yt[x + 2] < a || Yt[x] > s || Yt[x + 3] < l || Yt[x + 1] > u) continue;
    const y = Co(d);
    n = Fo(d);
    do {
      if (n.prev.next === n && s >= n.x && n.x >= a && s !== n.x && Pi(i < h ? s : r, i, a, h, i < h ? r : s, i, n.x, n.y)) {
        const g = Math.abs(i - n.y) / (s - n.x);
        (qs(n, o) || n.y === i && n.next.y === i && n.next.x > s) && (g < f || g === f && (n.x > c.x || n.x === c.x && au(c, n))) && (c = n, f = g);
      }
      n = n.next;
    } while (n !== y);
  }
  return c;
}
function au(o, e) {
  return Gt(o.prev, o, e.prev) < 0 && Gt(e.next, o, o.next) < 0;
}
const Ee = [];
let ns = [], pn = new Uint32Array(0), ss = new Uint32Array(0);
const is = new Uint32Array(256);
function hu(o, e, n, s) {
  let i = o, r = 0;
  do
    i.z = Pr(i.x, i.y, e, n, s), Ee[r++] = i, i = i.next;
  while (i !== o);
  lu(r);
  let c = null;
  for (let a = 0; a < r; a++) {
    const h = Ee[a];
    h.prevZ = c, c && (c.nextZ = h), c = h;
  }
  c.nextZ = null;
}
function lu(o) {
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
  pn.length < o && (pn = new Uint32Array(o), ss = new Uint32Array(o), ns = new Array(o));
  for (let e = 0; e < o; e++) pn[e] = Ee[e].z;
  ai(o, Ee, pn, ns, ss, 0), ai(o, ns, ss, Ee, pn, 8), ai(o, Ee, pn, ns, ss, 16), ai(o, ns, ss, Ee, pn, 24);
}
function ai(o, e, n, s, i, r) {
  is.fill(0);
  for (let a = 0; a < o; a++) is[n[a] >>> r & 255]++;
  let c = 0;
  for (let a = 0; a < 256; a++) {
    const h = is[a];
    is[a] = c, c += h;
  }
  for (let a = 0; a < o; a++) {
    const h = n[a], l = is[h >>> r & 255]++;
    s[l] = e[a], i[l] = h;
  }
}
function Pr(o, e, n, s, i) {
  return o = (o - n) * i | 0, e = (e - s) * i | 0, o = (o | o << 8) & 16711935, o = (o | o << 4) & 252645135, o = (o | o << 2) & 858993459, o = (o | o << 1) & 1431655765, e = (e | e << 8) & 16711935, e = (e | e << 4) & 252645135, e = (e | e << 2) & 858993459, e = (e | e << 1) & 1431655765, o | e << 1;
}
function uu(o) {
  let e = o, n = o;
  do
    (e.x < n.x || e.x === n.x && e.y < n.y) && (n = e), e = e.next;
  while (e !== o);
  return n;
}
function Pi(o, e, n, s, i, r, c, a) {
  return (i - c) * (e - a) >= (o - c) * (r - a) && (o - c) * (s - a) >= (n - c) * (e - a) && (n - c) * (r - a) >= (i - c) * (s - a);
}
function fu(o, e) {
  const n = Is(o, e) && Gt(o.prev, o, o.next) > 0 && Gt(e.prev, e, e.next) > 0;
  return o.next.i !== e.i && (n || qs(o, e) && qs(e, o) && (Gt(o.prev, o, e.prev) !== 0 || Gt(o, e.prev, e) !== 0)) && !du(o, e) && (n || xu(o, e));
}
function Gt(o, e, n) {
  return (e.y - o.y) * (n.x - e.x) - (e.x - o.x) * (n.y - e.y);
}
function Is(o, e) {
  return o.x === e.x && o.y === e.y;
}
function ua(o, e, n, s, i = !0) {
  const r = Gt(o, e, n), c = Gt(o, e, s), a = Gt(n, s, o), h = Gt(n, s, e);
  return (r > 0 && c < 0 || r < 0 && c > 0) && (a > 0 && h < 0 || a < 0 && h > 0) ? !0 : i ? !!(r === 0 && hi(o, n, e) || c === 0 && hi(o, s, e) || a === 0 && hi(n, o, s) || h === 0 && hi(n, e, s)) : !1;
}
function hi(o, e, n) {
  return e.x <= Math.max(o.x, n.x) && e.x >= Math.min(o.x, n.x) && e.y <= Math.max(o.y, n.y) && e.y >= Math.min(o.y, n.y);
}
function du(o, e) {
  const n = Math.min(o.x, e.x), s = Math.max(o.x, e.x), i = Math.min(o.y, e.y), r = Math.max(o.y, e.y);
  let c = o;
  do {
    const a = c.next;
    if (c.x > s && a.x > s || c.x < n && a.x < n || c.y > r && a.y > r || c.y < i && a.y < i) {
      c = a;
      continue;
    }
    if (c.i !== o.i && a.i !== o.i && c.i !== e.i && a.i !== e.i && ua(c, a, o, e)) return !0;
    c = a;
  } while (c !== o);
  return !1;
}
function qs(o, e) {
  return Gt(o.prev, o, o.next) < 0 ? Gt(o, e, o.next) >= 0 && Gt(o, o.prev, e) >= 0 : Gt(o, e, o.prev) < 0 || Gt(o, o.next, e) < 0;
}
function xu(o, e) {
  let n = o, s = !1;
  const i = (o.x + e.x) / 2, r = (o.y + e.y) / 2;
  do {
    const c = n.next;
    n.y > r != c.y > r && i < (c.x - n.x) * (r - n.y) / (c.y - n.y) + n.x && (s = !s), n = c;
  } while (n !== o);
  return s;
}
function fa(o, e) {
  const n = Er(o.i, o.x, o.y), s = Er(e.i, e.x, e.y), i = o.next, r = e.prev;
  return o.next = e, e.prev = o, n.next = i, i.prev = n, s.next = n, n.prev = s, r.next = s, s.prev = r, s;
}
function Ho(o, e, n, s) {
  const i = Er(o, e, n);
  return s ? (i.next = s.next, i.prev = s, s.next.prev = i, s.next = i) : (i.prev = i, i.next = i), i;
}
function Ds(o) {
  o.next.prev = o.prev, o.prev.next = o.next, o.prevZ && (o.prevZ.nextZ = o.nextZ), o.nextZ && (o.nextZ.prevZ = o.prevZ), br && ou(o.prev, o.next);
}
function Er(o, e, n) {
  return { i: o, x: e, y: n, prev: null, next: null, z: 0, prevZ: null, nextZ: null };
}
function yu(o, e, n, s) {
  const i = e && e.length, r = i ? e[0] * n : o.length;
  let c = Math.abs(Lr(o, 0, r, n));
  if (i)
    for (let h = 0, l = e.length; h < l; h++) {
      const u = e[h] * n, f = h < l - 1 ? e[h + 1] * n : o.length;
      c -= Math.abs(Lr(o, u, f, n));
    }
  let a = 0;
  for (let h = 0; h < s.length; h += 3) {
    const l = s[h] * n, u = s[h + 1] * n, f = s[h + 2] * n;
    a += Math.abs(
      (o[l] - o[f]) * (o[u + 1] - o[l + 1]) - (o[l] - o[u]) * (o[f + 1] - o[l + 1])
    );
  }
  return c === 0 && a === 0 ? 0 : Math.abs((a - c) / c);
}
function Lr(o, e, n, s) {
  let i = 0;
  for (let r = e, c = n - s; r < n; r += s)
    i += (o[c] - o[r]) * (o[r + 1] + o[c + 1]), c = r;
  return i;
}
function pu(o) {
  const e = [], n = [], s = o[0][0].length;
  let i = 0, r = 0;
  for (const c of o) {
    for (const a of c)
      for (let h = 0; h < s; h++) e.push(a[h]);
    r && (i += r, n.push(i)), r = c.length;
  }
  return { vertices: e, holes: n, dimensions: s };
}
let Ge, ne, Xn, pi, Te, Ar = 0, li = 0;
function mu(o, e, n = 2) {
  const s = o, i = s.length;
  if (i < 6) return;
  wu(i), li++, ne.fill(-1, 0, i);
  let r = 0;
  for (let c = 0; c < i; c++) {
    const a = s[c], h = s[Yo(c)], l = a < h ? a : h, u = a < h ? h : a;
    let f = (Math.imul(l, 2654435761) ^ Math.imul(u, 2246822507)) & Ar;
    for (; pi[f] === li; ) {
      const d = Xn[f];
      if (d !== -1) {
        const x = s[d], y = s[Yo(d)];
        if (x === l && y === u || x === u && y === l) {
          ne[c] = d, ne[d] = c, Xn[f] = -1, Te[d] = 1, Ge[r++] = d;
          break;
        }
      }
      f = f + 1 & Ar;
    }
    pi[f] !== li && (Xn[f] = c, pi[f] = li);
  }
  for (; r > 0; ) {
    const c = Ge[--r];
    Te[c] = 0;
    const a = ne[c];
    if (a === -1) continue;
    const h = c - c % 3, l = a - a % 3, u = h + (c + 2) % 3, f = h + (c + 1) % 3, d = l + (a + 2) % 3, x = l + (a + 1) % 3, y = s[u], g = s[c], w = s[f], M = s[d], E = e[y * n], I = e[y * n + 1], N = e[g * n], O = e[g * n + 1], z = e[w * n], k = e[w * n + 1], Y = e[M * n], H = e[M * n + 1];
    if (!gu(E, I, N, O, z, k, Y, H) && Bo(E, I, N, O, Y, H) > 0 && Bo(E, I, Y, H, z, k) > 0) {
      s[c] = M, s[a] = y;
      const $ = ne[d], W = ne[u];
      ne[c] = $, $ !== -1 && (ne[$] = c), ne[a] = W, W !== -1 && (ne[W] = a), ne[u] = d, ne[d] = u, $ !== -1 && Te[c] === 0 && (Te[c] = 1, Ge[r++] = c), W !== -1 && Te[a] === 0 && (Te[a] = 1, Ge[r++] = a), ne[f] !== -1 && Te[f] === 0 && (Te[f] = 1, Ge[r++] = f), ne[x] !== -1 && Te[x] === 0 && (Te[x] = 1, Ge[r++] = x);
    }
  }
}
function Bo(o, e, n, s, i, r) {
  return (n - o) * (r - e) - (s - e) * (i - o);
}
function gu(o, e, n, s, i, r, c, a) {
  const h = o - c, l = e - a, u = n - c, f = s - a, d = i - c, x = r - a, y = h * h + l * l, g = u * u + f * f, w = d * d + x * x, M = y + g + w;
  return h * (f * w - g * x) - l * (u * w - g * d) + y * (u * x - f * d) <= 1e-13 * M * M;
}
function Yo(o) {
  return o - o % 3 + (o + 1) % 3;
}
function wu(o) {
  (!Ge || Ge.length < o) && (Ge = new Int32Array(o)), (!ne || ne.length < o) && (ne = new Int32Array(o)), (!Te || Te.length < o) && (Te = new Uint8Array(o));
  let e = 1;
  for (; e < o * 4; ) e <<= 1;
  (!Xn || Xn.length < e) && (Xn = new Int32Array(e), pi = new Uint32Array(e)), Ar = e - 1;
}
const b1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Jl,
  deviation: yu,
  flatten: pu,
  refine: mu
}, Symbol.toStringTag, { value: "Module" })), vu = 1e-9;
class en {
  /** 点是否在边界上（epsilon 容差，无宽度） */
  isPointOnBoundary(e, n, s = vu) {
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
function _1(o, e, n, s, i, r) {
  const c = i - n, a = r - s, h = o - n, l = e - s, u = c * c + a * a;
  let f = u > 0 ? (h * c + l * a) / u : 0;
  f < 0 ? f = 0 : f > 1 && (f = 1);
  const d = n + f * c, x = s + f * a, y = o - d, g = e - x;
  return Math.sqrt(y * y + g * g);
}
function Wn(o, e, n, s, i, r) {
  const c = i - n, a = r - s, h = o - n, l = e - s, u = c * c + a * a;
  let f = u > 0 ? (h * c + l * a) / u : 0;
  f < 0 ? f = 0 : f > 1 && (f = 1);
  const d = n + f * c, x = s + f * a, y = o - d, g = e - x;
  return y * y + g * g;
}
function T1(o, e, n, s, i, r) {
  const c = i - n, a = r - s, h = o - n, l = e - s, u = c * c + a * a;
  let f = u > 0 ? (h * c + l * a) / u : 0;
  f < 0 ? f = 0 : f > 1 && (f = 1);
  const d = n + f * c, x = s + f * a, y = o - d, g = e - x;
  return (c * l - a * h >= 0 ? 1 : -1) * Math.sqrt(y * y + g * g);
}
function cn(o) {
  const e = Math.PI * 2;
  let n = o % e;
  return n < 0 && (n += e), n;
}
function P1(o, e, n, s) {
  let i = cn(e), r = cn(n), c = cn(o);
  if (!s) {
    const a = i;
    i = r, r = a;
  }
  return i <= r ? c >= i - 1e-9 && c <= r + 1e-9 : c >= i - 1e-9 || c <= r + 1e-9;
}
function E1(o, e) {
  const n = Math.PI * 2;
  let s = (e - o) % n;
  return s < -Math.PI ? s += n : s > Math.PI && (s -= n), Math.abs(s);
}
class L1 extends en {
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
    let h = a > 0 ? (r * s + c * i) / a : 0;
    h < 0 ? h = 0 : h > 1 && (h = 1);
    const l = this.x1 + h * s, u = this.y1 + h * i, f = e - l, d = n - u;
    return (s * c - i * r >= 0 ? 1 : -1) * Math.sqrt(f * f + d * d);
  }
  bounds(e) {
    const n = e || new St();
    return n.min.set(Math.min(this.x1, this.x2), Math.min(this.y1, this.y2)), n.max.set(Math.max(this.x1, this.x2), Math.max(this.y1, this.y2)), n;
  }
}
class A1 extends en {
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
    const a = s < 0 ? this.x - e : i < 0 ? e - this.right : 0, h = r < 0 ? this.y - n : c < 0 ? n - this.bottom : 0;
    return -Math.sqrt(a * a + h * h);
  }
  bounds(e) {
    const n = e || new St();
    return n.min.set(this.x, this.y), n.max.set(this.right, this.bottom), n;
  }
}
class S1 extends en {
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
    const s = this.ax, i = this.ay, r = this.bx, c = this.by, a = this.cx, h = this.cy, l = (e - r) * (i - c) - (s - r) * (n - c), u = (e - a) * (c - h) - (r - a) * (n - h), f = (e - s) * (h - i) - (a - s) * (n - i), d = l < 0 || u < 0 || f < 0, x = l > 0 || u > 0 || f > 0;
    return !(d && x);
  }
  signedDistance(e, n) {
    const s = Wn(e, n, this.ax, this.ay, this.bx, this.by), i = Wn(e, n, this.bx, this.by, this.cx, this.cy), r = Wn(e, n, this.cx, this.cy, this.ax, this.ay), c = Math.min(s, i, r), a = Math.sqrt(c);
    return this.contains(e, n) ? a : -a;
  }
  bounds(e) {
    const n = e || new St();
    return n.min.set(
      Math.min(this.ax, this.bx, this.cx),
      Math.min(this.ay, this.by, this.cy)
    ), n.max.set(
      Math.max(this.ax, this.bx, this.cx),
      Math.max(this.ay, this.by, this.cy)
    ), n;
  }
}
class da extends en {
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
    return new da(n);
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
      const r = e[i], c = e[i + 1], a = e[(i + 2) % n], h = e[(i + 3) % n];
      s += r * h - a * c;
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
    for (let l = 0; l < i; l += 2) {
      const u = s[l], f = s[l + 1], d = s[(l + 2) % i], x = s[(l + 3) % i], y = u * x - d * f;
      r += y, c += (u + d) * y, a += (f + x) * y;
    }
    const h = r * 3;
    if (Math.abs(h) > 1e-12)
      n.x = c / h, n.y = a / h;
    else {
      let l = 0, u = 0;
      const f = i >> 1;
      for (let d = 0; d < i; d += 2)
        l += s[d], u += s[d + 1];
      n.x = l / f, n.y = u / f;
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
      const r = e[i], c = e[i + 1], a = e[(i + 2) % n], h = e[(i + 3) % n], l = a - r, u = h - c;
      s += Math.sqrt(l * l + u * u);
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
      const h = s[c], l = s[c + 1], u = s[a], f = s[a + 1];
      l > n != f > n && e < (u - h) * (n - l) / (f - l) + h && (r = !r);
    }
    return r;
  }
  signedDistance(e, n) {
    const s = this.points, i = s.length;
    if (i < 4) return 1 / 0;
    let r = 1 / 0;
    for (let a = 0, h = i - 2; a < i; h = a, a += 2) {
      const l = Wn(
        e,
        n,
        s[h],
        s[h + 1],
        s[a],
        s[a + 1]
      );
      l < r && (r = l);
    }
    const c = Math.sqrt(r);
    return this.contains(e, n) ? c : -c;
  }
  bounds(e) {
    const n = e || new St(), s = this.points, i = s.length;
    if (i === 0)
      return n.setEmpty(), n;
    let r = s[0], c = s[1], a = s[0], h = s[1];
    for (let l = 2; l < i; l += 2) {
      const u = s[l], f = s[l + 1];
      u < r ? r = u : u > a && (a = u), f < c ? c = f : f > h && (h = f);
    }
    return n.min.set(r, c), n.max.set(a, h), n;
  }
}
class I1 extends en {
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
    const n = e || new St(), s = this.radius;
    return n.min.set(this.cx - s, this.cy - s), n.max.set(this.cx + s, this.cy + s), n;
  }
}
class q1 extends en {
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
    const h = s / r, l = i / c, u = Math.sqrt(h * h + l * l);
    return a / u - a;
  }
  bounds(e) {
    const n = e || new St();
    return n.min.set(this.cx - this.radiusX, this.cy - this.radiusY), n.max.set(this.cx + this.radiusX, this.cy + this.radiusY), n;
  }
}
class D1 extends en {
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
    let n = cn(this.startAngle), s = cn(this.endAngle);
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
    let n = cn(this.startAngle), s = cn(this.endAngle), i = cn(e);
    return this.ccw ? n <= s ? i >= n - 1e-9 && i <= s + 1e-9 : i >= n - 1e-9 || i <= s + 1e-9 : s <= n ? i >= s - 1e-9 && i <= n + 1e-9 : i >= s - 1e-9 || i <= n + 1e-9;
  }
  /**
   * 带符号距离（到扇形边界：弧 + 两段半径）
   */
  signedDistance(e, n) {
    const s = e - this.cx, i = n - this.cy, r = this.radius, c = Math.sqrt(s * s + i * i), a = c < 1e-12 ? this.startAngle : Math.atan2(i, s), h = this.angleInSweep(a);
    let l = 1 / 0;
    if (h) {
      const M = Math.abs(c - r);
      M < l && (l = M);
    }
    const u = this.cx + r * Math.cos(this.startAngle), f = this.cy + r * Math.sin(this.startAngle), d = this.cx + r * Math.cos(this.endAngle), x = this.cy + r * Math.sin(this.endAngle), y = Wn(e, n, this.cx, this.cy, u, f), g = Wn(e, n, this.cx, this.cy, d, x);
    y < l && (l = y), g < l && (l = g);
    const w = l === 1 / 0 ? Math.abs(c - r) : Math.sqrt(l);
    return this.contains(e, n) ? w : -w;
  }
  bounds(e) {
    const n = e || new St(), s = this.radius;
    return n.min.set(this.cx - s, this.cy - s), n.max.set(this.cx + s, this.cy + s), n;
  }
}
let O1 = class Sr extends en {
  type;
  // 控制点扁平存储 [p0x, p0y, p1x, p1y, ...]
  // 二次：6 个数；三次：8 个数
  points;
  constructor(e = "cubic", n = []) {
    super(), this.type = e, this.points = n;
  }
  static quadratic(e, n, s, i, r, c) {
    return new Sr("quadratic", [e, n, s, i, r, c]);
  }
  static cubic(e, n, s, i, r, c, a, h) {
    return new Sr("cubic", [e, n, s, i, r, c, a, h]);
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
      const c = r * r, a = e * e, h = 2 * r * e;
      s.x = c * i[0] + h * i[2] + a * i[4], s.y = c * i[1] + h * i[3] + a * i[5];
    } else {
      const c = r * r * r, a = e * e * e, h = 3 * r * r * e, l = 3 * r * e * e;
      s.x = c * i[0] + h * i[2] + l * i[4] + a * i[6], s.y = c * i[1] + h * i[3] + l * i[5] + a * i[7];
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
    const i = s[0], r = s[1], c = s[2], a = s[3], h = s[4], l = s[5], u = i - 2 * c + h, f = 2 * (c - i), d = i - e, x = r - 2 * a + l, y = 2 * (a - r), g = r - n, w = 2 * (u * u + x * x), M = 3 * (u * f + x * y), E = f * f + y * y + 2 * (u * d + x * g), I = f * d + y * g, N = wi(w, M, E, I), O = [0, 1];
    for (let H = 0; H < N.length; H++) {
      const $ = N[H];
      $ > 0 && $ < 1 && O.push($);
    }
    let z = 0, k = 1 / 0;
    const Y = { x: 0, y: 0 };
    for (let H = 0; H < O.length; H++) {
      this.pointAt(O[H], Y);
      const $ = e - Y.x, W = n - Y.y, J = $ * $ + W * W;
      J < k && (k = J, z = O[H]);
    }
    return z;
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
      const x = e - a.x, y = n - a.y, g = x * x + y * y;
      g < c && (c = g, r = d);
    }
    const h = { x: 0, y: 0 }, l = { x: 0, y: 0 };
    let u = r;
    for (let f = 0; f < 4; f++) {
      this.pointAt(u, a), this.derivativeAt(u, h), this._secondDerivativeAt(u, l);
      const d = a.x - e, x = a.y - n, y = d * h.x + x * h.y, g = h.x * h.x + h.y * h.y + d * l.x + x * l.y;
      if (Math.abs(g) < 1e-12) break;
      let w = u - y / g;
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
    const n = e || new St(), s = this.points;
    n.min.set(1 / 0, 1 / 0), n.max.set(-1 / 0, -1 / 0);
    for (let i = 0; i < s.length; i += 2)
      n.add(s[i], s[i + 1]);
    return n;
  }
};
class k1 extends en {
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
    const h = i + s, l = r + s, u = c - s, f = a - s;
    if (e < h && n < l) {
      const d = e - h, x = n - l;
      return d * d + x * x < s * s;
    }
    if (e > u && n < l) {
      const d = e - u, x = n - l;
      return d * d + x * x < s * s;
    }
    if (e < h && n > f) {
      const d = e - h, x = n - f;
      return d * d + x * x < s * s;
    }
    if (e > u && n > f) {
      const d = e - u, x = n - f;
      return d * d + x * x < s * s;
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
    const s = this.radius, i = this.x, r = this.y, c = this.right, a = this.bottom, h = i + s, l = r + s, u = c - s, f = a - s;
    let d, x, y = !1, g = !1;
    if (e < h ? (d = h, y = !0) : e > u ? (d = u, y = !0) : d = e, n < l ? (x = l, g = !0) : n > f ? (x = f, g = !0) : x = n, y && g) {
      const w = e - d, M = n - x, E = Math.sqrt(w * w + M * M);
      return s - E;
    } else {
      const w = e - i, M = c - e, E = n - r, I = a - n;
      if (w >= 0 && M >= 0 && E >= 0 && I >= 0)
        return Math.min(w, M, E, I);
      const N = e < h ? h : e > u ? u : e, O = n < l ? l : n > f ? f : n, z = e - N, k = n - O;
      return -(Math.sqrt(z * z + k * k) - s);
    }
  }
  bounds(e) {
    const n = e || new St();
    return n.min.set(this.x, this.y), n.max.set(this.right, this.bottom), n;
  }
}
class dn {
  /**
   * 创建事件实例的工厂方法
   * @param type 事件类型
   * @param data 事件数据
   */
  static create(e, n) {
    return new dn(e, n);
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
class R1 {
  /** NodeEvent 类引用，方便外部创建事件 */
  static NodeEvent = dn;
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
        for (const h of a) {
          if (e.immediateCancelBubble) break;
          this._invokeHandler(h, e);
        }
      if (e.cancelBubble) break;
    }
    if (!e.cancelBubble)
      for (let r = 0, c = i.length; r < c; r++) {
        const a = i[r];
        e.currentTarget = a;
        const h = a.listeners.get(s);
        if (h)
          for (const l of h) {
            if (e.immediateCancelBubble) break;
            this._invokeHandler(l, e);
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
    const s = new dn(e, n);
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
class z1 {
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
    const h = this._dom;
    if (!h) return;
    const l = c !== void 0 ? c : e.clientX, u = a !== void 0 ? a : e.clientY, f = h.getBoundingClientRect(), d = l - f.left, x = u - f.top, g = this.options.viewport.screenToWorld({ x: d, y: x }), w = g.x, M = g.y;
    let E = 0, I = 0;
    n === "pointermove" && (E = d - this._lastMoveX, I = x - this._lastMoveY), this._lastMoveX = d, this._lastMoveY = x;
    const N = {
      screenX: d,
      screenY: x,
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
      deltaX: E,
      deltaY: I
    }, O = this.options.pick(w, M), z = new dn(n, N);
    if (z.nativeEvent = e, n === "pointermove" && this._updateHover(O, e, d, x, w, M), n === "pointermove" && this._pressedTarget) {
      if (this._handleDragMove(O, e, N))
        return;
    } else if (n === "pointerup" && this._dragging) {
      this._handleDragEnd(O, e, d, x, w, M), this._pressedTarget = null;
      return;
    }
    O && O.dispatchEvent(z), n === "pointerdown" ? (this._pressedTarget = O, this._pressedX = d, this._pressedY = x, this._dragStartX = d, this._dragStartY = x, this._dragStartWorldX = w, this._dragStartWorldY = M, this._dragSource = O, this._dragThresholdMet = !1) : n === "pointerup" && this._tryClick(O, e, d, x, w, M);
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
      const h = this._dragSource, l = {
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
      this._emitNamedEventWithData(h, "dragstart", n, l), this._dragHoverEl = e, this._emitNamedEventWithData(e, "dragenter", n, {
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
    const a = this._dragSource, h = s - this._dragStartX, l = i - this._dragStartY, u = {
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
      totalDeltaX: h,
      totalDeltaY: l,
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
    const h = {
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
    }, l = new dn(n, h);
    l.nativeEvent = s, e.dispatchEvent(l);
  }
  /** 派发事件到指定元素（完整 data 版本，用于 drag 系列） */
  _emitNamedEventWithData(e, n, s, i) {
    const r = new dn(n, i);
    r.nativeEvent = s, e.dispatchEvent(r);
  }
  /** click 判定：同一目标 + 移动距离小于阈值 */
  _tryClick(e, n, s, i, r, c) {
    const a = this._pressedTarget;
    if (this._pressedTarget = null, !a) return;
    let h = !1, l = e;
    for (; l; ) {
      if (l === a) {
        h = !0;
        break;
      }
      l = l.parent;
    }
    if (!h) return;
    const u = s - this._pressedX, f = i - this._pressedY;
    if (u * u + f * f > this.clickMoveThreshold * this.clickMoveThreshold) return;
    this._emitNamedEvent(a, "click", n, s, i, r, c);
    const d = performance.now();
    this._lastClickTarget === a && d - this._lastClickTime <= this.dblClickInterval ? (this._emitNamedEvent(a, "dblclick", n, s, i, r, c), this._lastClickTarget = null) : (this._lastClickTime = d, this._lastClickTarget = a);
  }
}
class Mu {
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
class Os extends dn {
  static pool = Sn.create({
    initSize: 20,
    create: () => new Os("", {}),
    init(e) {
      e.reset();
    }
  });
  downPoint = rt.default();
  // 按下时的坐标
  point = rt.default();
  // 当前事件坐标
  offsetPoint = rt.default();
  // 距离按下时的偏移量
  deltaPoint = rt.default();
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
    const e = Os.pool.get();
    return e.copy(this), e;
  }
}
const bu = {
  pointerdown: "pointerdown",
  pointermove: "pointermove",
  pointerup: "pointerup",
  pointerleave: "pointerleave",
  pointerenter: "pointerenter",
  wheel: "wheel"
};
class N1 extends Mu {
  options;
  handlers = /* @__PURE__ */ new Map();
  // 阈值缓存（平方距离）
  _dragThresholdSq;
  _dblclickInterval;
  // 状态
  _lastPoint = rt.create();
  _downPoint = rt.create();
  _isPointerDown = !1;
  _isDragging = !1;
  _lastClickTime = 0;
  _lastClickPoint = rt.create();
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
    return this.options.pointerEvents ?? bu;
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
    const s = Os.pool.get();
    return s.type = e, s.data = {}, s.nativeEvent = n, s;
  }
  onPointerEvent(e, n) {
    const s = [], i = this.createEvent(e, n);
    s.push(i);
    const r = n.clientX, c = n.clientY, a = i.point;
    this.options.screenToWorld(a, r, c, this.options.target), i.deltaPoint.set(a.x - this._lastPoint.x, a.y - this._lastPoint.y), this._lastPoint.copy(a), this._isPointerDown && i.offsetPoint.set(a.x - this._downPoint.x, a.y - this._downPoint.y), i.downPoint.copy(this._downPoint);
    const h = this.options.hitTest(a.x, a.y);
    switch (i.target = h, e) {
      case "pointerdown": {
        if (this._isPointerDown = !0, this._isDragging = !1, this._downPoint.copy(a), this._downTarget = h, i.downPoint.copy(a), i.offsetPoint.set(0, 0), h && h !== this._hoverTarget) {
          if (this._hoverTarget) {
            const l = this.createEvent("pointerleave", n);
            s.push(l), l.copy(i), l.target = this._hoverTarget, this.emit("pointerleave", l);
          }
          this._hoverTarget = h, i.type = "pointerenter", this.emit("pointerenter", i);
        }
        i.type = "pointerdown", this.emit("pointerdown", i);
        break;
      }
      case "pointermove": {
        if (h !== this._hoverTarget) {
          if (this._hoverTarget) {
            const l = this.createEvent("pointerleave", n);
            s.push(l), l.copy(i), l.target = this._hoverTarget, this.emit("pointerleave", l);
          }
          h ? (this._hoverTarget = h, i.type = "pointerenter", this.emit("pointerenter", i)) : this._hoverTarget = null;
        }
        if (i.type = "pointermove", this.emit("pointermove", i), this._isPointerDown) {
          if (!this._isDragging) {
            const l = a.x - this._downPoint.x, u = a.y - this._downPoint.y;
            l * l + u * u >= this._dragThresholdSq && (this._isDragging = !0, this._dragHoverTarget = this._downTarget, i.type = "dragstart", this.emit("dragstart", i));
          }
          if (this._isDragging && (i.type = "drag", this.emit("drag", i), h !== this._dragHoverTarget)) {
            if (this._dragHoverTarget) {
              const l = this.createEvent("dragleave", n);
              s.push(l), l.copy(i), l.target = this._dragHoverTarget, this.emit("dragleave", l);
            }
            if (h) {
              const l = this.createEvent("dragenter", n);
              s.push(l), l.copy(i), l.target = h, this.emit("dragenter", l);
              const u = this.createEvent("dragover", n);
              s.push(u), u.copy(i), u.target = h, this.emit("dragover", u);
            }
            this._dragHoverTarget = h;
          }
        }
        break;
      }
      case "pointerup": {
        if (i.type = "pointerup", this.emit("pointerup", i), this._isDragging) {
          if (h && h !== this._downTarget) {
            const l = this.createEvent("drop", n);
            s.push(l), l.copy(i), l.target = h, this.emit("drop", l);
          }
          if (this._dragHoverTarget) {
            const l = this.createEvent("dragleave", n);
            s.push(l), l.copy(i), l.target = this._dragHoverTarget, this.emit("dragleave", l), this._dragHoverTarget = null;
          }
          this._isDragging = !1, i.type = "dragend", this.emit("dragend", i);
        }
        if (this._isPointerDown) {
          const l = a.x - this._downPoint.x, u = a.y - this._downPoint.y;
          if (l * l + u * u < this._dragThresholdSq) {
            i.type = "click", this.emit("click", i);
            const f = Date.now(), d = a.x - this._lastClickPoint.x, x = a.y - this._lastClickPoint.y;
            f - this._lastClickTime < this._dblclickInterval && d * d + x * x < this._dragThresholdSq ? (i.type = "dblclick", this.emit("dblclick", i), this._lastClickTime = 0) : (this._lastClickTime = f, this._lastClickPoint.copy(a));
          }
        }
        this._isPointerDown = !1, this._downTarget = null;
        break;
      }
      case "pointerleave": {
        if (this._hoverTarget) {
          const l = this.createEvent("pointerleave", n);
          s.push(l), l.copy(i), l.target = this._hoverTarget, this.emit("pointerleave", l), this._hoverTarget = null;
        }
        if (this._isDragging && this._dragHoverTarget) {
          const l = this.createEvent("dragleave", n);
          s.push(l), l.copy(i), l.target = this._dragHoverTarget, this.emit("dragleave", l), this._dragHoverTarget = null;
        }
        break;
      }
      case "pointerenter": {
        h && h !== this._hoverTarget && (this._hoverTarget = h, i.type = "pointerenter", this.emit("pointerenter", i));
        break;
      }
      case "wheel": {
        i.type = "wheel", this.emit("wheel", i);
        break;
      }
    }
    for (const l of s)
      Os.pool.release(l);
  }
}
const { abs: rs, cos: $e, sin: On, acos: _u, atan2: os, sqrt: sn, pow: Le } = Math;
function cs(o) {
  return o < 0 ? -Le(-o, 1 / 3) : Le(o, 1 / 3);
}
const xa = Math.PI, ui = 2 * xa, rn = xa / 2, Tu = 1e-6, Zi = Number.MAX_SAFE_INTEGER || 9007199254740991, Ji = Number.MIN_SAFE_INTEGER || -9007199254740991, Pu = { x: 0, y: 0, z: 0 }, et = {
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
    return typeof n.z < "u" && (s += n.z * n.z), sn(s);
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
      let a = i * i, h = o * o, l, u, f, d = 0;
      s === 2 ? (r = [r[0], r[1], r[2], Pu], l = a, u = i * o * 2, f = h) : s === 3 && (l = a * i, u = a * o * 3, f = i * h * 3, d = o * h);
      const x = {
        x: l * r[0].x + u * r[1].x + f * r[2].x + d * r[3].x,
        y: l * r[0].y + u * r[1].y + f * r[2].y + d * r[3].y,
        t: o
      };
      return n && (x.z = l * r[0].z + u * r[1].z + f * r[2].z + d * r[3].z), x;
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
    let a = r[0], h = r[1], l = r[2], u = r[3], f;
    if (a *= i, h *= o, c.length === 2)
      return f = a + h, {
        x: (a * c[0].x + h * c[1].x) / f,
        y: (a * c[0].y + h * c[1].y) / f,
        z: s ? (a * c[0].z + h * c[1].z) / f : !1,
        t: o
      };
    if (a *= i, h *= 2 * i, l *= o * o, c.length === 3)
      return f = a + h + l, {
        x: (a * c[0].x + h * c[1].x + l * c[2].x) / f,
        y: (a * c[0].y + h * c[1].y + l * c[2].y) / f,
        z: s ? (a * c[0].z + h * c[1].z + l * c[2].z) / f : !1,
        t: o
      };
    if (a *= i, h *= 1.5 * i, l *= 3 * i, u *= o * o * o, c.length === 4)
      return f = a + h + l + u, {
        x: (a * c[0].x + h * c[1].x + l * c[2].x + u * c[3].x) / f,
        y: (a * c[0].y + h * c[1].y + l * c[2].y + u * c[3].y) / f,
        z: s ? (a * c[0].z + h * c[1].z + l * c[2].z + u * c[3].z) / f : !1,
        t: o
      };
  },
  // 导数控制点计算函数
  derive: function(o, e) {
    const n = [];
    for (let s = o, i = s.length, r = i - 1; i > 1; i--, r--) {
      const c = [];
      for (let a = 0, h; a < r; a++)
        h = {
          x: r * (s[a + 1].x - s[a].x),
          y: r * (s[a + 1].y - s[a].y)
        }, e && (h.z = r * (s[a + 1].z - s[a].z)), c.push(h);
      n.push(c), s = c;
    }
    return n;
  },
  between: function(o, e, n) {
    return e <= o && o <= n || et.approximately(o, e) || et.approximately(o, n);
  },
  approximately: function(o, e, n) {
    return rs(o - e) <= (n || Tu);
  },
  length: function(o) {
    const n = et.Tvalues.length;
    let s = 0;
    for (let i = 0, r; i < n; i++)
      r = 0.5 * et.Tvalues[i] + 0.5, s += et.Cvalues[i] * et.arcfn(r, o);
    return 0.5 * s;
  },
  map: function(o, e, n, s, i) {
    const r = n - e, c = i - s, a = o - e, h = a / r;
    return s + c * h;
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
    const s = e.x - o.x, i = e.y - o.y, r = n.x - o.x, c = n.y - o.y, a = s * c - i * r, h = s * r + i * c;
    return os(a, h);
  },
  // round as string, to avoid rounding errors
  round: function(o, e) {
    const n = "" + o, s = n.indexOf(".");
    return parseFloat(n.substring(0, s + 1 + e));
  },
  dist: function(o, e) {
    const n = o.x - e.x, s = o.y - e.y;
    return sn(n * n + s * s);
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
    return rs(s / n);
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
    const h = (o * s - e * n) * (i - c) - (o - n) * (i * a - r * c), l = (o * s - e * n) * (r - a) - (e - s) * (i * a - r * c), u = (o - n) * (r - a) - (e - s) * (i - c);
    return u == 0 ? !1 : { x: h / u, y: l / u };
  },
  lli4: function(o, e, n, s) {
    const i = o.x, r = o.y, c = e.x, a = e.y, h = n.x, l = n.y, u = s.x, f = s.y;
    return et.lli8(i, r, c, a, h, l, u, f);
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
    let e = Zi, n = Zi, s = Ji, i = Ji;
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
    return c.forEach(function(h) {
      h.virtual || a.forEach(function(l) {
        if (l.virtual) return;
        const u = h.intersects(l, i);
        u.length > 0 && (u.c1 = h, u.c2 = l, u.s1 = o, u.s2 = n, r.push(u));
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
    return a.intersections = function(h) {
      return et.shapeintersections(
        a,
        a.bbox,
        h,
        h.bbox,
        n
      );
    }, a;
  },
  getminmax: function(o, e, n) {
    if (!n) return { min: 0, max: 0 };
    let s = Zi, i = Ji, r, c;
    n.indexOf(0) === -1 && (n = [0].concat(n)), n.indexOf(1) === -1 && n.push(1);
    for (let a = 0, h = n.length; a < h; a++)
      r = n[a], c = o.get(r), c[e] < s && (s = c[e]), c[e] > i && (i = c[e]);
    return { min: s, mid: (s + i) / 2, max: i, size: i - s };
  },
  align: function(o, e) {
    const n = e.p1.x, s = e.p1.y, i = -os(e.p2.y - s, e.p2.x - n), r = function(c) {
      return {
        x: (c.x - n) * $e(i) - (c.y - s) * On(i),
        y: (c.x - n) * On(i) + (c.y - s) * $e(i)
      };
    };
    return o.map(r);
  },
  // 根据控制点求根
  roots: function(o, e) {
    e = e || { p1: { x: 0, y: 0 }, p2: { x: 1, y: 0 } };
    const n = o.length - 1, s = et.align(o, e), i = function(k) {
      return 0 <= k && k <= 1;
    };
    if (n === 2) {
      const k = s[0].y, Y = s[1].y, H = s[2].y, $ = k - 2 * Y + H;
      if ($ !== 0) {
        const W = -sn(Y * Y - k * H), J = -k + Y, ot = -(W + J) / $, K = -(-W + J) / $;
        return [ot, K].filter(i);
      } else if (Y !== H && $ === 0)
        return [(2 * Y - H) / (2 * Y - 2 * H)].filter(i);
      return [];
    }
    const r = s[0].y, c = s[1].y, a = s[2].y, h = s[3].y;
    let l = -r + 3 * c - 3 * a + h, u = 3 * r - 6 * c + 3 * a, f = -3 * r + 3 * c, d = r;
    if (et.approximately(l, 0)) {
      if (et.approximately(u, 0))
        return et.approximately(f, 0) ? [] : [-d / f].filter(i);
      const k = sn(f * f - 4 * u * d), Y = 2 * u;
      return [(k - f) / Y, (-f - k) / Y].filter(i);
    }
    u /= l, f /= l, d /= l;
    const x = (3 * f - u * u) / 3, y = x / 3, g = (2 * u * u * u - 9 * u * f + 27 * d) / 27, w = g / 2, M = w * w + y * y * y;
    let E, I, N, O, z;
    if (M < 0) {
      const k = -x / 3, Y = k * k * k, H = sn(Y), $ = -g / (2 * H), W = $ < -1 ? -1 : $ > 1 ? 1 : $, J = _u(W), ot = cs(H), K = 2 * ot;
      return N = K * $e(J / 3) - u / 3, O = K * $e((J + ui) / 3) - u / 3, z = K * $e((J + 2 * ui) / 3) - u / 3, [N, O, z].filter(i);
    } else {
      if (M === 0)
        return E = w < 0 ? cs(-w) : -cs(w), N = 2 * E - u / 3, O = -E - u / 3, [N, O].filter(i);
      {
        const k = sn(M);
        return E = cs(-w + k), I = cs(w + k), [E - I - u / 3].filter(i);
      }
    }
  },
  // 根据导数控制点计算根，即曲线切线为零的点
  droots: function(o) {
    if (o.length === 3) {
      const e = o[0], n = o[1], s = o[2], i = e - 2 * n + s;
      if (i !== 0) {
        const r = -sn(n * n - e * s), c = -e + n, a = -(r + c) / i, h = -(-r + c) / i;
        return [a, h];
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
    let r, c, a, h, l = 0, u = 0;
    const f = et.compute(o, e), d = et.compute(o, n), x = f.x * f.x + f.y * f.y;
    if (s ? (r = sn(
      Le(f.y * d.z - d.y * f.z, 2) + Le(f.z * d.x - d.z * f.x, 2) + Le(f.x * d.y - d.x * f.y, 2)
    ), c = Le(x + f.z * f.z, 3 / 2)) : (r = f.x * d.y - f.y * d.x, c = Le(x, 3 / 2)), r === 0 || c === 0)
      return { k: 0, r: 0 };
    if (l = r / c, u = c / r, !i) {
      const y = et.curvature(o - 1e-3, e, n, s, !0).k, g = et.curvature(o + 1e-3, e, n, s, !0).k;
      h = (g - l + (l - y)) / 2, a = (rs(g - l) + rs(l - y)) / 2;
    }
    return { k: l, r: u, dk: h, adk: a };
  },
  inflections: function(o) {
    if (o.length < 4) return [];
    const e = et.align(o, { p1: o[0], p2: o.slice(-1)[0] }), n = e[2].x * e[1].y, s = e[3].x * e[1].y, i = e[1].x * e[2].y, r = e[3].x * e[2].y, c = 18 * (-3 * n + 2 * s + 3 * i - r), a = 18 * (3 * n - s - 3 * i), h = 18 * (i - n);
    if (et.approximately(c, 0)) {
      if (!et.approximately(a, 0)) {
        let d = -h / a;
        if (0 <= d && d <= 1) return [d];
      }
      return [];
    }
    const l = 2 * c;
    if (et.approximately(l, 0)) return [];
    const u = a * a - 4 * c * h;
    if (u < 0) return [];
    const f = Math.sqrt(u);
    return [(f - a) / l, -(a + f) / l].filter(function(d) {
      return 0 <= d && d <= 1;
    });
  },
  bboxoverlap: function(o, e) {
    const n = ["x", "y"], s = n.length;
    for (let i = 0, r, c, a, h; i < s; i++)
      if (r = n[i], c = o[r].mid, a = e[r].mid, h = (o[r].size + e[r].size) / 2, rs(c - a) >= h) return !1;
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
    let a = o.split(0.5), h = e.split(0.5), l = [
      { left: a.left, right: h.left },
      { left: a.left, right: h.right },
      { left: a.right, right: h.right },
      { left: a.right, right: h.left }
    ];
    l = l.filter(function(f) {
      return et.bboxoverlap(f.left.bbox(), f.right.bbox());
    });
    let u = [];
    return l.length === 0 || (l.forEach(function(f) {
      u = u.concat(
        et.pairiteration(f.left, f.right, c)
      );
    }), u = u.filter(function(f, d) {
      return u.indexOf(f) === d;
    })), u;
  },
  getccenter: function(o, e, n) {
    const s = e.x - o.x, i = e.y - o.y, r = n.x - e.x, c = n.y - e.y, a = s * $e(rn) - i * On(rn), h = s * On(rn) + i * $e(rn), l = r * $e(rn) - c * On(rn), u = r * On(rn) + c * $e(rn), f = (o.x + e.x) / 2, d = (o.y + e.y) / 2, x = (e.x + n.x) / 2, y = (e.y + n.y) / 2, g = f + a, w = d + h, M = x + l, E = y + u, I = et.lli8(f, d, g, w, x, y, M, E), N = et.dist(I, o);
    let O = os(o.y - I.y, o.x - I.x), z = os(e.y - I.y, e.x - I.x), k = os(n.y - I.y, n.x - I.x), Y;
    return O < k ? ((O > z || z > k) && (O += ui), O > k && (Y = k, k = O, O = Y)) : k < z && z < O ? (Y = k, k = O, O = Y) : k += ui, I.s = O, I.e = k, I.r = N, I;
  },
  numberSort: function(o, e) {
    return o - e;
  }
};
class gs {
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
    }), new gs(n);
  }
}
const { abs: as, min: Vo, max: Uo, cos: Eu, sin: Lu, acos: Au, sqrt: hs } = Math, Su = Math.PI;
class Ct {
  constructor(e) {
    let n = e && e.forEach ? e : Array.from(arguments).slice(), s = !1;
    if (typeof n[0] == "object") {
      s = n.length;
      const x = [];
      n.forEach(function(y) {
        ["x", "y", "z"].forEach(function(g) {
          typeof y[g] < "u" && x.push(y[g]);
        });
      }), n = x;
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
    for (let x = 0, y = c ? 3 : 2; x < r; x += y) {
      var h = {
        x: n[x],
        y: n[x + 1]
      };
      c && (h.z = n[x + 2]), a.push(h);
    }
    const l = this.order = a.length - 1, u = this.dims = ["x", "y"];
    c && u.push("z"), this.dimlen = u.length;
    const f = et.align(a, { p1: a[0], p2: a[l] }), d = et.dist(a[0], a[l]);
    this._linear = f.reduce((x, y) => x + as(y.y), 0) < d / 50, this._lut = [], this._t1 = 0, this._t2 = 1, this.update();
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
    const a = r * (1 - i) / i, h = et.dist(e, s), l = (s.x - e.x) / h, u = (s.y - e.y) / h, f = r * l, d = r * u, x = a * l, y = a * u, g = { x: n.x - f, y: n.y - d }, w = { x: n.x + x, y: n.y + y }, M = c.A, E = { x: M.x + (g.x - M.x) / (1 - i), y: M.y + (g.y - M.y) / (1 - i) }, I = { x: M.x + (w.x - M.x) / i, y: M.y + (w.y - M.y) / i }, N = { x: e.x + (E.x - e.x) / i, y: e.y + (E.y - e.y) / i }, O = {
      x: s.x + (I.x - s.x) / (1 - i),
      y: s.y + (I.y - s.y) / (1 - i)
    };
    return new Ct(e, N, O, s);
  }
  static getUtils() {
    return et;
  }
  getUtils() {
    return Ct.getUtils();
  }
  static get PolyBezier() {
    return gs;
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
    const c = et.projectionratio(r, e), a = 1 - c, h = {
      x: c * n.x + a * i.x,
      y: c * n.y + a * i.y
    }, l = et.abcratio(r, e);
    return { A: {
      x: s.x + (s.x - h.x) / l,
      y: s.y + (s.y - h.y) / l
    }, B: s, C: h, S: n, E: i };
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
    const n = this.getLUT(), s = n.length - 1, i = et.closest(n, e), r = i.mpos, c = (r - 1) / s, a = (r + 1) / s, h = 0.1 / s;
    let l = i.mdist, u = c, f = u, d;
    l += 1;
    for (let x; u < a + h; u += h)
      d = this.compute(u), x = et.dist(e, d), x < l && (l = x, f = u);
    return f = f < 0 ? 0 : f > 1 ? 1 : f, d = this.compute(f), d.t = f, d.d = l, d;
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
    const n = this.derivative(e), s = hs(n.x * n.x + n.y * n.y);
    return { t: e, x: -n.y / s, y: n.x / s };
  }
  __normal3(e) {
    const n = this.derivative(e), s = this.derivative(e + 0.01), i = hs(n.x * n.x + n.y * n.y + n.z * n.z), r = hs(s.x * s.x + s.y * s.y + s.z * s.z);
    n.x /= i, n.y /= i, n.z /= i, s.x /= r, s.y /= r, s.z /= r;
    const c = {
      x: s.y * n.z - s.z * n.y,
      y: s.z * n.x - s.x * n.z,
      z: s.x * n.y - s.y * n.x
    }, a = hs(c.x * c.x + c.y * c.y + c.z * c.z);
    c.x /= a, c.y /= a, c.z /= a;
    const h = [
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
      x: h[0] * n.x + h[1] * n.y + h[2] * n.z,
      y: h[3] * n.x + h[4] * n.y + h[5] * n.z,
      z: h[6] * n.x + h[7] * n.y + h[8] * n.z
    };
  }
  //在所有迭代中，为指定 t 值的曲线上点生成所有包点
  hull(e) {
    let n = this.points, s = [], i = [], r = 0;
    for (i[r++] = n[0], i[r++] = n[1], i[r++] = n[2], this.order === 3 && (i[r++] = n[3]); n.length > 1; ) {
      s = [];
      for (let c = 0, a, h = n.length - 1; c < h; c++)
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
    return this._3d && (s += e.z * n.z), as(Au(s)) < Su / 3;
  }
  /**
   * 将曲线简化为“简单”子曲线的集合，其中简单性定义为所有控制点都在基线的同一侧（三次曲线具有控制到端点线不得交叉的附加约束），并且端点法线之间的角度不大于 60 度。
   * @returns 
   */
  reduce() {
    let e, n = 0, s = 0, i = 0.01, r, c = [], a = [], h = this.extrema().values;
    for (h.indexOf(0) === -1 && (h = [0].concat(h)), h.indexOf(1) === -1 && h.push(1), n = h[0], e = 1; e < h.length; e++)
      s = h[e], r = this.split(n, s), r._t1 = n, r._t2 = s, c.push(r), n = s;
    return c.forEach(function(l) {
      for (n = 0, s = 0; s <= 1; )
        for (s = n + i; s <= 1 + i; s += i)
          if (r = l.split(n, s), !r.simple()) {
            if (s -= i, as(n - s) < i)
              return [];
            r = l.split(n, s), r._t1 = et.map(n, 0, 1, l._t1, l._t2), r._t2 = et.map(s, 0, 1, l._t1, l._t2), a.push(r), n = s;
            break;
          }
      n < 1 && (r = l.split(n, 1), r._t1 = et.map(n, 0, 1, l._t1, l._t2), r._t2 = l._t2, a.push(r));
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
    const c = s ? s(0) : e, a = s ? s(1) : e, h = [this.offset(0, 10), this.offset(1, 10)], l = [], u = et.lli4(h[0], h[0].c, h[1], h[1].c);
    if (!u)
      throw new Error("cannot scale this curve. Try reducing it first.");
    return [0, 1].forEach(function(f) {
      const d = l[f * n] = et.copy(r[f * n]);
      d.x += (f ? a : c) * h[f].n.x, d.y += (f ? a : c) * h[f].n.y;
    }), s ? ([0, 1].forEach(function(f) {
      if (!(n === 2 && f)) {
        var d = r[f + 1], x = {
          x: d.x - u.x,
          y: d.y - u.y
        }, y = s ? s((f + 1) / n) : e;
        s && !i && (y = -y);
        var g = hs(x.x * x.x + x.y * x.y);
        x.x /= g, x.y /= g, l[f + 1] = {
          x: d.x + y * x.x,
          y: d.y + y * x.y
        };
      }
    }), new Ct(l)) : ([0, 1].forEach((f) => {
      if (n === 2 && f) return;
      const d = l[f * n], x = this.derivative(f), y = { x: d.x + x.x, y: d.y + x.y };
      l[f + 1] = et.lli4(d, y, u, r[f + 1]);
    }), new Ct(l));
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
      const O = this.normal(0), z = this.points[0], k = this.points[this.points.length - 1];
      let Y, H, $;
      s === void 0 && (s = e, i = n), Y = { x: z.x + O.x * e, y: z.y + O.y * e }, $ = { x: k.x + O.x * s, y: k.y + O.y * s }, H = { x: (Y.x + $.x) / 2, y: (Y.y + $.y) / 2 };
      const W = [Y, H, $];
      Y = { x: z.x - O.x * n, y: z.y - O.y * n }, $ = { x: k.x - O.x * i, y: k.y - O.y * i }, H = { x: (Y.x + $.x) / 2, y: (Y.y + $.y) / 2 };
      const J = [$, H, Y], ot = et.makeline(J[2], W[0]), K = et.makeline(W[2], J[0]), j = [ot, new Ct(W), K, new Ct(J)];
      return new gs(j);
    }
    const r = this.reduce(), c = r.length, a = [];
    let h = [], l, u = 0, f = this.length();
    const d = typeof s < "u" && typeof i < "u";
    function x(O, z, k, Y, H) {
      return function($) {
        const W = Y / k, J = (Y + H) / k, ot = z - O;
        return et.map($, 0, 1, O + W * ot, O + J * ot);
      };
    }
    r.forEach(function(O) {
      const z = O.length();
      d ? (a.push(
        O.scale(x(e, s, f, u, z))
      ), h.push(
        O.scale(x(-n, -i, f, u, z))
      )) : (a.push(O.scale(e)), h.push(O.scale(-n))), u += z;
    }), h = h.map(function(O) {
      return l = O.points, l[3] ? O.points = [l[3], l[2], l[1], l[0]] : O.points = [l[2], l[1], l[0]], O;
    }).reverse();
    const y = a[0].points[0], g = a[c - 1].points[a[c - 1].points.length - 1], w = h[c - 1].points[h[c - 1].points.length - 1], M = h[0].points[0], E = et.makeline(w, y), I = et.makeline(g, M), N = [E].concat(a).concat([I]).concat(h);
    return new gs(N);
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
      const h = et.makeshape(
        i[c],
        i[a - c],
        s
      );
      h.startcap.virtual = c > 1, h.endcap.virtual = c < a / 2 - 1, r.push(h);
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
    const n = Vo(e.p1.x, e.p2.x), s = Vo(e.p1.y, e.p2.y), i = Uo(e.p1.x, e.p2.x), r = Uo(e.p1.y, e.p2.y);
    return et.roots(this.points, e).filter((c) => {
      var a = this.get(c);
      return et.between(a.x, n, i) && et.between(a.y, s, r);
    });
  }
  selfintersects(e) {
    const n = this.reduce(), s = n.length - 2, i = [];
    for (let r = 0, c, a, h; r < s; r++)
      a = n.slice(r, r + 1), h = n.slice(r + 2), c = this.curveintersects(a, h, e), i.push(...c);
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
    const r = (i - s) / 4, c = this.get(s + r), a = this.get(i - r), h = et.dist(e, n), l = et.dist(e, c), u = et.dist(e, a);
    return as(l - h) + as(u - h);
  }
  _iterate(e, n) {
    let s = 0, i = 1, r;
    do {
      r = 0, i = 1;
      let c = this.get(s), a, h, l, u, f = !1, d = !1, x, y = i, g = 1;
      do
        if (d = f, u = l, y = (s + i) / 2, a = this.get(y), h = this.get(i), l = et.getccenter(c, a, h), l.interval = {
          start: s,
          end: i
        }, f = this._error(l, c, s, i) <= e, x = d && !f, x || (g = i), f) {
          if (i >= 1) {
            if (l.interval.end = g = 1, u = l, i > 1) {
              let M = {
                x: l.x + l.r * Eu(l.e),
                y: l.y + l.r * Lu(l.e)
              };
              l.e += et.angle({ x: l.x, y: l.y }, M, this.get(1));
            }
            break;
          }
          i = i + (i - s) / 2;
        } else
          i = y;
      while (!x && r++ < 100);
      if (r >= 100)
        break;
      u = u || l, n.push(u), s = g;
    } while (i < 1);
    return n;
  }
}
const C1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Bezier: Ct
}, Symbol.toStringTag, { value: "Module" })), Qi = new Float32Array([
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
        n === void 0 ? super(Qi) : typeof n == "number" ? super([
          n,
          n,
          n,
          n
        ]) : super(n, 0, 4);
        break;
      default:
        super(Qi);
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
    return this.set(Qi), this;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = s[0], l = s[1], u = s[2], f = s[3];
    return e[0] = i * h + c * l, e[1] = r * h + a * l, e[2] = i * u + c * f, e[3] = r * u + a * f, e;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = Math.sin(s), l = Math.cos(s);
    return e[0] = i * l + c * h, e[1] = r * l + a * h, e[2] = i * -h + c * l, e[3] = r * -h + a * l, e;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = s[0], l = s[1];
    return e[0] = i * h, e[1] = r * h, e[2] = c * l, e[3] = a * l, e;
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
    const s = e[0], i = e[1], r = e[2], c = e[3], a = n[0], h = n[1], l = n[2], u = n[3];
    return Math.abs(s - a) <= dt * Math.max(1, Math.abs(s), Math.abs(a)) && Math.abs(i - h) <= dt * Math.max(1, Math.abs(i), Math.abs(h)) && Math.abs(r - l) <= dt * Math.max(1, Math.abs(r), Math.abs(l)) && Math.abs(c - u) <= dt * Math.max(1, Math.abs(c), Math.abs(u));
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
const Iu = se, Ki = new Float32Array([
  1,
  0,
  0,
  1,
  0,
  0
]);
class ge extends Float32Array {
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
        n === void 0 ? super(Ki) : typeof n == "number" ? super([
          n,
          n,
          n,
          n,
          n,
          n
        ]) : super(n, 0, 6);
        break;
      default:
        super(Ki);
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
    return ge.str(this);
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
    return this.set(Ki), this;
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
    return ge.multiply(this, this, e);
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
    return ge.translate(this, this, e);
  }
  /**
   * Rotates this {@link Mat2d} by the given angle around the given axis
   * Equivalent to `Mat2d.rotate(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  rotate(e) {
    return ge.rotate(this, this, e);
  }
  /**
   * Scales this {@link Mat2d} by the dimensions in the given vec3 not using vectorization
   * Equivalent to `Mat2d.scale(this, this, v);`
   *
   * @param v - The {@link Vec2} to scale the matrix by
   * @returns `this`
   */
  scale(e) {
    return ge.scale(this, this, e);
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
    return new ge();
  }
  /**
   * Creates a new {@link Mat2d} initialized with values from an existing matrix
   * @category Static
   *
   * @param a - Matrix to clone
   * @returns A new {@link Mat2d}
   */
  static clone(e) {
    return new ge(e);
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
    return new ge(...e);
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
    const s = n[0], i = n[1], r = n[2], c = n[3], a = n[4], h = n[5];
    let l = s * c - i * r;
    return l ? (l = 1 / l, e[0] = c * l, e[1] = -i * l, e[2] = -r * l, e[3] = s * l, e[4] = (r * h - c * a) * l, e[5] = (i * a - s * h) * l, e) : null;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = n[4], l = n[5], u = s[0], f = s[1], d = s[2], x = s[3], y = s[4], g = s[5];
    return e[0] = i * u + c * f, e[1] = r * u + a * f, e[2] = i * d + c * x, e[3] = r * d + a * x, e[4] = i * y + c * g + h, e[5] = r * y + a * g + l, e;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = n[4], l = n[5], u = s[0], f = s[1];
    return e[0] = i, e[1] = r, e[2] = c, e[3] = a, e[4] = i * u + c * f + h, e[5] = r * u + a * f + l, e;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = n[4], l = n[5], u = Math.sin(s), f = Math.cos(s);
    return e[0] = i * f + c * u, e[1] = r * f + a * u, e[2] = i * -u + c * f, e[3] = r * -u + a * f, e[4] = h, e[5] = l, e;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = n[4], l = n[5], u = s[0], f = s[1];
    return e[0] = i * u, e[1] = r * u, e[2] = c * f, e[3] = a * f, e[4] = h, e[5] = l, e;
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
    const s = e[0], i = e[1], r = e[2], c = e[3], a = e[4], h = e[5], l = n[0], u = n[1], f = n[2], d = n[3], x = n[4], y = n[5];
    return Math.abs(s - l) <= dt * Math.max(1, Math.abs(s), Math.abs(l)) && Math.abs(i - u) <= dt * Math.max(1, Math.abs(i), Math.abs(u)) && Math.abs(r - f) <= dt * Math.max(1, Math.abs(r), Math.abs(f)) && Math.abs(c - d) <= dt * Math.max(1, Math.abs(c), Math.abs(d)) && Math.abs(a - x) <= dt * Math.max(1, Math.abs(a), Math.abs(x)) && Math.abs(h - y) <= dt * Math.max(1, Math.abs(h), Math.abs(y));
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
ge.mul = ge.multiply;
ge.sub = ge.subtract;
const qu = ge, tr = new Float32Array([
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
        n === void 0 ? super(tr) : typeof n == "number" ? super([
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
        super(tr);
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
    return this.set(tr), this;
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
    const s = n[0], i = n[1], r = n[2], c = n[3], a = n[4], h = n[5], l = n[6], u = n[7], f = n[8], d = f * a - h * u, x = -f * c + h * l, y = u * c - a * l;
    let g = s * d + i * x + r * y;
    return g ? (g = 1 / g, e[0] = d * g, e[1] = (-f * i + r * u) * g, e[2] = (h * i - r * a) * g, e[3] = x * g, e[4] = (f * s - r * l) * g, e[5] = (-h * s + r * c) * g, e[6] = y * g, e[7] = (-u * s + i * l) * g, e[8] = (a * s - i * c) * g, e) : null;
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
    const s = n[0], i = n[1], r = n[2], c = n[3], a = n[4], h = n[5], l = n[6], u = n[7], f = n[8];
    return e[0] = a * f - h * u, e[1] = r * u - i * f, e[2] = i * h - r * a, e[3] = h * l - c * f, e[4] = s * f - r * l, e[5] = r * c - s * h, e[6] = c * u - a * l, e[7] = i * l - s * u, e[8] = s * a - i * c, e;
  }
  /**
   * Calculates the determinant of a {@link Mat3}
   * @category Static
   *
   * @param a - the source matrix
   * @returns determinant of a
   */
  static determinant(e) {
    const n = e[0], s = e[1], i = e[2], r = e[3], c = e[4], a = e[5], h = e[6], l = e[7], u = e[8];
    return n * (u * c - a * l) + s * (-u * r + a * h) + i * (l * r - c * h);
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = n[4], l = n[5], u = n[6], f = n[7], d = n[8];
    let x = s[0], y = s[1], g = s[2];
    return e[0] = x * i + y * a + g * u, e[1] = x * r + y * h + g * f, e[2] = x * c + y * l + g * d, x = s[3], y = s[4], g = s[5], e[3] = x * i + y * a + g * u, e[4] = x * r + y * h + g * f, e[5] = x * c + y * l + g * d, x = s[6], y = s[7], g = s[8], e[6] = x * i + y * a + g * u, e[7] = x * r + y * h + g * f, e[8] = x * c + y * l + g * d, e;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = n[4], l = n[5], u = n[6], f = n[7], d = n[8], x = s[0], y = s[1];
    return e[0] = i, e[1] = r, e[2] = c, e[3] = a, e[4] = h, e[5] = l, e[6] = x * i + y * a + u, e[7] = x * r + y * h + f, e[8] = x * c + y * l + d, e;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = n[4], l = n[5], u = n[6], f = n[7], d = n[8], x = Math.sin(s), y = Math.cos(s);
    return e[0] = y * i + x * a, e[1] = y * r + x * h, e[2] = y * c + x * l, e[3] = y * a - x * i, e[4] = y * h - x * r, e[5] = y * l - x * c, e[6] = u, e[7] = f, e[8] = d, e;
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
    const s = n[0], i = n[1], r = n[2], c = n[3], a = s + s, h = i + i, l = r + r, u = s * a, f = i * a, d = i * h, x = r * a, y = r * h, g = r * l, w = c * a, M = c * h, E = c * l;
    return e[0] = 1 - d - g, e[3] = f - E, e[6] = x + M, e[1] = f + E, e[4] = 1 - u - g, e[7] = y - w, e[2] = x - M, e[5] = y + w, e[8] = 1 - u - d, e;
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
    const s = n[0], i = n[1], r = n[2], c = n[4], a = n[5], h = n[6], l = n[8], u = n[9], f = n[10];
    return e[0] = a * f - h * u, e[1] = r * u - i * f, e[2] = i * h - r * a, e[3] = h * l - c * f, e[4] = s * f - r * l, e[5] = r * c - s * h, e[6] = c * u - a * l, e[7] = i * l - s * u, e[8] = s * a - i * c, e;
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
    const s = e[0], i = e[1], r = e[2], c = e[3], a = e[4], h = e[5], l = e[6], u = e[7], f = e[8], d = n[0], x = n[1], y = n[2], g = n[3], w = n[4], M = n[5], E = n[6], I = n[7], N = n[8];
    return Math.abs(s - d) <= dt * Math.max(1, Math.abs(s), Math.abs(d)) && Math.abs(i - x) <= dt * Math.max(1, Math.abs(i), Math.abs(x)) && Math.abs(r - y) <= dt * Math.max(1, Math.abs(r), Math.abs(y)) && Math.abs(c - g) <= dt * Math.max(1, Math.abs(c), Math.abs(g)) && Math.abs(a - w) <= dt * Math.max(1, Math.abs(a), Math.abs(w)) && Math.abs(h - M) <= dt * Math.max(1, Math.abs(h), Math.abs(M)) && Math.abs(l - E) <= dt * Math.max(1, Math.abs(l), Math.abs(E)) && Math.abs(u - I) <= dt * Math.max(1, Math.abs(u), Math.abs(I)) && Math.abs(f - N) <= dt * Math.max(1, Math.abs(f), Math.abs(N));
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
const Du = Xt, er = new Float32Array([
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
class Lt extends Float32Array {
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
        n === void 0 ? super(er) : typeof n == "number" ? super([
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
        super(er);
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
    return Lt.str(this);
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
    return this.set(er), this;
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
    return Lt.multiply(this, this, e);
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
    return Lt.transpose(this, this);
  }
  /**
   * Inverts this {@link Mat4}
   * Equivalent to `Mat4.invert(this, this);`
   *
   * @returns `this`
   */
  invert() {
    return Lt.invert(this, this);
  }
  /**
   * Translate this {@link Mat4} by the given vector
   * Equivalent to `Mat4.translate(this, this, v);`
   *
   * @param v - The {@link Vec3} to translate by
   * @returns `this`
   */
  translate(e) {
    return Lt.translate(this, this, e);
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
    return Lt.rotate(this, this, e, n);
  }
  /**
   * Scales this {@link Mat4} by the dimensions in the given vec3 not using vectorization
   * Equivalent to `Mat4.scale(this, this, v);`
   *
   * @param v - The {@link Vec3} to scale the matrix by
   * @returns `this`
   */
  scale(e) {
    return Lt.scale(this, this, e);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the X axis
   * Equivalent to `Mat4.rotateX(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateX(e) {
    return Lt.rotateX(this, this, e);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the Y axis
   * Equivalent to `Mat4.rotateY(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateY(e) {
    return Lt.rotateY(this, this, e);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the Z axis
   * Equivalent to `Mat4.rotateZ(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateZ(e) {
    return Lt.rotateZ(this, this, e);
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
    return Lt.perspectiveNO(this, e, n, s, i);
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
    return Lt.perspectiveZO(this, e, n, s, i);
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
    return Lt.orthoNO(this, e, n, s, i, r, c);
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
    return Lt.orthoZO(this, e, n, s, i, r, c);
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
    return new Lt();
  }
  /**
   * Creates a new {@link Mat4} initialized with values from an existing matrix
   * @category Static
   *
   * @param a - Matrix to clone
   * @returns A new {@link Mat4}
   */
  static clone(e) {
    return new Lt(e);
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
    return new Lt(...e);
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
      const s = n[1], i = n[2], r = n[3], c = n[6], a = n[7], h = n[11];
      e[1] = n[4], e[2] = n[8], e[3] = n[12], e[4] = s, e[6] = n[9], e[7] = n[13], e[8] = i, e[9] = c, e[11] = n[14], e[12] = r, e[13] = a, e[14] = h;
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
    const s = n[0], i = n[1], r = n[2], c = n[3], a = n[4], h = n[5], l = n[6], u = n[7], f = n[8], d = n[9], x = n[10], y = n[11], g = n[12], w = n[13], M = n[14], E = n[15], I = s * h - i * a, N = s * l - r * a, O = s * u - c * a, z = i * l - r * h, k = i * u - c * h, Y = r * u - c * l, H = f * w - d * g, $ = f * M - x * g, W = f * E - y * g, J = d * M - x * w, ot = d * E - y * w, K = x * E - y * M;
    let j = I * K - N * ot + O * J + z * W - k * $ + Y * H;
    return j ? (j = 1 / j, e[0] = (h * K - l * ot + u * J) * j, e[1] = (r * ot - i * K - c * J) * j, e[2] = (w * Y - M * k + E * z) * j, e[3] = (x * k - d * Y - y * z) * j, e[4] = (l * W - a * K - u * $) * j, e[5] = (s * K - r * W + c * $) * j, e[6] = (M * O - g * Y - E * N) * j, e[7] = (f * Y - x * O + y * N) * j, e[8] = (a * ot - h * W + u * H) * j, e[9] = (i * W - s * ot - c * H) * j, e[10] = (g * k - w * O + E * I) * j, e[11] = (d * O - f * k - y * I) * j, e[12] = (h * $ - a * J - l * H) * j, e[13] = (s * J - i * $ + r * H) * j, e[14] = (w * N - g * z - M * I) * j, e[15] = (f * z - d * N + x * I) * j, e) : null;
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
    const s = n[0], i = n[1], r = n[2], c = n[3], a = n[4], h = n[5], l = n[6], u = n[7], f = n[8], d = n[9], x = n[10], y = n[11], g = n[12], w = n[13], M = n[14], E = n[15], I = s * h - i * a, N = s * l - r * a, O = s * u - c * a, z = i * l - r * h, k = i * u - c * h, Y = r * u - c * l, H = f * w - d * g, $ = f * M - x * g, W = f * E - y * g, J = d * M - x * w, ot = d * E - y * w, K = x * E - y * M;
    return e[0] = h * K - l * ot + u * J, e[1] = r * ot - i * K - c * J, e[2] = w * Y - M * k + E * z, e[3] = x * k - d * Y - y * z, e[4] = l * W - a * K - u * $, e[5] = s * K - r * W + c * $, e[6] = M * O - g * Y - E * N, e[7] = f * Y - x * O + y * N, e[8] = a * ot - h * W + u * H, e[9] = i * W - s * ot - c * H, e[10] = g * k - w * O + E * I, e[11] = d * O - f * k - y * I, e[12] = h * $ - a * J - l * H, e[13] = s * J - i * $ + r * H, e[14] = w * N - g * z - M * I, e[15] = f * z - d * N + x * I, e;
  }
  /**
   * Calculates the determinant of a {@link Mat4}
   * @category Static
   *
   * @param a - the source matrix
   * @returns determinant of a
   */
  static determinant(e) {
    const n = e[0], s = e[1], i = e[2], r = e[3], c = e[4], a = e[5], h = e[6], l = e[7], u = e[8], f = e[9], d = e[10], x = e[11], y = e[12], g = e[13], w = e[14], M = e[15], E = n * a - s * c, I = n * h - i * c, N = s * h - i * a, O = u * g - f * y, z = u * w - d * y, k = f * w - d * g, Y = n * k - s * z + i * O, H = c * k - a * z + h * O, $ = u * N - f * I + d * E, W = y * N - g * I + w * E;
    return l * Y - r * H + M * $ - x * W;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = n[4], l = n[5], u = n[6], f = n[7], d = n[8], x = n[9], y = n[10], g = n[11], w = n[12], M = n[13], E = n[14], I = n[15];
    let N = s[0], O = s[1], z = s[2], k = s[3];
    return e[0] = N * i + O * h + z * d + k * w, e[1] = N * r + O * l + z * x + k * M, e[2] = N * c + O * u + z * y + k * E, e[3] = N * a + O * f + z * g + k * I, N = s[4], O = s[5], z = s[6], k = s[7], e[4] = N * i + O * h + z * d + k * w, e[5] = N * r + O * l + z * x + k * M, e[6] = N * c + O * u + z * y + k * E, e[7] = N * a + O * f + z * g + k * I, N = s[8], O = s[9], z = s[10], k = s[11], e[8] = N * i + O * h + z * d + k * w, e[9] = N * r + O * l + z * x + k * M, e[10] = N * c + O * u + z * y + k * E, e[11] = N * a + O * f + z * g + k * I, N = s[12], O = s[13], z = s[14], k = s[15], e[12] = N * i + O * h + z * d + k * w, e[13] = N * r + O * l + z * x + k * M, e[14] = N * c + O * u + z * y + k * E, e[15] = N * a + O * f + z * g + k * I, e;
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
      const a = n[0], h = n[1], l = n[2], u = n[3], f = n[4], d = n[5], x = n[6], y = n[7], g = n[8], w = n[9], M = n[10], E = n[11];
      e[0] = a, e[1] = h, e[2] = l, e[3] = u, e[4] = f, e[5] = d, e[6] = x, e[7] = y, e[8] = g, e[9] = w, e[10] = M, e[11] = E, e[12] = a * i + f * r + g * c + n[12], e[13] = h * i + d * r + w * c + n[13], e[14] = l * i + x * r + M * c + n[14], e[15] = u * i + y * r + E * c + n[15];
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
    let r = i[0], c = i[1], a = i[2], h = Math.sqrt(r * r + c * c + a * a);
    if (h < dt)
      return null;
    h = 1 / h, r *= h, c *= h, a *= h;
    const l = Math.sin(s), u = Math.cos(s), f = 1 - u, d = n[0], x = n[1], y = n[2], g = n[3], w = n[4], M = n[5], E = n[6], I = n[7], N = n[8], O = n[9], z = n[10], k = n[11], Y = r * r * f + u, H = c * r * f + a * l, $ = a * r * f - c * l, W = r * c * f - a * l, J = c * c * f + u, ot = a * c * f + r * l, K = r * a * f + c * l, j = c * a * f - r * l, V = a * a * f + u;
    return e[0] = d * Y + w * H + N * $, e[1] = x * Y + M * H + O * $, e[2] = y * Y + E * H + z * $, e[3] = g * Y + I * H + k * $, e[4] = d * W + w * J + N * ot, e[5] = x * W + M * J + O * ot, e[6] = y * W + E * J + z * ot, e[7] = g * W + I * J + k * ot, e[8] = d * K + w * j + N * V, e[9] = x * K + M * j + O * V, e[10] = y * K + E * j + z * V, e[11] = g * K + I * j + k * V, n !== e && (e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15]), e;
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
    let i = Math.sin(s), r = Math.cos(s), c = n[4], a = n[5], h = n[6], l = n[7], u = n[8], f = n[9], d = n[10], x = n[11];
    return n !== e && (e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15]), e[4] = c * r + u * i, e[5] = a * r + f * i, e[6] = h * r + d * i, e[7] = l * r + x * i, e[8] = u * r - c * i, e[9] = f * r - a * i, e[10] = d * r - h * i, e[11] = x * r - l * i, e;
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
    let i = Math.sin(s), r = Math.cos(s), c = n[0], a = n[1], h = n[2], l = n[3], u = n[8], f = n[9], d = n[10], x = n[11];
    return n !== e && (e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15]), e[0] = c * r - u * i, e[1] = a * r - f * i, e[2] = h * r - d * i, e[3] = l * r - x * i, e[8] = c * i + u * r, e[9] = a * i + f * r, e[10] = h * i + d * r, e[11] = l * i + x * r, e;
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
    let i = Math.sin(s), r = Math.cos(s), c = n[0], a = n[1], h = n[2], l = n[3], u = n[4], f = n[5], d = n[6], x = n[7];
    return n !== e && (e[8] = n[8], e[9] = n[9], e[10] = n[10], e[11] = n[11], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15]), e[0] = c * r + u * i, e[1] = a * r + f * i, e[2] = h * r + d * i, e[3] = l * r + x * i, e[4] = u * r - c * i, e[5] = f * r - a * i, e[6] = d * r - h * i, e[7] = x * r - l * i, e;
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
    const h = Math.sin(n), l = Math.cos(n), u = 1 - l;
    return e[0] = i * i * u + l, e[1] = r * i * u + c * h, e[2] = c * i * u - r * h, e[3] = 0, e[4] = i * r * u - c * h, e[5] = r * r * u + l, e[6] = c * r * u + i * h, e[7] = 0, e[8] = i * c * u + r * h, e[9] = r * c * u - i * h, e[10] = c * c * u + l, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = i + i, l = r + r, u = c + c, f = i * h, d = i * l, x = i * u, y = r * l, g = r * u, w = c * u, M = a * h, E = a * l, I = a * u;
    return e[0] = 1 - (y + w), e[1] = d + I, e[2] = x - E, e[3] = 0, e[4] = d - I, e[5] = 1 - (f + w), e[6] = g + M, e[7] = 0, e[8] = x + E, e[9] = g - M, e[10] = 1 - (f + y), e[11] = 0, e[12] = s[0], e[13] = s[1], e[14] = s[2], e[15] = 1, e;
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
    const s = -n[0], i = -n[1], r = -n[2], c = n[3], a = n[4], h = n[5], l = n[6], u = n[7];
    let f = s * s + i * i + r * r + c * c;
    return f > 0 ? (Ie[0] = (a * c + u * s + h * r - l * i) * 2 / f, Ie[1] = (h * c + u * i + l * s - a * r) * 2 / f, Ie[2] = (l * c + u * r + a * i - h * s) * 2 / f) : (Ie[0] = (a * c + u * s + h * r - l * i) * 2, Ie[1] = (h * c + u * i + l * s - a * r) * 2, Ie[2] = (l * c + u * r + a * i - h * s) * 2), Lt.fromRotationTranslation(e, n, Ie), e;
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
    const s = n[0], i = n[1], r = n[2], c = n[4], a = n[5], h = n[6], l = n[8], u = n[9], f = n[10];
    return e[0] = a * f - h * u, e[1] = r * u - i * f, e[2] = i * h - r * a, e[3] = 0, e[4] = h * l - c * f, e[5] = s * f - r * l, e[6] = r * c - s * h, e[7] = 0, e[8] = c * u - a * l, e[9] = i * l - s * u, e[10] = s * a - i * c, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
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
    const s = n[0], i = n[1], r = n[2], c = n[4], a = n[5], h = n[6], l = n[8], u = n[9], f = n[10];
    return e[0] = Math.sqrt(s * s + i * i + r * r), e[1] = Math.sqrt(c * c + a * a + h * h), e[2] = Math.sqrt(l * l + u * u + f * f), e;
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
    Lt.getScaling(Ie, n);
    const s = 1 / Ie[0], i = 1 / Ie[1], r = 1 / Ie[2], c = n[0] * s, a = n[1] * i, h = n[2] * r, l = n[4] * s, u = n[5] * i, f = n[6] * r, d = n[8] * s, x = n[9] * i, y = n[10] * r, g = c + u + y;
    let w = 0;
    return g > 0 ? (w = Math.sqrt(g + 1) * 2, e[3] = 0.25 * w, e[0] = (f - x) / w, e[1] = (d - h) / w, e[2] = (a - l) / w) : c > u && c > y ? (w = Math.sqrt(1 + c - u - y) * 2, e[3] = (f - x) / w, e[0] = 0.25 * w, e[1] = (a + l) / w, e[2] = (d + h) / w) : u > y ? (w = Math.sqrt(1 + u - c - y) * 2, e[3] = (d - h) / w, e[0] = (a + l) / w, e[1] = 0.25 * w, e[2] = (f + x) / w) : (w = Math.sqrt(1 + y - c - u) * 2, e[3] = (a - l) / w, e[0] = (d + h) / w, e[1] = (f + x) / w, e[2] = 0.25 * w), e;
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
    const r = i[0], c = i[1], a = i[2], h = i[4], l = i[5], u = i[6], f = i[8], d = i[9], x = i[10];
    s[0] = Math.sqrt(r * r + c * c + a * a), s[1] = Math.sqrt(h * h + l * l + u * u), s[2] = Math.sqrt(f * f + d * d + x * x);
    const y = 1 / s[0], g = 1 / s[1], w = 1 / s[2], M = r * y, E = c * g, I = a * w, N = h * y, O = l * g, z = u * w, k = f * y, Y = d * g, H = x * w, $ = M + O + H;
    let W = 0;
    return $ > 0 ? (W = Math.sqrt($ + 1) * 2, e[3] = 0.25 * W, e[0] = (z - Y) / W, e[1] = (k - I) / W, e[2] = (E - N) / W) : M > O && M > H ? (W = Math.sqrt(1 + M - O - H) * 2, e[3] = (z - Y) / W, e[0] = 0.25 * W, e[1] = (E + N) / W, e[2] = (k + I) / W) : O > H ? (W = Math.sqrt(1 + O - M - H) * 2, e[3] = (k - I) / W, e[0] = (E + N) / W, e[1] = 0.25 * W, e[2] = (z + Y) / W) : (W = Math.sqrt(1 + H - M - O) * 2, e[3] = (E - N) / W, e[0] = (k + I) / W, e[1] = (z + Y) / W, e[2] = 0.25 * W), e;
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
    const r = n[0], c = n[1], a = n[2], h = n[3], l = r + r, u = c + c, f = a + a, d = r * l, x = r * u, y = r * f, g = c * u, w = c * f, M = a * f, E = h * l, I = h * u, N = h * f, O = i[0], z = i[1], k = i[2];
    return e[0] = (1 - (g + M)) * O, e[1] = (x + N) * O, e[2] = (y - I) * O, e[3] = 0, e[4] = (x - N) * z, e[5] = (1 - (d + M)) * z, e[6] = (w + E) * z, e[7] = 0, e[8] = (y + I) * k, e[9] = (w - E) * k, e[10] = (1 - (d + g)) * k, e[11] = 0, e[12] = s[0], e[13] = s[1], e[14] = s[2], e[15] = 1, e;
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
    const c = n[0], a = n[1], h = n[2], l = n[3], u = c + c, f = a + a, d = h + h, x = c * u, y = c * f, g = c * d, w = a * f, M = a * d, E = h * d, I = l * u, N = l * f, O = l * d, z = i[0], k = i[1], Y = i[2], H = r[0], $ = r[1], W = r[2], J = (1 - (w + E)) * z, ot = (y + O) * z, K = (g - N) * z, j = (y - O) * k, V = (1 - (x + E)) * k, at = (M + I) * k, pt = (g + N) * Y, At = (M - I) * Y, vt = (1 - (x + w)) * Y;
    return e[0] = J, e[1] = ot, e[2] = K, e[3] = 0, e[4] = j, e[5] = V, e[6] = at, e[7] = 0, e[8] = pt, e[9] = At, e[10] = vt, e[11] = 0, e[12] = s[0] + H - (J * H + j * $ + pt * W), e[13] = s[1] + $ - (ot * H + V * $ + At * W), e[14] = s[2] + W - (K * H + at * $ + vt * W), e[15] = 1, e;
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
    const s = n[0], i = n[1], r = n[2], c = n[3], a = s + s, h = i + i, l = r + r, u = s * a, f = i * a, d = i * h, x = r * a, y = r * h, g = r * l, w = c * a, M = c * h, E = c * l;
    return e[0] = 1 - d - g, e[1] = f + E, e[2] = x - M, e[3] = 0, e[4] = f - E, e[5] = 1 - u - g, e[6] = y + w, e[7] = 0, e[8] = x + M, e[9] = y - w, e[10] = 1 - u - d, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
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
    const h = 1 / (s - n), l = 1 / (r - i);
    if (e[0] = c * 2 * h, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = c * 2 * l, e[6] = 0, e[7] = 0, e[8] = (s + n) * h, e[9] = (r + i) * l, e[11] = -1, e[12] = 0, e[13] = 0, e[15] = 0, a != null && a !== 1 / 0) {
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
    const h = 1 / (s - n), l = 1 / (r - i);
    if (e[0] = c * 2 * h, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = c * 2 * l, e[6] = 0, e[7] = 0, e[8] = (s + n) * h, e[9] = (r + i) * l, e[11] = -1, e[12] = 0, e[13] = 0, e[15] = 0, a != null && a !== 1 / 0) {
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
    const r = Math.tan(n.upDegrees * Math.PI / 180), c = Math.tan(n.downDegrees * Math.PI / 180), a = Math.tan(n.leftDegrees * Math.PI / 180), h = Math.tan(n.rightDegrees * Math.PI / 180), l = 2 / (a + h), u = 2 / (r + c);
    return e[0] = l, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = u, e[6] = 0, e[7] = 0, e[8] = -((a - h) * l * 0.5), e[9] = (r - c) * u * 0.5, e[10] = i / (s - i), e[11] = -1, e[12] = 0, e[13] = 0, e[14] = i * s / (s - i), e[15] = 0, e;
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
    const h = 1 / (n - s), l = 1 / (i - r), u = 1 / (c - a);
    return e[0] = -2 * h, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = -2 * l, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 2 * u, e[11] = 0, e[12] = (n + s) * h, e[13] = (r + i) * l, e[14] = (a + c) * u, e[15] = 1, e;
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
    const h = 1 / (n - s), l = 1 / (i - r), u = 1 / (c - a);
    return e[0] = -2 * h, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = -2 * l, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = u, e[11] = 0, e[12] = (n + s) * h, e[13] = (r + i) * l, e[14] = c * u, e[15] = 1, e;
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
    const r = n[0], c = n[1], a = n[2], h = i[0], l = i[1], u = i[2], f = s[0], d = s[1], x = s[2];
    if (Math.abs(r - f) < dt && Math.abs(c - d) < dt && Math.abs(a - x) < dt)
      return Lt.identity(e);
    let y = r - f, g = c - d, w = a - x, M = 1 / Math.sqrt(y * y + g * g + w * w);
    y *= M, g *= M, w *= M;
    let E = l * w - u * g, I = u * y - h * w, N = h * g - l * y;
    M = Math.sqrt(E * E + I * I + N * N), M ? (M = 1 / M, E *= M, I *= M, N *= M) : (E = 0, I = 0, N = 0);
    let O = g * N - w * I, z = w * E - y * N, k = y * I - g * E;
    return M = Math.sqrt(O * O + z * z + k * k), M ? (M = 1 / M, O *= M, z *= M, k *= M) : (O = 0, z = 0, k = 0), e[0] = E, e[1] = O, e[2] = y, e[3] = 0, e[4] = I, e[5] = z, e[6] = g, e[7] = 0, e[8] = N, e[9] = k, e[10] = w, e[11] = 0, e[12] = -(E * r + I * c + N * a), e[13] = -(O * r + z * c + k * a), e[14] = -(y * r + g * c + w * a), e[15] = 1, e;
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
    const r = n[0], c = n[1], a = n[2], h = i[0], l = i[1], u = i[2];
    let f = r - s[0], d = c - s[1], x = a - s[2], y = f * f + d * d + x * x;
    y > 0 && (y = 1 / Math.sqrt(y), f *= y, d *= y, x *= y);
    let g = l * x - u * d, w = u * f - h * x, M = h * d - l * f;
    return y = g * g + w * w + M * M, y > 0 && (y = 1 / Math.sqrt(y), g *= y, w *= y, M *= y), e[0] = g, e[1] = w, e[2] = M, e[3] = 0, e[4] = d * M - x * w, e[5] = x * g - f * M, e[6] = f * w - d * g, e[7] = 0, e[8] = f, e[9] = d, e[10] = x, e[11] = 0, e[12] = r, e[13] = c, e[14] = a, e[15] = 1, e;
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
    const s = e[0], i = e[1], r = e[2], c = e[3], a = e[4], h = e[5], l = e[6], u = e[7], f = e[8], d = e[9], x = e[10], y = e[11], g = e[12], w = e[13], M = e[14], E = e[15], I = n[0], N = n[1], O = n[2], z = n[3], k = n[4], Y = n[5], H = n[6], $ = n[7], W = n[8], J = n[9], ot = n[10], K = n[11], j = n[12], V = n[13], at = n[14], pt = n[15];
    return Math.abs(s - I) <= dt * Math.max(1, Math.abs(s), Math.abs(I)) && Math.abs(i - N) <= dt * Math.max(1, Math.abs(i), Math.abs(N)) && Math.abs(r - O) <= dt * Math.max(1, Math.abs(r), Math.abs(O)) && Math.abs(c - z) <= dt * Math.max(1, Math.abs(c), Math.abs(z)) && Math.abs(a - k) <= dt * Math.max(1, Math.abs(a), Math.abs(k)) && Math.abs(h - Y) <= dt * Math.max(1, Math.abs(h), Math.abs(Y)) && Math.abs(l - H) <= dt * Math.max(1, Math.abs(l), Math.abs(H)) && Math.abs(u - $) <= dt * Math.max(1, Math.abs(u), Math.abs($)) && Math.abs(f - W) <= dt * Math.max(1, Math.abs(f), Math.abs(W)) && Math.abs(d - J) <= dt * Math.max(1, Math.abs(d), Math.abs(J)) && Math.abs(x - ot) <= dt * Math.max(1, Math.abs(x), Math.abs(ot)) && Math.abs(y - K) <= dt * Math.max(1, Math.abs(y), Math.abs(K)) && Math.abs(g - j) <= dt * Math.max(1, Math.abs(g), Math.abs(j)) && Math.abs(w - V) <= dt * Math.max(1, Math.abs(w), Math.abs(V)) && Math.abs(M - at) <= dt * Math.max(1, Math.abs(M), Math.abs(at)) && Math.abs(E - pt) <= dt * Math.max(1, Math.abs(E), Math.abs(pt));
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
const Ie = new Float32Array(3);
Lt.prototype.mul = Lt.prototype.multiply;
Lt.sub = Lt.subtract;
Lt.mul = Lt.multiply;
Lt.frustum = Lt.frustumNO;
Lt.perspective = Lt.perspectiveNO;
Lt.ortho = Lt.orthoNO;
Lt.normalFromMat4Fast = Lt.normalFromMat4;
const Ou = Lt;
class Tt extends Float32Array {
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
    return Tt.str(this);
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
    return Tt.distance(this, e);
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
    return Tt.squaredDistance(this, e);
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
    return Tt.normalize(this, this);
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
    return new Tt();
  }
  /**
   * Creates a new vec3 initialized with values from an existing vector
   * @category Static
   *
   * @param a - vector to clone
   * @returns a new 3D vector
   */
  static clone(e) {
    return new Tt(e);
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
    return new Tt(e, n, s);
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
    const i = n[0], r = n[1], c = n[2], a = s[0], h = s[1], l = s[2];
    return e[0] = r * l - c * h, e[1] = c * a - i * l, e[2] = i * h - r * a, e;
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
    const r = Math.acos(Math.min(Math.max(Tt.dot(n, s), -1), 1)), c = Math.sin(r), a = Math.sin((1 - i) * r) / c, h = Math.sin(i * r) / c;
    return e[0] = a * n[0] + h * s[0], e[1] = a * n[1] + h * s[1], e[2] = a * n[2] + h * s[2], e;
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
    const a = c * c, h = a * (2 * c - 3) + 1, l = a * (c - 2) + c, u = a * (c - 1), f = a * (3 - 2 * c);
    return e[0] = n[0] * h + s[0] * l + i[0] * u + r[0] * f, e[1] = n[1] * h + s[1] * l + i[1] * u + r[1] * f, e[2] = n[2] * h + s[2] * l + i[2] * u + r[2] * f, e;
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
    const a = 1 - c, h = a * a, l = c * c, u = h * a, f = 3 * c * h, d = 3 * l * a, x = l * c;
    return e[0] = n[0] * u + s[0] * f + i[0] * d + r[0] * x, e[1] = n[1] * u + s[1] * f + i[1] * d + r[1] * x, e[2] = n[2] * u + s[2] * f + i[2] * d + r[2] * x, e;
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
    const i = s[0], r = s[1], c = s[2], a = s[3] * 2, h = n[0], l = n[1], u = n[2], f = r * u - c * l, d = c * h - i * u, x = i * l - r * h, y = (r * x - c * d) * 2, g = (c * f - i * x) * 2, w = (i * d - r * f) * 2;
    return e[0] = h + f * a + y, e[1] = l + d * a + g, e[2] = u + x * a + w, e;
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
    const r = s[1], c = s[2], a = n[1] - r, h = n[2] - c;
    return e[0] = n[0], e[1] = a * Math.cos(i) - h * Math.sin(i) + r, e[2] = a * Math.sin(i) + h * Math.cos(i) + c, e;
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
    const r = s[0], c = s[2], a = n[0] - r, h = n[2] - c;
    return e[0] = h * Math.sin(i) + a * Math.cos(i) + r, e[1] = n[1], e[2] = h * Math.cos(i) - a * Math.sin(i) + c, e;
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
    const r = s[0], c = s[1], a = n[0] - r, h = n[1] - c;
    return e[0] = a * Math.cos(i) - h * Math.sin(i) + r, e[1] = a * Math.sin(i) + h * Math.cos(i) + c, e[2] = s[2], e;
  }
  /**
   * Get the angle between two 3D vectors
   * @param a - The first operand
   * @param b - The second operand
   * @returns The angle in radians
   */
  static angle(e, n) {
    const s = e[0], i = e[1], r = e[2], c = n[0], a = n[1], h = n[2], l = Math.sqrt((s * s + i * i + r * r) * (c * c + a * a + h * h)), u = l && Tt.dot(e, n) / l;
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
    const s = e[0], i = e[1], r = e[2], c = n[0], a = n[1], h = n[2];
    return Math.abs(s - c) <= dt * Math.max(1, Math.abs(s), Math.abs(c)) && Math.abs(i - a) <= dt * Math.max(1, Math.abs(i), Math.abs(a)) && Math.abs(r - h) <= dt * Math.max(1, Math.abs(r), Math.abs(h));
  }
}
Tt.prototype.sub = Tt.prototype.subtract;
Tt.prototype.mul = Tt.prototype.multiply;
Tt.prototype.div = Tt.prototype.divide;
Tt.prototype.dist = Tt.prototype.distance;
Tt.prototype.sqrDist = Tt.prototype.squaredDistance;
Tt.sub = Tt.subtract;
Tt.mul = Tt.multiply;
Tt.div = Tt.divide;
Tt.dist = Tt.distance;
Tt.sqrDist = Tt.squaredDistance;
Tt.sqrLen = Tt.squaredLength;
Tt.mag = Tt.magnitude;
Tt.length = Tt.magnitude;
Tt.len = Tt.magnitude;
const ku = Tt;
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
    const r = s[0] * i[1] - s[1] * i[0], c = s[0] * i[2] - s[2] * i[0], a = s[0] * i[3] - s[3] * i[0], h = s[1] * i[2] - s[2] * i[1], l = s[1] * i[3] - s[3] * i[1], u = s[2] * i[3] - s[3] * i[2], f = n[0], d = n[1], x = n[2], y = n[3];
    return e[0] = d * u - x * l + y * h, e[1] = -(f * u) + x * a - y * c, e[2] = f * l - d * a + y * r, e[3] = -(f * h) + d * c - x * r, e;
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
    const r = n[0], c = n[1], a = n[2], h = n[3];
    return e[0] = r + i * (s[0] - r), e[1] = c + i * (s[1] - c), e[2] = a + i * (s[2] - a), e[3] = h + i * (s[3] - h), e;
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
    const i = n[0], r = n[1], c = n[2], a = s[0], h = s[1], l = s[2], u = s[3], f = u * i + h * c - l * r, d = u * r + l * i - a * c, x = u * c + a * r - h * i, y = -a * i - h * r - l * c;
    return e[0] = f * u + y * -a + d * -l - x * -h, e[1] = d * u + y * -h + x * -a - f * -l, e[2] = x * u + y * -l + f * -h - d * -a, e[3] = n[3], e;
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
    const s = e[0], i = e[1], r = e[2], c = e[3], a = n[0], h = n[1], l = n[2], u = n[3];
    return Math.abs(s - a) <= dt * Math.max(1, Math.abs(s), Math.abs(a)) && Math.abs(i - h) <= dt * Math.max(1, Math.abs(i), Math.abs(h)) && Math.abs(r - l) <= dt * Math.max(1, Math.abs(r), Math.abs(l)) && Math.abs(c - u) <= dt * Math.max(1, Math.abs(c), Math.abs(u));
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
const Ru = bt, nr = new Float32Array([
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
        n === void 0 ? super(nr) : typeof n == "number" ? super([n, n, n, n]) : super(n, 0, 4);
        break;
      }
      default:
        super(nr);
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
    return this.set(nr), this;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = s[0], l = s[1], u = s[2], f = s[3];
    return e[0] = i * f + a * h + r * u - c * l, e[1] = r * f + a * l + c * h - i * u, e[2] = c * f + a * u + i * l - r * h, e[3] = a * f - i * h - r * l - c * u, e;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = Math.sin(s), l = Math.cos(s);
    return e[0] = i * l + a * h, e[1] = r * l + c * h, e[2] = c * l - r * h, e[3] = a * l - i * h, e;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = Math.sin(s), l = Math.cos(s);
    return e[0] = i * l - c * h, e[1] = r * l + a * h, e[2] = c * l + i * h, e[3] = a * l - r * h, e;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = Math.sin(s), l = Math.cos(s);
    return e[0] = i * l + r * h, e[1] = r * l - i * h, e[2] = c * l + a * h, e[3] = a * l - c * h, e;
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
    const s = n[0], i = n[1], r = n[2], c = n[3], a = Math.sqrt(s * s + i * i + r * r), h = Math.exp(c), l = a > 0 ? h * Math.sin(a) / a : 0;
    return e[0] = s * l, e[1] = i * l, e[2] = r * l, e[3] = h * Math.cos(a), e;
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
    const s = n[0], i = n[1], r = n[2], c = n[3], a = Math.sqrt(s * s + i * i + r * r), h = a > 0 ? Math.atan2(a, c) / a : 0;
    return e[0] = s * h, e[1] = i * h, e[2] = r * h, e[3] = 0.5 * Math.log(s * s + i * i + r * r + c * c), e;
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
    const r = n[0], c = n[1], a = n[2], h = n[3];
    let l = s[0], u = s[1], f = s[2], d = s[3], x, y, g = r * l + c * u + a * f + h * d;
    if (g < 0 && (g = -g, l = -l, u = -u, f = -f, d = -d), 1 - g > dt) {
      const w = Math.acos(g), M = Math.sin(w);
      x = Math.sin((1 - i) * w) / M, y = Math.sin(i * w) / M;
    } else
      x = 1 - i, y = i;
    return e[0] = x * r + y * l, e[1] = x * c + y * u, e[2] = x * a + y * f, e[3] = x * h + y * d, e;
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
    const s = n[0], i = n[1], r = n[2], c = n[3], a = s * s + i * i + r * r + c * c, h = a ? 1 / a : 0;
    return e[0] = -s * h, e[1] = -i * h, e[2] = -r * h, e[3] = c * h, e;
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
  static fromEuler(e, n, s, i, r = Xh) {
    let c = 0.5 * Math.PI / 180;
    n *= c, s *= c, i *= c;
    let a = Math.sin(n), h = Math.cos(n), l = Math.sin(s), u = Math.cos(s), f = Math.sin(i), d = Math.cos(i);
    switch (r) {
      case "xyz":
        e[0] = a * u * d + h * l * f, e[1] = h * l * d - a * u * f, e[2] = h * u * f + a * l * d, e[3] = h * u * d - a * l * f;
        break;
      case "xzy":
        e[0] = a * u * d - h * l * f, e[1] = h * l * d - a * u * f, e[2] = h * u * f + a * l * d, e[3] = h * u * d + a * l * f;
        break;
      case "yxz":
        e[0] = a * u * d + h * l * f, e[1] = h * l * d - a * u * f, e[2] = h * u * f - a * l * d, e[3] = h * u * d + a * l * f;
        break;
      case "yzx":
        e[0] = a * u * d + h * l * f, e[1] = h * l * d + a * u * f, e[2] = h * u * f - a * l * d, e[3] = h * u * d - a * l * f;
        break;
      case "zxy":
        e[0] = a * u * d - h * l * f, e[1] = h * l * d + a * u * f, e[2] = h * u * f + a * l * d, e[3] = h * u * d - a * l * f;
        break;
      case "zyx":
        e[0] = a * u * d - h * l * f, e[1] = h * l * d + a * u * f, e[2] = h * u * f - a * l * d, e[3] = h * u * d + a * l * f;
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
    let i = Tt.dot(n, s);
    return i < -0.999999 ? (Tt.cross(Ce, zu, n), Tt.mag(Ce) < 1e-6 && Tt.cross(Ce, Nu, n), Tt.normalize(Ce, Ce), wt.setAxisAngle(e, Ce, Math.PI), e) : i > 0.999999 ? (e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, e) : (Tt.cross(Ce, n, s), e[0] = Ce[0], e[1] = Ce[1], e[2] = Ce[2], e[3] = 1 + i, wt.normalize(e, e));
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
    return wt.slerp(Xo, n, r, c), wt.slerp(Wo, s, i, c), wt.slerp(e, Xo, Wo, 2 * c * (1 - c)), e;
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
    return Ne[0] = s[0], Ne[3] = s[1], Ne[6] = s[2], Ne[1] = i[0], Ne[4] = i[1], Ne[7] = i[2], Ne[2] = -n[0], Ne[5] = -n[1], Ne[8] = -n[2], wt.normalize(e, wt.fromMat3(e, Ne));
  }
}
const Xo = new Float32Array(4), Wo = new Float32Array(4), Ne = new Float32Array(9), Ce = new Float32Array(3), zu = new Float32Array([1, 0, 0]), Nu = new Float32Array([0, 1, 0]);
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
const Cu = wt, $o = new Float32Array([
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
        n === void 0 ? super($o) : typeof n == "number" ? super([n, n, n, n, n, n, n, n]) : super(n, 0, 8);
        break;
      }
      default:
        super($o);
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
  static fromValues(e, n, s, i, r, c, a, h) {
    return new Wt(e, n, s, i, r, c, a, h);
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
    const h = r * 0.5, l = c * 0.5, u = a * 0.5;
    return new Wt(
      e,
      n,
      s,
      i,
      h * i + l * s - u * n,
      l * i + u * e - h * s,
      u * i + h * n - l * e,
      -h * e - l * n - u * s
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
    const i = s[0] * 0.5, r = s[1] * 0.5, c = s[2] * 0.5, a = n[0], h = n[1], l = n[2], u = n[3];
    return e[0] = a, e[1] = h, e[2] = l, e[3] = u, e[4] = i * u + r * l - c * h, e[5] = r * u + c * a - i * l, e[6] = c * u + i * h - r * a, e[7] = -i * a - r * h - c * l, e;
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
    return Lt.getRotation(jo, n), Lt.getTranslation(Go, n), Wt.fromRotationTranslation(e, jo, Go);
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
  static set(e, n, s, i, r, c, a, h, l) {
    return e[0] = n, e[1] = s, e[2] = i, e[3] = r, e[4] = c, e[5] = a, e[6] = h, e[7] = l, e;
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
    const s = n[4], i = n[5], r = n[6], c = n[7], a = -n[0], h = -n[1], l = -n[2], u = n[3];
    return e[0] = (s * u + c * a + i * l - r * h) * 2, e[1] = (i * u + c * h + r * a - s * l) * 2, e[2] = (r * u + c * l + s * h - i * a) * 2, e;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = s[0] * 0.5, l = s[1] * 0.5, u = s[2] * 0.5, f = n[4], d = n[5], x = n[6], y = n[7];
    return e[0] = i, e[1] = r, e[2] = c, e[3] = a, e[4] = a * h + r * u - c * l + f, e[5] = a * l + c * h - i * u + d, e[6] = a * u + i * l - r * h + x, e[7] = -i * h - r * l - c * u + y, e;
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
    const h = n[4], l = n[5], u = n[6], f = n[7], d = h * a + f * i + l * c - u * r, x = l * a + f * r + u * i - h * c, y = u * a + f * c + h * r - l * i, g = f * a - h * i - l * r - u * c;
    return wt.rotateX(e, n, s), i = e[0], r = e[1], c = e[2], a = e[3], e[4] = d * a + g * i + x * c - y * r, e[5] = x * a + g * r + y * i - d * c, e[6] = y * a + g * c + d * r - x * i, e[7] = g * a - d * i - x * r - y * c, e;
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
    const h = n[4], l = n[5], u = n[6], f = n[7], d = h * a + f * i + l * c - u * r, x = l * a + f * r + u * i - h * c, y = u * a + f * c + h * r - l * i, g = f * a - h * i - l * r - u * c;
    return wt.rotateY(e, n, s), i = e[0], r = e[1], c = e[2], a = e[3], e[4] = d * a + g * i + x * c - y * r, e[5] = x * a + g * r + y * i - d * c, e[6] = y * a + g * c + d * r - x * i, e[7] = g * a - d * i - x * r - y * c, e;
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
    const h = n[4], l = n[5], u = n[6], f = n[7], d = h * a + f * i + l * c - u * r, x = l * a + f * r + u * i - h * c, y = u * a + f * c + h * r - l * i, g = f * a - h * i - l * r - u * c;
    return wt.rotateZ(e, n, s), i = e[0], r = e[1], c = e[2], a = e[3], e[4] = d * a + g * i + x * c - y * r, e[5] = x * a + g * r + y * i - d * c, e[6] = y * a + g * c + d * r - x * i, e[7] = g * a - d * i - x * r - y * c, e;
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
    let h = n[0], l = n[1], u = n[2], f = n[3];
    return e[0] = h * a + f * i + l * c - u * r, e[1] = l * a + f * r + u * i - h * c, e[2] = u * a + f * c + h * r - l * i, e[3] = f * a - h * i - l * r - u * c, h = n[4], l = n[5], u = n[6], f = n[7], e[4] = h * a + f * i + l * c - u * r, e[5] = l * a + f * r + u * i - h * c, e[6] = u * a + f * c + h * r - l * i, e[7] = f * a - h * i - l * r - u * c, e;
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
    let h = s[0], l = s[1], u = s[2], f = s[3];
    return e[0] = i * f + a * h + r * u - c * l, e[1] = r * f + a * l + c * h - i * u, e[2] = c * f + a * u + i * l - r * h, e[3] = a * f - i * h - r * l - c * u, h = s[4], l = s[5], u = s[6], f = s[7], e[4] = i * f + a * h + r * u - c * l, e[5] = r * f + a * l + c * h - i * u, e[6] = c * f + a * u + i * l - r * h, e[7] = a * f - i * h - r * l - c * u, e;
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
    const c = Math.sin(i), a = c * s[0] / r, h = c * s[1] / r, l = c * s[2] / r, u = Math.cos(i), f = n[0], d = n[1], x = n[2], y = n[3];
    e[0] = f * u + y * a + d * l - x * h, e[1] = d * u + y * h + x * a - f * l, e[2] = x * u + y * l + f * h - d * a, e[3] = y * u - f * a - d * h - x * l;
    const g = n[4], w = n[5], M = n[6], E = n[7];
    return e[4] = g * u + E * a + w * l - M * h, e[5] = w * u + E * h + M * a - g * l, e[6] = M * u + E * l + g * h - w * a, e[7] = E * u - g * a - w * h - M * l, e;
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
    const i = n[0], r = n[1], c = n[2], a = n[3], h = s[4], l = s[5], u = s[6], f = s[7], d = n[4], x = n[5], y = n[6], g = n[7], w = s[0], M = s[1], E = s[2], I = s[3];
    return e[0] = i * I + a * w + r * E - c * M, e[1] = r * I + a * M + c * w - i * E, e[2] = c * I + a * E + i * M - r * w, e[3] = a * I - i * w - r * M - c * E, e[4] = i * f + a * h + r * u - c * l + d * I + g * w + x * E - y * M, e[5] = r * f + a * l + c * h - i * u + x * I + g * M + y * w - d * E, e[6] = c * f + a * u + i * l - r * h + y * I + g * E + d * M - x * w, e[7] = a * f - i * h - r * l - c * u + g * I - d * w - x * M - y * E, e;
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
      const i = n[0] / s, r = n[1] / s, c = n[2] / s, a = n[3] / s, h = n[4], l = n[5], u = n[6], f = n[7], d = i * h + r * l + c * u + a * f;
      e[0] = i, e[1] = r, e[2] = c, e[3] = a, e[4] = (h - i * d) / s, e[5] = (l - r * d) / s, e[6] = (u - c * d) / s, e[7] = (f - a * d) / s;
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
    const s = e[0], i = e[1], r = e[2], c = e[3], a = e[4], h = e[5], l = e[6], u = e[7], f = n[0], d = n[1], x = n[2], y = n[3], g = n[4], w = n[5], M = n[6], E = n[7];
    return Math.abs(s - f) <= dt * Math.max(1, Math.abs(s), Math.abs(f)) && Math.abs(i - d) <= dt * Math.max(1, Math.abs(i), Math.abs(d)) && Math.abs(r - x) <= dt * Math.max(1, Math.abs(r), Math.abs(x)) && Math.abs(c - y) <= dt * Math.max(1, Math.abs(c), Math.abs(y)) && Math.abs(a - g) <= dt * Math.max(1, Math.abs(a), Math.abs(g)) && Math.abs(h - w) <= dt * Math.max(1, Math.abs(h), Math.abs(w)) && Math.abs(l - M) <= dt * Math.max(1, Math.abs(l), Math.abs(M)) && Math.abs(u - E) <= dt * Math.max(1, Math.abs(u), Math.abs(E));
  }
}
const jo = new Float32Array(4), Go = new Float32Array(3);
Wt.dot = wt.dot;
Wt.squaredLength = wt.squaredLength;
Wt.sqrLen = wt.squaredLength;
Wt.mag = wt.magnitude;
Wt.length = wt.magnitude;
Wt.len = wt.magnitude;
Wt.mul = Wt.multiply;
const Fu = Wt, F1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  mat2: Iu,
  mat2d: qu,
  mat3: Du,
  mat4: Ou,
  quat: Cu,
  quat2: Fu,
  vec2: Wh,
  vec3: ku,
  vec4: Ru
}, Symbol.toStringTag, { value: "Module" }));
function Hu(o, e) {
  return class extends o {
    constructor(...n) {
      super(...n), e(this);
    }
  };
}
const Bu = Hu(Array, (o) => o.fill(0));
let Pt = 1e-6;
function Yu(o) {
  const e = Pt;
  return Pt = o, e;
}
function Vu(o) {
  return o * Math.PI / 180;
}
function Uu(o) {
  return o * 180 / Math.PI;
}
function Xu(o, e, n) {
  return o + (e - o) * n;
}
function Wu(o, e, n) {
  const s = e - o;
  return Math.abs(e - o) < Pt ? o : (n - o) / s;
}
function $u(o, e) {
  return (o % e + e) % e;
}
const ju = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get EPSILON() {
    return Pt;
  },
  degToRad: Vu,
  euclideanModulo: $u,
  inverseLerp: Wu,
  lerp: Xu,
  radToDeg: Uu,
  setEpsilon: Yu
}, Symbol.toStringTag, { value: "Module" }));
function Gu(o) {
  function e(C = 0, F = 0) {
    const B = new o(2);
    return C !== void 0 && (B[0] = C, F !== void 0 && (B[1] = F)), B;
  }
  const n = e;
  function s(C, F, B) {
    const p = B ?? new o(2);
    return p[0] = C, p[1] = F, p;
  }
  function i(C, F) {
    const B = F ?? new o(2);
    return B[0] = Math.ceil(C[0]), B[1] = Math.ceil(C[1]), B;
  }
  function r(C, F) {
    const B = F ?? new o(2);
    return B[0] = Math.floor(C[0]), B[1] = Math.floor(C[1]), B;
  }
  function c(C, F) {
    const B = F ?? new o(2);
    return B[0] = Math.round(C[0]), B[1] = Math.round(C[1]), B;
  }
  function a(C, F = 0, B = 1, p) {
    const A = p ?? new o(2);
    return A[0] = Math.min(B, Math.max(F, C[0])), A[1] = Math.min(B, Math.max(F, C[1])), A;
  }
  function h(C, F, B) {
    const p = B ?? new o(2);
    return p[0] = C[0] + F[0], p[1] = C[1] + F[1], p;
  }
  function l(C, F, B, p) {
    const A = p ?? new o(2);
    return A[0] = C[0] + F[0] * B, A[1] = C[1] + F[1] * B, A;
  }
  function u(C, F) {
    const B = C[0], p = C[1], A = F[0], b = F[1], T = Math.sqrt(B * B + p * p), v = Math.sqrt(A * A + b * b), P = T * v, R = P && H(C, F) / P;
    return Math.acos(R);
  }
  function f(C, F, B) {
    const p = B ?? new o(2);
    return p[0] = C[0] - F[0], p[1] = C[1] - F[1], p;
  }
  const d = f;
  function x(C, F) {
    return Math.abs(C[0] - F[0]) < Pt && Math.abs(C[1] - F[1]) < Pt;
  }
  function y(C, F) {
    return C[0] === F[0] && C[1] === F[1];
  }
  function g(C, F, B, p) {
    const A = p ?? new o(2);
    return A[0] = C[0] + B * (F[0] - C[0]), A[1] = C[1] + B * (F[1] - C[1]), A;
  }
  function w(C, F, B, p) {
    const A = p ?? new o(2);
    return A[0] = C[0] + B[0] * (F[0] - C[0]), A[1] = C[1] + B[1] * (F[1] - C[1]), A;
  }
  function M(C, F, B) {
    const p = B ?? new o(2);
    return p[0] = Math.max(C[0], F[0]), p[1] = Math.max(C[1], F[1]), p;
  }
  function E(C, F, B) {
    const p = B ?? new o(2);
    return p[0] = Math.min(C[0], F[0]), p[1] = Math.min(C[1], F[1]), p;
  }
  function I(C, F, B) {
    const p = B ?? new o(2);
    return p[0] = C[0] * F, p[1] = C[1] * F, p;
  }
  const N = I;
  function O(C, F, B) {
    const p = B ?? new o(2);
    return p[0] = C[0] / F, p[1] = C[1] / F, p;
  }
  function z(C, F) {
    const B = F ?? new o(2);
    return B[0] = 1 / C[0], B[1] = 1 / C[1], B;
  }
  const k = z;
  function Y(C, F, B) {
    const p = B ?? new o(3), A = C[0] * F[1] - C[1] * F[0];
    return p[0] = 0, p[1] = 0, p[2] = A, p;
  }
  function H(C, F) {
    return C[0] * F[0] + C[1] * F[1];
  }
  function $(C) {
    const F = C[0], B = C[1];
    return Math.sqrt(F * F + B * B);
  }
  const W = $;
  function J(C) {
    const F = C[0], B = C[1];
    return F * F + B * B;
  }
  const ot = J;
  function K(C, F) {
    const B = C[0] - F[0], p = C[1] - F[1];
    return Math.sqrt(B * B + p * p);
  }
  const j = K;
  function V(C, F) {
    const B = C[0] - F[0], p = C[1] - F[1];
    return B * B + p * p;
  }
  const at = V;
  function pt(C, F) {
    const B = F ?? new o(2), p = C[0], A = C[1], b = p * p + A * A, T = b > 0 ? 1 / Math.sqrt(b) : 1;
    return B[0] = p * T, B[1] = A * T, B;
  }
  function At(C, F) {
    const B = F ?? new o(2);
    return B[0] = -C[0], B[1] = -C[1], B;
  }
  function vt(C, F) {
    const B = F ?? new o(2);
    return B[0] = C[0], B[1] = C[1], B;
  }
  const Ot = vt;
  function kt(C, F, B) {
    const p = B ?? new o(2);
    return p[0] = C[0] * F[0], p[1] = C[1] * F[1], p;
  }
  const Nt = kt;
  function Ht(C, F, B) {
    const p = B ?? new o(2);
    return p[0] = C[0] / F[0], p[1] = C[1] / F[1], p;
  }
  const Vt = Ht;
  function Ut(C = 1, F) {
    const B = F ?? new o(2), p = Math.random() * 2 * Math.PI;
    return B[0] = Math.cos(p) * C, B[1] = Math.sin(p) * C, B;
  }
  function U(C) {
    const F = C ?? new o(2);
    return F[0] = 0, F[1] = 0, F;
  }
  function Q(C, F, B) {
    const p = B ?? new o(2), A = C[0], b = C[1];
    return p[0] = A * F[0] + b * F[4] + F[12], p[1] = A * F[1] + b * F[5] + F[13], p;
  }
  function D(C, F, B) {
    const p = B ?? new o(2), A = C[0], b = C[1];
    return p[0] = F[0] * A + F[4] * b + F[8], p[1] = F[1] * A + F[5] * b + F[9], p;
  }
  function m(C, F, B, p) {
    const A = p ?? new o(2), b = C[0] - F[0], T = C[1] - F[1], v = Math.sin(B), P = Math.cos(B);
    return A[0] = b * P - T * v + F[0], A[1] = b * v + T * P + F[1], A;
  }
  function L(C, F, B) {
    const p = B ?? new o(2);
    return pt(C, p), I(p, F, p);
  }
  function _(C, F, B) {
    const p = B ?? new o(2);
    return $(C) > F ? L(C, F, p) : vt(C, p);
  }
  function S(C, F, B) {
    const p = B ?? new o(2);
    return g(C, F, 0.5, p);
  }
  return {
    create: e,
    fromValues: n,
    set: s,
    ceil: i,
    floor: r,
    round: c,
    clamp: a,
    add: h,
    addScaled: l,
    angle: u,
    subtract: f,
    sub: d,
    equalsApproximately: x,
    equals: y,
    lerp: g,
    lerpV: w,
    max: M,
    min: E,
    mulScalar: I,
    scale: N,
    divScalar: O,
    inverse: z,
    invert: k,
    cross: Y,
    dot: H,
    length: $,
    len: W,
    lengthSq: J,
    lenSq: ot,
    distance: K,
    dist: j,
    distanceSq: V,
    distSq: at,
    normalize: pt,
    negate: At,
    copy: vt,
    clone: Ot,
    multiply: kt,
    mul: Nt,
    divide: Ht,
    div: Vt,
    random: Ut,
    zero: U,
    transformMat4: Q,
    transformMat3: D,
    rotate: m,
    setLength: L,
    truncate: _,
    midpoint: S
  };
}
const Zo = /* @__PURE__ */ new Map();
function ya(o) {
  let e = Zo.get(o);
  return e || (e = Gu(o), Zo.set(o, e)), e;
}
function Zu(o) {
  function e(v, P, R) {
    const q = new o(3);
    return v !== void 0 && (q[0] = v, P !== void 0 && (q[1] = P, R !== void 0 && (q[2] = R))), q;
  }
  const n = e;
  function s(v, P, R, q) {
    const X = q ?? new o(3);
    return X[0] = v, X[1] = P, X[2] = R, X;
  }
  function i(v, P) {
    const R = P ?? new o(3);
    return R[0] = Math.ceil(v[0]), R[1] = Math.ceil(v[1]), R[2] = Math.ceil(v[2]), R;
  }
  function r(v, P) {
    const R = P ?? new o(3);
    return R[0] = Math.floor(v[0]), R[1] = Math.floor(v[1]), R[2] = Math.floor(v[2]), R;
  }
  function c(v, P) {
    const R = P ?? new o(3);
    return R[0] = Math.round(v[0]), R[1] = Math.round(v[1]), R[2] = Math.round(v[2]), R;
  }
  function a(v, P = 0, R = 1, q) {
    const X = q ?? new o(3);
    return X[0] = Math.min(R, Math.max(P, v[0])), X[1] = Math.min(R, Math.max(P, v[1])), X[2] = Math.min(R, Math.max(P, v[2])), X;
  }
  function h(v, P, R) {
    const q = R ?? new o(3);
    return q[0] = v[0] + P[0], q[1] = v[1] + P[1], q[2] = v[2] + P[2], q;
  }
  function l(v, P, R, q) {
    const X = q ?? new o(3);
    return X[0] = v[0] + P[0] * R, X[1] = v[1] + P[1] * R, X[2] = v[2] + P[2] * R, X;
  }
  function u(v, P) {
    const R = v[0], q = v[1], X = v[2], G = P[0], Z = P[1], ht = P[2], st = Math.sqrt(R * R + q * q + X * X), it = Math.sqrt(G * G + Z * Z + ht * ht), xt = st * it, Mt = xt && H(v, P) / xt;
    return Math.acos(Mt);
  }
  function f(v, P, R) {
    const q = R ?? new o(3);
    return q[0] = v[0] - P[0], q[1] = v[1] - P[1], q[2] = v[2] - P[2], q;
  }
  const d = f;
  function x(v, P) {
    return Math.abs(v[0] - P[0]) < Pt && Math.abs(v[1] - P[1]) < Pt && Math.abs(v[2] - P[2]) < Pt;
  }
  function y(v, P) {
    return v[0] === P[0] && v[1] === P[1] && v[2] === P[2];
  }
  function g(v, P, R, q) {
    const X = q ?? new o(3);
    return X[0] = v[0] + R * (P[0] - v[0]), X[1] = v[1] + R * (P[1] - v[1]), X[2] = v[2] + R * (P[2] - v[2]), X;
  }
  function w(v, P, R, q) {
    const X = q ?? new o(3);
    return X[0] = v[0] + R[0] * (P[0] - v[0]), X[1] = v[1] + R[1] * (P[1] - v[1]), X[2] = v[2] + R[2] * (P[2] - v[2]), X;
  }
  function M(v, P, R) {
    const q = R ?? new o(3);
    return q[0] = Math.max(v[0], P[0]), q[1] = Math.max(v[1], P[1]), q[2] = Math.max(v[2], P[2]), q;
  }
  function E(v, P, R) {
    const q = R ?? new o(3);
    return q[0] = Math.min(v[0], P[0]), q[1] = Math.min(v[1], P[1]), q[2] = Math.min(v[2], P[2]), q;
  }
  function I(v, P, R) {
    const q = R ?? new o(3);
    return q[0] = v[0] * P, q[1] = v[1] * P, q[2] = v[2] * P, q;
  }
  const N = I;
  function O(v, P, R) {
    const q = R ?? new o(3);
    return q[0] = v[0] / P, q[1] = v[1] / P, q[2] = v[2] / P, q;
  }
  function z(v, P) {
    const R = P ?? new o(3);
    return R[0] = 1 / v[0], R[1] = 1 / v[1], R[2] = 1 / v[2], R;
  }
  const k = z;
  function Y(v, P, R) {
    const q = R ?? new o(3), X = v[2] * P[0] - v[0] * P[2], G = v[0] * P[1] - v[1] * P[0];
    return q[0] = v[1] * P[2] - v[2] * P[1], q[1] = X, q[2] = G, q;
  }
  function H(v, P) {
    return v[0] * P[0] + v[1] * P[1] + v[2] * P[2];
  }
  function $(v) {
    const P = v[0], R = v[1], q = v[2];
    return Math.sqrt(P * P + R * R + q * q);
  }
  const W = $;
  function J(v) {
    const P = v[0], R = v[1], q = v[2];
    return P * P + R * R + q * q;
  }
  const ot = J;
  function K(v, P) {
    const R = v[0] - P[0], q = v[1] - P[1], X = v[2] - P[2];
    return Math.sqrt(R * R + q * q + X * X);
  }
  const j = K;
  function V(v, P) {
    const R = v[0] - P[0], q = v[1] - P[1], X = v[2] - P[2];
    return R * R + q * q + X * X;
  }
  const at = V;
  function pt(v, P) {
    const R = P ?? new o(3), q = v[0], X = v[1], G = v[2], Z = q * q + X * X + G * G, ht = Z > 0 ? 1 / Math.sqrt(Z) : 1;
    return R[0] = q * ht, R[1] = X * ht, R[2] = G * ht, R;
  }
  function At(v, P) {
    const R = P ?? new o(3);
    return R[0] = -v[0], R[1] = -v[1], R[2] = -v[2], R;
  }
  function vt(v, P) {
    const R = P ?? new o(3);
    return R[0] = v[0], R[1] = v[1], R[2] = v[2], R;
  }
  const Ot = vt;
  function kt(v, P, R) {
    const q = R ?? new o(3);
    return q[0] = v[0] * P[0], q[1] = v[1] * P[1], q[2] = v[2] * P[2], q;
  }
  const Nt = kt;
  function Ht(v, P, R) {
    const q = R ?? new o(3);
    return q[0] = v[0] / P[0], q[1] = v[1] / P[1], q[2] = v[2] / P[2], q;
  }
  const Vt = Ht;
  function Ut(v = 1, P) {
    const R = P ?? new o(3), q = Math.random() * 2 * Math.PI, X = Math.random() * 2 - 1, G = Math.sqrt(1 - X * X) * v;
    return R[0] = Math.cos(q) * G, R[1] = Math.sin(q) * G, R[2] = X * v, R;
  }
  function U(v) {
    const P = v ?? new o(3);
    return P[0] = 0, P[1] = 0, P[2] = 0, P;
  }
  function Q(v, P, R) {
    const q = R ?? new o(3), X = v[0], G = v[1], Z = v[2], ht = P[3] * X + P[7] * G + P[11] * Z + P[15] || 1;
    return q[0] = (P[0] * X + P[4] * G + P[8] * Z + P[12]) / ht, q[1] = (P[1] * X + P[5] * G + P[9] * Z + P[13]) / ht, q[2] = (P[2] * X + P[6] * G + P[10] * Z + P[14]) / ht, q;
  }
  function D(v, P, R) {
    const q = R ?? new o(3), X = v[0], G = v[1], Z = v[2];
    return q[0] = X * P[0] + G * P[4] + Z * P[8], q[1] = X * P[1] + G * P[5] + Z * P[9], q[2] = X * P[2] + G * P[6] + Z * P[10], q;
  }
  function m(v, P, R) {
    const q = R ?? new o(3), X = v[0], G = v[1], Z = v[2];
    return q[0] = X * P[0] + G * P[4] + Z * P[8], q[1] = X * P[1] + G * P[5] + Z * P[9], q[2] = X * P[2] + G * P[6] + Z * P[10], q;
  }
  function L(v, P, R) {
    const q = R ?? new o(3), X = P[0], G = P[1], Z = P[2], ht = P[3] * 2, st = v[0], it = v[1], xt = v[2], Mt = G * xt - Z * it, yt = Z * st - X * xt, mt = X * it - G * st;
    return q[0] = st + Mt * ht + (G * mt - Z * yt) * 2, q[1] = it + yt * ht + (Z * Mt - X * mt) * 2, q[2] = xt + mt * ht + (X * yt - G * Mt) * 2, q;
  }
  function _(v, P) {
    const R = P ?? new o(3);
    return R[0] = v[12], R[1] = v[13], R[2] = v[14], R;
  }
  function S(v, P, R) {
    const q = R ?? new o(3), X = P * 4;
    return q[0] = v[X + 0], q[1] = v[X + 1], q[2] = v[X + 2], q;
  }
  function C(v, P) {
    const R = P ?? new o(3), q = v[0], X = v[1], G = v[2], Z = v[4], ht = v[5], st = v[6], it = v[8], xt = v[9], Mt = v[10];
    return R[0] = Math.sqrt(q * q + X * X + G * G), R[1] = Math.sqrt(Z * Z + ht * ht + st * st), R[2] = Math.sqrt(it * it + xt * xt + Mt * Mt), R;
  }
  function F(v, P, R, q) {
    const X = q ?? new o(3), G = [], Z = [];
    return G[0] = v[0] - P[0], G[1] = v[1] - P[1], G[2] = v[2] - P[2], Z[0] = G[0], Z[1] = G[1] * Math.cos(R) - G[2] * Math.sin(R), Z[2] = G[1] * Math.sin(R) + G[2] * Math.cos(R), X[0] = Z[0] + P[0], X[1] = Z[1] + P[1], X[2] = Z[2] + P[2], X;
  }
  function B(v, P, R, q) {
    const X = q ?? new o(3), G = [], Z = [];
    return G[0] = v[0] - P[0], G[1] = v[1] - P[1], G[2] = v[2] - P[2], Z[0] = G[2] * Math.sin(R) + G[0] * Math.cos(R), Z[1] = G[1], Z[2] = G[2] * Math.cos(R) - G[0] * Math.sin(R), X[0] = Z[0] + P[0], X[1] = Z[1] + P[1], X[2] = Z[2] + P[2], X;
  }
  function p(v, P, R, q) {
    const X = q ?? new o(3), G = [], Z = [];
    return G[0] = v[0] - P[0], G[1] = v[1] - P[1], G[2] = v[2] - P[2], Z[0] = G[0] * Math.cos(R) - G[1] * Math.sin(R), Z[1] = G[0] * Math.sin(R) + G[1] * Math.cos(R), Z[2] = G[2], X[0] = Z[0] + P[0], X[1] = Z[1] + P[1], X[2] = Z[2] + P[2], X;
  }
  function A(v, P, R) {
    const q = R ?? new o(3);
    return pt(v, q), I(q, P, q);
  }
  function b(v, P, R) {
    const q = R ?? new o(3);
    return $(v) > P ? A(v, P, q) : vt(v, q);
  }
  function T(v, P, R) {
    const q = R ?? new o(3);
    return g(v, P, 0.5, q);
  }
  return {
    create: e,
    fromValues: n,
    set: s,
    ceil: i,
    floor: r,
    round: c,
    clamp: a,
    add: h,
    addScaled: l,
    angle: u,
    subtract: f,
    sub: d,
    equalsApproximately: x,
    equals: y,
    lerp: g,
    lerpV: w,
    max: M,
    min: E,
    mulScalar: I,
    scale: N,
    divScalar: O,
    inverse: z,
    invert: k,
    cross: Y,
    dot: H,
    length: $,
    len: W,
    lengthSq: J,
    lenSq: ot,
    distance: K,
    dist: j,
    distanceSq: V,
    distSq: at,
    normalize: pt,
    negate: At,
    copy: vt,
    clone: Ot,
    multiply: kt,
    mul: Nt,
    divide: Ht,
    div: Vt,
    random: Ut,
    zero: U,
    transformMat4: Q,
    transformMat4Upper3x3: D,
    transformMat3: m,
    transformQuat: L,
    getTranslation: _,
    getAxis: S,
    getScaling: C,
    rotateX: F,
    rotateY: B,
    rotateZ: p,
    setLength: A,
    truncate: b,
    midpoint: T
  };
}
const Jo = /* @__PURE__ */ new Map();
function qi(o) {
  let e = Jo.get(o);
  return e || (e = Zu(o), Jo.set(o, e)), e;
}
function Ju(o) {
  const e = ya(o), n = qi(o);
  function s(m, L, _, S, C, F, B, p, A) {
    const b = new o(12);
    return b[3] = 0, b[7] = 0, b[11] = 0, m !== void 0 && (b[0] = m, L !== void 0 && (b[1] = L, _ !== void 0 && (b[2] = _, S !== void 0 && (b[4] = S, C !== void 0 && (b[5] = C, F !== void 0 && (b[6] = F, B !== void 0 && (b[8] = B, p !== void 0 && (b[9] = p, A !== void 0 && (b[10] = A))))))))), b;
  }
  function i(m, L, _, S, C, F, B, p, A, b) {
    const T = b ?? new o(12);
    return T[0] = m, T[1] = L, T[2] = _, T[3] = 0, T[4] = S, T[5] = C, T[6] = F, T[7] = 0, T[8] = B, T[9] = p, T[10] = A, T[11] = 0, T;
  }
  function r(m, L) {
    const _ = L ?? new o(12);
    return _[0] = m[0], _[1] = m[1], _[2] = m[2], _[3] = 0, _[4] = m[4], _[5] = m[5], _[6] = m[6], _[7] = 0, _[8] = m[8], _[9] = m[9], _[10] = m[10], _[11] = 0, _;
  }
  function c(m, L) {
    const _ = L ?? new o(12), S = m[0], C = m[1], F = m[2], B = m[3], p = S + S, A = C + C, b = F + F, T = S * p, v = C * p, P = C * A, R = F * p, q = F * A, X = F * b, G = B * p, Z = B * A, ht = B * b;
    return _[0] = 1 - P - X, _[1] = v + ht, _[2] = R - Z, _[3] = 0, _[4] = v - ht, _[5] = 1 - T - X, _[6] = q + G, _[7] = 0, _[8] = R + Z, _[9] = q - G, _[10] = 1 - T - P, _[11] = 0, _;
  }
  function a(m, L) {
    const _ = L ?? new o(12);
    return _[0] = -m[0], _[1] = -m[1], _[2] = -m[2], _[4] = -m[4], _[5] = -m[5], _[6] = -m[6], _[8] = -m[8], _[9] = -m[9], _[10] = -m[10], _;
  }
  function h(m, L, _) {
    const S = _ ?? new o(12);
    return S[0] = m[0] * L, S[1] = m[1] * L, S[2] = m[2] * L, S[4] = m[4] * L, S[5] = m[5] * L, S[6] = m[6] * L, S[8] = m[8] * L, S[9] = m[9] * L, S[10] = m[10] * L, S;
  }
  const l = h;
  function u(m, L, _) {
    const S = _ ?? new o(12);
    return S[0] = m[0] + L[0], S[1] = m[1] + L[1], S[2] = m[2] + L[2], S[4] = m[4] + L[4], S[5] = m[5] + L[5], S[6] = m[6] + L[6], S[8] = m[8] + L[8], S[9] = m[9] + L[9], S[10] = m[10] + L[10], S;
  }
  function f(m, L) {
    const _ = L ?? new o(12);
    return _[0] = m[0], _[1] = m[1], _[2] = m[2], _[4] = m[4], _[5] = m[5], _[6] = m[6], _[8] = m[8], _[9] = m[9], _[10] = m[10], _;
  }
  const d = f;
  function x(m, L) {
    return Math.abs(m[0] - L[0]) < Pt && Math.abs(m[1] - L[1]) < Pt && Math.abs(m[2] - L[2]) < Pt && Math.abs(m[4] - L[4]) < Pt && Math.abs(m[5] - L[5]) < Pt && Math.abs(m[6] - L[6]) < Pt && Math.abs(m[8] - L[8]) < Pt && Math.abs(m[9] - L[9]) < Pt && Math.abs(m[10] - L[10]) < Pt;
  }
  function y(m, L) {
    return m[0] === L[0] && m[1] === L[1] && m[2] === L[2] && m[4] === L[4] && m[5] === L[5] && m[6] === L[6] && m[8] === L[8] && m[9] === L[9] && m[10] === L[10];
  }
  function g(m) {
    const L = m ?? new o(12);
    return L[0] = 1, L[1] = 0, L[2] = 0, L[4] = 0, L[5] = 1, L[6] = 0, L[8] = 0, L[9] = 0, L[10] = 1, L;
  }
  function w(m, L) {
    const _ = L ?? new o(12);
    if (_ === m) {
      let P;
      return P = m[1], m[1] = m[4], m[4] = P, P = m[2], m[2] = m[8], m[8] = P, P = m[6], m[6] = m[9], m[9] = P, _;
    }
    const S = m[0], C = m[1], F = m[2], B = m[4], p = m[5], A = m[6], b = m[8], T = m[9], v = m[10];
    return _[0] = S, _[1] = B, _[2] = b, _[4] = C, _[5] = p, _[6] = T, _[8] = F, _[9] = A, _[10] = v, _;
  }
  function M(m, L) {
    const _ = L ?? new o(12), S = m[0], C = m[1], F = m[2], B = m[4], p = m[5], A = m[6], b = m[8], T = m[9], v = m[10], P = v * p - A * T, R = -v * B + A * b, q = T * B - p * b, X = 1 / (S * P + C * R + F * q);
    return _[0] = P * X, _[1] = (-v * C + F * T) * X, _[2] = (A * C - F * p) * X, _[4] = R * X, _[5] = (v * S - F * b) * X, _[6] = (-A * S + F * B) * X, _[8] = q * X, _[9] = (-T * S + C * b) * X, _[10] = (p * S - C * B) * X, _;
  }
  function E(m) {
    const L = m[0], _ = m[1], S = m[2], C = m[4], F = m[5], B = m[6], p = m[8], A = m[9], b = m[10];
    return L * (F * b - A * B) - C * (_ * b - A * S) + p * (_ * B - F * S);
  }
  const I = M;
  function N(m, L, _) {
    const S = _ ?? new o(12), C = m[0], F = m[1], B = m[2], p = m[4], A = m[5], b = m[6], T = m[8], v = m[9], P = m[10], R = L[0], q = L[1], X = L[2], G = L[4], Z = L[5], ht = L[6], st = L[8], it = L[9], xt = L[10];
    return S[0] = C * R + p * q + T * X, S[1] = F * R + A * q + v * X, S[2] = B * R + b * q + P * X, S[4] = C * G + p * Z + T * ht, S[5] = F * G + A * Z + v * ht, S[6] = B * G + b * Z + P * ht, S[8] = C * st + p * it + T * xt, S[9] = F * st + A * it + v * xt, S[10] = B * st + b * it + P * xt, S;
  }
  const O = N;
  function z(m, L, _) {
    const S = _ ?? g();
    return m !== S && (S[0] = m[0], S[1] = m[1], S[2] = m[2], S[4] = m[4], S[5] = m[5], S[6] = m[6]), S[8] = L[0], S[9] = L[1], S[10] = 1, S;
  }
  function k(m, L) {
    const _ = L ?? e.create();
    return _[0] = m[8], _[1] = m[9], _;
  }
  function Y(m, L, _) {
    const S = _ ?? e.create(), C = L * 4;
    return S[0] = m[C + 0], S[1] = m[C + 1], S;
  }
  function H(m, L, _, S) {
    const C = S === m ? m : f(m, S), F = _ * 4;
    return C[F + 0] = L[0], C[F + 1] = L[1], C;
  }
  function $(m, L) {
    const _ = L ?? e.create(), S = m[0], C = m[1], F = m[4], B = m[5];
    return _[0] = Math.sqrt(S * S + C * C), _[1] = Math.sqrt(F * F + B * B), _;
  }
  function W(m, L) {
    const _ = L ?? n.create(), S = m[0], C = m[1], F = m[2], B = m[4], p = m[5], A = m[6], b = m[8], T = m[9], v = m[10];
    return _[0] = Math.sqrt(S * S + C * C + F * F), _[1] = Math.sqrt(B * B + p * p + A * A), _[2] = Math.sqrt(b * b + T * T + v * v), _;
  }
  function J(m, L) {
    const _ = L ?? new o(12);
    return _[0] = 1, _[1] = 0, _[2] = 0, _[4] = 0, _[5] = 1, _[6] = 0, _[8] = m[0], _[9] = m[1], _[10] = 1, _;
  }
  function ot(m, L, _) {
    const S = _ ?? new o(12), C = L[0], F = L[1], B = m[0], p = m[1], A = m[2], b = m[4], T = m[5], v = m[6], P = m[8], R = m[9], q = m[10];
    return m !== S && (S[0] = B, S[1] = p, S[2] = A, S[4] = b, S[5] = T, S[6] = v), S[8] = B * C + b * F + P, S[9] = p * C + T * F + R, S[10] = A * C + v * F + q, S;
  }
  function K(m, L) {
    const _ = L ?? new o(12), S = Math.cos(m), C = Math.sin(m);
    return _[0] = S, _[1] = C, _[2] = 0, _[4] = -C, _[5] = S, _[6] = 0, _[8] = 0, _[9] = 0, _[10] = 1, _;
  }
  function j(m, L, _) {
    const S = _ ?? new o(12), C = m[0], F = m[1], B = m[2], p = m[4], A = m[5], b = m[6], T = Math.cos(L), v = Math.sin(L);
    return S[0] = T * C + v * p, S[1] = T * F + v * A, S[2] = T * B + v * b, S[4] = T * p - v * C, S[5] = T * A - v * F, S[6] = T * b - v * B, m !== S && (S[8] = m[8], S[9] = m[9], S[10] = m[10]), S;
  }
  function V(m, L) {
    const _ = L ?? new o(12), S = Math.cos(m), C = Math.sin(m);
    return _[0] = 1, _[1] = 0, _[2] = 0, _[4] = 0, _[5] = S, _[6] = C, _[8] = 0, _[9] = -C, _[10] = S, _;
  }
  function at(m, L, _) {
    const S = _ ?? new o(12), C = m[4], F = m[5], B = m[6], p = m[8], A = m[9], b = m[10], T = Math.cos(L), v = Math.sin(L);
    return S[4] = T * C + v * p, S[5] = T * F + v * A, S[6] = T * B + v * b, S[8] = T * p - v * C, S[9] = T * A - v * F, S[10] = T * b - v * B, m !== S && (S[0] = m[0], S[1] = m[1], S[2] = m[2]), S;
  }
  function pt(m, L) {
    const _ = L ?? new o(12), S = Math.cos(m), C = Math.sin(m);
    return _[0] = S, _[1] = 0, _[2] = -C, _[4] = 0, _[5] = 1, _[6] = 0, _[8] = C, _[9] = 0, _[10] = S, _;
  }
  function At(m, L, _) {
    const S = _ ?? new o(12), C = m[0], F = m[1], B = m[2], p = m[8], A = m[9], b = m[10], T = Math.cos(L), v = Math.sin(L);
    return S[0] = T * C - v * p, S[1] = T * F - v * A, S[2] = T * B - v * b, S[8] = T * p + v * C, S[9] = T * A + v * F, S[10] = T * b + v * B, m !== S && (S[4] = m[4], S[5] = m[5], S[6] = m[6]), S;
  }
  const vt = K, Ot = j;
  function kt(m, L) {
    const _ = L ?? new o(12);
    return _[0] = m[0], _[1] = 0, _[2] = 0, _[4] = 0, _[5] = m[1], _[6] = 0, _[8] = 0, _[9] = 0, _[10] = 1, _;
  }
  function Nt(m, L, _) {
    const S = _ ?? new o(12), C = L[0], F = L[1];
    return S[0] = C * m[0], S[1] = C * m[1], S[2] = C * m[2], S[4] = F * m[4], S[5] = F * m[5], S[6] = F * m[6], m !== S && (S[8] = m[8], S[9] = m[9], S[10] = m[10]), S;
  }
  function Ht(m, L) {
    const _ = L ?? new o(12);
    return _[0] = m[0], _[1] = 0, _[2] = 0, _[4] = 0, _[5] = m[1], _[6] = 0, _[8] = 0, _[9] = 0, _[10] = m[2], _;
  }
  function Vt(m, L, _) {
    const S = _ ?? new o(12), C = L[0], F = L[1], B = L[2];
    return S[0] = C * m[0], S[1] = C * m[1], S[2] = C * m[2], S[4] = F * m[4], S[5] = F * m[5], S[6] = F * m[6], S[8] = B * m[8], S[9] = B * m[9], S[10] = B * m[10], S;
  }
  function Ut(m, L) {
    const _ = L ?? new o(12);
    return _[0] = m, _[1] = 0, _[2] = 0, _[4] = 0, _[5] = m, _[6] = 0, _[8] = 0, _[9] = 0, _[10] = 1, _;
  }
  function U(m, L, _) {
    const S = _ ?? new o(12);
    return S[0] = L * m[0], S[1] = L * m[1], S[2] = L * m[2], S[4] = L * m[4], S[5] = L * m[5], S[6] = L * m[6], m !== S && (S[8] = m[8], S[9] = m[9], S[10] = m[10]), S;
  }
  function Q(m, L) {
    const _ = L ?? new o(12);
    return _[0] = m, _[1] = 0, _[2] = 0, _[4] = 0, _[5] = m, _[6] = 0, _[8] = 0, _[9] = 0, _[10] = m, _;
  }
  function D(m, L, _) {
    const S = _ ?? new o(12);
    return S[0] = L * m[0], S[1] = L * m[1], S[2] = L * m[2], S[4] = L * m[4], S[5] = L * m[5], S[6] = L * m[6], S[8] = L * m[8], S[9] = L * m[9], S[10] = L * m[10], S;
  }
  return {
    add: u,
    clone: d,
    copy: f,
    create: s,
    determinant: E,
    equals: y,
    equalsApproximately: x,
    fromMat4: r,
    fromQuat: c,
    get3DScaling: W,
    getAxis: Y,
    getScaling: $,
    getTranslation: k,
    identity: g,
    inverse: M,
    invert: I,
    mul: O,
    mulScalar: l,
    multiply: N,
    multiplyScalar: h,
    negate: a,
    rotate: j,
    rotateX: at,
    rotateY: At,
    rotateZ: Ot,
    rotation: K,
    rotationX: V,
    rotationY: pt,
    rotationZ: vt,
    scale: Nt,
    scale3D: Vt,
    scaling: kt,
    scaling3D: Ht,
    set: i,
    setAxis: H,
    setTranslation: z,
    translate: ot,
    translation: J,
    transpose: w,
    uniformScale: U,
    uniformScale3D: D,
    uniformScaling: Ut,
    uniformScaling3D: Q
  };
}
const Qo = /* @__PURE__ */ new Map();
function Qu(o) {
  let e = Qo.get(o);
  return e || (e = Ju(o), Qo.set(o, e)), e;
}
function Ku(o) {
  const e = qi(o);
  function n(p, A, b, T, v, P, R, q, X, G, Z, ht, st, it, xt, Mt) {
    const yt = new o(16);
    return p !== void 0 && (yt[0] = p, A !== void 0 && (yt[1] = A, b !== void 0 && (yt[2] = b, T !== void 0 && (yt[3] = T, v !== void 0 && (yt[4] = v, P !== void 0 && (yt[5] = P, R !== void 0 && (yt[6] = R, q !== void 0 && (yt[7] = q, X !== void 0 && (yt[8] = X, G !== void 0 && (yt[9] = G, Z !== void 0 && (yt[10] = Z, ht !== void 0 && (yt[11] = ht, st !== void 0 && (yt[12] = st, it !== void 0 && (yt[13] = it, xt !== void 0 && (yt[14] = xt, Mt !== void 0 && (yt[15] = Mt)))))))))))))))), yt;
  }
  function s(p, A, b, T, v, P, R, q, X, G, Z, ht, st, it, xt, Mt, yt) {
    const mt = yt ?? new o(16);
    return mt[0] = p, mt[1] = A, mt[2] = b, mt[3] = T, mt[4] = v, mt[5] = P, mt[6] = R, mt[7] = q, mt[8] = X, mt[9] = G, mt[10] = Z, mt[11] = ht, mt[12] = st, mt[13] = it, mt[14] = xt, mt[15] = Mt, mt;
  }
  function i(p, A) {
    const b = A ?? new o(16);
    return b[0] = p[0], b[1] = p[1], b[2] = p[2], b[3] = 0, b[4] = p[4], b[5] = p[5], b[6] = p[6], b[7] = 0, b[8] = p[8], b[9] = p[9], b[10] = p[10], b[11] = 0, b[12] = 0, b[13] = 0, b[14] = 0, b[15] = 1, b;
  }
  function r(p, A) {
    const b = A ?? new o(16), T = p[0], v = p[1], P = p[2], R = p[3], q = T + T, X = v + v, G = P + P, Z = T * q, ht = v * q, st = v * X, it = P * q, xt = P * X, Mt = P * G, yt = R * q, mt = R * X, Dt = R * G;
    return b[0] = 1 - st - Mt, b[1] = ht + Dt, b[2] = it - mt, b[3] = 0, b[4] = ht - Dt, b[5] = 1 - Z - Mt, b[6] = xt + yt, b[7] = 0, b[8] = it + mt, b[9] = xt - yt, b[10] = 1 - Z - st, b[11] = 0, b[12] = 0, b[13] = 0, b[14] = 0, b[15] = 1, b;
  }
  function c(p, A) {
    const b = A ?? new o(16);
    return b[0] = -p[0], b[1] = -p[1], b[2] = -p[2], b[3] = -p[3], b[4] = -p[4], b[5] = -p[5], b[6] = -p[6], b[7] = -p[7], b[8] = -p[8], b[9] = -p[9], b[10] = -p[10], b[11] = -p[11], b[12] = -p[12], b[13] = -p[13], b[14] = -p[14], b[15] = -p[15], b;
  }
  function a(p, A, b) {
    const T = b ?? new o(16);
    return T[0] = p[0] + A[0], T[1] = p[1] + A[1], T[2] = p[2] + A[2], T[3] = p[3] + A[3], T[4] = p[4] + A[4], T[5] = p[5] + A[5], T[6] = p[6] + A[6], T[7] = p[7] + A[7], T[8] = p[8] + A[8], T[9] = p[9] + A[9], T[10] = p[10] + A[10], T[11] = p[11] + A[11], T[12] = p[12] + A[12], T[13] = p[13] + A[13], T[14] = p[14] + A[14], T[15] = p[15] + A[15], T;
  }
  function h(p, A, b) {
    const T = b ?? new o(16);
    return T[0] = p[0] * A, T[1] = p[1] * A, T[2] = p[2] * A, T[3] = p[3] * A, T[4] = p[4] * A, T[5] = p[5] * A, T[6] = p[6] * A, T[7] = p[7] * A, T[8] = p[8] * A, T[9] = p[9] * A, T[10] = p[10] * A, T[11] = p[11] * A, T[12] = p[12] * A, T[13] = p[13] * A, T[14] = p[14] * A, T[15] = p[15] * A, T;
  }
  const l = h;
  function u(p, A) {
    const b = A ?? new o(16);
    return b[0] = p[0], b[1] = p[1], b[2] = p[2], b[3] = p[3], b[4] = p[4], b[5] = p[5], b[6] = p[6], b[7] = p[7], b[8] = p[8], b[9] = p[9], b[10] = p[10], b[11] = p[11], b[12] = p[12], b[13] = p[13], b[14] = p[14], b[15] = p[15], b;
  }
  const f = u;
  function d(p, A) {
    return Math.abs(p[0] - A[0]) < Pt && Math.abs(p[1] - A[1]) < Pt && Math.abs(p[2] - A[2]) < Pt && Math.abs(p[3] - A[3]) < Pt && Math.abs(p[4] - A[4]) < Pt && Math.abs(p[5] - A[5]) < Pt && Math.abs(p[6] - A[6]) < Pt && Math.abs(p[7] - A[7]) < Pt && Math.abs(p[8] - A[8]) < Pt && Math.abs(p[9] - A[9]) < Pt && Math.abs(p[10] - A[10]) < Pt && Math.abs(p[11] - A[11]) < Pt && Math.abs(p[12] - A[12]) < Pt && Math.abs(p[13] - A[13]) < Pt && Math.abs(p[14] - A[14]) < Pt && Math.abs(p[15] - A[15]) < Pt;
  }
  function x(p, A) {
    return p[0] === A[0] && p[1] === A[1] && p[2] === A[2] && p[3] === A[3] && p[4] === A[4] && p[5] === A[5] && p[6] === A[6] && p[7] === A[7] && p[8] === A[8] && p[9] === A[9] && p[10] === A[10] && p[11] === A[11] && p[12] === A[12] && p[13] === A[13] && p[14] === A[14] && p[15] === A[15];
  }
  function y(p) {
    const A = p ?? new o(16);
    return A[0] = 1, A[1] = 0, A[2] = 0, A[3] = 0, A[4] = 0, A[5] = 1, A[6] = 0, A[7] = 0, A[8] = 0, A[9] = 0, A[10] = 1, A[11] = 0, A[12] = 0, A[13] = 0, A[14] = 0, A[15] = 1, A;
  }
  function g(p, A) {
    const b = A ?? new o(16);
    if (b === p) {
      let It;
      return It = p[1], p[1] = p[4], p[4] = It, It = p[2], p[2] = p[8], p[8] = It, It = p[3], p[3] = p[12], p[12] = It, It = p[6], p[6] = p[9], p[9] = It, It = p[7], p[7] = p[13], p[13] = It, It = p[11], p[11] = p[14], p[14] = It, b;
    }
    const T = p[0], v = p[1], P = p[2], R = p[3], q = p[4], X = p[5], G = p[6], Z = p[7], ht = p[8], st = p[9], it = p[10], xt = p[11], Mt = p[12], yt = p[13], mt = p[14], Dt = p[15];
    return b[0] = T, b[1] = q, b[2] = ht, b[3] = Mt, b[4] = v, b[5] = X, b[6] = st, b[7] = yt, b[8] = P, b[9] = G, b[10] = it, b[11] = mt, b[12] = R, b[13] = Z, b[14] = xt, b[15] = Dt, b;
  }
  function w(p, A) {
    const b = A ?? new o(16), T = p[0], v = p[1], P = p[2], R = p[3], q = p[4], X = p[5], G = p[6], Z = p[7], ht = p[8], st = p[9], it = p[10], xt = p[11], Mt = p[12], yt = p[13], mt = p[14], Dt = p[15], It = it * Dt, Zt = mt * xt, Jt = G * Dt, Qt = mt * Z, ee = G * xt, ie = it * Z, re = P * Dt, oe = mt * R, ce = P * xt, ae = it * R, de = P * Z, xe = G * R, ye = ht * yt, pe = Mt * st, we = q * yt, ve = Mt * X, Me = q * st, Hs = ht * X, Bs = T * yt, Ys = Mt * v, Vs = T * st, Us = ht * v, Xs = T * X, Ws = q * v, Gr = It * X + Qt * st + ee * yt - (Zt * X + Jt * st + ie * yt), Zr = Zt * v + re * st + ae * yt - (It * v + oe * st + ce * yt), Jr = Jt * v + oe * X + de * yt - (Qt * v + re * X + xe * yt), Qr = ie * v + ce * X + xe * st - (ee * v + ae * X + de * st), he = 1 / (T * Gr + q * Zr + ht * Jr + Mt * Qr);
    return b[0] = he * Gr, b[1] = he * Zr, b[2] = he * Jr, b[3] = he * Qr, b[4] = he * (Zt * q + Jt * ht + ie * Mt - (It * q + Qt * ht + ee * Mt)), b[5] = he * (It * T + oe * ht + ce * Mt - (Zt * T + re * ht + ae * Mt)), b[6] = he * (Qt * T + re * q + xe * Mt - (Jt * T + oe * q + de * Mt)), b[7] = he * (ee * T + ae * q + de * ht - (ie * T + ce * q + xe * ht)), b[8] = he * (ye * Z + ve * xt + Me * Dt - (pe * Z + we * xt + Hs * Dt)), b[9] = he * (pe * R + Bs * xt + Us * Dt - (ye * R + Ys * xt + Vs * Dt)), b[10] = he * (we * R + Ys * Z + Xs * Dt - (ve * R + Bs * Z + Ws * Dt)), b[11] = he * (Hs * R + Vs * Z + Ws * xt - (Me * R + Us * Z + Xs * xt)), b[12] = he * (we * it + Hs * mt + pe * G - (Me * mt + ye * G + ve * it)), b[13] = he * (Vs * mt + ye * P + Ys * it - (Bs * it + Us * mt + pe * P)), b[14] = he * (Bs * G + Ws * mt + ve * P - (Xs * mt + we * P + Ys * G)), b[15] = he * (Xs * it + Me * P + Us * G - (Vs * G + Ws * it + Hs * P)), b;
  }
  function M(p) {
    const A = p[0], b = p[1], T = p[2], v = p[3], P = p[4], R = p[5], q = p[6], X = p[7], G = p[8], Z = p[9], ht = p[10], st = p[11], it = p[12], xt = p[13], Mt = p[14], yt = p[15], mt = ht * yt, Dt = Mt * st, It = q * yt, Zt = Mt * X, Jt = q * st, Qt = ht * X, ee = T * yt, ie = Mt * v, re = T * st, oe = ht * v, ce = T * X, ae = q * v, de = mt * R + Zt * Z + Jt * xt - (Dt * R + It * Z + Qt * xt), xe = Dt * b + ee * Z + oe * xt - (mt * b + ie * Z + re * xt), ye = It * b + ie * R + ce * xt - (Zt * b + ee * R + ae * xt), pe = Qt * b + re * R + ae * Z - (Jt * b + oe * R + ce * Z);
    return A * de + P * xe + G * ye + it * pe;
  }
  const E = w;
  function I(p, A, b) {
    const T = b ?? new o(16), v = p[0], P = p[1], R = p[2], q = p[3], X = p[4], G = p[5], Z = p[6], ht = p[7], st = p[8], it = p[9], xt = p[10], Mt = p[11], yt = p[12], mt = p[13], Dt = p[14], It = p[15], Zt = A[0], Jt = A[1], Qt = A[2], ee = A[3], ie = A[4], re = A[5], oe = A[6], ce = A[7], ae = A[8], de = A[9], xe = A[10], ye = A[11], pe = A[12], we = A[13], ve = A[14], Me = A[15];
    return T[0] = v * Zt + X * Jt + st * Qt + yt * ee, T[1] = P * Zt + G * Jt + it * Qt + mt * ee, T[2] = R * Zt + Z * Jt + xt * Qt + Dt * ee, T[3] = q * Zt + ht * Jt + Mt * Qt + It * ee, T[4] = v * ie + X * re + st * oe + yt * ce, T[5] = P * ie + G * re + it * oe + mt * ce, T[6] = R * ie + Z * re + xt * oe + Dt * ce, T[7] = q * ie + ht * re + Mt * oe + It * ce, T[8] = v * ae + X * de + st * xe + yt * ye, T[9] = P * ae + G * de + it * xe + mt * ye, T[10] = R * ae + Z * de + xt * xe + Dt * ye, T[11] = q * ae + ht * de + Mt * xe + It * ye, T[12] = v * pe + X * we + st * ve + yt * Me, T[13] = P * pe + G * we + it * ve + mt * Me, T[14] = R * pe + Z * we + xt * ve + Dt * Me, T[15] = q * pe + ht * we + Mt * ve + It * Me, T;
  }
  const N = I;
  function O(p, A, b) {
    const T = b ?? y();
    return p !== T && (T[0] = p[0], T[1] = p[1], T[2] = p[2], T[3] = p[3], T[4] = p[4], T[5] = p[5], T[6] = p[6], T[7] = p[7], T[8] = p[8], T[9] = p[9], T[10] = p[10], T[11] = p[11]), T[12] = A[0], T[13] = A[1], T[14] = A[2], T[15] = 1, T;
  }
  function z(p, A) {
    const b = A ?? e.create();
    return b[0] = p[12], b[1] = p[13], b[2] = p[14], b;
  }
  function k(p, A, b) {
    const T = b ?? e.create(), v = A * 4;
    return T[0] = p[v + 0], T[1] = p[v + 1], T[2] = p[v + 2], T;
  }
  function Y(p, A, b, T) {
    const v = T === p ? T : u(p, T), P = b * 4;
    return v[P + 0] = A[0], v[P + 1] = A[1], v[P + 2] = A[2], v;
  }
  function H(p, A) {
    const b = A ?? e.create(), T = p[0], v = p[1], P = p[2], R = p[4], q = p[5], X = p[6], G = p[8], Z = p[9], ht = p[10];
    return b[0] = Math.sqrt(T * T + v * v + P * P), b[1] = Math.sqrt(R * R + q * q + X * X), b[2] = Math.sqrt(G * G + Z * Z + ht * ht), b;
  }
  function $(p, A, b, T, v) {
    const P = v ?? new o(16), R = Math.tan(Math.PI * 0.5 - 0.5 * p);
    if (P[0] = R / A, P[1] = 0, P[2] = 0, P[3] = 0, P[4] = 0, P[5] = R, P[6] = 0, P[7] = 0, P[8] = 0, P[9] = 0, P[11] = -1, P[12] = 0, P[13] = 0, P[15] = 0, Number.isFinite(T)) {
      const q = 1 / (b - T);
      P[10] = T * q, P[14] = T * b * q;
    } else
      P[10] = -1, P[14] = -b;
    return P;
  }
  function W(p, A, b, T = 1 / 0, v) {
    const P = v ?? new o(16), R = 1 / Math.tan(p * 0.5);
    if (P[0] = R / A, P[1] = 0, P[2] = 0, P[3] = 0, P[4] = 0, P[5] = R, P[6] = 0, P[7] = 0, P[8] = 0, P[9] = 0, P[11] = -1, P[12] = 0, P[13] = 0, P[15] = 0, T === 1 / 0)
      P[10] = 0, P[14] = b;
    else {
      const q = 1 / (T - b);
      P[10] = b * q, P[14] = T * b * q;
    }
    return P;
  }
  function J(p, A, b, T, v, P, R) {
    const q = R ?? new o(16);
    return q[0] = 2 / (A - p), q[1] = 0, q[2] = 0, q[3] = 0, q[4] = 0, q[5] = 2 / (T - b), q[6] = 0, q[7] = 0, q[8] = 0, q[9] = 0, q[10] = 1 / (v - P), q[11] = 0, q[12] = (A + p) / (p - A), q[13] = (T + b) / (b - T), q[14] = v / (v - P), q[15] = 1, q;
  }
  function ot(p, A, b, T, v, P, R) {
    const q = R ?? new o(16), X = A - p, G = T - b, Z = v - P;
    return q[0] = 2 * v / X, q[1] = 0, q[2] = 0, q[3] = 0, q[4] = 0, q[5] = 2 * v / G, q[6] = 0, q[7] = 0, q[8] = (p + A) / X, q[9] = (T + b) / G, q[10] = P / Z, q[11] = -1, q[12] = 0, q[13] = 0, q[14] = v * P / Z, q[15] = 0, q;
  }
  function K(p, A, b, T, v, P = 1 / 0, R) {
    const q = R ?? new o(16), X = A - p, G = T - b;
    if (q[0] = 2 * v / X, q[1] = 0, q[2] = 0, q[3] = 0, q[4] = 0, q[5] = 2 * v / G, q[6] = 0, q[7] = 0, q[8] = (p + A) / X, q[9] = (T + b) / G, q[11] = -1, q[12] = 0, q[13] = 0, q[15] = 0, P === 1 / 0)
      q[10] = 0, q[14] = v;
    else {
      const Z = 1 / (P - v);
      q[10] = v * Z, q[14] = P * v * Z;
    }
    return q;
  }
  const j = e.create(), V = e.create(), at = e.create();
  function pt(p, A, b, T) {
    const v = T ?? new o(16);
    return e.normalize(e.subtract(A, p, at), at), e.normalize(e.cross(b, at, j), j), e.normalize(e.cross(at, j, V), V), v[0] = j[0], v[1] = j[1], v[2] = j[2], v[3] = 0, v[4] = V[0], v[5] = V[1], v[6] = V[2], v[7] = 0, v[8] = at[0], v[9] = at[1], v[10] = at[2], v[11] = 0, v[12] = p[0], v[13] = p[1], v[14] = p[2], v[15] = 1, v;
  }
  function At(p, A, b, T) {
    const v = T ?? new o(16);
    return e.normalize(e.subtract(p, A, at), at), e.normalize(e.cross(b, at, j), j), e.normalize(e.cross(at, j, V), V), v[0] = j[0], v[1] = j[1], v[2] = j[2], v[3] = 0, v[4] = V[0], v[5] = V[1], v[6] = V[2], v[7] = 0, v[8] = at[0], v[9] = at[1], v[10] = at[2], v[11] = 0, v[12] = p[0], v[13] = p[1], v[14] = p[2], v[15] = 1, v;
  }
  function vt(p, A, b, T) {
    const v = T ?? new o(16);
    return e.normalize(e.subtract(p, A, at), at), e.normalize(e.cross(b, at, j), j), e.normalize(e.cross(at, j, V), V), v[0] = j[0], v[1] = V[0], v[2] = at[0], v[3] = 0, v[4] = j[1], v[5] = V[1], v[6] = at[1], v[7] = 0, v[8] = j[2], v[9] = V[2], v[10] = at[2], v[11] = 0, v[12] = -(j[0] * p[0] + j[1] * p[1] + j[2] * p[2]), v[13] = -(V[0] * p[0] + V[1] * p[1] + V[2] * p[2]), v[14] = -(at[0] * p[0] + at[1] * p[1] + at[2] * p[2]), v[15] = 1, v;
  }
  function Ot(p, A) {
    const b = A ?? new o(16);
    return b[0] = 1, b[1] = 0, b[2] = 0, b[3] = 0, b[4] = 0, b[5] = 1, b[6] = 0, b[7] = 0, b[8] = 0, b[9] = 0, b[10] = 1, b[11] = 0, b[12] = p[0], b[13] = p[1], b[14] = p[2], b[15] = 1, b;
  }
  function kt(p, A, b) {
    const T = b ?? new o(16), v = A[0], P = A[1], R = A[2], q = p[0], X = p[1], G = p[2], Z = p[3], ht = p[4], st = p[5], it = p[6], xt = p[7], Mt = p[8], yt = p[9], mt = p[10], Dt = p[11], It = p[12], Zt = p[13], Jt = p[14], Qt = p[15];
    return p !== T && (T[0] = q, T[1] = X, T[2] = G, T[3] = Z, T[4] = ht, T[5] = st, T[6] = it, T[7] = xt, T[8] = Mt, T[9] = yt, T[10] = mt, T[11] = Dt), T[12] = q * v + ht * P + Mt * R + It, T[13] = X * v + st * P + yt * R + Zt, T[14] = G * v + it * P + mt * R + Jt, T[15] = Z * v + xt * P + Dt * R + Qt, T;
  }
  function Nt(p, A) {
    const b = A ?? new o(16), T = Math.cos(p), v = Math.sin(p);
    return b[0] = 1, b[1] = 0, b[2] = 0, b[3] = 0, b[4] = 0, b[5] = T, b[6] = v, b[7] = 0, b[8] = 0, b[9] = -v, b[10] = T, b[11] = 0, b[12] = 0, b[13] = 0, b[14] = 0, b[15] = 1, b;
  }
  function Ht(p, A, b) {
    const T = b ?? new o(16), v = p[4], P = p[5], R = p[6], q = p[7], X = p[8], G = p[9], Z = p[10], ht = p[11], st = Math.cos(A), it = Math.sin(A);
    return T[4] = st * v + it * X, T[5] = st * P + it * G, T[6] = st * R + it * Z, T[7] = st * q + it * ht, T[8] = st * X - it * v, T[9] = st * G - it * P, T[10] = st * Z - it * R, T[11] = st * ht - it * q, p !== T && (T[0] = p[0], T[1] = p[1], T[2] = p[2], T[3] = p[3], T[12] = p[12], T[13] = p[13], T[14] = p[14], T[15] = p[15]), T;
  }
  function Vt(p, A) {
    const b = A ?? new o(16), T = Math.cos(p), v = Math.sin(p);
    return b[0] = T, b[1] = 0, b[2] = -v, b[3] = 0, b[4] = 0, b[5] = 1, b[6] = 0, b[7] = 0, b[8] = v, b[9] = 0, b[10] = T, b[11] = 0, b[12] = 0, b[13] = 0, b[14] = 0, b[15] = 1, b;
  }
  function Ut(p, A, b) {
    const T = b ?? new o(16), v = p[0], P = p[1], R = p[2], q = p[3], X = p[8], G = p[9], Z = p[10], ht = p[11], st = Math.cos(A), it = Math.sin(A);
    return T[0] = st * v - it * X, T[1] = st * P - it * G, T[2] = st * R - it * Z, T[3] = st * q - it * ht, T[8] = st * X + it * v, T[9] = st * G + it * P, T[10] = st * Z + it * R, T[11] = st * ht + it * q, p !== T && (T[4] = p[4], T[5] = p[5], T[6] = p[6], T[7] = p[7], T[12] = p[12], T[13] = p[13], T[14] = p[14], T[15] = p[15]), T;
  }
  function U(p, A) {
    const b = A ?? new o(16), T = Math.cos(p), v = Math.sin(p);
    return b[0] = T, b[1] = v, b[2] = 0, b[3] = 0, b[4] = -v, b[5] = T, b[6] = 0, b[7] = 0, b[8] = 0, b[9] = 0, b[10] = 1, b[11] = 0, b[12] = 0, b[13] = 0, b[14] = 0, b[15] = 1, b;
  }
  function Q(p, A, b) {
    const T = b ?? new o(16), v = p[0], P = p[1], R = p[2], q = p[3], X = p[4], G = p[5], Z = p[6], ht = p[7], st = Math.cos(A), it = Math.sin(A);
    return T[0] = st * v + it * X, T[1] = st * P + it * G, T[2] = st * R + it * Z, T[3] = st * q + it * ht, T[4] = st * X - it * v, T[5] = st * G - it * P, T[6] = st * Z - it * R, T[7] = st * ht - it * q, p !== T && (T[8] = p[8], T[9] = p[9], T[10] = p[10], T[11] = p[11], T[12] = p[12], T[13] = p[13], T[14] = p[14], T[15] = p[15]), T;
  }
  function D(p, A, b) {
    const T = b ?? new o(16);
    let v = p[0], P = p[1], R = p[2];
    const q = Math.sqrt(v * v + P * P + R * R);
    v /= q, P /= q, R /= q;
    const X = v * v, G = P * P, Z = R * R, ht = Math.cos(A), st = Math.sin(A), it = 1 - ht;
    return T[0] = X + (1 - X) * ht, T[1] = v * P * it + R * st, T[2] = v * R * it - P * st, T[3] = 0, T[4] = v * P * it - R * st, T[5] = G + (1 - G) * ht, T[6] = P * R * it + v * st, T[7] = 0, T[8] = v * R * it + P * st, T[9] = P * R * it - v * st, T[10] = Z + (1 - Z) * ht, T[11] = 0, T[12] = 0, T[13] = 0, T[14] = 0, T[15] = 1, T;
  }
  const m = D;
  function L(p, A, b, T) {
    const v = T ?? new o(16);
    let P = A[0], R = A[1], q = A[2];
    const X = Math.sqrt(P * P + R * R + q * q);
    P /= X, R /= X, q /= X;
    const G = P * P, Z = R * R, ht = q * q, st = Math.cos(b), it = Math.sin(b), xt = 1 - st, Mt = G + (1 - G) * st, yt = P * R * xt + q * it, mt = P * q * xt - R * it, Dt = P * R * xt - q * it, It = Z + (1 - Z) * st, Zt = R * q * xt + P * it, Jt = P * q * xt + R * it, Qt = R * q * xt - P * it, ee = ht + (1 - ht) * st, ie = p[0], re = p[1], oe = p[2], ce = p[3], ae = p[4], de = p[5], xe = p[6], ye = p[7], pe = p[8], we = p[9], ve = p[10], Me = p[11];
    return v[0] = Mt * ie + yt * ae + mt * pe, v[1] = Mt * re + yt * de + mt * we, v[2] = Mt * oe + yt * xe + mt * ve, v[3] = Mt * ce + yt * ye + mt * Me, v[4] = Dt * ie + It * ae + Zt * pe, v[5] = Dt * re + It * de + Zt * we, v[6] = Dt * oe + It * xe + Zt * ve, v[7] = Dt * ce + It * ye + Zt * Me, v[8] = Jt * ie + Qt * ae + ee * pe, v[9] = Jt * re + Qt * de + ee * we, v[10] = Jt * oe + Qt * xe + ee * ve, v[11] = Jt * ce + Qt * ye + ee * Me, p !== v && (v[12] = p[12], v[13] = p[13], v[14] = p[14], v[15] = p[15]), v;
  }
  const _ = L;
  function S(p, A) {
    const b = A ?? new o(16);
    return b[0] = p[0], b[1] = 0, b[2] = 0, b[3] = 0, b[4] = 0, b[5] = p[1], b[6] = 0, b[7] = 0, b[8] = 0, b[9] = 0, b[10] = p[2], b[11] = 0, b[12] = 0, b[13] = 0, b[14] = 0, b[15] = 1, b;
  }
  function C(p, A, b) {
    const T = b ?? new o(16), v = A[0], P = A[1], R = A[2];
    return T[0] = v * p[0], T[1] = v * p[1], T[2] = v * p[2], T[3] = v * p[3], T[4] = P * p[4], T[5] = P * p[5], T[6] = P * p[6], T[7] = P * p[7], T[8] = R * p[8], T[9] = R * p[9], T[10] = R * p[10], T[11] = R * p[11], p !== T && (T[12] = p[12], T[13] = p[13], T[14] = p[14], T[15] = p[15]), T;
  }
  function F(p, A) {
    const b = A ?? new o(16);
    return b[0] = p, b[1] = 0, b[2] = 0, b[3] = 0, b[4] = 0, b[5] = p, b[6] = 0, b[7] = 0, b[8] = 0, b[9] = 0, b[10] = p, b[11] = 0, b[12] = 0, b[13] = 0, b[14] = 0, b[15] = 1, b;
  }
  function B(p, A, b) {
    const T = b ?? new o(16);
    return T[0] = A * p[0], T[1] = A * p[1], T[2] = A * p[2], T[3] = A * p[3], T[4] = A * p[4], T[5] = A * p[5], T[6] = A * p[6], T[7] = A * p[7], T[8] = A * p[8], T[9] = A * p[9], T[10] = A * p[10], T[11] = A * p[11], p !== T && (T[12] = p[12], T[13] = p[13], T[14] = p[14], T[15] = p[15]), T;
  }
  return {
    add: a,
    aim: pt,
    axisRotate: L,
    axisRotation: D,
    cameraAim: At,
    clone: f,
    copy: u,
    create: n,
    determinant: M,
    equals: x,
    equalsApproximately: d,
    fromMat3: i,
    fromQuat: r,
    frustum: ot,
    frustumReverseZ: K,
    getAxis: k,
    getScaling: H,
    getTranslation: z,
    identity: y,
    inverse: w,
    invert: E,
    lookAt: vt,
    mul: N,
    mulScalar: l,
    multiply: I,
    multiplyScalar: h,
    negate: c,
    ortho: J,
    perspective: $,
    perspectiveReverseZ: W,
    rotate: _,
    rotateX: Ht,
    rotateY: Ut,
    rotateZ: Q,
    rotation: m,
    rotationX: Nt,
    rotationY: Vt,
    rotationZ: U,
    scale: C,
    scaling: S,
    set: s,
    setAxis: Y,
    setTranslation: O,
    translate: kt,
    translation: Ot,
    transpose: g,
    uniformScale: B,
    uniformScaling: F
  };
}
const Ko = /* @__PURE__ */ new Map();
function t0(o) {
  let e = Ko.get(o);
  return e || (e = Ku(o), Ko.set(o, e)), e;
}
function e0(o) {
  const e = qi(o);
  function n(U, Q, D, m) {
    const L = new o(4);
    return U !== void 0 && (L[0] = U, Q !== void 0 && (L[1] = Q, D !== void 0 && (L[2] = D, m !== void 0 && (L[3] = m)))), L;
  }
  const s = n;
  function i(U, Q, D, m, L) {
    const _ = L ?? new o(4);
    return _[0] = U, _[1] = Q, _[2] = D, _[3] = m, _;
  }
  function r(U, Q, D) {
    const m = D ?? new o(4), L = Q * 0.5, _ = Math.sin(L);
    return m[0] = _ * U[0], m[1] = _ * U[1], m[2] = _ * U[2], m[3] = Math.cos(L), m;
  }
  function c(U, Q) {
    const D = Q ?? e.create(3), m = Math.acos(U[3]) * 2, L = Math.sin(m * 0.5);
    return L > Pt ? (D[0] = U[0] / L, D[1] = U[1] / L, D[2] = U[2] / L) : (D[0] = 1, D[1] = 0, D[2] = 0), { angle: m, axis: D };
  }
  function a(U, Q) {
    const D = $(U, Q);
    return Math.acos(2 * D * D - 1);
  }
  function h(U, Q, D) {
    const m = D ?? new o(4), L = U[0], _ = U[1], S = U[2], C = U[3], F = Q[0], B = Q[1], p = Q[2], A = Q[3];
    return m[0] = L * A + C * F + _ * p - S * B, m[1] = _ * A + C * B + S * F - L * p, m[2] = S * A + C * p + L * B - _ * F, m[3] = C * A - L * F - _ * B - S * p, m;
  }
  const l = h;
  function u(U, Q, D) {
    const m = D ?? new o(4), L = Q * 0.5, _ = U[0], S = U[1], C = U[2], F = U[3], B = Math.sin(L), p = Math.cos(L);
    return m[0] = _ * p + F * B, m[1] = S * p + C * B, m[2] = C * p - S * B, m[3] = F * p - _ * B, m;
  }
  function f(U, Q, D) {
    const m = D ?? new o(4), L = Q * 0.5, _ = U[0], S = U[1], C = U[2], F = U[3], B = Math.sin(L), p = Math.cos(L);
    return m[0] = _ * p - C * B, m[1] = S * p + F * B, m[2] = C * p + _ * B, m[3] = F * p - S * B, m;
  }
  function d(U, Q, D) {
    const m = D ?? new o(4), L = Q * 0.5, _ = U[0], S = U[1], C = U[2], F = U[3], B = Math.sin(L), p = Math.cos(L);
    return m[0] = _ * p + S * B, m[1] = S * p - _ * B, m[2] = C * p + F * B, m[3] = F * p - C * B, m;
  }
  function x(U, Q, D, m) {
    const L = m ?? new o(4), _ = U[0], S = U[1], C = U[2], F = U[3];
    let B = Q[0], p = Q[1], A = Q[2], b = Q[3], T = _ * B + S * p + C * A + F * b;
    T < 0 && (T = -T, B = -B, p = -p, A = -A, b = -b);
    let v, P;
    if (1 - T > Pt) {
      const R = Math.acos(T), q = Math.sin(R);
      v = Math.sin((1 - D) * R) / q, P = Math.sin(D * R) / q;
    } else
      v = 1 - D, P = D;
    return L[0] = v * _ + P * B, L[1] = v * S + P * p, L[2] = v * C + P * A, L[3] = v * F + P * b, L;
  }
  function y(U, Q) {
    const D = Q ?? new o(4), m = U[0], L = U[1], _ = U[2], S = U[3], C = m * m + L * L + _ * _ + S * S, F = C ? 1 / C : 0;
    return D[0] = -m * F, D[1] = -L * F, D[2] = -_ * F, D[3] = S * F, D;
  }
  function g(U, Q) {
    const D = Q ?? new o(4);
    return D[0] = -U[0], D[1] = -U[1], D[2] = -U[2], D[3] = U[3], D;
  }
  function w(U, Q) {
    const D = Q ?? new o(4), m = U[0] + U[5] + U[10];
    if (m > 0) {
      const L = Math.sqrt(m + 1);
      D[3] = 0.5 * L;
      const _ = 0.5 / L;
      D[0] = (U[6] - U[9]) * _, D[1] = (U[8] - U[2]) * _, D[2] = (U[1] - U[4]) * _;
    } else {
      let L = 0;
      U[5] > U[0] && (L = 1), U[10] > U[L * 4 + L] && (L = 2);
      const _ = (L + 1) % 3, S = (L + 2) % 3, C = Math.sqrt(U[L * 4 + L] - U[_ * 4 + _] - U[S * 4 + S] + 1);
      D[L] = 0.5 * C;
      const F = 0.5 / C;
      D[3] = (U[_ * 4 + S] - U[S * 4 + _]) * F, D[_] = (U[_ * 4 + L] + U[L * 4 + _]) * F, D[S] = (U[S * 4 + L] + U[L * 4 + S]) * F;
    }
    return D;
  }
  function M(U, Q, D, m, L) {
    const _ = L ?? new o(4), S = U * 0.5, C = Q * 0.5, F = D * 0.5, B = Math.sin(S), p = Math.cos(S), A = Math.sin(C), b = Math.cos(C), T = Math.sin(F), v = Math.cos(F);
    switch (m) {
      case "xyz":
        _[0] = B * b * v + p * A * T, _[1] = p * A * v - B * b * T, _[2] = p * b * T + B * A * v, _[3] = p * b * v - B * A * T;
        break;
      case "xzy":
        _[0] = B * b * v - p * A * T, _[1] = p * A * v - B * b * T, _[2] = p * b * T + B * A * v, _[3] = p * b * v + B * A * T;
        break;
      case "yxz":
        _[0] = B * b * v + p * A * T, _[1] = p * A * v - B * b * T, _[2] = p * b * T - B * A * v, _[3] = p * b * v + B * A * T;
        break;
      case "yzx":
        _[0] = B * b * v + p * A * T, _[1] = p * A * v + B * b * T, _[2] = p * b * T - B * A * v, _[3] = p * b * v - B * A * T;
        break;
      case "zxy":
        _[0] = B * b * v - p * A * T, _[1] = p * A * v + B * b * T, _[2] = p * b * T + B * A * v, _[3] = p * b * v - B * A * T;
        break;
      case "zyx":
        _[0] = B * b * v - p * A * T, _[1] = p * A * v + B * b * T, _[2] = p * b * T - B * A * v, _[3] = p * b * v + B * A * T;
        break;
      default:
        throw new Error(`Unknown rotation order: ${m}`);
    }
    return _;
  }
  function E(U, Q) {
    const D = Q ?? new o(4);
    return D[0] = U[0], D[1] = U[1], D[2] = U[2], D[3] = U[3], D;
  }
  const I = E;
  function N(U, Q, D) {
    const m = D ?? new o(4);
    return m[0] = U[0] + Q[0], m[1] = U[1] + Q[1], m[2] = U[2] + Q[2], m[3] = U[3] + Q[3], m;
  }
  function O(U, Q, D) {
    const m = D ?? new o(4);
    return m[0] = U[0] - Q[0], m[1] = U[1] - Q[1], m[2] = U[2] - Q[2], m[3] = U[3] - Q[3], m;
  }
  const z = O;
  function k(U, Q, D) {
    const m = D ?? new o(4);
    return m[0] = U[0] * Q, m[1] = U[1] * Q, m[2] = U[2] * Q, m[3] = U[3] * Q, m;
  }
  const Y = k;
  function H(U, Q, D) {
    const m = D ?? new o(4);
    return m[0] = U[0] / Q, m[1] = U[1] / Q, m[2] = U[2] / Q, m[3] = U[3] / Q, m;
  }
  function $(U, Q) {
    return U[0] * Q[0] + U[1] * Q[1] + U[2] * Q[2] + U[3] * Q[3];
  }
  function W(U, Q, D, m) {
    const L = m ?? new o(4);
    return L[0] = U[0] + D * (Q[0] - U[0]), L[1] = U[1] + D * (Q[1] - U[1]), L[2] = U[2] + D * (Q[2] - U[2]), L[3] = U[3] + D * (Q[3] - U[3]), L;
  }
  function J(U) {
    const Q = U[0], D = U[1], m = U[2], L = U[3];
    return Math.sqrt(Q * Q + D * D + m * m + L * L);
  }
  const ot = J;
  function K(U) {
    const Q = U[0], D = U[1], m = U[2], L = U[3];
    return Q * Q + D * D + m * m + L * L;
  }
  const j = K;
  function V(U, Q) {
    const D = Q ?? new o(4), m = U[0], L = U[1], _ = U[2], S = U[3], C = Math.sqrt(m * m + L * L + _ * _ + S * S);
    return C > 1e-5 ? (D[0] = m / C, D[1] = L / C, D[2] = _ / C, D[3] = S / C) : (D[0] = 0, D[1] = 0, D[2] = 0, D[3] = 1), D;
  }
  function at(U, Q) {
    return Math.abs(U[0] - Q[0]) < Pt && Math.abs(U[1] - Q[1]) < Pt && Math.abs(U[2] - Q[2]) < Pt && Math.abs(U[3] - Q[3]) < Pt;
  }
  function pt(U, Q) {
    return U[0] === Q[0] && U[1] === Q[1] && U[2] === Q[2] && U[3] === Q[3];
  }
  function At(U) {
    const Q = U ?? new o(4);
    return Q[0] = 0, Q[1] = 0, Q[2] = 0, Q[3] = 1, Q;
  }
  const vt = e.create(), Ot = e.create(), kt = e.create();
  function Nt(U, Q, D) {
    const m = D ?? new o(4), L = e.dot(U, Q);
    return L < -0.999999 ? (e.cross(Ot, U, vt), e.len(vt) < 1e-6 && e.cross(kt, U, vt), e.normalize(vt, vt), r(vt, Math.PI, m), m) : L > 0.999999 ? (m[0] = 0, m[1] = 0, m[2] = 0, m[3] = 1, m) : (e.cross(U, Q, vt), m[0] = vt[0], m[1] = vt[1], m[2] = vt[2], m[3] = 1 + L, V(m, m));
  }
  const Ht = new o(4), Vt = new o(4);
  function Ut(U, Q, D, m, L, _) {
    const S = _ ?? new o(4);
    return x(U, m, L, Ht), x(Q, D, L, Vt), x(Ht, Vt, 2 * L * (1 - L), S), S;
  }
  return {
    create: n,
    fromValues: s,
    set: i,
    fromAxisAngle: r,
    toAxisAngle: c,
    angle: a,
    multiply: h,
    mul: l,
    rotateX: u,
    rotateY: f,
    rotateZ: d,
    slerp: x,
    inverse: y,
    conjugate: g,
    fromMat: w,
    fromEuler: M,
    copy: E,
    clone: I,
    add: N,
    subtract: O,
    sub: z,
    mulScalar: k,
    scale: Y,
    divScalar: H,
    dot: $,
    lerp: W,
    length: J,
    len: ot,
    lengthSq: K,
    lenSq: j,
    normalize: V,
    equalsApproximately: at,
    equals: pt,
    identity: At,
    rotationTo: Nt,
    sqlerp: Ut
  };
}
const tc = /* @__PURE__ */ new Map();
function n0(o) {
  let e = tc.get(o);
  return e || (e = e0(o), tc.set(o, e)), e;
}
function s0(o) {
  function e(D, m, L, _) {
    const S = new o(4);
    return D !== void 0 && (S[0] = D, m !== void 0 && (S[1] = m, L !== void 0 && (S[2] = L, _ !== void 0 && (S[3] = _)))), S;
  }
  const n = e;
  function s(D, m, L, _, S) {
    const C = S ?? new o(4);
    return C[0] = D, C[1] = m, C[2] = L, C[3] = _, C;
  }
  function i(D, m) {
    const L = m ?? new o(4);
    return L[0] = Math.ceil(D[0]), L[1] = Math.ceil(D[1]), L[2] = Math.ceil(D[2]), L[3] = Math.ceil(D[3]), L;
  }
  function r(D, m) {
    const L = m ?? new o(4);
    return L[0] = Math.floor(D[0]), L[1] = Math.floor(D[1]), L[2] = Math.floor(D[2]), L[3] = Math.floor(D[3]), L;
  }
  function c(D, m) {
    const L = m ?? new o(4);
    return L[0] = Math.round(D[0]), L[1] = Math.round(D[1]), L[2] = Math.round(D[2]), L[3] = Math.round(D[3]), L;
  }
  function a(D, m = 0, L = 1, _) {
    const S = _ ?? new o(4);
    return S[0] = Math.min(L, Math.max(m, D[0])), S[1] = Math.min(L, Math.max(m, D[1])), S[2] = Math.min(L, Math.max(m, D[2])), S[3] = Math.min(L, Math.max(m, D[3])), S;
  }
  function h(D, m, L) {
    const _ = L ?? new o(4);
    return _[0] = D[0] + m[0], _[1] = D[1] + m[1], _[2] = D[2] + m[2], _[3] = D[3] + m[3], _;
  }
  function l(D, m, L, _) {
    const S = _ ?? new o(4);
    return S[0] = D[0] + m[0] * L, S[1] = D[1] + m[1] * L, S[2] = D[2] + m[2] * L, S[3] = D[3] + m[3] * L, S;
  }
  function u(D, m, L) {
    const _ = L ?? new o(4);
    return _[0] = D[0] - m[0], _[1] = D[1] - m[1], _[2] = D[2] - m[2], _[3] = D[3] - m[3], _;
  }
  const f = u;
  function d(D, m) {
    return Math.abs(D[0] - m[0]) < Pt && Math.abs(D[1] - m[1]) < Pt && Math.abs(D[2] - m[2]) < Pt && Math.abs(D[3] - m[3]) < Pt;
  }
  function x(D, m) {
    return D[0] === m[0] && D[1] === m[1] && D[2] === m[2] && D[3] === m[3];
  }
  function y(D, m, L, _) {
    const S = _ ?? new o(4);
    return S[0] = D[0] + L * (m[0] - D[0]), S[1] = D[1] + L * (m[1] - D[1]), S[2] = D[2] + L * (m[2] - D[2]), S[3] = D[3] + L * (m[3] - D[3]), S;
  }
  function g(D, m, L, _) {
    const S = _ ?? new o(4);
    return S[0] = D[0] + L[0] * (m[0] - D[0]), S[1] = D[1] + L[1] * (m[1] - D[1]), S[2] = D[2] + L[2] * (m[2] - D[2]), S[3] = D[3] + L[3] * (m[3] - D[3]), S;
  }
  function w(D, m, L) {
    const _ = L ?? new o(4);
    return _[0] = Math.max(D[0], m[0]), _[1] = Math.max(D[1], m[1]), _[2] = Math.max(D[2], m[2]), _[3] = Math.max(D[3], m[3]), _;
  }
  function M(D, m, L) {
    const _ = L ?? new o(4);
    return _[0] = Math.min(D[0], m[0]), _[1] = Math.min(D[1], m[1]), _[2] = Math.min(D[2], m[2]), _[3] = Math.min(D[3], m[3]), _;
  }
  function E(D, m, L) {
    const _ = L ?? new o(4);
    return _[0] = D[0] * m, _[1] = D[1] * m, _[2] = D[2] * m, _[3] = D[3] * m, _;
  }
  const I = E;
  function N(D, m, L) {
    const _ = L ?? new o(4);
    return _[0] = D[0] / m, _[1] = D[1] / m, _[2] = D[2] / m, _[3] = D[3] / m, _;
  }
  function O(D, m) {
    const L = m ?? new o(4);
    return L[0] = 1 / D[0], L[1] = 1 / D[1], L[2] = 1 / D[2], L[3] = 1 / D[3], L;
  }
  const z = O;
  function k(D, m) {
    return D[0] * m[0] + D[1] * m[1] + D[2] * m[2] + D[3] * m[3];
  }
  function Y(D) {
    const m = D[0], L = D[1], _ = D[2], S = D[3];
    return Math.sqrt(m * m + L * L + _ * _ + S * S);
  }
  const H = Y;
  function $(D) {
    const m = D[0], L = D[1], _ = D[2], S = D[3];
    return m * m + L * L + _ * _ + S * S;
  }
  const W = $;
  function J(D, m) {
    const L = D[0] - m[0], _ = D[1] - m[1], S = D[2] - m[2], C = D[3] - m[3];
    return Math.sqrt(L * L + _ * _ + S * S + C * C);
  }
  const ot = J;
  function K(D, m) {
    const L = D[0] - m[0], _ = D[1] - m[1], S = D[2] - m[2], C = D[3] - m[3];
    return L * L + _ * _ + S * S + C * C;
  }
  const j = K;
  function V(D, m) {
    const L = m ?? new o(4), _ = D[0], S = D[1], C = D[2], F = D[3], B = _ * _ + S * S + C * C + F * F, p = B > 0 ? 1 / Math.sqrt(B) : 1;
    return L[0] = _ * p, L[1] = S * p, L[2] = C * p, L[3] = F * p, L;
  }
  function at(D, m) {
    const L = m ?? new o(4);
    return L[0] = -D[0], L[1] = -D[1], L[2] = -D[2], L[3] = -D[3], L;
  }
  function pt(D, m) {
    const L = m ?? new o(4);
    return L[0] = D[0], L[1] = D[1], L[2] = D[2], L[3] = D[3], L;
  }
  const At = pt;
  function vt(D, m, L) {
    const _ = L ?? new o(4);
    return _[0] = D[0] * m[0], _[1] = D[1] * m[1], _[2] = D[2] * m[2], _[3] = D[3] * m[3], _;
  }
  const Ot = vt;
  function kt(D, m, L) {
    const _ = L ?? new o(4);
    return _[0] = D[0] / m[0], _[1] = D[1] / m[1], _[2] = D[2] / m[2], _[3] = D[3] / m[3], _;
  }
  const Nt = kt;
  function Ht(D) {
    const m = D ?? new o(4);
    return m[0] = 0, m[1] = 0, m[2] = 0, m[3] = 0, m;
  }
  function Vt(D, m, L) {
    const _ = L ?? new o(4), S = D[0], C = D[1], F = D[2], B = D[3];
    return _[0] = m[0] * S + m[4] * C + m[8] * F + m[12] * B, _[1] = m[1] * S + m[5] * C + m[9] * F + m[13] * B, _[2] = m[2] * S + m[6] * C + m[10] * F + m[14] * B, _[3] = m[3] * S + m[7] * C + m[11] * F + m[15] * B, _;
  }
  function Ut(D, m, L) {
    const _ = L ?? new o(4);
    return V(D, _), E(_, m, _);
  }
  function U(D, m, L) {
    const _ = L ?? new o(4);
    return Y(D) > m ? Ut(D, m, _) : pt(D, _);
  }
  function Q(D, m, L) {
    const _ = L ?? new o(4);
    return y(D, m, 0.5, _);
  }
  return {
    create: e,
    fromValues: n,
    set: s,
    ceil: i,
    floor: r,
    round: c,
    clamp: a,
    add: h,
    addScaled: l,
    subtract: u,
    sub: f,
    equalsApproximately: d,
    equals: x,
    lerp: y,
    lerpV: g,
    max: w,
    min: M,
    mulScalar: E,
    scale: I,
    divScalar: N,
    inverse: O,
    invert: z,
    dot: k,
    length: Y,
    len: H,
    lengthSq: $,
    lenSq: W,
    distance: J,
    dist: ot,
    distanceSq: K,
    distSq: j,
    normalize: V,
    negate: at,
    copy: pt,
    clone: At,
    multiply: vt,
    mul: Ot,
    divide: kt,
    div: Nt,
    zero: Ht,
    transformMat4: Vt,
    setLength: Ut,
    truncate: U,
    midpoint: Q
  };
}
const ec = /* @__PURE__ */ new Map();
function i0(o) {
  let e = ec.get(o);
  return e || (e = s0(o), ec.set(o, e)), e;
}
function Ur(o, e, n, s, i, r) {
  return {
    /** @namespace mat3 */
    mat3: Qu(o),
    /** @namespace mat4 */
    mat4: t0(e),
    /** @namespace quat */
    quat: n0(n),
    /** @namespace vec2 */
    vec2: ya(s),
    /** @namespace vec3 */
    vec3: qi(i),
    /** @namespace vec4 */
    vec4: i0(r)
  };
}
const {
  /**
   * 3x3 Matrix functions that default to returning `Float32Array`
   * @namespace
   */
  mat3: r0,
  /**
   * 4x4 Matrix functions that default to returning `Float32Array`
   * @namespace
   */
  mat4: o0,
  /**
   * Quaternion functions that default to returning `Float32Array`
   * @namespace
   */
  quat: c0,
  /**
   * Vec2 functions that default to returning `Float32Array`
   * @namespace
   */
  vec2: a0,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec3: h0,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec4: l0
} = Ur(
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
  mat3: u0,
  /**
   * 4x4 Matrix functions that default to returning `Float64Array`
   * @namespace
   */
  mat4: f0,
  /**
   * Quaternion functions that default to returning `Float64Array`
   * @namespace
   */
  quat: d0,
  /**
   * Vec2 functions that default to returning `Float64Array`
   * @namespace
   */
  vec2: x0,
  /**
   * Vec3 functions that default to returning `Float64Array`
   * @namespace
   */
  vec3: y0,
  /**
   * Vec3 functions that default to returning `Float64Array`
   * @namespace
   */
  vec4: p0
} = Ur(
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
  mat3: m0,
  /**
   * 4x4 Matrix functions that default to returning `number[]`
   * @namespace
   */
  mat4: g0,
  /**
   * Quaternion functions that default to returning `number[]`
   * @namespace
   */
  quat: w0,
  /**
   * Vec2 functions that default to returning `number[]`
   * @namespace
   */
  vec2: v0,
  /**
   * Vec3 functions that default to returning `number[]`
   * @namespace
   */
  vec3: M0,
  /**
   * Vec3 functions that default to returning `number[]`
   * @namespace
   */
  vec4: b0
} = Ur(
  Bu,
  Array,
  Array,
  Array,
  Array,
  Array
), H1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  mat3: r0,
  mat3d: u0,
  mat3n: m0,
  mat4: o0,
  mat4d: f0,
  mat4n: g0,
  quat: c0,
  quatd: d0,
  quatn: w0,
  utils: ju,
  vec2: a0,
  vec2d: x0,
  vec2n: v0,
  vec3: h0,
  vec3d: y0,
  vec3n: M0,
  vec4: l0,
  vec4d: p0,
  vec4n: b0
}, Symbol.toStringTag, { value: "Module" }));
class B1 {
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
      let h = c.order ?? 0, l = a.order ?? 0;
      return h - l;
    }), i) {
      case "create": {
        let c = n.initalValue;
        for (let a of r) {
          let h = await Promise.resolve().then(() => a.fn(n.args));
          if (h != null)
            return h;
        }
        return c;
      }
      case "add": {
        let c = n.initalValue ?? [];
        for (let a of r) {
          let h = await Promise.resolve().then(() => a.fn(n.args));
          h != null && c.push(h);
        }
        return c;
      }
      case "modify": {
        let c = n.initalValue ?? {};
        for (let a of r) {
          let h = await Promise.resolve().then(() => a.fn(c, n.args));
          h != null && (c = h);
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
const nc = typeof requestAnimationFrame < "u" ? {
  request: (o) => requestAnimationFrame(o),
  cancel: (o) => cancelAnimationFrame(o)
} : {
  // 兜底：setTimeout 16ms
  request: (o) => window.setTimeout(o, 16),
  cancel: (o) => clearTimeout(o)
}, sc = () => typeof performance < "u" ? performance.now() : Date.now();
class zt {
  static _instance = null;
  /** 获取使用默认 rAF 的全局单例 */
  static get shared() {
    return zt._instance || (zt._instance = new zt(nc)), zt._instance;
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
  static create(e = nc) {
    return new zt(e);
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
    return this._running ? this : (this._running = !0, this._lastTime = sc(), this._elapsed = 0, this._minInterval = zt.targetFPS > 0 ? 1e3 / zt.targetFPS : 0, this._frameId = this._scheduler.request(this._tick), this);
  }
  /** 停止时钟 */
  stop() {
    return this._running = !1, this._frameId && (this._scheduler.cancel(this._frameId), this._frameId = 0), this;
  }
  _tick = () => {
    if (!this._running) return;
    this._frameId = this._scheduler.request(this._tick);
    const e = sc();
    let n = e - this._lastTime;
    if (n < this._minInterval) return;
    n > 500 && (n = 500), this._lastTime = e - (n % this._minInterval || 0), this._elapsed += n;
    const s = this._listeners;
    for (let i = 0; i < s.length; i++)
      s[i](n, this._elapsed);
  };
}
const $n = {
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
  bounceIn: (o) => 1 - $n.bounceOut(1 - o),
  bounceOut: (o) => o < 1 / 2.75 ? 7.5625 * o * o : o < 2 / 2.75 ? 7.5625 * (o -= 1.5 / 2.75) * o + 0.75 : o < 2.5 / 2.75 ? 7.5625 * (o -= 2.25 / 2.75) * o + 0.9375 : 7.5625 * (o -= 2.625 / 2.75) * o + 0.984375,
  bounceInOut: (o) => o < 0.5 ? $n.bounceIn(o * 2) * 0.5 : $n.bounceOut(o * 2 - 1) * 0.5 + 0.5
};
function _0(o, e, n, s) {
  const i = 3 * o, r = 3 * (n - o) - i, c = 1 - i - r, a = 3 * e, h = 3 * (s - e) - a, l = 1 - a - h, u = (y) => ((c * y + r) * y + i) * y, f = (y) => ((l * y + h) * y + a) * y, d = (y) => (3 * c * y + 2 * r) * y + i, x = (y, g = 1e-6) => {
    let w, M = 0, E = 1;
    for (let I = 0; I < 8; I++) {
      w = (M + E) / 2;
      const N = u(w);
      if (Math.abs(N - y) < g) return w;
      y > N ? M = w : E = w;
    }
    w = (M + E) / 2;
    for (let I = 0; I < 4; I++) {
      const N = d(w);
      if (Math.abs(N) < 1e-8) break;
      w -= (u(w) - y) / N, w = Math.max(0, Math.min(1, w));
    }
    return w;
  };
  return (y) => y <= 0 ? 0 : y >= 1 ? 1 : f(x(y));
}
function pa(o) {
  return typeof o == "function" ? o : typeof o == "string" ? $n[o] ?? $n.linear : Array.isArray(o) && o.length === 4 ? _0(o[0], o[1], o[2], o[3]) : $n.linear;
}
function T0(o, e) {
  if (o.length === 0) return [];
  const n = [...o].sort((i, r) => i.time - r.time);
  return n[0].time > 0 && n.unshift({ time: 0, value: n[0].value, easing: n[0].easing }), n.map((i) => ({
    time: i.time,
    percent: e > 0 ? Math.min(i.time / e, 1) : 0,
    value: i.value,
    easingFunc: pa(i.easing ?? "linear")
  }));
}
function ic(o, e) {
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
  const r = o[s], c = o[i], a = c.percent - r.percent, h = a > 0 ? (e - r.percent) / a : 0, l = c.easingFunc(Math.min(Math.max(h, 0), 1));
  return [r, c, l];
}
function Fs(o, e, n) {
  return o + (e - o) * n;
}
function Y1(o, e, n) {
  const s = {};
  for (const i in o)
    Object.prototype.hasOwnProperty.call(o, i) && (s[i] = Fs(o[i], e[i] ?? o[i], n));
  return s;
}
function P0(o, e, n, s = []) {
  const i = Math.max(o.length, e.length);
  for (let r = 0; r < i; r++)
    s[r] = Fs(o[r] ?? 0, e[r] ?? 0, n);
  return s;
}
function E0(o, e, n, s = []) {
  const i = Math.max(o.length, e.length);
  for (let r = 0; r < i; r++) {
    s[r] || (s[r] = []);
    const c = o[r] ?? [], a = e[r] ?? [], h = Math.max(c.length, a.length);
    for (let l = 0; l < h; l++)
      s[r][l] = Fs(c[l] ?? 0, a[l] ?? 0, n);
  }
  return s;
}
function V1(o, e, n, s = []) {
  for (let i = 0; i < 4; i++)
    s[i] = Fs(o[i] ?? 0, e[i] ?? 0, n);
  return s;
}
function rc(o) {
  return typeof o == "number" && !isNaN(o);
}
function oc(o) {
  return Array.isArray(o) && o.length > 0 && typeof o[0] == "number";
}
function cc(o) {
  return Array.isArray(o) && o.length > 0 && Array.isArray(o[0]) && typeof o[0][0] == "number";
}
function ac(o, e, n) {
  return rc(o) && rc(e) ? Fs(o, e, n) : oc(o) && oc(e) ? P0(o, e, n) : cc(o) && cc(e) ? E0(o, e, n) : n < 1 ? o : e;
}
class L0 {
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
      n[0].time > 0 && n.unshift({ time: 0, value: this._startValue }), this._keyframes = T0(
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
    const [s, i, r] = ic(n, e), c = ac(s.value, i.value, r);
    this.target[this.property] = c;
  }
  /** 获取指定进度的值（不写入 target） */
  getValueAt(e) {
    const n = this._keyframes;
    if (n.length === 0) return this._startValue;
    const [s, i, r] = ic(n, e);
    return ac(s.value, i.value, r);
  }
  /** 重置到初始值 */
  reset() {
    this.target[this.property] = this._startValue;
  }
}
var A0 = /* @__PURE__ */ ((o) => (o[o.Forward = 1] = "Forward", o[o.Backward = -1] = "Backward", o))(A0 || {}), Oe = /* @__PURE__ */ ((o) => (o.Idle = "idle", o.Playing = "playing", o.Paused = "paused", o.Completed = "completed", o))(Oe || {});
class ma {
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
    this.target = e.target, this._duration = e.duration ?? 1e3, this._delay = e.delay ?? 0, e.loop ? this._repeat = -1 : this._repeat = e.repeat ?? 0, this._yoyo = e.yoyo ?? !1, this._easingFunc = pa(e.easing ?? "linear"), this.onStart = e.onStart, this.onUpdate = e.onUpdate, this.onRepeat = e.onRepeat, this.onComplete = e.onComplete;
    for (const n of e.tracks)
      this._tracks.push(new L0({
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
    return this._state === "playing" ? this : (this._state === "completed" && this._reset(), this._state = "playing", this._direction = 1, this._startTime = zt.shared.elapsed, this._pausedElapsed = 0, zt.shared.add(this._tick), this.onStart?.(), this);
  }
  /** 暂停 */
  pause() {
    return this._state !== "playing" ? this : (this._state = "paused", this._pauseTime = zt.shared.elapsed, zt.shared.remove(this._tick), this);
  }
  /** 恢复 */
  resume() {
    return this._state !== "paused" ? this : (this._state = "playing", this._pausedElapsed += zt.shared.elapsed - this._pauseTime, zt.shared.add(this._tick), this);
  }
  /** 停止并重置 */
  stop() {
    return zt.shared.remove(this._tick), this._reset(), this._state = "idle", this;
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
      const l = Math.floor(c);
      c -= l, this._repeat < 0 ? (this.onRepeat?.(), this._repeatCount++) : (this._repeatCount += l, this._repeatCount > this._repeat && (c = 1));
    }
    let a = c;
    this._yoyo && (Math.floor(i / r) % 2 === 1 ? (this._direction = -1, a = 1 - c) : this._direction = 1);
    const h = this._easingFunc(Math.min(a, 1));
    this._applyProgress(h), a >= 1 && this._repeat >= 0 && this._repeatCount >= this._repeat && this._finish();
  };
  _applyProgress(e) {
    this._progress = e;
    for (const n of this._tracks)
      n.tick(e);
    this.onUpdate?.(e);
  }
  _finish() {
    this._state = "completed", zt.shared.remove(this._tick), this.onComplete?.();
  }
}
class S0 {
  _children = [];
  _labels = /* @__PURE__ */ new Map();
  _defaults;
  _repeat;
  _yoyo;
  _repeatCount = 0;
  _state = Oe.Idle;
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
    }, i = new ma(s);
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
    return this._state === Oe.Playing ? this : (this._state = Oe.Playing, this._startTime = zt.shared.elapsed, this._pausedElapsed = 0, this._repeatCount = 0, zt.shared.add(this._tick), this.onStart?.(), this);
  }
  pause() {
    return this._state !== Oe.Playing ? this : (this._state = Oe.Paused, this._pauseTime = zt.shared.elapsed, zt.shared.remove(this._tick), this);
  }
  resume() {
    return this._state !== Oe.Paused ? this : (this._state = Oe.Playing, this._pausedElapsed += zt.shared.elapsed - this._pauseTime, zt.shared.add(this._tick), this);
  }
  stop() {
    zt.shared.remove(this._tick);
    for (const e of this._children)
      e.animation.stop();
    return this._state = Oe.Idle, this;
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
    if (this._state !== Oe.Playing) return;
    const s = n - this._startTime - this._pausedElapsed, i = this.duration;
    if (i <= 0) return;
    let r = s / i;
    this._repeat < 0 ? r = r % 1 : r > 1 && (this._repeatCount = Math.floor(r), this._repeatCount > this._repeat ? r = 1 : r -= this._repeatCount), this._yoyo && Math.floor(s / i) % 2 === 1 && (r = 1 - r);
    const c = Math.min(r, 1) * i;
    this._seekTime(c), this.onUpdate?.(Math.min(r, 1)), r >= 1 && this._repeat >= 0 && this._repeatCount >= this._repeat && (this._state = Oe.Completed, zt.shared.remove(this._tick), this.onComplete?.());
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
class U1 {
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
    const n = new ma(e);
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
    const n = new S0(e), s = n.play.bind(n);
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
    this._enabled = !0, zt.shared.start();
  }
  _stop() {
    this._enabled = !1;
  }
}
function I0(o, e) {
  return Array.isArray(e) ? e.includes(o) : e === o;
}
function Xe(o, e, n) {
  return o.context ? o.callback(n, ...e) : o.callback(...e);
}
class q0 {
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
class We {
  taps;
  interceptions;
  constructor() {
    this.taps = [], this.interceptions = new q0();
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
        const h = this.taps[c - 1];
        if (a.has(h.name) && a.delete(h.name), h.before && I0(r.name, h.before))
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
class X1 extends We {
  call(...e) {
    if (!this.isUsed())
      return;
    const n = {};
    this.interceptions.call(n, ...e);
    try {
      this.taps.forEach((s) => {
        Xe(s, e, n);
      });
    } catch (s) {
      throw this.interceptions.error(s), s;
    }
    this.interceptions.done();
  }
}
class W1 extends We {
  call(...e) {
    if (!this.isUsed())
      return;
    const n = {};
    this.interceptions.call(n, ...e);
    for (let s = 0; s < this.taps.length; s += 1) {
      const i = Xe(this.taps[s], e, n);
      if (i !== void 0)
        return this.interceptions.result(i), i;
    }
    this.interceptions.done();
  }
}
class $1 extends We {
  call(...e) {
    const n = {};
    this.interceptions.call(n, ...e);
    let [s, ...i] = e;
    for (let r = 0; r < this.taps.length; r += 1) {
      const c = Xe(this.taps[r], [s, ...i], n);
      c !== void 0 && (s = c);
    }
    return this.interceptions.result(s), s;
  }
}
class j1 extends We {
  call(...e) {
    let n = !1;
    const s = {};
    this.interceptions.call(s, ...e);
    try {
      for (; n !== !0; ) {
        n = !0, this.interceptions.loop(...e);
        for (let i = 0; i < this.taps.length; i += 1)
          if (Xe(this.taps[i], e, s) !== void 0) {
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
class G1 extends We {
  async call(...e) {
    const n = {};
    this.interceptions.call(n, ...e), await Promise.allSettled(this.taps.map((s) => Xe(s, e, n))), this.interceptions.done();
  }
}
class Z1 extends We {
  async call(...e) {
    const n = {};
    this.interceptions.call(n, ...e);
    try {
      const s = await Promise.race(
        this.taps.map((i) => Xe(i, e, n))
      );
      return this.interceptions.result(s), s;
    } catch (s) {
      throw this.interceptions.error(s), s;
    }
  }
}
class J1 extends We {
  async call(...e) {
    const n = {};
    this.interceptions.call(n, ...e);
    try {
      for (let s = 0; s < this.taps.length; s += 1)
        await Xe(this.taps[s], e, n);
    } catch (s) {
      throw this.interceptions.error(s), s;
    }
    this.interceptions.done();
  }
}
class Q1 extends We {
  async call(...e) {
    const n = {};
    this.interceptions.call(n, ...e);
    try {
      for (let s = 0; s < this.taps.length; s += 1) {
        const i = await Xe(this.taps[s], e, n);
        if (i !== void 0)
          return this.interceptions.result(i), i;
      }
    } catch (s) {
      throw this.interceptions.error(s), s;
    }
    this.interceptions.done();
  }
}
class K1 extends We {
  async call(...e) {
    let [n, ...s] = e;
    const i = {};
    this.interceptions.call(i, ...e);
    try {
      for (let r = 0; r < this.taps.length; r += 1) {
        const c = await Xe(
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
class td extends We {
  async call(...e) {
    let n = !1;
    const s = {};
    this.interceptions.call(s, ...e);
    try {
      for (; n !== !0; ) {
        n = !0, this.interceptions.loop(...e);
        for (let i = 0; i < this.taps.length; i += 1)
          if (await Xe(this.taps[i], e, s) !== void 0) {
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
const D0 = Object.prototype.hasOwnProperty;
function O0(o, e) {
  return D0.call(o, e);
}
function k0(o) {
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
    O0(o, n) && e.push(n);
  return e;
}
function Ln(o) {
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
function Ir(o) {
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
function R0(o) {
  return o.replace(/~1/g, "/").replace(/~0/g, "~");
}
function qr(o) {
  if (o === void 0)
    return !0;
  if (o) {
    if (Array.isArray(o)) {
      for (let n = 0, s = o.length; n < s; n++)
        if (qr(o[n]))
          return !0;
    } else if (typeof o == "object") {
      const n = k0(o), s = n.length;
      for (var e = 0; e < s; e++)
        if (qr(o[n[e]]))
          return !0;
    }
  }
  return !1;
}
function hc(o, e) {
  const n = [o];
  for (const s in e) {
    const i = typeof e[s] == "object" ? JSON.stringify(e[s], null, 2) : e[s];
    typeof i < "u" && n.push(`${s}: ${i}`);
  }
  return n.join(`
`);
}
class z0 extends Error {
  constructor(e, n, s, i, r) {
    super(hc(e, { name: n, index: s, operation: i, tree: r })), this.name = n, this.index = s, this.operation = i, this.tree = r, Object.setPrototypeOf(this, new.target.prototype), this.message = hc(e, { name: n, index: s, operation: i, tree: r });
  }
}
const Bt = z0, N0 = Ln, Fn = {
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
    let s = Ei(n, this.path);
    s && (s = Ln(s));
    const i = bn(
      n,
      { op: "remove", path: this.from }
    ).removed;
    return bn(n, { op: "add", path: this.path, value: i }), { newDocument: n, removed: s };
  },
  copy: function(o, e, n) {
    const s = Ei(n, this.from);
    return bn(
      n,
      { op: "add", path: this.path, value: Ln(s) }
    ), { newDocument: n };
  },
  test: function(o, e, n) {
    return { newDocument: n, test: ks(o[e], this.value) };
  },
  _get: function(o, e, n) {
    return this.value = o[e], { newDocument: n };
  }
};
var C0 = {
  add: function(o, e, n) {
    return Ir(e) ? o.splice(e, 0, this.value) : o[e] = this.value, { newDocument: n, index: e };
  },
  remove: function(o, e, n) {
    var s = o.splice(e, 1);
    return { newDocument: n, removed: s[0] };
  },
  replace: function(o, e, n) {
    var s = o[e];
    return o[e] = this.value, { newDocument: n, removed: s };
  },
  move: Fn.move,
  copy: Fn.copy,
  test: Fn.test,
  _get: Fn._get
};
function Ei(o, e) {
  if (e == "")
    return o;
  var n = { op: "_get", path: e };
  return bn(o, n), n.value;
}
function bn(o, e, n = !1, s = !0, i = !0, r = 0) {
  if (n && (typeof n == "function" ? n(e, 0, o, e.path) : Li(e, 0)), e.path === "") {
    let c = { newDocument: o };
    if (e.op === "add")
      return c.newDocument = e.value, c;
    if (e.op === "replace")
      return c.newDocument = e.value, c.removed = o, c;
    if (e.op === "move" || e.op === "copy")
      return c.newDocument = Ei(o, e.from), e.op === "move" && (c.removed = o), c;
    if (e.op === "test") {
      if (c.test = ks(o, e.value), c.test === !1)
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
    s || (o = Ln(o));
    const a = (e.path || "").split("/");
    let h = o, l = 1, u = a.length, f, d, x;
    for (typeof n == "function" ? x = n : x = Li; ; ) {
      if (d = a[l], d && d.indexOf("~") != -1 && (d = R0(d)), i && (d == "__proto__" || d == "prototype" && l > 0 && a[l - 1] == "constructor"))
        throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");
      if (n && f === void 0 && (h[d] === void 0 ? f = a.slice(0, l).join("/") : l == u - 1 && (f = e.path), f !== void 0 && x(e, 0, o, f)), l++, Array.isArray(h)) {
        if (d === "-")
          d = h.length;
        else {
          if (n && !Ir(d))
            throw new Bt("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", r, e, o);
          Ir(d) && (d = ~~d);
        }
        if (l >= u) {
          if (n && e.op === "add" && d > h.length)
            throw new Bt("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", r, e, o);
          const y = C0[e.op].call(e, h, d, o);
          if (y.test === !1)
            throw new Bt("Test operation failed", "TEST_OPERATION_FAILED", r, e, o);
          return y;
        }
      } else if (l >= u) {
        const y = Fn[e.op].call(e, h, d, o);
        if (y.test === !1)
          throw new Bt("Test operation failed", "TEST_OPERATION_FAILED", r, e, o);
        return y;
      }
      if (h = h[d], n && l < u && (!h || typeof h != "object"))
        throw new Bt("Cannot perform operation at the desired path", "OPERATION_PATH_UNRESOLVABLE", r, e, o);
    }
  }
}
function ga(o, e, n, s = !0, i = !0) {
  if (n && !Array.isArray(e))
    throw new Bt("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
  s || (o = Ln(o));
  const r = new Array(e.length);
  for (let c = 0, a = e.length; c < a; c++)
    r[c] = bn(o, e[c], n, !0, i, c), o = r[c].newDocument;
  return r.newDocument = o, r;
}
function F0(o, e, n) {
  const s = bn(o, e);
  if (s.test === !1)
    throw new Bt("Test operation failed", "TEST_OPERATION_FAILED", n, e, o);
  return s.newDocument;
}
function Li(o, e, n, s) {
  if (typeof o != "object" || o === null || Array.isArray(o))
    throw new Bt("Operation is not an object", "OPERATION_NOT_AN_OBJECT", e, o, n);
  if (Fn[o.op]) {
    if (typeof o.path != "string")
      throw new Bt("Operation `path` property is not a string", "OPERATION_PATH_INVALID", e, o, n);
    if (o.path.indexOf("/") !== 0 && o.path.length > 0)
      throw new Bt('Operation `path` property must start with "/"', "OPERATION_PATH_INVALID", e, o, n);
    if ((o.op === "move" || o.op === "copy") && typeof o.from != "string")
      throw new Bt("Operation `from` property is not present (applicable in `move` and `copy` operations)", "OPERATION_FROM_REQUIRED", e, o, n);
    if ((o.op === "add" || o.op === "replace" || o.op === "test") && o.value === void 0)
      throw new Bt("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_REQUIRED", e, o, n);
    if ((o.op === "add" || o.op === "replace" || o.op === "test") && qr(o.value))
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
        var c = { op: "_get", path: o.from, value: void 0 }, a = wa([c], n);
        if (a && a.name === "OPERATION_PATH_UNRESOLVABLE")
          throw new Bt("Cannot perform the operation from a path that does not exist", "OPERATION_FROM_UNRESOLVABLE", e, o, n);
      }
    }
  } else throw new Bt("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", e, o, n);
}
function wa(o, e, n) {
  try {
    if (!Array.isArray(o))
      throw new Bt("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
    if (e)
      ga(Ln(e), Ln(o), n || !0);
    else {
      n = n || Li;
      for (var s = 0; s < o.length; s++)
        n(o[s], s, e, void 0);
    }
  } catch (i) {
    if (i instanceof Bt)
      return i;
    throw i;
  }
}
function ks(o, e) {
  if (o === e) return !0;
  if (o && e && typeof o == "object" && typeof e == "object") {
    var n = Array.isArray(o), s = Array.isArray(e), i, r, c;
    if (n && s) {
      if (r = o.length, r != e.length) return !1;
      for (i = r; i-- !== 0; )
        if (!ks(o[i], e[i])) return !1;
      return !0;
    }
    if (n != s) return !1;
    var a = Object.keys(o);
    if (r = a.length, r !== Object.keys(e).length)
      return !1;
    for (i = r; i-- !== 0; )
      if (!e.hasOwnProperty(a[i])) return !1;
    for (i = r; i-- !== 0; )
      if (c = a[i], !ks(o[c], e[c])) return !1;
    return !0;
  }
  return o !== o && e !== e;
}
const ed = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JsonPatchError: Bt,
  _areEquals: ks,
  applyOperation: bn,
  applyPatch: ga,
  applyReducer: F0,
  deepClone: N0,
  getValueByPointer: Ei,
  validate: wa,
  validator: Li
}, Symbol.toStringTag, { value: "Module" }));
class nd {
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
class va {
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
    return new va(this.ctx, this.options).copy(this);
  }
}
const H0 = (o) => {
  vn && vn.add(o);
};
let vn = null;
class sd {
  static add = H0;
  static mixin(e, n = {}) {
    const s = e.prototype.dispose;
    e.prototype.isDisposed = !1, e.prototype.dispose = function() {
      this.isDisposed || (this.isDisposed = !0, n.dispose?.(this), s?.call(e));
    }, e.prototype.disposeLater = function() {
      vn && !this.__isDisposed && vn.add(this);
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
    let n = vn;
    try {
      return vn = this, e();
    } finally {
      this.dispose(), vn = n;
    }
  }
}
class id {
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
function Dr(o, e) {
  let n = o.length;
  o.push(e);
  t: for (; 0 < n; ) {
    let s = n - 1 >>> 1, i = o[s];
    if (0 < mi(i, e))
      o[s] = e, o[n] = i, n = s;
    else break t;
  }
}
function Ue(o) {
  return o.length === 0 ? null : o[0];
}
function Ai(o) {
  if (o.length === 0)
    return null;
  let e = o[0], n = o.pop();
  if (n !== e) {
    o[0] = n;
    t: for (let s = 0, i = o.length, r = i >>> 1; s < r; ) {
      let c = 2 * (s + 1) - 1, a = o[c], h = c + 1, l = o[h];
      if (0 > mi(a, n))
        h < i && 0 > mi(l, a) ? (o[s] = l, o[h] = n, s = h) : (o[s] = a, o[c] = n, s = c);
      else if (h < i && 0 > mi(l, n))
        o[s] = l, o[h] = n, s = h;
      else
        break t;
    }
  }
  return e;
}
function mi(o, e) {
  const n = o.sortIndex - e.sortIndex;
  return n !== 0 ? n : o.id - e.id;
}
const rd = 0, Xr = 1, Wr = 2, Zn = 3, Ma = 4, ba = 5, B0 = !1, _a = 5, Y0 = 250, V0 = 5e3, U0 = 1e4, od = !0, cd = !0;
let An;
const X0 = (
  // $FlowFixMe[method-unbinding]
  typeof performance == "object" && typeof performance.now == "function"
);
if (X0) {
  const o = performance;
  An = () => o.now();
} else {
  const o = Date, e = o.now();
  An = () => o.now() - e;
}
let W0 = 1073741823, Ze = [], un = [], $0 = 1, _e = null, fe = Zn, Or = !1, Rs = !1, zs = !1;
const Ta = typeof setTimeout == "function" ? setTimeout : null, j0 = typeof clearTimeout == "function" ? clearTimeout : null, lc = typeof globalThis.setImmediate < "u" ? globalThis.setImmediate : null;
function gi(o) {
  let e = Ue(un);
  for (; e !== null; ) {
    if (e.callback === null)
      Ai(un);
    else if (e.startTime <= o)
      Ai(un), e.sortIndex = e.expirationTime, Dr(Ze, e);
    else
      return;
    e = Ue(un);
  }
}
function $r(o) {
  if (zs = !1, gi(o), !Rs)
    if (Ue(Ze) !== null)
      Rs = !0, Ea();
    else {
      const e = Ue(un);
      e !== null && jr($r, e.startTime - o);
    }
}
function G0(o) {
  Rs = !1, zs && (zs = !1, La()), Or = !0;
  const e = fe;
  try {
    if (!B0) return Z0(o);
  } finally {
    _e = null, fe = e, Or = !1;
  }
}
function Z0(o) {
  let e = o;
  for (gi(e), _e = Ue(Ze); _e !== null; ) {
    const n = _e.callback;
    if (typeof n == "function") {
      _e.callback = null, fe = _e.priorityLevel;
      const s = _e.expirationTime <= e, i = n(s);
      if (e = An(), typeof i == "function")
        return _e.callback = i, gi(e), !0;
      _e === Ue(Ze) && Ai(Ze), gi(e);
    } else
      Ai(Ze);
    if (_e = Ue(Ze), _e === null || _e.expirationTime > e)
      break;
  }
  if (_e !== null)
    return !0;
  {
    const n = Ue(un);
    return n !== null && jr($r, n.startTime - e), !1;
  }
}
function ad(o, e) {
  switch (o) {
    case Xr:
    case Wr:
    case Zn:
    case Ma:
    case ba:
      break;
    default:
      o = Zn;
  }
  let n = fe;
  fe = o;
  try {
    return e();
  } finally {
    fe = n;
  }
}
function hd(o) {
  let e;
  switch (fe) {
    case Xr:
    case Wr:
    case Zn:
      e = Zn;
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
function ld(o) {
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
function ud(o, e, n) {
  let s = An(), i;
  if (typeof n == "object" && n !== null) {
    let h = n.delay;
    typeof h == "number" && h > 0 ? i = s + h : i = s;
  } else
    i = s;
  let r;
  switch (o) {
    case Xr:
      r = -1;
      break;
    case Wr:
      r = Y0;
      break;
    case ba:
      r = W0;
      break;
    case Ma:
      r = U0;
      break;
    case Zn:
    default:
      r = V0;
      break;
  }
  let c = i + r, a = {
    id: $0++,
    callback: e,
    priorityLevel: o,
    startTime: i,
    expirationTime: c,
    sortIndex: -1
  };
  return i > s ? (a.sortIndex = i, Dr(un, a), Ue(Ze) === null && a === Ue(un) && (zs ? La() : zs = !0, jr($r, i - s))) : (a.sortIndex = c, Dr(Ze, a), !Rs && !Or && (Rs = !0, Ea())), a;
}
function fd(o) {
  o.callback = null;
}
function dd() {
  return fe;
}
let Si = !1, kr = -1, Rr = _a, Pa = -1;
function xd() {
  return !(An() - Pa < Rr);
}
function yd() {
}
function pd(o) {
  if (o < 0 || o > 125) {
    console.error(
      "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
    );
    return;
  }
  o > 0 ? Rr = Math.floor(1e3 / o) : Rr = _a;
}
const sr = () => {
  if (Si) {
    const o = An();
    Pa = o;
    let e = !0;
    try {
      e = G0(o);
    } finally {
      e ? ws() : Si = !1;
    }
  }
};
let ws;
if (typeof lc == "function")
  ws = () => {
    lc(sr);
  };
else if (typeof MessageChannel < "u") {
  const o = new MessageChannel(), e = o.port2;
  o.port1.onmessage = sr, ws = () => {
    e.postMessage(null);
  };
} else
  ws = () => {
    Ta(sr, 0);
  };
function Ea() {
  Si || (Si = !0, ws());
}
function jr(o, e) {
  kr = Ta(() => {
    o(An());
  }, e);
}
function La() {
  j0(kr), kr = -1;
}
class md {
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
const zr = [];
let ys = -1;
const gd = (o) => ({
  current: o
}), wd = (o, e) => {
  zr[++ys] = o.current, o.current = e;
}, vd = (o) => {
  ys < 0 || (o.current = zr[ys], zr[ys] = null, ys--);
};
var Aa = /* @__PURE__ */ ((o) => (o[o.Butt = 0] = "Butt", o[o.Round = 1] = "Round", o[o.Square = 2] = "Square", o))(Aa || {}), Sa = /* @__PURE__ */ ((o) => (o[o.Miter = 0] = "Miter", o[o.Round = 1] = "Round", o[o.Bevel = 2] = "Bevel", o))(Sa || {});
const J0 = {
  0: "butt",
  1: "round",
  2: "square"
}, Q0 = {
  0: "miter",
  1: "round",
  2: "bevel"
};
function K0(o) {
  return J0[o];
}
function tf(o) {
  return Q0[o];
}
function ef(o, e) {
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
    n.addColorStop(s.offset, _t.toCSS_RGBA(s.color));
  return n;
}
function uc(o, e, n) {
  if (!n)
    return _t.toCSS_RGBA(e);
  if (n.type === "pattern") {
    const s = n;
    return o.createPattern(s.source, s.repeat ?? "repeat");
  }
  return n.type === "gradient" ? ef(o, n) : _t.toCSS_RGBA(e);
}
function nf(o, e, n = 0) {
  e ? (o.setLineDash(e), o.lineDashOffset = n) : o.setLineDash([]);
}
var sf = /* @__PURE__ */ ((o) => (o[o.Fill = 0] = "Fill", o[o.Stroke = 1] = "Stroke", o[o.FillAndStroke = 2] = "FillAndStroke", o))(sf || {}), rf = /* @__PURE__ */ ((o) => (o.SourceOver = "source-over", o.SourceIn = "source-in", o.SourceOut = "source-out", o.SourceAtop = "source-atop", o.DestinationOver = "destination-over", o.DestinationIn = "destination-in", o.DestinationOut = "destination-out", o.DestinationAtop = "destination-atop", o.Lighter = "lighter", o.Copy = "copy", o.Xor = "xor", o.Multiply = "multiply", o.Screen = "screen", o.Overlay = "overlay", o.Darken = "darken", o.Lighten = "lighten", o.ColorDodge = "color-dodge", o.ColorBurn = "color-burn", o.HardLight = "hard-light", o.SoftLight = "soft-light", o.Difference = "difference", o.Exclusion = "exclusion", o.Hue = "hue", o.Saturation = "saturation", o.Color = "color", o.Luminosity = "luminosity", o))(rf || {});
class Ia {
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
    this.color = new _t(0, 0, 0, 1), this.style = 0, this.strokeWidth = 1, this.strokeCap = Aa.Butt, this.strokeJoin = Sa.Miter, this.strokeMiter = 10, this.alpha = 1, this.antiAlias = !0, this.blendMode = "source-over", this.shader = null, this.dashIntervals = null, this.dashOffset = 0;
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
    e.globalAlpha = this.alpha, e.globalCompositeOperation = this.blendMode, e.fillStyle = this.shader ? this.shader.toCanvasStyle(e, this.color) : uc(e, this.color);
  }
  /**
   * 将 Paint 的描边属性应用到 Canvas 2D 上下文。
   */
  applyStrokeTo(e) {
    e.globalAlpha = this.alpha, e.globalCompositeOperation = this.blendMode, e.lineWidth = this.strokeWidth, e.lineCap = K0(this.strokeCap), e.lineJoin = tf(this.strokeJoin), e.miterLimit = this.strokeMiter, e.strokeStyle = this.shader ? this.shader.toCanvasStyle(e, this.color) : uc(e, this.color), nf(e, this.dashIntervals, this.dashOffset);
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
    const e = new Ia();
    return this.copy(e), e;
  }
}
var of = /* @__PURE__ */ ((o) => (o.Clamp = "clamp", o.Repeat = "repeat", o.Mirror = "mirror", o.Decal = "decal", o))(of || {}), cf = /* @__PURE__ */ ((o) => (o[o.Color = 0] = "Color", o[o.LinearGradient = 1] = "LinearGradient", o[o.RadialGradient = 2] = "RadialGradient", o[o.SweepGradient = 3] = "SweepGradient", o[o.Image = 4] = "Image", o))(cf || {});
class je {
  // ---- 实例 ----
  constructor(e, n = null) {
    this._data = e, this._localMatrix = n;
  }
  // ---- 静态工厂 ----
  /** 纯色着色器 */
  static makeColor(e) {
    return new je({
      kind: 0,
      color: [e[0], e[1], e[2], e[3] ?? 1]
    });
  }
  /** 线性渐变着色器 */
  static makeLinearGradient(e, n, s, i, r) {
    return new je({
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
    return new je({
      kind: 2,
      centerX: e,
      centerY: n,
      radius: s,
      stops: i.slice()
    });
  }
  /** 扫描渐变（锥形渐变）着色器 */
  static makeSweepGradient(e, n, s, i) {
    return new je({
      kind: 3,
      centerX: e,
      centerY: n,
      startAngle: s,
      stops: i.slice()
    });
  }
  /** 图片着色器 */
  static makeImage(e, n = "clamp", s = "clamp") {
    return new je({
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
    this._localMatrix || (this._localMatrix = Rt.identity()), this._localMatrix.fromArray(e);
  }
  /**
   * 返回一个新的 shader，将给定矩阵作为其本地变换。
   * 本地矩阵在 shader 生成的坐标空间中生效。
   */
  withLocalMatrix(e) {
    const n = this._localMatrix ? this._localMatrix.clone().multiply(e) : Rt.fromArray(e);
    return new je(this._data, n);
  }
  /**
   * 返回一个新的 shader，重置本地矩阵为单位矩阵。
   */
  resetLocalMatrix() {
    return this._localMatrix ? new je(this._data, null) : this;
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
        i = _t.toCSS_RGBA(this._data.color);
        break;
      }
      case 1: {
        const r = this._data, c = e.createLinearGradient(r.startX, r.startY, r.endX, r.endY);
        for (const a of r.stops)
          c.addColorStop(a.offset, _t.toCSS_RGBA(a.color));
        i = c;
        break;
      }
      case 2: {
        const r = this._data, c = e.createRadialGradient(r.centerX, r.centerY, 0, r.centerX, r.centerY, r.radius);
        for (const a of r.stops)
          c.addColorStop(a.offset, _t.toCSS_RGBA(a.color));
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
        for (const h of r.stops)
          a.addColorStop(h.offset, _t.toCSS_RGBA(h.color));
        i = a;
        break;
      }
      case 4: {
        const r = this._data, c = af(r.tileModeX, r.tileModeY), a = e.createPattern(r.image, c);
        a ? i = a : i = _t.toCSS_RGBA(n);
        break;
      }
      default:
        i = _t.toCSS_RGBA(n);
    }
    return s && e.restore(), i;
  }
  // ---- 复制 ----
  /** 深拷贝 */
  clone() {
    return new je(this._cloneData(), this._localMatrix?.clone() ?? null);
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
function af(o, e) {
  const n = o === "repeat" || o === "mirror", s = e === "repeat" || e === "mirror";
  return n && s ? "repeat" : n && !s ? "repeat-x" : !n && s ? "repeat-y" : "no-repeat";
}
export {
  ma as Animation,
  A0 as AnimationDirection,
  Oe as AnimationState,
  U1 as AnimationSystem,
  L0 as AnimationTrack,
  D1 as Arc,
  Z1 as AsyncParallelBailHook,
  G1 as AsyncParallelHook,
  Q1 as AsyncSeriesBailHook,
  J1 as AsyncSeriesHook,
  td as AsyncSeriesLoopHook,
  K1 as AsyncSeriesWaterfallHook,
  Nf as BSpline,
  O1 as Bezier,
  rf as BlendMode,
  vh as BoolOp,
  St as BoundingRect,
  Sn as CachePool,
  id as Callbacks,
  Cf as CatmullRom,
  I1 as Circle,
  zh as Cmd,
  _t as Color,
  nh as ColorIndex,
  ds as Conic,
  fi as ConicSection,
  Xa as ConicType,
  Ms as CubicBezier,
  Oa as DEG_TO_RAD,
  sd as DisposableManager,
  Ns as EPSILON,
  $n as Easing,
  q1 as Ellipse,
  Uh as Entry,
  Mu as EventEmitter,
  z1 as EventSystem,
  R1 as EventTarget,
  en as Geometry,
  rr as Hermite,
  ba as IdlePriority,
  Xr as ImmediatePriority,
  Zf as Lagrange,
  L1 as Line,
  Ah as LineCap,
  Lh as LineJoin,
  i1 as LinkedList,
  Ma as LowPriority,
  Rt as Matrix2D,
  hh as MatrixIndex,
  Jf as NURBS,
  rd as NoPriority,
  dn as NodeEvent,
  Zn as NormalPriority,
  va as Option,
  qe as OrientedBoundingRect,
  Cs as PI,
  ff as PI_2,
  df as PI_4,
  Ia as Paint,
  je as PaintShader,
  sf as PaintStyle,
  Qe as PathBuilder,
  mh as PathCmd,
  Ft as PathCommand,
  Ac as PathCommandData,
  Eh as PathCommandType,
  gh as PathDirection,
  $s as PathSegmentType,
  t1 as PathStroke,
  yh as PathVerb,
  ph as PathVerbCount,
  B1 as PluginService,
  rt as Point,
  Os as PointerEvent,
  N1 as PointerEventSystem,
  da as Polygon,
  md as PriorityQueue,
  qc as ProxyPath2D,
  bs as QuadraticBezier,
  ka as RAD_TO_DEG,
  e1 as RTree,
  A1 as Rect,
  k1 as RoundRect,
  cf as ShaderKind,
  nd as StateMachine,
  Aa as StrokeCap,
  Sa as StrokeJoin,
  W1 as SyncBailHook,
  X1 as SyncHook,
  j1 as SyncLoopHook,
  $1 as SyncWaterfallHook,
  xf as TWO_PI,
  zt as Ticker,
  of as TileMode,
  S0 as Timeline,
  n1 as Transform,
  S1 as Triangle,
  Wr as UserBlockingPriority,
  lt as Vector2,
  s1 as Viewport,
  H0 as addDisposable,
  E1 as angleDelta,
  nf as applyCanvasDash,
  Df as arcLength,
  Da as arcToCubic,
  lf as arcToOval,
  Ii as bernstein,
  C1 as bezier,
  T0 as buildKeyframes,
  hf as centerToEndpoint,
  tn as clamp,
  w1 as clipper,
  _0 as createCubicBezierEasing,
  gd as createCursor,
  Fe as cubicAt,
  r1 as cubicDerivativeAt,
  If as cubicEvaluate,
  c1 as cubicExtrema,
  l1 as cubicLength,
  h1 as cubicProjectPoint,
  o1 as cubicRootAt,
  a1 as cubicSubdivide,
  Di as curvature,
  vs as deCasteljau,
  yf as degToRad,
  Nr as derivative,
  Af as derivative1,
  fc as derivativeControlPoints,
  Na as derivativeN,
  _1 as distPointToSegment,
  Wn as distPointToSegmentSquared,
  b1 as earcut,
  uf as ellipseToCubics,
  cd as enableAlwaysYieldScheduler,
  B0 as enableProfiling,
  od as enableRequestPaint,
  qa as endpointToCenter,
  I0 as equalToOrIn,
  gf as equals,
  mf as equalsEpsilon,
  za as evaluate,
  Lf as evaluateValues,
  kf as extrema,
  Tf as factorial,
  ed as fastJsonPatch,
  ic as findKeyframeInterval,
  mc as findSpan,
  _a as frameYieldMs,
  so as fromSvgPath,
  wh as fromSvgPathToCmds,
  uh as generateClampedKnots,
  Ca as getBSplineBasis,
  Fa as getBSplineBasisDerivative,
  eo as getBSplineBasisValue,
  lh as getBSplineBasisValues,
  Ha as getBSplineDerivative,
  on as getBSplineEvaluate,
  Ba as getBSplineSegmentBounds,
  Ua as getCatmullRomBounds,
  Ya as getCatmullRomDerivative,
  kn as getCatmullRomEvaluate,
  Va as getCatmullRomExtremaRoots,
  Wa as getConicType,
  xc as getCubicBezierBounds,
  dc as getCubicBezierEvaluate,
  yc as getCubicBezierExtremaRoots,
  $f as getCubicCoefficients,
  Za as getDistanceToEllipse,
  Ka as getDistanceToParabola,
  Hf as getEllipseArea,
  Ga as getEllipseBounds,
  ja as getEllipseDerivative,
  $a as getEllipseEvaluate,
  Ff as getEllipsePerimeter,
  oh as getHermiteBounds,
  sh as getHermiteDerivative,
  pc as getHermiteEvaluate,
  rh as getHermiteExtremaRoots,
  ih as getHermiteSecondDerivative,
  Vf as getHyperbolaAsymptoteSlope,
  eh as getHyperbolaDerivative,
  Uf as getHyperbolaEccentricity,
  th as getHyperbolaEvaluate,
  Xf as getHyperbolaFoci,
  ch as getLagrangeBasis,
  ah as getLagrangeDerivative,
  or as getLagrangeEvaluate,
  Gf as getLagrangeEvaluateBarycentric,
  fh as getNURBSDerivative,
  cr as getNURBSEvaluate,
  Yf as getParabolaArcLength,
  Qa as getParabolaDerivative,
  Ja as getParabolaEvaluate,
  vc as getQuadraticBezierBounds,
  gc as getQuadraticBezierEvaluate,
  wc as getQuadraticBezierExtremaRoots,
  Qf as getQuadraticCoefficients,
  F1 as glMatrix,
  jf as hermiteToCubicBezier,
  vf as interpolate,
  ac as interpolateValue,
  P1 as isAngleInRange,
  wf as isFinite,
  oc as isNumberArray,
  cc as isNumberArray2D,
  rc as isNumberValue,
  Bf as isPointInEllipse,
  Wf as isPointInHyperbola,
  Fs as lerp,
  P0 as lerpArray,
  E0 as lerpArray2D,
  V1 as lerpColor,
  Y1 as lerpObject,
  U0 as lowPriorityTimeout,
  Rf as maxCurvature,
  _f as mix,
  Ra as nCr,
  Pf as nPr,
  Of as normal,
  V0 as normalPriorityTimeout,
  cn as normalizeAnglePositive,
  ir as normalizeAngles,
  v1 as path2d,
  Kf as pathBooleanOp,
  g1 as polybool,
  vd as pop,
  zf as project,
  wd as push,
  He as quadraticAt,
  u1 as quadraticDerivativeAt,
  Sf as quadraticEvaluate,
  d1 as quadraticExtremum,
  p1 as quadraticLength,
  y1 as quadraticProjectPoint,
  f1 as quadraticRootAt,
  x1 as quadraticSubdivide,
  qf as quadraticToCubic,
  pf as radToDeg,
  Mf as random,
  pa as resolveEasing,
  T1 as signedDistPointToLine,
  bf as smoothStep,
  wi as solveCubicByCardano,
  Ef as solveCubicByShengjin,
  jn as solveQuadratic,
  M1 as tess2,
  ef as toCanvasGradient,
  K0 as toCanvasLineCap,
  tf as toCanvasLineJoin,
  uc as toCanvasStyle,
  ba as unstable_IdlePriority,
  Xr as unstable_ImmediatePriority,
  Ma as unstable_LowPriority,
  Zn as unstable_NormalPriority,
  Wr as unstable_UserBlockingPriority,
  fd as unstable_cancelCallback,
  pd as unstable_forceFrameRate,
  dd as unstable_getCurrentPriorityLevel,
  hd as unstable_next,
  An as unstable_now,
  yd as unstable_requestPaint,
  ad as unstable_runWithPriority,
  ud as unstable_scheduleCallback,
  xd as unstable_shouldYield,
  ld as unstable_wrapCallback,
  Y0 as userBlockingPriorityTimeout,
  H1 as webgpuMatrix,
  dh as windCubicBezier,
  no as windLine,
  xh as windQuadraticBezier
};
