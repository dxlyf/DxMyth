var UO = Object.prototype.hasOwnProperty, We = "~";
function js() {
}
Object.create && (js.prototype = /* @__PURE__ */ Object.create(null), new js().__proto__ || (We = !1));
function VO(e, t, n) {
  this.fn = e, this.context = t, this.once = n || !1;
}
function lv(e, t, n, r, i) {
  if (typeof n != "function")
    throw new TypeError("The listener must be a function");
  var s = new VO(n, r || e, i), o = We ? We + t : t;
  return e._events[o] ? e._events[o].fn ? e._events[o] = [e._events[o], s] : e._events[o].push(s) : (e._events[o] = s, e._eventsCount++), e;
}
function ma(e, t) {
  --e._eventsCount === 0 ? e._events = new js() : delete e._events[t];
}
function Pe() {
  this._events = new js(), this._eventsCount = 0;
}
Pe.prototype.eventNames = function() {
  var t = [], n, r;
  if (this._eventsCount === 0) return t;
  for (r in n = this._events)
    UO.call(n, r) && t.push(We ? r.slice(1) : r);
  return Object.getOwnPropertySymbols ? t.concat(Object.getOwnPropertySymbols(n)) : t;
};
Pe.prototype.listeners = function(t) {
  var n = We ? We + t : t, r = this._events[n];
  if (!r) return [];
  if (r.fn) return [r.fn];
  for (var i = 0, s = r.length, o = new Array(s); i < s; i++)
    o[i] = r[i].fn;
  return o;
};
Pe.prototype.listenerCount = function(t) {
  var n = We ? We + t : t, r = this._events[n];
  return r ? r.fn ? 1 : r.length : 0;
};
Pe.prototype.emit = function(t, n, r, i, s, o) {
  var a = We ? We + t : t;
  if (!this._events[a]) return !1;
  var u = this._events[a], f = arguments.length, c, l;
  if (u.fn) {
    switch (u.once && this.removeListener(t, u.fn, void 0, !0), f) {
      case 1:
        return u.fn.call(u.context), !0;
      case 2:
        return u.fn.call(u.context, n), !0;
      case 3:
        return u.fn.call(u.context, n, r), !0;
      case 4:
        return u.fn.call(u.context, n, r, i), !0;
      case 5:
        return u.fn.call(u.context, n, r, i, s), !0;
      case 6:
        return u.fn.call(u.context, n, r, i, s, o), !0;
    }
    for (l = 1, c = new Array(f - 1); l < f; l++)
      c[l - 1] = arguments[l];
    u.fn.apply(u.context, c);
  } else {
    var h = u.length, d;
    for (l = 0; l < h; l++)
      switch (u[l].once && this.removeListener(t, u[l].fn, void 0, !0), f) {
        case 1:
          u[l].fn.call(u[l].context);
          break;
        case 2:
          u[l].fn.call(u[l].context, n);
          break;
        case 3:
          u[l].fn.call(u[l].context, n, r);
          break;
        case 4:
          u[l].fn.call(u[l].context, n, r, i);
          break;
        default:
          if (!c) for (d = 1, c = new Array(f - 1); d < f; d++)
            c[d - 1] = arguments[d];
          u[l].fn.apply(u[l].context, c);
      }
  }
  return !0;
};
Pe.prototype.on = function(t, n, r) {
  return lv(this, t, n, r, !1);
};
Pe.prototype.once = function(t, n, r) {
  return lv(this, t, n, r, !0);
};
Pe.prototype.removeListener = function(t, n, r, i) {
  var s = We ? We + t : t;
  if (!this._events[s]) return this;
  if (!n)
    return ma(this, s), this;
  var o = this._events[s];
  if (o.fn)
    o.fn === n && (!i || o.once) && (!r || o.context === r) && ma(this, s);
  else {
    for (var a = 0, u = [], f = o.length; a < f; a++)
      (o[a].fn !== n || i && !o[a].once || r && o[a].context !== r) && u.push(o[a]);
    u.length ? this._events[s] = u.length === 1 ? u[0] : u : ma(this, s);
  }
  return this;
};
Pe.prototype.removeAllListeners = function(t) {
  var n;
  return t ? (n = We ? We + t : t, this._events[n] && ma(this, n)) : (this._events = new js(), this._eventsCount = 0), this;
};
Pe.prototype.off = Pe.prototype.removeListener;
Pe.prototype.addListener = Pe.prototype.on;
Pe.prefixed = We;
Pe.EventEmitter = Pe;
const lu = {
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3
}, hv = lu.NONE, WO = lu.CAPTURING_PHASE, Up = lu.AT_TARGET, kO = lu.BUBBLING_PHASE;
class w5 {
  static create(t, n, r) {
    return new this(t, n, r);
  }
  type = "none";
  parentNode = null;
  target = null;
  currentTarget = null;
  data = null;
  eventPhase = hv;
  bubbles = !1;
  // Does it support bubbling
  cancelable = !1;
  // Is it possible to block default behavior
  defaultPrevented = !1;
  // Whether to block by default
  cancelBubble = !1;
  // Whether to stop bubbles
  immediateCancelBubble = !1;
  // Stop bubbles immediately
  constructor(t, n, r) {
    this.initEvent(t, n, r);
  }
  setData(t) {
    return this.data = t, this;
  }
  initEvent(t, n = !0, r = !0) {
    this.type = t, this.bubbles = n, this.cancelable = r;
  }
  /**
   * 
   * @returns {EventTarget[]}
   */
  composedPath() {
    let t = this.target, n = [];
    for (; t; )
      n.push(t), t = t.parent;
    return n;
  }
  preventDefault() {
    this.cancelable && (this.defaultPrevented = !0);
  }
  stopPropagation() {
    this.cancelBubble = !0;
  }
  stopImmediatePropagation() {
    this.stopPropagation(), this.immediateCancelBubble = !0;
  }
}
function Vp(e) {
  return (typeof e == "boolean" || !e) && (e = {
    capture: !!e
  }), e = { capture: !1, once: !1, ...e || {} }, e;
}
function Wp(e, t) {
  var n = e._events[t], r;
  if (!n) return [];
  if (n.fn) return [n];
  for (var i = 0, s = n.length, r = new Array(s); i < s; i++)
    r[i] = n[i];
  return r;
}
class Ri {
  parent = null;
  _bubble_emitter = new Pe();
  _capture_emitter = new Pe();
  addEventListener(t, n, r) {
    r = Vp(r);
    const i = r.capture ? this._capture_emitter : this._bubble_emitter;
    r && r.once ? i.once(t, n) : i.on(t, n);
  }
  removeEventListener(t, n, r) {
    r = Vp(r), (r.capture ? this._capture_emitter : this._bubble_emitter).off(t, n);
  }
  /**
   * 
   * @param {Event} e 
   */
  dispatchEvent(t) {
    t.target = this;
    const n = t.type, r = t.composedPath(), i = r.length;
    for (let s = i - 1; s >= 0; s--) {
      const o = r[s]._capture_emitter;
      if (o.listenerCount(n) > 0) {
        t.currentTarget = r[s], t.eventPhase = t.currentTarget !== this ? WO : Up;
        const u = Wp(o, n);
        for (let f = 0, c = u.length; f < c; f++) {
          const l = u[f];
          if (l.once && o.removeListener(n, l.fn, l.context, l.once), l.fn(t), t.immediateCancelBubble)
            break;
        }
      }
      if (t.cancelBubble)
        break;
    }
    if (!t.cancelBubble)
      for (let s = 0; s < i; s++) {
        const o = r[s]._bubble_emitter;
        if (o.listenerCount(n) > 0) {
          t.currentTarget = r[s], t.eventPhase = t.currentTarget !== this ? kO : Up;
          const u = Wp(o, n);
          for (let f = 0, c = u.length; f < c; f++) {
            const l = u[f];
            if (l.once && o.removeListener(n, l.fn, l.context, l.once), l.fn(t), t.immediateCancelBubble)
              break;
          }
        }
        if (t.cancelBubble || !t.bubbles)
          break;
      }
    return t.eventPhase = hv, !t.defaultPrevented;
  }
  removeAllListeners() {
    this._bubble_emitter.removeAllListeners(), this._capture_emitter.removeAllListeners();
  }
}
Ri.prototype.on = Ri.prototype.addEventListener;
Ri.prototype.off = Ri.prototype.removeEventListener;
Ri.prototype.emit = Ri.prototype.dispatchEvent;
function A5(e) {
  return e = e || /* @__PURE__ */ new Map(), {
    /**
     * A Map of event names to registered handler functions.
     */
    all: e,
    /**
     * Register an event handler for the given type.
     * @param {string|symbol} type Type of event to listen for, or `'*'` for all events
     * @param {Function} handler Function to call in response to given event
     * @memberOf mitt
     */
    on(t, n) {
      const r = e.get(t);
      r ? r.push(n) : e.set(t, [n]);
    },
    /**
     * Remove an event handler for the given type.
     * If `handler` is omitted, all handlers of the given type are removed.
     * @param {string|symbol} type Type of event to unregister `handler` from (`'*'` to remove a wildcard handler)
     * @param {Function} [handler] Handler function to remove
     * @memberOf mitt
     */
    off(t, n) {
      const r = e.get(t);
      r && (n ? r.splice(r.indexOf(n) >>> 0, 1) : e.set(t, []));
    },
    /**
     * Invoke all handlers for the given type.
     * If present, `'*'` handlers are invoked after type-matched handlers.
     *
     * Note: Manually firing '*' handlers is not supported.
     *
     * @param {string|symbol} type The event type to invoke
     * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
     * @memberOf mitt
     */
    emit(t, n) {
      let r = e.get(t);
      r && r.slice().map((i) => {
        i(n);
      }), r = e.get("*"), r && r.slice().map((i) => {
        i(t, n);
      });
    }
  };
}
function kp(e, t, n, r, i, s) {
  let o = Object.assign({
    once: !1,
    stage: 1 / 0
  }, s);
  e[t] || (e[t] = /* @__PURE__ */ Object.create(null));
  let a = e[t], u = a[r];
  if (u || (u = [], a[r] = u), u.some((l) => l.handle === i))
    return;
  let f = {
    handle: i,
    once: o.once,
    namespace: o.namespace,
    stage: o.stage
  }, c = -1;
  if (o.stage !== 1 / 0 && (c = u.findIndex((l) => l.handle < f.handle)), c !== -1 ? u.splice(c, 0, f) : u.push(f), o.namespace) {
    let l = e[n];
    l || (l = e[n] = /* @__PURE__ */ new Map());
    let h = l.get(o.namespace);
    h || l.set(o.namespace, /* @__PURE__ */ new Map()), h = l.get(o.namespace), h.has(r) ? h.set(r, h.get(r) + 1) : h.set(r, 1);
  }
}
function Fs(e, t, n, r, i, s) {
  if (e[t]) {
    if (!r && !i) {
      e[t] = void 0, delete e[t];
      return;
    } else if (!r && i) {
      let o = e[n];
      if (!o || !o.has(i))
        return;
      o.get(i).forEach((u, f) => {
        Fs(e, t, n, f, void 0, s);
      }), o.delete(i);
    } else if (r) {
      let o = e[t], a = o[r];
      a && (o[r] = a.filter((u) => {
        if ((!s || u.handle === s) && (!i || u.namespace === i)) {
          let f = e[n];
          if (u.namespace && f && f.has(u.namespace)) {
            let c = f.get(u.namespace);
            c.has(r) && c.set(r, c.get(r) - 1), c.get(r) <= 0 && c.delete(r);
          }
          return !1;
        }
        return !0;
      }));
    }
  }
}
function qO(e, t, n, r, ...i) {
  if (!e[t])
    return;
  let o = e[t][r];
  if (o)
    for (let a = 0; a < o.length; a++) {
      const u = o[a];
      u.handle(...i), u.once && Fs(e, t, n, r, null, u.handle);
    }
}
function qp(e, t, n) {
  let r = e[t];
  return r ? r[n] || [] : [];
}
function GO(e, t, n) {
  e[t] = void 0, e[n] = void 0;
}
function HO(e, t, n) {
  let r = e[t];
  if (!r)
    return !1;
  let i = r[n];
  return i ? i.length > 0 : !1;
}
function KO(e) {
  if (!e._listeners)
    return [];
  let t = e._listeners;
  return Object.keys(t);
}
function YO(e, t, n, r, i) {
  i.target = e;
  const s = i.type, o = i.composedPath(e), a = o.length;
  for (let u = a - 1; u >= 0; u--) {
    const f = o[u];
    i.currentTarget = o[u], i.eventPhase = i.currentTarget !== e ? di.CAPTURING_PHASE : di.AT_TARGET;
    const c = qp(f, n, s);
    for (let l = 0, h = c.length; l < h; l++) {
      const d = c[l];
      if (d.once && Fs(e, n, r, s, null, d.handle), d.handle(i), i.immediateCancelBubble)
        break;
    }
    if (i.cancelBubble)
      break;
  }
  if (!i.cancelBubble)
    for (let u = 0; u < a; u++) {
      const f = o[u];
      i.currentTarget = o[u], i.eventPhase = i.currentTarget !== e ? di.BUBBLING_PHASE : di.AT_TARGET;
      const c = qp(f, t, s);
      for (let l = 0, h = c.length; l < h; l++) {
        const d = c[l];
        if (d.once && Fs(e, t, r, s, null, d.handle), d.handle(i), i.immediateCancelBubble)
          break;
      }
      if (i.cancelBubble || !i.bubbles)
        break;
    }
  return i.eventPhase = di.NONE, !i.defaultPrevented;
}
const di = {
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3
};
class ll {
  static create(t, n) {
    return new ll(t);
  }
  type;
  target = null;
  currentTarget = null;
  data = null;
  eventPhase = di.NONE;
  bubbles = !1;
  // Does it support bubbling
  cancelable = !1;
  // Is it possible to block default behavior
  defaultPrevented = !1;
  // Whether to block by default
  cancelBubble = !1;
  // Whether to stop bubbles
  immediateCancelBubble = !1;
  // Stop bubbles immediately
  constructor(t, n, r) {
    this.initEvent(t, n, r);
  }
  setData(t) {
    return this.data = t, this;
  }
  initEvent(t, n = !0, r = !0) {
    return this.type = t, this.bubbles = n, this.cancelable = r, this;
  }
  /**
   * 
   * @returns {EventTarget[]}
   */
  composedPath(t) {
    let n = t, r = [];
    for (; n; )
      r.push(n), n = n.parent;
    return r;
  }
  preventDefault() {
    this.cancelable && (this.defaultPrevented = !0);
  }
  stopPropagation() {
    this.cancelBubble = !0;
  }
  stopImmediatePropagation() {
    this.stopPropagation(), this.immediateCancelBubble = !0;
  }
}
const ci = "_listeners", Gp = "_listeners_capture", li = "_listenersNs";
class O5 {
  parent;
  _listeners;
  _listenersNs;
  on(t, n, r) {
    return r && r.capture ? kp(this, Gp, li, t, n, r) : kp(this, ci, li, t, n, r), this;
  }
  emit(t, ...n) {
    return qO(this, ci, li, t, ...n), this;
  }
  createEvent(t, n) {
    return ll.create(t, n);
  }
  emitBubble(t) {
    return YO(this, ci, Gp, li, t);
  }
  off(t, n, r) {
    return Fs(this, ci, li, t, r ? r.namespace : null, n), this;
  }
  eventNames() {
    return KO(this);
  }
  hasEventListener(t) {
    return HO(this, ci, t);
  }
  removeAllListeners() {
    return GO(this, ci, li), this;
  }
}
const pv = (e) => !!Symbol[e], hl = (e) => pv(e) ? Symbol[e] : "@@" + e, XO = hl("iterator"), ac = hl("observable"), dv = hl("species");
function Na(e, t) {
  let n = e[t];
  if (n != null) {
    if (typeof n != "function")
      throw new TypeError(n + " is not a function");
    return n;
  }
}
function _s(e) {
  let t = e.constructor;
  return t !== void 0 && (t = t[dv], t === null && (t = void 0)), t !== void 0 ? t : xe;
}
function JO(e) {
  return e instanceof xe;
}
function Pi(e) {
  Pi.log ? Pi.log(e) : setTimeout(() => {
    throw e;
  });
}
function wa(e) {
  Promise.resolve().then(() => {
    try {
      e();
    } catch (t) {
      Pi(t);
    }
  });
}
function _v(e) {
  let t = e._cleanup;
  if (t !== void 0 && (e._cleanup = void 0, !!t))
    try {
      if (typeof t == "function")
        t();
      else {
        let n = Na(t, "unsubscribe");
        n && n.call(t);
      }
    } catch (n) {
      Pi(n);
    }
}
function uc(e) {
  e._observer = void 0, e._queue = void 0, e._state = "closed";
}
function ZO(e) {
  let t = e._queue;
  if (t) {
    e._queue = void 0, e._state = "ready";
    for (let n = 0; n < t.length && (vv(e, t[n].type, t[n].value), e._state !== "closed"); ++n)
      ;
  }
}
function vv(e, t, n) {
  e._state = "running";
  let r = e._observer;
  try {
    let i = Na(r, t);
    switch (t) {
      case "next":
        i && i.call(r, n);
        break;
      case "error":
        if (uc(e), i) i.call(r, n);
        else throw n;
        break;
      case "complete":
        uc(e), i && i.call(r);
        break;
    }
  } catch (i) {
    Pi(i);
  }
  e._state === "closed" ? _v(e) : e._state === "running" && (e._state = "ready");
}
function Mf(e, t, n) {
  if (e._state !== "closed") {
    if (e._state === "buffering") {
      e._queue.push({ type: t, value: n });
      return;
    }
    if (e._state !== "ready") {
      e._state = "buffering", e._queue = [{ type: t, value: n }], wa(() => ZO(e));
      return;
    }
    vv(e, t, n);
  }
}
class QO {
  constructor(t, n) {
    this._cleanup = void 0, this._observer = t, this._queue = void 0, this._state = "initializing";
    let r = this, i = {
      get closed() {
        return r._state === "closed";
      },
      next(s) {
        Mf(r, "next", s);
      },
      error(s) {
        Mf(r, "error", s);
      },
      complete() {
        Mf(r, "complete");
      }
    };
    try {
      this._cleanup = n.call(void 0, i);
    } catch (s) {
      i.error(s);
    }
    this._state === "initializing" && (this._state = "ready");
  }
  get closed() {
    return this._state === "closed";
  }
  unsubscribe() {
    this._state !== "closed" && (uc(this), _v(this));
  }
}
class xe {
  constructor(t) {
    if (!(this instanceof xe))
      throw new TypeError("Observable cannot be called as a function");
    if (typeof t != "function")
      throw new TypeError("Observable initializer must be a function");
    this._subscriber = t;
  }
  subscribe(t) {
    return (typeof t != "object" || t === null) && (t = {
      next: t,
      error: arguments[1],
      complete: arguments[2]
    }), new QO(t, this._subscriber);
  }
  forEach(t) {
    return new Promise((n, r) => {
      if (typeof t != "function") {
        r(new TypeError(t + " is not a function"));
        return;
      }
      function i() {
        s.unsubscribe(), n();
      }
      let s = this.subscribe({
        next(o) {
          try {
            t(o, i);
          } catch (a) {
            r(a), s.unsubscribe();
          }
        },
        error: r,
        complete: n
      });
    });
  }
  map(t) {
    if (typeof t != "function")
      throw new TypeError(t + " is not a function");
    let n = _s(this);
    return new n((r) => this.subscribe({
      next(i) {
        try {
          i = t(i);
        } catch (s) {
          return r.error(s);
        }
        r.next(i);
      },
      error(i) {
        r.error(i);
      },
      complete() {
        r.complete();
      }
    }));
  }
  filter(t) {
    if (typeof t != "function")
      throw new TypeError(t + " is not a function");
    let n = _s(this);
    return new n((r) => this.subscribe({
      next(i) {
        try {
          if (!t(i)) return;
        } catch (s) {
          return r.error(s);
        }
        r.next(i);
      },
      error(i) {
        r.error(i);
      },
      complete() {
        r.complete();
      }
    }));
  }
  reduce(t) {
    if (typeof t != "function")
      throw new TypeError(t + " is not a function");
    let n = _s(this), r = arguments.length > 1, i = !1, o = arguments[1];
    return new n((a) => this.subscribe({
      next(u) {
        let f = !i;
        if (i = !0, !f || r)
          try {
            o = t(o, u);
          } catch (c) {
            return a.error(c);
          }
        else
          o = u;
      },
      error(u) {
        a.error(u);
      },
      complete() {
        if (!i && !r)
          return a.error(new TypeError("Cannot reduce an empty sequence"));
        a.next(o), a.complete();
      }
    }));
  }
  async all() {
    let t = [];
    return await this.forEach((n) => t.push(n)), t;
  }
  concat(...t) {
    let n = _s(this);
    return new n((r) => {
      let i, s = 0;
      function o(a) {
        i = a.subscribe({
          next(u) {
            r.next(u);
          },
          error(u) {
            r.error(u);
          },
          complete() {
            s === t.length ? (i = void 0, r.complete()) : o(n.from(t[s++]));
          }
        });
      }
      return o(this), () => {
        i && (i.unsubscribe(), i = void 0);
      };
    });
  }
  flatMap(t) {
    if (typeof t != "function")
      throw new TypeError(t + " is not a function");
    let n = _s(this);
    return new n((r) => {
      let i = [], s = this.subscribe({
        next(a) {
          if (t)
            try {
              a = t(a);
            } catch (f) {
              return r.error(f);
            }
          let u = n.from(a).subscribe({
            next(f) {
              r.next(f);
            },
            error(f) {
              r.error(f);
            },
            complete() {
              let f = i.indexOf(u);
              f >= 0 && i.splice(f, 1), o();
            }
          });
          i.push(u);
        },
        error(a) {
          r.error(a);
        },
        complete() {
          o();
        }
      });
      function o() {
        s.closed && i.length === 0 && r.complete();
      }
      return () => {
        i.forEach((a) => a.unsubscribe()), s.unsubscribe();
      };
    });
  }
  [ac]() {
    return this;
  }
  static from(t) {
    let n = typeof this == "function" ? this : xe;
    if (t == null)
      throw new TypeError(t + " is not an object");
    let r = Na(t, ac);
    if (r) {
      let i = r.call(t);
      if (Object(i) !== i)
        throw new TypeError(i + " is not an object");
      return JO(i) && i.constructor === n ? i : new n((s) => i.subscribe(s));
    }
    if (pv("iterator") && (r = Na(t, XO), r))
      return new n((i) => {
        wa(() => {
          if (!i.closed) {
            for (let s of r.call(t))
              if (i.next(s), i.closed) return;
            i.complete();
          }
        });
      });
    if (Array.isArray(t))
      return new n((i) => {
        wa(() => {
          if (!i.closed) {
            for (let s = 0; s < t.length; ++s)
              if (i.next(t[s]), i.closed) return;
            i.complete();
          }
        });
      });
    throw new TypeError(t + " is not observable");
  }
  static of(...t) {
    let n = typeof this == "function" ? this : xe;
    return new n((r) => {
      wa(() => {
        if (!r.closed) {
          for (let i = 0; i < t.length; ++i)
            if (r.next(t[i]), r.closed) return;
          r.complete();
        }
      });
    });
  }
  static get [dv]() {
    return this;
  }
}
Object.defineProperty(xe, Symbol("extensions"), {
  value: {
    symbol: ac,
    hostReportError: Pi
  },
  configurable: !0
});
function eE(...e) {
  return new xe((t) => {
    if (e.length === 0)
      return xe.from([]);
    let n = e.length, r = e.map((i) => xe.from(i).subscribe({
      next(s) {
        t.next(s);
      },
      error(s) {
        t.error(s);
      },
      complete() {
        --n === 0 && t.complete();
      }
    }));
    return () => r.forEach((i) => i.unsubscribe());
  });
}
function tE(...e) {
  return new xe((t) => {
    if (e.length === 0)
      return xe.from([]);
    let n = e.length, r = /* @__PURE__ */ new Set(), i = !1, s = e.map(() => {
    }), o = e.map((a, u) => xe.from(a).subscribe({
      next(f) {
        if (s[u] = f, !i) {
          if (r.add(u), r.size !== e.length)
            return;
          r = null, i = !0;
        }
        t.next(Array.from(s));
      },
      error(f) {
        t.error(f);
      },
      complete() {
        --n === 0 && t.complete();
      }
    }));
    return () => o.forEach((a) => a.unsubscribe());
  });
}
function nE(...e) {
  return new xe((t) => {
    if (e.length === 0)
      return xe.from([]);
    let n = e.map(() => []);
    function r() {
      return n.some((s, o) => s.length === 0 && i[o].closed);
    }
    let i = e.map((s, o) => xe.from(s).subscribe({
      next(a) {
        n[o].push(a), n.every((u) => u.length > 0) && (t.next(n.map((u) => u.shift())), r() && t.complete());
      },
      error(a) {
        t.error(a);
      },
      complete() {
        r() && t.complete();
      }
    }));
    return () => i.forEach((s) => s.unsubscribe());
  });
}
const E5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Observable: xe,
  combineLatest: tE,
  merge: eE,
  zip: nE
}, Symbol.toStringTag, { value: "Module" }));
function S5() {
  let e = [];
  const t = {
    add(n, r) {
      r = { stage: 0, once: !1, ...r ?? {} };
      let i = e.findIndex((o) => r.stage < o.stage);
      i !== -1 ? e.splice(i, 0, { fn: n, stage: r.stage, once: r.once }) : e.push({ fn: n, stage: r.stage, once: r.once });
      let s = !1;
      return () => {
        s || (s = !0, t.remove(n));
      };
    },
    remove(n) {
      e = e.filter((r) => r.fn !== n);
    },
    dispatch(...n) {
      let r = !1, i = !1;
      const s = {
        stop: () => {
          r = !0;
        },
        remove: () => {
          i = !0;
        }
      };
      e.some((o) => (o.fn(...n, s), (i || o.once) && t.remove(o.fn), r));
    },
    clear() {
      e.length = 0;
    }
  };
  return t;
}
class x5 {
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
  constructor(t) {
    this.options = Object.assign(this.options, t ?? {});
  }
  // Fire callbacks
  _fire() {
    const t = this.queue;
    for (this.locked = this.locked || this.options.once, this.fired = this.firing = !0; t.length; this.firingIndex = -1)
      for (this.memory = t.shift(); ++this.firingIndex < this.list.length; )
        this.list[this.firingIndex].apply(this.memory[0], this.memory[1]) === !1 && this.options.stopOnFalse && (this.firingIndex = this.list.length, this.memory = !1);
    this.options.memory || (this.memory = !1), this.firing = !1, this.locked && (this.memory ? this.list = [] : (this.list = [], this.destroyedList = !0));
  }
  add(...t) {
    return this.destroyedList || (this.memory && !this.firing && (this.firingIndex = this.list.length - 1, this.queue.push(this.memory)), t.forEach((n) => {
      typeof n == "function" ? (!this.options.unique || !this.has(n)) && this.list.push(n) : n && n.length && Array.isArray(n) && this.add(...n);
    }), this.memory && !this.firing && this._fire()), this;
  }
  // Remove a callback from the list
  remove(...t) {
    return t.forEach((n) => {
      for (var r = 0; (r = this.list.indexOf(n, r)) > -1; )
        this.list.splice(r, 1), r <= this.firingIndex && this.firingIndex--;
    }), this;
  }
  // Check if a given callback is in the list.
  // If no argument is given, return whether or not list has callbacks attached.
  has(t) {
    return t ? this.list.indexOf(t) > -1 : this.list.length > 0;
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
  fireWith(t, n) {
    return this.locked || (n = n || [], n = [t, n.slice ? n.slice() : n], this.queue.push(n), this.firing || this._fire()), this;
  }
  // 用给定参数调用所有回调   
  fire(...t) {
    return this.fireWith(this, t), this;
  }
}
class T5 {
  heap;
  compare;
  /**
   * 创建优先队列
   * @param compare 比较函数 (a, b) => 负数表示a应排在b前面
   */
  constructor(t) {
    this.heap = [], this.compare = t;
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
  enqueue(t) {
    this.heap.push(t), this.siftUp(this.size - 1);
  }
  push(t) {
    this.enqueue(t);
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
    const t = this.heap[0], n = this.heap.pop();
    return this.isEmpty() || (this.heap[0] = n, this.siftDown(0)), t;
  }
  // 上浮操作
  siftUp(t) {
    for (; t > 0; ) {
      const n = Math.floor((t - 1) / 2);
      if (this.compare(this.heap[t], this.heap[n]) >= 0) break;
      this.swap(t, n), t = n;
    }
  }
  // 下沉操作
  siftDown(t) {
    const n = this.size;
    for (; t < n; ) {
      const r = 2 * t + 1, i = 2 * t + 2;
      let s = t;
      if (r < n && this.compare(this.heap[r], this.heap[s]) < 0 && (s = r), i < n && this.compare(this.heap[i], this.heap[s]) < 0 && (s = i), s === t) break;
      this.swap(t, s), t = s;
    }
  }
  // 交换元素
  swap(t, n) {
    [this.heap[t], this.heap[n]] = [this.heap[n], this.heap[t]];
  }
  /**
   * 清空队列
   */
  clear() {
    this.heap = [];
  }
}
const gv = (e) => !!e && e.constructor === Symbol, Bs = Array.isArray, pl = (e) => !!e && e.constructor === Object, yv = (e) => e == null || typeof e != "object" && typeof e != "function", po = (e) => !!(e && e.constructor && e.call && e.apply), rE = (e) => typeof e == "string" || e instanceof String, iE = (e) => mi(e) && e % 1 === 0, sE = (e) => mi(e) && e % 1 !== 0, mi = (e) => {
  try {
    return Number(e) === e;
  } catch {
    return !1;
  }
}, bv = (e) => Object.prototype.toString.call(e) === "[object Date]", mv = (e) => !(!e || !e.then || !po(e.then)), oE = (e) => {
  if (e === !0 || e === !1 || e == null) return !0;
  if (mi(e)) return e === 0;
  if (bv(e)) return isNaN(e.getTime());
  if (po(e) || gv(e)) return !1;
  const t = e.length;
  if (mi(t)) return t === 0;
  const n = e.size;
  return mi(n) ? n === 0 : Object.keys(e).length === 0;
}, wv = (e, t) => {
  if (Object.is(e, t)) return !0;
  if (e instanceof Date && t instanceof Date)
    return e.getTime() === t.getTime();
  if (e instanceof RegExp && t instanceof RegExp)
    return e.toString() === t.toString();
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  const n = Reflect.ownKeys(e), r = Reflect.ownKeys(t);
  if (n.length !== r.length) return !1;
  for (let i = 0; i < n.length; i++)
    if (!Reflect.has(t, n[i]) || !wv(e[n[i]], t[n[i]])) return !1;
  return !0;
}, aE = (e, t) => e.reduce((n, r) => {
  const i = t(r);
  return n[i] || (n[i] = []), n[i].push(r), n;
}, {});
function uE(...e) {
  return !e || !e.length ? [] : new Array(Math.max(...e.map(({ length: t }) => t))).fill([]).map((t, n) => e.map((r) => r[n]));
}
function fE(e, t) {
  if (!e || !e.length)
    return {};
  const n = po(t) ? t : Bs(t) ? (r, i) => t[i] : (r, i) => t;
  return e.reduce((r, i, s) => (r[i] = n(i, s), r), {});
}
const dl = (e, t) => !e || (e.length ?? 0) === 0 ? null : e.reduce(t);
function cE(e, t) {
  return (e || []).reduce((n, r) => n + (t ? t(r) : r), 0);
}
const lE = (e, t = void 0) => e?.length > 0 ? e[0] : t, hE = (e, t = void 0) => e?.length > 0 ? e[e.length - 1] : t, Av = (e, t, n = !1) => {
  if (!e) return [];
  const r = (s, o) => t(s) - t(o), i = (s, o) => t(o) - t(s);
  return e.slice().sort(n === !0 ? i : r);
}, pE = (e, t, n = "asc") => {
  if (!e) return [];
  const r = (s, o) => `${t(s)}`.localeCompare(t(o)), i = (s, o) => `${t(o)}`.localeCompare(t(s));
  return e.slice().sort(n === "desc" ? i : r);
}, dE = (e, t) => e ? e.reduce((n, r) => {
  const i = t(r);
  return n[i] = (n[i] ?? 0) + 1, n;
}, {}) : {}, _E = (e, t, n) => {
  if (!e) return [];
  if (t === void 0) return [...e];
  for (let r = 0; r < e.length; r++) {
    const i = e[r];
    if (n(i, r))
      return [
        ...e.slice(0, r),
        t,
        ...e.slice(r + 1, e.length)
      ];
  }
  return [...e];
}, Ov = (e, t, n = (r) => r) => e.reduce((r, i) => (r[t(i)] = n(i), r), {}), vE = (e, t, n) => e ? e.reduce((r, i, s) => (n(i, s) && r.push(t(i, s)), r), []) : [];
function gE(e, t) {
  const n = t ?? ((r) => r);
  return dl(e, (r, i) => n(r) > n(i) ? r : i);
}
function yE(e, t) {
  const n = t ?? ((r) => r);
  return dl(e, (r, i) => n(r) < n(i) ? r : i);
}
const bE = (e, t = 2) => {
  const n = Math.ceil(e.length / t);
  return new Array(n).fill(null).map((r, i) => e.slice(i * t, i * t + t));
}, mE = (e, t) => {
  const n = e.reduce((r, i) => {
    const s = t ? t(i) : i;
    return r[s] || (r[s] = i), r;
  }, {});
  return Object.values(n);
};
function* _l(e, t, n = (i) => i, r = 1) {
  const i = po(n) ? n : () => n, s = t ? e : 0, o = t ?? e;
  for (let a = s; a <= o && (yield i(a), !(a + r > o)); a += r)
    ;
}
const vl = (e, t, n, r) => Array.from(_l(e, t, n, r)), wE = (e) => e.reduce((t, n) => (t.push(...n), t), []), AE = (e, t, n) => {
  if (!e || !t) return !1;
  const r = n ?? ((s) => s), i = t.reduce((s, o) => (s[r(o)] = !0, s), {});
  return e.some((s) => i[r(s)]);
}, Ev = (e, t) => e ? e.reduce(
  (n, r) => {
    const [i, s] = n;
    return t(r) ? [[...i, r], s] : [i, [...s, r]];
  },
  [[], []]
) : [[], []], OE = (e, t, n) => !t && !e ? [] : t ? e ? n ? e.reduce((r, i) => {
  const s = t.find((o) => n(i) === n(o));
  return s ? r.push(s) : r.push(i), r;
}, []) : e : [] : e, EE = (e, t, n) => {
  if (!e && !t) return [];
  if (!t) return [...e];
  if (!e) return [t];
  for (let r = 0; r < e.length; r++) {
    const i = e[r];
    if (n(i, r))
      return [
        ...e.slice(0, r),
        t,
        ...e.slice(r + 1, e.length)
      ];
  }
  return [...e, t];
}, SE = (e, t, n, r) => {
  if (!e && !t) return [];
  if (!e) return [t];
  if (!t) return [...e];
  const i = n ? (a, u) => n(a, u) === n(t, u) : (a) => a === t;
  return e.find(i) ? e.filter((a, u) => !i(a, u)) : (r?.strategy ?? "append") === "append" ? [...e, t] : [t, ...e];
}, xE = (e) => e?.filter((t) => !!t) ?? [], Sv = (e, t, n) => {
  let r = n;
  for (let i = 1; i <= e; i++)
    r = t(r, i);
  return r;
}, TE = (e, t, n = (r) => r) => {
  if (!e?.length && !t?.length) return [];
  if (e?.length === void 0) return [...t];
  if (!t?.length) return [...e];
  const r = t.reduce((i, s) => (i[n(s)] = !0, i), {});
  return e.filter((i) => !r[n(i)]);
};
function RE(e, t) {
  if (e.length === 0) return e;
  const n = t % e.length;
  return n === 0 ? e : [...e.slice(-n, e.length), ...e.slice(0, -n)];
}
const PE = async (e, t, n) => {
  const r = n !== void 0;
  if (!r && e?.length < 1)
    throw new Error("Cannot reduce empty array with no init value");
  const i = r ? e : e.slice(1);
  let s = r ? n : e[0];
  for (const [o, a] of i.entries())
    s = await t(s, a, o);
  return s;
}, NE = async (e, t) => {
  if (!e) return [];
  let n = [], r = 0;
  for (const i of e) {
    const s = await t(i, r++);
    n.push(s);
  }
  return n;
}, $E = async (e) => {
  const t = [], n = (s, o) => t.push({
    fn: s,
    rethrow: o?.rethrow ?? !1
  }), [r, i] = await Ni(e)(n);
  for (const { fn: s, rethrow: o } of t) {
    const [a] = await Ni(s)(r);
    if (a && o) throw a;
  }
  if (r) throw r;
  return i;
};
class xv extends Error {
  errors;
  constructor(t = []) {
    super();
    const n = t.find((r) => r.name)?.name ?? "";
    this.name = `AggregateError(${n}...)`, this.message = `AggregateError with ${t.length} errors`, this.stack = t.find((r) => r.stack)?.stack ?? this.stack, this.errors = t;
  }
}
const ME = async (e, t, n) => {
  const r = t.map((f, c) => ({
    index: c,
    item: f
  })), i = async (f) => {
    const c = [];
    for (; ; ) {
      const l = r.pop();
      if (!l) return f(c);
      const [h, d] = await Ni(n)(l.item);
      c.push({
        error: h,
        result: d,
        index: l.index
      });
    }
  }, s = vl(1, e).map(() => new Promise(i)), o = await Promise.all(s), [a, u] = Ev(
    Av(o.flat(), (f) => f.index),
    (f) => !!f.error
  );
  if (a.length > 0)
    throw new xv(a.map((f) => f.error));
  return u.map((f) => f.result);
};
async function IE(e) {
  const t = Bs(e) ? e.map((i) => [null, i]) : Object.entries(e), n = await Promise.all(
    t.map(
      ([i, s]) => s.then((o) => ({ result: o, exc: null, key: i })).catch((o) => ({ result: null, exc: o, key: i }))
    )
  ), r = n.filter((i) => i.exc);
  if (r.length > 0)
    throw new xv(r.map((i) => i.exc));
  return Bs(e) ? n.map((i) => i.result) : n.reduce(
    (i, s) => ({
      ...i,
      [s.key]: s.result
    }),
    {}
  );
}
const DE = async (e, t) => {
  const n = e?.times ?? 3, r = e?.delay, i = e?.backoff ?? null;
  for (const s of _l(1, n)) {
    const [o, a] = await Ni(t)((u) => {
      throw { _exited: u };
    });
    if (!o) return a;
    if (o._exited) throw o._exited;
    if (s === n) throw o;
    r && await fc(r), i && await fc(i(s));
  }
}, fc = (e) => new Promise((t) => setTimeout(t, e)), Ni = (e) => (...t) => {
  try {
    const n = e(...t);
    return mv(n) ? n.then((r) => [void 0, r]).catch((r) => [r, void 0]) : [void 0, n];
  } catch (n) {
    return [n, void 0];
  }
}, CE = (e, t) => {
  const n = (i) => {
    if (t && !t(i)) throw i;
  }, r = (i) => i instanceof Promise;
  try {
    const i = e();
    return r(i) ? i.catch(n) : i;
  } catch (i) {
    return n(i);
  }
};
function LE(...e) {
  return (...t) => e.slice(1).reduce((n, r) => r(n), e[0](...t));
}
function jE(...e) {
  return e.reverse().reduce((t, n) => n(t));
}
const FE = (e, ...t) => (...n) => e(...t, ...n), BE = (e, t) => (n) => e({
  ...t,
  ...n
}), zE = (e) => new Proxy(
  {},
  {
    get: (t, n) => e(n)
  }
), UE = (e, t, n, r) => function(...s) {
  const o = n ? n(...s) : JSON.stringify({ args: s }), a = e[o];
  if (a !== void 0 && (!a.exp || a.exp > (/* @__PURE__ */ new Date()).getTime()))
    return a.value;
  const u = t(...s);
  return e[o] = {
    exp: r ? (/* @__PURE__ */ new Date()).getTime() + r : null,
    value: u
  }, u;
}, VE = (e, t = {}) => UE({}, e, t.key ?? null, t.ttl ?? null), WE = ({ delay: e }, t) => {
  let n, r = !0;
  const i = (...s) => {
    r ? (clearTimeout(n), n = setTimeout(() => {
      r && t(...s), n = void 0;
    }, e)) : t(...s);
  };
  return i.isPending = () => n !== void 0, i.cancel = () => {
    r = !1;
  }, i.flush = (...s) => t(...s), i;
}, kE = ({ interval: e }, t) => {
  let n = !0, r;
  const i = (...s) => {
    n && (t(...s), n = !1, r = setTimeout(() => {
      n = !0, r = void 0;
    }, e));
  };
  return i.isThrottled = () => r !== void 0, i;
}, qE = (e, t) => {
  const n = () => {
  };
  return new Proxy(Object.assign(n, e), {
    get: (r, i) => r[i],
    set: (r, i, s) => (r[i] = s, !0),
    apply: (r, i, s) => t(Object.assign({}, r))(...s)
  });
};
function GE(e, t, n) {
  return typeof e == "number" && typeof t == "number" && (typeof n > "u" || typeof n == "number") ? (typeof n > "u" && (n = t, t = 0), e >= Math.min(t, n) && e < Math.max(t, n)) : !1;
}
const HE = (e, t) => {
  const n = t === void 0 ? 0 : t;
  if (e == null)
    return n;
  const r = parseFloat(e);
  return isNaN(r) ? n : r;
}, Tv = (e, t) => {
  const n = t === void 0 ? 0 : t;
  if (e == null)
    return n;
  const r = parseInt(e);
  return isNaN(r) ? n : r;
}, KE = (e, t = (n) => n === void 0) => e ? Object.keys(e).reduce((r, i) => (t(e[i]) || (r[i] = e[i]), r), {}) : {}, gl = (e, t) => Object.keys(e).reduce((r, i) => (r[t(i, e[i])] = e[i], r), {}), YE = (e, t) => Object.keys(e).reduce((r, i) => (r[i] = t(e[i], i), r), {}), XE = (e, t) => e ? Object.entries(e).reduce((n, [r, i]) => {
  const [s, o] = t(r, i);
  return n[s] = o, n;
}, {}) : {}, JE = (e) => e ? Object.keys(e).reduce((n, r) => (n[e[r]] = r, n), {}) : {}, ZE = (e) => gl(e, (t) => t.toLowerCase()), QE = (e) => gl(e, (t) => t.toUpperCase()), Rv = (e) => {
  if (yv(e))
    return e;
  if (typeof e == "function")
    return e.bind({});
  const t = new e.constructor();
  return Object.getOwnPropertyNames(e).forEach((n) => {
    t[n] = e[n];
  }), t;
}, eS = (e, t) => {
  if (!e) return [];
  const n = Object.entries(e);
  return n.length === 0 ? [] : n.reduce((r, i) => (r.push(t(i[0], i[1])), r), []);
}, tS = (e, t) => e ? t.reduce((n, r) => (Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r]), n), {}) : {}, nS = (e, t) => e ? !t || t.length === 0 ? e : t.reduce(
  (n, r) => (delete n[r], n),
  { ...e }
) : {}, Pv = (e, t, n) => {
  const r = t.split(/[\.\[\]]/g);
  let i = e;
  for (const s of r) {
    if (i === null || i === void 0) return n;
    const o = s.replace(/['"]/g, "");
    o.trim() !== "" && (i = i[o]);
  }
  return i === void 0 ? n : i;
}, Nv = (e, t, n) => {
  if (!e) return {};
  if (!t || n === void 0) return e;
  const r = t.split(/[\.\[\]]/g).filter((o) => !!o.trim()), i = (o) => {
    if (r.length > 1) {
      const a = r.shift(), u = Tv(r[0], null) !== null;
      o[a] = o[a] === void 0 ? u ? [] : {} : o[a], i(o[a]);
    } else
      o[r[0]] = n;
  }, s = Rv(e);
  return i(s), s;
}, $v = (e, t) => !e || !t ? e ?? t ?? {} : Object.entries({ ...e, ...t }).reduce(
  (n, [r, i]) => ({
    ...n,
    [r]: pl(e[r]) ? $v(e[r], i) : i
  }),
  {}
), Mv = (e) => {
  if (!e) return [];
  const t = (n, r) => pl(n) ? Object.entries(n).flatMap(
    ([i, s]) => t(s, [...r, i])
  ) : Bs(n) ? n.flatMap((i, s) => t(i, [...r, `${s}`])) : [r.join(".")];
  return t(e, []);
}, rS = (e) => e ? Ov(
  Mv(e),
  (t) => t,
  (t) => Pv(e, t)
) : {}, iS = (e) => e ? Object.keys(e).reduce((t, n) => Nv(t, n, e[n]), {}) : {}, yl = (e, t) => Math.floor(Math.random() * (t - e + 1) + e), sS = (e) => {
  const t = e.length;
  if (t === 0)
    return null;
  const n = yl(0, t - 1);
  return e[n];
}, oS = (e) => e.map((t) => ({ rand: Math.random(), value: t })).sort((t, n) => t.rand - n.rand).map((t) => t.value), aS = (e, t = "") => {
  const n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" + t;
  return Sv(
    e,
    (r) => r + n.charAt(yl(0, n.length - 1)),
    ""
  );
}, uS = (e, t = (n) => `${n}`) => {
  const { indexesByKey: n, itemsByIndex: r } = e.reduce(
    (l, h, d) => ({
      indexesByKey: {
        ...l.indexesByKey,
        [t(h)]: d
      },
      itemsByIndex: {
        ...l.itemsByIndex,
        [d]: h
      }
    }),
    {
      indexesByKey: {},
      itemsByIndex: {}
    }
  ), i = (l, h) => n[t(l)] < n[t(h)] ? l : h, s = (l, h) => n[t(l)] > n[t(h)] ? l : h, o = () => r[0], a = () => r[e.length - 1], u = (l, h) => r[n[t(l)] + 1] ?? h ?? o(), f = (l, h) => r[n[t(l)] - 1] ?? h ?? a();
  return {
    min: i,
    max: s,
    first: o,
    last: a,
    next: u,
    previous: f,
    spin: (l, h) => {
      if (h === 0) return l;
      const d = Math.abs(h), _ = d > e.length ? d % e.length : d;
      return vl(0, _ - 1).reduce(
        (v) => h > 0 ? u(v) : f(v),
        l
      );
    }
  };
}, _o = (e) => {
  if (!e || e.length === 0) return "";
  const t = e.toLowerCase();
  return t.substring(0, 1).toUpperCase() + t.substring(1, t.length);
}, fS = (e) => {
  const t = e?.replace(/([A-Z])+/g, _o)?.split(/(?=[A-Z])|[\.\-\s_]/).map((n) => n.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.length === 1 ? t[0] : t.reduce((n, r) => `${n}${r.charAt(0).toUpperCase()}${r.slice(1)}`);
}, cS = (e, t) => {
  const n = e?.replace(/([A-Z])+/g, _o).split(/(?=[A-Z])|[\.\-\s_]/).map((i) => i.toLowerCase()) ?? [];
  if (n.length === 0) return "";
  if (n.length === 1) return n[0];
  const r = n.reduce((i, s) => `${i}_${s.toLowerCase()}`);
  return t?.splitOnNumber === !1 ? r : r.replace(/([A-Za-z]{1}[0-9]{1})/, (i) => `${i[0]}_${i[1]}`);
}, lS = (e) => {
  const t = e?.replace(/([A-Z])+/g, _o)?.split(/(?=[A-Z])|[\.\-\s_]/).map((n) => n.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.length === 1 ? t[0] : t.reduce((n, r) => `${n}-${r.toLowerCase()}`);
}, hS = (e) => {
  const t = e?.split(/[\.\-\s_]/).map((n) => n.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join("");
}, pS = (e) => e ? e.split(/(?=[A-Z])|[\.\-\s_]/).map((t) => t.trim()).filter((t) => !!t).map((t) => _o(t.toLowerCase())).join(" ") : "", dS = (e, t, n = /\{\{(.+?)\}\}/g) => Array.from(e.matchAll(n)).reduce((r, i) => r.replace(i[0], t[i[1]]), e), _S = (e, t = " ") => {
  if (!e) return "";
  const n = t.replace(/[\W]{1}/g, "\\$&"), r = new RegExp(`^[${n}]+|[${n}]+$`, "g");
  return e.replace(r, "");
}, R5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  all: IE,
  alphabetical: pE,
  assign: $v,
  boil: dl,
  callable: qE,
  camel: fS,
  capitalize: _o,
  chain: LE,
  clone: Rv,
  cluster: bE,
  compose: jE,
  construct: iS,
  counting: dE,
  crush: rS,
  dash: lS,
  debounce: WE,
  defer: $E,
  diff: TE,
  draw: sS,
  first: lE,
  flat: wE,
  fork: Ev,
  get: Pv,
  group: aE,
  guard: CE,
  inRange: GE,
  intersects: AE,
  invert: JE,
  isArray: Bs,
  isDate: bv,
  isEmpty: oE,
  isEqual: wv,
  isFloat: sE,
  isFunction: po,
  isInt: iE,
  isNumber: mi,
  isObject: pl,
  isPrimitive: yv,
  isPromise: mv,
  isString: rE,
  isSymbol: gv,
  iterate: Sv,
  keys: Mv,
  last: hE,
  list: vl,
  listify: eS,
  lowerize: ZE,
  map: NE,
  mapEntries: XE,
  mapKeys: gl,
  mapValues: YE,
  max: gE,
  memo: VE,
  merge: OE,
  min: yE,
  objectify: Ov,
  omit: nS,
  parallel: ME,
  partial: FE,
  partob: BE,
  pascal: hS,
  pick: tS,
  proxied: zE,
  random: yl,
  range: _l,
  reduce: PE,
  replace: _E,
  replaceOrAppend: EE,
  retry: DE,
  select: vE,
  series: uS,
  set: Nv,
  shake: KE,
  shift: RE,
  shuffle: oS,
  sift: xE,
  sleep: fc,
  snake: cS,
  sort: Av,
  sum: cE,
  template: dS,
  throttle: kE,
  title: pS,
  toFloat: HE,
  toInt: Tv,
  toggle: SE,
  trim: _S,
  try: Ni,
  tryit: Ni,
  uid: aS,
  unique: mE,
  upperize: QE,
  zip: uE,
  zipToObject: fE
}, Symbol.toStringTag, { value: "Module" }));
var Iv = typeof global == "object" && global && global.Object === Object && global, vS = typeof self == "object" && self && self.Object === Object && self, Se = Iv || vS || Function("return this")(), De = Se.Symbol, Dv = Object.prototype, gS = Dv.hasOwnProperty, yS = Dv.toString, vs = De ? De.toStringTag : void 0;
function bS(e) {
  var t = gS.call(e, vs), n = e[vs];
  try {
    e[vs] = void 0;
    var r = !0;
  } catch {
  }
  var i = yS.call(e);
  return r && (t ? e[vs] = n : delete e[vs]), i;
}
var mS = Object.prototype, wS = mS.toString;
function AS(e) {
  return wS.call(e);
}
var OS = "[object Null]", ES = "[object Undefined]", Hp = De ? De.toStringTag : void 0;
function Ge(e) {
  return e == null ? e === void 0 ? ES : OS : Hp && Hp in Object(e) ? bS(e) : AS(e);
}
function oe(e) {
  return e != null && typeof e == "object";
}
var SS = "[object Symbol]";
function it(e) {
  return typeof e == "symbol" || oe(e) && Ge(e) == SS;
}
var xS = NaN;
function Kp(e) {
  return typeof e == "number" ? e : it(e) ? xS : +e;
}
function ie(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length, i = Array(r); ++n < r; )
    i[n] = t(e[n], n, e);
  return i;
}
var M = Array.isArray, Yp = De ? De.prototype : void 0, Xp = Yp ? Yp.toString : void 0;
function bt(e) {
  if (typeof e == "string")
    return e;
  if (M(e))
    return ie(e, bt) + "";
  if (it(e))
    return Xp ? Xp.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function hu(e, t) {
  return function(n, r) {
    var i;
    if (n === void 0 && r === void 0)
      return t;
    if (n !== void 0 && (i = n), r !== void 0) {
      if (i === void 0)
        return r;
      typeof n == "string" || typeof r == "string" ? (n = bt(n), r = bt(r)) : (n = Kp(n), r = Kp(r)), i = e(n, r);
    }
    return i;
  };
}
var Cv = hu(function(e, t) {
  return e + t;
}, 0), TS = /\s/;
function Lv(e) {
  for (var t = e.length; t-- && TS.test(e.charAt(t)); )
    ;
  return t;
}
var RS = /^\s+/;
function jv(e) {
  return e && e.slice(0, Lv(e) + 1).replace(RS, "");
}
function se(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var Jp = NaN, PS = /^[-+]0x[0-9a-f]+$/i, NS = /^0b[01]+$/i, $S = /^0o[0-7]+$/i, MS = parseInt;
function dt(e) {
  if (typeof e == "number")
    return e;
  if (it(e))
    return Jp;
  if (se(e)) {
    var t = typeof e.valueOf == "function" ? e.valueOf() : e;
    e = se(t) ? t + "" : t;
  }
  if (typeof e != "string")
    return e === 0 ? e : +e;
  e = jv(e);
  var n = NS.test(e);
  return n || $S.test(e) ? MS(e.slice(2), n ? 2 : 8) : PS.test(e) ? Jp : +e;
}
var Zp = 1 / 0, IS = 17976931348623157e292;
function pn(e) {
  if (!e)
    return e === 0 ? e : 0;
  if (e = dt(e), e === Zp || e === -Zp) {
    var t = e < 0 ? -1 : 1;
    return t * IS;
  }
  return e === e ? e : 0;
}
function I(e) {
  var t = pn(e), n = t % 1;
  return t === t ? n ? t - n : t : 0;
}
var DS = "Expected a function";
function Fv(e, t) {
  if (typeof t != "function")
    throw new TypeError(DS);
  return e = I(e), function() {
    if (--e < 1)
      return t.apply(this, arguments);
  };
}
function He(e) {
  return e;
}
var CS = "[object AsyncFunction]", LS = "[object Function]", jS = "[object GeneratorFunction]", FS = "[object Proxy]";
function wn(e) {
  if (!se(e))
    return !1;
  var t = Ge(e);
  return t == LS || t == jS || t == CS || t == FS;
}
var Aa = Se["__core-js_shared__"], Qp = function() {
  var e = /[^.]+$/.exec(Aa && Aa.keys && Aa.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}();
function BS(e) {
  return !!Qp && Qp in e;
}
var zS = Function.prototype, US = zS.toString;
function Yr(e) {
  if (e != null) {
    try {
      return US.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
var VS = /[\\^$.*+?()[\]{}|]/g, WS = /^\[object .+?Constructor\]$/, kS = Function.prototype, qS = Object.prototype, GS = kS.toString, HS = qS.hasOwnProperty, KS = RegExp(
  "^" + GS.call(HS).replace(VS, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function Bv(e) {
  if (!se(e) || BS(e))
    return !1;
  var t = wn(e) ? KS : WS;
  return t.test(Yr(e));
}
function YS(e, t) {
  return e?.[t];
}
function Xr(e, t) {
  var n = YS(e, t);
  return Bv(n) ? n : void 0;
}
var zs = Xr(Se, "WeakMap"), $a = zs && new zs(), zv = $a ? function(e, t) {
  return $a.set(e, t), e;
} : He, ed = Object.create, Hi = /* @__PURE__ */ function() {
  function e() {
  }
  return function(t) {
    if (!se(t))
      return {};
    if (ed)
      return ed(t);
    e.prototype = t;
    var n = new e();
    return e.prototype = void 0, n;
  };
}();
function Us(e) {
  return function() {
    var t = arguments;
    switch (t.length) {
      case 0:
        return new e();
      case 1:
        return new e(t[0]);
      case 2:
        return new e(t[0], t[1]);
      case 3:
        return new e(t[0], t[1], t[2]);
      case 4:
        return new e(t[0], t[1], t[2], t[3]);
      case 5:
        return new e(t[0], t[1], t[2], t[3], t[4]);
      case 6:
        return new e(t[0], t[1], t[2], t[3], t[4], t[5]);
      case 7:
        return new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6]);
    }
    var n = Hi(e.prototype), r = e.apply(n, t);
    return se(r) ? r : n;
  };
}
var XS = 1;
function JS(e, t, n) {
  var r = t & XS, i = Us(e);
  function s() {
    var o = this && this !== Se && this instanceof s ? i : e;
    return o.apply(r ? n : this, arguments);
  }
  return s;
}
function mt(e, t, n) {
  switch (n.length) {
    case 0:
      return e.call(t);
    case 1:
      return e.call(t, n[0]);
    case 2:
      return e.call(t, n[0], n[1]);
    case 3:
      return e.call(t, n[0], n[1], n[2]);
  }
  return e.apply(t, n);
}
var ZS = Math.max;
function Uv(e, t, n, r) {
  for (var i = -1, s = e.length, o = n.length, a = -1, u = t.length, f = ZS(s - o, 0), c = Array(u + f), l = !r; ++a < u; )
    c[a] = t[a];
  for (; ++i < o; )
    (l || i < s) && (c[n[i]] = e[i]);
  for (; f--; )
    c[a++] = e[i++];
  return c;
}
var QS = Math.max;
function Vv(e, t, n, r) {
  for (var i = -1, s = e.length, o = -1, a = n.length, u = -1, f = t.length, c = QS(s - a, 0), l = Array(c + f), h = !r; ++i < c; )
    l[i] = e[i];
  for (var d = i; ++u < f; )
    l[d + u] = t[u];
  for (; ++o < a; )
    (h || i < s) && (l[d + n[o]] = e[i++]);
  return l;
}
function ex(e, t) {
  for (var n = e.length, r = 0; n--; )
    e[n] === t && ++r;
  return r;
}
function pu() {
}
var tx = 4294967295;
function C(e) {
  this.__wrapped__ = e, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = tx, this.__views__ = [];
}
C.prototype = Hi(pu.prototype);
C.prototype.constructor = C;
function du() {
}
var bl = $a ? function(e) {
  return $a.get(e);
} : du, wi = {}, nx = Object.prototype, rx = nx.hasOwnProperty;
function Oa(e) {
  for (var t = e.name + "", n = wi[t], r = rx.call(wi, t) ? n.length : 0; r--; ) {
    var i = n[r], s = i.func;
    if (s == null || s == e)
      return i.name;
  }
  return t;
}
function jt(e, t) {
  this.__wrapped__ = e, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = void 0;
}
jt.prototype = Hi(pu.prototype);
jt.prototype.constructor = jt;
function nt(e, t) {
  var n = -1, r = e.length;
  for (t || (t = Array(r)); ++n < r; )
    t[n] = e[n];
  return t;
}
function Wv(e) {
  if (e instanceof C)
    return e.clone();
  var t = new jt(e.__wrapped__, e.__chain__);
  return t.__actions__ = nt(e.__actions__), t.__index__ = e.__index__, t.__values__ = e.__values__, t;
}
var ix = Object.prototype, sx = ix.hasOwnProperty;
function p(e) {
  if (oe(e) && !M(e) && !(e instanceof C)) {
    if (e instanceof jt)
      return e;
    if (sx.call(e, "__wrapped__"))
      return Wv(e);
  }
  return new jt(e);
}
p.prototype = pu.prototype;
p.prototype.constructor = p;
function cc(e) {
  var t = Oa(e), n = p[t];
  if (typeof n != "function" || !(t in C.prototype))
    return !1;
  if (e === n)
    return !0;
  var r = bl(n);
  return !!r && e === r[0];
}
var ox = 800, ax = 16, ux = Date.now;
function kv(e) {
  var t = 0, n = 0;
  return function() {
    var r = ux(), i = ax - (r - n);
    if (n = r, i > 0) {
      if (++t >= ox)
        return arguments[0];
    } else
      t = 0;
    return e.apply(void 0, arguments);
  };
}
var qv = kv(zv), fx = /\{\n\/\* \[wrapped with (.+)\] \*/, cx = /,? & /;
function lx(e) {
  var t = e.match(fx);
  return t ? t[1].split(cx) : [];
}
var hx = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
function px(e, t) {
  var n = t.length;
  if (!n)
    return e;
  var r = n - 1;
  return t[r] = (n > 1 ? "& " : "") + t[r], t = t.join(n > 2 ? ", " : " "), e.replace(hx, `{
/* [wrapped with ` + t + `] */
`);
}
function _u(e) {
  return function() {
    return e;
  };
}
var Ma = function() {
  try {
    var e = Xr(Object, "defineProperty");
    return e({}, "", {}), e;
  } catch {
  }
}(), dx = Ma ? function(e, t) {
  return Ma(e, "toString", {
    configurable: !0,
    enumerable: !1,
    value: _u(t),
    writable: !0
  });
} : He, ml = kv(dx);
function Ut(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r && t(e[n], n, e) !== !1; )
    ;
  return e;
}
function vu(e, t, n, r) {
  for (var i = e.length, s = n + (r ? 1 : -1); r ? s-- : ++s < i; )
    if (t(e[s], s, e))
      return s;
  return -1;
}
function Gv(e) {
  return e !== e;
}
function _x(e, t, n) {
  for (var r = n - 1, i = e.length; ++r < i; )
    if (e[r] === t)
      return r;
  return -1;
}
function Ki(e, t, n) {
  return t === t ? _x(e, t, n) : vu(e, Gv, n);
}
function gu(e, t) {
  var n = e == null ? 0 : e.length;
  return !!n && Ki(e, t, 0) > -1;
}
var vx = 1, gx = 2, yx = 8, bx = 16, mx = 32, wx = 64, Ax = 128, Ox = 256, Ex = 512, Sx = [
  ["ary", Ax],
  ["bind", vx],
  ["bindKey", gx],
  ["curry", yx],
  ["curryRight", bx],
  ["flip", Ex],
  ["partial", mx],
  ["partialRight", wx],
  ["rearg", Ox]
];
function xx(e, t) {
  return Ut(Sx, function(n) {
    var r = "_." + n[0];
    t & n[1] && !gu(e, r) && e.push(r);
  }), e.sort();
}
function Hv(e, t, n) {
  var r = t + "";
  return ml(e, px(r, xx(lx(r), n)));
}
var Tx = 4, Rx = 8, td = 32, nd = 64;
function Kv(e, t, n, r, i, s, o, a, u, f) {
  var c = t & Rx, l = c ? o : void 0, h = c ? void 0 : o, d = c ? s : void 0, _ = c ? void 0 : s;
  t |= c ? td : nd, t &= ~(c ? nd : td), t & Tx || (t &= -4);
  var v = [
    e,
    t,
    i,
    d,
    l,
    _,
    h,
    a,
    u,
    f
  ], g = n.apply(void 0, v);
  return cc(e) && qv(g, v), g.placeholder = r, Hv(g, e, t);
}
function Yi(e) {
  var t = e;
  return t.placeholder;
}
var Px = 9007199254740991, Nx = /^(?:0|[1-9]\d*)$/;
function qn(e, t) {
  var n = typeof e;
  return t = t ?? Px, !!t && (n == "number" || n != "symbol" && Nx.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
var $x = Math.min;
function Mx(e, t) {
  for (var n = e.length, r = $x(t.length, n), i = nt(e); r--; ) {
    var s = t[r];
    e[r] = qn(s, n) ? i[s] : void 0;
  }
  return e;
}
var rd = "__lodash_placeholder__";
function or(e, t) {
  for (var n = -1, r = e.length, i = 0, s = []; ++n < r; ) {
    var o = e[n];
    (o === t || o === rd) && (e[n] = rd, s[i++] = n);
  }
  return s;
}
var Ix = 1, Dx = 2, Cx = 8, Lx = 16, jx = 128, Fx = 512;
function yu(e, t, n, r, i, s, o, a, u, f) {
  var c = t & jx, l = t & Ix, h = t & Dx, d = t & (Cx | Lx), _ = t & Fx, v = h ? void 0 : Us(e);
  function g() {
    for (var y = arguments.length, b = Array(y), w = y; w--; )
      b[w] = arguments[w];
    if (d)
      var m = Yi(g), A = ex(b, m);
    if (r && (b = Uv(b, r, i, d)), s && (b = Vv(b, s, o, d)), y -= A, d && y < f) {
      var S = or(b, m);
      return Kv(
        e,
        t,
        yu,
        g.placeholder,
        n,
        b,
        S,
        a,
        u,
        f - y
      );
    }
    var R = l ? n : this, B = h ? R[e] : e;
    return y = b.length, a ? b = Mx(b, a) : _ && y > 1 && b.reverse(), c && u < y && (b.length = u), this && this !== Se && this instanceof g && (B = v || Us(B)), B.apply(R, b);
  }
  return g;
}
function Bx(e, t, n) {
  var r = Us(e);
  function i() {
    for (var s = arguments.length, o = Array(s), a = s, u = Yi(i); a--; )
      o[a] = arguments[a];
    var f = s < 3 && o[0] !== u && o[s - 1] !== u ? [] : or(o, u);
    if (s -= f.length, s < n)
      return Kv(
        e,
        t,
        yu,
        i.placeholder,
        void 0,
        o,
        f,
        void 0,
        void 0,
        n - s
      );
    var c = this && this !== Se && this instanceof i ? r : e;
    return mt(c, this, o);
  }
  return i;
}
var zx = 1;
function Ux(e, t, n, r) {
  var i = t & zx, s = Us(e);
  function o() {
    for (var a = -1, u = arguments.length, f = -1, c = r.length, l = Array(c + u), h = this && this !== Se && this instanceof o ? s : e; ++f < c; )
      l[f] = r[f];
    for (; u--; )
      l[f++] = arguments[++a];
    return mt(h, i ? n : this, l);
  }
  return o;
}
var id = "__lodash_placeholder__", If = 1, Vx = 2, Wx = 4, sd = 8, gs = 128, od = 256, kx = Math.min;
function qx(e, t) {
  var n = e[1], r = t[1], i = n | r, s = i < (If | Vx | gs), o = r == gs && n == sd || r == gs && n == od && e[7].length <= t[8] || r == (gs | od) && t[7].length <= t[8] && n == sd;
  if (!(s || o))
    return e;
  r & If && (e[2] = t[2], i |= n & If ? 0 : Wx);
  var a = t[3];
  if (a) {
    var u = e[3];
    e[3] = u ? Uv(u, a, t[4]) : a, e[4] = u ? or(e[3], id) : t[4];
  }
  return a = t[5], a && (u = e[5], e[5] = u ? Vv(u, a, t[6]) : a, e[6] = u ? or(e[5], id) : t[6]), a = t[7], a && (e[7] = a), r & gs && (e[8] = e[8] == null ? t[8] : kx(e[8], t[8])), e[9] == null && (e[9] = t[9]), e[0] = t[0], e[1] = i, e;
}
var Gx = "Expected a function", ad = 1, Hx = 2, ud = 8, fd = 16, cd = 32, Kx = 64, ld = Math.max;
function Gn(e, t, n, r, i, s, o, a) {
  var u = t & Hx;
  if (!u && typeof e != "function")
    throw new TypeError(Gx);
  var f = r ? r.length : 0;
  if (f || (t &= -97, r = i = void 0), o = o === void 0 ? o : ld(I(o), 0), a = a === void 0 ? a : I(a), f -= i ? i.length : 0, t & Kx) {
    var c = r, l = i;
    r = i = void 0;
  }
  var h = u ? void 0 : bl(e), d = [
    e,
    t,
    n,
    r,
    i,
    c,
    l,
    s,
    o,
    a
  ];
  if (h && qx(d, h), e = d[0], t = d[1], n = d[2], r = d[3], i = d[4], a = d[9] = d[9] === void 0 ? u ? 0 : e.length : ld(d[9] - f, 0), !a && t & (ud | fd) && (t &= -25), !t || t == ad)
    var _ = JS(e, t, n);
  else t == ud || t == fd ? _ = Bx(e, t, a) : (t == cd || t == (ad | cd)) && !i.length ? _ = Ux(e, t, n, r) : _ = yu.apply(void 0, d);
  var v = h ? zv : qv;
  return Hv(v(_, d), e, t);
}
var Yx = 128;
function wl(e, t, n) {
  return t = n ? void 0 : t, t = e && t == null ? e.length : t, Gn(e, Yx, void 0, void 0, void 0, void 0, t);
}
function Hn(e, t, n) {
  t == "__proto__" && Ma ? Ma(e, t, {
    configurable: !0,
    enumerable: !0,
    value: n,
    writable: !0
  }) : e[t] = n;
}
function Vt(e, t) {
  return e === t || e !== e && t !== t;
}
var Xx = Object.prototype, Jx = Xx.hasOwnProperty;
function vo(e, t, n) {
  var r = e[t];
  (!(Jx.call(e, t) && Vt(r, n)) || n === void 0 && !(t in e)) && Hn(e, t, n);
}
function An(e, t, n, r) {
  var i = !n;
  n || (n = {});
  for (var s = -1, o = t.length; ++s < o; ) {
    var a = t[s], u = r ? r(n[a], e[a], a, n, e) : void 0;
    u === void 0 && (u = e[a]), i ? Hn(n, a, u) : vo(n, a, u);
  }
  return n;
}
var hd = Math.max;
function Yv(e, t, n) {
  return t = hd(t === void 0 ? e.length - 1 : t, 0), function() {
    for (var r = arguments, i = -1, s = hd(r.length - t, 0), o = Array(s); ++i < s; )
      o[i] = r[t + i];
    i = -1;
    for (var a = Array(t + 1); ++i < t; )
      a[i] = r[i];
    return a[t] = n(o), mt(e, this, a);
  };
}
function D(e, t) {
  return ml(Yv(e, t, He), e + "");
}
var Zx = 9007199254740991;
function go(e) {
  return typeof e == "number" && e > -1 && e % 1 == 0 && e <= Zx;
}
function Ke(e) {
  return e != null && go(e.length) && !wn(e);
}
function ke(e, t, n) {
  if (!se(n))
    return !1;
  var r = typeof t;
  return (r == "number" ? Ke(n) && qn(t, n.length) : r == "string" && t in n) ? Vt(n[t], e) : !1;
}
function Xi(e) {
  return D(function(t, n) {
    var r = -1, i = n.length, s = i > 1 ? n[i - 1] : void 0, o = i > 2 ? n[2] : void 0;
    for (s = e.length > 3 && typeof s == "function" ? (i--, s) : void 0, o && ke(n[0], n[1], o) && (s = i < 3 ? void 0 : s, i = 1), t = Object(t); ++r < i; ) {
      var a = n[r];
      a && e(t, a, r, s);
    }
    return t;
  });
}
var Qx = Object.prototype;
function yo(e) {
  var t = e && e.constructor, n = typeof t == "function" && t.prototype || Qx;
  return e === n;
}
function Al(e, t) {
  for (var n = -1, r = Array(e); ++n < e; )
    r[n] = t(n);
  return r;
}
var eT = "[object Arguments]";
function pd(e) {
  return oe(e) && Ge(e) == eT;
}
var Xv = Object.prototype, tT = Xv.hasOwnProperty, nT = Xv.propertyIsEnumerable, ar = pd(/* @__PURE__ */ function() {
  return arguments;
}()) ? pd : function(e) {
  return oe(e) && tT.call(e, "callee") && !nT.call(e, "callee");
};
function bu() {
  return !1;
}
var Jv = typeof exports == "object" && exports && !exports.nodeType && exports, dd = Jv && typeof module == "object" && module && !module.nodeType && module, rT = dd && dd.exports === Jv, _d = rT ? Se.Buffer : void 0, iT = _d ? _d.isBuffer : void 0, Vn = iT || bu, sT = "[object Arguments]", oT = "[object Array]", aT = "[object Boolean]", uT = "[object Date]", fT = "[object Error]", cT = "[object Function]", lT = "[object Map]", hT = "[object Number]", pT = "[object Object]", dT = "[object RegExp]", _T = "[object Set]", vT = "[object String]", gT = "[object WeakMap]", yT = "[object ArrayBuffer]", bT = "[object DataView]", mT = "[object Float32Array]", wT = "[object Float64Array]", AT = "[object Int8Array]", OT = "[object Int16Array]", ET = "[object Int32Array]", ST = "[object Uint8Array]", xT = "[object Uint8ClampedArray]", TT = "[object Uint16Array]", RT = "[object Uint32Array]", te = {};
te[mT] = te[wT] = te[AT] = te[OT] = te[ET] = te[ST] = te[xT] = te[TT] = te[RT] = !0;
te[sT] = te[oT] = te[yT] = te[aT] = te[bT] = te[uT] = te[fT] = te[cT] = te[lT] = te[hT] = te[pT] = te[dT] = te[_T] = te[vT] = te[gT] = !1;
function PT(e) {
  return oe(e) && go(e.length) && !!te[Ge(e)];
}
function wt(e) {
  return function(t) {
    return e(t);
  };
}
var Zv = typeof exports == "object" && exports && !exports.nodeType && exports, xs = Zv && typeof module == "object" && module && !module.nodeType && module, NT = xs && xs.exports === Zv, Df = NT && Iv.process, Ft = function() {
  try {
    var e = xs && xs.require && xs.require("util").types;
    return e || Df && Df.binding && Df.binding("util");
  } catch {
  }
}(), vd = Ft && Ft.isTypedArray, Jr = vd ? wt(vd) : PT, $T = Object.prototype, MT = $T.hasOwnProperty;
function Qv(e, t) {
  var n = M(e), r = !n && ar(e), i = !n && !r && Vn(e), s = !n && !r && !i && Jr(e), o = n || r || i || s, a = o ? Al(e.length, String) : [], u = a.length;
  for (var f in e)
    (t || MT.call(e, f)) && !(o && // Safari 9 has enumerable `arguments.length` in strict mode.
    (f == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    i && (f == "offset" || f == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    s && (f == "buffer" || f == "byteLength" || f == "byteOffset") || // Skip index properties.
    qn(f, u))) && a.push(f);
  return a;
}
function eg(e, t) {
  return function(n) {
    return e(t(n));
  };
}
var IT = eg(Object.keys, Object), DT = Object.prototype, CT = DT.hasOwnProperty;
function Ol(e) {
  if (!yo(e))
    return IT(e);
  var t = [];
  for (var n in Object(e))
    CT.call(e, n) && n != "constructor" && t.push(n);
  return t;
}
function ve(e) {
  return Ke(e) ? Qv(e) : Ol(e);
}
var LT = Object.prototype, jT = LT.hasOwnProperty, tg = Xi(function(e, t) {
  if (yo(t) || Ke(t)) {
    An(t, ve(t), e);
    return;
  }
  for (var n in t)
    jT.call(t, n) && vo(e, n, t[n]);
});
function FT(e) {
  var t = [];
  if (e != null)
    for (var n in Object(e))
      t.push(n);
  return t;
}
var BT = Object.prototype, zT = BT.hasOwnProperty;
function UT(e) {
  if (!se(e))
    return FT(e);
  var t = yo(e), n = [];
  for (var r in e)
    r == "constructor" && (t || !zT.call(e, r)) || n.push(r);
  return n;
}
function Ye(e) {
  return Ke(e) ? Qv(e, !0) : UT(e);
}
var lc = Xi(function(e, t) {
  An(t, Ye(t), e);
}), Vs = Xi(function(e, t, n, r) {
  An(t, Ye(t), e, r);
}), ng = Xi(function(e, t, n, r) {
  An(t, ve(t), e, r);
}), VT = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, WT = /^\w*$/;
function El(e, t) {
  if (M(e))
    return !1;
  var n = typeof e;
  return n == "number" || n == "symbol" || n == "boolean" || e == null || it(e) ? !0 : WT.test(e) || !VT.test(e) || t != null && e in Object(t);
}
var Ws = Xr(Object, "create");
function kT() {
  this.__data__ = Ws ? Ws(null) : {}, this.size = 0;
}
function qT(e) {
  var t = this.has(e) && delete this.__data__[e];
  return this.size -= t ? 1 : 0, t;
}
var GT = "__lodash_hash_undefined__", HT = Object.prototype, KT = HT.hasOwnProperty;
function YT(e) {
  var t = this.__data__;
  if (Ws) {
    var n = t[e];
    return n === GT ? void 0 : n;
  }
  return KT.call(t, e) ? t[e] : void 0;
}
var XT = Object.prototype, JT = XT.hasOwnProperty;
function ZT(e) {
  var t = this.__data__;
  return Ws ? t[e] !== void 0 : JT.call(t, e);
}
var QT = "__lodash_hash_undefined__";
function eR(e, t) {
  var n = this.__data__;
  return this.size += this.has(e) ? 0 : 1, n[e] = Ws && t === void 0 ? QT : t, this;
}
function Cr(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
Cr.prototype.clear = kT;
Cr.prototype.delete = qT;
Cr.prototype.get = YT;
Cr.prototype.has = ZT;
Cr.prototype.set = eR;
function tR() {
  this.__data__ = [], this.size = 0;
}
function mu(e, t) {
  for (var n = e.length; n--; )
    if (Vt(e[n][0], t))
      return n;
  return -1;
}
var nR = Array.prototype, rR = nR.splice;
function iR(e) {
  var t = this.__data__, n = mu(t, e);
  if (n < 0)
    return !1;
  var r = t.length - 1;
  return n == r ? t.pop() : rR.call(t, n, 1), --this.size, !0;
}
function sR(e) {
  var t = this.__data__, n = mu(t, e);
  return n < 0 ? void 0 : t[n][1];
}
function oR(e) {
  return mu(this.__data__, e) > -1;
}
function aR(e, t) {
  var n = this.__data__, r = mu(n, e);
  return r < 0 ? (++this.size, n.push([e, t])) : n[r][1] = t, this;
}
function Kn(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
Kn.prototype.clear = tR;
Kn.prototype.delete = iR;
Kn.prototype.get = sR;
Kn.prototype.has = oR;
Kn.prototype.set = aR;
var ks = Xr(Se, "Map");
function uR() {
  this.size = 0, this.__data__ = {
    hash: new Cr(),
    map: new (ks || Kn)(),
    string: new Cr()
  };
}
function fR(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function wu(e, t) {
  var n = e.__data__;
  return fR(t) ? n[typeof t == "string" ? "string" : "hash"] : n.map;
}
function cR(e) {
  var t = wu(this, e).delete(e);
  return this.size -= t ? 1 : 0, t;
}
function lR(e) {
  return wu(this, e).get(e);
}
function hR(e) {
  return wu(this, e).has(e);
}
function pR(e, t) {
  var n = wu(this, e), r = n.size;
  return n.set(e, t), this.size += n.size == r ? 0 : 1, this;
}
function Yn(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
Yn.prototype.clear = uR;
Yn.prototype.delete = cR;
Yn.prototype.get = lR;
Yn.prototype.has = hR;
Yn.prototype.set = pR;
var dR = "Expected a function";
function bo(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function")
    throw new TypeError(dR);
  var n = function() {
    var r = arguments, i = t ? t.apply(this, r) : r[0], s = n.cache;
    if (s.has(i))
      return s.get(i);
    var o = e.apply(this, r);
    return n.cache = s.set(i, o) || s, o;
  };
  return n.cache = new (bo.Cache || Yn)(), n;
}
bo.Cache = Yn;
var _R = 500;
function vR(e) {
  var t = bo(e, function(r) {
    return n.size === _R && n.clear(), r;
  }), n = t.cache;
  return t;
}
var gR = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, yR = /\\(\\)?/g, rg = vR(function(e) {
  var t = [];
  return e.charCodeAt(0) === 46 && t.push(""), e.replace(gR, function(n, r, i, s) {
    t.push(i ? s.replace(yR, "$1") : r || n);
  }), t;
});
function k(e) {
  return e == null ? "" : bt(e);
}
function dr(e, t) {
  return M(e) ? e : El(e, t) ? [e] : rg(k(e));
}
function On(e) {
  if (typeof e == "string" || it(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function Zr(e, t) {
  t = dr(t, e);
  for (var n = 0, r = t.length; e != null && n < r; )
    e = e[On(t[n++])];
  return n && n == r ? e : void 0;
}
function Au(e, t, n) {
  var r = e == null ? void 0 : Zr(e, t);
  return r === void 0 ? n : r;
}
function Sl(e, t) {
  for (var n = -1, r = t.length, i = Array(r), s = e == null; ++n < r; )
    i[n] = s ? void 0 : Au(e, t[n]);
  return i;
}
function _r(e, t) {
  for (var n = -1, r = t.length, i = e.length; ++n < r; )
    e[i + n] = t[n];
  return e;
}
var gd = De ? De.isConcatSpreadable : void 0;
function bR(e) {
  return M(e) || ar(e) || !!(gd && e && e[gd]);
}
function Ne(e, t, n, r, i) {
  var s = -1, o = e.length;
  for (n || (n = bR), i || (i = []); ++s < o; ) {
    var a = e[s];
    t > 0 && n(a) ? t > 1 ? Ne(a, t - 1, n, r, i) : _r(i, a) : r || (i[i.length] = a);
  }
  return i;
}
function xl(e) {
  var t = e == null ? 0 : e.length;
  return t ? Ne(e, 1) : [];
}
function Xn(e) {
  return ml(Yv(e, void 0, xl), e + "");
}
var ig = Xn(Sl), Ou = eg(Object.getPrototypeOf, Object), mR = "[object Object]", wR = Function.prototype, AR = Object.prototype, sg = wR.toString, OR = AR.hasOwnProperty, ER = sg.call(Object);
function Ji(e) {
  if (!oe(e) || Ge(e) != mR)
    return !1;
  var t = Ou(e);
  if (t === null)
    return !0;
  var n = OR.call(t, "constructor") && t.constructor;
  return typeof n == "function" && n instanceof n && sg.call(n) == ER;
}
var SR = "[object DOMException]", xR = "[object Error]";
function Eu(e) {
  if (!oe(e))
    return !1;
  var t = Ge(e);
  return t == xR || t == SR || typeof e.message == "string" && typeof e.name == "string" && !Ji(e);
}
var Tl = D(function(e, t) {
  try {
    return mt(e, void 0, t);
  } catch (n) {
    return Eu(n) ? n : new Error(n);
  }
}), TR = "Expected a function";
function Rl(e, t) {
  var n;
  if (typeof t != "function")
    throw new TypeError(TR);
  return e = I(e), function() {
    return --e > 0 && (n = t.apply(this, arguments)), e <= 1 && (t = void 0), n;
  };
}
var RR = 1, PR = 32, mo = D(function(e, t, n) {
  var r = RR;
  if (n.length) {
    var i = or(n, Yi(mo));
    r |= PR;
  }
  return Gn(e, r, t, n, i);
});
mo.placeholder = {};
var og = Xn(function(e, t) {
  return Ut(t, function(n) {
    n = On(n), Hn(e, n, mo(e[n], e));
  }), e;
}), NR = 1, $R = 2, MR = 32, Su = D(function(e, t, n) {
  var r = NR | $R;
  if (n.length) {
    var i = or(n, Yi(Su));
    r |= MR;
  }
  return Gn(t, r, e, n, i);
});
Su.placeholder = {};
function Bt(e, t, n) {
  var r = -1, i = e.length;
  t < 0 && (t = -t > i ? 0 : i + t), n = n > i ? i : n, n < 0 && (n += i), i = t > n ? 0 : n - t >>> 0, t >>>= 0;
  for (var s = Array(i); ++r < i; )
    s[r] = e[r + t];
  return s;
}
function vr(e, t, n) {
  var r = e.length;
  return n = n === void 0 ? r : n, !t && n >= r ? e : Bt(e, t, n);
}
var IR = "\\ud800-\\udfff", DR = "\\u0300-\\u036f", CR = "\\ufe20-\\ufe2f", LR = "\\u20d0-\\u20ff", jR = DR + CR + LR, FR = "\\ufe0e\\ufe0f", BR = "\\u200d", zR = RegExp("[" + BR + IR + jR + FR + "]");
function Zi(e) {
  return zR.test(e);
}
function UR(e) {
  return e.split("");
}
var ag = "\\ud800-\\udfff", VR = "\\u0300-\\u036f", WR = "\\ufe20-\\ufe2f", kR = "\\u20d0-\\u20ff", qR = VR + WR + kR, GR = "\\ufe0e\\ufe0f", HR = "[" + ag + "]", hc = "[" + qR + "]", pc = "\\ud83c[\\udffb-\\udfff]", KR = "(?:" + hc + "|" + pc + ")", ug = "[^" + ag + "]", fg = "(?:\\ud83c[\\udde6-\\uddff]){2}", cg = "[\\ud800-\\udbff][\\udc00-\\udfff]", YR = "\\u200d", lg = KR + "?", hg = "[" + GR + "]?", XR = "(?:" + YR + "(?:" + [ug, fg, cg].join("|") + ")" + hg + lg + ")*", JR = hg + lg + XR, ZR = "(?:" + [ug + hc + "?", hc, fg, cg, HR].join("|") + ")", QR = RegExp(pc + "(?=" + pc + ")|" + ZR + JR, "g");
function e2(e) {
  return e.match(QR) || [];
}
function en(e) {
  return Zi(e) ? e2(e) : UR(e);
}
function pg(e) {
  return function(t) {
    t = k(t);
    var n = Zi(t) ? en(t) : void 0, r = n ? n[0] : t.charAt(0), i = n ? vr(n, 1).join("") : t.slice(1);
    return r[e]() + i;
  };
}
var xu = pg("toUpperCase");
function Pl(e) {
  return xu(k(e).toLowerCase());
}
function Nl(e, t, n, r) {
  var i = -1, s = e == null ? 0 : e.length;
  for (r && s && (n = e[++i]); ++i < s; )
    n = t(n, e[i], i, e);
  return n;
}
function $l(e) {
  return function(t) {
    return e?.[t];
  };
}
var t2 = {
  // Latin-1 Supplement block.
  À: "A",
  Á: "A",
  Â: "A",
  Ã: "A",
  Ä: "A",
  Å: "A",
  à: "a",
  á: "a",
  â: "a",
  ã: "a",
  ä: "a",
  å: "a",
  Ç: "C",
  ç: "c",
  Ð: "D",
  ð: "d",
  È: "E",
  É: "E",
  Ê: "E",
  Ë: "E",
  è: "e",
  é: "e",
  ê: "e",
  ë: "e",
  Ì: "I",
  Í: "I",
  Î: "I",
  Ï: "I",
  ì: "i",
  í: "i",
  î: "i",
  ï: "i",
  Ñ: "N",
  ñ: "n",
  Ò: "O",
  Ó: "O",
  Ô: "O",
  Õ: "O",
  Ö: "O",
  Ø: "O",
  ò: "o",
  ó: "o",
  ô: "o",
  õ: "o",
  ö: "o",
  ø: "o",
  Ù: "U",
  Ú: "U",
  Û: "U",
  Ü: "U",
  ù: "u",
  ú: "u",
  û: "u",
  ü: "u",
  Ý: "Y",
  ý: "y",
  ÿ: "y",
  Æ: "Ae",
  æ: "ae",
  Þ: "Th",
  þ: "th",
  ß: "ss",
  // Latin Extended-A block.
  Ā: "A",
  Ă: "A",
  Ą: "A",
  ā: "a",
  ă: "a",
  ą: "a",
  Ć: "C",
  Ĉ: "C",
  Ċ: "C",
  Č: "C",
  ć: "c",
  ĉ: "c",
  ċ: "c",
  č: "c",
  Ď: "D",
  Đ: "D",
  ď: "d",
  đ: "d",
  Ē: "E",
  Ĕ: "E",
  Ė: "E",
  Ę: "E",
  Ě: "E",
  ē: "e",
  ĕ: "e",
  ė: "e",
  ę: "e",
  ě: "e",
  Ĝ: "G",
  Ğ: "G",
  Ġ: "G",
  Ģ: "G",
  ĝ: "g",
  ğ: "g",
  ġ: "g",
  ģ: "g",
  Ĥ: "H",
  Ħ: "H",
  ĥ: "h",
  ħ: "h",
  Ĩ: "I",
  Ī: "I",
  Ĭ: "I",
  Į: "I",
  İ: "I",
  ĩ: "i",
  ī: "i",
  ĭ: "i",
  į: "i",
  ı: "i",
  Ĵ: "J",
  ĵ: "j",
  Ķ: "K",
  ķ: "k",
  ĸ: "k",
  Ĺ: "L",
  Ļ: "L",
  Ľ: "L",
  Ŀ: "L",
  Ł: "L",
  ĺ: "l",
  ļ: "l",
  ľ: "l",
  ŀ: "l",
  ł: "l",
  Ń: "N",
  Ņ: "N",
  Ň: "N",
  Ŋ: "N",
  ń: "n",
  ņ: "n",
  ň: "n",
  ŋ: "n",
  Ō: "O",
  Ŏ: "O",
  Ő: "O",
  ō: "o",
  ŏ: "o",
  ő: "o",
  Ŕ: "R",
  Ŗ: "R",
  Ř: "R",
  ŕ: "r",
  ŗ: "r",
  ř: "r",
  Ś: "S",
  Ŝ: "S",
  Ş: "S",
  Š: "S",
  ś: "s",
  ŝ: "s",
  ş: "s",
  š: "s",
  Ţ: "T",
  Ť: "T",
  Ŧ: "T",
  ţ: "t",
  ť: "t",
  ŧ: "t",
  Ũ: "U",
  Ū: "U",
  Ŭ: "U",
  Ů: "U",
  Ű: "U",
  Ų: "U",
  ũ: "u",
  ū: "u",
  ŭ: "u",
  ů: "u",
  ű: "u",
  ų: "u",
  Ŵ: "W",
  ŵ: "w",
  Ŷ: "Y",
  ŷ: "y",
  Ÿ: "Y",
  Ź: "Z",
  Ż: "Z",
  Ž: "Z",
  ź: "z",
  ż: "z",
  ž: "z",
  Ĳ: "IJ",
  ĳ: "ij",
  Œ: "Oe",
  œ: "oe",
  ŉ: "'n",
  ſ: "s"
}, n2 = $l(t2), r2 = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, i2 = "\\u0300-\\u036f", s2 = "\\ufe20-\\ufe2f", o2 = "\\u20d0-\\u20ff", a2 = i2 + s2 + o2, u2 = "[" + a2 + "]", f2 = RegExp(u2, "g");
function Ml(e) {
  return e = k(e), e && e.replace(r2, n2).replace(f2, "");
}
var c2 = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
function l2(e) {
  return e.match(c2) || [];
}
var h2 = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
function p2(e) {
  return h2.test(e);
}
var dg = "\\ud800-\\udfff", d2 = "\\u0300-\\u036f", _2 = "\\ufe20-\\ufe2f", v2 = "\\u20d0-\\u20ff", g2 = d2 + _2 + v2, _g = "\\u2700-\\u27bf", vg = "a-z\\xdf-\\xf6\\xf8-\\xff", y2 = "\\xac\\xb1\\xd7\\xf7", b2 = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", m2 = "\\u2000-\\u206f", w2 = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", gg = "A-Z\\xc0-\\xd6\\xd8-\\xde", A2 = "\\ufe0e\\ufe0f", yg = y2 + b2 + m2 + w2, bg = "['’]", yd = "[" + yg + "]", O2 = "[" + g2 + "]", mg = "\\d+", E2 = "[" + _g + "]", wg = "[" + vg + "]", Ag = "[^" + dg + yg + mg + _g + vg + gg + "]", S2 = "\\ud83c[\\udffb-\\udfff]", x2 = "(?:" + O2 + "|" + S2 + ")", T2 = "[^" + dg + "]", Og = "(?:\\ud83c[\\udde6-\\uddff]){2}", Eg = "[\\ud800-\\udbff][\\udc00-\\udfff]", _i = "[" + gg + "]", R2 = "\\u200d", bd = "(?:" + wg + "|" + Ag + ")", P2 = "(?:" + _i + "|" + Ag + ")", md = "(?:" + bg + "(?:d|ll|m|re|s|t|ve))?", wd = "(?:" + bg + "(?:D|LL|M|RE|S|T|VE))?", Sg = x2 + "?", xg = "[" + A2 + "]?", N2 = "(?:" + R2 + "(?:" + [T2, Og, Eg].join("|") + ")" + xg + Sg + ")*", $2 = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", M2 = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", I2 = xg + Sg + N2, D2 = "(?:" + [E2, Og, Eg].join("|") + ")" + I2, C2 = RegExp([
  _i + "?" + wg + "+" + md + "(?=" + [yd, _i, "$"].join("|") + ")",
  P2 + "+" + wd + "(?=" + [yd, _i + bd, "$"].join("|") + ")",
  _i + "?" + bd + "+" + md,
  _i + "+" + wd,
  M2,
  $2,
  mg,
  D2
].join("|"), "g");
function L2(e) {
  return e.match(C2) || [];
}
function Il(e, t, n) {
  return e = k(e), t = n ? void 0 : t, t === void 0 ? p2(e) ? L2(e) : l2(e) : e.match(t) || [];
}
var j2 = "['’]", F2 = RegExp(j2, "g");
function Qi(e) {
  return function(t) {
    return Nl(Il(Ml(t).replace(F2, "")), e, "");
  };
}
var Tg = Qi(function(e, t, n) {
  return t = t.toLowerCase(), e + (n ? Pl(t) : t);
});
function Rg() {
  if (!arguments.length)
    return [];
  var e = arguments[0];
  return M(e) ? e : [e];
}
var B2 = Se.isFinite, z2 = Math.min;
function Dl(e) {
  var t = Math[e];
  return function(n, r) {
    if (n = dt(n), r = r == null ? 0 : z2(I(r), 292), r && B2(n)) {
      var i = (k(n) + "e").split("e"), s = t(i[0] + "e" + (+i[1] + r));
      return i = (k(s) + "e").split("e"), +(i[0] + "e" + (+i[1] - r));
    }
    return t(n);
  };
}
var Pg = Dl("ceil");
function Cl(e) {
  var t = p(e);
  return t.__chain__ = !0, t;
}
var U2 = Math.ceil, V2 = Math.max;
function Ng(e, t, n) {
  (n ? ke(e, t, n) : t === void 0) ? t = 1 : t = V2(I(t), 0);
  var r = e == null ? 0 : e.length;
  if (!r || t < 1)
    return [];
  for (var i = 0, s = 0, o = Array(U2(r / t)); i < r; )
    o[s++] = Bt(e, i, i += t);
  return o;
}
function Qr(e, t, n) {
  return e === e && (n !== void 0 && (e = e <= n ? e : n), t !== void 0 && (e = e >= t ? e : t)), e;
}
function $g(e, t, n) {
  return n === void 0 && (n = t, t = void 0), n !== void 0 && (n = dt(n), n = n === n ? n : 0), t !== void 0 && (t = dt(t), t = t === t ? t : 0), Qr(dt(e), t, n);
}
function W2() {
  this.__data__ = new Kn(), this.size = 0;
}
function k2(e) {
  var t = this.__data__, n = t.delete(e);
  return this.size = t.size, n;
}
function q2(e) {
  return this.__data__.get(e);
}
function G2(e) {
  return this.__data__.has(e);
}
var H2 = 200;
function K2(e, t) {
  var n = this.__data__;
  if (n instanceof Kn) {
    var r = n.__data__;
    if (!ks || r.length < H2 - 1)
      return r.push([e, t]), this.size = ++n.size, this;
    n = this.__data__ = new Yn(r);
  }
  return n.set(e, t), this.size = n.size, this;
}
function Yt(e) {
  var t = this.__data__ = new Kn(e);
  this.size = t.size;
}
Yt.prototype.clear = W2;
Yt.prototype.delete = k2;
Yt.prototype.get = q2;
Yt.prototype.has = G2;
Yt.prototype.set = K2;
function Mg(e, t) {
  return e && An(t, ve(t), e);
}
function Y2(e, t) {
  return e && An(t, Ye(t), e);
}
var Ig = typeof exports == "object" && exports && !exports.nodeType && exports, Ad = Ig && typeof module == "object" && module && !module.nodeType && module, X2 = Ad && Ad.exports === Ig, Od = X2 ? Se.Buffer : void 0, Ed = Od ? Od.allocUnsafe : void 0;
function Dg(e, t) {
  if (t)
    return e.slice();
  var n = e.length, r = Ed ? Ed(n) : new e.constructor(n);
  return e.copy(r), r;
}
function gr(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length, i = 0, s = []; ++n < r; ) {
    var o = e[n];
    t(o, n, e) && (s[i++] = o);
  }
  return s;
}
function Tu() {
  return [];
}
var J2 = Object.prototype, Z2 = J2.propertyIsEnumerable, Sd = Object.getOwnPropertySymbols, Ll = Sd ? function(e) {
  return e == null ? [] : (e = Object(e), gr(Sd(e), function(t) {
    return Z2.call(e, t);
  }));
} : Tu;
function Q2(e, t) {
  return An(e, Ll(e), t);
}
var eP = Object.getOwnPropertySymbols, Cg = eP ? function(e) {
  for (var t = []; e; )
    _r(t, Ll(e)), e = Ou(e);
  return t;
} : Tu;
function tP(e, t) {
  return An(e, Cg(e), t);
}
function Lg(e, t, n) {
  var r = t(e);
  return M(e) ? r : _r(r, n(e));
}
function dc(e) {
  return Lg(e, ve, Ll);
}
function jl(e) {
  return Lg(e, Ye, Cg);
}
var _c = Xr(Se, "DataView"), vc = Xr(Se, "Promise"), Ai = Xr(Se, "Set"), xd = "[object Map]", nP = "[object Object]", Td = "[object Promise]", Rd = "[object Set]", Pd = "[object WeakMap]", Nd = "[object DataView]", rP = Yr(_c), iP = Yr(ks), sP = Yr(vc), oP = Yr(Ai), aP = Yr(zs), Tr = Ge;
(_c && Tr(new _c(new ArrayBuffer(1))) != Nd || ks && Tr(new ks()) != xd || vc && Tr(vc.resolve()) != Td || Ai && Tr(new Ai()) != Rd || zs && Tr(new zs()) != Pd) && (Tr = function(e) {
  var t = Ge(e), n = t == nP ? e.constructor : void 0, r = n ? Yr(n) : "";
  if (r)
    switch (r) {
      case rP:
        return Nd;
      case iP:
        return xd;
      case sP:
        return Td;
      case oP:
        return Rd;
      case aP:
        return Pd;
    }
  return t;
});
const _n = Tr;
var uP = Object.prototype, fP = uP.hasOwnProperty;
function cP(e) {
  var t = e.length, n = new e.constructor(t);
  return t && typeof e[0] == "string" && fP.call(e, "index") && (n.index = e.index, n.input = e.input), n;
}
var Ia = Se.Uint8Array;
function Fl(e) {
  var t = new e.constructor(e.byteLength);
  return new Ia(t).set(new Ia(e)), t;
}
function lP(e, t) {
  var n = t ? Fl(e.buffer) : e.buffer;
  return new e.constructor(n, e.byteOffset, e.byteLength);
}
var hP = /\w*$/;
function pP(e) {
  var t = new e.constructor(e.source, hP.exec(e));
  return t.lastIndex = e.lastIndex, t;
}
var $d = De ? De.prototype : void 0, Md = $d ? $d.valueOf : void 0;
function dP(e) {
  return Md ? Object(Md.call(e)) : {};
}
function jg(e, t) {
  var n = t ? Fl(e.buffer) : e.buffer;
  return new e.constructor(n, e.byteOffset, e.length);
}
var _P = "[object Boolean]", vP = "[object Date]", gP = "[object Map]", yP = "[object Number]", bP = "[object RegExp]", mP = "[object Set]", wP = "[object String]", AP = "[object Symbol]", OP = "[object ArrayBuffer]", EP = "[object DataView]", SP = "[object Float32Array]", xP = "[object Float64Array]", TP = "[object Int8Array]", RP = "[object Int16Array]", PP = "[object Int32Array]", NP = "[object Uint8Array]", $P = "[object Uint8ClampedArray]", MP = "[object Uint16Array]", IP = "[object Uint32Array]";
function DP(e, t, n) {
  var r = e.constructor;
  switch (t) {
    case OP:
      return Fl(e);
    case _P:
    case vP:
      return new r(+e);
    case EP:
      return lP(e, n);
    case SP:
    case xP:
    case TP:
    case RP:
    case PP:
    case NP:
    case $P:
    case MP:
    case IP:
      return jg(e, n);
    case gP:
      return new r();
    case yP:
    case wP:
      return new r(e);
    case bP:
      return pP(e);
    case mP:
      return new r();
    case AP:
      return dP(e);
  }
}
function Fg(e) {
  return typeof e.constructor == "function" && !yo(e) ? Hi(Ou(e)) : {};
}
var CP = "[object Map]";
function LP(e) {
  return oe(e) && _n(e) == CP;
}
var Id = Ft && Ft.isMap, Bl = Id ? wt(Id) : LP, jP = "[object Set]";
function FP(e) {
  return oe(e) && _n(e) == jP;
}
var Dd = Ft && Ft.isSet, zl = Dd ? wt(Dd) : FP, BP = 1, zP = 2, UP = 4, Bg = "[object Arguments]", VP = "[object Array]", WP = "[object Boolean]", kP = "[object Date]", qP = "[object Error]", zg = "[object Function]", GP = "[object GeneratorFunction]", HP = "[object Map]", KP = "[object Number]", Ug = "[object Object]", YP = "[object RegExp]", XP = "[object Set]", JP = "[object String]", ZP = "[object Symbol]", QP = "[object WeakMap]", eN = "[object ArrayBuffer]", tN = "[object DataView]", nN = "[object Float32Array]", rN = "[object Float64Array]", iN = "[object Int8Array]", sN = "[object Int16Array]", oN = "[object Int32Array]", aN = "[object Uint8Array]", uN = "[object Uint8ClampedArray]", fN = "[object Uint16Array]", cN = "[object Uint32Array]", J = {};
J[Bg] = J[VP] = J[eN] = J[tN] = J[WP] = J[kP] = J[nN] = J[rN] = J[iN] = J[sN] = J[oN] = J[HP] = J[KP] = J[Ug] = J[YP] = J[XP] = J[JP] = J[ZP] = J[aN] = J[uN] = J[fN] = J[cN] = !0;
J[qP] = J[zg] = J[QP] = !1;
function Dt(e, t, n, r, i, s) {
  var o, a = t & BP, u = t & zP, f = t & UP;
  if (n && (o = i ? n(e, r, i, s) : n(e)), o !== void 0)
    return o;
  if (!se(e))
    return e;
  var c = M(e);
  if (c) {
    if (o = cP(e), !a)
      return nt(e, o);
  } else {
    var l = _n(e), h = l == zg || l == GP;
    if (Vn(e))
      return Dg(e, a);
    if (l == Ug || l == Bg || h && !i) {
      if (o = u || h ? {} : Fg(e), !a)
        return u ? tP(e, Y2(o, e)) : Q2(e, Mg(o, e));
    } else {
      if (!J[l])
        return i ? e : {};
      o = DP(e, l, a);
    }
  }
  s || (s = new Yt());
  var d = s.get(e);
  if (d)
    return d;
  s.set(e, o), zl(e) ? e.forEach(function(g) {
    o.add(Dt(g, t, n, g, e, s));
  }) : Bl(e) && e.forEach(function(g, y) {
    o.set(y, Dt(g, t, n, y, e, s));
  });
  var _ = f ? u ? jl : dc : u ? Ye : ve, v = c ? void 0 : _(e);
  return Ut(v || e, function(g, y) {
    v && (y = g, g = e[y]), vo(o, y, Dt(g, t, n, y, e, s));
  }), o;
}
var lN = 4;
function Vg(e) {
  return Dt(e, lN);
}
var hN = 1, pN = 4;
function Ru(e) {
  return Dt(e, hN | pN);
}
var dN = 1, _N = 4;
function Wg(e, t) {
  return t = typeof t == "function" ? t : void 0, Dt(e, dN | _N, t);
}
var vN = 4;
function kg(e, t) {
  return t = typeof t == "function" ? t : void 0, Dt(e, vN, t);
}
function gc() {
  return new jt(this.value(), this.__chain__);
}
function qg(e) {
  for (var t = -1, n = e == null ? 0 : e.length, r = 0, i = []; ++t < n; ) {
    var s = e[t];
    s && (i[r++] = s);
  }
  return i;
}
function Gg() {
  var e = arguments.length;
  if (!e)
    return [];
  for (var t = Array(e - 1), n = arguments[0], r = e; r--; )
    t[r - 1] = arguments[r];
  return _r(M(n) ? nt(n) : [n], Ne(t, 1));
}
var gN = "__lodash_hash_undefined__";
function yN(e) {
  return this.__data__.set(e, gN), this;
}
function bN(e) {
  return this.__data__.has(e);
}
function Lr(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.__data__ = new Yn(); ++t < n; )
    this.add(e[t]);
}
Lr.prototype.add = Lr.prototype.push = yN;
Lr.prototype.has = bN;
function Ul(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r; )
    if (t(e[n], n, e))
      return !0;
  return !1;
}
function qs(e, t) {
  return e.has(t);
}
var mN = 1, wN = 2;
function Hg(e, t, n, r, i, s) {
  var o = n & mN, a = e.length, u = t.length;
  if (a != u && !(o && u > a))
    return !1;
  var f = s.get(e), c = s.get(t);
  if (f && c)
    return f == t && c == e;
  var l = -1, h = !0, d = n & wN ? new Lr() : void 0;
  for (s.set(e, t), s.set(t, e); ++l < a; ) {
    var _ = e[l], v = t[l];
    if (r)
      var g = o ? r(v, _, l, t, e, s) : r(_, v, l, e, t, s);
    if (g !== void 0) {
      if (g)
        continue;
      h = !1;
      break;
    }
    if (d) {
      if (!Ul(t, function(y, b) {
        if (!qs(d, b) && (_ === y || i(_, y, n, r, s)))
          return d.push(b);
      })) {
        h = !1;
        break;
      }
    } else if (!(_ === v || i(_, v, n, r, s))) {
      h = !1;
      break;
    }
  }
  return s.delete(e), s.delete(t), h;
}
function Vl(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(r, i) {
    n[++t] = [i, r];
  }), n;
}
function Pu(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(r) {
    n[++t] = r;
  }), n;
}
var AN = 1, ON = 2, EN = "[object Boolean]", SN = "[object Date]", xN = "[object Error]", TN = "[object Map]", RN = "[object Number]", PN = "[object RegExp]", NN = "[object Set]", $N = "[object String]", MN = "[object Symbol]", IN = "[object ArrayBuffer]", DN = "[object DataView]", Cd = De ? De.prototype : void 0, Cf = Cd ? Cd.valueOf : void 0;
function CN(e, t, n, r, i, s, o) {
  switch (n) {
    case DN:
      if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
        return !1;
      e = e.buffer, t = t.buffer;
    case IN:
      return !(e.byteLength != t.byteLength || !s(new Ia(e), new Ia(t)));
    case EN:
    case SN:
    case RN:
      return Vt(+e, +t);
    case xN:
      return e.name == t.name && e.message == t.message;
    case PN:
    case $N:
      return e == t + "";
    case TN:
      var a = Vl;
    case NN:
      var u = r & AN;
      if (a || (a = Pu), e.size != t.size && !u)
        return !1;
      var f = o.get(e);
      if (f)
        return f == t;
      r |= ON, o.set(e, t);
      var c = Hg(a(e), a(t), r, i, s, o);
      return o.delete(e), c;
    case MN:
      if (Cf)
        return Cf.call(e) == Cf.call(t);
  }
  return !1;
}
var LN = 1, jN = Object.prototype, FN = jN.hasOwnProperty;
function BN(e, t, n, r, i, s) {
  var o = n & LN, a = dc(e), u = a.length, f = dc(t), c = f.length;
  if (u != c && !o)
    return !1;
  for (var l = u; l--; ) {
    var h = a[l];
    if (!(o ? h in t : FN.call(t, h)))
      return !1;
  }
  var d = s.get(e), _ = s.get(t);
  if (d && _)
    return d == t && _ == e;
  var v = !0;
  s.set(e, t), s.set(t, e);
  for (var g = o; ++l < u; ) {
    h = a[l];
    var y = e[h], b = t[h];
    if (r)
      var w = o ? r(b, y, h, t, e, s) : r(y, b, h, e, t, s);
    if (!(w === void 0 ? y === b || i(y, b, n, r, s) : w)) {
      v = !1;
      break;
    }
    g || (g = h == "constructor");
  }
  if (v && !g) {
    var m = e.constructor, A = t.constructor;
    m != A && "constructor" in e && "constructor" in t && !(typeof m == "function" && m instanceof m && typeof A == "function" && A instanceof A) && (v = !1);
  }
  return s.delete(e), s.delete(t), v;
}
var zN = 1, Ld = "[object Arguments]", jd = "[object Array]", ra = "[object Object]", UN = Object.prototype, Fd = UN.hasOwnProperty;
function VN(e, t, n, r, i, s) {
  var o = M(e), a = M(t), u = o ? jd : _n(e), f = a ? jd : _n(t);
  u = u == Ld ? ra : u, f = f == Ld ? ra : f;
  var c = u == ra, l = f == ra, h = u == f;
  if (h && Vn(e)) {
    if (!Vn(t))
      return !1;
    o = !0, c = !1;
  }
  if (h && !c)
    return s || (s = new Yt()), o || Jr(e) ? Hg(e, t, n, r, i, s) : CN(e, t, u, n, r, i, s);
  if (!(n & zN)) {
    var d = c && Fd.call(e, "__wrapped__"), _ = l && Fd.call(t, "__wrapped__");
    if (d || _) {
      var v = d ? e.value() : e, g = _ ? t.value() : t;
      return s || (s = new Yt()), i(v, g, n, r, s);
    }
  }
  return h ? (s || (s = new Yt()), BN(e, t, n, r, i, s)) : !1;
}
function wo(e, t, n, r, i) {
  return e === t ? !0 : e == null || t == null || !oe(e) && !oe(t) ? e !== e && t !== t : VN(e, t, n, r, wo, i);
}
var WN = 1, kN = 2;
function Wl(e, t, n, r) {
  var i = n.length, s = i, o = !r;
  if (e == null)
    return !s;
  for (e = Object(e); i--; ) {
    var a = n[i];
    if (o && a[2] ? a[1] !== e[a[0]] : !(a[0] in e))
      return !1;
  }
  for (; ++i < s; ) {
    a = n[i];
    var u = a[0], f = e[u], c = a[1];
    if (o && a[2]) {
      if (f === void 0 && !(u in e))
        return !1;
    } else {
      var l = new Yt();
      if (r)
        var h = r(f, c, u, e, t, l);
      if (!(h === void 0 ? wo(c, f, WN | kN, r, l) : h))
        return !1;
    }
  }
  return !0;
}
function Kg(e) {
  return e === e && !se(e);
}
function kl(e) {
  for (var t = ve(e), n = t.length; n--; ) {
    var r = t[n], i = e[r];
    t[n] = [r, i, Kg(i)];
  }
  return t;
}
function Yg(e, t) {
  return function(n) {
    return n == null ? !1 : n[e] === t && (t !== void 0 || e in Object(n));
  };
}
function Xg(e) {
  var t = kl(e);
  return t.length == 1 && t[0][2] ? Yg(t[0][0], t[0][1]) : function(n) {
    return n === e || Wl(n, e, t);
  };
}
function qN(e, t) {
  return e != null && t in Object(e);
}
function Jg(e, t, n) {
  t = dr(t, e);
  for (var r = -1, i = t.length, s = !1; ++r < i; ) {
    var o = On(t[r]);
    if (!(s = e != null && n(e, o)))
      break;
    e = e[o];
  }
  return s || ++r != i ? s : (i = e == null ? 0 : e.length, !!i && go(i) && qn(o, i) && (M(e) || ar(e)));
}
function Nu(e, t) {
  return e != null && Jg(e, t, qN);
}
var GN = 1, HN = 2;
function Zg(e, t) {
  return El(e) && Kg(t) ? Yg(On(e), t) : function(n) {
    var r = Au(n, e);
    return r === void 0 && r === t ? Nu(n, e) : wo(t, r, GN | HN);
  };
}
function ql(e) {
  return function(t) {
    return t?.[e];
  };
}
function KN(e) {
  return function(t) {
    return Zr(t, e);
  };
}
function Gl(e) {
  return El(e) ? ql(On(e)) : KN(e);
}
function $(e) {
  return typeof e == "function" ? e : e == null ? He : typeof e == "object" ? M(e) ? Zg(e[0], e[1]) : Xg(e) : Gl(e);
}
var YN = "Expected a function";
function Qg(e) {
  var t = e == null ? 0 : e.length, n = $;
  return e = t ? ie(e, function(r) {
    if (typeof r[1] != "function")
      throw new TypeError(YN);
    return [n(r[0]), r[1]];
  }) : [], D(function(r) {
    for (var i = -1; ++i < t; ) {
      var s = e[i];
      if (mt(s[0], this, r))
        return mt(s[1], this, r);
    }
  });
}
function e0(e, t, n) {
  var r = n.length;
  if (e == null)
    return !r;
  for (e = Object(e); r--; ) {
    var i = n[r], s = t[i], o = e[i];
    if (o === void 0 && !(i in e) || !s(o))
      return !1;
  }
  return !0;
}
function XN(e) {
  var t = ve(e);
  return function(n) {
    return e0(n, e, t);
  };
}
var JN = 1;
function t0(e) {
  return XN(Dt(e, JN));
}
function n0(e, t) {
  return t == null || e0(e, t, ve(t));
}
function ZN(e, t, n, r) {
  for (var i = -1, s = e == null ? 0 : e.length; ++i < s; ) {
    var o = e[i];
    t(r, o, n(o), e);
  }
  return r;
}
function r0(e) {
  return function(t, n, r) {
    for (var i = -1, s = Object(t), o = r(t), a = o.length; a--; ) {
      var u = o[e ? a : ++i];
      if (n(s[u], u, s) === !1)
        break;
    }
    return t;
  };
}
var Hl = r0();
function En(e, t) {
  return e && Hl(e, t, ve);
}
function i0(e, t) {
  return function(n, r) {
    if (n == null)
      return n;
    if (!Ke(n))
      return e(n, r);
    for (var i = n.length, s = t ? i : -1, o = Object(n); (t ? s-- : ++s < i) && r(o[s], s, o) !== !1; )
      ;
    return n;
  };
}
var yr = i0(En);
function QN(e, t, n, r) {
  return yr(e, function(i, s, o) {
    t(r, i, n(i), o);
  }), r;
}
function $u(e, t) {
  return function(n, r) {
    var i = M(n) ? ZN : QN, s = t ? t() : {};
    return i(n, e, $(r), s);
  };
}
var e$ = Object.prototype, t$ = e$.hasOwnProperty, s0 = $u(function(e, t, n) {
  t$.call(e, n) ? ++e[n] : Hn(e, n, 1);
});
function o0(e, t) {
  var n = Hi(e);
  return t == null ? n : Mg(n, t);
}
var n$ = 8;
function Mu(e, t, n) {
  t = n ? void 0 : t;
  var r = Gn(e, n$, void 0, void 0, void 0, void 0, void 0, t);
  return r.placeholder = Mu.placeholder, r;
}
Mu.placeholder = {};
var r$ = 16;
function Iu(e, t, n) {
  t = n ? void 0 : t;
  var r = Gn(e, r$, void 0, void 0, void 0, void 0, void 0, t);
  return r.placeholder = Iu.placeholder, r;
}
Iu.placeholder = {};
var Ts = function() {
  return Se.Date.now();
}, i$ = "Expected a function", s$ = Math.max, o$ = Math.min;
function Kl(e, t, n) {
  var r, i, s, o, a, u, f = 0, c = !1, l = !1, h = !0;
  if (typeof e != "function")
    throw new TypeError(i$);
  t = dt(t) || 0, se(n) && (c = !!n.leading, l = "maxWait" in n, s = l ? s$(dt(n.maxWait) || 0, t) : s, h = "trailing" in n ? !!n.trailing : h);
  function d(S) {
    var R = r, B = i;
    return r = i = void 0, f = S, o = e.apply(B, R), o;
  }
  function _(S) {
    return f = S, a = setTimeout(y, t), c ? d(S) : o;
  }
  function v(S) {
    var R = S - u, B = S - f, Nn = t - R;
    return l ? o$(Nn, s - B) : Nn;
  }
  function g(S) {
    var R = S - u, B = S - f;
    return u === void 0 || R >= t || R < 0 || l && B >= s;
  }
  function y() {
    var S = Ts();
    if (g(S))
      return b(S);
    a = setTimeout(y, v(S));
  }
  function b(S) {
    return a = void 0, h && r ? d(S) : (r = i = void 0, o);
  }
  function w() {
    a !== void 0 && clearTimeout(a), f = 0, r = u = i = a = void 0;
  }
  function m() {
    return a === void 0 ? o : b(Ts());
  }
  function A() {
    var S = Ts(), R = g(S);
    if (r = arguments, i = this, u = S, R) {
      if (a === void 0)
        return _(u);
      if (l)
        return clearTimeout(a), a = setTimeout(y, t), d(u);
    }
    return a === void 0 && (a = setTimeout(y, t)), o;
  }
  return A.cancel = w, A.flush = m, A;
}
function a0(e, t) {
  return e == null || e !== e ? t : e;
}
var u0 = Object.prototype, a$ = u0.hasOwnProperty, f0 = D(function(e, t) {
  e = Object(e);
  var n = -1, r = t.length, i = r > 2 ? t[2] : void 0;
  for (i && ke(t[0], t[1], i) && (r = 1); ++n < r; )
    for (var s = t[n], o = Ye(s), a = -1, u = o.length; ++a < u; ) {
      var f = o[a], c = e[f];
      (c === void 0 || Vt(c, u0[f]) && !a$.call(e, f)) && (e[f] = s[f]);
    }
  return e;
});
function yc(e, t, n) {
  (n !== void 0 && !Vt(e[t], n) || n === void 0 && !(t in e)) && Hn(e, t, n);
}
function fe(e) {
  return oe(e) && Ke(e);
}
function bc(e, t) {
  if (!(t === "constructor" && typeof e[t] == "function") && t != "__proto__")
    return e[t];
}
function Yl(e) {
  return An(e, Ye(e));
}
function u$(e, t, n, r, i, s, o) {
  var a = bc(e, n), u = bc(t, n), f = o.get(u);
  if (f) {
    yc(e, n, f);
    return;
  }
  var c = s ? s(a, u, n + "", e, t, o) : void 0, l = c === void 0;
  if (l) {
    var h = M(u), d = !h && Vn(u), _ = !h && !d && Jr(u);
    c = u, h || d || _ ? M(a) ? c = a : fe(a) ? c = nt(a) : d ? (l = !1, c = Dg(u, !0)) : _ ? (l = !1, c = jg(u, !0)) : c = [] : Ji(u) || ar(u) ? (c = a, ar(a) ? c = Yl(a) : (!se(a) || wn(a)) && (c = Fg(u))) : l = !1;
  }
  l && (o.set(u, c), i(c, u, r, s, o), o.delete(u)), yc(e, n, c);
}
function Du(e, t, n, r, i) {
  e !== t && Hl(t, function(s, o) {
    if (i || (i = new Yt()), se(s))
      u$(e, t, o, n, Du, r, i);
    else {
      var a = r ? r(bc(e, o), s, o + "", e, t, i) : void 0;
      a === void 0 && (a = s), yc(e, o, a);
    }
  }, Ye);
}
function c0(e, t, n, r, i, s) {
  return se(e) && se(t) && (s.set(t, e), Du(e, t, void 0, c0, s), s.delete(t)), e;
}
var Xl = Xi(function(e, t, n, r) {
  Du(e, t, n, r);
}), l0 = D(function(e) {
  return e.push(void 0, c0), mt(Xl, void 0, e);
}), f$ = "Expected a function";
function h0(e, t, n) {
  if (typeof e != "function")
    throw new TypeError(f$);
  return setTimeout(function() {
    e.apply(void 0, n);
  }, t);
}
var p0 = D(function(e, t) {
  return h0(e, 1, t);
}), d0 = D(function(e, t, n) {
  return h0(e, dt(t) || 0, n);
});
function Jl(e, t, n) {
  for (var r = -1, i = e == null ? 0 : e.length; ++r < i; )
    if (n(t, e[r]))
      return !0;
  return !1;
}
var c$ = 200;
function Ao(e, t, n, r) {
  var i = -1, s = gu, o = !0, a = e.length, u = [], f = t.length;
  if (!a)
    return u;
  n && (t = ie(t, wt(n))), r ? (s = Jl, o = !1) : t.length >= c$ && (s = qs, o = !1, t = new Lr(t));
  e:
    for (; ++i < a; ) {
      var c = e[i], l = n == null ? c : n(c);
      if (c = r || c !== 0 ? c : 0, o && l === l) {
        for (var h = f; h--; )
          if (t[h] === l)
            continue e;
        u.push(c);
      } else s(t, l, r) || u.push(c);
    }
  return u;
}
var _0 = D(function(e, t) {
  return fe(e) ? Ao(e, Ne(t, 1, fe, !0)) : [];
});
function At(e) {
  var t = e == null ? 0 : e.length;
  return t ? e[t - 1] : void 0;
}
var v0 = D(function(e, t) {
  var n = At(t);
  return fe(n) && (n = void 0), fe(e) ? Ao(e, Ne(t, 1, fe, !0), $(n)) : [];
}), g0 = D(function(e, t) {
  var n = At(t);
  return fe(n) && (n = void 0), fe(e) ? Ao(e, Ne(t, 1, fe, !0), void 0, n) : [];
}), y0 = hu(function(e, t) {
  return e / t;
}, 1);
function b0(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (t = n || t === void 0 ? 1 : I(t), Bt(e, t < 0 ? 0 : t, r)) : [];
}
function m0(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (t = n || t === void 0 ? 1 : I(t), t = r - t, Bt(e, 0, t < 0 ? 0 : t)) : [];
}
function Cu(e, t, n, r) {
  for (var i = e.length, s = r ? i : -1; (r ? s-- : ++s < i) && t(e[s], s, e); )
    ;
  return n ? Bt(e, r ? 0 : s, r ? s + 1 : i) : Bt(e, r ? s + 1 : 0, r ? i : s);
}
function w0(e, t) {
  return e && e.length ? Cu(e, $(t), !0, !0) : [];
}
function A0(e, t) {
  return e && e.length ? Cu(e, $(t), !0) : [];
}
function Sn(e) {
  return typeof e == "function" ? e : He;
}
function mc(e, t) {
  var n = M(e) ? Ut : yr;
  return n(e, Sn(t));
}
function l$(e, t) {
  for (var n = e == null ? 0 : e.length; n-- && t(e[n], n, e) !== !1; )
    ;
  return e;
}
var O0 = r0(!0);
function Zl(e, t) {
  return e && O0(e, t, ve);
}
var E0 = i0(Zl, !0);
function wc(e, t) {
  var n = M(e) ? l$ : E0;
  return n(e, Sn(t));
}
function S0(e, t, n) {
  e = k(e), t = bt(t);
  var r = e.length;
  n = n === void 0 ? r : Qr(I(n), 0, r);
  var i = n;
  return n -= t.length, n >= 0 && e.slice(n, i) == t;
}
function h$(e, t) {
  return ie(t, function(n) {
    return [n, e[n]];
  });
}
function p$(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(r) {
    n[++t] = [r, r];
  }), n;
}
var d$ = "[object Map]", _$ = "[object Set]";
function x0(e) {
  return function(t) {
    var n = _n(t);
    return n == d$ ? Vl(t) : n == _$ ? p$(t) : h$(t, e(t));
  };
}
var Ac = x0(ve), Oc = x0(Ye), v$ = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, g$ = $l(v$), T0 = /[&<>"']/g, y$ = RegExp(T0.source);
function Ql(e) {
  return e = k(e), e && y$.test(e) ? e.replace(T0, g$) : e;
}
var R0 = /[\\^$.*+?()[\]{}|]/g, b$ = RegExp(R0.source);
function P0(e) {
  return e = k(e), e && b$.test(e) ? e.replace(R0, "\\$&") : e;
}
function N0(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r; )
    if (!t(e[n], n, e))
      return !1;
  return !0;
}
function m$(e, t) {
  var n = !0;
  return yr(e, function(r, i, s) {
    return n = !!t(r, i, s), n;
  }), n;
}
function $0(e, t, n) {
  var r = M(e) ? N0 : m$;
  return n && ke(e, t, n) && (t = void 0), r(e, $(t));
}
var w$ = 4294967295;
function eh(e) {
  return e ? Qr(I(e), 0, w$) : 0;
}
function A$(e, t, n, r) {
  var i = e.length;
  for (n = I(n), n < 0 && (n = -n > i ? 0 : i + n), r = r === void 0 || r > i ? i : I(r), r < 0 && (r += i), r = n > r ? 0 : eh(r); n < r; )
    e[n++] = t;
  return e;
}
function M0(e, t, n, r) {
  var i = e == null ? 0 : e.length;
  return i ? (n && typeof n != "number" && ke(e, t, n) && (n = 0, r = i), A$(e, t, n, r)) : [];
}
function I0(e, t) {
  var n = [];
  return yr(e, function(r, i, s) {
    t(r, i, s) && n.push(r);
  }), n;
}
function D0(e, t) {
  var n = M(e) ? gr : I0;
  return n(e, $(t));
}
function C0(e) {
  return function(t, n, r) {
    var i = Object(t);
    if (!Ke(t)) {
      var s = $(n);
      t = ve(t), n = function(a) {
        return s(i[a], a, i);
      };
    }
    var o = e(t, n, r);
    return o > -1 ? i[s ? t[o] : o] : void 0;
  };
}
var O$ = Math.max;
function th(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = n == null ? 0 : I(n);
  return i < 0 && (i = O$(r + i, 0)), vu(e, $(t), i);
}
var L0 = C0(th);
function j0(e, t, n) {
  var r;
  return n(e, function(i, s, o) {
    if (t(i, s, o))
      return r = s, !1;
  }), r;
}
function F0(e, t) {
  return j0(e, $(t), En);
}
var E$ = Math.max, S$ = Math.min;
function nh(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = r - 1;
  return n !== void 0 && (i = I(n), i = n < 0 ? E$(r + i, 0) : S$(i, r - 1)), vu(e, $(t), i, !0);
}
var B0 = C0(nh);
function z0(e, t) {
  return j0(e, $(t), Zl);
}
function Ec(e) {
  return e && e.length ? e[0] : void 0;
}
function U0(e, t) {
  var n = -1, r = Ke(e) ? Array(e.length) : [];
  return yr(e, function(i, s, o) {
    r[++n] = t(i, s, o);
  }), r;
}
function Oo(e, t) {
  var n = M(e) ? ie : U0;
  return n(e, $(t));
}
function V0(e, t) {
  return Ne(Oo(e, t), 1);
}
var x$ = 1 / 0;
function W0(e, t) {
  return Ne(Oo(e, t), x$);
}
function k0(e, t, n) {
  return n = n === void 0 ? 1 : I(n), Ne(Oo(e, t), n);
}
var T$ = 1 / 0;
function q0(e) {
  var t = e == null ? 0 : e.length;
  return t ? Ne(e, T$) : [];
}
function G0(e, t) {
  var n = e == null ? 0 : e.length;
  return n ? (t = t === void 0 ? 1 : I(t), Ne(e, t)) : [];
}
var R$ = 512;
function H0(e) {
  return Gn(e, R$);
}
var K0 = Dl("floor"), P$ = "Expected a function", N$ = 8, $$ = 32, M$ = 128, I$ = 256;
function Y0(e) {
  return Xn(function(t) {
    var n = t.length, r = n, i = jt.prototype.thru;
    for (e && t.reverse(); r--; ) {
      var s = t[r];
      if (typeof s != "function")
        throw new TypeError(P$);
      if (i && !o && Oa(s) == "wrapper")
        var o = new jt([], !0);
    }
    for (r = o ? r : n; ++r < n; ) {
      s = t[r];
      var a = Oa(s), u = a == "wrapper" ? bl(s) : void 0;
      u && cc(u[0]) && u[1] == (M$ | N$ | $$ | I$) && !u[4].length && u[9] == 1 ? o = o[Oa(u[0])].apply(o, u[3]) : o = s.length == 1 && cc(s) ? o[a]() : o.thru(s);
    }
    return function() {
      var f = arguments, c = f[0];
      if (o && f.length == 1 && M(c))
        return o.plant(c).value();
      for (var l = 0, h = n ? t[l].apply(this, f) : c; ++l < n; )
        h = t[l].call(this, h);
      return h;
    };
  });
}
var X0 = Y0(), J0 = Y0(!0);
function Z0(e, t) {
  return e == null ? e : Hl(e, Sn(t), Ye);
}
function Q0(e, t) {
  return e == null ? e : O0(e, Sn(t), Ye);
}
function ey(e, t) {
  return e && En(e, Sn(t));
}
function ty(e, t) {
  return e && Zl(e, Sn(t));
}
function ny(e) {
  for (var t = -1, n = e == null ? 0 : e.length, r = {}; ++t < n; ) {
    var i = e[t];
    r[i[0]] = i[1];
  }
  return r;
}
function Lu(e, t) {
  return gr(t, function(n) {
    return wn(e[n]);
  });
}
function ry(e) {
  return e == null ? [] : Lu(e, ve(e));
}
function iy(e) {
  return e == null ? [] : Lu(e, Ye(e));
}
var D$ = Object.prototype, C$ = D$.hasOwnProperty, sy = $u(function(e, t, n) {
  C$.call(e, n) ? e[n].push(t) : Hn(e, n, [t]);
});
function rh(e, t) {
  return e > t;
}
function ju(e) {
  return function(t, n) {
    return typeof t == "string" && typeof n == "string" || (t = dt(t), n = dt(n)), e(t, n);
  };
}
var oy = ju(rh), ay = ju(function(e, t) {
  return e >= t;
}), L$ = Object.prototype, j$ = L$.hasOwnProperty;
function F$(e, t) {
  return e != null && j$.call(e, t);
}
function uy(e, t) {
  return e != null && Jg(e, t, F$);
}
var B$ = Math.max, z$ = Math.min;
function U$(e, t, n) {
  return e >= z$(t, n) && e < B$(t, n);
}
function fy(e, t, n) {
  return t = pn(t), n === void 0 ? (n = t, t = 0) : n = pn(n), e = dt(e), U$(e, t, n);
}
var V$ = "[object String]";
function Eo(e) {
  return typeof e == "string" || !M(e) && oe(e) && Ge(e) == V$;
}
function ih(e, t) {
  return ie(t, function(n) {
    return e[n];
  });
}
function ei(e) {
  return e == null ? [] : ih(e, ve(e));
}
var W$ = Math.max;
function cy(e, t, n, r) {
  e = Ke(e) ? e : ei(e), n = n && !r ? I(n) : 0;
  var i = e.length;
  return n < 0 && (n = W$(i + n, 0)), Eo(e) ? n <= i && e.indexOf(t, n) > -1 : !!i && Ki(e, t, n) > -1;
}
var k$ = Math.max;
function ly(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = n == null ? 0 : I(n);
  return i < 0 && (i = k$(r + i, 0)), Ki(e, t, i);
}
function hy(e) {
  var t = e == null ? 0 : e.length;
  return t ? Bt(e, 0, -1) : [];
}
var q$ = Math.min;
function sh(e, t, n) {
  for (var r = n ? Jl : gu, i = e[0].length, s = e.length, o = s, a = Array(s), u = 1 / 0, f = []; o--; ) {
    var c = e[o];
    o && t && (c = ie(c, wt(t))), u = q$(c.length, u), a[o] = !n && (t || i >= 120 && c.length >= 120) ? new Lr(o && c) : void 0;
  }
  c = e[0];
  var l = -1, h = a[0];
  e:
    for (; ++l < i && f.length < u; ) {
      var d = c[l], _ = t ? t(d) : d;
      if (d = n || d !== 0 ? d : 0, !(h ? qs(h, _) : r(f, _, n))) {
        for (o = s; --o; ) {
          var v = a[o];
          if (!(v ? qs(v, _) : r(e[o], _, n)))
            continue e;
        }
        h && h.push(_), f.push(d);
      }
    }
  return f;
}
function oh(e) {
  return fe(e) ? e : [];
}
var py = D(function(e) {
  var t = ie(e, oh);
  return t.length && t[0] === e[0] ? sh(t) : [];
}), dy = D(function(e) {
  var t = At(e), n = ie(e, oh);
  return t === At(n) ? t = void 0 : n.pop(), n.length && n[0] === e[0] ? sh(n, $(t)) : [];
}), _y = D(function(e) {
  var t = At(e), n = ie(e, oh);
  return t = typeof t == "function" ? t : void 0, t && n.pop(), n.length && n[0] === e[0] ? sh(n, void 0, t) : [];
});
function G$(e, t, n, r) {
  return En(e, function(i, s, o) {
    t(r, n(i), s, o);
  }), r;
}
function vy(e, t) {
  return function(n, r) {
    return G$(n, e, t(r), {});
  };
}
var H$ = Object.prototype, K$ = H$.toString, gy = vy(function(e, t, n) {
  t != null && typeof t.toString != "function" && (t = K$.call(t)), e[t] = n;
}, _u(He)), yy = Object.prototype, Y$ = yy.hasOwnProperty, X$ = yy.toString, by = vy(function(e, t, n) {
  t != null && typeof t.toString != "function" && (t = X$.call(t)), Y$.call(e, t) ? e[t].push(n) : e[t] = [n];
}, $);
function my(e, t) {
  return t.length < 2 ? e : Zr(e, Bt(t, 0, -1));
}
function So(e, t, n) {
  t = dr(t, e), e = my(e, t);
  var r = e == null ? e : e[On(At(t))];
  return r == null ? void 0 : mt(r, e, n);
}
var wy = D(So), Ay = D(function(e, t, n) {
  var r = -1, i = typeof t == "function", s = Ke(e) ? Array(e.length) : [];
  return yr(e, function(o) {
    s[++r] = i ? mt(t, o, n) : So(o, t, n);
  }), s;
}), J$ = "[object ArrayBuffer]";
function Z$(e) {
  return oe(e) && Ge(e) == J$;
}
var Bd = Ft && Ft.isArrayBuffer, Oy = Bd ? wt(Bd) : Z$, Q$ = "[object Boolean]";
function Ey(e) {
  return e === !0 || e === !1 || oe(e) && Ge(e) == Q$;
}
var eM = "[object Date]";
function tM(e) {
  return oe(e) && Ge(e) == eM;
}
var zd = Ft && Ft.isDate, Sy = zd ? wt(zd) : tM;
function xy(e) {
  return oe(e) && e.nodeType === 1 && !Ji(e);
}
var nM = "[object Map]", rM = "[object Set]", iM = Object.prototype, sM = iM.hasOwnProperty;
function Ty(e) {
  if (e == null)
    return !0;
  if (Ke(e) && (M(e) || typeof e == "string" || typeof e.splice == "function" || Vn(e) || Jr(e) || ar(e)))
    return !e.length;
  var t = _n(e);
  if (t == nM || t == rM)
    return !e.size;
  if (yo(e))
    return !Ol(e).length;
  for (var n in e)
    if (sM.call(e, n))
      return !1;
  return !0;
}
function Oi(e, t) {
  return wo(e, t);
}
function Ry(e, t, n) {
  n = typeof n == "function" ? n : void 0;
  var r = n ? n(e, t) : void 0;
  return r === void 0 ? wo(e, t, void 0, n) : !!r;
}
var oM = Se.isFinite;
function Py(e) {
  return typeof e == "number" && oM(e);
}
function ah(e) {
  return typeof e == "number" && e == I(e);
}
function Ny(e, t) {
  return e === t || Wl(e, t, kl(t));
}
function $y(e, t, n) {
  return n = typeof n == "function" ? n : void 0, Wl(e, t, kl(t), n);
}
var aM = "[object Number]";
function uh(e) {
  return typeof e == "number" || oe(e) && Ge(e) == aM;
}
function My(e) {
  return uh(e) && e != +e;
}
var uM = Aa ? wn : bu, fM = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.";
function Iy(e) {
  if (uM(e))
    throw new Error(fM);
  return Bv(e);
}
function Dy(e) {
  return e == null;
}
function Cy(e) {
  return e === null;
}
var cM = "[object RegExp]";
function lM(e) {
  return oe(e) && Ge(e) == cM;
}
var Ud = Ft && Ft.isRegExp, Fu = Ud ? wt(Ud) : lM, Vd = 9007199254740991;
function Ly(e) {
  return ah(e) && e >= -Vd && e <= Vd;
}
function jy(e) {
  return e === void 0;
}
var hM = "[object WeakMap]";
function Fy(e) {
  return oe(e) && _n(e) == hM;
}
var pM = "[object WeakSet]";
function By(e) {
  return oe(e) && Ge(e) == pM;
}
var dM = 1;
function zy(e) {
  return $(typeof e == "function" ? e : Dt(e, dM));
}
var _M = Array.prototype, vM = _M.join;
function Uy(e, t) {
  return e == null ? "" : vM.call(e, t);
}
var Vy = Qi(function(e, t, n) {
  return e + (n ? "-" : "") + t.toLowerCase();
}), Wy = $u(function(e, t, n) {
  Hn(e, n, t);
});
function gM(e, t, n) {
  for (var r = n + 1; r--; )
    if (e[r] === t)
      return r;
  return r;
}
var yM = Math.max, bM = Math.min;
function ky(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = r;
  return n !== void 0 && (i = I(n), i = i < 0 ? yM(r + i, 0) : bM(i, r - 1)), t === t ? gM(e, t, i) : vu(e, Gv, i, !0);
}
var qy = Qi(function(e, t, n) {
  return e + (n ? " " : "") + t.toLowerCase();
}), Gy = pg("toLowerCase");
function fh(e, t) {
  return e < t;
}
var Hy = ju(fh), Ky = ju(function(e, t) {
  return e <= t;
});
function Yy(e, t) {
  var n = {};
  return t = $(t), En(e, function(r, i, s) {
    Hn(n, t(r, i, s), r);
  }), n;
}
function Xy(e, t) {
  var n = {};
  return t = $(t), En(e, function(r, i, s) {
    Hn(n, i, t(r, i, s));
  }), n;
}
var mM = 1;
function Jy(e) {
  return Xg(Dt(e, mM));
}
var wM = 1;
function Zy(e, t) {
  return Zg(e, Dt(t, wM));
}
function Bu(e, t, n) {
  for (var r = -1, i = e.length; ++r < i; ) {
    var s = e[r], o = t(s);
    if (o != null && (a === void 0 ? o === o && !it(o) : n(o, a)))
      var a = o, u = s;
  }
  return u;
}
function Qy(e) {
  return e && e.length ? Bu(e, He, rh) : void 0;
}
function eb(e, t) {
  return e && e.length ? Bu(e, $(t), rh) : void 0;
}
function ch(e, t) {
  for (var n, r = -1, i = e.length; ++r < i; ) {
    var s = t(e[r]);
    s !== void 0 && (n = n === void 0 ? s : n + s);
  }
  return n;
}
var AM = NaN;
function tb(e, t) {
  var n = e == null ? 0 : e.length;
  return n ? ch(e, t) / n : AM;
}
function nb(e) {
  return tb(e, He);
}
function rb(e, t) {
  return tb(e, $(t));
}
var ib = Xi(function(e, t, n) {
  Du(e, t, n);
}), sb = D(function(e, t) {
  return function(n) {
    return So(n, e, t);
  };
}), ob = D(function(e, t) {
  return function(n) {
    return So(e, n, t);
  };
});
function ab(e) {
  return e && e.length ? Bu(e, He, fh) : void 0;
}
function ub(e, t) {
  return e && e.length ? Bu(e, $(t), fh) : void 0;
}
function fb(e, t, n) {
  var r = ve(t), i = Lu(t, r), s = !(se(n) && "chain" in n) || !!n.chain, o = wn(e);
  return Ut(i, function(a) {
    var u = t[a];
    e[a] = u, o && (e.prototype[a] = function() {
      var f = this.__chain__;
      if (s || f) {
        var c = e(this.__wrapped__), l = c.__actions__ = nt(this.__actions__);
        return l.push({ func: u, args: arguments, thisArg: e }), c.__chain__ = f, c;
      }
      return u.apply(e, _r([this.value()], arguments));
    });
  }), e;
}
var cb = hu(function(e, t) {
  return e * t;
}, 1), OM = "Expected a function";
function xo(e) {
  if (typeof e != "function")
    throw new TypeError(OM);
  return function() {
    var t = arguments;
    switch (t.length) {
      case 0:
        return !e.call(this);
      case 1:
        return !e.call(this, t[0]);
      case 2:
        return !e.call(this, t[0], t[1]);
      case 3:
        return !e.call(this, t[0], t[1], t[2]);
    }
    return !e.apply(this, t);
  };
}
function EM(e) {
  for (var t, n = []; !(t = e.next()).done; )
    n.push(t.value);
  return n;
}
var SM = "[object Map]", xM = "[object Set]", Lf = De ? De.iterator : void 0;
function lh(e) {
  if (!e)
    return [];
  if (Ke(e))
    return Eo(e) ? en(e) : nt(e);
  if (Lf && e[Lf])
    return EM(e[Lf]());
  var t = _n(e), n = t == SM ? Vl : t == xM ? Pu : ei;
  return n(e);
}
function Sc() {
  this.__values__ === void 0 && (this.__values__ = lh(this.value()));
  var e = this.__index__ >= this.__values__.length, t = e ? void 0 : this.__values__[this.__index__++];
  return { done: e, value: t };
}
function lb(e, t) {
  var n = e.length;
  if (n)
    return t += t < 0 ? n : 0, qn(t, n) ? e[t] : void 0;
}
function hb(e, t) {
  return e && e.length ? lb(e, I(t)) : void 0;
}
function pb(e) {
  return e = I(e), D(function(t) {
    return lb(t, e);
  });
}
function hh(e, t) {
  return t = dr(t, e), e = my(e, t), e == null || delete e[On(At(t))];
}
function TM(e) {
  return Ji(e) ? void 0 : e;
}
var RM = 1, PM = 2, NM = 4, db = Xn(function(e, t) {
  var n = {};
  if (e == null)
    return n;
  var r = !1;
  t = ie(t, function(s) {
    return s = dr(s, e), r || (r = s.length > 1), s;
  }), An(e, jl(e), n), r && (n = Dt(n, RM | PM | NM, TM));
  for (var i = t.length; i--; )
    hh(n, t[i]);
  return n;
});
function To(e, t, n, r) {
  if (!se(e))
    return e;
  t = dr(t, e);
  for (var i = -1, s = t.length, o = s - 1, a = e; a != null && ++i < s; ) {
    var u = On(t[i]), f = n;
    if (u === "__proto__" || u === "constructor" || u === "prototype")
      return e;
    if (i != o) {
      var c = a[u];
      f = r ? r(c, u, a) : void 0, f === void 0 && (f = se(c) ? c : qn(t[i + 1]) ? [] : {});
    }
    vo(a, u, f), a = a[u];
  }
  return e;
}
function _b(e, t, n) {
  for (var r = -1, i = t.length, s = {}; ++r < i; ) {
    var o = t[r], a = Zr(e, o);
    n(a, o) && To(s, dr(o, e), a);
  }
  return s;
}
function ph(e, t) {
  if (e == null)
    return {};
  var n = ie(jl(e), function(r) {
    return [r];
  });
  return t = $(t), _b(e, n, function(r, i) {
    return t(r, i[0]);
  });
}
function vb(e, t) {
  return ph(e, xo($(t)));
}
function gb(e) {
  return Rl(2, e);
}
function $M(e, t) {
  var n = e.length;
  for (e.sort(t); n--; )
    e[n] = e[n].value;
  return e;
}
function yb(e, t) {
  if (e !== t) {
    var n = e !== void 0, r = e === null, i = e === e, s = it(e), o = t !== void 0, a = t === null, u = t === t, f = it(t);
    if (!a && !f && !s && e > t || s && o && u && !a && !f || r && o && u || !n && u || !i)
      return 1;
    if (!r && !s && !f && e < t || f && n && i && !r && !s || a && n && i || !o && i || !u)
      return -1;
  }
  return 0;
}
function MM(e, t, n) {
  for (var r = -1, i = e.criteria, s = t.criteria, o = i.length, a = n.length; ++r < o; ) {
    var u = yb(i[r], s[r]);
    if (u) {
      if (r >= a)
        return u;
      var f = n[r];
      return u * (f == "desc" ? -1 : 1);
    }
  }
  return e.index - t.index;
}
function bb(e, t, n) {
  t.length ? t = ie(t, function(s) {
    return M(s) ? function(o) {
      return Zr(o, s.length === 1 ? s[0] : s);
    } : s;
  }) : t = [He];
  var r = -1;
  t = ie(t, wt($));
  var i = U0(e, function(s, o, a) {
    var u = ie(t, function(f) {
      return f(s);
    });
    return { criteria: u, index: ++r, value: s };
  });
  return $M(i, function(s, o) {
    return MM(s, o, n);
  });
}
function mb(e, t, n, r) {
  return e == null ? [] : (M(t) || (t = t == null ? [] : [t]), n = r ? void 0 : n, M(n) || (n = n == null ? [] : [n]), bb(e, t, n));
}
function dh(e) {
  return Xn(function(t) {
    return t = ie(t, wt($)), D(function(n) {
      var r = this;
      return e(t, function(i) {
        return mt(i, r, n);
      });
    });
  });
}
var wb = dh(ie), IM = D, DM = Math.min, Ab = IM(function(e, t) {
  t = t.length == 1 && M(t[0]) ? ie(t[0], wt($)) : ie(Ne(t, 1), wt($));
  var n = t.length;
  return D(function(r) {
    for (var i = -1, s = DM(r.length, n); ++i < s; )
      r[i] = t[i].call(this, r[i]);
    return mt(e, this, r);
  });
}), Ob = dh(N0), Eb = dh(Ul), CM = 9007199254740991, LM = Math.floor;
function xc(e, t) {
  var n = "";
  if (!e || t < 1 || t > CM)
    return n;
  do
    t % 2 && (n += e), t = LM(t / 2), t && (e += e);
  while (t);
  return n;
}
var jM = ql("length"), Sb = "\\ud800-\\udfff", FM = "\\u0300-\\u036f", BM = "\\ufe20-\\ufe2f", zM = "\\u20d0-\\u20ff", UM = FM + BM + zM, VM = "\\ufe0e\\ufe0f", WM = "[" + Sb + "]", Tc = "[" + UM + "]", Rc = "\\ud83c[\\udffb-\\udfff]", kM = "(?:" + Tc + "|" + Rc + ")", xb = "[^" + Sb + "]", Tb = "(?:\\ud83c[\\udde6-\\uddff]){2}", Rb = "[\\ud800-\\udbff][\\udc00-\\udfff]", qM = "\\u200d", Pb = kM + "?", Nb = "[" + VM + "]?", GM = "(?:" + qM + "(?:" + [xb, Tb, Rb].join("|") + ")" + Nb + Pb + ")*", HM = Nb + Pb + GM, KM = "(?:" + [xb + Tc + "?", Tc, Tb, Rb, WM].join("|") + ")", Wd = RegExp(Rc + "(?=" + Rc + ")|" + KM + HM, "g");
function YM(e) {
  for (var t = Wd.lastIndex = 0; Wd.test(e); )
    ++t;
  return t;
}
function es(e) {
  return Zi(e) ? YM(e) : jM(e);
}
var XM = Math.ceil;
function Da(e, t) {
  t = t === void 0 ? " " : bt(t);
  var n = t.length;
  if (n < 2)
    return n ? xc(t, e) : t;
  var r = xc(t, XM(e / es(t)));
  return Zi(t) ? vr(en(r), 0, e).join("") : r.slice(0, e);
}
var JM = Math.ceil, ZM = Math.floor;
function $b(e, t, n) {
  e = k(e), t = I(t);
  var r = t ? es(e) : 0;
  if (!t || r >= t)
    return e;
  var i = (t - r) / 2;
  return Da(ZM(i), n) + e + Da(JM(i), n);
}
function Mb(e, t, n) {
  e = k(e), t = I(t);
  var r = t ? es(e) : 0;
  return t && r < t ? e + Da(t - r, n) : e;
}
function Ib(e, t, n) {
  e = k(e), t = I(t);
  var r = t ? es(e) : 0;
  return t && r < t ? Da(t - r, n) + e : e;
}
var QM = /^\s+/, eI = Se.parseInt;
function Db(e, t, n) {
  return n || t == null ? t = 0 : t && (t = +t), eI(k(e).replace(QM, ""), t || 0);
}
var tI = 32, Ro = D(function(e, t) {
  var n = or(t, Yi(Ro));
  return Gn(e, tI, void 0, t, n);
});
Ro.placeholder = {};
var nI = 64, zu = D(function(e, t) {
  var n = or(t, Yi(zu));
  return Gn(e, nI, void 0, t, n);
});
zu.placeholder = {};
var Cb = $u(function(e, t, n) {
  e[n ? 0 : 1].push(t);
}, function() {
  return [[], []];
});
function rI(e, t) {
  return _b(e, t, function(n, r) {
    return Nu(e, r);
  });
}
var Lb = Xn(function(e, t) {
  return e == null ? {} : rI(e, t);
});
function Pc(e) {
  for (var t, n = this; n instanceof pu; ) {
    var r = Wv(n);
    r.__index__ = 0, r.__values__ = void 0, t ? i.__wrapped__ = r : t = r;
    var i = r;
    n = n.__wrapped__;
  }
  return i.__wrapped__ = e, t;
}
function jb(e) {
  return function(t) {
    return e == null ? void 0 : Zr(e, t);
  };
}
function iI(e, t, n, r) {
  for (var i = n - 1, s = e.length; ++i < s; )
    if (r(e[i], t))
      return i;
  return -1;
}
var sI = Array.prototype, kd = sI.splice;
function _h(e, t, n, r) {
  var i = r ? iI : Ki, s = -1, o = t.length, a = e;
  for (e === t && (t = nt(t)), n && (a = ie(e, wt(n))); ++s < o; )
    for (var u = 0, f = t[s], c = n ? n(f) : f; (u = i(a, c, u, r)) > -1; )
      a !== e && kd.call(a, u, 1), kd.call(e, u, 1);
  return e;
}
function vh(e, t) {
  return e && e.length && t && t.length ? _h(e, t) : e;
}
var Fb = D(vh);
function Bb(e, t, n) {
  return e && e.length && t && t.length ? _h(e, t, $(n)) : e;
}
function zb(e, t, n) {
  return e && e.length && t && t.length ? _h(e, t, void 0, n) : e;
}
var oI = Array.prototype, aI = oI.splice;
function Ub(e, t) {
  for (var n = e ? t.length : 0, r = n - 1; n--; ) {
    var i = t[n];
    if (n == r || i !== s) {
      var s = i;
      qn(i) ? aI.call(e, i, 1) : hh(e, i);
    }
  }
  return e;
}
var Vb = Xn(function(e, t) {
  var n = e == null ? 0 : e.length, r = Sl(e, t);
  return Ub(e, ie(t, function(i) {
    return qn(i, n) ? +i : i;
  }).sort(yb)), r;
}), uI = Math.floor, fI = Math.random;
function gh(e, t) {
  return e + uI(fI() * (t - e + 1));
}
var cI = parseFloat, lI = Math.min, hI = Math.random;
function Wb(e, t, n) {
  if (n && typeof n != "boolean" && ke(e, t, n) && (t = n = void 0), n === void 0 && (typeof t == "boolean" ? (n = t, t = void 0) : typeof e == "boolean" && (n = e, e = void 0)), e === void 0 && t === void 0 ? (e = 0, t = 1) : (e = pn(e), t === void 0 ? (t = e, e = 0) : t = pn(t)), e > t) {
    var r = e;
    e = t, t = r;
  }
  if (n || e % 1 || t % 1) {
    var i = hI();
    return lI(e + i * (t - e + cI("1e-" + ((i + "").length - 1))), t);
  }
  return gh(e, t);
}
var pI = Math.ceil, dI = Math.max;
function _I(e, t, n, r) {
  for (var i = -1, s = dI(pI((t - e) / (n || 1)), 0), o = Array(s); s--; )
    o[r ? s : ++i] = e, e += n;
  return o;
}
function kb(e) {
  return function(t, n, r) {
    return r && typeof r != "number" && ke(t, n, r) && (n = r = void 0), t = pn(t), n === void 0 ? (n = t, t = 0) : n = pn(n), r = r === void 0 ? t < n ? 1 : -1 : pn(r), _I(t, n, r, e);
  };
}
var qb = kb(), Gb = kb(!0), vI = 256, Hb = Xn(function(e, t) {
  return Gn(e, vI, void 0, void 0, void 0, t);
});
function Kb(e, t, n, r, i) {
  return i(e, function(s, o, a) {
    n = r ? (r = !1, s) : t(n, s, o, a);
  }), n;
}
function Yb(e, t, n) {
  var r = M(e) ? Nl : Kb, i = arguments.length < 3;
  return r(e, $(t), n, i, yr);
}
function gI(e, t, n, r) {
  var i = e == null ? 0 : e.length;
  for (r && i && (n = e[--i]); i--; )
    n = t(n, e[i], i, e);
  return n;
}
function Xb(e, t, n) {
  var r = M(e) ? gI : Kb, i = arguments.length < 3;
  return r(e, $(t), n, i, E0);
}
function Jb(e, t) {
  var n = M(e) ? gr : I0;
  return n(e, xo($(t)));
}
function Zb(e, t) {
  var n = [];
  if (!(e && e.length))
    return n;
  var r = -1, i = [], s = e.length;
  for (t = $(t); ++r < s; ) {
    var o = e[r];
    t(o, r, e) && (n.push(o), i.push(r));
  }
  return Ub(e, i), n;
}
function Qb(e, t, n) {
  return (n ? ke(e, t, n) : t === void 0) ? t = 1 : t = I(t), xc(k(e), t);
}
function em() {
  var e = arguments, t = k(e[0]);
  return e.length < 3 ? t : t.replace(e[1], e[2]);
}
var yI = "Expected a function";
function tm(e, t) {
  if (typeof e != "function")
    throw new TypeError(yI);
  return t = t === void 0 ? t : I(t), D(e, t);
}
function nm(e, t, n) {
  t = dr(t, e);
  var r = -1, i = t.length;
  for (i || (i = 1, e = void 0); ++r < i; ) {
    var s = e?.[On(t[r])];
    s === void 0 && (r = i, s = n), e = wn(s) ? s.call(e) : s;
  }
  return e;
}
var bI = Array.prototype, mI = bI.reverse;
function Ca(e) {
  return e == null ? e : mI.call(e);
}
var rm = Dl("round");
function im(e) {
  var t = e.length;
  return t ? e[gh(0, t - 1)] : void 0;
}
function wI(e) {
  return im(ei(e));
}
function sm(e) {
  var t = M(e) ? im : wI;
  return t(e);
}
function Uu(e, t) {
  var n = -1, r = e.length, i = r - 1;
  for (t = t === void 0 ? r : t; ++n < t; ) {
    var s = gh(n, i), o = e[s];
    e[s] = e[n], e[n] = o;
  }
  return e.length = t, e;
}
function AI(e, t) {
  return Uu(nt(e), Qr(t, 0, e.length));
}
function OI(e, t) {
  var n = ei(e);
  return Uu(n, Qr(t, 0, n.length));
}
function om(e, t, n) {
  (n ? ke(e, t, n) : t === void 0) ? t = 1 : t = I(t);
  var r = M(e) ? AI : OI;
  return r(e, t);
}
function am(e, t, n) {
  return e == null ? e : To(e, t, n);
}
function um(e, t, n, r) {
  return r = typeof r == "function" ? r : void 0, e == null ? e : To(e, t, n, r);
}
function EI(e) {
  return Uu(nt(e));
}
function SI(e) {
  return Uu(ei(e));
}
function fm(e) {
  var t = M(e) ? EI : SI;
  return t(e);
}
var xI = "[object Map]", TI = "[object Set]";
function cm(e) {
  if (e == null)
    return 0;
  if (Ke(e))
    return Eo(e) ? es(e) : e.length;
  var t = _n(e);
  return t == xI || t == TI ? e.size : Ol(e).length;
}
function lm(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (n && typeof n != "number" && ke(e, t, n) ? (t = 0, n = r) : (t = t == null ? 0 : I(t), n = n === void 0 ? r : I(n)), Bt(e, t, n)) : [];
}
var hm = Qi(function(e, t, n) {
  return e + (n ? "_" : "") + t.toLowerCase();
});
function RI(e, t) {
  var n;
  return yr(e, function(r, i, s) {
    return n = t(r, i, s), !n;
  }), !!n;
}
function pm(e, t, n) {
  var r = M(e) ? Ul : RI;
  return n && ke(e, t, n) && (t = void 0), r(e, $(t));
}
var dm = D(function(e, t) {
  if (e == null)
    return [];
  var n = t.length;
  return n > 1 && ke(e, t[0], t[1]) ? t = [] : n > 2 && ke(t[0], t[1], t[2]) && (t = [t[0]]), bb(e, Ne(t, 1), []);
}), PI = 4294967295, NI = PI - 1, $I = Math.floor, MI = Math.min;
function yh(e, t, n, r) {
  var i = 0, s = e == null ? 0 : e.length;
  if (s === 0)
    return 0;
  t = n(t);
  for (var o = t !== t, a = t === null, u = it(t), f = t === void 0; i < s; ) {
    var c = $I((i + s) / 2), l = n(e[c]), h = l !== void 0, d = l === null, _ = l === l, v = it(l);
    if (o)
      var g = r || _;
    else f ? g = _ && (r || h) : a ? g = _ && h && (r || !d) : u ? g = _ && h && !d && (r || !v) : d || v ? g = !1 : g = r ? l <= t : l < t;
    g ? i = c + 1 : s = c;
  }
  return MI(s, NI);
}
var II = 4294967295, DI = II >>> 1;
function Vu(e, t, n) {
  var r = 0, i = e == null ? r : e.length;
  if (typeof t == "number" && t === t && i <= DI) {
    for (; r < i; ) {
      var s = r + i >>> 1, o = e[s];
      o !== null && !it(o) && (n ? o <= t : o < t) ? r = s + 1 : i = s;
    }
    return i;
  }
  return yh(e, t, He, n);
}
function _m(e, t) {
  return Vu(e, t);
}
function vm(e, t, n) {
  return yh(e, t, $(n));
}
function gm(e, t) {
  var n = e == null ? 0 : e.length;
  if (n) {
    var r = Vu(e, t);
    if (r < n && Vt(e[r], t))
      return r;
  }
  return -1;
}
function ym(e, t) {
  return Vu(e, t, !0);
}
function bm(e, t, n) {
  return yh(e, t, $(n), !0);
}
function mm(e, t) {
  var n = e == null ? 0 : e.length;
  if (n) {
    var r = Vu(e, t, !0) - 1;
    if (Vt(e[r], t))
      return r;
  }
  return -1;
}
function wm(e, t) {
  for (var n = -1, r = e.length, i = 0, s = []; ++n < r; ) {
    var o = e[n], a = t ? t(o) : o;
    if (!n || !Vt(a, u)) {
      var u = a;
      s[i++] = o === 0 ? 0 : o;
    }
  }
  return s;
}
function Am(e) {
  return e && e.length ? wm(e) : [];
}
function Om(e, t) {
  return e && e.length ? wm(e, $(t)) : [];
}
var CI = 4294967295;
function Em(e, t, n) {
  return n && typeof n != "number" && ke(e, t, n) && (t = n = void 0), n = n === void 0 ? CI : n >>> 0, n ? (e = k(e), e && (typeof t == "string" || t != null && !Fu(t)) && (t = bt(t), !t && Zi(e)) ? vr(en(e), 0, n) : e.split(t, n)) : [];
}
var LI = "Expected a function", jI = Math.max;
function Sm(e, t) {
  if (typeof e != "function")
    throw new TypeError(LI);
  return t = t == null ? 0 : jI(I(t), 0), D(function(n) {
    var r = n[t], i = vr(n, 0, t);
    return r && _r(i, r), mt(e, this, i);
  });
}
var xm = Qi(function(e, t, n) {
  return e + (n ? " " : "") + xu(t);
});
function Tm(e, t, n) {
  return e = k(e), n = n == null ? 0 : Qr(I(n), 0, e.length), t = bt(t), e.slice(n, n + t.length) == t;
}
function Rm() {
  return {};
}
function Pm() {
  return "";
}
function Nm() {
  return !0;
}
var $m = hu(function(e, t) {
  return e - t;
}, 0);
function Mm(e) {
  return e && e.length ? ch(e, He) : 0;
}
function Im(e, t) {
  return e && e.length ? ch(e, $(t)) : 0;
}
function Dm(e) {
  var t = e == null ? 0 : e.length;
  return t ? Bt(e, 1, t) : [];
}
function Cm(e, t, n) {
  return e && e.length ? (t = n || t === void 0 ? 1 : I(t), Bt(e, 0, t < 0 ? 0 : t)) : [];
}
function Lm(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (t = n || t === void 0 ? 1 : I(t), t = r - t, Bt(e, t < 0 ? 0 : t, r)) : [];
}
function jm(e, t) {
  return e && e.length ? Cu(e, $(t), !1, !0) : [];
}
function Fm(e, t) {
  return e && e.length ? Cu(e, $(t)) : [];
}
function Bm(e, t) {
  return t(e), e;
}
var zm = Object.prototype, FI = zm.hasOwnProperty;
function qd(e, t, n, r) {
  return e === void 0 || Vt(e, zm[n]) && !FI.call(r, n) ? t : e;
}
var BI = {
  "\\": "\\",
  "'": "'",
  "\n": "n",
  "\r": "r",
  "\u2028": "u2028",
  "\u2029": "u2029"
};
function zI(e) {
  return "\\" + BI[e];
}
var Um = /<%=([\s\S]+?)%>/g, UI = /<%-([\s\S]+?)%>/g, VI = /<%([\s\S]+?)%>/g, La = {
  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  escape: UI,
  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  evaluate: VI,
  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  interpolate: Um,
  /**
   * Used to reference the data object in the template text.
   *
   * @memberOf _.templateSettings
   * @type {string}
   */
  variable: "",
  /**
   * Used to import variables into the compiled template.
   *
   * @memberOf _.templateSettings
   * @type {Object}
   */
  imports: {
    /**
     * A reference to the `lodash` function.
     *
     * @memberOf _.templateSettings.imports
     * @type {Function}
     */
    _: { escape: Ql }
  }
}, WI = "Invalid `variable` option passed into `_.template`", kI = /\b__p \+= '';/g, qI = /\b(__p \+=) '' \+/g, GI = /(__e\(.*?\)|\b__t\)) \+\n'';/g, HI = /[()=,{}\[\]\/\s]/, KI = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, ia = /($^)/, YI = /['\n\r\u2028\u2029\\]/g, XI = Object.prototype, Gd = XI.hasOwnProperty;
function Vm(e, t, n) {
  var r = La.imports._.templateSettings || La;
  n && ke(e, t, n) && (t = void 0), e = k(e), t = Vs({}, t, r, qd);
  var i = Vs({}, t.imports, r.imports, qd), s = ve(i), o = ih(i, s), a, u, f = 0, c = t.interpolate || ia, l = "__p += '", h = RegExp(
    (t.escape || ia).source + "|" + c.source + "|" + (c === Um ? KI : ia).source + "|" + (t.evaluate || ia).source + "|$",
    "g"
  ), d = Gd.call(t, "sourceURL") ? "//# sourceURL=" + (t.sourceURL + "").replace(/\s/g, " ") + `
` : "";
  e.replace(h, function(g, y, b, w, m, A) {
    return b || (b = w), l += e.slice(f, A).replace(YI, zI), y && (a = !0, l += `' +
__e(` + y + `) +
'`), m && (u = !0, l += `';
` + m + `;
__p += '`), b && (l += `' +
((__t = (` + b + `)) == null ? '' : __t) +
'`), f = A + g.length, g;
  }), l += `';
`;
  var _ = Gd.call(t, "variable") && t.variable;
  if (!_)
    l = `with (obj) {
` + l + `
}
`;
  else if (HI.test(_))
    throw new Error(WI);
  l = (u ? l.replace(kI, "") : l).replace(qI, "$1").replace(GI, "$1;"), l = "function(" + (_ || "obj") + `) {
` + (_ ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (a ? ", __e = _.escape" : "") + (u ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + l + `return __p
}`;
  var v = Tl(function() {
    return Function(s, d + "return " + l).apply(void 0, o);
  });
  if (v.source = l, Eu(v))
    throw v;
  return v;
}
var JI = "Expected a function";
function Wm(e, t, n) {
  var r = !0, i = !0;
  if (typeof e != "function")
    throw new TypeError(JI);
  return se(n) && (r = "leading" in n ? !!n.leading : r, i = "trailing" in n ? !!n.trailing : i), Kl(e, t, {
    leading: r,
    maxWait: t,
    trailing: i
  });
}
function Po(e, t) {
  return t(e);
}
var ZI = 9007199254740991, jf = 4294967295, QI = Math.min;
function km(e, t) {
  if (e = I(e), e < 1 || e > ZI)
    return [];
  var n = jf, r = QI(e, jf);
  t = Sn(t), e -= jf;
  for (var i = Al(r, t); ++n < e; )
    t(n);
  return i;
}
function Nc() {
  return this;
}
function qm(e, t) {
  var n = e;
  return n instanceof C && (n = n.value()), Nl(t, function(r, i) {
    return i.func.apply(i.thisArg, _r([r], i.args));
  }, n);
}
function ws() {
  return qm(this.__wrapped__, this.__actions__);
}
function Gm(e) {
  return k(e).toLowerCase();
}
function Hm(e) {
  return M(e) ? ie(e, On) : it(e) ? [e] : nt(rg(k(e)));
}
var Hd = 9007199254740991;
function Km(e) {
  return e ? Qr(I(e), -Hd, Hd) : e === 0 ? e : 0;
}
function Ym(e) {
  return k(e).toUpperCase();
}
function Xm(e, t, n) {
  var r = M(e), i = r || Vn(e) || Jr(e);
  if (t = $(t), n == null) {
    var s = e && e.constructor;
    i ? n = r ? new s() : [] : se(e) ? n = wn(s) ? Hi(Ou(e)) : {} : n = {};
  }
  return (i ? Ut : En)(e, function(o, a, u) {
    return t(n, o, a, u);
  }), n;
}
function Jm(e, t) {
  for (var n = e.length; n-- && Ki(t, e[n], 0) > -1; )
    ;
  return n;
}
function Zm(e, t) {
  for (var n = -1, r = e.length; ++n < r && Ki(t, e[n], 0) > -1; )
    ;
  return n;
}
function Qm(e, t, n) {
  if (e = k(e), e && (n || t === void 0))
    return jv(e);
  if (!e || !(t = bt(t)))
    return e;
  var r = en(e), i = en(t), s = Zm(r, i), o = Jm(r, i) + 1;
  return vr(r, s, o).join("");
}
function e1(e, t, n) {
  if (e = k(e), e && (n || t === void 0))
    return e.slice(0, Lv(e) + 1);
  if (!e || !(t = bt(t)))
    return e;
  var r = en(e), i = Jm(r, en(t)) + 1;
  return vr(r, 0, i).join("");
}
var eD = /^\s+/;
function t1(e, t, n) {
  if (e = k(e), e && (n || t === void 0))
    return e.replace(eD, "");
  if (!e || !(t = bt(t)))
    return e;
  var r = en(e), i = Zm(r, en(t));
  return vr(r, i).join("");
}
var tD = 30, nD = "...", rD = /\w*$/;
function n1(e, t) {
  var n = tD, r = nD;
  if (se(t)) {
    var i = "separator" in t ? t.separator : i;
    n = "length" in t ? I(t.length) : n, r = "omission" in t ? bt(t.omission) : r;
  }
  e = k(e);
  var s = e.length;
  if (Zi(e)) {
    var o = en(e);
    s = o.length;
  }
  if (n >= s)
    return e;
  var a = n - es(r);
  if (a < 1)
    return r;
  var u = o ? vr(o, 0, a).join("") : e.slice(0, a);
  if (i === void 0)
    return u + r;
  if (o && (a += u.length - a), Fu(i)) {
    if (e.slice(a).search(i)) {
      var f, c = u;
      for (i.global || (i = RegExp(i.source, k(rD.exec(i)) + "g")), i.lastIndex = 0; f = i.exec(c); )
        var l = f.index;
      u = u.slice(0, l === void 0 ? a : l);
    }
  } else if (e.indexOf(bt(i), a) != a) {
    var h = u.lastIndexOf(i);
    h > -1 && (u = u.slice(0, h));
  }
  return u + r;
}
function r1(e) {
  return wl(e, 1);
}
var iD = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'"
}, sD = $l(iD), i1 = /&(?:amp|lt|gt|quot|#39);/g, oD = RegExp(i1.source);
function s1(e) {
  return e = k(e), e && oD.test(e) ? e.replace(i1, sD) : e;
}
var aD = 1 / 0, uD = Ai && 1 / Pu(new Ai([, -0]))[1] == aD ? function(e) {
  return new Ai(e);
} : du, fD = 200;
function ur(e, t, n) {
  var r = -1, i = gu, s = e.length, o = !0, a = [], u = a;
  if (n)
    o = !1, i = Jl;
  else if (s >= fD) {
    var f = t ? null : uD(e);
    if (f)
      return Pu(f);
    o = !1, i = qs, u = new Lr();
  } else
    u = t ? [] : a;
  e:
    for (; ++r < s; ) {
      var c = e[r], l = t ? t(c) : c;
      if (c = n || c !== 0 ? c : 0, o && l === l) {
        for (var h = u.length; h--; )
          if (u[h] === l)
            continue e;
        t && u.push(l), a.push(c);
      } else i(u, l, n) || (u !== a && u.push(l), a.push(c));
    }
  return a;
}
var o1 = D(function(e) {
  return ur(Ne(e, 1, fe, !0));
}), a1 = D(function(e) {
  var t = At(e);
  return fe(t) && (t = void 0), ur(Ne(e, 1, fe, !0), $(t));
}), u1 = D(function(e) {
  var t = At(e);
  return t = typeof t == "function" ? t : void 0, ur(Ne(e, 1, fe, !0), void 0, t);
});
function f1(e) {
  return e && e.length ? ur(e) : [];
}
function c1(e, t) {
  return e && e.length ? ur(e, $(t)) : [];
}
function l1(e, t) {
  return t = typeof t == "function" ? t : void 0, e && e.length ? ur(e, void 0, t) : [];
}
var cD = 0;
function h1(e) {
  var t = ++cD;
  return k(e) + t;
}
function p1(e, t) {
  return e == null ? !0 : hh(e, t);
}
var lD = Math.max;
function Wu(e) {
  if (!(e && e.length))
    return [];
  var t = 0;
  return e = gr(e, function(n) {
    if (fe(n))
      return t = lD(n.length, t), !0;
  }), Al(t, function(n) {
    return ie(e, ql(n));
  });
}
function bh(e, t) {
  if (!(e && e.length))
    return [];
  var n = Wu(e);
  return t == null ? n : ie(n, function(r) {
    return mt(t, void 0, r);
  });
}
function d1(e, t, n, r) {
  return To(e, t, n(Zr(e, t)), r);
}
function _1(e, t, n) {
  return e == null ? e : d1(e, t, Sn(n));
}
function v1(e, t, n, r) {
  return r = typeof r == "function" ? r : void 0, e == null ? e : d1(e, t, Sn(n), r);
}
var g1 = Qi(function(e, t, n) {
  return e + (n ? " " : "") + t.toUpperCase();
});
function y1(e) {
  return e == null ? [] : ih(e, Ye(e));
}
var b1 = D(function(e, t) {
  return fe(e) ? Ao(e, t) : [];
});
function m1(e, t) {
  return Ro(Sn(t), e);
}
var w1 = Xn(function(e) {
  var t = e.length, n = t ? e[0] : 0, r = this.__wrapped__, i = function(s) {
    return Sl(s, e);
  };
  return t > 1 || this.__actions__.length || !(r instanceof C) || !qn(n) ? this.thru(i) : (r = r.slice(n, +n + (t ? 1 : 0)), r.__actions__.push({
    func: Po,
    args: [i],
    thisArg: void 0
  }), new jt(r, this.__chain__).thru(function(s) {
    return t && !s.length && s.push(void 0), s;
  }));
});
function A1() {
  return Cl(this);
}
function O1() {
  var e = this.__wrapped__;
  if (e instanceof C) {
    var t = e;
    return this.__actions__.length && (t = new C(this)), t = t.reverse(), t.__actions__.push({
      func: Po,
      args: [Ca],
      thisArg: void 0
    }), new jt(t, this.__chain__);
  }
  return this.thru(Ca);
}
function mh(e, t, n) {
  var r = e.length;
  if (r < 2)
    return r ? ur(e[0]) : [];
  for (var i = -1, s = Array(r); ++i < r; )
    for (var o = e[i], a = -1; ++a < r; )
      a != i && (s[i] = Ao(s[i] || o, e[a], t, n));
  return ur(Ne(s, 1), t, n);
}
var E1 = D(function(e) {
  return mh(gr(e, fe));
}), S1 = D(function(e) {
  var t = At(e);
  return fe(t) && (t = void 0), mh(gr(e, fe), $(t));
}), x1 = D(function(e) {
  var t = At(e);
  return t = typeof t == "function" ? t : void 0, mh(gr(e, fe), void 0, t);
}), T1 = D(Wu);
function R1(e, t, n) {
  for (var r = -1, i = e.length, s = t.length, o = {}; ++r < i; ) {
    var a = r < s ? t[r] : void 0;
    n(o, e[r], a);
  }
  return o;
}
function P1(e, t) {
  return R1(e || [], t || [], vo);
}
function N1(e, t) {
  return R1(e || [], t || [], To);
}
var $1 = D(function(e) {
  var t = e.length, n = t > 1 ? e[t - 1] : void 0;
  return n = typeof n == "function" ? (e.pop(), n) : void 0, bh(e, n);
});
const x = {
  chunk: Ng,
  compact: qg,
  concat: Gg,
  difference: _0,
  differenceBy: v0,
  differenceWith: g0,
  drop: b0,
  dropRight: m0,
  dropRightWhile: w0,
  dropWhile: A0,
  fill: M0,
  findIndex: th,
  findLastIndex: nh,
  flatten: xl,
  flattenDeep: q0,
  flattenDepth: G0,
  fromPairs: ny,
  head: Ec,
  indexOf: ly,
  initial: hy,
  intersection: py,
  intersectionBy: dy,
  intersectionWith: _y,
  join: Uy,
  lastIndexOf: ky,
  nth: hb,
  pull: Fb,
  pullAll: vh,
  pullAllBy: Bb,
  pullAllWith: zb,
  pullAt: Vb,
  remove: Zb,
  reverse: Ca,
  slice: lm,
  sortedIndex: _m,
  sortedIndexBy: vm,
  sortedIndexOf: gm,
  sortedLastIndex: ym,
  sortedLastIndexBy: bm,
  sortedLastIndexOf: mm,
  sortedUniq: Am,
  sortedUniqBy: Om,
  tail: Dm,
  take: Cm,
  takeRight: Lm,
  takeRightWhile: jm,
  takeWhile: Fm,
  union: o1,
  unionBy: a1,
  unionWith: u1,
  uniq: f1,
  uniqBy: c1,
  uniqWith: l1,
  unzip: Wu,
  unzipWith: bh,
  without: b1,
  xor: E1,
  xorBy: S1,
  xorWith: x1,
  zip: T1,
  zipObject: P1,
  zipObjectDeep: N1,
  zipWith: $1
}, K = {
  countBy: s0,
  every: $0,
  filter: D0,
  find: L0,
  findLast: B0,
  flatMap: V0,
  flatMapDeep: W0,
  flatMapDepth: k0,
  forEach: mc,
  forEachRight: wc,
  groupBy: sy,
  includes: cy,
  invokeMap: Ay,
  keyBy: Wy,
  map: Oo,
  orderBy: mb,
  partition: Cb,
  reduce: Yb,
  reduceRight: Xb,
  reject: Jb,
  sample: sm,
  sampleSize: om,
  shuffle: fm,
  size: cm,
  some: pm,
  sortBy: dm
}, hD = {
  now: Ts
}, ce = {
  after: Fv,
  ary: wl,
  before: Rl,
  bind: mo,
  bindKey: Su,
  curry: Mu,
  curryRight: Iu,
  debounce: Kl,
  defer: p0,
  delay: d0,
  flip: H0,
  memoize: bo,
  once: gb,
  overArgs: Ab,
  partial: Ro,
  partialRight: zu,
  rearg: Hb,
  rest: tm,
  spread: Sm,
  throttle: Wm,
  unary: r1,
  wrap: m1
}, P = {
  castArray: Rg,
  clone: Vg,
  cloneDeep: Ru,
  cloneDeepWith: Wg,
  cloneWith: kg,
  conformsTo: n0,
  eq: Vt,
  gt: oy,
  gte: ay,
  isArguments: ar,
  isArrayBuffer: Oy,
  isArrayLike: Ke,
  isArrayLikeObject: fe,
  isBoolean: Ey,
  isBuffer: Vn,
  isDate: Sy,
  isElement: xy,
  isEmpty: Ty,
  isEqual: Oi,
  isEqualWith: Ry,
  isError: Eu,
  isFinite: Py,
  isFunction: wn,
  isInteger: ah,
  isLength: go,
  isMap: Bl,
  isMatch: Ny,
  isMatchWith: $y,
  isNaN: My,
  isNative: Iy,
  isNil: Dy,
  isNull: Cy,
  isNumber: uh,
  isObjectLike: oe,
  isPlainObject: Ji,
  isRegExp: Fu,
  isSafeInteger: Ly,
  isSet: zl,
  isString: Eo,
  isSymbol: it,
  isTypedArray: Jr,
  isUndefined: jy,
  isWeakMap: Fy,
  isWeakSet: By,
  lt: Hy,
  lte: Ky,
  toArray: lh,
  toFinite: pn,
  toLength: eh,
  toNumber: dt,
  toPlainObject: Yl,
  toSafeInteger: Km,
  toString: k
}, Xe = {
  add: Cv,
  ceil: Pg,
  divide: y0,
  floor: K0,
  max: Qy,
  maxBy: eb,
  mean: nb,
  meanBy: rb,
  min: ab,
  minBy: ub,
  multiply: cb,
  round: rm,
  subtract: $m,
  sum: Mm,
  sumBy: Im
}, wh = {
  clamp: $g,
  inRange: fy,
  random: Wb
}, N = {
  assign: tg,
  assignIn: lc,
  assignInWith: Vs,
  assignWith: ng,
  at: ig,
  create: o0,
  defaults: f0,
  defaultsDeep: l0,
  findKey: F0,
  findLastKey: z0,
  forIn: Z0,
  forInRight: Q0,
  forOwn: ey,
  forOwnRight: ty,
  functions: ry,
  functionsIn: iy,
  get: Au,
  has: uy,
  hasIn: Nu,
  invert: gy,
  invertBy: by,
  invoke: wy,
  keysIn: Ye,
  mapKeys: Yy,
  mapValues: Xy,
  merge: ib,
  mergeWith: Xl,
  omit: db,
  omitBy: vb,
  pick: Lb,
  pickBy: ph,
  result: nm,
  set: am,
  setWith: um,
  toPairs: Ac,
  toPairsIn: Oc,
  transform: Xm,
  unset: p1,
  update: _1,
  updateWith: v1,
  values: ei,
  valuesIn: y1
}, xn = {
  at: w1,
  chain: Cl,
  commit: gc,
  next: Sc,
  plant: Pc,
  reverse: O1,
  tap: Bm,
  toIterator: Nc,
  value: ws,
  wrapperChain: A1
}, q = {
  camelCase: Tg,
  capitalize: Pl,
  deburr: Ml,
  endsWith: S0,
  escape: Ql,
  escapeRegExp: P0,
  kebabCase: Vy,
  lowerCase: qy,
  lowerFirst: Gy,
  pad: $b,
  padEnd: Mb,
  padStart: Ib,
  parseInt: Db,
  repeat: Qb,
  replace: em,
  snakeCase: hm,
  split: Em,
  startCase: xm,
  startsWith: Tm,
  template: Vm,
  templateSettings: La,
  toLower: Gm,
  toUpper: Ym,
  trim: Qm,
  trimEnd: e1,
  trimStart: t1,
  truncate: n1,
  unescape: s1,
  upperCase: g1,
  upperFirst: xu,
  words: Il
}, H = {
  attempt: Tl,
  bindAll: og,
  cond: Qg,
  conforms: t0,
  constant: _u,
  defaultTo: a0,
  flow: X0,
  flowRight: J0,
  iteratee: zy,
  matches: Jy,
  matchesProperty: Zy,
  method: sb,
  methodOf: ob,
  noop: du,
  nthArg: pb,
  over: wb,
  overEvery: Ob,
  overSome: Eb,
  property: Gl,
  propertyOf: jb,
  range: qb,
  rangeRight: Gb,
  stubArray: Tu,
  stubFalse: bu,
  stubObject: Rm,
  stubString: Pm,
  stubTrue: Nm,
  times: km,
  toPath: Hm,
  uniqueId: h1
};
function pD() {
  var e = new C(this.__wrapped__);
  return e.__actions__ = nt(this.__actions__), e.__dir__ = this.__dir__, e.__filtered__ = this.__filtered__, e.__iteratees__ = nt(this.__iteratees__), e.__takeCount__ = this.__takeCount__, e.__views__ = nt(this.__views__), e;
}
function dD() {
  if (this.__filtered__) {
    var e = new C(this);
    e.__dir__ = -1, e.__filtered__ = !0;
  } else
    e = this.clone(), e.__dir__ *= -1;
  return e;
}
var _D = Math.max, vD = Math.min;
function gD(e, t, n) {
  for (var r = -1, i = n.length; ++r < i; ) {
    var s = n[r], o = s.size;
    switch (s.type) {
      case "drop":
        e += o;
        break;
      case "dropRight":
        t -= o;
        break;
      case "take":
        t = vD(t, e + o);
        break;
      case "takeRight":
        e = _D(e, t - o);
        break;
    }
  }
  return { start: e, end: t };
}
var yD = 1, bD = 2, mD = Math.min;
function wD() {
  var e = this.__wrapped__.value(), t = this.__dir__, n = M(e), r = t < 0, i = n ? e.length : 0, s = gD(0, i, this.__views__), o = s.start, a = s.end, u = a - o, f = r ? a : o - 1, c = this.__iteratees__, l = c.length, h = 0, d = mD(u, this.__takeCount__);
  if (!n || !r && i == u && d == u)
    return qm(e, this.__actions__);
  var _ = [];
  e:
    for (; u-- && h < d; ) {
      f += t;
      for (var v = -1, g = e[f]; ++v < l; ) {
        var y = c[v], b = y.iteratee, w = y.type, m = b(g);
        if (w == bD)
          g = m;
        else if (!m) {
          if (w == yD)
            continue e;
          break e;
        }
      }
      _[h++] = g;
    }
  return _;
}
/**
 * @license
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="es" -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
var AD = "4.17.21", OD = 2, ED = 1, SD = 3, M1 = 4294967295, xD = Array.prototype, TD = Object.prototype, I1 = TD.hasOwnProperty, Kd = De ? De.iterator : void 0, RD = Math.max, Yd = Math.min, Ah = /* @__PURE__ */ function(e) {
  return function(t, n, r) {
    if (r == null) {
      var i = se(n), s = i && ve(n), o = s && s.length && Lu(n, s);
      (o ? o.length : i) || (r = n, n = t, t = this);
    }
    return e(t, n, r);
  };
}(fb);
p.after = ce.after;
p.ary = ce.ary;
p.assign = N.assign;
p.assignIn = N.assignIn;
p.assignInWith = N.assignInWith;
p.assignWith = N.assignWith;
p.at = N.at;
p.before = ce.before;
p.bind = ce.bind;
p.bindAll = H.bindAll;
p.bindKey = ce.bindKey;
p.castArray = P.castArray;
p.chain = xn.chain;
p.chunk = x.chunk;
p.compact = x.compact;
p.concat = x.concat;
p.cond = H.cond;
p.conforms = H.conforms;
p.constant = H.constant;
p.countBy = K.countBy;
p.create = N.create;
p.curry = ce.curry;
p.curryRight = ce.curryRight;
p.debounce = ce.debounce;
p.defaults = N.defaults;
p.defaultsDeep = N.defaultsDeep;
p.defer = ce.defer;
p.delay = ce.delay;
p.difference = x.difference;
p.differenceBy = x.differenceBy;
p.differenceWith = x.differenceWith;
p.drop = x.drop;
p.dropRight = x.dropRight;
p.dropRightWhile = x.dropRightWhile;
p.dropWhile = x.dropWhile;
p.fill = x.fill;
p.filter = K.filter;
p.flatMap = K.flatMap;
p.flatMapDeep = K.flatMapDeep;
p.flatMapDepth = K.flatMapDepth;
p.flatten = x.flatten;
p.flattenDeep = x.flattenDeep;
p.flattenDepth = x.flattenDepth;
p.flip = ce.flip;
p.flow = H.flow;
p.flowRight = H.flowRight;
p.fromPairs = x.fromPairs;
p.functions = N.functions;
p.functionsIn = N.functionsIn;
p.groupBy = K.groupBy;
p.initial = x.initial;
p.intersection = x.intersection;
p.intersectionBy = x.intersectionBy;
p.intersectionWith = x.intersectionWith;
p.invert = N.invert;
p.invertBy = N.invertBy;
p.invokeMap = K.invokeMap;
p.iteratee = H.iteratee;
p.keyBy = K.keyBy;
p.keys = ve;
p.keysIn = N.keysIn;
p.map = K.map;
p.mapKeys = N.mapKeys;
p.mapValues = N.mapValues;
p.matches = H.matches;
p.matchesProperty = H.matchesProperty;
p.memoize = ce.memoize;
p.merge = N.merge;
p.mergeWith = N.mergeWith;
p.method = H.method;
p.methodOf = H.methodOf;
p.mixin = Ah;
p.negate = xo;
p.nthArg = H.nthArg;
p.omit = N.omit;
p.omitBy = N.omitBy;
p.once = ce.once;
p.orderBy = K.orderBy;
p.over = H.over;
p.overArgs = ce.overArgs;
p.overEvery = H.overEvery;
p.overSome = H.overSome;
p.partial = ce.partial;
p.partialRight = ce.partialRight;
p.partition = K.partition;
p.pick = N.pick;
p.pickBy = N.pickBy;
p.property = H.property;
p.propertyOf = H.propertyOf;
p.pull = x.pull;
p.pullAll = x.pullAll;
p.pullAllBy = x.pullAllBy;
p.pullAllWith = x.pullAllWith;
p.pullAt = x.pullAt;
p.range = H.range;
p.rangeRight = H.rangeRight;
p.rearg = ce.rearg;
p.reject = K.reject;
p.remove = x.remove;
p.rest = ce.rest;
p.reverse = x.reverse;
p.sampleSize = K.sampleSize;
p.set = N.set;
p.setWith = N.setWith;
p.shuffle = K.shuffle;
p.slice = x.slice;
p.sortBy = K.sortBy;
p.sortedUniq = x.sortedUniq;
p.sortedUniqBy = x.sortedUniqBy;
p.split = q.split;
p.spread = ce.spread;
p.tail = x.tail;
p.take = x.take;
p.takeRight = x.takeRight;
p.takeRightWhile = x.takeRightWhile;
p.takeWhile = x.takeWhile;
p.tap = xn.tap;
p.throttle = ce.throttle;
p.thru = Po;
p.toArray = P.toArray;
p.toPairs = N.toPairs;
p.toPairsIn = N.toPairsIn;
p.toPath = H.toPath;
p.toPlainObject = P.toPlainObject;
p.transform = N.transform;
p.unary = ce.unary;
p.union = x.union;
p.unionBy = x.unionBy;
p.unionWith = x.unionWith;
p.uniq = x.uniq;
p.uniqBy = x.uniqBy;
p.uniqWith = x.uniqWith;
p.unset = N.unset;
p.unzip = x.unzip;
p.unzipWith = x.unzipWith;
p.update = N.update;
p.updateWith = N.updateWith;
p.values = N.values;
p.valuesIn = N.valuesIn;
p.without = x.without;
p.words = q.words;
p.wrap = ce.wrap;
p.xor = x.xor;
p.xorBy = x.xorBy;
p.xorWith = x.xorWith;
p.zip = x.zip;
p.zipObject = x.zipObject;
p.zipObjectDeep = x.zipObjectDeep;
p.zipWith = x.zipWith;
p.entries = N.toPairs;
p.entriesIn = N.toPairsIn;
p.extend = N.assignIn;
p.extendWith = N.assignInWith;
Ah(p, p);
p.add = Xe.add;
p.attempt = H.attempt;
p.camelCase = q.camelCase;
p.capitalize = q.capitalize;
p.ceil = Xe.ceil;
p.clamp = wh.clamp;
p.clone = P.clone;
p.cloneDeep = P.cloneDeep;
p.cloneDeepWith = P.cloneDeepWith;
p.cloneWith = P.cloneWith;
p.conformsTo = P.conformsTo;
p.deburr = q.deburr;
p.defaultTo = H.defaultTo;
p.divide = Xe.divide;
p.endsWith = q.endsWith;
p.eq = P.eq;
p.escape = q.escape;
p.escapeRegExp = q.escapeRegExp;
p.every = K.every;
p.find = K.find;
p.findIndex = x.findIndex;
p.findKey = N.findKey;
p.findLast = K.findLast;
p.findLastIndex = x.findLastIndex;
p.findLastKey = N.findLastKey;
p.floor = Xe.floor;
p.forEach = K.forEach;
p.forEachRight = K.forEachRight;
p.forIn = N.forIn;
p.forInRight = N.forInRight;
p.forOwn = N.forOwn;
p.forOwnRight = N.forOwnRight;
p.get = N.get;
p.gt = P.gt;
p.gte = P.gte;
p.has = N.has;
p.hasIn = N.hasIn;
p.head = x.head;
p.identity = He;
p.includes = K.includes;
p.indexOf = x.indexOf;
p.inRange = wh.inRange;
p.invoke = N.invoke;
p.isArguments = P.isArguments;
p.isArray = M;
p.isArrayBuffer = P.isArrayBuffer;
p.isArrayLike = P.isArrayLike;
p.isArrayLikeObject = P.isArrayLikeObject;
p.isBoolean = P.isBoolean;
p.isBuffer = P.isBuffer;
p.isDate = P.isDate;
p.isElement = P.isElement;
p.isEmpty = P.isEmpty;
p.isEqual = P.isEqual;
p.isEqualWith = P.isEqualWith;
p.isError = P.isError;
p.isFinite = P.isFinite;
p.isFunction = P.isFunction;
p.isInteger = P.isInteger;
p.isLength = P.isLength;
p.isMap = P.isMap;
p.isMatch = P.isMatch;
p.isMatchWith = P.isMatchWith;
p.isNaN = P.isNaN;
p.isNative = P.isNative;
p.isNil = P.isNil;
p.isNull = P.isNull;
p.isNumber = P.isNumber;
p.isObject = se;
p.isObjectLike = P.isObjectLike;
p.isPlainObject = P.isPlainObject;
p.isRegExp = P.isRegExp;
p.isSafeInteger = P.isSafeInteger;
p.isSet = P.isSet;
p.isString = P.isString;
p.isSymbol = P.isSymbol;
p.isTypedArray = P.isTypedArray;
p.isUndefined = P.isUndefined;
p.isWeakMap = P.isWeakMap;
p.isWeakSet = P.isWeakSet;
p.join = x.join;
p.kebabCase = q.kebabCase;
p.last = At;
p.lastIndexOf = x.lastIndexOf;
p.lowerCase = q.lowerCase;
p.lowerFirst = q.lowerFirst;
p.lt = P.lt;
p.lte = P.lte;
p.max = Xe.max;
p.maxBy = Xe.maxBy;
p.mean = Xe.mean;
p.meanBy = Xe.meanBy;
p.min = Xe.min;
p.minBy = Xe.minBy;
p.stubArray = H.stubArray;
p.stubFalse = H.stubFalse;
p.stubObject = H.stubObject;
p.stubString = H.stubString;
p.stubTrue = H.stubTrue;
p.multiply = Xe.multiply;
p.nth = x.nth;
p.noop = H.noop;
p.now = hD.now;
p.pad = q.pad;
p.padEnd = q.padEnd;
p.padStart = q.padStart;
p.parseInt = q.parseInt;
p.random = wh.random;
p.reduce = K.reduce;
p.reduceRight = K.reduceRight;
p.repeat = q.repeat;
p.replace = q.replace;
p.result = N.result;
p.round = Xe.round;
p.sample = K.sample;
p.size = K.size;
p.snakeCase = q.snakeCase;
p.some = K.some;
p.sortedIndex = x.sortedIndex;
p.sortedIndexBy = x.sortedIndexBy;
p.sortedIndexOf = x.sortedIndexOf;
p.sortedLastIndex = x.sortedLastIndex;
p.sortedLastIndexBy = x.sortedLastIndexBy;
p.sortedLastIndexOf = x.sortedLastIndexOf;
p.startCase = q.startCase;
p.startsWith = q.startsWith;
p.subtract = Xe.subtract;
p.sum = Xe.sum;
p.sumBy = Xe.sumBy;
p.template = q.template;
p.times = H.times;
p.toFinite = P.toFinite;
p.toInteger = I;
p.toLength = P.toLength;
p.toLower = q.toLower;
p.toNumber = P.toNumber;
p.toSafeInteger = P.toSafeInteger;
p.toString = P.toString;
p.toUpper = q.toUpper;
p.trim = q.trim;
p.trimEnd = q.trimEnd;
p.trimStart = q.trimStart;
p.truncate = q.truncate;
p.unescape = q.unescape;
p.uniqueId = H.uniqueId;
p.upperCase = q.upperCase;
p.upperFirst = q.upperFirst;
p.each = K.forEach;
p.eachRight = K.forEachRight;
p.first = x.head;
Ah(p, function() {
  var e = {};
  return En(p, function(t, n) {
    I1.call(p.prototype, n) || (e[n] = t);
  }), e;
}(), { chain: !1 });
p.VERSION = AD;
(p.templateSettings = q.templateSettings).imports._ = p;
Ut(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(e) {
  p[e].placeholder = p;
});
Ut(["drop", "take"], function(e, t) {
  C.prototype[e] = function(n) {
    n = n === void 0 ? 1 : RD(I(n), 0);
    var r = this.__filtered__ && !t ? new C(this) : this.clone();
    return r.__filtered__ ? r.__takeCount__ = Yd(n, r.__takeCount__) : r.__views__.push({
      size: Yd(n, M1),
      type: e + (r.__dir__ < 0 ? "Right" : "")
    }), r;
  }, C.prototype[e + "Right"] = function(n) {
    return this.reverse()[e](n).reverse();
  };
});
Ut(["filter", "map", "takeWhile"], function(e, t) {
  var n = t + 1, r = n == ED || n == SD;
  C.prototype[e] = function(i) {
    var s = this.clone();
    return s.__iteratees__.push({
      iteratee: $(i),
      type: n
    }), s.__filtered__ = s.__filtered__ || r, s;
  };
});
Ut(["head", "last"], function(e, t) {
  var n = "take" + (t ? "Right" : "");
  C.prototype[e] = function() {
    return this[n](1).value()[0];
  };
});
Ut(["initial", "tail"], function(e, t) {
  var n = "drop" + (t ? "" : "Right");
  C.prototype[e] = function() {
    return this.__filtered__ ? new C(this) : this[n](1);
  };
});
C.prototype.compact = function() {
  return this.filter(He);
};
C.prototype.find = function(e) {
  return this.filter(e).head();
};
C.prototype.findLast = function(e) {
  return this.reverse().find(e);
};
C.prototype.invokeMap = D(function(e, t) {
  return typeof e == "function" ? new C(this) : this.map(function(n) {
    return So(n, e, t);
  });
});
C.prototype.reject = function(e) {
  return this.filter(xo($(e)));
};
C.prototype.slice = function(e, t) {
  e = I(e);
  var n = this;
  return n.__filtered__ && (e > 0 || t < 0) ? new C(n) : (e < 0 ? n = n.takeRight(-e) : e && (n = n.drop(e)), t !== void 0 && (t = I(t), n = t < 0 ? n.dropRight(-t) : n.take(t - e)), n);
};
C.prototype.takeRightWhile = function(e) {
  return this.reverse().takeWhile(e).reverse();
};
C.prototype.toArray = function() {
  return this.take(M1);
};
En(C.prototype, function(e, t) {
  var n = /^(?:filter|find|map|reject)|While$/.test(t), r = /^(?:head|last)$/.test(t), i = p[r ? "take" + (t == "last" ? "Right" : "") : t], s = r || /^find/.test(t);
  i && (p.prototype[t] = function() {
    var o = this.__wrapped__, a = r ? [1] : arguments, u = o instanceof C, f = a[0], c = u || M(o), l = function(y) {
      var b = i.apply(p, _r([y], a));
      return r && h ? b[0] : b;
    };
    c && n && typeof f == "function" && f.length != 1 && (u = c = !1);
    var h = this.__chain__, d = !!this.__actions__.length, _ = s && !h, v = u && !d;
    if (!s && c) {
      o = v ? o : new C(this);
      var g = e.apply(o, a);
      return g.__actions__.push({ func: Po, args: [l], thisArg: void 0 }), new jt(g, h);
    }
    return _ && v ? e.apply(this, a) : (g = this.thru(l), _ ? r ? g.value()[0] : g.value() : g);
  });
});
Ut(["pop", "push", "shift", "sort", "splice", "unshift"], function(e) {
  var t = xD[e], n = /^(?:push|sort|unshift)$/.test(e) ? "tap" : "thru", r = /^(?:pop|shift)$/.test(e);
  p.prototype[e] = function() {
    var i = arguments;
    if (r && !this.__chain__) {
      var s = this.value();
      return t.apply(M(s) ? s : [], i);
    }
    return this[n](function(o) {
      return t.apply(M(o) ? o : [], i);
    });
  };
});
En(C.prototype, function(e, t) {
  var n = p[t];
  if (n) {
    var r = n.name + "";
    I1.call(wi, r) || (wi[r] = []), wi[r].push({ name: t, func: n });
  }
});
wi[yu(void 0, OD).name] = [{
  name: "wrapper",
  func: void 0
}];
C.prototype.clone = pD;
C.prototype.reverse = dD;
C.prototype.value = wD;
p.prototype.at = xn.at;
p.prototype.chain = xn.wrapperChain;
p.prototype.commit = xn.commit;
p.prototype.next = xn.next;
p.prototype.plant = xn.plant;
p.prototype.reverse = xn.reverse;
p.prototype.toJSON = p.prototype.valueOf = p.prototype.value = xn.value;
p.prototype.first = p.prototype.head;
Kd && (p.prototype[Kd] = xn.toIterator);
/**
 * @license
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="es" -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
const P5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: Cv,
  after: Fv,
  ary: wl,
  assign: tg,
  assignIn: lc,
  assignInWith: Vs,
  assignWith: ng,
  at: ig,
  attempt: Tl,
  before: Rl,
  bind: mo,
  bindAll: og,
  bindKey: Su,
  camelCase: Tg,
  capitalize: Pl,
  castArray: Rg,
  ceil: Pg,
  chain: Cl,
  chunk: Ng,
  clamp: $g,
  clone: Vg,
  cloneDeep: Ru,
  cloneDeepWith: Wg,
  cloneWith: kg,
  commit: gc,
  compact: qg,
  concat: Gg,
  cond: Qg,
  conforms: t0,
  conformsTo: n0,
  constant: _u,
  countBy: s0,
  create: o0,
  curry: Mu,
  curryRight: Iu,
  debounce: Kl,
  deburr: Ml,
  default: p,
  defaultTo: a0,
  defaults: f0,
  defaultsDeep: l0,
  defer: p0,
  delay: d0,
  difference: _0,
  differenceBy: v0,
  differenceWith: g0,
  divide: y0,
  drop: b0,
  dropRight: m0,
  dropRightWhile: w0,
  dropWhile: A0,
  each: mc,
  eachRight: wc,
  endsWith: S0,
  entries: Ac,
  entriesIn: Oc,
  eq: Vt,
  escape: Ql,
  escapeRegExp: P0,
  every: $0,
  extend: lc,
  extendWith: Vs,
  fill: M0,
  filter: D0,
  find: L0,
  findIndex: th,
  findKey: F0,
  findLast: B0,
  findLastIndex: nh,
  findLastKey: z0,
  first: Ec,
  flatMap: V0,
  flatMapDeep: W0,
  flatMapDepth: k0,
  flatten: xl,
  flattenDeep: q0,
  flattenDepth: G0,
  flip: H0,
  floor: K0,
  flow: X0,
  flowRight: J0,
  forEach: mc,
  forEachRight: wc,
  forIn: Z0,
  forInRight: Q0,
  forOwn: ey,
  forOwnRight: ty,
  fromPairs: ny,
  functions: ry,
  functionsIn: iy,
  get: Au,
  groupBy: sy,
  gt: oy,
  gte: ay,
  has: uy,
  hasIn: Nu,
  head: Ec,
  identity: He,
  inRange: fy,
  includes: cy,
  indexOf: ly,
  initial: hy,
  intersection: py,
  intersectionBy: dy,
  intersectionWith: _y,
  invert: gy,
  invertBy: by,
  invoke: wy,
  invokeMap: Ay,
  isArguments: ar,
  isArray: M,
  isArrayBuffer: Oy,
  isArrayLike: Ke,
  isArrayLikeObject: fe,
  isBoolean: Ey,
  isBuffer: Vn,
  isDate: Sy,
  isElement: xy,
  isEmpty: Ty,
  isEqual: Oi,
  isEqualWith: Ry,
  isError: Eu,
  isFinite: Py,
  isFunction: wn,
  isInteger: ah,
  isLength: go,
  isMap: Bl,
  isMatch: Ny,
  isMatchWith: $y,
  isNaN: My,
  isNative: Iy,
  isNil: Dy,
  isNull: Cy,
  isNumber: uh,
  isObject: se,
  isObjectLike: oe,
  isPlainObject: Ji,
  isRegExp: Fu,
  isSafeInteger: Ly,
  isSet: zl,
  isString: Eo,
  isSymbol: it,
  isTypedArray: Jr,
  isUndefined: jy,
  isWeakMap: Fy,
  isWeakSet: By,
  iteratee: zy,
  join: Uy,
  kebabCase: Vy,
  keyBy: Wy,
  keys: ve,
  keysIn: Ye,
  last: At,
  lastIndexOf: ky,
  lodash: p,
  lowerCase: qy,
  lowerFirst: Gy,
  lt: Hy,
  lte: Ky,
  map: Oo,
  mapKeys: Yy,
  mapValues: Xy,
  matches: Jy,
  matchesProperty: Zy,
  max: Qy,
  maxBy: eb,
  mean: nb,
  meanBy: rb,
  memoize: bo,
  merge: ib,
  mergeWith: Xl,
  method: sb,
  methodOf: ob,
  min: ab,
  minBy: ub,
  mixin: fb,
  multiply: cb,
  negate: xo,
  next: Sc,
  noop: du,
  now: Ts,
  nth: hb,
  nthArg: pb,
  omit: db,
  omitBy: vb,
  once: gb,
  orderBy: mb,
  over: wb,
  overArgs: Ab,
  overEvery: Ob,
  overSome: Eb,
  pad: $b,
  padEnd: Mb,
  padStart: Ib,
  parseInt: Db,
  partial: Ro,
  partialRight: zu,
  partition: Cb,
  pick: Lb,
  pickBy: ph,
  plant: Pc,
  property: Gl,
  propertyOf: jb,
  pull: Fb,
  pullAll: vh,
  pullAllBy: Bb,
  pullAllWith: zb,
  pullAt: Vb,
  random: Wb,
  range: qb,
  rangeRight: Gb,
  rearg: Hb,
  reduce: Yb,
  reduceRight: Xb,
  reject: Jb,
  remove: Zb,
  repeat: Qb,
  replace: em,
  rest: tm,
  result: nm,
  reverse: Ca,
  round: rm,
  sample: sm,
  sampleSize: om,
  set: am,
  setWith: um,
  shuffle: fm,
  size: cm,
  slice: lm,
  snakeCase: hm,
  some: pm,
  sortBy: dm,
  sortedIndex: _m,
  sortedIndexBy: vm,
  sortedIndexOf: gm,
  sortedLastIndex: ym,
  sortedLastIndexBy: bm,
  sortedLastIndexOf: mm,
  sortedUniq: Am,
  sortedUniqBy: Om,
  split: Em,
  spread: Sm,
  startCase: xm,
  startsWith: Tm,
  stubArray: Tu,
  stubFalse: bu,
  stubObject: Rm,
  stubString: Pm,
  stubTrue: Nm,
  subtract: $m,
  sum: Mm,
  sumBy: Im,
  tail: Dm,
  take: Cm,
  takeRight: Lm,
  takeRightWhile: jm,
  takeWhile: Fm,
  tap: Bm,
  template: Vm,
  templateSettings: La,
  throttle: Wm,
  thru: Po,
  times: km,
  toArray: lh,
  toFinite: pn,
  toInteger: I,
  toIterator: Nc,
  toJSON: ws,
  toLength: eh,
  toLower: Gm,
  toNumber: dt,
  toPairs: Ac,
  toPairsIn: Oc,
  toPath: Hm,
  toPlainObject: Yl,
  toSafeInteger: Km,
  toString: k,
  toUpper: Ym,
  transform: Xm,
  trim: Qm,
  trimEnd: e1,
  trimStart: t1,
  truncate: n1,
  unary: r1,
  unescape: s1,
  union: o1,
  unionBy: a1,
  unionWith: u1,
  uniq: f1,
  uniqBy: c1,
  uniqWith: l1,
  uniqueId: h1,
  unset: p1,
  unzip: Wu,
  unzipWith: bh,
  update: _1,
  updateWith: v1,
  upperCase: g1,
  upperFirst: xu,
  value: ws,
  valueOf: ws,
  values: ei,
  valuesIn: y1,
  without: b1,
  words: Il,
  wrap: m1,
  wrapperAt: w1,
  wrapperChain: A1,
  wrapperCommit: gc,
  wrapperLodash: p,
  wrapperNext: Sc,
  wrapperPlant: Pc,
  wrapperReverse: O1,
  wrapperToIterator: Nc,
  wrapperValue: ws,
  xor: E1,
  xorBy: S1,
  xorWith: x1,
  zip: T1,
  zipObject: P1,
  zipObjectDeep: N1,
  zipWith: $1
}, Symbol.toStringTag, { value: "Module" }));
function D1(e) {
  return [parseInt(e.substr(1, 2), 16), parseInt(e.substr(3, 2), 16), parseInt(e.substr(5, 2), 16)];
}
function Ff(e) {
  const t = Math.round(e).toString(16);
  return t.length === 1 ? `0${t}` : t;
}
function C1(e) {
  return `#${Ff(e[0])}${Ff(e[1])}${Ff(e[2])}`;
}
const PD = /rgba?\(([\s.,0-9]+)\)/;
function ND() {
  const e = document.createElement("i");
  return e.title = "Web Colour Picker", e.style.display = "none", document.body.appendChild(e), e;
}
let sa;
function L1(e) {
  if (e[0] === "#" && e.length === 7)
    return e;
  sa || (sa = ND()), sa.style.color = e;
  let t = document.defaultView.getComputedStyle(sa, "").getPropertyValue("color");
  const r = PD.exec(t)[1].split(/\s*,\s*/).map((i) => Number(i));
  return t = C1(r), t;
}
function Bf(e, t, n, r) {
  return e[r] + (t[r] - e[r]) * n;
}
function $D(e, t) {
  const n = isNaN(Number(t)) || t < 0 ? 0 : t > 1 ? 1 : Number(t), r = e.length - 1, i = Math.floor(r * n), s = r * n - i, o = e[i], a = i === r ? o : e[i + 1];
  return C1([Bf(o, a, s, 0), Bf(o, a, s, 1), Bf(o, a, s, 2)]);
}
function MD(e) {
  const n = (typeof e == "string" ? e.split("-") : e).map((r) => D1(r.indexOf("#") === -1 ? L1(r) : r));
  return (r) => $D(n, r);
}
const ID = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i, DD = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i, CD = /[\d.]+:(#[^\s]+|[^)]+\))/gi;
function LD(e) {
  return /^[r,R,L,l]{1}[\s]*\(/.test(e);
}
function jD(e) {
  if (LD(e)) {
    let t = "", n;
    if (e[0] === "l") {
      const i = ID.exec(e), s = +i[1] + 90;
      n = i[2], t = `linear-gradient(${s}deg, `;
    } else e[0] === "r" && (t = "radial-gradient(", n = DD.exec(e)[4]);
    const r = n.match(CD);
    return r.forEach((i, s) => {
      const o = i.split(":");
      t += `${o[1]} ${Number(o[0]) * 100}%`, s !== r.length - 1 && (t += ", ");
    }), t += ")", t;
  }
  return e;
}
var Xd = typeof Float32Array < "u" ? Float32Array : Array;
function ku(e, t, n) {
  var r = t[0], i = t[1], s = t[2], o = t[3], a = t[4], u = t[5], f = t[6], c = t[7], l = t[8], h = n[0], d = n[1], _ = n[2], v = n[3], g = n[4], y = n[5], b = n[6], w = n[7], m = n[8];
  return e[0] = h * r + d * o + _ * f, e[1] = h * i + d * a + _ * c, e[2] = h * s + d * u + _ * l, e[3] = v * r + g * o + y * f, e[4] = v * i + g * a + y * c, e[5] = v * s + g * u + y * l, e[6] = b * r + w * o + m * f, e[7] = b * i + w * a + m * c, e[8] = b * s + w * u + m * l, e;
}
function FD(e, t) {
  return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = t[0], e[7] = t[1], e[8] = 1, e;
}
function BD(e, t) {
  var n = Math.sin(t), r = Math.cos(t);
  return e[0] = r, e[1] = n, e[2] = 0, e[3] = -n, e[4] = r, e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
}
function zD(e, t) {
  return e[0] = t[0], e[1] = 0, e[2] = 0, e[3] = 0, e[4] = t[1], e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
}
function UD() {
  var e = new Xd(2);
  return Xd != Float32Array && (e[0] = 0, e[1] = 0), e;
}
function VD(e, t) {
  var n = e[0], r = e[1], i = t[0], s = t[1];
  return Math.abs(Math.atan2(r * i - n * s, n * i + r * s));
}
(function() {
  var e = UD();
  return function(t, n, r, i, s, o) {
    var a, u;
    for (n || (n = 2), r || (r = 0), i ? u = Math.min(i * n + r, t.length) : u = t.length, a = r; a < u; a += n)
      e[0] = t[a], e[1] = t[a + 1], s(e, e, o), t[a] = e[0], t[a + 1] = e[1];
    return t;
  };
})();
function WD(e, t, n) {
  const r = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return FD(r, n), ku(e, r, t);
}
function kD(e, t, n) {
  const r = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return BD(r, n), ku(e, r, t);
}
function qD(e, t, n) {
  const r = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return zD(r, n), ku(e, r, t);
}
function GD(e, t, n) {
  return ku(e, n, t);
}
function HD(e, t) {
  const n = e ? [].concat(e) : [1, 0, 0, 0, 1, 0, 0, 0, 1];
  for (let r = 0, i = t.length; r < i; r++) {
    const s = t[r];
    switch (s[0]) {
      case "t":
        WD(n, n, [s[1], s[2]]);
        break;
      case "s":
        qD(n, n, [s[1], s[2]]);
        break;
      case "r":
        kD(n, n, s[1]);
        break;
      case "m":
        GD(n, n, s[1]);
        break;
    }
  }
  return n;
}
function j1(e, t) {
  return e[0] * t[1] - t[0] * e[1];
}
function KD(e, t, n) {
  const r = VD(e, t), i = j1(e, t) >= 0;
  return n ? i ? Math.PI * 2 - r : r : i ? r : Math.PI * 2 - r;
}
function YD(e, t, n) {
  return n ? (e[0] = t[1], e[1] = -1 * t[0]) : (e[0] = -1 * t[1], e[1] = t[0]), e;
}
function ts(e) {
  return e.map((t) => Array.isArray(t) ? [].concat(t) : t);
}
function XD(e, t) {
  if (t === "off") return ts(e);
  const n = typeof t == "number" && t >= 1 ? 10 ** t : 1;
  return e.map((r) => {
    const i = r.slice(1).map(Number).map((s) => t ? Math.round(s * n) / n : Math.round(s));
    return [r[0]].concat(i);
  });
}
function JD(e, t = "off") {
  return XD(e, t).map((n) => n[0] + n.slice(1).join(" ")).join("");
}
const F1 = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
};
function ZD(e, t, n) {
  if (e[n].length > 7) {
    e[n].shift();
    const r = e[n];
    let i = n;
    for (; r.length; )
      t[n] = "A", e.splice(i += 1, 0, ["C"].concat(r.splice(0, 6)));
    e.splice(n, 1);
  }
}
const Rs = {
  a: 7,
  c: 6,
  h: 1,
  l: 2,
  m: 2,
  r: 4,
  q: 4,
  s: 4,
  t: 2,
  v: 1,
  z: 0
};
function B1(e) {
  return Array.isArray(e) && e.every((t) => {
    const n = t[0].toLowerCase();
    return Rs[n] === t.length - 1 && "achlmqstvz".includes(n);
  });
}
function z1(e) {
  return B1(e) && // @ts-ignore -- `isPathArray` also checks if it's `Array`
  e.every(([t]) => t === t.toUpperCase());
}
function U1(e) {
  return z1(e) && e.every(([t]) => "ACLMQZ".includes(t));
}
function Jd(e) {
  let t = e.pathValue[e.segmentStart], n = t.toLowerCase();
  const { data: r } = e;
  for (; r.length >= Rs[n] && (n === "m" && r.length > 2 ? (e.segments.push([t].concat(r.splice(0, 2))), n = "l", t = t === "m" ? "l" : "L") : e.segments.push([t].concat(r.splice(0, Rs[n]))), !!Rs[n]); )
    ;
}
function QD(e) {
  const { index: t, pathValue: n } = e, r = n.charCodeAt(t);
  if (r === 48) {
    e.param = 0, e.index += 1;
    return;
  }
  if (r === 49) {
    e.param = 1, e.index += 1;
    return;
  }
  e.err = `[path-util]: invalid Arc flag "${n[t]}", expecting 0 or 1 at index ${t}`;
}
function eC(e) {
  return e >= 48 && e <= 57 || e === 43 || e === 45 || e === 46;
}
function hi(e) {
  return e >= 48 && e <= 57;
}
function tC(e) {
  const { max: t, pathValue: n, index: r } = e;
  let i = r, s = !1, o = !1, a = !1, u = !1, f;
  if (i >= t) {
    e.err = `[path-util]: Invalid path value at index ${i}, "pathValue" is missing param`;
    return;
  }
  if (f = n.charCodeAt(i), (f === 43 || f === 45) && (i += 1, f = n.charCodeAt(i)), !hi(f) && f !== 46) {
    e.err = `[path-util]: Invalid path value at index ${i}, "${n[i]}" is not a number`;
    return;
  }
  if (f !== 46) {
    if (s = f === 48, i += 1, f = n.charCodeAt(i), s && i < t && f && hi(f)) {
      e.err = `[path-util]: Invalid path value at index ${r}, "${n[r]}" illegal number`;
      return;
    }
    for (; i < t && hi(n.charCodeAt(i)); )
      i += 1, o = !0;
    f = n.charCodeAt(i);
  }
  if (f === 46) {
    for (u = !0, i += 1; hi(n.charCodeAt(i)); )
      i += 1, a = !0;
    f = n.charCodeAt(i);
  }
  if (f === 101 || f === 69) {
    if (u && !o && !a) {
      e.err = `[path-util]: Invalid path value at index ${i}, "${n[i]}" invalid float exponent`;
      return;
    }
    if (i += 1, f = n.charCodeAt(i), (f === 43 || f === 45) && (i += 1), i < t && hi(n.charCodeAt(i)))
      for (; i < t && hi(n.charCodeAt(i)); )
        i += 1;
    else {
      e.err = `[path-util]: Invalid path value at index ${i}, "${n[i]}" invalid integer exponent`;
      return;
    }
  }
  e.index = i, e.param = +e.pathValue.slice(r, i);
}
function nC(e) {
  const t = [
    5760,
    6158,
    8192,
    8193,
    8194,
    8195,
    8196,
    8197,
    8198,
    8199,
    8200,
    8201,
    8202,
    8239,
    8287,
    12288,
    65279
  ];
  return e === 10 || e === 13 || e === 8232 || e === 8233 || // Line terminators
  // White spaces
  e === 32 || e === 9 || e === 11 || e === 12 || e === 160 || e >= 5760 && t.includes(e);
}
function Ea(e) {
  const { pathValue: t, max: n } = e;
  for (; e.index < n && nC(t.charCodeAt(e.index)); )
    e.index += 1;
}
function rC(e) {
  switch (e | 32) {
    case 109:
    case 122:
    case 108:
    case 104:
    case 118:
    case 99:
    case 115:
    case 113:
    case 116:
    case 97:
      return !0;
    default:
      return !1;
  }
}
function iC(e) {
  return (e | 32) === 97;
}
function sC(e) {
  const { max: t, pathValue: n, index: r } = e, i = n.charCodeAt(r), s = Rs[n[r].toLowerCase()];
  if (e.segmentStart = r, !rC(i)) {
    e.err = `[path-util]: Invalid path value "${n[r]}" is not a path command`;
    return;
  }
  if (e.index += 1, Ea(e), e.data = [], !s) {
    Jd(e);
    return;
  }
  for (; ; ) {
    for (let o = s; o > 0; o -= 1) {
      if (iC(i) && (o === 3 || o === 4) ? QD(e) : tC(e), e.err.length)
        return;
      e.data.push(e.param), Ea(e), e.index < t && n.charCodeAt(e.index) === 44 && (e.index += 1, Ea(e));
    }
    if (e.index >= e.max || !eC(n.charCodeAt(e.index)))
      break;
  }
  Jd(e);
}
class oC {
  pathValue;
  segments;
  max;
  index;
  param;
  segmentStart;
  data;
  err;
  constructor(t) {
    this.pathValue = t, this.segments = [], this.max = t.length, this.index = 0, this.param = 0, this.segmentStart = 0, this.data = [], this.err = "";
  }
}
function Oh(e) {
  if (B1(e))
    return ts(e);
  const t = new oC(e);
  for (Ea(t); t.index < t.max && !t.err.length; )
    sC(t);
  return t.err ? t.err : t.segments;
}
function V1(e) {
  if (z1(e))
    return ts(e);
  const t = Oh(e);
  let n = 0, r = 0, i = 0, s = 0;
  return t.map((o) => {
    const a = o.slice(1).map(Number), [u] = o, f = u.toUpperCase();
    if (u === "M")
      return [n, r] = a, i = n, s = r, ["M", n, r];
    let c;
    if (u !== f)
      switch (f) {
        case "A":
          c = [
            f,
            a[0],
            a[1],
            a[2],
            a[3],
            a[4],
            a[5] + n,
            a[6] + r
          ];
          break;
        case "V":
          c = [f, a[0] + r];
          break;
        case "H":
          c = [f, a[0] + n];
          break;
        default: {
          const h = a.map((d, _) => d + (_ % 2 ? r : n));
          c = [f].concat(h);
        }
      }
    else
      c = [f].concat(a);
    const l = c.length;
    switch (f) {
      case "Z":
        n = i, r = s;
        break;
      case "H":
        [, n] = c;
        break;
      case "V":
        [, r] = c;
        break;
      default:
        n = c[l - 2], r = c[l - 1], f === "M" && (i = n, s = r);
    }
    return c;
  });
}
function aC(e, t) {
  const [n] = e, { x1: r, y1: i, x2: s, y2: o } = t, a = e.slice(1).map(Number);
  let u = e;
  if ("TQ".includes(n) || (t.qx = null, t.qy = null), n === "H")
    u = ["L", e[1], i];
  else if (n === "V")
    u = ["L", r, e[1]];
  else if (n === "S") {
    const f = r * 2 - s, c = i * 2 - o;
    t.x1 = f, t.y1 = c, u = ["C", f, c].concat(a);
  } else if (n === "T") {
    const f = r * 2 - t.qx, c = i * 2 - t.qy;
    t.qx = f, t.qy = c, u = ["Q", f, c].concat(a);
  } else if (n === "Q") {
    const [f, c] = a;
    t.qx = f, t.qy = c;
  }
  return u;
}
function qu(e) {
  if (U1(e))
    return ts(e);
  const t = V1(e), n = { ...F1 }, r = t.length;
  let i = "";
  for (let s = 0; s < r; s += 1) {
    [i] = t[s], t[s] = aC(t[s], n);
    const o = t[s], a = o.length;
    n.x1 = +o[a - 2], n.y1 = +o[a - 1], n.x2 = +o[a - 4] || n.x1, n.y2 = +o[a - 3] || n.y1;
  }
  return t;
}
function uC(e) {
  return U1(e) && e.every(([t]) => "MC".includes(t));
}
function oa(e, t, n) {
  const r = e * Math.cos(n) - t * Math.sin(n), i = e * Math.sin(n) + t * Math.cos(n);
  return { x: r, y: i };
}
function W1(e, t, n, r, i, s, o, a, u, f) {
  let c = e, l = t, h = n, d = r, _ = a, v = u;
  const g = Math.PI * 120 / 180, y = Math.PI / 180 * (+i || 0);
  let b = [], w, m, A, S, R;
  if (f)
    [m, A, S, R] = f;
  else {
    w = oa(c, l, -y), c = w.x, l = w.y, w = oa(_, v, -y), _ = w.x, v = w.y;
    const be = (c - _) / 2, Gt = (l - v) / 2;
    let Sr = be * be / (h * h) + Gt * Gt / (d * d);
    Sr > 1 && (Sr = Math.sqrt(Sr), h *= Sr, d *= Sr);
    const Nf = h * h, $f = d * d, zp = (s === o ? -1 : 1) * Math.sqrt(Math.abs((Nf * $f - Nf * Gt * Gt - $f * be * be) / (Nf * Gt * Gt + $f * be * be)));
    S = zp * h * Gt / d + (c + _) / 2, R = zp * -d * be / h + (l + v) / 2, m = Math.asin(((l - R) / d * 10 ** 9 >> 0) / 10 ** 9), A = Math.asin(((v - R) / d * 10 ** 9 >> 0) / 10 ** 9), m = c < S ? Math.PI - m : m, A = _ < S ? Math.PI - A : A, m < 0 && (m = Math.PI * 2 + m), A < 0 && (A = Math.PI * 2 + A), o && m > A && (m -= Math.PI * 2), !o && A > m && (A -= Math.PI * 2);
  }
  let B = A - m;
  if (Math.abs(B) > g) {
    const be = A, Gt = _, Sr = v;
    A = m + g * (o && A > m ? 1 : -1), _ = S + h * Math.cos(A), v = R + d * Math.sin(A), b = W1(_, v, h, d, i, 0, o, Gt, Sr, [A, be, S, R]);
  }
  B = A - m;
  const Nn = Math.cos(m), Qo = Math.sin(m), on = Math.cos(A), ea = Math.sin(A), hs = Math.tan(B / 4), ta = 4 / 3 * h * hs, na = 4 / 3 * d * hs, $n = [c, l], Mn = [c + ta * Qo, l - na * Nn], ps = [_ + ta * ea, v - na * on], ds = [_, v];
  if (Mn[0] = 2 * $n[0] - Mn[0], Mn[1] = 2 * $n[1] - Mn[1], f)
    return Mn.concat(ps, ds, b);
  b = Mn.concat(ps, ds, b);
  const Pf = [];
  for (let be = 0, Gt = b.length; be < Gt; be += 1)
    Pf[be] = be % 2 ? oa(b[be - 1], b[be], y).y : oa(b[be], b[be + 1], y).x;
  return Pf;
}
function fC(e, t, n, r, i, s) {
  const o = 0.3333333333333333, a = 2 / 3;
  return [
    o * e + a * n,
    // cpx1
    o * t + a * r,
    // cpy1
    o * i + a * n,
    // cpx2
    o * s + a * r,
    // cpy2
    i,
    s
    // x,y
  ];
}
function Pt(e, t, n) {
  const r = e[0], i = e[1], s = t[0], o = t[1];
  return [r + (s - r) * n, i + (o - i) * n];
}
function ns(e, t) {
  return Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1]));
}
function Gs(e, t, n, r, i) {
  const s = ns([e, t], [n, r]);
  let o = { x: 0, y: 0 };
  if (typeof i == "number")
    if (i <= 0)
      o = { x: e, y: t };
    else if (i >= s)
      o = { x: n, y: r };
    else {
      const [a, u] = Pt([e, t], [n, r], i / s);
      o = { x: a, y: u };
    }
  return {
    length: s,
    point: o,
    min: {
      x: Math.min(e, n),
      y: Math.min(t, r)
    },
    max: {
      x: Math.max(e, n),
      y: Math.max(t, r)
    }
  };
}
function Zd(e, t, n, r) {
  const s = [e, t], o = [n, r], a = Pt(s, o, 0.5), u = Pt(o, a, 0.5), f = Pt(a, u, 0.5), c = Pt(u, f, 0.5), l = Pt(f, c, 0.5), h = Gs(s[0], s[1], a[0], a[1], f[0]).point, d = Gs(l[0], l[1], c[0], c[1], u[0]).point;
  return [h.x, h.y, d.x, d.y, n, r];
}
function cC(e, t) {
  const [n] = e, r = e.slice(1).map(Number), [i, s] = r;
  let o;
  const { x1: a, y1: u, x: f, y: c } = t;
  switch ("TQ".includes(n) || (t.qx = null, t.qy = null), n) {
    case "M":
      return t.x = i, t.y = s, e;
    case "A":
      return o = [a, u].concat(r), ["C"].concat(
        W1(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9])
      );
    case "Q":
      return t.qx = i, t.qy = s, o = [a, u].concat(r), ["C"].concat(fC(o[0], o[1], o[2], o[3], o[4], o[5]));
    case "L":
      return ["C"].concat(Zd(a, u, i, s));
    case "Z":
      return a === f && u === c ? ["C", a, u, f, c, f, c] : ["C"].concat(Zd(a, u, f, c));
  }
  return e;
}
function k1(e, t = !1) {
  if (uC(e)) {
    const c = ts(e);
    return t ? [c, []] : c;
  }
  const n = qu(e), r = { ...F1 }, i = [];
  let s = "", o = n.length, a, u;
  const f = [];
  for (let c = 0; c < o; c += 1) {
    n[c] && ([s] = n[c]), i[c] = s;
    const l = cC(n[c], r);
    n[c] = l, ZD(n, i, c), o = n.length, s === "Z" && f.push(c), a = n[c], u = a.length, r.x1 = +a[u - 2], r.y1 = +a[u - 1], r.x2 = +a[u - 4] || r.x1, r.y2 = +a[u - 3] || r.y1;
  }
  return t ? [n, f] : n;
}
function lC(e) {
  const t = e.slice(1).map(
    (n, r, i) => (
      // @ts-ignore
      r ? i[r - 1].slice(-2).concat(n.slice(1)) : e[0].slice(1).concat(n.slice(1))
    )
  ).map((n) => n.map((r, i) => n[n.length - i - 2 * (1 - i % 2)])).reverse();
  return [["M"].concat(t[0].slice(0, 2))].concat(
    t.map((n) => ["C"].concat(n.slice(2)))
  );
}
function Qd(e, t) {
  const { x: n, y: r } = e, { x: i, y: s } = t, o = n * i + r * s, a = Math.sqrt((n ** 2 + r ** 2) * (i ** 2 + s ** 2));
  return (n * s - r * i < 0 ? -1 : 1) * Math.acos(o / a);
}
function hC(e, t, n, r, i, s, o, a, u, f) {
  const { abs: c, sin: l, cos: h, sqrt: d, PI: _ } = Math;
  let v = c(n), g = c(r);
  const b = (i % 360 + 360) % 360 * (_ / 180);
  if (e === a && t === u)
    return { x: e, y: t };
  if (v === 0 || g === 0)
    return Gs(e, t, a, u, f).point;
  const w = (e - a) / 2, m = (t - u) / 2, A = {
    x: h(b) * w + l(b) * m,
    y: -l(b) * w + h(b) * m
  }, S = A.x ** 2 / v ** 2 + A.y ** 2 / g ** 2;
  S > 1 && (v *= d(S), g *= d(S));
  const R = v ** 2 * g ** 2 - v ** 2 * A.y ** 2 - g ** 2 * A.x ** 2, B = v ** 2 * A.y ** 2 + g ** 2 * A.x ** 2;
  let Nn = R / B;
  Nn = Nn < 0 ? 0 : Nn;
  const Qo = (s !== o ? 1 : -1) * d(Nn), on = {
    x: Qo * (v * A.y / g),
    y: Qo * (-(g * A.x) / v)
  }, ea = {
    x: h(b) * on.x - l(b) * on.y + (e + a) / 2,
    y: l(b) * on.x + h(b) * on.y + (t + u) / 2
  }, hs = {
    x: (A.x - on.x) / v,
    y: (A.y - on.y) / g
  }, ta = Qd({ x: 1, y: 0 }, hs), na = {
    x: (-A.x - on.x) / v,
    y: (-A.y - on.y) / g
  };
  let $n = Qd(hs, na);
  !o && $n > 0 ? $n -= 2 * _ : o && $n < 0 && ($n += 2 * _), $n %= 2 * _;
  const Mn = ta + $n * f, ps = v * h(Mn), ds = g * l(Mn);
  return {
    x: h(b) * ps - l(b) * ds + ea.x,
    y: l(b) * ps + h(b) * ds + ea.y
  };
}
function pC(e, t, n, r, i, s, o, a, u, f) {
  const c = typeof f == "number";
  let l = e, h = t, d = 0, _ = [l, h, d], v = [l, h], g = 0, y = { x: 0, y: 0 }, b = [{ x: l, y: h }];
  c && f <= 0 && (y = { x: l, y: h });
  const w = 100;
  for (let m = 0; m <= w; m += 1) {
    if (g = m / w, { x: l, y: h } = hC(e, t, n, r, i, s, o, a, u, g), b = b.concat({ x: l, y: h }), d += ns(v, [l, h]), v = [l, h], c && d >= f && f > _[2]) {
      const A = (d - f) / (d - _[2]);
      y = {
        x: v[0] * (1 - A) + _[0] * A,
        y: v[1] * (1 - A) + _[1] * A
      };
    }
    _ = [l, h, d];
  }
  return c && f >= d && (y = { x: a, y: u }), {
    length: d,
    point: y,
    min: {
      x: Math.min.apply(
        null,
        b.map((m) => m.x)
      ),
      y: Math.min.apply(
        null,
        b.map((m) => m.y)
      )
    },
    max: {
      x: Math.max.apply(
        null,
        b.map((m) => m.x)
      ),
      y: Math.max.apply(
        null,
        b.map((m) => m.y)
      )
    }
  };
}
function dC(e, t, n, r, i, s, o, a, u) {
  const f = 1 - u;
  return {
    x: f ** 3 * e + 3 * f ** 2 * u * n + 3 * f * u ** 2 * i + u ** 3 * o,
    y: f ** 3 * t + 3 * f ** 2 * u * r + 3 * f * u ** 2 * s + u ** 3 * a
  };
}
function q1(e, t, n, r, i, s, o, a, u) {
  const f = typeof u == "number";
  let c = e, l = t, h = 0, d = [c, l, h], _ = [c, l], v = 0, g = { x: 0, y: 0 }, y = [{ x: c, y: l }];
  f && u <= 0 && (g = { x: c, y: l });
  const b = 30;
  for (let w = 0; w <= b; w += 1) {
    if (v = w / b, { x: c, y: l } = dC(e, t, n, r, i, s, o, a, v), y = y.concat({ x: c, y: l }), h += ns(_, [c, l]), _ = [c, l], f && h >= u && u > d[2]) {
      const m = (h - u) / (h - d[2]);
      g = {
        x: _[0] * (1 - m) + d[0] * m,
        y: _[1] * (1 - m) + d[1] * m
      };
    }
    d = [c, l, h];
  }
  return f && u >= h && (g = { x: o, y: a }), {
    length: h,
    point: g,
    min: {
      x: Math.min.apply(
        null,
        y.map((w) => w.x)
      ),
      y: Math.min.apply(
        null,
        y.map((w) => w.y)
      )
    },
    max: {
      x: Math.max.apply(
        null,
        y.map((w) => w.x)
      ),
      y: Math.max.apply(
        null,
        y.map((w) => w.y)
      )
    }
  };
}
function _C(e, t, n, r, i, s, o) {
  const a = 1 - o;
  return {
    x: a ** 2 * e + 2 * a * o * n + o ** 2 * i,
    y: a ** 2 * t + 2 * a * o * r + o ** 2 * s
  };
}
function vC(e, t, n, r, i, s, o) {
  const a = typeof o == "number";
  let u = e, f = t, c = 0, l = [u, f, c], h = [u, f], d = 0, _ = { x: 0, y: 0 }, v = [{ x: u, y: f }];
  a && o <= 0 && (_ = { x: u, y: f });
  const g = 30;
  for (let y = 0; y <= g; y += 1) {
    if (d = y / g, { x: u, y: f } = _C(e, t, n, r, i, s, d), v = v.concat({ x: u, y: f }), c += ns(h, [u, f]), h = [u, f], a && c >= o && o > l[2]) {
      const b = (c - o) / (c - l[2]);
      _ = {
        x: h[0] * (1 - b) + l[0] * b,
        y: h[1] * (1 - b) + l[1] * b
      };
    }
    l = [u, f, c];
  }
  return a && o >= c && (_ = { x: i, y: s }), {
    length: c,
    point: _,
    min: {
      x: Math.min.apply(
        null,
        v.map((y) => y.x)
      ),
      y: Math.min.apply(
        null,
        v.map((y) => y.y)
      )
    },
    max: {
      x: Math.max.apply(
        null,
        v.map((y) => y.x)
      ),
      y: Math.max.apply(
        null,
        v.map((y) => y.y)
      )
    }
  };
}
function Gu(e, t) {
  const n = qu(e), r = typeof t == "number";
  let i, s = [], o, a = 0, u = 0, f = 0, c = 0, l, h = [], d = [], _ = 0, v = { x: 0, y: 0 }, g = v, y = v, b = v, w = 0;
  for (let m = 0, A = n.length; m < A; m += 1)
    l = n[m], [o] = l, i = o === "M", s = i ? s : [a, u].concat(l.slice(1)), i ? ([, f, c] = l, v = { x: f, y: c }, g = v, _ = 0, r && t < 1e-3 && (b = v)) : o === "L" ? { length: _, min: v, max: g, point: y } = Gs(s[0], s[1], s[2], s[3], (t || 0) - w) : o === "A" ? { length: _, min: v, max: g, point: y } = pC(
      s[0],
      s[1],
      s[2],
      s[3],
      s[4],
      s[5],
      s[6],
      s[7],
      s[8],
      (t || 0) - w
    ) : o === "C" ? { length: _, min: v, max: g, point: y } = q1(
      s[0],
      s[1],
      s[2],
      s[3],
      s[4],
      s[5],
      s[6],
      s[7],
      (t || 0) - w
    ) : o === "Q" ? { length: _, min: v, max: g, point: y } = vC(
      s[0],
      s[1],
      s[2],
      s[3],
      s[4],
      s[5],
      (t || 0) - w
    ) : o === "Z" && (s = [a, u, f, c], { length: _, min: v, max: g, point: y } = Gs(s[0], s[1], s[2], s[3], (t || 0) - w)), r && w < t && w + _ >= t && (b = y), d.push(g), h.push(v), w += _, [a, u] = o !== "Z" ? l.slice(-2) : [f, c];
  return r && t >= w && (b = { x: a, y: u }), {
    length: w,
    point: b,
    min: {
      x: Math.min.apply(
        null,
        h.map((m) => m.x)
      ),
      y: Math.min.apply(
        null,
        h.map((m) => m.y)
      )
    },
    max: {
      x: Math.max.apply(
        null,
        d.map((m) => m.x)
      ),
      y: Math.max.apply(
        null,
        d.map((m) => m.y)
      )
    }
  };
}
function gC(e) {
  if (!e)
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      x2: 0,
      y2: 0,
      cx: 0,
      cy: 0,
      cz: 0
    };
  const {
    min: { x: t, y: n },
    max: { x: r, y: i }
  } = Gu(e), s = r - t, o = i - n;
  return {
    width: s,
    height: o,
    x: t,
    y: n,
    x2: r,
    y2: i,
    cx: t + s / 2,
    cy: n + o / 2,
    // an estimted guess
    cz: Math.max(s, o) + Math.min(s, o) / 2
  };
}
function Ps(e) {
  return Gu(e).length;
}
function yC(e) {
  if (!e)
    return {
      length: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      x2: 0,
      y2: 0,
      cx: 0,
      cy: 0,
      cz: 0
    };
  const {
    length: t,
    min: { x: n, y: r },
    max: { x: i, y: s }
  } = Gu(e), o = i - n, a = s - r;
  return {
    length: t,
    width: o,
    height: a,
    x: n,
    y: r,
    x2: i,
    y2: s,
    cx: n + o / 2,
    cy: r + a / 2,
    // an estimted guess
    cz: Math.max(o, a) + Math.min(o, a) / 2
  };
}
function bC(e) {
  const t = e.length, n = t - 1;
  return e.map(
    (r, i) => e.map((s, o) => {
      let a = i + o, u;
      return o === 0 || e[a] && e[a][0] === "M" ? (u = e[a], ["M"].concat(u.slice(-2))) : (a >= t && (a -= n), e[a]);
    })
  );
}
function mC(e, t) {
  const n = e.length - 1, r = [];
  let i = 0, s = 0;
  const o = bC(e);
  return o.forEach((a, u) => {
    e.slice(1).forEach((f, c) => {
      s += ns(e[(u + c) % n].slice(-2), t[c % n].slice(-2));
    }), r[u] = s, s = 0;
  }), i = r.indexOf(Math.min.apply(null, r)), o[i];
}
function wC(e, t, n, r, i, s, o, a) {
  return 3 * ((a - t) * (n + i) - (o - e) * (r + s) + r * (e - i) - n * (t - s) + a * (i + e / 3) - o * (s + t / 3)) / 20;
}
function G1(e) {
  let t = 0, n = 0, r = 0;
  return k1(e).map((i) => {
    switch (i[0]) {
      case "M":
        return [, t, n] = i, 0;
      default:
        const [s, o, a, u, f, c] = i.slice(1);
        return r = wC(t, n, s, o, a, u, f, c), [t, n] = i.slice(-2), r;
    }
  }).reduce((i, s) => i + s, 0);
}
function AC(e) {
  return G1(e) >= 0;
}
function Sa(e, t) {
  return Gu(e, t).point;
}
function OC(e, t) {
  const n = Oh(e);
  if (typeof n == "string")
    throw TypeError(n);
  let r = n.slice(), i = Ps(r), s = r.length - 1, o = 0, a = 0, u = n[0];
  const [f, c] = u.slice(-2), l = { x: f, y: c };
  if (s <= 0 || !t || !Number.isFinite(t))
    return {
      segment: u,
      index: 0,
      length: a,
      point: l,
      lengthAtSegment: o
    };
  if (t >= i)
    return r = n.slice(0, -1), o = Ps(r), a = i - o, {
      segment: n[s],
      index: s,
      length: a,
      lengthAtSegment: o
    };
  const h = [];
  for (; s > 0; )
    u = r[s], r = r.slice(0, -1), o = Ps(r), a = i - o, i = o, h.push({
      segment: u,
      index: s,
      length: a,
      lengthAtSegment: o
    }), s -= 1;
  return h.find(({ lengthAtSegment: d }) => d <= t);
}
function EC(e, t) {
  const n = Oh(e), r = qu(n), i = Ps(n), s = (m) => {
    const A = m.x - t.x, S = m.y - t.y;
    return A * A + S * S;
  };
  let o = 8, a, u = 0, f = { x: 0, y: 0 }, c = 0, l = 1 / 0;
  for (let m = 0; m <= i; m += o)
    a = Sa(r, m), u = s(a), u < l && (f = a, c = m, l = u);
  o /= 2;
  let h, d, _ = 0, v = 0, g = 0, y = 0;
  for (; o > 0.5; )
    _ = c - o, h = Sa(r, _), g = s(h), v = c + o, d = Sa(r, v), y = s(d), _ >= 0 && g < l ? (f = h, c = _, l = g) : v <= i && y < l ? (f = d, c = v, l = y) : o /= 2;
  const b = OC(n, c), w = Math.sqrt(l);
  return { closest: f, distance: w, segment: b };
}
function SC(e, t) {
  const { distance: n } = EC(e, t);
  return Math.abs(n) < 1e-3;
}
function xC(e, t = 0.5) {
  const n = e.slice(0, 2), r = e.slice(2, 4), i = e.slice(4, 6), s = e.slice(6, 8), o = Pt(n, r, t), a = Pt(r, i, t), u = Pt(i, s, t), f = Pt(o, a, t), c = Pt(a, u, t), l = Pt(f, c, t);
  return [
    // @ts-ignore
    ["C"].concat(o, f, l),
    // @ts-ignore
    ["C"].concat(c, u, s)
  ];
}
function e_(e) {
  return e.map((t, n, r) => {
    const i = n && r[n - 1].slice(-2).concat(t.slice(1)), s = n ? q1(
      i[0],
      i[1],
      i[2],
      i[3],
      i[4],
      i[5],
      i[6],
      i[7],
      i[8]
    ).length : 0;
    let o;
    return n ? o = s ? xC(i) : [t, t] : o = [t], {
      s: t,
      ss: o,
      l: s
    };
  });
}
function H1(e, t, n) {
  const r = e_(e), i = e_(t), s = r.length, o = i.length, a = r.filter((g) => g.l).length, u = i.filter((g) => g.l).length, f = r.filter((g) => g.l).reduce((g, { l: y }) => g + y, 0) / a || 0, c = i.filter((g) => g.l).reduce((g, { l: y }) => g + y, 0) / u || 0, l = n || Math.max(s, o), h = [f, c], d = [l - s, l - o];
  let _ = 0;
  const v = [r, i].map(
    (g, y) => (
      // @ts-ignore
      g.l === l ? g.map((b) => b.s) : g.map((b, w) => (_ = w && d[y] && b.l >= h[y], d[y] -= _ ? 1 : 0, _ ? b.ss : [b.s])).flat()
    )
  );
  return v[0].length === v[1].length ? v : H1(v[0], v[1], l);
}
const N5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angleTo: KD,
  clonePath: ts,
  direction: j1,
  distanceSquareRoot: ns,
  equalizeSegments: H1,
  getDrawDirection: AC,
  getPathArea: G1,
  getPathBBox: gC,
  getPathBBoxTotalLength: yC,
  getPointAtLength: Sa,
  getRotatedCurve: mC,
  getTotalLength: Ps,
  gradient: MD,
  isPointInStroke: SC,
  normalizePath: qu,
  path2Absolute: V1,
  path2Curve: k1,
  path2String: JD,
  reverseCurve: lC,
  rgb2arr: D1,
  toCSSGradient: jD,
  toRGB: L1,
  transform: HD,
  vertical: YD
}, Symbol.toStringTag, { value: "Module" }));
var Hu = Symbol.for("immer-nothing"), Ei = Symbol.for("immer-draftable"), V = Symbol.for("immer-state"), K1 = process.env.NODE_ENV !== "production" ? [
  // All error codes, starting by 0:
  function(e) {
    return `The plugin for '${e}' has not been loaded into Immer. To enable the plugin, import and call \`enable${e}()\` when initializing your application.`;
  },
  function(e) {
    return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${e}'`;
  },
  "This object has been frozen and should not be mutated",
  function(e) {
    return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + e;
  },
  "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
  "Immer forbids circular references",
  "The first or second argument to `produce` must be a function",
  "The third argument to `produce` must be a function or undefined",
  "First argument to `createDraft` must be a plain object, an array, or an immerable object",
  "First argument to `finishDraft` must be a draft returned by `createDraft`",
  function(e) {
    return `'current' expects a draft, got: ${e}`;
  },
  "Object.defineProperty() cannot be used on an Immer draft",
  "Object.setPrototypeOf() cannot be used on an Immer draft",
  "Immer only supports deleting array indices",
  "Immer only supports setting array indices and the 'length' property",
  function(e) {
    return `'original' expects a draft, got: ${e}`;
  }
  // Note: if more errors are added, the errorOffset in Patches.ts should be increased
  // See Patches.ts for additional errors
] : [];
function le(e, ...t) {
  if (process.env.NODE_ENV !== "production") {
    const n = K1[e], r = typeof n == "function" ? n.apply(null, t) : n;
    throw new Error(`[Immer] ${r}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var jr = Object.getPrototypeOf;
function Wn(e) {
  return !!e && !!e[V];
}
function tn(e) {
  return e ? Y1(e) || Array.isArray(e) || !!e[Ei] || !!e.constructor?.[Ei] || No(e) || $o(e) : !1;
}
var TC = Object.prototype.constructor.toString();
function Y1(e) {
  if (!e || typeof e != "object")
    return !1;
  const t = jr(e);
  if (t === null)
    return !0;
  const n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return n === Object ? !0 : typeof n == "function" && Function.toString.call(n) === TC;
}
function RC(e) {
  return Wn(e) || le(15, e), e[V].base_;
}
function $i(e, t) {
  Fr(e) === 0 ? Reflect.ownKeys(e).forEach((n) => {
    t(n, e[n], e);
  }) : e.forEach((n, r) => t(r, n, e));
}
function Fr(e) {
  const t = e[V];
  return t ? t.type_ : Array.isArray(e) ? 1 : No(e) ? 2 : $o(e) ? 3 : 0;
}
function Hs(e, t) {
  return Fr(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function zf(e, t) {
  return Fr(e) === 2 ? e.get(t) : e[t];
}
function X1(e, t, n) {
  const r = Fr(e);
  r === 2 ? e.set(t, n) : r === 3 ? e.add(n) : e[t] = n;
}
function PC(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function No(e) {
  return e instanceof Map;
}
function $o(e) {
  return e instanceof Set;
}
function me(e) {
  return e.copy_ || e.base_;
}
function $c(e, t) {
  if (No(e))
    return new Map(e);
  if ($o(e))
    return new Set(e);
  if (Array.isArray(e))
    return Array.prototype.slice.call(e);
  const n = Y1(e);
  if (t === !0 || t === "class_only" && !n) {
    const r = Object.getOwnPropertyDescriptors(e);
    delete r[V];
    let i = Reflect.ownKeys(r);
    for (let s = 0; s < i.length; s++) {
      const o = i[s], a = r[o];
      a.writable === !1 && (a.writable = !0, a.configurable = !0), (a.get || a.set) && (r[o] = {
        configurable: !0,
        writable: !0,
        // could live with !!desc.set as well here...
        enumerable: a.enumerable,
        value: e[o]
      });
    }
    return Object.create(jr(e), r);
  } else {
    const r = jr(e);
    if (r !== null && n)
      return { ...e };
    const i = Object.create(r);
    return Object.assign(i, e);
  }
}
function Ku(e, t = !1) {
  return Yu(e) || Wn(e) || !tn(e) || (Fr(e) > 1 && (e.set = e.add = e.clear = e.delete = NC), Object.freeze(e), t && Object.entries(e).forEach(([n, r]) => Ku(r, !0))), e;
}
function NC() {
  le(2);
}
function Yu(e) {
  return Object.isFrozen(e);
}
var Mc = {};
function Br(e) {
  const t = Mc[e];
  return t || le(0, e), t;
}
function J1(e, t) {
  Mc[e] || (Mc[e] = t);
}
var Ks;
function ja() {
  return Ks;
}
function $C(e, t) {
  return {
    drafts_: [],
    parent_: e,
    immer_: t,
    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
    canAutoFreeze_: !0,
    unfinalizedDrafts_: 0
  };
}
function t_(e, t) {
  t && (Br("Patches"), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function Ic(e) {
  Dc(e), e.drafts_.forEach(MC), e.drafts_ = null;
}
function Dc(e) {
  e === Ks && (Ks = e.parent_);
}
function n_(e) {
  return Ks = $C(Ks, e);
}
function MC(e) {
  const t = e[V];
  t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function r_(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const n = t.drafts_[0];
  return e !== void 0 && e !== n ? (n[V].modified_ && (Ic(t), le(4)), tn(e) && (e = Fa(t, e), t.parent_ || Ba(t, e)), t.patches_ && Br("Patches").generateReplacementPatches_(
    n[V].base_,
    e,
    t.patches_,
    t.inversePatches_
  )) : e = Fa(t, n, []), Ic(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== Hu ? e : void 0;
}
function Fa(e, t, n) {
  if (Yu(t))
    return t;
  const r = t[V];
  if (!r)
    return $i(
      t,
      (i, s) => i_(e, r, t, i, s, n)
    ), t;
  if (r.scope_ !== e)
    return t;
  if (!r.modified_)
    return Ba(e, r.base_, !0), r.base_;
  if (!r.finalized_) {
    r.finalized_ = !0, r.scope_.unfinalizedDrafts_--;
    const i = r.copy_;
    let s = i, o = !1;
    r.type_ === 3 && (s = new Set(i), i.clear(), o = !0), $i(
      s,
      (a, u) => i_(e, r, i, a, u, n, o)
    ), Ba(e, i, !1), n && e.patches_ && Br("Patches").generatePatches_(
      r,
      n,
      e.patches_,
      e.inversePatches_
    );
  }
  return r.copy_;
}
function i_(e, t, n, r, i, s, o) {
  if (process.env.NODE_ENV !== "production" && i === n && le(5), Wn(i)) {
    const a = s && t && t.type_ !== 3 && // Set objects are atomic since they have no keys.
    !Hs(t.assigned_, r) ? s.concat(r) : void 0, u = Fa(e, i, a);
    if (X1(n, r, u), Wn(u))
      e.canAutoFreeze_ = !1;
    else
      return;
  } else o && n.add(i);
  if (tn(i) && !Yu(i)) {
    if (!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1)
      return;
    Fa(e, i), (!t || !t.scope_.parent_) && typeof r != "symbol" && Object.prototype.propertyIsEnumerable.call(n, r) && Ba(e, i);
  }
}
function Ba(e, t, n = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && Ku(t, n);
}
function IC(e, t) {
  const n = Array.isArray(e), r = {
    type_: n ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: t ? t.scope_ : ja(),
    // True for both shallow and deep changes.
    modified_: !1,
    // Used during finalization.
    finalized_: !1,
    // Track which properties have been assigned (true) or deleted (false).
    assigned_: {},
    // The parent draft state.
    parent_: t,
    // The base state.
    base_: e,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: !1
  };
  let i = r, s = Eh;
  n && (i = [r], s = Ys);
  const { revoke: o, proxy: a } = Proxy.revocable(i, s);
  return r.draft_ = a, r.revoke_ = o, a;
}
var Eh = {
  get(e, t) {
    if (t === V)
      return e;
    const n = me(e);
    if (!Hs(n, t))
      return DC(e, n, t);
    const r = n[t];
    return e.finalized_ || !tn(r) ? r : r === Uf(e.base_, t) ? (Vf(e), e.copy_[t] = Xs(r, e)) : r;
  },
  has(e, t) {
    return t in me(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(me(e));
  },
  set(e, t, n) {
    const r = Z1(me(e), t);
    if (r?.set)
      return r.set.call(e.draft_, n), !0;
    if (!e.modified_) {
      const i = Uf(me(e), t), s = i?.[V];
      if (s && s.base_ === n)
        return e.copy_[t] = n, e.assigned_[t] = !1, !0;
      if (PC(n, i) && (n !== void 0 || Hs(e.base_, t)))
        return !0;
      Vf(e), Cn(e);
    }
    return e.copy_[t] === n && // special case: handle new props with value 'undefined'
    (n !== void 0 || t in e.copy_) || // special case: NaN
    Number.isNaN(n) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = n, e.assigned_[t] = !0), !0;
  },
  deleteProperty(e, t) {
    return Uf(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_[t] = !1, Vf(e), Cn(e)) : delete e.assigned_[t], e.copy_ && delete e.copy_[t], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(e, t) {
    const n = me(e), r = Reflect.getOwnPropertyDescriptor(n, t);
    return r && {
      writable: !0,
      configurable: e.type_ !== 1 || t !== "length",
      enumerable: r.enumerable,
      value: n[t]
    };
  },
  defineProperty() {
    le(11);
  },
  getPrototypeOf(e) {
    return jr(e.base_);
  },
  setPrototypeOf() {
    le(12);
  }
}, Ys = {};
$i(Eh, (e, t) => {
  Ys[e] = function() {
    return arguments[0] = arguments[0][0], t.apply(this, arguments);
  };
});
Ys.deleteProperty = function(e, t) {
  return process.env.NODE_ENV !== "production" && isNaN(parseInt(t)) && le(13), Ys.set.call(this, e, t, void 0);
};
Ys.set = function(e, t, n) {
  return process.env.NODE_ENV !== "production" && t !== "length" && isNaN(parseInt(t)) && le(14), Eh.set.call(this, e[0], t, n, e[0]);
};
function Uf(e, t) {
  const n = e[V];
  return (n ? me(n) : e)[t];
}
function DC(e, t, n) {
  const r = Z1(t, n);
  return r ? "value" in r ? r.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    r.get?.call(e.draft_)
  ) : void 0;
}
function Z1(e, t) {
  if (!(t in e))
    return;
  let n = jr(e);
  for (; n; ) {
    const r = Object.getOwnPropertyDescriptor(n, t);
    if (r)
      return r;
    n = jr(n);
  }
}
function Cn(e) {
  e.modified_ || (e.modified_ = !0, e.parent_ && Cn(e.parent_));
}
function Vf(e) {
  e.copy_ || (e.copy_ = $c(
    e.base_,
    e.scope_.immer_.useStrictShallowCopy_
  ));
}
var Q1 = class {
  constructor(e) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.produce = (t, n, r) => {
      if (typeof t == "function" && typeof n != "function") {
        const s = n;
        n = t;
        const o = this;
        return function(u = s, ...f) {
          return o.produce(u, (c) => n.call(this, c, ...f));
        };
      }
      typeof n != "function" && le(6), r !== void 0 && typeof r != "function" && le(7);
      let i;
      if (tn(t)) {
        const s = n_(this), o = Xs(t, void 0);
        let a = !0;
        try {
          i = n(o), a = !1;
        } finally {
          a ? Ic(s) : Dc(s);
        }
        return t_(s, r), r_(i, s);
      } else if (!t || typeof t != "object") {
        if (i = n(t), i === void 0 && (i = t), i === Hu && (i = void 0), this.autoFreeze_ && Ku(i, !0), r) {
          const s = [], o = [];
          Br("Patches").generateReplacementPatches_(t, i, s, o), r(s, o);
        }
        return i;
      } else
        le(1, t);
    }, this.produceWithPatches = (t, n) => {
      if (typeof t == "function")
        return (o, ...a) => this.produceWithPatches(o, (u) => t(u, ...a));
      let r, i;
      return [this.produce(t, n, (o, a) => {
        r = o, i = a;
      }), r, i];
    }, typeof e?.autoFreeze == "boolean" && this.setAutoFreeze(e.autoFreeze), typeof e?.useStrictShallowCopy == "boolean" && this.setUseStrictShallowCopy(e.useStrictShallowCopy);
  }
  createDraft(e) {
    tn(e) || le(8), Wn(e) && (e = ew(e));
    const t = n_(this), n = Xs(e, void 0);
    return n[V].isManual_ = !0, Dc(t), n;
  }
  finishDraft(e, t) {
    const n = e && e[V];
    (!n || !n.isManual_) && le(9);
    const { scope_: r } = n;
    return t_(r, t), r_(void 0, r);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(e) {
    this.autoFreeze_ = e;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(e) {
    this.useStrictShallowCopy_ = e;
  }
  applyPatches(e, t) {
    let n;
    for (n = t.length - 1; n >= 0; n--) {
      const i = t[n];
      if (i.path.length === 0 && i.op === "replace") {
        e = i.value;
        break;
      }
    }
    n > -1 && (t = t.slice(n + 1));
    const r = Br("Patches").applyPatches_;
    return Wn(e) ? r(e, t) : this.produce(
      e,
      (i) => r(i, t)
    );
  }
};
function Xs(e, t) {
  const n = No(e) ? Br("MapSet").proxyMap_(e, t) : $o(e) ? Br("MapSet").proxySet_(e, t) : IC(e, t);
  return (t ? t.scope_ : ja()).drafts_.push(n), n;
}
function ew(e) {
  return Wn(e) || le(10, e), tw(e);
}
function tw(e) {
  if (!tn(e) || Yu(e))
    return e;
  const t = e[V];
  let n;
  if (t) {
    if (!t.modified_)
      return t.base_;
    t.finalized_ = !0, n = $c(e, t.scope_.immer_.useStrictShallowCopy_);
  } else
    n = $c(e, !0);
  return $i(n, (r, i) => {
    X1(n, r, tw(i));
  }), t && (t.finalized_ = !1), n;
}
function CC() {
  process.env.NODE_ENV !== "production" && K1.push(
    'Sets cannot have "replace" patches.',
    function(h) {
      return "Unsupported patch operation: " + h;
    },
    function(h) {
      return "Cannot apply patch, path doesn't resolve: " + h;
    },
    "Patching reserved attributes like __proto__, prototype and constructor is not allowed"
  );
  const t = "replace", n = "add", r = "remove";
  function i(h, d, _, v) {
    switch (h.type_) {
      case 0:
      case 2:
        return o(
          h,
          d,
          _,
          v
        );
      case 1:
        return s(h, d, _, v);
      case 3:
        return a(
          h,
          d,
          _,
          v
        );
    }
  }
  function s(h, d, _, v) {
    let { base_: g, assigned_: y } = h, b = h.copy_;
    b.length < g.length && ([g, b] = [b, g], [_, v] = [v, _]);
    for (let w = 0; w < g.length; w++)
      if (y[w] && b[w] !== g[w]) {
        const m = d.concat([w]);
        _.push({
          op: t,
          path: m,
          // Need to maybe clone it, as it can in fact be the original value
          // due to the base/copy inversion at the start of this function
          value: l(b[w])
        }), v.push({
          op: t,
          path: m,
          value: l(g[w])
        });
      }
    for (let w = g.length; w < b.length; w++) {
      const m = d.concat([w]);
      _.push({
        op: n,
        path: m,
        // Need to maybe clone it, as it can in fact be the original value
        // due to the base/copy inversion at the start of this function
        value: l(b[w])
      });
    }
    for (let w = b.length - 1; g.length <= w; --w) {
      const m = d.concat([w]);
      v.push({
        op: r,
        path: m
      });
    }
  }
  function o(h, d, _, v) {
    const { base_: g, copy_: y } = h;
    $i(h.assigned_, (b, w) => {
      const m = zf(g, b), A = zf(y, b), S = w ? Hs(g, b) ? t : n : r;
      if (m === A && S === t)
        return;
      const R = d.concat(b);
      _.push(S === r ? { op: S, path: R } : { op: S, path: R, value: A }), v.push(
        S === n ? { op: r, path: R } : S === r ? { op: n, path: R, value: l(m) } : { op: t, path: R, value: l(m) }
      );
    });
  }
  function a(h, d, _, v) {
    let { base_: g, copy_: y } = h, b = 0;
    g.forEach((w) => {
      if (!y.has(w)) {
        const m = d.concat([b]);
        _.push({
          op: r,
          path: m,
          value: w
        }), v.unshift({
          op: n,
          path: m,
          value: w
        });
      }
      b++;
    }), b = 0, y.forEach((w) => {
      if (!g.has(w)) {
        const m = d.concat([b]);
        _.push({
          op: n,
          path: m,
          value: w
        }), v.unshift({
          op: r,
          path: m,
          value: w
        });
      }
      b++;
    });
  }
  function u(h, d, _, v) {
    _.push({
      op: t,
      path: [],
      value: d === Hu ? void 0 : d
    }), v.push({
      op: t,
      path: [],
      value: h
    });
  }
  function f(h, d) {
    return d.forEach((_) => {
      const { path: v, op: g } = _;
      let y = h;
      for (let A = 0; A < v.length - 1; A++) {
        const S = Fr(y);
        let R = v[A];
        typeof R != "string" && typeof R != "number" && (R = "" + R), (S === 0 || S === 1) && (R === "__proto__" || R === "constructor") && le(19), typeof y == "function" && R === "prototype" && le(19), y = zf(y, R), typeof y != "object" && le(18, v.join("/"));
      }
      const b = Fr(y), w = c(_.value), m = v[v.length - 1];
      switch (g) {
        case t:
          switch (b) {
            case 2:
              return y.set(m, w);
            case 3:
              le(16);
            default:
              return y[m] = w;
          }
        case n:
          switch (b) {
            case 1:
              return m === "-" ? y.push(w) : y.splice(m, 0, w);
            case 2:
              return y.set(m, w);
            case 3:
              return y.add(w);
            default:
              return y[m] = w;
          }
        case r:
          switch (b) {
            case 1:
              return y.splice(m, 1);
            case 2:
              return y.delete(m);
            case 3:
              return y.delete(_.value);
            default:
              return delete y[m];
          }
        default:
          le(17, g);
      }
    }), h;
  }
  function c(h) {
    if (!tn(h))
      return h;
    if (Array.isArray(h))
      return h.map(c);
    if (No(h))
      return new Map(
        Array.from(h.entries()).map(([_, v]) => [_, c(v)])
      );
    if ($o(h))
      return new Set(Array.from(h).map(c));
    const d = Object.create(jr(h));
    for (const _ in h)
      d[_] = c(h[_]);
    return Hs(h, Ei) && (d[Ei] = h[Ei]), d;
  }
  function l(h) {
    return Wn(h) ? c(h) : h;
  }
  J1("Patches", {
    applyPatches_: f,
    generatePatches_: i,
    generateReplacementPatches_: u
  });
}
function LC() {
  class e extends Map {
    constructor(u, f) {
      super(), this[V] = {
        type_: 2,
        parent_: f,
        scope_: f ? f.scope_ : ja(),
        modified_: !1,
        finalized_: !1,
        copy_: void 0,
        assigned_: void 0,
        base_: u,
        draft_: this,
        isManual_: !1,
        revoked_: !1
      };
    }
    get size() {
      return me(this[V]).size;
    }
    has(u) {
      return me(this[V]).has(u);
    }
    set(u, f) {
      const c = this[V];
      return o(c), (!me(c).has(u) || me(c).get(u) !== f) && (n(c), Cn(c), c.assigned_.set(u, !0), c.copy_.set(u, f), c.assigned_.set(u, !0)), this;
    }
    delete(u) {
      if (!this.has(u))
        return !1;
      const f = this[V];
      return o(f), n(f), Cn(f), f.base_.has(u) ? f.assigned_.set(u, !1) : f.assigned_.delete(u), f.copy_.delete(u), !0;
    }
    clear() {
      const u = this[V];
      o(u), me(u).size && (n(u), Cn(u), u.assigned_ = /* @__PURE__ */ new Map(), $i(u.base_, (f) => {
        u.assigned_.set(f, !1);
      }), u.copy_.clear());
    }
    forEach(u, f) {
      const c = this[V];
      me(c).forEach((l, h, d) => {
        u.call(f, this.get(h), h, this);
      });
    }
    get(u) {
      const f = this[V];
      o(f);
      const c = me(f).get(u);
      if (f.finalized_ || !tn(c) || c !== f.base_.get(u))
        return c;
      const l = Xs(c, f);
      return n(f), f.copy_.set(u, l), l;
    }
    keys() {
      return me(this[V]).keys();
    }
    values() {
      const u = this.keys();
      return {
        [Symbol.iterator]: () => this.values(),
        next: () => {
          const f = u.next();
          return f.done ? f : {
            done: !1,
            value: this.get(f.value)
          };
        }
      };
    }
    entries() {
      const u = this.keys();
      return {
        [Symbol.iterator]: () => this.entries(),
        next: () => {
          const f = u.next();
          if (f.done)
            return f;
          const c = this.get(f.value);
          return {
            done: !1,
            value: [f.value, c]
          };
        }
      };
    }
    [Symbol.iterator]() {
      return this.entries();
    }
  }
  function t(a, u) {
    return new e(a, u);
  }
  function n(a) {
    a.copy_ || (a.assigned_ = /* @__PURE__ */ new Map(), a.copy_ = new Map(a.base_));
  }
  class r extends Set {
    constructor(u, f) {
      super(), this[V] = {
        type_: 3,
        parent_: f,
        scope_: f ? f.scope_ : ja(),
        modified_: !1,
        finalized_: !1,
        copy_: void 0,
        base_: u,
        draft_: this,
        drafts_: /* @__PURE__ */ new Map(),
        revoked_: !1,
        isManual_: !1
      };
    }
    get size() {
      return me(this[V]).size;
    }
    has(u) {
      const f = this[V];
      return o(f), f.copy_ ? !!(f.copy_.has(u) || f.drafts_.has(u) && f.copy_.has(f.drafts_.get(u))) : f.base_.has(u);
    }
    add(u) {
      const f = this[V];
      return o(f), this.has(u) || (s(f), Cn(f), f.copy_.add(u)), this;
    }
    delete(u) {
      if (!this.has(u))
        return !1;
      const f = this[V];
      return o(f), s(f), Cn(f), f.copy_.delete(u) || (f.drafts_.has(u) ? f.copy_.delete(f.drafts_.get(u)) : (
        /* istanbul ignore next */
        !1
      ));
    }
    clear() {
      const u = this[V];
      o(u), me(u).size && (s(u), Cn(u), u.copy_.clear());
    }
    values() {
      const u = this[V];
      return o(u), s(u), u.copy_.values();
    }
    entries() {
      const u = this[V];
      return o(u), s(u), u.copy_.entries();
    }
    keys() {
      return this.values();
    }
    [Symbol.iterator]() {
      return this.values();
    }
    forEach(u, f) {
      const c = this.values();
      let l = c.next();
      for (; !l.done; )
        u.call(f, l.value, l.value, this), l = c.next();
    }
  }
  function i(a, u) {
    return new r(a, u);
  }
  function s(a) {
    a.copy_ || (a.copy_ = /* @__PURE__ */ new Set(), a.base_.forEach((u) => {
      if (tn(u)) {
        const f = Xs(u, a);
        a.drafts_.set(u, f), a.copy_.add(f);
      } else
        a.copy_.add(u);
    }));
  }
  function o(a) {
    a.revoked_ && le(3, JSON.stringify(me(a)));
  }
  J1("MapSet", { proxyMap_: t, proxySet_: i });
}
var Ot = new Q1(), jC = Ot.produce, FC = Ot.produceWithPatches.bind(
  Ot
), BC = Ot.setAutoFreeze.bind(Ot), zC = Ot.setUseStrictShallowCopy.bind(Ot), UC = Ot.applyPatches.bind(Ot), VC = Ot.createDraft.bind(Ot), WC = Ot.finishDraft.bind(Ot);
function kC(e) {
  return e;
}
function qC(e) {
  return e;
}
const $5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Immer: Q1,
  applyPatches: UC,
  castDraft: kC,
  castImmutable: qC,
  createDraft: VC,
  current: ew,
  enableMapSet: LC,
  enablePatches: CC,
  finishDraft: WC,
  freeze: Ku,
  immerable: Ei,
  isDraft: Wn,
  isDraftable: tn,
  nothing: Hu,
  original: RC,
  produce: jC,
  produceWithPatches: FC,
  setAutoFreeze: BC,
  setUseStrictShallowCopy: zC
}, Symbol.toStringTag, { value: "Module" }));
/**
 * @license
 * MIT License
 * 
 * Copyright (c) 2014-present, Lee Byron and other contributors.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var Mo = "delete", X = 5, ht = 1 << X, ze = ht - 1, j = {};
function Cc() {
  return { value: !1 };
}
function Mt(e) {
  e && (e.value = !0);
}
function Sh() {
}
function Mi(e) {
  return e.size === void 0 && (e.size = e.__iterate(nw)), e.size;
}
function fr(e, t) {
  if (typeof t != "number") {
    var n = t >>> 0;
    if ("" + n !== t || n === 4294967295)
      return NaN;
    t = n;
  }
  return t < 0 ? Mi(e) + t : t;
}
function nw() {
  return !0;
}
function Io(e, t, n) {
  return (e === 0 && !iw(e) || n !== void 0 && e <= -n) && (t === void 0 || n !== void 0 && t >= n);
}
function rs(e, t) {
  return rw(e, t, 0);
}
function Do(e, t) {
  return rw(e, t, t);
}
function rw(e, t, n) {
  return e === void 0 ? n : iw(e) ? t === 1 / 0 ? t : Math.max(0, t + e) | 0 : t === void 0 || t === e ? e : Math.min(t, e) | 0;
}
function iw(e) {
  return e < 0 || e === 0 && 1 / e === -1 / 0;
}
var sw = "@@__IMMUTABLE_ITERABLE__@@";
function st(e) {
  return !!(e && // @ts-expect-error: maybeCollection is typed as `{}`, need to change in 6.0 to `maybeCollection && typeof maybeCollection === 'object' && IS_COLLECTION_SYMBOL in maybeCollection`
  e[sw]);
}
var za = "@@__IMMUTABLE_KEYED__@@";
function Z(e) {
  return !!(e && // @ts-expect-error: maybeKeyed is typed as `{}`, need to change in 6.0 to `maybeKeyed && typeof maybeKeyed === 'object' && IS_KEYED_SYMBOL in maybeKeyed`
  e[za]);
}
var Ua = "@@__IMMUTABLE_INDEXED__@@";
function ot(e) {
  return !!(e && // @ts-expect-error: maybeIndexed is typed as `{}`, need to change in 6.0 to `maybeIndexed && typeof maybeIndexed === 'object' && IS_INDEXED_SYMBOL in maybeIndexed`
  e[Ua]);
}
function Xu(e) {
  return Z(e) || ot(e);
}
var Ee = function(t) {
  return st(t) ? t : Le(t);
}, Wt = /* @__PURE__ */ function(e) {
  function t(n) {
    return Z(n) ? n : mr(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(Ee), ti = /* @__PURE__ */ function(e) {
  function t(n) {
    return ot(n) ? n : qt(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(Ee), is = /* @__PURE__ */ function(e) {
  function t(n) {
    return st(n) && !Xu(n) ? n : as(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(Ee);
Ee.Keyed = Wt;
Ee.Indexed = ti;
Ee.Set = is;
var ow = "@@__IMMUTABLE_SEQ__@@";
function Ju(e) {
  return !!(e && // @ts-expect-error: maybeSeq is typed as `{}`, need to change in 6.0 to `maybeSeq && typeof maybeSeq === 'object' && MAYBE_SEQ_SYMBOL in maybeSeq`
  e[ow]);
}
var aw = "@@__IMMUTABLE_RECORD__@@";
function br(e) {
  return !!(e && // @ts-expect-error: maybeRecord is typed as `{}`, need to change in 6.0 to `maybeRecord && typeof maybeRecord === 'object' && IS_RECORD_SYMBOL in maybeRecord`
  e[aw]);
}
function kt(e) {
  return st(e) || br(e);
}
var cr = "@@__IMMUTABLE_ORDERED__@@";
function Xt(e) {
  return !!(e && // @ts-expect-error: maybeOrdered is typed as `{}`, need to change in 6.0 to `maybeOrdered && typeof maybeOrdered === 'object' && IS_ORDERED_SYMBOL in maybeOrdered`
  e[cr]);
}
var ss = 0, Et = 1, St = 2, Lc = typeof Symbol == "function" && Symbol.iterator, uw = "@@iterator", Zu = Lc || uw, F = function(t) {
  this.next = t;
};
F.prototype.toString = function() {
  return "[Iterator]";
};
F.KEYS = ss;
F.VALUES = Et;
F.ENTRIES = St;
F.prototype.inspect = F.prototype.toSource = function() {
  return this.toString();
};
F.prototype[Zu] = function() {
  return this;
};
function ne(e, t, n, r) {
  var i = e === ss ? t : e === Et ? n : [t, n];
  return r ? r.value = i : r = {
    value: i,
    done: !1
  }, r;
}
function Ce() {
  return { value: void 0, done: !0 };
}
function xh(e) {
  return Array.isArray(e) ? !0 : !!Qu(e);
}
function s_(e) {
  return e && typeof e.next == "function";
}
function jc(e) {
  var t = Qu(e);
  return t && t.call(e);
}
function Qu(e) {
  var t = e && (Lc && e[Lc] || e[uw]);
  if (typeof t == "function")
    return t;
}
function GC(e) {
  var t = Qu(e);
  return t && t === e.entries;
}
function HC(e) {
  var t = Qu(e);
  return t && t === e.keys;
}
var os = Object.prototype.hasOwnProperty;
function Th(e) {
  return Array.isArray(e) || typeof e == "string" ? !0 : e && typeof e == "object" && // @ts-expect-error check that `'length' in value &&`
  Number.isInteger(e.length) && // @ts-expect-error check that `'length' in value &&`
  e.length >= 0 && // @ts-expect-error check that `'length' in value &&`
  (e.length === 0 ? (
    // Only {length: 0} is considered Array-like.
    Object.keys(e).length === 1
  ) : (
    // An object is only Array-like if it has a property where the last value
    // in the array-like may be found (which could be undefined).
    // @ts-expect-error check that `'length' in value &&`
    e.hasOwnProperty(e.length - 1)
  ));
}
var Le = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? Ph() : kt(n) ? n.toSeq() : YC(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toSeq = function() {
    return this;
  }, t.prototype.toString = function() {
    return this.__toString("Seq {", "}");
  }, t.prototype.cacheResult = function() {
    return !this._cache && this.__iterateUncached && (this._cache = this.entrySeq().toArray(), this.size = this._cache.length), this;
  }, t.prototype.__iterate = function(r, i) {
    var s = this._cache;
    if (s) {
      for (var o = s.length, a = 0; a !== o; ) {
        var u = s[i ? o - ++a : a++];
        if (r(u[1], u[0], this) === !1)
          break;
      }
      return a;
    }
    return this.__iterateUncached(r, i);
  }, t.prototype.__iterator = function(r, i) {
    var s = this._cache;
    if (s) {
      var o = s.length, a = 0;
      return new F(function() {
        if (a === o)
          return Ce();
        var u = s[i ? o - ++a : a++];
        return ne(r, u[0], u[1]);
      });
    }
    return this.__iteratorUncached(r, i);
  }, t;
}(Ee), mr = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? Ph().toKeyedSeq() : st(n) ? Z(n) ? n.toSeq() : n.fromEntrySeq() : br(n) ? n.toSeq() : Nh(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toKeyedSeq = function() {
    return this;
  }, t;
}(Le), qt = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? Ph() : st(n) ? Z(n) ? n.entrySeq() : n.toIndexedSeq() : br(n) ? n.toSeq().entrySeq() : fw(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return t(arguments);
  }, t.prototype.toIndexedSeq = function() {
    return this;
  }, t.prototype.toString = function() {
    return this.__toString("Seq [", "]");
  }, t;
}(Le), as = /* @__PURE__ */ function(e) {
  function t(n) {
    return (st(n) && !Xu(n) ? n : qt(n)).toSetSeq();
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return t(arguments);
  }, t.prototype.toSetSeq = function() {
    return this;
  }, t;
}(Le);
Le.isSeq = Ju;
Le.Keyed = mr;
Le.Set = as;
Le.Indexed = qt;
Le.prototype[ow] = !0;
var Ii = /* @__PURE__ */ function(e) {
  function t(n) {
    this._array = n, this.size = n.length;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(r, i) {
    return this.has(r) ? this._array[fr(this, r)] : i;
  }, t.prototype.__iterate = function(r, i) {
    for (var s = this._array, o = s.length, a = 0; a !== o; ) {
      var u = i ? o - ++a : a++;
      if (r(s[u], u, this) === !1)
        break;
    }
    return a;
  }, t.prototype.__iterator = function(r, i) {
    var s = this._array, o = s.length, a = 0;
    return new F(function() {
      if (a === o)
        return Ce();
      var u = i ? o - ++a : a++;
      return ne(r, u, s[u]);
    });
  }, t;
}(qt), Rh = /* @__PURE__ */ function(e) {
  function t(n) {
    var r = Object.keys(n).concat(
      Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(n) : []
    );
    this._object = n, this._keys = r, this.size = r.length;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(r, i) {
    return i !== void 0 && !this.has(r) ? i : this._object[r];
  }, t.prototype.has = function(r) {
    return os.call(this._object, r);
  }, t.prototype.__iterate = function(r, i) {
    for (var s = this._object, o = this._keys, a = o.length, u = 0; u !== a; ) {
      var f = o[i ? a - ++u : u++];
      if (r(s[f], f, this) === !1)
        break;
    }
    return u;
  }, t.prototype.__iterator = function(r, i) {
    var s = this._object, o = this._keys, a = o.length, u = 0;
    return new F(function() {
      if (u === a)
        return Ce();
      var f = o[i ? a - ++u : u++];
      return ne(r, f, s[f]);
    });
  }, t;
}(mr);
Rh.prototype[cr] = !0;
var KC = /* @__PURE__ */ function(e) {
  function t(n) {
    this._collection = n, this.size = n.length || n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.__iterateUncached = function(r, i) {
    if (i)
      return this.cacheResult().__iterate(r, i);
    var s = this._collection, o = jc(s), a = 0;
    if (s_(o))
      for (var u; !(u = o.next()).done && r(u.value, a++, this) !== !1; )
        ;
    return a;
  }, t.prototype.__iteratorUncached = function(r, i) {
    if (i)
      return this.cacheResult().__iterator(r, i);
    var s = this._collection, o = jc(s);
    if (!s_(o))
      return new F(Ce);
    var a = 0;
    return new F(function() {
      var u = o.next();
      return u.done ? u : ne(r, a++, u.value);
    });
  }, t;
}(qt), o_;
function Ph() {
  return o_ || (o_ = new Ii([]));
}
function Nh(e) {
  var t = $h(e);
  if (t)
    return t.fromEntrySeq();
  if (typeof e == "object")
    return new Rh(e);
  throw new TypeError(
    "Expected Array or collection object of [k, v] entries, or keyed object: " + e
  );
}
function fw(e) {
  var t = $h(e);
  if (t)
    return t;
  throw new TypeError(
    "Expected Array or collection object of values: " + e
  );
}
function YC(e) {
  var t = $h(e);
  if (t)
    return GC(e) ? t.fromEntrySeq() : HC(e) ? t.toSetSeq() : t;
  if (typeof e == "object")
    return new Rh(e);
  throw new TypeError(
    "Expected Array or collection object of values, or keyed object: " + e
  );
}
function $h(e) {
  return Th(e) ? new Ii(e) : xh(e) ? new KC(e) : void 0;
}
var cw = "@@__IMMUTABLE_MAP__@@";
function ef(e) {
  return !!(e && // @ts-expect-error: maybeMap is typed as `{}`, need to change in 6.0 to `maybeMap && typeof maybeMap === 'object' && IS_MAP_SYMBOL in maybeMap`
  e[cw]);
}
function Mh(e) {
  return ef(e) && Xt(e);
}
function Fc(e) {
  return !!(e && // @ts-expect-error: maybeValue is typed as `{}`
  typeof e.equals == "function" && // @ts-expect-error: maybeValue is typed as `{}`
  typeof e.hashCode == "function");
}
function Ae(e, t) {
  if (e === t || e !== e && t !== t)
    return !0;
  if (!e || !t)
    return !1;
  if (typeof e.valueOf == "function" && typeof t.valueOf == "function") {
    if (e = e.valueOf(), t = t.valueOf(), e === t || e !== e && t !== t)
      return !0;
    if (!e || !t)
      return !1;
  }
  return !!(Fc(e) && Fc(t) && e.equals(t));
}
var ys = typeof Math.imul == "function" && Math.imul(4294967295, 2) === -2 ? Math.imul : function(t, n) {
  t |= 0, n |= 0;
  var r = t & 65535, i = n & 65535;
  return r * i + ((t >>> 16) * i + r * (n >>> 16) << 16 >>> 0) | 0;
};
function tf(e) {
  return e >>> 1 & 1073741824 | e & 3221225471;
}
var XC = Object.prototype.valueOf;
function Ze(e) {
  if (e == null)
    return a_(e);
  if (typeof e.hashCode == "function")
    return tf(e.hashCode(e));
  var t = nL(e);
  if (t == null)
    return a_(t);
  switch (typeof t) {
    case "boolean":
      return t ? 1108378657 : 1108378656;
    case "number":
      return JC(t);
    case "string":
      return t.length > rL ? ZC(t) : Bc(t);
    case "object":
    case "function":
      return eL(t);
    case "symbol":
      return QC(t);
    default:
      if (typeof t.toString == "function")
        return Bc(t.toString());
      throw new Error("Value type " + typeof t + " cannot be hashed.");
  }
}
function a_(e) {
  return e === null ? 1108378658 : (
    /* undefined */
    1108378659
  );
}
function JC(e) {
  if (e !== e || e === 1 / 0)
    return 0;
  var t = e | 0;
  for (t !== e && (t ^= e * 4294967295); e > 4294967295; )
    e /= 4294967295, t ^= e;
  return tf(t);
}
function ZC(e) {
  var t = qf[e];
  return t === void 0 && (t = Bc(e), kf === iL && (kf = 0, qf = {}), kf++, qf[e] = t), t;
}
function Bc(e) {
  for (var t = 0, n = 0; n < e.length; n++)
    t = 31 * t + e.charCodeAt(n) | 0;
  return tf(t);
}
function QC(e) {
  var t = c_[e];
  return t !== void 0 || (t = lw(), c_[e] = t), t;
}
function eL(e) {
  var t;
  if (zc && (t = Uc.get(e), t !== void 0) || (t = e[Nr], t !== void 0) || !f_ && (t = e.propertyIsEnumerable && e.propertyIsEnumerable[Nr], t !== void 0 || (t = tL(e), t !== void 0)))
    return t;
  if (t = lw(), zc)
    Uc.set(e, t);
  else {
    if (u_ !== void 0 && u_(e) === !1)
      throw new Error("Non-extensible objects are not allowed as keys.");
    if (f_)
      Object.defineProperty(e, Nr, {
        enumerable: !1,
        configurable: !1,
        writable: !1,
        value: t
      });
    else if (e.propertyIsEnumerable !== void 0 && e.propertyIsEnumerable === e.constructor.prototype.propertyIsEnumerable)
      e.propertyIsEnumerable = function() {
        return this.constructor.prototype.propertyIsEnumerable.apply(
          this,
          arguments
        );
      }, e.propertyIsEnumerable[Nr] = t;
    else if (e.nodeType !== void 0)
      e[Nr] = t;
    else
      throw new Error("Unable to set a non-enumerable property on object.");
  }
  return t;
}
var u_ = Object.isExtensible, f_ = function() {
  try {
    return Object.defineProperty({}, "@", {}), !0;
  } catch {
    return !1;
  }
}();
function tL(e) {
  if (e && e.nodeType > 0)
    switch (e.nodeType) {
      case 1:
        return e.uniqueID;
      case 9:
        return e.documentElement && e.documentElement.uniqueID;
    }
}
function nL(e) {
  return e.valueOf !== XC && typeof e.valueOf == "function" ? e.valueOf(e) : e;
}
function lw() {
  var e = ++Wf;
  return Wf & 1073741824 && (Wf = 0), e;
}
var zc = typeof WeakMap == "function", Uc;
zc && (Uc = /* @__PURE__ */ new WeakMap());
var c_ = /* @__PURE__ */ Object.create(null), Wf = 0, Nr = "__immutablehash__";
typeof Symbol == "function" && (Nr = Symbol(Nr));
var rL = 16, iL = 255, kf = 0, qf = {}, nf = /* @__PURE__ */ function(e) {
  function t(n, r) {
    this._iter = n, this._useKeys = r, this.size = n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(r, i) {
    return this._iter.get(r, i);
  }, t.prototype.has = function(r) {
    return this._iter.has(r);
  }, t.prototype.valueSeq = function() {
    return this._iter.valueSeq();
  }, t.prototype.reverse = function() {
    var r = this, i = Ih(this, !0);
    return this._useKeys || (i.valueSeq = function() {
      return r._iter.toSeq().reverse();
    }), i;
  }, t.prototype.map = function(r, i) {
    var s = this, o = vw(this, r, i);
    return this._useKeys || (o.valueSeq = function() {
      return s._iter.toSeq().map(r, i);
    }), o;
  }, t.prototype.__iterate = function(r, i) {
    var s = this;
    return this._iter.__iterate(function(o, a) {
      return r(o, a, s);
    }, i);
  }, t.prototype.__iterator = function(r, i) {
    return this._iter.__iterator(r, i);
  }, t;
}(mr);
nf.prototype[cr] = !0;
var hw = /* @__PURE__ */ function(e) {
  function t(n) {
    this._iter = n, this.size = n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.includes = function(r) {
    return this._iter.includes(r);
  }, t.prototype.__iterate = function(r, i) {
    var s = this, o = 0;
    return i && Mi(this), this._iter.__iterate(
      function(a) {
        return r(a, i ? s.size - ++o : o++, s);
      },
      i
    );
  }, t.prototype.__iterator = function(r, i) {
    var s = this, o = this._iter.__iterator(Et, i), a = 0;
    return i && Mi(this), new F(function() {
      var u = o.next();
      return u.done ? u : ne(
        r,
        i ? s.size - ++a : a++,
        u.value,
        u
      );
    });
  }, t;
}(qt), pw = /* @__PURE__ */ function(e) {
  function t(n) {
    this._iter = n, this.size = n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.has = function(r) {
    return this._iter.includes(r);
  }, t.prototype.__iterate = function(r, i) {
    var s = this;
    return this._iter.__iterate(function(o) {
      return r(o, o, s);
    }, i);
  }, t.prototype.__iterator = function(r, i) {
    var s = this._iter.__iterator(Et, i);
    return new F(function() {
      var o = s.next();
      return o.done ? o : ne(r, o.value, o.value, o);
    });
  }, t;
}(as), dw = /* @__PURE__ */ function(e) {
  function t(n) {
    this._iter = n, this.size = n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.entrySeq = function() {
    return this._iter.toSeq();
  }, t.prototype.__iterate = function(r, i) {
    var s = this;
    return this._iter.__iterate(function(o) {
      if (o) {
        h_(o);
        var a = st(o);
        return r(
          a ? o.get(1) : o[1],
          a ? o.get(0) : o[0],
          s
        );
      }
    }, i);
  }, t.prototype.__iterator = function(r, i) {
    var s = this._iter.__iterator(Et, i);
    return new F(function() {
      for (; ; ) {
        var o = s.next();
        if (o.done)
          return o;
        var a = o.value;
        if (a) {
          h_(a);
          var u = st(a);
          return ne(
            r,
            u ? a.get(0) : a[0],
            u ? a.get(1) : a[1],
            o
          );
        }
      }
    });
  }, t;
}(mr);
hw.prototype.cacheResult = nf.prototype.cacheResult = pw.prototype.cacheResult = dw.prototype.cacheResult = Lh;
function _w(e) {
  var t = Tn(e);
  return t._iter = e, t.size = e.size, t.flip = function() {
    return e;
  }, t.reverse = function() {
    var n = e.reverse.apply(this);
    return n.flip = function() {
      return e.reverse();
    }, n;
  }, t.has = function(n) {
    return e.includes(n);
  }, t.includes = function(n) {
    return e.has(n);
  }, t.cacheResult = Lh, t.__iterateUncached = function(n, r) {
    var i = this;
    return e.__iterate(function(s, o) {
      return n(o, s, i) !== !1;
    }, r);
  }, t.__iteratorUncached = function(n, r) {
    if (n === St) {
      var i = e.__iterator(n, r);
      return new F(function() {
        var s = i.next();
        if (!s.done) {
          var o = s.value[0];
          s.value[0] = s.value[1], s.value[1] = o;
        }
        return s;
      });
    }
    return e.__iterator(
      n === Et ? ss : Et,
      r
    );
  }, t;
}
function vw(e, t, n) {
  var r = Tn(e);
  return r.size = e.size, r.has = function(i) {
    return e.has(i);
  }, r.get = function(i, s) {
    var o = e.get(i, j);
    return o === j ? s : t.call(n, o, i, e);
  }, r.__iterateUncached = function(i, s) {
    var o = this;
    return e.__iterate(
      function(a, u, f) {
        return i(t.call(n, a, u, f), u, o) !== !1;
      },
      s
    );
  }, r.__iteratorUncached = function(i, s) {
    var o = e.__iterator(St, s);
    return new F(function() {
      var a = o.next();
      if (a.done)
        return a;
      var u = a.value, f = u[0];
      return ne(
        i,
        f,
        t.call(n, u[1], f, e),
        a
      );
    });
  }, r;
}
function Ih(e, t) {
  var n = this, r = Tn(e);
  return r._iter = e, r.size = e.size, r.reverse = function() {
    return e;
  }, e.flip && (r.flip = function() {
    var i = _w(e);
    return i.reverse = function() {
      return e.flip();
    }, i;
  }), r.get = function(i, s) {
    return e.get(t ? i : -1 - i, s);
  }, r.has = function(i) {
    return e.has(t ? i : -1 - i);
  }, r.includes = function(i) {
    return e.includes(i);
  }, r.cacheResult = Lh, r.__iterate = function(i, s) {
    var o = this, a = 0;
    return s && Mi(e), e.__iterate(
      function(u, f) {
        return i(u, t ? f : s ? o.size - ++a : a++, o);
      },
      !s
    );
  }, r.__iterator = function(i, s) {
    var o = 0;
    s && Mi(e);
    var a = e.__iterator(St, !s);
    return new F(function() {
      var u = a.next();
      if (u.done)
        return u;
      var f = u.value;
      return ne(
        i,
        t ? f[0] : s ? n.size - ++o : o++,
        f[1],
        u
      );
    });
  }, r;
}
function gw(e, t, n, r) {
  var i = Tn(e);
  return r && (i.has = function(s) {
    var o = e.get(s, j);
    return o !== j && !!t.call(n, o, s, e);
  }, i.get = function(s, o) {
    var a = e.get(s, j);
    return a !== j && t.call(n, a, s, e) ? a : o;
  }), i.__iterateUncached = function(s, o) {
    var a = this, u = 0;
    return e.__iterate(function(f, c, l) {
      if (t.call(n, f, c, l))
        return u++, s(f, r ? c : u - 1, a);
    }, o), u;
  }, i.__iteratorUncached = function(s, o) {
    var a = e.__iterator(St, o), u = 0;
    return new F(function() {
      for (; ; ) {
        var f = a.next();
        if (f.done)
          return f;
        var c = f.value, l = c[0], h = c[1];
        if (t.call(n, h, l, e))
          return ne(s, r ? l : u++, h, f);
      }
    });
  }, i;
}
function sL(e, t, n) {
  var r = ri().asMutable();
  return e.__iterate(function(i, s) {
    r.update(t.call(n, i, s, e), 0, function(o) {
      return o + 1;
    });
  }), r.asImmutable();
}
function oL(e, t, n) {
  var r = Z(e), i = (Xt(e) ? vn() : ri()).asMutable();
  e.__iterate(function(o, a) {
    i.update(
      t.call(n, o, a, e),
      function(u) {
        return u = u || [], u.push(r ? [a, o] : o), u;
      }
    );
  });
  var s = Ch(e);
  return i.map(function(o) {
    return Y(e, s(o));
  }).asImmutable();
}
function aL(e, t, n) {
  var r = Z(e), i = [[], []];
  e.__iterate(function(o, a) {
    i[t.call(n, o, a, e) ? 1 : 0].push(
      r ? [a, o] : o
    );
  });
  var s = Ch(e);
  return i.map(function(o) {
    return Y(e, s(o));
  });
}
function Dh(e, t, n, r) {
  var i = e.size;
  if (Io(t, n, i))
    return e;
  if (typeof i > "u" && (t < 0 || n < 0))
    return Dh(e.toSeq().cacheResult(), t, n, r);
  var s = rs(t, i), o = Do(n, i), a = o - s, u;
  a === a && (u = a < 0 ? 0 : a);
  var f = Tn(e);
  return f.size = u === 0 ? u : e.size && u || void 0, !r && Ju(e) && u >= 0 && (f.get = function(c, l) {
    return c = fr(this, c), c >= 0 && c < u ? e.get(c + s, l) : l;
  }), f.__iterateUncached = function(c, l) {
    var h = this;
    if (u === 0)
      return 0;
    if (l)
      return this.cacheResult().__iterate(c, l);
    var d = 0, _ = !0, v = 0;
    return e.__iterate(function(g, y) {
      if (!(_ && (_ = d++ < s)))
        return v++, c(g, r ? y : v - 1, h) !== !1 && v !== u;
    }), v;
  }, f.__iteratorUncached = function(c, l) {
    if (u !== 0 && l)
      return this.cacheResult().__iterator(c, l);
    if (u === 0)
      return new F(Ce);
    var h = e.__iterator(c, l), d = 0, _ = 0;
    return new F(function() {
      for (; d++ < s; )
        h.next();
      if (++_ > u)
        return Ce();
      var v = h.next();
      return r || c === Et || v.done ? v : c === ss ? ne(c, _ - 1, void 0, v) : ne(c, _ - 1, v.value[1], v);
    });
  }, f;
}
function uL(e, t, n) {
  var r = Tn(e);
  return r.__iterateUncached = function(i, s) {
    var o = this;
    if (s)
      return this.cacheResult().__iterate(i, s);
    var a = 0;
    return e.__iterate(
      function(u, f, c) {
        return t.call(n, u, f, c) && ++a && i(u, f, o);
      }
    ), a;
  }, r.__iteratorUncached = function(i, s) {
    var o = this;
    if (s)
      return this.cacheResult().__iterator(i, s);
    var a = e.__iterator(St, s), u = !0;
    return new F(function() {
      if (!u)
        return Ce();
      var f = a.next();
      if (f.done)
        return f;
      var c = f.value, l = c[0], h = c[1];
      return t.call(n, h, l, o) ? i === St ? f : ne(i, l, h, f) : (u = !1, Ce());
    });
  }, r;
}
function yw(e, t, n, r) {
  var i = Tn(e);
  return i.__iterateUncached = function(s, o) {
    var a = this;
    if (o)
      return this.cacheResult().__iterate(s, o);
    var u = !0, f = 0;
    return e.__iterate(function(c, l, h) {
      if (!(u && (u = t.call(n, c, l, h))))
        return f++, s(c, r ? l : f - 1, a);
    }), f;
  }, i.__iteratorUncached = function(s, o) {
    var a = this;
    if (o)
      return this.cacheResult().__iterator(s, o);
    var u = e.__iterator(St, o), f = !0, c = 0;
    return new F(function() {
      var l, h, d;
      do {
        if (l = u.next(), l.done)
          return r || s === Et ? l : s === ss ? ne(s, c++, void 0, l) : ne(s, c++, l.value[1], l);
        var _ = l.value;
        h = _[0], d = _[1], f && (f = t.call(n, d, h, a));
      } while (f);
      return s === St ? l : ne(s, h, d, l);
    });
  }, i;
}
var fL = /* @__PURE__ */ function(e) {
  function t(n) {
    this._wrappedIterables = n.flatMap(function(r) {
      return r._wrappedIterables ? r._wrappedIterables : [r];
    }), this.size = this._wrappedIterables.reduce(function(r, i) {
      if (r !== void 0) {
        var s = i.size;
        if (s !== void 0)
          return r + s;
      }
    }, 0), this[za] = this._wrappedIterables[0][za], this[Ua] = this._wrappedIterables[0][Ua], this[cr] = this._wrappedIterables[0][cr];
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.__iterateUncached = function(r, i) {
    if (this._wrappedIterables.length !== 0) {
      if (i)
        return this.cacheResult().__iterate(r, i);
      for (var s = 0, o = Z(this), a = o ? St : Et, u = this._wrappedIterables[s].__iterator(
        a,
        i
      ), f = !0, c = 0; f; ) {
        for (var l = u.next(); l.done; ) {
          if (s++, s === this._wrappedIterables.length)
            return c;
          u = this._wrappedIterables[s].__iterator(
            a,
            i
          ), l = u.next();
        }
        var h = o ? r(l.value[1], l.value[0], this) : r(l.value, c, this);
        f = h !== !1, c++;
      }
      return c;
    }
  }, t.prototype.__iteratorUncached = function(r, i) {
    var s = this;
    if (this._wrappedIterables.length === 0)
      return new F(Ce);
    if (i)
      return this.cacheResult().__iterator(r, i);
    var o = 0, a = this._wrappedIterables[o].__iterator(
      r,
      i
    );
    return new F(function() {
      for (var u = a.next(); u.done; ) {
        if (o++, o === s._wrappedIterables.length)
          return u;
        a = s._wrappedIterables[o].__iterator(
          r,
          i
        ), u = a.next();
      }
      return u;
    });
  }, t;
}(Le);
function cL(e, t) {
  var n = Z(e), r = [e].concat(t).map(function(s) {
    return st(s) ? n && (s = Wt(s)) : s = n ? Nh(s) : fw(Array.isArray(s) ? s : [s]), s;
  }).filter(function(s) {
    return s.size !== 0;
  });
  if (r.length === 0)
    return e;
  if (r.length === 1) {
    var i = r[0];
    if (i === e || n && Z(i) || ot(e) && ot(i))
      return i;
  }
  return new fL(r);
}
function bw(e, t, n) {
  var r = Tn(e);
  return r.__iterateUncached = function(i, s) {
    if (s)
      return this.cacheResult().__iterate(i, s);
    var o = 0, a = !1;
    function u(f, c) {
      f.__iterate(function(l, h) {
        return (!t || c < t) && st(l) ? u(l, c + 1) : (o++, i(l, n ? h : o - 1, r) === !1 && (a = !0)), !a;
      }, s);
    }
    return u(e, 0), o;
  }, r.__iteratorUncached = function(i, s) {
    if (s)
      return this.cacheResult().__iterator(i, s);
    var o = e.__iterator(i, s), a = [], u = 0;
    return new F(function() {
      for (; o; ) {
        var f = o.next();
        if (f.done !== !1) {
          o = a.pop();
          continue;
        }
        var c = f.value;
        if (i === St && (c = c[1]), (!t || a.length < t) && st(c))
          a.push(o), o = c.__iterator(i, s);
        else
          return n ? f : ne(i, u++, c, f);
      }
      return Ce();
    });
  }, r;
}
function lL(e, t, n) {
  var r = Ch(e);
  return e.toSeq().map(function(i, s) {
    return r(t.call(n, i, s, e));
  }).flatten(!0);
}
function hL(e, t) {
  var n = Tn(e);
  return n.size = e.size && e.size * 2 - 1, n.__iterateUncached = function(r, i) {
    var s = this, o = 0;
    return e.__iterate(
      function(a) {
        return (!o || r(t, o++, s) !== !1) && r(a, o++, s) !== !1;
      },
      i
    ), o;
  }, n.__iteratorUncached = function(r, i) {
    var s = e.__iterator(Et, i), o = 0, a;
    return new F(function() {
      return (!a || o % 2) && (a = s.next(), a.done) ? a : o % 2 ? ne(r, o++, t) : ne(r, o++, a.value, a);
    });
  }, n;
}
function Di(e, t, n) {
  t || (t = mw);
  var r = Z(e), i = 0, s = e.toSeq().map(function(o, a) {
    return [a, o, i++, n ? n(o, a, e) : o];
  }).valueSeq().toArray();
  return s.sort(function(o, a) {
    return t(o[3], a[3]) || o[2] - a[2];
  }).forEach(
    r ? function(o, a) {
      s[a].length = 2;
    } : function(o, a) {
      s[a] = o[1];
    }
  ), r ? mr(s) : ot(e) ? qt(s) : as(s);
}
function aa(e, t, n) {
  if (t || (t = mw), n) {
    var r = e.toSeq().map(function(i, s) {
      return [i, n(i, s, e)];
    }).reduce(function(i, s) {
      return l_(t, i[1], s[1]) ? s : i;
    });
    return r && r[0];
  }
  return e.reduce(function(i, s) {
    return l_(t, i, s) ? s : i;
  });
}
function l_(e, t, n) {
  var r = e(n, t);
  return r === 0 && n !== t && (n == null || n !== n) || r > 0;
}
function ua(e, t, n, r) {
  var i = Tn(e), s = new Ii(n).map(function(o) {
    return o.size;
  });
  return i.size = r ? s.max() : s.min(), i.__iterate = function(o, a) {
    for (var u = this.__iterator(Et, a), f, c = 0; !(f = u.next()).done && o(f.value, c++, this) !== !1; )
      ;
    return c;
  }, i.__iteratorUncached = function(o, a) {
    var u = n.map(
      function(l) {
        return l = Ee(l), jc(a ? l.reverse() : l);
      }
    ), f = 0, c = !1;
    return new F(function() {
      var l;
      return c || (l = u.map(function(h) {
        return h.next();
      }), c = r ? l.every(function(h) {
        return h.done;
      }) : l.some(function(h) {
        return h.done;
      })), c ? Ce() : ne(
        o,
        f++,
        t.apply(
          null,
          l.map(function(h) {
            return h.value;
          })
        )
      );
    });
  }, i;
}
function Y(e, t) {
  return e === t ? e : Ju(e) ? t : e.constructor(t);
}
function h_(e) {
  if (e !== Object(e))
    throw new TypeError("Expected [K, V] tuple: " + e);
}
function Ch(e) {
  return Z(e) ? Wt : ot(e) ? ti : is;
}
function Tn(e) {
  return Object.create(
    (Z(e) ? mr : ot(e) ? qt : as).prototype
  );
}
function Lh() {
  return this._iter.cacheResult ? (this._iter.cacheResult(), this.size = this._iter.size, this) : Le.prototype.cacheResult.call(this);
}
function mw(e, t) {
  return e === void 0 && t === void 0 ? 0 : e === void 0 ? 1 : t === void 0 ? -1 : e > t ? 1 : e < t ? -1 : 0;
}
function un(e, t) {
  t = t || 0;
  for (var n = Math.max(0, e.length - t), r = new Array(n), i = 0; i < n; i++)
    r[i] = e[i + t];
  return r;
}
function Ns(e, t) {
  if (!e)
    throw new Error(t);
}
function ft(e) {
  Ns(e !== 1 / 0, "Cannot perform this action with an infinite size.");
}
function ww(e) {
  if (Th(e) && typeof e != "string")
    return e;
  if (Xt(e))
    return e.toArray();
  throw new TypeError("Invalid keyPath: expected Ordered Collection or Array: " + e);
}
var pL = Object.prototype.toString;
function jh(e) {
  if (!e || typeof e != "object" || pL.call(e) !== "[object Object]")
    return !1;
  var t = Object.getPrototypeOf(e);
  if (t === null)
    return !0;
  for (var n = t, r = Object.getPrototypeOf(t); r !== null; )
    n = r, r = Object.getPrototypeOf(n);
  return n === t;
}
function lr(e) {
  return typeof e == "object" && (kt(e) || Array.isArray(e) || jh(e));
}
function Js(e) {
  try {
    return typeof e == "string" ? JSON.stringify(e) : String(e);
  } catch {
    return JSON.stringify(e);
  }
}
function Aw(e, t) {
  return kt(e) ? (
    // @ts-expect-error key might be a number or symbol, which is not handled be Record key type
    e.has(t)
  ) : (
    // @ts-expect-error key might be anything else than PropertyKey, and will return false in that case but runtime is OK
    lr(e) && os.call(e, t)
  );
}
function Fh(e, t, n) {
  return kt(e) ? e.get(t, n) : Aw(e, t) ? (
    // @ts-expect-error weird "get" here,
    typeof e.get == "function" ? (
      // @ts-expect-error weird "get" here,
      e.get(t)
    ) : (
      // @ts-expect-error key is unknown here,
      e[t]
    )
  ) : n;
}
function Va(e) {
  if (Array.isArray(e))
    return un(e);
  var t = {};
  for (var n in e)
    os.call(e, n) && (t[n] = e[n]);
  return t;
}
function Ow(e, t) {
  if (!lr(e))
    throw new TypeError("Cannot update non-data-structure value: " + e);
  if (kt(e)) {
    if (!e.remove)
      throw new TypeError("Cannot update immutable value without .remove() method: " + e);
    return e.remove(t);
  }
  if (!os.call(e, t))
    return e;
  var n = Va(e);
  return Array.isArray(n) ? n.splice(t, 1) : delete n[t], n;
}
function Ew(e, t, n) {
  if (!lr(e))
    throw new TypeError("Cannot update non-data-structure value: " + e);
  if (kt(e)) {
    if (!e.set)
      throw new TypeError("Cannot update immutable value without .set() method: " + e);
    return e.set(t, n);
  }
  if (os.call(e, t) && n === e[t])
    return e;
  var r = Va(e);
  return r[t] = n, r;
}
function ni(e, t, n, r) {
  r || (r = n, n = void 0);
  var i = Sw(
    kt(e),
    // @ts-expect-error type issues with Record and mixed types
    e,
    ww(t),
    0,
    n,
    r
  );
  return i === j ? n : i;
}
function Sw(e, t, n, r, i, s) {
  var o = t === j;
  if (r === n.length) {
    var a = o ? i : t, u = s(a);
    return u === a ? t : u;
  }
  if (!o && !lr(t))
    throw new TypeError("Cannot update within non-data-structure value in path [" + Array.from(n).slice(0, r).map(Js) + "]: " + t);
  var f = n[r], c = o ? j : Fh(t, f, j), l = Sw(
    c === j ? e : kt(c),
    // @ts-expect-error mixed type
    c,
    n,
    r + 1,
    i,
    s
  );
  return l === c ? t : l === j ? Ow(t, f) : Ew(o ? e ? cn() : {} : t, f, l);
}
function xw(e, t, n) {
  return ni(e, t, j, function() {
    return n;
  });
}
function Bh(e, t) {
  return xw(this, e, t);
}
function Tw(e, t) {
  return ni(e, t, function() {
    return j;
  });
}
function zh(e) {
  return Tw(this, e);
}
function Uh(e, t, n, r) {
  return ni(
    // @ts-expect-error Index signature for type string is missing in type V[]
    e,
    [t],
    n,
    r
  );
}
function Vh(e, t, n) {
  return arguments.length === 1 ? e(this) : Uh(this, e, t, n);
}
function Wh(e, t, n) {
  return ni(this, e, t, n);
}
function Rw() {
  for (var e = [], t = arguments.length; t--; ) e[t] = arguments[t];
  return Nw(this, e);
}
function Pw(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  if (typeof e != "function")
    throw new TypeError("Invalid merger function: " + e);
  return Nw(this, t, e);
}
function Nw(e, t, n) {
  for (var r = [], i = 0; i < t.length; i++) {
    var s = Wt(t[i]);
    s.size !== 0 && r.push(s);
  }
  return r.length === 0 ? e : e.toSeq().size === 0 && !e.__ownerID && r.length === 1 ? br(e) ? e : e.constructor(r[0]) : e.withMutations(function(o) {
    for (var a = n ? function(f, c) {
      Uh(
        o,
        c,
        j,
        function(l) {
          return l === j ? f : n(l, f, c);
        }
      );
    } : function(f, c) {
      o.set(c, f);
    }, u = 0; u < r.length; u++)
      r[u].forEach(a);
  });
}
function dL(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return Lo(e, t);
}
function _L(e, t) {
  for (var n = [], r = arguments.length - 2; r-- > 0; ) n[r] = arguments[r + 2];
  return Lo(t, n, e);
}
function vL(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return Co(e, t);
}
function gL(e, t) {
  for (var n = [], r = arguments.length - 2; r-- > 0; ) n[r] = arguments[r + 2];
  return Co(t, n, e);
}
function Co(e, t, n) {
  return Lo(e, t, yL(n));
}
function Lo(e, t, n) {
  if (!lr(e))
    throw new TypeError(
      "Cannot merge into non-data-structure value: " + e
    );
  if (kt(e))
    return typeof n == "function" && e.mergeWith ? e.mergeWith.apply(e, [n].concat(t)) : e.merge ? e.merge.apply(e, t) : e.concat.apply(e, t);
  for (var r = Array.isArray(e), i = e, s = r ? ti : Wt, o = r ? function(u) {
    i === e && (i = Va(i)), i.push(u);
  } : function(u, f) {
    var c = os.call(i, f), l = c && n ? n(i[f], u, f) : u;
    (!c || l !== i[f]) && (i === e && (i = Va(i)), i[f] = l);
  }, a = 0; a < t.length; a++)
    s(t[a]).forEach(o);
  return i;
}
function yL(e) {
  function t(n, r, i) {
    return lr(n) && lr(r) && bL(n, r) ? Lo(n, [r], t) : e ? e(n, r, i) : r;
  }
  return t;
}
function bL(e, t) {
  var n = Le(e), r = Le(t);
  return ot(n) === ot(r) && Z(n) === Z(r);
}
function $w() {
  for (var e = [], t = arguments.length; t--; ) e[t] = arguments[t];
  return Co(this, e);
}
function Mw(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return Co(this, t, e);
}
function kh(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return ni(this, e, cn(), function(r) {
    return Lo(r, t);
  });
}
function qh(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return ni(
    this,
    e,
    cn(),
    function(r) {
      return Co(r, t);
    }
  );
}
function jo(e) {
  var t = this.asMutable();
  return e(t), t.wasAltered() ? t.__ensureOwner(this.__ownerID) : this;
}
function Fo() {
  return this.__ownerID ? this : this.__ensureOwner(new Sh());
}
function Bo() {
  return this.__ensureOwner();
}
function Gh() {
  return this.__altered;
}
var ri = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? cn() : ef(n) && !Xt(n) ? n : cn().withMutations(function(r) {
      var i = e(n);
      ft(i.size), i.forEach(function(s, o) {
        return r.set(o, s);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.__toString("Map {", "}");
  }, t.prototype.get = function(r, i) {
    return this._root ? this._root.get(0, void 0, r, i) : i;
  }, t.prototype.set = function(r, i) {
    return __(this, r, i);
  }, t.prototype.remove = function(r) {
    return __(this, r, j);
  }, t.prototype.deleteAll = function(r) {
    var i = Ee(r);
    return i.size === 0 ? this : this.withMutations(function(s) {
      i.forEach(function(o) {
        return s.remove(o);
      });
    });
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._root = null, this.__hash = void 0, this.__altered = !0, this) : cn();
  }, t.prototype.sort = function(r) {
    return vn(Di(this, r));
  }, t.prototype.sortBy = function(r, i) {
    return vn(Di(this, i, r));
  }, t.prototype.map = function(r, i) {
    var s = this;
    return this.withMutations(function(o) {
      o.forEach(function(a, u) {
        o.set(u, r.call(i, a, u, s));
      });
    });
  }, t.prototype.__iterator = function(r, i) {
    return new mL(this, r, i);
  }, t.prototype.__iterate = function(r, i) {
    var s = this, o = 0;
    return this._root && this._root.iterate(function(a) {
      return o++, r(a[1], a[0], s);
    }, i), o;
  }, t.prototype.__ensureOwner = function(r) {
    return r === this.__ownerID ? this : r ? Hh(this.size, this._root, r, this.__hash) : this.size === 0 ? cn() : (this.__ownerID = r, this.__altered = !1, this);
  }, t;
}(Wt);
ri.isMap = ef;
var re = ri.prototype;
re[cw] = !0;
re[Mo] = re.remove;
re.removeAll = re.deleteAll;
re.setIn = Bh;
re.removeIn = re.deleteIn = zh;
re.update = Vh;
re.updateIn = Wh;
re.merge = re.concat = Rw;
re.mergeWith = Pw;
re.mergeDeep = $w;
re.mergeDeepWith = Mw;
re.mergeIn = kh;
re.mergeDeepIn = qh;
re.withMutations = jo;
re.wasAltered = Gh;
re.asImmutable = Bo;
re["@@transducer/init"] = re.asMutable = Fo;
re["@@transducer/step"] = function(e, t) {
  return e.set(t[0], t[1]);
};
re["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
var Zs = function(t, n) {
  this.ownerID = t, this.entries = n;
};
Zs.prototype.get = function(t, n, r, i) {
  for (var s = this.entries, o = 0, a = s.length; o < a; o++)
    if (Ae(r, s[o][0]))
      return s[o][1];
  return i;
};
Zs.prototype.update = function(t, n, r, i, s, o, a) {
  for (var u = s === j, f = this.entries, c = 0, l = f.length; c < l && !Ae(i, f[c][0]); c++)
    ;
  var h = c < l;
  if (h ? f[c][1] === s : u)
    return this;
  if (Mt(a), (u || !h) && Mt(o), !(u && f.length === 1)) {
    if (!h && !u && f.length >= xL)
      return wL(t, f, i, s);
    var d = t && t === this.ownerID, _ = d ? f : un(f);
    return h ? u ? c === l - 1 ? _.pop() : _[c] = _.pop() : _[c] = [i, s] : _.push([i, s]), d ? (this.entries = _, this) : new Zs(t, _);
  }
};
var Ci = function(t, n, r) {
  this.ownerID = t, this.bitmap = n, this.nodes = r;
};
Ci.prototype.get = function(t, n, r, i) {
  n === void 0 && (n = Ze(r));
  var s = 1 << ((t === 0 ? n : n >>> t) & ze), o = this.bitmap;
  return (o & s) === 0 ? i : this.nodes[Iw(o & s - 1)].get(
    t + X,
    n,
    r,
    i
  );
};
Ci.prototype.update = function(t, n, r, i, s, o, a) {
  r === void 0 && (r = Ze(i));
  var u = (n === 0 ? r : r >>> n) & ze, f = 1 << u, c = this.bitmap, l = (c & f) !== 0;
  if (!l && s === j)
    return this;
  var h = Iw(c & f - 1), d = this.nodes, _ = l ? d[h] : void 0, v = Kh(
    _,
    t,
    n + X,
    r,
    i,
    s,
    o,
    a
  );
  if (v === _)
    return this;
  if (!l && v && d.length >= TL)
    return OL(t, d, c, u, v);
  if (l && !v && d.length === 2 && v_(d[h ^ 1]))
    return d[h ^ 1];
  if (l && v && d.length === 1 && v_(v))
    return v;
  var g = t && t === this.ownerID, y = l ? v ? c : c ^ f : c | f, b = l ? v ? Dw(d, h, v, g) : SL(d, h, g) : EL(d, h, v, g);
  return g ? (this.bitmap = y, this.nodes = b, this) : new Ci(t, y, b);
};
var Qs = function(t, n, r) {
  this.ownerID = t, this.count = n, this.nodes = r;
};
Qs.prototype.get = function(t, n, r, i) {
  n === void 0 && (n = Ze(r));
  var s = (t === 0 ? n : n >>> t) & ze, o = this.nodes[s];
  return o ? o.get(t + X, n, r, i) : i;
};
Qs.prototype.update = function(t, n, r, i, s, o, a) {
  r === void 0 && (r = Ze(i));
  var u = (n === 0 ? r : r >>> n) & ze, f = s === j, c = this.nodes, l = c[u];
  if (f && !l)
    return this;
  var h = Kh(
    l,
    t,
    n + X,
    r,
    i,
    s,
    o,
    a
  );
  if (h === l)
    return this;
  var d = this.count;
  if (!l)
    d++;
  else if (!h && (d--, d < RL))
    return AL(t, c, d, u);
  var _ = t && t === this.ownerID, v = Dw(c, u, h, _);
  return _ ? (this.count = d, this.nodes = v, this) : new Qs(t, d, v);
};
var Li = function(t, n, r) {
  this.ownerID = t, this.keyHash = n, this.entries = r;
};
Li.prototype.get = function(t, n, r, i) {
  for (var s = this.entries, o = 0, a = s.length; o < a; o++)
    if (Ae(r, s[o][0]))
      return s[o][1];
  return i;
};
Li.prototype.update = function(t, n, r, i, s, o, a) {
  r === void 0 && (r = Ze(i));
  var u = s === j;
  if (r !== this.keyHash)
    return u ? this : (Mt(a), Mt(o), Yh(this, t, n, r, [i, s]));
  for (var f = this.entries, c = 0, l = f.length; c < l && !Ae(i, f[c][0]); c++)
    ;
  var h = c < l;
  if (h ? f[c][1] === s : u)
    return this;
  if (Mt(a), (u || !h) && Mt(o), u && l === 2)
    return new kn(t, this.keyHash, f[c ^ 1]);
  var d = t && t === this.ownerID, _ = d ? f : un(f);
  return h ? u ? c === l - 1 ? _.pop() : _[c] = _.pop() : _[c] = [i, s] : _.push([i, s]), d ? (this.entries = _, this) : new Li(t, this.keyHash, _);
};
var kn = function(t, n, r) {
  this.ownerID = t, this.keyHash = n, this.entry = r;
};
kn.prototype.get = function(t, n, r, i) {
  return Ae(r, this.entry[0]) ? this.entry[1] : i;
};
kn.prototype.update = function(t, n, r, i, s, o, a) {
  var u = s === j, f = Ae(i, this.entry[0]);
  if (f ? s === this.entry[1] : u)
    return this;
  if (Mt(a), u) {
    Mt(o);
    return;
  }
  return f ? t && t === this.ownerID ? (this.entry[1] = s, this) : new kn(t, this.keyHash, [i, s]) : (Mt(o), Yh(this, t, n, Ze(i), [i, s]));
};
Zs.prototype.iterate = Li.prototype.iterate = function(e, t) {
  for (var n = this.entries, r = 0, i = n.length - 1; r <= i; r++)
    if (e(n[t ? i - r : r]) === !1)
      return !1;
};
Ci.prototype.iterate = Qs.prototype.iterate = function(e, t) {
  for (var n = this.nodes, r = 0, i = n.length - 1; r <= i; r++) {
    var s = n[t ? i - r : r];
    if (s && s.iterate(e, t) === !1)
      return !1;
  }
};
kn.prototype.iterate = function(e, t) {
  return e(this.entry);
};
var mL = /* @__PURE__ */ function(e) {
  function t(n, r, i) {
    this._type = r, this._reverse = i, this._stack = n._root && p_(n._root);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.next = function() {
    for (var r = this._type, i = this._stack; i; ) {
      var s = i.node, o = i.index++, a = void 0;
      if (s.entry) {
        if (o === 0)
          return Gf(r, s.entry);
      } else if (s.entries) {
        if (a = s.entries.length - 1, o <= a)
          return Gf(
            r,
            s.entries[this._reverse ? a - o : o]
          );
      } else if (a = s.nodes.length - 1, o <= a) {
        var u = s.nodes[this._reverse ? a - o : o];
        if (u) {
          if (u.entry)
            return Gf(r, u.entry);
          i = this._stack = p_(u, i);
        }
        continue;
      }
      i = this._stack = this._stack.__prev;
    }
    return Ce();
  }, t;
}(F);
function Gf(e, t) {
  return ne(e, t[0], t[1]);
}
function p_(e, t) {
  return {
    node: e,
    index: 0,
    __prev: t
  };
}
function Hh(e, t, n, r) {
  var i = Object.create(re);
  return i.size = e, i._root = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
var d_;
function cn() {
  return d_ || (d_ = Hh(0));
}
function __(e, t, n) {
  var r, i;
  if (e._root) {
    var s = Cc(), o = Cc();
    if (r = Kh(
      e._root,
      e.__ownerID,
      0,
      void 0,
      t,
      n,
      s,
      o
    ), !o.value)
      return e;
    i = e.size + (s.value ? n === j ? -1 : 1 : 0);
  } else {
    if (n === j)
      return e;
    i = 1, r = new Zs(e.__ownerID, [[t, n]]);
  }
  return e.__ownerID ? (e.size = i, e._root = r, e.__hash = void 0, e.__altered = !0, e) : r ? Hh(i, r) : cn();
}
function Kh(e, t, n, r, i, s, o, a) {
  return e ? e.update(
    t,
    n,
    r,
    i,
    s,
    o,
    a
  ) : s === j ? e : (Mt(a), Mt(o), new kn(t, r, [i, s]));
}
function v_(e) {
  return e.constructor === kn || e.constructor === Li;
}
function Yh(e, t, n, r, i) {
  if (e.keyHash === r)
    return new Li(t, r, [e.entry, i]);
  var s = (n === 0 ? e.keyHash : e.keyHash >>> n) & ze, o = (n === 0 ? r : r >>> n) & ze, a, u = s === o ? [Yh(e, t, n + X, r, i)] : (a = new kn(t, r, i), s < o ? [e, a] : [a, e]);
  return new Ci(t, 1 << s | 1 << o, u);
}
function wL(e, t, n, r) {
  e || (e = new Sh());
  for (var i = new kn(e, Ze(n), [n, r]), s = 0; s < t.length; s++) {
    var o = t[s];
    i = i.update(e, 0, void 0, o[0], o[1]);
  }
  return i;
}
function AL(e, t, n, r) {
  for (var i = 0, s = 0, o = new Array(n), a = 0, u = 1, f = t.length; a < f; a++, u <<= 1) {
    var c = t[a];
    c !== void 0 && a !== r && (i |= u, o[s++] = c);
  }
  return new Ci(e, i, o);
}
function OL(e, t, n, r, i) {
  for (var s = 0, o = new Array(ht), a = 0; n !== 0; a++, n >>>= 1)
    o[a] = n & 1 ? t[s++] : void 0;
  return o[r] = i, new Qs(e, s + 1, o);
}
function Iw(e) {
  return e -= e >> 1 & 1431655765, e = (e & 858993459) + (e >> 2 & 858993459), e = e + (e >> 4) & 252645135, e += e >> 8, e += e >> 16, e & 127;
}
function Dw(e, t, n, r) {
  var i = r ? e : un(e);
  return i[t] = n, i;
}
function EL(e, t, n, r) {
  var i = e.length + 1;
  if (r && t + 1 === i)
    return e[t] = n, e;
  for (var s = new Array(i), o = 0, a = 0; a < i; a++)
    a === t ? (s[a] = n, o = -1) : s[a] = e[a + o];
  return s;
}
function SL(e, t, n) {
  var r = e.length - 1;
  if (n && t === r)
    return e.pop(), e;
  for (var i = new Array(r), s = 0, o = 0; o < r; o++)
    o === t && (s = 1), i[o] = e[o + s];
  return i;
}
var xL = ht / 4, TL = ht / 2, RL = ht / 4, Cw = "@@__IMMUTABLE_LIST__@@";
function Xh(e) {
  return !!(e && // @ts-expect-error: maybeList is typed as `{}`, need to change in 6.0 to `maybeList && typeof maybeList === 'object' && IS_LIST_SYMBOL in maybeList`
  e[Cw]);
}
var zo = /* @__PURE__ */ function(e) {
  function t(n) {
    var r = xa();
    if (n == null)
      return r;
    if (Xh(n))
      return n;
    var i = e(n), s = i.size;
    return s === 0 ? r : (ft(s), s > 0 && s < ht ? eo(0, s, X, null, new tr(i.toArray())) : r.withMutations(function(o) {
      o.setSize(s), i.forEach(function(a, u) {
        return o.set(u, a);
      });
    }));
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.prototype.toString = function() {
    return this.__toString("List [", "]");
  }, t.prototype.get = function(r, i) {
    if (r = fr(this, r), r >= 0 && r < this.size) {
      r += this._origin;
      var s = Lw(this, r);
      return s && s.array[r & ze];
    }
    return i;
  }, t.prototype.set = function(r, i) {
    return PL(this, r, i);
  }, t.prototype.remove = function(r) {
    return this.has(r) ? r === 0 ? this.shift() : r === this.size - 1 ? this.pop() : this.splice(r, 1) : this;
  }, t.prototype.insert = function(r, i) {
    return this.splice(r, 0, i);
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = this._origin = this._capacity = 0, this._level = X, this._root = this._tail = this.__hash = void 0, this.__altered = !0, this) : xa();
  }, t.prototype.push = function() {
    var r = arguments, i = this.size;
    return this.withMutations(function(s) {
      Jn(s, 0, i + r.length);
      for (var o = 0; o < r.length; o++)
        s.set(i + o, r[o]);
    });
  }, t.prototype.pop = function() {
    return Jn(this, 0, -1);
  }, t.prototype.unshift = function() {
    var r = arguments;
    return this.withMutations(function(i) {
      Jn(i, -r.length);
      for (var s = 0; s < r.length; s++)
        i.set(s, r[s]);
    });
  }, t.prototype.shift = function() {
    return Jn(this, 1);
  }, t.prototype.shuffle = function(r) {
    return r === void 0 && (r = Math.random), this.withMutations(function(i) {
      for (var s = i.size, o, a; s; )
        o = Math.floor(r() * s--), a = i.get(o), i.set(o, i.get(s)), i.set(s, a);
    });
  }, t.prototype.concat = function() {
    for (var r = arguments, i = [], s = 0; s < arguments.length; s++) {
      var o = r[s], a = e(
        typeof o != "string" && xh(o) ? o : [o]
      );
      a.size !== 0 && i.push(a);
    }
    return i.length === 0 ? this : this.size === 0 && !this.__ownerID && i.length === 1 ? this.constructor(i[0]) : this.withMutations(function(u) {
      i.forEach(function(f) {
        return f.forEach(function(c) {
          return u.push(c);
        });
      });
    });
  }, t.prototype.setSize = function(r) {
    return Jn(this, 0, r);
  }, t.prototype.map = function(r, i) {
    var s = this;
    return this.withMutations(function(o) {
      for (var a = 0; a < s.size; a++)
        o.set(a, r.call(i, o.get(a), a, s));
    });
  }, t.prototype.slice = function(r, i) {
    var s = this.size;
    return Io(r, i, s) ? this : Jn(
      this,
      rs(r, s),
      Do(i, s)
    );
  }, t.prototype.__iterator = function(r, i) {
    var s = i ? this.size : 0, o = g_(this, i);
    return new F(function() {
      var a = o();
      return a === $s ? Ce() : ne(r, i ? --s : s++, a);
    });
  }, t.prototype.__iterate = function(r, i) {
    for (var s = i ? this.size : 0, o = g_(this, i), a; (a = o()) !== $s && r(a, i ? --s : s++, this) !== !1; )
      ;
    return s;
  }, t.prototype.__ensureOwner = function(r) {
    return r === this.__ownerID ? this : r ? eo(
      this._origin,
      this._capacity,
      this._level,
      this._root,
      this._tail,
      r,
      this.__hash
    ) : this.size === 0 ? xa() : (this.__ownerID = r, this.__altered = !1, this);
  }, t;
}(ti);
zo.isList = Xh;
var he = zo.prototype;
he[Cw] = !0;
he[Mo] = he.remove;
he.merge = he.concat;
he.setIn = Bh;
he.deleteIn = he.removeIn = zh;
he.update = Vh;
he.updateIn = Wh;
he.mergeIn = kh;
he.mergeDeepIn = qh;
he.withMutations = jo;
he.wasAltered = Gh;
he.asImmutable = Bo;
he["@@transducer/init"] = he.asMutable = Fo;
he["@@transducer/step"] = function(e, t) {
  return e.push(t);
};
he["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
var tr = function(t, n) {
  this.array = t, this.ownerID = n;
};
tr.prototype.removeBefore = function(t, n, r) {
  if ((r & (1 << n + X) - 1) === 0 || this.array.length === 0)
    return this;
  var i = r >>> n & ze;
  if (i >= this.array.length)
    return new tr([], t);
  var s = i === 0, o;
  if (n > 0) {
    var a = this.array[i];
    if (o = a && a.removeBefore(t, n - X, r), o === a && s)
      return this;
  }
  if (s && !o)
    return this;
  var u = ji(this, t);
  if (!s)
    for (var f = 0; f < i; f++)
      u.array[f] = void 0;
  return o && (u.array[i] = o), u;
};
tr.prototype.removeAfter = function(t, n, r) {
  if (r === (n ? 1 << n + X : ht) || this.array.length === 0)
    return this;
  var i = r - 1 >>> n & ze;
  if (i >= this.array.length)
    return this;
  var s;
  if (n > 0) {
    var o = this.array[i];
    if (s = o && o.removeAfter(t, n - X, r), s === o && i === this.array.length - 1)
      return this;
  }
  var a = ji(this, t);
  return a.array.splice(i + 1), s && (a.array[i] = s), a;
};
var $s = {};
function g_(e, t) {
  var n = e._origin, r = e._capacity, i = to(r), s = e._tail;
  return o(e._root, e._level, 0);
  function o(f, c, l) {
    return c === 0 ? a(f, l) : u(f, c, l);
  }
  function a(f, c) {
    var l = c === i ? s && s.array : f && f.array, h = c > n ? 0 : n - c, d = r - c;
    return d > ht && (d = ht), function() {
      if (h === d)
        return $s;
      var _ = t ? --d : h++;
      return l && l[_];
    };
  }
  function u(f, c, l) {
    var h, d = f && f.array, _ = l > n ? 0 : n - l >> c, v = (r - l >> c) + 1;
    return v > ht && (v = ht), function() {
      for (; ; ) {
        if (h) {
          var g = h();
          if (g !== $s)
            return g;
          h = null;
        }
        if (_ === v)
          return $s;
        var y = t ? --v : _++;
        h = o(
          d && d[y],
          c - X,
          l + (y << c)
        );
      }
    };
  }
}
function eo(e, t, n, r, i, s, o) {
  var a = Object.create(he);
  return a.size = t - e, a._origin = e, a._capacity = t, a._level = n, a._root = r, a._tail = i, a.__ownerID = s, a.__hash = o, a.__altered = !1, a;
}
function xa() {
  return eo(0, 0, X);
}
function PL(e, t, n) {
  if (t = fr(e, t), t !== t)
    return e;
  if (t >= e.size || t < 0)
    return e.withMutations(function(o) {
      t < 0 ? Jn(o, t).set(0, n) : Jn(o, 0, t + 1).set(t, n);
    });
  t += e._origin;
  var r = e._tail, i = e._root, s = Cc();
  return t >= to(e._capacity) ? r = Vc(r, e.__ownerID, 0, t, n, s) : i = Vc(
    i,
    e.__ownerID,
    e._level,
    t,
    n,
    s
  ), s.value ? e.__ownerID ? (e._root = i, e._tail = r, e.__hash = void 0, e.__altered = !0, e) : eo(e._origin, e._capacity, e._level, i, r) : e;
}
function Vc(e, t, n, r, i, s) {
  var o = r >>> n & ze, a = e && o < e.array.length;
  if (!a && i === void 0)
    return e;
  var u;
  if (n > 0) {
    var f = e && e.array[o], c = Vc(
      f,
      t,
      n - X,
      r,
      i,
      s
    );
    return c === f ? e : (u = ji(e, t), u.array[o] = c, u);
  }
  return a && e.array[o] === i ? e : (s && Mt(s), u = ji(e, t), i === void 0 && o === u.array.length - 1 ? u.array.pop() : u.array[o] = i, u);
}
function ji(e, t) {
  return t && e && t === e.ownerID ? e : new tr(e ? e.array.slice() : [], t);
}
function Lw(e, t) {
  if (t >= to(e._capacity))
    return e._tail;
  if (t < 1 << e._level + X) {
    for (var n = e._root, r = e._level; n && r > 0; )
      n = n.array[t >>> r & ze], r -= X;
    return n;
  }
}
function Jn(e, t, n) {
  t !== void 0 && (t |= 0), n !== void 0 && (n |= 0);
  var r = e.__ownerID || new Sh(), i = e._origin, s = e._capacity, o = i + t, a = n === void 0 ? s : n < 0 ? s + n : i + n;
  if (o === i && a === s)
    return e;
  if (o >= a)
    return e.clear();
  for (var u = e._level, f = e._root, c = 0; o + c < 0; )
    f = new tr(
      f && f.array.length ? [void 0, f] : [],
      r
    ), u += X, c += 1 << u;
  c && (o += c, i += c, a += c, s += c);
  for (var l = to(s), h = to(a); h >= 1 << u + X; )
    f = new tr(
      f && f.array.length ? [f] : [],
      r
    ), u += X;
  var d = e._tail, _ = h < l ? Lw(e, a - 1) : h > l ? new tr([], r) : d;
  if (d && h > l && o < s && d.array.length) {
    f = ji(f, r);
    for (var v = f, g = u; g > X; g -= X) {
      var y = l >>> g & ze;
      v = v.array[y] = ji(v.array[y], r);
    }
    v.array[l >>> X & ze] = d;
  }
  if (a < s && (_ = _ && _.removeAfter(r, 0, a)), o >= h)
    o -= h, a -= h, u = X, f = null, _ = _ && _.removeBefore(r, 0, o);
  else if (o > i || h < l) {
    for (c = 0; f; ) {
      var b = o >>> u & ze;
      if (b !== h >>> u & ze)
        break;
      b && (c += (1 << u) * b), u -= X, f = f.array[b];
    }
    f && o > i && (f = f.removeBefore(r, u, o - c)), f && h < l && (f = f.removeAfter(
      r,
      u,
      h - c
    )), c && (o -= c, a -= c);
  }
  return e.__ownerID ? (e.size = a - o, e._origin = o, e._capacity = a, e._level = u, e._root = f, e._tail = _, e.__hash = void 0, e.__altered = !0, e) : eo(o, a, u, f, _);
}
function to(e) {
  return e < ht ? 0 : e - 1 >>> X << X;
}
var vn = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? As() : Mh(n) ? n : As().withMutations(function(r) {
      var i = Wt(n);
      ft(i.size), i.forEach(function(s, o) {
        return r.set(o, s);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.prototype.toString = function() {
    return this.__toString("OrderedMap {", "}");
  }, t.prototype.get = function(r, i) {
    var s = this._map.get(r);
    return s !== void 0 ? this._list.get(s)[1] : i;
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._map.clear(), this._list.clear(), this.__altered = !0, this) : As();
  }, t.prototype.set = function(r, i) {
    return b_(this, r, i);
  }, t.prototype.remove = function(r) {
    return b_(this, r, j);
  }, t.prototype.__iterate = function(r, i) {
    var s = this;
    return this._list.__iterate(
      function(o) {
        return o && r(o[1], o[0], s);
      },
      i
    );
  }, t.prototype.__iterator = function(r, i) {
    return this._list.fromEntrySeq().__iterator(r, i);
  }, t.prototype.__ensureOwner = function(r) {
    if (r === this.__ownerID)
      return this;
    var i = this._map.__ensureOwner(r), s = this._list.__ensureOwner(r);
    return r ? Jh(i, s, r, this.__hash) : this.size === 0 ? As() : (this.__ownerID = r, this.__altered = !1, this._map = i, this._list = s, this);
  }, t;
}(ri);
vn.isOrderedMap = Mh;
vn.prototype[cr] = !0;
vn.prototype[Mo] = vn.prototype.remove;
function Jh(e, t, n, r) {
  var i = Object.create(vn.prototype);
  return i.size = e ? e.size : 0, i._map = e, i._list = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
var y_;
function As() {
  return y_ || (y_ = Jh(cn(), xa()));
}
function b_(e, t, n) {
  var r = e._map, i = e._list, s = r.get(t), o = s !== void 0, a, u;
  if (n === j) {
    if (!o)
      return e;
    i.size >= ht && i.size >= r.size * 2 ? (u = i.filter(function(f, c) {
      return f !== void 0 && s !== c;
    }), a = u.toKeyedSeq().map(function(f) {
      return f[0];
    }).flip().toMap(), e.__ownerID && (a.__ownerID = u.__ownerID = e.__ownerID)) : (a = r.remove(t), u = s === i.size - 1 ? i.pop() : i.set(s, void 0));
  } else if (o) {
    if (n === i.get(s)[1])
      return e;
    a = r, u = i.set(s, [t, n]);
  } else
    a = r.set(t, i.size), u = i.set(i.size, [t, n]);
  return e.__ownerID ? (e.size = a.size, e._map = a, e._list = u, e.__hash = void 0, e.__altered = !0, e) : Jh(a, u);
}
var jw = "@@__IMMUTABLE_STACK__@@";
function Wa(e) {
  return !!(e && // @ts-expect-error: maybeStack is typed as `{}`, need to change in 6.0 to `maybeStack && typeof maybeStack === 'object' && MAYBE_STACK_SYMBOL in maybeStack`
  e[jw]);
}
var rf = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? fa() : Wa(n) ? n : fa().pushAll(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.prototype.toString = function() {
    return this.__toString("Stack [", "]");
  }, t.prototype.get = function(r, i) {
    var s = this._head;
    for (r = fr(this, r); s && r--; )
      s = s.next;
    return s ? s.value : i;
  }, t.prototype.peek = function() {
    return this._head && this._head.value;
  }, t.prototype.push = function() {
    var r = arguments;
    if (arguments.length === 0)
      return this;
    for (var i = this.size + arguments.length, s = this._head, o = arguments.length - 1; o >= 0; o--)
      s = {
        value: r[o],
        next: s
      };
    return this.__ownerID ? (this.size = i, this._head = s, this.__hash = void 0, this.__altered = !0, this) : Os(i, s);
  }, t.prototype.pushAll = function(r) {
    if (r = e(r), r.size === 0)
      return this;
    if (this.size === 0 && Wa(r))
      return r;
    ft(r.size);
    var i = this.size, s = this._head;
    return r.__iterate(
      function(o) {
        i++, s = {
          value: o,
          next: s
        };
      },
      /* reverse */
      !0
    ), this.__ownerID ? (this.size = i, this._head = s, this.__hash = void 0, this.__altered = !0, this) : Os(i, s);
  }, t.prototype.pop = function() {
    return this.slice(1);
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._head = void 0, this.__hash = void 0, this.__altered = !0, this) : fa();
  }, t.prototype.slice = function(r, i) {
    if (Io(r, i, this.size))
      return this;
    var s = rs(r, this.size), o = Do(i, this.size);
    if (o !== this.size)
      return e.prototype.slice.call(this, r, i);
    for (var a = this.size - s, u = this._head; s--; )
      u = u.next;
    return this.__ownerID ? (this.size = a, this._head = u, this.__hash = void 0, this.__altered = !0, this) : Os(a, u);
  }, t.prototype.__ensureOwner = function(r) {
    return r === this.__ownerID ? this : r ? Os(this.size, this._head, r, this.__hash) : this.size === 0 ? fa() : (this.__ownerID = r, this.__altered = !1, this);
  }, t.prototype.__iterate = function(r, i) {
    var s = this;
    if (i)
      return new Ii(this.toArray()).__iterate(
        function(u, f) {
          return r(u, f, s);
        },
        i
      );
    for (var o = 0, a = this._head; a && r(a.value, o++, this) !== !1; )
      a = a.next;
    return o;
  }, t.prototype.__iterator = function(r, i) {
    if (i)
      return new Ii(this.toArray()).__iterator(r, i);
    var s = 0, o = this._head;
    return new F(function() {
      if (o) {
        var a = o.value;
        return o = o.next, ne(r, s++, a);
      }
      return Ce();
    });
  }, t;
}(ti);
rf.isStack = Wa;
var qe = rf.prototype;
qe[jw] = !0;
qe.shift = qe.pop;
qe.unshift = qe.push;
qe.unshiftAll = qe.pushAll;
qe.withMutations = jo;
qe.wasAltered = Gh;
qe.asImmutable = Bo;
qe["@@transducer/init"] = qe.asMutable = Fo;
qe["@@transducer/step"] = function(e, t) {
  return e.unshift(t);
};
qe["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
function Os(e, t, n, r) {
  var i = Object.create(qe);
  return i.size = e, i._head = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
var m_;
function fa() {
  return m_ || (m_ = Os(0));
}
var Fw = "@@__IMMUTABLE_SET__@@";
function sf(e) {
  return !!(e && // @ts-expect-error: maybeSet is typed as `{}`,  need to change in 6.0 to `maybeSeq && typeof maybeSet === 'object' && MAYBE_SET_SYMBOL in maybeSet`
  e[Fw]);
}
function Zh(e) {
  return sf(e) && Xt(e);
}
function Qh(e, t) {
  if (e === t)
    return !0;
  if (!st(t) || // @ts-expect-error size should exists on Collection
  e.size !== void 0 && t.size !== void 0 && e.size !== t.size || // @ts-expect-error __hash exists on Collection
  e.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  t.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  e.__hash !== t.__hash || Z(e) !== Z(t) || ot(e) !== ot(t) || // @ts-expect-error Range extends Collection, which implements [Symbol.iterator], so it is valid
  Xt(e) !== Xt(t))
    return !1;
  if (e.size === 0 && t.size === 0)
    return !0;
  var n = !Xu(e);
  if (Xt(e)) {
    var r = e.entries();
    return t.every(function(u, f) {
      var c = r.next().value;
      return c && Ae(c[1], u) && (n || Ae(c[0], f));
    }) && r.next().done;
  }
  var i = !1;
  if (e.size === void 0)
    if (t.size === void 0)
      typeof e.cacheResult == "function" && e.cacheResult();
    else {
      i = !0;
      var s = e;
      e = t, t = s;
    }
  var o = !0, a = (
    // @ts-expect-error b is Range | Repeat | Collection<unknown, unknown> as it may have been flipped, and __iterate is valid
    t.__iterate(function(u, f) {
      if (n ? (
        // @ts-expect-error has exists on Collection
        !e.has(u)
      ) : i ? (
        // @ts-expect-error type of `get` does not "catch" the version with `notSetValue`
        !Ae(u, e.get(f, j))
      ) : (
        // @ts-expect-error type of `get` does not "catch" the version with `notSetValue`
        !Ae(e.get(f, j), u)
      ))
        return o = !1, !1;
    })
  );
  return o && // @ts-expect-error size should exists on Collection
  e.size === a;
}
function ii(e, t) {
  var n = function(r) {
    e.prototype[r] = t[r];
  };
  return Object.keys(t).forEach(n), Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(t).forEach(n), e;
}
function ka(e) {
  if (!e || typeof e != "object")
    return e;
  if (!st(e)) {
    if (!lr(e))
      return e;
    e = Le(e);
  }
  if (Z(e)) {
    var t = {};
    return e.__iterate(function(r, i) {
      t[i] = ka(r);
    }), t;
  }
  var n = [];
  return e.__iterate(function(r) {
    n.push(ka(r));
  }), n;
}
var Uo = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? Es() : sf(n) && !Xt(n) ? n : Es().withMutations(function(r) {
      var i = e(n);
      ft(i.size), i.forEach(function(s) {
        return r.add(s);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.fromKeys = function(r) {
    return this(Wt(r).keySeq());
  }, t.intersect = function(r) {
    return r = Ee(r).toArray(), r.length ? Te.intersect.apply(t(r.pop()), r) : Es();
  }, t.union = function(r) {
    return r = Ee(r).toArray(), r.length ? Te.union.apply(t(r.pop()), r) : Es();
  }, t.prototype.toString = function() {
    return this.__toString("Set {", "}");
  }, t.prototype.has = function(r) {
    return this._map.has(r);
  }, t.prototype.add = function(r) {
    return ca(this, this._map.set(r, r));
  }, t.prototype.remove = function(r) {
    return ca(this, this._map.remove(r));
  }, t.prototype.clear = function() {
    return ca(this, this._map.clear());
  }, t.prototype.map = function(r, i) {
    var s = this, o = !1, a = ca(
      this,
      this._map.mapEntries(function(u) {
        var f = u[1], c = r.call(i, f, f, s);
        return c !== f && (o = !0), [c, c];
      }, i)
    );
    return o ? a : this;
  }, t.prototype.union = function() {
    for (var r = [], i = arguments.length; i--; ) r[i] = arguments[i];
    return r = r.filter(function(s) {
      return s.size !== 0;
    }), r.length === 0 ? this : this.size === 0 && !this.__ownerID && r.length === 1 ? this.constructor(r[0]) : this.withMutations(function(s) {
      for (var o = 0; o < r.length; o++)
        typeof r[o] == "string" ? s.add(r[o]) : e(r[o]).forEach(function(a) {
          return s.add(a);
        });
    });
  }, t.prototype.intersect = function() {
    for (var r = [], i = arguments.length; i--; ) r[i] = arguments[i];
    if (r.length === 0)
      return this;
    r = r.map(function(o) {
      return e(o);
    });
    var s = [];
    return this.forEach(function(o) {
      r.every(function(a) {
        return a.includes(o);
      }) || s.push(o);
    }), this.withMutations(function(o) {
      s.forEach(function(a) {
        o.remove(a);
      });
    });
  }, t.prototype.subtract = function() {
    for (var r = [], i = arguments.length; i--; ) r[i] = arguments[i];
    if (r.length === 0)
      return this;
    r = r.map(function(o) {
      return e(o);
    });
    var s = [];
    return this.forEach(function(o) {
      r.some(function(a) {
        return a.includes(o);
      }) && s.push(o);
    }), this.withMutations(function(o) {
      s.forEach(function(a) {
        o.remove(a);
      });
    });
  }, t.prototype.sort = function(r) {
    return Bi(Di(this, r));
  }, t.prototype.sortBy = function(r, i) {
    return Bi(Di(this, i, r));
  }, t.prototype.wasAltered = function() {
    return this._map.wasAltered();
  }, t.prototype.__iterate = function(r, i) {
    var s = this;
    return this._map.__iterate(function(o) {
      return r(o, o, s);
    }, i);
  }, t.prototype.__iterator = function(r, i) {
    return this._map.__iterator(r, i);
  }, t.prototype.__ensureOwner = function(r) {
    if (r === this.__ownerID)
      return this;
    var i = this._map.__ensureOwner(r);
    return r ? this.__make(i, r) : this.size === 0 ? this.__empty() : (this.__ownerID = r, this._map = i, this);
  }, t;
}(is);
Uo.isSet = sf;
var Te = Uo.prototype;
Te[Fw] = !0;
Te[Mo] = Te.remove;
Te.merge = Te.concat = Te.union;
Te.withMutations = jo;
Te.asImmutable = Bo;
Te["@@transducer/init"] = Te.asMutable = Fo;
Te["@@transducer/step"] = function(e, t) {
  return e.add(t);
};
Te["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
Te.__empty = Es;
Te.__make = Bw;
function ca(e, t) {
  return e.__ownerID ? (e.size = t.size, e._map = t, e) : t === e._map ? e : t.size === 0 ? e.__empty() : e.__make(t);
}
function Bw(e, t) {
  var n = Object.create(Te);
  return n.size = e ? e.size : 0, n._map = e, n.__ownerID = t, n;
}
var w_;
function Es() {
  return w_ || (w_ = Bw(cn()));
}
var zw = /* @__PURE__ */ function(e) {
  function t(n, r, i) {
    if (i === void 0 && (i = 1), !(this instanceof t))
      return new t(n, r, i);
    if (Ns(i !== 0, "Cannot step a Range by 0"), Ns(
      n !== void 0,
      "You must define a start value when using Range"
    ), Ns(
      r !== void 0,
      "You must define an end value when using Range"
    ), i = Math.abs(i), r < n && (i = -i), this._start = n, this._end = r, this._step = i, this.size = Math.max(0, Math.ceil((r - n) / i - 1) + 1), this.size === 0) {
      if (Hf)
        return Hf;
      Hf = this;
    }
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.size === 0 ? "Range []" : "Range [ " + this._start + "..." + this._end + (this._step !== 1 ? " by " + this._step : "") + " ]";
  }, t.prototype.get = function(r, i) {
    return this.has(r) ? this._start + fr(this, r) * this._step : i;
  }, t.prototype.includes = function(r) {
    var i = (r - this._start) / this._step;
    return i >= 0 && i < this.size && i === Math.floor(i);
  }, t.prototype.slice = function(r, i) {
    return Io(r, i, this.size) ? this : (r = rs(r, this.size), i = Do(i, this.size), i <= r ? new t(0, 0) : new t(
      this.get(r, this._end),
      this.get(i, this._end),
      this._step
    ));
  }, t.prototype.indexOf = function(r) {
    var i = r - this._start;
    if (i % this._step === 0) {
      var s = i / this._step;
      if (s >= 0 && s < this.size)
        return s;
    }
    return -1;
  }, t.prototype.lastIndexOf = function(r) {
    return this.indexOf(r);
  }, t.prototype.__iterate = function(r, i) {
    for (var s = this.size, o = this._step, a = i ? this._start + (s - 1) * o : this._start, u = 0; u !== s && r(a, i ? s - ++u : u++, this) !== !1; )
      a += i ? -o : o;
    return u;
  }, t.prototype.__iterator = function(r, i) {
    var s = this.size, o = this._step, a = i ? this._start + (s - 1) * o : this._start, u = 0;
    return new F(function() {
      if (u === s)
        return Ce();
      var f = a;
      return a += i ? -o : o, ne(r, i ? s - ++u : u++, f);
    });
  }, t.prototype.equals = function(r) {
    return r instanceof t ? this._start === r._start && this._end === r._end && this._step === r._step : Qh(this, r);
  }, t;
}(qt), Hf;
function ep(e, t, n) {
  for (var r = ww(t), i = 0; i !== r.length; )
    if (e = Fh(e, r[i++], j), e === j)
      return n;
  return e;
}
function Uw(e, t) {
  return ep(this, e, t);
}
function Vw(e, t) {
  return ep(e, t, j) !== j;
}
function NL(e) {
  return Vw(this, e);
}
function Ww() {
  ft(this.size);
  var e = {};
  return this.__iterate(function(t, n) {
    e[n] = t;
  }), e;
}
Ee.Iterator = F;
ii(Ee, {
  // ### Conversion to other types
  toArray: function() {
    ft(this.size);
    var t = new Array(this.size || 0), n = Z(this), r = 0;
    return this.__iterate(function(i, s) {
      t[r++] = n ? [s, i] : i;
    }), t;
  },
  toIndexedSeq: function() {
    return new hw(this);
  },
  toJS: function() {
    return ka(this);
  },
  toKeyedSeq: function() {
    return new nf(this, !0);
  },
  toMap: function() {
    return ri(this.toKeyedSeq());
  },
  toObject: Ww,
  toOrderedMap: function() {
    return vn(this.toKeyedSeq());
  },
  toOrderedSet: function() {
    return Bi(Z(this) ? this.valueSeq() : this);
  },
  toSet: function() {
    return Uo(Z(this) ? this.valueSeq() : this);
  },
  toSetSeq: function() {
    return new pw(this);
  },
  toSeq: function() {
    return ot(this) ? this.toIndexedSeq() : Z(this) ? this.toKeyedSeq() : this.toSetSeq();
  },
  toStack: function() {
    return rf(Z(this) ? this.valueSeq() : this);
  },
  toList: function() {
    return zo(Z(this) ? this.valueSeq() : this);
  },
  // ### Common JavaScript methods and properties
  toString: function() {
    return "[Collection]";
  },
  __toString: function(t, n) {
    return this.size === 0 ? t + n : t + " " + this.toSeq().map(this.__toStringMapper).join(", ") + " " + n;
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  concat: function() {
    for (var t = [], n = arguments.length; n--; ) t[n] = arguments[n];
    return Y(this, cL(this, t));
  },
  includes: function(t) {
    return this.some(function(n) {
      return Ae(n, t);
    });
  },
  entries: function() {
    return this.__iterator(St);
  },
  every: function(t, n) {
    ft(this.size);
    var r = !0;
    return this.__iterate(function(i, s, o) {
      if (!t.call(n, i, s, o))
        return r = !1, !1;
    }), r;
  },
  filter: function(t, n) {
    return Y(this, gw(this, t, n, !0));
  },
  partition: function(t, n) {
    return aL(this, t, n);
  },
  find: function(t, n, r) {
    var i = this.findEntry(t, n);
    return i ? i[1] : r;
  },
  forEach: function(t, n) {
    return ft(this.size), this.__iterate(n ? t.bind(n) : t);
  },
  join: function(t) {
    ft(this.size), t = t !== void 0 ? "" + t : ",";
    var n = "", r = !0;
    return this.__iterate(function(i) {
      r ? r = !1 : n += t, n += i != null ? i.toString() : "";
    }), n;
  },
  keys: function() {
    return this.__iterator(ss);
  },
  map: function(t, n) {
    return Y(this, vw(this, t, n));
  },
  reduce: function(t, n, r) {
    return A_(
      this,
      t,
      n,
      r,
      arguments.length < 2,
      !1
    );
  },
  reduceRight: function(t, n, r) {
    return A_(
      this,
      t,
      n,
      r,
      arguments.length < 2,
      !0
    );
  },
  reverse: function() {
    return Y(this, Ih(this, !0));
  },
  slice: function(t, n) {
    return Y(this, Dh(this, t, n, !0));
  },
  some: function(t, n) {
    ft(this.size);
    var r = !1;
    return this.__iterate(function(i, s, o) {
      if (t.call(n, i, s, o))
        return r = !0, !1;
    }), r;
  },
  sort: function(t) {
    return Y(this, Di(this, t));
  },
  values: function() {
    return this.__iterator(Et);
  },
  // ### More sequential methods
  butLast: function() {
    return this.slice(0, -1);
  },
  isEmpty: function() {
    return this.size !== void 0 ? this.size === 0 : !this.some(function() {
      return !0;
    });
  },
  count: function(t, n) {
    return Mi(
      t ? this.toSeq().filter(t, n) : this
    );
  },
  countBy: function(t, n) {
    return sL(this, t, n);
  },
  equals: function(t) {
    return Qh(this, t);
  },
  entrySeq: function() {
    var t = this;
    if (t._cache)
      return new Ii(t._cache);
    var n = t.toSeq().map(ML).toIndexedSeq();
    return n.fromEntrySeq = function() {
      return t.toSeq();
    }, n;
  },
  filterNot: function(t, n) {
    return this.filter(Kf(t), n);
  },
  findEntry: function(t, n, r) {
    var i = r;
    return this.__iterate(function(s, o, a) {
      if (t.call(n, s, o, a))
        return i = [o, s], !1;
    }), i;
  },
  findKey: function(t, n) {
    var r = this.findEntry(t, n);
    return r && r[0];
  },
  findLast: function(t, n, r) {
    return this.toKeyedSeq().reverse().find(t, n, r);
  },
  findLastEntry: function(t, n, r) {
    return this.toKeyedSeq().reverse().findEntry(t, n, r);
  },
  findLastKey: function(t, n) {
    return this.toKeyedSeq().reverse().findKey(t, n);
  },
  first: function(t) {
    return this.find(nw, null, t);
  },
  flatMap: function(t, n) {
    return Y(this, lL(this, t, n));
  },
  flatten: function(t) {
    return Y(this, bw(this, t, !0));
  },
  fromEntrySeq: function() {
    return new dw(this);
  },
  get: function(t, n) {
    return this.find(function(r, i) {
      return Ae(i, t);
    }, void 0, n);
  },
  getIn: Uw,
  groupBy: function(t, n) {
    return oL(this, t, n);
  },
  has: function(t) {
    return this.get(t, j) !== j;
  },
  hasIn: NL,
  isSubset: function(t) {
    return t = typeof t.includes == "function" ? t : Ee(t), this.every(function(n) {
      return t.includes(n);
    });
  },
  isSuperset: function(t) {
    return t = typeof t.isSubset == "function" ? t : Ee(t), t.isSubset(this);
  },
  keyOf: function(t) {
    return this.findKey(function(n) {
      return Ae(n, t);
    });
  },
  keySeq: function() {
    return this.toSeq().map($L).toIndexedSeq();
  },
  last: function(t) {
    return this.toSeq().reverse().first(t);
  },
  lastKeyOf: function(t) {
    return this.toKeyedSeq().reverse().keyOf(t);
  },
  max: function(t) {
    return aa(this, t);
  },
  maxBy: function(t, n) {
    return aa(this, n, t);
  },
  min: function(t) {
    return aa(
      this,
      t ? O_(t) : S_
    );
  },
  minBy: function(t, n) {
    return aa(
      this,
      n ? O_(n) : S_,
      t
    );
  },
  rest: function() {
    return this.slice(1);
  },
  skip: function(t) {
    return t === 0 ? this : this.slice(Math.max(0, t));
  },
  skipLast: function(t) {
    return t === 0 ? this : this.slice(0, -Math.max(0, t));
  },
  skipWhile: function(t, n) {
    return Y(this, yw(this, t, n, !0));
  },
  skipUntil: function(t, n) {
    return this.skipWhile(Kf(t), n);
  },
  sortBy: function(t, n) {
    return Y(this, Di(this, n, t));
  },
  take: function(t) {
    return this.slice(0, Math.max(0, t));
  },
  takeLast: function(t) {
    return this.slice(-Math.max(0, t));
  },
  takeWhile: function(t, n) {
    return Y(this, uL(this, t, n));
  },
  takeUntil: function(t, n) {
    return this.takeWhile(Kf(t), n);
  },
  update: function(t) {
    return t(this);
  },
  valueSeq: function() {
    return this.toIndexedSeq();
  },
  // ### Hashable Object
  hashCode: function() {
    return this.__hash || (this.__hash = IL(this));
  }
  // ### Internal
  // abstract __iterate(fn, reverse)
  // abstract __iterator(type, reverse)
});
var je = Ee.prototype;
je[sw] = !0;
je[Zu] = je.values;
je.toJSON = je.toArray;
je.__toStringMapper = Js;
je.inspect = je.toSource = function() {
  return this.toString();
};
je.chain = je.flatMap;
je.contains = je.includes;
ii(Wt, {
  // ### More sequential methods
  flip: function() {
    return Y(this, _w(this));
  },
  mapEntries: function(t, n) {
    var r = this, i = 0;
    return Y(
      this,
      this.toSeq().map(function(s, o) {
        return t.call(n, [o, s], i++, r);
      }).fromEntrySeq()
    );
  },
  mapKeys: function(t, n) {
    var r = this;
    return Y(
      this,
      this.toSeq().flip().map(function(i, s) {
        return t.call(n, i, s, r);
      }).flip()
    );
  }
});
var Vo = Wt.prototype;
Vo[za] = !0;
Vo[Zu] = je.entries;
Vo.toJSON = Ww;
Vo.__toStringMapper = function(e, t) {
  return Js(t) + ": " + Js(e);
};
ii(ti, {
  // ### Conversion to other types
  toKeyedSeq: function() {
    return new nf(this, !1);
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  filter: function(t, n) {
    return Y(this, gw(this, t, n, !1));
  },
  findIndex: function(t, n) {
    var r = this.findEntry(t, n);
    return r ? r[0] : -1;
  },
  indexOf: function(t) {
    var n = this.keyOf(t);
    return n === void 0 ? -1 : n;
  },
  lastIndexOf: function(t) {
    var n = this.lastKeyOf(t);
    return n === void 0 ? -1 : n;
  },
  reverse: function() {
    return Y(this, Ih(this, !1));
  },
  slice: function(t, n) {
    return Y(this, Dh(this, t, n, !1));
  },
  splice: function(t, n) {
    var r = arguments.length;
    if (n = Math.max(n || 0, 0), r === 0 || r === 2 && !n)
      return this;
    t = rs(t, t < 0 ? this.count() : this.size);
    var i = this.slice(0, t);
    return Y(
      this,
      r === 1 ? i : i.concat(un(arguments, 2), this.slice(t + n))
    );
  },
  // ### More collection methods
  findLastIndex: function(t, n) {
    var r = this.findLastEntry(t, n);
    return r ? r[0] : -1;
  },
  first: function(t) {
    return this.get(0, t);
  },
  flatten: function(t) {
    return Y(this, bw(this, t, !1));
  },
  get: function(t, n) {
    return t = fr(this, t), t < 0 || this.size === 1 / 0 || this.size !== void 0 && t > this.size ? n : this.find(function(r, i) {
      return i === t;
    }, void 0, n);
  },
  has: function(t) {
    return t = fr(this, t), t >= 0 && (this.size !== void 0 ? this.size === 1 / 0 || t < this.size : this.indexOf(t) !== -1);
  },
  interpose: function(t) {
    return Y(this, hL(this, t));
  },
  interleave: function() {
    var t = [this].concat(un(arguments)), n = ua(this.toSeq(), qt.of, t), r = n.flatten(!0);
    return n.size && (r.size = n.size * t.length), Y(this, r);
  },
  keySeq: function() {
    return zw(0, this.size);
  },
  last: function(t) {
    return this.get(-1, t);
  },
  skipWhile: function(t, n) {
    return Y(this, yw(this, t, n, !1));
  },
  zip: function() {
    var t = [this].concat(un(arguments));
    return Y(this, ua(this, E_, t));
  },
  zipAll: function() {
    var t = [this].concat(un(arguments));
    return Y(this, ua(this, E_, t, !0));
  },
  zipWith: function(t) {
    var n = un(arguments);
    return n[0] = this, Y(this, ua(this, t, n));
  }
});
var us = ti.prototype;
us[Ua] = !0;
us[cr] = !0;
ii(is, {
  // ### ES6 Collection methods (ES6 Array and Map)
  get: function(t, n) {
    return this.has(t) ? t : n;
  },
  includes: function(t) {
    return this.has(t);
  },
  // ### More sequential methods
  keySeq: function() {
    return this.valueSeq();
  }
});
var Fi = is.prototype;
Fi.has = je.includes;
Fi.contains = Fi.includes;
Fi.keys = Fi.values;
ii(mr, Vo);
ii(qt, us);
ii(as, Fi);
function A_(e, t, n, r, i, s) {
  return ft(e.size), e.__iterate(function(o, a, u) {
    i ? (i = !1, n = o) : n = t.call(r, n, o, a, u);
  }, s), n;
}
function $L(e, t) {
  return t;
}
function ML(e, t) {
  return [t, e];
}
function Kf(e) {
  return function() {
    return !e.apply(this, arguments);
  };
}
function O_(e) {
  return function() {
    return -e.apply(this, arguments);
  };
}
function E_() {
  return un(arguments);
}
function S_(e, t) {
  return e < t ? 1 : e > t ? -1 : 0;
}
function IL(e) {
  if (e.size === 1 / 0)
    return 0;
  var t = Xt(e), n = Z(e), r = t ? 1 : 0;
  return e.__iterate(
    n ? t ? function(i, s) {
      r = 31 * r + x_(Ze(i), Ze(s)) | 0;
    } : function(i, s) {
      r = r + x_(Ze(i), Ze(s)) | 0;
    } : t ? function(i) {
      r = 31 * r + Ze(i) | 0;
    } : function(i) {
      r = r + Ze(i) | 0;
    }
  ), DL(e.size, r);
}
function DL(e, t) {
  return t = ys(t, 3432918353), t = ys(t << 15 | t >>> -15, 461845907), t = ys(t << 13 | t >>> -13, 5), t = (t + 3864292196 | 0) ^ e, t = ys(t ^ t >>> 16, 2246822507), t = ys(t ^ t >>> 13, 3266489909), t = tf(t ^ t >>> 16), t;
}
function x_(e, t) {
  return e ^ t + 2654435769 + (e << 6) + (e >> 2) | 0;
}
var Bi = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? Wc() : Zh(n) ? n : Wc().withMutations(function(r) {
      var i = is(n);
      ft(i.size), i.forEach(function(s) {
        return r.add(s);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.fromKeys = function(r) {
    return this(Wt(r).keySeq());
  }, t.prototype.toString = function() {
    return this.__toString("OrderedSet {", "}");
  }, t;
}(Uo);
Bi.isOrderedSet = Zh;
var si = Bi.prototype;
si[cr] = !0;
si.zip = us.zip;
si.zipWith = us.zipWith;
si.zipAll = us.zipAll;
si.__empty = Wc;
si.__make = kw;
function kw(e, t) {
  var n = Object.create(si);
  return n.size = e ? e.size : 0, n._map = e, n.__ownerID = t, n;
}
var T_;
function Wc() {
  return T_ || (T_ = kw(As()));
}
var CL = {
  LeftThenRight: -1,
  RightThenLeft: 1
};
function LL(e) {
  if (br(e))
    throw new Error(
      "Can not call `Record` with an immutable Record as default values. Use a plain javascript object instead."
    );
  if (kt(e))
    throw new Error(
      "Can not call `Record` with an immutable Collection as default values. Use a plain javascript object instead."
    );
  if (e === null || typeof e != "object")
    throw new Error(
      "Can not call `Record` with a non-object as default values. Use a plain javascript object instead."
    );
}
var ge = function(t, n) {
  var r;
  LL(t);
  var i = function(a) {
    var u = this;
    if (a instanceof i)
      return a;
    if (!(this instanceof i))
      return new i(a);
    if (!r) {
      r = !0;
      var f = Object.keys(t), c = s._indices = {};
      s._name = n, s._keys = f, s._defaultValues = t;
      for (var l = 0; l < f.length; l++) {
        var h = f[l];
        c[h] = l, s[h] ? typeof console == "object" && console.warn && console.warn(
          "Cannot define " + np(this) + ' with property "' + h + '" since that property name is part of the Record API.'
        ) : jL(s, h);
      }
    }
    return this.__ownerID = void 0, this._values = zo().withMutations(function(d) {
      d.setSize(u._keys.length), Wt(a).forEach(function(_, v) {
        d.set(u._indices[v], _ === u._defaultValues[v] ? void 0 : _);
      });
    }), this;
  }, s = i.prototype = Object.create(Q);
  return s.constructor = i, n && (i.displayName = n), i;
};
ge.prototype.toString = function() {
  for (var t = np(this) + " { ", n = this._keys, r, i = 0, s = n.length; i !== s; i++)
    r = n[i], t += (i ? ", " : "") + r + ": " + Js(this.get(r));
  return t + " }";
};
ge.prototype.equals = function(t) {
  return this === t || br(t) && zi(this).equals(zi(t));
};
ge.prototype.hashCode = function() {
  return zi(this).hashCode();
};
ge.prototype.has = function(t) {
  return this._indices.hasOwnProperty(t);
};
ge.prototype.get = function(t, n) {
  if (!this.has(t))
    return n;
  var r = this._indices[t], i = this._values.get(r);
  return i === void 0 ? this._defaultValues[t] : i;
};
ge.prototype.set = function(t, n) {
  if (this.has(t)) {
    var r = this._values.set(
      this._indices[t],
      n === this._defaultValues[t] ? void 0 : n
    );
    if (r !== this._values && !this.__ownerID)
      return tp(this, r);
  }
  return this;
};
ge.prototype.remove = function(t) {
  return this.set(t);
};
ge.prototype.clear = function() {
  var t = this._values.clear().setSize(this._keys.length);
  return this.__ownerID ? this : tp(this, t);
};
ge.prototype.wasAltered = function() {
  return this._values.wasAltered();
};
ge.prototype.toSeq = function() {
  return zi(this);
};
ge.prototype.toJS = function() {
  return ka(this);
};
ge.prototype.entries = function() {
  return this.__iterator(St);
};
ge.prototype.__iterator = function(t, n) {
  return zi(this).__iterator(t, n);
};
ge.prototype.__iterate = function(t, n) {
  return zi(this).__iterate(t, n);
};
ge.prototype.__ensureOwner = function(t) {
  if (t === this.__ownerID)
    return this;
  var n = this._values.__ensureOwner(t);
  return t ? tp(this, n, t) : (this.__ownerID = t, this._values = n, this);
};
ge.isRecord = br;
ge.getDescriptiveName = np;
var Q = ge.prototype;
Q[aw] = !0;
Q[Mo] = Q.remove;
Q.deleteIn = Q.removeIn = zh;
Q.getIn = Uw;
Q.hasIn = je.hasIn;
Q.merge = Rw;
Q.mergeWith = Pw;
Q.mergeIn = kh;
Q.mergeDeep = $w;
Q.mergeDeepWith = Mw;
Q.mergeDeepIn = qh;
Q.setIn = Bh;
Q.update = Vh;
Q.updateIn = Wh;
Q.withMutations = jo;
Q.asMutable = Fo;
Q.asImmutable = Bo;
Q[Zu] = Q.entries;
Q.toJSON = Q.toObject = je.toObject;
Q.inspect = Q.toSource = function() {
  return this.toString();
};
function tp(e, t, n) {
  var r = Object.create(Object.getPrototypeOf(e));
  return r._values = t, r.__ownerID = n, r;
}
function np(e) {
  return e.constructor.displayName || e.constructor.name || "Record";
}
function zi(e) {
  return Nh(e._keys.map(function(t) {
    return [t, e.get(t)];
  }));
}
function jL(e, t) {
  try {
    Object.defineProperty(e, t, {
      get: function() {
        return this.get(t);
      },
      set: function(n) {
        Ns(this.__ownerID, "Cannot set on an immutable record."), this.set(t, n);
      }
    });
  } catch {
  }
}
var FL = /* @__PURE__ */ function(e) {
  function t(n, r) {
    if (!(this instanceof t))
      return new t(n, r);
    if (this._value = n, this.size = r === void 0 ? 1 / 0 : Math.max(0, r), this.size === 0) {
      if (Yf)
        return Yf;
      Yf = this;
    }
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.size === 0 ? "Repeat []" : "Repeat [ " + this._value + " " + this.size + " times ]";
  }, t.prototype.get = function(r, i) {
    return this.has(r) ? this._value : i;
  }, t.prototype.includes = function(r) {
    return Ae(this._value, r);
  }, t.prototype.slice = function(r, i) {
    var s = this.size;
    return Io(r, i, s) ? this : new t(
      this._value,
      Do(i, s) - rs(r, s)
    );
  }, t.prototype.reverse = function() {
    return this;
  }, t.prototype.indexOf = function(r) {
    return Ae(this._value, r) ? 0 : -1;
  }, t.prototype.lastIndexOf = function(r) {
    return Ae(this._value, r) ? this.size : -1;
  }, t.prototype.__iterate = function(r, i) {
    for (var s = this.size, o = 0; o !== s && r(this._value, i ? s - ++o : o++, this) !== !1; )
      ;
    return o;
  }, t.prototype.__iterator = function(r, i) {
    var s = this, o = this.size, a = 0;
    return new F(
      function() {
        return a === o ? Ce() : ne(r, i ? o - ++a : a++, s._value);
      }
    );
  }, t.prototype.equals = function(r) {
    return r instanceof t ? Ae(this._value, r._value) : Qh(this, r);
  }, t;
}(qt), Yf;
function BL(e, t) {
  return qw(
    [],
    t || zL,
    e,
    "",
    t && t.length > 2 ? [] : void 0,
    { "": e }
  );
}
function qw(e, t, n, r, i, s) {
  if (typeof n != "string" && !kt(n) && (Th(n) || xh(n) || jh(n))) {
    if (~e.indexOf(n))
      throw new TypeError("Cannot convert circular structure to Immutable");
    e.push(n), i && r !== "" && i.push(r);
    var o = t.call(
      s,
      r,
      Le(n).map(
        function(a, u) {
          return qw(e, t, a, u, i, n);
        }
      ),
      i && i.slice()
    );
    return e.pop(), i && i.pop(), o;
  }
  return n;
}
function zL(e, t) {
  return ot(t) ? t.toList() : Z(t) ? t.toMap() : t.toSet();
}
var UL = "5.1.3", VL = Ee;
const M5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Collection: Ee,
  Iterable: VL,
  List: zo,
  Map: ri,
  OrderedMap: vn,
  OrderedSet: Bi,
  PairSorting: CL,
  Range: zw,
  Record: ge,
  Repeat: FL,
  Seq: Le,
  Set: Uo,
  Stack: rf,
  fromJS: BL,
  get: Fh,
  getIn: ep,
  has: Aw,
  hasIn: Vw,
  hash: Ze,
  is: Ae,
  isAssociative: Xu,
  isCollection: st,
  isImmutable: kt,
  isIndexed: ot,
  isKeyed: Z,
  isList: Xh,
  isMap: ef,
  isOrdered: Xt,
  isOrderedMap: Mh,
  isOrderedSet: Zh,
  isPlainObject: jh,
  isRecord: br,
  isSeq: Ju,
  isSet: sf,
  isStack: Wa,
  isValueObject: Fc,
  merge: dL,
  mergeDeep: vL,
  mergeDeepWith: gL,
  mergeWith: _L,
  remove: Ow,
  removeIn: Tw,
  set: Ew,
  setIn: xw,
  update: Uh,
  updateIn: ni,
  version: UL
}, Symbol.toStringTag, { value: "Module" }));
/**
* @vue/reactivity v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function WL(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const kL = Object.freeze({}), qL = () => {
}, qa = Object.assign, GL = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, HL = Object.prototype.hasOwnProperty, Ga = (e, t) => HL.call(e, t), Bn = Array.isArray, Si = (e) => of(e) === "[object Map]", KL = (e) => of(e) === "[object Set]", no = (e) => typeof e == "function", YL = (e) => typeof e == "string", Wo = (e) => typeof e == "symbol", zr = (e) => e !== null && typeof e == "object", XL = Object.prototype.toString, of = (e) => XL.call(e), Gw = (e) => of(e).slice(8, -1), JL = (e) => of(e) === "[object Object]", rp = (e) => YL(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ZL = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, QL = ZL((e) => e.charAt(0).toUpperCase() + e.slice(1)), nr = (e, t) => !Object.is(e, t), e3 = (e, t, n, r = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: r,
    value: n
  });
};
function at(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let Me;
class Hw {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = Me, !t && Me && (this.index = (Me.scopes || (Me.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].pause();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].resume();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = Me;
      try {
        return Me = this, t();
      } finally {
        Me = n;
      }
    } else
      at("cannot run an inactive effect scope.");
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Me, Me = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (Me = this.prevScope, this.prevScope = void 0);
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, r;
      for (n = 0, r = this.effects.length; n < r; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, r = this.cleanups.length; n < r; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        for (n = 0, r = this.scopes.length; n < r; n++)
          this.scopes[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const i = this.parent.scopes.pop();
        i && i !== this && (this.parent.scopes[this.index] = i, i.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function t3(e) {
  return new Hw(e);
}
function Kw() {
  return Me;
}
function n3(e, t = !1) {
  Me ? Me.cleanups.push(e) : t || at(
    "onScopeDispose() is called when there is no active effect scope to be associated with."
  );
}
let z;
const r3 = {
  ACTIVE: 1,
  1: "ACTIVE",
  RUNNING: 2,
  2: "RUNNING",
  TRACKING: 4,
  4: "TRACKING",
  NOTIFIED: 8,
  8: "NOTIFIED",
  DIRTY: 16,
  16: "DIRTY",
  ALLOW_RECURSE: 32,
  32: "ALLOW_RECURSE",
  PAUSED: 64,
  64: "PAUSED",
  EVALUATED: 128,
  128: "EVALUATED"
}, Xf = /* @__PURE__ */ new WeakSet();
class ro {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Me && Me.active && Me.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Xf.has(this) && (Xf.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Xw(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, R_(this), Jw(this);
    const t = z, n = _t;
    z = this, _t = !0;
    try {
      return this.fn();
    } finally {
      z !== this && at(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Zw(this), z = t, _t = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        op(t);
      this.deps = this.depsTail = void 0, R_(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Xf.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    kc(this) && this.run();
  }
  get dirty() {
    return kc(this);
  }
}
let Yw = 0, Ms, Is;
function Xw(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Is, Is = e;
    return;
  }
  e.next = Ms, Ms = e;
}
function ip() {
  Yw++;
}
function sp() {
  if (--Yw > 0)
    return;
  if (Is) {
    let t = Is;
    for (Is = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Ms; ) {
    let t = Ms;
    for (Ms = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (r) {
          e || (e = r);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function Jw(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Zw(e) {
  let t, n = e.depsTail, r = n;
  for (; r; ) {
    const i = r.prevDep;
    r.version === -1 ? (r === n && (n = i), op(r), i3(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = i;
  }
  e.deps = t, e.depsTail = n;
}
function kc(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Qw(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Qw(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === io) || (e.globalVersion = io, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !kc(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = z, r = _t;
  z = e, _t = !0;
  try {
    Jw(e);
    const i = e.fn(e._value);
    (t.version === 0 || nr(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    z = n, _t = r, Zw(e), e.flags &= -3;
  }
}
function op(e, t = !1) {
  const { dep: n, prevSub: r, nextSub: i } = e;
  if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subsHead === e && (n.subsHead = i), n.subs === e && (n.subs = r, !r && n.computed)) {
    n.computed.flags &= -5;
    for (let s = n.computed.deps; s; s = s.nextDep)
      op(s, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function i3(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function s3(e, t) {
  e.effect instanceof ro && (e = e.effect.fn);
  const n = new ro(e);
  t && qa(n, t);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const r = n.run.bind(n);
  return r.effect = n, r;
}
function o3(e) {
  e.effect.stop();
}
let _t = !0;
const ap = [];
function up() {
  ap.push(_t), _t = !1;
}
function a3() {
  ap.push(_t), _t = !0;
}
function fp() {
  const e = ap.pop();
  _t = e === void 0 ? !0 : e;
}
function u3(e, t = !1) {
  z instanceof ro ? z.cleanup = e : t || at(
    "onEffectCleanup() was called when there was no active effect to associate with."
  );
}
function R_(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = z;
    z = void 0;
    try {
      t();
    } finally {
      z = n;
    }
  }
}
let io = 0;
class f3 {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class af {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(t) {
    if (!z || !_t || z === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== z)
      n = this.activeLink = new f3(z, this), z.deps ? (n.prevDep = z.depsTail, z.depsTail.nextDep = n, z.depsTail = n) : z.deps = z.depsTail = n, eA(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const r = n.nextDep;
      r.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = r), n.prevDep = z.depsTail, n.nextDep = void 0, z.depsTail.nextDep = n, z.depsTail = n, z.deps === n && (z.deps = r);
    }
    return z.onTrack && z.onTrack(
      qa(
        {
          effect: z
        },
        t
      )
    ), n;
  }
  trigger(t) {
    this.version++, io++, this.notify(t);
  }
  notify(t) {
    ip();
    try {
      for (let n = this.subsHead; n; n = n.nextSub)
        n.sub.onTrigger && !(n.sub.flags & 8) && n.sub.onTrigger(
          qa(
            {
              effect: n.sub
            },
            t
          )
        );
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      sp();
    }
  }
}
function eA(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let r = t.deps; r; r = r.nextDep)
        eA(r);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const Ha = /* @__PURE__ */ new WeakMap(), rr = Symbol(
  "Object iterate"
), Ka = Symbol(
  "Map keys iterate"
), Ui = Symbol(
  "Array iterate"
);
function Be(e, t, n) {
  if (_t && z) {
    let r = Ha.get(e);
    r || Ha.set(e, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || (r.set(n, i = new af()), i.map = r, i.key = n), i.track({
      target: e,
      type: t,
      key: n
    });
  }
}
function Ln(e, t, n, r, i, s) {
  const o = Ha.get(e);
  if (!o) {
    io++;
    return;
  }
  const a = (u) => {
    u && u.trigger({
      target: e,
      type: t,
      key: n,
      newValue: r,
      oldValue: i,
      oldTarget: s
    });
  };
  if (ip(), t === "clear")
    o.forEach(a);
  else {
    const u = Bn(e), f = u && rp(n);
    if (u && n === "length") {
      const c = Number(r);
      o.forEach((l, h) => {
        (h === "length" || h === Ui || !Wo(h) && h >= c) && a(l);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && a(o.get(n)), f && a(o.get(Ui)), t) {
        case "add":
          u ? f && a(o.get("length")) : (a(o.get(rr)), Si(e) && a(o.get(Ka)));
          break;
        case "delete":
          u || (a(o.get(rr)), Si(e) && a(o.get(Ka)));
          break;
        case "set":
          Si(e) && a(o.get(rr));
          break;
      }
  }
  sp();
}
function c3(e, t) {
  const n = Ha.get(e);
  return n && n.get(t);
}
function Rr(e) {
  const t = W(e);
  return t === e ? t : (Be(t, "iterate", Ui), Ct(e) ? t : t.map(Ie));
}
function uf(e) {
  return Be(e = W(e), "iterate", Ui), e;
}
const l3 = {
  __proto__: null,
  [Symbol.iterator]() {
    return Jf(this, Symbol.iterator, Ie);
  },
  concat(...e) {
    return Rr(this).concat(
      ...e.map((t) => Bn(t) ? Rr(t) : t)
    );
  },
  entries() {
    return Jf(this, "entries", (e) => (e[1] = Ie(e[1]), e));
  },
  every(e, t) {
    return In(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return In(this, "filter", e, t, (n) => n.map(Ie), arguments);
  },
  find(e, t) {
    return In(this, "find", e, t, Ie, arguments);
  },
  findIndex(e, t) {
    return In(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return In(this, "findLast", e, t, Ie, arguments);
  },
  findLastIndex(e, t) {
    return In(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return In(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Zf(this, "includes", e);
  },
  indexOf(...e) {
    return Zf(this, "indexOf", e);
  },
  join(e) {
    return Rr(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Zf(this, "lastIndexOf", e);
  },
  map(e, t) {
    return In(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return bs(this, "pop");
  },
  push(...e) {
    return bs(this, "push", e);
  },
  reduce(e, ...t) {
    return P_(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return P_(this, "reduceRight", e, t);
  },
  shift() {
    return bs(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return In(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return bs(this, "splice", e);
  },
  toReversed() {
    return Rr(this).toReversed();
  },
  toSorted(e) {
    return Rr(this).toSorted(e);
  },
  toSpliced(...e) {
    return Rr(this).toSpliced(...e);
  },
  unshift(...e) {
    return bs(this, "unshift", e);
  },
  values() {
    return Jf(this, "values", Ie);
  }
};
function Jf(e, t, n) {
  const r = uf(e), i = r[t]();
  return r !== e && !Ct(e) && (i._next = i.next, i.next = () => {
    const s = i._next();
    return s.done || (s.value = n(s.value)), s;
  }), i;
}
const h3 = Array.prototype;
function In(e, t, n, r, i, s) {
  const o = uf(e), a = o !== e && !Ct(e), u = o[t];
  if (u !== h3[t]) {
    const l = u.apply(e, s);
    return a ? Ie(l) : l;
  }
  let f = n;
  o !== e && (a ? f = function(l, h) {
    return n.call(this, Ie(l), h, e);
  } : n.length > 2 && (f = function(l, h) {
    return n.call(this, l, h, e);
  }));
  const c = u.call(o, f, r);
  return a && i ? i(c) : c;
}
function P_(e, t, n, r) {
  const i = uf(e);
  let s = n;
  return i !== e && (Ct(e) ? n.length > 3 && (s = function(o, a, u) {
    return n.call(this, o, a, u, e);
  }) : s = function(o, a, u) {
    return n.call(this, o, Ie(a), u, e);
  }), i[t](s, ...r);
}
function Zf(e, t, n) {
  const r = W(e);
  Be(r, "iterate", Ui);
  const i = r[t](...n);
  return (i === -1 || i === !1) && lp(n[0]) ? (n[0] = W(n[0]), r[t](...n)) : i;
}
function bs(e, t, n = []) {
  up(), ip();
  const r = W(e)[t].apply(e, n);
  return sp(), fp(), r;
}
const p3 = /* @__PURE__ */ WL("__proto__,__v_isRef,__isVue"), tA = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Wo)
);
function d3(e) {
  Wo(e) || (e = String(e));
  const t = W(this);
  return Be(t, "has", e), t.hasOwnProperty(e);
}
class nA {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, r) {
    if (n === "__v_skip") return t.__v_skip;
    const i = this._isReadonly, s = this._isShallow;
    if (n === "__v_isReactive")
      return !i;
    if (n === "__v_isReadonly")
      return i;
    if (n === "__v_isShallow")
      return s;
    if (n === "__v_raw")
      return r === (i ? s ? uA : aA : s ? oA : sA).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(r) ? t : void 0;
    const o = Bn(t);
    if (!i) {
      let u;
      if (o && (u = l3[n]))
        return u;
      if (n === "hasOwnProperty")
        return d3;
    }
    const a = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      Ve(t) ? t : r
    );
    if ((Wo(n) ? tA.has(n) : p3(n)) || (i || Be(t, "get", n), s))
      return a;
    if (Ve(a)) {
      const u = o && rp(n) ? a : a.value;
      return i && zr(u) ? Ya(u) : u;
    }
    return zr(a) ? i ? Ya(a) : cp(a) : a;
  }
}
class rA extends nA {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, r, i) {
    let s = t[n];
    if (!this._isShallow) {
      const u = hr(s);
      if (!Ct(r) && !hr(r) && (s = W(s), r = W(r)), !Bn(t) && Ve(s) && !Ve(r))
        return u ? (at(
          `Set operation on key "${String(n)}" failed: target is readonly.`,
          t[n]
        ), !0) : (s.value = r, !0);
    }
    const o = Bn(t) && rp(n) ? Number(n) < t.length : Ga(t, n), a = Reflect.set(
      t,
      n,
      r,
      Ve(t) ? t : i
    );
    return t === W(i) && (o ? nr(r, s) && Ln(t, "set", n, r, s) : Ln(t, "add", n, r)), a;
  }
  deleteProperty(t, n) {
    const r = Ga(t, n), i = t[n], s = Reflect.deleteProperty(t, n);
    return s && r && Ln(t, "delete", n, void 0, i), s;
  }
  has(t, n) {
    const r = Reflect.has(t, n);
    return (!Wo(n) || !tA.has(n)) && Be(t, "has", n), r;
  }
  ownKeys(t) {
    return Be(
      t,
      "iterate",
      Bn(t) ? "length" : rr
    ), Reflect.ownKeys(t);
  }
}
class iA extends nA {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return at(
      `Set operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, n) {
    return at(
      `Delete operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
}
const _3 = /* @__PURE__ */ new rA(), v3 = /* @__PURE__ */ new iA(), g3 = /* @__PURE__ */ new rA(!0), y3 = /* @__PURE__ */ new iA(!0), qc = (e) => e, la = (e) => Reflect.getPrototypeOf(e);
function b3(e, t, n) {
  return function(...r) {
    const i = this.__v_raw, s = W(i), o = Si(s), a = e === "entries" || e === Symbol.iterator && o, u = e === "keys" && o, f = i[e](...r), c = n ? qc : t ? Xa : Ie;
    return !t && Be(
      s,
      "iterate",
      u ? Ka : rr
    ), {
      // iterator protocol
      next() {
        const { value: l, done: h } = f.next();
        return h ? { value: l, done: h } : {
          value: a ? [c(l[0]), c(l[1])] : c(l),
          done: h
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function ha(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      at(
        `${QL(e)} operation ${n}failed: target is readonly.`,
        W(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function m3(e, t) {
  const n = {
    get(i) {
      const s = this.__v_raw, o = W(s), a = W(i);
      e || (nr(i, a) && Be(o, "get", i), Be(o, "get", a));
      const { has: u } = la(o), f = t ? qc : e ? Xa : Ie;
      if (u.call(o, i))
        return f(s.get(i));
      if (u.call(o, a))
        return f(s.get(a));
      s !== o && s.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && Be(W(i), "iterate", rr), i.size;
    },
    has(i) {
      const s = this.__v_raw, o = W(s), a = W(i);
      return e || (nr(i, a) && Be(o, "has", i), Be(o, "has", a)), i === a ? s.has(i) : s.has(i) || s.has(a);
    },
    forEach(i, s) {
      const o = this, a = o.__v_raw, u = W(a), f = t ? qc : e ? Xa : Ie;
      return !e && Be(u, "iterate", rr), a.forEach((c, l) => i.call(s, f(c), f(l), o));
    }
  };
  return qa(
    n,
    e ? {
      add: ha("add"),
      set: ha("set"),
      delete: ha("delete"),
      clear: ha("clear")
    } : {
      add(i) {
        !t && !Ct(i) && !hr(i) && (i = W(i));
        const s = W(this);
        return la(s).has.call(s, i) || (s.add(i), Ln(s, "add", i, i)), this;
      },
      set(i, s) {
        !t && !Ct(s) && !hr(s) && (s = W(s));
        const o = W(this), { has: a, get: u } = la(o);
        let f = a.call(o, i);
        f ? N_(o, a, i) : (i = W(i), f = a.call(o, i));
        const c = u.call(o, i);
        return o.set(i, s), f ? nr(s, c) && Ln(o, "set", i, s, c) : Ln(o, "add", i, s), this;
      },
      delete(i) {
        const s = W(this), { has: o, get: a } = la(s);
        let u = o.call(s, i);
        u ? N_(s, o, i) : (i = W(i), u = o.call(s, i));
        const f = a ? a.call(s, i) : void 0, c = s.delete(i);
        return u && Ln(s, "delete", i, void 0, f), c;
      },
      clear() {
        const i = W(this), s = i.size !== 0, o = Si(i) ? new Map(i) : new Set(i), a = i.clear();
        return s && Ln(
          i,
          "clear",
          void 0,
          void 0,
          o
        ), a;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((i) => {
    n[i] = b3(i, e, t);
  }), n;
}
function ff(e, t) {
  const n = m3(e, t);
  return (r, i, s) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? r : Reflect.get(
    Ga(n, i) && i in r ? n : r,
    i,
    s
  );
}
const w3 = {
  get: /* @__PURE__ */ ff(!1, !1)
}, A3 = {
  get: /* @__PURE__ */ ff(!1, !0)
}, O3 = {
  get: /* @__PURE__ */ ff(!0, !1)
}, E3 = {
  get: /* @__PURE__ */ ff(!0, !0)
};
function N_(e, t, n) {
  const r = W(n);
  if (r !== n && t.call(e, r)) {
    const i = Gw(e);
    at(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const sA = /* @__PURE__ */ new WeakMap(), oA = /* @__PURE__ */ new WeakMap(), aA = /* @__PURE__ */ new WeakMap(), uA = /* @__PURE__ */ new WeakMap();
function S3(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function x3(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : S3(Gw(e));
}
function cp(e) {
  return hr(e) ? e : cf(
    e,
    !1,
    _3,
    w3,
    sA
  );
}
function T3(e) {
  return cf(
    e,
    !1,
    g3,
    A3,
    oA
  );
}
function Ya(e) {
  return cf(
    e,
    !0,
    v3,
    O3,
    aA
  );
}
function R3(e) {
  return cf(
    e,
    !0,
    y3,
    E3,
    uA
  );
}
function cf(e, t, n, r, i) {
  if (!zr(e))
    return at(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = x3(e);
  if (s === 0)
    return e;
  const o = i.get(e);
  if (o)
    return o;
  const a = new Proxy(
    e,
    s === 2 ? r : n
  );
  return i.set(e, a), a;
}
function xi(e) {
  return hr(e) ? xi(e.__v_raw) : !!(e && e.__v_isReactive);
}
function hr(e) {
  return !!(e && e.__v_isReadonly);
}
function Ct(e) {
  return !!(e && e.__v_isShallow);
}
function lp(e) {
  return e ? !!e.__v_raw : !1;
}
function W(e) {
  const t = e && e.__v_raw;
  return t ? W(t) : e;
}
function P3(e) {
  return !Ga(e, "__v_skip") && Object.isExtensible(e) && e3(e, "__v_skip", !0), e;
}
const Ie = (e) => zr(e) ? cp(e) : e, Xa = (e) => zr(e) ? Ya(e) : e;
function Ve(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function fA(e) {
  return cA(e, !1);
}
function N3(e) {
  return cA(e, !0);
}
function cA(e, t) {
  return Ve(e) ? e : new $3(e, t);
}
class $3 {
  constructor(t, n) {
    this.dep = new af(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : W(t), this._value = n ? t : Ie(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }), this._value;
  }
  set value(t) {
    const n = this._rawValue, r = this.__v_isShallow || Ct(t) || hr(t);
    t = r ? t : W(t), nr(t, n) && (this._rawValue = t, this._value = r ? t : Ie(t), this.dep.trigger({
      target: this,
      type: "set",
      key: "value",
      newValue: t,
      oldValue: n
    }));
  }
}
function M3(e) {
  e.dep && e.dep.trigger({
    target: e,
    type: "set",
    key: "value",
    newValue: e._value
  });
}
function hp(e) {
  return Ve(e) ? e.value : e;
}
function I3(e) {
  return no(e) ? e() : hp(e);
}
const D3 = {
  get: (e, t, n) => t === "__v_raw" ? e : hp(Reflect.get(e, t, n)),
  set: (e, t, n, r) => {
    const i = e[t];
    return Ve(i) && !Ve(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
  }
};
function C3(e) {
  return xi(e) ? e : new Proxy(e, D3);
}
class L3 {
  constructor(t) {
    this.__v_isRef = !0, this._value = void 0;
    const n = this.dep = new af(), { get: r, set: i } = t(n.track.bind(n), n.trigger.bind(n));
    this._get = r, this._set = i;
  }
  get value() {
    return this._value = this._get();
  }
  set value(t) {
    this._set(t);
  }
}
function j3(e) {
  return new L3(e);
}
function F3(e) {
  lp(e) || at("toRefs() expects a reactive object but received a plain one.");
  const t = Bn(e) ? new Array(e.length) : {};
  for (const n in e)
    t[n] = lA(e, n);
  return t;
}
class B3 {
  constructor(t, n, r) {
    this._object = t, this._key = n, this._defaultValue = r, this.__v_isRef = !0, this._value = void 0;
  }
  get value() {
    const t = this._object[this._key];
    return this._value = t === void 0 ? this._defaultValue : t;
  }
  set value(t) {
    this._object[this._key] = t;
  }
  get dep() {
    return c3(W(this._object), this._key);
  }
}
class z3 {
  constructor(t) {
    this._getter = t, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
function U3(e, t, n) {
  return Ve(e) ? e : no(e) ? new z3(e) : zr(e) && arguments.length > 1 ? lA(e, t, n) : fA(e);
}
function lA(e, t, n) {
  const r = e[t];
  return Ve(r) ? r : new B3(e, t, n);
}
class V3 {
  constructor(t, n, r) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new af(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = io - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = r;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    z !== this)
      return Xw(this, !0), !0;
  }
  get value() {
    const t = this.dep.track({
      target: this,
      type: "get",
      key: "value"
    });
    return Qw(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter ? this.setter(t) : at("Write operation failed: computed value is readonly");
  }
}
function W3(e, t, n = !1) {
  let r, i;
  no(e) ? r = e : (r = e.get, i = e.set);
  const s = new V3(r, i, n);
  return t && !n && (s.onTrack = t.onTrack, s.onTrigger = t.onTrigger), s;
}
const k3 = {
  GET: "get",
  HAS: "has",
  ITERATE: "iterate"
}, q3 = {
  SET: "set",
  ADD: "add",
  DELETE: "delete",
  CLEAR: "clear"
}, G3 = {
  SKIP: "__v_skip",
  IS_REACTIVE: "__v_isReactive",
  IS_READONLY: "__v_isReadonly",
  IS_SHALLOW: "__v_isShallow",
  RAW: "__v_raw",
  IS_REF: "__v_isRef"
}, H3 = {
  WATCH_GETTER: 2,
  2: "WATCH_GETTER",
  WATCH_CALLBACK: 3,
  3: "WATCH_CALLBACK",
  WATCH_CLEANUP: 4,
  4: "WATCH_CLEANUP"
}, pa = {}, Ja = /* @__PURE__ */ new WeakMap();
let Zn;
function K3() {
  return Zn;
}
function hA(e, t = !1, n = Zn) {
  if (n) {
    let r = Ja.get(n);
    r || Ja.set(n, r = []), r.push(e);
  } else t || at(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function Y3(e, t, n = kL) {
  const { immediate: r, deep: i, once: s, scheduler: o, augmentJob: a, call: u } = n, f = (A) => {
    (n.onWarn || at)(
      "Invalid watch source: ",
      A,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, c = (A) => i ? A : Ct(A) || i === !1 || i === 0 ? jn(A, 1) : jn(A);
  let l, h, d, _, v = !1, g = !1;
  if (Ve(e) ? (h = () => e.value, v = Ct(e)) : xi(e) ? (h = () => c(e), v = !0) : Bn(e) ? (g = !0, v = e.some((A) => xi(A) || Ct(A)), h = () => e.map((A) => {
    if (Ve(A))
      return A.value;
    if (xi(A))
      return c(A);
    if (no(A))
      return u ? u(A, 2) : A();
    f(A);
  })) : no(e) ? t ? h = u ? () => u(e, 2) : e : h = () => {
    if (d) {
      up();
      try {
        d();
      } finally {
        fp();
      }
    }
    const A = Zn;
    Zn = l;
    try {
      return u ? u(e, 3, [_]) : e(_);
    } finally {
      Zn = A;
    }
  } : (h = qL, f(e)), t && i) {
    const A = h, S = i === !0 ? 1 / 0 : i;
    h = () => jn(A(), S);
  }
  const y = Kw(), b = () => {
    l.stop(), y && y.active && GL(y.effects, l);
  };
  if (s && t) {
    const A = t;
    t = (...S) => {
      A(...S), b();
    };
  }
  let w = g ? new Array(e.length).fill(pa) : pa;
  const m = (A) => {
    if (!(!(l.flags & 1) || !l.dirty && !A))
      if (t) {
        const S = l.run();
        if (i || v || (g ? S.some((R, B) => nr(R, w[B])) : nr(S, w))) {
          d && d();
          const R = Zn;
          Zn = l;
          try {
            const B = [
              S,
              // pass undefined as the old value when it's changed for the first time
              w === pa ? void 0 : g && w[0] === pa ? [] : w,
              _
            ];
            w = S, u ? u(t, 3, B) : (
              // @ts-expect-error
              t(...B)
            );
          } finally {
            Zn = R;
          }
        }
      } else
        l.run();
  };
  return a && a(m), l = new ro(h), l.scheduler = o ? () => o(m, !1) : m, _ = (A) => hA(A, !1, l), d = l.onStop = () => {
    const A = Ja.get(l);
    if (A) {
      if (u)
        u(A, 4);
      else
        for (const S of A) S();
      Ja.delete(l);
    }
  }, l.onTrack = n.onTrack, l.onTrigger = n.onTrigger, t ? r ? m(!0) : w = l.run() : o ? o(m.bind(null, !0), !0) : l.run(), b.pause = l.pause.bind(l), b.resume = l.resume.bind(l), b.stop = b, b;
}
function jn(e, t = 1 / 0, n) {
  if (t <= 0 || !zr(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, Ve(e))
    jn(e.value, t, n);
  else if (Bn(e))
    for (let r = 0; r < e.length; r++)
      jn(e[r], t, n);
  else if (KL(e) || Si(e))
    e.forEach((r) => {
      jn(r, t, n);
    });
  else if (JL(e)) {
    for (const r in e)
      jn(e[r], t, n);
    for (const r of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, r) && jn(e[r], t, n);
  }
  return e;
}
const I5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ARRAY_ITERATE_KEY: Ui,
  EffectFlags: r3,
  EffectScope: Hw,
  ITERATE_KEY: rr,
  MAP_KEY_ITERATE_KEY: Ka,
  ReactiveEffect: ro,
  ReactiveFlags: G3,
  TrackOpTypes: k3,
  TriggerOpTypes: q3,
  WatchErrorCodes: H3,
  computed: W3,
  customRef: j3,
  effect: s3,
  effectScope: t3,
  enableTracking: a3,
  getCurrentScope: Kw,
  getCurrentWatcher: K3,
  isProxy: lp,
  isReactive: xi,
  isReadonly: hr,
  isRef: Ve,
  isShallow: Ct,
  markRaw: P3,
  onEffectCleanup: u3,
  onScopeDispose: n3,
  onWatcherCleanup: hA,
  pauseTracking: up,
  proxyRefs: C3,
  reactive: cp,
  reactiveReadArray: Rr,
  readonly: Ya,
  ref: fA,
  resetTracking: fp,
  shallowReactive: T3,
  shallowReadArray: uf,
  shallowReadonly: R3,
  shallowRef: N3,
  stop: o3,
  toRaw: W,
  toReactive: Ie,
  toReadonly: Xa,
  toRef: U3,
  toRefs: F3,
  toValue: I3,
  track: Be,
  traverse: jn,
  trigger: Ln,
  triggerRef: M3,
  unref: hp,
  watch: Y3
}, Symbol.toStringTag, { value: "Module" })), X3 = Symbol.for("preact-signals"), ln = 1, Vi = 2, so = 4, fs = 8, Ta = 16, Wi = 32;
function lf() {
  Cs++;
}
function hf() {
  if (Cs > 1) {
    Cs--;
    return;
  }
  let e, t = !1;
  for (; Ds !== void 0; ) {
    let n = Ds;
    for (Ds = void 0, Gc++; n !== void 0; ) {
      const r = n._nextBatchedEffect;
      if (n._nextBatchedEffect = void 0, n._flags &= ~Vi, !(n._flags & fs) && dA(n))
        try {
          n._callback();
        } catch (i) {
          t || (e = i, t = !0);
        }
      n = r;
    }
  }
  if (Gc = 0, Cs--, t)
    throw e;
}
function J3(e) {
  if (Cs > 0)
    return e();
  lf();
  try {
    return e();
  } finally {
    hf();
  }
}
let G;
function pp(e) {
  const t = G;
  G = void 0;
  try {
    return e();
  } finally {
    G = t;
  }
}
let Ds, Cs = 0, Gc = 0, Za = 0;
function pA(e) {
  if (G === void 0)
    return;
  let t = e._node;
  if (t === void 0 || t._target !== G)
    return t = {
      _version: 0,
      _source: e,
      _prevSource: G._sources,
      _nextSource: void 0,
      _target: G,
      _prevTarget: void 0,
      _nextTarget: void 0,
      _rollbackNode: t
    }, G._sources !== void 0 && (G._sources._nextSource = t), G._sources = t, e._node = t, G._flags & Wi && e._subscribe(t), t;
  if (t._version === -1)
    return t._version = 0, t._nextSource !== void 0 && (t._nextSource._prevSource = t._prevSource, t._prevSource !== void 0 && (t._prevSource._nextSource = t._nextSource), t._prevSource = G._sources, t._nextSource = void 0, G._sources._nextSource = t, G._sources = t), t;
}
function Fe(e, t) {
  this._value = e, this._version = 0, this._node = void 0, this._targets = void 0, this._watched = t?.watched, this._unwatched = t?.unwatched, this.name = t?.name;
}
Fe.prototype.brand = X3;
Fe.prototype._refresh = function() {
  return !0;
};
Fe.prototype._subscribe = function(e) {
  const t = this._targets;
  t !== e && e._prevTarget === void 0 && (e._nextTarget = t, this._targets = e, t !== void 0 ? t._prevTarget = e : pp(() => {
    this._watched?.call(this);
  }));
};
Fe.prototype._unsubscribe = function(e) {
  if (this._targets !== void 0) {
    const t = e._prevTarget, n = e._nextTarget;
    t !== void 0 && (t._nextTarget = n, e._prevTarget = void 0), n !== void 0 && (n._prevTarget = t, e._nextTarget = void 0), e === this._targets && (this._targets = n, n === void 0 && pp(() => {
      this._unwatched?.call(this);
    }));
  }
};
Fe.prototype.subscribe = function(e) {
  return yA(
    () => {
      const t = this.value, n = G;
      G = void 0;
      try {
        e(t);
      } finally {
        G = n;
      }
    },
    { name: "sub" }
  );
};
Fe.prototype.valueOf = function() {
  return this.value;
};
Fe.prototype.toString = function() {
  return this.value + "";
};
Fe.prototype.toJSON = function() {
  return this.value;
};
Fe.prototype.peek = function() {
  const e = G;
  G = void 0;
  try {
    return this.value;
  } finally {
    G = e;
  }
};
Object.defineProperty(Fe.prototype, "value", {
  get() {
    const e = pA(this);
    return e !== void 0 && (e._version = this._version), this._value;
  },
  set(e) {
    if (e !== this._value) {
      if (Gc > 100)
        throw new Error("Cycle detected");
      this._value = e, this._version++, Za++, lf();
      try {
        for (let t = this._targets; t !== void 0; t = t._nextTarget)
          t._target._notify();
      } finally {
        hf();
      }
    }
  }
});
function Z3(e, t) {
  return new Fe(e, t);
}
function dA(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource)
    if (
      // If the dependency has definitely been updated since its version number
      // was observed, then we need to recompute. This first check is not strictly
      // necessary for correctness, but allows us to skip the refresh call if the
      // dependency has already been updated.
      t._source._version !== t._version || // Refresh the dependency. If there's something blocking the refresh (e.g. a
      // dependency cycle), then we need to recompute.
      !t._source._refresh() || // If the dependency got a new version after the refresh, then we need to recompute.
      t._source._version !== t._version
    )
      return !0;
  return !1;
}
function _A(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource) {
    const n = t._source._node;
    if (n !== void 0 && (t._rollbackNode = n), t._source._node = t, t._version = -1, t._nextSource === void 0) {
      e._sources = t;
      break;
    }
  }
}
function vA(e) {
  let t = e._sources, n;
  for (; t !== void 0; ) {
    const r = t._prevSource;
    t._version === -1 ? (t._source._unsubscribe(t), r !== void 0 && (r._nextSource = t._nextSource), t._nextSource !== void 0 && (t._nextSource._prevSource = r)) : n = t, t._source._node = t._rollbackNode, t._rollbackNode !== void 0 && (t._rollbackNode = void 0), t = r;
  }
  e._sources = n;
}
function wr(e, t) {
  Fe.call(this, void 0), this._fn = e, this._sources = void 0, this._globalVersion = Za - 1, this._flags = so, this._watched = t?.watched, this._unwatched = t?.unwatched, this.name = t?.name;
}
wr.prototype = new Fe();
wr.prototype._refresh = function() {
  if (this._flags &= ~Vi, this._flags & ln)
    return !1;
  if ((this._flags & (so | Wi)) === Wi || (this._flags &= ~so, this._globalVersion === Za))
    return !0;
  if (this._globalVersion = Za, this._flags |= ln, this._version > 0 && !dA(this))
    return this._flags &= ~ln, !0;
  const e = G;
  try {
    _A(this), G = this;
    const t = this._fn();
    (this._flags & Ta || this._value !== t || this._version === 0) && (this._value = t, this._flags &= ~Ta, this._version++);
  } catch (t) {
    this._value = t, this._flags |= Ta, this._version++;
  }
  return G = e, vA(this), this._flags &= ~ln, !0;
};
wr.prototype._subscribe = function(e) {
  if (this._targets === void 0) {
    this._flags |= so | Wi;
    for (let t = this._sources; t !== void 0; t = t._nextSource)
      t._source._subscribe(t);
  }
  Fe.prototype._subscribe.call(this, e);
};
wr.prototype._unsubscribe = function(e) {
  if (this._targets !== void 0 && (Fe.prototype._unsubscribe.call(this, e), this._targets === void 0)) {
    this._flags &= ~Wi;
    for (let t = this._sources; t !== void 0; t = t._nextSource)
      t._source._unsubscribe(t);
  }
};
wr.prototype._notify = function() {
  if (!(this._flags & Vi)) {
    this._flags |= so | Vi;
    for (let e = this._targets; e !== void 0; e = e._nextTarget)
      e._target._notify();
  }
};
Object.defineProperty(wr.prototype, "value", {
  get() {
    if (this._flags & ln)
      throw new Error("Cycle detected");
    const e = pA(this);
    if (this._refresh(), e !== void 0 && (e._version = this._version), this._flags & Ta)
      throw this._value;
    return this._value;
  }
});
function Q3(e, t) {
  return new wr(e, t);
}
function gA(e) {
  const t = e._cleanup;
  if (e._cleanup = void 0, typeof t == "function") {
    lf();
    const n = G;
    G = void 0;
    try {
      t();
    } catch (r) {
      throw e._flags &= ~ln, e._flags |= fs, dp(e), r;
    } finally {
      G = n, hf();
    }
  }
}
function dp(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource)
    t._source._unsubscribe(t);
  e._fn = void 0, e._sources = void 0, gA(e);
}
function ej(e) {
  if (G !== this)
    throw new Error("Out-of-order effect");
  vA(this), G = e, this._flags &= ~ln, this._flags & fs && dp(this), hf();
}
function oi(e, t) {
  this._fn = e, this._cleanup = void 0, this._sources = void 0, this._nextBatchedEffect = void 0, this._flags = Wi, this.name = t?.name;
}
oi.prototype._callback = function() {
  const e = this._start();
  try {
    if (this._flags & fs || this._fn === void 0) return;
    const t = this._fn();
    typeof t == "function" && (this._cleanup = t);
  } finally {
    e();
  }
};
oi.prototype._start = function() {
  if (this._flags & ln)
    throw new Error("Cycle detected");
  this._flags |= ln, this._flags &= ~fs, gA(this), _A(this), lf();
  const e = G;
  return G = this, ej.bind(this, e);
};
oi.prototype._notify = function() {
  this._flags & Vi || (this._flags |= Vi, this._nextBatchedEffect = Ds, Ds = this);
};
oi.prototype._dispose = function() {
  this._flags |= fs, this._flags & ln || dp(this);
};
oi.prototype.dispose = function() {
  this._dispose();
};
function yA(e, t) {
  const n = new oi(e, t);
  try {
    n._callback();
  } catch (i) {
    throw n._dispose(), i;
  }
  const r = n._dispose.bind(n);
  return r[Symbol.dispose] = r, r;
}
const D5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Computed: wr,
  Effect: oi,
  Signal: Fe,
  batch: J3,
  computed: Q3,
  effect: yA,
  signal: Z3,
  untracked: pp
}, Symbol.toStringTag, { value: "Module" })), $_ = typeof Symbol == "function" && Symbol.observable || "@@observable", Qf = () => Math.random().toString(36).substring(7).split("").join("."), ir = {
  INIT: `@@redux/INIT${/* @__PURE__ */ Qf()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ Qf()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${Qf()}`
};
function pf(e) {
  if (typeof e != "object" || e === null) return !1;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function tj(e) {
  if (e === void 0) return "undefined";
  if (e === null) return "null";
  const t = typeof e;
  switch (t) {
    case "boolean":
    case "string":
    case "number":
    case "symbol":
    case "function":
      return t;
  }
  if (Array.isArray(e)) return "array";
  if (ij(e)) return "date";
  if (rj(e)) return "error";
  const n = nj(e);
  switch (n) {
    case "Symbol":
    case "Promise":
    case "WeakMap":
    case "WeakSet":
    case "Map":
    case "Set":
      return n;
  }
  return Object.prototype.toString.call(e).slice(8, -1).toLowerCase().replace(/\s/g, "");
}
function nj(e) {
  return typeof e.constructor == "function" ? e.constructor.name : null;
}
function rj(e) {
  return e instanceof Error || typeof e.message == "string" && e.constructor && typeof e.constructor.stackTraceLimit == "number";
}
function ij(e) {
  return e instanceof Date ? !0 : typeof e.toDateString == "function" && typeof e.getDate == "function" && typeof e.setDate == "function";
}
function Dn(e) {
  let t = typeof e;
  return process.env.NODE_ENV !== "production" && (t = tj(e)), t;
}
function _p(e, t, n) {
  if (typeof e != "function")
    throw new Error(
      `Expected the root reducer to be a function. Instead, received: '${Dn(
        e
      )}'`
    );
  if (typeof t == "function" && typeof n == "function" || typeof n == "function" && typeof arguments[3] == "function")
    throw new Error(
      "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example."
    );
  if (typeof t == "function" && typeof n > "u" && (n = t, t = void 0), typeof n < "u") {
    if (typeof n != "function")
      throw new Error(
        `Expected the enhancer to be a function. Instead, received: '${Dn(
          n
        )}'`
      );
    return n(_p)(
      e,
      t
    );
  }
  let r = e, i = t, s = /* @__PURE__ */ new Map(), o = s, a = 0, u = !1;
  function f() {
    o === s && (o = /* @__PURE__ */ new Map(), s.forEach((g, y) => {
      o.set(y, g);
    }));
  }
  function c() {
    if (u)
      throw new Error(
        "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store."
      );
    return i;
  }
  function l(g) {
    if (typeof g != "function")
      throw new Error(
        `Expected the listener to be a function. Instead, received: '${Dn(
          g
        )}'`
      );
    if (u)
      throw new Error(
        "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details."
      );
    let y = !0;
    f();
    const b = a++;
    return o.set(b, g), function() {
      if (y) {
        if (u)
          throw new Error(
            "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details."
          );
        y = !1, f(), o.delete(b), s = null;
      }
    };
  }
  function h(g) {
    if (!pf(g))
      throw new Error(
        `Actions must be plain objects. Instead, the actual type was: '${Dn(
          g
        )}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`
      );
    if (typeof g.type > "u")
      throw new Error(
        'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.'
      );
    if (typeof g.type != "string")
      throw new Error(
        `Action "type" property must be a string. Instead, the actual type was: '${Dn(
          g.type
        )}'. Value was: '${g.type}' (stringified)`
      );
    if (u)
      throw new Error("Reducers may not dispatch actions.");
    try {
      u = !0, i = r(i, g);
    } finally {
      u = !1;
    }
    return (s = o).forEach((b) => {
      b();
    }), g;
  }
  function d(g) {
    if (typeof g != "function")
      throw new Error(
        `Expected the nextReducer to be a function. Instead, received: '${Dn(
          g
        )}`
      );
    r = g, h({ type: ir.REPLACE });
  }
  function _() {
    const g = l;
    return {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(y) {
        if (typeof y != "object" || y === null)
          throw new TypeError(
            `Expected the observer to be an object. Instead, received: '${Dn(
              y
            )}'`
          );
        function b() {
          const m = y;
          m.next && m.next(c());
        }
        return b(), { unsubscribe: g(b) };
      },
      [$_]() {
        return this;
      }
    };
  }
  return h({ type: ir.INIT }), {
    dispatch: h,
    subscribe: l,
    getState: c,
    replaceReducer: d,
    [$_]: _
  };
}
function sj(e, t, n) {
  return _p(e, t, n);
}
function M_(e) {
  typeof console < "u" && typeof console.error == "function" && console.error(e);
  try {
    throw new Error(e);
  } catch {
  }
}
function oj(e, t, n, r) {
  const i = Object.keys(t), s = n && n.type === ir.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
  if (i.length === 0)
    return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
  if (!pf(e))
    return `The ${s} has unexpected type of "${Dn(
      e
    )}". Expected argument to be an object with the following keys: "${i.join('", "')}"`;
  const o = Object.keys(e).filter(
    (a) => !t.hasOwnProperty(a) && !r[a]
  );
  if (o.forEach((a) => {
    r[a] = !0;
  }), !(n && n.type === ir.REPLACE) && o.length > 0)
    return `Unexpected ${o.length > 1 ? "keys" : "key"} "${o.join('", "')}" found in ${s}. Expected to find one of the known reducer keys instead: "${i.join('", "')}". Unexpected keys will be ignored.`;
}
function aj(e) {
  Object.keys(e).forEach((t) => {
    const n = e[t];
    if (typeof n(void 0, { type: ir.INIT }) > "u")
      throw new Error(
        `The slice reducer for key "${t}" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`
      );
    if (typeof n(void 0, {
      type: ir.PROBE_UNKNOWN_ACTION()
    }) > "u")
      throw new Error(
        `The slice reducer for key "${t}" returned undefined when probed with a random type. Don't try to handle '${ir.INIT}' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.`
      );
  });
}
function uj(e) {
  const t = Object.keys(e), n = {};
  for (let o = 0; o < t.length; o++) {
    const a = t[o];
    process.env.NODE_ENV !== "production" && typeof e[a] > "u" && M_(`No reducer provided for key "${a}"`), typeof e[a] == "function" && (n[a] = e[a]);
  }
  const r = Object.keys(n);
  let i;
  process.env.NODE_ENV !== "production" && (i = {});
  let s;
  try {
    aj(n);
  } catch (o) {
    s = o;
  }
  return function(a = {}, u) {
    if (s)
      throw s;
    if (process.env.NODE_ENV !== "production") {
      const l = oj(
        a,
        n,
        u,
        i
      );
      l && M_(l);
    }
    let f = !1;
    const c = {};
    for (let l = 0; l < r.length; l++) {
      const h = r[l], d = n[h], _ = a[h], v = d(_, u);
      if (typeof v > "u") {
        const g = u && u.type;
        throw new Error(
          `When called with an action of type ${g ? `"${String(g)}"` : "(unknown type)"}, the slice reducer for key "${h}" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.`
        );
      }
      c[h] = v, f = f || v !== _;
    }
    return f = f || r.length !== Object.keys(a).length, f ? c : a;
  };
}
function I_(e, t) {
  return function(...n) {
    return t(e.apply(this, n));
  };
}
function fj(e, t) {
  if (typeof e == "function")
    return I_(e, t);
  if (typeof e != "object" || e === null)
    throw new Error(
      `bindActionCreators expected an object or a function, but instead received: '${Dn(
        e
      )}'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    );
  const n = {};
  for (const r in e) {
    const i = e[r];
    typeof i == "function" && (n[r] = I_(i, t));
  }
  return n;
}
function bA(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce(
    (t, n) => (...r) => t(n(...r))
  );
}
function cj(...e) {
  return (t) => (n, r) => {
    const i = t(n, r);
    let s = () => {
      throw new Error(
        "Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch."
      );
    };
    const o = {
      getState: i.getState,
      dispatch: (u, ...f) => s(u, ...f)
    }, a = e.map((u) => u(o));
    return s = bA(...a)(i.dispatch), {
      ...i,
      dispatch: s
    };
  };
}
function lj(e) {
  return pf(e) && "type" in e && typeof e.type == "string";
}
const C5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  __DO_NOT_USE__ActionTypes: ir,
  applyMiddleware: cj,
  bindActionCreators: fj,
  combineReducers: uj,
  compose: bA,
  createStore: _p,
  isAction: lj,
  isPlainObject: pf,
  legacy_createStore: sj
}, Symbol.toStringTag, { value: "Module" }));
var hj = {
  0: "Invalid value for configuration 'enforceActions', expected 'never', 'always' or 'observed'",
  1: function(t, n) {
    return "Cannot apply '" + t + "' to '" + n.toString() + "': Field not found.";
  },
  /*
  2(prop) {
      return `invalid decorator for '${prop.toString()}'`
  },
  3(prop) {
      return `Cannot decorate '${prop.toString()}': action can only be used on properties with a function value.`
  },
  4(prop) {
      return `Cannot decorate '${prop.toString()}': computed can only be used on getter properties.`
  },
  */
  5: "'keys()' can only be used on observable objects, arrays, sets and maps",
  6: "'values()' can only be used on observable objects, arrays, sets and maps",
  7: "'entries()' can only be used on observable objects, arrays and maps",
  8: "'set()' can only be used on observable objects, arrays and maps",
  9: "'remove()' can only be used on observable objects, arrays and maps",
  10: "'has()' can only be used on observable objects, arrays and maps",
  11: "'get()' can only be used on observable objects, arrays and maps",
  12: "Invalid annotation",
  13: "Dynamic observable objects cannot be frozen. If you're passing observables to 3rd party component/function that calls Object.freeze, pass copy instead: toJS(observable)",
  14: "Intercept handlers should return nothing or a change object",
  15: "Observable arrays cannot be frozen. If you're passing observables to 3rd party component/function that calls Object.freeze, pass copy instead: toJS(observable)",
  16: "Modification exception: the internal structure of an observable array was changed.",
  17: function(t, n) {
    return "[mobx.array] Index out of bounds, " + t + " is larger than " + n;
  },
  18: "mobx.map requires Map polyfill for the current browser. Check babel-polyfill or core-js/es6/map.js",
  19: function(t) {
    return "Cannot initialize from classes that inherit from Map: " + t.constructor.name;
  },
  20: function(t) {
    return "Cannot initialize map from " + t;
  },
  21: function(t) {
    return "Cannot convert to map from '" + t + "'";
  },
  22: "mobx.set requires Set polyfill for the current browser. Check babel-polyfill or core-js/es6/set.js",
  23: "It is not possible to get index atoms from arrays",
  24: function(t) {
    return "Cannot obtain administration from " + t;
  },
  25: function(t, n) {
    return "the entry '" + t + "' does not exist in the observable map '" + n + "'";
  },
  26: "please specify a property",
  27: function(t, n) {
    return "no observable property '" + t.toString() + "' found on the observable object '" + n + "'";
  },
  28: function(t) {
    return "Cannot obtain atom from " + t;
  },
  29: "Expecting some object",
  30: "invalid action stack. did you forget to finish an action?",
  31: "missing option for computed: get",
  32: function(t, n) {
    return "Cycle detected in computation " + t + ": " + n;
  },
  33: function(t) {
    return "The setter of computed value '" + t + "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?";
  },
  34: function(t) {
    return "[ComputedValue '" + t + "'] It is not possible to assign a new value to a computed value.";
  },
  35: "There are multiple, different versions of MobX active. Make sure MobX is loaded only once or use `configure({ isolateGlobalState: true })`",
  36: "isolateGlobalState should be called before MobX is running any reactions",
  37: function(t) {
    return "[mobx] `observableArray." + t + "()` mutates the array in-place, which is not allowed inside a derivation. Use `array.slice()." + t + "()` instead";
  },
  38: "'ownKeys()' can only be used on observable objects",
  39: "'defineProperty()' can only be used on observable objects"
}, pj = process.env.NODE_ENV !== "production" ? hj : {};
function E(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
    n[r - 1] = arguments[r];
  if (process.env.NODE_ENV !== "production") {
    var i = typeof e == "string" ? e : pj[e];
    throw typeof i == "function" && (i = i.apply(null, n)), new Error("[MobX] " + i);
  }
  throw new Error(typeof e == "number" ? "[MobX] minified error nr: " + e + (n.length ? " " + n.map(String).join(",") : "") + ". Find the full error at: https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/errors.ts" : "[MobX] " + e);
}
var dj = {};
function df() {
  return typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : dj;
}
var mA = Object.assign, Qa = Object.getOwnPropertyDescriptor, dn = Object.defineProperty, ko = Object.prototype, eu = [];
Object.freeze(eu);
var vp = {};
Object.freeze(vp);
var _j = typeof Proxy < "u", vj = /* @__PURE__ */ Object.toString();
function wA() {
  _j || E(process.env.NODE_ENV !== "production" ? "`Proxy` objects are not available in the current environment. Please configure MobX to enable a fallback implementation.`" : "Proxy not available");
}
function ms(e) {
  process.env.NODE_ENV !== "production" && O.verifyProxies && E("MobX is currently configured to be able to run in ES5 mode, but in ES5 MobX won't be able to " + e);
}
function xt() {
  return ++O.mobxGuid;
}
function gp(e) {
  var t = !1;
  return function() {
    if (!t)
      return t = !0, e.apply(this, arguments);
  };
}
var gi = function() {
};
function ae(e) {
  return typeof e == "function";
}
function gn(e) {
  var t = typeof e;
  switch (t) {
    case "string":
    case "symbol":
    case "number":
      return !0;
  }
  return !1;
}
function _f(e) {
  return e !== null && typeof e == "object";
}
function rt(e) {
  if (!_f(e))
    return !1;
  var t = Object.getPrototypeOf(e);
  if (t == null)
    return !0;
  var n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return typeof n == "function" && n.toString() === vj;
}
function AA(e) {
  var t = e?.constructor;
  return t ? t.name === "GeneratorFunction" || t.displayName === "GeneratorFunction" : !1;
}
function qo(e, t, n) {
  dn(e, t, {
    enumerable: !1,
    writable: !0,
    configurable: !0,
    value: n
  });
}
function OA(e, t, n) {
  dn(e, t, {
    enumerable: !1,
    writable: !1,
    configurable: !0,
    value: n
  });
}
function Ar(e, t) {
  var n = "isMobX" + e;
  return t.prototype[n] = !0, function(r) {
    return _f(r) && r[n] === !0;
  };
}
function cs(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Map]";
}
function gj(e) {
  var t = Object.getPrototypeOf(e), n = Object.getPrototypeOf(t), r = Object.getPrototypeOf(n);
  return r === null;
}
function Fn(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Set]";
}
var EA = typeof Object.getOwnPropertySymbols < "u";
function yj(e) {
  var t = Object.keys(e);
  if (!EA)
    return t;
  var n = Object.getOwnPropertySymbols(e);
  return n.length ? [].concat(t, n.filter(function(r) {
    return ko.propertyIsEnumerable.call(e, r);
  })) : t;
}
var ki = typeof Reflect < "u" && Reflect.ownKeys ? Reflect.ownKeys : EA ? function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : (
  /* istanbul ignore next */
  Object.getOwnPropertyNames
);
function Hc(e) {
  return typeof e == "string" ? e : typeof e == "symbol" ? e.toString() : new String(e).toString();
}
function SA(e) {
  return e === null ? null : typeof e == "object" ? "" + e : e;
}
function vt(e, t) {
  return ko.hasOwnProperty.call(e, t);
}
var bj = Object.getOwnPropertyDescriptors || function(t) {
  var n = {};
  return ki(t).forEach(function(r) {
    n[r] = Qa(t, r);
  }), n;
};
function ct(e, t) {
  return !!(e & t);
}
function lt(e, t, n) {
  return n ? e |= t : e &= ~t, e;
}
function D_(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function mj(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, Aj(r.key), r);
  }
}
function ls(e, t, n) {
  return t && mj(e.prototype, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function yi(e, t) {
  var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n) return (n = n.call(e)).next.bind(n);
  if (Array.isArray(e) || (n = Oj(e)) || t) {
    n && (e = n);
    var r = 0;
    return function() {
      return r >= e.length ? {
        done: !0
      } : {
        done: !1,
        value: e[r++]
      };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function yn() {
  return yn = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, yn.apply(null, arguments);
}
function xA(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Kc(e, t);
}
function Kc(e, t) {
  return Kc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, r) {
    return n.__proto__ = r, n;
  }, Kc(e, t);
}
function wj(e, t) {
  if (typeof e != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function Aj(e) {
  var t = wj(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function Oj(e, t) {
  if (e) {
    if (typeof e == "string") return D_(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? D_(e, t) : void 0;
  }
}
var Qe = /* @__PURE__ */ Symbol("mobx-stored-annotations");
function Jt(e) {
  function t(n, r) {
    if (Ho(r))
      return e.decorate_20223_(n, r);
    Go(n, r, e);
  }
  return Object.assign(t, e);
}
function Go(e, t, n) {
  if (vt(e, Qe) || qo(e, Qe, yn({}, e[Qe])), process.env.NODE_ENV !== "production" && tu(n) && !vt(e[Qe], t)) {
    var r = e.constructor.name + ".prototype." + t.toString();
    E("'" + r + "' is decorated with 'override', but no such decorated member was found on prototype.");
  }
  Ej(e, n, t), tu(n) || (e[Qe][t] = n);
}
function Ej(e, t, n) {
  if (process.env.NODE_ENV !== "production" && !tu(t) && vt(e[Qe], n)) {
    var r = e.constructor.name + ".prototype." + n.toString(), i = e[Qe][n].annotationType_, s = t.annotationType_;
    E("Cannot apply '@" + s + "' to '" + r + "':" + (`
The field is already decorated with '@` + i + "'.") + `
Re-decorating fields is not allowed.
Use '@override' decorator for methods overridden by subclass.`);
  }
}
function Sj(e) {
  return vt(e, Qe) || qo(e, Qe, yn({}, e[Qe])), e[Qe];
}
function Ho(e) {
  return typeof e == "object" && typeof e.kind == "string";
}
function vf(e, t) {
  process.env.NODE_ENV !== "production" && !t.includes(e.kind) && E("The decorator applied to '" + String(e.name) + "' cannot be used on a " + e.kind + " element");
}
var T = /* @__PURE__ */ Symbol("mobx administration"), Or = /* @__PURE__ */ function() {
  function e(n) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "Atom@" + xt() : "Atom"), this.name_ = void 0, this.flags_ = 0, this.observers_ = /* @__PURE__ */ new Set(), this.lastAccessedBy_ = 0, this.lowestObserverState_ = U.NOT_TRACKING_, this.onBOL = void 0, this.onBUOL = void 0, this.name_ = n;
  }
  var t = e.prototype;
  return t.onBO = function() {
    this.onBOL && this.onBOL.forEach(function(r) {
      return r();
    });
  }, t.onBUO = function() {
    this.onBUOL && this.onBUOL.forEach(function(r) {
      return r();
    });
  }, t.reportObserved = function() {
    return kA(this);
  }, t.reportChanged = function() {
    et(), qA(this), tt();
  }, t.toString = function() {
    return this.name_;
  }, ls(e, [{
    key: "isBeingObserved",
    get: function() {
      return ct(this.flags_, e.isBeingObservedMask_);
    },
    set: function(r) {
      this.flags_ = lt(this.flags_, e.isBeingObservedMask_, r);
    }
  }, {
    key: "isPendingUnobservation",
    get: function() {
      return ct(this.flags_, e.isPendingUnobservationMask_);
    },
    set: function(r) {
      this.flags_ = lt(this.flags_, e.isPendingUnobservationMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return ct(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = lt(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
Or.isBeingObservedMask_ = 1;
Or.isPendingUnobservationMask_ = 2;
Or.diffValueMask_ = 4;
var yp = /* @__PURE__ */ Ar("Atom", Or);
function bp(e, t, n) {
  t === void 0 && (t = gi), n === void 0 && (n = gi);
  var r = new Or(e);
  return t !== gi && eO(r, t), n !== gi && xp(r, n), r;
}
function xj(e, t) {
  return e === t;
}
function Tj(e, t) {
  return Mp(e, t);
}
function Rj(e, t) {
  return Mp(e, t, 1);
}
function Pj(e, t) {
  return Object.is ? Object.is(e, t) : e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
var Ur = {
  identity: xj,
  structural: Tj,
  default: Pj,
  shallow: Rj
};
function Vr(e, t, n) {
  return Hr(e) ? e : Array.isArray(e) ? we.array(e, {
    name: n
  }) : rt(e) ? we.object(e, void 0, {
    name: n
  }) : cs(e) ? we.map(e, {
    name: n
  }) : Fn(e) ? we.set(e, {
    name: n
  }) : typeof e == "function" && !qr(e) && !Gi(e) ? AA(e) ? Gr(e) : qi(n, e) : e;
}
function Nj(e, t, n) {
  if (e == null || _e(e) || Je(e) || ye(e) || de(e))
    return e;
  if (Array.isArray(e))
    return we.array(e, {
      name: n,
      deep: !1
    });
  if (rt(e))
    return we.object(e, void 0, {
      name: n,
      deep: !1
    });
  if (cs(e))
    return we.map(e, {
      name: n,
      deep: !1
    });
  if (Fn(e))
    return we.set(e, {
      name: n,
      deep: !1
    });
  process.env.NODE_ENV !== "production" && E("The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
}
function gf(e) {
  return e;
}
function $j(e, t) {
  return process.env.NODE_ENV !== "production" && Hr(e) && E("observable.struct should not be used with observable values"), Mp(e, t) ? t : e;
}
var TA = "override", Mj = /* @__PURE__ */ Jt({
  annotationType_: TA,
  make_: Ij,
  extend_: Dj,
  decorate_20223_: Cj
});
function tu(e) {
  return e.annotationType_ === TA;
}
function Ij(e, t) {
  return process.env.NODE_ENV !== "production" && e.isPlainObject_ && E("Cannot apply '" + this.annotationType_ + "' to '" + e.name_ + "." + t.toString() + "':" + (`
'` + this.annotationType_ + "' cannot be used on plain objects.")), process.env.NODE_ENV !== "production" && !vt(e.appliedAnnotations_, t) && E("'" + e.name_ + "." + t.toString() + "' is annotated with '" + this.annotationType_ + "', but no such annotated member was found on prototype."), 0;
}
function Dj(e, t, n, r) {
  E("'" + this.annotationType_ + "' can only be used with 'makeObservable'");
}
function Cj(e, t) {
  console.warn("'" + this.annotationType_ + "' cannot be used with decorators - this is a no-op");
}
function Ko(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: Lj,
    extend_: jj,
    decorate_20223_: Fj
  };
}
function Lj(e, t, n, r) {
  var i;
  if ((i = this.options_) != null && i.bound)
    return this.extend_(e, t, n, !1) === null ? 0 : 1;
  if (r === e.target_)
    return this.extend_(e, t, n, !1) === null ? 0 : 2;
  if (qr(n.value))
    return 1;
  var s = RA(e, this, t, n, !1);
  return dn(r, t, s), 2;
}
function jj(e, t, n, r) {
  var i = RA(e, this, t, n);
  return e.defineProperty_(t, i, r);
}
function Fj(e, t) {
  process.env.NODE_ENV !== "production" && vf(t, ["method", "field"]);
  var n = t.kind, r = t.name, i = t.addInitializer, s = this, o = function(f) {
    var c, l, h, d;
    return pr((c = (l = s.options_) == null ? void 0 : l.name) != null ? c : r.toString(), f, (h = (d = s.options_) == null ? void 0 : d.autoAction) != null ? h : !1);
  };
  if (n == "field")
    return function(u) {
      var f, c = u;
      return qr(c) || (c = o(c)), (f = s.options_) != null && f.bound && (c = c.bind(this), c.isMobxAction = !0), c;
    };
  if (n == "method") {
    var a;
    return qr(e) || (e = o(e)), (a = this.options_) != null && a.bound && i(function() {
      var u = this, f = u[r].bind(u);
      f.isMobxAction = !0, u[r] = f;
    }), e;
  }
  E("Cannot apply '" + s.annotationType_ + "' to '" + String(r) + "' (kind: " + n + "):" + (`
'` + s.annotationType_ + "' can only be used on properties with a function value."));
}
function Bj(e, t, n, r) {
  var i = t.annotationType_, s = r.value;
  process.env.NODE_ENV !== "production" && !ae(s) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on properties with a function value."));
}
function RA(e, t, n, r, i) {
  var s, o, a, u, f, c, l;
  i === void 0 && (i = O.safeDescriptors), Bj(e, t, n, r);
  var h = r.value;
  if ((s = t.options_) != null && s.bound) {
    var d;
    h = h.bind((d = e.proxy_) != null ? d : e.target_);
  }
  return {
    value: pr(
      (o = (a = t.options_) == null ? void 0 : a.name) != null ? o : n.toString(),
      h,
      (u = (f = t.options_) == null ? void 0 : f.autoAction) != null ? u : !1,
      // https://github.com/mobxjs/mobx/discussions/3140
      (c = t.options_) != null && c.bound ? (l = e.proxy_) != null ? l : e.target_ : void 0
    ),
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: i ? e.isPlainObject_ : !0,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: !1,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: !i
  };
}
function PA(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: zj,
    extend_: Uj,
    decorate_20223_: Vj
  };
}
function zj(e, t, n, r) {
  var i;
  if (r === e.target_)
    return this.extend_(e, t, n, !1) === null ? 0 : 2;
  if ((i = this.options_) != null && i.bound && (!vt(e.target_, t) || !Gi(e.target_[t])) && this.extend_(e, t, n, !1) === null)
    return 0;
  if (Gi(n.value))
    return 1;
  var s = NA(e, this, t, n, !1, !1);
  return dn(r, t, s), 2;
}
function Uj(e, t, n, r) {
  var i, s = NA(e, this, t, n, (i = this.options_) == null ? void 0 : i.bound);
  return e.defineProperty_(t, s, r);
}
function Vj(e, t) {
  var n;
  process.env.NODE_ENV !== "production" && vf(t, ["method"]);
  var r = t.name, i = t.addInitializer;
  return Gi(e) || (e = Gr(e)), (n = this.options_) != null && n.bound && i(function() {
    var s = this, o = s[r].bind(s);
    o.isMobXFlow = !0, s[r] = o;
  }), e;
}
function Wj(e, t, n, r) {
  var i = t.annotationType_, s = r.value;
  process.env.NODE_ENV !== "production" && !ae(s) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on properties with a generator function value."));
}
function NA(e, t, n, r, i, s) {
  s === void 0 && (s = O.safeDescriptors), Wj(e, t, n, r);
  var o = r.value;
  if (Gi(o) || (o = Gr(o)), i) {
    var a;
    o = o.bind((a = e.proxy_) != null ? a : e.target_), o.isMobXFlow = !0;
  }
  return {
    value: o,
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: s ? e.isPlainObject_ : !0,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: !1,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: !s
  };
}
function mp(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: kj,
    extend_: qj,
    decorate_20223_: Gj
  };
}
function kj(e, t, n) {
  return this.extend_(e, t, n, !1) === null ? 0 : 1;
}
function qj(e, t, n, r) {
  return Hj(e, this, t, n), e.defineComputedProperty_(t, yn({}, this.options_, {
    get: n.get,
    set: n.set
  }), r);
}
function Gj(e, t) {
  process.env.NODE_ENV !== "production" && vf(t, ["getter"]);
  var n = this, r = t.name, i = t.addInitializer;
  return i(function() {
    var s = ui(this)[T], o = yn({}, n.options_, {
      get: e,
      context: this
    });
    o.name || (o.name = process.env.NODE_ENV !== "production" ? s.name_ + "." + r.toString() : "ObservableObject." + r.toString()), s.values_.set(r, new zt(o));
  }), function() {
    return this[T].getObservablePropValue_(r);
  };
}
function Hj(e, t, n, r) {
  var i = t.annotationType_, s = r.get;
  process.env.NODE_ENV !== "production" && !s && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on getter(+setter) properties."));
}
function yf(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: Kj,
    extend_: Yj,
    decorate_20223_: Xj
  };
}
function Kj(e, t, n) {
  return this.extend_(e, t, n, !1) === null ? 0 : 1;
}
function Yj(e, t, n, r) {
  var i, s;
  return Jj(e, this, t, n), e.defineObservableProperty_(t, n.value, (i = (s = this.options_) == null ? void 0 : s.enhancer) != null ? i : Vr, r);
}
function Xj(e, t) {
  if (process.env.NODE_ENV !== "production") {
    if (t.kind === "field")
      throw E("Please use `@observable accessor " + String(t.name) + "` instead of `@observable " + String(t.name) + "`");
    vf(t, ["accessor"]);
  }
  var n = this, r = t.kind, i = t.name, s = /* @__PURE__ */ new WeakSet();
  function o(a, u) {
    var f, c, l = ui(a)[T], h = new sr(u, (f = (c = n.options_) == null ? void 0 : c.enhancer) != null ? f : Vr, process.env.NODE_ENV !== "production" ? l.name_ + "." + i.toString() : "ObservableObject." + i.toString(), !1);
    l.values_.set(i, h), s.add(a);
  }
  if (r == "accessor")
    return {
      get: function() {
        return s.has(this) || o(this, e.get.call(this)), this[T].getObservablePropValue_(i);
      },
      set: function(u) {
        return s.has(this) || o(this, u), this[T].setObservablePropValue_(i, u);
      },
      init: function(u) {
        return s.has(this) || o(this, u), u;
      }
    };
}
function Jj(e, t, n, r) {
  var i = t.annotationType_;
  process.env.NODE_ENV !== "production" && !("value" in r) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' cannot be used on getter/setter properties"));
}
var Zj = "true", Qj = /* @__PURE__ */ $A();
function $A(e) {
  return {
    annotationType_: Zj,
    options_: e,
    make_: eF,
    extend_: tF,
    decorate_20223_: nF
  };
}
function eF(e, t, n, r) {
  var i, s;
  if (n.get)
    return Yo.make_(e, t, n, r);
  if (n.set) {
    var o = pr(t.toString(), n.set);
    return r === e.target_ ? e.defineProperty_(t, {
      configurable: O.safeDescriptors ? e.isPlainObject_ : !0,
      set: o
    }) === null ? 0 : 2 : (dn(r, t, {
      configurable: !0,
      set: o
    }), 2);
  }
  if (r !== e.target_ && typeof n.value == "function") {
    var a;
    if (AA(n.value)) {
      var u, f = (u = this.options_) != null && u.autoBind ? Gr.bound : Gr;
      return f.make_(e, t, n, r);
    }
    var c = (a = this.options_) != null && a.autoBind ? qi.bound : qi;
    return c.make_(e, t, n, r);
  }
  var l = ((i = this.options_) == null ? void 0 : i.deep) === !1 ? we.ref : we;
  if (typeof n.value == "function" && (s = this.options_) != null && s.autoBind) {
    var h;
    n.value = n.value.bind((h = e.proxy_) != null ? h : e.target_);
  }
  return l.make_(e, t, n, r);
}
function tF(e, t, n, r) {
  var i, s;
  if (n.get)
    return Yo.extend_(e, t, n, r);
  if (n.set)
    return e.defineProperty_(t, {
      configurable: O.safeDescriptors ? e.isPlainObject_ : !0,
      set: pr(t.toString(), n.set)
    }, r);
  if (typeof n.value == "function" && (i = this.options_) != null && i.autoBind) {
    var o;
    n.value = n.value.bind((o = e.proxy_) != null ? o : e.target_);
  }
  var a = ((s = this.options_) == null ? void 0 : s.deep) === !1 ? we.ref : we;
  return a.extend_(e, t, n, r);
}
function nF(e, t) {
  E("'" + this.annotationType_ + "' cannot be used as a decorator");
}
var rF = "observable", iF = "observable.ref", sF = "observable.shallow", oF = "observable.struct", MA = {
  deep: !0,
  name: void 0,
  defaultDecorator: void 0,
  proxy: !0
};
Object.freeze(MA);
function da(e) {
  return e || MA;
}
var Yc = /* @__PURE__ */ yf(rF), aF = /* @__PURE__ */ yf(iF, {
  enhancer: gf
}), uF = /* @__PURE__ */ yf(sF, {
  enhancer: Nj
}), fF = /* @__PURE__ */ yf(oF, {
  enhancer: $j
}), IA = /* @__PURE__ */ Jt(Yc);
function _a(e) {
  return e.deep === !0 ? Vr : e.deep === !1 ? gf : lF(e.defaultDecorator);
}
function cF(e) {
  var t;
  return e ? (t = e.defaultDecorator) != null ? t : $A(e) : void 0;
}
function lF(e) {
  var t, n;
  return e && (t = (n = e.options_) == null ? void 0 : n.enhancer) != null ? t : Vr;
}
function DA(e, t, n) {
  if (Ho(t))
    return Yc.decorate_20223_(e, t);
  if (gn(t)) {
    Go(e, t, Yc);
    return;
  }
  return Hr(e) ? e : rt(e) ? we.object(e, t, n) : Array.isArray(e) ? we.array(e, t) : cs(e) ? we.map(e, t) : Fn(e) ? we.set(e, t) : typeof e == "object" && e !== null ? e : we.box(e, t);
}
mA(DA, IA);
var hF = {
  box: function(t, n) {
    var r = da(n);
    return new sr(t, _a(r), r.name, !0, r.equals);
  },
  array: function(t, n) {
    var r = da(n);
    return (O.useProxies === !1 || r.proxy === !1 ? DB : EB)(t, _a(r), r.name);
  },
  map: function(t, n) {
    var r = da(n);
    return new Pp(t, _a(r), r.name);
  },
  set: function(t, n) {
    var r = da(n);
    return new Np(t, _a(r), r.name);
  },
  object: function(t, n, r) {
    return Er(function() {
      return Tp(O.useProxies === !1 || r?.proxy === !1 ? ui({}, r) : bB({}, r), t, n);
    });
  },
  ref: /* @__PURE__ */ Jt(aF),
  shallow: /* @__PURE__ */ Jt(uF),
  deep: IA,
  struct: /* @__PURE__ */ Jt(fF)
}, we = /* @__PURE__ */ mA(DA, hF), CA = "computed", pF = "computed.struct", Xc = /* @__PURE__ */ mp(CA), dF = /* @__PURE__ */ mp(pF, {
  equals: Ur.structural
}), Yo = function(t, n) {
  if (Ho(n))
    return Xc.decorate_20223_(t, n);
  if (gn(n))
    return Go(t, n, Xc);
  if (rt(t))
    return Jt(mp(CA, t));
  process.env.NODE_ENV !== "production" && (ae(t) || E("First argument to `computed` should be an expression."), ae(n) && E("A setter as second argument is no longer supported, use `{ set: fn }` option instead"));
  var r = rt(n) ? n : {};
  return r.get = t, r.name || (r.name = t.name || ""), new zt(r);
};
Object.assign(Yo, Xc);
Yo.struct = /* @__PURE__ */ Jt(dF);
var C_, L_, nu = 0, _F = 1, vF = (C_ = (L_ = /* @__PURE__ */ Qa(function() {
}, "name")) == null ? void 0 : L_.configurable) != null ? C_ : !1, j_ = {
  value: "action",
  configurable: !0,
  writable: !1,
  enumerable: !1
};
function pr(e, t, n, r) {
  n === void 0 && (n = !1), process.env.NODE_ENV !== "production" && (ae(t) || E("`action` can only be invoked on functions"), (typeof e != "string" || !e) && E("actions should have valid names, got: '" + e + "'"));
  function i() {
    return LA(e, n, t, r || this, arguments);
  }
  return i.isMobxAction = !0, i.toString = function() {
    return t.toString();
  }, vF && (j_.value = e, dn(i, "name", j_)), i;
}
function LA(e, t, n, r, i) {
  var s = jA(e, t, r, i);
  try {
    return n.apply(r, i);
  } catch (o) {
    throw s.error_ = o, o;
  } finally {
    FA(s);
  }
}
function jA(e, t, n, r) {
  var i = process.env.NODE_ENV !== "production" && Re() && !!e, s = 0;
  if (process.env.NODE_ENV !== "production" && i) {
    s = Date.now();
    var o = r ? Array.from(r) : eu;
    gt({
      type: Ep,
      name: e,
      object: n,
      arguments: o
    });
  }
  var a = O.trackingDerivation, u = !t || !a;
  et();
  var f = O.allowStateChanges;
  u && (ai(), f = bf(!0));
  var c = wf(!0), l = {
    runAsAction_: u,
    prevDerivation_: a,
    prevAllowStateChanges_: f,
    prevAllowStateReads_: c,
    notifySpy_: i,
    startTime_: s,
    actionId_: _F++,
    parentActionId_: nu
  };
  return nu = l.actionId_, l;
}
function FA(e) {
  nu !== e.actionId_ && E(30), nu = e.parentActionId_, e.error_ !== void 0 && (O.suppressReactionErrors = !0), mf(e.prevAllowStateChanges_), Ti(e.prevAllowStateReads_), tt(), e.runAsAction_ && zn(e.prevDerivation_), process.env.NODE_ENV !== "production" && e.notifySpy_ && yt({
    time: Date.now() - e.startTime_
  }), O.suppressReactionErrors = !1;
}
function wp(e, t) {
  var n = bf(e);
  try {
    return t();
  } finally {
    mf(n);
  }
}
function bf(e) {
  var t = O.allowStateChanges;
  return O.allowStateChanges = e, t;
}
function mf(e) {
  O.allowStateChanges = e;
}
var gF = "create", sr = /* @__PURE__ */ function(e) {
  function t(r, i, s, o, a) {
    var u;
    return s === void 0 && (s = process.env.NODE_ENV !== "production" ? "ObservableValue@" + xt() : "ObservableValue"), o === void 0 && (o = !0), a === void 0 && (a = Ur.default), u = e.call(this, s) || this, u.enhancer = void 0, u.name_ = void 0, u.equals = void 0, u.hasUnreportedChange_ = !1, u.interceptors_ = void 0, u.changeListeners_ = void 0, u.value_ = void 0, u.dehancer = void 0, u.enhancer = i, u.name_ = s, u.equals = a, u.value_ = i(r, void 0, s), process.env.NODE_ENV !== "production" && o && Re() && kr({
      type: gF,
      object: u,
      observableKind: "value",
      debugObjectName: u.name_,
      newValue: "" + u.value_
    }), u;
  }
  xA(t, e);
  var n = t.prototype;
  return n.dehanceValue = function(i) {
    return this.dehancer !== void 0 ? this.dehancer(i) : i;
  }, n.set = function(i) {
    var s = this.value_;
    if (i = this.prepareNewValue_(i), i !== O.UNCHANGED) {
      var o = Re();
      process.env.NODE_ENV !== "production" && o && gt({
        type: Kt,
        object: this,
        observableKind: "value",
        debugObjectName: this.name_,
        newValue: i,
        oldValue: s
      }), this.setNewValue_(i), process.env.NODE_ENV !== "production" && o && yt();
    }
  }, n.prepareNewValue_ = function(i) {
    if (hn(this), Nt(this)) {
      var s = $t(this, {
        object: this,
        type: Kt,
        newValue: i
      });
      if (!s)
        return O.UNCHANGED;
      i = s.newValue;
    }
    return i = this.enhancer(i, this.value_, this.name_), this.equals(this.value_, i) ? O.UNCHANGED : i;
  }, n.setNewValue_ = function(i) {
    var s = this.value_;
    this.value_ = i, this.reportChanged(), Zt(this) && Qt(this, {
      type: Kt,
      object: this,
      newValue: i,
      oldValue: s
    });
  }, n.get = function() {
    return this.reportObserved(), this.dehanceValue(this.value_);
  }, n.intercept_ = function(i) {
    return Xo(this, i);
  }, n.observe_ = function(i, s) {
    return s && i({
      observableKind: "value",
      debugObjectName: this.name_,
      object: this,
      type: Kt,
      newValue: this.value_,
      oldValue: void 0
    }), Jo(this, i);
  }, n.raw = function() {
    return this.value_;
  }, n.toJSON = function() {
    return this.get();
  }, n.toString = function() {
    return this.name_ + "[" + this.value_ + "]";
  }, n.valueOf = function() {
    return SA(this.get());
  }, n[Symbol.toPrimitive] = function() {
    return this.valueOf();
  }, t;
}(Or), Ap = /* @__PURE__ */ Ar("ObservableValue", sr), zt = /* @__PURE__ */ function() {
  function e(n) {
    this.dependenciesState_ = U.NOT_TRACKING_, this.observing_ = [], this.newObserving_ = null, this.observers_ = /* @__PURE__ */ new Set(), this.runId_ = 0, this.lastAccessedBy_ = 0, this.lowestObserverState_ = U.UP_TO_DATE_, this.unboundDepsCount_ = 0, this.value_ = new ru(null), this.name_ = void 0, this.triggeredBy_ = void 0, this.flags_ = 0, this.derivation = void 0, this.setter_ = void 0, this.isTracing_ = Lt.NONE, this.scope_ = void 0, this.equals_ = void 0, this.requiresReaction_ = void 0, this.keepAlive_ = void 0, this.onBOL = void 0, this.onBUOL = void 0, n.get || E(31), this.derivation = n.get, this.name_ = n.name || (process.env.NODE_ENV !== "production" ? "ComputedValue@" + xt() : "ComputedValue"), n.set && (this.setter_ = pr(process.env.NODE_ENV !== "production" ? this.name_ + "-setter" : "ComputedValue-setter", n.set)), this.equals_ = n.equals || (n.compareStructural || n.struct ? Ur.structural : Ur.default), this.scope_ = n.context, this.requiresReaction_ = n.requiresReaction, this.keepAlive_ = !!n.keepAlive;
  }
  var t = e.prototype;
  return t.onBecomeStale_ = function() {
    NF(this);
  }, t.onBO = function() {
    this.onBOL && this.onBOL.forEach(function(r) {
      return r();
    });
  }, t.onBUO = function() {
    this.onBUOL && this.onBUOL.forEach(function(r) {
      return r();
    });
  }, t.get = function() {
    if (this.isComputing && E(32, this.name_, this.derivation), O.inBatch === 0 && // !globalState.trackingDerivatpion &&
    this.observers_.size === 0 && !this.keepAlive_)
      Jc(this) && (this.warnAboutUntrackedRead_(), et(), this.value_ = this.computeValue_(!1), tt());
    else if (kA(this), Jc(this)) {
      var r = O.trackingContext;
      this.keepAlive_ && !r && (O.trackingContext = this), this.trackAndCompute() && PF(this), O.trackingContext = r;
    }
    var i = this.value_;
    if (Ra(i))
      throw i.cause;
    return i;
  }, t.set = function(r) {
    if (this.setter_) {
      this.isRunningSetter && E(33, this.name_), this.isRunningSetter = !0;
      try {
        this.setter_.call(this.scope_, r);
      } finally {
        this.isRunningSetter = !1;
      }
    } else
      E(34, this.name_);
  }, t.trackAndCompute = function() {
    var r = this.value_, i = (
      /* see #1208 */
      this.dependenciesState_ === U.NOT_TRACKING_
    ), s = this.computeValue_(!0), o = i || Ra(r) || Ra(s) || !this.equals_(r, s);
    return o && (this.value_ = s, process.env.NODE_ENV !== "production" && Re() && kr({
      observableKind: "computed",
      debugObjectName: this.name_,
      object: this.scope_,
      type: "update",
      oldValue: r,
      newValue: s
    })), o;
  }, t.computeValue_ = function(r) {
    this.isComputing = !0;
    var i = bf(!1), s;
    if (r)
      s = BA(this, this.derivation, this.scope_);
    else if (O.disableErrorBoundaries === !0)
      s = this.derivation.call(this.scope_);
    else
      try {
        s = this.derivation.call(this.scope_);
      } catch (o) {
        s = new ru(o);
      }
    return mf(i), this.isComputing = !1, s;
  }, t.suspend_ = function() {
    this.keepAlive_ || (Zc(this), this.value_ = void 0, process.env.NODE_ENV !== "production" && this.isTracing_ !== Lt.NONE && console.log("[mobx.trace] Computed value '" + this.name_ + "' was suspended and it will recompute on the next access."));
  }, t.observe_ = function(r, i) {
    var s = this, o = !0, a = void 0;
    return Sp(function() {
      var u = s.get();
      if (!o || i) {
        var f = ai();
        r({
          observableKind: "computed",
          debugObjectName: s.name_,
          type: Kt,
          object: s,
          newValue: u,
          oldValue: a
        }), zn(f);
      }
      o = !1, a = u;
    });
  }, t.warnAboutUntrackedRead_ = function() {
    process.env.NODE_ENV !== "production" && (this.isTracing_ !== Lt.NONE && console.log("[mobx.trace] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute."), (typeof this.requiresReaction_ == "boolean" ? this.requiresReaction_ : O.computedRequiresReaction) && console.warn("[mobx] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute."));
  }, t.toString = function() {
    return this.name_ + "[" + this.derivation.toString() + "]";
  }, t.valueOf = function() {
    return SA(this.get());
  }, t[Symbol.toPrimitive] = function() {
    return this.valueOf();
  }, ls(e, [{
    key: "isComputing",
    get: function() {
      return ct(this.flags_, e.isComputingMask_);
    },
    set: function(r) {
      this.flags_ = lt(this.flags_, e.isComputingMask_, r);
    }
  }, {
    key: "isRunningSetter",
    get: function() {
      return ct(this.flags_, e.isRunningSetterMask_);
    },
    set: function(r) {
      this.flags_ = lt(this.flags_, e.isRunningSetterMask_, r);
    }
  }, {
    key: "isBeingObserved",
    get: function() {
      return ct(this.flags_, e.isBeingObservedMask_);
    },
    set: function(r) {
      this.flags_ = lt(this.flags_, e.isBeingObservedMask_, r);
    }
  }, {
    key: "isPendingUnobservation",
    get: function() {
      return ct(this.flags_, e.isPendingUnobservationMask_);
    },
    set: function(r) {
      this.flags_ = lt(this.flags_, e.isPendingUnobservationMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return ct(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = lt(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
zt.isComputingMask_ = 1;
zt.isRunningSetterMask_ = 2;
zt.isBeingObservedMask_ = 4;
zt.isPendingUnobservationMask_ = 8;
zt.diffValueMask_ = 16;
var Wr = /* @__PURE__ */ Ar("ComputedValue", zt), U;
(function(e) {
  e[e.NOT_TRACKING_ = -1] = "NOT_TRACKING_", e[e.UP_TO_DATE_ = 0] = "UP_TO_DATE_", e[e.POSSIBLY_STALE_ = 1] = "POSSIBLY_STALE_", e[e.STALE_ = 2] = "STALE_";
})(U || (U = {}));
var Lt;
(function(e) {
  e[e.NONE = 0] = "NONE", e[e.LOG = 1] = "LOG", e[e.BREAK = 2] = "BREAK";
})(Lt || (Lt = {}));
var ru = function(t) {
  this.cause = void 0, this.cause = t;
};
function Ra(e) {
  return e instanceof ru;
}
function Jc(e) {
  switch (e.dependenciesState_) {
    case U.UP_TO_DATE_:
      return !1;
    case U.NOT_TRACKING_:
    case U.STALE_:
      return !0;
    case U.POSSIBLY_STALE_: {
      for (var t = wf(!0), n = ai(), r = e.observing_, i = r.length, s = 0; s < i; s++) {
        var o = r[s];
        if (Wr(o)) {
          if (O.disableErrorBoundaries)
            o.get();
          else
            try {
              o.get();
            } catch {
              return zn(n), Ti(t), !0;
            }
          if (e.dependenciesState_ === U.STALE_)
            return zn(n), Ti(t), !0;
        }
      }
      return zA(e), zn(n), Ti(t), !1;
    }
  }
}
function yF() {
  return O.trackingDerivation !== null;
}
function hn(e) {
  if (process.env.NODE_ENV !== "production") {
    var t = e.observers_.size > 0;
    !O.allowStateChanges && (t || O.enforceActions === "always") && console.warn("[MobX] " + (O.enforceActions ? "Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: " : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, a computed value or the render function of a React component? You can wrap side effects in 'runInAction' (or decorate functions with 'action') if needed. Tried to modify: ") + e.name_);
  }
}
function bF(e) {
  process.env.NODE_ENV !== "production" && !O.allowStateReads && O.observableRequiresReaction && console.warn("[mobx] Observable '" + e.name_ + "' being read outside a reactive context.");
}
function BA(e, t, n) {
  var r = wf(!0);
  zA(e), e.newObserving_ = new Array(
    // Reserve constant space for initial dependencies, dynamic space otherwise.
    // See https://github.com/mobxjs/mobx/pull/3833
    e.runId_ === 0 ? 100 : e.observing_.length
  ), e.unboundDepsCount_ = 0, e.runId_ = ++O.runId;
  var i = O.trackingDerivation;
  O.trackingDerivation = e, O.inBatch++;
  var s;
  if (O.disableErrorBoundaries === !0)
    s = t.call(n);
  else
    try {
      s = t.call(n);
    } catch (o) {
      s = new ru(o);
    }
  return O.inBatch--, O.trackingDerivation = i, wF(e), mF(e), Ti(r), s;
}
function mF(e) {
  process.env.NODE_ENV !== "production" && e.observing_.length === 0 && (typeof e.requiresObservable_ == "boolean" ? e.requiresObservable_ : O.reactionRequiresObservable) && console.warn("[mobx] Derivation '" + e.name_ + "' is created/updated without reading any observable value.");
}
function wF(e) {
  for (var t = e.observing_, n = e.observing_ = e.newObserving_, r = U.UP_TO_DATE_, i = 0, s = e.unboundDepsCount_, o = 0; o < s; o++) {
    var a = n[o];
    a.diffValue === 0 && (a.diffValue = 1, i !== o && (n[i] = a), i++), a.dependenciesState_ > r && (r = a.dependenciesState_);
  }
  for (n.length = i, e.newObserving_ = null, s = t.length; s--; ) {
    var u = t[s];
    u.diffValue === 0 && VA(u, e), u.diffValue = 0;
  }
  for (; i--; ) {
    var f = n[i];
    f.diffValue === 1 && (f.diffValue = 0, RF(f, e));
  }
  r !== U.UP_TO_DATE_ && (e.dependenciesState_ = r, e.onBecomeStale_());
}
function Zc(e) {
  var t = e.observing_;
  e.observing_ = [];
  for (var n = t.length; n--; )
    VA(t[n], e);
  e.dependenciesState_ = U.NOT_TRACKING_;
}
function Op(e) {
  var t = ai();
  try {
    return e();
  } finally {
    zn(t);
  }
}
function ai() {
  var e = O.trackingDerivation;
  return O.trackingDerivation = null, e;
}
function zn(e) {
  O.trackingDerivation = e;
}
function wf(e) {
  var t = O.allowStateReads;
  return O.allowStateReads = e, t;
}
function Ti(e) {
  O.allowStateReads = e;
}
function zA(e) {
  if (e.dependenciesState_ !== U.UP_TO_DATE_) {
    e.dependenciesState_ = U.UP_TO_DATE_;
    for (var t = e.observing_, n = t.length; n--; )
      t[n].lowestObserverState_ = U.UP_TO_DATE_;
  }
}
var AF = ["mobxGuid", "spyListeners", "enforceActions", "computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "allowStateReads", "disableErrorBoundaries", "runId", "UNCHANGED", "useProxies"], Ls = function() {
  this.version = 6, this.UNCHANGED = {}, this.trackingDerivation = null, this.trackingContext = null, this.runId = 0, this.mobxGuid = 0, this.inBatch = 0, this.pendingUnobservations = [], this.pendingReactions = [], this.isRunningReactions = !1, this.allowStateChanges = !1, this.allowStateReads = !0, this.enforceActions = !0, this.spyListeners = [], this.globalReactionErrorHandlers = [], this.computedRequiresReaction = !1, this.reactionRequiresObservable = !1, this.observableRequiresReaction = !1, this.disableErrorBoundaries = !1, this.suppressReactionErrors = !1, this.useProxies = !0, this.verifyProxies = !1, this.safeDescriptors = !0;
}, Pa = !0, UA = !1, O = /* @__PURE__ */ function() {
  var e = /* @__PURE__ */ df();
  return e.__mobxInstanceCount > 0 && !e.__mobxGlobals && (Pa = !1), e.__mobxGlobals && e.__mobxGlobals.version !== new Ls().version && (Pa = !1), Pa ? e.__mobxGlobals ? (e.__mobxInstanceCount += 1, e.__mobxGlobals.UNCHANGED || (e.__mobxGlobals.UNCHANGED = {}), e.__mobxGlobals) : (e.__mobxInstanceCount = 1, e.__mobxGlobals = /* @__PURE__ */ new Ls()) : (setTimeout(function() {
    UA || E(35);
  }, 1), new Ls());
}();
function OF() {
  if ((O.pendingReactions.length || O.inBatch || O.isRunningReactions) && E(36), UA = !0, Pa) {
    var e = df();
    --e.__mobxInstanceCount === 0 && (e.__mobxGlobals = void 0), O = new Ls();
  }
}
function EF() {
  return O;
}
function SF() {
  var e = new Ls();
  for (var t in e)
    AF.indexOf(t) === -1 && (O[t] = e[t]);
  O.allowStateChanges = !O.enforceActions;
}
function xF(e) {
  return e.observers_ && e.observers_.size > 0;
}
function TF(e) {
  return e.observers_;
}
function RF(e, t) {
  e.observers_.add(t), e.lowestObserverState_ > t.dependenciesState_ && (e.lowestObserverState_ = t.dependenciesState_);
}
function VA(e, t) {
  e.observers_.delete(t), e.observers_.size === 0 && WA(e);
}
function WA(e) {
  e.isPendingUnobservation === !1 && (e.isPendingUnobservation = !0, O.pendingUnobservations.push(e));
}
function et() {
  O.inBatch++;
}
function tt() {
  if (--O.inBatch === 0) {
    KA();
    for (var e = O.pendingUnobservations, t = 0; t < e.length; t++) {
      var n = e[t];
      n.isPendingUnobservation = !1, n.observers_.size === 0 && (n.isBeingObserved && (n.isBeingObserved = !1, n.onBUO()), n instanceof zt && n.suspend_());
    }
    O.pendingUnobservations = [];
  }
}
function kA(e) {
  bF(e);
  var t = O.trackingDerivation;
  return t !== null ? (t.runId_ !== e.lastAccessedBy_ && (e.lastAccessedBy_ = t.runId_, t.newObserving_[t.unboundDepsCount_++] = e, !e.isBeingObserved && O.trackingContext && (e.isBeingObserved = !0, e.onBO())), e.isBeingObserved) : (e.observers_.size === 0 && O.inBatch > 0 && WA(e), !1);
}
function qA(e) {
  e.lowestObserverState_ !== U.STALE_ && (e.lowestObserverState_ = U.STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === U.UP_TO_DATE_ && (process.env.NODE_ENV !== "production" && t.isTracing_ !== Lt.NONE && GA(t, e), t.onBecomeStale_()), t.dependenciesState_ = U.STALE_;
  }));
}
function PF(e) {
  e.lowestObserverState_ !== U.STALE_ && (e.lowestObserverState_ = U.STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === U.POSSIBLY_STALE_ ? (t.dependenciesState_ = U.STALE_, process.env.NODE_ENV !== "production" && t.isTracing_ !== Lt.NONE && GA(t, e)) : t.dependenciesState_ === U.UP_TO_DATE_ && (e.lowestObserverState_ = U.UP_TO_DATE_);
  }));
}
function NF(e) {
  e.lowestObserverState_ === U.UP_TO_DATE_ && (e.lowestObserverState_ = U.POSSIBLY_STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === U.UP_TO_DATE_ && (t.dependenciesState_ = U.POSSIBLY_STALE_, t.onBecomeStale_());
  }));
}
function GA(e, t) {
  if (console.log("[mobx.trace] '" + e.name_ + "' is invalidated due to a change in: '" + t.name_ + "'"), e.isTracing_ === Lt.BREAK) {
    var n = [];
    HA(nO(e), n, 1), new Function(`debugger;
/*
Tracing '` + e.name_ + `'

You are entering this break point because derivation '` + e.name_ + "' is being traced and '" + t.name_ + `' is now forcing it to update.
Just follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update
The stackframe you are looking for is at least ~6-8 stack-frames up.

` + (e instanceof zt ? e.derivation.toString().replace(/[*]\//g, "/") : "") + `

The dependencies for this derivation are:

` + n.join(`
`) + `
*/
    `)();
  }
}
function HA(e, t, n) {
  if (t.length >= 1e3) {
    t.push("(and many more)");
    return;
  }
  t.push("" + "	".repeat(n - 1) + e.name), e.dependencies && e.dependencies.forEach(function(r) {
    return HA(r, t, n + 1);
  });
}
var bn = /* @__PURE__ */ function() {
  function e(n, r, i, s) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "Reaction@" + xt() : "Reaction"), this.name_ = void 0, this.onInvalidate_ = void 0, this.errorHandler_ = void 0, this.requiresObservable_ = void 0, this.observing_ = [], this.newObserving_ = [], this.dependenciesState_ = U.NOT_TRACKING_, this.runId_ = 0, this.unboundDepsCount_ = 0, this.flags_ = 0, this.isTracing_ = Lt.NONE, this.name_ = n, this.onInvalidate_ = r, this.errorHandler_ = i, this.requiresObservable_ = s;
  }
  var t = e.prototype;
  return t.onBecomeStale_ = function() {
    this.schedule_();
  }, t.schedule_ = function() {
    this.isScheduled || (this.isScheduled = !0, O.pendingReactions.push(this), KA());
  }, t.runReaction_ = function() {
    if (!this.isDisposed) {
      et(), this.isScheduled = !1;
      var r = O.trackingContext;
      if (O.trackingContext = this, Jc(this)) {
        this.isTrackPending = !0;
        try {
          this.onInvalidate_(), process.env.NODE_ENV !== "production" && this.isTrackPending && Re() && kr({
            name: this.name_,
            type: "scheduled-reaction"
          });
        } catch (i) {
          this.reportExceptionInDerivation_(i);
        }
      }
      O.trackingContext = r, tt();
    }
  }, t.track = function(r) {
    if (!this.isDisposed) {
      et();
      var i = Re(), s;
      process.env.NODE_ENV !== "production" && i && (s = Date.now(), gt({
        name: this.name_,
        type: "reaction"
      })), this.isRunning = !0;
      var o = O.trackingContext;
      O.trackingContext = this;
      var a = BA(this, r, void 0);
      O.trackingContext = o, this.isRunning = !1, this.isTrackPending = !1, this.isDisposed && Zc(this), Ra(a) && this.reportExceptionInDerivation_(a.cause), process.env.NODE_ENV !== "production" && i && yt({
        time: Date.now() - s
      }), tt();
    }
  }, t.reportExceptionInDerivation_ = function(r) {
    var i = this;
    if (this.errorHandler_) {
      this.errorHandler_(r, this);
      return;
    }
    if (O.disableErrorBoundaries)
      throw r;
    var s = process.env.NODE_ENV !== "production" ? "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'" : "[mobx] uncaught error in '" + this + "'";
    O.suppressReactionErrors ? process.env.NODE_ENV !== "production" && console.warn("[mobx] (error in reaction '" + this.name_ + "' suppressed, fix error of causing action below)") : console.error(s, r), process.env.NODE_ENV !== "production" && Re() && kr({
      type: "error",
      name: this.name_,
      message: s,
      error: "" + r
    }), O.globalReactionErrorHandlers.forEach(function(o) {
      return o(r, i);
    });
  }, t.dispose = function() {
    this.isDisposed || (this.isDisposed = !0, this.isRunning || (et(), Zc(this), tt()));
  }, t.getDisposer_ = function(r) {
    var i = this, s = function o() {
      i.dispose(), r == null || r.removeEventListener == null || r.removeEventListener("abort", o);
    };
    return r == null || r.addEventListener == null || r.addEventListener("abort", s), s[T] = this, s;
  }, t.toString = function() {
    return "Reaction[" + this.name_ + "]";
  }, t.trace = function(r) {
    r === void 0 && (r = !1), cO(this, r);
  }, ls(e, [{
    key: "isDisposed",
    get: function() {
      return ct(this.flags_, e.isDisposedMask_);
    },
    set: function(r) {
      this.flags_ = lt(this.flags_, e.isDisposedMask_, r);
    }
  }, {
    key: "isScheduled",
    get: function() {
      return ct(this.flags_, e.isScheduledMask_);
    },
    set: function(r) {
      this.flags_ = lt(this.flags_, e.isScheduledMask_, r);
    }
  }, {
    key: "isTrackPending",
    get: function() {
      return ct(this.flags_, e.isTrackPendingMask_);
    },
    set: function(r) {
      this.flags_ = lt(this.flags_, e.isTrackPendingMask_, r);
    }
  }, {
    key: "isRunning",
    get: function() {
      return ct(this.flags_, e.isRunningMask_);
    },
    set: function(r) {
      this.flags_ = lt(this.flags_, e.isRunningMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return ct(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = lt(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
bn.isDisposedMask_ = 1;
bn.isScheduledMask_ = 2;
bn.isTrackPendingMask_ = 4;
bn.isRunningMask_ = 8;
bn.diffValueMask_ = 16;
function $F(e) {
  return O.globalReactionErrorHandlers.push(e), function() {
    var t = O.globalReactionErrorHandlers.indexOf(e);
    t >= 0 && O.globalReactionErrorHandlers.splice(t, 1);
  };
}
var F_ = 100, Qc = function(t) {
  return t();
};
function KA() {
  O.inBatch > 0 || O.isRunningReactions || Qc(MF);
}
function MF() {
  O.isRunningReactions = !0;
  for (var e = O.pendingReactions, t = 0; e.length > 0; ) {
    ++t === F_ && (console.error(process.env.NODE_ENV !== "production" ? "Reaction doesn't converge to a stable state after " + F_ + " iterations." + (" Probably there is a cycle in the reactive function: " + e[0]) : "[mobx] cycle in reaction: " + e[0]), e.splice(0));
    for (var n = e.splice(0), r = 0, i = n.length; r < i; r++)
      n[r].runReaction_();
  }
  O.isRunningReactions = !1;
}
var iu = /* @__PURE__ */ Ar("Reaction", bn);
function IF(e) {
  var t = Qc;
  Qc = function(r) {
    return e(function() {
      return t(r);
    });
  };
}
function Re() {
  return process.env.NODE_ENV !== "production" && !!O.spyListeners.length;
}
function kr(e) {
  if (process.env.NODE_ENV !== "production" && O.spyListeners.length)
    for (var t = O.spyListeners, n = 0, r = t.length; n < r; n++)
      t[n](e);
}
function gt(e) {
  if (process.env.NODE_ENV !== "production") {
    var t = yn({}, e, {
      spyReportStart: !0
    });
    kr(t);
  }
}
var DF = {
  type: "report-end",
  spyReportEnd: !0
};
function yt(e) {
  process.env.NODE_ENV !== "production" && kr(e ? yn({}, e, {
    type: "report-end",
    spyReportEnd: !0
  }) : DF);
}
function YA(e) {
  return process.env.NODE_ENV === "production" ? (console.warn("[mobx.spy] Is a no-op in production builds"), function() {
  }) : (O.spyListeners.push(e), gp(function() {
    O.spyListeners = O.spyListeners.filter(function(t) {
      return t !== e;
    });
  }));
}
var Ep = "action", CF = "action.bound", XA = "autoAction", LF = "autoAction.bound", JA = "<unnamed action>", el = /* @__PURE__ */ Ko(Ep), jF = /* @__PURE__ */ Ko(CF, {
  bound: !0
}), tl = /* @__PURE__ */ Ko(XA, {
  autoAction: !0
}), FF = /* @__PURE__ */ Ko(LF, {
  autoAction: !0,
  bound: !0
});
function ZA(e) {
  var t = function(r, i) {
    if (ae(r))
      return pr(r.name || JA, r, e);
    if (ae(i))
      return pr(r, i, e);
    if (Ho(i))
      return (e ? tl : el).decorate_20223_(r, i);
    if (gn(i))
      return Go(r, i, e ? tl : el);
    if (gn(r))
      return Jt(Ko(e ? XA : Ep, {
        name: r,
        autoAction: e
      }));
    process.env.NODE_ENV !== "production" && E("Invalid arguments for `action`");
  };
  return t;
}
var Qn = /* @__PURE__ */ ZA(!1);
Object.assign(Qn, el);
var qi = /* @__PURE__ */ ZA(!0);
Object.assign(qi, tl);
Qn.bound = /* @__PURE__ */ Jt(jF);
qi.bound = /* @__PURE__ */ Jt(FF);
function B_(e) {
  return LA(e.name || JA, !1, e, this, void 0);
}
function qr(e) {
  return ae(e) && e.isMobxAction === !0;
}
function Sp(e, t) {
  var n, r, i, s;
  t === void 0 && (t = vp), process.env.NODE_ENV !== "production" && (ae(e) || E("Autorun expects a function as first argument"), qr(e) && E("Autorun does not accept actions since actions are untrackable"));
  var o = (n = (r = t) == null ? void 0 : r.name) != null ? n : process.env.NODE_ENV !== "production" ? e.name || "Autorun@" + xt() : "Autorun", a = !t.scheduler && !t.delay, u;
  if (a)
    u = new bn(o, function() {
      this.track(l);
    }, t.onError, t.requiresObservable);
  else {
    var f = QA(t), c = !1;
    u = new bn(o, function() {
      c || (c = !0, f(function() {
        c = !1, u.isDisposed || u.track(l);
      }));
    }, t.onError, t.requiresObservable);
  }
  function l() {
    e(u);
  }
  return (i = t) != null && (i = i.signal) != null && i.aborted || u.schedule_(), u.getDisposer_((s = t) == null ? void 0 : s.signal);
}
var BF = function(t) {
  return t();
};
function QA(e) {
  return e.scheduler ? e.scheduler : e.delay ? function(t) {
    return setTimeout(t, e.delay);
  } : BF;
}
function zF(e, t, n) {
  var r, i, s;
  n === void 0 && (n = vp), process.env.NODE_ENV !== "production" && ((!ae(e) || !ae(t)) && E("First and second argument to reaction should be functions"), rt(n) || E("Third argument of reactions should be an object"));
  var o = (r = n.name) != null ? r : process.env.NODE_ENV !== "production" ? "Reaction@" + xt() : "Reaction", a = Qn(o, n.onError ? UF(n.onError, t) : t), u = !n.scheduler && !n.delay, f = QA(n), c = !0, l = !1, h, d = n.compareStructural ? Ur.structural : n.equals || Ur.default, _ = new bn(o, function() {
    c || u ? v() : l || (l = !0, f(v));
  }, n.onError, n.requiresObservable);
  function v() {
    if (l = !1, !_.isDisposed) {
      var g = !1, y = h;
      _.track(function() {
        var b = wp(!1, function() {
          return e(_);
        });
        g = c || !d(h, b), h = b;
      }), (c && n.fireImmediately || !c && g) && a(h, y, _), c = !1;
    }
  }
  return (i = n) != null && (i = i.signal) != null && i.aborted || _.schedule_(), _.getDisposer_((s = n) == null ? void 0 : s.signal);
}
function UF(e, t) {
  return function() {
    try {
      return t.apply(this, arguments);
    } catch (n) {
      e.call(this, n);
    }
  };
}
var VF = "onBO", WF = "onBUO";
function eO(e, t, n) {
  return tO(VF, e, t, n);
}
function xp(e, t, n) {
  return tO(WF, e, t, n);
}
function tO(e, t, n, r) {
  var i = typeof r == "function" ? nn(t, n) : nn(t), s = ae(r) ? r : n, o = e + "L";
  return i[o] ? i[o].add(s) : i[o] = /* @__PURE__ */ new Set([s]), function() {
    var a = i[o];
    a && (a.delete(s), a.size === 0 && delete i[o]);
  };
}
var kF = "never", va = "always", qF = "observed";
function GF(e) {
  e.isolateGlobalState === !0 && OF();
  var t = e.useProxies, n = e.enforceActions;
  if (t !== void 0 && (O.useProxies = t === va ? !0 : t === kF ? !1 : typeof Proxy < "u"), t === "ifavailable" && (O.verifyProxies = !0), n !== void 0) {
    var r = n === va ? va : n === qF;
    O.enforceActions = r, O.allowStateChanges = !(r === !0 || r === va);
  }
  ["computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "disableErrorBoundaries", "safeDescriptors"].forEach(function(i) {
    i in e && (O[i] = !!e[i]);
  }), O.allowStateReads = !O.observableRequiresReaction, process.env.NODE_ENV !== "production" && O.disableErrorBoundaries === !0 && console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled."), e.reactionScheduler && IF(e.reactionScheduler);
}
function Tp(e, t, n, r) {
  process.env.NODE_ENV !== "production" && (arguments.length > 4 && E("'extendObservable' expected 2-4 arguments"), typeof e != "object" && E("'extendObservable' expects an object as first argument"), ye(e) && E("'extendObservable' should not be used on maps, use map.merge instead"), rt(t) || E("'extendObservable' only accepts plain objects as second argument"), (Hr(t) || Hr(n)) && E("Extending an object with another observable (object) is not supported"));
  var i = bj(t);
  return Er(function() {
    var s = ui(e, r)[T];
    ki(i).forEach(function(o) {
      s.extend_(
        o,
        i[o],
        // must pass "undefined" for { key: undefined }
        n && o in n ? n[o] : !0
      );
    });
  }), e;
}
function nO(e, t) {
  return rO(nn(e, t));
}
function rO(e) {
  var t = {
    name: e.name_
  };
  return e.observing_ && e.observing_.length > 0 && (t.dependencies = KF(e.observing_).map(rO)), t;
}
function HF(e, t) {
  return iO(nn(e, t));
}
function iO(e) {
  var t = {
    name: e.name_
  };
  return xF(e) && (t.observers = Array.from(TF(e)).map(iO)), t;
}
function KF(e) {
  return Array.from(new Set(e));
}
var YF = 0;
function Af() {
  this.message = "FLOW_CANCELLED";
}
Af.prototype = /* @__PURE__ */ Object.create(Error.prototype);
function XF(e) {
  return e instanceof Af;
}
var ec = /* @__PURE__ */ PA("flow"), JF = /* @__PURE__ */ PA("flow.bound", {
  bound: !0
}), Gr = /* @__PURE__ */ Object.assign(function(t, n) {
  if (Ho(n))
    return ec.decorate_20223_(t, n);
  if (gn(n))
    return Go(t, n, ec);
  process.env.NODE_ENV !== "production" && arguments.length !== 1 && E("Flow expects single argument with generator function");
  var r = t, i = r.name || "<unnamed flow>", s = function() {
    var a = this, u = arguments, f = ++YF, c = Qn(i + " - runid: " + f + " - init", r).apply(a, u), l, h = void 0, d = new Promise(function(_, v) {
      var g = 0;
      l = v;
      function y(m) {
        h = void 0;
        var A;
        try {
          A = Qn(i + " - runid: " + f + " - yield " + g++, c.next).call(c, m);
        } catch (S) {
          return v(S);
        }
        w(A);
      }
      function b(m) {
        h = void 0;
        var A;
        try {
          A = Qn(i + " - runid: " + f + " - yield " + g++, c.throw).call(c, m);
        } catch (S) {
          return v(S);
        }
        w(A);
      }
      function w(m) {
        if (ae(m?.then)) {
          m.then(w, v);
          return;
        }
        return m.done ? _(m.value) : (h = Promise.resolve(m.value), h.then(y, b));
      }
      y(void 0);
    });
    return d.cancel = Qn(i + " - runid: " + f + " - cancel", function() {
      try {
        h && z_(h);
        var _ = c.return(void 0), v = Promise.resolve(_.value);
        v.then(gi, gi), z_(v), l(new Af());
      } catch (g) {
        l(g);
      }
    }), d;
  };
  return s.isMobXFlow = !0, s;
}, ec);
Gr.bound = /* @__PURE__ */ Jt(JF);
function z_(e) {
  ae(e.cancel) && e.cancel();
}
function ZF(e) {
  return e;
}
function Gi(e) {
  return e?.isMobXFlow === !0;
}
function QF(e, t, n) {
  var r;
  if (ye(e) || Je(e) || Ap(e))
    r = mn(e);
  else if (_e(e)) {
    if (process.env.NODE_ENV !== "production" && !gn(t))
      return E("InterceptReads can only be used with a specific property, not with an object in general");
    r = mn(e, t);
  } else if (process.env.NODE_ENV !== "production")
    return E("Expected observable map, object or array as first array");
  return process.env.NODE_ENV !== "production" && r.dehancer !== void 0 ? E("An intercept reader was already established") : (r.dehancer = typeof t == "function" ? t : n, function() {
    r.dehancer = void 0;
  });
}
function eB(e, t, n) {
  return ae(n) ? nB(e, t, n) : tB(e, t);
}
function tB(e, t) {
  return mn(e).intercept_(t);
}
function nB(e, t, n) {
  return mn(e, t).intercept_(n);
}
function sO(e, t) {
  if (t === void 0)
    return Wr(e);
  if (_e(e) === !1 || !e[T].values_.has(t))
    return !1;
  var n = nn(e, t);
  return Wr(n);
}
function rB(e) {
  return process.env.NODE_ENV !== "production" && arguments.length > 1 ? E("isComputed expects only 1 argument. Use isComputedProp to inspect the observability of a property") : sO(e);
}
function iB(e, t) {
  return process.env.NODE_ENV !== "production" && !gn(t) ? E("isComputed expected a property name as second argument") : sO(e, t);
}
function oO(e, t) {
  return e ? t !== void 0 ? process.env.NODE_ENV !== "production" && (ye(e) || Je(e)) ? E("isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.") : _e(e) ? e[T].values_.has(t) : !1 : _e(e) || !!e[T] || yp(e) || iu(e) || Wr(e) : !1;
}
function Hr(e) {
  return process.env.NODE_ENV !== "production" && arguments.length !== 1 && E("isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property"), oO(e);
}
function sB(e, t) {
  return process.env.NODE_ENV !== "production" && !gn(t) ? E("expected a property name as second argument") : oO(e, t);
}
function oo(e) {
  if (_e(e))
    return e[T].keys_();
  if (ye(e) || de(e))
    return Array.from(e.keys());
  if (Je(e))
    return e.map(function(t, n) {
      return n;
    });
  E(5);
}
function oB(e) {
  if (_e(e))
    return oo(e).map(function(t) {
      return e[t];
    });
  if (ye(e))
    return oo(e).map(function(t) {
      return e.get(t);
    });
  if (de(e))
    return Array.from(e.values());
  if (Je(e))
    return e.slice();
  E(6);
}
function aB(e) {
  if (_e(e))
    return oo(e).map(function(t) {
      return [t, e[t]];
    });
  if (ye(e))
    return oo(e).map(function(t) {
      return [t, e.get(t)];
    });
  if (de(e))
    return Array.from(e.entries());
  if (Je(e))
    return e.map(function(t, n) {
      return [n, t];
    });
  E(7);
}
function aO(e, t, n) {
  if (arguments.length === 2 && !de(e)) {
    et();
    var r = t;
    try {
      for (var i in r)
        aO(e, i, r[i]);
    } finally {
      tt();
    }
    return;
  }
  _e(e) ? e[T].set_(t, n) : ye(e) ? e.set(t, n) : de(e) ? e.add(t) : Je(e) ? (typeof t != "number" && (t = parseInt(t, 10)), t < 0 && E("Invalid index: '" + t + "'"), et(), t >= e.length && (e.length = t + 1), e[t] = n, tt()) : E(8);
}
function uB(e, t) {
  _e(e) ? e[T].delete_(t) : ye(e) || de(e) ? e.delete(t) : Je(e) ? (typeof t != "number" && (t = parseInt(t, 10)), e.splice(t, 1)) : E(9);
}
function uO(e, t) {
  if (_e(e))
    return e[T].has_(t);
  if (ye(e))
    return e.has(t);
  if (de(e))
    return e.has(t);
  if (Je(e))
    return t >= 0 && t < e.length;
  E(10);
}
function fB(e, t) {
  if (uO(e, t)) {
    if (_e(e))
      return e[T].get_(t);
    if (ye(e))
      return e.get(t);
    if (Je(e))
      return e[t];
    E(11);
  }
}
function cB(e, t, n) {
  if (_e(e))
    return e[T].defineProperty_(t, n);
  E(39);
}
function fO(e) {
  if (_e(e))
    return e[T].ownKeys_();
  E(38);
}
function lB(e, t, n, r) {
  return ae(n) ? pB(e, t, n, r) : hB(e, t, n);
}
function hB(e, t, n) {
  return mn(e).observe_(t, n);
}
function pB(e, t, n, r) {
  return mn(e, t).observe_(n, r);
}
function ga(e, t, n) {
  return e.set(t, n), n;
}
function vi(e, t) {
  if (e == null || typeof e != "object" || e instanceof Date || !Hr(e))
    return e;
  if (Ap(e) || Wr(e))
    return vi(e.get(), t);
  if (t.has(e))
    return t.get(e);
  if (Je(e)) {
    var n = ga(t, e, new Array(e.length));
    return e.forEach(function(o, a) {
      n[a] = vi(o, t);
    }), n;
  }
  if (de(e)) {
    var r = ga(t, e, /* @__PURE__ */ new Set());
    return e.forEach(function(o) {
      r.add(vi(o, t));
    }), r;
  }
  if (ye(e)) {
    var i = ga(t, e, /* @__PURE__ */ new Map());
    return e.forEach(function(o, a) {
      i.set(a, vi(o, t));
    }), i;
  } else {
    var s = ga(t, e, {});
    return fO(e).forEach(function(o) {
      ko.propertyIsEnumerable.call(e, o) && (s[o] = vi(e[o], t));
    }), s;
  }
}
function dB(e, t) {
  return process.env.NODE_ENV !== "production" && t && E("toJS no longer supports options"), vi(e, /* @__PURE__ */ new Map());
}
function cO() {
  if (process.env.NODE_ENV !== "production") {
    for (var e = !1, t = arguments.length, n = new Array(t), r = 0; r < t; r++)
      n[r] = arguments[r];
    typeof n[n.length - 1] == "boolean" && (e = n.pop());
    var i = _B(n);
    if (!i)
      return E("'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
    i.isTracing_ === Lt.NONE && console.log("[mobx.trace] '" + i.name_ + "' tracing enabled"), i.isTracing_ = e ? Lt.BREAK : Lt.LOG;
  }
}
function _B(e) {
  switch (e.length) {
    case 0:
      return O.trackingDerivation;
    case 1:
      return nn(e[0]);
    case 2:
      return nn(e[0], e[1]);
  }
}
function fn(e, t) {
  t === void 0 && (t = void 0), et();
  try {
    return e.apply(t);
  } finally {
    tt();
  }
}
function vB(e, t, n) {
  return arguments.length === 1 || t && typeof t == "object" ? gB(e, t) : lO(e, t, n || {});
}
function lO(e, t, n) {
  var r;
  if (typeof n.timeout == "number") {
    var i = new Error("WHEN_TIMEOUT");
    r = setTimeout(function() {
      if (!o[T].isDisposed)
        if (o(), n.onError)
          n.onError(i);
        else
          throw i;
    }, n.timeout);
  }
  n.name = process.env.NODE_ENV !== "production" ? n.name || "When@" + xt() : "When";
  var s = pr(process.env.NODE_ENV !== "production" ? n.name + "-effect" : "When-effect", t), o = Sp(function(a) {
    var u = wp(!1, e);
    u && (a.dispose(), r && clearTimeout(r), s());
  }, n);
  return o;
}
function gB(e, t) {
  var n;
  if (process.env.NODE_ENV !== "production" && t && t.onError)
    return E("the options 'onError' and 'promise' cannot be combined");
  if (t != null && (n = t.signal) != null && n.aborted)
    return Object.assign(Promise.reject(new Error("WHEN_ABORTED")), {
      cancel: function() {
        return null;
      }
    });
  var r, i, s = new Promise(function(o, a) {
    var u, f = lO(e, o, yn({}, t, {
      onError: a
    }));
    r = function() {
      f(), a(new Error("WHEN_CANCELLED"));
    }, i = function() {
      f(), a(new Error("WHEN_ABORTED"));
    }, t == null || (u = t.signal) == null || u.addEventListener == null || u.addEventListener("abort", i);
  }).finally(function() {
    var o;
    return t == null || (o = t.signal) == null || o.removeEventListener == null ? void 0 : o.removeEventListener("abort", i);
  });
  return s.cancel = r, s;
}
function xr(e) {
  return e[T];
}
var yB = {
  has: function(t, n) {
    return process.env.NODE_ENV !== "production" && O.trackingDerivation && ms("detect new properties using the 'in' operator. Use 'has' from 'mobx' instead."), xr(t).has_(n);
  },
  get: function(t, n) {
    return xr(t).get_(n);
  },
  set: function(t, n, r) {
    var i;
    return gn(n) ? (process.env.NODE_ENV !== "production" && !xr(t).values_.has(n) && ms("add a new observable property through direct assignment. Use 'set' from 'mobx' instead."), (i = xr(t).set_(n, r, !0)) != null ? i : !0) : !1;
  },
  deleteProperty: function(t, n) {
    var r;
    return process.env.NODE_ENV !== "production" && ms("delete properties from an observable object. Use 'remove' from 'mobx' instead."), gn(n) ? (r = xr(t).delete_(n, !0)) != null ? r : !0 : !1;
  },
  defineProperty: function(t, n, r) {
    var i;
    return process.env.NODE_ENV !== "production" && ms("define property on an observable object. Use 'defineProperty' from 'mobx' instead."), (i = xr(t).defineProperty_(n, r)) != null ? i : !0;
  },
  ownKeys: function(t) {
    return process.env.NODE_ENV !== "production" && O.trackingDerivation && ms("iterate keys to detect added / removed properties. Use 'keys' from 'mobx' instead."), xr(t).ownKeys_();
  },
  preventExtensions: function(t) {
    E(13);
  }
};
function bB(e, t) {
  var n, r;
  return wA(), e = ui(e, t), (r = (n = e[T]).proxy_) != null ? r : n.proxy_ = new Proxy(e, yB);
}
function Nt(e) {
  return e.interceptors_ !== void 0 && e.interceptors_.length > 0;
}
function Xo(e, t) {
  var n = e.interceptors_ || (e.interceptors_ = []);
  return n.push(t), gp(function() {
    var r = n.indexOf(t);
    r !== -1 && n.splice(r, 1);
  });
}
function $t(e, t) {
  var n = ai();
  try {
    for (var r = [].concat(e.interceptors_ || []), i = 0, s = r.length; i < s && (t = r[i](t), t && !t.type && E(14), !!t); i++)
      ;
    return t;
  } finally {
    zn(n);
  }
}
function Zt(e) {
  return e.changeListeners_ !== void 0 && e.changeListeners_.length > 0;
}
function Jo(e, t) {
  var n = e.changeListeners_ || (e.changeListeners_ = []);
  return n.push(t), gp(function() {
    var r = n.indexOf(t);
    r !== -1 && n.splice(r, 1);
  });
}
function Qt(e, t) {
  var n = ai(), r = e.changeListeners_;
  if (r) {
    r = r.slice();
    for (var i = 0, s = r.length; i < s; i++)
      r[i](t);
    zn(n);
  }
}
function mB(e, t, n) {
  return Er(function() {
    var r, i = ui(e, n)[T];
    process.env.NODE_ENV !== "production" && t && e[Qe] && E("makeObservable second arg must be nullish when using decorators. Mixing @decorator syntax with annotations is not supported."), (r = t) != null || (t = Sj(e)), ki(t).forEach(function(s) {
      return i.make_(s, t[s]);
    });
  }), e;
}
var tc = /* @__PURE__ */ Symbol("mobx-keys");
function wB(e, t, n) {
  return process.env.NODE_ENV !== "production" && (!rt(e) && !rt(Object.getPrototypeOf(e)) && E("'makeAutoObservable' can only be used for classes that don't have a superclass"), _e(e) && E("makeAutoObservable can only be used on objects not already made observable")), rt(e) ? Tp(e, e, t, n) : (Er(function() {
    var r = ui(e, n)[T];
    if (!e[tc]) {
      var i = Object.getPrototypeOf(e), s = new Set([].concat(ki(e), ki(i)));
      s.delete("constructor"), s.delete(T), qo(i, tc, s);
    }
    e[tc].forEach(function(o) {
      return r.make_(
        o,
        // must pass "undefined" for { key: undefined }
        t && o in t ? t[o] : !0
      );
    });
  }), e);
}
var U_ = "splice", Kt = "update", AB = 1e4, OB = {
  get: function(t, n) {
    var r = t[T];
    return n === T ? r : n === "length" ? r.getArrayLength_() : typeof n == "string" && !isNaN(n) ? r.get_(parseInt(n)) : vt(su, n) ? su[n] : t[n];
  },
  set: function(t, n, r) {
    var i = t[T];
    return n === "length" && i.setArrayLength_(r), typeof n == "symbol" || isNaN(n) ? t[n] = r : i.set_(parseInt(n), r), !0;
  },
  preventExtensions: function() {
    E(15);
  }
}, Rp = /* @__PURE__ */ function() {
  function e(n, r, i, s) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "ObservableArray@" + xt() : "ObservableArray"), this.owned_ = void 0, this.legacyMode_ = void 0, this.atom_ = void 0, this.values_ = [], this.interceptors_ = void 0, this.changeListeners_ = void 0, this.enhancer_ = void 0, this.dehancer = void 0, this.proxy_ = void 0, this.lastKnownLength_ = 0, this.owned_ = i, this.legacyMode_ = s, this.atom_ = new Or(n), this.enhancer_ = function(o, a) {
      return r(o, a, process.env.NODE_ENV !== "production" ? n + "[..]" : "ObservableArray[..]");
    };
  }
  var t = e.prototype;
  return t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.dehanceValues_ = function(r) {
    return this.dehancer !== void 0 && r.length > 0 ? r.map(this.dehancer) : r;
  }, t.intercept_ = function(r) {
    return Xo(this, r);
  }, t.observe_ = function(r, i) {
    return i === void 0 && (i = !1), i && r({
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: "splice",
      index: 0,
      added: this.values_.slice(),
      addedCount: this.values_.length,
      removed: [],
      removedCount: 0
    }), Jo(this, r);
  }, t.getArrayLength_ = function() {
    return this.atom_.reportObserved(), this.values_.length;
  }, t.setArrayLength_ = function(r) {
    (typeof r != "number" || isNaN(r) || r < 0) && E("Out of range: " + r);
    var i = this.values_.length;
    if (r !== i)
      if (r > i) {
        for (var s = new Array(r - i), o = 0; o < r - i; o++)
          s[o] = void 0;
        this.spliceWithArray_(i, 0, s);
      } else
        this.spliceWithArray_(r, i - r);
  }, t.updateArrayLength_ = function(r, i) {
    r !== this.lastKnownLength_ && E(16), this.lastKnownLength_ += i, this.legacyMode_ && i > 0 && _O(r + i + 1);
  }, t.spliceWithArray_ = function(r, i, s) {
    var o = this;
    hn(this.atom_);
    var a = this.values_.length;
    if (r === void 0 ? r = 0 : r > a ? r = a : r < 0 && (r = Math.max(0, a + r)), arguments.length === 1 ? i = a - r : i == null ? i = 0 : i = Math.max(0, Math.min(i, a - r)), s === void 0 && (s = eu), Nt(this)) {
      var u = $t(this, {
        object: this.proxy_,
        type: U_,
        index: r,
        removedCount: i,
        added: s
      });
      if (!u)
        return eu;
      i = u.removedCount, s = u.added;
    }
    if (s = s.length === 0 ? s : s.map(function(l) {
      return o.enhancer_(l, void 0);
    }), this.legacyMode_ || process.env.NODE_ENV !== "production") {
      var f = s.length - i;
      this.updateArrayLength_(a, f);
    }
    var c = this.spliceItemsIntoValues_(r, i, s);
    return (i !== 0 || s.length !== 0) && this.notifyArraySplice_(r, s, c), this.dehanceValues_(c);
  }, t.spliceItemsIntoValues_ = function(r, i, s) {
    if (s.length < AB) {
      var o;
      return (o = this.values_).splice.apply(o, [r, i].concat(s));
    } else {
      var a = this.values_.slice(r, r + i), u = this.values_.slice(r + i);
      this.values_.length += s.length - i;
      for (var f = 0; f < s.length; f++)
        this.values_[r + f] = s[f];
      for (var c = 0; c < u.length; c++)
        this.values_[r + s.length + c] = u[c];
      return a;
    }
  }, t.notifyArrayChildUpdate_ = function(r, i, s) {
    var o = !this.owned_ && Re(), a = Zt(this), u = a || o ? {
      observableKind: "array",
      object: this.proxy_,
      type: Kt,
      debugObjectName: this.atom_.name_,
      index: r,
      newValue: i,
      oldValue: s
    } : null;
    process.env.NODE_ENV !== "production" && o && gt(u), this.atom_.reportChanged(), a && Qt(this, u), process.env.NODE_ENV !== "production" && o && yt();
  }, t.notifyArraySplice_ = function(r, i, s) {
    var o = !this.owned_ && Re(), a = Zt(this), u = a || o ? {
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: U_,
      index: r,
      removed: s,
      added: i,
      removedCount: s.length,
      addedCount: i.length
    } : null;
    process.env.NODE_ENV !== "production" && o && gt(u), this.atom_.reportChanged(), a && Qt(this, u), process.env.NODE_ENV !== "production" && o && yt();
  }, t.get_ = function(r) {
    if (this.legacyMode_ && r >= this.values_.length) {
      console.warn(process.env.NODE_ENV !== "production" ? "[mobx.array] Attempt to read an array index (" + r + ") that is out of bounds (" + this.values_.length + "). Please check length first. Out of bound indices will not be tracked by MobX" : "[mobx] Out of bounds read: " + r);
      return;
    }
    return this.atom_.reportObserved(), this.dehanceValue_(this.values_[r]);
  }, t.set_ = function(r, i) {
    var s = this.values_;
    if (this.legacyMode_ && r > s.length && E(17, r, s.length), r < s.length) {
      hn(this.atom_);
      var o = s[r];
      if (Nt(this)) {
        var a = $t(this, {
          type: Kt,
          object: this.proxy_,
          // since "this" is the real array we need to pass its proxy
          index: r,
          newValue: i
        });
        if (!a)
          return;
        i = a.newValue;
      }
      i = this.enhancer_(i, o);
      var u = i !== o;
      u && (s[r] = i, this.notifyArrayChildUpdate_(r, i, o));
    } else {
      for (var f = new Array(r + 1 - s.length), c = 0; c < f.length - 1; c++)
        f[c] = void 0;
      f[f.length - 1] = i, this.spliceWithArray_(s.length, 0, f);
    }
  }, e;
}();
function EB(e, t, n, r) {
  return n === void 0 && (n = process.env.NODE_ENV !== "production" ? "ObservableArray@" + xt() : "ObservableArray"), r === void 0 && (r = !1), wA(), Er(function() {
    var i = new Rp(n, t, r, !1);
    OA(i.values_, T, i);
    var s = new Proxy(i.values_, OB);
    return i.proxy_ = s, e && e.length && i.spliceWithArray_(0, 0, e), s;
  });
}
var su = {
  clear: function() {
    return this.splice(0);
  },
  replace: function(t) {
    var n = this[T];
    return n.spliceWithArray_(0, n.values_.length, t);
  },
  // Used by JSON.stringify
  toJSON: function() {
    return this.slice();
  },
  /*
   * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
   * since these functions alter the inner structure of the array, the have side effects.
   * Because the have side effects, they should not be used in computed function,
   * and for that reason the do not call dependencyState.notifyObserved
   */
  splice: function(t, n) {
    for (var r = arguments.length, i = new Array(r > 2 ? r - 2 : 0), s = 2; s < r; s++)
      i[s - 2] = arguments[s];
    var o = this[T];
    switch (arguments.length) {
      case 0:
        return [];
      case 1:
        return o.spliceWithArray_(t);
      case 2:
        return o.spliceWithArray_(t, n);
    }
    return o.spliceWithArray_(t, n, i);
  },
  spliceWithArray: function(t, n, r) {
    return this[T].spliceWithArray_(t, n, r);
  },
  push: function() {
    for (var t = this[T], n = arguments.length, r = new Array(n), i = 0; i < n; i++)
      r[i] = arguments[i];
    return t.spliceWithArray_(t.values_.length, 0, r), t.values_.length;
  },
  pop: function() {
    return this.splice(Math.max(this[T].values_.length - 1, 0), 1)[0];
  },
  shift: function() {
    return this.splice(0, 1)[0];
  },
  unshift: function() {
    for (var t = this[T], n = arguments.length, r = new Array(n), i = 0; i < n; i++)
      r[i] = arguments[i];
    return t.spliceWithArray_(0, 0, r), t.values_.length;
  },
  reverse: function() {
    return O.trackingDerivation && E(37, "reverse"), this.replace(this.slice().reverse()), this;
  },
  sort: function() {
    O.trackingDerivation && E(37, "sort");
    var t = this.slice();
    return t.sort.apply(t, arguments), this.replace(t), this;
  },
  remove: function(t) {
    var n = this[T], r = n.dehanceValues_(n.values_).indexOf(t);
    return r > -1 ? (this.splice(r, 1), !0) : !1;
  }
};
ee("at", Tt);
ee("concat", Tt);
ee("flat", Tt);
ee("includes", Tt);
ee("indexOf", Tt);
ee("join", Tt);
ee("lastIndexOf", Tt);
ee("slice", Tt);
ee("toString", Tt);
ee("toLocaleString", Tt);
ee("toSorted", Tt);
ee("toSpliced", Tt);
ee("with", Tt);
ee("every", sn);
ee("filter", sn);
ee("find", sn);
ee("findIndex", sn);
ee("findLast", sn);
ee("findLastIndex", sn);
ee("flatMap", sn);
ee("forEach", sn);
ee("map", sn);
ee("some", sn);
ee("toReversed", sn);
ee("reduce", hO);
ee("reduceRight", hO);
function ee(e, t) {
  typeof Array.prototype[e] == "function" && (su[e] = t(e));
}
function Tt(e) {
  return function() {
    var t = this[T];
    t.atom_.reportObserved();
    var n = t.dehanceValues_(t.values_);
    return n[e].apply(n, arguments);
  };
}
function sn(e) {
  return function(t, n) {
    var r = this, i = this[T];
    i.atom_.reportObserved();
    var s = i.dehanceValues_(i.values_);
    return s[e](function(o, a) {
      return t.call(n, o, a, r);
    });
  };
}
function hO(e) {
  return function() {
    var t = this, n = this[T];
    n.atom_.reportObserved();
    var r = n.dehanceValues_(n.values_), i = arguments[0];
    return arguments[0] = function(s, o, a) {
      return i(s, o, a, t);
    }, r[e].apply(r, arguments);
  };
}
var SB = /* @__PURE__ */ Ar("ObservableArrayAdministration", Rp);
function Je(e) {
  return _f(e) && SB(e[T]);
}
var xB = {}, er = "add", ou = "delete", Pp = /* @__PURE__ */ function() {
  function e(n, r, i) {
    var s = this;
    r === void 0 && (r = Vr), i === void 0 && (i = process.env.NODE_ENV !== "production" ? "ObservableMap@" + xt() : "ObservableMap"), this.enhancer_ = void 0, this.name_ = void 0, this[T] = xB, this.data_ = void 0, this.hasMap_ = void 0, this.keysAtom_ = void 0, this.interceptors_ = void 0, this.changeListeners_ = void 0, this.dehancer = void 0, this.enhancer_ = r, this.name_ = i, ae(Map) || E(18), Er(function() {
      s.keysAtom_ = bp(process.env.NODE_ENV !== "production" ? s.name_ + ".keys()" : "ObservableMap.keys()"), s.data_ = /* @__PURE__ */ new Map(), s.hasMap_ = /* @__PURE__ */ new Map(), n && s.merge(n);
    });
  }
  var t = e.prototype;
  return t.has_ = function(r) {
    return this.data_.has(r);
  }, t.has = function(r) {
    var i = this;
    if (!O.trackingDerivation)
      return this.has_(r);
    var s = this.hasMap_.get(r);
    if (!s) {
      var o = s = new sr(this.has_(r), gf, process.env.NODE_ENV !== "production" ? this.name_ + "." + Hc(r) + "?" : "ObservableMap.key?", !1);
      this.hasMap_.set(r, o), xp(o, function() {
        return i.hasMap_.delete(r);
      });
    }
    return s.get();
  }, t.set = function(r, i) {
    var s = this.has_(r);
    if (Nt(this)) {
      var o = $t(this, {
        type: s ? Kt : er,
        object: this,
        newValue: i,
        name: r
      });
      if (!o)
        return this;
      i = o.newValue;
    }
    return s ? this.updateValue_(r, i) : this.addValue_(r, i), this;
  }, t.delete = function(r) {
    var i = this;
    if (hn(this.keysAtom_), Nt(this)) {
      var s = $t(this, {
        type: ou,
        object: this,
        name: r
      });
      if (!s)
        return !1;
    }
    if (this.has_(r)) {
      var o = Re(), a = Zt(this), u = a || o ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: ou,
        object: this,
        oldValue: this.data_.get(r).value_,
        name: r
      } : null;
      return process.env.NODE_ENV !== "production" && o && gt(u), fn(function() {
        var f;
        i.keysAtom_.reportChanged(), (f = i.hasMap_.get(r)) == null || f.setNewValue_(!1);
        var c = i.data_.get(r);
        c.setNewValue_(void 0), i.data_.delete(r);
      }), a && Qt(this, u), process.env.NODE_ENV !== "production" && o && yt(), !0;
    }
    return !1;
  }, t.updateValue_ = function(r, i) {
    var s = this.data_.get(r);
    if (i = s.prepareNewValue_(i), i !== O.UNCHANGED) {
      var o = Re(), a = Zt(this), u = a || o ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: Kt,
        object: this,
        oldValue: s.value_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && o && gt(u), s.setNewValue_(i), a && Qt(this, u), process.env.NODE_ENV !== "production" && o && yt();
    }
  }, t.addValue_ = function(r, i) {
    var s = this;
    hn(this.keysAtom_), fn(function() {
      var f, c = new sr(i, s.enhancer_, process.env.NODE_ENV !== "production" ? s.name_ + "." + Hc(r) : "ObservableMap.key", !1);
      s.data_.set(r, c), i = c.value_, (f = s.hasMap_.get(r)) == null || f.setNewValue_(!0), s.keysAtom_.reportChanged();
    });
    var o = Re(), a = Zt(this), u = a || o ? {
      observableKind: "map",
      debugObjectName: this.name_,
      type: er,
      object: this,
      name: r,
      newValue: i
    } : null;
    process.env.NODE_ENV !== "production" && o && gt(u), a && Qt(this, u), process.env.NODE_ENV !== "production" && o && yt();
  }, t.get = function(r) {
    return this.has(r) ? this.dehanceValue_(this.data_.get(r).get()) : this.dehanceValue_(void 0);
  }, t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.keys = function() {
    return this.keysAtom_.reportObserved(), this.data_.keys();
  }, t.values = function() {
    var r = this, i = this.keys();
    return V_({
      next: function() {
        var o = i.next(), a = o.done, u = o.value;
        return {
          done: a,
          value: a ? void 0 : r.get(u)
        };
      }
    });
  }, t.entries = function() {
    var r = this, i = this.keys();
    return V_({
      next: function() {
        var o = i.next(), a = o.done, u = o.value;
        return {
          done: a,
          value: a ? void 0 : [u, r.get(u)]
        };
      }
    });
  }, t[Symbol.iterator] = function() {
    return this.entries();
  }, t.forEach = function(r, i) {
    for (var s = yi(this), o; !(o = s()).done; ) {
      var a = o.value, u = a[0], f = a[1];
      r.call(i, f, u, this);
    }
  }, t.merge = function(r) {
    var i = this;
    return ye(r) && (r = new Map(r)), fn(function() {
      rt(r) ? yj(r).forEach(function(s) {
        return i.set(s, r[s]);
      }) : Array.isArray(r) ? r.forEach(function(s) {
        var o = s[0], a = s[1];
        return i.set(o, a);
      }) : cs(r) ? (gj(r) || E(19, r), r.forEach(function(s, o) {
        return i.set(o, s);
      })) : r != null && E(20, r);
    }), this;
  }, t.clear = function() {
    var r = this;
    fn(function() {
      Op(function() {
        for (var i = yi(r.keys()), s; !(s = i()).done; ) {
          var o = s.value;
          r.delete(o);
        }
      });
    });
  }, t.replace = function(r) {
    var i = this;
    return fn(function() {
      for (var s = TB(r), o = /* @__PURE__ */ new Map(), a = !1, u = yi(i.data_.keys()), f; !(f = u()).done; ) {
        var c = f.value;
        if (!s.has(c)) {
          var l = i.delete(c);
          if (l)
            a = !0;
          else {
            var h = i.data_.get(c);
            o.set(c, h);
          }
        }
      }
      for (var d = yi(s.entries()), _; !(_ = d()).done; ) {
        var v = _.value, g = v[0], y = v[1], b = i.data_.has(g);
        if (i.set(g, y), i.data_.has(g)) {
          var w = i.data_.get(g);
          o.set(g, w), b || (a = !0);
        }
      }
      if (!a)
        if (i.data_.size !== o.size)
          i.keysAtom_.reportChanged();
        else
          for (var m = i.data_.keys(), A = o.keys(), S = m.next(), R = A.next(); !S.done; ) {
            if (S.value !== R.value) {
              i.keysAtom_.reportChanged();
              break;
            }
            S = m.next(), R = A.next();
          }
      i.data_ = o;
    }), this;
  }, t.toString = function() {
    return "[object ObservableMap]";
  }, t.toJSON = function() {
    return Array.from(this);
  }, t.observe_ = function(r, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support fireImmediately=true in combination with maps."), Jo(this, r);
  }, t.intercept_ = function(r) {
    return Xo(this, r);
  }, ls(e, [{
    key: "size",
    get: function() {
      return this.keysAtom_.reportObserved(), this.data_.size;
    }
  }, {
    key: Symbol.toStringTag,
    get: function() {
      return "Map";
    }
  }]);
}(), ye = /* @__PURE__ */ Ar("ObservableMap", Pp);
function V_(e) {
  return e[Symbol.toStringTag] = "MapIterator", Ip(e);
}
function TB(e) {
  if (cs(e) || ye(e))
    return e;
  if (Array.isArray(e))
    return new Map(e);
  if (rt(e)) {
    var t = /* @__PURE__ */ new Map();
    for (var n in e)
      t.set(n, e[n]);
    return t;
  } else
    return E(21, e);
}
var RB = {}, Np = /* @__PURE__ */ function() {
  function e(n, r, i) {
    var s = this;
    r === void 0 && (r = Vr), i === void 0 && (i = process.env.NODE_ENV !== "production" ? "ObservableSet@" + xt() : "ObservableSet"), this.name_ = void 0, this[T] = RB, this.data_ = /* @__PURE__ */ new Set(), this.atom_ = void 0, this.changeListeners_ = void 0, this.interceptors_ = void 0, this.dehancer = void 0, this.enhancer_ = void 0, this.name_ = i, ae(Set) || E(22), this.enhancer_ = function(o, a) {
      return r(o, a, i);
    }, Er(function() {
      s.atom_ = bp(s.name_), n && s.replace(n);
    });
  }
  var t = e.prototype;
  return t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.clear = function() {
    var r = this;
    fn(function() {
      Op(function() {
        for (var i = yi(r.data_.values()), s; !(s = i()).done; ) {
          var o = s.value;
          r.delete(o);
        }
      });
    });
  }, t.forEach = function(r, i) {
    for (var s = yi(this), o; !(o = s()).done; ) {
      var a = o.value;
      r.call(i, a, a, this);
    }
  }, t.add = function(r) {
    var i = this;
    if (hn(this.atom_), Nt(this)) {
      var s = $t(this, {
        type: er,
        object: this,
        newValue: r
      });
      if (!s)
        return this;
      r = s.newValue;
    }
    if (!this.has(r)) {
      fn(function() {
        i.data_.add(i.enhancer_(r, void 0)), i.atom_.reportChanged();
      });
      var o = process.env.NODE_ENV !== "production" && Re(), a = Zt(this), u = a || o ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: er,
        object: this,
        newValue: r
      } : null;
      o && process.env.NODE_ENV !== "production" && gt(u), a && Qt(this, u), o && process.env.NODE_ENV !== "production" && yt();
    }
    return this;
  }, t.delete = function(r) {
    var i = this;
    if (Nt(this)) {
      var s = $t(this, {
        type: ou,
        object: this,
        oldValue: r
      });
      if (!s)
        return !1;
    }
    if (this.has(r)) {
      var o = process.env.NODE_ENV !== "production" && Re(), a = Zt(this), u = a || o ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: ou,
        object: this,
        oldValue: r
      } : null;
      return o && process.env.NODE_ENV !== "production" && gt(u), fn(function() {
        i.atom_.reportChanged(), i.data_.delete(r);
      }), a && Qt(this, u), o && process.env.NODE_ENV !== "production" && yt(), !0;
    }
    return !1;
  }, t.has = function(r) {
    return this.atom_.reportObserved(), this.data_.has(this.dehanceValue_(r));
  }, t.entries = function() {
    var r = this.values();
    return W_({
      next: function() {
        var s = r.next(), o = s.value, a = s.done;
        return a ? {
          value: void 0,
          done: a
        } : {
          value: [o, o],
          done: a
        };
      }
    });
  }, t.keys = function() {
    return this.values();
  }, t.values = function() {
    this.atom_.reportObserved();
    var r = this, i = this.data_.values();
    return W_({
      next: function() {
        var o = i.next(), a = o.value, u = o.done;
        return u ? {
          value: void 0,
          done: u
        } : {
          value: r.dehanceValue_(a),
          done: u
        };
      }
    });
  }, t.intersection = function(r) {
    if (Fn(r) && !de(r))
      return r.intersection(this);
    var i = new Set(this);
    return i.intersection(r);
  }, t.union = function(r) {
    if (Fn(r) && !de(r))
      return r.union(this);
    var i = new Set(this);
    return i.union(r);
  }, t.difference = function(r) {
    return new Set(this).difference(r);
  }, t.symmetricDifference = function(r) {
    if (Fn(r) && !de(r))
      return r.symmetricDifference(this);
    var i = new Set(this);
    return i.symmetricDifference(r);
  }, t.isSubsetOf = function(r) {
    return new Set(this).isSubsetOf(r);
  }, t.isSupersetOf = function(r) {
    return new Set(this).isSupersetOf(r);
  }, t.isDisjointFrom = function(r) {
    if (Fn(r) && !de(r))
      return r.isDisjointFrom(this);
    var i = new Set(this);
    return i.isDisjointFrom(r);
  }, t.replace = function(r) {
    var i = this;
    return de(r) && (r = new Set(r)), fn(function() {
      Array.isArray(r) ? (i.clear(), r.forEach(function(s) {
        return i.add(s);
      })) : Fn(r) ? (i.clear(), r.forEach(function(s) {
        return i.add(s);
      })) : r != null && E("Cannot initialize set from " + r);
    }), this;
  }, t.observe_ = function(r, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support fireImmediately=true in combination with sets."), Jo(this, r);
  }, t.intercept_ = function(r) {
    return Xo(this, r);
  }, t.toJSON = function() {
    return Array.from(this);
  }, t.toString = function() {
    return "[object ObservableSet]";
  }, t[Symbol.iterator] = function() {
    return this.values();
  }, ls(e, [{
    key: "size",
    get: function() {
      return this.atom_.reportObserved(), this.data_.size;
    }
  }, {
    key: Symbol.toStringTag,
    get: function() {
      return "Set";
    }
  }]);
}(), de = /* @__PURE__ */ Ar("ObservableSet", Np);
function W_(e) {
  return e[Symbol.toStringTag] = "SetIterator", Ip(e);
}
var k_ = /* @__PURE__ */ Object.create(null), q_ = "remove", nl = /* @__PURE__ */ function() {
  function e(n, r, i, s) {
    r === void 0 && (r = /* @__PURE__ */ new Map()), s === void 0 && (s = Qj), this.target_ = void 0, this.values_ = void 0, this.name_ = void 0, this.defaultAnnotation_ = void 0, this.keysAtom_ = void 0, this.changeListeners_ = void 0, this.interceptors_ = void 0, this.proxy_ = void 0, this.isPlainObject_ = void 0, this.appliedAnnotations_ = void 0, this.pendingKeys_ = void 0, this.target_ = n, this.values_ = r, this.name_ = i, this.defaultAnnotation_ = s, this.keysAtom_ = new Or(process.env.NODE_ENV !== "production" ? this.name_ + ".keys" : "ObservableObject.keys"), this.isPlainObject_ = rt(this.target_), process.env.NODE_ENV !== "production" && !vO(this.defaultAnnotation_) && E("defaultAnnotation must be valid annotation"), process.env.NODE_ENV !== "production" && (this.appliedAnnotations_ = {});
  }
  var t = e.prototype;
  return t.getObservablePropValue_ = function(r) {
    return this.values_.get(r).get();
  }, t.setObservablePropValue_ = function(r, i) {
    var s = this.values_.get(r);
    if (s instanceof zt)
      return s.set(i), !0;
    if (Nt(this)) {
      var o = $t(this, {
        type: Kt,
        object: this.proxy_ || this.target_,
        name: r,
        newValue: i
      });
      if (!o)
        return null;
      i = o.newValue;
    }
    if (i = s.prepareNewValue_(i), i !== O.UNCHANGED) {
      var a = Zt(this), u = process.env.NODE_ENV !== "production" && Re(), f = a || u ? {
        type: Kt,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        oldValue: s.value_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && u && gt(f), s.setNewValue_(i), a && Qt(this, f), process.env.NODE_ENV !== "production" && u && yt();
    }
    return !0;
  }, t.get_ = function(r) {
    return O.trackingDerivation && !vt(this.target_, r) && this.has_(r), this.target_[r];
  }, t.set_ = function(r, i, s) {
    return s === void 0 && (s = !1), vt(this.target_, r) ? this.values_.has(r) ? this.setObservablePropValue_(r, i) : s ? Reflect.set(this.target_, r, i) : (this.target_[r] = i, !0) : this.extend_(r, {
      value: i,
      enumerable: !0,
      writable: !0,
      configurable: !0
    }, this.defaultAnnotation_, s);
  }, t.has_ = function(r) {
    if (!O.trackingDerivation)
      return r in this.target_;
    this.pendingKeys_ || (this.pendingKeys_ = /* @__PURE__ */ new Map());
    var i = this.pendingKeys_.get(r);
    return i || (i = new sr(r in this.target_, gf, process.env.NODE_ENV !== "production" ? this.name_ + "." + Hc(r) + "?" : "ObservableObject.key?", !1), this.pendingKeys_.set(r, i)), i.get();
  }, t.make_ = function(r, i) {
    if (i === !0 && (i = this.defaultAnnotation_), i !== !1) {
      if (K_(this, i, r), !(r in this.target_)) {
        var s;
        if ((s = this.target_[Qe]) != null && s[r])
          return;
        E(1, i.annotationType_, this.name_ + "." + r.toString());
      }
      for (var o = this.target_; o && o !== ko; ) {
        var a = Qa(o, r);
        if (a) {
          var u = i.make_(this, r, a, o);
          if (u === 0)
            return;
          if (u === 1)
            break;
        }
        o = Object.getPrototypeOf(o);
      }
      H_(this, i, r);
    }
  }, t.extend_ = function(r, i, s, o) {
    if (o === void 0 && (o = !1), s === !0 && (s = this.defaultAnnotation_), s === !1)
      return this.defineProperty_(r, i, o);
    K_(this, s, r);
    var a = s.extend_(this, r, i, o);
    return a && H_(this, s, r), a;
  }, t.defineProperty_ = function(r, i, s) {
    s === void 0 && (s = !1), hn(this.keysAtom_);
    try {
      et();
      var o = this.delete_(r);
      if (!o)
        return o;
      if (Nt(this)) {
        var a = $t(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: er,
          newValue: i.value
        });
        if (!a)
          return null;
        var u = a.newValue;
        i.value !== u && (i = yn({}, i, {
          value: u
        }));
      }
      if (s) {
        if (!Reflect.defineProperty(this.target_, r, i))
          return !1;
      } else
        dn(this.target_, r, i);
      this.notifyPropertyAddition_(r, i.value);
    } finally {
      tt();
    }
    return !0;
  }, t.defineObservableProperty_ = function(r, i, s, o) {
    o === void 0 && (o = !1), hn(this.keysAtom_);
    try {
      et();
      var a = this.delete_(r);
      if (!a)
        return a;
      if (Nt(this)) {
        var u = $t(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: er,
          newValue: i
        });
        if (!u)
          return null;
        i = u.newValue;
      }
      var f = G_(r), c = {
        configurable: O.safeDescriptors ? this.isPlainObject_ : !0,
        enumerable: !0,
        get: f.get,
        set: f.set
      };
      if (o) {
        if (!Reflect.defineProperty(this.target_, r, c))
          return !1;
      } else
        dn(this.target_, r, c);
      var l = new sr(i, s, process.env.NODE_ENV !== "production" ? this.name_ + "." + r.toString() : "ObservableObject.key", !1);
      this.values_.set(r, l), this.notifyPropertyAddition_(r, l.value_);
    } finally {
      tt();
    }
    return !0;
  }, t.defineComputedProperty_ = function(r, i, s) {
    s === void 0 && (s = !1), hn(this.keysAtom_);
    try {
      et();
      var o = this.delete_(r);
      if (!o)
        return o;
      if (Nt(this)) {
        var a = $t(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: er,
          newValue: void 0
        });
        if (!a)
          return null;
      }
      i.name || (i.name = process.env.NODE_ENV !== "production" ? this.name_ + "." + r.toString() : "ObservableObject.key"), i.context = this.proxy_ || this.target_;
      var u = G_(r), f = {
        configurable: O.safeDescriptors ? this.isPlainObject_ : !0,
        enumerable: !1,
        get: u.get,
        set: u.set
      };
      if (s) {
        if (!Reflect.defineProperty(this.target_, r, f))
          return !1;
      } else
        dn(this.target_, r, f);
      this.values_.set(r, new zt(i)), this.notifyPropertyAddition_(r, void 0);
    } finally {
      tt();
    }
    return !0;
  }, t.delete_ = function(r, i) {
    if (i === void 0 && (i = !1), hn(this.keysAtom_), !vt(this.target_, r))
      return !0;
    if (Nt(this)) {
      var s = $t(this, {
        object: this.proxy_ || this.target_,
        name: r,
        type: q_
      });
      if (!s)
        return null;
    }
    try {
      var o;
      et();
      var a = Zt(this), u = process.env.NODE_ENV !== "production" && Re(), f = this.values_.get(r), c = void 0;
      if (!f && (a || u)) {
        var l;
        c = (l = Qa(this.target_, r)) == null ? void 0 : l.value;
      }
      if (i) {
        if (!Reflect.deleteProperty(this.target_, r))
          return !1;
      } else
        delete this.target_[r];
      if (process.env.NODE_ENV !== "production" && delete this.appliedAnnotations_[r], f && (this.values_.delete(r), f instanceof sr && (c = f.value_), qA(f)), this.keysAtom_.reportChanged(), (o = this.pendingKeys_) == null || (o = o.get(r)) == null || o.set(r in this.target_), a || u) {
        var h = {
          type: q_,
          observableKind: "object",
          object: this.proxy_ || this.target_,
          debugObjectName: this.name_,
          oldValue: c,
          name: r
        };
        process.env.NODE_ENV !== "production" && u && gt(h), a && Qt(this, h), process.env.NODE_ENV !== "production" && u && yt();
      }
    } finally {
      tt();
    }
    return !0;
  }, t.observe_ = function(r, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support the fire immediately property for observable objects."), Jo(this, r);
  }, t.intercept_ = function(r) {
    return Xo(this, r);
  }, t.notifyPropertyAddition_ = function(r, i) {
    var s, o = Zt(this), a = process.env.NODE_ENV !== "production" && Re();
    if (o || a) {
      var u = o || a ? {
        type: er,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && a && gt(u), o && Qt(this, u), process.env.NODE_ENV !== "production" && a && yt();
    }
    (s = this.pendingKeys_) == null || (s = s.get(r)) == null || s.set(!0), this.keysAtom_.reportChanged();
  }, t.ownKeys_ = function() {
    return this.keysAtom_.reportObserved(), ki(this.target_);
  }, t.keys_ = function() {
    return this.keysAtom_.reportObserved(), Object.keys(this.target_);
  }, e;
}();
function ui(e, t) {
  var n;
  if (process.env.NODE_ENV !== "production" && t && _e(e) && E("Options can't be provided for already observable objects."), vt(e, T))
    return process.env.NODE_ENV !== "production" && !(mn(e) instanceof nl) && E("Cannot convert '" + ao(e) + `' into observable object:
The target is already observable of different type.
Extending builtins is not supported.`), e;
  process.env.NODE_ENV !== "production" && !Object.isExtensible(e) && E("Cannot make the designated object observable; it is not extensible");
  var r = (n = t?.name) != null ? n : process.env.NODE_ENV !== "production" ? (rt(e) ? "ObservableObject" : e.constructor.name) + "@" + xt() : "ObservableObject", i = new nl(e, /* @__PURE__ */ new Map(), String(r), cF(t));
  return qo(e, T, i), e;
}
var PB = /* @__PURE__ */ Ar("ObservableObjectAdministration", nl);
function G_(e) {
  return k_[e] || (k_[e] = {
    get: function() {
      return this[T].getObservablePropValue_(e);
    },
    set: function(n) {
      return this[T].setObservablePropValue_(e, n);
    }
  });
}
function _e(e) {
  return _f(e) ? PB(e[T]) : !1;
}
function H_(e, t, n) {
  var r;
  process.env.NODE_ENV !== "production" && (e.appliedAnnotations_[n] = t), (r = e.target_[Qe]) == null || delete r[n];
}
function K_(e, t, n) {
  if (process.env.NODE_ENV !== "production" && !vO(t) && E("Cannot annotate '" + e.name_ + "." + n.toString() + "': Invalid annotation."), process.env.NODE_ENV !== "production" && !tu(t) && vt(e.appliedAnnotations_, n)) {
    var r = e.name_ + "." + n.toString(), i = e.appliedAnnotations_[n].annotationType_, s = t.annotationType_;
    E("Cannot apply '" + s + "' to '" + r + "':" + (`
The field is already annotated with '` + i + "'.") + `
Re-annotating fields is not allowed.
Use 'override' annotation for methods overridden by subclass.`);
  }
}
var NB = /* @__PURE__ */ dO(0), $B = /* @__PURE__ */ function() {
  var e = !1, t = {};
  return Object.defineProperty(t, "0", {
    set: function() {
      e = !0;
    }
  }), Object.create(t)[0] = 1, e === !1;
}(), nc = 0, pO = function() {
};
function MB(e, t) {
  Object.setPrototypeOf ? Object.setPrototypeOf(e.prototype, t) : e.prototype.__proto__ !== void 0 ? e.prototype.__proto__ = t : e.prototype = t;
}
MB(pO, Array.prototype);
var $p = /* @__PURE__ */ function(e) {
  function t(r, i, s, o) {
    var a;
    return s === void 0 && (s = process.env.NODE_ENV !== "production" ? "ObservableArray@" + xt() : "ObservableArray"), o === void 0 && (o = !1), a = e.call(this) || this, Er(function() {
      var u = new Rp(s, i, o, !0);
      u.proxy_ = a, OA(a, T, u), r && r.length && a.spliceWithArray(0, 0, r), $B && Object.defineProperty(a, "0", NB);
    }), a;
  }
  xA(t, e);
  var n = t.prototype;
  return n.concat = function() {
    this[T].atom_.reportObserved();
    for (var i = arguments.length, s = new Array(i), o = 0; o < i; o++)
      s[o] = arguments[o];
    return Array.prototype.concat.apply(
      this.slice(),
      //@ts-ignore
      s.map(function(a) {
        return Je(a) ? a.slice() : a;
      })
    );
  }, n[Symbol.iterator] = function() {
    var r = this, i = 0;
    return Ip({
      next: function() {
        return i < r.length ? {
          value: r[i++],
          done: !1
        } : {
          done: !0,
          value: void 0
        };
      }
    });
  }, ls(t, [{
    key: "length",
    get: function() {
      return this[T].getArrayLength_();
    },
    set: function(i) {
      this[T].setArrayLength_(i);
    }
  }, {
    key: Symbol.toStringTag,
    get: function() {
      return "Array";
    }
  }]);
}(pO);
Object.entries(su).forEach(function(e) {
  var t = e[0], n = e[1];
  t !== "concat" && qo($p.prototype, t, n);
});
function dO(e) {
  return {
    enumerable: !1,
    configurable: !0,
    get: function() {
      return this[T].get_(e);
    },
    set: function(n) {
      this[T].set_(e, n);
    }
  };
}
function IB(e) {
  dn($p.prototype, "" + e, dO(e));
}
function _O(e) {
  if (e > nc) {
    for (var t = nc; t < e + 100; t++)
      IB(t);
    nc = e;
  }
}
_O(1e3);
function DB(e, t, n) {
  return new $p(e, t, n);
}
function nn(e, t) {
  if (typeof e == "object" && e !== null) {
    if (Je(e))
      return t !== void 0 && E(23), e[T].atom_;
    if (de(e))
      return e.atom_;
    if (ye(e)) {
      if (t === void 0)
        return e.keysAtom_;
      var n = e.data_.get(t) || e.hasMap_.get(t);
      return n || E(25, t, ao(e)), n;
    }
    if (_e(e)) {
      if (!t)
        return E(26);
      var r = e[T].values_.get(t);
      return r || E(27, t, ao(e)), r;
    }
    if (yp(e) || Wr(e) || iu(e))
      return e;
  } else if (ae(e) && iu(e[T]))
    return e[T];
  E(28);
}
function mn(e, t) {
  if (e || E(29), t !== void 0)
    return mn(nn(e, t));
  if (yp(e) || Wr(e) || iu(e) || ye(e) || de(e))
    return e;
  if (e[T])
    return e[T];
  E(24, e);
}
function ao(e, t) {
  var n;
  if (t !== void 0)
    n = nn(e, t);
  else {
    if (qr(e))
      return e.name;
    _e(e) || ye(e) || de(e) ? n = mn(e) : n = nn(e);
  }
  return n.name_;
}
function Er(e) {
  var t = ai(), n = bf(!0);
  et();
  try {
    return e();
  } finally {
    tt(), mf(n), zn(t);
  }
}
var Y_ = ko.toString;
function Mp(e, t, n) {
  return n === void 0 && (n = -1), rl(e, t, n);
}
function rl(e, t, n, r, i) {
  if (e === t)
    return e !== 0 || 1 / e === 1 / t;
  if (e == null || t == null)
    return !1;
  if (e !== e)
    return t !== t;
  var s = typeof e;
  if (s !== "function" && s !== "object" && typeof t != "object")
    return !1;
  var o = Y_.call(e);
  if (o !== Y_.call(t))
    return !1;
  switch (o) {
    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case "[object RegExp]":
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case "[object String]":
      return "" + e == "" + t;
    case "[object Number]":
      return +e != +e ? +t != +t : +e == 0 ? 1 / +e === 1 / t : +e == +t;
    case "[object Date]":
    case "[object Boolean]":
      return +e == +t;
    case "[object Symbol]":
      return typeof Symbol < "u" && Symbol.valueOf.call(e) === Symbol.valueOf.call(t);
    case "[object Map]":
    case "[object Set]":
      n >= 0 && n++;
      break;
  }
  e = X_(e), t = X_(t);
  var a = o === "[object Array]";
  if (!a) {
    if (typeof e != "object" || typeof t != "object")
      return !1;
    var u = e.constructor, f = t.constructor;
    if (u !== f && !(ae(u) && u instanceof u && ae(f) && f instanceof f) && "constructor" in e && "constructor" in t)
      return !1;
  }
  if (n === 0)
    return !1;
  n < 0 && (n = -1), r = r || [], i = i || [];
  for (var c = r.length; c--; )
    if (r[c] === e)
      return i[c] === t;
  if (r.push(e), i.push(t), a) {
    if (c = e.length, c !== t.length)
      return !1;
    for (; c--; )
      if (!rl(e[c], t[c], n - 1, r, i))
        return !1;
  } else {
    var l = Object.keys(e), h = l.length;
    if (Object.keys(t).length !== h)
      return !1;
    for (var d = 0; d < h; d++) {
      var _ = l[d];
      if (!(vt(t, _) && rl(e[_], t[_], n - 1, r, i)))
        return !1;
    }
  }
  return r.pop(), i.pop(), !0;
}
function X_(e) {
  return Je(e) ? e.slice() : cs(e) || ye(e) || Fn(e) || de(e) ? Array.from(e.entries()) : e;
}
var J_, CB = ((J_ = df().Iterator) == null ? void 0 : J_.prototype) || {};
function Ip(e) {
  return e[Symbol.iterator] = LB, Object.assign(Object.create(CB), e);
}
function LB() {
  return this;
}
function vO(e) {
  return (
    // Can be function
    e instanceof Object && typeof e.annotationType_ == "string" && ae(e.make_) && ae(e.extend_)
  );
}
["Symbol", "Map", "Set"].forEach(function(e) {
  var t = df();
  typeof t[e] > "u" && E("MobX requires global '" + e + "' to be available or polyfilled");
});
typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ == "object" && __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
  spy: YA,
  extras: {
    getDebugName: ao
  },
  $mobx: T
});
const L5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $mobx: T,
  FlowCancellationError: Af,
  ObservableMap: Pp,
  ObservableSet: Np,
  Reaction: bn,
  _allowStateChanges: wp,
  _allowStateChangesInsideComputed: B_,
  _allowStateReadsEnd: Ti,
  _allowStateReadsStart: wf,
  _autoAction: qi,
  _endAction: FA,
  _getAdministration: mn,
  _getGlobalState: EF,
  _interceptReads: QF,
  _isComputingDerivation: yF,
  _resetGlobalState: SF,
  _startAction: jA,
  action: Qn,
  autorun: Sp,
  comparer: Ur,
  computed: Yo,
  configure: GF,
  createAtom: bp,
  defineProperty: cB,
  entries: aB,
  extendObservable: Tp,
  flow: Gr,
  flowResult: ZF,
  get: fB,
  getAtom: nn,
  getDebugName: ao,
  getDependencyTree: nO,
  getObserverTree: HF,
  has: uO,
  intercept: eB,
  isAction: qr,
  isBoxedObservable: Ap,
  isComputed: rB,
  isComputedProp: iB,
  isFlow: Gi,
  isFlowCancellationError: XF,
  isObservable: Hr,
  isObservableArray: Je,
  isObservableMap: ye,
  isObservableObject: _e,
  isObservableProp: sB,
  isObservableSet: de,
  keys: oo,
  makeAutoObservable: wB,
  makeObservable: mB,
  observable: we,
  observe: lB,
  onBecomeObserved: eO,
  onBecomeUnobserved: xp,
  onReactionError: $F,
  override: Mj,
  ownKeys: fO,
  reaction: zF,
  remove: uB,
  runInAction: B_,
  set: aO,
  spy: YA,
  toJS: dB,
  trace: cO,
  transaction: fn,
  untracked: Op,
  values: oB,
  when: vB
}, Symbol.toStringTag, { value: "Module" }));
var L = /* @__PURE__ */ ((e) => (e[e.None = 0] = "None", e[e.Mutable = 1] = "Mutable", e[e.Watching = 2] = "Watching", e[e.RecursedCheck = 4] = "RecursedCheck", e[e.Recursed = 8] = "Recursed", e[e.Dirty = 16] = "Dirty", e[e.Pending = 32] = "Pending", e))(L || {});
function jB({
  update: e,
  notify: t,
  unwatched: n
}) {
  return {
    link: r,
    unlink: i,
    propagate: s,
    checkDirty: o,
    shallowPropagate: a
  };
  function r(f, c, l) {
    const h = c.depsTail;
    if (h !== void 0 && h.dep === f)
      return;
    const d = h !== void 0 ? h.nextDep : c.deps;
    if (d !== void 0 && d.dep === f) {
      d.version = l, c.depsTail = d;
      return;
    }
    const _ = f.subsTail;
    if (_ !== void 0 && _.version === l && _.sub === c)
      return;
    const v = c.depsTail = f.subsTail = {
      version: l,
      dep: f,
      sub: c,
      prevDep: h,
      nextDep: d,
      prevSub: _,
      nextSub: void 0
    };
    d !== void 0 && (d.prevDep = v), h !== void 0 ? h.nextDep = v : c.deps = v, _ !== void 0 ? _.nextSub = v : f.subs = v;
  }
  function i(f, c = f.sub) {
    const l = f.dep, h = f.prevDep, d = f.nextDep, _ = f.nextSub, v = f.prevSub;
    return d !== void 0 ? d.prevDep = h : c.depsTail = h, h !== void 0 ? h.nextDep = d : c.deps = d, _ !== void 0 ? _.prevSub = v : l.subsTail = v, v !== void 0 ? v.nextSub = _ : (l.subs = _) === void 0 && n(l), d;
  }
  function s(f) {
    let c = f.nextSub, l;
    e: do {
      const h = f.sub;
      let d = h.flags;
      if (d & 60 ? d & 12 ? d & 4 ? !(d & 48) && u(f, h) ? (h.flags = d | 40, d &= 1) : d = 0 : h.flags = d & -9 | 32 : d = 0 : h.flags = d | 32, d & 2 && t(h), d & 1) {
        const _ = h.subs;
        if (_ !== void 0) {
          const v = (f = _).nextSub;
          v !== void 0 && (l = { value: c, prev: l }, c = v);
          continue;
        }
      }
      if ((f = c) !== void 0) {
        c = f.nextSub;
        continue;
      }
      for (; l !== void 0; )
        if (f = l.value, l = l.prev, f !== void 0) {
          c = f.nextSub;
          continue e;
        }
      break;
    } while (!0);
  }
  function o(f, c) {
    let l, h = 0, d = !1;
    e: do {
      const _ = f.dep, v = _.flags;
      if (c.flags & 16)
        d = !0;
      else if ((v & 17) === 17) {
        if (e(_)) {
          const g = _.subs;
          g.nextSub !== void 0 && a(g), d = !0;
        }
      } else if ((v & 33) === 33) {
        (f.nextSub !== void 0 || f.prevSub !== void 0) && (l = { value: f, prev: l }), f = _.deps, c = _, ++h;
        continue;
      }
      if (!d) {
        const g = f.nextDep;
        if (g !== void 0) {
          f = g;
          continue;
        }
      }
      for (; h--; ) {
        const g = c.subs, y = g.nextSub !== void 0;
        if (y ? (f = l.value, l = l.prev) : f = g, d) {
          if (e(c)) {
            y && a(g), c = f.sub;
            continue;
          }
          d = !1;
        } else
          c.flags &= -33;
        c = f.sub;
        const b = f.nextDep;
        if (b !== void 0) {
          f = b;
          continue e;
        }
      }
      return d;
    } while (!0);
  }
  function a(f) {
    do {
      const c = f.sub, l = c.flags;
      (l & 48) === 32 && (c.flags = l | 16, (l & 6) === 2 && t(c));
    } while ((f = f.nextSub) !== void 0);
  }
  function u(f, c) {
    let l = c.depsTail;
    for (; l !== void 0; ) {
      if (l === f)
        return !0;
      l = l.prevDep;
    }
    return !1;
  }
}
let Of = 0, Zo = 0, ya = 0, au = 0, rn;
const $r = [], {
  link: Ef,
  unlink: Dp,
  propagate: gO,
  checkDirty: yO,
  shallowPropagate: Cp
} = jB({
  update(e) {
    return e.depsTail !== void 0 ? bO(e) : mO(e);
  },
  notify(e) {
    let t = au, n = t;
    do
      if (e.flags &= ~L.Watching, $r[t++] = e, e = e.subs?.sub, e === void 0 || !(e.flags & L.Watching))
        break;
    while (!0);
    for (au = t; n < --t; ) {
      const r = $r[n];
      $r[n++] = $r[t], $r[t] = r;
    }
  },
  unwatched(e) {
    e.flags & L.Mutable ? e.depsTail !== void 0 && (e.depsTail = void 0, e.flags = L.Mutable | L.Dirty, xf(e)) : Sf.call(e);
  }
});
function FB() {
  return rn;
}
function fi(e) {
  const t = rn;
  return rn = e, t;
}
function BB() {
  return Zo;
}
function zB() {
  ++Zo;
}
function UB() {
  --Zo || Lp();
}
function VB(e) {
  return e.name === "bound " + AO.name;
}
function WB(e) {
  return e.name === "bound " + wO.name;
}
function kB(e) {
  return e.name === "bound " + OO.name;
}
function qB(e) {
  return e.name === "bound " + Sf.name;
}
function GB(e) {
  return AO.bind({
    currentValue: e,
    pendingValue: e,
    subs: void 0,
    subsTail: void 0,
    flags: L.Mutable
  });
}
function HB(e) {
  return wO.bind({
    value: void 0,
    subs: void 0,
    subsTail: void 0,
    deps: void 0,
    depsTail: void 0,
    flags: L.None,
    getter: e
  });
}
function KB(e) {
  const t = {
    fn: e,
    subs: void 0,
    subsTail: void 0,
    deps: void 0,
    depsTail: void 0,
    flags: L.Watching | L.RecursedCheck
  }, n = fi(t);
  n !== void 0 && Ef(t, n, 0);
  try {
    t.fn();
  } finally {
    rn = n, t.flags &= ~L.RecursedCheck;
  }
  return OO.bind(t);
}
function YB(e) {
  const t = {
    deps: void 0,
    depsTail: void 0,
    subs: void 0,
    subsTail: void 0,
    flags: L.None
  }, n = fi(t);
  n !== void 0 && Ef(t, n, 0);
  try {
    e();
  } finally {
    rn = n;
  }
  return Sf.bind(t);
}
function XB(e) {
  const t = {
    deps: void 0,
    depsTail: void 0,
    flags: L.Watching
  }, n = fi(t);
  try {
    e();
  } finally {
    for (rn = n; t.deps !== void 0; ) {
      const r = t.deps, i = r.dep;
      Dp(r, t), i.subs !== void 0 && (gO(i.subs), Cp(i.subs));
    }
    Zo || Lp();
  }
}
function bO(e) {
  ++Of, e.depsTail = void 0, e.flags = L.Mutable | L.RecursedCheck;
  const t = fi(e);
  try {
    const n = e.value;
    return n !== (e.value = e.getter(n));
  } finally {
    rn = t, e.flags &= ~L.RecursedCheck, xf(e);
  }
}
function mO(e) {
  return e.flags = L.Mutable, e.currentValue !== (e.currentValue = e.pendingValue);
}
function JB(e) {
  const t = e.flags;
  if (t & L.Dirty || t & L.Pending && yO(e.deps, e)) {
    ++Of, e.depsTail = void 0, e.flags = L.Watching | L.RecursedCheck;
    const n = fi(e);
    try {
      e.fn();
    } finally {
      rn = n, e.flags &= ~L.RecursedCheck, xf(e);
    }
  } else
    e.flags = L.Watching;
}
function Lp() {
  for (; ya < au; ) {
    const e = $r[ya];
    $r[ya++] = void 0, JB(e);
  }
  ya = 0, au = 0;
}
function wO() {
  const e = this.flags;
  if (e & L.Dirty || e & L.Pending && (yO(this.deps, this) || (this.flags = e & ~L.Pending, !1))) {
    if (bO(this)) {
      const n = this.subs;
      n !== void 0 && Cp(n);
    }
  } else if (!e) {
    this.flags = L.Mutable | L.RecursedCheck;
    const n = fi(this);
    try {
      this.value = this.getter();
    } finally {
      rn = n, this.flags &= ~L.RecursedCheck;
    }
  }
  const t = rn;
  return t !== void 0 && Ef(this, t, Of), this.value;
}
function AO(...e) {
  if (e.length) {
    if (this.pendingValue !== (this.pendingValue = e[0])) {
      this.flags = L.Mutable | L.Dirty;
      const t = this.subs;
      t !== void 0 && (gO(t), Zo || Lp());
    }
  } else {
    if (this.flags & L.Dirty && mO(this)) {
      const n = this.subs;
      n !== void 0 && Cp(n);
    }
    let t = rn;
    for (; t !== void 0; ) {
      if (t.flags & (L.Mutable | L.Watching)) {
        Ef(this, t, Of);
        break;
      }
      t = t.subs?.sub;
    }
    return this.currentValue;
  }
}
function OO() {
  Sf.call(this);
}
function Sf() {
  this.depsTail = void 0, this.flags = L.None, xf(this);
  const e = this.subs;
  e !== void 0 && Dp(e);
}
function xf(e) {
  const t = e.depsTail;
  let n = t !== void 0 ? t.nextDep : e.deps;
  for (; n !== void 0; )
    n = Dp(n, e);
}
const j5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  computed: HB,
  effect: KB,
  effectScope: YB,
  endBatch: UB,
  getActiveSub: FB,
  getBatchDepth: BB,
  isComputed: WB,
  isEffect: kB,
  isEffectScope: qB,
  isSignal: VB,
  setActiveSub: fi,
  signal: GB,
  startBatch: zB,
  trigger: XB
}, Symbol.toStringTag, { value: "Module" }));
function EO(e, t) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function Rn(e, t, n) {
  return e.context ? e.callback(n, ...t) : e.callback(...t);
}
class ZB {
  interceptions;
  interceptionKeySet;
  constructor() {
    this.interceptions = [], this.interceptionKeySet = /* @__PURE__ */ new Set();
  }
  isUsed() {
    return this.interceptions.length > 0;
  }
  intercept(t) {
    this.interceptions.push(t), Object.keys(t).forEach((n) => {
      this.interceptionKeySet.add(n);
    });
  }
  tap(t) {
    this.interceptionKeySet.has("tap") && this.interceptions.forEach((n) => {
      n.tap?.(t);
    });
  }
  call(t, ...n) {
    this.interceptionKeySet.has("call") && this.interceptions.forEach((r) => {
      r.context ? r.call?.(t, ...n) : r.call?.(...n);
    });
  }
  loop(...t) {
    this.interceptionKeySet.has("loop") && this.interceptions.forEach((n) => {
      n.loop?.(...t);
    });
  }
  error(t) {
    if (this.interceptionKeySet.has("error") && t instanceof Error) {
      const n = t;
      this.interceptions.forEach((r) => {
        r.error?.(n);
      });
    }
  }
  result(t) {
    this.interceptionKeySet.has("result") && this.interceptions.forEach((n) => {
      n.result?.(t);
    });
  }
  done() {
    this.interceptionKeySet.has("done") && this.interceptions.forEach((t) => {
      t.done?.();
    });
  }
}
class Pn {
  taps;
  interceptions;
  constructor() {
    this.taps = [], this.interceptions = new ZB();
  }
  tap(t, n) {
    const r = typeof t == "string" ? {
      name: t,
      context: !1
    } : {
      context: !1,
      ...t
    }, s = {
      key: Symbol(r.name),
      ...r,
      callback: n
    };
    if (s.before) {
      let o = this.taps.length;
      const a = new Set(
        Array.isArray(s.before) ? s.before : [s.before]
      );
      for (o; o > 0 && a.size > 0; o--) {
        const u = this.taps[o - 1];
        if (a.has(u.name) && a.delete(u.name), u.before && EO(s.name, u.before))
          break;
      }
      this.taps.splice(o, 0, s);
    } else
      this.taps.push(s);
    return this.interceptions.tap(s), s;
  }
  untap(t) {
    this.taps = this.taps.filter((n) => n.key !== t.key);
  }
  isUsed() {
    return this.taps.length > 0 || this.interceptions.isUsed();
  }
  intercept(t) {
    this.interceptions.intercept(t);
  }
}
class QB extends Pn {
  call(...t) {
    if (!this.isUsed())
      return;
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      this.taps.forEach((r) => {
        Rn(r, t, n);
      });
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
    this.interceptions.done();
  }
}
class ez extends Pn {
  call(...t) {
    if (!this.isUsed())
      return;
    const n = {};
    this.interceptions.call(n, ...t);
    for (let r = 0; r < this.taps.length; r += 1) {
      const i = Rn(this.taps[r], t, n);
      if (i !== void 0)
        return this.interceptions.result(i), i;
    }
    this.interceptions.done();
  }
}
class tz extends Pn {
  call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    let [r, ...i] = t;
    for (let s = 0; s < this.taps.length; s += 1) {
      const o = Rn(this.taps[s], [r, ...i], n);
      o !== void 0 && (r = o);
    }
    return this.interceptions.result(r), r;
  }
}
class nz extends Pn {
  call(...t) {
    let n = !1;
    const r = {};
    this.interceptions.call(r, ...t);
    try {
      for (; n !== !0; ) {
        n = !0, this.interceptions.loop(...t);
        for (let i = 0; i < this.taps.length; i += 1)
          if (Rn(this.taps[i], t, r) !== void 0) {
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
class rz extends Pn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t), await Promise.allSettled(this.taps.map((r) => Rn(r, t, n))), this.interceptions.done();
  }
}
class iz extends Pn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      const r = await Promise.race(
        this.taps.map((i) => Rn(i, t, n))
      );
      return this.interceptions.result(r), r;
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
  }
}
class sz extends Pn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      for (let r = 0; r < this.taps.length; r += 1)
        await Rn(this.taps[r], t, n);
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
    this.interceptions.done();
  }
}
class oz extends Pn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      for (let r = 0; r < this.taps.length; r += 1) {
        const i = await Rn(this.taps[r], t, n);
        if (i !== void 0)
          return this.interceptions.result(i), i;
      }
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
    this.interceptions.done();
  }
}
class az extends Pn {
  async call(...t) {
    let [n, ...r] = t;
    const i = {};
    this.interceptions.call(i, ...t);
    try {
      for (let s = 0; s < this.taps.length; s += 1) {
        const o = await Rn(
          this.taps[s],
          [n, ...r],
          i
        );
        o !== void 0 && (n = o);
      }
    } catch (s) {
      throw this.interceptions.error(s), s;
    }
    return this.interceptions.result(n), n;
  }
}
class uz extends Pn {
  async call(...t) {
    let n = !1;
    const r = {};
    this.interceptions.call(r, ...t);
    try {
      for (; n !== !0; ) {
        n = !0, this.interceptions.loop(...t);
        for (let i = 0; i < this.taps.length; i += 1)
          if (await Rn(this.taps[i], t, r) !== void 0) {
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
const F5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AsyncParallelBailHook: iz,
  AsyncParallelHook: rz,
  AsyncSeriesBailHook: oz,
  AsyncSeriesHook: sz,
  AsyncSeriesLoopHook: uz,
  AsyncSeriesWaterfallHook: az,
  SyncBailHook: ez,
  SyncHook: QB,
  SyncLoopHook: nz,
  SyncWaterfallHook: tz,
  equalToOrIn: EO
}, Symbol.toStringTag, { value: "Module" }));
function il(e, t) {
  if (e === t) return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    if (e.constructor !== t.constructor) return !1;
    var n, r, i;
    if (Array.isArray(e)) {
      if (n = e.length, n != t.length) return !1;
      for (r = n; r-- !== 0; )
        if (!il(e[r], t[r])) return !1;
      return !0;
    }
    if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
    if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf();
    if (e.toString !== Object.prototype.toString) return e.toString() === t.toString();
    if (i = Object.keys(e), n = i.length, n !== Object.keys(t).length) return !1;
    for (r = n; r-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(t, i[r])) return !1;
    for (r = n; r-- !== 0; ) {
      var s = i[r];
      if (!il(e[s], t[s])) return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
class fz {
  name;
  fields;
  parent;
  context;
  options;
  current;
  dirty;
  constructor(t, n) {
    this.context = t, this.options = n, this.current = this.default(), this.dirty = !0, n.overrideMethods && Object.assign(this, n.overrideMethods), this.options.init?.call(this);
  }
  equal(t, n) {
    return il(t, n);
  }
  default() {
    return typeof this.options.default == "function" ? this.options.default(this.context) : this.options.default;
  }
  reset() {
    this.set(this.default());
  }
  shouldUpdate(t) {
    return !(!this.dirty && this.equal(this.current, t));
  }
  set(t) {
    return this.shouldUpdate(t) ? (this.options.set?.call(this, t, this.context), this.current = this.options.map, this.dirty = !1, !0) : !1;
  }
  get() {
    return this.current;
  }
  dispose() {
    this.options.dispose?.call(this);
  }
}
class SO {
  static create(t, n) {
    return new SO(t, n);
  }
  context;
  options = /* @__PURE__ */ new Map();
  optionClass = /* @__PURE__ */ new Map();
  constructor(t, n) {
    return this.context = t, n && this.initOptions(n), new Proxy(this, {
      get(r, i) {
        return r.options.has(i) ? r.getOption(i) : Reflect.get(r, i);
      }
    });
  }
  register(t, n) {
    this.optionClass.set(t, n);
  }
  defineGetter(t) {
    Object.defineProperty(this, t, {
      get: () => this.getOption(t),
      enumerable: !0
    });
  }
  initOptions(t) {
    for (let n in t)
      if (this.optionClass.has(n)) {
        const r = this.optionClass.get(n), i = new r(this.context, t[n]);
        this.addOptionFromInstance(n, i);
      } else
        this.addOptionFromConfig(n, t[n]);
  }
  getOption(t) {
    return this.options.get(t);
  }
  removeOption(t) {
    this.options.has(t) && (this.options.get(t).dispose(), this.options.delete(t));
  }
  addOptionFromInstance(t, n) {
    this.options.has(t) || (n.parent = this, n.name = t, this.options.set(t, n));
  }
  addOptionFromConfig(t, n) {
    this.addOptionFromInstance(t, new fz(this.context, n));
  }
}
function B5(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce(
    (t, n) => (...r) => t(n(...r))
  );
}
function cz(e) {
  return lz(e) && !hz(e);
}
function lz(e) {
  return !!e && typeof e == "object";
}
function hz(e) {
  var t = Object.prototype.toString.call(e);
  return t === "[object RegExp]" || t === "[object Date]" || _z(e);
}
var pz = typeof Symbol == "function" && Symbol.for, dz = pz ? Symbol.for("react.element") : 60103;
function _z(e) {
  return e.$$typeof === dz;
}
var vz = cz;
function gz(e) {
  return Array.isArray(e) ? [] : {};
}
function uo(e, t) {
  return t.clone !== !1 && t.isMergeableObject(e) ? fo(gz(e), e, t) : e;
}
function yz(e, t, n) {
  return e.concat(t).map(function(r) {
    return uo(r, n);
  });
}
function bz(e, t) {
  if (!t.customMerge)
    return fo;
  var n = t.customMerge(e);
  return typeof n == "function" ? n : fo;
}
function mz(e) {
  return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(e).filter(function(t) {
    return Object.propertyIsEnumerable.call(e, t);
  }) : [];
}
function Z_(e) {
  return Object.keys(e).concat(mz(e));
}
function xO(e, t) {
  try {
    return t in e;
  } catch {
    return !1;
  }
}
function wz(e, t) {
  return xO(e, t) && !(Object.hasOwnProperty.call(e, t) && Object.propertyIsEnumerable.call(e, t));
}
function Az(e, t, n) {
  var r = {};
  return n.isMergeableObject(e) && Z_(e).forEach(function(i) {
    r[i] = uo(e[i], n);
  }), Z_(t).forEach(function(i) {
    wz(e, i) || (xO(e, i) && n.isMergeableObject(t[i]) ? r[i] = bz(i, n)(e[i], t[i], n) : r[i] = uo(t[i], n));
  }), r;
}
function fo(e, t, n) {
  n = n || {}, n.arrayMerge = n.arrayMerge || yz, n.isMergeableObject = n.isMergeableObject || vz, n.cloneUnlessOtherwiseSpecified = uo;
  var r = Array.isArray(t), i = Array.isArray(e), s = r === i;
  return s ? r ? n.arrayMerge?.(e, t, n) : Az(e, t, n) : uo(t, n);
}
function Oz(e, t) {
  if (!Array.isArray(e))
    throw new Error("first argument should be an array");
  return e.reduce(function(n, r) {
    return fo(n, r, t);
  }, {});
}
fo.all = Oz;
function pi(e, t = 0, n = 1) {
  return Math.min(Math.max(e, t), n);
}
function Ez(e, t, n) {
  e /= 255, t /= 255, n /= 255;
  const r = Math.max(e, t, n), i = Math.min(e, t, n);
  let s = 0, o, a = (r + i) / 2;
  if (r == i)
    s = o = 0;
  else {
    const u = r - i;
    switch (o = a > 0.5 ? u / (2 - r - i) : u / (r + i), r) {
      case e:
        s = (t - n) / u + (t < n ? 6 : 0);
        break;
      case t:
        s = (n - e) / u + 2;
        break;
      case n:
        s = (e - t) / u + 4;
        break;
    }
    s /= 6;
  }
  return { h: s, s: o, l: a };
}
function Q_(e, t, n) {
  let r, i, s;
  if (t == 0)
    r = i = s = n;
  else {
    const o = (f, c, l) => (l < 0 && (l += 1), l > 1 && (l -= 1), l < 0.16666666666666666 ? f + (c - f) * 6 * l : l < 0.5 ? c : l < 0.6666666666666666 ? f + (c - f) * (0.6666666666666666 - l) * 6 : f), a = n < 0.5 ? n * (1 + t) : n + t - n * t, u = 2 * n - a;
    r = o(u, a, e + 1 / 3), i = o(u, a, e), s = o(u, a, e - 1 / 3);
  }
  return { r: r * 255, g: i * 255, b: s * 255 };
}
function z5(e, t, n) {
  e /= 255, t /= 255, n /= 255;
  const r = Math.max(e, t, n), i = Math.min(e, t, n);
  let s = 0, o, a = r;
  const u = r - i;
  if (o = r == 0 ? 0 : u / r, r == i)
    s = 0;
  else {
    switch (r) {
      case e:
        s = (t - n) / u + (t < n ? 6 : 0);
        break;
      case t:
        s = (n - e) / u + 2;
        break;
      case n:
        s = (e - t) / u + 4;
        break;
    }
    s /= 6;
  }
  return { h: s, s: o, v: a };
}
function Sz(e, t, n) {
  let r = 0, i = 0, s = 0;
  const o = Math.floor(e * 6), a = e * 6 - o, u = n * (1 - t), f = n * (1 - a * t), c = n * (1 - (1 - a) * t);
  switch (o % 6) {
    case 0:
      r = n, i = c, s = u;
      break;
    case 1:
      r = f, i = n, s = u;
      break;
    case 2:
      r = u, i = n, s = c;
      break;
    case 3:
      r = u, i = f, s = n;
      break;
    case 4:
      r = c, i = u, s = n;
      break;
    case 5:
      r = n, i = u, s = f;
      break;
  }
  return { r: r * 255, g: i * 255, b: s * 255 };
}
function U5(e, t, n) {
  const r = n + t * Math.min(n, 1 - n), i = r === 0 ? 0 : 2 * (1 - n / r);
  return { h: e, s: i, v: r };
}
function V5(e, t, n) {
  const r = (2 - t) * n / 2, i = t === 0 ? t : r <= 1 ? t * n / (2 - t * n) : t * n / (2 - t);
  return { h: e, s: i, l: r };
}
function xz(e) {
  typeof e == "string" && (e = e.replace("#", ""), e = e.length === 3 ? e.replace(/(\w)/g, "$1$1") : e, e = parseInt("0x" + e, 16));
  const t = e, n = t >> 16 & 255, r = t >> 8 & 255, i = t & 255;
  return { r: n, g: r, b: i };
}
function Tz(e, t, n) {
  const r = e.r + (t.r - e.r) * n, i = e.g + (t.g - e.g) * n, s = e.b + (t.b - e.b) * n;
  return { r, g: i, b: s };
}
const ev = {
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
class ut {
  static Transparent = ut.fromRGBA(0, 0, 0, 0);
  static BLACK = ut.fromRGB(0, 0, 0);
  static WHITE = ut.fromRGB(255, 255, 255);
  static isColor(t) {
    return typeof t == "string" || typeof t == "number" || t instanceof ut;
  }
  static parse(t) {
    const n = typeof t == "string";
    if (n && t.toLowerCase().startsWith("rgb")) {
      const r = t.match(/rgba?\s*\(([^)]+)\)\s*/i);
      if (r) {
        const i = r[1].split(",").map(parseInt), s = this.fromRGB(i[0], i[1], i[2]);
        return i.length === 4 && (s.alpha = i[3]), s;
      }
    } else if (n && t.startsWith("#") || typeof t == "number")
      return this.fromRGB(xz(t));
    if (n && ev[t]) {
      const r = ev[t];
      return this.fromRGB(r[0] * 255 >> 0, r[1] * 255 >> 0, r[2] * 255 >> 0);
    } else if (typeof t == "object" && t !== null)
      return this.fromRGB(t);
    return this.fromRGB(0, 0, 0);
  }
  static fromRGB(t, n, r) {
    return t !== null && typeof t == "object" ? new ut(t.r, t.g, t.b) : new ut(t, n, r);
  }
  static fromRGBA(t, n, r, i) {
    return t !== null && typeof t == "object" ? new ut(t.r, t.g, t.b, n) : new ut(t, n, r, i);
  }
  static fromHSL(t, n, r) {
    const { r: i, g: s, b: o } = Q_(t, n, r);
    return new ut(i, s, o);
  }
  static fromHSV(t, n, r) {
    const { r: i, g: s, b: o } = Sz(t, n, r);
    return new ut(i, s, o);
  }
  _r = 0;
  _g = 0;
  _b = 0;
  _a = 1;
  // 构造函数，支持RGB、HSL和HSV初始化
  constructor(t = 0, n = 0, r = 0, i = 1) {
    this._r = t, this._g = n, this._b = r, this._a = i;
  }
  copy(t) {
    return this._r = t.r, this._g = t.g, this._b = t.b, this.alpha = t.alpha, this;
  }
  clone() {
    return ut.fromRGB(0, 0, 0).copy(this);
  }
  setRGB(t, n, r) {
    return this._r = t, this._g = n, this._b = r, this;
  }
  normalize() {
    return this.r = pi(this._r / 255, 0, 1), this.g = pi(this._g / 255, 0, 1), this.b = pi(this._b / 255, 0, 1), this;
  }
  set r(t) {
    this._r = t;
  }
  get r() {
    return this._r;
  }
  set g(t) {
    this._g = t;
  }
  get g() {
    return this._g;
  }
  set b(t) {
    this._b = t;
  }
  get b() {
    return this._b;
  }
  get a() {
    return this.alpha;
  }
  set a(t) {
    this.alpha = t;
  }
  set alpha(t) {
    this._a = Math.max(0, Math.min(1, t));
  }
  get alpha() {
    return this._a;
  }
  equals(t) {
    return this.r !== t.r || this.g !== t.g || this.b !== t.b || this.alpha !== t.alpha;
  }
  setOpacity(t) {
    return this.alpha = t, this;
  }
  // 颜色混合
  mix(t, n, r = 0.5) {
    const { r: i, g: s, b: o } = Tz(t, n, r);
    return new ut(i, s, o);
  }
  setRBG(t, n, r) {
    return this.r = t, this.g = n, this.b = r, this;
  }
  setRGBColor(t) {
    return this.r = t.r, this.g = t.g, this.b = t.b, this;
  }
  // 变亮
  brighten(t) {
    const { h: n, s: r, l: i } = Ez(this.r, this.g, this.b);
    return this.setRGBColor(Q_(n, r, i * (1 + t)));
  }
  multiplyScalar(t) {
    return this.r *= t, this.g *= t, this.b *= t, this;
  }
  multiply(t) {
    return this.r *= t.r, this.g *= t.g, this.b *= t.b, this;
  }
  add(t) {
    return this.r += t.r, this.g += t.g, this.b += t.b, this;
  }
  round() {
    return this.r = Math.round(this.r), this.g = Math.round(this.g), this.b = Math.round(this.b), this;
  }
  floor() {
    return this.r = Math.floor(this.r), this.g = Math.floor(this.g), this.b = Math.floor(this.b), this;
  }
  clamp(t = 0, n = 1) {
    return this.r = pi(this.r, t, n), this.g = pi(this.g, t, n), this.b = pi(this.b, t, n), this;
  }
  toCssRGB() {
    return `rgb(${Math.round(this.r)},${Math.round(this.g)},${Math.round(this.b)})`;
  }
}
const Tf = 3, Rz = {
  grad: 360 / 400,
  turn: 360,
  rad: 360 / (Math.PI * 2)
}, Un = (e) => typeof e == "string" ? e.length > 0 : typeof e == "number", Oe = (e, t = 0, n = Math.pow(10, t)) => Math.round(n * e) / n + 0, It = (e, t = 0, n = 1) => e > n ? n : e > t ? e : t, TO = (e) => (e = isFinite(e) ? e % 360 : 0, e > 0 ? e : e + 360), Pz = (e, t = "deg") => Number(e) * (Rz[t] || 1), RO = (e) => ({
  r: It(e.r, 0, 255),
  g: It(e.g, 0, 255),
  b: It(e.b, 0, 255),
  a: It(e.a)
}), jp = (e) => ({
  r: Oe(e.r),
  g: Oe(e.g),
  b: Oe(e.b),
  a: Oe(e.a, Tf)
}), Nz = ({ r: e, g: t, b: n, a: r = 1 }) => !Un(e) || !Un(t) || !Un(n) ? null : RO({
  r: Number(e),
  g: Number(t),
  b: Number(n),
  a: Number(r)
}), $z = /^#([0-9a-f]{3,8})$/i, Mz = (e) => {
  const t = $z.exec(e);
  return t ? (e = t[1], e.length <= 4 ? {
    r: parseInt(e[0] + e[0], 16),
    g: parseInt(e[1] + e[1], 16),
    b: parseInt(e[2] + e[2], 16),
    a: e.length === 4 ? Oe(parseInt(e[3] + e[3], 16) / 255, 2) : 1
  } : e.length === 6 || e.length === 8 ? {
    r: parseInt(e.substr(0, 2), 16),
    g: parseInt(e.substr(2, 2), 16),
    b: parseInt(e.substr(4, 2), 16),
    a: e.length === 8 ? Oe(parseInt(e.substr(6, 2), 16) / 255, 2) : 1
  } : null) : null;
}, ba = (e) => {
  const t = e.toString(16);
  return t.length < 2 ? "0" + t : t;
}, Iz = (e) => {
  const { r: t, g: n, b: r, a: i } = jp(e), s = i < 1 ? ba(Oe(i * 255)) : "";
  return "#" + ba(t) + ba(n) + ba(r) + s;
}, Dz = (e) => ({
  h: TO(e.h),
  s: It(e.s, 0, 100),
  v: It(e.v, 0, 100),
  a: It(e.a)
}), Cz = (e) => ({
  h: Oe(e.h),
  s: Oe(e.s),
  v: Oe(e.v),
  a: Oe(e.a, Tf)
}), Lz = ({ h: e, s: t, v: n, a: r = 1 }) => {
  if (!Un(e) || !Un(t) || !Un(n)) return null;
  const i = Dz({
    h: Number(e),
    s: Number(t),
    v: Number(n),
    a: Number(r)
  });
  return NO(i);
}, PO = ({ r: e, g: t, b: n, a: r }) => {
  const i = Math.max(e, t, n), s = i - Math.min(e, t, n), o = s ? i === e ? (t - n) / s : i === t ? 2 + (n - e) / s : 4 + (e - t) / s : 0;
  return {
    h: 60 * (o < 0 ? o + 6 : o),
    s: i ? s / i * 100 : 0,
    v: i / 255 * 100,
    a: r
  };
}, NO = ({ h: e, s: t, v: n, a: r }) => {
  e = e / 360 * 6, t = t / 100, n = n / 100;
  const i = Math.floor(e), s = n * (1 - t), o = n * (1 - (e - i) * t), a = n * (1 - (1 - e + i) * t), u = i % 6;
  return {
    r: [n, o, s, s, a, n][u] * 255,
    g: [a, n, n, o, s, s][u] * 255,
    b: [s, s, a, n, n, o][u] * 255,
    a: r
  };
}, $O = (e) => ({
  h: TO(e.h),
  s: It(e.s, 0, 100),
  l: It(e.l, 0, 100),
  a: It(e.a)
}), MO = (e) => ({
  h: Oe(e.h),
  s: Oe(e.s),
  l: Oe(e.l),
  a: Oe(e.a, Tf)
}), jz = ({ h: e, s: t, l: n, a: r = 1 }) => {
  if (!Un(e) || !Un(t) || !Un(n)) return null;
  const i = $O({
    h: Number(e),
    s: Number(t),
    l: Number(n),
    a: Number(r)
  });
  return IO(i);
}, Fz = ({ h: e, s: t, l: n, a: r }) => (t *= (n < 50 ? n : 100 - n) / 100, {
  h: e,
  s: t > 0 ? 2 * t / (n + t) * 100 : 0,
  v: n + t,
  a: r
}), Bz = ({ h: e, s: t, v: n, a: r }) => {
  const i = (200 - t) * n / 100;
  return {
    h: e,
    s: i > 0 && i < 200 ? t * n / 100 / (i <= 100 ? i : 200 - i) * 100 : 0,
    l: i / 2,
    a: r
  };
}, IO = (e) => NO(Fz(e)), co = (e) => Bz(PO(e)), zz = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Uz = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Vz = (e) => {
  const t = zz.exec(e) || Uz.exec(e);
  if (!t) return null;
  const n = $O({
    h: Pz(t[1], t[2]),
    s: Number(t[3]),
    l: Number(t[4]),
    a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1)
  });
  return IO(n);
}, Wz = (e) => {
  const { h: t, s: n, l: r, a: i } = MO(co(e));
  return i < 1 ? `hsla(${t}, ${n}%, ${r}%, ${i})` : `hsl(${t}, ${n}%, ${r}%)`;
}, kz = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, qz = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Gz = (e) => {
  const t = kz.exec(e) || qz.exec(e);
  return !t || t[2] !== t[4] || t[4] !== t[6] ? null : RO({
    r: Number(t[1]) / (t[2] ? 100 / 255 : 1),
    g: Number(t[3]) / (t[4] ? 100 / 255 : 1),
    b: Number(t[5]) / (t[6] ? 100 / 255 : 1),
    a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1)
  });
}, Hz = (e) => {
  const { r: t, g: n, b: r, a: i } = jp(e);
  return i < 1 ? `rgba(${t}, ${n}, ${r}, ${i})` : `rgb(${t}, ${n}, ${r})`;
}, sl = {
  string: [
    [Mz, "hex"],
    [Gz, "rgb"],
    [Vz, "hsl"]
  ],
  object: [
    [Nz, "rgb"],
    [jz, "hsl"],
    [Lz, "hsv"]
  ]
}, tv = (e, t) => {
  for (let n = 0; n < t.length; n++) {
    const r = t[n][0](e);
    if (r) return [r, t[n][1]];
  }
  return [null, void 0];
}, DO = (e) => typeof e == "string" ? tv(e.trim(), sl.string) : typeof e == "object" && e !== null ? tv(e, sl.object) : [null, void 0], Kz = (e) => DO(e)[1], Yz = (e, t) => ({
  r: e.r,
  g: e.g,
  b: e.b,
  a: t
}), rc = (e, t) => {
  const n = co(e);
  return {
    h: n.h,
    s: It(n.s + t * 100, 0, 100),
    l: n.l,
    a: n.a
  };
}, ic = (e) => (e.r * 299 + e.g * 587 + e.b * 114) / 1e3 / 255, nv = (e, t) => {
  const n = co(e);
  return {
    h: n.h,
    s: n.s,
    l: It(n.l + t * 100, 0, 100),
    a: n.a
  };
}, Xz = (e) => ({
  r: 255 - e.r,
  g: 255 - e.g,
  b: 255 - e.b,
  a: e.a
});
class uu {
  parsed;
  rgba;
  constructor(t) {
    this.parsed = DO(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  /**
   * Returns a boolean indicating whether or not an input has been parsed successfully.
   * Note: If parsing is unsuccessful, Colord defaults to black (does not throws an error).
   */
  isValid() {
    return this.parsed !== null;
  }
  /**
   * Returns the brightness of a color (from 0 to 1).
   * The calculation logic is modified from WCAG.
   * https://www.w3.org/TR/AERT/#color-contrast
   */
  brightness() {
    return Oe(ic(this.rgba), 2);
  }
  /**
   * Same as calling `brightness() < 0.5`.
   */
  isDark() {
    return ic(this.rgba) < 0.5;
  }
  /**
   * Same as calling `brightness() >= 0.5`.
   * */
  isLight() {
    return ic(this.rgba) >= 0.5;
  }
  /**
   * Returns the hexadecimal representation of a color.
   * When the alpha channel value of the color is less than 1,
   * it outputs #rrggbbaa format instead of #rrggbb.
   */
  toHex() {
    return Iz(this.rgba);
  }
  /**
   * Converts a color to RGB color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toRgb() {
    return jp(this.rgba);
  }
  /**
   * Converts a color to RGB color space and returns a string representation.
   * Outputs an alpha value only if it is less than 1.
   */
  toRgbString() {
    return Hz(this.rgba);
  }
  /**
   * Converts a color to HSL color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toHsl() {
    return MO(co(this.rgba));
  }
  /**
   * Converts a color to HSL color space and returns a string representation.
   * Always includes an alpha value from 0 to 1.
   */
  toHslString() {
    return Wz(this.rgba);
  }
  /**
   * Converts a color to HSV color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toHsv() {
    return Cz(PO(this.rgba));
  }
  /**
   * Creates a new instance containing an inverted (opposite) version of the color.
   */
  invert() {
    return an(Xz(this.rgba));
  }
  /**
   * Increases the HSL saturation of a color by the given amount.
   */
  saturate(t = 0.1) {
    return an(rc(this.rgba, t));
  }
  /**
   * Decreases the HSL saturation of a color by the given amount.
   */
  desaturate(t = 0.1) {
    return an(rc(this.rgba, -t));
  }
  /**
   * Makes a gray color with the same lightness as a source color.
   */
  grayscale() {
    return an(rc(this.rgba, -1));
  }
  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  lighten(t = 0.1) {
    return an(nv(this.rgba, t));
  }
  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  darken(t = 0.1) {
    return an(nv(this.rgba, -t));
  }
  /**
   * Changes the HSL hue of a color by the given amount.
   */
  rotate(t = 15) {
    return this.hue(this.hue() + t);
  }
  alpha(t) {
    return typeof t == "number" ? an(Yz(this.rgba, t)) : Oe(this.rgba.a, Tf);
  }
  hue(t) {
    const n = co(this.rgba);
    return typeof t == "number" ? an({ h: t, s: n.s, l: n.l, a: n.a }) : Oe(n.h);
  }
  /**
   * Determines whether two values are the same color.
   */
  isEqual(t) {
    return this.toHex() === an(t).toHex();
  }
}
const an = (e) => e instanceof uu ? e : new uu(e), rv = [], Jz = (e) => {
  e.forEach((t) => {
    rv.indexOf(t) < 0 && (t(uu, sl), rv.push(t));
  });
}, Zz = () => new uu({
  r: Math.random() * 255,
  g: Math.random() * 255,
  b: Math.random() * 255
}), W5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  colord: an,
  extend: Jz,
  getFormat: Kz,
  random: Zz
}, Symbol.toStringTag, { value: "Module" }));
var Qz = /* @__PURE__ */ ((e) => (e.create = "create", e.add = "add", e.modify = "modify", e.event = "event", e))(Qz || {});
class k5 {
  constructor(t, n) {
    this.config = n, this.context = t, this.config && this.initPresetsAndPlugins(this.config);
  }
  hooks = /* @__PURE__ */ new Map();
  methods = /* @__PURE__ */ new Map();
  plugins = /* @__PURE__ */ new Map();
  extraPresets = [];
  extraPlugins = [];
  context;
  initPresetsAndPlugins(t) {
    this.extraPlugins = [], this.extraPresets = [], this.resolvePresets(t.presets ?? []), this.resolvePlugins(t.plugins ?? []);
  }
  resolvePresets(t) {
    Array.isArray(t) && t.forEach((r) => {
      this.initPreset(r);
    });
    const n = this.extraPresets;
    for (; n.length; )
      this.initPreset(n.shift());
  }
  resolvePlugins(t) {
    Array.isArray(t) && t.forEach((r) => {
      this.initPlugin(r);
    });
    const n = this.extraPlugins;
    for (; n.length; )
      this.initPlugin(n.shift());
  }
  getApplyMethods(t) {
    const n = this.methods.get(t) ?? [];
    return (...r) => n.length === 1 ? n[0](...r) : n.reduceRight((i, s) => (...o) => s(i(...o)))(...r);
  }
  applyMethods(t, ...n) {
    const r = this.methods.get(t) ?? [];
    return r.length === 1 ? r[0](...n) : r.reduceRight((i, s) => (...o) => s(i(...o)))(...n);
  }
  getPluginContext(t) {
    const n = {
      pluginName: t.name,
      ctx: this.context,
      registerMethod: this.registerMethod.bind(this),
      register: this.register.bind(this)
    };
    return new Proxy(n, {
      get: (r, i, s) => this.methods.has(i) ? this.getApplyMethods(i) : Reflect.get(r, i, s)
    });
  }
  initPreset(t) {
    this.registerPlugin(t);
    const n = this.getPluginContext(t), { plugins: r, presets: i } = t.apply(n, t.config);
    i && this.extraPresets.push(...i), r && this.extraPlugins.push(...r);
  }
  initPlugin(t) {
    this.registerPlugin(t);
    const n = this.getPluginContext(t);
    t.apply(n, t.config);
  }
  registerPlugin(t) {
    if (this.plugins.has(t.name))
      throw `${t.name}:已存在`;
    this.plugins.set(t.name, t);
  }
  register(t) {
    const n = this.hooks.get(t.name) ?? [];
    n.push(t), this.hooks.set(t.name, n);
  }
  registerMethod(t, n) {
    const r = this.methods.get(t) ?? [];
    r.push(n || ((i) => {
      this.register({ name: t, fn: i });
    })), this.methods.set(t, r);
  }
  async applyPlugins(t) {
    const n = typeof t == "string" ? { name: t, type: void 0 } : t;
    let { name: r, type: i } = n;
    i || (r.startsWith("modify") && (i = "modify"), r.startsWith("add") && (i = "add"), r.startsWith("on") && (i = "event"), r.startsWith("create") && (i = "create"));
    const s = (this.hooks.get(r) ?? []).slice();
    switch (s.sort((o, a) => {
      let u = o.order ?? 0, f = a.order ?? 0;
      return u - f;
    }), i) {
      case "create": {
        let o = n.initalValue;
        for (let a of s) {
          let u = await Promise.resolve().then(() => a.fn(n.args));
          if (u != null)
            return u;
        }
        return o;
      }
      case "add": {
        let o = n.initalValue ?? [];
        for (let a of s) {
          let u = await Promise.resolve().then(() => a.fn(n.args));
          u != null && o.push(u);
        }
        return o;
      }
      case "modify": {
        let o = n.initalValue ?? {};
        for (let a of s) {
          let u = await Promise.resolve().then(() => a.fn(o, n.args));
          u != null && (o = u);
        }
        return o;
      }
      case "event": {
        if (n.sync)
          for (let o of s)
            o.fn(n.args);
        else {
          let o = Promise.resolve();
          for (let a of s)
            o = o.then(() => {
              a.fn(n.args);
            });
        }
        break;
      }
    }
  }
  uninstallPlugin(t) {
    if (this.plugins.has(t.name)) {
      const n = this.getPluginContext(t);
      t.dispose?.(n), this.plugins.delete(t.name);
    }
  }
  dispose() {
    this.plugins.forEach((t) => {
      t?.dispose?.(this.getPluginContext(t));
    }), this.extraPlugins = [], this.extraPresets = [], this.plugins.clear(), this.hooks.clear(), this.methods.clear();
  }
}
var pt = -1, Ue = 1, pe = 0;
function lo(e, t, n, r, i) {
  if (e === t)
    return e ? [[pe, e]] : [];
  if (n != null) {
    var s = u5(e, t, n);
    if (s)
      return s;
  }
  var o = Fp(e, t), a = e.substring(0, o);
  e = e.substring(o), t = t.substring(o), o = Rf(e, t);
  var u = e.substring(e.length - o);
  e = e.substring(0, e.length - o), t = t.substring(0, t.length - o);
  var f = e5(e, t);
  return a && f.unshift([pe, a]), u && f.push([pe, u]), Bp(f, i), r && r5(f), f;
}
function e5(e, t) {
  var n;
  if (!e)
    return [[Ue, t]];
  if (!t)
    return [[pt, e]];
  var r = e.length > t.length ? e : t, i = e.length > t.length ? t : e, s = r.indexOf(i);
  if (s !== -1)
    return n = [
      [Ue, r.substring(0, s)],
      [pe, i],
      [Ue, r.substring(s + i.length)]
    ], e.length > t.length && (n[0][0] = n[2][0] = pt), n;
  if (i.length === 1)
    return [
      [pt, e],
      [Ue, t]
    ];
  var o = n5(e, t);
  if (o) {
    var a = o[0], u = o[1], f = o[2], c = o[3], l = o[4], h = lo(a, f), d = lo(u, c);
    return h.concat([[pe, l]], d);
  }
  return t5(e, t);
}
function t5(e, t) {
  for (var n = e.length, r = t.length, i = Math.ceil((n + r) / 2), s = i, o = 2 * i, a = new Array(o), u = new Array(o), f = 0; f < o; f++)
    a[f] = -1, u[f] = -1;
  a[s + 1] = 0, u[s + 1] = 0;
  for (var c = n - r, l = c % 2 !== 0, h = 0, d = 0, _ = 0, v = 0, g = 0; g < i; g++) {
    for (var y = -g + h; y <= g - d; y += 2) {
      var b = s + y, w;
      y === -g || y !== g && a[b - 1] < a[b + 1] ? w = a[b + 1] : w = a[b - 1] + 1;
      for (var m = w - y; w < n && m < r && e.charAt(w) === t.charAt(m); )
        w++, m++;
      if (a[b] = w, w > n)
        d += 2;
      else if (m > r)
        h += 2;
      else if (l) {
        var A = s + c - y;
        if (A >= 0 && A < o && u[A] !== -1) {
          var S = n - u[A];
          if (w >= S)
            return iv(e, t, w, m);
        }
      }
    }
    for (var R = -g + _; R <= g - v; R += 2) {
      var A = s + R, S;
      R === -g || R !== g && u[A - 1] < u[A + 1] ? S = u[A + 1] : S = u[A - 1] + 1;
      for (var B = S - R; S < n && B < r && e.charAt(n - S - 1) === t.charAt(r - B - 1); )
        S++, B++;
      if (u[A] = S, S > n)
        v += 2;
      else if (B > r)
        _ += 2;
      else if (!l) {
        var b = s + c - R;
        if (b >= 0 && b < o && a[b] !== -1) {
          var w = a[b], m = s + w - b;
          if (S = n - S, w >= S)
            return iv(e, t, w, m);
        }
      }
    }
  }
  return [
    [pt, e],
    [Ue, t]
  ];
}
function iv(e, t, n, r) {
  var i = e.substring(0, n), s = t.substring(0, r), o = e.substring(n), a = t.substring(r), u = lo(i, s), f = lo(o, a);
  return u.concat(f);
}
function Fp(e, t) {
  if (!e || !t || e.charAt(0) !== t.charAt(0))
    return 0;
  for (var n = 0, r = Math.min(e.length, t.length), i = r, s = 0; n < i; )
    e.substring(s, i) == t.substring(s, i) ? (n = i, s = n) : r = i, i = Math.floor((r - n) / 2 + n);
  return CO(e.charCodeAt(i - 1)) && i--, i;
}
function sv(e, t) {
  var n = e.length, r = t.length;
  if (n == 0 || r == 0)
    return 0;
  n > r ? e = e.substring(n - r) : n < r && (t = t.substring(0, n));
  var i = Math.min(n, r);
  if (e == t)
    return i;
  for (var s = 0, o = 1; ; ) {
    var a = e.substring(i - o), u = t.indexOf(a);
    if (u == -1)
      return s;
    o += u, (u == 0 || e.substring(i - o) == t.substring(0, o)) && (s = o, o++);
  }
}
function Rf(e, t) {
  if (!e || !t || e.slice(-1) !== t.slice(-1))
    return 0;
  for (var n = 0, r = Math.min(e.length, t.length), i = r, s = 0; n < i; )
    e.substring(e.length - i, e.length - s) == t.substring(t.length - i, t.length - s) ? (n = i, s = n) : r = i, i = Math.floor((r - n) / 2 + n);
  return LO(e.charCodeAt(e.length - i)) && i--, i;
}
function n5(e, t) {
  var n = e.length > t.length ? e : t, r = e.length > t.length ? t : e;
  if (n.length < 4 || r.length * 2 < n.length)
    return null;
  function i(d, _, v) {
    for (var g = d.substring(v, v + Math.floor(d.length / 4)), y = -1, b = "", w, m, A, S; (y = _.indexOf(g, y + 1)) !== -1; ) {
      var R = Fp(
        d.substring(v),
        _.substring(y)
      ), B = Rf(
        d.substring(0, v),
        _.substring(0, y)
      );
      b.length < B + R && (b = _.substring(y - B, y) + _.substring(y, y + R), w = d.substring(0, v - B), m = d.substring(v + R), A = _.substring(0, y - B), S = _.substring(y + R));
    }
    return b.length * 2 >= d.length ? [
      w,
      m,
      A,
      S,
      b
    ] : null;
  }
  var s = i(
    n,
    r,
    Math.ceil(n.length / 4)
  ), o = i(
    n,
    r,
    Math.ceil(n.length / 2)
  ), a;
  if (!s && !o)
    return null;
  o ? s ? a = s[4].length > o[4].length ? s : o : a = o : a = s;
  var u, f, c, l;
  e.length > t.length ? (u = a[0], f = a[1], c = a[2], l = a[3]) : (c = a[0], l = a[1], u = a[2], f = a[3]);
  var h = a[4];
  return [u, f, c, l, h];
}
function r5(e) {
  for (var t = !1, n = [], r = 0, i = null, s = 0, o = 0, a = 0, u = 0, f = 0; s < e.length; )
    e[s][0] == pe ? (n[r++] = s, o = u, a = f, u = 0, f = 0, i = e[s][1]) : (e[s][0] == Ue ? u += e[s][1].length : f += e[s][1].length, i && i.length <= Math.max(o, a) && i.length <= Math.max(u, f) && (e.splice(n[r - 1], 0, [
      pt,
      i
    ]), e[n[r - 1] + 1][0] = Ue, r--, r--, s = r > 0 ? n[r - 1] : -1, o = 0, a = 0, u = 0, f = 0, i = null, t = !0)), s++;
  for (t && Bp(e), o5(e), s = 1; s < e.length; ) {
    if (e[s - 1][0] == pt && e[s][0] == Ue) {
      var c = e[s - 1][1], l = e[s][1], h = sv(c, l), d = sv(l, c);
      h >= d ? (h >= c.length / 2 || h >= l.length / 2) && (e.splice(s, 0, [
        pe,
        l.substring(0, h)
      ]), e[s - 1][1] = c.substring(
        0,
        c.length - h
      ), e[s + 1][1] = l.substring(h), s++) : (d >= c.length / 2 || d >= l.length / 2) && (e.splice(s, 0, [
        pe,
        c.substring(0, d)
      ]), e[s - 1][0] = Ue, e[s - 1][1] = l.substring(
        0,
        l.length - d
      ), e[s + 1][0] = pt, e[s + 1][1] = c.substring(d), s++), s++;
    }
    s++;
  }
}
var ov = /[^a-zA-Z0-9]/, av = /\s/, uv = /[\r\n]/, i5 = /\n\r?\n$/, s5 = /^\r?\n\r?\n/;
function o5(e) {
  function t(d, _) {
    if (!d || !_)
      return 6;
    var v = d.charAt(d.length - 1), g = _.charAt(0), y = v.match(ov), b = g.match(ov), w = y && v.match(av), m = b && g.match(av), A = w && v.match(uv), S = m && g.match(uv), R = A && d.match(i5), B = S && _.match(s5);
    return R || B ? 5 : A || S ? 4 : y && !w && m ? 3 : w || m ? 2 : y || b ? 1 : 0;
  }
  for (var n = 1; n < e.length - 1; ) {
    if (e[n - 1][0] == pe && e[n + 1][0] == pe) {
      var r = e[n - 1][1], i = e[n][1], s = e[n + 1][1], o = Rf(r, i);
      if (o) {
        var a = i.substring(i.length - o);
        r = r.substring(0, r.length - o), i = a + i.substring(0, i.length - o), s = a + s;
      }
      for (var u = r, f = i, c = s, l = t(r, i) + t(i, s); i.charAt(0) === s.charAt(0); ) {
        r += i.charAt(0), i = i.substring(1) + s.charAt(0), s = s.substring(1);
        var h = t(r, i) + t(i, s);
        h >= l && (l = h, u = r, f = i, c = s);
      }
      e[n - 1][1] != u && (u ? e[n - 1][1] = u : (e.splice(n - 1, 1), n--), e[n][1] = f, c ? e[n + 1][1] = c : (e.splice(n + 1, 1), n--));
    }
    n++;
  }
}
function Bp(e, t) {
  e.push([pe, ""]);
  for (var n = 0, r = 0, i = 0, s = "", o = "", a; n < e.length; ) {
    if (n < e.length - 1 && !e[n][1]) {
      e.splice(n, 1);
      continue;
    }
    switch (e[n][0]) {
      case Ue:
        i++, o += e[n][1], n++;
        break;
      case pt:
        r++, s += e[n][1], n++;
        break;
      case pe:
        var u = n - i - r - 1;
        if (t) {
          if (u >= 0 && FO(e[u][1])) {
            var f = e[u][1].slice(-1);
            if (e[u][1] = e[u][1].slice(
              0,
              -1
            ), s = f + s, o = f + o, !e[u][1]) {
              e.splice(u, 1), n--;
              var c = u - 1;
              e[c] && e[c][0] === Ue && (i++, o = e[c][1] + o, c--), e[c] && e[c][0] === pt && (r++, s = e[c][1] + s, c--), u = c;
            }
          }
          if (jO(e[n][1])) {
            var f = e[n][1].charAt(0);
            e[n][1] = e[n][1].slice(1), s += f, o += f;
          }
        }
        if (n < e.length - 1 && !e[n][1]) {
          e.splice(n, 1);
          break;
        }
        if (s.length > 0 || o.length > 0) {
          s.length > 0 && o.length > 0 && (a = Fp(o, s), a !== 0 && (u >= 0 ? e[u][1] += o.substring(
            0,
            a
          ) : (e.splice(0, 0, [
            pe,
            o.substring(0, a)
          ]), n++), o = o.substring(a), s = s.substring(a)), a = Rf(o, s), a !== 0 && (e[n][1] = o.substring(o.length - a) + e[n][1], o = o.substring(
            0,
            o.length - a
          ), s = s.substring(
            0,
            s.length - a
          )));
          var l = i + r;
          s.length === 0 && o.length === 0 ? (e.splice(n - l, l), n = n - l) : s.length === 0 ? (e.splice(n - l, l, [Ue, o]), n = n - l + 1) : o.length === 0 ? (e.splice(n - l, l, [pt, s]), n = n - l + 1) : (e.splice(
            n - l,
            l,
            [pt, s],
            [Ue, o]
          ), n = n - l + 2);
        }
        n !== 0 && e[n - 1][0] === pe ? (e[n - 1][1] += e[n][1], e.splice(n, 1)) : n++, i = 0, r = 0, s = "", o = "";
        break;
    }
  }
  e[e.length - 1][1] === "" && e.pop();
  var h = !1;
  for (n = 1; n < e.length - 1; )
    e[n - 1][0] === pe && e[n + 1][0] === pe && (e[n][1].substring(
      e[n][1].length - e[n - 1][1].length
    ) === e[n - 1][1] ? (e[n][1] = e[n - 1][1] + e[n][1].substring(
      0,
      e[n][1].length - e[n - 1][1].length
    ), e[n + 1][1] = e[n - 1][1] + e[n + 1][1], e.splice(n - 1, 1), h = !0) : e[n][1].substring(0, e[n + 1][1].length) == e[n + 1][1] && (e[n - 1][1] += e[n + 1][1], e[n][1] = e[n][1].substring(e[n + 1][1].length) + e[n + 1][1], e.splice(n + 1, 1), h = !0)), n++;
  h && Bp(e, t);
}
function CO(e) {
  return e >= 55296 && e <= 56319;
}
function LO(e) {
  return e >= 56320 && e <= 57343;
}
function jO(e) {
  return LO(e.charCodeAt(0));
}
function FO(e) {
  return CO(e.charCodeAt(e.length - 1));
}
function a5(e) {
  for (var t = [], n = 0; n < e.length; n++)
    e[n][1].length > 0 && t.push(e[n]);
  return t;
}
function sc(e, t, n, r) {
  return FO(e) || jO(r) ? null : a5([
    [pe, e],
    [pt, t],
    [Ue, n],
    [pe, r]
  ]);
}
function u5(e, t, n) {
  var r = typeof n == "number" ? { index: n, length: 0 } : n.oldRange, i = typeof n == "number" ? null : n.newRange, s = e.length, o = t.length;
  if (r.length === 0 && (i === null || i.length === 0)) {
    var a = r.index, u = e.slice(0, a), f = e.slice(a), c = i ? i.index : null;
    e: {
      var l = a + o - s;
      if (c !== null && c !== l || l < 0 || l > o)
        break e;
      var h = t.slice(0, l), d = t.slice(l);
      if (d !== f)
        break e;
      var _ = Math.min(a, l), v = u.slice(0, _), g = h.slice(0, _);
      if (v !== g)
        break e;
      var y = u.slice(_), b = h.slice(_);
      return sc(v, y, b, f);
    }
    e: {
      if (c !== null && c !== a)
        break e;
      var w = a, h = t.slice(0, w), d = t.slice(w);
      if (h !== u)
        break e;
      var m = Math.min(s - w, o - w), A = f.slice(f.length - m), S = d.slice(d.length - m);
      if (A !== S)
        break e;
      var y = f.slice(0, f.length - m), b = d.slice(0, d.length - m);
      return sc(u, y, b, A);
    }
  }
  if (r.length > 0 && i && i.length === 0)
    e: {
      var v = e.slice(0, r.index), A = e.slice(r.index + r.length), _ = v.length, m = A.length;
      if (o < _ + m)
        break e;
      var g = t.slice(0, _), S = t.slice(o - m);
      if (v !== g || A !== S)
        break e;
      var y = e.slice(_, s - m), b = t.slice(_, o - m);
      return sc(v, y, b, A);
    }
  return null;
}
function Ir(e, t, n, r) {
  return lo(e, t, n, r, !0);
}
Ir.INSERT = Ue;
Ir.DELETE = pt;
Ir.EQUAL = pe;
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2022 Joachim Wester
 * MIT licensed
 */
const f5 = Object.prototype.hasOwnProperty;
function c5(e, t) {
  return f5.call(e, t);
}
function l5(e) {
  if (Array.isArray(e)) {
    const n = new Array(e.length);
    for (let r = 0; r < n.length; r++)
      n[r] = "" + r;
    return n;
  }
  if (Object.keys)
    return Object.keys(e);
  let t = [];
  for (let n in e)
    c5(e, n) && t.push(n);
  return t;
}
function Kr(e) {
  switch (typeof e) {
    case "object":
      return JSON.parse(JSON.stringify(e));
    //Faster than ES5 clone - http://jsperf.com/deep-cloning-of-objects/5
    case "undefined":
      return null;
    //this is how JSON.stringify behaves for array items
    default:
      return e;
  }
}
function ol(e) {
  let t = 0;
  const n = e.length;
  let r;
  for (; t < n; ) {
    if (r = e.charCodeAt(t), r >= 48 && r <= 57) {
      t++;
      continue;
    }
    return !1;
  }
  return !0;
}
function h5(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
function al(e) {
  if (e === void 0)
    return !0;
  if (e) {
    if (Array.isArray(e)) {
      for (let n = 0, r = e.length; n < r; n++)
        if (al(e[n]))
          return !0;
    } else if (typeof e == "object") {
      const n = l5(e), r = n.length;
      for (var t = 0; t < r; t++)
        if (al(e[n[t]]))
          return !0;
    }
  }
  return !1;
}
function fv(e, t) {
  const n = [e];
  for (const r in t) {
    const i = typeof t[r] == "object" ? JSON.stringify(t[r], null, 2) : t[r];
    typeof i < "u" && n.push(`${r}: ${i}`);
  }
  return n.join(`
`);
}
class p5 extends Error {
  constructor(t, n, r, i, s) {
    super(fv(t, { name: n, index: r, operation: i, tree: s })), this.name = n, this.index = r, this.operation = i, this.tree = s, Object.setPrototypeOf(this, new.target.prototype), this.message = fv(t, { name: n, index: r, operation: i, tree: s });
  }
}
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2013-2021 Joachim Wester
 * MIT license
 */
const ue = p5, d5 = Kr, bi = {
  add: function(e, t, n) {
    return e[t] = this.value, { newDocument: n };
  },
  remove: function(e, t, n) {
    var r = e[t];
    return delete e[t], { newDocument: n, removed: r };
  },
  replace: function(e, t, n) {
    var r = e[t];
    return e[t] = this.value, { newDocument: n, removed: r };
  },
  move: function(e, t, n) {
    let r = fu(n, this.path);
    r && (r = Kr(r));
    const i = Dr(
      n,
      { op: "remove", path: this.from }
    ).removed;
    return Dr(n, { op: "add", path: this.path, value: i }), { newDocument: n, removed: r };
  },
  copy: function(e, t, n) {
    const r = fu(n, this.from);
    return Dr(
      n,
      { op: "add", path: this.path, value: Kr(r) }
    ), { newDocument: n };
  },
  test: function(e, t, n) {
    return { newDocument: n, test: ho(e[t], this.value) };
  },
  _get: function(e, t, n) {
    return this.value = e[t], { newDocument: n };
  }
};
var _5 = {
  add: function(e, t, n) {
    return ol(t) ? e.splice(t, 0, this.value) : e[t] = this.value, { newDocument: n, index: t };
  },
  remove: function(e, t, n) {
    var r = e.splice(t, 1);
    return { newDocument: n, removed: r[0] };
  },
  replace: function(e, t, n) {
    var r = e[t];
    return e[t] = this.value, { newDocument: n, removed: r };
  },
  move: bi.move,
  copy: bi.copy,
  test: bi.test,
  _get: bi._get
};
function fu(e, t) {
  if (t == "")
    return e;
  var n = { op: "_get", path: t };
  return Dr(e, n), n.value;
}
function Dr(e, t, n = !1, r = !0, i = !0, s = 0) {
  if (n && (typeof n == "function" ? n(t, 0, e, t.path) : cu(t, 0)), t.path === "") {
    let o = { newDocument: e };
    if (t.op === "add")
      return o.newDocument = t.value, o;
    if (t.op === "replace")
      return o.newDocument = t.value, o.removed = e, o;
    if (t.op === "move" || t.op === "copy")
      return o.newDocument = fu(e, t.from), t.op === "move" && (o.removed = e), o;
    if (t.op === "test") {
      if (o.test = ho(e, t.value), o.test === !1)
        throw new ue("Test operation failed", "TEST_OPERATION_FAILED", s, t, e);
      return o.newDocument = e, o;
    } else {
      if (t.op === "remove")
        return o.removed = e, o.newDocument = null, o;
      if (t.op === "_get")
        return t.value = e, o;
      if (n)
        throw new ue("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", s, t, e);
      return o;
    }
  } else {
    r || (e = Kr(e));
    const a = (t.path || "").split("/");
    let u = e, f = 1, c = a.length, l, h, d;
    for (typeof n == "function" ? d = n : d = cu; ; ) {
      if (h = a[f], h && h.indexOf("~") != -1 && (h = h5(h)), i && (h == "__proto__" || h == "prototype" && f > 0 && a[f - 1] == "constructor"))
        throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");
      if (n && l === void 0 && (u[h] === void 0 ? l = a.slice(0, f).join("/") : f == c - 1 && (l = t.path), l !== void 0 && d(t, 0, e, l)), f++, Array.isArray(u)) {
        if (h === "-")
          h = u.length;
        else {
          if (n && !ol(h))
            throw new ue("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", s, t, e);
          ol(h) && (h = ~~h);
        }
        if (f >= c) {
          if (n && t.op === "add" && h > u.length)
            throw new ue("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", s, t, e);
          const _ = _5[t.op].call(t, u, h, e);
          if (_.test === !1)
            throw new ue("Test operation failed", "TEST_OPERATION_FAILED", s, t, e);
          return _;
        }
      } else if (f >= c) {
        const _ = bi[t.op].call(t, u, h, e);
        if (_.test === !1)
          throw new ue("Test operation failed", "TEST_OPERATION_FAILED", s, t, e);
        return _;
      }
      if (u = u[h], n && f < c && (!u || typeof u != "object"))
        throw new ue("Cannot perform operation at the desired path", "OPERATION_PATH_UNRESOLVABLE", s, t, e);
    }
  }
}
function BO(e, t, n, r = !0, i = !0) {
  if (n && !Array.isArray(t))
    throw new ue("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
  r || (e = Kr(e));
  const s = new Array(t.length);
  for (let o = 0, a = t.length; o < a; o++)
    s[o] = Dr(e, t[o], n, !0, i, o), e = s[o].newDocument;
  return s.newDocument = e, s;
}
function v5(e, t, n) {
  const r = Dr(e, t);
  if (r.test === !1)
    throw new ue("Test operation failed", "TEST_OPERATION_FAILED", n, t, e);
  return r.newDocument;
}
function cu(e, t, n, r) {
  if (typeof e != "object" || e === null || Array.isArray(e))
    throw new ue("Operation is not an object", "OPERATION_NOT_AN_OBJECT", t, e, n);
  if (bi[e.op]) {
    if (typeof e.path != "string")
      throw new ue("Operation `path` property is not a string", "OPERATION_PATH_INVALID", t, e, n);
    if (e.path.indexOf("/") !== 0 && e.path.length > 0)
      throw new ue('Operation `path` property must start with "/"', "OPERATION_PATH_INVALID", t, e, n);
    if ((e.op === "move" || e.op === "copy") && typeof e.from != "string")
      throw new ue("Operation `from` property is not present (applicable in `move` and `copy` operations)", "OPERATION_FROM_REQUIRED", t, e, n);
    if ((e.op === "add" || e.op === "replace" || e.op === "test") && e.value === void 0)
      throw new ue("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_REQUIRED", t, e, n);
    if ((e.op === "add" || e.op === "replace" || e.op === "test") && al(e.value))
      throw new ue("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED", t, e, n);
    if (n) {
      if (e.op == "add") {
        var i = e.path.split("/").length, s = r.split("/").length;
        if (i !== s + 1 && i !== s)
          throw new ue("Cannot perform an `add` operation at the desired path", "OPERATION_PATH_CANNOT_ADD", t, e, n);
      } else if (e.op === "replace" || e.op === "remove" || e.op === "_get") {
        if (e.path !== r)
          throw new ue("Cannot perform the operation at a path that does not exist", "OPERATION_PATH_UNRESOLVABLE", t, e, n);
      } else if (e.op === "move" || e.op === "copy") {
        var o = { op: "_get", path: e.from, value: void 0 }, a = zO([o], n);
        if (a && a.name === "OPERATION_PATH_UNRESOLVABLE")
          throw new ue("Cannot perform the operation from a path that does not exist", "OPERATION_FROM_UNRESOLVABLE", t, e, n);
      }
    }
  } else throw new ue("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", t, e, n);
}
function zO(e, t, n) {
  try {
    if (!Array.isArray(e))
      throw new ue("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
    if (t)
      BO(Kr(t), Kr(e), n || !0);
    else {
      n = n || cu;
      for (var r = 0; r < e.length; r++)
        n(e[r], r, t, void 0);
    }
  } catch (i) {
    if (i instanceof ue)
      return i;
    throw i;
  }
}
function ho(e, t) {
  if (e === t) return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    var n = Array.isArray(e), r = Array.isArray(t), i, s, o;
    if (n && r) {
      if (s = e.length, s != t.length) return !1;
      for (i = s; i-- !== 0; )
        if (!ho(e[i], t[i])) return !1;
      return !0;
    }
    if (n != r) return !1;
    var a = Object.keys(e);
    if (s = a.length, s !== Object.keys(t).length)
      return !1;
    for (i = s; i-- !== 0; )
      if (!t.hasOwnProperty(a[i])) return !1;
    for (i = s; i-- !== 0; )
      if (o = a[i], !ho(e[o], t[o])) return !1;
    return !0;
  }
  return e !== e && t !== t;
}
const q5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JsonPatchError: ue,
  _areEquals: ho,
  applyOperation: Dr,
  applyPatch: BO,
  applyReducer: v5,
  deepClone: d5,
  getValueByPointer: fu,
  validate: zO,
  validator: cu
}, Symbol.toStringTag, { value: "Module" }));
var ul;
((e) => {
  function t(s = {}, o = {}, a = !1) {
    typeof s != "object" && (s = {}), typeof o != "object" && (o = {});
    let u = Ru(o);
    a || (u = Object.keys(u).reduce((f, c) => (u[c] != null && (f[c] = u[c]), f), {}));
    for (const f in s)
      s[f] !== void 0 && o[f] === void 0 && (u[f] = s[f]);
    return Object.keys(u).length > 0 ? u : void 0;
  }
  e.compose = t;
  function n(s = {}, o = {}) {
    typeof s != "object" && (s = {}), typeof o != "object" && (o = {});
    const a = Object.keys(s).concat(Object.keys(o)).reduce((u, f) => (Oi(s[f], o[f]) || (u[f] = o[f] === void 0 ? null : o[f]), u), {});
    return Object.keys(a).length > 0 ? a : void 0;
  }
  e.diff = n;
  function r(s = {}, o = {}) {
    s = s || {};
    const a = Object.keys(o).reduce((u, f) => (o[f] !== s[f] && s[f] !== void 0 && (u[f] = o[f]), u), {});
    return Object.keys(s).reduce((u, f) => (s[f] !== o[f] && o[f] === void 0 && (u[f] = null), u), a);
  }
  e.invert = r;
  function i(s, o, a = !1) {
    if (typeof s != "object")
      return o;
    if (typeof o != "object")
      return;
    if (!a)
      return o;
    const u = Object.keys(o).reduce((f, c) => (s[c] === void 0 && (f[c] = o[c]), f), {});
    return Object.keys(u).length > 0 ? u : void 0;
  }
  e.transform = i;
})(ul || (ul = {}));
const Pr = ul;
var fl;
((e) => {
  function t(n) {
    return typeof n.delete == "number" ? n.delete : typeof n.retain == "number" ? n.retain : typeof n.retain == "object" && n.retain !== null ? 1 : typeof n.insert == "string" ? n.insert.length : 1;
  }
  e.length = t;
})(fl || (fl = {}));
const Ht = fl;
class Rt {
  ops;
  index;
  offset;
  constructor(t) {
    this.ops = t, this.index = 0, this.offset = 0;
  }
  hasNext() {
    return this.peekLength() < 1 / 0;
  }
  next(t) {
    t || (t = 1 / 0);
    const n = this.ops[this.index];
    if (n) {
      const r = this.offset, i = Ht.length(n);
      if (t >= i - r ? (t = i - r, this.index += 1, this.offset = 0) : this.offset += t, typeof n.delete == "number")
        return { delete: t };
      {
        const s = {};
        return n.attributes && (s.attributes = n.attributes), typeof n.retain == "number" ? s.retain = t : typeof n.retain == "object" && n.retain !== null ? s.retain = n.retain : typeof n.insert == "string" ? s.insert = n.insert.substr(r, t) : s.insert = n.insert, s;
      }
    } else
      return { retain: 1 / 0 };
  }
  peek() {
    return this.ops[this.index];
  }
  peekLength() {
    return this.ops[this.index] ? Ht.length(this.ops[this.index]) - this.offset : 1 / 0;
  }
  peekType() {
    const t = this.ops[this.index];
    return t ? typeof t.delete == "number" ? "delete" : typeof t.retain == "number" || typeof t.retain == "object" && t.retain !== null ? "retain" : "insert" : "retain";
  }
  rest() {
    if (this.hasNext()) {
      if (this.offset === 0)
        return this.ops.slice(this.index);
      {
        const t = this.offset, n = this.index, r = this.next(), i = this.ops.slice(this.index);
        return this.offset = t, this.index = n, [r].concat(i);
      }
    } else return [];
  }
}
const g5 = "\0", cv = (e, t) => {
  if (typeof e != "object" || e === null)
    throw new Error(`cannot retain a ${typeof e}`);
  if (typeof t != "object" || t === null)
    throw new Error(`cannot retain a ${typeof t}`);
  const n = Object.keys(e)[0];
  if (!n || n !== Object.keys(t)[0])
    throw new Error(
      `embed types not matched: ${n} != ${Object.keys(t)[0]}`
    );
  return [n, e[n], t[n]];
};
class $e {
  static Op = Ht;
  static OpIterator = Rt;
  static AttributeMap = Pr;
  static handlers = {};
  static registerEmbed(t, n) {
    this.handlers[t] = n;
  }
  static unregisterEmbed(t) {
    delete this.handlers[t];
  }
  static getHandler(t) {
    const n = this.handlers[t];
    if (!n)
      throw new Error(`no handlers for embed type "${t}"`);
    return n;
  }
  ops;
  constructor(t) {
    Array.isArray(t) ? this.ops = t : t != null && Array.isArray(t.ops) ? this.ops = t.ops : this.ops = [];
  }
  insert(t, n) {
    const r = {};
    return typeof t == "string" && t.length === 0 ? this : (r.insert = t, n != null && typeof n == "object" && Object.keys(n).length > 0 && (r.attributes = n), this.push(r));
  }
  delete(t) {
    return t <= 0 ? this : this.push({ delete: t });
  }
  retain(t, n) {
    if (typeof t == "number" && t <= 0)
      return this;
    const r = { retain: t };
    return n != null && typeof n == "object" && Object.keys(n).length > 0 && (r.attributes = n), this.push(r);
  }
  push(t) {
    let n = this.ops.length, r = this.ops[n - 1];
    if (t = Ru(t), typeof r == "object") {
      if (typeof t.delete == "number" && typeof r.delete == "number")
        return this.ops[n - 1] = { delete: r.delete + t.delete }, this;
      if (typeof r.delete == "number" && t.insert != null && (n -= 1, r = this.ops[n - 1], typeof r != "object"))
        return this.ops.unshift(t), this;
      if (Oi(t.attributes, r.attributes)) {
        if (typeof t.insert == "string" && typeof r.insert == "string")
          return this.ops[n - 1] = { insert: r.insert + t.insert }, typeof t.attributes == "object" && (this.ops[n - 1].attributes = t.attributes), this;
        if (typeof t.retain == "number" && typeof r.retain == "number")
          return this.ops[n - 1] = { retain: r.retain + t.retain }, typeof t.attributes == "object" && (this.ops[n - 1].attributes = t.attributes), this;
      }
    }
    return n === this.ops.length ? this.ops.push(t) : this.ops.splice(n, 0, t), this;
  }
  chop() {
    const t = this.ops[this.ops.length - 1];
    return t && typeof t.retain == "number" && !t.attributes && this.ops.pop(), this;
  }
  filter(t) {
    return this.ops.filter(t);
  }
  forEach(t) {
    this.ops.forEach(t);
  }
  map(t) {
    return this.ops.map(t);
  }
  partition(t) {
    const n = [], r = [];
    return this.forEach((i) => {
      (t(i) ? n : r).push(i);
    }), [n, r];
  }
  reduce(t, n) {
    return this.ops.reduce(t, n);
  }
  changeLength() {
    return this.reduce((t, n) => n.insert ? t + Ht.length(n) : n.delete ? t - n.delete : t, 0);
  }
  length() {
    return this.reduce((t, n) => t + Ht.length(n), 0);
  }
  slice(t = 0, n = 1 / 0) {
    const r = [], i = new Rt(this.ops);
    let s = 0;
    for (; s < n && i.hasNext(); ) {
      let o;
      s < t ? o = i.next(t - s) : (o = i.next(n - s), r.push(o)), s += Ht.length(o);
    }
    return new $e(r);
  }
  compose(t) {
    const n = new Rt(this.ops), r = new Rt(t.ops), i = [], s = r.peek();
    if (s != null && typeof s.retain == "number" && s.attributes == null) {
      let a = s.retain;
      for (; n.peekType() === "insert" && n.peekLength() <= a; )
        a -= n.peekLength(), i.push(n.next());
      s.retain - a > 0 && r.next(s.retain - a);
    }
    const o = new $e(i);
    for (; n.hasNext() || r.hasNext(); )
      if (r.peekType() === "insert")
        o.push(r.next());
      else if (n.peekType() === "delete")
        o.push(n.next());
      else {
        const a = Math.min(n.peekLength(), r.peekLength()), u = n.next(a), f = r.next(a);
        if (f.retain) {
          const c = {};
          if (typeof u.retain == "number")
            c.retain = typeof f.retain == "number" ? a : f.retain;
          else if (typeof f.retain == "number")
            u.retain == null ? c.insert = u.insert : c.retain = u.retain;
          else {
            const h = u.retain == null ? "insert" : "retain", [d, _, v] = cv(
              u[h],
              f.retain
            ), g = $e.getHandler(d);
            c[h] = {
              [d]: g.compose(
                _,
                v,
                h === "retain"
              )
            };
          }
          const l = Pr.compose(
            u.attributes,
            f.attributes,
            typeof u.retain == "number"
          );
          if (l && (c.attributes = l), o.push(c), !r.hasNext() && Oi(o.ops[o.ops.length - 1], c)) {
            const h = new $e(n.rest());
            return o.concat(h).chop();
          }
        } else typeof f.delete == "number" && (typeof u.retain == "number" || typeof u.retain == "object" && u.retain !== null) && o.push(f);
      }
    return o.chop();
  }
  concat(t) {
    const n = new $e(this.ops.slice());
    return t.ops.length > 0 && (n.push(t.ops[0]), n.ops = n.ops.concat(t.ops.slice(1))), n;
  }
  diff(t, n) {
    if (this.ops === t.ops)
      return new $e();
    const r = [this, t].map((u) => u.map((f) => {
      if (f.insert != null)
        return typeof f.insert == "string" ? f.insert : g5;
      const c = u === t ? "on" : "with";
      throw new Error("diff() called " + c + " non-document");
    }).join("")), i = new $e(), s = Ir(r[0], r[1], n, !0), o = new Rt(this.ops), a = new Rt(t.ops);
    return s.forEach((u) => {
      let f = u[1].length;
      for (; f > 0; ) {
        let c = 0;
        switch (u[0]) {
          case Ir.INSERT:
            c = Math.min(a.peekLength(), f), i.push(a.next(c));
            break;
          case Ir.DELETE:
            c = Math.min(f, o.peekLength()), o.next(c), i.delete(c);
            break;
          case Ir.EQUAL:
            c = Math.min(
              o.peekLength(),
              a.peekLength(),
              f
            );
            const l = o.next(c), h = a.next(c);
            Oi(l.insert, h.insert) ? i.retain(
              c,
              Pr.diff(l.attributes, h.attributes)
            ) : i.push(h).delete(c);
            break;
        }
        f -= c;
      }
    }), i.chop();
  }
  eachLine(t, n = `
`) {
    const r = new Rt(this.ops);
    let i = new $e(), s = 0;
    for (; r.hasNext(); ) {
      if (r.peekType() !== "insert")
        return;
      const o = r.peek(), a = Ht.length(o) - r.peekLength(), u = typeof o.insert == "string" ? o.insert.indexOf(n, a) - a : -1;
      if (u < 0)
        i.push(r.next());
      else if (u > 0)
        i.push(r.next(u));
      else {
        if (t(i, r.next(1).attributes || {}, s) === !1)
          return;
        s += 1, i = new $e();
      }
    }
    i.length() > 0 && t(i, {}, s);
  }
  invert(t) {
    const n = new $e();
    return this.reduce((r, i) => {
      if (i.insert)
        n.delete(Ht.length(i));
      else {
        if (typeof i.retain == "number" && i.attributes == null)
          return n.retain(i.retain), r + i.retain;
        if (i.delete || typeof i.retain == "number") {
          const s = i.delete || i.retain;
          return t.slice(r, r + s).forEach((a) => {
            i.delete ? n.push(a) : i.retain && i.attributes && n.retain(
              Ht.length(a),
              Pr.invert(i.attributes, a.attributes)
            );
          }), r + s;
        } else if (typeof i.retain == "object" && i.retain !== null) {
          const s = t.slice(r, r + 1), o = new Rt(s.ops).next(), [a, u, f] = cv(
            i.retain,
            o.insert
          ), c = $e.getHandler(a);
          return n.retain(
            { [a]: c.invert(u, f) },
            Pr.invert(i.attributes, o.attributes)
          ), r + 1;
        }
      }
      return r;
    }, 0), n.chop();
  }
  transform(t, n = !1) {
    if (n = !!n, typeof t == "number")
      return this.transformPosition(t, n);
    const r = t, i = new Rt(this.ops), s = new Rt(r.ops), o = new $e();
    for (; i.hasNext() || s.hasNext(); )
      if (i.peekType() === "insert" && (n || s.peekType() !== "insert"))
        o.retain(Ht.length(i.next()));
      else if (s.peekType() === "insert")
        o.push(s.next());
      else {
        const a = Math.min(i.peekLength(), s.peekLength()), u = i.next(a), f = s.next(a);
        if (u.delete)
          continue;
        if (f.delete)
          o.push(f);
        else {
          const c = u.retain, l = f.retain;
          let h = typeof l == "object" && l !== null ? l : a;
          if (typeof c == "object" && c !== null && typeof l == "object" && l !== null) {
            const d = Object.keys(c)[0];
            if (d === Object.keys(l)[0]) {
              const _ = $e.getHandler(d);
              _ && (h = {
                [d]: _.transform(
                  c[d],
                  l[d],
                  n
                )
              });
            }
          }
          o.retain(
            h,
            Pr.transform(
              u.attributes,
              f.attributes,
              n
            )
          );
        }
      }
    return o.chop();
  }
  transformPosition(t, n = !1) {
    n = !!n;
    const r = new Rt(this.ops);
    let i = 0;
    for (; r.hasNext() && i <= t; ) {
      const s = r.peekLength(), o = r.peekType();
      if (r.next(), o === "delete") {
        t -= Math.min(s, t - i);
        continue;
      } else o === "insert" && (i < t || !n) && (t += s);
      i += s;
    }
    return t;
  }
}
const G5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AttributeMap: Pr,
  Delta: $e,
  Op: Ht,
  OpIterator: Rt,
  default: $e
}, Symbol.toStringTag, { value: "Module" })), oc = {};
class H5 {
  transactionWrappers;
  wrapperInitData;
  constructor() {
    this.reinitializeTransaction();
  }
  _isInTransaction = !1;
  isInTransaction() {
    return !!this._isInTransaction;
  }
  reinitializeTransaction() {
    this.transactionWrappers = this.getTransactionWrappers(), this.wrapperInitData ? this.wrapperInitData.length = 0 : this.wrapperInitData = [], this._isInTransaction = !1;
  }
  perform(t, n, r, i, s, o, a, u) {
    if (this.isInTransaction)
      return;
    let f, c;
    try {
      this._isInTransaction = !0, f = !0, this.initializeAll(0), c = t.call(n, r, i, s, o, a, u), f = !1;
    } finally {
      try {
        if (f)
          try {
            this.closeAll(0);
          } catch {
          }
        else
          this.closeAll(0);
      } finally {
        this._isInTransaction = !1;
      }
    }
    return c;
  }
  initializeAll(t) {
    for (var n = this.transactionWrappers, r = t; r < n.length; r++) {
      var i = n[r];
      try {
        this.wrapperInitData[r] = oc, this.wrapperInitData[r] = i.initialize ? i.initialize.call(this) : null;
      } finally {
        if (this.wrapperInitData[r] === oc)
          try {
            this.initializeAll(r + 1);
          } catch {
          }
      }
    }
  }
  closeAll(t) {
    for (var n = this.transactionWrappers, r = t; r < n.length; r++) {
      var i = n[r], s = this.wrapperInitData[r], o;
      try {
        o = !0, s !== oc && i.close && i.close.call(this, s), o = !1;
      } finally {
        if (o)
          try {
            this.closeAll(r + 1);
          } catch {
          }
      }
    }
    this.wrapperInitData.length = 0;
  }
}
const cl = [];
let Ss = -1;
const K5 = (e) => ({
  current: e
}), Y5 = (e, t) => {
  cl[++Ss] = e.current, e.current = t;
}, X5 = (e) => {
  Ss < 0 || (e.current = cl[Ss], cl[Ss] = null, Ss--);
};
class y5 {
  available = [];
  inUse = /* @__PURE__ */ new Set();
  maxSize;
  create;
  reset;
  validate;
  totalCreated = 0;
  constructor(t) {
    this.maxSize = t.maxSize || 100, this.create = t.create, this.reset = t.reset, this.validate = t.validate;
    const n = t.preAllocate || 0;
    for (let r = 0; r < n && this.available.length < this.maxSize; r++) {
      const i = this.create();
      this.available.push(i), this.totalCreated++;
    }
  }
  /**
   * 从池中获取一个对象
   * @returns 可用的对象
   */
  acquire() {
    for (; this.available.length > 0; ) {
      const t = this.available.pop();
      if (!this.validate || this.validate(t))
        return this.inUse.add(t), t;
    }
    if (this.totalCreated < this.maxSize) {
      const t = this.create();
      return this.inUse.add(t), this.totalCreated++, t;
    }
    throw new Error(`Pool reached maximum size: ${this.maxSize}`);
  }
  /**
   * 释放对象回池中
   * @param obj 要释放的对象
   */
  release(t) {
    if (!this.inUse.has(t)) {
      console.warn("Attempted to release an object not in use");
      return;
    }
    this.reset && this.reset(t), this.inUse.delete(t), this.available.length < this.maxSize && this.available.push(t);
  }
  /**
   * 批量释放多个对象
   * @param objects 要释放的对象数组
   */
  releaseAll(t) {
    t.forEach((n) => this.release(n));
  }
  /**
   * 获取池子统计信息
   */
  getStats() {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      totalCreated: this.totalCreated,
      maxSize: this.maxSize
    };
  }
  /**
   * 清空池子并释放所有资源
   */
  dispose() {
    this.available = [], this.inUse.clear(), this.totalCreated = 0;
  }
  /**
   * 获取当前可用的对象数量
   */
  get availableCount() {
    return this.available.length;
  }
  /**
   * 获取当前正在使用的对象数量
   */
  get inUseCount() {
    return this.inUse.size;
  }
  /**
   * 检查对象是否正在被使用
   */
  isInUse(t) {
    return this.inUse.has(t);
  }
}
class b5 {
  constructor(t, n) {
    this.pool = t, this.obj = n;
  }
  get value() {
    return this.obj;
  }
  release() {
    this.pool.release(this.obj);
  }
  // Symbol.dispose 用于 using 语句（ES2022+）
  [Symbol.dispose]() {
    this.release();
  }
}
class J5 extends y5 {
  /**
   * 获取对象并返回自动释放包装器
   */
  autoAcquire() {
    const t = this.acquire();
    return new b5(this, t);
  }
}
const m5 = (e) => {
  Mr && Mr.add(e);
};
let Mr = null;
class Z5 {
  static add = m5;
  static mixin(t, n = {}) {
    const r = t.prototype.dispose;
    t.prototype.__isDisposed = !1, t.prototype.isDisposed = function() {
      return !!this.__isDisposed;
    }, t.prototype.dispose = function() {
      this.__isDisposed || (this.__isDisposed = !0, n.dispose?.(this), r?.call(t));
    }, t.prototype.disposeLater = function() {
      Mr && !this.__isDisposed && Mr.add(this);
    };
  }
  disposables = [];
  persistentDisposables = [];
  add(t) {
    this.disposables.push(t);
  }
  addPersistent(t) {
    this.persistentDisposables.push(t);
  }
  destroy() {
    this.dispose();
    for (let t = 0; t < this.persistentDisposables.length; t++)
      this.persistentDisposables[t].dispose();
    this.persistentDisposables.length = 0;
  }
  dispose() {
    for (let t = 0; t < this.disposables.length; t++)
      this.disposables[t].dispose();
    this.disposables.length = 0;
  }
  run(t) {
    let n = Mr;
    try {
      return Mr = this, t();
    } finally {
      this.dispose(), Mr = n;
    }
  }
}
export {
  Up as AT_TARGET,
  J5 as AutoPool,
  kO as BUBBLING_PHASE,
  WO as CAPTURING_PHASE,
  x5 as Callbacks,
  ut as Color,
  Z5 as DisposableManager,
  ll as Emitter4Event,
  w5 as Event,
  Pe as EventEmitter,
  O5 as EventEmitter4,
  lu as EventPhase,
  Ri as EventPropagation,
  Ri as EventTarget,
  Qz as HookType,
  M5 as Immutable,
  hv as NONE,
  SO as Options,
  k5 as PluginService,
  y5 as Pool,
  T5 as PriorityQueue,
  G5 as QuillDelta,
  S5 as Signals,
  H5 as Transaction,
  m5 as addDisposable,
  j5 as alienSignals,
  N5 as antvUtil,
  W5 as colord,
  B5 as compose,
  K5 as createCursor,
  fo as deepmerge,
  il as fastDeepEqual,
  Ir as fastDiff,
  q5 as fastJsonPatch,
  xz as hexToRgb,
  U5 as hslToHsv,
  Q_ as hslToRgb,
  V5 as hsvToHsl,
  Sz as hsvToRgb,
  $5 as immer,
  Tz as lerpColor,
  P5 as lodash,
  A5 as mitt,
  L5 as mobx,
  E5 as observable,
  X5 as pop,
  Y5 as push,
  R5 as radash,
  I5 as reactivity,
  C5 as redux,
  Ez as rgbToHsl,
  z5 as rgbToHsv,
  D5 as signals,
  F5 as tapable
};
