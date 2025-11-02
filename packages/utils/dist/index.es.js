var _O = Object.prototype.hasOwnProperty, Ve = "~";
function Ns() {
}
Object.create && (Ns.prototype = /* @__PURE__ */ Object.create(null), new Ns().__proto__ || (Ve = !1));
function vO(e, t, n) {
  this.fn = e, this.context = t, this.once = n || !1;
}
function G_(e, t, n, r, i) {
  if (typeof n != "function")
    throw new TypeError("The listener must be a function");
  var s = new vO(n, r || e, i), o = Ve ? Ve + t : t;
  return e._events[o] ? e._events[o].fn ? e._events[o] = [e._events[o], s] : e._events[o].push(s) : (e._events[o] = s, e._eventsCount++), e;
}
function ha(e, t) {
  --e._eventsCount === 0 ? e._events = new Ns() : delete e._events[t];
}
function Te() {
  this._events = new Ns(), this._eventsCount = 0;
}
Te.prototype.eventNames = function() {
  var t = [], n, r;
  if (this._eventsCount === 0) return t;
  for (r in n = this._events)
    _O.call(n, r) && t.push(Ve ? r.slice(1) : r);
  return Object.getOwnPropertySymbols ? t.concat(Object.getOwnPropertySymbols(n)) : t;
};
Te.prototype.listeners = function(t) {
  var n = Ve ? Ve + t : t, r = this._events[n];
  if (!r) return [];
  if (r.fn) return [r.fn];
  for (var i = 0, s = r.length, o = new Array(s); i < s; i++)
    o[i] = r[i].fn;
  return o;
};
Te.prototype.listenerCount = function(t) {
  var n = Ve ? Ve + t : t, r = this._events[n];
  return r ? r.fn ? 1 : r.length : 0;
};
Te.prototype.emit = function(t, n, r, i, s, o) {
  var a = Ve ? Ve + t : t;
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
Te.prototype.on = function(t, n, r) {
  return G_(this, t, n, r, !1);
};
Te.prototype.once = function(t, n, r) {
  return G_(this, t, n, r, !0);
};
Te.prototype.removeListener = function(t, n, r, i) {
  var s = Ve ? Ve + t : t;
  if (!this._events[s]) return this;
  if (!n)
    return ha(this, s), this;
  var o = this._events[s];
  if (o.fn)
    o.fn === n && (!i || o.once) && (!r || o.context === r) && ha(this, s);
  else {
    for (var a = 0, u = [], f = o.length; a < f; a++)
      (o[a].fn !== n || i && !o[a].once || r && o[a].context !== r) && u.push(o[a]);
    u.length ? this._events[s] = u.length === 1 ? u[0] : u : ha(this, s);
  }
  return this;
};
Te.prototype.removeAllListeners = function(t) {
  var n;
  return t ? (n = Ve ? Ve + t : t, this._events[n] && ha(this, n)) : (this._events = new Ns(), this._eventsCount = 0), this;
};
Te.prototype.off = Te.prototype.removeListener;
Te.prototype.addListener = Te.prototype.on;
Te.prefixed = Ve;
Te.EventEmitter = Te;
const nu = {
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3
}, H_ = nu.NONE, gO = nu.CAPTURING_PHASE, Ap = nu.AT_TARGET, yO = nu.BUBBLING_PHASE;
class M5 {
  static create(t, n, r) {
    return new this(t, n, r);
  }
  type = "none";
  parentNode = null;
  target = null;
  currentTarget = null;
  data = null;
  eventPhase = H_;
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
    let t = this.currentTarget, n = [];
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
function Op(e) {
  return (typeof e == "boolean" || !e) && (e = {
    capture: !!e
  }), e = { capture: !1, once: !1, ...e || {} }, e;
}
function Ep(e, t) {
  var n = e._events[t], r;
  if (!n) return [];
  if (n.fn) return [n];
  for (var i = 0, s = n.length, r = new Array(s); i < s; i++)
    r[i] = n[i];
  return r;
}
class Ai {
  parent = null;
  _bubble_emitter = new Te();
  _capture_emitter = new Te();
  addEventListener(t, n, r) {
    r = Op(r);
    const i = r.capture ? this._capture_emitter : this._bubble_emitter;
    r && r.once ? i.once(t, n) : i.on(t, n);
  }
  removeEventListener(t, n, r) {
    r = Op(r), (r.capture ? this._capture_emitter : this._bubble_emitter).off(t, n);
  }
  /**
   * 
   * @param {Event} e 
   */
  dispatchEvent(t) {
    t.currentTarget = this;
    const n = t.type, r = t.composedPath(), i = r.length;
    for (let s = i - 1; s >= 0; s--) {
      const o = r[s]._capture_emitter;
      if (o.listenerCount(n) > 0) {
        t.target = r[s], t.eventPhase = t.target !== this ? gO : Ap;
        const u = Ep(o, n);
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
          t.target = r[s], t.eventPhase = t.target !== this ? yO : Ap;
          const u = Ep(o, n);
          for (let f = 0, c = u.length; f < c; f++) {
            const l = u[f];
            if (l.once && o.removeListener(n, l.fn, l.context, l.once), l.fn(t), t.immediateCancelBubble)
              break;
          }
        }
        if (t.cancelBubble || !t.bubbles)
          break;
      }
    return t.eventPhase = H_, !t.defaultPrevented;
  }
  removeAllListeners() {
    this._bubble_emitter.removeAllListeners(), this._capture_emitter.removeAllListeners();
  }
}
Ai.prototype.on = Ai.prototype.addEventListener;
Ai.prototype.off = Ai.prototype.removeEventListener;
Ai.prototype.emit = Ai.prototype.dispatchEvent;
function I5(e) {
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
function Sp(e, t, n, r, i, s) {
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
function $s(e, t, n, r, i, s) {
  if (e[t]) {
    if (!r && !i) {
      e[t] = void 0, delete e[t];
      return;
    } else if (!r && i) {
      let o = e[n];
      if (!o || !o.has(i))
        return;
      o.get(i).forEach((u, f) => {
        $s(e, t, n, f, void 0, s);
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
function bO(e, t, n, r, ...i) {
  if (!e[t])
    return;
  let o = e[t][r];
  if (o)
    for (let a = 0; a < o.length; a++) {
      const u = o[a];
      u.handle(...i), u.once && $s(e, t, n, r, null, u.handle);
    }
}
function xp(e, t, n) {
  let r = e[t];
  return r ? r[n] || [] : [];
}
function mO(e, t, n) {
  e[t] = void 0, e[n] = void 0;
}
function wO(e, t, n) {
  let r = e[t];
  if (!r)
    return !1;
  let i = r[n];
  return i ? i.length > 0 : !1;
}
function AO(e) {
  if (!e._listeners)
    return [];
  let t = e._listeners;
  return Object.keys(t);
}
function OO(e, t, n, r, i) {
  i.currentTarget = e;
  const s = i.type, o = i.composedPath(e), a = o.length;
  for (let u = a - 1; u >= 0; u--) {
    const f = o[u];
    i.target = o[u], i.eventPhase = i.target !== e ? ui.CAPTURING_PHASE : ui.AT_TARGET;
    const c = xp(f, n, s);
    for (let l = 0, h = c.length; l < h; l++) {
      const d = c[l];
      if (d.once && $s(e, n, r, s, null, d.handle), d.handle(i), i.immediateCancelBubble)
        break;
    }
    if (i.cancelBubble)
      break;
  }
  if (!i.cancelBubble)
    for (let u = 0; u < a; u++) {
      const f = o[u];
      i.target = o[u], i.eventPhase = i.target !== e ? ui.BUBBLING_PHASE : ui.AT_TARGET;
      const c = xp(f, t, s);
      for (let l = 0, h = c.length; l < h; l++) {
        const d = c[l];
        if (d.once && $s(e, t, r, s, null, d.handle), d.handle(i), i.immediateCancelBubble)
          break;
      }
      if (i.cancelBubble || !i.bubbles)
        break;
    }
  return i.eventPhase = ui.NONE, !i.defaultPrevented;
}
const ui = {
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3
};
class Xc {
  static create(t, n) {
    return new Xc(t);
  }
  type;
  target = null;
  currentTarget = null;
  data = null;
  eventPhase = ui.NONE;
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
const ii = "_listeners", Rp = "_listeners_capture", si = "_listenersNs";
class D5 {
  parent;
  _listeners;
  _listenersNs;
  on(t, n, r) {
    return r && r.capture ? Sp(this, Rp, si, t, n, r) : Sp(this, ii, si, t, n, r), this;
  }
  emit(t, ...n) {
    return bO(this, ii, si, t, ...n), this;
  }
  createEvent(t, n) {
    return Xc.create(t, n);
  }
  emitBubble(t) {
    return OO(this, ii, Rp, si, t);
  }
  off(t, n, r) {
    return $s(this, ii, si, t, r ? r.namespace : null, n), this;
  }
  eventNames() {
    return AO(this);
  }
  hasEventListener(t) {
    return wO(this, ii, t);
  }
  removeAllListeners() {
    return mO(this, ii, si), this;
  }
}
const K_ = (e) => !!Symbol[e], Jc = (e) => K_(e) ? Symbol[e] : "@@" + e, EO = Jc("iterator"), Hf = Jc("observable"), Y_ = Jc("species");
function Aa(e, t) {
  let n = e[t];
  if (n != null) {
    if (typeof n != "function")
      throw new TypeError(n + " is not a function");
    return n;
  }
}
function fs(e) {
  let t = e.constructor;
  return t !== void 0 && (t = t[Y_], t === null && (t = void 0)), t !== void 0 ? t : Se;
}
function SO(e) {
  return e instanceof Se;
}
function Oi(e) {
  Oi.log ? Oi.log(e) : setTimeout(() => {
    throw e;
  });
}
function pa(e) {
  Promise.resolve().then(() => {
    try {
      e();
    } catch (t) {
      Oi(t);
    }
  });
}
function X_(e) {
  let t = e._cleanup;
  if (t !== void 0 && (e._cleanup = void 0, !!t))
    try {
      if (typeof t == "function")
        t();
      else {
        let n = Aa(t, "unsubscribe");
        n && n.call(t);
      }
    } catch (n) {
      Oi(n);
    }
}
function Kf(e) {
  e._observer = void 0, e._queue = void 0, e._state = "closed";
}
function xO(e) {
  let t = e._queue;
  if (t) {
    e._queue = void 0, e._state = "ready";
    for (let n = 0; n < t.length && (J_(e, t[n].type, t[n].value), e._state !== "closed"); ++n)
      ;
  }
}
function J_(e, t, n) {
  e._state = "running";
  let r = e._observer;
  try {
    let i = Aa(r, t);
    switch (t) {
      case "next":
        i && i.call(r, n);
        break;
      case "error":
        if (Kf(e), i) i.call(r, n);
        else throw n;
        break;
      case "complete":
        Kf(e), i && i.call(r);
        break;
    }
  } catch (i) {
    Oi(i);
  }
  e._state === "closed" ? X_(e) : e._state === "running" && (e._state = "ready");
}
function bf(e, t, n) {
  if (e._state !== "closed") {
    if (e._state === "buffering") {
      e._queue.push({ type: t, value: n });
      return;
    }
    if (e._state !== "ready") {
      e._state = "buffering", e._queue = [{ type: t, value: n }], pa(() => xO(e));
      return;
    }
    J_(e, t, n);
  }
}
class RO {
  constructor(t, n) {
    this._cleanup = void 0, this._observer = t, this._queue = void 0, this._state = "initializing";
    let r = this, i = {
      get closed() {
        return r._state === "closed";
      },
      next(s) {
        bf(r, "next", s);
      },
      error(s) {
        bf(r, "error", s);
      },
      complete() {
        bf(r, "complete");
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
    this._state !== "closed" && (Kf(this), X_(this));
  }
}
class Se {
  constructor(t) {
    if (!(this instanceof Se))
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
    }), new RO(t, this._subscriber);
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
    let n = fs(this);
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
    let n = fs(this);
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
    let n = fs(this), r = arguments.length > 1, i = !1, o = arguments[1];
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
    let n = fs(this);
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
    let n = fs(this);
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
  [Hf]() {
    return this;
  }
  static from(t) {
    let n = typeof this == "function" ? this : Se;
    if (t == null)
      throw new TypeError(t + " is not an object");
    let r = Aa(t, Hf);
    if (r) {
      let i = r.call(t);
      if (Object(i) !== i)
        throw new TypeError(i + " is not an object");
      return SO(i) && i.constructor === n ? i : new n((s) => i.subscribe(s));
    }
    if (K_("iterator") && (r = Aa(t, EO), r))
      return new n((i) => {
        pa(() => {
          if (!i.closed) {
            for (let s of r.call(t))
              if (i.next(s), i.closed) return;
            i.complete();
          }
        });
      });
    if (Array.isArray(t))
      return new n((i) => {
        pa(() => {
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
    let n = typeof this == "function" ? this : Se;
    return new n((r) => {
      pa(() => {
        if (!r.closed) {
          for (let i = 0; i < t.length; ++i)
            if (r.next(t[i]), r.closed) return;
          r.complete();
        }
      });
    });
  }
  static get [Y_]() {
    return this;
  }
}
Object.defineProperty(Se, Symbol("extensions"), {
  value: {
    symbol: Hf,
    hostReportError: Oi
  },
  configurable: !0
});
function TO(...e) {
  return new Se((t) => {
    if (e.length === 0)
      return Se.from([]);
    let n = e.length, r = e.map((i) => Se.from(i).subscribe({
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
function PO(...e) {
  return new Se((t) => {
    if (e.length === 0)
      return Se.from([]);
    let n = e.length, r = /* @__PURE__ */ new Set(), i = !1, s = e.map(() => {
    }), o = e.map((a, u) => Se.from(a).subscribe({
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
function NO(...e) {
  return new Se((t) => {
    if (e.length === 0)
      return Se.from([]);
    let n = e.map(() => []);
    function r() {
      return n.some((s, o) => s.length === 0 && i[o].closed);
    }
    let i = e.map((s, o) => Se.from(s).subscribe({
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
const C5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Observable: Se,
  combineLatest: PO,
  merge: TO,
  zip: NO
}, Symbol.toStringTag, { value: "Module" }));
function L5() {
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
class j5 {
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
class F5 {
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
const Z_ = (e) => !!e && e.constructor === Symbol, Ms = Array.isArray, Zc = (e) => !!e && e.constructor === Object, Q_ = (e) => e == null || typeof e != "object" && typeof e != "function", oo = (e) => !!(e && e.constructor && e.call && e.apply), $O = (e) => typeof e == "string" || e instanceof String, MO = (e) => di(e) && e % 1 === 0, IO = (e) => di(e) && e % 1 !== 0, di = (e) => {
  try {
    return Number(e) === e;
  } catch {
    return !1;
  }
}, ev = (e) => Object.prototype.toString.call(e) === "[object Date]", tv = (e) => !(!e || !e.then || !oo(e.then)), DO = (e) => {
  if (e === !0 || e === !1 || e == null) return !0;
  if (di(e)) return e === 0;
  if (ev(e)) return isNaN(e.getTime());
  if (oo(e) || Z_(e)) return !1;
  const t = e.length;
  if (di(t)) return t === 0;
  const n = e.size;
  return di(n) ? n === 0 : Object.keys(e).length === 0;
}, nv = (e, t) => {
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
    if (!Reflect.has(t, n[i]) || !nv(e[n[i]], t[n[i]])) return !1;
  return !0;
}, CO = (e, t) => e.reduce((n, r) => {
  const i = t(r);
  return n[i] || (n[i] = []), n[i].push(r), n;
}, {});
function LO(...e) {
  return !e || !e.length ? [] : new Array(Math.max(...e.map(({ length: t }) => t))).fill([]).map((t, n) => e.map((r) => r[n]));
}
function jO(e, t) {
  if (!e || !e.length)
    return {};
  const n = oo(t) ? t : Ms(t) ? (r, i) => t[i] : (r, i) => t;
  return e.reduce((r, i, s) => (r[i] = n(i, s), r), {});
}
const Qc = (e, t) => !e || (e.length ?? 0) === 0 ? null : e.reduce(t);
function FO(e, t) {
  return (e || []).reduce((n, r) => n + (t ? t(r) : r), 0);
}
const BO = (e, t = void 0) => e?.length > 0 ? e[0] : t, zO = (e, t = void 0) => e?.length > 0 ? e[e.length - 1] : t, rv = (e, t, n = !1) => {
  if (!e) return [];
  const r = (s, o) => t(s) - t(o), i = (s, o) => t(o) - t(s);
  return e.slice().sort(n === !0 ? i : r);
}, UO = (e, t, n = "asc") => {
  if (!e) return [];
  const r = (s, o) => `${t(s)}`.localeCompare(t(o)), i = (s, o) => `${t(o)}`.localeCompare(t(s));
  return e.slice().sort(n === "desc" ? i : r);
}, VO = (e, t) => e ? e.reduce((n, r) => {
  const i = t(r);
  return n[i] = (n[i] ?? 0) + 1, n;
}, {}) : {}, kO = (e, t, n) => {
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
}, iv = (e, t, n = (r) => r) => e.reduce((r, i) => (r[t(i)] = n(i), r), {}), WO = (e, t, n) => e ? e.reduce((r, i, s) => (n(i, s) && r.push(t(i, s)), r), []) : [];
function qO(e, t) {
  const n = t ?? ((r) => r);
  return Qc(e, (r, i) => n(r) > n(i) ? r : i);
}
function GO(e, t) {
  const n = t ?? ((r) => r);
  return Qc(e, (r, i) => n(r) < n(i) ? r : i);
}
const HO = (e, t = 2) => {
  const n = Math.ceil(e.length / t);
  return new Array(n).fill(null).map((r, i) => e.slice(i * t, i * t + t));
}, KO = (e, t) => {
  const n = e.reduce((r, i) => {
    const s = t ? t(i) : i;
    return r[s] || (r[s] = i), r;
  }, {});
  return Object.values(n);
};
function* el(e, t, n = (i) => i, r = 1) {
  const i = oo(n) ? n : () => n, s = t ? e : 0, o = t ?? e;
  for (let a = s; a <= o && (yield i(a), !(a + r > o)); a += r)
    ;
}
const tl = (e, t, n, r) => Array.from(el(e, t, n, r)), YO = (e) => e.reduce((t, n) => (t.push(...n), t), []), XO = (e, t, n) => {
  if (!e || !t) return !1;
  const r = n ?? ((s) => s), i = t.reduce((s, o) => (s[r(o)] = !0, s), {});
  return e.some((s) => i[r(s)]);
}, sv = (e, t) => e ? e.reduce(
  (n, r) => {
    const [i, s] = n;
    return t(r) ? [[...i, r], s] : [i, [...s, r]];
  },
  [[], []]
) : [[], []], JO = (e, t, n) => !t && !e ? [] : t ? e ? n ? e.reduce((r, i) => {
  const s = t.find((o) => n(i) === n(o));
  return s ? r.push(s) : r.push(i), r;
}, []) : e : [] : e, ZO = (e, t, n) => {
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
}, QO = (e, t, n, r) => {
  if (!e && !t) return [];
  if (!e) return [t];
  if (!t) return [...e];
  const i = n ? (a, u) => n(a, u) === n(t, u) : (a) => a === t;
  return e.find(i) ? e.filter((a, u) => !i(a, u)) : (r?.strategy ?? "append") === "append" ? [...e, t] : [t, ...e];
}, eE = (e) => e?.filter((t) => !!t) ?? [], ov = (e, t, n) => {
  let r = n;
  for (let i = 1; i <= e; i++)
    r = t(r, i);
  return r;
}, tE = (e, t, n = (r) => r) => {
  if (!e?.length && !t?.length) return [];
  if (e?.length === void 0) return [...t];
  if (!t?.length) return [...e];
  const r = t.reduce((i, s) => (i[n(s)] = !0, i), {});
  return e.filter((i) => !r[n(i)]);
};
function nE(e, t) {
  if (e.length === 0) return e;
  const n = t % e.length;
  return n === 0 ? e : [...e.slice(-n, e.length), ...e.slice(0, -n)];
}
const rE = async (e, t, n) => {
  const r = n !== void 0;
  if (!r && e?.length < 1)
    throw new Error("Cannot reduce empty array with no init value");
  const i = r ? e : e.slice(1);
  let s = r ? n : e[0];
  for (const [o, a] of i.entries())
    s = await t(s, a, o);
  return s;
}, iE = async (e, t) => {
  if (!e) return [];
  let n = [], r = 0;
  for (const i of e) {
    const s = await t(i, r++);
    n.push(s);
  }
  return n;
}, sE = async (e) => {
  const t = [], n = (s, o) => t.push({
    fn: s,
    rethrow: o?.rethrow ?? !1
  }), [r, i] = await Ei(e)(n);
  for (const { fn: s, rethrow: o } of t) {
    const [a] = await Ei(s)(r);
    if (a && o) throw a;
  }
  if (r) throw r;
  return i;
};
class av extends Error {
  errors;
  constructor(t = []) {
    super();
    const n = t.find((r) => r.name)?.name ?? "";
    this.name = `AggregateError(${n}...)`, this.message = `AggregateError with ${t.length} errors`, this.stack = t.find((r) => r.stack)?.stack ?? this.stack, this.errors = t;
  }
}
const oE = async (e, t, n) => {
  const r = t.map((f, c) => ({
    index: c,
    item: f
  })), i = async (f) => {
    const c = [];
    for (; ; ) {
      const l = r.pop();
      if (!l) return f(c);
      const [h, d] = await Ei(n)(l.item);
      c.push({
        error: h,
        result: d,
        index: l.index
      });
    }
  }, s = tl(1, e).map(() => new Promise(i)), o = await Promise.all(s), [a, u] = sv(
    rv(o.flat(), (f) => f.index),
    (f) => !!f.error
  );
  if (a.length > 0)
    throw new av(a.map((f) => f.error));
  return u.map((f) => f.result);
};
async function aE(e) {
  const t = Ms(e) ? e.map((i) => [null, i]) : Object.entries(e), n = await Promise.all(
    t.map(
      ([i, s]) => s.then((o) => ({ result: o, exc: null, key: i })).catch((o) => ({ result: null, exc: o, key: i }))
    )
  ), r = n.filter((i) => i.exc);
  if (r.length > 0)
    throw new av(r.map((i) => i.exc));
  return Ms(e) ? n.map((i) => i.result) : n.reduce(
    (i, s) => ({
      ...i,
      [s.key]: s.result
    }),
    {}
  );
}
const uE = async (e, t) => {
  const n = e?.times ?? 3, r = e?.delay, i = e?.backoff ?? null;
  for (const s of el(1, n)) {
    const [o, a] = await Ei(t)((u) => {
      throw { _exited: u };
    });
    if (!o) return a;
    if (o._exited) throw o._exited;
    if (s === n) throw o;
    r && await Yf(r), i && await Yf(i(s));
  }
}, Yf = (e) => new Promise((t) => setTimeout(t, e)), Ei = (e) => (...t) => {
  try {
    const n = e(...t);
    return tv(n) ? n.then((r) => [void 0, r]).catch((r) => [r, void 0]) : [void 0, n];
  } catch (n) {
    return [n, void 0];
  }
}, fE = (e, t) => {
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
function cE(...e) {
  return (...t) => e.slice(1).reduce((n, r) => r(n), e[0](...t));
}
function lE(...e) {
  return e.reverse().reduce((t, n) => n(t));
}
const hE = (e, ...t) => (...n) => e(...t, ...n), pE = (e, t) => (n) => e({
  ...t,
  ...n
}), dE = (e) => new Proxy(
  {},
  {
    get: (t, n) => e(n)
  }
), _E = (e, t, n, r) => function(...s) {
  const o = n ? n(...s) : JSON.stringify({ args: s }), a = e[o];
  if (a !== void 0 && (!a.exp || a.exp > (/* @__PURE__ */ new Date()).getTime()))
    return a.value;
  const u = t(...s);
  return e[o] = {
    exp: r ? (/* @__PURE__ */ new Date()).getTime() + r : null,
    value: u
  }, u;
}, vE = (e, t = {}) => _E({}, e, t.key ?? null, t.ttl ?? null), gE = ({ delay: e }, t) => {
  let n, r = !0;
  const i = (...s) => {
    r ? (clearTimeout(n), n = setTimeout(() => {
      r && t(...s), n = void 0;
    }, e)) : t(...s);
  };
  return i.isPending = () => n !== void 0, i.cancel = () => {
    r = !1;
  }, i.flush = (...s) => t(...s), i;
}, yE = ({ interval: e }, t) => {
  let n = !0, r;
  const i = (...s) => {
    n && (t(...s), n = !1, r = setTimeout(() => {
      n = !0, r = void 0;
    }, e));
  };
  return i.isThrottled = () => r !== void 0, i;
}, bE = (e, t) => {
  const n = () => {
  };
  return new Proxy(Object.assign(n, e), {
    get: (r, i) => r[i],
    set: (r, i, s) => (r[i] = s, !0),
    apply: (r, i, s) => t(Object.assign({}, r))(...s)
  });
};
function mE(e, t, n) {
  return typeof e == "number" && typeof t == "number" && (typeof n > "u" || typeof n == "number") ? (typeof n > "u" && (n = t, t = 0), e >= Math.min(t, n) && e < Math.max(t, n)) : !1;
}
const wE = (e, t) => {
  const n = t === void 0 ? 0 : t;
  if (e == null)
    return n;
  const r = parseFloat(e);
  return isNaN(r) ? n : r;
}, uv = (e, t) => {
  const n = t === void 0 ? 0 : t;
  if (e == null)
    return n;
  const r = parseInt(e);
  return isNaN(r) ? n : r;
}, AE = (e, t = (n) => n === void 0) => e ? Object.keys(e).reduce((r, i) => (t(e[i]) || (r[i] = e[i]), r), {}) : {}, nl = (e, t) => Object.keys(e).reduce((r, i) => (r[t(i, e[i])] = e[i], r), {}), OE = (e, t) => Object.keys(e).reduce((r, i) => (r[i] = t(e[i], i), r), {}), EE = (e, t) => e ? Object.entries(e).reduce((n, [r, i]) => {
  const [s, o] = t(r, i);
  return n[s] = o, n;
}, {}) : {}, SE = (e) => e ? Object.keys(e).reduce((n, r) => (n[e[r]] = r, n), {}) : {}, xE = (e) => nl(e, (t) => t.toLowerCase()), RE = (e) => nl(e, (t) => t.toUpperCase()), fv = (e) => {
  if (Q_(e))
    return e;
  if (typeof e == "function")
    return e.bind({});
  const t = new e.constructor();
  return Object.getOwnPropertyNames(e).forEach((n) => {
    t[n] = e[n];
  }), t;
}, TE = (e, t) => {
  if (!e) return [];
  const n = Object.entries(e);
  return n.length === 0 ? [] : n.reduce((r, i) => (r.push(t(i[0], i[1])), r), []);
}, PE = (e, t) => e ? t.reduce((n, r) => (Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r]), n), {}) : {}, NE = (e, t) => e ? !t || t.length === 0 ? e : t.reduce(
  (n, r) => (delete n[r], n),
  { ...e }
) : {}, cv = (e, t, n) => {
  const r = t.split(/[\.\[\]]/g);
  let i = e;
  for (const s of r) {
    if (i === null || i === void 0) return n;
    const o = s.replace(/['"]/g, "");
    o.trim() !== "" && (i = i[o]);
  }
  return i === void 0 ? n : i;
}, lv = (e, t, n) => {
  if (!e) return {};
  if (!t || n === void 0) return e;
  const r = t.split(/[\.\[\]]/g).filter((o) => !!o.trim()), i = (o) => {
    if (r.length > 1) {
      const a = r.shift(), u = uv(r[0], null) !== null;
      o[a] = o[a] === void 0 ? u ? [] : {} : o[a], i(o[a]);
    } else
      o[r[0]] = n;
  }, s = fv(e);
  return i(s), s;
}, hv = (e, t) => !e || !t ? e ?? t ?? {} : Object.entries({ ...e, ...t }).reduce(
  (n, [r, i]) => ({
    ...n,
    [r]: Zc(e[r]) ? hv(e[r], i) : i
  }),
  {}
), pv = (e) => {
  if (!e) return [];
  const t = (n, r) => Zc(n) ? Object.entries(n).flatMap(
    ([i, s]) => t(s, [...r, i])
  ) : Ms(n) ? n.flatMap((i, s) => t(i, [...r, `${s}`])) : [r.join(".")];
  return t(e, []);
}, $E = (e) => e ? iv(
  pv(e),
  (t) => t,
  (t) => cv(e, t)
) : {}, ME = (e) => e ? Object.keys(e).reduce((t, n) => lv(t, n, e[n]), {}) : {}, rl = (e, t) => Math.floor(Math.random() * (t - e + 1) + e), IE = (e) => {
  const t = e.length;
  if (t === 0)
    return null;
  const n = rl(0, t - 1);
  return e[n];
}, DE = (e) => e.map((t) => ({ rand: Math.random(), value: t })).sort((t, n) => t.rand - n.rand).map((t) => t.value), CE = (e, t = "") => {
  const n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" + t;
  return ov(
    e,
    (r) => r + n.charAt(rl(0, n.length - 1)),
    ""
  );
}, LE = (e, t = (n) => `${n}`) => {
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
      return tl(0, _ - 1).reduce(
        (v) => h > 0 ? u(v) : f(v),
        l
      );
    }
  };
}, ao = (e) => {
  if (!e || e.length === 0) return "";
  const t = e.toLowerCase();
  return t.substring(0, 1).toUpperCase() + t.substring(1, t.length);
}, jE = (e) => {
  const t = e?.replace(/([A-Z])+/g, ao)?.split(/(?=[A-Z])|[\.\-\s_]/).map((n) => n.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.length === 1 ? t[0] : t.reduce((n, r) => `${n}${r.charAt(0).toUpperCase()}${r.slice(1)}`);
}, FE = (e, t) => {
  const n = e?.replace(/([A-Z])+/g, ao).split(/(?=[A-Z])|[\.\-\s_]/).map((i) => i.toLowerCase()) ?? [];
  if (n.length === 0) return "";
  if (n.length === 1) return n[0];
  const r = n.reduce((i, s) => `${i}_${s.toLowerCase()}`);
  return t?.splitOnNumber === !1 ? r : r.replace(/([A-Za-z]{1}[0-9]{1})/, (i) => `${i[0]}_${i[1]}`);
}, BE = (e) => {
  const t = e?.replace(/([A-Z])+/g, ao)?.split(/(?=[A-Z])|[\.\-\s_]/).map((n) => n.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.length === 1 ? t[0] : t.reduce((n, r) => `${n}-${r.toLowerCase()}`);
}, zE = (e) => {
  const t = e?.split(/[\.\-\s_]/).map((n) => n.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join("");
}, UE = (e) => e ? e.split(/(?=[A-Z])|[\.\-\s_]/).map((t) => t.trim()).filter((t) => !!t).map((t) => ao(t.toLowerCase())).join(" ") : "", VE = (e, t, n = /\{\{(.+?)\}\}/g) => Array.from(e.matchAll(n)).reduce((r, i) => r.replace(i[0], t[i[1]]), e), kE = (e, t = " ") => {
  if (!e) return "";
  const n = t.replace(/[\W]{1}/g, "\\$&"), r = new RegExp(`^[${n}]+|[${n}]+$`, "g");
  return e.replace(r, "");
}, B5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  all: aE,
  alphabetical: UO,
  assign: hv,
  boil: Qc,
  callable: bE,
  camel: jE,
  capitalize: ao,
  chain: cE,
  clone: fv,
  cluster: HO,
  compose: lE,
  construct: ME,
  counting: VO,
  crush: $E,
  dash: BE,
  debounce: gE,
  defer: sE,
  diff: tE,
  draw: IE,
  first: BO,
  flat: YO,
  fork: sv,
  get: cv,
  group: CO,
  guard: fE,
  inRange: mE,
  intersects: XO,
  invert: SE,
  isArray: Ms,
  isDate: ev,
  isEmpty: DO,
  isEqual: nv,
  isFloat: IO,
  isFunction: oo,
  isInt: MO,
  isNumber: di,
  isObject: Zc,
  isPrimitive: Q_,
  isPromise: tv,
  isString: $O,
  isSymbol: Z_,
  iterate: ov,
  keys: pv,
  last: zO,
  list: tl,
  listify: TE,
  lowerize: xE,
  map: iE,
  mapEntries: EE,
  mapKeys: nl,
  mapValues: OE,
  max: qO,
  memo: vE,
  merge: JO,
  min: GO,
  objectify: iv,
  omit: NE,
  parallel: oE,
  partial: hE,
  partob: pE,
  pascal: zE,
  pick: PE,
  proxied: dE,
  random: rl,
  range: el,
  reduce: rE,
  replace: kO,
  replaceOrAppend: ZO,
  retry: uE,
  select: WO,
  series: LE,
  set: lv,
  shake: AE,
  shift: nE,
  shuffle: DE,
  sift: eE,
  sleep: Yf,
  snake: FE,
  sort: rv,
  sum: FO,
  template: VE,
  throttle: yE,
  title: UE,
  toFloat: wE,
  toInt: uv,
  toggle: QO,
  trim: kE,
  try: Ei,
  tryit: Ei,
  uid: CE,
  unique: KO,
  upperize: RE,
  zip: LO,
  zipToObject: jO
}, Symbol.toStringTag, { value: "Module" }));
var dv = typeof global == "object" && global && global.Object === Object && global, WE = typeof self == "object" && self && self.Object === Object && self, Ee = dv || WE || Function("return this")(), Ie = Ee.Symbol, _v = Object.prototype, qE = _v.hasOwnProperty, GE = _v.toString, cs = Ie ? Ie.toStringTag : void 0;
function HE(e) {
  var t = qE.call(e, cs), n = e[cs];
  try {
    e[cs] = void 0;
    var r = !0;
  } catch {
  }
  var i = GE.call(e);
  return r && (t ? e[cs] = n : delete e[cs]), i;
}
var KE = Object.prototype, YE = KE.toString;
function XE(e) {
  return YE.call(e);
}
var JE = "[object Null]", ZE = "[object Undefined]", Tp = Ie ? Ie.toStringTag : void 0;
function qe(e) {
  return e == null ? e === void 0 ? ZE : JE : Tp && Tp in Object(e) ? HE(e) : XE(e);
}
function se(e) {
  return e != null && typeof e == "object";
}
var QE = "[object Symbol]";
function rt(e) {
  return typeof e == "symbol" || se(e) && qe(e) == QE;
}
var eS = NaN;
function Pp(e) {
  return typeof e == "number" ? e : rt(e) ? eS : +e;
}
function re(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length, i = Array(r); ++n < r; )
    i[n] = t(e[n], n, e);
  return i;
}
var M = Array.isArray, Np = Ie ? Ie.prototype : void 0, $p = Np ? Np.toString : void 0;
function yt(e) {
  if (typeof e == "string")
    return e;
  if (M(e))
    return re(e, yt) + "";
  if (rt(e))
    return $p ? $p.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function ru(e, t) {
  return function(n, r) {
    var i;
    if (n === void 0 && r === void 0)
      return t;
    if (n !== void 0 && (i = n), r !== void 0) {
      if (i === void 0)
        return r;
      typeof n == "string" || typeof r == "string" ? (n = yt(n), r = yt(r)) : (n = Pp(n), r = Pp(r)), i = e(n, r);
    }
    return i;
  };
}
var vv = ru(function(e, t) {
  return e + t;
}, 0), tS = /\s/;
function gv(e) {
  for (var t = e.length; t-- && tS.test(e.charAt(t)); )
    ;
  return t;
}
var nS = /^\s+/;
function yv(e) {
  return e && e.slice(0, gv(e) + 1).replace(nS, "");
}
function ie(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var Mp = NaN, rS = /^[-+]0x[0-9a-f]+$/i, iS = /^0b[01]+$/i, sS = /^0o[0-7]+$/i, oS = parseInt;
function pt(e) {
  if (typeof e == "number")
    return e;
  if (rt(e))
    return Mp;
  if (ie(e)) {
    var t = typeof e.valueOf == "function" ? e.valueOf() : e;
    e = ie(t) ? t + "" : t;
  }
  if (typeof e != "string")
    return e === 0 ? e : +e;
  e = yv(e);
  var n = iS.test(e);
  return n || sS.test(e) ? oS(e.slice(2), n ? 2 : 8) : rS.test(e) ? Mp : +e;
}
var Ip = 1 / 0, aS = 17976931348623157e292;
function ln(e) {
  if (!e)
    return e === 0 ? e : 0;
  if (e = pt(e), e === Ip || e === -Ip) {
    var t = e < 0 ? -1 : 1;
    return t * aS;
  }
  return e === e ? e : 0;
}
function I(e) {
  var t = ln(e), n = t % 1;
  return t === t ? n ? t - n : t : 0;
}
var uS = "Expected a function";
function bv(e, t) {
  if (typeof t != "function")
    throw new TypeError(uS);
  return e = I(e), function() {
    if (--e < 1)
      return t.apply(this, arguments);
  };
}
function Ge(e) {
  return e;
}
var fS = "[object AsyncFunction]", cS = "[object Function]", lS = "[object GeneratorFunction]", hS = "[object Proxy]";
function bn(e) {
  if (!ie(e))
    return !1;
  var t = qe(e);
  return t == cS || t == lS || t == fS || t == hS;
}
var da = Ee["__core-js_shared__"], Dp = function() {
  var e = /[^.]+$/.exec(da && da.keys && da.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}();
function pS(e) {
  return !!Dp && Dp in e;
}
var dS = Function.prototype, _S = dS.toString;
function Wr(e) {
  if (e != null) {
    try {
      return _S.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
var vS = /[\\^$.*+?()[\]{}|]/g, gS = /^\[object .+?Constructor\]$/, yS = Function.prototype, bS = Object.prototype, mS = yS.toString, wS = bS.hasOwnProperty, AS = RegExp(
  "^" + mS.call(wS).replace(vS, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function mv(e) {
  if (!ie(e) || pS(e))
    return !1;
  var t = bn(e) ? AS : gS;
  return t.test(Wr(e));
}
function OS(e, t) {
  return e?.[t];
}
function qr(e, t) {
  var n = OS(e, t);
  return mv(n) ? n : void 0;
}
var Is = qr(Ee, "WeakMap"), Oa = Is && new Is(), wv = Oa ? function(e, t) {
  return Oa.set(e, t), e;
} : Ge, Cp = Object.create, Ui = /* @__PURE__ */ function() {
  function e() {
  }
  return function(t) {
    if (!ie(t))
      return {};
    if (Cp)
      return Cp(t);
    e.prototype = t;
    var n = new e();
    return e.prototype = void 0, n;
  };
}();
function Ds(e) {
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
    var n = Ui(e.prototype), r = e.apply(n, t);
    return ie(r) ? r : n;
  };
}
var ES = 1;
function SS(e, t, n) {
  var r = t & ES, i = Ds(e);
  function s() {
    var o = this && this !== Ee && this instanceof s ? i : e;
    return o.apply(r ? n : this, arguments);
  }
  return s;
}
function bt(e, t, n) {
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
var xS = Math.max;
function Av(e, t, n, r) {
  for (var i = -1, s = e.length, o = n.length, a = -1, u = t.length, f = xS(s - o, 0), c = Array(u + f), l = !r; ++a < u; )
    c[a] = t[a];
  for (; ++i < o; )
    (l || i < s) && (c[n[i]] = e[i]);
  for (; f--; )
    c[a++] = e[i++];
  return c;
}
var RS = Math.max;
function Ov(e, t, n, r) {
  for (var i = -1, s = e.length, o = -1, a = n.length, u = -1, f = t.length, c = RS(s - a, 0), l = Array(c + f), h = !r; ++i < c; )
    l[i] = e[i];
  for (var d = i; ++u < f; )
    l[d + u] = t[u];
  for (; ++o < a; )
    (h || i < s) && (l[d + n[o]] = e[i++]);
  return l;
}
function TS(e, t) {
  for (var n = e.length, r = 0; n--; )
    e[n] === t && ++r;
  return r;
}
function iu() {
}
var PS = 4294967295;
function C(e) {
  this.__wrapped__ = e, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = PS, this.__views__ = [];
}
C.prototype = Ui(iu.prototype);
C.prototype.constructor = C;
function su() {
}
var il = Oa ? function(e) {
  return Oa.get(e);
} : su, _i = {}, NS = Object.prototype, $S = NS.hasOwnProperty;
function _a(e) {
  for (var t = e.name + "", n = _i[t], r = $S.call(_i, t) ? n.length : 0; r--; ) {
    var i = n[r], s = i.func;
    if (s == null || s == e)
      return i.name;
  }
  return t;
}
function Lt(e, t) {
  this.__wrapped__ = e, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = void 0;
}
Lt.prototype = Ui(iu.prototype);
Lt.prototype.constructor = Lt;
function tt(e, t) {
  var n = -1, r = e.length;
  for (t || (t = Array(r)); ++n < r; )
    t[n] = e[n];
  return t;
}
function Ev(e) {
  if (e instanceof C)
    return e.clone();
  var t = new Lt(e.__wrapped__, e.__chain__);
  return t.__actions__ = tt(e.__actions__), t.__index__ = e.__index__, t.__values__ = e.__values__, t;
}
var MS = Object.prototype, IS = MS.hasOwnProperty;
function p(e) {
  if (se(e) && !M(e) && !(e instanceof C)) {
    if (e instanceof Lt)
      return e;
    if (IS.call(e, "__wrapped__"))
      return Ev(e);
  }
  return new Lt(e);
}
p.prototype = iu.prototype;
p.prototype.constructor = p;
function Xf(e) {
  var t = _a(e), n = p[t];
  if (typeof n != "function" || !(t in C.prototype))
    return !1;
  if (e === n)
    return !0;
  var r = il(n);
  return !!r && e === r[0];
}
var DS = 800, CS = 16, LS = Date.now;
function Sv(e) {
  var t = 0, n = 0;
  return function() {
    var r = LS(), i = CS - (r - n);
    if (n = r, i > 0) {
      if (++t >= DS)
        return arguments[0];
    } else
      t = 0;
    return e.apply(void 0, arguments);
  };
}
var xv = Sv(wv), jS = /\{\n\/\* \[wrapped with (.+)\] \*/, FS = /,? & /;
function BS(e) {
  var t = e.match(jS);
  return t ? t[1].split(FS) : [];
}
var zS = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
function US(e, t) {
  var n = t.length;
  if (!n)
    return e;
  var r = n - 1;
  return t[r] = (n > 1 ? "& " : "") + t[r], t = t.join(n > 2 ? ", " : " "), e.replace(zS, `{
/* [wrapped with ` + t + `] */
`);
}
function ou(e) {
  return function() {
    return e;
  };
}
var Ea = function() {
  try {
    var e = qr(Object, "defineProperty");
    return e({}, "", {}), e;
  } catch {
  }
}(), VS = Ea ? function(e, t) {
  return Ea(e, "toString", {
    configurable: !0,
    enumerable: !1,
    value: ou(t),
    writable: !0
  });
} : Ge, sl = Sv(VS);
function zt(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r && t(e[n], n, e) !== !1; )
    ;
  return e;
}
function au(e, t, n, r) {
  for (var i = e.length, s = n + (r ? 1 : -1); r ? s-- : ++s < i; )
    if (t(e[s], s, e))
      return s;
  return -1;
}
function Rv(e) {
  return e !== e;
}
function kS(e, t, n) {
  for (var r = n - 1, i = e.length; ++r < i; )
    if (e[r] === t)
      return r;
  return -1;
}
function Vi(e, t, n) {
  return t === t ? kS(e, t, n) : au(e, Rv, n);
}
function uu(e, t) {
  var n = e == null ? 0 : e.length;
  return !!n && Vi(e, t, 0) > -1;
}
var WS = 1, qS = 2, GS = 8, HS = 16, KS = 32, YS = 64, XS = 128, JS = 256, ZS = 512, QS = [
  ["ary", XS],
  ["bind", WS],
  ["bindKey", qS],
  ["curry", GS],
  ["curryRight", HS],
  ["flip", ZS],
  ["partial", KS],
  ["partialRight", YS],
  ["rearg", JS]
];
function ex(e, t) {
  return zt(QS, function(n) {
    var r = "_." + n[0];
    t & n[1] && !uu(e, r) && e.push(r);
  }), e.sort();
}
function Tv(e, t, n) {
  var r = t + "";
  return sl(e, US(r, ex(BS(r), n)));
}
var tx = 4, nx = 8, Lp = 32, jp = 64;
function Pv(e, t, n, r, i, s, o, a, u, f) {
  var c = t & nx, l = c ? o : void 0, h = c ? void 0 : o, d = c ? s : void 0, _ = c ? void 0 : s;
  t |= c ? Lp : jp, t &= ~(c ? jp : Lp), t & tx || (t &= -4);
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
  return Xf(e) && xv(g, v), g.placeholder = r, Tv(g, e, t);
}
function ki(e) {
  var t = e;
  return t.placeholder;
}
var rx = 9007199254740991, ix = /^(?:0|[1-9]\d*)$/;
function kn(e, t) {
  var n = typeof e;
  return t = t ?? rx, !!t && (n == "number" || n != "symbol" && ix.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
var sx = Math.min;
function ox(e, t) {
  for (var n = e.length, r = sx(t.length, n), i = tt(e); r--; ) {
    var s = t[r];
    e[r] = kn(s, n) ? i[s] : void 0;
  }
  return e;
}
var Fp = "__lodash_placeholder__";
function ir(e, t) {
  for (var n = -1, r = e.length, i = 0, s = []; ++n < r; ) {
    var o = e[n];
    (o === t || o === Fp) && (e[n] = Fp, s[i++] = n);
  }
  return s;
}
var ax = 1, ux = 2, fx = 8, cx = 16, lx = 128, hx = 512;
function fu(e, t, n, r, i, s, o, a, u, f) {
  var c = t & lx, l = t & ax, h = t & ux, d = t & (fx | cx), _ = t & hx, v = h ? void 0 : Ds(e);
  function g() {
    for (var y = arguments.length, b = Array(y), w = y; w--; )
      b[w] = arguments[w];
    if (d)
      var m = ki(g), A = TS(b, m);
    if (r && (b = Av(b, r, i, d)), s && (b = Ov(b, s, o, d)), y -= A, d && y < f) {
      var S = ir(b, m);
      return Pv(
        e,
        t,
        fu,
        g.placeholder,
        n,
        b,
        S,
        a,
        u,
        f - y
      );
    }
    var T = l ? n : this, F = h ? T[e] : e;
    return y = b.length, a ? b = ox(b, a) : _ && y > 1 && b.reverse(), c && u < y && (b.length = u), this && this !== Ee && this instanceof g && (F = v || Ds(F)), F.apply(T, b);
  }
  return g;
}
function px(e, t, n) {
  var r = Ds(e);
  function i() {
    for (var s = arguments.length, o = Array(s), a = s, u = ki(i); a--; )
      o[a] = arguments[a];
    var f = s < 3 && o[0] !== u && o[s - 1] !== u ? [] : ir(o, u);
    if (s -= f.length, s < n)
      return Pv(
        e,
        t,
        fu,
        i.placeholder,
        void 0,
        o,
        f,
        void 0,
        void 0,
        n - s
      );
    var c = this && this !== Ee && this instanceof i ? r : e;
    return bt(c, this, o);
  }
  return i;
}
var dx = 1;
function _x(e, t, n, r) {
  var i = t & dx, s = Ds(e);
  function o() {
    for (var a = -1, u = arguments.length, f = -1, c = r.length, l = Array(c + u), h = this && this !== Ee && this instanceof o ? s : e; ++f < c; )
      l[f] = r[f];
    for (; u--; )
      l[f++] = arguments[++a];
    return bt(h, i ? n : this, l);
  }
  return o;
}
var Bp = "__lodash_placeholder__", mf = 1, vx = 2, gx = 4, zp = 8, ls = 128, Up = 256, yx = Math.min;
function bx(e, t) {
  var n = e[1], r = t[1], i = n | r, s = i < (mf | vx | ls), o = r == ls && n == zp || r == ls && n == Up && e[7].length <= t[8] || r == (ls | Up) && t[7].length <= t[8] && n == zp;
  if (!(s || o))
    return e;
  r & mf && (e[2] = t[2], i |= n & mf ? 0 : gx);
  var a = t[3];
  if (a) {
    var u = e[3];
    e[3] = u ? Av(u, a, t[4]) : a, e[4] = u ? ir(e[3], Bp) : t[4];
  }
  return a = t[5], a && (u = e[5], e[5] = u ? Ov(u, a, t[6]) : a, e[6] = u ? ir(e[5], Bp) : t[6]), a = t[7], a && (e[7] = a), r & ls && (e[8] = e[8] == null ? t[8] : yx(e[8], t[8])), e[9] == null && (e[9] = t[9]), e[0] = t[0], e[1] = i, e;
}
var mx = "Expected a function", Vp = 1, wx = 2, kp = 8, Wp = 16, qp = 32, Ax = 64, Gp = Math.max;
function Wn(e, t, n, r, i, s, o, a) {
  var u = t & wx;
  if (!u && typeof e != "function")
    throw new TypeError(mx);
  var f = r ? r.length : 0;
  if (f || (t &= -97, r = i = void 0), o = o === void 0 ? o : Gp(I(o), 0), a = a === void 0 ? a : I(a), f -= i ? i.length : 0, t & Ax) {
    var c = r, l = i;
    r = i = void 0;
  }
  var h = u ? void 0 : il(e), d = [
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
  if (h && bx(d, h), e = d[0], t = d[1], n = d[2], r = d[3], i = d[4], a = d[9] = d[9] === void 0 ? u ? 0 : e.length : Gp(d[9] - f, 0), !a && t & (kp | Wp) && (t &= -25), !t || t == Vp)
    var _ = SS(e, t, n);
  else t == kp || t == Wp ? _ = px(e, t, a) : (t == qp || t == (Vp | qp)) && !i.length ? _ = _x(e, t, n, r) : _ = fu.apply(void 0, d);
  var v = h ? wv : xv;
  return Tv(v(_, d), e, t);
}
var Ox = 128;
function ol(e, t, n) {
  return t = n ? void 0 : t, t = e && t == null ? e.length : t, Wn(e, Ox, void 0, void 0, void 0, void 0, t);
}
function qn(e, t, n) {
  t == "__proto__" && Ea ? Ea(e, t, {
    configurable: !0,
    enumerable: !0,
    value: n,
    writable: !0
  }) : e[t] = n;
}
function Ut(e, t) {
  return e === t || e !== e && t !== t;
}
var Ex = Object.prototype, Sx = Ex.hasOwnProperty;
function uo(e, t, n) {
  var r = e[t];
  (!(Sx.call(e, t) && Ut(r, n)) || n === void 0 && !(t in e)) && qn(e, t, n);
}
function mn(e, t, n, r) {
  var i = !n;
  n || (n = {});
  for (var s = -1, o = t.length; ++s < o; ) {
    var a = t[s], u = r ? r(n[a], e[a], a, n, e) : void 0;
    u === void 0 && (u = e[a]), i ? qn(n, a, u) : uo(n, a, u);
  }
  return n;
}
var Hp = Math.max;
function Nv(e, t, n) {
  return t = Hp(t === void 0 ? e.length - 1 : t, 0), function() {
    for (var r = arguments, i = -1, s = Hp(r.length - t, 0), o = Array(s); ++i < s; )
      o[i] = r[t + i];
    i = -1;
    for (var a = Array(t + 1); ++i < t; )
      a[i] = r[i];
    return a[t] = n(o), bt(e, this, a);
  };
}
function D(e, t) {
  return sl(Nv(e, t, Ge), e + "");
}
var xx = 9007199254740991;
function fo(e) {
  return typeof e == "number" && e > -1 && e % 1 == 0 && e <= xx;
}
function He(e) {
  return e != null && fo(e.length) && !bn(e);
}
function ke(e, t, n) {
  if (!ie(n))
    return !1;
  var r = typeof t;
  return (r == "number" ? He(n) && kn(t, n.length) : r == "string" && t in n) ? Ut(n[t], e) : !1;
}
function Wi(e) {
  return D(function(t, n) {
    var r = -1, i = n.length, s = i > 1 ? n[i - 1] : void 0, o = i > 2 ? n[2] : void 0;
    for (s = e.length > 3 && typeof s == "function" ? (i--, s) : void 0, o && ke(n[0], n[1], o) && (s = i < 3 ? void 0 : s, i = 1), t = Object(t); ++r < i; ) {
      var a = n[r];
      a && e(t, a, r, s);
    }
    return t;
  });
}
var Rx = Object.prototype;
function co(e) {
  var t = e && e.constructor, n = typeof t == "function" && t.prototype || Rx;
  return e === n;
}
function al(e, t) {
  for (var n = -1, r = Array(e); ++n < e; )
    r[n] = t(n);
  return r;
}
var Tx = "[object Arguments]";
function Kp(e) {
  return se(e) && qe(e) == Tx;
}
var $v = Object.prototype, Px = $v.hasOwnProperty, Nx = $v.propertyIsEnumerable, sr = Kp(/* @__PURE__ */ function() {
  return arguments;
}()) ? Kp : function(e) {
  return se(e) && Px.call(e, "callee") && !Nx.call(e, "callee");
};
function cu() {
  return !1;
}
var Mv = typeof exports == "object" && exports && !exports.nodeType && exports, Yp = Mv && typeof module == "object" && module && !module.nodeType && module, $x = Yp && Yp.exports === Mv, Xp = $x ? Ee.Buffer : void 0, Mx = Xp ? Xp.isBuffer : void 0, zn = Mx || cu, Ix = "[object Arguments]", Dx = "[object Array]", Cx = "[object Boolean]", Lx = "[object Date]", jx = "[object Error]", Fx = "[object Function]", Bx = "[object Map]", zx = "[object Number]", Ux = "[object Object]", Vx = "[object RegExp]", kx = "[object Set]", Wx = "[object String]", qx = "[object WeakMap]", Gx = "[object ArrayBuffer]", Hx = "[object DataView]", Kx = "[object Float32Array]", Yx = "[object Float64Array]", Xx = "[object Int8Array]", Jx = "[object Int16Array]", Zx = "[object Int32Array]", Qx = "[object Uint8Array]", e2 = "[object Uint8ClampedArray]", t2 = "[object Uint16Array]", n2 = "[object Uint32Array]", ee = {};
ee[Kx] = ee[Yx] = ee[Xx] = ee[Jx] = ee[Zx] = ee[Qx] = ee[e2] = ee[t2] = ee[n2] = !0;
ee[Ix] = ee[Dx] = ee[Gx] = ee[Cx] = ee[Hx] = ee[Lx] = ee[jx] = ee[Fx] = ee[Bx] = ee[zx] = ee[Ux] = ee[Vx] = ee[kx] = ee[Wx] = ee[qx] = !1;
function r2(e) {
  return se(e) && fo(e.length) && !!ee[qe(e)];
}
function mt(e) {
  return function(t) {
    return e(t);
  };
}
var Iv = typeof exports == "object" && exports && !exports.nodeType && exports, bs = Iv && typeof module == "object" && module && !module.nodeType && module, i2 = bs && bs.exports === Iv, wf = i2 && dv.process, jt = function() {
  try {
    var e = bs && bs.require && bs.require("util").types;
    return e || wf && wf.binding && wf.binding("util");
  } catch {
  }
}(), Jp = jt && jt.isTypedArray, Gr = Jp ? mt(Jp) : r2, s2 = Object.prototype, o2 = s2.hasOwnProperty;
function Dv(e, t) {
  var n = M(e), r = !n && sr(e), i = !n && !r && zn(e), s = !n && !r && !i && Gr(e), o = n || r || i || s, a = o ? al(e.length, String) : [], u = a.length;
  for (var f in e)
    (t || o2.call(e, f)) && !(o && // Safari 9 has enumerable `arguments.length` in strict mode.
    (f == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    i && (f == "offset" || f == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    s && (f == "buffer" || f == "byteLength" || f == "byteOffset") || // Skip index properties.
    kn(f, u))) && a.push(f);
  return a;
}
function Cv(e, t) {
  return function(n) {
    return e(t(n));
  };
}
var a2 = Cv(Object.keys, Object), u2 = Object.prototype, f2 = u2.hasOwnProperty;
function ul(e) {
  if (!co(e))
    return a2(e);
  var t = [];
  for (var n in Object(e))
    f2.call(e, n) && n != "constructor" && t.push(n);
  return t;
}
function _e(e) {
  return He(e) ? Dv(e) : ul(e);
}
var c2 = Object.prototype, l2 = c2.hasOwnProperty, Lv = Wi(function(e, t) {
  if (co(t) || He(t)) {
    mn(t, _e(t), e);
    return;
  }
  for (var n in t)
    l2.call(t, n) && uo(e, n, t[n]);
});
function h2(e) {
  var t = [];
  if (e != null)
    for (var n in Object(e))
      t.push(n);
  return t;
}
var p2 = Object.prototype, d2 = p2.hasOwnProperty;
function _2(e) {
  if (!ie(e))
    return h2(e);
  var t = co(e), n = [];
  for (var r in e)
    r == "constructor" && (t || !d2.call(e, r)) || n.push(r);
  return n;
}
function Ke(e) {
  return He(e) ? Dv(e, !0) : _2(e);
}
var Jf = Wi(function(e, t) {
  mn(t, Ke(t), e);
}), Cs = Wi(function(e, t, n, r) {
  mn(t, Ke(t), e, r);
}), jv = Wi(function(e, t, n, r) {
  mn(t, _e(t), e, r);
}), v2 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, g2 = /^\w*$/;
function fl(e, t) {
  if (M(e))
    return !1;
  var n = typeof e;
  return n == "number" || n == "symbol" || n == "boolean" || e == null || rt(e) ? !0 : g2.test(e) || !v2.test(e) || t != null && e in Object(t);
}
var Ls = qr(Object, "create");
function y2() {
  this.__data__ = Ls ? Ls(null) : {}, this.size = 0;
}
function b2(e) {
  var t = this.has(e) && delete this.__data__[e];
  return this.size -= t ? 1 : 0, t;
}
var m2 = "__lodash_hash_undefined__", w2 = Object.prototype, A2 = w2.hasOwnProperty;
function O2(e) {
  var t = this.__data__;
  if (Ls) {
    var n = t[e];
    return n === m2 ? void 0 : n;
  }
  return A2.call(t, e) ? t[e] : void 0;
}
var E2 = Object.prototype, S2 = E2.hasOwnProperty;
function x2(e) {
  var t = this.__data__;
  return Ls ? t[e] !== void 0 : S2.call(t, e);
}
var R2 = "__lodash_hash_undefined__";
function T2(e, t) {
  var n = this.__data__;
  return this.size += this.has(e) ? 0 : 1, n[e] = Ls && t === void 0 ? R2 : t, this;
}
function Nr(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
Nr.prototype.clear = y2;
Nr.prototype.delete = b2;
Nr.prototype.get = O2;
Nr.prototype.has = x2;
Nr.prototype.set = T2;
function P2() {
  this.__data__ = [], this.size = 0;
}
function lu(e, t) {
  for (var n = e.length; n--; )
    if (Ut(e[n][0], t))
      return n;
  return -1;
}
var N2 = Array.prototype, $2 = N2.splice;
function M2(e) {
  var t = this.__data__, n = lu(t, e);
  if (n < 0)
    return !1;
  var r = t.length - 1;
  return n == r ? t.pop() : $2.call(t, n, 1), --this.size, !0;
}
function I2(e) {
  var t = this.__data__, n = lu(t, e);
  return n < 0 ? void 0 : t[n][1];
}
function D2(e) {
  return lu(this.__data__, e) > -1;
}
function C2(e, t) {
  var n = this.__data__, r = lu(n, e);
  return r < 0 ? (++this.size, n.push([e, t])) : n[r][1] = t, this;
}
function Gn(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
Gn.prototype.clear = P2;
Gn.prototype.delete = M2;
Gn.prototype.get = I2;
Gn.prototype.has = D2;
Gn.prototype.set = C2;
var js = qr(Ee, "Map");
function L2() {
  this.size = 0, this.__data__ = {
    hash: new Nr(),
    map: new (js || Gn)(),
    string: new Nr()
  };
}
function j2(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function hu(e, t) {
  var n = e.__data__;
  return j2(t) ? n[typeof t == "string" ? "string" : "hash"] : n.map;
}
function F2(e) {
  var t = hu(this, e).delete(e);
  return this.size -= t ? 1 : 0, t;
}
function B2(e) {
  return hu(this, e).get(e);
}
function z2(e) {
  return hu(this, e).has(e);
}
function U2(e, t) {
  var n = hu(this, e), r = n.size;
  return n.set(e, t), this.size += n.size == r ? 0 : 1, this;
}
function Hn(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
Hn.prototype.clear = L2;
Hn.prototype.delete = F2;
Hn.prototype.get = B2;
Hn.prototype.has = z2;
Hn.prototype.set = U2;
var V2 = "Expected a function";
function lo(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function")
    throw new TypeError(V2);
  var n = function() {
    var r = arguments, i = t ? t.apply(this, r) : r[0], s = n.cache;
    if (s.has(i))
      return s.get(i);
    var o = e.apply(this, r);
    return n.cache = s.set(i, o) || s, o;
  };
  return n.cache = new (lo.Cache || Hn)(), n;
}
lo.Cache = Hn;
var k2 = 500;
function W2(e) {
  var t = lo(e, function(r) {
    return n.size === k2 && n.clear(), r;
  }), n = t.cache;
  return t;
}
var q2 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, G2 = /\\(\\)?/g, Fv = W2(function(e) {
  var t = [];
  return e.charCodeAt(0) === 46 && t.push(""), e.replace(q2, function(n, r, i, s) {
    t.push(i ? s.replace(G2, "$1") : r || n);
  }), t;
});
function k(e) {
  return e == null ? "" : yt(e);
}
function hr(e, t) {
  return M(e) ? e : fl(e, t) ? [e] : Fv(k(e));
}
function wn(e) {
  if (typeof e == "string" || rt(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function Hr(e, t) {
  t = hr(t, e);
  for (var n = 0, r = t.length; e != null && n < r; )
    e = e[wn(t[n++])];
  return n && n == r ? e : void 0;
}
function pu(e, t, n) {
  var r = e == null ? void 0 : Hr(e, t);
  return r === void 0 ? n : r;
}
function cl(e, t) {
  for (var n = -1, r = t.length, i = Array(r), s = e == null; ++n < r; )
    i[n] = s ? void 0 : pu(e, t[n]);
  return i;
}
function pr(e, t) {
  for (var n = -1, r = t.length, i = e.length; ++n < r; )
    e[i + n] = t[n];
  return e;
}
var Zp = Ie ? Ie.isConcatSpreadable : void 0;
function H2(e) {
  return M(e) || sr(e) || !!(Zp && e && e[Zp]);
}
function Pe(e, t, n, r, i) {
  var s = -1, o = e.length;
  for (n || (n = H2), i || (i = []); ++s < o; ) {
    var a = e[s];
    t > 0 && n(a) ? t > 1 ? Pe(a, t - 1, n, r, i) : pr(i, a) : r || (i[i.length] = a);
  }
  return i;
}
function ll(e) {
  var t = e == null ? 0 : e.length;
  return t ? Pe(e, 1) : [];
}
function Kn(e) {
  return sl(Nv(e, void 0, ll), e + "");
}
var Bv = Kn(cl), du = Cv(Object.getPrototypeOf, Object), K2 = "[object Object]", Y2 = Function.prototype, X2 = Object.prototype, zv = Y2.toString, J2 = X2.hasOwnProperty, Z2 = zv.call(Object);
function qi(e) {
  if (!se(e) || qe(e) != K2)
    return !1;
  var t = du(e);
  if (t === null)
    return !0;
  var n = J2.call(t, "constructor") && t.constructor;
  return typeof n == "function" && n instanceof n && zv.call(n) == Z2;
}
var Q2 = "[object DOMException]", eR = "[object Error]";
function _u(e) {
  if (!se(e))
    return !1;
  var t = qe(e);
  return t == eR || t == Q2 || typeof e.message == "string" && typeof e.name == "string" && !qi(e);
}
var hl = D(function(e, t) {
  try {
    return bt(e, void 0, t);
  } catch (n) {
    return _u(n) ? n : new Error(n);
  }
}), tR = "Expected a function";
function pl(e, t) {
  var n;
  if (typeof t != "function")
    throw new TypeError(tR);
  return e = I(e), function() {
    return --e > 0 && (n = t.apply(this, arguments)), e <= 1 && (t = void 0), n;
  };
}
var nR = 1, rR = 32, ho = D(function(e, t, n) {
  var r = nR;
  if (n.length) {
    var i = ir(n, ki(ho));
    r |= rR;
  }
  return Wn(e, r, t, n, i);
});
ho.placeholder = {};
var Uv = Kn(function(e, t) {
  return zt(t, function(n) {
    n = wn(n), qn(e, n, ho(e[n], e));
  }), e;
}), iR = 1, sR = 2, oR = 32, vu = D(function(e, t, n) {
  var r = iR | sR;
  if (n.length) {
    var i = ir(n, ki(vu));
    r |= oR;
  }
  return Wn(t, r, e, n, i);
});
vu.placeholder = {};
function Ft(e, t, n) {
  var r = -1, i = e.length;
  t < 0 && (t = -t > i ? 0 : i + t), n = n > i ? i : n, n < 0 && (n += i), i = t > n ? 0 : n - t >>> 0, t >>>= 0;
  for (var s = Array(i); ++r < i; )
    s[r] = e[r + t];
  return s;
}
function dr(e, t, n) {
  var r = e.length;
  return n = n === void 0 ? r : n, !t && n >= r ? e : Ft(e, t, n);
}
var aR = "\\ud800-\\udfff", uR = "\\u0300-\\u036f", fR = "\\ufe20-\\ufe2f", cR = "\\u20d0-\\u20ff", lR = uR + fR + cR, hR = "\\ufe0e\\ufe0f", pR = "\\u200d", dR = RegExp("[" + pR + aR + lR + hR + "]");
function Gi(e) {
  return dR.test(e);
}
function _R(e) {
  return e.split("");
}
var Vv = "\\ud800-\\udfff", vR = "\\u0300-\\u036f", gR = "\\ufe20-\\ufe2f", yR = "\\u20d0-\\u20ff", bR = vR + gR + yR, mR = "\\ufe0e\\ufe0f", wR = "[" + Vv + "]", Zf = "[" + bR + "]", Qf = "\\ud83c[\\udffb-\\udfff]", AR = "(?:" + Zf + "|" + Qf + ")", kv = "[^" + Vv + "]", Wv = "(?:\\ud83c[\\udde6-\\uddff]){2}", qv = "[\\ud800-\\udbff][\\udc00-\\udfff]", OR = "\\u200d", Gv = AR + "?", Hv = "[" + mR + "]?", ER = "(?:" + OR + "(?:" + [kv, Wv, qv].join("|") + ")" + Hv + Gv + ")*", SR = Hv + Gv + ER, xR = "(?:" + [kv + Zf + "?", Zf, Wv, qv, wR].join("|") + ")", RR = RegExp(Qf + "(?=" + Qf + ")|" + xR + SR, "g");
function TR(e) {
  return e.match(RR) || [];
}
function Qt(e) {
  return Gi(e) ? TR(e) : _R(e);
}
function Kv(e) {
  return function(t) {
    t = k(t);
    var n = Gi(t) ? Qt(t) : void 0, r = n ? n[0] : t.charAt(0), i = n ? dr(n, 1).join("") : t.slice(1);
    return r[e]() + i;
  };
}
var gu = Kv("toUpperCase");
function dl(e) {
  return gu(k(e).toLowerCase());
}
function _l(e, t, n, r) {
  var i = -1, s = e == null ? 0 : e.length;
  for (r && s && (n = e[++i]); ++i < s; )
    n = t(n, e[i], i, e);
  return n;
}
function vl(e) {
  return function(t) {
    return e?.[t];
  };
}
var PR = {
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
}, NR = vl(PR), $R = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, MR = "\\u0300-\\u036f", IR = "\\ufe20-\\ufe2f", DR = "\\u20d0-\\u20ff", CR = MR + IR + DR, LR = "[" + CR + "]", jR = RegExp(LR, "g");
function gl(e) {
  return e = k(e), e && e.replace($R, NR).replace(jR, "");
}
var FR = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
function BR(e) {
  return e.match(FR) || [];
}
var zR = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
function UR(e) {
  return zR.test(e);
}
var Yv = "\\ud800-\\udfff", VR = "\\u0300-\\u036f", kR = "\\ufe20-\\ufe2f", WR = "\\u20d0-\\u20ff", qR = VR + kR + WR, Xv = "\\u2700-\\u27bf", Jv = "a-z\\xdf-\\xf6\\xf8-\\xff", GR = "\\xac\\xb1\\xd7\\xf7", HR = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", KR = "\\u2000-\\u206f", YR = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", Zv = "A-Z\\xc0-\\xd6\\xd8-\\xde", XR = "\\ufe0e\\ufe0f", Qv = GR + HR + KR + YR, eg = "['’]", Qp = "[" + Qv + "]", JR = "[" + qR + "]", tg = "\\d+", ZR = "[" + Xv + "]", ng = "[" + Jv + "]", rg = "[^" + Yv + Qv + tg + Xv + Jv + Zv + "]", QR = "\\ud83c[\\udffb-\\udfff]", eT = "(?:" + JR + "|" + QR + ")", tT = "[^" + Yv + "]", ig = "(?:\\ud83c[\\udde6-\\uddff]){2}", sg = "[\\ud800-\\udbff][\\udc00-\\udfff]", fi = "[" + Zv + "]", nT = "\\u200d", ed = "(?:" + ng + "|" + rg + ")", rT = "(?:" + fi + "|" + rg + ")", td = "(?:" + eg + "(?:d|ll|m|re|s|t|ve))?", nd = "(?:" + eg + "(?:D|LL|M|RE|S|T|VE))?", og = eT + "?", ag = "[" + XR + "]?", iT = "(?:" + nT + "(?:" + [tT, ig, sg].join("|") + ")" + ag + og + ")*", sT = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", oT = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", aT = ag + og + iT, uT = "(?:" + [ZR, ig, sg].join("|") + ")" + aT, fT = RegExp([
  fi + "?" + ng + "+" + td + "(?=" + [Qp, fi, "$"].join("|") + ")",
  rT + "+" + nd + "(?=" + [Qp, fi + ed, "$"].join("|") + ")",
  fi + "?" + ed + "+" + td,
  fi + "+" + nd,
  oT,
  sT,
  tg,
  uT
].join("|"), "g");
function cT(e) {
  return e.match(fT) || [];
}
function yl(e, t, n) {
  return e = k(e), t = n ? void 0 : t, t === void 0 ? UR(e) ? cT(e) : BR(e) : e.match(t) || [];
}
var lT = "['’]", hT = RegExp(lT, "g");
function Hi(e) {
  return function(t) {
    return _l(yl(gl(t).replace(hT, "")), e, "");
  };
}
var ug = Hi(function(e, t, n) {
  return t = t.toLowerCase(), e + (n ? dl(t) : t);
});
function fg() {
  if (!arguments.length)
    return [];
  var e = arguments[0];
  return M(e) ? e : [e];
}
var pT = Ee.isFinite, dT = Math.min;
function bl(e) {
  var t = Math[e];
  return function(n, r) {
    if (n = pt(n), r = r == null ? 0 : dT(I(r), 292), r && pT(n)) {
      var i = (k(n) + "e").split("e"), s = t(i[0] + "e" + (+i[1] + r));
      return i = (k(s) + "e").split("e"), +(i[0] + "e" + (+i[1] - r));
    }
    return t(n);
  };
}
var cg = bl("ceil");
function ml(e) {
  var t = p(e);
  return t.__chain__ = !0, t;
}
var _T = Math.ceil, vT = Math.max;
function lg(e, t, n) {
  (n ? ke(e, t, n) : t === void 0) ? t = 1 : t = vT(I(t), 0);
  var r = e == null ? 0 : e.length;
  if (!r || t < 1)
    return [];
  for (var i = 0, s = 0, o = Array(_T(r / t)); i < r; )
    o[s++] = Ft(e, i, i += t);
  return o;
}
function Kr(e, t, n) {
  return e === e && (n !== void 0 && (e = e <= n ? e : n), t !== void 0 && (e = e >= t ? e : t)), e;
}
function hg(e, t, n) {
  return n === void 0 && (n = t, t = void 0), n !== void 0 && (n = pt(n), n = n === n ? n : 0), t !== void 0 && (t = pt(t), t = t === t ? t : 0), Kr(pt(e), t, n);
}
function gT() {
  this.__data__ = new Gn(), this.size = 0;
}
function yT(e) {
  var t = this.__data__, n = t.delete(e);
  return this.size = t.size, n;
}
function bT(e) {
  return this.__data__.get(e);
}
function mT(e) {
  return this.__data__.has(e);
}
var wT = 200;
function AT(e, t) {
  var n = this.__data__;
  if (n instanceof Gn) {
    var r = n.__data__;
    if (!js || r.length < wT - 1)
      return r.push([e, t]), this.size = ++n.size, this;
    n = this.__data__ = new Hn(r);
  }
  return n.set(e, t), this.size = n.size, this;
}
function Kt(e) {
  var t = this.__data__ = new Gn(e);
  this.size = t.size;
}
Kt.prototype.clear = gT;
Kt.prototype.delete = yT;
Kt.prototype.get = bT;
Kt.prototype.has = mT;
Kt.prototype.set = AT;
function pg(e, t) {
  return e && mn(t, _e(t), e);
}
function OT(e, t) {
  return e && mn(t, Ke(t), e);
}
var dg = typeof exports == "object" && exports && !exports.nodeType && exports, rd = dg && typeof module == "object" && module && !module.nodeType && module, ET = rd && rd.exports === dg, id = ET ? Ee.Buffer : void 0, sd = id ? id.allocUnsafe : void 0;
function _g(e, t) {
  if (t)
    return e.slice();
  var n = e.length, r = sd ? sd(n) : new e.constructor(n);
  return e.copy(r), r;
}
function _r(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length, i = 0, s = []; ++n < r; ) {
    var o = e[n];
    t(o, n, e) && (s[i++] = o);
  }
  return s;
}
function yu() {
  return [];
}
var ST = Object.prototype, xT = ST.propertyIsEnumerable, od = Object.getOwnPropertySymbols, wl = od ? function(e) {
  return e == null ? [] : (e = Object(e), _r(od(e), function(t) {
    return xT.call(e, t);
  }));
} : yu;
function RT(e, t) {
  return mn(e, wl(e), t);
}
var TT = Object.getOwnPropertySymbols, vg = TT ? function(e) {
  for (var t = []; e; )
    pr(t, wl(e)), e = du(e);
  return t;
} : yu;
function PT(e, t) {
  return mn(e, vg(e), t);
}
function gg(e, t, n) {
  var r = t(e);
  return M(e) ? r : pr(r, n(e));
}
function ec(e) {
  return gg(e, _e, wl);
}
function Al(e) {
  return gg(e, Ke, vg);
}
var tc = qr(Ee, "DataView"), nc = qr(Ee, "Promise"), vi = qr(Ee, "Set"), ad = "[object Map]", NT = "[object Object]", ud = "[object Promise]", fd = "[object Set]", cd = "[object WeakMap]", ld = "[object DataView]", $T = Wr(tc), MT = Wr(js), IT = Wr(nc), DT = Wr(vi), CT = Wr(Is), Er = qe;
(tc && Er(new tc(new ArrayBuffer(1))) != ld || js && Er(new js()) != ad || nc && Er(nc.resolve()) != ud || vi && Er(new vi()) != fd || Is && Er(new Is()) != cd) && (Er = function(e) {
  var t = qe(e), n = t == NT ? e.constructor : void 0, r = n ? Wr(n) : "";
  if (r)
    switch (r) {
      case $T:
        return ld;
      case MT:
        return ad;
      case IT:
        return ud;
      case DT:
        return fd;
      case CT:
        return cd;
    }
  return t;
});
const pn = Er;
var LT = Object.prototype, jT = LT.hasOwnProperty;
function FT(e) {
  var t = e.length, n = new e.constructor(t);
  return t && typeof e[0] == "string" && jT.call(e, "index") && (n.index = e.index, n.input = e.input), n;
}
var Sa = Ee.Uint8Array;
function Ol(e) {
  var t = new e.constructor(e.byteLength);
  return new Sa(t).set(new Sa(e)), t;
}
function BT(e, t) {
  var n = t ? Ol(e.buffer) : e.buffer;
  return new e.constructor(n, e.byteOffset, e.byteLength);
}
var zT = /\w*$/;
function UT(e) {
  var t = new e.constructor(e.source, zT.exec(e));
  return t.lastIndex = e.lastIndex, t;
}
var hd = Ie ? Ie.prototype : void 0, pd = hd ? hd.valueOf : void 0;
function VT(e) {
  return pd ? Object(pd.call(e)) : {};
}
function yg(e, t) {
  var n = t ? Ol(e.buffer) : e.buffer;
  return new e.constructor(n, e.byteOffset, e.length);
}
var kT = "[object Boolean]", WT = "[object Date]", qT = "[object Map]", GT = "[object Number]", HT = "[object RegExp]", KT = "[object Set]", YT = "[object String]", XT = "[object Symbol]", JT = "[object ArrayBuffer]", ZT = "[object DataView]", QT = "[object Float32Array]", eP = "[object Float64Array]", tP = "[object Int8Array]", nP = "[object Int16Array]", rP = "[object Int32Array]", iP = "[object Uint8Array]", sP = "[object Uint8ClampedArray]", oP = "[object Uint16Array]", aP = "[object Uint32Array]";
function uP(e, t, n) {
  var r = e.constructor;
  switch (t) {
    case JT:
      return Ol(e);
    case kT:
    case WT:
      return new r(+e);
    case ZT:
      return BT(e, n);
    case QT:
    case eP:
    case tP:
    case nP:
    case rP:
    case iP:
    case sP:
    case oP:
    case aP:
      return yg(e, n);
    case qT:
      return new r();
    case GT:
    case YT:
      return new r(e);
    case HT:
      return UT(e);
    case KT:
      return new r();
    case XT:
      return VT(e);
  }
}
function bg(e) {
  return typeof e.constructor == "function" && !co(e) ? Ui(du(e)) : {};
}
var fP = "[object Map]";
function cP(e) {
  return se(e) && pn(e) == fP;
}
var dd = jt && jt.isMap, El = dd ? mt(dd) : cP, lP = "[object Set]";
function hP(e) {
  return se(e) && pn(e) == lP;
}
var _d = jt && jt.isSet, Sl = _d ? mt(_d) : hP, pP = 1, dP = 2, _P = 4, mg = "[object Arguments]", vP = "[object Array]", gP = "[object Boolean]", yP = "[object Date]", bP = "[object Error]", wg = "[object Function]", mP = "[object GeneratorFunction]", wP = "[object Map]", AP = "[object Number]", Ag = "[object Object]", OP = "[object RegExp]", EP = "[object Set]", SP = "[object String]", xP = "[object Symbol]", RP = "[object WeakMap]", TP = "[object ArrayBuffer]", PP = "[object DataView]", NP = "[object Float32Array]", $P = "[object Float64Array]", MP = "[object Int8Array]", IP = "[object Int16Array]", DP = "[object Int32Array]", CP = "[object Uint8Array]", LP = "[object Uint8ClampedArray]", jP = "[object Uint16Array]", FP = "[object Uint32Array]", X = {};
X[mg] = X[vP] = X[TP] = X[PP] = X[gP] = X[yP] = X[NP] = X[$P] = X[MP] = X[IP] = X[DP] = X[wP] = X[AP] = X[Ag] = X[OP] = X[EP] = X[SP] = X[xP] = X[CP] = X[LP] = X[jP] = X[FP] = !0;
X[bP] = X[wg] = X[RP] = !1;
function It(e, t, n, r, i, s) {
  var o, a = t & pP, u = t & dP, f = t & _P;
  if (n && (o = i ? n(e, r, i, s) : n(e)), o !== void 0)
    return o;
  if (!ie(e))
    return e;
  var c = M(e);
  if (c) {
    if (o = FT(e), !a)
      return tt(e, o);
  } else {
    var l = pn(e), h = l == wg || l == mP;
    if (zn(e))
      return _g(e, a);
    if (l == Ag || l == mg || h && !i) {
      if (o = u || h ? {} : bg(e), !a)
        return u ? PT(e, OT(o, e)) : RT(e, pg(o, e));
    } else {
      if (!X[l])
        return i ? e : {};
      o = uP(e, l, a);
    }
  }
  s || (s = new Kt());
  var d = s.get(e);
  if (d)
    return d;
  s.set(e, o), Sl(e) ? e.forEach(function(g) {
    o.add(It(g, t, n, g, e, s));
  }) : El(e) && e.forEach(function(g, y) {
    o.set(y, It(g, t, n, y, e, s));
  });
  var _ = f ? u ? Al : ec : u ? Ke : _e, v = c ? void 0 : _(e);
  return zt(v || e, function(g, y) {
    v && (y = g, g = e[y]), uo(o, y, It(g, t, n, y, e, s));
  }), o;
}
var BP = 4;
function Og(e) {
  return It(e, BP);
}
var zP = 1, UP = 4;
function bu(e) {
  return It(e, zP | UP);
}
var VP = 1, kP = 4;
function Eg(e, t) {
  return t = typeof t == "function" ? t : void 0, It(e, VP | kP, t);
}
var WP = 4;
function Sg(e, t) {
  return t = typeof t == "function" ? t : void 0, It(e, WP, t);
}
function rc() {
  return new Lt(this.value(), this.__chain__);
}
function xg(e) {
  for (var t = -1, n = e == null ? 0 : e.length, r = 0, i = []; ++t < n; ) {
    var s = e[t];
    s && (i[r++] = s);
  }
  return i;
}
function Rg() {
  var e = arguments.length;
  if (!e)
    return [];
  for (var t = Array(e - 1), n = arguments[0], r = e; r--; )
    t[r - 1] = arguments[r];
  return pr(M(n) ? tt(n) : [n], Pe(t, 1));
}
var qP = "__lodash_hash_undefined__";
function GP(e) {
  return this.__data__.set(e, qP), this;
}
function HP(e) {
  return this.__data__.has(e);
}
function $r(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.__data__ = new Hn(); ++t < n; )
    this.add(e[t]);
}
$r.prototype.add = $r.prototype.push = GP;
$r.prototype.has = HP;
function xl(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r; )
    if (t(e[n], n, e))
      return !0;
  return !1;
}
function Fs(e, t) {
  return e.has(t);
}
var KP = 1, YP = 2;
function Tg(e, t, n, r, i, s) {
  var o = n & KP, a = e.length, u = t.length;
  if (a != u && !(o && u > a))
    return !1;
  var f = s.get(e), c = s.get(t);
  if (f && c)
    return f == t && c == e;
  var l = -1, h = !0, d = n & YP ? new $r() : void 0;
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
      if (!xl(t, function(y, b) {
        if (!Fs(d, b) && (_ === y || i(_, y, n, r, s)))
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
function Rl(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(r, i) {
    n[++t] = [i, r];
  }), n;
}
function mu(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(r) {
    n[++t] = r;
  }), n;
}
var XP = 1, JP = 2, ZP = "[object Boolean]", QP = "[object Date]", eN = "[object Error]", tN = "[object Map]", nN = "[object Number]", rN = "[object RegExp]", iN = "[object Set]", sN = "[object String]", oN = "[object Symbol]", aN = "[object ArrayBuffer]", uN = "[object DataView]", vd = Ie ? Ie.prototype : void 0, Af = vd ? vd.valueOf : void 0;
function fN(e, t, n, r, i, s, o) {
  switch (n) {
    case uN:
      if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
        return !1;
      e = e.buffer, t = t.buffer;
    case aN:
      return !(e.byteLength != t.byteLength || !s(new Sa(e), new Sa(t)));
    case ZP:
    case QP:
    case nN:
      return Ut(+e, +t);
    case eN:
      return e.name == t.name && e.message == t.message;
    case rN:
    case sN:
      return e == t + "";
    case tN:
      var a = Rl;
    case iN:
      var u = r & XP;
      if (a || (a = mu), e.size != t.size && !u)
        return !1;
      var f = o.get(e);
      if (f)
        return f == t;
      r |= JP, o.set(e, t);
      var c = Tg(a(e), a(t), r, i, s, o);
      return o.delete(e), c;
    case oN:
      if (Af)
        return Af.call(e) == Af.call(t);
  }
  return !1;
}
var cN = 1, lN = Object.prototype, hN = lN.hasOwnProperty;
function pN(e, t, n, r, i, s) {
  var o = n & cN, a = ec(e), u = a.length, f = ec(t), c = f.length;
  if (u != c && !o)
    return !1;
  for (var l = u; l--; ) {
    var h = a[l];
    if (!(o ? h in t : hN.call(t, h)))
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
var dN = 1, gd = "[object Arguments]", yd = "[object Array]", Xo = "[object Object]", _N = Object.prototype, bd = _N.hasOwnProperty;
function vN(e, t, n, r, i, s) {
  var o = M(e), a = M(t), u = o ? yd : pn(e), f = a ? yd : pn(t);
  u = u == gd ? Xo : u, f = f == gd ? Xo : f;
  var c = u == Xo, l = f == Xo, h = u == f;
  if (h && zn(e)) {
    if (!zn(t))
      return !1;
    o = !0, c = !1;
  }
  if (h && !c)
    return s || (s = new Kt()), o || Gr(e) ? Tg(e, t, n, r, i, s) : fN(e, t, u, n, r, i, s);
  if (!(n & dN)) {
    var d = c && bd.call(e, "__wrapped__"), _ = l && bd.call(t, "__wrapped__");
    if (d || _) {
      var v = d ? e.value() : e, g = _ ? t.value() : t;
      return s || (s = new Kt()), i(v, g, n, r, s);
    }
  }
  return h ? (s || (s = new Kt()), pN(e, t, n, r, i, s)) : !1;
}
function po(e, t, n, r, i) {
  return e === t ? !0 : e == null || t == null || !se(e) && !se(t) ? e !== e && t !== t : vN(e, t, n, r, po, i);
}
var gN = 1, yN = 2;
function Tl(e, t, n, r) {
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
      var l = new Kt();
      if (r)
        var h = r(f, c, u, e, t, l);
      if (!(h === void 0 ? po(c, f, gN | yN, r, l) : h))
        return !1;
    }
  }
  return !0;
}
function Pg(e) {
  return e === e && !ie(e);
}
function Pl(e) {
  for (var t = _e(e), n = t.length; n--; ) {
    var r = t[n], i = e[r];
    t[n] = [r, i, Pg(i)];
  }
  return t;
}
function Ng(e, t) {
  return function(n) {
    return n == null ? !1 : n[e] === t && (t !== void 0 || e in Object(n));
  };
}
function $g(e) {
  var t = Pl(e);
  return t.length == 1 && t[0][2] ? Ng(t[0][0], t[0][1]) : function(n) {
    return n === e || Tl(n, e, t);
  };
}
function bN(e, t) {
  return e != null && t in Object(e);
}
function Mg(e, t, n) {
  t = hr(t, e);
  for (var r = -1, i = t.length, s = !1; ++r < i; ) {
    var o = wn(t[r]);
    if (!(s = e != null && n(e, o)))
      break;
    e = e[o];
  }
  return s || ++r != i ? s : (i = e == null ? 0 : e.length, !!i && fo(i) && kn(o, i) && (M(e) || sr(e)));
}
function wu(e, t) {
  return e != null && Mg(e, t, bN);
}
var mN = 1, wN = 2;
function Ig(e, t) {
  return fl(e) && Pg(t) ? Ng(wn(e), t) : function(n) {
    var r = pu(n, e);
    return r === void 0 && r === t ? wu(n, e) : po(t, r, mN | wN);
  };
}
function Nl(e) {
  return function(t) {
    return t?.[e];
  };
}
function AN(e) {
  return function(t) {
    return Hr(t, e);
  };
}
function $l(e) {
  return fl(e) ? Nl(wn(e)) : AN(e);
}
function $(e) {
  return typeof e == "function" ? e : e == null ? Ge : typeof e == "object" ? M(e) ? Ig(e[0], e[1]) : $g(e) : $l(e);
}
var ON = "Expected a function";
function Dg(e) {
  var t = e == null ? 0 : e.length, n = $;
  return e = t ? re(e, function(r) {
    if (typeof r[1] != "function")
      throw new TypeError(ON);
    return [n(r[0]), r[1]];
  }) : [], D(function(r) {
    for (var i = -1; ++i < t; ) {
      var s = e[i];
      if (bt(s[0], this, r))
        return bt(s[1], this, r);
    }
  });
}
function Cg(e, t, n) {
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
function EN(e) {
  var t = _e(e);
  return function(n) {
    return Cg(n, e, t);
  };
}
var SN = 1;
function Lg(e) {
  return EN(It(e, SN));
}
function jg(e, t) {
  return t == null || Cg(e, t, _e(t));
}
function xN(e, t, n, r) {
  for (var i = -1, s = e == null ? 0 : e.length; ++i < s; ) {
    var o = e[i];
    t(r, o, n(o), e);
  }
  return r;
}
function Fg(e) {
  return function(t, n, r) {
    for (var i = -1, s = Object(t), o = r(t), a = o.length; a--; ) {
      var u = o[e ? a : ++i];
      if (n(s[u], u, s) === !1)
        break;
    }
    return t;
  };
}
var Ml = Fg();
function An(e, t) {
  return e && Ml(e, t, _e);
}
function Bg(e, t) {
  return function(n, r) {
    if (n == null)
      return n;
    if (!He(n))
      return e(n, r);
    for (var i = n.length, s = t ? i : -1, o = Object(n); (t ? s-- : ++s < i) && r(o[s], s, o) !== !1; )
      ;
    return n;
  };
}
var vr = Bg(An);
function RN(e, t, n, r) {
  return vr(e, function(i, s, o) {
    t(r, i, n(i), o);
  }), r;
}
function Au(e, t) {
  return function(n, r) {
    var i = M(n) ? xN : RN, s = t ? t() : {};
    return i(n, e, $(r), s);
  };
}
var TN = Object.prototype, PN = TN.hasOwnProperty, zg = Au(function(e, t, n) {
  PN.call(e, n) ? ++e[n] : qn(e, n, 1);
});
function Ug(e, t) {
  var n = Ui(e);
  return t == null ? n : pg(n, t);
}
var NN = 8;
function Ou(e, t, n) {
  t = n ? void 0 : t;
  var r = Wn(e, NN, void 0, void 0, void 0, void 0, void 0, t);
  return r.placeholder = Ou.placeholder, r;
}
Ou.placeholder = {};
var $N = 16;
function Eu(e, t, n) {
  t = n ? void 0 : t;
  var r = Wn(e, $N, void 0, void 0, void 0, void 0, void 0, t);
  return r.placeholder = Eu.placeholder, r;
}
Eu.placeholder = {};
var ms = function() {
  return Ee.Date.now();
}, MN = "Expected a function", IN = Math.max, DN = Math.min;
function Il(e, t, n) {
  var r, i, s, o, a, u, f = 0, c = !1, l = !1, h = !0;
  if (typeof e != "function")
    throw new TypeError(MN);
  t = pt(t) || 0, ie(n) && (c = !!n.leading, l = "maxWait" in n, s = l ? IN(pt(n.maxWait) || 0, t) : s, h = "trailing" in n ? !!n.trailing : h);
  function d(S) {
    var T = r, F = i;
    return r = i = void 0, f = S, o = e.apply(F, T), o;
  }
  function _(S) {
    return f = S, a = setTimeout(y, t), c ? d(S) : o;
  }
  function v(S) {
    var T = S - u, F = S - f, Tn = t - T;
    return l ? DN(Tn, s - F) : Tn;
  }
  function g(S) {
    var T = S - u, F = S - f;
    return u === void 0 || T >= t || T < 0 || l && F >= s;
  }
  function y() {
    var S = ms();
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
    return a === void 0 ? o : b(ms());
  }
  function A() {
    var S = ms(), T = g(S);
    if (r = arguments, i = this, u = S, T) {
      if (a === void 0)
        return _(u);
      if (l)
        return clearTimeout(a), a = setTimeout(y, t), d(u);
    }
    return a === void 0 && (a = setTimeout(y, t)), o;
  }
  return A.cancel = w, A.flush = m, A;
}
function Vg(e, t) {
  return e == null || e !== e ? t : e;
}
var kg = Object.prototype, CN = kg.hasOwnProperty, Wg = D(function(e, t) {
  e = Object(e);
  var n = -1, r = t.length, i = r > 2 ? t[2] : void 0;
  for (i && ke(t[0], t[1], i) && (r = 1); ++n < r; )
    for (var s = t[n], o = Ke(s), a = -1, u = o.length; ++a < u; ) {
      var f = o[a], c = e[f];
      (c === void 0 || Ut(c, kg[f]) && !CN.call(e, f)) && (e[f] = s[f]);
    }
  return e;
});
function ic(e, t, n) {
  (n !== void 0 && !Ut(e[t], n) || n === void 0 && !(t in e)) && qn(e, t, n);
}
function ue(e) {
  return se(e) && He(e);
}
function sc(e, t) {
  if (!(t === "constructor" && typeof e[t] == "function") && t != "__proto__")
    return e[t];
}
function Dl(e) {
  return mn(e, Ke(e));
}
function LN(e, t, n, r, i, s, o) {
  var a = sc(e, n), u = sc(t, n), f = o.get(u);
  if (f) {
    ic(e, n, f);
    return;
  }
  var c = s ? s(a, u, n + "", e, t, o) : void 0, l = c === void 0;
  if (l) {
    var h = M(u), d = !h && zn(u), _ = !h && !d && Gr(u);
    c = u, h || d || _ ? M(a) ? c = a : ue(a) ? c = tt(a) : d ? (l = !1, c = _g(u, !0)) : _ ? (l = !1, c = yg(u, !0)) : c = [] : qi(u) || sr(u) ? (c = a, sr(a) ? c = Dl(a) : (!ie(a) || bn(a)) && (c = bg(u))) : l = !1;
  }
  l && (o.set(u, c), i(c, u, r, s, o), o.delete(u)), ic(e, n, c);
}
function Su(e, t, n, r, i) {
  e !== t && Ml(t, function(s, o) {
    if (i || (i = new Kt()), ie(s))
      LN(e, t, o, n, Su, r, i);
    else {
      var a = r ? r(sc(e, o), s, o + "", e, t, i) : void 0;
      a === void 0 && (a = s), ic(e, o, a);
    }
  }, Ke);
}
function qg(e, t, n, r, i, s) {
  return ie(e) && ie(t) && (s.set(t, e), Su(e, t, void 0, qg, s), s.delete(t)), e;
}
var Cl = Wi(function(e, t, n, r) {
  Su(e, t, n, r);
}), Gg = D(function(e) {
  return e.push(void 0, qg), bt(Cl, void 0, e);
}), jN = "Expected a function";
function Hg(e, t, n) {
  if (typeof e != "function")
    throw new TypeError(jN);
  return setTimeout(function() {
    e.apply(void 0, n);
  }, t);
}
var Kg = D(function(e, t) {
  return Hg(e, 1, t);
}), Yg = D(function(e, t, n) {
  return Hg(e, pt(t) || 0, n);
});
function Ll(e, t, n) {
  for (var r = -1, i = e == null ? 0 : e.length; ++r < i; )
    if (n(t, e[r]))
      return !0;
  return !1;
}
var FN = 200;
function _o(e, t, n, r) {
  var i = -1, s = uu, o = !0, a = e.length, u = [], f = t.length;
  if (!a)
    return u;
  n && (t = re(t, mt(n))), r ? (s = Ll, o = !1) : t.length >= FN && (s = Fs, o = !1, t = new $r(t));
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
var Xg = D(function(e, t) {
  return ue(e) ? _o(e, Pe(t, 1, ue, !0)) : [];
});
function wt(e) {
  var t = e == null ? 0 : e.length;
  return t ? e[t - 1] : void 0;
}
var Jg = D(function(e, t) {
  var n = wt(t);
  return ue(n) && (n = void 0), ue(e) ? _o(e, Pe(t, 1, ue, !0), $(n)) : [];
}), Zg = D(function(e, t) {
  var n = wt(t);
  return ue(n) && (n = void 0), ue(e) ? _o(e, Pe(t, 1, ue, !0), void 0, n) : [];
}), Qg = ru(function(e, t) {
  return e / t;
}, 1);
function e0(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (t = n || t === void 0 ? 1 : I(t), Ft(e, t < 0 ? 0 : t, r)) : [];
}
function t0(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (t = n || t === void 0 ? 1 : I(t), t = r - t, Ft(e, 0, t < 0 ? 0 : t)) : [];
}
function xu(e, t, n, r) {
  for (var i = e.length, s = r ? i : -1; (r ? s-- : ++s < i) && t(e[s], s, e); )
    ;
  return n ? Ft(e, r ? 0 : s, r ? s + 1 : i) : Ft(e, r ? s + 1 : 0, r ? i : s);
}
function n0(e, t) {
  return e && e.length ? xu(e, $(t), !0, !0) : [];
}
function r0(e, t) {
  return e && e.length ? xu(e, $(t), !0) : [];
}
function On(e) {
  return typeof e == "function" ? e : Ge;
}
function oc(e, t) {
  var n = M(e) ? zt : vr;
  return n(e, On(t));
}
function BN(e, t) {
  for (var n = e == null ? 0 : e.length; n-- && t(e[n], n, e) !== !1; )
    ;
  return e;
}
var i0 = Fg(!0);
function jl(e, t) {
  return e && i0(e, t, _e);
}
var s0 = Bg(jl, !0);
function ac(e, t) {
  var n = M(e) ? BN : s0;
  return n(e, On(t));
}
function o0(e, t, n) {
  e = k(e), t = yt(t);
  var r = e.length;
  n = n === void 0 ? r : Kr(I(n), 0, r);
  var i = n;
  return n -= t.length, n >= 0 && e.slice(n, i) == t;
}
function zN(e, t) {
  return re(t, function(n) {
    return [n, e[n]];
  });
}
function UN(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(r) {
    n[++t] = [r, r];
  }), n;
}
var VN = "[object Map]", kN = "[object Set]";
function a0(e) {
  return function(t) {
    var n = pn(t);
    return n == VN ? Rl(t) : n == kN ? UN(t) : zN(t, e(t));
  };
}
var uc = a0(_e), fc = a0(Ke), WN = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, qN = vl(WN), u0 = /[&<>"']/g, GN = RegExp(u0.source);
function Fl(e) {
  return e = k(e), e && GN.test(e) ? e.replace(u0, qN) : e;
}
var f0 = /[\\^$.*+?()[\]{}|]/g, HN = RegExp(f0.source);
function c0(e) {
  return e = k(e), e && HN.test(e) ? e.replace(f0, "\\$&") : e;
}
function l0(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r; )
    if (!t(e[n], n, e))
      return !1;
  return !0;
}
function KN(e, t) {
  var n = !0;
  return vr(e, function(r, i, s) {
    return n = !!t(r, i, s), n;
  }), n;
}
function h0(e, t, n) {
  var r = M(e) ? l0 : KN;
  return n && ke(e, t, n) && (t = void 0), r(e, $(t));
}
var YN = 4294967295;
function Bl(e) {
  return e ? Kr(I(e), 0, YN) : 0;
}
function XN(e, t, n, r) {
  var i = e.length;
  for (n = I(n), n < 0 && (n = -n > i ? 0 : i + n), r = r === void 0 || r > i ? i : I(r), r < 0 && (r += i), r = n > r ? 0 : Bl(r); n < r; )
    e[n++] = t;
  return e;
}
function p0(e, t, n, r) {
  var i = e == null ? 0 : e.length;
  return i ? (n && typeof n != "number" && ke(e, t, n) && (n = 0, r = i), XN(e, t, n, r)) : [];
}
function d0(e, t) {
  var n = [];
  return vr(e, function(r, i, s) {
    t(r, i, s) && n.push(r);
  }), n;
}
function _0(e, t) {
  var n = M(e) ? _r : d0;
  return n(e, $(t));
}
function v0(e) {
  return function(t, n, r) {
    var i = Object(t);
    if (!He(t)) {
      var s = $(n);
      t = _e(t), n = function(a) {
        return s(i[a], a, i);
      };
    }
    var o = e(t, n, r);
    return o > -1 ? i[s ? t[o] : o] : void 0;
  };
}
var JN = Math.max;
function zl(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = n == null ? 0 : I(n);
  return i < 0 && (i = JN(r + i, 0)), au(e, $(t), i);
}
var g0 = v0(zl);
function y0(e, t, n) {
  var r;
  return n(e, function(i, s, o) {
    if (t(i, s, o))
      return r = s, !1;
  }), r;
}
function b0(e, t) {
  return y0(e, $(t), An);
}
var ZN = Math.max, QN = Math.min;
function Ul(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = r - 1;
  return n !== void 0 && (i = I(n), i = n < 0 ? ZN(r + i, 0) : QN(i, r - 1)), au(e, $(t), i, !0);
}
var m0 = v0(Ul);
function w0(e, t) {
  return y0(e, $(t), jl);
}
function cc(e) {
  return e && e.length ? e[0] : void 0;
}
function A0(e, t) {
  var n = -1, r = He(e) ? Array(e.length) : [];
  return vr(e, function(i, s, o) {
    r[++n] = t(i, s, o);
  }), r;
}
function vo(e, t) {
  var n = M(e) ? re : A0;
  return n(e, $(t));
}
function O0(e, t) {
  return Pe(vo(e, t), 1);
}
var e$ = 1 / 0;
function E0(e, t) {
  return Pe(vo(e, t), e$);
}
function S0(e, t, n) {
  return n = n === void 0 ? 1 : I(n), Pe(vo(e, t), n);
}
var t$ = 1 / 0;
function x0(e) {
  var t = e == null ? 0 : e.length;
  return t ? Pe(e, t$) : [];
}
function R0(e, t) {
  var n = e == null ? 0 : e.length;
  return n ? (t = t === void 0 ? 1 : I(t), Pe(e, t)) : [];
}
var n$ = 512;
function T0(e) {
  return Wn(e, n$);
}
var P0 = bl("floor"), r$ = "Expected a function", i$ = 8, s$ = 32, o$ = 128, a$ = 256;
function N0(e) {
  return Kn(function(t) {
    var n = t.length, r = n, i = Lt.prototype.thru;
    for (e && t.reverse(); r--; ) {
      var s = t[r];
      if (typeof s != "function")
        throw new TypeError(r$);
      if (i && !o && _a(s) == "wrapper")
        var o = new Lt([], !0);
    }
    for (r = o ? r : n; ++r < n; ) {
      s = t[r];
      var a = _a(s), u = a == "wrapper" ? il(s) : void 0;
      u && Xf(u[0]) && u[1] == (o$ | i$ | s$ | a$) && !u[4].length && u[9] == 1 ? o = o[_a(u[0])].apply(o, u[3]) : o = s.length == 1 && Xf(s) ? o[a]() : o.thru(s);
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
var $0 = N0(), M0 = N0(!0);
function I0(e, t) {
  return e == null ? e : Ml(e, On(t), Ke);
}
function D0(e, t) {
  return e == null ? e : i0(e, On(t), Ke);
}
function C0(e, t) {
  return e && An(e, On(t));
}
function L0(e, t) {
  return e && jl(e, On(t));
}
function j0(e) {
  for (var t = -1, n = e == null ? 0 : e.length, r = {}; ++t < n; ) {
    var i = e[t];
    r[i[0]] = i[1];
  }
  return r;
}
function Ru(e, t) {
  return _r(t, function(n) {
    return bn(e[n]);
  });
}
function F0(e) {
  return e == null ? [] : Ru(e, _e(e));
}
function B0(e) {
  return e == null ? [] : Ru(e, Ke(e));
}
var u$ = Object.prototype, f$ = u$.hasOwnProperty, z0 = Au(function(e, t, n) {
  f$.call(e, n) ? e[n].push(t) : qn(e, n, [t]);
});
function Vl(e, t) {
  return e > t;
}
function Tu(e) {
  return function(t, n) {
    return typeof t == "string" && typeof n == "string" || (t = pt(t), n = pt(n)), e(t, n);
  };
}
var U0 = Tu(Vl), V0 = Tu(function(e, t) {
  return e >= t;
}), c$ = Object.prototype, l$ = c$.hasOwnProperty;
function h$(e, t) {
  return e != null && l$.call(e, t);
}
function k0(e, t) {
  return e != null && Mg(e, t, h$);
}
var p$ = Math.max, d$ = Math.min;
function _$(e, t, n) {
  return e >= d$(t, n) && e < p$(t, n);
}
function W0(e, t, n) {
  return t = ln(t), n === void 0 ? (n = t, t = 0) : n = ln(n), e = pt(e), _$(e, t, n);
}
var v$ = "[object String]";
function go(e) {
  return typeof e == "string" || !M(e) && se(e) && qe(e) == v$;
}
function kl(e, t) {
  return re(t, function(n) {
    return e[n];
  });
}
function Yr(e) {
  return e == null ? [] : kl(e, _e(e));
}
var g$ = Math.max;
function q0(e, t, n, r) {
  e = He(e) ? e : Yr(e), n = n && !r ? I(n) : 0;
  var i = e.length;
  return n < 0 && (n = g$(i + n, 0)), go(e) ? n <= i && e.indexOf(t, n) > -1 : !!i && Vi(e, t, n) > -1;
}
var y$ = Math.max;
function G0(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = n == null ? 0 : I(n);
  return i < 0 && (i = y$(r + i, 0)), Vi(e, t, i);
}
function H0(e) {
  var t = e == null ? 0 : e.length;
  return t ? Ft(e, 0, -1) : [];
}
var b$ = Math.min;
function Wl(e, t, n) {
  for (var r = n ? Ll : uu, i = e[0].length, s = e.length, o = s, a = Array(s), u = 1 / 0, f = []; o--; ) {
    var c = e[o];
    o && t && (c = re(c, mt(t))), u = b$(c.length, u), a[o] = !n && (t || i >= 120 && c.length >= 120) ? new $r(o && c) : void 0;
  }
  c = e[0];
  var l = -1, h = a[0];
  e:
    for (; ++l < i && f.length < u; ) {
      var d = c[l], _ = t ? t(d) : d;
      if (d = n || d !== 0 ? d : 0, !(h ? Fs(h, _) : r(f, _, n))) {
        for (o = s; --o; ) {
          var v = a[o];
          if (!(v ? Fs(v, _) : r(e[o], _, n)))
            continue e;
        }
        h && h.push(_), f.push(d);
      }
    }
  return f;
}
function ql(e) {
  return ue(e) ? e : [];
}
var K0 = D(function(e) {
  var t = re(e, ql);
  return t.length && t[0] === e[0] ? Wl(t) : [];
}), Y0 = D(function(e) {
  var t = wt(e), n = re(e, ql);
  return t === wt(n) ? t = void 0 : n.pop(), n.length && n[0] === e[0] ? Wl(n, $(t)) : [];
}), X0 = D(function(e) {
  var t = wt(e), n = re(e, ql);
  return t = typeof t == "function" ? t : void 0, t && n.pop(), n.length && n[0] === e[0] ? Wl(n, void 0, t) : [];
});
function m$(e, t, n, r) {
  return An(e, function(i, s, o) {
    t(r, n(i), s, o);
  }), r;
}
function J0(e, t) {
  return function(n, r) {
    return m$(n, e, t(r), {});
  };
}
var w$ = Object.prototype, A$ = w$.toString, Z0 = J0(function(e, t, n) {
  t != null && typeof t.toString != "function" && (t = A$.call(t)), e[t] = n;
}, ou(Ge)), Q0 = Object.prototype, O$ = Q0.hasOwnProperty, E$ = Q0.toString, ey = J0(function(e, t, n) {
  t != null && typeof t.toString != "function" && (t = E$.call(t)), O$.call(e, t) ? e[t].push(n) : e[t] = [n];
}, $);
function ty(e, t) {
  return t.length < 2 ? e : Hr(e, Ft(t, 0, -1));
}
function yo(e, t, n) {
  t = hr(t, e), e = ty(e, t);
  var r = e == null ? e : e[wn(wt(t))];
  return r == null ? void 0 : bt(r, e, n);
}
var ny = D(yo), ry = D(function(e, t, n) {
  var r = -1, i = typeof t == "function", s = He(e) ? Array(e.length) : [];
  return vr(e, function(o) {
    s[++r] = i ? bt(t, o, n) : yo(o, t, n);
  }), s;
}), S$ = "[object ArrayBuffer]";
function x$(e) {
  return se(e) && qe(e) == S$;
}
var md = jt && jt.isArrayBuffer, iy = md ? mt(md) : x$, R$ = "[object Boolean]";
function sy(e) {
  return e === !0 || e === !1 || se(e) && qe(e) == R$;
}
var T$ = "[object Date]";
function P$(e) {
  return se(e) && qe(e) == T$;
}
var wd = jt && jt.isDate, oy = wd ? mt(wd) : P$;
function ay(e) {
  return se(e) && e.nodeType === 1 && !qi(e);
}
var N$ = "[object Map]", $$ = "[object Set]", M$ = Object.prototype, I$ = M$.hasOwnProperty;
function uy(e) {
  if (e == null)
    return !0;
  if (He(e) && (M(e) || typeof e == "string" || typeof e.splice == "function" || zn(e) || Gr(e) || sr(e)))
    return !e.length;
  var t = pn(e);
  if (t == N$ || t == $$)
    return !e.size;
  if (co(e))
    return !ul(e).length;
  for (var n in e)
    if (I$.call(e, n))
      return !1;
  return !0;
}
function gi(e, t) {
  return po(e, t);
}
function fy(e, t, n) {
  n = typeof n == "function" ? n : void 0;
  var r = n ? n(e, t) : void 0;
  return r === void 0 ? po(e, t, void 0, n) : !!r;
}
var D$ = Ee.isFinite;
function cy(e) {
  return typeof e == "number" && D$(e);
}
function Gl(e) {
  return typeof e == "number" && e == I(e);
}
function ly(e, t) {
  return e === t || Tl(e, t, Pl(t));
}
function hy(e, t, n) {
  return n = typeof n == "function" ? n : void 0, Tl(e, t, Pl(t), n);
}
var C$ = "[object Number]";
function Hl(e) {
  return typeof e == "number" || se(e) && qe(e) == C$;
}
function py(e) {
  return Hl(e) && e != +e;
}
var L$ = da ? bn : cu, j$ = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.";
function dy(e) {
  if (L$(e))
    throw new Error(j$);
  return mv(e);
}
function _y(e) {
  return e == null;
}
function vy(e) {
  return e === null;
}
var F$ = "[object RegExp]";
function B$(e) {
  return se(e) && qe(e) == F$;
}
var Ad = jt && jt.isRegExp, Pu = Ad ? mt(Ad) : B$, Od = 9007199254740991;
function gy(e) {
  return Gl(e) && e >= -Od && e <= Od;
}
function yy(e) {
  return e === void 0;
}
var z$ = "[object WeakMap]";
function by(e) {
  return se(e) && pn(e) == z$;
}
var U$ = "[object WeakSet]";
function my(e) {
  return se(e) && qe(e) == U$;
}
var V$ = 1;
function wy(e) {
  return $(typeof e == "function" ? e : It(e, V$));
}
var k$ = Array.prototype, W$ = k$.join;
function Ay(e, t) {
  return e == null ? "" : W$.call(e, t);
}
var Oy = Hi(function(e, t, n) {
  return e + (n ? "-" : "") + t.toLowerCase();
}), Ey = Au(function(e, t, n) {
  qn(e, n, t);
});
function q$(e, t, n) {
  for (var r = n + 1; r--; )
    if (e[r] === t)
      return r;
  return r;
}
var G$ = Math.max, H$ = Math.min;
function Sy(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = r;
  return n !== void 0 && (i = I(n), i = i < 0 ? G$(r + i, 0) : H$(i, r - 1)), t === t ? q$(e, t, i) : au(e, Rv, i, !0);
}
var xy = Hi(function(e, t, n) {
  return e + (n ? " " : "") + t.toLowerCase();
}), Ry = Kv("toLowerCase");
function Kl(e, t) {
  return e < t;
}
var Ty = Tu(Kl), Py = Tu(function(e, t) {
  return e <= t;
});
function Ny(e, t) {
  var n = {};
  return t = $(t), An(e, function(r, i, s) {
    qn(n, t(r, i, s), r);
  }), n;
}
function $y(e, t) {
  var n = {};
  return t = $(t), An(e, function(r, i, s) {
    qn(n, i, t(r, i, s));
  }), n;
}
var K$ = 1;
function My(e) {
  return $g(It(e, K$));
}
var Y$ = 1;
function Iy(e, t) {
  return Ig(e, It(t, Y$));
}
function Nu(e, t, n) {
  for (var r = -1, i = e.length; ++r < i; ) {
    var s = e[r], o = t(s);
    if (o != null && (a === void 0 ? o === o && !rt(o) : n(o, a)))
      var a = o, u = s;
  }
  return u;
}
function Dy(e) {
  return e && e.length ? Nu(e, Ge, Vl) : void 0;
}
function Cy(e, t) {
  return e && e.length ? Nu(e, $(t), Vl) : void 0;
}
function Yl(e, t) {
  for (var n, r = -1, i = e.length; ++r < i; ) {
    var s = t(e[r]);
    s !== void 0 && (n = n === void 0 ? s : n + s);
  }
  return n;
}
var X$ = NaN;
function Ly(e, t) {
  var n = e == null ? 0 : e.length;
  return n ? Yl(e, t) / n : X$;
}
function jy(e) {
  return Ly(e, Ge);
}
function Fy(e, t) {
  return Ly(e, $(t));
}
var By = Wi(function(e, t, n) {
  Su(e, t, n);
}), zy = D(function(e, t) {
  return function(n) {
    return yo(n, e, t);
  };
}), Uy = D(function(e, t) {
  return function(n) {
    return yo(e, n, t);
  };
});
function Vy(e) {
  return e && e.length ? Nu(e, Ge, Kl) : void 0;
}
function ky(e, t) {
  return e && e.length ? Nu(e, $(t), Kl) : void 0;
}
function Wy(e, t, n) {
  var r = _e(t), i = Ru(t, r), s = !(ie(n) && "chain" in n) || !!n.chain, o = bn(e);
  return zt(i, function(a) {
    var u = t[a];
    e[a] = u, o && (e.prototype[a] = function() {
      var f = this.__chain__;
      if (s || f) {
        var c = e(this.__wrapped__), l = c.__actions__ = tt(this.__actions__);
        return l.push({ func: u, args: arguments, thisArg: e }), c.__chain__ = f, c;
      }
      return u.apply(e, pr([this.value()], arguments));
    });
  }), e;
}
var qy = ru(function(e, t) {
  return e * t;
}, 1), J$ = "Expected a function";
function bo(e) {
  if (typeof e != "function")
    throw new TypeError(J$);
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
function Z$(e) {
  for (var t, n = []; !(t = e.next()).done; )
    n.push(t.value);
  return n;
}
var Q$ = "[object Map]", eM = "[object Set]", Of = Ie ? Ie.iterator : void 0;
function Xl(e) {
  if (!e)
    return [];
  if (He(e))
    return go(e) ? Qt(e) : tt(e);
  if (Of && e[Of])
    return Z$(e[Of]());
  var t = pn(e), n = t == Q$ ? Rl : t == eM ? mu : Yr;
  return n(e);
}
function lc() {
  this.__values__ === void 0 && (this.__values__ = Xl(this.value()));
  var e = this.__index__ >= this.__values__.length, t = e ? void 0 : this.__values__[this.__index__++];
  return { done: e, value: t };
}
function Gy(e, t) {
  var n = e.length;
  if (n)
    return t += t < 0 ? n : 0, kn(t, n) ? e[t] : void 0;
}
function Hy(e, t) {
  return e && e.length ? Gy(e, I(t)) : void 0;
}
function Ky(e) {
  return e = I(e), D(function(t) {
    return Gy(t, e);
  });
}
function Jl(e, t) {
  return t = hr(t, e), e = ty(e, t), e == null || delete e[wn(wt(t))];
}
function tM(e) {
  return qi(e) ? void 0 : e;
}
var nM = 1, rM = 2, iM = 4, Yy = Kn(function(e, t) {
  var n = {};
  if (e == null)
    return n;
  var r = !1;
  t = re(t, function(s) {
    return s = hr(s, e), r || (r = s.length > 1), s;
  }), mn(e, Al(e), n), r && (n = It(n, nM | rM | iM, tM));
  for (var i = t.length; i--; )
    Jl(n, t[i]);
  return n;
});
function mo(e, t, n, r) {
  if (!ie(e))
    return e;
  t = hr(t, e);
  for (var i = -1, s = t.length, o = s - 1, a = e; a != null && ++i < s; ) {
    var u = wn(t[i]), f = n;
    if (u === "__proto__" || u === "constructor" || u === "prototype")
      return e;
    if (i != o) {
      var c = a[u];
      f = r ? r(c, u, a) : void 0, f === void 0 && (f = ie(c) ? c : kn(t[i + 1]) ? [] : {});
    }
    uo(a, u, f), a = a[u];
  }
  return e;
}
function Xy(e, t, n) {
  for (var r = -1, i = t.length, s = {}; ++r < i; ) {
    var o = t[r], a = Hr(e, o);
    n(a, o) && mo(s, hr(o, e), a);
  }
  return s;
}
function Zl(e, t) {
  if (e == null)
    return {};
  var n = re(Al(e), function(r) {
    return [r];
  });
  return t = $(t), Xy(e, n, function(r, i) {
    return t(r, i[0]);
  });
}
function Jy(e, t) {
  return Zl(e, bo($(t)));
}
function Zy(e) {
  return pl(2, e);
}
function sM(e, t) {
  var n = e.length;
  for (e.sort(t); n--; )
    e[n] = e[n].value;
  return e;
}
function Qy(e, t) {
  if (e !== t) {
    var n = e !== void 0, r = e === null, i = e === e, s = rt(e), o = t !== void 0, a = t === null, u = t === t, f = rt(t);
    if (!a && !f && !s && e > t || s && o && u && !a && !f || r && o && u || !n && u || !i)
      return 1;
    if (!r && !s && !f && e < t || f && n && i && !r && !s || a && n && i || !o && i || !u)
      return -1;
  }
  return 0;
}
function oM(e, t, n) {
  for (var r = -1, i = e.criteria, s = t.criteria, o = i.length, a = n.length; ++r < o; ) {
    var u = Qy(i[r], s[r]);
    if (u) {
      if (r >= a)
        return u;
      var f = n[r];
      return u * (f == "desc" ? -1 : 1);
    }
  }
  return e.index - t.index;
}
function eb(e, t, n) {
  t.length ? t = re(t, function(s) {
    return M(s) ? function(o) {
      return Hr(o, s.length === 1 ? s[0] : s);
    } : s;
  }) : t = [Ge];
  var r = -1;
  t = re(t, mt($));
  var i = A0(e, function(s, o, a) {
    var u = re(t, function(f) {
      return f(s);
    });
    return { criteria: u, index: ++r, value: s };
  });
  return sM(i, function(s, o) {
    return oM(s, o, n);
  });
}
function tb(e, t, n, r) {
  return e == null ? [] : (M(t) || (t = t == null ? [] : [t]), n = r ? void 0 : n, M(n) || (n = n == null ? [] : [n]), eb(e, t, n));
}
function Ql(e) {
  return Kn(function(t) {
    return t = re(t, mt($)), D(function(n) {
      var r = this;
      return e(t, function(i) {
        return bt(i, r, n);
      });
    });
  });
}
var nb = Ql(re), aM = D, uM = Math.min, rb = aM(function(e, t) {
  t = t.length == 1 && M(t[0]) ? re(t[0], mt($)) : re(Pe(t, 1), mt($));
  var n = t.length;
  return D(function(r) {
    for (var i = -1, s = uM(r.length, n); ++i < s; )
      r[i] = t[i].call(this, r[i]);
    return bt(e, this, r);
  });
}), ib = Ql(l0), sb = Ql(xl), fM = 9007199254740991, cM = Math.floor;
function hc(e, t) {
  var n = "";
  if (!e || t < 1 || t > fM)
    return n;
  do
    t % 2 && (n += e), t = cM(t / 2), t && (e += e);
  while (t);
  return n;
}
var lM = Nl("length"), ob = "\\ud800-\\udfff", hM = "\\u0300-\\u036f", pM = "\\ufe20-\\ufe2f", dM = "\\u20d0-\\u20ff", _M = hM + pM + dM, vM = "\\ufe0e\\ufe0f", gM = "[" + ob + "]", pc = "[" + _M + "]", dc = "\\ud83c[\\udffb-\\udfff]", yM = "(?:" + pc + "|" + dc + ")", ab = "[^" + ob + "]", ub = "(?:\\ud83c[\\udde6-\\uddff]){2}", fb = "[\\ud800-\\udbff][\\udc00-\\udfff]", bM = "\\u200d", cb = yM + "?", lb = "[" + vM + "]?", mM = "(?:" + bM + "(?:" + [ab, ub, fb].join("|") + ")" + lb + cb + ")*", wM = lb + cb + mM, AM = "(?:" + [ab + pc + "?", pc, ub, fb, gM].join("|") + ")", Ed = RegExp(dc + "(?=" + dc + ")|" + AM + wM, "g");
function OM(e) {
  for (var t = Ed.lastIndex = 0; Ed.test(e); )
    ++t;
  return t;
}
function Ki(e) {
  return Gi(e) ? OM(e) : lM(e);
}
var EM = Math.ceil;
function xa(e, t) {
  t = t === void 0 ? " " : yt(t);
  var n = t.length;
  if (n < 2)
    return n ? hc(t, e) : t;
  var r = hc(t, EM(e / Ki(t)));
  return Gi(t) ? dr(Qt(r), 0, e).join("") : r.slice(0, e);
}
var SM = Math.ceil, xM = Math.floor;
function hb(e, t, n) {
  e = k(e), t = I(t);
  var r = t ? Ki(e) : 0;
  if (!t || r >= t)
    return e;
  var i = (t - r) / 2;
  return xa(xM(i), n) + e + xa(SM(i), n);
}
function pb(e, t, n) {
  e = k(e), t = I(t);
  var r = t ? Ki(e) : 0;
  return t && r < t ? e + xa(t - r, n) : e;
}
function db(e, t, n) {
  e = k(e), t = I(t);
  var r = t ? Ki(e) : 0;
  return t && r < t ? xa(t - r, n) + e : e;
}
var RM = /^\s+/, TM = Ee.parseInt;
function _b(e, t, n) {
  return n || t == null ? t = 0 : t && (t = +t), TM(k(e).replace(RM, ""), t || 0);
}
var PM = 32, wo = D(function(e, t) {
  var n = ir(t, ki(wo));
  return Wn(e, PM, void 0, t, n);
});
wo.placeholder = {};
var NM = 64, $u = D(function(e, t) {
  var n = ir(t, ki($u));
  return Wn(e, NM, void 0, t, n);
});
$u.placeholder = {};
var vb = Au(function(e, t, n) {
  e[n ? 0 : 1].push(t);
}, function() {
  return [[], []];
});
function $M(e, t) {
  return Xy(e, t, function(n, r) {
    return wu(e, r);
  });
}
var gb = Kn(function(e, t) {
  return e == null ? {} : $M(e, t);
});
function _c(e) {
  for (var t, n = this; n instanceof iu; ) {
    var r = Ev(n);
    r.__index__ = 0, r.__values__ = void 0, t ? i.__wrapped__ = r : t = r;
    var i = r;
    n = n.__wrapped__;
  }
  return i.__wrapped__ = e, t;
}
function yb(e) {
  return function(t) {
    return e == null ? void 0 : Hr(e, t);
  };
}
function MM(e, t, n, r) {
  for (var i = n - 1, s = e.length; ++i < s; )
    if (r(e[i], t))
      return i;
  return -1;
}
var IM = Array.prototype, Sd = IM.splice;
function eh(e, t, n, r) {
  var i = r ? MM : Vi, s = -1, o = t.length, a = e;
  for (e === t && (t = tt(t)), n && (a = re(e, mt(n))); ++s < o; )
    for (var u = 0, f = t[s], c = n ? n(f) : f; (u = i(a, c, u, r)) > -1; )
      a !== e && Sd.call(a, u, 1), Sd.call(e, u, 1);
  return e;
}
function th(e, t) {
  return e && e.length && t && t.length ? eh(e, t) : e;
}
var bb = D(th);
function mb(e, t, n) {
  return e && e.length && t && t.length ? eh(e, t, $(n)) : e;
}
function wb(e, t, n) {
  return e && e.length && t && t.length ? eh(e, t, void 0, n) : e;
}
var DM = Array.prototype, CM = DM.splice;
function Ab(e, t) {
  for (var n = e ? t.length : 0, r = n - 1; n--; ) {
    var i = t[n];
    if (n == r || i !== s) {
      var s = i;
      kn(i) ? CM.call(e, i, 1) : Jl(e, i);
    }
  }
  return e;
}
var Ob = Kn(function(e, t) {
  var n = e == null ? 0 : e.length, r = cl(e, t);
  return Ab(e, re(t, function(i) {
    return kn(i, n) ? +i : i;
  }).sort(Qy)), r;
}), LM = Math.floor, jM = Math.random;
function nh(e, t) {
  return e + LM(jM() * (t - e + 1));
}
var FM = parseFloat, BM = Math.min, zM = Math.random;
function Eb(e, t, n) {
  if (n && typeof n != "boolean" && ke(e, t, n) && (t = n = void 0), n === void 0 && (typeof t == "boolean" ? (n = t, t = void 0) : typeof e == "boolean" && (n = e, e = void 0)), e === void 0 && t === void 0 ? (e = 0, t = 1) : (e = ln(e), t === void 0 ? (t = e, e = 0) : t = ln(t)), e > t) {
    var r = e;
    e = t, t = r;
  }
  if (n || e % 1 || t % 1) {
    var i = zM();
    return BM(e + i * (t - e + FM("1e-" + ((i + "").length - 1))), t);
  }
  return nh(e, t);
}
var UM = Math.ceil, VM = Math.max;
function kM(e, t, n, r) {
  for (var i = -1, s = VM(UM((t - e) / (n || 1)), 0), o = Array(s); s--; )
    o[r ? s : ++i] = e, e += n;
  return o;
}
function Sb(e) {
  return function(t, n, r) {
    return r && typeof r != "number" && ke(t, n, r) && (n = r = void 0), t = ln(t), n === void 0 ? (n = t, t = 0) : n = ln(n), r = r === void 0 ? t < n ? 1 : -1 : ln(r), kM(t, n, r, e);
  };
}
var xb = Sb(), Rb = Sb(!0), WM = 256, Tb = Kn(function(e, t) {
  return Wn(e, WM, void 0, void 0, void 0, t);
});
function Pb(e, t, n, r, i) {
  return i(e, function(s, o, a) {
    n = r ? (r = !1, s) : t(n, s, o, a);
  }), n;
}
function Nb(e, t, n) {
  var r = M(e) ? _l : Pb, i = arguments.length < 3;
  return r(e, $(t), n, i, vr);
}
function qM(e, t, n, r) {
  var i = e == null ? 0 : e.length;
  for (r && i && (n = e[--i]); i--; )
    n = t(n, e[i], i, e);
  return n;
}
function $b(e, t, n) {
  var r = M(e) ? qM : Pb, i = arguments.length < 3;
  return r(e, $(t), n, i, s0);
}
function Mb(e, t) {
  var n = M(e) ? _r : d0;
  return n(e, bo($(t)));
}
function Ib(e, t) {
  var n = [];
  if (!(e && e.length))
    return n;
  var r = -1, i = [], s = e.length;
  for (t = $(t); ++r < s; ) {
    var o = e[r];
    t(o, r, e) && (n.push(o), i.push(r));
  }
  return Ab(e, i), n;
}
function Db(e, t, n) {
  return (n ? ke(e, t, n) : t === void 0) ? t = 1 : t = I(t), hc(k(e), t);
}
function Cb() {
  var e = arguments, t = k(e[0]);
  return e.length < 3 ? t : t.replace(e[1], e[2]);
}
var GM = "Expected a function";
function Lb(e, t) {
  if (typeof e != "function")
    throw new TypeError(GM);
  return t = t === void 0 ? t : I(t), D(e, t);
}
function jb(e, t, n) {
  t = hr(t, e);
  var r = -1, i = t.length;
  for (i || (i = 1, e = void 0); ++r < i; ) {
    var s = e?.[wn(t[r])];
    s === void 0 && (r = i, s = n), e = bn(s) ? s.call(e) : s;
  }
  return e;
}
var HM = Array.prototype, KM = HM.reverse;
function Ra(e) {
  return e == null ? e : KM.call(e);
}
var Fb = bl("round");
function Bb(e) {
  var t = e.length;
  return t ? e[nh(0, t - 1)] : void 0;
}
function YM(e) {
  return Bb(Yr(e));
}
function zb(e) {
  var t = M(e) ? Bb : YM;
  return t(e);
}
function Mu(e, t) {
  var n = -1, r = e.length, i = r - 1;
  for (t = t === void 0 ? r : t; ++n < t; ) {
    var s = nh(n, i), o = e[s];
    e[s] = e[n], e[n] = o;
  }
  return e.length = t, e;
}
function XM(e, t) {
  return Mu(tt(e), Kr(t, 0, e.length));
}
function JM(e, t) {
  var n = Yr(e);
  return Mu(n, Kr(t, 0, n.length));
}
function Ub(e, t, n) {
  (n ? ke(e, t, n) : t === void 0) ? t = 1 : t = I(t);
  var r = M(e) ? XM : JM;
  return r(e, t);
}
function Vb(e, t, n) {
  return e == null ? e : mo(e, t, n);
}
function kb(e, t, n, r) {
  return r = typeof r == "function" ? r : void 0, e == null ? e : mo(e, t, n, r);
}
function ZM(e) {
  return Mu(tt(e));
}
function QM(e) {
  return Mu(Yr(e));
}
function Wb(e) {
  var t = M(e) ? ZM : QM;
  return t(e);
}
var eI = "[object Map]", tI = "[object Set]";
function qb(e) {
  if (e == null)
    return 0;
  if (He(e))
    return go(e) ? Ki(e) : e.length;
  var t = pn(e);
  return t == eI || t == tI ? e.size : ul(e).length;
}
function Gb(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (n && typeof n != "number" && ke(e, t, n) ? (t = 0, n = r) : (t = t == null ? 0 : I(t), n = n === void 0 ? r : I(n)), Ft(e, t, n)) : [];
}
var Hb = Hi(function(e, t, n) {
  return e + (n ? "_" : "") + t.toLowerCase();
});
function nI(e, t) {
  var n;
  return vr(e, function(r, i, s) {
    return n = t(r, i, s), !n;
  }), !!n;
}
function Kb(e, t, n) {
  var r = M(e) ? xl : nI;
  return n && ke(e, t, n) && (t = void 0), r(e, $(t));
}
var Yb = D(function(e, t) {
  if (e == null)
    return [];
  var n = t.length;
  return n > 1 && ke(e, t[0], t[1]) ? t = [] : n > 2 && ke(t[0], t[1], t[2]) && (t = [t[0]]), eb(e, Pe(t, 1), []);
}), rI = 4294967295, iI = rI - 1, sI = Math.floor, oI = Math.min;
function rh(e, t, n, r) {
  var i = 0, s = e == null ? 0 : e.length;
  if (s === 0)
    return 0;
  t = n(t);
  for (var o = t !== t, a = t === null, u = rt(t), f = t === void 0; i < s; ) {
    var c = sI((i + s) / 2), l = n(e[c]), h = l !== void 0, d = l === null, _ = l === l, v = rt(l);
    if (o)
      var g = r || _;
    else f ? g = _ && (r || h) : a ? g = _ && h && (r || !d) : u ? g = _ && h && !d && (r || !v) : d || v ? g = !1 : g = r ? l <= t : l < t;
    g ? i = c + 1 : s = c;
  }
  return oI(s, iI);
}
var aI = 4294967295, uI = aI >>> 1;
function Iu(e, t, n) {
  var r = 0, i = e == null ? r : e.length;
  if (typeof t == "number" && t === t && i <= uI) {
    for (; r < i; ) {
      var s = r + i >>> 1, o = e[s];
      o !== null && !rt(o) && (n ? o <= t : o < t) ? r = s + 1 : i = s;
    }
    return i;
  }
  return rh(e, t, Ge, n);
}
function Xb(e, t) {
  return Iu(e, t);
}
function Jb(e, t, n) {
  return rh(e, t, $(n));
}
function Zb(e, t) {
  var n = e == null ? 0 : e.length;
  if (n) {
    var r = Iu(e, t);
    if (r < n && Ut(e[r], t))
      return r;
  }
  return -1;
}
function Qb(e, t) {
  return Iu(e, t, !0);
}
function em(e, t, n) {
  return rh(e, t, $(n), !0);
}
function tm(e, t) {
  var n = e == null ? 0 : e.length;
  if (n) {
    var r = Iu(e, t, !0) - 1;
    if (Ut(e[r], t))
      return r;
  }
  return -1;
}
function nm(e, t) {
  for (var n = -1, r = e.length, i = 0, s = []; ++n < r; ) {
    var o = e[n], a = t ? t(o) : o;
    if (!n || !Ut(a, u)) {
      var u = a;
      s[i++] = o === 0 ? 0 : o;
    }
  }
  return s;
}
function rm(e) {
  return e && e.length ? nm(e) : [];
}
function im(e, t) {
  return e && e.length ? nm(e, $(t)) : [];
}
var fI = 4294967295;
function sm(e, t, n) {
  return n && typeof n != "number" && ke(e, t, n) && (t = n = void 0), n = n === void 0 ? fI : n >>> 0, n ? (e = k(e), e && (typeof t == "string" || t != null && !Pu(t)) && (t = yt(t), !t && Gi(e)) ? dr(Qt(e), 0, n) : e.split(t, n)) : [];
}
var cI = "Expected a function", lI = Math.max;
function om(e, t) {
  if (typeof e != "function")
    throw new TypeError(cI);
  return t = t == null ? 0 : lI(I(t), 0), D(function(n) {
    var r = n[t], i = dr(n, 0, t);
    return r && pr(i, r), bt(e, this, i);
  });
}
var am = Hi(function(e, t, n) {
  return e + (n ? " " : "") + gu(t);
});
function um(e, t, n) {
  return e = k(e), n = n == null ? 0 : Kr(I(n), 0, e.length), t = yt(t), e.slice(n, n + t.length) == t;
}
function fm() {
  return {};
}
function cm() {
  return "";
}
function lm() {
  return !0;
}
var hm = ru(function(e, t) {
  return e - t;
}, 0);
function pm(e) {
  return e && e.length ? Yl(e, Ge) : 0;
}
function dm(e, t) {
  return e && e.length ? Yl(e, $(t)) : 0;
}
function _m(e) {
  var t = e == null ? 0 : e.length;
  return t ? Ft(e, 1, t) : [];
}
function vm(e, t, n) {
  return e && e.length ? (t = n || t === void 0 ? 1 : I(t), Ft(e, 0, t < 0 ? 0 : t)) : [];
}
function gm(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (t = n || t === void 0 ? 1 : I(t), t = r - t, Ft(e, t < 0 ? 0 : t, r)) : [];
}
function ym(e, t) {
  return e && e.length ? xu(e, $(t), !1, !0) : [];
}
function bm(e, t) {
  return e && e.length ? xu(e, $(t)) : [];
}
function mm(e, t) {
  return t(e), e;
}
var wm = Object.prototype, hI = wm.hasOwnProperty;
function xd(e, t, n, r) {
  return e === void 0 || Ut(e, wm[n]) && !hI.call(r, n) ? t : e;
}
var pI = {
  "\\": "\\",
  "'": "'",
  "\n": "n",
  "\r": "r",
  "\u2028": "u2028",
  "\u2029": "u2029"
};
function dI(e) {
  return "\\" + pI[e];
}
var Am = /<%=([\s\S]+?)%>/g, _I = /<%-([\s\S]+?)%>/g, vI = /<%([\s\S]+?)%>/g, Ta = {
  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  escape: _I,
  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  evaluate: vI,
  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  interpolate: Am,
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
    _: { escape: Fl }
  }
}, gI = "Invalid `variable` option passed into `_.template`", yI = /\b__p \+= '';/g, bI = /\b(__p \+=) '' \+/g, mI = /(__e\(.*?\)|\b__t\)) \+\n'';/g, wI = /[()=,{}\[\]\/\s]/, AI = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Jo = /($^)/, OI = /['\n\r\u2028\u2029\\]/g, EI = Object.prototype, Rd = EI.hasOwnProperty;
function Om(e, t, n) {
  var r = Ta.imports._.templateSettings || Ta;
  n && ke(e, t, n) && (t = void 0), e = k(e), t = Cs({}, t, r, xd);
  var i = Cs({}, t.imports, r.imports, xd), s = _e(i), o = kl(i, s), a, u, f = 0, c = t.interpolate || Jo, l = "__p += '", h = RegExp(
    (t.escape || Jo).source + "|" + c.source + "|" + (c === Am ? AI : Jo).source + "|" + (t.evaluate || Jo).source + "|$",
    "g"
  ), d = Rd.call(t, "sourceURL") ? "//# sourceURL=" + (t.sourceURL + "").replace(/\s/g, " ") + `
` : "";
  e.replace(h, function(g, y, b, w, m, A) {
    return b || (b = w), l += e.slice(f, A).replace(OI, dI), y && (a = !0, l += `' +
__e(` + y + `) +
'`), m && (u = !0, l += `';
` + m + `;
__p += '`), b && (l += `' +
((__t = (` + b + `)) == null ? '' : __t) +
'`), f = A + g.length, g;
  }), l += `';
`;
  var _ = Rd.call(t, "variable") && t.variable;
  if (!_)
    l = `with (obj) {
` + l + `
}
`;
  else if (wI.test(_))
    throw new Error(gI);
  l = (u ? l.replace(yI, "") : l).replace(bI, "$1").replace(mI, "$1;"), l = "function(" + (_ || "obj") + `) {
` + (_ ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (a ? ", __e = _.escape" : "") + (u ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + l + `return __p
}`;
  var v = hl(function() {
    return Function(s, d + "return " + l).apply(void 0, o);
  });
  if (v.source = l, _u(v))
    throw v;
  return v;
}
var SI = "Expected a function";
function Em(e, t, n) {
  var r = !0, i = !0;
  if (typeof e != "function")
    throw new TypeError(SI);
  return ie(n) && (r = "leading" in n ? !!n.leading : r, i = "trailing" in n ? !!n.trailing : i), Il(e, t, {
    leading: r,
    maxWait: t,
    trailing: i
  });
}
function Ao(e, t) {
  return t(e);
}
var xI = 9007199254740991, Ef = 4294967295, RI = Math.min;
function Sm(e, t) {
  if (e = I(e), e < 1 || e > xI)
    return [];
  var n = Ef, r = RI(e, Ef);
  t = On(t), e -= Ef;
  for (var i = al(r, t); ++n < e; )
    t(n);
  return i;
}
function vc() {
  return this;
}
function xm(e, t) {
  var n = e;
  return n instanceof C && (n = n.value()), _l(t, function(r, i) {
    return i.func.apply(i.thisArg, pr([r], i.args));
  }, n);
}
function _s() {
  return xm(this.__wrapped__, this.__actions__);
}
function Rm(e) {
  return k(e).toLowerCase();
}
function Tm(e) {
  return M(e) ? re(e, wn) : rt(e) ? [e] : tt(Fv(k(e)));
}
var Td = 9007199254740991;
function Pm(e) {
  return e ? Kr(I(e), -Td, Td) : e === 0 ? e : 0;
}
function Nm(e) {
  return k(e).toUpperCase();
}
function $m(e, t, n) {
  var r = M(e), i = r || zn(e) || Gr(e);
  if (t = $(t), n == null) {
    var s = e && e.constructor;
    i ? n = r ? new s() : [] : ie(e) ? n = bn(s) ? Ui(du(e)) : {} : n = {};
  }
  return (i ? zt : An)(e, function(o, a, u) {
    return t(n, o, a, u);
  }), n;
}
function Mm(e, t) {
  for (var n = e.length; n-- && Vi(t, e[n], 0) > -1; )
    ;
  return n;
}
function Im(e, t) {
  for (var n = -1, r = e.length; ++n < r && Vi(t, e[n], 0) > -1; )
    ;
  return n;
}
function Dm(e, t, n) {
  if (e = k(e), e && (n || t === void 0))
    return yv(e);
  if (!e || !(t = yt(t)))
    return e;
  var r = Qt(e), i = Qt(t), s = Im(r, i), o = Mm(r, i) + 1;
  return dr(r, s, o).join("");
}
function Cm(e, t, n) {
  if (e = k(e), e && (n || t === void 0))
    return e.slice(0, gv(e) + 1);
  if (!e || !(t = yt(t)))
    return e;
  var r = Qt(e), i = Mm(r, Qt(t)) + 1;
  return dr(r, 0, i).join("");
}
var TI = /^\s+/;
function Lm(e, t, n) {
  if (e = k(e), e && (n || t === void 0))
    return e.replace(TI, "");
  if (!e || !(t = yt(t)))
    return e;
  var r = Qt(e), i = Im(r, Qt(t));
  return dr(r, i).join("");
}
var PI = 30, NI = "...", $I = /\w*$/;
function jm(e, t) {
  var n = PI, r = NI;
  if (ie(t)) {
    var i = "separator" in t ? t.separator : i;
    n = "length" in t ? I(t.length) : n, r = "omission" in t ? yt(t.omission) : r;
  }
  e = k(e);
  var s = e.length;
  if (Gi(e)) {
    var o = Qt(e);
    s = o.length;
  }
  if (n >= s)
    return e;
  var a = n - Ki(r);
  if (a < 1)
    return r;
  var u = o ? dr(o, 0, a).join("") : e.slice(0, a);
  if (i === void 0)
    return u + r;
  if (o && (a += u.length - a), Pu(i)) {
    if (e.slice(a).search(i)) {
      var f, c = u;
      for (i.global || (i = RegExp(i.source, k($I.exec(i)) + "g")), i.lastIndex = 0; f = i.exec(c); )
        var l = f.index;
      u = u.slice(0, l === void 0 ? a : l);
    }
  } else if (e.indexOf(yt(i), a) != a) {
    var h = u.lastIndexOf(i);
    h > -1 && (u = u.slice(0, h));
  }
  return u + r;
}
function Fm(e) {
  return ol(e, 1);
}
var MI = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'"
}, II = vl(MI), Bm = /&(?:amp|lt|gt|quot|#39);/g, DI = RegExp(Bm.source);
function zm(e) {
  return e = k(e), e && DI.test(e) ? e.replace(Bm, II) : e;
}
var CI = 1 / 0, LI = vi && 1 / mu(new vi([, -0]))[1] == CI ? function(e) {
  return new vi(e);
} : su, jI = 200;
function or(e, t, n) {
  var r = -1, i = uu, s = e.length, o = !0, a = [], u = a;
  if (n)
    o = !1, i = Ll;
  else if (s >= jI) {
    var f = t ? null : LI(e);
    if (f)
      return mu(f);
    o = !1, i = Fs, u = new $r();
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
var Um = D(function(e) {
  return or(Pe(e, 1, ue, !0));
}), Vm = D(function(e) {
  var t = wt(e);
  return ue(t) && (t = void 0), or(Pe(e, 1, ue, !0), $(t));
}), km = D(function(e) {
  var t = wt(e);
  return t = typeof t == "function" ? t : void 0, or(Pe(e, 1, ue, !0), void 0, t);
});
function Wm(e) {
  return e && e.length ? or(e) : [];
}
function qm(e, t) {
  return e && e.length ? or(e, $(t)) : [];
}
function Gm(e, t) {
  return t = typeof t == "function" ? t : void 0, e && e.length ? or(e, void 0, t) : [];
}
var FI = 0;
function Hm(e) {
  var t = ++FI;
  return k(e) + t;
}
function Km(e, t) {
  return e == null ? !0 : Jl(e, t);
}
var BI = Math.max;
function Du(e) {
  if (!(e && e.length))
    return [];
  var t = 0;
  return e = _r(e, function(n) {
    if (ue(n))
      return t = BI(n.length, t), !0;
  }), al(t, function(n) {
    return re(e, Nl(n));
  });
}
function ih(e, t) {
  if (!(e && e.length))
    return [];
  var n = Du(e);
  return t == null ? n : re(n, function(r) {
    return bt(t, void 0, r);
  });
}
function Ym(e, t, n, r) {
  return mo(e, t, n(Hr(e, t)), r);
}
function Xm(e, t, n) {
  return e == null ? e : Ym(e, t, On(n));
}
function Jm(e, t, n, r) {
  return r = typeof r == "function" ? r : void 0, e == null ? e : Ym(e, t, On(n), r);
}
var Zm = Hi(function(e, t, n) {
  return e + (n ? " " : "") + t.toUpperCase();
});
function Qm(e) {
  return e == null ? [] : kl(e, Ke(e));
}
var e1 = D(function(e, t) {
  return ue(e) ? _o(e, t) : [];
});
function t1(e, t) {
  return wo(On(t), e);
}
var n1 = Kn(function(e) {
  var t = e.length, n = t ? e[0] : 0, r = this.__wrapped__, i = function(s) {
    return cl(s, e);
  };
  return t > 1 || this.__actions__.length || !(r instanceof C) || !kn(n) ? this.thru(i) : (r = r.slice(n, +n + (t ? 1 : 0)), r.__actions__.push({
    func: Ao,
    args: [i],
    thisArg: void 0
  }), new Lt(r, this.__chain__).thru(function(s) {
    return t && !s.length && s.push(void 0), s;
  }));
});
function r1() {
  return ml(this);
}
function i1() {
  var e = this.__wrapped__;
  if (e instanceof C) {
    var t = e;
    return this.__actions__.length && (t = new C(this)), t = t.reverse(), t.__actions__.push({
      func: Ao,
      args: [Ra],
      thisArg: void 0
    }), new Lt(t, this.__chain__);
  }
  return this.thru(Ra);
}
function sh(e, t, n) {
  var r = e.length;
  if (r < 2)
    return r ? or(e[0]) : [];
  for (var i = -1, s = Array(r); ++i < r; )
    for (var o = e[i], a = -1; ++a < r; )
      a != i && (s[i] = _o(s[i] || o, e[a], t, n));
  return or(Pe(s, 1), t, n);
}
var s1 = D(function(e) {
  return sh(_r(e, ue));
}), o1 = D(function(e) {
  var t = wt(e);
  return ue(t) && (t = void 0), sh(_r(e, ue), $(t));
}), a1 = D(function(e) {
  var t = wt(e);
  return t = typeof t == "function" ? t : void 0, sh(_r(e, ue), void 0, t);
}), u1 = D(Du);
function f1(e, t, n) {
  for (var r = -1, i = e.length, s = t.length, o = {}; ++r < i; ) {
    var a = r < s ? t[r] : void 0;
    n(o, e[r], a);
  }
  return o;
}
function c1(e, t) {
  return f1(e || [], t || [], uo);
}
function l1(e, t) {
  return f1(e || [], t || [], mo);
}
var h1 = D(function(e) {
  var t = e.length, n = t > 1 ? e[t - 1] : void 0;
  return n = typeof n == "function" ? (e.pop(), n) : void 0, ih(e, n);
});
const x = {
  chunk: lg,
  compact: xg,
  concat: Rg,
  difference: Xg,
  differenceBy: Jg,
  differenceWith: Zg,
  drop: e0,
  dropRight: t0,
  dropRightWhile: n0,
  dropWhile: r0,
  fill: p0,
  findIndex: zl,
  findLastIndex: Ul,
  flatten: ll,
  flattenDeep: x0,
  flattenDepth: R0,
  fromPairs: j0,
  head: cc,
  indexOf: G0,
  initial: H0,
  intersection: K0,
  intersectionBy: Y0,
  intersectionWith: X0,
  join: Ay,
  lastIndexOf: Sy,
  nth: Hy,
  pull: bb,
  pullAll: th,
  pullAllBy: mb,
  pullAllWith: wb,
  pullAt: Ob,
  remove: Ib,
  reverse: Ra,
  slice: Gb,
  sortedIndex: Xb,
  sortedIndexBy: Jb,
  sortedIndexOf: Zb,
  sortedLastIndex: Qb,
  sortedLastIndexBy: em,
  sortedLastIndexOf: tm,
  sortedUniq: rm,
  sortedUniqBy: im,
  tail: _m,
  take: vm,
  takeRight: gm,
  takeRightWhile: ym,
  takeWhile: bm,
  union: Um,
  unionBy: Vm,
  unionWith: km,
  uniq: Wm,
  uniqBy: qm,
  uniqWith: Gm,
  unzip: Du,
  unzipWith: ih,
  without: e1,
  xor: s1,
  xorBy: o1,
  xorWith: a1,
  zip: u1,
  zipObject: c1,
  zipObjectDeep: l1,
  zipWith: h1
}, H = {
  countBy: zg,
  every: h0,
  filter: _0,
  find: g0,
  findLast: m0,
  flatMap: O0,
  flatMapDeep: E0,
  flatMapDepth: S0,
  forEach: oc,
  forEachRight: ac,
  groupBy: z0,
  includes: q0,
  invokeMap: ry,
  keyBy: Ey,
  map: vo,
  orderBy: tb,
  partition: vb,
  reduce: Nb,
  reduceRight: $b,
  reject: Mb,
  sample: zb,
  sampleSize: Ub,
  shuffle: Wb,
  size: qb,
  some: Kb,
  sortBy: Yb
}, zI = {
  now: ms
}, fe = {
  after: bv,
  ary: ol,
  before: pl,
  bind: ho,
  bindKey: vu,
  curry: Ou,
  curryRight: Eu,
  debounce: Il,
  defer: Kg,
  delay: Yg,
  flip: T0,
  memoize: lo,
  once: Zy,
  overArgs: rb,
  partial: wo,
  partialRight: $u,
  rearg: Tb,
  rest: Lb,
  spread: om,
  throttle: Em,
  unary: Fm,
  wrap: t1
}, P = {
  castArray: fg,
  clone: Og,
  cloneDeep: bu,
  cloneDeepWith: Eg,
  cloneWith: Sg,
  conformsTo: jg,
  eq: Ut,
  gt: U0,
  gte: V0,
  isArguments: sr,
  isArrayBuffer: iy,
  isArrayLike: He,
  isArrayLikeObject: ue,
  isBoolean: sy,
  isBuffer: zn,
  isDate: oy,
  isElement: ay,
  isEmpty: uy,
  isEqual: gi,
  isEqualWith: fy,
  isError: _u,
  isFinite: cy,
  isFunction: bn,
  isInteger: Gl,
  isLength: fo,
  isMap: El,
  isMatch: ly,
  isMatchWith: hy,
  isNaN: py,
  isNative: dy,
  isNil: _y,
  isNull: vy,
  isNumber: Hl,
  isObjectLike: se,
  isPlainObject: qi,
  isRegExp: Pu,
  isSafeInteger: gy,
  isSet: Sl,
  isString: go,
  isSymbol: rt,
  isTypedArray: Gr,
  isUndefined: yy,
  isWeakMap: by,
  isWeakSet: my,
  lt: Ty,
  lte: Py,
  toArray: Xl,
  toFinite: ln,
  toLength: Bl,
  toNumber: pt,
  toPlainObject: Dl,
  toSafeInteger: Pm,
  toString: k
}, Ye = {
  add: vv,
  ceil: cg,
  divide: Qg,
  floor: P0,
  max: Dy,
  maxBy: Cy,
  mean: jy,
  meanBy: Fy,
  min: Vy,
  minBy: ky,
  multiply: qy,
  round: Fb,
  subtract: hm,
  sum: pm,
  sumBy: dm
}, oh = {
  clamp: hg,
  inRange: W0,
  random: Eb
}, N = {
  assign: Lv,
  assignIn: Jf,
  assignInWith: Cs,
  assignWith: jv,
  at: Bv,
  create: Ug,
  defaults: Wg,
  defaultsDeep: Gg,
  findKey: b0,
  findLastKey: w0,
  forIn: I0,
  forInRight: D0,
  forOwn: C0,
  forOwnRight: L0,
  functions: F0,
  functionsIn: B0,
  get: pu,
  has: k0,
  hasIn: wu,
  invert: Z0,
  invertBy: ey,
  invoke: ny,
  keysIn: Ke,
  mapKeys: Ny,
  mapValues: $y,
  merge: By,
  mergeWith: Cl,
  omit: Yy,
  omitBy: Jy,
  pick: gb,
  pickBy: Zl,
  result: jb,
  set: Vb,
  setWith: kb,
  toPairs: uc,
  toPairsIn: fc,
  transform: $m,
  unset: Km,
  update: Xm,
  updateWith: Jm,
  values: Yr,
  valuesIn: Qm
}, En = {
  at: n1,
  chain: ml,
  commit: rc,
  next: lc,
  plant: _c,
  reverse: i1,
  tap: mm,
  toIterator: vc,
  value: _s,
  wrapperChain: r1
}, W = {
  camelCase: ug,
  capitalize: dl,
  deburr: gl,
  endsWith: o0,
  escape: Fl,
  escapeRegExp: c0,
  kebabCase: Oy,
  lowerCase: xy,
  lowerFirst: Ry,
  pad: hb,
  padEnd: pb,
  padStart: db,
  parseInt: _b,
  repeat: Db,
  replace: Cb,
  snakeCase: Hb,
  split: sm,
  startCase: am,
  startsWith: um,
  template: Om,
  templateSettings: Ta,
  toLower: Rm,
  toUpper: Nm,
  trim: Dm,
  trimEnd: Cm,
  trimStart: Lm,
  truncate: jm,
  unescape: zm,
  upperCase: Zm,
  upperFirst: gu,
  words: yl
}, G = {
  attempt: hl,
  bindAll: Uv,
  cond: Dg,
  conforms: Lg,
  constant: ou,
  defaultTo: Vg,
  flow: $0,
  flowRight: M0,
  iteratee: wy,
  matches: My,
  matchesProperty: Iy,
  method: zy,
  methodOf: Uy,
  noop: su,
  nthArg: Ky,
  over: nb,
  overEvery: ib,
  overSome: sb,
  property: $l,
  propertyOf: yb,
  range: xb,
  rangeRight: Rb,
  stubArray: yu,
  stubFalse: cu,
  stubObject: fm,
  stubString: cm,
  stubTrue: lm,
  times: Sm,
  toPath: Tm,
  uniqueId: Hm
};
function UI() {
  var e = new C(this.__wrapped__);
  return e.__actions__ = tt(this.__actions__), e.__dir__ = this.__dir__, e.__filtered__ = this.__filtered__, e.__iteratees__ = tt(this.__iteratees__), e.__takeCount__ = this.__takeCount__, e.__views__ = tt(this.__views__), e;
}
function VI() {
  if (this.__filtered__) {
    var e = new C(this);
    e.__dir__ = -1, e.__filtered__ = !0;
  } else
    e = this.clone(), e.__dir__ *= -1;
  return e;
}
var kI = Math.max, WI = Math.min;
function qI(e, t, n) {
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
        t = WI(t, e + o);
        break;
      case "takeRight":
        e = kI(e, t - o);
        break;
    }
  }
  return { start: e, end: t };
}
var GI = 1, HI = 2, KI = Math.min;
function YI() {
  var e = this.__wrapped__.value(), t = this.__dir__, n = M(e), r = t < 0, i = n ? e.length : 0, s = qI(0, i, this.__views__), o = s.start, a = s.end, u = a - o, f = r ? a : o - 1, c = this.__iteratees__, l = c.length, h = 0, d = KI(u, this.__takeCount__);
  if (!n || !r && i == u && d == u)
    return xm(e, this.__actions__);
  var _ = [];
  e:
    for (; u-- && h < d; ) {
      f += t;
      for (var v = -1, g = e[f]; ++v < l; ) {
        var y = c[v], b = y.iteratee, w = y.type, m = b(g);
        if (w == HI)
          g = m;
        else if (!m) {
          if (w == GI)
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
var XI = "4.17.21", JI = 2, ZI = 1, QI = 3, p1 = 4294967295, eD = Array.prototype, tD = Object.prototype, d1 = tD.hasOwnProperty, Pd = Ie ? Ie.iterator : void 0, nD = Math.max, Nd = Math.min, ah = /* @__PURE__ */ function(e) {
  return function(t, n, r) {
    if (r == null) {
      var i = ie(n), s = i && _e(n), o = s && s.length && Ru(n, s);
      (o ? o.length : i) || (r = n, n = t, t = this);
    }
    return e(t, n, r);
  };
}(Wy);
p.after = fe.after;
p.ary = fe.ary;
p.assign = N.assign;
p.assignIn = N.assignIn;
p.assignInWith = N.assignInWith;
p.assignWith = N.assignWith;
p.at = N.at;
p.before = fe.before;
p.bind = fe.bind;
p.bindAll = G.bindAll;
p.bindKey = fe.bindKey;
p.castArray = P.castArray;
p.chain = En.chain;
p.chunk = x.chunk;
p.compact = x.compact;
p.concat = x.concat;
p.cond = G.cond;
p.conforms = G.conforms;
p.constant = G.constant;
p.countBy = H.countBy;
p.create = N.create;
p.curry = fe.curry;
p.curryRight = fe.curryRight;
p.debounce = fe.debounce;
p.defaults = N.defaults;
p.defaultsDeep = N.defaultsDeep;
p.defer = fe.defer;
p.delay = fe.delay;
p.difference = x.difference;
p.differenceBy = x.differenceBy;
p.differenceWith = x.differenceWith;
p.drop = x.drop;
p.dropRight = x.dropRight;
p.dropRightWhile = x.dropRightWhile;
p.dropWhile = x.dropWhile;
p.fill = x.fill;
p.filter = H.filter;
p.flatMap = H.flatMap;
p.flatMapDeep = H.flatMapDeep;
p.flatMapDepth = H.flatMapDepth;
p.flatten = x.flatten;
p.flattenDeep = x.flattenDeep;
p.flattenDepth = x.flattenDepth;
p.flip = fe.flip;
p.flow = G.flow;
p.flowRight = G.flowRight;
p.fromPairs = x.fromPairs;
p.functions = N.functions;
p.functionsIn = N.functionsIn;
p.groupBy = H.groupBy;
p.initial = x.initial;
p.intersection = x.intersection;
p.intersectionBy = x.intersectionBy;
p.intersectionWith = x.intersectionWith;
p.invert = N.invert;
p.invertBy = N.invertBy;
p.invokeMap = H.invokeMap;
p.iteratee = G.iteratee;
p.keyBy = H.keyBy;
p.keys = _e;
p.keysIn = N.keysIn;
p.map = H.map;
p.mapKeys = N.mapKeys;
p.mapValues = N.mapValues;
p.matches = G.matches;
p.matchesProperty = G.matchesProperty;
p.memoize = fe.memoize;
p.merge = N.merge;
p.mergeWith = N.mergeWith;
p.method = G.method;
p.methodOf = G.methodOf;
p.mixin = ah;
p.negate = bo;
p.nthArg = G.nthArg;
p.omit = N.omit;
p.omitBy = N.omitBy;
p.once = fe.once;
p.orderBy = H.orderBy;
p.over = G.over;
p.overArgs = fe.overArgs;
p.overEvery = G.overEvery;
p.overSome = G.overSome;
p.partial = fe.partial;
p.partialRight = fe.partialRight;
p.partition = H.partition;
p.pick = N.pick;
p.pickBy = N.pickBy;
p.property = G.property;
p.propertyOf = G.propertyOf;
p.pull = x.pull;
p.pullAll = x.pullAll;
p.pullAllBy = x.pullAllBy;
p.pullAllWith = x.pullAllWith;
p.pullAt = x.pullAt;
p.range = G.range;
p.rangeRight = G.rangeRight;
p.rearg = fe.rearg;
p.reject = H.reject;
p.remove = x.remove;
p.rest = fe.rest;
p.reverse = x.reverse;
p.sampleSize = H.sampleSize;
p.set = N.set;
p.setWith = N.setWith;
p.shuffle = H.shuffle;
p.slice = x.slice;
p.sortBy = H.sortBy;
p.sortedUniq = x.sortedUniq;
p.sortedUniqBy = x.sortedUniqBy;
p.split = W.split;
p.spread = fe.spread;
p.tail = x.tail;
p.take = x.take;
p.takeRight = x.takeRight;
p.takeRightWhile = x.takeRightWhile;
p.takeWhile = x.takeWhile;
p.tap = En.tap;
p.throttle = fe.throttle;
p.thru = Ao;
p.toArray = P.toArray;
p.toPairs = N.toPairs;
p.toPairsIn = N.toPairsIn;
p.toPath = G.toPath;
p.toPlainObject = P.toPlainObject;
p.transform = N.transform;
p.unary = fe.unary;
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
p.words = W.words;
p.wrap = fe.wrap;
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
ah(p, p);
p.add = Ye.add;
p.attempt = G.attempt;
p.camelCase = W.camelCase;
p.capitalize = W.capitalize;
p.ceil = Ye.ceil;
p.clamp = oh.clamp;
p.clone = P.clone;
p.cloneDeep = P.cloneDeep;
p.cloneDeepWith = P.cloneDeepWith;
p.cloneWith = P.cloneWith;
p.conformsTo = P.conformsTo;
p.deburr = W.deburr;
p.defaultTo = G.defaultTo;
p.divide = Ye.divide;
p.endsWith = W.endsWith;
p.eq = P.eq;
p.escape = W.escape;
p.escapeRegExp = W.escapeRegExp;
p.every = H.every;
p.find = H.find;
p.findIndex = x.findIndex;
p.findKey = N.findKey;
p.findLast = H.findLast;
p.findLastIndex = x.findLastIndex;
p.findLastKey = N.findLastKey;
p.floor = Ye.floor;
p.forEach = H.forEach;
p.forEachRight = H.forEachRight;
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
p.identity = Ge;
p.includes = H.includes;
p.indexOf = x.indexOf;
p.inRange = oh.inRange;
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
p.isObject = ie;
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
p.kebabCase = W.kebabCase;
p.last = wt;
p.lastIndexOf = x.lastIndexOf;
p.lowerCase = W.lowerCase;
p.lowerFirst = W.lowerFirst;
p.lt = P.lt;
p.lte = P.lte;
p.max = Ye.max;
p.maxBy = Ye.maxBy;
p.mean = Ye.mean;
p.meanBy = Ye.meanBy;
p.min = Ye.min;
p.minBy = Ye.minBy;
p.stubArray = G.stubArray;
p.stubFalse = G.stubFalse;
p.stubObject = G.stubObject;
p.stubString = G.stubString;
p.stubTrue = G.stubTrue;
p.multiply = Ye.multiply;
p.nth = x.nth;
p.noop = G.noop;
p.now = zI.now;
p.pad = W.pad;
p.padEnd = W.padEnd;
p.padStart = W.padStart;
p.parseInt = W.parseInt;
p.random = oh.random;
p.reduce = H.reduce;
p.reduceRight = H.reduceRight;
p.repeat = W.repeat;
p.replace = W.replace;
p.result = N.result;
p.round = Ye.round;
p.sample = H.sample;
p.size = H.size;
p.snakeCase = W.snakeCase;
p.some = H.some;
p.sortedIndex = x.sortedIndex;
p.sortedIndexBy = x.sortedIndexBy;
p.sortedIndexOf = x.sortedIndexOf;
p.sortedLastIndex = x.sortedLastIndex;
p.sortedLastIndexBy = x.sortedLastIndexBy;
p.sortedLastIndexOf = x.sortedLastIndexOf;
p.startCase = W.startCase;
p.startsWith = W.startsWith;
p.subtract = Ye.subtract;
p.sum = Ye.sum;
p.sumBy = Ye.sumBy;
p.template = W.template;
p.times = G.times;
p.toFinite = P.toFinite;
p.toInteger = I;
p.toLength = P.toLength;
p.toLower = W.toLower;
p.toNumber = P.toNumber;
p.toSafeInteger = P.toSafeInteger;
p.toString = P.toString;
p.toUpper = W.toUpper;
p.trim = W.trim;
p.trimEnd = W.trimEnd;
p.trimStart = W.trimStart;
p.truncate = W.truncate;
p.unescape = W.unescape;
p.uniqueId = G.uniqueId;
p.upperCase = W.upperCase;
p.upperFirst = W.upperFirst;
p.each = H.forEach;
p.eachRight = H.forEachRight;
p.first = x.head;
ah(p, function() {
  var e = {};
  return An(p, function(t, n) {
    d1.call(p.prototype, n) || (e[n] = t);
  }), e;
}(), { chain: !1 });
p.VERSION = XI;
(p.templateSettings = W.templateSettings).imports._ = p;
zt(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(e) {
  p[e].placeholder = p;
});
zt(["drop", "take"], function(e, t) {
  C.prototype[e] = function(n) {
    n = n === void 0 ? 1 : nD(I(n), 0);
    var r = this.__filtered__ && !t ? new C(this) : this.clone();
    return r.__filtered__ ? r.__takeCount__ = Nd(n, r.__takeCount__) : r.__views__.push({
      size: Nd(n, p1),
      type: e + (r.__dir__ < 0 ? "Right" : "")
    }), r;
  }, C.prototype[e + "Right"] = function(n) {
    return this.reverse()[e](n).reverse();
  };
});
zt(["filter", "map", "takeWhile"], function(e, t) {
  var n = t + 1, r = n == ZI || n == QI;
  C.prototype[e] = function(i) {
    var s = this.clone();
    return s.__iteratees__.push({
      iteratee: $(i),
      type: n
    }), s.__filtered__ = s.__filtered__ || r, s;
  };
});
zt(["head", "last"], function(e, t) {
  var n = "take" + (t ? "Right" : "");
  C.prototype[e] = function() {
    return this[n](1).value()[0];
  };
});
zt(["initial", "tail"], function(e, t) {
  var n = "drop" + (t ? "" : "Right");
  C.prototype[e] = function() {
    return this.__filtered__ ? new C(this) : this[n](1);
  };
});
C.prototype.compact = function() {
  return this.filter(Ge);
};
C.prototype.find = function(e) {
  return this.filter(e).head();
};
C.prototype.findLast = function(e) {
  return this.reverse().find(e);
};
C.prototype.invokeMap = D(function(e, t) {
  return typeof e == "function" ? new C(this) : this.map(function(n) {
    return yo(n, e, t);
  });
});
C.prototype.reject = function(e) {
  return this.filter(bo($(e)));
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
  return this.take(p1);
};
An(C.prototype, function(e, t) {
  var n = /^(?:filter|find|map|reject)|While$/.test(t), r = /^(?:head|last)$/.test(t), i = p[r ? "take" + (t == "last" ? "Right" : "") : t], s = r || /^find/.test(t);
  i && (p.prototype[t] = function() {
    var o = this.__wrapped__, a = r ? [1] : arguments, u = o instanceof C, f = a[0], c = u || M(o), l = function(y) {
      var b = i.apply(p, pr([y], a));
      return r && h ? b[0] : b;
    };
    c && n && typeof f == "function" && f.length != 1 && (u = c = !1);
    var h = this.__chain__, d = !!this.__actions__.length, _ = s && !h, v = u && !d;
    if (!s && c) {
      o = v ? o : new C(this);
      var g = e.apply(o, a);
      return g.__actions__.push({ func: Ao, args: [l], thisArg: void 0 }), new Lt(g, h);
    }
    return _ && v ? e.apply(this, a) : (g = this.thru(l), _ ? r ? g.value()[0] : g.value() : g);
  });
});
zt(["pop", "push", "shift", "sort", "splice", "unshift"], function(e) {
  var t = eD[e], n = /^(?:push|sort|unshift)$/.test(e) ? "tap" : "thru", r = /^(?:pop|shift)$/.test(e);
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
An(C.prototype, function(e, t) {
  var n = p[t];
  if (n) {
    var r = n.name + "";
    d1.call(_i, r) || (_i[r] = []), _i[r].push({ name: t, func: n });
  }
});
_i[fu(void 0, JI).name] = [{
  name: "wrapper",
  func: void 0
}];
C.prototype.clone = UI;
C.prototype.reverse = VI;
C.prototype.value = YI;
p.prototype.at = En.at;
p.prototype.chain = En.wrapperChain;
p.prototype.commit = En.commit;
p.prototype.next = En.next;
p.prototype.plant = En.plant;
p.prototype.reverse = En.reverse;
p.prototype.toJSON = p.prototype.valueOf = p.prototype.value = En.value;
p.prototype.first = p.prototype.head;
Pd && (p.prototype[Pd] = En.toIterator);
/**
 * @license
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="es" -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
const z5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: vv,
  after: bv,
  ary: ol,
  assign: Lv,
  assignIn: Jf,
  assignInWith: Cs,
  assignWith: jv,
  at: Bv,
  attempt: hl,
  before: pl,
  bind: ho,
  bindAll: Uv,
  bindKey: vu,
  camelCase: ug,
  capitalize: dl,
  castArray: fg,
  ceil: cg,
  chain: ml,
  chunk: lg,
  clamp: hg,
  clone: Og,
  cloneDeep: bu,
  cloneDeepWith: Eg,
  cloneWith: Sg,
  commit: rc,
  compact: xg,
  concat: Rg,
  cond: Dg,
  conforms: Lg,
  conformsTo: jg,
  constant: ou,
  countBy: zg,
  create: Ug,
  curry: Ou,
  curryRight: Eu,
  debounce: Il,
  deburr: gl,
  default: p,
  defaultTo: Vg,
  defaults: Wg,
  defaultsDeep: Gg,
  defer: Kg,
  delay: Yg,
  difference: Xg,
  differenceBy: Jg,
  differenceWith: Zg,
  divide: Qg,
  drop: e0,
  dropRight: t0,
  dropRightWhile: n0,
  dropWhile: r0,
  each: oc,
  eachRight: ac,
  endsWith: o0,
  entries: uc,
  entriesIn: fc,
  eq: Ut,
  escape: Fl,
  escapeRegExp: c0,
  every: h0,
  extend: Jf,
  extendWith: Cs,
  fill: p0,
  filter: _0,
  find: g0,
  findIndex: zl,
  findKey: b0,
  findLast: m0,
  findLastIndex: Ul,
  findLastKey: w0,
  first: cc,
  flatMap: O0,
  flatMapDeep: E0,
  flatMapDepth: S0,
  flatten: ll,
  flattenDeep: x0,
  flattenDepth: R0,
  flip: T0,
  floor: P0,
  flow: $0,
  flowRight: M0,
  forEach: oc,
  forEachRight: ac,
  forIn: I0,
  forInRight: D0,
  forOwn: C0,
  forOwnRight: L0,
  fromPairs: j0,
  functions: F0,
  functionsIn: B0,
  get: pu,
  groupBy: z0,
  gt: U0,
  gte: V0,
  has: k0,
  hasIn: wu,
  head: cc,
  identity: Ge,
  inRange: W0,
  includes: q0,
  indexOf: G0,
  initial: H0,
  intersection: K0,
  intersectionBy: Y0,
  intersectionWith: X0,
  invert: Z0,
  invertBy: ey,
  invoke: ny,
  invokeMap: ry,
  isArguments: sr,
  isArray: M,
  isArrayBuffer: iy,
  isArrayLike: He,
  isArrayLikeObject: ue,
  isBoolean: sy,
  isBuffer: zn,
  isDate: oy,
  isElement: ay,
  isEmpty: uy,
  isEqual: gi,
  isEqualWith: fy,
  isError: _u,
  isFinite: cy,
  isFunction: bn,
  isInteger: Gl,
  isLength: fo,
  isMap: El,
  isMatch: ly,
  isMatchWith: hy,
  isNaN: py,
  isNative: dy,
  isNil: _y,
  isNull: vy,
  isNumber: Hl,
  isObject: ie,
  isObjectLike: se,
  isPlainObject: qi,
  isRegExp: Pu,
  isSafeInteger: gy,
  isSet: Sl,
  isString: go,
  isSymbol: rt,
  isTypedArray: Gr,
  isUndefined: yy,
  isWeakMap: by,
  isWeakSet: my,
  iteratee: wy,
  join: Ay,
  kebabCase: Oy,
  keyBy: Ey,
  keys: _e,
  keysIn: Ke,
  last: wt,
  lastIndexOf: Sy,
  lodash: p,
  lowerCase: xy,
  lowerFirst: Ry,
  lt: Ty,
  lte: Py,
  map: vo,
  mapKeys: Ny,
  mapValues: $y,
  matches: My,
  matchesProperty: Iy,
  max: Dy,
  maxBy: Cy,
  mean: jy,
  meanBy: Fy,
  memoize: lo,
  merge: By,
  mergeWith: Cl,
  method: zy,
  methodOf: Uy,
  min: Vy,
  minBy: ky,
  mixin: Wy,
  multiply: qy,
  negate: bo,
  next: lc,
  noop: su,
  now: ms,
  nth: Hy,
  nthArg: Ky,
  omit: Yy,
  omitBy: Jy,
  once: Zy,
  orderBy: tb,
  over: nb,
  overArgs: rb,
  overEvery: ib,
  overSome: sb,
  pad: hb,
  padEnd: pb,
  padStart: db,
  parseInt: _b,
  partial: wo,
  partialRight: $u,
  partition: vb,
  pick: gb,
  pickBy: Zl,
  plant: _c,
  property: $l,
  propertyOf: yb,
  pull: bb,
  pullAll: th,
  pullAllBy: mb,
  pullAllWith: wb,
  pullAt: Ob,
  random: Eb,
  range: xb,
  rangeRight: Rb,
  rearg: Tb,
  reduce: Nb,
  reduceRight: $b,
  reject: Mb,
  remove: Ib,
  repeat: Db,
  replace: Cb,
  rest: Lb,
  result: jb,
  reverse: Ra,
  round: Fb,
  sample: zb,
  sampleSize: Ub,
  set: Vb,
  setWith: kb,
  shuffle: Wb,
  size: qb,
  slice: Gb,
  snakeCase: Hb,
  some: Kb,
  sortBy: Yb,
  sortedIndex: Xb,
  sortedIndexBy: Jb,
  sortedIndexOf: Zb,
  sortedLastIndex: Qb,
  sortedLastIndexBy: em,
  sortedLastIndexOf: tm,
  sortedUniq: rm,
  sortedUniqBy: im,
  split: sm,
  spread: om,
  startCase: am,
  startsWith: um,
  stubArray: yu,
  stubFalse: cu,
  stubObject: fm,
  stubString: cm,
  stubTrue: lm,
  subtract: hm,
  sum: pm,
  sumBy: dm,
  tail: _m,
  take: vm,
  takeRight: gm,
  takeRightWhile: ym,
  takeWhile: bm,
  tap: mm,
  template: Om,
  templateSettings: Ta,
  throttle: Em,
  thru: Ao,
  times: Sm,
  toArray: Xl,
  toFinite: ln,
  toInteger: I,
  toIterator: vc,
  toJSON: _s,
  toLength: Bl,
  toLower: Rm,
  toNumber: pt,
  toPairs: uc,
  toPairsIn: fc,
  toPath: Tm,
  toPlainObject: Dl,
  toSafeInteger: Pm,
  toString: k,
  toUpper: Nm,
  transform: $m,
  trim: Dm,
  trimEnd: Cm,
  trimStart: Lm,
  truncate: jm,
  unary: Fm,
  unescape: zm,
  union: Um,
  unionBy: Vm,
  unionWith: km,
  uniq: Wm,
  uniqBy: qm,
  uniqWith: Gm,
  uniqueId: Hm,
  unset: Km,
  unzip: Du,
  unzipWith: ih,
  update: Xm,
  updateWith: Jm,
  upperCase: Zm,
  upperFirst: gu,
  value: _s,
  valueOf: _s,
  values: Yr,
  valuesIn: Qm,
  without: e1,
  words: yl,
  wrap: t1,
  wrapperAt: n1,
  wrapperChain: r1,
  wrapperCommit: rc,
  wrapperLodash: p,
  wrapperNext: lc,
  wrapperPlant: _c,
  wrapperReverse: i1,
  wrapperToIterator: vc,
  wrapperValue: _s,
  xor: s1,
  xorBy: o1,
  xorWith: a1,
  zip: u1,
  zipObject: c1,
  zipObjectDeep: l1,
  zipWith: h1
}, Symbol.toStringTag, { value: "Module" }));
function _1(e) {
  return [parseInt(e.substr(1, 2), 16), parseInt(e.substr(3, 2), 16), parseInt(e.substr(5, 2), 16)];
}
function Sf(e) {
  const t = Math.round(e).toString(16);
  return t.length === 1 ? `0${t}` : t;
}
function v1(e) {
  return `#${Sf(e[0])}${Sf(e[1])}${Sf(e[2])}`;
}
const rD = /rgba?\(([\s.,0-9]+)\)/;
function iD() {
  const e = document.createElement("i");
  return e.title = "Web Colour Picker", e.style.display = "none", document.body.appendChild(e), e;
}
let Zo;
function g1(e) {
  if (e[0] === "#" && e.length === 7)
    return e;
  Zo || (Zo = iD()), Zo.style.color = e;
  let t = document.defaultView.getComputedStyle(Zo, "").getPropertyValue("color");
  const r = rD.exec(t)[1].split(/\s*,\s*/).map((i) => Number(i));
  return t = v1(r), t;
}
function xf(e, t, n, r) {
  return e[r] + (t[r] - e[r]) * n;
}
function sD(e, t) {
  const n = isNaN(Number(t)) || t < 0 ? 0 : t > 1 ? 1 : Number(t), r = e.length - 1, i = Math.floor(r * n), s = r * n - i, o = e[i], a = i === r ? o : e[i + 1];
  return v1([xf(o, a, s, 0), xf(o, a, s, 1), xf(o, a, s, 2)]);
}
function oD(e) {
  const n = (typeof e == "string" ? e.split("-") : e).map((r) => _1(r.indexOf("#") === -1 ? g1(r) : r));
  return (r) => sD(n, r);
}
const aD = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i, uD = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i, fD = /[\d.]+:(#[^\s]+|[^)]+\))/gi;
function cD(e) {
  return /^[r,R,L,l]{1}[\s]*\(/.test(e);
}
function lD(e) {
  if (cD(e)) {
    let t = "", n;
    if (e[0] === "l") {
      const i = aD.exec(e), s = +i[1] + 90;
      n = i[2], t = `linear-gradient(${s}deg, `;
    } else e[0] === "r" && (t = "radial-gradient(", n = uD.exec(e)[4]);
    const r = n.match(fD);
    return r.forEach((i, s) => {
      const o = i.split(":");
      t += `${o[1]} ${Number(o[0]) * 100}%`, s !== r.length - 1 && (t += ", ");
    }), t += ")", t;
  }
  return e;
}
var $d = typeof Float32Array < "u" ? Float32Array : Array;
function Cu(e, t, n) {
  var r = t[0], i = t[1], s = t[2], o = t[3], a = t[4], u = t[5], f = t[6], c = t[7], l = t[8], h = n[0], d = n[1], _ = n[2], v = n[3], g = n[4], y = n[5], b = n[6], w = n[7], m = n[8];
  return e[0] = h * r + d * o + _ * f, e[1] = h * i + d * a + _ * c, e[2] = h * s + d * u + _ * l, e[3] = v * r + g * o + y * f, e[4] = v * i + g * a + y * c, e[5] = v * s + g * u + y * l, e[6] = b * r + w * o + m * f, e[7] = b * i + w * a + m * c, e[8] = b * s + w * u + m * l, e;
}
function hD(e, t) {
  return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = t[0], e[7] = t[1], e[8] = 1, e;
}
function pD(e, t) {
  var n = Math.sin(t), r = Math.cos(t);
  return e[0] = r, e[1] = n, e[2] = 0, e[3] = -n, e[4] = r, e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
}
function dD(e, t) {
  return e[0] = t[0], e[1] = 0, e[2] = 0, e[3] = 0, e[4] = t[1], e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
}
function _D() {
  var e = new $d(2);
  return $d != Float32Array && (e[0] = 0, e[1] = 0), e;
}
function vD(e, t) {
  var n = e[0], r = e[1], i = t[0], s = t[1];
  return Math.abs(Math.atan2(r * i - n * s, n * i + r * s));
}
(function() {
  var e = _D();
  return function(t, n, r, i, s, o) {
    var a, u;
    for (n || (n = 2), r || (r = 0), i ? u = Math.min(i * n + r, t.length) : u = t.length, a = r; a < u; a += n)
      e[0] = t[a], e[1] = t[a + 1], s(e, e, o), t[a] = e[0], t[a + 1] = e[1];
    return t;
  };
})();
function gD(e, t, n) {
  const r = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return hD(r, n), Cu(e, r, t);
}
function yD(e, t, n) {
  const r = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return pD(r, n), Cu(e, r, t);
}
function bD(e, t, n) {
  const r = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return dD(r, n), Cu(e, r, t);
}
function mD(e, t, n) {
  return Cu(e, n, t);
}
function wD(e, t) {
  const n = e ? [].concat(e) : [1, 0, 0, 0, 1, 0, 0, 0, 1];
  for (let r = 0, i = t.length; r < i; r++) {
    const s = t[r];
    switch (s[0]) {
      case "t":
        gD(n, n, [s[1], s[2]]);
        break;
      case "s":
        bD(n, n, [s[1], s[2]]);
        break;
      case "r":
        yD(n, n, s[1]);
        break;
      case "m":
        mD(n, n, s[1]);
        break;
    }
  }
  return n;
}
function y1(e, t) {
  return e[0] * t[1] - t[0] * e[1];
}
function AD(e, t, n) {
  const r = vD(e, t), i = y1(e, t) >= 0;
  return n ? i ? Math.PI * 2 - r : r : i ? r : Math.PI * 2 - r;
}
function OD(e, t, n) {
  return n ? (e[0] = t[1], e[1] = -1 * t[0]) : (e[0] = -1 * t[1], e[1] = t[0]), e;
}
function Yi(e) {
  return e.map((t) => Array.isArray(t) ? [].concat(t) : t);
}
function ED(e, t) {
  if (t === "off") return Yi(e);
  const n = typeof t == "number" && t >= 1 ? 10 ** t : 1;
  return e.map((r) => {
    const i = r.slice(1).map(Number).map((s) => t ? Math.round(s * n) / n : Math.round(s));
    return [r[0]].concat(i);
  });
}
function SD(e, t = "off") {
  return ED(e, t).map((n) => n[0] + n.slice(1).join(" ")).join("");
}
const b1 = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
};
function xD(e, t, n) {
  if (e[n].length > 7) {
    e[n].shift();
    const r = e[n];
    let i = n;
    for (; r.length; )
      t[n] = "A", e.splice(i += 1, 0, ["C"].concat(r.splice(0, 6)));
    e.splice(n, 1);
  }
}
const ws = {
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
function m1(e) {
  return Array.isArray(e) && e.every((t) => {
    const n = t[0].toLowerCase();
    return ws[n] === t.length - 1 && "achlmqstvz".includes(n);
  });
}
function w1(e) {
  return m1(e) && // @ts-ignore -- `isPathArray` also checks if it's `Array`
  e.every(([t]) => t === t.toUpperCase());
}
function A1(e) {
  return w1(e) && e.every(([t]) => "ACLMQZ".includes(t));
}
function Md(e) {
  let t = e.pathValue[e.segmentStart], n = t.toLowerCase();
  const { data: r } = e;
  for (; r.length >= ws[n] && (n === "m" && r.length > 2 ? (e.segments.push([t].concat(r.splice(0, 2))), n = "l", t = t === "m" ? "l" : "L") : e.segments.push([t].concat(r.splice(0, ws[n]))), !!ws[n]); )
    ;
}
function RD(e) {
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
function TD(e) {
  return e >= 48 && e <= 57 || e === 43 || e === 45 || e === 46;
}
function oi(e) {
  return e >= 48 && e <= 57;
}
function PD(e) {
  const { max: t, pathValue: n, index: r } = e;
  let i = r, s = !1, o = !1, a = !1, u = !1, f;
  if (i >= t) {
    e.err = `[path-util]: Invalid path value at index ${i}, "pathValue" is missing param`;
    return;
  }
  if (f = n.charCodeAt(i), (f === 43 || f === 45) && (i += 1, f = n.charCodeAt(i)), !oi(f) && f !== 46) {
    e.err = `[path-util]: Invalid path value at index ${i}, "${n[i]}" is not a number`;
    return;
  }
  if (f !== 46) {
    if (s = f === 48, i += 1, f = n.charCodeAt(i), s && i < t && f && oi(f)) {
      e.err = `[path-util]: Invalid path value at index ${r}, "${n[r]}" illegal number`;
      return;
    }
    for (; i < t && oi(n.charCodeAt(i)); )
      i += 1, o = !0;
    f = n.charCodeAt(i);
  }
  if (f === 46) {
    for (u = !0, i += 1; oi(n.charCodeAt(i)); )
      i += 1, a = !0;
    f = n.charCodeAt(i);
  }
  if (f === 101 || f === 69) {
    if (u && !o && !a) {
      e.err = `[path-util]: Invalid path value at index ${i}, "${n[i]}" invalid float exponent`;
      return;
    }
    if (i += 1, f = n.charCodeAt(i), (f === 43 || f === 45) && (i += 1), i < t && oi(n.charCodeAt(i)))
      for (; i < t && oi(n.charCodeAt(i)); )
        i += 1;
    else {
      e.err = `[path-util]: Invalid path value at index ${i}, "${n[i]}" invalid integer exponent`;
      return;
    }
  }
  e.index = i, e.param = +e.pathValue.slice(r, i);
}
function ND(e) {
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
function va(e) {
  const { pathValue: t, max: n } = e;
  for (; e.index < n && ND(t.charCodeAt(e.index)); )
    e.index += 1;
}
function $D(e) {
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
function MD(e) {
  return (e | 32) === 97;
}
function ID(e) {
  const { max: t, pathValue: n, index: r } = e, i = n.charCodeAt(r), s = ws[n[r].toLowerCase()];
  if (e.segmentStart = r, !$D(i)) {
    e.err = `[path-util]: Invalid path value "${n[r]}" is not a path command`;
    return;
  }
  if (e.index += 1, va(e), e.data = [], !s) {
    Md(e);
    return;
  }
  for (; ; ) {
    for (let o = s; o > 0; o -= 1) {
      if (MD(i) && (o === 3 || o === 4) ? RD(e) : PD(e), e.err.length)
        return;
      e.data.push(e.param), va(e), e.index < t && n.charCodeAt(e.index) === 44 && (e.index += 1, va(e));
    }
    if (e.index >= e.max || !TD(n.charCodeAt(e.index)))
      break;
  }
  Md(e);
}
class DD {
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
function uh(e) {
  if (m1(e))
    return Yi(e);
  const t = new DD(e);
  for (va(t); t.index < t.max && !t.err.length; )
    ID(t);
  return t.err ? t.err : t.segments;
}
function O1(e) {
  if (w1(e))
    return Yi(e);
  const t = uh(e);
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
function CD(e, t) {
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
function Lu(e) {
  if (A1(e))
    return Yi(e);
  const t = O1(e), n = { ...b1 }, r = t.length;
  let i = "";
  for (let s = 0; s < r; s += 1) {
    [i] = t[s], t[s] = CD(t[s], n);
    const o = t[s], a = o.length;
    n.x1 = +o[a - 2], n.y1 = +o[a - 1], n.x2 = +o[a - 4] || n.x1, n.y2 = +o[a - 3] || n.y1;
  }
  return t;
}
function LD(e) {
  return A1(e) && e.every(([t]) => "MC".includes(t));
}
function Qo(e, t, n) {
  const r = e * Math.cos(n) - t * Math.sin(n), i = e * Math.sin(n) + t * Math.cos(n);
  return { x: r, y: i };
}
function E1(e, t, n, r, i, s, o, a, u, f) {
  let c = e, l = t, h = n, d = r, _ = a, v = u;
  const g = Math.PI * 120 / 180, y = Math.PI / 180 * (+i || 0);
  let b = [], w, m, A, S, T;
  if (f)
    [m, A, S, T] = f;
  else {
    w = Qo(c, l, -y), c = w.x, l = w.y, w = Qo(_, v, -y), _ = w.x, v = w.y;
    const ye = (c - _) / 2, qt = (l - v) / 2;
    let Ar = ye * ye / (h * h) + qt * qt / (d * d);
    Ar > 1 && (Ar = Math.sqrt(Ar), h *= Ar, d *= Ar);
    const gf = h * h, yf = d * d, wp = (s === o ? -1 : 1) * Math.sqrt(Math.abs((gf * yf - gf * qt * qt - yf * ye * ye) / (gf * qt * qt + yf * ye * ye)));
    S = wp * h * qt / d + (c + _) / 2, T = wp * -d * ye / h + (l + v) / 2, m = Math.asin(((l - T) / d * 10 ** 9 >> 0) / 10 ** 9), A = Math.asin(((v - T) / d * 10 ** 9 >> 0) / 10 ** 9), m = c < S ? Math.PI - m : m, A = _ < S ? Math.PI - A : A, m < 0 && (m = Math.PI * 2 + m), A < 0 && (A = Math.PI * 2 + A), o && m > A && (m -= Math.PI * 2), !o && A > m && (A -= Math.PI * 2);
  }
  let F = A - m;
  if (Math.abs(F) > g) {
    const ye = A, qt = _, Ar = v;
    A = m + g * (o && A > m ? 1 : -1), _ = S + h * Math.cos(A), v = T + d * Math.sin(A), b = E1(_, v, h, d, i, 0, o, qt, Ar, [A, ye, S, T]);
  }
  F = A - m;
  const Tn = Math.cos(m), Go = Math.sin(m), rn = Math.cos(A), Ho = Math.sin(A), os = Math.tan(F / 4), Ko = 4 / 3 * h * os, Yo = 4 / 3 * d * os, Pn = [c, l], Nn = [c + Ko * Go, l - Yo * Tn], as = [_ + Ko * Ho, v - Yo * rn], us = [_, v];
  if (Nn[0] = 2 * Pn[0] - Nn[0], Nn[1] = 2 * Pn[1] - Nn[1], f)
    return Nn.concat(as, us, b);
  b = Nn.concat(as, us, b);
  const vf = [];
  for (let ye = 0, qt = b.length; ye < qt; ye += 1)
    vf[ye] = ye % 2 ? Qo(b[ye - 1], b[ye], y).y : Qo(b[ye], b[ye + 1], y).x;
  return vf;
}
function jD(e, t, n, r, i, s) {
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
function Tt(e, t, n) {
  const r = e[0], i = e[1], s = t[0], o = t[1];
  return [r + (s - r) * n, i + (o - i) * n];
}
function Xi(e, t) {
  return Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1]));
}
function Bs(e, t, n, r, i) {
  const s = Xi([e, t], [n, r]);
  let o = { x: 0, y: 0 };
  if (typeof i == "number")
    if (i <= 0)
      o = { x: e, y: t };
    else if (i >= s)
      o = { x: n, y: r };
    else {
      const [a, u] = Tt([e, t], [n, r], i / s);
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
function Id(e, t, n, r) {
  const s = [e, t], o = [n, r], a = Tt(s, o, 0.5), u = Tt(o, a, 0.5), f = Tt(a, u, 0.5), c = Tt(u, f, 0.5), l = Tt(f, c, 0.5), h = Bs(s[0], s[1], a[0], a[1], f[0]).point, d = Bs(l[0], l[1], c[0], c[1], u[0]).point;
  return [h.x, h.y, d.x, d.y, n, r];
}
function FD(e, t) {
  const [n] = e, r = e.slice(1).map(Number), [i, s] = r;
  let o;
  const { x1: a, y1: u, x: f, y: c } = t;
  switch ("TQ".includes(n) || (t.qx = null, t.qy = null), n) {
    case "M":
      return t.x = i, t.y = s, e;
    case "A":
      return o = [a, u].concat(r), ["C"].concat(
        E1(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9])
      );
    case "Q":
      return t.qx = i, t.qy = s, o = [a, u].concat(r), ["C"].concat(jD(o[0], o[1], o[2], o[3], o[4], o[5]));
    case "L":
      return ["C"].concat(Id(a, u, i, s));
    case "Z":
      return a === f && u === c ? ["C", a, u, f, c, f, c] : ["C"].concat(Id(a, u, f, c));
  }
  return e;
}
function S1(e, t = !1) {
  if (LD(e)) {
    const c = Yi(e);
    return t ? [c, []] : c;
  }
  const n = Lu(e), r = { ...b1 }, i = [];
  let s = "", o = n.length, a, u;
  const f = [];
  for (let c = 0; c < o; c += 1) {
    n[c] && ([s] = n[c]), i[c] = s;
    const l = FD(n[c], r);
    n[c] = l, xD(n, i, c), o = n.length, s === "Z" && f.push(c), a = n[c], u = a.length, r.x1 = +a[u - 2], r.y1 = +a[u - 1], r.x2 = +a[u - 4] || r.x1, r.y2 = +a[u - 3] || r.y1;
  }
  return t ? [n, f] : n;
}
function BD(e) {
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
function Dd(e, t) {
  const { x: n, y: r } = e, { x: i, y: s } = t, o = n * i + r * s, a = Math.sqrt((n ** 2 + r ** 2) * (i ** 2 + s ** 2));
  return (n * s - r * i < 0 ? -1 : 1) * Math.acos(o / a);
}
function zD(e, t, n, r, i, s, o, a, u, f) {
  const { abs: c, sin: l, cos: h, sqrt: d, PI: _ } = Math;
  let v = c(n), g = c(r);
  const b = (i % 360 + 360) % 360 * (_ / 180);
  if (e === a && t === u)
    return { x: e, y: t };
  if (v === 0 || g === 0)
    return Bs(e, t, a, u, f).point;
  const w = (e - a) / 2, m = (t - u) / 2, A = {
    x: h(b) * w + l(b) * m,
    y: -l(b) * w + h(b) * m
  }, S = A.x ** 2 / v ** 2 + A.y ** 2 / g ** 2;
  S > 1 && (v *= d(S), g *= d(S));
  const T = v ** 2 * g ** 2 - v ** 2 * A.y ** 2 - g ** 2 * A.x ** 2, F = v ** 2 * A.y ** 2 + g ** 2 * A.x ** 2;
  let Tn = T / F;
  Tn = Tn < 0 ? 0 : Tn;
  const Go = (s !== o ? 1 : -1) * d(Tn), rn = {
    x: Go * (v * A.y / g),
    y: Go * (-(g * A.x) / v)
  }, Ho = {
    x: h(b) * rn.x - l(b) * rn.y + (e + a) / 2,
    y: l(b) * rn.x + h(b) * rn.y + (t + u) / 2
  }, os = {
    x: (A.x - rn.x) / v,
    y: (A.y - rn.y) / g
  }, Ko = Dd({ x: 1, y: 0 }, os), Yo = {
    x: (-A.x - rn.x) / v,
    y: (-A.y - rn.y) / g
  };
  let Pn = Dd(os, Yo);
  !o && Pn > 0 ? Pn -= 2 * _ : o && Pn < 0 && (Pn += 2 * _), Pn %= 2 * _;
  const Nn = Ko + Pn * f, as = v * h(Nn), us = g * l(Nn);
  return {
    x: h(b) * as - l(b) * us + Ho.x,
    y: l(b) * as + h(b) * us + Ho.y
  };
}
function UD(e, t, n, r, i, s, o, a, u, f) {
  const c = typeof f == "number";
  let l = e, h = t, d = 0, _ = [l, h, d], v = [l, h], g = 0, y = { x: 0, y: 0 }, b = [{ x: l, y: h }];
  c && f <= 0 && (y = { x: l, y: h });
  const w = 100;
  for (let m = 0; m <= w; m += 1) {
    if (g = m / w, { x: l, y: h } = zD(e, t, n, r, i, s, o, a, u, g), b = b.concat({ x: l, y: h }), d += Xi(v, [l, h]), v = [l, h], c && d >= f && f > _[2]) {
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
function VD(e, t, n, r, i, s, o, a, u) {
  const f = 1 - u;
  return {
    x: f ** 3 * e + 3 * f ** 2 * u * n + 3 * f * u ** 2 * i + u ** 3 * o,
    y: f ** 3 * t + 3 * f ** 2 * u * r + 3 * f * u ** 2 * s + u ** 3 * a
  };
}
function x1(e, t, n, r, i, s, o, a, u) {
  const f = typeof u == "number";
  let c = e, l = t, h = 0, d = [c, l, h], _ = [c, l], v = 0, g = { x: 0, y: 0 }, y = [{ x: c, y: l }];
  f && u <= 0 && (g = { x: c, y: l });
  const b = 30;
  for (let w = 0; w <= b; w += 1) {
    if (v = w / b, { x: c, y: l } = VD(e, t, n, r, i, s, o, a, v), y = y.concat({ x: c, y: l }), h += Xi(_, [c, l]), _ = [c, l], f && h >= u && u > d[2]) {
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
function kD(e, t, n, r, i, s, o) {
  const a = 1 - o;
  return {
    x: a ** 2 * e + 2 * a * o * n + o ** 2 * i,
    y: a ** 2 * t + 2 * a * o * r + o ** 2 * s
  };
}
function WD(e, t, n, r, i, s, o) {
  const a = typeof o == "number";
  let u = e, f = t, c = 0, l = [u, f, c], h = [u, f], d = 0, _ = { x: 0, y: 0 }, v = [{ x: u, y: f }];
  a && o <= 0 && (_ = { x: u, y: f });
  const g = 30;
  for (let y = 0; y <= g; y += 1) {
    if (d = y / g, { x: u, y: f } = kD(e, t, n, r, i, s, d), v = v.concat({ x: u, y: f }), c += Xi(h, [u, f]), h = [u, f], a && c >= o && o > l[2]) {
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
function ju(e, t) {
  const n = Lu(e), r = typeof t == "number";
  let i, s = [], o, a = 0, u = 0, f = 0, c = 0, l, h = [], d = [], _ = 0, v = { x: 0, y: 0 }, g = v, y = v, b = v, w = 0;
  for (let m = 0, A = n.length; m < A; m += 1)
    l = n[m], [o] = l, i = o === "M", s = i ? s : [a, u].concat(l.slice(1)), i ? ([, f, c] = l, v = { x: f, y: c }, g = v, _ = 0, r && t < 1e-3 && (b = v)) : o === "L" ? { length: _, min: v, max: g, point: y } = Bs(s[0], s[1], s[2], s[3], (t || 0) - w) : o === "A" ? { length: _, min: v, max: g, point: y } = UD(
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
    ) : o === "C" ? { length: _, min: v, max: g, point: y } = x1(
      s[0],
      s[1],
      s[2],
      s[3],
      s[4],
      s[5],
      s[6],
      s[7],
      (t || 0) - w
    ) : o === "Q" ? { length: _, min: v, max: g, point: y } = WD(
      s[0],
      s[1],
      s[2],
      s[3],
      s[4],
      s[5],
      (t || 0) - w
    ) : o === "Z" && (s = [a, u, f, c], { length: _, min: v, max: g, point: y } = Bs(s[0], s[1], s[2], s[3], (t || 0) - w)), r && w < t && w + _ >= t && (b = y), d.push(g), h.push(v), w += _, [a, u] = o !== "Z" ? l.slice(-2) : [f, c];
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
function qD(e) {
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
  } = ju(e), s = r - t, o = i - n;
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
function As(e) {
  return ju(e).length;
}
function GD(e) {
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
  } = ju(e), o = i - n, a = s - r;
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
function HD(e) {
  const t = e.length, n = t - 1;
  return e.map(
    (r, i) => e.map((s, o) => {
      let a = i + o, u;
      return o === 0 || e[a] && e[a][0] === "M" ? (u = e[a], ["M"].concat(u.slice(-2))) : (a >= t && (a -= n), e[a]);
    })
  );
}
function KD(e, t) {
  const n = e.length - 1, r = [];
  let i = 0, s = 0;
  const o = HD(e);
  return o.forEach((a, u) => {
    e.slice(1).forEach((f, c) => {
      s += Xi(e[(u + c) % n].slice(-2), t[c % n].slice(-2));
    }), r[u] = s, s = 0;
  }), i = r.indexOf(Math.min.apply(null, r)), o[i];
}
function YD(e, t, n, r, i, s, o, a) {
  return 3 * ((a - t) * (n + i) - (o - e) * (r + s) + r * (e - i) - n * (t - s) + a * (i + e / 3) - o * (s + t / 3)) / 20;
}
function R1(e) {
  let t = 0, n = 0, r = 0;
  return S1(e).map((i) => {
    switch (i[0]) {
      case "M":
        return [, t, n] = i, 0;
      default:
        const [s, o, a, u, f, c] = i.slice(1);
        return r = YD(t, n, s, o, a, u, f, c), [t, n] = i.slice(-2), r;
    }
  }).reduce((i, s) => i + s, 0);
}
function XD(e) {
  return R1(e) >= 0;
}
function ga(e, t) {
  return ju(e, t).point;
}
function JD(e, t) {
  const n = uh(e);
  if (typeof n == "string")
    throw TypeError(n);
  let r = n.slice(), i = As(r), s = r.length - 1, o = 0, a = 0, u = n[0];
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
    return r = n.slice(0, -1), o = As(r), a = i - o, {
      segment: n[s],
      index: s,
      length: a,
      lengthAtSegment: o
    };
  const h = [];
  for (; s > 0; )
    u = r[s], r = r.slice(0, -1), o = As(r), a = i - o, i = o, h.push({
      segment: u,
      index: s,
      length: a,
      lengthAtSegment: o
    }), s -= 1;
  return h.find(({ lengthAtSegment: d }) => d <= t);
}
function ZD(e, t) {
  const n = uh(e), r = Lu(n), i = As(n), s = (m) => {
    const A = m.x - t.x, S = m.y - t.y;
    return A * A + S * S;
  };
  let o = 8, a, u = 0, f = { x: 0, y: 0 }, c = 0, l = 1 / 0;
  for (let m = 0; m <= i; m += o)
    a = ga(r, m), u = s(a), u < l && (f = a, c = m, l = u);
  o /= 2;
  let h, d, _ = 0, v = 0, g = 0, y = 0;
  for (; o > 0.5; )
    _ = c - o, h = ga(r, _), g = s(h), v = c + o, d = ga(r, v), y = s(d), _ >= 0 && g < l ? (f = h, c = _, l = g) : v <= i && y < l ? (f = d, c = v, l = y) : o /= 2;
  const b = JD(n, c), w = Math.sqrt(l);
  return { closest: f, distance: w, segment: b };
}
function QD(e, t) {
  const { distance: n } = ZD(e, t);
  return Math.abs(n) < 1e-3;
}
function eC(e, t = 0.5) {
  const n = e.slice(0, 2), r = e.slice(2, 4), i = e.slice(4, 6), s = e.slice(6, 8), o = Tt(n, r, t), a = Tt(r, i, t), u = Tt(i, s, t), f = Tt(o, a, t), c = Tt(a, u, t), l = Tt(f, c, t);
  return [
    // @ts-ignore
    ["C"].concat(o, f, l),
    // @ts-ignore
    ["C"].concat(c, u, s)
  ];
}
function Cd(e) {
  return e.map((t, n, r) => {
    const i = n && r[n - 1].slice(-2).concat(t.slice(1)), s = n ? x1(
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
    return n ? o = s ? eC(i) : [t, t] : o = [t], {
      s: t,
      ss: o,
      l: s
    };
  });
}
function T1(e, t, n) {
  const r = Cd(e), i = Cd(t), s = r.length, o = i.length, a = r.filter((g) => g.l).length, u = i.filter((g) => g.l).length, f = r.filter((g) => g.l).reduce((g, { l: y }) => g + y, 0) / a || 0, c = i.filter((g) => g.l).reduce((g, { l: y }) => g + y, 0) / u || 0, l = n || Math.max(s, o), h = [f, c], d = [l - s, l - o];
  let _ = 0;
  const v = [r, i].map(
    (g, y) => (
      // @ts-ignore
      g.l === l ? g.map((b) => b.s) : g.map((b, w) => (_ = w && d[y] && b.l >= h[y], d[y] -= _ ? 1 : 0, _ ? b.ss : [b.s])).flat()
    )
  );
  return v[0].length === v[1].length ? v : T1(v[0], v[1], l);
}
const U5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angleTo: AD,
  clonePath: Yi,
  direction: y1,
  distanceSquareRoot: Xi,
  equalizeSegments: T1,
  getDrawDirection: XD,
  getPathArea: R1,
  getPathBBox: qD,
  getPathBBoxTotalLength: GD,
  getPointAtLength: ga,
  getRotatedCurve: KD,
  getTotalLength: As,
  gradient: oD,
  isPointInStroke: QD,
  normalizePath: Lu,
  path2Absolute: O1,
  path2Curve: S1,
  path2String: SD,
  reverseCurve: BD,
  rgb2arr: _1,
  toCSSGradient: lD,
  toRGB: g1,
  transform: wD,
  vertical: OD
}, Symbol.toStringTag, { value: "Module" }));
var Fu = Symbol.for("immer-nothing"), yi = Symbol.for("immer-draftable"), U = Symbol.for("immer-state"), P1 = process.env.NODE_ENV !== "production" ? [
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
function ce(e, ...t) {
  if (process.env.NODE_ENV !== "production") {
    const n = P1[e], r = typeof n == "function" ? n.apply(null, t) : n;
    throw new Error(`[Immer] ${r}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var Mr = Object.getPrototypeOf;
function Un(e) {
  return !!e && !!e[U];
}
function en(e) {
  return e ? N1(e) || Array.isArray(e) || !!e[yi] || !!e.constructor?.[yi] || Oo(e) || Eo(e) : !1;
}
var tC = Object.prototype.constructor.toString();
function N1(e) {
  if (!e || typeof e != "object")
    return !1;
  const t = Mr(e);
  if (t === null)
    return !0;
  const n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return n === Object ? !0 : typeof n == "function" && Function.toString.call(n) === tC;
}
function nC(e) {
  return Un(e) || ce(15, e), e[U].base_;
}
function Si(e, t) {
  Ir(e) === 0 ? Reflect.ownKeys(e).forEach((n) => {
    t(n, e[n], e);
  }) : e.forEach((n, r) => t(r, n, e));
}
function Ir(e) {
  const t = e[U];
  return t ? t.type_ : Array.isArray(e) ? 1 : Oo(e) ? 2 : Eo(e) ? 3 : 0;
}
function zs(e, t) {
  return Ir(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function Rf(e, t) {
  return Ir(e) === 2 ? e.get(t) : e[t];
}
function $1(e, t, n) {
  const r = Ir(e);
  r === 2 ? e.set(t, n) : r === 3 ? e.add(n) : e[t] = n;
}
function rC(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function Oo(e) {
  return e instanceof Map;
}
function Eo(e) {
  return e instanceof Set;
}
function be(e) {
  return e.copy_ || e.base_;
}
function gc(e, t) {
  if (Oo(e))
    return new Map(e);
  if (Eo(e))
    return new Set(e);
  if (Array.isArray(e))
    return Array.prototype.slice.call(e);
  const n = N1(e);
  if (t === !0 || t === "class_only" && !n) {
    const r = Object.getOwnPropertyDescriptors(e);
    delete r[U];
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
    return Object.create(Mr(e), r);
  } else {
    const r = Mr(e);
    if (r !== null && n)
      return { ...e };
    const i = Object.create(r);
    return Object.assign(i, e);
  }
}
function Bu(e, t = !1) {
  return zu(e) || Un(e) || !en(e) || (Ir(e) > 1 && (e.set = e.add = e.clear = e.delete = iC), Object.freeze(e), t && Object.entries(e).forEach(([n, r]) => Bu(r, !0))), e;
}
function iC() {
  ce(2);
}
function zu(e) {
  return Object.isFrozen(e);
}
var yc = {};
function Dr(e) {
  const t = yc[e];
  return t || ce(0, e), t;
}
function M1(e, t) {
  yc[e] || (yc[e] = t);
}
var Us;
function Pa() {
  return Us;
}
function sC(e, t) {
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
function Ld(e, t) {
  t && (Dr("Patches"), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function bc(e) {
  mc(e), e.drafts_.forEach(oC), e.drafts_ = null;
}
function mc(e) {
  e === Us && (Us = e.parent_);
}
function jd(e) {
  return Us = sC(Us, e);
}
function oC(e) {
  const t = e[U];
  t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function Fd(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const n = t.drafts_[0];
  return e !== void 0 && e !== n ? (n[U].modified_ && (bc(t), ce(4)), en(e) && (e = Na(t, e), t.parent_ || $a(t, e)), t.patches_ && Dr("Patches").generateReplacementPatches_(
    n[U].base_,
    e,
    t.patches_,
    t.inversePatches_
  )) : e = Na(t, n, []), bc(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== Fu ? e : void 0;
}
function Na(e, t, n) {
  if (zu(t))
    return t;
  const r = t[U];
  if (!r)
    return Si(
      t,
      (i, s) => Bd(e, r, t, i, s, n)
    ), t;
  if (r.scope_ !== e)
    return t;
  if (!r.modified_)
    return $a(e, r.base_, !0), r.base_;
  if (!r.finalized_) {
    r.finalized_ = !0, r.scope_.unfinalizedDrafts_--;
    const i = r.copy_;
    let s = i, o = !1;
    r.type_ === 3 && (s = new Set(i), i.clear(), o = !0), Si(
      s,
      (a, u) => Bd(e, r, i, a, u, n, o)
    ), $a(e, i, !1), n && e.patches_ && Dr("Patches").generatePatches_(
      r,
      n,
      e.patches_,
      e.inversePatches_
    );
  }
  return r.copy_;
}
function Bd(e, t, n, r, i, s, o) {
  if (process.env.NODE_ENV !== "production" && i === n && ce(5), Un(i)) {
    const a = s && t && t.type_ !== 3 && // Set objects are atomic since they have no keys.
    !zs(t.assigned_, r) ? s.concat(r) : void 0, u = Na(e, i, a);
    if ($1(n, r, u), Un(u))
      e.canAutoFreeze_ = !1;
    else
      return;
  } else o && n.add(i);
  if (en(i) && !zu(i)) {
    if (!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1)
      return;
    Na(e, i), (!t || !t.scope_.parent_) && typeof r != "symbol" && Object.prototype.propertyIsEnumerable.call(n, r) && $a(e, i);
  }
}
function $a(e, t, n = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && Bu(t, n);
}
function aC(e, t) {
  const n = Array.isArray(e), r = {
    type_: n ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: t ? t.scope_ : Pa(),
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
  let i = r, s = fh;
  n && (i = [r], s = Vs);
  const { revoke: o, proxy: a } = Proxy.revocable(i, s);
  return r.draft_ = a, r.revoke_ = o, a;
}
var fh = {
  get(e, t) {
    if (t === U)
      return e;
    const n = be(e);
    if (!zs(n, t))
      return uC(e, n, t);
    const r = n[t];
    return e.finalized_ || !en(r) ? r : r === Tf(e.base_, t) ? (Pf(e), e.copy_[t] = ks(r, e)) : r;
  },
  has(e, t) {
    return t in be(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(be(e));
  },
  set(e, t, n) {
    const r = I1(be(e), t);
    if (r?.set)
      return r.set.call(e.draft_, n), !0;
    if (!e.modified_) {
      const i = Tf(be(e), t), s = i?.[U];
      if (s && s.base_ === n)
        return e.copy_[t] = n, e.assigned_[t] = !1, !0;
      if (rC(n, i) && (n !== void 0 || zs(e.base_, t)))
        return !0;
      Pf(e), In(e);
    }
    return e.copy_[t] === n && // special case: handle new props with value 'undefined'
    (n !== void 0 || t in e.copy_) || // special case: NaN
    Number.isNaN(n) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = n, e.assigned_[t] = !0), !0;
  },
  deleteProperty(e, t) {
    return Tf(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_[t] = !1, Pf(e), In(e)) : delete e.assigned_[t], e.copy_ && delete e.copy_[t], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(e, t) {
    const n = be(e), r = Reflect.getOwnPropertyDescriptor(n, t);
    return r && {
      writable: !0,
      configurable: e.type_ !== 1 || t !== "length",
      enumerable: r.enumerable,
      value: n[t]
    };
  },
  defineProperty() {
    ce(11);
  },
  getPrototypeOf(e) {
    return Mr(e.base_);
  },
  setPrototypeOf() {
    ce(12);
  }
}, Vs = {};
Si(fh, (e, t) => {
  Vs[e] = function() {
    return arguments[0] = arguments[0][0], t.apply(this, arguments);
  };
});
Vs.deleteProperty = function(e, t) {
  return process.env.NODE_ENV !== "production" && isNaN(parseInt(t)) && ce(13), Vs.set.call(this, e, t, void 0);
};
Vs.set = function(e, t, n) {
  return process.env.NODE_ENV !== "production" && t !== "length" && isNaN(parseInt(t)) && ce(14), fh.set.call(this, e[0], t, n, e[0]);
};
function Tf(e, t) {
  const n = e[U];
  return (n ? be(n) : e)[t];
}
function uC(e, t, n) {
  const r = I1(t, n);
  return r ? "value" in r ? r.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    r.get?.call(e.draft_)
  ) : void 0;
}
function I1(e, t) {
  if (!(t in e))
    return;
  let n = Mr(e);
  for (; n; ) {
    const r = Object.getOwnPropertyDescriptor(n, t);
    if (r)
      return r;
    n = Mr(n);
  }
}
function In(e) {
  e.modified_ || (e.modified_ = !0, e.parent_ && In(e.parent_));
}
function Pf(e) {
  e.copy_ || (e.copy_ = gc(
    e.base_,
    e.scope_.immer_.useStrictShallowCopy_
  ));
}
var D1 = class {
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
      typeof n != "function" && ce(6), r !== void 0 && typeof r != "function" && ce(7);
      let i;
      if (en(t)) {
        const s = jd(this), o = ks(t, void 0);
        let a = !0;
        try {
          i = n(o), a = !1;
        } finally {
          a ? bc(s) : mc(s);
        }
        return Ld(s, r), Fd(i, s);
      } else if (!t || typeof t != "object") {
        if (i = n(t), i === void 0 && (i = t), i === Fu && (i = void 0), this.autoFreeze_ && Bu(i, !0), r) {
          const s = [], o = [];
          Dr("Patches").generateReplacementPatches_(t, i, s, o), r(s, o);
        }
        return i;
      } else
        ce(1, t);
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
    en(e) || ce(8), Un(e) && (e = C1(e));
    const t = jd(this), n = ks(e, void 0);
    return n[U].isManual_ = !0, mc(t), n;
  }
  finishDraft(e, t) {
    const n = e && e[U];
    (!n || !n.isManual_) && ce(9);
    const { scope_: r } = n;
    return Ld(r, t), Fd(void 0, r);
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
    const r = Dr("Patches").applyPatches_;
    return Un(e) ? r(e, t) : this.produce(
      e,
      (i) => r(i, t)
    );
  }
};
function ks(e, t) {
  const n = Oo(e) ? Dr("MapSet").proxyMap_(e, t) : Eo(e) ? Dr("MapSet").proxySet_(e, t) : aC(e, t);
  return (t ? t.scope_ : Pa()).drafts_.push(n), n;
}
function C1(e) {
  return Un(e) || ce(10, e), L1(e);
}
function L1(e) {
  if (!en(e) || zu(e))
    return e;
  const t = e[U];
  let n;
  if (t) {
    if (!t.modified_)
      return t.base_;
    t.finalized_ = !0, n = gc(e, t.scope_.immer_.useStrictShallowCopy_);
  } else
    n = gc(e, !0);
  return Si(n, (r, i) => {
    $1(n, r, L1(i));
  }), t && (t.finalized_ = !1), n;
}
function fC() {
  process.env.NODE_ENV !== "production" && P1.push(
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
    Si(h.assigned_, (b, w) => {
      const m = Rf(g, b), A = Rf(y, b), S = w ? zs(g, b) ? t : n : r;
      if (m === A && S === t)
        return;
      const T = d.concat(b);
      _.push(S === r ? { op: S, path: T } : { op: S, path: T, value: A }), v.push(
        S === n ? { op: r, path: T } : S === r ? { op: n, path: T, value: l(m) } : { op: t, path: T, value: l(m) }
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
      value: d === Fu ? void 0 : d
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
        const S = Ir(y);
        let T = v[A];
        typeof T != "string" && typeof T != "number" && (T = "" + T), (S === 0 || S === 1) && (T === "__proto__" || T === "constructor") && ce(19), typeof y == "function" && T === "prototype" && ce(19), y = Rf(y, T), typeof y != "object" && ce(18, v.join("/"));
      }
      const b = Ir(y), w = c(_.value), m = v[v.length - 1];
      switch (g) {
        case t:
          switch (b) {
            case 2:
              return y.set(m, w);
            case 3:
              ce(16);
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
          ce(17, g);
      }
    }), h;
  }
  function c(h) {
    if (!en(h))
      return h;
    if (Array.isArray(h))
      return h.map(c);
    if (Oo(h))
      return new Map(
        Array.from(h.entries()).map(([_, v]) => [_, c(v)])
      );
    if (Eo(h))
      return new Set(Array.from(h).map(c));
    const d = Object.create(Mr(h));
    for (const _ in h)
      d[_] = c(h[_]);
    return zs(h, yi) && (d[yi] = h[yi]), d;
  }
  function l(h) {
    return Un(h) ? c(h) : h;
  }
  M1("Patches", {
    applyPatches_: f,
    generatePatches_: i,
    generateReplacementPatches_: u
  });
}
function cC() {
  class e extends Map {
    constructor(u, f) {
      super(), this[U] = {
        type_: 2,
        parent_: f,
        scope_: f ? f.scope_ : Pa(),
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
      return be(this[U]).size;
    }
    has(u) {
      return be(this[U]).has(u);
    }
    set(u, f) {
      const c = this[U];
      return o(c), (!be(c).has(u) || be(c).get(u) !== f) && (n(c), In(c), c.assigned_.set(u, !0), c.copy_.set(u, f), c.assigned_.set(u, !0)), this;
    }
    delete(u) {
      if (!this.has(u))
        return !1;
      const f = this[U];
      return o(f), n(f), In(f), f.base_.has(u) ? f.assigned_.set(u, !1) : f.assigned_.delete(u), f.copy_.delete(u), !0;
    }
    clear() {
      const u = this[U];
      o(u), be(u).size && (n(u), In(u), u.assigned_ = /* @__PURE__ */ new Map(), Si(u.base_, (f) => {
        u.assigned_.set(f, !1);
      }), u.copy_.clear());
    }
    forEach(u, f) {
      const c = this[U];
      be(c).forEach((l, h, d) => {
        u.call(f, this.get(h), h, this);
      });
    }
    get(u) {
      const f = this[U];
      o(f);
      const c = be(f).get(u);
      if (f.finalized_ || !en(c) || c !== f.base_.get(u))
        return c;
      const l = ks(c, f);
      return n(f), f.copy_.set(u, l), l;
    }
    keys() {
      return be(this[U]).keys();
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
      super(), this[U] = {
        type_: 3,
        parent_: f,
        scope_: f ? f.scope_ : Pa(),
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
      return be(this[U]).size;
    }
    has(u) {
      const f = this[U];
      return o(f), f.copy_ ? !!(f.copy_.has(u) || f.drafts_.has(u) && f.copy_.has(f.drafts_.get(u))) : f.base_.has(u);
    }
    add(u) {
      const f = this[U];
      return o(f), this.has(u) || (s(f), In(f), f.copy_.add(u)), this;
    }
    delete(u) {
      if (!this.has(u))
        return !1;
      const f = this[U];
      return o(f), s(f), In(f), f.copy_.delete(u) || (f.drafts_.has(u) ? f.copy_.delete(f.drafts_.get(u)) : (
        /* istanbul ignore next */
        !1
      ));
    }
    clear() {
      const u = this[U];
      o(u), be(u).size && (s(u), In(u), u.copy_.clear());
    }
    values() {
      const u = this[U];
      return o(u), s(u), u.copy_.values();
    }
    entries() {
      const u = this[U];
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
      if (en(u)) {
        const f = ks(u, a);
        a.drafts_.set(u, f), a.copy_.add(f);
      } else
        a.copy_.add(u);
    }));
  }
  function o(a) {
    a.revoked_ && ce(3, JSON.stringify(be(a)));
  }
  M1("MapSet", { proxyMap_: t, proxySet_: i });
}
var At = new D1(), lC = At.produce, hC = At.produceWithPatches.bind(
  At
), pC = At.setAutoFreeze.bind(At), dC = At.setUseStrictShallowCopy.bind(At), _C = At.applyPatches.bind(At), vC = At.createDraft.bind(At), gC = At.finishDraft.bind(At);
function yC(e) {
  return e;
}
function bC(e) {
  return e;
}
const V5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Immer: D1,
  applyPatches: _C,
  castDraft: yC,
  castImmutable: bC,
  createDraft: vC,
  current: C1,
  enableMapSet: cC,
  enablePatches: fC,
  finishDraft: gC,
  freeze: Bu,
  immerable: yi,
  isDraft: Un,
  isDraftable: en,
  nothing: Fu,
  original: nC,
  produce: lC,
  produceWithPatches: hC,
  setAutoFreeze: pC,
  setUseStrictShallowCopy: dC
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
var So = "delete", Y = 5, lt = 1 << Y, Be = lt - 1, L = {};
function wc() {
  return { value: !1 };
}
function $t(e) {
  e && (e.value = !0);
}
function ch() {
}
function xi(e) {
  return e.size === void 0 && (e.size = e.__iterate(j1)), e.size;
}
function ar(e, t) {
  if (typeof t != "number") {
    var n = t >>> 0;
    if ("" + n !== t || n === 4294967295)
      return NaN;
    t = n;
  }
  return t < 0 ? xi(e) + t : t;
}
function j1() {
  return !0;
}
function xo(e, t, n) {
  return (e === 0 && !B1(e) || n !== void 0 && e <= -n) && (t === void 0 || n !== void 0 && t >= n);
}
function Ji(e, t) {
  return F1(e, t, 0);
}
function Ro(e, t) {
  return F1(e, t, t);
}
function F1(e, t, n) {
  return e === void 0 ? n : B1(e) ? t === 1 / 0 ? t : Math.max(0, t + e) | 0 : t === void 0 || t === e ? e : Math.min(t, e) | 0;
}
function B1(e) {
  return e < 0 || e === 0 && 1 / e === -1 / 0;
}
var z1 = "@@__IMMUTABLE_ITERABLE__@@";
function it(e) {
  return !!(e && // @ts-expect-error: maybeCollection is typed as `{}`, need to change in 6.0 to `maybeCollection && typeof maybeCollection === 'object' && IS_COLLECTION_SYMBOL in maybeCollection`
  e[z1]);
}
var Ma = "@@__IMMUTABLE_KEYED__@@";
function J(e) {
  return !!(e && // @ts-expect-error: maybeKeyed is typed as `{}`, need to change in 6.0 to `maybeKeyed && typeof maybeKeyed === 'object' && IS_KEYED_SYMBOL in maybeKeyed`
  e[Ma]);
}
var Ia = "@@__IMMUTABLE_INDEXED__@@";
function st(e) {
  return !!(e && // @ts-expect-error: maybeIndexed is typed as `{}`, need to change in 6.0 to `maybeIndexed && typeof maybeIndexed === 'object' && IS_INDEXED_SYMBOL in maybeIndexed`
  e[Ia]);
}
function Uu(e) {
  return J(e) || st(e);
}
var Oe = function(t) {
  return it(t) ? t : Ce(t);
}, Vt = /* @__PURE__ */ function(e) {
  function t(n) {
    return J(n) ? n : yr(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(Oe), Xr = /* @__PURE__ */ function(e) {
  function t(n) {
    return st(n) ? n : Wt(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(Oe), Zi = /* @__PURE__ */ function(e) {
  function t(n) {
    return it(n) && !Uu(n) ? n : ts(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(Oe);
Oe.Keyed = Vt;
Oe.Indexed = Xr;
Oe.Set = Zi;
var U1 = "@@__IMMUTABLE_SEQ__@@";
function Vu(e) {
  return !!(e && // @ts-expect-error: maybeSeq is typed as `{}`, need to change in 6.0 to `maybeSeq && typeof maybeSeq === 'object' && MAYBE_SEQ_SYMBOL in maybeSeq`
  e[U1]);
}
var V1 = "@@__IMMUTABLE_RECORD__@@";
function gr(e) {
  return !!(e && // @ts-expect-error: maybeRecord is typed as `{}`, need to change in 6.0 to `maybeRecord && typeof maybeRecord === 'object' && IS_RECORD_SYMBOL in maybeRecord`
  e[V1]);
}
function kt(e) {
  return it(e) || gr(e);
}
var ur = "@@__IMMUTABLE_ORDERED__@@";
function Yt(e) {
  return !!(e && // @ts-expect-error: maybeOrdered is typed as `{}`, need to change in 6.0 to `maybeOrdered && typeof maybeOrdered === 'object' && IS_ORDERED_SYMBOL in maybeOrdered`
  e[ur]);
}
var Qi = 0, Ot = 1, Et = 2, Ac = typeof Symbol == "function" && Symbol.iterator, k1 = "@@iterator", ku = Ac || k1, j = function(t) {
  this.next = t;
};
j.prototype.toString = function() {
  return "[Iterator]";
};
j.KEYS = Qi;
j.VALUES = Ot;
j.ENTRIES = Et;
j.prototype.inspect = j.prototype.toSource = function() {
  return this.toString();
};
j.prototype[ku] = function() {
  return this;
};
function te(e, t, n, r) {
  var i = e === Qi ? t : e === Ot ? n : [t, n];
  return r ? r.value = i : r = {
    value: i,
    done: !1
  }, r;
}
function De() {
  return { value: void 0, done: !0 };
}
function lh(e) {
  return Array.isArray(e) ? !0 : !!Wu(e);
}
function zd(e) {
  return e && typeof e.next == "function";
}
function Oc(e) {
  var t = Wu(e);
  return t && t.call(e);
}
function Wu(e) {
  var t = e && (Ac && e[Ac] || e[k1]);
  if (typeof t == "function")
    return t;
}
function mC(e) {
  var t = Wu(e);
  return t && t === e.entries;
}
function wC(e) {
  var t = Wu(e);
  return t && t === e.keys;
}
var es = Object.prototype.hasOwnProperty;
function hh(e) {
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
var Ce = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? dh() : kt(n) ? n.toSeq() : OC(n);
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
      return new j(function() {
        if (a === o)
          return De();
        var u = s[i ? o - ++a : a++];
        return te(r, u[0], u[1]);
      });
    }
    return this.__iteratorUncached(r, i);
  }, t;
}(Oe), yr = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? dh().toKeyedSeq() : it(n) ? J(n) ? n.toSeq() : n.fromEntrySeq() : gr(n) ? n.toSeq() : _h(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toKeyedSeq = function() {
    return this;
  }, t;
}(Ce), Wt = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? dh() : it(n) ? J(n) ? n.entrySeq() : n.toIndexedSeq() : gr(n) ? n.toSeq().entrySeq() : W1(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return t(arguments);
  }, t.prototype.toIndexedSeq = function() {
    return this;
  }, t.prototype.toString = function() {
    return this.__toString("Seq [", "]");
  }, t;
}(Ce), ts = /* @__PURE__ */ function(e) {
  function t(n) {
    return (it(n) && !Uu(n) ? n : Wt(n)).toSetSeq();
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return t(arguments);
  }, t.prototype.toSetSeq = function() {
    return this;
  }, t;
}(Ce);
Ce.isSeq = Vu;
Ce.Keyed = yr;
Ce.Set = ts;
Ce.Indexed = Wt;
Ce.prototype[U1] = !0;
var Ri = /* @__PURE__ */ function(e) {
  function t(n) {
    this._array = n, this.size = n.length;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(r, i) {
    return this.has(r) ? this._array[ar(this, r)] : i;
  }, t.prototype.__iterate = function(r, i) {
    for (var s = this._array, o = s.length, a = 0; a !== o; ) {
      var u = i ? o - ++a : a++;
      if (r(s[u], u, this) === !1)
        break;
    }
    return a;
  }, t.prototype.__iterator = function(r, i) {
    var s = this._array, o = s.length, a = 0;
    return new j(function() {
      if (a === o)
        return De();
      var u = i ? o - ++a : a++;
      return te(r, u, s[u]);
    });
  }, t;
}(Wt), ph = /* @__PURE__ */ function(e) {
  function t(n) {
    var r = Object.keys(n).concat(
      Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(n) : []
    );
    this._object = n, this._keys = r, this.size = r.length;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(r, i) {
    return i !== void 0 && !this.has(r) ? i : this._object[r];
  }, t.prototype.has = function(r) {
    return es.call(this._object, r);
  }, t.prototype.__iterate = function(r, i) {
    for (var s = this._object, o = this._keys, a = o.length, u = 0; u !== a; ) {
      var f = o[i ? a - ++u : u++];
      if (r(s[f], f, this) === !1)
        break;
    }
    return u;
  }, t.prototype.__iterator = function(r, i) {
    var s = this._object, o = this._keys, a = o.length, u = 0;
    return new j(function() {
      if (u === a)
        return De();
      var f = o[i ? a - ++u : u++];
      return te(r, f, s[f]);
    });
  }, t;
}(yr);
ph.prototype[ur] = !0;
var AC = /* @__PURE__ */ function(e) {
  function t(n) {
    this._collection = n, this.size = n.length || n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.__iterateUncached = function(r, i) {
    if (i)
      return this.cacheResult().__iterate(r, i);
    var s = this._collection, o = Oc(s), a = 0;
    if (zd(o))
      for (var u; !(u = o.next()).done && r(u.value, a++, this) !== !1; )
        ;
    return a;
  }, t.prototype.__iteratorUncached = function(r, i) {
    if (i)
      return this.cacheResult().__iterator(r, i);
    var s = this._collection, o = Oc(s);
    if (!zd(o))
      return new j(De);
    var a = 0;
    return new j(function() {
      var u = o.next();
      return u.done ? u : te(r, a++, u.value);
    });
  }, t;
}(Wt), Ud;
function dh() {
  return Ud || (Ud = new Ri([]));
}
function _h(e) {
  var t = vh(e);
  if (t)
    return t.fromEntrySeq();
  if (typeof e == "object")
    return new ph(e);
  throw new TypeError(
    "Expected Array or collection object of [k, v] entries, or keyed object: " + e
  );
}
function W1(e) {
  var t = vh(e);
  if (t)
    return t;
  throw new TypeError(
    "Expected Array or collection object of values: " + e
  );
}
function OC(e) {
  var t = vh(e);
  if (t)
    return mC(e) ? t.fromEntrySeq() : wC(e) ? t.toSetSeq() : t;
  if (typeof e == "object")
    return new ph(e);
  throw new TypeError(
    "Expected Array or collection object of values, or keyed object: " + e
  );
}
function vh(e) {
  return hh(e) ? new Ri(e) : lh(e) ? new AC(e) : void 0;
}
var q1 = "@@__IMMUTABLE_MAP__@@";
function qu(e) {
  return !!(e && // @ts-expect-error: maybeMap is typed as `{}`, need to change in 6.0 to `maybeMap && typeof maybeMap === 'object' && IS_MAP_SYMBOL in maybeMap`
  e[q1]);
}
function gh(e) {
  return qu(e) && Yt(e);
}
function Ec(e) {
  return !!(e && // @ts-expect-error: maybeValue is typed as `{}`
  typeof e.equals == "function" && // @ts-expect-error: maybeValue is typed as `{}`
  typeof e.hashCode == "function");
}
function we(e, t) {
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
  return !!(Ec(e) && Ec(t) && e.equals(t));
}
var hs = typeof Math.imul == "function" && Math.imul(4294967295, 2) === -2 ? Math.imul : function(t, n) {
  t |= 0, n |= 0;
  var r = t & 65535, i = n & 65535;
  return r * i + ((t >>> 16) * i + r * (n >>> 16) << 16 >>> 0) | 0;
};
function Gu(e) {
  return e >>> 1 & 1073741824 | e & 3221225471;
}
var EC = Object.prototype.valueOf;
function Je(e) {
  if (e == null)
    return Vd(e);
  if (typeof e.hashCode == "function")
    return Gu(e.hashCode(e));
  var t = NC(e);
  if (t == null)
    return Vd(t);
  switch (typeof t) {
    case "boolean":
      return t ? 1108378657 : 1108378656;
    case "number":
      return SC(t);
    case "string":
      return t.length > $C ? xC(t) : Sc(t);
    case "object":
    case "function":
      return TC(t);
    case "symbol":
      return RC(t);
    default:
      if (typeof t.toString == "function")
        return Sc(t.toString());
      throw new Error("Value type " + typeof t + " cannot be hashed.");
  }
}
function Vd(e) {
  return e === null ? 1108378658 : (
    /* undefined */
    1108378659
  );
}
function SC(e) {
  if (e !== e || e === 1 / 0)
    return 0;
  var t = e | 0;
  for (t !== e && (t ^= e * 4294967295); e > 4294967295; )
    e /= 4294967295, t ^= e;
  return Gu(t);
}
function xC(e) {
  var t = Mf[e];
  return t === void 0 && (t = Sc(e), $f === MC && ($f = 0, Mf = {}), $f++, Mf[e] = t), t;
}
function Sc(e) {
  for (var t = 0, n = 0; n < e.length; n++)
    t = 31 * t + e.charCodeAt(n) | 0;
  return Gu(t);
}
function RC(e) {
  var t = qd[e];
  return t !== void 0 || (t = G1(), qd[e] = t), t;
}
function TC(e) {
  var t;
  if (xc && (t = Rc.get(e), t !== void 0) || (t = e[Rr], t !== void 0) || !Wd && (t = e.propertyIsEnumerable && e.propertyIsEnumerable[Rr], t !== void 0 || (t = PC(e), t !== void 0)))
    return t;
  if (t = G1(), xc)
    Rc.set(e, t);
  else {
    if (kd !== void 0 && kd(e) === !1)
      throw new Error("Non-extensible objects are not allowed as keys.");
    if (Wd)
      Object.defineProperty(e, Rr, {
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
      }, e.propertyIsEnumerable[Rr] = t;
    else if (e.nodeType !== void 0)
      e[Rr] = t;
    else
      throw new Error("Unable to set a non-enumerable property on object.");
  }
  return t;
}
var kd = Object.isExtensible, Wd = function() {
  try {
    return Object.defineProperty({}, "@", {}), !0;
  } catch {
    return !1;
  }
}();
function PC(e) {
  if (e && e.nodeType > 0)
    switch (e.nodeType) {
      case 1:
        return e.uniqueID;
      case 9:
        return e.documentElement && e.documentElement.uniqueID;
    }
}
function NC(e) {
  return e.valueOf !== EC && typeof e.valueOf == "function" ? e.valueOf(e) : e;
}
function G1() {
  var e = ++Nf;
  return Nf & 1073741824 && (Nf = 0), e;
}
var xc = typeof WeakMap == "function", Rc;
xc && (Rc = /* @__PURE__ */ new WeakMap());
var qd = /* @__PURE__ */ Object.create(null), Nf = 0, Rr = "__immutablehash__";
typeof Symbol == "function" && (Rr = Symbol(Rr));
var $C = 16, MC = 255, $f = 0, Mf = {}, Hu = /* @__PURE__ */ function(e) {
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
    var r = this, i = yh(this, !0);
    return this._useKeys || (i.valueSeq = function() {
      return r._iter.toSeq().reverse();
    }), i;
  }, t.prototype.map = function(r, i) {
    var s = this, o = J1(this, r, i);
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
}(yr);
Hu.prototype[ur] = !0;
var H1 = /* @__PURE__ */ function(e) {
  function t(n) {
    this._iter = n, this.size = n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.includes = function(r) {
    return this._iter.includes(r);
  }, t.prototype.__iterate = function(r, i) {
    var s = this, o = 0;
    return i && xi(this), this._iter.__iterate(
      function(a) {
        return r(a, i ? s.size - ++o : o++, s);
      },
      i
    );
  }, t.prototype.__iterator = function(r, i) {
    var s = this, o = this._iter.__iterator(Ot, i), a = 0;
    return i && xi(this), new j(function() {
      var u = o.next();
      return u.done ? u : te(
        r,
        i ? s.size - ++a : a++,
        u.value,
        u
      );
    });
  }, t;
}(Wt), K1 = /* @__PURE__ */ function(e) {
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
    var s = this._iter.__iterator(Ot, i);
    return new j(function() {
      var o = s.next();
      return o.done ? o : te(r, o.value, o.value, o);
    });
  }, t;
}(ts), Y1 = /* @__PURE__ */ function(e) {
  function t(n) {
    this._iter = n, this.size = n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.entrySeq = function() {
    return this._iter.toSeq();
  }, t.prototype.__iterate = function(r, i) {
    var s = this;
    return this._iter.__iterate(function(o) {
      if (o) {
        Hd(o);
        var a = it(o);
        return r(
          a ? o.get(1) : o[1],
          a ? o.get(0) : o[0],
          s
        );
      }
    }, i);
  }, t.prototype.__iterator = function(r, i) {
    var s = this._iter.__iterator(Ot, i);
    return new j(function() {
      for (; ; ) {
        var o = s.next();
        if (o.done)
          return o;
        var a = o.value;
        if (a) {
          Hd(a);
          var u = it(a);
          return te(
            r,
            u ? a.get(0) : a[0],
            u ? a.get(1) : a[1],
            o
          );
        }
      }
    });
  }, t;
}(yr);
H1.prototype.cacheResult = Hu.prototype.cacheResult = K1.prototype.cacheResult = Y1.prototype.cacheResult = wh;
function X1(e) {
  var t = Sn(e);
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
  }, t.cacheResult = wh, t.__iterateUncached = function(n, r) {
    var i = this;
    return e.__iterate(function(s, o) {
      return n(o, s, i) !== !1;
    }, r);
  }, t.__iteratorUncached = function(n, r) {
    if (n === Et) {
      var i = e.__iterator(n, r);
      return new j(function() {
        var s = i.next();
        if (!s.done) {
          var o = s.value[0];
          s.value[0] = s.value[1], s.value[1] = o;
        }
        return s;
      });
    }
    return e.__iterator(
      n === Ot ? Qi : Ot,
      r
    );
  }, t;
}
function J1(e, t, n) {
  var r = Sn(e);
  return r.size = e.size, r.has = function(i) {
    return e.has(i);
  }, r.get = function(i, s) {
    var o = e.get(i, L);
    return o === L ? s : t.call(n, o, i, e);
  }, r.__iterateUncached = function(i, s) {
    var o = this;
    return e.__iterate(
      function(a, u, f) {
        return i(t.call(n, a, u, f), u, o) !== !1;
      },
      s
    );
  }, r.__iteratorUncached = function(i, s) {
    var o = e.__iterator(Et, s);
    return new j(function() {
      var a = o.next();
      if (a.done)
        return a;
      var u = a.value, f = u[0];
      return te(
        i,
        f,
        t.call(n, u[1], f, e),
        a
      );
    });
  }, r;
}
function yh(e, t) {
  var n = this, r = Sn(e);
  return r._iter = e, r.size = e.size, r.reverse = function() {
    return e;
  }, e.flip && (r.flip = function() {
    var i = X1(e);
    return i.reverse = function() {
      return e.flip();
    }, i;
  }), r.get = function(i, s) {
    return e.get(t ? i : -1 - i, s);
  }, r.has = function(i) {
    return e.has(t ? i : -1 - i);
  }, r.includes = function(i) {
    return e.includes(i);
  }, r.cacheResult = wh, r.__iterate = function(i, s) {
    var o = this, a = 0;
    return s && xi(e), e.__iterate(
      function(u, f) {
        return i(u, t ? f : s ? o.size - ++a : a++, o);
      },
      !s
    );
  }, r.__iterator = function(i, s) {
    var o = 0;
    s && xi(e);
    var a = e.__iterator(Et, !s);
    return new j(function() {
      var u = a.next();
      if (u.done)
        return u;
      var f = u.value;
      return te(
        i,
        t ? f[0] : s ? n.size - ++o : o++,
        f[1],
        u
      );
    });
  }, r;
}
function Z1(e, t, n, r) {
  var i = Sn(e);
  return r && (i.has = function(s) {
    var o = e.get(s, L);
    return o !== L && !!t.call(n, o, s, e);
  }, i.get = function(s, o) {
    var a = e.get(s, L);
    return a !== L && t.call(n, a, s, e) ? a : o;
  }), i.__iterateUncached = function(s, o) {
    var a = this, u = 0;
    return e.__iterate(function(f, c, l) {
      if (t.call(n, f, c, l))
        return u++, s(f, r ? c : u - 1, a);
    }, o), u;
  }, i.__iteratorUncached = function(s, o) {
    var a = e.__iterator(Et, o), u = 0;
    return new j(function() {
      for (; ; ) {
        var f = a.next();
        if (f.done)
          return f;
        var c = f.value, l = c[0], h = c[1];
        if (t.call(n, h, l, e))
          return te(s, r ? l : u++, h, f);
      }
    });
  }, i;
}
function IC(e, t, n) {
  var r = Zr().asMutable();
  return e.__iterate(function(i, s) {
    r.update(t.call(n, i, s, e), 0, function(o) {
      return o + 1;
    });
  }), r.asImmutable();
}
function DC(e, t, n) {
  var r = J(e), i = (Yt(e) ? dn() : Zr()).asMutable();
  e.__iterate(function(o, a) {
    i.update(
      t.call(n, o, a, e),
      function(u) {
        return u = u || [], u.push(r ? [a, o] : o), u;
      }
    );
  });
  var s = mh(e);
  return i.map(function(o) {
    return K(e, s(o));
  }).asImmutable();
}
function CC(e, t, n) {
  var r = J(e), i = [[], []];
  e.__iterate(function(o, a) {
    i[t.call(n, o, a, e) ? 1 : 0].push(
      r ? [a, o] : o
    );
  });
  var s = mh(e);
  return i.map(function(o) {
    return K(e, s(o));
  });
}
function bh(e, t, n, r) {
  var i = e.size;
  if (xo(t, n, i))
    return e;
  if (typeof i > "u" && (t < 0 || n < 0))
    return bh(e.toSeq().cacheResult(), t, n, r);
  var s = Ji(t, i), o = Ro(n, i), a = o - s, u;
  a === a && (u = a < 0 ? 0 : a);
  var f = Sn(e);
  return f.size = u === 0 ? u : e.size && u || void 0, !r && Vu(e) && u >= 0 && (f.get = function(c, l) {
    return c = ar(this, c), c >= 0 && c < u ? e.get(c + s, l) : l;
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
      return new j(De);
    var h = e.__iterator(c, l), d = 0, _ = 0;
    return new j(function() {
      for (; d++ < s; )
        h.next();
      if (++_ > u)
        return De();
      var v = h.next();
      return r || c === Ot || v.done ? v : c === Qi ? te(c, _ - 1, void 0, v) : te(c, _ - 1, v.value[1], v);
    });
  }, f;
}
function LC(e, t, n) {
  var r = Sn(e);
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
    var a = e.__iterator(Et, s), u = !0;
    return new j(function() {
      if (!u)
        return De();
      var f = a.next();
      if (f.done)
        return f;
      var c = f.value, l = c[0], h = c[1];
      return t.call(n, h, l, o) ? i === Et ? f : te(i, l, h, f) : (u = !1, De());
    });
  }, r;
}
function Q1(e, t, n, r) {
  var i = Sn(e);
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
    var u = e.__iterator(Et, o), f = !0, c = 0;
    return new j(function() {
      var l, h, d;
      do {
        if (l = u.next(), l.done)
          return r || s === Ot ? l : s === Qi ? te(s, c++, void 0, l) : te(s, c++, l.value[1], l);
        var _ = l.value;
        h = _[0], d = _[1], f && (f = t.call(n, d, h, a));
      } while (f);
      return s === Et ? l : te(s, h, d, l);
    });
  }, i;
}
var jC = /* @__PURE__ */ function(e) {
  function t(n) {
    this._wrappedIterables = n.flatMap(function(r) {
      return r._wrappedIterables ? r._wrappedIterables : [r];
    }), this.size = this._wrappedIterables.reduce(function(r, i) {
      if (r !== void 0) {
        var s = i.size;
        if (s !== void 0)
          return r + s;
      }
    }, 0), this[Ma] = this._wrappedIterables[0][Ma], this[Ia] = this._wrappedIterables[0][Ia], this[ur] = this._wrappedIterables[0][ur];
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.__iterateUncached = function(r, i) {
    if (this._wrappedIterables.length !== 0) {
      if (i)
        return this.cacheResult().__iterate(r, i);
      for (var s = 0, o = J(this), a = o ? Et : Ot, u = this._wrappedIterables[s].__iterator(
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
      return new j(De);
    if (i)
      return this.cacheResult().__iterator(r, i);
    var o = 0, a = this._wrappedIterables[o].__iterator(
      r,
      i
    );
    return new j(function() {
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
}(Ce);
function FC(e, t) {
  var n = J(e), r = [e].concat(t).map(function(s) {
    return it(s) ? n && (s = Vt(s)) : s = n ? _h(s) : W1(Array.isArray(s) ? s : [s]), s;
  }).filter(function(s) {
    return s.size !== 0;
  });
  if (r.length === 0)
    return e;
  if (r.length === 1) {
    var i = r[0];
    if (i === e || n && J(i) || st(e) && st(i))
      return i;
  }
  return new jC(r);
}
function ew(e, t, n) {
  var r = Sn(e);
  return r.__iterateUncached = function(i, s) {
    if (s)
      return this.cacheResult().__iterate(i, s);
    var o = 0, a = !1;
    function u(f, c) {
      f.__iterate(function(l, h) {
        return (!t || c < t) && it(l) ? u(l, c + 1) : (o++, i(l, n ? h : o - 1, r) === !1 && (a = !0)), !a;
      }, s);
    }
    return u(e, 0), o;
  }, r.__iteratorUncached = function(i, s) {
    if (s)
      return this.cacheResult().__iterator(i, s);
    var o = e.__iterator(i, s), a = [], u = 0;
    return new j(function() {
      for (; o; ) {
        var f = o.next();
        if (f.done !== !1) {
          o = a.pop();
          continue;
        }
        var c = f.value;
        if (i === Et && (c = c[1]), (!t || a.length < t) && it(c))
          a.push(o), o = c.__iterator(i, s);
        else
          return n ? f : te(i, u++, c, f);
      }
      return De();
    });
  }, r;
}
function BC(e, t, n) {
  var r = mh(e);
  return e.toSeq().map(function(i, s) {
    return r(t.call(n, i, s, e));
  }).flatten(!0);
}
function zC(e, t) {
  var n = Sn(e);
  return n.size = e.size && e.size * 2 - 1, n.__iterateUncached = function(r, i) {
    var s = this, o = 0;
    return e.__iterate(
      function(a) {
        return (!o || r(t, o++, s) !== !1) && r(a, o++, s) !== !1;
      },
      i
    ), o;
  }, n.__iteratorUncached = function(r, i) {
    var s = e.__iterator(Ot, i), o = 0, a;
    return new j(function() {
      return (!a || o % 2) && (a = s.next(), a.done) ? a : o % 2 ? te(r, o++, t) : te(r, o++, a.value, a);
    });
  }, n;
}
function Ti(e, t, n) {
  t || (t = tw);
  var r = J(e), i = 0, s = e.toSeq().map(function(o, a) {
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
  ), r ? yr(s) : st(e) ? Wt(s) : ts(s);
}
function ea(e, t, n) {
  if (t || (t = tw), n) {
    var r = e.toSeq().map(function(i, s) {
      return [i, n(i, s, e)];
    }).reduce(function(i, s) {
      return Gd(t, i[1], s[1]) ? s : i;
    });
    return r && r[0];
  }
  return e.reduce(function(i, s) {
    return Gd(t, i, s) ? s : i;
  });
}
function Gd(e, t, n) {
  var r = e(n, t);
  return r === 0 && n !== t && (n == null || n !== n) || r > 0;
}
function ta(e, t, n, r) {
  var i = Sn(e), s = new Ri(n).map(function(o) {
    return o.size;
  });
  return i.size = r ? s.max() : s.min(), i.__iterate = function(o, a) {
    for (var u = this.__iterator(Ot, a), f, c = 0; !(f = u.next()).done && o(f.value, c++, this) !== !1; )
      ;
    return c;
  }, i.__iteratorUncached = function(o, a) {
    var u = n.map(
      function(l) {
        return l = Oe(l), Oc(a ? l.reverse() : l);
      }
    ), f = 0, c = !1;
    return new j(function() {
      var l;
      return c || (l = u.map(function(h) {
        return h.next();
      }), c = r ? l.every(function(h) {
        return h.done;
      }) : l.some(function(h) {
        return h.done;
      })), c ? De() : te(
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
function K(e, t) {
  return e === t ? e : Vu(e) ? t : e.constructor(t);
}
function Hd(e) {
  if (e !== Object(e))
    throw new TypeError("Expected [K, V] tuple: " + e);
}
function mh(e) {
  return J(e) ? Vt : st(e) ? Xr : Zi;
}
function Sn(e) {
  return Object.create(
    (J(e) ? yr : st(e) ? Wt : ts).prototype
  );
}
function wh() {
  return this._iter.cacheResult ? (this._iter.cacheResult(), this.size = this._iter.size, this) : Ce.prototype.cacheResult.call(this);
}
function tw(e, t) {
  return e === void 0 && t === void 0 ? 0 : e === void 0 ? 1 : t === void 0 ? -1 : e > t ? 1 : e < t ? -1 : 0;
}
function on(e, t) {
  t = t || 0;
  for (var n = Math.max(0, e.length - t), r = new Array(n), i = 0; i < n; i++)
    r[i] = e[i + t];
  return r;
}
function Os(e, t) {
  if (!e)
    throw new Error(t);
}
function ut(e) {
  Os(e !== 1 / 0, "Cannot perform this action with an infinite size.");
}
function nw(e) {
  if (hh(e) && typeof e != "string")
    return e;
  if (Yt(e))
    return e.toArray();
  throw new TypeError("Invalid keyPath: expected Ordered Collection or Array: " + e);
}
var UC = Object.prototype.toString;
function Ah(e) {
  if (!e || typeof e != "object" || UC.call(e) !== "[object Object]")
    return !1;
  var t = Object.getPrototypeOf(e);
  if (t === null)
    return !0;
  for (var n = t, r = Object.getPrototypeOf(t); r !== null; )
    n = r, r = Object.getPrototypeOf(n);
  return n === t;
}
function fr(e) {
  return typeof e == "object" && (kt(e) || Array.isArray(e) || Ah(e));
}
function Ws(e) {
  try {
    return typeof e == "string" ? JSON.stringify(e) : String(e);
  } catch {
    return JSON.stringify(e);
  }
}
function rw(e, t) {
  return kt(e) ? (
    // @ts-expect-error key might be a number or symbol, which is not handled be Record key type
    e.has(t)
  ) : (
    // @ts-expect-error key might be anything else than PropertyKey, and will return false in that case but runtime is OK
    fr(e) && es.call(e, t)
  );
}
function Oh(e, t, n) {
  return kt(e) ? e.get(t, n) : rw(e, t) ? (
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
function Da(e) {
  if (Array.isArray(e))
    return on(e);
  var t = {};
  for (var n in e)
    es.call(e, n) && (t[n] = e[n]);
  return t;
}
function iw(e, t) {
  if (!fr(e))
    throw new TypeError("Cannot update non-data-structure value: " + e);
  if (kt(e)) {
    if (!e.remove)
      throw new TypeError("Cannot update immutable value without .remove() method: " + e);
    return e.remove(t);
  }
  if (!es.call(e, t))
    return e;
  var n = Da(e);
  return Array.isArray(n) ? n.splice(t, 1) : delete n[t], n;
}
function sw(e, t, n) {
  if (!fr(e))
    throw new TypeError("Cannot update non-data-structure value: " + e);
  if (kt(e)) {
    if (!e.set)
      throw new TypeError("Cannot update immutable value without .set() method: " + e);
    return e.set(t, n);
  }
  if (es.call(e, t) && n === e[t])
    return e;
  var r = Da(e);
  return r[t] = n, r;
}
function Jr(e, t, n, r) {
  r || (r = n, n = void 0);
  var i = ow(
    kt(e),
    // @ts-expect-error type issues with Record and mixed types
    e,
    nw(t),
    0,
    n,
    r
  );
  return i === L ? n : i;
}
function ow(e, t, n, r, i, s) {
  var o = t === L;
  if (r === n.length) {
    var a = o ? i : t, u = s(a);
    return u === a ? t : u;
  }
  if (!o && !fr(t))
    throw new TypeError("Cannot update within non-data-structure value in path [" + Array.from(n).slice(0, r).map(Ws) + "]: " + t);
  var f = n[r], c = o ? L : Oh(t, f, L), l = ow(
    c === L ? e : kt(c),
    // @ts-expect-error mixed type
    c,
    n,
    r + 1,
    i,
    s
  );
  return l === c ? t : l === L ? iw(t, f) : sw(o ? e ? un() : {} : t, f, l);
}
function aw(e, t, n) {
  return Jr(e, t, L, function() {
    return n;
  });
}
function Eh(e, t) {
  return aw(this, e, t);
}
function uw(e, t) {
  return Jr(e, t, function() {
    return L;
  });
}
function Sh(e) {
  return uw(this, e);
}
function xh(e, t, n, r) {
  return Jr(
    // @ts-expect-error Index signature for type string is missing in type V[]
    e,
    [t],
    n,
    r
  );
}
function Rh(e, t, n) {
  return arguments.length === 1 ? e(this) : xh(this, e, t, n);
}
function Th(e, t, n) {
  return Jr(this, e, t, n);
}
function fw() {
  for (var e = [], t = arguments.length; t--; ) e[t] = arguments[t];
  return lw(this, e);
}
function cw(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  if (typeof e != "function")
    throw new TypeError("Invalid merger function: " + e);
  return lw(this, t, e);
}
function lw(e, t, n) {
  for (var r = [], i = 0; i < t.length; i++) {
    var s = Vt(t[i]);
    s.size !== 0 && r.push(s);
  }
  return r.length === 0 ? e : e.toSeq().size === 0 && !e.__ownerID && r.length === 1 ? gr(e) ? e : e.constructor(r[0]) : e.withMutations(function(o) {
    for (var a = n ? function(f, c) {
      xh(
        o,
        c,
        L,
        function(l) {
          return l === L ? f : n(l, f, c);
        }
      );
    } : function(f, c) {
      o.set(c, f);
    }, u = 0; u < r.length; u++)
      r[u].forEach(a);
  });
}
function VC(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return Po(e, t);
}
function kC(e, t) {
  for (var n = [], r = arguments.length - 2; r-- > 0; ) n[r] = arguments[r + 2];
  return Po(t, n, e);
}
function WC(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return To(e, t);
}
function qC(e, t) {
  for (var n = [], r = arguments.length - 2; r-- > 0; ) n[r] = arguments[r + 2];
  return To(t, n, e);
}
function To(e, t, n) {
  return Po(e, t, GC(n));
}
function Po(e, t, n) {
  if (!fr(e))
    throw new TypeError(
      "Cannot merge into non-data-structure value: " + e
    );
  if (kt(e))
    return typeof n == "function" && e.mergeWith ? e.mergeWith.apply(e, [n].concat(t)) : e.merge ? e.merge.apply(e, t) : e.concat.apply(e, t);
  for (var r = Array.isArray(e), i = e, s = r ? Xr : Vt, o = r ? function(u) {
    i === e && (i = Da(i)), i.push(u);
  } : function(u, f) {
    var c = es.call(i, f), l = c && n ? n(i[f], u, f) : u;
    (!c || l !== i[f]) && (i === e && (i = Da(i)), i[f] = l);
  }, a = 0; a < t.length; a++)
    s(t[a]).forEach(o);
  return i;
}
function GC(e) {
  function t(n, r, i) {
    return fr(n) && fr(r) && HC(n, r) ? Po(n, [r], t) : e ? e(n, r, i) : r;
  }
  return t;
}
function HC(e, t) {
  var n = Ce(e), r = Ce(t);
  return st(n) === st(r) && J(n) === J(r);
}
function hw() {
  for (var e = [], t = arguments.length; t--; ) e[t] = arguments[t];
  return To(this, e);
}
function pw(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return To(this, t, e);
}
function Ph(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return Jr(this, e, un(), function(r) {
    return Po(r, t);
  });
}
function Nh(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return Jr(
    this,
    e,
    un(),
    function(r) {
      return To(r, t);
    }
  );
}
function No(e) {
  var t = this.asMutable();
  return e(t), t.wasAltered() ? t.__ensureOwner(this.__ownerID) : this;
}
function $o() {
  return this.__ownerID ? this : this.__ensureOwner(new ch());
}
function Mo() {
  return this.__ensureOwner();
}
function $h() {
  return this.__altered;
}
var Zr = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? un() : qu(n) && !Yt(n) ? n : un().withMutations(function(r) {
      var i = e(n);
      ut(i.size), i.forEach(function(s, o) {
        return r.set(o, s);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.__toString("Map {", "}");
  }, t.prototype.get = function(r, i) {
    return this._root ? this._root.get(0, void 0, r, i) : i;
  }, t.prototype.set = function(r, i) {
    return Xd(this, r, i);
  }, t.prototype.remove = function(r) {
    return Xd(this, r, L);
  }, t.prototype.deleteAll = function(r) {
    var i = Oe(r);
    return i.size === 0 ? this : this.withMutations(function(s) {
      i.forEach(function(o) {
        return s.remove(o);
      });
    });
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._root = null, this.__hash = void 0, this.__altered = !0, this) : un();
  }, t.prototype.sort = function(r) {
    return dn(Ti(this, r));
  }, t.prototype.sortBy = function(r, i) {
    return dn(Ti(this, i, r));
  }, t.prototype.map = function(r, i) {
    var s = this;
    return this.withMutations(function(o) {
      o.forEach(function(a, u) {
        o.set(u, r.call(i, a, u, s));
      });
    });
  }, t.prototype.__iterator = function(r, i) {
    return new KC(this, r, i);
  }, t.prototype.__iterate = function(r, i) {
    var s = this, o = 0;
    return this._root && this._root.iterate(function(a) {
      return o++, r(a[1], a[0], s);
    }, i), o;
  }, t.prototype.__ensureOwner = function(r) {
    return r === this.__ownerID ? this : r ? Mh(this.size, this._root, r, this.__hash) : this.size === 0 ? un() : (this.__ownerID = r, this.__altered = !1, this);
  }, t;
}(Vt);
Zr.isMap = qu;
var ne = Zr.prototype;
ne[q1] = !0;
ne[So] = ne.remove;
ne.removeAll = ne.deleteAll;
ne.setIn = Eh;
ne.removeIn = ne.deleteIn = Sh;
ne.update = Rh;
ne.updateIn = Th;
ne.merge = ne.concat = fw;
ne.mergeWith = cw;
ne.mergeDeep = hw;
ne.mergeDeepWith = pw;
ne.mergeIn = Ph;
ne.mergeDeepIn = Nh;
ne.withMutations = No;
ne.wasAltered = $h;
ne.asImmutable = Mo;
ne["@@transducer/init"] = ne.asMutable = $o;
ne["@@transducer/step"] = function(e, t) {
  return e.set(t[0], t[1]);
};
ne["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
var qs = function(t, n) {
  this.ownerID = t, this.entries = n;
};
qs.prototype.get = function(t, n, r, i) {
  for (var s = this.entries, o = 0, a = s.length; o < a; o++)
    if (we(r, s[o][0]))
      return s[o][1];
  return i;
};
qs.prototype.update = function(t, n, r, i, s, o, a) {
  for (var u = s === L, f = this.entries, c = 0, l = f.length; c < l && !we(i, f[c][0]); c++)
    ;
  var h = c < l;
  if (h ? f[c][1] === s : u)
    return this;
  if ($t(a), (u || !h) && $t(o), !(u && f.length === 1)) {
    if (!h && !u && f.length >= eL)
      return YC(t, f, i, s);
    var d = t && t === this.ownerID, _ = d ? f : on(f);
    return h ? u ? c === l - 1 ? _.pop() : _[c] = _.pop() : _[c] = [i, s] : _.push([i, s]), d ? (this.entries = _, this) : new qs(t, _);
  }
};
var Pi = function(t, n, r) {
  this.ownerID = t, this.bitmap = n, this.nodes = r;
};
Pi.prototype.get = function(t, n, r, i) {
  n === void 0 && (n = Je(r));
  var s = 1 << ((t === 0 ? n : n >>> t) & Be), o = this.bitmap;
  return (o & s) === 0 ? i : this.nodes[dw(o & s - 1)].get(
    t + Y,
    n,
    r,
    i
  );
};
Pi.prototype.update = function(t, n, r, i, s, o, a) {
  r === void 0 && (r = Je(i));
  var u = (n === 0 ? r : r >>> n) & Be, f = 1 << u, c = this.bitmap, l = (c & f) !== 0;
  if (!l && s === L)
    return this;
  var h = dw(c & f - 1), d = this.nodes, _ = l ? d[h] : void 0, v = Ih(
    _,
    t,
    n + Y,
    r,
    i,
    s,
    o,
    a
  );
  if (v === _)
    return this;
  if (!l && v && d.length >= tL)
    return JC(t, d, c, u, v);
  if (l && !v && d.length === 2 && Jd(d[h ^ 1]))
    return d[h ^ 1];
  if (l && v && d.length === 1 && Jd(v))
    return v;
  var g = t && t === this.ownerID, y = l ? v ? c : c ^ f : c | f, b = l ? v ? _w(d, h, v, g) : QC(d, h, g) : ZC(d, h, v, g);
  return g ? (this.bitmap = y, this.nodes = b, this) : new Pi(t, y, b);
};
var Gs = function(t, n, r) {
  this.ownerID = t, this.count = n, this.nodes = r;
};
Gs.prototype.get = function(t, n, r, i) {
  n === void 0 && (n = Je(r));
  var s = (t === 0 ? n : n >>> t) & Be, o = this.nodes[s];
  return o ? o.get(t + Y, n, r, i) : i;
};
Gs.prototype.update = function(t, n, r, i, s, o, a) {
  r === void 0 && (r = Je(i));
  var u = (n === 0 ? r : r >>> n) & Be, f = s === L, c = this.nodes, l = c[u];
  if (f && !l)
    return this;
  var h = Ih(
    l,
    t,
    n + Y,
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
  else if (!h && (d--, d < nL))
    return XC(t, c, d, u);
  var _ = t && t === this.ownerID, v = _w(c, u, h, _);
  return _ ? (this.count = d, this.nodes = v, this) : new Gs(t, d, v);
};
var Ni = function(t, n, r) {
  this.ownerID = t, this.keyHash = n, this.entries = r;
};
Ni.prototype.get = function(t, n, r, i) {
  for (var s = this.entries, o = 0, a = s.length; o < a; o++)
    if (we(r, s[o][0]))
      return s[o][1];
  return i;
};
Ni.prototype.update = function(t, n, r, i, s, o, a) {
  r === void 0 && (r = Je(i));
  var u = s === L;
  if (r !== this.keyHash)
    return u ? this : ($t(a), $t(o), Dh(this, t, n, r, [i, s]));
  for (var f = this.entries, c = 0, l = f.length; c < l && !we(i, f[c][0]); c++)
    ;
  var h = c < l;
  if (h ? f[c][1] === s : u)
    return this;
  if ($t(a), (u || !h) && $t(o), u && l === 2)
    return new Vn(t, this.keyHash, f[c ^ 1]);
  var d = t && t === this.ownerID, _ = d ? f : on(f);
  return h ? u ? c === l - 1 ? _.pop() : _[c] = _.pop() : _[c] = [i, s] : _.push([i, s]), d ? (this.entries = _, this) : new Ni(t, this.keyHash, _);
};
var Vn = function(t, n, r) {
  this.ownerID = t, this.keyHash = n, this.entry = r;
};
Vn.prototype.get = function(t, n, r, i) {
  return we(r, this.entry[0]) ? this.entry[1] : i;
};
Vn.prototype.update = function(t, n, r, i, s, o, a) {
  var u = s === L, f = we(i, this.entry[0]);
  if (f ? s === this.entry[1] : u)
    return this;
  if ($t(a), u) {
    $t(o);
    return;
  }
  return f ? t && t === this.ownerID ? (this.entry[1] = s, this) : new Vn(t, this.keyHash, [i, s]) : ($t(o), Dh(this, t, n, Je(i), [i, s]));
};
qs.prototype.iterate = Ni.prototype.iterate = function(e, t) {
  for (var n = this.entries, r = 0, i = n.length - 1; r <= i; r++)
    if (e(n[t ? i - r : r]) === !1)
      return !1;
};
Pi.prototype.iterate = Gs.prototype.iterate = function(e, t) {
  for (var n = this.nodes, r = 0, i = n.length - 1; r <= i; r++) {
    var s = n[t ? i - r : r];
    if (s && s.iterate(e, t) === !1)
      return !1;
  }
};
Vn.prototype.iterate = function(e, t) {
  return e(this.entry);
};
var KC = /* @__PURE__ */ function(e) {
  function t(n, r, i) {
    this._type = r, this._reverse = i, this._stack = n._root && Kd(n._root);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.next = function() {
    for (var r = this._type, i = this._stack; i; ) {
      var s = i.node, o = i.index++, a = void 0;
      if (s.entry) {
        if (o === 0)
          return If(r, s.entry);
      } else if (s.entries) {
        if (a = s.entries.length - 1, o <= a)
          return If(
            r,
            s.entries[this._reverse ? a - o : o]
          );
      } else if (a = s.nodes.length - 1, o <= a) {
        var u = s.nodes[this._reverse ? a - o : o];
        if (u) {
          if (u.entry)
            return If(r, u.entry);
          i = this._stack = Kd(u, i);
        }
        continue;
      }
      i = this._stack = this._stack.__prev;
    }
    return De();
  }, t;
}(j);
function If(e, t) {
  return te(e, t[0], t[1]);
}
function Kd(e, t) {
  return {
    node: e,
    index: 0,
    __prev: t
  };
}
function Mh(e, t, n, r) {
  var i = Object.create(ne);
  return i.size = e, i._root = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
var Yd;
function un() {
  return Yd || (Yd = Mh(0));
}
function Xd(e, t, n) {
  var r, i;
  if (e._root) {
    var s = wc(), o = wc();
    if (r = Ih(
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
    i = e.size + (s.value ? n === L ? -1 : 1 : 0);
  } else {
    if (n === L)
      return e;
    i = 1, r = new qs(e.__ownerID, [[t, n]]);
  }
  return e.__ownerID ? (e.size = i, e._root = r, e.__hash = void 0, e.__altered = !0, e) : r ? Mh(i, r) : un();
}
function Ih(e, t, n, r, i, s, o, a) {
  return e ? e.update(
    t,
    n,
    r,
    i,
    s,
    o,
    a
  ) : s === L ? e : ($t(a), $t(o), new Vn(t, r, [i, s]));
}
function Jd(e) {
  return e.constructor === Vn || e.constructor === Ni;
}
function Dh(e, t, n, r, i) {
  if (e.keyHash === r)
    return new Ni(t, r, [e.entry, i]);
  var s = (n === 0 ? e.keyHash : e.keyHash >>> n) & Be, o = (n === 0 ? r : r >>> n) & Be, a, u = s === o ? [Dh(e, t, n + Y, r, i)] : (a = new Vn(t, r, i), s < o ? [e, a] : [a, e]);
  return new Pi(t, 1 << s | 1 << o, u);
}
function YC(e, t, n, r) {
  e || (e = new ch());
  for (var i = new Vn(e, Je(n), [n, r]), s = 0; s < t.length; s++) {
    var o = t[s];
    i = i.update(e, 0, void 0, o[0], o[1]);
  }
  return i;
}
function XC(e, t, n, r) {
  for (var i = 0, s = 0, o = new Array(n), a = 0, u = 1, f = t.length; a < f; a++, u <<= 1) {
    var c = t[a];
    c !== void 0 && a !== r && (i |= u, o[s++] = c);
  }
  return new Pi(e, i, o);
}
function JC(e, t, n, r, i) {
  for (var s = 0, o = new Array(lt), a = 0; n !== 0; a++, n >>>= 1)
    o[a] = n & 1 ? t[s++] : void 0;
  return o[r] = i, new Gs(e, s + 1, o);
}
function dw(e) {
  return e -= e >> 1 & 1431655765, e = (e & 858993459) + (e >> 2 & 858993459), e = e + (e >> 4) & 252645135, e += e >> 8, e += e >> 16, e & 127;
}
function _w(e, t, n, r) {
  var i = r ? e : on(e);
  return i[t] = n, i;
}
function ZC(e, t, n, r) {
  var i = e.length + 1;
  if (r && t + 1 === i)
    return e[t] = n, e;
  for (var s = new Array(i), o = 0, a = 0; a < i; a++)
    a === t ? (s[a] = n, o = -1) : s[a] = e[a + o];
  return s;
}
function QC(e, t, n) {
  var r = e.length - 1;
  if (n && t === r)
    return e.pop(), e;
  for (var i = new Array(r), s = 0, o = 0; o < r; o++)
    o === t && (s = 1), i[o] = e[o + s];
  return i;
}
var eL = lt / 4, tL = lt / 2, nL = lt / 4, vw = "@@__IMMUTABLE_LIST__@@";
function Ch(e) {
  return !!(e && // @ts-expect-error: maybeList is typed as `{}`, need to change in 6.0 to `maybeList && typeof maybeList === 'object' && IS_LIST_SYMBOL in maybeList`
  e[vw]);
}
var Io = /* @__PURE__ */ function(e) {
  function t(n) {
    var r = ya();
    if (n == null)
      return r;
    if (Ch(n))
      return n;
    var i = e(n), s = i.size;
    return s === 0 ? r : (ut(s), s > 0 && s < lt ? Hs(0, s, Y, null, new Qn(i.toArray())) : r.withMutations(function(o) {
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
    if (r = ar(this, r), r >= 0 && r < this.size) {
      r += this._origin;
      var s = gw(this, r);
      return s && s.array[r & Be];
    }
    return i;
  }, t.prototype.set = function(r, i) {
    return rL(this, r, i);
  }, t.prototype.remove = function(r) {
    return this.has(r) ? r === 0 ? this.shift() : r === this.size - 1 ? this.pop() : this.splice(r, 1) : this;
  }, t.prototype.insert = function(r, i) {
    return this.splice(r, 0, i);
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = this._origin = this._capacity = 0, this._level = Y, this._root = this._tail = this.__hash = void 0, this.__altered = !0, this) : ya();
  }, t.prototype.push = function() {
    var r = arguments, i = this.size;
    return this.withMutations(function(s) {
      Yn(s, 0, i + r.length);
      for (var o = 0; o < r.length; o++)
        s.set(i + o, r[o]);
    });
  }, t.prototype.pop = function() {
    return Yn(this, 0, -1);
  }, t.prototype.unshift = function() {
    var r = arguments;
    return this.withMutations(function(i) {
      Yn(i, -r.length);
      for (var s = 0; s < r.length; s++)
        i.set(s, r[s]);
    });
  }, t.prototype.shift = function() {
    return Yn(this, 1);
  }, t.prototype.shuffle = function(r) {
    return r === void 0 && (r = Math.random), this.withMutations(function(i) {
      for (var s = i.size, o, a; s; )
        o = Math.floor(r() * s--), a = i.get(o), i.set(o, i.get(s)), i.set(s, a);
    });
  }, t.prototype.concat = function() {
    for (var r = arguments, i = [], s = 0; s < arguments.length; s++) {
      var o = r[s], a = e(
        typeof o != "string" && lh(o) ? o : [o]
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
    return Yn(this, 0, r);
  }, t.prototype.map = function(r, i) {
    var s = this;
    return this.withMutations(function(o) {
      for (var a = 0; a < s.size; a++)
        o.set(a, r.call(i, o.get(a), a, s));
    });
  }, t.prototype.slice = function(r, i) {
    var s = this.size;
    return xo(r, i, s) ? this : Yn(
      this,
      Ji(r, s),
      Ro(i, s)
    );
  }, t.prototype.__iterator = function(r, i) {
    var s = i ? this.size : 0, o = Zd(this, i);
    return new j(function() {
      var a = o();
      return a === Es ? De() : te(r, i ? --s : s++, a);
    });
  }, t.prototype.__iterate = function(r, i) {
    for (var s = i ? this.size : 0, o = Zd(this, i), a; (a = o()) !== Es && r(a, i ? --s : s++, this) !== !1; )
      ;
    return s;
  }, t.prototype.__ensureOwner = function(r) {
    return r === this.__ownerID ? this : r ? Hs(
      this._origin,
      this._capacity,
      this._level,
      this._root,
      this._tail,
      r,
      this.__hash
    ) : this.size === 0 ? ya() : (this.__ownerID = r, this.__altered = !1, this);
  }, t;
}(Xr);
Io.isList = Ch;
var le = Io.prototype;
le[vw] = !0;
le[So] = le.remove;
le.merge = le.concat;
le.setIn = Eh;
le.deleteIn = le.removeIn = Sh;
le.update = Rh;
le.updateIn = Th;
le.mergeIn = Ph;
le.mergeDeepIn = Nh;
le.withMutations = No;
le.wasAltered = $h;
le.asImmutable = Mo;
le["@@transducer/init"] = le.asMutable = $o;
le["@@transducer/step"] = function(e, t) {
  return e.push(t);
};
le["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
var Qn = function(t, n) {
  this.array = t, this.ownerID = n;
};
Qn.prototype.removeBefore = function(t, n, r) {
  if ((r & (1 << n + Y) - 1) === 0 || this.array.length === 0)
    return this;
  var i = r >>> n & Be;
  if (i >= this.array.length)
    return new Qn([], t);
  var s = i === 0, o;
  if (n > 0) {
    var a = this.array[i];
    if (o = a && a.removeBefore(t, n - Y, r), o === a && s)
      return this;
  }
  if (s && !o)
    return this;
  var u = $i(this, t);
  if (!s)
    for (var f = 0; f < i; f++)
      u.array[f] = void 0;
  return o && (u.array[i] = o), u;
};
Qn.prototype.removeAfter = function(t, n, r) {
  if (r === (n ? 1 << n + Y : lt) || this.array.length === 0)
    return this;
  var i = r - 1 >>> n & Be;
  if (i >= this.array.length)
    return this;
  var s;
  if (n > 0) {
    var o = this.array[i];
    if (s = o && o.removeAfter(t, n - Y, r), s === o && i === this.array.length - 1)
      return this;
  }
  var a = $i(this, t);
  return a.array.splice(i + 1), s && (a.array[i] = s), a;
};
var Es = {};
function Zd(e, t) {
  var n = e._origin, r = e._capacity, i = Ks(r), s = e._tail;
  return o(e._root, e._level, 0);
  function o(f, c, l) {
    return c === 0 ? a(f, l) : u(f, c, l);
  }
  function a(f, c) {
    var l = c === i ? s && s.array : f && f.array, h = c > n ? 0 : n - c, d = r - c;
    return d > lt && (d = lt), function() {
      if (h === d)
        return Es;
      var _ = t ? --d : h++;
      return l && l[_];
    };
  }
  function u(f, c, l) {
    var h, d = f && f.array, _ = l > n ? 0 : n - l >> c, v = (r - l >> c) + 1;
    return v > lt && (v = lt), function() {
      for (; ; ) {
        if (h) {
          var g = h();
          if (g !== Es)
            return g;
          h = null;
        }
        if (_ === v)
          return Es;
        var y = t ? --v : _++;
        h = o(
          d && d[y],
          c - Y,
          l + (y << c)
        );
      }
    };
  }
}
function Hs(e, t, n, r, i, s, o) {
  var a = Object.create(le);
  return a.size = t - e, a._origin = e, a._capacity = t, a._level = n, a._root = r, a._tail = i, a.__ownerID = s, a.__hash = o, a.__altered = !1, a;
}
function ya() {
  return Hs(0, 0, Y);
}
function rL(e, t, n) {
  if (t = ar(e, t), t !== t)
    return e;
  if (t >= e.size || t < 0)
    return e.withMutations(function(o) {
      t < 0 ? Yn(o, t).set(0, n) : Yn(o, 0, t + 1).set(t, n);
    });
  t += e._origin;
  var r = e._tail, i = e._root, s = wc();
  return t >= Ks(e._capacity) ? r = Tc(r, e.__ownerID, 0, t, n, s) : i = Tc(
    i,
    e.__ownerID,
    e._level,
    t,
    n,
    s
  ), s.value ? e.__ownerID ? (e._root = i, e._tail = r, e.__hash = void 0, e.__altered = !0, e) : Hs(e._origin, e._capacity, e._level, i, r) : e;
}
function Tc(e, t, n, r, i, s) {
  var o = r >>> n & Be, a = e && o < e.array.length;
  if (!a && i === void 0)
    return e;
  var u;
  if (n > 0) {
    var f = e && e.array[o], c = Tc(
      f,
      t,
      n - Y,
      r,
      i,
      s
    );
    return c === f ? e : (u = $i(e, t), u.array[o] = c, u);
  }
  return a && e.array[o] === i ? e : (s && $t(s), u = $i(e, t), i === void 0 && o === u.array.length - 1 ? u.array.pop() : u.array[o] = i, u);
}
function $i(e, t) {
  return t && e && t === e.ownerID ? e : new Qn(e ? e.array.slice() : [], t);
}
function gw(e, t) {
  if (t >= Ks(e._capacity))
    return e._tail;
  if (t < 1 << e._level + Y) {
    for (var n = e._root, r = e._level; n && r > 0; )
      n = n.array[t >>> r & Be], r -= Y;
    return n;
  }
}
function Yn(e, t, n) {
  t !== void 0 && (t |= 0), n !== void 0 && (n |= 0);
  var r = e.__ownerID || new ch(), i = e._origin, s = e._capacity, o = i + t, a = n === void 0 ? s : n < 0 ? s + n : i + n;
  if (o === i && a === s)
    return e;
  if (o >= a)
    return e.clear();
  for (var u = e._level, f = e._root, c = 0; o + c < 0; )
    f = new Qn(
      f && f.array.length ? [void 0, f] : [],
      r
    ), u += Y, c += 1 << u;
  c && (o += c, i += c, a += c, s += c);
  for (var l = Ks(s), h = Ks(a); h >= 1 << u + Y; )
    f = new Qn(
      f && f.array.length ? [f] : [],
      r
    ), u += Y;
  var d = e._tail, _ = h < l ? gw(e, a - 1) : h > l ? new Qn([], r) : d;
  if (d && h > l && o < s && d.array.length) {
    f = $i(f, r);
    for (var v = f, g = u; g > Y; g -= Y) {
      var y = l >>> g & Be;
      v = v.array[y] = $i(v.array[y], r);
    }
    v.array[l >>> Y & Be] = d;
  }
  if (a < s && (_ = _ && _.removeAfter(r, 0, a)), o >= h)
    o -= h, a -= h, u = Y, f = null, _ = _ && _.removeBefore(r, 0, o);
  else if (o > i || h < l) {
    for (c = 0; f; ) {
      var b = o >>> u & Be;
      if (b !== h >>> u & Be)
        break;
      b && (c += (1 << u) * b), u -= Y, f = f.array[b];
    }
    f && o > i && (f = f.removeBefore(r, u, o - c)), f && h < l && (f = f.removeAfter(
      r,
      u,
      h - c
    )), c && (o -= c, a -= c);
  }
  return e.__ownerID ? (e.size = a - o, e._origin = o, e._capacity = a, e._level = u, e._root = f, e._tail = _, e.__hash = void 0, e.__altered = !0, e) : Hs(o, a, u, f, _);
}
function Ks(e) {
  return e < lt ? 0 : e - 1 >>> Y << Y;
}
var dn = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? vs() : gh(n) ? n : vs().withMutations(function(r) {
      var i = Vt(n);
      ut(i.size), i.forEach(function(s, o) {
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
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._map.clear(), this._list.clear(), this.__altered = !0, this) : vs();
  }, t.prototype.set = function(r, i) {
    return e_(this, r, i);
  }, t.prototype.remove = function(r) {
    return e_(this, r, L);
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
    return r ? Lh(i, s, r, this.__hash) : this.size === 0 ? vs() : (this.__ownerID = r, this.__altered = !1, this._map = i, this._list = s, this);
  }, t;
}(Zr);
dn.isOrderedMap = gh;
dn.prototype[ur] = !0;
dn.prototype[So] = dn.prototype.remove;
function Lh(e, t, n, r) {
  var i = Object.create(dn.prototype);
  return i.size = e ? e.size : 0, i._map = e, i._list = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
var Qd;
function vs() {
  return Qd || (Qd = Lh(un(), ya()));
}
function e_(e, t, n) {
  var r = e._map, i = e._list, s = r.get(t), o = s !== void 0, a, u;
  if (n === L) {
    if (!o)
      return e;
    i.size >= lt && i.size >= r.size * 2 ? (u = i.filter(function(f, c) {
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
  return e.__ownerID ? (e.size = a.size, e._map = a, e._list = u, e.__hash = void 0, e.__altered = !0, e) : Lh(a, u);
}
var yw = "@@__IMMUTABLE_STACK__@@";
function Ca(e) {
  return !!(e && // @ts-expect-error: maybeStack is typed as `{}`, need to change in 6.0 to `maybeStack && typeof maybeStack === 'object' && MAYBE_STACK_SYMBOL in maybeStack`
  e[yw]);
}
var Ku = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? na() : Ca(n) ? n : na().pushAll(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.prototype.toString = function() {
    return this.__toString("Stack [", "]");
  }, t.prototype.get = function(r, i) {
    var s = this._head;
    for (r = ar(this, r); s && r--; )
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
    return this.__ownerID ? (this.size = i, this._head = s, this.__hash = void 0, this.__altered = !0, this) : gs(i, s);
  }, t.prototype.pushAll = function(r) {
    if (r = e(r), r.size === 0)
      return this;
    if (this.size === 0 && Ca(r))
      return r;
    ut(r.size);
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
    ), this.__ownerID ? (this.size = i, this._head = s, this.__hash = void 0, this.__altered = !0, this) : gs(i, s);
  }, t.prototype.pop = function() {
    return this.slice(1);
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._head = void 0, this.__hash = void 0, this.__altered = !0, this) : na();
  }, t.prototype.slice = function(r, i) {
    if (xo(r, i, this.size))
      return this;
    var s = Ji(r, this.size), o = Ro(i, this.size);
    if (o !== this.size)
      return e.prototype.slice.call(this, r, i);
    for (var a = this.size - s, u = this._head; s--; )
      u = u.next;
    return this.__ownerID ? (this.size = a, this._head = u, this.__hash = void 0, this.__altered = !0, this) : gs(a, u);
  }, t.prototype.__ensureOwner = function(r) {
    return r === this.__ownerID ? this : r ? gs(this.size, this._head, r, this.__hash) : this.size === 0 ? na() : (this.__ownerID = r, this.__altered = !1, this);
  }, t.prototype.__iterate = function(r, i) {
    var s = this;
    if (i)
      return new Ri(this.toArray()).__iterate(
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
      return new Ri(this.toArray()).__iterator(r, i);
    var s = 0, o = this._head;
    return new j(function() {
      if (o) {
        var a = o.value;
        return o = o.next, te(r, s++, a);
      }
      return De();
    });
  }, t;
}(Xr);
Ku.isStack = Ca;
var We = Ku.prototype;
We[yw] = !0;
We.shift = We.pop;
We.unshift = We.push;
We.unshiftAll = We.pushAll;
We.withMutations = No;
We.wasAltered = $h;
We.asImmutable = Mo;
We["@@transducer/init"] = We.asMutable = $o;
We["@@transducer/step"] = function(e, t) {
  return e.unshift(t);
};
We["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
function gs(e, t, n, r) {
  var i = Object.create(We);
  return i.size = e, i._head = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
var t_;
function na() {
  return t_ || (t_ = gs(0));
}
var bw = "@@__IMMUTABLE_SET__@@";
function Yu(e) {
  return !!(e && // @ts-expect-error: maybeSet is typed as `{}`,  need to change in 6.0 to `maybeSeq && typeof maybeSet === 'object' && MAYBE_SET_SYMBOL in maybeSet`
  e[bw]);
}
function jh(e) {
  return Yu(e) && Yt(e);
}
function Fh(e, t) {
  if (e === t)
    return !0;
  if (!it(t) || // @ts-expect-error size should exists on Collection
  e.size !== void 0 && t.size !== void 0 && e.size !== t.size || // @ts-expect-error __hash exists on Collection
  e.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  t.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  e.__hash !== t.__hash || J(e) !== J(t) || st(e) !== st(t) || // @ts-expect-error Range extends Collection, which implements [Symbol.iterator], so it is valid
  Yt(e) !== Yt(t))
    return !1;
  if (e.size === 0 && t.size === 0)
    return !0;
  var n = !Uu(e);
  if (Yt(e)) {
    var r = e.entries();
    return t.every(function(u, f) {
      var c = r.next().value;
      return c && we(c[1], u) && (n || we(c[0], f));
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
        !we(u, e.get(f, L))
      ) : (
        // @ts-expect-error type of `get` does not "catch" the version with `notSetValue`
        !we(e.get(f, L), u)
      ))
        return o = !1, !1;
    })
  );
  return o && // @ts-expect-error size should exists on Collection
  e.size === a;
}
function Qr(e, t) {
  var n = function(r) {
    e.prototype[r] = t[r];
  };
  return Object.keys(t).forEach(n), Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(t).forEach(n), e;
}
function La(e) {
  if (!e || typeof e != "object")
    return e;
  if (!it(e)) {
    if (!fr(e))
      return e;
    e = Ce(e);
  }
  if (J(e)) {
    var t = {};
    return e.__iterate(function(r, i) {
      t[i] = La(r);
    }), t;
  }
  var n = [];
  return e.__iterate(function(r) {
    n.push(La(r));
  }), n;
}
var Do = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? ys() : Yu(n) && !Yt(n) ? n : ys().withMutations(function(r) {
      var i = e(n);
      ut(i.size), i.forEach(function(s) {
        return r.add(s);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.fromKeys = function(r) {
    return this(Vt(r).keySeq());
  }, t.intersect = function(r) {
    return r = Oe(r).toArray(), r.length ? xe.intersect.apply(t(r.pop()), r) : ys();
  }, t.union = function(r) {
    return r = Oe(r).toArray(), r.length ? xe.union.apply(t(r.pop()), r) : ys();
  }, t.prototype.toString = function() {
    return this.__toString("Set {", "}");
  }, t.prototype.has = function(r) {
    return this._map.has(r);
  }, t.prototype.add = function(r) {
    return ra(this, this._map.set(r, r));
  }, t.prototype.remove = function(r) {
    return ra(this, this._map.remove(r));
  }, t.prototype.clear = function() {
    return ra(this, this._map.clear());
  }, t.prototype.map = function(r, i) {
    var s = this, o = !1, a = ra(
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
    return Ii(Ti(this, r));
  }, t.prototype.sortBy = function(r, i) {
    return Ii(Ti(this, i, r));
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
}(Zi);
Do.isSet = Yu;
var xe = Do.prototype;
xe[bw] = !0;
xe[So] = xe.remove;
xe.merge = xe.concat = xe.union;
xe.withMutations = No;
xe.asImmutable = Mo;
xe["@@transducer/init"] = xe.asMutable = $o;
xe["@@transducer/step"] = function(e, t) {
  return e.add(t);
};
xe["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
xe.__empty = ys;
xe.__make = mw;
function ra(e, t) {
  return e.__ownerID ? (e.size = t.size, e._map = t, e) : t === e._map ? e : t.size === 0 ? e.__empty() : e.__make(t);
}
function mw(e, t) {
  var n = Object.create(xe);
  return n.size = e ? e.size : 0, n._map = e, n.__ownerID = t, n;
}
var n_;
function ys() {
  return n_ || (n_ = mw(un()));
}
var ww = /* @__PURE__ */ function(e) {
  function t(n, r, i) {
    if (i === void 0 && (i = 1), !(this instanceof t))
      return new t(n, r, i);
    if (Os(i !== 0, "Cannot step a Range by 0"), Os(
      n !== void 0,
      "You must define a start value when using Range"
    ), Os(
      r !== void 0,
      "You must define an end value when using Range"
    ), i = Math.abs(i), r < n && (i = -i), this._start = n, this._end = r, this._step = i, this.size = Math.max(0, Math.ceil((r - n) / i - 1) + 1), this.size === 0) {
      if (Df)
        return Df;
      Df = this;
    }
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.size === 0 ? "Range []" : "Range [ " + this._start + "..." + this._end + (this._step !== 1 ? " by " + this._step : "") + " ]";
  }, t.prototype.get = function(r, i) {
    return this.has(r) ? this._start + ar(this, r) * this._step : i;
  }, t.prototype.includes = function(r) {
    var i = (r - this._start) / this._step;
    return i >= 0 && i < this.size && i === Math.floor(i);
  }, t.prototype.slice = function(r, i) {
    return xo(r, i, this.size) ? this : (r = Ji(r, this.size), i = Ro(i, this.size), i <= r ? new t(0, 0) : new t(
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
    return new j(function() {
      if (u === s)
        return De();
      var f = a;
      return a += i ? -o : o, te(r, i ? s - ++u : u++, f);
    });
  }, t.prototype.equals = function(r) {
    return r instanceof t ? this._start === r._start && this._end === r._end && this._step === r._step : Fh(this, r);
  }, t;
}(Wt), Df;
function Bh(e, t, n) {
  for (var r = nw(t), i = 0; i !== r.length; )
    if (e = Oh(e, r[i++], L), e === L)
      return n;
  return e;
}
function Aw(e, t) {
  return Bh(this, e, t);
}
function Ow(e, t) {
  return Bh(e, t, L) !== L;
}
function iL(e) {
  return Ow(this, e);
}
function Ew() {
  ut(this.size);
  var e = {};
  return this.__iterate(function(t, n) {
    e[n] = t;
  }), e;
}
Oe.Iterator = j;
Qr(Oe, {
  // ### Conversion to other types
  toArray: function() {
    ut(this.size);
    var t = new Array(this.size || 0), n = J(this), r = 0;
    return this.__iterate(function(i, s) {
      t[r++] = n ? [s, i] : i;
    }), t;
  },
  toIndexedSeq: function() {
    return new H1(this);
  },
  toJS: function() {
    return La(this);
  },
  toKeyedSeq: function() {
    return new Hu(this, !0);
  },
  toMap: function() {
    return Zr(this.toKeyedSeq());
  },
  toObject: Ew,
  toOrderedMap: function() {
    return dn(this.toKeyedSeq());
  },
  toOrderedSet: function() {
    return Ii(J(this) ? this.valueSeq() : this);
  },
  toSet: function() {
    return Do(J(this) ? this.valueSeq() : this);
  },
  toSetSeq: function() {
    return new K1(this);
  },
  toSeq: function() {
    return st(this) ? this.toIndexedSeq() : J(this) ? this.toKeyedSeq() : this.toSetSeq();
  },
  toStack: function() {
    return Ku(J(this) ? this.valueSeq() : this);
  },
  toList: function() {
    return Io(J(this) ? this.valueSeq() : this);
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
    return K(this, FC(this, t));
  },
  includes: function(t) {
    return this.some(function(n) {
      return we(n, t);
    });
  },
  entries: function() {
    return this.__iterator(Et);
  },
  every: function(t, n) {
    ut(this.size);
    var r = !0;
    return this.__iterate(function(i, s, o) {
      if (!t.call(n, i, s, o))
        return r = !1, !1;
    }), r;
  },
  filter: function(t, n) {
    return K(this, Z1(this, t, n, !0));
  },
  partition: function(t, n) {
    return CC(this, t, n);
  },
  find: function(t, n, r) {
    var i = this.findEntry(t, n);
    return i ? i[1] : r;
  },
  forEach: function(t, n) {
    return ut(this.size), this.__iterate(n ? t.bind(n) : t);
  },
  join: function(t) {
    ut(this.size), t = t !== void 0 ? "" + t : ",";
    var n = "", r = !0;
    return this.__iterate(function(i) {
      r ? r = !1 : n += t, n += i != null ? i.toString() : "";
    }), n;
  },
  keys: function() {
    return this.__iterator(Qi);
  },
  map: function(t, n) {
    return K(this, J1(this, t, n));
  },
  reduce: function(t, n, r) {
    return r_(
      this,
      t,
      n,
      r,
      arguments.length < 2,
      !1
    );
  },
  reduceRight: function(t, n, r) {
    return r_(
      this,
      t,
      n,
      r,
      arguments.length < 2,
      !0
    );
  },
  reverse: function() {
    return K(this, yh(this, !0));
  },
  slice: function(t, n) {
    return K(this, bh(this, t, n, !0));
  },
  some: function(t, n) {
    ut(this.size);
    var r = !1;
    return this.__iterate(function(i, s, o) {
      if (t.call(n, i, s, o))
        return r = !0, !1;
    }), r;
  },
  sort: function(t) {
    return K(this, Ti(this, t));
  },
  values: function() {
    return this.__iterator(Ot);
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
    return xi(
      t ? this.toSeq().filter(t, n) : this
    );
  },
  countBy: function(t, n) {
    return IC(this, t, n);
  },
  equals: function(t) {
    return Fh(this, t);
  },
  entrySeq: function() {
    var t = this;
    if (t._cache)
      return new Ri(t._cache);
    var n = t.toSeq().map(oL).toIndexedSeq();
    return n.fromEntrySeq = function() {
      return t.toSeq();
    }, n;
  },
  filterNot: function(t, n) {
    return this.filter(Cf(t), n);
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
    return this.find(j1, null, t);
  },
  flatMap: function(t, n) {
    return K(this, BC(this, t, n));
  },
  flatten: function(t) {
    return K(this, ew(this, t, !0));
  },
  fromEntrySeq: function() {
    return new Y1(this);
  },
  get: function(t, n) {
    return this.find(function(r, i) {
      return we(i, t);
    }, void 0, n);
  },
  getIn: Aw,
  groupBy: function(t, n) {
    return DC(this, t, n);
  },
  has: function(t) {
    return this.get(t, L) !== L;
  },
  hasIn: iL,
  isSubset: function(t) {
    return t = typeof t.includes == "function" ? t : Oe(t), this.every(function(n) {
      return t.includes(n);
    });
  },
  isSuperset: function(t) {
    return t = typeof t.isSubset == "function" ? t : Oe(t), t.isSubset(this);
  },
  keyOf: function(t) {
    return this.findKey(function(n) {
      return we(n, t);
    });
  },
  keySeq: function() {
    return this.toSeq().map(sL).toIndexedSeq();
  },
  last: function(t) {
    return this.toSeq().reverse().first(t);
  },
  lastKeyOf: function(t) {
    return this.toKeyedSeq().reverse().keyOf(t);
  },
  max: function(t) {
    return ea(this, t);
  },
  maxBy: function(t, n) {
    return ea(this, n, t);
  },
  min: function(t) {
    return ea(
      this,
      t ? i_(t) : o_
    );
  },
  minBy: function(t, n) {
    return ea(
      this,
      n ? i_(n) : o_,
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
    return K(this, Q1(this, t, n, !0));
  },
  skipUntil: function(t, n) {
    return this.skipWhile(Cf(t), n);
  },
  sortBy: function(t, n) {
    return K(this, Ti(this, n, t));
  },
  take: function(t) {
    return this.slice(0, Math.max(0, t));
  },
  takeLast: function(t) {
    return this.slice(-Math.max(0, t));
  },
  takeWhile: function(t, n) {
    return K(this, LC(this, t, n));
  },
  takeUntil: function(t, n) {
    return this.takeWhile(Cf(t), n);
  },
  update: function(t) {
    return t(this);
  },
  valueSeq: function() {
    return this.toIndexedSeq();
  },
  // ### Hashable Object
  hashCode: function() {
    return this.__hash || (this.__hash = aL(this));
  }
  // ### Internal
  // abstract __iterate(fn, reverse)
  // abstract __iterator(type, reverse)
});
var Le = Oe.prototype;
Le[z1] = !0;
Le[ku] = Le.values;
Le.toJSON = Le.toArray;
Le.__toStringMapper = Ws;
Le.inspect = Le.toSource = function() {
  return this.toString();
};
Le.chain = Le.flatMap;
Le.contains = Le.includes;
Qr(Vt, {
  // ### More sequential methods
  flip: function() {
    return K(this, X1(this));
  },
  mapEntries: function(t, n) {
    var r = this, i = 0;
    return K(
      this,
      this.toSeq().map(function(s, o) {
        return t.call(n, [o, s], i++, r);
      }).fromEntrySeq()
    );
  },
  mapKeys: function(t, n) {
    var r = this;
    return K(
      this,
      this.toSeq().flip().map(function(i, s) {
        return t.call(n, i, s, r);
      }).flip()
    );
  }
});
var Co = Vt.prototype;
Co[Ma] = !0;
Co[ku] = Le.entries;
Co.toJSON = Ew;
Co.__toStringMapper = function(e, t) {
  return Ws(t) + ": " + Ws(e);
};
Qr(Xr, {
  // ### Conversion to other types
  toKeyedSeq: function() {
    return new Hu(this, !1);
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  filter: function(t, n) {
    return K(this, Z1(this, t, n, !1));
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
    return K(this, yh(this, !1));
  },
  slice: function(t, n) {
    return K(this, bh(this, t, n, !1));
  },
  splice: function(t, n) {
    var r = arguments.length;
    if (n = Math.max(n || 0, 0), r === 0 || r === 2 && !n)
      return this;
    t = Ji(t, t < 0 ? this.count() : this.size);
    var i = this.slice(0, t);
    return K(
      this,
      r === 1 ? i : i.concat(on(arguments, 2), this.slice(t + n))
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
    return K(this, ew(this, t, !1));
  },
  get: function(t, n) {
    return t = ar(this, t), t < 0 || this.size === 1 / 0 || this.size !== void 0 && t > this.size ? n : this.find(function(r, i) {
      return i === t;
    }, void 0, n);
  },
  has: function(t) {
    return t = ar(this, t), t >= 0 && (this.size !== void 0 ? this.size === 1 / 0 || t < this.size : this.indexOf(t) !== -1);
  },
  interpose: function(t) {
    return K(this, zC(this, t));
  },
  interleave: function() {
    var t = [this].concat(on(arguments)), n = ta(this.toSeq(), Wt.of, t), r = n.flatten(!0);
    return n.size && (r.size = n.size * t.length), K(this, r);
  },
  keySeq: function() {
    return ww(0, this.size);
  },
  last: function(t) {
    return this.get(-1, t);
  },
  skipWhile: function(t, n) {
    return K(this, Q1(this, t, n, !1));
  },
  zip: function() {
    var t = [this].concat(on(arguments));
    return K(this, ta(this, s_, t));
  },
  zipAll: function() {
    var t = [this].concat(on(arguments));
    return K(this, ta(this, s_, t, !0));
  },
  zipWith: function(t) {
    var n = on(arguments);
    return n[0] = this, K(this, ta(this, t, n));
  }
});
var ns = Xr.prototype;
ns[Ia] = !0;
ns[ur] = !0;
Qr(Zi, {
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
var Mi = Zi.prototype;
Mi.has = Le.includes;
Mi.contains = Mi.includes;
Mi.keys = Mi.values;
Qr(yr, Co);
Qr(Wt, ns);
Qr(ts, Mi);
function r_(e, t, n, r, i, s) {
  return ut(e.size), e.__iterate(function(o, a, u) {
    i ? (i = !1, n = o) : n = t.call(r, n, o, a, u);
  }, s), n;
}
function sL(e, t) {
  return t;
}
function oL(e, t) {
  return [t, e];
}
function Cf(e) {
  return function() {
    return !e.apply(this, arguments);
  };
}
function i_(e) {
  return function() {
    return -e.apply(this, arguments);
  };
}
function s_() {
  return on(arguments);
}
function o_(e, t) {
  return e < t ? 1 : e > t ? -1 : 0;
}
function aL(e) {
  if (e.size === 1 / 0)
    return 0;
  var t = Yt(e), n = J(e), r = t ? 1 : 0;
  return e.__iterate(
    n ? t ? function(i, s) {
      r = 31 * r + a_(Je(i), Je(s)) | 0;
    } : function(i, s) {
      r = r + a_(Je(i), Je(s)) | 0;
    } : t ? function(i) {
      r = 31 * r + Je(i) | 0;
    } : function(i) {
      r = r + Je(i) | 0;
    }
  ), uL(e.size, r);
}
function uL(e, t) {
  return t = hs(t, 3432918353), t = hs(t << 15 | t >>> -15, 461845907), t = hs(t << 13 | t >>> -13, 5), t = (t + 3864292196 | 0) ^ e, t = hs(t ^ t >>> 16, 2246822507), t = hs(t ^ t >>> 13, 3266489909), t = Gu(t ^ t >>> 16), t;
}
function a_(e, t) {
  return e ^ t + 2654435769 + (e << 6) + (e >> 2) | 0;
}
var Ii = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? Pc() : jh(n) ? n : Pc().withMutations(function(r) {
      var i = Zi(n);
      ut(i.size), i.forEach(function(s) {
        return r.add(s);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.fromKeys = function(r) {
    return this(Vt(r).keySeq());
  }, t.prototype.toString = function() {
    return this.__toString("OrderedSet {", "}");
  }, t;
}(Do);
Ii.isOrderedSet = jh;
var ei = Ii.prototype;
ei[ur] = !0;
ei.zip = ns.zip;
ei.zipWith = ns.zipWith;
ei.zipAll = ns.zipAll;
ei.__empty = Pc;
ei.__make = Sw;
function Sw(e, t) {
  var n = Object.create(ei);
  return n.size = e ? e.size : 0, n._map = e, n.__ownerID = t, n;
}
var u_;
function Pc() {
  return u_ || (u_ = Sw(vs()));
}
var fL = {
  LeftThenRight: -1,
  RightThenLeft: 1
};
function cL(e) {
  if (gr(e))
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
var ve = function(t, n) {
  var r;
  cL(t);
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
          "Cannot define " + Uh(this) + ' with property "' + h + '" since that property name is part of the Record API.'
        ) : lL(s, h);
      }
    }
    return this.__ownerID = void 0, this._values = Io().withMutations(function(d) {
      d.setSize(u._keys.length), Vt(a).forEach(function(_, v) {
        d.set(u._indices[v], _ === u._defaultValues[v] ? void 0 : _);
      });
    }), this;
  }, s = i.prototype = Object.create(Z);
  return s.constructor = i, n && (i.displayName = n), i;
};
ve.prototype.toString = function() {
  for (var t = Uh(this) + " { ", n = this._keys, r, i = 0, s = n.length; i !== s; i++)
    r = n[i], t += (i ? ", " : "") + r + ": " + Ws(this.get(r));
  return t + " }";
};
ve.prototype.equals = function(t) {
  return this === t || gr(t) && Di(this).equals(Di(t));
};
ve.prototype.hashCode = function() {
  return Di(this).hashCode();
};
ve.prototype.has = function(t) {
  return this._indices.hasOwnProperty(t);
};
ve.prototype.get = function(t, n) {
  if (!this.has(t))
    return n;
  var r = this._indices[t], i = this._values.get(r);
  return i === void 0 ? this._defaultValues[t] : i;
};
ve.prototype.set = function(t, n) {
  if (this.has(t)) {
    var r = this._values.set(
      this._indices[t],
      n === this._defaultValues[t] ? void 0 : n
    );
    if (r !== this._values && !this.__ownerID)
      return zh(this, r);
  }
  return this;
};
ve.prototype.remove = function(t) {
  return this.set(t);
};
ve.prototype.clear = function() {
  var t = this._values.clear().setSize(this._keys.length);
  return this.__ownerID ? this : zh(this, t);
};
ve.prototype.wasAltered = function() {
  return this._values.wasAltered();
};
ve.prototype.toSeq = function() {
  return Di(this);
};
ve.prototype.toJS = function() {
  return La(this);
};
ve.prototype.entries = function() {
  return this.__iterator(Et);
};
ve.prototype.__iterator = function(t, n) {
  return Di(this).__iterator(t, n);
};
ve.prototype.__iterate = function(t, n) {
  return Di(this).__iterate(t, n);
};
ve.prototype.__ensureOwner = function(t) {
  if (t === this.__ownerID)
    return this;
  var n = this._values.__ensureOwner(t);
  return t ? zh(this, n, t) : (this.__ownerID = t, this._values = n, this);
};
ve.isRecord = gr;
ve.getDescriptiveName = Uh;
var Z = ve.prototype;
Z[V1] = !0;
Z[So] = Z.remove;
Z.deleteIn = Z.removeIn = Sh;
Z.getIn = Aw;
Z.hasIn = Le.hasIn;
Z.merge = fw;
Z.mergeWith = cw;
Z.mergeIn = Ph;
Z.mergeDeep = hw;
Z.mergeDeepWith = pw;
Z.mergeDeepIn = Nh;
Z.setIn = Eh;
Z.update = Rh;
Z.updateIn = Th;
Z.withMutations = No;
Z.asMutable = $o;
Z.asImmutable = Mo;
Z[ku] = Z.entries;
Z.toJSON = Z.toObject = Le.toObject;
Z.inspect = Z.toSource = function() {
  return this.toString();
};
function zh(e, t, n) {
  var r = Object.create(Object.getPrototypeOf(e));
  return r._values = t, r.__ownerID = n, r;
}
function Uh(e) {
  return e.constructor.displayName || e.constructor.name || "Record";
}
function Di(e) {
  return _h(e._keys.map(function(t) {
    return [t, e.get(t)];
  }));
}
function lL(e, t) {
  try {
    Object.defineProperty(e, t, {
      get: function() {
        return this.get(t);
      },
      set: function(n) {
        Os(this.__ownerID, "Cannot set on an immutable record."), this.set(t, n);
      }
    });
  } catch {
  }
}
var hL = /* @__PURE__ */ function(e) {
  function t(n, r) {
    if (!(this instanceof t))
      return new t(n, r);
    if (this._value = n, this.size = r === void 0 ? 1 / 0 : Math.max(0, r), this.size === 0) {
      if (Lf)
        return Lf;
      Lf = this;
    }
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.size === 0 ? "Repeat []" : "Repeat [ " + this._value + " " + this.size + " times ]";
  }, t.prototype.get = function(r, i) {
    return this.has(r) ? this._value : i;
  }, t.prototype.includes = function(r) {
    return we(this._value, r);
  }, t.prototype.slice = function(r, i) {
    var s = this.size;
    return xo(r, i, s) ? this : new t(
      this._value,
      Ro(i, s) - Ji(r, s)
    );
  }, t.prototype.reverse = function() {
    return this;
  }, t.prototype.indexOf = function(r) {
    return we(this._value, r) ? 0 : -1;
  }, t.prototype.lastIndexOf = function(r) {
    return we(this._value, r) ? this.size : -1;
  }, t.prototype.__iterate = function(r, i) {
    for (var s = this.size, o = 0; o !== s && r(this._value, i ? s - ++o : o++, this) !== !1; )
      ;
    return o;
  }, t.prototype.__iterator = function(r, i) {
    var s = this, o = this.size, a = 0;
    return new j(
      function() {
        return a === o ? De() : te(r, i ? o - ++a : a++, s._value);
      }
    );
  }, t.prototype.equals = function(r) {
    return r instanceof t ? we(this._value, r._value) : Fh(this, r);
  }, t;
}(Wt), Lf;
function pL(e, t) {
  return xw(
    [],
    t || dL,
    e,
    "",
    t && t.length > 2 ? [] : void 0,
    { "": e }
  );
}
function xw(e, t, n, r, i, s) {
  if (typeof n != "string" && !kt(n) && (hh(n) || lh(n) || Ah(n))) {
    if (~e.indexOf(n))
      throw new TypeError("Cannot convert circular structure to Immutable");
    e.push(n), i && r !== "" && i.push(r);
    var o = t.call(
      s,
      r,
      Ce(n).map(
        function(a, u) {
          return xw(e, t, a, u, i, n);
        }
      ),
      i && i.slice()
    );
    return e.pop(), i && i.pop(), o;
  }
  return n;
}
function dL(e, t) {
  return st(t) ? t.toList() : J(t) ? t.toMap() : t.toSet();
}
var _L = "5.1.3", vL = Oe;
const k5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Collection: Oe,
  Iterable: vL,
  List: Io,
  Map: Zr,
  OrderedMap: dn,
  OrderedSet: Ii,
  PairSorting: fL,
  Range: ww,
  Record: ve,
  Repeat: hL,
  Seq: Ce,
  Set: Do,
  Stack: Ku,
  fromJS: pL,
  get: Oh,
  getIn: Bh,
  has: rw,
  hasIn: Ow,
  hash: Je,
  is: we,
  isAssociative: Uu,
  isCollection: it,
  isImmutable: kt,
  isIndexed: st,
  isKeyed: J,
  isList: Ch,
  isMap: qu,
  isOrdered: Yt,
  isOrderedMap: gh,
  isOrderedSet: jh,
  isPlainObject: Ah,
  isRecord: gr,
  isSeq: Vu,
  isSet: Yu,
  isStack: Ca,
  isValueObject: Ec,
  merge: VC,
  mergeDeep: WC,
  mergeDeepWith: qC,
  mergeWith: kC,
  remove: iw,
  removeIn: uw,
  set: sw,
  setIn: aw,
  update: xh,
  updateIn: Jr,
  version: _L
}, Symbol.toStringTag, { value: "Module" }));
/**
* @vue/reactivity v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function gL(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const yL = Object.freeze({}), bL = () => {
}, ja = Object.assign, mL = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, wL = Object.prototype.hasOwnProperty, Fa = (e, t) => wL.call(e, t), jn = Array.isArray, bi = (e) => Xu(e) === "[object Map]", AL = (e) => Xu(e) === "[object Set]", Ys = (e) => typeof e == "function", OL = (e) => typeof e == "string", Lo = (e) => typeof e == "symbol", Cr = (e) => e !== null && typeof e == "object", EL = Object.prototype.toString, Xu = (e) => EL.call(e), Rw = (e) => Xu(e).slice(8, -1), SL = (e) => Xu(e) === "[object Object]", Vh = (e) => OL(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, xL = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, RL = xL((e) => e.charAt(0).toUpperCase() + e.slice(1)), er = (e, t) => !Object.is(e, t), TL = (e, t, n, r = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: r,
    value: n
  });
};
function ot(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let $e;
class Tw {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = $e, !t && $e && (this.index = ($e.scopes || ($e.scopes = [])).push(
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
      const n = $e;
      try {
        return $e = this, t();
      } finally {
        $e = n;
      }
    } else
      ot("cannot run an inactive effect scope.");
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = $e, $e = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && ($e = this.prevScope, this.prevScope = void 0);
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
function PL(e) {
  return new Tw(e);
}
function Pw() {
  return $e;
}
function NL(e, t = !1) {
  $e ? $e.cleanups.push(e) : t || ot(
    "onScopeDispose() is called when there is no active effect scope to be associated with."
  );
}
let B;
const $L = {
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
}, jf = /* @__PURE__ */ new WeakSet();
class Xs {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, $e && $e.active && $e.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, jf.has(this) && (jf.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || $w(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, f_(this), Mw(this);
    const t = B, n = dt;
    B = this, dt = !0;
    try {
      return this.fn();
    } finally {
      B !== this && ot(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Iw(this), B = t, dt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        qh(t);
      this.deps = this.depsTail = void 0, f_(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? jf.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Nc(this) && this.run();
  }
  get dirty() {
    return Nc(this);
  }
}
let Nw = 0, Ss, xs;
function $w(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = xs, xs = e;
    return;
  }
  e.next = Ss, Ss = e;
}
function kh() {
  Nw++;
}
function Wh() {
  if (--Nw > 0)
    return;
  if (xs) {
    let t = xs;
    for (xs = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Ss; ) {
    let t = Ss;
    for (Ss = void 0; t; ) {
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
function Mw(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Iw(e) {
  let t, n = e.depsTail, r = n;
  for (; r; ) {
    const i = r.prevDep;
    r.version === -1 ? (r === n && (n = i), qh(r), ML(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = i;
  }
  e.deps = t, e.depsTail = n;
}
function Nc(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Dw(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Dw(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Js) || (e.globalVersion = Js, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Nc(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = B, r = dt;
  B = e, dt = !0;
  try {
    Mw(e);
    const i = e.fn(e._value);
    (t.version === 0 || er(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    B = n, dt = r, Iw(e), e.flags &= -3;
  }
}
function qh(e, t = !1) {
  const { dep: n, prevSub: r, nextSub: i } = e;
  if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subsHead === e && (n.subsHead = i), n.subs === e && (n.subs = r, !r && n.computed)) {
    n.computed.flags &= -5;
    for (let s = n.computed.deps; s; s = s.nextDep)
      qh(s, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function ML(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function IL(e, t) {
  e.effect instanceof Xs && (e = e.effect.fn);
  const n = new Xs(e);
  t && ja(n, t);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const r = n.run.bind(n);
  return r.effect = n, r;
}
function DL(e) {
  e.effect.stop();
}
let dt = !0;
const Gh = [];
function Hh() {
  Gh.push(dt), dt = !1;
}
function CL() {
  Gh.push(dt), dt = !0;
}
function Kh() {
  const e = Gh.pop();
  dt = e === void 0 ? !0 : e;
}
function LL(e, t = !1) {
  B instanceof Xs ? B.cleanup = e : t || ot(
    "onEffectCleanup() was called when there was no active effect to associate with."
  );
}
function f_(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = B;
    B = void 0;
    try {
      t();
    } finally {
      B = n;
    }
  }
}
let Js = 0;
class jL {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Ju {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(t) {
    if (!B || !dt || B === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== B)
      n = this.activeLink = new jL(B, this), B.deps ? (n.prevDep = B.depsTail, B.depsTail.nextDep = n, B.depsTail = n) : B.deps = B.depsTail = n, Cw(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const r = n.nextDep;
      r.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = r), n.prevDep = B.depsTail, n.nextDep = void 0, B.depsTail.nextDep = n, B.depsTail = n, B.deps === n && (B.deps = r);
    }
    return B.onTrack && B.onTrack(
      ja(
        {
          effect: B
        },
        t
      )
    ), n;
  }
  trigger(t) {
    this.version++, Js++, this.notify(t);
  }
  notify(t) {
    kh();
    try {
      for (let n = this.subsHead; n; n = n.nextSub)
        n.sub.onTrigger && !(n.sub.flags & 8) && n.sub.onTrigger(
          ja(
            {
              effect: n.sub
            },
            t
          )
        );
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Wh();
    }
  }
}
function Cw(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let r = t.deps; r; r = r.nextDep)
        Cw(r);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const Ba = /* @__PURE__ */ new WeakMap(), tr = Symbol(
  "Object iterate"
), za = Symbol(
  "Map keys iterate"
), Ci = Symbol(
  "Array iterate"
);
function Fe(e, t, n) {
  if (dt && B) {
    let r = Ba.get(e);
    r || Ba.set(e, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || (r.set(n, i = new Ju()), i.map = r, i.key = n), i.track({
      target: e,
      type: t,
      key: n
    });
  }
}
function Dn(e, t, n, r, i, s) {
  const o = Ba.get(e);
  if (!o) {
    Js++;
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
  if (kh(), t === "clear")
    o.forEach(a);
  else {
    const u = jn(e), f = u && Vh(n);
    if (u && n === "length") {
      const c = Number(r);
      o.forEach((l, h) => {
        (h === "length" || h === Ci || !Lo(h) && h >= c) && a(l);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && a(o.get(n)), f && a(o.get(Ci)), t) {
        case "add":
          u ? f && a(o.get("length")) : (a(o.get(tr)), bi(e) && a(o.get(za)));
          break;
        case "delete":
          u || (a(o.get(tr)), bi(e) && a(o.get(za)));
          break;
        case "set":
          bi(e) && a(o.get(tr));
          break;
      }
  }
  Wh();
}
function FL(e, t) {
  const n = Ba.get(e);
  return n && n.get(t);
}
function Sr(e) {
  const t = V(e);
  return t === e ? t : (Fe(t, "iterate", Ci), Dt(e) ? t : t.map(Me));
}
function Zu(e) {
  return Fe(e = V(e), "iterate", Ci), e;
}
const BL = {
  __proto__: null,
  [Symbol.iterator]() {
    return Ff(this, Symbol.iterator, Me);
  },
  concat(...e) {
    return Sr(this).concat(
      ...e.map((t) => jn(t) ? Sr(t) : t)
    );
  },
  entries() {
    return Ff(this, "entries", (e) => (e[1] = Me(e[1]), e));
  },
  every(e, t) {
    return $n(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return $n(this, "filter", e, t, (n) => n.map(Me), arguments);
  },
  find(e, t) {
    return $n(this, "find", e, t, Me, arguments);
  },
  findIndex(e, t) {
    return $n(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return $n(this, "findLast", e, t, Me, arguments);
  },
  findLastIndex(e, t) {
    return $n(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return $n(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Bf(this, "includes", e);
  },
  indexOf(...e) {
    return Bf(this, "indexOf", e);
  },
  join(e) {
    return Sr(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Bf(this, "lastIndexOf", e);
  },
  map(e, t) {
    return $n(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return ps(this, "pop");
  },
  push(...e) {
    return ps(this, "push", e);
  },
  reduce(e, ...t) {
    return c_(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return c_(this, "reduceRight", e, t);
  },
  shift() {
    return ps(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return $n(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return ps(this, "splice", e);
  },
  toReversed() {
    return Sr(this).toReversed();
  },
  toSorted(e) {
    return Sr(this).toSorted(e);
  },
  toSpliced(...e) {
    return Sr(this).toSpliced(...e);
  },
  unshift(...e) {
    return ps(this, "unshift", e);
  },
  values() {
    return Ff(this, "values", Me);
  }
};
function Ff(e, t, n) {
  const r = Zu(e), i = r[t]();
  return r !== e && !Dt(e) && (i._next = i.next, i.next = () => {
    const s = i._next();
    return s.done || (s.value = n(s.value)), s;
  }), i;
}
const zL = Array.prototype;
function $n(e, t, n, r, i, s) {
  const o = Zu(e), a = o !== e && !Dt(e), u = o[t];
  if (u !== zL[t]) {
    const l = u.apply(e, s);
    return a ? Me(l) : l;
  }
  let f = n;
  o !== e && (a ? f = function(l, h) {
    return n.call(this, Me(l), h, e);
  } : n.length > 2 && (f = function(l, h) {
    return n.call(this, l, h, e);
  }));
  const c = u.call(o, f, r);
  return a && i ? i(c) : c;
}
function c_(e, t, n, r) {
  const i = Zu(e);
  let s = n;
  return i !== e && (Dt(e) ? n.length > 3 && (s = function(o, a, u) {
    return n.call(this, o, a, u, e);
  }) : s = function(o, a, u) {
    return n.call(this, o, Me(a), u, e);
  }), i[t](s, ...r);
}
function Bf(e, t, n) {
  const r = V(e);
  Fe(r, "iterate", Ci);
  const i = r[t](...n);
  return (i === -1 || i === !1) && Xh(n[0]) ? (n[0] = V(n[0]), r[t](...n)) : i;
}
function ps(e, t, n = []) {
  Hh(), kh();
  const r = V(e)[t].apply(e, n);
  return Wh(), Kh(), r;
}
const UL = /* @__PURE__ */ gL("__proto__,__v_isRef,__isVue"), Lw = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Lo)
);
function VL(e) {
  Lo(e) || (e = String(e));
  const t = V(this);
  return Fe(t, "has", e), t.hasOwnProperty(e);
}
class jw {
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
      return r === (i ? s ? kw : Vw : s ? Uw : zw).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(r) ? t : void 0;
    const o = jn(t);
    if (!i) {
      let u;
      if (o && (u = BL[n]))
        return u;
      if (n === "hasOwnProperty")
        return VL;
    }
    const a = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      Ue(t) ? t : r
    );
    if ((Lo(n) ? Lw.has(n) : UL(n)) || (i || Fe(t, "get", n), s))
      return a;
    if (Ue(a)) {
      const u = o && Vh(n) ? a : a.value;
      return i && Cr(u) ? Ua(u) : u;
    }
    return Cr(a) ? i ? Ua(a) : Yh(a) : a;
  }
}
class Fw extends jw {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, r, i) {
    let s = t[n];
    if (!this._isShallow) {
      const u = cr(s);
      if (!Dt(r) && !cr(r) && (s = V(s), r = V(r)), !jn(t) && Ue(s) && !Ue(r))
        return u ? (ot(
          `Set operation on key "${String(n)}" failed: target is readonly.`,
          t[n]
        ), !0) : (s.value = r, !0);
    }
    const o = jn(t) && Vh(n) ? Number(n) < t.length : Fa(t, n), a = Reflect.set(
      t,
      n,
      r,
      Ue(t) ? t : i
    );
    return t === V(i) && (o ? er(r, s) && Dn(t, "set", n, r, s) : Dn(t, "add", n, r)), a;
  }
  deleteProperty(t, n) {
    const r = Fa(t, n), i = t[n], s = Reflect.deleteProperty(t, n);
    return s && r && Dn(t, "delete", n, void 0, i), s;
  }
  has(t, n) {
    const r = Reflect.has(t, n);
    return (!Lo(n) || !Lw.has(n)) && Fe(t, "has", n), r;
  }
  ownKeys(t) {
    return Fe(
      t,
      "iterate",
      jn(t) ? "length" : tr
    ), Reflect.ownKeys(t);
  }
}
class Bw extends jw {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return ot(
      `Set operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, n) {
    return ot(
      `Delete operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
}
const kL = /* @__PURE__ */ new Fw(), WL = /* @__PURE__ */ new Bw(), qL = /* @__PURE__ */ new Fw(!0), GL = /* @__PURE__ */ new Bw(!0), $c = (e) => e, ia = (e) => Reflect.getPrototypeOf(e);
function HL(e, t, n) {
  return function(...r) {
    const i = this.__v_raw, s = V(i), o = bi(s), a = e === "entries" || e === Symbol.iterator && o, u = e === "keys" && o, f = i[e](...r), c = n ? $c : t ? Va : Me;
    return !t && Fe(
      s,
      "iterate",
      u ? za : tr
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
function sa(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      ot(
        `${RL(e)} operation ${n}failed: target is readonly.`,
        V(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function KL(e, t) {
  const n = {
    get(i) {
      const s = this.__v_raw, o = V(s), a = V(i);
      e || (er(i, a) && Fe(o, "get", i), Fe(o, "get", a));
      const { has: u } = ia(o), f = t ? $c : e ? Va : Me;
      if (u.call(o, i))
        return f(s.get(i));
      if (u.call(o, a))
        return f(s.get(a));
      s !== o && s.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && Fe(V(i), "iterate", tr), i.size;
    },
    has(i) {
      const s = this.__v_raw, o = V(s), a = V(i);
      return e || (er(i, a) && Fe(o, "has", i), Fe(o, "has", a)), i === a ? s.has(i) : s.has(i) || s.has(a);
    },
    forEach(i, s) {
      const o = this, a = o.__v_raw, u = V(a), f = t ? $c : e ? Va : Me;
      return !e && Fe(u, "iterate", tr), a.forEach((c, l) => i.call(s, f(c), f(l), o));
    }
  };
  return ja(
    n,
    e ? {
      add: sa("add"),
      set: sa("set"),
      delete: sa("delete"),
      clear: sa("clear")
    } : {
      add(i) {
        !t && !Dt(i) && !cr(i) && (i = V(i));
        const s = V(this);
        return ia(s).has.call(s, i) || (s.add(i), Dn(s, "add", i, i)), this;
      },
      set(i, s) {
        !t && !Dt(s) && !cr(s) && (s = V(s));
        const o = V(this), { has: a, get: u } = ia(o);
        let f = a.call(o, i);
        f ? l_(o, a, i) : (i = V(i), f = a.call(o, i));
        const c = u.call(o, i);
        return o.set(i, s), f ? er(s, c) && Dn(o, "set", i, s, c) : Dn(o, "add", i, s), this;
      },
      delete(i) {
        const s = V(this), { has: o, get: a } = ia(s);
        let u = o.call(s, i);
        u ? l_(s, o, i) : (i = V(i), u = o.call(s, i));
        const f = a ? a.call(s, i) : void 0, c = s.delete(i);
        return u && Dn(s, "delete", i, void 0, f), c;
      },
      clear() {
        const i = V(this), s = i.size !== 0, o = bi(i) ? new Map(i) : new Set(i), a = i.clear();
        return s && Dn(
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
    n[i] = HL(i, e, t);
  }), n;
}
function Qu(e, t) {
  const n = KL(e, t);
  return (r, i, s) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? r : Reflect.get(
    Fa(n, i) && i in r ? n : r,
    i,
    s
  );
}
const YL = {
  get: /* @__PURE__ */ Qu(!1, !1)
}, XL = {
  get: /* @__PURE__ */ Qu(!1, !0)
}, JL = {
  get: /* @__PURE__ */ Qu(!0, !1)
}, ZL = {
  get: /* @__PURE__ */ Qu(!0, !0)
};
function l_(e, t, n) {
  const r = V(n);
  if (r !== n && t.call(e, r)) {
    const i = Rw(e);
    ot(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const zw = /* @__PURE__ */ new WeakMap(), Uw = /* @__PURE__ */ new WeakMap(), Vw = /* @__PURE__ */ new WeakMap(), kw = /* @__PURE__ */ new WeakMap();
function QL(e) {
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
function e3(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : QL(Rw(e));
}
function Yh(e) {
  return cr(e) ? e : ef(
    e,
    !1,
    kL,
    YL,
    zw
  );
}
function t3(e) {
  return ef(
    e,
    !1,
    qL,
    XL,
    Uw
  );
}
function Ua(e) {
  return ef(
    e,
    !0,
    WL,
    JL,
    Vw
  );
}
function n3(e) {
  return ef(
    e,
    !0,
    GL,
    ZL,
    kw
  );
}
function ef(e, t, n, r, i) {
  if (!Cr(e))
    return ot(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = e3(e);
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
function mi(e) {
  return cr(e) ? mi(e.__v_raw) : !!(e && e.__v_isReactive);
}
function cr(e) {
  return !!(e && e.__v_isReadonly);
}
function Dt(e) {
  return !!(e && e.__v_isShallow);
}
function Xh(e) {
  return e ? !!e.__v_raw : !1;
}
function V(e) {
  const t = e && e.__v_raw;
  return t ? V(t) : e;
}
function r3(e) {
  return !Fa(e, "__v_skip") && Object.isExtensible(e) && TL(e, "__v_skip", !0), e;
}
const Me = (e) => Cr(e) ? Yh(e) : e, Va = (e) => Cr(e) ? Ua(e) : e;
function Ue(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function Ww(e) {
  return qw(e, !1);
}
function i3(e) {
  return qw(e, !0);
}
function qw(e, t) {
  return Ue(e) ? e : new s3(e, t);
}
class s3 {
  constructor(t, n) {
    this.dep = new Ju(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : V(t), this._value = n ? t : Me(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }), this._value;
  }
  set value(t) {
    const n = this._rawValue, r = this.__v_isShallow || Dt(t) || cr(t);
    t = r ? t : V(t), er(t, n) && (this._rawValue = t, this._value = r ? t : Me(t), this.dep.trigger({
      target: this,
      type: "set",
      key: "value",
      newValue: t,
      oldValue: n
    }));
  }
}
function o3(e) {
  e.dep && e.dep.trigger({
    target: e,
    type: "set",
    key: "value",
    newValue: e._value
  });
}
function Jh(e) {
  return Ue(e) ? e.value : e;
}
function a3(e) {
  return Ys(e) ? e() : Jh(e);
}
const u3 = {
  get: (e, t, n) => t === "__v_raw" ? e : Jh(Reflect.get(e, t, n)),
  set: (e, t, n, r) => {
    const i = e[t];
    return Ue(i) && !Ue(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
  }
};
function f3(e) {
  return mi(e) ? e : new Proxy(e, u3);
}
class c3 {
  constructor(t) {
    this.__v_isRef = !0, this._value = void 0;
    const n = this.dep = new Ju(), { get: r, set: i } = t(n.track.bind(n), n.trigger.bind(n));
    this._get = r, this._set = i;
  }
  get value() {
    return this._value = this._get();
  }
  set value(t) {
    this._set(t);
  }
}
function l3(e) {
  return new c3(e);
}
function h3(e) {
  Xh(e) || ot("toRefs() expects a reactive object but received a plain one.");
  const t = jn(e) ? new Array(e.length) : {};
  for (const n in e)
    t[n] = Gw(e, n);
  return t;
}
class p3 {
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
    return FL(V(this._object), this._key);
  }
}
class d3 {
  constructor(t) {
    this._getter = t, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
function _3(e, t, n) {
  return Ue(e) ? e : Ys(e) ? new d3(e) : Cr(e) && arguments.length > 1 ? Gw(e, t, n) : Ww(e);
}
function Gw(e, t, n) {
  const r = e[t];
  return Ue(r) ? r : new p3(e, t, n);
}
class v3 {
  constructor(t, n, r) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new Ju(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Js - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = r;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    B !== this)
      return $w(this, !0), !0;
  }
  get value() {
    const t = this.dep.track({
      target: this,
      type: "get",
      key: "value"
    });
    return Dw(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter ? this.setter(t) : ot("Write operation failed: computed value is readonly");
  }
}
function g3(e, t, n = !1) {
  let r, i;
  Ys(e) ? r = e : (r = e.get, i = e.set);
  const s = new v3(r, i, n);
  return t && !n && (s.onTrack = t.onTrack, s.onTrigger = t.onTrigger), s;
}
const y3 = {
  GET: "get",
  HAS: "has",
  ITERATE: "iterate"
}, b3 = {
  SET: "set",
  ADD: "add",
  DELETE: "delete",
  CLEAR: "clear"
}, m3 = {
  SKIP: "__v_skip",
  IS_REACTIVE: "__v_isReactive",
  IS_READONLY: "__v_isReadonly",
  IS_SHALLOW: "__v_isShallow",
  RAW: "__v_raw",
  IS_REF: "__v_isRef"
}, w3 = {
  WATCH_GETTER: 2,
  2: "WATCH_GETTER",
  WATCH_CALLBACK: 3,
  3: "WATCH_CALLBACK",
  WATCH_CLEANUP: 4,
  4: "WATCH_CLEANUP"
}, oa = {}, ka = /* @__PURE__ */ new WeakMap();
let Xn;
function A3() {
  return Xn;
}
function Hw(e, t = !1, n = Xn) {
  if (n) {
    let r = ka.get(n);
    r || ka.set(n, r = []), r.push(e);
  } else t || ot(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function O3(e, t, n = yL) {
  const { immediate: r, deep: i, once: s, scheduler: o, augmentJob: a, call: u } = n, f = (A) => {
    (n.onWarn || ot)(
      "Invalid watch source: ",
      A,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, c = (A) => i ? A : Dt(A) || i === !1 || i === 0 ? Cn(A, 1) : Cn(A);
  let l, h, d, _, v = !1, g = !1;
  if (Ue(e) ? (h = () => e.value, v = Dt(e)) : mi(e) ? (h = () => c(e), v = !0) : jn(e) ? (g = !0, v = e.some((A) => mi(A) || Dt(A)), h = () => e.map((A) => {
    if (Ue(A))
      return A.value;
    if (mi(A))
      return c(A);
    if (Ys(A))
      return u ? u(A, 2) : A();
    f(A);
  })) : Ys(e) ? t ? h = u ? () => u(e, 2) : e : h = () => {
    if (d) {
      Hh();
      try {
        d();
      } finally {
        Kh();
      }
    }
    const A = Xn;
    Xn = l;
    try {
      return u ? u(e, 3, [_]) : e(_);
    } finally {
      Xn = A;
    }
  } : (h = bL, f(e)), t && i) {
    const A = h, S = i === !0 ? 1 / 0 : i;
    h = () => Cn(A(), S);
  }
  const y = Pw(), b = () => {
    l.stop(), y && y.active && mL(y.effects, l);
  };
  if (s && t) {
    const A = t;
    t = (...S) => {
      A(...S), b();
    };
  }
  let w = g ? new Array(e.length).fill(oa) : oa;
  const m = (A) => {
    if (!(!(l.flags & 1) || !l.dirty && !A))
      if (t) {
        const S = l.run();
        if (i || v || (g ? S.some((T, F) => er(T, w[F])) : er(S, w))) {
          d && d();
          const T = Xn;
          Xn = l;
          try {
            const F = [
              S,
              // pass undefined as the old value when it's changed for the first time
              w === oa ? void 0 : g && w[0] === oa ? [] : w,
              _
            ];
            w = S, u ? u(t, 3, F) : (
              // @ts-expect-error
              t(...F)
            );
          } finally {
            Xn = T;
          }
        }
      } else
        l.run();
  };
  return a && a(m), l = new Xs(h), l.scheduler = o ? () => o(m, !1) : m, _ = (A) => Hw(A, !1, l), d = l.onStop = () => {
    const A = ka.get(l);
    if (A) {
      if (u)
        u(A, 4);
      else
        for (const S of A) S();
      ka.delete(l);
    }
  }, l.onTrack = n.onTrack, l.onTrigger = n.onTrigger, t ? r ? m(!0) : w = l.run() : o ? o(m.bind(null, !0), !0) : l.run(), b.pause = l.pause.bind(l), b.resume = l.resume.bind(l), b.stop = b, b;
}
function Cn(e, t = 1 / 0, n) {
  if (t <= 0 || !Cr(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, Ue(e))
    Cn(e.value, t, n);
  else if (jn(e))
    for (let r = 0; r < e.length; r++)
      Cn(e[r], t, n);
  else if (AL(e) || bi(e))
    e.forEach((r) => {
      Cn(r, t, n);
    });
  else if (SL(e)) {
    for (const r in e)
      Cn(e[r], t, n);
    for (const r of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, r) && Cn(e[r], t, n);
  }
  return e;
}
const W5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ARRAY_ITERATE_KEY: Ci,
  EffectFlags: $L,
  EffectScope: Tw,
  ITERATE_KEY: tr,
  MAP_KEY_ITERATE_KEY: za,
  ReactiveEffect: Xs,
  ReactiveFlags: m3,
  TrackOpTypes: y3,
  TriggerOpTypes: b3,
  WatchErrorCodes: w3,
  computed: g3,
  customRef: l3,
  effect: IL,
  effectScope: PL,
  enableTracking: CL,
  getCurrentScope: Pw,
  getCurrentWatcher: A3,
  isProxy: Xh,
  isReactive: mi,
  isReadonly: cr,
  isRef: Ue,
  isShallow: Dt,
  markRaw: r3,
  onEffectCleanup: LL,
  onScopeDispose: NL,
  onWatcherCleanup: Hw,
  pauseTracking: Hh,
  proxyRefs: f3,
  reactive: Yh,
  reactiveReadArray: Sr,
  readonly: Ua,
  ref: Ww,
  resetTracking: Kh,
  shallowReactive: t3,
  shallowReadArray: Zu,
  shallowReadonly: n3,
  shallowRef: i3,
  stop: DL,
  toRaw: V,
  toReactive: Me,
  toReadonly: Va,
  toRef: _3,
  toRefs: h3,
  toValue: a3,
  track: Fe,
  traverse: Cn,
  trigger: Dn,
  triggerRef: o3,
  unref: Jh,
  watch: O3
}, Symbol.toStringTag, { value: "Module" })), E3 = Symbol.for("preact-signals"), fn = 1, Li = 2, Zs = 4, rs = 8, ba = 16, ji = 32;
function tf() {
  Ts++;
}
function nf() {
  if (Ts > 1) {
    Ts--;
    return;
  }
  let e, t = !1;
  for (; Rs !== void 0; ) {
    let n = Rs;
    for (Rs = void 0, Mc++; n !== void 0; ) {
      const r = n._nextBatchedEffect;
      if (n._nextBatchedEffect = void 0, n._flags &= ~Li, !(n._flags & rs) && Yw(n))
        try {
          n._callback();
        } catch (i) {
          t || (e = i, t = !0);
        }
      n = r;
    }
  }
  if (Mc = 0, Ts--, t)
    throw e;
}
function S3(e) {
  if (Ts > 0)
    return e();
  tf();
  try {
    return e();
  } finally {
    nf();
  }
}
let q;
function x3(e) {
  const t = q;
  q = void 0;
  try {
    return e();
  } finally {
    q = t;
  }
}
let Rs, Ts = 0, Mc = 0, Wa = 0;
function Kw(e) {
  if (q === void 0)
    return;
  let t = e._node;
  if (t === void 0 || t._target !== q)
    return t = {
      _version: 0,
      _source: e,
      _prevSource: q._sources,
      _nextSource: void 0,
      _target: q,
      _prevTarget: void 0,
      _nextTarget: void 0,
      _rollbackNode: t
    }, q._sources !== void 0 && (q._sources._nextSource = t), q._sources = t, e._node = t, q._flags & ji && e._subscribe(t), t;
  if (t._version === -1)
    return t._version = 0, t._nextSource !== void 0 && (t._nextSource._prevSource = t._prevSource, t._prevSource !== void 0 && (t._prevSource._nextSource = t._nextSource), t._prevSource = q._sources, t._nextSource = void 0, q._sources._nextSource = t, q._sources = t), t;
}
function je(e) {
  this._value = e, this._version = 0, this._node = void 0, this._targets = void 0;
}
je.prototype.brand = E3;
je.prototype._refresh = function() {
  return !0;
};
je.prototype._subscribe = function(e) {
  this._targets !== e && e._prevTarget === void 0 && (e._nextTarget = this._targets, this._targets !== void 0 && (this._targets._prevTarget = e), this._targets = e);
};
je.prototype._unsubscribe = function(e) {
  if (this._targets !== void 0) {
    const t = e._prevTarget, n = e._nextTarget;
    t !== void 0 && (t._nextTarget = n, e._prevTarget = void 0), n !== void 0 && (n._prevTarget = t, e._nextTarget = void 0), e === this._targets && (this._targets = n);
  }
};
je.prototype.subscribe = function(e) {
  return Qw(() => {
    const t = this.value, n = q;
    q = void 0;
    try {
      e(t);
    } finally {
      q = n;
    }
  });
};
je.prototype.valueOf = function() {
  return this.value;
};
je.prototype.toString = function() {
  return this.value + "";
};
je.prototype.toJSON = function() {
  return this.value;
};
je.prototype.peek = function() {
  const e = q;
  q = void 0;
  try {
    return this.value;
  } finally {
    q = e;
  }
};
Object.defineProperty(je.prototype, "value", {
  get() {
    const e = Kw(this);
    return e !== void 0 && (e._version = this._version), this._value;
  },
  set(e) {
    if (e !== this._value) {
      if (Mc > 100)
        throw new Error("Cycle detected");
      this._value = e, this._version++, Wa++, tf();
      try {
        for (let t = this._targets; t !== void 0; t = t._nextTarget)
          t._target._notify();
      } finally {
        nf();
      }
    }
  }
});
function R3(e) {
  return new je(e);
}
function Yw(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource)
    if (t._source._version !== t._version || !t._source._refresh() || t._source._version !== t._version)
      return !0;
  return !1;
}
function Xw(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource) {
    const n = t._source._node;
    if (n !== void 0 && (t._rollbackNode = n), t._source._node = t, t._version = -1, t._nextSource === void 0) {
      e._sources = t;
      break;
    }
  }
}
function Jw(e) {
  let t = e._sources, n;
  for (; t !== void 0; ) {
    const r = t._prevSource;
    t._version === -1 ? (t._source._unsubscribe(t), r !== void 0 && (r._nextSource = t._nextSource), t._nextSource !== void 0 && (t._nextSource._prevSource = r)) : n = t, t._source._node = t._rollbackNode, t._rollbackNode !== void 0 && (t._rollbackNode = void 0), t = r;
  }
  e._sources = n;
}
function ti(e) {
  je.call(this, void 0), this._fn = e, this._sources = void 0, this._globalVersion = Wa - 1, this._flags = Zs;
}
ti.prototype = new je();
ti.prototype._refresh = function() {
  if (this._flags &= ~Li, this._flags & fn)
    return !1;
  if ((this._flags & (Zs | ji)) === ji || (this._flags &= ~Zs, this._globalVersion === Wa))
    return !0;
  if (this._globalVersion = Wa, this._flags |= fn, this._version > 0 && !Yw(this))
    return this._flags &= ~fn, !0;
  const e = q;
  try {
    Xw(this), q = this;
    const t = this._fn();
    (this._flags & ba || this._value !== t || this._version === 0) && (this._value = t, this._flags &= ~ba, this._version++);
  } catch (t) {
    this._value = t, this._flags |= ba, this._version++;
  }
  return q = e, Jw(this), this._flags &= ~fn, !0;
};
ti.prototype._subscribe = function(e) {
  if (this._targets === void 0) {
    this._flags |= Zs | ji;
    for (let t = this._sources; t !== void 0; t = t._nextSource)
      t._source._subscribe(t);
  }
  je.prototype._subscribe.call(this, e);
};
ti.prototype._unsubscribe = function(e) {
  if (this._targets !== void 0 && (je.prototype._unsubscribe.call(this, e), this._targets === void 0)) {
    this._flags &= ~ji;
    for (let t = this._sources; t !== void 0; t = t._nextSource)
      t._source._unsubscribe(t);
  }
};
ti.prototype._notify = function() {
  if (!(this._flags & Li)) {
    this._flags |= Zs | Li;
    for (let e = this._targets; e !== void 0; e = e._nextTarget)
      e._target._notify();
  }
};
Object.defineProperty(ti.prototype, "value", {
  get() {
    if (this._flags & fn)
      throw new Error("Cycle detected");
    const e = Kw(this);
    if (this._refresh(), e !== void 0 && (e._version = this._version), this._flags & ba)
      throw this._value;
    return this._value;
  }
});
function T3(e) {
  return new ti(e);
}
function Zw(e) {
  const t = e._cleanup;
  if (e._cleanup = void 0, typeof t == "function") {
    tf();
    const n = q;
    q = void 0;
    try {
      t();
    } catch (r) {
      throw e._flags &= ~fn, e._flags |= rs, Zh(e), r;
    } finally {
      q = n, nf();
    }
  }
}
function Zh(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource)
    t._source._unsubscribe(t);
  e._fn = void 0, e._sources = void 0, Zw(e);
}
function P3(e) {
  if (q !== this)
    throw new Error("Out-of-order effect");
  Jw(this), q = e, this._flags &= ~fn, this._flags & rs && Zh(this), nf();
}
function jo(e) {
  this._fn = e, this._cleanup = void 0, this._sources = void 0, this._nextBatchedEffect = void 0, this._flags = ji;
}
jo.prototype._callback = function() {
  const e = this._start();
  try {
    if (this._flags & rs || this._fn === void 0) return;
    const t = this._fn();
    typeof t == "function" && (this._cleanup = t);
  } finally {
    e();
  }
};
jo.prototype._start = function() {
  if (this._flags & fn)
    throw new Error("Cycle detected");
  this._flags |= fn, this._flags &= ~rs, Zw(this), Xw(this), tf();
  const e = q;
  return q = this, P3.bind(this, e);
};
jo.prototype._notify = function() {
  this._flags & Li || (this._flags |= Li, this._nextBatchedEffect = Rs, Rs = this);
};
jo.prototype._dispose = function() {
  this._flags |= rs, this._flags & fn || Zh(this);
};
function Qw(e) {
  const t = new jo(e);
  try {
    t._callback();
  } catch (n) {
    throw t._dispose(), n;
  }
  return t._dispose.bind(t);
}
const q5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Signal: je,
  batch: S3,
  computed: T3,
  effect: Qw,
  signal: R3,
  untracked: x3
}, Symbol.toStringTag, { value: "Module" })), h_ = typeof Symbol == "function" && Symbol.observable || "@@observable", zf = () => Math.random().toString(36).substring(7).split("").join("."), nr = {
  INIT: `@@redux/INIT${/* @__PURE__ */ zf()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ zf()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${zf()}`
};
function rf(e) {
  if (typeof e != "object" || e === null) return !1;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function N3(e) {
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
  if (I3(e)) return "date";
  if (M3(e)) return "error";
  const n = $3(e);
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
function $3(e) {
  return typeof e.constructor == "function" ? e.constructor.name : null;
}
function M3(e) {
  return e instanceof Error || typeof e.message == "string" && e.constructor && typeof e.constructor.stackTraceLimit == "number";
}
function I3(e) {
  return e instanceof Date ? !0 : typeof e.toDateString == "function" && typeof e.getDate == "function" && typeof e.setDate == "function";
}
function Mn(e) {
  let t = typeof e;
  return process.env.NODE_ENV !== "production" && (t = N3(e)), t;
}
function Qh(e, t, n) {
  if (typeof e != "function")
    throw new Error(
      `Expected the root reducer to be a function. Instead, received: '${Mn(
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
        `Expected the enhancer to be a function. Instead, received: '${Mn(
          n
        )}'`
      );
    return n(Qh)(
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
        `Expected the listener to be a function. Instead, received: '${Mn(
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
    if (!rf(g))
      throw new Error(
        `Actions must be plain objects. Instead, the actual type was: '${Mn(
          g
        )}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`
      );
    if (typeof g.type > "u")
      throw new Error(
        'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.'
      );
    if (typeof g.type != "string")
      throw new Error(
        `Action "type" property must be a string. Instead, the actual type was: '${Mn(
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
        `Expected the nextReducer to be a function. Instead, received: '${Mn(
          g
        )}`
      );
    r = g, h({ type: nr.REPLACE });
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
            `Expected the observer to be an object. Instead, received: '${Mn(
              y
            )}'`
          );
        function b() {
          const m = y;
          m.next && m.next(c());
        }
        return b(), { unsubscribe: g(b) };
      },
      [h_]() {
        return this;
      }
    };
  }
  return h({ type: nr.INIT }), {
    dispatch: h,
    subscribe: l,
    getState: c,
    replaceReducer: d,
    [h_]: _
  };
}
function D3(e, t, n) {
  return Qh(e, t, n);
}
function p_(e) {
  typeof console < "u" && typeof console.error == "function" && console.error(e);
  try {
    throw new Error(e);
  } catch {
  }
}
function C3(e, t, n, r) {
  const i = Object.keys(t), s = n && n.type === nr.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
  if (i.length === 0)
    return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
  if (!rf(e))
    return `The ${s} has unexpected type of "${Mn(
      e
    )}". Expected argument to be an object with the following keys: "${i.join('", "')}"`;
  const o = Object.keys(e).filter(
    (a) => !t.hasOwnProperty(a) && !r[a]
  );
  if (o.forEach((a) => {
    r[a] = !0;
  }), !(n && n.type === nr.REPLACE) && o.length > 0)
    return `Unexpected ${o.length > 1 ? "keys" : "key"} "${o.join('", "')}" found in ${s}. Expected to find one of the known reducer keys instead: "${i.join('", "')}". Unexpected keys will be ignored.`;
}
function L3(e) {
  Object.keys(e).forEach((t) => {
    const n = e[t];
    if (typeof n(void 0, { type: nr.INIT }) > "u")
      throw new Error(
        `The slice reducer for key "${t}" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`
      );
    if (typeof n(void 0, {
      type: nr.PROBE_UNKNOWN_ACTION()
    }) > "u")
      throw new Error(
        `The slice reducer for key "${t}" returned undefined when probed with a random type. Don't try to handle '${nr.INIT}' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.`
      );
  });
}
function j3(e) {
  const t = Object.keys(e), n = {};
  for (let o = 0; o < t.length; o++) {
    const a = t[o];
    process.env.NODE_ENV !== "production" && typeof e[a] > "u" && p_(`No reducer provided for key "${a}"`), typeof e[a] == "function" && (n[a] = e[a]);
  }
  const r = Object.keys(n);
  let i;
  process.env.NODE_ENV !== "production" && (i = {});
  let s;
  try {
    L3(n);
  } catch (o) {
    s = o;
  }
  return function(a = {}, u) {
    if (s)
      throw s;
    if (process.env.NODE_ENV !== "production") {
      const l = C3(
        a,
        n,
        u,
        i
      );
      l && p_(l);
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
function d_(e, t) {
  return function(...n) {
    return t(e.apply(this, n));
  };
}
function F3(e, t) {
  if (typeof e == "function")
    return d_(e, t);
  if (typeof e != "object" || e === null)
    throw new Error(
      `bindActionCreators expected an object or a function, but instead received: '${Mn(
        e
      )}'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    );
  const n = {};
  for (const r in e) {
    const i = e[r];
    typeof i == "function" && (n[r] = d_(i, t));
  }
  return n;
}
function eA(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce(
    (t, n) => (...r) => t(n(...r))
  );
}
function B3(...e) {
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
    return s = eA(...a)(i.dispatch), {
      ...i,
      dispatch: s
    };
  };
}
function z3(e) {
  return rf(e) && "type" in e && typeof e.type == "string";
}
const G5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  __DO_NOT_USE__ActionTypes: nr,
  applyMiddleware: B3,
  bindActionCreators: F3,
  combineReducers: j3,
  compose: eA,
  createStore: Qh,
  isAction: z3,
  isPlainObject: rf,
  legacy_createStore: D3
}, Symbol.toStringTag, { value: "Module" }));
var U3 = {
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
}, V3 = process.env.NODE_ENV !== "production" ? U3 : {};
function E(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
    n[r - 1] = arguments[r];
  if (process.env.NODE_ENV !== "production") {
    var i = typeof e == "string" ? e : V3[e];
    throw typeof i == "function" && (i = i.apply(null, n)), new Error("[MobX] " + i);
  }
  throw new Error(typeof e == "number" ? "[MobX] minified error nr: " + e + (n.length ? " " + n.map(String).join(",") : "") + ". Find the full error at: https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/errors.ts" : "[MobX] " + e);
}
var k3 = {};
function sf() {
  return typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : k3;
}
var tA = Object.assign, qa = Object.getOwnPropertyDescriptor, hn = Object.defineProperty, Fo = Object.prototype, Ga = [];
Object.freeze(Ga);
var ep = {};
Object.freeze(ep);
var W3 = typeof Proxy < "u", q3 = /* @__PURE__ */ Object.toString();
function nA() {
  W3 || E(process.env.NODE_ENV !== "production" ? "`Proxy` objects are not available in the current environment. Please configure MobX to enable a fallback implementation.`" : "Proxy not available");
}
function ds(e) {
  process.env.NODE_ENV !== "production" && O.verifyProxies && E("MobX is currently configured to be able to run in ES5 mode, but in ES5 MobX won't be able to " + e);
}
function St() {
  return ++O.mobxGuid;
}
function tp(e) {
  var t = !1;
  return function() {
    if (!t)
      return t = !0, e.apply(this, arguments);
  };
}
var li = function() {
};
function oe(e) {
  return typeof e == "function";
}
function _n(e) {
  var t = typeof e;
  switch (t) {
    case "string":
    case "symbol":
    case "number":
      return !0;
  }
  return !1;
}
function of(e) {
  return e !== null && typeof e == "object";
}
function nt(e) {
  if (!of(e))
    return !1;
  var t = Object.getPrototypeOf(e);
  if (t == null)
    return !0;
  var n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return typeof n == "function" && n.toString() === q3;
}
function rA(e) {
  var t = e?.constructor;
  return t ? t.name === "GeneratorFunction" || t.displayName === "GeneratorFunction" : !1;
}
function Bo(e, t, n) {
  hn(e, t, {
    enumerable: !1,
    writable: !0,
    configurable: !0,
    value: n
  });
}
function iA(e, t, n) {
  hn(e, t, {
    enumerable: !1,
    writable: !1,
    configurable: !0,
    value: n
  });
}
function br(e, t) {
  var n = "isMobX" + e;
  return t.prototype[n] = !0, function(r) {
    return of(r) && r[n] === !0;
  };
}
function is(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Map]";
}
function G3(e) {
  var t = Object.getPrototypeOf(e), n = Object.getPrototypeOf(t), r = Object.getPrototypeOf(n);
  return r === null;
}
function Ln(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Set]";
}
var sA = typeof Object.getOwnPropertySymbols < "u";
function H3(e) {
  var t = Object.keys(e);
  if (!sA)
    return t;
  var n = Object.getOwnPropertySymbols(e);
  return n.length ? [].concat(t, n.filter(function(r) {
    return Fo.propertyIsEnumerable.call(e, r);
  })) : t;
}
var Fi = typeof Reflect < "u" && Reflect.ownKeys ? Reflect.ownKeys : sA ? function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : (
  /* istanbul ignore next */
  Object.getOwnPropertyNames
);
function Ic(e) {
  return typeof e == "string" ? e : typeof e == "symbol" ? e.toString() : new String(e).toString();
}
function oA(e) {
  return e === null ? null : typeof e == "object" ? "" + e : e;
}
function _t(e, t) {
  return Fo.hasOwnProperty.call(e, t);
}
var K3 = Object.getOwnPropertyDescriptors || function(t) {
  var n = {};
  return Fi(t).forEach(function(r) {
    n[r] = qa(t, r);
  }), n;
};
function ft(e, t) {
  return !!(e & t);
}
function ct(e, t, n) {
  return n ? e |= t : e &= ~t, e;
}
function __(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Y3(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, J3(r.key), r);
  }
}
function ss(e, t, n) {
  return t && Y3(e.prototype, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function hi(e, t) {
  var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n) return (n = n.call(e)).next.bind(n);
  if (Array.isArray(e) || (n = Z3(e)) || t) {
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
function vn() {
  return vn = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, vn.apply(null, arguments);
}
function aA(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Dc(e, t);
}
function Dc(e, t) {
  return Dc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, r) {
    return n.__proto__ = r, n;
  }, Dc(e, t);
}
function X3(e, t) {
  if (typeof e != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function J3(e) {
  var t = X3(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function Z3(e, t) {
  if (e) {
    if (typeof e == "string") return __(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? __(e, t) : void 0;
  }
}
var Ze = /* @__PURE__ */ Symbol("mobx-stored-annotations");
function Xt(e) {
  function t(n, r) {
    if (Uo(r))
      return e.decorate_20223_(n, r);
    zo(n, r, e);
  }
  return Object.assign(t, e);
}
function zo(e, t, n) {
  if (_t(e, Ze) || Bo(e, Ze, vn({}, e[Ze])), process.env.NODE_ENV !== "production" && Ha(n) && !_t(e[Ze], t)) {
    var r = e.constructor.name + ".prototype." + t.toString();
    E("'" + r + "' is decorated with 'override', but no such decorated member was found on prototype.");
  }
  Q3(e, n, t), Ha(n) || (e[Ze][t] = n);
}
function Q3(e, t, n) {
  if (process.env.NODE_ENV !== "production" && !Ha(t) && _t(e[Ze], n)) {
    var r = e.constructor.name + ".prototype." + n.toString(), i = e[Ze][n].annotationType_, s = t.annotationType_;
    E("Cannot apply '@" + s + "' to '" + r + "':" + (`
The field is already decorated with '@` + i + "'.") + `
Re-decorating fields is not allowed.
Use '@override' decorator for methods overridden by subclass.`);
  }
}
function ej(e) {
  return _t(e, Ze) || Bo(e, Ze, vn({}, e[Ze])), e[Ze];
}
function Uo(e) {
  return typeof e == "object" && typeof e.kind == "string";
}
function af(e, t) {
  process.env.NODE_ENV !== "production" && !t.includes(e.kind) && E("The decorator applied to '" + String(e.name) + "' cannot be used on a " + e.kind + " element");
}
var R = /* @__PURE__ */ Symbol("mobx administration"), mr = /* @__PURE__ */ function() {
  function e(n) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "Atom@" + St() : "Atom"), this.name_ = void 0, this.flags_ = 0, this.observers_ = /* @__PURE__ */ new Set(), this.lastAccessedBy_ = 0, this.lowestObserverState_ = z.NOT_TRACKING_, this.onBOL = void 0, this.onBUOL = void 0, this.name_ = n;
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
    return SA(this);
  }, t.reportChanged = function() {
    Qe(), xA(this), et();
  }, t.toString = function() {
    return this.name_;
  }, ss(e, [{
    key: "isBeingObserved",
    get: function() {
      return ft(this.flags_, e.isBeingObservedMask_);
    },
    set: function(r) {
      this.flags_ = ct(this.flags_, e.isBeingObservedMask_, r);
    }
  }, {
    key: "isPendingUnobservation",
    get: function() {
      return ft(this.flags_, e.isPendingUnobservationMask_);
    },
    set: function(r) {
      this.flags_ = ct(this.flags_, e.isPendingUnobservationMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return ft(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = ct(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
mr.isBeingObservedMask_ = 1;
mr.isPendingUnobservationMask_ = 2;
mr.diffValueMask_ = 4;
var np = /* @__PURE__ */ br("Atom", mr);
function rp(e, t, n) {
  t === void 0 && (t = li), n === void 0 && (n = li);
  var r = new mr(e);
  return t !== li && CA(r, t), n !== li && cp(r, n), r;
}
function tj(e, t) {
  return e === t;
}
function nj(e, t) {
  return vp(e, t);
}
function rj(e, t) {
  return vp(e, t, 1);
}
function ij(e, t) {
  return Object.is ? Object.is(e, t) : e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
var Lr = {
  identity: tj,
  structural: nj,
  default: ij,
  shallow: rj
};
function jr(e, t, n) {
  return Vr(e) ? e : Array.isArray(e) ? me.array(e, {
    name: n
  }) : nt(e) ? me.object(e, void 0, {
    name: n
  }) : is(e) ? me.map(e, {
    name: n
  }) : Ln(e) ? me.set(e, {
    name: n
  }) : typeof e == "function" && !zr(e) && !zi(e) ? rA(e) ? Ur(e) : Bi(n, e) : e;
}
function sj(e, t, n) {
  if (e == null || de(e) || Xe(e) || ge(e) || pe(e))
    return e;
  if (Array.isArray(e))
    return me.array(e, {
      name: n,
      deep: !1
    });
  if (nt(e))
    return me.object(e, void 0, {
      name: n,
      deep: !1
    });
  if (is(e))
    return me.map(e, {
      name: n,
      deep: !1
    });
  if (Ln(e))
    return me.set(e, {
      name: n,
      deep: !1
    });
  process.env.NODE_ENV !== "production" && E("The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
}
function uf(e) {
  return e;
}
function oj(e, t) {
  return process.env.NODE_ENV !== "production" && Vr(e) && E("observable.struct should not be used with observable values"), vp(e, t) ? t : e;
}
var uA = "override", aj = /* @__PURE__ */ Xt({
  annotationType_: uA,
  make_: uj,
  extend_: fj,
  decorate_20223_: cj
});
function Ha(e) {
  return e.annotationType_ === uA;
}
function uj(e, t) {
  return process.env.NODE_ENV !== "production" && e.isPlainObject_ && E("Cannot apply '" + this.annotationType_ + "' to '" + e.name_ + "." + t.toString() + "':" + (`
'` + this.annotationType_ + "' cannot be used on plain objects.")), process.env.NODE_ENV !== "production" && !_t(e.appliedAnnotations_, t) && E("'" + e.name_ + "." + t.toString() + "' is annotated with '" + this.annotationType_ + "', but no such annotated member was found on prototype."), 0;
}
function fj(e, t, n, r) {
  E("'" + this.annotationType_ + "' can only be used with 'makeObservable'");
}
function cj(e, t) {
  console.warn("'" + this.annotationType_ + "' cannot be used with decorators - this is a no-op");
}
function Vo(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: lj,
    extend_: hj,
    decorate_20223_: pj
  };
}
function lj(e, t, n, r) {
  var i;
  if ((i = this.options_) != null && i.bound)
    return this.extend_(e, t, n, !1) === null ? 0 : 1;
  if (r === e.target_)
    return this.extend_(e, t, n, !1) === null ? 0 : 2;
  if (zr(n.value))
    return 1;
  var s = fA(e, this, t, n, !1);
  return hn(r, t, s), 2;
}
function hj(e, t, n, r) {
  var i = fA(e, this, t, n);
  return e.defineProperty_(t, i, r);
}
function pj(e, t) {
  process.env.NODE_ENV !== "production" && af(t, ["method", "field"]);
  var n = t.kind, r = t.name, i = t.addInitializer, s = this, o = function(f) {
    var c, l, h, d;
    return lr((c = (l = s.options_) == null ? void 0 : l.name) != null ? c : r.toString(), f, (h = (d = s.options_) == null ? void 0 : d.autoAction) != null ? h : !1);
  };
  if (n == "field")
    return function(u) {
      var f, c = u;
      return zr(c) || (c = o(c)), (f = s.options_) != null && f.bound && (c = c.bind(this), c.isMobxAction = !0), c;
    };
  if (n == "method") {
    var a;
    return zr(e) || (e = o(e)), (a = this.options_) != null && a.bound && i(function() {
      var u = this, f = u[r].bind(u);
      f.isMobxAction = !0, u[r] = f;
    }), e;
  }
  E("Cannot apply '" + s.annotationType_ + "' to '" + String(r) + "' (kind: " + n + "):" + (`
'` + s.annotationType_ + "' can only be used on properties with a function value."));
}
function dj(e, t, n, r) {
  var i = t.annotationType_, s = r.value;
  process.env.NODE_ENV !== "production" && !oe(s) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on properties with a function value."));
}
function fA(e, t, n, r, i) {
  var s, o, a, u, f, c, l;
  i === void 0 && (i = O.safeDescriptors), dj(e, t, n, r);
  var h = r.value;
  if ((s = t.options_) != null && s.bound) {
    var d;
    h = h.bind((d = e.proxy_) != null ? d : e.target_);
  }
  return {
    value: lr(
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
function cA(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: _j,
    extend_: vj,
    decorate_20223_: gj
  };
}
function _j(e, t, n, r) {
  var i;
  if (r === e.target_)
    return this.extend_(e, t, n, !1) === null ? 0 : 2;
  if ((i = this.options_) != null && i.bound && (!_t(e.target_, t) || !zi(e.target_[t])) && this.extend_(e, t, n, !1) === null)
    return 0;
  if (zi(n.value))
    return 1;
  var s = lA(e, this, t, n, !1, !1);
  return hn(r, t, s), 2;
}
function vj(e, t, n, r) {
  var i, s = lA(e, this, t, n, (i = this.options_) == null ? void 0 : i.bound);
  return e.defineProperty_(t, s, r);
}
function gj(e, t) {
  var n;
  process.env.NODE_ENV !== "production" && af(t, ["method"]);
  var r = t.name, i = t.addInitializer;
  return zi(e) || (e = Ur(e)), (n = this.options_) != null && n.bound && i(function() {
    var s = this, o = s[r].bind(s);
    o.isMobXFlow = !0, s[r] = o;
  }), e;
}
function yj(e, t, n, r) {
  var i = t.annotationType_, s = r.value;
  process.env.NODE_ENV !== "production" && !oe(s) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on properties with a generator function value."));
}
function lA(e, t, n, r, i, s) {
  s === void 0 && (s = O.safeDescriptors), yj(e, t, n, r);
  var o = r.value;
  if (zi(o) || (o = Ur(o)), i) {
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
function ip(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: bj,
    extend_: mj,
    decorate_20223_: wj
  };
}
function bj(e, t, n) {
  return this.extend_(e, t, n, !1) === null ? 0 : 1;
}
function mj(e, t, n, r) {
  return Aj(e, this, t, n), e.defineComputedProperty_(t, vn({}, this.options_, {
    get: n.get,
    set: n.set
  }), r);
}
function wj(e, t) {
  process.env.NODE_ENV !== "production" && af(t, ["getter"]);
  var n = this, r = t.name, i = t.addInitializer;
  return i(function() {
    var s = ri(this)[R], o = vn({}, n.options_, {
      get: e,
      context: this
    });
    o.name || (o.name = process.env.NODE_ENV !== "production" ? s.name_ + "." + r.toString() : "ObservableObject." + r.toString()), s.values_.set(r, new Bt(o));
  }), function() {
    return this[R].getObservablePropValue_(r);
  };
}
function Aj(e, t, n, r) {
  var i = t.annotationType_, s = r.get;
  process.env.NODE_ENV !== "production" && !s && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on getter(+setter) properties."));
}
function ff(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: Oj,
    extend_: Ej,
    decorate_20223_: Sj
  };
}
function Oj(e, t, n) {
  return this.extend_(e, t, n, !1) === null ? 0 : 1;
}
function Ej(e, t, n, r) {
  var i, s;
  return xj(e, this, t, n), e.defineObservableProperty_(t, n.value, (i = (s = this.options_) == null ? void 0 : s.enhancer) != null ? i : jr, r);
}
function Sj(e, t) {
  if (process.env.NODE_ENV !== "production") {
    if (t.kind === "field")
      throw E("Please use `@observable accessor " + String(t.name) + "` instead of `@observable " + String(t.name) + "`");
    af(t, ["accessor"]);
  }
  var n = this, r = t.kind, i = t.name, s = /* @__PURE__ */ new WeakSet();
  function o(a, u) {
    var f, c, l = ri(a)[R], h = new rr(u, (f = (c = n.options_) == null ? void 0 : c.enhancer) != null ? f : jr, process.env.NODE_ENV !== "production" ? l.name_ + "." + i.toString() : "ObservableObject." + i.toString(), !1);
    l.values_.set(i, h), s.add(a);
  }
  if (r == "accessor")
    return {
      get: function() {
        return s.has(this) || o(this, e.get.call(this)), this[R].getObservablePropValue_(i);
      },
      set: function(u) {
        return s.has(this) || o(this, u), this[R].setObservablePropValue_(i, u);
      },
      init: function(u) {
        return s.has(this) || o(this, u), u;
      }
    };
}
function xj(e, t, n, r) {
  var i = t.annotationType_;
  process.env.NODE_ENV !== "production" && !("value" in r) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' cannot be used on getter/setter properties"));
}
var Rj = "true", Tj = /* @__PURE__ */ hA();
function hA(e) {
  return {
    annotationType_: Rj,
    options_: e,
    make_: Pj,
    extend_: Nj,
    decorate_20223_: $j
  };
}
function Pj(e, t, n, r) {
  var i, s;
  if (n.get)
    return ko.make_(e, t, n, r);
  if (n.set) {
    var o = lr(t.toString(), n.set);
    return r === e.target_ ? e.defineProperty_(t, {
      configurable: O.safeDescriptors ? e.isPlainObject_ : !0,
      set: o
    }) === null ? 0 : 2 : (hn(r, t, {
      configurable: !0,
      set: o
    }), 2);
  }
  if (r !== e.target_ && typeof n.value == "function") {
    var a;
    if (rA(n.value)) {
      var u, f = (u = this.options_) != null && u.autoBind ? Ur.bound : Ur;
      return f.make_(e, t, n, r);
    }
    var c = (a = this.options_) != null && a.autoBind ? Bi.bound : Bi;
    return c.make_(e, t, n, r);
  }
  var l = ((i = this.options_) == null ? void 0 : i.deep) === !1 ? me.ref : me;
  if (typeof n.value == "function" && (s = this.options_) != null && s.autoBind) {
    var h;
    n.value = n.value.bind((h = e.proxy_) != null ? h : e.target_);
  }
  return l.make_(e, t, n, r);
}
function Nj(e, t, n, r) {
  var i, s;
  if (n.get)
    return ko.extend_(e, t, n, r);
  if (n.set)
    return e.defineProperty_(t, {
      configurable: O.safeDescriptors ? e.isPlainObject_ : !0,
      set: lr(t.toString(), n.set)
    }, r);
  if (typeof n.value == "function" && (i = this.options_) != null && i.autoBind) {
    var o;
    n.value = n.value.bind((o = e.proxy_) != null ? o : e.target_);
  }
  var a = ((s = this.options_) == null ? void 0 : s.deep) === !1 ? me.ref : me;
  return a.extend_(e, t, n, r);
}
function $j(e, t) {
  E("'" + this.annotationType_ + "' cannot be used as a decorator");
}
var Mj = "observable", Ij = "observable.ref", Dj = "observable.shallow", Cj = "observable.struct", pA = {
  deep: !0,
  name: void 0,
  defaultDecorator: void 0,
  proxy: !0
};
Object.freeze(pA);
function aa(e) {
  return e || pA;
}
var Cc = /* @__PURE__ */ ff(Mj), Lj = /* @__PURE__ */ ff(Ij, {
  enhancer: uf
}), jj = /* @__PURE__ */ ff(Dj, {
  enhancer: sj
}), Fj = /* @__PURE__ */ ff(Cj, {
  enhancer: oj
}), dA = /* @__PURE__ */ Xt(Cc);
function ua(e) {
  return e.deep === !0 ? jr : e.deep === !1 ? uf : zj(e.defaultDecorator);
}
function Bj(e) {
  var t;
  return e ? (t = e.defaultDecorator) != null ? t : hA(e) : void 0;
}
function zj(e) {
  var t, n;
  return e && (t = (n = e.options_) == null ? void 0 : n.enhancer) != null ? t : jr;
}
function _A(e, t, n) {
  if (Uo(t))
    return Cc.decorate_20223_(e, t);
  if (_n(t)) {
    zo(e, t, Cc);
    return;
  }
  return Vr(e) ? e : nt(e) ? me.object(e, t, n) : Array.isArray(e) ? me.array(e, t) : is(e) ? me.map(e, t) : Ln(e) ? me.set(e, t) : typeof e == "object" && e !== null ? e : me.box(e, t);
}
tA(_A, dA);
var Uj = {
  box: function(t, n) {
    var r = aa(n);
    return new rr(t, ua(r), r.name, !0, r.equals);
  },
  array: function(t, n) {
    var r = aa(n);
    return (O.useProxies === !1 || r.proxy === !1 ? fB : QF)(t, ua(r), r.name);
  },
  map: function(t, n) {
    var r = aa(n);
    return new pp(t, ua(r), r.name);
  },
  set: function(t, n) {
    var r = aa(n);
    return new dp(t, ua(r), r.name);
  },
  object: function(t, n, r) {
    return wr(function() {
      return lp(O.useProxies === !1 || r?.proxy === !1 ? ri({}, r) : KF({}, r), t, n);
    });
  },
  ref: /* @__PURE__ */ Xt(Lj),
  shallow: /* @__PURE__ */ Xt(jj),
  deep: dA,
  struct: /* @__PURE__ */ Xt(Fj)
}, me = /* @__PURE__ */ tA(_A, Uj), vA = "computed", Vj = "computed.struct", Lc = /* @__PURE__ */ ip(vA), kj = /* @__PURE__ */ ip(Vj, {
  equals: Lr.structural
}), ko = function(t, n) {
  if (Uo(n))
    return Lc.decorate_20223_(t, n);
  if (_n(n))
    return zo(t, n, Lc);
  if (nt(t))
    return Xt(ip(vA, t));
  process.env.NODE_ENV !== "production" && (oe(t) || E("First argument to `computed` should be an expression."), oe(n) && E("A setter as second argument is no longer supported, use `{ set: fn }` option instead"));
  var r = nt(n) ? n : {};
  return r.get = t, r.name || (r.name = t.name || ""), new Bt(r);
};
Object.assign(ko, Lc);
ko.struct = /* @__PURE__ */ Xt(kj);
var v_, g_, Ka = 0, Wj = 1, qj = (v_ = (g_ = /* @__PURE__ */ qa(function() {
}, "name")) == null ? void 0 : g_.configurable) != null ? v_ : !1, y_ = {
  value: "action",
  configurable: !0,
  writable: !1,
  enumerable: !1
};
function lr(e, t, n, r) {
  n === void 0 && (n = !1), process.env.NODE_ENV !== "production" && (oe(t) || E("`action` can only be invoked on functions"), (typeof e != "string" || !e) && E("actions should have valid names, got: '" + e + "'"));
  function i() {
    return gA(e, n, t, r || this, arguments);
  }
  return i.isMobxAction = !0, i.toString = function() {
    return t.toString();
  }, qj && (y_.value = e, hn(i, "name", y_)), i;
}
function gA(e, t, n, r, i) {
  var s = yA(e, t, r, i);
  try {
    return n.apply(r, i);
  } catch (o) {
    throw s.error_ = o, o;
  } finally {
    bA(s);
  }
}
function yA(e, t, n, r) {
  var i = process.env.NODE_ENV !== "production" && Re() && !!e, s = 0;
  if (process.env.NODE_ENV !== "production" && i) {
    s = Date.now();
    var o = r ? Array.from(r) : Ga;
    vt({
      type: up,
      name: e,
      object: n,
      arguments: o
    });
  }
  var a = O.trackingDerivation, u = !t || !a;
  Qe();
  var f = O.allowStateChanges;
  u && (ni(), f = cf(!0));
  var c = hf(!0), l = {
    runAsAction_: u,
    prevDerivation_: a,
    prevAllowStateChanges_: f,
    prevAllowStateReads_: c,
    notifySpy_: i,
    startTime_: s,
    actionId_: Wj++,
    parentActionId_: Ka
  };
  return Ka = l.actionId_, l;
}
function bA(e) {
  Ka !== e.actionId_ && E(30), Ka = e.parentActionId_, e.error_ !== void 0 && (O.suppressReactionErrors = !0), lf(e.prevAllowStateChanges_), wi(e.prevAllowStateReads_), et(), e.runAsAction_ && Fn(e.prevDerivation_), process.env.NODE_ENV !== "production" && e.notifySpy_ && gt({
    time: Date.now() - e.startTime_
  }), O.suppressReactionErrors = !1;
}
function sp(e, t) {
  var n = cf(e);
  try {
    return t();
  } finally {
    lf(n);
  }
}
function cf(e) {
  var t = O.allowStateChanges;
  return O.allowStateChanges = e, t;
}
function lf(e) {
  O.allowStateChanges = e;
}
var Gj = "create", rr = /* @__PURE__ */ function(e) {
  function t(r, i, s, o, a) {
    var u;
    return s === void 0 && (s = process.env.NODE_ENV !== "production" ? "ObservableValue@" + St() : "ObservableValue"), o === void 0 && (o = !0), a === void 0 && (a = Lr.default), u = e.call(this, s) || this, u.enhancer = void 0, u.name_ = void 0, u.equals = void 0, u.hasUnreportedChange_ = !1, u.interceptors_ = void 0, u.changeListeners_ = void 0, u.value_ = void 0, u.dehancer = void 0, u.enhancer = i, u.name_ = s, u.equals = a, u.value_ = i(r, void 0, s), process.env.NODE_ENV !== "production" && o && Re() && Br({
      type: Gj,
      object: u,
      observableKind: "value",
      debugObjectName: u.name_,
      newValue: "" + u.value_
    }), u;
  }
  aA(t, e);
  var n = t.prototype;
  return n.dehanceValue = function(i) {
    return this.dehancer !== void 0 ? this.dehancer(i) : i;
  }, n.set = function(i) {
    var s = this.value_;
    if (i = this.prepareNewValue_(i), i !== O.UNCHANGED) {
      var o = Re();
      process.env.NODE_ENV !== "production" && o && vt({
        type: Ht,
        object: this,
        observableKind: "value",
        debugObjectName: this.name_,
        newValue: i,
        oldValue: s
      }), this.setNewValue_(i), process.env.NODE_ENV !== "production" && o && gt();
    }
  }, n.prepareNewValue_ = function(i) {
    if (cn(this), Pt(this)) {
      var s = Nt(this, {
        object: this,
        type: Ht,
        newValue: i
      });
      if (!s)
        return O.UNCHANGED;
      i = s.newValue;
    }
    return i = this.enhancer(i, this.value_, this.name_), this.equals(this.value_, i) ? O.UNCHANGED : i;
  }, n.setNewValue_ = function(i) {
    var s = this.value_;
    this.value_ = i, this.reportChanged(), Jt(this) && Zt(this, {
      type: Ht,
      object: this,
      newValue: i,
      oldValue: s
    });
  }, n.get = function() {
    return this.reportObserved(), this.dehanceValue(this.value_);
  }, n.intercept_ = function(i) {
    return Wo(this, i);
  }, n.observe_ = function(i, s) {
    return s && i({
      observableKind: "value",
      debugObjectName: this.name_,
      object: this,
      type: Ht,
      newValue: this.value_,
      oldValue: void 0
    }), qo(this, i);
  }, n.raw = function() {
    return this.value_;
  }, n.toJSON = function() {
    return this.get();
  }, n.toString = function() {
    return this.name_ + "[" + this.value_ + "]";
  }, n.valueOf = function() {
    return oA(this.get());
  }, n[Symbol.toPrimitive] = function() {
    return this.valueOf();
  }, t;
}(mr), op = /* @__PURE__ */ br("ObservableValue", rr), Bt = /* @__PURE__ */ function() {
  function e(n) {
    this.dependenciesState_ = z.NOT_TRACKING_, this.observing_ = [], this.newObserving_ = null, this.observers_ = /* @__PURE__ */ new Set(), this.runId_ = 0, this.lastAccessedBy_ = 0, this.lowestObserverState_ = z.UP_TO_DATE_, this.unboundDepsCount_ = 0, this.value_ = new Ya(null), this.name_ = void 0, this.triggeredBy_ = void 0, this.flags_ = 0, this.derivation = void 0, this.setter_ = void 0, this.isTracing_ = Ct.NONE, this.scope_ = void 0, this.equals_ = void 0, this.requiresReaction_ = void 0, this.keepAlive_ = void 0, this.onBOL = void 0, this.onBUOL = void 0, n.get || E(31), this.derivation = n.get, this.name_ = n.name || (process.env.NODE_ENV !== "production" ? "ComputedValue@" + St() : "ComputedValue"), n.set && (this.setter_ = lr(process.env.NODE_ENV !== "production" ? this.name_ + "-setter" : "ComputedValue-setter", n.set)), this.equals_ = n.equals || (n.compareStructural || n.struct ? Lr.structural : Lr.default), this.scope_ = n.context, this.requiresReaction_ = n.requiresReaction, this.keepAlive_ = !!n.keepAlive;
  }
  var t = e.prototype;
  return t.onBecomeStale_ = function() {
    sF(this);
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
      jc(this) && (this.warnAboutUntrackedRead_(), Qe(), this.value_ = this.computeValue_(!1), et());
    else if (SA(this), jc(this)) {
      var r = O.trackingContext;
      this.keepAlive_ && !r && (O.trackingContext = this), this.trackAndCompute() && iF(this), O.trackingContext = r;
    }
    var i = this.value_;
    if (ma(i))
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
      this.dependenciesState_ === z.NOT_TRACKING_
    ), s = this.computeValue_(!0), o = i || ma(r) || ma(s) || !this.equals_(r, s);
    return o && (this.value_ = s, process.env.NODE_ENV !== "production" && Re() && Br({
      observableKind: "computed",
      debugObjectName: this.name_,
      object: this.scope_,
      type: "update",
      oldValue: r,
      newValue: s
    })), o;
  }, t.computeValue_ = function(r) {
    this.isComputing = !0;
    var i = cf(!1), s;
    if (r)
      s = mA(this, this.derivation, this.scope_);
    else if (O.disableErrorBoundaries === !0)
      s = this.derivation.call(this.scope_);
    else
      try {
        s = this.derivation.call(this.scope_);
      } catch (o) {
        s = new Ya(o);
      }
    return lf(i), this.isComputing = !1, s;
  }, t.suspend_ = function() {
    this.keepAlive_ || (Fc(this), this.value_ = void 0, process.env.NODE_ENV !== "production" && this.isTracing_ !== Ct.NONE && console.log("[mobx.trace] Computed value '" + this.name_ + "' was suspended and it will recompute on the next access."));
  }, t.observe_ = function(r, i) {
    var s = this, o = !0, a = void 0;
    return fp(function() {
      var u = s.get();
      if (!o || i) {
        var f = ni();
        r({
          observableKind: "computed",
          debugObjectName: s.name_,
          type: Ht,
          object: s,
          newValue: u,
          oldValue: a
        }), Fn(f);
      }
      o = !1, a = u;
    });
  }, t.warnAboutUntrackedRead_ = function() {
    process.env.NODE_ENV !== "production" && (this.isTracing_ !== Ct.NONE && console.log("[mobx.trace] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute."), (typeof this.requiresReaction_ == "boolean" ? this.requiresReaction_ : O.computedRequiresReaction) && console.warn("[mobx] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute."));
  }, t.toString = function() {
    return this.name_ + "[" + this.derivation.toString() + "]";
  }, t.valueOf = function() {
    return oA(this.get());
  }, t[Symbol.toPrimitive] = function() {
    return this.valueOf();
  }, ss(e, [{
    key: "isComputing",
    get: function() {
      return ft(this.flags_, e.isComputingMask_);
    },
    set: function(r) {
      this.flags_ = ct(this.flags_, e.isComputingMask_, r);
    }
  }, {
    key: "isRunningSetter",
    get: function() {
      return ft(this.flags_, e.isRunningSetterMask_);
    },
    set: function(r) {
      this.flags_ = ct(this.flags_, e.isRunningSetterMask_, r);
    }
  }, {
    key: "isBeingObserved",
    get: function() {
      return ft(this.flags_, e.isBeingObservedMask_);
    },
    set: function(r) {
      this.flags_ = ct(this.flags_, e.isBeingObservedMask_, r);
    }
  }, {
    key: "isPendingUnobservation",
    get: function() {
      return ft(this.flags_, e.isPendingUnobservationMask_);
    },
    set: function(r) {
      this.flags_ = ct(this.flags_, e.isPendingUnobservationMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return ft(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = ct(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
Bt.isComputingMask_ = 1;
Bt.isRunningSetterMask_ = 2;
Bt.isBeingObservedMask_ = 4;
Bt.isPendingUnobservationMask_ = 8;
Bt.diffValueMask_ = 16;
var Fr = /* @__PURE__ */ br("ComputedValue", Bt), z;
(function(e) {
  e[e.NOT_TRACKING_ = -1] = "NOT_TRACKING_", e[e.UP_TO_DATE_ = 0] = "UP_TO_DATE_", e[e.POSSIBLY_STALE_ = 1] = "POSSIBLY_STALE_", e[e.STALE_ = 2] = "STALE_";
})(z || (z = {}));
var Ct;
(function(e) {
  e[e.NONE = 0] = "NONE", e[e.LOG = 1] = "LOG", e[e.BREAK = 2] = "BREAK";
})(Ct || (Ct = {}));
var Ya = function(t) {
  this.cause = void 0, this.cause = t;
};
function ma(e) {
  return e instanceof Ya;
}
function jc(e) {
  switch (e.dependenciesState_) {
    case z.UP_TO_DATE_:
      return !1;
    case z.NOT_TRACKING_:
    case z.STALE_:
      return !0;
    case z.POSSIBLY_STALE_: {
      for (var t = hf(!0), n = ni(), r = e.observing_, i = r.length, s = 0; s < i; s++) {
        var o = r[s];
        if (Fr(o)) {
          if (O.disableErrorBoundaries)
            o.get();
          else
            try {
              o.get();
            } catch {
              return Fn(n), wi(t), !0;
            }
          if (e.dependenciesState_ === z.STALE_)
            return Fn(n), wi(t), !0;
        }
      }
      return wA(e), Fn(n), wi(t), !1;
    }
  }
}
function Hj() {
  return O.trackingDerivation !== null;
}
function cn(e) {
  if (process.env.NODE_ENV !== "production") {
    var t = e.observers_.size > 0;
    !O.allowStateChanges && (t || O.enforceActions === "always") && console.warn("[MobX] " + (O.enforceActions ? "Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: " : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, a computed value or the render function of a React component? You can wrap side effects in 'runInAction' (or decorate functions with 'action') if needed. Tried to modify: ") + e.name_);
  }
}
function Kj(e) {
  process.env.NODE_ENV !== "production" && !O.allowStateReads && O.observableRequiresReaction && console.warn("[mobx] Observable '" + e.name_ + "' being read outside a reactive context.");
}
function mA(e, t, n) {
  var r = hf(!0);
  wA(e), e.newObserving_ = new Array(
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
      s = new Ya(o);
    }
  return O.inBatch--, O.trackingDerivation = i, Xj(e), Yj(e), wi(r), s;
}
function Yj(e) {
  process.env.NODE_ENV !== "production" && e.observing_.length === 0 && (typeof e.requiresObservable_ == "boolean" ? e.requiresObservable_ : O.reactionRequiresObservable) && console.warn("[mobx] Derivation '" + e.name_ + "' is created/updated without reading any observable value.");
}
function Xj(e) {
  for (var t = e.observing_, n = e.observing_ = e.newObserving_, r = z.UP_TO_DATE_, i = 0, s = e.unboundDepsCount_, o = 0; o < s; o++) {
    var a = n[o];
    a.diffValue === 0 && (a.diffValue = 1, i !== o && (n[i] = a), i++), a.dependenciesState_ > r && (r = a.dependenciesState_);
  }
  for (n.length = i, e.newObserving_ = null, s = t.length; s--; ) {
    var u = t[s];
    u.diffValue === 0 && OA(u, e), u.diffValue = 0;
  }
  for (; i--; ) {
    var f = n[i];
    f.diffValue === 1 && (f.diffValue = 0, rF(f, e));
  }
  r !== z.UP_TO_DATE_ && (e.dependenciesState_ = r, e.onBecomeStale_());
}
function Fc(e) {
  var t = e.observing_;
  e.observing_ = [];
  for (var n = t.length; n--; )
    OA(t[n], e);
  e.dependenciesState_ = z.NOT_TRACKING_;
}
function ap(e) {
  var t = ni();
  try {
    return e();
  } finally {
    Fn(t);
  }
}
function ni() {
  var e = O.trackingDerivation;
  return O.trackingDerivation = null, e;
}
function Fn(e) {
  O.trackingDerivation = e;
}
function hf(e) {
  var t = O.allowStateReads;
  return O.allowStateReads = e, t;
}
function wi(e) {
  O.allowStateReads = e;
}
function wA(e) {
  if (e.dependenciesState_ !== z.UP_TO_DATE_) {
    e.dependenciesState_ = z.UP_TO_DATE_;
    for (var t = e.observing_, n = t.length; n--; )
      t[n].lowestObserverState_ = z.UP_TO_DATE_;
  }
}
var Jj = ["mobxGuid", "spyListeners", "enforceActions", "computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "allowStateReads", "disableErrorBoundaries", "runId", "UNCHANGED", "useProxies"], Ps = function() {
  this.version = 6, this.UNCHANGED = {}, this.trackingDerivation = null, this.trackingContext = null, this.runId = 0, this.mobxGuid = 0, this.inBatch = 0, this.pendingUnobservations = [], this.pendingReactions = [], this.isRunningReactions = !1, this.allowStateChanges = !1, this.allowStateReads = !0, this.enforceActions = !0, this.spyListeners = [], this.globalReactionErrorHandlers = [], this.computedRequiresReaction = !1, this.reactionRequiresObservable = !1, this.observableRequiresReaction = !1, this.disableErrorBoundaries = !1, this.suppressReactionErrors = !1, this.useProxies = !0, this.verifyProxies = !1, this.safeDescriptors = !0;
}, wa = !0, AA = !1, O = /* @__PURE__ */ function() {
  var e = /* @__PURE__ */ sf();
  return e.__mobxInstanceCount > 0 && !e.__mobxGlobals && (wa = !1), e.__mobxGlobals && e.__mobxGlobals.version !== new Ps().version && (wa = !1), wa ? e.__mobxGlobals ? (e.__mobxInstanceCount += 1, e.__mobxGlobals.UNCHANGED || (e.__mobxGlobals.UNCHANGED = {}), e.__mobxGlobals) : (e.__mobxInstanceCount = 1, e.__mobxGlobals = /* @__PURE__ */ new Ps()) : (setTimeout(function() {
    AA || E(35);
  }, 1), new Ps());
}();
function Zj() {
  if ((O.pendingReactions.length || O.inBatch || O.isRunningReactions) && E(36), AA = !0, wa) {
    var e = sf();
    --e.__mobxInstanceCount === 0 && (e.__mobxGlobals = void 0), O = new Ps();
  }
}
function Qj() {
  return O;
}
function eF() {
  var e = new Ps();
  for (var t in e)
    Jj.indexOf(t) === -1 && (O[t] = e[t]);
  O.allowStateChanges = !O.enforceActions;
}
function tF(e) {
  return e.observers_ && e.observers_.size > 0;
}
function nF(e) {
  return e.observers_;
}
function rF(e, t) {
  e.observers_.add(t), e.lowestObserverState_ > t.dependenciesState_ && (e.lowestObserverState_ = t.dependenciesState_);
}
function OA(e, t) {
  e.observers_.delete(t), e.observers_.size === 0 && EA(e);
}
function EA(e) {
  e.isPendingUnobservation === !1 && (e.isPendingUnobservation = !0, O.pendingUnobservations.push(e));
}
function Qe() {
  O.inBatch++;
}
function et() {
  if (--O.inBatch === 0) {
    PA();
    for (var e = O.pendingUnobservations, t = 0; t < e.length; t++) {
      var n = e[t];
      n.isPendingUnobservation = !1, n.observers_.size === 0 && (n.isBeingObserved && (n.isBeingObserved = !1, n.onBUO()), n instanceof Bt && n.suspend_());
    }
    O.pendingUnobservations = [];
  }
}
function SA(e) {
  Kj(e);
  var t = O.trackingDerivation;
  return t !== null ? (t.runId_ !== e.lastAccessedBy_ && (e.lastAccessedBy_ = t.runId_, t.newObserving_[t.unboundDepsCount_++] = e, !e.isBeingObserved && O.trackingContext && (e.isBeingObserved = !0, e.onBO())), e.isBeingObserved) : (e.observers_.size === 0 && O.inBatch > 0 && EA(e), !1);
}
function xA(e) {
  e.lowestObserverState_ !== z.STALE_ && (e.lowestObserverState_ = z.STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === z.UP_TO_DATE_ && (process.env.NODE_ENV !== "production" && t.isTracing_ !== Ct.NONE && RA(t, e), t.onBecomeStale_()), t.dependenciesState_ = z.STALE_;
  }));
}
function iF(e) {
  e.lowestObserverState_ !== z.STALE_ && (e.lowestObserverState_ = z.STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === z.POSSIBLY_STALE_ ? (t.dependenciesState_ = z.STALE_, process.env.NODE_ENV !== "production" && t.isTracing_ !== Ct.NONE && RA(t, e)) : t.dependenciesState_ === z.UP_TO_DATE_ && (e.lowestObserverState_ = z.UP_TO_DATE_);
  }));
}
function sF(e) {
  e.lowestObserverState_ === z.UP_TO_DATE_ && (e.lowestObserverState_ = z.POSSIBLY_STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === z.UP_TO_DATE_ && (t.dependenciesState_ = z.POSSIBLY_STALE_, t.onBecomeStale_());
  }));
}
function RA(e, t) {
  if (console.log("[mobx.trace] '" + e.name_ + "' is invalidated due to a change in: '" + t.name_ + "'"), e.isTracing_ === Ct.BREAK) {
    var n = [];
    TA(jA(e), n, 1), new Function(`debugger;
/*
Tracing '` + e.name_ + `'

You are entering this break point because derivation '` + e.name_ + "' is being traced and '" + t.name_ + `' is now forcing it to update.
Just follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update
The stackframe you are looking for is at least ~6-8 stack-frames up.

` + (e instanceof Bt ? e.derivation.toString().replace(/[*]\//g, "/") : "") + `

The dependencies for this derivation are:

` + n.join(`
`) + `
*/
    `)();
  }
}
function TA(e, t, n) {
  if (t.length >= 1e3) {
    t.push("(and many more)");
    return;
  }
  t.push("" + "	".repeat(n - 1) + e.name), e.dependencies && e.dependencies.forEach(function(r) {
    return TA(r, t, n + 1);
  });
}
var gn = /* @__PURE__ */ function() {
  function e(n, r, i, s) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "Reaction@" + St() : "Reaction"), this.name_ = void 0, this.onInvalidate_ = void 0, this.errorHandler_ = void 0, this.requiresObservable_ = void 0, this.observing_ = [], this.newObserving_ = [], this.dependenciesState_ = z.NOT_TRACKING_, this.runId_ = 0, this.unboundDepsCount_ = 0, this.flags_ = 0, this.isTracing_ = Ct.NONE, this.name_ = n, this.onInvalidate_ = r, this.errorHandler_ = i, this.requiresObservable_ = s;
  }
  var t = e.prototype;
  return t.onBecomeStale_ = function() {
    this.schedule_();
  }, t.schedule_ = function() {
    this.isScheduled || (this.isScheduled = !0, O.pendingReactions.push(this), PA());
  }, t.runReaction_ = function() {
    if (!this.isDisposed) {
      Qe(), this.isScheduled = !1;
      var r = O.trackingContext;
      if (O.trackingContext = this, jc(this)) {
        this.isTrackPending = !0;
        try {
          this.onInvalidate_(), process.env.NODE_ENV !== "production" && this.isTrackPending && Re() && Br({
            name: this.name_,
            type: "scheduled-reaction"
          });
        } catch (i) {
          this.reportExceptionInDerivation_(i);
        }
      }
      O.trackingContext = r, et();
    }
  }, t.track = function(r) {
    if (!this.isDisposed) {
      Qe();
      var i = Re(), s;
      process.env.NODE_ENV !== "production" && i && (s = Date.now(), vt({
        name: this.name_,
        type: "reaction"
      })), this.isRunning = !0;
      var o = O.trackingContext;
      O.trackingContext = this;
      var a = mA(this, r, void 0);
      O.trackingContext = o, this.isRunning = !1, this.isTrackPending = !1, this.isDisposed && Fc(this), ma(a) && this.reportExceptionInDerivation_(a.cause), process.env.NODE_ENV !== "production" && i && gt({
        time: Date.now() - s
      }), et();
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
    O.suppressReactionErrors ? process.env.NODE_ENV !== "production" && console.warn("[mobx] (error in reaction '" + this.name_ + "' suppressed, fix error of causing action below)") : console.error(s, r), process.env.NODE_ENV !== "production" && Re() && Br({
      type: "error",
      name: this.name_,
      message: s,
      error: "" + r
    }), O.globalReactionErrorHandlers.forEach(function(o) {
      return o(r, i);
    });
  }, t.dispose = function() {
    this.isDisposed || (this.isDisposed = !0, this.isRunning || (Qe(), Fc(this), et()));
  }, t.getDisposer_ = function(r) {
    var i = this, s = function o() {
      i.dispose(), r == null || r.removeEventListener == null || r.removeEventListener("abort", o);
    };
    return r == null || r.addEventListener == null || r.addEventListener("abort", s), s[R] = this, s;
  }, t.toString = function() {
    return "Reaction[" + this.name_ + "]";
  }, t.trace = function(r) {
    r === void 0 && (r = !1), qA(this, r);
  }, ss(e, [{
    key: "isDisposed",
    get: function() {
      return ft(this.flags_, e.isDisposedMask_);
    },
    set: function(r) {
      this.flags_ = ct(this.flags_, e.isDisposedMask_, r);
    }
  }, {
    key: "isScheduled",
    get: function() {
      return ft(this.flags_, e.isScheduledMask_);
    },
    set: function(r) {
      this.flags_ = ct(this.flags_, e.isScheduledMask_, r);
    }
  }, {
    key: "isTrackPending",
    get: function() {
      return ft(this.flags_, e.isTrackPendingMask_);
    },
    set: function(r) {
      this.flags_ = ct(this.flags_, e.isTrackPendingMask_, r);
    }
  }, {
    key: "isRunning",
    get: function() {
      return ft(this.flags_, e.isRunningMask_);
    },
    set: function(r) {
      this.flags_ = ct(this.flags_, e.isRunningMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return ft(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = ct(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
gn.isDisposedMask_ = 1;
gn.isScheduledMask_ = 2;
gn.isTrackPendingMask_ = 4;
gn.isRunningMask_ = 8;
gn.diffValueMask_ = 16;
function oF(e) {
  return O.globalReactionErrorHandlers.push(e), function() {
    var t = O.globalReactionErrorHandlers.indexOf(e);
    t >= 0 && O.globalReactionErrorHandlers.splice(t, 1);
  };
}
var b_ = 100, Bc = function(t) {
  return t();
};
function PA() {
  O.inBatch > 0 || O.isRunningReactions || Bc(aF);
}
function aF() {
  O.isRunningReactions = !0;
  for (var e = O.pendingReactions, t = 0; e.length > 0; ) {
    ++t === b_ && (console.error(process.env.NODE_ENV !== "production" ? "Reaction doesn't converge to a stable state after " + b_ + " iterations." + (" Probably there is a cycle in the reactive function: " + e[0]) : "[mobx] cycle in reaction: " + e[0]), e.splice(0));
    for (var n = e.splice(0), r = 0, i = n.length; r < i; r++)
      n[r].runReaction_();
  }
  O.isRunningReactions = !1;
}
var Xa = /* @__PURE__ */ br("Reaction", gn);
function uF(e) {
  var t = Bc;
  Bc = function(r) {
    return e(function() {
      return t(r);
    });
  };
}
function Re() {
  return process.env.NODE_ENV !== "production" && !!O.spyListeners.length;
}
function Br(e) {
  if (process.env.NODE_ENV !== "production" && O.spyListeners.length)
    for (var t = O.spyListeners, n = 0, r = t.length; n < r; n++)
      t[n](e);
}
function vt(e) {
  if (process.env.NODE_ENV !== "production") {
    var t = vn({}, e, {
      spyReportStart: !0
    });
    Br(t);
  }
}
var fF = {
  type: "report-end",
  spyReportEnd: !0
};
function gt(e) {
  process.env.NODE_ENV !== "production" && Br(e ? vn({}, e, {
    type: "report-end",
    spyReportEnd: !0
  }) : fF);
}
function NA(e) {
  return process.env.NODE_ENV === "production" ? (console.warn("[mobx.spy] Is a no-op in production builds"), function() {
  }) : (O.spyListeners.push(e), tp(function() {
    O.spyListeners = O.spyListeners.filter(function(t) {
      return t !== e;
    });
  }));
}
var up = "action", cF = "action.bound", $A = "autoAction", lF = "autoAction.bound", MA = "<unnamed action>", zc = /* @__PURE__ */ Vo(up), hF = /* @__PURE__ */ Vo(cF, {
  bound: !0
}), Uc = /* @__PURE__ */ Vo($A, {
  autoAction: !0
}), pF = /* @__PURE__ */ Vo(lF, {
  autoAction: !0,
  bound: !0
});
function IA(e) {
  var t = function(r, i) {
    if (oe(r))
      return lr(r.name || MA, r, e);
    if (oe(i))
      return lr(r, i, e);
    if (Uo(i))
      return (e ? Uc : zc).decorate_20223_(r, i);
    if (_n(i))
      return zo(r, i, e ? Uc : zc);
    if (_n(r))
      return Xt(Vo(e ? $A : up, {
        name: r,
        autoAction: e
      }));
    process.env.NODE_ENV !== "production" && E("Invalid arguments for `action`");
  };
  return t;
}
var Jn = /* @__PURE__ */ IA(!1);
Object.assign(Jn, zc);
var Bi = /* @__PURE__ */ IA(!0);
Object.assign(Bi, Uc);
Jn.bound = /* @__PURE__ */ Xt(hF);
Bi.bound = /* @__PURE__ */ Xt(pF);
function m_(e) {
  return gA(e.name || MA, !1, e, this, void 0);
}
function zr(e) {
  return oe(e) && e.isMobxAction === !0;
}
function fp(e, t) {
  var n, r, i, s;
  t === void 0 && (t = ep), process.env.NODE_ENV !== "production" && (oe(e) || E("Autorun expects a function as first argument"), zr(e) && E("Autorun does not accept actions since actions are untrackable"));
  var o = (n = (r = t) == null ? void 0 : r.name) != null ? n : process.env.NODE_ENV !== "production" ? e.name || "Autorun@" + St() : "Autorun", a = !t.scheduler && !t.delay, u;
  if (a)
    u = new gn(o, function() {
      this.track(l);
    }, t.onError, t.requiresObservable);
  else {
    var f = DA(t), c = !1;
    u = new gn(o, function() {
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
var dF = function(t) {
  return t();
};
function DA(e) {
  return e.scheduler ? e.scheduler : e.delay ? function(t) {
    return setTimeout(t, e.delay);
  } : dF;
}
function _F(e, t, n) {
  var r, i, s;
  n === void 0 && (n = ep), process.env.NODE_ENV !== "production" && ((!oe(e) || !oe(t)) && E("First and second argument to reaction should be functions"), nt(n) || E("Third argument of reactions should be an object"));
  var o = (r = n.name) != null ? r : process.env.NODE_ENV !== "production" ? "Reaction@" + St() : "Reaction", a = Jn(o, n.onError ? vF(n.onError, t) : t), u = !n.scheduler && !n.delay, f = DA(n), c = !0, l = !1, h, d = n.compareStructural ? Lr.structural : n.equals || Lr.default, _ = new gn(o, function() {
    c || u ? v() : l || (l = !0, f(v));
  }, n.onError, n.requiresObservable);
  function v() {
    if (l = !1, !_.isDisposed) {
      var g = !1, y = h;
      _.track(function() {
        var b = sp(!1, function() {
          return e(_);
        });
        g = c || !d(h, b), h = b;
      }), (c && n.fireImmediately || !c && g) && a(h, y, _), c = !1;
    }
  }
  return (i = n) != null && (i = i.signal) != null && i.aborted || _.schedule_(), _.getDisposer_((s = n) == null ? void 0 : s.signal);
}
function vF(e, t) {
  return function() {
    try {
      return t.apply(this, arguments);
    } catch (n) {
      e.call(this, n);
    }
  };
}
var gF = "onBO", yF = "onBUO";
function CA(e, t, n) {
  return LA(gF, e, t, n);
}
function cp(e, t, n) {
  return LA(yF, e, t, n);
}
function LA(e, t, n, r) {
  var i = typeof r == "function" ? tn(t, n) : tn(t), s = oe(r) ? r : n, o = e + "L";
  return i[o] ? i[o].add(s) : i[o] = /* @__PURE__ */ new Set([s]), function() {
    var a = i[o];
    a && (a.delete(s), a.size === 0 && delete i[o]);
  };
}
var bF = "never", fa = "always", mF = "observed";
function wF(e) {
  e.isolateGlobalState === !0 && Zj();
  var t = e.useProxies, n = e.enforceActions;
  if (t !== void 0 && (O.useProxies = t === fa ? !0 : t === bF ? !1 : typeof Proxy < "u"), t === "ifavailable" && (O.verifyProxies = !0), n !== void 0) {
    var r = n === fa ? fa : n === mF;
    O.enforceActions = r, O.allowStateChanges = !(r === !0 || r === fa);
  }
  ["computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "disableErrorBoundaries", "safeDescriptors"].forEach(function(i) {
    i in e && (O[i] = !!e[i]);
  }), O.allowStateReads = !O.observableRequiresReaction, process.env.NODE_ENV !== "production" && O.disableErrorBoundaries === !0 && console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled."), e.reactionScheduler && uF(e.reactionScheduler);
}
function lp(e, t, n, r) {
  process.env.NODE_ENV !== "production" && (arguments.length > 4 && E("'extendObservable' expected 2-4 arguments"), typeof e != "object" && E("'extendObservable' expects an object as first argument"), ge(e) && E("'extendObservable' should not be used on maps, use map.merge instead"), nt(t) || E("'extendObservable' only accepts plain objects as second argument"), (Vr(t) || Vr(n)) && E("Extending an object with another observable (object) is not supported"));
  var i = K3(t);
  return wr(function() {
    var s = ri(e, r)[R];
    Fi(i).forEach(function(o) {
      s.extend_(
        o,
        i[o],
        // must pass "undefined" for { key: undefined }
        n && o in n ? n[o] : !0
      );
    });
  }), e;
}
function jA(e, t) {
  return FA(tn(e, t));
}
function FA(e) {
  var t = {
    name: e.name_
  };
  return e.observing_ && e.observing_.length > 0 && (t.dependencies = OF(e.observing_).map(FA)), t;
}
function AF(e, t) {
  return BA(tn(e, t));
}
function BA(e) {
  var t = {
    name: e.name_
  };
  return tF(e) && (t.observers = Array.from(nF(e)).map(BA)), t;
}
function OF(e) {
  return Array.from(new Set(e));
}
var EF = 0;
function pf() {
  this.message = "FLOW_CANCELLED";
}
pf.prototype = /* @__PURE__ */ Object.create(Error.prototype);
function SF(e) {
  return e instanceof pf;
}
var Uf = /* @__PURE__ */ cA("flow"), xF = /* @__PURE__ */ cA("flow.bound", {
  bound: !0
}), Ur = /* @__PURE__ */ Object.assign(function(t, n) {
  if (Uo(n))
    return Uf.decorate_20223_(t, n);
  if (_n(n))
    return zo(t, n, Uf);
  process.env.NODE_ENV !== "production" && arguments.length !== 1 && E("Flow expects single argument with generator function");
  var r = t, i = r.name || "<unnamed flow>", s = function() {
    var a = this, u = arguments, f = ++EF, c = Jn(i + " - runid: " + f + " - init", r).apply(a, u), l, h = void 0, d = new Promise(function(_, v) {
      var g = 0;
      l = v;
      function y(m) {
        h = void 0;
        var A;
        try {
          A = Jn(i + " - runid: " + f + " - yield " + g++, c.next).call(c, m);
        } catch (S) {
          return v(S);
        }
        w(A);
      }
      function b(m) {
        h = void 0;
        var A;
        try {
          A = Jn(i + " - runid: " + f + " - yield " + g++, c.throw).call(c, m);
        } catch (S) {
          return v(S);
        }
        w(A);
      }
      function w(m) {
        if (oe(m?.then)) {
          m.then(w, v);
          return;
        }
        return m.done ? _(m.value) : (h = Promise.resolve(m.value), h.then(y, b));
      }
      y(void 0);
    });
    return d.cancel = Jn(i + " - runid: " + f + " - cancel", function() {
      try {
        h && w_(h);
        var _ = c.return(void 0), v = Promise.resolve(_.value);
        v.then(li, li), w_(v), l(new pf());
      } catch (g) {
        l(g);
      }
    }), d;
  };
  return s.isMobXFlow = !0, s;
}, Uf);
Ur.bound = /* @__PURE__ */ Xt(xF);
function w_(e) {
  oe(e.cancel) && e.cancel();
}
function RF(e) {
  return e;
}
function zi(e) {
  return e?.isMobXFlow === !0;
}
function TF(e, t, n) {
  var r;
  if (ge(e) || Xe(e) || op(e))
    r = yn(e);
  else if (de(e)) {
    if (process.env.NODE_ENV !== "production" && !_n(t))
      return E("InterceptReads can only be used with a specific property, not with an object in general");
    r = yn(e, t);
  } else if (process.env.NODE_ENV !== "production")
    return E("Expected observable map, object or array as first array");
  return process.env.NODE_ENV !== "production" && r.dehancer !== void 0 ? E("An intercept reader was already established") : (r.dehancer = typeof t == "function" ? t : n, function() {
    r.dehancer = void 0;
  });
}
function PF(e, t, n) {
  return oe(n) ? $F(e, t, n) : NF(e, t);
}
function NF(e, t) {
  return yn(e).intercept_(t);
}
function $F(e, t, n) {
  return yn(e, t).intercept_(n);
}
function zA(e, t) {
  if (t === void 0)
    return Fr(e);
  if (de(e) === !1 || !e[R].values_.has(t))
    return !1;
  var n = tn(e, t);
  return Fr(n);
}
function MF(e) {
  return process.env.NODE_ENV !== "production" && arguments.length > 1 ? E("isComputed expects only 1 argument. Use isComputedProp to inspect the observability of a property") : zA(e);
}
function IF(e, t) {
  return process.env.NODE_ENV !== "production" && !_n(t) ? E("isComputed expected a property name as second argument") : zA(e, t);
}
function UA(e, t) {
  return e ? t !== void 0 ? process.env.NODE_ENV !== "production" && (ge(e) || Xe(e)) ? E("isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.") : de(e) ? e[R].values_.has(t) : !1 : de(e) || !!e[R] || np(e) || Xa(e) || Fr(e) : !1;
}
function Vr(e) {
  return process.env.NODE_ENV !== "production" && arguments.length !== 1 && E("isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property"), UA(e);
}
function DF(e, t) {
  return process.env.NODE_ENV !== "production" && !_n(t) ? E("expected a property name as second argument") : UA(e, t);
}
function Qs(e) {
  if (de(e))
    return e[R].keys_();
  if (ge(e) || pe(e))
    return Array.from(e.keys());
  if (Xe(e))
    return e.map(function(t, n) {
      return n;
    });
  E(5);
}
function CF(e) {
  if (de(e))
    return Qs(e).map(function(t) {
      return e[t];
    });
  if (ge(e))
    return Qs(e).map(function(t) {
      return e.get(t);
    });
  if (pe(e))
    return Array.from(e.values());
  if (Xe(e))
    return e.slice();
  E(6);
}
function LF(e) {
  if (de(e))
    return Qs(e).map(function(t) {
      return [t, e[t]];
    });
  if (ge(e))
    return Qs(e).map(function(t) {
      return [t, e.get(t)];
    });
  if (pe(e))
    return Array.from(e.entries());
  if (Xe(e))
    return e.map(function(t, n) {
      return [n, t];
    });
  E(7);
}
function VA(e, t, n) {
  if (arguments.length === 2 && !pe(e)) {
    Qe();
    var r = t;
    try {
      for (var i in r)
        VA(e, i, r[i]);
    } finally {
      et();
    }
    return;
  }
  de(e) ? e[R].set_(t, n) : ge(e) ? e.set(t, n) : pe(e) ? e.add(t) : Xe(e) ? (typeof t != "number" && (t = parseInt(t, 10)), t < 0 && E("Invalid index: '" + t + "'"), Qe(), t >= e.length && (e.length = t + 1), e[t] = n, et()) : E(8);
}
function jF(e, t) {
  de(e) ? e[R].delete_(t) : ge(e) || pe(e) ? e.delete(t) : Xe(e) ? (typeof t != "number" && (t = parseInt(t, 10)), e.splice(t, 1)) : E(9);
}
function kA(e, t) {
  if (de(e))
    return e[R].has_(t);
  if (ge(e))
    return e.has(t);
  if (pe(e))
    return e.has(t);
  if (Xe(e))
    return t >= 0 && t < e.length;
  E(10);
}
function FF(e, t) {
  if (kA(e, t)) {
    if (de(e))
      return e[R].get_(t);
    if (ge(e))
      return e.get(t);
    if (Xe(e))
      return e[t];
    E(11);
  }
}
function BF(e, t, n) {
  if (de(e))
    return e[R].defineProperty_(t, n);
  E(39);
}
function WA(e) {
  if (de(e))
    return e[R].ownKeys_();
  E(38);
}
function zF(e, t, n, r) {
  return oe(n) ? VF(e, t, n, r) : UF(e, t, n);
}
function UF(e, t, n) {
  return yn(e).observe_(t, n);
}
function VF(e, t, n, r) {
  return yn(e, t).observe_(n, r);
}
function ca(e, t, n) {
  return e.set(t, n), n;
}
function ci(e, t) {
  if (e == null || typeof e != "object" || e instanceof Date || !Vr(e))
    return e;
  if (op(e) || Fr(e))
    return ci(e.get(), t);
  if (t.has(e))
    return t.get(e);
  if (Xe(e)) {
    var n = ca(t, e, new Array(e.length));
    return e.forEach(function(o, a) {
      n[a] = ci(o, t);
    }), n;
  }
  if (pe(e)) {
    var r = ca(t, e, /* @__PURE__ */ new Set());
    return e.forEach(function(o) {
      r.add(ci(o, t));
    }), r;
  }
  if (ge(e)) {
    var i = ca(t, e, /* @__PURE__ */ new Map());
    return e.forEach(function(o, a) {
      i.set(a, ci(o, t));
    }), i;
  } else {
    var s = ca(t, e, {});
    return WA(e).forEach(function(o) {
      Fo.propertyIsEnumerable.call(e, o) && (s[o] = ci(e[o], t));
    }), s;
  }
}
function kF(e, t) {
  return process.env.NODE_ENV !== "production" && t && E("toJS no longer supports options"), ci(e, /* @__PURE__ */ new Map());
}
function qA() {
  if (process.env.NODE_ENV !== "production") {
    for (var e = !1, t = arguments.length, n = new Array(t), r = 0; r < t; r++)
      n[r] = arguments[r];
    typeof n[n.length - 1] == "boolean" && (e = n.pop());
    var i = WF(n);
    if (!i)
      return E("'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
    i.isTracing_ === Ct.NONE && console.log("[mobx.trace] '" + i.name_ + "' tracing enabled"), i.isTracing_ = e ? Ct.BREAK : Ct.LOG;
  }
}
function WF(e) {
  switch (e.length) {
    case 0:
      return O.trackingDerivation;
    case 1:
      return tn(e[0]);
    case 2:
      return tn(e[0], e[1]);
  }
}
function an(e, t) {
  t === void 0 && (t = void 0), Qe();
  try {
    return e.apply(t);
  } finally {
    et();
  }
}
function qF(e, t, n) {
  return arguments.length === 1 || t && typeof t == "object" ? GF(e, t) : GA(e, t, n || {});
}
function GA(e, t, n) {
  var r;
  if (typeof n.timeout == "number") {
    var i = new Error("WHEN_TIMEOUT");
    r = setTimeout(function() {
      if (!o[R].isDisposed)
        if (o(), n.onError)
          n.onError(i);
        else
          throw i;
    }, n.timeout);
  }
  n.name = process.env.NODE_ENV !== "production" ? n.name || "When@" + St() : "When";
  var s = lr(process.env.NODE_ENV !== "production" ? n.name + "-effect" : "When-effect", t), o = fp(function(a) {
    var u = sp(!1, e);
    u && (a.dispose(), r && clearTimeout(r), s());
  }, n);
  return o;
}
function GF(e, t) {
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
    var u, f = GA(e, o, vn({}, t, {
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
function Or(e) {
  return e[R];
}
var HF = {
  has: function(t, n) {
    return process.env.NODE_ENV !== "production" && O.trackingDerivation && ds("detect new properties using the 'in' operator. Use 'has' from 'mobx' instead."), Or(t).has_(n);
  },
  get: function(t, n) {
    return Or(t).get_(n);
  },
  set: function(t, n, r) {
    var i;
    return _n(n) ? (process.env.NODE_ENV !== "production" && !Or(t).values_.has(n) && ds("add a new observable property through direct assignment. Use 'set' from 'mobx' instead."), (i = Or(t).set_(n, r, !0)) != null ? i : !0) : !1;
  },
  deleteProperty: function(t, n) {
    var r;
    return process.env.NODE_ENV !== "production" && ds("delete properties from an observable object. Use 'remove' from 'mobx' instead."), _n(n) ? (r = Or(t).delete_(n, !0)) != null ? r : !0 : !1;
  },
  defineProperty: function(t, n, r) {
    var i;
    return process.env.NODE_ENV !== "production" && ds("define property on an observable object. Use 'defineProperty' from 'mobx' instead."), (i = Or(t).defineProperty_(n, r)) != null ? i : !0;
  },
  ownKeys: function(t) {
    return process.env.NODE_ENV !== "production" && O.trackingDerivation && ds("iterate keys to detect added / removed properties. Use 'keys' from 'mobx' instead."), Or(t).ownKeys_();
  },
  preventExtensions: function(t) {
    E(13);
  }
};
function KF(e, t) {
  var n, r;
  return nA(), e = ri(e, t), (r = (n = e[R]).proxy_) != null ? r : n.proxy_ = new Proxy(e, HF);
}
function Pt(e) {
  return e.interceptors_ !== void 0 && e.interceptors_.length > 0;
}
function Wo(e, t) {
  var n = e.interceptors_ || (e.interceptors_ = []);
  return n.push(t), tp(function() {
    var r = n.indexOf(t);
    r !== -1 && n.splice(r, 1);
  });
}
function Nt(e, t) {
  var n = ni();
  try {
    for (var r = [].concat(e.interceptors_ || []), i = 0, s = r.length; i < s && (t = r[i](t), t && !t.type && E(14), !!t); i++)
      ;
    return t;
  } finally {
    Fn(n);
  }
}
function Jt(e) {
  return e.changeListeners_ !== void 0 && e.changeListeners_.length > 0;
}
function qo(e, t) {
  var n = e.changeListeners_ || (e.changeListeners_ = []);
  return n.push(t), tp(function() {
    var r = n.indexOf(t);
    r !== -1 && n.splice(r, 1);
  });
}
function Zt(e, t) {
  var n = ni(), r = e.changeListeners_;
  if (r) {
    r = r.slice();
    for (var i = 0, s = r.length; i < s; i++)
      r[i](t);
    Fn(n);
  }
}
function YF(e, t, n) {
  return wr(function() {
    var r, i = ri(e, n)[R];
    process.env.NODE_ENV !== "production" && t && e[Ze] && E("makeObservable second arg must be nullish when using decorators. Mixing @decorator syntax with annotations is not supported."), (r = t) != null || (t = ej(e)), Fi(t).forEach(function(s) {
      return i.make_(s, t[s]);
    });
  }), e;
}
var Vf = /* @__PURE__ */ Symbol("mobx-keys");
function XF(e, t, n) {
  return process.env.NODE_ENV !== "production" && (!nt(e) && !nt(Object.getPrototypeOf(e)) && E("'makeAutoObservable' can only be used for classes that don't have a superclass"), de(e) && E("makeAutoObservable can only be used on objects not already made observable")), nt(e) ? lp(e, e, t, n) : (wr(function() {
    var r = ri(e, n)[R];
    if (!e[Vf]) {
      var i = Object.getPrototypeOf(e), s = new Set([].concat(Fi(e), Fi(i)));
      s.delete("constructor"), s.delete(R), Bo(i, Vf, s);
    }
    e[Vf].forEach(function(o) {
      return r.make_(
        o,
        // must pass "undefined" for { key: undefined }
        t && o in t ? t[o] : !0
      );
    });
  }), e);
}
var A_ = "splice", Ht = "update", JF = 1e4, ZF = {
  get: function(t, n) {
    var r = t[R];
    return n === R ? r : n === "length" ? r.getArrayLength_() : typeof n == "string" && !isNaN(n) ? r.get_(parseInt(n)) : _t(Ja, n) ? Ja[n] : t[n];
  },
  set: function(t, n, r) {
    var i = t[R];
    return n === "length" && i.setArrayLength_(r), typeof n == "symbol" || isNaN(n) ? t[n] = r : i.set_(parseInt(n), r), !0;
  },
  preventExtensions: function() {
    E(15);
  }
}, hp = /* @__PURE__ */ function() {
  function e(n, r, i, s) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "ObservableArray@" + St() : "ObservableArray"), this.owned_ = void 0, this.legacyMode_ = void 0, this.atom_ = void 0, this.values_ = [], this.interceptors_ = void 0, this.changeListeners_ = void 0, this.enhancer_ = void 0, this.dehancer = void 0, this.proxy_ = void 0, this.lastKnownLength_ = 0, this.owned_ = i, this.legacyMode_ = s, this.atom_ = new mr(n), this.enhancer_ = function(o, a) {
      return r(o, a, process.env.NODE_ENV !== "production" ? n + "[..]" : "ObservableArray[..]");
    };
  }
  var t = e.prototype;
  return t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.dehanceValues_ = function(r) {
    return this.dehancer !== void 0 && r.length > 0 ? r.map(this.dehancer) : r;
  }, t.intercept_ = function(r) {
    return Wo(this, r);
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
    }), qo(this, r);
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
    r !== this.lastKnownLength_ && E(16), this.lastKnownLength_ += i, this.legacyMode_ && i > 0 && XA(r + i + 1);
  }, t.spliceWithArray_ = function(r, i, s) {
    var o = this;
    cn(this.atom_);
    var a = this.values_.length;
    if (r === void 0 ? r = 0 : r > a ? r = a : r < 0 && (r = Math.max(0, a + r)), arguments.length === 1 ? i = a - r : i == null ? i = 0 : i = Math.max(0, Math.min(i, a - r)), s === void 0 && (s = Ga), Pt(this)) {
      var u = Nt(this, {
        object: this.proxy_,
        type: A_,
        index: r,
        removedCount: i,
        added: s
      });
      if (!u)
        return Ga;
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
    if (s.length < JF) {
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
    var o = !this.owned_ && Re(), a = Jt(this), u = a || o ? {
      observableKind: "array",
      object: this.proxy_,
      type: Ht,
      debugObjectName: this.atom_.name_,
      index: r,
      newValue: i,
      oldValue: s
    } : null;
    process.env.NODE_ENV !== "production" && o && vt(u), this.atom_.reportChanged(), a && Zt(this, u), process.env.NODE_ENV !== "production" && o && gt();
  }, t.notifyArraySplice_ = function(r, i, s) {
    var o = !this.owned_ && Re(), a = Jt(this), u = a || o ? {
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: A_,
      index: r,
      removed: s,
      added: i,
      removedCount: s.length,
      addedCount: i.length
    } : null;
    process.env.NODE_ENV !== "production" && o && vt(u), this.atom_.reportChanged(), a && Zt(this, u), process.env.NODE_ENV !== "production" && o && gt();
  }, t.get_ = function(r) {
    if (this.legacyMode_ && r >= this.values_.length) {
      console.warn(process.env.NODE_ENV !== "production" ? "[mobx.array] Attempt to read an array index (" + r + ") that is out of bounds (" + this.values_.length + "). Please check length first. Out of bound indices will not be tracked by MobX" : "[mobx] Out of bounds read: " + r);
      return;
    }
    return this.atom_.reportObserved(), this.dehanceValue_(this.values_[r]);
  }, t.set_ = function(r, i) {
    var s = this.values_;
    if (this.legacyMode_ && r > s.length && E(17, r, s.length), r < s.length) {
      cn(this.atom_);
      var o = s[r];
      if (Pt(this)) {
        var a = Nt(this, {
          type: Ht,
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
function QF(e, t, n, r) {
  return n === void 0 && (n = process.env.NODE_ENV !== "production" ? "ObservableArray@" + St() : "ObservableArray"), r === void 0 && (r = !1), nA(), wr(function() {
    var i = new hp(n, t, r, !1);
    iA(i.values_, R, i);
    var s = new Proxy(i.values_, ZF);
    return i.proxy_ = s, e && e.length && i.spliceWithArray_(0, 0, e), s;
  });
}
var Ja = {
  clear: function() {
    return this.splice(0);
  },
  replace: function(t) {
    var n = this[R];
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
    var o = this[R];
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
    return this[R].spliceWithArray_(t, n, r);
  },
  push: function() {
    for (var t = this[R], n = arguments.length, r = new Array(n), i = 0; i < n; i++)
      r[i] = arguments[i];
    return t.spliceWithArray_(t.values_.length, 0, r), t.values_.length;
  },
  pop: function() {
    return this.splice(Math.max(this[R].values_.length - 1, 0), 1)[0];
  },
  shift: function() {
    return this.splice(0, 1)[0];
  },
  unshift: function() {
    for (var t = this[R], n = arguments.length, r = new Array(n), i = 0; i < n; i++)
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
    var n = this[R], r = n.dehanceValues_(n.values_).indexOf(t);
    return r > -1 ? (this.splice(r, 1), !0) : !1;
  }
};
Q("at", xt);
Q("concat", xt);
Q("flat", xt);
Q("includes", xt);
Q("indexOf", xt);
Q("join", xt);
Q("lastIndexOf", xt);
Q("slice", xt);
Q("toString", xt);
Q("toLocaleString", xt);
Q("toSorted", xt);
Q("toSpliced", xt);
Q("with", xt);
Q("every", nn);
Q("filter", nn);
Q("find", nn);
Q("findIndex", nn);
Q("findLast", nn);
Q("findLastIndex", nn);
Q("flatMap", nn);
Q("forEach", nn);
Q("map", nn);
Q("some", nn);
Q("toReversed", nn);
Q("reduce", HA);
Q("reduceRight", HA);
function Q(e, t) {
  typeof Array.prototype[e] == "function" && (Ja[e] = t(e));
}
function xt(e) {
  return function() {
    var t = this[R];
    t.atom_.reportObserved();
    var n = t.dehanceValues_(t.values_);
    return n[e].apply(n, arguments);
  };
}
function nn(e) {
  return function(t, n) {
    var r = this, i = this[R];
    i.atom_.reportObserved();
    var s = i.dehanceValues_(i.values_);
    return s[e](function(o, a) {
      return t.call(n, o, a, r);
    });
  };
}
function HA(e) {
  return function() {
    var t = this, n = this[R];
    n.atom_.reportObserved();
    var r = n.dehanceValues_(n.values_), i = arguments[0];
    return arguments[0] = function(s, o, a) {
      return i(s, o, a, t);
    }, r[e].apply(r, arguments);
  };
}
var eB = /* @__PURE__ */ br("ObservableArrayAdministration", hp);
function Xe(e) {
  return of(e) && eB(e[R]);
}
var tB = {}, Zn = "add", Za = "delete", pp = /* @__PURE__ */ function() {
  function e(n, r, i) {
    var s = this;
    r === void 0 && (r = jr), i === void 0 && (i = process.env.NODE_ENV !== "production" ? "ObservableMap@" + St() : "ObservableMap"), this.enhancer_ = void 0, this.name_ = void 0, this[R] = tB, this.data_ = void 0, this.hasMap_ = void 0, this.keysAtom_ = void 0, this.interceptors_ = void 0, this.changeListeners_ = void 0, this.dehancer = void 0, this.enhancer_ = r, this.name_ = i, oe(Map) || E(18), wr(function() {
      s.keysAtom_ = rp(process.env.NODE_ENV !== "production" ? s.name_ + ".keys()" : "ObservableMap.keys()"), s.data_ = /* @__PURE__ */ new Map(), s.hasMap_ = /* @__PURE__ */ new Map(), n && s.merge(n);
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
      var o = s = new rr(this.has_(r), uf, process.env.NODE_ENV !== "production" ? this.name_ + "." + Ic(r) + "?" : "ObservableMap.key?", !1);
      this.hasMap_.set(r, o), cp(o, function() {
        return i.hasMap_.delete(r);
      });
    }
    return s.get();
  }, t.set = function(r, i) {
    var s = this.has_(r);
    if (Pt(this)) {
      var o = Nt(this, {
        type: s ? Ht : Zn,
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
    if (cn(this.keysAtom_), Pt(this)) {
      var s = Nt(this, {
        type: Za,
        object: this,
        name: r
      });
      if (!s)
        return !1;
    }
    if (this.has_(r)) {
      var o = Re(), a = Jt(this), u = a || o ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: Za,
        object: this,
        oldValue: this.data_.get(r).value_,
        name: r
      } : null;
      return process.env.NODE_ENV !== "production" && o && vt(u), an(function() {
        var f;
        i.keysAtom_.reportChanged(), (f = i.hasMap_.get(r)) == null || f.setNewValue_(!1);
        var c = i.data_.get(r);
        c.setNewValue_(void 0), i.data_.delete(r);
      }), a && Zt(this, u), process.env.NODE_ENV !== "production" && o && gt(), !0;
    }
    return !1;
  }, t.updateValue_ = function(r, i) {
    var s = this.data_.get(r);
    if (i = s.prepareNewValue_(i), i !== O.UNCHANGED) {
      var o = Re(), a = Jt(this), u = a || o ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: Ht,
        object: this,
        oldValue: s.value_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && o && vt(u), s.setNewValue_(i), a && Zt(this, u), process.env.NODE_ENV !== "production" && o && gt();
    }
  }, t.addValue_ = function(r, i) {
    var s = this;
    cn(this.keysAtom_), an(function() {
      var f, c = new rr(i, s.enhancer_, process.env.NODE_ENV !== "production" ? s.name_ + "." + Ic(r) : "ObservableMap.key", !1);
      s.data_.set(r, c), i = c.value_, (f = s.hasMap_.get(r)) == null || f.setNewValue_(!0), s.keysAtom_.reportChanged();
    });
    var o = Re(), a = Jt(this), u = a || o ? {
      observableKind: "map",
      debugObjectName: this.name_,
      type: Zn,
      object: this,
      name: r,
      newValue: i
    } : null;
    process.env.NODE_ENV !== "production" && o && vt(u), a && Zt(this, u), process.env.NODE_ENV !== "production" && o && gt();
  }, t.get = function(r) {
    return this.has(r) ? this.dehanceValue_(this.data_.get(r).get()) : this.dehanceValue_(void 0);
  }, t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.keys = function() {
    return this.keysAtom_.reportObserved(), this.data_.keys();
  }, t.values = function() {
    var r = this, i = this.keys();
    return O_({
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
    return O_({
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
    for (var s = hi(this), o; !(o = s()).done; ) {
      var a = o.value, u = a[0], f = a[1];
      r.call(i, f, u, this);
    }
  }, t.merge = function(r) {
    var i = this;
    return ge(r) && (r = new Map(r)), an(function() {
      nt(r) ? H3(r).forEach(function(s) {
        return i.set(s, r[s]);
      }) : Array.isArray(r) ? r.forEach(function(s) {
        var o = s[0], a = s[1];
        return i.set(o, a);
      }) : is(r) ? (G3(r) || E(19, r), r.forEach(function(s, o) {
        return i.set(o, s);
      })) : r != null && E(20, r);
    }), this;
  }, t.clear = function() {
    var r = this;
    an(function() {
      ap(function() {
        for (var i = hi(r.keys()), s; !(s = i()).done; ) {
          var o = s.value;
          r.delete(o);
        }
      });
    });
  }, t.replace = function(r) {
    var i = this;
    return an(function() {
      for (var s = nB(r), o = /* @__PURE__ */ new Map(), a = !1, u = hi(i.data_.keys()), f; !(f = u()).done; ) {
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
      for (var d = hi(s.entries()), _; !(_ = d()).done; ) {
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
          for (var m = i.data_.keys(), A = o.keys(), S = m.next(), T = A.next(); !S.done; ) {
            if (S.value !== T.value) {
              i.keysAtom_.reportChanged();
              break;
            }
            S = m.next(), T = A.next();
          }
      i.data_ = o;
    }), this;
  }, t.toString = function() {
    return "[object ObservableMap]";
  }, t.toJSON = function() {
    return Array.from(this);
  }, t.observe_ = function(r, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support fireImmediately=true in combination with maps."), qo(this, r);
  }, t.intercept_ = function(r) {
    return Wo(this, r);
  }, ss(e, [{
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
}(), ge = /* @__PURE__ */ br("ObservableMap", pp);
function O_(e) {
  return e[Symbol.toStringTag] = "MapIterator", gp(e);
}
function nB(e) {
  if (is(e) || ge(e))
    return e;
  if (Array.isArray(e))
    return new Map(e);
  if (nt(e)) {
    var t = /* @__PURE__ */ new Map();
    for (var n in e)
      t.set(n, e[n]);
    return t;
  } else
    return E(21, e);
}
var rB = {}, dp = /* @__PURE__ */ function() {
  function e(n, r, i) {
    var s = this;
    r === void 0 && (r = jr), i === void 0 && (i = process.env.NODE_ENV !== "production" ? "ObservableSet@" + St() : "ObservableSet"), this.name_ = void 0, this[R] = rB, this.data_ = /* @__PURE__ */ new Set(), this.atom_ = void 0, this.changeListeners_ = void 0, this.interceptors_ = void 0, this.dehancer = void 0, this.enhancer_ = void 0, this.name_ = i, oe(Set) || E(22), this.enhancer_ = function(o, a) {
      return r(o, a, i);
    }, wr(function() {
      s.atom_ = rp(s.name_), n && s.replace(n);
    });
  }
  var t = e.prototype;
  return t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.clear = function() {
    var r = this;
    an(function() {
      ap(function() {
        for (var i = hi(r.data_.values()), s; !(s = i()).done; ) {
          var o = s.value;
          r.delete(o);
        }
      });
    });
  }, t.forEach = function(r, i) {
    for (var s = hi(this), o; !(o = s()).done; ) {
      var a = o.value;
      r.call(i, a, a, this);
    }
  }, t.add = function(r) {
    var i = this;
    if (cn(this.atom_), Pt(this)) {
      var s = Nt(this, {
        type: Zn,
        object: this,
        newValue: r
      });
      if (!s)
        return this;
      r = s.newValue;
    }
    if (!this.has(r)) {
      an(function() {
        i.data_.add(i.enhancer_(r, void 0)), i.atom_.reportChanged();
      });
      var o = process.env.NODE_ENV !== "production" && Re(), a = Jt(this), u = a || o ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: Zn,
        object: this,
        newValue: r
      } : null;
      o && process.env.NODE_ENV !== "production" && vt(u), a && Zt(this, u), o && process.env.NODE_ENV !== "production" && gt();
    }
    return this;
  }, t.delete = function(r) {
    var i = this;
    if (Pt(this)) {
      var s = Nt(this, {
        type: Za,
        object: this,
        oldValue: r
      });
      if (!s)
        return !1;
    }
    if (this.has(r)) {
      var o = process.env.NODE_ENV !== "production" && Re(), a = Jt(this), u = a || o ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: Za,
        object: this,
        oldValue: r
      } : null;
      return o && process.env.NODE_ENV !== "production" && vt(u), an(function() {
        i.atom_.reportChanged(), i.data_.delete(r);
      }), a && Zt(this, u), o && process.env.NODE_ENV !== "production" && gt(), !0;
    }
    return !1;
  }, t.has = function(r) {
    return this.atom_.reportObserved(), this.data_.has(this.dehanceValue_(r));
  }, t.entries = function() {
    var r = this.values();
    return E_({
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
    return E_({
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
    if (Ln(r) && !pe(r))
      return r.intersection(this);
    var i = new Set(this);
    return i.intersection(r);
  }, t.union = function(r) {
    if (Ln(r) && !pe(r))
      return r.union(this);
    var i = new Set(this);
    return i.union(r);
  }, t.difference = function(r) {
    return new Set(this).difference(r);
  }, t.symmetricDifference = function(r) {
    if (Ln(r) && !pe(r))
      return r.symmetricDifference(this);
    var i = new Set(this);
    return i.symmetricDifference(r);
  }, t.isSubsetOf = function(r) {
    return new Set(this).isSubsetOf(r);
  }, t.isSupersetOf = function(r) {
    return new Set(this).isSupersetOf(r);
  }, t.isDisjointFrom = function(r) {
    if (Ln(r) && !pe(r))
      return r.isDisjointFrom(this);
    var i = new Set(this);
    return i.isDisjointFrom(r);
  }, t.replace = function(r) {
    var i = this;
    return pe(r) && (r = new Set(r)), an(function() {
      Array.isArray(r) ? (i.clear(), r.forEach(function(s) {
        return i.add(s);
      })) : Ln(r) ? (i.clear(), r.forEach(function(s) {
        return i.add(s);
      })) : r != null && E("Cannot initialize set from " + r);
    }), this;
  }, t.observe_ = function(r, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support fireImmediately=true in combination with sets."), qo(this, r);
  }, t.intercept_ = function(r) {
    return Wo(this, r);
  }, t.toJSON = function() {
    return Array.from(this);
  }, t.toString = function() {
    return "[object ObservableSet]";
  }, t[Symbol.iterator] = function() {
    return this.values();
  }, ss(e, [{
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
}(), pe = /* @__PURE__ */ br("ObservableSet", dp);
function E_(e) {
  return e[Symbol.toStringTag] = "SetIterator", gp(e);
}
var S_ = /* @__PURE__ */ Object.create(null), x_ = "remove", Vc = /* @__PURE__ */ function() {
  function e(n, r, i, s) {
    r === void 0 && (r = /* @__PURE__ */ new Map()), s === void 0 && (s = Tj), this.target_ = void 0, this.values_ = void 0, this.name_ = void 0, this.defaultAnnotation_ = void 0, this.keysAtom_ = void 0, this.changeListeners_ = void 0, this.interceptors_ = void 0, this.proxy_ = void 0, this.isPlainObject_ = void 0, this.appliedAnnotations_ = void 0, this.pendingKeys_ = void 0, this.target_ = n, this.values_ = r, this.name_ = i, this.defaultAnnotation_ = s, this.keysAtom_ = new mr(process.env.NODE_ENV !== "production" ? this.name_ + ".keys" : "ObservableObject.keys"), this.isPlainObject_ = nt(this.target_), process.env.NODE_ENV !== "production" && !JA(this.defaultAnnotation_) && E("defaultAnnotation must be valid annotation"), process.env.NODE_ENV !== "production" && (this.appliedAnnotations_ = {});
  }
  var t = e.prototype;
  return t.getObservablePropValue_ = function(r) {
    return this.values_.get(r).get();
  }, t.setObservablePropValue_ = function(r, i) {
    var s = this.values_.get(r);
    if (s instanceof Bt)
      return s.set(i), !0;
    if (Pt(this)) {
      var o = Nt(this, {
        type: Ht,
        object: this.proxy_ || this.target_,
        name: r,
        newValue: i
      });
      if (!o)
        return null;
      i = o.newValue;
    }
    if (i = s.prepareNewValue_(i), i !== O.UNCHANGED) {
      var a = Jt(this), u = process.env.NODE_ENV !== "production" && Re(), f = a || u ? {
        type: Ht,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        oldValue: s.value_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && u && vt(f), s.setNewValue_(i), a && Zt(this, f), process.env.NODE_ENV !== "production" && u && gt();
    }
    return !0;
  }, t.get_ = function(r) {
    return O.trackingDerivation && !_t(this.target_, r) && this.has_(r), this.target_[r];
  }, t.set_ = function(r, i, s) {
    return s === void 0 && (s = !1), _t(this.target_, r) ? this.values_.has(r) ? this.setObservablePropValue_(r, i) : s ? Reflect.set(this.target_, r, i) : (this.target_[r] = i, !0) : this.extend_(r, {
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
    return i || (i = new rr(r in this.target_, uf, process.env.NODE_ENV !== "production" ? this.name_ + "." + Ic(r) + "?" : "ObservableObject.key?", !1), this.pendingKeys_.set(r, i)), i.get();
  }, t.make_ = function(r, i) {
    if (i === !0 && (i = this.defaultAnnotation_), i !== !1) {
      if (P_(this, i, r), !(r in this.target_)) {
        var s;
        if ((s = this.target_[Ze]) != null && s[r])
          return;
        E(1, i.annotationType_, this.name_ + "." + r.toString());
      }
      for (var o = this.target_; o && o !== Fo; ) {
        var a = qa(o, r);
        if (a) {
          var u = i.make_(this, r, a, o);
          if (u === 0)
            return;
          if (u === 1)
            break;
        }
        o = Object.getPrototypeOf(o);
      }
      T_(this, i, r);
    }
  }, t.extend_ = function(r, i, s, o) {
    if (o === void 0 && (o = !1), s === !0 && (s = this.defaultAnnotation_), s === !1)
      return this.defineProperty_(r, i, o);
    P_(this, s, r);
    var a = s.extend_(this, r, i, o);
    return a && T_(this, s, r), a;
  }, t.defineProperty_ = function(r, i, s) {
    s === void 0 && (s = !1), cn(this.keysAtom_);
    try {
      Qe();
      var o = this.delete_(r);
      if (!o)
        return o;
      if (Pt(this)) {
        var a = Nt(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: Zn,
          newValue: i.value
        });
        if (!a)
          return null;
        var u = a.newValue;
        i.value !== u && (i = vn({}, i, {
          value: u
        }));
      }
      if (s) {
        if (!Reflect.defineProperty(this.target_, r, i))
          return !1;
      } else
        hn(this.target_, r, i);
      this.notifyPropertyAddition_(r, i.value);
    } finally {
      et();
    }
    return !0;
  }, t.defineObservableProperty_ = function(r, i, s, o) {
    o === void 0 && (o = !1), cn(this.keysAtom_);
    try {
      Qe();
      var a = this.delete_(r);
      if (!a)
        return a;
      if (Pt(this)) {
        var u = Nt(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: Zn,
          newValue: i
        });
        if (!u)
          return null;
        i = u.newValue;
      }
      var f = R_(r), c = {
        configurable: O.safeDescriptors ? this.isPlainObject_ : !0,
        enumerable: !0,
        get: f.get,
        set: f.set
      };
      if (o) {
        if (!Reflect.defineProperty(this.target_, r, c))
          return !1;
      } else
        hn(this.target_, r, c);
      var l = new rr(i, s, process.env.NODE_ENV !== "production" ? this.name_ + "." + r.toString() : "ObservableObject.key", !1);
      this.values_.set(r, l), this.notifyPropertyAddition_(r, l.value_);
    } finally {
      et();
    }
    return !0;
  }, t.defineComputedProperty_ = function(r, i, s) {
    s === void 0 && (s = !1), cn(this.keysAtom_);
    try {
      Qe();
      var o = this.delete_(r);
      if (!o)
        return o;
      if (Pt(this)) {
        var a = Nt(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: Zn,
          newValue: void 0
        });
        if (!a)
          return null;
      }
      i.name || (i.name = process.env.NODE_ENV !== "production" ? this.name_ + "." + r.toString() : "ObservableObject.key"), i.context = this.proxy_ || this.target_;
      var u = R_(r), f = {
        configurable: O.safeDescriptors ? this.isPlainObject_ : !0,
        enumerable: !1,
        get: u.get,
        set: u.set
      };
      if (s) {
        if (!Reflect.defineProperty(this.target_, r, f))
          return !1;
      } else
        hn(this.target_, r, f);
      this.values_.set(r, new Bt(i)), this.notifyPropertyAddition_(r, void 0);
    } finally {
      et();
    }
    return !0;
  }, t.delete_ = function(r, i) {
    if (i === void 0 && (i = !1), cn(this.keysAtom_), !_t(this.target_, r))
      return !0;
    if (Pt(this)) {
      var s = Nt(this, {
        object: this.proxy_ || this.target_,
        name: r,
        type: x_
      });
      if (!s)
        return null;
    }
    try {
      var o;
      Qe();
      var a = Jt(this), u = process.env.NODE_ENV !== "production" && Re(), f = this.values_.get(r), c = void 0;
      if (!f && (a || u)) {
        var l;
        c = (l = qa(this.target_, r)) == null ? void 0 : l.value;
      }
      if (i) {
        if (!Reflect.deleteProperty(this.target_, r))
          return !1;
      } else
        delete this.target_[r];
      if (process.env.NODE_ENV !== "production" && delete this.appliedAnnotations_[r], f && (this.values_.delete(r), f instanceof rr && (c = f.value_), xA(f)), this.keysAtom_.reportChanged(), (o = this.pendingKeys_) == null || (o = o.get(r)) == null || o.set(r in this.target_), a || u) {
        var h = {
          type: x_,
          observableKind: "object",
          object: this.proxy_ || this.target_,
          debugObjectName: this.name_,
          oldValue: c,
          name: r
        };
        process.env.NODE_ENV !== "production" && u && vt(h), a && Zt(this, h), process.env.NODE_ENV !== "production" && u && gt();
      }
    } finally {
      et();
    }
    return !0;
  }, t.observe_ = function(r, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support the fire immediately property for observable objects."), qo(this, r);
  }, t.intercept_ = function(r) {
    return Wo(this, r);
  }, t.notifyPropertyAddition_ = function(r, i) {
    var s, o = Jt(this), a = process.env.NODE_ENV !== "production" && Re();
    if (o || a) {
      var u = o || a ? {
        type: Zn,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && a && vt(u), o && Zt(this, u), process.env.NODE_ENV !== "production" && a && gt();
    }
    (s = this.pendingKeys_) == null || (s = s.get(r)) == null || s.set(!0), this.keysAtom_.reportChanged();
  }, t.ownKeys_ = function() {
    return this.keysAtom_.reportObserved(), Fi(this.target_);
  }, t.keys_ = function() {
    return this.keysAtom_.reportObserved(), Object.keys(this.target_);
  }, e;
}();
function ri(e, t) {
  var n;
  if (process.env.NODE_ENV !== "production" && t && de(e) && E("Options can't be provided for already observable objects."), _t(e, R))
    return process.env.NODE_ENV !== "production" && !(yn(e) instanceof Vc) && E("Cannot convert '" + eo(e) + `' into observable object:
The target is already observable of different type.
Extending builtins is not supported.`), e;
  process.env.NODE_ENV !== "production" && !Object.isExtensible(e) && E("Cannot make the designated object observable; it is not extensible");
  var r = (n = t?.name) != null ? n : process.env.NODE_ENV !== "production" ? (nt(e) ? "ObservableObject" : e.constructor.name) + "@" + St() : "ObservableObject", i = new Vc(e, /* @__PURE__ */ new Map(), String(r), Bj(t));
  return Bo(e, R, i), e;
}
var iB = /* @__PURE__ */ br("ObservableObjectAdministration", Vc);
function R_(e) {
  return S_[e] || (S_[e] = {
    get: function() {
      return this[R].getObservablePropValue_(e);
    },
    set: function(n) {
      return this[R].setObservablePropValue_(e, n);
    }
  });
}
function de(e) {
  return of(e) ? iB(e[R]) : !1;
}
function T_(e, t, n) {
  var r;
  process.env.NODE_ENV !== "production" && (e.appliedAnnotations_[n] = t), (r = e.target_[Ze]) == null || delete r[n];
}
function P_(e, t, n) {
  if (process.env.NODE_ENV !== "production" && !JA(t) && E("Cannot annotate '" + e.name_ + "." + n.toString() + "': Invalid annotation."), process.env.NODE_ENV !== "production" && !Ha(t) && _t(e.appliedAnnotations_, n)) {
    var r = e.name_ + "." + n.toString(), i = e.appliedAnnotations_[n].annotationType_, s = t.annotationType_;
    E("Cannot apply '" + s + "' to '" + r + "':" + (`
The field is already annotated with '` + i + "'.") + `
Re-annotating fields is not allowed.
Use 'override' annotation for methods overridden by subclass.`);
  }
}
var sB = /* @__PURE__ */ YA(0), oB = /* @__PURE__ */ function() {
  var e = !1, t = {};
  return Object.defineProperty(t, "0", {
    set: function() {
      e = !0;
    }
  }), Object.create(t)[0] = 1, e === !1;
}(), kf = 0, KA = function() {
};
function aB(e, t) {
  Object.setPrototypeOf ? Object.setPrototypeOf(e.prototype, t) : e.prototype.__proto__ !== void 0 ? e.prototype.__proto__ = t : e.prototype = t;
}
aB(KA, Array.prototype);
var _p = /* @__PURE__ */ function(e) {
  function t(r, i, s, o) {
    var a;
    return s === void 0 && (s = process.env.NODE_ENV !== "production" ? "ObservableArray@" + St() : "ObservableArray"), o === void 0 && (o = !1), a = e.call(this) || this, wr(function() {
      var u = new hp(s, i, o, !0);
      u.proxy_ = a, iA(a, R, u), r && r.length && a.spliceWithArray(0, 0, r), oB && Object.defineProperty(a, "0", sB);
    }), a;
  }
  aA(t, e);
  var n = t.prototype;
  return n.concat = function() {
    this[R].atom_.reportObserved();
    for (var i = arguments.length, s = new Array(i), o = 0; o < i; o++)
      s[o] = arguments[o];
    return Array.prototype.concat.apply(
      this.slice(),
      //@ts-ignore
      s.map(function(a) {
        return Xe(a) ? a.slice() : a;
      })
    );
  }, n[Symbol.iterator] = function() {
    var r = this, i = 0;
    return gp({
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
  }, ss(t, [{
    key: "length",
    get: function() {
      return this[R].getArrayLength_();
    },
    set: function(i) {
      this[R].setArrayLength_(i);
    }
  }, {
    key: Symbol.toStringTag,
    get: function() {
      return "Array";
    }
  }]);
}(KA);
Object.entries(Ja).forEach(function(e) {
  var t = e[0], n = e[1];
  t !== "concat" && Bo(_p.prototype, t, n);
});
function YA(e) {
  return {
    enumerable: !1,
    configurable: !0,
    get: function() {
      return this[R].get_(e);
    },
    set: function(n) {
      this[R].set_(e, n);
    }
  };
}
function uB(e) {
  hn(_p.prototype, "" + e, YA(e));
}
function XA(e) {
  if (e > kf) {
    for (var t = kf; t < e + 100; t++)
      uB(t);
    kf = e;
  }
}
XA(1e3);
function fB(e, t, n) {
  return new _p(e, t, n);
}
function tn(e, t) {
  if (typeof e == "object" && e !== null) {
    if (Xe(e))
      return t !== void 0 && E(23), e[R].atom_;
    if (pe(e))
      return e.atom_;
    if (ge(e)) {
      if (t === void 0)
        return e.keysAtom_;
      var n = e.data_.get(t) || e.hasMap_.get(t);
      return n || E(25, t, eo(e)), n;
    }
    if (de(e)) {
      if (!t)
        return E(26);
      var r = e[R].values_.get(t);
      return r || E(27, t, eo(e)), r;
    }
    if (np(e) || Fr(e) || Xa(e))
      return e;
  } else if (oe(e) && Xa(e[R]))
    return e[R];
  E(28);
}
function yn(e, t) {
  if (e || E(29), t !== void 0)
    return yn(tn(e, t));
  if (np(e) || Fr(e) || Xa(e) || ge(e) || pe(e))
    return e;
  if (e[R])
    return e[R];
  E(24, e);
}
function eo(e, t) {
  var n;
  if (t !== void 0)
    n = tn(e, t);
  else {
    if (zr(e))
      return e.name;
    de(e) || ge(e) || pe(e) ? n = yn(e) : n = tn(e);
  }
  return n.name_;
}
function wr(e) {
  var t = ni(), n = cf(!0);
  Qe();
  try {
    return e();
  } finally {
    et(), lf(n), Fn(t);
  }
}
var N_ = Fo.toString;
function vp(e, t, n) {
  return n === void 0 && (n = -1), kc(e, t, n);
}
function kc(e, t, n, r, i) {
  if (e === t)
    return e !== 0 || 1 / e === 1 / t;
  if (e == null || t == null)
    return !1;
  if (e !== e)
    return t !== t;
  var s = typeof e;
  if (s !== "function" && s !== "object" && typeof t != "object")
    return !1;
  var o = N_.call(e);
  if (o !== N_.call(t))
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
  e = $_(e), t = $_(t);
  var a = o === "[object Array]";
  if (!a) {
    if (typeof e != "object" || typeof t != "object")
      return !1;
    var u = e.constructor, f = t.constructor;
    if (u !== f && !(oe(u) && u instanceof u && oe(f) && f instanceof f) && "constructor" in e && "constructor" in t)
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
      if (!kc(e[c], t[c], n - 1, r, i))
        return !1;
  } else {
    var l = Object.keys(e), h = l.length;
    if (Object.keys(t).length !== h)
      return !1;
    for (var d = 0; d < h; d++) {
      var _ = l[d];
      if (!(_t(t, _) && kc(e[_], t[_], n - 1, r, i)))
        return !1;
    }
  }
  return r.pop(), i.pop(), !0;
}
function $_(e) {
  return Xe(e) ? e.slice() : is(e) || ge(e) || Ln(e) || pe(e) ? Array.from(e.entries()) : e;
}
var M_, cB = ((M_ = sf().Iterator) == null ? void 0 : M_.prototype) || {};
function gp(e) {
  return e[Symbol.iterator] = lB, Object.assign(Object.create(cB), e);
}
function lB() {
  return this;
}
function JA(e) {
  return (
    // Can be function
    e instanceof Object && typeof e.annotationType_ == "string" && oe(e.make_) && oe(e.extend_)
  );
}
["Symbol", "Map", "Set"].forEach(function(e) {
  var t = sf();
  typeof t[e] > "u" && E("MobX requires global '" + e + "' to be available or polyfilled");
});
typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ == "object" && __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
  spy: NA,
  extras: {
    getDebugName: eo
  },
  $mobx: R
});
const H5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $mobx: R,
  FlowCancellationError: pf,
  ObservableMap: pp,
  ObservableSet: dp,
  Reaction: gn,
  _allowStateChanges: sp,
  _allowStateChangesInsideComputed: m_,
  _allowStateReadsEnd: wi,
  _allowStateReadsStart: hf,
  _autoAction: Bi,
  _endAction: bA,
  _getAdministration: yn,
  _getGlobalState: Qj,
  _interceptReads: TF,
  _isComputingDerivation: Hj,
  _resetGlobalState: eF,
  _startAction: yA,
  action: Jn,
  autorun: fp,
  comparer: Lr,
  computed: ko,
  configure: wF,
  createAtom: rp,
  defineProperty: BF,
  entries: LF,
  extendObservable: lp,
  flow: Ur,
  flowResult: RF,
  get: FF,
  getAtom: tn,
  getDebugName: eo,
  getDependencyTree: jA,
  getObserverTree: AF,
  has: kA,
  intercept: PF,
  isAction: zr,
  isBoxedObservable: op,
  isComputed: MF,
  isComputedProp: IF,
  isFlow: zi,
  isFlowCancellationError: SF,
  isObservable: Vr,
  isObservableArray: Xe,
  isObservableMap: ge,
  isObservableObject: de,
  isObservableProp: DF,
  isObservableSet: pe,
  keys: Qs,
  makeAutoObservable: XF,
  makeObservable: YF,
  observable: me,
  observe: zF,
  onBecomeObserved: CA,
  onBecomeUnobserved: cp,
  onReactionError: oF,
  override: aj,
  ownKeys: WA,
  reaction: _F,
  remove: jF,
  runInAction: m_,
  set: VA,
  spy: NA,
  toJS: kF,
  trace: qA,
  transaction: an,
  untracked: ap,
  values: CF,
  when: qF
}, Symbol.toStringTag, { value: "Module" }));
function ZA(e, t) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function xn(e, t, n) {
  return e.context ? e.callback(n, ...t) : e.callback(...t);
}
class hB {
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
class Rn {
  taps;
  interceptions;
  constructor() {
    this.taps = [], this.interceptions = new hB();
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
        if (a.has(u.name) && a.delete(u.name), u.before && ZA(s.name, u.before))
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
class pB extends Rn {
  call(...t) {
    if (!this.isUsed())
      return;
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      this.taps.forEach((r) => {
        xn(r, t, n);
      });
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
    this.interceptions.done();
  }
}
class dB extends Rn {
  call(...t) {
    if (!this.isUsed())
      return;
    const n = {};
    this.interceptions.call(n, ...t);
    for (let r = 0; r < this.taps.length; r += 1) {
      const i = xn(this.taps[r], t, n);
      if (i !== void 0)
        return this.interceptions.result(i), i;
    }
    this.interceptions.done();
  }
}
class _B extends Rn {
  call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    let [r, ...i] = t;
    for (let s = 0; s < this.taps.length; s += 1) {
      const o = xn(this.taps[s], [r, ...i], n);
      o !== void 0 && (r = o);
    }
    return this.interceptions.result(r), r;
  }
}
class vB extends Rn {
  call(...t) {
    let n = !1;
    const r = {};
    this.interceptions.call(r, ...t);
    try {
      for (; n !== !0; ) {
        n = !0, this.interceptions.loop(...t);
        for (let i = 0; i < this.taps.length; i += 1)
          if (xn(this.taps[i], t, r) !== void 0) {
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
class gB extends Rn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t), await Promise.allSettled(this.taps.map((r) => xn(r, t, n))), this.interceptions.done();
  }
}
class yB extends Rn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      const r = await Promise.race(
        this.taps.map((i) => xn(i, t, n))
      );
      return this.interceptions.result(r), r;
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
  }
}
class bB extends Rn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      for (let r = 0; r < this.taps.length; r += 1)
        await xn(this.taps[r], t, n);
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
    this.interceptions.done();
  }
}
class mB extends Rn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      for (let r = 0; r < this.taps.length; r += 1) {
        const i = await xn(this.taps[r], t, n);
        if (i !== void 0)
          return this.interceptions.result(i), i;
      }
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
    this.interceptions.done();
  }
}
class wB extends Rn {
  async call(...t) {
    let [n, ...r] = t;
    const i = {};
    this.interceptions.call(i, ...t);
    try {
      for (let s = 0; s < this.taps.length; s += 1) {
        const o = await xn(
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
class AB extends Rn {
  async call(...t) {
    let n = !1;
    const r = {};
    this.interceptions.call(r, ...t);
    try {
      for (; n !== !0; ) {
        n = !0, this.interceptions.loop(...t);
        for (let i = 0; i < this.taps.length; i += 1)
          if (await xn(this.taps[i], t, r) !== void 0) {
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
const K5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AsyncParallelBailHook: yB,
  AsyncParallelHook: gB,
  AsyncSeriesBailHook: mB,
  AsyncSeriesHook: bB,
  AsyncSeriesLoopHook: AB,
  AsyncSeriesWaterfallHook: wB,
  SyncBailHook: dB,
  SyncHook: pB,
  SyncLoopHook: vB,
  SyncWaterfallHook: _B,
  equalToOrIn: ZA
}, Symbol.toStringTag, { value: "Module" }));
function Wc(e, t) {
  if (e === t) return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    if (e.constructor !== t.constructor) return !1;
    var n, r, i;
    if (Array.isArray(e)) {
      if (n = e.length, n != t.length) return !1;
      for (r = n; r-- !== 0; )
        if (!Wc(e[r], t[r])) return !1;
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
      if (!Wc(e[s], t[s])) return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
class OB {
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
    return Wc(t, n);
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
class QA {
  static create(t, n) {
    return new QA(t, n);
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
    this.addOptionFromInstance(t, new OB(this.context, n));
  }
}
function Y5(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce(
    (t, n) => (...r) => t(n(...r))
  );
}
function EB(e) {
  return SB(e) && !xB(e);
}
function SB(e) {
  return !!e && typeof e == "object";
}
function xB(e) {
  var t = Object.prototype.toString.call(e);
  return t === "[object RegExp]" || t === "[object Date]" || PB(e);
}
var RB = typeof Symbol == "function" && Symbol.for, TB = RB ? Symbol.for("react.element") : 60103;
function PB(e) {
  return e.$$typeof === TB;
}
var NB = EB;
function $B(e) {
  return Array.isArray(e) ? [] : {};
}
function to(e, t) {
  return t.clone !== !1 && t.isMergeableObject(e) ? no($B(e), e, t) : e;
}
function MB(e, t, n) {
  return e.concat(t).map(function(r) {
    return to(r, n);
  });
}
function IB(e, t) {
  if (!t.customMerge)
    return no;
  var n = t.customMerge(e);
  return typeof n == "function" ? n : no;
}
function DB(e) {
  return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(e).filter(function(t) {
    return Object.propertyIsEnumerable.call(e, t);
  }) : [];
}
function I_(e) {
  return Object.keys(e).concat(DB(e));
}
function eO(e, t) {
  try {
    return t in e;
  } catch {
    return !1;
  }
}
function CB(e, t) {
  return eO(e, t) && !(Object.hasOwnProperty.call(e, t) && Object.propertyIsEnumerable.call(e, t));
}
function LB(e, t, n) {
  var r = {};
  return n.isMergeableObject(e) && I_(e).forEach(function(i) {
    r[i] = to(e[i], n);
  }), I_(t).forEach(function(i) {
    CB(e, i) || (eO(e, i) && n.isMergeableObject(t[i]) ? r[i] = IB(i, n)(e[i], t[i], n) : r[i] = to(t[i], n));
  }), r;
}
function no(e, t, n) {
  n = n || {}, n.arrayMerge = n.arrayMerge || MB, n.isMergeableObject = n.isMergeableObject || NB, n.cloneUnlessOtherwiseSpecified = to;
  var r = Array.isArray(t), i = Array.isArray(e), s = r === i;
  return s ? r ? n.arrayMerge?.(e, t, n) : LB(e, t, n) : to(t, n);
}
function jB(e, t) {
  if (!Array.isArray(e))
    throw new Error("first argument should be an array");
  return e.reduce(function(n, r) {
    return no(n, r, t);
  }, {});
}
no.all = jB;
function ai(e, t = 0, n = 1) {
  return Math.min(Math.max(e, t), n);
}
function FB(e, t, n) {
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
function D_(e, t, n) {
  let r, i, s;
  if (t == 0)
    r = i = s = n;
  else {
    const o = (f, c, l) => (l < 0 && (l += 1), l > 1 && (l -= 1), l < 0.16666666666666666 ? f + (c - f) * 6 * l : l < 0.5 ? c : l < 0.6666666666666666 ? f + (c - f) * (0.6666666666666666 - l) * 6 : f), a = n < 0.5 ? n * (1 + t) : n + t - n * t, u = 2 * n - a;
    r = o(u, a, e + 1 / 3), i = o(u, a, e), s = o(u, a, e - 1 / 3);
  }
  return { r: r * 255, g: i * 255, b: s * 255 };
}
function X5(e, t, n) {
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
function BB(e, t, n) {
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
function J5(e, t, n) {
  const r = n + t * Math.min(n, 1 - n), i = r === 0 ? 0 : 2 * (1 - n / r);
  return { h: e, s: i, v: r };
}
function Z5(e, t, n) {
  const r = (2 - t) * n / 2, i = t === 0 ? t : r <= 1 ? t * n / (2 - t * n) : t * n / (2 - t);
  return { h: e, s: i, l: r };
}
function zB(e) {
  typeof e == "string" && (e = e.replace("#", ""), e = e.length === 3 ? e.replace(/(\w)/g, "$1$1") : e, e = parseInt("0x" + e, 16));
  const t = e, n = t >> 16 & 255, r = t >> 8 & 255, i = t & 255;
  return { r: n, g: r, b: i };
}
function UB(e, t, n) {
  const r = e.r + (t.r - e.r) * n, i = e.g + (t.g - e.g) * n, s = e.b + (t.b - e.b) * n;
  return { r, g: i, b: s };
}
const C_ = {
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
class at {
  static Transparent = at.fromRGBA(0, 0, 0, 0);
  static BLACK = at.fromRGB(0, 0, 0);
  static WHITE = at.fromRGB(255, 255, 255);
  static isColor(t) {
    return typeof t == "string" || typeof t == "number" || t instanceof at;
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
      return this.fromRGB(zB(t));
    if (n && C_[t]) {
      const r = C_[t];
      return this.fromRGB(r[0] * 255 >> 0, r[1] * 255 >> 0, r[2] * 255 >> 0);
    } else if (typeof t == "object" && t !== null)
      return this.fromRGB(t);
    return this.fromRGB(0, 0, 0);
  }
  static fromRGB(t, n, r) {
    return t !== null && typeof t == "object" ? new at(t.r, t.g, t.b) : new at(t, n, r);
  }
  static fromRGBA(t, n, r, i) {
    return t !== null && typeof t == "object" ? new at(t.r, t.g, t.b, n) : new at(t, n, r, i);
  }
  static fromHSL(t, n, r) {
    const { r: i, g: s, b: o } = D_(t, n, r);
    return new at(i, s, o);
  }
  static fromHSV(t, n, r) {
    const { r: i, g: s, b: o } = BB(t, n, r);
    return new at(i, s, o);
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
    return at.fromRGB(0, 0, 0).copy(this);
  }
  setRGB(t, n, r) {
    return this._r = t, this._g = n, this._b = r, this;
  }
  normalize() {
    return this.r = ai(this._r / 255, 0, 1), this.g = ai(this._g / 255, 0, 1), this.b = ai(this._b / 255, 0, 1), this;
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
    const { r: i, g: s, b: o } = UB(t, n, r);
    return new at(i, s, o);
  }
  setRBG(t, n, r) {
    return this.r = t, this.g = n, this.b = r, this;
  }
  setRGBColor(t) {
    return this.r = t.r, this.g = t.g, this.b = t.b, this;
  }
  // 变亮
  brighten(t) {
    const { h: n, s: r, l: i } = FB(this.r, this.g, this.b);
    return this.setRGBColor(D_(n, r, i * (1 + t)));
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
    return this.r = ai(this.r, t, n), this.g = ai(this.g, t, n), this.b = ai(this.b, t, n), this;
  }
  toCssRGB() {
    return `rgb(${Math.round(this.r)},${Math.round(this.g)},${Math.round(this.b)})`;
  }
}
const df = 3, VB = {
  grad: 360 / 400,
  turn: 360,
  rad: 360 / (Math.PI * 2)
}, Bn = (e) => typeof e == "string" ? e.length > 0 : typeof e == "number", Ae = (e, t = 0, n = Math.pow(10, t)) => Math.round(n * e) / n + 0, Mt = (e, t = 0, n = 1) => e > n ? n : e > t ? e : t, tO = (e) => (e = isFinite(e) ? e % 360 : 0, e > 0 ? e : e + 360), kB = (e, t = "deg") => Number(e) * (VB[t] || 1), nO = (e) => ({
  r: Mt(e.r, 0, 255),
  g: Mt(e.g, 0, 255),
  b: Mt(e.b, 0, 255),
  a: Mt(e.a)
}), yp = (e) => ({
  r: Ae(e.r),
  g: Ae(e.g),
  b: Ae(e.b),
  a: Ae(e.a, df)
}), WB = ({ r: e, g: t, b: n, a: r = 1 }) => !Bn(e) || !Bn(t) || !Bn(n) ? null : nO({
  r: Number(e),
  g: Number(t),
  b: Number(n),
  a: Number(r)
}), qB = /^#([0-9a-f]{3,8})$/i, GB = (e) => {
  const t = qB.exec(e);
  return t ? (e = t[1], e.length <= 4 ? {
    r: parseInt(e[0] + e[0], 16),
    g: parseInt(e[1] + e[1], 16),
    b: parseInt(e[2] + e[2], 16),
    a: e.length === 4 ? Ae(parseInt(e[3] + e[3], 16) / 255, 2) : 1
  } : e.length === 6 || e.length === 8 ? {
    r: parseInt(e.substr(0, 2), 16),
    g: parseInt(e.substr(2, 2), 16),
    b: parseInt(e.substr(4, 2), 16),
    a: e.length === 8 ? Ae(parseInt(e.substr(6, 2), 16) / 255, 2) : 1
  } : null) : null;
}, la = (e) => {
  const t = e.toString(16);
  return t.length < 2 ? "0" + t : t;
}, HB = (e) => {
  const { r: t, g: n, b: r, a: i } = yp(e), s = i < 1 ? la(Ae(i * 255)) : "";
  return "#" + la(t) + la(n) + la(r) + s;
}, KB = (e) => ({
  h: tO(e.h),
  s: Mt(e.s, 0, 100),
  v: Mt(e.v, 0, 100),
  a: Mt(e.a)
}), YB = (e) => ({
  h: Ae(e.h),
  s: Ae(e.s),
  v: Ae(e.v),
  a: Ae(e.a, df)
}), XB = ({ h: e, s: t, v: n, a: r = 1 }) => {
  if (!Bn(e) || !Bn(t) || !Bn(n)) return null;
  const i = KB({
    h: Number(e),
    s: Number(t),
    v: Number(n),
    a: Number(r)
  });
  return iO(i);
}, rO = ({ r: e, g: t, b: n, a: r }) => {
  const i = Math.max(e, t, n), s = i - Math.min(e, t, n), o = s ? i === e ? (t - n) / s : i === t ? 2 + (n - e) / s : 4 + (e - t) / s : 0;
  return {
    h: 60 * (o < 0 ? o + 6 : o),
    s: i ? s / i * 100 : 0,
    v: i / 255 * 100,
    a: r
  };
}, iO = ({ h: e, s: t, v: n, a: r }) => {
  e = e / 360 * 6, t = t / 100, n = n / 100;
  const i = Math.floor(e), s = n * (1 - t), o = n * (1 - (e - i) * t), a = n * (1 - (1 - e + i) * t), u = i % 6;
  return {
    r: [n, o, s, s, a, n][u] * 255,
    g: [a, n, n, o, s, s][u] * 255,
    b: [s, s, a, n, n, o][u] * 255,
    a: r
  };
}, sO = (e) => ({
  h: tO(e.h),
  s: Mt(e.s, 0, 100),
  l: Mt(e.l, 0, 100),
  a: Mt(e.a)
}), oO = (e) => ({
  h: Ae(e.h),
  s: Ae(e.s),
  l: Ae(e.l),
  a: Ae(e.a, df)
}), JB = ({ h: e, s: t, l: n, a: r = 1 }) => {
  if (!Bn(e) || !Bn(t) || !Bn(n)) return null;
  const i = sO({
    h: Number(e),
    s: Number(t),
    l: Number(n),
    a: Number(r)
  });
  return aO(i);
}, ZB = ({ h: e, s: t, l: n, a: r }) => (t *= (n < 50 ? n : 100 - n) / 100, {
  h: e,
  s: t > 0 ? 2 * t / (n + t) * 100 : 0,
  v: n + t,
  a: r
}), QB = ({ h: e, s: t, v: n, a: r }) => {
  const i = (200 - t) * n / 100;
  return {
    h: e,
    s: i > 0 && i < 200 ? t * n / 100 / (i <= 100 ? i : 200 - i) * 100 : 0,
    l: i / 2,
    a: r
  };
}, aO = (e) => iO(ZB(e)), ro = (e) => QB(rO(e)), e5 = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, t5 = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, n5 = (e) => {
  const t = e5.exec(e) || t5.exec(e);
  if (!t) return null;
  const n = sO({
    h: kB(t[1], t[2]),
    s: Number(t[3]),
    l: Number(t[4]),
    a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1)
  });
  return aO(n);
}, r5 = (e) => {
  const { h: t, s: n, l: r, a: i } = oO(ro(e));
  return i < 1 ? `hsla(${t}, ${n}%, ${r}%, ${i})` : `hsl(${t}, ${n}%, ${r}%)`;
}, i5 = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, s5 = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, o5 = (e) => {
  const t = i5.exec(e) || s5.exec(e);
  return !t || t[2] !== t[4] || t[4] !== t[6] ? null : nO({
    r: Number(t[1]) / (t[2] ? 100 / 255 : 1),
    g: Number(t[3]) / (t[4] ? 100 / 255 : 1),
    b: Number(t[5]) / (t[6] ? 100 / 255 : 1),
    a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1)
  });
}, a5 = (e) => {
  const { r: t, g: n, b: r, a: i } = yp(e);
  return i < 1 ? `rgba(${t}, ${n}, ${r}, ${i})` : `rgb(${t}, ${n}, ${r})`;
}, qc = {
  string: [
    [GB, "hex"],
    [o5, "rgb"],
    [n5, "hsl"]
  ],
  object: [
    [WB, "rgb"],
    [JB, "hsl"],
    [XB, "hsv"]
  ]
}, L_ = (e, t) => {
  for (let n = 0; n < t.length; n++) {
    const r = t[n][0](e);
    if (r) return [r, t[n][1]];
  }
  return [null, void 0];
}, uO = (e) => typeof e == "string" ? L_(e.trim(), qc.string) : typeof e == "object" && e !== null ? L_(e, qc.object) : [null, void 0], u5 = (e) => uO(e)[1], f5 = (e, t) => ({
  r: e.r,
  g: e.g,
  b: e.b,
  a: t
}), Wf = (e, t) => {
  const n = ro(e);
  return {
    h: n.h,
    s: Mt(n.s + t * 100, 0, 100),
    l: n.l,
    a: n.a
  };
}, qf = (e) => (e.r * 299 + e.g * 587 + e.b * 114) / 1e3 / 255, j_ = (e, t) => {
  const n = ro(e);
  return {
    h: n.h,
    s: n.s,
    l: Mt(n.l + t * 100, 0, 100),
    a: n.a
  };
}, c5 = (e) => ({
  r: 255 - e.r,
  g: 255 - e.g,
  b: 255 - e.b,
  a: e.a
});
class Qa {
  parsed;
  rgba;
  constructor(t) {
    this.parsed = uO(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
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
    return Ae(qf(this.rgba), 2);
  }
  /**
   * Same as calling `brightness() < 0.5`.
   */
  isDark() {
    return qf(this.rgba) < 0.5;
  }
  /**
   * Same as calling `brightness() >= 0.5`.
   * */
  isLight() {
    return qf(this.rgba) >= 0.5;
  }
  /**
   * Returns the hexadecimal representation of a color.
   * When the alpha channel value of the color is less than 1,
   * it outputs #rrggbbaa format instead of #rrggbb.
   */
  toHex() {
    return HB(this.rgba);
  }
  /**
   * Converts a color to RGB color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toRgb() {
    return yp(this.rgba);
  }
  /**
   * Converts a color to RGB color space and returns a string representation.
   * Outputs an alpha value only if it is less than 1.
   */
  toRgbString() {
    return a5(this.rgba);
  }
  /**
   * Converts a color to HSL color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toHsl() {
    return oO(ro(this.rgba));
  }
  /**
   * Converts a color to HSL color space and returns a string representation.
   * Always includes an alpha value from 0 to 1.
   */
  toHslString() {
    return r5(this.rgba);
  }
  /**
   * Converts a color to HSV color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toHsv() {
    return YB(rO(this.rgba));
  }
  /**
   * Creates a new instance containing an inverted (opposite) version of the color.
   */
  invert() {
    return sn(c5(this.rgba));
  }
  /**
   * Increases the HSL saturation of a color by the given amount.
   */
  saturate(t = 0.1) {
    return sn(Wf(this.rgba, t));
  }
  /**
   * Decreases the HSL saturation of a color by the given amount.
   */
  desaturate(t = 0.1) {
    return sn(Wf(this.rgba, -t));
  }
  /**
   * Makes a gray color with the same lightness as a source color.
   */
  grayscale() {
    return sn(Wf(this.rgba, -1));
  }
  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  lighten(t = 0.1) {
    return sn(j_(this.rgba, t));
  }
  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  darken(t = 0.1) {
    return sn(j_(this.rgba, -t));
  }
  /**
   * Changes the HSL hue of a color by the given amount.
   */
  rotate(t = 15) {
    return this.hue(this.hue() + t);
  }
  alpha(t) {
    return typeof t == "number" ? sn(f5(this.rgba, t)) : Ae(this.rgba.a, df);
  }
  hue(t) {
    const n = ro(this.rgba);
    return typeof t == "number" ? sn({ h: t, s: n.s, l: n.l, a: n.a }) : Ae(n.h);
  }
  /**
   * Determines whether two values are the same color.
   */
  isEqual(t) {
    return this.toHex() === sn(t).toHex();
  }
}
const sn = (e) => e instanceof Qa ? e : new Qa(e), F_ = [], l5 = (e) => {
  e.forEach((t) => {
    F_.indexOf(t) < 0 && (t(Qa, qc), F_.push(t));
  });
}, h5 = () => new Qa({
  r: Math.random() * 255,
  g: Math.random() * 255,
  b: Math.random() * 255
}), Q5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  colord: sn,
  extend: l5,
  getFormat: u5,
  random: h5
}, Symbol.toStringTag, { value: "Module" }));
var p5 = /* @__PURE__ */ ((e) => (e.create = "create", e.add = "add", e.modify = "modify", e.event = "event", e))(p5 || {});
class ez {
  constructor(t) {
    this.config = t;
  }
  hooks = /* @__PURE__ */ new Map();
  methods = /* @__PURE__ */ new Map();
  plugins = /* @__PURE__ */ new Map();
  extraPresets = [];
  extraPlugins = [];
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
  applyMethods(t) {
    const n = this.methods.get(t) ?? [];
    return (...r) => {
      n.forEach((i) => {
        i(...r);
      });
    };
  }
  initPluginContext(t) {
    const n = {
      pluginName: t.name,
      registerMethod: this.registerMethod.bind(this),
      register: this.register.bind(this)
    };
    return new Proxy(n, {
      get: (r, i, s) => this.methods.has(i) ? this.applyMethods(i) : Reflect.get(r, i, s)
    });
  }
  initPreset(t) {
    this.registerPlugin(t);
    const n = this.initPluginContext(t), { plugins: r, presets: i } = t.apply(n, t.config);
    i && this.extraPresets.push(...i), r && this.extraPlugins.push(...r);
  }
  initPlugin(t) {
    this.registerPlugin(t);
    const n = this.initPluginContext(t);
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
    let { name: n, type: r } = t;
    r || (n.startsWith("modify") && (r = "modify"), n.startsWith("add") && (r = "add"), n.startsWith("on") && (r = "event"), n.startsWith("create") && (r = "create"));
    const i = (this.hooks.get(n) ?? []).slice();
    switch (i.sort((s, o) => {
      let a = s.order ?? 0, u = o.order ?? 0;
      return a - u;
    }), r) {
      case "create": {
        let s = t.initalValue;
        for (let o of i) {
          let a = await Promise.resolve().then(() => o.fn(t.args));
          if (a != null)
            return a;
        }
        return s;
      }
      case "add": {
        let s = t.initalValue ?? [];
        for (let o of i) {
          let a = await Promise.resolve().then(() => o.fn(t.args));
          a != null && s.push(a);
        }
        return s;
      }
      case "modify": {
        let s = t.initalValue ?? {};
        for (let o of i) {
          let a = await Promise.resolve().then(() => o.fn(s, t.args));
          a != null && (s = a);
        }
        return s;
      }
      case "event": {
        if (t.sync)
          for (let s of i)
            s.fn(t.args);
        else {
          let s = Promise.resolve();
          for (let o of i)
            s = s.then(() => {
              o.fn(t.args);
            });
        }
        break;
      }
    }
  }
  destroy() {
    this.extraPlugins = [], this.extraPresets = [], this.plugins.clear(), this.hooks.clear(), this.methods.clear();
  }
}
var ht = -1, ze = 1, he = 0;
function io(e, t, n, r, i) {
  if (e === t)
    return e ? [[he, e]] : [];
  if (n != null) {
    var s = A5(e, t, n);
    if (s)
      return s;
  }
  var o = bp(e, t), a = e.substring(0, o);
  e = e.substring(o), t = t.substring(o), o = _f(e, t);
  var u = e.substring(e.length - o);
  e = e.substring(0, e.length - o), t = t.substring(0, t.length - o);
  var f = d5(e, t);
  return a && f.unshift([he, a]), u && f.push([he, u]), mp(f, i), r && g5(f), f;
}
function d5(e, t) {
  var n;
  if (!e)
    return [[ze, t]];
  if (!t)
    return [[ht, e]];
  var r = e.length > t.length ? e : t, i = e.length > t.length ? t : e, s = r.indexOf(i);
  if (s !== -1)
    return n = [
      [ze, r.substring(0, s)],
      [he, i],
      [ze, r.substring(s + i.length)]
    ], e.length > t.length && (n[0][0] = n[2][0] = ht), n;
  if (i.length === 1)
    return [
      [ht, e],
      [ze, t]
    ];
  var o = v5(e, t);
  if (o) {
    var a = o[0], u = o[1], f = o[2], c = o[3], l = o[4], h = io(a, f), d = io(u, c);
    return h.concat([[he, l]], d);
  }
  return _5(e, t);
}
function _5(e, t) {
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
            return B_(e, t, w, m);
        }
      }
    }
    for (var T = -g + _; T <= g - v; T += 2) {
      var A = s + T, S;
      T === -g || T !== g && u[A - 1] < u[A + 1] ? S = u[A + 1] : S = u[A - 1] + 1;
      for (var F = S - T; S < n && F < r && e.charAt(n - S - 1) === t.charAt(r - F - 1); )
        S++, F++;
      if (u[A] = S, S > n)
        v += 2;
      else if (F > r)
        _ += 2;
      else if (!l) {
        var b = s + c - T;
        if (b >= 0 && b < o && a[b] !== -1) {
          var w = a[b], m = s + w - b;
          if (S = n - S, w >= S)
            return B_(e, t, w, m);
        }
      }
    }
  }
  return [
    [ht, e],
    [ze, t]
  ];
}
function B_(e, t, n, r) {
  var i = e.substring(0, n), s = t.substring(0, r), o = e.substring(n), a = t.substring(r), u = io(i, s), f = io(o, a);
  return u.concat(f);
}
function bp(e, t) {
  if (!e || !t || e.charAt(0) !== t.charAt(0))
    return 0;
  for (var n = 0, r = Math.min(e.length, t.length), i = r, s = 0; n < i; )
    e.substring(s, i) == t.substring(s, i) ? (n = i, s = n) : r = i, i = Math.floor((r - n) / 2 + n);
  return fO(e.charCodeAt(i - 1)) && i--, i;
}
function z_(e, t) {
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
function _f(e, t) {
  if (!e || !t || e.slice(-1) !== t.slice(-1))
    return 0;
  for (var n = 0, r = Math.min(e.length, t.length), i = r, s = 0; n < i; )
    e.substring(e.length - i, e.length - s) == t.substring(t.length - i, t.length - s) ? (n = i, s = n) : r = i, i = Math.floor((r - n) / 2 + n);
  return cO(e.charCodeAt(e.length - i)) && i--, i;
}
function v5(e, t) {
  var n = e.length > t.length ? e : t, r = e.length > t.length ? t : e;
  if (n.length < 4 || r.length * 2 < n.length)
    return null;
  function i(d, _, v) {
    for (var g = d.substring(v, v + Math.floor(d.length / 4)), y = -1, b = "", w, m, A, S; (y = _.indexOf(g, y + 1)) !== -1; ) {
      var T = bp(
        d.substring(v),
        _.substring(y)
      ), F = _f(
        d.substring(0, v),
        _.substring(0, y)
      );
      b.length < F + T && (b = _.substring(y - F, y) + _.substring(y, y + T), w = d.substring(0, v - F), m = d.substring(v + T), A = _.substring(0, y - F), S = _.substring(y + T));
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
function g5(e) {
  for (var t = !1, n = [], r = 0, i = null, s = 0, o = 0, a = 0, u = 0, f = 0; s < e.length; )
    e[s][0] == he ? (n[r++] = s, o = u, a = f, u = 0, f = 0, i = e[s][1]) : (e[s][0] == ze ? u += e[s][1].length : f += e[s][1].length, i && i.length <= Math.max(o, a) && i.length <= Math.max(u, f) && (e.splice(n[r - 1], 0, [
      ht,
      i
    ]), e[n[r - 1] + 1][0] = ze, r--, r--, s = r > 0 ? n[r - 1] : -1, o = 0, a = 0, u = 0, f = 0, i = null, t = !0)), s++;
  for (t && mp(e), m5(e), s = 1; s < e.length; ) {
    if (e[s - 1][0] == ht && e[s][0] == ze) {
      var c = e[s - 1][1], l = e[s][1], h = z_(c, l), d = z_(l, c);
      h >= d ? (h >= c.length / 2 || h >= l.length / 2) && (e.splice(s, 0, [
        he,
        l.substring(0, h)
      ]), e[s - 1][1] = c.substring(
        0,
        c.length - h
      ), e[s + 1][1] = l.substring(h), s++) : (d >= c.length / 2 || d >= l.length / 2) && (e.splice(s, 0, [
        he,
        c.substring(0, d)
      ]), e[s - 1][0] = ze, e[s - 1][1] = l.substring(
        0,
        l.length - d
      ), e[s + 1][0] = ht, e[s + 1][1] = c.substring(d), s++), s++;
    }
    s++;
  }
}
var U_ = /[^a-zA-Z0-9]/, V_ = /\s/, k_ = /[\r\n]/, y5 = /\n\r?\n$/, b5 = /^\r?\n\r?\n/;
function m5(e) {
  function t(d, _) {
    if (!d || !_)
      return 6;
    var v = d.charAt(d.length - 1), g = _.charAt(0), y = v.match(U_), b = g.match(U_), w = y && v.match(V_), m = b && g.match(V_), A = w && v.match(k_), S = m && g.match(k_), T = A && d.match(y5), F = S && _.match(b5);
    return T || F ? 5 : A || S ? 4 : y && !w && m ? 3 : w || m ? 2 : y || b ? 1 : 0;
  }
  for (var n = 1; n < e.length - 1; ) {
    if (e[n - 1][0] == he && e[n + 1][0] == he) {
      var r = e[n - 1][1], i = e[n][1], s = e[n + 1][1], o = _f(r, i);
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
function mp(e, t) {
  e.push([he, ""]);
  for (var n = 0, r = 0, i = 0, s = "", o = "", a; n < e.length; ) {
    if (n < e.length - 1 && !e[n][1]) {
      e.splice(n, 1);
      continue;
    }
    switch (e[n][0]) {
      case ze:
        i++, o += e[n][1], n++;
        break;
      case ht:
        r++, s += e[n][1], n++;
        break;
      case he:
        var u = n - i - r - 1;
        if (t) {
          if (u >= 0 && hO(e[u][1])) {
            var f = e[u][1].slice(-1);
            if (e[u][1] = e[u][1].slice(
              0,
              -1
            ), s = f + s, o = f + o, !e[u][1]) {
              e.splice(u, 1), n--;
              var c = u - 1;
              e[c] && e[c][0] === ze && (i++, o = e[c][1] + o, c--), e[c] && e[c][0] === ht && (r++, s = e[c][1] + s, c--), u = c;
            }
          }
          if (lO(e[n][1])) {
            var f = e[n][1].charAt(0);
            e[n][1] = e[n][1].slice(1), s += f, o += f;
          }
        }
        if (n < e.length - 1 && !e[n][1]) {
          e.splice(n, 1);
          break;
        }
        if (s.length > 0 || o.length > 0) {
          s.length > 0 && o.length > 0 && (a = bp(o, s), a !== 0 && (u >= 0 ? e[u][1] += o.substring(
            0,
            a
          ) : (e.splice(0, 0, [
            he,
            o.substring(0, a)
          ]), n++), o = o.substring(a), s = s.substring(a)), a = _f(o, s), a !== 0 && (e[n][1] = o.substring(o.length - a) + e[n][1], o = o.substring(
            0,
            o.length - a
          ), s = s.substring(
            0,
            s.length - a
          )));
          var l = i + r;
          s.length === 0 && o.length === 0 ? (e.splice(n - l, l), n = n - l) : s.length === 0 ? (e.splice(n - l, l, [ze, o]), n = n - l + 1) : o.length === 0 ? (e.splice(n - l, l, [ht, s]), n = n - l + 1) : (e.splice(
            n - l,
            l,
            [ht, s],
            [ze, o]
          ), n = n - l + 2);
        }
        n !== 0 && e[n - 1][0] === he ? (e[n - 1][1] += e[n][1], e.splice(n, 1)) : n++, i = 0, r = 0, s = "", o = "";
        break;
    }
  }
  e[e.length - 1][1] === "" && e.pop();
  var h = !1;
  for (n = 1; n < e.length - 1; )
    e[n - 1][0] === he && e[n + 1][0] === he && (e[n][1].substring(
      e[n][1].length - e[n - 1][1].length
    ) === e[n - 1][1] ? (e[n][1] = e[n - 1][1] + e[n][1].substring(
      0,
      e[n][1].length - e[n - 1][1].length
    ), e[n + 1][1] = e[n - 1][1] + e[n + 1][1], e.splice(n - 1, 1), h = !0) : e[n][1].substring(0, e[n + 1][1].length) == e[n + 1][1] && (e[n - 1][1] += e[n + 1][1], e[n][1] = e[n][1].substring(e[n + 1][1].length) + e[n + 1][1], e.splice(n + 1, 1), h = !0)), n++;
  h && mp(e, t);
}
function fO(e) {
  return e >= 55296 && e <= 56319;
}
function cO(e) {
  return e >= 56320 && e <= 57343;
}
function lO(e) {
  return cO(e.charCodeAt(0));
}
function hO(e) {
  return fO(e.charCodeAt(e.length - 1));
}
function w5(e) {
  for (var t = [], n = 0; n < e.length; n++)
    e[n][1].length > 0 && t.push(e[n]);
  return t;
}
function Gf(e, t, n, r) {
  return hO(e) || lO(r) ? null : w5([
    [he, e],
    [ht, t],
    [ze, n],
    [he, r]
  ]);
}
function A5(e, t, n) {
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
      return Gf(v, y, b, f);
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
      return Gf(u, y, b, A);
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
      return Gf(v, y, b, A);
    }
  return null;
}
function Tr(e, t, n, r) {
  return io(e, t, n, r, !0);
}
Tr.INSERT = ze;
Tr.DELETE = ht;
Tr.EQUAL = he;
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2022 Joachim Wester
 * MIT licensed
 */
const O5 = Object.prototype.hasOwnProperty;
function E5(e, t) {
  return O5.call(e, t);
}
function S5(e) {
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
    E5(e, n) && t.push(n);
  return t;
}
function kr(e) {
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
function Gc(e) {
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
function x5(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
function Hc(e) {
  if (e === void 0)
    return !0;
  if (e) {
    if (Array.isArray(e)) {
      for (let n = 0, r = e.length; n < r; n++)
        if (Hc(e[n]))
          return !0;
    } else if (typeof e == "object") {
      const n = S5(e), r = n.length;
      for (var t = 0; t < r; t++)
        if (Hc(e[n[t]]))
          return !0;
    }
  }
  return !1;
}
function W_(e, t) {
  const n = [e];
  for (const r in t) {
    const i = typeof t[r] == "object" ? JSON.stringify(t[r], null, 2) : t[r];
    typeof i < "u" && n.push(`${r}: ${i}`);
  }
  return n.join(`
`);
}
class R5 extends Error {
  constructor(t, n, r, i, s) {
    super(W_(t, { name: n, index: r, operation: i, tree: s })), this.name = n, this.index = r, this.operation = i, this.tree = s, Object.setPrototypeOf(this, new.target.prototype), this.message = W_(t, { name: n, index: r, operation: i, tree: s });
  }
}
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2013-2021 Joachim Wester
 * MIT license
 */
const ae = R5, T5 = kr, pi = {
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
    let r = eu(n, this.path);
    r && (r = kr(r));
    const i = Pr(
      n,
      { op: "remove", path: this.from }
    ).removed;
    return Pr(n, { op: "add", path: this.path, value: i }), { newDocument: n, removed: r };
  },
  copy: function(e, t, n) {
    const r = eu(n, this.from);
    return Pr(
      n,
      { op: "add", path: this.path, value: kr(r) }
    ), { newDocument: n };
  },
  test: function(e, t, n) {
    return { newDocument: n, test: so(e[t], this.value) };
  },
  _get: function(e, t, n) {
    return this.value = e[t], { newDocument: n };
  }
};
var P5 = {
  add: function(e, t, n) {
    return Gc(t) ? e.splice(t, 0, this.value) : e[t] = this.value, { newDocument: n, index: t };
  },
  remove: function(e, t, n) {
    var r = e.splice(t, 1);
    return { newDocument: n, removed: r[0] };
  },
  replace: function(e, t, n) {
    var r = e[t];
    return e[t] = this.value, { newDocument: n, removed: r };
  },
  move: pi.move,
  copy: pi.copy,
  test: pi.test,
  _get: pi._get
};
function eu(e, t) {
  if (t == "")
    return e;
  var n = { op: "_get", path: t };
  return Pr(e, n), n.value;
}
function Pr(e, t, n = !1, r = !0, i = !0, s = 0) {
  if (n && (typeof n == "function" ? n(t, 0, e, t.path) : tu(t, 0)), t.path === "") {
    let o = { newDocument: e };
    if (t.op === "add")
      return o.newDocument = t.value, o;
    if (t.op === "replace")
      return o.newDocument = t.value, o.removed = e, o;
    if (t.op === "move" || t.op === "copy")
      return o.newDocument = eu(e, t.from), t.op === "move" && (o.removed = e), o;
    if (t.op === "test") {
      if (o.test = so(e, t.value), o.test === !1)
        throw new ae("Test operation failed", "TEST_OPERATION_FAILED", s, t, e);
      return o.newDocument = e, o;
    } else {
      if (t.op === "remove")
        return o.removed = e, o.newDocument = null, o;
      if (t.op === "_get")
        return t.value = e, o;
      if (n)
        throw new ae("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", s, t, e);
      return o;
    }
  } else {
    r || (e = kr(e));
    const a = (t.path || "").split("/");
    let u = e, f = 1, c = a.length, l, h, d;
    for (typeof n == "function" ? d = n : d = tu; ; ) {
      if (h = a[f], h && h.indexOf("~") != -1 && (h = x5(h)), i && (h == "__proto__" || h == "prototype" && f > 0 && a[f - 1] == "constructor"))
        throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");
      if (n && l === void 0 && (u[h] === void 0 ? l = a.slice(0, f).join("/") : f == c - 1 && (l = t.path), l !== void 0 && d(t, 0, e, l)), f++, Array.isArray(u)) {
        if (h === "-")
          h = u.length;
        else {
          if (n && !Gc(h))
            throw new ae("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", s, t, e);
          Gc(h) && (h = ~~h);
        }
        if (f >= c) {
          if (n && t.op === "add" && h > u.length)
            throw new ae("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", s, t, e);
          const _ = P5[t.op].call(t, u, h, e);
          if (_.test === !1)
            throw new ae("Test operation failed", "TEST_OPERATION_FAILED", s, t, e);
          return _;
        }
      } else if (f >= c) {
        const _ = pi[t.op].call(t, u, h, e);
        if (_.test === !1)
          throw new ae("Test operation failed", "TEST_OPERATION_FAILED", s, t, e);
        return _;
      }
      if (u = u[h], n && f < c && (!u || typeof u != "object"))
        throw new ae("Cannot perform operation at the desired path", "OPERATION_PATH_UNRESOLVABLE", s, t, e);
    }
  }
}
function pO(e, t, n, r = !0, i = !0) {
  if (n && !Array.isArray(t))
    throw new ae("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
  r || (e = kr(e));
  const s = new Array(t.length);
  for (let o = 0, a = t.length; o < a; o++)
    s[o] = Pr(e, t[o], n, !0, i, o), e = s[o].newDocument;
  return s.newDocument = e, s;
}
function N5(e, t, n) {
  const r = Pr(e, t);
  if (r.test === !1)
    throw new ae("Test operation failed", "TEST_OPERATION_FAILED", n, t, e);
  return r.newDocument;
}
function tu(e, t, n, r) {
  if (typeof e != "object" || e === null || Array.isArray(e))
    throw new ae("Operation is not an object", "OPERATION_NOT_AN_OBJECT", t, e, n);
  if (pi[e.op]) {
    if (typeof e.path != "string")
      throw new ae("Operation `path` property is not a string", "OPERATION_PATH_INVALID", t, e, n);
    if (e.path.indexOf("/") !== 0 && e.path.length > 0)
      throw new ae('Operation `path` property must start with "/"', "OPERATION_PATH_INVALID", t, e, n);
    if ((e.op === "move" || e.op === "copy") && typeof e.from != "string")
      throw new ae("Operation `from` property is not present (applicable in `move` and `copy` operations)", "OPERATION_FROM_REQUIRED", t, e, n);
    if ((e.op === "add" || e.op === "replace" || e.op === "test") && e.value === void 0)
      throw new ae("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_REQUIRED", t, e, n);
    if ((e.op === "add" || e.op === "replace" || e.op === "test") && Hc(e.value))
      throw new ae("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED", t, e, n);
    if (n) {
      if (e.op == "add") {
        var i = e.path.split("/").length, s = r.split("/").length;
        if (i !== s + 1 && i !== s)
          throw new ae("Cannot perform an `add` operation at the desired path", "OPERATION_PATH_CANNOT_ADD", t, e, n);
      } else if (e.op === "replace" || e.op === "remove" || e.op === "_get") {
        if (e.path !== r)
          throw new ae("Cannot perform the operation at a path that does not exist", "OPERATION_PATH_UNRESOLVABLE", t, e, n);
      } else if (e.op === "move" || e.op === "copy") {
        var o = { op: "_get", path: e.from, value: void 0 }, a = dO([o], n);
        if (a && a.name === "OPERATION_PATH_UNRESOLVABLE")
          throw new ae("Cannot perform the operation from a path that does not exist", "OPERATION_FROM_UNRESOLVABLE", t, e, n);
      }
    }
  } else throw new ae("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", t, e, n);
}
function dO(e, t, n) {
  try {
    if (!Array.isArray(e))
      throw new ae("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
    if (t)
      pO(kr(t), kr(e), n || !0);
    else {
      n = n || tu;
      for (var r = 0; r < e.length; r++)
        n(e[r], r, t, void 0);
    }
  } catch (i) {
    if (i instanceof ae)
      return i;
    throw i;
  }
}
function so(e, t) {
  if (e === t) return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    var n = Array.isArray(e), r = Array.isArray(t), i, s, o;
    if (n && r) {
      if (s = e.length, s != t.length) return !1;
      for (i = s; i-- !== 0; )
        if (!so(e[i], t[i])) return !1;
      return !0;
    }
    if (n != r) return !1;
    var a = Object.keys(e);
    if (s = a.length, s !== Object.keys(t).length)
      return !1;
    for (i = s; i-- !== 0; )
      if (!t.hasOwnProperty(a[i])) return !1;
    for (i = s; i-- !== 0; )
      if (o = a[i], !so(e[o], t[o])) return !1;
    return !0;
  }
  return e !== e && t !== t;
}
const tz = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JsonPatchError: ae,
  _areEquals: so,
  applyOperation: Pr,
  applyPatch: pO,
  applyReducer: N5,
  deepClone: T5,
  getValueByPointer: eu,
  validate: dO,
  validator: tu
}, Symbol.toStringTag, { value: "Module" }));
var Kc;
((e) => {
  function t(s = {}, o = {}, a = !1) {
    typeof s != "object" && (s = {}), typeof o != "object" && (o = {});
    let u = bu(o);
    a || (u = Object.keys(u).reduce((f, c) => (u[c] != null && (f[c] = u[c]), f), {}));
    for (const f in s)
      s[f] !== void 0 && o[f] === void 0 && (u[f] = s[f]);
    return Object.keys(u).length > 0 ? u : void 0;
  }
  e.compose = t;
  function n(s = {}, o = {}) {
    typeof s != "object" && (s = {}), typeof o != "object" && (o = {});
    const a = Object.keys(s).concat(Object.keys(o)).reduce((u, f) => (gi(s[f], o[f]) || (u[f] = o[f] === void 0 ? null : o[f]), u), {});
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
})(Kc || (Kc = {}));
const xr = Kc;
var Yc;
((e) => {
  function t(n) {
    return typeof n.delete == "number" ? n.delete : typeof n.retain == "number" ? n.retain : typeof n.retain == "object" && n.retain !== null ? 1 : typeof n.insert == "string" ? n.insert.length : 1;
  }
  e.length = t;
})(Yc || (Yc = {}));
const Gt = Yc;
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
      const r = this.offset, i = Gt.length(n);
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
    return this.ops[this.index] ? Gt.length(this.ops[this.index]) - this.offset : 1 / 0;
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
const $5 = "\0", q_ = (e, t) => {
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
class Ne {
  static Op = Gt;
  static OpIterator = Rt;
  static AttributeMap = xr;
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
    if (t = bu(t), typeof r == "object") {
      if (typeof t.delete == "number" && typeof r.delete == "number")
        return this.ops[n - 1] = { delete: r.delete + t.delete }, this;
      if (typeof r.delete == "number" && t.insert != null && (n -= 1, r = this.ops[n - 1], typeof r != "object"))
        return this.ops.unshift(t), this;
      if (gi(t.attributes, r.attributes)) {
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
    return this.reduce((t, n) => n.insert ? t + Gt.length(n) : n.delete ? t - n.delete : t, 0);
  }
  length() {
    return this.reduce((t, n) => t + Gt.length(n), 0);
  }
  slice(t = 0, n = 1 / 0) {
    const r = [], i = new Rt(this.ops);
    let s = 0;
    for (; s < n && i.hasNext(); ) {
      let o;
      s < t ? o = i.next(t - s) : (o = i.next(n - s), r.push(o)), s += Gt.length(o);
    }
    return new Ne(r);
  }
  compose(t) {
    const n = new Rt(this.ops), r = new Rt(t.ops), i = [], s = r.peek();
    if (s != null && typeof s.retain == "number" && s.attributes == null) {
      let a = s.retain;
      for (; n.peekType() === "insert" && n.peekLength() <= a; )
        a -= n.peekLength(), i.push(n.next());
      s.retain - a > 0 && r.next(s.retain - a);
    }
    const o = new Ne(i);
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
            const h = u.retain == null ? "insert" : "retain", [d, _, v] = q_(
              u[h],
              f.retain
            ), g = Ne.getHandler(d);
            c[h] = {
              [d]: g.compose(
                _,
                v,
                h === "retain"
              )
            };
          }
          const l = xr.compose(
            u.attributes,
            f.attributes,
            typeof u.retain == "number"
          );
          if (l && (c.attributes = l), o.push(c), !r.hasNext() && gi(o.ops[o.ops.length - 1], c)) {
            const h = new Ne(n.rest());
            return o.concat(h).chop();
          }
        } else typeof f.delete == "number" && (typeof u.retain == "number" || typeof u.retain == "object" && u.retain !== null) && o.push(f);
      }
    return o.chop();
  }
  concat(t) {
    const n = new Ne(this.ops.slice());
    return t.ops.length > 0 && (n.push(t.ops[0]), n.ops = n.ops.concat(t.ops.slice(1))), n;
  }
  diff(t, n) {
    if (this.ops === t.ops)
      return new Ne();
    const r = [this, t].map((u) => u.map((f) => {
      if (f.insert != null)
        return typeof f.insert == "string" ? f.insert : $5;
      const c = u === t ? "on" : "with";
      throw new Error("diff() called " + c + " non-document");
    }).join("")), i = new Ne(), s = Tr(r[0], r[1], n, !0), o = new Rt(this.ops), a = new Rt(t.ops);
    return s.forEach((u) => {
      let f = u[1].length;
      for (; f > 0; ) {
        let c = 0;
        switch (u[0]) {
          case Tr.INSERT:
            c = Math.min(a.peekLength(), f), i.push(a.next(c));
            break;
          case Tr.DELETE:
            c = Math.min(f, o.peekLength()), o.next(c), i.delete(c);
            break;
          case Tr.EQUAL:
            c = Math.min(
              o.peekLength(),
              a.peekLength(),
              f
            );
            const l = o.next(c), h = a.next(c);
            gi(l.insert, h.insert) ? i.retain(
              c,
              xr.diff(l.attributes, h.attributes)
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
    let i = new Ne(), s = 0;
    for (; r.hasNext(); ) {
      if (r.peekType() !== "insert")
        return;
      const o = r.peek(), a = Gt.length(o) - r.peekLength(), u = typeof o.insert == "string" ? o.insert.indexOf(n, a) - a : -1;
      if (u < 0)
        i.push(r.next());
      else if (u > 0)
        i.push(r.next(u));
      else {
        if (t(i, r.next(1).attributes || {}, s) === !1)
          return;
        s += 1, i = new Ne();
      }
    }
    i.length() > 0 && t(i, {}, s);
  }
  invert(t) {
    const n = new Ne();
    return this.reduce((r, i) => {
      if (i.insert)
        n.delete(Gt.length(i));
      else {
        if (typeof i.retain == "number" && i.attributes == null)
          return n.retain(i.retain), r + i.retain;
        if (i.delete || typeof i.retain == "number") {
          const s = i.delete || i.retain;
          return t.slice(r, r + s).forEach((a) => {
            i.delete ? n.push(a) : i.retain && i.attributes && n.retain(
              Gt.length(a),
              xr.invert(i.attributes, a.attributes)
            );
          }), r + s;
        } else if (typeof i.retain == "object" && i.retain !== null) {
          const s = t.slice(r, r + 1), o = new Rt(s.ops).next(), [a, u, f] = q_(
            i.retain,
            o.insert
          ), c = Ne.getHandler(a);
          return n.retain(
            { [a]: c.invert(u, f) },
            xr.invert(i.attributes, o.attributes)
          ), r + 1;
        }
      }
      return r;
    }, 0), n.chop();
  }
  transform(t, n = !1) {
    if (n = !!n, typeof t == "number")
      return this.transformPosition(t, n);
    const r = t, i = new Rt(this.ops), s = new Rt(r.ops), o = new Ne();
    for (; i.hasNext() || s.hasNext(); )
      if (i.peekType() === "insert" && (n || s.peekType() !== "insert"))
        o.retain(Gt.length(i.next()));
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
              const _ = Ne.getHandler(d);
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
            xr.transform(
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
const nz = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AttributeMap: xr,
  Delta: Ne,
  Op: Gt,
  OpIterator: Rt,
  default: Ne
}, Symbol.toStringTag, { value: "Module" }));
export {
  Ap as AT_TARGET,
  yO as BUBBLING_PHASE,
  gO as CAPTURING_PHASE,
  j5 as Callbacks,
  at as Color,
  Xc as Emitter4Event,
  M5 as Event,
  Te as EventEmitter,
  D5 as EventEmitter4,
  nu as EventPhase,
  Ai as EventPropagation,
  Ai as EventTarget,
  p5 as HookType,
  k5 as Immutable,
  H_ as NONE,
  QA as Options,
  ez as PluginService,
  F5 as PriorityQueue,
  nz as QuillDelta,
  L5 as Signals,
  U5 as antvUtil,
  Q5 as colord,
  Y5 as compose,
  no as deepmerge,
  Wc as fastDeepEqual,
  Tr as fastDiff,
  tz as fastJsonPatch,
  zB as hexToRgb,
  J5 as hslToHsv,
  D_ as hslToRgb,
  Z5 as hsvToHsl,
  BB as hsvToRgb,
  V5 as immer,
  UB as lerpColor,
  z5 as lodash,
  I5 as mitt,
  H5 as mobx,
  C5 as observable,
  B5 as radash,
  W5 as reactivity,
  G5 as redux,
  FB as rgbToHsl,
  X5 as rgbToHsv,
  q5 as signals,
  K5 as tapable
};
