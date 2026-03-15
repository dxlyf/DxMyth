var OE = Object.prototype.hasOwnProperty, We = "~";
function qs() {
}
Object.create && (qs.prototype = /* @__PURE__ */ Object.create(null), new qs().__proto__ || (We = !1));
function EE(e, t, n) {
  this.fn = e, this.context = t, this.once = n || !1;
}
function Bv(e, t, n, r, i) {
  if (typeof n != "function")
    throw new TypeError("The listener must be a function");
  var s = new EE(n, r || e, i), o = We ? We + t : t;
  return e._events[o] ? e._events[o].fn ? e._events[o] = [e._events[o], s] : e._events[o].push(s) : (e._events[o] = s, e._eventsCount++), e;
}
function Ma(e, t) {
  --e._eventsCount === 0 ? e._events = new qs() : delete e._events[t];
}
function Pe() {
  this._events = new qs(), this._eventsCount = 0;
}
Pe.prototype.eventNames = function() {
  var t = [], n, r;
  if (this._eventsCount === 0) return t;
  for (r in n = this._events)
    OE.call(n, r) && t.push(We ? r.slice(1) : r);
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
  return Bv(this, t, n, r, !1);
};
Pe.prototype.once = function(t, n, r) {
  return Bv(this, t, n, r, !0);
};
Pe.prototype.removeListener = function(t, n, r, i) {
  var s = We ? We + t : t;
  if (!this._events[s]) return this;
  if (!n)
    return Ma(this, s), this;
  var o = this._events[s];
  if (o.fn)
    o.fn === n && (!i || o.once) && (!r || o.context === r) && Ma(this, s);
  else {
    for (var a = 0, u = [], f = o.length; a < f; a++)
      (o[a].fn !== n || i && !o[a].once || r && o[a].context !== r) && u.push(o[a]);
    u.length ? this._events[s] = u.length === 1 ? u[0] : u : Ma(this, s);
  }
  return this;
};
Pe.prototype.removeAllListeners = function(t) {
  var n;
  return t ? (n = We ? We + t : t, this._events[n] && Ma(this, n)) : (this._events = new qs(), this._eventsCount = 0), this;
};
Pe.prototype.off = Pe.prototype.removeListener;
Pe.prototype.addListener = Pe.prototype.on;
Pe.prefixed = We;
Pe.EventEmitter = Pe;
const Pu = {
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3
}, zv = Pu.NONE, SE = Pu.CAPTURING_PHASE, dd = Pu.AT_TARGET, xE = Pu.BUBBLING_PHASE;
class A4 {
  static create(t, n, r) {
    return new this(t, n, r);
  }
  type = "none";
  parentNode = null;
  target = null;
  currentTarget = null;
  data = null;
  eventPhase = zv;
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
function _d(e) {
  return (typeof e == "boolean" || !e) && (e = {
    capture: !!e
  }), e = { capture: !1, once: !1, ...e || {} }, e;
}
function vd(e, t) {
  var n = e._events[t], r;
  if (!n) return [];
  if (n.fn) return [n];
  for (var i = 0, s = n.length, r = new Array(s); i < s; i++)
    r[i] = n[i];
  return r;
}
class Ci {
  parent = null;
  _bubble_emitter = new Pe();
  _capture_emitter = new Pe();
  addEventListener(t, n, r) {
    r = _d(r);
    const i = r.capture ? this._capture_emitter : this._bubble_emitter;
    r && r.once ? i.once(t, n) : i.on(t, n);
  }
  removeEventListener(t, n, r) {
    r = _d(r), (r.capture ? this._capture_emitter : this._bubble_emitter).off(t, n);
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
        t.currentTarget = r[s], t.eventPhase = t.currentTarget !== this ? SE : dd;
        const u = vd(o, n);
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
          t.currentTarget = r[s], t.eventPhase = t.currentTarget !== this ? xE : dd;
          const u = vd(o, n);
          for (let f = 0, c = u.length; f < c; f++) {
            const l = u[f];
            if (l.once && o.removeListener(n, l.fn, l.context, l.once), l.fn(t), t.immediateCancelBubble)
              break;
          }
        }
        if (t.cancelBubble || !t.bubbles)
          break;
      }
    return t.eventPhase = zv, !t.defaultPrevented;
  }
  removeAllListeners() {
    this._bubble_emitter.removeAllListeners(), this._capture_emitter.removeAllListeners();
  }
}
Ci.prototype.on = Ci.prototype.addEventListener;
Ci.prototype.off = Ci.prototype.removeEventListener;
Ci.prototype.emit = Ci.prototype.dispatchEvent;
function O4(e) {
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
function gd(e, t, n, r, i, s) {
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
function Gs(e, t, n, r, i, s) {
  if (e[t]) {
    if (!r && !i) {
      e[t] = void 0, delete e[t];
      return;
    } else if (!r && i) {
      let o = e[n];
      if (!o || !o.has(i))
        return;
      o.get(i).forEach((u, f) => {
        Gs(e, t, n, f, void 0, s);
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
function TE(e, t, n, r, ...i) {
  if (!e[t])
    return;
  let o = e[t][r];
  if (o)
    for (let a = 0; a < o.length; a++) {
      const u = o[a];
      u.handle(...i), u.once && Gs(e, t, n, r, null, u.handle);
    }
}
function yd(e, t, n) {
  let r = e[t];
  return r ? r[n] || [] : [];
}
function RE(e, t, n) {
  e[t] = void 0, e[n] = void 0;
}
function PE(e, t, n) {
  let r = e[t];
  if (!r)
    return !1;
  let i = r[n];
  return i ? i.length > 0 : !1;
}
function NE(e) {
  if (!e._listeners)
    return [];
  let t = e._listeners;
  return Object.keys(t);
}
function $E(e, t, n, r, i) {
  i.target = e;
  const s = i.type, o = i.composedPath(e), a = o.length;
  for (let u = a - 1; u >= 0; u--) {
    const f = o[u];
    i.currentTarget = o[u], i.eventPhase = i.currentTarget !== e ? wi.CAPTURING_PHASE : wi.AT_TARGET;
    const c = yd(f, n, s);
    for (let l = 0, h = c.length; l < h; l++) {
      const d = c[l];
      if (d.once && Gs(e, n, r, s, null, d.handle), d.handle(i), i.immediateCancelBubble)
        break;
    }
    if (i.cancelBubble)
      break;
  }
  if (!i.cancelBubble)
    for (let u = 0; u < a; u++) {
      const f = o[u];
      i.currentTarget = o[u], i.eventPhase = i.currentTarget !== e ? wi.BUBBLING_PHASE : wi.AT_TARGET;
      const c = yd(f, t, s);
      for (let l = 0, h = c.length; l < h; l++) {
        const d = c[l];
        if (d.once && Gs(e, t, r, s, null, d.handle), d.handle(i), i.immediateCancelBubble)
          break;
      }
      if (i.cancelBubble || !i.bubbles)
        break;
    }
  return i.eventPhase = wi.NONE, !i.defaultPrevented;
}
const wi = {
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3
};
class Dl {
  static create(t, n) {
    return new Dl(t);
  }
  type;
  target = null;
  currentTarget = null;
  data = null;
  eventPhase = wi.NONE;
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
const gi = "_listeners", bd = "_listeners_capture", yi = "_listenersNs";
class E4 {
  parent;
  _listeners;
  _listenersNs;
  on(t, n, r) {
    return r && r.capture ? gd(this, bd, yi, t, n, r) : gd(this, gi, yi, t, n, r), this;
  }
  emit(t, ...n) {
    return TE(this, gi, yi, t, ...n), this;
  }
  createEvent(t, n) {
    return Dl.create(t, n);
  }
  emitBubble(t) {
    return $E(this, gi, bd, yi, t);
  }
  off(t, n, r) {
    return Gs(this, gi, yi, t, r ? r.namespace : null, n), this;
  }
  eventNames() {
    return NE(this);
  }
  hasEventListener(t) {
    return PE(this, gi, t);
  }
  removeAllListeners() {
    return RE(this, gi, yi), this;
  }
}
const Uv = (e) => !!Symbol[e], Cl = (e) => Uv(e) ? Symbol[e] : "@@" + e, ME = Cl("iterator"), xc = Cl("observable"), kv = Cl("species");
function Wa(e, t) {
  let n = e[t];
  if (n != null) {
    if (typeof n != "function")
      throw new TypeError(n + " is not a function");
    return n;
  }
}
function As(e) {
  let t = e.constructor;
  return t !== void 0 && (t = t[kv], t === null && (t = void 0)), t !== void 0 ? t : xe;
}
function IE(e) {
  return e instanceof xe;
}
function Li(e) {
  Li.log ? Li.log(e) : setTimeout(() => {
    throw e;
  });
}
function Ia(e) {
  Promise.resolve().then(() => {
    try {
      e();
    } catch (t) {
      Li(t);
    }
  });
}
function Vv(e) {
  let t = e._cleanup;
  if (t !== void 0 && (e._cleanup = void 0, !!t))
    try {
      if (typeof t == "function")
        t();
      else {
        let n = Wa(t, "unsubscribe");
        n && n.call(t);
      }
    } catch (n) {
      Li(n);
    }
}
function Tc(e) {
  e._observer = void 0, e._queue = void 0, e._state = "closed";
}
function DE(e) {
  let t = e._queue;
  if (t) {
    e._queue = void 0, e._state = "ready";
    for (let n = 0; n < t.length && (Wv(e, t[n].type, t[n].value), e._state !== "closed"); ++n)
      ;
  }
}
function Wv(e, t, n) {
  e._state = "running";
  let r = e._observer;
  try {
    let i = Wa(r, t);
    switch (t) {
      case "next":
        i && i.call(r, n);
        break;
      case "error":
        if (Tc(e), i) i.call(r, n);
        else throw n;
        break;
      case "complete":
        Tc(e), i && i.call(r);
        break;
    }
  } catch (i) {
    Li(i);
  }
  e._state === "closed" ? Vv(e) : e._state === "running" && (e._state = "ready");
}
function Xf(e, t, n) {
  if (e._state !== "closed") {
    if (e._state === "buffering") {
      e._queue.push({ type: t, value: n });
      return;
    }
    if (e._state !== "ready") {
      e._state = "buffering", e._queue = [{ type: t, value: n }], Ia(() => DE(e));
      return;
    }
    Wv(e, t, n);
  }
}
class CE {
  constructor(t, n) {
    this._cleanup = void 0, this._observer = t, this._queue = void 0, this._state = "initializing";
    let r = this, i = {
      get closed() {
        return r._state === "closed";
      },
      next(s) {
        Xf(r, "next", s);
      },
      error(s) {
        Xf(r, "error", s);
      },
      complete() {
        Xf(r, "complete");
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
    this._state !== "closed" && (Tc(this), Vv(this));
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
    }), new CE(t, this._subscriber);
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
    let n = As(this);
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
    let n = As(this);
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
    let n = As(this), r = arguments.length > 1, i = !1, o = arguments[1];
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
    let n = As(this);
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
    let n = As(this);
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
  [xc]() {
    return this;
  }
  static from(t) {
    let n = typeof this == "function" ? this : xe;
    if (t == null)
      throw new TypeError(t + " is not an object");
    let r = Wa(t, xc);
    if (r) {
      let i = r.call(t);
      if (Object(i) !== i)
        throw new TypeError(i + " is not an object");
      return IE(i) && i.constructor === n ? i : new n((s) => i.subscribe(s));
    }
    if (Uv("iterator") && (r = Wa(t, ME), r))
      return new n((i) => {
        Ia(() => {
          if (!i.closed) {
            for (let s of r.call(t))
              if (i.next(s), i.closed) return;
            i.complete();
          }
        });
      });
    if (Array.isArray(t))
      return new n((i) => {
        Ia(() => {
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
      Ia(() => {
        if (!r.closed) {
          for (let i = 0; i < t.length; ++i)
            if (r.next(t[i]), r.closed) return;
          r.complete();
        }
      });
    });
  }
  static get [kv]() {
    return this;
  }
}
Object.defineProperty(xe, Symbol("extensions"), {
  value: {
    symbol: xc,
    hostReportError: Li
  },
  configurable: !0
});
function LE(...e) {
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
function jE(...e) {
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
function FE(...e) {
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
const S4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Observable: xe,
  combineLatest: jE,
  merge: LE,
  zip: FE
}, Symbol.toStringTag, { value: "Module" }));
function x4() {
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
class T4 {
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
class R4 {
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
const qv = (e) => !!e && e.constructor === Symbol, Hs = Array.isArray, Ll = (e) => !!e && e.constructor === Object, Gv = (e) => e == null || typeof e != "object" && typeof e != "function", xo = (e) => !!(e && e.constructor && e.call && e.apply), BE = (e) => typeof e == "string" || e instanceof String, zE = (e) => Ti(e) && e % 1 === 0, UE = (e) => Ti(e) && e % 1 !== 0, Ti = (e) => {
  try {
    return Number(e) === e;
  } catch {
    return !1;
  }
}, Hv = (e) => Object.prototype.toString.call(e) === "[object Date]", Kv = (e) => !(!e || !e.then || !xo(e.then)), kE = (e) => {
  if (e === !0 || e === !1 || e == null) return !0;
  if (Ti(e)) return e === 0;
  if (Hv(e)) return isNaN(e.getTime());
  if (xo(e) || qv(e)) return !1;
  const t = e.length;
  if (Ti(t)) return t === 0;
  const n = e.size;
  return Ti(n) ? n === 0 : Object.keys(e).length === 0;
}, Yv = (e, t) => {
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
    if (!Reflect.has(t, n[i]) || !Yv(e[n[i]], t[n[i]])) return !1;
  return !0;
}, VE = (e, t) => e.reduce((n, r) => {
  const i = t(r);
  return n[i] || (n[i] = []), n[i].push(r), n;
}, {});
function WE(...e) {
  return !e || !e.length ? [] : new Array(Math.max(...e.map(({ length: t }) => t))).fill([]).map((t, n) => e.map((r) => r[n]));
}
function qE(e, t) {
  if (!e || !e.length)
    return {};
  const n = xo(t) ? t : Hs(t) ? (r, i) => t[i] : (r, i) => t;
  return e.reduce((r, i, s) => (r[i] = n(i, s), r), {});
}
const jl = (e, t) => !e || (e.length ?? 0) === 0 ? null : e.reduce(t);
function GE(e, t) {
  return (e || []).reduce((n, r) => n + (t ? t(r) : r), 0);
}
const HE = (e, t = void 0) => e?.length > 0 ? e[0] : t, KE = (e, t = void 0) => e?.length > 0 ? e[e.length - 1] : t, Xv = (e, t, n = !1) => {
  if (!e) return [];
  const r = (s, o) => t(s) - t(o), i = (s, o) => t(o) - t(s);
  return e.slice().sort(n === !0 ? i : r);
}, YE = (e, t, n = "asc") => {
  if (!e) return [];
  const r = (s, o) => `${t(s)}`.localeCompare(t(o)), i = (s, o) => `${t(o)}`.localeCompare(t(s));
  return e.slice().sort(n === "desc" ? i : r);
}, XE = (e, t) => e ? e.reduce((n, r) => {
  const i = t(r);
  return n[i] = (n[i] ?? 0) + 1, n;
}, {}) : {}, JE = (e, t, n) => {
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
}, Jv = (e, t, n = (r) => r) => e.reduce((r, i) => (r[t(i)] = n(i), r), {}), ZE = (e, t, n) => e ? e.reduce((r, i, s) => (n(i, s) && r.push(t(i, s)), r), []) : [];
function QE(e, t) {
  const n = t ?? ((r) => r);
  return jl(e, (r, i) => n(r) > n(i) ? r : i);
}
function eS(e, t) {
  const n = t ?? ((r) => r);
  return jl(e, (r, i) => n(r) < n(i) ? r : i);
}
const tS = (e, t = 2) => {
  const n = Math.ceil(e.length / t);
  return new Array(n).fill(null).map((r, i) => e.slice(i * t, i * t + t));
}, nS = (e, t) => {
  const n = e.reduce((r, i) => {
    const s = t ? t(i) : i;
    return r[s] || (r[s] = i), r;
  }, {});
  return Object.values(n);
};
function* Fl(e, t, n = (i) => i, r = 1) {
  const i = xo(n) ? n : () => n, s = t ? e : 0, o = t ?? e;
  for (let a = s; a <= o && (yield i(a), !(a + r > o)); a += r)
    ;
}
const Bl = (e, t, n, r) => Array.from(Fl(e, t, n, r)), rS = (e) => e.reduce((t, n) => (t.push(...n), t), []), iS = (e, t, n) => {
  if (!e || !t) return !1;
  const r = n ?? ((s) => s), i = t.reduce((s, o) => (s[r(o)] = !0, s), {});
  return e.some((s) => i[r(s)]);
}, Zv = (e, t) => e ? e.reduce(
  (n, r) => {
    const [i, s] = n;
    return t(r) ? [[...i, r], s] : [i, [...s, r]];
  },
  [[], []]
) : [[], []], sS = (e, t, n) => !t && !e ? [] : t ? e ? n ? e.reduce((r, i) => {
  const s = t.find((o) => n(i) === n(o));
  return s ? r.push(s) : r.push(i), r;
}, []) : e : [] : e, oS = (e, t, n) => {
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
}, aS = (e, t, n, r) => {
  if (!e && !t) return [];
  if (!e) return [t];
  if (!t) return [...e];
  const i = n ? (a, u) => n(a, u) === n(t, u) : (a) => a === t;
  return e.find(i) ? e.filter((a, u) => !i(a, u)) : (r?.strategy ?? "append") === "append" ? [...e, t] : [t, ...e];
}, uS = (e) => e?.filter((t) => !!t) ?? [], Qv = (e, t, n) => {
  let r = n;
  for (let i = 1; i <= e; i++)
    r = t(r, i);
  return r;
}, fS = (e, t, n = (r) => r) => {
  if (!e?.length && !t?.length) return [];
  if (e?.length === void 0) return [...t];
  if (!t?.length) return [...e];
  const r = t.reduce((i, s) => (i[n(s)] = !0, i), {});
  return e.filter((i) => !r[n(i)]);
};
function cS(e, t) {
  if (e.length === 0) return e;
  const n = t % e.length;
  return n === 0 ? e : [...e.slice(-n, e.length), ...e.slice(0, -n)];
}
const lS = async (e, t, n) => {
  const r = n !== void 0;
  if (!r && e?.length < 1)
    throw new Error("Cannot reduce empty array with no init value");
  const i = r ? e : e.slice(1);
  let s = r ? n : e[0];
  for (const [o, a] of i.entries())
    s = await t(s, a, o);
  return s;
}, hS = async (e, t) => {
  if (!e) return [];
  let n = [], r = 0;
  for (const i of e) {
    const s = await t(i, r++);
    n.push(s);
  }
  return n;
}, pS = async (e) => {
  const t = [], n = (s, o) => t.push({
    fn: s,
    rethrow: o?.rethrow ?? !1
  }), [r, i] = await ji(e)(n);
  for (const { fn: s, rethrow: o } of t) {
    const [a] = await ji(s)(r);
    if (a && o) throw a;
  }
  if (r) throw r;
  return i;
};
class eg extends Error {
  errors;
  constructor(t = []) {
    super();
    const n = t.find((r) => r.name)?.name ?? "";
    this.name = `AggregateError(${n}...)`, this.message = `AggregateError with ${t.length} errors`, this.stack = t.find((r) => r.stack)?.stack ?? this.stack, this.errors = t;
  }
}
const dS = async (e, t, n) => {
  const r = t.map((f, c) => ({
    index: c,
    item: f
  })), i = async (f) => {
    const c = [];
    for (; ; ) {
      const l = r.pop();
      if (!l) return f(c);
      const [h, d] = await ji(n)(l.item);
      c.push({
        error: h,
        result: d,
        index: l.index
      });
    }
  }, s = Bl(1, e).map(() => new Promise(i)), o = await Promise.all(s), [a, u] = Zv(
    Xv(o.flat(), (f) => f.index),
    (f) => !!f.error
  );
  if (a.length > 0)
    throw new eg(a.map((f) => f.error));
  return u.map((f) => f.result);
};
async function _S(e) {
  const t = Hs(e) ? e.map((i) => [null, i]) : Object.entries(e), n = await Promise.all(
    t.map(
      ([i, s]) => s.then((o) => ({ result: o, exc: null, key: i })).catch((o) => ({ result: null, exc: o, key: i }))
    )
  ), r = n.filter((i) => i.exc);
  if (r.length > 0)
    throw new eg(r.map((i) => i.exc));
  return Hs(e) ? n.map((i) => i.result) : n.reduce(
    (i, s) => ({
      ...i,
      [s.key]: s.result
    }),
    {}
  );
}
const vS = async (e, t) => {
  const n = e?.times ?? 3, r = e?.delay, i = e?.backoff ?? null;
  for (const s of Fl(1, n)) {
    const [o, a] = await ji(t)((u) => {
      throw { _exited: u };
    });
    if (!o) return a;
    if (o._exited) throw o._exited;
    if (s === n) throw o;
    r && await Rc(r), i && await Rc(i(s));
  }
}, Rc = (e) => new Promise((t) => setTimeout(t, e)), ji = (e) => (...t) => {
  try {
    const n = e(...t);
    return Kv(n) ? n.then((r) => [void 0, r]).catch((r) => [r, void 0]) : [void 0, n];
  } catch (n) {
    return [n, void 0];
  }
}, gS = (e, t) => {
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
function yS(...e) {
  return (...t) => e.slice(1).reduce((n, r) => r(n), e[0](...t));
}
function bS(...e) {
  return e.reverse().reduce((t, n) => n(t));
}
const mS = (e, ...t) => (...n) => e(...t, ...n), wS = (e, t) => (n) => e({
  ...t,
  ...n
}), AS = (e) => new Proxy(
  {},
  {
    get: (t, n) => e(n)
  }
), OS = (e, t, n, r) => function(...s) {
  const o = n ? n(...s) : JSON.stringify({ args: s }), a = e[o];
  if (a !== void 0 && (!a.exp || a.exp > (/* @__PURE__ */ new Date()).getTime()))
    return a.value;
  const u = t(...s);
  return e[o] = {
    exp: r ? (/* @__PURE__ */ new Date()).getTime() + r : null,
    value: u
  }, u;
}, ES = (e, t = {}) => OS({}, e, t.key ?? null, t.ttl ?? null), SS = ({ delay: e }, t) => {
  let n, r = !0;
  const i = (...s) => {
    r ? (clearTimeout(n), n = setTimeout(() => {
      r && t(...s), n = void 0;
    }, e)) : t(...s);
  };
  return i.isPending = () => n !== void 0, i.cancel = () => {
    r = !1;
  }, i.flush = (...s) => t(...s), i;
}, xS = ({ interval: e }, t) => {
  let n = !0, r;
  const i = (...s) => {
    n && (t(...s), n = !1, r = setTimeout(() => {
      n = !0, r = void 0;
    }, e));
  };
  return i.isThrottled = () => r !== void 0, i;
}, TS = (e, t) => {
  const n = () => {
  };
  return new Proxy(Object.assign(n, e), {
    get: (r, i) => r[i],
    set: (r, i, s) => (r[i] = s, !0),
    apply: (r, i, s) => t(Object.assign({}, r))(...s)
  });
};
function RS(e, t, n) {
  return typeof e == "number" && typeof t == "number" && (typeof n > "u" || typeof n == "number") ? (typeof n > "u" && (n = t, t = 0), e >= Math.min(t, n) && e < Math.max(t, n)) : !1;
}
const PS = (e, t) => {
  const n = t === void 0 ? 0 : t;
  if (e == null)
    return n;
  const r = parseFloat(e);
  return isNaN(r) ? n : r;
}, tg = (e, t) => {
  const n = t === void 0 ? 0 : t;
  if (e == null)
    return n;
  const r = parseInt(e);
  return isNaN(r) ? n : r;
}, NS = (e, t = (n) => n === void 0) => e ? Object.keys(e).reduce((r, i) => (t(e[i]) || (r[i] = e[i]), r), {}) : {}, zl = (e, t) => Object.keys(e).reduce((r, i) => (r[t(i, e[i])] = e[i], r), {}), $S = (e, t) => Object.keys(e).reduce((r, i) => (r[i] = t(e[i], i), r), {}), MS = (e, t) => e ? Object.entries(e).reduce((n, [r, i]) => {
  const [s, o] = t(r, i);
  return n[s] = o, n;
}, {}) : {}, IS = (e) => e ? Object.keys(e).reduce((n, r) => (n[e[r]] = r, n), {}) : {}, DS = (e) => zl(e, (t) => t.toLowerCase()), CS = (e) => zl(e, (t) => t.toUpperCase()), ng = (e) => {
  if (Gv(e))
    return e;
  if (typeof e == "function")
    return e.bind({});
  const t = new e.constructor();
  return Object.getOwnPropertyNames(e).forEach((n) => {
    t[n] = e[n];
  }), t;
}, LS = (e, t) => {
  if (!e) return [];
  const n = Object.entries(e);
  return n.length === 0 ? [] : n.reduce((r, i) => (r.push(t(i[0], i[1])), r), []);
}, jS = (e, t) => e ? t.reduce((n, r) => (Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r]), n), {}) : {}, FS = (e, t) => e ? !t || t.length === 0 ? e : t.reduce(
  (n, r) => (delete n[r], n),
  { ...e }
) : {}, rg = (e, t, n) => {
  const r = t.split(/[\.\[\]]/g);
  let i = e;
  for (const s of r) {
    if (i === null || i === void 0) return n;
    const o = s.replace(/['"]/g, "");
    o.trim() !== "" && (i = i[o]);
  }
  return i === void 0 ? n : i;
}, ig = (e, t, n) => {
  if (!e) return {};
  if (!t || n === void 0) return e;
  const r = t.split(/[\.\[\]]/g).filter((o) => !!o.trim()), i = (o) => {
    if (r.length > 1) {
      const a = r.shift(), u = tg(r[0], null) !== null;
      o[a] = o[a] === void 0 ? u ? [] : {} : o[a], i(o[a]);
    } else
      o[r[0]] = n;
  }, s = ng(e);
  return i(s), s;
}, sg = (e, t) => !e || !t ? e ?? t ?? {} : Object.entries({ ...e, ...t }).reduce(
  (n, [r, i]) => ({
    ...n,
    [r]: Ll(e[r]) ? sg(e[r], i) : i
  }),
  {}
), og = (e) => {
  if (!e) return [];
  const t = (n, r) => Ll(n) ? Object.entries(n).flatMap(
    ([i, s]) => t(s, [...r, i])
  ) : Hs(n) ? n.flatMap((i, s) => t(i, [...r, `${s}`])) : [r.join(".")];
  return t(e, []);
}, BS = (e) => e ? Jv(
  og(e),
  (t) => t,
  (t) => rg(e, t)
) : {}, zS = (e) => e ? Object.keys(e).reduce((t, n) => ig(t, n, e[n]), {}) : {}, Ul = (e, t) => Math.floor(Math.random() * (t - e + 1) + e), US = (e) => {
  const t = e.length;
  if (t === 0)
    return null;
  const n = Ul(0, t - 1);
  return e[n];
}, kS = (e) => e.map((t) => ({ rand: Math.random(), value: t })).sort((t, n) => t.rand - n.rand).map((t) => t.value), VS = (e, t = "") => {
  const n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" + t;
  return Qv(
    e,
    (r) => r + n.charAt(Ul(0, n.length - 1)),
    ""
  );
}, WS = (e, t = (n) => `${n}`) => {
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
      return Bl(0, _ - 1).reduce(
        (v) => h > 0 ? u(v) : f(v),
        l
      );
    }
  };
}, To = (e) => {
  if (!e || e.length === 0) return "";
  const t = e.toLowerCase();
  return t.substring(0, 1).toUpperCase() + t.substring(1, t.length);
}, qS = (e) => {
  const t = e?.replace(/([A-Z])+/g, To)?.split(/(?=[A-Z])|[\.\-\s_]/).map((n) => n.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.length === 1 ? t[0] : t.reduce((n, r) => `${n}${r.charAt(0).toUpperCase()}${r.slice(1)}`);
}, GS = (e, t) => {
  const n = e?.replace(/([A-Z])+/g, To).split(/(?=[A-Z])|[\.\-\s_]/).map((i) => i.toLowerCase()) ?? [];
  if (n.length === 0) return "";
  if (n.length === 1) return n[0];
  const r = n.reduce((i, s) => `${i}_${s.toLowerCase()}`);
  return t?.splitOnNumber === !1 ? r : r.replace(/([A-Za-z]{1}[0-9]{1})/, (i) => `${i[0]}_${i[1]}`);
}, HS = (e) => {
  const t = e?.replace(/([A-Z])+/g, To)?.split(/(?=[A-Z])|[\.\-\s_]/).map((n) => n.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.length === 1 ? t[0] : t.reduce((n, r) => `${n}-${r.toLowerCase()}`);
}, KS = (e) => {
  const t = e?.split(/[\.\-\s_]/).map((n) => n.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join("");
}, YS = (e) => e ? e.split(/(?=[A-Z])|[\.\-\s_]/).map((t) => t.trim()).filter((t) => !!t).map((t) => To(t.toLowerCase())).join(" ") : "", XS = (e, t, n = /\{\{(.+?)\}\}/g) => Array.from(e.matchAll(n)).reduce((r, i) => r.replace(i[0], t[i[1]]), e), JS = (e, t = " ") => {
  if (!e) return "";
  const n = t.replace(/[\W]{1}/g, "\\$&"), r = new RegExp(`^[${n}]+|[${n}]+$`, "g");
  return e.replace(r, "");
}, P4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  all: _S,
  alphabetical: YE,
  assign: sg,
  boil: jl,
  callable: TS,
  camel: qS,
  capitalize: To,
  chain: yS,
  clone: ng,
  cluster: tS,
  compose: bS,
  construct: zS,
  counting: XE,
  crush: BS,
  dash: HS,
  debounce: SS,
  defer: pS,
  diff: fS,
  draw: US,
  first: HE,
  flat: rS,
  fork: Zv,
  get: rg,
  group: VE,
  guard: gS,
  inRange: RS,
  intersects: iS,
  invert: IS,
  isArray: Hs,
  isDate: Hv,
  isEmpty: kE,
  isEqual: Yv,
  isFloat: UE,
  isFunction: xo,
  isInt: zE,
  isNumber: Ti,
  isObject: Ll,
  isPrimitive: Gv,
  isPromise: Kv,
  isString: BE,
  isSymbol: qv,
  iterate: Qv,
  keys: og,
  last: KE,
  list: Bl,
  listify: LS,
  lowerize: DS,
  map: hS,
  mapEntries: MS,
  mapKeys: zl,
  mapValues: $S,
  max: QE,
  memo: ES,
  merge: sS,
  min: eS,
  objectify: Jv,
  omit: FS,
  parallel: dS,
  partial: mS,
  partob: wS,
  pascal: KS,
  pick: jS,
  proxied: AS,
  random: Ul,
  range: Fl,
  reduce: lS,
  replace: JE,
  replaceOrAppend: oS,
  retry: vS,
  select: ZE,
  series: WS,
  set: ig,
  shake: NS,
  shift: cS,
  shuffle: kS,
  sift: uS,
  sleep: Rc,
  snake: GS,
  sort: Xv,
  sum: GE,
  template: XS,
  throttle: xS,
  title: YS,
  toFloat: PS,
  toInt: tg,
  toggle: aS,
  trim: JS,
  try: ji,
  tryit: ji,
  uid: VS,
  unique: nS,
  upperize: CS,
  zip: WE,
  zipToObject: qE
}, Symbol.toStringTag, { value: "Module" }));
var ag = typeof global == "object" && global && global.Object === Object && global, ZS = typeof self == "object" && self && self.Object === Object && self, Se = ag || ZS || Function("return this")(), Ce = Se.Symbol, ug = Object.prototype, QS = ug.hasOwnProperty, ex = ug.toString, Os = Ce ? Ce.toStringTag : void 0;
function tx(e) {
  var t = QS.call(e, Os), n = e[Os];
  try {
    e[Os] = void 0;
    var r = !0;
  } catch {
  }
  var i = ex.call(e);
  return r && (t ? e[Os] = n : delete e[Os]), i;
}
var nx = Object.prototype, rx = nx.toString;
function ix(e) {
  return rx.call(e);
}
var sx = "[object Null]", ox = "[object Undefined]", md = Ce ? Ce.toStringTag : void 0;
function He(e) {
  return e == null ? e === void 0 ? ox : sx : md && md in Object(e) ? tx(e) : ix(e);
}
function oe(e) {
  return e != null && typeof e == "object";
}
var ax = "[object Symbol]";
function st(e) {
  return typeof e == "symbol" || oe(e) && He(e) == ax;
}
var ux = NaN;
function wd(e) {
  return typeof e == "number" ? e : st(e) ? ux : +e;
}
function ie(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length, i = Array(r); ++n < r; )
    i[n] = t(e[n], n, e);
  return i;
}
var M = Array.isArray, Ad = Ce ? Ce.prototype : void 0, Od = Ad ? Ad.toString : void 0;
function wt(e) {
  if (typeof e == "string")
    return e;
  if (M(e))
    return ie(e, wt) + "";
  if (st(e))
    return Od ? Od.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function Nu(e, t) {
  return function(n, r) {
    var i;
    if (n === void 0 && r === void 0)
      return t;
    if (n !== void 0 && (i = n), r !== void 0) {
      if (i === void 0)
        return r;
      typeof n == "string" || typeof r == "string" ? (n = wt(n), r = wt(r)) : (n = wd(n), r = wd(r)), i = e(n, r);
    }
    return i;
  };
}
var fg = Nu(function(e, t) {
  return e + t;
}, 0), fx = /\s/;
function cg(e) {
  for (var t = e.length; t-- && fx.test(e.charAt(t)); )
    ;
  return t;
}
var cx = /^\s+/;
function lg(e) {
  return e && e.slice(0, cg(e) + 1).replace(cx, "");
}
function se(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var Ed = NaN, lx = /^[-+]0x[0-9a-f]+$/i, hx = /^0b[01]+$/i, px = /^0o[0-7]+$/i, dx = parseInt;
function vt(e) {
  if (typeof e == "number")
    return e;
  if (st(e))
    return Ed;
  if (se(e)) {
    var t = typeof e.valueOf == "function" ? e.valueOf() : e;
    e = se(t) ? t + "" : t;
  }
  if (typeof e != "string")
    return e === 0 ? e : +e;
  e = lg(e);
  var n = hx.test(e);
  return n || px.test(e) ? dx(e.slice(2), n ? 2 : 8) : lx.test(e) ? Ed : +e;
}
var Sd = 1 / 0, _x = 17976931348623157e292;
function vn(e) {
  if (!e)
    return e === 0 ? e : 0;
  if (e = vt(e), e === Sd || e === -Sd) {
    var t = e < 0 ? -1 : 1;
    return t * _x;
  }
  return e === e ? e : 0;
}
function I(e) {
  var t = vn(e), n = t % 1;
  return t === t ? n ? t - n : t : 0;
}
var vx = "Expected a function";
function hg(e, t) {
  if (typeof t != "function")
    throw new TypeError(vx);
  return e = I(e), function() {
    if (--e < 1)
      return t.apply(this, arguments);
  };
}
function Ke(e) {
  return e;
}
var gx = "[object AsyncFunction]", yx = "[object Function]", bx = "[object GeneratorFunction]", mx = "[object Proxy]";
function En(e) {
  if (!se(e))
    return !1;
  var t = He(e);
  return t == yx || t == bx || t == gx || t == mx;
}
var Da = Se["__core-js_shared__"], xd = function() {
  var e = /[^.]+$/.exec(Da && Da.keys && Da.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}();
function wx(e) {
  return !!xd && xd in e;
}
var Ax = Function.prototype, Ox = Ax.toString;
function ni(e) {
  if (e != null) {
    try {
      return Ox.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
var Ex = /[\\^$.*+?()[\]{}|]/g, Sx = /^\[object .+?Constructor\]$/, xx = Function.prototype, Tx = Object.prototype, Rx = xx.toString, Px = Tx.hasOwnProperty, Nx = RegExp(
  "^" + Rx.call(Px).replace(Ex, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function pg(e) {
  if (!se(e) || wx(e))
    return !1;
  var t = En(e) ? Nx : Sx;
  return t.test(ni(e));
}
function $x(e, t) {
  return e?.[t];
}
function ri(e, t) {
  var n = $x(e, t);
  return pg(n) ? n : void 0;
}
var Ks = ri(Se, "WeakMap"), qa = Ks && new Ks(), dg = qa ? function(e, t) {
  return qa.set(e, t), e;
} : Ke, Td = Object.create, es = /* @__PURE__ */ function() {
  function e() {
  }
  return function(t) {
    if (!se(t))
      return {};
    if (Td)
      return Td(t);
    e.prototype = t;
    var n = new e();
    return e.prototype = void 0, n;
  };
}();
function Ys(e) {
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
    var n = es(e.prototype), r = e.apply(n, t);
    return se(r) ? r : n;
  };
}
var Mx = 1;
function Ix(e, t, n) {
  var r = t & Mx, i = Ys(e);
  function s() {
    var o = this && this !== Se && this instanceof s ? i : e;
    return o.apply(r ? n : this, arguments);
  }
  return s;
}
function At(e, t, n) {
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
var Dx = Math.max;
function _g(e, t, n, r) {
  for (var i = -1, s = e.length, o = n.length, a = -1, u = t.length, f = Dx(s - o, 0), c = Array(u + f), l = !r; ++a < u; )
    c[a] = t[a];
  for (; ++i < o; )
    (l || i < s) && (c[n[i]] = e[i]);
  for (; f--; )
    c[a++] = e[i++];
  return c;
}
var Cx = Math.max;
function vg(e, t, n, r) {
  for (var i = -1, s = e.length, o = -1, a = n.length, u = -1, f = t.length, c = Cx(s - a, 0), l = Array(c + f), h = !r; ++i < c; )
    l[i] = e[i];
  for (var d = i; ++u < f; )
    l[d + u] = t[u];
  for (; ++o < a; )
    (h || i < s) && (l[d + n[o]] = e[i++]);
  return l;
}
function Lx(e, t) {
  for (var n = e.length, r = 0; n--; )
    e[n] === t && ++r;
  return r;
}
function $u() {
}
var jx = 4294967295;
function C(e) {
  this.__wrapped__ = e, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = jx, this.__views__ = [];
}
C.prototype = es($u.prototype);
C.prototype.constructor = C;
function Mu() {
}
var kl = qa ? function(e) {
  return qa.get(e);
} : Mu, Ri = {}, Fx = Object.prototype, Bx = Fx.hasOwnProperty;
function Ca(e) {
  for (var t = e.name + "", n = Ri[t], r = Bx.call(Ri, t) ? n.length : 0; r--; ) {
    var i = n[r], s = i.func;
    if (s == null || s == e)
      return i.name;
  }
  return t;
}
function Bt(e, t) {
  this.__wrapped__ = e, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = void 0;
}
Bt.prototype = es($u.prototype);
Bt.prototype.constructor = Bt;
function rt(e, t) {
  var n = -1, r = e.length;
  for (t || (t = Array(r)); ++n < r; )
    t[n] = e[n];
  return t;
}
function gg(e) {
  if (e instanceof C)
    return e.clone();
  var t = new Bt(e.__wrapped__, e.__chain__);
  return t.__actions__ = rt(e.__actions__), t.__index__ = e.__index__, t.__values__ = e.__values__, t;
}
var zx = Object.prototype, Ux = zx.hasOwnProperty;
function p(e) {
  if (oe(e) && !M(e) && !(e instanceof C)) {
    if (e instanceof Bt)
      return e;
    if (Ux.call(e, "__wrapped__"))
      return gg(e);
  }
  return new Bt(e);
}
p.prototype = $u.prototype;
p.prototype.constructor = p;
function Pc(e) {
  var t = Ca(e), n = p[t];
  if (typeof n != "function" || !(t in C.prototype))
    return !1;
  if (e === n)
    return !0;
  var r = kl(n);
  return !!r && e === r[0];
}
var kx = 800, Vx = 16, Wx = Date.now;
function yg(e) {
  var t = 0, n = 0;
  return function() {
    var r = Wx(), i = Vx - (r - n);
    if (n = r, i > 0) {
      if (++t >= kx)
        return arguments[0];
    } else
      t = 0;
    return e.apply(void 0, arguments);
  };
}
var bg = yg(dg), qx = /\{\n\/\* \[wrapped with (.+)\] \*/, Gx = /,? & /;
function Hx(e) {
  var t = e.match(qx);
  return t ? t[1].split(Gx) : [];
}
var Kx = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
function Yx(e, t) {
  var n = t.length;
  if (!n)
    return e;
  var r = n - 1;
  return t[r] = (n > 1 ? "& " : "") + t[r], t = t.join(n > 2 ? ", " : " "), e.replace(Kx, `{
/* [wrapped with ` + t + `] */
`);
}
function Iu(e) {
  return function() {
    return e;
  };
}
var Ga = function() {
  try {
    var e = ri(Object, "defineProperty");
    return e({}, "", {}), e;
  } catch {
  }
}(), Xx = Ga ? function(e, t) {
  return Ga(e, "toString", {
    configurable: !0,
    enumerable: !1,
    value: Iu(t),
    writable: !0
  });
} : Ke, Vl = yg(Xx);
function Vt(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r && t(e[n], n, e) !== !1; )
    ;
  return e;
}
function Du(e, t, n, r) {
  for (var i = e.length, s = n + (r ? 1 : -1); r ? s-- : ++s < i; )
    if (t(e[s], s, e))
      return s;
  return -1;
}
function mg(e) {
  return e !== e;
}
function Jx(e, t, n) {
  for (var r = n - 1, i = e.length; ++r < i; )
    if (e[r] === t)
      return r;
  return -1;
}
function ts(e, t, n) {
  return t === t ? Jx(e, t, n) : Du(e, mg, n);
}
function Cu(e, t) {
  var n = e == null ? 0 : e.length;
  return !!n && ts(e, t, 0) > -1;
}
var Zx = 1, Qx = 2, eT = 8, tT = 16, nT = 32, rT = 64, iT = 128, sT = 256, oT = 512, aT = [
  ["ary", iT],
  ["bind", Zx],
  ["bindKey", Qx],
  ["curry", eT],
  ["curryRight", tT],
  ["flip", oT],
  ["partial", nT],
  ["partialRight", rT],
  ["rearg", sT]
];
function uT(e, t) {
  return Vt(aT, function(n) {
    var r = "_." + n[0];
    t & n[1] && !Cu(e, r) && e.push(r);
  }), e.sort();
}
function wg(e, t, n) {
  var r = t + "";
  return Vl(e, Yx(r, uT(Hx(r), n)));
}
var fT = 4, cT = 8, Rd = 32, Pd = 64;
function Ag(e, t, n, r, i, s, o, a, u, f) {
  var c = t & cT, l = c ? o : void 0, h = c ? void 0 : o, d = c ? s : void 0, _ = c ? void 0 : s;
  t |= c ? Rd : Pd, t &= ~(c ? Pd : Rd), t & fT || (t &= -4);
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
  return Pc(e) && bg(g, v), g.placeholder = r, wg(g, e, t);
}
function ns(e) {
  var t = e;
  return t.placeholder;
}
var lT = 9007199254740991, hT = /^(?:0|[1-9]\d*)$/;
function Yn(e, t) {
  var n = typeof e;
  return t = t ?? lT, !!t && (n == "number" || n != "symbol" && hT.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
var pT = Math.min;
function dT(e, t) {
  for (var n = e.length, r = pT(t.length, n), i = rt(e); r--; ) {
    var s = t[r];
    e[r] = Yn(s, n) ? i[s] : void 0;
  }
  return e;
}
var Nd = "__lodash_placeholder__";
function lr(e, t) {
  for (var n = -1, r = e.length, i = 0, s = []; ++n < r; ) {
    var o = e[n];
    (o === t || o === Nd) && (e[n] = Nd, s[i++] = n);
  }
  return s;
}
var _T = 1, vT = 2, gT = 8, yT = 16, bT = 128, mT = 512;
function Lu(e, t, n, r, i, s, o, a, u, f) {
  var c = t & bT, l = t & _T, h = t & vT, d = t & (gT | yT), _ = t & mT, v = h ? void 0 : Ys(e);
  function g() {
    for (var y = arguments.length, b = Array(y), w = y; w--; )
      b[w] = arguments[w];
    if (d)
      var m = ns(g), A = Lx(b, m);
    if (r && (b = _g(b, r, i, d)), s && (b = vg(b, s, o, d)), y -= A, d && y < f) {
      var S = lr(b, m);
      return Ag(
        e,
        t,
        Lu,
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
    return y = b.length, a ? b = dT(b, a) : _ && y > 1 && b.reverse(), c && u < y && (b.length = u), this && this !== Se && this instanceof g && (B = v || Ys(B)), B.apply(R, b);
  }
  return g;
}
function wT(e, t, n) {
  var r = Ys(e);
  function i() {
    for (var s = arguments.length, o = Array(s), a = s, u = ns(i); a--; )
      o[a] = arguments[a];
    var f = s < 3 && o[0] !== u && o[s - 1] !== u ? [] : lr(o, u);
    if (s -= f.length, s < n)
      return Ag(
        e,
        t,
        Lu,
        i.placeholder,
        void 0,
        o,
        f,
        void 0,
        void 0,
        n - s
      );
    var c = this && this !== Se && this instanceof i ? r : e;
    return At(c, this, o);
  }
  return i;
}
var AT = 1;
function OT(e, t, n, r) {
  var i = t & AT, s = Ys(e);
  function o() {
    for (var a = -1, u = arguments.length, f = -1, c = r.length, l = Array(c + u), h = this && this !== Se && this instanceof o ? s : e; ++f < c; )
      l[f] = r[f];
    for (; u--; )
      l[f++] = arguments[++a];
    return At(h, i ? n : this, l);
  }
  return o;
}
var $d = "__lodash_placeholder__", Jf = 1, ET = 2, ST = 4, Md = 8, Es = 128, Id = 256, xT = Math.min;
function TT(e, t) {
  var n = e[1], r = t[1], i = n | r, s = i < (Jf | ET | Es), o = r == Es && n == Md || r == Es && n == Id && e[7].length <= t[8] || r == (Es | Id) && t[7].length <= t[8] && n == Md;
  if (!(s || o))
    return e;
  r & Jf && (e[2] = t[2], i |= n & Jf ? 0 : ST);
  var a = t[3];
  if (a) {
    var u = e[3];
    e[3] = u ? _g(u, a, t[4]) : a, e[4] = u ? lr(e[3], $d) : t[4];
  }
  return a = t[5], a && (u = e[5], e[5] = u ? vg(u, a, t[6]) : a, e[6] = u ? lr(e[5], $d) : t[6]), a = t[7], a && (e[7] = a), r & Es && (e[8] = e[8] == null ? t[8] : xT(e[8], t[8])), e[9] == null && (e[9] = t[9]), e[0] = t[0], e[1] = i, e;
}
var RT = "Expected a function", Dd = 1, PT = 2, Cd = 8, Ld = 16, jd = 32, NT = 64, Fd = Math.max;
function Xn(e, t, n, r, i, s, o, a) {
  var u = t & PT;
  if (!u && typeof e != "function")
    throw new TypeError(RT);
  var f = r ? r.length : 0;
  if (f || (t &= -97, r = i = void 0), o = o === void 0 ? o : Fd(I(o), 0), a = a === void 0 ? a : I(a), f -= i ? i.length : 0, t & NT) {
    var c = r, l = i;
    r = i = void 0;
  }
  var h = u ? void 0 : kl(e), d = [
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
  if (h && TT(d, h), e = d[0], t = d[1], n = d[2], r = d[3], i = d[4], a = d[9] = d[9] === void 0 ? u ? 0 : e.length : Fd(d[9] - f, 0), !a && t & (Cd | Ld) && (t &= -25), !t || t == Dd)
    var _ = Ix(e, t, n);
  else t == Cd || t == Ld ? _ = wT(e, t, a) : (t == jd || t == (Dd | jd)) && !i.length ? _ = OT(e, t, n, r) : _ = Lu.apply(void 0, d);
  var v = h ? dg : bg;
  return wg(v(_, d), e, t);
}
var $T = 128;
function Wl(e, t, n) {
  return t = n ? void 0 : t, t = e && t == null ? e.length : t, Xn(e, $T, void 0, void 0, void 0, void 0, t);
}
function Jn(e, t, n) {
  t == "__proto__" && Ga ? Ga(e, t, {
    configurable: !0,
    enumerable: !0,
    value: n,
    writable: !0
  }) : e[t] = n;
}
function Wt(e, t) {
  return e === t || e !== e && t !== t;
}
var MT = Object.prototype, IT = MT.hasOwnProperty;
function Ro(e, t, n) {
  var r = e[t];
  (!(IT.call(e, t) && Wt(r, n)) || n === void 0 && !(t in e)) && Jn(e, t, n);
}
function Sn(e, t, n, r) {
  var i = !n;
  n || (n = {});
  for (var s = -1, o = t.length; ++s < o; ) {
    var a = t[s], u = r ? r(n[a], e[a], a, n, e) : void 0;
    u === void 0 && (u = e[a]), i ? Jn(n, a, u) : Ro(n, a, u);
  }
  return n;
}
var Bd = Math.max;
function Og(e, t, n) {
  return t = Bd(t === void 0 ? e.length - 1 : t, 0), function() {
    for (var r = arguments, i = -1, s = Bd(r.length - t, 0), o = Array(s); ++i < s; )
      o[i] = r[t + i];
    i = -1;
    for (var a = Array(t + 1); ++i < t; )
      a[i] = r[i];
    return a[t] = n(o), At(e, this, a);
  };
}
function D(e, t) {
  return Vl(Og(e, t, Ke), e + "");
}
var DT = 9007199254740991;
function Po(e) {
  return typeof e == "number" && e > -1 && e % 1 == 0 && e <= DT;
}
function Ye(e) {
  return e != null && Po(e.length) && !En(e);
}
function qe(e, t, n) {
  if (!se(n))
    return !1;
  var r = typeof t;
  return (r == "number" ? Ye(n) && Yn(t, n.length) : r == "string" && t in n) ? Wt(n[t], e) : !1;
}
function rs(e) {
  return D(function(t, n) {
    var r = -1, i = n.length, s = i > 1 ? n[i - 1] : void 0, o = i > 2 ? n[2] : void 0;
    for (s = e.length > 3 && typeof s == "function" ? (i--, s) : void 0, o && qe(n[0], n[1], o) && (s = i < 3 ? void 0 : s, i = 1), t = Object(t); ++r < i; ) {
      var a = n[r];
      a && e(t, a, r, s);
    }
    return t;
  });
}
var CT = Object.prototype;
function No(e) {
  var t = e && e.constructor, n = typeof t == "function" && t.prototype || CT;
  return e === n;
}
function ql(e, t) {
  for (var n = -1, r = Array(e); ++n < e; )
    r[n] = t(n);
  return r;
}
var LT = "[object Arguments]";
function zd(e) {
  return oe(e) && He(e) == LT;
}
var Eg = Object.prototype, jT = Eg.hasOwnProperty, FT = Eg.propertyIsEnumerable, hr = zd(/* @__PURE__ */ function() {
  return arguments;
}()) ? zd : function(e) {
  return oe(e) && jT.call(e, "callee") && !FT.call(e, "callee");
};
function ju() {
  return !1;
}
var Sg = typeof exports == "object" && exports && !exports.nodeType && exports, Ud = Sg && typeof module == "object" && module && !module.nodeType && module, BT = Ud && Ud.exports === Sg, kd = BT ? Se.Buffer : void 0, zT = kd ? kd.isBuffer : void 0, Gn = zT || ju, UT = "[object Arguments]", kT = "[object Array]", VT = "[object Boolean]", WT = "[object Date]", qT = "[object Error]", GT = "[object Function]", HT = "[object Map]", KT = "[object Number]", YT = "[object Object]", XT = "[object RegExp]", JT = "[object Set]", ZT = "[object String]", QT = "[object WeakMap]", e2 = "[object ArrayBuffer]", t2 = "[object DataView]", n2 = "[object Float32Array]", r2 = "[object Float64Array]", i2 = "[object Int8Array]", s2 = "[object Int16Array]", o2 = "[object Int32Array]", a2 = "[object Uint8Array]", u2 = "[object Uint8ClampedArray]", f2 = "[object Uint16Array]", c2 = "[object Uint32Array]", te = {};
te[n2] = te[r2] = te[i2] = te[s2] = te[o2] = te[a2] = te[u2] = te[f2] = te[c2] = !0;
te[UT] = te[kT] = te[e2] = te[VT] = te[t2] = te[WT] = te[qT] = te[GT] = te[HT] = te[KT] = te[YT] = te[XT] = te[JT] = te[ZT] = te[QT] = !1;
function l2(e) {
  return oe(e) && Po(e.length) && !!te[He(e)];
}
function Ot(e) {
  return function(t) {
    return e(t);
  };
}
var xg = typeof exports == "object" && exports && !exports.nodeType && exports, Is = xg && typeof module == "object" && module && !module.nodeType && module, h2 = Is && Is.exports === xg, Zf = h2 && ag.process, zt = function() {
  try {
    var e = Is && Is.require && Is.require("util").types;
    return e || Zf && Zf.binding && Zf.binding("util");
  } catch {
  }
}(), Vd = zt && zt.isTypedArray, ii = Vd ? Ot(Vd) : l2, p2 = Object.prototype, d2 = p2.hasOwnProperty;
function Tg(e, t) {
  var n = M(e), r = !n && hr(e), i = !n && !r && Gn(e), s = !n && !r && !i && ii(e), o = n || r || i || s, a = o ? ql(e.length, String) : [], u = a.length;
  for (var f in e)
    (t || d2.call(e, f)) && !(o && // Safari 9 has enumerable `arguments.length` in strict mode.
    (f == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    i && (f == "offset" || f == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    s && (f == "buffer" || f == "byteLength" || f == "byteOffset") || // Skip index properties.
    Yn(f, u))) && a.push(f);
  return a;
}
function Rg(e, t) {
  return function(n) {
    return e(t(n));
  };
}
var _2 = Rg(Object.keys, Object), v2 = Object.prototype, g2 = v2.hasOwnProperty;
function Gl(e) {
  if (!No(e))
    return _2(e);
  var t = [];
  for (var n in Object(e))
    g2.call(e, n) && n != "constructor" && t.push(n);
  return t;
}
function ve(e) {
  return Ye(e) ? Tg(e) : Gl(e);
}
var y2 = Object.prototype, b2 = y2.hasOwnProperty, Pg = rs(function(e, t) {
  if (No(t) || Ye(t)) {
    Sn(t, ve(t), e);
    return;
  }
  for (var n in t)
    b2.call(t, n) && Ro(e, n, t[n]);
});
function m2(e) {
  var t = [];
  if (e != null)
    for (var n in Object(e))
      t.push(n);
  return t;
}
var w2 = Object.prototype, A2 = w2.hasOwnProperty;
function O2(e) {
  if (!se(e))
    return m2(e);
  var t = No(e), n = [];
  for (var r in e)
    r == "constructor" && (t || !A2.call(e, r)) || n.push(r);
  return n;
}
function Xe(e) {
  return Ye(e) ? Tg(e, !0) : O2(e);
}
var Nc = rs(function(e, t) {
  Sn(t, Xe(t), e);
}), Xs = rs(function(e, t, n, r) {
  Sn(t, Xe(t), e, r);
}), Ng = rs(function(e, t, n, r) {
  Sn(t, ve(t), e, r);
}), E2 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, S2 = /^\w*$/;
function Hl(e, t) {
  if (M(e))
    return !1;
  var n = typeof e;
  return n == "number" || n == "symbol" || n == "boolean" || e == null || st(e) ? !0 : S2.test(e) || !E2.test(e) || t != null && e in Object(t);
}
var Js = ri(Object, "create");
function x2() {
  this.__data__ = Js ? Js(null) : {}, this.size = 0;
}
function T2(e) {
  var t = this.has(e) && delete this.__data__[e];
  return this.size -= t ? 1 : 0, t;
}
var R2 = "__lodash_hash_undefined__", P2 = Object.prototype, N2 = P2.hasOwnProperty;
function $2(e) {
  var t = this.__data__;
  if (Js) {
    var n = t[e];
    return n === R2 ? void 0 : n;
  }
  return N2.call(t, e) ? t[e] : void 0;
}
var M2 = Object.prototype, I2 = M2.hasOwnProperty;
function D2(e) {
  var t = this.__data__;
  return Js ? t[e] !== void 0 : I2.call(t, e);
}
var C2 = "__lodash_hash_undefined__";
function L2(e, t) {
  var n = this.__data__;
  return this.size += this.has(e) ? 0 : 1, n[e] = Js && t === void 0 ? C2 : t, this;
}
function kr(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
kr.prototype.clear = x2;
kr.prototype.delete = T2;
kr.prototype.get = $2;
kr.prototype.has = D2;
kr.prototype.set = L2;
function j2() {
  this.__data__ = [], this.size = 0;
}
function Fu(e, t) {
  for (var n = e.length; n--; )
    if (Wt(e[n][0], t))
      return n;
  return -1;
}
var F2 = Array.prototype, B2 = F2.splice;
function z2(e) {
  var t = this.__data__, n = Fu(t, e);
  if (n < 0)
    return !1;
  var r = t.length - 1;
  return n == r ? t.pop() : B2.call(t, n, 1), --this.size, !0;
}
function U2(e) {
  var t = this.__data__, n = Fu(t, e);
  return n < 0 ? void 0 : t[n][1];
}
function k2(e) {
  return Fu(this.__data__, e) > -1;
}
function V2(e, t) {
  var n = this.__data__, r = Fu(n, e);
  return r < 0 ? (++this.size, n.push([e, t])) : n[r][1] = t, this;
}
function Zn(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
Zn.prototype.clear = j2;
Zn.prototype.delete = z2;
Zn.prototype.get = U2;
Zn.prototype.has = k2;
Zn.prototype.set = V2;
var Zs = ri(Se, "Map");
function W2() {
  this.size = 0, this.__data__ = {
    hash: new kr(),
    map: new (Zs || Zn)(),
    string: new kr()
  };
}
function q2(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function Bu(e, t) {
  var n = e.__data__;
  return q2(t) ? n[typeof t == "string" ? "string" : "hash"] : n.map;
}
function G2(e) {
  var t = Bu(this, e).delete(e);
  return this.size -= t ? 1 : 0, t;
}
function H2(e) {
  return Bu(this, e).get(e);
}
function K2(e) {
  return Bu(this, e).has(e);
}
function Y2(e, t) {
  var n = Bu(this, e), r = n.size;
  return n.set(e, t), this.size += n.size == r ? 0 : 1, this;
}
function Qn(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
Qn.prototype.clear = W2;
Qn.prototype.delete = G2;
Qn.prototype.get = H2;
Qn.prototype.has = K2;
Qn.prototype.set = Y2;
var X2 = "Expected a function";
function $o(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function")
    throw new TypeError(X2);
  var n = function() {
    var r = arguments, i = t ? t.apply(this, r) : r[0], s = n.cache;
    if (s.has(i))
      return s.get(i);
    var o = e.apply(this, r);
    return n.cache = s.set(i, o) || s, o;
  };
  return n.cache = new ($o.Cache || Qn)(), n;
}
$o.Cache = Qn;
var J2 = 500;
function Z2(e) {
  var t = $o(e, function(r) {
    return n.size === J2 && n.clear(), r;
  }), n = t.cache;
  return t;
}
var Q2 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, eR = /\\(\\)?/g, $g = Z2(function(e) {
  var t = [];
  return e.charCodeAt(0) === 46 && t.push(""), e.replace(Q2, function(n, r, i, s) {
    t.push(i ? s.replace(eR, "$1") : r || n);
  }), t;
});
function W(e) {
  return e == null ? "" : wt(e);
}
function wr(e, t) {
  return M(e) ? e : Hl(e, t) ? [e] : $g(W(e));
}
function xn(e) {
  if (typeof e == "string" || st(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function si(e, t) {
  t = wr(t, e);
  for (var n = 0, r = t.length; e != null && n < r; )
    e = e[xn(t[n++])];
  return n && n == r ? e : void 0;
}
function zu(e, t, n) {
  var r = e == null ? void 0 : si(e, t);
  return r === void 0 ? n : r;
}
function Kl(e, t) {
  for (var n = -1, r = t.length, i = Array(r), s = e == null; ++n < r; )
    i[n] = s ? void 0 : zu(e, t[n]);
  return i;
}
function Ar(e, t) {
  for (var n = -1, r = t.length, i = e.length; ++n < r; )
    e[i + n] = t[n];
  return e;
}
var Wd = Ce ? Ce.isConcatSpreadable : void 0;
function tR(e) {
  return M(e) || hr(e) || !!(Wd && e && e[Wd]);
}
function Ne(e, t, n, r, i) {
  var s = -1, o = e.length;
  for (n || (n = tR), i || (i = []); ++s < o; ) {
    var a = e[s];
    t > 0 && n(a) ? t > 1 ? Ne(a, t - 1, n, r, i) : Ar(i, a) : r || (i[i.length] = a);
  }
  return i;
}
function Yl(e) {
  var t = e == null ? 0 : e.length;
  return t ? Ne(e, 1) : [];
}
function er(e) {
  return Vl(Og(e, void 0, Yl), e + "");
}
var Mg = er(Kl), Uu = Rg(Object.getPrototypeOf, Object), nR = "[object Object]", rR = Function.prototype, iR = Object.prototype, Ig = rR.toString, sR = iR.hasOwnProperty, oR = Ig.call(Object);
function is(e) {
  if (!oe(e) || He(e) != nR)
    return !1;
  var t = Uu(e);
  if (t === null)
    return !0;
  var n = sR.call(t, "constructor") && t.constructor;
  return typeof n == "function" && n instanceof n && Ig.call(n) == oR;
}
var aR = "[object DOMException]", uR = "[object Error]";
function ku(e) {
  if (!oe(e))
    return !1;
  var t = He(e);
  return t == uR || t == aR || typeof e.message == "string" && typeof e.name == "string" && !is(e);
}
var Xl = D(function(e, t) {
  try {
    return At(e, void 0, t);
  } catch (n) {
    return ku(n) ? n : new Error(n);
  }
}), fR = "Expected a function";
function Jl(e, t) {
  var n;
  if (typeof t != "function")
    throw new TypeError(fR);
  return e = I(e), function() {
    return --e > 0 && (n = t.apply(this, arguments)), e <= 1 && (t = void 0), n;
  };
}
var cR = 1, lR = 32, Mo = D(function(e, t, n) {
  var r = cR;
  if (n.length) {
    var i = lr(n, ns(Mo));
    r |= lR;
  }
  return Xn(e, r, t, n, i);
});
Mo.placeholder = {};
var Dg = er(function(e, t) {
  return Vt(t, function(n) {
    n = xn(n), Jn(e, n, Mo(e[n], e));
  }), e;
}), hR = 1, pR = 2, dR = 32, Vu = D(function(e, t, n) {
  var r = hR | pR;
  if (n.length) {
    var i = lr(n, ns(Vu));
    r |= dR;
  }
  return Xn(t, r, e, n, i);
});
Vu.placeholder = {};
function Ut(e, t, n) {
  var r = -1, i = e.length;
  t < 0 && (t = -t > i ? 0 : i + t), n = n > i ? i : n, n < 0 && (n += i), i = t > n ? 0 : n - t >>> 0, t >>>= 0;
  for (var s = Array(i); ++r < i; )
    s[r] = e[r + t];
  return s;
}
function Or(e, t, n) {
  var r = e.length;
  return n = n === void 0 ? r : n, !t && n >= r ? e : Ut(e, t, n);
}
var _R = "\\ud800-\\udfff", vR = "\\u0300-\\u036f", gR = "\\ufe20-\\ufe2f", yR = "\\u20d0-\\u20ff", bR = vR + gR + yR, mR = "\\ufe0e\\ufe0f", wR = "\\u200d", AR = RegExp("[" + wR + _R + bR + mR + "]");
function ss(e) {
  return AR.test(e);
}
function OR(e) {
  return e.split("");
}
var Cg = "\\ud800-\\udfff", ER = "\\u0300-\\u036f", SR = "\\ufe20-\\ufe2f", xR = "\\u20d0-\\u20ff", TR = ER + SR + xR, RR = "\\ufe0e\\ufe0f", PR = "[" + Cg + "]", $c = "[" + TR + "]", Mc = "\\ud83c[\\udffb-\\udfff]", NR = "(?:" + $c + "|" + Mc + ")", Lg = "[^" + Cg + "]", jg = "(?:\\ud83c[\\udde6-\\uddff]){2}", Fg = "[\\ud800-\\udbff][\\udc00-\\udfff]", $R = "\\u200d", Bg = NR + "?", zg = "[" + RR + "]?", MR = "(?:" + $R + "(?:" + [Lg, jg, Fg].join("|") + ")" + zg + Bg + ")*", IR = zg + Bg + MR, DR = "(?:" + [Lg + $c + "?", $c, jg, Fg, PR].join("|") + ")", CR = RegExp(Mc + "(?=" + Mc + ")|" + DR + IR, "g");
function LR(e) {
  return e.match(CR) || [];
}
function nn(e) {
  return ss(e) ? LR(e) : OR(e);
}
function Ug(e) {
  return function(t) {
    t = W(t);
    var n = ss(t) ? nn(t) : void 0, r = n ? n[0] : t.charAt(0), i = n ? Or(n, 1).join("") : t.slice(1);
    return r[e]() + i;
  };
}
var Wu = Ug("toUpperCase");
function Zl(e) {
  return Wu(W(e).toLowerCase());
}
function Ql(e, t, n, r) {
  var i = -1, s = e == null ? 0 : e.length;
  for (r && s && (n = e[++i]); ++i < s; )
    n = t(n, e[i], i, e);
  return n;
}
function eh(e) {
  return function(t) {
    return e?.[t];
  };
}
var jR = {
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
}, FR = eh(jR), BR = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, zR = "\\u0300-\\u036f", UR = "\\ufe20-\\ufe2f", kR = "\\u20d0-\\u20ff", VR = zR + UR + kR, WR = "[" + VR + "]", qR = RegExp(WR, "g");
function th(e) {
  return e = W(e), e && e.replace(BR, FR).replace(qR, "");
}
var GR = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
function HR(e) {
  return e.match(GR) || [];
}
var KR = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
function YR(e) {
  return KR.test(e);
}
var kg = "\\ud800-\\udfff", XR = "\\u0300-\\u036f", JR = "\\ufe20-\\ufe2f", ZR = "\\u20d0-\\u20ff", QR = XR + JR + ZR, Vg = "\\u2700-\\u27bf", Wg = "a-z\\xdf-\\xf6\\xf8-\\xff", eP = "\\xac\\xb1\\xd7\\xf7", tP = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", nP = "\\u2000-\\u206f", rP = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", qg = "A-Z\\xc0-\\xd6\\xd8-\\xde", iP = "\\ufe0e\\ufe0f", Gg = eP + tP + nP + rP, Hg = "['’]", qd = "[" + Gg + "]", sP = "[" + QR + "]", Kg = "\\d+", oP = "[" + Vg + "]", Yg = "[" + Wg + "]", Xg = "[^" + kg + Gg + Kg + Vg + Wg + qg + "]", aP = "\\ud83c[\\udffb-\\udfff]", uP = "(?:" + sP + "|" + aP + ")", fP = "[^" + kg + "]", Jg = "(?:\\ud83c[\\udde6-\\uddff]){2}", Zg = "[\\ud800-\\udbff][\\udc00-\\udfff]", Ai = "[" + qg + "]", cP = "\\u200d", Gd = "(?:" + Yg + "|" + Xg + ")", lP = "(?:" + Ai + "|" + Xg + ")", Hd = "(?:" + Hg + "(?:d|ll|m|re|s|t|ve))?", Kd = "(?:" + Hg + "(?:D|LL|M|RE|S|T|VE))?", Qg = uP + "?", e0 = "[" + iP + "]?", hP = "(?:" + cP + "(?:" + [fP, Jg, Zg].join("|") + ")" + e0 + Qg + ")*", pP = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", dP = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", _P = e0 + Qg + hP, vP = "(?:" + [oP, Jg, Zg].join("|") + ")" + _P, gP = RegExp([
  Ai + "?" + Yg + "+" + Hd + "(?=" + [qd, Ai, "$"].join("|") + ")",
  lP + "+" + Kd + "(?=" + [qd, Ai + Gd, "$"].join("|") + ")",
  Ai + "?" + Gd + "+" + Hd,
  Ai + "+" + Kd,
  dP,
  pP,
  Kg,
  vP
].join("|"), "g");
function yP(e) {
  return e.match(gP) || [];
}
function nh(e, t, n) {
  return e = W(e), t = n ? void 0 : t, t === void 0 ? YR(e) ? yP(e) : HR(e) : e.match(t) || [];
}
var bP = "['’]", mP = RegExp(bP, "g");
function os(e) {
  return function(t) {
    return Ql(nh(th(t).replace(mP, "")), e, "");
  };
}
var t0 = os(function(e, t, n) {
  return t = t.toLowerCase(), e + (n ? Zl(t) : t);
});
function n0() {
  if (!arguments.length)
    return [];
  var e = arguments[0];
  return M(e) ? e : [e];
}
var wP = Se.isFinite, AP = Math.min;
function rh(e) {
  var t = Math[e];
  return function(n, r) {
    if (n = vt(n), r = r == null ? 0 : AP(I(r), 292), r && wP(n)) {
      var i = (W(n) + "e").split("e"), s = t(i[0] + "e" + (+i[1] + r));
      return i = (W(s) + "e").split("e"), +(i[0] + "e" + (+i[1] - r));
    }
    return t(n);
  };
}
var r0 = rh("ceil");
function ih(e) {
  var t = p(e);
  return t.__chain__ = !0, t;
}
var OP = Math.ceil, EP = Math.max;
function i0(e, t, n) {
  (n ? qe(e, t, n) : t === void 0) ? t = 1 : t = EP(I(t), 0);
  var r = e == null ? 0 : e.length;
  if (!r || t < 1)
    return [];
  for (var i = 0, s = 0, o = Array(OP(r / t)); i < r; )
    o[s++] = Ut(e, i, i += t);
  return o;
}
function oi(e, t, n) {
  return e === e && (n !== void 0 && (e = e <= n ? e : n), t !== void 0 && (e = e >= t ? e : t)), e;
}
function s0(e, t, n) {
  return n === void 0 && (n = t, t = void 0), n !== void 0 && (n = vt(n), n = n === n ? n : 0), t !== void 0 && (t = vt(t), t = t === t ? t : 0), oi(vt(e), t, n);
}
function SP() {
  this.__data__ = new Zn(), this.size = 0;
}
function xP(e) {
  var t = this.__data__, n = t.delete(e);
  return this.size = t.size, n;
}
function TP(e) {
  return this.__data__.get(e);
}
function RP(e) {
  return this.__data__.has(e);
}
var PP = 200;
function NP(e, t) {
  var n = this.__data__;
  if (n instanceof Zn) {
    var r = n.__data__;
    if (!Zs || r.length < PP - 1)
      return r.push([e, t]), this.size = ++n.size, this;
    n = this.__data__ = new Qn(r);
  }
  return n.set(e, t), this.size = n.size, this;
}
function Jt(e) {
  var t = this.__data__ = new Zn(e);
  this.size = t.size;
}
Jt.prototype.clear = SP;
Jt.prototype.delete = xP;
Jt.prototype.get = TP;
Jt.prototype.has = RP;
Jt.prototype.set = NP;
function o0(e, t) {
  return e && Sn(t, ve(t), e);
}
function $P(e, t) {
  return e && Sn(t, Xe(t), e);
}
var a0 = typeof exports == "object" && exports && !exports.nodeType && exports, Yd = a0 && typeof module == "object" && module && !module.nodeType && module, MP = Yd && Yd.exports === a0, Xd = MP ? Se.Buffer : void 0, Jd = Xd ? Xd.allocUnsafe : void 0;
function u0(e, t) {
  if (t)
    return e.slice();
  var n = e.length, r = Jd ? Jd(n) : new e.constructor(n);
  return e.copy(r), r;
}
function Er(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length, i = 0, s = []; ++n < r; ) {
    var o = e[n];
    t(o, n, e) && (s[i++] = o);
  }
  return s;
}
function qu() {
  return [];
}
var IP = Object.prototype, DP = IP.propertyIsEnumerable, Zd = Object.getOwnPropertySymbols, sh = Zd ? function(e) {
  return e == null ? [] : (e = Object(e), Er(Zd(e), function(t) {
    return DP.call(e, t);
  }));
} : qu;
function CP(e, t) {
  return Sn(e, sh(e), t);
}
var LP = Object.getOwnPropertySymbols, f0 = LP ? function(e) {
  for (var t = []; e; )
    Ar(t, sh(e)), e = Uu(e);
  return t;
} : qu;
function jP(e, t) {
  return Sn(e, f0(e), t);
}
function c0(e, t, n) {
  var r = t(e);
  return M(e) ? r : Ar(r, n(e));
}
function Ic(e) {
  return c0(e, ve, sh);
}
function oh(e) {
  return c0(e, Xe, f0);
}
var Dc = ri(Se, "DataView"), Cc = ri(Se, "Promise"), Pi = ri(Se, "Set"), Qd = "[object Map]", FP = "[object Object]", e_ = "[object Promise]", t_ = "[object Set]", n_ = "[object WeakMap]", r_ = "[object DataView]", BP = ni(Dc), zP = ni(Zs), UP = ni(Cc), kP = ni(Pi), VP = ni(Ks), Dr = He;
(Dc && Dr(new Dc(new ArrayBuffer(1))) != r_ || Zs && Dr(new Zs()) != Qd || Cc && Dr(Cc.resolve()) != e_ || Pi && Dr(new Pi()) != t_ || Ks && Dr(new Ks()) != n_) && (Dr = function(e) {
  var t = He(e), n = t == FP ? e.constructor : void 0, r = n ? ni(n) : "";
  if (r)
    switch (r) {
      case BP:
        return r_;
      case zP:
        return Qd;
      case UP:
        return e_;
      case kP:
        return t_;
      case VP:
        return n_;
    }
  return t;
});
const yn = Dr;
var WP = Object.prototype, qP = WP.hasOwnProperty;
function GP(e) {
  var t = e.length, n = new e.constructor(t);
  return t && typeof e[0] == "string" && qP.call(e, "index") && (n.index = e.index, n.input = e.input), n;
}
var Ha = Se.Uint8Array;
function ah(e) {
  var t = new e.constructor(e.byteLength);
  return new Ha(t).set(new Ha(e)), t;
}
function HP(e, t) {
  var n = t ? ah(e.buffer) : e.buffer;
  return new e.constructor(n, e.byteOffset, e.byteLength);
}
var KP = /\w*$/;
function YP(e) {
  var t = new e.constructor(e.source, KP.exec(e));
  return t.lastIndex = e.lastIndex, t;
}
var i_ = Ce ? Ce.prototype : void 0, s_ = i_ ? i_.valueOf : void 0;
function XP(e) {
  return s_ ? Object(s_.call(e)) : {};
}
function l0(e, t) {
  var n = t ? ah(e.buffer) : e.buffer;
  return new e.constructor(n, e.byteOffset, e.length);
}
var JP = "[object Boolean]", ZP = "[object Date]", QP = "[object Map]", eN = "[object Number]", tN = "[object RegExp]", nN = "[object Set]", rN = "[object String]", iN = "[object Symbol]", sN = "[object ArrayBuffer]", oN = "[object DataView]", aN = "[object Float32Array]", uN = "[object Float64Array]", fN = "[object Int8Array]", cN = "[object Int16Array]", lN = "[object Int32Array]", hN = "[object Uint8Array]", pN = "[object Uint8ClampedArray]", dN = "[object Uint16Array]", _N = "[object Uint32Array]";
function vN(e, t, n) {
  var r = e.constructor;
  switch (t) {
    case sN:
      return ah(e);
    case JP:
    case ZP:
      return new r(+e);
    case oN:
      return HP(e, n);
    case aN:
    case uN:
    case fN:
    case cN:
    case lN:
    case hN:
    case pN:
    case dN:
    case _N:
      return l0(e, n);
    case QP:
      return new r();
    case eN:
    case rN:
      return new r(e);
    case tN:
      return YP(e);
    case nN:
      return new r();
    case iN:
      return XP(e);
  }
}
function h0(e) {
  return typeof e.constructor == "function" && !No(e) ? es(Uu(e)) : {};
}
var gN = "[object Map]";
function yN(e) {
  return oe(e) && yn(e) == gN;
}
var o_ = zt && zt.isMap, uh = o_ ? Ot(o_) : yN, bN = "[object Set]";
function mN(e) {
  return oe(e) && yn(e) == bN;
}
var a_ = zt && zt.isSet, fh = a_ ? Ot(a_) : mN, wN = 1, AN = 2, ON = 4, p0 = "[object Arguments]", EN = "[object Array]", SN = "[object Boolean]", xN = "[object Date]", TN = "[object Error]", d0 = "[object Function]", RN = "[object GeneratorFunction]", PN = "[object Map]", NN = "[object Number]", _0 = "[object Object]", $N = "[object RegExp]", MN = "[object Set]", IN = "[object String]", DN = "[object Symbol]", CN = "[object WeakMap]", LN = "[object ArrayBuffer]", jN = "[object DataView]", FN = "[object Float32Array]", BN = "[object Float64Array]", zN = "[object Int8Array]", UN = "[object Int16Array]", kN = "[object Int32Array]", VN = "[object Uint8Array]", WN = "[object Uint8ClampedArray]", qN = "[object Uint16Array]", GN = "[object Uint32Array]", J = {};
J[p0] = J[EN] = J[LN] = J[jN] = J[SN] = J[xN] = J[FN] = J[BN] = J[zN] = J[UN] = J[kN] = J[PN] = J[NN] = J[_0] = J[$N] = J[MN] = J[IN] = J[DN] = J[VN] = J[WN] = J[qN] = J[GN] = !0;
J[TN] = J[d0] = J[CN] = !1;
function Lt(e, t, n, r, i, s) {
  var o, a = t & wN, u = t & AN, f = t & ON;
  if (n && (o = i ? n(e, r, i, s) : n(e)), o !== void 0)
    return o;
  if (!se(e))
    return e;
  var c = M(e);
  if (c) {
    if (o = GP(e), !a)
      return rt(e, o);
  } else {
    var l = yn(e), h = l == d0 || l == RN;
    if (Gn(e))
      return u0(e, a);
    if (l == _0 || l == p0 || h && !i) {
      if (o = u || h ? {} : h0(e), !a)
        return u ? jP(e, $P(o, e)) : CP(e, o0(o, e));
    } else {
      if (!J[l])
        return i ? e : {};
      o = vN(e, l, a);
    }
  }
  s || (s = new Jt());
  var d = s.get(e);
  if (d)
    return d;
  s.set(e, o), fh(e) ? e.forEach(function(g) {
    o.add(Lt(g, t, n, g, e, s));
  }) : uh(e) && e.forEach(function(g, y) {
    o.set(y, Lt(g, t, n, y, e, s));
  });
  var _ = f ? u ? oh : Ic : u ? Xe : ve, v = c ? void 0 : _(e);
  return Vt(v || e, function(g, y) {
    v && (y = g, g = e[y]), Ro(o, y, Lt(g, t, n, y, e, s));
  }), o;
}
var HN = 4;
function v0(e) {
  return Lt(e, HN);
}
var KN = 1, YN = 4;
function Gu(e) {
  return Lt(e, KN | YN);
}
var XN = 1, JN = 4;
function g0(e, t) {
  return t = typeof t == "function" ? t : void 0, Lt(e, XN | JN, t);
}
var ZN = 4;
function y0(e, t) {
  return t = typeof t == "function" ? t : void 0, Lt(e, ZN, t);
}
function Lc() {
  return new Bt(this.value(), this.__chain__);
}
function b0(e) {
  for (var t = -1, n = e == null ? 0 : e.length, r = 0, i = []; ++t < n; ) {
    var s = e[t];
    s && (i[r++] = s);
  }
  return i;
}
function m0() {
  var e = arguments.length;
  if (!e)
    return [];
  for (var t = Array(e - 1), n = arguments[0], r = e; r--; )
    t[r - 1] = arguments[r];
  return Ar(M(n) ? rt(n) : [n], Ne(t, 1));
}
var QN = "__lodash_hash_undefined__";
function e$(e) {
  return this.__data__.set(e, QN), this;
}
function t$(e) {
  return this.__data__.has(e);
}
function Vr(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.__data__ = new Qn(); ++t < n; )
    this.add(e[t]);
}
Vr.prototype.add = Vr.prototype.push = e$;
Vr.prototype.has = t$;
function ch(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r; )
    if (t(e[n], n, e))
      return !0;
  return !1;
}
function Qs(e, t) {
  return e.has(t);
}
var n$ = 1, r$ = 2;
function w0(e, t, n, r, i, s) {
  var o = n & n$, a = e.length, u = t.length;
  if (a != u && !(o && u > a))
    return !1;
  var f = s.get(e), c = s.get(t);
  if (f && c)
    return f == t && c == e;
  var l = -1, h = !0, d = n & r$ ? new Vr() : void 0;
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
      if (!ch(t, function(y, b) {
        if (!Qs(d, b) && (_ === y || i(_, y, n, r, s)))
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
function lh(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(r, i) {
    n[++t] = [i, r];
  }), n;
}
function Hu(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(r) {
    n[++t] = r;
  }), n;
}
var i$ = 1, s$ = 2, o$ = "[object Boolean]", a$ = "[object Date]", u$ = "[object Error]", f$ = "[object Map]", c$ = "[object Number]", l$ = "[object RegExp]", h$ = "[object Set]", p$ = "[object String]", d$ = "[object Symbol]", _$ = "[object ArrayBuffer]", v$ = "[object DataView]", u_ = Ce ? Ce.prototype : void 0, Qf = u_ ? u_.valueOf : void 0;
function g$(e, t, n, r, i, s, o) {
  switch (n) {
    case v$:
      if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
        return !1;
      e = e.buffer, t = t.buffer;
    case _$:
      return !(e.byteLength != t.byteLength || !s(new Ha(e), new Ha(t)));
    case o$:
    case a$:
    case c$:
      return Wt(+e, +t);
    case u$:
      return e.name == t.name && e.message == t.message;
    case l$:
    case p$:
      return e == t + "";
    case f$:
      var a = lh;
    case h$:
      var u = r & i$;
      if (a || (a = Hu), e.size != t.size && !u)
        return !1;
      var f = o.get(e);
      if (f)
        return f == t;
      r |= s$, o.set(e, t);
      var c = w0(a(e), a(t), r, i, s, o);
      return o.delete(e), c;
    case d$:
      if (Qf)
        return Qf.call(e) == Qf.call(t);
  }
  return !1;
}
var y$ = 1, b$ = Object.prototype, m$ = b$.hasOwnProperty;
function w$(e, t, n, r, i, s) {
  var o = n & y$, a = Ic(e), u = a.length, f = Ic(t), c = f.length;
  if (u != c && !o)
    return !1;
  for (var l = u; l--; ) {
    var h = a[l];
    if (!(o ? h in t : m$.call(t, h)))
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
var A$ = 1, f_ = "[object Arguments]", c_ = "[object Array]", _a = "[object Object]", O$ = Object.prototype, l_ = O$.hasOwnProperty;
function E$(e, t, n, r, i, s) {
  var o = M(e), a = M(t), u = o ? c_ : yn(e), f = a ? c_ : yn(t);
  u = u == f_ ? _a : u, f = f == f_ ? _a : f;
  var c = u == _a, l = f == _a, h = u == f;
  if (h && Gn(e)) {
    if (!Gn(t))
      return !1;
    o = !0, c = !1;
  }
  if (h && !c)
    return s || (s = new Jt()), o || ii(e) ? w0(e, t, n, r, i, s) : g$(e, t, u, n, r, i, s);
  if (!(n & A$)) {
    var d = c && l_.call(e, "__wrapped__"), _ = l && l_.call(t, "__wrapped__");
    if (d || _) {
      var v = d ? e.value() : e, g = _ ? t.value() : t;
      return s || (s = new Jt()), i(v, g, n, r, s);
    }
  }
  return h ? (s || (s = new Jt()), w$(e, t, n, r, i, s)) : !1;
}
function Io(e, t, n, r, i) {
  return e === t ? !0 : e == null || t == null || !oe(e) && !oe(t) ? e !== e && t !== t : E$(e, t, n, r, Io, i);
}
var S$ = 1, x$ = 2;
function hh(e, t, n, r) {
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
      var l = new Jt();
      if (r)
        var h = r(f, c, u, e, t, l);
      if (!(h === void 0 ? Io(c, f, S$ | x$, r, l) : h))
        return !1;
    }
  }
  return !0;
}
function A0(e) {
  return e === e && !se(e);
}
function ph(e) {
  for (var t = ve(e), n = t.length; n--; ) {
    var r = t[n], i = e[r];
    t[n] = [r, i, A0(i)];
  }
  return t;
}
function O0(e, t) {
  return function(n) {
    return n == null ? !1 : n[e] === t && (t !== void 0 || e in Object(n));
  };
}
function E0(e) {
  var t = ph(e);
  return t.length == 1 && t[0][2] ? O0(t[0][0], t[0][1]) : function(n) {
    return n === e || hh(n, e, t);
  };
}
function T$(e, t) {
  return e != null && t in Object(e);
}
function S0(e, t, n) {
  t = wr(t, e);
  for (var r = -1, i = t.length, s = !1; ++r < i; ) {
    var o = xn(t[r]);
    if (!(s = e != null && n(e, o)))
      break;
    e = e[o];
  }
  return s || ++r != i ? s : (i = e == null ? 0 : e.length, !!i && Po(i) && Yn(o, i) && (M(e) || hr(e)));
}
function Ku(e, t) {
  return e != null && S0(e, t, T$);
}
var R$ = 1, P$ = 2;
function x0(e, t) {
  return Hl(e) && A0(t) ? O0(xn(e), t) : function(n) {
    var r = zu(n, e);
    return r === void 0 && r === t ? Ku(n, e) : Io(t, r, R$ | P$);
  };
}
function dh(e) {
  return function(t) {
    return t?.[e];
  };
}
function N$(e) {
  return function(t) {
    return si(t, e);
  };
}
function _h(e) {
  return Hl(e) ? dh(xn(e)) : N$(e);
}
function $(e) {
  return typeof e == "function" ? e : e == null ? Ke : typeof e == "object" ? M(e) ? x0(e[0], e[1]) : E0(e) : _h(e);
}
var $$ = "Expected a function";
function T0(e) {
  var t = e == null ? 0 : e.length, n = $;
  return e = t ? ie(e, function(r) {
    if (typeof r[1] != "function")
      throw new TypeError($$);
    return [n(r[0]), r[1]];
  }) : [], D(function(r) {
    for (var i = -1; ++i < t; ) {
      var s = e[i];
      if (At(s[0], this, r))
        return At(s[1], this, r);
    }
  });
}
function R0(e, t, n) {
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
function M$(e) {
  var t = ve(e);
  return function(n) {
    return R0(n, e, t);
  };
}
var I$ = 1;
function P0(e) {
  return M$(Lt(e, I$));
}
function N0(e, t) {
  return t == null || R0(e, t, ve(t));
}
function D$(e, t, n, r) {
  for (var i = -1, s = e == null ? 0 : e.length; ++i < s; ) {
    var o = e[i];
    t(r, o, n(o), e);
  }
  return r;
}
function $0(e) {
  return function(t, n, r) {
    for (var i = -1, s = Object(t), o = r(t), a = o.length; a--; ) {
      var u = o[e ? a : ++i];
      if (n(s[u], u, s) === !1)
        break;
    }
    return t;
  };
}
var vh = $0();
function Tn(e, t) {
  return e && vh(e, t, ve);
}
function M0(e, t) {
  return function(n, r) {
    if (n == null)
      return n;
    if (!Ye(n))
      return e(n, r);
    for (var i = n.length, s = t ? i : -1, o = Object(n); (t ? s-- : ++s < i) && r(o[s], s, o) !== !1; )
      ;
    return n;
  };
}
var Sr = M0(Tn);
function C$(e, t, n, r) {
  return Sr(e, function(i, s, o) {
    t(r, i, n(i), o);
  }), r;
}
function Yu(e, t) {
  return function(n, r) {
    var i = M(n) ? D$ : C$, s = t ? t() : {};
    return i(n, e, $(r), s);
  };
}
var L$ = Object.prototype, j$ = L$.hasOwnProperty, I0 = Yu(function(e, t, n) {
  j$.call(e, n) ? ++e[n] : Jn(e, n, 1);
});
function D0(e, t) {
  var n = es(e);
  return t == null ? n : o0(n, t);
}
var F$ = 8;
function Xu(e, t, n) {
  t = n ? void 0 : t;
  var r = Xn(e, F$, void 0, void 0, void 0, void 0, void 0, t);
  return r.placeholder = Xu.placeholder, r;
}
Xu.placeholder = {};
var B$ = 16;
function Ju(e, t, n) {
  t = n ? void 0 : t;
  var r = Xn(e, B$, void 0, void 0, void 0, void 0, void 0, t);
  return r.placeholder = Ju.placeholder, r;
}
Ju.placeholder = {};
var Ds = function() {
  return Se.Date.now();
}, z$ = "Expected a function", U$ = Math.max, k$ = Math.min;
function gh(e, t, n) {
  var r, i, s, o, a, u, f = 0, c = !1, l = !1, h = !0;
  if (typeof e != "function")
    throw new TypeError(z$);
  t = vt(t) || 0, se(n) && (c = !!n.leading, l = "maxWait" in n, s = l ? U$(vt(n.maxWait) || 0, t) : s, h = "trailing" in n ? !!n.trailing : h);
  function d(S) {
    var R = r, B = i;
    return r = i = void 0, f = S, o = e.apply(B, R), o;
  }
  function _(S) {
    return f = S, a = setTimeout(y, t), c ? d(S) : o;
  }
  function v(S) {
    var R = S - u, B = S - f, In = t - R;
    return l ? k$(In, s - B) : In;
  }
  function g(S) {
    var R = S - u, B = S - f;
    return u === void 0 || R >= t || R < 0 || l && B >= s;
  }
  function y() {
    var S = Ds();
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
    return a === void 0 ? o : b(Ds());
  }
  function A() {
    var S = Ds(), R = g(S);
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
function C0(e, t) {
  return e == null || e !== e ? t : e;
}
var L0 = Object.prototype, V$ = L0.hasOwnProperty, j0 = D(function(e, t) {
  e = Object(e);
  var n = -1, r = t.length, i = r > 2 ? t[2] : void 0;
  for (i && qe(t[0], t[1], i) && (r = 1); ++n < r; )
    for (var s = t[n], o = Xe(s), a = -1, u = o.length; ++a < u; ) {
      var f = o[a], c = e[f];
      (c === void 0 || Wt(c, L0[f]) && !V$.call(e, f)) && (e[f] = s[f]);
    }
  return e;
});
function jc(e, t, n) {
  (n !== void 0 && !Wt(e[t], n) || n === void 0 && !(t in e)) && Jn(e, t, n);
}
function fe(e) {
  return oe(e) && Ye(e);
}
function Fc(e, t) {
  if (!(t === "constructor" && typeof e[t] == "function") && t != "__proto__")
    return e[t];
}
function yh(e) {
  return Sn(e, Xe(e));
}
function W$(e, t, n, r, i, s, o) {
  var a = Fc(e, n), u = Fc(t, n), f = o.get(u);
  if (f) {
    jc(e, n, f);
    return;
  }
  var c = s ? s(a, u, n + "", e, t, o) : void 0, l = c === void 0;
  if (l) {
    var h = M(u), d = !h && Gn(u), _ = !h && !d && ii(u);
    c = u, h || d || _ ? M(a) ? c = a : fe(a) ? c = rt(a) : d ? (l = !1, c = u0(u, !0)) : _ ? (l = !1, c = l0(u, !0)) : c = [] : is(u) || hr(u) ? (c = a, hr(a) ? c = yh(a) : (!se(a) || En(a)) && (c = h0(u))) : l = !1;
  }
  l && (o.set(u, c), i(c, u, r, s, o), o.delete(u)), jc(e, n, c);
}
function Zu(e, t, n, r, i) {
  e !== t && vh(t, function(s, o) {
    if (i || (i = new Jt()), se(s))
      W$(e, t, o, n, Zu, r, i);
    else {
      var a = r ? r(Fc(e, o), s, o + "", e, t, i) : void 0;
      a === void 0 && (a = s), jc(e, o, a);
    }
  }, Xe);
}
function F0(e, t, n, r, i, s) {
  return se(e) && se(t) && (s.set(t, e), Zu(e, t, void 0, F0, s), s.delete(t)), e;
}
var bh = rs(function(e, t, n, r) {
  Zu(e, t, n, r);
}), B0 = D(function(e) {
  return e.push(void 0, F0), At(bh, void 0, e);
}), q$ = "Expected a function";
function z0(e, t, n) {
  if (typeof e != "function")
    throw new TypeError(q$);
  return setTimeout(function() {
    e.apply(void 0, n);
  }, t);
}
var U0 = D(function(e, t) {
  return z0(e, 1, t);
}), k0 = D(function(e, t, n) {
  return z0(e, vt(t) || 0, n);
});
function mh(e, t, n) {
  for (var r = -1, i = e == null ? 0 : e.length; ++r < i; )
    if (n(t, e[r]))
      return !0;
  return !1;
}
var G$ = 200;
function Do(e, t, n, r) {
  var i = -1, s = Cu, o = !0, a = e.length, u = [], f = t.length;
  if (!a)
    return u;
  n && (t = ie(t, Ot(n))), r ? (s = mh, o = !1) : t.length >= G$ && (s = Qs, o = !1, t = new Vr(t));
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
var V0 = D(function(e, t) {
  return fe(e) ? Do(e, Ne(t, 1, fe, !0)) : [];
});
function Et(e) {
  var t = e == null ? 0 : e.length;
  return t ? e[t - 1] : void 0;
}
var W0 = D(function(e, t) {
  var n = Et(t);
  return fe(n) && (n = void 0), fe(e) ? Do(e, Ne(t, 1, fe, !0), $(n)) : [];
}), q0 = D(function(e, t) {
  var n = Et(t);
  return fe(n) && (n = void 0), fe(e) ? Do(e, Ne(t, 1, fe, !0), void 0, n) : [];
}), G0 = Nu(function(e, t) {
  return e / t;
}, 1);
function H0(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (t = n || t === void 0 ? 1 : I(t), Ut(e, t < 0 ? 0 : t, r)) : [];
}
function K0(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (t = n || t === void 0 ? 1 : I(t), t = r - t, Ut(e, 0, t < 0 ? 0 : t)) : [];
}
function Qu(e, t, n, r) {
  for (var i = e.length, s = r ? i : -1; (r ? s-- : ++s < i) && t(e[s], s, e); )
    ;
  return n ? Ut(e, r ? 0 : s, r ? s + 1 : i) : Ut(e, r ? s + 1 : 0, r ? i : s);
}
function Y0(e, t) {
  return e && e.length ? Qu(e, $(t), !0, !0) : [];
}
function X0(e, t) {
  return e && e.length ? Qu(e, $(t), !0) : [];
}
function Rn(e) {
  return typeof e == "function" ? e : Ke;
}
function Bc(e, t) {
  var n = M(e) ? Vt : Sr;
  return n(e, Rn(t));
}
function H$(e, t) {
  for (var n = e == null ? 0 : e.length; n-- && t(e[n], n, e) !== !1; )
    ;
  return e;
}
var J0 = $0(!0);
function wh(e, t) {
  return e && J0(e, t, ve);
}
var Z0 = M0(wh, !0);
function zc(e, t) {
  var n = M(e) ? H$ : Z0;
  return n(e, Rn(t));
}
function Q0(e, t, n) {
  e = W(e), t = wt(t);
  var r = e.length;
  n = n === void 0 ? r : oi(I(n), 0, r);
  var i = n;
  return n -= t.length, n >= 0 && e.slice(n, i) == t;
}
function K$(e, t) {
  return ie(t, function(n) {
    return [n, e[n]];
  });
}
function Y$(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(r) {
    n[++t] = [r, r];
  }), n;
}
var X$ = "[object Map]", J$ = "[object Set]";
function ey(e) {
  return function(t) {
    var n = yn(t);
    return n == X$ ? lh(t) : n == J$ ? Y$(t) : K$(t, e(t));
  };
}
var Uc = ey(ve), kc = ey(Xe), Z$ = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, Q$ = eh(Z$), ty = /[&<>"']/g, eM = RegExp(ty.source);
function Ah(e) {
  return e = W(e), e && eM.test(e) ? e.replace(ty, Q$) : e;
}
var ny = /[\\^$.*+?()[\]{}|]/g, tM = RegExp(ny.source);
function ry(e) {
  return e = W(e), e && tM.test(e) ? e.replace(ny, "\\$&") : e;
}
function iy(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r; )
    if (!t(e[n], n, e))
      return !1;
  return !0;
}
function nM(e, t) {
  var n = !0;
  return Sr(e, function(r, i, s) {
    return n = !!t(r, i, s), n;
  }), n;
}
function sy(e, t, n) {
  var r = M(e) ? iy : nM;
  return n && qe(e, t, n) && (t = void 0), r(e, $(t));
}
var rM = 4294967295;
function Oh(e) {
  return e ? oi(I(e), 0, rM) : 0;
}
function iM(e, t, n, r) {
  var i = e.length;
  for (n = I(n), n < 0 && (n = -n > i ? 0 : i + n), r = r === void 0 || r > i ? i : I(r), r < 0 && (r += i), r = n > r ? 0 : Oh(r); n < r; )
    e[n++] = t;
  return e;
}
function oy(e, t, n, r) {
  var i = e == null ? 0 : e.length;
  return i ? (n && typeof n != "number" && qe(e, t, n) && (n = 0, r = i), iM(e, t, n, r)) : [];
}
function ay(e, t) {
  var n = [];
  return Sr(e, function(r, i, s) {
    t(r, i, s) && n.push(r);
  }), n;
}
function uy(e, t) {
  var n = M(e) ? Er : ay;
  return n(e, $(t));
}
function fy(e) {
  return function(t, n, r) {
    var i = Object(t);
    if (!Ye(t)) {
      var s = $(n);
      t = ve(t), n = function(a) {
        return s(i[a], a, i);
      };
    }
    var o = e(t, n, r);
    return o > -1 ? i[s ? t[o] : o] : void 0;
  };
}
var sM = Math.max;
function Eh(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = n == null ? 0 : I(n);
  return i < 0 && (i = sM(r + i, 0)), Du(e, $(t), i);
}
var cy = fy(Eh);
function ly(e, t, n) {
  var r;
  return n(e, function(i, s, o) {
    if (t(i, s, o))
      return r = s, !1;
  }), r;
}
function hy(e, t) {
  return ly(e, $(t), Tn);
}
var oM = Math.max, aM = Math.min;
function Sh(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = r - 1;
  return n !== void 0 && (i = I(n), i = n < 0 ? oM(r + i, 0) : aM(i, r - 1)), Du(e, $(t), i, !0);
}
var py = fy(Sh);
function dy(e, t) {
  return ly(e, $(t), wh);
}
function Vc(e) {
  return e && e.length ? e[0] : void 0;
}
function _y(e, t) {
  var n = -1, r = Ye(e) ? Array(e.length) : [];
  return Sr(e, function(i, s, o) {
    r[++n] = t(i, s, o);
  }), r;
}
function Co(e, t) {
  var n = M(e) ? ie : _y;
  return n(e, $(t));
}
function vy(e, t) {
  return Ne(Co(e, t), 1);
}
var uM = 1 / 0;
function gy(e, t) {
  return Ne(Co(e, t), uM);
}
function yy(e, t, n) {
  return n = n === void 0 ? 1 : I(n), Ne(Co(e, t), n);
}
var fM = 1 / 0;
function by(e) {
  var t = e == null ? 0 : e.length;
  return t ? Ne(e, fM) : [];
}
function my(e, t) {
  var n = e == null ? 0 : e.length;
  return n ? (t = t === void 0 ? 1 : I(t), Ne(e, t)) : [];
}
var cM = 512;
function wy(e) {
  return Xn(e, cM);
}
var Ay = rh("floor"), lM = "Expected a function", hM = 8, pM = 32, dM = 128, _M = 256;
function Oy(e) {
  return er(function(t) {
    var n = t.length, r = n, i = Bt.prototype.thru;
    for (e && t.reverse(); r--; ) {
      var s = t[r];
      if (typeof s != "function")
        throw new TypeError(lM);
      if (i && !o && Ca(s) == "wrapper")
        var o = new Bt([], !0);
    }
    for (r = o ? r : n; ++r < n; ) {
      s = t[r];
      var a = Ca(s), u = a == "wrapper" ? kl(s) : void 0;
      u && Pc(u[0]) && u[1] == (dM | hM | pM | _M) && !u[4].length && u[9] == 1 ? o = o[Ca(u[0])].apply(o, u[3]) : o = s.length == 1 && Pc(s) ? o[a]() : o.thru(s);
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
var Ey = Oy(), Sy = Oy(!0);
function xy(e, t) {
  return e == null ? e : vh(e, Rn(t), Xe);
}
function Ty(e, t) {
  return e == null ? e : J0(e, Rn(t), Xe);
}
function Ry(e, t) {
  return e && Tn(e, Rn(t));
}
function Py(e, t) {
  return e && wh(e, Rn(t));
}
function Ny(e) {
  for (var t = -1, n = e == null ? 0 : e.length, r = {}; ++t < n; ) {
    var i = e[t];
    r[i[0]] = i[1];
  }
  return r;
}
function ef(e, t) {
  return Er(t, function(n) {
    return En(e[n]);
  });
}
function $y(e) {
  return e == null ? [] : ef(e, ve(e));
}
function My(e) {
  return e == null ? [] : ef(e, Xe(e));
}
var vM = Object.prototype, gM = vM.hasOwnProperty, Iy = Yu(function(e, t, n) {
  gM.call(e, n) ? e[n].push(t) : Jn(e, n, [t]);
});
function xh(e, t) {
  return e > t;
}
function tf(e) {
  return function(t, n) {
    return typeof t == "string" && typeof n == "string" || (t = vt(t), n = vt(n)), e(t, n);
  };
}
var Dy = tf(xh), Cy = tf(function(e, t) {
  return e >= t;
}), yM = Object.prototype, bM = yM.hasOwnProperty;
function mM(e, t) {
  return e != null && bM.call(e, t);
}
function Ly(e, t) {
  return e != null && S0(e, t, mM);
}
var wM = Math.max, AM = Math.min;
function OM(e, t, n) {
  return e >= AM(t, n) && e < wM(t, n);
}
function jy(e, t, n) {
  return t = vn(t), n === void 0 ? (n = t, t = 0) : n = vn(n), e = vt(e), OM(e, t, n);
}
var EM = "[object String]";
function Lo(e) {
  return typeof e == "string" || !M(e) && oe(e) && He(e) == EM;
}
function Th(e, t) {
  return ie(t, function(n) {
    return e[n];
  });
}
function ai(e) {
  return e == null ? [] : Th(e, ve(e));
}
var SM = Math.max;
function Fy(e, t, n, r) {
  e = Ye(e) ? e : ai(e), n = n && !r ? I(n) : 0;
  var i = e.length;
  return n < 0 && (n = SM(i + n, 0)), Lo(e) ? n <= i && e.indexOf(t, n) > -1 : !!i && ts(e, t, n) > -1;
}
var xM = Math.max;
function By(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = n == null ? 0 : I(n);
  return i < 0 && (i = xM(r + i, 0)), ts(e, t, i);
}
function zy(e) {
  var t = e == null ? 0 : e.length;
  return t ? Ut(e, 0, -1) : [];
}
var TM = Math.min;
function Rh(e, t, n) {
  for (var r = n ? mh : Cu, i = e[0].length, s = e.length, o = s, a = Array(s), u = 1 / 0, f = []; o--; ) {
    var c = e[o];
    o && t && (c = ie(c, Ot(t))), u = TM(c.length, u), a[o] = !n && (t || i >= 120 && c.length >= 120) ? new Vr(o && c) : void 0;
  }
  c = e[0];
  var l = -1, h = a[0];
  e:
    for (; ++l < i && f.length < u; ) {
      var d = c[l], _ = t ? t(d) : d;
      if (d = n || d !== 0 ? d : 0, !(h ? Qs(h, _) : r(f, _, n))) {
        for (o = s; --o; ) {
          var v = a[o];
          if (!(v ? Qs(v, _) : r(e[o], _, n)))
            continue e;
        }
        h && h.push(_), f.push(d);
      }
    }
  return f;
}
function Ph(e) {
  return fe(e) ? e : [];
}
var Uy = D(function(e) {
  var t = ie(e, Ph);
  return t.length && t[0] === e[0] ? Rh(t) : [];
}), ky = D(function(e) {
  var t = Et(e), n = ie(e, Ph);
  return t === Et(n) ? t = void 0 : n.pop(), n.length && n[0] === e[0] ? Rh(n, $(t)) : [];
}), Vy = D(function(e) {
  var t = Et(e), n = ie(e, Ph);
  return t = typeof t == "function" ? t : void 0, t && n.pop(), n.length && n[0] === e[0] ? Rh(n, void 0, t) : [];
});
function RM(e, t, n, r) {
  return Tn(e, function(i, s, o) {
    t(r, n(i), s, o);
  }), r;
}
function Wy(e, t) {
  return function(n, r) {
    return RM(n, e, t(r), {});
  };
}
var PM = Object.prototype, NM = PM.toString, qy = Wy(function(e, t, n) {
  t != null && typeof t.toString != "function" && (t = NM.call(t)), e[t] = n;
}, Iu(Ke)), Gy = Object.prototype, $M = Gy.hasOwnProperty, MM = Gy.toString, Hy = Wy(function(e, t, n) {
  t != null && typeof t.toString != "function" && (t = MM.call(t)), $M.call(e, t) ? e[t].push(n) : e[t] = [n];
}, $);
function Ky(e, t) {
  return t.length < 2 ? e : si(e, Ut(t, 0, -1));
}
function jo(e, t, n) {
  t = wr(t, e), e = Ky(e, t);
  var r = e == null ? e : e[xn(Et(t))];
  return r == null ? void 0 : At(r, e, n);
}
var Yy = D(jo), Xy = D(function(e, t, n) {
  var r = -1, i = typeof t == "function", s = Ye(e) ? Array(e.length) : [];
  return Sr(e, function(o) {
    s[++r] = i ? At(t, o, n) : jo(o, t, n);
  }), s;
}), IM = "[object ArrayBuffer]";
function DM(e) {
  return oe(e) && He(e) == IM;
}
var h_ = zt && zt.isArrayBuffer, Jy = h_ ? Ot(h_) : DM, CM = "[object Boolean]";
function Zy(e) {
  return e === !0 || e === !1 || oe(e) && He(e) == CM;
}
var LM = "[object Date]";
function jM(e) {
  return oe(e) && He(e) == LM;
}
var p_ = zt && zt.isDate, Qy = p_ ? Ot(p_) : jM;
function eb(e) {
  return oe(e) && e.nodeType === 1 && !is(e);
}
var FM = "[object Map]", BM = "[object Set]", zM = Object.prototype, UM = zM.hasOwnProperty;
function tb(e) {
  if (e == null)
    return !0;
  if (Ye(e) && (M(e) || typeof e == "string" || typeof e.splice == "function" || Gn(e) || ii(e) || hr(e)))
    return !e.length;
  var t = yn(e);
  if (t == FM || t == BM)
    return !e.size;
  if (No(e))
    return !Gl(e).length;
  for (var n in e)
    if (UM.call(e, n))
      return !1;
  return !0;
}
function Ni(e, t) {
  return Io(e, t);
}
function nb(e, t, n) {
  n = typeof n == "function" ? n : void 0;
  var r = n ? n(e, t) : void 0;
  return r === void 0 ? Io(e, t, void 0, n) : !!r;
}
var kM = Se.isFinite;
function rb(e) {
  return typeof e == "number" && kM(e);
}
function Nh(e) {
  return typeof e == "number" && e == I(e);
}
function ib(e, t) {
  return e === t || hh(e, t, ph(t));
}
function sb(e, t, n) {
  return n = typeof n == "function" ? n : void 0, hh(e, t, ph(t), n);
}
var VM = "[object Number]";
function $h(e) {
  return typeof e == "number" || oe(e) && He(e) == VM;
}
function ob(e) {
  return $h(e) && e != +e;
}
var WM = Da ? En : ju, qM = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.";
function ab(e) {
  if (WM(e))
    throw new Error(qM);
  return pg(e);
}
function ub(e) {
  return e == null;
}
function fb(e) {
  return e === null;
}
var GM = "[object RegExp]";
function HM(e) {
  return oe(e) && He(e) == GM;
}
var d_ = zt && zt.isRegExp, nf = d_ ? Ot(d_) : HM, __ = 9007199254740991;
function cb(e) {
  return Nh(e) && e >= -__ && e <= __;
}
function lb(e) {
  return e === void 0;
}
var KM = "[object WeakMap]";
function hb(e) {
  return oe(e) && yn(e) == KM;
}
var YM = "[object WeakSet]";
function pb(e) {
  return oe(e) && He(e) == YM;
}
var XM = 1;
function db(e) {
  return $(typeof e == "function" ? e : Lt(e, XM));
}
var JM = Array.prototype, ZM = JM.join;
function _b(e, t) {
  return e == null ? "" : ZM.call(e, t);
}
var vb = os(function(e, t, n) {
  return e + (n ? "-" : "") + t.toLowerCase();
}), gb = Yu(function(e, t, n) {
  Jn(e, n, t);
});
function QM(e, t, n) {
  for (var r = n + 1; r--; )
    if (e[r] === t)
      return r;
  return r;
}
var eI = Math.max, tI = Math.min;
function yb(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = r;
  return n !== void 0 && (i = I(n), i = i < 0 ? eI(r + i, 0) : tI(i, r - 1)), t === t ? QM(e, t, i) : Du(e, mg, i, !0);
}
var bb = os(function(e, t, n) {
  return e + (n ? " " : "") + t.toLowerCase();
}), mb = Ug("toLowerCase");
function Mh(e, t) {
  return e < t;
}
var wb = tf(Mh), Ab = tf(function(e, t) {
  return e <= t;
});
function Ob(e, t) {
  var n = {};
  return t = $(t), Tn(e, function(r, i, s) {
    Jn(n, t(r, i, s), r);
  }), n;
}
function Eb(e, t) {
  var n = {};
  return t = $(t), Tn(e, function(r, i, s) {
    Jn(n, i, t(r, i, s));
  }), n;
}
var nI = 1;
function Sb(e) {
  return E0(Lt(e, nI));
}
var rI = 1;
function xb(e, t) {
  return x0(e, Lt(t, rI));
}
function rf(e, t, n) {
  for (var r = -1, i = e.length; ++r < i; ) {
    var s = e[r], o = t(s);
    if (o != null && (a === void 0 ? o === o && !st(o) : n(o, a)))
      var a = o, u = s;
  }
  return u;
}
function Tb(e) {
  return e && e.length ? rf(e, Ke, xh) : void 0;
}
function Rb(e, t) {
  return e && e.length ? rf(e, $(t), xh) : void 0;
}
function Ih(e, t) {
  for (var n, r = -1, i = e.length; ++r < i; ) {
    var s = t(e[r]);
    s !== void 0 && (n = n === void 0 ? s : n + s);
  }
  return n;
}
var iI = NaN;
function Pb(e, t) {
  var n = e == null ? 0 : e.length;
  return n ? Ih(e, t) / n : iI;
}
function Nb(e) {
  return Pb(e, Ke);
}
function $b(e, t) {
  return Pb(e, $(t));
}
var Mb = rs(function(e, t, n) {
  Zu(e, t, n);
}), Ib = D(function(e, t) {
  return function(n) {
    return jo(n, e, t);
  };
}), Db = D(function(e, t) {
  return function(n) {
    return jo(e, n, t);
  };
});
function Cb(e) {
  return e && e.length ? rf(e, Ke, Mh) : void 0;
}
function Lb(e, t) {
  return e && e.length ? rf(e, $(t), Mh) : void 0;
}
function jb(e, t, n) {
  var r = ve(t), i = ef(t, r), s = !(se(n) && "chain" in n) || !!n.chain, o = En(e);
  return Vt(i, function(a) {
    var u = t[a];
    e[a] = u, o && (e.prototype[a] = function() {
      var f = this.__chain__;
      if (s || f) {
        var c = e(this.__wrapped__), l = c.__actions__ = rt(this.__actions__);
        return l.push({ func: u, args: arguments, thisArg: e }), c.__chain__ = f, c;
      }
      return u.apply(e, Ar([this.value()], arguments));
    });
  }), e;
}
var Fb = Nu(function(e, t) {
  return e * t;
}, 1), sI = "Expected a function";
function Fo(e) {
  if (typeof e != "function")
    throw new TypeError(sI);
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
function oI(e) {
  for (var t, n = []; !(t = e.next()).done; )
    n.push(t.value);
  return n;
}
var aI = "[object Map]", uI = "[object Set]", ec = Ce ? Ce.iterator : void 0;
function Dh(e) {
  if (!e)
    return [];
  if (Ye(e))
    return Lo(e) ? nn(e) : rt(e);
  if (ec && e[ec])
    return oI(e[ec]());
  var t = yn(e), n = t == aI ? lh : t == uI ? Hu : ai;
  return n(e);
}
function Wc() {
  this.__values__ === void 0 && (this.__values__ = Dh(this.value()));
  var e = this.__index__ >= this.__values__.length, t = e ? void 0 : this.__values__[this.__index__++];
  return { done: e, value: t };
}
function Bb(e, t) {
  var n = e.length;
  if (n)
    return t += t < 0 ? n : 0, Yn(t, n) ? e[t] : void 0;
}
function zb(e, t) {
  return e && e.length ? Bb(e, I(t)) : void 0;
}
function Ub(e) {
  return e = I(e), D(function(t) {
    return Bb(t, e);
  });
}
function Ch(e, t) {
  return t = wr(t, e), e = Ky(e, t), e == null || delete e[xn(Et(t))];
}
function fI(e) {
  return is(e) ? void 0 : e;
}
var cI = 1, lI = 2, hI = 4, kb = er(function(e, t) {
  var n = {};
  if (e == null)
    return n;
  var r = !1;
  t = ie(t, function(s) {
    return s = wr(s, e), r || (r = s.length > 1), s;
  }), Sn(e, oh(e), n), r && (n = Lt(n, cI | lI | hI, fI));
  for (var i = t.length; i--; )
    Ch(n, t[i]);
  return n;
});
function Bo(e, t, n, r) {
  if (!se(e))
    return e;
  t = wr(t, e);
  for (var i = -1, s = t.length, o = s - 1, a = e; a != null && ++i < s; ) {
    var u = xn(t[i]), f = n;
    if (u === "__proto__" || u === "constructor" || u === "prototype")
      return e;
    if (i != o) {
      var c = a[u];
      f = r ? r(c, u, a) : void 0, f === void 0 && (f = se(c) ? c : Yn(t[i + 1]) ? [] : {});
    }
    Ro(a, u, f), a = a[u];
  }
  return e;
}
function Vb(e, t, n) {
  for (var r = -1, i = t.length, s = {}; ++r < i; ) {
    var o = t[r], a = si(e, o);
    n(a, o) && Bo(s, wr(o, e), a);
  }
  return s;
}
function Lh(e, t) {
  if (e == null)
    return {};
  var n = ie(oh(e), function(r) {
    return [r];
  });
  return t = $(t), Vb(e, n, function(r, i) {
    return t(r, i[0]);
  });
}
function Wb(e, t) {
  return Lh(e, Fo($(t)));
}
function qb(e) {
  return Jl(2, e);
}
function pI(e, t) {
  var n = e.length;
  for (e.sort(t); n--; )
    e[n] = e[n].value;
  return e;
}
function Gb(e, t) {
  if (e !== t) {
    var n = e !== void 0, r = e === null, i = e === e, s = st(e), o = t !== void 0, a = t === null, u = t === t, f = st(t);
    if (!a && !f && !s && e > t || s && o && u && !a && !f || r && o && u || !n && u || !i)
      return 1;
    if (!r && !s && !f && e < t || f && n && i && !r && !s || a && n && i || !o && i || !u)
      return -1;
  }
  return 0;
}
function dI(e, t, n) {
  for (var r = -1, i = e.criteria, s = t.criteria, o = i.length, a = n.length; ++r < o; ) {
    var u = Gb(i[r], s[r]);
    if (u) {
      if (r >= a)
        return u;
      var f = n[r];
      return u * (f == "desc" ? -1 : 1);
    }
  }
  return e.index - t.index;
}
function Hb(e, t, n) {
  t.length ? t = ie(t, function(s) {
    return M(s) ? function(o) {
      return si(o, s.length === 1 ? s[0] : s);
    } : s;
  }) : t = [Ke];
  var r = -1;
  t = ie(t, Ot($));
  var i = _y(e, function(s, o, a) {
    var u = ie(t, function(f) {
      return f(s);
    });
    return { criteria: u, index: ++r, value: s };
  });
  return pI(i, function(s, o) {
    return dI(s, o, n);
  });
}
function Kb(e, t, n, r) {
  return e == null ? [] : (M(t) || (t = t == null ? [] : [t]), n = r ? void 0 : n, M(n) || (n = n == null ? [] : [n]), Hb(e, t, n));
}
function jh(e) {
  return er(function(t) {
    return t = ie(t, Ot($)), D(function(n) {
      var r = this;
      return e(t, function(i) {
        return At(i, r, n);
      });
    });
  });
}
var Yb = jh(ie), _I = D, vI = Math.min, Xb = _I(function(e, t) {
  t = t.length == 1 && M(t[0]) ? ie(t[0], Ot($)) : ie(Ne(t, 1), Ot($));
  var n = t.length;
  return D(function(r) {
    for (var i = -1, s = vI(r.length, n); ++i < s; )
      r[i] = t[i].call(this, r[i]);
    return At(e, this, r);
  });
}), Jb = jh(iy), Zb = jh(ch), gI = 9007199254740991, yI = Math.floor;
function qc(e, t) {
  var n = "";
  if (!e || t < 1 || t > gI)
    return n;
  do
    t % 2 && (n += e), t = yI(t / 2), t && (e += e);
  while (t);
  return n;
}
var bI = dh("length"), Qb = "\\ud800-\\udfff", mI = "\\u0300-\\u036f", wI = "\\ufe20-\\ufe2f", AI = "\\u20d0-\\u20ff", OI = mI + wI + AI, EI = "\\ufe0e\\ufe0f", SI = "[" + Qb + "]", Gc = "[" + OI + "]", Hc = "\\ud83c[\\udffb-\\udfff]", xI = "(?:" + Gc + "|" + Hc + ")", em = "[^" + Qb + "]", tm = "(?:\\ud83c[\\udde6-\\uddff]){2}", nm = "[\\ud800-\\udbff][\\udc00-\\udfff]", TI = "\\u200d", rm = xI + "?", im = "[" + EI + "]?", RI = "(?:" + TI + "(?:" + [em, tm, nm].join("|") + ")" + im + rm + ")*", PI = im + rm + RI, NI = "(?:" + [em + Gc + "?", Gc, tm, nm, SI].join("|") + ")", v_ = RegExp(Hc + "(?=" + Hc + ")|" + NI + PI, "g");
function $I(e) {
  for (var t = v_.lastIndex = 0; v_.test(e); )
    ++t;
  return t;
}
function as(e) {
  return ss(e) ? $I(e) : bI(e);
}
var MI = Math.ceil;
function Ka(e, t) {
  t = t === void 0 ? " " : wt(t);
  var n = t.length;
  if (n < 2)
    return n ? qc(t, e) : t;
  var r = qc(t, MI(e / as(t)));
  return ss(t) ? Or(nn(r), 0, e).join("") : r.slice(0, e);
}
var II = Math.ceil, DI = Math.floor;
function sm(e, t, n) {
  e = W(e), t = I(t);
  var r = t ? as(e) : 0;
  if (!t || r >= t)
    return e;
  var i = (t - r) / 2;
  return Ka(DI(i), n) + e + Ka(II(i), n);
}
function om(e, t, n) {
  e = W(e), t = I(t);
  var r = t ? as(e) : 0;
  return t && r < t ? e + Ka(t - r, n) : e;
}
function am(e, t, n) {
  e = W(e), t = I(t);
  var r = t ? as(e) : 0;
  return t && r < t ? Ka(t - r, n) + e : e;
}
var CI = /^\s+/, LI = Se.parseInt;
function um(e, t, n) {
  return n || t == null ? t = 0 : t && (t = +t), LI(W(e).replace(CI, ""), t || 0);
}
var jI = 32, zo = D(function(e, t) {
  var n = lr(t, ns(zo));
  return Xn(e, jI, void 0, t, n);
});
zo.placeholder = {};
var FI = 64, sf = D(function(e, t) {
  var n = lr(t, ns(sf));
  return Xn(e, FI, void 0, t, n);
});
sf.placeholder = {};
var fm = Yu(function(e, t, n) {
  e[n ? 0 : 1].push(t);
}, function() {
  return [[], []];
});
function BI(e, t) {
  return Vb(e, t, function(n, r) {
    return Ku(e, r);
  });
}
var cm = er(function(e, t) {
  return e == null ? {} : BI(e, t);
});
function Kc(e) {
  for (var t, n = this; n instanceof $u; ) {
    var r = gg(n);
    r.__index__ = 0, r.__values__ = void 0, t ? i.__wrapped__ = r : t = r;
    var i = r;
    n = n.__wrapped__;
  }
  return i.__wrapped__ = e, t;
}
function lm(e) {
  return function(t) {
    return e == null ? void 0 : si(e, t);
  };
}
function zI(e, t, n, r) {
  for (var i = n - 1, s = e.length; ++i < s; )
    if (r(e[i], t))
      return i;
  return -1;
}
var UI = Array.prototype, g_ = UI.splice;
function Fh(e, t, n, r) {
  var i = r ? zI : ts, s = -1, o = t.length, a = e;
  for (e === t && (t = rt(t)), n && (a = ie(e, Ot(n))); ++s < o; )
    for (var u = 0, f = t[s], c = n ? n(f) : f; (u = i(a, c, u, r)) > -1; )
      a !== e && g_.call(a, u, 1), g_.call(e, u, 1);
  return e;
}
function Bh(e, t) {
  return e && e.length && t && t.length ? Fh(e, t) : e;
}
var hm = D(Bh);
function pm(e, t, n) {
  return e && e.length && t && t.length ? Fh(e, t, $(n)) : e;
}
function dm(e, t, n) {
  return e && e.length && t && t.length ? Fh(e, t, void 0, n) : e;
}
var kI = Array.prototype, VI = kI.splice;
function _m(e, t) {
  for (var n = e ? t.length : 0, r = n - 1; n--; ) {
    var i = t[n];
    if (n == r || i !== s) {
      var s = i;
      Yn(i) ? VI.call(e, i, 1) : Ch(e, i);
    }
  }
  return e;
}
var vm = er(function(e, t) {
  var n = e == null ? 0 : e.length, r = Kl(e, t);
  return _m(e, ie(t, function(i) {
    return Yn(i, n) ? +i : i;
  }).sort(Gb)), r;
}), WI = Math.floor, qI = Math.random;
function zh(e, t) {
  return e + WI(qI() * (t - e + 1));
}
var GI = parseFloat, HI = Math.min, KI = Math.random;
function gm(e, t, n) {
  if (n && typeof n != "boolean" && qe(e, t, n) && (t = n = void 0), n === void 0 && (typeof t == "boolean" ? (n = t, t = void 0) : typeof e == "boolean" && (n = e, e = void 0)), e === void 0 && t === void 0 ? (e = 0, t = 1) : (e = vn(e), t === void 0 ? (t = e, e = 0) : t = vn(t)), e > t) {
    var r = e;
    e = t, t = r;
  }
  if (n || e % 1 || t % 1) {
    var i = KI();
    return HI(e + i * (t - e + GI("1e-" + ((i + "").length - 1))), t);
  }
  return zh(e, t);
}
var YI = Math.ceil, XI = Math.max;
function JI(e, t, n, r) {
  for (var i = -1, s = XI(YI((t - e) / (n || 1)), 0), o = Array(s); s--; )
    o[r ? s : ++i] = e, e += n;
  return o;
}
function ym(e) {
  return function(t, n, r) {
    return r && typeof r != "number" && qe(t, n, r) && (n = r = void 0), t = vn(t), n === void 0 ? (n = t, t = 0) : n = vn(n), r = r === void 0 ? t < n ? 1 : -1 : vn(r), JI(t, n, r, e);
  };
}
var bm = ym(), mm = ym(!0), ZI = 256, wm = er(function(e, t) {
  return Xn(e, ZI, void 0, void 0, void 0, t);
});
function Am(e, t, n, r, i) {
  return i(e, function(s, o, a) {
    n = r ? (r = !1, s) : t(n, s, o, a);
  }), n;
}
function Om(e, t, n) {
  var r = M(e) ? Ql : Am, i = arguments.length < 3;
  return r(e, $(t), n, i, Sr);
}
function QI(e, t, n, r) {
  var i = e == null ? 0 : e.length;
  for (r && i && (n = e[--i]); i--; )
    n = t(n, e[i], i, e);
  return n;
}
function Em(e, t, n) {
  var r = M(e) ? QI : Am, i = arguments.length < 3;
  return r(e, $(t), n, i, Z0);
}
function Sm(e, t) {
  var n = M(e) ? Er : ay;
  return n(e, Fo($(t)));
}
function xm(e, t) {
  var n = [];
  if (!(e && e.length))
    return n;
  var r = -1, i = [], s = e.length;
  for (t = $(t); ++r < s; ) {
    var o = e[r];
    t(o, r, e) && (n.push(o), i.push(r));
  }
  return _m(e, i), n;
}
function Tm(e, t, n) {
  return (n ? qe(e, t, n) : t === void 0) ? t = 1 : t = I(t), qc(W(e), t);
}
function Rm() {
  var e = arguments, t = W(e[0]);
  return e.length < 3 ? t : t.replace(e[1], e[2]);
}
var eD = "Expected a function";
function Pm(e, t) {
  if (typeof e != "function")
    throw new TypeError(eD);
  return t = t === void 0 ? t : I(t), D(e, t);
}
function Nm(e, t, n) {
  t = wr(t, e);
  var r = -1, i = t.length;
  for (i || (i = 1, e = void 0); ++r < i; ) {
    var s = e?.[xn(t[r])];
    s === void 0 && (r = i, s = n), e = En(s) ? s.call(e) : s;
  }
  return e;
}
var tD = Array.prototype, nD = tD.reverse;
function Ya(e) {
  return e == null ? e : nD.call(e);
}
var $m = rh("round");
function Mm(e) {
  var t = e.length;
  return t ? e[zh(0, t - 1)] : void 0;
}
function rD(e) {
  return Mm(ai(e));
}
function Im(e) {
  var t = M(e) ? Mm : rD;
  return t(e);
}
function of(e, t) {
  var n = -1, r = e.length, i = r - 1;
  for (t = t === void 0 ? r : t; ++n < t; ) {
    var s = zh(n, i), o = e[s];
    e[s] = e[n], e[n] = o;
  }
  return e.length = t, e;
}
function iD(e, t) {
  return of(rt(e), oi(t, 0, e.length));
}
function sD(e, t) {
  var n = ai(e);
  return of(n, oi(t, 0, n.length));
}
function Dm(e, t, n) {
  (n ? qe(e, t, n) : t === void 0) ? t = 1 : t = I(t);
  var r = M(e) ? iD : sD;
  return r(e, t);
}
function Cm(e, t, n) {
  return e == null ? e : Bo(e, t, n);
}
function Lm(e, t, n, r) {
  return r = typeof r == "function" ? r : void 0, e == null ? e : Bo(e, t, n, r);
}
function oD(e) {
  return of(rt(e));
}
function aD(e) {
  return of(ai(e));
}
function jm(e) {
  var t = M(e) ? oD : aD;
  return t(e);
}
var uD = "[object Map]", fD = "[object Set]";
function Fm(e) {
  if (e == null)
    return 0;
  if (Ye(e))
    return Lo(e) ? as(e) : e.length;
  var t = yn(e);
  return t == uD || t == fD ? e.size : Gl(e).length;
}
function Bm(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (n && typeof n != "number" && qe(e, t, n) ? (t = 0, n = r) : (t = t == null ? 0 : I(t), n = n === void 0 ? r : I(n)), Ut(e, t, n)) : [];
}
var zm = os(function(e, t, n) {
  return e + (n ? "_" : "") + t.toLowerCase();
});
function cD(e, t) {
  var n;
  return Sr(e, function(r, i, s) {
    return n = t(r, i, s), !n;
  }), !!n;
}
function Um(e, t, n) {
  var r = M(e) ? ch : cD;
  return n && qe(e, t, n) && (t = void 0), r(e, $(t));
}
var km = D(function(e, t) {
  if (e == null)
    return [];
  var n = t.length;
  return n > 1 && qe(e, t[0], t[1]) ? t = [] : n > 2 && qe(t[0], t[1], t[2]) && (t = [t[0]]), Hb(e, Ne(t, 1), []);
}), lD = 4294967295, hD = lD - 1, pD = Math.floor, dD = Math.min;
function Uh(e, t, n, r) {
  var i = 0, s = e == null ? 0 : e.length;
  if (s === 0)
    return 0;
  t = n(t);
  for (var o = t !== t, a = t === null, u = st(t), f = t === void 0; i < s; ) {
    var c = pD((i + s) / 2), l = n(e[c]), h = l !== void 0, d = l === null, _ = l === l, v = st(l);
    if (o)
      var g = r || _;
    else f ? g = _ && (r || h) : a ? g = _ && h && (r || !d) : u ? g = _ && h && !d && (r || !v) : d || v ? g = !1 : g = r ? l <= t : l < t;
    g ? i = c + 1 : s = c;
  }
  return dD(s, hD);
}
var _D = 4294967295, vD = _D >>> 1;
function af(e, t, n) {
  var r = 0, i = e == null ? r : e.length;
  if (typeof t == "number" && t === t && i <= vD) {
    for (; r < i; ) {
      var s = r + i >>> 1, o = e[s];
      o !== null && !st(o) && (n ? o <= t : o < t) ? r = s + 1 : i = s;
    }
    return i;
  }
  return Uh(e, t, Ke, n);
}
function Vm(e, t) {
  return af(e, t);
}
function Wm(e, t, n) {
  return Uh(e, t, $(n));
}
function qm(e, t) {
  var n = e == null ? 0 : e.length;
  if (n) {
    var r = af(e, t);
    if (r < n && Wt(e[r], t))
      return r;
  }
  return -1;
}
function Gm(e, t) {
  return af(e, t, !0);
}
function Hm(e, t, n) {
  return Uh(e, t, $(n), !0);
}
function Km(e, t) {
  var n = e == null ? 0 : e.length;
  if (n) {
    var r = af(e, t, !0) - 1;
    if (Wt(e[r], t))
      return r;
  }
  return -1;
}
function Ym(e, t) {
  for (var n = -1, r = e.length, i = 0, s = []; ++n < r; ) {
    var o = e[n], a = t ? t(o) : o;
    if (!n || !Wt(a, u)) {
      var u = a;
      s[i++] = o === 0 ? 0 : o;
    }
  }
  return s;
}
function Xm(e) {
  return e && e.length ? Ym(e) : [];
}
function Jm(e, t) {
  return e && e.length ? Ym(e, $(t)) : [];
}
var gD = 4294967295;
function Zm(e, t, n) {
  return n && typeof n != "number" && qe(e, t, n) && (t = n = void 0), n = n === void 0 ? gD : n >>> 0, n ? (e = W(e), e && (typeof t == "string" || t != null && !nf(t)) && (t = wt(t), !t && ss(e)) ? Or(nn(e), 0, n) : e.split(t, n)) : [];
}
var yD = "Expected a function", bD = Math.max;
function Qm(e, t) {
  if (typeof e != "function")
    throw new TypeError(yD);
  return t = t == null ? 0 : bD(I(t), 0), D(function(n) {
    var r = n[t], i = Or(n, 0, t);
    return r && Ar(i, r), At(e, this, i);
  });
}
var e1 = os(function(e, t, n) {
  return e + (n ? " " : "") + Wu(t);
});
function t1(e, t, n) {
  return e = W(e), n = n == null ? 0 : oi(I(n), 0, e.length), t = wt(t), e.slice(n, n + t.length) == t;
}
function n1() {
  return {};
}
function r1() {
  return "";
}
function i1() {
  return !0;
}
var s1 = Nu(function(e, t) {
  return e - t;
}, 0);
function o1(e) {
  return e && e.length ? Ih(e, Ke) : 0;
}
function a1(e, t) {
  return e && e.length ? Ih(e, $(t)) : 0;
}
function u1(e) {
  var t = e == null ? 0 : e.length;
  return t ? Ut(e, 1, t) : [];
}
function f1(e, t, n) {
  return e && e.length ? (t = n || t === void 0 ? 1 : I(t), Ut(e, 0, t < 0 ? 0 : t)) : [];
}
function c1(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (t = n || t === void 0 ? 1 : I(t), t = r - t, Ut(e, t < 0 ? 0 : t, r)) : [];
}
function l1(e, t) {
  return e && e.length ? Qu(e, $(t), !1, !0) : [];
}
function h1(e, t) {
  return e && e.length ? Qu(e, $(t)) : [];
}
function p1(e, t) {
  return t(e), e;
}
var d1 = Object.prototype, mD = d1.hasOwnProperty;
function y_(e, t, n, r) {
  return e === void 0 || Wt(e, d1[n]) && !mD.call(r, n) ? t : e;
}
var wD = {
  "\\": "\\",
  "'": "'",
  "\n": "n",
  "\r": "r",
  "\u2028": "u2028",
  "\u2029": "u2029"
};
function AD(e) {
  return "\\" + wD[e];
}
var _1 = /<%=([\s\S]+?)%>/g, OD = /<%-([\s\S]+?)%>/g, ED = /<%([\s\S]+?)%>/g, Xa = {
  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  escape: OD,
  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  evaluate: ED,
  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  interpolate: _1,
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
    _: { escape: Ah }
  }
}, SD = "Invalid `variable` option passed into `_.template`", xD = /\b__p \+= '';/g, TD = /\b(__p \+=) '' \+/g, RD = /(__e\(.*?\)|\b__t\)) \+\n'';/g, PD = /[()=,{}\[\]\/\s]/, ND = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, va = /($^)/, $D = /['\n\r\u2028\u2029\\]/g, MD = Object.prototype, b_ = MD.hasOwnProperty;
function v1(e, t, n) {
  var r = Xa.imports._.templateSettings || Xa;
  n && qe(e, t, n) && (t = void 0), e = W(e), t = Xs({}, t, r, y_);
  var i = Xs({}, t.imports, r.imports, y_), s = ve(i), o = Th(i, s), a, u, f = 0, c = t.interpolate || va, l = "__p += '", h = RegExp(
    (t.escape || va).source + "|" + c.source + "|" + (c === _1 ? ND : va).source + "|" + (t.evaluate || va).source + "|$",
    "g"
  ), d = b_.call(t, "sourceURL") ? "//# sourceURL=" + (t.sourceURL + "").replace(/\s/g, " ") + `
` : "";
  e.replace(h, function(g, y, b, w, m, A) {
    return b || (b = w), l += e.slice(f, A).replace($D, AD), y && (a = !0, l += `' +
__e(` + y + `) +
'`), m && (u = !0, l += `';
` + m + `;
__p += '`), b && (l += `' +
((__t = (` + b + `)) == null ? '' : __t) +
'`), f = A + g.length, g;
  }), l += `';
`;
  var _ = b_.call(t, "variable") && t.variable;
  if (!_)
    l = `with (obj) {
` + l + `
}
`;
  else if (PD.test(_))
    throw new Error(SD);
  l = (u ? l.replace(xD, "") : l).replace(TD, "$1").replace(RD, "$1;"), l = "function(" + (_ || "obj") + `) {
` + (_ ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (a ? ", __e = _.escape" : "") + (u ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + l + `return __p
}`;
  var v = Xl(function() {
    return Function(s, d + "return " + l).apply(void 0, o);
  });
  if (v.source = l, ku(v))
    throw v;
  return v;
}
var ID = "Expected a function";
function g1(e, t, n) {
  var r = !0, i = !0;
  if (typeof e != "function")
    throw new TypeError(ID);
  return se(n) && (r = "leading" in n ? !!n.leading : r, i = "trailing" in n ? !!n.trailing : i), gh(e, t, {
    leading: r,
    maxWait: t,
    trailing: i
  });
}
function Uo(e, t) {
  return t(e);
}
var DD = 9007199254740991, tc = 4294967295, CD = Math.min;
function y1(e, t) {
  if (e = I(e), e < 1 || e > DD)
    return [];
  var n = tc, r = CD(e, tc);
  t = Rn(t), e -= tc;
  for (var i = ql(r, t); ++n < e; )
    t(n);
  return i;
}
function Yc() {
  return this;
}
function b1(e, t) {
  var n = e;
  return n instanceof C && (n = n.value()), Ql(t, function(r, i) {
    return i.func.apply(i.thisArg, Ar([r], i.args));
  }, n);
}
function Rs() {
  return b1(this.__wrapped__, this.__actions__);
}
function m1(e) {
  return W(e).toLowerCase();
}
function w1(e) {
  return M(e) ? ie(e, xn) : st(e) ? [e] : rt($g(W(e)));
}
var m_ = 9007199254740991;
function A1(e) {
  return e ? oi(I(e), -m_, m_) : e === 0 ? e : 0;
}
function O1(e) {
  return W(e).toUpperCase();
}
function E1(e, t, n) {
  var r = M(e), i = r || Gn(e) || ii(e);
  if (t = $(t), n == null) {
    var s = e && e.constructor;
    i ? n = r ? new s() : [] : se(e) ? n = En(s) ? es(Uu(e)) : {} : n = {};
  }
  return (i ? Vt : Tn)(e, function(o, a, u) {
    return t(n, o, a, u);
  }), n;
}
function S1(e, t) {
  for (var n = e.length; n-- && ts(t, e[n], 0) > -1; )
    ;
  return n;
}
function x1(e, t) {
  for (var n = -1, r = e.length; ++n < r && ts(t, e[n], 0) > -1; )
    ;
  return n;
}
function T1(e, t, n) {
  if (e = W(e), e && (n || t === void 0))
    return lg(e);
  if (!e || !(t = wt(t)))
    return e;
  var r = nn(e), i = nn(t), s = x1(r, i), o = S1(r, i) + 1;
  return Or(r, s, o).join("");
}
function R1(e, t, n) {
  if (e = W(e), e && (n || t === void 0))
    return e.slice(0, cg(e) + 1);
  if (!e || !(t = wt(t)))
    return e;
  var r = nn(e), i = S1(r, nn(t)) + 1;
  return Or(r, 0, i).join("");
}
var LD = /^\s+/;
function P1(e, t, n) {
  if (e = W(e), e && (n || t === void 0))
    return e.replace(LD, "");
  if (!e || !(t = wt(t)))
    return e;
  var r = nn(e), i = x1(r, nn(t));
  return Or(r, i).join("");
}
var jD = 30, FD = "...", BD = /\w*$/;
function N1(e, t) {
  var n = jD, r = FD;
  if (se(t)) {
    var i = "separator" in t ? t.separator : i;
    n = "length" in t ? I(t.length) : n, r = "omission" in t ? wt(t.omission) : r;
  }
  e = W(e);
  var s = e.length;
  if (ss(e)) {
    var o = nn(e);
    s = o.length;
  }
  if (n >= s)
    return e;
  var a = n - as(r);
  if (a < 1)
    return r;
  var u = o ? Or(o, 0, a).join("") : e.slice(0, a);
  if (i === void 0)
    return u + r;
  if (o && (a += u.length - a), nf(i)) {
    if (e.slice(a).search(i)) {
      var f, c = u;
      for (i.global || (i = RegExp(i.source, W(BD.exec(i)) + "g")), i.lastIndex = 0; f = i.exec(c); )
        var l = f.index;
      u = u.slice(0, l === void 0 ? a : l);
    }
  } else if (e.indexOf(wt(i), a) != a) {
    var h = u.lastIndexOf(i);
    h > -1 && (u = u.slice(0, h));
  }
  return u + r;
}
function $1(e) {
  return Wl(e, 1);
}
var zD = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'"
}, UD = eh(zD), M1 = /&(?:amp|lt|gt|quot|#39);/g, kD = RegExp(M1.source);
function I1(e) {
  return e = W(e), e && kD.test(e) ? e.replace(M1, UD) : e;
}
var VD = 1 / 0, WD = Pi && 1 / Hu(new Pi([, -0]))[1] == VD ? function(e) {
  return new Pi(e);
} : Mu, qD = 200;
function pr(e, t, n) {
  var r = -1, i = Cu, s = e.length, o = !0, a = [], u = a;
  if (n)
    o = !1, i = mh;
  else if (s >= qD) {
    var f = t ? null : WD(e);
    if (f)
      return Hu(f);
    o = !1, i = Qs, u = new Vr();
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
var D1 = D(function(e) {
  return pr(Ne(e, 1, fe, !0));
}), C1 = D(function(e) {
  var t = Et(e);
  return fe(t) && (t = void 0), pr(Ne(e, 1, fe, !0), $(t));
}), L1 = D(function(e) {
  var t = Et(e);
  return t = typeof t == "function" ? t : void 0, pr(Ne(e, 1, fe, !0), void 0, t);
});
function j1(e) {
  return e && e.length ? pr(e) : [];
}
function F1(e, t) {
  return e && e.length ? pr(e, $(t)) : [];
}
function B1(e, t) {
  return t = typeof t == "function" ? t : void 0, e && e.length ? pr(e, void 0, t) : [];
}
var GD = 0;
function z1(e) {
  var t = ++GD;
  return W(e) + t;
}
function U1(e, t) {
  return e == null ? !0 : Ch(e, t);
}
var HD = Math.max;
function uf(e) {
  if (!(e && e.length))
    return [];
  var t = 0;
  return e = Er(e, function(n) {
    if (fe(n))
      return t = HD(n.length, t), !0;
  }), ql(t, function(n) {
    return ie(e, dh(n));
  });
}
function kh(e, t) {
  if (!(e && e.length))
    return [];
  var n = uf(e);
  return t == null ? n : ie(n, function(r) {
    return At(t, void 0, r);
  });
}
function k1(e, t, n, r) {
  return Bo(e, t, n(si(e, t)), r);
}
function V1(e, t, n) {
  return e == null ? e : k1(e, t, Rn(n));
}
function W1(e, t, n, r) {
  return r = typeof r == "function" ? r : void 0, e == null ? e : k1(e, t, Rn(n), r);
}
var q1 = os(function(e, t, n) {
  return e + (n ? " " : "") + t.toUpperCase();
});
function G1(e) {
  return e == null ? [] : Th(e, Xe(e));
}
var H1 = D(function(e, t) {
  return fe(e) ? Do(e, t) : [];
});
function K1(e, t) {
  return zo(Rn(t), e);
}
var Y1 = er(function(e) {
  var t = e.length, n = t ? e[0] : 0, r = this.__wrapped__, i = function(s) {
    return Kl(s, e);
  };
  return t > 1 || this.__actions__.length || !(r instanceof C) || !Yn(n) ? this.thru(i) : (r = r.slice(n, +n + (t ? 1 : 0)), r.__actions__.push({
    func: Uo,
    args: [i],
    thisArg: void 0
  }), new Bt(r, this.__chain__).thru(function(s) {
    return t && !s.length && s.push(void 0), s;
  }));
});
function X1() {
  return ih(this);
}
function J1() {
  var e = this.__wrapped__;
  if (e instanceof C) {
    var t = e;
    return this.__actions__.length && (t = new C(this)), t = t.reverse(), t.__actions__.push({
      func: Uo,
      args: [Ya],
      thisArg: void 0
    }), new Bt(t, this.__chain__);
  }
  return this.thru(Ya);
}
function Vh(e, t, n) {
  var r = e.length;
  if (r < 2)
    return r ? pr(e[0]) : [];
  for (var i = -1, s = Array(r); ++i < r; )
    for (var o = e[i], a = -1; ++a < r; )
      a != i && (s[i] = Do(s[i] || o, e[a], t, n));
  return pr(Ne(s, 1), t, n);
}
var Z1 = D(function(e) {
  return Vh(Er(e, fe));
}), Q1 = D(function(e) {
  var t = Et(e);
  return fe(t) && (t = void 0), Vh(Er(e, fe), $(t));
}), ew = D(function(e) {
  var t = Et(e);
  return t = typeof t == "function" ? t : void 0, Vh(Er(e, fe), void 0, t);
}), tw = D(uf);
function nw(e, t, n) {
  for (var r = -1, i = e.length, s = t.length, o = {}; ++r < i; ) {
    var a = r < s ? t[r] : void 0;
    n(o, e[r], a);
  }
  return o;
}
function rw(e, t) {
  return nw(e || [], t || [], Ro);
}
function iw(e, t) {
  return nw(e || [], t || [], Bo);
}
var sw = D(function(e) {
  var t = e.length, n = t > 1 ? e[t - 1] : void 0;
  return n = typeof n == "function" ? (e.pop(), n) : void 0, kh(e, n);
});
const x = {
  chunk: i0,
  compact: b0,
  concat: m0,
  difference: V0,
  differenceBy: W0,
  differenceWith: q0,
  drop: H0,
  dropRight: K0,
  dropRightWhile: Y0,
  dropWhile: X0,
  fill: oy,
  findIndex: Eh,
  findLastIndex: Sh,
  flatten: Yl,
  flattenDeep: by,
  flattenDepth: my,
  fromPairs: Ny,
  head: Vc,
  indexOf: By,
  initial: zy,
  intersection: Uy,
  intersectionBy: ky,
  intersectionWith: Vy,
  join: _b,
  lastIndexOf: yb,
  nth: zb,
  pull: hm,
  pullAll: Bh,
  pullAllBy: pm,
  pullAllWith: dm,
  pullAt: vm,
  remove: xm,
  reverse: Ya,
  slice: Bm,
  sortedIndex: Vm,
  sortedIndexBy: Wm,
  sortedIndexOf: qm,
  sortedLastIndex: Gm,
  sortedLastIndexBy: Hm,
  sortedLastIndexOf: Km,
  sortedUniq: Xm,
  sortedUniqBy: Jm,
  tail: u1,
  take: f1,
  takeRight: c1,
  takeRightWhile: l1,
  takeWhile: h1,
  union: D1,
  unionBy: C1,
  unionWith: L1,
  uniq: j1,
  uniqBy: F1,
  uniqWith: B1,
  unzip: uf,
  unzipWith: kh,
  without: H1,
  xor: Z1,
  xorBy: Q1,
  xorWith: ew,
  zip: tw,
  zipObject: rw,
  zipObjectDeep: iw,
  zipWith: sw
}, K = {
  countBy: I0,
  every: sy,
  filter: uy,
  find: cy,
  findLast: py,
  flatMap: vy,
  flatMapDeep: gy,
  flatMapDepth: yy,
  forEach: Bc,
  forEachRight: zc,
  groupBy: Iy,
  includes: Fy,
  invokeMap: Xy,
  keyBy: gb,
  map: Co,
  orderBy: Kb,
  partition: fm,
  reduce: Om,
  reduceRight: Em,
  reject: Sm,
  sample: Im,
  sampleSize: Dm,
  shuffle: jm,
  size: Fm,
  some: Um,
  sortBy: km
}, KD = {
  now: Ds
}, ce = {
  after: hg,
  ary: Wl,
  before: Jl,
  bind: Mo,
  bindKey: Vu,
  curry: Xu,
  curryRight: Ju,
  debounce: gh,
  defer: U0,
  delay: k0,
  flip: wy,
  memoize: $o,
  once: qb,
  overArgs: Xb,
  partial: zo,
  partialRight: sf,
  rearg: wm,
  rest: Pm,
  spread: Qm,
  throttle: g1,
  unary: $1,
  wrap: K1
}, P = {
  castArray: n0,
  clone: v0,
  cloneDeep: Gu,
  cloneDeepWith: g0,
  cloneWith: y0,
  conformsTo: N0,
  eq: Wt,
  gt: Dy,
  gte: Cy,
  isArguments: hr,
  isArrayBuffer: Jy,
  isArrayLike: Ye,
  isArrayLikeObject: fe,
  isBoolean: Zy,
  isBuffer: Gn,
  isDate: Qy,
  isElement: eb,
  isEmpty: tb,
  isEqual: Ni,
  isEqualWith: nb,
  isError: ku,
  isFinite: rb,
  isFunction: En,
  isInteger: Nh,
  isLength: Po,
  isMap: uh,
  isMatch: ib,
  isMatchWith: sb,
  isNaN: ob,
  isNative: ab,
  isNil: ub,
  isNull: fb,
  isNumber: $h,
  isObjectLike: oe,
  isPlainObject: is,
  isRegExp: nf,
  isSafeInteger: cb,
  isSet: fh,
  isString: Lo,
  isSymbol: st,
  isTypedArray: ii,
  isUndefined: lb,
  isWeakMap: hb,
  isWeakSet: pb,
  lt: wb,
  lte: Ab,
  toArray: Dh,
  toFinite: vn,
  toLength: Oh,
  toNumber: vt,
  toPlainObject: yh,
  toSafeInteger: A1,
  toString: W
}, Je = {
  add: fg,
  ceil: r0,
  divide: G0,
  floor: Ay,
  max: Tb,
  maxBy: Rb,
  mean: Nb,
  meanBy: $b,
  min: Cb,
  minBy: Lb,
  multiply: Fb,
  round: $m,
  subtract: s1,
  sum: o1,
  sumBy: a1
}, Wh = {
  clamp: s0,
  inRange: jy,
  random: gm
}, N = {
  assign: Pg,
  assignIn: Nc,
  assignInWith: Xs,
  assignWith: Ng,
  at: Mg,
  create: D0,
  defaults: j0,
  defaultsDeep: B0,
  findKey: hy,
  findLastKey: dy,
  forIn: xy,
  forInRight: Ty,
  forOwn: Ry,
  forOwnRight: Py,
  functions: $y,
  functionsIn: My,
  get: zu,
  has: Ly,
  hasIn: Ku,
  invert: qy,
  invertBy: Hy,
  invoke: Yy,
  keysIn: Xe,
  mapKeys: Ob,
  mapValues: Eb,
  merge: Mb,
  mergeWith: bh,
  omit: kb,
  omitBy: Wb,
  pick: cm,
  pickBy: Lh,
  result: Nm,
  set: Cm,
  setWith: Lm,
  toPairs: Uc,
  toPairsIn: kc,
  transform: E1,
  unset: U1,
  update: V1,
  updateWith: W1,
  values: ai,
  valuesIn: G1
}, Pn = {
  at: Y1,
  chain: ih,
  commit: Lc,
  next: Wc,
  plant: Kc,
  reverse: J1,
  tap: p1,
  toIterator: Yc,
  value: Rs,
  wrapperChain: X1
}, q = {
  camelCase: t0,
  capitalize: Zl,
  deburr: th,
  endsWith: Q0,
  escape: Ah,
  escapeRegExp: ry,
  kebabCase: vb,
  lowerCase: bb,
  lowerFirst: mb,
  pad: sm,
  padEnd: om,
  padStart: am,
  parseInt: um,
  repeat: Tm,
  replace: Rm,
  snakeCase: zm,
  split: Zm,
  startCase: e1,
  startsWith: t1,
  template: v1,
  templateSettings: Xa,
  toLower: m1,
  toUpper: O1,
  trim: T1,
  trimEnd: R1,
  trimStart: P1,
  truncate: N1,
  unescape: I1,
  upperCase: q1,
  upperFirst: Wu,
  words: nh
}, H = {
  attempt: Xl,
  bindAll: Dg,
  cond: T0,
  conforms: P0,
  constant: Iu,
  defaultTo: C0,
  flow: Ey,
  flowRight: Sy,
  iteratee: db,
  matches: Sb,
  matchesProperty: xb,
  method: Ib,
  methodOf: Db,
  noop: Mu,
  nthArg: Ub,
  over: Yb,
  overEvery: Jb,
  overSome: Zb,
  property: _h,
  propertyOf: lm,
  range: bm,
  rangeRight: mm,
  stubArray: qu,
  stubFalse: ju,
  stubObject: n1,
  stubString: r1,
  stubTrue: i1,
  times: y1,
  toPath: w1,
  uniqueId: z1
};
function YD() {
  var e = new C(this.__wrapped__);
  return e.__actions__ = rt(this.__actions__), e.__dir__ = this.__dir__, e.__filtered__ = this.__filtered__, e.__iteratees__ = rt(this.__iteratees__), e.__takeCount__ = this.__takeCount__, e.__views__ = rt(this.__views__), e;
}
function XD() {
  if (this.__filtered__) {
    var e = new C(this);
    e.__dir__ = -1, e.__filtered__ = !0;
  } else
    e = this.clone(), e.__dir__ *= -1;
  return e;
}
var JD = Math.max, ZD = Math.min;
function QD(e, t, n) {
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
        t = ZD(t, e + o);
        break;
      case "takeRight":
        e = JD(e, t - o);
        break;
    }
  }
  return { start: e, end: t };
}
var eC = 1, tC = 2, nC = Math.min;
function rC() {
  var e = this.__wrapped__.value(), t = this.__dir__, n = M(e), r = t < 0, i = n ? e.length : 0, s = QD(0, i, this.__views__), o = s.start, a = s.end, u = a - o, f = r ? a : o - 1, c = this.__iteratees__, l = c.length, h = 0, d = nC(u, this.__takeCount__);
  if (!n || !r && i == u && d == u)
    return b1(e, this.__actions__);
  var _ = [];
  e:
    for (; u-- && h < d; ) {
      f += t;
      for (var v = -1, g = e[f]; ++v < l; ) {
        var y = c[v], b = y.iteratee, w = y.type, m = b(g);
        if (w == tC)
          g = m;
        else if (!m) {
          if (w == eC)
            continue e;
          break e;
        }
      }
      _[h++] = g;
    }
  return _;
}
var iC = "4.17.21", sC = 2, oC = 1, aC = 3, ow = 4294967295, uC = Array.prototype, fC = Object.prototype, aw = fC.hasOwnProperty, w_ = Ce ? Ce.iterator : void 0, cC = Math.max, A_ = Math.min, qh = /* @__PURE__ */ function(e) {
  return function(t, n, r) {
    if (r == null) {
      var i = se(n), s = i && ve(n), o = s && s.length && ef(n, s);
      (o ? o.length : i) || (r = n, n = t, t = this);
    }
    return e(t, n, r);
  };
}(jb);
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
p.chain = Pn.chain;
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
p.mixin = qh;
p.negate = Fo;
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
p.tap = Pn.tap;
p.throttle = ce.throttle;
p.thru = Uo;
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
qh(p, p);
p.add = Je.add;
p.attempt = H.attempt;
p.camelCase = q.camelCase;
p.capitalize = q.capitalize;
p.ceil = Je.ceil;
p.clamp = Wh.clamp;
p.clone = P.clone;
p.cloneDeep = P.cloneDeep;
p.cloneDeepWith = P.cloneDeepWith;
p.cloneWith = P.cloneWith;
p.conformsTo = P.conformsTo;
p.deburr = q.deburr;
p.defaultTo = H.defaultTo;
p.divide = Je.divide;
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
p.floor = Je.floor;
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
p.identity = Ke;
p.includes = K.includes;
p.indexOf = x.indexOf;
p.inRange = Wh.inRange;
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
p.last = Et;
p.lastIndexOf = x.lastIndexOf;
p.lowerCase = q.lowerCase;
p.lowerFirst = q.lowerFirst;
p.lt = P.lt;
p.lte = P.lte;
p.max = Je.max;
p.maxBy = Je.maxBy;
p.mean = Je.mean;
p.meanBy = Je.meanBy;
p.min = Je.min;
p.minBy = Je.minBy;
p.stubArray = H.stubArray;
p.stubFalse = H.stubFalse;
p.stubObject = H.stubObject;
p.stubString = H.stubString;
p.stubTrue = H.stubTrue;
p.multiply = Je.multiply;
p.nth = x.nth;
p.noop = H.noop;
p.now = KD.now;
p.pad = q.pad;
p.padEnd = q.padEnd;
p.padStart = q.padStart;
p.parseInt = q.parseInt;
p.random = Wh.random;
p.reduce = K.reduce;
p.reduceRight = K.reduceRight;
p.repeat = q.repeat;
p.replace = q.replace;
p.result = N.result;
p.round = Je.round;
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
p.subtract = Je.subtract;
p.sum = Je.sum;
p.sumBy = Je.sumBy;
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
qh(p, function() {
  var e = {};
  return Tn(p, function(t, n) {
    aw.call(p.prototype, n) || (e[n] = t);
  }), e;
}(), { chain: !1 });
p.VERSION = iC;
(p.templateSettings = q.templateSettings).imports._ = p;
Vt(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(e) {
  p[e].placeholder = p;
});
Vt(["drop", "take"], function(e, t) {
  C.prototype[e] = function(n) {
    n = n === void 0 ? 1 : cC(I(n), 0);
    var r = this.__filtered__ && !t ? new C(this) : this.clone();
    return r.__filtered__ ? r.__takeCount__ = A_(n, r.__takeCount__) : r.__views__.push({
      size: A_(n, ow),
      type: e + (r.__dir__ < 0 ? "Right" : "")
    }), r;
  }, C.prototype[e + "Right"] = function(n) {
    return this.reverse()[e](n).reverse();
  };
});
Vt(["filter", "map", "takeWhile"], function(e, t) {
  var n = t + 1, r = n == oC || n == aC;
  C.prototype[e] = function(i) {
    var s = this.clone();
    return s.__iteratees__.push({
      iteratee: $(i),
      type: n
    }), s.__filtered__ = s.__filtered__ || r, s;
  };
});
Vt(["head", "last"], function(e, t) {
  var n = "take" + (t ? "Right" : "");
  C.prototype[e] = function() {
    return this[n](1).value()[0];
  };
});
Vt(["initial", "tail"], function(e, t) {
  var n = "drop" + (t ? "" : "Right");
  C.prototype[e] = function() {
    return this.__filtered__ ? new C(this) : this[n](1);
  };
});
C.prototype.compact = function() {
  return this.filter(Ke);
};
C.prototype.find = function(e) {
  return this.filter(e).head();
};
C.prototype.findLast = function(e) {
  return this.reverse().find(e);
};
C.prototype.invokeMap = D(function(e, t) {
  return typeof e == "function" ? new C(this) : this.map(function(n) {
    return jo(n, e, t);
  });
});
C.prototype.reject = function(e) {
  return this.filter(Fo($(e)));
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
  return this.take(ow);
};
Tn(C.prototype, function(e, t) {
  var n = /^(?:filter|find|map|reject)|While$/.test(t), r = /^(?:head|last)$/.test(t), i = p[r ? "take" + (t == "last" ? "Right" : "") : t], s = r || /^find/.test(t);
  i && (p.prototype[t] = function() {
    var o = this.__wrapped__, a = r ? [1] : arguments, u = o instanceof C, f = a[0], c = u || M(o), l = function(y) {
      var b = i.apply(p, Ar([y], a));
      return r && h ? b[0] : b;
    };
    c && n && typeof f == "function" && f.length != 1 && (u = c = !1);
    var h = this.__chain__, d = !!this.__actions__.length, _ = s && !h, v = u && !d;
    if (!s && c) {
      o = v ? o : new C(this);
      var g = e.apply(o, a);
      return g.__actions__.push({ func: Uo, args: [l], thisArg: void 0 }), new Bt(g, h);
    }
    return _ && v ? e.apply(this, a) : (g = this.thru(l), _ ? r ? g.value()[0] : g.value() : g);
  });
});
Vt(["pop", "push", "shift", "sort", "splice", "unshift"], function(e) {
  var t = uC[e], n = /^(?:push|sort|unshift)$/.test(e) ? "tap" : "thru", r = /^(?:pop|shift)$/.test(e);
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
Tn(C.prototype, function(e, t) {
  var n = p[t];
  if (n) {
    var r = n.name + "";
    aw.call(Ri, r) || (Ri[r] = []), Ri[r].push({ name: t, func: n });
  }
});
Ri[Lu(void 0, sC).name] = [{
  name: "wrapper",
  func: void 0
}];
C.prototype.clone = YD;
C.prototype.reverse = XD;
C.prototype.value = rC;
p.prototype.at = Pn.at;
p.prototype.chain = Pn.wrapperChain;
p.prototype.commit = Pn.commit;
p.prototype.next = Pn.next;
p.prototype.plant = Pn.plant;
p.prototype.reverse = Pn.reverse;
p.prototype.toJSON = p.prototype.valueOf = p.prototype.value = Pn.value;
p.prototype.first = p.prototype.head;
w_ && (p.prototype[w_] = Pn.toIterator);
const N4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: fg,
  after: hg,
  ary: Wl,
  assign: Pg,
  assignIn: Nc,
  assignInWith: Xs,
  assignWith: Ng,
  at: Mg,
  attempt: Xl,
  before: Jl,
  bind: Mo,
  bindAll: Dg,
  bindKey: Vu,
  camelCase: t0,
  capitalize: Zl,
  castArray: n0,
  ceil: r0,
  chain: ih,
  chunk: i0,
  clamp: s0,
  clone: v0,
  cloneDeep: Gu,
  cloneDeepWith: g0,
  cloneWith: y0,
  commit: Lc,
  compact: b0,
  concat: m0,
  cond: T0,
  conforms: P0,
  conformsTo: N0,
  constant: Iu,
  countBy: I0,
  create: D0,
  curry: Xu,
  curryRight: Ju,
  debounce: gh,
  deburr: th,
  default: p,
  defaultTo: C0,
  defaults: j0,
  defaultsDeep: B0,
  defer: U0,
  delay: k0,
  difference: V0,
  differenceBy: W0,
  differenceWith: q0,
  divide: G0,
  drop: H0,
  dropRight: K0,
  dropRightWhile: Y0,
  dropWhile: X0,
  each: Bc,
  eachRight: zc,
  endsWith: Q0,
  entries: Uc,
  entriesIn: kc,
  eq: Wt,
  escape: Ah,
  escapeRegExp: ry,
  every: sy,
  extend: Nc,
  extendWith: Xs,
  fill: oy,
  filter: uy,
  find: cy,
  findIndex: Eh,
  findKey: hy,
  findLast: py,
  findLastIndex: Sh,
  findLastKey: dy,
  first: Vc,
  flatMap: vy,
  flatMapDeep: gy,
  flatMapDepth: yy,
  flatten: Yl,
  flattenDeep: by,
  flattenDepth: my,
  flip: wy,
  floor: Ay,
  flow: Ey,
  flowRight: Sy,
  forEach: Bc,
  forEachRight: zc,
  forIn: xy,
  forInRight: Ty,
  forOwn: Ry,
  forOwnRight: Py,
  fromPairs: Ny,
  functions: $y,
  functionsIn: My,
  get: zu,
  groupBy: Iy,
  gt: Dy,
  gte: Cy,
  has: Ly,
  hasIn: Ku,
  head: Vc,
  identity: Ke,
  inRange: jy,
  includes: Fy,
  indexOf: By,
  initial: zy,
  intersection: Uy,
  intersectionBy: ky,
  intersectionWith: Vy,
  invert: qy,
  invertBy: Hy,
  invoke: Yy,
  invokeMap: Xy,
  isArguments: hr,
  isArray: M,
  isArrayBuffer: Jy,
  isArrayLike: Ye,
  isArrayLikeObject: fe,
  isBoolean: Zy,
  isBuffer: Gn,
  isDate: Qy,
  isElement: eb,
  isEmpty: tb,
  isEqual: Ni,
  isEqualWith: nb,
  isError: ku,
  isFinite: rb,
  isFunction: En,
  isInteger: Nh,
  isLength: Po,
  isMap: uh,
  isMatch: ib,
  isMatchWith: sb,
  isNaN: ob,
  isNative: ab,
  isNil: ub,
  isNull: fb,
  isNumber: $h,
  isObject: se,
  isObjectLike: oe,
  isPlainObject: is,
  isRegExp: nf,
  isSafeInteger: cb,
  isSet: fh,
  isString: Lo,
  isSymbol: st,
  isTypedArray: ii,
  isUndefined: lb,
  isWeakMap: hb,
  isWeakSet: pb,
  iteratee: db,
  join: _b,
  kebabCase: vb,
  keyBy: gb,
  keys: ve,
  keysIn: Xe,
  last: Et,
  lastIndexOf: yb,
  lodash: p,
  lowerCase: bb,
  lowerFirst: mb,
  lt: wb,
  lte: Ab,
  map: Co,
  mapKeys: Ob,
  mapValues: Eb,
  matches: Sb,
  matchesProperty: xb,
  max: Tb,
  maxBy: Rb,
  mean: Nb,
  meanBy: $b,
  memoize: $o,
  merge: Mb,
  mergeWith: bh,
  method: Ib,
  methodOf: Db,
  min: Cb,
  minBy: Lb,
  mixin: jb,
  multiply: Fb,
  negate: Fo,
  next: Wc,
  noop: Mu,
  now: Ds,
  nth: zb,
  nthArg: Ub,
  omit: kb,
  omitBy: Wb,
  once: qb,
  orderBy: Kb,
  over: Yb,
  overArgs: Xb,
  overEvery: Jb,
  overSome: Zb,
  pad: sm,
  padEnd: om,
  padStart: am,
  parseInt: um,
  partial: zo,
  partialRight: sf,
  partition: fm,
  pick: cm,
  pickBy: Lh,
  plant: Kc,
  property: _h,
  propertyOf: lm,
  pull: hm,
  pullAll: Bh,
  pullAllBy: pm,
  pullAllWith: dm,
  pullAt: vm,
  random: gm,
  range: bm,
  rangeRight: mm,
  rearg: wm,
  reduce: Om,
  reduceRight: Em,
  reject: Sm,
  remove: xm,
  repeat: Tm,
  replace: Rm,
  rest: Pm,
  result: Nm,
  reverse: Ya,
  round: $m,
  sample: Im,
  sampleSize: Dm,
  set: Cm,
  setWith: Lm,
  shuffle: jm,
  size: Fm,
  slice: Bm,
  snakeCase: zm,
  some: Um,
  sortBy: km,
  sortedIndex: Vm,
  sortedIndexBy: Wm,
  sortedIndexOf: qm,
  sortedLastIndex: Gm,
  sortedLastIndexBy: Hm,
  sortedLastIndexOf: Km,
  sortedUniq: Xm,
  sortedUniqBy: Jm,
  split: Zm,
  spread: Qm,
  startCase: e1,
  startsWith: t1,
  stubArray: qu,
  stubFalse: ju,
  stubObject: n1,
  stubString: r1,
  stubTrue: i1,
  subtract: s1,
  sum: o1,
  sumBy: a1,
  tail: u1,
  take: f1,
  takeRight: c1,
  takeRightWhile: l1,
  takeWhile: h1,
  tap: p1,
  template: v1,
  templateSettings: Xa,
  throttle: g1,
  thru: Uo,
  times: y1,
  toArray: Dh,
  toFinite: vn,
  toInteger: I,
  toIterator: Yc,
  toJSON: Rs,
  toLength: Oh,
  toLower: m1,
  toNumber: vt,
  toPairs: Uc,
  toPairsIn: kc,
  toPath: w1,
  toPlainObject: yh,
  toSafeInteger: A1,
  toString: W,
  toUpper: O1,
  transform: E1,
  trim: T1,
  trimEnd: R1,
  trimStart: P1,
  truncate: N1,
  unary: $1,
  unescape: I1,
  union: D1,
  unionBy: C1,
  unionWith: L1,
  uniq: j1,
  uniqBy: F1,
  uniqWith: B1,
  uniqueId: z1,
  unset: U1,
  unzip: uf,
  unzipWith: kh,
  update: V1,
  updateWith: W1,
  upperCase: q1,
  upperFirst: Wu,
  value: Rs,
  valueOf: Rs,
  values: ai,
  valuesIn: G1,
  without: H1,
  words: nh,
  wrap: K1,
  wrapperAt: Y1,
  wrapperChain: X1,
  wrapperCommit: Lc,
  wrapperLodash: p,
  wrapperNext: Wc,
  wrapperPlant: Kc,
  wrapperReverse: J1,
  wrapperToIterator: Yc,
  wrapperValue: Rs,
  xor: Z1,
  xorBy: Q1,
  xorWith: ew,
  zip: tw,
  zipObject: rw,
  zipObjectDeep: iw,
  zipWith: sw
}, Symbol.toStringTag, { value: "Module" }));
function uw(e) {
  return [parseInt(e.substr(1, 2), 16), parseInt(e.substr(3, 2), 16), parseInt(e.substr(5, 2), 16)];
}
function nc(e) {
  const t = Math.round(e).toString(16);
  return t.length === 1 ? `0${t}` : t;
}
function fw(e) {
  return `#${nc(e[0])}${nc(e[1])}${nc(e[2])}`;
}
const lC = /rgba?\(([\s.,0-9]+)\)/;
function hC() {
  const e = document.createElement("i");
  return e.title = "Web Colour Picker", e.style.display = "none", document.body.appendChild(e), e;
}
let ga;
function cw(e) {
  if (e[0] === "#" && e.length === 7)
    return e;
  ga || (ga = hC()), ga.style.color = e;
  let t = document.defaultView.getComputedStyle(ga, "").getPropertyValue("color");
  const r = lC.exec(t)[1].split(/\s*,\s*/).map((i) => Number(i));
  return t = fw(r), t;
}
function rc(e, t, n, r) {
  return e[r] + (t[r] - e[r]) * n;
}
function pC(e, t) {
  const n = isNaN(Number(t)) || t < 0 ? 0 : t > 1 ? 1 : Number(t), r = e.length - 1, i = Math.floor(r * n), s = r * n - i, o = e[i], a = i === r ? o : e[i + 1];
  return fw([rc(o, a, s, 0), rc(o, a, s, 1), rc(o, a, s, 2)]);
}
function dC(e) {
  const n = (typeof e == "string" ? e.split("-") : e).map((r) => uw(r.indexOf("#") === -1 ? cw(r) : r));
  return (r) => pC(n, r);
}
const _C = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i, vC = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i, gC = /[\d.]+:(#[^\s]+|[^)]+\))/gi;
function yC(e) {
  return /^[r,R,L,l]{1}[\s]*\(/.test(e);
}
function bC(e) {
  if (yC(e)) {
    let t = "", n;
    if (e[0] === "l") {
      const i = _C.exec(e), s = +i[1] + 90;
      n = i[2], t = `linear-gradient(${s}deg, `;
    } else e[0] === "r" && (t = "radial-gradient(", n = vC.exec(e)[4]);
    const r = n.match(gC);
    return r.forEach((i, s) => {
      const o = i.split(":");
      t += `${o[1]} ${Number(o[0]) * 100}%`, s !== r.length - 1 && (t += ", ");
    }), t += ")", t;
  }
  return e;
}
var O_ = typeof Float32Array < "u" ? Float32Array : Array;
function ff(e, t, n) {
  var r = t[0], i = t[1], s = t[2], o = t[3], a = t[4], u = t[5], f = t[6], c = t[7], l = t[8], h = n[0], d = n[1], _ = n[2], v = n[3], g = n[4], y = n[5], b = n[6], w = n[7], m = n[8];
  return e[0] = h * r + d * o + _ * f, e[1] = h * i + d * a + _ * c, e[2] = h * s + d * u + _ * l, e[3] = v * r + g * o + y * f, e[4] = v * i + g * a + y * c, e[5] = v * s + g * u + y * l, e[6] = b * r + w * o + m * f, e[7] = b * i + w * a + m * c, e[8] = b * s + w * u + m * l, e;
}
function mC(e, t) {
  return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = t[0], e[7] = t[1], e[8] = 1, e;
}
function wC(e, t) {
  var n = Math.sin(t), r = Math.cos(t);
  return e[0] = r, e[1] = n, e[2] = 0, e[3] = -n, e[4] = r, e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
}
function AC(e, t) {
  return e[0] = t[0], e[1] = 0, e[2] = 0, e[3] = 0, e[4] = t[1], e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
}
function OC() {
  var e = new O_(2);
  return O_ != Float32Array && (e[0] = 0, e[1] = 0), e;
}
function EC(e, t) {
  var n = e[0], r = e[1], i = t[0], s = t[1];
  return Math.abs(Math.atan2(r * i - n * s, n * i + r * s));
}
(function() {
  var e = OC();
  return function(t, n, r, i, s, o) {
    var a, u;
    for (n || (n = 2), r || (r = 0), i ? u = Math.min(i * n + r, t.length) : u = t.length, a = r; a < u; a += n)
      e[0] = t[a], e[1] = t[a + 1], s(e, e, o), t[a] = e[0], t[a + 1] = e[1];
    return t;
  };
})();
function SC(e, t, n) {
  const r = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return mC(r, n), ff(e, r, t);
}
function xC(e, t, n) {
  const r = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return wC(r, n), ff(e, r, t);
}
function TC(e, t, n) {
  const r = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return AC(r, n), ff(e, r, t);
}
function RC(e, t, n) {
  return ff(e, n, t);
}
function PC(e, t) {
  const n = e ? [].concat(e) : [1, 0, 0, 0, 1, 0, 0, 0, 1];
  for (let r = 0, i = t.length; r < i; r++) {
    const s = t[r];
    switch (s[0]) {
      case "t":
        SC(n, n, [s[1], s[2]]);
        break;
      case "s":
        TC(n, n, [s[1], s[2]]);
        break;
      case "r":
        xC(n, n, s[1]);
        break;
      case "m":
        RC(n, n, s[1]);
        break;
    }
  }
  return n;
}
function lw(e, t) {
  return e[0] * t[1] - t[0] * e[1];
}
function NC(e, t, n) {
  const r = EC(e, t), i = lw(e, t) >= 0;
  return n ? i ? Math.PI * 2 - r : r : i ? r : Math.PI * 2 - r;
}
function $C(e, t, n) {
  return n ? (e[0] = t[1], e[1] = -1 * t[0]) : (e[0] = -1 * t[1], e[1] = t[0]), e;
}
function us(e) {
  return e.map((t) => Array.isArray(t) ? [].concat(t) : t);
}
function MC(e, t) {
  if (t === "off") return us(e);
  const n = typeof t == "number" && t >= 1 ? 10 ** t : 1;
  return e.map((r) => {
    const i = r.slice(1).map(Number).map((s) => t ? Math.round(s * n) / n : Math.round(s));
    return [r[0]].concat(i);
  });
}
function IC(e, t = "off") {
  return MC(e, t).map((n) => n[0] + n.slice(1).join(" ")).join("");
}
const hw = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
};
function DC(e, t, n) {
  if (e[n].length > 7) {
    e[n].shift();
    const r = e[n];
    let i = n;
    for (; r.length; )
      t[n] = "A", e.splice(i += 1, 0, ["C"].concat(r.splice(0, 6)));
    e.splice(n, 1);
  }
}
const Cs = {
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
function pw(e) {
  return Array.isArray(e) && e.every((t) => {
    const n = t[0].toLowerCase();
    return Cs[n] === t.length - 1 && "achlmqstvz".includes(n);
  });
}
function dw(e) {
  return pw(e) && // @ts-ignore -- `isPathArray` also checks if it's `Array`
  e.every(([t]) => t === t.toUpperCase());
}
function _w(e) {
  return dw(e) && e.every(([t]) => "ACLMQZ".includes(t));
}
function E_(e) {
  let t = e.pathValue[e.segmentStart], n = t.toLowerCase();
  const { data: r } = e;
  for (; r.length >= Cs[n] && (n === "m" && r.length > 2 ? (e.segments.push([t].concat(r.splice(0, 2))), n = "l", t = t === "m" ? "l" : "L") : e.segments.push([t].concat(r.splice(0, Cs[n]))), !!Cs[n]); )
    ;
}
function CC(e) {
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
function LC(e) {
  return e >= 48 && e <= 57 || e === 43 || e === 45 || e === 46;
}
function bi(e) {
  return e >= 48 && e <= 57;
}
function jC(e) {
  const { max: t, pathValue: n, index: r } = e;
  let i = r, s = !1, o = !1, a = !1, u = !1, f;
  if (i >= t) {
    e.err = `[path-util]: Invalid path value at index ${i}, "pathValue" is missing param`;
    return;
  }
  if (f = n.charCodeAt(i), (f === 43 || f === 45) && (i += 1, f = n.charCodeAt(i)), !bi(f) && f !== 46) {
    e.err = `[path-util]: Invalid path value at index ${i}, "${n[i]}" is not a number`;
    return;
  }
  if (f !== 46) {
    if (s = f === 48, i += 1, f = n.charCodeAt(i), s && i < t && f && bi(f)) {
      e.err = `[path-util]: Invalid path value at index ${r}, "${n[r]}" illegal number`;
      return;
    }
    for (; i < t && bi(n.charCodeAt(i)); )
      i += 1, o = !0;
    f = n.charCodeAt(i);
  }
  if (f === 46) {
    for (u = !0, i += 1; bi(n.charCodeAt(i)); )
      i += 1, a = !0;
    f = n.charCodeAt(i);
  }
  if (f === 101 || f === 69) {
    if (u && !o && !a) {
      e.err = `[path-util]: Invalid path value at index ${i}, "${n[i]}" invalid float exponent`;
      return;
    }
    if (i += 1, f = n.charCodeAt(i), (f === 43 || f === 45) && (i += 1), i < t && bi(n.charCodeAt(i)))
      for (; i < t && bi(n.charCodeAt(i)); )
        i += 1;
    else {
      e.err = `[path-util]: Invalid path value at index ${i}, "${n[i]}" invalid integer exponent`;
      return;
    }
  }
  e.index = i, e.param = +e.pathValue.slice(r, i);
}
function FC(e) {
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
function La(e) {
  const { pathValue: t, max: n } = e;
  for (; e.index < n && FC(t.charCodeAt(e.index)); )
    e.index += 1;
}
function BC(e) {
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
function zC(e) {
  return (e | 32) === 97;
}
function UC(e) {
  const { max: t, pathValue: n, index: r } = e, i = n.charCodeAt(r), s = Cs[n[r].toLowerCase()];
  if (e.segmentStart = r, !BC(i)) {
    e.err = `[path-util]: Invalid path value "${n[r]}" is not a path command`;
    return;
  }
  if (e.index += 1, La(e), e.data = [], !s) {
    E_(e);
    return;
  }
  for (; ; ) {
    for (let o = s; o > 0; o -= 1) {
      if (zC(i) && (o === 3 || o === 4) ? CC(e) : jC(e), e.err.length)
        return;
      e.data.push(e.param), La(e), e.index < t && n.charCodeAt(e.index) === 44 && (e.index += 1, La(e));
    }
    if (e.index >= e.max || !LC(n.charCodeAt(e.index)))
      break;
  }
  E_(e);
}
class kC {
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
function Gh(e) {
  if (pw(e))
    return us(e);
  const t = new kC(e);
  for (La(t); t.index < t.max && !t.err.length; )
    UC(t);
  return t.err ? t.err : t.segments;
}
function vw(e) {
  if (dw(e))
    return us(e);
  const t = Gh(e);
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
function VC(e, t) {
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
function cf(e) {
  if (_w(e))
    return us(e);
  const t = vw(e), n = { ...hw }, r = t.length;
  let i = "";
  for (let s = 0; s < r; s += 1) {
    [i] = t[s], t[s] = VC(t[s], n);
    const o = t[s], a = o.length;
    n.x1 = +o[a - 2], n.y1 = +o[a - 1], n.x2 = +o[a - 4] || n.x1, n.y2 = +o[a - 3] || n.y1;
  }
  return t;
}
function WC(e) {
  return _w(e) && e.every(([t]) => "MC".includes(t));
}
function ya(e, t, n) {
  const r = e * Math.cos(n) - t * Math.sin(n), i = e * Math.sin(n) + t * Math.cos(n);
  return { x: r, y: i };
}
function gw(e, t, n, r, i, s, o, a, u, f) {
  let c = e, l = t, h = n, d = r, _ = a, v = u;
  const g = Math.PI * 120 / 180, y = Math.PI / 180 * (+i || 0);
  let b = [], w, m, A, S, R;
  if (f)
    [m, A, S, R] = f;
  else {
    w = ya(c, l, -y), c = w.x, l = w.y, w = ya(_, v, -y), _ = w.x, v = w.y;
    const be = (c - _) / 2, Kt = (l - v) / 2;
    let Mr = be * be / (h * h) + Kt * Kt / (d * d);
    Mr > 1 && (Mr = Math.sqrt(Mr), h *= Mr, d *= Mr);
    const Kf = h * h, Yf = d * d, pd = (s === o ? -1 : 1) * Math.sqrt(Math.abs((Kf * Yf - Kf * Kt * Kt - Yf * be * be) / (Kf * Kt * Kt + Yf * be * be)));
    S = pd * h * Kt / d + (c + _) / 2, R = pd * -d * be / h + (l + v) / 2, m = Math.asin(((l - R) / d * 10 ** 9 >> 0) / 10 ** 9), A = Math.asin(((v - R) / d * 10 ** 9 >> 0) / 10 ** 9), m = c < S ? Math.PI - m : m, A = _ < S ? Math.PI - A : A, m < 0 && (m = Math.PI * 2 + m), A < 0 && (A = Math.PI * 2 + A), o && m > A && (m -= Math.PI * 2), !o && A > m && (A -= Math.PI * 2);
  }
  let B = A - m;
  if (Math.abs(B) > g) {
    const be = A, Kt = _, Mr = v;
    A = m + g * (o && A > m ? 1 : -1), _ = S + h * Math.cos(A), v = R + d * Math.sin(A), b = gw(_, v, h, d, i, 0, o, Kt, Mr, [A, be, S, R]);
  }
  B = A - m;
  const In = Math.cos(m), la = Math.sin(m), un = Math.cos(A), ha = Math.sin(A), bs = Math.tan(B / 4), pa = 4 / 3 * h * bs, da = 4 / 3 * d * bs, Dn = [c, l], Cn = [c + pa * la, l - da * In], ms = [_ + pa * ha, v - da * un], ws = [_, v];
  if (Cn[0] = 2 * Dn[0] - Cn[0], Cn[1] = 2 * Dn[1] - Cn[1], f)
    return Cn.concat(ms, ws, b);
  b = Cn.concat(ms, ws, b);
  const Hf = [];
  for (let be = 0, Kt = b.length; be < Kt; be += 1)
    Hf[be] = be % 2 ? ya(b[be - 1], b[be], y).y : ya(b[be], b[be + 1], y).x;
  return Hf;
}
function qC(e, t, n, r, i, s) {
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
function $t(e, t, n) {
  const r = e[0], i = e[1], s = t[0], o = t[1];
  return [r + (s - r) * n, i + (o - i) * n];
}
function fs(e, t) {
  return Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1]));
}
function eo(e, t, n, r, i) {
  const s = fs([e, t], [n, r]);
  let o = { x: 0, y: 0 };
  if (typeof i == "number")
    if (i <= 0)
      o = { x: e, y: t };
    else if (i >= s)
      o = { x: n, y: r };
    else {
      const [a, u] = $t([e, t], [n, r], i / s);
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
function S_(e, t, n, r) {
  const s = [e, t], o = [n, r], a = $t(s, o, 0.5), u = $t(o, a, 0.5), f = $t(a, u, 0.5), c = $t(u, f, 0.5), l = $t(f, c, 0.5), h = eo(s[0], s[1], a[0], a[1], f[0]).point, d = eo(l[0], l[1], c[0], c[1], u[0]).point;
  return [h.x, h.y, d.x, d.y, n, r];
}
function GC(e, t) {
  const [n] = e, r = e.slice(1).map(Number), [i, s] = r;
  let o;
  const { x1: a, y1: u, x: f, y: c } = t;
  switch ("TQ".includes(n) || (t.qx = null, t.qy = null), n) {
    case "M":
      return t.x = i, t.y = s, e;
    case "A":
      return o = [a, u].concat(r), ["C"].concat(
        gw(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9])
      );
    case "Q":
      return t.qx = i, t.qy = s, o = [a, u].concat(r), ["C"].concat(qC(o[0], o[1], o[2], o[3], o[4], o[5]));
    case "L":
      return ["C"].concat(S_(a, u, i, s));
    case "Z":
      return a === f && u === c ? ["C", a, u, f, c, f, c] : ["C"].concat(S_(a, u, f, c));
  }
  return e;
}
function yw(e, t = !1) {
  if (WC(e)) {
    const c = us(e);
    return t ? [c, []] : c;
  }
  const n = cf(e), r = { ...hw }, i = [];
  let s = "", o = n.length, a, u;
  const f = [];
  for (let c = 0; c < o; c += 1) {
    n[c] && ([s] = n[c]), i[c] = s;
    const l = GC(n[c], r);
    n[c] = l, DC(n, i, c), o = n.length, s === "Z" && f.push(c), a = n[c], u = a.length, r.x1 = +a[u - 2], r.y1 = +a[u - 1], r.x2 = +a[u - 4] || r.x1, r.y2 = +a[u - 3] || r.y1;
  }
  return t ? [n, f] : n;
}
function HC(e) {
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
function x_(e, t) {
  const { x: n, y: r } = e, { x: i, y: s } = t, o = n * i + r * s, a = Math.sqrt((n ** 2 + r ** 2) * (i ** 2 + s ** 2));
  return (n * s - r * i < 0 ? -1 : 1) * Math.acos(o / a);
}
function KC(e, t, n, r, i, s, o, a, u, f) {
  const { abs: c, sin: l, cos: h, sqrt: d, PI: _ } = Math;
  let v = c(n), g = c(r);
  const b = (i % 360 + 360) % 360 * (_ / 180);
  if (e === a && t === u)
    return { x: e, y: t };
  if (v === 0 || g === 0)
    return eo(e, t, a, u, f).point;
  const w = (e - a) / 2, m = (t - u) / 2, A = {
    x: h(b) * w + l(b) * m,
    y: -l(b) * w + h(b) * m
  }, S = A.x ** 2 / v ** 2 + A.y ** 2 / g ** 2;
  S > 1 && (v *= d(S), g *= d(S));
  const R = v ** 2 * g ** 2 - v ** 2 * A.y ** 2 - g ** 2 * A.x ** 2, B = v ** 2 * A.y ** 2 + g ** 2 * A.x ** 2;
  let In = R / B;
  In = In < 0 ? 0 : In;
  const la = (s !== o ? 1 : -1) * d(In), un = {
    x: la * (v * A.y / g),
    y: la * (-(g * A.x) / v)
  }, ha = {
    x: h(b) * un.x - l(b) * un.y + (e + a) / 2,
    y: l(b) * un.x + h(b) * un.y + (t + u) / 2
  }, bs = {
    x: (A.x - un.x) / v,
    y: (A.y - un.y) / g
  }, pa = x_({ x: 1, y: 0 }, bs), da = {
    x: (-A.x - un.x) / v,
    y: (-A.y - un.y) / g
  };
  let Dn = x_(bs, da);
  !o && Dn > 0 ? Dn -= 2 * _ : o && Dn < 0 && (Dn += 2 * _), Dn %= 2 * _;
  const Cn = pa + Dn * f, ms = v * h(Cn), ws = g * l(Cn);
  return {
    x: h(b) * ms - l(b) * ws + ha.x,
    y: l(b) * ms + h(b) * ws + ha.y
  };
}
function YC(e, t, n, r, i, s, o, a, u, f) {
  const c = typeof f == "number";
  let l = e, h = t, d = 0, _ = [l, h, d], v = [l, h], g = 0, y = { x: 0, y: 0 }, b = [{ x: l, y: h }];
  c && f <= 0 && (y = { x: l, y: h });
  const w = 100;
  for (let m = 0; m <= w; m += 1) {
    if (g = m / w, { x: l, y: h } = KC(e, t, n, r, i, s, o, a, u, g), b = b.concat({ x: l, y: h }), d += fs(v, [l, h]), v = [l, h], c && d >= f && f > _[2]) {
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
function XC(e, t, n, r, i, s, o, a, u) {
  const f = 1 - u;
  return {
    x: f ** 3 * e + 3 * f ** 2 * u * n + 3 * f * u ** 2 * i + u ** 3 * o,
    y: f ** 3 * t + 3 * f ** 2 * u * r + 3 * f * u ** 2 * s + u ** 3 * a
  };
}
function bw(e, t, n, r, i, s, o, a, u) {
  const f = typeof u == "number";
  let c = e, l = t, h = 0, d = [c, l, h], _ = [c, l], v = 0, g = { x: 0, y: 0 }, y = [{ x: c, y: l }];
  f && u <= 0 && (g = { x: c, y: l });
  const b = 30;
  for (let w = 0; w <= b; w += 1) {
    if (v = w / b, { x: c, y: l } = XC(e, t, n, r, i, s, o, a, v), y = y.concat({ x: c, y: l }), h += fs(_, [c, l]), _ = [c, l], f && h >= u && u > d[2]) {
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
function JC(e, t, n, r, i, s, o) {
  const a = 1 - o;
  return {
    x: a ** 2 * e + 2 * a * o * n + o ** 2 * i,
    y: a ** 2 * t + 2 * a * o * r + o ** 2 * s
  };
}
function ZC(e, t, n, r, i, s, o) {
  const a = typeof o == "number";
  let u = e, f = t, c = 0, l = [u, f, c], h = [u, f], d = 0, _ = { x: 0, y: 0 }, v = [{ x: u, y: f }];
  a && o <= 0 && (_ = { x: u, y: f });
  const g = 30;
  for (let y = 0; y <= g; y += 1) {
    if (d = y / g, { x: u, y: f } = JC(e, t, n, r, i, s, d), v = v.concat({ x: u, y: f }), c += fs(h, [u, f]), h = [u, f], a && c >= o && o > l[2]) {
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
function lf(e, t) {
  const n = cf(e), r = typeof t == "number";
  let i, s = [], o, a = 0, u = 0, f = 0, c = 0, l, h = [], d = [], _ = 0, v = { x: 0, y: 0 }, g = v, y = v, b = v, w = 0;
  for (let m = 0, A = n.length; m < A; m += 1)
    l = n[m], [o] = l, i = o === "M", s = i ? s : [a, u].concat(l.slice(1)), i ? ([, f, c] = l, v = { x: f, y: c }, g = v, _ = 0, r && t < 1e-3 && (b = v)) : o === "L" ? { length: _, min: v, max: g, point: y } = eo(s[0], s[1], s[2], s[3], (t || 0) - w) : o === "A" ? { length: _, min: v, max: g, point: y } = YC(
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
    ) : o === "C" ? { length: _, min: v, max: g, point: y } = bw(
      s[0],
      s[1],
      s[2],
      s[3],
      s[4],
      s[5],
      s[6],
      s[7],
      (t || 0) - w
    ) : o === "Q" ? { length: _, min: v, max: g, point: y } = ZC(
      s[0],
      s[1],
      s[2],
      s[3],
      s[4],
      s[5],
      (t || 0) - w
    ) : o === "Z" && (s = [a, u, f, c], { length: _, min: v, max: g, point: y } = eo(s[0], s[1], s[2], s[3], (t || 0) - w)), r && w < t && w + _ >= t && (b = y), d.push(g), h.push(v), w += _, [a, u] = o !== "Z" ? l.slice(-2) : [f, c];
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
function QC(e) {
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
  } = lf(e), s = r - t, o = i - n;
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
function Ls(e) {
  return lf(e).length;
}
function eL(e) {
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
  } = lf(e), o = i - n, a = s - r;
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
function tL(e) {
  const t = e.length, n = t - 1;
  return e.map(
    (r, i) => e.map((s, o) => {
      let a = i + o, u;
      return o === 0 || e[a] && e[a][0] === "M" ? (u = e[a], ["M"].concat(u.slice(-2))) : (a >= t && (a -= n), e[a]);
    })
  );
}
function nL(e, t) {
  const n = e.length - 1, r = [];
  let i = 0, s = 0;
  const o = tL(e);
  return o.forEach((a, u) => {
    e.slice(1).forEach((f, c) => {
      s += fs(e[(u + c) % n].slice(-2), t[c % n].slice(-2));
    }), r[u] = s, s = 0;
  }), i = r.indexOf(Math.min.apply(null, r)), o[i];
}
function rL(e, t, n, r, i, s, o, a) {
  return 3 * ((a - t) * (n + i) - (o - e) * (r + s) + r * (e - i) - n * (t - s) + a * (i + e / 3) - o * (s + t / 3)) / 20;
}
function mw(e) {
  let t = 0, n = 0, r = 0;
  return yw(e).map((i) => {
    switch (i[0]) {
      case "M":
        return [, t, n] = i, 0;
      default:
        const [s, o, a, u, f, c] = i.slice(1);
        return r = rL(t, n, s, o, a, u, f, c), [t, n] = i.slice(-2), r;
    }
  }).reduce((i, s) => i + s, 0);
}
function iL(e) {
  return mw(e) >= 0;
}
function ja(e, t) {
  return lf(e, t).point;
}
function sL(e, t) {
  const n = Gh(e);
  if (typeof n == "string")
    throw TypeError(n);
  let r = n.slice(), i = Ls(r), s = r.length - 1, o = 0, a = 0, u = n[0];
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
    return r = n.slice(0, -1), o = Ls(r), a = i - o, {
      segment: n[s],
      index: s,
      length: a,
      lengthAtSegment: o
    };
  const h = [];
  for (; s > 0; )
    u = r[s], r = r.slice(0, -1), o = Ls(r), a = i - o, i = o, h.push({
      segment: u,
      index: s,
      length: a,
      lengthAtSegment: o
    }), s -= 1;
  return h.find(({ lengthAtSegment: d }) => d <= t);
}
function oL(e, t) {
  const n = Gh(e), r = cf(n), i = Ls(n), s = (m) => {
    const A = m.x - t.x, S = m.y - t.y;
    return A * A + S * S;
  };
  let o = 8, a, u = 0, f = { x: 0, y: 0 }, c = 0, l = 1 / 0;
  for (let m = 0; m <= i; m += o)
    a = ja(r, m), u = s(a), u < l && (f = a, c = m, l = u);
  o /= 2;
  let h, d, _ = 0, v = 0, g = 0, y = 0;
  for (; o > 0.5; )
    _ = c - o, h = ja(r, _), g = s(h), v = c + o, d = ja(r, v), y = s(d), _ >= 0 && g < l ? (f = h, c = _, l = g) : v <= i && y < l ? (f = d, c = v, l = y) : o /= 2;
  const b = sL(n, c), w = Math.sqrt(l);
  return { closest: f, distance: w, segment: b };
}
function aL(e, t) {
  const { distance: n } = oL(e, t);
  return Math.abs(n) < 1e-3;
}
function uL(e, t = 0.5) {
  const n = e.slice(0, 2), r = e.slice(2, 4), i = e.slice(4, 6), s = e.slice(6, 8), o = $t(n, r, t), a = $t(r, i, t), u = $t(i, s, t), f = $t(o, a, t), c = $t(a, u, t), l = $t(f, c, t);
  return [
    // @ts-ignore
    ["C"].concat(o, f, l),
    // @ts-ignore
    ["C"].concat(c, u, s)
  ];
}
function T_(e) {
  return e.map((t, n, r) => {
    const i = n && r[n - 1].slice(-2).concat(t.slice(1)), s = n ? bw(
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
    return n ? o = s ? uL(i) : [t, t] : o = [t], {
      s: t,
      ss: o,
      l: s
    };
  });
}
function ww(e, t, n) {
  const r = T_(e), i = T_(t), s = r.length, o = i.length, a = r.filter((g) => g.l).length, u = i.filter((g) => g.l).length, f = r.filter((g) => g.l).reduce((g, { l: y }) => g + y, 0) / a || 0, c = i.filter((g) => g.l).reduce((g, { l: y }) => g + y, 0) / u || 0, l = n || Math.max(s, o), h = [f, c], d = [l - s, l - o];
  let _ = 0;
  const v = [r, i].map(
    (g, y) => (
      // @ts-ignore
      g.l === l ? g.map((b) => b.s) : g.map((b, w) => (_ = w && d[y] && b.l >= h[y], d[y] -= _ ? 1 : 0, _ ? b.ss : [b.s])).flat()
    )
  );
  return v[0].length === v[1].length ? v : ww(v[0], v[1], l);
}
const $4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angleTo: NC,
  clonePath: us,
  direction: lw,
  distanceSquareRoot: fs,
  equalizeSegments: ww,
  getDrawDirection: iL,
  getPathArea: mw,
  getPathBBox: QC,
  getPathBBoxTotalLength: eL,
  getPointAtLength: ja,
  getRotatedCurve: nL,
  getTotalLength: Ls,
  gradient: dC,
  isPointInStroke: aL,
  normalizePath: cf,
  path2Absolute: vw,
  path2Curve: yw,
  path2String: IC,
  reverseCurve: HC,
  rgb2arr: uw,
  toCSSGradient: bC,
  toRGB: cw,
  transform: PC,
  vertical: $C
}, Symbol.toStringTag, { value: "Module" }));
var hf = Symbol.for("immer-nothing"), $i = Symbol.for("immer-draftable"), k = Symbol.for("immer-state"), Aw = process.env.NODE_ENV !== "production" ? [
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
    const n = Aw[e], r = typeof n == "function" ? n.apply(null, t) : n;
    throw new Error(`[Immer] ${r}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var Wr = Object.getPrototypeOf;
function Hn(e) {
  return !!e && !!e[k];
}
function rn(e) {
  return e ? Ow(e) || Array.isArray(e) || !!e[$i] || !!e.constructor?.[$i] || ko(e) || Vo(e) : !1;
}
var fL = Object.prototype.constructor.toString();
function Ow(e) {
  if (!e || typeof e != "object")
    return !1;
  const t = Wr(e);
  if (t === null)
    return !0;
  const n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return n === Object ? !0 : typeof n == "function" && Function.toString.call(n) === fL;
}
function cL(e) {
  return Hn(e) || le(15, e), e[k].base_;
}
function Fi(e, t) {
  qr(e) === 0 ? Reflect.ownKeys(e).forEach((n) => {
    t(n, e[n], e);
  }) : e.forEach((n, r) => t(r, n, e));
}
function qr(e) {
  const t = e[k];
  return t ? t.type_ : Array.isArray(e) ? 1 : ko(e) ? 2 : Vo(e) ? 3 : 0;
}
function to(e, t) {
  return qr(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function ic(e, t) {
  return qr(e) === 2 ? e.get(t) : e[t];
}
function Ew(e, t, n) {
  const r = qr(e);
  r === 2 ? e.set(t, n) : r === 3 ? e.add(n) : e[t] = n;
}
function lL(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function ko(e) {
  return e instanceof Map;
}
function Vo(e) {
  return e instanceof Set;
}
function me(e) {
  return e.copy_ || e.base_;
}
function Xc(e, t) {
  if (ko(e))
    return new Map(e);
  if (Vo(e))
    return new Set(e);
  if (Array.isArray(e))
    return Array.prototype.slice.call(e);
  const n = Ow(e);
  if (t === !0 || t === "class_only" && !n) {
    const r = Object.getOwnPropertyDescriptors(e);
    delete r[k];
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
    return Object.create(Wr(e), r);
  } else {
    const r = Wr(e);
    if (r !== null && n)
      return { ...e };
    const i = Object.create(r);
    return Object.assign(i, e);
  }
}
function pf(e, t = !1) {
  return df(e) || Hn(e) || !rn(e) || (qr(e) > 1 && (e.set = e.add = e.clear = e.delete = hL), Object.freeze(e), t && Object.entries(e).forEach(([n, r]) => pf(r, !0))), e;
}
function hL() {
  le(2);
}
function df(e) {
  return Object.isFrozen(e);
}
var Jc = {};
function Gr(e) {
  const t = Jc[e];
  return t || le(0, e), t;
}
function Sw(e, t) {
  Jc[e] || (Jc[e] = t);
}
var no;
function Ja() {
  return no;
}
function pL(e, t) {
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
function R_(e, t) {
  t && (Gr("Patches"), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function Zc(e) {
  Qc(e), e.drafts_.forEach(dL), e.drafts_ = null;
}
function Qc(e) {
  e === no && (no = e.parent_);
}
function P_(e) {
  return no = pL(no, e);
}
function dL(e) {
  const t = e[k];
  t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function N_(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const n = t.drafts_[0];
  return e !== void 0 && e !== n ? (n[k].modified_ && (Zc(t), le(4)), rn(e) && (e = Za(t, e), t.parent_ || Qa(t, e)), t.patches_ && Gr("Patches").generateReplacementPatches_(
    n[k].base_,
    e,
    t.patches_,
    t.inversePatches_
  )) : e = Za(t, n, []), Zc(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== hf ? e : void 0;
}
function Za(e, t, n) {
  if (df(t))
    return t;
  const r = t[k];
  if (!r)
    return Fi(
      t,
      (i, s) => $_(e, r, t, i, s, n)
    ), t;
  if (r.scope_ !== e)
    return t;
  if (!r.modified_)
    return Qa(e, r.base_, !0), r.base_;
  if (!r.finalized_) {
    r.finalized_ = !0, r.scope_.unfinalizedDrafts_--;
    const i = r.copy_;
    let s = i, o = !1;
    r.type_ === 3 && (s = new Set(i), i.clear(), o = !0), Fi(
      s,
      (a, u) => $_(e, r, i, a, u, n, o)
    ), Qa(e, i, !1), n && e.patches_ && Gr("Patches").generatePatches_(
      r,
      n,
      e.patches_,
      e.inversePatches_
    );
  }
  return r.copy_;
}
function $_(e, t, n, r, i, s, o) {
  if (process.env.NODE_ENV !== "production" && i === n && le(5), Hn(i)) {
    const a = s && t && t.type_ !== 3 && // Set objects are atomic since they have no keys.
    !to(t.assigned_, r) ? s.concat(r) : void 0, u = Za(e, i, a);
    if (Ew(n, r, u), Hn(u))
      e.canAutoFreeze_ = !1;
    else
      return;
  } else o && n.add(i);
  if (rn(i) && !df(i)) {
    if (!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1)
      return;
    Za(e, i), (!t || !t.scope_.parent_) && typeof r != "symbol" && Object.prototype.propertyIsEnumerable.call(n, r) && Qa(e, i);
  }
}
function Qa(e, t, n = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && pf(t, n);
}
function _L(e, t) {
  const n = Array.isArray(e), r = {
    type_: n ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: t ? t.scope_ : Ja(),
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
  let i = r, s = Hh;
  n && (i = [r], s = ro);
  const { revoke: o, proxy: a } = Proxy.revocable(i, s);
  return r.draft_ = a, r.revoke_ = o, a;
}
var Hh = {
  get(e, t) {
    if (t === k)
      return e;
    const n = me(e);
    if (!to(n, t))
      return vL(e, n, t);
    const r = n[t];
    return e.finalized_ || !rn(r) ? r : r === sc(e.base_, t) ? (oc(e), e.copy_[t] = io(r, e)) : r;
  },
  has(e, t) {
    return t in me(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(me(e));
  },
  set(e, t, n) {
    const r = xw(me(e), t);
    if (r?.set)
      return r.set.call(e.draft_, n), !0;
    if (!e.modified_) {
      const i = sc(me(e), t), s = i?.[k];
      if (s && s.base_ === n)
        return e.copy_[t] = n, e.assigned_[t] = !1, !0;
      if (lL(n, i) && (n !== void 0 || to(e.base_, t)))
        return !0;
      oc(e), Fn(e);
    }
    return e.copy_[t] === n && // special case: handle new props with value 'undefined'
    (n !== void 0 || t in e.copy_) || // special case: NaN
    Number.isNaN(n) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = n, e.assigned_[t] = !0), !0;
  },
  deleteProperty(e, t) {
    return sc(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_[t] = !1, oc(e), Fn(e)) : delete e.assigned_[t], e.copy_ && delete e.copy_[t], !0;
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
    return Wr(e.base_);
  },
  setPrototypeOf() {
    le(12);
  }
}, ro = {};
Fi(Hh, (e, t) => {
  ro[e] = function() {
    return arguments[0] = arguments[0][0], t.apply(this, arguments);
  };
});
ro.deleteProperty = function(e, t) {
  return process.env.NODE_ENV !== "production" && isNaN(parseInt(t)) && le(13), ro.set.call(this, e, t, void 0);
};
ro.set = function(e, t, n) {
  return process.env.NODE_ENV !== "production" && t !== "length" && isNaN(parseInt(t)) && le(14), Hh.set.call(this, e[0], t, n, e[0]);
};
function sc(e, t) {
  const n = e[k];
  return (n ? me(n) : e)[t];
}
function vL(e, t, n) {
  const r = xw(t, n);
  return r ? "value" in r ? r.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    r.get?.call(e.draft_)
  ) : void 0;
}
function xw(e, t) {
  if (!(t in e))
    return;
  let n = Wr(e);
  for (; n; ) {
    const r = Object.getOwnPropertyDescriptor(n, t);
    if (r)
      return r;
    n = Wr(n);
  }
}
function Fn(e) {
  e.modified_ || (e.modified_ = !0, e.parent_ && Fn(e.parent_));
}
function oc(e) {
  e.copy_ || (e.copy_ = Xc(
    e.base_,
    e.scope_.immer_.useStrictShallowCopy_
  ));
}
var Tw = class {
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
      if (rn(t)) {
        const s = P_(this), o = io(t, void 0);
        let a = !0;
        try {
          i = n(o), a = !1;
        } finally {
          a ? Zc(s) : Qc(s);
        }
        return R_(s, r), N_(i, s);
      } else if (!t || typeof t != "object") {
        if (i = n(t), i === void 0 && (i = t), i === hf && (i = void 0), this.autoFreeze_ && pf(i, !0), r) {
          const s = [], o = [];
          Gr("Patches").generateReplacementPatches_(t, i, s, o), r(s, o);
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
    rn(e) || le(8), Hn(e) && (e = Rw(e));
    const t = P_(this), n = io(e, void 0);
    return n[k].isManual_ = !0, Qc(t), n;
  }
  finishDraft(e, t) {
    const n = e && e[k];
    (!n || !n.isManual_) && le(9);
    const { scope_: r } = n;
    return R_(r, t), N_(void 0, r);
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
    const r = Gr("Patches").applyPatches_;
    return Hn(e) ? r(e, t) : this.produce(
      e,
      (i) => r(i, t)
    );
  }
};
function io(e, t) {
  const n = ko(e) ? Gr("MapSet").proxyMap_(e, t) : Vo(e) ? Gr("MapSet").proxySet_(e, t) : _L(e, t);
  return (t ? t.scope_ : Ja()).drafts_.push(n), n;
}
function Rw(e) {
  return Hn(e) || le(10, e), Pw(e);
}
function Pw(e) {
  if (!rn(e) || df(e))
    return e;
  const t = e[k];
  let n;
  if (t) {
    if (!t.modified_)
      return t.base_;
    t.finalized_ = !0, n = Xc(e, t.scope_.immer_.useStrictShallowCopy_);
  } else
    n = Xc(e, !0);
  return Fi(n, (r, i) => {
    Ew(n, r, Pw(i));
  }), t && (t.finalized_ = !1), n;
}
function gL() {
  process.env.NODE_ENV !== "production" && Aw.push(
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
    Fi(h.assigned_, (b, w) => {
      const m = ic(g, b), A = ic(y, b), S = w ? to(g, b) ? t : n : r;
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
      value: d === hf ? void 0 : d
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
        const S = qr(y);
        let R = v[A];
        typeof R != "string" && typeof R != "number" && (R = "" + R), (S === 0 || S === 1) && (R === "__proto__" || R === "constructor") && le(19), typeof y == "function" && R === "prototype" && le(19), y = ic(y, R), typeof y != "object" && le(18, v.join("/"));
      }
      const b = qr(y), w = c(_.value), m = v[v.length - 1];
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
    if (!rn(h))
      return h;
    if (Array.isArray(h))
      return h.map(c);
    if (ko(h))
      return new Map(
        Array.from(h.entries()).map(([_, v]) => [_, c(v)])
      );
    if (Vo(h))
      return new Set(Array.from(h).map(c));
    const d = Object.create(Wr(h));
    for (const _ in h)
      d[_] = c(h[_]);
    return to(h, $i) && (d[$i] = h[$i]), d;
  }
  function l(h) {
    return Hn(h) ? c(h) : h;
  }
  Sw("Patches", {
    applyPatches_: f,
    generatePatches_: i,
    generateReplacementPatches_: u
  });
}
function yL() {
  class e extends Map {
    constructor(u, f) {
      super(), this[k] = {
        type_: 2,
        parent_: f,
        scope_: f ? f.scope_ : Ja(),
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
      return me(this[k]).size;
    }
    has(u) {
      return me(this[k]).has(u);
    }
    set(u, f) {
      const c = this[k];
      return o(c), (!me(c).has(u) || me(c).get(u) !== f) && (n(c), Fn(c), c.assigned_.set(u, !0), c.copy_.set(u, f), c.assigned_.set(u, !0)), this;
    }
    delete(u) {
      if (!this.has(u))
        return !1;
      const f = this[k];
      return o(f), n(f), Fn(f), f.base_.has(u) ? f.assigned_.set(u, !1) : f.assigned_.delete(u), f.copy_.delete(u), !0;
    }
    clear() {
      const u = this[k];
      o(u), me(u).size && (n(u), Fn(u), u.assigned_ = /* @__PURE__ */ new Map(), Fi(u.base_, (f) => {
        u.assigned_.set(f, !1);
      }), u.copy_.clear());
    }
    forEach(u, f) {
      const c = this[k];
      me(c).forEach((l, h, d) => {
        u.call(f, this.get(h), h, this);
      });
    }
    get(u) {
      const f = this[k];
      o(f);
      const c = me(f).get(u);
      if (f.finalized_ || !rn(c) || c !== f.base_.get(u))
        return c;
      const l = io(c, f);
      return n(f), f.copy_.set(u, l), l;
    }
    keys() {
      return me(this[k]).keys();
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
      super(), this[k] = {
        type_: 3,
        parent_: f,
        scope_: f ? f.scope_ : Ja(),
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
      return me(this[k]).size;
    }
    has(u) {
      const f = this[k];
      return o(f), f.copy_ ? !!(f.copy_.has(u) || f.drafts_.has(u) && f.copy_.has(f.drafts_.get(u))) : f.base_.has(u);
    }
    add(u) {
      const f = this[k];
      return o(f), this.has(u) || (s(f), Fn(f), f.copy_.add(u)), this;
    }
    delete(u) {
      if (!this.has(u))
        return !1;
      const f = this[k];
      return o(f), s(f), Fn(f), f.copy_.delete(u) || (f.drafts_.has(u) ? f.copy_.delete(f.drafts_.get(u)) : (
        /* istanbul ignore next */
        !1
      ));
    }
    clear() {
      const u = this[k];
      o(u), me(u).size && (s(u), Fn(u), u.copy_.clear());
    }
    values() {
      const u = this[k];
      return o(u), s(u), u.copy_.values();
    }
    entries() {
      const u = this[k];
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
      if (rn(u)) {
        const f = io(u, a);
        a.drafts_.set(u, f), a.copy_.add(f);
      } else
        a.copy_.add(u);
    }));
  }
  function o(a) {
    a.revoked_ && le(3, JSON.stringify(me(a)));
  }
  Sw("MapSet", { proxyMap_: t, proxySet_: i });
}
var St = new Tw(), bL = St.produce, mL = St.produceWithPatches.bind(
  St
), wL = St.setAutoFreeze.bind(St), AL = St.setUseStrictShallowCopy.bind(St), OL = St.applyPatches.bind(St), EL = St.createDraft.bind(St), SL = St.finishDraft.bind(St);
function xL(e) {
  return e;
}
function TL(e) {
  return e;
}
const M4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Immer: Tw,
  applyPatches: OL,
  castDraft: xL,
  castImmutable: TL,
  createDraft: EL,
  current: Rw,
  enableMapSet: yL,
  enablePatches: gL,
  finishDraft: SL,
  freeze: pf,
  immerable: $i,
  isDraft: Hn,
  isDraftable: rn,
  nothing: hf,
  original: cL,
  produce: bL,
  produceWithPatches: mL,
  setAutoFreeze: wL,
  setUseStrictShallowCopy: AL
}, Symbol.toStringTag, { value: "Module" }));
var Wo = "delete", X = 5, dt = 1 << X, Ue = dt - 1, j = {};
function el() {
  return { value: !1 };
}
function Dt(e) {
  e && (e.value = !0);
}
function Kh() {
}
function Bi(e) {
  return e.size === void 0 && (e.size = e.__iterate(Nw)), e.size;
}
function dr(e, t) {
  if (typeof t != "number") {
    var n = t >>> 0;
    if ("" + n !== t || n === 4294967295)
      return NaN;
    t = n;
  }
  return t < 0 ? Bi(e) + t : t;
}
function Nw() {
  return !0;
}
function qo(e, t, n) {
  return (e === 0 && !Mw(e) || n !== void 0 && e <= -n) && (t === void 0 || n !== void 0 && t >= n);
}
function cs(e, t) {
  return $w(e, t, 0);
}
function Go(e, t) {
  return $w(e, t, t);
}
function $w(e, t, n) {
  return e === void 0 ? n : Mw(e) ? t === 1 / 0 ? t : Math.max(0, t + e) | 0 : t === void 0 || t === e ? e : Math.min(t, e) | 0;
}
function Mw(e) {
  return e < 0 || e === 0 && 1 / e === -1 / 0;
}
var Iw = "@@__IMMUTABLE_ITERABLE__@@";
function ot(e) {
  return !!(e && // @ts-expect-error: maybeCollection is typed as `{}`, need to change in 6.0 to `maybeCollection && typeof maybeCollection === 'object' && IS_COLLECTION_SYMBOL in maybeCollection`
  e[Iw]);
}
var eu = "@@__IMMUTABLE_KEYED__@@";
function Z(e) {
  return !!(e && // @ts-expect-error: maybeKeyed is typed as `{}`, need to change in 6.0 to `maybeKeyed && typeof maybeKeyed === 'object' && IS_KEYED_SYMBOL in maybeKeyed`
  e[eu]);
}
var tu = "@@__IMMUTABLE_INDEXED__@@";
function at(e) {
  return !!(e && // @ts-expect-error: maybeIndexed is typed as `{}`, need to change in 6.0 to `maybeIndexed && typeof maybeIndexed === 'object' && IS_INDEXED_SYMBOL in maybeIndexed`
  e[tu]);
}
function _f(e) {
  return Z(e) || at(e);
}
var Ee = function(t) {
  return ot(t) ? t : je(t);
}, qt = /* @__PURE__ */ function(e) {
  function t(n) {
    return Z(n) ? n : Tr(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(Ee), ui = /* @__PURE__ */ function(e) {
  function t(n) {
    return at(n) ? n : Ht(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(Ee), ls = /* @__PURE__ */ function(e) {
  function t(n) {
    return ot(n) && !_f(n) ? n : ds(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(Ee);
Ee.Keyed = qt;
Ee.Indexed = ui;
Ee.Set = ls;
var Dw = "@@__IMMUTABLE_SEQ__@@";
function vf(e) {
  return !!(e && // @ts-expect-error: maybeSeq is typed as `{}`, need to change in 6.0 to `maybeSeq && typeof maybeSeq === 'object' && MAYBE_SEQ_SYMBOL in maybeSeq`
  e[Dw]);
}
var Cw = "@@__IMMUTABLE_RECORD__@@";
function xr(e) {
  return !!(e && // @ts-expect-error: maybeRecord is typed as `{}`, need to change in 6.0 to `maybeRecord && typeof maybeRecord === 'object' && IS_RECORD_SYMBOL in maybeRecord`
  e[Cw]);
}
function Gt(e) {
  return ot(e) || xr(e);
}
var _r = "@@__IMMUTABLE_ORDERED__@@";
function Zt(e) {
  return !!(e && // @ts-expect-error: maybeOrdered is typed as `{}`, need to change in 6.0 to `maybeOrdered && typeof maybeOrdered === 'object' && IS_ORDERED_SYMBOL in maybeOrdered`
  e[_r]);
}
var hs = 0, xt = 1, Tt = 2, tl = typeof Symbol == "function" && Symbol.iterator, Lw = "@@iterator", gf = tl || Lw, F = function(t) {
  this.next = t;
};
F.prototype.toString = function() {
  return "[Iterator]";
};
F.KEYS = hs;
F.VALUES = xt;
F.ENTRIES = Tt;
F.prototype.inspect = F.prototype.toSource = function() {
  return this.toString();
};
F.prototype[gf] = function() {
  return this;
};
function ne(e, t, n, r) {
  var i = e === hs ? t : e === xt ? n : [t, n];
  return r ? r.value = i : r = {
    value: i,
    done: !1
  }, r;
}
function Le() {
  return { value: void 0, done: !0 };
}
function Yh(e) {
  return Array.isArray(e) ? !0 : !!yf(e);
}
function M_(e) {
  return e && typeof e.next == "function";
}
function nl(e) {
  var t = yf(e);
  return t && t.call(e);
}
function yf(e) {
  var t = e && (tl && e[tl] || e[Lw]);
  if (typeof t == "function")
    return t;
}
function RL(e) {
  var t = yf(e);
  return t && t === e.entries;
}
function PL(e) {
  var t = yf(e);
  return t && t === e.keys;
}
var ps = Object.prototype.hasOwnProperty;
function Xh(e) {
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
var je = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? Zh() : Gt(n) ? n.toSeq() : $L(n);
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
          return Le();
        var u = s[i ? o - ++a : a++];
        return ne(r, u[0], u[1]);
      });
    }
    return this.__iteratorUncached(r, i);
  }, t;
}(Ee), Tr = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? Zh().toKeyedSeq() : ot(n) ? Z(n) ? n.toSeq() : n.fromEntrySeq() : xr(n) ? n.toSeq() : Qh(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toKeyedSeq = function() {
    return this;
  }, t;
}(je), Ht = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? Zh() : ot(n) ? Z(n) ? n.entrySeq() : n.toIndexedSeq() : xr(n) ? n.toSeq().entrySeq() : jw(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return t(arguments);
  }, t.prototype.toIndexedSeq = function() {
    return this;
  }, t.prototype.toString = function() {
    return this.__toString("Seq [", "]");
  }, t;
}(je), ds = /* @__PURE__ */ function(e) {
  function t(n) {
    return (ot(n) && !_f(n) ? n : Ht(n)).toSetSeq();
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return t(arguments);
  }, t.prototype.toSetSeq = function() {
    return this;
  }, t;
}(je);
je.isSeq = vf;
je.Keyed = Tr;
je.Set = ds;
je.Indexed = Ht;
je.prototype[Dw] = !0;
var zi = /* @__PURE__ */ function(e) {
  function t(n) {
    this._array = n, this.size = n.length;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(r, i) {
    return this.has(r) ? this._array[dr(this, r)] : i;
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
        return Le();
      var u = i ? o - ++a : a++;
      return ne(r, u, s[u]);
    });
  }, t;
}(Ht), Jh = /* @__PURE__ */ function(e) {
  function t(n) {
    var r = Object.keys(n).concat(
      Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(n) : []
    );
    this._object = n, this._keys = r, this.size = r.length;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(r, i) {
    return i !== void 0 && !this.has(r) ? i : this._object[r];
  }, t.prototype.has = function(r) {
    return ps.call(this._object, r);
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
        return Le();
      var f = o[i ? a - ++u : u++];
      return ne(r, f, s[f]);
    });
  }, t;
}(Tr);
Jh.prototype[_r] = !0;
var NL = /* @__PURE__ */ function(e) {
  function t(n) {
    this._collection = n, this.size = n.length || n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.__iterateUncached = function(r, i) {
    if (i)
      return this.cacheResult().__iterate(r, i);
    var s = this._collection, o = nl(s), a = 0;
    if (M_(o))
      for (var u; !(u = o.next()).done && r(u.value, a++, this) !== !1; )
        ;
    return a;
  }, t.prototype.__iteratorUncached = function(r, i) {
    if (i)
      return this.cacheResult().__iterator(r, i);
    var s = this._collection, o = nl(s);
    if (!M_(o))
      return new F(Le);
    var a = 0;
    return new F(function() {
      var u = o.next();
      return u.done ? u : ne(r, a++, u.value);
    });
  }, t;
}(Ht), I_;
function Zh() {
  return I_ || (I_ = new zi([]));
}
function Qh(e) {
  var t = ep(e);
  if (t)
    return t.fromEntrySeq();
  if (typeof e == "object")
    return new Jh(e);
  throw new TypeError(
    "Expected Array or collection object of [k, v] entries, or keyed object: " + e
  );
}
function jw(e) {
  var t = ep(e);
  if (t)
    return t;
  throw new TypeError(
    "Expected Array or collection object of values: " + e
  );
}
function $L(e) {
  var t = ep(e);
  if (t)
    return RL(e) ? t.fromEntrySeq() : PL(e) ? t.toSetSeq() : t;
  if (typeof e == "object")
    return new Jh(e);
  throw new TypeError(
    "Expected Array or collection object of values, or keyed object: " + e
  );
}
function ep(e) {
  return Xh(e) ? new zi(e) : Yh(e) ? new NL(e) : void 0;
}
var Fw = "@@__IMMUTABLE_MAP__@@";
function bf(e) {
  return !!(e && // @ts-expect-error: maybeMap is typed as `{}`, need to change in 6.0 to `maybeMap && typeof maybeMap === 'object' && IS_MAP_SYMBOL in maybeMap`
  e[Fw]);
}
function tp(e) {
  return bf(e) && Zt(e);
}
function rl(e) {
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
  return !!(rl(e) && rl(t) && e.equals(t));
}
var Ss = typeof Math.imul == "function" && Math.imul(4294967295, 2) === -2 ? Math.imul : function(t, n) {
  t |= 0, n |= 0;
  var r = t & 65535, i = n & 65535;
  return r * i + ((t >>> 16) * i + r * (n >>> 16) << 16 >>> 0) | 0;
};
function mf(e) {
  return e >>> 1 & 1073741824 | e & 3221225471;
}
var ML = Object.prototype.valueOf;
function Qe(e) {
  if (e == null)
    return D_(e);
  if (typeof e.hashCode == "function")
    return mf(e.hashCode(e));
  var t = FL(e);
  if (t == null)
    return D_(t);
  switch (typeof t) {
    case "boolean":
      return t ? 1108378657 : 1108378656;
    case "number":
      return IL(t);
    case "string":
      return t.length > BL ? DL(t) : il(t);
    case "object":
    case "function":
      return LL(t);
    case "symbol":
      return CL(t);
    default:
      if (typeof t.toString == "function")
        return il(t.toString());
      throw new Error("Value type " + typeof t + " cannot be hashed.");
  }
}
function D_(e) {
  return e === null ? 1108378658 : (
    /* undefined */
    1108378659
  );
}
function IL(e) {
  if (e !== e || e === 1 / 0)
    return 0;
  var t = e | 0;
  for (t !== e && (t ^= e * 4294967295); e > 4294967295; )
    e /= 4294967295, t ^= e;
  return mf(t);
}
function DL(e) {
  var t = fc[e];
  return t === void 0 && (t = il(e), uc === zL && (uc = 0, fc = {}), uc++, fc[e] = t), t;
}
function il(e) {
  for (var t = 0, n = 0; n < e.length; n++)
    t = 31 * t + e.charCodeAt(n) | 0;
  return mf(t);
}
function CL(e) {
  var t = j_[e];
  return t !== void 0 || (t = Bw(), j_[e] = t), t;
}
function LL(e) {
  var t;
  if (sl && (t = ol.get(e), t !== void 0) || (t = e[jr], t !== void 0) || !L_ && (t = e.propertyIsEnumerable && e.propertyIsEnumerable[jr], t !== void 0 || (t = jL(e), t !== void 0)))
    return t;
  if (t = Bw(), sl)
    ol.set(e, t);
  else {
    if (C_ !== void 0 && C_(e) === !1)
      throw new Error("Non-extensible objects are not allowed as keys.");
    if (L_)
      Object.defineProperty(e, jr, {
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
      }, e.propertyIsEnumerable[jr] = t;
    else if (e.nodeType !== void 0)
      e[jr] = t;
    else
      throw new Error("Unable to set a non-enumerable property on object.");
  }
  return t;
}
var C_ = Object.isExtensible, L_ = function() {
  try {
    return Object.defineProperty({}, "@", {}), !0;
  } catch {
    return !1;
  }
}();
function jL(e) {
  if (e && e.nodeType > 0)
    switch (e.nodeType) {
      case 1:
        return e.uniqueID;
      case 9:
        return e.documentElement && e.documentElement.uniqueID;
    }
}
function FL(e) {
  return e.valueOf !== ML && typeof e.valueOf == "function" ? e.valueOf(e) : e;
}
function Bw() {
  var e = ++ac;
  return ac & 1073741824 && (ac = 0), e;
}
var sl = typeof WeakMap == "function", ol;
sl && (ol = /* @__PURE__ */ new WeakMap());
var j_ = /* @__PURE__ */ Object.create(null), ac = 0, jr = "__immutablehash__";
typeof Symbol == "function" && (jr = Symbol(jr));
var BL = 16, zL = 255, uc = 0, fc = {}, wf = /* @__PURE__ */ function(e) {
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
    var r = this, i = np(this, !0);
    return this._useKeys || (i.valueSeq = function() {
      return r._iter.toSeq().reverse();
    }), i;
  }, t.prototype.map = function(r, i) {
    var s = this, o = Ww(this, r, i);
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
}(Tr);
wf.prototype[_r] = !0;
var zw = /* @__PURE__ */ function(e) {
  function t(n) {
    this._iter = n, this.size = n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.includes = function(r) {
    return this._iter.includes(r);
  }, t.prototype.__iterate = function(r, i) {
    var s = this, o = 0;
    return i && Bi(this), this._iter.__iterate(
      function(a) {
        return r(a, i ? s.size - ++o : o++, s);
      },
      i
    );
  }, t.prototype.__iterator = function(r, i) {
    var s = this, o = this._iter.__iterator(xt, i), a = 0;
    return i && Bi(this), new F(function() {
      var u = o.next();
      return u.done ? u : ne(
        r,
        i ? s.size - ++a : a++,
        u.value,
        u
      );
    });
  }, t;
}(Ht), Uw = /* @__PURE__ */ function(e) {
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
    var s = this._iter.__iterator(xt, i);
    return new F(function() {
      var o = s.next();
      return o.done ? o : ne(r, o.value, o.value, o);
    });
  }, t;
}(ds), kw = /* @__PURE__ */ function(e) {
  function t(n) {
    this._iter = n, this.size = n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.entrySeq = function() {
    return this._iter.toSeq();
  }, t.prototype.__iterate = function(r, i) {
    var s = this;
    return this._iter.__iterate(function(o) {
      if (o) {
        B_(o);
        var a = ot(o);
        return r(
          a ? o.get(1) : o[1],
          a ? o.get(0) : o[0],
          s
        );
      }
    }, i);
  }, t.prototype.__iterator = function(r, i) {
    var s = this._iter.__iterator(xt, i);
    return new F(function() {
      for (; ; ) {
        var o = s.next();
        if (o.done)
          return o;
        var a = o.value;
        if (a) {
          B_(a);
          var u = ot(a);
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
}(Tr);
zw.prototype.cacheResult = wf.prototype.cacheResult = Uw.prototype.cacheResult = kw.prototype.cacheResult = sp;
function Vw(e) {
  var t = Nn(e);
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
  }, t.cacheResult = sp, t.__iterateUncached = function(n, r) {
    var i = this;
    return e.__iterate(function(s, o) {
      return n(o, s, i) !== !1;
    }, r);
  }, t.__iteratorUncached = function(n, r) {
    if (n === Tt) {
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
      n === xt ? hs : xt,
      r
    );
  }, t;
}
function Ww(e, t, n) {
  var r = Nn(e);
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
    var o = e.__iterator(Tt, s);
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
function np(e, t) {
  var n = this, r = Nn(e);
  return r._iter = e, r.size = e.size, r.reverse = function() {
    return e;
  }, e.flip && (r.flip = function() {
    var i = Vw(e);
    return i.reverse = function() {
      return e.flip();
    }, i;
  }), r.get = function(i, s) {
    return e.get(t ? i : -1 - i, s);
  }, r.has = function(i) {
    return e.has(t ? i : -1 - i);
  }, r.includes = function(i) {
    return e.includes(i);
  }, r.cacheResult = sp, r.__iterate = function(i, s) {
    var o = this, a = 0;
    return s && Bi(e), e.__iterate(
      function(u, f) {
        return i(u, t ? f : s ? o.size - ++a : a++, o);
      },
      !s
    );
  }, r.__iterator = function(i, s) {
    var o = 0;
    s && Bi(e);
    var a = e.__iterator(Tt, !s);
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
function qw(e, t, n, r) {
  var i = Nn(e);
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
    var a = e.__iterator(Tt, o), u = 0;
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
function UL(e, t, n) {
  var r = ci().asMutable();
  return e.__iterate(function(i, s) {
    r.update(t.call(n, i, s, e), 0, function(o) {
      return o + 1;
    });
  }), r.asImmutable();
}
function kL(e, t, n) {
  var r = Z(e), i = (Zt(e) ? bn() : ci()).asMutable();
  e.__iterate(function(o, a) {
    i.update(
      t.call(n, o, a, e),
      function(u) {
        return u = u || [], u.push(r ? [a, o] : o), u;
      }
    );
  });
  var s = ip(e);
  return i.map(function(o) {
    return Y(e, s(o));
  }).asImmutable();
}
function VL(e, t, n) {
  var r = Z(e), i = [[], []];
  e.__iterate(function(o, a) {
    i[t.call(n, o, a, e) ? 1 : 0].push(
      r ? [a, o] : o
    );
  });
  var s = ip(e);
  return i.map(function(o) {
    return Y(e, s(o));
  });
}
function rp(e, t, n, r) {
  var i = e.size;
  if (qo(t, n, i))
    return e;
  if (typeof i > "u" && (t < 0 || n < 0))
    return rp(e.toSeq().cacheResult(), t, n, r);
  var s = cs(t, i), o = Go(n, i), a = o - s, u;
  a === a && (u = a < 0 ? 0 : a);
  var f = Nn(e);
  return f.size = u === 0 ? u : e.size && u || void 0, !r && vf(e) && u >= 0 && (f.get = function(c, l) {
    return c = dr(this, c), c >= 0 && c < u ? e.get(c + s, l) : l;
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
      return new F(Le);
    var h = e.__iterator(c, l), d = 0, _ = 0;
    return new F(function() {
      for (; d++ < s; )
        h.next();
      if (++_ > u)
        return Le();
      var v = h.next();
      return r || c === xt || v.done ? v : c === hs ? ne(c, _ - 1, void 0, v) : ne(c, _ - 1, v.value[1], v);
    });
  }, f;
}
function WL(e, t, n) {
  var r = Nn(e);
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
    var a = e.__iterator(Tt, s), u = !0;
    return new F(function() {
      if (!u)
        return Le();
      var f = a.next();
      if (f.done)
        return f;
      var c = f.value, l = c[0], h = c[1];
      return t.call(n, h, l, o) ? i === Tt ? f : ne(i, l, h, f) : (u = !1, Le());
    });
  }, r;
}
function Gw(e, t, n, r) {
  var i = Nn(e);
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
    var u = e.__iterator(Tt, o), f = !0, c = 0;
    return new F(function() {
      var l, h, d;
      do {
        if (l = u.next(), l.done)
          return r || s === xt ? l : s === hs ? ne(s, c++, void 0, l) : ne(s, c++, l.value[1], l);
        var _ = l.value;
        h = _[0], d = _[1], f && (f = t.call(n, d, h, a));
      } while (f);
      return s === Tt ? l : ne(s, h, d, l);
    });
  }, i;
}
var qL = /* @__PURE__ */ function(e) {
  function t(n) {
    this._wrappedIterables = n.flatMap(function(r) {
      return r._wrappedIterables ? r._wrappedIterables : [r];
    }), this.size = this._wrappedIterables.reduce(function(r, i) {
      if (r !== void 0) {
        var s = i.size;
        if (s !== void 0)
          return r + s;
      }
    }, 0), this[eu] = this._wrappedIterables[0][eu], this[tu] = this._wrappedIterables[0][tu], this[_r] = this._wrappedIterables[0][_r];
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.__iterateUncached = function(r, i) {
    if (this._wrappedIterables.length !== 0) {
      if (i)
        return this.cacheResult().__iterate(r, i);
      for (var s = 0, o = Z(this), a = o ? Tt : xt, u = this._wrappedIterables[s].__iterator(
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
      return new F(Le);
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
}(je);
function GL(e, t) {
  var n = Z(e), r = [e].concat(t).map(function(s) {
    return ot(s) ? n && (s = qt(s)) : s = n ? Qh(s) : jw(Array.isArray(s) ? s : [s]), s;
  }).filter(function(s) {
    return s.size !== 0;
  });
  if (r.length === 0)
    return e;
  if (r.length === 1) {
    var i = r[0];
    if (i === e || n && Z(i) || at(e) && at(i))
      return i;
  }
  return new qL(r);
}
function Hw(e, t, n) {
  var r = Nn(e);
  return r.__iterateUncached = function(i, s) {
    if (s)
      return this.cacheResult().__iterate(i, s);
    var o = 0, a = !1;
    function u(f, c) {
      f.__iterate(function(l, h) {
        return (!t || c < t) && ot(l) ? u(l, c + 1) : (o++, i(l, n ? h : o - 1, r) === !1 && (a = !0)), !a;
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
        if (i === Tt && (c = c[1]), (!t || a.length < t) && ot(c))
          a.push(o), o = c.__iterator(i, s);
        else
          return n ? f : ne(i, u++, c, f);
      }
      return Le();
    });
  }, r;
}
function HL(e, t, n) {
  var r = ip(e);
  return e.toSeq().map(function(i, s) {
    return r(t.call(n, i, s, e));
  }).flatten(!0);
}
function KL(e, t) {
  var n = Nn(e);
  return n.size = e.size && e.size * 2 - 1, n.__iterateUncached = function(r, i) {
    var s = this, o = 0;
    return e.__iterate(
      function(a) {
        return (!o || r(t, o++, s) !== !1) && r(a, o++, s) !== !1;
      },
      i
    ), o;
  }, n.__iteratorUncached = function(r, i) {
    var s = e.__iterator(xt, i), o = 0, a;
    return new F(function() {
      return (!a || o % 2) && (a = s.next(), a.done) ? a : o % 2 ? ne(r, o++, t) : ne(r, o++, a.value, a);
    });
  }, n;
}
function Ui(e, t, n) {
  t || (t = Kw);
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
  ), r ? Tr(s) : at(e) ? Ht(s) : ds(s);
}
function ba(e, t, n) {
  if (t || (t = Kw), n) {
    var r = e.toSeq().map(function(i, s) {
      return [i, n(i, s, e)];
    }).reduce(function(i, s) {
      return F_(t, i[1], s[1]) ? s : i;
    });
    return r && r[0];
  }
  return e.reduce(function(i, s) {
    return F_(t, i, s) ? s : i;
  });
}
function F_(e, t, n) {
  var r = e(n, t);
  return r === 0 && n !== t && (n == null || n !== n) || r > 0;
}
function ma(e, t, n, r) {
  var i = Nn(e), s = new zi(n).map(function(o) {
    return o.size;
  });
  return i.size = r ? s.max() : s.min(), i.__iterate = function(o, a) {
    for (var u = this.__iterator(xt, a), f, c = 0; !(f = u.next()).done && o(f.value, c++, this) !== !1; )
      ;
    return c;
  }, i.__iteratorUncached = function(o, a) {
    var u = n.map(
      function(l) {
        return l = Ee(l), nl(a ? l.reverse() : l);
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
      })), c ? Le() : ne(
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
  return e === t ? e : vf(e) ? t : e.constructor(t);
}
function B_(e) {
  if (e !== Object(e))
    throw new TypeError("Expected [K, V] tuple: " + e);
}
function ip(e) {
  return Z(e) ? qt : at(e) ? ui : ls;
}
function Nn(e) {
  return Object.create(
    (Z(e) ? Tr : at(e) ? Ht : ds).prototype
  );
}
function sp() {
  return this._iter.cacheResult ? (this._iter.cacheResult(), this.size = this._iter.size, this) : je.prototype.cacheResult.call(this);
}
function Kw(e, t) {
  return e === void 0 && t === void 0 ? 0 : e === void 0 ? 1 : t === void 0 ? -1 : e > t ? 1 : e < t ? -1 : 0;
}
function cn(e, t) {
  t = t || 0;
  for (var n = Math.max(0, e.length - t), r = new Array(n), i = 0; i < n; i++)
    r[i] = e[i + t];
  return r;
}
function js(e, t) {
  if (!e)
    throw new Error(t);
}
function lt(e) {
  js(e !== 1 / 0, "Cannot perform this action with an infinite size.");
}
function Yw(e) {
  if (Xh(e) && typeof e != "string")
    return e;
  if (Zt(e))
    return e.toArray();
  throw new TypeError("Invalid keyPath: expected Ordered Collection or Array: " + e);
}
var YL = Object.prototype.toString;
function op(e) {
  if (!e || typeof e != "object" || YL.call(e) !== "[object Object]")
    return !1;
  var t = Object.getPrototypeOf(e);
  if (t === null)
    return !0;
  for (var n = t, r = Object.getPrototypeOf(t); r !== null; )
    n = r, r = Object.getPrototypeOf(n);
  return n === t;
}
function vr(e) {
  return typeof e == "object" && (Gt(e) || Array.isArray(e) || op(e));
}
function so(e) {
  try {
    return typeof e == "string" ? JSON.stringify(e) : String(e);
  } catch {
    return JSON.stringify(e);
  }
}
function Xw(e, t) {
  return Gt(e) ? (
    // @ts-expect-error key might be a number or symbol, which is not handled be Record key type
    e.has(t)
  ) : (
    // @ts-expect-error key might be anything else than PropertyKey, and will return false in that case but runtime is OK
    vr(e) && ps.call(e, t)
  );
}
function ap(e, t, n) {
  return Gt(e) ? e.get(t, n) : Xw(e, t) ? (
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
function nu(e) {
  if (Array.isArray(e))
    return cn(e);
  var t = {};
  for (var n in e)
    ps.call(e, n) && (t[n] = e[n]);
  return t;
}
function Jw(e, t) {
  if (!vr(e))
    throw new TypeError("Cannot update non-data-structure value: " + e);
  if (Gt(e)) {
    if (!e.remove)
      throw new TypeError("Cannot update immutable value without .remove() method: " + e);
    return e.remove(t);
  }
  if (!ps.call(e, t))
    return e;
  var n = nu(e);
  return Array.isArray(n) ? n.splice(t, 1) : delete n[t], n;
}
function Zw(e, t, n) {
  if (!vr(e))
    throw new TypeError("Cannot update non-data-structure value: " + e);
  if (Gt(e)) {
    if (!e.set)
      throw new TypeError("Cannot update immutable value without .set() method: " + e);
    return e.set(t, n);
  }
  if (ps.call(e, t) && n === e[t])
    return e;
  var r = nu(e);
  return r[t] = n, r;
}
function fi(e, t, n, r) {
  r || (r = n, n = void 0);
  var i = Qw(
    Gt(e),
    // @ts-expect-error type issues with Record and mixed types
    e,
    Yw(t),
    0,
    n,
    r
  );
  return i === j ? n : i;
}
function Qw(e, t, n, r, i, s) {
  var o = t === j;
  if (r === n.length) {
    var a = o ? i : t, u = s(a);
    return u === a ? t : u;
  }
  if (!o && !vr(t))
    throw new TypeError("Cannot update within non-data-structure value in path [" + Array.from(n).slice(0, r).map(so) + "]: " + t);
  var f = n[r], c = o ? j : ap(t, f, j), l = Qw(
    c === j ? e : Gt(c),
    // @ts-expect-error mixed type
    c,
    n,
    r + 1,
    i,
    s
  );
  return l === c ? t : l === j ? Jw(t, f) : Zw(o ? e ? hn() : {} : t, f, l);
}
function eA(e, t, n) {
  return fi(e, t, j, function() {
    return n;
  });
}
function up(e, t) {
  return eA(this, e, t);
}
function tA(e, t) {
  return fi(e, t, function() {
    return j;
  });
}
function fp(e) {
  return tA(this, e);
}
function cp(e, t, n, r) {
  return fi(
    // @ts-expect-error Index signature for type string is missing in type V[]
    e,
    [t],
    n,
    r
  );
}
function lp(e, t, n) {
  return arguments.length === 1 ? e(this) : cp(this, e, t, n);
}
function hp(e, t, n) {
  return fi(this, e, t, n);
}
function nA() {
  for (var e = [], t = arguments.length; t--; ) e[t] = arguments[t];
  return iA(this, e);
}
function rA(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  if (typeof e != "function")
    throw new TypeError("Invalid merger function: " + e);
  return iA(this, t, e);
}
function iA(e, t, n) {
  for (var r = [], i = 0; i < t.length; i++) {
    var s = qt(t[i]);
    s.size !== 0 && r.push(s);
  }
  return r.length === 0 ? e : e.toSeq().size === 0 && !e.__ownerID && r.length === 1 ? xr(e) ? e : e.constructor(r[0]) : e.withMutations(function(o) {
    for (var a = n ? function(f, c) {
      cp(
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
function XL(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return Ko(e, t);
}
function JL(e, t) {
  for (var n = [], r = arguments.length - 2; r-- > 0; ) n[r] = arguments[r + 2];
  return Ko(t, n, e);
}
function ZL(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return Ho(e, t);
}
function QL(e, t) {
  for (var n = [], r = arguments.length - 2; r-- > 0; ) n[r] = arguments[r + 2];
  return Ho(t, n, e);
}
function Ho(e, t, n) {
  return Ko(e, t, e3(n));
}
function Ko(e, t, n) {
  if (!vr(e))
    throw new TypeError(
      "Cannot merge into non-data-structure value: " + e
    );
  if (Gt(e))
    return typeof n == "function" && e.mergeWith ? e.mergeWith.apply(e, [n].concat(t)) : e.merge ? e.merge.apply(e, t) : e.concat.apply(e, t);
  for (var r = Array.isArray(e), i = e, s = r ? ui : qt, o = r ? function(u) {
    i === e && (i = nu(i)), i.push(u);
  } : function(u, f) {
    var c = ps.call(i, f), l = c && n ? n(i[f], u, f) : u;
    (!c || l !== i[f]) && (i === e && (i = nu(i)), i[f] = l);
  }, a = 0; a < t.length; a++)
    s(t[a]).forEach(o);
  return i;
}
function e3(e) {
  function t(n, r, i) {
    return vr(n) && vr(r) && t3(n, r) ? Ko(n, [r], t) : e ? e(n, r, i) : r;
  }
  return t;
}
function t3(e, t) {
  var n = je(e), r = je(t);
  return at(n) === at(r) && Z(n) === Z(r);
}
function sA() {
  for (var e = [], t = arguments.length; t--; ) e[t] = arguments[t];
  return Ho(this, e);
}
function oA(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return Ho(this, t, e);
}
function pp(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return fi(this, e, hn(), function(r) {
    return Ko(r, t);
  });
}
function dp(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return fi(
    this,
    e,
    hn(),
    function(r) {
      return Ho(r, t);
    }
  );
}
function Yo(e) {
  var t = this.asMutable();
  return e(t), t.wasAltered() ? t.__ensureOwner(this.__ownerID) : this;
}
function Xo() {
  return this.__ownerID ? this : this.__ensureOwner(new Kh());
}
function Jo() {
  return this.__ensureOwner();
}
function _p() {
  return this.__altered;
}
var ci = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? hn() : bf(n) && !Zt(n) ? n : hn().withMutations(function(r) {
      var i = e(n);
      lt(i.size), i.forEach(function(s, o) {
        return r.set(o, s);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.__toString("Map {", "}");
  }, t.prototype.get = function(r, i) {
    return this._root ? this._root.get(0, void 0, r, i) : i;
  }, t.prototype.set = function(r, i) {
    return k_(this, r, i);
  }, t.prototype.remove = function(r) {
    return k_(this, r, j);
  }, t.prototype.deleteAll = function(r) {
    var i = Ee(r);
    return i.size === 0 ? this : this.withMutations(function(s) {
      i.forEach(function(o) {
        return s.remove(o);
      });
    });
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._root = null, this.__hash = void 0, this.__altered = !0, this) : hn();
  }, t.prototype.sort = function(r) {
    return bn(Ui(this, r));
  }, t.prototype.sortBy = function(r, i) {
    return bn(Ui(this, i, r));
  }, t.prototype.map = function(r, i) {
    var s = this;
    return this.withMutations(function(o) {
      o.forEach(function(a, u) {
        o.set(u, r.call(i, a, u, s));
      });
    });
  }, t.prototype.__iterator = function(r, i) {
    return new n3(this, r, i);
  }, t.prototype.__iterate = function(r, i) {
    var s = this, o = 0;
    return this._root && this._root.iterate(function(a) {
      return o++, r(a[1], a[0], s);
    }, i), o;
  }, t.prototype.__ensureOwner = function(r) {
    return r === this.__ownerID ? this : r ? vp(this.size, this._root, r, this.__hash) : this.size === 0 ? hn() : (this.__ownerID = r, this.__altered = !1, this);
  }, t;
}(qt);
ci.isMap = bf;
var re = ci.prototype;
re[Fw] = !0;
re[Wo] = re.remove;
re.removeAll = re.deleteAll;
re.setIn = up;
re.removeIn = re.deleteIn = fp;
re.update = lp;
re.updateIn = hp;
re.merge = re.concat = nA;
re.mergeWith = rA;
re.mergeDeep = sA;
re.mergeDeepWith = oA;
re.mergeIn = pp;
re.mergeDeepIn = dp;
re.withMutations = Yo;
re.wasAltered = _p;
re.asImmutable = Jo;
re["@@transducer/init"] = re.asMutable = Xo;
re["@@transducer/step"] = function(e, t) {
  return e.set(t[0], t[1]);
};
re["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
var oo = function(t, n) {
  this.ownerID = t, this.entries = n;
};
oo.prototype.get = function(t, n, r, i) {
  for (var s = this.entries, o = 0, a = s.length; o < a; o++)
    if (Ae(r, s[o][0]))
      return s[o][1];
  return i;
};
oo.prototype.update = function(t, n, r, i, s, o, a) {
  for (var u = s === j, f = this.entries, c = 0, l = f.length; c < l && !Ae(i, f[c][0]); c++)
    ;
  var h = c < l;
  if (h ? f[c][1] === s : u)
    return this;
  if (Dt(a), (u || !h) && Dt(o), !(u && f.length === 1)) {
    if (!h && !u && f.length >= u3)
      return r3(t, f, i, s);
    var d = t && t === this.ownerID, _ = d ? f : cn(f);
    return h ? u ? c === l - 1 ? _.pop() : _[c] = _.pop() : _[c] = [i, s] : _.push([i, s]), d ? (this.entries = _, this) : new oo(t, _);
  }
};
var ki = function(t, n, r) {
  this.ownerID = t, this.bitmap = n, this.nodes = r;
};
ki.prototype.get = function(t, n, r, i) {
  n === void 0 && (n = Qe(r));
  var s = 1 << ((t === 0 ? n : n >>> t) & Ue), o = this.bitmap;
  return (o & s) === 0 ? i : this.nodes[aA(o & s - 1)].get(
    t + X,
    n,
    r,
    i
  );
};
ki.prototype.update = function(t, n, r, i, s, o, a) {
  r === void 0 && (r = Qe(i));
  var u = (n === 0 ? r : r >>> n) & Ue, f = 1 << u, c = this.bitmap, l = (c & f) !== 0;
  if (!l && s === j)
    return this;
  var h = aA(c & f - 1), d = this.nodes, _ = l ? d[h] : void 0, v = gp(
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
  if (!l && v && d.length >= f3)
    return s3(t, d, c, u, v);
  if (l && !v && d.length === 2 && V_(d[h ^ 1]))
    return d[h ^ 1];
  if (l && v && d.length === 1 && V_(v))
    return v;
  var g = t && t === this.ownerID, y = l ? v ? c : c ^ f : c | f, b = l ? v ? uA(d, h, v, g) : a3(d, h, g) : o3(d, h, v, g);
  return g ? (this.bitmap = y, this.nodes = b, this) : new ki(t, y, b);
};
var ao = function(t, n, r) {
  this.ownerID = t, this.count = n, this.nodes = r;
};
ao.prototype.get = function(t, n, r, i) {
  n === void 0 && (n = Qe(r));
  var s = (t === 0 ? n : n >>> t) & Ue, o = this.nodes[s];
  return o ? o.get(t + X, n, r, i) : i;
};
ao.prototype.update = function(t, n, r, i, s, o, a) {
  r === void 0 && (r = Qe(i));
  var u = (n === 0 ? r : r >>> n) & Ue, f = s === j, c = this.nodes, l = c[u];
  if (f && !l)
    return this;
  var h = gp(
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
  else if (!h && (d--, d < c3))
    return i3(t, c, d, u);
  var _ = t && t === this.ownerID, v = uA(c, u, h, _);
  return _ ? (this.count = d, this.nodes = v, this) : new ao(t, d, v);
};
var Vi = function(t, n, r) {
  this.ownerID = t, this.keyHash = n, this.entries = r;
};
Vi.prototype.get = function(t, n, r, i) {
  for (var s = this.entries, o = 0, a = s.length; o < a; o++)
    if (Ae(r, s[o][0]))
      return s[o][1];
  return i;
};
Vi.prototype.update = function(t, n, r, i, s, o, a) {
  r === void 0 && (r = Qe(i));
  var u = s === j;
  if (r !== this.keyHash)
    return u ? this : (Dt(a), Dt(o), yp(this, t, n, r, [i, s]));
  for (var f = this.entries, c = 0, l = f.length; c < l && !Ae(i, f[c][0]); c++)
    ;
  var h = c < l;
  if (h ? f[c][1] === s : u)
    return this;
  if (Dt(a), (u || !h) && Dt(o), u && l === 2)
    return new Kn(t, this.keyHash, f[c ^ 1]);
  var d = t && t === this.ownerID, _ = d ? f : cn(f);
  return h ? u ? c === l - 1 ? _.pop() : _[c] = _.pop() : _[c] = [i, s] : _.push([i, s]), d ? (this.entries = _, this) : new Vi(t, this.keyHash, _);
};
var Kn = function(t, n, r) {
  this.ownerID = t, this.keyHash = n, this.entry = r;
};
Kn.prototype.get = function(t, n, r, i) {
  return Ae(r, this.entry[0]) ? this.entry[1] : i;
};
Kn.prototype.update = function(t, n, r, i, s, o, a) {
  var u = s === j, f = Ae(i, this.entry[0]);
  if (f ? s === this.entry[1] : u)
    return this;
  if (Dt(a), u) {
    Dt(o);
    return;
  }
  return f ? t && t === this.ownerID ? (this.entry[1] = s, this) : new Kn(t, this.keyHash, [i, s]) : (Dt(o), yp(this, t, n, Qe(i), [i, s]));
};
oo.prototype.iterate = Vi.prototype.iterate = function(e, t) {
  for (var n = this.entries, r = 0, i = n.length - 1; r <= i; r++)
    if (e(n[t ? i - r : r]) === !1)
      return !1;
};
ki.prototype.iterate = ao.prototype.iterate = function(e, t) {
  for (var n = this.nodes, r = 0, i = n.length - 1; r <= i; r++) {
    var s = n[t ? i - r : r];
    if (s && s.iterate(e, t) === !1)
      return !1;
  }
};
Kn.prototype.iterate = function(e, t) {
  return e(this.entry);
};
var n3 = /* @__PURE__ */ function(e) {
  function t(n, r, i) {
    this._type = r, this._reverse = i, this._stack = n._root && z_(n._root);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.next = function() {
    for (var r = this._type, i = this._stack; i; ) {
      var s = i.node, o = i.index++, a = void 0;
      if (s.entry) {
        if (o === 0)
          return cc(r, s.entry);
      } else if (s.entries) {
        if (a = s.entries.length - 1, o <= a)
          return cc(
            r,
            s.entries[this._reverse ? a - o : o]
          );
      } else if (a = s.nodes.length - 1, o <= a) {
        var u = s.nodes[this._reverse ? a - o : o];
        if (u) {
          if (u.entry)
            return cc(r, u.entry);
          i = this._stack = z_(u, i);
        }
        continue;
      }
      i = this._stack = this._stack.__prev;
    }
    return Le();
  }, t;
}(F);
function cc(e, t) {
  return ne(e, t[0], t[1]);
}
function z_(e, t) {
  return {
    node: e,
    index: 0,
    __prev: t
  };
}
function vp(e, t, n, r) {
  var i = Object.create(re);
  return i.size = e, i._root = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
var U_;
function hn() {
  return U_ || (U_ = vp(0));
}
function k_(e, t, n) {
  var r, i;
  if (e._root) {
    var s = el(), o = el();
    if (r = gp(
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
    i = 1, r = new oo(e.__ownerID, [[t, n]]);
  }
  return e.__ownerID ? (e.size = i, e._root = r, e.__hash = void 0, e.__altered = !0, e) : r ? vp(i, r) : hn();
}
function gp(e, t, n, r, i, s, o, a) {
  return e ? e.update(
    t,
    n,
    r,
    i,
    s,
    o,
    a
  ) : s === j ? e : (Dt(a), Dt(o), new Kn(t, r, [i, s]));
}
function V_(e) {
  return e.constructor === Kn || e.constructor === Vi;
}
function yp(e, t, n, r, i) {
  if (e.keyHash === r)
    return new Vi(t, r, [e.entry, i]);
  var s = (n === 0 ? e.keyHash : e.keyHash >>> n) & Ue, o = (n === 0 ? r : r >>> n) & Ue, a, u = s === o ? [yp(e, t, n + X, r, i)] : (a = new Kn(t, r, i), s < o ? [e, a] : [a, e]);
  return new ki(t, 1 << s | 1 << o, u);
}
function r3(e, t, n, r) {
  e || (e = new Kh());
  for (var i = new Kn(e, Qe(n), [n, r]), s = 0; s < t.length; s++) {
    var o = t[s];
    i = i.update(e, 0, void 0, o[0], o[1]);
  }
  return i;
}
function i3(e, t, n, r) {
  for (var i = 0, s = 0, o = new Array(n), a = 0, u = 1, f = t.length; a < f; a++, u <<= 1) {
    var c = t[a];
    c !== void 0 && a !== r && (i |= u, o[s++] = c);
  }
  return new ki(e, i, o);
}
function s3(e, t, n, r, i) {
  for (var s = 0, o = new Array(dt), a = 0; n !== 0; a++, n >>>= 1)
    o[a] = n & 1 ? t[s++] : void 0;
  return o[r] = i, new ao(e, s + 1, o);
}
function aA(e) {
  return e -= e >> 1 & 1431655765, e = (e & 858993459) + (e >> 2 & 858993459), e = e + (e >> 4) & 252645135, e += e >> 8, e += e >> 16, e & 127;
}
function uA(e, t, n, r) {
  var i = r ? e : cn(e);
  return i[t] = n, i;
}
function o3(e, t, n, r) {
  var i = e.length + 1;
  if (r && t + 1 === i)
    return e[t] = n, e;
  for (var s = new Array(i), o = 0, a = 0; a < i; a++)
    a === t ? (s[a] = n, o = -1) : s[a] = e[a + o];
  return s;
}
function a3(e, t, n) {
  var r = e.length - 1;
  if (n && t === r)
    return e.pop(), e;
  for (var i = new Array(r), s = 0, o = 0; o < r; o++)
    o === t && (s = 1), i[o] = e[o + s];
  return i;
}
var u3 = dt / 4, f3 = dt / 2, c3 = dt / 4, fA = "@@__IMMUTABLE_LIST__@@";
function bp(e) {
  return !!(e && // @ts-expect-error: maybeList is typed as `{}`, need to change in 6.0 to `maybeList && typeof maybeList === 'object' && IS_LIST_SYMBOL in maybeList`
  e[fA]);
}
var Zo = /* @__PURE__ */ function(e) {
  function t(n) {
    var r = Fa();
    if (n == null)
      return r;
    if (bp(n))
      return n;
    var i = e(n), s = i.size;
    return s === 0 ? r : (lt(s), s > 0 && s < dt ? uo(0, s, X, null, new or(i.toArray())) : r.withMutations(function(o) {
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
    if (r = dr(this, r), r >= 0 && r < this.size) {
      r += this._origin;
      var s = cA(this, r);
      return s && s.array[r & Ue];
    }
    return i;
  }, t.prototype.set = function(r, i) {
    return l3(this, r, i);
  }, t.prototype.remove = function(r) {
    return this.has(r) ? r === 0 ? this.shift() : r === this.size - 1 ? this.pop() : this.splice(r, 1) : this;
  }, t.prototype.insert = function(r, i) {
    return this.splice(r, 0, i);
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = this._origin = this._capacity = 0, this._level = X, this._root = this._tail = this.__hash = void 0, this.__altered = !0, this) : Fa();
  }, t.prototype.push = function() {
    var r = arguments, i = this.size;
    return this.withMutations(function(s) {
      tr(s, 0, i + r.length);
      for (var o = 0; o < r.length; o++)
        s.set(i + o, r[o]);
    });
  }, t.prototype.pop = function() {
    return tr(this, 0, -1);
  }, t.prototype.unshift = function() {
    var r = arguments;
    return this.withMutations(function(i) {
      tr(i, -r.length);
      for (var s = 0; s < r.length; s++)
        i.set(s, r[s]);
    });
  }, t.prototype.shift = function() {
    return tr(this, 1);
  }, t.prototype.shuffle = function(r) {
    return r === void 0 && (r = Math.random), this.withMutations(function(i) {
      for (var s = i.size, o, a; s; )
        o = Math.floor(r() * s--), a = i.get(o), i.set(o, i.get(s)), i.set(s, a);
    });
  }, t.prototype.concat = function() {
    for (var r = arguments, i = [], s = 0; s < arguments.length; s++) {
      var o = r[s], a = e(
        typeof o != "string" && Yh(o) ? o : [o]
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
    return tr(this, 0, r);
  }, t.prototype.map = function(r, i) {
    var s = this;
    return this.withMutations(function(o) {
      for (var a = 0; a < s.size; a++)
        o.set(a, r.call(i, o.get(a), a, s));
    });
  }, t.prototype.slice = function(r, i) {
    var s = this.size;
    return qo(r, i, s) ? this : tr(
      this,
      cs(r, s),
      Go(i, s)
    );
  }, t.prototype.__iterator = function(r, i) {
    var s = i ? this.size : 0, o = W_(this, i);
    return new F(function() {
      var a = o();
      return a === Fs ? Le() : ne(r, i ? --s : s++, a);
    });
  }, t.prototype.__iterate = function(r, i) {
    for (var s = i ? this.size : 0, o = W_(this, i), a; (a = o()) !== Fs && r(a, i ? --s : s++, this) !== !1; )
      ;
    return s;
  }, t.prototype.__ensureOwner = function(r) {
    return r === this.__ownerID ? this : r ? uo(
      this._origin,
      this._capacity,
      this._level,
      this._root,
      this._tail,
      r,
      this.__hash
    ) : this.size === 0 ? Fa() : (this.__ownerID = r, this.__altered = !1, this);
  }, t;
}(ui);
Zo.isList = bp;
var he = Zo.prototype;
he[fA] = !0;
he[Wo] = he.remove;
he.merge = he.concat;
he.setIn = up;
he.deleteIn = he.removeIn = fp;
he.update = lp;
he.updateIn = hp;
he.mergeIn = pp;
he.mergeDeepIn = dp;
he.withMutations = Yo;
he.wasAltered = _p;
he.asImmutable = Jo;
he["@@transducer/init"] = he.asMutable = Xo;
he["@@transducer/step"] = function(e, t) {
  return e.push(t);
};
he["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
var or = function(t, n) {
  this.array = t, this.ownerID = n;
};
or.prototype.removeBefore = function(t, n, r) {
  if ((r & (1 << n + X) - 1) === 0 || this.array.length === 0)
    return this;
  var i = r >>> n & Ue;
  if (i >= this.array.length)
    return new or([], t);
  var s = i === 0, o;
  if (n > 0) {
    var a = this.array[i];
    if (o = a && a.removeBefore(t, n - X, r), o === a && s)
      return this;
  }
  if (s && !o)
    return this;
  var u = Wi(this, t);
  if (!s)
    for (var f = 0; f < i; f++)
      u.array[f] = void 0;
  return o && (u.array[i] = o), u;
};
or.prototype.removeAfter = function(t, n, r) {
  if (r === (n ? 1 << n + X : dt) || this.array.length === 0)
    return this;
  var i = r - 1 >>> n & Ue;
  if (i >= this.array.length)
    return this;
  var s;
  if (n > 0) {
    var o = this.array[i];
    if (s = o && o.removeAfter(t, n - X, r), s === o && i === this.array.length - 1)
      return this;
  }
  var a = Wi(this, t);
  return a.array.splice(i + 1), s && (a.array[i] = s), a;
};
var Fs = {};
function W_(e, t) {
  var n = e._origin, r = e._capacity, i = fo(r), s = e._tail;
  return o(e._root, e._level, 0);
  function o(f, c, l) {
    return c === 0 ? a(f, l) : u(f, c, l);
  }
  function a(f, c) {
    var l = c === i ? s && s.array : f && f.array, h = c > n ? 0 : n - c, d = r - c;
    return d > dt && (d = dt), function() {
      if (h === d)
        return Fs;
      var _ = t ? --d : h++;
      return l && l[_];
    };
  }
  function u(f, c, l) {
    var h, d = f && f.array, _ = l > n ? 0 : n - l >> c, v = (r - l >> c) + 1;
    return v > dt && (v = dt), function() {
      for (; ; ) {
        if (h) {
          var g = h();
          if (g !== Fs)
            return g;
          h = null;
        }
        if (_ === v)
          return Fs;
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
function uo(e, t, n, r, i, s, o) {
  var a = Object.create(he);
  return a.size = t - e, a._origin = e, a._capacity = t, a._level = n, a._root = r, a._tail = i, a.__ownerID = s, a.__hash = o, a.__altered = !1, a;
}
function Fa() {
  return uo(0, 0, X);
}
function l3(e, t, n) {
  if (t = dr(e, t), t !== t)
    return e;
  if (t >= e.size || t < 0)
    return e.withMutations(function(o) {
      t < 0 ? tr(o, t).set(0, n) : tr(o, 0, t + 1).set(t, n);
    });
  t += e._origin;
  var r = e._tail, i = e._root, s = el();
  return t >= fo(e._capacity) ? r = al(r, e.__ownerID, 0, t, n, s) : i = al(
    i,
    e.__ownerID,
    e._level,
    t,
    n,
    s
  ), s.value ? e.__ownerID ? (e._root = i, e._tail = r, e.__hash = void 0, e.__altered = !0, e) : uo(e._origin, e._capacity, e._level, i, r) : e;
}
function al(e, t, n, r, i, s) {
  var o = r >>> n & Ue, a = e && o < e.array.length;
  if (!a && i === void 0)
    return e;
  var u;
  if (n > 0) {
    var f = e && e.array[o], c = al(
      f,
      t,
      n - X,
      r,
      i,
      s
    );
    return c === f ? e : (u = Wi(e, t), u.array[o] = c, u);
  }
  return a && e.array[o] === i ? e : (s && Dt(s), u = Wi(e, t), i === void 0 && o === u.array.length - 1 ? u.array.pop() : u.array[o] = i, u);
}
function Wi(e, t) {
  return t && e && t === e.ownerID ? e : new or(e ? e.array.slice() : [], t);
}
function cA(e, t) {
  if (t >= fo(e._capacity))
    return e._tail;
  if (t < 1 << e._level + X) {
    for (var n = e._root, r = e._level; n && r > 0; )
      n = n.array[t >>> r & Ue], r -= X;
    return n;
  }
}
function tr(e, t, n) {
  t !== void 0 && (t |= 0), n !== void 0 && (n |= 0);
  var r = e.__ownerID || new Kh(), i = e._origin, s = e._capacity, o = i + t, a = n === void 0 ? s : n < 0 ? s + n : i + n;
  if (o === i && a === s)
    return e;
  if (o >= a)
    return e.clear();
  for (var u = e._level, f = e._root, c = 0; o + c < 0; )
    f = new or(
      f && f.array.length ? [void 0, f] : [],
      r
    ), u += X, c += 1 << u;
  c && (o += c, i += c, a += c, s += c);
  for (var l = fo(s), h = fo(a); h >= 1 << u + X; )
    f = new or(
      f && f.array.length ? [f] : [],
      r
    ), u += X;
  var d = e._tail, _ = h < l ? cA(e, a - 1) : h > l ? new or([], r) : d;
  if (d && h > l && o < s && d.array.length) {
    f = Wi(f, r);
    for (var v = f, g = u; g > X; g -= X) {
      var y = l >>> g & Ue;
      v = v.array[y] = Wi(v.array[y], r);
    }
    v.array[l >>> X & Ue] = d;
  }
  if (a < s && (_ = _ && _.removeAfter(r, 0, a)), o >= h)
    o -= h, a -= h, u = X, f = null, _ = _ && _.removeBefore(r, 0, o);
  else if (o > i || h < l) {
    for (c = 0; f; ) {
      var b = o >>> u & Ue;
      if (b !== h >>> u & Ue)
        break;
      b && (c += (1 << u) * b), u -= X, f = f.array[b];
    }
    f && o > i && (f = f.removeBefore(r, u, o - c)), f && h < l && (f = f.removeAfter(
      r,
      u,
      h - c
    )), c && (o -= c, a -= c);
  }
  return e.__ownerID ? (e.size = a - o, e._origin = o, e._capacity = a, e._level = u, e._root = f, e._tail = _, e.__hash = void 0, e.__altered = !0, e) : uo(o, a, u, f, _);
}
function fo(e) {
  return e < dt ? 0 : e - 1 >>> X << X;
}
var bn = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? Ps() : tp(n) ? n : Ps().withMutations(function(r) {
      var i = qt(n);
      lt(i.size), i.forEach(function(s, o) {
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
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._map.clear(), this._list.clear(), this.__altered = !0, this) : Ps();
  }, t.prototype.set = function(r, i) {
    return G_(this, r, i);
  }, t.prototype.remove = function(r) {
    return G_(this, r, j);
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
    return r ? mp(i, s, r, this.__hash) : this.size === 0 ? Ps() : (this.__ownerID = r, this.__altered = !1, this._map = i, this._list = s, this);
  }, t;
}(ci);
bn.isOrderedMap = tp;
bn.prototype[_r] = !0;
bn.prototype[Wo] = bn.prototype.remove;
function mp(e, t, n, r) {
  var i = Object.create(bn.prototype);
  return i.size = e ? e.size : 0, i._map = e, i._list = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
var q_;
function Ps() {
  return q_ || (q_ = mp(hn(), Fa()));
}
function G_(e, t, n) {
  var r = e._map, i = e._list, s = r.get(t), o = s !== void 0, a, u;
  if (n === j) {
    if (!o)
      return e;
    i.size >= dt && i.size >= r.size * 2 ? (u = i.filter(function(f, c) {
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
  return e.__ownerID ? (e.size = a.size, e._map = a, e._list = u, e.__hash = void 0, e.__altered = !0, e) : mp(a, u);
}
var lA = "@@__IMMUTABLE_STACK__@@";
function ru(e) {
  return !!(e && // @ts-expect-error: maybeStack is typed as `{}`, need to change in 6.0 to `maybeStack && typeof maybeStack === 'object' && MAYBE_STACK_SYMBOL in maybeStack`
  e[lA]);
}
var Af = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? wa() : ru(n) ? n : wa().pushAll(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.prototype.toString = function() {
    return this.__toString("Stack [", "]");
  }, t.prototype.get = function(r, i) {
    var s = this._head;
    for (r = dr(this, r); s && r--; )
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
    return this.__ownerID ? (this.size = i, this._head = s, this.__hash = void 0, this.__altered = !0, this) : Ns(i, s);
  }, t.prototype.pushAll = function(r) {
    if (r = e(r), r.size === 0)
      return this;
    if (this.size === 0 && ru(r))
      return r;
    lt(r.size);
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
    ), this.__ownerID ? (this.size = i, this._head = s, this.__hash = void 0, this.__altered = !0, this) : Ns(i, s);
  }, t.prototype.pop = function() {
    return this.slice(1);
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._head = void 0, this.__hash = void 0, this.__altered = !0, this) : wa();
  }, t.prototype.slice = function(r, i) {
    if (qo(r, i, this.size))
      return this;
    var s = cs(r, this.size), o = Go(i, this.size);
    if (o !== this.size)
      return e.prototype.slice.call(this, r, i);
    for (var a = this.size - s, u = this._head; s--; )
      u = u.next;
    return this.__ownerID ? (this.size = a, this._head = u, this.__hash = void 0, this.__altered = !0, this) : Ns(a, u);
  }, t.prototype.__ensureOwner = function(r) {
    return r === this.__ownerID ? this : r ? Ns(this.size, this._head, r, this.__hash) : this.size === 0 ? wa() : (this.__ownerID = r, this.__altered = !1, this);
  }, t.prototype.__iterate = function(r, i) {
    var s = this;
    if (i)
      return new zi(this.toArray()).__iterate(
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
      return new zi(this.toArray()).__iterator(r, i);
    var s = 0, o = this._head;
    return new F(function() {
      if (o) {
        var a = o.value;
        return o = o.next, ne(r, s++, a);
      }
      return Le();
    });
  }, t;
}(ui);
Af.isStack = ru;
var Ge = Af.prototype;
Ge[lA] = !0;
Ge.shift = Ge.pop;
Ge.unshift = Ge.push;
Ge.unshiftAll = Ge.pushAll;
Ge.withMutations = Yo;
Ge.wasAltered = _p;
Ge.asImmutable = Jo;
Ge["@@transducer/init"] = Ge.asMutable = Xo;
Ge["@@transducer/step"] = function(e, t) {
  return e.unshift(t);
};
Ge["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
function Ns(e, t, n, r) {
  var i = Object.create(Ge);
  return i.size = e, i._head = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
var H_;
function wa() {
  return H_ || (H_ = Ns(0));
}
var hA = "@@__IMMUTABLE_SET__@@";
function Of(e) {
  return !!(e && // @ts-expect-error: maybeSet is typed as `{}`,  need to change in 6.0 to `maybeSeq && typeof maybeSet === 'object' && MAYBE_SET_SYMBOL in maybeSet`
  e[hA]);
}
function wp(e) {
  return Of(e) && Zt(e);
}
function Ap(e, t) {
  if (e === t)
    return !0;
  if (!ot(t) || // @ts-expect-error size should exists on Collection
  e.size !== void 0 && t.size !== void 0 && e.size !== t.size || // @ts-expect-error __hash exists on Collection
  e.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  t.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  e.__hash !== t.__hash || Z(e) !== Z(t) || at(e) !== at(t) || // @ts-expect-error Range extends Collection, which implements [Symbol.iterator], so it is valid
  Zt(e) !== Zt(t))
    return !1;
  if (e.size === 0 && t.size === 0)
    return !0;
  var n = !_f(e);
  if (Zt(e)) {
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
function li(e, t) {
  var n = function(r) {
    e.prototype[r] = t[r];
  };
  return Object.keys(t).forEach(n), Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(t).forEach(n), e;
}
function iu(e) {
  if (!e || typeof e != "object")
    return e;
  if (!ot(e)) {
    if (!vr(e))
      return e;
    e = je(e);
  }
  if (Z(e)) {
    var t = {};
    return e.__iterate(function(r, i) {
      t[i] = iu(r);
    }), t;
  }
  var n = [];
  return e.__iterate(function(r) {
    n.push(iu(r));
  }), n;
}
var Qo = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? $s() : Of(n) && !Zt(n) ? n : $s().withMutations(function(r) {
      var i = e(n);
      lt(i.size), i.forEach(function(s) {
        return r.add(s);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.fromKeys = function(r) {
    return this(qt(r).keySeq());
  }, t.intersect = function(r) {
    return r = Ee(r).toArray(), r.length ? Te.intersect.apply(t(r.pop()), r) : $s();
  }, t.union = function(r) {
    return r = Ee(r).toArray(), r.length ? Te.union.apply(t(r.pop()), r) : $s();
  }, t.prototype.toString = function() {
    return this.__toString("Set {", "}");
  }, t.prototype.has = function(r) {
    return this._map.has(r);
  }, t.prototype.add = function(r) {
    return Aa(this, this._map.set(r, r));
  }, t.prototype.remove = function(r) {
    return Aa(this, this._map.remove(r));
  }, t.prototype.clear = function() {
    return Aa(this, this._map.clear());
  }, t.prototype.map = function(r, i) {
    var s = this, o = !1, a = Aa(
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
    return Gi(Ui(this, r));
  }, t.prototype.sortBy = function(r, i) {
    return Gi(Ui(this, i, r));
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
}(ls);
Qo.isSet = Of;
var Te = Qo.prototype;
Te[hA] = !0;
Te[Wo] = Te.remove;
Te.merge = Te.concat = Te.union;
Te.withMutations = Yo;
Te.asImmutable = Jo;
Te["@@transducer/init"] = Te.asMutable = Xo;
Te["@@transducer/step"] = function(e, t) {
  return e.add(t);
};
Te["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
Te.__empty = $s;
Te.__make = pA;
function Aa(e, t) {
  return e.__ownerID ? (e.size = t.size, e._map = t, e) : t === e._map ? e : t.size === 0 ? e.__empty() : e.__make(t);
}
function pA(e, t) {
  var n = Object.create(Te);
  return n.size = e ? e.size : 0, n._map = e, n.__ownerID = t, n;
}
var K_;
function $s() {
  return K_ || (K_ = pA(hn()));
}
var dA = /* @__PURE__ */ function(e) {
  function t(n, r, i) {
    if (i === void 0 && (i = 1), !(this instanceof t))
      return new t(n, r, i);
    if (js(i !== 0, "Cannot step a Range by 0"), js(
      n !== void 0,
      "You must define a start value when using Range"
    ), js(
      r !== void 0,
      "You must define an end value when using Range"
    ), i = Math.abs(i), r < n && (i = -i), this._start = n, this._end = r, this._step = i, this.size = Math.max(0, Math.ceil((r - n) / i - 1) + 1), this.size === 0) {
      if (lc)
        return lc;
      lc = this;
    }
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.size === 0 ? "Range []" : "Range [ " + this._start + "..." + this._end + (this._step !== 1 ? " by " + this._step : "") + " ]";
  }, t.prototype.get = function(r, i) {
    return this.has(r) ? this._start + dr(this, r) * this._step : i;
  }, t.prototype.includes = function(r) {
    var i = (r - this._start) / this._step;
    return i >= 0 && i < this.size && i === Math.floor(i);
  }, t.prototype.slice = function(r, i) {
    return qo(r, i, this.size) ? this : (r = cs(r, this.size), i = Go(i, this.size), i <= r ? new t(0, 0) : new t(
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
        return Le();
      var f = a;
      return a += i ? -o : o, ne(r, i ? s - ++u : u++, f);
    });
  }, t.prototype.equals = function(r) {
    return r instanceof t ? this._start === r._start && this._end === r._end && this._step === r._step : Ap(this, r);
  }, t;
}(Ht), lc;
function Op(e, t, n) {
  for (var r = Yw(t), i = 0; i !== r.length; )
    if (e = ap(e, r[i++], j), e === j)
      return n;
  return e;
}
function _A(e, t) {
  return Op(this, e, t);
}
function vA(e, t) {
  return Op(e, t, j) !== j;
}
function h3(e) {
  return vA(this, e);
}
function gA() {
  lt(this.size);
  var e = {};
  return this.__iterate(function(t, n) {
    e[n] = t;
  }), e;
}
Ee.Iterator = F;
li(Ee, {
  // ### Conversion to other types
  toArray: function() {
    lt(this.size);
    var t = new Array(this.size || 0), n = Z(this), r = 0;
    return this.__iterate(function(i, s) {
      t[r++] = n ? [s, i] : i;
    }), t;
  },
  toIndexedSeq: function() {
    return new zw(this);
  },
  toJS: function() {
    return iu(this);
  },
  toKeyedSeq: function() {
    return new wf(this, !0);
  },
  toMap: function() {
    return ci(this.toKeyedSeq());
  },
  toObject: gA,
  toOrderedMap: function() {
    return bn(this.toKeyedSeq());
  },
  toOrderedSet: function() {
    return Gi(Z(this) ? this.valueSeq() : this);
  },
  toSet: function() {
    return Qo(Z(this) ? this.valueSeq() : this);
  },
  toSetSeq: function() {
    return new Uw(this);
  },
  toSeq: function() {
    return at(this) ? this.toIndexedSeq() : Z(this) ? this.toKeyedSeq() : this.toSetSeq();
  },
  toStack: function() {
    return Af(Z(this) ? this.valueSeq() : this);
  },
  toList: function() {
    return Zo(Z(this) ? this.valueSeq() : this);
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
    return Y(this, GL(this, t));
  },
  includes: function(t) {
    return this.some(function(n) {
      return Ae(n, t);
    });
  },
  entries: function() {
    return this.__iterator(Tt);
  },
  every: function(t, n) {
    lt(this.size);
    var r = !0;
    return this.__iterate(function(i, s, o) {
      if (!t.call(n, i, s, o))
        return r = !1, !1;
    }), r;
  },
  filter: function(t, n) {
    return Y(this, qw(this, t, n, !0));
  },
  partition: function(t, n) {
    return VL(this, t, n);
  },
  find: function(t, n, r) {
    var i = this.findEntry(t, n);
    return i ? i[1] : r;
  },
  forEach: function(t, n) {
    return lt(this.size), this.__iterate(n ? t.bind(n) : t);
  },
  join: function(t) {
    lt(this.size), t = t !== void 0 ? "" + t : ",";
    var n = "", r = !0;
    return this.__iterate(function(i) {
      r ? r = !1 : n += t, n += i != null ? i.toString() : "";
    }), n;
  },
  keys: function() {
    return this.__iterator(hs);
  },
  map: function(t, n) {
    return Y(this, Ww(this, t, n));
  },
  reduce: function(t, n, r) {
    return Y_(
      this,
      t,
      n,
      r,
      arguments.length < 2,
      !1
    );
  },
  reduceRight: function(t, n, r) {
    return Y_(
      this,
      t,
      n,
      r,
      arguments.length < 2,
      !0
    );
  },
  reverse: function() {
    return Y(this, np(this, !0));
  },
  slice: function(t, n) {
    return Y(this, rp(this, t, n, !0));
  },
  some: function(t, n) {
    lt(this.size);
    var r = !1;
    return this.__iterate(function(i, s, o) {
      if (t.call(n, i, s, o))
        return r = !0, !1;
    }), r;
  },
  sort: function(t) {
    return Y(this, Ui(this, t));
  },
  values: function() {
    return this.__iterator(xt);
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
    return Bi(
      t ? this.toSeq().filter(t, n) : this
    );
  },
  countBy: function(t, n) {
    return UL(this, t, n);
  },
  equals: function(t) {
    return Ap(this, t);
  },
  entrySeq: function() {
    var t = this;
    if (t._cache)
      return new zi(t._cache);
    var n = t.toSeq().map(d3).toIndexedSeq();
    return n.fromEntrySeq = function() {
      return t.toSeq();
    }, n;
  },
  filterNot: function(t, n) {
    return this.filter(hc(t), n);
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
    return this.find(Nw, null, t);
  },
  flatMap: function(t, n) {
    return Y(this, HL(this, t, n));
  },
  flatten: function(t) {
    return Y(this, Hw(this, t, !0));
  },
  fromEntrySeq: function() {
    return new kw(this);
  },
  get: function(t, n) {
    return this.find(function(r, i) {
      return Ae(i, t);
    }, void 0, n);
  },
  getIn: _A,
  groupBy: function(t, n) {
    return kL(this, t, n);
  },
  has: function(t) {
    return this.get(t, j) !== j;
  },
  hasIn: h3,
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
    return this.toSeq().map(p3).toIndexedSeq();
  },
  last: function(t) {
    return this.toSeq().reverse().first(t);
  },
  lastKeyOf: function(t) {
    return this.toKeyedSeq().reverse().keyOf(t);
  },
  max: function(t) {
    return ba(this, t);
  },
  maxBy: function(t, n) {
    return ba(this, n, t);
  },
  min: function(t) {
    return ba(
      this,
      t ? X_(t) : Z_
    );
  },
  minBy: function(t, n) {
    return ba(
      this,
      n ? X_(n) : Z_,
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
    return Y(this, Gw(this, t, n, !0));
  },
  skipUntil: function(t, n) {
    return this.skipWhile(hc(t), n);
  },
  sortBy: function(t, n) {
    return Y(this, Ui(this, n, t));
  },
  take: function(t) {
    return this.slice(0, Math.max(0, t));
  },
  takeLast: function(t) {
    return this.slice(-Math.max(0, t));
  },
  takeWhile: function(t, n) {
    return Y(this, WL(this, t, n));
  },
  takeUntil: function(t, n) {
    return this.takeWhile(hc(t), n);
  },
  update: function(t) {
    return t(this);
  },
  valueSeq: function() {
    return this.toIndexedSeq();
  },
  // ### Hashable Object
  hashCode: function() {
    return this.__hash || (this.__hash = _3(this));
  }
  // ### Internal
  // abstract __iterate(fn, reverse)
  // abstract __iterator(type, reverse)
});
var Fe = Ee.prototype;
Fe[Iw] = !0;
Fe[gf] = Fe.values;
Fe.toJSON = Fe.toArray;
Fe.__toStringMapper = so;
Fe.inspect = Fe.toSource = function() {
  return this.toString();
};
Fe.chain = Fe.flatMap;
Fe.contains = Fe.includes;
li(qt, {
  // ### More sequential methods
  flip: function() {
    return Y(this, Vw(this));
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
var ea = qt.prototype;
ea[eu] = !0;
ea[gf] = Fe.entries;
ea.toJSON = gA;
ea.__toStringMapper = function(e, t) {
  return so(t) + ": " + so(e);
};
li(ui, {
  // ### Conversion to other types
  toKeyedSeq: function() {
    return new wf(this, !1);
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  filter: function(t, n) {
    return Y(this, qw(this, t, n, !1));
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
    return Y(this, np(this, !1));
  },
  slice: function(t, n) {
    return Y(this, rp(this, t, n, !1));
  },
  splice: function(t, n) {
    var r = arguments.length;
    if (n = Math.max(n || 0, 0), r === 0 || r === 2 && !n)
      return this;
    t = cs(t, t < 0 ? this.count() : this.size);
    var i = this.slice(0, t);
    return Y(
      this,
      r === 1 ? i : i.concat(cn(arguments, 2), this.slice(t + n))
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
    return Y(this, Hw(this, t, !1));
  },
  get: function(t, n) {
    return t = dr(this, t), t < 0 || this.size === 1 / 0 || this.size !== void 0 && t > this.size ? n : this.find(function(r, i) {
      return i === t;
    }, void 0, n);
  },
  has: function(t) {
    return t = dr(this, t), t >= 0 && (this.size !== void 0 ? this.size === 1 / 0 || t < this.size : this.indexOf(t) !== -1);
  },
  interpose: function(t) {
    return Y(this, KL(this, t));
  },
  interleave: function() {
    var t = [this].concat(cn(arguments)), n = ma(this.toSeq(), Ht.of, t), r = n.flatten(!0);
    return n.size && (r.size = n.size * t.length), Y(this, r);
  },
  keySeq: function() {
    return dA(0, this.size);
  },
  last: function(t) {
    return this.get(-1, t);
  },
  skipWhile: function(t, n) {
    return Y(this, Gw(this, t, n, !1));
  },
  zip: function() {
    var t = [this].concat(cn(arguments));
    return Y(this, ma(this, J_, t));
  },
  zipAll: function() {
    var t = [this].concat(cn(arguments));
    return Y(this, ma(this, J_, t, !0));
  },
  zipWith: function(t) {
    var n = cn(arguments);
    return n[0] = this, Y(this, ma(this, t, n));
  }
});
var _s = ui.prototype;
_s[tu] = !0;
_s[_r] = !0;
li(ls, {
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
var qi = ls.prototype;
qi.has = Fe.includes;
qi.contains = qi.includes;
qi.keys = qi.values;
li(Tr, ea);
li(Ht, _s);
li(ds, qi);
function Y_(e, t, n, r, i, s) {
  return lt(e.size), e.__iterate(function(o, a, u) {
    i ? (i = !1, n = o) : n = t.call(r, n, o, a, u);
  }, s), n;
}
function p3(e, t) {
  return t;
}
function d3(e, t) {
  return [t, e];
}
function hc(e) {
  return function() {
    return !e.apply(this, arguments);
  };
}
function X_(e) {
  return function() {
    return -e.apply(this, arguments);
  };
}
function J_() {
  return cn(arguments);
}
function Z_(e, t) {
  return e < t ? 1 : e > t ? -1 : 0;
}
function _3(e) {
  if (e.size === 1 / 0)
    return 0;
  var t = Zt(e), n = Z(e), r = t ? 1 : 0;
  return e.__iterate(
    n ? t ? function(i, s) {
      r = 31 * r + Q_(Qe(i), Qe(s)) | 0;
    } : function(i, s) {
      r = r + Q_(Qe(i), Qe(s)) | 0;
    } : t ? function(i) {
      r = 31 * r + Qe(i) | 0;
    } : function(i) {
      r = r + Qe(i) | 0;
    }
  ), v3(e.size, r);
}
function v3(e, t) {
  return t = Ss(t, 3432918353), t = Ss(t << 15 | t >>> -15, 461845907), t = Ss(t << 13 | t >>> -13, 5), t = (t + 3864292196 | 0) ^ e, t = Ss(t ^ t >>> 16, 2246822507), t = Ss(t ^ t >>> 13, 3266489909), t = mf(t ^ t >>> 16), t;
}
function Q_(e, t) {
  return e ^ t + 2654435769 + (e << 6) + (e >> 2) | 0;
}
var Gi = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? ul() : wp(n) ? n : ul().withMutations(function(r) {
      var i = ls(n);
      lt(i.size), i.forEach(function(s) {
        return r.add(s);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.fromKeys = function(r) {
    return this(qt(r).keySeq());
  }, t.prototype.toString = function() {
    return this.__toString("OrderedSet {", "}");
  }, t;
}(Qo);
Gi.isOrderedSet = wp;
var hi = Gi.prototype;
hi[_r] = !0;
hi.zip = _s.zip;
hi.zipWith = _s.zipWith;
hi.zipAll = _s.zipAll;
hi.__empty = ul;
hi.__make = yA;
function yA(e, t) {
  var n = Object.create(hi);
  return n.size = e ? e.size : 0, n._map = e, n.__ownerID = t, n;
}
var ev;
function ul() {
  return ev || (ev = yA(Ps()));
}
var g3 = {
  LeftThenRight: -1,
  RightThenLeft: 1
};
function y3(e) {
  if (xr(e))
    throw new Error(
      "Can not call `Record` with an immutable Record as default values. Use a plain javascript object instead."
    );
  if (Gt(e))
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
  y3(t);
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
          "Cannot define " + Sp(this) + ' with property "' + h + '" since that property name is part of the Record API.'
        ) : b3(s, h);
      }
    }
    return this.__ownerID = void 0, this._values = Zo().withMutations(function(d) {
      d.setSize(u._keys.length), qt(a).forEach(function(_, v) {
        d.set(u._indices[v], _ === u._defaultValues[v] ? void 0 : _);
      });
    }), this;
  }, s = i.prototype = Object.create(Q);
  return s.constructor = i, n && (i.displayName = n), i;
};
ge.prototype.toString = function() {
  for (var t = Sp(this) + " { ", n = this._keys, r, i = 0, s = n.length; i !== s; i++)
    r = n[i], t += (i ? ", " : "") + r + ": " + so(this.get(r));
  return t + " }";
};
ge.prototype.equals = function(t) {
  return this === t || xr(t) && Hi(this).equals(Hi(t));
};
ge.prototype.hashCode = function() {
  return Hi(this).hashCode();
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
      return Ep(this, r);
  }
  return this;
};
ge.prototype.remove = function(t) {
  return this.set(t);
};
ge.prototype.clear = function() {
  var t = this._values.clear().setSize(this._keys.length);
  return this.__ownerID ? this : Ep(this, t);
};
ge.prototype.wasAltered = function() {
  return this._values.wasAltered();
};
ge.prototype.toSeq = function() {
  return Hi(this);
};
ge.prototype.toJS = function() {
  return iu(this);
};
ge.prototype.entries = function() {
  return this.__iterator(Tt);
};
ge.prototype.__iterator = function(t, n) {
  return Hi(this).__iterator(t, n);
};
ge.prototype.__iterate = function(t, n) {
  return Hi(this).__iterate(t, n);
};
ge.prototype.__ensureOwner = function(t) {
  if (t === this.__ownerID)
    return this;
  var n = this._values.__ensureOwner(t);
  return t ? Ep(this, n, t) : (this.__ownerID = t, this._values = n, this);
};
ge.isRecord = xr;
ge.getDescriptiveName = Sp;
var Q = ge.prototype;
Q[Cw] = !0;
Q[Wo] = Q.remove;
Q.deleteIn = Q.removeIn = fp;
Q.getIn = _A;
Q.hasIn = Fe.hasIn;
Q.merge = nA;
Q.mergeWith = rA;
Q.mergeIn = pp;
Q.mergeDeep = sA;
Q.mergeDeepWith = oA;
Q.mergeDeepIn = dp;
Q.setIn = up;
Q.update = lp;
Q.updateIn = hp;
Q.withMutations = Yo;
Q.asMutable = Xo;
Q.asImmutable = Jo;
Q[gf] = Q.entries;
Q.toJSON = Q.toObject = Fe.toObject;
Q.inspect = Q.toSource = function() {
  return this.toString();
};
function Ep(e, t, n) {
  var r = Object.create(Object.getPrototypeOf(e));
  return r._values = t, r.__ownerID = n, r;
}
function Sp(e) {
  return e.constructor.displayName || e.constructor.name || "Record";
}
function Hi(e) {
  return Qh(e._keys.map(function(t) {
    return [t, e.get(t)];
  }));
}
function b3(e, t) {
  try {
    Object.defineProperty(e, t, {
      get: function() {
        return this.get(t);
      },
      set: function(n) {
        js(this.__ownerID, "Cannot set on an immutable record."), this.set(t, n);
      }
    });
  } catch {
  }
}
var m3 = /* @__PURE__ */ function(e) {
  function t(n, r) {
    if (!(this instanceof t))
      return new t(n, r);
    if (this._value = n, this.size = r === void 0 ? 1 / 0 : Math.max(0, r), this.size === 0) {
      if (pc)
        return pc;
      pc = this;
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
    return qo(r, i, s) ? this : new t(
      this._value,
      Go(i, s) - cs(r, s)
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
        return a === o ? Le() : ne(r, i ? o - ++a : a++, s._value);
      }
    );
  }, t.prototype.equals = function(r) {
    return r instanceof t ? Ae(this._value, r._value) : Ap(this, r);
  }, t;
}(Ht), pc;
function w3(e, t) {
  return bA(
    [],
    t || A3,
    e,
    "",
    t && t.length > 2 ? [] : void 0,
    { "": e }
  );
}
function bA(e, t, n, r, i, s) {
  if (typeof n != "string" && !Gt(n) && (Xh(n) || Yh(n) || op(n))) {
    if (~e.indexOf(n))
      throw new TypeError("Cannot convert circular structure to Immutable");
    e.push(n), i && r !== "" && i.push(r);
    var o = t.call(
      s,
      r,
      je(n).map(
        function(a, u) {
          return bA(e, t, a, u, i, n);
        }
      ),
      i && i.slice()
    );
    return e.pop(), i && i.pop(), o;
  }
  return n;
}
function A3(e, t) {
  return at(t) ? t.toList() : Z(t) ? t.toMap() : t.toSet();
}
var O3 = "5.1.3", E3 = Ee;
const I4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Collection: Ee,
  Iterable: E3,
  List: Zo,
  Map: ci,
  OrderedMap: bn,
  OrderedSet: Gi,
  PairSorting: g3,
  Range: dA,
  Record: ge,
  Repeat: m3,
  Seq: je,
  Set: Qo,
  Stack: Af,
  fromJS: w3,
  get: ap,
  getIn: Op,
  has: Xw,
  hasIn: vA,
  hash: Qe,
  is: Ae,
  isAssociative: _f,
  isCollection: ot,
  isImmutable: Gt,
  isIndexed: at,
  isKeyed: Z,
  isList: bp,
  isMap: bf,
  isOrdered: Zt,
  isOrderedMap: tp,
  isOrderedSet: wp,
  isPlainObject: op,
  isRecord: xr,
  isSeq: vf,
  isSet: Of,
  isStack: ru,
  isValueObject: rl,
  merge: XL,
  mergeDeep: ZL,
  mergeDeepWith: QL,
  mergeWith: JL,
  remove: Jw,
  removeIn: tA,
  set: Zw,
  setIn: eA,
  update: cp,
  updateIn: fi,
  version: O3
}, Symbol.toStringTag, { value: "Module" }));
// @__NO_SIDE_EFFECTS__
function S3(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const x3 = Object.freeze({}), T3 = () => {
}, su = Object.assign, R3 = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, P3 = Object.prototype.hasOwnProperty, ou = (e, t) => P3.call(e, t), Vn = Array.isArray, Mi = (e) => Ef(e) === "[object Map]", N3 = (e) => Ef(e) === "[object Set]", co = (e) => typeof e == "function", $3 = (e) => typeof e == "string", ta = (e) => typeof e == "symbol", Hr = (e) => e !== null && typeof e == "object", M3 = Object.prototype.toString, Ef = (e) => M3.call(e), mA = (e) => Ef(e).slice(8, -1), I3 = (e) => Ef(e) === "[object Object]", xp = (e) => $3(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, D3 = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, C3 = D3((e) => e.charAt(0).toUpperCase() + e.slice(1)), ar = (e, t) => !Object.is(e, t), L3 = (e, t, n, r = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: r,
    value: n
  });
};
function ut(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let Me;
class wA {
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
      ut("cannot run an inactive effect scope.");
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
function j3(e) {
  return new wA(e);
}
function AA() {
  return Me;
}
function F3(e, t = !1) {
  Me ? Me.cleanups.push(e) : t || ut(
    "onScopeDispose() is called when there is no active effect scope to be associated with."
  );
}
let z;
const B3 = {
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
}, dc = /* @__PURE__ */ new WeakSet();
class lo {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Me && Me.active && Me.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, dc.has(this) && (dc.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || EA(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, tv(this), SA(this);
    const t = z, n = gt;
    z = this, gt = !0;
    try {
      return this.fn();
    } finally {
      z !== this && ut(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), xA(this), z = t, gt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Pp(t);
      this.deps = this.depsTail = void 0, tv(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? dc.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    fl(this) && this.run();
  }
  get dirty() {
    return fl(this);
  }
}
let OA = 0, Bs, zs;
function EA(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = zs, zs = e;
    return;
  }
  e.next = Bs, Bs = e;
}
function Tp() {
  OA++;
}
function Rp() {
  if (--OA > 0)
    return;
  if (zs) {
    let t = zs;
    for (zs = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Bs; ) {
    let t = Bs;
    for (Bs = void 0; t; ) {
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
function SA(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function xA(e) {
  let t, n = e.depsTail, r = n;
  for (; r; ) {
    const i = r.prevDep;
    r.version === -1 ? (r === n && (n = i), Pp(r), z3(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = i;
  }
  e.deps = t, e.depsTail = n;
}
function fl(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (TA(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function TA(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === ho) || (e.globalVersion = ho, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !fl(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = z, r = gt;
  z = e, gt = !0;
  try {
    SA(e);
    const i = e.fn(e._value);
    (t.version === 0 || ar(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    z = n, gt = r, xA(e), e.flags &= -3;
  }
}
function Pp(e, t = !1) {
  const { dep: n, prevSub: r, nextSub: i } = e;
  if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subsHead === e && (n.subsHead = i), n.subs === e && (n.subs = r, !r && n.computed)) {
    n.computed.flags &= -5;
    for (let s = n.computed.deps; s; s = s.nextDep)
      Pp(s, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function z3(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function U3(e, t) {
  e.effect instanceof lo && (e = e.effect.fn);
  const n = new lo(e);
  t && su(n, t);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const r = n.run.bind(n);
  return r.effect = n, r;
}
function k3(e) {
  e.effect.stop();
}
let gt = !0;
const Np = [];
function $p() {
  Np.push(gt), gt = !1;
}
function V3() {
  Np.push(gt), gt = !0;
}
function Mp() {
  const e = Np.pop();
  gt = e === void 0 ? !0 : e;
}
function W3(e, t = !1) {
  z instanceof lo ? z.cleanup = e : t || ut(
    "onEffectCleanup() was called when there was no active effect to associate with."
  );
}
function tv(e) {
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
let ho = 0;
class q3 {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Sf {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(t) {
    if (!z || !gt || z === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== z)
      n = this.activeLink = new q3(z, this), z.deps ? (n.prevDep = z.depsTail, z.depsTail.nextDep = n, z.depsTail = n) : z.deps = z.depsTail = n, RA(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const r = n.nextDep;
      r.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = r), n.prevDep = z.depsTail, n.nextDep = void 0, z.depsTail.nextDep = n, z.depsTail = n, z.deps === n && (z.deps = r);
    }
    return z.onTrack && z.onTrack(
      su(
        {
          effect: z
        },
        t
      )
    ), n;
  }
  trigger(t) {
    this.version++, ho++, this.notify(t);
  }
  notify(t) {
    Tp();
    try {
      for (let n = this.subsHead; n; n = n.nextSub)
        n.sub.onTrigger && !(n.sub.flags & 8) && n.sub.onTrigger(
          su(
            {
              effect: n.sub
            },
            t
          )
        );
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Rp();
    }
  }
}
function RA(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let r = t.deps; r; r = r.nextDep)
        RA(r);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const au = /* @__PURE__ */ new WeakMap(), ur = Symbol(
  "Object iterate"
), uu = Symbol(
  "Map keys iterate"
), Ki = Symbol(
  "Array iterate"
);
function ze(e, t, n) {
  if (gt && z) {
    let r = au.get(e);
    r || au.set(e, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || (r.set(n, i = new Sf()), i.map = r, i.key = n), i.track({
      target: e,
      type: t,
      key: n
    });
  }
}
function Bn(e, t, n, r, i, s) {
  const o = au.get(e);
  if (!o) {
    ho++;
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
  if (Tp(), t === "clear")
    o.forEach(a);
  else {
    const u = Vn(e), f = u && xp(n);
    if (u && n === "length") {
      const c = Number(r);
      o.forEach((l, h) => {
        (h === "length" || h === Ki || !ta(h) && h >= c) && a(l);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && a(o.get(n)), f && a(o.get(Ki)), t) {
        case "add":
          u ? f && a(o.get("length")) : (a(o.get(ur)), Mi(e) && a(o.get(uu)));
          break;
        case "delete":
          u || (a(o.get(ur)), Mi(e) && a(o.get(uu)));
          break;
        case "set":
          Mi(e) && a(o.get(ur));
          break;
      }
  }
  Rp();
}
function G3(e, t) {
  const n = au.get(e);
  return n && n.get(t);
}
function Cr(e) {
  const t = V(e);
  return t === e ? t : (ze(t, "iterate", Ki), jt(e) ? t : t.map(Ie));
}
function xf(e) {
  return ze(e = V(e), "iterate", Ki), e;
}
const H3 = {
  __proto__: null,
  [Symbol.iterator]() {
    return _c(this, Symbol.iterator, Ie);
  },
  concat(...e) {
    return Cr(this).concat(
      ...e.map((t) => Vn(t) ? Cr(t) : t)
    );
  },
  entries() {
    return _c(this, "entries", (e) => (e[1] = Ie(e[1]), e));
  },
  every(e, t) {
    return Ln(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Ln(this, "filter", e, t, (n) => n.map(Ie), arguments);
  },
  find(e, t) {
    return Ln(this, "find", e, t, Ie, arguments);
  },
  findIndex(e, t) {
    return Ln(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Ln(this, "findLast", e, t, Ie, arguments);
  },
  findLastIndex(e, t) {
    return Ln(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Ln(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return vc(this, "includes", e);
  },
  indexOf(...e) {
    return vc(this, "indexOf", e);
  },
  join(e) {
    return Cr(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return vc(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Ln(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return xs(this, "pop");
  },
  push(...e) {
    return xs(this, "push", e);
  },
  reduce(e, ...t) {
    return nv(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return nv(this, "reduceRight", e, t);
  },
  shift() {
    return xs(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Ln(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return xs(this, "splice", e);
  },
  toReversed() {
    return Cr(this).toReversed();
  },
  toSorted(e) {
    return Cr(this).toSorted(e);
  },
  toSpliced(...e) {
    return Cr(this).toSpliced(...e);
  },
  unshift(...e) {
    return xs(this, "unshift", e);
  },
  values() {
    return _c(this, "values", Ie);
  }
};
function _c(e, t, n) {
  const r = xf(e), i = r[t]();
  return r !== e && !jt(e) && (i._next = i.next, i.next = () => {
    const s = i._next();
    return s.done || (s.value = n(s.value)), s;
  }), i;
}
const K3 = Array.prototype;
function Ln(e, t, n, r, i, s) {
  const o = xf(e), a = o !== e && !jt(e), u = o[t];
  if (u !== K3[t]) {
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
function nv(e, t, n, r) {
  const i = xf(e);
  let s = n;
  return i !== e && (jt(e) ? n.length > 3 && (s = function(o, a, u) {
    return n.call(this, o, a, u, e);
  }) : s = function(o, a, u) {
    return n.call(this, o, Ie(a), u, e);
  }), i[t](s, ...r);
}
function vc(e, t, n) {
  const r = V(e);
  ze(r, "iterate", Ki);
  const i = r[t](...n);
  return (i === -1 || i === !1) && Dp(n[0]) ? (n[0] = V(n[0]), r[t](...n)) : i;
}
function xs(e, t, n = []) {
  $p(), Tp();
  const r = V(e)[t].apply(e, n);
  return Rp(), Mp(), r;
}
const Y3 = /* @__PURE__ */ S3("__proto__,__v_isRef,__isVue"), PA = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ta)
);
function X3(e) {
  ta(e) || (e = String(e));
  const t = V(this);
  return ze(t, "has", e), t.hasOwnProperty(e);
}
class NA {
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
      return r === (i ? s ? LA : CA : s ? DA : IA).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(r) ? t : void 0;
    const o = Vn(t);
    if (!i) {
      let u;
      if (o && (u = H3[n]))
        return u;
      if (n === "hasOwnProperty")
        return X3;
    }
    const a = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      Ve(t) ? t : r
    );
    if ((ta(n) ? PA.has(n) : Y3(n)) || (i || ze(t, "get", n), s))
      return a;
    if (Ve(a)) {
      const u = o && xp(n) ? a : a.value;
      return i && Hr(u) ? fu(u) : u;
    }
    return Hr(a) ? i ? fu(a) : Ip(a) : a;
  }
}
class $A extends NA {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, r, i) {
    let s = t[n];
    if (!this._isShallow) {
      const u = gr(s);
      if (!jt(r) && !gr(r) && (s = V(s), r = V(r)), !Vn(t) && Ve(s) && !Ve(r))
        return u ? (ut(
          `Set operation on key "${String(n)}" failed: target is readonly.`,
          t[n]
        ), !0) : (s.value = r, !0);
    }
    const o = Vn(t) && xp(n) ? Number(n) < t.length : ou(t, n), a = Reflect.set(
      t,
      n,
      r,
      Ve(t) ? t : i
    );
    return t === V(i) && (o ? ar(r, s) && Bn(t, "set", n, r, s) : Bn(t, "add", n, r)), a;
  }
  deleteProperty(t, n) {
    const r = ou(t, n), i = t[n], s = Reflect.deleteProperty(t, n);
    return s && r && Bn(t, "delete", n, void 0, i), s;
  }
  has(t, n) {
    const r = Reflect.has(t, n);
    return (!ta(n) || !PA.has(n)) && ze(t, "has", n), r;
  }
  ownKeys(t) {
    return ze(
      t,
      "iterate",
      Vn(t) ? "length" : ur
    ), Reflect.ownKeys(t);
  }
}
class MA extends NA {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return ut(
      `Set operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, n) {
    return ut(
      `Delete operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
}
const J3 = /* @__PURE__ */ new $A(), Z3 = /* @__PURE__ */ new MA(), Q3 = /* @__PURE__ */ new $A(!0), ej = /* @__PURE__ */ new MA(!0), cl = (e) => e, Oa = (e) => Reflect.getPrototypeOf(e);
function tj(e, t, n) {
  return function(...r) {
    const i = this.__v_raw, s = V(i), o = Mi(s), a = e === "entries" || e === Symbol.iterator && o, u = e === "keys" && o, f = i[e](...r), c = n ? cl : t ? cu : Ie;
    return !t && ze(
      s,
      "iterate",
      u ? uu : ur
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
function Ea(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      ut(
        `${C3(e)} operation ${n}failed: target is readonly.`,
        V(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function nj(e, t) {
  const n = {
    get(i) {
      const s = this.__v_raw, o = V(s), a = V(i);
      e || (ar(i, a) && ze(o, "get", i), ze(o, "get", a));
      const { has: u } = Oa(o), f = t ? cl : e ? cu : Ie;
      if (u.call(o, i))
        return f(s.get(i));
      if (u.call(o, a))
        return f(s.get(a));
      s !== o && s.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && ze(V(i), "iterate", ur), i.size;
    },
    has(i) {
      const s = this.__v_raw, o = V(s), a = V(i);
      return e || (ar(i, a) && ze(o, "has", i), ze(o, "has", a)), i === a ? s.has(i) : s.has(i) || s.has(a);
    },
    forEach(i, s) {
      const o = this, a = o.__v_raw, u = V(a), f = t ? cl : e ? cu : Ie;
      return !e && ze(u, "iterate", ur), a.forEach((c, l) => i.call(s, f(c), f(l), o));
    }
  };
  return su(
    n,
    e ? {
      add: Ea("add"),
      set: Ea("set"),
      delete: Ea("delete"),
      clear: Ea("clear")
    } : {
      add(i) {
        !t && !jt(i) && !gr(i) && (i = V(i));
        const s = V(this);
        return Oa(s).has.call(s, i) || (s.add(i), Bn(s, "add", i, i)), this;
      },
      set(i, s) {
        !t && !jt(s) && !gr(s) && (s = V(s));
        const o = V(this), { has: a, get: u } = Oa(o);
        let f = a.call(o, i);
        f ? rv(o, a, i) : (i = V(i), f = a.call(o, i));
        const c = u.call(o, i);
        return o.set(i, s), f ? ar(s, c) && Bn(o, "set", i, s, c) : Bn(o, "add", i, s), this;
      },
      delete(i) {
        const s = V(this), { has: o, get: a } = Oa(s);
        let u = o.call(s, i);
        u ? rv(s, o, i) : (i = V(i), u = o.call(s, i));
        const f = a ? a.call(s, i) : void 0, c = s.delete(i);
        return u && Bn(s, "delete", i, void 0, f), c;
      },
      clear() {
        const i = V(this), s = i.size !== 0, o = Mi(i) ? new Map(i) : new Set(i), a = i.clear();
        return s && Bn(
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
    n[i] = tj(i, e, t);
  }), n;
}
function Tf(e, t) {
  const n = nj(e, t);
  return (r, i, s) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? r : Reflect.get(
    ou(n, i) && i in r ? n : r,
    i,
    s
  );
}
const rj = {
  get: /* @__PURE__ */ Tf(!1, !1)
}, ij = {
  get: /* @__PURE__ */ Tf(!1, !0)
}, sj = {
  get: /* @__PURE__ */ Tf(!0, !1)
}, oj = {
  get: /* @__PURE__ */ Tf(!0, !0)
};
function rv(e, t, n) {
  const r = V(n);
  if (r !== n && t.call(e, r)) {
    const i = mA(e);
    ut(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const IA = /* @__PURE__ */ new WeakMap(), DA = /* @__PURE__ */ new WeakMap(), CA = /* @__PURE__ */ new WeakMap(), LA = /* @__PURE__ */ new WeakMap();
function aj(e) {
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
function uj(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : aj(mA(e));
}
function Ip(e) {
  return gr(e) ? e : Rf(
    e,
    !1,
    J3,
    rj,
    IA
  );
}
function fj(e) {
  return Rf(
    e,
    !1,
    Q3,
    ij,
    DA
  );
}
function fu(e) {
  return Rf(
    e,
    !0,
    Z3,
    sj,
    CA
  );
}
function cj(e) {
  return Rf(
    e,
    !0,
    ej,
    oj,
    LA
  );
}
function Rf(e, t, n, r, i) {
  if (!Hr(e))
    return ut(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = uj(e);
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
function Ii(e) {
  return gr(e) ? Ii(e.__v_raw) : !!(e && e.__v_isReactive);
}
function gr(e) {
  return !!(e && e.__v_isReadonly);
}
function jt(e) {
  return !!(e && e.__v_isShallow);
}
function Dp(e) {
  return e ? !!e.__v_raw : !1;
}
function V(e) {
  const t = e && e.__v_raw;
  return t ? V(t) : e;
}
function lj(e) {
  return !ou(e, "__v_skip") && Object.isExtensible(e) && L3(e, "__v_skip", !0), e;
}
const Ie = (e) => Hr(e) ? Ip(e) : e, cu = (e) => Hr(e) ? fu(e) : e;
function Ve(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function jA(e) {
  return FA(e, !1);
}
function hj(e) {
  return FA(e, !0);
}
function FA(e, t) {
  return Ve(e) ? e : new pj(e, t);
}
class pj {
  constructor(t, n) {
    this.dep = new Sf(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : V(t), this._value = n ? t : Ie(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }), this._value;
  }
  set value(t) {
    const n = this._rawValue, r = this.__v_isShallow || jt(t) || gr(t);
    t = r ? t : V(t), ar(t, n) && (this._rawValue = t, this._value = r ? t : Ie(t), this.dep.trigger({
      target: this,
      type: "set",
      key: "value",
      newValue: t,
      oldValue: n
    }));
  }
}
function dj(e) {
  e.dep && e.dep.trigger({
    target: e,
    type: "set",
    key: "value",
    newValue: e._value
  });
}
function Cp(e) {
  return Ve(e) ? e.value : e;
}
function _j(e) {
  return co(e) ? e() : Cp(e);
}
const vj = {
  get: (e, t, n) => t === "__v_raw" ? e : Cp(Reflect.get(e, t, n)),
  set: (e, t, n, r) => {
    const i = e[t];
    return Ve(i) && !Ve(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
  }
};
function gj(e) {
  return Ii(e) ? e : new Proxy(e, vj);
}
class yj {
  constructor(t) {
    this.__v_isRef = !0, this._value = void 0;
    const n = this.dep = new Sf(), { get: r, set: i } = t(n.track.bind(n), n.trigger.bind(n));
    this._get = r, this._set = i;
  }
  get value() {
    return this._value = this._get();
  }
  set value(t) {
    this._set(t);
  }
}
function bj(e) {
  return new yj(e);
}
function mj(e) {
  Dp(e) || ut("toRefs() expects a reactive object but received a plain one.");
  const t = Vn(e) ? new Array(e.length) : {};
  for (const n in e)
    t[n] = BA(e, n);
  return t;
}
class wj {
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
    return G3(V(this._object), this._key);
  }
}
class Aj {
  constructor(t) {
    this._getter = t, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
function Oj(e, t, n) {
  return Ve(e) ? e : co(e) ? new Aj(e) : Hr(e) && arguments.length > 1 ? BA(e, t, n) : jA(e);
}
function BA(e, t, n) {
  const r = e[t];
  return Ve(r) ? r : new wj(e, t, n);
}
class Ej {
  constructor(t, n, r) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new Sf(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = ho - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = r;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    z !== this)
      return EA(this, !0), !0;
  }
  get value() {
    const t = this.dep.track({
      target: this,
      type: "get",
      key: "value"
    });
    return TA(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter ? this.setter(t) : ut("Write operation failed: computed value is readonly");
  }
}
function Sj(e, t, n = !1) {
  let r, i;
  co(e) ? r = e : (r = e.get, i = e.set);
  const s = new Ej(r, i, n);
  return t && !n && (s.onTrack = t.onTrack, s.onTrigger = t.onTrigger), s;
}
const xj = {
  GET: "get",
  HAS: "has",
  ITERATE: "iterate"
}, Tj = {
  SET: "set",
  ADD: "add",
  DELETE: "delete",
  CLEAR: "clear"
}, Rj = {
  SKIP: "__v_skip",
  IS_REACTIVE: "__v_isReactive",
  IS_READONLY: "__v_isReadonly",
  IS_SHALLOW: "__v_isShallow",
  RAW: "__v_raw",
  IS_REF: "__v_isRef"
}, Pj = {
  WATCH_GETTER: 2,
  2: "WATCH_GETTER",
  WATCH_CALLBACK: 3,
  3: "WATCH_CALLBACK",
  WATCH_CLEANUP: 4,
  4: "WATCH_CLEANUP"
}, Sa = {}, lu = /* @__PURE__ */ new WeakMap();
let nr;
function Nj() {
  return nr;
}
function zA(e, t = !1, n = nr) {
  if (n) {
    let r = lu.get(n);
    r || lu.set(n, r = []), r.push(e);
  } else t || ut(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function $j(e, t, n = x3) {
  const { immediate: r, deep: i, once: s, scheduler: o, augmentJob: a, call: u } = n, f = (A) => {
    (n.onWarn || ut)(
      "Invalid watch source: ",
      A,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, c = (A) => i ? A : jt(A) || i === !1 || i === 0 ? zn(A, 1) : zn(A);
  let l, h, d, _, v = !1, g = !1;
  if (Ve(e) ? (h = () => e.value, v = jt(e)) : Ii(e) ? (h = () => c(e), v = !0) : Vn(e) ? (g = !0, v = e.some((A) => Ii(A) || jt(A)), h = () => e.map((A) => {
    if (Ve(A))
      return A.value;
    if (Ii(A))
      return c(A);
    if (co(A))
      return u ? u(A, 2) : A();
    f(A);
  })) : co(e) ? t ? h = u ? () => u(e, 2) : e : h = () => {
    if (d) {
      $p();
      try {
        d();
      } finally {
        Mp();
      }
    }
    const A = nr;
    nr = l;
    try {
      return u ? u(e, 3, [_]) : e(_);
    } finally {
      nr = A;
    }
  } : (h = T3, f(e)), t && i) {
    const A = h, S = i === !0 ? 1 / 0 : i;
    h = () => zn(A(), S);
  }
  const y = AA(), b = () => {
    l.stop(), y && y.active && R3(y.effects, l);
  };
  if (s && t) {
    const A = t;
    t = (...S) => {
      A(...S), b();
    };
  }
  let w = g ? new Array(e.length).fill(Sa) : Sa;
  const m = (A) => {
    if (!(!(l.flags & 1) || !l.dirty && !A))
      if (t) {
        const S = l.run();
        if (i || v || (g ? S.some((R, B) => ar(R, w[B])) : ar(S, w))) {
          d && d();
          const R = nr;
          nr = l;
          try {
            const B = [
              S,
              // pass undefined as the old value when it's changed for the first time
              w === Sa ? void 0 : g && w[0] === Sa ? [] : w,
              _
            ];
            w = S, u ? u(t, 3, B) : (
              // @ts-expect-error
              t(...B)
            );
          } finally {
            nr = R;
          }
        }
      } else
        l.run();
  };
  return a && a(m), l = new lo(h), l.scheduler = o ? () => o(m, !1) : m, _ = (A) => zA(A, !1, l), d = l.onStop = () => {
    const A = lu.get(l);
    if (A) {
      if (u)
        u(A, 4);
      else
        for (const S of A) S();
      lu.delete(l);
    }
  }, l.onTrack = n.onTrack, l.onTrigger = n.onTrigger, t ? r ? m(!0) : w = l.run() : o ? o(m.bind(null, !0), !0) : l.run(), b.pause = l.pause.bind(l), b.resume = l.resume.bind(l), b.stop = b, b;
}
function zn(e, t = 1 / 0, n) {
  if (t <= 0 || !Hr(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, Ve(e))
    zn(e.value, t, n);
  else if (Vn(e))
    for (let r = 0; r < e.length; r++)
      zn(e[r], t, n);
  else if (N3(e) || Mi(e))
    e.forEach((r) => {
      zn(r, t, n);
    });
  else if (I3(e)) {
    for (const r in e)
      zn(e[r], t, n);
    for (const r of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, r) && zn(e[r], t, n);
  }
  return e;
}
const D4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ARRAY_ITERATE_KEY: Ki,
  EffectFlags: B3,
  EffectScope: wA,
  ITERATE_KEY: ur,
  MAP_KEY_ITERATE_KEY: uu,
  ReactiveEffect: lo,
  ReactiveFlags: Rj,
  TrackOpTypes: xj,
  TriggerOpTypes: Tj,
  WatchErrorCodes: Pj,
  computed: Sj,
  customRef: bj,
  effect: U3,
  effectScope: j3,
  enableTracking: V3,
  getCurrentScope: AA,
  getCurrentWatcher: Nj,
  isProxy: Dp,
  isReactive: Ii,
  isReadonly: gr,
  isRef: Ve,
  isShallow: jt,
  markRaw: lj,
  onEffectCleanup: W3,
  onScopeDispose: F3,
  onWatcherCleanup: zA,
  pauseTracking: $p,
  proxyRefs: gj,
  reactive: Ip,
  reactiveReadArray: Cr,
  readonly: fu,
  ref: jA,
  resetTracking: Mp,
  shallowReactive: fj,
  shallowReadArray: xf,
  shallowReadonly: cj,
  shallowRef: hj,
  stop: k3,
  toRaw: V,
  toReactive: Ie,
  toReadonly: cu,
  toRef: Oj,
  toRefs: mj,
  toValue: _j,
  track: ze,
  traverse: zn,
  trigger: Bn,
  triggerRef: dj,
  unref: Cp,
  watch: $j
}, Symbol.toStringTag, { value: "Module" })), Mj = Symbol.for("preact-signals"), pn = 1, Yi = 2, po = 4, vs = 8, Ba = 16, Xi = 32;
function Pf() {
  ks++;
}
function Nf() {
  if (ks > 1) {
    ks--;
    return;
  }
  let e, t = !1;
  for (; Us !== void 0; ) {
    let n = Us;
    for (Us = void 0, ll++; n !== void 0; ) {
      const r = n._nextBatchedEffect;
      if (n._nextBatchedEffect = void 0, n._flags &= ~Yi, !(n._flags & vs) && kA(n))
        try {
          n._callback();
        } catch (i) {
          t || (e = i, t = !0);
        }
      n = r;
    }
  }
  if (ll = 0, ks--, t)
    throw e;
}
function Ij(e) {
  if (ks > 0)
    return e();
  Pf();
  try {
    return e();
  } finally {
    Nf();
  }
}
let G;
function Lp(e) {
  const t = G;
  G = void 0;
  try {
    return e();
  } finally {
    G = t;
  }
}
let Us, ks = 0, ll = 0, hu = 0;
function UA(e) {
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
    }, G._sources !== void 0 && (G._sources._nextSource = t), G._sources = t, e._node = t, G._flags & Xi && e._subscribe(t), t;
  if (t._version === -1)
    return t._version = 0, t._nextSource !== void 0 && (t._nextSource._prevSource = t._prevSource, t._prevSource !== void 0 && (t._prevSource._nextSource = t._nextSource), t._prevSource = G._sources, t._nextSource = void 0, G._sources._nextSource = t, G._sources = t), t;
}
function Be(e, t) {
  this._value = e, this._version = 0, this._node = void 0, this._targets = void 0, this._watched = t?.watched, this._unwatched = t?.unwatched, this.name = t?.name;
}
Be.prototype.brand = Mj;
Be.prototype._refresh = function() {
  return !0;
};
Be.prototype._subscribe = function(e) {
  const t = this._targets;
  t !== e && e._prevTarget === void 0 && (e._nextTarget = t, this._targets = e, t !== void 0 ? t._prevTarget = e : Lp(() => {
    this._watched?.call(this);
  }));
};
Be.prototype._unsubscribe = function(e) {
  if (this._targets !== void 0) {
    const t = e._prevTarget, n = e._nextTarget;
    t !== void 0 && (t._nextTarget = n, e._prevTarget = void 0), n !== void 0 && (n._prevTarget = t, e._nextTarget = void 0), e === this._targets && (this._targets = n, n === void 0 && Lp(() => {
      this._unwatched?.call(this);
    }));
  }
};
Be.prototype.subscribe = function(e) {
  return GA(
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
Be.prototype.valueOf = function() {
  return this.value;
};
Be.prototype.toString = function() {
  return this.value + "";
};
Be.prototype.toJSON = function() {
  return this.value;
};
Be.prototype.peek = function() {
  const e = G;
  G = void 0;
  try {
    return this.value;
  } finally {
    G = e;
  }
};
Object.defineProperty(Be.prototype, "value", {
  get() {
    const e = UA(this);
    return e !== void 0 && (e._version = this._version), this._value;
  },
  set(e) {
    if (e !== this._value) {
      if (ll > 100)
        throw new Error("Cycle detected");
      this._value = e, this._version++, hu++, Pf();
      try {
        for (let t = this._targets; t !== void 0; t = t._nextTarget)
          t._target._notify();
      } finally {
        Nf();
      }
    }
  }
});
function Dj(e, t) {
  return new Be(e, t);
}
function kA(e) {
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
function VA(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource) {
    const n = t._source._node;
    if (n !== void 0 && (t._rollbackNode = n), t._source._node = t, t._version = -1, t._nextSource === void 0) {
      e._sources = t;
      break;
    }
  }
}
function WA(e) {
  let t = e._sources, n;
  for (; t !== void 0; ) {
    const r = t._prevSource;
    t._version === -1 ? (t._source._unsubscribe(t), r !== void 0 && (r._nextSource = t._nextSource), t._nextSource !== void 0 && (t._nextSource._prevSource = r)) : n = t, t._source._node = t._rollbackNode, t._rollbackNode !== void 0 && (t._rollbackNode = void 0), t = r;
  }
  e._sources = n;
}
function Rr(e, t) {
  Be.call(this, void 0), this._fn = e, this._sources = void 0, this._globalVersion = hu - 1, this._flags = po, this._watched = t?.watched, this._unwatched = t?.unwatched, this.name = t?.name;
}
Rr.prototype = new Be();
Rr.prototype._refresh = function() {
  if (this._flags &= ~Yi, this._flags & pn)
    return !1;
  if ((this._flags & (po | Xi)) === Xi || (this._flags &= ~po, this._globalVersion === hu))
    return !0;
  if (this._globalVersion = hu, this._flags |= pn, this._version > 0 && !kA(this))
    return this._flags &= ~pn, !0;
  const e = G;
  try {
    VA(this), G = this;
    const t = this._fn();
    (this._flags & Ba || this._value !== t || this._version === 0) && (this._value = t, this._flags &= ~Ba, this._version++);
  } catch (t) {
    this._value = t, this._flags |= Ba, this._version++;
  }
  return G = e, WA(this), this._flags &= ~pn, !0;
};
Rr.prototype._subscribe = function(e) {
  if (this._targets === void 0) {
    this._flags |= po | Xi;
    for (let t = this._sources; t !== void 0; t = t._nextSource)
      t._source._subscribe(t);
  }
  Be.prototype._subscribe.call(this, e);
};
Rr.prototype._unsubscribe = function(e) {
  if (this._targets !== void 0 && (Be.prototype._unsubscribe.call(this, e), this._targets === void 0)) {
    this._flags &= ~Xi;
    for (let t = this._sources; t !== void 0; t = t._nextSource)
      t._source._unsubscribe(t);
  }
};
Rr.prototype._notify = function() {
  if (!(this._flags & Yi)) {
    this._flags |= po | Yi;
    for (let e = this._targets; e !== void 0; e = e._nextTarget)
      e._target._notify();
  }
};
Object.defineProperty(Rr.prototype, "value", {
  get() {
    if (this._flags & pn)
      throw new Error("Cycle detected");
    const e = UA(this);
    if (this._refresh(), e !== void 0 && (e._version = this._version), this._flags & Ba)
      throw this._value;
    return this._value;
  }
});
function Cj(e, t) {
  return new Rr(e, t);
}
function qA(e) {
  const t = e._cleanup;
  if (e._cleanup = void 0, typeof t == "function") {
    Pf();
    const n = G;
    G = void 0;
    try {
      t();
    } catch (r) {
      throw e._flags &= ~pn, e._flags |= vs, jp(e), r;
    } finally {
      G = n, Nf();
    }
  }
}
function jp(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource)
    t._source._unsubscribe(t);
  e._fn = void 0, e._sources = void 0, qA(e);
}
function Lj(e) {
  if (G !== this)
    throw new Error("Out-of-order effect");
  WA(this), G = e, this._flags &= ~pn, this._flags & vs && jp(this), Nf();
}
function pi(e, t) {
  this._fn = e, this._cleanup = void 0, this._sources = void 0, this._nextBatchedEffect = void 0, this._flags = Xi, this.name = t?.name;
}
pi.prototype._callback = function() {
  const e = this._start();
  try {
    if (this._flags & vs || this._fn === void 0) return;
    const t = this._fn();
    typeof t == "function" && (this._cleanup = t);
  } finally {
    e();
  }
};
pi.prototype._start = function() {
  if (this._flags & pn)
    throw new Error("Cycle detected");
  this._flags |= pn, this._flags &= ~vs, qA(this), VA(this), Pf();
  const e = G;
  return G = this, Lj.bind(this, e);
};
pi.prototype._notify = function() {
  this._flags & Yi || (this._flags |= Yi, this._nextBatchedEffect = Us, Us = this);
};
pi.prototype._dispose = function() {
  this._flags |= vs, this._flags & pn || jp(this);
};
pi.prototype.dispose = function() {
  this._dispose();
};
function GA(e, t) {
  const n = new pi(e, t);
  try {
    n._callback();
  } catch (i) {
    throw n._dispose(), i;
  }
  const r = n._dispose.bind(n);
  return r[Symbol.dispose] = r, r;
}
const C4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Computed: Rr,
  Effect: pi,
  Signal: Be,
  batch: Ij,
  computed: Cj,
  effect: GA,
  signal: Dj,
  untracked: Lp
}, Symbol.toStringTag, { value: "Module" })), iv = typeof Symbol == "function" && Symbol.observable || "@@observable", gc = () => Math.random().toString(36).substring(7).split("").join("."), fr = {
  INIT: `@@redux/INIT${/* @__PURE__ */ gc()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ gc()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${gc()}`
};
function $f(e) {
  if (typeof e != "object" || e === null) return !1;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function jj(e) {
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
  if (zj(e)) return "date";
  if (Bj(e)) return "error";
  const n = Fj(e);
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
function Fj(e) {
  return typeof e.constructor == "function" ? e.constructor.name : null;
}
function Bj(e) {
  return e instanceof Error || typeof e.message == "string" && e.constructor && typeof e.constructor.stackTraceLimit == "number";
}
function zj(e) {
  return e instanceof Date ? !0 : typeof e.toDateString == "function" && typeof e.getDate == "function" && typeof e.setDate == "function";
}
function jn(e) {
  let t = typeof e;
  return process.env.NODE_ENV !== "production" && (t = jj(e)), t;
}
function Fp(e, t, n) {
  if (typeof e != "function")
    throw new Error(
      `Expected the root reducer to be a function. Instead, received: '${jn(
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
        `Expected the enhancer to be a function. Instead, received: '${jn(
          n
        )}'`
      );
    return n(Fp)(
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
        `Expected the listener to be a function. Instead, received: '${jn(
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
    if (!$f(g))
      throw new Error(
        `Actions must be plain objects. Instead, the actual type was: '${jn(
          g
        )}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`
      );
    if (typeof g.type > "u")
      throw new Error(
        'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.'
      );
    if (typeof g.type != "string")
      throw new Error(
        `Action "type" property must be a string. Instead, the actual type was: '${jn(
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
        `Expected the nextReducer to be a function. Instead, received: '${jn(
          g
        )}`
      );
    r = g, h({ type: fr.REPLACE });
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
            `Expected the observer to be an object. Instead, received: '${jn(
              y
            )}'`
          );
        function b() {
          const m = y;
          m.next && m.next(c());
        }
        return b(), { unsubscribe: g(b) };
      },
      [iv]() {
        return this;
      }
    };
  }
  return h({ type: fr.INIT }), {
    dispatch: h,
    subscribe: l,
    getState: c,
    replaceReducer: d,
    [iv]: _
  };
}
function Uj(e, t, n) {
  return Fp(e, t, n);
}
function sv(e) {
  typeof console < "u" && typeof console.error == "function" && console.error(e);
  try {
    throw new Error(e);
  } catch {
  }
}
function kj(e, t, n, r) {
  const i = Object.keys(t), s = n && n.type === fr.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
  if (i.length === 0)
    return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
  if (!$f(e))
    return `The ${s} has unexpected type of "${jn(
      e
    )}". Expected argument to be an object with the following keys: "${i.join('", "')}"`;
  const o = Object.keys(e).filter(
    (a) => !t.hasOwnProperty(a) && !r[a]
  );
  if (o.forEach((a) => {
    r[a] = !0;
  }), !(n && n.type === fr.REPLACE) && o.length > 0)
    return `Unexpected ${o.length > 1 ? "keys" : "key"} "${o.join('", "')}" found in ${s}. Expected to find one of the known reducer keys instead: "${i.join('", "')}". Unexpected keys will be ignored.`;
}
function Vj(e) {
  Object.keys(e).forEach((t) => {
    const n = e[t];
    if (typeof n(void 0, { type: fr.INIT }) > "u")
      throw new Error(
        `The slice reducer for key "${t}" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`
      );
    if (typeof n(void 0, {
      type: fr.PROBE_UNKNOWN_ACTION()
    }) > "u")
      throw new Error(
        `The slice reducer for key "${t}" returned undefined when probed with a random type. Don't try to handle '${fr.INIT}' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.`
      );
  });
}
function Wj(e) {
  const t = Object.keys(e), n = {};
  for (let o = 0; o < t.length; o++) {
    const a = t[o];
    process.env.NODE_ENV !== "production" && typeof e[a] > "u" && sv(`No reducer provided for key "${a}"`), typeof e[a] == "function" && (n[a] = e[a]);
  }
  const r = Object.keys(n);
  let i;
  process.env.NODE_ENV !== "production" && (i = {});
  let s;
  try {
    Vj(n);
  } catch (o) {
    s = o;
  }
  return function(a = {}, u) {
    if (s)
      throw s;
    if (process.env.NODE_ENV !== "production") {
      const l = kj(
        a,
        n,
        u,
        i
      );
      l && sv(l);
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
function ov(e, t) {
  return function(...n) {
    return t(e.apply(this, n));
  };
}
function qj(e, t) {
  if (typeof e == "function")
    return ov(e, t);
  if (typeof e != "object" || e === null)
    throw new Error(
      `bindActionCreators expected an object or a function, but instead received: '${jn(
        e
      )}'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    );
  const n = {};
  for (const r in e) {
    const i = e[r];
    typeof i == "function" && (n[r] = ov(i, t));
  }
  return n;
}
function HA(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce(
    (t, n) => (...r) => t(n(...r))
  );
}
function Gj(...e) {
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
    return s = HA(...a)(i.dispatch), {
      ...i,
      dispatch: s
    };
  };
}
function Hj(e) {
  return $f(e) && "type" in e && typeof e.type == "string";
}
const L4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  __DO_NOT_USE__ActionTypes: fr,
  applyMiddleware: Gj,
  bindActionCreators: qj,
  combineReducers: Wj,
  compose: HA,
  createStore: Fp,
  isAction: Hj,
  isPlainObject: $f,
  legacy_createStore: Uj
}, Symbol.toStringTag, { value: "Module" }));
var Kj = {
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
}, Yj = process.env.NODE_ENV !== "production" ? Kj : {};
function E(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
    n[r - 1] = arguments[r];
  if (process.env.NODE_ENV !== "production") {
    var i = typeof e == "string" ? e : Yj[e];
    throw typeof i == "function" && (i = i.apply(null, n)), new Error("[MobX] " + i);
  }
  throw new Error(typeof e == "number" ? "[MobX] minified error nr: " + e + (n.length ? " " + n.map(String).join(",") : "") + ". Find the full error at: https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/errors.ts" : "[MobX] " + e);
}
var Xj = {};
function Mf() {
  return typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : Xj;
}
var KA = Object.assign, pu = Object.getOwnPropertyDescriptor, gn = Object.defineProperty, na = Object.prototype, du = [];
Object.freeze(du);
var Bp = {};
Object.freeze(Bp);
var Jj = typeof Proxy < "u", Zj = /* @__PURE__ */ Object.toString();
function YA() {
  Jj || E(process.env.NODE_ENV !== "production" ? "`Proxy` objects are not available in the current environment. Please configure MobX to enable a fallback implementation.`" : "Proxy not available");
}
function Ts(e) {
  process.env.NODE_ENV !== "production" && O.verifyProxies && E("MobX is currently configured to be able to run in ES5 mode, but in ES5 MobX won't be able to " + e);
}
function Rt() {
  return ++O.mobxGuid;
}
function zp(e) {
  var t = !1;
  return function() {
    if (!t)
      return t = !0, e.apply(this, arguments);
  };
}
var Ei = function() {
};
function ae(e) {
  return typeof e == "function";
}
function mn(e) {
  var t = typeof e;
  switch (t) {
    case "string":
    case "symbol":
    case "number":
      return !0;
  }
  return !1;
}
function If(e) {
  return e !== null && typeof e == "object";
}
function it(e) {
  if (!If(e))
    return !1;
  var t = Object.getPrototypeOf(e);
  if (t == null)
    return !0;
  var n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return typeof n == "function" && n.toString() === Zj;
}
function XA(e) {
  var t = e?.constructor;
  return t ? t.name === "GeneratorFunction" || t.displayName === "GeneratorFunction" : !1;
}
function ra(e, t, n) {
  gn(e, t, {
    enumerable: !1,
    writable: !0,
    configurable: !0,
    value: n
  });
}
function JA(e, t, n) {
  gn(e, t, {
    enumerable: !1,
    writable: !1,
    configurable: !0,
    value: n
  });
}
function Pr(e, t) {
  var n = "isMobX" + e;
  return t.prototype[n] = !0, function(r) {
    return If(r) && r[n] === !0;
  };
}
function gs(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Map]";
}
function Qj(e) {
  var t = Object.getPrototypeOf(e), n = Object.getPrototypeOf(t), r = Object.getPrototypeOf(n);
  return r === null;
}
function Un(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Set]";
}
var ZA = typeof Object.getOwnPropertySymbols < "u";
function eF(e) {
  var t = Object.keys(e);
  if (!ZA)
    return t;
  var n = Object.getOwnPropertySymbols(e);
  return n.length ? [].concat(t, n.filter(function(r) {
    return na.propertyIsEnumerable.call(e, r);
  })) : t;
}
var Ji = typeof Reflect < "u" && Reflect.ownKeys ? Reflect.ownKeys : ZA ? function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : (
  /* istanbul ignore next */
  Object.getOwnPropertyNames
);
function hl(e) {
  return typeof e == "string" ? e : typeof e == "symbol" ? e.toString() : new String(e).toString();
}
function QA(e) {
  return e === null ? null : typeof e == "object" ? "" + e : e;
}
function yt(e, t) {
  return na.hasOwnProperty.call(e, t);
}
var tF = Object.getOwnPropertyDescriptors || function(t) {
  var n = {};
  return Ji(t).forEach(function(r) {
    n[r] = pu(t, r);
  }), n;
};
function ht(e, t) {
  return !!(e & t);
}
function pt(e, t, n) {
  return n ? e |= t : e &= ~t, e;
}
function av(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function nF(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, iF(r.key), r);
  }
}
function ys(e, t, n) {
  return t && nF(e.prototype, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function Si(e, t) {
  var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n) return (n = n.call(e)).next.bind(n);
  if (Array.isArray(e) || (n = sF(e)) || t) {
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
function wn() {
  return wn = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, wn.apply(null, arguments);
}
function eO(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, pl(e, t);
}
function pl(e, t) {
  return pl = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, r) {
    return n.__proto__ = r, n;
  }, pl(e, t);
}
function rF(e, t) {
  if (typeof e != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function iF(e) {
  var t = rF(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function sF(e, t) {
  if (e) {
    if (typeof e == "string") return av(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? av(e, t) : void 0;
  }
}
var et = /* @__PURE__ */ Symbol("mobx-stored-annotations");
function Qt(e) {
  function t(n, r) {
    if (sa(r))
      return e.decorate_20223_(n, r);
    ia(n, r, e);
  }
  return Object.assign(t, e);
}
function ia(e, t, n) {
  if (yt(e, et) || ra(e, et, wn({}, e[et])), process.env.NODE_ENV !== "production" && _u(n) && !yt(e[et], t)) {
    var r = e.constructor.name + ".prototype." + t.toString();
    E("'" + r + "' is decorated with 'override', but no such decorated member was found on prototype.");
  }
  oF(e, n, t), _u(n) || (e[et][t] = n);
}
function oF(e, t, n) {
  if (process.env.NODE_ENV !== "production" && !_u(t) && yt(e[et], n)) {
    var r = e.constructor.name + ".prototype." + n.toString(), i = e[et][n].annotationType_, s = t.annotationType_;
    E("Cannot apply '@" + s + "' to '" + r + "':" + (`
The field is already decorated with '@` + i + "'.") + `
Re-decorating fields is not allowed.
Use '@override' decorator for methods overridden by subclass.`);
  }
}
function aF(e) {
  return yt(e, et) || ra(e, et, wn({}, e[et])), e[et];
}
function sa(e) {
  return typeof e == "object" && typeof e.kind == "string";
}
function Df(e, t) {
  process.env.NODE_ENV !== "production" && !t.includes(e.kind) && E("The decorator applied to '" + String(e.name) + "' cannot be used on a " + e.kind + " element");
}
var T = /* @__PURE__ */ Symbol("mobx administration"), Nr = /* @__PURE__ */ function() {
  function e(n) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "Atom@" + Rt() : "Atom"), this.name_ = void 0, this.flags_ = 0, this.observers_ = /* @__PURE__ */ new Set(), this.lastAccessedBy_ = 0, this.lowestObserverState_ = U.NOT_TRACKING_, this.onBOL = void 0, this.onBUOL = void 0, this.name_ = n;
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
    return yO(this);
  }, t.reportChanged = function() {
    tt(), bO(this), nt();
  }, t.toString = function() {
    return this.name_;
  }, ys(e, [{
    key: "isBeingObserved",
    get: function() {
      return ht(this.flags_, e.isBeingObservedMask_);
    },
    set: function(r) {
      this.flags_ = pt(this.flags_, e.isBeingObservedMask_, r);
    }
  }, {
    key: "isPendingUnobservation",
    get: function() {
      return ht(this.flags_, e.isPendingUnobservationMask_);
    },
    set: function(r) {
      this.flags_ = pt(this.flags_, e.isPendingUnobservationMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return ht(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = pt(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
Nr.isBeingObservedMask_ = 1;
Nr.isPendingUnobservationMask_ = 2;
Nr.diffValueMask_ = 4;
var Up = /* @__PURE__ */ Pr("Atom", Nr);
function kp(e, t, n) {
  t === void 0 && (t = Ei), n === void 0 && (n = Ei);
  var r = new Nr(e);
  return t !== Ei && RO(r, t), n !== Ei && Yp(r, n), r;
}
function uF(e, t) {
  return e === t;
}
function fF(e, t) {
  return td(e, t);
}
function cF(e, t) {
  return td(e, t, 1);
}
function lF(e, t) {
  return Object.is ? Object.is(e, t) : e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
var Kr = {
  identity: uF,
  structural: fF,
  default: lF,
  shallow: cF
};
function Yr(e, t, n) {
  return ei(e) ? e : Array.isArray(e) ? we.array(e, {
    name: n
  }) : it(e) ? we.object(e, void 0, {
    name: n
  }) : gs(e) ? we.map(e, {
    name: n
  }) : Un(e) ? we.set(e, {
    name: n
  }) : typeof e == "function" && !Zr(e) && !Qi(e) ? XA(e) ? Qr(e) : Zi(n, e) : e;
}
function hF(e, t, n) {
  if (e == null || _e(e) || Ze(e) || ye(e) || de(e))
    return e;
  if (Array.isArray(e))
    return we.array(e, {
      name: n,
      deep: !1
    });
  if (it(e))
    return we.object(e, void 0, {
      name: n,
      deep: !1
    });
  if (gs(e))
    return we.map(e, {
      name: n,
      deep: !1
    });
  if (Un(e))
    return we.set(e, {
      name: n,
      deep: !1
    });
  process.env.NODE_ENV !== "production" && E("The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
}
function Cf(e) {
  return e;
}
function pF(e, t) {
  return process.env.NODE_ENV !== "production" && ei(e) && E("observable.struct should not be used with observable values"), td(e, t) ? t : e;
}
var tO = "override", dF = /* @__PURE__ */ Qt({
  annotationType_: tO,
  make_: _F,
  extend_: vF,
  decorate_20223_: gF
});
function _u(e) {
  return e.annotationType_ === tO;
}
function _F(e, t) {
  return process.env.NODE_ENV !== "production" && e.isPlainObject_ && E("Cannot apply '" + this.annotationType_ + "' to '" + e.name_ + "." + t.toString() + "':" + (`
'` + this.annotationType_ + "' cannot be used on plain objects.")), process.env.NODE_ENV !== "production" && !yt(e.appliedAnnotations_, t) && E("'" + e.name_ + "." + t.toString() + "' is annotated with '" + this.annotationType_ + "', but no such annotated member was found on prototype."), 0;
}
function vF(e, t, n, r) {
  E("'" + this.annotationType_ + "' can only be used with 'makeObservable'");
}
function gF(e, t) {
  console.warn("'" + this.annotationType_ + "' cannot be used with decorators - this is a no-op");
}
function oa(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: yF,
    extend_: bF,
    decorate_20223_: mF
  };
}
function yF(e, t, n, r) {
  var i;
  if ((i = this.options_) != null && i.bound)
    return this.extend_(e, t, n, !1) === null ? 0 : 1;
  if (r === e.target_)
    return this.extend_(e, t, n, !1) === null ? 0 : 2;
  if (Zr(n.value))
    return 1;
  var s = nO(e, this, t, n, !1);
  return gn(r, t, s), 2;
}
function bF(e, t, n, r) {
  var i = nO(e, this, t, n);
  return e.defineProperty_(t, i, r);
}
function mF(e, t) {
  process.env.NODE_ENV !== "production" && Df(t, ["method", "field"]);
  var n = t.kind, r = t.name, i = t.addInitializer, s = this, o = function(f) {
    var c, l, h, d;
    return yr((c = (l = s.options_) == null ? void 0 : l.name) != null ? c : r.toString(), f, (h = (d = s.options_) == null ? void 0 : d.autoAction) != null ? h : !1);
  };
  if (n == "field")
    return function(u) {
      var f, c = u;
      return Zr(c) || (c = o(c)), (f = s.options_) != null && f.bound && (c = c.bind(this), c.isMobxAction = !0), c;
    };
  if (n == "method") {
    var a;
    return Zr(e) || (e = o(e)), (a = this.options_) != null && a.bound && i(function() {
      var u = this, f = u[r].bind(u);
      f.isMobxAction = !0, u[r] = f;
    }), e;
  }
  E("Cannot apply '" + s.annotationType_ + "' to '" + String(r) + "' (kind: " + n + "):" + (`
'` + s.annotationType_ + "' can only be used on properties with a function value."));
}
function wF(e, t, n, r) {
  var i = t.annotationType_, s = r.value;
  process.env.NODE_ENV !== "production" && !ae(s) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on properties with a function value."));
}
function nO(e, t, n, r, i) {
  var s, o, a, u, f, c, l;
  i === void 0 && (i = O.safeDescriptors), wF(e, t, n, r);
  var h = r.value;
  if ((s = t.options_) != null && s.bound) {
    var d;
    h = h.bind((d = e.proxy_) != null ? d : e.target_);
  }
  return {
    value: yr(
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
function rO(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: AF,
    extend_: OF,
    decorate_20223_: EF
  };
}
function AF(e, t, n, r) {
  var i;
  if (r === e.target_)
    return this.extend_(e, t, n, !1) === null ? 0 : 2;
  if ((i = this.options_) != null && i.bound && (!yt(e.target_, t) || !Qi(e.target_[t])) && this.extend_(e, t, n, !1) === null)
    return 0;
  if (Qi(n.value))
    return 1;
  var s = iO(e, this, t, n, !1, !1);
  return gn(r, t, s), 2;
}
function OF(e, t, n, r) {
  var i, s = iO(e, this, t, n, (i = this.options_) == null ? void 0 : i.bound);
  return e.defineProperty_(t, s, r);
}
function EF(e, t) {
  var n;
  process.env.NODE_ENV !== "production" && Df(t, ["method"]);
  var r = t.name, i = t.addInitializer;
  return Qi(e) || (e = Qr(e)), (n = this.options_) != null && n.bound && i(function() {
    var s = this, o = s[r].bind(s);
    o.isMobXFlow = !0, s[r] = o;
  }), e;
}
function SF(e, t, n, r) {
  var i = t.annotationType_, s = r.value;
  process.env.NODE_ENV !== "production" && !ae(s) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on properties with a generator function value."));
}
function iO(e, t, n, r, i, s) {
  s === void 0 && (s = O.safeDescriptors), SF(e, t, n, r);
  var o = r.value;
  if (Qi(o) || (o = Qr(o)), i) {
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
function Vp(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: xF,
    extend_: TF,
    decorate_20223_: RF
  };
}
function xF(e, t, n) {
  return this.extend_(e, t, n, !1) === null ? 0 : 1;
}
function TF(e, t, n, r) {
  return PF(e, this, t, n), e.defineComputedProperty_(t, wn({}, this.options_, {
    get: n.get,
    set: n.set
  }), r);
}
function RF(e, t) {
  process.env.NODE_ENV !== "production" && Df(t, ["getter"]);
  var n = this, r = t.name, i = t.addInitializer;
  return i(function() {
    var s = _i(this)[T], o = wn({}, n.options_, {
      get: e,
      context: this
    });
    o.name || (o.name = process.env.NODE_ENV !== "production" ? s.name_ + "." + r.toString() : "ObservableObject." + r.toString()), s.values_.set(r, new kt(o));
  }), function() {
    return this[T].getObservablePropValue_(r);
  };
}
function PF(e, t, n, r) {
  var i = t.annotationType_, s = r.get;
  process.env.NODE_ENV !== "production" && !s && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on getter(+setter) properties."));
}
function Lf(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: NF,
    extend_: $F,
    decorate_20223_: MF
  };
}
function NF(e, t, n) {
  return this.extend_(e, t, n, !1) === null ? 0 : 1;
}
function $F(e, t, n, r) {
  var i, s;
  return IF(e, this, t, n), e.defineObservableProperty_(t, n.value, (i = (s = this.options_) == null ? void 0 : s.enhancer) != null ? i : Yr, r);
}
function MF(e, t) {
  if (process.env.NODE_ENV !== "production") {
    if (t.kind === "field")
      throw E("Please use `@observable accessor " + String(t.name) + "` instead of `@observable " + String(t.name) + "`");
    Df(t, ["accessor"]);
  }
  var n = this, r = t.kind, i = t.name, s = /* @__PURE__ */ new WeakSet();
  function o(a, u) {
    var f, c, l = _i(a)[T], h = new cr(u, (f = (c = n.options_) == null ? void 0 : c.enhancer) != null ? f : Yr, process.env.NODE_ENV !== "production" ? l.name_ + "." + i.toString() : "ObservableObject." + i.toString(), !1);
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
function IF(e, t, n, r) {
  var i = t.annotationType_;
  process.env.NODE_ENV !== "production" && !("value" in r) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' cannot be used on getter/setter properties"));
}
var DF = "true", CF = /* @__PURE__ */ sO();
function sO(e) {
  return {
    annotationType_: DF,
    options_: e,
    make_: LF,
    extend_: jF,
    decorate_20223_: FF
  };
}
function LF(e, t, n, r) {
  var i, s;
  if (n.get)
    return aa.make_(e, t, n, r);
  if (n.set) {
    var o = yr(t.toString(), n.set);
    return r === e.target_ ? e.defineProperty_(t, {
      configurable: O.safeDescriptors ? e.isPlainObject_ : !0,
      set: o
    }) === null ? 0 : 2 : (gn(r, t, {
      configurable: !0,
      set: o
    }), 2);
  }
  if (r !== e.target_ && typeof n.value == "function") {
    var a;
    if (XA(n.value)) {
      var u, f = (u = this.options_) != null && u.autoBind ? Qr.bound : Qr;
      return f.make_(e, t, n, r);
    }
    var c = (a = this.options_) != null && a.autoBind ? Zi.bound : Zi;
    return c.make_(e, t, n, r);
  }
  var l = ((i = this.options_) == null ? void 0 : i.deep) === !1 ? we.ref : we;
  if (typeof n.value == "function" && (s = this.options_) != null && s.autoBind) {
    var h;
    n.value = n.value.bind((h = e.proxy_) != null ? h : e.target_);
  }
  return l.make_(e, t, n, r);
}
function jF(e, t, n, r) {
  var i, s;
  if (n.get)
    return aa.extend_(e, t, n, r);
  if (n.set)
    return e.defineProperty_(t, {
      configurable: O.safeDescriptors ? e.isPlainObject_ : !0,
      set: yr(t.toString(), n.set)
    }, r);
  if (typeof n.value == "function" && (i = this.options_) != null && i.autoBind) {
    var o;
    n.value = n.value.bind((o = e.proxy_) != null ? o : e.target_);
  }
  var a = ((s = this.options_) == null ? void 0 : s.deep) === !1 ? we.ref : we;
  return a.extend_(e, t, n, r);
}
function FF(e, t) {
  E("'" + this.annotationType_ + "' cannot be used as a decorator");
}
var BF = "observable", zF = "observable.ref", UF = "observable.shallow", kF = "observable.struct", oO = {
  deep: !0,
  name: void 0,
  defaultDecorator: void 0,
  proxy: !0
};
Object.freeze(oO);
function xa(e) {
  return e || oO;
}
var dl = /* @__PURE__ */ Lf(BF), VF = /* @__PURE__ */ Lf(zF, {
  enhancer: Cf
}), WF = /* @__PURE__ */ Lf(UF, {
  enhancer: hF
}), qF = /* @__PURE__ */ Lf(kF, {
  enhancer: pF
}), aO = /* @__PURE__ */ Qt(dl);
function Ta(e) {
  return e.deep === !0 ? Yr : e.deep === !1 ? Cf : HF(e.defaultDecorator);
}
function GF(e) {
  var t;
  return e ? (t = e.defaultDecorator) != null ? t : sO(e) : void 0;
}
function HF(e) {
  var t, n;
  return e && (t = (n = e.options_) == null ? void 0 : n.enhancer) != null ? t : Yr;
}
function uO(e, t, n) {
  if (sa(t))
    return dl.decorate_20223_(e, t);
  if (mn(t)) {
    ia(e, t, dl);
    return;
  }
  return ei(e) ? e : it(e) ? we.object(e, t, n) : Array.isArray(e) ? we.array(e, t) : gs(e) ? we.map(e, t) : Un(e) ? we.set(e, t) : typeof e == "object" && e !== null ? e : we.box(e, t);
}
KA(uO, aO);
var KF = {
  box: function(t, n) {
    var r = xa(n);
    return new cr(t, Ta(r), r.name, !0, r.equals);
  },
  array: function(t, n) {
    var r = xa(n);
    return (O.useProxies === !1 || r.proxy === !1 ? vz : oz)(t, Ta(r), r.name);
  },
  map: function(t, n) {
    var r = xa(n);
    return new Zp(t, Ta(r), r.name);
  },
  set: function(t, n) {
    var r = xa(n);
    return new Qp(t, Ta(r), r.name);
  },
  object: function(t, n, r) {
    return $r(function() {
      return Xp(O.useProxies === !1 || r?.proxy === !1 ? _i({}, r) : tz({}, r), t, n);
    });
  },
  ref: /* @__PURE__ */ Qt(VF),
  shallow: /* @__PURE__ */ Qt(WF),
  deep: aO,
  struct: /* @__PURE__ */ Qt(qF)
}, we = /* @__PURE__ */ KA(uO, KF), fO = "computed", YF = "computed.struct", _l = /* @__PURE__ */ Vp(fO), XF = /* @__PURE__ */ Vp(YF, {
  equals: Kr.structural
}), aa = function(t, n) {
  if (sa(n))
    return _l.decorate_20223_(t, n);
  if (mn(n))
    return ia(t, n, _l);
  if (it(t))
    return Qt(Vp(fO, t));
  process.env.NODE_ENV !== "production" && (ae(t) || E("First argument to `computed` should be an expression."), ae(n) && E("A setter as second argument is no longer supported, use `{ set: fn }` option instead"));
  var r = it(n) ? n : {};
  return r.get = t, r.name || (r.name = t.name || ""), new kt(r);
};
Object.assign(aa, _l);
aa.struct = /* @__PURE__ */ Qt(XF);
var uv, fv, vu = 0, JF = 1, ZF = (uv = (fv = /* @__PURE__ */ pu(function() {
}, "name")) == null ? void 0 : fv.configurable) != null ? uv : !1, cv = {
  value: "action",
  configurable: !0,
  writable: !1,
  enumerable: !1
};
function yr(e, t, n, r) {
  n === void 0 && (n = !1), process.env.NODE_ENV !== "production" && (ae(t) || E("`action` can only be invoked on functions"), (typeof e != "string" || !e) && E("actions should have valid names, got: '" + e + "'"));
  function i() {
    return cO(e, n, t, r || this, arguments);
  }
  return i.isMobxAction = !0, i.toString = function() {
    return t.toString();
  }, ZF && (cv.value = e, gn(i, "name", cv)), i;
}
function cO(e, t, n, r, i) {
  var s = lO(e, t, r, i);
  try {
    return n.apply(r, i);
  } catch (o) {
    throw s.error_ = o, o;
  } finally {
    hO(s);
  }
}
function lO(e, t, n, r) {
  var i = process.env.NODE_ENV !== "production" && Re() && !!e, s = 0;
  if (process.env.NODE_ENV !== "production" && i) {
    s = Date.now();
    var o = r ? Array.from(r) : du;
    bt({
      type: Hp,
      name: e,
      object: n,
      arguments: o
    });
  }
  var a = O.trackingDerivation, u = !t || !a;
  tt();
  var f = O.allowStateChanges;
  u && (di(), f = jf(!0));
  var c = Bf(!0), l = {
    runAsAction_: u,
    prevDerivation_: a,
    prevAllowStateChanges_: f,
    prevAllowStateReads_: c,
    notifySpy_: i,
    startTime_: s,
    actionId_: JF++,
    parentActionId_: vu
  };
  return vu = l.actionId_, l;
}
function hO(e) {
  vu !== e.actionId_ && E(30), vu = e.parentActionId_, e.error_ !== void 0 && (O.suppressReactionErrors = !0), Ff(e.prevAllowStateChanges_), Di(e.prevAllowStateReads_), nt(), e.runAsAction_ && Wn(e.prevDerivation_), process.env.NODE_ENV !== "production" && e.notifySpy_ && mt({
    time: Date.now() - e.startTime_
  }), O.suppressReactionErrors = !1;
}
function Wp(e, t) {
  var n = jf(e);
  try {
    return t();
  } finally {
    Ff(n);
  }
}
function jf(e) {
  var t = O.allowStateChanges;
  return O.allowStateChanges = e, t;
}
function Ff(e) {
  O.allowStateChanges = e;
}
var QF = "create", cr = /* @__PURE__ */ function(e) {
  function t(r, i, s, o, a) {
    var u;
    return s === void 0 && (s = process.env.NODE_ENV !== "production" ? "ObservableValue@" + Rt() : "ObservableValue"), o === void 0 && (o = !0), a === void 0 && (a = Kr.default), u = e.call(this, s) || this, u.enhancer = void 0, u.name_ = void 0, u.equals = void 0, u.hasUnreportedChange_ = !1, u.interceptors_ = void 0, u.changeListeners_ = void 0, u.value_ = void 0, u.dehancer = void 0, u.enhancer = i, u.name_ = s, u.equals = a, u.value_ = i(r, void 0, s), process.env.NODE_ENV !== "production" && o && Re() && Jr({
      type: QF,
      object: u,
      observableKind: "value",
      debugObjectName: u.name_,
      newValue: "" + u.value_
    }), u;
  }
  eO(t, e);
  var n = t.prototype;
  return n.dehanceValue = function(i) {
    return this.dehancer !== void 0 ? this.dehancer(i) : i;
  }, n.set = function(i) {
    var s = this.value_;
    if (i = this.prepareNewValue_(i), i !== O.UNCHANGED) {
      var o = Re();
      process.env.NODE_ENV !== "production" && o && bt({
        type: Xt,
        object: this,
        observableKind: "value",
        debugObjectName: this.name_,
        newValue: i,
        oldValue: s
      }), this.setNewValue_(i), process.env.NODE_ENV !== "production" && o && mt();
    }
  }, n.prepareNewValue_ = function(i) {
    if (dn(this), Mt(this)) {
      var s = It(this, {
        object: this,
        type: Xt,
        newValue: i
      });
      if (!s)
        return O.UNCHANGED;
      i = s.newValue;
    }
    return i = this.enhancer(i, this.value_, this.name_), this.equals(this.value_, i) ? O.UNCHANGED : i;
  }, n.setNewValue_ = function(i) {
    var s = this.value_;
    this.value_ = i, this.reportChanged(), en(this) && tn(this, {
      type: Xt,
      object: this,
      newValue: i,
      oldValue: s
    });
  }, n.get = function() {
    return this.reportObserved(), this.dehanceValue(this.value_);
  }, n.intercept_ = function(i) {
    return ua(this, i);
  }, n.observe_ = function(i, s) {
    return s && i({
      observableKind: "value",
      debugObjectName: this.name_,
      object: this,
      type: Xt,
      newValue: this.value_,
      oldValue: void 0
    }), fa(this, i);
  }, n.raw = function() {
    return this.value_;
  }, n.toJSON = function() {
    return this.get();
  }, n.toString = function() {
    return this.name_ + "[" + this.value_ + "]";
  }, n.valueOf = function() {
    return QA(this.get());
  }, n[Symbol.toPrimitive] = function() {
    return this.valueOf();
  }, t;
}(Nr), qp = /* @__PURE__ */ Pr("ObservableValue", cr), kt = /* @__PURE__ */ function() {
  function e(n) {
    this.dependenciesState_ = U.NOT_TRACKING_, this.observing_ = [], this.newObserving_ = null, this.observers_ = /* @__PURE__ */ new Set(), this.runId_ = 0, this.lastAccessedBy_ = 0, this.lowestObserverState_ = U.UP_TO_DATE_, this.unboundDepsCount_ = 0, this.value_ = new gu(null), this.name_ = void 0, this.triggeredBy_ = void 0, this.flags_ = 0, this.derivation = void 0, this.setter_ = void 0, this.isTracing_ = Ft.NONE, this.scope_ = void 0, this.equals_ = void 0, this.requiresReaction_ = void 0, this.keepAlive_ = void 0, this.onBOL = void 0, this.onBUOL = void 0, n.get || E(31), this.derivation = n.get, this.name_ = n.name || (process.env.NODE_ENV !== "production" ? "ComputedValue@" + Rt() : "ComputedValue"), n.set && (this.setter_ = yr(process.env.NODE_ENV !== "production" ? this.name_ + "-setter" : "ComputedValue-setter", n.set)), this.equals_ = n.equals || (n.compareStructural || n.struct ? Kr.structural : Kr.default), this.scope_ = n.context, this.requiresReaction_ = n.requiresReaction, this.keepAlive_ = !!n.keepAlive;
  }
  var t = e.prototype;
  return t.onBecomeStale_ = function() {
    hB(this);
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
      vl(this) && (this.warnAboutUntrackedRead_(), tt(), this.value_ = this.computeValue_(!1), nt());
    else if (yO(this), vl(this)) {
      var r = O.trackingContext;
      this.keepAlive_ && !r && (O.trackingContext = this), this.trackAndCompute() && lB(this), O.trackingContext = r;
    }
    var i = this.value_;
    if (za(i))
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
    ), s = this.computeValue_(!0), o = i || za(r) || za(s) || !this.equals_(r, s);
    return o && (this.value_ = s, process.env.NODE_ENV !== "production" && Re() && Jr({
      observableKind: "computed",
      debugObjectName: this.name_,
      object: this.scope_,
      type: "update",
      oldValue: r,
      newValue: s
    })), o;
  }, t.computeValue_ = function(r) {
    this.isComputing = !0;
    var i = jf(!1), s;
    if (r)
      s = pO(this, this.derivation, this.scope_);
    else if (O.disableErrorBoundaries === !0)
      s = this.derivation.call(this.scope_);
    else
      try {
        s = this.derivation.call(this.scope_);
      } catch (o) {
        s = new gu(o);
      }
    return Ff(i), this.isComputing = !1, s;
  }, t.suspend_ = function() {
    this.keepAlive_ || (gl(this), this.value_ = void 0, process.env.NODE_ENV !== "production" && this.isTracing_ !== Ft.NONE && console.log("[mobx.trace] Computed value '" + this.name_ + "' was suspended and it will recompute on the next access."));
  }, t.observe_ = function(r, i) {
    var s = this, o = !0, a = void 0;
    return Kp(function() {
      var u = s.get();
      if (!o || i) {
        var f = di();
        r({
          observableKind: "computed",
          debugObjectName: s.name_,
          type: Xt,
          object: s,
          newValue: u,
          oldValue: a
        }), Wn(f);
      }
      o = !1, a = u;
    });
  }, t.warnAboutUntrackedRead_ = function() {
    process.env.NODE_ENV !== "production" && (this.isTracing_ !== Ft.NONE && console.log("[mobx.trace] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute."), (typeof this.requiresReaction_ == "boolean" ? this.requiresReaction_ : O.computedRequiresReaction) && console.warn("[mobx] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute."));
  }, t.toString = function() {
    return this.name_ + "[" + this.derivation.toString() + "]";
  }, t.valueOf = function() {
    return QA(this.get());
  }, t[Symbol.toPrimitive] = function() {
    return this.valueOf();
  }, ys(e, [{
    key: "isComputing",
    get: function() {
      return ht(this.flags_, e.isComputingMask_);
    },
    set: function(r) {
      this.flags_ = pt(this.flags_, e.isComputingMask_, r);
    }
  }, {
    key: "isRunningSetter",
    get: function() {
      return ht(this.flags_, e.isRunningSetterMask_);
    },
    set: function(r) {
      this.flags_ = pt(this.flags_, e.isRunningSetterMask_, r);
    }
  }, {
    key: "isBeingObserved",
    get: function() {
      return ht(this.flags_, e.isBeingObservedMask_);
    },
    set: function(r) {
      this.flags_ = pt(this.flags_, e.isBeingObservedMask_, r);
    }
  }, {
    key: "isPendingUnobservation",
    get: function() {
      return ht(this.flags_, e.isPendingUnobservationMask_);
    },
    set: function(r) {
      this.flags_ = pt(this.flags_, e.isPendingUnobservationMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return ht(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = pt(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
kt.isComputingMask_ = 1;
kt.isRunningSetterMask_ = 2;
kt.isBeingObservedMask_ = 4;
kt.isPendingUnobservationMask_ = 8;
kt.diffValueMask_ = 16;
var Xr = /* @__PURE__ */ Pr("ComputedValue", kt), U;
(function(e) {
  e[e.NOT_TRACKING_ = -1] = "NOT_TRACKING_", e[e.UP_TO_DATE_ = 0] = "UP_TO_DATE_", e[e.POSSIBLY_STALE_ = 1] = "POSSIBLY_STALE_", e[e.STALE_ = 2] = "STALE_";
})(U || (U = {}));
var Ft;
(function(e) {
  e[e.NONE = 0] = "NONE", e[e.LOG = 1] = "LOG", e[e.BREAK = 2] = "BREAK";
})(Ft || (Ft = {}));
var gu = function(t) {
  this.cause = void 0, this.cause = t;
};
function za(e) {
  return e instanceof gu;
}
function vl(e) {
  switch (e.dependenciesState_) {
    case U.UP_TO_DATE_:
      return !1;
    case U.NOT_TRACKING_:
    case U.STALE_:
      return !0;
    case U.POSSIBLY_STALE_: {
      for (var t = Bf(!0), n = di(), r = e.observing_, i = r.length, s = 0; s < i; s++) {
        var o = r[s];
        if (Xr(o)) {
          if (O.disableErrorBoundaries)
            o.get();
          else
            try {
              o.get();
            } catch {
              return Wn(n), Di(t), !0;
            }
          if (e.dependenciesState_ === U.STALE_)
            return Wn(n), Di(t), !0;
        }
      }
      return dO(e), Wn(n), Di(t), !1;
    }
  }
}
function eB() {
  return O.trackingDerivation !== null;
}
function dn(e) {
  if (process.env.NODE_ENV !== "production") {
    var t = e.observers_.size > 0;
    !O.allowStateChanges && (t || O.enforceActions === "always") && console.warn("[MobX] " + (O.enforceActions ? "Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: " : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, a computed value or the render function of a React component? You can wrap side effects in 'runInAction' (or decorate functions with 'action') if needed. Tried to modify: ") + e.name_);
  }
}
function tB(e) {
  process.env.NODE_ENV !== "production" && !O.allowStateReads && O.observableRequiresReaction && console.warn("[mobx] Observable '" + e.name_ + "' being read outside a reactive context.");
}
function pO(e, t, n) {
  var r = Bf(!0);
  dO(e), e.newObserving_ = new Array(
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
      s = new gu(o);
    }
  return O.inBatch--, O.trackingDerivation = i, rB(e), nB(e), Di(r), s;
}
function nB(e) {
  process.env.NODE_ENV !== "production" && e.observing_.length === 0 && (typeof e.requiresObservable_ == "boolean" ? e.requiresObservable_ : O.reactionRequiresObservable) && console.warn("[mobx] Derivation '" + e.name_ + "' is created/updated without reading any observable value.");
}
function rB(e) {
  for (var t = e.observing_, n = e.observing_ = e.newObserving_, r = U.UP_TO_DATE_, i = 0, s = e.unboundDepsCount_, o = 0; o < s; o++) {
    var a = n[o];
    a.diffValue === 0 && (a.diffValue = 1, i !== o && (n[i] = a), i++), a.dependenciesState_ > r && (r = a.dependenciesState_);
  }
  for (n.length = i, e.newObserving_ = null, s = t.length; s--; ) {
    var u = t[s];
    u.diffValue === 0 && vO(u, e), u.diffValue = 0;
  }
  for (; i--; ) {
    var f = n[i];
    f.diffValue === 1 && (f.diffValue = 0, cB(f, e));
  }
  r !== U.UP_TO_DATE_ && (e.dependenciesState_ = r, e.onBecomeStale_());
}
function gl(e) {
  var t = e.observing_;
  e.observing_ = [];
  for (var n = t.length; n--; )
    vO(t[n], e);
  e.dependenciesState_ = U.NOT_TRACKING_;
}
function Gp(e) {
  var t = di();
  try {
    return e();
  } finally {
    Wn(t);
  }
}
function di() {
  var e = O.trackingDerivation;
  return O.trackingDerivation = null, e;
}
function Wn(e) {
  O.trackingDerivation = e;
}
function Bf(e) {
  var t = O.allowStateReads;
  return O.allowStateReads = e, t;
}
function Di(e) {
  O.allowStateReads = e;
}
function dO(e) {
  if (e.dependenciesState_ !== U.UP_TO_DATE_) {
    e.dependenciesState_ = U.UP_TO_DATE_;
    for (var t = e.observing_, n = t.length; n--; )
      t[n].lowestObserverState_ = U.UP_TO_DATE_;
  }
}
var iB = ["mobxGuid", "spyListeners", "enforceActions", "computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "allowStateReads", "disableErrorBoundaries", "runId", "UNCHANGED", "useProxies"], Vs = function() {
  this.version = 6, this.UNCHANGED = {}, this.trackingDerivation = null, this.trackingContext = null, this.runId = 0, this.mobxGuid = 0, this.inBatch = 0, this.pendingUnobservations = [], this.pendingReactions = [], this.isRunningReactions = !1, this.allowStateChanges = !1, this.allowStateReads = !0, this.enforceActions = !0, this.spyListeners = [], this.globalReactionErrorHandlers = [], this.computedRequiresReaction = !1, this.reactionRequiresObservable = !1, this.observableRequiresReaction = !1, this.disableErrorBoundaries = !1, this.suppressReactionErrors = !1, this.useProxies = !0, this.verifyProxies = !1, this.safeDescriptors = !0;
}, Ua = !0, _O = !1, O = /* @__PURE__ */ function() {
  var e = /* @__PURE__ */ Mf();
  return e.__mobxInstanceCount > 0 && !e.__mobxGlobals && (Ua = !1), e.__mobxGlobals && e.__mobxGlobals.version !== new Vs().version && (Ua = !1), Ua ? e.__mobxGlobals ? (e.__mobxInstanceCount += 1, e.__mobxGlobals.UNCHANGED || (e.__mobxGlobals.UNCHANGED = {}), e.__mobxGlobals) : (e.__mobxInstanceCount = 1, e.__mobxGlobals = /* @__PURE__ */ new Vs()) : (setTimeout(function() {
    _O || E(35);
  }, 1), new Vs());
}();
function sB() {
  if ((O.pendingReactions.length || O.inBatch || O.isRunningReactions) && E(36), _O = !0, Ua) {
    var e = Mf();
    --e.__mobxInstanceCount === 0 && (e.__mobxGlobals = void 0), O = new Vs();
  }
}
function oB() {
  return O;
}
function aB() {
  var e = new Vs();
  for (var t in e)
    iB.indexOf(t) === -1 && (O[t] = e[t]);
  O.allowStateChanges = !O.enforceActions;
}
function uB(e) {
  return e.observers_ && e.observers_.size > 0;
}
function fB(e) {
  return e.observers_;
}
function cB(e, t) {
  e.observers_.add(t), e.lowestObserverState_ > t.dependenciesState_ && (e.lowestObserverState_ = t.dependenciesState_);
}
function vO(e, t) {
  e.observers_.delete(t), e.observers_.size === 0 && gO(e);
}
function gO(e) {
  e.isPendingUnobservation === !1 && (e.isPendingUnobservation = !0, O.pendingUnobservations.push(e));
}
function tt() {
  O.inBatch++;
}
function nt() {
  if (--O.inBatch === 0) {
    AO();
    for (var e = O.pendingUnobservations, t = 0; t < e.length; t++) {
      var n = e[t];
      n.isPendingUnobservation = !1, n.observers_.size === 0 && (n.isBeingObserved && (n.isBeingObserved = !1, n.onBUO()), n instanceof kt && n.suspend_());
    }
    O.pendingUnobservations = [];
  }
}
function yO(e) {
  tB(e);
  var t = O.trackingDerivation;
  return t !== null ? (t.runId_ !== e.lastAccessedBy_ && (e.lastAccessedBy_ = t.runId_, t.newObserving_[t.unboundDepsCount_++] = e, !e.isBeingObserved && O.trackingContext && (e.isBeingObserved = !0, e.onBO())), e.isBeingObserved) : (e.observers_.size === 0 && O.inBatch > 0 && gO(e), !1);
}
function bO(e) {
  e.lowestObserverState_ !== U.STALE_ && (e.lowestObserverState_ = U.STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === U.UP_TO_DATE_ && (process.env.NODE_ENV !== "production" && t.isTracing_ !== Ft.NONE && mO(t, e), t.onBecomeStale_()), t.dependenciesState_ = U.STALE_;
  }));
}
function lB(e) {
  e.lowestObserverState_ !== U.STALE_ && (e.lowestObserverState_ = U.STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === U.POSSIBLY_STALE_ ? (t.dependenciesState_ = U.STALE_, process.env.NODE_ENV !== "production" && t.isTracing_ !== Ft.NONE && mO(t, e)) : t.dependenciesState_ === U.UP_TO_DATE_ && (e.lowestObserverState_ = U.UP_TO_DATE_);
  }));
}
function hB(e) {
  e.lowestObserverState_ === U.UP_TO_DATE_ && (e.lowestObserverState_ = U.POSSIBLY_STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === U.UP_TO_DATE_ && (t.dependenciesState_ = U.POSSIBLY_STALE_, t.onBecomeStale_());
  }));
}
function mO(e, t) {
  if (console.log("[mobx.trace] '" + e.name_ + "' is invalidated due to a change in: '" + t.name_ + "'"), e.isTracing_ === Ft.BREAK) {
    var n = [];
    wO(NO(e), n, 1), new Function(`debugger;
/*
Tracing '` + e.name_ + `'

You are entering this break point because derivation '` + e.name_ + "' is being traced and '" + t.name_ + `' is now forcing it to update.
Just follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update
The stackframe you are looking for is at least ~6-8 stack-frames up.

` + (e instanceof kt ? e.derivation.toString().replace(/[*]\//g, "/") : "") + `

The dependencies for this derivation are:

` + n.join(`
`) + `
*/
    `)();
  }
}
function wO(e, t, n) {
  if (t.length >= 1e3) {
    t.push("(and many more)");
    return;
  }
  t.push("" + "	".repeat(n - 1) + e.name), e.dependencies && e.dependencies.forEach(function(r) {
    return wO(r, t, n + 1);
  });
}
var An = /* @__PURE__ */ function() {
  function e(n, r, i, s) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "Reaction@" + Rt() : "Reaction"), this.name_ = void 0, this.onInvalidate_ = void 0, this.errorHandler_ = void 0, this.requiresObservable_ = void 0, this.observing_ = [], this.newObserving_ = [], this.dependenciesState_ = U.NOT_TRACKING_, this.runId_ = 0, this.unboundDepsCount_ = 0, this.flags_ = 0, this.isTracing_ = Ft.NONE, this.name_ = n, this.onInvalidate_ = r, this.errorHandler_ = i, this.requiresObservable_ = s;
  }
  var t = e.prototype;
  return t.onBecomeStale_ = function() {
    this.schedule_();
  }, t.schedule_ = function() {
    this.isScheduled || (this.isScheduled = !0, O.pendingReactions.push(this), AO());
  }, t.runReaction_ = function() {
    if (!this.isDisposed) {
      tt(), this.isScheduled = !1;
      var r = O.trackingContext;
      if (O.trackingContext = this, vl(this)) {
        this.isTrackPending = !0;
        try {
          this.onInvalidate_(), process.env.NODE_ENV !== "production" && this.isTrackPending && Re() && Jr({
            name: this.name_,
            type: "scheduled-reaction"
          });
        } catch (i) {
          this.reportExceptionInDerivation_(i);
        }
      }
      O.trackingContext = r, nt();
    }
  }, t.track = function(r) {
    if (!this.isDisposed) {
      tt();
      var i = Re(), s;
      process.env.NODE_ENV !== "production" && i && (s = Date.now(), bt({
        name: this.name_,
        type: "reaction"
      })), this.isRunning = !0;
      var o = O.trackingContext;
      O.trackingContext = this;
      var a = pO(this, r, void 0);
      O.trackingContext = o, this.isRunning = !1, this.isTrackPending = !1, this.isDisposed && gl(this), za(a) && this.reportExceptionInDerivation_(a.cause), process.env.NODE_ENV !== "production" && i && mt({
        time: Date.now() - s
      }), nt();
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
    O.suppressReactionErrors ? process.env.NODE_ENV !== "production" && console.warn("[mobx] (error in reaction '" + this.name_ + "' suppressed, fix error of causing action below)") : console.error(s, r), process.env.NODE_ENV !== "production" && Re() && Jr({
      type: "error",
      name: this.name_,
      message: s,
      error: "" + r
    }), O.globalReactionErrorHandlers.forEach(function(o) {
      return o(r, i);
    });
  }, t.dispose = function() {
    this.isDisposed || (this.isDisposed = !0, this.isRunning || (tt(), gl(this), nt()));
  }, t.getDisposer_ = function(r) {
    var i = this, s = function o() {
      i.dispose(), r == null || r.removeEventListener == null || r.removeEventListener("abort", o);
    };
    return r == null || r.addEventListener == null || r.addEventListener("abort", s), s[T] = this, s;
  }, t.toString = function() {
    return "Reaction[" + this.name_ + "]";
  }, t.trace = function(r) {
    r === void 0 && (r = !1), FO(this, r);
  }, ys(e, [{
    key: "isDisposed",
    get: function() {
      return ht(this.flags_, e.isDisposedMask_);
    },
    set: function(r) {
      this.flags_ = pt(this.flags_, e.isDisposedMask_, r);
    }
  }, {
    key: "isScheduled",
    get: function() {
      return ht(this.flags_, e.isScheduledMask_);
    },
    set: function(r) {
      this.flags_ = pt(this.flags_, e.isScheduledMask_, r);
    }
  }, {
    key: "isTrackPending",
    get: function() {
      return ht(this.flags_, e.isTrackPendingMask_);
    },
    set: function(r) {
      this.flags_ = pt(this.flags_, e.isTrackPendingMask_, r);
    }
  }, {
    key: "isRunning",
    get: function() {
      return ht(this.flags_, e.isRunningMask_);
    },
    set: function(r) {
      this.flags_ = pt(this.flags_, e.isRunningMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return ht(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = pt(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
An.isDisposedMask_ = 1;
An.isScheduledMask_ = 2;
An.isTrackPendingMask_ = 4;
An.isRunningMask_ = 8;
An.diffValueMask_ = 16;
function pB(e) {
  return O.globalReactionErrorHandlers.push(e), function() {
    var t = O.globalReactionErrorHandlers.indexOf(e);
    t >= 0 && O.globalReactionErrorHandlers.splice(t, 1);
  };
}
var lv = 100, yl = function(t) {
  return t();
};
function AO() {
  O.inBatch > 0 || O.isRunningReactions || yl(dB);
}
function dB() {
  O.isRunningReactions = !0;
  for (var e = O.pendingReactions, t = 0; e.length > 0; ) {
    ++t === lv && (console.error(process.env.NODE_ENV !== "production" ? "Reaction doesn't converge to a stable state after " + lv + " iterations." + (" Probably there is a cycle in the reactive function: " + e[0]) : "[mobx] cycle in reaction: " + e[0]), e.splice(0));
    for (var n = e.splice(0), r = 0, i = n.length; r < i; r++)
      n[r].runReaction_();
  }
  O.isRunningReactions = !1;
}
var yu = /* @__PURE__ */ Pr("Reaction", An);
function _B(e) {
  var t = yl;
  yl = function(r) {
    return e(function() {
      return t(r);
    });
  };
}
function Re() {
  return process.env.NODE_ENV !== "production" && !!O.spyListeners.length;
}
function Jr(e) {
  if (process.env.NODE_ENV !== "production" && O.spyListeners.length)
    for (var t = O.spyListeners, n = 0, r = t.length; n < r; n++)
      t[n](e);
}
function bt(e) {
  if (process.env.NODE_ENV !== "production") {
    var t = wn({}, e, {
      spyReportStart: !0
    });
    Jr(t);
  }
}
var vB = {
  type: "report-end",
  spyReportEnd: !0
};
function mt(e) {
  process.env.NODE_ENV !== "production" && Jr(e ? wn({}, e, {
    type: "report-end",
    spyReportEnd: !0
  }) : vB);
}
function OO(e) {
  return process.env.NODE_ENV === "production" ? (console.warn("[mobx.spy] Is a no-op in production builds"), function() {
  }) : (O.spyListeners.push(e), zp(function() {
    O.spyListeners = O.spyListeners.filter(function(t) {
      return t !== e;
    });
  }));
}
var Hp = "action", gB = "action.bound", EO = "autoAction", yB = "autoAction.bound", SO = "<unnamed action>", bl = /* @__PURE__ */ oa(Hp), bB = /* @__PURE__ */ oa(gB, {
  bound: !0
}), ml = /* @__PURE__ */ oa(EO, {
  autoAction: !0
}), mB = /* @__PURE__ */ oa(yB, {
  autoAction: !0,
  bound: !0
});
function xO(e) {
  var t = function(r, i) {
    if (ae(r))
      return yr(r.name || SO, r, e);
    if (ae(i))
      return yr(r, i, e);
    if (sa(i))
      return (e ? ml : bl).decorate_20223_(r, i);
    if (mn(i))
      return ia(r, i, e ? ml : bl);
    if (mn(r))
      return Qt(oa(e ? EO : Hp, {
        name: r,
        autoAction: e
      }));
    process.env.NODE_ENV !== "production" && E("Invalid arguments for `action`");
  };
  return t;
}
var rr = /* @__PURE__ */ xO(!1);
Object.assign(rr, bl);
var Zi = /* @__PURE__ */ xO(!0);
Object.assign(Zi, ml);
rr.bound = /* @__PURE__ */ Qt(bB);
Zi.bound = /* @__PURE__ */ Qt(mB);
function hv(e) {
  return cO(e.name || SO, !1, e, this, void 0);
}
function Zr(e) {
  return ae(e) && e.isMobxAction === !0;
}
function Kp(e, t) {
  var n, r, i, s;
  t === void 0 && (t = Bp), process.env.NODE_ENV !== "production" && (ae(e) || E("Autorun expects a function as first argument"), Zr(e) && E("Autorun does not accept actions since actions are untrackable"));
  var o = (n = (r = t) == null ? void 0 : r.name) != null ? n : process.env.NODE_ENV !== "production" ? e.name || "Autorun@" + Rt() : "Autorun", a = !t.scheduler && !t.delay, u;
  if (a)
    u = new An(o, function() {
      this.track(l);
    }, t.onError, t.requiresObservable);
  else {
    var f = TO(t), c = !1;
    u = new An(o, function() {
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
var wB = function(t) {
  return t();
};
function TO(e) {
  return e.scheduler ? e.scheduler : e.delay ? function(t) {
    return setTimeout(t, e.delay);
  } : wB;
}
function AB(e, t, n) {
  var r, i, s;
  n === void 0 && (n = Bp), process.env.NODE_ENV !== "production" && ((!ae(e) || !ae(t)) && E("First and second argument to reaction should be functions"), it(n) || E("Third argument of reactions should be an object"));
  var o = (r = n.name) != null ? r : process.env.NODE_ENV !== "production" ? "Reaction@" + Rt() : "Reaction", a = rr(o, n.onError ? OB(n.onError, t) : t), u = !n.scheduler && !n.delay, f = TO(n), c = !0, l = !1, h, d = n.compareStructural ? Kr.structural : n.equals || Kr.default, _ = new An(o, function() {
    c || u ? v() : l || (l = !0, f(v));
  }, n.onError, n.requiresObservable);
  function v() {
    if (l = !1, !_.isDisposed) {
      var g = !1, y = h;
      _.track(function() {
        var b = Wp(!1, function() {
          return e(_);
        });
        g = c || !d(h, b), h = b;
      }), (c && n.fireImmediately || !c && g) && a(h, y, _), c = !1;
    }
  }
  return (i = n) != null && (i = i.signal) != null && i.aborted || _.schedule_(), _.getDisposer_((s = n) == null ? void 0 : s.signal);
}
function OB(e, t) {
  return function() {
    try {
      return t.apply(this, arguments);
    } catch (n) {
      e.call(this, n);
    }
  };
}
var EB = "onBO", SB = "onBUO";
function RO(e, t, n) {
  return PO(EB, e, t, n);
}
function Yp(e, t, n) {
  return PO(SB, e, t, n);
}
function PO(e, t, n, r) {
  var i = typeof r == "function" ? sn(t, n) : sn(t), s = ae(r) ? r : n, o = e + "L";
  return i[o] ? i[o].add(s) : i[o] = /* @__PURE__ */ new Set([s]), function() {
    var a = i[o];
    a && (a.delete(s), a.size === 0 && delete i[o]);
  };
}
var xB = "never", Ra = "always", TB = "observed";
function RB(e) {
  e.isolateGlobalState === !0 && sB();
  var t = e.useProxies, n = e.enforceActions;
  if (t !== void 0 && (O.useProxies = t === Ra ? !0 : t === xB ? !1 : typeof Proxy < "u"), t === "ifavailable" && (O.verifyProxies = !0), n !== void 0) {
    var r = n === Ra ? Ra : n === TB;
    O.enforceActions = r, O.allowStateChanges = !(r === !0 || r === Ra);
  }
  ["computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "disableErrorBoundaries", "safeDescriptors"].forEach(function(i) {
    i in e && (O[i] = !!e[i]);
  }), O.allowStateReads = !O.observableRequiresReaction, process.env.NODE_ENV !== "production" && O.disableErrorBoundaries === !0 && console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled."), e.reactionScheduler && _B(e.reactionScheduler);
}
function Xp(e, t, n, r) {
  process.env.NODE_ENV !== "production" && (arguments.length > 4 && E("'extendObservable' expected 2-4 arguments"), typeof e != "object" && E("'extendObservable' expects an object as first argument"), ye(e) && E("'extendObservable' should not be used on maps, use map.merge instead"), it(t) || E("'extendObservable' only accepts plain objects as second argument"), (ei(t) || ei(n)) && E("Extending an object with another observable (object) is not supported"));
  var i = tF(t);
  return $r(function() {
    var s = _i(e, r)[T];
    Ji(i).forEach(function(o) {
      s.extend_(
        o,
        i[o],
        // must pass "undefined" for { key: undefined }
        n && o in n ? n[o] : !0
      );
    });
  }), e;
}
function NO(e, t) {
  return $O(sn(e, t));
}
function $O(e) {
  var t = {
    name: e.name_
  };
  return e.observing_ && e.observing_.length > 0 && (t.dependencies = NB(e.observing_).map($O)), t;
}
function PB(e, t) {
  return MO(sn(e, t));
}
function MO(e) {
  var t = {
    name: e.name_
  };
  return uB(e) && (t.observers = Array.from(fB(e)).map(MO)), t;
}
function NB(e) {
  return Array.from(new Set(e));
}
var $B = 0;
function zf() {
  this.message = "FLOW_CANCELLED";
}
zf.prototype = /* @__PURE__ */ Object.create(Error.prototype);
function MB(e) {
  return e instanceof zf;
}
var yc = /* @__PURE__ */ rO("flow"), IB = /* @__PURE__ */ rO("flow.bound", {
  bound: !0
}), Qr = /* @__PURE__ */ Object.assign(function(t, n) {
  if (sa(n))
    return yc.decorate_20223_(t, n);
  if (mn(n))
    return ia(t, n, yc);
  process.env.NODE_ENV !== "production" && arguments.length !== 1 && E("Flow expects single argument with generator function");
  var r = t, i = r.name || "<unnamed flow>", s = function() {
    var a = this, u = arguments, f = ++$B, c = rr(i + " - runid: " + f + " - init", r).apply(a, u), l, h = void 0, d = new Promise(function(_, v) {
      var g = 0;
      l = v;
      function y(m) {
        h = void 0;
        var A;
        try {
          A = rr(i + " - runid: " + f + " - yield " + g++, c.next).call(c, m);
        } catch (S) {
          return v(S);
        }
        w(A);
      }
      function b(m) {
        h = void 0;
        var A;
        try {
          A = rr(i + " - runid: " + f + " - yield " + g++, c.throw).call(c, m);
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
    return d.cancel = rr(i + " - runid: " + f + " - cancel", function() {
      try {
        h && pv(h);
        var _ = c.return(void 0), v = Promise.resolve(_.value);
        v.then(Ei, Ei), pv(v), l(new zf());
      } catch (g) {
        l(g);
      }
    }), d;
  };
  return s.isMobXFlow = !0, s;
}, yc);
Qr.bound = /* @__PURE__ */ Qt(IB);
function pv(e) {
  ae(e.cancel) && e.cancel();
}
function DB(e) {
  return e;
}
function Qi(e) {
  return e?.isMobXFlow === !0;
}
function CB(e, t, n) {
  var r;
  if (ye(e) || Ze(e) || qp(e))
    r = On(e);
  else if (_e(e)) {
    if (process.env.NODE_ENV !== "production" && !mn(t))
      return E("InterceptReads can only be used with a specific property, not with an object in general");
    r = On(e, t);
  } else if (process.env.NODE_ENV !== "production")
    return E("Expected observable map, object or array as first array");
  return process.env.NODE_ENV !== "production" && r.dehancer !== void 0 ? E("An intercept reader was already established") : (r.dehancer = typeof t == "function" ? t : n, function() {
    r.dehancer = void 0;
  });
}
function LB(e, t, n) {
  return ae(n) ? FB(e, t, n) : jB(e, t);
}
function jB(e, t) {
  return On(e).intercept_(t);
}
function FB(e, t, n) {
  return On(e, t).intercept_(n);
}
function IO(e, t) {
  if (t === void 0)
    return Xr(e);
  if (_e(e) === !1 || !e[T].values_.has(t))
    return !1;
  var n = sn(e, t);
  return Xr(n);
}
function BB(e) {
  return process.env.NODE_ENV !== "production" && arguments.length > 1 ? E("isComputed expects only 1 argument. Use isComputedProp to inspect the observability of a property") : IO(e);
}
function zB(e, t) {
  return process.env.NODE_ENV !== "production" && !mn(t) ? E("isComputed expected a property name as second argument") : IO(e, t);
}
function DO(e, t) {
  return e ? t !== void 0 ? process.env.NODE_ENV !== "production" && (ye(e) || Ze(e)) ? E("isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.") : _e(e) ? e[T].values_.has(t) : !1 : _e(e) || !!e[T] || Up(e) || yu(e) || Xr(e) : !1;
}
function ei(e) {
  return process.env.NODE_ENV !== "production" && arguments.length !== 1 && E("isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property"), DO(e);
}
function UB(e, t) {
  return process.env.NODE_ENV !== "production" && !mn(t) ? E("expected a property name as second argument") : DO(e, t);
}
function _o(e) {
  if (_e(e))
    return e[T].keys_();
  if (ye(e) || de(e))
    return Array.from(e.keys());
  if (Ze(e))
    return e.map(function(t, n) {
      return n;
    });
  E(5);
}
function kB(e) {
  if (_e(e))
    return _o(e).map(function(t) {
      return e[t];
    });
  if (ye(e))
    return _o(e).map(function(t) {
      return e.get(t);
    });
  if (de(e))
    return Array.from(e.values());
  if (Ze(e))
    return e.slice();
  E(6);
}
function VB(e) {
  if (_e(e))
    return _o(e).map(function(t) {
      return [t, e[t]];
    });
  if (ye(e))
    return _o(e).map(function(t) {
      return [t, e.get(t)];
    });
  if (de(e))
    return Array.from(e.entries());
  if (Ze(e))
    return e.map(function(t, n) {
      return [n, t];
    });
  E(7);
}
function CO(e, t, n) {
  if (arguments.length === 2 && !de(e)) {
    tt();
    var r = t;
    try {
      for (var i in r)
        CO(e, i, r[i]);
    } finally {
      nt();
    }
    return;
  }
  _e(e) ? e[T].set_(t, n) : ye(e) ? e.set(t, n) : de(e) ? e.add(t) : Ze(e) ? (typeof t != "number" && (t = parseInt(t, 10)), t < 0 && E("Invalid index: '" + t + "'"), tt(), t >= e.length && (e.length = t + 1), e[t] = n, nt()) : E(8);
}
function WB(e, t) {
  _e(e) ? e[T].delete_(t) : ye(e) || de(e) ? e.delete(t) : Ze(e) ? (typeof t != "number" && (t = parseInt(t, 10)), e.splice(t, 1)) : E(9);
}
function LO(e, t) {
  if (_e(e))
    return e[T].has_(t);
  if (ye(e))
    return e.has(t);
  if (de(e))
    return e.has(t);
  if (Ze(e))
    return t >= 0 && t < e.length;
  E(10);
}
function qB(e, t) {
  if (LO(e, t)) {
    if (_e(e))
      return e[T].get_(t);
    if (ye(e))
      return e.get(t);
    if (Ze(e))
      return e[t];
    E(11);
  }
}
function GB(e, t, n) {
  if (_e(e))
    return e[T].defineProperty_(t, n);
  E(39);
}
function jO(e) {
  if (_e(e))
    return e[T].ownKeys_();
  E(38);
}
function HB(e, t, n, r) {
  return ae(n) ? YB(e, t, n, r) : KB(e, t, n);
}
function KB(e, t, n) {
  return On(e).observe_(t, n);
}
function YB(e, t, n, r) {
  return On(e, t).observe_(n, r);
}
function Pa(e, t, n) {
  return e.set(t, n), n;
}
function Oi(e, t) {
  if (e == null || typeof e != "object" || e instanceof Date || !ei(e))
    return e;
  if (qp(e) || Xr(e))
    return Oi(e.get(), t);
  if (t.has(e))
    return t.get(e);
  if (Ze(e)) {
    var n = Pa(t, e, new Array(e.length));
    return e.forEach(function(o, a) {
      n[a] = Oi(o, t);
    }), n;
  }
  if (de(e)) {
    var r = Pa(t, e, /* @__PURE__ */ new Set());
    return e.forEach(function(o) {
      r.add(Oi(o, t));
    }), r;
  }
  if (ye(e)) {
    var i = Pa(t, e, /* @__PURE__ */ new Map());
    return e.forEach(function(o, a) {
      i.set(a, Oi(o, t));
    }), i;
  } else {
    var s = Pa(t, e, {});
    return jO(e).forEach(function(o) {
      na.propertyIsEnumerable.call(e, o) && (s[o] = Oi(e[o], t));
    }), s;
  }
}
function XB(e, t) {
  return process.env.NODE_ENV !== "production" && t && E("toJS no longer supports options"), Oi(e, /* @__PURE__ */ new Map());
}
function FO() {
  if (process.env.NODE_ENV !== "production") {
    for (var e = !1, t = arguments.length, n = new Array(t), r = 0; r < t; r++)
      n[r] = arguments[r];
    typeof n[n.length - 1] == "boolean" && (e = n.pop());
    var i = JB(n);
    if (!i)
      return E("'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
    i.isTracing_ === Ft.NONE && console.log("[mobx.trace] '" + i.name_ + "' tracing enabled"), i.isTracing_ = e ? Ft.BREAK : Ft.LOG;
  }
}
function JB(e) {
  switch (e.length) {
    case 0:
      return O.trackingDerivation;
    case 1:
      return sn(e[0]);
    case 2:
      return sn(e[0], e[1]);
  }
}
function ln(e, t) {
  t === void 0 && (t = void 0), tt();
  try {
    return e.apply(t);
  } finally {
    nt();
  }
}
function ZB(e, t, n) {
  return arguments.length === 1 || t && typeof t == "object" ? QB(e, t) : BO(e, t, n || {});
}
function BO(e, t, n) {
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
  n.name = process.env.NODE_ENV !== "production" ? n.name || "When@" + Rt() : "When";
  var s = yr(process.env.NODE_ENV !== "production" ? n.name + "-effect" : "When-effect", t), o = Kp(function(a) {
    var u = Wp(!1, e);
    u && (a.dispose(), r && clearTimeout(r), s());
  }, n);
  return o;
}
function QB(e, t) {
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
    var u, f = BO(e, o, wn({}, t, {
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
function Ir(e) {
  return e[T];
}
var ez = {
  has: function(t, n) {
    return process.env.NODE_ENV !== "production" && O.trackingDerivation && Ts("detect new properties using the 'in' operator. Use 'has' from 'mobx' instead."), Ir(t).has_(n);
  },
  get: function(t, n) {
    return Ir(t).get_(n);
  },
  set: function(t, n, r) {
    var i;
    return mn(n) ? (process.env.NODE_ENV !== "production" && !Ir(t).values_.has(n) && Ts("add a new observable property through direct assignment. Use 'set' from 'mobx' instead."), (i = Ir(t).set_(n, r, !0)) != null ? i : !0) : !1;
  },
  deleteProperty: function(t, n) {
    var r;
    return process.env.NODE_ENV !== "production" && Ts("delete properties from an observable object. Use 'remove' from 'mobx' instead."), mn(n) ? (r = Ir(t).delete_(n, !0)) != null ? r : !0 : !1;
  },
  defineProperty: function(t, n, r) {
    var i;
    return process.env.NODE_ENV !== "production" && Ts("define property on an observable object. Use 'defineProperty' from 'mobx' instead."), (i = Ir(t).defineProperty_(n, r)) != null ? i : !0;
  },
  ownKeys: function(t) {
    return process.env.NODE_ENV !== "production" && O.trackingDerivation && Ts("iterate keys to detect added / removed properties. Use 'keys' from 'mobx' instead."), Ir(t).ownKeys_();
  },
  preventExtensions: function(t) {
    E(13);
  }
};
function tz(e, t) {
  var n, r;
  return YA(), e = _i(e, t), (r = (n = e[T]).proxy_) != null ? r : n.proxy_ = new Proxy(e, ez);
}
function Mt(e) {
  return e.interceptors_ !== void 0 && e.interceptors_.length > 0;
}
function ua(e, t) {
  var n = e.interceptors_ || (e.interceptors_ = []);
  return n.push(t), zp(function() {
    var r = n.indexOf(t);
    r !== -1 && n.splice(r, 1);
  });
}
function It(e, t) {
  var n = di();
  try {
    for (var r = [].concat(e.interceptors_ || []), i = 0, s = r.length; i < s && (t = r[i](t), t && !t.type && E(14), !!t); i++)
      ;
    return t;
  } finally {
    Wn(n);
  }
}
function en(e) {
  return e.changeListeners_ !== void 0 && e.changeListeners_.length > 0;
}
function fa(e, t) {
  var n = e.changeListeners_ || (e.changeListeners_ = []);
  return n.push(t), zp(function() {
    var r = n.indexOf(t);
    r !== -1 && n.splice(r, 1);
  });
}
function tn(e, t) {
  var n = di(), r = e.changeListeners_;
  if (r) {
    r = r.slice();
    for (var i = 0, s = r.length; i < s; i++)
      r[i](t);
    Wn(n);
  }
}
function nz(e, t, n) {
  return $r(function() {
    var r, i = _i(e, n)[T];
    process.env.NODE_ENV !== "production" && t && e[et] && E("makeObservable second arg must be nullish when using decorators. Mixing @decorator syntax with annotations is not supported."), (r = t) != null || (t = aF(e)), Ji(t).forEach(function(s) {
      return i.make_(s, t[s]);
    });
  }), e;
}
var bc = /* @__PURE__ */ Symbol("mobx-keys");
function rz(e, t, n) {
  return process.env.NODE_ENV !== "production" && (!it(e) && !it(Object.getPrototypeOf(e)) && E("'makeAutoObservable' can only be used for classes that don't have a superclass"), _e(e) && E("makeAutoObservable can only be used on objects not already made observable")), it(e) ? Xp(e, e, t, n) : ($r(function() {
    var r = _i(e, n)[T];
    if (!e[bc]) {
      var i = Object.getPrototypeOf(e), s = new Set([].concat(Ji(e), Ji(i)));
      s.delete("constructor"), s.delete(T), ra(i, bc, s);
    }
    e[bc].forEach(function(o) {
      return r.make_(
        o,
        // must pass "undefined" for { key: undefined }
        t && o in t ? t[o] : !0
      );
    });
  }), e);
}
var dv = "splice", Xt = "update", iz = 1e4, sz = {
  get: function(t, n) {
    var r = t[T];
    return n === T ? r : n === "length" ? r.getArrayLength_() : typeof n == "string" && !isNaN(n) ? r.get_(parseInt(n)) : yt(bu, n) ? bu[n] : t[n];
  },
  set: function(t, n, r) {
    var i = t[T];
    return n === "length" && i.setArrayLength_(r), typeof n == "symbol" || isNaN(n) ? t[n] = r : i.set_(parseInt(n), r), !0;
  },
  preventExtensions: function() {
    E(15);
  }
}, Jp = /* @__PURE__ */ function() {
  function e(n, r, i, s) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "ObservableArray@" + Rt() : "ObservableArray"), this.owned_ = void 0, this.legacyMode_ = void 0, this.atom_ = void 0, this.values_ = [], this.interceptors_ = void 0, this.changeListeners_ = void 0, this.enhancer_ = void 0, this.dehancer = void 0, this.proxy_ = void 0, this.lastKnownLength_ = 0, this.owned_ = i, this.legacyMode_ = s, this.atom_ = new Nr(n), this.enhancer_ = function(o, a) {
      return r(o, a, process.env.NODE_ENV !== "production" ? n + "[..]" : "ObservableArray[..]");
    };
  }
  var t = e.prototype;
  return t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.dehanceValues_ = function(r) {
    return this.dehancer !== void 0 && r.length > 0 ? r.map(this.dehancer) : r;
  }, t.intercept_ = function(r) {
    return ua(this, r);
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
    }), fa(this, r);
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
    r !== this.lastKnownLength_ && E(16), this.lastKnownLength_ += i, this.legacyMode_ && i > 0 && VO(r + i + 1);
  }, t.spliceWithArray_ = function(r, i, s) {
    var o = this;
    dn(this.atom_);
    var a = this.values_.length;
    if (r === void 0 ? r = 0 : r > a ? r = a : r < 0 && (r = Math.max(0, a + r)), arguments.length === 1 ? i = a - r : i == null ? i = 0 : i = Math.max(0, Math.min(i, a - r)), s === void 0 && (s = du), Mt(this)) {
      var u = It(this, {
        object: this.proxy_,
        type: dv,
        index: r,
        removedCount: i,
        added: s
      });
      if (!u)
        return du;
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
    if (s.length < iz) {
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
    var o = !this.owned_ && Re(), a = en(this), u = a || o ? {
      observableKind: "array",
      object: this.proxy_,
      type: Xt,
      debugObjectName: this.atom_.name_,
      index: r,
      newValue: i,
      oldValue: s
    } : null;
    process.env.NODE_ENV !== "production" && o && bt(u), this.atom_.reportChanged(), a && tn(this, u), process.env.NODE_ENV !== "production" && o && mt();
  }, t.notifyArraySplice_ = function(r, i, s) {
    var o = !this.owned_ && Re(), a = en(this), u = a || o ? {
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: dv,
      index: r,
      removed: s,
      added: i,
      removedCount: s.length,
      addedCount: i.length
    } : null;
    process.env.NODE_ENV !== "production" && o && bt(u), this.atom_.reportChanged(), a && tn(this, u), process.env.NODE_ENV !== "production" && o && mt();
  }, t.get_ = function(r) {
    if (this.legacyMode_ && r >= this.values_.length) {
      console.warn(process.env.NODE_ENV !== "production" ? "[mobx.array] Attempt to read an array index (" + r + ") that is out of bounds (" + this.values_.length + "). Please check length first. Out of bound indices will not be tracked by MobX" : "[mobx] Out of bounds read: " + r);
      return;
    }
    return this.atom_.reportObserved(), this.dehanceValue_(this.values_[r]);
  }, t.set_ = function(r, i) {
    var s = this.values_;
    if (this.legacyMode_ && r > s.length && E(17, r, s.length), r < s.length) {
      dn(this.atom_);
      var o = s[r];
      if (Mt(this)) {
        var a = It(this, {
          type: Xt,
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
function oz(e, t, n, r) {
  return n === void 0 && (n = process.env.NODE_ENV !== "production" ? "ObservableArray@" + Rt() : "ObservableArray"), r === void 0 && (r = !1), YA(), $r(function() {
    var i = new Jp(n, t, r, !1);
    JA(i.values_, T, i);
    var s = new Proxy(i.values_, sz);
    return i.proxy_ = s, e && e.length && i.spliceWithArray_(0, 0, e), s;
  });
}
var bu = {
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
ee("at", Pt);
ee("concat", Pt);
ee("flat", Pt);
ee("includes", Pt);
ee("indexOf", Pt);
ee("join", Pt);
ee("lastIndexOf", Pt);
ee("slice", Pt);
ee("toString", Pt);
ee("toLocaleString", Pt);
ee("toSorted", Pt);
ee("toSpliced", Pt);
ee("with", Pt);
ee("every", an);
ee("filter", an);
ee("find", an);
ee("findIndex", an);
ee("findLast", an);
ee("findLastIndex", an);
ee("flatMap", an);
ee("forEach", an);
ee("map", an);
ee("some", an);
ee("toReversed", an);
ee("reduce", zO);
ee("reduceRight", zO);
function ee(e, t) {
  typeof Array.prototype[e] == "function" && (bu[e] = t(e));
}
function Pt(e) {
  return function() {
    var t = this[T];
    t.atom_.reportObserved();
    var n = t.dehanceValues_(t.values_);
    return n[e].apply(n, arguments);
  };
}
function an(e) {
  return function(t, n) {
    var r = this, i = this[T];
    i.atom_.reportObserved();
    var s = i.dehanceValues_(i.values_);
    return s[e](function(o, a) {
      return t.call(n, o, a, r);
    });
  };
}
function zO(e) {
  return function() {
    var t = this, n = this[T];
    n.atom_.reportObserved();
    var r = n.dehanceValues_(n.values_), i = arguments[0];
    return arguments[0] = function(s, o, a) {
      return i(s, o, a, t);
    }, r[e].apply(r, arguments);
  };
}
var az = /* @__PURE__ */ Pr("ObservableArrayAdministration", Jp);
function Ze(e) {
  return If(e) && az(e[T]);
}
var uz = {}, ir = "add", mu = "delete", Zp = /* @__PURE__ */ function() {
  function e(n, r, i) {
    var s = this;
    r === void 0 && (r = Yr), i === void 0 && (i = process.env.NODE_ENV !== "production" ? "ObservableMap@" + Rt() : "ObservableMap"), this.enhancer_ = void 0, this.name_ = void 0, this[T] = uz, this.data_ = void 0, this.hasMap_ = void 0, this.keysAtom_ = void 0, this.interceptors_ = void 0, this.changeListeners_ = void 0, this.dehancer = void 0, this.enhancer_ = r, this.name_ = i, ae(Map) || E(18), $r(function() {
      s.keysAtom_ = kp(process.env.NODE_ENV !== "production" ? s.name_ + ".keys()" : "ObservableMap.keys()"), s.data_ = /* @__PURE__ */ new Map(), s.hasMap_ = /* @__PURE__ */ new Map(), n && s.merge(n);
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
      var o = s = new cr(this.has_(r), Cf, process.env.NODE_ENV !== "production" ? this.name_ + "." + hl(r) + "?" : "ObservableMap.key?", !1);
      this.hasMap_.set(r, o), Yp(o, function() {
        return i.hasMap_.delete(r);
      });
    }
    return s.get();
  }, t.set = function(r, i) {
    var s = this.has_(r);
    if (Mt(this)) {
      var o = It(this, {
        type: s ? Xt : ir,
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
    if (dn(this.keysAtom_), Mt(this)) {
      var s = It(this, {
        type: mu,
        object: this,
        name: r
      });
      if (!s)
        return !1;
    }
    if (this.has_(r)) {
      var o = Re(), a = en(this), u = a || o ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: mu,
        object: this,
        oldValue: this.data_.get(r).value_,
        name: r
      } : null;
      return process.env.NODE_ENV !== "production" && o && bt(u), ln(function() {
        var f;
        i.keysAtom_.reportChanged(), (f = i.hasMap_.get(r)) == null || f.setNewValue_(!1);
        var c = i.data_.get(r);
        c.setNewValue_(void 0), i.data_.delete(r);
      }), a && tn(this, u), process.env.NODE_ENV !== "production" && o && mt(), !0;
    }
    return !1;
  }, t.updateValue_ = function(r, i) {
    var s = this.data_.get(r);
    if (i = s.prepareNewValue_(i), i !== O.UNCHANGED) {
      var o = Re(), a = en(this), u = a || o ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: Xt,
        object: this,
        oldValue: s.value_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && o && bt(u), s.setNewValue_(i), a && tn(this, u), process.env.NODE_ENV !== "production" && o && mt();
    }
  }, t.addValue_ = function(r, i) {
    var s = this;
    dn(this.keysAtom_), ln(function() {
      var f, c = new cr(i, s.enhancer_, process.env.NODE_ENV !== "production" ? s.name_ + "." + hl(r) : "ObservableMap.key", !1);
      s.data_.set(r, c), i = c.value_, (f = s.hasMap_.get(r)) == null || f.setNewValue_(!0), s.keysAtom_.reportChanged();
    });
    var o = Re(), a = en(this), u = a || o ? {
      observableKind: "map",
      debugObjectName: this.name_,
      type: ir,
      object: this,
      name: r,
      newValue: i
    } : null;
    process.env.NODE_ENV !== "production" && o && bt(u), a && tn(this, u), process.env.NODE_ENV !== "production" && o && mt();
  }, t.get = function(r) {
    return this.has(r) ? this.dehanceValue_(this.data_.get(r).get()) : this.dehanceValue_(void 0);
  }, t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.keys = function() {
    return this.keysAtom_.reportObserved(), this.data_.keys();
  }, t.values = function() {
    var r = this, i = this.keys();
    return _v({
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
    return _v({
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
    for (var s = Si(this), o; !(o = s()).done; ) {
      var a = o.value, u = a[0], f = a[1];
      r.call(i, f, u, this);
    }
  }, t.merge = function(r) {
    var i = this;
    return ye(r) && (r = new Map(r)), ln(function() {
      it(r) ? eF(r).forEach(function(s) {
        return i.set(s, r[s]);
      }) : Array.isArray(r) ? r.forEach(function(s) {
        var o = s[0], a = s[1];
        return i.set(o, a);
      }) : gs(r) ? (Qj(r) || E(19, r), r.forEach(function(s, o) {
        return i.set(o, s);
      })) : r != null && E(20, r);
    }), this;
  }, t.clear = function() {
    var r = this;
    ln(function() {
      Gp(function() {
        for (var i = Si(r.keys()), s; !(s = i()).done; ) {
          var o = s.value;
          r.delete(o);
        }
      });
    });
  }, t.replace = function(r) {
    var i = this;
    return ln(function() {
      for (var s = fz(r), o = /* @__PURE__ */ new Map(), a = !1, u = Si(i.data_.keys()), f; !(f = u()).done; ) {
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
      for (var d = Si(s.entries()), _; !(_ = d()).done; ) {
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
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support fireImmediately=true in combination with maps."), fa(this, r);
  }, t.intercept_ = function(r) {
    return ua(this, r);
  }, ys(e, [{
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
}(), ye = /* @__PURE__ */ Pr("ObservableMap", Zp);
function _v(e) {
  return e[Symbol.toStringTag] = "MapIterator", nd(e);
}
function fz(e) {
  if (gs(e) || ye(e))
    return e;
  if (Array.isArray(e))
    return new Map(e);
  if (it(e)) {
    var t = /* @__PURE__ */ new Map();
    for (var n in e)
      t.set(n, e[n]);
    return t;
  } else
    return E(21, e);
}
var cz = {}, Qp = /* @__PURE__ */ function() {
  function e(n, r, i) {
    var s = this;
    r === void 0 && (r = Yr), i === void 0 && (i = process.env.NODE_ENV !== "production" ? "ObservableSet@" + Rt() : "ObservableSet"), this.name_ = void 0, this[T] = cz, this.data_ = /* @__PURE__ */ new Set(), this.atom_ = void 0, this.changeListeners_ = void 0, this.interceptors_ = void 0, this.dehancer = void 0, this.enhancer_ = void 0, this.name_ = i, ae(Set) || E(22), this.enhancer_ = function(o, a) {
      return r(o, a, i);
    }, $r(function() {
      s.atom_ = kp(s.name_), n && s.replace(n);
    });
  }
  var t = e.prototype;
  return t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.clear = function() {
    var r = this;
    ln(function() {
      Gp(function() {
        for (var i = Si(r.data_.values()), s; !(s = i()).done; ) {
          var o = s.value;
          r.delete(o);
        }
      });
    });
  }, t.forEach = function(r, i) {
    for (var s = Si(this), o; !(o = s()).done; ) {
      var a = o.value;
      r.call(i, a, a, this);
    }
  }, t.add = function(r) {
    var i = this;
    if (dn(this.atom_), Mt(this)) {
      var s = It(this, {
        type: ir,
        object: this,
        newValue: r
      });
      if (!s)
        return this;
      r = s.newValue;
    }
    if (!this.has(r)) {
      ln(function() {
        i.data_.add(i.enhancer_(r, void 0)), i.atom_.reportChanged();
      });
      var o = process.env.NODE_ENV !== "production" && Re(), a = en(this), u = a || o ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: ir,
        object: this,
        newValue: r
      } : null;
      o && process.env.NODE_ENV !== "production" && bt(u), a && tn(this, u), o && process.env.NODE_ENV !== "production" && mt();
    }
    return this;
  }, t.delete = function(r) {
    var i = this;
    if (Mt(this)) {
      var s = It(this, {
        type: mu,
        object: this,
        oldValue: r
      });
      if (!s)
        return !1;
    }
    if (this.has(r)) {
      var o = process.env.NODE_ENV !== "production" && Re(), a = en(this), u = a || o ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: mu,
        object: this,
        oldValue: r
      } : null;
      return o && process.env.NODE_ENV !== "production" && bt(u), ln(function() {
        i.atom_.reportChanged(), i.data_.delete(r);
      }), a && tn(this, u), o && process.env.NODE_ENV !== "production" && mt(), !0;
    }
    return !1;
  }, t.has = function(r) {
    return this.atom_.reportObserved(), this.data_.has(this.dehanceValue_(r));
  }, t.entries = function() {
    var r = this.values();
    return vv({
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
    return vv({
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
    if (Un(r) && !de(r))
      return r.intersection(this);
    var i = new Set(this);
    return i.intersection(r);
  }, t.union = function(r) {
    if (Un(r) && !de(r))
      return r.union(this);
    var i = new Set(this);
    return i.union(r);
  }, t.difference = function(r) {
    return new Set(this).difference(r);
  }, t.symmetricDifference = function(r) {
    if (Un(r) && !de(r))
      return r.symmetricDifference(this);
    var i = new Set(this);
    return i.symmetricDifference(r);
  }, t.isSubsetOf = function(r) {
    return new Set(this).isSubsetOf(r);
  }, t.isSupersetOf = function(r) {
    return new Set(this).isSupersetOf(r);
  }, t.isDisjointFrom = function(r) {
    if (Un(r) && !de(r))
      return r.isDisjointFrom(this);
    var i = new Set(this);
    return i.isDisjointFrom(r);
  }, t.replace = function(r) {
    var i = this;
    return de(r) && (r = new Set(r)), ln(function() {
      Array.isArray(r) ? (i.clear(), r.forEach(function(s) {
        return i.add(s);
      })) : Un(r) ? (i.clear(), r.forEach(function(s) {
        return i.add(s);
      })) : r != null && E("Cannot initialize set from " + r);
    }), this;
  }, t.observe_ = function(r, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support fireImmediately=true in combination with sets."), fa(this, r);
  }, t.intercept_ = function(r) {
    return ua(this, r);
  }, t.toJSON = function() {
    return Array.from(this);
  }, t.toString = function() {
    return "[object ObservableSet]";
  }, t[Symbol.iterator] = function() {
    return this.values();
  }, ys(e, [{
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
}(), de = /* @__PURE__ */ Pr("ObservableSet", Qp);
function vv(e) {
  return e[Symbol.toStringTag] = "SetIterator", nd(e);
}
var gv = /* @__PURE__ */ Object.create(null), yv = "remove", wl = /* @__PURE__ */ function() {
  function e(n, r, i, s) {
    r === void 0 && (r = /* @__PURE__ */ new Map()), s === void 0 && (s = CF), this.target_ = void 0, this.values_ = void 0, this.name_ = void 0, this.defaultAnnotation_ = void 0, this.keysAtom_ = void 0, this.changeListeners_ = void 0, this.interceptors_ = void 0, this.proxy_ = void 0, this.isPlainObject_ = void 0, this.appliedAnnotations_ = void 0, this.pendingKeys_ = void 0, this.target_ = n, this.values_ = r, this.name_ = i, this.defaultAnnotation_ = s, this.keysAtom_ = new Nr(process.env.NODE_ENV !== "production" ? this.name_ + ".keys" : "ObservableObject.keys"), this.isPlainObject_ = it(this.target_), process.env.NODE_ENV !== "production" && !WO(this.defaultAnnotation_) && E("defaultAnnotation must be valid annotation"), process.env.NODE_ENV !== "production" && (this.appliedAnnotations_ = {});
  }
  var t = e.prototype;
  return t.getObservablePropValue_ = function(r) {
    return this.values_.get(r).get();
  }, t.setObservablePropValue_ = function(r, i) {
    var s = this.values_.get(r);
    if (s instanceof kt)
      return s.set(i), !0;
    if (Mt(this)) {
      var o = It(this, {
        type: Xt,
        object: this.proxy_ || this.target_,
        name: r,
        newValue: i
      });
      if (!o)
        return null;
      i = o.newValue;
    }
    if (i = s.prepareNewValue_(i), i !== O.UNCHANGED) {
      var a = en(this), u = process.env.NODE_ENV !== "production" && Re(), f = a || u ? {
        type: Xt,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        oldValue: s.value_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && u && bt(f), s.setNewValue_(i), a && tn(this, f), process.env.NODE_ENV !== "production" && u && mt();
    }
    return !0;
  }, t.get_ = function(r) {
    return O.trackingDerivation && !yt(this.target_, r) && this.has_(r), this.target_[r];
  }, t.set_ = function(r, i, s) {
    return s === void 0 && (s = !1), yt(this.target_, r) ? this.values_.has(r) ? this.setObservablePropValue_(r, i) : s ? Reflect.set(this.target_, r, i) : (this.target_[r] = i, !0) : this.extend_(r, {
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
    return i || (i = new cr(r in this.target_, Cf, process.env.NODE_ENV !== "production" ? this.name_ + "." + hl(r) + "?" : "ObservableObject.key?", !1), this.pendingKeys_.set(r, i)), i.get();
  }, t.make_ = function(r, i) {
    if (i === !0 && (i = this.defaultAnnotation_), i !== !1) {
      if (wv(this, i, r), !(r in this.target_)) {
        var s;
        if ((s = this.target_[et]) != null && s[r])
          return;
        E(1, i.annotationType_, this.name_ + "." + r.toString());
      }
      for (var o = this.target_; o && o !== na; ) {
        var a = pu(o, r);
        if (a) {
          var u = i.make_(this, r, a, o);
          if (u === 0)
            return;
          if (u === 1)
            break;
        }
        o = Object.getPrototypeOf(o);
      }
      mv(this, i, r);
    }
  }, t.extend_ = function(r, i, s, o) {
    if (o === void 0 && (o = !1), s === !0 && (s = this.defaultAnnotation_), s === !1)
      return this.defineProperty_(r, i, o);
    wv(this, s, r);
    var a = s.extend_(this, r, i, o);
    return a && mv(this, s, r), a;
  }, t.defineProperty_ = function(r, i, s) {
    s === void 0 && (s = !1), dn(this.keysAtom_);
    try {
      tt();
      var o = this.delete_(r);
      if (!o)
        return o;
      if (Mt(this)) {
        var a = It(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: ir,
          newValue: i.value
        });
        if (!a)
          return null;
        var u = a.newValue;
        i.value !== u && (i = wn({}, i, {
          value: u
        }));
      }
      if (s) {
        if (!Reflect.defineProperty(this.target_, r, i))
          return !1;
      } else
        gn(this.target_, r, i);
      this.notifyPropertyAddition_(r, i.value);
    } finally {
      nt();
    }
    return !0;
  }, t.defineObservableProperty_ = function(r, i, s, o) {
    o === void 0 && (o = !1), dn(this.keysAtom_);
    try {
      tt();
      var a = this.delete_(r);
      if (!a)
        return a;
      if (Mt(this)) {
        var u = It(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: ir,
          newValue: i
        });
        if (!u)
          return null;
        i = u.newValue;
      }
      var f = bv(r), c = {
        configurable: O.safeDescriptors ? this.isPlainObject_ : !0,
        enumerable: !0,
        get: f.get,
        set: f.set
      };
      if (o) {
        if (!Reflect.defineProperty(this.target_, r, c))
          return !1;
      } else
        gn(this.target_, r, c);
      var l = new cr(i, s, process.env.NODE_ENV !== "production" ? this.name_ + "." + r.toString() : "ObservableObject.key", !1);
      this.values_.set(r, l), this.notifyPropertyAddition_(r, l.value_);
    } finally {
      nt();
    }
    return !0;
  }, t.defineComputedProperty_ = function(r, i, s) {
    s === void 0 && (s = !1), dn(this.keysAtom_);
    try {
      tt();
      var o = this.delete_(r);
      if (!o)
        return o;
      if (Mt(this)) {
        var a = It(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: ir,
          newValue: void 0
        });
        if (!a)
          return null;
      }
      i.name || (i.name = process.env.NODE_ENV !== "production" ? this.name_ + "." + r.toString() : "ObservableObject.key"), i.context = this.proxy_ || this.target_;
      var u = bv(r), f = {
        configurable: O.safeDescriptors ? this.isPlainObject_ : !0,
        enumerable: !1,
        get: u.get,
        set: u.set
      };
      if (s) {
        if (!Reflect.defineProperty(this.target_, r, f))
          return !1;
      } else
        gn(this.target_, r, f);
      this.values_.set(r, new kt(i)), this.notifyPropertyAddition_(r, void 0);
    } finally {
      nt();
    }
    return !0;
  }, t.delete_ = function(r, i) {
    if (i === void 0 && (i = !1), dn(this.keysAtom_), !yt(this.target_, r))
      return !0;
    if (Mt(this)) {
      var s = It(this, {
        object: this.proxy_ || this.target_,
        name: r,
        type: yv
      });
      if (!s)
        return null;
    }
    try {
      var o;
      tt();
      var a = en(this), u = process.env.NODE_ENV !== "production" && Re(), f = this.values_.get(r), c = void 0;
      if (!f && (a || u)) {
        var l;
        c = (l = pu(this.target_, r)) == null ? void 0 : l.value;
      }
      if (i) {
        if (!Reflect.deleteProperty(this.target_, r))
          return !1;
      } else
        delete this.target_[r];
      if (process.env.NODE_ENV !== "production" && delete this.appliedAnnotations_[r], f && (this.values_.delete(r), f instanceof cr && (c = f.value_), bO(f)), this.keysAtom_.reportChanged(), (o = this.pendingKeys_) == null || (o = o.get(r)) == null || o.set(r in this.target_), a || u) {
        var h = {
          type: yv,
          observableKind: "object",
          object: this.proxy_ || this.target_,
          debugObjectName: this.name_,
          oldValue: c,
          name: r
        };
        process.env.NODE_ENV !== "production" && u && bt(h), a && tn(this, h), process.env.NODE_ENV !== "production" && u && mt();
      }
    } finally {
      nt();
    }
    return !0;
  }, t.observe_ = function(r, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support the fire immediately property for observable objects."), fa(this, r);
  }, t.intercept_ = function(r) {
    return ua(this, r);
  }, t.notifyPropertyAddition_ = function(r, i) {
    var s, o = en(this), a = process.env.NODE_ENV !== "production" && Re();
    if (o || a) {
      var u = o || a ? {
        type: ir,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && a && bt(u), o && tn(this, u), process.env.NODE_ENV !== "production" && a && mt();
    }
    (s = this.pendingKeys_) == null || (s = s.get(r)) == null || s.set(!0), this.keysAtom_.reportChanged();
  }, t.ownKeys_ = function() {
    return this.keysAtom_.reportObserved(), Ji(this.target_);
  }, t.keys_ = function() {
    return this.keysAtom_.reportObserved(), Object.keys(this.target_);
  }, e;
}();
function _i(e, t) {
  var n;
  if (process.env.NODE_ENV !== "production" && t && _e(e) && E("Options can't be provided for already observable objects."), yt(e, T))
    return process.env.NODE_ENV !== "production" && !(On(e) instanceof wl) && E("Cannot convert '" + vo(e) + `' into observable object:
The target is already observable of different type.
Extending builtins is not supported.`), e;
  process.env.NODE_ENV !== "production" && !Object.isExtensible(e) && E("Cannot make the designated object observable; it is not extensible");
  var r = (n = t?.name) != null ? n : process.env.NODE_ENV !== "production" ? (it(e) ? "ObservableObject" : e.constructor.name) + "@" + Rt() : "ObservableObject", i = new wl(e, /* @__PURE__ */ new Map(), String(r), GF(t));
  return ra(e, T, i), e;
}
var lz = /* @__PURE__ */ Pr("ObservableObjectAdministration", wl);
function bv(e) {
  return gv[e] || (gv[e] = {
    get: function() {
      return this[T].getObservablePropValue_(e);
    },
    set: function(n) {
      return this[T].setObservablePropValue_(e, n);
    }
  });
}
function _e(e) {
  return If(e) ? lz(e[T]) : !1;
}
function mv(e, t, n) {
  var r;
  process.env.NODE_ENV !== "production" && (e.appliedAnnotations_[n] = t), (r = e.target_[et]) == null || delete r[n];
}
function wv(e, t, n) {
  if (process.env.NODE_ENV !== "production" && !WO(t) && E("Cannot annotate '" + e.name_ + "." + n.toString() + "': Invalid annotation."), process.env.NODE_ENV !== "production" && !_u(t) && yt(e.appliedAnnotations_, n)) {
    var r = e.name_ + "." + n.toString(), i = e.appliedAnnotations_[n].annotationType_, s = t.annotationType_;
    E("Cannot apply '" + s + "' to '" + r + "':" + (`
The field is already annotated with '` + i + "'.") + `
Re-annotating fields is not allowed.
Use 'override' annotation for methods overridden by subclass.`);
  }
}
var hz = /* @__PURE__ */ kO(0), pz = /* @__PURE__ */ function() {
  var e = !1, t = {};
  return Object.defineProperty(t, "0", {
    set: function() {
      e = !0;
    }
  }), Object.create(t)[0] = 1, e === !1;
}(), mc = 0, UO = function() {
};
function dz(e, t) {
  Object.setPrototypeOf ? Object.setPrototypeOf(e.prototype, t) : e.prototype.__proto__ !== void 0 ? e.prototype.__proto__ = t : e.prototype = t;
}
dz(UO, Array.prototype);
var ed = /* @__PURE__ */ function(e) {
  function t(r, i, s, o) {
    var a;
    return s === void 0 && (s = process.env.NODE_ENV !== "production" ? "ObservableArray@" + Rt() : "ObservableArray"), o === void 0 && (o = !1), a = e.call(this) || this, $r(function() {
      var u = new Jp(s, i, o, !0);
      u.proxy_ = a, JA(a, T, u), r && r.length && a.spliceWithArray(0, 0, r), pz && Object.defineProperty(a, "0", hz);
    }), a;
  }
  eO(t, e);
  var n = t.prototype;
  return n.concat = function() {
    this[T].atom_.reportObserved();
    for (var i = arguments.length, s = new Array(i), o = 0; o < i; o++)
      s[o] = arguments[o];
    return Array.prototype.concat.apply(
      this.slice(),
      //@ts-ignore
      s.map(function(a) {
        return Ze(a) ? a.slice() : a;
      })
    );
  }, n[Symbol.iterator] = function() {
    var r = this, i = 0;
    return nd({
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
  }, ys(t, [{
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
}(UO);
Object.entries(bu).forEach(function(e) {
  var t = e[0], n = e[1];
  t !== "concat" && ra(ed.prototype, t, n);
});
function kO(e) {
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
function _z(e) {
  gn(ed.prototype, "" + e, kO(e));
}
function VO(e) {
  if (e > mc) {
    for (var t = mc; t < e + 100; t++)
      _z(t);
    mc = e;
  }
}
VO(1e3);
function vz(e, t, n) {
  return new ed(e, t, n);
}
function sn(e, t) {
  if (typeof e == "object" && e !== null) {
    if (Ze(e))
      return t !== void 0 && E(23), e[T].atom_;
    if (de(e))
      return e.atom_;
    if (ye(e)) {
      if (t === void 0)
        return e.keysAtom_;
      var n = e.data_.get(t) || e.hasMap_.get(t);
      return n || E(25, t, vo(e)), n;
    }
    if (_e(e)) {
      if (!t)
        return E(26);
      var r = e[T].values_.get(t);
      return r || E(27, t, vo(e)), r;
    }
    if (Up(e) || Xr(e) || yu(e))
      return e;
  } else if (ae(e) && yu(e[T]))
    return e[T];
  E(28);
}
function On(e, t) {
  if (e || E(29), t !== void 0)
    return On(sn(e, t));
  if (Up(e) || Xr(e) || yu(e) || ye(e) || de(e))
    return e;
  if (e[T])
    return e[T];
  E(24, e);
}
function vo(e, t) {
  var n;
  if (t !== void 0)
    n = sn(e, t);
  else {
    if (Zr(e))
      return e.name;
    _e(e) || ye(e) || de(e) ? n = On(e) : n = sn(e);
  }
  return n.name_;
}
function $r(e) {
  var t = di(), n = jf(!0);
  tt();
  try {
    return e();
  } finally {
    nt(), Ff(n), Wn(t);
  }
}
var Av = na.toString;
function td(e, t, n) {
  return n === void 0 && (n = -1), Al(e, t, n);
}
function Al(e, t, n, r, i) {
  if (e === t)
    return e !== 0 || 1 / e === 1 / t;
  if (e == null || t == null)
    return !1;
  if (e !== e)
    return t !== t;
  var s = typeof e;
  if (s !== "function" && s !== "object" && typeof t != "object")
    return !1;
  var o = Av.call(e);
  if (o !== Av.call(t))
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
  e = Ov(e), t = Ov(t);
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
      if (!Al(e[c], t[c], n - 1, r, i))
        return !1;
  } else {
    var l = Object.keys(e), h = l.length;
    if (Object.keys(t).length !== h)
      return !1;
    for (var d = 0; d < h; d++) {
      var _ = l[d];
      if (!(yt(t, _) && Al(e[_], t[_], n - 1, r, i)))
        return !1;
    }
  }
  return r.pop(), i.pop(), !0;
}
function Ov(e) {
  return Ze(e) ? e.slice() : gs(e) || ye(e) || Un(e) || de(e) ? Array.from(e.entries()) : e;
}
var Ev, gz = ((Ev = Mf().Iterator) == null ? void 0 : Ev.prototype) || {};
function nd(e) {
  return e[Symbol.iterator] = yz, Object.assign(Object.create(gz), e);
}
function yz() {
  return this;
}
function WO(e) {
  return (
    // Can be function
    e instanceof Object && typeof e.annotationType_ == "string" && ae(e.make_) && ae(e.extend_)
  );
}
["Symbol", "Map", "Set"].forEach(function(e) {
  var t = Mf();
  typeof t[e] > "u" && E("MobX requires global '" + e + "' to be available or polyfilled");
});
typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ == "object" && __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
  spy: OO,
  extras: {
    getDebugName: vo
  },
  $mobx: T
});
const j4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $mobx: T,
  FlowCancellationError: zf,
  ObservableMap: Zp,
  ObservableSet: Qp,
  Reaction: An,
  _allowStateChanges: Wp,
  _allowStateChangesInsideComputed: hv,
  _allowStateReadsEnd: Di,
  _allowStateReadsStart: Bf,
  _autoAction: Zi,
  _endAction: hO,
  _getAdministration: On,
  _getGlobalState: oB,
  _interceptReads: CB,
  _isComputingDerivation: eB,
  _resetGlobalState: aB,
  _startAction: lO,
  action: rr,
  autorun: Kp,
  comparer: Kr,
  computed: aa,
  configure: RB,
  createAtom: kp,
  defineProperty: GB,
  entries: VB,
  extendObservable: Xp,
  flow: Qr,
  flowResult: DB,
  get: qB,
  getAtom: sn,
  getDebugName: vo,
  getDependencyTree: NO,
  getObserverTree: PB,
  has: LO,
  intercept: LB,
  isAction: Zr,
  isBoxedObservable: qp,
  isComputed: BB,
  isComputedProp: zB,
  isFlow: Qi,
  isFlowCancellationError: MB,
  isObservable: ei,
  isObservableArray: Ze,
  isObservableMap: ye,
  isObservableObject: _e,
  isObservableProp: UB,
  isObservableSet: de,
  keys: _o,
  makeAutoObservable: rz,
  makeObservable: nz,
  observable: we,
  observe: HB,
  onBecomeObserved: RO,
  onBecomeUnobserved: Yp,
  onReactionError: pB,
  override: dF,
  ownKeys: jO,
  reaction: AB,
  remove: WB,
  runInAction: hv,
  set: CO,
  spy: OO,
  toJS: XB,
  trace: FO,
  transaction: ln,
  untracked: Gp,
  values: kB,
  when: ZB
}, Symbol.toStringTag, { value: "Module" }));
var L = /* @__PURE__ */ ((e) => (e[e.None = 0] = "None", e[e.Mutable = 1] = "Mutable", e[e.Watching = 2] = "Watching", e[e.RecursedCheck = 4] = "RecursedCheck", e[e.Recursed = 8] = "Recursed", e[e.Dirty = 16] = "Dirty", e[e.Pending = 32] = "Pending", e))(L || {});
function bz({
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
let Uf = 0, ca = 0, Na = 0, wu = 0, on;
const Fr = [], {
  link: kf,
  unlink: rd,
  propagate: qO,
  checkDirty: GO,
  shallowPropagate: id
} = bz({
  update(e) {
    return e.depsTail !== void 0 ? HO(e) : KO(e);
  },
  notify(e) {
    let t = wu, n = t;
    do
      if (e.flags &= ~L.Watching, Fr[t++] = e, e = e.subs?.sub, e === void 0 || !(e.flags & L.Watching))
        break;
    while (!0);
    for (wu = t; n < --t; ) {
      const r = Fr[n];
      Fr[n++] = Fr[t], Fr[t] = r;
    }
  },
  unwatched(e) {
    e.flags & L.Mutable ? e.depsTail !== void 0 && (e.depsTail = void 0, e.flags = L.Mutable | L.Dirty, Wf(e)) : Vf.call(e);
  }
});
function mz() {
  return on;
}
function vi(e) {
  const t = on;
  return on = e, t;
}
function wz() {
  return ca;
}
function Az() {
  ++ca;
}
function Oz() {
  --ca || sd();
}
function Ez(e) {
  return e.name === "bound " + XO.name;
}
function Sz(e) {
  return e.name === "bound " + YO.name;
}
function xz(e) {
  return e.name === "bound " + JO.name;
}
function Tz(e) {
  return e.name === "bound " + Vf.name;
}
function Rz(e) {
  return XO.bind({
    currentValue: e,
    pendingValue: e,
    subs: void 0,
    subsTail: void 0,
    flags: L.Mutable
  });
}
function Pz(e) {
  return YO.bind({
    value: void 0,
    subs: void 0,
    subsTail: void 0,
    deps: void 0,
    depsTail: void 0,
    flags: L.None,
    getter: e
  });
}
function Nz(e) {
  const t = {
    fn: e,
    subs: void 0,
    subsTail: void 0,
    deps: void 0,
    depsTail: void 0,
    flags: L.Watching | L.RecursedCheck
  }, n = vi(t);
  n !== void 0 && kf(t, n, 0);
  try {
    t.fn();
  } finally {
    on = n, t.flags &= ~L.RecursedCheck;
  }
  return JO.bind(t);
}
function $z(e) {
  const t = {
    deps: void 0,
    depsTail: void 0,
    subs: void 0,
    subsTail: void 0,
    flags: L.None
  }, n = vi(t);
  n !== void 0 && kf(t, n, 0);
  try {
    e();
  } finally {
    on = n;
  }
  return Vf.bind(t);
}
function Mz(e) {
  const t = {
    deps: void 0,
    depsTail: void 0,
    flags: L.Watching
  }, n = vi(t);
  try {
    e();
  } finally {
    for (on = n; t.deps !== void 0; ) {
      const r = t.deps, i = r.dep;
      rd(r, t), i.subs !== void 0 && (qO(i.subs), id(i.subs));
    }
    ca || sd();
  }
}
function HO(e) {
  ++Uf, e.depsTail = void 0, e.flags = L.Mutable | L.RecursedCheck;
  const t = vi(e);
  try {
    const n = e.value;
    return n !== (e.value = e.getter(n));
  } finally {
    on = t, e.flags &= ~L.RecursedCheck, Wf(e);
  }
}
function KO(e) {
  return e.flags = L.Mutable, e.currentValue !== (e.currentValue = e.pendingValue);
}
function Iz(e) {
  const t = e.flags;
  if (t & L.Dirty || t & L.Pending && GO(e.deps, e)) {
    ++Uf, e.depsTail = void 0, e.flags = L.Watching | L.RecursedCheck;
    const n = vi(e);
    try {
      e.fn();
    } finally {
      on = n, e.flags &= ~L.RecursedCheck, Wf(e);
    }
  } else
    e.flags = L.Watching;
}
function sd() {
  for (; Na < wu; ) {
    const e = Fr[Na];
    Fr[Na++] = void 0, Iz(e);
  }
  Na = 0, wu = 0;
}
function YO() {
  const e = this.flags;
  if (e & L.Dirty || e & L.Pending && (GO(this.deps, this) || (this.flags = e & ~L.Pending, !1))) {
    if (HO(this)) {
      const n = this.subs;
      n !== void 0 && id(n);
    }
  } else if (!e) {
    this.flags = L.Mutable | L.RecursedCheck;
    const n = vi(this);
    try {
      this.value = this.getter();
    } finally {
      on = n, this.flags &= ~L.RecursedCheck;
    }
  }
  const t = on;
  return t !== void 0 && kf(this, t, Uf), this.value;
}
function XO(...e) {
  if (e.length) {
    if (this.pendingValue !== (this.pendingValue = e[0])) {
      this.flags = L.Mutable | L.Dirty;
      const t = this.subs;
      t !== void 0 && (qO(t), ca || sd());
    }
  } else {
    if (this.flags & L.Dirty && KO(this)) {
      const n = this.subs;
      n !== void 0 && id(n);
    }
    let t = on;
    for (; t !== void 0; ) {
      if (t.flags & (L.Mutable | L.Watching)) {
        kf(this, t, Uf);
        break;
      }
      t = t.subs?.sub;
    }
    return this.currentValue;
  }
}
function JO() {
  Vf.call(this);
}
function Vf() {
  this.depsTail = void 0, this.flags = L.None, Wf(this);
  const e = this.subs;
  e !== void 0 && rd(e);
}
function Wf(e) {
  const t = e.depsTail;
  let n = t !== void 0 ? t.nextDep : e.deps;
  for (; n !== void 0; )
    n = rd(n, e);
}
const F4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  computed: Pz,
  effect: Nz,
  effectScope: $z,
  endBatch: Oz,
  getActiveSub: mz,
  getBatchDepth: wz,
  isComputed: Sz,
  isEffect: xz,
  isEffectScope: Tz,
  isSignal: Ez,
  setActiveSub: vi,
  signal: Rz,
  startBatch: Az,
  trigger: Mz
}, Symbol.toStringTag, { value: "Module" }));
function ZO(e, t) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function $n(e, t, n) {
  return e.context ? e.callback(n, ...t) : e.callback(...t);
}
class Dz {
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
class Mn {
  taps;
  interceptions;
  constructor() {
    this.taps = [], this.interceptions = new Dz();
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
        if (a.has(u.name) && a.delete(u.name), u.before && ZO(s.name, u.before))
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
class Cz extends Mn {
  call(...t) {
    if (!this.isUsed())
      return;
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      this.taps.forEach((r) => {
        $n(r, t, n);
      });
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
    this.interceptions.done();
  }
}
class Lz extends Mn {
  call(...t) {
    if (!this.isUsed())
      return;
    const n = {};
    this.interceptions.call(n, ...t);
    for (let r = 0; r < this.taps.length; r += 1) {
      const i = $n(this.taps[r], t, n);
      if (i !== void 0)
        return this.interceptions.result(i), i;
    }
    this.interceptions.done();
  }
}
class jz extends Mn {
  call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    let [r, ...i] = t;
    for (let s = 0; s < this.taps.length; s += 1) {
      const o = $n(this.taps[s], [r, ...i], n);
      o !== void 0 && (r = o);
    }
    return this.interceptions.result(r), r;
  }
}
class Fz extends Mn {
  call(...t) {
    let n = !1;
    const r = {};
    this.interceptions.call(r, ...t);
    try {
      for (; n !== !0; ) {
        n = !0, this.interceptions.loop(...t);
        for (let i = 0; i < this.taps.length; i += 1)
          if ($n(this.taps[i], t, r) !== void 0) {
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
class Bz extends Mn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t), await Promise.allSettled(this.taps.map((r) => $n(r, t, n))), this.interceptions.done();
  }
}
class zz extends Mn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      const r = await Promise.race(
        this.taps.map((i) => $n(i, t, n))
      );
      return this.interceptions.result(r), r;
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
  }
}
class Uz extends Mn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      for (let r = 0; r < this.taps.length; r += 1)
        await $n(this.taps[r], t, n);
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
    this.interceptions.done();
  }
}
class kz extends Mn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      for (let r = 0; r < this.taps.length; r += 1) {
        const i = await $n(this.taps[r], t, n);
        if (i !== void 0)
          return this.interceptions.result(i), i;
      }
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
    this.interceptions.done();
  }
}
class Vz extends Mn {
  async call(...t) {
    let [n, ...r] = t;
    const i = {};
    this.interceptions.call(i, ...t);
    try {
      for (let s = 0; s < this.taps.length; s += 1) {
        const o = await $n(
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
class Wz extends Mn {
  async call(...t) {
    let n = !1;
    const r = {};
    this.interceptions.call(r, ...t);
    try {
      for (; n !== !0; ) {
        n = !0, this.interceptions.loop(...t);
        for (let i = 0; i < this.taps.length; i += 1)
          if (await $n(this.taps[i], t, r) !== void 0) {
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
const B4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AsyncParallelBailHook: zz,
  AsyncParallelHook: Bz,
  AsyncSeriesBailHook: kz,
  AsyncSeriesHook: Uz,
  AsyncSeriesLoopHook: Wz,
  AsyncSeriesWaterfallHook: Vz,
  SyncBailHook: Lz,
  SyncHook: Cz,
  SyncLoopHook: Fz,
  SyncWaterfallHook: jz,
  equalToOrIn: ZO
}, Symbol.toStringTag, { value: "Module" }));
function Ol(e, t) {
  if (e === t) return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    if (e.constructor !== t.constructor) return !1;
    var n, r, i;
    if (Array.isArray(e)) {
      if (n = e.length, n != t.length) return !1;
      for (r = n; r-- !== 0; )
        if (!Ol(e[r], t[r])) return !1;
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
      if (!Ol(e[s], t[s])) return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
class qz {
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
    return Ol(t, n);
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
class QO {
  static create(t, n) {
    return new QO(t, n);
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
    this.addOptionFromInstance(t, new qz(this.context, n));
  }
}
function z4(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce(
    (t, n) => (...r) => t(n(...r))
  );
}
function Gz(e) {
  return Hz(e) && !Kz(e);
}
function Hz(e) {
  return !!e && typeof e == "object";
}
function Kz(e) {
  var t = Object.prototype.toString.call(e);
  return t === "[object RegExp]" || t === "[object Date]" || Jz(e);
}
var Yz = typeof Symbol == "function" && Symbol.for, Xz = Yz ? Symbol.for("react.element") : 60103;
function Jz(e) {
  return e.$$typeof === Xz;
}
var Zz = Gz;
function Qz(e) {
  return Array.isArray(e) ? [] : {};
}
function go(e, t) {
  return t.clone !== !1 && t.isMergeableObject(e) ? yo(Qz(e), e, t) : e;
}
function e5(e, t, n) {
  return e.concat(t).map(function(r) {
    return go(r, n);
  });
}
function t5(e, t) {
  if (!t.customMerge)
    return yo;
  var n = t.customMerge(e);
  return typeof n == "function" ? n : yo;
}
function n5(e) {
  return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(e).filter(function(t) {
    return Object.propertyIsEnumerable.call(e, t);
  }) : [];
}
function Sv(e) {
  return Object.keys(e).concat(n5(e));
}
function eE(e, t) {
  try {
    return t in e;
  } catch {
    return !1;
  }
}
function r5(e, t) {
  return eE(e, t) && !(Object.hasOwnProperty.call(e, t) && Object.propertyIsEnumerable.call(e, t));
}
function i5(e, t, n) {
  var r = {};
  return n.isMergeableObject(e) && Sv(e).forEach(function(i) {
    r[i] = go(e[i], n);
  }), Sv(t).forEach(function(i) {
    r5(e, i) || (eE(e, i) && n.isMergeableObject(t[i]) ? r[i] = t5(i, n)(e[i], t[i], n) : r[i] = go(t[i], n));
  }), r;
}
function yo(e, t, n) {
  n = n || {}, n.arrayMerge = n.arrayMerge || e5, n.isMergeableObject = n.isMergeableObject || Zz, n.cloneUnlessOtherwiseSpecified = go;
  var r = Array.isArray(t), i = Array.isArray(e), s = r === i;
  return s ? r ? n.arrayMerge?.(e, t, n) : i5(e, t, n) : go(t, n);
}
function s5(e, t) {
  if (!Array.isArray(e))
    throw new Error("first argument should be an array");
  return e.reduce(function(n, r) {
    return yo(n, r, t);
  }, {});
}
yo.all = s5;
function mi(e, t = 0, n = 1) {
  return Math.min(Math.max(e, t), n);
}
function o5(e, t, n) {
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
function xv(e, t, n) {
  let r, i, s;
  if (t == 0)
    r = i = s = n;
  else {
    const o = (f, c, l) => (l < 0 && (l += 1), l > 1 && (l -= 1), l < 0.16666666666666666 ? f + (c - f) * 6 * l : l < 0.5 ? c : l < 0.6666666666666666 ? f + (c - f) * (0.6666666666666666 - l) * 6 : f), a = n < 0.5 ? n * (1 + t) : n + t - n * t, u = 2 * n - a;
    r = o(u, a, e + 1 / 3), i = o(u, a, e), s = o(u, a, e - 1 / 3);
  }
  return { r: r * 255, g: i * 255, b: s * 255 };
}
function U4(e, t, n) {
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
function a5(e, t, n) {
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
function k4(e, t, n) {
  const r = n + t * Math.min(n, 1 - n), i = r === 0 ? 0 : 2 * (1 - n / r);
  return { h: e, s: i, v: r };
}
function V4(e, t, n) {
  const r = (2 - t) * n / 2, i = t === 0 ? t : r <= 1 ? t * n / (2 - t * n) : t * n / (2 - t);
  return { h: e, s: i, l: r };
}
function u5(e) {
  typeof e == "string" && (e = e.replace("#", ""), e = e.length === 3 ? e.replace(/(\w)/g, "$1$1") : e, e = parseInt("0x" + e, 16));
  const t = e, n = t >> 16 & 255, r = t >> 8 & 255, i = t & 255;
  return { r: n, g: r, b: i };
}
function f5(e, t, n) {
  const r = e.r + (t.r - e.r) * n, i = e.g + (t.g - e.g) * n, s = e.b + (t.b - e.b) * n;
  return { r, g: i, b: s };
}
const Tv = {
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
class ft {
  static Transparent = ft.fromRGBA(0, 0, 0, 0);
  static BLACK = ft.fromRGB(0, 0, 0);
  static WHITE = ft.fromRGB(255, 255, 255);
  static isColor(t) {
    return typeof t == "string" || typeof t == "number" || t instanceof ft;
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
      return this.fromRGB(u5(t));
    if (n && Tv[t]) {
      const r = Tv[t];
      return this.fromRGB(r[0] * 255 >> 0, r[1] * 255 >> 0, r[2] * 255 >> 0);
    } else if (typeof t == "object" && t !== null)
      return this.fromRGB(t);
    return this.fromRGB(0, 0, 0);
  }
  static fromRGB(t, n, r) {
    return t !== null && typeof t == "object" ? new ft(t.r, t.g, t.b) : new ft(t, n, r);
  }
  static fromRGBA(t, n, r, i) {
    return t !== null && typeof t == "object" ? new ft(t.r, t.g, t.b, n) : new ft(t, n, r, i);
  }
  static fromHSL(t, n, r) {
    const { r: i, g: s, b: o } = xv(t, n, r);
    return new ft(i, s, o);
  }
  static fromHSV(t, n, r) {
    const { r: i, g: s, b: o } = a5(t, n, r);
    return new ft(i, s, o);
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
    return ft.fromRGB(0, 0, 0).copy(this);
  }
  setRGB(t, n, r) {
    return this._r = t, this._g = n, this._b = r, this;
  }
  normalize() {
    return this.r = mi(this._r / 255, 0, 1), this.g = mi(this._g / 255, 0, 1), this.b = mi(this._b / 255, 0, 1), this;
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
    const { r: i, g: s, b: o } = f5(t, n, r);
    return new ft(i, s, o);
  }
  setRBG(t, n, r) {
    return this.r = t, this.g = n, this.b = r, this;
  }
  setRGBColor(t) {
    return this.r = t.r, this.g = t.g, this.b = t.b, this;
  }
  // 变亮
  brighten(t) {
    const { h: n, s: r, l: i } = o5(this.r, this.g, this.b);
    return this.setRGBColor(xv(n, r, i * (1 + t)));
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
    return this.r = mi(this.r, t, n), this.g = mi(this.g, t, n), this.b = mi(this.b, t, n), this;
  }
  toCssRGB() {
    return `rgb(${Math.round(this.r)},${Math.round(this.g)},${Math.round(this.b)})`;
  }
}
const qf = 3, c5 = {
  grad: 360 / 400,
  turn: 360,
  rad: 360 / (Math.PI * 2)
}, qn = (e) => typeof e == "string" ? e.length > 0 : typeof e == "number", Oe = (e, t = 0, n = Math.pow(10, t)) => Math.round(n * e) / n + 0, Ct = (e, t = 0, n = 1) => e > n ? n : e > t ? e : t, tE = (e) => (e = isFinite(e) ? e % 360 : 0, e > 0 ? e : e + 360), l5 = (e, t = "deg") => Number(e) * (c5[t] || 1), nE = (e) => ({
  r: Ct(e.r, 0, 255),
  g: Ct(e.g, 0, 255),
  b: Ct(e.b, 0, 255),
  a: Ct(e.a)
}), od = (e) => ({
  r: Oe(e.r),
  g: Oe(e.g),
  b: Oe(e.b),
  a: Oe(e.a, qf)
}), h5 = ({ r: e, g: t, b: n, a: r = 1 }) => !qn(e) || !qn(t) || !qn(n) ? null : nE({
  r: Number(e),
  g: Number(t),
  b: Number(n),
  a: Number(r)
}), p5 = /^#([0-9a-f]{3,8})$/i, d5 = (e) => {
  const t = p5.exec(e);
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
}, $a = (e) => {
  const t = e.toString(16);
  return t.length < 2 ? "0" + t : t;
}, _5 = (e) => {
  const { r: t, g: n, b: r, a: i } = od(e), s = i < 1 ? $a(Oe(i * 255)) : "";
  return "#" + $a(t) + $a(n) + $a(r) + s;
}, v5 = (e) => ({
  h: tE(e.h),
  s: Ct(e.s, 0, 100),
  v: Ct(e.v, 0, 100),
  a: Ct(e.a)
}), g5 = (e) => ({
  h: Oe(e.h),
  s: Oe(e.s),
  v: Oe(e.v),
  a: Oe(e.a, qf)
}), y5 = ({ h: e, s: t, v: n, a: r = 1 }) => {
  if (!qn(e) || !qn(t) || !qn(n)) return null;
  const i = v5({
    h: Number(e),
    s: Number(t),
    v: Number(n),
    a: Number(r)
  });
  return iE(i);
}, rE = ({ r: e, g: t, b: n, a: r }) => {
  const i = Math.max(e, t, n), s = i - Math.min(e, t, n), o = s ? i === e ? (t - n) / s : i === t ? 2 + (n - e) / s : 4 + (e - t) / s : 0;
  return {
    h: 60 * (o < 0 ? o + 6 : o),
    s: i ? s / i * 100 : 0,
    v: i / 255 * 100,
    a: r
  };
}, iE = ({ h: e, s: t, v: n, a: r }) => {
  e = e / 360 * 6, t = t / 100, n = n / 100;
  const i = Math.floor(e), s = n * (1 - t), o = n * (1 - (e - i) * t), a = n * (1 - (1 - e + i) * t), u = i % 6;
  return {
    r: [n, o, s, s, a, n][u] * 255,
    g: [a, n, n, o, s, s][u] * 255,
    b: [s, s, a, n, n, o][u] * 255,
    a: r
  };
}, sE = (e) => ({
  h: tE(e.h),
  s: Ct(e.s, 0, 100),
  l: Ct(e.l, 0, 100),
  a: Ct(e.a)
}), oE = (e) => ({
  h: Oe(e.h),
  s: Oe(e.s),
  l: Oe(e.l),
  a: Oe(e.a, qf)
}), b5 = ({ h: e, s: t, l: n, a: r = 1 }) => {
  if (!qn(e) || !qn(t) || !qn(n)) return null;
  const i = sE({
    h: Number(e),
    s: Number(t),
    l: Number(n),
    a: Number(r)
  });
  return aE(i);
}, m5 = ({ h: e, s: t, l: n, a: r }) => (t *= (n < 50 ? n : 100 - n) / 100, {
  h: e,
  s: t > 0 ? 2 * t / (n + t) * 100 : 0,
  v: n + t,
  a: r
}), w5 = ({ h: e, s: t, v: n, a: r }) => {
  const i = (200 - t) * n / 100;
  return {
    h: e,
    s: i > 0 && i < 200 ? t * n / 100 / (i <= 100 ? i : 200 - i) * 100 : 0,
    l: i / 2,
    a: r
  };
}, aE = (e) => iE(m5(e)), bo = (e) => w5(rE(e)), A5 = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, O5 = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, E5 = (e) => {
  const t = A5.exec(e) || O5.exec(e);
  if (!t) return null;
  const n = sE({
    h: l5(t[1], t[2]),
    s: Number(t[3]),
    l: Number(t[4]),
    a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1)
  });
  return aE(n);
}, S5 = (e) => {
  const { h: t, s: n, l: r, a: i } = oE(bo(e));
  return i < 1 ? `hsla(${t}, ${n}%, ${r}%, ${i})` : `hsl(${t}, ${n}%, ${r}%)`;
}, x5 = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, T5 = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, R5 = (e) => {
  const t = x5.exec(e) || T5.exec(e);
  return !t || t[2] !== t[4] || t[4] !== t[6] ? null : nE({
    r: Number(t[1]) / (t[2] ? 100 / 255 : 1),
    g: Number(t[3]) / (t[4] ? 100 / 255 : 1),
    b: Number(t[5]) / (t[6] ? 100 / 255 : 1),
    a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1)
  });
}, P5 = (e) => {
  const { r: t, g: n, b: r, a: i } = od(e);
  return i < 1 ? `rgba(${t}, ${n}, ${r}, ${i})` : `rgb(${t}, ${n}, ${r})`;
}, El = {
  string: [
    [d5, "hex"],
    [R5, "rgb"],
    [E5, "hsl"]
  ],
  object: [
    [h5, "rgb"],
    [b5, "hsl"],
    [y5, "hsv"]
  ]
}, Rv = (e, t) => {
  for (let n = 0; n < t.length; n++) {
    const r = t[n][0](e);
    if (r) return [r, t[n][1]];
  }
  return [null, void 0];
}, uE = (e) => typeof e == "string" ? Rv(e.trim(), El.string) : typeof e == "object" && e !== null ? Rv(e, El.object) : [null, void 0], N5 = (e) => uE(e)[1], $5 = (e, t) => ({
  r: e.r,
  g: e.g,
  b: e.b,
  a: t
}), wc = (e, t) => {
  const n = bo(e);
  return {
    h: n.h,
    s: Ct(n.s + t * 100, 0, 100),
    l: n.l,
    a: n.a
  };
}, Ac = (e) => (e.r * 299 + e.g * 587 + e.b * 114) / 1e3 / 255, Pv = (e, t) => {
  const n = bo(e);
  return {
    h: n.h,
    s: n.s,
    l: Ct(n.l + t * 100, 0, 100),
    a: n.a
  };
}, M5 = (e) => ({
  r: 255 - e.r,
  g: 255 - e.g,
  b: 255 - e.b,
  a: e.a
});
class Au {
  parsed;
  rgba;
  constructor(t) {
    this.parsed = uE(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
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
    return Oe(Ac(this.rgba), 2);
  }
  /**
   * Same as calling `brightness() < 0.5`.
   */
  isDark() {
    return Ac(this.rgba) < 0.5;
  }
  /**
   * Same as calling `brightness() >= 0.5`.
   * */
  isLight() {
    return Ac(this.rgba) >= 0.5;
  }
  /**
   * Returns the hexadecimal representation of a color.
   * When the alpha channel value of the color is less than 1,
   * it outputs #rrggbbaa format instead of #rrggbb.
   */
  toHex() {
    return _5(this.rgba);
  }
  /**
   * Converts a color to RGB color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toRgb() {
    return od(this.rgba);
  }
  /**
   * Converts a color to RGB color space and returns a string representation.
   * Outputs an alpha value only if it is less than 1.
   */
  toRgbString() {
    return P5(this.rgba);
  }
  /**
   * Converts a color to HSL color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toHsl() {
    return oE(bo(this.rgba));
  }
  /**
   * Converts a color to HSL color space and returns a string representation.
   * Always includes an alpha value from 0 to 1.
   */
  toHslString() {
    return S5(this.rgba);
  }
  /**
   * Converts a color to HSV color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toHsv() {
    return g5(rE(this.rgba));
  }
  /**
   * Creates a new instance containing an inverted (opposite) version of the color.
   */
  invert() {
    return fn(M5(this.rgba));
  }
  /**
   * Increases the HSL saturation of a color by the given amount.
   */
  saturate(t = 0.1) {
    return fn(wc(this.rgba, t));
  }
  /**
   * Decreases the HSL saturation of a color by the given amount.
   */
  desaturate(t = 0.1) {
    return fn(wc(this.rgba, -t));
  }
  /**
   * Makes a gray color with the same lightness as a source color.
   */
  grayscale() {
    return fn(wc(this.rgba, -1));
  }
  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  lighten(t = 0.1) {
    return fn(Pv(this.rgba, t));
  }
  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  darken(t = 0.1) {
    return fn(Pv(this.rgba, -t));
  }
  /**
   * Changes the HSL hue of a color by the given amount.
   */
  rotate(t = 15) {
    return this.hue(this.hue() + t);
  }
  alpha(t) {
    return typeof t == "number" ? fn($5(this.rgba, t)) : Oe(this.rgba.a, qf);
  }
  hue(t) {
    const n = bo(this.rgba);
    return typeof t == "number" ? fn({ h: t, s: n.s, l: n.l, a: n.a }) : Oe(n.h);
  }
  /**
   * Determines whether two values are the same color.
   */
  isEqual(t) {
    return this.toHex() === fn(t).toHex();
  }
}
const fn = (e) => e instanceof Au ? e : new Au(e), Nv = [], I5 = (e) => {
  e.forEach((t) => {
    Nv.indexOf(t) < 0 && (t(Au, El), Nv.push(t));
  });
}, D5 = () => new Au({
  r: Math.random() * 255,
  g: Math.random() * 255,
  b: Math.random() * 255
}), W4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  colord: fn,
  extend: I5,
  getFormat: N5,
  random: D5
}, Symbol.toStringTag, { value: "Module" }));
var C5 = /* @__PURE__ */ ((e) => (e.create = "create", e.add = "add", e.modify = "modify", e.event = "event", e))(C5 || {});
class q4 {
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
var _t = -1, ke = 1, pe = 0;
function mo(e, t, n, r, i) {
  if (e === t)
    return e ? [[pe, e]] : [];
  if (n != null) {
    var s = W5(e, t, n);
    if (s)
      return s;
  }
  var o = ad(e, t), a = e.substring(0, o);
  e = e.substring(o), t = t.substring(o), o = Gf(e, t);
  var u = e.substring(e.length - o);
  e = e.substring(0, e.length - o), t = t.substring(0, t.length - o);
  var f = L5(e, t);
  return a && f.unshift([pe, a]), u && f.push([pe, u]), ud(f, i), r && B5(f), f;
}
function L5(e, t) {
  var n;
  if (!e)
    return [[ke, t]];
  if (!t)
    return [[_t, e]];
  var r = e.length > t.length ? e : t, i = e.length > t.length ? t : e, s = r.indexOf(i);
  if (s !== -1)
    return n = [
      [ke, r.substring(0, s)],
      [pe, i],
      [ke, r.substring(s + i.length)]
    ], e.length > t.length && (n[0][0] = n[2][0] = _t), n;
  if (i.length === 1)
    return [
      [_t, e],
      [ke, t]
    ];
  var o = F5(e, t);
  if (o) {
    var a = o[0], u = o[1], f = o[2], c = o[3], l = o[4], h = mo(a, f), d = mo(u, c);
    return h.concat([[pe, l]], d);
  }
  return j5(e, t);
}
function j5(e, t) {
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
            return $v(e, t, w, m);
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
            return $v(e, t, w, m);
        }
      }
    }
  }
  return [
    [_t, e],
    [ke, t]
  ];
}
function $v(e, t, n, r) {
  var i = e.substring(0, n), s = t.substring(0, r), o = e.substring(n), a = t.substring(r), u = mo(i, s), f = mo(o, a);
  return u.concat(f);
}
function ad(e, t) {
  if (!e || !t || e.charAt(0) !== t.charAt(0))
    return 0;
  for (var n = 0, r = Math.min(e.length, t.length), i = r, s = 0; n < i; )
    e.substring(s, i) == t.substring(s, i) ? (n = i, s = n) : r = i, i = Math.floor((r - n) / 2 + n);
  return fE(e.charCodeAt(i - 1)) && i--, i;
}
function Mv(e, t) {
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
function Gf(e, t) {
  if (!e || !t || e.slice(-1) !== t.slice(-1))
    return 0;
  for (var n = 0, r = Math.min(e.length, t.length), i = r, s = 0; n < i; )
    e.substring(e.length - i, e.length - s) == t.substring(t.length - i, t.length - s) ? (n = i, s = n) : r = i, i = Math.floor((r - n) / 2 + n);
  return cE(e.charCodeAt(e.length - i)) && i--, i;
}
function F5(e, t) {
  var n = e.length > t.length ? e : t, r = e.length > t.length ? t : e;
  if (n.length < 4 || r.length * 2 < n.length)
    return null;
  function i(d, _, v) {
    for (var g = d.substring(v, v + Math.floor(d.length / 4)), y = -1, b = "", w, m, A, S; (y = _.indexOf(g, y + 1)) !== -1; ) {
      var R = ad(
        d.substring(v),
        _.substring(y)
      ), B = Gf(
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
function B5(e) {
  for (var t = !1, n = [], r = 0, i = null, s = 0, o = 0, a = 0, u = 0, f = 0; s < e.length; )
    e[s][0] == pe ? (n[r++] = s, o = u, a = f, u = 0, f = 0, i = e[s][1]) : (e[s][0] == ke ? u += e[s][1].length : f += e[s][1].length, i && i.length <= Math.max(o, a) && i.length <= Math.max(u, f) && (e.splice(n[r - 1], 0, [
      _t,
      i
    ]), e[n[r - 1] + 1][0] = ke, r--, r--, s = r > 0 ? n[r - 1] : -1, o = 0, a = 0, u = 0, f = 0, i = null, t = !0)), s++;
  for (t && ud(e), k5(e), s = 1; s < e.length; ) {
    if (e[s - 1][0] == _t && e[s][0] == ke) {
      var c = e[s - 1][1], l = e[s][1], h = Mv(c, l), d = Mv(l, c);
      h >= d ? (h >= c.length / 2 || h >= l.length / 2) && (e.splice(s, 0, [
        pe,
        l.substring(0, h)
      ]), e[s - 1][1] = c.substring(
        0,
        c.length - h
      ), e[s + 1][1] = l.substring(h), s++) : (d >= c.length / 2 || d >= l.length / 2) && (e.splice(s, 0, [
        pe,
        c.substring(0, d)
      ]), e[s - 1][0] = ke, e[s - 1][1] = l.substring(
        0,
        l.length - d
      ), e[s + 1][0] = _t, e[s + 1][1] = c.substring(d), s++), s++;
    }
    s++;
  }
}
var Iv = /[^a-zA-Z0-9]/, Dv = /\s/, Cv = /[\r\n]/, z5 = /\n\r?\n$/, U5 = /^\r?\n\r?\n/;
function k5(e) {
  function t(d, _) {
    if (!d || !_)
      return 6;
    var v = d.charAt(d.length - 1), g = _.charAt(0), y = v.match(Iv), b = g.match(Iv), w = y && v.match(Dv), m = b && g.match(Dv), A = w && v.match(Cv), S = m && g.match(Cv), R = A && d.match(z5), B = S && _.match(U5);
    return R || B ? 5 : A || S ? 4 : y && !w && m ? 3 : w || m ? 2 : y || b ? 1 : 0;
  }
  for (var n = 1; n < e.length - 1; ) {
    if (e[n - 1][0] == pe && e[n + 1][0] == pe) {
      var r = e[n - 1][1], i = e[n][1], s = e[n + 1][1], o = Gf(r, i);
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
function ud(e, t) {
  e.push([pe, ""]);
  for (var n = 0, r = 0, i = 0, s = "", o = "", a; n < e.length; ) {
    if (n < e.length - 1 && !e[n][1]) {
      e.splice(n, 1);
      continue;
    }
    switch (e[n][0]) {
      case ke:
        i++, o += e[n][1], n++;
        break;
      case _t:
        r++, s += e[n][1], n++;
        break;
      case pe:
        var u = n - i - r - 1;
        if (t) {
          if (u >= 0 && hE(e[u][1])) {
            var f = e[u][1].slice(-1);
            if (e[u][1] = e[u][1].slice(
              0,
              -1
            ), s = f + s, o = f + o, !e[u][1]) {
              e.splice(u, 1), n--;
              var c = u - 1;
              e[c] && e[c][0] === ke && (i++, o = e[c][1] + o, c--), e[c] && e[c][0] === _t && (r++, s = e[c][1] + s, c--), u = c;
            }
          }
          if (lE(e[n][1])) {
            var f = e[n][1].charAt(0);
            e[n][1] = e[n][1].slice(1), s += f, o += f;
          }
        }
        if (n < e.length - 1 && !e[n][1]) {
          e.splice(n, 1);
          break;
        }
        if (s.length > 0 || o.length > 0) {
          s.length > 0 && o.length > 0 && (a = ad(o, s), a !== 0 && (u >= 0 ? e[u][1] += o.substring(
            0,
            a
          ) : (e.splice(0, 0, [
            pe,
            o.substring(0, a)
          ]), n++), o = o.substring(a), s = s.substring(a)), a = Gf(o, s), a !== 0 && (e[n][1] = o.substring(o.length - a) + e[n][1], o = o.substring(
            0,
            o.length - a
          ), s = s.substring(
            0,
            s.length - a
          )));
          var l = i + r;
          s.length === 0 && o.length === 0 ? (e.splice(n - l, l), n = n - l) : s.length === 0 ? (e.splice(n - l, l, [ke, o]), n = n - l + 1) : o.length === 0 ? (e.splice(n - l, l, [_t, s]), n = n - l + 1) : (e.splice(
            n - l,
            l,
            [_t, s],
            [ke, o]
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
  h && ud(e, t);
}
function fE(e) {
  return e >= 55296 && e <= 56319;
}
function cE(e) {
  return e >= 56320 && e <= 57343;
}
function lE(e) {
  return cE(e.charCodeAt(0));
}
function hE(e) {
  return fE(e.charCodeAt(e.length - 1));
}
function V5(e) {
  for (var t = [], n = 0; n < e.length; n++)
    e[n][1].length > 0 && t.push(e[n]);
  return t;
}
function Oc(e, t, n, r) {
  return hE(e) || lE(r) ? null : V5([
    [pe, e],
    [_t, t],
    [ke, n],
    [pe, r]
  ]);
}
function W5(e, t, n) {
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
      return Oc(v, y, b, f);
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
      return Oc(u, y, b, A);
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
      return Oc(v, y, b, A);
    }
  return null;
}
function zr(e, t, n, r) {
  return mo(e, t, n, r, !0);
}
zr.INSERT = ke;
zr.DELETE = _t;
zr.EQUAL = pe;
const q5 = Object.prototype.hasOwnProperty;
function G5(e, t) {
  return q5.call(e, t);
}
function H5(e) {
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
    G5(e, n) && t.push(n);
  return t;
}
function ti(e) {
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
function Sl(e) {
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
function K5(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
function xl(e) {
  if (e === void 0)
    return !0;
  if (e) {
    if (Array.isArray(e)) {
      for (let n = 0, r = e.length; n < r; n++)
        if (xl(e[n]))
          return !0;
    } else if (typeof e == "object") {
      const n = H5(e), r = n.length;
      for (var t = 0; t < r; t++)
        if (xl(e[n[t]]))
          return !0;
    }
  }
  return !1;
}
function Lv(e, t) {
  const n = [e];
  for (const r in t) {
    const i = typeof t[r] == "object" ? JSON.stringify(t[r], null, 2) : t[r];
    typeof i < "u" && n.push(`${r}: ${i}`);
  }
  return n.join(`
`);
}
class Y5 extends Error {
  constructor(t, n, r, i, s) {
    super(Lv(t, { name: n, index: r, operation: i, tree: s })), this.name = n, this.index = r, this.operation = i, this.tree = s, Object.setPrototypeOf(this, new.target.prototype), this.message = Lv(t, { name: n, index: r, operation: i, tree: s });
  }
}
const ue = Y5, X5 = ti, xi = {
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
    let r = Ou(n, this.path);
    r && (r = ti(r));
    const i = Ur(
      n,
      { op: "remove", path: this.from }
    ).removed;
    return Ur(n, { op: "add", path: this.path, value: i }), { newDocument: n, removed: r };
  },
  copy: function(e, t, n) {
    const r = Ou(n, this.from);
    return Ur(
      n,
      { op: "add", path: this.path, value: ti(r) }
    ), { newDocument: n };
  },
  test: function(e, t, n) {
    return { newDocument: n, test: wo(e[t], this.value) };
  },
  _get: function(e, t, n) {
    return this.value = e[t], { newDocument: n };
  }
};
var J5 = {
  add: function(e, t, n) {
    return Sl(t) ? e.splice(t, 0, this.value) : e[t] = this.value, { newDocument: n, index: t };
  },
  remove: function(e, t, n) {
    var r = e.splice(t, 1);
    return { newDocument: n, removed: r[0] };
  },
  replace: function(e, t, n) {
    var r = e[t];
    return e[t] = this.value, { newDocument: n, removed: r };
  },
  move: xi.move,
  copy: xi.copy,
  test: xi.test,
  _get: xi._get
};
function Ou(e, t) {
  if (t == "")
    return e;
  var n = { op: "_get", path: t };
  return Ur(e, n), n.value;
}
function Ur(e, t, n = !1, r = !0, i = !0, s = 0) {
  if (n && (typeof n == "function" ? n(t, 0, e, t.path) : Eu(t, 0)), t.path === "") {
    let o = { newDocument: e };
    if (t.op === "add")
      return o.newDocument = t.value, o;
    if (t.op === "replace")
      return o.newDocument = t.value, o.removed = e, o;
    if (t.op === "move" || t.op === "copy")
      return o.newDocument = Ou(e, t.from), t.op === "move" && (o.removed = e), o;
    if (t.op === "test") {
      if (o.test = wo(e, t.value), o.test === !1)
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
    r || (e = ti(e));
    const a = (t.path || "").split("/");
    let u = e, f = 1, c = a.length, l, h, d;
    for (typeof n == "function" ? d = n : d = Eu; ; ) {
      if (h = a[f], h && h.indexOf("~") != -1 && (h = K5(h)), i && (h == "__proto__" || h == "prototype" && f > 0 && a[f - 1] == "constructor"))
        throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");
      if (n && l === void 0 && (u[h] === void 0 ? l = a.slice(0, f).join("/") : f == c - 1 && (l = t.path), l !== void 0 && d(t, 0, e, l)), f++, Array.isArray(u)) {
        if (h === "-")
          h = u.length;
        else {
          if (n && !Sl(h))
            throw new ue("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", s, t, e);
          Sl(h) && (h = ~~h);
        }
        if (f >= c) {
          if (n && t.op === "add" && h > u.length)
            throw new ue("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", s, t, e);
          const _ = J5[t.op].call(t, u, h, e);
          if (_.test === !1)
            throw new ue("Test operation failed", "TEST_OPERATION_FAILED", s, t, e);
          return _;
        }
      } else if (f >= c) {
        const _ = xi[t.op].call(t, u, h, e);
        if (_.test === !1)
          throw new ue("Test operation failed", "TEST_OPERATION_FAILED", s, t, e);
        return _;
      }
      if (u = u[h], n && f < c && (!u || typeof u != "object"))
        throw new ue("Cannot perform operation at the desired path", "OPERATION_PATH_UNRESOLVABLE", s, t, e);
    }
  }
}
function pE(e, t, n, r = !0, i = !0) {
  if (n && !Array.isArray(t))
    throw new ue("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
  r || (e = ti(e));
  const s = new Array(t.length);
  for (let o = 0, a = t.length; o < a; o++)
    s[o] = Ur(e, t[o], n, !0, i, o), e = s[o].newDocument;
  return s.newDocument = e, s;
}
function Z5(e, t, n) {
  const r = Ur(e, t);
  if (r.test === !1)
    throw new ue("Test operation failed", "TEST_OPERATION_FAILED", n, t, e);
  return r.newDocument;
}
function Eu(e, t, n, r) {
  if (typeof e != "object" || e === null || Array.isArray(e))
    throw new ue("Operation is not an object", "OPERATION_NOT_AN_OBJECT", t, e, n);
  if (xi[e.op]) {
    if (typeof e.path != "string")
      throw new ue("Operation `path` property is not a string", "OPERATION_PATH_INVALID", t, e, n);
    if (e.path.indexOf("/") !== 0 && e.path.length > 0)
      throw new ue('Operation `path` property must start with "/"', "OPERATION_PATH_INVALID", t, e, n);
    if ((e.op === "move" || e.op === "copy") && typeof e.from != "string")
      throw new ue("Operation `from` property is not present (applicable in `move` and `copy` operations)", "OPERATION_FROM_REQUIRED", t, e, n);
    if ((e.op === "add" || e.op === "replace" || e.op === "test") && e.value === void 0)
      throw new ue("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_REQUIRED", t, e, n);
    if ((e.op === "add" || e.op === "replace" || e.op === "test") && xl(e.value))
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
        var o = { op: "_get", path: e.from, value: void 0 }, a = dE([o], n);
        if (a && a.name === "OPERATION_PATH_UNRESOLVABLE")
          throw new ue("Cannot perform the operation from a path that does not exist", "OPERATION_FROM_UNRESOLVABLE", t, e, n);
      }
    }
  } else throw new ue("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", t, e, n);
}
function dE(e, t, n) {
  try {
    if (!Array.isArray(e))
      throw new ue("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
    if (t)
      pE(ti(t), ti(e), n || !0);
    else {
      n = n || Eu;
      for (var r = 0; r < e.length; r++)
        n(e[r], r, t, void 0);
    }
  } catch (i) {
    if (i instanceof ue)
      return i;
    throw i;
  }
}
function wo(e, t) {
  if (e === t) return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    var n = Array.isArray(e), r = Array.isArray(t), i, s, o;
    if (n && r) {
      if (s = e.length, s != t.length) return !1;
      for (i = s; i-- !== 0; )
        if (!wo(e[i], t[i])) return !1;
      return !0;
    }
    if (n != r) return !1;
    var a = Object.keys(e);
    if (s = a.length, s !== Object.keys(t).length)
      return !1;
    for (i = s; i-- !== 0; )
      if (!t.hasOwnProperty(a[i])) return !1;
    for (i = s; i-- !== 0; )
      if (o = a[i], !wo(e[o], t[o])) return !1;
    return !0;
  }
  return e !== e && t !== t;
}
const G4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JsonPatchError: ue,
  _areEquals: wo,
  applyOperation: Ur,
  applyPatch: pE,
  applyReducer: Z5,
  deepClone: X5,
  getValueByPointer: Ou,
  validate: dE,
  validator: Eu
}, Symbol.toStringTag, { value: "Module" }));
var Tl;
((e) => {
  function t(s = {}, o = {}, a = !1) {
    typeof s != "object" && (s = {}), typeof o != "object" && (o = {});
    let u = Gu(o);
    a || (u = Object.keys(u).reduce((f, c) => (u[c] != null && (f[c] = u[c]), f), {}));
    for (const f in s)
      s[f] !== void 0 && o[f] === void 0 && (u[f] = s[f]);
    return Object.keys(u).length > 0 ? u : void 0;
  }
  e.compose = t;
  function n(s = {}, o = {}) {
    typeof s != "object" && (s = {}), typeof o != "object" && (o = {});
    const a = Object.keys(s).concat(Object.keys(o)).reduce((u, f) => (Ni(s[f], o[f]) || (u[f] = o[f] === void 0 ? null : o[f]), u), {});
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
})(Tl || (Tl = {}));
const Lr = Tl;
var Rl;
((e) => {
  function t(n) {
    return typeof n.delete == "number" ? n.delete : typeof n.retain == "number" ? n.retain : typeof n.retain == "object" && n.retain !== null ? 1 : typeof n.insert == "string" ? n.insert.length : 1;
  }
  e.length = t;
})(Rl || (Rl = {}));
const Yt = Rl;
class Nt {
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
      const r = this.offset, i = Yt.length(n);
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
    return this.ops[this.index] ? Yt.length(this.ops[this.index]) - this.offset : 1 / 0;
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
const Q5 = "\0", jv = (e, t) => {
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
  static Op = Yt;
  static OpIterator = Nt;
  static AttributeMap = Lr;
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
    if (t = Gu(t), typeof r == "object") {
      if (typeof t.delete == "number" && typeof r.delete == "number")
        return this.ops[n - 1] = { delete: r.delete + t.delete }, this;
      if (typeof r.delete == "number" && t.insert != null && (n -= 1, r = this.ops[n - 1], typeof r != "object"))
        return this.ops.unshift(t), this;
      if (Ni(t.attributes, r.attributes)) {
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
    return this.reduce((t, n) => n.insert ? t + Yt.length(n) : n.delete ? t - n.delete : t, 0);
  }
  length() {
    return this.reduce((t, n) => t + Yt.length(n), 0);
  }
  slice(t = 0, n = 1 / 0) {
    const r = [], i = new Nt(this.ops);
    let s = 0;
    for (; s < n && i.hasNext(); ) {
      let o;
      s < t ? o = i.next(t - s) : (o = i.next(n - s), r.push(o)), s += Yt.length(o);
    }
    return new $e(r);
  }
  compose(t) {
    const n = new Nt(this.ops), r = new Nt(t.ops), i = [], s = r.peek();
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
            const h = u.retain == null ? "insert" : "retain", [d, _, v] = jv(
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
          const l = Lr.compose(
            u.attributes,
            f.attributes,
            typeof u.retain == "number"
          );
          if (l && (c.attributes = l), o.push(c), !r.hasNext() && Ni(o.ops[o.ops.length - 1], c)) {
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
        return typeof f.insert == "string" ? f.insert : Q5;
      const c = u === t ? "on" : "with";
      throw new Error("diff() called " + c + " non-document");
    }).join("")), i = new $e(), s = zr(r[0], r[1], n, !0), o = new Nt(this.ops), a = new Nt(t.ops);
    return s.forEach((u) => {
      let f = u[1].length;
      for (; f > 0; ) {
        let c = 0;
        switch (u[0]) {
          case zr.INSERT:
            c = Math.min(a.peekLength(), f), i.push(a.next(c));
            break;
          case zr.DELETE:
            c = Math.min(f, o.peekLength()), o.next(c), i.delete(c);
            break;
          case zr.EQUAL:
            c = Math.min(
              o.peekLength(),
              a.peekLength(),
              f
            );
            const l = o.next(c), h = a.next(c);
            Ni(l.insert, h.insert) ? i.retain(
              c,
              Lr.diff(l.attributes, h.attributes)
            ) : i.push(h).delete(c);
            break;
        }
        f -= c;
      }
    }), i.chop();
  }
  eachLine(t, n = `
`) {
    const r = new Nt(this.ops);
    let i = new $e(), s = 0;
    for (; r.hasNext(); ) {
      if (r.peekType() !== "insert")
        return;
      const o = r.peek(), a = Yt.length(o) - r.peekLength(), u = typeof o.insert == "string" ? o.insert.indexOf(n, a) - a : -1;
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
        n.delete(Yt.length(i));
      else {
        if (typeof i.retain == "number" && i.attributes == null)
          return n.retain(i.retain), r + i.retain;
        if (i.delete || typeof i.retain == "number") {
          const s = i.delete || i.retain;
          return t.slice(r, r + s).forEach((a) => {
            i.delete ? n.push(a) : i.retain && i.attributes && n.retain(
              Yt.length(a),
              Lr.invert(i.attributes, a.attributes)
            );
          }), r + s;
        } else if (typeof i.retain == "object" && i.retain !== null) {
          const s = t.slice(r, r + 1), o = new Nt(s.ops).next(), [a, u, f] = jv(
            i.retain,
            o.insert
          ), c = $e.getHandler(a);
          return n.retain(
            { [a]: c.invert(u, f) },
            Lr.invert(i.attributes, o.attributes)
          ), r + 1;
        }
      }
      return r;
    }, 0), n.chop();
  }
  transform(t, n = !1) {
    if (n = !!n, typeof t == "number")
      return this.transformPosition(t, n);
    const r = t, i = new Nt(this.ops), s = new Nt(r.ops), o = new $e();
    for (; i.hasNext() || s.hasNext(); )
      if (i.peekType() === "insert" && (n || s.peekType() !== "insert"))
        o.retain(Yt.length(i.next()));
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
            Lr.transform(
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
    const r = new Nt(this.ops);
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
const H4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AttributeMap: Lr,
  Delta: $e,
  Op: Yt,
  OpIterator: Nt,
  default: $e
}, Symbol.toStringTag, { value: "Module" })), Ec = {};
class K4 {
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
        this.wrapperInitData[r] = Ec, this.wrapperInitData[r] = i.initialize ? i.initialize.call(this) : null;
      } finally {
        if (this.wrapperInitData[r] === Ec)
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
        o = !0, s !== Ec && i.close && i.close.call(this, s), o = !1;
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
const Pl = [];
let Ms = -1;
const Y4 = (e) => ({
  current: e
}), X4 = (e, t) => {
  Pl[++Ms] = e.current, e.current = t;
}, J4 = (e) => {
  Ms < 0 || (e.current = Pl[Ms], Pl[Ms] = null, Ms--);
};
class e4 {
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
class t4 {
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
class Z4 extends e4 {
  /**
   * 获取对象并返回自动释放包装器
   */
  autoAcquire() {
    const t = this.acquire();
    return new t4(this, t);
  }
}
const n4 = (e) => {
  Br && Br.add(e);
};
let Br = null;
class Q4 {
  static add = n4;
  static mixin(t, n = {}) {
    const r = t.prototype.dispose;
    t.prototype.__isDisposed = !1, t.prototype.isDisposed = function() {
      return !!this.__isDisposed;
    }, t.prototype.dispose = function() {
      this.__isDisposed || (this.__isDisposed = !0, n.dispose?.(this), r?.call(t));
    }, t.prototype.disposeLater = function() {
      Br && !this.__isDisposed && Br.add(this);
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
    let n = Br;
    try {
      return Br = this, t();
    } finally {
      this.dispose(), Br = n;
    }
  }
}
function Nl(e, t) {
  let n = e.length;
  e.push(t);
  e: for (; 0 < n; ) {
    let r = n - 1 >>> 1, i = e[r];
    if (0 < ka(i, t))
      e[r] = t, e[n] = i, n = r;
    else break e;
  }
}
function _n(e) {
  return e.length === 0 ? null : e[0];
}
function Su(e) {
  if (e.length === 0)
    return null;
  let t = e[0], n = e.pop();
  if (n !== t) {
    e[0] = n;
    e: for (let r = 0, i = e.length, s = i >>> 1; r < s; ) {
      let o = 2 * (r + 1) - 1, a = e[o], u = o + 1, f = e[u];
      if (0 > ka(a, n))
        u < i && 0 > ka(f, a) ? (e[r] = f, e[u] = n, r = u) : (e[r] = a, e[o] = n, r = o);
      else if (u < i && 0 > ka(f, n))
        e[r] = f, e[u] = n, r = u;
      else
        break e;
    }
  }
  return t;
}
function ka(e, t) {
  const n = e.sortIndex - t.sortIndex;
  return n !== 0 ? n : e.id - t.id;
}
const r4 = 0, Ao = 1, Oo = 2, br = 3, xu = 4, Tu = 5, _E = !1, fd = 5, vE = 250, gE = 5e3, yE = 1e4, i4 = !0, s4 = !0;
let mr;
const o4 = (
  // $FlowFixMe[method-unbinding]
  typeof performance == "object" && typeof performance.now == "function"
);
if (o4) {
  const e = performance;
  mr = () => e.now();
} else {
  const e = Date, t = e.now();
  mr = () => e.now() - t;
}
let a4 = 1073741823, kn = [], sr = [], u4 = 1, ct = null, De = br, $l = !1, Eo = !1, So = !1;
const bE = typeof setTimeout == "function" ? setTimeout : null, f4 = typeof clearTimeout == "function" ? clearTimeout : null, Fv = typeof setImmediate < "u" ? setImmediate : null;
function Va(e) {
  let t = _n(sr);
  for (; t !== null; ) {
    if (t.callback === null)
      Su(sr);
    else if (t.startTime <= e)
      Su(sr), t.sortIndex = t.expirationTime, Nl(kn, t);
    else
      return;
    t = _n(sr);
  }
}
function cd(e) {
  if (So = !1, Va(e), !Eo)
    if (_n(kn) !== null)
      Eo = !0, wE();
    else {
      const t = _n(sr);
      t !== null && ld(cd, t.startTime - e);
    }
}
function c4(e) {
  Eo = !1, So && (So = !1, AE()), $l = !0;
  const t = De;
  try {
    if (!_E) return l4(e);
  } finally {
    ct = null, De = t, $l = !1;
  }
}
function l4(e) {
  let t = e;
  for (Va(t), ct = _n(kn); ct !== null; ) {
    const n = ct.callback;
    if (typeof n == "function") {
      ct.callback = null, De = ct.priorityLevel;
      const r = ct.expirationTime <= t, i = n(r);
      if (t = mr(), typeof i == "function")
        return ct.callback = i, Va(t), !0;
      ct === _n(kn) && Su(kn), Va(t);
    } else
      Su(kn);
    if (ct = _n(kn), ct === null || ct.expirationTime > t)
      break;
  }
  if (ct !== null)
    return !0;
  {
    const n = _n(sr);
    return n !== null && ld(cd, n.startTime - t), !1;
  }
}
function h4(e, t) {
  switch (e) {
    case Ao:
    case Oo:
    case br:
    case xu:
    case Tu:
      break;
    default:
      e = br;
  }
  let n = De;
  De = e;
  try {
    return t();
  } finally {
    De = n;
  }
}
function p4(e) {
  let t;
  switch (De) {
    case Ao:
    case Oo:
    case br:
      t = br;
      break;
    default:
      t = De;
      break;
  }
  let n = De;
  De = t;
  try {
    return e();
  } finally {
    De = n;
  }
}
function d4(e) {
  let t = De;
  return function(...n) {
    let r = De;
    De = t;
    try {
      return e.apply(this, n);
    } finally {
      De = r;
    }
  };
}
function _4(e, t, n) {
  let r = mr(), i;
  if (typeof n == "object" && n !== null) {
    let u = n.delay;
    typeof u == "number" && u > 0 ? i = r + u : i = r;
  } else
    i = r;
  let s;
  switch (e) {
    case Ao:
      s = -1;
      break;
    case Oo:
      s = vE;
      break;
    case Tu:
      s = a4;
      break;
    case xu:
      s = yE;
      break;
    case br:
    default:
      s = gE;
      break;
  }
  let o = i + s, a = {
    id: u4++,
    callback: t,
    priorityLevel: e,
    startTime: i,
    expirationTime: o,
    sortIndex: -1
  };
  return i > r ? (a.sortIndex = i, Nl(sr, a), _n(kn) === null && a === _n(sr) && (So ? AE() : So = !0, ld(cd, i - r))) : (a.sortIndex = o, Nl(kn, a), !Eo && !$l && (Eo = !0, wE())), a;
}
function v4(e) {
  e.callback = null;
}
function g4() {
  return De;
}
let Ru = !1, Ml = -1, Il = fd, mE = -1;
function y4() {
  return !(mr() - mE < Il);
}
function b4() {
}
function m4(e) {
  if (e < 0 || e > 125) {
    console.error(
      "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
    );
    return;
  }
  e > 0 ? Il = Math.floor(1e3 / e) : Il = fd;
}
const Sc = () => {
  if (Ru) {
    const e = mr();
    mE = e;
    let t = !0;
    try {
      t = c4(e);
    } finally {
      t ? Ws() : Ru = !1;
    }
  }
};
let Ws;
if (typeof Fv == "function")
  Ws = () => {
    Fv(Sc);
  };
else if (typeof MessageChannel < "u") {
  const e = new MessageChannel(), t = e.port2;
  e.port1.onmessage = Sc, Ws = () => {
    t.postMessage(null);
  };
} else
  Ws = () => {
    bE(Sc, 0);
  };
function wE() {
  Ru || (Ru = !0, Ws());
}
function ld(e, t) {
  Ml = bE(() => {
    e(mr());
  }, t);
}
function AE() {
  f4(Ml), Ml = -1;
}
const eU = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  IdlePriority: Tu,
  ImmediatePriority: Ao,
  LowPriority: xu,
  NoPriority: r4,
  NormalPriority: br,
  UserBlockingPriority: Oo,
  enableAlwaysYieldScheduler: s4,
  enableProfiling: _E,
  enableRequestPaint: i4,
  frameYieldMs: fd,
  lowPriorityTimeout: yE,
  normalPriorityTimeout: gE,
  unstable_IdlePriority: Tu,
  unstable_ImmediatePriority: Ao,
  unstable_LowPriority: xu,
  unstable_NormalPriority: br,
  unstable_UserBlockingPriority: Oo,
  unstable_cancelCallback: v4,
  unstable_forceFrameRate: m4,
  unstable_getCurrentPriorityLevel: g4,
  unstable_next: p4,
  get unstable_now() {
    return mr;
  },
  unstable_requestPaint: b4,
  unstable_runWithPriority: h4,
  unstable_scheduleCallback: _4,
  unstable_shouldYield: y4,
  unstable_wrapCallback: d4,
  userBlockingPriorityTimeout: vE
}, Symbol.toStringTag, { value: "Module" }));
let w4 = class {
  currentState;
  context;
  config;
  listeners = [];
  constructor(t) {
    this.config = t, this.currentState = t.initial, this.context = t.context;
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
  send(t, n) {
    const r = this.config.states[this.currentState], i = r.on?.[t];
    if (!i)
      return console.warn(
        `事件 "${t}" 在当前状态 "${this.currentState}" 下无效`
      ), !1;
    r.onExit?.(this.context, this);
    const s = this.currentState;
    return i.action && (this.context = i.action(this.context, {
      type: t,
      prevState: s,
      payload: n
    }, this)), this.currentState = i.target, this.config.states[this.currentState].onEnter?.(this.context, this), this.listeners.forEach(
      (o) => o(this.currentState, this.context)
    ), !0;
  }
  // 监听状态变化
  subscribe(t) {
    return this.listeners.push(t), () => {
      this.listeners = this.listeners.filter((n) => n !== t);
    };
  }
  // 重置到初始状态
  reset() {
    this.currentState = this.config.initial, this.context = this.config.context, this.listeners.forEach(
      (t) => t(this.currentState, this.context)
    );
  }
};
const nU = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StateMachine: w4
}, Symbol.toStringTag, { value: "Module" }));
class hd {
  startState;
  _currentState;
  get currentState() {
    return this._currentState;
  }
  set currentState(t) {
    this._currentState = t;
  }
  states = /* @__PURE__ */ new Map();
  data;
  static create(t, n) {
    const r = new hd();
    r.data = n;
    for (const i in t.states)
      r.states.set(i, {
        name: i,
        ...t.states[i]
      });
    for (const i of r.states.values())
      for (const s of i.transitions)
        if (s !== "*" && !r.states.has(s))
          throw Error(
            `Invalid state machine, state [${i.name}] has a transition to another state that doesn't exist [${s}]`
          );
    return r.currentState = r.startState = r.states.get(t.start), r;
  }
  in(t) {
    return this.currentState.name === t;
  }
  go(t, n) {
    if (this.currentState.transitions.includes(t) || this.currentState.transitions.includes("*")) {
      const r = this.states.get(t);
      return this.currentState.onExit && this.currentState?.onExit({ to: r.name, data: this.data }) === !1 || r?.onEnter && r?.onEnter({ from: this.currentState.name, eventData: n, data: this.data }) === !1 ? !1 : (this.currentState = r, this.currentState?.onState && this.currentState.onState(), !0);
    }
    return !1;
  }
  update(t) {
    this.currentState.onUpdate && this.currentState.onUpdate(this.data, t);
  }
  save(t) {
    localStorage.setItem(t, JSON.stringify({
      currentState: this.currentState.name,
      data: this.data
    }));
  }
  restore(t) {
    const n = JSON.parse(localStorage.getItem(t));
    this.currentState = this.states.get(n.currentState), this.data = n.data;
  }
}
const rU = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StateMachine: hd
}, Symbol.toStringTag, { value: "Module" }));
export {
  dd as AT_TARGET,
  Z4 as AutoPool,
  xE as BUBBLING_PHASE,
  SE as CAPTURING_PHASE,
  T4 as Callbacks,
  ft as Color,
  Q4 as DisposableManager,
  Dl as Emitter4Event,
  A4 as Event,
  Pe as EventEmitter,
  E4 as EventEmitter4,
  Pu as EventPhase,
  Ci as EventPropagation,
  Ci as EventTarget,
  C5 as HookType,
  I4 as Immutable,
  zv as NONE,
  QO as Options,
  q4 as PluginService,
  e4 as Pool,
  R4 as PriorityQueue,
  H4 as QuillDelta,
  eU as Scheduler,
  x4 as Signals,
  nU as StateMachine,
  rU as StateMachinePlus,
  K4 as Transaction,
  n4 as addDisposable,
  F4 as alienSignals,
  $4 as antvUtil,
  W4 as colord,
  z4 as compose,
  Y4 as createCursor,
  yo as deepmerge,
  Ol as fastDeepEqual,
  zr as fastDiff,
  G4 as fastJsonPatch,
  u5 as hexToRgb,
  k4 as hslToHsv,
  xv as hslToRgb,
  V4 as hsvToHsl,
  a5 as hsvToRgb,
  M4 as immer,
  f5 as lerpColor,
  N4 as lodash,
  O4 as mitt,
  j4 as mobx,
  S4 as observable,
  J4 as pop,
  X4 as push,
  P4 as radash,
  D4 as reactivity,
  L4 as redux,
  o5 as rgbToHsl,
  U4 as rgbToHsv,
  C4 as signals,
  B4 as tapable
};
