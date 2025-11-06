class xc {
  firefox = !1;
  ie = !1;
  edge = !1;
  newEdge = !1;
  weChat = !1;
  version;
}
class Tc {
  browser = new xc();
  node = !1;
  wxa = !1;
  worker = !1;
  svgSupported = !1;
  touchEventsSupported = !1;
  pointerEventsSupported = !1;
  domSupported = !1;
  transformSupported = !1;
  transform3dSupported = !1;
  hasGlobalWindow = typeof window < "u";
}
const G = new Tc();
typeof wx == "object" && typeof wx.getSystemInfoSync == "function" ? (G.wxa = !0, G.touchEventsSupported = !0) : typeof document > "u" && typeof self < "u" ? G.worker = !0 : !G.hasGlobalWindow || "Deno" in window || typeof navigator < "u" && typeof navigator.userAgent == "string" && navigator.userAgent.indexOf("Node.js") > -1 ? (G.node = !0, G.svgSupported = !0) : bc(navigator.userAgent, G);
function bc(i, t) {
  const e = t.browser, n = i.match(/Firefox\/([\d.]+)/), s = i.match(/MSIE\s([\d.]+)/) || i.match(/Trident\/.+?rv:(([\d.]+))/), r = i.match(/Edge?\/([\d.]+)/), o = /micromessenger/i.test(i);
  if (n && (e.firefox = !0, e.version = n[1]), s && (e.ie = !0, e.version = s[1]), r && (e.edge = !0, e.version = r[1], e.newEdge = +r[1].split(".")[0] > 18), o && (e.weChat = !0), t.svgSupported = typeof SVGRect < "u", t.touchEventsSupported = "ontouchstart" in window && !e.ie && !e.edge, t.pointerEventsSupported = "onpointerdown" in window && (e.edge || e.ie && +e.version >= 11), t.domSupported = typeof document < "u") {
    const a = document.documentElement.style;
    t.transform3dSupported = // IE9 only supports transform 2D
    // transform 3D supported since IE10
    // we detect it by whether 'transition' is in style
    (e.ie && "transition" in a || e.edge || "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix() || "MozPerspective" in a) && !("OTransition" in a), t.transformSupported = t.transform3dSupported || e.ie && +e.version >= 9;
  }
}
const Tr = 12, Nl = "sans-serif", Xt = `${Tr}px ${Nl}`, Sc = 20, vc = 100, Cc = "007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N";
function Pc(i) {
  const t = {};
  if (typeof JSON > "u")
    return t;
  for (let e = 0; e < i.length; e++) {
    const n = String.fromCharCode(e + 32), s = (i.charCodeAt(e) - Sc) / vc;
    t[n] = s;
  }
  return t;
}
const kc = Pc(Cc), Ft = {
  // Export methods
  createCanvas() {
    return typeof document < "u" && document.createElement("canvas");
  },
  measureText: /* @__PURE__ */ function() {
    let i, t;
    return (e, n) => {
      if (!i) {
        const s = Ft.createCanvas();
        i = s && s.getContext("2d");
      }
      if (i)
        return t !== n && (t = i.font = n || Xt), i.measureText(e);
      {
        e = e || "", n = n || Xt;
        const s = /((?:\d+)?\.?\d*)px/.exec(n), r = s && +s[1] || Tr;
        let o = 0;
        if (n.indexOf("mono") >= 0)
          o = r * e.length;
        else
          for (let l = 0; l < e.length; l++) {
            const a = kc[e[l]];
            o += a == null ? r : a * r;
          }
        return { width: o };
      }
    };
  }(),
  loadImage(i, t, e) {
    const n = new Image();
    return n.onload = t, n.onerror = e, n.src = i, n;
  }
};
function Rp(i) {
  for (let t in Ft)
    i[t] && (Ft[t] = i[t]);
}
const Bl = Yi([
  "Function",
  "RegExp",
  "Date",
  "Error",
  "CanvasGradient",
  "CanvasPattern",
  // For node-canvas
  "Image",
  "Canvas"
], (i, t) => (i["[object " + t + "]"] = !0, i), {}), Hl = Yi([
  "Int8",
  "Uint8",
  "Uint8Clamped",
  "Int16",
  "Uint16",
  "Int32",
  "Uint32",
  "Float32",
  "Float64"
], (i, t) => (i["[object " + t + "Array]"] = !0, i), {}), ai = Object.prototype.toString, Xn = Array.prototype, Mc = Xn.forEach, Ac = Xn.filter, br = Xn.slice, Lc = Xn.map, Kr = (function() {
}).constructor, Gi = Kr ? Kr.prototype : null, Sr = "__proto__";
let Dc = 2311;
function vr() {
  return Dc++;
}
function Ot(...i) {
  typeof console < "u" && console.error.apply(console, i);
}
function Jt(i) {
  if (i == null || typeof i != "object")
    return i;
  let t = i;
  const e = ai.call(i);
  if (e === "[object Array]") {
    if (!ii(i)) {
      t = [];
      for (let n = 0, s = i.length; n < s; n++)
        t[n] = Jt(i[n]);
    }
  } else if (Hl[e]) {
    if (!ii(i)) {
      const n = i.constructor;
      if (n.from)
        t = n.from(i);
      else {
        t = new n(i.length);
        for (let s = 0, r = i.length; s < r; s++)
          t[s] = i[s];
      }
    }
  } else if (!Bl[e] && !ii(i) && !Pn(i)) {
    t = {};
    for (let n in i)
      i.hasOwnProperty(n) && n !== Sr && (t[n] = Jt(i[n]));
  }
  return t;
}
function Ce(i, t, e) {
  if (!Et(t) || !Et(i))
    return e ? Jt(t) : i;
  for (let n in t)
    if (t.hasOwnProperty(n) && n !== Sr) {
      const s = i[n], r = t[n];
      Et(r) && Et(s) && !Oe(r) && !Oe(s) && !Pn(r) && !Pn(s) && !Bs(r) && !Bs(s) && !ii(r) && !ii(s) ? Ce(s, r, e) : (e || !(n in i)) && (i[n] = Jt(t[n]));
    }
  return i;
}
function Rc(i, t) {
  let e = i[0];
  for (let n = 1, s = i.length; n < s; n++)
    e = Ce(e, i[n], t);
  return e;
}
function F(i, t) {
  if (Object.assign)
    Object.assign(i, t);
  else
    for (let e in t)
      t.hasOwnProperty(e) && e !== Sr && (i[e] = t[e]);
  return i;
}
function dt(i, t, e) {
  const n = X(t);
  for (let s = 0, r = n.length; s < r; s++) {
    let o = n[s];
    (e ? t[o] != null : i[o] == null) && (i[o] = t[o]);
  }
  return i;
}
const Ic = Ft.createCanvas;
function Tt(i, t) {
  if (i) {
    if (i.indexOf)
      return i.indexOf(t);
    for (let e = 0, n = i.length; e < n; e++)
      if (i[e] === t)
        return e;
  }
  return -1;
}
function Ec(i, t) {
  const e = i.prototype;
  function n() {
  }
  n.prototype = t.prototype, i.prototype = new n();
  for (let s in e)
    e.hasOwnProperty(s) && (i.prototype[s] = e[s]);
  i.prototype.constructor = i, i.superClass = t;
}
function Cr(i, t, e) {
  if (i = "prototype" in i ? i.prototype : i, t = "prototype" in t ? t.prototype : t, Object.getOwnPropertyNames) {
    const n = Object.getOwnPropertyNames(t);
    for (let s = 0; s < n.length; s++) {
      const r = n[s];
      r !== "constructor" && (e ? t[r] != null : i[r] == null) && (i[r] = t[r]);
    }
  } else
    dt(i, t, e);
}
function St(i) {
  return !i || typeof i == "string" ? !1 : typeof i.length == "number";
}
function K(i, t, e) {
  if (i && t)
    if (i.forEach && i.forEach === Mc)
      i.forEach(t, e);
    else if (i.length === +i.length)
      for (let n = 0, s = i.length; n < s; n++)
        t.call(e, i[n], n, i);
    else
      for (let n in i)
        i.hasOwnProperty(n) && t.call(e, i[n], n, i);
}
function V(i, t, e) {
  if (!i)
    return [];
  if (!t)
    return Pr(i);
  if (i.map && i.map === Lc)
    return i.map(t, e);
  {
    const n = [];
    for (let s = 0, r = i.length; s < r; s++)
      n.push(t.call(e, i[s], s, i));
    return n;
  }
}
function Yi(i, t, e, n) {
  if (i && t) {
    for (let s = 0, r = i.length; s < r; s++)
      e = t.call(n, e, i[s], s, i);
    return e;
  }
}
function Cn(i, t, e) {
  if (!i)
    return [];
  if (!t)
    return Pr(i);
  if (i.filter && i.filter === Ac)
    return i.filter(t, e);
  {
    const n = [];
    for (let s = 0, r = i.length; s < r; s++)
      t.call(e, i[s], s, i) && n.push(i[s]);
    return n;
  }
}
function Oc(i, t, e) {
  if (i && t) {
    for (let n = 0, s = i.length; n < s; n++)
      if (t.call(e, i[n], n, i))
        return i[n];
  }
}
function X(i) {
  if (!i)
    return [];
  if (Object.keys)
    return Object.keys(i);
  let t = [];
  for (let e in i)
    i.hasOwnProperty(e) && t.push(e);
  return t;
}
function Fc(i, t, ...e) {
  return function() {
    return i.apply(t, e.concat(br.call(arguments)));
  };
}
const zc = Gi && Bt(Gi.bind) ? Gi.call.bind(Gi.bind) : Fc;
function Nc(i, ...t) {
  return function() {
    return i.apply(this, t.concat(br.call(arguments)));
  };
}
function Oe(i) {
  return Array.isArray ? Array.isArray(i) : ai.call(i) === "[object Array]";
}
function Bt(i) {
  return typeof i == "function";
}
function vt(i) {
  return typeof i == "string";
}
function Bc(i) {
  return ai.call(i) === "[object String]";
}
function ei(i) {
  return typeof i == "number";
}
function Et(i) {
  const t = typeof i;
  return t === "function" || !!i && t === "object";
}
function Bs(i) {
  return !!Bl[ai.call(i)];
}
function Wl(i) {
  return !!Hl[ai.call(i)];
}
function Pn(i) {
  return typeof i == "object" && typeof i.nodeType == "number" && typeof i.ownerDocument == "object";
}
function Xi(i) {
  return i.colorStops != null;
}
function Yl(i) {
  return i.image != null;
}
function Hc(i) {
  return ai.call(i) === "[object RegExp]";
}
function Xl(i) {
  return i !== i;
}
function Wc(...i) {
  for (let t = 0, e = i.length; t < e; t++)
    if (i[t] != null)
      return i[t];
}
function U(i, t) {
  return i ?? t;
}
function vi(i, t, e) {
  return i ?? t ?? e;
}
function Pr(i, ...t) {
  return br.apply(i, t);
}
function $l(i) {
  if (typeof i == "number")
    return [i, i, i, i];
  const t = i.length;
  return t === 2 ? [i[0], i[1], i[0], i[1]] : t === 3 ? [i[0], i[1], i[2], i[1]] : i;
}
function Hs(i, t) {
  if (!i)
    throw new Error(t);
}
function Pe(i) {
  return i == null ? null : typeof i.trim == "function" ? i.trim() : i.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}
const Gl = "__ec_primitive__";
function Yc(i) {
  i[Gl] = !0;
}
function ii(i) {
  return i[Gl];
}
class Xc {
  data = {};
  delete(t) {
    const e = this.has(t);
    return e && delete this.data[t], e;
  }
  has(t) {
    return this.data.hasOwnProperty(t);
  }
  get(t) {
    return this.data[t];
  }
  set(t, e) {
    return this.data[t] = e, this;
  }
  keys() {
    return X(this.data);
  }
  forEach(t) {
    const e = this.data;
    for (const n in e)
      e.hasOwnProperty(n) && t(e[n], n);
  }
}
const Vl = typeof Map == "function";
function $c() {
  return Vl ? /* @__PURE__ */ new Map() : new Xc();
}
class $n {
  data;
  constructor(t) {
    const e = Oe(t);
    this.data = $c();
    const n = this;
    t instanceof $n ? t.each(s) : t && K(t, s);
    function s(r, o) {
      e ? n.set(r, o) : n.set(o, r);
    }
  }
  // `hasKey` instead of `has` for potential misleading.
  hasKey(t) {
    return this.data.has(t);
  }
  get(t) {
    return this.data.get(t);
  }
  set(t, e) {
    return this.data.set(t, e), e;
  }
  // Although util.each can be performed on this hashMap directly, user
  // should not use the exposed keys, who are prefixed.
  each(t, e) {
    this.data.forEach((n, s) => {
      t.call(e, n, s);
    });
  }
  keys() {
    const t = this.data.keys();
    return Vl ? Array.from(t) : t;
  }
  // Do not use this method if performance sensitive.
  removeKey(t) {
    this.data.delete(t);
  }
}
function Gc(i) {
  return new $n(i);
}
function Vc(i, t) {
  const e = new i.constructor(i.length + t.length);
  for (let s = 0; s < i.length; s++)
    e[s] = i[s];
  const n = i.length;
  for (let s = 0; s < t.length; s++)
    e[s + n] = t[s];
  return e;
}
function $i(i, t) {
  let e;
  if (Object.create)
    e = Object.create(i);
  else {
    const n = function() {
    };
    n.prototype = i, e = new n();
  }
  return t && F(e, t), e;
}
function kr(i) {
  const t = i.style;
  t.webkitUserSelect = "none", t.userSelect = "none", t.webkitTapHighlightColor = "rgba(0,0,0,0)", t["-webkit-touch-callout"] = "none";
}
function Li(i, t) {
  return i.hasOwnProperty(t);
}
function jt() {
}
const Ci = 180 / Math.PI, Uc = Number.EPSILON || Math.pow(2, -52), Ip = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  EPSILON: Uc,
  HashMap: $n,
  RADIAN_TO_DEGREE: Ci,
  assert: Hs,
  bind: zc,
  clone: Jt,
  concatArray: Vc,
  createCanvas: Ic,
  createHashMap: Gc,
  createObject: $i,
  curry: Nc,
  defaults: dt,
  disableUserSelect: kr,
  each: K,
  eqNaN: Xl,
  extend: F,
  filter: Cn,
  find: Oc,
  guid: vr,
  hasOwn: Li,
  indexOf: Tt,
  inherits: Ec,
  isArray: Oe,
  isArrayLike: St,
  isBuiltInObject: Bs,
  isDom: Pn,
  isFunction: Bt,
  isGradientObject: Xi,
  isImagePatternObject: Yl,
  isNumber: ei,
  isObject: Et,
  isPrimitive: ii,
  isRegExp: Hc,
  isString: vt,
  isStringSafe: Bc,
  isTypedArray: Wl,
  keys: X,
  logError: Ot,
  map: V,
  merge: Ce,
  mergeAll: Rc,
  mixin: Cr,
  noop: jt,
  normalizeCssArray: $l,
  reduce: Yi,
  retrieve: Wc,
  retrieve2: U,
  retrieve3: vi,
  setAsPrimitive: Yc,
  slice: Pr,
  trim: Pe
}, Symbol.toStringTag, { value: "Module" }));
function Fe(i, t) {
  return i == null && (i = 0), t == null && (t = 0), [i, t];
}
function qc(i, t) {
  return i[0] = t[0], i[1] = t[1], i;
}
function Ul(i) {
  return [i[0], i[1]];
}
function Zc(i, t, e) {
  return i[0] = t, i[1] = e, i;
}
function Ws(i, t, e) {
  return i[0] = t[0] + e[0], i[1] = t[1] + e[1], i;
}
function jc(i, t, e, n) {
  return i[0] = t[0] + e[0] * n, i[1] = t[1] + e[1] * n, i;
}
function ql(i, t, e) {
  return i[0] = t[0] - e[0], i[1] = t[1] - e[1], i;
}
function Mr(i) {
  return Math.sqrt(Ar(i));
}
const Kc = Mr;
function Ar(i) {
  return i[0] * i[0] + i[1] * i[1];
}
const Qc = Ar;
function Jc(i, t, e) {
  return i[0] = t[0] * e[0], i[1] = t[1] * e[1], i;
}
function th(i, t, e) {
  return i[0] = t[0] / e[0], i[1] = t[1] / e[1], i;
}
function eh(i, t) {
  return i[0] * t[0] + i[1] * t[1];
}
function wn(i, t, e) {
  return i[0] = t[0] * e, i[1] = t[1] * e, i;
}
function Zl(i, t) {
  const e = Mr(t);
  return e === 0 ? (i[0] = 0, i[1] = 0) : (i[0] = t[0] / e, i[1] = t[1] / e), i;
}
function kn(i, t) {
  return Math.sqrt(
    (i[0] - t[0]) * (i[0] - t[0]) + (i[1] - t[1]) * (i[1] - t[1])
  );
}
const jl = kn;
function Kl(i, t) {
  return (i[0] - t[0]) * (i[0] - t[0]) + (i[1] - t[1]) * (i[1] - t[1]);
}
const Ie = Kl;
function ih(i, t) {
  return i[0] = -t[0], i[1] = -t[1], i;
}
function Ql(i, t, e, n) {
  return i[0] = t[0] + n * (e[0] - t[0]), i[1] = t[1] + n * (e[1] - t[1]), i;
}
function ni(i, t, e) {
  const n = t[0], s = t[1];
  return i[0] = e[0] * n + e[2] * s + e[4], i[1] = e[1] * n + e[3] * s + e[5], i;
}
function ke(i, t, e) {
  return i[0] = Math.min(t[0], e[0]), i[1] = Math.min(t[1], e[1]), i;
}
function Me(i, t, e) {
  return i[0] = Math.max(t[0], e[0]), i[1] = Math.max(t[1], e[1]), i;
}
const Ep = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: Ws,
  applyTransform: ni,
  clone: Ul,
  copy: qc,
  create: Fe,
  dist: jl,
  distSquare: Ie,
  distance: kn,
  distanceSquare: Kl,
  div: th,
  dot: eh,
  len: Mr,
  lenSquare: Ar,
  length: Kc,
  lengthSquare: Qc,
  lerp: Ql,
  max: Me,
  min: ke,
  mul: Jc,
  negate: ih,
  normalize: Zl,
  scale: wn,
  scaleAndAdd: jc,
  set: Zc,
  sub: ql
}, Symbol.toStringTag, { value: "Module" }));
class Be {
  target;
  topTarget;
  constructor(t, e) {
    this.target = t, this.topTarget = e && e.topTarget;
  }
}
class nh {
  handler;
  _draggingTarget;
  _dropTarget;
  _x;
  _y;
  constructor(t) {
    this.handler = t, t.on("mousedown", this._dragStart, this), t.on("mousemove", this._drag, this), t.on("mouseup", this._dragEnd, this);
  }
  _dragStart(t) {
    let e = t.target;
    for (; e && !e.draggable; )
      e = e.parent || e.__hostTarget;
    e && (this._draggingTarget = e, e.dragging = !0, this._x = t.offsetX, this._y = t.offsetY, this.handler.dispatchToElement(
      new Be(e, t),
      "dragstart",
      t.event
    ));
  }
  _drag(t) {
    const e = this._draggingTarget;
    if (e) {
      const n = t.offsetX, s = t.offsetY, r = n - this._x, o = s - this._y;
      this._x = n, this._y = s, e.drift(r, o, t), this.handler.dispatchToElement(
        new Be(e, t),
        "drag",
        t.event
      );
      const l = this.handler.findHover(
        n,
        s,
        e
        // PENDING
      ).target, a = this._dropTarget;
      this._dropTarget = l, e !== l && (a && l !== a && this.handler.dispatchToElement(
        new Be(a, t),
        "dragleave",
        t.event
      ), l && l !== a && this.handler.dispatchToElement(
        new Be(l, t),
        "dragenter",
        t.event
      ));
    }
  }
  _dragEnd(t) {
    const e = this._draggingTarget;
    e && (e.dragging = !1), this.handler.dispatchToElement(new Be(e, t), "dragend", t.event), this._dropTarget && this.handler.dispatchToElement(new Be(this._dropTarget, t), "drop", t.event), this._draggingTarget = null, this._dropTarget = null;
  }
}
class ci {
  _$handlers;
  _$eventProcessor;
  constructor(t) {
    t && (this._$eventProcessor = t);
  }
  /**
   * Bind a handler.
   *
   * @param event The event name.
   * @param Condition used on event filter.
   * @param handler The event handler.
   * @param context
   */
  on(t, e, n, s) {
    this._$handlers || (this._$handlers = {});
    const r = this._$handlers;
    if (typeof e == "function" && (s = n, n = e, e = null), !n || !t)
      return this;
    const o = this._$eventProcessor;
    e != null && o && o.normalizeQuery && (e = o.normalizeQuery(e)), r[t] || (r[t] = []);
    for (let h = 0; h < r[t].length; h++)
      if (r[t][h].h === n)
        return this;
    const l = {
      h: n,
      query: e,
      ctx: s || this,
      // FIXME
      // Do not publish this feature util it is proved that it makes sense.
      callAtLast: n.zrEventfulCallAtLast
    }, a = r[t].length - 1, c = r[t][a];
    return c && c.callAtLast ? r[t].splice(a, 0, l) : r[t].push(l), this;
  }
  /**
   * Whether any handler has bound.
   */
  isSilent(t) {
    const e = this._$handlers;
    return !e || !e[t] || !e[t].length;
  }
  /**
   * Unbind a event.
   *
   * @param eventType The event name.
   *        If no `event` input, "off" all listeners.
   * @param handler The event handler.
   *        If no `handler` input, "off" all listeners of the `event`.
   */
  off(t, e) {
    const n = this._$handlers;
    if (!n)
      return this;
    if (!t)
      return this._$handlers = {}, this;
    if (e) {
      if (n[t]) {
        const s = [];
        for (let r = 0, o = n[t].length; r < o; r++)
          n[t][r].h !== e && s.push(n[t][r]);
        n[t] = s;
      }
      n[t] && n[t].length === 0 && delete n[t];
    } else
      delete n[t];
    return this;
  }
  /**
   * Dispatch a event.
   *
   * @param {string} eventType The event name.
   */
  trigger(t, ...e) {
    if (!this._$handlers)
      return this;
    const n = this._$handlers[t], s = this._$eventProcessor;
    if (n) {
      const r = e.length, o = n.length;
      for (let l = 0; l < o; l++) {
        const a = n[l];
        if (!(s && s.filter && a.query != null && !s.filter(t, a.query)))
          switch (r) {
            case 0:
              a.h.call(a.ctx);
              break;
            case 1:
              a.h.call(a.ctx, e[0]);
              break;
            case 2:
              a.h.call(a.ctx, e[0], e[1]);
              break;
            default:
              a.h.apply(a.ctx, e);
              break;
          }
      }
    }
    return s && s.afterTrigger && s.afterTrigger(t), this;
  }
  /**
   * Dispatch a event with context, which is specified at the last parameter.
   *
   * @param {string} type The event name.
   */
  triggerWithContext(t, ...e) {
    if (!this._$handlers)
      return this;
    const n = this._$handlers[t], s = this._$eventProcessor;
    if (n) {
      const r = e.length, o = e[r - 1], l = n.length;
      for (let a = 0; a < l; a++) {
        const c = n[a];
        if (!(s && s.filter && c.query != null && !s.filter(t, c.query)))
          switch (r) {
            case 0:
              c.h.call(o);
              break;
            case 1:
              c.h.call(o, e[0]);
              break;
            case 2:
              c.h.call(o, e[0], e[1]);
              break;
            default:
              c.h.apply(o, e.slice(1, r - 1));
              break;
          }
      }
    }
    return s && s.afterTrigger && s.afterTrigger(t), this;
  }
}
const sh = Math.log(2);
function Ys(i, t, e, n, s, r) {
  const o = n + "-" + s, l = i.length;
  if (r.hasOwnProperty(o))
    return r[o];
  if (t === 1) {
    const f = Math.round(Math.log((1 << l) - 1 & ~s) / sh);
    return i[e][f];
  }
  const a = n | 1 << e;
  let c = e + 1;
  for (; n & 1 << c; )
    c++;
  let h = 0;
  for (let f = 0, u = 0; f < l; f++) {
    const d = 1 << f;
    d & s || (h += (u % 2 ? -1 : 1) * i[e][f] * Ys(i, t - 1, c, a, s | d, r), u++);
  }
  return r[o] = h, h;
}
function rh(i, t) {
  const e = [
    [i[0], i[1], 1, 0, 0, 0, -t[0] * i[0], -t[0] * i[1]],
    [0, 0, 0, i[0], i[1], 1, -t[1] * i[0], -t[1] * i[1]],
    [i[2], i[3], 1, 0, 0, 0, -t[2] * i[2], -t[2] * i[3]],
    [0, 0, 0, i[2], i[3], 1, -t[3] * i[2], -t[3] * i[3]],
    [i[4], i[5], 1, 0, 0, 0, -t[4] * i[4], -t[4] * i[5]],
    [0, 0, 0, i[4], i[5], 1, -t[5] * i[4], -t[5] * i[5]],
    [i[6], i[7], 1, 0, 0, 0, -t[6] * i[6], -t[6] * i[7]],
    [0, 0, 0, i[6], i[7], 1, -t[7] * i[6], -t[7] * i[7]]
  ], n = {}, s = Ys(e, 8, 0, 0, 0, n);
  if (s === 0)
    return;
  const r = [];
  for (let o = 0; o < 8; o++)
    for (let l = 0; l < 8; l++)
      r[l] == null && (r[l] = 0), r[l] += ((o + l) % 2 ? -1 : 1) * Ys(e, 7, o === 0 ? 1 : 0, 1 << o, 1 << l, n) / s * t[o];
  return function(o, l, a) {
    const c = l * r[6] + a * r[7] + 1;
    o[0] = (l * r[0] + a * r[1] + r[2]) / c, o[1] = (l * r[3] + a * r[4] + r[5]) / c;
  };
}
const Qr = "___zrEVENTSAVED";
function oh(i, t, e, n, s) {
  if (t.getBoundingClientRect && G.domSupported && !Jl(t)) {
    const r = t[Qr] || (t[Qr] = {}), o = lh(t, r), l = ah(o, r);
    if (l)
      return l(i, e, n), !0;
  }
  return !1;
}
function lh(i, t) {
  let e = t.markers;
  if (e)
    return e;
  e = t.markers = [];
  const n = ["left", "right"], s = ["top", "bottom"];
  for (let r = 0; r < 4; r++) {
    const o = document.createElement("div"), l = o.style, a = r % 2, c = (r >> 1) % 2;
    l.cssText = [
      "position: absolute",
      "visibility: hidden",
      "padding: 0",
      "margin: 0",
      "border-width: 0",
      "user-select: none",
      "width:0",
      "height:0",
      // 'width: 5px',
      // 'height: 5px',
      n[a] + ":0",
      s[c] + ":0",
      n[1 - a] + ":auto",
      s[1 - c] + ":auto",
      ""
    ].join("!important;"), i.appendChild(o), e.push(o);
  }
  return t.clearMarkers = function() {
    K(e, function(r) {
      r.parentNode && r.parentNode.removeChild(r);
    });
  }, e;
}
function ah(i, t, e) {
  const n = "trans", s = t[n], r = t.srcCoords, o = [], l = [];
  let a = !0;
  for (let c = 0; c < 4; c++) {
    const h = i[c].getBoundingClientRect(), f = 2 * c, u = h.left, d = h.top;
    o.push(u, d), a = a && r && u === r[f] && d === r[f + 1], l.push(i[c].offsetLeft, i[c].offsetTop);
  }
  return a && s ? s : (t.srcCoords = o, t[n] = rh(o, l));
}
function Jl(i) {
  return i.nodeName.toUpperCase() === "CANVAS";
}
const ch = /([&<>"'])/g, hh = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function fh(i) {
  return i == null ? "" : (i + "").replace(ch, function(t, e) {
    return hh[e];
  });
}
const uh = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, Qn = [], dh = G.browser.firefox && +G.browser.version.split(".")[0] < 39;
function Xs(i, t, e, n) {
  return e = e || {}, n ? Jr(i, t, e) : dh && t.layerX != null && t.layerX !== t.offsetX ? (e.zrX = t.layerX, e.zrY = t.layerY) : t.offsetX != null ? (e.zrX = t.offsetX, e.zrY = t.offsetY) : Jr(i, t, e), e;
}
function Jr(i, t, e) {
  if (G.domSupported && i.getBoundingClientRect) {
    const n = t.clientX, s = t.clientY;
    if (Jl(i)) {
      const r = i.getBoundingClientRect();
      e.zrX = n - r.left, e.zrY = s - r.top;
      return;
    } else if (oh(Qn, i, n, s)) {
      e.zrX = Qn[0], e.zrY = Qn[1];
      return;
    }
  }
  e.zrX = e.zrY = 0;
}
function Lr(i) {
  return i || window.event;
}
function wt(i, t, e) {
  if (t = Lr(t), t.zrX != null)
    return t;
  const n = t.type;
  if (n && n.indexOf("touch") >= 0) {
    const o = n !== "touchend" ? t.targetTouches[0] : t.changedTouches[0];
    o && Xs(i, o, t, e);
  } else {
    Xs(i, t, t, e);
    const o = ph(t);
    t.zrDelta = o ? o / 120 : -(t.detail || 0) / 3;
  }
  const r = t.button;
  return t.which == null && r !== void 0 && uh.test(t.type) && (t.which = r & 1 ? 1 : r & 2 ? 3 : r & 4 ? 2 : 0), t;
}
function ph(i) {
  const t = i.wheelDelta;
  if (t)
    return t;
  const e = i.deltaX, n = i.deltaY;
  if (e == null || n == null)
    return t;
  const s = Math.abs(n !== 0 ? n : e), r = n > 0 ? -1 : n < 0 ? 1 : e > 0 ? -1 : 1;
  return 3 * s * r;
}
function gh(i, t, e, n) {
  i.addEventListener(t, e, n);
}
function _h(i, t, e, n) {
  i.removeEventListener(t, e, n);
}
const mh = function(i) {
  i.preventDefault(), i.stopPropagation(), i.cancelBubble = !0;
};
class yh {
  _track = [];
  constructor() {
  }
  recognize(t, e, n) {
    return this._doTrack(t, e, n), this._recognize(t);
  }
  clear() {
    return this._track.length = 0, this;
  }
  _doTrack(t, e, n) {
    const s = t.touches;
    if (!s)
      return;
    const r = {
      points: [],
      touches: [],
      target: e,
      event: t
    };
    for (let o = 0, l = s.length; o < l; o++) {
      const a = s[o], c = Xs(n, a, {});
      r.points.push([c.zrX, c.zrY]), r.touches.push(a);
    }
    this._track.push(r);
  }
  _recognize(t) {
    for (let e in Jn)
      if (Jn.hasOwnProperty(e)) {
        const n = Jn[e](this._track, t);
        if (n)
          return n;
      }
  }
}
function to(i) {
  const t = i[1][0] - i[0][0], e = i[1][1] - i[0][1];
  return Math.sqrt(t * t + e * e);
}
function wh(i) {
  return [
    (i[0][0] + i[1][0]) / 2,
    (i[0][1] + i[1][1]) / 2
  ];
}
const Jn = {
  pinch: function(i, t) {
    const e = i.length;
    if (!e)
      return;
    const n = (i[e - 1] || {}).points, s = (i[e - 2] || {}).points || n;
    if (s && s.length > 1 && n && n.length > 1) {
      let r = to(n) / to(s);
      !isFinite(r) && (r = 1), t.pinchScale = r;
      const o = wh(n);
      return t.pinchX = o[0], t.pinchY = o[1], {
        type: "pinch",
        target: i[0].target,
        event: t
      };
    }
  }
  // Only pinch currently.
};
function Kt() {
  return [1, 0, 0, 1, 0, 0];
}
function ta(i) {
  return i[0] = 1, i[1] = 0, i[2] = 0, i[3] = 1, i[4] = 0, i[5] = 0, i;
}
function Dr(i, t) {
  return i[0] = t[0], i[1] = t[1], i[2] = t[2], i[3] = t[3], i[4] = t[4], i[5] = t[5], i;
}
function si(i, t, e) {
  const n = t[0] * e[0] + t[2] * e[1], s = t[1] * e[0] + t[3] * e[1], r = t[0] * e[2] + t[2] * e[3], o = t[1] * e[2] + t[3] * e[3], l = t[0] * e[4] + t[2] * e[5] + t[4], a = t[1] * e[4] + t[3] * e[5] + t[5];
  return i[0] = n, i[1] = s, i[2] = r, i[3] = o, i[4] = l, i[5] = a, i;
}
function Mn(i, t, e) {
  return i[0] = t[0], i[1] = t[1], i[2] = t[2], i[3] = t[3], i[4] = t[4] + e[0], i[5] = t[5] + e[1], i;
}
function Rr(i, t, e, n = [0, 0]) {
  const s = t[0], r = t[2], o = t[4], l = t[1], a = t[3], c = t[5], h = Math.sin(e), f = Math.cos(e);
  return i[0] = s * f + l * h, i[1] = -s * h + l * f, i[2] = r * f + a * h, i[3] = -r * h + f * a, i[4] = f * (o - n[0]) + h * (c - n[1]) + n[0], i[5] = f * (c - n[1]) - h * (o - n[0]) + n[1], i;
}
function Ir(i, t, e) {
  const n = e[0], s = e[1];
  return i[0] = t[0] * n, i[1] = t[1] * s, i[2] = t[2] * n, i[3] = t[3] * s, i[4] = t[4] * n, i[5] = t[5] * s, i;
}
function Er(i, t) {
  const e = t[0], n = t[2], s = t[4], r = t[1], o = t[3], l = t[5];
  let a = e * o - r * n;
  return a ? (a = 1 / a, i[0] = o * a, i[1] = -r * a, i[2] = -n * a, i[3] = e * a, i[4] = (n * l - o * s) * a, i[5] = (r * s - e * l) * a, i) : null;
}
function xh(i) {
  const t = Kt();
  return Dr(t, i), t;
}
const Op = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clone: xh,
  copy: Dr,
  create: Kt,
  identity: ta,
  invert: Er,
  mul: si,
  rotate: Rr,
  scale: Ir,
  translate: Mn
}, Symbol.toStringTag, { value: "Module" }));
class B {
  x;
  y;
  constructor(t, e) {
    this.x = t || 0, this.y = e || 0;
  }
  /**
   * Copy from another point
   */
  copy(t) {
    return this.x = t.x, this.y = t.y, this;
  }
  /**
   * Clone a point
   */
  clone() {
    return new B(this.x, this.y);
  }
  /**
   * Set x and y
   */
  set(t, e) {
    return this.x = t, this.y = e, this;
  }
  /**
   * If equal to another point
   */
  equal(t) {
    return t.x === this.x && t.y === this.y;
  }
  /**
   * Add another point
   */
  add(t) {
    return this.x += t.x, this.y += t.y, this;
  }
  scale(t) {
    this.x *= t, this.y *= t;
  }
  scaleAndAdd(t, e) {
    this.x += t.x * e, this.y += t.y * e;
  }
  /**
   * Sub another point
   */
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this;
  }
  /**
   * Dot product with other point
   */
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  /**
   * Get length of point
   */
  len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   * Get squared length
   */
  lenSquare() {
    return this.x * this.x + this.y * this.y;
  }
  /**
   * Normalize
   */
  normalize() {
    const t = this.len();
    return this.x /= t, this.y /= t, this;
  }
  /**
   * Distance to another point
   */
  distance(t) {
    const e = this.x - t.x, n = this.y - t.y;
    return Math.sqrt(e * e + n * n);
  }
  /**
   * Square distance to another point
   */
  distanceSquare(t) {
    const e = this.x - t.x, n = this.y - t.y;
    return e * e + n * n;
  }
  /**
   * Negate
   */
  negate() {
    return this.x = -this.x, this.y = -this.y, this;
  }
  /**
   * Apply a transform matrix array.
   */
  transform(t) {
    if (!t)
      return;
    const e = this.x, n = this.y;
    return this.x = t[0] * e + t[2] * n + t[4], this.y = t[1] * e + t[3] * n + t[5], this;
  }
  toArray(t) {
    return t[0] = this.x, t[1] = this.y, t;
  }
  fromArray(t) {
    this.x = t[0], this.y = t[1];
  }
  static set(t, e, n) {
    t.x = e, t.y = n;
  }
  static copy(t, e) {
    t.x = e.x, t.y = e.y;
  }
  static len(t) {
    return Math.sqrt(t.x * t.x + t.y * t.y);
  }
  static lenSquare(t) {
    return t.x * t.x + t.y * t.y;
  }
  static dot(t, e) {
    return t.x * e.x + t.y * e.y;
  }
  static add(t, e, n) {
    t.x = e.x + n.x, t.y = e.y + n.y;
  }
  static sub(t, e, n) {
    t.x = e.x - n.x, t.y = e.y - n.y;
  }
  static scale(t, e, n) {
    t.x = e.x * n, t.y = e.y * n;
  }
  static scaleAndAdd(t, e, n, s) {
    t.x = e.x + n.x * s, t.y = e.y + n.y * s;
  }
  static lerp(t, e, n, s) {
    const r = 1 - s;
    t.x = r * e.x + s * n.x, t.y = r * e.y + s * n.y;
  }
}
const Ae = Math.min, Ze = Math.max, $s = Math.abs, eo = ["x", "y"], Th = ["width", "height"], se = new B(), re = new B(), oe = new B(), le = new B(), ft = ea(), yi = ft.minTv, Gs = ft.maxTv, Pi = [0, 0];
class D {
  x;
  y;
  width;
  height;
  constructor(t, e, n, s) {
    D.set(this, t, e, n, s);
  }
  static set(t, e, n, s, r) {
    return s < 0 && (e = e + s, s = -s), r < 0 && (n = n + r, r = -r), t.x = e, t.y = n, t.width = s, t.height = r, t;
  }
  union(t) {
    const e = Ae(t.x, this.x), n = Ae(t.y, this.y);
    isFinite(this.x) && isFinite(this.width) ? this.width = Ze(
      t.x + t.width,
      this.x + this.width
    ) - e : this.width = t.width, isFinite(this.y) && isFinite(this.height) ? this.height = Ze(
      t.y + t.height,
      this.y + this.height
    ) - n : this.height = t.height, this.x = e, this.y = n;
  }
  applyTransform(t) {
    D.applyTransform(this, this, t);
  }
  calculateTransform(t) {
    const e = this, n = t.width / e.width, s = t.height / e.height, r = Kt();
    return Mn(r, r, [-e.x, -e.y]), Ir(r, r, [n, s]), Mn(r, r, [t.x, t.y]), r;
  }
  /**
   * @see `static intersect`
   */
  intersect(t, e, n) {
    return D.intersect(this, t, e, n);
  }
  /**
   * [NOTICE]
   *  Touching the edge is considered an intersection.
   *  zero-width/height can still cause intersection if `touchThreshold` is 0.
   *  See more in `BoundingRectIntersectOpt['touchThreshold']`
   *
   * @param mtv
   *  If it's not overlapped. it means needs to move `b` rect with Maximum Translation Vector to be overlapped.
   *  Else it means needs to move `b` rect with Minimum Translation Vector to be not overlapped.
   */
  static intersect(t, e, n, s) {
    n && B.set(n, 0, 0);
    const r = s && s.outIntersectRect || null, o = s && s.clamp;
    if (r && (r.x = r.y = r.width = r.height = NaN), !t || !e)
      return !1;
    t instanceof D || (t = D.set(bh, t.x, t.y, t.width, t.height)), e instanceof D || (e = D.set(Sh, e.x, e.y, e.width, e.height));
    const l = !!n;
    ft.reset(s, l);
    const a = ft.touchThreshold, c = t.x + a, h = t.x + t.width - a, f = t.y + a, u = t.y + t.height - a, d = e.x + a, p = e.x + e.width - a, g = e.y + a, _ = e.y + e.height - a;
    if (c > h || f > u || d > p || g > _)
      return !1;
    const m = !(h < d || p < c || u < g || _ < f);
    return (l || r) && (Pi[0] = 1 / 0, Pi[1] = 0, io(c, h, d, p, 0, l, r, o), io(f, u, g, _, 1, l, r, o), l && B.copy(
      n,
      m ? ft.useDir ? ft.dirMinTv : yi : Gs
    )), m;
  }
  static contain(t, e, n) {
    return e >= t.x && e <= t.x + t.width && n >= t.y && n <= t.y + t.height;
  }
  contain(t, e) {
    return D.contain(this, t, e);
  }
  clone() {
    return new D(this.x, this.y, this.width, this.height);
  }
  /**
   * Copy from another rect
   */
  copy(t) {
    D.copy(this, t);
  }
  plain() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
  /**
   * If not having NaN or Infinity with attributes
   */
  isFinite() {
    return isFinite(this.x) && isFinite(this.y) && isFinite(this.width) && isFinite(this.height);
  }
  isZero() {
    return this.width === 0 || this.height === 0;
  }
  static create(t) {
    return new D(t.x, t.y, t.width, t.height);
  }
  static copy(t, e) {
    return t.x = e.x, t.y = e.y, t.width = e.width, t.height = e.height, t;
  }
  static applyTransform(t, e, n) {
    if (!n) {
      t !== e && D.copy(t, e);
      return;
    }
    if (n[1] < 1e-5 && n[1] > -1e-5 && n[2] < 1e-5 && n[2] > -1e-5) {
      const o = n[0], l = n[3], a = n[4], c = n[5];
      t.x = e.x * o + a, t.y = e.y * l + c, t.width = e.width * o, t.height = e.height * l, t.width < 0 && (t.x += t.width, t.width = -t.width), t.height < 0 && (t.y += t.height, t.height = -t.height);
      return;
    }
    se.x = oe.x = e.x, se.y = le.y = e.y, re.x = le.x = e.x + e.width, re.y = oe.y = e.y + e.height, se.transform(n), le.transform(n), re.transform(n), oe.transform(n), t.x = Ae(se.x, re.x, oe.x, le.x), t.y = Ae(se.y, re.y, oe.y, le.y);
    const s = Ze(se.x, re.x, oe.x, le.x), r = Ze(se.y, re.y, oe.y, le.y);
    t.width = s - t.x, t.height = r - t.y;
  }
}
const bh = new D(0, 0, 0, 0), Sh = new D(0, 0, 0, 0);
function io(i, t, e, n, s, r, o, l) {
  const a = $s(t - e), c = $s(n - i), h = Ae(a, c), f = eo[s], u = eo[1 - s], d = Th[s];
  t < e || n < i ? a < c ? (r && (Gs[f] = -a), l && (o[f] = t, o[d] = 0)) : (r && (Gs[f] = c), l && (o[f] = i, o[d] = 0)) : (o && (o[f] = Ze(i, e), o[d] = Ae(t, n) - o[f]), r && (h < Pi[0] || ft.useDir) && (Pi[0] = Ae(h, Pi[0]), (a < c || !ft.bidirectional) && (yi[f] = a, yi[u] = 0, ft.useDir && ft.calcDirMTV()), (a >= c || !ft.bidirectional) && (yi[f] = -c, yi[u] = 0, ft.useDir && ft.calcDirMTV())));
}
function ea() {
  let i = 0;
  const t = new B(), e = new B(), n = {
    minTv: new B(),
    maxTv: new B(),
    useDir: !1,
    dirMinTv: new B(),
    touchThreshold: 0,
    bidirectional: !0,
    negativeSize: !1,
    reset(r, o) {
      n.touchThreshold = 0, r && r.touchThreshold != null && (n.touchThreshold = Ze(0, r.touchThreshold)), n.negativeSize = !1, o && (n.minTv.set(1 / 0, 1 / 0), n.maxTv.set(0, 0), n.useDir = !1, r && r.direction != null && (n.useDir = !0, n.dirMinTv.copy(n.minTv), e.copy(n.minTv), i = r.direction, n.bidirectional = r.bidirectional == null || !!r.bidirectional, n.bidirectional || t.set(Math.cos(i), Math.sin(i))));
    },
    calcDirMTV() {
      const r = n.minTv, o = n.dirMinTv, l = r.y * r.y + r.x * r.x, a = Math.sin(i), c = Math.cos(i), h = a * r.y + c * r.x;
      if (s(h)) {
        s(r.x) && s(r.y) && o.set(0, 0);
        return;
      }
      if (e.x = l * c / h, e.y = l * a / h, s(e.x) && s(e.y)) {
        o.set(0, 0);
        return;
      }
      (n.bidirectional || t.dot(e) > 0) && e.len() < o.len() && o.copy(e);
    }
  };
  function s(r) {
    return $s(r) < 1e-10;
  }
  return n;
}
const ia = "silent";
function vh(i, t, e) {
  return {
    type: i,
    event: e,
    // target can only be an element that is not silent.
    target: t.target,
    // topTarget can be a silent element.
    topTarget: t.topTarget,
    cancelBubble: !1,
    offsetX: e.zrX,
    offsetY: e.zrY,
    gestureEvent: e.gestureEvent,
    pinchX: e.pinchX,
    pinchY: e.pinchY,
    pinchScale: e.pinchScale,
    wheelDelta: e.zrDelta,
    zrByTouch: e.zrByTouch,
    which: e.which,
    stop: Ch
  };
}
function Ch() {
  mh(this.event);
}
class Ph extends ci {
  handler = null;
  dispose() {
  }
  setCursor() {
  }
}
class ui {
  x;
  y;
  target;
  topTarget;
  constructor(t, e) {
    this.x = t, this.y = e;
  }
}
const kh = [
  "click",
  "dblclick",
  "mousewheel",
  "mouseout",
  "mouseup",
  "mousedown",
  "mousemove",
  "contextmenu"
], ts = new D(0, 0, 0, 0);
class na extends ci {
  storage;
  painter;
  painterRoot;
  proxy;
  _hovered = new ui(0, 0);
  _gestureMgr;
  _draggingMgr;
  _pointerSize;
  _downEl;
  _upEl;
  _downPoint;
  constructor(t, e, n, s, r) {
    super(), this.storage = t, this.painter = e, this.painterRoot = s, this._pointerSize = r, n = n || new Ph(), this.proxy = null, this.setHandlerProxy(n), this._draggingMgr = new nh(this);
  }
  setHandlerProxy(t) {
    this.proxy && this.proxy.dispose(), t && (K(kh, function(e) {
      t.on && t.on(e, this[e], this);
    }, this), t.handler = this), this.proxy = t;
  }
  mousemove(t) {
    const e = t.zrX, n = t.zrY, s = sa(this, e, n);
    let r = this._hovered, o = r.target;
    o && !o.__zr && (r = this.findHover(r.x, r.y), o = r.target);
    const l = this._hovered = s ? new ui(e, n) : this.findHover(e, n), a = l.target, c = this.proxy;
    c.setCursor && c.setCursor(a ? a.cursor : "default"), o && a !== o && this.dispatchToElement(r, "mouseout", t), this.dispatchToElement(l, "mousemove", t), a && a !== o && this.dispatchToElement(l, "mouseover", t);
  }
  mouseout(t) {
    const e = t.zrEventControl;
    e !== "only_globalout" && this.dispatchToElement(this._hovered, "mouseout", t), e !== "no_globalout" && this.trigger("globalout", { type: "globalout", event: t });
  }
  /**
   * Resize
   */
  resize() {
    this._hovered = new ui(0, 0);
  }
  /**
   * Dispatch event
   */
  dispatch(t, e) {
    const n = this[t];
    n && n.call(this, e);
  }
  /**
   * Dispose
   */
  dispose() {
    this.proxy.dispose(), this.storage = null, this.proxy = null, this.painter = null;
  }
  /**
   * 设置默认的cursor style
   * @param cursorStyle 例如 crosshair，默认为 'default'
   */
  setCursorStyle(t) {
    const e = this.proxy;
    e.setCursor && e.setCursor(t);
  }
  /**
   * 事件分发代理
   *
   * @private
   * @param {Object} targetInfo {target, topTarget} 目标图形元素
   * @param {string} eventName 事件名称
   * @param {Object} event 事件对象
   */
  dispatchToElement(t, e, n) {
    t = t || {};
    let s = t.target;
    if (s && s.silent)
      return;
    const r = "on" + e, o = vh(e, t, n);
    for (; s && (s[r] && (o.cancelBubble = !!s[r].call(s, o)), s.trigger(e, o), s = s.__hostTarget ? s.__hostTarget : s.parent, !o.cancelBubble); )
      ;
    o.cancelBubble || (this.trigger(e, o), this.painter && this.painter.eachOtherLayer && this.painter.eachOtherLayer(function(l) {
      typeof l[r] == "function" && l[r].call(l, o), l.trigger && l.trigger(e, o);
    }));
  }
  findHover(t, e, n) {
    const s = this.storage.getDisplayList(), r = new ui(t, e);
    if (no(s, r, t, e, n), this._pointerSize && !r.target) {
      const o = [], l = this._pointerSize, a = l / 2, c = new D(t - a, e - a, l, l);
      for (let h = s.length - 1; h >= 0; h--) {
        const f = s[h];
        f !== n && !f.ignore && !f.ignoreCoarsePointer && (!f.parent || !f.parent.ignoreCoarsePointer) && (ts.copy(f.getBoundingRect()), f.transform && ts.applyTransform(f.transform), ts.intersect(c) && o.push(f));
      }
      if (o.length) {
        const f = Math.PI / 12, u = Math.PI * 2;
        for (let d = 0; d < a; d += 4)
          for (let p = 0; p < u; p += f) {
            const g = t + d * Math.cos(p), _ = e + d * Math.sin(p);
            if (no(o, r, g, _, n), r.target)
              return r;
          }
      }
    }
    return r;
  }
  processGesture(t, e) {
    this._gestureMgr || (this._gestureMgr = new yh());
    const n = this._gestureMgr;
    e === "start" && n.clear();
    const s = n.recognize(
      t,
      this.findHover(t.zrX, t.zrY, null).target,
      this.proxy.dom
    );
    if (e === "end" && n.clear(), s) {
      const r = s.type;
      t.gestureEvent = r;
      let o = new ui();
      o.target = s.target, this.dispatchToElement(o, r, s.event);
    }
  }
  click;
  mousedown;
  mouseup;
  mousewheel;
  dblclick;
  contextmenu;
}
K(["click", "mousedown", "mouseup", "mousewheel", "dblclick", "contextmenu"], function(i) {
  na.prototype[i] = function(t) {
    const e = t.zrX, n = t.zrY, s = sa(this, e, n);
    let r, o;
    if ((i !== "mouseup" || !s) && (r = this.findHover(e, n), o = r.target), i === "mousedown")
      this._downEl = o, this._downPoint = [t.zrX, t.zrY], this._upEl = o;
    else if (i === "mouseup")
      this._upEl = o;
    else if (i === "click") {
      if (this._downEl !== this._upEl || !this._downPoint || jl(this._downPoint, [t.zrX, t.zrY]) > 4)
        return;
      this._downPoint = null;
    }
    this.dispatchToElement(r, i, t);
  };
});
function Mh(i, t, e) {
  if (i[i.rectHover ? "rectContain" : "contain"](t, e)) {
    let n = i, s, r = !1;
    for (; n; ) {
      if (n.ignoreClip && (r = !0), !r) {
        let l = n.getClipPath();
        if (l && !l.contain(t, e))
          return !1;
      }
      n.silent && (s = !0);
      const o = n.__hostTarget;
      n = o ? n.ignoreHostSilent ? null : o : n.parent;
    }
    return s ? ia : !0;
  }
  return !1;
}
function no(i, t, e, n, s) {
  for (let r = i.length - 1; r >= 0; r--) {
    const o = i[r];
    let l;
    if (o !== s && !o.ignore && (l = Mh(o, e, n)) && (!t.topTarget && (t.topTarget = o), l !== ia)) {
      t.target = o;
      break;
    }
  }
}
function sa(i, t, e) {
  const n = i.painter;
  return t < 0 || t > n.getWidth() || e < 0 || e > n.getHeight();
}
const ra = 32, di = 7;
function Ah(i) {
  for (var t = 0; i >= ra; )
    t |= i & 1, i >>= 1;
  return i + t;
}
function so(i, t, e, n) {
  var s = t + 1;
  if (s === e)
    return 1;
  if (n(i[s++], i[t]) < 0) {
    for (; s < e && n(i[s], i[s - 1]) < 0; )
      s++;
    Lh(i, t, s);
  } else
    for (; s < e && n(i[s], i[s - 1]) >= 0; )
      s++;
  return s - t;
}
function Lh(i, t, e) {
  for (e--; t < e; ) {
    var n = i[t];
    i[t++] = i[e], i[e--] = n;
  }
}
function ro(i, t, e, n, s) {
  for (n === t && n++; n < e; n++) {
    for (var r = i[n], o = t, l = n, a; o < l; )
      a = o + l >>> 1, s(r, i[a]) < 0 ? l = a : o = a + 1;
    var c = n - o;
    switch (c) {
      case 3:
        i[o + 3] = i[o + 2];
      case 2:
        i[o + 2] = i[o + 1];
      case 1:
        i[o + 1] = i[o];
        break;
      default:
        for (; c > 0; )
          i[o + c] = i[o + c - 1], c--;
    }
    i[o] = r;
  }
}
function es(i, t, e, n, s, r) {
  var o = 0, l = 0, a = 1;
  if (r(i, t[e + s]) > 0) {
    for (l = n - s; a < l && r(i, t[e + s + a]) > 0; )
      o = a, a = (a << 1) + 1, a <= 0 && (a = l);
    a > l && (a = l), o += s, a += s;
  } else {
    for (l = s + 1; a < l && r(i, t[e + s - a]) <= 0; )
      o = a, a = (a << 1) + 1, a <= 0 && (a = l);
    a > l && (a = l);
    var c = o;
    o = s - a, a = s - c;
  }
  for (o++; o < a; ) {
    var h = o + (a - o >>> 1);
    r(i, t[e + h]) > 0 ? o = h + 1 : a = h;
  }
  return a;
}
function is(i, t, e, n, s, r) {
  var o = 0, l = 0, a = 1;
  if (r(i, t[e + s]) < 0) {
    for (l = s + 1; a < l && r(i, t[e + s - a]) < 0; )
      o = a, a = (a << 1) + 1, a <= 0 && (a = l);
    a > l && (a = l);
    var c = o;
    o = s - a, a = s - c;
  } else {
    for (l = n - s; a < l && r(i, t[e + s + a]) >= 0; )
      o = a, a = (a << 1) + 1, a <= 0 && (a = l);
    a > l && (a = l), o += s, a += s;
  }
  for (o++; o < a; ) {
    var h = o + (a - o >>> 1);
    r(i, t[e + h]) < 0 ? a = h : o = h + 1;
  }
  return a;
}
function Dh(i, t) {
  let e = di, n, s, r = 0;
  var o = [];
  n = [], s = [];
  function l(d, p) {
    n[r] = d, s[r] = p, r += 1;
  }
  function a() {
    for (; r > 1; ) {
      var d = r - 2;
      if (d >= 1 && s[d - 1] <= s[d] + s[d + 1] || d >= 2 && s[d - 2] <= s[d] + s[d - 1])
        s[d - 1] < s[d + 1] && d--;
      else if (s[d] > s[d + 1])
        break;
      h(d);
    }
  }
  function c() {
    for (; r > 1; ) {
      var d = r - 2;
      d > 0 && s[d - 1] < s[d + 1] && d--, h(d);
    }
  }
  function h(d) {
    var p = n[d], g = s[d], _ = n[d + 1], m = s[d + 1];
    s[d] = g + m, d === r - 3 && (n[d + 1] = n[d + 2], s[d + 1] = s[d + 2]), r--;
    var y = is(i[_], i, p, g, 0, t);
    p += y, g -= y, g !== 0 && (m = es(i[p + g - 1], i, _, m, m - 1, t), m !== 0 && (g <= m ? f(p, g, _, m) : u(p, g, _, m)));
  }
  function f(d, p, g, _) {
    var m = 0;
    for (m = 0; m < p; m++)
      o[m] = i[d + m];
    var y = 0, w = g, b = d;
    if (i[b++] = i[w++], --_ === 0) {
      for (m = 0; m < p; m++)
        i[b + m] = o[y + m];
      return;
    }
    if (p === 1) {
      for (m = 0; m < _; m++)
        i[b + m] = i[w + m];
      i[b + _] = o[y];
      return;
    }
    for (var v = e, x, T, S; ; ) {
      x = 0, T = 0, S = !1;
      do
        if (t(i[w], o[y]) < 0) {
          if (i[b++] = i[w++], T++, x = 0, --_ === 0) {
            S = !0;
            break;
          }
        } else if (i[b++] = o[y++], x++, T = 0, --p === 1) {
          S = !0;
          break;
        }
      while ((x | T) < v);
      if (S)
        break;
      do {
        if (x = is(i[w], o, y, p, 0, t), x !== 0) {
          for (m = 0; m < x; m++)
            i[b + m] = o[y + m];
          if (b += x, y += x, p -= x, p <= 1) {
            S = !0;
            break;
          }
        }
        if (i[b++] = i[w++], --_ === 0) {
          S = !0;
          break;
        }
        if (T = es(o[y], i, w, _, 0, t), T !== 0) {
          for (m = 0; m < T; m++)
            i[b + m] = i[w + m];
          if (b += T, w += T, _ -= T, _ === 0) {
            S = !0;
            break;
          }
        }
        if (i[b++] = o[y++], --p === 1) {
          S = !0;
          break;
        }
        v--;
      } while (x >= di || T >= di);
      if (S)
        break;
      v < 0 && (v = 0), v += 2;
    }
    if (e = v, e < 1 && (e = 1), p === 1) {
      for (m = 0; m < _; m++)
        i[b + m] = i[w + m];
      i[b + _] = o[y];
    } else {
      if (p === 0)
        throw new Error();
      for (m = 0; m < p; m++)
        i[b + m] = o[y + m];
    }
  }
  function u(d, p, g, _) {
    var m = 0;
    for (m = 0; m < _; m++)
      o[m] = i[g + m];
    var y = d + p - 1, w = _ - 1, b = g + _ - 1, v = 0, x = 0;
    if (i[b--] = i[y--], --p === 0) {
      for (v = b - (_ - 1), m = 0; m < _; m++)
        i[v + m] = o[m];
      return;
    }
    if (_ === 1) {
      for (b -= p, y -= p, x = b + 1, v = y + 1, m = p - 1; m >= 0; m--)
        i[x + m] = i[v + m];
      i[b] = o[w];
      return;
    }
    for (var T = e; ; ) {
      var S = 0, C = 0, P = !1;
      do
        if (t(o[w], i[y]) < 0) {
          if (i[b--] = i[y--], S++, C = 0, --p === 0) {
            P = !0;
            break;
          }
        } else if (i[b--] = o[w--], C++, S = 0, --_ === 1) {
          P = !0;
          break;
        }
      while ((S | C) < T);
      if (P)
        break;
      do {
        if (S = p - is(o[w], i, d, p, p - 1, t), S !== 0) {
          for (b -= S, y -= S, p -= S, x = b + 1, v = y + 1, m = S - 1; m >= 0; m--)
            i[x + m] = i[v + m];
          if (p === 0) {
            P = !0;
            break;
          }
        }
        if (i[b--] = o[w--], --_ === 1) {
          P = !0;
          break;
        }
        if (C = _ - es(i[y], o, 0, _, _ - 1, t), C !== 0) {
          for (b -= C, w -= C, _ -= C, x = b + 1, v = w + 1, m = 0; m < C; m++)
            i[x + m] = o[v + m];
          if (_ <= 1) {
            P = !0;
            break;
          }
        }
        if (i[b--] = i[y--], --p === 0) {
          P = !0;
          break;
        }
        T--;
      } while (S >= di || C >= di);
      if (P)
        break;
      T < 0 && (T = 0), T += 2;
    }
    if (e = T, e < 1 && (e = 1), _ === 1) {
      for (b -= p, y -= p, x = b + 1, v = y + 1, m = p - 1; m >= 0; m--)
        i[x + m] = i[v + m];
      i[b] = o[w];
    } else {
      if (_ === 0)
        throw new Error();
      for (v = b - (_ - 1), m = 0; m < _; m++)
        i[v + m] = o[m];
    }
  }
  return {
    mergeRuns: a,
    forceMergeRuns: c,
    pushRun: l
  };
}
function Rh(i, t, e, n) {
  e || (e = 0), n || (n = i.length);
  var s = n - e;
  if (!(s < 2)) {
    var r = 0;
    if (s < ra) {
      r = so(i, e, n, t), ro(i, e, n, e + r, t);
      return;
    }
    var o = Dh(i, t), l = Ah(s);
    do {
      if (r = so(i, e, n, t), r < l) {
        var a = s;
        a > l && (a = l), ro(i, e, e + a, e + r, t), r = a;
      }
      o.pushRun(e, r), o.mergeRuns(), s -= r, e += r;
    } while (s !== 0);
    o.forceMergeRuns();
  }
}
const ut = 1, wi = 2, Ue = 4;
let oo = !1;
function ns() {
  oo || (oo = !0, console.warn("z / z2 / zlevel of displayable is invalid, which may cause unexpected errors"));
}
function lo(i, t) {
  return i.zlevel === t.zlevel ? i.z === t.z ? i.z2 - t.z2 : i.z - t.z : i.zlevel - t.zlevel;
}
class Ih {
  _roots = [];
  _displayList = [];
  _displayListLen = 0;
  traverse(t, e) {
    for (let n = 0; n < this._roots.length; n++)
      this._roots[n].traverse(t, e);
  }
  /**
   * get a list of elements to be rendered
   *
   * @param {boolean} update whether to update elements before return
   * @param {DisplayParams} params options
   * @return {Displayable[]} a list of elements
   */
  getDisplayList(t, e) {
    e = e || !1;
    const n = this._displayList;
    return (t || !n.length) && this.updateDisplayList(e), n;
  }
  /**
   * 更新图形的绘制队列。
   * 每次绘制前都会调用，该方法会先深度优先遍历整个树，更新所有Group和Shape的变换并且把所有可见的Shape保存到数组中，
   * 最后根据绘制的优先级（zlevel > z > 插入顺序）排序得到绘制队列
   */
  updateDisplayList(t) {
    this._displayListLen = 0;
    const e = this._roots, n = this._displayList;
    for (let s = 0, r = e.length; s < r; s++)
      this._updateAndAddDisplayable(e[s], null, t);
    n.length = this._displayListLen, Rh(n, lo);
  }
  _updateAndAddDisplayable(t, e, n) {
    if (t.ignore && !n)
      return;
    t.beforeUpdate(), t.update(), t.afterUpdate();
    const s = t.getClipPath(), r = e && e.length;
    let o = 0, l = t.__clipPaths;
    if (!t.ignoreClip && (r || s)) {
      if (l || (l = t.__clipPaths = []), r)
        for (let d = 0; d < e.length; d++)
          l[o++] = e[d];
      let f = s, u = t;
      for (; f; )
        f.parent = u, f.updateTransform(), l[o++] = f, u = f, f = f.getClipPath();
    }
    if (l && (l.length = o), t.childrenRef) {
      const f = t.childrenRef();
      for (let u = 0; u < f.length; u++) {
        const d = f[u];
        t.__dirty && (d.__dirty |= ut), this._updateAndAddDisplayable(d, l, n);
      }
      t.__dirty = 0;
    } else {
      const f = t;
      isNaN(f.z) && (ns(), f.z = 0), isNaN(f.z2) && (ns(), f.z2 = 0), isNaN(f.zlevel) && (ns(), f.zlevel = 0), this._displayList[this._displayListLen++] = f;
    }
    const a = t.getDecalElement && t.getDecalElement();
    a && this._updateAndAddDisplayable(a, l, n);
    const c = t.getTextGuideLine();
    c && this._updateAndAddDisplayable(c, l, n);
    const h = t.getTextContent();
    h && this._updateAndAddDisplayable(h, l, n);
  }
  /**
   * 添加图形(Displayable)或者组(Group)到根节点
   */
  addRoot(t) {
    t.__zr && t.__zr.storage === this || this._roots.push(t);
  }
  /**
   * 删除指定的图形(Displayable)或者组(Group)
   * @param el
   */
  delRoot(t) {
    if (t instanceof Array) {
      for (let n = 0, s = t.length; n < s; n++)
        this.delRoot(t[n]);
      return;
    }
    const e = Tt(this._roots, t);
    e >= 0 && this._roots.splice(e, 1);
  }
  delAllRoots() {
    this._roots = [], this._displayList = [], this._displayListLen = 0;
  }
  getRoots() {
    return this._roots;
  }
  /**
   * 清空并且释放Storage
   */
  dispose() {
    this._displayList = null, this._roots = null;
  }
  displayableSortFunc = lo;
}
let oa;
oa = G.hasGlobalWindow && (window.requestAnimationFrame && window.requestAnimationFrame.bind(window) || window.msRequestAnimationFrame && window.msRequestAnimationFrame.bind(window) || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame) || function(i) {
  return setTimeout(i, 16);
};
const Vs = oa, ki = {
  /**
  * @param {number} k
  * @return {number}
  */
  linear(i) {
    return i;
  },
  /**
  * @param {number} k
  * @return {number}
  */
  quadraticIn(i) {
    return i * i;
  },
  /**
  * @param {number} k
  * @return {number}
  */
  quadraticOut(i) {
    return i * (2 - i);
  },
  /**
  * @param {number} k
  * @return {number}
  */
  quadraticInOut(i) {
    return (i *= 2) < 1 ? 0.5 * i * i : -0.5 * (--i * (i - 2) - 1);
  },
  // 三次方的缓动（t^3）
  /**
  * @param {number} k
  * @return {number}
  */
  cubicIn(i) {
    return i * i * i;
  },
  /**
  * @param {number} k
  * @return {number}
  */
  cubicOut(i) {
    return --i * i * i + 1;
  },
  /**
  * @param {number} k
  * @return {number}
  */
  cubicInOut(i) {
    return (i *= 2) < 1 ? 0.5 * i * i * i : 0.5 * ((i -= 2) * i * i + 2);
  },
  // 四次方的缓动（t^4）
  /**
  * @param {number} k
  * @return {number}
  */
  quarticIn(i) {
    return i * i * i * i;
  },
  /**
  * @param {number} k
  * @return {number}
  */
  quarticOut(i) {
    return 1 - --i * i * i * i;
  },
  /**
  * @param {number} k
  * @return {number}
  */
  quarticInOut(i) {
    return (i *= 2) < 1 ? 0.5 * i * i * i * i : -0.5 * ((i -= 2) * i * i * i - 2);
  },
  // 五次方的缓动（t^5）
  /**
  * @param {number} k
  * @return {number}
  */
  quinticIn(i) {
    return i * i * i * i * i;
  },
  /**
  * @param {number} k
  * @return {number}
  */
  quinticOut(i) {
    return --i * i * i * i * i + 1;
  },
  /**
  * @param {number} k
  * @return {number}
  */
  quinticInOut(i) {
    return (i *= 2) < 1 ? 0.5 * i * i * i * i * i : 0.5 * ((i -= 2) * i * i * i * i + 2);
  },
  // 正弦曲线的缓动（sin(t)）
  /**
  * @param {number} k
  * @return {number}
  */
  sinusoidalIn(i) {
    return 1 - Math.cos(i * Math.PI / 2);
  },
  /**
  * @param {number} k
  * @return {number}
  */
  sinusoidalOut(i) {
    return Math.sin(i * Math.PI / 2);
  },
  /**
  * @param {number} k
  * @return {number}
  */
  sinusoidalInOut(i) {
    return 0.5 * (1 - Math.cos(Math.PI * i));
  },
  // 指数曲线的缓动（2^t）
  /**
  * @param {number} k
  * @return {number}
  */
  exponentialIn(i) {
    return i === 0 ? 0 : Math.pow(1024, i - 1);
  },
  /**
  * @param {number} k
  * @return {number}
  */
  exponentialOut(i) {
    return i === 1 ? 1 : 1 - Math.pow(2, -10 * i);
  },
  /**
  * @param {number} k
  * @return {number}
  */
  exponentialInOut(i) {
    return i === 0 ? 0 : i === 1 ? 1 : (i *= 2) < 1 ? 0.5 * Math.pow(1024, i - 1) : 0.5 * (-Math.pow(2, -10 * (i - 1)) + 2);
  },
  // 圆形曲线的缓动（sqrt(1-t^2)）
  /**
  * @param {number} k
  * @return {number}
  */
  circularIn(i) {
    return 1 - Math.sqrt(1 - i * i);
  },
  /**
  * @param {number} k
  * @return {number}
  */
  circularOut(i) {
    return Math.sqrt(1 - --i * i);
  },
  /**
  * @param {number} k
  * @return {number}
  */
  circularInOut(i) {
    return (i *= 2) < 1 ? -0.5 * (Math.sqrt(1 - i * i) - 1) : 0.5 * (Math.sqrt(1 - (i -= 2) * i) + 1);
  },
  // 创建类似于弹簧在停止前来回振荡的动画
  /**
  * @param {number} k
  * @return {number}
  */
  elasticIn(i) {
    let t, e = 0.1, n = 0.4;
    return i === 0 ? 0 : i === 1 ? 1 : (!e || e < 1 ? (e = 1, t = n / 4) : t = n * Math.asin(1 / e) / (2 * Math.PI), -(e * Math.pow(2, 10 * (i -= 1)) * Math.sin((i - t) * (2 * Math.PI) / n)));
  },
  /**
  * @param {number} k
  * @return {number}
  */
  elasticOut(i) {
    let t, e = 0.1, n = 0.4;
    return i === 0 ? 0 : i === 1 ? 1 : (!e || e < 1 ? (e = 1, t = n / 4) : t = n * Math.asin(1 / e) / (2 * Math.PI), e * Math.pow(2, -10 * i) * Math.sin((i - t) * (2 * Math.PI) / n) + 1);
  },
  /**
  * @param {number} k
  * @return {number}
  */
  elasticInOut(i) {
    let t, e = 0.1, n = 0.4;
    return i === 0 ? 0 : i === 1 ? 1 : (!e || e < 1 ? (e = 1, t = n / 4) : t = n * Math.asin(1 / e) / (2 * Math.PI), (i *= 2) < 1 ? -0.5 * (e * Math.pow(2, 10 * (i -= 1)) * Math.sin((i - t) * (2 * Math.PI) / n)) : e * Math.pow(2, -10 * (i -= 1)) * Math.sin((i - t) * (2 * Math.PI) / n) * 0.5 + 1);
  },
  // 在某一动画开始沿指示的路径进行动画处理前稍稍收回该动画的移动
  /**
  * @param {number} k
  * @return {number}
  */
  backIn(i) {
    let t = 1.70158;
    return i * i * ((t + 1) * i - t);
  },
  /**
  * @param {number} k
  * @return {number}
  */
  backOut(i) {
    let t = 1.70158;
    return --i * i * ((t + 1) * i + t) + 1;
  },
  /**
  * @param {number} k
  * @return {number}
  */
  backInOut(i) {
    let t = 2.5949095;
    return (i *= 2) < 1 ? 0.5 * (i * i * ((t + 1) * i - t)) : 0.5 * ((i -= 2) * i * ((t + 1) * i + t) + 2);
  },
  // 创建弹跳效果
  /**
  * @param {number} k
  * @return {number}
  */
  bounceIn(i) {
    return 1 - ki.bounceOut(1 - i);
  },
  /**
  * @param {number} k
  * @return {number}
  */
  bounceOut(i) {
    return i < 1 / 2.75 ? 7.5625 * i * i : i < 2 / 2.75 ? 7.5625 * (i -= 1.5 / 2.75) * i + 0.75 : i < 2.5 / 2.75 ? 7.5625 * (i -= 2.25 / 2.75) * i + 0.9375 : 7.5625 * (i -= 2.625 / 2.75) * i + 0.984375;
  },
  /**
  * @param {number} k
  * @return {number}
  */
  bounceInOut(i) {
    return i < 0.5 ? ki.bounceIn(i * 2) * 0.5 : ki.bounceOut(i * 2 - 1) * 0.5 + 0.5;
  }
}, Vi = Math.pow, Qt = Math.sqrt, An = 1e-8, la = 1e-4, ao = Qt(3), Ui = 1 / 3, It = Fe(), mt = Fe(), ri = Fe();
function Ut(i) {
  return i > -An && i < An;
}
function aa(i) {
  return i > An || i < -An;
}
function it(i, t, e, n, s) {
  const r = 1 - s;
  return r * r * (r * i + 3 * s * t) + s * s * (s * n + 3 * r * e);
}
function co(i, t, e, n, s) {
  const r = 1 - s;
  return 3 * (((t - i) * r + 2 * (e - t) * s) * r + (n - e) * s * s);
}
function ca(i, t, e, n, s, r) {
  const o = n + 3 * (t - e) - i, l = 3 * (e - t * 2 + i), a = 3 * (t - i), c = i - s, h = l * l - 3 * o * a, f = l * a - 9 * o * c, u = a * a - 3 * l * c;
  let d = 0;
  if (Ut(h) && Ut(f))
    if (Ut(l))
      r[0] = 0;
    else {
      const p = -a / l;
      p >= 0 && p <= 1 && (r[d++] = p);
    }
  else {
    const p = f * f - 4 * h * u;
    if (Ut(p)) {
      const g = f / h, _ = -l / o + g, m = -g / 2;
      _ >= 0 && _ <= 1 && (r[d++] = _), m >= 0 && m <= 1 && (r[d++] = m);
    } else if (p > 0) {
      const g = Qt(p);
      let _ = h * l + 1.5 * o * (-f + g), m = h * l + 1.5 * o * (-f - g);
      _ < 0 ? _ = -Vi(-_, Ui) : _ = Vi(_, Ui), m < 0 ? m = -Vi(-m, Ui) : m = Vi(m, Ui);
      const y = (-l - (_ + m)) / (3 * o);
      y >= 0 && y <= 1 && (r[d++] = y);
    } else {
      const g = (2 * h * l - 3 * o * f) / (2 * Qt(h * h * h)), _ = Math.acos(g) / 3, m = Qt(h), y = Math.cos(_), w = (-l - 2 * m * y) / (3 * o), b = (-l + m * (y + ao * Math.sin(_))) / (3 * o), v = (-l + m * (y - ao * Math.sin(_))) / (3 * o);
      w >= 0 && w <= 1 && (r[d++] = w), b >= 0 && b <= 1 && (r[d++] = b), v >= 0 && v <= 1 && (r[d++] = v);
    }
  }
  return d;
}
function ha(i, t, e, n, s) {
  const r = 6 * e - 12 * t + 6 * i, o = 9 * t + 3 * n - 3 * i - 9 * e, l = 3 * t - 3 * i;
  let a = 0;
  if (Ut(o)) {
    if (aa(r)) {
      const c = -l / r;
      c >= 0 && c <= 1 && (s[a++] = c);
    }
  } else {
    const c = r * r - 4 * o * l;
    if (Ut(c))
      s[0] = -r / (2 * o);
    else if (c > 0) {
      const h = Qt(c), f = (-r + h) / (2 * o), u = (-r - h) / (2 * o);
      f >= 0 && f <= 1 && (s[a++] = f), u >= 0 && u <= 1 && (s[a++] = u);
    }
  }
  return a;
}
function te(i, t, e, n, s, r) {
  const o = (t - i) * s + i, l = (e - t) * s + t, a = (n - e) * s + e, c = (l - o) * s + o, h = (a - l) * s + l, f = (h - c) * s + c;
  r[0] = i, r[1] = o, r[2] = c, r[3] = f, r[4] = f, r[5] = h, r[6] = a, r[7] = n;
}
function Eh(i, t, e, n, s, r, o, l, a, c, h) {
  let f, u = 5e-3, d = 1 / 0, p, g, _, m;
  It[0] = a, It[1] = c;
  for (let y = 0; y < 1; y += 0.05)
    mt[0] = it(i, e, s, o, y), mt[1] = it(t, n, r, l, y), _ = Ie(It, mt), _ < d && (f = y, d = _);
  d = 1 / 0;
  for (let y = 0; y < 32 && !(u < la); y++)
    p = f - u, g = f + u, mt[0] = it(i, e, s, o, p), mt[1] = it(t, n, r, l, p), _ = Ie(mt, It), p >= 0 && _ < d ? (f = p, d = _) : (ri[0] = it(i, e, s, o, g), ri[1] = it(t, n, r, l, g), m = Ie(ri, It), g <= 1 && m < d ? (f = g, d = m) : u *= 0.5);
  return Qt(d);
}
function Oh(i, t, e, n, s, r, o, l, a) {
  let c = i, h = t, f = 0;
  const u = 1 / a;
  for (let d = 1; d <= a; d++) {
    let p = d * u;
    const g = it(i, e, s, o, p), _ = it(t, n, r, l, p), m = g - c, y = _ - h;
    f += Math.sqrt(m * m + y * y), c = g, h = _;
  }
  return f;
}
function rt(i, t, e, n) {
  const s = 1 - n;
  return s * (s * i + 2 * n * t) + n * n * e;
}
function ho(i, t, e, n) {
  return 2 * ((1 - n) * (t - i) + n * (e - t));
}
function Fh(i, t, e, n, s) {
  const r = i - 2 * t + e, o = 2 * (t - i), l = i - n;
  let a = 0;
  if (Ut(r)) {
    if (aa(o)) {
      const c = -l / o;
      c >= 0 && c <= 1 && (s[a++] = c);
    }
  } else {
    const c = o * o - 4 * r * l;
    if (Ut(c)) {
      const h = -o / (2 * r);
      h >= 0 && h <= 1 && (s[a++] = h);
    } else if (c > 0) {
      const h = Qt(c), f = (-o + h) / (2 * r), u = (-o - h) / (2 * r);
      f >= 0 && f <= 1 && (s[a++] = f), u >= 0 && u <= 1 && (s[a++] = u);
    }
  }
  return a;
}
function fa(i, t, e) {
  const n = i + e - 2 * t;
  return n === 0 ? 0.5 : (i - t) / n;
}
function Ln(i, t, e, n, s) {
  const r = (t - i) * n + i, o = (e - t) * n + t, l = (o - r) * n + r;
  s[0] = i, s[1] = r, s[2] = l, s[3] = l, s[4] = o, s[5] = e;
}
function zh(i, t, e, n, s, r, o, l, a) {
  let c, h = 5e-3, f = 1 / 0;
  It[0] = o, It[1] = l;
  for (let u = 0; u < 1; u += 0.05) {
    mt[0] = rt(i, e, s, u), mt[1] = rt(t, n, r, u);
    const d = Ie(It, mt);
    d < f && (c = u, f = d);
  }
  f = 1 / 0;
  for (let u = 0; u < 32 && !(h < la); u++) {
    const d = c - h, p = c + h;
    mt[0] = rt(i, e, s, d), mt[1] = rt(t, n, r, d);
    const g = Ie(mt, It);
    if (d >= 0 && g < f)
      c = d, f = g;
    else {
      ri[0] = rt(i, e, s, p), ri[1] = rt(t, n, r, p);
      const _ = Ie(ri, It);
      p <= 1 && _ < f ? (c = p, f = _) : h *= 0.5;
    }
  }
  return Qt(f);
}
function Nh(i, t, e, n, s, r, o) {
  let l = i, a = t, c = 0;
  const h = 1 / o;
  for (let f = 1; f <= o; f++) {
    let u = f * h;
    const d = rt(i, e, s, u), p = rt(t, n, r, u), g = d - l, _ = p - a;
    c += Math.sqrt(g * g + _ * _), l = d, a = p;
  }
  return c;
}
const Bh = /cubic-bezier\(([0-9,\.e ]+)\)/;
function Or(i) {
  const t = i && Bh.exec(i);
  if (t) {
    const e = t[1].split(","), n = +Pe(e[0]), s = +Pe(e[1]), r = +Pe(e[2]), o = +Pe(e[3]);
    if (isNaN(n + s + r + o))
      return;
    const l = [];
    return (a) => a <= 0 ? 0 : a >= 1 ? 1 : ca(0, n, r, 1, a, l) && it(0, s, o, 1, l[0]);
  }
}
class Hh {
  _life;
  _delay;
  _inited = !1;
  _startTime = 0;
  // 开始时间单位毫秒
  _pausedTime = 0;
  _paused = !1;
  animation;
  loop;
  easing;
  easingFunc;
  // For linked list. Readonly
  next;
  prev;
  onframe;
  ondestroy;
  onrestart;
  constructor(t) {
    this._life = t.life || 1e3, this._delay = t.delay || 0, this.loop = t.loop || !1, this.onframe = t.onframe || jt, this.ondestroy = t.ondestroy || jt, this.onrestart = t.onrestart || jt, t.easing && this.setEasing(t.easing);
  }
  step(t, e) {
    if (this._inited || (this._startTime = t + this._delay, this._inited = !0), this._paused) {
      this._pausedTime += e;
      return;
    }
    const n = this._life;
    let s = t - this._startTime - this._pausedTime, r = s / n;
    r < 0 && (r = 0), r = Math.min(r, 1);
    const o = this.easingFunc, l = o ? o(r) : r;
    if (this.onframe(l), r === 1)
      if (this.loop) {
        const a = s % n;
        this._startTime = t - a, this._pausedTime = 0, this.onrestart();
      } else
        return !0;
    return !1;
  }
  pause() {
    this._paused = !0;
  }
  resume() {
    this._paused = !1;
  }
  setEasing(t) {
    this.easing = t, this.easingFunc = Bt(t) ? t : ki[t] || Or(t);
  }
}
class ua {
  value;
  key;
  next;
  prev;
  constructor(t) {
    this.value = t;
  }
}
class Wh {
  head;
  tail;
  _len = 0;
  /**
   * Insert a new value at the tail
   */
  insert(t) {
    const e = new ua(t);
    return this.insertEntry(e), e;
  }
  /**
   * Insert an entry at the tail
   */
  insertEntry(t) {
    this.head ? (this.tail.next = t, t.prev = this.tail, t.next = null, this.tail = t) : this.head = this.tail = t, this._len++;
  }
  /**
   * Remove entry.
   */
  remove(t) {
    const e = t.prev, n = t.next;
    e ? e.next = n : this.head = n, n ? n.prev = e : this.tail = e, t.next = t.prev = null, this._len--;
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
class Di {
  _list = new Wh();
  _maxSize = 10;
  _lastRemovedEntry;
  _map = {};
  constructor(t) {
    this._maxSize = t;
  }
  /**
   * @return Removed value
   */
  put(t, e) {
    const n = this._list, s = this._map;
    let r = null;
    if (s[t] == null) {
      const o = n.len();
      let l = this._lastRemovedEntry;
      if (o >= this._maxSize && o > 0) {
        const a = n.head;
        n.remove(a), delete s[a.key], r = a.value, this._lastRemovedEntry = a;
      }
      l ? l.value = e : l = new ua(e), l.key = t, n.insertEntry(l), s[t] = l;
    }
    return r;
  }
  get(t) {
    const e = this._map[t], n = this._list;
    if (e != null)
      return e !== n.tail && (n.remove(e), n.insertEntry(e)), e.value;
  }
  /**
   * Clear the cache
   */
  clear() {
    this._list.clear(), this._map = {};
  }
  len() {
    return this._list.len();
  }
}
const fo = {
  transparent: [0, 0, 0, 0],
  aliceblue: [240, 248, 255, 1],
  antiquewhite: [250, 235, 215, 1],
  aqua: [0, 255, 255, 1],
  aquamarine: [127, 255, 212, 1],
  azure: [240, 255, 255, 1],
  beige: [245, 245, 220, 1],
  bisque: [255, 228, 196, 1],
  black: [0, 0, 0, 1],
  blanchedalmond: [255, 235, 205, 1],
  blue: [0, 0, 255, 1],
  blueviolet: [138, 43, 226, 1],
  brown: [165, 42, 42, 1],
  burlywood: [222, 184, 135, 1],
  cadetblue: [95, 158, 160, 1],
  chartreuse: [127, 255, 0, 1],
  chocolate: [210, 105, 30, 1],
  coral: [255, 127, 80, 1],
  cornflowerblue: [100, 149, 237, 1],
  cornsilk: [255, 248, 220, 1],
  crimson: [220, 20, 60, 1],
  cyan: [0, 255, 255, 1],
  darkblue: [0, 0, 139, 1],
  darkcyan: [0, 139, 139, 1],
  darkgoldenrod: [184, 134, 11, 1],
  darkgray: [169, 169, 169, 1],
  darkgreen: [0, 100, 0, 1],
  darkgrey: [169, 169, 169, 1],
  darkkhaki: [189, 183, 107, 1],
  darkmagenta: [139, 0, 139, 1],
  darkolivegreen: [85, 107, 47, 1],
  darkorange: [255, 140, 0, 1],
  darkorchid: [153, 50, 204, 1],
  darkred: [139, 0, 0, 1],
  darksalmon: [233, 150, 122, 1],
  darkseagreen: [143, 188, 143, 1],
  darkslateblue: [72, 61, 139, 1],
  darkslategray: [47, 79, 79, 1],
  darkslategrey: [47, 79, 79, 1],
  darkturquoise: [0, 206, 209, 1],
  darkviolet: [148, 0, 211, 1],
  deeppink: [255, 20, 147, 1],
  deepskyblue: [0, 191, 255, 1],
  dimgray: [105, 105, 105, 1],
  dimgrey: [105, 105, 105, 1],
  dodgerblue: [30, 144, 255, 1],
  firebrick: [178, 34, 34, 1],
  floralwhite: [255, 250, 240, 1],
  forestgreen: [34, 139, 34, 1],
  fuchsia: [255, 0, 255, 1],
  gainsboro: [220, 220, 220, 1],
  ghostwhite: [248, 248, 255, 1],
  gold: [255, 215, 0, 1],
  goldenrod: [218, 165, 32, 1],
  gray: [128, 128, 128, 1],
  green: [0, 128, 0, 1],
  greenyellow: [173, 255, 47, 1],
  grey: [128, 128, 128, 1],
  honeydew: [240, 255, 240, 1],
  hotpink: [255, 105, 180, 1],
  indianred: [205, 92, 92, 1],
  indigo: [75, 0, 130, 1],
  ivory: [255, 255, 240, 1],
  khaki: [240, 230, 140, 1],
  lavender: [230, 230, 250, 1],
  lavenderblush: [255, 240, 245, 1],
  lawngreen: [124, 252, 0, 1],
  lemonchiffon: [255, 250, 205, 1],
  lightblue: [173, 216, 230, 1],
  lightcoral: [240, 128, 128, 1],
  lightcyan: [224, 255, 255, 1],
  lightgoldenrodyellow: [250, 250, 210, 1],
  lightgray: [211, 211, 211, 1],
  lightgreen: [144, 238, 144, 1],
  lightgrey: [211, 211, 211, 1],
  lightpink: [255, 182, 193, 1],
  lightsalmon: [255, 160, 122, 1],
  lightseagreen: [32, 178, 170, 1],
  lightskyblue: [135, 206, 250, 1],
  lightslategray: [119, 136, 153, 1],
  lightslategrey: [119, 136, 153, 1],
  lightsteelblue: [176, 196, 222, 1],
  lightyellow: [255, 255, 224, 1],
  lime: [0, 255, 0, 1],
  limegreen: [50, 205, 50, 1],
  linen: [250, 240, 230, 1],
  magenta: [255, 0, 255, 1],
  maroon: [128, 0, 0, 1],
  mediumaquamarine: [102, 205, 170, 1],
  mediumblue: [0, 0, 205, 1],
  mediumorchid: [186, 85, 211, 1],
  mediumpurple: [147, 112, 219, 1],
  mediumseagreen: [60, 179, 113, 1],
  mediumslateblue: [123, 104, 238, 1],
  mediumspringgreen: [0, 250, 154, 1],
  mediumturquoise: [72, 209, 204, 1],
  mediumvioletred: [199, 21, 133, 1],
  midnightblue: [25, 25, 112, 1],
  mintcream: [245, 255, 250, 1],
  mistyrose: [255, 228, 225, 1],
  moccasin: [255, 228, 181, 1],
  navajowhite: [255, 222, 173, 1],
  navy: [0, 0, 128, 1],
  oldlace: [253, 245, 230, 1],
  olive: [128, 128, 0, 1],
  olivedrab: [107, 142, 35, 1],
  orange: [255, 165, 0, 1],
  orangered: [255, 69, 0, 1],
  orchid: [218, 112, 214, 1],
  palegoldenrod: [238, 232, 170, 1],
  palegreen: [152, 251, 152, 1],
  paleturquoise: [175, 238, 238, 1],
  palevioletred: [219, 112, 147, 1],
  papayawhip: [255, 239, 213, 1],
  peachpuff: [255, 218, 185, 1],
  peru: [205, 133, 63, 1],
  pink: [255, 192, 203, 1],
  plum: [221, 160, 221, 1],
  powderblue: [176, 224, 230, 1],
  purple: [128, 0, 128, 1],
  red: [255, 0, 0, 1],
  rosybrown: [188, 143, 143, 1],
  royalblue: [65, 105, 225, 1],
  saddlebrown: [139, 69, 19, 1],
  salmon: [250, 128, 114, 1],
  sandybrown: [244, 164, 96, 1],
  seagreen: [46, 139, 87, 1],
  seashell: [255, 245, 238, 1],
  sienna: [160, 82, 45, 1],
  silver: [192, 192, 192, 1],
  skyblue: [135, 206, 235, 1],
  slateblue: [106, 90, 205, 1],
  slategray: [112, 128, 144, 1],
  slategrey: [112, 128, 144, 1],
  snow: [255, 250, 250, 1],
  springgreen: [0, 255, 127, 1],
  steelblue: [70, 130, 180, 1],
  tan: [210, 180, 140, 1],
  teal: [0, 128, 128, 1],
  thistle: [216, 191, 216, 1],
  tomato: [255, 99, 71, 1],
  turquoise: [64, 224, 208, 1],
  violet: [238, 130, 238, 1],
  wheat: [245, 222, 179, 1],
  white: [255, 255, 255, 1],
  whitesmoke: [245, 245, 245, 1],
  yellow: [255, 255, 0, 1],
  yellowgreen: [154, 205, 50, 1]
};
function bt(i) {
  return i = Math.round(i), i < 0 ? 0 : i > 255 ? 255 : i;
}
function Yh(i) {
  return i = Math.round(i), i < 0 ? 0 : i > 360 ? 360 : i;
}
function Ri(i) {
  return i < 0 ? 0 : i > 1 ? 1 : i;
}
function xn(i) {
  let t = i;
  return t.length && t.charAt(t.length - 1) === "%" ? bt(parseFloat(t) / 100 * 255) : bt(parseInt(t, 10));
}
function Ht(i) {
  let t = i;
  return t.length && t.charAt(t.length - 1) === "%" ? Ri(parseFloat(t) / 100) : Ri(parseFloat(t));
}
function ss(i, t, e) {
  return e < 0 ? e += 1 : e > 1 && (e -= 1), e * 6 < 1 ? i + (t - i) * e * 6 : e * 2 < 1 ? t : e * 3 < 2 ? i + (t - i) * (2 / 3 - e) * 6 : i;
}
function qt(i, t, e) {
  return i + (t - i) * e;
}
function gt(i, t, e, n, s) {
  return i[0] = t, i[1] = e, i[2] = n, i[3] = s, i;
}
function Us(i, t) {
  return i[0] = t[0], i[1] = t[1], i[2] = t[2], i[3] = t[3], i;
}
const da = new Di(20);
let qi = null;
function He(i, t) {
  qi && Us(qi, t), qi = da.put(i, qi || t.slice());
}
function ct(i, t) {
  if (!i)
    return;
  t = t || [];
  let e = da.get(i);
  if (e)
    return Us(t, e);
  i = i + "";
  let n = i.replace(/ /g, "").toLowerCase();
  if (n in fo)
    return Us(t, fo[n]), He(i, t), t;
  const s = n.length;
  if (n.charAt(0) === "#") {
    if (s === 4 || s === 5) {
      const l = parseInt(n.slice(1, 4), 16);
      if (!(l >= 0 && l <= 4095)) {
        gt(t, 0, 0, 0, 1);
        return;
      }
      return gt(
        t,
        (l & 3840) >> 4 | (l & 3840) >> 8,
        l & 240 | (l & 240) >> 4,
        l & 15 | (l & 15) << 4,
        s === 5 ? parseInt(n.slice(4), 16) / 15 : 1
      ), He(i, t), t;
    } else if (s === 7 || s === 9) {
      const l = parseInt(n.slice(1, 7), 16);
      if (!(l >= 0 && l <= 16777215)) {
        gt(t, 0, 0, 0, 1);
        return;
      }
      return gt(
        t,
        (l & 16711680) >> 16,
        (l & 65280) >> 8,
        l & 255,
        s === 9 ? parseInt(n.slice(7), 16) / 255 : 1
      ), He(i, t), t;
    }
    return;
  }
  let r = n.indexOf("("), o = n.indexOf(")");
  if (r !== -1 && o + 1 === s) {
    let l = n.substr(0, r), a = n.substr(r + 1, o - (r + 1)).split(","), c = 1;
    switch (l) {
      case "rgba":
        if (a.length !== 4)
          return a.length === 3 ? gt(t, +a[0], +a[1], +a[2], 1) : gt(t, 0, 0, 0, 1);
        c = Ht(a.pop());
      // jshint ignore:line
      // Fall through.
      case "rgb":
        if (a.length >= 3)
          return gt(
            t,
            xn(a[0]),
            xn(a[1]),
            xn(a[2]),
            a.length === 3 ? c : Ht(a[3])
          ), He(i, t), t;
        gt(t, 0, 0, 0, 1);
        return;
      case "hsla":
        if (a.length !== 4) {
          gt(t, 0, 0, 0, 1);
          return;
        }
        return a[3] = Ht(a[3]), qs(a, t), He(i, t), t;
      case "hsl":
        if (a.length !== 3) {
          gt(t, 0, 0, 0, 1);
          return;
        }
        return qs(a, t), He(i, t), t;
      default:
        return;
    }
  }
  gt(t, 0, 0, 0, 1);
}
function qs(i, t) {
  const e = (parseFloat(i[0]) % 360 + 360) % 360 / 360, n = Ht(i[1]), s = Ht(i[2]), r = s <= 0.5 ? s * (n + 1) : s + n - s * n, o = s * 2 - r;
  return t = t || [], gt(
    t,
    bt(ss(o, r, e + 1 / 3) * 255),
    bt(ss(o, r, e) * 255),
    bt(ss(o, r, e - 1 / 3) * 255),
    1
  ), i.length === 4 && (t[3] = i[3]), t;
}
function Xh(i) {
  if (!i)
    return;
  const t = i[0] / 255, e = i[1] / 255, n = i[2] / 255, s = Math.min(t, e, n), r = Math.max(t, e, n), o = r - s, l = (r + s) / 2;
  let a, c;
  if (o === 0)
    a = 0, c = 0;
  else {
    l < 0.5 ? c = o / (r + s) : c = o / (2 - r - s);
    const f = ((r - t) / 6 + o / 2) / o, u = ((r - e) / 6 + o / 2) / o, d = ((r - n) / 6 + o / 2) / o;
    t === r ? a = d - u : e === r ? a = 1 / 3 + f - d : n === r && (a = 2 / 3 + u - f), a < 0 && (a += 1), a > 1 && (a -= 1);
  }
  const h = [a * 360, c, l];
  return i[3] != null && h.push(i[3]), h;
}
function Zs(i, t) {
  const e = ct(i);
  if (e) {
    for (let n = 0; n < 3; n++)
      t < 0 ? e[n] = e[n] * (1 - t) | 0 : e[n] = (255 - e[n]) * t + e[n] | 0, e[n] > 255 ? e[n] = 255 : e[n] < 0 && (e[n] = 0);
    return ie(e, e.length === 4 ? "rgba" : "rgb");
  }
}
function $h(i) {
  const t = ct(i);
  if (t)
    return ((1 << 24) + (t[0] << 16) + (t[1] << 8) + +t[2]).toString(16).slice(1);
}
function pa(i, t, e) {
  if (!(t && t.length) || !(i >= 0 && i <= 1))
    return;
  e = e || [];
  const n = i * (t.length - 1), s = Math.floor(n), r = Math.ceil(n), o = t[s], l = t[r], a = n - s;
  return e[0] = bt(qt(o[0], l[0], a)), e[1] = bt(qt(o[1], l[1], a)), e[2] = bt(qt(o[2], l[2], a)), e[3] = Ri(qt(o[3], l[3], a)), e;
}
const Gh = pa;
function ga(i, t, e) {
  if (!(t && t.length) || !(i >= 0 && i <= 1))
    return;
  const n = i * (t.length - 1), s = Math.floor(n), r = Math.ceil(n), o = ct(t[s]), l = ct(t[r]), a = n - s, c = ie(
    [
      bt(qt(o[0], l[0], a)),
      bt(qt(o[1], l[1], a)),
      bt(qt(o[2], l[2], a)),
      Ri(qt(o[3], l[3], a))
    ],
    "rgba"
  );
  return e ? {
    color: c,
    leftIndex: s,
    rightIndex: r,
    value: n
  } : c;
}
const Vh = ga;
function Uh(i, t, e, n) {
  let s = ct(i);
  if (i)
    return s = Xh(s), t != null && (s[0] = Yh(Bt(t) ? t(s[0]) : t)), e != null && (s[1] = Ht(Bt(e) ? e(s[1]) : e)), n != null && (s[2] = Ht(Bt(n) ? n(s[2]) : n)), ie(qs(s), "rgba");
}
function qh(i, t) {
  const e = ct(i);
  if (e && t != null)
    return e[3] = Ri(t), ie(e, "rgba");
}
function ie(i, t) {
  if (!i || !i.length)
    return;
  let e = i[0] + "," + i[1] + "," + i[2];
  return (t === "rgba" || t === "hsva" || t === "hsla") && (e += "," + i[3]), t + "(" + e + ")";
}
function Ii(i, t) {
  const e = ct(i);
  return e ? (0.299 * e[0] + 0.587 * e[1] + 0.114 * e[2]) * e[3] / 255 + (1 - e[3]) * t : 0;
}
function Zh() {
  return ie([
    Math.round(Math.random() * 255),
    Math.round(Math.random() * 255),
    Math.round(Math.random() * 255)
  ], "rgb");
}
const uo = new Di(100);
function _a(i) {
  if (vt(i)) {
    let t = uo.get(i);
    return t || (t = Zs(i, -0.1), uo.put(i, t)), t;
  } else if (Xi(i)) {
    const t = F({}, i);
    return t.colorStops = V(i.colorStops, (e) => ({
      offset: e.offset,
      color: Zs(e.color, -0.1)
    })), t;
  }
  return i;
}
const Fp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  fastLerp: pa,
  fastMapToColor: Gh,
  lerp: ga,
  lift: Zs,
  liftColor: _a,
  lum: Ii,
  mapToColor: Vh,
  modifyAlpha: qh,
  modifyHSL: Uh,
  parse: ct,
  parseCssFloat: Ht,
  parseCssInt: xn,
  random: Zh,
  stringify: ie,
  toHex: $h
}, Symbol.toStringTag, { value: "Module" })), Dn = Math.round;
function Ei(i) {
  let t;
  if (!i || i === "transparent")
    i = "none";
  else if (typeof i == "string" && i.indexOf("rgba") > -1) {
    const e = ct(i);
    e && (i = "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")", t = e[3]);
  }
  return {
    color: i,
    opacity: t ?? 1
  };
}
const po = 1e-4;
function Zt(i) {
  return i < po && i > -po;
}
function Zi(i) {
  return Dn(i * 1e3) / 1e3;
}
function js(i) {
  return Dn(i * 1e4) / 1e4;
}
function jh(i) {
  return "matrix(" + Zi(i[0]) + "," + Zi(i[1]) + "," + Zi(i[2]) + "," + Zi(i[3]) + "," + js(i[4]) + "," + js(i[5]) + ")";
}
const Kh = {
  left: "start",
  right: "end",
  center: "middle",
  middle: "middle"
};
function Qh(i, t, e) {
  return e === "top" ? i += t / 2 : e === "bottom" && (i -= t / 2), i;
}
function Jh(i) {
  return i && (i.shadowBlur || i.shadowOffsetX || i.shadowOffsetY);
}
function tf(i) {
  const t = i.style, e = i.getGlobalScale();
  return [
    t.shadowColor,
    (t.shadowBlur || 0).toFixed(2),
    // Reduce the precision
    (t.shadowOffsetX || 0).toFixed(2),
    (t.shadowOffsetY || 0).toFixed(2),
    e[0],
    e[1]
  ].join(",");
}
function ma(i) {
  return i && !!i.image;
}
function ef(i) {
  return i && !!i.svgElement;
}
function Fr(i) {
  return ma(i) || ef(i);
}
function ya(i) {
  return i.type === "linear";
}
function wa(i) {
  return i.type === "radial";
}
function xa(i) {
  return i && (i.type === "linear" || i.type === "radial");
}
function Gn(i) {
  return `url(#${i})`;
}
function Ta(i) {
  const t = i.getGlobalScale(), e = Math.max(t[0], t[1]);
  return Math.max(Math.ceil(Math.log(e) / Math.log(10)), 1);
}
function ba(i) {
  const t = i.x || 0, e = i.y || 0, n = (i.rotation || 0) * Ci, s = U(i.scaleX, 1), r = U(i.scaleY, 1), o = i.skewX || 0, l = i.skewY || 0, a = [];
  return (t || e) && a.push(`translate(${t}px,${e}px)`), n && a.push(`rotate(${n})`), (s !== 1 || r !== 1) && a.push(`scale(${s},${r})`), (o || l) && a.push(`skew(${Dn(o * Ci)}deg, ${Dn(l * Ci)}deg)`), a.join(" ");
}
const nf = function() {
  return G.hasGlobalWindow && Bt(window.btoa) ? function(i) {
    return window.btoa(unescape(encodeURIComponent(i)));
  } : typeof Buffer < "u" ? function(i) {
    return Buffer.from(i).toString("base64");
  } : function(i) {
    return process.env.NODE_ENV !== "production" && Ot("Base64 isn't natively supported in the current environment."), null;
  };
}(), Ks = Array.prototype.slice;
function Nt(i, t, e) {
  return (t - i) * e + i;
}
function rs(i, t, e, n) {
  const s = t.length;
  for (let r = 0; r < s; r++)
    i[r] = Nt(t[r], e[r], n);
  return i;
}
function sf(i, t, e, n) {
  const s = t.length, r = s && t[0].length;
  for (let o = 0; o < s; o++) {
    i[o] || (i[o] = []);
    for (let l = 0; l < r; l++)
      i[o][l] = Nt(t[o][l], e[o][l], n);
  }
  return i;
}
function ji(i, t, e, n) {
  const s = t.length;
  for (let r = 0; r < s; r++)
    i[r] = t[r] + e[r] * n;
  return i;
}
function go(i, t, e, n) {
  const s = t.length, r = s && t[0].length;
  for (let o = 0; o < s; o++) {
    i[o] || (i[o] = []);
    for (let l = 0; l < r; l++)
      i[o][l] = t[o][l] + e[o][l] * n;
  }
  return i;
}
function rf(i, t) {
  const e = i.length, n = t.length, s = e > n ? t : i, r = Math.min(e, n), o = s[r - 1] || { color: [0, 0, 0, 0], offset: 0 };
  for (let l = r; l < Math.max(e, n); l++)
    s.push({
      offset: o.offset,
      color: o.color.slice()
    });
}
function of(i, t, e) {
  let n = i, s = t;
  if (!n.push || !s.push)
    return;
  const r = n.length, o = s.length;
  if (r !== o)
    if (r > o)
      n.length = o;
    else
      for (let c = r; c < o; c++)
        n.push(e === 1 ? s[c] : Ks.call(s[c]));
  const l = n[0] && n[0].length;
  for (let a = 0; a < n.length; a++)
    if (e === 1)
      isNaN(n[a]) && (n[a] = s[a]);
    else
      for (let c = 0; c < l; c++)
        isNaN(n[a][c]) && (n[a][c] = s[a][c]);
}
function Tn(i) {
  if (St(i)) {
    const t = i.length;
    if (St(i[0])) {
      const e = [];
      for (let n = 0; n < t; n++)
        e.push(Ks.call(i[n]));
      return e;
    }
    return Ks.call(i);
  }
  return i;
}
function bn(i) {
  return i[0] = Math.floor(i[0]) || 0, i[1] = Math.floor(i[1]) || 0, i[2] = Math.floor(i[2]) || 0, i[3] = i[3] == null ? 1 : i[3], "rgba(" + i.join(",") + ")";
}
function lf(i) {
  return St(i && i[0]) ? 2 : 1;
}
const Ki = 0, Sn = 1, Sa = 2, xi = 3, Qs = 4, Js = 5, _o = 6;
function mo(i) {
  return i === Qs || i === Js;
}
function Qi(i) {
  return i === Sn || i === Sa;
}
let pi = [0, 0, 0, 0];
class af {
  keyframes = [];
  propName;
  valType;
  discrete = !1;
  _invalid = !1;
  _finished;
  _needsSort = !1;
  _additiveTrack;
  // Temporal storage for interpolated additive value.
  _additiveValue;
  // Info for run
  /**
   * Last frame
   */
  _lastFr = 0;
  /**
   * Percent of last frame.
   */
  _lastFrP = 0;
  constructor(t) {
    this.propName = t;
  }
  isFinished() {
    return this._finished;
  }
  setFinished() {
    this._finished = !0, this._additiveTrack && this._additiveTrack.setFinished();
  }
  needsAnimate() {
    return this.keyframes.length >= 1;
  }
  getAdditiveTrack() {
    return this._additiveTrack;
  }
  addKeyframe(t, e, n) {
    this._needsSort = !0;
    let s = this.keyframes, r = s.length, o = !1, l = _o, a = e;
    if (St(e)) {
      let h = lf(e);
      l = h, (h === 1 && !ei(e[0]) || h === 2 && !ei(e[0][0])) && (o = !0);
    } else if (ei(e) && !Xl(e))
      l = Ki;
    else if (vt(e))
      if (!isNaN(+e))
        l = Ki;
      else {
        const h = ct(e);
        h && (a = h, l = xi);
      }
    else if (Xi(e)) {
      const h = F({}, a);
      h.colorStops = V(e.colorStops, (f) => ({
        offset: f.offset,
        color: ct(f.color)
      })), ya(e) ? l = Qs : wa(e) && (l = Js), a = h;
    }
    r === 0 ? this.valType = l : (l !== this.valType || l === _o) && (o = !0), this.discrete = this.discrete || o;
    const c = {
      time: t,
      value: a,
      rawValue: e,
      percent: 0
    };
    return n && (c.easing = n, c.easingFunc = Bt(n) ? n : ki[n] || Or(n)), s.push(c), c;
  }
  prepare(t, e) {
    let n = this.keyframes;
    this._needsSort && n.sort(function(h, f) {
      return h.time - f.time;
    });
    const s = this.valType, r = n.length, o = n[r - 1], l = this.discrete, a = Qi(s), c = mo(s);
    for (let h = 0; h < r; h++) {
      const f = n[h], u = f.value, d = o.value;
      f.percent = f.time / t, l || (a && h !== r - 1 ? of(u, d, s) : c && rf(
        u.colorStops,
        d.colorStops
      ));
    }
    if (!l && s !== Js && e && this.needsAnimate() && e.needsAnimate() && s === e.valType && !e._finished) {
      this._additiveTrack = e;
      const h = n[0].value;
      for (let f = 0; f < r; f++)
        s === Ki ? n[f].additiveValue = n[f].value - h : s === xi ? n[f].additiveValue = ji([], n[f].value, h, -1) : Qi(s) && (n[f].additiveValue = s === Sn ? ji([], n[f].value, h, -1) : go([], n[f].value, h, -1));
    }
  }
  step(t, e) {
    if (this._finished)
      return;
    this._additiveTrack && this._additiveTrack._finished && (this._additiveTrack = null);
    const n = this._additiveTrack != null, s = n ? "additiveValue" : "value", r = this.valType, o = this.keyframes, l = o.length, a = this.propName, c = r === xi;
    let h;
    const f = this._lastFr, u = Math.min;
    let d, p;
    if (l === 1)
      d = p = o[0];
    else {
      if (e < 0)
        h = 0;
      else if (e < this._lastFrP) {
        const y = u(f + 1, l - 1);
        for (h = y; h >= 0 && !(o[h].percent <= e); h--)
          ;
        h = u(h, l - 2);
      } else {
        for (h = f; h < l && !(o[h].percent > e); h++)
          ;
        h = u(h - 1, l - 2);
      }
      p = o[h + 1], d = o[h];
    }
    if (!(d && p))
      return;
    this._lastFr = h, this._lastFrP = e;
    const g = p.percent - d.percent;
    let _ = g === 0 ? 1 : u((e - d.percent) / g, 1);
    p.easingFunc && (_ = p.easingFunc(_));
    let m = n ? this._additiveValue : c ? pi : t[a];
    if ((Qi(r) || c) && !m && (m = this._additiveValue = []), this.discrete)
      t[a] = _ < 1 ? d.rawValue : p.rawValue;
    else if (Qi(r))
      r === Sn ? rs(
        m,
        d[s],
        p[s],
        _
      ) : sf(
        m,
        d[s],
        p[s],
        _
      );
    else if (mo(r)) {
      const y = d[s], w = p[s], b = r === Qs;
      t[a] = {
        type: b ? "linear" : "radial",
        x: Nt(y.x, w.x, _),
        y: Nt(y.y, w.y, _),
        // TODO performance
        colorStops: V(y.colorStops, (v, x) => {
          const T = w.colorStops[x];
          return {
            offset: Nt(v.offset, T.offset, _),
            color: bn(rs(
              [],
              v.color,
              T.color,
              _
            ))
          };
        }),
        global: w.global
      }, b ? (t[a].x2 = Nt(
        y.x2,
        w.x2,
        _
      ), t[a].y2 = Nt(
        y.y2,
        w.y2,
        _
      )) : t[a].r = Nt(
        y.r,
        w.r,
        _
      );
    } else if (c)
      rs(
        m,
        d[s],
        p[s],
        _
      ), n || (t[a] = bn(m));
    else {
      const y = Nt(d[s], p[s], _);
      n ? this._additiveValue = y : t[a] = y;
    }
    n && this._addToTarget(t);
  }
  _addToTarget(t) {
    const e = this.valType, n = this.propName, s = this._additiveValue;
    e === Ki ? t[n] = t[n] + s : e === xi ? (ct(t[n], pi), ji(pi, pi, s, 1), t[n] = bn(pi)) : e === Sn ? ji(t[n], t[n], s, 1) : e === Sa && go(t[n], t[n], s, 1);
  }
}
class zr {
  animation;
  targetName;
  scope;
  __fromStateTransition;
  _tracks = {};
  _trackKeys = [];
  _target;
  _loop;
  _delay;
  _maxTime = 0;
  /**
   * If force run regardless of empty tracks when duration is set.
   */
  _force;
  /**
   * If animator is paused
   * @default false
   */
  _paused;
  // 0: Not started
  // 1: Invoked started
  // 2: Has been run for at least one frame.
  _started = 0;
  /**
   * If allow discrete animation
   * @default false
   */
  _allowDiscrete;
  _additiveAnimators;
  _doneCbs;
  _onframeCbs;
  _abortedCbs;
  _clip = null;
  constructor(t, e, n, s) {
    if (this._target = t, this._loop = e, e && s) {
      Ot("Can' use additive animation on looped animation.");
      return;
    }
    this._additiveAnimators = s, this._allowDiscrete = n;
  }
  getMaxTime() {
    return this._maxTime;
  }
  getDelay() {
    return this._delay;
  }
  getLoop() {
    return this._loop;
  }
  getTarget() {
    return this._target;
  }
  /**
   * Target can be changed during animation
   * For example if style is changed during state change.
   * We need to change target to the new style object.
   */
  changeTarget(t) {
    this._target = t;
  }
  /**
   * Set Animation keyframe
   * @param time time of keyframe in ms
   * @param props key-value props of keyframe.
   * @param easing
   */
  when(t, e, n) {
    return this.whenWithKeys(t, e, X(e), n);
  }
  // Fast path for add keyframes of aniamteTo
  whenWithKeys(t, e, n, s) {
    const r = this._tracks;
    for (let o = 0; o < n.length; o++) {
      const l = n[o];
      let a = r[l];
      if (!a) {
        a = r[l] = new af(l);
        let c;
        const h = this._getAdditiveTrack(l);
        if (h) {
          const f = h.keyframes, u = f[f.length - 1];
          c = u && u.value, h.valType === xi && c && (c = bn(c));
        } else
          c = this._target[l];
        if (c == null)
          continue;
        t > 0 && a.addKeyframe(0, Tn(c), s), this._trackKeys.push(l);
      }
      a.addKeyframe(t, Tn(e[l]), s);
    }
    return this._maxTime = Math.max(this._maxTime, t), this;
  }
  pause() {
    this._clip.pause(), this._paused = !0;
  }
  resume() {
    this._clip.resume(), this._paused = !1;
  }
  isPaused() {
    return !!this._paused;
  }
  /**
   * Set duration of animator.
   * Will run this duration regardless the track max time or if trackes exits.
   * @param duration
   * @returns
   */
  duration(t) {
    return this._maxTime = t, this._force = !0, this;
  }
  _doneCallback() {
    this._setTracksFinished(), this._clip = null;
    const t = this._doneCbs;
    if (t) {
      const e = t.length;
      for (let n = 0; n < e; n++)
        t[n].call(this);
    }
  }
  _abortedCallback() {
    this._setTracksFinished();
    const t = this.animation, e = this._abortedCbs;
    if (t && t.removeClip(this._clip), this._clip = null, e)
      for (let n = 0; n < e.length; n++)
        e[n].call(this);
  }
  _setTracksFinished() {
    const t = this._tracks, e = this._trackKeys;
    for (let n = 0; n < e.length; n++)
      t[e[n]].setFinished();
  }
  _getAdditiveTrack(t) {
    let e;
    const n = this._additiveAnimators;
    if (n)
      for (let s = 0; s < n.length; s++) {
        const r = n[s].getTrack(t);
        r && (e = r);
      }
    return e;
  }
  /**
   * Start the animation
   * @param easing
   * @return
   */
  start(t) {
    if (this._started > 0)
      return;
    this._started = 1;
    const e = this, n = [], s = this._maxTime || 0;
    for (let r = 0; r < this._trackKeys.length; r++) {
      const o = this._trackKeys[r], l = this._tracks[o], a = this._getAdditiveTrack(o), c = l.keyframes, h = c.length;
      if (l.prepare(s, a), l.needsAnimate())
        if (!this._allowDiscrete && l.discrete) {
          const f = c[h - 1];
          f && (e._target[l.propName] = f.rawValue), l.setFinished();
        } else
          n.push(l);
    }
    if (n.length || this._force) {
      const r = new Hh({
        life: s,
        loop: this._loop,
        delay: this._delay || 0,
        onframe(o) {
          e._started = 2;
          const l = e._additiveAnimators;
          if (l) {
            let c = !1;
            for (let h = 0; h < l.length; h++)
              if (l[h]._clip) {
                c = !0;
                break;
              }
            c || (e._additiveAnimators = null);
          }
          for (let c = 0; c < n.length; c++)
            n[c].step(e._target, o);
          const a = e._onframeCbs;
          if (a)
            for (let c = 0; c < a.length; c++)
              a[c](e._target, o);
        },
        ondestroy() {
          e._doneCallback();
        }
      });
      this._clip = r, this.animation && this.animation.addClip(r), t && r.setEasing(t);
    } else
      this._doneCallback();
    return this;
  }
  /**
   * Stop animation
   * @param {boolean} forwardToLast If move to last frame before stop
   */
  stop(t) {
    if (!this._clip)
      return;
    const e = this._clip;
    t && e.onframe(1), this._abortedCallback();
  }
  /**
   * Set when animation delay starts
   * @param time 单位ms
   */
  delay(t) {
    return this._delay = t, this;
  }
  /**
   * 添加动画每一帧的回调函数
   * @param callback
   */
  during(t) {
    return t && (this._onframeCbs || (this._onframeCbs = []), this._onframeCbs.push(t)), this;
  }
  /**
   * Add callback for animation end
   * @param cb
   */
  done(t) {
    return t && (this._doneCbs || (this._doneCbs = []), this._doneCbs.push(t)), this;
  }
  aborted(t) {
    return t && (this._abortedCbs || (this._abortedCbs = []), this._abortedCbs.push(t)), this;
  }
  getClip() {
    return this._clip;
  }
  getTrack(t) {
    return this._tracks[t];
  }
  getTracks() {
    return V(this._trackKeys, (t) => this._tracks[t]);
  }
  /**
   * Return true if animator is not available anymore.
   */
  stopTracks(t, e) {
    if (!t.length || !this._clip)
      return !0;
    const n = this._tracks, s = this._trackKeys;
    for (let o = 0; o < t.length; o++) {
      const l = n[t[o]];
      l && !l.isFinished() && (e ? l.step(this._target, 1) : this._started === 1 && l.step(this._target, 0), l.setFinished());
    }
    let r = !0;
    for (let o = 0; o < s.length; o++)
      if (!n[s[o]].isFinished()) {
        r = !1;
        break;
      }
    return r && this._abortedCallback(), r;
  }
  /**
   * Save values of final state to target.
   * It is mainly used in state mangement. When state is switching during animation.
   * We need to save final state of animation to the normal state. Not interpolated value.
   *
   * @param target
   * @param trackKeys
   * @param firstOrLast If save first frame or last frame
   */
  saveTo(t, e, n) {
    if (t) {
      e = e || this._trackKeys;
      for (let s = 0; s < e.length; s++) {
        const r = e[s], o = this._tracks[r];
        if (!o || o.isFinished())
          continue;
        const l = o.keyframes, a = l[n ? 0 : l.length - 1];
        a && (t[r] = Tn(a.rawValue));
      }
    }
  }
  // Change final value after animator has been started.
  // NOTE: Be careful to use it.
  __changeFinalValue(t, e) {
    e = e || X(t);
    for (let n = 0; n < e.length; n++) {
      const s = e[n], r = this._tracks[s];
      if (!r)
        continue;
      const o = r.keyframes;
      if (o.length > 1) {
        const l = o.pop();
        r.addKeyframe(l.time, t[s]), r.prepare(this._maxTime, r.getAdditiveTrack());
      }
    }
  }
}
function je() {
  return (/* @__PURE__ */ new Date()).getTime();
}
class cf extends ci {
  stage;
  // Use linked list to store clip
  _head;
  _tail;
  _running = !1;
  _time = 0;
  _pausedTime = 0;
  _pauseStart = 0;
  _paused = !1;
  constructor(t) {
    super(), t = t || {}, this.stage = t.stage || {};
  }
  /**
   * Add clip
   */
  addClip(t) {
    t.animation && this.removeClip(t), this._head ? (this._tail.next = t, t.prev = this._tail, t.next = null, this._tail = t) : this._head = this._tail = t, t.animation = this;
  }
  /**
   * Add animator
   */
  addAnimator(t) {
    t.animation = this;
    const e = t.getClip();
    e && this.addClip(e);
  }
  /**
   * Delete animation clip
   */
  removeClip(t) {
    if (!t.animation)
      return;
    const e = t.prev, n = t.next;
    e ? e.next = n : this._head = n, n ? n.prev = e : this._tail = e, t.next = t.prev = t.animation = null;
  }
  /**
   * Delete animation clip
   */
  removeAnimator(t) {
    const e = t.getClip();
    e && this.removeClip(e), t.animation = null;
  }
  update(t) {
    const e = je() - this._pausedTime, n = e - this._time;
    let s = this._head;
    for (; s; ) {
      const r = s.next;
      s.step(e, n) && (s.ondestroy(), this.removeClip(s)), s = r;
    }
    this._time = e, t || (this.trigger("frame", n), this.stage.update && this.stage.update());
  }
  _startLoop() {
    const t = this;
    this._running = !0;
    function e() {
      t._running && (Vs(e), !t._paused && t.update());
    }
    Vs(e);
  }
  /**
   * Start animation.
   */
  start() {
    this._running || (this._time = je(), this._pausedTime = 0, this._startLoop());
  }
  /**
   * Stop animation.
   */
  stop() {
    this._running = !1;
  }
  /**
   * Pause animation.
   */
  pause() {
    this._paused || (this._pauseStart = je(), this._paused = !0);
  }
  /**
   * Resume animation.
   */
  resume() {
    this._paused && (this._pausedTime += je() - this._pauseStart, this._paused = !1);
  }
  /**
   * Clear animation.
   */
  clear() {
    let t = this._head;
    for (; t; ) {
      let e = t.next;
      t.prev = t.next = t.animation = null, t = e;
    }
    this._head = this._tail = null;
  }
  /**
   * Whether animation finished.
   */
  isFinished() {
    return this._head == null;
  }
  /**
   * Creat animator for a target, whose props can be animated.
   */
  // TODO Gap
  animate(t, e) {
    e = e || {}, this.start();
    const n = new zr(
      t,
      e.loop
    );
    return this.addAnimator(n), n;
  }
}
const hf = 300, os = G.domSupported, ls = function() {
  const i = [
    "click",
    "dblclick",
    "mousewheel",
    "wheel",
    "mouseout",
    "mouseup",
    "mousedown",
    "mousemove",
    "contextmenu"
  ], t = [
    "touchstart",
    "touchend",
    "touchmove"
  ], e = {
    pointerdown: 1,
    pointerup: 1,
    pointermove: 1,
    pointerout: 1
  }, n = V(i, function(s) {
    const r = s.replace("mouse", "pointer");
    return e.hasOwnProperty(r) ? r : s;
  });
  return {
    mouse: i,
    touch: t,
    pointer: n
  };
}(), yo = {
  mouse: ["mousemove", "mouseup"],
  pointer: ["pointermove", "pointerup"]
};
let wo = !1;
function tr(i) {
  const t = i.pointerType;
  return t === "pen" || t === "touch";
}
function ff(i) {
  i.touching = !0, i.touchTimer != null && (clearTimeout(i.touchTimer), i.touchTimer = null), i.touchTimer = setTimeout(function() {
    i.touching = !1, i.touchTimer = null;
  }, 700);
}
function as(i) {
  i && (i.zrByTouch = !0);
}
function uf(i, t) {
  return wt(
    i.dom,
    // TODO ANY TYPE
    new df(i, t),
    !0
  );
}
function va(i, t) {
  let e = t, n = !1;
  for (; e && e.nodeType !== 9 && !(n = e.domBelongToZr || e !== t && e === i.painterRoot); )
    e = e.parentNode;
  return n;
}
class df {
  type;
  target;
  currentTarget;
  pointerType;
  clientX;
  clientY;
  constructor(t, e) {
    this.type = e.type, this.target = this.currentTarget = t.dom, this.pointerType = e.pointerType, this.clientX = e.clientX, this.clientY = e.clientY;
  }
  // we make the default methods on the event do nothing,
  // otherwise it is dangerous. See more details in
  // [DRAG_OUTSIDE] in `Handler.js`.
  stopPropagation = jt;
  stopImmediatePropagation = jt;
  preventDefault = jt;
}
const xt = {
  mousedown(i) {
    i = wt(this.dom, i), this.__mayPointerCapture = [i.zrX, i.zrY], this.trigger("mousedown", i);
  },
  mousemove(i) {
    i = wt(this.dom, i);
    const t = this.__mayPointerCapture;
    t && (i.zrX !== t[0] || i.zrY !== t[1]) && this.__togglePointerCapture(!0), this.trigger("mousemove", i);
  },
  mouseup(i) {
    i = wt(this.dom, i), this.__togglePointerCapture(!1), this.trigger("mouseup", i);
  },
  mouseout(i) {
    i = wt(this.dom, i);
    const t = i.toElement || i.relatedTarget;
    va(this, t) || (this.__pointerCapturing && (i.zrEventControl = "no_globalout"), this.trigger("mouseout", i));
  },
  wheel(i) {
    wo = !0, i = wt(this.dom, i), this.trigger("mousewheel", i);
  },
  mousewheel(i) {
    wo || (i = wt(this.dom, i), this.trigger("mousewheel", i));
  },
  touchstart(i) {
    i = wt(this.dom, i), as(i), this.__lastTouchMoment = /* @__PURE__ */ new Date(), this.handler.processGesture(i, "start"), xt.mousemove.call(this, i), xt.mousedown.call(this, i);
  },
  touchmove(i) {
    i = wt(this.dom, i), as(i), this.handler.processGesture(i, "change"), xt.mousemove.call(this, i);
  },
  touchend(i) {
    i = wt(this.dom, i), as(i), this.handler.processGesture(i, "end"), xt.mouseup.call(this, i), +/* @__PURE__ */ new Date() - +this.__lastTouchMoment < hf && xt.click.call(this, i);
  },
  pointerdown(i) {
    xt.mousedown.call(this, i);
  },
  pointermove(i) {
    tr(i) || xt.mousemove.call(this, i);
  },
  pointerup(i) {
    xt.mouseup.call(this, i);
  },
  pointerout(i) {
    tr(i) || xt.mouseout.call(this, i);
  }
};
K(["click", "dblclick", "contextmenu"], function(i) {
  xt[i] = function(t) {
    t = wt(this.dom, t), this.trigger(i, t);
  };
});
const er = {
  pointermove: function(i) {
    tr(i) || er.mousemove.call(this, i);
  },
  pointerup: function(i) {
    er.mouseup.call(this, i);
  },
  mousemove: function(i) {
    this.trigger("mousemove", i);
  },
  mouseup: function(i) {
    const t = this.__pointerCapturing;
    this.__togglePointerCapture(!1), this.trigger("mouseup", i), t && (i.zrEventControl = "only_globalout", this.trigger("mouseout", i));
  }
};
function pf(i, t) {
  const e = t.domHandlers;
  G.pointerEventsSupported ? K(ls.pointer, function(n) {
    vn(t, n, function(s) {
      e[n].call(i, s);
    });
  }) : (G.touchEventsSupported && K(ls.touch, function(n) {
    vn(t, n, function(s) {
      e[n].call(i, s), ff(t);
    });
  }), K(ls.mouse, function(n) {
    vn(t, n, function(s) {
      s = Lr(s), t.touching || e[n].call(i, s);
    });
  }));
}
function gf(i, t) {
  G.pointerEventsSupported ? K(yo.pointer, e) : G.touchEventsSupported || K(yo.mouse, e);
  function e(n) {
    function s(r) {
      r = Lr(r), va(i, r.target) || (r = uf(i, r), t.domHandlers[n].call(i, r));
    }
    vn(
      t,
      n,
      s,
      { capture: !0 }
      // See [DRAG_OUTSIDE] in `Handler.js`
    );
  }
}
function vn(i, t, e, n) {
  i.mounted[t] = e, i.listenerOpts[t] = n, gh(i.domTarget, t, e, n);
}
function cs(i) {
  const t = i.mounted;
  for (let e in t)
    t.hasOwnProperty(e) && _h(
      i.domTarget,
      e,
      t[e],
      i.listenerOpts[e]
    );
  i.mounted = {};
}
class xo {
  domTarget;
  domHandlers;
  // Key: eventName, value: mounted handler functions.
  // Used for unmount.
  mounted = {};
  listenerOpts = {};
  touchTimer;
  touching = !1;
  constructor(t, e) {
    this.domTarget = t, this.domHandlers = e;
  }
}
class _f extends ci {
  dom;
  painterRoot;
  handler;
  _localHandlerScope;
  _globalHandlerScope;
  __lastTouchMoment;
  // See [DRAG_OUTSIDE] in `Handler.ts`.
  __pointerCapturing = !1;
  // [x, y]
  __mayPointerCapture;
  constructor(t, e) {
    super(), this.dom = t, this.painterRoot = e, this._localHandlerScope = new xo(t, xt), os && (this._globalHandlerScope = new xo(document, er)), pf(this, this._localHandlerScope);
  }
  dispose() {
    cs(this._localHandlerScope), os && cs(this._globalHandlerScope);
  }
  setCursor(t) {
    this.dom.style && (this.dom.style.cursor = t || "default");
  }
  /**
   * See [DRAG_OUTSIDE] in `Handler.js`.
   * @implement
   * @param isPointerCapturing Should never be `null`/`undefined`.
   *        `true`: start to capture pointer if it is not capturing.
   *        `false`: end the capture if it is capturing.
   */
  __togglePointerCapture(t) {
    if (this.__mayPointerCapture = null, os && +this.__pointerCapturing ^ +t) {
      this.__pointerCapturing = t;
      const e = this._globalHandlerScope;
      t ? gf(this, e) : cs(e);
    }
  }
}
let Ca = 1;
G.hasGlobalWindow && (Ca = Math.max(
  window.devicePixelRatio || window.screen && window.screen.deviceXDPI / window.screen.logicalXDPI || 1,
  1
));
const Rn = Ca, ir = 0.4, nr = "#333", sr = "#ccc", mf = "#eee", To = ta, bo = 5e-5;
function ae(i) {
  return i > bo || i < -bo;
}
const ce = [], We = [], hs = Kt(), fs = Math.abs;
class li {
  parent;
  transform;
  invTransform;
  /**
   * Get computed local transform
   */
  getLocalTransform(t) {
    return li.getLocalTransform(this, t);
  }
  /**
   * Set position from array
   */
  setPosition(t) {
    this.x = t[0], this.y = t[1];
  }
  /**
   * Set scale from array
   */
  setScale(t) {
    this.scaleX = t[0], this.scaleY = t[1];
  }
  /**
   * Set skew from array
   */
  setSkew(t) {
    this.skewX = t[0], this.skewY = t[1];
  }
  /**
   * Set origin from array
   */
  setOrigin(t) {
    this.originX = t[0], this.originY = t[1];
  }
  /**
   * If needs to compute transform
   */
  needLocalTransform() {
    return ae(this.rotation) || ae(this.x) || ae(this.y) || ae(this.scaleX - 1) || ae(this.scaleY - 1) || ae(this.skewX) || ae(this.skewY);
  }
  /**
   * Update global transform
   */
  updateTransform() {
    const t = this.parent && this.parent.transform, e = this.needLocalTransform();
    let n = this.transform;
    if (!(e || t)) {
      n && (To(n), this.invTransform = null);
      return;
    }
    n = n || Kt(), e ? this.getLocalTransform(n) : To(n), t && (e ? si(n, t, n) : Dr(n, t)), this.transform = n, this._resolveGlobalScaleRatio(n);
  }
  _resolveGlobalScaleRatio(t) {
    const e = this.globalScaleRatio;
    if (e != null && e !== 1) {
      this.getGlobalScale(ce);
      const n = ce[0] < 0 ? -1 : 1, s = ce[1] < 0 ? -1 : 1, r = ((ce[0] - n) * e + n) / ce[0] || 0, o = ((ce[1] - s) * e + s) / ce[1] || 0;
      t[0] *= r, t[1] *= r, t[2] *= o, t[3] *= o;
    }
    this.invTransform = this.invTransform || Kt(), Er(this.invTransform, t);
  }
  /**
   * Get computed global transform
   * NOTE: this method will force update transform on all ancestors.
   * Please be aware of the potential performance cost.
   */
  getComputedTransform() {
    let t = this;
    const e = [];
    for (; t; )
      e.push(t), t = t.parent;
    for (; t = e.pop(); )
      t.updateTransform();
    return this.transform;
  }
  setLocalTransform(t) {
    if (!t)
      return;
    let e = t[0] * t[0] + t[1] * t[1], n = t[2] * t[2] + t[3] * t[3];
    const s = Math.atan2(t[1], t[0]), r = Math.PI / 2 + s - Math.atan2(t[3], t[2]);
    n = Math.sqrt(n) * Math.cos(r), e = Math.sqrt(e), this.skewX = r, this.skewY = 0, this.rotation = -s, this.x = +t[4], this.y = +t[5], this.scaleX = e, this.scaleY = n, this.originX = 0, this.originY = 0;
  }
  /**
   * 分解`transform`矩阵到`position`, `rotation`, `scale`
   */
  decomposeTransform() {
    if (!this.transform)
      return;
    const t = this.parent;
    let e = this.transform;
    t && t.transform && (t.invTransform = t.invTransform || Kt(), si(We, t.invTransform, e), e = We);
    const n = this.originX, s = this.originY;
    (n || s) && (hs[4] = n, hs[5] = s, si(We, e, hs), We[4] -= n, We[5] -= s, e = We), this.setLocalTransform(e);
  }
  /**
   * Get global scale
   */
  getGlobalScale(t) {
    const e = this.transform;
    return t = t || [], e ? (t[0] = Math.sqrt(e[0] * e[0] + e[1] * e[1]), t[1] = Math.sqrt(e[2] * e[2] + e[3] * e[3]), e[0] < 0 && (t[0] = -t[0]), e[3] < 0 && (t[1] = -t[1]), t) : (t[0] = 1, t[1] = 1, t);
  }
  /**
   * 变换坐标位置到 shape 的局部坐标空间
   */
  transformCoordToLocal(t, e) {
    const n = [t, e], s = this.invTransform;
    return s && ni(n, n, s), n;
  }
  /**
   * 变换局部坐标位置到全局坐标空间
   */
  transformCoordToGlobal(t, e) {
    const n = [t, e], s = this.transform;
    return s && ni(n, n, s), n;
  }
  getLineScale() {
    const t = this.transform;
    return t && fs(t[0] - 1) > 1e-10 && fs(t[3] - 1) > 1e-10 ? Math.sqrt(fs(t[0] * t[3] - t[2] * t[1])) : 1;
  }
  copyTransform(t) {
    Pa(this, t);
  }
  static getLocalTransform(t, e) {
    e = e || [];
    const n = t.originX || 0, s = t.originY || 0, r = t.scaleX, o = t.scaleY, l = t.anchorX, a = t.anchorY, c = t.rotation || 0, h = t.x, f = t.y, u = t.skewX ? Math.tan(t.skewX) : 0, d = t.skewY ? Math.tan(-t.skewY) : 0;
    if (n || s || l || a) {
      const p = n + l, g = s + a;
      e[4] = -p * r - u * g * o, e[5] = -g * o - d * p * r;
    } else
      e[4] = e[5] = 0;
    return e[0] = r, e[3] = o, e[1] = d * r, e[2] = u * o, c && Rr(e, e, c), e[4] += n + h, e[5] += s + f, e;
  }
  static initDefaultProps = function() {
    const t = li.prototype;
    t.scaleX = t.scaleY = t.globalScaleRatio = 1, t.x = t.y = t.originX = t.originY = t.skewX = t.skewY = t.rotation = t.anchorX = t.anchorY = 0;
  }();
}
const Oi = [
  "x",
  "y",
  "originX",
  "originY",
  "anchorX",
  "anchorY",
  "rotation",
  "scaleX",
  "scaleY",
  "skewX",
  "skewY"
];
function Pa(i, t) {
  for (let e = 0; e < Oi.length; e++) {
    const n = Oi[e];
    i[n] = t[n];
  }
}
function Wt(i) {
  Ji || (Ji = new Di(100)), i = i || Xt;
  let t = Ji.get(i);
  return t || (t = {
    font: i,
    strWidthCache: new Di(500),
    asciiWidthMap: null,
    // Init lazily for performance.
    asciiWidthMapTried: !1,
    // FIXME
    // Other languages?
    // FIXME
    // Consider proportional font?
    stWideCharWidth: Ft.measureText("国", i).width,
    asciiCharWidth: Ft.measureText("a", i).width
  }, Ji.put(i, t)), t;
}
let Ji;
function yf(i) {
  if (us >= So)
    return;
  i = i || Xt;
  const t = [], e = +/* @__PURE__ */ new Date();
  for (let s = 0; s <= 127; s++)
    t[s] = Ft.measureText(String.fromCharCode(s), i).width;
  const n = +/* @__PURE__ */ new Date() - e;
  return n > 16 ? us = So : n > 2 && us++, t;
}
let us = 0;
const So = 5;
function ka(i, t) {
  return i.asciiWidthMapTried || (i.asciiWidthMap = yf(i.font), i.asciiWidthMapTried = !0), 0 <= t && t <= 127 ? i.asciiWidthMap != null ? i.asciiWidthMap[t] : i.asciiCharWidth : i.stWideCharWidth;
}
function Yt(i, t) {
  const e = i.strWidthCache;
  let n = e.get(t);
  return n == null && (n = Ft.measureText(t, i.font).width, e.put(t, n)), n;
}
function Fi(i, t, e, n) {
  return e === "right" ? n ? i += t : i -= t : e === "center" && (n ? i += t / 2 : i -= t / 2), i;
}
function oi(i, t, e, n) {
  return e === "middle" ? n ? i += t / 2 : i -= t / 2 : e === "bottom" && (n ? i += t : i -= t), i;
}
function Vn(i) {
  return Wt(i).stWideCharWidth;
}
function zi(i, t) {
  return typeof i == "string" ? i.lastIndexOf("%") >= 0 ? parseFloat(i) / 100 * t : parseFloat(i) : i;
}
function wf(i, t, e) {
  const n = t.position || "inside", s = t.distance != null ? t.distance : 5, r = e.height, o = e.width, l = r / 2;
  let a = e.x, c = e.y, h = "left", f = "top";
  if (n instanceof Array)
    a += zi(n[0], e.width), c += zi(n[1], e.height), h = null, f = null;
  else
    switch (n) {
      case "left":
        a -= s, c += l, h = "right", f = "middle";
        break;
      case "right":
        a += s + o, c += l, f = "middle";
        break;
      case "top":
        a += o / 2, c -= s, h = "center", f = "bottom";
        break;
      case "bottom":
        a += o / 2, c += r + s, h = "center";
        break;
      case "inside":
        a += o / 2, c += l, h = "center", f = "middle";
        break;
      case "insideLeft":
        a += s, c += l, f = "middle";
        break;
      case "insideRight":
        a += o - s, c += l, h = "right", f = "middle";
        break;
      case "insideTop":
        a += o / 2, c += s, h = "center";
        break;
      case "insideBottom":
        a += o / 2, c += r - s, h = "center", f = "bottom";
        break;
      case "insideTopLeft":
        a += s, c += s;
        break;
      case "insideTopRight":
        a += o - s, c += s, h = "right";
        break;
      case "insideBottomLeft":
        a += s, c += r - s, f = "bottom";
        break;
      case "insideBottomRight":
        a += o - s, c += r - s, h = "right", f = "bottom";
        break;
    }
  return i = i || {}, i.x = a, i.y = c, i.align = h, i.verticalAlign = f, i;
}
const ds = "__zr_normal__", ps = Oi.concat(["ignore"]), xf = Yi(Oi, (i, t) => (i[t] = !0, i), { ignore: !1 }), Ye = {}, Tf = new D(0, 0, 0, 0), tn = [];
class hi {
  id = vr();
  parent;
  animators = [];
  /**
   * ZRender instance will be assigned when element is associated with zrender
   */
  __zr;
  /**
   * If element was painted on the screen
   */
  __isRendered;
  __clipPaths;
  /**
   * path to clip the elements and its children, if it is a group.
   * @see http://www.w3.org/TR/2dcontext/#clipping-region
   */
  _clipPath;
  /**
   * Attached text element.
   * `position`, `style.textAlign`, `style.textVerticalAlign`
   * of element will be ignored if textContent.position is set
   */
  _textContent;
  /**
   * Text guide line.
   */
  _textGuide;
  /**
   * Config of textContent. Inlcuding layout, color, ...etc.
   */
  textConfig;
  /**
   * Config for guide line calculating.
   *
   * NOTE: This is just a property signature. READ and WRITE are all done in echarts.
   */
  textGuideLineConfig;
  // FOR ECHARTS
  /**
   * Id for mapping animation
   */
  anid;
  extra;
  currentStates = [];
  // prevStates is for storager in echarts.
  prevStates;
  /**
   * Store of element state.
   * '__normal__' key is preserved for default properties.
   */
  states = {};
  /**
   * Animation config applied on state switching.
   */
  stateTransition;
  /**
   * Proxy function for getting state with given stateName.
   * ZRender will first try to get with stateProxy. Then find from states if stateProxy returns nothing
   *
   * targetStates will be given in useStates
   */
  stateProxy;
  _normalState;
  // Temporary storage for inside text color configuration.
  _innerTextDefaultStyle;
  constructor(t) {
    this._init(t);
  }
  _init(t) {
    this.attr(t);
  }
  /**
   * Drift element
   * @param {number} dx dx on the global space
   * @param {number} dy dy on the global space
   */
  drift(t, e, n) {
    switch (this.draggable) {
      case "horizontal":
        e = 0;
        break;
      case "vertical":
        t = 0;
        break;
    }
    let s = this.transform;
    s || (s = this.transform = [1, 0, 0, 1, 0, 0]), s[4] += t, s[5] += e, this.decomposeTransform(), this.markRedraw();
  }
  /**
   * Hook before update
   */
  beforeUpdate() {
  }
  /**
   * Hook after update
   */
  afterUpdate() {
  }
  /**
   * Update each frame
   */
  update() {
    this.updateTransform(), this.__dirty && this.updateInnerText();
  }
  updateInnerText(t) {
    const e = this._textContent;
    if (e && (!e.ignore || t)) {
      this.textConfig || (this.textConfig = {});
      const n = this.textConfig, s = n.local, r = e.innerTransformable;
      let o, l, a = !1;
      r.parent = s ? this : null;
      let c = !1;
      r.copyTransform(e);
      const h = n.position != null, f = n.autoOverflowArea;
      let u;
      if ((f || h) && (u = Tf, n.layoutRect ? u.copy(n.layoutRect) : u.copy(this.getBoundingRect()), s || u.applyTransform(this.transform)), h) {
        this.calculateTextPosition ? this.calculateTextPosition(Ye, n, u) : wf(Ye, n, u), r.x = Ye.x, r.y = Ye.y, o = Ye.align, l = Ye.verticalAlign;
        const w = n.origin;
        if (w && n.rotation != null) {
          let b, v;
          w === "center" ? (b = u.width * 0.5, v = u.height * 0.5) : (b = zi(w[0], u.width), v = zi(w[1], u.height)), c = !0, r.originX = -r.x + b + (s ? 0 : u.x), r.originY = -r.y + v + (s ? 0 : u.y);
        }
      }
      n.rotation != null && (r.rotation = n.rotation);
      const d = n.offset;
      d && (r.x += d[0], r.y += d[1], c || (r.originX = -d[0], r.originY = -d[1]));
      const p = this._innerTextDefaultStyle || (this._innerTextDefaultStyle = {});
      if (f) {
        const w = p.overflowRect = p.overflowRect || new D(0, 0, 0, 0);
        r.getLocalTransform(tn), Er(tn, tn), D.copy(w, u), w.applyTransform(tn);
      } else
        p.overflowRect = null;
      const g = n.inside == null ? typeof n.position == "string" && n.position.indexOf("inside") >= 0 : n.inside;
      let _, m, y;
      g && this.canBeInsideText() ? (_ = n.insideFill, m = n.insideStroke, (_ == null || _ === "auto") && (_ = this.getInsideTextFill()), (m == null || m === "auto") && (m = this.getInsideTextStroke(_), y = !0)) : (_ = n.outsideFill, m = n.outsideStroke, (_ == null || _ === "auto") && (_ = this.getOutsideFill()), (m == null || m === "auto") && (m = this.getOutsideStroke(_), y = !0)), _ = _ || "#000", (_ !== p.fill || m !== p.stroke || y !== p.autoStroke || o !== p.align || l !== p.verticalAlign) && (a = !0, p.fill = _, p.stroke = m, p.autoStroke = y, p.align = o, p.verticalAlign = l, e.setDefaultTextStyle(p)), e.__dirty |= ut, a && e.dirtyStyle(!0);
    }
  }
  canBeInsideText() {
    return !0;
  }
  getInsideTextFill() {
    return "#fff";
  }
  getInsideTextStroke(t) {
    return "#000";
  }
  getOutsideFill() {
    return this.__zr && this.__zr.isDarkMode() ? sr : nr;
  }
  getOutsideStroke(t) {
    const e = this.__zr && this.__zr.getBackgroundColor();
    let n = typeof e == "string" && ct(e);
    n || (n = [255, 255, 255, 1]);
    const s = n[3], r = this.__zr.isDarkMode();
    for (let o = 0; o < 3; o++)
      n[o] = n[o] * s + (r ? 0 : 255) * (1 - s);
    return n[3] = 1, ie(n, "rgba");
  }
  traverse(t, e) {
  }
  attrKV(t, e) {
    t === "textConfig" ? this.setTextConfig(e) : t === "textContent" ? this.setTextContent(e) : t === "clipPath" ? this.setClipPath(e) : t === "extra" ? (this.extra = this.extra || {}, F(this.extra, e)) : this[t] = e;
  }
  /**
   * Hide the element
   */
  hide() {
    this.ignore = !0, this.markRedraw();
  }
  /**
   * Show the element
   */
  show() {
    this.ignore = !1, this.markRedraw();
  }
  attr(t, e) {
    if (typeof t == "string")
      this.attrKV(t, e);
    else if (Et(t)) {
      let s = X(t);
      for (let r = 0; r < s.length; r++) {
        let o = s[r];
        this.attrKV(o, t[o]);
      }
    }
    return this.markRedraw(), this;
  }
  // Save current state to normal
  saveCurrentToNormalState(t) {
    this._innerSaveToNormal(t);
    const e = this._normalState;
    for (let n = 0; n < this.animators.length; n++) {
      const s = this.animators[n], r = s.__fromStateTransition;
      if (s.getLoop() || r && r !== ds)
        continue;
      const o = s.targetName, l = o ? e[o] : e;
      s.saveTo(l);
    }
  }
  _innerSaveToNormal(t) {
    let e = this._normalState;
    e || (e = this._normalState = {}), t.textConfig && !e.textConfig && (e.textConfig = this.textConfig), this._savePrimaryToNormal(t, e, ps);
  }
  _savePrimaryToNormal(t, e, n) {
    for (let s = 0; s < n.length; s++) {
      let r = n[s];
      t[r] != null && !(r in e) && (e[r] = this[r]);
    }
  }
  /**
   * If has any state.
   */
  hasState() {
    return this.currentStates.length > 0;
  }
  /**
   * Get state object
   */
  getState(t) {
    return this.states[t];
  }
  /**
   * Ensure state exists. If not, will create one and return.
   */
  ensureState(t) {
    const e = this.states;
    return e[t] || (e[t] = {}), e[t];
  }
  /**
   * Clear all states.
   */
  clearStates(t) {
    this.useState(ds, !1, t);
  }
  /**
   * Use state. State is a collection of properties.
   * Will return current state object if state exists and stateName has been changed.
   *
   * @param stateName State name to be switched to
   * @param keepCurrentState If keep current states.
   *      If not, it will inherit from the normal state.
   */
  useState(t, e, n, s) {
    const r = t === ds;
    if (!this.hasState() && r)
      return;
    const l = this.currentStates, a = this.stateTransition;
    if (Tt(l, t) >= 0 && (e || l.length === 1))
      return;
    let c;
    if (this.stateProxy && !r && (c = this.stateProxy(t)), c || (c = this.states && this.states[t]), !c && !r) {
      Ot(`State ${t} not exists.`);
      return;
    }
    r || this.saveCurrentToNormalState(c);
    const h = !!(c && c.hoverLayer || s);
    h && this._toggleHoverLayerFlag(!0), this._applyStateObj(
      t,
      c,
      this._normalState,
      e,
      !n && !this.__inHover && a && a.duration > 0,
      a
    );
    const f = this._textContent, u = this._textGuide;
    return f && f.useState(t, e, n, h), u && u.useState(t, e, n, h), r ? (this.currentStates = [], this._normalState = {}) : e ? this.currentStates.push(t) : this.currentStates = [t], this._updateAnimationTargets(), this.markRedraw(), !h && this.__inHover && (this._toggleHoverLayerFlag(!1), this.__dirty &= ~ut), c;
  }
  /**
   * Apply multiple states.
   * @param states States list.
   */
  useStates(t, e, n) {
    if (!t.length)
      this.clearStates();
    else {
      const s = [], r = this.currentStates, o = t.length;
      let l = o === r.length;
      if (l) {
        for (let p = 0; p < o; p++)
          if (t[p] !== r[p]) {
            l = !1;
            break;
          }
      }
      if (l)
        return;
      for (let p = 0; p < o; p++) {
        const g = t[p];
        let _;
        this.stateProxy && (_ = this.stateProxy(g, t)), _ || (_ = this.states[g]), _ && s.push(_);
      }
      const a = s[o - 1], c = !!(a && a.hoverLayer || n);
      c && this._toggleHoverLayerFlag(!0);
      const h = this._mergeStates(s), f = this.stateTransition;
      this.saveCurrentToNormalState(h), this._applyStateObj(
        t.join(","),
        h,
        this._normalState,
        !1,
        !e && !this.__inHover && f && f.duration > 0,
        f
      );
      const u = this._textContent, d = this._textGuide;
      u && u.useStates(t, e, c), d && d.useStates(t, e, c), this._updateAnimationTargets(), this.currentStates = t.slice(), this.markRedraw(), !c && this.__inHover && (this._toggleHoverLayerFlag(!1), this.__dirty &= ~ut);
    }
  }
  /**
   * Return if el.silent or any ancestor element has silent true.
   */
  isSilent() {
    let t = this;
    for (; t; ) {
      if (t.silent)
        return !0;
      const e = t.__hostTarget;
      t = e ? t.ignoreHostSilent ? null : e : t.parent;
    }
    return !1;
  }
  /**
   * Update animation targets when reference is changed.
   */
  _updateAnimationTargets() {
    for (let t = 0; t < this.animators.length; t++) {
      const e = this.animators[t];
      e.targetName && e.changeTarget(this[e.targetName]);
    }
  }
  /**
   * Remove state
   * @param state State to remove
   */
  removeState(t) {
    const e = Tt(this.currentStates, t);
    if (e >= 0) {
      const n = this.currentStates.slice();
      n.splice(e, 1), this.useStates(n);
    }
  }
  /**
   * Replace exists state.
   * @param oldState
   * @param newState
   * @param forceAdd If still add when even if replaced target not exists.
   */
  replaceState(t, e, n) {
    const s = this.currentStates.slice(), r = Tt(s, t), o = Tt(s, e) >= 0;
    r >= 0 ? o ? s.splice(r, 1) : s[r] = e : n && !o && s.push(e), this.useStates(s);
  }
  /**
   * Toogle state.
   */
  toggleState(t, e) {
    e ? this.useState(t, !0) : this.removeState(t);
  }
  _mergeStates(t) {
    const e = {};
    let n;
    for (let s = 0; s < t.length; s++) {
      const r = t[s];
      F(e, r), r.textConfig && (n = n || {}, F(n, r.textConfig));
    }
    return n && (e.textConfig = n), e;
  }
  _applyStateObj(t, e, n, s, r, o) {
    const l = !(e && s);
    e && e.textConfig ? (this.textConfig = F(
      {},
      s ? this.textConfig : n.textConfig
    ), F(this.textConfig, e.textConfig)) : l && n.textConfig && (this.textConfig = n.textConfig);
    const a = {};
    let c = !1;
    for (let h = 0; h < ps.length; h++) {
      const f = ps[h], u = r && xf[f];
      e && e[f] != null ? u ? (c = !0, a[f] = e[f]) : this[f] = e[f] : l && n[f] != null && (u ? (c = !0, a[f] = n[f]) : this[f] = n[f]);
    }
    if (!r)
      for (let h = 0; h < this.animators.length; h++) {
        const f = this.animators[h], u = f.targetName;
        f.getLoop() || f.__changeFinalValue(
          u ? (e || n)[u] : e || n
        );
      }
    c && this._transitionState(
      t,
      a,
      o
    );
  }
  /**
   * Component is some elements attached on this element for specific purpose.
   * Like clipPath, textContent
   */
  _attachComponent(t) {
    if (t.__zr && !t.__hostTarget) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("Text element has been added to zrender.");
      return;
    }
    if (t === this) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("Recursive component attachment.");
      return;
    }
    const e = this.__zr;
    e && t.addSelfToZr(e), t.__zr = e, t.__hostTarget = this;
  }
  _detachComponent(t) {
    t.__zr && t.removeSelfFromZr(t.__zr), t.__zr = null, t.__hostTarget = null;
  }
  /**
   * Get clip path
   */
  getClipPath() {
    return this._clipPath;
  }
  /**
   * Set clip path
   *
   * clipPath can't be shared between two elements.
   */
  setClipPath(t) {
    this._clipPath && this._clipPath !== t && this.removeClipPath(), this._attachComponent(t), this._clipPath = t, this.markRedraw();
  }
  /**
   * Remove clip path
   */
  removeClipPath() {
    const t = this._clipPath;
    t && (this._detachComponent(t), this._clipPath = null, this.markRedraw());
  }
  /**
   * Get attached text content.
   */
  getTextContent() {
    return this._textContent;
  }
  /**
   * Attach text on element
   */
  setTextContent(t) {
    const e = this._textContent;
    if (e !== t) {
      if (e && e !== t && this.removeTextContent(), process.env.NODE_ENV !== "production" && t.__zr && !t.__hostTarget)
        throw new Error("Text element has been added to zrender.");
      t.innerTransformable = new li(), this._attachComponent(t), this._textContent = t, this.markRedraw();
    }
  }
  /**
   * Set layout of attached text. Will merge with the previous.
   */
  setTextConfig(t) {
    this.textConfig || (this.textConfig = {}), F(this.textConfig, t), this.markRedraw();
  }
  /**
   * Remove text config
   */
  removeTextConfig() {
    this.textConfig = null, this.markRedraw();
  }
  /**
   * Remove attached text element.
   */
  removeTextContent() {
    const t = this._textContent;
    t && (t.innerTransformable = null, this._detachComponent(t), this._textContent = null, this._innerTextDefaultStyle = null, this.markRedraw());
  }
  getTextGuideLine() {
    return this._textGuide;
  }
  setTextGuideLine(t) {
    this._textGuide && this._textGuide !== t && this.removeTextGuideLine(), this._attachComponent(t), this._textGuide = t, this.markRedraw();
  }
  removeTextGuideLine() {
    const t = this._textGuide;
    t && (this._detachComponent(t), this._textGuide = null, this.markRedraw());
  }
  /**
   * Mark element needs to be repainted
   */
  markRedraw() {
    this.__dirty |= ut;
    const t = this.__zr;
    t && (this.__inHover ? t.refreshHover() : t.refresh()), this.__hostTarget && this.__hostTarget.markRedraw();
  }
  /**
   * Besides marking elements to be refreshed.
   * It will also invalid all cache and doing recalculate next frame.
   */
  dirty() {
    this.markRedraw();
  }
  _toggleHoverLayerFlag(t) {
    this.__inHover = t;
    const e = this._textContent, n = this._textGuide;
    e && (e.__inHover = t), n && (n.__inHover = t);
  }
  /**
   * Add self from zrender instance.
   * Not recursively because it will be invoked when element added to storage.
   */
  addSelfToZr(t) {
    if (this.__zr === t)
      return;
    this.__zr = t;
    const e = this.animators;
    if (e)
      for (let n = 0; n < e.length; n++)
        t.animation.addAnimator(e[n]);
    this._clipPath && this._clipPath.addSelfToZr(t), this._textContent && this._textContent.addSelfToZr(t), this._textGuide && this._textGuide.addSelfToZr(t);
  }
  /**
   * Remove self from zrender instance.
   * Not recursively because it will be invoked when element added to storage.
   */
  removeSelfFromZr(t) {
    if (!this.__zr)
      return;
    this.__zr = null;
    const e = this.animators;
    if (e)
      for (let n = 0; n < e.length; n++)
        t.animation.removeAnimator(e[n]);
    this._clipPath && this._clipPath.removeSelfFromZr(t), this._textContent && this._textContent.removeSelfFromZr(t), this._textGuide && this._textGuide.removeSelfFromZr(t);
  }
  /**
   * 动画
   *
   * @param path The key to fetch value from object. Mostly style or shape.
   * @param loop Whether to loop animation.
   * @param allowDiscreteAnimation Whether to allow discrete animation
   * @example:
   *     el.animate('style', false)
   *         .when(1000, {x: 10} )
   *         .done(function(){ // Animation done })
   *         .start()
   */
  animate(t, e, n) {
    let s = t ? this[t] : this;
    if (process.env.NODE_ENV !== "production" && !s) {
      Ot(
        'Property "' + t + '" is not existed in element ' + this.id
      );
      return;
    }
    const r = new zr(s, e, n);
    return t && (r.targetName = t), this.addAnimator(r, t), r;
  }
  addAnimator(t, e) {
    const n = this.__zr, s = this;
    t.during(function() {
      s.updateDuringAnimation(e);
    }).done(function() {
      const r = s.animators, o = Tt(r, t);
      o >= 0 && r.splice(o, 1);
    }), this.animators.push(t), n && n.animation.addAnimator(t), n && n.wakeUp();
  }
  updateDuringAnimation(t) {
    this.markRedraw();
  }
  /**
   * 停止动画
   * @param {boolean} forwardToLast If move to last frame before stop
   */
  stopAnimation(t, e) {
    const n = this.animators, s = n.length, r = [];
    for (let o = 0; o < s; o++) {
      const l = n[o];
      !t || t === l.scope ? l.stop(e) : r.push(l);
    }
    return this.animators = r, this;
  }
  /**
   * @param animationProps A map to specify which property to animate. If not specified, will animate all.
   * @example
   *  // Animate position
   *  el.animateTo({
   *      position: [10, 10]
   *  }, { done: () => { // done } })
   *
   *  // Animate shape, style and position in 100ms, delayed 100ms, with cubicOut easing
   *  el.animateTo({
   *      shape: {
   *          width: 500
   *      },
   *      style: {
   *          fill: 'red'
   *      }
   *      position: [10, 10]
   *  }, {
   *      duration: 100,
   *      delay: 100,
   *      easing: 'cubicOut',
   *      done: () => { // done }
   *  })
   */
  animateTo(t, e, n) {
    gs(this, t, e, n);
  }
  /**
   * Animate from the target state to current state.
   * The params and the value are the same as `this.animateTo`.
   */
  // Overload definitions
  animateFrom(t, e, n) {
    gs(this, t, e, n, !0);
  }
  _transitionState(t, e, n, s) {
    const r = gs(this, e, n, s);
    for (let o = 0; o < r.length; o++)
      r[o].__fromStateTransition = t;
  }
  /**
   * Interface of getting the minimum bounding box.
   */
  getBoundingRect() {
    return null;
  }
  getPaintRect() {
    return null;
  }
  /**
   * The string value of `textPosition` needs to be calculated to a real postion.
   * For example, `'inside'` is calculated to `[rect.width/2, rect.height/2]`
   * by default. See `contain/text.js#calculateTextPosition` for more details.
   * But some coutom shapes like "pin", "flag" have center that is not exactly
   * `[width/2, height/2]`. So we provide this hook to customize the calculation
   * for those shapes. It will be called if the `style.textPosition` is a string.
   * @param {Obejct} [out] Prepared out object. If not provided, this method should
   *        be responsible for creating one.
   * @param {module:zrender/graphic/Style} style
   * @param {Object} rect {x, y, width, height}
   * @return {Obejct} out The same as the input out.
   *         {
   *             x: number. mandatory.
   *             y: number. mandatory.
   *             align: string. optional. use style.textAlign by default.
   *             verticalAlign: string. optional. use style.textVerticalAlign by default.
   *         }
   */
  calculateTextPosition;
  static initDefaultProps = function() {
    const t = hi.prototype;
    t.type = "element", t.name = "", t.ignore = t.silent = t.ignoreHostSilent = t.isGroup = t.draggable = t.dragging = t.ignoreClip = t.__inHover = !1, t.__dirty = ut;
    const e = {};
    function n(r, o, l) {
      e[r + o + l] || (console.warn(`DEPRECATED: '${r}' has been deprecated. use '${o}', '${l}' instead`), e[r + o + l] = !0);
    }
    function s(r, o, l, a) {
      Object.defineProperty(t, r, {
        get() {
          if (process.env.NODE_ENV !== "production" && n(r, l, a), !this[o]) {
            const h = this[o] = [];
            c(this, h);
          }
          return this[o];
        },
        set(h) {
          process.env.NODE_ENV !== "production" && n(r, l, a), this[l] = h[0], this[a] = h[1], this[o] = h, c(this, h);
        }
      });
      function c(h, f) {
        Object.defineProperty(f, 0, {
          get() {
            return h[l];
          },
          set(u) {
            h[l] = u;
          }
        }), Object.defineProperty(f, 1, {
          get() {
            return h[a];
          },
          set(u) {
            h[a] = u;
          }
        });
      }
    }
    Object.defineProperty && (s("position", "_legacyPos", "x", "y"), s("scale", "_legacyScale", "scaleX", "scaleY"), s("origin", "_legacyOrigin", "originX", "originY"));
  }();
}
Cr(hi, ci);
Cr(hi, li);
function gs(i, t, e, n, s) {
  e = e || {};
  const r = [];
  Ma(
    i,
    "",
    i,
    t,
    e,
    n,
    r,
    s
  );
  let o = r.length, l = !1;
  const a = e.done, c = e.aborted, h = () => {
    l = !0, o--, o <= 0 && (l ? a && a() : c && c());
  }, f = () => {
    o--, o <= 0 && (l ? a && a() : c && c());
  };
  o || a && a(), r.length > 0 && e.during && r[0].during((u, d) => {
    e.during(d);
  });
  for (let u = 0; u < r.length; u++) {
    const d = r[u];
    h && d.done(h), f && d.aborted(f), e.force && d.duration(e.duration), d.start(e.easing);
  }
  return r;
}
function _s(i, t, e) {
  for (let n = 0; n < e; n++)
    i[n] = t[n];
}
function bf(i) {
  return St(i[0]);
}
function Sf(i, t, e) {
  if (St(t[e]))
    if (St(i[e]) || (i[e] = []), Wl(t[e])) {
      const n = t[e].length;
      i[e].length !== n && (i[e] = new t[e].constructor(n), _s(i[e], t[e], n));
    } else {
      const n = t[e], s = i[e], r = n.length;
      if (bf(n)) {
        const o = n[0].length;
        for (let l = 0; l < r; l++)
          s[l] ? _s(s[l], n[l], o) : s[l] = Array.prototype.slice.call(n[l]);
      } else
        _s(s, n, r);
      s.length = n.length;
    }
  else
    i[e] = t[e];
}
function vf(i, t) {
  return i === t || St(i) && St(t) && Cf(i, t);
}
function Cf(i, t) {
  const e = i.length;
  if (e !== t.length)
    return !1;
  for (let n = 0; n < e; n++)
    if (i[n] !== t[n])
      return !1;
  return !0;
}
function Ma(i, t, e, n, s, r, o, l) {
  const a = X(n), c = s.duration, h = s.delay, f = s.additive, u = s.setToFinal, d = !Et(r), p = i.animators;
  let g = [];
  for (let m = 0; m < a.length; m++) {
    const y = a[m], w = n[y];
    if (w != null && e[y] != null && (d || r[y]))
      if (Et(w) && !St(w) && !Xi(w)) {
        if (t) {
          l || (e[y] = w, i.updateDuringAnimation(t));
          continue;
        }
        Ma(
          i,
          y,
          e[y],
          w,
          s,
          r && r[y],
          o,
          l
        );
      } else
        g.push(y);
    else l || (e[y] = w, i.updateDuringAnimation(t), g.push(y));
  }
  let _ = g.length;
  if (!f && _)
    for (let m = 0; m < p.length; m++) {
      const y = p[m];
      if (y.targetName === t && y.stopTracks(g)) {
        const b = Tt(p, y);
        p.splice(b, 1);
      }
    }
  if (s.force || (g = Cn(g, (m) => !vf(n[m], e[m])), _ = g.length), _ > 0 || s.force && !o.length) {
    let m, y, w;
    if (l) {
      y = {}, u && (m = {});
      for (let v = 0; v < _; v++) {
        const x = g[v];
        y[x] = e[x], u ? m[x] = n[x] : e[x] = n[x];
      }
    } else if (u) {
      w = {};
      for (let v = 0; v < _; v++) {
        const x = g[v];
        w[x] = Tn(e[x]), Sf(e, n, x);
      }
    }
    const b = new zr(e, !1, !1, f ? Cn(
      // Use key string instead object reference because ref may be changed.
      p,
      (v) => v.targetName === t
    ) : null);
    b.targetName = t, s.scope && (b.scope = s.scope), u && m && b.whenWithKeys(0, m, g), w && b.whenWithKeys(0, w, g), b.whenWithKeys(
      c ?? 500,
      l ? y : n,
      g
    ).delay(h || 0), i.addAnimator(b, t), o.push(b);
  }
}
class Se extends hi {
  isGroup = !0;
  _children = [];
  constructor(t) {
    super(), this.attr(t);
  }
  /**
   * Get children reference.
   */
  childrenRef() {
    return this._children;
  }
  /**
   * Get children copy.
   */
  children() {
    return this._children.slice();
  }
  /**
   * 获取指定 index 的儿子节点
   */
  childAt(t) {
    return this._children[t];
  }
  /**
   * 获取指定名字的儿子节点
   */
  childOfName(t) {
    const e = this._children;
    for (let n = 0; n < e.length; n++)
      if (e[n].name === t)
        return e[n];
  }
  childCount() {
    return this._children.length;
  }
  /**
   * 添加子节点到最后
   */
  add(t) {
    if (t && (t !== this && t.parent !== this && (this._children.push(t), this._doAdd(t)), process.env.NODE_ENV !== "production" && t.__hostTarget))
      throw "This elemenet has been used as an attachment";
    return this;
  }
  /**
   * 添加子节点在 nextSibling 之前
   */
  addBefore(t, e) {
    if (t && t !== this && t.parent !== this && e && e.parent === this) {
      const n = this._children, s = n.indexOf(e);
      s >= 0 && (n.splice(s, 0, t), this._doAdd(t));
    }
    return this;
  }
  replace(t, e) {
    const n = Tt(this._children, t);
    return n >= 0 && this.replaceAt(e, n), this;
  }
  replaceAt(t, e) {
    const n = this._children, s = n[e];
    if (t && t !== this && t.parent !== this && t !== s) {
      n[e] = t, s.parent = null;
      const r = this.__zr;
      r && s.removeSelfFromZr(r), this._doAdd(t);
    }
    return this;
  }
  _doAdd(t) {
    t.parent && t.parent.remove(t), t.parent = this;
    const e = this.__zr;
    e && e !== t.__zr && t.addSelfToZr(e), e && e.refresh();
  }
  /**
   * Remove child
   * @param child
   */
  remove(t) {
    const e = this.__zr, n = this._children, s = Tt(n, t);
    return s < 0 ? this : (n.splice(s, 1), t.parent = null, e && t.removeSelfFromZr(e), e && e.refresh(), this);
  }
  /**
   * Remove all children
   */
  removeAll() {
    const t = this._children, e = this.__zr;
    for (let n = 0; n < t.length; n++) {
      const s = t[n];
      e && s.removeSelfFromZr(e), s.parent = null;
    }
    return t.length = 0, this;
  }
  /**
   * 遍历所有子节点
   */
  eachChild(t, e) {
    const n = this._children;
    for (let s = 0; s < n.length; s++) {
      const r = n[s];
      t.call(e, r, s);
    }
    return this;
  }
  /**
   * Visit all descendants.
   * Return false in callback to stop visit descendants of current node
   */
  // TODO Group itself should also invoke the callback.
  traverse(t, e) {
    for (let n = 0; n < this._children.length; n++) {
      const s = this._children[n], r = t.call(e, s);
      s.isGroup && !r && s.traverse(t, e);
    }
    return this;
  }
  addSelfToZr(t) {
    super.addSelfToZr(t);
    for (let e = 0; e < this._children.length; e++)
      this._children[e].addSelfToZr(t);
  }
  removeSelfFromZr(t) {
    super.removeSelfFromZr(t);
    for (let e = 0; e < this._children.length; e++)
      this._children[e].removeSelfFromZr(t);
  }
  getBoundingRect(t) {
    const e = new D(0, 0, 0, 0), n = t || this._children, s = [];
    let r = null;
    for (let o = 0; o < n.length; o++) {
      const l = n[o];
      if (l.ignore || l.invisible)
        continue;
      const a = l.getBoundingRect(), c = l.getLocalTransform(s);
      c ? (D.applyTransform(e, a, c), r = r || e.clone(), r.union(e)) : (r = r || a.clone(), r.union(a));
    }
    return r || e;
  }
}
Se.prototype.type = "group";
/*!
* ZRender, a high performance 2d drawing library.
*
* Copyright (c) 2013, Baidu Inc.
* All rights reserved.
*
* LICENSE
* https://github.com/ecomfe/zrender/blob/master/LICENSE.txt
*/
const Ti = {};
let Le = {};
function Pf(i) {
  delete Le[i];
}
function kf(i) {
  if (!i)
    return !1;
  if (typeof i == "string")
    return Ii(i, 1) < ir;
  if (i.colorStops) {
    const t = i.colorStops;
    let e = 0;
    const n = t.length;
    for (let s = 0; s < n; s++)
      e += Ii(t[s].color, 1);
    return e /= n, e < ir;
  }
  return !1;
}
class Mf {
  /**
   * Not necessary if using SSR painter like svg-ssr
   */
  dom;
  id;
  storage;
  painter;
  handler;
  animation;
  _sleepAfterStill = 10;
  _stillFrameAccum = 0;
  _needsRefresh = !0;
  _needsRefreshHover = !0;
  _disposed;
  /**
   * If theme is dark mode. It will determine the color strategy for labels.
   */
  _darkMode = !1;
  _backgroundColor;
  constructor(t, e, n) {
    n = n || {}, this.dom = e, this.id = t;
    const s = new Ih();
    let r = n.renderer || "canvas";
    if (Ti[r] || (r = X(Ti)[0]), process.env.NODE_ENV !== "production" && !Ti[r])
      throw new Error(`Renderer '${r}' is not imported. Please import it first.`);
    n.useDirtyRect = n.useDirtyRect == null ? !1 : n.useDirtyRect;
    const o = new Ti[r](e, s, n, t), l = n.ssr || o.ssrOnly;
    this.storage = s, this.painter = o;
    const a = !G.node && !G.worker && !l ? new _f(o.getViewportRoot(), o.root) : null, c = n.useCoarsePointer, h = c == null || c === "auto" ? G.touchEventsSupported : !!c, f = 44;
    let u;
    h && (u = U(n.pointerSize, f)), this.handler = new na(s, o, a, o.root, u), this.animation = new cf({
      stage: {
        update: l ? null : () => this._flush(!0)
      }
    }), l || this.animation.start();
  }
  /**
   * 添加元素
   */
  add(t) {
    this._disposed || !t || (this.storage.addRoot(t), t.addSelfToZr(this), this.refresh());
  }
  /**
   * 删除元素
   */
  remove(t) {
    this._disposed || !t || (this.storage.delRoot(t), t.removeSelfFromZr(this), this.refresh());
  }
  /**
   * Change configuration of layer
  */
  configLayer(t, e) {
    this._disposed || (this.painter.configLayer && this.painter.configLayer(t, e), this.refresh());
  }
  /**
   * Set background color
   */
  setBackgroundColor(t) {
    this._disposed || (this.painter.setBackgroundColor && this.painter.setBackgroundColor(t), this.refresh(), this._backgroundColor = t, this._darkMode = kf(t));
  }
  getBackgroundColor() {
    return this._backgroundColor;
  }
  /**
   * Force to set dark mode
   */
  setDarkMode(t) {
    this._darkMode = t;
  }
  isDarkMode() {
    return this._darkMode;
  }
  /**
   * Repaint the canvas immediately
   */
  refreshImmediately(t) {
    this._disposed || (t || this.animation.update(!0), this._needsRefresh = !1, this.painter.refresh(), this._needsRefresh = !1);
  }
  /**
   * Mark and repaint the canvas in the next frame of browser
   */
  refresh() {
    this._disposed || (this._needsRefresh = !0, this.animation.start());
  }
  /**
   * Perform all refresh
   */
  flush() {
    this._disposed || this._flush(!1);
  }
  _flush(t) {
    let e;
    const n = je();
    this._needsRefresh && (e = !0, this.refreshImmediately(t)), this._needsRefreshHover && (e = !0, this.refreshHoverImmediately());
    const s = je();
    e ? (this._stillFrameAccum = 0, this.trigger("rendered", {
      elapsedTime: s - n
    })) : this._sleepAfterStill > 0 && (this._stillFrameAccum++, this._stillFrameAccum > this._sleepAfterStill && this.animation.stop());
  }
  /**
   * Set sleep after still for frames.
   * Disable auto sleep when it's 0.
   */
  setSleepAfterStill(t) {
    this._sleepAfterStill = t;
  }
  /**
   * Wake up animation loop. But not render.
   */
  wakeUp() {
    this._disposed || (this.animation.start(), this._stillFrameAccum = 0);
  }
  /**
   * Refresh hover in next frame
   */
  refreshHover() {
    this._needsRefreshHover = !0;
  }
  /**
   * Refresh hover immediately
   */
  refreshHoverImmediately() {
    this._disposed || (this._needsRefreshHover = !1, this.painter.refreshHover && this.painter.getType() === "canvas" && this.painter.refreshHover());
  }
  /**
   * Resize the canvas.
   * Should be invoked when container size is changed
   */
  resize(t) {
    this._disposed || (t = t || {}, this.painter.resize(t.width, t.height), this.handler.resize());
  }
  /**
   * Stop and clear all animation immediately
   */
  clearAnimation() {
    this._disposed || this.animation.clear();
  }
  /**
   * Get container width
   */
  getWidth() {
    if (!this._disposed)
      return this.painter.getWidth();
  }
  /**
   * Get container height
   */
  getHeight() {
    if (!this._disposed)
      return this.painter.getHeight();
  }
  /**
   * Set default cursor
   * @param cursorStyle='default' 例如 crosshair
   */
  setCursorStyle(t) {
    this._disposed || this.handler.setCursorStyle(t);
  }
  /**
   * Find hovered element
   * @param x
   * @param y
   * @return {target, topTarget}
   */
  findHover(t, e) {
    if (!this._disposed)
      return this.handler.findHover(t, e);
  }
  // eslint-disable-next-line max-len
  on(t, e, n) {
    return this._disposed || this.handler.on(t, e, n), this;
  }
  /**
   * Unbind event
   * @param eventName Event name
   * @param eventHandler Handler function
   */
  // eslint-disable-next-line max-len
  off(t, e) {
    this._disposed || this.handler.off(t, e);
  }
  /**
   * Trigger event manually
   *
   * @param eventName Event name
   * @param event Event object
   */
  trigger(t, e) {
    this._disposed || this.handler.trigger(t, e);
  }
  /**
   * Clear all objects and the canvas.
   */
  clear() {
    if (this._disposed)
      return;
    const t = this.storage.getRoots();
    for (let e = 0; e < t.length; e++)
      t[e] instanceof Se && t[e].removeSelfFromZr(this);
    this.storage.delAllRoots(), this.painter.clear();
  }
  /**
   * Dispose self.
   */
  dispose() {
    this._disposed || (this.animation.stop(), this.clear(), this.storage.dispose(), this.painter.dispose(), this.handler.dispose(), this.animation = this.storage = this.painter = this.handler = null, this._disposed = !0, Pf(this.id));
  }
}
function zp(i, t) {
  const e = new Mf(vr(), i, t);
  return Le[e.id] = e, e;
}
function Np(i) {
  i.dispose();
}
function Bp() {
  for (let i in Le)
    Le.hasOwnProperty(i) && Le[i].dispose();
  Le = {};
}
function Hp(i) {
  return Le[i];
}
function Aa(i, t) {
  Ti[i] = t;
}
let rr;
function Af(i) {
  if (typeof rr == "function")
    return rr(i);
}
function Wp(i) {
  rr = i;
}
const Yp = "6.0.0", or = "__zr_style_" + Math.round(Math.random() * 10), Ee = {
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowColor: "#000",
  opacity: 1,
  blend: "source-over"
}, Un = {
  style: {
    shadowBlur: !0,
    shadowOffsetX: !0,
    shadowOffsetY: !0,
    shadowColor: !0,
    opacity: !0
  }
};
Ee[or] = !0;
const vo = ["z", "z2", "invisible"], Lf = ["invisible"];
class ze extends hi {
  /**
   * Never increase to target size
   */
  ignoreCoarsePointer;
  _paintRect;
  _prevPaintRect;
  /************* Properties will be inejected in other modules. *******************/
  // @deprecated.
  useHoverLayer;
  __hoverStyle;
  // FOR CANVAS PAINTER
  __canvasFillGradient;
  __canvasStrokeGradient;
  __canvasFillPattern;
  __canvasStrokePattern;
  // FOR SVG PAINTER
  __svgEl;
  constructor(t) {
    super(t);
  }
  _init(t) {
    const e = X(t);
    for (let n = 0; n < e.length; n++) {
      const s = e[n];
      s === "style" ? this.useStyle(t[s]) : super.attrKV(s, t[s]);
    }
    this.style || this.useStyle({});
  }
  // Hook provided to developers.
  beforeBrush() {
  }
  afterBrush() {
  }
  // Hook provided to inherited classes.
  // Executed between beforeBrush / afterBrush
  innerBeforeBrush() {
  }
  innerAfterBrush() {
  }
  shouldBePainted(t, e, n, s) {
    const r = this.transform;
    if (this.ignore || this.invisible || this.style.opacity === 0 || this.culling && Df(this, t, e) || r && !r[0] && !r[3])
      return !1;
    if (n && this.__clipPaths && this.__clipPaths.length) {
      for (let o = 0; o < this.__clipPaths.length; ++o)
        if (this.__clipPaths[o].isZeroArea())
          return !1;
    }
    if (s && this.parent) {
      let o = this.parent;
      for (; o; ) {
        if (o.ignore)
          return !1;
        o = o.parent;
      }
    }
    return !0;
  }
  /**
   * If displayable element contain coord x, y
   */
  contain(t, e) {
    return this.rectContain(t, e);
  }
  traverse(t, e) {
    t.call(e, this);
  }
  /**
   * If bounding rect of element contain coord x, y
   */
  rectContain(t, e) {
    const n = this.transformCoordToLocal(t, e);
    return this.getBoundingRect().contain(n[0], n[1]);
  }
  getPaintRect() {
    let t = this._paintRect;
    if (!this._paintRect || this.__dirty) {
      const e = this.transform, n = this.getBoundingRect(), s = this.style, r = s.shadowBlur || 0, o = s.shadowOffsetX || 0, l = s.shadowOffsetY || 0;
      t = this._paintRect || (this._paintRect = new D(0, 0, 0, 0)), e ? D.applyTransform(t, n, e) : t.copy(n), (r || o || l) && (t.width += r * 2 + Math.abs(o), t.height += r * 2 + Math.abs(l), t.x = Math.min(t.x, t.x + o - r), t.y = Math.min(t.y, t.y + l - r));
      const a = this.dirtyRectTolerance;
      t.isZero() || (t.x = Math.floor(t.x - a), t.y = Math.floor(t.y - a), t.width = Math.ceil(t.width + 1 + a * 2), t.height = Math.ceil(t.height + 1 + a * 2));
    }
    return t;
  }
  setPrevPaintRect(t) {
    t ? (this._prevPaintRect = this._prevPaintRect || new D(0, 0, 0, 0), this._prevPaintRect.copy(t)) : this._prevPaintRect = null;
  }
  getPrevPaintRect() {
    return this._prevPaintRect;
  }
  /**
   * Alias for animate('style')
   * @param loop
   */
  animateStyle(t) {
    return this.animate("style", t);
  }
  // Override updateDuringAnimation
  updateDuringAnimation(t) {
    t === "style" ? this.dirtyStyle() : this.markRedraw();
  }
  attrKV(t, e) {
    t !== "style" ? super.attrKV(t, e) : this.style ? this.setStyle(e) : this.useStyle(e);
  }
  setStyle(t, e) {
    return typeof t == "string" ? this.style[t] = e : F(this.style, t), this.dirtyStyle(), this;
  }
  // getDefaultStyleValue<T extends keyof Props['style']>(key: T): Props['style'][T] {
  //     // Default value is on the prototype.
  //     return this.style.prototype[key];
  // }
  dirtyStyle(t) {
    t || this.markRedraw(), this.__dirty |= wi, this._rect && (this._rect = null);
  }
  dirty() {
    this.dirtyStyle();
  }
  /**
   * Is style changed. Used with dirtyStyle.
   */
  styleChanged() {
    return !!(this.__dirty & wi);
  }
  /**
   * Mark style updated. Only useful when style is used for caching. Like in the text.
   */
  styleUpdated() {
    this.__dirty &= ~wi;
  }
  /**
   * Create a style object with default values in it's prototype.
   */
  createStyle(t) {
    return $i(Ee, t);
  }
  /**
   * Replace style property.
   * It will create a new style if given obj is not a valid style object.
   */
  // PENDING should not createStyle if it's an style object.
  useStyle(t) {
    t[or] || (t = this.createStyle(t)), this.__inHover ? this.__hoverStyle = t : this.style = t, this.dirtyStyle();
  }
  /**
   * Determine if an object is a valid style object.
   * Which means it is created by `createStyle.`
   *
   * A valid style object will have all default values in it's prototype.
   * To avoid get null/undefined values.
   */
  isStyleObject(t) {
    return t[or];
  }
  _innerSaveToNormal(t) {
    super._innerSaveToNormal(t);
    const e = this._normalState;
    t.style && !e.style && (e.style = this._mergeStyle(this.createStyle(), this.style)), this._savePrimaryToNormal(t, e, vo);
  }
  _applyStateObj(t, e, n, s, r, o) {
    super._applyStateObj(t, e, n, s, r, o);
    const l = !(e && s);
    let a;
    if (e && e.style ? r ? s ? a = e.style : (a = this._mergeStyle(this.createStyle(), n.style), this._mergeStyle(a, e.style)) : (a = this._mergeStyle(
      this.createStyle(),
      s ? this.style : n.style
    ), this._mergeStyle(a, e.style)) : l && (a = n.style), a)
      if (r) {
        const h = this.style;
        if (this.style = this.createStyle(l ? {} : h), l) {
          const u = X(h);
          for (let d = 0; d < u.length; d++) {
            const p = u[d];
            p in a && (a[p] = a[p], this.style[p] = h[p]);
          }
        }
        const f = X(a);
        for (let u = 0; u < f.length; u++) {
          const d = f[u];
          this.style[d] = this.style[d];
        }
        this._transitionState(t, {
          style: a
        }, o, this.getAnimationStyleProps());
      } else
        this.useStyle(a);
    const c = this.__inHover ? Lf : vo;
    for (let h = 0; h < c.length; h++) {
      let f = c[h];
      e && e[f] != null ? this[f] = e[f] : l && n[f] != null && (this[f] = n[f]);
    }
  }
  _mergeStates(t) {
    const e = super._mergeStates(t);
    let n;
    for (let s = 0; s < t.length; s++) {
      const r = t[s];
      r.style && (n = n || {}, this._mergeStyle(n, r.style));
    }
    return n && (e.style = n), e;
  }
  _mergeStyle(t, e) {
    return F(t, e), t;
  }
  getAnimationStyleProps() {
    return Un;
  }
  /**
   * The string value of `textPosition` needs to be calculated to a real postion.
   * For example, `'inside'` is calculated to `[rect.width/2, rect.height/2]`
   * by default. See `contain/text.js#calculateTextPosition` for more details.
   * But some coutom shapes like "pin", "flag" have center that is not exactly
   * `[width/2, height/2]`. So we provide this hook to customize the calculation
   * for those shapes. It will be called if the `style.textPosition` is a string.
   * @param out Prepared out object. If not provided, this method should
   *        be responsible for creating one.
   * @param style
   * @param rect {x, y, width, height}
   * @return out The same as the input out.
   *         {
   *             x: number. mandatory.
   *             y: number. mandatory.
   *             textAlign: string. optional. use style.textAlign by default.
   *             textVerticalAlign: string. optional. use style.textVerticalAlign by default.
   *         }
   */
  // calculateTextPosition: (out: CalculateTextPositionResult, style: Dictionary<any>, rect: RectLike) => CalculateTextPositionResult
  static initDefaultProps = function() {
    const t = ze.prototype;
    t.type = "displayable", t.invisible = !1, t.z = 0, t.z2 = 0, t.zlevel = 0, t.culling = !1, t.cursor = "pointer", t.rectHover = !1, t.incremental = !1, t._rect = null, t.dirtyRectTolerance = 0, t.__dirty = ut | wi;
  }();
}
const ms = new D(0, 0, 0, 0), ys = new D(0, 0, 0, 0);
function Df(i, t, e) {
  return ms.copy(i.getBoundingRect()), i.transform && ms.applyTransform(i.transform), ys.width = t, ys.height = e, !ms.intersect(ys);
}
const ot = Math.min, lt = Math.max, ws = Math.sin, xs = Math.cos, he = Math.PI * 2, en = Fe(), nn = Fe(), sn = Fe();
function La(i, t, e) {
  if (i.length === 0)
    return;
  let n = i[0], s = n[0], r = n[0], o = n[1], l = n[1];
  for (let a = 1; a < i.length; a++)
    n = i[a], s = ot(s, n[0]), r = lt(r, n[0]), o = ot(o, n[1]), l = lt(l, n[1]);
  t[0] = s, t[1] = o, e[0] = r, e[1] = l;
}
function Co(i, t, e, n, s, r) {
  s[0] = ot(i, e), s[1] = ot(t, n), r[0] = lt(i, e), r[1] = lt(t, n);
}
const Po = [], ko = [];
function Rf(i, t, e, n, s, r, o, l, a, c) {
  const h = ha, f = it;
  let u = h(i, e, s, o, Po);
  a[0] = 1 / 0, a[1] = 1 / 0, c[0] = -1 / 0, c[1] = -1 / 0;
  for (let d = 0; d < u; d++) {
    const p = f(i, e, s, o, Po[d]);
    a[0] = ot(p, a[0]), c[0] = lt(p, c[0]);
  }
  u = h(t, n, r, l, ko);
  for (let d = 0; d < u; d++) {
    const p = f(t, n, r, l, ko[d]);
    a[1] = ot(p, a[1]), c[1] = lt(p, c[1]);
  }
  a[0] = ot(i, a[0]), c[0] = lt(i, c[0]), a[0] = ot(o, a[0]), c[0] = lt(o, c[0]), a[1] = ot(t, a[1]), c[1] = lt(t, c[1]), a[1] = ot(l, a[1]), c[1] = lt(l, c[1]);
}
function If(i, t, e, n, s, r, o, l) {
  const a = fa, c = rt, h = lt(
    ot(a(i, e, s), 1),
    0
  ), f = lt(
    ot(a(t, n, r), 1),
    0
  ), u = c(i, e, s, h), d = c(t, n, r, f);
  o[0] = ot(i, s, u), o[1] = ot(t, r, d), l[0] = lt(i, s, u), l[1] = lt(t, r, d);
}
function Ef(i, t, e, n, s, r, o, l, a) {
  const c = ke, h = Me, f = Math.abs(s - r);
  if (f % he < 1e-4 && f > 1e-4) {
    l[0] = i - e, l[1] = t - n, a[0] = i + e, a[1] = t + n;
    return;
  }
  if (en[0] = xs(s) * e + i, en[1] = ws(s) * n + t, nn[0] = xs(r) * e + i, nn[1] = ws(r) * n + t, c(l, en, nn), h(a, en, nn), s = s % he, s < 0 && (s = s + he), r = r % he, r < 0 && (r = r + he), s > r && !o ? r += he : s < r && o && (s += he), o) {
    const u = r;
    r = s, s = u;
  }
  for (let u = 0; u < r; u += Math.PI / 2)
    u > s && (sn[0] = xs(u) * e + i, sn[1] = ws(u) * n + t, c(l, sn, l), h(a, sn, a));
}
const N = {
  M: 1,
  L: 2,
  C: 3,
  Q: 4,
  A: 5,
  Z: 6,
  // Rect
  R: 7
}, fe = [], ue = [], Pt = [], $t = [], kt = [], Mt = [], Ts = Math.min, bs = Math.max, de = Math.cos, pe = Math.sin, zt = Math.abs, lr = Math.PI, Vt = lr * 2, Ss = typeof Float32Array < "u", gi = [];
function vs(i) {
  return Math.round(i / lr * 1e8) / 1e8 % 2 * lr;
}
function Of(i, t) {
  let e = vs(i[0]);
  e < 0 && (e += Vt);
  let n = e - i[0], s = i[1];
  s += n, !t && s - e >= Vt ? s = e + Vt : t && e - s >= Vt ? s = e - Vt : !t && e > s ? s = e + (Vt - vs(e - s)) : t && e < s && (s = e - (Vt - vs(s - e))), i[0] = e, i[1] = s;
}
class Ct {
  dpr = 1;
  data;
  /**
   * If the line segment is too small to draw. It will be added to the pending pt.
   * It will be added if the subpath needs to be finished before stroke, fill, or starting a new subpath.
   */
  _pendingPtX;
  _pendingPtY;
  _ctx;
  _xi = 0;
  _yi = 0;
  _x0 = 0;
  _y0 = 0;
  _len = 0;
  // Calculating path len and seg len.
  _pathSegLen;
  _pathLen;
  static CMD = N;
  constructor(t) {
    t && (this._saveData = !1), this._saveData && (this.data = []);
  }
  increaseVersion() {
    this._version++;
  }
  /**
   * Version can be used outside for compare if the path is changed.
   * For example to determine if need to update svg d str in svg renderer.
   */
  getVersion() {
    return this._version;
  }
  /**
   * @readOnly
   */
  setScale(t, e, n) {
    n = n || 0, n > 0 && (this._ux = zt(n / Rn / t) || 0, this._uy = zt(n / Rn / e) || 0);
  }
  setDPR(t) {
    this.dpr = t;
  }
  setContext(t) {
    this._ctx = t;
  }
  getContext() {
    return this._ctx;
  }
  beginPath() {
    return this._ctx && this._ctx.beginPath(), this.reset(), this;
  }
  /**
   * Reset path data.
   */
  reset() {
    this._saveData && (this._len = 0), this._pathSegLen && (this._pathSegLen = null, this._pathLen = 0), this._version++;
  }
  moveTo(t, e) {
    return this._drawPendingPt(), this.addData(N.M, t, e), this._ctx && this._ctx.moveTo(t, e), this._x0 = t, this._y0 = e, this._xi = t, this._yi = e, this;
  }
  lineTo(t, e) {
    const n = zt(t - this._xi), s = zt(e - this._yi), r = n > this._ux || s > this._uy;
    if (this.addData(N.L, t, e), this._ctx && r && this._ctx.lineTo(t, e), r)
      this._xi = t, this._yi = e, this._pendingPtDist = 0;
    else {
      const o = n * n + s * s;
      o > this._pendingPtDist && (this._pendingPtX = t, this._pendingPtY = e, this._pendingPtDist = o);
    }
    return this;
  }
  bezierCurveTo(t, e, n, s, r, o) {
    return this._drawPendingPt(), this.addData(N.C, t, e, n, s, r, o), this._ctx && this._ctx.bezierCurveTo(t, e, n, s, r, o), this._xi = r, this._yi = o, this;
  }
  quadraticCurveTo(t, e, n, s) {
    return this._drawPendingPt(), this.addData(N.Q, t, e, n, s), this._ctx && this._ctx.quadraticCurveTo(t, e, n, s), this._xi = n, this._yi = s, this;
  }
  arc(t, e, n, s, r, o) {
    this._drawPendingPt(), gi[0] = s, gi[1] = r, Of(gi, o), s = gi[0], r = gi[1];
    let l = r - s;
    return this.addData(
      N.A,
      t,
      e,
      n,
      n,
      s,
      l,
      0,
      o ? 0 : 1
    ), this._ctx && this._ctx.arc(t, e, n, s, r, o), this._xi = de(r) * n + t, this._yi = pe(r) * n + e, this;
  }
  // TODO
  arcTo(t, e, n, s, r) {
    return this._drawPendingPt(), this._ctx && this._ctx.arcTo(t, e, n, s, r), this;
  }
  // TODO
  rect(t, e, n, s) {
    return this._drawPendingPt(), this._ctx && this._ctx.rect(t, e, n, s), this.addData(N.R, t, e, n, s), this;
  }
  closePath() {
    this._drawPendingPt(), this.addData(N.Z);
    const t = this._ctx, e = this._x0, n = this._y0;
    return t && t.closePath(), this._xi = e, this._yi = n, this;
  }
  fill(t) {
    t && t.fill(), this.toStatic();
  }
  stroke(t) {
    t && t.stroke(), this.toStatic();
  }
  len() {
    return this._len;
  }
  setData(t) {
    if (!this._saveData)
      return;
    const e = t.length;
    !(this.data && this.data.length === e) && Ss && (this.data = new Float32Array(e));
    for (let n = 0; n < e; n++)
      this.data[n] = t[n];
    this._len = e;
  }
  appendPath(t) {
    if (!this._saveData)
      return;
    t instanceof Array || (t = [t]);
    const e = t.length;
    let n = 0, s = this._len;
    for (let o = 0; o < e; o++)
      n += t[o].len();
    const r = this.data;
    if (Ss && (r instanceof Float32Array || !r) && (this.data = new Float32Array(s + n), s > 0 && r))
      for (let o = 0; o < s; o++)
        this.data[o] = r[o];
    for (let o = 0; o < e; o++) {
      const l = t[o].data;
      for (let a = 0; a < l.length; a++)
        this.data[s++] = l[a];
    }
    this._len = s;
  }
  /**
   * 填充 Path 数据。
   * 尽量复用而不申明新的数组。大部分图形重绘的指令数据长度都是不变的。
   */
  addData(t, e, n, s, r, o, l, a, c) {
    if (!this._saveData)
      return;
    let h = this.data;
    this._len + arguments.length > h.length && (this._expandData(), h = this.data);
    for (let f = 0; f < arguments.length; f++)
      h[this._len++] = arguments[f];
  }
  _drawPendingPt() {
    this._pendingPtDist > 0 && (this._ctx && this._ctx.lineTo(this._pendingPtX, this._pendingPtY), this._pendingPtDist = 0);
  }
  _expandData() {
    if (!(this.data instanceof Array)) {
      const t = [];
      for (let e = 0; e < this._len; e++)
        t[e] = this.data[e];
      this.data = t;
    }
  }
  /**
   * Convert dynamic array to static Float32Array
   *
   * It will still use a normal array if command buffer length is less than 10
   * Because Float32Array itself may take more memory than a normal array.
   *
   * 10 length will make sure at least one M command and one A(arc) command.
   */
  toStatic() {
    if (!this._saveData)
      return;
    this._drawPendingPt();
    const t = this.data;
    t instanceof Array && (t.length = this._len, Ss && this._len > 11 && (this.data = new Float32Array(t)));
  }
  getBoundingRect() {
    Pt[0] = Pt[1] = kt[0] = kt[1] = Number.MAX_VALUE, $t[0] = $t[1] = Mt[0] = Mt[1] = -Number.MAX_VALUE;
    const t = this.data;
    let e = 0, n = 0, s = 0, r = 0, o;
    for (o = 0; o < this._len; ) {
      const l = t[o++], a = o === 1;
      switch (a && (e = t[o], n = t[o + 1], s = e, r = n), l) {
        case N.M:
          e = s = t[o++], n = r = t[o++], kt[0] = s, kt[1] = r, Mt[0] = s, Mt[1] = r;
          break;
        case N.L:
          Co(e, n, t[o], t[o + 1], kt, Mt), e = t[o++], n = t[o++];
          break;
        case N.C:
          Rf(
            e,
            n,
            t[o++],
            t[o++],
            t[o++],
            t[o++],
            t[o],
            t[o + 1],
            kt,
            Mt
          ), e = t[o++], n = t[o++];
          break;
        case N.Q:
          If(
            e,
            n,
            t[o++],
            t[o++],
            t[o],
            t[o + 1],
            kt,
            Mt
          ), e = t[o++], n = t[o++];
          break;
        case N.A:
          const c = t[o++], h = t[o++], f = t[o++], u = t[o++], d = t[o++], p = t[o++] + d;
          o += 1;
          const g = !t[o++];
          a && (s = de(d) * f + c, r = pe(d) * u + h), Ef(
            c,
            h,
            f,
            u,
            d,
            p,
            g,
            kt,
            Mt
          ), e = de(p) * f + c, n = pe(p) * u + h;
          break;
        case N.R:
          s = e = t[o++], r = n = t[o++];
          const _ = t[o++], m = t[o++];
          Co(s, r, s + _, r + m, kt, Mt);
          break;
        case N.Z:
          e = s, n = r;
          break;
      }
      ke(Pt, Pt, kt), Me($t, $t, Mt);
    }
    return o === 0 && (Pt[0] = Pt[1] = $t[0] = $t[1] = 0), new D(
      Pt[0],
      Pt[1],
      $t[0] - Pt[0],
      $t[1] - Pt[1]
    );
  }
  _calculateLength() {
    const t = this.data, e = this._len, n = this._ux, s = this._uy;
    let r = 0, o = 0, l = 0, a = 0;
    this._pathSegLen || (this._pathSegLen = []);
    const c = this._pathSegLen;
    let h = 0, f = 0;
    for (let u = 0; u < e; ) {
      const d = t[u++], p = u === 1;
      p && (r = t[u], o = t[u + 1], l = r, a = o);
      let g = -1;
      switch (d) {
        case N.M:
          r = l = t[u++], o = a = t[u++];
          break;
        case N.L: {
          const T = t[u++], S = t[u++], C = T - r, P = S - o;
          (zt(C) > n || zt(P) > s || u === e - 1) && (g = Math.sqrt(C * C + P * P), r = T, o = S);
          break;
        }
        case N.C: {
          const T = t[u++], S = t[u++], C = t[u++], P = t[u++], M = t[u++], k = t[u++];
          g = Oh(r, o, T, S, C, P, M, k, 10), r = M, o = k;
          break;
        }
        case N.Q: {
          const T = t[u++], S = t[u++], C = t[u++], P = t[u++];
          g = Nh(r, o, T, S, C, P, 10), r = C, o = P;
          break;
        }
        case N.A:
          const _ = t[u++], m = t[u++], y = t[u++], w = t[u++], b = t[u++];
          let v = t[u++];
          const x = v + b;
          u += 1, p && (l = de(b) * y + _, a = pe(b) * w + m), g = bs(y, w) * Ts(Vt, Math.abs(v)), r = de(x) * y + _, o = pe(x) * w + m;
          break;
        case N.R: {
          l = r = t[u++], a = o = t[u++];
          const T = t[u++], S = t[u++];
          g = T * 2 + S * 2;
          break;
        }
        case N.Z: {
          const T = l - r, S = a - o;
          g = Math.sqrt(T * T + S * S), r = l, o = a;
          break;
        }
      }
      g >= 0 && (c[f++] = g, h += g);
    }
    return this._pathLen = h, h;
  }
  /**
   * Rebuild path from current data
   * Rebuild path will not consider javascript implemented line dash.
   * @param {CanvasRenderingContext2D} ctx
   */
  rebuildPath(t, e) {
    const n = this.data, s = this._ux, r = this._uy, o = this._len;
    let l, a, c, h, f, u;
    const d = e < 1;
    let p, g, _ = 0, m = 0, y, w = 0, b, v;
    if (!(d && (this._pathSegLen || this._calculateLength(), p = this._pathSegLen, g = this._pathLen, y = e * g, !y)))
      t: for (let x = 0; x < o; ) {
        const T = n[x++], S = x === 1;
        switch (S && (c = n[x], h = n[x + 1], l = c, a = h), T !== N.L && w > 0 && (t.lineTo(b, v), w = 0), T) {
          case N.M:
            l = c = n[x++], a = h = n[x++], t.moveTo(c, h);
            break;
          case N.L: {
            f = n[x++], u = n[x++];
            const $ = zt(f - c), H = zt(u - h);
            if ($ > s || H > r) {
              if (d) {
                const J = p[m++];
                if (_ + J > y) {
                  const nt = (y - _) / J;
                  t.lineTo(c * (1 - nt) + f * nt, h * (1 - nt) + u * nt);
                  break t;
                }
                _ += J;
              }
              t.lineTo(f, u), c = f, h = u, w = 0;
            } else {
              const J = $ * $ + H * H;
              J > w && (b = f, v = u, w = J);
            }
            break;
          }
          case N.C: {
            const $ = n[x++], H = n[x++], J = n[x++], nt = n[x++], ne = n[x++], Ne = n[x++];
            if (d) {
              const Kn = p[m++];
              if (_ + Kn > y) {
                const jr = (y - _) / Kn;
                te(c, $, J, ne, jr, fe), te(h, H, nt, Ne, jr, ue), t.bezierCurveTo(fe[1], ue[1], fe[2], ue[2], fe[3], ue[3]);
                break t;
              }
              _ += Kn;
            }
            t.bezierCurveTo($, H, J, nt, ne, Ne), c = ne, h = Ne;
            break;
          }
          case N.Q: {
            const $ = n[x++], H = n[x++], J = n[x++], nt = n[x++];
            if (d) {
              const ne = p[m++];
              if (_ + ne > y) {
                const Ne = (y - _) / ne;
                Ln(c, $, J, Ne, fe), Ln(h, H, nt, Ne, ue), t.quadraticCurveTo(fe[1], ue[1], fe[2], ue[2]);
                break t;
              }
              _ += ne;
            }
            t.quadraticCurveTo($, H, J, nt), c = J, h = nt;
            break;
          }
          case N.A:
            const C = n[x++], P = n[x++], M = n[x++], k = n[x++];
            let A = n[x++], I = n[x++];
            const O = n[x++], E = !n[x++], q = M > k ? M : k, W = zt(M - k) > 1e-3;
            let Y = A + I, L = !1;
            if (d) {
              const $ = p[m++];
              _ + $ > y && (Y = A + I * (y - _) / $, L = !0), _ += $;
            }
            if (W && t.ellipse ? t.ellipse(C, P, M, k, O, A, Y, E) : t.arc(C, P, q, A, Y, E), L)
              break t;
            S && (l = de(A) * M + C, a = pe(A) * k + P), c = de(Y) * M + C, h = pe(Y) * k + P;
            break;
          case N.R:
            l = c = n[x], a = h = n[x + 1], f = n[x++], u = n[x++];
            const R = n[x++], Q = n[x++];
            if (d) {
              const $ = p[m++];
              if (_ + $ > y) {
                let H = y - _;
                t.moveTo(f, u), t.lineTo(f + Ts(H, R), u), H -= R, H > 0 && t.lineTo(f + R, u + Ts(H, Q)), H -= Q, H > 0 && t.lineTo(f + bs(R - H, 0), u + Q), H -= R, H > 0 && t.lineTo(f, u + bs(Q - H, 0));
                break t;
              }
              _ += $;
            }
            t.rect(f, u, R, Q);
            break;
          case N.Z:
            if (d) {
              const $ = p[m++];
              if (_ + $ > y) {
                const H = (y - _) / $;
                t.lineTo(c * (1 - H) + l * H, h * (1 - H) + a * H);
                break t;
              }
              _ += $;
            }
            t.closePath(), c = l, h = a;
        }
      }
  }
  clone() {
    const t = new Ct(), e = this.data;
    return t.data = e.slice ? e.slice() : Array.prototype.slice.call(e), t._len = this._len, t;
  }
  canSave() {
    return !!this._saveData;
  }
  static initDefaultProps = function() {
    const t = Ct.prototype;
    t._saveData = !0, t._ux = 0, t._uy = 0, t._pendingPtDist = 0, t._version = 0;
  }();
}
function Xe(i, t, e, n, s, r, o) {
  if (s === 0)
    return !1;
  const l = s;
  let a = 0, c = i;
  if (o > t + l && o > n + l || o < t - l && o < n - l || r > i + l && r > e + l || r < i - l && r < e - l)
    return !1;
  if (i !== e)
    a = (t - n) / (i - e), c = (i * n - e * t) / (i - e);
  else
    return Math.abs(r - i) <= l / 2;
  const h = a * r - o + c;
  return h * h / (a * a + 1) <= l / 2 * l / 2;
}
function Ff(i, t, e, n, s, r, o, l, a, c, h) {
  if (a === 0)
    return !1;
  const f = a;
  return h > t + f && h > n + f && h > r + f && h > l + f || h < t - f && h < n - f && h < r - f && h < l - f || c > i + f && c > e + f && c > s + f && c > o + f || c < i - f && c < e - f && c < s - f && c < o - f ? !1 : Eh(
    i,
    t,
    e,
    n,
    s,
    r,
    o,
    l,
    c,
    h
  ) <= f / 2;
}
function zf(i, t, e, n, s, r, o, l, a) {
  if (o === 0)
    return !1;
  const c = o;
  return a > t + c && a > n + c && a > r + c || a < t - c && a < n - c && a < r - c || l > i + c && l > e + c && l > s + c || l < i - c && l < e - c && l < s - c ? !1 : zh(
    i,
    t,
    e,
    n,
    s,
    r,
    l,
    a
  ) <= c / 2;
}
const Mo = Math.PI * 2;
function rn(i) {
  return i %= Mo, i < 0 && (i += Mo), i;
}
const _i = Math.PI * 2;
function Nf(i, t, e, n, s, r, o, l, a) {
  if (o === 0)
    return !1;
  const c = o;
  l -= i, a -= t;
  const h = Math.sqrt(l * l + a * a);
  if (h - c > e || h + c < e)
    return !1;
  if (Math.abs(n - s) % _i < 1e-4)
    return !0;
  if (r) {
    const u = n;
    n = rn(s), s = rn(u);
  } else
    n = rn(n), s = rn(s);
  n > s && (s += _i);
  let f = Math.atan2(a, l);
  return f < 0 && (f += _i), f >= n && f <= s || f + _i >= n && f + _i <= s;
}
function ge(i, t, e, n, s, r) {
  if (r > t && r > n || r < t && r < n || n === t)
    return 0;
  const o = (r - t) / (n - t);
  let l = n < t ? 1 : -1;
  (o === 1 || o === 0) && (l = n < t ? 0.5 : -0.5);
  const a = o * (e - i) + i;
  return a === s ? 1 / 0 : a > s ? l : 0;
}
const Gt = Ct.CMD, _e = Math.PI * 2, Bf = 1e-4;
function Hf(i, t) {
  return Math.abs(i - t) < Bf;
}
const et = [-1, -1, -1], _t = [-1, -1];
function Wf() {
  const i = _t[0];
  _t[0] = _t[1], _t[1] = i;
}
function Yf(i, t, e, n, s, r, o, l, a, c) {
  if (c > t && c > n && c > r && c > l || c < t && c < n && c < r && c < l)
    return 0;
  const h = ca(t, n, r, l, c, et);
  if (h === 0)
    return 0;
  {
    let f = 0, u = -1, d, p;
    for (let g = 0; g < h; g++) {
      let _ = et[g], m = _ === 0 || _ === 1 ? 0.5 : 1;
      it(i, e, s, o, _) < a || (u < 0 && (u = ha(t, n, r, l, _t), _t[1] < _t[0] && u > 1 && Wf(), d = it(t, n, r, l, _t[0]), u > 1 && (p = it(t, n, r, l, _t[1]))), u === 2 ? _ < _t[0] ? f += d < t ? m : -m : _ < _t[1] ? f += p < d ? m : -m : f += l < p ? m : -m : _ < _t[0] ? f += d < t ? m : -m : f += l < d ? m : -m);
    }
    return f;
  }
}
function Xf(i, t, e, n, s, r, o, l) {
  if (l > t && l > n && l > r || l < t && l < n && l < r)
    return 0;
  const a = Fh(t, n, r, l, et);
  if (a === 0)
    return 0;
  {
    const c = fa(t, n, r);
    if (c >= 0 && c <= 1) {
      let h = 0, f = rt(t, n, r, c);
      for (let u = 0; u < a; u++) {
        let d = et[u] === 0 || et[u] === 1 ? 0.5 : 1;
        rt(i, e, s, et[u]) < o || (et[u] < c ? h += f < t ? d : -d : h += r < f ? d : -d);
      }
      return h;
    } else {
      const h = et[0] === 0 || et[0] === 1 ? 0.5 : 1;
      return rt(i, e, s, et[0]) < o ? 0 : r < t ? h : -h;
    }
  }
}
function $f(i, t, e, n, s, r, o, l) {
  if (l -= t, l > e || l < -e)
    return 0;
  const a = Math.sqrt(e * e - l * l);
  et[0] = -a, et[1] = a;
  const c = Math.abs(n - s);
  if (c < 1e-4)
    return 0;
  if (c >= _e - 1e-4) {
    n = 0, s = _e;
    const f = r ? 1 : -1;
    return o >= et[0] + i && o <= et[1] + i ? f : 0;
  }
  if (n > s) {
    const f = n;
    n = s, s = f;
  }
  n < 0 && (n += _e, s += _e);
  let h = 0;
  for (let f = 0; f < 2; f++) {
    const u = et[f];
    if (u + i > o) {
      let d = Math.atan2(l, u), p = r ? 1 : -1;
      d < 0 && (d = _e + d), (d >= n && d <= s || d + _e >= n && d + _e <= s) && (d > Math.PI / 2 && d < Math.PI * 1.5 && (p = -p), h += p);
    }
  }
  return h;
}
function Da(i, t, e, n, s) {
  const r = i.data, o = i.len();
  let l = 0, a = 0, c = 0, h = 0, f = 0, u, d;
  for (let p = 0; p < o; ) {
    const g = r[p++], _ = p === 1;
    switch (g === Gt.M && p > 1 && (e || (l += ge(a, c, h, f, n, s))), _ && (a = r[p], c = r[p + 1], h = a, f = c), g) {
      case Gt.M:
        h = r[p++], f = r[p++], a = h, c = f;
        break;
      case Gt.L:
        if (e) {
          if (Xe(a, c, r[p], r[p + 1], t, n, s))
            return !0;
        } else
          l += ge(a, c, r[p], r[p + 1], n, s) || 0;
        a = r[p++], c = r[p++];
        break;
      case Gt.C:
        if (e) {
          if (Ff(
            a,
            c,
            r[p++],
            r[p++],
            r[p++],
            r[p++],
            r[p],
            r[p + 1],
            t,
            n,
            s
          ))
            return !0;
        } else
          l += Yf(
            a,
            c,
            r[p++],
            r[p++],
            r[p++],
            r[p++],
            r[p],
            r[p + 1],
            n,
            s
          ) || 0;
        a = r[p++], c = r[p++];
        break;
      case Gt.Q:
        if (e) {
          if (zf(
            a,
            c,
            r[p++],
            r[p++],
            r[p],
            r[p + 1],
            t,
            n,
            s
          ))
            return !0;
        } else
          l += Xf(
            a,
            c,
            r[p++],
            r[p++],
            r[p],
            r[p + 1],
            n,
            s
          ) || 0;
        a = r[p++], c = r[p++];
        break;
      case Gt.A:
        const m = r[p++], y = r[p++], w = r[p++], b = r[p++], v = r[p++], x = r[p++];
        p += 1;
        const T = !!(1 - r[p++]);
        u = Math.cos(v) * w + m, d = Math.sin(v) * b + y, _ ? (h = u, f = d) : l += ge(a, c, u, d, n, s);
        const S = (n - m) * b / w + m;
        if (e) {
          if (Nf(
            m,
            y,
            b,
            v,
            v + x,
            T,
            t,
            S,
            s
          ))
            return !0;
        } else
          l += $f(
            m,
            y,
            b,
            v,
            v + x,
            T,
            S,
            s
          );
        a = Math.cos(v + x) * w + m, c = Math.sin(v + x) * b + y;
        break;
      case Gt.R:
        h = a = r[p++], f = c = r[p++];
        const C = r[p++], P = r[p++];
        if (u = h + C, d = f + P, e) {
          if (Xe(h, f, u, f, t, n, s) || Xe(u, f, u, d, t, n, s) || Xe(u, d, h, d, t, n, s) || Xe(h, d, h, f, t, n, s))
            return !0;
        } else
          l += ge(u, f, u, d, n, s), l += ge(h, d, h, f, n, s);
        break;
      case Gt.Z:
        if (e) {
          if (Xe(
            a,
            c,
            h,
            f,
            t,
            n,
            s
          ))
            return !0;
        } else
          l += ge(a, c, h, f, n, s);
        a = h, c = f;
        break;
    }
  }
  return !e && !Hf(c, f) && (l += ge(a, c, h, f, n, s) || 0), l !== 0;
}
function Gf(i, t, e) {
  return Da(i, 0, !1, t, e);
}
function Vf(i, t, e, n) {
  return Da(i, t, !0, e, n);
}
const In = dt({
  fill: "#000",
  stroke: null,
  strokePercent: 1,
  fillOpacity: 1,
  strokeOpacity: 1,
  lineDashOffset: 0,
  lineWidth: 1,
  lineCap: "butt",
  miterLimit: 10,
  strokeNoScale: !1,
  strokeFirst: !1
}, Ee), Uf = {
  style: dt({
    fill: !0,
    stroke: !0,
    strokePercent: !0,
    fillOpacity: !0,
    strokeOpacity: !0,
    lineDashOffset: !0,
    lineWidth: !0,
    miterLimit: !0
  }, Un.style)
}, Cs = Oi.concat([
  "invisible",
  "culling",
  "z",
  "z2",
  "zlevel",
  "parent"
]);
class z extends ze {
  path;
  _rectStroke;
  _decalEl;
  constructor(t) {
    super(t);
  }
  update() {
    super.update();
    const t = this.style;
    if (t.decal) {
      const e = this._decalEl = this._decalEl || new z();
      e.buildPath === z.prototype.buildPath && (e.buildPath = (s) => {
        this.buildPath(s, this.shape);
      }), e.silent = !0;
      const n = e.style;
      for (let s in t)
        n[s] !== t[s] && (n[s] = t[s]);
      n.fill = t.fill ? t.decal : null, n.decal = null, n.shadowColor = null, t.strokeFirst && (n.stroke = null);
      for (let s = 0; s < Cs.length; ++s)
        e[Cs[s]] = this[Cs[s]];
      e.__dirty |= ut;
    } else this._decalEl && (this._decalEl = null);
  }
  getDecalElement() {
    return this._decalEl;
  }
  _init(t) {
    const e = X(t);
    this.shape = this.getDefaultShape();
    const n = this.getDefaultStyle();
    n && this.useStyle(n);
    for (let s = 0; s < e.length; s++) {
      const r = e[s], o = t[r];
      r === "style" ? this.style ? F(this.style, o) : this.useStyle(o) : r === "shape" ? F(this.shape, o) : super.attrKV(r, o);
    }
    this.style || this.useStyle({});
  }
  getDefaultStyle() {
    return null;
  }
  // Needs to override
  getDefaultShape() {
    return {};
  }
  canBeInsideText() {
    return this.hasFill();
  }
  getInsideTextFill() {
    const t = this.style.fill;
    if (t !== "none") {
      if (vt(t)) {
        const e = Ii(t, 0);
        return e > 0.5 ? nr : e > 0.2 ? mf : sr;
      } else if (t)
        return sr;
    }
    return nr;
  }
  getInsideTextStroke(t) {
    const e = this.style.fill;
    if (vt(e)) {
      const n = this.__zr, s = !!(n && n.isDarkMode()), r = Ii(t, 0) < ir;
      if (s === r)
        return e;
    }
  }
  // When bundling path, some shape may decide if use moveTo to begin a new subpath or closePath
  // Like in circle
  buildPath(t, e, n) {
  }
  pathUpdated() {
    this.__dirty &= ~Ue;
  }
  getUpdatedPathProxy(t) {
    return !this.path && this.createPathProxy(), this.path.beginPath(), this.buildPath(this.path, this.shape, t), this.path;
  }
  createPathProxy() {
    this.path = new Ct(!1);
  }
  hasStroke() {
    const t = this.style, e = t.stroke;
    return !(e == null || e === "none" || !(t.lineWidth > 0));
  }
  hasFill() {
    const e = this.style.fill;
    return e != null && e !== "none";
  }
  getBoundingRect() {
    let t = this._rect;
    const e = this.style, n = !t;
    if (n) {
      let s = !1;
      this.path || (s = !0, this.createPathProxy());
      let r = this.path;
      (s || this.__dirty & Ue) && (r.beginPath(), this.buildPath(r, this.shape, !1), this.pathUpdated()), t = r.getBoundingRect();
    }
    if (this._rect = t, this.hasStroke() && this.path && this.path.len() > 0) {
      const s = this._rectStroke || (this._rectStroke = t.clone());
      if (this.__dirty || n) {
        s.copy(t);
        const r = e.strokeNoScale ? this.getLineScale() : 1;
        let o = e.lineWidth;
        if (!this.hasFill()) {
          const l = this.strokeContainThreshold;
          o = Math.max(o, l ?? 4);
        }
        r > 1e-10 && (s.width += o / r, s.height += o / r, s.x -= o / r / 2, s.y -= o / r / 2);
      }
      return s;
    }
    return t;
  }
  contain(t, e) {
    const n = this.transformCoordToLocal(t, e), s = this.getBoundingRect(), r = this.style;
    if (t = n[0], e = n[1], s.contain(t, e)) {
      const o = this.path;
      if (this.hasStroke()) {
        let l = r.lineWidth, a = r.strokeNoScale ? this.getLineScale() : 1;
        if (a > 1e-10 && (this.hasFill() || (l = Math.max(l, this.strokeContainThreshold)), Vf(
          o,
          l / a,
          t,
          e
        )))
          return !0;
      }
      if (this.hasFill())
        return Gf(o, t, e);
    }
    return !1;
  }
  /**
   * Shape changed
   */
  dirtyShape() {
    this.__dirty |= Ue, this._rect && (this._rect = null), this._decalEl && this._decalEl.dirtyShape(), this.markRedraw();
  }
  dirty() {
    this.dirtyStyle(), this.dirtyShape();
  }
  /**
   * Alias for animate('shape')
   * @param {boolean} loop
   */
  animateShape(t) {
    return this.animate("shape", t);
  }
  // Override updateDuringAnimation
  updateDuringAnimation(t) {
    t === "style" ? this.dirtyStyle() : t === "shape" ? this.dirtyShape() : this.markRedraw();
  }
  // Overwrite attrKV
  attrKV(t, e) {
    t === "shape" ? this.setShape(e) : super.attrKV(t, e);
  }
  setShape(t, e) {
    let n = this.shape;
    return n || (n = this.shape = {}), typeof t == "string" ? n[t] = e : F(n, t), this.dirtyShape(), this;
  }
  /**
   * If shape changed. used with dirtyShape
   */
  shapeChanged() {
    return !!(this.__dirty & Ue);
  }
  /**
   * Create a path style object with default values in it's prototype.
   * @override
   */
  createStyle(t) {
    return $i(In, t);
  }
  _innerSaveToNormal(t) {
    super._innerSaveToNormal(t);
    const e = this._normalState;
    t.shape && !e.shape && (e.shape = F({}, this.shape));
  }
  _applyStateObj(t, e, n, s, r, o) {
    super._applyStateObj(t, e, n, s, r, o);
    const l = !(e && s);
    let a;
    if (e && e.shape ? r ? s ? a = e.shape : (a = F({}, n.shape), F(a, e.shape)) : (a = F({}, s ? this.shape : n.shape), F(a, e.shape)) : l && (a = n.shape), a)
      if (r) {
        this.shape = F({}, this.shape);
        const c = {}, h = X(a);
        for (let f = 0; f < h.length; f++) {
          const u = h[f];
          typeof a[u] == "object" ? this.shape[u] = a[u] : c[u] = a[u];
        }
        this._transitionState(t, {
          shape: c
        }, o);
      } else
        this.shape = a, this.dirtyShape();
  }
  _mergeStates(t) {
    const e = super._mergeStates(t);
    let n;
    for (let s = 0; s < t.length; s++) {
      const r = t[s];
      r.shape && (n = n || {}, this._mergeStyle(n, r.shape));
    }
    return n && (e.shape = n), e;
  }
  getAnimationStyleProps() {
    return Uf;
  }
  /**
   * If path shape is zero area
   */
  isZeroArea() {
    return !1;
  }
  /**
   * 扩展一个 Path element, 比如星形，圆等。
   * Extend a path element
   * @DEPRECATED Use class extends
   * @param props
   * @param props.type Path type
   * @param props.init Initialize
   * @param props.buildPath Overwrite buildPath method
   * @param props.style Extended default style config
   * @param props.shape Extended default shape config
   */
  static extend(t) {
    class e extends z {
      getDefaultStyle() {
        return Jt(t.style);
      }
      getDefaultShape() {
        return Jt(t.shape);
      }
      constructor(s) {
        super(s), t.init && t.init.call(this, s);
      }
    }
    for (let n in t)
      typeof t[n] == "function" && (e.prototype[n] = t[n]);
    return e;
  }
  static initDefaultProps = function() {
    const t = z.prototype;
    t.type = "path", t.strokeContainThreshold = 5, t.segmentIgnoreThreshold = 0, t.subPixelOptimize = !1, t.autoBatch = !1, t.__dirty = ut | wi | Ue;
  }();
}
const $e = Ct.CMD, qf = [[], [], []], Ao = Math.sqrt, Zf = Math.atan2;
function Ra(i, t) {
  if (!t)
    return;
  let e = i.data;
  const n = i.len();
  let s, r, o, l, a, c;
  const h = $e.M, f = $e.C, u = $e.L, d = $e.R, p = $e.A, g = $e.Q;
  for (o = 0, l = 0; o < n; ) {
    switch (s = e[o++], l = o, r = 0, s) {
      case h:
        r = 1;
        break;
      case u:
        r = 1;
        break;
      case f:
        r = 3;
        break;
      case g:
        r = 2;
        break;
      case p:
        const _ = t[4], m = t[5], y = Ao(t[0] * t[0] + t[1] * t[1]), w = Ao(t[2] * t[2] + t[3] * t[3]), b = Zf(-t[1] / w, t[0] / y);
        e[o] *= y, e[o++] += _, e[o] *= w, e[o++] += m, e[o++] *= y, e[o++] *= w, e[o++] += b, e[o++] += b, o += 2, l = o;
        break;
      case d:
        c[0] = e[o++], c[1] = e[o++], ni(c, c, t), e[l++] = c[0], e[l++] = c[1], c[0] += e[o++], c[1] += e[o++], ni(c, c, t), e[l++] = c[0], e[l++] = c[1];
    }
    for (a = 0; a < r; a++) {
      let _ = qf[a];
      _[0] = e[o++], _[1] = e[o++], ni(_, _, t), e[l++] = _[0], e[l++] = _[1];
    }
  }
  i.increaseVersion();
}
const Ps = Math.sqrt, on = Math.sin, ln = Math.cos, mi = Math.PI;
function Lo(i) {
  return Math.sqrt(i[0] * i[0] + i[1] * i[1]);
}
function ar(i, t) {
  return (i[0] * t[0] + i[1] * t[1]) / (Lo(i) * Lo(t));
}
function Do(i, t) {
  return (i[0] * t[1] < i[1] * t[0] ? -1 : 1) * Math.acos(ar(i, t));
}
function Ro(i, t, e, n, s, r, o, l, a, c, h) {
  const f = a * (mi / 180), u = ln(f) * (i - e) / 2 + on(f) * (t - n) / 2, d = -1 * on(f) * (i - e) / 2 + ln(f) * (t - n) / 2, p = u * u / (o * o) + d * d / (l * l);
  p > 1 && (o *= Ps(p), l *= Ps(p));
  const g = (s === r ? -1 : 1) * Ps(
    (o * o * (l * l) - o * o * (d * d) - l * l * (u * u)) / (o * o * (d * d) + l * l * (u * u))
  ) || 0, _ = g * o * d / l, m = g * -l * u / o, y = (i + e) / 2 + ln(f) * _ - on(f) * m, w = (t + n) / 2 + on(f) * _ + ln(f) * m, b = Do([1, 0], [(u - _) / o, (d - m) / l]), v = [(u - _) / o, (d - m) / l], x = [(-1 * u - _) / o, (-1 * d - m) / l];
  let T = Do(v, x);
  if (ar(v, x) <= -1 && (T = mi), ar(v, x) >= 1 && (T = 0), T < 0) {
    const S = Math.round(T / mi * 1e6) / 1e6;
    T = mi * 2 + S % 2 * mi;
  }
  h.addData(c, y, w, o, l, b, T, f, r);
}
const jf = /([mlvhzcqtsa])([^mlvhzcqtsa]*)/ig, Kf = /-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;
function Qf(i) {
  const t = new Ct();
  if (!i)
    return t;
  let e = 0, n = 0, s = e, r = n, o;
  const l = Ct.CMD, a = i.match(jf);
  if (!a)
    return t;
  for (let c = 0; c < a.length; c++) {
    const h = a[c];
    let f = h.charAt(0), u;
    const d = h.match(Kf) || [], p = d.length;
    for (let _ = 0; _ < p; _++)
      d[_] = parseFloat(d[_]);
    let g = 0;
    for (; g < p; ) {
      let _, m, y, w, b, v, x, T = e, S = n, C, P;
      switch (f) {
        case "l":
          e += d[g++], n += d[g++], u = l.L, t.addData(u, e, n);
          break;
        case "L":
          e = d[g++], n = d[g++], u = l.L, t.addData(u, e, n);
          break;
        case "m":
          e += d[g++], n += d[g++], u = l.M, t.addData(u, e, n), s = e, r = n, f = "l";
          break;
        case "M":
          e = d[g++], n = d[g++], u = l.M, t.addData(u, e, n), s = e, r = n, f = "L";
          break;
        case "h":
          e += d[g++], u = l.L, t.addData(u, e, n);
          break;
        case "H":
          e = d[g++], u = l.L, t.addData(u, e, n);
          break;
        case "v":
          n += d[g++], u = l.L, t.addData(u, e, n);
          break;
        case "V":
          n = d[g++], u = l.L, t.addData(u, e, n);
          break;
        case "C":
          u = l.C, t.addData(
            u,
            d[g++],
            d[g++],
            d[g++],
            d[g++],
            d[g++],
            d[g++]
          ), e = d[g - 2], n = d[g - 1];
          break;
        case "c":
          u = l.C, t.addData(
            u,
            d[g++] + e,
            d[g++] + n,
            d[g++] + e,
            d[g++] + n,
            d[g++] + e,
            d[g++] + n
          ), e += d[g - 2], n += d[g - 1];
          break;
        case "S":
          _ = e, m = n, C = t.len(), P = t.data, o === l.C && (_ += e - P[C - 4], m += n - P[C - 3]), u = l.C, T = d[g++], S = d[g++], e = d[g++], n = d[g++], t.addData(u, _, m, T, S, e, n);
          break;
        case "s":
          _ = e, m = n, C = t.len(), P = t.data, o === l.C && (_ += e - P[C - 4], m += n - P[C - 3]), u = l.C, T = e + d[g++], S = n + d[g++], e += d[g++], n += d[g++], t.addData(u, _, m, T, S, e, n);
          break;
        case "Q":
          T = d[g++], S = d[g++], e = d[g++], n = d[g++], u = l.Q, t.addData(u, T, S, e, n);
          break;
        case "q":
          T = d[g++] + e, S = d[g++] + n, e += d[g++], n += d[g++], u = l.Q, t.addData(u, T, S, e, n);
          break;
        case "T":
          _ = e, m = n, C = t.len(), P = t.data, o === l.Q && (_ += e - P[C - 4], m += n - P[C - 3]), e = d[g++], n = d[g++], u = l.Q, t.addData(u, _, m, e, n);
          break;
        case "t":
          _ = e, m = n, C = t.len(), P = t.data, o === l.Q && (_ += e - P[C - 4], m += n - P[C - 3]), e += d[g++], n += d[g++], u = l.Q, t.addData(u, _, m, e, n);
          break;
        case "A":
          y = d[g++], w = d[g++], b = d[g++], v = d[g++], x = d[g++], T = e, S = n, e = d[g++], n = d[g++], u = l.A, Ro(
            T,
            S,
            e,
            n,
            v,
            x,
            y,
            w,
            b,
            u,
            t
          );
          break;
        case "a":
          y = d[g++], w = d[g++], b = d[g++], v = d[g++], x = d[g++], T = e, S = n, e += d[g++], n += d[g++], u = l.A, Ro(
            T,
            S,
            e,
            n,
            v,
            x,
            y,
            w,
            b,
            u,
            t
          );
          break;
      }
    }
    (f === "z" || f === "Z") && (u = l.Z, t.addData(u), e = s, n = r), o = u;
  }
  return t.toStatic(), t;
}
class Ia extends z {
  applyTransform(t) {
  }
}
function Ea(i) {
  return i.setData != null;
}
function Oa(i, t) {
  const e = Qf(i), n = F({}, t);
  return n.buildPath = function(s) {
    const r = Ea(s);
    if (r && s.canSave()) {
      s.appendPath(e);
      const o = s.getContext();
      o && s.rebuildPath(o, 1);
    } else {
      const o = r ? s.getContext() : s;
      o && e.rebuildPath(o, 1);
    }
  }, n.applyTransform = function(s) {
    Ra(e, s), this.dirtyShape();
  }, n;
}
function Fa(i, t) {
  return new Ia(Oa(i, t));
}
function Jf(i, t) {
  const e = Oa(i, t);
  class n extends Ia {
    constructor(r) {
      super(r), this.applyTransform = e.applyTransform, this.buildPath = e.buildPath;
    }
  }
  return n;
}
function tu(i, t) {
  const e = [], n = i.length;
  for (let r = 0; r < n; r++) {
    const o = i[r];
    e.push(o.getUpdatedPathProxy(!0));
  }
  const s = new z(t);
  return s.createPathProxy(), s.buildPath = function(r) {
    if (Ea(r)) {
      r.appendPath(e);
      const o = r.getContext();
      o && r.rebuildPath(o, 1);
    }
  }, s;
}
function Nr(i, t) {
  t = t || {};
  const e = new z();
  return i.shape && e.setShape(i.shape), e.setStyle(i.style), t.bakeTransform ? Ra(e.path, i.getComputedTransform()) : t.toLocal ? e.setLocalTransform(i.getComputedTransform()) : e.copyTransform(i), e.buildPath = i.buildPath, e.applyTransform = e.applyTransform, e.z = i.z, e.z2 = i.z2, e.zlevel = i.zlevel, e;
}
const Xp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clonePath: Nr,
  createFromString: Fa,
  extendFromString: Jf,
  mergePath: tu
}, Symbol.toStringTag, { value: "Module" })), eu = dt({
  x: 0,
  y: 0
}, Ee), iu = {
  style: dt({
    x: !0,
    y: !0,
    width: !0,
    height: !0,
    sx: !0,
    sy: !0,
    sWidth: !0,
    sHeight: !0
  }, Un.style)
};
function nu(i) {
  return !!(i && typeof i != "string" && i.width && i.height);
}
class fi extends ze {
  // FOR CANVAS RENDERER
  __image;
  // FOR SVG RENDERER
  __imageSrc;
  onload;
  /**
   * Create an image style object with default values in it's prototype.
   * @override
   */
  createStyle(t) {
    return $i(eu, t);
  }
  _getSize(t) {
    const e = this.style;
    let n = e[t];
    if (n != null)
      return n;
    const s = nu(e.image) ? e.image : this.__image;
    if (!s)
      return 0;
    const r = t === "width" ? "height" : "width";
    let o = e[r];
    return o == null ? s[t] : s[t] / s[r] * o;
  }
  getWidth() {
    return this._getSize("width");
  }
  getHeight() {
    return this._getSize("height");
  }
  getAnimationStyleProps() {
    return iu;
  }
  getBoundingRect() {
    const t = this.style;
    return this._rect || (this._rect = new D(
      t.x || 0,
      t.y || 0,
      this.getWidth(),
      this.getHeight()
    )), this._rect;
  }
}
fi.prototype.type = "image";
class su {
  cx = 0;
  cy = 0;
  r = 0;
}
class za extends z {
  constructor(t) {
    super(t);
  }
  getDefaultShape() {
    return new su();
  }
  buildPath(t, e) {
    t.moveTo(e.cx + e.r, e.cy), t.arc(e.cx, e.cy, e.r, 0, Math.PI * 2);
  }
}
za.prototype.type = "circle";
function ru(i, t) {
  let e = t.x, n = t.y, s = t.width, r = t.height, o = t.r, l, a, c, h;
  s < 0 && (e = e + s, s = -s), r < 0 && (n = n + r, r = -r), typeof o == "number" ? l = a = c = h = o : o instanceof Array ? o.length === 1 ? l = a = c = h = o[0] : o.length === 2 ? (l = c = o[0], a = h = o[1]) : o.length === 3 ? (l = o[0], a = h = o[1], c = o[2]) : (l = o[0], a = o[1], c = o[2], h = o[3]) : l = a = c = h = 0;
  let f;
  l + a > s && (f = l + a, l *= s / f, a *= s / f), c + h > s && (f = c + h, c *= s / f, h *= s / f), a + c > r && (f = a + c, a *= r / f, c *= r / f), l + h > r && (f = l + h, l *= r / f, h *= r / f), i.moveTo(e + l, n), i.lineTo(e + s - a, n), a !== 0 && i.arc(e + s - a, n + a, a, -Math.PI / 2, 0), i.lineTo(e + s, n + r - c), c !== 0 && i.arc(e + s - c, n + r - c, c, 0, Math.PI / 2), i.lineTo(e + h, n + r), h !== 0 && i.arc(e + h, n + r - h, h, Math.PI / 2, Math.PI), i.lineTo(e, n + l), l !== 0 && i.arc(e + l, n + l, l, Math.PI, Math.PI * 1.5);
}
const Ke = Math.round;
function ou(i, t, e) {
  if (!t)
    return;
  const n = t.x1, s = t.x2, r = t.y1, o = t.y2;
  i.x1 = n, i.x2 = s, i.y1 = r, i.y2 = o;
  const l = e && e.lineWidth;
  return l && (Ke(n * 2) === Ke(s * 2) && (i.x1 = i.x2 = Qe(n, l, !0)), Ke(r * 2) === Ke(o * 2) && (i.y1 = i.y2 = Qe(r, l, !0))), i;
}
function lu(i, t, e) {
  if (!t)
    return;
  const n = t.x, s = t.y, r = t.width, o = t.height;
  i.x = n, i.y = s, i.width = r, i.height = o;
  const l = e && e.lineWidth;
  return l && (i.x = Qe(n, l, !0), i.y = Qe(s, l, !0), i.width = Math.max(
    Qe(n + r, l, !1) - i.x,
    r === 0 ? 0 : 1
  ), i.height = Math.max(
    Qe(s + o, l, !1) - i.y,
    o === 0 ? 0 : 1
  )), i;
}
function Qe(i, t, e) {
  if (!t)
    return i;
  const n = Ke(i * 2);
  return (n + Ke(t)) % 2 === 0 ? n / 2 : (n + (e ? 1 : -1)) / 2;
}
class au {
  // 左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
  // r缩写为1         相当于 [1, 1, 1, 1]
  // r缩写为[1]       相当于 [1, 1, 1, 1]
  // r缩写为[1, 2]    相当于 [1, 2, 1, 2]
  // r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
  r;
  x = 0;
  y = 0;
  width = 0;
  height = 0;
}
const cu = {};
class Ni extends z {
  constructor(t) {
    super(t);
  }
  getDefaultShape() {
    return new au();
  }
  buildPath(t, e) {
    let n, s, r, o;
    if (this.subPixelOptimize) {
      const l = lu(cu, e, this.style);
      n = l.x, s = l.y, r = l.width, o = l.height, l.r = e.r, e = l;
    } else
      n = e.x, s = e.y, r = e.width, o = e.height;
    e.r ? ru(t, e) : t.rect(n, s, r, o);
  }
  isZeroArea() {
    return !this.shape.width || !this.shape.height;
  }
}
Ni.prototype.type = "rect";
class hu {
  cx = 0;
  cy = 0;
  rx = 0;
  ry = 0;
}
class Na extends z {
  constructor(t) {
    super(t);
  }
  getDefaultShape() {
    return new hu();
  }
  buildPath(t, e) {
    const n = 0.5522848, s = e.cx, r = e.cy, o = e.rx, l = e.ry, a = o * n, c = l * n;
    t.moveTo(s - o, r), t.bezierCurveTo(s - o, r - c, s - a, r - l, s, r - l), t.bezierCurveTo(s + a, r - l, s + o, r - c, s + o, r), t.bezierCurveTo(s + o, r + c, s + a, r + l, s, r + l), t.bezierCurveTo(s - a, r + l, s - o, r + c, s - o, r), t.closePath();
  }
}
Na.prototype.type = "ellipse";
const fu = {};
class uu {
  // Start point
  x1 = 0;
  y1 = 0;
  // End point
  x2 = 0;
  y2 = 0;
  percent = 1;
}
class Ba extends z {
  constructor(t) {
    super(t);
  }
  getDefaultStyle() {
    return {
      stroke: "#000",
      fill: null
    };
  }
  getDefaultShape() {
    return new uu();
  }
  buildPath(t, e) {
    let n, s, r, o;
    if (this.subPixelOptimize) {
      const a = ou(
        fu,
        e,
        this.style
      );
      n = a.x1, s = a.y1, r = a.x2, o = a.y2;
    } else
      n = e.x1, s = e.y1, r = e.x2, o = e.y2;
    const l = e.percent;
    l !== 0 && (t.moveTo(n, s), l < 1 && (r = n * (1 - l) + r * l, o = s * (1 - l) + o * l), t.lineTo(r, o));
  }
  /**
   * Get point at percent
   */
  pointAt(t) {
    const e = this.shape;
    return [
      e.x1 * (1 - t) + e.x2 * t,
      e.y1 * (1 - t) + e.y2 * t
    ];
  }
}
Ba.prototype.type = "line";
function du(i, t, e, n) {
  const s = [], r = [], o = [], l = [];
  let a, c, h, f;
  if (n) {
    h = [1 / 0, 1 / 0], f = [-1 / 0, -1 / 0];
    for (let u = 0, d = i.length; u < d; u++)
      ke(h, h, i[u]), Me(f, f, i[u]);
    ke(h, h, n[0]), Me(f, f, n[1]);
  }
  for (let u = 0, d = i.length; u < d; u++) {
    const p = i[u];
    if (e)
      a = i[u ? u - 1 : d - 1], c = i[(u + 1) % d];
    else if (u === 0 || u === d - 1) {
      s.push(Ul(i[u]));
      continue;
    } else
      a = i[u - 1], c = i[u + 1];
    ql(r, c, a), wn(r, r, t);
    let g = kn(p, a), _ = kn(p, c);
    const m = g + _;
    m !== 0 && (g /= m, _ /= m), wn(o, r, -g), wn(l, r, _);
    const y = Ws([], p, o), w = Ws([], p, l);
    n && (Me(y, y, h), ke(y, y, f), Me(w, w, h), ke(w, w, f)), s.push(y), s.push(w);
  }
  return e && s.push(s.shift()), s;
}
function Ha(i, t, e) {
  const n = t.smooth;
  let s = t.points;
  if (s && s.length >= 2) {
    if (n) {
      const r = du(
        s,
        n,
        e,
        t.smoothConstraint
      );
      i.moveTo(s[0][0], s[0][1]);
      const o = s.length;
      for (let l = 0; l < (e ? o : o - 1); l++) {
        const a = r[l * 2], c = r[l * 2 + 1], h = s[(l + 1) % o];
        i.bezierCurveTo(
          a[0],
          a[1],
          c[0],
          c[1],
          h[0],
          h[1]
        );
      }
    } else {
      i.moveTo(s[0][0], s[0][1]);
      for (let r = 1, o = s.length; r < o; r++)
        i.lineTo(s[r][0], s[r][1]);
    }
    e && i.closePath();
  }
}
class pu {
  points = null;
  smooth = 0;
  smoothConstraint = null;
}
class Br extends z {
  constructor(t) {
    super(t);
  }
  getDefaultShape() {
    return new pu();
  }
  buildPath(t, e) {
    Ha(t, e, !0);
  }
}
Br.prototype.type = "polygon";
class gu {
  points = null;
  // Percent of displayed polyline. For animating purpose
  percent = 1;
  smooth = 0;
  smoothConstraint = null;
}
class Wa extends z {
  constructor(t) {
    super(t);
  }
  getDefaultStyle() {
    return {
      stroke: "#000",
      fill: null
    };
  }
  getDefaultShape() {
    return new gu();
  }
  buildPath(t, e) {
    Ha(t, e, !1);
  }
}
Wa.prototype.type = "polyline";
class Ya {
  id;
  type;
  colorStops;
  global;
  constructor(t) {
    this.colorStops = t || [];
  }
  addColorStop(t, e) {
    this.colorStops.push({
      offset: t,
      color: e
    });
  }
}
class _u extends Ya {
  x;
  y;
  x2;
  y2;
  constructor(t, e, n, s, r, o) {
    super(r), this.x = t ?? 0, this.y = e ?? 0, this.x2 = n ?? 1, this.y2 = s ?? 0, this.type = "linear", this.global = o || !1;
  }
}
class mu extends Ya {
  x;
  y;
  r;
  constructor(t, e, n, s, r) {
    super(s), this.x = t ?? 0.5, this.y = e ?? 0.5, this.r = n ?? 0.5, this.type = "radial", this.global = r || !1;
  }
}
const cr = new Di(50);
function yu(i) {
  if (typeof i == "string") {
    const t = cr.get(i);
    return t && t.image;
  } else
    return i;
}
function Hr(i, t, e, n, s) {
  if (i)
    if (typeof i == "string") {
      if (t && t.__zrImageSrc === i || !e)
        return t;
      const r = cr.get(i), o = { hostEl: e, cb: n, cbPayload: s };
      return r ? (t = r.image, !qn(t) && r.pending.push(o)) : (t = Ft.loadImage(
        i,
        Io,
        Io
      ), t.__zrImageSrc = i, cr.put(
        i,
        t.__cachedImgObj = {
          image: t,
          pending: [o]
        }
      )), t;
    } else
      return i;
  else return t;
}
function Io() {
  const i = this.__cachedImgObj;
  this.onload = this.onerror = this.__cachedImgObj = null;
  for (let t = 0; t < i.pending.length; t++) {
    const e = i.pending[t], n = e.cb;
    n && n(this, e.cbPayload), e.hostEl.dirty();
  }
  i.pending.length = 0;
}
function qn(i) {
  return i && i.width && i.height;
}
const ks = /\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;
function wu(i, t, e, n, s, r) {
  if (!e) {
    i.text = "", i.isTruncated = !1;
    return;
  }
  const o = (t + "").split(`
`);
  r = Xa(e, n, s, r);
  let l = !1;
  const a = {};
  for (let c = 0, h = o.length; c < h; c++)
    $a(a, o[c], r), o[c] = a.textLine, l = l || a.isTruncated;
  i.text = o.join(`
`), i.isTruncated = l;
}
function Xa(i, t, e, n) {
  n = n || {};
  let s = F({}, n);
  e = U(e, "..."), s.maxIterations = U(n.maxIterations, 2);
  const r = s.minChar = U(n.minChar, 0), o = s.fontMeasureInfo = Wt(t), l = o.asciiCharWidth;
  s.placeholder = U(n.placeholder, "");
  let a = i = Math.max(0, i - 1);
  for (let h = 0; h < r && a >= l; h++)
    a -= l;
  let c = Yt(o, e);
  return c > a && (e = "", c = 0), a = i - c, s.ellipsis = e, s.ellipsisWidth = c, s.contentWidth = a, s.containerWidth = i, s;
}
function $a(i, t, e) {
  const n = e.containerWidth, s = e.contentWidth, r = e.fontMeasureInfo;
  if (!n) {
    i.textLine = "", i.isTruncated = !1;
    return;
  }
  let o = Yt(r, t);
  if (o <= n) {
    i.textLine = t, i.isTruncated = !1;
    return;
  }
  for (let l = 0; ; l++) {
    if (o <= s || l >= e.maxIterations) {
      t += e.ellipsis;
      break;
    }
    const a = l === 0 ? xu(t, s, r) : o > 0 ? Math.floor(t.length * s / o) : 0;
    t = t.substr(0, a), o = Yt(r, t);
  }
  t === "" && (t = e.placeholder), i.textLine = t, i.isTruncated = !0;
}
function xu(i, t, e) {
  let n = 0, s = 0;
  for (let r = i.length; s < r && n < t; s++)
    n += ka(e, i.charCodeAt(s));
  return s;
}
function Tu(i, t, e, n) {
  const s = Wr(i), r = t.overflow, o = t.padding, l = o ? o[1] + o[3] : 0, a = o ? o[0] + o[2] : 0, c = t.font, h = r === "truncate", f = Vn(c), u = U(t.lineHeight, f), d = t.lineOverflow === "truncate";
  let p = !1, g = t.width;
  g == null && e != null && (g = e - l);
  let _ = t.height;
  _ == null && n != null && (_ = n - a);
  let m;
  g != null && (r === "break" || r === "breakAll") ? m = s ? Ga(s, t.font, g, r === "breakAll", 0).lines : [] : m = s ? s.split(`
`) : [];
  let y = m.length * u;
  if (_ == null && (_ = y), y > _ && d) {
    const T = Math.floor(_ / u);
    p = p || m.length > T, m = m.slice(0, T), y = m.length * u;
  }
  if (s && h && g != null) {
    const T = Xa(g, c, t.ellipsis, {
      minChar: t.truncateMinChar,
      placeholder: t.placeholder
    }), S = {};
    for (let C = 0; C < m.length; C++)
      $a(S, m[C], T), m[C] = S.textLine, p = p || S.isTruncated;
  }
  let w = _, b = 0;
  const v = Wt(c);
  for (let T = 0; T < m.length; T++)
    b = Math.max(Yt(v, m[T]), b);
  g == null && (g = b);
  let x = g;
  return w += a, x += l, {
    lines: m,
    height: _,
    outerWidth: x,
    outerHeight: w,
    lineHeight: u,
    calculatedLineHeight: f,
    contentWidth: b,
    contentHeight: y,
    width: g,
    isTruncated: p
  };
}
class bu {
  styleName;
  text;
  // Includes `tokenStyle.padding`
  width;
  height;
  // Inner height exclude padding
  // i.e., `retrieve2(tokenStyle.height, token.contentHeight)`
  innerHeight;
  // Width and height of actual text content.
  contentHeight;
  contentWidth;
  lineHeight;
  font;
  align;
  verticalAlign;
  textPadding;
  percentWidth;
  isLineHolder;
}
class Eo {
  lineHeight;
  width;
  tokens = [];
  constructor(t) {
    t && (this.tokens = t);
  }
}
class Su {
  // i.e. `retrieve2(outermostStyle.width, contentWidth)`.
  // exclude outermost style.padding.
  width = 0;
  height = 0;
  // Calculated text width/height based on content (including tokenStyle.padding).
  contentWidth = 0;
  contentHeight = 0;
  // i.e., contentBlock.width/height + outermostStyle.padding
  // `borderWidth` is not included here, because historically Path is placed regardless of `lineWidth`,
  // and `outerWidth`/`outerHeight` is used to calculate placement.
  outerWidth = 0;
  outerHeight = 0;
  lines = [];
  // Be `true` if and only if the result text is modified due to overflow, due to
  // settings on either `overflow` or `lineOverflow`
  isTruncated = !1;
}
function vu(i, t, e, n, s) {
  const r = new Su(), o = Wr(i);
  if (!o)
    return r;
  const l = t.padding, a = l ? l[1] + l[3] : 0, c = l ? l[0] + l[2] : 0;
  let h = t.width;
  h == null && e != null && (h = e - a);
  let f = t.height;
  f == null && n != null && (f = n - c);
  const u = t.overflow;
  let d = (u === "break" || u === "breakAll") && h != null ? { width: h, accumWidth: 0, breakAll: u === "breakAll" } : null, p = ks.lastIndex = 0, g;
  for (; (g = ks.exec(o)) != null; ) {
    const T = g.index;
    T > p && Ms(r, o.substring(p, T), t, d), Ms(r, g[2], t, d, g[1]), p = ks.lastIndex;
  }
  p < o.length && Ms(r, o.substring(p, o.length), t, d);
  let _ = [], m = 0, y = 0;
  const w = u === "truncate", b = t.lineOverflow === "truncate", v = {};
  function x(T, S, C) {
    T.width = S, T.lineHeight = C, m += C, y = Math.max(y, S);
  }
  t: for (let T = 0; T < r.lines.length; T++) {
    const S = r.lines[T];
    let C = 0, P = 0;
    for (let M = 0; M < S.tokens.length; M++) {
      const k = S.tokens[M], A = k.styleName && t.rich[k.styleName] || {}, I = k.textPadding = A.padding, O = I ? I[1] + I[3] : 0, E = k.font = A.font || t.font;
      k.contentHeight = Vn(E);
      let q = U(
        // textHeight should not be inherited, consider it can be specified
        // as box height of the block.
        A.height,
        k.contentHeight
      );
      if (k.innerHeight = q, I && (q += I[0] + I[2]), k.height = q, k.lineHeight = vi(
        A.lineHeight,
        t.lineHeight,
        q
      ), k.align = A && A.align || s, k.verticalAlign = A && A.verticalAlign || "middle", b && f != null && m + k.lineHeight > f) {
        const L = r.lines.length;
        M > 0 ? (S.tokens = S.tokens.slice(0, M), x(S, P, C), r.lines = r.lines.slice(0, T + 1)) : r.lines = r.lines.slice(0, T), r.isTruncated = r.isTruncated || r.lines.length < L;
        break t;
      }
      let W = A.width, Y = W == null || W === "auto";
      if (typeof W == "string" && W.charAt(W.length - 1) === "%")
        k.percentWidth = W, _.push(k), k.contentWidth = Yt(Wt(E), k.text);
      else {
        if (Y) {
          const R = A.backgroundColor;
          let Q = R && R.image;
          Q && (Q = yu(Q), qn(Q) && (k.width = Math.max(k.width, Q.width * q / Q.height)));
        }
        const L = w && h != null ? h - P : null;
        L != null && L < k.width ? !Y || L < O ? (k.text = "", k.width = k.contentWidth = 0) : (wu(
          v,
          k.text,
          L - O,
          E,
          t.ellipsis,
          { minChar: t.truncateMinChar }
        ), k.text = v.text, r.isTruncated = r.isTruncated || v.isTruncated, k.width = k.contentWidth = Yt(Wt(E), k.text)) : k.contentWidth = Yt(Wt(E), k.text);
      }
      k.width += O, P += k.width, A && (C = Math.max(C, k.lineHeight));
    }
    x(S, P, C);
  }
  r.outerWidth = r.width = U(h, y), r.outerHeight = r.height = U(f, m), r.contentHeight = m, r.contentWidth = y, r.outerWidth += a, r.outerHeight += c;
  for (let T = 0; T < _.length; T++) {
    const S = _[T], C = S.percentWidth;
    S.width = parseInt(C, 10) / 100 * r.width;
  }
  return r;
}
function Ms(i, t, e, n, s) {
  const r = t === "", o = s && e.rich[s] || {}, l = i.lines, a = o.font || e.font;
  let c = !1, h, f;
  if (n) {
    const d = o.padding;
    let p = d ? d[1] + d[3] : 0;
    if (o.width != null && o.width !== "auto") {
      const g = zi(o.width, n.width) + p;
      l.length > 0 && g + n.accumWidth > n.width && (h = t.split(`
`), c = !0), n.accumWidth = g;
    } else {
      const g = Ga(t, a, n.width, n.breakAll, n.accumWidth);
      n.accumWidth = g.accumWidth + p, f = g.linesWidths, h = g.lines;
    }
  }
  h || (h = t.split(`
`));
  const u = Wt(a);
  for (let d = 0; d < h.length; d++) {
    const p = h[d], g = new bu();
    if (g.styleName = s, g.text = p, g.isLineHolder = !p && !r, typeof o.width == "number" ? g.width = o.width : g.width = f ? f[d] : Yt(u, p), !d && !c) {
      const _ = (l[l.length - 1] || (l[0] = new Eo())).tokens, m = _.length;
      m === 1 && _[0].isLineHolder ? _[0] = g : (p || !m || r) && _.push(g);
    } else
      l.push(new Eo([g]));
  }
}
function Cu(i) {
  let t = i.charCodeAt(0);
  return t >= 32 && t <= 591 || t >= 880 && t <= 4351 || t >= 4608 && t <= 5119 || t >= 7680 && t <= 8303;
}
const Pu = Yi(",&?/;] ".split(""), function(i, t) {
  return i[t] = !0, i;
}, {});
function ku(i) {
  return Cu(i) ? !!Pu[i] : !0;
}
function Ga(i, t, e, n, s) {
  let r = [], o = [], l = "", a = "", c = 0, h = 0;
  const f = Wt(t);
  for (let u = 0; u < i.length; u++) {
    const d = i.charAt(u);
    if (d === `
`) {
      a && (l += a, h += c), r.push(l), o.push(h), l = "", a = "", c = 0, h = 0;
      continue;
    }
    const p = ka(f, d.charCodeAt(0)), g = n ? !1 : !ku(d);
    if (r.length ? h + p > e : s + h + p > e) {
      h ? (l || a) && (g ? (l || (l = a, a = "", c = 0, h = c), r.push(l), o.push(h - c), a += d, c += p, l = "", h = c) : (a && (l += a, a = "", c = 0), r.push(l), o.push(h), l = d, h = p)) : g ? (r.push(a), o.push(c), a = d, c = p) : (r.push(d), o.push(p));
      continue;
    }
    h += p, g ? (a += d, c += p) : (a && (l += a, a = "", c = 0), l += d);
  }
  return a && (l += a), l && (r.push(l), o.push(h)), r.length === 1 && (h += s), {
    // Accum width of last line
    accumWidth: h,
    lines: r,
    linesWidths: o
  };
}
function Oo(i, t, e, n, s, r) {
  if (i.baseX = e, i.baseY = n, i.outerWidth = i.outerHeight = null, !t)
    return;
  const o = t.width * 2, l = t.height * 2;
  D.set(
    Fo,
    Fi(e, o, s),
    oi(n, l, r),
    o,
    l
  ), D.intersect(t, Fo, null, zo);
  const a = zo.outIntersectRect;
  i.outerWidth = a.width, i.outerHeight = a.height, i.baseX = Fi(a.x, a.width, s, !0), i.baseY = oi(a.y, a.height, r, !0);
}
const Fo = new D(0, 0, 0, 0), zo = { outIntersectRect: {}, clamp: !0 };
function Wr(i) {
  return i != null ? i += "" : i = "";
}
function Mu(i) {
  const t = Wr(i.text), e = i.font, n = Yt(Wt(e), t), s = Vn(e);
  return hr(
    i,
    n,
    s,
    null
  );
}
function hr(i, t, e, n) {
  const s = new D(
    Fi(i.x || 0, t, i.textAlign),
    oi(i.y || 0, e, i.textBaseline),
    /**
     * Text boundary should be the real text width.
     * Otherwise, there will be extra space in the
     * bounding rect calculated.
     */
    t,
    e
  ), r = n ?? (Va(i) ? i.lineWidth : 0);
  return r > 0 && (s.x -= r / 2, s.y -= r / 2, s.width += r, s.height += r), s;
}
function Va(i) {
  const t = i.stroke;
  return t != null && t !== "none" && i.lineWidth > 0;
}
const Au = dt({
  strokeFirst: !0,
  font: Xt,
  x: 0,
  y: 0,
  textAlign: "left",
  textBaseline: "top",
  miterLimit: 2
}, In);
class ee extends ze {
  hasStroke() {
    return Va(this.style);
  }
  hasFill() {
    const e = this.style.fill;
    return e != null && e !== "none";
  }
  /**
   * Create an image style object with default values in it's prototype.
   * @override
   */
  createStyle(t) {
    return $i(Au, t);
  }
  /**
   * Set bounding rect calculated from Text
   * For reducing time of calculating bounding rect.
   */
  setBoundingRect(t) {
    this._rect = t;
  }
  getBoundingRect() {
    return this._rect || (this._rect = Mu(this.style)), this._rect;
  }
  static initDefaultProps = function() {
    const t = ee.prototype;
    t.dirtyRectTolerance = 10;
  }();
}
ee.prototype.type = "tspan";
function Lu(i) {
  vt(i) && (i = new DOMParser().parseFromString(i, "text/xml"));
  let t = i;
  for (t.nodeType === 9 && (t = t.firstChild); t.nodeName.toLowerCase() !== "svg" || t.nodeType !== 1; )
    t = t.nextSibling;
  return t;
}
let As;
const En = {
  fill: "fill",
  stroke: "stroke",
  "stroke-width": "lineWidth",
  opacity: "opacity",
  "fill-opacity": "fillOpacity",
  "stroke-opacity": "strokeOpacity",
  "stroke-dasharray": "lineDash",
  "stroke-dashoffset": "lineDashOffset",
  "stroke-linecap": "lineCap",
  "stroke-linejoin": "lineJoin",
  "stroke-miterlimit": "miterLimit",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-style": "fontStyle",
  "font-weight": "fontWeight",
  "text-anchor": "textAlign",
  visibility: "visibility",
  display: "display"
}, No = X(En), On = {
  "alignment-baseline": "textBaseline",
  "stop-color": "stopColor"
}, Bo = X(On);
class Du {
  _defs = {};
  // The use of <defs> can be in front of <defs> declared.
  // So save them temporarily in `_defsUsePending`.
  _defsUsePending;
  _root = null;
  _textX;
  _textY;
  parse(t, e) {
    e = e || {};
    const n = Lu(t);
    if (process.env.NODE_ENV !== "production" && !n)
      throw new Error("Illegal svg");
    this._defsUsePending = [];
    let s = new Se();
    this._root = s;
    const r = [], o = n.getAttribute("viewBox") || "";
    let l = parseFloat(n.getAttribute("width") || e.width), a = parseFloat(n.getAttribute("height") || e.height);
    isNaN(l) && (l = null), isNaN(a) && (a = null), ht(n, s, null, !0, !1);
    let c = n.firstChild;
    for (; c; )
      this._parseNode(c, s, r, null, !1, !1), c = c.nextSibling;
    Eu(this._defs, this._defsUsePending), this._defsUsePending = [];
    let h, f;
    if (o) {
      const u = Zn(o);
      u.length >= 4 && (h = {
        x: parseFloat(u[0] || 0),
        y: parseFloat(u[1] || 0),
        width: parseFloat(u[2]),
        height: parseFloat(u[3])
      });
    }
    if (h && l != null && a != null && (f = Bu(h, { x: 0, y: 0, width: l, height: a }), !e.ignoreViewBox)) {
      const u = s;
      s = new Se(), s.add(u), u.scaleX = u.scaleY = f.scale, u.x = f.x, u.y = f.y;
    }
    return !e.ignoreRootClip && l != null && a != null && s.setClipPath(new Ni({
      shape: { x: 0, y: 0, width: l, height: a }
    })), {
      root: s,
      width: l,
      height: a,
      viewBoxRect: h,
      viewBoxTransform: f,
      named: r
    };
  }
  _parseNode(t, e, n, s, r, o) {
    const l = t.nodeName.toLowerCase();
    let a, c = s;
    if (l === "defs" && (r = !0), l === "text" && (o = !0), l === "defs" || l === "switch")
      a = e;
    else {
      if (!r) {
        const f = As[l];
        if (f && Li(As, l)) {
          a = f.call(this, t, e);
          const u = t.getAttribute("name");
          if (u) {
            const d = {
              name: u,
              namedFrom: null,
              svgNodeTagLower: l,
              el: a
            };
            n.push(d), l === "g" && (c = d);
          } else s && n.push({
            name: s.name,
            namedFrom: s,
            svgNodeTagLower: l,
            el: a
          });
          e.add(a);
        }
      }
      const h = Ho[l];
      if (h && Li(Ho, l)) {
        const f = h.call(this, t), u = t.getAttribute("id");
        u && (this._defs[u] = f);
      }
    }
    if (a && a.isGroup) {
      let h = t.firstChild;
      for (; h; )
        h.nodeType === 1 ? this._parseNode(h, a, n, c, r, o) : h.nodeType === 3 && o && this._parseText(h, a), h = h.nextSibling;
    }
  }
  _parseText(t, e) {
    const n = new ee({
      style: {
        text: t.textContent
      },
      silent: !0,
      x: this._textX || 0,
      y: this._textY || 0
    });
    pt(e, n), ht(t, n, this._defsUsePending, !1, !1), Ru(n, e);
    const s = n.style, r = s.fontSize;
    r && r < 9 && (s.fontSize = 9, n.scaleX *= r / 9, n.scaleY *= r / 9);
    const o = (s.fontSize || s.fontFamily) && [
      s.fontStyle,
      s.fontWeight,
      (s.fontSize || 12) + "px",
      // If font properties are defined, `fontFamily` should not be ignored.
      s.fontFamily || "sans-serif"
    ].join(" ");
    s.font = o;
    const l = n.getBoundingRect();
    return this._textX += l.width, e.add(n), n;
  }
  static internalField = function() {
    As = {
      g: function(t, e) {
        const n = new Se();
        return pt(e, n), ht(t, n, this._defsUsePending, !1, !1), n;
      },
      rect: function(t, e) {
        const n = new Ni();
        return pt(e, n), ht(t, n, this._defsUsePending, !1, !1), n.setShape({
          x: parseFloat(t.getAttribute("x") || "0"),
          y: parseFloat(t.getAttribute("y") || "0"),
          width: parseFloat(t.getAttribute("width") || "0"),
          height: parseFloat(t.getAttribute("height") || "0")
        }), n.silent = !0, n;
      },
      circle: function(t, e) {
        const n = new za();
        return pt(e, n), ht(t, n, this._defsUsePending, !1, !1), n.setShape({
          cx: parseFloat(t.getAttribute("cx") || "0"),
          cy: parseFloat(t.getAttribute("cy") || "0"),
          r: parseFloat(t.getAttribute("r") || "0")
        }), n.silent = !0, n;
      },
      line: function(t, e) {
        const n = new Ba();
        return pt(e, n), ht(t, n, this._defsUsePending, !1, !1), n.setShape({
          x1: parseFloat(t.getAttribute("x1") || "0"),
          y1: parseFloat(t.getAttribute("y1") || "0"),
          x2: parseFloat(t.getAttribute("x2") || "0"),
          y2: parseFloat(t.getAttribute("y2") || "0")
        }), n.silent = !0, n;
      },
      ellipse: function(t, e) {
        const n = new Na();
        return pt(e, n), ht(t, n, this._defsUsePending, !1, !1), n.setShape({
          cx: parseFloat(t.getAttribute("cx") || "0"),
          cy: parseFloat(t.getAttribute("cy") || "0"),
          rx: parseFloat(t.getAttribute("rx") || "0"),
          ry: parseFloat(t.getAttribute("ry") || "0")
        }), n.silent = !0, n;
      },
      polygon: function(t, e) {
        const n = t.getAttribute("points");
        let s;
        n && (s = Xo(n));
        const r = new Br({
          shape: {
            points: s || []
          },
          silent: !0
        });
        return pt(e, r), ht(t, r, this._defsUsePending, !1, !1), r;
      },
      polyline: function(t, e) {
        const n = t.getAttribute("points");
        let s;
        n && (s = Xo(n));
        const r = new Wa({
          shape: {
            points: s || []
          },
          silent: !0
        });
        return pt(e, r), ht(t, r, this._defsUsePending, !1, !1), r;
      },
      image: function(t, e) {
        const n = new fi();
        return pt(e, n), ht(t, n, this._defsUsePending, !1, !1), n.setStyle({
          image: t.getAttribute("xlink:href") || t.getAttribute("href"),
          x: +t.getAttribute("x"),
          y: +t.getAttribute("y"),
          width: +t.getAttribute("width"),
          height: +t.getAttribute("height")
        }), n.silent = !0, n;
      },
      text: function(t, e) {
        const n = t.getAttribute("x") || "0", s = t.getAttribute("y") || "0", r = t.getAttribute("dx") || "0", o = t.getAttribute("dy") || "0";
        this._textX = parseFloat(n) + parseFloat(r), this._textY = parseFloat(s) + parseFloat(o);
        const l = new Se();
        return pt(e, l), ht(t, l, this._defsUsePending, !1, !0), l;
      },
      tspan: function(t, e) {
        const n = t.getAttribute("x"), s = t.getAttribute("y");
        n != null && (this._textX = parseFloat(n)), s != null && (this._textY = parseFloat(s));
        const r = t.getAttribute("dx") || "0", o = t.getAttribute("dy") || "0", l = new Se();
        return pt(e, l), ht(t, l, this._defsUsePending, !1, !0), this._textX += parseFloat(r), this._textY += parseFloat(o), l;
      },
      path: function(t, e) {
        const n = t.getAttribute("d") || "", s = Fa(n);
        return pt(e, s), ht(t, s, this._defsUsePending, !1, !1), s.silent = !0, s;
      }
    };
  }();
}
const Ho = {
  lineargradient: function(i) {
    const t = parseInt(i.getAttribute("x1") || "0", 10), e = parseInt(i.getAttribute("y1") || "0", 10), n = parseInt(i.getAttribute("x2") || "10", 10), s = parseInt(i.getAttribute("y2") || "0", 10), r = new _u(t, e, n, s);
    return Wo(i, r), Yo(i, r), r;
  },
  radialgradient: function(i) {
    const t = parseInt(i.getAttribute("cx") || "0", 10), e = parseInt(i.getAttribute("cy") || "0", 10), n = parseInt(i.getAttribute("r") || "0", 10), s = new mu(t, e, n);
    return Wo(i, s), Yo(i, s), s;
  }
  // TODO
  // 'pattern': function (xmlNode: SVGElement) {
  // }
};
function Wo(i, t) {
  i.getAttribute("gradientUnits") === "userSpaceOnUse" && (t.global = !0);
}
function Yo(i, t) {
  let e = i.firstChild;
  for (; e; ) {
    if (e.nodeType === 1 && e.nodeName.toLocaleLowerCase() === "stop") {
      const n = e.getAttribute("offset");
      let s;
      n && n.indexOf("%") > 0 ? s = parseInt(n, 10) / 100 : n ? s = parseFloat(n) : s = 0;
      const r = {};
      Ua(e, r, r);
      let o = r.stopColor || e.getAttribute("stop-color") || "#000000";
      const l = r.stopOpacity || e.getAttribute("stop-opacity");
      if (l) {
        const a = ct(o);
        a && a[3] && (a[3] *= Ht(l), o = ie(a, "rgba"));
      }
      t.colorStops.push({
        offset: s,
        color: o
      });
    }
    e = e.nextSibling;
  }
}
function pt(i, t) {
  i && i.__inheritedStyle && (t.__inheritedStyle || (t.__inheritedStyle = {}), dt(t.__inheritedStyle, i.__inheritedStyle));
}
function Xo(i) {
  const t = Zn(i), e = [];
  for (let n = 0; n < t.length; n += 2) {
    const s = parseFloat(t[n]), r = parseFloat(t[n + 1]);
    e.push([s, r]);
  }
  return e;
}
function ht(i, t, e, n, s) {
  const r = t, o = r.__inheritedStyle = r.__inheritedStyle || {}, l = {};
  i.nodeType === 1 && (zu(i, t), Ua(i, o, l), n || Nu(i, o, l)), r.style = r.style || {}, o.fill != null && (r.style.fill = $o(r, "fill", o.fill, e)), o.stroke != null && (r.style.stroke = $o(r, "stroke", o.stroke, e)), K([
    "lineWidth",
    "opacity",
    "fillOpacity",
    "strokeOpacity",
    "miterLimit",
    "fontSize"
  ], function(a) {
    o[a] != null && (r.style[a] = parseFloat(o[a]));
  }), K([
    "lineDashOffset",
    "lineCap",
    "lineJoin",
    "fontWeight",
    "fontFamily",
    "fontStyle",
    "textAlign"
  ], function(a) {
    o[a] != null && (r.style[a] = o[a]);
  }), s && (r.__selfStyle = l), o.lineDash && (r.style.lineDash = V(Zn(o.lineDash), function(a) {
    return parseFloat(a);
  })), (o.visibility === "hidden" || o.visibility === "collapse") && (r.invisible = !0), o.display === "none" && (r.ignore = !0);
}
function Ru(i, t) {
  const e = t.__selfStyle;
  if (e) {
    const s = e.textBaseline;
    let r = s;
    !s || s === "auto" || s === "baseline" ? r = "alphabetic" : s === "before-edge" || s === "text-before-edge" ? r = "top" : s === "after-edge" || s === "text-after-edge" ? r = "bottom" : (s === "central" || s === "mathematical") && (r = "middle"), i.style.textBaseline = r;
  }
  const n = t.__inheritedStyle;
  if (n) {
    const s = n.textAlign;
    let r = s;
    s && (s === "middle" && (r = "center"), i.style.textAlign = r);
  }
}
const Iu = /^url\(\s*#(.*?)\)/;
function $o(i, t, e, n) {
  const s = e && e.match(Iu);
  if (s) {
    const r = Pe(s[1]);
    n.push([i, t, r]);
    return;
  }
  return e === "none" && (e = null), e;
}
function Eu(i, t) {
  for (let e = 0; e < t.length; e++) {
    const n = t[e];
    n[0].style[n[1]] = i[n[2]];
  }
}
const Ou = /-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;
function Zn(i) {
  return i.match(Ou) || [];
}
const Fu = /(translate|scale|rotate|skewX|skewY|matrix)\(([\-\s0-9\.eE,]*)\)/g, Ls = Math.PI / 180;
function zu(i, t) {
  let e = i.getAttribute("transform");
  if (e) {
    e = e.replace(/,/g, " ");
    const n = [];
    let s = null;
    e.replace(Fu, function(r, o, l) {
      return n.push(o, l), "";
    });
    for (let r = n.length - 1; r > 0; r -= 2) {
      const o = n[r], l = n[r - 1], a = Zn(o);
      switch (s = s || Kt(), l) {
        case "translate":
          Mn(s, s, [parseFloat(a[0]), parseFloat(a[1] || "0")]);
          break;
        case "scale":
          Ir(s, s, [parseFloat(a[0]), parseFloat(a[1] || a[0])]);
          break;
        case "rotate":
          Rr(s, s, -parseFloat(a[0]) * Ls, [
            parseFloat(a[1] || "0"),
            parseFloat(a[2] || "0")
          ]);
          break;
        case "skewX":
          const c = Math.tan(parseFloat(a[0]) * Ls);
          si(s, [1, 0, c, 1, 0, 0], s);
          break;
        case "skewY":
          const h = Math.tan(parseFloat(a[0]) * Ls);
          si(s, [1, h, 0, 1, 0, 0], s);
          break;
        case "matrix":
          s[0] = parseFloat(a[0]), s[1] = parseFloat(a[1]), s[2] = parseFloat(a[2]), s[3] = parseFloat(a[3]), s[4] = parseFloat(a[4]), s[5] = parseFloat(a[5]);
          break;
      }
    }
    t.setLocalTransform(s);
  }
}
const Go = /([^\s:;]+)\s*:\s*([^:;]+)/g;
function Ua(i, t, e) {
  const n = i.getAttribute("style");
  if (!n)
    return;
  Go.lastIndex = 0;
  let s;
  for (; (s = Go.exec(n)) != null; ) {
    const r = s[1], o = Li(En, r) ? En[r] : null;
    o && (t[o] = s[2]);
    const l = Li(On, r) ? On[r] : null;
    l && (e[l] = s[2]);
  }
}
function Nu(i, t, e) {
  for (let n = 0; n < No.length; n++) {
    const s = No[n], r = i.getAttribute(s);
    r != null && (t[En[s]] = r);
  }
  for (let n = 0; n < Bo.length; n++) {
    const s = Bo[n], r = i.getAttribute(s);
    r != null && (e[On[s]] = r);
  }
}
function Bu(i, t) {
  const e = t.width / i.width, n = t.height / i.height, s = Math.min(e, n);
  return {
    scale: s,
    x: -(i.x + i.width / 2) * s + (t.x + t.width / 2),
    y: -(i.y + i.height / 2) * s + (t.y + t.height / 2)
  };
}
function $p(i, t) {
  return new Du().parse(i, t);
}
const qa = Math.PI, Ds = qa * 2, me = Math.sin, Ge = Math.cos, Hu = Math.acos, tt = Math.atan2, Vo = Math.abs, Mi = Math.sqrt, bi = Math.max, At = Math.min, yt = 1e-4;
function Wu(i, t, e, n, s, r, o, l) {
  const a = e - i, c = n - t, h = o - s, f = l - r;
  let u = f * a - h * c;
  if (!(u * u < yt))
    return u = (h * (t - r) - f * (i - s)) / u, [i + u * a, t + u * c];
}
function an(i, t, e, n, s, r, o) {
  const l = i - e, a = t - n, c = (o ? r : -r) / Mi(l * l + a * a), h = c * a, f = -c * l, u = i + h, d = t + f, p = e + h, g = n + f, _ = (u + p) / 2, m = (d + g) / 2, y = p - u, w = g - d, b = y * y + w * w, v = s - r, x = u * g - p * d, T = (w < 0 ? -1 : 1) * Mi(bi(0, v * v * b - x * x));
  let S = (x * w - y * T) / b, C = (-x * y - w * T) / b;
  const P = (x * w + y * T) / b, M = (-x * y + w * T) / b, k = S - _, A = C - m, I = P - _, O = M - m;
  return k * k + A * A > I * I + O * O && (S = P, C = M), {
    cx: S,
    cy: C,
    x0: -h,
    y0: -f,
    x1: S * (s / v - 1),
    y1: C * (s / v - 1)
  };
}
function Yu(i) {
  let t;
  if (Oe(i)) {
    const e = i.length;
    if (!e)
      return i;
    e === 1 ? t = [i[0], i[0], 0, 0] : e === 2 ? t = [i[0], i[0], i[1], i[1]] : e === 3 ? t = i.concat(i[2]) : t = i;
  } else
    t = [i, i, i, i];
  return t;
}
function Xu(i, t) {
  let e = bi(t.r, 0), n = bi(t.r0 || 0, 0);
  const s = e > 0, r = n > 0;
  if (!s && !r)
    return;
  if (s || (e = n, n = 0), n > e) {
    const d = e;
    e = n, n = d;
  }
  const { startAngle: o, endAngle: l } = t;
  if (isNaN(o) || isNaN(l))
    return;
  const { cx: a, cy: c } = t, h = !!t.clockwise;
  let f = Vo(l - o);
  const u = f > Ds && f % Ds;
  if (u > yt && (f = u), !(e > yt))
    i.moveTo(a, c);
  else if (f > Ds - yt)
    i.moveTo(
      a + e * Ge(o),
      c + e * me(o)
    ), i.arc(a, c, e, o, l, !h), n > yt && (i.moveTo(
      a + n * Ge(l),
      c + n * me(l)
    ), i.arc(a, c, n, l, o, h));
  else {
    let d, p, g, _, m, y, w, b, v, x, T, S, C, P, M, k;
    const A = e * Ge(o), I = e * me(o), O = n * Ge(l), E = n * me(l), q = f > yt;
    if (q) {
      const W = t.cornerRadius;
      W && ([d, p, g, _] = Yu(W));
      const Y = Vo(e - n) / 2;
      if (m = At(Y, g), y = At(Y, _), w = At(Y, d), b = At(Y, p), T = v = bi(m, y), S = x = bi(w, b), (v > yt || x > yt) && (C = e * Ge(l), P = e * me(l), M = n * Ge(o), k = n * me(o), f < qa)) {
        const L = Wu(A, I, M, k, C, P, O, E);
        if (L) {
          const R = A - L[0], Q = I - L[1], $ = C - L[0], H = P - L[1], J = 1 / me(
            // eslint-disable-next-line max-len
            Hu((R * $ + Q * H) / (Mi(R * R + Q * Q) * Mi($ * $ + H * H))) / 2
          ), nt = Mi(L[0] * L[0] + L[1] * L[1]);
          T = At(v, (e - nt) / (J + 1)), S = At(x, (n - nt) / (J - 1));
        }
      }
    }
    if (!q)
      i.moveTo(a + A, c + I);
    else if (T > yt) {
      const W = At(g, T), Y = At(_, T), L = an(M, k, A, I, e, W, h), R = an(C, P, O, E, e, Y, h);
      i.moveTo(a + L.cx + L.x0, c + L.cy + L.y0), T < v && W === Y ? i.arc(a + L.cx, c + L.cy, T, tt(L.y0, L.x0), tt(R.y0, R.x0), !h) : (W > 0 && i.arc(a + L.cx, c + L.cy, W, tt(L.y0, L.x0), tt(L.y1, L.x1), !h), i.arc(a, c, e, tt(L.cy + L.y1, L.cx + L.x1), tt(R.cy + R.y1, R.cx + R.x1), !h), Y > 0 && i.arc(a + R.cx, c + R.cy, Y, tt(R.y1, R.x1), tt(R.y0, R.x0), !h));
    } else
      i.moveTo(a + A, c + I), i.arc(a, c, e, o, l, !h);
    if (!(n > yt) || !q)
      i.lineTo(a + O, c + E);
    else if (S > yt) {
      const W = At(d, S), Y = At(p, S), L = an(O, E, C, P, n, -Y, h), R = an(A, I, M, k, n, -W, h);
      i.lineTo(a + L.cx + L.x0, c + L.cy + L.y0), S < x && W === Y ? i.arc(a + L.cx, c + L.cy, S, tt(L.y0, L.x0), tt(R.y0, R.x0), !h) : (Y > 0 && i.arc(a + L.cx, c + L.cy, Y, tt(L.y0, L.x0), tt(L.y1, L.x1), !h), i.arc(a, c, n, tt(L.cy + L.y1, L.cx + L.x1), tt(R.cy + R.y1, R.cx + R.x1), h), W > 0 && i.arc(a + R.cx, c + R.cy, W, tt(R.y1, R.x1), tt(R.y0, R.x0), !h));
    } else
      i.lineTo(a + O, c + E), i.arc(a, c, n, l, o, h);
  }
  i.closePath();
}
class $u {
  cx = 0;
  cy = 0;
  r0 = 0;
  r = 0;
  startAngle = 0;
  endAngle = Math.PI * 2;
  clockwise = !0;
  /**
   * Corner radius of sector
   *
   * clockwise, from inside to outside, four corners are
   * inner start -> inner end
   * outer start -> outer end
   *
   * 5               => [5, 5, 5, 5]
   * [5]             => [5, 5, 0, 0]
   * [5, 10]         => [5, 5, 10, 10]
   * [5, 10, 15]     => [5, 10, 15, 15]
   * [5, 10, 15, 20] => [5, 10, 15, 20]
   */
  cornerRadius = 0;
}
class fr extends z {
  constructor(t) {
    super(t);
  }
  getDefaultShape() {
    return new $u();
  }
  buildPath(t, e) {
    Xu(t, e);
  }
  isZeroArea() {
    return this.shape.startAngle === this.shape.endAngle || this.shape.r === this.shape.r0;
  }
}
fr.prototype.type = "sector";
const Lt = Ct.CMD;
function Je(i, t) {
  return Math.abs(i - t) < 1e-5;
}
function ur(i) {
  const t = i.data, e = i.len(), n = [];
  let s, r = 0, o = 0, l = 0, a = 0;
  function c(_, m) {
    s && s.length > 2 && n.push(s), s = [_, m];
  }
  function h(_, m, y, w) {
    Je(_, y) && Je(m, w) || s.push(_, m, y, w, y, w);
  }
  function f(_, m, y, w, b, v) {
    const x = Math.abs(m - _), T = Math.tan(x / 4) * 4 / 3, S = m < _ ? -1 : 1, C = Math.cos(_), P = Math.sin(_), M = Math.cos(m), k = Math.sin(m), A = C * b + y, I = P * v + w, O = M * b + y, E = k * v + w, q = b * T * S, W = v * T * S;
    s.push(
      // Move control points on tangent.
      A - q * P,
      I + W * C,
      O + q * k,
      E - W * M,
      O,
      E
    );
  }
  let u, d, p, g;
  for (let _ = 0; _ < e; ) {
    const m = t[_++], y = _ === 1;
    switch (y && (r = t[_], o = t[_ + 1], l = r, a = o, (m === Lt.L || m === Lt.C || m === Lt.Q) && (s = [l, a])), m) {
      case Lt.M:
        r = l = t[_++], o = a = t[_++], c(l, a);
        break;
      case Lt.L:
        u = t[_++], d = t[_++], h(r, o, u, d), r = u, o = d;
        break;
      case Lt.C:
        s.push(
          t[_++],
          t[_++],
          t[_++],
          t[_++],
          r = t[_++],
          o = t[_++]
        );
        break;
      case Lt.Q:
        u = t[_++], d = t[_++], p = t[_++], g = t[_++], s.push(
          // Convert quadratic to cubic
          r + 2 / 3 * (u - r),
          o + 2 / 3 * (d - o),
          p + 2 / 3 * (u - p),
          g + 2 / 3 * (d - g),
          p,
          g
        ), r = p, o = g;
        break;
      case Lt.A:
        const w = t[_++], b = t[_++], v = t[_++], x = t[_++], T = t[_++], S = t[_++] + T;
        _ += 1;
        const C = !t[_++];
        u = Math.cos(T) * v + w, d = Math.sin(T) * x + b, y ? (l = u, a = d, c(l, a)) : h(r, o, u, d), r = Math.cos(S) * v + w, o = Math.sin(S) * x + b;
        const P = (C ? -1 : 1) * Math.PI / 2;
        for (let M = T; C ? M > S : M < S; M += P) {
          const k = C ? Math.max(M + P, S) : Math.min(M + P, S);
          f(M, k, w, b, v, x);
        }
        break;
      case Lt.R:
        l = r = t[_++], a = o = t[_++], u = l + t[_++], d = a + t[_++], c(u, a), h(u, a, u, d), h(u, d, l, d), h(l, d, l, a), h(l, a, u, a);
        break;
      case Lt.Z:
        s && h(r, o, l, a), r = l, o = a;
        break;
    }
  }
  return s && s.length > 2 && n.push(s), n;
}
function dr(i, t, e, n, s, r, o, l, a, c) {
  if (Je(i, e) && Je(t, n) && Je(s, o) && Je(r, l)) {
    a.push(o, l);
    return;
  }
  const h = 2 / c, f = h * h;
  let u = o - i, d = l - t;
  const p = Math.sqrt(u * u + d * d);
  u /= p, d /= p;
  const g = e - i, _ = n - t, m = s - o, y = r - l, w = g * g + _ * _, b = m * m + y * y;
  if (w < f && b < f) {
    a.push(o, l);
    return;
  }
  const v = u * g + d * _, x = -u * m - d * y, T = w - v * v, S = b - x * x;
  if (T < f && v >= 0 && S < f && x >= 0) {
    a.push(o, l);
    return;
  }
  const C = [], P = [];
  te(i, e, s, o, 0.5, C), te(t, n, r, l, 0.5, P), dr(
    C[0],
    P[0],
    C[1],
    P[1],
    C[2],
    P[2],
    C[3],
    P[3],
    a,
    c
  ), dr(
    C[4],
    P[4],
    C[5],
    P[5],
    C[6],
    P[6],
    C[7],
    P[7],
    a,
    c
  );
}
function Gu(i, t) {
  const e = ur(i), n = [];
  t = t || 1;
  for (let s = 0; s < e.length; s++) {
    const r = e[s], o = [];
    let l = r[0], a = r[1];
    o.push(l, a);
    for (let c = 2; c < r.length; ) {
      const h = r[c++], f = r[c++], u = r[c++], d = r[c++], p = r[c++], g = r[c++];
      dr(l, a, h, f, u, d, p, g, o, t), l = p, a = g;
    }
    n.push(o);
  }
  return n;
}
function Za(i, t, e) {
  const n = i[t], s = i[1 - t], r = Math.abs(n / s);
  let o = Math.ceil(Math.sqrt(r * e)), l = Math.floor(e / o);
  l === 0 && (l = 1, o = e);
  const a = [];
  for (let f = 0; f < o; f++)
    a.push(l);
  const c = o * l, h = e - c;
  if (h > 0)
    for (let f = 0; f < h; f++)
      a[f % o] += 1;
  return a;
}
function Uo(i, t, e) {
  const n = i.r0, s = i.r, r = i.startAngle, o = i.endAngle, l = Math.abs(o - r), a = l * s, c = s - n, h = a > Math.abs(c), f = Za([a, c], h ? 0 : 1, t), u = (h ? l : c) / f.length;
  for (let d = 0; d < f.length; d++) {
    const p = (h ? c : l) / f[d];
    for (let g = 0; g < f[d]; g++) {
      const _ = {};
      h ? (_.startAngle = r + u * d, _.endAngle = r + u * (d + 1), _.r0 = n + p * g, _.r = n + p * (g + 1)) : (_.startAngle = r + p * g, _.endAngle = r + p * (g + 1), _.r0 = n + u * d, _.r = n + u * (d + 1)), _.clockwise = i.clockwise, _.cx = i.cx, _.cy = i.cy, e.push(_);
    }
  }
}
function Vu(i, t, e) {
  const n = i.width, s = i.height, r = n > s, o = Za([n, s], r ? 0 : 1, t), l = r ? "width" : "height", a = r ? "height" : "width", c = r ? "x" : "y", h = r ? "y" : "x", f = i[l] / o.length;
  for (let u = 0; u < o.length; u++) {
    const d = i[a] / o[u];
    for (let p = 0; p < o[u]; p++) {
      const g = {};
      g[c] = u * f, g[h] = p * d, g[l] = f, g[a] = d, g.x += i.x, g.y += i.y, e.push(g);
    }
  }
}
function qo(i, t, e, n) {
  return i * n - e * t;
}
function Uu(i, t, e, n, s, r, o, l) {
  const a = e - i, c = n - t, h = o - s, f = l - r, u = qo(h, f, a, c);
  if (Math.abs(u) < 1e-6)
    return null;
  const d = i - s, p = t - r, g = qo(d, p, h, f) / u;
  return g < 0 || g > 1 ? null : new B(
    g * a + i,
    g * c + t
  );
}
function qu(i, t, e) {
  const n = new B();
  B.sub(n, e, t), n.normalize();
  const s = new B();
  return B.sub(s, i, t), s.dot(n);
}
function Ve(i, t) {
  const e = i[i.length - 1];
  e && e[0] === t[0] && e[1] === t[1] || i.push(t);
}
function Zu(i, t, e) {
  const n = i.length, s = [];
  for (let f = 0; f < n; f++) {
    const u = i[f], d = i[(f + 1) % n], p = Uu(
      u[0],
      u[1],
      d[0],
      d[1],
      t.x,
      t.y,
      e.x,
      e.y
    );
    p && s.push({
      projPt: qu(p, t, e),
      pt: p,
      idx: f
    });
  }
  if (s.length < 2)
    return [{ points: i }, { points: i }];
  s.sort((f, u) => f.projPt - u.projPt);
  let r = s[0], o = s[s.length - 1];
  if (o.idx < r.idx) {
    const f = r;
    r = o, o = f;
  }
  const l = [r.pt.x, r.pt.y], a = [o.pt.x, o.pt.y], c = [l], h = [a];
  for (let f = r.idx + 1; f <= o.idx; f++)
    Ve(c, i[f].slice());
  Ve(c, a), Ve(c, l);
  for (let f = o.idx + 1; f <= r.idx + n; f++)
    Ve(h, i[f % n].slice());
  return Ve(h, l), Ve(h, a), [{
    points: c
  }, {
    points: h
  }];
}
function Zo(i) {
  const t = i.points, e = [], n = [];
  La(t, e, n);
  const s = new D(
    e[0],
    e[1],
    n[0] - e[0],
    n[1] - e[1]
  ), r = s.width, o = s.height, l = s.x, a = s.y, c = new B(), h = new B();
  return r > o ? (c.x = h.x = l + r / 2, c.y = a, h.y = a + o) : (c.y = h.y = a + o / 2, c.x = l, h.x = l + r), Zu(t, c, h);
}
function Fn(i, t, e, n) {
  if (e === 1)
    n.push(t);
  else {
    const s = Math.floor(e / 2), r = i(t);
    Fn(i, r[0], s, n), Fn(i, r[1], e - s, n);
  }
  return n;
}
function ju(i, t) {
  const e = [];
  for (let n = 0; n < t; n++)
    e.push(Nr(i));
  return e;
}
function Ku(i, t) {
  t.setStyle(i.style), t.z = i.z, t.z2 = i.z2, t.zlevel = i.zlevel;
}
function Qu(i) {
  const t = [];
  for (let e = 0; e < i.length; )
    t.push([i[e++], i[e++]]);
  return t;
}
function ja(i, t) {
  const e = [], n = i.shape;
  let s;
  switch (i.type) {
    case "rect":
      Vu(n, t, e), s = Ni;
      break;
    case "sector":
      Uo(n, t, e), s = fr;
      break;
    case "circle":
      Uo({
        r0: 0,
        r: n.r,
        startAngle: 0,
        endAngle: Math.PI * 2,
        cx: n.cx,
        cy: n.cy
      }, t, e), s = fr;
      break;
    default:
      const o = i.getComputedTransform(), l = o ? Math.sqrt(Math.max(o[0] * o[0] + o[1] * o[1], o[2] * o[2] + o[3] * o[3])) : 1, a = V(
        Gu(i.getUpdatedPathProxy(), l),
        (h) => Qu(h)
      ), c = a.length;
      if (c === 0)
        Fn(Zo, {
          points: a[0]
        }, t, e);
      else if (c === t)
        for (let h = 0; h < c; h++)
          e.push({
            points: a[h]
          });
      else {
        let h = 0;
        const f = V(a, (d) => {
          const p = [], g = [];
          La(d, p, g);
          const _ = (g[1] - p[1]) * (g[0] - p[0]);
          return h += _, { poly: d, area: _ };
        });
        f.sort((d, p) => p.area - d.area);
        let u = t;
        for (let d = 0; d < c; d++) {
          const p = f[d];
          if (u <= 0)
            break;
          const g = d === c - 1 ? u : Math.ceil(p.area / h * t);
          g < 0 || (Fn(Zo, {
            points: p.poly
          }, g, e), u -= g);
        }
      }
      s = Br;
      break;
  }
  if (!s)
    return ju(i, t);
  const r = [];
  for (let o = 0; o < e.length; o++) {
    const l = new s();
    l.setShape(e[o]), Ku(i, l), r.push(l);
  }
  return r;
}
function Ju(i, t) {
  const e = i.length, n = t.length;
  if (e === n)
    return [i, t];
  const s = [], r = [], o = e < n ? i : t, l = Math.min(e, n), a = Math.abs(n - e) / 6, c = (l - 2) / 6, h = Math.ceil(a / c) + 1, f = [o[0], o[1]];
  let u = a;
  for (let d = 2; d < l; ) {
    let p = o[d - 2], g = o[d - 1], _ = o[d++], m = o[d++], y = o[d++], w = o[d++], b = o[d++], v = o[d++];
    if (u <= 0) {
      f.push(_, m, y, w, b, v);
      continue;
    }
    let x = Math.min(u, h - 1) + 1;
    for (let T = 1; T <= x; T++) {
      const S = T / x;
      te(p, _, y, b, S, s), te(g, m, w, v, S, r), p = s[3], g = r[3], f.push(s[1], r[1], s[2], r[2], p, g), _ = s[5], m = r[5], y = s[6], w = r[6];
    }
    u -= x - 1;
  }
  return o === i ? [f, t] : [i, f];
}
function jo(i, t) {
  const e = i.length, n = i[e - 2], s = i[e - 1], r = [];
  for (let o = 0; o < t.length; )
    r[o++] = n, r[o++] = s;
  return r;
}
function Ka(i, t) {
  let e, n, s = [], r = [];
  for (let o = 0; o < Math.max(i.length, t.length); o++) {
    const l = i[o], a = t[o];
    let c, h;
    l ? a ? ([c, h] = Ju(l, a), e = c, n = h) : (h = jo(n || l, l), c = l) : (c = jo(e || a, a), h = a), s.push(c), r.push(h);
  }
  return [s, r];
}
function pr(i) {
  let t = 0, e = 0, n = 0;
  const s = i.length;
  for (let r = 0, o = s - 2; r < s; o = r, r += 2) {
    const l = i[o], a = i[o + 1], c = i[r], h = i[r + 1], f = l * h - c * a;
    t += f, e += (l + c) * f, n += (a + h) * f;
  }
  return t === 0 ? [i[0] || 0, i[1] || 0] : [e / t / 3, n / t / 3, t];
}
function td(i, t, e, n) {
  const s = (i.length - 2) / 6;
  let r = 1 / 0, o = 0;
  const l = i.length, a = l - 2;
  for (let c = 0; c < s; c++) {
    const h = c * 6;
    let f = 0;
    for (let u = 0; u < l; u += 2) {
      let d = u === 0 ? h : (h + u - 2) % a + 2;
      const p = i[d] - e[0], g = i[d + 1] - e[1], _ = t[u] - n[0], m = t[u + 1] - n[1], y = _ - p, w = m - g;
      f += y * y + w * w;
    }
    f < r && (r = f, o = c);
  }
  return o;
}
function ed(i) {
  const t = [], e = i.length;
  for (let n = 0; n < e; n += 2)
    t[n] = i[e - n - 2], t[n + 1] = i[e - n - 1];
  return t;
}
function id(i, t, e, n) {
  const s = [];
  let r;
  for (let o = 0; o < i.length; o++) {
    let l = i[o];
    const a = t[o], c = pr(l), h = pr(a);
    r == null && (r = c[2] < 0 != h[2] < 0);
    const f = [], u = [];
    let d = 0, p = 1 / 0, g = [];
    const _ = l.length;
    r && (l = ed(l));
    const m = td(l, a, c, h) * 6, y = _ - 2;
    for (let w = 0; w < y; w += 2) {
      const b = (m + w) % y + 2;
      f[w + 2] = l[b] - c[0], f[w + 3] = l[b + 1] - c[1];
    }
    f[0] = l[m] - c[0], f[1] = l[m + 1] - c[1];
    {
      const w = n / e;
      for (let b = -n / 2; b <= n / 2; b += w) {
        const v = Math.sin(b), x = Math.cos(b);
        let T = 0;
        for (let S = 0; S < l.length; S += 2) {
          const C = f[S], P = f[S + 1], M = a[S] - h[0], k = a[S + 1] - h[1], A = M * x - k * v, I = M * v + k * x;
          g[S] = A, g[S + 1] = I;
          const O = A - C, E = I - P;
          T += O * O + E * E;
        }
        if (T < p) {
          p = T, d = b;
          for (let S = 0; S < g.length; S++)
            u[S] = g[S];
        }
      }
    }
    s.push({
      from: f,
      to: u,
      fromCp: c,
      toCp: h,
      rotation: -d
    });
  }
  return s;
}
function zn(i) {
  return i.__isCombineMorphing;
}
function nd(i) {
  return i.__morphT >= 0;
}
const Qa = "__mOriginal_";
function Nn(i, t, e) {
  const n = Qa + t, s = i[n] || i[t];
  i[n] || (i[n] = i[t]);
  const r = e.replace, o = e.after, l = e.before;
  i[t] = function() {
    const a = arguments;
    let c;
    return l && l.apply(this, a), r ? c = r.apply(this, a) : c = s.apply(this, a), o && o.apply(this, a), c;
  };
}
function Ai(i, t) {
  const e = Qa + t;
  i[e] && (i[t] = i[e], i[e] = null);
}
function Ko(i, t) {
  for (let e = 0; e < i.length; e++) {
    const n = i[e];
    for (let s = 0; s < n.length; ) {
      const r = n[s], o = n[s + 1];
      n[s++] = t[0] * r + t[2] * o + t[4], n[s++] = t[1] * r + t[3] * o + t[5];
    }
  }
}
function Ja(i, t) {
  const e = i.getUpdatedPathProxy(), n = t.getUpdatedPathProxy(), [s, r] = Ka(ur(e), ur(n)), o = i.getComputedTransform(), l = t.getComputedTransform();
  function a() {
    this.transform = null;
  }
  o && Ko(s, o), l && Ko(r, l), Nn(t, "updateTransform", { replace: a }), t.transform = null;
  const c = id(s, r, 10, Math.PI), h = [];
  Nn(t, "buildPath", { replace(f) {
    const u = t.__morphT, d = 1 - u, p = [];
    for (let g = 0; g < c.length; g++) {
      const _ = c[g], m = _.from, y = _.to, w = _.rotation * u, b = _.fromCp, v = _.toCp, x = Math.sin(w), T = Math.cos(w);
      Ql(p, b, v, u);
      for (let P = 0; P < m.length; P += 2) {
        const M = m[P], k = m[P + 1], A = y[P], I = y[P + 1], O = M * d + A * u, E = k * d + I * u;
        h[P] = O * T - E * x + p[0], h[P + 1] = O * x + E * T + p[1];
      }
      let S = h[0], C = h[1];
      f.moveTo(S, C);
      for (let P = 2; P < m.length; ) {
        const M = h[P++], k = h[P++], A = h[P++], I = h[P++], O = h[P++], E = h[P++];
        S === M && C === k && A === O && I === E ? f.lineTo(O, E) : f.bezierCurveTo(M, k, A, I, O, E), S = O, C = E;
      }
    }
  } });
}
function Yr(i, t, e) {
  if (!i || !t)
    return t;
  const n = e.done, s = e.during;
  Ja(i, t), t.__morphT = 0;
  function r() {
    Ai(t, "buildPath"), Ai(t, "updateTransform"), t.__morphT = -1, t.createPathProxy(), t.dirtyShape();
  }
  return t.animateTo({
    __morphT: 1
  }, dt({
    during(o) {
      t.dirtyShape(), s && s(o);
    },
    done() {
      r(), n && n();
    }
    // NOTE: Don't do restore if aborted.
    // Because all status was just set when animation started.
    // aborted() {
    //     oldAborted && oldAborted();
    // }
  }, e)), t;
}
function sd(i, t, e, n, s, r) {
  i = s === e ? 0 : Math.round(32767 * (i - e) / (s - e)), t = r === n ? 0 : Math.round(32767 * (t - n) / (r - n));
  let l = 0, a;
  for (let c = 65536 / 2; c > 0; c /= 2) {
    let h = 0, f = 0;
    (i & c) > 0 && (h = 1), (t & c) > 0 && (f = 1), l += c * c * (3 * h ^ f), f === 0 && (h === 1 && (i = c - 1 - i, t = c - 1 - t), a = i, i = t, t = a);
  }
  return l;
}
function Bn(i) {
  let t = 1 / 0, e = 1 / 0, n = -1 / 0, s = -1 / 0;
  const r = V(i, (l) => {
    const a = l.getBoundingRect(), c = l.getComputedTransform(), h = a.x + a.width / 2 + (c ? c[4] : 0), f = a.y + a.height / 2 + (c ? c[5] : 0);
    return t = Math.min(h, t), e = Math.min(f, e), n = Math.max(h, n), s = Math.max(f, s), [h, f];
  });
  return V(r, (l, a) => ({
    cp: l,
    z: sd(l[0], l[1], t, e, n, s),
    path: i[a]
  })).sort((l, a) => l.z - a.z).map((l) => l.path);
}
function tc(i) {
  return ja(i.path, i.count);
}
function gr() {
  return {
    fromIndividuals: [],
    toIndividuals: [],
    count: 0
  };
}
function rd(i, t, e) {
  let n = [];
  function s(g) {
    for (let _ = 0; _ < g.length; _++) {
      const m = g[_];
      zn(m) ? s(m.childrenRef()) : m instanceof z && n.push(m);
    }
  }
  s(i);
  const r = n.length;
  if (!r)
    return gr();
  let l = (e.dividePath || tc)({
    path: t,
    count: r
  });
  if (l.length !== r)
    return console.error("Invalid morphing: unmatched splitted path"), gr();
  n = Bn(n), l = Bn(l);
  const a = e.done, c = e.during, h = e.individualDelay, f = new li();
  for (let g = 0; g < r; g++) {
    const _ = n[g], m = l[g];
    m.parent = t, m.copyTransform(f), h || Ja(_, m);
  }
  t.__isCombineMorphing = !0, t.childrenRef = function() {
    return l;
  };
  function u(g) {
    for (let _ = 0; _ < l.length; _++)
      l[_].addSelfToZr(g);
  }
  Nn(t, "addSelfToZr", {
    after(g) {
      u(g);
    }
  }), Nn(t, "removeSelfFromZr", {
    after(g) {
      for (let _ = 0; _ < l.length; _++)
        l[_].removeSelfFromZr(g);
    }
  });
  function d() {
    t.__isCombineMorphing = !1, t.__morphT = -1, t.childrenRef = null, Ai(t, "addSelfToZr"), Ai(t, "removeSelfFromZr");
  }
  const p = l.length;
  if (h) {
    let g = p;
    const _ = () => {
      g--, g === 0 && (d(), a && a());
    };
    for (let m = 0; m < p; m++) {
      const y = h ? dt({
        delay: (e.delay || 0) + h(m, p, n[m], l[m]),
        done: _
      }, e) : e;
      Yr(n[m], l[m], y);
    }
  } else
    t.__morphT = 0, t.animateTo({
      __morphT: 1
    }, dt({
      during(g) {
        for (let _ = 0; _ < p; _++) {
          const m = l[_];
          m.__morphT = t.__morphT, m.dirtyShape();
        }
        c && c(g);
      },
      done() {
        d();
        for (let g = 0; g < i.length; g++)
          Ai(i[g], "updateTransform");
        a && a();
      }
    }, e));
  return t.__zr && u(t.__zr), {
    fromIndividuals: n,
    toIndividuals: l,
    count: p
  };
}
function od(i, t, e) {
  const n = t.length;
  let s = [];
  const r = e.dividePath || tc;
  function o(a) {
    for (let c = 0; c < a.length; c++) {
      const h = a[c];
      zn(h) ? o(h.childrenRef()) : h instanceof z && s.push(h);
    }
  }
  if (zn(i)) {
    o(i.childrenRef());
    const a = s.length;
    if (a < n) {
      let c = 0;
      for (let h = a; h < n; h++)
        s.push(Nr(s[c++ % a]));
    }
    s.length = n;
  } else {
    s = r({ path: i, count: n });
    const a = i.getComputedTransform();
    for (let c = 0; c < s.length; c++)
      s[c].setLocalTransform(a);
    if (s.length !== n)
      return console.error("Invalid morphing: unmatched splitted path"), gr();
  }
  s = Bn(s), t = Bn(t);
  const l = e.individualDelay;
  for (let a = 0; a < n; a++) {
    const c = l ? dt({
      delay: (e.delay || 0) + l(a, n, s[a], t[a])
    }, e) : e;
    Yr(s[a], t[a], c);
  }
  return {
    fromIndividuals: s,
    toIndividuals: t,
    count: t.length
  };
}
const Gp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  alignBezierCurves: Ka,
  centroid: pr,
  combineMorph: rd,
  defaultDividePath: ja,
  isCombineMorphing: zn,
  isMorphing: nd,
  morphPath: Yr,
  separateMorph: od
}, Symbol.toStringTag, { value: "Module" }));
class ld extends z {
  type = "compound";
  _updatePathDirty() {
    const t = this.shape.paths;
    let e = this.shapeChanged();
    for (let n = 0; n < t.length; n++)
      e = e || t[n].shapeChanged();
    e && this.dirtyShape();
  }
  beforeBrush() {
    this._updatePathDirty();
    const t = this.shape.paths || [], e = this.getGlobalScale();
    for (let n = 0; n < t.length; n++)
      t[n].path || t[n].createPathProxy(), t[n].path.setScale(e[0], e[1], t[n].segmentIgnoreThreshold);
  }
  buildPath(t, e) {
    const n = e.paths || [];
    for (let s = 0; s < n.length; s++)
      n[s].buildPath(t, n[s].shape, !0);
  }
  afterBrush() {
    const t = this.shape.paths || [];
    for (let e = 0; e < t.length; e++)
      t[e].pathUpdated();
  }
  getBoundingRect() {
    return this._updatePathDirty.call(this), z.prototype.getBoundingRect.call(this);
  }
}
const ad = [];
class Vp extends ze {
  notClear = !0;
  incremental = !0;
  _displayables = [];
  _temporaryDisplayables = [];
  _cursor = 0;
  traverse(t, e) {
    t.call(e, this);
  }
  useStyle() {
    this.style = {};
  }
  // getCurrentCursor / updateCursorAfterBrush
  // is used in graphic.ts. It's not provided for developers
  getCursor() {
    return this._cursor;
  }
  // Update cursor after brush.
  innerAfterBrush() {
    this._cursor = this._displayables.length;
  }
  clearDisplaybles() {
    this._displayables = [], this._temporaryDisplayables = [], this._cursor = 0, this.markRedraw(), this.notClear = !1;
  }
  clearTemporalDisplayables() {
    this._temporaryDisplayables = [];
  }
  addDisplayable(t, e) {
    e ? this._temporaryDisplayables.push(t) : this._displayables.push(t), this.markRedraw();
  }
  addDisplayables(t, e) {
    e = e || !1;
    for (let n = 0; n < t.length; n++)
      this.addDisplayable(t[n], e);
  }
  getDisplayables() {
    return this._displayables;
  }
  getTemporalDisplayables() {
    return this._temporaryDisplayables;
  }
  eachPendingDisplayable(t) {
    for (let e = this._cursor; e < this._displayables.length; e++)
      t && t(this._displayables[e]);
    for (let e = 0; e < this._temporaryDisplayables.length; e++)
      t && t(this._temporaryDisplayables[e]);
  }
  update() {
    this.updateTransform();
    for (let t = this._cursor; t < this._displayables.length; t++) {
      const e = this._displayables[t];
      e.parent = this, e.update(), e.parent = null;
    }
    for (let t = 0; t < this._temporaryDisplayables.length; t++) {
      const e = this._temporaryDisplayables[t];
      e.parent = this, e.update(), e.parent = null;
    }
  }
  getBoundingRect() {
    if (!this._rect) {
      const t = new D(1 / 0, 1 / 0, -1 / 0, -1 / 0);
      for (let e = 0; e < this._displayables.length; e++) {
        const n = this._displayables[e], s = n.getBoundingRect().clone();
        n.needLocalTransform() && s.applyTransform(n.getLocalTransform(ad)), t.union(s);
      }
      this._rect = t;
    }
    return this._rect;
  }
  contain(t, e) {
    const n = this.transformCoordToLocal(t, e);
    if (this.getBoundingRect().contain(n[0], n[1])) {
      for (let r = 0; r < this._displayables.length; r++)
        if (this._displayables[r].contain(t, e))
          return !0;
    }
    return !1;
  }
}
const Qo = {
  fill: "#000"
}, Jo = 2, Dt = {}, cd = {
  style: dt({
    fill: !0,
    stroke: !0,
    fillOpacity: !0,
    strokeOpacity: !0,
    lineWidth: !0,
    fontSize: !0,
    lineHeight: !0,
    width: !0,
    height: !0,
    textShadowColor: !0,
    textShadowBlur: !0,
    textShadowOffsetX: !0,
    textShadowOffsetY: !0,
    backgroundColor: !0,
    padding: !0,
    // TODO needs normalize padding before animate
    borderColor: !0,
    borderWidth: !0,
    borderRadius: !0
    // TODO needs normalize radius before animate
  }, Un.style)
};
class hd extends ze {
  type = "text";
  /**
   * How to handling label overlap
   *
   * hidden:
   */
  overlap;
  /**
   * Will use this to calculate transform matrix
   * instead of Element itself if it's give.
   * Not exposed to developers
   */
  innerTransformable;
  // Be `true` if and only if the result text is modified due to overflow, due to
  // settings on either `overflow` or `lineOverflow`. Based on this the caller can
  // take some action like showing the original text in a particular tip.
  // Only take effect after rendering. So do not visit it before it.
  isTruncated;
  _children = [];
  _childCursor;
  _defaultStyle = Qo;
  constructor(t) {
    super(), this.attr(t);
  }
  childrenRef() {
    return this._children;
  }
  update() {
    super.update(), this.styleChanged() && this._updateSubTexts();
    for (let t = 0; t < this._children.length; t++) {
      const e = this._children[t];
      e.zlevel = this.zlevel, e.z = this.z, e.z2 = this.z2, e.culling = this.culling, e.cursor = this.cursor, e.invisible = this.invisible;
    }
  }
  updateTransform() {
    const t = this.innerTransformable;
    t ? (t.updateTransform(), t.transform && (this.transform = t.transform)) : super.updateTransform();
  }
  getLocalTransform(t) {
    const e = this.innerTransformable;
    return e ? e.getLocalTransform(t) : super.getLocalTransform(t);
  }
  // TODO override setLocalTransform?
  getComputedTransform() {
    return this.__hostTarget && (this.__hostTarget.getComputedTransform(), this.__hostTarget.updateInnerText(!0)), super.getComputedTransform();
  }
  _updateSubTexts() {
    this._childCursor = 0, dd(this.style), this.style.rich ? this._updateRichTexts() : this._updatePlainTexts(), this._children.length = this._childCursor, this.styleUpdated();
  }
  addSelfToZr(t) {
    super.addSelfToZr(t);
    for (let e = 0; e < this._children.length; e++)
      this._children[e].__zr = t;
  }
  removeSelfFromZr(t) {
    super.removeSelfFromZr(t);
    for (let e = 0; e < this._children.length; e++)
      this._children[e].__zr = null;
  }
  getBoundingRect() {
    if (this.styleChanged() && this._updateSubTexts(), !this._rect) {
      const t = new D(0, 0, 0, 0), e = this._children, n = [];
      let s = null;
      for (let r = 0; r < e.length; r++) {
        const o = e[r], l = o.getBoundingRect(), a = o.getLocalTransform(n);
        a ? (t.copy(l), t.applyTransform(a), s = s || t.clone(), s.union(t)) : (s = s || l.clone(), s.union(l));
      }
      this._rect = s || t;
    }
    return this._rect;
  }
  // Can be set in Element. To calculate text fill automatically when textContent is inside element
  setDefaultTextStyle(t) {
    this._defaultStyle = t || Qo;
  }
  setTextContent(t) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("Can't attach text on another text");
  }
  // getDefaultStyleValue<T extends keyof TextStyleProps>(key: T): TextStyleProps[T] {
  //     // Default value is on the prototype.
  //     return this.style.prototype[key];
  // }
  _mergeStyle(t, e) {
    if (!e)
      return t;
    const n = e.rich, s = t.rich || n && {};
    return F(t, e), n && s ? (this._mergeRich(s, n), t.rich = s) : s && (t.rich = s), t;
  }
  _mergeRich(t, e) {
    const n = X(e);
    for (let s = 0; s < n.length; s++) {
      const r = n[s];
      t[r] = t[r] || {}, F(t[r], e[r]);
    }
  }
  getAnimationStyleProps() {
    return cd;
  }
  _getOrCreateChild(t) {
    let e = this._children[this._childCursor];
    return (!e || !(e instanceof t)) && (e = new t()), this._children[this._childCursor++] = e, e.__zr = this.__zr, e.parent = this, e;
  }
  _updatePlainTexts() {
    const t = this.style, e = t.font || Xt, n = t.padding, s = this._defaultStyle;
    let r = t.x || 0, o = t.y || 0;
    const l = t.align || s.align || "left", a = t.verticalAlign || s.verticalAlign || "top";
    Oo(
      Dt,
      s.overflowRect,
      r,
      o,
      l,
      a
    ), r = Dt.baseX, o = Dt.baseY;
    const c = ol(t), h = Tu(
      c,
      t,
      Dt.outerWidth,
      Dt.outerHeight
    ), f = Rs(t), u = !!t.backgroundColor, d = h.outerHeight, p = h.outerWidth, g = h.lines, _ = h.lineHeight;
    this.isTruncated = !!h.isTruncated;
    let m = r, y = oi(o, h.contentHeight, a);
    if (f || n) {
      const C = Fi(r, p, l), P = oi(o, d, a);
      f && this._renderBackground(t, t, C, P, p, d);
    }
    y += _ / 2, n && (m = rl(r, l, n), a === "top" ? y += n[0] : a === "bottom" && (y -= n[2]));
    let w = 0, b = !1, v = !1;
    const x = sl(
      "fill" in t ? t.fill : (v = !0, s.fill)
    ), T = nl(
      "stroke" in t ? t.stroke : !u && (!s.autoStroke || v) ? (w = Jo, b = !0, s.stroke) : null
    ), S = t.textShadowBlur > 0;
    for (let C = 0; C < g.length; C++) {
      const P = this._getOrCreateChild(ee), M = P.createStyle();
      P.useStyle(M), M.text = g[C], M.x = m, M.y = y, M.textAlign = l, M.textBaseline = "middle", M.opacity = t.opacity, M.strokeFirst = !0, S && (M.shadowBlur = t.textShadowBlur || 0, M.shadowColor = t.textShadowColor || "transparent", M.shadowOffsetX = t.textShadowOffsetX || 0, M.shadowOffsetY = t.textShadowOffsetY || 0), M.stroke = T, M.fill = x, T && (M.lineWidth = t.lineWidth || w, M.lineDash = t.lineDash, M.lineDashOffset = t.lineDashOffset || 0), M.font = e, el(M, t), y += _, P.setBoundingRect(hr(
        M,
        h.contentWidth,
        h.calculatedLineHeight,
        // Should text bounding rect includes text stroke width?
        // Pros:
        //   - Intuitively, and by convention, bounding rect of `Path` always includes stroke width.
        // Cons:
        //   - It's unpredictable for users whether "auto stroke" is applied. If stroke width is included
        //     and multiple texts are laid out based on its bounding rect, the position of texts may vary
        //     and is unpredictable - especially in limited space (e.g., see echarts pie label cases).
        //   - "auto stroke" attempts to use the same color as the background to make the border to be
        //     invisible in most cases, thus it might be more reasonable to be excluded from bounding rect.
        // Conclusion:
        //   - If users specifies style.stroke, it will be included into the bounding rect as normal.
        //     Otherwise, keep the stroke width as `0` in this case to guarantee consistency of bounding
        //     rect based layout, regardless of whether "auto stroke" is applied.
        b ? 0 : null
      ));
    }
  }
  _updateRichTexts() {
    const t = this.style, e = this._defaultStyle, n = t.align || e.align, s = t.verticalAlign || e.verticalAlign;
    let r = t.x || 0, o = t.y || 0;
    Oo(
      Dt,
      e.overflowRect,
      r,
      o,
      n,
      s
    ), r = Dt.baseX, o = Dt.baseY;
    const l = ol(t), a = vu(
      l,
      t,
      Dt.outerWidth,
      Dt.outerHeight,
      n
    ), c = a.width, h = a.outerWidth, f = a.outerHeight, u = t.padding;
    this.isTruncated = !!a.isTruncated;
    const d = Fi(r, h, n), p = oi(o, f, s);
    let g = d, _ = p;
    u && (g += u[3], _ += u[0]);
    let m = g + c;
    Rs(t) && this._renderBackground(t, t, d, p, h, f);
    const y = !!t.backgroundColor;
    for (let w = 0; w < a.lines.length; w++) {
      const b = a.lines[w], v = b.tokens, x = v.length, T = b.lineHeight;
      let S = b.width, C = 0, P = g, M = m, k = x - 1, A;
      for (; C < x && (A = v[C], !A.align || A.align === "left"); )
        this._placeToken(A, t, T, _, P, "left", y), S -= A.width, P += A.width, C++;
      for (; k >= 0 && (A = v[k], A.align === "right"); )
        this._placeToken(A, t, T, _, M, "right", y), S -= A.width, M -= A.width, k--;
      for (P += (c - (P - g) - (m - M) - S) / 2; C <= k; )
        A = v[C], this._placeToken(
          A,
          t,
          T,
          _,
          P + A.width / 2,
          "center",
          y
        ), P += A.width, C++;
      _ += T;
    }
  }
  _placeToken(t, e, n, s, r, o, l) {
    const a = e.rich[t.styleName] || {};
    a.text = t.text;
    const c = t.verticalAlign;
    let h = s + n / 2;
    c === "top" ? h = s + t.height / 2 : c === "bottom" && (h = s + n - t.height / 2), !t.isLineHolder && Rs(a) && this._renderBackground(
      a,
      e,
      o === "right" ? r - t.width : o === "center" ? r - t.width / 2 : r,
      h - t.height / 2,
      t.width,
      t.height
    );
    const u = !!a.backgroundColor, d = t.textPadding;
    d && (r = rl(r, o, d), h -= t.height / 2 - d[0] - t.innerHeight / 2);
    const p = this._getOrCreateChild(ee), g = p.createStyle();
    p.useStyle(g);
    const _ = this._defaultStyle;
    let m = !1, y = 0, w = !1;
    const b = sl(
      "fill" in a ? a.fill : "fill" in e ? e.fill : (m = !0, _.fill)
    ), v = nl(
      "stroke" in a ? a.stroke : "stroke" in e ? e.stroke : !u && !l && (!_.autoStroke || m) ? (y = Jo, w = !0, _.stroke) : null
    ), x = a.textShadowBlur > 0 || e.textShadowBlur > 0;
    g.text = t.text, g.x = r, g.y = h, x && (g.shadowBlur = a.textShadowBlur || e.textShadowBlur || 0, g.shadowColor = a.textShadowColor || e.textShadowColor || "transparent", g.shadowOffsetX = a.textShadowOffsetX || e.textShadowOffsetX || 0, g.shadowOffsetY = a.textShadowOffsetY || e.textShadowOffsetY || 0), g.textAlign = o, g.textBaseline = "middle", g.font = t.font || Xt, g.opacity = vi(a.opacity, e.opacity, 1), el(g, a), v && (g.lineWidth = vi(a.lineWidth, e.lineWidth, y), g.lineDash = U(a.lineDash, e.lineDash), g.lineDashOffset = e.lineDashOffset || 0, g.stroke = v), b && (g.fill = b), p.setBoundingRect(hr(
      g,
      t.contentWidth,
      t.contentHeight,
      // See the strategy explained `_updatePlainTexts`.
      w ? 0 : null
    ));
  }
  _renderBackground(t, e, n, s, r, o) {
    const l = t.backgroundColor, a = t.borderWidth, c = t.borderColor, h = l && l.image, f = l && !h, u = t.borderRadius, d = this;
    let p, g;
    if (f || t.lineHeight || a && c) {
      p = this._getOrCreateChild(Ni), p.useStyle(p.createStyle()), p.style.fill = null;
      const m = p.shape;
      m.x = n, m.y = s, m.width = r, m.height = o, m.r = u, p.dirtyShape();
    }
    if (f) {
      const m = p.style;
      m.fill = l || null, m.fillOpacity = U(t.fillOpacity, 1);
    } else if (h) {
      g = this._getOrCreateChild(fi), g.onload = function() {
        d.dirtyStyle();
      };
      const m = g.style;
      m.image = l.image, m.x = n, m.y = s, m.width = r, m.height = o;
    }
    if (a && c) {
      const m = p.style;
      m.lineWidth = a, m.stroke = c, m.strokeOpacity = U(t.strokeOpacity, 1), m.lineDash = t.borderDash, m.lineDashOffset = t.borderDashOffset || 0, p.strokeContainThreshold = 0, p.hasFill() && p.hasStroke() && (m.strokeFirst = !0, m.lineWidth *= 2);
    }
    const _ = (p || g).style;
    _.shadowBlur = t.shadowBlur || 0, _.shadowColor = t.shadowColor || "transparent", _.shadowOffsetX = t.shadowOffsetX || 0, _.shadowOffsetY = t.shadowOffsetY || 0, _.opacity = vi(t.opacity, e.opacity, 1);
  }
  static makeFont(t) {
    let e = "";
    return ic(t) && (e = [
      t.fontStyle,
      t.fontWeight,
      ec(t.fontSize),
      // If font properties are defined, `fontFamily` should not be ignored.
      t.fontFamily || "sans-serif"
    ].join(" ")), e && Pe(e) || t.textFont || t.font;
  }
}
const fd = { left: !0, right: 1, center: 1 }, ud = { top: 1, bottom: 1, middle: 1 }, tl = ["fontStyle", "fontWeight", "fontSize", "fontFamily"];
function ec(i) {
  return typeof i == "string" && (i.indexOf("px") !== -1 || i.indexOf("rem") !== -1 || i.indexOf("em") !== -1) ? i : isNaN(+i) ? Tr + "px" : i + "px";
}
function el(i, t) {
  for (let e = 0; e < tl.length; e++) {
    const n = tl[e], s = t[n];
    s != null && (i[n] = s);
  }
}
function ic(i) {
  return i.fontSize != null || i.fontFamily || i.fontWeight;
}
function dd(i) {
  return il(i), K(i.rich, il), i;
}
function il(i) {
  if (i) {
    i.font = hd.makeFont(i);
    let t = i.align;
    t === "middle" && (t = "center"), i.align = t == null || fd[t] ? t : "left";
    let e = i.verticalAlign;
    e === "center" && (e = "middle"), i.verticalAlign = e == null || ud[e] ? e : "top", i.padding && (i.padding = $l(i.padding));
  }
}
function nl(i, t) {
  return i == null || t <= 0 || i === "transparent" || i === "none" ? null : i.image || i.colorStops ? "#000" : i;
}
function sl(i) {
  return i == null || i === "none" ? null : i.image || i.colorStops ? "#000" : i;
}
function rl(i, t, e) {
  return t === "right" ? i - e[1] : t === "center" ? i + e[3] / 2 - e[1] / 2 : i + e[3];
}
function ol(i) {
  let t = i.text;
  return t != null && (t += ""), t;
}
function Rs(i) {
  return !!(i.backgroundColor || i.lineHeight || i.borderWidth && i.borderColor);
}
class pd {
  cx = 0;
  cy = 0;
  r = 0;
  startAngle = 0;
  endAngle = Math.PI * 2;
  clockwise = !0;
}
class gd extends z {
  constructor(t) {
    super(t);
  }
  getDefaultStyle() {
    return {
      stroke: "#000",
      fill: null
    };
  }
  getDefaultShape() {
    return new pd();
  }
  buildPath(t, e) {
    const n = e.cx, s = e.cy, r = Math.max(e.r, 0), o = e.startAngle, l = e.endAngle, a = e.clockwise, c = Math.cos(o), h = Math.sin(o);
    t.moveTo(c * r + n, h * r + s), t.arc(n, s, r, o, l, !a);
  }
}
gd.prototype.type = "arc";
const st = [];
class _d {
  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;
  cpx1 = 0;
  cpy1 = 0;
  cpx2;
  cpy2;
  // Curve show percent, for animating
  percent = 1;
}
function ll(i, t, e) {
  const n = i.cpx2, s = i.cpy2;
  return n != null || s != null ? [
    (e ? co : it)(i.x1, i.cpx1, i.cpx2, i.x2, t),
    (e ? co : it)(i.y1, i.cpy1, i.cpy2, i.y2, t)
  ] : [
    (e ? ho : rt)(i.x1, i.cpx1, i.x2, t),
    (e ? ho : rt)(i.y1, i.cpy1, i.y2, t)
  ];
}
class md extends z {
  constructor(t) {
    super(t);
  }
  getDefaultStyle() {
    return {
      stroke: "#000",
      fill: null
    };
  }
  getDefaultShape() {
    return new _d();
  }
  buildPath(t, e) {
    let n = e.x1, s = e.y1, r = e.x2, o = e.y2, l = e.cpx1, a = e.cpy1, c = e.cpx2, h = e.cpy2, f = e.percent;
    f !== 0 && (t.moveTo(n, s), c == null || h == null ? (f < 1 && (Ln(n, l, r, f, st), l = st[1], r = st[2], Ln(s, a, o, f, st), a = st[1], o = st[2]), t.quadraticCurveTo(
      l,
      a,
      r,
      o
    )) : (f < 1 && (te(n, l, c, r, f, st), l = st[1], c = st[2], r = st[3], te(s, a, h, o, f, st), a = st[1], h = st[2], o = st[3]), t.bezierCurveTo(
      l,
      a,
      c,
      h,
      r,
      o
    )));
  }
  /**
   * Get point at percent
   */
  pointAt(t) {
    return ll(this.shape, t, !1);
  }
  /**
   * Get tangent at percent
   */
  tangentAt(t) {
    const e = ll(this.shape, t, !0);
    return Zl(e, e);
  }
}
md.prototype.type = "bezier-curve";
class yd {
  cx = 0;
  cy = 0;
  width = 0;
  height = 0;
}
class wd extends z {
  constructor(t) {
    super(t);
  }
  getDefaultShape() {
    return new yd();
  }
  buildPath(t, e) {
    const n = e.cx, s = e.cy, r = e.width, o = e.height;
    t.moveTo(n, s + r), t.bezierCurveTo(
      n + r,
      s + r,
      n + r * 3 / 2,
      s - r / 3,
      n,
      s - o
    ), t.bezierCurveTo(
      n - r * 3 / 2,
      s - r / 3,
      n - r,
      s + r,
      n,
      s + r
    ), t.closePath();
  }
}
wd.prototype.type = "droplet";
class xd {
  cx = 0;
  cy = 0;
  width = 0;
  height = 0;
}
class Td extends z {
  constructor(t) {
    super(t);
  }
  getDefaultShape() {
    return new xd();
  }
  buildPath(t, e) {
    const n = e.cx, s = e.cy, r = e.width, o = e.height;
    t.moveTo(n, s), t.bezierCurveTo(
      n + r / 2,
      s - o * 2 / 3,
      n + r * 2,
      s + o / 3,
      n,
      s + o
    ), t.bezierCurveTo(
      n - r * 2,
      s + o / 3,
      n - r / 2,
      s - o * 2 / 3,
      n,
      s
    );
  }
}
Td.prototype.type = "heart";
const al = Math.PI, cl = Math.sin, hl = Math.cos;
class bd {
  x = 0;
  y = 0;
  r = 0;
  n = 0;
}
class Sd extends z {
  constructor(t) {
    super(t);
  }
  getDefaultShape() {
    return new bd();
  }
  buildPath(t, e) {
    const n = e.n;
    if (!n || n < 2)
      return;
    const s = e.x, r = e.y, o = e.r, l = 2 * al / n;
    let a = -al / 2;
    t.moveTo(s + o * hl(a), r + o * cl(a));
    for (let c = 0, h = n - 1; c < h; c++)
      a += l, t.lineTo(s + o * hl(a), r + o * cl(a));
    t.closePath();
  }
}
Sd.prototype.type = "isogon";
class vd {
  cx = 0;
  cy = 0;
  r = 0;
  r0 = 0;
}
class Cd extends z {
  constructor(t) {
    super(t);
  }
  getDefaultShape() {
    return new vd();
  }
  buildPath(t, e) {
    const n = e.cx, s = e.cy, r = Math.PI * 2;
    t.moveTo(n + e.r, s), t.arc(n, s, e.r, 0, r, !1), t.moveTo(n + e.r0, s), t.arc(n, s, e.r0, 0, r, !0);
  }
}
Cd.prototype.type = "ring";
const Is = Math.sin, Pd = Math.cos, cn = Math.PI / 180;
class kd {
  cx = 0;
  cy = 0;
  r = [];
  k = 0;
  n = 1;
}
class Md extends z {
  constructor(t) {
    super(t);
  }
  getDefaultStyle() {
    return {
      stroke: "#000",
      fill: null
    };
  }
  getDefaultShape() {
    return new kd();
  }
  buildPath(t, e) {
    const n = e.r, s = e.k, r = e.n, o = e.cx, l = e.cy;
    let a, c, h;
    t.moveTo(o, l);
    for (let f = 0, u = n.length; f < u; f++) {
      h = n[f];
      for (let d = 0; d <= 360 * r; d++)
        a = h * Is(s / r * d % 360 * cn) * Pd(d * cn) + o, c = h * Is(s / r * d % 360 * cn) * Is(d * cn) + l, t.lineTo(a, c);
    }
  }
}
Md.prototype.type = "rose";
const hn = Math.PI, fn = Math.cos, fl = Math.sin;
class Ad {
  cx = 0;
  cy = 0;
  n = 3;
  r0;
  r = 0;
}
class Ld extends z {
  constructor(t) {
    super(t);
  }
  getDefaultShape() {
    return new Ad();
  }
  buildPath(t, e) {
    const n = e.n;
    if (!n || n < 2)
      return;
    const s = e.cx, r = e.cy, o = e.r;
    let l = e.r0;
    l == null && (l = n > 4 ? o * fn(2 * hn / n) / fn(hn / n) : o / 3);
    const a = hn / n;
    let c = -hn / 2;
    const h = s + o * fn(c), f = r + o * fl(c);
    c += a, t.moveTo(h, f);
    for (let u = 0, d = n * 2 - 1, p; u < d; u++)
      p = u % 2 === 0 ? l : o, t.lineTo(s + p * fn(c), r + p * fl(c)), c += a;
    t.closePath();
  }
}
Ld.prototype.type = "star";
const un = Math.cos, dn = Math.sin;
class Dd {
  cx = 0;
  cy = 0;
  r = 0;
  r0 = 0;
  d = 0;
  location = "out";
}
class Rd extends z {
  constructor(t) {
    super(t);
  }
  getDefaultStyle() {
    return {
      stroke: "#000",
      fill: null
    };
  }
  getDefaultShape() {
    return new Dd();
  }
  buildPath(t, e) {
    const n = e.r, s = e.r0, r = e.d, o = e.cx, l = e.cy, a = e.location === "out" ? 1 : -1;
    let c, h, f, u;
    if (e.location && n <= s)
      return;
    let d = 0, p = 1, g;
    c = (n + a * s) * un(0) - a * r * un(0) + o, h = (n + a * s) * dn(0) - r * dn(0) + l, t.moveTo(c, h);
    do
      d++;
    while (s * d % (n + a * s) !== 0);
    do
      g = Math.PI / 180 * p, f = (n + a * s) * un(g) - a * r * un((n / s + a) * g) + o, u = (n + a * s) * dn(g) - r * dn((n / s + a) * g) + l, t.lineTo(f, u), p++;
    while (p <= s * d / (n + a * s) * 360);
  }
}
Rd.prototype.type = "trochoid";
class Up {
  type;
  image;
  /**
   * svg element can only be used in svg renderer currently.
   *
   * Will be string if using SSR rendering.
   */
  svgElement;
  repeat;
  x;
  y;
  rotation;
  scaleX;
  scaleY;
  constructor(t, e) {
    this.image = t, this.repeat = e, this.x = 0, this.y = 0, this.rotation = 0, this.scaleX = 1, this.scaleY = 1;
  }
}
const Es = Math.min, Id = Math.max, pn = Math.abs, ye = [0, 0], we = [0, 0], j = ea(), gn = j.minTv, _n = j.maxTv;
class qp {
  // lt, rt, rb, lb
  _corners = [];
  _axes = [];
  _origin = [0, 0];
  constructor(t, e) {
    for (let n = 0; n < 4; n++)
      this._corners[n] = new B();
    for (let n = 0; n < 2; n++)
      this._axes[n] = new B();
    t && this.fromBoundingRect(t, e);
  }
  fromBoundingRect(t, e) {
    const n = this._corners, s = this._axes, r = t.x, o = t.y, l = r + t.width, a = o + t.height;
    if (n[0].set(r, o), n[1].set(l, o), n[2].set(l, a), n[3].set(r, a), e)
      for (let c = 0; c < 4; c++)
        n[c].transform(e);
    B.sub(s[0], n[1], n[0]), B.sub(s[1], n[3], n[0]), s[0].normalize(), s[1].normalize();
    for (let c = 0; c < 2; c++)
      this._origin[c] = s[c].dot(n[0]);
  }
  /**
   * If intersect with another OBB.
   *
   * [NOTICE]
   *  Touching the edge is considered an intersection.
   *  zero-width/height can still cause intersection if `touchThreshold` is 0.
   *  See more in `BoundingRectIntersectOpt['touchThreshold']`
   *
   * @param other Bounding rect to be intersected with
   * @param mtv
   *  If it's not overlapped. it means needs to move `other` rect with Maximum Translation Vector to be overlapped.
   *      FIXME: Maximum Translation Vector is buggy. Fix it before using it. See case in `test/obb-collide.html`.
   *  Else it means needs to move `other` rect with Minimum Translation Vector to be not overlapped.
   */
  intersect(t, e, n) {
    let s = !0;
    const r = !e;
    return e && B.set(e, 0, 0), j.reset(n, !r), !this._intersectCheckOneSide(this, t, r, 1) && (s = !1, r) || !this._intersectCheckOneSide(t, this, r, -1) && (s = !1, r) || !r && !j.negativeSize && B.copy(
      e,
      s ? j.useDir ? j.dirMinTv : gn : _n
    ), s;
  }
  _intersectCheckOneSide(t, e, n, s) {
    let r = !0;
    for (let o = 0; o < 2; o++) {
      const l = t._axes[o];
      if (t._getProjMinMaxOnAxis(o, t._corners, ye), t._getProjMinMaxOnAxis(o, e._corners, we), j.negativeSize || ye[1] < we[0] || ye[0] > we[1]) {
        if (r = !1, j.negativeSize || n)
          return r;
        const a = pn(we[0] - ye[1]), c = pn(ye[0] - we[1]);
        Es(a, c) > _n.len() && (a < c ? B.scale(_n, l, -a * s) : B.scale(_n, l, c * s));
      } else if (!n) {
        const a = pn(we[0] - ye[1]), c = pn(ye[0] - we[1]);
        (j.useDir || Es(a, c) < gn.len()) && ((a < c || !j.bidirectional) && (B.scale(gn, l, a * s), j.useDir && j.calcDirMTV()), (a >= c || !j.bidirectional) && (B.scale(gn, l, -c * s), j.useDir && j.calcDirMTV()));
      }
    }
    return r;
  }
  _getProjMinMaxOnAxis(t, e, n) {
    const s = this._axes[t], r = this._origin, o = e[0].dot(s) + r[t];
    let l = o, a = o;
    for (let c = 1; c < e.length; c++) {
      const h = e[c].dot(s) + r[t];
      l = Es(h, l), a = Id(h, a);
    }
    n[0] = l + j.touchThreshold, n[1] = a - j.touchThreshold, j.negativeSize = n[1] < n[0];
  }
}
class Ed {
  dom;
  _hideTimeout;
  constructor(t) {
    const e = this.dom = document.createElement("div");
    e.className = "ec-debug-dirty-rect", t = F({}, t), F(t, {
      backgroundColor: "rgba(0, 0, 255, 0.2)",
      border: "1px solid #00f"
    }), e.style.cssText = `
position: absolute;
opacity: 0;
transition: opacity 0.5s linear;
pointer-events: none;
`;
    for (let n in t)
      t.hasOwnProperty(n) && (e.style[n] = t[n]);
  }
  update(t) {
    const e = this.dom.style;
    e.width = t.width + "px", e.height = t.height + "px", e.left = t.x + "px", e.top = t.y + "px";
  }
  hide() {
    this.dom.style.opacity = "0";
  }
  show(t) {
    clearTimeout(this._hideTimeout), this.dom.style.opacity = "1", this._hideTimeout = setTimeout(() => {
      this.hide();
    }, t || 1e3);
  }
}
function Zp(i, t) {
  t = t || {};
  const e = i.painter;
  if (!e.getLayers)
    throw new Error("Debug dirty rect can only been used on canvas renderer.");
  if (e.isSingleCanvas())
    throw new Error("Debug dirty rect can only been used on zrender inited with container.");
  const n = document.createElement("div");
  n.style.cssText = `
position:absolute;
left:0;
top:0;
right:0;
bottom:0;
pointer-events:none;
`, n.className = "ec-debug-dirty-rect-container";
  const s = [], r = i.dom;
  r.appendChild(n), getComputedStyle(r).position === "static" && (r.style.position = "relative"), i.on("rendered", function() {
    if (e.getLayers) {
      let l = 0;
      e.eachBuiltinLayer((a) => {
        if (!a.debugGetPaintRects)
          return;
        const c = a.debugGetPaintRects();
        for (let h = 0; h < c.length; h++)
          !c[h].width || !c[h].height || (s[l] || (s[l] = new Ed(t.style), n.appendChild(s[l].dom)), s[l].show(t.autoHideDelay), s[l].update(c[h]), l++);
      });
      for (let a = l; a < s.length; a++)
        s[a].hide();
    }
  });
}
function De(i) {
  return isFinite(i);
}
function Od(i, t, e) {
  let n = t.x == null ? 0 : t.x, s = t.x2 == null ? 1 : t.x2, r = t.y == null ? 0 : t.y, o = t.y2 == null ? 0 : t.y2;
  return t.global || (n = n * e.width + e.x, s = s * e.width + e.x, r = r * e.height + e.y, o = o * e.height + e.y), n = De(n) ? n : 0, s = De(s) ? s : 1, r = De(r) ? r : 0, o = De(o) ? o : 0, i.createLinearGradient(n, r, s, o);
}
function Fd(i, t, e) {
  const n = e.width, s = e.height, r = Math.min(n, s);
  let o = t.x == null ? 0.5 : t.x, l = t.y == null ? 0.5 : t.y, a = t.r == null ? 0.5 : t.r;
  return t.global || (o = o * n + e.x, l = l * s + e.y, a = a * r), o = De(o) ? o : 0.5, l = De(l) ? l : 0.5, a = a >= 0 && De(a) ? a : 0.5, i.createRadialGradient(o, l, 0, o, l, a);
}
function _r(i, t, e) {
  const n = t.type === "radial" ? Fd(i, t, e) : Od(i, t, e), s = t.colorStops;
  for (let r = 0; r < s.length; r++)
    n.addColorStop(
      s[r].offset,
      s[r].color
    );
  return n;
}
function zd(i, t) {
  if (i === t || !i && !t)
    return !1;
  if (!i || !t || i.length !== t.length)
    return !0;
  for (let e = 0; e < i.length; e++)
    if (i[e] !== t[e])
      return !0;
  return !1;
}
function mn(i) {
  return parseInt(i, 10);
}
function ti(i, t, e) {
  const n = ["width", "height"][t], s = ["clientWidth", "clientHeight"][t], r = ["paddingLeft", "paddingTop"][t], o = ["paddingRight", "paddingBottom"][t];
  if (e[n] != null && e[n] !== "auto")
    return parseFloat(e[n]);
  const l = document.defaultView.getComputedStyle(i);
  return (i[s] || mn(l[n]) || mn(i.style[n])) - (mn(l[r]) || 0) - (mn(l[o]) || 0) | 0;
}
function Nd(i, t) {
  return !i || i === "solid" || !(t > 0) ? null : i === "dashed" ? [4 * t, 2 * t] : i === "dotted" ? [t] : ei(i) ? [i] : Oe(i) ? i : null;
}
function Xr(i) {
  const t = i.style;
  let e = t.lineDash && t.lineWidth > 0 && Nd(t.lineDash, t.lineWidth), n = t.lineDashOffset;
  if (e) {
    const s = t.strokeNoScale && i.getLineScale ? i.getLineScale() : 1;
    s && s !== 1 && (e = V(e, function(r) {
      return r / s;
    }), n /= s);
  }
  return [e, n];
}
const Bd = new Ct(!0);
function Hn(i) {
  const t = i.stroke;
  return !(t == null || t === "none" || !(i.lineWidth > 0));
}
function ul(i) {
  return typeof i == "string" && i !== "none";
}
function Wn(i) {
  const t = i.fill;
  return t != null && t !== "none";
}
function dl(i, t) {
  if (t.fillOpacity != null && t.fillOpacity !== 1) {
    const e = i.globalAlpha;
    i.globalAlpha = t.fillOpacity * t.opacity, i.fill(), i.globalAlpha = e;
  } else
    i.fill();
}
function pl(i, t) {
  if (t.strokeOpacity != null && t.strokeOpacity !== 1) {
    const e = i.globalAlpha;
    i.globalAlpha = t.strokeOpacity * t.opacity, i.stroke(), i.globalAlpha = e;
  } else
    i.stroke();
}
function mr(i, t, e) {
  const n = Hr(t.image, t.__image, e);
  if (qn(n)) {
    const s = i.createPattern(n, t.repeat || "repeat");
    if (typeof DOMMatrix == "function" && s && s.setTransform) {
      const r = new DOMMatrix();
      r.translateSelf(t.x || 0, t.y || 0), r.rotateSelf(0, 0, (t.rotation || 0) * Ci), r.scaleSelf(t.scaleX || 1, t.scaleY || 1), s.setTransform(r);
    }
    return s;
  }
}
function Hd(i, t, e, n) {
  let s = Hn(e), r = Wn(e);
  const o = e.strokePercent, l = o < 1, a = !t.path;
  (!t.silent || l) && a && t.createPathProxy();
  const c = t.path || Bd, h = t.__dirty;
  if (!n) {
    const g = e.fill, _ = e.stroke, m = r && !!g.colorStops, y = s && !!_.colorStops, w = r && !!g.image, b = s && !!_.image;
    let v, x, T, S, C;
    (m || y) && (C = t.getBoundingRect()), m && (v = h ? _r(i, g, C) : t.__canvasFillGradient, t.__canvasFillGradient = v), y && (x = h ? _r(i, _, C) : t.__canvasStrokeGradient, t.__canvasStrokeGradient = x), w && (T = h || !t.__canvasFillPattern ? mr(i, g, t) : t.__canvasFillPattern, t.__canvasFillPattern = T), b && (S = h || !t.__canvasStrokePattern ? mr(i, _, t) : t.__canvasStrokePattern, t.__canvasStrokePattern = S), m ? i.fillStyle = v : w && (T ? i.fillStyle = T : r = !1), y ? i.strokeStyle = x : b && (S ? i.strokeStyle = S : s = !1);
  }
  const f = t.getGlobalScale();
  c.setScale(f[0], f[1], t.segmentIgnoreThreshold);
  let u, d;
  i.setLineDash && e.lineDash && ([u, d] = Xr(t));
  let p = !0;
  (a || h & Ue) && (c.setDPR(i.dpr), l ? c.setContext(null) : (c.setContext(i), p = !1), c.reset(), t.buildPath(c, t.shape, n), c.toStatic(), t.pathUpdated()), p && c.rebuildPath(i, l ? o : 1), u && (i.setLineDash(u), i.lineDashOffset = d), n || (e.strokeFirst ? (s && pl(i, e), r && dl(i, e)) : (r && dl(i, e), s && pl(i, e))), u && i.setLineDash([]);
}
function Wd(i, t, e) {
  const n = t.__image = Hr(
    e.image,
    t.__image,
    t,
    t.onload
  );
  if (!n || !qn(n))
    return;
  const s = e.x || 0, r = e.y || 0;
  let o = t.getWidth(), l = t.getHeight();
  const a = n.width / n.height;
  if (o == null && l != null ? o = l * a : l == null && o != null ? l = o / a : o == null && l == null && (o = n.width, l = n.height), e.sWidth && e.sHeight) {
    const c = e.sx || 0, h = e.sy || 0;
    i.drawImage(
      n,
      c,
      h,
      e.sWidth,
      e.sHeight,
      s,
      r,
      o,
      l
    );
  } else if (e.sx && e.sy) {
    const c = e.sx, h = e.sy, f = o - c, u = l - h;
    i.drawImage(
      n,
      c,
      h,
      f,
      u,
      s,
      r,
      o,
      l
    );
  } else
    i.drawImage(n, s, r, o, l);
}
function Yd(i, t, e) {
  let n = e.text;
  if (n != null && (n += ""), n) {
    i.font = e.font || Xt, i.textAlign = e.textAlign, i.textBaseline = e.textBaseline;
    let s, r;
    i.setLineDash && e.lineDash && ([s, r] = Xr(t)), s && (i.setLineDash(s), i.lineDashOffset = r), e.strokeFirst ? (Hn(e) && i.strokeText(n, e.x, e.y), Wn(e) && i.fillText(n, e.x, e.y)) : (Wn(e) && i.fillText(n, e.x, e.y), Hn(e) && i.strokeText(n, e.x, e.y)), s && i.setLineDash([]);
  }
}
const gl = ["shadowBlur", "shadowOffsetX", "shadowOffsetY"], _l = [
  ["lineCap", "butt"],
  ["lineJoin", "miter"],
  ["miterLimit", 10]
];
function nc(i, t, e, n, s) {
  let r = !1;
  if (!n && (e = e || {}, t === e))
    return !1;
  if (n || t.opacity !== e.opacity) {
    at(i, s), r = !0;
    const o = Math.max(Math.min(t.opacity, 1), 0);
    i.globalAlpha = isNaN(o) ? Ee.opacity : o;
  }
  (n || t.blend !== e.blend) && (r || (at(i, s), r = !0), i.globalCompositeOperation = t.blend || Ee.blend);
  for (let o = 0; o < gl.length; o++) {
    const l = gl[o];
    (n || t[l] !== e[l]) && (r || (at(i, s), r = !0), i[l] = i.dpr * (t[l] || 0));
  }
  return (n || t.shadowColor !== e.shadowColor) && (r || (at(i, s), r = !0), i.shadowColor = t.shadowColor || Ee.shadowColor), r;
}
function ml(i, t, e, n, s) {
  const r = Bi(t, s.inHover), o = n ? null : e && Bi(e, s.inHover) || {};
  if (r === o)
    return !1;
  let l = nc(i, r, o, n, s);
  if ((n || r.fill !== o.fill) && (l || (at(i, s), l = !0), ul(r.fill) && (i.fillStyle = r.fill)), (n || r.stroke !== o.stroke) && (l || (at(i, s), l = !0), ul(r.stroke) && (i.strokeStyle = r.stroke)), (n || r.opacity !== o.opacity) && (l || (at(i, s), l = !0), i.globalAlpha = r.opacity == null ? 1 : r.opacity), t.hasStroke()) {
    const c = r.lineWidth / (r.strokeNoScale && t.getLineScale ? t.getLineScale() : 1);
    i.lineWidth !== c && (l || (at(i, s), l = !0), i.lineWidth = c);
  }
  for (let a = 0; a < _l.length; a++) {
    const c = _l[a], h = c[0];
    (n || r[h] !== o[h]) && (l || (at(i, s), l = !0), i[h] = r[h] || c[1]);
  }
  return l;
}
function Xd(i, t, e, n, s) {
  return nc(
    i,
    Bi(t, s.inHover),
    e && Bi(e, s.inHover),
    n,
    s
  );
}
function sc(i, t) {
  const e = t.transform, n = i.dpr || 1;
  e ? i.setTransform(n * e[0], n * e[1], n * e[2], n * e[3], n * e[4], n * e[5]) : i.setTransform(n, 0, 0, n, 0, 0);
}
function $d(i, t, e) {
  let n = !1;
  for (let s = 0; s < i.length; s++) {
    const r = i[s];
    n = n || r.isZeroArea(), sc(t, r), t.beginPath(), r.buildPath(t, r.shape), t.clip();
  }
  e.allClipped = n;
}
function Gd(i, t) {
  return i && t ? i[0] !== t[0] || i[1] !== t[1] || i[2] !== t[2] || i[3] !== t[3] || i[4] !== t[4] || i[5] !== t[5] : !(!i && !t);
}
const yl = 1, wl = 2, xl = 3, Tl = 4;
function Vd(i) {
  const t = Wn(i), e = Hn(i);
  return !// Line dash is dynamically set in brush function.
  (i.lineDash || !(+t ^ +e) || t && typeof i.fill != "string" || e && typeof i.stroke != "string" || i.strokePercent < 1 || i.strokeOpacity < 1 || i.fillOpacity < 1);
}
function at(i, t) {
  t.batchFill && i.fill(), t.batchStroke && i.stroke(), t.batchFill = "", t.batchStroke = "";
}
function Bi(i, t) {
  return t && i.__hoverStyle || i.style;
}
function Ud(i, t) {
  Re(i, t, { inHover: !1, viewWidth: 0, viewHeight: 0 }, !0);
}
function Re(i, t, e, n) {
  const s = t.transform;
  if (!t.shouldBePainted(e.viewWidth, e.viewHeight, !1, !1)) {
    t.__dirty &= ~ut, t.__isRendered = !1;
    return;
  }
  const r = t.__clipPaths, o = e.prevElClipPaths;
  let l = !1, a = !1;
  if ((!o || zd(r, o)) && (o && o.length && (at(i, e), i.restore(), a = l = !0, e.prevElClipPaths = null, e.allClipped = !1, e.prevEl = null), r && r.length && (at(i, e), i.save(), $d(r, i, e), l = !0), e.prevElClipPaths = r), e.allClipped) {
    t.__isRendered = !1;
    return;
  }
  t.beforeBrush && t.beforeBrush(), t.innerBeforeBrush();
  const c = e.prevEl;
  c || (a = l = !0);
  let h = t instanceof z && t.autoBatch && Vd(t.style);
  l || Gd(s, c.transform) ? (at(i, e), sc(i, t)) : h || at(i, e);
  const f = Bi(t, e.inHover);
  t instanceof z ? (e.lastDrawType !== yl && (a = !0, e.lastDrawType = yl), ml(i, t, c, a, e), (!h || !e.batchFill && !e.batchStroke) && i.beginPath(), Hd(i, t, f, h), h && (e.batchFill = f.fill || "", e.batchStroke = f.stroke || "")) : t instanceof ee ? (e.lastDrawType !== xl && (a = !0, e.lastDrawType = xl), ml(i, t, c, a, e), Yd(i, t, f)) : t instanceof fi ? (e.lastDrawType !== wl && (a = !0, e.lastDrawType = wl), Xd(i, t, c, a, e), Wd(i, t, f)) : t.getTemporalDisplayables && (e.lastDrawType !== Tl && (a = !0, e.lastDrawType = Tl), qd(i, t, e)), h && n && at(i, e), t.innerAfterBrush(), t.afterBrush && t.afterBrush(), e.prevEl = t, t.__dirty = 0, t.__isRendered = !0;
}
function qd(i, t, e) {
  let n = t.getDisplayables(), s = t.getTemporalDisplayables();
  i.save();
  let r = {
    prevElClipPaths: null,
    prevEl: null,
    allClipped: !1,
    viewWidth: e.viewWidth,
    viewHeight: e.viewHeight,
    inHover: e.inHover
  }, o, l;
  for (o = t.getCursor(), l = n.length; o < l; o++) {
    const a = n[o];
    a.beforeBrush && a.beforeBrush(), a.innerBeforeBrush(), Re(i, a, r, o === l - 1), a.innerAfterBrush(), a.afterBrush && a.afterBrush(), r.prevEl = a;
  }
  for (let a = 0, c = s.length; a < c; a++) {
    const h = s[a];
    h.beforeBrush && h.beforeBrush(), h.innerBeforeBrush(), Re(i, h, r, a === c - 1), h.innerAfterBrush(), h.afterBrush && h.afterBrush(), r.prevEl = h;
  }
  t.clearTemporalDisplayables(), t.notClear = !0, i.restore();
}
function bl(i, t, e) {
  const n = Ft.createCanvas(), s = t.getWidth(), r = t.getHeight(), o = n.style;
  return o && (o.position = "absolute", o.left = "0", o.top = "0", o.width = s + "px", o.height = r + "px", n.setAttribute("data-zr-dom-id", i)), n.width = s * e, n.height = r * e, n;
}
class Os extends ci {
  id;
  dom;
  domBack;
  ctx;
  ctxBack;
  painter;
  // Configs
  /**
   * 每次清空画布的颜色
   */
  clearColor;
  /**
   * 是否开启动态模糊
   */
  motionBlur = !1;
  /**
   * 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
   */
  lastFrameAlpha = 0.7;
  /**
   * Layer dpr
   */
  dpr = 1;
  /**
   * Virtual layer will not be inserted into dom.
   */
  virtual = !1;
  config = {};
  incremental = !1;
  zlevel = 0;
  maxRepaintRectCount = 5;
  _paintRects;
  __dirty = !0;
  __firstTimePaint = !0;
  __used = !1;
  __drawIndex = 0;
  __startIndex = 0;
  __endIndex = 0;
  // indices in the previous frame
  __prevStartIndex = null;
  __prevEndIndex = null;
  __builtin__;
  constructor(t, e, n) {
    super();
    let s;
    n = n || Rn, typeof t == "string" ? s = bl(t, e, n) : Et(t) && (s = t, t = s.id), this.id = t, this.dom = s;
    const r = s.style;
    r && (kr(s), s.onselectstart = () => !1, r.padding = "0", r.margin = "0", r.borderWidth = "0"), this.painter = e, this.dpr = n;
  }
  getElementCount() {
    return this.__endIndex - this.__startIndex;
  }
  afterBrush() {
    this.__prevStartIndex = this.__startIndex, this.__prevEndIndex = this.__endIndex;
  }
  initContext() {
    this.ctx = this.dom.getContext("2d"), this.ctx.dpr = this.dpr;
  }
  setUnpainted() {
    this.__firstTimePaint = !0;
  }
  createBackBuffer() {
    const t = this.dpr;
    this.domBack = bl("back-" + this.id, this.painter, t), this.ctxBack = this.domBack.getContext("2d"), t !== 1 && this.ctxBack.scale(t, t);
  }
  /**
   * Create repaint list when using dirty rect rendering.
   *
   * @param displayList current rendering list
   * @param prevList last frame rendering list
   * @return repaint rects. null for the first frame, [] for no element dirty
   */
  createRepaintRects(t, e, n, s) {
    if (this.__firstTimePaint)
      return this.__firstTimePaint = !1, null;
    const r = [], o = this.maxRepaintRectCount;
    let l = !1;
    const a = new D(0, 0, 0, 0);
    function c(f) {
      if (!(!f.isFinite() || f.isZero()))
        if (r.length === 0) {
          const u = new D(0, 0, 0, 0);
          u.copy(f), r.push(u);
        } else {
          let u = !1, d = 1 / 0, p = 0;
          for (let g = 0; g < r.length; ++g) {
            const _ = r[g];
            if (_.intersect(f)) {
              const m = new D(0, 0, 0, 0);
              m.copy(_), m.union(f), r[g] = m, u = !0;
              break;
            } else if (l) {
              a.copy(f), a.union(_);
              const m = f.width * f.height, y = _.width * _.height, b = a.width * a.height - m - y;
              b < d && (d = b, p = g);
            }
          }
          if (l && (r[p].union(f), u = !0), !u) {
            const g = new D(0, 0, 0, 0);
            g.copy(f), r.push(g);
          }
          l || (l = r.length >= o);
        }
    }
    for (let f = this.__startIndex; f < this.__endIndex; ++f) {
      const u = t[f];
      if (u) {
        const d = u.shouldBePainted(n, s, !0, !0), p = u.__isRendered && (u.__dirty & ut || !d) ? u.getPrevPaintRect() : null;
        p && c(p);
        const g = d && (u.__dirty & ut || !u.__isRendered) ? u.getPaintRect() : null;
        g && c(g);
      }
    }
    for (let f = this.__prevStartIndex; f < this.__prevEndIndex; ++f) {
      const u = e[f], d = u && u.shouldBePainted(n, s, !0, !0);
      if (u && (!d || !u.__zr) && u.__isRendered) {
        const p = u.getPrevPaintRect();
        p && c(p);
      }
    }
    let h;
    do {
      h = !1;
      for (let f = 0; f < r.length; ) {
        if (r[f].isZero()) {
          r.splice(f, 1);
          continue;
        }
        for (let u = f + 1; u < r.length; )
          r[f].intersect(r[u]) ? (h = !0, r[f].union(r[u]), r.splice(u, 1)) : u++;
        f++;
      }
    } while (h);
    return this._paintRects = r, r;
  }
  /**
   * Get paint rects for debug usage.
   */
  debugGetPaintRects() {
    return (this._paintRects || []).slice();
  }
  resize(t, e) {
    const n = this.dpr, s = this.dom, r = s.style, o = this.domBack;
    r && (r.width = t + "px", r.height = e + "px"), s.width = t * n, s.height = e * n, o && (o.width = t * n, o.height = e * n, n !== 1 && this.ctxBack.scale(n, n));
  }
  /**
   * 清空该层画布
   */
  clear(t, e, n) {
    const s = this.dom, r = this.ctx, o = s.width, l = s.height;
    e = e || this.clearColor;
    const a = this.motionBlur && !t, c = this.lastFrameAlpha, h = this.dpr, f = this;
    a && (this.domBack || this.createBackBuffer(), this.ctxBack.globalCompositeOperation = "copy", this.ctxBack.drawImage(
      s,
      0,
      0,
      o / h,
      l / h
    ));
    const u = this.domBack;
    function d(p, g, _, m) {
      if (r.clearRect(p, g, _, m), e && e !== "transparent") {
        let y;
        Xi(e) ? (y = (e.global || e.__width === _ && e.__height === m) && e.__canvasGradient || _r(r, e, {
          x: 0,
          y: 0,
          width: _,
          height: m
        }), e.__canvasGradient = y, e.__width = _, e.__height = m) : Yl(e) && (e.scaleX = e.scaleX || h, e.scaleY = e.scaleY || h, y = mr(
          r,
          e,
          {
            dirty() {
              f.setUnpainted(), f.painter.refresh();
            }
          }
        )), r.save(), r.fillStyle = y || e, r.fillRect(p, g, _, m), r.restore();
      }
      a && (r.save(), r.globalAlpha = c, r.drawImage(u, p, g, _, m), r.restore());
    }
    !n || a ? d(0, 0, o, l) : n.length && K(n, (p) => {
      d(
        p.x * h,
        p.y * h,
        p.width * h,
        p.height * h
      );
    });
  }
  // Interface of refresh
  refresh;
  // Interface of renderToCanvas in getRenderedCanvas
  renderToCanvas;
  // Events
  onclick;
  ondblclick;
  onmouseover;
  onmouseout;
  onmousemove;
  onmousewheel;
  onmousedown;
  onmouseup;
  oncontextmenu;
  ondrag;
  ondragstart;
  ondragend;
  ondragenter;
  ondragleave;
  ondragover;
  ondrop;
}
const Sl = 1e5, xe = 314159, yn = 0.01, Zd = 1e-3;
function jd(i) {
  return i ? i.__builtin__ ? !0 : !(typeof i.resize != "function" || typeof i.refresh != "function") : !1;
}
function Kd(i, t) {
  const e = document.createElement("div");
  return e.style.cssText = [
    "position:relative",
    // IOS13 safari probably has a compositing bug (z order of the canvas and the consequent
    // dom does not act as expected) when some of the parent dom has
    // `-webkit-overflow-scrolling: touch;` and the webpage is longer than one screen and
    // the canvas is not at the top part of the page.
    // Check `https://bugs.webkit.org/show_bug.cgi?id=203681` for more details. We remove
    // this `overflow:hidden` to avoid the bug.
    // 'overflow:hidden',
    "width:" + i + "px",
    "height:" + t + "px",
    "padding:0",
    "margin:0",
    "border-width:0"
  ].join(";") + ";", e;
}
class Qd {
  type = "canvas";
  root;
  dpr;
  storage;
  _singleCanvas;
  _opts;
  _zlevelList = [];
  _prevDisplayList = [];
  _layers = {};
  // key is zlevel
  _layerConfig = {};
  // key is zlevel
  /**
   * zrender will do compositing when root is a canvas and have multiple zlevels.
   */
  _needsManuallyCompositing = !1;
  _width;
  _height;
  _domRoot;
  _hoverlayer;
  _redrawId;
  _backgroundColor;
  constructor(t, e, n, s) {
    this.type = "canvas";
    const r = !t.nodeName || t.nodeName.toUpperCase() === "CANVAS";
    this._opts = n = F({}, n || {}), this.dpr = n.devicePixelRatio || Rn, this._singleCanvas = r, this.root = t, t.style && (kr(t), t.innerHTML = ""), this.storage = e;
    const l = this._zlevelList;
    this._prevDisplayList = [];
    const a = this._layers;
    if (r) {
      const c = t;
      let h = c.width, f = c.height;
      n.width != null && (h = n.width), n.height != null && (f = n.height), this.dpr = n.devicePixelRatio || 1, c.width = h * this.dpr, c.height = f * this.dpr, this._width = h, this._height = f;
      const u = new Os(c, this, this.dpr);
      u.__builtin__ = !0, u.initContext(), a[xe] = u, u.zlevel = xe, l.push(xe), this._domRoot = t;
    } else {
      this._width = ti(t, 0, n), this._height = ti(t, 1, n);
      const c = this._domRoot = Kd(
        this._width,
        this._height
      );
      t.appendChild(c);
    }
  }
  getType() {
    return "canvas";
  }
  /**
   * If painter use a single canvas
   */
  isSingleCanvas() {
    return this._singleCanvas;
  }
  getViewportRoot() {
    return this._domRoot;
  }
  getViewportRootOffset() {
    const t = this.getViewportRoot();
    if (t)
      return {
        offsetLeft: t.offsetLeft || 0,
        offsetTop: t.offsetTop || 0
      };
  }
  /**
   * 刷新
   * @param paintAll 强制绘制所有displayable
   */
  refresh(t) {
    const e = this.storage.getDisplayList(!0), n = this._prevDisplayList, s = this._zlevelList;
    this._redrawId = Math.random(), this._paintList(e, n, t, this._redrawId);
    for (let r = 0; r < s.length; r++) {
      const o = s[r], l = this._layers[o];
      if (!l.__builtin__ && l.refresh) {
        const a = r === 0 ? this._backgroundColor : null;
        l.refresh(a);
      }
    }
    return this._opts.useDirtyRect && (this._prevDisplayList = e.slice()), this;
  }
  refreshHover() {
    this._paintHoverList(this.storage.getDisplayList(!1));
  }
  _paintHoverList(t) {
    let e = t.length, n = this._hoverlayer;
    if (n && n.clear(), !e)
      return;
    const s = {
      inHover: !0,
      viewWidth: this._width,
      viewHeight: this._height
    };
    let r;
    for (let o = 0; o < e; o++) {
      const l = t[o];
      l.__inHover && (n || (n = this._hoverlayer = this.getLayer(Sl)), r || (r = n.ctx, r.save()), Re(r, l, s, o === e - 1));
    }
    r && r.restore();
  }
  getHoverLayer() {
    return this.getLayer(Sl);
  }
  paintOne(t, e) {
    Ud(t, e);
  }
  _paintList(t, e, n, s) {
    if (this._redrawId !== s)
      return;
    n = n || !1, this._updateLayerStatus(t);
    const { finished: r, needsRefreshHover: o } = this._doPaintList(t, e, n);
    if (this._needsManuallyCompositing && this._compositeManually(), o && this._paintHoverList(t), r)
      this.eachLayer((l) => {
        l.afterBrush && l.afterBrush();
      });
    else {
      const l = this;
      Vs(function() {
        l._paintList(t, e, n, s);
      });
    }
  }
  _compositeManually() {
    const t = this.getLayer(xe).ctx, e = this._domRoot.width, n = this._domRoot.height;
    t.clearRect(0, 0, e, n), this.eachBuiltinLayer(function(s) {
      s.virtual && t.drawImage(s.dom, 0, 0, e, n);
    });
  }
  _doPaintList(t, e, n) {
    const s = [], r = this._opts.useDirtyRect;
    for (let c = 0; c < this._zlevelList.length; c++) {
      const h = this._zlevelList[c], f = this._layers[h];
      f.__builtin__ && f !== this._hoverlayer && (f.__dirty || n) && s.push(f);
    }
    let o = !0, l = !1;
    for (let c = 0; c < s.length; c++) {
      const h = s[c], f = h.ctx, u = r && h.createRepaintRects(t, e, this._width, this._height);
      let d = n ? h.__startIndex : h.__drawIndex;
      const p = !n && h.incremental && Date.now, g = p && Date.now(), _ = h.zlevel === this._zlevelList[0] ? this._backgroundColor : null;
      if (h.__startIndex === h.__endIndex)
        h.clear(!1, _, u);
      else if (d === h.__startIndex) {
        const w = t[d];
        (!w.incremental || !w.notClear || n) && h.clear(!1, _, u);
      }
      d === -1 && (console.error("For some unknown reason. drawIndex is -1"), d = h.__startIndex);
      let m;
      const y = (w) => {
        const b = {
          inHover: !1,
          allClipped: !1,
          prevEl: null,
          viewWidth: this._width,
          viewHeight: this._height
        };
        for (m = d; m < h.__endIndex; m++) {
          const v = t[m];
          if (v.__inHover && (l = !0), this._doPaintEl(v, h, r, w, b, m === h.__endIndex - 1), p && Date.now() - g > 15)
            break;
        }
        b.prevElClipPaths && f.restore();
      };
      if (u)
        if (u.length === 0)
          m = h.__endIndex;
        else {
          const w = this.dpr;
          for (var a = 0; a < u.length; ++a) {
            const b = u[a];
            f.save(), f.beginPath(), f.rect(
              b.x * w,
              b.y * w,
              b.width * w,
              b.height * w
            ), f.clip(), y(b), f.restore();
          }
        }
      else
        f.save(), y(), f.restore();
      h.__drawIndex = m, h.__drawIndex < h.__endIndex && (o = !1);
    }
    return G.wxa && K(this._layers, function(c) {
      c && c.ctx && c.ctx.draw && c.ctx.draw();
    }), {
      finished: o,
      needsRefreshHover: l
    };
  }
  _doPaintEl(t, e, n, s, r, o) {
    const l = e.ctx;
    if (n) {
      const a = t.getPaintRect();
      (!s || a && a.intersect(s)) && (Re(l, t, r, o), t.setPrevPaintRect(a));
    } else
      Re(l, t, r, o);
  }
  /**
   * 获取 zlevel 所在层，如果不存在则会创建一个新的层
   * @param zlevel
   * @param virtual Virtual layer will not be inserted into dom.
   */
  getLayer(t, e) {
    this._singleCanvas && !this._needsManuallyCompositing && (t = xe);
    let n = this._layers[t];
    return n || (n = new Os("zr_" + t, this, this.dpr), n.zlevel = t, n.__builtin__ = !0, this._layerConfig[t] ? Ce(n, this._layerConfig[t], !0) : this._layerConfig[t - yn] && Ce(n, this._layerConfig[t - yn], !0), e && (n.virtual = e), this.insertLayer(t, n), n.initContext()), n;
  }
  insertLayer(t, e) {
    const n = this._layers, s = this._zlevelList, r = s.length, o = this._domRoot;
    let l = null, a = -1;
    if (n[t]) {
      process.env.NODE_ENV !== "production" && Ot("ZLevel " + t + " has been used already");
      return;
    }
    if (!jd(e)) {
      process.env.NODE_ENV !== "production" && Ot("Layer of zlevel " + t + " is not valid");
      return;
    }
    if (r > 0 && t > s[0]) {
      for (a = 0; a < r - 1 && !(s[a] < t && s[a + 1] > t); a++)
        ;
      l = n[s[a]];
    }
    if (s.splice(a + 1, 0, t), n[t] = e, !e.virtual)
      if (l) {
        const c = l.dom;
        c.nextSibling ? o.insertBefore(
          e.dom,
          c.nextSibling
        ) : o.appendChild(e.dom);
      } else
        o.firstChild ? o.insertBefore(e.dom, o.firstChild) : o.appendChild(e.dom);
    e.painter || (e.painter = this);
  }
  // Iterate each layer
  eachLayer(t, e) {
    const n = this._zlevelList;
    for (let s = 0; s < n.length; s++) {
      const r = n[s];
      t.call(e, this._layers[r], r);
    }
  }
  // Iterate each buildin layer
  eachBuiltinLayer(t, e) {
    const n = this._zlevelList;
    for (let s = 0; s < n.length; s++) {
      const r = n[s], o = this._layers[r];
      o.__builtin__ && t.call(e, o, r);
    }
  }
  // Iterate each other layer except buildin layer
  eachOtherLayer(t, e) {
    const n = this._zlevelList;
    for (let s = 0; s < n.length; s++) {
      const r = n[s], o = this._layers[r];
      o.__builtin__ || t.call(e, o, r);
    }
  }
  /**
   * 获取所有已创建的层
   * @param prevLayer
   */
  getLayers() {
    return this._layers;
  }
  _updateLayerStatus(t) {
    this.eachBuiltinLayer(function(l, a) {
      l.__dirty = l.__used = !1;
    });
    function e(l) {
      n && (n.__endIndex !== l && (n.__dirty = !0), n.__endIndex = l);
    }
    if (this._singleCanvas)
      for (let l = 1; l < t.length; l++) {
        const a = t[l];
        if (a.zlevel !== t[l - 1].zlevel || a.incremental) {
          this._needsManuallyCompositing = !0;
          break;
        }
      }
    let n = null, s = 0, r, o;
    for (o = 0; o < t.length; o++) {
      const l = t[o], a = l.zlevel;
      let c;
      r !== a && (r = a, s = 0), l.incremental ? (c = this.getLayer(a + Zd, this._needsManuallyCompositing), c.incremental = !0, s = 1) : c = this.getLayer(
        a + (s > 0 ? yn : 0),
        this._needsManuallyCompositing
      ), c.__builtin__ || Ot("ZLevel " + a + " has been used by unkown layer " + c.id), c !== n && (c.__used = !0, c.__startIndex !== o && (c.__dirty = !0), c.__startIndex = o, c.incremental ? c.__drawIndex = -1 : c.__drawIndex = o, e(o), n = c), l.__dirty & ut && !l.__inHover && (c.__dirty = !0, c.incremental && c.__drawIndex < 0 && (c.__drawIndex = o));
    }
    e(o), this.eachBuiltinLayer(function(l, a) {
      !l.__used && l.getElementCount() > 0 && (l.__dirty = !0, l.__startIndex = l.__endIndex = l.__drawIndex = 0), l.__dirty && l.__drawIndex < 0 && (l.__drawIndex = l.__startIndex);
    });
  }
  /**
   * 清除hover层外所有内容
   */
  clear() {
    return this.eachBuiltinLayer(this._clearLayer), this;
  }
  _clearLayer(t) {
    t.clear();
  }
  setBackgroundColor(t) {
    this._backgroundColor = t, K(this._layers, (e) => {
      e.setUnpainted();
    });
  }
  /**
   * 修改指定zlevel的绘制参数
   */
  configLayer(t, e) {
    if (e) {
      const n = this._layerConfig;
      n[t] ? Ce(n[t], e, !0) : n[t] = e;
      for (let s = 0; s < this._zlevelList.length; s++) {
        const r = this._zlevelList[s];
        if (r === t || r === t + yn) {
          const o = this._layers[r];
          Ce(o, n[t], !0);
        }
      }
    }
  }
  /**
   * 删除指定层
   * @param zlevel 层所在的zlevel
   */
  delLayer(t) {
    const e = this._layers, n = this._zlevelList, s = e[t];
    s && (s.dom.parentNode.removeChild(s.dom), delete e[t], n.splice(Tt(n, t), 1));
  }
  /**
   * 区域大小变化后重绘
   */
  resize(t, e) {
    if (this._domRoot.style) {
      const n = this._domRoot;
      n.style.display = "none";
      const s = this._opts, r = this.root;
      if (t != null && (s.width = t), e != null && (s.height = e), t = ti(r, 0, s), e = ti(r, 1, s), n.style.display = "", this._width !== t || e !== this._height) {
        n.style.width = t + "px", n.style.height = e + "px";
        for (let o in this._layers)
          this._layers.hasOwnProperty(o) && this._layers[o].resize(t, e);
        this.refresh(!0);
      }
      this._width = t, this._height = e;
    } else {
      if (t == null || e == null)
        return;
      this._width = t, this._height = e, this.getLayer(xe).resize(t, e);
    }
    return this;
  }
  /**
   * 清除单独的一个层
   * @param {number} zlevel
   */
  clearLayer(t) {
    const e = this._layers[t];
    e && e.clear();
  }
  /**
   * 释放
   */
  dispose() {
    this.root.innerHTML = "", this.root = this.storage = this._domRoot = this._layers = null;
  }
  /**
   * Get canvas which has all thing rendered
   */
  getRenderedCanvas(t) {
    if (t = t || {}, this._singleCanvas && !this._compositeManually)
      return this._layers[xe].dom;
    const e = new Os("image", this, t.pixelRatio || this.dpr);
    e.initContext(), e.clear(!1, t.backgroundColor || this._backgroundColor);
    const n = e.ctx;
    if (t.pixelRatio <= this.dpr) {
      this.refresh();
      const s = e.dom.width, r = e.dom.height;
      this.eachLayer(function(o) {
        o.__builtin__ ? n.drawImage(o.dom, 0, 0, s, r) : o.renderToCanvas && (n.save(), o.renderToCanvas(n), n.restore());
      });
    } else {
      const s = {
        inHover: !1,
        viewWidth: this._width,
        viewHeight: this._height
      }, r = this.storage.getDisplayList(!0);
      for (let o = 0, l = r.length; o < l; o++) {
        const a = r[o];
        Re(n, a, s, o === l - 1);
      }
    }
    return e.dom;
  }
  /**
   * 获取绘图区域宽度
   */
  getWidth() {
    return this._width;
  }
  /**
   * 获取绘图区域高度
   */
  getHeight() {
    return this._height;
  }
}
const Fs = Math.sin, zs = Math.cos, rc = Math.PI, Te = Math.PI * 2, Jd = 180 / rc;
class oc {
  _d;
  _str;
  _invalid;
  // If is start of subpath
  _start;
  _p;
  reset(t) {
    this._start = !0, this._d = [], this._str = "", this._p = Math.pow(10, t || 4);
  }
  moveTo(t, e) {
    this._add("M", t, e);
  }
  lineTo(t, e) {
    this._add("L", t, e);
  }
  bezierCurveTo(t, e, n, s, r, o) {
    this._add("C", t, e, n, s, r, o);
  }
  quadraticCurveTo(t, e, n, s) {
    this._add("Q", t, e, n, s);
  }
  arc(t, e, n, s, r, o) {
    this.ellipse(t, e, n, n, 0, s, r, o);
  }
  ellipse(t, e, n, s, r, o, l, a) {
    let c = l - o;
    const h = !a, f = Math.abs(c), u = Zt(f - Te) || (h ? c >= Te : -c >= Te), d = c > 0 ? c % Te : c % Te + Te;
    let p = !1;
    u ? p = !0 : Zt(f) ? p = !1 : p = d >= rc == !!h;
    const g = t + n * zs(o), _ = e + s * Fs(o);
    this._start && this._add("M", g, _);
    const m = Math.round(r * Jd);
    if (u) {
      const y = 1 / this._p, w = (h ? 1 : -1) * (Te - y);
      this._add(
        "A",
        n,
        s,
        m,
        1,
        +h,
        t + n * zs(o + w),
        e + s * Fs(o + w)
      ), y > 0.01 && this._add("A", n, s, m, 0, +h, g, _);
    } else {
      const y = t + n * zs(l), w = e + s * Fs(l);
      this._add("A", n, s, m, +p, +h, y, w);
    }
  }
  rect(t, e, n, s) {
    this._add("M", t, e), this._add("l", n, 0), this._add("l", 0, s), this._add("l", -n, 0), this._add("Z");
  }
  closePath() {
    this._d.length > 0 && this._add("Z");
  }
  _add(t, e, n, s, r, o, l, a, c) {
    const h = [], f = this._p;
    for (let u = 1; u < arguments.length; u++) {
      const d = arguments[u];
      if (isNaN(d)) {
        this._invalid = !0;
        return;
      }
      h.push(Math.round(d * f) / f);
    }
    this._d.push(t + h.join(" ")), this._start = t === "Z";
  }
  generateStr() {
    this._str = this._invalid ? "" : this._d.join(""), this._d = [];
  }
  getStr() {
    return this._str;
  }
}
const $r = "none", tp = Math.round;
function ep(i) {
  const t = i.fill;
  return t != null && t !== $r;
}
function ip(i) {
  const t = i.stroke;
  return t != null && t !== $r;
}
const yr = ["lineCap", "miterLimit", "lineJoin"], np = V(yr, (i) => `stroke-${i.toLowerCase()}`);
function sp(i, t, e, n) {
  const s = t.opacity == null ? 1 : t.opacity;
  if (e instanceof fi) {
    i("opacity", s);
    return;
  }
  if (ep(t)) {
    const r = Ei(t.fill);
    i("fill", r.color);
    const o = t.fillOpacity != null ? t.fillOpacity * r.opacity * s : r.opacity * s;
    o < 1 && i("fill-opacity", o);
  } else
    i("fill", $r);
  if (ip(t)) {
    const r = Ei(t.stroke);
    i("stroke", r.color);
    const o = t.strokeNoScale ? e.getLineScale() : 1, l = o ? (t.lineWidth || 0) / o : 0, a = t.strokeOpacity != null ? t.strokeOpacity * r.opacity * s : r.opacity * s, c = t.strokeFirst;
    if (l !== 1 && i("stroke-width", l), c && i("paint-order", c ? "stroke" : "fill"), a < 1 && i("stroke-opacity", a), t.lineDash) {
      let [h, f] = Xr(e);
      h && (f = tp(f || 0), i("stroke-dasharray", h.join(",")), (f || n) && i("stroke-dashoffset", f));
    }
    for (let h = 0; h < yr.length; h++) {
      const f = yr[h];
      if (t[f] !== In[f]) {
        const u = t[f] || In[f];
        u && i(np[h], u);
      }
    }
  }
}
const lc = "http://www.w3.org/2000/svg", ac = "http://www.w3.org/1999/xlink", rp = "http://www.w3.org/2000/xmlns/", op = "http://www.w3.org/XML/1998/namespace", vl = "ecmeta_";
function cc(i) {
  return document.createElementNS(lc, i);
}
function Z(i, t, e, n, s) {
  return {
    tag: i,
    attrs: e || {},
    children: n,
    text: s,
    key: t
  };
}
function lp(i, t) {
  const e = [];
  if (t)
    for (let n in t) {
      const s = t[n];
      let r = n;
      s !== !1 && (s !== !0 && s != null && (r += `="${s}"`), e.push(r));
    }
  return `<${i} ${e.join(" ")}>`;
}
function ap(i) {
  return `</${i}>`;
}
function Gr(i, t) {
  t = t || {};
  const e = t.newline ? `
` : "";
  function n(s) {
    const { children: r, tag: o, attrs: l, text: a } = s;
    return lp(o, l) + (o !== "style" ? fh(a) : a || "") + (r ? `${e}${V(r, (c) => n(c)).join(e)}${e}` : "") + ap(o);
  }
  return n(i);
}
function cp(i, t, e) {
  e = e || {};
  const n = e.newline ? `
` : "", s = ` {${n}`, r = `${n}}`, o = V(X(i), (a) => a + s + V(X(i[a]), (c) => `${c}:${i[a][c]};`).join(n) + r).join(n), l = V(X(t), (a) => `@keyframes ${a}${s}` + V(X(t[a]), (c) => c + s + V(X(t[a][c]), (h) => {
    let f = t[a][c][h];
    return h === "d" && (f = `path("${f}")`), `${h}:${f};`;
  }).join(n) + r).join(n) + r).join(n);
  return !o && !l ? "" : ["<![CDATA[", o, l, "]]>"].join(n);
}
function wr(i) {
  return {
    zrId: i,
    shadowCache: {},
    patternCache: {},
    gradientCache: {},
    clipPathCache: {},
    defs: {},
    cssNodes: {},
    cssAnims: {},
    cssStyleCache: {},
    cssAnimIdx: 0,
    shadowIdx: 0,
    gradientIdx: 0,
    patternIdx: 0,
    clipPathIdx: 0
  };
}
function Cl(i, t, e, n) {
  return Z(
    "svg",
    "root",
    {
      width: i,
      height: t,
      xmlns: lc,
      "xmlns:xlink": ac,
      version: "1.1",
      baseProfile: "full",
      viewBox: n ? `0 0 ${i} ${t}` : !1
    },
    e
  );
}
let hp = 0;
function hc() {
  return hp++;
}
const Pl = {
  // From https://easings.net/
  cubicIn: "0.32,0,0.67,0",
  cubicOut: "0.33,1,0.68,1",
  cubicInOut: "0.65,0,0.35,1",
  quadraticIn: "0.11,0,0.5,0",
  quadraticOut: "0.5,1,0.89,1",
  quadraticInOut: "0.45,0,0.55,1",
  quarticIn: "0.5,0,0.75,0",
  quarticOut: "0.25,1,0.5,1",
  quarticInOut: "0.76,0,0.24,1",
  quinticIn: "0.64,0,0.78,0",
  quinticOut: "0.22,1,0.36,1",
  quinticInOut: "0.83,0,0.17,1",
  sinusoidalIn: "0.12,0,0.39,0",
  sinusoidalOut: "0.61,1,0.88,1",
  sinusoidalInOut: "0.37,0,0.63,1",
  exponentialIn: "0.7,0,0.84,0",
  exponentialOut: "0.16,1,0.3,1",
  exponentialInOut: "0.87,0,0.13,1",
  circularIn: "0.55,0,1,0.45",
  circularOut: "0,0.55,0.45,1",
  circularInOut: "0.85,0,0.15,1"
  // TODO elastic, bounce
}, be = "transform-origin";
function fp(i, t, e) {
  const n = F({}, i.shape);
  F(n, t), i.buildPath(e, n);
  const s = new oc();
  return s.reset(Ta(i)), e.rebuildPath(s, 1), s.generateStr(), s.getStr();
}
function up(i, t) {
  const { originX: e, originY: n } = t;
  (e || n) && (i[be] = `${e}px ${n}px`);
}
const dp = {
  fill: "fill",
  opacity: "opacity",
  lineWidth: "stroke-width",
  lineDashOffset: "stroke-dashoffset"
  // TODO shadow is not supported.
};
function fc(i, t) {
  const e = t.zrId + "-ani-" + t.cssAnimIdx++;
  return t.cssAnims[e] = i, e;
}
function pp(i, t, e) {
  const n = i.shape.paths, s = {};
  let r, o;
  if (K(n, (a) => {
    const c = wr(e.zrId);
    c.animation = !0, jn(a, {}, c, !0);
    const h = c.cssAnims, f = c.cssNodes, u = X(h), d = u.length;
    if (!d)
      return;
    o = u[d - 1];
    const p = h[o];
    for (let g in p) {
      const _ = p[g];
      s[g] = s[g] || { d: "" }, s[g].d += _.d || "";
    }
    for (let g in f) {
      const _ = f[g].animation;
      _.indexOf(o) >= 0 && (r = _);
    }
  }), !r)
    return;
  t.d = !1;
  const l = fc(s, e);
  return r.replace(o, l);
}
function kl(i) {
  return vt(i) ? Pl[i] ? `cubic-bezier(${Pl[i]})` : Or(i) ? i : "" : "";
}
function jn(i, t, e, n) {
  const s = i.animators, r = s.length, o = [];
  if (i instanceof ld) {
    const c = pp(i, t, e);
    if (c)
      o.push(c);
    else if (!r)
      return;
  } else if (!r)
    return;
  const l = {};
  for (let c = 0; c < r; c++) {
    const h = s[c], f = [h.getMaxTime() / 1e3 + "s"], u = kl(h.getClip().easing), d = h.getDelay();
    u ? f.push(u) : f.push("linear"), d && f.push(d / 1e3 + "s"), h.getLoop() && f.push("infinite");
    const p = f.join(" ");
    l[p] = l[p] || [p, []], l[p][1].push(h);
  }
  function a(c) {
    const h = c[1], f = h.length, u = {}, d = {}, p = {}, g = "animation-timing-function";
    function _(x, T, S) {
      const C = x.getTracks(), P = x.getMaxTime();
      for (let M = 0; M < C.length; M++) {
        const k = C[M];
        if (k.needsAnimate()) {
          const A = k.keyframes;
          let I = k.propName;
          if (S && (I = S(I)), I)
            for (let O = 0; O < A.length; O++) {
              const E = A[O], q = Math.round(E.time / P * 100) + "%", W = kl(E.easing), Y = E.rawValue;
              (vt(Y) || ei(Y)) && (T[q] = T[q] || {}, T[q][I] = E.rawValue, W && (T[q][g] = W));
            }
        }
      }
    }
    for (let x = 0; x < f; x++) {
      const T = h[x], S = T.targetName;
      S ? S === "shape" && _(T, d) : !n && _(T, u);
    }
    for (let x in u) {
      const T = {};
      Pa(T, i), F(T, u[x]);
      const S = ba(T), C = u[x][g];
      p[x] = S ? {
        transform: S
      } : {}, up(p[x], T), C && (p[x][g] = C);
    }
    let m, y = !0;
    for (let x in d) {
      p[x] = p[x] || {};
      const T = !m, S = d[x][g];
      T && (m = new Ct());
      let C = m.len();
      m.reset(), p[x].d = fp(i, d[x], m);
      let P = m.len();
      if (!T && C !== P) {
        y = !1;
        break;
      }
      S && (p[x][g] = S);
    }
    if (!y)
      for (let x in p)
        delete p[x].d;
    if (!n)
      for (let x = 0; x < f; x++) {
        const T = h[x];
        T.targetName === "style" && _(
          T,
          p,
          (C) => dp[C]
        );
      }
    const w = X(p);
    let b = !0, v;
    for (let x = 1; x < w.length; x++) {
      const T = w[x - 1], S = w[x];
      if (p[T][be] !== p[S][be]) {
        b = !1;
        break;
      }
      v = p[T][be];
    }
    if (b && v) {
      for (const x in p)
        p[x][be] && delete p[x][be];
      t[be] = v;
    }
    if (Cn(
      w,
      (x) => X(p[x]).length > 0
    ).length)
      return `${fc(p, e)} ${c[0]} both`;
  }
  for (let c in l) {
    const h = a(l[c]);
    h && o.push(h);
  }
  if (o.length) {
    const c = e.zrId + "-cls-" + hc();
    e.cssNodes["." + c] = {
      animation: o.join(",")
    }, t.class = c;
  }
}
function gp(i, t, e) {
  if (!i.ignore)
    if (i.isSilent())
      Ml({
        "pointer-events": "none"
      }, t, e);
    else {
      const n = i.states.emphasis && i.states.emphasis.style ? i.states.emphasis.style : {};
      let s = n.fill;
      if (!s) {
        const l = i.style && i.style.fill, a = i.states.select && i.states.select.style && i.states.select.style.fill, c = i.currentStates.indexOf("select") >= 0 && a || l;
        c && (s = _a(c));
      }
      let r = n.lineWidth;
      if (r) {
        const l = !n.strokeNoScale && i.transform ? i.transform[0] : 1;
        r = r / l;
      }
      const o = {
        cursor: "pointer"
        // TODO: Should this be customized?
      };
      s && (o.fill = s), n.stroke && (o.stroke = n.stroke), r && (o["stroke-width"] = r), Ml(o, t, e);
    }
}
function Ml(i, t, e, n) {
  const s = JSON.stringify(i);
  let r = e.cssStyleCache[s];
  r || (r = e.zrId + "-cls-" + hc(), e.cssStyleCache[s] = r, e.cssNodes["." + r + ":hover"] = i), t.class = t.class ? t.class + " " + r : r;
}
const Hi = Math.round;
function uc(i) {
  return i && vt(i.src);
}
function dc(i) {
  return i && Bt(i.toDataURL);
}
function Vr(i, t, e, n) {
  sp((s, r) => {
    const o = s === "fill" || s === "stroke";
    o && xa(r) ? gc(t, i, s, n) : o && Fr(r) ? _c(e, i, s, n) : i[s] = r, o && n.ssr && r === "none" && (i["pointer-events"] = "visible");
  }, t, e, !1), bp(e, i, n);
}
function Ur(i, t) {
  const e = Af(t);
  e && (e.each((n, s) => {
    n != null && (i[(vl + s).toLowerCase()] = n + "");
  }), t.isSilent() && (i[vl + "silent"] = "true"));
}
function Al(i) {
  return Zt(i[0] - 1) && Zt(i[1]) && Zt(i[2]) && Zt(i[3] - 1);
}
function _p(i) {
  return Zt(i[4]) && Zt(i[5]);
}
function qr(i, t, e) {
  t && !(_p(t) && Al(t)) && (i.transform = Al(t) ? `translate(${Hi(t[4] * 1e4) / 1e4} ${Hi(t[5] * 1e4) / 1e4})` : jh(t));
}
function Ll(i, t, e) {
  const n = i.points, s = [];
  for (let r = 0; r < n.length; r++)
    s.push(Hi(n[r][0] * e) / e), s.push(Hi(n[r][1] * e) / e);
  t.points = s.join(" ");
}
function Dl(i) {
  return !i.smooth;
}
function mp(i) {
  const t = V(
    i,
    (e) => typeof e == "string" ? [e, e] : e
  );
  return function(e, n, s) {
    for (let r = 0; r < t.length; r++) {
      const o = t[r], l = e[o[0]];
      l != null && (n[o[1]] = Hi(l * s) / s);
    }
  };
}
const yp = {
  circle: [mp(["cx", "cy", "r"])],
  polyline: [Ll, Dl],
  polygon: [Ll, Dl]
  // Ignore line because it will be larger.
};
function wp(i) {
  const t = i.animators;
  for (let e = 0; e < t.length; e++)
    if (t[e].targetName === "shape")
      return !0;
  return !1;
}
function pc(i, t) {
  const e = i.style, n = i.shape, s = yp[i.type], r = {}, o = t.animation;
  let l = "path";
  const a = i.style.strokePercent, c = t.compress && Ta(i) || 4;
  if (s && !t.willUpdate && !(s[1] && !s[1](n)) && !(o && wp(i)) && !(a < 1)) {
    l = i.type;
    const h = Math.pow(10, c);
    s[0](n, r, h);
  } else {
    const h = !i.path || i.shapeChanged();
    i.path || i.createPathProxy();
    const f = i.path;
    h && (f.beginPath(), i.buildPath(f, i.shape), i.pathUpdated());
    const u = f.getVersion(), d = i;
    let p = d.__svgPathBuilder;
    (d.__svgPathVersion !== u || !p || a !== d.__svgPathStrokePercent) && (p || (p = d.__svgPathBuilder = new oc()), p.reset(c), f.rebuildPath(p, a), p.generateStr(), d.__svgPathVersion = u, d.__svgPathStrokePercent = a), r.d = p.getStr();
  }
  return qr(r, i.transform), Vr(r, e, i, t), Ur(r, i), t.animation && jn(i, r, t), t.emphasis && gp(i, r, t), Z(l, i.id + "", r);
}
function xp(i, t) {
  const e = i.style;
  let n = e.image;
  if (n && !vt(n) && (uc(n) ? n = n.src : dc(n) && (n = n.toDataURL())), !n)
    return;
  const s = e.x || 0, r = e.y || 0, o = e.width, l = e.height, a = {
    href: n,
    width: o,
    height: l
  };
  return s && (a.x = s), r && (a.y = r), qr(a, i.transform), Vr(a, e, i, t), Ur(a, i), t.animation && jn(i, a, t), Z("image", i.id + "", a);
}
function Tp(i, t) {
  const e = i.style;
  let n = e.text;
  if (n != null && (n += ""), !n || isNaN(e.x) || isNaN(e.y))
    return;
  const s = e.font || Xt, r = e.x || 0, o = Qh(e.y || 0, Vn(s), e.textBaseline), a = {
    "dominant-baseline": "central",
    "text-anchor": Kh[e.textAlign] || e.textAlign
  };
  if (ic(e)) {
    let c = "";
    const h = e.fontStyle, f = ec(e.fontSize);
    if (!parseFloat(f))
      return;
    const u = e.fontFamily || Nl, d = e.fontWeight;
    c += `font-size:${f};font-family:${u};`, h && h !== "normal" && (c += `font-style:${h};`), d && d !== "normal" && (c += `font-weight:${d};`), a.style = c;
  } else
    a.style = `font: ${s}`;
  return n.match(/\s/) && (a["xml:space"] = "preserve"), r && (a.x = r), o && (a.y = o), qr(a, i.transform), Vr(a, e, i, t), Ur(a, i), t.animation && jn(i, a, t), Z("text", i.id + "", a, void 0, n);
}
function Rl(i, t) {
  if (i instanceof z)
    return pc(i, t);
  if (i instanceof fi)
    return xp(i, t);
  if (i instanceof ee)
    return Tp(i, t);
}
function bp(i, t, e) {
  const n = i.style;
  if (Jh(n)) {
    const s = tf(i), r = e.shadowCache;
    let o = r[s];
    if (!o) {
      const l = i.getGlobalScale(), a = l[0], c = l[1];
      if (!a || !c)
        return;
      const h = n.shadowOffsetX || 0, f = n.shadowOffsetY || 0, u = n.shadowBlur, { opacity: d, color: p } = Ei(n.shadowColor), g = u / 2 / a, _ = u / 2 / c, m = g + " " + _;
      o = e.zrId + "-s" + e.shadowIdx++, e.defs[o] = Z(
        "filter",
        o,
        {
          id: o,
          x: "-100%",
          y: "-100%",
          width: "300%",
          height: "300%"
        },
        [
          Z("feDropShadow", "", {
            dx: h / a,
            dy: f / c,
            stdDeviation: m,
            "flood-color": p,
            "flood-opacity": d
          })
        ]
      ), r[s] = o;
    }
    t.filter = Gn(o);
  }
}
function gc(i, t, e, n) {
  const s = i[e];
  let r, o = {
    gradientUnits: s.global ? "userSpaceOnUse" : "objectBoundingBox"
    // x1, x2, y1, y2 in range of 0 to 1]
  };
  if (ya(s))
    r = "linearGradient", o.x1 = s.x, o.y1 = s.y, o.x2 = s.x2, o.y2 = s.y2;
  else if (wa(s))
    r = "radialGradient", o.cx = U(s.x, 0.5), o.cy = U(s.y, 0.5), o.r = U(s.r, 0.5);
  else {
    process.env.NODE_ENV !== "production" && Ot("Illegal gradient type.");
    return;
  }
  const l = s.colorStops, a = [];
  for (let d = 0, p = l.length; d < p; ++d) {
    const g = js(l[d].offset) * 100 + "%", _ = l[d].color, { color: m, opacity: y } = Ei(_), w = {
      offset: g
    };
    w["stop-color"] = m, y < 1 && (w["stop-opacity"] = y), a.push(
      Z("stop", d + "", w)
    );
  }
  const c = Z(r, "", o, a), h = Gr(c), f = n.gradientCache;
  let u = f[h];
  u || (u = n.zrId + "-g" + n.gradientIdx++, f[h] = u, o.id = u, n.defs[u] = Z(
    r,
    u,
    o,
    a
  )), t[e] = Gn(u);
}
function _c(i, t, e, n) {
  const s = i.style[e], r = i.getBoundingRect(), o = {}, l = s.repeat, a = l === "no-repeat", c = l === "repeat-x", h = l === "repeat-y";
  let f;
  if (ma(s)) {
    let w = s.imageWidth, b = s.imageHeight, v;
    const x = s.image;
    if (vt(x) ? v = x : uc(x) ? v = x.src : dc(x) && (v = x.toDataURL()), typeof Image > "u") {
      const T = "Image width/height must been given explictly in svg-ssr renderer.";
      Hs(w, T), Hs(b, T);
    } else if (w == null || b == null) {
      const T = (C, P) => {
        if (C) {
          const M = C.elm;
          let k = w || P.width, A = b || P.height;
          C.tag === "pattern" && (c ? (A = 1, k /= r.width) : h && (k = 1, A /= r.height)), C.attrs.width = k, C.attrs.height = A, M && (M.setAttribute("width", k), M.setAttribute("height", A));
        }
      }, S = Hr(
        v,
        null,
        i,
        (C) => {
          a || T(g, C), T(f, C);
        }
      );
      S && S.width && S.height && (w = w || S.width, b = b || S.height);
    }
    f = Z(
      "image",
      "img",
      {
        href: v,
        width: w,
        height: b
      }
    ), o.width = w, o.height = b;
  } else s.svgElement && (f = Jt(s.svgElement), o.width = s.svgWidth, o.height = s.svgHeight);
  if (!f)
    return;
  let u, d;
  a ? u = d = 1 : c ? (d = 1, u = o.width / r.width) : h ? (u = 1, d = o.height / r.height) : o.patternUnits = "userSpaceOnUse", u != null && !isNaN(u) && (o.width = u), d != null && !isNaN(d) && (o.height = d);
  const p = ba(s);
  p && (o.patternTransform = p);
  let g = Z(
    "pattern",
    "",
    o,
    [f]
  );
  const _ = Gr(g), m = n.patternCache;
  let y = m[_];
  y || (y = n.zrId + "-p" + n.patternIdx++, m[_] = y, o.id = y, g = n.defs[y] = Z(
    "pattern",
    y,
    o,
    [f]
  )), t[e] = Gn(y);
}
function Sp(i, t, e) {
  const { clipPathCache: n, defs: s } = e;
  let r = n[i.id];
  if (!r) {
    r = e.zrId + "-c" + e.clipPathIdx++;
    const o = {
      id: r
    };
    n[i.id] = r, s[r] = Z(
      "clipPath",
      r,
      o,
      [pc(i, e)]
    );
  }
  t["clip-path"] = Gn(r);
}
function Il(i) {
  return document.createTextNode(i);
}
function ve(i, t, e) {
  i.insertBefore(t, e);
}
function El(i, t) {
  i.removeChild(t);
}
function Ol(i, t) {
  i.appendChild(t);
}
function mc(i) {
  return i.parentNode;
}
function yc(i) {
  return i.nextSibling;
}
function Ns(i, t) {
  i.textContent = t;
}
const Fl = 58, vp = 120, Cp = Z("", "");
function xr(i) {
  return i === void 0;
}
function Rt(i) {
  return i !== void 0;
}
function Pp(i, t, e) {
  const n = {};
  for (let s = t; s <= e; ++s) {
    const r = i[s].key;
    r !== void 0 && (process.env.NODE_ENV !== "production" && n[r] != null && console.error(`Duplicate key ${r}`), n[r] = s);
  }
  return n;
}
function Si(i, t) {
  const e = i.key === t.key;
  return i.tag === t.tag && e;
}
function Wi(i) {
  let t;
  const e = i.children, n = i.tag;
  if (Rt(n)) {
    const s = i.elm = cc(n);
    if (Zr(Cp, i), Oe(e))
      for (t = 0; t < e.length; ++t) {
        const r = e[t];
        r != null && Ol(s, Wi(r));
      }
    else Rt(i.text) && !Et(i.text) && Ol(s, Il(i.text));
  } else
    i.elm = Il(i.text);
  return i.elm;
}
function wc(i, t, e, n, s) {
  for (; n <= s; ++n) {
    const r = e[n];
    r != null && ve(i, Wi(r), t);
  }
}
function Yn(i, t, e, n) {
  for (; e <= n; ++e) {
    const s = t[e];
    if (s != null)
      if (Rt(s.tag)) {
        const r = mc(s.elm);
        El(r, s.elm);
      } else
        El(i, s.elm);
  }
}
function Zr(i, t) {
  let e;
  const n = t.elm, s = i && i.attrs || {}, r = t.attrs || {};
  if (s !== r) {
    for (e in r) {
      const o = r[e];
      s[e] !== o && (o === !0 ? n.setAttribute(e, "") : o === !1 ? n.removeAttribute(e) : e === "style" ? n.style.cssText = o : e.charCodeAt(0) !== vp ? n.setAttribute(e, o) : e === "xmlns:xlink" || e === "xmlns" ? n.setAttributeNS(rp, e, o) : e.charCodeAt(3) === Fl ? n.setAttributeNS(op, e, o) : e.charCodeAt(5) === Fl ? n.setAttributeNS(ac, e, o) : n.setAttribute(e, o));
    }
    for (e in s)
      e in r || n.removeAttribute(e);
  }
}
function kp(i, t, e) {
  let n = 0, s = 0, r = t.length - 1, o = t[0], l = t[r], a = e.length - 1, c = e[0], h = e[a], f, u, d, p;
  for (; n <= r && s <= a; )
    o == null ? o = t[++n] : l == null ? l = t[--r] : c == null ? c = e[++s] : h == null ? h = e[--a] : Si(o, c) ? (qe(o, c), o = t[++n], c = e[++s]) : Si(l, h) ? (qe(l, h), l = t[--r], h = e[--a]) : Si(o, h) ? (qe(o, h), ve(i, o.elm, yc(l.elm)), o = t[++n], h = e[--a]) : Si(l, c) ? (qe(l, c), ve(i, l.elm, o.elm), l = t[--r], c = e[++s]) : (xr(f) && (f = Pp(t, n, r)), u = f[c.key], xr(u) ? ve(i, Wi(c), o.elm) : (d = t[u], d.tag !== c.tag ? ve(i, Wi(c), o.elm) : (qe(d, c), t[u] = void 0, ve(i, d.elm, o.elm))), c = e[++s]);
  (n <= r || s <= a) && (n > r ? (p = e[a + 1] == null ? null : e[a + 1].elm, wc(i, p, e, s, a)) : Yn(i, t, n, r));
}
function qe(i, t) {
  const e = t.elm = i.elm, n = i.children, s = t.children;
  i !== t && (Zr(i, t), xr(t.text) ? Rt(n) && Rt(s) ? n !== s && kp(e, n, s) : Rt(s) ? (Rt(i.text) && Ns(e, ""), wc(e, null, s, 0, s.length - 1)) : Rt(n) ? Yn(e, n, 0, n.length - 1) : Rt(i.text) && Ns(e, "") : i.text !== t.text && (Rt(n) && Yn(e, n, 0, n.length - 1), Ns(e, t.text)));
}
function Mp(i, t) {
  if (Si(i, t))
    qe(i, t);
  else {
    const e = i.elm, n = mc(e);
    Wi(t), n !== null && (ve(n, t.elm, yc(e)), Yn(n, [i], 0, 0));
  }
  return t;
}
let Ap = 0;
class Lp {
  type = "svg";
  storage;
  root;
  _svgDom;
  _viewport;
  _opts;
  _oldVNode;
  _bgVNode;
  _mainVNode;
  _width;
  _height;
  _backgroundColor;
  _id;
  constructor(t, e, n) {
    if (this.storage = e, this._opts = n = F({}, n), this.root = t, this._id = "zr" + Ap++, this._oldVNode = Cl(n.width, n.height), t && !n.ssr) {
      const s = this._viewport = document.createElement("div");
      s.style.cssText = "position:relative;overflow:hidden";
      const r = this._svgDom = this._oldVNode.elm = cc("svg");
      Zr(null, this._oldVNode), s.appendChild(r), t.appendChild(s);
    }
    this.resize(n.width, n.height);
  }
  getType() {
    return this.type;
  }
  getViewportRoot() {
    return this._viewport;
  }
  getViewportRootOffset() {
    const t = this.getViewportRoot();
    if (t)
      return {
        offsetLeft: t.offsetLeft || 0,
        offsetTop: t.offsetTop || 0
      };
  }
  getSvgDom() {
    return this._svgDom;
  }
  refresh() {
    if (this.root) {
      const t = this.renderToVNode({
        willUpdate: !0
      });
      t.attrs.style = "position:absolute;left:0;top:0;user-select:none", Mp(this._oldVNode, t), this._oldVNode = t;
    }
  }
  renderOneToVNode(t) {
    return Rl(t, wr(this._id));
  }
  renderToVNode(t) {
    t = t || {};
    const e = this.storage.getDisplayList(!0), n = this._width, s = this._height, r = wr(this._id);
    r.animation = t.animation, r.willUpdate = t.willUpdate, r.compress = t.compress, r.emphasis = t.emphasis, r.ssr = this._opts.ssr;
    const o = [], l = this._bgVNode = Dp(n, s, this._backgroundColor, r);
    l && o.push(l);
    const a = t.compress ? null : this._mainVNode = Z("g", "main", {}, []);
    this._paintList(e, r, a ? a.children : o), a && o.push(a);
    const c = V(X(r.defs), (h) => r.defs[h]);
    if (c.length && o.push(Z("defs", "defs", {}, c)), t.animation) {
      const h = cp(r.cssNodes, r.cssAnims, { newline: !0 });
      if (h) {
        const f = Z("style", "stl", {}, [], h);
        o.push(f);
      }
    }
    return Cl(n, s, o, t.useViewBox);
  }
  renderToString(t) {
    return t = t || {}, Gr(this.renderToVNode({
      animation: U(t.cssAnimation, !0),
      emphasis: U(t.cssEmphasis, !0),
      willUpdate: !1,
      compress: !0,
      useViewBox: U(t.useViewBox, !0)
    }), { newline: !0 });
  }
  setBackgroundColor(t) {
    this._backgroundColor = t;
  }
  getSvgRoot() {
    return this._mainVNode && this._mainVNode.elm;
  }
  _paintList(t, e, n) {
    const s = t.length, r = [];
    let o = 0, l, a, c = 0;
    for (let h = 0; h < s; h++) {
      const f = t[h];
      if (!f.invisible) {
        const u = f.__clipPaths, d = u && u.length || 0, p = a && a.length || 0;
        let g;
        for (g = Math.max(d - 1, p - 1); g >= 0 && !(u && a && u[g] === a[g]); g--)
          ;
        for (let m = p - 1; m > g; m--)
          o--, l = r[o - 1];
        for (let m = g + 1; m < d; m++) {
          const y = {};
          Sp(
            u[m],
            y,
            e
          );
          const w = Z(
            "g",
            "clip-g-" + c++,
            y,
            []
          );
          (l ? l.children : n).push(w), r[o++] = w, l = w;
        }
        a = u;
        const _ = Rl(f, e);
        _ && (l ? l.children : n).push(_);
      }
    }
  }
  resize(t, e) {
    const n = this._opts, s = this.root, r = this._viewport;
    if (t != null && (n.width = t), e != null && (n.height = e), s && r && (r.style.display = "none", t = ti(s, 0, n), e = ti(s, 1, n), r.style.display = ""), this._width !== t || this._height !== e) {
      if (this._width = t, this._height = e, r) {
        const o = r.style;
        o.width = t + "px", o.height = e + "px";
      }
      if (Fr(this._backgroundColor))
        this.refresh();
      else {
        const o = this._svgDom;
        o && (o.setAttribute("width", t), o.setAttribute("height", e));
        const l = this._bgVNode && this._bgVNode.elm;
        l && (l.setAttribute("width", t), l.setAttribute("height", e));
      }
    }
  }
  /**
   * 获取绘图区域宽度
   */
  getWidth() {
    return this._width;
  }
  /**
   * 获取绘图区域高度
   */
  getHeight() {
    return this._height;
  }
  dispose() {
    this.root && (this.root.innerHTML = ""), this._svgDom = this._viewport = this.storage = this._oldVNode = this._bgVNode = this._mainVNode = null;
  }
  clear() {
    this._svgDom && (this._svgDom.innerHTML = null), this._oldVNode = null;
  }
  toDataURL(t) {
    let e = this.renderToString();
    const n = "data:image/svg+xml;";
    return t ? (e = nf(e), e && n + "base64," + e) : n + "charset=UTF-8," + encodeURIComponent(e);
  }
  refreshHover = zl("refreshHover");
  configLayer = zl("configLayer");
}
function zl(i) {
  return function() {
    process.env.NODE_ENV !== "production" && Ot('In SVG mode painter not support method "' + i + '"');
  };
}
function Dp(i, t, e, n) {
  let s;
  if (e && e !== "none")
    if (s = Z(
      "rect",
      "bg",
      {
        width: i,
        height: t,
        x: "0",
        y: "0"
      }
    ), xa(e))
      gc({ fill: e }, s.attrs, "fill", n);
    else if (Fr(e))
      _c({
        style: {
          fill: e
        },
        dirty: jt,
        getBoundingRect: () => ({ width: i, height: t })
      }, s.attrs, "fill", n);
    else {
      const { color: r, opacity: o } = Ei(e);
      s.attrs.fill = r, o < 1 && (s.attrs["fill-opacity"] = o);
    }
  return s;
}
Aa("canvas", Qd);
Aa("svg", Lp);
export {
  gd as Arc,
  pd as ArcShape,
  md as BezierCurve,
  _d as BezierCurveShape,
  D as BoundingRect,
  za as Circle,
  su as CircleShape,
  ld as CompoundPath,
  ze as Displayable,
  wd as Droplet,
  yd as DropletShape,
  hi as Element,
  Na as Ellipse,
  hu as EllipseShape,
  Se as Group,
  Td as Heart,
  xd as HeartShape,
  fi as Image,
  Vp as IncrementalDisplayable,
  Sd as Isogon,
  bd as IsogonShape,
  Ba as Line,
  uu as LineShape,
  _u as LinearGradient,
  qp as OrientedBoundingRect,
  z as Path,
  Up as Pattern,
  B as Point,
  Br as Polygon,
  pu as PolygonShape,
  Wa as Polyline,
  gu as PolylineShape,
  mu as RadialGradient,
  Ni as Rect,
  au as RectShape,
  Cd as Ring,
  vd as RingShape,
  Md as Rose,
  kd as RoseShape,
  fr as Sector,
  $u as SectorShape,
  Ld as Star,
  Ad as StarShape,
  ee as TSpan,
  hd as Text,
  Rd as Trochoid,
  Dd as TrochoidShape,
  Fp as color,
  Np as dispose,
  Bp as disposeAll,
  Af as getElementSSRData,
  Hp as getInstance,
  zp as init,
  Op as matrix,
  Gp as morph,
  $p as parseSVG,
  Xp as path,
  Aa as registerPainter,
  Wp as registerSSRDataGetter,
  Rp as setPlatformAPI,
  Zp as showDebugDirtyRect,
  Ip as util,
  Ep as vector,
  Yp as version
};
