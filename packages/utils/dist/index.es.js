var PA = Object.prototype.hasOwnProperty, je = "~";
function yo() {
}
Object.create && (yo.prototype = /* @__PURE__ */ Object.create(null), new yo().__proto__ || (je = !1));
function IA(e, t, n) {
  this.fn = e, this.context = t, this.once = n || !1;
}
function p_(e, t, n, r, i) {
  if (typeof n != "function")
    throw new TypeError("The listener must be a function");
  var o = new IA(n, r || e, i), s = je ? je + t : t;
  return e._events[s] ? e._events[s].fn ? e._events[s] = [e._events[s], o] : e._events[s].push(o) : (e._events[s] = o, e._eventsCount++), e;
}
function Js(e, t) {
  --e._eventsCount === 0 ? e._events = new yo() : delete e._events[t];
}
function xe() {
  this._events = new yo(), this._eventsCount = 0;
}
xe.prototype.eventNames = function() {
  var t = [], n, r;
  if (this._eventsCount === 0) return t;
  for (r in n = this._events)
    PA.call(n, r) && t.push(je ? r.slice(1) : r);
  return Object.getOwnPropertySymbols ? t.concat(Object.getOwnPropertySymbols(n)) : t;
};
xe.prototype.listeners = function(t) {
  var n = je ? je + t : t, r = this._events[n];
  if (!r) return [];
  if (r.fn) return [r.fn];
  for (var i = 0, o = r.length, s = new Array(o); i < o; i++)
    s[i] = r[i].fn;
  return s;
};
xe.prototype.listenerCount = function(t) {
  var n = je ? je + t : t, r = this._events[n];
  return r ? r.fn ? 1 : r.length : 0;
};
xe.prototype.emit = function(t, n, r, i, o, s) {
  var a = je ? je + t : t;
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
        return u.fn.call(u.context, n, r, i, o), !0;
      case 6:
        return u.fn.call(u.context, n, r, i, o, s), !0;
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
xe.prototype.on = function(t, n, r) {
  return p_(this, t, n, r, !1);
};
xe.prototype.once = function(t, n, r) {
  return p_(this, t, n, r, !0);
};
xe.prototype.removeListener = function(t, n, r, i) {
  var o = je ? je + t : t;
  if (!this._events[o]) return this;
  if (!n)
    return Js(this, o), this;
  var s = this._events[o];
  if (s.fn)
    s.fn === n && (!i || s.once) && (!r || s.context === r) && Js(this, o);
  else {
    for (var a = 0, u = [], f = s.length; a < f; a++)
      (s[a].fn !== n || i && !s[a].once || r && s[a].context !== r) && u.push(s[a]);
    u.length ? this._events[o] = u.length === 1 ? u[0] : u : Js(this, o);
  }
  return this;
};
xe.prototype.removeAllListeners = function(t) {
  var n;
  return t ? (n = je ? je + t : t, this._events[n] && Js(this, n)) : (this._events = new yo(), this._eventsCount = 0), this;
};
xe.prototype.off = xe.prototype.removeListener;
xe.prototype.addListener = xe.prototype.on;
xe.prefixed = je;
xe.EventEmitter = xe;
const ja = {
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3
}, d_ = ja.NONE, CA = ja.CAPTURING_PHASE, Xh = ja.AT_TARGET, DA = ja.BUBBLING_PHASE;
class NB {
  static create(t, n, r) {
    return new this(t, n, r);
  }
  type = "none";
  parentNode = null;
  target = null;
  currentTarget = null;
  data = null;
  eventPhase = d_;
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
      n.push(t), t = t.parentNode;
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
function Jh(e) {
  return (typeof e == "boolean" || !e) && (e = {
    capture: !!e
  }), e = { capture: !1, once: !1, ...e || {} }, e;
}
function Zh(e, t) {
  var n = e._events[t], r;
  if (!n) return [];
  if (n.fn) return [n];
  for (var i = 0, o = n.length, r = new Array(o); i < o; i++)
    r[i] = n[i];
  return r;
}
class ui {
  parentNode = null;
  _bubble_emitter = new xe();
  _capture_emitter = new xe();
  addEventListener(t, n, r) {
    r = Jh(r);
    const i = r.capture ? this._capture_emitter : this._bubble_emitter;
    r && r.once ? i.once(t, n) : i.on(t, n);
  }
  removeEventListener(t, n, r) {
    r = Jh(r), (r.capture ? this._capture_emitter : this._bubble_emitter).off(t, n);
  }
  /**
   * 
   * @param {Event} e 
   */
  dispatchEvent(t) {
    t.currentTarget = this;
    const n = t.type, r = t.composedPath(), i = r.length;
    for (let o = i - 1; o >= 0; o--) {
      const s = r[o]._capture_emitter;
      if (s.listenerCount(n) > 0) {
        t.target = r[o], t.eventPhase = t.target !== this ? CA : Xh;
        const u = Zh(s, n);
        for (let f = 0, c = u.length; f < c; f++) {
          const l = u[f];
          if (l.once && s.removeListener(n, l.fn, l.context, l.once), l.fn(t), t.immediateCancelBubble)
            break;
        }
      }
      if (t.cancelBubble)
        break;
    }
    if (!t.cancelBubble)
      for (let o = 0; o < i; o++) {
        const s = r[o]._bubble_emitter;
        if (s.listenerCount(n) > 0) {
          t.target = r[o], t.eventPhase = t.target !== this ? DA : Xh;
          const u = Zh(s, n);
          for (let f = 0, c = u.length; f < c; f++) {
            const l = u[f];
            if (l.once && s.removeListener(n, l.fn, l.context, l.once), l.fn(t), t.immediateCancelBubble)
              break;
          }
        }
        if (t.cancelBubble || !t.bubbles)
          break;
      }
    return t.eventPhase = d_, !t.defaultPrevented;
  }
  removeAllListeners() {
    this._bubble_emitter.removeAllListeners(), this._capture_emitter.removeAllListeners();
  }
}
ui.prototype.on = ui.prototype.addEventListener;
ui.prototype.off = ui.prototype.removeEventListener;
ui.prototype.emit = ui.prototype.dispatchEvent;
function MB(e) {
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
function Qh(e, t, n, r, i, o) {
  let s = Object.assign({
    once: !1,
    stage: 1 / 0
  }, o);
  e[t] || (e[t] = /* @__PURE__ */ Object.create(null));
  let a = e[t], u = a[r];
  if (u || (u = [], a[r] = u), u.some((l) => l.handle === i))
    return;
  let f = {
    handle: i,
    once: s.once,
    namespace: s.namespace,
    stage: s.stage
  }, c = -1;
  if (s.stage !== 1 / 0 && (c = u.findIndex((l) => l.handle < f.handle)), c !== -1 ? u.splice(c, 0, f) : u.push(f), s.namespace) {
    let l = e[n];
    l || (l = e[n] = /* @__PURE__ */ new Map());
    let h = l.get(s.namespace);
    h || l.set(s.namespace, /* @__PURE__ */ new Map()), h = l.get(s.namespace), h.has(r) ? h.set(r, h.get(r) + 1) : h.set(r, 1);
  }
}
function bo(e, t, n, r, i, o) {
  if (e[t]) {
    if (!r && !i) {
      e[t] = void 0, delete e[t];
      return;
    } else if (!r && i) {
      let s = e[n];
      if (!s || !s.has(i))
        return;
      s.get(i).forEach((u, f) => {
        bo(e, t, n, f, void 0, o);
      }), s.delete(i);
    } else if (r) {
      let s = e[t], a = s[r];
      a && (s[r] = a.filter((u) => {
        if ((!o || u.handle === o) && (!i || u.namespace === i)) {
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
function LA(e, t, n, r, ...i) {
  if (!e[t])
    return;
  let s = e[t][r];
  if (s)
    for (let a = 0; a < s.length; a++) {
      const u = s[a];
      u.handle(...i), u.once && bo(e, t, n, r, null, u.handle);
    }
}
function ep(e, t, n) {
  let r = e[t];
  return r ? r[n] || [] : [];
}
function FA(e, t, n) {
  e[t] = void 0, e[n] = void 0;
}
function jA(e, t, n) {
  let r = e[t];
  if (!r)
    return !1;
  let i = r[n];
  return i ? i.length > 0 : !1;
}
function BA(e) {
  if (!e._listeners)
    return [];
  let t = e._listeners;
  return Object.keys(t);
}
function zA(e, t, n, r, i) {
  i.currentTarget = e;
  const o = i.type, s = i.composedPath(e), a = s.length;
  for (let u = a - 1; u >= 0; u--) {
    const f = s[u];
    i.target = s[u], i.eventPhase = i.target !== e ? Xr.CAPTURING_PHASE : Xr.AT_TARGET;
    const c = ep(f, n, o);
    for (let l = 0, h = c.length; l < h; l++) {
      const d = c[l];
      if (d.once && bo(e, n, r, o, null, d.handle), d.handle(i), i.immediateCancelBubble)
        break;
    }
    if (i.cancelBubble)
      break;
  }
  if (!i.cancelBubble)
    for (let u = 0; u < a; u++) {
      const f = s[u];
      i.target = s[u], i.eventPhase = i.target !== e ? Xr.BUBBLING_PHASE : Xr.AT_TARGET;
      const c = ep(f, t, o);
      for (let l = 0, h = c.length; l < h; l++) {
        const d = c[l];
        if (d.once && bo(e, t, r, o, null, d.handle), d.handle(i), i.immediateCancelBubble)
          break;
      }
      if (i.cancelBubble || !i.bubbles)
        break;
    }
  return i.eventPhase = Xr.NONE, !i.defaultPrevented;
}
const Xr = {
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3
};
class Sc {
  static create(t, n) {
    return new Sc(t);
  }
  type;
  target = null;
  currentTarget = null;
  data = null;
  eventPhase = Xr.NONE;
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
const Gr = "_listeners", tp = "_listeners_capture", Hr = "_listenersNs";
class PB {
  parent;
  _listeners;
  _listenersNs;
  on(t, n, r) {
    return r && r.capture ? Qh(this, tp, Hr, t, n, r) : Qh(this, Gr, Hr, t, n, r), this;
  }
  emit(t, ...n) {
    return LA(this, Gr, Hr, t, ...n), this;
  }
  createEvent(t, n) {
    return Sc.create(t, n);
  }
  emitBubble(t) {
    return zA(this, Gr, tp, Hr, t);
  }
  off(t, n, r) {
    return bo(this, Gr, Hr, t, r ? r.namespace : null, n), this;
  }
  eventNames() {
    return BA(this);
  }
  hasEventListener(t) {
    return jA(this, Gr, t);
  }
  removeAllListeners() {
    return FA(this, Gr, Hr), this;
  }
}
const __ = (e) => !!Symbol[e], xc = (e) => __(e) ? Symbol[e] : "@@" + e, UA = xc("iterator"), xf = xc("observable"), v_ = xc("species");
function aa(e, t) {
  let n = e[t];
  if (n != null) {
    if (typeof n != "function")
      throw new TypeError(n + " is not a function");
    return n;
  }
}
function Xi(e) {
  let t = e.constructor;
  return t !== void 0 && (t = t[v_], t === null && (t = void 0)), t !== void 0 ? t : Oe;
}
function VA(e) {
  return e instanceof Oe;
}
function fi(e) {
  fi.log ? fi.log(e) : setTimeout(() => {
    throw e;
  });
}
function Zs(e) {
  Promise.resolve().then(() => {
    try {
      e();
    } catch (t) {
      fi(t);
    }
  });
}
function g_(e) {
  let t = e._cleanup;
  if (t !== void 0 && (e._cleanup = void 0, !!t))
    try {
      if (typeof t == "function")
        t();
      else {
        let n = aa(t, "unsubscribe");
        n && n.call(t);
      }
    } catch (n) {
      fi(n);
    }
}
function Rf(e) {
  e._observer = void 0, e._queue = void 0, e._state = "closed";
}
function qA(e) {
  let t = e._queue;
  if (t) {
    e._queue = void 0, e._state = "ready";
    for (let n = 0; n < t.length && (y_(e, t[n].type, t[n].value), e._state !== "closed"); ++n)
      ;
  }
}
function y_(e, t, n) {
  e._state = "running";
  let r = e._observer;
  try {
    let i = aa(r, t);
    switch (t) {
      case "next":
        i && i.call(r, n);
        break;
      case "error":
        if (Rf(e), i) i.call(r, n);
        else throw n;
        break;
      case "complete":
        Rf(e), i && i.call(r);
        break;
    }
  } catch (i) {
    fi(i);
  }
  e._state === "closed" ? g_(e) : e._state === "running" && (e._state = "ready");
}
function Zu(e, t, n) {
  if (e._state !== "closed") {
    if (e._state === "buffering") {
      e._queue.push({ type: t, value: n });
      return;
    }
    if (e._state !== "ready") {
      e._state = "buffering", e._queue = [{ type: t, value: n }], Zs(() => qA(e));
      return;
    }
    y_(e, t, n);
  }
}
class WA {
  constructor(t, n) {
    this._cleanup = void 0, this._observer = t, this._queue = void 0, this._state = "initializing";
    let r = this, i = {
      get closed() {
        return r._state === "closed";
      },
      next(o) {
        Zu(r, "next", o);
      },
      error(o) {
        Zu(r, "error", o);
      },
      complete() {
        Zu(r, "complete");
      }
    };
    try {
      this._cleanup = n.call(void 0, i);
    } catch (o) {
      i.error(o);
    }
    this._state === "initializing" && (this._state = "ready");
  }
  get closed() {
    return this._state === "closed";
  }
  unsubscribe() {
    this._state !== "closed" && (Rf(this), g_(this));
  }
}
class Oe {
  constructor(t) {
    if (!(this instanceof Oe))
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
    }), new WA(t, this._subscriber);
  }
  forEach(t) {
    return new Promise((n, r) => {
      if (typeof t != "function") {
        r(new TypeError(t + " is not a function"));
        return;
      }
      function i() {
        o.unsubscribe(), n();
      }
      let o = this.subscribe({
        next(s) {
          try {
            t(s, i);
          } catch (a) {
            r(a), o.unsubscribe();
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
    let n = Xi(this);
    return new n((r) => this.subscribe({
      next(i) {
        try {
          i = t(i);
        } catch (o) {
          return r.error(o);
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
    let n = Xi(this);
    return new n((r) => this.subscribe({
      next(i) {
        try {
          if (!t(i)) return;
        } catch (o) {
          return r.error(o);
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
    let n = Xi(this), r = arguments.length > 1, i = !1, s = arguments[1];
    return new n((a) => this.subscribe({
      next(u) {
        let f = !i;
        if (i = !0, !f || r)
          try {
            s = t(s, u);
          } catch (c) {
            return a.error(c);
          }
        else
          s = u;
      },
      error(u) {
        a.error(u);
      },
      complete() {
        if (!i && !r)
          return a.error(new TypeError("Cannot reduce an empty sequence"));
        a.next(s), a.complete();
      }
    }));
  }
  async all() {
    let t = [];
    return await this.forEach((n) => t.push(n)), t;
  }
  concat(...t) {
    let n = Xi(this);
    return new n((r) => {
      let i, o = 0;
      function s(a) {
        i = a.subscribe({
          next(u) {
            r.next(u);
          },
          error(u) {
            r.error(u);
          },
          complete() {
            o === t.length ? (i = void 0, r.complete()) : s(n.from(t[o++]));
          }
        });
      }
      return s(this), () => {
        i && (i.unsubscribe(), i = void 0);
      };
    });
  }
  flatMap(t) {
    if (typeof t != "function")
      throw new TypeError(t + " is not a function");
    let n = Xi(this);
    return new n((r) => {
      let i = [], o = this.subscribe({
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
              f >= 0 && i.splice(f, 1), s();
            }
          });
          i.push(u);
        },
        error(a) {
          r.error(a);
        },
        complete() {
          s();
        }
      });
      function s() {
        o.closed && i.length === 0 && r.complete();
      }
      return () => {
        i.forEach((a) => a.unsubscribe()), o.unsubscribe();
      };
    });
  }
  [xf]() {
    return this;
  }
  static from(t) {
    let n = typeof this == "function" ? this : Oe;
    if (t == null)
      throw new TypeError(t + " is not an object");
    let r = aa(t, xf);
    if (r) {
      let i = r.call(t);
      if (Object(i) !== i)
        throw new TypeError(i + " is not an object");
      return VA(i) && i.constructor === n ? i : new n((o) => i.subscribe(o));
    }
    if (__("iterator") && (r = aa(t, UA), r))
      return new n((i) => {
        Zs(() => {
          if (!i.closed) {
            for (let o of r.call(t))
              if (i.next(o), i.closed) return;
            i.complete();
          }
        });
      });
    if (Array.isArray(t))
      return new n((i) => {
        Zs(() => {
          if (!i.closed) {
            for (let o = 0; o < t.length; ++o)
              if (i.next(t[o]), i.closed) return;
            i.complete();
          }
        });
      });
    throw new TypeError(t + " is not observable");
  }
  static of(...t) {
    let n = typeof this == "function" ? this : Oe;
    return new n((r) => {
      Zs(() => {
        if (!r.closed) {
          for (let i = 0; i < t.length; ++i)
            if (r.next(t[i]), r.closed) return;
          r.complete();
        }
      });
    });
  }
  static get [v_]() {
    return this;
  }
}
Object.defineProperty(Oe, Symbol("extensions"), {
  value: {
    symbol: xf,
    hostReportError: fi
  },
  configurable: !0
});
function kA(...e) {
  return new Oe((t) => {
    if (e.length === 0)
      return Oe.from([]);
    let n = e.length, r = e.map((i) => Oe.from(i).subscribe({
      next(o) {
        t.next(o);
      },
      error(o) {
        t.error(o);
      },
      complete() {
        --n === 0 && t.complete();
      }
    }));
    return () => r.forEach((i) => i.unsubscribe());
  });
}
function GA(...e) {
  return new Oe((t) => {
    if (e.length === 0)
      return Oe.from([]);
    let n = e.length, r = /* @__PURE__ */ new Set(), i = !1, o = e.map(() => {
    }), s = e.map((a, u) => Oe.from(a).subscribe({
      next(f) {
        if (o[u] = f, !i) {
          if (r.add(u), r.size !== e.length)
            return;
          r = null, i = !0;
        }
        t.next(Array.from(o));
      },
      error(f) {
        t.error(f);
      },
      complete() {
        --n === 0 && t.complete();
      }
    }));
    return () => s.forEach((a) => a.unsubscribe());
  });
}
function HA(...e) {
  return new Oe((t) => {
    if (e.length === 0)
      return Oe.from([]);
    let n = e.map(() => []);
    function r() {
      return n.some((o, s) => o.length === 0 && i[s].closed);
    }
    let i = e.map((o, s) => Oe.from(o).subscribe({
      next(a) {
        n[s].push(a), n.every((u) => u.length > 0) && (t.next(n.map((u) => u.shift())), r() && t.complete());
      },
      error(a) {
        t.error(a);
      },
      complete() {
        r() && t.complete();
      }
    }));
    return () => i.forEach((o) => o.unsubscribe());
  });
}
const IB = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Observable: Oe,
  combineLatest: GA,
  merge: kA,
  zip: HA
}, Symbol.toStringTag, { value: "Module" }));
class CB {
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
class DB {
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
      let o = t;
      if (r < n && this.compare(this.heap[r], this.heap[o]) < 0 && (o = r), i < n && this.compare(this.heap[i], this.heap[o]) < 0 && (o = i), o === t) break;
      this.swap(t, o), t = o;
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
const b_ = (e) => !!e && e.constructor === Symbol, mo = Array.isArray, Rc = (e) => !!e && e.constructor === Object, m_ = (e) => e == null || typeof e != "object" && typeof e != "function", Go = (e) => !!(e && e.constructor && e.call && e.apply), KA = (e) => typeof e == "string" || e instanceof String, YA = (e) => ti(e) && e % 1 === 0, XA = (e) => ti(e) && e % 1 !== 0, ti = (e) => {
  try {
    return Number(e) === e;
  } catch {
    return !1;
  }
}, w_ = (e) => Object.prototype.toString.call(e) === "[object Date]", A_ = (e) => !(!e || !e.then || !Go(e.then)), JA = (e) => {
  if (e === !0 || e === !1 || e == null) return !0;
  if (ti(e)) return e === 0;
  if (w_(e)) return isNaN(e.getTime());
  if (Go(e) || b_(e)) return !1;
  const t = e.length;
  if (ti(t)) return t === 0;
  const n = e.size;
  return ti(n) ? n === 0 : Object.keys(e).length === 0;
}, O_ = (e, t) => {
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
    if (!Reflect.has(t, n[i]) || !O_(e[n[i]], t[n[i]])) return !1;
  return !0;
}, ZA = (e, t) => e.reduce((n, r) => {
  const i = t(r);
  return n[i] || (n[i] = []), n[i].push(r), n;
}, {});
function QA(...e) {
  return !e || !e.length ? [] : new Array(Math.max(...e.map(({ length: t }) => t))).fill([]).map((t, n) => e.map((r) => r[n]));
}
function eO(e, t) {
  if (!e || !e.length)
    return {};
  const n = Go(t) ? t : mo(t) ? (r, i) => t[i] : (r, i) => t;
  return e.reduce((r, i, o) => (r[i] = n(i, o), r), {});
}
const Tc = (e, t) => !e || (e.length ?? 0) === 0 ? null : e.reduce(t);
function tO(e, t) {
  return (e || []).reduce((n, r) => n + (t ? t(r) : r), 0);
}
const nO = (e, t = void 0) => e?.length > 0 ? e[0] : t, rO = (e, t = void 0) => e?.length > 0 ? e[e.length - 1] : t, E_ = (e, t, n = !1) => {
  if (!e) return [];
  const r = (o, s) => t(o) - t(s), i = (o, s) => t(s) - t(o);
  return e.slice().sort(n === !0 ? i : r);
}, iO = (e, t, n = "asc") => {
  if (!e) return [];
  const r = (o, s) => `${t(o)}`.localeCompare(t(s)), i = (o, s) => `${t(s)}`.localeCompare(t(o));
  return e.slice().sort(n === "desc" ? i : r);
}, oO = (e, t) => e ? e.reduce((n, r) => {
  const i = t(r);
  return n[i] = (n[i] ?? 0) + 1, n;
}, {}) : {}, sO = (e, t, n) => {
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
}, S_ = (e, t, n = (r) => r) => e.reduce((r, i) => (r[t(i)] = n(i), r), {}), aO = (e, t, n) => e ? e.reduce((r, i, o) => (n(i, o) && r.push(t(i, o)), r), []) : [];
function uO(e, t) {
  const n = t ?? ((r) => r);
  return Tc(e, (r, i) => n(r) > n(i) ? r : i);
}
function fO(e, t) {
  const n = t ?? ((r) => r);
  return Tc(e, (r, i) => n(r) < n(i) ? r : i);
}
const cO = (e, t = 2) => {
  const n = Math.ceil(e.length / t);
  return new Array(n).fill(null).map((r, i) => e.slice(i * t, i * t + t));
}, lO = (e, t) => {
  const n = e.reduce((r, i) => {
    const o = t ? t(i) : i;
    return r[o] || (r[o] = i), r;
  }, {});
  return Object.values(n);
};
function* $c(e, t, n = (i) => i, r = 1) {
  const i = Go(n) ? n : () => n, o = t ? e : 0, s = t ?? e;
  for (let a = o; a <= s && (yield i(a), !(a + r > s)); a += r)
    ;
}
const Nc = (e, t, n, r) => Array.from($c(e, t, n, r)), hO = (e) => e.reduce((t, n) => (t.push(...n), t), []), pO = (e, t, n) => {
  if (!e || !t) return !1;
  const r = n ?? ((o) => o), i = t.reduce((o, s) => (o[r(s)] = !0, o), {});
  return e.some((o) => i[r(o)]);
}, x_ = (e, t) => e ? e.reduce(
  (n, r) => {
    const [i, o] = n;
    return t(r) ? [[...i, r], o] : [i, [...o, r]];
  },
  [[], []]
) : [[], []], dO = (e, t, n) => !t && !e ? [] : t ? e ? n ? e.reduce((r, i) => {
  const o = t.find((s) => n(i) === n(s));
  return o ? r.push(o) : r.push(i), r;
}, []) : e : [] : e, _O = (e, t, n) => {
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
}, vO = (e, t, n, r) => {
  if (!e && !t) return [];
  if (!e) return [t];
  if (!t) return [...e];
  const i = n ? (a, u) => n(a, u) === n(t, u) : (a) => a === t;
  return e.find(i) ? e.filter((a, u) => !i(a, u)) : (r?.strategy ?? "append") === "append" ? [...e, t] : [t, ...e];
}, gO = (e) => e?.filter((t) => !!t) ?? [], R_ = (e, t, n) => {
  let r = n;
  for (let i = 1; i <= e; i++)
    r = t(r, i);
  return r;
}, yO = (e, t, n = (r) => r) => {
  if (!e?.length && !t?.length) return [];
  if (e?.length === void 0) return [...t];
  if (!t?.length) return [...e];
  const r = t.reduce((i, o) => (i[n(o)] = !0, i), {});
  return e.filter((i) => !r[n(i)]);
};
function bO(e, t) {
  if (e.length === 0) return e;
  const n = t % e.length;
  return n === 0 ? e : [...e.slice(-n, e.length), ...e.slice(0, -n)];
}
const mO = async (e, t, n) => {
  const r = n !== void 0;
  if (!r && e?.length < 1)
    throw new Error("Cannot reduce empty array with no init value");
  const i = r ? e : e.slice(1);
  let o = r ? n : e[0];
  for (const [s, a] of i.entries())
    o = await t(o, a, s);
  return o;
}, wO = async (e, t) => {
  if (!e) return [];
  let n = [], r = 0;
  for (const i of e) {
    const o = await t(i, r++);
    n.push(o);
  }
  return n;
}, AO = async (e) => {
  const t = [], n = (o, s) => t.push({
    fn: o,
    rethrow: s?.rethrow ?? !1
  }), [r, i] = await ci(e)(n);
  for (const { fn: o, rethrow: s } of t) {
    const [a] = await ci(o)(r);
    if (a && s) throw a;
  }
  if (r) throw r;
  return i;
};
class T_ extends Error {
  errors;
  constructor(t = []) {
    super();
    const n = t.find((r) => r.name)?.name ?? "";
    this.name = `AggregateError(${n}...)`, this.message = `AggregateError with ${t.length} errors`, this.stack = t.find((r) => r.stack)?.stack ?? this.stack, this.errors = t;
  }
}
const OO = async (e, t, n) => {
  const r = t.map((f, c) => ({
    index: c,
    item: f
  })), i = async (f) => {
    const c = [];
    for (; ; ) {
      const l = r.pop();
      if (!l) return f(c);
      const [h, d] = await ci(n)(l.item);
      c.push({
        error: h,
        result: d,
        index: l.index
      });
    }
  }, o = Nc(1, e).map(() => new Promise(i)), s = await Promise.all(o), [a, u] = x_(
    E_(s.flat(), (f) => f.index),
    (f) => !!f.error
  );
  if (a.length > 0)
    throw new T_(a.map((f) => f.error));
  return u.map((f) => f.result);
};
async function EO(e) {
  const t = mo(e) ? e.map((i) => [null, i]) : Object.entries(e), n = await Promise.all(
    t.map(
      ([i, o]) => o.then((s) => ({ result: s, exc: null, key: i })).catch((s) => ({ result: null, exc: s, key: i }))
    )
  ), r = n.filter((i) => i.exc);
  if (r.length > 0)
    throw new T_(r.map((i) => i.exc));
  return mo(e) ? n.map((i) => i.result) : n.reduce(
    (i, o) => ({
      ...i,
      [o.key]: o.result
    }),
    {}
  );
}
const SO = async (e, t) => {
  const n = e?.times ?? 3, r = e?.delay, i = e?.backoff ?? null;
  for (const o of $c(1, n)) {
    const [s, a] = await ci(t)((u) => {
      throw { _exited: u };
    });
    if (!s) return a;
    if (s._exited) throw s._exited;
    if (o === n) throw s;
    r && await Tf(r), i && await Tf(i(o));
  }
}, Tf = (e) => new Promise((t) => setTimeout(t, e)), ci = (e) => (...t) => {
  try {
    const n = e(...t);
    return A_(n) ? n.then((r) => [void 0, r]).catch((r) => [r, void 0]) : [void 0, n];
  } catch (n) {
    return [n, void 0];
  }
}, xO = (e, t) => {
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
function RO(...e) {
  return (...t) => e.slice(1).reduce((n, r) => r(n), e[0](...t));
}
function TO(...e) {
  return e.reverse().reduce((t, n) => n(t));
}
const $O = (e, ...t) => (...n) => e(...t, ...n), NO = (e, t) => (n) => e({
  ...t,
  ...n
}), MO = (e) => new Proxy(
  {},
  {
    get: (t, n) => e(n)
  }
), PO = (e, t, n, r) => function(...o) {
  const s = n ? n(...o) : JSON.stringify({ args: o }), a = e[s];
  if (a !== void 0 && (!a.exp || a.exp > (/* @__PURE__ */ new Date()).getTime()))
    return a.value;
  const u = t(...o);
  return e[s] = {
    exp: r ? (/* @__PURE__ */ new Date()).getTime() + r : null,
    value: u
  }, u;
}, IO = (e, t = {}) => PO({}, e, t.key ?? null, t.ttl ?? null), CO = ({ delay: e }, t) => {
  let n, r = !0;
  const i = (...o) => {
    r ? (clearTimeout(n), n = setTimeout(() => {
      r && t(...o), n = void 0;
    }, e)) : t(...o);
  };
  return i.isPending = () => n !== void 0, i.cancel = () => {
    r = !1;
  }, i.flush = (...o) => t(...o), i;
}, DO = ({ interval: e }, t) => {
  let n = !0, r;
  const i = (...o) => {
    n && (t(...o), n = !1, r = setTimeout(() => {
      n = !0, r = void 0;
    }, e));
  };
  return i.isThrottled = () => r !== void 0, i;
}, LO = (e, t) => {
  const n = () => {
  };
  return new Proxy(Object.assign(n, e), {
    get: (r, i) => r[i],
    set: (r, i, o) => (r[i] = o, !0),
    apply: (r, i, o) => t(Object.assign({}, r))(...o)
  });
};
function FO(e, t, n) {
  return typeof e == "number" && typeof t == "number" && (typeof n > "u" || typeof n == "number") ? (typeof n > "u" && (n = t, t = 0), e >= Math.min(t, n) && e < Math.max(t, n)) : !1;
}
const jO = (e, t) => {
  const n = t === void 0 ? 0 : t;
  if (e == null)
    return n;
  const r = parseFloat(e);
  return isNaN(r) ? n : r;
}, $_ = (e, t) => {
  const n = t === void 0 ? 0 : t;
  if (e == null)
    return n;
  const r = parseInt(e);
  return isNaN(r) ? n : r;
}, BO = (e, t = (n) => n === void 0) => e ? Object.keys(e).reduce((r, i) => (t(e[i]) || (r[i] = e[i]), r), {}) : {}, Mc = (e, t) => Object.keys(e).reduce((r, i) => (r[t(i, e[i])] = e[i], r), {}), zO = (e, t) => Object.keys(e).reduce((r, i) => (r[i] = t(e[i], i), r), {}), UO = (e, t) => e ? Object.entries(e).reduce((n, [r, i]) => {
  const [o, s] = t(r, i);
  return n[o] = s, n;
}, {}) : {}, VO = (e) => e ? Object.keys(e).reduce((n, r) => (n[e[r]] = r, n), {}) : {}, qO = (e) => Mc(e, (t) => t.toLowerCase()), WO = (e) => Mc(e, (t) => t.toUpperCase()), N_ = (e) => {
  if (m_(e))
    return e;
  if (typeof e == "function")
    return e.bind({});
  const t = new e.constructor();
  return Object.getOwnPropertyNames(e).forEach((n) => {
    t[n] = e[n];
  }), t;
}, kO = (e, t) => {
  if (!e) return [];
  const n = Object.entries(e);
  return n.length === 0 ? [] : n.reduce((r, i) => (r.push(t(i[0], i[1])), r), []);
}, GO = (e, t) => e ? t.reduce((n, r) => (Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r]), n), {}) : {}, HO = (e, t) => e ? !t || t.length === 0 ? e : t.reduce(
  (n, r) => (delete n[r], n),
  { ...e }
) : {}, M_ = (e, t, n) => {
  const r = t.split(/[\.\[\]]/g);
  let i = e;
  for (const o of r) {
    if (i === null || i === void 0) return n;
    const s = o.replace(/['"]/g, "");
    s.trim() !== "" && (i = i[s]);
  }
  return i === void 0 ? n : i;
}, P_ = (e, t, n) => {
  if (!e) return {};
  if (!t || n === void 0) return e;
  const r = t.split(/[\.\[\]]/g).filter((s) => !!s.trim()), i = (s) => {
    if (r.length > 1) {
      const a = r.shift(), u = $_(r[0], null) !== null;
      s[a] = s[a] === void 0 ? u ? [] : {} : s[a], i(s[a]);
    } else
      s[r[0]] = n;
  }, o = N_(e);
  return i(o), o;
}, I_ = (e, t) => !e || !t ? e ?? t ?? {} : Object.entries({ ...e, ...t }).reduce(
  (n, [r, i]) => ({
    ...n,
    [r]: Rc(e[r]) ? I_(e[r], i) : i
  }),
  {}
), C_ = (e) => {
  if (!e) return [];
  const t = (n, r) => Rc(n) ? Object.entries(n).flatMap(
    ([i, o]) => t(o, [...r, i])
  ) : mo(n) ? n.flatMap((i, o) => t(i, [...r, `${o}`])) : [r.join(".")];
  return t(e, []);
}, KO = (e) => e ? S_(
  C_(e),
  (t) => t,
  (t) => M_(e, t)
) : {}, YO = (e) => e ? Object.keys(e).reduce((t, n) => P_(t, n, e[n]), {}) : {}, Pc = (e, t) => Math.floor(Math.random() * (t - e + 1) + e), XO = (e) => {
  const t = e.length;
  if (t === 0)
    return null;
  const n = Pc(0, t - 1);
  return e[n];
}, JO = (e) => e.map((t) => ({ rand: Math.random(), value: t })).sort((t, n) => t.rand - n.rand).map((t) => t.value), ZO = (e, t = "") => {
  const n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" + t;
  return R_(
    e,
    (r) => r + n.charAt(Pc(0, n.length - 1)),
    ""
  );
}, QO = (e, t = (n) => `${n}`) => {
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
  ), i = (l, h) => n[t(l)] < n[t(h)] ? l : h, o = (l, h) => n[t(l)] > n[t(h)] ? l : h, s = () => r[0], a = () => r[e.length - 1], u = (l, h) => r[n[t(l)] + 1] ?? h ?? s(), f = (l, h) => r[n[t(l)] - 1] ?? h ?? a();
  return {
    min: i,
    max: o,
    first: s,
    last: a,
    next: u,
    previous: f,
    spin: (l, h) => {
      if (h === 0) return l;
      const d = Math.abs(h), _ = d > e.length ? d % e.length : d;
      return Nc(0, _ - 1).reduce(
        (v) => h > 0 ? u(v) : f(v),
        l
      );
    }
  };
}, Ho = (e) => {
  if (!e || e.length === 0) return "";
  const t = e.toLowerCase();
  return t.substring(0, 1).toUpperCase() + t.substring(1, t.length);
}, eE = (e) => {
  const t = e?.replace(/([A-Z])+/g, Ho)?.split(/(?=[A-Z])|[\.\-\s_]/).map((n) => n.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.length === 1 ? t[0] : t.reduce((n, r) => `${n}${r.charAt(0).toUpperCase()}${r.slice(1)}`);
}, tE = (e, t) => {
  const n = e?.replace(/([A-Z])+/g, Ho).split(/(?=[A-Z])|[\.\-\s_]/).map((i) => i.toLowerCase()) ?? [];
  if (n.length === 0) return "";
  if (n.length === 1) return n[0];
  const r = n.reduce((i, o) => `${i}_${o.toLowerCase()}`);
  return t?.splitOnNumber === !1 ? r : r.replace(/([A-Za-z]{1}[0-9]{1})/, (i) => `${i[0]}_${i[1]}`);
}, nE = (e) => {
  const t = e?.replace(/([A-Z])+/g, Ho)?.split(/(?=[A-Z])|[\.\-\s_]/).map((n) => n.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.length === 1 ? t[0] : t.reduce((n, r) => `${n}-${r.toLowerCase()}`);
}, rE = (e) => {
  const t = e?.split(/[\.\-\s_]/).map((n) => n.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join("");
}, iE = (e) => e ? e.split(/(?=[A-Z])|[\.\-\s_]/).map((t) => t.trim()).filter((t) => !!t).map((t) => Ho(t.toLowerCase())).join(" ") : "", oE = (e, t, n = /\{\{(.+?)\}\}/g) => Array.from(e.matchAll(n)).reduce((r, i) => r.replace(i[0], t[i[1]]), e), sE = (e, t = " ") => {
  if (!e) return "";
  const n = t.replace(/[\W]{1}/g, "\\$&"), r = new RegExp(`^[${n}]+|[${n}]+$`, "g");
  return e.replace(r, "");
}, LB = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  all: EO,
  alphabetical: iO,
  assign: I_,
  boil: Tc,
  callable: LO,
  camel: eE,
  capitalize: Ho,
  chain: RO,
  clone: N_,
  cluster: cO,
  compose: TO,
  construct: YO,
  counting: oO,
  crush: KO,
  dash: nE,
  debounce: CO,
  defer: AO,
  diff: yO,
  draw: XO,
  first: nO,
  flat: hO,
  fork: x_,
  get: M_,
  group: ZA,
  guard: xO,
  inRange: FO,
  intersects: pO,
  invert: VO,
  isArray: mo,
  isDate: w_,
  isEmpty: JA,
  isEqual: O_,
  isFloat: XA,
  isFunction: Go,
  isInt: YA,
  isNumber: ti,
  isObject: Rc,
  isPrimitive: m_,
  isPromise: A_,
  isString: KA,
  isSymbol: b_,
  iterate: R_,
  keys: C_,
  last: rO,
  list: Nc,
  listify: kO,
  lowerize: qO,
  map: wO,
  mapEntries: UO,
  mapKeys: Mc,
  mapValues: zO,
  max: uO,
  memo: IO,
  merge: dO,
  min: fO,
  objectify: S_,
  omit: HO,
  parallel: OO,
  partial: $O,
  partob: NO,
  pascal: rE,
  pick: GO,
  proxied: MO,
  random: Pc,
  range: $c,
  reduce: mO,
  replace: sO,
  replaceOrAppend: _O,
  retry: SO,
  select: aO,
  series: QO,
  set: P_,
  shake: BO,
  shift: bO,
  shuffle: JO,
  sift: gO,
  sleep: Tf,
  snake: tE,
  sort: E_,
  sum: tO,
  template: oE,
  throttle: DO,
  title: iE,
  toFloat: jO,
  toInt: $_,
  toggle: vO,
  trim: sE,
  try: ci,
  tryit: ci,
  uid: ZO,
  unique: lO,
  upperize: WO,
  zip: QA,
  zipToObject: eO
}, Symbol.toStringTag, { value: "Module" }));
var D_ = typeof global == "object" && global && global.Object === Object && global, aE = typeof self == "object" && self && self.Object === Object && self, Ae = D_ || aE || Function("return this")(), Ne = Ae.Symbol, L_ = Object.prototype, uE = L_.hasOwnProperty, fE = L_.toString, Ji = Ne ? Ne.toStringTag : void 0;
function cE(e) {
  var t = uE.call(e, Ji), n = e[Ji];
  try {
    e[Ji] = void 0;
    var r = !0;
  } catch {
  }
  var i = fE.call(e);
  return r && (t ? e[Ji] = n : delete e[Ji]), i;
}
var lE = Object.prototype, hE = lE.toString;
function pE(e) {
  return hE.call(e);
}
var dE = "[object Null]", _E = "[object Undefined]", np = Ne ? Ne.toStringTag : void 0;
function Ue(e) {
  return e == null ? e === void 0 ? _E : dE : np && np in Object(e) ? cE(e) : pE(e);
}
function ie(e) {
  return e != null && typeof e == "object";
}
var vE = "[object Symbol]";
function Qe(e) {
  return typeof e == "symbol" || ie(e) && Ue(e) == vE;
}
var gE = NaN;
function rp(e) {
  return typeof e == "number" ? e : Qe(e) ? gE : +e;
}
function ne(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length, i = Array(r); ++n < r; )
    i[n] = t(e[n], n, e);
  return i;
}
var M = Array.isArray, ip = Ne ? Ne.prototype : void 0, op = ip ? ip.toString : void 0;
function ht(e) {
  if (typeof e == "string")
    return e;
  if (M(e))
    return ne(e, ht) + "";
  if (Qe(e))
    return op ? op.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function Ba(e, t) {
  return function(n, r) {
    var i;
    if (n === void 0 && r === void 0)
      return t;
    if (n !== void 0 && (i = n), r !== void 0) {
      if (i === void 0)
        return r;
      typeof n == "string" || typeof r == "string" ? (n = ht(n), r = ht(r)) : (n = rp(n), r = rp(r)), i = e(n, r);
    }
    return i;
  };
}
var F_ = Ba(function(e, t) {
  return e + t;
}, 0), yE = /\s/;
function j_(e) {
  for (var t = e.length; t-- && yE.test(e.charAt(t)); )
    ;
  return t;
}
var bE = /^\s+/;
function B_(e) {
  return e && e.slice(0, j_(e) + 1).replace(bE, "");
}
function re(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var sp = NaN, mE = /^[-+]0x[0-9a-f]+$/i, wE = /^0b[01]+$/i, AE = /^0o[0-7]+$/i, OE = parseInt;
function at(e) {
  if (typeof e == "number")
    return e;
  if (Qe(e))
    return sp;
  if (re(e)) {
    var t = typeof e.valueOf == "function" ? e.valueOf() : e;
    e = re(t) ? t + "" : t;
  }
  if (typeof e != "string")
    return e === 0 ? e : +e;
  e = B_(e);
  var n = wE.test(e);
  return n || AE.test(e) ? OE(e.slice(2), n ? 2 : 8) : mE.test(e) ? sp : +e;
}
var ap = 1 / 0, EE = 17976931348623157e292;
function rn(e) {
  if (!e)
    return e === 0 ? e : 0;
  if (e = at(e), e === ap || e === -ap) {
    var t = e < 0 ? -1 : 1;
    return t * EE;
  }
  return e === e ? e : 0;
}
function I(e) {
  var t = rn(e), n = t % 1;
  return t === t ? n ? t - n : t : 0;
}
var SE = "Expected a function";
function z_(e, t) {
  if (typeof t != "function")
    throw new TypeError(SE);
  return e = I(e), function() {
    if (--e < 1)
      return t.apply(this, arguments);
  };
}
function Ve(e) {
  return e;
}
var xE = "[object AsyncFunction]", RE = "[object Function]", TE = "[object GeneratorFunction]", $E = "[object Proxy]";
function hn(e) {
  if (!re(e))
    return !1;
  var t = Ue(e);
  return t == RE || t == TE || t == xE || t == $E;
}
var Qs = Ae["__core-js_shared__"], up = function() {
  var e = /[^.]+$/.exec(Qs && Qs.keys && Qs.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}();
function NE(e) {
  return !!up && up in e;
}
var ME = Function.prototype, PE = ME.toString;
function Pr(e) {
  if (e != null) {
    try {
      return PE.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
var IE = /[\\^$.*+?()[\]{}|]/g, CE = /^\[object .+?Constructor\]$/, DE = Function.prototype, LE = Object.prototype, FE = DE.toString, jE = LE.hasOwnProperty, BE = RegExp(
  "^" + FE.call(jE).replace(IE, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function U_(e) {
  if (!re(e) || NE(e))
    return !1;
  var t = hn(e) ? BE : CE;
  return t.test(Pr(e));
}
function zE(e, t) {
  return e?.[t];
}
function Ir(e, t) {
  var n = zE(e, t);
  return U_(n) ? n : void 0;
}
var wo = Ir(Ae, "WeakMap"), ua = wo && new wo(), V_ = ua ? function(e, t) {
  return ua.set(e, t), e;
} : Ve, fp = Object.create, Ri = /* @__PURE__ */ function() {
  function e() {
  }
  return function(t) {
    if (!re(t))
      return {};
    if (fp)
      return fp(t);
    e.prototype = t;
    var n = new e();
    return e.prototype = void 0, n;
  };
}();
function Ao(e) {
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
    var n = Ri(e.prototype), r = e.apply(n, t);
    return re(r) ? r : n;
  };
}
var UE = 1;
function VE(e, t, n) {
  var r = t & UE, i = Ao(e);
  function o() {
    var s = this && this !== Ae && this instanceof o ? i : e;
    return s.apply(r ? n : this, arguments);
  }
  return o;
}
function pt(e, t, n) {
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
var qE = Math.max;
function q_(e, t, n, r) {
  for (var i = -1, o = e.length, s = n.length, a = -1, u = t.length, f = qE(o - s, 0), c = Array(u + f), l = !r; ++a < u; )
    c[a] = t[a];
  for (; ++i < s; )
    (l || i < o) && (c[n[i]] = e[i]);
  for (; f--; )
    c[a++] = e[i++];
  return c;
}
var WE = Math.max;
function W_(e, t, n, r) {
  for (var i = -1, o = e.length, s = -1, a = n.length, u = -1, f = t.length, c = WE(o - a, 0), l = Array(c + f), h = !r; ++i < c; )
    l[i] = e[i];
  for (var d = i; ++u < f; )
    l[d + u] = t[u];
  for (; ++s < a; )
    (h || i < o) && (l[d + n[s]] = e[i++]);
  return l;
}
function kE(e, t) {
  for (var n = e.length, r = 0; n--; )
    e[n] === t && ++r;
  return r;
}
function za() {
}
var GE = 4294967295;
function D(e) {
  this.__wrapped__ = e, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = GE, this.__views__ = [];
}
D.prototype = Ri(za.prototype);
D.prototype.constructor = D;
function Ua() {
}
var Ic = ua ? function(e) {
  return ua.get(e);
} : Ua, ni = {}, HE = Object.prototype, KE = HE.hasOwnProperty;
function ea(e) {
  for (var t = e.name + "", n = ni[t], r = KE.call(ni, t) ? n.length : 0; r--; ) {
    var i = n[r], o = i.func;
    if (o == null || o == e)
      return i.name;
  }
  return t;
}
function Nt(e, t) {
  this.__wrapped__ = e, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = void 0;
}
Nt.prototype = Ri(za.prototype);
Nt.prototype.constructor = Nt;
function Je(e, t) {
  var n = -1, r = e.length;
  for (t || (t = Array(r)); ++n < r; )
    t[n] = e[n];
  return t;
}
function k_(e) {
  if (e instanceof D)
    return e.clone();
  var t = new Nt(e.__wrapped__, e.__chain__);
  return t.__actions__ = Je(e.__actions__), t.__index__ = e.__index__, t.__values__ = e.__values__, t;
}
var YE = Object.prototype, XE = YE.hasOwnProperty;
function p(e) {
  if (ie(e) && !M(e) && !(e instanceof D)) {
    if (e instanceof Nt)
      return e;
    if (XE.call(e, "__wrapped__"))
      return k_(e);
  }
  return new Nt(e);
}
p.prototype = za.prototype;
p.prototype.constructor = p;
function $f(e) {
  var t = ea(e), n = p[t];
  if (typeof n != "function" || !(t in D.prototype))
    return !1;
  if (e === n)
    return !0;
  var r = Ic(n);
  return !!r && e === r[0];
}
var JE = 800, ZE = 16, QE = Date.now;
function G_(e) {
  var t = 0, n = 0;
  return function() {
    var r = QE(), i = ZE - (r - n);
    if (n = r, i > 0) {
      if (++t >= JE)
        return arguments[0];
    } else
      t = 0;
    return e.apply(void 0, arguments);
  };
}
var H_ = G_(V_), eS = /\{\n\/\* \[wrapped with (.+)\] \*/, tS = /,? & /;
function nS(e) {
  var t = e.match(eS);
  return t ? t[1].split(tS) : [];
}
var rS = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
function iS(e, t) {
  var n = t.length;
  if (!n)
    return e;
  var r = n - 1;
  return t[r] = (n > 1 ? "& " : "") + t[r], t = t.join(n > 2 ? ", " : " "), e.replace(rS, `{
/* [wrapped with ` + t + `] */
`);
}
function Va(e) {
  return function() {
    return e;
  };
}
var fa = function() {
  try {
    var e = Ir(Object, "defineProperty");
    return e({}, "", {}), e;
  } catch {
  }
}(), oS = fa ? function(e, t) {
  return fa(e, "toString", {
    configurable: !0,
    enumerable: !1,
    value: Va(t),
    writable: !0
  });
} : Ve, Cc = G_(oS);
function Ct(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r && t(e[n], n, e) !== !1; )
    ;
  return e;
}
function qa(e, t, n, r) {
  for (var i = e.length, o = n + (r ? 1 : -1); r ? o-- : ++o < i; )
    if (t(e[o], o, e))
      return o;
  return -1;
}
function K_(e) {
  return e !== e;
}
function sS(e, t, n) {
  for (var r = n - 1, i = e.length; ++r < i; )
    if (e[r] === t)
      return r;
  return -1;
}
function Ti(e, t, n) {
  return t === t ? sS(e, t, n) : qa(e, K_, n);
}
function Wa(e, t) {
  var n = e == null ? 0 : e.length;
  return !!n && Ti(e, t, 0) > -1;
}
var aS = 1, uS = 2, fS = 8, cS = 16, lS = 32, hS = 64, pS = 128, dS = 256, _S = 512, vS = [
  ["ary", pS],
  ["bind", aS],
  ["bindKey", uS],
  ["curry", fS],
  ["curryRight", cS],
  ["flip", _S],
  ["partial", lS],
  ["partialRight", hS],
  ["rearg", dS]
];
function gS(e, t) {
  return Ct(vS, function(n) {
    var r = "_." + n[0];
    t & n[1] && !Wa(e, r) && e.push(r);
  }), e.sort();
}
function Y_(e, t, n) {
  var r = t + "";
  return Cc(e, iS(r, gS(nS(r), n)));
}
var yS = 4, bS = 8, cp = 32, lp = 64;
function X_(e, t, n, r, i, o, s, a, u, f) {
  var c = t & bS, l = c ? s : void 0, h = c ? void 0 : s, d = c ? o : void 0, _ = c ? void 0 : o;
  t |= c ? cp : lp, t &= ~(c ? lp : cp), t & yS || (t &= -4);
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
  return $f(e) && H_(g, v), g.placeholder = r, Y_(g, e, t);
}
function $i(e) {
  var t = e;
  return t.placeholder;
}
var mS = 9007199254740991, wS = /^(?:0|[1-9]\d*)$/;
function Ln(e, t) {
  var n = typeof e;
  return t = t ?? mS, !!t && (n == "number" || n != "symbol" && wS.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
var AS = Math.min;
function OS(e, t) {
  for (var n = e.length, r = AS(t.length, n), i = Je(e); r--; ) {
    var o = t[r];
    e[r] = Ln(o, n) ? i[o] : void 0;
  }
  return e;
}
var hp = "__lodash_placeholder__";
function Jn(e, t) {
  for (var n = -1, r = e.length, i = 0, o = []; ++n < r; ) {
    var s = e[n];
    (s === t || s === hp) && (e[n] = hp, o[i++] = n);
  }
  return o;
}
var ES = 1, SS = 2, xS = 8, RS = 16, TS = 128, $S = 512;
function ka(e, t, n, r, i, o, s, a, u, f) {
  var c = t & TS, l = t & ES, h = t & SS, d = t & (xS | RS), _ = t & $S, v = h ? void 0 : Ao(e);
  function g() {
    for (var y = arguments.length, b = Array(y), w = y; w--; )
      b[w] = arguments[w];
    if (d)
      var m = $i(g), A = kE(b, m);
    if (r && (b = q_(b, r, i, d)), o && (b = W_(b, o, s, d)), y -= A, d && y < f) {
      var S = Jn(b, m);
      return X_(
        e,
        t,
        ka,
        g.placeholder,
        n,
        b,
        S,
        a,
        u,
        f - y
      );
    }
    var P = l ? n : this, fe = h ? P[e] : e;
    return y = b.length, a ? b = OS(b, a) : _ && y > 1 && b.reverse(), c && u < y && (b.length = u), this && this !== Ae && this instanceof g && (fe = v || Ao(fe)), fe.apply(P, b);
  }
  return g;
}
function NS(e, t, n) {
  var r = Ao(e);
  function i() {
    for (var o = arguments.length, s = Array(o), a = o, u = $i(i); a--; )
      s[a] = arguments[a];
    var f = o < 3 && s[0] !== u && s[o - 1] !== u ? [] : Jn(s, u);
    if (o -= f.length, o < n)
      return X_(
        e,
        t,
        ka,
        i.placeholder,
        void 0,
        s,
        f,
        void 0,
        void 0,
        n - o
      );
    var c = this && this !== Ae && this instanceof i ? r : e;
    return pt(c, this, s);
  }
  return i;
}
var MS = 1;
function PS(e, t, n, r) {
  var i = t & MS, o = Ao(e);
  function s() {
    for (var a = -1, u = arguments.length, f = -1, c = r.length, l = Array(c + u), h = this && this !== Ae && this instanceof s ? o : e; ++f < c; )
      l[f] = r[f];
    for (; u--; )
      l[f++] = arguments[++a];
    return pt(h, i ? n : this, l);
  }
  return s;
}
var pp = "__lodash_placeholder__", Qu = 1, IS = 2, CS = 4, dp = 8, Zi = 128, _p = 256, DS = Math.min;
function LS(e, t) {
  var n = e[1], r = t[1], i = n | r, o = i < (Qu | IS | Zi), s = r == Zi && n == dp || r == Zi && n == _p && e[7].length <= t[8] || r == (Zi | _p) && t[7].length <= t[8] && n == dp;
  if (!(o || s))
    return e;
  r & Qu && (e[2] = t[2], i |= n & Qu ? 0 : CS);
  var a = t[3];
  if (a) {
    var u = e[3];
    e[3] = u ? q_(u, a, t[4]) : a, e[4] = u ? Jn(e[3], pp) : t[4];
  }
  return a = t[5], a && (u = e[5], e[5] = u ? W_(u, a, t[6]) : a, e[6] = u ? Jn(e[5], pp) : t[6]), a = t[7], a && (e[7] = a), r & Zi && (e[8] = e[8] == null ? t[8] : DS(e[8], t[8])), e[9] == null && (e[9] = t[9]), e[0] = t[0], e[1] = i, e;
}
var FS = "Expected a function", vp = 1, jS = 2, gp = 8, yp = 16, bp = 32, BS = 64, mp = Math.max;
function Fn(e, t, n, r, i, o, s, a) {
  var u = t & jS;
  if (!u && typeof e != "function")
    throw new TypeError(FS);
  var f = r ? r.length : 0;
  if (f || (t &= -97, r = i = void 0), s = s === void 0 ? s : mp(I(s), 0), a = a === void 0 ? a : I(a), f -= i ? i.length : 0, t & BS) {
    var c = r, l = i;
    r = i = void 0;
  }
  var h = u ? void 0 : Ic(e), d = [
    e,
    t,
    n,
    r,
    i,
    c,
    l,
    o,
    s,
    a
  ];
  if (h && LS(d, h), e = d[0], t = d[1], n = d[2], r = d[3], i = d[4], a = d[9] = d[9] === void 0 ? u ? 0 : e.length : mp(d[9] - f, 0), !a && t & (gp | yp) && (t &= -25), !t || t == vp)
    var _ = VE(e, t, n);
  else t == gp || t == yp ? _ = NS(e, t, a) : (t == bp || t == (vp | bp)) && !i.length ? _ = PS(e, t, n, r) : _ = ka.apply(void 0, d);
  var v = h ? V_ : H_;
  return Y_(v(_, d), e, t);
}
var zS = 128;
function Dc(e, t, n) {
  return t = n ? void 0 : t, t = e && t == null ? e.length : t, Fn(e, zS, void 0, void 0, void 0, void 0, t);
}
function jn(e, t, n) {
  t == "__proto__" && fa ? fa(e, t, {
    configurable: !0,
    enumerable: !0,
    value: n,
    writable: !0
  }) : e[t] = n;
}
function Dt(e, t) {
  return e === t || e !== e && t !== t;
}
var US = Object.prototype, VS = US.hasOwnProperty;
function Ko(e, t, n) {
  var r = e[t];
  (!(VS.call(e, t) && Dt(r, n)) || n === void 0 && !(t in e)) && jn(e, t, n);
}
function pn(e, t, n, r) {
  var i = !n;
  n || (n = {});
  for (var o = -1, s = t.length; ++o < s; ) {
    var a = t[o], u = r ? r(n[a], e[a], a, n, e) : void 0;
    u === void 0 && (u = e[a]), i ? jn(n, a, u) : Ko(n, a, u);
  }
  return n;
}
var wp = Math.max;
function J_(e, t, n) {
  return t = wp(t === void 0 ? e.length - 1 : t, 0), function() {
    for (var r = arguments, i = -1, o = wp(r.length - t, 0), s = Array(o); ++i < o; )
      s[i] = r[t + i];
    i = -1;
    for (var a = Array(t + 1); ++i < t; )
      a[i] = r[i];
    return a[t] = n(s), pt(e, this, a);
  };
}
function C(e, t) {
  return Cc(J_(e, t, Ve), e + "");
}
var qS = 9007199254740991;
function Yo(e) {
  return typeof e == "number" && e > -1 && e % 1 == 0 && e <= qS;
}
function qe(e) {
  return e != null && Yo(e.length) && !hn(e);
}
function Be(e, t, n) {
  if (!re(n))
    return !1;
  var r = typeof t;
  return (r == "number" ? qe(n) && Ln(t, n.length) : r == "string" && t in n) ? Dt(n[t], e) : !1;
}
function Ni(e) {
  return C(function(t, n) {
    var r = -1, i = n.length, o = i > 1 ? n[i - 1] : void 0, s = i > 2 ? n[2] : void 0;
    for (o = e.length > 3 && typeof o == "function" ? (i--, o) : void 0, s && Be(n[0], n[1], s) && (o = i < 3 ? void 0 : o, i = 1), t = Object(t); ++r < i; ) {
      var a = n[r];
      a && e(t, a, r, o);
    }
    return t;
  });
}
var WS = Object.prototype;
function Xo(e) {
  var t = e && e.constructor, n = typeof t == "function" && t.prototype || WS;
  return e === n;
}
function Lc(e, t) {
  for (var n = -1, r = Array(e); ++n < e; )
    r[n] = t(n);
  return r;
}
var kS = "[object Arguments]";
function Ap(e) {
  return ie(e) && Ue(e) == kS;
}
var Z_ = Object.prototype, GS = Z_.hasOwnProperty, HS = Z_.propertyIsEnumerable, Zn = Ap(/* @__PURE__ */ function() {
  return arguments;
}()) ? Ap : function(e) {
  return ie(e) && GS.call(e, "callee") && !HS.call(e, "callee");
};
function Ga() {
  return !1;
}
var Q_ = typeof exports == "object" && exports && !exports.nodeType && exports, Op = Q_ && typeof module == "object" && module && !module.nodeType && module, KS = Op && Op.exports === Q_, Ep = KS ? Ae.Buffer : void 0, YS = Ep ? Ep.isBuffer : void 0, In = YS || Ga, XS = "[object Arguments]", JS = "[object Array]", ZS = "[object Boolean]", QS = "[object Date]", ex = "[object Error]", tx = "[object Function]", nx = "[object Map]", rx = "[object Number]", ix = "[object Object]", ox = "[object RegExp]", sx = "[object Set]", ax = "[object String]", ux = "[object WeakMap]", fx = "[object ArrayBuffer]", cx = "[object DataView]", lx = "[object Float32Array]", hx = "[object Float64Array]", px = "[object Int8Array]", dx = "[object Int16Array]", _x = "[object Int32Array]", vx = "[object Uint8Array]", gx = "[object Uint8ClampedArray]", yx = "[object Uint16Array]", bx = "[object Uint32Array]", Q = {};
Q[lx] = Q[hx] = Q[px] = Q[dx] = Q[_x] = Q[vx] = Q[gx] = Q[yx] = Q[bx] = !0;
Q[XS] = Q[JS] = Q[fx] = Q[ZS] = Q[cx] = Q[QS] = Q[ex] = Q[tx] = Q[nx] = Q[rx] = Q[ix] = Q[ox] = Q[sx] = Q[ax] = Q[ux] = !1;
function mx(e) {
  return ie(e) && Yo(e.length) && !!Q[Ue(e)];
}
function dt(e) {
  return function(t) {
    return e(t);
  };
}
var ev = typeof exports == "object" && exports && !exports.nodeType && exports, so = ev && typeof module == "object" && module && !module.nodeType && module, wx = so && so.exports === ev, ef = wx && D_.process, Mt = function() {
  try {
    var e = so && so.require && so.require("util").types;
    return e || ef && ef.binding && ef.binding("util");
  } catch {
  }
}(), Sp = Mt && Mt.isTypedArray, Cr = Sp ? dt(Sp) : mx, Ax = Object.prototype, Ox = Ax.hasOwnProperty;
function tv(e, t) {
  var n = M(e), r = !n && Zn(e), i = !n && !r && In(e), o = !n && !r && !i && Cr(e), s = n || r || i || o, a = s ? Lc(e.length, String) : [], u = a.length;
  for (var f in e)
    (t || Ox.call(e, f)) && !(s && // Safari 9 has enumerable `arguments.length` in strict mode.
    (f == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    i && (f == "offset" || f == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    o && (f == "buffer" || f == "byteLength" || f == "byteOffset") || // Skip index properties.
    Ln(f, u))) && a.push(f);
  return a;
}
function nv(e, t) {
  return function(n) {
    return e(t(n));
  };
}
var Ex = nv(Object.keys, Object), Sx = Object.prototype, xx = Sx.hasOwnProperty;
function Fc(e) {
  if (!Xo(e))
    return Ex(e);
  var t = [];
  for (var n in Object(e))
    xx.call(e, n) && n != "constructor" && t.push(n);
  return t;
}
function pe(e) {
  return qe(e) ? tv(e) : Fc(e);
}
var Rx = Object.prototype, Tx = Rx.hasOwnProperty, rv = Ni(function(e, t) {
  if (Xo(t) || qe(t)) {
    pn(t, pe(t), e);
    return;
  }
  for (var n in t)
    Tx.call(t, n) && Ko(e, n, t[n]);
});
function $x(e) {
  var t = [];
  if (e != null)
    for (var n in Object(e))
      t.push(n);
  return t;
}
var Nx = Object.prototype, Mx = Nx.hasOwnProperty;
function Px(e) {
  if (!re(e))
    return $x(e);
  var t = Xo(e), n = [];
  for (var r in e)
    r == "constructor" && (t || !Mx.call(e, r)) || n.push(r);
  return n;
}
function We(e) {
  return qe(e) ? tv(e, !0) : Px(e);
}
var Nf = Ni(function(e, t) {
  pn(t, We(t), e);
}), Oo = Ni(function(e, t, n, r) {
  pn(t, We(t), e, r);
}), iv = Ni(function(e, t, n, r) {
  pn(t, pe(t), e, r);
}), Ix = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, Cx = /^\w*$/;
function jc(e, t) {
  if (M(e))
    return !1;
  var n = typeof e;
  return n == "number" || n == "symbol" || n == "boolean" || e == null || Qe(e) ? !0 : Cx.test(e) || !Ix.test(e) || t != null && e in Object(t);
}
var Eo = Ir(Object, "create");
function Dx() {
  this.__data__ = Eo ? Eo(null) : {}, this.size = 0;
}
function Lx(e) {
  var t = this.has(e) && delete this.__data__[e];
  return this.size -= t ? 1 : 0, t;
}
var Fx = "__lodash_hash_undefined__", jx = Object.prototype, Bx = jx.hasOwnProperty;
function zx(e) {
  var t = this.__data__;
  if (Eo) {
    var n = t[e];
    return n === Fx ? void 0 : n;
  }
  return Bx.call(t, e) ? t[e] : void 0;
}
var Ux = Object.prototype, Vx = Ux.hasOwnProperty;
function qx(e) {
  var t = this.__data__;
  return Eo ? t[e] !== void 0 : Vx.call(t, e);
}
var Wx = "__lodash_hash_undefined__";
function kx(e, t) {
  var n = this.__data__;
  return this.size += this.has(e) ? 0 : 1, n[e] = Eo && t === void 0 ? Wx : t, this;
}
function mr(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
mr.prototype.clear = Dx;
mr.prototype.delete = Lx;
mr.prototype.get = zx;
mr.prototype.has = qx;
mr.prototype.set = kx;
function Gx() {
  this.__data__ = [], this.size = 0;
}
function Ha(e, t) {
  for (var n = e.length; n--; )
    if (Dt(e[n][0], t))
      return n;
  return -1;
}
var Hx = Array.prototype, Kx = Hx.splice;
function Yx(e) {
  var t = this.__data__, n = Ha(t, e);
  if (n < 0)
    return !1;
  var r = t.length - 1;
  return n == r ? t.pop() : Kx.call(t, n, 1), --this.size, !0;
}
function Xx(e) {
  var t = this.__data__, n = Ha(t, e);
  return n < 0 ? void 0 : t[n][1];
}
function Jx(e) {
  return Ha(this.__data__, e) > -1;
}
function Zx(e, t) {
  var n = this.__data__, r = Ha(n, e);
  return r < 0 ? (++this.size, n.push([e, t])) : n[r][1] = t, this;
}
function Bn(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
Bn.prototype.clear = Gx;
Bn.prototype.delete = Yx;
Bn.prototype.get = Xx;
Bn.prototype.has = Jx;
Bn.prototype.set = Zx;
var So = Ir(Ae, "Map");
function Qx() {
  this.size = 0, this.__data__ = {
    hash: new mr(),
    map: new (So || Bn)(),
    string: new mr()
  };
}
function e2(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function Ka(e, t) {
  var n = e.__data__;
  return e2(t) ? n[typeof t == "string" ? "string" : "hash"] : n.map;
}
function t2(e) {
  var t = Ka(this, e).delete(e);
  return this.size -= t ? 1 : 0, t;
}
function n2(e) {
  return Ka(this, e).get(e);
}
function r2(e) {
  return Ka(this, e).has(e);
}
function i2(e, t) {
  var n = Ka(this, e), r = n.size;
  return n.set(e, t), this.size += n.size == r ? 0 : 1, this;
}
function zn(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
zn.prototype.clear = Qx;
zn.prototype.delete = t2;
zn.prototype.get = n2;
zn.prototype.has = r2;
zn.prototype.set = i2;
var o2 = "Expected a function";
function Jo(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function")
    throw new TypeError(o2);
  var n = function() {
    var r = arguments, i = t ? t.apply(this, r) : r[0], o = n.cache;
    if (o.has(i))
      return o.get(i);
    var s = e.apply(this, r);
    return n.cache = o.set(i, s) || o, s;
  };
  return n.cache = new (Jo.Cache || zn)(), n;
}
Jo.Cache = zn;
var s2 = 500;
function a2(e) {
  var t = Jo(e, function(r) {
    return n.size === s2 && n.clear(), r;
  }), n = t.cache;
  return t;
}
var u2 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, f2 = /\\(\\)?/g, ov = a2(function(e) {
  var t = [];
  return e.charCodeAt(0) === 46 && t.push(""), e.replace(u2, function(n, r, i, o) {
    t.push(i ? o.replace(f2, "$1") : r || n);
  }), t;
});
function V(e) {
  return e == null ? "" : ht(e);
}
function or(e, t) {
  return M(e) ? e : jc(e, t) ? [e] : ov(V(e));
}
function dn(e) {
  if (typeof e == "string" || Qe(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function Dr(e, t) {
  t = or(t, e);
  for (var n = 0, r = t.length; e != null && n < r; )
    e = e[dn(t[n++])];
  return n && n == r ? e : void 0;
}
function Ya(e, t, n) {
  var r = e == null ? void 0 : Dr(e, t);
  return r === void 0 ? n : r;
}
function Bc(e, t) {
  for (var n = -1, r = t.length, i = Array(r), o = e == null; ++n < r; )
    i[n] = o ? void 0 : Ya(e, t[n]);
  return i;
}
function sr(e, t) {
  for (var n = -1, r = t.length, i = e.length; ++n < r; )
    e[i + n] = t[n];
  return e;
}
var xp = Ne ? Ne.isConcatSpreadable : void 0;
function c2(e) {
  return M(e) || Zn(e) || !!(xp && e && e[xp]);
}
function Re(e, t, n, r, i) {
  var o = -1, s = e.length;
  for (n || (n = c2), i || (i = []); ++o < s; ) {
    var a = e[o];
    t > 0 && n(a) ? t > 1 ? Re(a, t - 1, n, r, i) : sr(i, a) : r || (i[i.length] = a);
  }
  return i;
}
function zc(e) {
  var t = e == null ? 0 : e.length;
  return t ? Re(e, 1) : [];
}
function Un(e) {
  return Cc(J_(e, void 0, zc), e + "");
}
var sv = Un(Bc), Xa = nv(Object.getPrototypeOf, Object), l2 = "[object Object]", h2 = Function.prototype, p2 = Object.prototype, av = h2.toString, d2 = p2.hasOwnProperty, _2 = av.call(Object);
function Mi(e) {
  if (!ie(e) || Ue(e) != l2)
    return !1;
  var t = Xa(e);
  if (t === null)
    return !0;
  var n = d2.call(t, "constructor") && t.constructor;
  return typeof n == "function" && n instanceof n && av.call(n) == _2;
}
var v2 = "[object DOMException]", g2 = "[object Error]";
function Ja(e) {
  if (!ie(e))
    return !1;
  var t = Ue(e);
  return t == g2 || t == v2 || typeof e.message == "string" && typeof e.name == "string" && !Mi(e);
}
var Uc = C(function(e, t) {
  try {
    return pt(e, void 0, t);
  } catch (n) {
    return Ja(n) ? n : new Error(n);
  }
}), y2 = "Expected a function";
function Vc(e, t) {
  var n;
  if (typeof t != "function")
    throw new TypeError(y2);
  return e = I(e), function() {
    return --e > 0 && (n = t.apply(this, arguments)), e <= 1 && (t = void 0), n;
  };
}
var b2 = 1, m2 = 32, Zo = C(function(e, t, n) {
  var r = b2;
  if (n.length) {
    var i = Jn(n, $i(Zo));
    r |= m2;
  }
  return Fn(e, r, t, n, i);
});
Zo.placeholder = {};
var uv = Un(function(e, t) {
  return Ct(t, function(n) {
    n = dn(n), jn(e, n, Zo(e[n], e));
  }), e;
}), w2 = 1, A2 = 2, O2 = 32, Za = C(function(e, t, n) {
  var r = w2 | A2;
  if (n.length) {
    var i = Jn(n, $i(Za));
    r |= O2;
  }
  return Fn(t, r, e, n, i);
});
Za.placeholder = {};
function Pt(e, t, n) {
  var r = -1, i = e.length;
  t < 0 && (t = -t > i ? 0 : i + t), n = n > i ? i : n, n < 0 && (n += i), i = t > n ? 0 : n - t >>> 0, t >>>= 0;
  for (var o = Array(i); ++r < i; )
    o[r] = e[r + t];
  return o;
}
function ar(e, t, n) {
  var r = e.length;
  return n = n === void 0 ? r : n, !t && n >= r ? e : Pt(e, t, n);
}
var E2 = "\\ud800-\\udfff", S2 = "\\u0300-\\u036f", x2 = "\\ufe20-\\ufe2f", R2 = "\\u20d0-\\u20ff", T2 = S2 + x2 + R2, $2 = "\\ufe0e\\ufe0f", N2 = "\\u200d", M2 = RegExp("[" + N2 + E2 + T2 + $2 + "]");
function Pi(e) {
  return M2.test(e);
}
function P2(e) {
  return e.split("");
}
var fv = "\\ud800-\\udfff", I2 = "\\u0300-\\u036f", C2 = "\\ufe20-\\ufe2f", D2 = "\\u20d0-\\u20ff", L2 = I2 + C2 + D2, F2 = "\\ufe0e\\ufe0f", j2 = "[" + fv + "]", Mf = "[" + L2 + "]", Pf = "\\ud83c[\\udffb-\\udfff]", B2 = "(?:" + Mf + "|" + Pf + ")", cv = "[^" + fv + "]", lv = "(?:\\ud83c[\\udde6-\\uddff]){2}", hv = "[\\ud800-\\udbff][\\udc00-\\udfff]", z2 = "\\u200d", pv = B2 + "?", dv = "[" + F2 + "]?", U2 = "(?:" + z2 + "(?:" + [cv, lv, hv].join("|") + ")" + dv + pv + ")*", V2 = dv + pv + U2, q2 = "(?:" + [cv + Mf + "?", Mf, lv, hv, j2].join("|") + ")", W2 = RegExp(Pf + "(?=" + Pf + ")|" + q2 + V2, "g");
function k2(e) {
  return e.match(W2) || [];
}
function Gt(e) {
  return Pi(e) ? k2(e) : P2(e);
}
function _v(e) {
  return function(t) {
    t = V(t);
    var n = Pi(t) ? Gt(t) : void 0, r = n ? n[0] : t.charAt(0), i = n ? ar(n, 1).join("") : t.slice(1);
    return r[e]() + i;
  };
}
var Qa = _v("toUpperCase");
function qc(e) {
  return Qa(V(e).toLowerCase());
}
function Wc(e, t, n, r) {
  var i = -1, o = e == null ? 0 : e.length;
  for (r && o && (n = e[++i]); ++i < o; )
    n = t(n, e[i], i, e);
  return n;
}
function kc(e) {
  return function(t) {
    return e?.[t];
  };
}
var G2 = {
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
}, H2 = kc(G2), K2 = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, Y2 = "\\u0300-\\u036f", X2 = "\\ufe20-\\ufe2f", J2 = "\\u20d0-\\u20ff", Z2 = Y2 + X2 + J2, Q2 = "[" + Z2 + "]", eR = RegExp(Q2, "g");
function Gc(e) {
  return e = V(e), e && e.replace(K2, H2).replace(eR, "");
}
var tR = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
function nR(e) {
  return e.match(tR) || [];
}
var rR = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
function iR(e) {
  return rR.test(e);
}
var vv = "\\ud800-\\udfff", oR = "\\u0300-\\u036f", sR = "\\ufe20-\\ufe2f", aR = "\\u20d0-\\u20ff", uR = oR + sR + aR, gv = "\\u2700-\\u27bf", yv = "a-z\\xdf-\\xf6\\xf8-\\xff", fR = "\\xac\\xb1\\xd7\\xf7", cR = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", lR = "\\u2000-\\u206f", hR = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", bv = "A-Z\\xc0-\\xd6\\xd8-\\xde", pR = "\\ufe0e\\ufe0f", mv = fR + cR + lR + hR, wv = "['’]", Rp = "[" + mv + "]", dR = "[" + uR + "]", Av = "\\d+", _R = "[" + gv + "]", Ov = "[" + yv + "]", Ev = "[^" + vv + mv + Av + gv + yv + bv + "]", vR = "\\ud83c[\\udffb-\\udfff]", gR = "(?:" + dR + "|" + vR + ")", yR = "[^" + vv + "]", Sv = "(?:\\ud83c[\\udde6-\\uddff]){2}", xv = "[\\ud800-\\udbff][\\udc00-\\udfff]", Jr = "[" + bv + "]", bR = "\\u200d", Tp = "(?:" + Ov + "|" + Ev + ")", mR = "(?:" + Jr + "|" + Ev + ")", $p = "(?:" + wv + "(?:d|ll|m|re|s|t|ve))?", Np = "(?:" + wv + "(?:D|LL|M|RE|S|T|VE))?", Rv = gR + "?", Tv = "[" + pR + "]?", wR = "(?:" + bR + "(?:" + [yR, Sv, xv].join("|") + ")" + Tv + Rv + ")*", AR = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", OR = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", ER = Tv + Rv + wR, SR = "(?:" + [_R, Sv, xv].join("|") + ")" + ER, xR = RegExp([
  Jr + "?" + Ov + "+" + $p + "(?=" + [Rp, Jr, "$"].join("|") + ")",
  mR + "+" + Np + "(?=" + [Rp, Jr + Tp, "$"].join("|") + ")",
  Jr + "?" + Tp + "+" + $p,
  Jr + "+" + Np,
  OR,
  AR,
  Av,
  SR
].join("|"), "g");
function RR(e) {
  return e.match(xR) || [];
}
function Hc(e, t, n) {
  return e = V(e), t = n ? void 0 : t, t === void 0 ? iR(e) ? RR(e) : nR(e) : e.match(t) || [];
}
var TR = "['’]", $R = RegExp(TR, "g");
function Ii(e) {
  return function(t) {
    return Wc(Hc(Gc(t).replace($R, "")), e, "");
  };
}
var $v = Ii(function(e, t, n) {
  return t = t.toLowerCase(), e + (n ? qc(t) : t);
});
function Nv() {
  if (!arguments.length)
    return [];
  var e = arguments[0];
  return M(e) ? e : [e];
}
var NR = Ae.isFinite, MR = Math.min;
function Kc(e) {
  var t = Math[e];
  return function(n, r) {
    if (n = at(n), r = r == null ? 0 : MR(I(r), 292), r && NR(n)) {
      var i = (V(n) + "e").split("e"), o = t(i[0] + "e" + (+i[1] + r));
      return i = (V(o) + "e").split("e"), +(i[0] + "e" + (+i[1] - r));
    }
    return t(n);
  };
}
var Mv = Kc("ceil");
function Yc(e) {
  var t = p(e);
  return t.__chain__ = !0, t;
}
var PR = Math.ceil, IR = Math.max;
function Pv(e, t, n) {
  (n ? Be(e, t, n) : t === void 0) ? t = 1 : t = IR(I(t), 0);
  var r = e == null ? 0 : e.length;
  if (!r || t < 1)
    return [];
  for (var i = 0, o = 0, s = Array(PR(r / t)); i < r; )
    s[o++] = Pt(e, i, i += t);
  return s;
}
function Lr(e, t, n) {
  return e === e && (n !== void 0 && (e = e <= n ? e : n), t !== void 0 && (e = e >= t ? e : t)), e;
}
function Iv(e, t, n) {
  return n === void 0 && (n = t, t = void 0), n !== void 0 && (n = at(n), n = n === n ? n : 0), t !== void 0 && (t = at(t), t = t === t ? t : 0), Lr(at(e), t, n);
}
function CR() {
  this.__data__ = new Bn(), this.size = 0;
}
function DR(e) {
  var t = this.__data__, n = t.delete(e);
  return this.size = t.size, n;
}
function LR(e) {
  return this.__data__.get(e);
}
function FR(e) {
  return this.__data__.has(e);
}
var jR = 200;
function BR(e, t) {
  var n = this.__data__;
  if (n instanceof Bn) {
    var r = n.__data__;
    if (!So || r.length < jR - 1)
      return r.push([e, t]), this.size = ++n.size, this;
    n = this.__data__ = new zn(r);
  }
  return n.set(e, t), this.size = n.size, this;
}
function Ut(e) {
  var t = this.__data__ = new Bn(e);
  this.size = t.size;
}
Ut.prototype.clear = CR;
Ut.prototype.delete = DR;
Ut.prototype.get = LR;
Ut.prototype.has = FR;
Ut.prototype.set = BR;
function Cv(e, t) {
  return e && pn(t, pe(t), e);
}
function zR(e, t) {
  return e && pn(t, We(t), e);
}
var Dv = typeof exports == "object" && exports && !exports.nodeType && exports, Mp = Dv && typeof module == "object" && module && !module.nodeType && module, UR = Mp && Mp.exports === Dv, Pp = UR ? Ae.Buffer : void 0, Ip = Pp ? Pp.allocUnsafe : void 0;
function Lv(e, t) {
  if (t)
    return e.slice();
  var n = e.length, r = Ip ? Ip(n) : new e.constructor(n);
  return e.copy(r), r;
}
function ur(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length, i = 0, o = []; ++n < r; ) {
    var s = e[n];
    t(s, n, e) && (o[i++] = s);
  }
  return o;
}
function eu() {
  return [];
}
var VR = Object.prototype, qR = VR.propertyIsEnumerable, Cp = Object.getOwnPropertySymbols, Xc = Cp ? function(e) {
  return e == null ? [] : (e = Object(e), ur(Cp(e), function(t) {
    return qR.call(e, t);
  }));
} : eu;
function WR(e, t) {
  return pn(e, Xc(e), t);
}
var kR = Object.getOwnPropertySymbols, Fv = kR ? function(e) {
  for (var t = []; e; )
    sr(t, Xc(e)), e = Xa(e);
  return t;
} : eu;
function GR(e, t) {
  return pn(e, Fv(e), t);
}
function jv(e, t, n) {
  var r = t(e);
  return M(e) ? r : sr(r, n(e));
}
function If(e) {
  return jv(e, pe, Xc);
}
function Jc(e) {
  return jv(e, We, Fv);
}
var Cf = Ir(Ae, "DataView"), Df = Ir(Ae, "Promise"), ri = Ir(Ae, "Set"), Dp = "[object Map]", HR = "[object Object]", Lp = "[object Promise]", Fp = "[object Set]", jp = "[object WeakMap]", Bp = "[object DataView]", KR = Pr(Cf), YR = Pr(So), XR = Pr(Df), JR = Pr(ri), ZR = Pr(wo), gr = Ue;
(Cf && gr(new Cf(new ArrayBuffer(1))) != Bp || So && gr(new So()) != Dp || Df && gr(Df.resolve()) != Lp || ri && gr(new ri()) != Fp || wo && gr(new wo()) != jp) && (gr = function(e) {
  var t = Ue(e), n = t == HR ? e.constructor : void 0, r = n ? Pr(n) : "";
  if (r)
    switch (r) {
      case KR:
        return Bp;
      case YR:
        return Dp;
      case XR:
        return Lp;
      case JR:
        return Fp;
      case ZR:
        return jp;
    }
  return t;
});
const sn = gr;
var QR = Object.prototype, eT = QR.hasOwnProperty;
function tT(e) {
  var t = e.length, n = new e.constructor(t);
  return t && typeof e[0] == "string" && eT.call(e, "index") && (n.index = e.index, n.input = e.input), n;
}
var ca = Ae.Uint8Array;
function Zc(e) {
  var t = new e.constructor(e.byteLength);
  return new ca(t).set(new ca(e)), t;
}
function nT(e, t) {
  var n = t ? Zc(e.buffer) : e.buffer;
  return new e.constructor(n, e.byteOffset, e.byteLength);
}
var rT = /\w*$/;
function iT(e) {
  var t = new e.constructor(e.source, rT.exec(e));
  return t.lastIndex = e.lastIndex, t;
}
var zp = Ne ? Ne.prototype : void 0, Up = zp ? zp.valueOf : void 0;
function oT(e) {
  return Up ? Object(Up.call(e)) : {};
}
function Bv(e, t) {
  var n = t ? Zc(e.buffer) : e.buffer;
  return new e.constructor(n, e.byteOffset, e.length);
}
var sT = "[object Boolean]", aT = "[object Date]", uT = "[object Map]", fT = "[object Number]", cT = "[object RegExp]", lT = "[object Set]", hT = "[object String]", pT = "[object Symbol]", dT = "[object ArrayBuffer]", _T = "[object DataView]", vT = "[object Float32Array]", gT = "[object Float64Array]", yT = "[object Int8Array]", bT = "[object Int16Array]", mT = "[object Int32Array]", wT = "[object Uint8Array]", AT = "[object Uint8ClampedArray]", OT = "[object Uint16Array]", ET = "[object Uint32Array]";
function ST(e, t, n) {
  var r = e.constructor;
  switch (t) {
    case dT:
      return Zc(e);
    case sT:
    case aT:
      return new r(+e);
    case _T:
      return nT(e, n);
    case vT:
    case gT:
    case yT:
    case bT:
    case mT:
    case wT:
    case AT:
    case OT:
    case ET:
      return Bv(e, n);
    case uT:
      return new r();
    case fT:
    case hT:
      return new r(e);
    case cT:
      return iT(e);
    case lT:
      return new r();
    case pT:
      return oT(e);
  }
}
function zv(e) {
  return typeof e.constructor == "function" && !Xo(e) ? Ri(Xa(e)) : {};
}
var xT = "[object Map]";
function RT(e) {
  return ie(e) && sn(e) == xT;
}
var Vp = Mt && Mt.isMap, Qc = Vp ? dt(Vp) : RT, TT = "[object Set]";
function $T(e) {
  return ie(e) && sn(e) == TT;
}
var qp = Mt && Mt.isSet, el = qp ? dt(qp) : $T, NT = 1, MT = 2, PT = 4, Uv = "[object Arguments]", IT = "[object Array]", CT = "[object Boolean]", DT = "[object Date]", LT = "[object Error]", Vv = "[object Function]", FT = "[object GeneratorFunction]", jT = "[object Map]", BT = "[object Number]", qv = "[object Object]", zT = "[object RegExp]", UT = "[object Set]", VT = "[object String]", qT = "[object Symbol]", WT = "[object WeakMap]", kT = "[object ArrayBuffer]", GT = "[object DataView]", HT = "[object Float32Array]", KT = "[object Float64Array]", YT = "[object Int8Array]", XT = "[object Int16Array]", JT = "[object Int32Array]", ZT = "[object Uint8Array]", QT = "[object Uint8ClampedArray]", e$ = "[object Uint16Array]", t$ = "[object Uint32Array]", Y = {};
Y[Uv] = Y[IT] = Y[kT] = Y[GT] = Y[CT] = Y[DT] = Y[HT] = Y[KT] = Y[YT] = Y[XT] = Y[JT] = Y[jT] = Y[BT] = Y[qv] = Y[zT] = Y[UT] = Y[VT] = Y[qT] = Y[ZT] = Y[QT] = Y[e$] = Y[t$] = !0;
Y[LT] = Y[Vv] = Y[WT] = !1;
function Rt(e, t, n, r, i, o) {
  var s, a = t & NT, u = t & MT, f = t & PT;
  if (n && (s = i ? n(e, r, i, o) : n(e)), s !== void 0)
    return s;
  if (!re(e))
    return e;
  var c = M(e);
  if (c) {
    if (s = tT(e), !a)
      return Je(e, s);
  } else {
    var l = sn(e), h = l == Vv || l == FT;
    if (In(e))
      return Lv(e, a);
    if (l == qv || l == Uv || h && !i) {
      if (s = u || h ? {} : zv(e), !a)
        return u ? GR(e, zR(s, e)) : WR(e, Cv(s, e));
    } else {
      if (!Y[l])
        return i ? e : {};
      s = ST(e, l, a);
    }
  }
  o || (o = new Ut());
  var d = o.get(e);
  if (d)
    return d;
  o.set(e, s), el(e) ? e.forEach(function(g) {
    s.add(Rt(g, t, n, g, e, o));
  }) : Qc(e) && e.forEach(function(g, y) {
    s.set(y, Rt(g, t, n, y, e, o));
  });
  var _ = f ? u ? Jc : If : u ? We : pe, v = c ? void 0 : _(e);
  return Ct(v || e, function(g, y) {
    v && (y = g, g = e[y]), Ko(s, y, Rt(g, t, n, y, e, o));
  }), s;
}
var n$ = 4;
function Wv(e) {
  return Rt(e, n$);
}
var r$ = 1, i$ = 4;
function kv(e) {
  return Rt(e, r$ | i$);
}
var o$ = 1, s$ = 4;
function Gv(e, t) {
  return t = typeof t == "function" ? t : void 0, Rt(e, o$ | s$, t);
}
var a$ = 4;
function Hv(e, t) {
  return t = typeof t == "function" ? t : void 0, Rt(e, a$, t);
}
function Lf() {
  return new Nt(this.value(), this.__chain__);
}
function Kv(e) {
  for (var t = -1, n = e == null ? 0 : e.length, r = 0, i = []; ++t < n; ) {
    var o = e[t];
    o && (i[r++] = o);
  }
  return i;
}
function Yv() {
  var e = arguments.length;
  if (!e)
    return [];
  for (var t = Array(e - 1), n = arguments[0], r = e; r--; )
    t[r - 1] = arguments[r];
  return sr(M(n) ? Je(n) : [n], Re(t, 1));
}
var u$ = "__lodash_hash_undefined__";
function f$(e) {
  return this.__data__.set(e, u$), this;
}
function c$(e) {
  return this.__data__.has(e);
}
function wr(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.__data__ = new zn(); ++t < n; )
    this.add(e[t]);
}
wr.prototype.add = wr.prototype.push = f$;
wr.prototype.has = c$;
function tl(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r; )
    if (t(e[n], n, e))
      return !0;
  return !1;
}
function xo(e, t) {
  return e.has(t);
}
var l$ = 1, h$ = 2;
function Xv(e, t, n, r, i, o) {
  var s = n & l$, a = e.length, u = t.length;
  if (a != u && !(s && u > a))
    return !1;
  var f = o.get(e), c = o.get(t);
  if (f && c)
    return f == t && c == e;
  var l = -1, h = !0, d = n & h$ ? new wr() : void 0;
  for (o.set(e, t), o.set(t, e); ++l < a; ) {
    var _ = e[l], v = t[l];
    if (r)
      var g = s ? r(v, _, l, t, e, o) : r(_, v, l, e, t, o);
    if (g !== void 0) {
      if (g)
        continue;
      h = !1;
      break;
    }
    if (d) {
      if (!tl(t, function(y, b) {
        if (!xo(d, b) && (_ === y || i(_, y, n, r, o)))
          return d.push(b);
      })) {
        h = !1;
        break;
      }
    } else if (!(_ === v || i(_, v, n, r, o))) {
      h = !1;
      break;
    }
  }
  return o.delete(e), o.delete(t), h;
}
function nl(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(r, i) {
    n[++t] = [i, r];
  }), n;
}
function tu(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(r) {
    n[++t] = r;
  }), n;
}
var p$ = 1, d$ = 2, _$ = "[object Boolean]", v$ = "[object Date]", g$ = "[object Error]", y$ = "[object Map]", b$ = "[object Number]", m$ = "[object RegExp]", w$ = "[object Set]", A$ = "[object String]", O$ = "[object Symbol]", E$ = "[object ArrayBuffer]", S$ = "[object DataView]", Wp = Ne ? Ne.prototype : void 0, tf = Wp ? Wp.valueOf : void 0;
function x$(e, t, n, r, i, o, s) {
  switch (n) {
    case S$:
      if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
        return !1;
      e = e.buffer, t = t.buffer;
    case E$:
      return !(e.byteLength != t.byteLength || !o(new ca(e), new ca(t)));
    case _$:
    case v$:
    case b$:
      return Dt(+e, +t);
    case g$:
      return e.name == t.name && e.message == t.message;
    case m$:
    case A$:
      return e == t + "";
    case y$:
      var a = nl;
    case w$:
      var u = r & p$;
      if (a || (a = tu), e.size != t.size && !u)
        return !1;
      var f = s.get(e);
      if (f)
        return f == t;
      r |= d$, s.set(e, t);
      var c = Xv(a(e), a(t), r, i, o, s);
      return s.delete(e), c;
    case O$:
      if (tf)
        return tf.call(e) == tf.call(t);
  }
  return !1;
}
var R$ = 1, T$ = Object.prototype, $$ = T$.hasOwnProperty;
function N$(e, t, n, r, i, o) {
  var s = n & R$, a = If(e), u = a.length, f = If(t), c = f.length;
  if (u != c && !s)
    return !1;
  for (var l = u; l--; ) {
    var h = a[l];
    if (!(s ? h in t : $$.call(t, h)))
      return !1;
  }
  var d = o.get(e), _ = o.get(t);
  if (d && _)
    return d == t && _ == e;
  var v = !0;
  o.set(e, t), o.set(t, e);
  for (var g = s; ++l < u; ) {
    h = a[l];
    var y = e[h], b = t[h];
    if (r)
      var w = s ? r(b, y, h, t, e, o) : r(y, b, h, e, t, o);
    if (!(w === void 0 ? y === b || i(y, b, n, r, o) : w)) {
      v = !1;
      break;
    }
    g || (g = h == "constructor");
  }
  if (v && !g) {
    var m = e.constructor, A = t.constructor;
    m != A && "constructor" in e && "constructor" in t && !(typeof m == "function" && m instanceof m && typeof A == "function" && A instanceof A) && (v = !1);
  }
  return o.delete(e), o.delete(t), v;
}
var M$ = 1, kp = "[object Arguments]", Gp = "[object Array]", Ds = "[object Object]", P$ = Object.prototype, Hp = P$.hasOwnProperty;
function I$(e, t, n, r, i, o) {
  var s = M(e), a = M(t), u = s ? Gp : sn(e), f = a ? Gp : sn(t);
  u = u == kp ? Ds : u, f = f == kp ? Ds : f;
  var c = u == Ds, l = f == Ds, h = u == f;
  if (h && In(e)) {
    if (!In(t))
      return !1;
    s = !0, c = !1;
  }
  if (h && !c)
    return o || (o = new Ut()), s || Cr(e) ? Xv(e, t, n, r, i, o) : x$(e, t, u, n, r, i, o);
  if (!(n & M$)) {
    var d = c && Hp.call(e, "__wrapped__"), _ = l && Hp.call(t, "__wrapped__");
    if (d || _) {
      var v = d ? e.value() : e, g = _ ? t.value() : t;
      return o || (o = new Ut()), i(v, g, n, r, o);
    }
  }
  return h ? (o || (o = new Ut()), N$(e, t, n, r, i, o)) : !1;
}
function Qo(e, t, n, r, i) {
  return e === t ? !0 : e == null || t == null || !ie(e) && !ie(t) ? e !== e && t !== t : I$(e, t, n, r, Qo, i);
}
var C$ = 1, D$ = 2;
function rl(e, t, n, r) {
  var i = n.length, o = i, s = !r;
  if (e == null)
    return !o;
  for (e = Object(e); i--; ) {
    var a = n[i];
    if (s && a[2] ? a[1] !== e[a[0]] : !(a[0] in e))
      return !1;
  }
  for (; ++i < o; ) {
    a = n[i];
    var u = a[0], f = e[u], c = a[1];
    if (s && a[2]) {
      if (f === void 0 && !(u in e))
        return !1;
    } else {
      var l = new Ut();
      if (r)
        var h = r(f, c, u, e, t, l);
      if (!(h === void 0 ? Qo(c, f, C$ | D$, r, l) : h))
        return !1;
    }
  }
  return !0;
}
function Jv(e) {
  return e === e && !re(e);
}
function il(e) {
  for (var t = pe(e), n = t.length; n--; ) {
    var r = t[n], i = e[r];
    t[n] = [r, i, Jv(i)];
  }
  return t;
}
function Zv(e, t) {
  return function(n) {
    return n == null ? !1 : n[e] === t && (t !== void 0 || e in Object(n));
  };
}
function Qv(e) {
  var t = il(e);
  return t.length == 1 && t[0][2] ? Zv(t[0][0], t[0][1]) : function(n) {
    return n === e || rl(n, e, t);
  };
}
function L$(e, t) {
  return e != null && t in Object(e);
}
function eg(e, t, n) {
  t = or(t, e);
  for (var r = -1, i = t.length, o = !1; ++r < i; ) {
    var s = dn(t[r]);
    if (!(o = e != null && n(e, s)))
      break;
    e = e[s];
  }
  return o || ++r != i ? o : (i = e == null ? 0 : e.length, !!i && Yo(i) && Ln(s, i) && (M(e) || Zn(e)));
}
function nu(e, t) {
  return e != null && eg(e, t, L$);
}
var F$ = 1, j$ = 2;
function tg(e, t) {
  return jc(e) && Jv(t) ? Zv(dn(e), t) : function(n) {
    var r = Ya(n, e);
    return r === void 0 && r === t ? nu(n, e) : Qo(t, r, F$ | j$);
  };
}
function ol(e) {
  return function(t) {
    return t?.[e];
  };
}
function B$(e) {
  return function(t) {
    return Dr(t, e);
  };
}
function sl(e) {
  return jc(e) ? ol(dn(e)) : B$(e);
}
function N(e) {
  return typeof e == "function" ? e : e == null ? Ve : typeof e == "object" ? M(e) ? tg(e[0], e[1]) : Qv(e) : sl(e);
}
var z$ = "Expected a function";
function ng(e) {
  var t = e == null ? 0 : e.length, n = N;
  return e = t ? ne(e, function(r) {
    if (typeof r[1] != "function")
      throw new TypeError(z$);
    return [n(r[0]), r[1]];
  }) : [], C(function(r) {
    for (var i = -1; ++i < t; ) {
      var o = e[i];
      if (pt(o[0], this, r))
        return pt(o[1], this, r);
    }
  });
}
function rg(e, t, n) {
  var r = n.length;
  if (e == null)
    return !r;
  for (e = Object(e); r--; ) {
    var i = n[r], o = t[i], s = e[i];
    if (s === void 0 && !(i in e) || !o(s))
      return !1;
  }
  return !0;
}
function U$(e) {
  var t = pe(e);
  return function(n) {
    return rg(n, e, t);
  };
}
var V$ = 1;
function ig(e) {
  return U$(Rt(e, V$));
}
function og(e, t) {
  return t == null || rg(e, t, pe(t));
}
function q$(e, t, n, r) {
  for (var i = -1, o = e == null ? 0 : e.length; ++i < o; ) {
    var s = e[i];
    t(r, s, n(s), e);
  }
  return r;
}
function sg(e) {
  return function(t, n, r) {
    for (var i = -1, o = Object(t), s = r(t), a = s.length; a--; ) {
      var u = s[e ? a : ++i];
      if (n(o[u], u, o) === !1)
        break;
    }
    return t;
  };
}
var al = sg();
function _n(e, t) {
  return e && al(e, t, pe);
}
function ag(e, t) {
  return function(n, r) {
    if (n == null)
      return n;
    if (!qe(n))
      return e(n, r);
    for (var i = n.length, o = t ? i : -1, s = Object(n); (t ? o-- : ++o < i) && r(s[o], o, s) !== !1; )
      ;
    return n;
  };
}
var fr = ag(_n);
function W$(e, t, n, r) {
  return fr(e, function(i, o, s) {
    t(r, i, n(i), s);
  }), r;
}
function ru(e, t) {
  return function(n, r) {
    var i = M(n) ? q$ : W$, o = t ? t() : {};
    return i(n, e, N(r), o);
  };
}
var k$ = Object.prototype, G$ = k$.hasOwnProperty, ug = ru(function(e, t, n) {
  G$.call(e, n) ? ++e[n] : jn(e, n, 1);
});
function fg(e, t) {
  var n = Ri(e);
  return t == null ? n : Cv(n, t);
}
var H$ = 8;
function iu(e, t, n) {
  t = n ? void 0 : t;
  var r = Fn(e, H$, void 0, void 0, void 0, void 0, void 0, t);
  return r.placeholder = iu.placeholder, r;
}
iu.placeholder = {};
var K$ = 16;
function ou(e, t, n) {
  t = n ? void 0 : t;
  var r = Fn(e, K$, void 0, void 0, void 0, void 0, void 0, t);
  return r.placeholder = ou.placeholder, r;
}
ou.placeholder = {};
var ao = function() {
  return Ae.Date.now();
}, Y$ = "Expected a function", X$ = Math.max, J$ = Math.min;
function ul(e, t, n) {
  var r, i, o, s, a, u, f = 0, c = !1, l = !1, h = !0;
  if (typeof e != "function")
    throw new TypeError(Y$);
  t = at(t) || 0, re(n) && (c = !!n.leading, l = "maxWait" in n, o = l ? X$(at(n.maxWait) || 0, t) : o, h = "trailing" in n ? !!n.trailing : h);
  function d(S) {
    var P = r, fe = i;
    return r = i = void 0, f = S, s = e.apply(fe, P), s;
  }
  function _(S) {
    return f = S, a = setTimeout(y, t), c ? d(S) : s;
  }
  function v(S) {
    var P = S - u, fe = S - f, wn = t - P;
    return l ? J$(wn, o - fe) : wn;
  }
  function g(S) {
    var P = S - u, fe = S - f;
    return u === void 0 || P >= t || P < 0 || l && fe >= o;
  }
  function y() {
    var S = ao();
    if (g(S))
      return b(S);
    a = setTimeout(y, v(S));
  }
  function b(S) {
    return a = void 0, h && r ? d(S) : (r = i = void 0, s);
  }
  function w() {
    a !== void 0 && clearTimeout(a), f = 0, r = u = i = a = void 0;
  }
  function m() {
    return a === void 0 ? s : b(ao());
  }
  function A() {
    var S = ao(), P = g(S);
    if (r = arguments, i = this, u = S, P) {
      if (a === void 0)
        return _(u);
      if (l)
        return clearTimeout(a), a = setTimeout(y, t), d(u);
    }
    return a === void 0 && (a = setTimeout(y, t)), s;
  }
  return A.cancel = w, A.flush = m, A;
}
function cg(e, t) {
  return e == null || e !== e ? t : e;
}
var lg = Object.prototype, Z$ = lg.hasOwnProperty, hg = C(function(e, t) {
  e = Object(e);
  var n = -1, r = t.length, i = r > 2 ? t[2] : void 0;
  for (i && Be(t[0], t[1], i) && (r = 1); ++n < r; )
    for (var o = t[n], s = We(o), a = -1, u = s.length; ++a < u; ) {
      var f = s[a], c = e[f];
      (c === void 0 || Dt(c, lg[f]) && !Z$.call(e, f)) && (e[f] = o[f]);
    }
  return e;
});
function Ff(e, t, n) {
  (n !== void 0 && !Dt(e[t], n) || n === void 0 && !(t in e)) && jn(e, t, n);
}
function se(e) {
  return ie(e) && qe(e);
}
function jf(e, t) {
  if (!(t === "constructor" && typeof e[t] == "function") && t != "__proto__")
    return e[t];
}
function fl(e) {
  return pn(e, We(e));
}
function Q$(e, t, n, r, i, o, s) {
  var a = jf(e, n), u = jf(t, n), f = s.get(u);
  if (f) {
    Ff(e, n, f);
    return;
  }
  var c = o ? o(a, u, n + "", e, t, s) : void 0, l = c === void 0;
  if (l) {
    var h = M(u), d = !h && In(u), _ = !h && !d && Cr(u);
    c = u, h || d || _ ? M(a) ? c = a : se(a) ? c = Je(a) : d ? (l = !1, c = Lv(u, !0)) : _ ? (l = !1, c = Bv(u, !0)) : c = [] : Mi(u) || Zn(u) ? (c = a, Zn(a) ? c = fl(a) : (!re(a) || hn(a)) && (c = zv(u))) : l = !1;
  }
  l && (s.set(u, c), i(c, u, r, o, s), s.delete(u)), Ff(e, n, c);
}
function su(e, t, n, r, i) {
  e !== t && al(t, function(o, s) {
    if (i || (i = new Ut()), re(o))
      Q$(e, t, s, n, su, r, i);
    else {
      var a = r ? r(jf(e, s), o, s + "", e, t, i) : void 0;
      a === void 0 && (a = o), Ff(e, s, a);
    }
  }, We);
}
function pg(e, t, n, r, i, o) {
  return re(e) && re(t) && (o.set(t, e), su(e, t, void 0, pg, o), o.delete(t)), e;
}
var cl = Ni(function(e, t, n, r) {
  su(e, t, n, r);
}), dg = C(function(e) {
  return e.push(void 0, pg), pt(cl, void 0, e);
}), eN = "Expected a function";
function _g(e, t, n) {
  if (typeof e != "function")
    throw new TypeError(eN);
  return setTimeout(function() {
    e.apply(void 0, n);
  }, t);
}
var vg = C(function(e, t) {
  return _g(e, 1, t);
}), gg = C(function(e, t, n) {
  return _g(e, at(t) || 0, n);
});
function ll(e, t, n) {
  for (var r = -1, i = e == null ? 0 : e.length; ++r < i; )
    if (n(t, e[r]))
      return !0;
  return !1;
}
var tN = 200;
function es(e, t, n, r) {
  var i = -1, o = Wa, s = !0, a = e.length, u = [], f = t.length;
  if (!a)
    return u;
  n && (t = ne(t, dt(n))), r ? (o = ll, s = !1) : t.length >= tN && (o = xo, s = !1, t = new wr(t));
  e:
    for (; ++i < a; ) {
      var c = e[i], l = n == null ? c : n(c);
      if (c = r || c !== 0 ? c : 0, s && l === l) {
        for (var h = f; h--; )
          if (t[h] === l)
            continue e;
        u.push(c);
      } else o(t, l, r) || u.push(c);
    }
  return u;
}
var yg = C(function(e, t) {
  return se(e) ? es(e, Re(t, 1, se, !0)) : [];
});
function _t(e) {
  var t = e == null ? 0 : e.length;
  return t ? e[t - 1] : void 0;
}
var bg = C(function(e, t) {
  var n = _t(t);
  return se(n) && (n = void 0), se(e) ? es(e, Re(t, 1, se, !0), N(n)) : [];
}), mg = C(function(e, t) {
  var n = _t(t);
  return se(n) && (n = void 0), se(e) ? es(e, Re(t, 1, se, !0), void 0, n) : [];
}), wg = Ba(function(e, t) {
  return e / t;
}, 1);
function Ag(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (t = n || t === void 0 ? 1 : I(t), Pt(e, t < 0 ? 0 : t, r)) : [];
}
function Og(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (t = n || t === void 0 ? 1 : I(t), t = r - t, Pt(e, 0, t < 0 ? 0 : t)) : [];
}
function au(e, t, n, r) {
  for (var i = e.length, o = r ? i : -1; (r ? o-- : ++o < i) && t(e[o], o, e); )
    ;
  return n ? Pt(e, r ? 0 : o, r ? o + 1 : i) : Pt(e, r ? o + 1 : 0, r ? i : o);
}
function Eg(e, t) {
  return e && e.length ? au(e, N(t), !0, !0) : [];
}
function Sg(e, t) {
  return e && e.length ? au(e, N(t), !0) : [];
}
function vn(e) {
  return typeof e == "function" ? e : Ve;
}
function Bf(e, t) {
  var n = M(e) ? Ct : fr;
  return n(e, vn(t));
}
function nN(e, t) {
  for (var n = e == null ? 0 : e.length; n-- && t(e[n], n, e) !== !1; )
    ;
  return e;
}
var xg = sg(!0);
function hl(e, t) {
  return e && xg(e, t, pe);
}
var Rg = ag(hl, !0);
function zf(e, t) {
  var n = M(e) ? nN : Rg;
  return n(e, vn(t));
}
function Tg(e, t, n) {
  e = V(e), t = ht(t);
  var r = e.length;
  n = n === void 0 ? r : Lr(I(n), 0, r);
  var i = n;
  return n -= t.length, n >= 0 && e.slice(n, i) == t;
}
function rN(e, t) {
  return ne(t, function(n) {
    return [n, e[n]];
  });
}
function iN(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(r) {
    n[++t] = [r, r];
  }), n;
}
var oN = "[object Map]", sN = "[object Set]";
function $g(e) {
  return function(t) {
    var n = sn(t);
    return n == oN ? nl(t) : n == sN ? iN(t) : rN(t, e(t));
  };
}
var Uf = $g(pe), Vf = $g(We), aN = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, uN = kc(aN), Ng = /[&<>"']/g, fN = RegExp(Ng.source);
function pl(e) {
  return e = V(e), e && fN.test(e) ? e.replace(Ng, uN) : e;
}
var Mg = /[\\^$.*+?()[\]{}|]/g, cN = RegExp(Mg.source);
function Pg(e) {
  return e = V(e), e && cN.test(e) ? e.replace(Mg, "\\$&") : e;
}
function Ig(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r; )
    if (!t(e[n], n, e))
      return !1;
  return !0;
}
function lN(e, t) {
  var n = !0;
  return fr(e, function(r, i, o) {
    return n = !!t(r, i, o), n;
  }), n;
}
function Cg(e, t, n) {
  var r = M(e) ? Ig : lN;
  return n && Be(e, t, n) && (t = void 0), r(e, N(t));
}
var hN = 4294967295;
function dl(e) {
  return e ? Lr(I(e), 0, hN) : 0;
}
function pN(e, t, n, r) {
  var i = e.length;
  for (n = I(n), n < 0 && (n = -n > i ? 0 : i + n), r = r === void 0 || r > i ? i : I(r), r < 0 && (r += i), r = n > r ? 0 : dl(r); n < r; )
    e[n++] = t;
  return e;
}
function Dg(e, t, n, r) {
  var i = e == null ? 0 : e.length;
  return i ? (n && typeof n != "number" && Be(e, t, n) && (n = 0, r = i), pN(e, t, n, r)) : [];
}
function Lg(e, t) {
  var n = [];
  return fr(e, function(r, i, o) {
    t(r, i, o) && n.push(r);
  }), n;
}
function Fg(e, t) {
  var n = M(e) ? ur : Lg;
  return n(e, N(t));
}
function jg(e) {
  return function(t, n, r) {
    var i = Object(t);
    if (!qe(t)) {
      var o = N(n);
      t = pe(t), n = function(a) {
        return o(i[a], a, i);
      };
    }
    var s = e(t, n, r);
    return s > -1 ? i[o ? t[s] : s] : void 0;
  };
}
var dN = Math.max;
function _l(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = n == null ? 0 : I(n);
  return i < 0 && (i = dN(r + i, 0)), qa(e, N(t), i);
}
var Bg = jg(_l);
function zg(e, t, n) {
  var r;
  return n(e, function(i, o, s) {
    if (t(i, o, s))
      return r = o, !1;
  }), r;
}
function Ug(e, t) {
  return zg(e, N(t), _n);
}
var _N = Math.max, vN = Math.min;
function vl(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = r - 1;
  return n !== void 0 && (i = I(n), i = n < 0 ? _N(r + i, 0) : vN(i, r - 1)), qa(e, N(t), i, !0);
}
var Vg = jg(vl);
function qg(e, t) {
  return zg(e, N(t), hl);
}
function qf(e) {
  return e && e.length ? e[0] : void 0;
}
function Wg(e, t) {
  var n = -1, r = qe(e) ? Array(e.length) : [];
  return fr(e, function(i, o, s) {
    r[++n] = t(i, o, s);
  }), r;
}
function ts(e, t) {
  var n = M(e) ? ne : Wg;
  return n(e, N(t));
}
function kg(e, t) {
  return Re(ts(e, t), 1);
}
var gN = 1 / 0;
function Gg(e, t) {
  return Re(ts(e, t), gN);
}
function Hg(e, t, n) {
  return n = n === void 0 ? 1 : I(n), Re(ts(e, t), n);
}
var yN = 1 / 0;
function Kg(e) {
  var t = e == null ? 0 : e.length;
  return t ? Re(e, yN) : [];
}
function Yg(e, t) {
  var n = e == null ? 0 : e.length;
  return n ? (t = t === void 0 ? 1 : I(t), Re(e, t)) : [];
}
var bN = 512;
function Xg(e) {
  return Fn(e, bN);
}
var Jg = Kc("floor"), mN = "Expected a function", wN = 8, AN = 32, ON = 128, EN = 256;
function Zg(e) {
  return Un(function(t) {
    var n = t.length, r = n, i = Nt.prototype.thru;
    for (e && t.reverse(); r--; ) {
      var o = t[r];
      if (typeof o != "function")
        throw new TypeError(mN);
      if (i && !s && ea(o) == "wrapper")
        var s = new Nt([], !0);
    }
    for (r = s ? r : n; ++r < n; ) {
      o = t[r];
      var a = ea(o), u = a == "wrapper" ? Ic(o) : void 0;
      u && $f(u[0]) && u[1] == (ON | wN | AN | EN) && !u[4].length && u[9] == 1 ? s = s[ea(u[0])].apply(s, u[3]) : s = o.length == 1 && $f(o) ? s[a]() : s.thru(o);
    }
    return function() {
      var f = arguments, c = f[0];
      if (s && f.length == 1 && M(c))
        return s.plant(c).value();
      for (var l = 0, h = n ? t[l].apply(this, f) : c; ++l < n; )
        h = t[l].call(this, h);
      return h;
    };
  });
}
var Qg = Zg(), e0 = Zg(!0);
function t0(e, t) {
  return e == null ? e : al(e, vn(t), We);
}
function n0(e, t) {
  return e == null ? e : xg(e, vn(t), We);
}
function r0(e, t) {
  return e && _n(e, vn(t));
}
function i0(e, t) {
  return e && hl(e, vn(t));
}
function o0(e) {
  for (var t = -1, n = e == null ? 0 : e.length, r = {}; ++t < n; ) {
    var i = e[t];
    r[i[0]] = i[1];
  }
  return r;
}
function uu(e, t) {
  return ur(t, function(n) {
    return hn(e[n]);
  });
}
function s0(e) {
  return e == null ? [] : uu(e, pe(e));
}
function a0(e) {
  return e == null ? [] : uu(e, We(e));
}
var SN = Object.prototype, xN = SN.hasOwnProperty, u0 = ru(function(e, t, n) {
  xN.call(e, n) ? e[n].push(t) : jn(e, n, [t]);
});
function gl(e, t) {
  return e > t;
}
function fu(e) {
  return function(t, n) {
    return typeof t == "string" && typeof n == "string" || (t = at(t), n = at(n)), e(t, n);
  };
}
var f0 = fu(gl), c0 = fu(function(e, t) {
  return e >= t;
}), RN = Object.prototype, TN = RN.hasOwnProperty;
function $N(e, t) {
  return e != null && TN.call(e, t);
}
function l0(e, t) {
  return e != null && eg(e, t, $N);
}
var NN = Math.max, MN = Math.min;
function PN(e, t, n) {
  return e >= MN(t, n) && e < NN(t, n);
}
function h0(e, t, n) {
  return t = rn(t), n === void 0 ? (n = t, t = 0) : n = rn(n), e = at(e), PN(e, t, n);
}
var IN = "[object String]";
function ns(e) {
  return typeof e == "string" || !M(e) && ie(e) && Ue(e) == IN;
}
function yl(e, t) {
  return ne(t, function(n) {
    return e[n];
  });
}
function Fr(e) {
  return e == null ? [] : yl(e, pe(e));
}
var CN = Math.max;
function p0(e, t, n, r) {
  e = qe(e) ? e : Fr(e), n = n && !r ? I(n) : 0;
  var i = e.length;
  return n < 0 && (n = CN(i + n, 0)), ns(e) ? n <= i && e.indexOf(t, n) > -1 : !!i && Ti(e, t, n) > -1;
}
var DN = Math.max;
function d0(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = n == null ? 0 : I(n);
  return i < 0 && (i = DN(r + i, 0)), Ti(e, t, i);
}
function _0(e) {
  var t = e == null ? 0 : e.length;
  return t ? Pt(e, 0, -1) : [];
}
var LN = Math.min;
function bl(e, t, n) {
  for (var r = n ? ll : Wa, i = e[0].length, o = e.length, s = o, a = Array(o), u = 1 / 0, f = []; s--; ) {
    var c = e[s];
    s && t && (c = ne(c, dt(t))), u = LN(c.length, u), a[s] = !n && (t || i >= 120 && c.length >= 120) ? new wr(s && c) : void 0;
  }
  c = e[0];
  var l = -1, h = a[0];
  e:
    for (; ++l < i && f.length < u; ) {
      var d = c[l], _ = t ? t(d) : d;
      if (d = n || d !== 0 ? d : 0, !(h ? xo(h, _) : r(f, _, n))) {
        for (s = o; --s; ) {
          var v = a[s];
          if (!(v ? xo(v, _) : r(e[s], _, n)))
            continue e;
        }
        h && h.push(_), f.push(d);
      }
    }
  return f;
}
function ml(e) {
  return se(e) ? e : [];
}
var v0 = C(function(e) {
  var t = ne(e, ml);
  return t.length && t[0] === e[0] ? bl(t) : [];
}), g0 = C(function(e) {
  var t = _t(e), n = ne(e, ml);
  return t === _t(n) ? t = void 0 : n.pop(), n.length && n[0] === e[0] ? bl(n, N(t)) : [];
}), y0 = C(function(e) {
  var t = _t(e), n = ne(e, ml);
  return t = typeof t == "function" ? t : void 0, t && n.pop(), n.length && n[0] === e[0] ? bl(n, void 0, t) : [];
});
function FN(e, t, n, r) {
  return _n(e, function(i, o, s) {
    t(r, n(i), o, s);
  }), r;
}
function b0(e, t) {
  return function(n, r) {
    return FN(n, e, t(r), {});
  };
}
var jN = Object.prototype, BN = jN.toString, m0 = b0(function(e, t, n) {
  t != null && typeof t.toString != "function" && (t = BN.call(t)), e[t] = n;
}, Va(Ve)), w0 = Object.prototype, zN = w0.hasOwnProperty, UN = w0.toString, A0 = b0(function(e, t, n) {
  t != null && typeof t.toString != "function" && (t = UN.call(t)), zN.call(e, t) ? e[t].push(n) : e[t] = [n];
}, N);
function O0(e, t) {
  return t.length < 2 ? e : Dr(e, Pt(t, 0, -1));
}
function rs(e, t, n) {
  t = or(t, e), e = O0(e, t);
  var r = e == null ? e : e[dn(_t(t))];
  return r == null ? void 0 : pt(r, e, n);
}
var E0 = C(rs), S0 = C(function(e, t, n) {
  var r = -1, i = typeof t == "function", o = qe(e) ? Array(e.length) : [];
  return fr(e, function(s) {
    o[++r] = i ? pt(t, s, n) : rs(s, t, n);
  }), o;
}), VN = "[object ArrayBuffer]";
function qN(e) {
  return ie(e) && Ue(e) == VN;
}
var Kp = Mt && Mt.isArrayBuffer, x0 = Kp ? dt(Kp) : qN, WN = "[object Boolean]";
function R0(e) {
  return e === !0 || e === !1 || ie(e) && Ue(e) == WN;
}
var kN = "[object Date]";
function GN(e) {
  return ie(e) && Ue(e) == kN;
}
var Yp = Mt && Mt.isDate, T0 = Yp ? dt(Yp) : GN;
function $0(e) {
  return ie(e) && e.nodeType === 1 && !Mi(e);
}
var HN = "[object Map]", KN = "[object Set]", YN = Object.prototype, XN = YN.hasOwnProperty;
function N0(e) {
  if (e == null)
    return !0;
  if (qe(e) && (M(e) || typeof e == "string" || typeof e.splice == "function" || In(e) || Cr(e) || Zn(e)))
    return !e.length;
  var t = sn(e);
  if (t == HN || t == KN)
    return !e.size;
  if (Xo(e))
    return !Fc(e).length;
  for (var n in e)
    if (XN.call(e, n))
      return !1;
  return !0;
}
function M0(e, t) {
  return Qo(e, t);
}
function P0(e, t, n) {
  n = typeof n == "function" ? n : void 0;
  var r = n ? n(e, t) : void 0;
  return r === void 0 ? Qo(e, t, void 0, n) : !!r;
}
var JN = Ae.isFinite;
function I0(e) {
  return typeof e == "number" && JN(e);
}
function wl(e) {
  return typeof e == "number" && e == I(e);
}
function C0(e, t) {
  return e === t || rl(e, t, il(t));
}
function D0(e, t, n) {
  return n = typeof n == "function" ? n : void 0, rl(e, t, il(t), n);
}
var ZN = "[object Number]";
function Al(e) {
  return typeof e == "number" || ie(e) && Ue(e) == ZN;
}
function L0(e) {
  return Al(e) && e != +e;
}
var QN = Qs ? hn : Ga, eM = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.";
function F0(e) {
  if (QN(e))
    throw new Error(eM);
  return U_(e);
}
function j0(e) {
  return e == null;
}
function B0(e) {
  return e === null;
}
var tM = "[object RegExp]";
function nM(e) {
  return ie(e) && Ue(e) == tM;
}
var Xp = Mt && Mt.isRegExp, cu = Xp ? dt(Xp) : nM, Jp = 9007199254740991;
function z0(e) {
  return wl(e) && e >= -Jp && e <= Jp;
}
function U0(e) {
  return e === void 0;
}
var rM = "[object WeakMap]";
function V0(e) {
  return ie(e) && sn(e) == rM;
}
var iM = "[object WeakSet]";
function q0(e) {
  return ie(e) && Ue(e) == iM;
}
var oM = 1;
function W0(e) {
  return N(typeof e == "function" ? e : Rt(e, oM));
}
var sM = Array.prototype, aM = sM.join;
function k0(e, t) {
  return e == null ? "" : aM.call(e, t);
}
var G0 = Ii(function(e, t, n) {
  return e + (n ? "-" : "") + t.toLowerCase();
}), H0 = ru(function(e, t, n) {
  jn(e, n, t);
});
function uM(e, t, n) {
  for (var r = n + 1; r--; )
    if (e[r] === t)
      return r;
  return r;
}
var fM = Math.max, cM = Math.min;
function K0(e, t, n) {
  var r = e == null ? 0 : e.length;
  if (!r)
    return -1;
  var i = r;
  return n !== void 0 && (i = I(n), i = i < 0 ? fM(r + i, 0) : cM(i, r - 1)), t === t ? uM(e, t, i) : qa(e, K_, i, !0);
}
var Y0 = Ii(function(e, t, n) {
  return e + (n ? " " : "") + t.toLowerCase();
}), X0 = _v("toLowerCase");
function Ol(e, t) {
  return e < t;
}
var J0 = fu(Ol), Z0 = fu(function(e, t) {
  return e <= t;
});
function Q0(e, t) {
  var n = {};
  return t = N(t), _n(e, function(r, i, o) {
    jn(n, t(r, i, o), r);
  }), n;
}
function ey(e, t) {
  var n = {};
  return t = N(t), _n(e, function(r, i, o) {
    jn(n, i, t(r, i, o));
  }), n;
}
var lM = 1;
function ty(e) {
  return Qv(Rt(e, lM));
}
var hM = 1;
function ny(e, t) {
  return tg(e, Rt(t, hM));
}
function lu(e, t, n) {
  for (var r = -1, i = e.length; ++r < i; ) {
    var o = e[r], s = t(o);
    if (s != null && (a === void 0 ? s === s && !Qe(s) : n(s, a)))
      var a = s, u = o;
  }
  return u;
}
function ry(e) {
  return e && e.length ? lu(e, Ve, gl) : void 0;
}
function iy(e, t) {
  return e && e.length ? lu(e, N(t), gl) : void 0;
}
function El(e, t) {
  for (var n, r = -1, i = e.length; ++r < i; ) {
    var o = t(e[r]);
    o !== void 0 && (n = n === void 0 ? o : n + o);
  }
  return n;
}
var pM = NaN;
function oy(e, t) {
  var n = e == null ? 0 : e.length;
  return n ? El(e, t) / n : pM;
}
function sy(e) {
  return oy(e, Ve);
}
function ay(e, t) {
  return oy(e, N(t));
}
var uy = Ni(function(e, t, n) {
  su(e, t, n);
}), fy = C(function(e, t) {
  return function(n) {
    return rs(n, e, t);
  };
}), cy = C(function(e, t) {
  return function(n) {
    return rs(e, n, t);
  };
});
function ly(e) {
  return e && e.length ? lu(e, Ve, Ol) : void 0;
}
function hy(e, t) {
  return e && e.length ? lu(e, N(t), Ol) : void 0;
}
function py(e, t, n) {
  var r = pe(t), i = uu(t, r), o = !(re(n) && "chain" in n) || !!n.chain, s = hn(e);
  return Ct(i, function(a) {
    var u = t[a];
    e[a] = u, s && (e.prototype[a] = function() {
      var f = this.__chain__;
      if (o || f) {
        var c = e(this.__wrapped__), l = c.__actions__ = Je(this.__actions__);
        return l.push({ func: u, args: arguments, thisArg: e }), c.__chain__ = f, c;
      }
      return u.apply(e, sr([this.value()], arguments));
    });
  }), e;
}
var dy = Ba(function(e, t) {
  return e * t;
}, 1), dM = "Expected a function";
function is(e) {
  if (typeof e != "function")
    throw new TypeError(dM);
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
function _M(e) {
  for (var t, n = []; !(t = e.next()).done; )
    n.push(t.value);
  return n;
}
var vM = "[object Map]", gM = "[object Set]", nf = Ne ? Ne.iterator : void 0;
function Sl(e) {
  if (!e)
    return [];
  if (qe(e))
    return ns(e) ? Gt(e) : Je(e);
  if (nf && e[nf])
    return _M(e[nf]());
  var t = sn(e), n = t == vM ? nl : t == gM ? tu : Fr;
  return n(e);
}
function Wf() {
  this.__values__ === void 0 && (this.__values__ = Sl(this.value()));
  var e = this.__index__ >= this.__values__.length, t = e ? void 0 : this.__values__[this.__index__++];
  return { done: e, value: t };
}
function _y(e, t) {
  var n = e.length;
  if (n)
    return t += t < 0 ? n : 0, Ln(t, n) ? e[t] : void 0;
}
function vy(e, t) {
  return e && e.length ? _y(e, I(t)) : void 0;
}
function gy(e) {
  return e = I(e), C(function(t) {
    return _y(t, e);
  });
}
function xl(e, t) {
  return t = or(t, e), e = O0(e, t), e == null || delete e[dn(_t(t))];
}
function yM(e) {
  return Mi(e) ? void 0 : e;
}
var bM = 1, mM = 2, wM = 4, yy = Un(function(e, t) {
  var n = {};
  if (e == null)
    return n;
  var r = !1;
  t = ne(t, function(o) {
    return o = or(o, e), r || (r = o.length > 1), o;
  }), pn(e, Jc(e), n), r && (n = Rt(n, bM | mM | wM, yM));
  for (var i = t.length; i--; )
    xl(n, t[i]);
  return n;
});
function os(e, t, n, r) {
  if (!re(e))
    return e;
  t = or(t, e);
  for (var i = -1, o = t.length, s = o - 1, a = e; a != null && ++i < o; ) {
    var u = dn(t[i]), f = n;
    if (u === "__proto__" || u === "constructor" || u === "prototype")
      return e;
    if (i != s) {
      var c = a[u];
      f = r ? r(c, u, a) : void 0, f === void 0 && (f = re(c) ? c : Ln(t[i + 1]) ? [] : {});
    }
    Ko(a, u, f), a = a[u];
  }
  return e;
}
function by(e, t, n) {
  for (var r = -1, i = t.length, o = {}; ++r < i; ) {
    var s = t[r], a = Dr(e, s);
    n(a, s) && os(o, or(s, e), a);
  }
  return o;
}
function Rl(e, t) {
  if (e == null)
    return {};
  var n = ne(Jc(e), function(r) {
    return [r];
  });
  return t = N(t), by(e, n, function(r, i) {
    return t(r, i[0]);
  });
}
function my(e, t) {
  return Rl(e, is(N(t)));
}
function wy(e) {
  return Vc(2, e);
}
function AM(e, t) {
  var n = e.length;
  for (e.sort(t); n--; )
    e[n] = e[n].value;
  return e;
}
function Ay(e, t) {
  if (e !== t) {
    var n = e !== void 0, r = e === null, i = e === e, o = Qe(e), s = t !== void 0, a = t === null, u = t === t, f = Qe(t);
    if (!a && !f && !o && e > t || o && s && u && !a && !f || r && s && u || !n && u || !i)
      return 1;
    if (!r && !o && !f && e < t || f && n && i && !r && !o || a && n && i || !s && i || !u)
      return -1;
  }
  return 0;
}
function OM(e, t, n) {
  for (var r = -1, i = e.criteria, o = t.criteria, s = i.length, a = n.length; ++r < s; ) {
    var u = Ay(i[r], o[r]);
    if (u) {
      if (r >= a)
        return u;
      var f = n[r];
      return u * (f == "desc" ? -1 : 1);
    }
  }
  return e.index - t.index;
}
function Oy(e, t, n) {
  t.length ? t = ne(t, function(o) {
    return M(o) ? function(s) {
      return Dr(s, o.length === 1 ? o[0] : o);
    } : o;
  }) : t = [Ve];
  var r = -1;
  t = ne(t, dt(N));
  var i = Wg(e, function(o, s, a) {
    var u = ne(t, function(f) {
      return f(o);
    });
    return { criteria: u, index: ++r, value: o };
  });
  return AM(i, function(o, s) {
    return OM(o, s, n);
  });
}
function Ey(e, t, n, r) {
  return e == null ? [] : (M(t) || (t = t == null ? [] : [t]), n = r ? void 0 : n, M(n) || (n = n == null ? [] : [n]), Oy(e, t, n));
}
function Tl(e) {
  return Un(function(t) {
    return t = ne(t, dt(N)), C(function(n) {
      var r = this;
      return e(t, function(i) {
        return pt(i, r, n);
      });
    });
  });
}
var Sy = Tl(ne), EM = C, SM = Math.min, xy = EM(function(e, t) {
  t = t.length == 1 && M(t[0]) ? ne(t[0], dt(N)) : ne(Re(t, 1), dt(N));
  var n = t.length;
  return C(function(r) {
    for (var i = -1, o = SM(r.length, n); ++i < o; )
      r[i] = t[i].call(this, r[i]);
    return pt(e, this, r);
  });
}), Ry = Tl(Ig), Ty = Tl(tl), xM = 9007199254740991, RM = Math.floor;
function kf(e, t) {
  var n = "";
  if (!e || t < 1 || t > xM)
    return n;
  do
    t % 2 && (n += e), t = RM(t / 2), t && (e += e);
  while (t);
  return n;
}
var TM = ol("length"), $y = "\\ud800-\\udfff", $M = "\\u0300-\\u036f", NM = "\\ufe20-\\ufe2f", MM = "\\u20d0-\\u20ff", PM = $M + NM + MM, IM = "\\ufe0e\\ufe0f", CM = "[" + $y + "]", Gf = "[" + PM + "]", Hf = "\\ud83c[\\udffb-\\udfff]", DM = "(?:" + Gf + "|" + Hf + ")", Ny = "[^" + $y + "]", My = "(?:\\ud83c[\\udde6-\\uddff]){2}", Py = "[\\ud800-\\udbff][\\udc00-\\udfff]", LM = "\\u200d", Iy = DM + "?", Cy = "[" + IM + "]?", FM = "(?:" + LM + "(?:" + [Ny, My, Py].join("|") + ")" + Cy + Iy + ")*", jM = Cy + Iy + FM, BM = "(?:" + [Ny + Gf + "?", Gf, My, Py, CM].join("|") + ")", Zp = RegExp(Hf + "(?=" + Hf + ")|" + BM + jM, "g");
function zM(e) {
  for (var t = Zp.lastIndex = 0; Zp.test(e); )
    ++t;
  return t;
}
function Ci(e) {
  return Pi(e) ? zM(e) : TM(e);
}
var UM = Math.ceil;
function la(e, t) {
  t = t === void 0 ? " " : ht(t);
  var n = t.length;
  if (n < 2)
    return n ? kf(t, e) : t;
  var r = kf(t, UM(e / Ci(t)));
  return Pi(t) ? ar(Gt(r), 0, e).join("") : r.slice(0, e);
}
var VM = Math.ceil, qM = Math.floor;
function Dy(e, t, n) {
  e = V(e), t = I(t);
  var r = t ? Ci(e) : 0;
  if (!t || r >= t)
    return e;
  var i = (t - r) / 2;
  return la(qM(i), n) + e + la(VM(i), n);
}
function Ly(e, t, n) {
  e = V(e), t = I(t);
  var r = t ? Ci(e) : 0;
  return t && r < t ? e + la(t - r, n) : e;
}
function Fy(e, t, n) {
  e = V(e), t = I(t);
  var r = t ? Ci(e) : 0;
  return t && r < t ? la(t - r, n) + e : e;
}
var WM = /^\s+/, kM = Ae.parseInt;
function jy(e, t, n) {
  return n || t == null ? t = 0 : t && (t = +t), kM(V(e).replace(WM, ""), t || 0);
}
var GM = 32, ss = C(function(e, t) {
  var n = Jn(t, $i(ss));
  return Fn(e, GM, void 0, t, n);
});
ss.placeholder = {};
var HM = 64, hu = C(function(e, t) {
  var n = Jn(t, $i(hu));
  return Fn(e, HM, void 0, t, n);
});
hu.placeholder = {};
var By = ru(function(e, t, n) {
  e[n ? 0 : 1].push(t);
}, function() {
  return [[], []];
});
function KM(e, t) {
  return by(e, t, function(n, r) {
    return nu(e, r);
  });
}
var zy = Un(function(e, t) {
  return e == null ? {} : KM(e, t);
});
function Kf(e) {
  for (var t, n = this; n instanceof za; ) {
    var r = k_(n);
    r.__index__ = 0, r.__values__ = void 0, t ? i.__wrapped__ = r : t = r;
    var i = r;
    n = n.__wrapped__;
  }
  return i.__wrapped__ = e, t;
}
function Uy(e) {
  return function(t) {
    return e == null ? void 0 : Dr(e, t);
  };
}
function YM(e, t, n, r) {
  for (var i = n - 1, o = e.length; ++i < o; )
    if (r(e[i], t))
      return i;
  return -1;
}
var XM = Array.prototype, Qp = XM.splice;
function $l(e, t, n, r) {
  var i = r ? YM : Ti, o = -1, s = t.length, a = e;
  for (e === t && (t = Je(t)), n && (a = ne(e, dt(n))); ++o < s; )
    for (var u = 0, f = t[o], c = n ? n(f) : f; (u = i(a, c, u, r)) > -1; )
      a !== e && Qp.call(a, u, 1), Qp.call(e, u, 1);
  return e;
}
function Nl(e, t) {
  return e && e.length && t && t.length ? $l(e, t) : e;
}
var Vy = C(Nl);
function qy(e, t, n) {
  return e && e.length && t && t.length ? $l(e, t, N(n)) : e;
}
function Wy(e, t, n) {
  return e && e.length && t && t.length ? $l(e, t, void 0, n) : e;
}
var JM = Array.prototype, ZM = JM.splice;
function ky(e, t) {
  for (var n = e ? t.length : 0, r = n - 1; n--; ) {
    var i = t[n];
    if (n == r || i !== o) {
      var o = i;
      Ln(i) ? ZM.call(e, i, 1) : xl(e, i);
    }
  }
  return e;
}
var Gy = Un(function(e, t) {
  var n = e == null ? 0 : e.length, r = Bc(e, t);
  return ky(e, ne(t, function(i) {
    return Ln(i, n) ? +i : i;
  }).sort(Ay)), r;
}), QM = Math.floor, eP = Math.random;
function Ml(e, t) {
  return e + QM(eP() * (t - e + 1));
}
var tP = parseFloat, nP = Math.min, rP = Math.random;
function Hy(e, t, n) {
  if (n && typeof n != "boolean" && Be(e, t, n) && (t = n = void 0), n === void 0 && (typeof t == "boolean" ? (n = t, t = void 0) : typeof e == "boolean" && (n = e, e = void 0)), e === void 0 && t === void 0 ? (e = 0, t = 1) : (e = rn(e), t === void 0 ? (t = e, e = 0) : t = rn(t)), e > t) {
    var r = e;
    e = t, t = r;
  }
  if (n || e % 1 || t % 1) {
    var i = rP();
    return nP(e + i * (t - e + tP("1e-" + ((i + "").length - 1))), t);
  }
  return Ml(e, t);
}
var iP = Math.ceil, oP = Math.max;
function sP(e, t, n, r) {
  for (var i = -1, o = oP(iP((t - e) / (n || 1)), 0), s = Array(o); o--; )
    s[r ? o : ++i] = e, e += n;
  return s;
}
function Ky(e) {
  return function(t, n, r) {
    return r && typeof r != "number" && Be(t, n, r) && (n = r = void 0), t = rn(t), n === void 0 ? (n = t, t = 0) : n = rn(n), r = r === void 0 ? t < n ? 1 : -1 : rn(r), sP(t, n, r, e);
  };
}
var Yy = Ky(), Xy = Ky(!0), aP = 256, Jy = Un(function(e, t) {
  return Fn(e, aP, void 0, void 0, void 0, t);
});
function Zy(e, t, n, r, i) {
  return i(e, function(o, s, a) {
    n = r ? (r = !1, o) : t(n, o, s, a);
  }), n;
}
function Qy(e, t, n) {
  var r = M(e) ? Wc : Zy, i = arguments.length < 3;
  return r(e, N(t), n, i, fr);
}
function uP(e, t, n, r) {
  var i = e == null ? 0 : e.length;
  for (r && i && (n = e[--i]); i--; )
    n = t(n, e[i], i, e);
  return n;
}
function eb(e, t, n) {
  var r = M(e) ? uP : Zy, i = arguments.length < 3;
  return r(e, N(t), n, i, Rg);
}
function tb(e, t) {
  var n = M(e) ? ur : Lg;
  return n(e, is(N(t)));
}
function nb(e, t) {
  var n = [];
  if (!(e && e.length))
    return n;
  var r = -1, i = [], o = e.length;
  for (t = N(t); ++r < o; ) {
    var s = e[r];
    t(s, r, e) && (n.push(s), i.push(r));
  }
  return ky(e, i), n;
}
function rb(e, t, n) {
  return (n ? Be(e, t, n) : t === void 0) ? t = 1 : t = I(t), kf(V(e), t);
}
function ib() {
  var e = arguments, t = V(e[0]);
  return e.length < 3 ? t : t.replace(e[1], e[2]);
}
var fP = "Expected a function";
function ob(e, t) {
  if (typeof e != "function")
    throw new TypeError(fP);
  return t = t === void 0 ? t : I(t), C(e, t);
}
function sb(e, t, n) {
  t = or(t, e);
  var r = -1, i = t.length;
  for (i || (i = 1, e = void 0); ++r < i; ) {
    var o = e?.[dn(t[r])];
    o === void 0 && (r = i, o = n), e = hn(o) ? o.call(e) : o;
  }
  return e;
}
var cP = Array.prototype, lP = cP.reverse;
function ha(e) {
  return e == null ? e : lP.call(e);
}
var ab = Kc("round");
function ub(e) {
  var t = e.length;
  return t ? e[Ml(0, t - 1)] : void 0;
}
function hP(e) {
  return ub(Fr(e));
}
function fb(e) {
  var t = M(e) ? ub : hP;
  return t(e);
}
function pu(e, t) {
  var n = -1, r = e.length, i = r - 1;
  for (t = t === void 0 ? r : t; ++n < t; ) {
    var o = Ml(n, i), s = e[o];
    e[o] = e[n], e[n] = s;
  }
  return e.length = t, e;
}
function pP(e, t) {
  return pu(Je(e), Lr(t, 0, e.length));
}
function dP(e, t) {
  var n = Fr(e);
  return pu(n, Lr(t, 0, n.length));
}
function cb(e, t, n) {
  (n ? Be(e, t, n) : t === void 0) ? t = 1 : t = I(t);
  var r = M(e) ? pP : dP;
  return r(e, t);
}
function lb(e, t, n) {
  return e == null ? e : os(e, t, n);
}
function hb(e, t, n, r) {
  return r = typeof r == "function" ? r : void 0, e == null ? e : os(e, t, n, r);
}
function _P(e) {
  return pu(Je(e));
}
function vP(e) {
  return pu(Fr(e));
}
function pb(e) {
  var t = M(e) ? _P : vP;
  return t(e);
}
var gP = "[object Map]", yP = "[object Set]";
function db(e) {
  if (e == null)
    return 0;
  if (qe(e))
    return ns(e) ? Ci(e) : e.length;
  var t = sn(e);
  return t == gP || t == yP ? e.size : Fc(e).length;
}
function _b(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (n && typeof n != "number" && Be(e, t, n) ? (t = 0, n = r) : (t = t == null ? 0 : I(t), n = n === void 0 ? r : I(n)), Pt(e, t, n)) : [];
}
var vb = Ii(function(e, t, n) {
  return e + (n ? "_" : "") + t.toLowerCase();
});
function bP(e, t) {
  var n;
  return fr(e, function(r, i, o) {
    return n = t(r, i, o), !n;
  }), !!n;
}
function gb(e, t, n) {
  var r = M(e) ? tl : bP;
  return n && Be(e, t, n) && (t = void 0), r(e, N(t));
}
var yb = C(function(e, t) {
  if (e == null)
    return [];
  var n = t.length;
  return n > 1 && Be(e, t[0], t[1]) ? t = [] : n > 2 && Be(t[0], t[1], t[2]) && (t = [t[0]]), Oy(e, Re(t, 1), []);
}), mP = 4294967295, wP = mP - 1, AP = Math.floor, OP = Math.min;
function Pl(e, t, n, r) {
  var i = 0, o = e == null ? 0 : e.length;
  if (o === 0)
    return 0;
  t = n(t);
  for (var s = t !== t, a = t === null, u = Qe(t), f = t === void 0; i < o; ) {
    var c = AP((i + o) / 2), l = n(e[c]), h = l !== void 0, d = l === null, _ = l === l, v = Qe(l);
    if (s)
      var g = r || _;
    else f ? g = _ && (r || h) : a ? g = _ && h && (r || !d) : u ? g = _ && h && !d && (r || !v) : d || v ? g = !1 : g = r ? l <= t : l < t;
    g ? i = c + 1 : o = c;
  }
  return OP(o, wP);
}
var EP = 4294967295, SP = EP >>> 1;
function du(e, t, n) {
  var r = 0, i = e == null ? r : e.length;
  if (typeof t == "number" && t === t && i <= SP) {
    for (; r < i; ) {
      var o = r + i >>> 1, s = e[o];
      s !== null && !Qe(s) && (n ? s <= t : s < t) ? r = o + 1 : i = o;
    }
    return i;
  }
  return Pl(e, t, Ve, n);
}
function bb(e, t) {
  return du(e, t);
}
function mb(e, t, n) {
  return Pl(e, t, N(n));
}
function wb(e, t) {
  var n = e == null ? 0 : e.length;
  if (n) {
    var r = du(e, t);
    if (r < n && Dt(e[r], t))
      return r;
  }
  return -1;
}
function Ab(e, t) {
  return du(e, t, !0);
}
function Ob(e, t, n) {
  return Pl(e, t, N(n), !0);
}
function Eb(e, t) {
  var n = e == null ? 0 : e.length;
  if (n) {
    var r = du(e, t, !0) - 1;
    if (Dt(e[r], t))
      return r;
  }
  return -1;
}
function Sb(e, t) {
  for (var n = -1, r = e.length, i = 0, o = []; ++n < r; ) {
    var s = e[n], a = t ? t(s) : s;
    if (!n || !Dt(a, u)) {
      var u = a;
      o[i++] = s === 0 ? 0 : s;
    }
  }
  return o;
}
function xb(e) {
  return e && e.length ? Sb(e) : [];
}
function Rb(e, t) {
  return e && e.length ? Sb(e, N(t)) : [];
}
var xP = 4294967295;
function Tb(e, t, n) {
  return n && typeof n != "number" && Be(e, t, n) && (t = n = void 0), n = n === void 0 ? xP : n >>> 0, n ? (e = V(e), e && (typeof t == "string" || t != null && !cu(t)) && (t = ht(t), !t && Pi(e)) ? ar(Gt(e), 0, n) : e.split(t, n)) : [];
}
var RP = "Expected a function", TP = Math.max;
function $b(e, t) {
  if (typeof e != "function")
    throw new TypeError(RP);
  return t = t == null ? 0 : TP(I(t), 0), C(function(n) {
    var r = n[t], i = ar(n, 0, t);
    return r && sr(i, r), pt(e, this, i);
  });
}
var Nb = Ii(function(e, t, n) {
  return e + (n ? " " : "") + Qa(t);
});
function Mb(e, t, n) {
  return e = V(e), n = n == null ? 0 : Lr(I(n), 0, e.length), t = ht(t), e.slice(n, n + t.length) == t;
}
function Pb() {
  return {};
}
function Ib() {
  return "";
}
function Cb() {
  return !0;
}
var Db = Ba(function(e, t) {
  return e - t;
}, 0);
function Lb(e) {
  return e && e.length ? El(e, Ve) : 0;
}
function Fb(e, t) {
  return e && e.length ? El(e, N(t)) : 0;
}
function jb(e) {
  var t = e == null ? 0 : e.length;
  return t ? Pt(e, 1, t) : [];
}
function Bb(e, t, n) {
  return e && e.length ? (t = n || t === void 0 ? 1 : I(t), Pt(e, 0, t < 0 ? 0 : t)) : [];
}
function zb(e, t, n) {
  var r = e == null ? 0 : e.length;
  return r ? (t = n || t === void 0 ? 1 : I(t), t = r - t, Pt(e, t < 0 ? 0 : t, r)) : [];
}
function Ub(e, t) {
  return e && e.length ? au(e, N(t), !1, !0) : [];
}
function Vb(e, t) {
  return e && e.length ? au(e, N(t)) : [];
}
function qb(e, t) {
  return t(e), e;
}
var Wb = Object.prototype, $P = Wb.hasOwnProperty;
function ed(e, t, n, r) {
  return e === void 0 || Dt(e, Wb[n]) && !$P.call(r, n) ? t : e;
}
var NP = {
  "\\": "\\",
  "'": "'",
  "\n": "n",
  "\r": "r",
  "\u2028": "u2028",
  "\u2029": "u2029"
};
function MP(e) {
  return "\\" + NP[e];
}
var kb = /<%=([\s\S]+?)%>/g, PP = /<%-([\s\S]+?)%>/g, IP = /<%([\s\S]+?)%>/g, pa = {
  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  escape: PP,
  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  evaluate: IP,
  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  interpolate: kb,
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
    _: { escape: pl }
  }
}, CP = "Invalid `variable` option passed into `_.template`", DP = /\b__p \+= '';/g, LP = /\b(__p \+=) '' \+/g, FP = /(__e\(.*?\)|\b__t\)) \+\n'';/g, jP = /[()=,{}\[\]\/\s]/, BP = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Ls = /($^)/, zP = /['\n\r\u2028\u2029\\]/g, UP = Object.prototype, td = UP.hasOwnProperty;
function Gb(e, t, n) {
  var r = pa.imports._.templateSettings || pa;
  n && Be(e, t, n) && (t = void 0), e = V(e), t = Oo({}, t, r, ed);
  var i = Oo({}, t.imports, r.imports, ed), o = pe(i), s = yl(i, o), a, u, f = 0, c = t.interpolate || Ls, l = "__p += '", h = RegExp(
    (t.escape || Ls).source + "|" + c.source + "|" + (c === kb ? BP : Ls).source + "|" + (t.evaluate || Ls).source + "|$",
    "g"
  ), d = td.call(t, "sourceURL") ? "//# sourceURL=" + (t.sourceURL + "").replace(/\s/g, " ") + `
` : "";
  e.replace(h, function(g, y, b, w, m, A) {
    return b || (b = w), l += e.slice(f, A).replace(zP, MP), y && (a = !0, l += `' +
__e(` + y + `) +
'`), m && (u = !0, l += `';
` + m + `;
__p += '`), b && (l += `' +
((__t = (` + b + `)) == null ? '' : __t) +
'`), f = A + g.length, g;
  }), l += `';
`;
  var _ = td.call(t, "variable") && t.variable;
  if (!_)
    l = `with (obj) {
` + l + `
}
`;
  else if (jP.test(_))
    throw new Error(CP);
  l = (u ? l.replace(DP, "") : l).replace(LP, "$1").replace(FP, "$1;"), l = "function(" + (_ || "obj") + `) {
` + (_ ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (a ? ", __e = _.escape" : "") + (u ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + l + `return __p
}`;
  var v = Uc(function() {
    return Function(o, d + "return " + l).apply(void 0, s);
  });
  if (v.source = l, Ja(v))
    throw v;
  return v;
}
var VP = "Expected a function";
function Hb(e, t, n) {
  var r = !0, i = !0;
  if (typeof e != "function")
    throw new TypeError(VP);
  return re(n) && (r = "leading" in n ? !!n.leading : r, i = "trailing" in n ? !!n.trailing : i), ul(e, t, {
    leading: r,
    maxWait: t,
    trailing: i
  });
}
function as(e, t) {
  return t(e);
}
var qP = 9007199254740991, rf = 4294967295, WP = Math.min;
function Kb(e, t) {
  if (e = I(e), e < 1 || e > qP)
    return [];
  var n = rf, r = WP(e, rf);
  t = vn(t), e -= rf;
  for (var i = Lc(r, t); ++n < e; )
    t(n);
  return i;
}
function Yf() {
  return this;
}
function Yb(e, t) {
  var n = e;
  return n instanceof D && (n = n.value()), Wc(t, function(r, i) {
    return i.func.apply(i.thisArg, sr([r], i.args));
  }, n);
}
function no() {
  return Yb(this.__wrapped__, this.__actions__);
}
function Xb(e) {
  return V(e).toLowerCase();
}
function Jb(e) {
  return M(e) ? ne(e, dn) : Qe(e) ? [e] : Je(ov(V(e)));
}
var nd = 9007199254740991;
function Zb(e) {
  return e ? Lr(I(e), -nd, nd) : e === 0 ? e : 0;
}
function Qb(e) {
  return V(e).toUpperCase();
}
function em(e, t, n) {
  var r = M(e), i = r || In(e) || Cr(e);
  if (t = N(t), n == null) {
    var o = e && e.constructor;
    i ? n = r ? new o() : [] : re(e) ? n = hn(o) ? Ri(Xa(e)) : {} : n = {};
  }
  return (i ? Ct : _n)(e, function(s, a, u) {
    return t(n, s, a, u);
  }), n;
}
function tm(e, t) {
  for (var n = e.length; n-- && Ti(t, e[n], 0) > -1; )
    ;
  return n;
}
function nm(e, t) {
  for (var n = -1, r = e.length; ++n < r && Ti(t, e[n], 0) > -1; )
    ;
  return n;
}
function rm(e, t, n) {
  if (e = V(e), e && (n || t === void 0))
    return B_(e);
  if (!e || !(t = ht(t)))
    return e;
  var r = Gt(e), i = Gt(t), o = nm(r, i), s = tm(r, i) + 1;
  return ar(r, o, s).join("");
}
function im(e, t, n) {
  if (e = V(e), e && (n || t === void 0))
    return e.slice(0, j_(e) + 1);
  if (!e || !(t = ht(t)))
    return e;
  var r = Gt(e), i = tm(r, Gt(t)) + 1;
  return ar(r, 0, i).join("");
}
var kP = /^\s+/;
function om(e, t, n) {
  if (e = V(e), e && (n || t === void 0))
    return e.replace(kP, "");
  if (!e || !(t = ht(t)))
    return e;
  var r = Gt(e), i = nm(r, Gt(t));
  return ar(r, i).join("");
}
var GP = 30, HP = "...", KP = /\w*$/;
function sm(e, t) {
  var n = GP, r = HP;
  if (re(t)) {
    var i = "separator" in t ? t.separator : i;
    n = "length" in t ? I(t.length) : n, r = "omission" in t ? ht(t.omission) : r;
  }
  e = V(e);
  var o = e.length;
  if (Pi(e)) {
    var s = Gt(e);
    o = s.length;
  }
  if (n >= o)
    return e;
  var a = n - Ci(r);
  if (a < 1)
    return r;
  var u = s ? ar(s, 0, a).join("") : e.slice(0, a);
  if (i === void 0)
    return u + r;
  if (s && (a += u.length - a), cu(i)) {
    if (e.slice(a).search(i)) {
      var f, c = u;
      for (i.global || (i = RegExp(i.source, V(KP.exec(i)) + "g")), i.lastIndex = 0; f = i.exec(c); )
        var l = f.index;
      u = u.slice(0, l === void 0 ? a : l);
    }
  } else if (e.indexOf(ht(i), a) != a) {
    var h = u.lastIndexOf(i);
    h > -1 && (u = u.slice(0, h));
  }
  return u + r;
}
function am(e) {
  return Dc(e, 1);
}
var YP = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'"
}, XP = kc(YP), um = /&(?:amp|lt|gt|quot|#39);/g, JP = RegExp(um.source);
function fm(e) {
  return e = V(e), e && JP.test(e) ? e.replace(um, XP) : e;
}
var ZP = 1 / 0, QP = ri && 1 / tu(new ri([, -0]))[1] == ZP ? function(e) {
  return new ri(e);
} : Ua, eI = 200;
function Qn(e, t, n) {
  var r = -1, i = Wa, o = e.length, s = !0, a = [], u = a;
  if (n)
    s = !1, i = ll;
  else if (o >= eI) {
    var f = t ? null : QP(e);
    if (f)
      return tu(f);
    s = !1, i = xo, u = new wr();
  } else
    u = t ? [] : a;
  e:
    for (; ++r < o; ) {
      var c = e[r], l = t ? t(c) : c;
      if (c = n || c !== 0 ? c : 0, s && l === l) {
        for (var h = u.length; h--; )
          if (u[h] === l)
            continue e;
        t && u.push(l), a.push(c);
      } else i(u, l, n) || (u !== a && u.push(l), a.push(c));
    }
  return a;
}
var cm = C(function(e) {
  return Qn(Re(e, 1, se, !0));
}), lm = C(function(e) {
  var t = _t(e);
  return se(t) && (t = void 0), Qn(Re(e, 1, se, !0), N(t));
}), hm = C(function(e) {
  var t = _t(e);
  return t = typeof t == "function" ? t : void 0, Qn(Re(e, 1, se, !0), void 0, t);
});
function pm(e) {
  return e && e.length ? Qn(e) : [];
}
function dm(e, t) {
  return e && e.length ? Qn(e, N(t)) : [];
}
function _m(e, t) {
  return t = typeof t == "function" ? t : void 0, e && e.length ? Qn(e, void 0, t) : [];
}
var tI = 0;
function vm(e) {
  var t = ++tI;
  return V(e) + t;
}
function gm(e, t) {
  return e == null ? !0 : xl(e, t);
}
var nI = Math.max;
function _u(e) {
  if (!(e && e.length))
    return [];
  var t = 0;
  return e = ur(e, function(n) {
    if (se(n))
      return t = nI(n.length, t), !0;
  }), Lc(t, function(n) {
    return ne(e, ol(n));
  });
}
function Il(e, t) {
  if (!(e && e.length))
    return [];
  var n = _u(e);
  return t == null ? n : ne(n, function(r) {
    return pt(t, void 0, r);
  });
}
function ym(e, t, n, r) {
  return os(e, t, n(Dr(e, t)), r);
}
function bm(e, t, n) {
  return e == null ? e : ym(e, t, vn(n));
}
function mm(e, t, n, r) {
  return r = typeof r == "function" ? r : void 0, e == null ? e : ym(e, t, vn(n), r);
}
var wm = Ii(function(e, t, n) {
  return e + (n ? " " : "") + t.toUpperCase();
});
function Am(e) {
  return e == null ? [] : yl(e, We(e));
}
var Om = C(function(e, t) {
  return se(e) ? es(e, t) : [];
});
function Em(e, t) {
  return ss(vn(t), e);
}
var Sm = Un(function(e) {
  var t = e.length, n = t ? e[0] : 0, r = this.__wrapped__, i = function(o) {
    return Bc(o, e);
  };
  return t > 1 || this.__actions__.length || !(r instanceof D) || !Ln(n) ? this.thru(i) : (r = r.slice(n, +n + (t ? 1 : 0)), r.__actions__.push({
    func: as,
    args: [i],
    thisArg: void 0
  }), new Nt(r, this.__chain__).thru(function(o) {
    return t && !o.length && o.push(void 0), o;
  }));
});
function xm() {
  return Yc(this);
}
function Rm() {
  var e = this.__wrapped__;
  if (e instanceof D) {
    var t = e;
    return this.__actions__.length && (t = new D(this)), t = t.reverse(), t.__actions__.push({
      func: as,
      args: [ha],
      thisArg: void 0
    }), new Nt(t, this.__chain__);
  }
  return this.thru(ha);
}
function Cl(e, t, n) {
  var r = e.length;
  if (r < 2)
    return r ? Qn(e[0]) : [];
  for (var i = -1, o = Array(r); ++i < r; )
    for (var s = e[i], a = -1; ++a < r; )
      a != i && (o[i] = es(o[i] || s, e[a], t, n));
  return Qn(Re(o, 1), t, n);
}
var Tm = C(function(e) {
  return Cl(ur(e, se));
}), $m = C(function(e) {
  var t = _t(e);
  return se(t) && (t = void 0), Cl(ur(e, se), N(t));
}), Nm = C(function(e) {
  var t = _t(e);
  return t = typeof t == "function" ? t : void 0, Cl(ur(e, se), void 0, t);
}), Mm = C(_u);
function Pm(e, t, n) {
  for (var r = -1, i = e.length, o = t.length, s = {}; ++r < i; ) {
    var a = r < o ? t[r] : void 0;
    n(s, e[r], a);
  }
  return s;
}
function Im(e, t) {
  return Pm(e || [], t || [], Ko);
}
function Cm(e, t) {
  return Pm(e || [], t || [], os);
}
var Dm = C(function(e) {
  var t = e.length, n = t > 1 ? e[t - 1] : void 0;
  return n = typeof n == "function" ? (e.pop(), n) : void 0, Il(e, n);
});
const x = {
  chunk: Pv,
  compact: Kv,
  concat: Yv,
  difference: yg,
  differenceBy: bg,
  differenceWith: mg,
  drop: Ag,
  dropRight: Og,
  dropRightWhile: Eg,
  dropWhile: Sg,
  fill: Dg,
  findIndex: _l,
  findLastIndex: vl,
  flatten: zc,
  flattenDeep: Kg,
  flattenDepth: Yg,
  fromPairs: o0,
  head: qf,
  indexOf: d0,
  initial: _0,
  intersection: v0,
  intersectionBy: g0,
  intersectionWith: y0,
  join: k0,
  lastIndexOf: K0,
  nth: vy,
  pull: Vy,
  pullAll: Nl,
  pullAllBy: qy,
  pullAllWith: Wy,
  pullAt: Gy,
  remove: nb,
  reverse: ha,
  slice: _b,
  sortedIndex: bb,
  sortedIndexBy: mb,
  sortedIndexOf: wb,
  sortedLastIndex: Ab,
  sortedLastIndexBy: Ob,
  sortedLastIndexOf: Eb,
  sortedUniq: xb,
  sortedUniqBy: Rb,
  tail: jb,
  take: Bb,
  takeRight: zb,
  takeRightWhile: Ub,
  takeWhile: Vb,
  union: cm,
  unionBy: lm,
  unionWith: hm,
  uniq: pm,
  uniqBy: dm,
  uniqWith: _m,
  unzip: _u,
  unzipWith: Il,
  without: Om,
  xor: Tm,
  xorBy: $m,
  xorWith: Nm,
  zip: Mm,
  zipObject: Im,
  zipObjectDeep: Cm,
  zipWith: Dm
}, G = {
  countBy: ug,
  every: Cg,
  filter: Fg,
  find: Bg,
  findLast: Vg,
  flatMap: kg,
  flatMapDeep: Gg,
  flatMapDepth: Hg,
  forEach: Bf,
  forEachRight: zf,
  groupBy: u0,
  includes: p0,
  invokeMap: S0,
  keyBy: H0,
  map: ts,
  orderBy: Ey,
  partition: By,
  reduce: Qy,
  reduceRight: eb,
  reject: tb,
  sample: fb,
  sampleSize: cb,
  shuffle: pb,
  size: db,
  some: gb,
  sortBy: yb
}, rI = {
  now: ao
}, ae = {
  after: z_,
  ary: Dc,
  before: Vc,
  bind: Zo,
  bindKey: Za,
  curry: iu,
  curryRight: ou,
  debounce: ul,
  defer: vg,
  delay: gg,
  flip: Xg,
  memoize: Jo,
  once: wy,
  overArgs: xy,
  partial: ss,
  partialRight: hu,
  rearg: Jy,
  rest: ob,
  spread: $b,
  throttle: Hb,
  unary: am,
  wrap: Em
}, T = {
  castArray: Nv,
  clone: Wv,
  cloneDeep: kv,
  cloneDeepWith: Gv,
  cloneWith: Hv,
  conformsTo: og,
  eq: Dt,
  gt: f0,
  gte: c0,
  isArguments: Zn,
  isArrayBuffer: x0,
  isArrayLike: qe,
  isArrayLikeObject: se,
  isBoolean: R0,
  isBuffer: In,
  isDate: T0,
  isElement: $0,
  isEmpty: N0,
  isEqual: M0,
  isEqualWith: P0,
  isError: Ja,
  isFinite: I0,
  isFunction: hn,
  isInteger: wl,
  isLength: Yo,
  isMap: Qc,
  isMatch: C0,
  isMatchWith: D0,
  isNaN: L0,
  isNative: F0,
  isNil: j0,
  isNull: B0,
  isNumber: Al,
  isObjectLike: ie,
  isPlainObject: Mi,
  isRegExp: cu,
  isSafeInteger: z0,
  isSet: el,
  isString: ns,
  isSymbol: Qe,
  isTypedArray: Cr,
  isUndefined: U0,
  isWeakMap: V0,
  isWeakSet: q0,
  lt: J0,
  lte: Z0,
  toArray: Sl,
  toFinite: rn,
  toLength: dl,
  toNumber: at,
  toPlainObject: fl,
  toSafeInteger: Zb,
  toString: V
}, ke = {
  add: F_,
  ceil: Mv,
  divide: wg,
  floor: Jg,
  max: ry,
  maxBy: iy,
  mean: sy,
  meanBy: ay,
  min: ly,
  minBy: hy,
  multiply: dy,
  round: ab,
  subtract: Db,
  sum: Lb,
  sumBy: Fb
}, Dl = {
  clamp: Iv,
  inRange: h0,
  random: Hy
}, $ = {
  assign: rv,
  assignIn: Nf,
  assignInWith: Oo,
  assignWith: iv,
  at: sv,
  create: fg,
  defaults: hg,
  defaultsDeep: dg,
  findKey: Ug,
  findLastKey: qg,
  forIn: t0,
  forInRight: n0,
  forOwn: r0,
  forOwnRight: i0,
  functions: s0,
  functionsIn: a0,
  get: Ya,
  has: l0,
  hasIn: nu,
  invert: m0,
  invertBy: A0,
  invoke: E0,
  keysIn: We,
  mapKeys: Q0,
  mapValues: ey,
  merge: uy,
  mergeWith: cl,
  omit: yy,
  omitBy: my,
  pick: zy,
  pickBy: Rl,
  result: sb,
  set: lb,
  setWith: hb,
  toPairs: Uf,
  toPairsIn: Vf,
  transform: em,
  unset: gm,
  update: bm,
  updateWith: mm,
  values: Fr,
  valuesIn: Am
}, gn = {
  at: Sm,
  chain: Yc,
  commit: Lf,
  next: Wf,
  plant: Kf,
  reverse: Rm,
  tap: qb,
  toIterator: Yf,
  value: no,
  wrapperChain: xm
}, q = {
  camelCase: $v,
  capitalize: qc,
  deburr: Gc,
  endsWith: Tg,
  escape: pl,
  escapeRegExp: Pg,
  kebabCase: G0,
  lowerCase: Y0,
  lowerFirst: X0,
  pad: Dy,
  padEnd: Ly,
  padStart: Fy,
  parseInt: jy,
  repeat: rb,
  replace: ib,
  snakeCase: vb,
  split: Tb,
  startCase: Nb,
  startsWith: Mb,
  template: Gb,
  templateSettings: pa,
  toLower: Xb,
  toUpper: Qb,
  trim: rm,
  trimEnd: im,
  trimStart: om,
  truncate: sm,
  unescape: fm,
  upperCase: wm,
  upperFirst: Qa,
  words: Hc
}, k = {
  attempt: Uc,
  bindAll: uv,
  cond: ng,
  conforms: ig,
  constant: Va,
  defaultTo: cg,
  flow: Qg,
  flowRight: e0,
  iteratee: W0,
  matches: ty,
  matchesProperty: ny,
  method: fy,
  methodOf: cy,
  noop: Ua,
  nthArg: gy,
  over: Sy,
  overEvery: Ry,
  overSome: Ty,
  property: sl,
  propertyOf: Uy,
  range: Yy,
  rangeRight: Xy,
  stubArray: eu,
  stubFalse: Ga,
  stubObject: Pb,
  stubString: Ib,
  stubTrue: Cb,
  times: Kb,
  toPath: Jb,
  uniqueId: vm
};
function iI() {
  var e = new D(this.__wrapped__);
  return e.__actions__ = Je(this.__actions__), e.__dir__ = this.__dir__, e.__filtered__ = this.__filtered__, e.__iteratees__ = Je(this.__iteratees__), e.__takeCount__ = this.__takeCount__, e.__views__ = Je(this.__views__), e;
}
function oI() {
  if (this.__filtered__) {
    var e = new D(this);
    e.__dir__ = -1, e.__filtered__ = !0;
  } else
    e = this.clone(), e.__dir__ *= -1;
  return e;
}
var sI = Math.max, aI = Math.min;
function uI(e, t, n) {
  for (var r = -1, i = n.length; ++r < i; ) {
    var o = n[r], s = o.size;
    switch (o.type) {
      case "drop":
        e += s;
        break;
      case "dropRight":
        t -= s;
        break;
      case "take":
        t = aI(t, e + s);
        break;
      case "takeRight":
        e = sI(e, t - s);
        break;
    }
  }
  return { start: e, end: t };
}
var fI = 1, cI = 2, lI = Math.min;
function hI() {
  var e = this.__wrapped__.value(), t = this.__dir__, n = M(e), r = t < 0, i = n ? e.length : 0, o = uI(0, i, this.__views__), s = o.start, a = o.end, u = a - s, f = r ? a : s - 1, c = this.__iteratees__, l = c.length, h = 0, d = lI(u, this.__takeCount__);
  if (!n || !r && i == u && d == u)
    return Yb(e, this.__actions__);
  var _ = [];
  e:
    for (; u-- && h < d; ) {
      f += t;
      for (var v = -1, g = e[f]; ++v < l; ) {
        var y = c[v], b = y.iteratee, w = y.type, m = b(g);
        if (w == cI)
          g = m;
        else if (!m) {
          if (w == fI)
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
var pI = "4.17.21", dI = 2, _I = 1, vI = 3, Lm = 4294967295, gI = Array.prototype, yI = Object.prototype, Fm = yI.hasOwnProperty, rd = Ne ? Ne.iterator : void 0, bI = Math.max, id = Math.min, Ll = /* @__PURE__ */ function(e) {
  return function(t, n, r) {
    if (r == null) {
      var i = re(n), o = i && pe(n), s = o && o.length && uu(n, o);
      (s ? s.length : i) || (r = n, n = t, t = this);
    }
    return e(t, n, r);
  };
}(py);
p.after = ae.after;
p.ary = ae.ary;
p.assign = $.assign;
p.assignIn = $.assignIn;
p.assignInWith = $.assignInWith;
p.assignWith = $.assignWith;
p.at = $.at;
p.before = ae.before;
p.bind = ae.bind;
p.bindAll = k.bindAll;
p.bindKey = ae.bindKey;
p.castArray = T.castArray;
p.chain = gn.chain;
p.chunk = x.chunk;
p.compact = x.compact;
p.concat = x.concat;
p.cond = k.cond;
p.conforms = k.conforms;
p.constant = k.constant;
p.countBy = G.countBy;
p.create = $.create;
p.curry = ae.curry;
p.curryRight = ae.curryRight;
p.debounce = ae.debounce;
p.defaults = $.defaults;
p.defaultsDeep = $.defaultsDeep;
p.defer = ae.defer;
p.delay = ae.delay;
p.difference = x.difference;
p.differenceBy = x.differenceBy;
p.differenceWith = x.differenceWith;
p.drop = x.drop;
p.dropRight = x.dropRight;
p.dropRightWhile = x.dropRightWhile;
p.dropWhile = x.dropWhile;
p.fill = x.fill;
p.filter = G.filter;
p.flatMap = G.flatMap;
p.flatMapDeep = G.flatMapDeep;
p.flatMapDepth = G.flatMapDepth;
p.flatten = x.flatten;
p.flattenDeep = x.flattenDeep;
p.flattenDepth = x.flattenDepth;
p.flip = ae.flip;
p.flow = k.flow;
p.flowRight = k.flowRight;
p.fromPairs = x.fromPairs;
p.functions = $.functions;
p.functionsIn = $.functionsIn;
p.groupBy = G.groupBy;
p.initial = x.initial;
p.intersection = x.intersection;
p.intersectionBy = x.intersectionBy;
p.intersectionWith = x.intersectionWith;
p.invert = $.invert;
p.invertBy = $.invertBy;
p.invokeMap = G.invokeMap;
p.iteratee = k.iteratee;
p.keyBy = G.keyBy;
p.keys = pe;
p.keysIn = $.keysIn;
p.map = G.map;
p.mapKeys = $.mapKeys;
p.mapValues = $.mapValues;
p.matches = k.matches;
p.matchesProperty = k.matchesProperty;
p.memoize = ae.memoize;
p.merge = $.merge;
p.mergeWith = $.mergeWith;
p.method = k.method;
p.methodOf = k.methodOf;
p.mixin = Ll;
p.negate = is;
p.nthArg = k.nthArg;
p.omit = $.omit;
p.omitBy = $.omitBy;
p.once = ae.once;
p.orderBy = G.orderBy;
p.over = k.over;
p.overArgs = ae.overArgs;
p.overEvery = k.overEvery;
p.overSome = k.overSome;
p.partial = ae.partial;
p.partialRight = ae.partialRight;
p.partition = G.partition;
p.pick = $.pick;
p.pickBy = $.pickBy;
p.property = k.property;
p.propertyOf = k.propertyOf;
p.pull = x.pull;
p.pullAll = x.pullAll;
p.pullAllBy = x.pullAllBy;
p.pullAllWith = x.pullAllWith;
p.pullAt = x.pullAt;
p.range = k.range;
p.rangeRight = k.rangeRight;
p.rearg = ae.rearg;
p.reject = G.reject;
p.remove = x.remove;
p.rest = ae.rest;
p.reverse = x.reverse;
p.sampleSize = G.sampleSize;
p.set = $.set;
p.setWith = $.setWith;
p.shuffle = G.shuffle;
p.slice = x.slice;
p.sortBy = G.sortBy;
p.sortedUniq = x.sortedUniq;
p.sortedUniqBy = x.sortedUniqBy;
p.split = q.split;
p.spread = ae.spread;
p.tail = x.tail;
p.take = x.take;
p.takeRight = x.takeRight;
p.takeRightWhile = x.takeRightWhile;
p.takeWhile = x.takeWhile;
p.tap = gn.tap;
p.throttle = ae.throttle;
p.thru = as;
p.toArray = T.toArray;
p.toPairs = $.toPairs;
p.toPairsIn = $.toPairsIn;
p.toPath = k.toPath;
p.toPlainObject = T.toPlainObject;
p.transform = $.transform;
p.unary = ae.unary;
p.union = x.union;
p.unionBy = x.unionBy;
p.unionWith = x.unionWith;
p.uniq = x.uniq;
p.uniqBy = x.uniqBy;
p.uniqWith = x.uniqWith;
p.unset = $.unset;
p.unzip = x.unzip;
p.unzipWith = x.unzipWith;
p.update = $.update;
p.updateWith = $.updateWith;
p.values = $.values;
p.valuesIn = $.valuesIn;
p.without = x.without;
p.words = q.words;
p.wrap = ae.wrap;
p.xor = x.xor;
p.xorBy = x.xorBy;
p.xorWith = x.xorWith;
p.zip = x.zip;
p.zipObject = x.zipObject;
p.zipObjectDeep = x.zipObjectDeep;
p.zipWith = x.zipWith;
p.entries = $.toPairs;
p.entriesIn = $.toPairsIn;
p.extend = $.assignIn;
p.extendWith = $.assignInWith;
Ll(p, p);
p.add = ke.add;
p.attempt = k.attempt;
p.camelCase = q.camelCase;
p.capitalize = q.capitalize;
p.ceil = ke.ceil;
p.clamp = Dl.clamp;
p.clone = T.clone;
p.cloneDeep = T.cloneDeep;
p.cloneDeepWith = T.cloneDeepWith;
p.cloneWith = T.cloneWith;
p.conformsTo = T.conformsTo;
p.deburr = q.deburr;
p.defaultTo = k.defaultTo;
p.divide = ke.divide;
p.endsWith = q.endsWith;
p.eq = T.eq;
p.escape = q.escape;
p.escapeRegExp = q.escapeRegExp;
p.every = G.every;
p.find = G.find;
p.findIndex = x.findIndex;
p.findKey = $.findKey;
p.findLast = G.findLast;
p.findLastIndex = x.findLastIndex;
p.findLastKey = $.findLastKey;
p.floor = ke.floor;
p.forEach = G.forEach;
p.forEachRight = G.forEachRight;
p.forIn = $.forIn;
p.forInRight = $.forInRight;
p.forOwn = $.forOwn;
p.forOwnRight = $.forOwnRight;
p.get = $.get;
p.gt = T.gt;
p.gte = T.gte;
p.has = $.has;
p.hasIn = $.hasIn;
p.head = x.head;
p.identity = Ve;
p.includes = G.includes;
p.indexOf = x.indexOf;
p.inRange = Dl.inRange;
p.invoke = $.invoke;
p.isArguments = T.isArguments;
p.isArray = M;
p.isArrayBuffer = T.isArrayBuffer;
p.isArrayLike = T.isArrayLike;
p.isArrayLikeObject = T.isArrayLikeObject;
p.isBoolean = T.isBoolean;
p.isBuffer = T.isBuffer;
p.isDate = T.isDate;
p.isElement = T.isElement;
p.isEmpty = T.isEmpty;
p.isEqual = T.isEqual;
p.isEqualWith = T.isEqualWith;
p.isError = T.isError;
p.isFinite = T.isFinite;
p.isFunction = T.isFunction;
p.isInteger = T.isInteger;
p.isLength = T.isLength;
p.isMap = T.isMap;
p.isMatch = T.isMatch;
p.isMatchWith = T.isMatchWith;
p.isNaN = T.isNaN;
p.isNative = T.isNative;
p.isNil = T.isNil;
p.isNull = T.isNull;
p.isNumber = T.isNumber;
p.isObject = re;
p.isObjectLike = T.isObjectLike;
p.isPlainObject = T.isPlainObject;
p.isRegExp = T.isRegExp;
p.isSafeInteger = T.isSafeInteger;
p.isSet = T.isSet;
p.isString = T.isString;
p.isSymbol = T.isSymbol;
p.isTypedArray = T.isTypedArray;
p.isUndefined = T.isUndefined;
p.isWeakMap = T.isWeakMap;
p.isWeakSet = T.isWeakSet;
p.join = x.join;
p.kebabCase = q.kebabCase;
p.last = _t;
p.lastIndexOf = x.lastIndexOf;
p.lowerCase = q.lowerCase;
p.lowerFirst = q.lowerFirst;
p.lt = T.lt;
p.lte = T.lte;
p.max = ke.max;
p.maxBy = ke.maxBy;
p.mean = ke.mean;
p.meanBy = ke.meanBy;
p.min = ke.min;
p.minBy = ke.minBy;
p.stubArray = k.stubArray;
p.stubFalse = k.stubFalse;
p.stubObject = k.stubObject;
p.stubString = k.stubString;
p.stubTrue = k.stubTrue;
p.multiply = ke.multiply;
p.nth = x.nth;
p.noop = k.noop;
p.now = rI.now;
p.pad = q.pad;
p.padEnd = q.padEnd;
p.padStart = q.padStart;
p.parseInt = q.parseInt;
p.random = Dl.random;
p.reduce = G.reduce;
p.reduceRight = G.reduceRight;
p.repeat = q.repeat;
p.replace = q.replace;
p.result = $.result;
p.round = ke.round;
p.sample = G.sample;
p.size = G.size;
p.snakeCase = q.snakeCase;
p.some = G.some;
p.sortedIndex = x.sortedIndex;
p.sortedIndexBy = x.sortedIndexBy;
p.sortedIndexOf = x.sortedIndexOf;
p.sortedLastIndex = x.sortedLastIndex;
p.sortedLastIndexBy = x.sortedLastIndexBy;
p.sortedLastIndexOf = x.sortedLastIndexOf;
p.startCase = q.startCase;
p.startsWith = q.startsWith;
p.subtract = ke.subtract;
p.sum = ke.sum;
p.sumBy = ke.sumBy;
p.template = q.template;
p.times = k.times;
p.toFinite = T.toFinite;
p.toInteger = I;
p.toLength = T.toLength;
p.toLower = q.toLower;
p.toNumber = T.toNumber;
p.toSafeInteger = T.toSafeInteger;
p.toString = T.toString;
p.toUpper = q.toUpper;
p.trim = q.trim;
p.trimEnd = q.trimEnd;
p.trimStart = q.trimStart;
p.truncate = q.truncate;
p.unescape = q.unescape;
p.uniqueId = k.uniqueId;
p.upperCase = q.upperCase;
p.upperFirst = q.upperFirst;
p.each = G.forEach;
p.eachRight = G.forEachRight;
p.first = x.head;
Ll(p, function() {
  var e = {};
  return _n(p, function(t, n) {
    Fm.call(p.prototype, n) || (e[n] = t);
  }), e;
}(), { chain: !1 });
p.VERSION = pI;
(p.templateSettings = q.templateSettings).imports._ = p;
Ct(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(e) {
  p[e].placeholder = p;
});
Ct(["drop", "take"], function(e, t) {
  D.prototype[e] = function(n) {
    n = n === void 0 ? 1 : bI(I(n), 0);
    var r = this.__filtered__ && !t ? new D(this) : this.clone();
    return r.__filtered__ ? r.__takeCount__ = id(n, r.__takeCount__) : r.__views__.push({
      size: id(n, Lm),
      type: e + (r.__dir__ < 0 ? "Right" : "")
    }), r;
  }, D.prototype[e + "Right"] = function(n) {
    return this.reverse()[e](n).reverse();
  };
});
Ct(["filter", "map", "takeWhile"], function(e, t) {
  var n = t + 1, r = n == _I || n == vI;
  D.prototype[e] = function(i) {
    var o = this.clone();
    return o.__iteratees__.push({
      iteratee: N(i),
      type: n
    }), o.__filtered__ = o.__filtered__ || r, o;
  };
});
Ct(["head", "last"], function(e, t) {
  var n = "take" + (t ? "Right" : "");
  D.prototype[e] = function() {
    return this[n](1).value()[0];
  };
});
Ct(["initial", "tail"], function(e, t) {
  var n = "drop" + (t ? "" : "Right");
  D.prototype[e] = function() {
    return this.__filtered__ ? new D(this) : this[n](1);
  };
});
D.prototype.compact = function() {
  return this.filter(Ve);
};
D.prototype.find = function(e) {
  return this.filter(e).head();
};
D.prototype.findLast = function(e) {
  return this.reverse().find(e);
};
D.prototype.invokeMap = C(function(e, t) {
  return typeof e == "function" ? new D(this) : this.map(function(n) {
    return rs(n, e, t);
  });
});
D.prototype.reject = function(e) {
  return this.filter(is(N(e)));
};
D.prototype.slice = function(e, t) {
  e = I(e);
  var n = this;
  return n.__filtered__ && (e > 0 || t < 0) ? new D(n) : (e < 0 ? n = n.takeRight(-e) : e && (n = n.drop(e)), t !== void 0 && (t = I(t), n = t < 0 ? n.dropRight(-t) : n.take(t - e)), n);
};
D.prototype.takeRightWhile = function(e) {
  return this.reverse().takeWhile(e).reverse();
};
D.prototype.toArray = function() {
  return this.take(Lm);
};
_n(D.prototype, function(e, t) {
  var n = /^(?:filter|find|map|reject)|While$/.test(t), r = /^(?:head|last)$/.test(t), i = p[r ? "take" + (t == "last" ? "Right" : "") : t], o = r || /^find/.test(t);
  i && (p.prototype[t] = function() {
    var s = this.__wrapped__, a = r ? [1] : arguments, u = s instanceof D, f = a[0], c = u || M(s), l = function(y) {
      var b = i.apply(p, sr([y], a));
      return r && h ? b[0] : b;
    };
    c && n && typeof f == "function" && f.length != 1 && (u = c = !1);
    var h = this.__chain__, d = !!this.__actions__.length, _ = o && !h, v = u && !d;
    if (!o && c) {
      s = v ? s : new D(this);
      var g = e.apply(s, a);
      return g.__actions__.push({ func: as, args: [l], thisArg: void 0 }), new Nt(g, h);
    }
    return _ && v ? e.apply(this, a) : (g = this.thru(l), _ ? r ? g.value()[0] : g.value() : g);
  });
});
Ct(["pop", "push", "shift", "sort", "splice", "unshift"], function(e) {
  var t = gI[e], n = /^(?:push|sort|unshift)$/.test(e) ? "tap" : "thru", r = /^(?:pop|shift)$/.test(e);
  p.prototype[e] = function() {
    var i = arguments;
    if (r && !this.__chain__) {
      var o = this.value();
      return t.apply(M(o) ? o : [], i);
    }
    return this[n](function(s) {
      return t.apply(M(s) ? s : [], i);
    });
  };
});
_n(D.prototype, function(e, t) {
  var n = p[t];
  if (n) {
    var r = n.name + "";
    Fm.call(ni, r) || (ni[r] = []), ni[r].push({ name: t, func: n });
  }
});
ni[ka(void 0, dI).name] = [{
  name: "wrapper",
  func: void 0
}];
D.prototype.clone = iI;
D.prototype.reverse = oI;
D.prototype.value = hI;
p.prototype.at = gn.at;
p.prototype.chain = gn.wrapperChain;
p.prototype.commit = gn.commit;
p.prototype.next = gn.next;
p.prototype.plant = gn.plant;
p.prototype.reverse = gn.reverse;
p.prototype.toJSON = p.prototype.valueOf = p.prototype.value = gn.value;
p.prototype.first = p.prototype.head;
rd && (p.prototype[rd] = gn.toIterator);
/**
 * @license
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="es" -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
const FB = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: F_,
  after: z_,
  ary: Dc,
  assign: rv,
  assignIn: Nf,
  assignInWith: Oo,
  assignWith: iv,
  at: sv,
  attempt: Uc,
  before: Vc,
  bind: Zo,
  bindAll: uv,
  bindKey: Za,
  camelCase: $v,
  capitalize: qc,
  castArray: Nv,
  ceil: Mv,
  chain: Yc,
  chunk: Pv,
  clamp: Iv,
  clone: Wv,
  cloneDeep: kv,
  cloneDeepWith: Gv,
  cloneWith: Hv,
  commit: Lf,
  compact: Kv,
  concat: Yv,
  cond: ng,
  conforms: ig,
  conformsTo: og,
  constant: Va,
  countBy: ug,
  create: fg,
  curry: iu,
  curryRight: ou,
  debounce: ul,
  deburr: Gc,
  default: p,
  defaultTo: cg,
  defaults: hg,
  defaultsDeep: dg,
  defer: vg,
  delay: gg,
  difference: yg,
  differenceBy: bg,
  differenceWith: mg,
  divide: wg,
  drop: Ag,
  dropRight: Og,
  dropRightWhile: Eg,
  dropWhile: Sg,
  each: Bf,
  eachRight: zf,
  endsWith: Tg,
  entries: Uf,
  entriesIn: Vf,
  eq: Dt,
  escape: pl,
  escapeRegExp: Pg,
  every: Cg,
  extend: Nf,
  extendWith: Oo,
  fill: Dg,
  filter: Fg,
  find: Bg,
  findIndex: _l,
  findKey: Ug,
  findLast: Vg,
  findLastIndex: vl,
  findLastKey: qg,
  first: qf,
  flatMap: kg,
  flatMapDeep: Gg,
  flatMapDepth: Hg,
  flatten: zc,
  flattenDeep: Kg,
  flattenDepth: Yg,
  flip: Xg,
  floor: Jg,
  flow: Qg,
  flowRight: e0,
  forEach: Bf,
  forEachRight: zf,
  forIn: t0,
  forInRight: n0,
  forOwn: r0,
  forOwnRight: i0,
  fromPairs: o0,
  functions: s0,
  functionsIn: a0,
  get: Ya,
  groupBy: u0,
  gt: f0,
  gte: c0,
  has: l0,
  hasIn: nu,
  head: qf,
  identity: Ve,
  inRange: h0,
  includes: p0,
  indexOf: d0,
  initial: _0,
  intersection: v0,
  intersectionBy: g0,
  intersectionWith: y0,
  invert: m0,
  invertBy: A0,
  invoke: E0,
  invokeMap: S0,
  isArguments: Zn,
  isArray: M,
  isArrayBuffer: x0,
  isArrayLike: qe,
  isArrayLikeObject: se,
  isBoolean: R0,
  isBuffer: In,
  isDate: T0,
  isElement: $0,
  isEmpty: N0,
  isEqual: M0,
  isEqualWith: P0,
  isError: Ja,
  isFinite: I0,
  isFunction: hn,
  isInteger: wl,
  isLength: Yo,
  isMap: Qc,
  isMatch: C0,
  isMatchWith: D0,
  isNaN: L0,
  isNative: F0,
  isNil: j0,
  isNull: B0,
  isNumber: Al,
  isObject: re,
  isObjectLike: ie,
  isPlainObject: Mi,
  isRegExp: cu,
  isSafeInteger: z0,
  isSet: el,
  isString: ns,
  isSymbol: Qe,
  isTypedArray: Cr,
  isUndefined: U0,
  isWeakMap: V0,
  isWeakSet: q0,
  iteratee: W0,
  join: k0,
  kebabCase: G0,
  keyBy: H0,
  keys: pe,
  keysIn: We,
  last: _t,
  lastIndexOf: K0,
  lodash: p,
  lowerCase: Y0,
  lowerFirst: X0,
  lt: J0,
  lte: Z0,
  map: ts,
  mapKeys: Q0,
  mapValues: ey,
  matches: ty,
  matchesProperty: ny,
  max: ry,
  maxBy: iy,
  mean: sy,
  meanBy: ay,
  memoize: Jo,
  merge: uy,
  mergeWith: cl,
  method: fy,
  methodOf: cy,
  min: ly,
  minBy: hy,
  mixin: py,
  multiply: dy,
  negate: is,
  next: Wf,
  noop: Ua,
  now: ao,
  nth: vy,
  nthArg: gy,
  omit: yy,
  omitBy: my,
  once: wy,
  orderBy: Ey,
  over: Sy,
  overArgs: xy,
  overEvery: Ry,
  overSome: Ty,
  pad: Dy,
  padEnd: Ly,
  padStart: Fy,
  parseInt: jy,
  partial: ss,
  partialRight: hu,
  partition: By,
  pick: zy,
  pickBy: Rl,
  plant: Kf,
  property: sl,
  propertyOf: Uy,
  pull: Vy,
  pullAll: Nl,
  pullAllBy: qy,
  pullAllWith: Wy,
  pullAt: Gy,
  random: Hy,
  range: Yy,
  rangeRight: Xy,
  rearg: Jy,
  reduce: Qy,
  reduceRight: eb,
  reject: tb,
  remove: nb,
  repeat: rb,
  replace: ib,
  rest: ob,
  result: sb,
  reverse: ha,
  round: ab,
  sample: fb,
  sampleSize: cb,
  set: lb,
  setWith: hb,
  shuffle: pb,
  size: db,
  slice: _b,
  snakeCase: vb,
  some: gb,
  sortBy: yb,
  sortedIndex: bb,
  sortedIndexBy: mb,
  sortedIndexOf: wb,
  sortedLastIndex: Ab,
  sortedLastIndexBy: Ob,
  sortedLastIndexOf: Eb,
  sortedUniq: xb,
  sortedUniqBy: Rb,
  split: Tb,
  spread: $b,
  startCase: Nb,
  startsWith: Mb,
  stubArray: eu,
  stubFalse: Ga,
  stubObject: Pb,
  stubString: Ib,
  stubTrue: Cb,
  subtract: Db,
  sum: Lb,
  sumBy: Fb,
  tail: jb,
  take: Bb,
  takeRight: zb,
  takeRightWhile: Ub,
  takeWhile: Vb,
  tap: qb,
  template: Gb,
  templateSettings: pa,
  throttle: Hb,
  thru: as,
  times: Kb,
  toArray: Sl,
  toFinite: rn,
  toInteger: I,
  toIterator: Yf,
  toJSON: no,
  toLength: dl,
  toLower: Xb,
  toNumber: at,
  toPairs: Uf,
  toPairsIn: Vf,
  toPath: Jb,
  toPlainObject: fl,
  toSafeInteger: Zb,
  toString: V,
  toUpper: Qb,
  transform: em,
  trim: rm,
  trimEnd: im,
  trimStart: om,
  truncate: sm,
  unary: am,
  unescape: fm,
  union: cm,
  unionBy: lm,
  unionWith: hm,
  uniq: pm,
  uniqBy: dm,
  uniqWith: _m,
  uniqueId: vm,
  unset: gm,
  unzip: _u,
  unzipWith: Il,
  update: bm,
  updateWith: mm,
  upperCase: wm,
  upperFirst: Qa,
  value: no,
  valueOf: no,
  values: Fr,
  valuesIn: Am,
  without: Om,
  words: Hc,
  wrap: Em,
  wrapperAt: Sm,
  wrapperChain: xm,
  wrapperCommit: Lf,
  wrapperLodash: p,
  wrapperNext: Wf,
  wrapperPlant: Kf,
  wrapperReverse: Rm,
  wrapperToIterator: Yf,
  wrapperValue: no,
  xor: Tm,
  xorBy: $m,
  xorWith: Nm,
  zip: Mm,
  zipObject: Im,
  zipObjectDeep: Cm,
  zipWith: Dm
}, Symbol.toStringTag, { value: "Module" }));
function jm(e) {
  return [parseInt(e.substr(1, 2), 16), parseInt(e.substr(3, 2), 16), parseInt(e.substr(5, 2), 16)];
}
function of(e) {
  const t = Math.round(e).toString(16);
  return t.length === 1 ? `0${t}` : t;
}
function Bm(e) {
  return `#${of(e[0])}${of(e[1])}${of(e[2])}`;
}
const mI = /rgba?\(([\s.,0-9]+)\)/;
function wI() {
  const e = document.createElement("i");
  return e.title = "Web Colour Picker", e.style.display = "none", document.body.appendChild(e), e;
}
let Fs;
function zm(e) {
  if (e[0] === "#" && e.length === 7)
    return e;
  Fs || (Fs = wI()), Fs.style.color = e;
  let t = document.defaultView.getComputedStyle(Fs, "").getPropertyValue("color");
  const r = mI.exec(t)[1].split(/\s*,\s*/).map((i) => Number(i));
  return t = Bm(r), t;
}
function sf(e, t, n, r) {
  return e[r] + (t[r] - e[r]) * n;
}
function AI(e, t) {
  const n = isNaN(Number(t)) || t < 0 ? 0 : t > 1 ? 1 : Number(t), r = e.length - 1, i = Math.floor(r * n), o = r * n - i, s = e[i], a = i === r ? s : e[i + 1];
  return Bm([sf(s, a, o, 0), sf(s, a, o, 1), sf(s, a, o, 2)]);
}
function OI(e) {
  const n = (typeof e == "string" ? e.split("-") : e).map((r) => jm(r.indexOf("#") === -1 ? zm(r) : r));
  return (r) => AI(n, r);
}
const EI = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i, SI = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i, xI = /[\d.]+:(#[^\s]+|[^)]+\))/gi;
function RI(e) {
  return /^[r,R,L,l]{1}[\s]*\(/.test(e);
}
function TI(e) {
  if (RI(e)) {
    let t = "", n;
    if (e[0] === "l") {
      const i = EI.exec(e), o = +i[1] + 90;
      n = i[2], t = `linear-gradient(${o}deg, `;
    } else e[0] === "r" && (t = "radial-gradient(", n = SI.exec(e)[4]);
    const r = n.match(xI);
    return r.forEach((i, o) => {
      const s = i.split(":");
      t += `${s[1]} ${Number(s[0]) * 100}%`, o !== r.length - 1 && (t += ", ");
    }), t += ")", t;
  }
  return e;
}
var od = typeof Float32Array < "u" ? Float32Array : Array;
function vu(e, t, n) {
  var r = t[0], i = t[1], o = t[2], s = t[3], a = t[4], u = t[5], f = t[6], c = t[7], l = t[8], h = n[0], d = n[1], _ = n[2], v = n[3], g = n[4], y = n[5], b = n[6], w = n[7], m = n[8];
  return e[0] = h * r + d * s + _ * f, e[1] = h * i + d * a + _ * c, e[2] = h * o + d * u + _ * l, e[3] = v * r + g * s + y * f, e[4] = v * i + g * a + y * c, e[5] = v * o + g * u + y * l, e[6] = b * r + w * s + m * f, e[7] = b * i + w * a + m * c, e[8] = b * o + w * u + m * l, e;
}
function $I(e, t) {
  return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = t[0], e[7] = t[1], e[8] = 1, e;
}
function NI(e, t) {
  var n = Math.sin(t), r = Math.cos(t);
  return e[0] = r, e[1] = n, e[2] = 0, e[3] = -n, e[4] = r, e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
}
function MI(e, t) {
  return e[0] = t[0], e[1] = 0, e[2] = 0, e[3] = 0, e[4] = t[1], e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
}
function PI() {
  var e = new od(2);
  return od != Float32Array && (e[0] = 0, e[1] = 0), e;
}
function II(e, t) {
  var n = e[0], r = e[1], i = t[0], o = t[1];
  return Math.abs(Math.atan2(r * i - n * o, n * i + r * o));
}
(function() {
  var e = PI();
  return function(t, n, r, i, o, s) {
    var a, u;
    for (n || (n = 2), r || (r = 0), i ? u = Math.min(i * n + r, t.length) : u = t.length, a = r; a < u; a += n)
      e[0] = t[a], e[1] = t[a + 1], o(e, e, s), t[a] = e[0], t[a + 1] = e[1];
    return t;
  };
})();
function CI(e, t, n) {
  const r = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return $I(r, n), vu(e, r, t);
}
function DI(e, t, n) {
  const r = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return NI(r, n), vu(e, r, t);
}
function LI(e, t, n) {
  const r = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return MI(r, n), vu(e, r, t);
}
function FI(e, t, n) {
  return vu(e, n, t);
}
function jI(e, t) {
  const n = e ? [].concat(e) : [1, 0, 0, 0, 1, 0, 0, 0, 1];
  for (let r = 0, i = t.length; r < i; r++) {
    const o = t[r];
    switch (o[0]) {
      case "t":
        CI(n, n, [o[1], o[2]]);
        break;
      case "s":
        LI(n, n, [o[1], o[2]]);
        break;
      case "r":
        DI(n, n, o[1]);
        break;
      case "m":
        FI(n, n, o[1]);
        break;
    }
  }
  return n;
}
function Um(e, t) {
  return e[0] * t[1] - t[0] * e[1];
}
function BI(e, t, n) {
  const r = II(e, t), i = Um(e, t) >= 0;
  return n ? i ? Math.PI * 2 - r : r : i ? r : Math.PI * 2 - r;
}
function zI(e, t, n) {
  return n ? (e[0] = t[1], e[1] = -1 * t[0]) : (e[0] = -1 * t[1], e[1] = t[0]), e;
}
function Di(e) {
  return e.map((t) => Array.isArray(t) ? [].concat(t) : t);
}
function UI(e, t) {
  if (t === "off") return Di(e);
  const n = typeof t == "number" && t >= 1 ? 10 ** t : 1;
  return e.map((r) => {
    const i = r.slice(1).map(Number).map((o) => t ? Math.round(o * n) / n : Math.round(o));
    return [r[0]].concat(i);
  });
}
function VI(e, t = "off") {
  return UI(e, t).map((n) => n[0] + n.slice(1).join(" ")).join("");
}
const Vm = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
};
function qI(e, t, n) {
  if (e[n].length > 7) {
    e[n].shift();
    const r = e[n];
    let i = n;
    for (; r.length; )
      t[n] = "A", e.splice(i += 1, 0, ["C"].concat(r.splice(0, 6)));
    e.splice(n, 1);
  }
}
const uo = {
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
function qm(e) {
  return Array.isArray(e) && e.every((t) => {
    const n = t[0].toLowerCase();
    return uo[n] === t.length - 1 && "achlmqstvz".includes(n);
  });
}
function Wm(e) {
  return qm(e) && // @ts-ignore -- `isPathArray` also checks if it's `Array`
  e.every(([t]) => t === t.toUpperCase());
}
function km(e) {
  return Wm(e) && e.every(([t]) => "ACLMQZ".includes(t));
}
function sd(e) {
  let t = e.pathValue[e.segmentStart], n = t.toLowerCase();
  const { data: r } = e;
  for (; r.length >= uo[n] && (n === "m" && r.length > 2 ? (e.segments.push([t].concat(r.splice(0, 2))), n = "l", t = t === "m" ? "l" : "L") : e.segments.push([t].concat(r.splice(0, uo[n]))), !!uo[n]); )
    ;
}
function WI(e) {
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
function kI(e) {
  return e >= 48 && e <= 57 || e === 43 || e === 45 || e === 46;
}
function Kr(e) {
  return e >= 48 && e <= 57;
}
function GI(e) {
  const { max: t, pathValue: n, index: r } = e;
  let i = r, o = !1, s = !1, a = !1, u = !1, f;
  if (i >= t) {
    e.err = `[path-util]: Invalid path value at index ${i}, "pathValue" is missing param`;
    return;
  }
  if (f = n.charCodeAt(i), (f === 43 || f === 45) && (i += 1, f = n.charCodeAt(i)), !Kr(f) && f !== 46) {
    e.err = `[path-util]: Invalid path value at index ${i}, "${n[i]}" is not a number`;
    return;
  }
  if (f !== 46) {
    if (o = f === 48, i += 1, f = n.charCodeAt(i), o && i < t && f && Kr(f)) {
      e.err = `[path-util]: Invalid path value at index ${r}, "${n[r]}" illegal number`;
      return;
    }
    for (; i < t && Kr(n.charCodeAt(i)); )
      i += 1, s = !0;
    f = n.charCodeAt(i);
  }
  if (f === 46) {
    for (u = !0, i += 1; Kr(n.charCodeAt(i)); )
      i += 1, a = !0;
    f = n.charCodeAt(i);
  }
  if (f === 101 || f === 69) {
    if (u && !s && !a) {
      e.err = `[path-util]: Invalid path value at index ${i}, "${n[i]}" invalid float exponent`;
      return;
    }
    if (i += 1, f = n.charCodeAt(i), (f === 43 || f === 45) && (i += 1), i < t && Kr(n.charCodeAt(i)))
      for (; i < t && Kr(n.charCodeAt(i)); )
        i += 1;
    else {
      e.err = `[path-util]: Invalid path value at index ${i}, "${n[i]}" invalid integer exponent`;
      return;
    }
  }
  e.index = i, e.param = +e.pathValue.slice(r, i);
}
function HI(e) {
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
function ta(e) {
  const { pathValue: t, max: n } = e;
  for (; e.index < n && HI(t.charCodeAt(e.index)); )
    e.index += 1;
}
function KI(e) {
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
function YI(e) {
  return (e | 32) === 97;
}
function XI(e) {
  const { max: t, pathValue: n, index: r } = e, i = n.charCodeAt(r), o = uo[n[r].toLowerCase()];
  if (e.segmentStart = r, !KI(i)) {
    e.err = `[path-util]: Invalid path value "${n[r]}" is not a path command`;
    return;
  }
  if (e.index += 1, ta(e), e.data = [], !o) {
    sd(e);
    return;
  }
  for (; ; ) {
    for (let s = o; s > 0; s -= 1) {
      if (YI(i) && (s === 3 || s === 4) ? WI(e) : GI(e), e.err.length)
        return;
      e.data.push(e.param), ta(e), e.index < t && n.charCodeAt(e.index) === 44 && (e.index += 1, ta(e));
    }
    if (e.index >= e.max || !kI(n.charCodeAt(e.index)))
      break;
  }
  sd(e);
}
class JI {
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
function Fl(e) {
  if (qm(e))
    return Di(e);
  const t = new JI(e);
  for (ta(t); t.index < t.max && !t.err.length; )
    XI(t);
  return t.err ? t.err : t.segments;
}
function Gm(e) {
  if (Wm(e))
    return Di(e);
  const t = Fl(e);
  let n = 0, r = 0, i = 0, o = 0;
  return t.map((s) => {
    const a = s.slice(1).map(Number), [u] = s, f = u.toUpperCase();
    if (u === "M")
      return [n, r] = a, i = n, o = r, ["M", n, r];
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
        n = i, r = o;
        break;
      case "H":
        [, n] = c;
        break;
      case "V":
        [, r] = c;
        break;
      default:
        n = c[l - 2], r = c[l - 1], f === "M" && (i = n, o = r);
    }
    return c;
  });
}
function ZI(e, t) {
  const [n] = e, { x1: r, y1: i, x2: o, y2: s } = t, a = e.slice(1).map(Number);
  let u = e;
  if ("TQ".includes(n) || (t.qx = null, t.qy = null), n === "H")
    u = ["L", e[1], i];
  else if (n === "V")
    u = ["L", r, e[1]];
  else if (n === "S") {
    const f = r * 2 - o, c = i * 2 - s;
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
function gu(e) {
  if (km(e))
    return Di(e);
  const t = Gm(e), n = { ...Vm }, r = t.length;
  let i = "";
  for (let o = 0; o < r; o += 1) {
    [i] = t[o], t[o] = ZI(t[o], n);
    const s = t[o], a = s.length;
    n.x1 = +s[a - 2], n.y1 = +s[a - 1], n.x2 = +s[a - 4] || n.x1, n.y2 = +s[a - 3] || n.y1;
  }
  return t;
}
function QI(e) {
  return km(e) && e.every(([t]) => "MC".includes(t));
}
function js(e, t, n) {
  const r = e * Math.cos(n) - t * Math.sin(n), i = e * Math.sin(n) + t * Math.cos(n);
  return { x: r, y: i };
}
function Hm(e, t, n, r, i, o, s, a, u, f) {
  let c = e, l = t, h = n, d = r, _ = a, v = u;
  const g = Math.PI * 120 / 180, y = Math.PI / 180 * (+i || 0);
  let b = [], w, m, A, S, P;
  if (f)
    [m, A, S, P] = f;
  else {
    w = js(c, l, -y), c = w.x, l = w.y, w = js(_, v, -y), _ = w.x, v = w.y;
    const ve = (c - _) / 2, Bt = (l - v) / 2;
    let _r = ve * ve / (h * h) + Bt * Bt / (d * d);
    _r > 1 && (_r = Math.sqrt(_r), h *= _r, d *= _r);
    const Xu = h * h, Ju = d * d, Yh = (o === s ? -1 : 1) * Math.sqrt(Math.abs((Xu * Ju - Xu * Bt * Bt - Ju * ve * ve) / (Xu * Bt * Bt + Ju * ve * ve)));
    S = Yh * h * Bt / d + (c + _) / 2, P = Yh * -d * ve / h + (l + v) / 2, m = Math.asin(((l - P) / d * 10 ** 9 >> 0) / 10 ** 9), A = Math.asin(((v - P) / d * 10 ** 9 >> 0) / 10 ** 9), m = c < S ? Math.PI - m : m, A = _ < S ? Math.PI - A : A, m < 0 && (m = Math.PI * 2 + m), A < 0 && (A = Math.PI * 2 + A), s && m > A && (m -= Math.PI * 2), !s && A > m && (A -= Math.PI * 2);
  }
  let fe = A - m;
  if (Math.abs(fe) > g) {
    const ve = A, Bt = _, _r = v;
    A = m + g * (s && A > m ? 1 : -1), _ = S + h * Math.cos(A), v = P + d * Math.sin(A), b = Hm(_, v, h, d, i, 0, s, Bt, _r, [A, ve, S, P]);
  }
  fe = A - m;
  const wn = Math.cos(m), Ms = Math.sin(m), Xt = Math.cos(A), Ps = Math.sin(A), Hi = Math.tan(fe / 4), Is = 4 / 3 * h * Hi, Cs = 4 / 3 * d * Hi, An = [c, l], On = [c + Is * Ms, l - Cs * wn], Ki = [_ + Is * Ps, v - Cs * Xt], Yi = [_, v];
  if (On[0] = 2 * An[0] - On[0], On[1] = 2 * An[1] - On[1], f)
    return On.concat(Ki, Yi, b);
  b = On.concat(Ki, Yi, b);
  const Yu = [];
  for (let ve = 0, Bt = b.length; ve < Bt; ve += 1)
    Yu[ve] = ve % 2 ? js(b[ve - 1], b[ve], y).y : js(b[ve], b[ve + 1], y).x;
  return Yu;
}
function eC(e, t, n, r, i, o) {
  const s = 0.3333333333333333, a = 2 / 3;
  return [
    s * e + a * n,
    // cpx1
    s * t + a * r,
    // cpy1
    s * i + a * n,
    // cpx2
    s * o + a * r,
    // cpy2
    i,
    o
    // x,y
  ];
}
function At(e, t, n) {
  const r = e[0], i = e[1], o = t[0], s = t[1];
  return [r + (o - r) * n, i + (s - i) * n];
}
function Li(e, t) {
  return Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1]));
}
function Ro(e, t, n, r, i) {
  const o = Li([e, t], [n, r]);
  let s = { x: 0, y: 0 };
  if (typeof i == "number")
    if (i <= 0)
      s = { x: e, y: t };
    else if (i >= o)
      s = { x: n, y: r };
    else {
      const [a, u] = At([e, t], [n, r], i / o);
      s = { x: a, y: u };
    }
  return {
    length: o,
    point: s,
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
function ad(e, t, n, r) {
  const o = [e, t], s = [n, r], a = At(o, s, 0.5), u = At(s, a, 0.5), f = At(a, u, 0.5), c = At(u, f, 0.5), l = At(f, c, 0.5), h = Ro(o[0], o[1], a[0], a[1], f[0]).point, d = Ro(l[0], l[1], c[0], c[1], u[0]).point;
  return [h.x, h.y, d.x, d.y, n, r];
}
function tC(e, t) {
  const [n] = e, r = e.slice(1).map(Number), [i, o] = r;
  let s;
  const { x1: a, y1: u, x: f, y: c } = t;
  switch ("TQ".includes(n) || (t.qx = null, t.qy = null), n) {
    case "M":
      return t.x = i, t.y = o, e;
    case "A":
      return s = [a, u].concat(r), ["C"].concat(
        Hm(s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9])
      );
    case "Q":
      return t.qx = i, t.qy = o, s = [a, u].concat(r), ["C"].concat(eC(s[0], s[1], s[2], s[3], s[4], s[5]));
    case "L":
      return ["C"].concat(ad(a, u, i, o));
    case "Z":
      return a === f && u === c ? ["C", a, u, f, c, f, c] : ["C"].concat(ad(a, u, f, c));
  }
  return e;
}
function Km(e, t = !1) {
  if (QI(e)) {
    const c = Di(e);
    return t ? [c, []] : c;
  }
  const n = gu(e), r = { ...Vm }, i = [];
  let o = "", s = n.length, a, u;
  const f = [];
  for (let c = 0; c < s; c += 1) {
    n[c] && ([o] = n[c]), i[c] = o;
    const l = tC(n[c], r);
    n[c] = l, qI(n, i, c), s = n.length, o === "Z" && f.push(c), a = n[c], u = a.length, r.x1 = +a[u - 2], r.y1 = +a[u - 1], r.x2 = +a[u - 4] || r.x1, r.y2 = +a[u - 3] || r.y1;
  }
  return t ? [n, f] : n;
}
function nC(e) {
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
function ud(e, t) {
  const { x: n, y: r } = e, { x: i, y: o } = t, s = n * i + r * o, a = Math.sqrt((n ** 2 + r ** 2) * (i ** 2 + o ** 2));
  return (n * o - r * i < 0 ? -1 : 1) * Math.acos(s / a);
}
function rC(e, t, n, r, i, o, s, a, u, f) {
  const { abs: c, sin: l, cos: h, sqrt: d, PI: _ } = Math;
  let v = c(n), g = c(r);
  const b = (i % 360 + 360) % 360 * (_ / 180);
  if (e === a && t === u)
    return { x: e, y: t };
  if (v === 0 || g === 0)
    return Ro(e, t, a, u, f).point;
  const w = (e - a) / 2, m = (t - u) / 2, A = {
    x: h(b) * w + l(b) * m,
    y: -l(b) * w + h(b) * m
  }, S = A.x ** 2 / v ** 2 + A.y ** 2 / g ** 2;
  S > 1 && (v *= d(S), g *= d(S));
  const P = v ** 2 * g ** 2 - v ** 2 * A.y ** 2 - g ** 2 * A.x ** 2, fe = v ** 2 * A.y ** 2 + g ** 2 * A.x ** 2;
  let wn = P / fe;
  wn = wn < 0 ? 0 : wn;
  const Ms = (o !== s ? 1 : -1) * d(wn), Xt = {
    x: Ms * (v * A.y / g),
    y: Ms * (-(g * A.x) / v)
  }, Ps = {
    x: h(b) * Xt.x - l(b) * Xt.y + (e + a) / 2,
    y: l(b) * Xt.x + h(b) * Xt.y + (t + u) / 2
  }, Hi = {
    x: (A.x - Xt.x) / v,
    y: (A.y - Xt.y) / g
  }, Is = ud({ x: 1, y: 0 }, Hi), Cs = {
    x: (-A.x - Xt.x) / v,
    y: (-A.y - Xt.y) / g
  };
  let An = ud(Hi, Cs);
  !s && An > 0 ? An -= 2 * _ : s && An < 0 && (An += 2 * _), An %= 2 * _;
  const On = Is + An * f, Ki = v * h(On), Yi = g * l(On);
  return {
    x: h(b) * Ki - l(b) * Yi + Ps.x,
    y: l(b) * Ki + h(b) * Yi + Ps.y
  };
}
function iC(e, t, n, r, i, o, s, a, u, f) {
  const c = typeof f == "number";
  let l = e, h = t, d = 0, _ = [l, h, d], v = [l, h], g = 0, y = { x: 0, y: 0 }, b = [{ x: l, y: h }];
  c && f <= 0 && (y = { x: l, y: h });
  const w = 100;
  for (let m = 0; m <= w; m += 1) {
    if (g = m / w, { x: l, y: h } = rC(e, t, n, r, i, o, s, a, u, g), b = b.concat({ x: l, y: h }), d += Li(v, [l, h]), v = [l, h], c && d >= f && f > _[2]) {
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
function oC(e, t, n, r, i, o, s, a, u) {
  const f = 1 - u;
  return {
    x: f ** 3 * e + 3 * f ** 2 * u * n + 3 * f * u ** 2 * i + u ** 3 * s,
    y: f ** 3 * t + 3 * f ** 2 * u * r + 3 * f * u ** 2 * o + u ** 3 * a
  };
}
function Ym(e, t, n, r, i, o, s, a, u) {
  const f = typeof u == "number";
  let c = e, l = t, h = 0, d = [c, l, h], _ = [c, l], v = 0, g = { x: 0, y: 0 }, y = [{ x: c, y: l }];
  f && u <= 0 && (g = { x: c, y: l });
  const b = 30;
  for (let w = 0; w <= b; w += 1) {
    if (v = w / b, { x: c, y: l } = oC(e, t, n, r, i, o, s, a, v), y = y.concat({ x: c, y: l }), h += Li(_, [c, l]), _ = [c, l], f && h >= u && u > d[2]) {
      const m = (h - u) / (h - d[2]);
      g = {
        x: _[0] * (1 - m) + d[0] * m,
        y: _[1] * (1 - m) + d[1] * m
      };
    }
    d = [c, l, h];
  }
  return f && u >= h && (g = { x: s, y: a }), {
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
function sC(e, t, n, r, i, o, s) {
  const a = 1 - s;
  return {
    x: a ** 2 * e + 2 * a * s * n + s ** 2 * i,
    y: a ** 2 * t + 2 * a * s * r + s ** 2 * o
  };
}
function aC(e, t, n, r, i, o, s) {
  const a = typeof s == "number";
  let u = e, f = t, c = 0, l = [u, f, c], h = [u, f], d = 0, _ = { x: 0, y: 0 }, v = [{ x: u, y: f }];
  a && s <= 0 && (_ = { x: u, y: f });
  const g = 30;
  for (let y = 0; y <= g; y += 1) {
    if (d = y / g, { x: u, y: f } = sC(e, t, n, r, i, o, d), v = v.concat({ x: u, y: f }), c += Li(h, [u, f]), h = [u, f], a && c >= s && s > l[2]) {
      const b = (c - s) / (c - l[2]);
      _ = {
        x: h[0] * (1 - b) + l[0] * b,
        y: h[1] * (1 - b) + l[1] * b
      };
    }
    l = [u, f, c];
  }
  return a && s >= c && (_ = { x: i, y: o }), {
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
function yu(e, t) {
  const n = gu(e), r = typeof t == "number";
  let i, o = [], s, a = 0, u = 0, f = 0, c = 0, l, h = [], d = [], _ = 0, v = { x: 0, y: 0 }, g = v, y = v, b = v, w = 0;
  for (let m = 0, A = n.length; m < A; m += 1)
    l = n[m], [s] = l, i = s === "M", o = i ? o : [a, u].concat(l.slice(1)), i ? ([, f, c] = l, v = { x: f, y: c }, g = v, _ = 0, r && t < 1e-3 && (b = v)) : s === "L" ? { length: _, min: v, max: g, point: y } = Ro(o[0], o[1], o[2], o[3], (t || 0) - w) : s === "A" ? { length: _, min: v, max: g, point: y } = iC(
      o[0],
      o[1],
      o[2],
      o[3],
      o[4],
      o[5],
      o[6],
      o[7],
      o[8],
      (t || 0) - w
    ) : s === "C" ? { length: _, min: v, max: g, point: y } = Ym(
      o[0],
      o[1],
      o[2],
      o[3],
      o[4],
      o[5],
      o[6],
      o[7],
      (t || 0) - w
    ) : s === "Q" ? { length: _, min: v, max: g, point: y } = aC(
      o[0],
      o[1],
      o[2],
      o[3],
      o[4],
      o[5],
      (t || 0) - w
    ) : s === "Z" && (o = [a, u, f, c], { length: _, min: v, max: g, point: y } = Ro(o[0], o[1], o[2], o[3], (t || 0) - w)), r && w < t && w + _ >= t && (b = y), d.push(g), h.push(v), w += _, [a, u] = s !== "Z" ? l.slice(-2) : [f, c];
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
function uC(e) {
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
  } = yu(e), o = r - t, s = i - n;
  return {
    width: o,
    height: s,
    x: t,
    y: n,
    x2: r,
    y2: i,
    cx: t + o / 2,
    cy: n + s / 2,
    // an estimted guess
    cz: Math.max(o, s) + Math.min(o, s) / 2
  };
}
function fo(e) {
  return yu(e).length;
}
function fC(e) {
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
    max: { x: i, y: o }
  } = yu(e), s = i - n, a = o - r;
  return {
    length: t,
    width: s,
    height: a,
    x: n,
    y: r,
    x2: i,
    y2: o,
    cx: n + s / 2,
    cy: r + a / 2,
    // an estimted guess
    cz: Math.max(s, a) + Math.min(s, a) / 2
  };
}
function cC(e) {
  const t = e.length, n = t - 1;
  return e.map(
    (r, i) => e.map((o, s) => {
      let a = i + s, u;
      return s === 0 || e[a] && e[a][0] === "M" ? (u = e[a], ["M"].concat(u.slice(-2))) : (a >= t && (a -= n), e[a]);
    })
  );
}
function lC(e, t) {
  const n = e.length - 1, r = [];
  let i = 0, o = 0;
  const s = cC(e);
  return s.forEach((a, u) => {
    e.slice(1).forEach((f, c) => {
      o += Li(e[(u + c) % n].slice(-2), t[c % n].slice(-2));
    }), r[u] = o, o = 0;
  }), i = r.indexOf(Math.min.apply(null, r)), s[i];
}
function hC(e, t, n, r, i, o, s, a) {
  return 3 * ((a - t) * (n + i) - (s - e) * (r + o) + r * (e - i) - n * (t - o) + a * (i + e / 3) - s * (o + t / 3)) / 20;
}
function Xm(e) {
  let t = 0, n = 0, r = 0;
  return Km(e).map((i) => {
    switch (i[0]) {
      case "M":
        return [, t, n] = i, 0;
      default:
        const [o, s, a, u, f, c] = i.slice(1);
        return r = hC(t, n, o, s, a, u, f, c), [t, n] = i.slice(-2), r;
    }
  }).reduce((i, o) => i + o, 0);
}
function pC(e) {
  return Xm(e) >= 0;
}
function na(e, t) {
  return yu(e, t).point;
}
function dC(e, t) {
  const n = Fl(e);
  if (typeof n == "string")
    throw TypeError(n);
  let r = n.slice(), i = fo(r), o = r.length - 1, s = 0, a = 0, u = n[0];
  const [f, c] = u.slice(-2), l = { x: f, y: c };
  if (o <= 0 || !t || !Number.isFinite(t))
    return {
      segment: u,
      index: 0,
      length: a,
      point: l,
      lengthAtSegment: s
    };
  if (t >= i)
    return r = n.slice(0, -1), s = fo(r), a = i - s, {
      segment: n[o],
      index: o,
      length: a,
      lengthAtSegment: s
    };
  const h = [];
  for (; o > 0; )
    u = r[o], r = r.slice(0, -1), s = fo(r), a = i - s, i = s, h.push({
      segment: u,
      index: o,
      length: a,
      lengthAtSegment: s
    }), o -= 1;
  return h.find(({ lengthAtSegment: d }) => d <= t);
}
function _C(e, t) {
  const n = Fl(e), r = gu(n), i = fo(n), o = (m) => {
    const A = m.x - t.x, S = m.y - t.y;
    return A * A + S * S;
  };
  let s = 8, a, u = 0, f = { x: 0, y: 0 }, c = 0, l = 1 / 0;
  for (let m = 0; m <= i; m += s)
    a = na(r, m), u = o(a), u < l && (f = a, c = m, l = u);
  s /= 2;
  let h, d, _ = 0, v = 0, g = 0, y = 0;
  for (; s > 0.5; )
    _ = c - s, h = na(r, _), g = o(h), v = c + s, d = na(r, v), y = o(d), _ >= 0 && g < l ? (f = h, c = _, l = g) : v <= i && y < l ? (f = d, c = v, l = y) : s /= 2;
  const b = dC(n, c), w = Math.sqrt(l);
  return { closest: f, distance: w, segment: b };
}
function vC(e, t) {
  const { distance: n } = _C(e, t);
  return Math.abs(n) < 1e-3;
}
function gC(e, t = 0.5) {
  const n = e.slice(0, 2), r = e.slice(2, 4), i = e.slice(4, 6), o = e.slice(6, 8), s = At(n, r, t), a = At(r, i, t), u = At(i, o, t), f = At(s, a, t), c = At(a, u, t), l = At(f, c, t);
  return [
    // @ts-ignore
    ["C"].concat(s, f, l),
    // @ts-ignore
    ["C"].concat(c, u, o)
  ];
}
function fd(e) {
  return e.map((t, n, r) => {
    const i = n && r[n - 1].slice(-2).concat(t.slice(1)), o = n ? Ym(
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
    let s;
    return n ? s = o ? gC(i) : [t, t] : s = [t], {
      s: t,
      ss: s,
      l: o
    };
  });
}
function Jm(e, t, n) {
  const r = fd(e), i = fd(t), o = r.length, s = i.length, a = r.filter((g) => g.l).length, u = i.filter((g) => g.l).length, f = r.filter((g) => g.l).reduce((g, { l: y }) => g + y, 0) / a || 0, c = i.filter((g) => g.l).reduce((g, { l: y }) => g + y, 0) / u || 0, l = n || Math.max(o, s), h = [f, c], d = [l - o, l - s];
  let _ = 0;
  const v = [r, i].map(
    (g, y) => (
      // @ts-ignore
      g.l === l ? g.map((b) => b.s) : g.map((b, w) => (_ = w && d[y] && b.l >= h[y], d[y] -= _ ? 1 : 0, _ ? b.ss : [b.s])).flat()
    )
  );
  return v[0].length === v[1].length ? v : Jm(v[0], v[1], l);
}
const jB = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angleTo: BI,
  clonePath: Di,
  direction: Um,
  distanceSquareRoot: Li,
  equalizeSegments: Jm,
  getDrawDirection: pC,
  getPathArea: Xm,
  getPathBBox: uC,
  getPathBBoxTotalLength: fC,
  getPointAtLength: na,
  getRotatedCurve: lC,
  getTotalLength: fo,
  gradient: OI,
  isPointInStroke: vC,
  normalizePath: gu,
  path2Absolute: Gm,
  path2Curve: Km,
  path2String: VI,
  reverseCurve: nC,
  rgb2arr: jm,
  toCSSGradient: TI,
  toRGB: zm,
  transform: jI,
  vertical: zI
}, Symbol.toStringTag, { value: "Module" }));
var bu = Symbol.for("immer-nothing"), ii = Symbol.for("immer-draftable"), z = Symbol.for("immer-state"), Zm = process.env.NODE_ENV !== "production" ? [
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
function ue(e, ...t) {
  if (process.env.NODE_ENV !== "production") {
    const n = Zm[e], r = typeof n == "function" ? n.apply(null, t) : n;
    throw new Error(`[Immer] ${r}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var Ar = Object.getPrototypeOf;
function Cn(e) {
  return !!e && !!e[z];
}
function Ht(e) {
  return e ? Qm(e) || Array.isArray(e) || !!e[ii] || !!e.constructor?.[ii] || us(e) || fs(e) : !1;
}
var yC = Object.prototype.constructor.toString();
function Qm(e) {
  if (!e || typeof e != "object")
    return !1;
  const t = Ar(e);
  if (t === null)
    return !0;
  const n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return n === Object ? !0 : typeof n == "function" && Function.toString.call(n) === yC;
}
function bC(e) {
  return Cn(e) || ue(15, e), e[z].base_;
}
function li(e, t) {
  Or(e) === 0 ? Reflect.ownKeys(e).forEach((n) => {
    t(n, e[n], e);
  }) : e.forEach((n, r) => t(r, n, e));
}
function Or(e) {
  const t = e[z];
  return t ? t.type_ : Array.isArray(e) ? 1 : us(e) ? 2 : fs(e) ? 3 : 0;
}
function To(e, t) {
  return Or(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function af(e, t) {
  return Or(e) === 2 ? e.get(t) : e[t];
}
function e1(e, t, n) {
  const r = Or(e);
  r === 2 ? e.set(t, n) : r === 3 ? e.add(n) : e[t] = n;
}
function mC(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function us(e) {
  return e instanceof Map;
}
function fs(e) {
  return e instanceof Set;
}
function ge(e) {
  return e.copy_ || e.base_;
}
function Xf(e, t) {
  if (us(e))
    return new Map(e);
  if (fs(e))
    return new Set(e);
  if (Array.isArray(e))
    return Array.prototype.slice.call(e);
  const n = Qm(e);
  if (t === !0 || t === "class_only" && !n) {
    const r = Object.getOwnPropertyDescriptors(e);
    delete r[z];
    let i = Reflect.ownKeys(r);
    for (let o = 0; o < i.length; o++) {
      const s = i[o], a = r[s];
      a.writable === !1 && (a.writable = !0, a.configurable = !0), (a.get || a.set) && (r[s] = {
        configurable: !0,
        writable: !0,
        // could live with !!desc.set as well here...
        enumerable: a.enumerable,
        value: e[s]
      });
    }
    return Object.create(Ar(e), r);
  } else {
    const r = Ar(e);
    if (r !== null && n)
      return { ...e };
    const i = Object.create(r);
    return Object.assign(i, e);
  }
}
function mu(e, t = !1) {
  return wu(e) || Cn(e) || !Ht(e) || (Or(e) > 1 && (e.set = e.add = e.clear = e.delete = wC), Object.freeze(e), t && Object.entries(e).forEach(([n, r]) => mu(r, !0))), e;
}
function wC() {
  ue(2);
}
function wu(e) {
  return Object.isFrozen(e);
}
var Jf = {};
function Er(e) {
  const t = Jf[e];
  return t || ue(0, e), t;
}
function t1(e, t) {
  Jf[e] || (Jf[e] = t);
}
var $o;
function da() {
  return $o;
}
function AC(e, t) {
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
function cd(e, t) {
  t && (Er("Patches"), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function Zf(e) {
  Qf(e), e.drafts_.forEach(OC), e.drafts_ = null;
}
function Qf(e) {
  e === $o && ($o = e.parent_);
}
function ld(e) {
  return $o = AC($o, e);
}
function OC(e) {
  const t = e[z];
  t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function hd(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const n = t.drafts_[0];
  return e !== void 0 && e !== n ? (n[z].modified_ && (Zf(t), ue(4)), Ht(e) && (e = _a(t, e), t.parent_ || va(t, e)), t.patches_ && Er("Patches").generateReplacementPatches_(
    n[z].base_,
    e,
    t.patches_,
    t.inversePatches_
  )) : e = _a(t, n, []), Zf(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== bu ? e : void 0;
}
function _a(e, t, n) {
  if (wu(t))
    return t;
  const r = t[z];
  if (!r)
    return li(
      t,
      (i, o) => pd(e, r, t, i, o, n)
    ), t;
  if (r.scope_ !== e)
    return t;
  if (!r.modified_)
    return va(e, r.base_, !0), r.base_;
  if (!r.finalized_) {
    r.finalized_ = !0, r.scope_.unfinalizedDrafts_--;
    const i = r.copy_;
    let o = i, s = !1;
    r.type_ === 3 && (o = new Set(i), i.clear(), s = !0), li(
      o,
      (a, u) => pd(e, r, i, a, u, n, s)
    ), va(e, i, !1), n && e.patches_ && Er("Patches").generatePatches_(
      r,
      n,
      e.patches_,
      e.inversePatches_
    );
  }
  return r.copy_;
}
function pd(e, t, n, r, i, o, s) {
  if (process.env.NODE_ENV !== "production" && i === n && ue(5), Cn(i)) {
    const a = o && t && t.type_ !== 3 && // Set objects are atomic since they have no keys.
    !To(t.assigned_, r) ? o.concat(r) : void 0, u = _a(e, i, a);
    if (e1(n, r, u), Cn(u))
      e.canAutoFreeze_ = !1;
    else
      return;
  } else s && n.add(i);
  if (Ht(i) && !wu(i)) {
    if (!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1)
      return;
    _a(e, i), (!t || !t.scope_.parent_) && typeof r != "symbol" && Object.prototype.propertyIsEnumerable.call(n, r) && va(e, i);
  }
}
function va(e, t, n = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && mu(t, n);
}
function EC(e, t) {
  const n = Array.isArray(e), r = {
    type_: n ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: t ? t.scope_ : da(),
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
  let i = r, o = jl;
  n && (i = [r], o = No);
  const { revoke: s, proxy: a } = Proxy.revocable(i, o);
  return r.draft_ = a, r.revoke_ = s, a;
}
var jl = {
  get(e, t) {
    if (t === z)
      return e;
    const n = ge(e);
    if (!To(n, t))
      return SC(e, n, t);
    const r = n[t];
    return e.finalized_ || !Ht(r) ? r : r === uf(e.base_, t) ? (ff(e), e.copy_[t] = Mo(r, e)) : r;
  },
  has(e, t) {
    return t in ge(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(ge(e));
  },
  set(e, t, n) {
    const r = n1(ge(e), t);
    if (r?.set)
      return r.set.call(e.draft_, n), !0;
    if (!e.modified_) {
      const i = uf(ge(e), t), o = i?.[z];
      if (o && o.base_ === n)
        return e.copy_[t] = n, e.assigned_[t] = !1, !0;
      if (mC(n, i) && (n !== void 0 || To(e.base_, t)))
        return !0;
      ff(e), xn(e);
    }
    return e.copy_[t] === n && // special case: handle new props with value 'undefined'
    (n !== void 0 || t in e.copy_) || // special case: NaN
    Number.isNaN(n) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = n, e.assigned_[t] = !0), !0;
  },
  deleteProperty(e, t) {
    return uf(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_[t] = !1, ff(e), xn(e)) : delete e.assigned_[t], e.copy_ && delete e.copy_[t], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(e, t) {
    const n = ge(e), r = Reflect.getOwnPropertyDescriptor(n, t);
    return r && {
      writable: !0,
      configurable: e.type_ !== 1 || t !== "length",
      enumerable: r.enumerable,
      value: n[t]
    };
  },
  defineProperty() {
    ue(11);
  },
  getPrototypeOf(e) {
    return Ar(e.base_);
  },
  setPrototypeOf() {
    ue(12);
  }
}, No = {};
li(jl, (e, t) => {
  No[e] = function() {
    return arguments[0] = arguments[0][0], t.apply(this, arguments);
  };
});
No.deleteProperty = function(e, t) {
  return process.env.NODE_ENV !== "production" && isNaN(parseInt(t)) && ue(13), No.set.call(this, e, t, void 0);
};
No.set = function(e, t, n) {
  return process.env.NODE_ENV !== "production" && t !== "length" && isNaN(parseInt(t)) && ue(14), jl.set.call(this, e[0], t, n, e[0]);
};
function uf(e, t) {
  const n = e[z];
  return (n ? ge(n) : e)[t];
}
function SC(e, t, n) {
  const r = n1(t, n);
  return r ? "value" in r ? r.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    r.get?.call(e.draft_)
  ) : void 0;
}
function n1(e, t) {
  if (!(t in e))
    return;
  let n = Ar(e);
  for (; n; ) {
    const r = Object.getOwnPropertyDescriptor(n, t);
    if (r)
      return r;
    n = Ar(n);
  }
}
function xn(e) {
  e.modified_ || (e.modified_ = !0, e.parent_ && xn(e.parent_));
}
function ff(e) {
  e.copy_ || (e.copy_ = Xf(
    e.base_,
    e.scope_.immer_.useStrictShallowCopy_
  ));
}
var r1 = class {
  constructor(e) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.produce = (t, n, r) => {
      if (typeof t == "function" && typeof n != "function") {
        const o = n;
        n = t;
        const s = this;
        return function(u = o, ...f) {
          return s.produce(u, (c) => n.call(this, c, ...f));
        };
      }
      typeof n != "function" && ue(6), r !== void 0 && typeof r != "function" && ue(7);
      let i;
      if (Ht(t)) {
        const o = ld(this), s = Mo(t, void 0);
        let a = !0;
        try {
          i = n(s), a = !1;
        } finally {
          a ? Zf(o) : Qf(o);
        }
        return cd(o, r), hd(i, o);
      } else if (!t || typeof t != "object") {
        if (i = n(t), i === void 0 && (i = t), i === bu && (i = void 0), this.autoFreeze_ && mu(i, !0), r) {
          const o = [], s = [];
          Er("Patches").generateReplacementPatches_(t, i, o, s), r(o, s);
        }
        return i;
      } else
        ue(1, t);
    }, this.produceWithPatches = (t, n) => {
      if (typeof t == "function")
        return (s, ...a) => this.produceWithPatches(s, (u) => t(u, ...a));
      let r, i;
      return [this.produce(t, n, (s, a) => {
        r = s, i = a;
      }), r, i];
    }, typeof e?.autoFreeze == "boolean" && this.setAutoFreeze(e.autoFreeze), typeof e?.useStrictShallowCopy == "boolean" && this.setUseStrictShallowCopy(e.useStrictShallowCopy);
  }
  createDraft(e) {
    Ht(e) || ue(8), Cn(e) && (e = i1(e));
    const t = ld(this), n = Mo(e, void 0);
    return n[z].isManual_ = !0, Qf(t), n;
  }
  finishDraft(e, t) {
    const n = e && e[z];
    (!n || !n.isManual_) && ue(9);
    const { scope_: r } = n;
    return cd(r, t), hd(void 0, r);
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
    const r = Er("Patches").applyPatches_;
    return Cn(e) ? r(e, t) : this.produce(
      e,
      (i) => r(i, t)
    );
  }
};
function Mo(e, t) {
  const n = us(e) ? Er("MapSet").proxyMap_(e, t) : fs(e) ? Er("MapSet").proxySet_(e, t) : EC(e, t);
  return (t ? t.scope_ : da()).drafts_.push(n), n;
}
function i1(e) {
  return Cn(e) || ue(10, e), o1(e);
}
function o1(e) {
  if (!Ht(e) || wu(e))
    return e;
  const t = e[z];
  let n;
  if (t) {
    if (!t.modified_)
      return t.base_;
    t.finalized_ = !0, n = Xf(e, t.scope_.immer_.useStrictShallowCopy_);
  } else
    n = Xf(e, !0);
  return li(n, (r, i) => {
    e1(n, r, o1(i));
  }), t && (t.finalized_ = !1), n;
}
function xC() {
  process.env.NODE_ENV !== "production" && Zm.push(
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
        return s(
          h,
          d,
          _,
          v
        );
      case 1:
        return o(h, d, _, v);
      case 3:
        return a(
          h,
          d,
          _,
          v
        );
    }
  }
  function o(h, d, _, v) {
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
  function s(h, d, _, v) {
    const { base_: g, copy_: y } = h;
    li(h.assigned_, (b, w) => {
      const m = af(g, b), A = af(y, b), S = w ? To(g, b) ? t : n : r;
      if (m === A && S === t)
        return;
      const P = d.concat(b);
      _.push(S === r ? { op: S, path: P } : { op: S, path: P, value: A }), v.push(
        S === n ? { op: r, path: P } : S === r ? { op: n, path: P, value: l(m) } : { op: t, path: P, value: l(m) }
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
      value: d === bu ? void 0 : d
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
        const S = Or(y);
        let P = v[A];
        typeof P != "string" && typeof P != "number" && (P = "" + P), (S === 0 || S === 1) && (P === "__proto__" || P === "constructor") && ue(19), typeof y == "function" && P === "prototype" && ue(19), y = af(y, P), typeof y != "object" && ue(18, v.join("/"));
      }
      const b = Or(y), w = c(_.value), m = v[v.length - 1];
      switch (g) {
        case t:
          switch (b) {
            case 2:
              return y.set(m, w);
            case 3:
              ue(16);
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
          ue(17, g);
      }
    }), h;
  }
  function c(h) {
    if (!Ht(h))
      return h;
    if (Array.isArray(h))
      return h.map(c);
    if (us(h))
      return new Map(
        Array.from(h.entries()).map(([_, v]) => [_, c(v)])
      );
    if (fs(h))
      return new Set(Array.from(h).map(c));
    const d = Object.create(Ar(h));
    for (const _ in h)
      d[_] = c(h[_]);
    return To(h, ii) && (d[ii] = h[ii]), d;
  }
  function l(h) {
    return Cn(h) ? c(h) : h;
  }
  t1("Patches", {
    applyPatches_: f,
    generatePatches_: i,
    generateReplacementPatches_: u
  });
}
function RC() {
  class e extends Map {
    constructor(u, f) {
      super(), this[z] = {
        type_: 2,
        parent_: f,
        scope_: f ? f.scope_ : da(),
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
      return ge(this[z]).size;
    }
    has(u) {
      return ge(this[z]).has(u);
    }
    set(u, f) {
      const c = this[z];
      return s(c), (!ge(c).has(u) || ge(c).get(u) !== f) && (n(c), xn(c), c.assigned_.set(u, !0), c.copy_.set(u, f), c.assigned_.set(u, !0)), this;
    }
    delete(u) {
      if (!this.has(u))
        return !1;
      const f = this[z];
      return s(f), n(f), xn(f), f.base_.has(u) ? f.assigned_.set(u, !1) : f.assigned_.delete(u), f.copy_.delete(u), !0;
    }
    clear() {
      const u = this[z];
      s(u), ge(u).size && (n(u), xn(u), u.assigned_ = /* @__PURE__ */ new Map(), li(u.base_, (f) => {
        u.assigned_.set(f, !1);
      }), u.copy_.clear());
    }
    forEach(u, f) {
      const c = this[z];
      ge(c).forEach((l, h, d) => {
        u.call(f, this.get(h), h, this);
      });
    }
    get(u) {
      const f = this[z];
      s(f);
      const c = ge(f).get(u);
      if (f.finalized_ || !Ht(c) || c !== f.base_.get(u))
        return c;
      const l = Mo(c, f);
      return n(f), f.copy_.set(u, l), l;
    }
    keys() {
      return ge(this[z]).keys();
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
      super(), this[z] = {
        type_: 3,
        parent_: f,
        scope_: f ? f.scope_ : da(),
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
      return ge(this[z]).size;
    }
    has(u) {
      const f = this[z];
      return s(f), f.copy_ ? !!(f.copy_.has(u) || f.drafts_.has(u) && f.copy_.has(f.drafts_.get(u))) : f.base_.has(u);
    }
    add(u) {
      const f = this[z];
      return s(f), this.has(u) || (o(f), xn(f), f.copy_.add(u)), this;
    }
    delete(u) {
      if (!this.has(u))
        return !1;
      const f = this[z];
      return s(f), o(f), xn(f), f.copy_.delete(u) || (f.drafts_.has(u) ? f.copy_.delete(f.drafts_.get(u)) : (
        /* istanbul ignore next */
        !1
      ));
    }
    clear() {
      const u = this[z];
      s(u), ge(u).size && (o(u), xn(u), u.copy_.clear());
    }
    values() {
      const u = this[z];
      return s(u), o(u), u.copy_.values();
    }
    entries() {
      const u = this[z];
      return s(u), o(u), u.copy_.entries();
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
  function o(a) {
    a.copy_ || (a.copy_ = /* @__PURE__ */ new Set(), a.base_.forEach((u) => {
      if (Ht(u)) {
        const f = Mo(u, a);
        a.drafts_.set(u, f), a.copy_.add(f);
      } else
        a.copy_.add(u);
    }));
  }
  function s(a) {
    a.revoked_ && ue(3, JSON.stringify(ge(a)));
  }
  t1("MapSet", { proxyMap_: t, proxySet_: i });
}
var vt = new r1(), TC = vt.produce, $C = vt.produceWithPatches.bind(
  vt
), NC = vt.setAutoFreeze.bind(vt), MC = vt.setUseStrictShallowCopy.bind(vt), PC = vt.applyPatches.bind(vt), IC = vt.createDraft.bind(vt), CC = vt.finishDraft.bind(vt);
function DC(e) {
  return e;
}
function LC(e) {
  return e;
}
const BB = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Immer: r1,
  applyPatches: PC,
  castDraft: DC,
  castImmutable: LC,
  createDraft: IC,
  current: i1,
  enableMapSet: RC,
  enablePatches: xC,
  finishDraft: CC,
  freeze: mu,
  immerable: ii,
  isDraft: Cn,
  isDraftable: Ht,
  nothing: bu,
  original: bC,
  produce: TC,
  produceWithPatches: $C,
  setAutoFreeze: NC,
  setUseStrictShallowCopy: MC
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
var cs = "delete", K = 5, st = 1 << K, Le = st - 1, L = {};
function ec() {
  return { value: !1 };
}
function St(e) {
  e && (e.value = !0);
}
function Bl() {
}
function hi(e) {
  return e.size === void 0 && (e.size = e.__iterate(s1)), e.size;
}
function er(e, t) {
  if (typeof t != "number") {
    var n = t >>> 0;
    if ("" + n !== t || n === 4294967295)
      return NaN;
    t = n;
  }
  return t < 0 ? hi(e) + t : t;
}
function s1() {
  return !0;
}
function ls(e, t, n) {
  return (e === 0 && !u1(e) || n !== void 0 && e <= -n) && (t === void 0 || n !== void 0 && t >= n);
}
function Fi(e, t) {
  return a1(e, t, 0);
}
function hs(e, t) {
  return a1(e, t, t);
}
function a1(e, t, n) {
  return e === void 0 ? n : u1(e) ? t === 1 / 0 ? t : Math.max(0, t + e) | 0 : t === void 0 || t === e ? e : Math.min(t, e) | 0;
}
function u1(e) {
  return e < 0 || e === 0 && 1 / e === -1 / 0;
}
var f1 = "@@__IMMUTABLE_ITERABLE__@@";
function et(e) {
  return !!(e && // @ts-expect-error: maybeCollection is typed as `{}`, need to change in 6.0 to `maybeCollection && typeof maybeCollection === 'object' && IS_COLLECTION_SYMBOL in maybeCollection`
  e[f1]);
}
var ga = "@@__IMMUTABLE_KEYED__@@";
function X(e) {
  return !!(e && // @ts-expect-error: maybeKeyed is typed as `{}`, need to change in 6.0 to `maybeKeyed && typeof maybeKeyed === 'object' && IS_KEYED_SYMBOL in maybeKeyed`
  e[ga]);
}
var ya = "@@__IMMUTABLE_INDEXED__@@";
function tt(e) {
  return !!(e && // @ts-expect-error: maybeIndexed is typed as `{}`, need to change in 6.0 to `maybeIndexed && typeof maybeIndexed === 'object' && IS_INDEXED_SYMBOL in maybeIndexed`
  e[ya]);
}
function Au(e) {
  return X(e) || tt(e);
}
var we = function(t) {
  return et(t) ? t : Pe(t);
}, Lt = /* @__PURE__ */ function(e) {
  function t(n) {
    return X(n) ? n : lr(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(we), jr = /* @__PURE__ */ function(e) {
  function t(n) {
    return tt(n) ? n : jt(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(we), ji = /* @__PURE__ */ function(e) {
  function t(n) {
    return et(n) && !Au(n) ? n : Ui(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(we);
we.Keyed = Lt;
we.Indexed = jr;
we.Set = ji;
var c1 = "@@__IMMUTABLE_SEQ__@@";
function Ou(e) {
  return !!(e && // @ts-expect-error: maybeSeq is typed as `{}`, need to change in 6.0 to `maybeSeq && typeof maybeSeq === 'object' && MAYBE_SEQ_SYMBOL in maybeSeq`
  e[c1]);
}
var l1 = "@@__IMMUTABLE_RECORD__@@";
function cr(e) {
  return !!(e && // @ts-expect-error: maybeRecord is typed as `{}`, need to change in 6.0 to `maybeRecord && typeof maybeRecord === 'object' && IS_RECORD_SYMBOL in maybeRecord`
  e[l1]);
}
function Ft(e) {
  return et(e) || cr(e);
}
var tr = "@@__IMMUTABLE_ORDERED__@@";
function Vt(e) {
  return !!(e && // @ts-expect-error: maybeOrdered is typed as `{}`, need to change in 6.0 to `maybeOrdered && typeof maybeOrdered === 'object' && IS_ORDERED_SYMBOL in maybeOrdered`
  e[tr]);
}
var Bi = 0, gt = 1, yt = 2, tc = typeof Symbol == "function" && Symbol.iterator, h1 = "@@iterator", Eu = tc || h1, F = function(t) {
  this.next = t;
};
F.prototype.toString = function() {
  return "[Iterator]";
};
F.KEYS = Bi;
F.VALUES = gt;
F.ENTRIES = yt;
F.prototype.inspect = F.prototype.toSource = function() {
  return this.toString();
};
F.prototype[Eu] = function() {
  return this;
};
function ee(e, t, n, r) {
  var i = e === Bi ? t : e === gt ? n : [t, n];
  return r ? r.value = i : r = {
    value: i,
    done: !1
  }, r;
}
function Me() {
  return { value: void 0, done: !0 };
}
function zl(e) {
  return Array.isArray(e) ? !0 : !!Su(e);
}
function dd(e) {
  return e && typeof e.next == "function";
}
function nc(e) {
  var t = Su(e);
  return t && t.call(e);
}
function Su(e) {
  var t = e && (tc && e[tc] || e[h1]);
  if (typeof t == "function")
    return t;
}
function FC(e) {
  var t = Su(e);
  return t && t === e.entries;
}
function jC(e) {
  var t = Su(e);
  return t && t === e.keys;
}
var zi = Object.prototype.hasOwnProperty;
function Ul(e) {
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
var Pe = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? ql() : Ft(n) ? n.toSeq() : zC(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toSeq = function() {
    return this;
  }, t.prototype.toString = function() {
    return this.__toString("Seq {", "}");
  }, t.prototype.cacheResult = function() {
    return !this._cache && this.__iterateUncached && (this._cache = this.entrySeq().toArray(), this.size = this._cache.length), this;
  }, t.prototype.__iterate = function(r, i) {
    var o = this._cache;
    if (o) {
      for (var s = o.length, a = 0; a !== s; ) {
        var u = o[i ? s - ++a : a++];
        if (r(u[1], u[0], this) === !1)
          break;
      }
      return a;
    }
    return this.__iterateUncached(r, i);
  }, t.prototype.__iterator = function(r, i) {
    var o = this._cache;
    if (o) {
      var s = o.length, a = 0;
      return new F(function() {
        if (a === s)
          return Me();
        var u = o[i ? s - ++a : a++];
        return ee(r, u[0], u[1]);
      });
    }
    return this.__iteratorUncached(r, i);
  }, t;
}(we), lr = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? ql().toKeyedSeq() : et(n) ? X(n) ? n.toSeq() : n.fromEntrySeq() : cr(n) ? n.toSeq() : Wl(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toKeyedSeq = function() {
    return this;
  }, t;
}(Pe), jt = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? ql() : et(n) ? X(n) ? n.entrySeq() : n.toIndexedSeq() : cr(n) ? n.toSeq().entrySeq() : p1(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return t(arguments);
  }, t.prototype.toIndexedSeq = function() {
    return this;
  }, t.prototype.toString = function() {
    return this.__toString("Seq [", "]");
  }, t;
}(Pe), Ui = /* @__PURE__ */ function(e) {
  function t(n) {
    return (et(n) && !Au(n) ? n : jt(n)).toSetSeq();
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return t(arguments);
  }, t.prototype.toSetSeq = function() {
    return this;
  }, t;
}(Pe);
Pe.isSeq = Ou;
Pe.Keyed = lr;
Pe.Set = Ui;
Pe.Indexed = jt;
Pe.prototype[c1] = !0;
var pi = /* @__PURE__ */ function(e) {
  function t(n) {
    this._array = n, this.size = n.length;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(r, i) {
    return this.has(r) ? this._array[er(this, r)] : i;
  }, t.prototype.__iterate = function(r, i) {
    for (var o = this._array, s = o.length, a = 0; a !== s; ) {
      var u = i ? s - ++a : a++;
      if (r(o[u], u, this) === !1)
        break;
    }
    return a;
  }, t.prototype.__iterator = function(r, i) {
    var o = this._array, s = o.length, a = 0;
    return new F(function() {
      if (a === s)
        return Me();
      var u = i ? s - ++a : a++;
      return ee(r, u, o[u]);
    });
  }, t;
}(jt), Vl = /* @__PURE__ */ function(e) {
  function t(n) {
    var r = Object.keys(n).concat(
      Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(n) : []
    );
    this._object = n, this._keys = r, this.size = r.length;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(r, i) {
    return i !== void 0 && !this.has(r) ? i : this._object[r];
  }, t.prototype.has = function(r) {
    return zi.call(this._object, r);
  }, t.prototype.__iterate = function(r, i) {
    for (var o = this._object, s = this._keys, a = s.length, u = 0; u !== a; ) {
      var f = s[i ? a - ++u : u++];
      if (r(o[f], f, this) === !1)
        break;
    }
    return u;
  }, t.prototype.__iterator = function(r, i) {
    var o = this._object, s = this._keys, a = s.length, u = 0;
    return new F(function() {
      if (u === a)
        return Me();
      var f = s[i ? a - ++u : u++];
      return ee(r, f, o[f]);
    });
  }, t;
}(lr);
Vl.prototype[tr] = !0;
var BC = /* @__PURE__ */ function(e) {
  function t(n) {
    this._collection = n, this.size = n.length || n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.__iterateUncached = function(r, i) {
    if (i)
      return this.cacheResult().__iterate(r, i);
    var o = this._collection, s = nc(o), a = 0;
    if (dd(s))
      for (var u; !(u = s.next()).done && r(u.value, a++, this) !== !1; )
        ;
    return a;
  }, t.prototype.__iteratorUncached = function(r, i) {
    if (i)
      return this.cacheResult().__iterator(r, i);
    var o = this._collection, s = nc(o);
    if (!dd(s))
      return new F(Me);
    var a = 0;
    return new F(function() {
      var u = s.next();
      return u.done ? u : ee(r, a++, u.value);
    });
  }, t;
}(jt), _d;
function ql() {
  return _d || (_d = new pi([]));
}
function Wl(e) {
  var t = kl(e);
  if (t)
    return t.fromEntrySeq();
  if (typeof e == "object")
    return new Vl(e);
  throw new TypeError(
    "Expected Array or collection object of [k, v] entries, or keyed object: " + e
  );
}
function p1(e) {
  var t = kl(e);
  if (t)
    return t;
  throw new TypeError(
    "Expected Array or collection object of values: " + e
  );
}
function zC(e) {
  var t = kl(e);
  if (t)
    return FC(e) ? t.fromEntrySeq() : jC(e) ? t.toSetSeq() : t;
  if (typeof e == "object")
    return new Vl(e);
  throw new TypeError(
    "Expected Array or collection object of values, or keyed object: " + e
  );
}
function kl(e) {
  return Ul(e) ? new pi(e) : zl(e) ? new BC(e) : void 0;
}
var d1 = "@@__IMMUTABLE_MAP__@@";
function xu(e) {
  return !!(e && // @ts-expect-error: maybeMap is typed as `{}`, need to change in 6.0 to `maybeMap && typeof maybeMap === 'object' && IS_MAP_SYMBOL in maybeMap`
  e[d1]);
}
function Gl(e) {
  return xu(e) && Vt(e);
}
function rc(e) {
  return !!(e && // @ts-expect-error: maybeValue is typed as `{}`
  typeof e.equals == "function" && // @ts-expect-error: maybeValue is typed as `{}`
  typeof e.hashCode == "function");
}
function be(e, t) {
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
  return !!(rc(e) && rc(t) && e.equals(t));
}
var Qi = typeof Math.imul == "function" && Math.imul(4294967295, 2) === -2 ? Math.imul : function(t, n) {
  t |= 0, n |= 0;
  var r = t & 65535, i = n & 65535;
  return r * i + ((t >>> 16) * i + r * (n >>> 16) << 16 >>> 0) | 0;
};
function Ru(e) {
  return e >>> 1 & 1073741824 | e & 3221225471;
}
var UC = Object.prototype.valueOf;
function He(e) {
  if (e == null)
    return vd(e);
  if (typeof e.hashCode == "function")
    return Ru(e.hashCode(e));
  var t = HC(e);
  if (t == null)
    return vd(t);
  switch (typeof t) {
    case "boolean":
      return t ? 1108378657 : 1108378656;
    case "number":
      return VC(t);
    case "string":
      return t.length > KC ? qC(t) : ic(t);
    case "object":
    case "function":
      return kC(t);
    case "symbol":
      return WC(t);
    default:
      if (typeof t.toString == "function")
        return ic(t.toString());
      throw new Error("Value type " + typeof t + " cannot be hashed.");
  }
}
function vd(e) {
  return e === null ? 1108378658 : (
    /* undefined */
    1108378659
  );
}
function VC(e) {
  if (e !== e || e === 1 / 0)
    return 0;
  var t = e | 0;
  for (t !== e && (t ^= e * 4294967295); e > 4294967295; )
    e /= 4294967295, t ^= e;
  return Ru(t);
}
function qC(e) {
  var t = hf[e];
  return t === void 0 && (t = ic(e), lf === YC && (lf = 0, hf = {}), lf++, hf[e] = t), t;
}
function ic(e) {
  for (var t = 0, n = 0; n < e.length; n++)
    t = 31 * t + e.charCodeAt(n) | 0;
  return Ru(t);
}
function WC(e) {
  var t = bd[e];
  return t !== void 0 || (t = _1(), bd[e] = t), t;
}
function kC(e) {
  var t;
  if (oc && (t = sc.get(e), t !== void 0) || (t = e[br], t !== void 0) || !yd && (t = e.propertyIsEnumerable && e.propertyIsEnumerable[br], t !== void 0 || (t = GC(e), t !== void 0)))
    return t;
  if (t = _1(), oc)
    sc.set(e, t);
  else {
    if (gd !== void 0 && gd(e) === !1)
      throw new Error("Non-extensible objects are not allowed as keys.");
    if (yd)
      Object.defineProperty(e, br, {
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
      }, e.propertyIsEnumerable[br] = t;
    else if (e.nodeType !== void 0)
      e[br] = t;
    else
      throw new Error("Unable to set a non-enumerable property on object.");
  }
  return t;
}
var gd = Object.isExtensible, yd = function() {
  try {
    return Object.defineProperty({}, "@", {}), !0;
  } catch {
    return !1;
  }
}();
function GC(e) {
  if (e && e.nodeType > 0)
    switch (e.nodeType) {
      case 1:
        return e.uniqueID;
      case 9:
        return e.documentElement && e.documentElement.uniqueID;
    }
}
function HC(e) {
  return e.valueOf !== UC && typeof e.valueOf == "function" ? e.valueOf(e) : e;
}
function _1() {
  var e = ++cf;
  return cf & 1073741824 && (cf = 0), e;
}
var oc = typeof WeakMap == "function", sc;
oc && (sc = /* @__PURE__ */ new WeakMap());
var bd = /* @__PURE__ */ Object.create(null), cf = 0, br = "__immutablehash__";
typeof Symbol == "function" && (br = Symbol(br));
var KC = 16, YC = 255, lf = 0, hf = {}, Tu = /* @__PURE__ */ function(e) {
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
    var r = this, i = Hl(this, !0);
    return this._useKeys || (i.valueSeq = function() {
      return r._iter.toSeq().reverse();
    }), i;
  }, t.prototype.map = function(r, i) {
    var o = this, s = m1(this, r, i);
    return this._useKeys || (s.valueSeq = function() {
      return o._iter.toSeq().map(r, i);
    }), s;
  }, t.prototype.__iterate = function(r, i) {
    var o = this;
    return this._iter.__iterate(function(s, a) {
      return r(s, a, o);
    }, i);
  }, t.prototype.__iterator = function(r, i) {
    return this._iter.__iterator(r, i);
  }, t;
}(lr);
Tu.prototype[tr] = !0;
var v1 = /* @__PURE__ */ function(e) {
  function t(n) {
    this._iter = n, this.size = n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.includes = function(r) {
    return this._iter.includes(r);
  }, t.prototype.__iterate = function(r, i) {
    var o = this, s = 0;
    return i && hi(this), this._iter.__iterate(
      function(a) {
        return r(a, i ? o.size - ++s : s++, o);
      },
      i
    );
  }, t.prototype.__iterator = function(r, i) {
    var o = this, s = this._iter.__iterator(gt, i), a = 0;
    return i && hi(this), new F(function() {
      var u = s.next();
      return u.done ? u : ee(
        r,
        i ? o.size - ++a : a++,
        u.value,
        u
      );
    });
  }, t;
}(jt), g1 = /* @__PURE__ */ function(e) {
  function t(n) {
    this._iter = n, this.size = n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.has = function(r) {
    return this._iter.includes(r);
  }, t.prototype.__iterate = function(r, i) {
    var o = this;
    return this._iter.__iterate(function(s) {
      return r(s, s, o);
    }, i);
  }, t.prototype.__iterator = function(r, i) {
    var o = this._iter.__iterator(gt, i);
    return new F(function() {
      var s = o.next();
      return s.done ? s : ee(r, s.value, s.value, s);
    });
  }, t;
}(Ui), y1 = /* @__PURE__ */ function(e) {
  function t(n) {
    this._iter = n, this.size = n.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.entrySeq = function() {
    return this._iter.toSeq();
  }, t.prototype.__iterate = function(r, i) {
    var o = this;
    return this._iter.__iterate(function(s) {
      if (s) {
        wd(s);
        var a = et(s);
        return r(
          a ? s.get(1) : s[1],
          a ? s.get(0) : s[0],
          o
        );
      }
    }, i);
  }, t.prototype.__iterator = function(r, i) {
    var o = this._iter.__iterator(gt, i);
    return new F(function() {
      for (; ; ) {
        var s = o.next();
        if (s.done)
          return s;
        var a = s.value;
        if (a) {
          wd(a);
          var u = et(a);
          return ee(
            r,
            u ? a.get(0) : a[0],
            u ? a.get(1) : a[1],
            s
          );
        }
      }
    });
  }, t;
}(lr);
v1.prototype.cacheResult = Tu.prototype.cacheResult = g1.prototype.cacheResult = y1.prototype.cacheResult = Xl;
function b1(e) {
  var t = yn(e);
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
  }, t.cacheResult = Xl, t.__iterateUncached = function(n, r) {
    var i = this;
    return e.__iterate(function(o, s) {
      return n(s, o, i) !== !1;
    }, r);
  }, t.__iteratorUncached = function(n, r) {
    if (n === yt) {
      var i = e.__iterator(n, r);
      return new F(function() {
        var o = i.next();
        if (!o.done) {
          var s = o.value[0];
          o.value[0] = o.value[1], o.value[1] = s;
        }
        return o;
      });
    }
    return e.__iterator(
      n === gt ? Bi : gt,
      r
    );
  }, t;
}
function m1(e, t, n) {
  var r = yn(e);
  return r.size = e.size, r.has = function(i) {
    return e.has(i);
  }, r.get = function(i, o) {
    var s = e.get(i, L);
    return s === L ? o : t.call(n, s, i, e);
  }, r.__iterateUncached = function(i, o) {
    var s = this;
    return e.__iterate(
      function(a, u, f) {
        return i(t.call(n, a, u, f), u, s) !== !1;
      },
      o
    );
  }, r.__iteratorUncached = function(i, o) {
    var s = e.__iterator(yt, o);
    return new F(function() {
      var a = s.next();
      if (a.done)
        return a;
      var u = a.value, f = u[0];
      return ee(
        i,
        f,
        t.call(n, u[1], f, e),
        a
      );
    });
  }, r;
}
function Hl(e, t) {
  var n = this, r = yn(e);
  return r._iter = e, r.size = e.size, r.reverse = function() {
    return e;
  }, e.flip && (r.flip = function() {
    var i = b1(e);
    return i.reverse = function() {
      return e.flip();
    }, i;
  }), r.get = function(i, o) {
    return e.get(t ? i : -1 - i, o);
  }, r.has = function(i) {
    return e.has(t ? i : -1 - i);
  }, r.includes = function(i) {
    return e.includes(i);
  }, r.cacheResult = Xl, r.__iterate = function(i, o) {
    var s = this, a = 0;
    return o && hi(e), e.__iterate(
      function(u, f) {
        return i(u, t ? f : o ? s.size - ++a : a++, s);
      },
      !o
    );
  }, r.__iterator = function(i, o) {
    var s = 0;
    o && hi(e);
    var a = e.__iterator(yt, !o);
    return new F(function() {
      var u = a.next();
      if (u.done)
        return u;
      var f = u.value;
      return ee(
        i,
        t ? f[0] : o ? n.size - ++s : s++,
        f[1],
        u
      );
    });
  }, r;
}
function w1(e, t, n, r) {
  var i = yn(e);
  return r && (i.has = function(o) {
    var s = e.get(o, L);
    return s !== L && !!t.call(n, s, o, e);
  }, i.get = function(o, s) {
    var a = e.get(o, L);
    return a !== L && t.call(n, a, o, e) ? a : s;
  }), i.__iterateUncached = function(o, s) {
    var a = this, u = 0;
    return e.__iterate(function(f, c, l) {
      if (t.call(n, f, c, l))
        return u++, o(f, r ? c : u - 1, a);
    }, s), u;
  }, i.__iteratorUncached = function(o, s) {
    var a = e.__iterator(yt, s), u = 0;
    return new F(function() {
      for (; ; ) {
        var f = a.next();
        if (f.done)
          return f;
        var c = f.value, l = c[0], h = c[1];
        if (t.call(n, h, l, e))
          return ee(o, r ? l : u++, h, f);
      }
    });
  }, i;
}
function XC(e, t, n) {
  var r = zr().asMutable();
  return e.__iterate(function(i, o) {
    r.update(t.call(n, i, o, e), 0, function(s) {
      return s + 1;
    });
  }), r.asImmutable();
}
function JC(e, t, n) {
  var r = X(e), i = (Vt(e) ? an() : zr()).asMutable();
  e.__iterate(function(s, a) {
    i.update(
      t.call(n, s, a, e),
      function(u) {
        return u = u || [], u.push(r ? [a, s] : s), u;
      }
    );
  });
  var o = Yl(e);
  return i.map(function(s) {
    return H(e, o(s));
  }).asImmutable();
}
function ZC(e, t, n) {
  var r = X(e), i = [[], []];
  e.__iterate(function(s, a) {
    i[t.call(n, s, a, e) ? 1 : 0].push(
      r ? [a, s] : s
    );
  });
  var o = Yl(e);
  return i.map(function(s) {
    return H(e, o(s));
  });
}
function Kl(e, t, n, r) {
  var i = e.size;
  if (ls(t, n, i))
    return e;
  if (typeof i > "u" && (t < 0 || n < 0))
    return Kl(e.toSeq().cacheResult(), t, n, r);
  var o = Fi(t, i), s = hs(n, i), a = s - o, u;
  a === a && (u = a < 0 ? 0 : a);
  var f = yn(e);
  return f.size = u === 0 ? u : e.size && u || void 0, !r && Ou(e) && u >= 0 && (f.get = function(c, l) {
    return c = er(this, c), c >= 0 && c < u ? e.get(c + o, l) : l;
  }), f.__iterateUncached = function(c, l) {
    var h = this;
    if (u === 0)
      return 0;
    if (l)
      return this.cacheResult().__iterate(c, l);
    var d = 0, _ = !0, v = 0;
    return e.__iterate(function(g, y) {
      if (!(_ && (_ = d++ < o)))
        return v++, c(g, r ? y : v - 1, h) !== !1 && v !== u;
    }), v;
  }, f.__iteratorUncached = function(c, l) {
    if (u !== 0 && l)
      return this.cacheResult().__iterator(c, l);
    if (u === 0)
      return new F(Me);
    var h = e.__iterator(c, l), d = 0, _ = 0;
    return new F(function() {
      for (; d++ < o; )
        h.next();
      if (++_ > u)
        return Me();
      var v = h.next();
      return r || c === gt || v.done ? v : c === Bi ? ee(c, _ - 1, void 0, v) : ee(c, _ - 1, v.value[1], v);
    });
  }, f;
}
function QC(e, t, n) {
  var r = yn(e);
  return r.__iterateUncached = function(i, o) {
    var s = this;
    if (o)
      return this.cacheResult().__iterate(i, o);
    var a = 0;
    return e.__iterate(
      function(u, f, c) {
        return t.call(n, u, f, c) && ++a && i(u, f, s);
      }
    ), a;
  }, r.__iteratorUncached = function(i, o) {
    var s = this;
    if (o)
      return this.cacheResult().__iterator(i, o);
    var a = e.__iterator(yt, o), u = !0;
    return new F(function() {
      if (!u)
        return Me();
      var f = a.next();
      if (f.done)
        return f;
      var c = f.value, l = c[0], h = c[1];
      return t.call(n, h, l, s) ? i === yt ? f : ee(i, l, h, f) : (u = !1, Me());
    });
  }, r;
}
function A1(e, t, n, r) {
  var i = yn(e);
  return i.__iterateUncached = function(o, s) {
    var a = this;
    if (s)
      return this.cacheResult().__iterate(o, s);
    var u = !0, f = 0;
    return e.__iterate(function(c, l, h) {
      if (!(u && (u = t.call(n, c, l, h))))
        return f++, o(c, r ? l : f - 1, a);
    }), f;
  }, i.__iteratorUncached = function(o, s) {
    var a = this;
    if (s)
      return this.cacheResult().__iterator(o, s);
    var u = e.__iterator(yt, s), f = !0, c = 0;
    return new F(function() {
      var l, h, d;
      do {
        if (l = u.next(), l.done)
          return r || o === gt ? l : o === Bi ? ee(o, c++, void 0, l) : ee(o, c++, l.value[1], l);
        var _ = l.value;
        h = _[0], d = _[1], f && (f = t.call(n, d, h, a));
      } while (f);
      return o === yt ? l : ee(o, h, d, l);
    });
  }, i;
}
var e3 = /* @__PURE__ */ function(e) {
  function t(n) {
    this._wrappedIterables = n.flatMap(function(r) {
      return r._wrappedIterables ? r._wrappedIterables : [r];
    }), this.size = this._wrappedIterables.reduce(function(r, i) {
      if (r !== void 0) {
        var o = i.size;
        if (o !== void 0)
          return r + o;
      }
    }, 0), this[ga] = this._wrappedIterables[0][ga], this[ya] = this._wrappedIterables[0][ya], this[tr] = this._wrappedIterables[0][tr];
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.__iterateUncached = function(r, i) {
    if (this._wrappedIterables.length !== 0) {
      if (i)
        return this.cacheResult().__iterate(r, i);
      for (var o = 0, s = X(this), a = s ? yt : gt, u = this._wrappedIterables[o].__iterator(
        a,
        i
      ), f = !0, c = 0; f; ) {
        for (var l = u.next(); l.done; ) {
          if (o++, o === this._wrappedIterables.length)
            return c;
          u = this._wrappedIterables[o].__iterator(
            a,
            i
          ), l = u.next();
        }
        var h = s ? r(l.value[1], l.value[0], this) : r(l.value, c, this);
        f = h !== !1, c++;
      }
      return c;
    }
  }, t.prototype.__iteratorUncached = function(r, i) {
    var o = this;
    if (this._wrappedIterables.length === 0)
      return new F(Me);
    if (i)
      return this.cacheResult().__iterator(r, i);
    var s = 0, a = this._wrappedIterables[s].__iterator(
      r,
      i
    );
    return new F(function() {
      for (var u = a.next(); u.done; ) {
        if (s++, s === o._wrappedIterables.length)
          return u;
        a = o._wrappedIterables[s].__iterator(
          r,
          i
        ), u = a.next();
      }
      return u;
    });
  }, t;
}(Pe);
function t3(e, t) {
  var n = X(e), r = [e].concat(t).map(function(o) {
    return et(o) ? n && (o = Lt(o)) : o = n ? Wl(o) : p1(Array.isArray(o) ? o : [o]), o;
  }).filter(function(o) {
    return o.size !== 0;
  });
  if (r.length === 0)
    return e;
  if (r.length === 1) {
    var i = r[0];
    if (i === e || n && X(i) || tt(e) && tt(i))
      return i;
  }
  return new e3(r);
}
function O1(e, t, n) {
  var r = yn(e);
  return r.__iterateUncached = function(i, o) {
    if (o)
      return this.cacheResult().__iterate(i, o);
    var s = 0, a = !1;
    function u(f, c) {
      f.__iterate(function(l, h) {
        return (!t || c < t) && et(l) ? u(l, c + 1) : (s++, i(l, n ? h : s - 1, r) === !1 && (a = !0)), !a;
      }, o);
    }
    return u(e, 0), s;
  }, r.__iteratorUncached = function(i, o) {
    if (o)
      return this.cacheResult().__iterator(i, o);
    var s = e.__iterator(i, o), a = [], u = 0;
    return new F(function() {
      for (; s; ) {
        var f = s.next();
        if (f.done !== !1) {
          s = a.pop();
          continue;
        }
        var c = f.value;
        if (i === yt && (c = c[1]), (!t || a.length < t) && et(c))
          a.push(s), s = c.__iterator(i, o);
        else
          return n ? f : ee(i, u++, c, f);
      }
      return Me();
    });
  }, r;
}
function n3(e, t, n) {
  var r = Yl(e);
  return e.toSeq().map(function(i, o) {
    return r(t.call(n, i, o, e));
  }).flatten(!0);
}
function r3(e, t) {
  var n = yn(e);
  return n.size = e.size && e.size * 2 - 1, n.__iterateUncached = function(r, i) {
    var o = this, s = 0;
    return e.__iterate(
      function(a) {
        return (!s || r(t, s++, o) !== !1) && r(a, s++, o) !== !1;
      },
      i
    ), s;
  }, n.__iteratorUncached = function(r, i) {
    var o = e.__iterator(gt, i), s = 0, a;
    return new F(function() {
      return (!a || s % 2) && (a = o.next(), a.done) ? a : s % 2 ? ee(r, s++, t) : ee(r, s++, a.value, a);
    });
  }, n;
}
function di(e, t, n) {
  t || (t = E1);
  var r = X(e), i = 0, o = e.toSeq().map(function(s, a) {
    return [a, s, i++, n ? n(s, a, e) : s];
  }).valueSeq().toArray();
  return o.sort(function(s, a) {
    return t(s[3], a[3]) || s[2] - a[2];
  }).forEach(
    r ? function(s, a) {
      o[a].length = 2;
    } : function(s, a) {
      o[a] = s[1];
    }
  ), r ? lr(o) : tt(e) ? jt(o) : Ui(o);
}
function Bs(e, t, n) {
  if (t || (t = E1), n) {
    var r = e.toSeq().map(function(i, o) {
      return [i, n(i, o, e)];
    }).reduce(function(i, o) {
      return md(t, i[1], o[1]) ? o : i;
    });
    return r && r[0];
  }
  return e.reduce(function(i, o) {
    return md(t, i, o) ? o : i;
  });
}
function md(e, t, n) {
  var r = e(n, t);
  return r === 0 && n !== t && (n == null || n !== n) || r > 0;
}
function zs(e, t, n, r) {
  var i = yn(e), o = new pi(n).map(function(s) {
    return s.size;
  });
  return i.size = r ? o.max() : o.min(), i.__iterate = function(s, a) {
    for (var u = this.__iterator(gt, a), f, c = 0; !(f = u.next()).done && s(f.value, c++, this) !== !1; )
      ;
    return c;
  }, i.__iteratorUncached = function(s, a) {
    var u = n.map(
      function(l) {
        return l = we(l), nc(a ? l.reverse() : l);
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
      })), c ? Me() : ee(
        s,
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
function H(e, t) {
  return e === t ? e : Ou(e) ? t : e.constructor(t);
}
function wd(e) {
  if (e !== Object(e))
    throw new TypeError("Expected [K, V] tuple: " + e);
}
function Yl(e) {
  return X(e) ? Lt : tt(e) ? jr : ji;
}
function yn(e) {
  return Object.create(
    (X(e) ? lr : tt(e) ? jt : Ui).prototype
  );
}
function Xl() {
  return this._iter.cacheResult ? (this._iter.cacheResult(), this.size = this._iter.size, this) : Pe.prototype.cacheResult.call(this);
}
function E1(e, t) {
  return e === void 0 && t === void 0 ? 0 : e === void 0 ? 1 : t === void 0 ? -1 : e > t ? 1 : e < t ? -1 : 0;
}
function Zt(e, t) {
  t = t || 0;
  for (var n = Math.max(0, e.length - t), r = new Array(n), i = 0; i < n; i++)
    r[i] = e[i + t];
  return r;
}
function co(e, t) {
  if (!e)
    throw new Error(t);
}
function rt(e) {
  co(e !== 1 / 0, "Cannot perform this action with an infinite size.");
}
function S1(e) {
  if (Ul(e) && typeof e != "string")
    return e;
  if (Vt(e))
    return e.toArray();
  throw new TypeError("Invalid keyPath: expected Ordered Collection or Array: " + e);
}
var i3 = Object.prototype.toString;
function Jl(e) {
  if (!e || typeof e != "object" || i3.call(e) !== "[object Object]")
    return !1;
  var t = Object.getPrototypeOf(e);
  if (t === null)
    return !0;
  for (var n = t, r = Object.getPrototypeOf(t); r !== null; )
    n = r, r = Object.getPrototypeOf(n);
  return n === t;
}
function nr(e) {
  return typeof e == "object" && (Ft(e) || Array.isArray(e) || Jl(e));
}
function Po(e) {
  try {
    return typeof e == "string" ? JSON.stringify(e) : String(e);
  } catch {
    return JSON.stringify(e);
  }
}
function x1(e, t) {
  return Ft(e) ? (
    // @ts-expect-error key might be a number or symbol, which is not handled be Record key type
    e.has(t)
  ) : (
    // @ts-expect-error key might be anything else than PropertyKey, and will return false in that case but runtime is OK
    nr(e) && zi.call(e, t)
  );
}
function Zl(e, t, n) {
  return Ft(e) ? e.get(t, n) : x1(e, t) ? (
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
function ba(e) {
  if (Array.isArray(e))
    return Zt(e);
  var t = {};
  for (var n in e)
    zi.call(e, n) && (t[n] = e[n]);
  return t;
}
function R1(e, t) {
  if (!nr(e))
    throw new TypeError("Cannot update non-data-structure value: " + e);
  if (Ft(e)) {
    if (!e.remove)
      throw new TypeError("Cannot update immutable value without .remove() method: " + e);
    return e.remove(t);
  }
  if (!zi.call(e, t))
    return e;
  var n = ba(e);
  return Array.isArray(n) ? n.splice(t, 1) : delete n[t], n;
}
function T1(e, t, n) {
  if (!nr(e))
    throw new TypeError("Cannot update non-data-structure value: " + e);
  if (Ft(e)) {
    if (!e.set)
      throw new TypeError("Cannot update immutable value without .set() method: " + e);
    return e.set(t, n);
  }
  if (zi.call(e, t) && n === e[t])
    return e;
  var r = ba(e);
  return r[t] = n, r;
}
function Br(e, t, n, r) {
  r || (r = n, n = void 0);
  var i = $1(
    Ft(e),
    // @ts-expect-error type issues with Record and mixed types
    e,
    S1(t),
    0,
    n,
    r
  );
  return i === L ? n : i;
}
function $1(e, t, n, r, i, o) {
  var s = t === L;
  if (r === n.length) {
    var a = s ? i : t, u = o(a);
    return u === a ? t : u;
  }
  if (!s && !nr(t))
    throw new TypeError("Cannot update within non-data-structure value in path [" + Array.from(n).slice(0, r).map(Po) + "]: " + t);
  var f = n[r], c = s ? L : Zl(t, f, L), l = $1(
    c === L ? e : Ft(c),
    // @ts-expect-error mixed type
    c,
    n,
    r + 1,
    i,
    o
  );
  return l === c ? t : l === L ? R1(t, f) : T1(s ? e ? en() : {} : t, f, l);
}
function N1(e, t, n) {
  return Br(e, t, L, function() {
    return n;
  });
}
function Ql(e, t) {
  return N1(this, e, t);
}
function M1(e, t) {
  return Br(e, t, function() {
    return L;
  });
}
function eh(e) {
  return M1(this, e);
}
function th(e, t, n, r) {
  return Br(
    // @ts-expect-error Index signature for type string is missing in type V[]
    e,
    [t],
    n,
    r
  );
}
function nh(e, t, n) {
  return arguments.length === 1 ? e(this) : th(this, e, t, n);
}
function rh(e, t, n) {
  return Br(this, e, t, n);
}
function P1() {
  for (var e = [], t = arguments.length; t--; ) e[t] = arguments[t];
  return C1(this, e);
}
function I1(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  if (typeof e != "function")
    throw new TypeError("Invalid merger function: " + e);
  return C1(this, t, e);
}
function C1(e, t, n) {
  for (var r = [], i = 0; i < t.length; i++) {
    var o = Lt(t[i]);
    o.size !== 0 && r.push(o);
  }
  return r.length === 0 ? e : e.toSeq().size === 0 && !e.__ownerID && r.length === 1 ? cr(e) ? e : e.constructor(r[0]) : e.withMutations(function(s) {
    for (var a = n ? function(f, c) {
      th(
        s,
        c,
        L,
        function(l) {
          return l === L ? f : n(l, f, c);
        }
      );
    } : function(f, c) {
      s.set(c, f);
    }, u = 0; u < r.length; u++)
      r[u].forEach(a);
  });
}
function o3(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return ds(e, t);
}
function s3(e, t) {
  for (var n = [], r = arguments.length - 2; r-- > 0; ) n[r] = arguments[r + 2];
  return ds(t, n, e);
}
function a3(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return ps(e, t);
}
function u3(e, t) {
  for (var n = [], r = arguments.length - 2; r-- > 0; ) n[r] = arguments[r + 2];
  return ps(t, n, e);
}
function ps(e, t, n) {
  return ds(e, t, f3(n));
}
function ds(e, t, n) {
  if (!nr(e))
    throw new TypeError(
      "Cannot merge into non-data-structure value: " + e
    );
  if (Ft(e))
    return typeof n == "function" && e.mergeWith ? e.mergeWith.apply(e, [n].concat(t)) : e.merge ? e.merge.apply(e, t) : e.concat.apply(e, t);
  for (var r = Array.isArray(e), i = e, o = r ? jr : Lt, s = r ? function(u) {
    i === e && (i = ba(i)), i.push(u);
  } : function(u, f) {
    var c = zi.call(i, f), l = c && n ? n(i[f], u, f) : u;
    (!c || l !== i[f]) && (i === e && (i = ba(i)), i[f] = l);
  }, a = 0; a < t.length; a++)
    o(t[a]).forEach(s);
  return i;
}
function f3(e) {
  function t(n, r, i) {
    return nr(n) && nr(r) && c3(n, r) ? ds(n, [r], t) : e ? e(n, r, i) : r;
  }
  return t;
}
function c3(e, t) {
  var n = Pe(e), r = Pe(t);
  return tt(n) === tt(r) && X(n) === X(r);
}
function D1() {
  for (var e = [], t = arguments.length; t--; ) e[t] = arguments[t];
  return ps(this, e);
}
function L1(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return ps(this, t, e);
}
function ih(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return Br(this, e, en(), function(r) {
    return ds(r, t);
  });
}
function oh(e) {
  for (var t = [], n = arguments.length - 1; n-- > 0; ) t[n] = arguments[n + 1];
  return Br(
    this,
    e,
    en(),
    function(r) {
      return ps(r, t);
    }
  );
}
function _s(e) {
  var t = this.asMutable();
  return e(t), t.wasAltered() ? t.__ensureOwner(this.__ownerID) : this;
}
function vs() {
  return this.__ownerID ? this : this.__ensureOwner(new Bl());
}
function gs() {
  return this.__ensureOwner();
}
function sh() {
  return this.__altered;
}
var zr = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? en() : xu(n) && !Vt(n) ? n : en().withMutations(function(r) {
      var i = e(n);
      rt(i.size), i.forEach(function(o, s) {
        return r.set(s, o);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.__toString("Map {", "}");
  }, t.prototype.get = function(r, i) {
    return this._root ? this._root.get(0, void 0, r, i) : i;
  }, t.prototype.set = function(r, i) {
    return Ed(this, r, i);
  }, t.prototype.remove = function(r) {
    return Ed(this, r, L);
  }, t.prototype.deleteAll = function(r) {
    var i = we(r);
    return i.size === 0 ? this : this.withMutations(function(o) {
      i.forEach(function(s) {
        return o.remove(s);
      });
    });
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._root = null, this.__hash = void 0, this.__altered = !0, this) : en();
  }, t.prototype.sort = function(r) {
    return an(di(this, r));
  }, t.prototype.sortBy = function(r, i) {
    return an(di(this, i, r));
  }, t.prototype.map = function(r, i) {
    var o = this;
    return this.withMutations(function(s) {
      s.forEach(function(a, u) {
        s.set(u, r.call(i, a, u, o));
      });
    });
  }, t.prototype.__iterator = function(r, i) {
    return new l3(this, r, i);
  }, t.prototype.__iterate = function(r, i) {
    var o = this, s = 0;
    return this._root && this._root.iterate(function(a) {
      return s++, r(a[1], a[0], o);
    }, i), s;
  }, t.prototype.__ensureOwner = function(r) {
    return r === this.__ownerID ? this : r ? ah(this.size, this._root, r, this.__hash) : this.size === 0 ? en() : (this.__ownerID = r, this.__altered = !1, this);
  }, t;
}(Lt);
zr.isMap = xu;
var te = zr.prototype;
te[d1] = !0;
te[cs] = te.remove;
te.removeAll = te.deleteAll;
te.setIn = Ql;
te.removeIn = te.deleteIn = eh;
te.update = nh;
te.updateIn = rh;
te.merge = te.concat = P1;
te.mergeWith = I1;
te.mergeDeep = D1;
te.mergeDeepWith = L1;
te.mergeIn = ih;
te.mergeDeepIn = oh;
te.withMutations = _s;
te.wasAltered = sh;
te.asImmutable = gs;
te["@@transducer/init"] = te.asMutable = vs;
te["@@transducer/step"] = function(e, t) {
  return e.set(t[0], t[1]);
};
te["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
var Io = function(t, n) {
  this.ownerID = t, this.entries = n;
};
Io.prototype.get = function(t, n, r, i) {
  for (var o = this.entries, s = 0, a = o.length; s < a; s++)
    if (be(r, o[s][0]))
      return o[s][1];
  return i;
};
Io.prototype.update = function(t, n, r, i, o, s, a) {
  for (var u = o === L, f = this.entries, c = 0, l = f.length; c < l && !be(i, f[c][0]); c++)
    ;
  var h = c < l;
  if (h ? f[c][1] === o : u)
    return this;
  if (St(a), (u || !h) && St(s), !(u && f.length === 1)) {
    if (!h && !u && f.length >= g3)
      return h3(t, f, i, o);
    var d = t && t === this.ownerID, _ = d ? f : Zt(f);
    return h ? u ? c === l - 1 ? _.pop() : _[c] = _.pop() : _[c] = [i, o] : _.push([i, o]), d ? (this.entries = _, this) : new Io(t, _);
  }
};
var _i = function(t, n, r) {
  this.ownerID = t, this.bitmap = n, this.nodes = r;
};
_i.prototype.get = function(t, n, r, i) {
  n === void 0 && (n = He(r));
  var o = 1 << ((t === 0 ? n : n >>> t) & Le), s = this.bitmap;
  return (s & o) === 0 ? i : this.nodes[F1(s & o - 1)].get(
    t + K,
    n,
    r,
    i
  );
};
_i.prototype.update = function(t, n, r, i, o, s, a) {
  r === void 0 && (r = He(i));
  var u = (n === 0 ? r : r >>> n) & Le, f = 1 << u, c = this.bitmap, l = (c & f) !== 0;
  if (!l && o === L)
    return this;
  var h = F1(c & f - 1), d = this.nodes, _ = l ? d[h] : void 0, v = uh(
    _,
    t,
    n + K,
    r,
    i,
    o,
    s,
    a
  );
  if (v === _)
    return this;
  if (!l && v && d.length >= y3)
    return d3(t, d, c, u, v);
  if (l && !v && d.length === 2 && Sd(d[h ^ 1]))
    return d[h ^ 1];
  if (l && v && d.length === 1 && Sd(v))
    return v;
  var g = t && t === this.ownerID, y = l ? v ? c : c ^ f : c | f, b = l ? v ? j1(d, h, v, g) : v3(d, h, g) : _3(d, h, v, g);
  return g ? (this.bitmap = y, this.nodes = b, this) : new _i(t, y, b);
};
var Co = function(t, n, r) {
  this.ownerID = t, this.count = n, this.nodes = r;
};
Co.prototype.get = function(t, n, r, i) {
  n === void 0 && (n = He(r));
  var o = (t === 0 ? n : n >>> t) & Le, s = this.nodes[o];
  return s ? s.get(t + K, n, r, i) : i;
};
Co.prototype.update = function(t, n, r, i, o, s, a) {
  r === void 0 && (r = He(i));
  var u = (n === 0 ? r : r >>> n) & Le, f = o === L, c = this.nodes, l = c[u];
  if (f && !l)
    return this;
  var h = uh(
    l,
    t,
    n + K,
    r,
    i,
    o,
    s,
    a
  );
  if (h === l)
    return this;
  var d = this.count;
  if (!l)
    d++;
  else if (!h && (d--, d < b3))
    return p3(t, c, d, u);
  var _ = t && t === this.ownerID, v = j1(c, u, h, _);
  return _ ? (this.count = d, this.nodes = v, this) : new Co(t, d, v);
};
var vi = function(t, n, r) {
  this.ownerID = t, this.keyHash = n, this.entries = r;
};
vi.prototype.get = function(t, n, r, i) {
  for (var o = this.entries, s = 0, a = o.length; s < a; s++)
    if (be(r, o[s][0]))
      return o[s][1];
  return i;
};
vi.prototype.update = function(t, n, r, i, o, s, a) {
  r === void 0 && (r = He(i));
  var u = o === L;
  if (r !== this.keyHash)
    return u ? this : (St(a), St(s), fh(this, t, n, r, [i, o]));
  for (var f = this.entries, c = 0, l = f.length; c < l && !be(i, f[c][0]); c++)
    ;
  var h = c < l;
  if (h ? f[c][1] === o : u)
    return this;
  if (St(a), (u || !h) && St(s), u && l === 2)
    return new Dn(t, this.keyHash, f[c ^ 1]);
  var d = t && t === this.ownerID, _ = d ? f : Zt(f);
  return h ? u ? c === l - 1 ? _.pop() : _[c] = _.pop() : _[c] = [i, o] : _.push([i, o]), d ? (this.entries = _, this) : new vi(t, this.keyHash, _);
};
var Dn = function(t, n, r) {
  this.ownerID = t, this.keyHash = n, this.entry = r;
};
Dn.prototype.get = function(t, n, r, i) {
  return be(r, this.entry[0]) ? this.entry[1] : i;
};
Dn.prototype.update = function(t, n, r, i, o, s, a) {
  var u = o === L, f = be(i, this.entry[0]);
  if (f ? o === this.entry[1] : u)
    return this;
  if (St(a), u) {
    St(s);
    return;
  }
  return f ? t && t === this.ownerID ? (this.entry[1] = o, this) : new Dn(t, this.keyHash, [i, o]) : (St(s), fh(this, t, n, He(i), [i, o]));
};
Io.prototype.iterate = vi.prototype.iterate = function(e, t) {
  for (var n = this.entries, r = 0, i = n.length - 1; r <= i; r++)
    if (e(n[t ? i - r : r]) === !1)
      return !1;
};
_i.prototype.iterate = Co.prototype.iterate = function(e, t) {
  for (var n = this.nodes, r = 0, i = n.length - 1; r <= i; r++) {
    var o = n[t ? i - r : r];
    if (o && o.iterate(e, t) === !1)
      return !1;
  }
};
Dn.prototype.iterate = function(e, t) {
  return e(this.entry);
};
var l3 = /* @__PURE__ */ function(e) {
  function t(n, r, i) {
    this._type = r, this._reverse = i, this._stack = n._root && Ad(n._root);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.next = function() {
    for (var r = this._type, i = this._stack; i; ) {
      var o = i.node, s = i.index++, a = void 0;
      if (o.entry) {
        if (s === 0)
          return pf(r, o.entry);
      } else if (o.entries) {
        if (a = o.entries.length - 1, s <= a)
          return pf(
            r,
            o.entries[this._reverse ? a - s : s]
          );
      } else if (a = o.nodes.length - 1, s <= a) {
        var u = o.nodes[this._reverse ? a - s : s];
        if (u) {
          if (u.entry)
            return pf(r, u.entry);
          i = this._stack = Ad(u, i);
        }
        continue;
      }
      i = this._stack = this._stack.__prev;
    }
    return Me();
  }, t;
}(F);
function pf(e, t) {
  return ee(e, t[0], t[1]);
}
function Ad(e, t) {
  return {
    node: e,
    index: 0,
    __prev: t
  };
}
function ah(e, t, n, r) {
  var i = Object.create(te);
  return i.size = e, i._root = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
var Od;
function en() {
  return Od || (Od = ah(0));
}
function Ed(e, t, n) {
  var r, i;
  if (e._root) {
    var o = ec(), s = ec();
    if (r = uh(
      e._root,
      e.__ownerID,
      0,
      void 0,
      t,
      n,
      o,
      s
    ), !s.value)
      return e;
    i = e.size + (o.value ? n === L ? -1 : 1 : 0);
  } else {
    if (n === L)
      return e;
    i = 1, r = new Io(e.__ownerID, [[t, n]]);
  }
  return e.__ownerID ? (e.size = i, e._root = r, e.__hash = void 0, e.__altered = !0, e) : r ? ah(i, r) : en();
}
function uh(e, t, n, r, i, o, s, a) {
  return e ? e.update(
    t,
    n,
    r,
    i,
    o,
    s,
    a
  ) : o === L ? e : (St(a), St(s), new Dn(t, r, [i, o]));
}
function Sd(e) {
  return e.constructor === Dn || e.constructor === vi;
}
function fh(e, t, n, r, i) {
  if (e.keyHash === r)
    return new vi(t, r, [e.entry, i]);
  var o = (n === 0 ? e.keyHash : e.keyHash >>> n) & Le, s = (n === 0 ? r : r >>> n) & Le, a, u = o === s ? [fh(e, t, n + K, r, i)] : (a = new Dn(t, r, i), o < s ? [e, a] : [a, e]);
  return new _i(t, 1 << o | 1 << s, u);
}
function h3(e, t, n, r) {
  e || (e = new Bl());
  for (var i = new Dn(e, He(n), [n, r]), o = 0; o < t.length; o++) {
    var s = t[o];
    i = i.update(e, 0, void 0, s[0], s[1]);
  }
  return i;
}
function p3(e, t, n, r) {
  for (var i = 0, o = 0, s = new Array(n), a = 0, u = 1, f = t.length; a < f; a++, u <<= 1) {
    var c = t[a];
    c !== void 0 && a !== r && (i |= u, s[o++] = c);
  }
  return new _i(e, i, s);
}
function d3(e, t, n, r, i) {
  for (var o = 0, s = new Array(st), a = 0; n !== 0; a++, n >>>= 1)
    s[a] = n & 1 ? t[o++] : void 0;
  return s[r] = i, new Co(e, o + 1, s);
}
function F1(e) {
  return e -= e >> 1 & 1431655765, e = (e & 858993459) + (e >> 2 & 858993459), e = e + (e >> 4) & 252645135, e += e >> 8, e += e >> 16, e & 127;
}
function j1(e, t, n, r) {
  var i = r ? e : Zt(e);
  return i[t] = n, i;
}
function _3(e, t, n, r) {
  var i = e.length + 1;
  if (r && t + 1 === i)
    return e[t] = n, e;
  for (var o = new Array(i), s = 0, a = 0; a < i; a++)
    a === t ? (o[a] = n, s = -1) : o[a] = e[a + s];
  return o;
}
function v3(e, t, n) {
  var r = e.length - 1;
  if (n && t === r)
    return e.pop(), e;
  for (var i = new Array(r), o = 0, s = 0; s < r; s++)
    s === t && (o = 1), i[s] = e[s + o];
  return i;
}
var g3 = st / 4, y3 = st / 2, b3 = st / 4, B1 = "@@__IMMUTABLE_LIST__@@";
function ch(e) {
  return !!(e && // @ts-expect-error: maybeList is typed as `{}`, need to change in 6.0 to `maybeList && typeof maybeList === 'object' && IS_LIST_SYMBOL in maybeList`
  e[B1]);
}
var ys = /* @__PURE__ */ function(e) {
  function t(n) {
    var r = ra();
    if (n == null)
      return r;
    if (ch(n))
      return n;
    var i = e(n), o = i.size;
    return o === 0 ? r : (rt(o), o > 0 && o < st ? Do(0, o, K, null, new Gn(i.toArray())) : r.withMutations(function(s) {
      s.setSize(o), i.forEach(function(a, u) {
        return s.set(u, a);
      });
    }));
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.prototype.toString = function() {
    return this.__toString("List [", "]");
  }, t.prototype.get = function(r, i) {
    if (r = er(this, r), r >= 0 && r < this.size) {
      r += this._origin;
      var o = z1(this, r);
      return o && o.array[r & Le];
    }
    return i;
  }, t.prototype.set = function(r, i) {
    return m3(this, r, i);
  }, t.prototype.remove = function(r) {
    return this.has(r) ? r === 0 ? this.shift() : r === this.size - 1 ? this.pop() : this.splice(r, 1) : this;
  }, t.prototype.insert = function(r, i) {
    return this.splice(r, 0, i);
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = this._origin = this._capacity = 0, this._level = K, this._root = this._tail = this.__hash = void 0, this.__altered = !0, this) : ra();
  }, t.prototype.push = function() {
    var r = arguments, i = this.size;
    return this.withMutations(function(o) {
      Vn(o, 0, i + r.length);
      for (var s = 0; s < r.length; s++)
        o.set(i + s, r[s]);
    });
  }, t.prototype.pop = function() {
    return Vn(this, 0, -1);
  }, t.prototype.unshift = function() {
    var r = arguments;
    return this.withMutations(function(i) {
      Vn(i, -r.length);
      for (var o = 0; o < r.length; o++)
        i.set(o, r[o]);
    });
  }, t.prototype.shift = function() {
    return Vn(this, 1);
  }, t.prototype.shuffle = function(r) {
    return r === void 0 && (r = Math.random), this.withMutations(function(i) {
      for (var o = i.size, s, a; o; )
        s = Math.floor(r() * o--), a = i.get(s), i.set(s, i.get(o)), i.set(o, a);
    });
  }, t.prototype.concat = function() {
    for (var r = arguments, i = [], o = 0; o < arguments.length; o++) {
      var s = r[o], a = e(
        typeof s != "string" && zl(s) ? s : [s]
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
    return Vn(this, 0, r);
  }, t.prototype.map = function(r, i) {
    var o = this;
    return this.withMutations(function(s) {
      for (var a = 0; a < o.size; a++)
        s.set(a, r.call(i, s.get(a), a, o));
    });
  }, t.prototype.slice = function(r, i) {
    var o = this.size;
    return ls(r, i, o) ? this : Vn(
      this,
      Fi(r, o),
      hs(i, o)
    );
  }, t.prototype.__iterator = function(r, i) {
    var o = i ? this.size : 0, s = xd(this, i);
    return new F(function() {
      var a = s();
      return a === lo ? Me() : ee(r, i ? --o : o++, a);
    });
  }, t.prototype.__iterate = function(r, i) {
    for (var o = i ? this.size : 0, s = xd(this, i), a; (a = s()) !== lo && r(a, i ? --o : o++, this) !== !1; )
      ;
    return o;
  }, t.prototype.__ensureOwner = function(r) {
    return r === this.__ownerID ? this : r ? Do(
      this._origin,
      this._capacity,
      this._level,
      this._root,
      this._tail,
      r,
      this.__hash
    ) : this.size === 0 ? ra() : (this.__ownerID = r, this.__altered = !1, this);
  }, t;
}(jr);
ys.isList = ch;
var ce = ys.prototype;
ce[B1] = !0;
ce[cs] = ce.remove;
ce.merge = ce.concat;
ce.setIn = Ql;
ce.deleteIn = ce.removeIn = eh;
ce.update = nh;
ce.updateIn = rh;
ce.mergeIn = ih;
ce.mergeDeepIn = oh;
ce.withMutations = _s;
ce.wasAltered = sh;
ce.asImmutable = gs;
ce["@@transducer/init"] = ce.asMutable = vs;
ce["@@transducer/step"] = function(e, t) {
  return e.push(t);
};
ce["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
var Gn = function(t, n) {
  this.array = t, this.ownerID = n;
};
Gn.prototype.removeBefore = function(t, n, r) {
  if ((r & (1 << n + K) - 1) === 0 || this.array.length === 0)
    return this;
  var i = r >>> n & Le;
  if (i >= this.array.length)
    return new Gn([], t);
  var o = i === 0, s;
  if (n > 0) {
    var a = this.array[i];
    if (s = a && a.removeBefore(t, n - K, r), s === a && o)
      return this;
  }
  if (o && !s)
    return this;
  var u = gi(this, t);
  if (!o)
    for (var f = 0; f < i; f++)
      u.array[f] = void 0;
  return s && (u.array[i] = s), u;
};
Gn.prototype.removeAfter = function(t, n, r) {
  if (r === (n ? 1 << n + K : st) || this.array.length === 0)
    return this;
  var i = r - 1 >>> n & Le;
  if (i >= this.array.length)
    return this;
  var o;
  if (n > 0) {
    var s = this.array[i];
    if (o = s && s.removeAfter(t, n - K, r), o === s && i === this.array.length - 1)
      return this;
  }
  var a = gi(this, t);
  return a.array.splice(i + 1), o && (a.array[i] = o), a;
};
var lo = {};
function xd(e, t) {
  var n = e._origin, r = e._capacity, i = Lo(r), o = e._tail;
  return s(e._root, e._level, 0);
  function s(f, c, l) {
    return c === 0 ? a(f, l) : u(f, c, l);
  }
  function a(f, c) {
    var l = c === i ? o && o.array : f && f.array, h = c > n ? 0 : n - c, d = r - c;
    return d > st && (d = st), function() {
      if (h === d)
        return lo;
      var _ = t ? --d : h++;
      return l && l[_];
    };
  }
  function u(f, c, l) {
    var h, d = f && f.array, _ = l > n ? 0 : n - l >> c, v = (r - l >> c) + 1;
    return v > st && (v = st), function() {
      for (; ; ) {
        if (h) {
          var g = h();
          if (g !== lo)
            return g;
          h = null;
        }
        if (_ === v)
          return lo;
        var y = t ? --v : _++;
        h = s(
          d && d[y],
          c - K,
          l + (y << c)
        );
      }
    };
  }
}
function Do(e, t, n, r, i, o, s) {
  var a = Object.create(ce);
  return a.size = t - e, a._origin = e, a._capacity = t, a._level = n, a._root = r, a._tail = i, a.__ownerID = o, a.__hash = s, a.__altered = !1, a;
}
function ra() {
  return Do(0, 0, K);
}
function m3(e, t, n) {
  if (t = er(e, t), t !== t)
    return e;
  if (t >= e.size || t < 0)
    return e.withMutations(function(s) {
      t < 0 ? Vn(s, t).set(0, n) : Vn(s, 0, t + 1).set(t, n);
    });
  t += e._origin;
  var r = e._tail, i = e._root, o = ec();
  return t >= Lo(e._capacity) ? r = ac(r, e.__ownerID, 0, t, n, o) : i = ac(
    i,
    e.__ownerID,
    e._level,
    t,
    n,
    o
  ), o.value ? e.__ownerID ? (e._root = i, e._tail = r, e.__hash = void 0, e.__altered = !0, e) : Do(e._origin, e._capacity, e._level, i, r) : e;
}
function ac(e, t, n, r, i, o) {
  var s = r >>> n & Le, a = e && s < e.array.length;
  if (!a && i === void 0)
    return e;
  var u;
  if (n > 0) {
    var f = e && e.array[s], c = ac(
      f,
      t,
      n - K,
      r,
      i,
      o
    );
    return c === f ? e : (u = gi(e, t), u.array[s] = c, u);
  }
  return a && e.array[s] === i ? e : (o && St(o), u = gi(e, t), i === void 0 && s === u.array.length - 1 ? u.array.pop() : u.array[s] = i, u);
}
function gi(e, t) {
  return t && e && t === e.ownerID ? e : new Gn(e ? e.array.slice() : [], t);
}
function z1(e, t) {
  if (t >= Lo(e._capacity))
    return e._tail;
  if (t < 1 << e._level + K) {
    for (var n = e._root, r = e._level; n && r > 0; )
      n = n.array[t >>> r & Le], r -= K;
    return n;
  }
}
function Vn(e, t, n) {
  t !== void 0 && (t |= 0), n !== void 0 && (n |= 0);
  var r = e.__ownerID || new Bl(), i = e._origin, o = e._capacity, s = i + t, a = n === void 0 ? o : n < 0 ? o + n : i + n;
  if (s === i && a === o)
    return e;
  if (s >= a)
    return e.clear();
  for (var u = e._level, f = e._root, c = 0; s + c < 0; )
    f = new Gn(
      f && f.array.length ? [void 0, f] : [],
      r
    ), u += K, c += 1 << u;
  c && (s += c, i += c, a += c, o += c);
  for (var l = Lo(o), h = Lo(a); h >= 1 << u + K; )
    f = new Gn(
      f && f.array.length ? [f] : [],
      r
    ), u += K;
  var d = e._tail, _ = h < l ? z1(e, a - 1) : h > l ? new Gn([], r) : d;
  if (d && h > l && s < o && d.array.length) {
    f = gi(f, r);
    for (var v = f, g = u; g > K; g -= K) {
      var y = l >>> g & Le;
      v = v.array[y] = gi(v.array[y], r);
    }
    v.array[l >>> K & Le] = d;
  }
  if (a < o && (_ = _ && _.removeAfter(r, 0, a)), s >= h)
    s -= h, a -= h, u = K, f = null, _ = _ && _.removeBefore(r, 0, s);
  else if (s > i || h < l) {
    for (c = 0; f; ) {
      var b = s >>> u & Le;
      if (b !== h >>> u & Le)
        break;
      b && (c += (1 << u) * b), u -= K, f = f.array[b];
    }
    f && s > i && (f = f.removeBefore(r, u, s - c)), f && h < l && (f = f.removeAfter(
      r,
      u,
      h - c
    )), c && (s -= c, a -= c);
  }
  return e.__ownerID ? (e.size = a - s, e._origin = s, e._capacity = a, e._level = u, e._root = f, e._tail = _, e.__hash = void 0, e.__altered = !0, e) : Do(s, a, u, f, _);
}
function Lo(e) {
  return e < st ? 0 : e - 1 >>> K << K;
}
var an = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? ro() : Gl(n) ? n : ro().withMutations(function(r) {
      var i = Lt(n);
      rt(i.size), i.forEach(function(o, s) {
        return r.set(s, o);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.prototype.toString = function() {
    return this.__toString("OrderedMap {", "}");
  }, t.prototype.get = function(r, i) {
    var o = this._map.get(r);
    return o !== void 0 ? this._list.get(o)[1] : i;
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._map.clear(), this._list.clear(), this.__altered = !0, this) : ro();
  }, t.prototype.set = function(r, i) {
    return Td(this, r, i);
  }, t.prototype.remove = function(r) {
    return Td(this, r, L);
  }, t.prototype.__iterate = function(r, i) {
    var o = this;
    return this._list.__iterate(
      function(s) {
        return s && r(s[1], s[0], o);
      },
      i
    );
  }, t.prototype.__iterator = function(r, i) {
    return this._list.fromEntrySeq().__iterator(r, i);
  }, t.prototype.__ensureOwner = function(r) {
    if (r === this.__ownerID)
      return this;
    var i = this._map.__ensureOwner(r), o = this._list.__ensureOwner(r);
    return r ? lh(i, o, r, this.__hash) : this.size === 0 ? ro() : (this.__ownerID = r, this.__altered = !1, this._map = i, this._list = o, this);
  }, t;
}(zr);
an.isOrderedMap = Gl;
an.prototype[tr] = !0;
an.prototype[cs] = an.prototype.remove;
function lh(e, t, n, r) {
  var i = Object.create(an.prototype);
  return i.size = e ? e.size : 0, i._map = e, i._list = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
var Rd;
function ro() {
  return Rd || (Rd = lh(en(), ra()));
}
function Td(e, t, n) {
  var r = e._map, i = e._list, o = r.get(t), s = o !== void 0, a, u;
  if (n === L) {
    if (!s)
      return e;
    i.size >= st && i.size >= r.size * 2 ? (u = i.filter(function(f, c) {
      return f !== void 0 && o !== c;
    }), a = u.toKeyedSeq().map(function(f) {
      return f[0];
    }).flip().toMap(), e.__ownerID && (a.__ownerID = u.__ownerID = e.__ownerID)) : (a = r.remove(t), u = o === i.size - 1 ? i.pop() : i.set(o, void 0));
  } else if (s) {
    if (n === i.get(o)[1])
      return e;
    a = r, u = i.set(o, [t, n]);
  } else
    a = r.set(t, i.size), u = i.set(i.size, [t, n]);
  return e.__ownerID ? (e.size = a.size, e._map = a, e._list = u, e.__hash = void 0, e.__altered = !0, e) : lh(a, u);
}
var U1 = "@@__IMMUTABLE_STACK__@@";
function ma(e) {
  return !!(e && // @ts-expect-error: maybeStack is typed as `{}`, need to change in 6.0 to `maybeStack && typeof maybeStack === 'object' && MAYBE_STACK_SYMBOL in maybeStack`
  e[U1]);
}
var $u = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? Us() : ma(n) ? n : Us().pushAll(n);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.prototype.toString = function() {
    return this.__toString("Stack [", "]");
  }, t.prototype.get = function(r, i) {
    var o = this._head;
    for (r = er(this, r); o && r--; )
      o = o.next;
    return o ? o.value : i;
  }, t.prototype.peek = function() {
    return this._head && this._head.value;
  }, t.prototype.push = function() {
    var r = arguments;
    if (arguments.length === 0)
      return this;
    for (var i = this.size + arguments.length, o = this._head, s = arguments.length - 1; s >= 0; s--)
      o = {
        value: r[s],
        next: o
      };
    return this.__ownerID ? (this.size = i, this._head = o, this.__hash = void 0, this.__altered = !0, this) : io(i, o);
  }, t.prototype.pushAll = function(r) {
    if (r = e(r), r.size === 0)
      return this;
    if (this.size === 0 && ma(r))
      return r;
    rt(r.size);
    var i = this.size, o = this._head;
    return r.__iterate(
      function(s) {
        i++, o = {
          value: s,
          next: o
        };
      },
      /* reverse */
      !0
    ), this.__ownerID ? (this.size = i, this._head = o, this.__hash = void 0, this.__altered = !0, this) : io(i, o);
  }, t.prototype.pop = function() {
    return this.slice(1);
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._head = void 0, this.__hash = void 0, this.__altered = !0, this) : Us();
  }, t.prototype.slice = function(r, i) {
    if (ls(r, i, this.size))
      return this;
    var o = Fi(r, this.size), s = hs(i, this.size);
    if (s !== this.size)
      return e.prototype.slice.call(this, r, i);
    for (var a = this.size - o, u = this._head; o--; )
      u = u.next;
    return this.__ownerID ? (this.size = a, this._head = u, this.__hash = void 0, this.__altered = !0, this) : io(a, u);
  }, t.prototype.__ensureOwner = function(r) {
    return r === this.__ownerID ? this : r ? io(this.size, this._head, r, this.__hash) : this.size === 0 ? Us() : (this.__ownerID = r, this.__altered = !1, this);
  }, t.prototype.__iterate = function(r, i) {
    var o = this;
    if (i)
      return new pi(this.toArray()).__iterate(
        function(u, f) {
          return r(u, f, o);
        },
        i
      );
    for (var s = 0, a = this._head; a && r(a.value, s++, this) !== !1; )
      a = a.next;
    return s;
  }, t.prototype.__iterator = function(r, i) {
    if (i)
      return new pi(this.toArray()).__iterator(r, i);
    var o = 0, s = this._head;
    return new F(function() {
      if (s) {
        var a = s.value;
        return s = s.next, ee(r, o++, a);
      }
      return Me();
    });
  }, t;
}(jr);
$u.isStack = ma;
var ze = $u.prototype;
ze[U1] = !0;
ze.shift = ze.pop;
ze.unshift = ze.push;
ze.unshiftAll = ze.pushAll;
ze.withMutations = _s;
ze.wasAltered = sh;
ze.asImmutable = gs;
ze["@@transducer/init"] = ze.asMutable = vs;
ze["@@transducer/step"] = function(e, t) {
  return e.unshift(t);
};
ze["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
function io(e, t, n, r) {
  var i = Object.create(ze);
  return i.size = e, i._head = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
var $d;
function Us() {
  return $d || ($d = io(0));
}
var V1 = "@@__IMMUTABLE_SET__@@";
function Nu(e) {
  return !!(e && // @ts-expect-error: maybeSet is typed as `{}`,  need to change in 6.0 to `maybeSeq && typeof maybeSet === 'object' && MAYBE_SET_SYMBOL in maybeSet`
  e[V1]);
}
function hh(e) {
  return Nu(e) && Vt(e);
}
function ph(e, t) {
  if (e === t)
    return !0;
  if (!et(t) || // @ts-expect-error size should exists on Collection
  e.size !== void 0 && t.size !== void 0 && e.size !== t.size || // @ts-expect-error __hash exists on Collection
  e.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  t.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  e.__hash !== t.__hash || X(e) !== X(t) || tt(e) !== tt(t) || // @ts-expect-error Range extends Collection, which implements [Symbol.iterator], so it is valid
  Vt(e) !== Vt(t))
    return !1;
  if (e.size === 0 && t.size === 0)
    return !0;
  var n = !Au(e);
  if (Vt(e)) {
    var r = e.entries();
    return t.every(function(u, f) {
      var c = r.next().value;
      return c && be(c[1], u) && (n || be(c[0], f));
    }) && r.next().done;
  }
  var i = !1;
  if (e.size === void 0)
    if (t.size === void 0)
      typeof e.cacheResult == "function" && e.cacheResult();
    else {
      i = !0;
      var o = e;
      e = t, t = o;
    }
  var s = !0, a = (
    // @ts-expect-error b is Range | Repeat | Collection<unknown, unknown> as it may have been flipped, and __iterate is valid
    t.__iterate(function(u, f) {
      if (n ? (
        // @ts-expect-error has exists on Collection
        !e.has(u)
      ) : i ? (
        // @ts-expect-error type of `get` does not "catch" the version with `notSetValue`
        !be(u, e.get(f, L))
      ) : (
        // @ts-expect-error type of `get` does not "catch" the version with `notSetValue`
        !be(e.get(f, L), u)
      ))
        return s = !1, !1;
    })
  );
  return s && // @ts-expect-error size should exists on Collection
  e.size === a;
}
function Ur(e, t) {
  var n = function(r) {
    e.prototype[r] = t[r];
  };
  return Object.keys(t).forEach(n), Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(t).forEach(n), e;
}
function wa(e) {
  if (!e || typeof e != "object")
    return e;
  if (!et(e)) {
    if (!nr(e))
      return e;
    e = Pe(e);
  }
  if (X(e)) {
    var t = {};
    return e.__iterate(function(r, i) {
      t[i] = wa(r);
    }), t;
  }
  var n = [];
  return e.__iterate(function(r) {
    n.push(wa(r));
  }), n;
}
var bs = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? oo() : Nu(n) && !Vt(n) ? n : oo().withMutations(function(r) {
      var i = e(n);
      rt(i.size), i.forEach(function(o) {
        return r.add(o);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.fromKeys = function(r) {
    return this(Lt(r).keySeq());
  }, t.intersect = function(r) {
    return r = we(r).toArray(), r.length ? Ee.intersect.apply(t(r.pop()), r) : oo();
  }, t.union = function(r) {
    return r = we(r).toArray(), r.length ? Ee.union.apply(t(r.pop()), r) : oo();
  }, t.prototype.toString = function() {
    return this.__toString("Set {", "}");
  }, t.prototype.has = function(r) {
    return this._map.has(r);
  }, t.prototype.add = function(r) {
    return Vs(this, this._map.set(r, r));
  }, t.prototype.remove = function(r) {
    return Vs(this, this._map.remove(r));
  }, t.prototype.clear = function() {
    return Vs(this, this._map.clear());
  }, t.prototype.map = function(r, i) {
    var o = this, s = !1, a = Vs(
      this,
      this._map.mapEntries(function(u) {
        var f = u[1], c = r.call(i, f, f, o);
        return c !== f && (s = !0), [c, c];
      }, i)
    );
    return s ? a : this;
  }, t.prototype.union = function() {
    for (var r = [], i = arguments.length; i--; ) r[i] = arguments[i];
    return r = r.filter(function(o) {
      return o.size !== 0;
    }), r.length === 0 ? this : this.size === 0 && !this.__ownerID && r.length === 1 ? this.constructor(r[0]) : this.withMutations(function(o) {
      for (var s = 0; s < r.length; s++)
        typeof r[s] == "string" ? o.add(r[s]) : e(r[s]).forEach(function(a) {
          return o.add(a);
        });
    });
  }, t.prototype.intersect = function() {
    for (var r = [], i = arguments.length; i--; ) r[i] = arguments[i];
    if (r.length === 0)
      return this;
    r = r.map(function(s) {
      return e(s);
    });
    var o = [];
    return this.forEach(function(s) {
      r.every(function(a) {
        return a.includes(s);
      }) || o.push(s);
    }), this.withMutations(function(s) {
      o.forEach(function(a) {
        s.remove(a);
      });
    });
  }, t.prototype.subtract = function() {
    for (var r = [], i = arguments.length; i--; ) r[i] = arguments[i];
    if (r.length === 0)
      return this;
    r = r.map(function(s) {
      return e(s);
    });
    var o = [];
    return this.forEach(function(s) {
      r.some(function(a) {
        return a.includes(s);
      }) && o.push(s);
    }), this.withMutations(function(s) {
      o.forEach(function(a) {
        s.remove(a);
      });
    });
  }, t.prototype.sort = function(r) {
    return bi(di(this, r));
  }, t.prototype.sortBy = function(r, i) {
    return bi(di(this, i, r));
  }, t.prototype.wasAltered = function() {
    return this._map.wasAltered();
  }, t.prototype.__iterate = function(r, i) {
    var o = this;
    return this._map.__iterate(function(s) {
      return r(s, s, o);
    }, i);
  }, t.prototype.__iterator = function(r, i) {
    return this._map.__iterator(r, i);
  }, t.prototype.__ensureOwner = function(r) {
    if (r === this.__ownerID)
      return this;
    var i = this._map.__ensureOwner(r);
    return r ? this.__make(i, r) : this.size === 0 ? this.__empty() : (this.__ownerID = r, this._map = i, this);
  }, t;
}(ji);
bs.isSet = Nu;
var Ee = bs.prototype;
Ee[V1] = !0;
Ee[cs] = Ee.remove;
Ee.merge = Ee.concat = Ee.union;
Ee.withMutations = _s;
Ee.asImmutable = gs;
Ee["@@transducer/init"] = Ee.asMutable = vs;
Ee["@@transducer/step"] = function(e, t) {
  return e.add(t);
};
Ee["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
Ee.__empty = oo;
Ee.__make = q1;
function Vs(e, t) {
  return e.__ownerID ? (e.size = t.size, e._map = t, e) : t === e._map ? e : t.size === 0 ? e.__empty() : e.__make(t);
}
function q1(e, t) {
  var n = Object.create(Ee);
  return n.size = e ? e.size : 0, n._map = e, n.__ownerID = t, n;
}
var Nd;
function oo() {
  return Nd || (Nd = q1(en()));
}
var W1 = /* @__PURE__ */ function(e) {
  function t(n, r, i) {
    if (i === void 0 && (i = 1), !(this instanceof t))
      return new t(n, r, i);
    if (co(i !== 0, "Cannot step a Range by 0"), co(
      n !== void 0,
      "You must define a start value when using Range"
    ), co(
      r !== void 0,
      "You must define an end value when using Range"
    ), i = Math.abs(i), r < n && (i = -i), this._start = n, this._end = r, this._step = i, this.size = Math.max(0, Math.ceil((r - n) / i - 1) + 1), this.size === 0) {
      if (df)
        return df;
      df = this;
    }
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.size === 0 ? "Range []" : "Range [ " + this._start + "..." + this._end + (this._step !== 1 ? " by " + this._step : "") + " ]";
  }, t.prototype.get = function(r, i) {
    return this.has(r) ? this._start + er(this, r) * this._step : i;
  }, t.prototype.includes = function(r) {
    var i = (r - this._start) / this._step;
    return i >= 0 && i < this.size && i === Math.floor(i);
  }, t.prototype.slice = function(r, i) {
    return ls(r, i, this.size) ? this : (r = Fi(r, this.size), i = hs(i, this.size), i <= r ? new t(0, 0) : new t(
      this.get(r, this._end),
      this.get(i, this._end),
      this._step
    ));
  }, t.prototype.indexOf = function(r) {
    var i = r - this._start;
    if (i % this._step === 0) {
      var o = i / this._step;
      if (o >= 0 && o < this.size)
        return o;
    }
    return -1;
  }, t.prototype.lastIndexOf = function(r) {
    return this.indexOf(r);
  }, t.prototype.__iterate = function(r, i) {
    for (var o = this.size, s = this._step, a = i ? this._start + (o - 1) * s : this._start, u = 0; u !== o && r(a, i ? o - ++u : u++, this) !== !1; )
      a += i ? -s : s;
    return u;
  }, t.prototype.__iterator = function(r, i) {
    var o = this.size, s = this._step, a = i ? this._start + (o - 1) * s : this._start, u = 0;
    return new F(function() {
      if (u === o)
        return Me();
      var f = a;
      return a += i ? -s : s, ee(r, i ? o - ++u : u++, f);
    });
  }, t.prototype.equals = function(r) {
    return r instanceof t ? this._start === r._start && this._end === r._end && this._step === r._step : ph(this, r);
  }, t;
}(jt), df;
function dh(e, t, n) {
  for (var r = S1(t), i = 0; i !== r.length; )
    if (e = Zl(e, r[i++], L), e === L)
      return n;
  return e;
}
function k1(e, t) {
  return dh(this, e, t);
}
function G1(e, t) {
  return dh(e, t, L) !== L;
}
function w3(e) {
  return G1(this, e);
}
function H1() {
  rt(this.size);
  var e = {};
  return this.__iterate(function(t, n) {
    e[n] = t;
  }), e;
}
we.Iterator = F;
Ur(we, {
  // ### Conversion to other types
  toArray: function() {
    rt(this.size);
    var t = new Array(this.size || 0), n = X(this), r = 0;
    return this.__iterate(function(i, o) {
      t[r++] = n ? [o, i] : i;
    }), t;
  },
  toIndexedSeq: function() {
    return new v1(this);
  },
  toJS: function() {
    return wa(this);
  },
  toKeyedSeq: function() {
    return new Tu(this, !0);
  },
  toMap: function() {
    return zr(this.toKeyedSeq());
  },
  toObject: H1,
  toOrderedMap: function() {
    return an(this.toKeyedSeq());
  },
  toOrderedSet: function() {
    return bi(X(this) ? this.valueSeq() : this);
  },
  toSet: function() {
    return bs(X(this) ? this.valueSeq() : this);
  },
  toSetSeq: function() {
    return new g1(this);
  },
  toSeq: function() {
    return tt(this) ? this.toIndexedSeq() : X(this) ? this.toKeyedSeq() : this.toSetSeq();
  },
  toStack: function() {
    return $u(X(this) ? this.valueSeq() : this);
  },
  toList: function() {
    return ys(X(this) ? this.valueSeq() : this);
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
    return H(this, t3(this, t));
  },
  includes: function(t) {
    return this.some(function(n) {
      return be(n, t);
    });
  },
  entries: function() {
    return this.__iterator(yt);
  },
  every: function(t, n) {
    rt(this.size);
    var r = !0;
    return this.__iterate(function(i, o, s) {
      if (!t.call(n, i, o, s))
        return r = !1, !1;
    }), r;
  },
  filter: function(t, n) {
    return H(this, w1(this, t, n, !0));
  },
  partition: function(t, n) {
    return ZC(this, t, n);
  },
  find: function(t, n, r) {
    var i = this.findEntry(t, n);
    return i ? i[1] : r;
  },
  forEach: function(t, n) {
    return rt(this.size), this.__iterate(n ? t.bind(n) : t);
  },
  join: function(t) {
    rt(this.size), t = t !== void 0 ? "" + t : ",";
    var n = "", r = !0;
    return this.__iterate(function(i) {
      r ? r = !1 : n += t, n += i != null ? i.toString() : "";
    }), n;
  },
  keys: function() {
    return this.__iterator(Bi);
  },
  map: function(t, n) {
    return H(this, m1(this, t, n));
  },
  reduce: function(t, n, r) {
    return Md(
      this,
      t,
      n,
      r,
      arguments.length < 2,
      !1
    );
  },
  reduceRight: function(t, n, r) {
    return Md(
      this,
      t,
      n,
      r,
      arguments.length < 2,
      !0
    );
  },
  reverse: function() {
    return H(this, Hl(this, !0));
  },
  slice: function(t, n) {
    return H(this, Kl(this, t, n, !0));
  },
  some: function(t, n) {
    rt(this.size);
    var r = !1;
    return this.__iterate(function(i, o, s) {
      if (t.call(n, i, o, s))
        return r = !0, !1;
    }), r;
  },
  sort: function(t) {
    return H(this, di(this, t));
  },
  values: function() {
    return this.__iterator(gt);
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
    return hi(
      t ? this.toSeq().filter(t, n) : this
    );
  },
  countBy: function(t, n) {
    return XC(this, t, n);
  },
  equals: function(t) {
    return ph(this, t);
  },
  entrySeq: function() {
    var t = this;
    if (t._cache)
      return new pi(t._cache);
    var n = t.toSeq().map(O3).toIndexedSeq();
    return n.fromEntrySeq = function() {
      return t.toSeq();
    }, n;
  },
  filterNot: function(t, n) {
    return this.filter(_f(t), n);
  },
  findEntry: function(t, n, r) {
    var i = r;
    return this.__iterate(function(o, s, a) {
      if (t.call(n, o, s, a))
        return i = [s, o], !1;
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
    return this.find(s1, null, t);
  },
  flatMap: function(t, n) {
    return H(this, n3(this, t, n));
  },
  flatten: function(t) {
    return H(this, O1(this, t, !0));
  },
  fromEntrySeq: function() {
    return new y1(this);
  },
  get: function(t, n) {
    return this.find(function(r, i) {
      return be(i, t);
    }, void 0, n);
  },
  getIn: k1,
  groupBy: function(t, n) {
    return JC(this, t, n);
  },
  has: function(t) {
    return this.get(t, L) !== L;
  },
  hasIn: w3,
  isSubset: function(t) {
    return t = typeof t.includes == "function" ? t : we(t), this.every(function(n) {
      return t.includes(n);
    });
  },
  isSuperset: function(t) {
    return t = typeof t.isSubset == "function" ? t : we(t), t.isSubset(this);
  },
  keyOf: function(t) {
    return this.findKey(function(n) {
      return be(n, t);
    });
  },
  keySeq: function() {
    return this.toSeq().map(A3).toIndexedSeq();
  },
  last: function(t) {
    return this.toSeq().reverse().first(t);
  },
  lastKeyOf: function(t) {
    return this.toKeyedSeq().reverse().keyOf(t);
  },
  max: function(t) {
    return Bs(this, t);
  },
  maxBy: function(t, n) {
    return Bs(this, n, t);
  },
  min: function(t) {
    return Bs(
      this,
      t ? Pd(t) : Cd
    );
  },
  minBy: function(t, n) {
    return Bs(
      this,
      n ? Pd(n) : Cd,
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
    return H(this, A1(this, t, n, !0));
  },
  skipUntil: function(t, n) {
    return this.skipWhile(_f(t), n);
  },
  sortBy: function(t, n) {
    return H(this, di(this, n, t));
  },
  take: function(t) {
    return this.slice(0, Math.max(0, t));
  },
  takeLast: function(t) {
    return this.slice(-Math.max(0, t));
  },
  takeWhile: function(t, n) {
    return H(this, QC(this, t, n));
  },
  takeUntil: function(t, n) {
    return this.takeWhile(_f(t), n);
  },
  update: function(t) {
    return t(this);
  },
  valueSeq: function() {
    return this.toIndexedSeq();
  },
  // ### Hashable Object
  hashCode: function() {
    return this.__hash || (this.__hash = E3(this));
  }
  // ### Internal
  // abstract __iterate(fn, reverse)
  // abstract __iterator(type, reverse)
});
var Ie = we.prototype;
Ie[f1] = !0;
Ie[Eu] = Ie.values;
Ie.toJSON = Ie.toArray;
Ie.__toStringMapper = Po;
Ie.inspect = Ie.toSource = function() {
  return this.toString();
};
Ie.chain = Ie.flatMap;
Ie.contains = Ie.includes;
Ur(Lt, {
  // ### More sequential methods
  flip: function() {
    return H(this, b1(this));
  },
  mapEntries: function(t, n) {
    var r = this, i = 0;
    return H(
      this,
      this.toSeq().map(function(o, s) {
        return t.call(n, [s, o], i++, r);
      }).fromEntrySeq()
    );
  },
  mapKeys: function(t, n) {
    var r = this;
    return H(
      this,
      this.toSeq().flip().map(function(i, o) {
        return t.call(n, i, o, r);
      }).flip()
    );
  }
});
var ms = Lt.prototype;
ms[ga] = !0;
ms[Eu] = Ie.entries;
ms.toJSON = H1;
ms.__toStringMapper = function(e, t) {
  return Po(t) + ": " + Po(e);
};
Ur(jr, {
  // ### Conversion to other types
  toKeyedSeq: function() {
    return new Tu(this, !1);
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  filter: function(t, n) {
    return H(this, w1(this, t, n, !1));
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
    return H(this, Hl(this, !1));
  },
  slice: function(t, n) {
    return H(this, Kl(this, t, n, !1));
  },
  splice: function(t, n) {
    var r = arguments.length;
    if (n = Math.max(n || 0, 0), r === 0 || r === 2 && !n)
      return this;
    t = Fi(t, t < 0 ? this.count() : this.size);
    var i = this.slice(0, t);
    return H(
      this,
      r === 1 ? i : i.concat(Zt(arguments, 2), this.slice(t + n))
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
    return H(this, O1(this, t, !1));
  },
  get: function(t, n) {
    return t = er(this, t), t < 0 || this.size === 1 / 0 || this.size !== void 0 && t > this.size ? n : this.find(function(r, i) {
      return i === t;
    }, void 0, n);
  },
  has: function(t) {
    return t = er(this, t), t >= 0 && (this.size !== void 0 ? this.size === 1 / 0 || t < this.size : this.indexOf(t) !== -1);
  },
  interpose: function(t) {
    return H(this, r3(this, t));
  },
  interleave: function() {
    var t = [this].concat(Zt(arguments)), n = zs(this.toSeq(), jt.of, t), r = n.flatten(!0);
    return n.size && (r.size = n.size * t.length), H(this, r);
  },
  keySeq: function() {
    return W1(0, this.size);
  },
  last: function(t) {
    return this.get(-1, t);
  },
  skipWhile: function(t, n) {
    return H(this, A1(this, t, n, !1));
  },
  zip: function() {
    var t = [this].concat(Zt(arguments));
    return H(this, zs(this, Id, t));
  },
  zipAll: function() {
    var t = [this].concat(Zt(arguments));
    return H(this, zs(this, Id, t, !0));
  },
  zipWith: function(t) {
    var n = Zt(arguments);
    return n[0] = this, H(this, zs(this, t, n));
  }
});
var Vi = jr.prototype;
Vi[ya] = !0;
Vi[tr] = !0;
Ur(ji, {
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
var yi = ji.prototype;
yi.has = Ie.includes;
yi.contains = yi.includes;
yi.keys = yi.values;
Ur(lr, ms);
Ur(jt, Vi);
Ur(Ui, yi);
function Md(e, t, n, r, i, o) {
  return rt(e.size), e.__iterate(function(s, a, u) {
    i ? (i = !1, n = s) : n = t.call(r, n, s, a, u);
  }, o), n;
}
function A3(e, t) {
  return t;
}
function O3(e, t) {
  return [t, e];
}
function _f(e) {
  return function() {
    return !e.apply(this, arguments);
  };
}
function Pd(e) {
  return function() {
    return -e.apply(this, arguments);
  };
}
function Id() {
  return Zt(arguments);
}
function Cd(e, t) {
  return e < t ? 1 : e > t ? -1 : 0;
}
function E3(e) {
  if (e.size === 1 / 0)
    return 0;
  var t = Vt(e), n = X(e), r = t ? 1 : 0;
  return e.__iterate(
    n ? t ? function(i, o) {
      r = 31 * r + Dd(He(i), He(o)) | 0;
    } : function(i, o) {
      r = r + Dd(He(i), He(o)) | 0;
    } : t ? function(i) {
      r = 31 * r + He(i) | 0;
    } : function(i) {
      r = r + He(i) | 0;
    }
  ), S3(e.size, r);
}
function S3(e, t) {
  return t = Qi(t, 3432918353), t = Qi(t << 15 | t >>> -15, 461845907), t = Qi(t << 13 | t >>> -13, 5), t = (t + 3864292196 | 0) ^ e, t = Qi(t ^ t >>> 16, 2246822507), t = Qi(t ^ t >>> 13, 3266489909), t = Ru(t ^ t >>> 16), t;
}
function Dd(e, t) {
  return e ^ t + 2654435769 + (e << 6) + (e >> 2) | 0;
}
var bi = /* @__PURE__ */ function(e) {
  function t(n) {
    return n == null ? uc() : hh(n) ? n : uc().withMutations(function(r) {
      var i = ji(n);
      rt(i.size), i.forEach(function(o) {
        return r.add(o);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.fromKeys = function(r) {
    return this(Lt(r).keySeq());
  }, t.prototype.toString = function() {
    return this.__toString("OrderedSet {", "}");
  }, t;
}(bs);
bi.isOrderedSet = hh;
var Vr = bi.prototype;
Vr[tr] = !0;
Vr.zip = Vi.zip;
Vr.zipWith = Vi.zipWith;
Vr.zipAll = Vi.zipAll;
Vr.__empty = uc;
Vr.__make = K1;
function K1(e, t) {
  var n = Object.create(Vr);
  return n.size = e ? e.size : 0, n._map = e, n.__ownerID = t, n;
}
var Ld;
function uc() {
  return Ld || (Ld = K1(ro()));
}
var x3 = {
  LeftThenRight: -1,
  RightThenLeft: 1
};
function R3(e) {
  if (cr(e))
    throw new Error(
      "Can not call `Record` with an immutable Record as default values. Use a plain javascript object instead."
    );
  if (Ft(e))
    throw new Error(
      "Can not call `Record` with an immutable Collection as default values. Use a plain javascript object instead."
    );
  if (e === null || typeof e != "object")
    throw new Error(
      "Can not call `Record` with a non-object as default values. Use a plain javascript object instead."
    );
}
var de = function(t, n) {
  var r;
  R3(t);
  var i = function(a) {
    var u = this;
    if (a instanceof i)
      return a;
    if (!(this instanceof i))
      return new i(a);
    if (!r) {
      r = !0;
      var f = Object.keys(t), c = o._indices = {};
      o._name = n, o._keys = f, o._defaultValues = t;
      for (var l = 0; l < f.length; l++) {
        var h = f[l];
        c[h] = l, o[h] ? typeof console == "object" && console.warn && console.warn(
          "Cannot define " + vh(this) + ' with property "' + h + '" since that property name is part of the Record API.'
        ) : T3(o, h);
      }
    }
    return this.__ownerID = void 0, this._values = ys().withMutations(function(d) {
      d.setSize(u._keys.length), Lt(a).forEach(function(_, v) {
        d.set(u._indices[v], _ === u._defaultValues[v] ? void 0 : _);
      });
    }), this;
  }, o = i.prototype = Object.create(J);
  return o.constructor = i, n && (i.displayName = n), i;
};
de.prototype.toString = function() {
  for (var t = vh(this) + " { ", n = this._keys, r, i = 0, o = n.length; i !== o; i++)
    r = n[i], t += (i ? ", " : "") + r + ": " + Po(this.get(r));
  return t + " }";
};
de.prototype.equals = function(t) {
  return this === t || cr(t) && mi(this).equals(mi(t));
};
de.prototype.hashCode = function() {
  return mi(this).hashCode();
};
de.prototype.has = function(t) {
  return this._indices.hasOwnProperty(t);
};
de.prototype.get = function(t, n) {
  if (!this.has(t))
    return n;
  var r = this._indices[t], i = this._values.get(r);
  return i === void 0 ? this._defaultValues[t] : i;
};
de.prototype.set = function(t, n) {
  if (this.has(t)) {
    var r = this._values.set(
      this._indices[t],
      n === this._defaultValues[t] ? void 0 : n
    );
    if (r !== this._values && !this.__ownerID)
      return _h(this, r);
  }
  return this;
};
de.prototype.remove = function(t) {
  return this.set(t);
};
de.prototype.clear = function() {
  var t = this._values.clear().setSize(this._keys.length);
  return this.__ownerID ? this : _h(this, t);
};
de.prototype.wasAltered = function() {
  return this._values.wasAltered();
};
de.prototype.toSeq = function() {
  return mi(this);
};
de.prototype.toJS = function() {
  return wa(this);
};
de.prototype.entries = function() {
  return this.__iterator(yt);
};
de.prototype.__iterator = function(t, n) {
  return mi(this).__iterator(t, n);
};
de.prototype.__iterate = function(t, n) {
  return mi(this).__iterate(t, n);
};
de.prototype.__ensureOwner = function(t) {
  if (t === this.__ownerID)
    return this;
  var n = this._values.__ensureOwner(t);
  return t ? _h(this, n, t) : (this.__ownerID = t, this._values = n, this);
};
de.isRecord = cr;
de.getDescriptiveName = vh;
var J = de.prototype;
J[l1] = !0;
J[cs] = J.remove;
J.deleteIn = J.removeIn = eh;
J.getIn = k1;
J.hasIn = Ie.hasIn;
J.merge = P1;
J.mergeWith = I1;
J.mergeIn = ih;
J.mergeDeep = D1;
J.mergeDeepWith = L1;
J.mergeDeepIn = oh;
J.setIn = Ql;
J.update = nh;
J.updateIn = rh;
J.withMutations = _s;
J.asMutable = vs;
J.asImmutable = gs;
J[Eu] = J.entries;
J.toJSON = J.toObject = Ie.toObject;
J.inspect = J.toSource = function() {
  return this.toString();
};
function _h(e, t, n) {
  var r = Object.create(Object.getPrototypeOf(e));
  return r._values = t, r.__ownerID = n, r;
}
function vh(e) {
  return e.constructor.displayName || e.constructor.name || "Record";
}
function mi(e) {
  return Wl(e._keys.map(function(t) {
    return [t, e.get(t)];
  }));
}
function T3(e, t) {
  try {
    Object.defineProperty(e, t, {
      get: function() {
        return this.get(t);
      },
      set: function(n) {
        co(this.__ownerID, "Cannot set on an immutable record."), this.set(t, n);
      }
    });
  } catch {
  }
}
var $3 = /* @__PURE__ */ function(e) {
  function t(n, r) {
    if (!(this instanceof t))
      return new t(n, r);
    if (this._value = n, this.size = r === void 0 ? 1 / 0 : Math.max(0, r), this.size === 0) {
      if (vf)
        return vf;
      vf = this;
    }
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.size === 0 ? "Repeat []" : "Repeat [ " + this._value + " " + this.size + " times ]";
  }, t.prototype.get = function(r, i) {
    return this.has(r) ? this._value : i;
  }, t.prototype.includes = function(r) {
    return be(this._value, r);
  }, t.prototype.slice = function(r, i) {
    var o = this.size;
    return ls(r, i, o) ? this : new t(
      this._value,
      hs(i, o) - Fi(r, o)
    );
  }, t.prototype.reverse = function() {
    return this;
  }, t.prototype.indexOf = function(r) {
    return be(this._value, r) ? 0 : -1;
  }, t.prototype.lastIndexOf = function(r) {
    return be(this._value, r) ? this.size : -1;
  }, t.prototype.__iterate = function(r, i) {
    for (var o = this.size, s = 0; s !== o && r(this._value, i ? o - ++s : s++, this) !== !1; )
      ;
    return s;
  }, t.prototype.__iterator = function(r, i) {
    var o = this, s = this.size, a = 0;
    return new F(
      function() {
        return a === s ? Me() : ee(r, i ? s - ++a : a++, o._value);
      }
    );
  }, t.prototype.equals = function(r) {
    return r instanceof t ? be(this._value, r._value) : ph(this, r);
  }, t;
}(jt), vf;
function N3(e, t) {
  return Y1(
    [],
    t || M3,
    e,
    "",
    t && t.length > 2 ? [] : void 0,
    { "": e }
  );
}
function Y1(e, t, n, r, i, o) {
  if (typeof n != "string" && !Ft(n) && (Ul(n) || zl(n) || Jl(n))) {
    if (~e.indexOf(n))
      throw new TypeError("Cannot convert circular structure to Immutable");
    e.push(n), i && r !== "" && i.push(r);
    var s = t.call(
      o,
      r,
      Pe(n).map(
        function(a, u) {
          return Y1(e, t, a, u, i, n);
        }
      ),
      i && i.slice()
    );
    return e.pop(), i && i.pop(), s;
  }
  return n;
}
function M3(e, t) {
  return tt(t) ? t.toList() : X(t) ? t.toMap() : t.toSet();
}
var P3 = "5.1.3", I3 = we;
const zB = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Collection: we,
  Iterable: I3,
  List: ys,
  Map: zr,
  OrderedMap: an,
  OrderedSet: bi,
  PairSorting: x3,
  Range: W1,
  Record: de,
  Repeat: $3,
  Seq: Pe,
  Set: bs,
  Stack: $u,
  fromJS: N3,
  get: Zl,
  getIn: dh,
  has: x1,
  hasIn: G1,
  hash: He,
  is: be,
  isAssociative: Au,
  isCollection: et,
  isImmutable: Ft,
  isIndexed: tt,
  isKeyed: X,
  isList: ch,
  isMap: xu,
  isOrdered: Vt,
  isOrderedMap: Gl,
  isOrderedSet: hh,
  isPlainObject: Jl,
  isRecord: cr,
  isSeq: Ou,
  isSet: Nu,
  isStack: ma,
  isValueObject: rc,
  merge: o3,
  mergeDeep: a3,
  mergeDeepWith: u3,
  mergeWith: s3,
  remove: R1,
  removeIn: M1,
  set: T1,
  setIn: N1,
  update: th,
  updateIn: Br,
  version: P3
}, Symbol.toStringTag, { value: "Module" }));
/**
* @vue/reactivity v3.5.16
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function C3(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const D3 = Object.freeze({}), L3 = () => {
}, Aa = Object.assign, F3 = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, j3 = Object.prototype.hasOwnProperty, Oa = (e, t) => j3.call(e, t), Nn = Array.isArray, oi = (e) => Mu(e) === "[object Map]", B3 = (e) => Mu(e) === "[object Set]", Fo = (e) => typeof e == "function", z3 = (e) => typeof e == "string", ws = (e) => typeof e == "symbol", qi = (e) => e !== null && typeof e == "object", U3 = Object.prototype.toString, Mu = (e) => U3.call(e), X1 = (e) => Mu(e).slice(8, -1), V3 = (e) => Mu(e) === "[object Object]", gh = (e) => z3(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, q3 = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, W3 = q3((e) => e.charAt(0).toUpperCase() + e.slice(1)), Hn = (e, t) => !Object.is(e, t), k3 = (e, t, n, r = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: r,
    value: n
  });
};
function bt(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let Te;
class J1 {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = Te, !t && Te && (this.index = (Te.scopes || (Te.scopes = [])).push(
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
      const n = Te;
      try {
        return Te = this, t();
      } finally {
        Te = n;
      }
    } else
      bt("cannot run an inactive effect scope.");
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Te, Te = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (Te = this.prevScope, this.prevScope = void 0);
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
function G3(e) {
  return new J1(e);
}
function Z1() {
  return Te;
}
function H3(e, t = !1) {
  Te ? Te.cleanups.push(e) : t || bt(
    "onScopeDispose() is called when there is no active effect scope to be associated with."
  );
}
let j;
const K3 = {
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
}, gf = /* @__PURE__ */ new WeakSet();
class jo {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Te && Te.active && Te.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, gf.has(this) && (gf.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ew(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Fd(this), tw(this);
    const t = j, n = ut;
    j = this, ut = !0;
    try {
      return this.fn();
    } finally {
      j !== this && bt(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), nw(this), j = t, ut = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        mh(t);
      this.deps = this.depsTail = void 0, Fd(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? gf.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    fc(this) && this.run();
  }
  get dirty() {
    return fc(this);
  }
}
let Q1 = 0, ho, po;
function ew(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = po, po = e;
    return;
  }
  e.next = ho, ho = e;
}
function yh() {
  Q1++;
}
function bh() {
  if (--Q1 > 0)
    return;
  if (po) {
    let t = po;
    for (po = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; ho; ) {
    let t = ho;
    for (ho = void 0; t; ) {
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
function tw(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function nw(e) {
  let t, n = e.depsTail, r = n;
  for (; r; ) {
    const i = r.prevDep;
    r.version === -1 ? (r === n && (n = i), mh(r), Y3(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = i;
  }
  e.deps = t, e.depsTail = n;
}
function fc(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (rw(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function rw(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Bo) || (e.globalVersion = Bo, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !fc(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = j, r = ut;
  j = e, ut = !0;
  try {
    tw(e);
    const i = e.fn(e._value);
    (t.version === 0 || Hn(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    j = n, ut = r, nw(e), e.flags &= -3;
  }
}
function mh(e, t = !1) {
  const { dep: n, prevSub: r, nextSub: i } = e;
  if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subsHead === e && (n.subsHead = i), n.subs === e && (n.subs = r, !r && n.computed)) {
    n.computed.flags &= -5;
    for (let o = n.computed.deps; o; o = o.nextDep)
      mh(o, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Y3(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function X3(e, t) {
  e.effect instanceof jo && (e = e.effect.fn);
  const n = new jo(e);
  t && Aa(n, t);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const r = n.run.bind(n);
  return r.effect = n, r;
}
function J3(e) {
  e.effect.stop();
}
let ut = !0;
const wh = [];
function Ah() {
  wh.push(ut), ut = !1;
}
function Z3() {
  wh.push(ut), ut = !0;
}
function Oh() {
  const e = wh.pop();
  ut = e === void 0 ? !0 : e;
}
function Q3(e, t = !1) {
  j instanceof jo ? j.cleanup = e : t || bt(
    "onEffectCleanup() was called when there was no active effect to associate with."
  );
}
function Fd(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = j;
    j = void 0;
    try {
      t();
    } finally {
      j = n;
    }
  }
}
let Bo = 0;
class eD {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Pu {
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.subsHead = void 0;
  }
  track(t) {
    if (!j || !ut || j === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== j)
      n = this.activeLink = new eD(j, this), j.deps ? (n.prevDep = j.depsTail, j.depsTail.nextDep = n, j.depsTail = n) : j.deps = j.depsTail = n, iw(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const r = n.nextDep;
      r.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = r), n.prevDep = j.depsTail, n.nextDep = void 0, j.depsTail.nextDep = n, j.depsTail = n, j.deps === n && (j.deps = r);
    }
    return j.onTrack && j.onTrack(
      Aa(
        {
          effect: j
        },
        t
      )
    ), n;
  }
  trigger(t) {
    this.version++, Bo++, this.notify(t);
  }
  notify(t) {
    yh();
    try {
      for (let n = this.subsHead; n; n = n.nextSub)
        n.sub.onTrigger && !(n.sub.flags & 8) && n.sub.onTrigger(
          Aa(
            {
              effect: n.sub
            },
            t
          )
        );
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      bh();
    }
  }
}
function iw(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let r = t.deps; r; r = r.nextDep)
        iw(r);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const Ea = /* @__PURE__ */ new WeakMap(), Kn = Symbol(
  "Object iterate"
), Sa = Symbol(
  "Map keys iterate"
), wi = Symbol(
  "Array iterate"
);
function De(e, t, n) {
  if (ut && j) {
    let r = Ea.get(e);
    r || Ea.set(e, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || (r.set(n, i = new Pu()), i.map = r, i.key = n), i.track({
      target: e,
      type: t,
      key: n
    });
  }
}
function Rn(e, t, n, r, i, o) {
  const s = Ea.get(e);
  if (!s) {
    Bo++;
    return;
  }
  const a = (u) => {
    u && u.trigger({
      target: e,
      type: t,
      key: n,
      newValue: r,
      oldValue: i,
      oldTarget: o
    });
  };
  if (yh(), t === "clear")
    s.forEach(a);
  else {
    const u = Nn(e), f = u && gh(n);
    if (u && n === "length") {
      const c = Number(r);
      s.forEach((l, h) => {
        (h === "length" || h === wi || !ws(h) && h >= c) && a(l);
      });
    } else
      switch ((n !== void 0 || s.has(void 0)) && a(s.get(n)), f && a(s.get(wi)), t) {
        case "add":
          u ? f && a(s.get("length")) : (a(s.get(Kn)), oi(e) && a(s.get(Sa)));
          break;
        case "delete":
          u || (a(s.get(Kn)), oi(e) && a(s.get(Sa)));
          break;
        case "set":
          oi(e) && a(s.get(Kn));
          break;
      }
  }
  bh();
}
function tD(e, t) {
  const n = Ea.get(e);
  return n && n.get(t);
}
function yr(e) {
  const t = U(e);
  return t === e ? t : (De(t, "iterate", wi), Tt(e) ? t : t.map($e));
}
function Iu(e) {
  return De(e = U(e), "iterate", wi), e;
}
const nD = {
  __proto__: null,
  [Symbol.iterator]() {
    return yf(this, Symbol.iterator, $e);
  },
  concat(...e) {
    return yr(this).concat(
      ...e.map((t) => Nn(t) ? yr(t) : t)
    );
  },
  entries() {
    return yf(this, "entries", (e) => (e[1] = $e(e[1]), e));
  },
  every(e, t) {
    return En(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return En(this, "filter", e, t, (n) => n.map($e), arguments);
  },
  find(e, t) {
    return En(this, "find", e, t, $e, arguments);
  },
  findIndex(e, t) {
    return En(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return En(this, "findLast", e, t, $e, arguments);
  },
  findLastIndex(e, t) {
    return En(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return En(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return bf(this, "includes", e);
  },
  indexOf(...e) {
    return bf(this, "indexOf", e);
  },
  join(e) {
    return yr(this).join(e);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...e) {
    return bf(this, "lastIndexOf", e);
  },
  map(e, t) {
    return En(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return eo(this, "pop");
  },
  push(...e) {
    return eo(this, "push", e);
  },
  reduce(e, ...t) {
    return jd(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return jd(this, "reduceRight", e, t);
  },
  shift() {
    return eo(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return En(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return eo(this, "splice", e);
  },
  toReversed() {
    return yr(this).toReversed();
  },
  toSorted(e) {
    return yr(this).toSorted(e);
  },
  toSpliced(...e) {
    return yr(this).toSpliced(...e);
  },
  unshift(...e) {
    return eo(this, "unshift", e);
  },
  values() {
    return yf(this, "values", $e);
  }
};
function yf(e, t, n) {
  const r = Iu(e), i = r[t]();
  return r !== e && !Tt(e) && (i._next = i.next, i.next = () => {
    const o = i._next();
    return o.value && (o.value = n(o.value)), o;
  }), i;
}
const rD = Array.prototype;
function En(e, t, n, r, i, o) {
  const s = Iu(e), a = s !== e && !Tt(e), u = s[t];
  if (u !== rD[t]) {
    const l = u.apply(e, o);
    return a ? $e(l) : l;
  }
  let f = n;
  s !== e && (a ? f = function(l, h) {
    return n.call(this, $e(l), h, e);
  } : n.length > 2 && (f = function(l, h) {
    return n.call(this, l, h, e);
  }));
  const c = u.call(s, f, r);
  return a && i ? i(c) : c;
}
function jd(e, t, n, r) {
  const i = Iu(e);
  let o = n;
  return i !== e && (Tt(e) ? n.length > 3 && (o = function(s, a, u) {
    return n.call(this, s, a, u, e);
  }) : o = function(s, a, u) {
    return n.call(this, s, $e(a), u, e);
  }), i[t](o, ...r);
}
function bf(e, t, n) {
  const r = U(e);
  De(r, "iterate", wi);
  const i = r[t](...n);
  return (i === -1 || i === !1) && xh(n[0]) ? (n[0] = U(n[0]), r[t](...n)) : i;
}
function eo(e, t, n = []) {
  Ah(), yh();
  const r = U(e)[t].apply(e, n);
  return bh(), Oh(), r;
}
const iD = /* @__PURE__ */ C3("__proto__,__v_isRef,__isVue"), ow = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ws)
);
function oD(e) {
  ws(e) || (e = String(e));
  const t = U(this);
  return De(t, "has", e), t.hasOwnProperty(e);
}
class sw {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, r) {
    if (n === "__v_skip") return t.__v_skip;
    const i = this._isReadonly, o = this._isShallow;
    if (n === "__v_isReactive")
      return !i;
    if (n === "__v_isReadonly")
      return i;
    if (n === "__v_isShallow")
      return o;
    if (n === "__v_raw")
      return r === (i ? o ? hw : lw : o ? cw : fw).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(r) ? t : void 0;
    const s = Nn(t);
    if (!i) {
      let u;
      if (s && (u = nD[n]))
        return u;
      if (n === "hasOwnProperty")
        return oD;
    }
    const a = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      Fe(t) ? t : r
    );
    return (ws(n) ? ow.has(n) : iD(n)) || (i || De(t, "get", n), o) ? a : Fe(a) ? s && gh(n) ? a : a.value : qi(a) ? i ? Sh(a) : Eh(a) : a;
  }
}
class aw extends sw {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, r, i) {
    let o = t[n];
    if (!this._isShallow) {
      const u = rr(o);
      if (!Tt(r) && !rr(r) && (o = U(o), r = U(r)), !Nn(t) && Fe(o) && !Fe(r))
        return u ? !1 : (o.value = r, !0);
    }
    const s = Nn(t) && gh(n) ? Number(n) < t.length : Oa(t, n), a = Reflect.set(
      t,
      n,
      r,
      Fe(t) ? t : i
    );
    return t === U(i) && (s ? Hn(r, o) && Rn(t, "set", n, r, o) : Rn(t, "add", n, r)), a;
  }
  deleteProperty(t, n) {
    const r = Oa(t, n), i = t[n], o = Reflect.deleteProperty(t, n);
    return o && r && Rn(t, "delete", n, void 0, i), o;
  }
  has(t, n) {
    const r = Reflect.has(t, n);
    return (!ws(n) || !ow.has(n)) && De(t, "has", n), r;
  }
  ownKeys(t) {
    return De(
      t,
      "iterate",
      Nn(t) ? "length" : Kn
    ), Reflect.ownKeys(t);
  }
}
class uw extends sw {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return bt(
      `Set operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, n) {
    return bt(
      `Delete operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
}
const sD = /* @__PURE__ */ new aw(), aD = /* @__PURE__ */ new uw(), uD = /* @__PURE__ */ new aw(!0), fD = /* @__PURE__ */ new uw(!0), cc = (e) => e, qs = (e) => Reflect.getPrototypeOf(e);
function cD(e, t, n) {
  return function(...r) {
    const i = this.__v_raw, o = U(i), s = oi(o), a = e === "entries" || e === Symbol.iterator && s, u = e === "keys" && s, f = i[e](...r), c = n ? cc : t ? xa : $e;
    return !t && De(
      o,
      "iterate",
      u ? Sa : Kn
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
function Ws(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      bt(
        `${W3(e)} operation ${n}failed: target is readonly.`,
        U(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function lD(e, t) {
  const n = {
    get(i) {
      const o = this.__v_raw, s = U(o), a = U(i);
      e || (Hn(i, a) && De(s, "get", i), De(s, "get", a));
      const { has: u } = qs(s), f = t ? cc : e ? xa : $e;
      if (u.call(s, i))
        return f(o.get(i));
      if (u.call(s, a))
        return f(o.get(a));
      o !== s && o.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && De(U(i), "iterate", Kn), Reflect.get(i, "size", i);
    },
    has(i) {
      const o = this.__v_raw, s = U(o), a = U(i);
      return e || (Hn(i, a) && De(s, "has", i), De(s, "has", a)), i === a ? o.has(i) : o.has(i) || o.has(a);
    },
    forEach(i, o) {
      const s = this, a = s.__v_raw, u = U(a), f = t ? cc : e ? xa : $e;
      return !e && De(u, "iterate", Kn), a.forEach((c, l) => i.call(o, f(c), f(l), s));
    }
  };
  return Aa(
    n,
    e ? {
      add: Ws("add"),
      set: Ws("set"),
      delete: Ws("delete"),
      clear: Ws("clear")
    } : {
      add(i) {
        !t && !Tt(i) && !rr(i) && (i = U(i));
        const o = U(this);
        return qs(o).has.call(o, i) || (o.add(i), Rn(o, "add", i, i)), this;
      },
      set(i, o) {
        !t && !Tt(o) && !rr(o) && (o = U(o));
        const s = U(this), { has: a, get: u } = qs(s);
        let f = a.call(s, i);
        f ? Bd(s, a, i) : (i = U(i), f = a.call(s, i));
        const c = u.call(s, i);
        return s.set(i, o), f ? Hn(o, c) && Rn(s, "set", i, o, c) : Rn(s, "add", i, o), this;
      },
      delete(i) {
        const o = U(this), { has: s, get: a } = qs(o);
        let u = s.call(o, i);
        u ? Bd(o, s, i) : (i = U(i), u = s.call(o, i));
        const f = a ? a.call(o, i) : void 0, c = o.delete(i);
        return u && Rn(o, "delete", i, void 0, f), c;
      },
      clear() {
        const i = U(this), o = i.size !== 0, s = oi(i) ? new Map(i) : new Set(i), a = i.clear();
        return o && Rn(
          i,
          "clear",
          void 0,
          void 0,
          s
        ), a;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((i) => {
    n[i] = cD(i, e, t);
  }), n;
}
function Cu(e, t) {
  const n = lD(e, t);
  return (r, i, o) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? r : Reflect.get(
    Oa(n, i) && i in r ? n : r,
    i,
    o
  );
}
const hD = {
  get: /* @__PURE__ */ Cu(!1, !1)
}, pD = {
  get: /* @__PURE__ */ Cu(!1, !0)
}, dD = {
  get: /* @__PURE__ */ Cu(!0, !1)
}, _D = {
  get: /* @__PURE__ */ Cu(!0, !0)
};
function Bd(e, t, n) {
  const r = U(n);
  if (r !== n && t.call(e, r)) {
    const i = X1(e);
    bt(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const fw = /* @__PURE__ */ new WeakMap(), cw = /* @__PURE__ */ new WeakMap(), lw = /* @__PURE__ */ new WeakMap(), hw = /* @__PURE__ */ new WeakMap();
function vD(e) {
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
function gD(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : vD(X1(e));
}
function Eh(e) {
  return rr(e) ? e : Du(
    e,
    !1,
    sD,
    hD,
    fw
  );
}
function yD(e) {
  return Du(
    e,
    !1,
    uD,
    pD,
    cw
  );
}
function Sh(e) {
  return Du(
    e,
    !0,
    aD,
    dD,
    lw
  );
}
function bD(e) {
  return Du(
    e,
    !0,
    fD,
    _D,
    hw
  );
}
function Du(e, t, n, r, i) {
  if (!qi(e))
    return bt(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const o = gD(e);
  if (o === 0)
    return e;
  const s = i.get(e);
  if (s)
    return s;
  const a = new Proxy(
    e,
    o === 2 ? r : n
  );
  return i.set(e, a), a;
}
function si(e) {
  return rr(e) ? si(e.__v_raw) : !!(e && e.__v_isReactive);
}
function rr(e) {
  return !!(e && e.__v_isReadonly);
}
function Tt(e) {
  return !!(e && e.__v_isShallow);
}
function xh(e) {
  return e ? !!e.__v_raw : !1;
}
function U(e) {
  const t = e && e.__v_raw;
  return t ? U(t) : e;
}
function mD(e) {
  return !Oa(e, "__v_skip") && Object.isExtensible(e) && k3(e, "__v_skip", !0), e;
}
const $e = (e) => qi(e) ? Eh(e) : e, xa = (e) => qi(e) ? Sh(e) : e;
function Fe(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function pw(e) {
  return dw(e, !1);
}
function wD(e) {
  return dw(e, !0);
}
function dw(e, t) {
  return Fe(e) ? e : new AD(e, t);
}
class AD {
  constructor(t, n) {
    this.dep = new Pu(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : U(t), this._value = n ? t : $e(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }), this._value;
  }
  set value(t) {
    const n = this._rawValue, r = this.__v_isShallow || Tt(t) || rr(t);
    t = r ? t : U(t), Hn(t, n) && (this._rawValue = t, this._value = r ? t : $e(t), this.dep.trigger({
      target: this,
      type: "set",
      key: "value",
      newValue: t,
      oldValue: n
    }));
  }
}
function OD(e) {
  e.dep && e.dep.trigger({
    target: e,
    type: "set",
    key: "value",
    newValue: e._value
  });
}
function Rh(e) {
  return Fe(e) ? e.value : e;
}
function ED(e) {
  return Fo(e) ? e() : Rh(e);
}
const SD = {
  get: (e, t, n) => t === "__v_raw" ? e : Rh(Reflect.get(e, t, n)),
  set: (e, t, n, r) => {
    const i = e[t];
    return Fe(i) && !Fe(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
  }
};
function xD(e) {
  return si(e) ? e : new Proxy(e, SD);
}
class RD {
  constructor(t) {
    this.__v_isRef = !0, this._value = void 0;
    const n = this.dep = new Pu(), { get: r, set: i } = t(n.track.bind(n), n.trigger.bind(n));
    this._get = r, this._set = i;
  }
  get value() {
    return this._value = this._get();
  }
  set value(t) {
    this._set(t);
  }
}
function TD(e) {
  return new RD(e);
}
function $D(e) {
  xh(e) || bt("toRefs() expects a reactive object but received a plain one.");
  const t = Nn(e) ? new Array(e.length) : {};
  for (const n in e)
    t[n] = _w(e, n);
  return t;
}
class ND {
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
    return tD(U(this._object), this._key);
  }
}
class MD {
  constructor(t) {
    this._getter = t, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
function PD(e, t, n) {
  return Fe(e) ? e : Fo(e) ? new MD(e) : qi(e) && arguments.length > 1 ? _w(e, t, n) : pw(e);
}
function _w(e, t, n) {
  const r = e[t];
  return Fe(r) ? r : new ND(e, t, n);
}
class ID {
  constructor(t, n, r) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new Pu(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Bo - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = r;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    j !== this)
      return ew(this, !0), !0;
  }
  get value() {
    const t = this.dep.track({
      target: this,
      type: "get",
      key: "value"
    });
    return rw(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter ? this.setter(t) : bt("Write operation failed: computed value is readonly");
  }
}
function CD(e, t, n = !1) {
  let r, i;
  Fo(e) ? r = e : (r = e.get, i = e.set);
  const o = new ID(r, i, n);
  return t && !n && (o.onTrack = t.onTrack, o.onTrigger = t.onTrigger), o;
}
const DD = {
  GET: "get",
  HAS: "has",
  ITERATE: "iterate"
}, LD = {
  SET: "set",
  ADD: "add",
  DELETE: "delete",
  CLEAR: "clear"
}, FD = {
  SKIP: "__v_skip",
  IS_REACTIVE: "__v_isReactive",
  IS_READONLY: "__v_isReadonly",
  IS_SHALLOW: "__v_isShallow",
  RAW: "__v_raw",
  IS_REF: "__v_isRef"
}, jD = {
  WATCH_GETTER: 2,
  2: "WATCH_GETTER",
  WATCH_CALLBACK: 3,
  3: "WATCH_CALLBACK",
  WATCH_CLEANUP: 4,
  4: "WATCH_CLEANUP"
}, ks = {}, Ra = /* @__PURE__ */ new WeakMap();
let qn;
function BD() {
  return qn;
}
function vw(e, t = !1, n = qn) {
  if (n) {
    let r = Ra.get(n);
    r || Ra.set(n, r = []), r.push(e);
  } else t || bt(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function zD(e, t, n = D3) {
  const { immediate: r, deep: i, once: o, scheduler: s, augmentJob: a, call: u } = n, f = (A) => {
    (n.onWarn || bt)(
      "Invalid watch source: ",
      A,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, c = (A) => i ? A : Tt(A) || i === !1 || i === 0 ? Tn(A, 1) : Tn(A);
  let l, h, d, _, v = !1, g = !1;
  if (Fe(e) ? (h = () => e.value, v = Tt(e)) : si(e) ? (h = () => c(e), v = !0) : Nn(e) ? (g = !0, v = e.some((A) => si(A) || Tt(A)), h = () => e.map((A) => {
    if (Fe(A))
      return A.value;
    if (si(A))
      return c(A);
    if (Fo(A))
      return u ? u(A, 2) : A();
    f(A);
  })) : Fo(e) ? t ? h = u ? () => u(e, 2) : e : h = () => {
    if (d) {
      Ah();
      try {
        d();
      } finally {
        Oh();
      }
    }
    const A = qn;
    qn = l;
    try {
      return u ? u(e, 3, [_]) : e(_);
    } finally {
      qn = A;
    }
  } : (h = L3, f(e)), t && i) {
    const A = h, S = i === !0 ? 1 / 0 : i;
    h = () => Tn(A(), S);
  }
  const y = Z1(), b = () => {
    l.stop(), y && y.active && F3(y.effects, l);
  };
  if (o && t) {
    const A = t;
    t = (...S) => {
      A(...S), b();
    };
  }
  let w = g ? new Array(e.length).fill(ks) : ks;
  const m = (A) => {
    if (!(!(l.flags & 1) || !l.dirty && !A))
      if (t) {
        const S = l.run();
        if (i || v || (g ? S.some((P, fe) => Hn(P, w[fe])) : Hn(S, w))) {
          d && d();
          const P = qn;
          qn = l;
          try {
            const fe = [
              S,
              // pass undefined as the old value when it's changed for the first time
              w === ks ? void 0 : g && w[0] === ks ? [] : w,
              _
            ];
            w = S, u ? u(t, 3, fe) : (
              // @ts-expect-error
              t(...fe)
            );
          } finally {
            qn = P;
          }
        }
      } else
        l.run();
  };
  return a && a(m), l = new jo(h), l.scheduler = s ? () => s(m, !1) : m, _ = (A) => vw(A, !1, l), d = l.onStop = () => {
    const A = Ra.get(l);
    if (A) {
      if (u)
        u(A, 4);
      else
        for (const S of A) S();
      Ra.delete(l);
    }
  }, l.onTrack = n.onTrack, l.onTrigger = n.onTrigger, t ? r ? m(!0) : w = l.run() : s ? s(m.bind(null, !0), !0) : l.run(), b.pause = l.pause.bind(l), b.resume = l.resume.bind(l), b.stop = b, b;
}
function Tn(e, t = 1 / 0, n) {
  if (t <= 0 || !qi(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Set(), n.has(e)))
    return e;
  if (n.add(e), t--, Fe(e))
    Tn(e.value, t, n);
  else if (Nn(e))
    for (let r = 0; r < e.length; r++)
      Tn(e[r], t, n);
  else if (B3(e) || oi(e))
    e.forEach((r) => {
      Tn(r, t, n);
    });
  else if (V3(e)) {
    for (const r in e)
      Tn(e[r], t, n);
    for (const r of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, r) && Tn(e[r], t, n);
  }
  return e;
}
const UB = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ARRAY_ITERATE_KEY: wi,
  EffectFlags: K3,
  EffectScope: J1,
  ITERATE_KEY: Kn,
  MAP_KEY_ITERATE_KEY: Sa,
  ReactiveEffect: jo,
  ReactiveFlags: FD,
  TrackOpTypes: DD,
  TriggerOpTypes: LD,
  WatchErrorCodes: jD,
  computed: CD,
  customRef: TD,
  effect: X3,
  effectScope: G3,
  enableTracking: Z3,
  getCurrentScope: Z1,
  getCurrentWatcher: BD,
  isProxy: xh,
  isReactive: si,
  isReadonly: rr,
  isRef: Fe,
  isShallow: Tt,
  markRaw: mD,
  onEffectCleanup: Q3,
  onScopeDispose: H3,
  onWatcherCleanup: vw,
  pauseTracking: Ah,
  proxyRefs: xD,
  reactive: Eh,
  reactiveReadArray: yr,
  readonly: Sh,
  ref: pw,
  resetTracking: Oh,
  shallowReactive: yD,
  shallowReadArray: Iu,
  shallowReadonly: bD,
  shallowRef: wD,
  stop: J3,
  toRaw: U,
  toReactive: $e,
  toReadonly: xa,
  toRef: PD,
  toRefs: $D,
  toValue: ED,
  track: De,
  traverse: Tn,
  trigger: Rn,
  triggerRef: OD,
  unref: Rh,
  watch: zD
}, Symbol.toStringTag, { value: "Module" })), UD = Symbol.for("preact-signals"), tn = 1, Ai = 2, zo = 4, Wi = 8, ia = 16, Oi = 32;
function Lu() {
  vo++;
}
function Fu() {
  if (vo > 1) {
    vo--;
    return;
  }
  let e, t = !1;
  for (; _o !== void 0; ) {
    let n = _o;
    for (_o = void 0, lc++; n !== void 0; ) {
      const r = n._nextBatchedEffect;
      if (n._nextBatchedEffect = void 0, n._flags &= ~Ai, !(n._flags & Wi) && yw(n))
        try {
          n._callback();
        } catch (i) {
          t || (e = i, t = !0);
        }
      n = r;
    }
  }
  if (lc = 0, vo--, t)
    throw e;
}
function VD(e) {
  if (vo > 0)
    return e();
  Lu();
  try {
    return e();
  } finally {
    Fu();
  }
}
let W;
function qD(e) {
  const t = W;
  W = void 0;
  try {
    return e();
  } finally {
    W = t;
  }
}
let _o, vo = 0, lc = 0, Ta = 0;
function gw(e) {
  if (W === void 0)
    return;
  let t = e._node;
  if (t === void 0 || t._target !== W)
    return t = {
      _version: 0,
      _source: e,
      _prevSource: W._sources,
      _nextSource: void 0,
      _target: W,
      _prevTarget: void 0,
      _nextTarget: void 0,
      _rollbackNode: t
    }, W._sources !== void 0 && (W._sources._nextSource = t), W._sources = t, e._node = t, W._flags & Oi && e._subscribe(t), t;
  if (t._version === -1)
    return t._version = 0, t._nextSource !== void 0 && (t._nextSource._prevSource = t._prevSource, t._prevSource !== void 0 && (t._prevSource._nextSource = t._nextSource), t._prevSource = W._sources, t._nextSource = void 0, W._sources._nextSource = t, W._sources = t), t;
}
function Ce(e) {
  this._value = e, this._version = 0, this._node = void 0, this._targets = void 0;
}
Ce.prototype.brand = UD;
Ce.prototype._refresh = function() {
  return !0;
};
Ce.prototype._subscribe = function(e) {
  this._targets !== e && e._prevTarget === void 0 && (e._nextTarget = this._targets, this._targets !== void 0 && (this._targets._prevTarget = e), this._targets = e);
};
Ce.prototype._unsubscribe = function(e) {
  if (this._targets !== void 0) {
    const t = e._prevTarget, n = e._nextTarget;
    t !== void 0 && (t._nextTarget = n, e._prevTarget = void 0), n !== void 0 && (n._prevTarget = t, e._nextTarget = void 0), e === this._targets && (this._targets = n);
  }
};
Ce.prototype.subscribe = function(e) {
  return Aw(() => {
    const t = this.value, n = W;
    W = void 0;
    try {
      e(t);
    } finally {
      W = n;
    }
  });
};
Ce.prototype.valueOf = function() {
  return this.value;
};
Ce.prototype.toString = function() {
  return this.value + "";
};
Ce.prototype.toJSON = function() {
  return this.value;
};
Ce.prototype.peek = function() {
  const e = W;
  W = void 0;
  try {
    return this.value;
  } finally {
    W = e;
  }
};
Object.defineProperty(Ce.prototype, "value", {
  get() {
    const e = gw(this);
    return e !== void 0 && (e._version = this._version), this._value;
  },
  set(e) {
    if (e !== this._value) {
      if (lc > 100)
        throw new Error("Cycle detected");
      this._value = e, this._version++, Ta++, Lu();
      try {
        for (let t = this._targets; t !== void 0; t = t._nextTarget)
          t._target._notify();
      } finally {
        Fu();
      }
    }
  }
});
function WD(e) {
  return new Ce(e);
}
function yw(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource)
    if (t._source._version !== t._version || !t._source._refresh() || t._source._version !== t._version)
      return !0;
  return !1;
}
function bw(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource) {
    const n = t._source._node;
    if (n !== void 0 && (t._rollbackNode = n), t._source._node = t, t._version = -1, t._nextSource === void 0) {
      e._sources = t;
      break;
    }
  }
}
function mw(e) {
  let t = e._sources, n;
  for (; t !== void 0; ) {
    const r = t._prevSource;
    t._version === -1 ? (t._source._unsubscribe(t), r !== void 0 && (r._nextSource = t._nextSource), t._nextSource !== void 0 && (t._nextSource._prevSource = r)) : n = t, t._source._node = t._rollbackNode, t._rollbackNode !== void 0 && (t._rollbackNode = void 0), t = r;
  }
  e._sources = n;
}
function qr(e) {
  Ce.call(this, void 0), this._fn = e, this._sources = void 0, this._globalVersion = Ta - 1, this._flags = zo;
}
qr.prototype = new Ce();
qr.prototype._refresh = function() {
  if (this._flags &= ~Ai, this._flags & tn)
    return !1;
  if ((this._flags & (zo | Oi)) === Oi || (this._flags &= ~zo, this._globalVersion === Ta))
    return !0;
  if (this._globalVersion = Ta, this._flags |= tn, this._version > 0 && !yw(this))
    return this._flags &= ~tn, !0;
  const e = W;
  try {
    bw(this), W = this;
    const t = this._fn();
    (this._flags & ia || this._value !== t || this._version === 0) && (this._value = t, this._flags &= ~ia, this._version++);
  } catch (t) {
    this._value = t, this._flags |= ia, this._version++;
  }
  return W = e, mw(this), this._flags &= ~tn, !0;
};
qr.prototype._subscribe = function(e) {
  if (this._targets === void 0) {
    this._flags |= zo | Oi;
    for (let t = this._sources; t !== void 0; t = t._nextSource)
      t._source._subscribe(t);
  }
  Ce.prototype._subscribe.call(this, e);
};
qr.prototype._unsubscribe = function(e) {
  if (this._targets !== void 0 && (Ce.prototype._unsubscribe.call(this, e), this._targets === void 0)) {
    this._flags &= ~Oi;
    for (let t = this._sources; t !== void 0; t = t._nextSource)
      t._source._unsubscribe(t);
  }
};
qr.prototype._notify = function() {
  if (!(this._flags & Ai)) {
    this._flags |= zo | Ai;
    for (let e = this._targets; e !== void 0; e = e._nextTarget)
      e._target._notify();
  }
};
Object.defineProperty(qr.prototype, "value", {
  get() {
    if (this._flags & tn)
      throw new Error("Cycle detected");
    const e = gw(this);
    if (this._refresh(), e !== void 0 && (e._version = this._version), this._flags & ia)
      throw this._value;
    return this._value;
  }
});
function kD(e) {
  return new qr(e);
}
function ww(e) {
  const t = e._cleanup;
  if (e._cleanup = void 0, typeof t == "function") {
    Lu();
    const n = W;
    W = void 0;
    try {
      t();
    } catch (r) {
      throw e._flags &= ~tn, e._flags |= Wi, Th(e), r;
    } finally {
      W = n, Fu();
    }
  }
}
function Th(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource)
    t._source._unsubscribe(t);
  e._fn = void 0, e._sources = void 0, ww(e);
}
function GD(e) {
  if (W !== this)
    throw new Error("Out-of-order effect");
  mw(this), W = e, this._flags &= ~tn, this._flags & Wi && Th(this), Fu();
}
function As(e) {
  this._fn = e, this._cleanup = void 0, this._sources = void 0, this._nextBatchedEffect = void 0, this._flags = Oi;
}
As.prototype._callback = function() {
  const e = this._start();
  try {
    if (this._flags & Wi || this._fn === void 0) return;
    const t = this._fn();
    typeof t == "function" && (this._cleanup = t);
  } finally {
    e();
  }
};
As.prototype._start = function() {
  if (this._flags & tn)
    throw new Error("Cycle detected");
  this._flags |= tn, this._flags &= ~Wi, ww(this), bw(this), Lu();
  const e = W;
  return W = this, GD.bind(this, e);
};
As.prototype._notify = function() {
  this._flags & Ai || (this._flags |= Ai, this._nextBatchedEffect = _o, _o = this);
};
As.prototype._dispose = function() {
  this._flags |= Wi, this._flags & tn || Th(this);
};
function Aw(e) {
  const t = new As(e);
  try {
    t._callback();
  } catch (n) {
    throw t._dispose(), n;
  }
  return t._dispose.bind(t);
}
const VB = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Signal: Ce,
  batch: VD,
  computed: kD,
  effect: Aw,
  signal: WD,
  untracked: qD
}, Symbol.toStringTag, { value: "Module" })), zd = typeof Symbol == "function" && Symbol.observable || "@@observable", mf = () => Math.random().toString(36).substring(7).split("").join("."), Yn = {
  INIT: `@@redux/INIT${/* @__PURE__ */ mf()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ mf()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${mf()}`
};
function ju(e) {
  if (typeof e != "object" || e === null) return !1;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function HD(e) {
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
  if (XD(e)) return "date";
  if (YD(e)) return "error";
  const n = KD(e);
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
function KD(e) {
  return typeof e.constructor == "function" ? e.constructor.name : null;
}
function YD(e) {
  return e instanceof Error || typeof e.message == "string" && e.constructor && typeof e.constructor.stackTraceLimit == "number";
}
function XD(e) {
  return e instanceof Date ? !0 : typeof e.toDateString == "function" && typeof e.getDate == "function" && typeof e.setDate == "function";
}
function Sn(e) {
  let t = typeof e;
  return process.env.NODE_ENV !== "production" && (t = HD(e)), t;
}
function $h(e, t, n) {
  if (typeof e != "function")
    throw new Error(
      `Expected the root reducer to be a function. Instead, received: '${Sn(
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
        `Expected the enhancer to be a function. Instead, received: '${Sn(
          n
        )}'`
      );
    return n($h)(
      e,
      t
    );
  }
  let r = e, i = t, o = /* @__PURE__ */ new Map(), s = o, a = 0, u = !1;
  function f() {
    s === o && (s = /* @__PURE__ */ new Map(), o.forEach((g, y) => {
      s.set(y, g);
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
        `Expected the listener to be a function. Instead, received: '${Sn(
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
    return s.set(b, g), function() {
      if (y) {
        if (u)
          throw new Error(
            "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details."
          );
        y = !1, f(), s.delete(b), o = null;
      }
    };
  }
  function h(g) {
    if (!ju(g))
      throw new Error(
        `Actions must be plain objects. Instead, the actual type was: '${Sn(
          g
        )}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`
      );
    if (typeof g.type > "u")
      throw new Error(
        'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.'
      );
    if (typeof g.type != "string")
      throw new Error(
        `Action "type" property must be a string. Instead, the actual type was: '${Sn(
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
    return (o = s).forEach((b) => {
      b();
    }), g;
  }
  function d(g) {
    if (typeof g != "function")
      throw new Error(
        `Expected the nextReducer to be a function. Instead, received: '${Sn(
          g
        )}`
      );
    r = g, h({ type: Yn.REPLACE });
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
            `Expected the observer to be an object. Instead, received: '${Sn(
              y
            )}'`
          );
        function b() {
          const m = y;
          m.next && m.next(c());
        }
        return b(), { unsubscribe: g(b) };
      },
      [zd]() {
        return this;
      }
    };
  }
  return h({ type: Yn.INIT }), {
    dispatch: h,
    subscribe: l,
    getState: c,
    replaceReducer: d,
    [zd]: _
  };
}
function JD(e, t, n) {
  return $h(e, t, n);
}
function Ud(e) {
  typeof console < "u" && typeof console.error == "function" && console.error(e);
  try {
    throw new Error(e);
  } catch {
  }
}
function ZD(e, t, n, r) {
  const i = Object.keys(t), o = n && n.type === Yn.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
  if (i.length === 0)
    return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
  if (!ju(e))
    return `The ${o} has unexpected type of "${Sn(
      e
    )}". Expected argument to be an object with the following keys: "${i.join('", "')}"`;
  const s = Object.keys(e).filter(
    (a) => !t.hasOwnProperty(a) && !r[a]
  );
  if (s.forEach((a) => {
    r[a] = !0;
  }), !(n && n.type === Yn.REPLACE) && s.length > 0)
    return `Unexpected ${s.length > 1 ? "keys" : "key"} "${s.join('", "')}" found in ${o}. Expected to find one of the known reducer keys instead: "${i.join('", "')}". Unexpected keys will be ignored.`;
}
function QD(e) {
  Object.keys(e).forEach((t) => {
    const n = e[t];
    if (typeof n(void 0, { type: Yn.INIT }) > "u")
      throw new Error(
        `The slice reducer for key "${t}" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`
      );
    if (typeof n(void 0, {
      type: Yn.PROBE_UNKNOWN_ACTION()
    }) > "u")
      throw new Error(
        `The slice reducer for key "${t}" returned undefined when probed with a random type. Don't try to handle '${Yn.INIT}' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.`
      );
  });
}
function eL(e) {
  const t = Object.keys(e), n = {};
  for (let s = 0; s < t.length; s++) {
    const a = t[s];
    process.env.NODE_ENV !== "production" && typeof e[a] > "u" && Ud(`No reducer provided for key "${a}"`), typeof e[a] == "function" && (n[a] = e[a]);
  }
  const r = Object.keys(n);
  let i;
  process.env.NODE_ENV !== "production" && (i = {});
  let o;
  try {
    QD(n);
  } catch (s) {
    o = s;
  }
  return function(a = {}, u) {
    if (o)
      throw o;
    if (process.env.NODE_ENV !== "production") {
      const l = ZD(
        a,
        n,
        u,
        i
      );
      l && Ud(l);
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
function Vd(e, t) {
  return function(...n) {
    return t(e.apply(this, n));
  };
}
function tL(e, t) {
  if (typeof e == "function")
    return Vd(e, t);
  if (typeof e != "object" || e === null)
    throw new Error(
      `bindActionCreators expected an object or a function, but instead received: '${Sn(
        e
      )}'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    );
  const n = {};
  for (const r in e) {
    const i = e[r];
    typeof i == "function" && (n[r] = Vd(i, t));
  }
  return n;
}
function Ow(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce(
    (t, n) => (...r) => t(n(...r))
  );
}
function nL(...e) {
  return (t) => (n, r) => {
    const i = t(n, r);
    let o = () => {
      throw new Error(
        "Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch."
      );
    };
    const s = {
      getState: i.getState,
      dispatch: (u, ...f) => o(u, ...f)
    }, a = e.map((u) => u(s));
    return o = Ow(...a)(i.dispatch), {
      ...i,
      dispatch: o
    };
  };
}
function rL(e) {
  return ju(e) && "type" in e && typeof e.type == "string";
}
const qB = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  __DO_NOT_USE__ActionTypes: Yn,
  applyMiddleware: nL,
  bindActionCreators: tL,
  combineReducers: eL,
  compose: Ow,
  createStore: $h,
  isAction: rL,
  isPlainObject: ju,
  legacy_createStore: JD
}, Symbol.toStringTag, { value: "Module" }));
var iL = {
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
}, oL = process.env.NODE_ENV !== "production" ? iL : {};
function E(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
    n[r - 1] = arguments[r];
  if (process.env.NODE_ENV !== "production") {
    var i = typeof e == "string" ? e : oL[e];
    throw typeof i == "function" && (i = i.apply(null, n)), new Error("[MobX] " + i);
  }
  throw new Error(typeof e == "number" ? "[MobX] minified error nr: " + e + (n.length ? " " + n.map(String).join(",") : "") + ". Find the full error at: https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/errors.ts" : "[MobX] " + e);
}
var sL = {};
function Bu() {
  return typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : sL;
}
var Ew = Object.assign, $a = Object.getOwnPropertyDescriptor, on = Object.defineProperty, Os = Object.prototype, Na = [];
Object.freeze(Na);
var Nh = {};
Object.freeze(Nh);
var aL = typeof Proxy < "u", uL = /* @__PURE__ */ Object.toString();
function Sw() {
  aL || E(process.env.NODE_ENV !== "production" ? "`Proxy` objects are not available in the current environment. Please configure MobX to enable a fallback implementation.`" : "Proxy not available");
}
function to(e) {
  process.env.NODE_ENV !== "production" && O.verifyProxies && E("MobX is currently configured to be able to run in ES5 mode, but in ES5 MobX won't be able to " + e);
}
function mt() {
  return ++O.mobxGuid;
}
function Mh(e) {
  var t = !1;
  return function() {
    if (!t)
      return t = !0, e.apply(this, arguments);
  };
}
var Qr = function() {
};
function oe(e) {
  return typeof e == "function";
}
function un(e) {
  var t = typeof e;
  switch (t) {
    case "string":
    case "symbol":
    case "number":
      return !0;
  }
  return !1;
}
function zu(e) {
  return e !== null && typeof e == "object";
}
function Ze(e) {
  if (!zu(e))
    return !1;
  var t = Object.getPrototypeOf(e);
  if (t == null)
    return !0;
  var n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return typeof n == "function" && n.toString() === uL;
}
function xw(e) {
  var t = e?.constructor;
  return t ? t.name === "GeneratorFunction" || t.displayName === "GeneratorFunction" : !1;
}
function Es(e, t, n) {
  on(e, t, {
    enumerable: !1,
    writable: !0,
    configurable: !0,
    value: n
  });
}
function Rw(e, t, n) {
  on(e, t, {
    enumerable: !1,
    writable: !1,
    configurable: !0,
    value: n
  });
}
function hr(e, t) {
  var n = "isMobX" + e;
  return t.prototype[n] = !0, function(r) {
    return zu(r) && r[n] === !0;
  };
}
function ki(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Map]";
}
function fL(e) {
  var t = Object.getPrototypeOf(e), n = Object.getPrototypeOf(t), r = Object.getPrototypeOf(n);
  return r === null;
}
function $n(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Set]";
}
var Tw = typeof Object.getOwnPropertySymbols < "u";
function cL(e) {
  var t = Object.keys(e);
  if (!Tw)
    return t;
  var n = Object.getOwnPropertySymbols(e);
  return n.length ? [].concat(t, n.filter(function(r) {
    return Os.propertyIsEnumerable.call(e, r);
  })) : t;
}
var Ei = typeof Reflect < "u" && Reflect.ownKeys ? Reflect.ownKeys : Tw ? function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : (
  /* istanbul ignore next */
  Object.getOwnPropertyNames
);
function hc(e) {
  return typeof e == "string" ? e : typeof e == "symbol" ? e.toString() : new String(e).toString();
}
function $w(e) {
  return e === null ? null : typeof e == "object" ? "" + e : e;
}
function ft(e, t) {
  return Os.hasOwnProperty.call(e, t);
}
var lL = Object.getOwnPropertyDescriptors || function(t) {
  var n = {};
  return Ei(t).forEach(function(r) {
    n[r] = $a(t, r);
  }), n;
};
function it(e, t) {
  return !!(e & t);
}
function ot(e, t, n) {
  return n ? e |= t : e &= ~t, e;
}
function qd(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function hL(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, dL(r.key), r);
  }
}
function Gi(e, t, n) {
  return t && hL(e.prototype, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function ei(e, t) {
  var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n) return (n = n.call(e)).next.bind(n);
  if (Array.isArray(e) || (n = _L(e)) || t) {
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
function fn() {
  return fn = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, fn.apply(null, arguments);
}
function Nw(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, pc(e, t);
}
function pc(e, t) {
  return pc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, r) {
    return n.__proto__ = r, n;
  }, pc(e, t);
}
function pL(e, t) {
  if (typeof e != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function dL(e) {
  var t = pL(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function _L(e, t) {
  if (e) {
    if (typeof e == "string") return qd(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? qd(e, t) : void 0;
  }
}
var Ke = /* @__PURE__ */ Symbol("mobx-stored-annotations");
function qt(e) {
  function t(n, r) {
    if (xs(r))
      return e.decorate_20223_(n, r);
    Ss(n, r, e);
  }
  return Object.assign(t, e);
}
function Ss(e, t, n) {
  if (ft(e, Ke) || Es(e, Ke, fn({}, e[Ke])), process.env.NODE_ENV !== "production" && Ma(n) && !ft(e[Ke], t)) {
    var r = e.constructor.name + ".prototype." + t.toString();
    E("'" + r + "' is decorated with 'override', but no such decorated member was found on prototype.");
  }
  vL(e, n, t), Ma(n) || (e[Ke][t] = n);
}
function vL(e, t, n) {
  if (process.env.NODE_ENV !== "production" && !Ma(t) && ft(e[Ke], n)) {
    var r = e.constructor.name + ".prototype." + n.toString(), i = e[Ke][n].annotationType_, o = t.annotationType_;
    E("Cannot apply '@" + o + "' to '" + r + "':" + (`
The field is already decorated with '@` + i + "'.") + `
Re-decorating fields is not allowed.
Use '@override' decorator for methods overridden by subclass.`);
  }
}
function gL(e) {
  return ft(e, Ke) || Es(e, Ke, fn({}, e[Ke])), e[Ke];
}
function xs(e) {
  return typeof e == "object" && typeof e.kind == "string";
}
function Uu(e, t) {
  process.env.NODE_ENV !== "production" && !t.includes(e.kind) && E("The decorator applied to '" + String(e.name) + "' cannot be used on a " + e.kind + " element");
}
var R = /* @__PURE__ */ Symbol("mobx administration"), pr = /* @__PURE__ */ function() {
  function e(n) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "Atom@" + mt() : "Atom"), this.name_ = void 0, this.flags_ = 0, this.observers_ = /* @__PURE__ */ new Set(), this.lastAccessedBy_ = 0, this.lowestObserverState_ = B.NOT_TRACKING_, this.onBOL = void 0, this.onBUOL = void 0, this.name_ = n;
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
    return Kw(this);
  }, t.reportChanged = function() {
    Ye(), Yw(this), Xe();
  }, t.toString = function() {
    return this.name_;
  }, Gi(e, [{
    key: "isBeingObserved",
    get: function() {
      return it(this.flags_, e.isBeingObservedMask_);
    },
    set: function(r) {
      this.flags_ = ot(this.flags_, e.isBeingObservedMask_, r);
    }
  }, {
    key: "isPendingUnobservation",
    get: function() {
      return it(this.flags_, e.isPendingUnobservationMask_);
    },
    set: function(r) {
      this.flags_ = ot(this.flags_, e.isPendingUnobservationMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return it(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = ot(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
pr.isBeingObservedMask_ = 1;
pr.isPendingUnobservationMask_ = 2;
pr.diffValueMask_ = 4;
var Ph = /* @__PURE__ */ hr("Atom", pr);
function Ih(e, t, n) {
  t === void 0 && (t = Qr), n === void 0 && (n = Qr);
  var r = new pr(e);
  return t !== Qr && iA(r, t), n !== Qr && zh(r, n), r;
}
function yL(e, t) {
  return e === t;
}
function bL(e, t) {
  return Gh(e, t);
}
function mL(e, t) {
  return Gh(e, t, 1);
}
function wL(e, t) {
  return Object.is ? Object.is(e, t) : e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
var Sr = {
  identity: yL,
  structural: bL,
  default: wL,
  shallow: mL
};
function xr(e, t, n) {
  return Mr(e) ? e : Array.isArray(e) ? ye.array(e, {
    name: n
  }) : Ze(e) ? ye.object(e, void 0, {
    name: n
  }) : ki(e) ? ye.map(e, {
    name: n
  }) : $n(e) ? ye.set(e, {
    name: n
  }) : typeof e == "function" && !$r(e) && !xi(e) ? xw(e) ? Nr(e) : Si(n, e) : e;
}
function AL(e, t, n) {
  if (e == null || he(e) || Ge(e) || _e(e) || le(e))
    return e;
  if (Array.isArray(e))
    return ye.array(e, {
      name: n,
      deep: !1
    });
  if (Ze(e))
    return ye.object(e, void 0, {
      name: n,
      deep: !1
    });
  if (ki(e))
    return ye.map(e, {
      name: n,
      deep: !1
    });
  if ($n(e))
    return ye.set(e, {
      name: n,
      deep: !1
    });
  process.env.NODE_ENV !== "production" && E("The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
}
function Vu(e) {
  return e;
}
function OL(e, t) {
  return process.env.NODE_ENV !== "production" && Mr(e) && E("observable.struct should not be used with observable values"), Gh(e, t) ? t : e;
}
var Mw = "override", EL = /* @__PURE__ */ qt({
  annotationType_: Mw,
  make_: SL,
  extend_: xL,
  decorate_20223_: RL
});
function Ma(e) {
  return e.annotationType_ === Mw;
}
function SL(e, t) {
  return process.env.NODE_ENV !== "production" && e.isPlainObject_ && E("Cannot apply '" + this.annotationType_ + "' to '" + e.name_ + "." + t.toString() + "':" + (`
'` + this.annotationType_ + "' cannot be used on plain objects.")), process.env.NODE_ENV !== "production" && !ft(e.appliedAnnotations_, t) && E("'" + e.name_ + "." + t.toString() + "' is annotated with '" + this.annotationType_ + "', but no such annotated member was found on prototype."), 0;
}
function xL(e, t, n, r) {
  E("'" + this.annotationType_ + "' can only be used with 'makeObservable'");
}
function RL(e, t) {
  console.warn("'" + this.annotationType_ + "' cannot be used with decorators - this is a no-op");
}
function Rs(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: TL,
    extend_: $L,
    decorate_20223_: NL
  };
}
function TL(e, t, n, r) {
  var i;
  if ((i = this.options_) != null && i.bound)
    return this.extend_(e, t, n, !1) === null ? 0 : 1;
  if (r === e.target_)
    return this.extend_(e, t, n, !1) === null ? 0 : 2;
  if ($r(n.value))
    return 1;
  var o = Pw(e, this, t, n, !1);
  return on(r, t, o), 2;
}
function $L(e, t, n, r) {
  var i = Pw(e, this, t, n);
  return e.defineProperty_(t, i, r);
}
function NL(e, t) {
  process.env.NODE_ENV !== "production" && Uu(t, ["method", "field"]);
  var n = t.kind, r = t.name, i = t.addInitializer, o = this, s = function(f) {
    var c, l, h, d;
    return ir((c = (l = o.options_) == null ? void 0 : l.name) != null ? c : r.toString(), f, (h = (d = o.options_) == null ? void 0 : d.autoAction) != null ? h : !1);
  };
  if (n == "field")
    return function(u) {
      var f, c = u;
      return $r(c) || (c = s(c)), (f = o.options_) != null && f.bound && (c = c.bind(this), c.isMobxAction = !0), c;
    };
  if (n == "method") {
    var a;
    return $r(e) || (e = s(e)), (a = this.options_) != null && a.bound && i(function() {
      var u = this, f = u[r].bind(u);
      f.isMobxAction = !0, u[r] = f;
    }), e;
  }
  E("Cannot apply '" + o.annotationType_ + "' to '" + String(r) + "' (kind: " + n + "):" + (`
'` + o.annotationType_ + "' can only be used on properties with a function value."));
}
function ML(e, t, n, r) {
  var i = t.annotationType_, o = r.value;
  process.env.NODE_ENV !== "production" && !oe(o) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on properties with a function value."));
}
function Pw(e, t, n, r, i) {
  var o, s, a, u, f, c, l;
  i === void 0 && (i = O.safeDescriptors), ML(e, t, n, r);
  var h = r.value;
  if ((o = t.options_) != null && o.bound) {
    var d;
    h = h.bind((d = e.proxy_) != null ? d : e.target_);
  }
  return {
    value: ir(
      (s = (a = t.options_) == null ? void 0 : a.name) != null ? s : n.toString(),
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
function Iw(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: PL,
    extend_: IL,
    decorate_20223_: CL
  };
}
function PL(e, t, n, r) {
  var i;
  if (r === e.target_)
    return this.extend_(e, t, n, !1) === null ? 0 : 2;
  if ((i = this.options_) != null && i.bound && (!ft(e.target_, t) || !xi(e.target_[t])) && this.extend_(e, t, n, !1) === null)
    return 0;
  if (xi(n.value))
    return 1;
  var o = Cw(e, this, t, n, !1, !1);
  return on(r, t, o), 2;
}
function IL(e, t, n, r) {
  var i, o = Cw(e, this, t, n, (i = this.options_) == null ? void 0 : i.bound);
  return e.defineProperty_(t, o, r);
}
function CL(e, t) {
  var n;
  process.env.NODE_ENV !== "production" && Uu(t, ["method"]);
  var r = t.name, i = t.addInitializer;
  return xi(e) || (e = Nr(e)), (n = this.options_) != null && n.bound && i(function() {
    var o = this, s = o[r].bind(o);
    s.isMobXFlow = !0, o[r] = s;
  }), e;
}
function DL(e, t, n, r) {
  var i = t.annotationType_, o = r.value;
  process.env.NODE_ENV !== "production" && !oe(o) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on properties with a generator function value."));
}
function Cw(e, t, n, r, i, o) {
  o === void 0 && (o = O.safeDescriptors), DL(e, t, n, r);
  var s = r.value;
  if (xi(s) || (s = Nr(s)), i) {
    var a;
    s = s.bind((a = e.proxy_) != null ? a : e.target_), s.isMobXFlow = !0;
  }
  return {
    value: s,
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: o ? e.isPlainObject_ : !0,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: !1,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: !o
  };
}
function Ch(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: LL,
    extend_: FL,
    decorate_20223_: jL
  };
}
function LL(e, t, n) {
  return this.extend_(e, t, n, !1) === null ? 0 : 1;
}
function FL(e, t, n, r) {
  return BL(e, this, t, n), e.defineComputedProperty_(t, fn({}, this.options_, {
    get: n.get,
    set: n.set
  }), r);
}
function jL(e, t) {
  process.env.NODE_ENV !== "production" && Uu(t, ["getter"]);
  var n = this, r = t.name, i = t.addInitializer;
  return i(function() {
    var o = kr(this)[R], s = fn({}, n.options_, {
      get: e,
      context: this
    });
    s.name || (s.name = process.env.NODE_ENV !== "production" ? o.name_ + "." + r.toString() : "ObservableObject." + r.toString()), o.values_.set(r, new It(s));
  }), function() {
    return this[R].getObservablePropValue_(r);
  };
}
function BL(e, t, n, r) {
  var i = t.annotationType_, o = r.get;
  process.env.NODE_ENV !== "production" && !o && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on getter(+setter) properties."));
}
function qu(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: zL,
    extend_: UL,
    decorate_20223_: VL
  };
}
function zL(e, t, n) {
  return this.extend_(e, t, n, !1) === null ? 0 : 1;
}
function UL(e, t, n, r) {
  var i, o;
  return qL(e, this, t, n), e.defineObservableProperty_(t, n.value, (i = (o = this.options_) == null ? void 0 : o.enhancer) != null ? i : xr, r);
}
function VL(e, t) {
  if (process.env.NODE_ENV !== "production") {
    if (t.kind === "field")
      throw E("Please use `@observable accessor " + String(t.name) + "` instead of `@observable " + String(t.name) + "`");
    Uu(t, ["accessor"]);
  }
  var n = this, r = t.kind, i = t.name, o = /* @__PURE__ */ new WeakSet();
  function s(a, u) {
    var f, c, l = kr(a)[R], h = new Xn(u, (f = (c = n.options_) == null ? void 0 : c.enhancer) != null ? f : xr, process.env.NODE_ENV !== "production" ? l.name_ + "." + i.toString() : "ObservableObject." + i.toString(), !1);
    l.values_.set(i, h), o.add(a);
  }
  if (r == "accessor")
    return {
      get: function() {
        return o.has(this) || s(this, e.get.call(this)), this[R].getObservablePropValue_(i);
      },
      set: function(u) {
        return o.has(this) || s(this, u), this[R].setObservablePropValue_(i, u);
      },
      init: function(u) {
        return o.has(this) || s(this, u), u;
      }
    };
}
function qL(e, t, n, r) {
  var i = t.annotationType_;
  process.env.NODE_ENV !== "production" && !("value" in r) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' cannot be used on getter/setter properties"));
}
var WL = "true", kL = /* @__PURE__ */ Dw();
function Dw(e) {
  return {
    annotationType_: WL,
    options_: e,
    make_: GL,
    extend_: HL,
    decorate_20223_: KL
  };
}
function GL(e, t, n, r) {
  var i, o;
  if (n.get)
    return Ts.make_(e, t, n, r);
  if (n.set) {
    var s = ir(t.toString(), n.set);
    return r === e.target_ ? e.defineProperty_(t, {
      configurable: O.safeDescriptors ? e.isPlainObject_ : !0,
      set: s
    }) === null ? 0 : 2 : (on(r, t, {
      configurable: !0,
      set: s
    }), 2);
  }
  if (r !== e.target_ && typeof n.value == "function") {
    var a;
    if (xw(n.value)) {
      var u, f = (u = this.options_) != null && u.autoBind ? Nr.bound : Nr;
      return f.make_(e, t, n, r);
    }
    var c = (a = this.options_) != null && a.autoBind ? Si.bound : Si;
    return c.make_(e, t, n, r);
  }
  var l = ((i = this.options_) == null ? void 0 : i.deep) === !1 ? ye.ref : ye;
  if (typeof n.value == "function" && (o = this.options_) != null && o.autoBind) {
    var h;
    n.value = n.value.bind((h = e.proxy_) != null ? h : e.target_);
  }
  return l.make_(e, t, n, r);
}
function HL(e, t, n, r) {
  var i, o;
  if (n.get)
    return Ts.extend_(e, t, n, r);
  if (n.set)
    return e.defineProperty_(t, {
      configurable: O.safeDescriptors ? e.isPlainObject_ : !0,
      set: ir(t.toString(), n.set)
    }, r);
  if (typeof n.value == "function" && (i = this.options_) != null && i.autoBind) {
    var s;
    n.value = n.value.bind((s = e.proxy_) != null ? s : e.target_);
  }
  var a = ((o = this.options_) == null ? void 0 : o.deep) === !1 ? ye.ref : ye;
  return a.extend_(e, t, n, r);
}
function KL(e, t) {
  E("'" + this.annotationType_ + "' cannot be used as a decorator");
}
var YL = "observable", XL = "observable.ref", JL = "observable.shallow", ZL = "observable.struct", Lw = {
  deep: !0,
  name: void 0,
  defaultDecorator: void 0,
  proxy: !0
};
Object.freeze(Lw);
function Gs(e) {
  return e || Lw;
}
var dc = /* @__PURE__ */ qu(YL), QL = /* @__PURE__ */ qu(XL, {
  enhancer: Vu
}), eF = /* @__PURE__ */ qu(JL, {
  enhancer: AL
}), tF = /* @__PURE__ */ qu(ZL, {
  enhancer: OL
}), Fw = /* @__PURE__ */ qt(dc);
function Hs(e) {
  return e.deep === !0 ? xr : e.deep === !1 ? Vu : rF(e.defaultDecorator);
}
function nF(e) {
  var t;
  return e ? (t = e.defaultDecorator) != null ? t : Dw(e) : void 0;
}
function rF(e) {
  var t, n;
  return e && (t = (n = e.options_) == null ? void 0 : n.enhancer) != null ? t : xr;
}
function jw(e, t, n) {
  if (xs(t))
    return dc.decorate_20223_(e, t);
  if (un(t)) {
    Ss(e, t, dc);
    return;
  }
  return Mr(e) ? e : Ze(e) ? ye.object(e, t, n) : Array.isArray(e) ? ye.array(e, t) : ki(e) ? ye.map(e, t) : $n(e) ? ye.set(e, t) : typeof e == "object" && e !== null ? e : ye.box(e, t);
}
Ew(jw, Fw);
var iF = {
  box: function(t, n) {
    var r = Gs(n);
    return new Xn(t, Hs(r), r.name, !0, r.equals);
  },
  array: function(t, n) {
    var r = Gs(n);
    return (O.useProxies === !1 || r.proxy === !1 ? xj : vj)(t, Hs(r), r.name);
  },
  map: function(t, n) {
    var r = Gs(n);
    return new qh(t, Hs(r), r.name);
  },
  set: function(t, n) {
    var r = Gs(n);
    return new Wh(t, Hs(r), r.name);
  },
  object: function(t, n, r) {
    return dr(function() {
      return Uh(O.useProxies === !1 || r?.proxy === !1 ? kr({}, r) : lj({}, r), t, n);
    });
  },
  ref: /* @__PURE__ */ qt(QL),
  shallow: /* @__PURE__ */ qt(eF),
  deep: Fw,
  struct: /* @__PURE__ */ qt(tF)
}, ye = /* @__PURE__ */ Ew(jw, iF), Bw = "computed", oF = "computed.struct", _c = /* @__PURE__ */ Ch(Bw), sF = /* @__PURE__ */ Ch(oF, {
  equals: Sr.structural
}), Ts = function(t, n) {
  if (xs(n))
    return _c.decorate_20223_(t, n);
  if (un(n))
    return Ss(t, n, _c);
  if (Ze(t))
    return qt(Ch(Bw, t));
  process.env.NODE_ENV !== "production" && (oe(t) || E("First argument to `computed` should be an expression."), oe(n) && E("A setter as second argument is no longer supported, use `{ set: fn }` option instead"));
  var r = Ze(n) ? n : {};
  return r.get = t, r.name || (r.name = t.name || ""), new It(r);
};
Object.assign(Ts, _c);
Ts.struct = /* @__PURE__ */ qt(sF);
var Wd, kd, Pa = 0, aF = 1, uF = (Wd = (kd = /* @__PURE__ */ $a(function() {
}, "name")) == null ? void 0 : kd.configurable) != null ? Wd : !1, Gd = {
  value: "action",
  configurable: !0,
  writable: !1,
  enumerable: !1
};
function ir(e, t, n, r) {
  n === void 0 && (n = !1), process.env.NODE_ENV !== "production" && (oe(t) || E("`action` can only be invoked on functions"), (typeof e != "string" || !e) && E("actions should have valid names, got: '" + e + "'"));
  function i() {
    return zw(e, n, t, r || this, arguments);
  }
  return i.isMobxAction = !0, i.toString = function() {
    return t.toString();
  }, uF && (Gd.value = e, on(i, "name", Gd)), i;
}
function zw(e, t, n, r, i) {
  var o = Uw(e, t, r, i);
  try {
    return n.apply(r, i);
  } catch (s) {
    throw o.error_ = s, s;
  } finally {
    Vw(o);
  }
}
function Uw(e, t, n, r) {
  var i = process.env.NODE_ENV !== "production" && Se() && !!e, o = 0;
  if (process.env.NODE_ENV !== "production" && i) {
    o = Date.now();
    var s = r ? Array.from(r) : Na;
    ct({
      type: jh,
      name: e,
      object: n,
      arguments: s
    });
  }
  var a = O.trackingDerivation, u = !t || !a;
  Ye();
  var f = O.allowStateChanges;
  u && (Wr(), f = Wu(!0));
  var c = Gu(!0), l = {
    runAsAction_: u,
    prevDerivation_: a,
    prevAllowStateChanges_: f,
    prevAllowStateReads_: c,
    notifySpy_: i,
    startTime_: o,
    actionId_: aF++,
    parentActionId_: Pa
  };
  return Pa = l.actionId_, l;
}
function Vw(e) {
  Pa !== e.actionId_ && E(30), Pa = e.parentActionId_, e.error_ !== void 0 && (O.suppressReactionErrors = !0), ku(e.prevAllowStateChanges_), ai(e.prevAllowStateReads_), Xe(), e.runAsAction_ && Mn(e.prevDerivation_), process.env.NODE_ENV !== "production" && e.notifySpy_ && lt({
    time: Date.now() - e.startTime_
  }), O.suppressReactionErrors = !1;
}
function Dh(e, t) {
  var n = Wu(e);
  try {
    return t();
  } finally {
    ku(n);
  }
}
function Wu(e) {
  var t = O.allowStateChanges;
  return O.allowStateChanges = e, t;
}
function ku(e) {
  O.allowStateChanges = e;
}
var fF = "create", Xn = /* @__PURE__ */ function(e) {
  function t(r, i, o, s, a) {
    var u;
    return o === void 0 && (o = process.env.NODE_ENV !== "production" ? "ObservableValue@" + mt() : "ObservableValue"), s === void 0 && (s = !0), a === void 0 && (a = Sr.default), u = e.call(this, o) || this, u.enhancer = void 0, u.name_ = void 0, u.equals = void 0, u.hasUnreportedChange_ = !1, u.interceptors_ = void 0, u.changeListeners_ = void 0, u.value_ = void 0, u.dehancer = void 0, u.enhancer = i, u.name_ = o, u.equals = a, u.value_ = i(r, void 0, o), process.env.NODE_ENV !== "production" && s && Se() && Tr({
      type: fF,
      object: u,
      observableKind: "value",
      debugObjectName: u.name_,
      newValue: "" + u.value_
    }), u;
  }
  Nw(t, e);
  var n = t.prototype;
  return n.dehanceValue = function(i) {
    return this.dehancer !== void 0 ? this.dehancer(i) : i;
  }, n.set = function(i) {
    var o = this.value_;
    if (i = this.prepareNewValue_(i), i !== O.UNCHANGED) {
      var s = Se();
      process.env.NODE_ENV !== "production" && s && ct({
        type: zt,
        object: this,
        observableKind: "value",
        debugObjectName: this.name_,
        newValue: i,
        oldValue: o
      }), this.setNewValue_(i), process.env.NODE_ENV !== "production" && s && lt();
    }
  }, n.prepareNewValue_ = function(i) {
    if (nn(this), Ot(this)) {
      var o = Et(this, {
        object: this,
        type: zt,
        newValue: i
      });
      if (!o)
        return O.UNCHANGED;
      i = o.newValue;
    }
    return i = this.enhancer(i, this.value_, this.name_), this.equals(this.value_, i) ? O.UNCHANGED : i;
  }, n.setNewValue_ = function(i) {
    var o = this.value_;
    this.value_ = i, this.reportChanged(), Wt(this) && kt(this, {
      type: zt,
      object: this,
      newValue: i,
      oldValue: o
    });
  }, n.get = function() {
    return this.reportObserved(), this.dehanceValue(this.value_);
  }, n.intercept_ = function(i) {
    return $s(this, i);
  }, n.observe_ = function(i, o) {
    return o && i({
      observableKind: "value",
      debugObjectName: this.name_,
      object: this,
      type: zt,
      newValue: this.value_,
      oldValue: void 0
    }), Ns(this, i);
  }, n.raw = function() {
    return this.value_;
  }, n.toJSON = function() {
    return this.get();
  }, n.toString = function() {
    return this.name_ + "[" + this.value_ + "]";
  }, n.valueOf = function() {
    return $w(this.get());
  }, n[Symbol.toPrimitive] = function() {
    return this.valueOf();
  }, t;
}(pr), Lh = /* @__PURE__ */ hr("ObservableValue", Xn), It = /* @__PURE__ */ function() {
  function e(n) {
    this.dependenciesState_ = B.NOT_TRACKING_, this.observing_ = [], this.newObserving_ = null, this.observers_ = /* @__PURE__ */ new Set(), this.runId_ = 0, this.lastAccessedBy_ = 0, this.lowestObserverState_ = B.UP_TO_DATE_, this.unboundDepsCount_ = 0, this.value_ = new Ia(null), this.name_ = void 0, this.triggeredBy_ = void 0, this.flags_ = 0, this.derivation = void 0, this.setter_ = void 0, this.isTracing_ = $t.NONE, this.scope_ = void 0, this.equals_ = void 0, this.requiresReaction_ = void 0, this.keepAlive_ = void 0, this.onBOL = void 0, this.onBUOL = void 0, n.get || E(31), this.derivation = n.get, this.name_ = n.name || (process.env.NODE_ENV !== "production" ? "ComputedValue@" + mt() : "ComputedValue"), n.set && (this.setter_ = ir(process.env.NODE_ENV !== "production" ? this.name_ + "-setter" : "ComputedValue-setter", n.set)), this.equals_ = n.equals || (n.compareStructural || n.struct ? Sr.structural : Sr.default), this.scope_ = n.context, this.requiresReaction_ = n.requiresReaction, this.keepAlive_ = !!n.keepAlive;
  }
  var t = e.prototype;
  return t.onBecomeStale_ = function() {
    AF(this);
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
      vc(this) && (this.warnAboutUntrackedRead_(), Ye(), this.value_ = this.computeValue_(!1), Xe());
    else if (Kw(this), vc(this)) {
      var r = O.trackingContext;
      this.keepAlive_ && !r && (O.trackingContext = this), this.trackAndCompute() && wF(this), O.trackingContext = r;
    }
    var i = this.value_;
    if (oa(i))
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
      this.dependenciesState_ === B.NOT_TRACKING_
    ), o = this.computeValue_(!0), s = i || oa(r) || oa(o) || !this.equals_(r, o);
    return s && (this.value_ = o, process.env.NODE_ENV !== "production" && Se() && Tr({
      observableKind: "computed",
      debugObjectName: this.name_,
      object: this.scope_,
      type: "update",
      oldValue: r,
      newValue: o
    })), s;
  }, t.computeValue_ = function(r) {
    this.isComputing = !0;
    var i = Wu(!1), o;
    if (r)
      o = qw(this, this.derivation, this.scope_);
    else if (O.disableErrorBoundaries === !0)
      o = this.derivation.call(this.scope_);
    else
      try {
        o = this.derivation.call(this.scope_);
      } catch (s) {
        o = new Ia(s);
      }
    return ku(i), this.isComputing = !1, o;
  }, t.suspend_ = function() {
    this.keepAlive_ || (gc(this), this.value_ = void 0, process.env.NODE_ENV !== "production" && this.isTracing_ !== $t.NONE && console.log("[mobx.trace] Computed value '" + this.name_ + "' was suspended and it will recompute on the next access."));
  }, t.observe_ = function(r, i) {
    var o = this, s = !0, a = void 0;
    return Bh(function() {
      var u = o.get();
      if (!s || i) {
        var f = Wr();
        r({
          observableKind: "computed",
          debugObjectName: o.name_,
          type: zt,
          object: o,
          newValue: u,
          oldValue: a
        }), Mn(f);
      }
      s = !1, a = u;
    });
  }, t.warnAboutUntrackedRead_ = function() {
    process.env.NODE_ENV !== "production" && (this.isTracing_ !== $t.NONE && console.log("[mobx.trace] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute."), (typeof this.requiresReaction_ == "boolean" ? this.requiresReaction_ : O.computedRequiresReaction) && console.warn("[mobx] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute."));
  }, t.toString = function() {
    return this.name_ + "[" + this.derivation.toString() + "]";
  }, t.valueOf = function() {
    return $w(this.get());
  }, t[Symbol.toPrimitive] = function() {
    return this.valueOf();
  }, Gi(e, [{
    key: "isComputing",
    get: function() {
      return it(this.flags_, e.isComputingMask_);
    },
    set: function(r) {
      this.flags_ = ot(this.flags_, e.isComputingMask_, r);
    }
  }, {
    key: "isRunningSetter",
    get: function() {
      return it(this.flags_, e.isRunningSetterMask_);
    },
    set: function(r) {
      this.flags_ = ot(this.flags_, e.isRunningSetterMask_, r);
    }
  }, {
    key: "isBeingObserved",
    get: function() {
      return it(this.flags_, e.isBeingObservedMask_);
    },
    set: function(r) {
      this.flags_ = ot(this.flags_, e.isBeingObservedMask_, r);
    }
  }, {
    key: "isPendingUnobservation",
    get: function() {
      return it(this.flags_, e.isPendingUnobservationMask_);
    },
    set: function(r) {
      this.flags_ = ot(this.flags_, e.isPendingUnobservationMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return it(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = ot(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
It.isComputingMask_ = 1;
It.isRunningSetterMask_ = 2;
It.isBeingObservedMask_ = 4;
It.isPendingUnobservationMask_ = 8;
It.diffValueMask_ = 16;
var Rr = /* @__PURE__ */ hr("ComputedValue", It), B;
(function(e) {
  e[e.NOT_TRACKING_ = -1] = "NOT_TRACKING_", e[e.UP_TO_DATE_ = 0] = "UP_TO_DATE_", e[e.POSSIBLY_STALE_ = 1] = "POSSIBLY_STALE_", e[e.STALE_ = 2] = "STALE_";
})(B || (B = {}));
var $t;
(function(e) {
  e[e.NONE = 0] = "NONE", e[e.LOG = 1] = "LOG", e[e.BREAK = 2] = "BREAK";
})($t || ($t = {}));
var Ia = function(t) {
  this.cause = void 0, this.cause = t;
};
function oa(e) {
  return e instanceof Ia;
}
function vc(e) {
  switch (e.dependenciesState_) {
    case B.UP_TO_DATE_:
      return !1;
    case B.NOT_TRACKING_:
    case B.STALE_:
      return !0;
    case B.POSSIBLY_STALE_: {
      for (var t = Gu(!0), n = Wr(), r = e.observing_, i = r.length, o = 0; o < i; o++) {
        var s = r[o];
        if (Rr(s)) {
          if (O.disableErrorBoundaries)
            s.get();
          else
            try {
              s.get();
            } catch {
              return Mn(n), ai(t), !0;
            }
          if (e.dependenciesState_ === B.STALE_)
            return Mn(n), ai(t), !0;
        }
      }
      return Ww(e), Mn(n), ai(t), !1;
    }
  }
}
function cF() {
  return O.trackingDerivation !== null;
}
function nn(e) {
  if (process.env.NODE_ENV !== "production") {
    var t = e.observers_.size > 0;
    !O.allowStateChanges && (t || O.enforceActions === "always") && console.warn("[MobX] " + (O.enforceActions ? "Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: " : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, a computed value or the render function of a React component? You can wrap side effects in 'runInAction' (or decorate functions with 'action') if needed. Tried to modify: ") + e.name_);
  }
}
function lF(e) {
  process.env.NODE_ENV !== "production" && !O.allowStateReads && O.observableRequiresReaction && console.warn("[mobx] Observable '" + e.name_ + "' being read outside a reactive context.");
}
function qw(e, t, n) {
  var r = Gu(!0);
  Ww(e), e.newObserving_ = new Array(
    // Reserve constant space for initial dependencies, dynamic space otherwise.
    // See https://github.com/mobxjs/mobx/pull/3833
    e.runId_ === 0 ? 100 : e.observing_.length
  ), e.unboundDepsCount_ = 0, e.runId_ = ++O.runId;
  var i = O.trackingDerivation;
  O.trackingDerivation = e, O.inBatch++;
  var o;
  if (O.disableErrorBoundaries === !0)
    o = t.call(n);
  else
    try {
      o = t.call(n);
    } catch (s) {
      o = new Ia(s);
    }
  return O.inBatch--, O.trackingDerivation = i, pF(e), hF(e), ai(r), o;
}
function hF(e) {
  process.env.NODE_ENV !== "production" && e.observing_.length === 0 && (typeof e.requiresObservable_ == "boolean" ? e.requiresObservable_ : O.reactionRequiresObservable) && console.warn("[mobx] Derivation '" + e.name_ + "' is created/updated without reading any observable value.");
}
function pF(e) {
  for (var t = e.observing_, n = e.observing_ = e.newObserving_, r = B.UP_TO_DATE_, i = 0, o = e.unboundDepsCount_, s = 0; s < o; s++) {
    var a = n[s];
    a.diffValue === 0 && (a.diffValue = 1, i !== s && (n[i] = a), i++), a.dependenciesState_ > r && (r = a.dependenciesState_);
  }
  for (n.length = i, e.newObserving_ = null, o = t.length; o--; ) {
    var u = t[o];
    u.diffValue === 0 && Gw(u, e), u.diffValue = 0;
  }
  for (; i--; ) {
    var f = n[i];
    f.diffValue === 1 && (f.diffValue = 0, mF(f, e));
  }
  r !== B.UP_TO_DATE_ && (e.dependenciesState_ = r, e.onBecomeStale_());
}
function gc(e) {
  var t = e.observing_;
  e.observing_ = [];
  for (var n = t.length; n--; )
    Gw(t[n], e);
  e.dependenciesState_ = B.NOT_TRACKING_;
}
function Fh(e) {
  var t = Wr();
  try {
    return e();
  } finally {
    Mn(t);
  }
}
function Wr() {
  var e = O.trackingDerivation;
  return O.trackingDerivation = null, e;
}
function Mn(e) {
  O.trackingDerivation = e;
}
function Gu(e) {
  var t = O.allowStateReads;
  return O.allowStateReads = e, t;
}
function ai(e) {
  O.allowStateReads = e;
}
function Ww(e) {
  if (e.dependenciesState_ !== B.UP_TO_DATE_) {
    e.dependenciesState_ = B.UP_TO_DATE_;
    for (var t = e.observing_, n = t.length; n--; )
      t[n].lowestObserverState_ = B.UP_TO_DATE_;
  }
}
var dF = ["mobxGuid", "spyListeners", "enforceActions", "computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "allowStateReads", "disableErrorBoundaries", "runId", "UNCHANGED", "useProxies"], go = function() {
  this.version = 6, this.UNCHANGED = {}, this.trackingDerivation = null, this.trackingContext = null, this.runId = 0, this.mobxGuid = 0, this.inBatch = 0, this.pendingUnobservations = [], this.pendingReactions = [], this.isRunningReactions = !1, this.allowStateChanges = !1, this.allowStateReads = !0, this.enforceActions = !0, this.spyListeners = [], this.globalReactionErrorHandlers = [], this.computedRequiresReaction = !1, this.reactionRequiresObservable = !1, this.observableRequiresReaction = !1, this.disableErrorBoundaries = !1, this.suppressReactionErrors = !1, this.useProxies = !0, this.verifyProxies = !1, this.safeDescriptors = !0;
}, sa = !0, kw = !1, O = /* @__PURE__ */ function() {
  var e = /* @__PURE__ */ Bu();
  return e.__mobxInstanceCount > 0 && !e.__mobxGlobals && (sa = !1), e.__mobxGlobals && e.__mobxGlobals.version !== new go().version && (sa = !1), sa ? e.__mobxGlobals ? (e.__mobxInstanceCount += 1, e.__mobxGlobals.UNCHANGED || (e.__mobxGlobals.UNCHANGED = {}), e.__mobxGlobals) : (e.__mobxInstanceCount = 1, e.__mobxGlobals = /* @__PURE__ */ new go()) : (setTimeout(function() {
    kw || E(35);
  }, 1), new go());
}();
function _F() {
  if ((O.pendingReactions.length || O.inBatch || O.isRunningReactions) && E(36), kw = !0, sa) {
    var e = Bu();
    --e.__mobxInstanceCount === 0 && (e.__mobxGlobals = void 0), O = new go();
  }
}
function vF() {
  return O;
}
function gF() {
  var e = new go();
  for (var t in e)
    dF.indexOf(t) === -1 && (O[t] = e[t]);
  O.allowStateChanges = !O.enforceActions;
}
function yF(e) {
  return e.observers_ && e.observers_.size > 0;
}
function bF(e) {
  return e.observers_;
}
function mF(e, t) {
  e.observers_.add(t), e.lowestObserverState_ > t.dependenciesState_ && (e.lowestObserverState_ = t.dependenciesState_);
}
function Gw(e, t) {
  e.observers_.delete(t), e.observers_.size === 0 && Hw(e);
}
function Hw(e) {
  e.isPendingUnobservation === !1 && (e.isPendingUnobservation = !0, O.pendingUnobservations.push(e));
}
function Ye() {
  O.inBatch++;
}
function Xe() {
  if (--O.inBatch === 0) {
    Zw();
    for (var e = O.pendingUnobservations, t = 0; t < e.length; t++) {
      var n = e[t];
      n.isPendingUnobservation = !1, n.observers_.size === 0 && (n.isBeingObserved && (n.isBeingObserved = !1, n.onBUO()), n instanceof It && n.suspend_());
    }
    O.pendingUnobservations = [];
  }
}
function Kw(e) {
  lF(e);
  var t = O.trackingDerivation;
  return t !== null ? (t.runId_ !== e.lastAccessedBy_ && (e.lastAccessedBy_ = t.runId_, t.newObserving_[t.unboundDepsCount_++] = e, !e.isBeingObserved && O.trackingContext && (e.isBeingObserved = !0, e.onBO())), e.isBeingObserved) : (e.observers_.size === 0 && O.inBatch > 0 && Hw(e), !1);
}
function Yw(e) {
  e.lowestObserverState_ !== B.STALE_ && (e.lowestObserverState_ = B.STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === B.UP_TO_DATE_ && (process.env.NODE_ENV !== "production" && t.isTracing_ !== $t.NONE && Xw(t, e), t.onBecomeStale_()), t.dependenciesState_ = B.STALE_;
  }));
}
function wF(e) {
  e.lowestObserverState_ !== B.STALE_ && (e.lowestObserverState_ = B.STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === B.POSSIBLY_STALE_ ? (t.dependenciesState_ = B.STALE_, process.env.NODE_ENV !== "production" && t.isTracing_ !== $t.NONE && Xw(t, e)) : t.dependenciesState_ === B.UP_TO_DATE_ && (e.lowestObserverState_ = B.UP_TO_DATE_);
  }));
}
function AF(e) {
  e.lowestObserverState_ === B.UP_TO_DATE_ && (e.lowestObserverState_ = B.POSSIBLY_STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === B.UP_TO_DATE_ && (t.dependenciesState_ = B.POSSIBLY_STALE_, t.onBecomeStale_());
  }));
}
function Xw(e, t) {
  if (console.log("[mobx.trace] '" + e.name_ + "' is invalidated due to a change in: '" + t.name_ + "'"), e.isTracing_ === $t.BREAK) {
    var n = [];
    Jw(sA(e), n, 1), new Function(`debugger;
/*
Tracing '` + e.name_ + `'

You are entering this break point because derivation '` + e.name_ + "' is being traced and '" + t.name_ + `' is now forcing it to update.
Just follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update
The stackframe you are looking for is at least ~6-8 stack-frames up.

` + (e instanceof It ? e.derivation.toString().replace(/[*]\//g, "/") : "") + `

The dependencies for this derivation are:

` + n.join(`
`) + `
*/
    `)();
  }
}
function Jw(e, t, n) {
  if (t.length >= 1e3) {
    t.push("(and many more)");
    return;
  }
  t.push("" + "	".repeat(n - 1) + e.name), e.dependencies && e.dependencies.forEach(function(r) {
    return Jw(r, t, n + 1);
  });
}
var cn = /* @__PURE__ */ function() {
  function e(n, r, i, o) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "Reaction@" + mt() : "Reaction"), this.name_ = void 0, this.onInvalidate_ = void 0, this.errorHandler_ = void 0, this.requiresObservable_ = void 0, this.observing_ = [], this.newObserving_ = [], this.dependenciesState_ = B.NOT_TRACKING_, this.runId_ = 0, this.unboundDepsCount_ = 0, this.flags_ = 0, this.isTracing_ = $t.NONE, this.name_ = n, this.onInvalidate_ = r, this.errorHandler_ = i, this.requiresObservable_ = o;
  }
  var t = e.prototype;
  return t.onBecomeStale_ = function() {
    this.schedule_();
  }, t.schedule_ = function() {
    this.isScheduled || (this.isScheduled = !0, O.pendingReactions.push(this), Zw());
  }, t.runReaction_ = function() {
    if (!this.isDisposed) {
      Ye(), this.isScheduled = !1;
      var r = O.trackingContext;
      if (O.trackingContext = this, vc(this)) {
        this.isTrackPending = !0;
        try {
          this.onInvalidate_(), process.env.NODE_ENV !== "production" && this.isTrackPending && Se() && Tr({
            name: this.name_,
            type: "scheduled-reaction"
          });
        } catch (i) {
          this.reportExceptionInDerivation_(i);
        }
      }
      O.trackingContext = r, Xe();
    }
  }, t.track = function(r) {
    if (!this.isDisposed) {
      Ye();
      var i = Se(), o;
      process.env.NODE_ENV !== "production" && i && (o = Date.now(), ct({
        name: this.name_,
        type: "reaction"
      })), this.isRunning = !0;
      var s = O.trackingContext;
      O.trackingContext = this;
      var a = qw(this, r, void 0);
      O.trackingContext = s, this.isRunning = !1, this.isTrackPending = !1, this.isDisposed && gc(this), oa(a) && this.reportExceptionInDerivation_(a.cause), process.env.NODE_ENV !== "production" && i && lt({
        time: Date.now() - o
      }), Xe();
    }
  }, t.reportExceptionInDerivation_ = function(r) {
    var i = this;
    if (this.errorHandler_) {
      this.errorHandler_(r, this);
      return;
    }
    if (O.disableErrorBoundaries)
      throw r;
    var o = process.env.NODE_ENV !== "production" ? "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'" : "[mobx] uncaught error in '" + this + "'";
    O.suppressReactionErrors ? process.env.NODE_ENV !== "production" && console.warn("[mobx] (error in reaction '" + this.name_ + "' suppressed, fix error of causing action below)") : console.error(o, r), process.env.NODE_ENV !== "production" && Se() && Tr({
      type: "error",
      name: this.name_,
      message: o,
      error: "" + r
    }), O.globalReactionErrorHandlers.forEach(function(s) {
      return s(r, i);
    });
  }, t.dispose = function() {
    this.isDisposed || (this.isDisposed = !0, this.isRunning || (Ye(), gc(this), Xe()));
  }, t.getDisposer_ = function(r) {
    var i = this, o = function s() {
      i.dispose(), r == null || r.removeEventListener == null || r.removeEventListener("abort", s);
    };
    return r == null || r.addEventListener == null || r.addEventListener("abort", o), o[R] = this, o;
  }, t.toString = function() {
    return "Reaction[" + this.name_ + "]";
  }, t.trace = function(r) {
    r === void 0 && (r = !1), dA(this, r);
  }, Gi(e, [{
    key: "isDisposed",
    get: function() {
      return it(this.flags_, e.isDisposedMask_);
    },
    set: function(r) {
      this.flags_ = ot(this.flags_, e.isDisposedMask_, r);
    }
  }, {
    key: "isScheduled",
    get: function() {
      return it(this.flags_, e.isScheduledMask_);
    },
    set: function(r) {
      this.flags_ = ot(this.flags_, e.isScheduledMask_, r);
    }
  }, {
    key: "isTrackPending",
    get: function() {
      return it(this.flags_, e.isTrackPendingMask_);
    },
    set: function(r) {
      this.flags_ = ot(this.flags_, e.isTrackPendingMask_, r);
    }
  }, {
    key: "isRunning",
    get: function() {
      return it(this.flags_, e.isRunningMask_);
    },
    set: function(r) {
      this.flags_ = ot(this.flags_, e.isRunningMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return it(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = ot(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
cn.isDisposedMask_ = 1;
cn.isScheduledMask_ = 2;
cn.isTrackPendingMask_ = 4;
cn.isRunningMask_ = 8;
cn.diffValueMask_ = 16;
function OF(e) {
  return O.globalReactionErrorHandlers.push(e), function() {
    var t = O.globalReactionErrorHandlers.indexOf(e);
    t >= 0 && O.globalReactionErrorHandlers.splice(t, 1);
  };
}
var Hd = 100, yc = function(t) {
  return t();
};
function Zw() {
  O.inBatch > 0 || O.isRunningReactions || yc(EF);
}
function EF() {
  O.isRunningReactions = !0;
  for (var e = O.pendingReactions, t = 0; e.length > 0; ) {
    ++t === Hd && (console.error(process.env.NODE_ENV !== "production" ? "Reaction doesn't converge to a stable state after " + Hd + " iterations." + (" Probably there is a cycle in the reactive function: " + e[0]) : "[mobx] cycle in reaction: " + e[0]), e.splice(0));
    for (var n = e.splice(0), r = 0, i = n.length; r < i; r++)
      n[r].runReaction_();
  }
  O.isRunningReactions = !1;
}
var Ca = /* @__PURE__ */ hr("Reaction", cn);
function SF(e) {
  var t = yc;
  yc = function(r) {
    return e(function() {
      return t(r);
    });
  };
}
function Se() {
  return process.env.NODE_ENV !== "production" && !!O.spyListeners.length;
}
function Tr(e) {
  if (process.env.NODE_ENV !== "production" && O.spyListeners.length)
    for (var t = O.spyListeners, n = 0, r = t.length; n < r; n++)
      t[n](e);
}
function ct(e) {
  if (process.env.NODE_ENV !== "production") {
    var t = fn({}, e, {
      spyReportStart: !0
    });
    Tr(t);
  }
}
var xF = {
  type: "report-end",
  spyReportEnd: !0
};
function lt(e) {
  process.env.NODE_ENV !== "production" && Tr(e ? fn({}, e, {
    type: "report-end",
    spyReportEnd: !0
  }) : xF);
}
function Qw(e) {
  return process.env.NODE_ENV === "production" ? (console.warn("[mobx.spy] Is a no-op in production builds"), function() {
  }) : (O.spyListeners.push(e), Mh(function() {
    O.spyListeners = O.spyListeners.filter(function(t) {
      return t !== e;
    });
  }));
}
var jh = "action", RF = "action.bound", eA = "autoAction", TF = "autoAction.bound", tA = "<unnamed action>", bc = /* @__PURE__ */ Rs(jh), $F = /* @__PURE__ */ Rs(RF, {
  bound: !0
}), mc = /* @__PURE__ */ Rs(eA, {
  autoAction: !0
}), NF = /* @__PURE__ */ Rs(TF, {
  autoAction: !0,
  bound: !0
});
function nA(e) {
  var t = function(r, i) {
    if (oe(r))
      return ir(r.name || tA, r, e);
    if (oe(i))
      return ir(r, i, e);
    if (xs(i))
      return (e ? mc : bc).decorate_20223_(r, i);
    if (un(i))
      return Ss(r, i, e ? mc : bc);
    if (un(r))
      return qt(Rs(e ? eA : jh, {
        name: r,
        autoAction: e
      }));
    process.env.NODE_ENV !== "production" && E("Invalid arguments for `action`");
  };
  return t;
}
var Wn = /* @__PURE__ */ nA(!1);
Object.assign(Wn, bc);
var Si = /* @__PURE__ */ nA(!0);
Object.assign(Si, mc);
Wn.bound = /* @__PURE__ */ qt($F);
Si.bound = /* @__PURE__ */ qt(NF);
function Kd(e) {
  return zw(e.name || tA, !1, e, this, void 0);
}
function $r(e) {
  return oe(e) && e.isMobxAction === !0;
}
function Bh(e, t) {
  var n, r, i, o;
  t === void 0 && (t = Nh), process.env.NODE_ENV !== "production" && (oe(e) || E("Autorun expects a function as first argument"), $r(e) && E("Autorun does not accept actions since actions are untrackable"));
  var s = (n = (r = t) == null ? void 0 : r.name) != null ? n : process.env.NODE_ENV !== "production" ? e.name || "Autorun@" + mt() : "Autorun", a = !t.scheduler && !t.delay, u;
  if (a)
    u = new cn(s, function() {
      this.track(l);
    }, t.onError, t.requiresObservable);
  else {
    var f = rA(t), c = !1;
    u = new cn(s, function() {
      c || (c = !0, f(function() {
        c = !1, u.isDisposed || u.track(l);
      }));
    }, t.onError, t.requiresObservable);
  }
  function l() {
    e(u);
  }
  return (i = t) != null && (i = i.signal) != null && i.aborted || u.schedule_(), u.getDisposer_((o = t) == null ? void 0 : o.signal);
}
var MF = function(t) {
  return t();
};
function rA(e) {
  return e.scheduler ? e.scheduler : e.delay ? function(t) {
    return setTimeout(t, e.delay);
  } : MF;
}
function PF(e, t, n) {
  var r, i, o;
  n === void 0 && (n = Nh), process.env.NODE_ENV !== "production" && ((!oe(e) || !oe(t)) && E("First and second argument to reaction should be functions"), Ze(n) || E("Third argument of reactions should be an object"));
  var s = (r = n.name) != null ? r : process.env.NODE_ENV !== "production" ? "Reaction@" + mt() : "Reaction", a = Wn(s, n.onError ? IF(n.onError, t) : t), u = !n.scheduler && !n.delay, f = rA(n), c = !0, l = !1, h, d = n.compareStructural ? Sr.structural : n.equals || Sr.default, _ = new cn(s, function() {
    c || u ? v() : l || (l = !0, f(v));
  }, n.onError, n.requiresObservable);
  function v() {
    if (l = !1, !_.isDisposed) {
      var g = !1, y = h;
      _.track(function() {
        var b = Dh(!1, function() {
          return e(_);
        });
        g = c || !d(h, b), h = b;
      }), (c && n.fireImmediately || !c && g) && a(h, y, _), c = !1;
    }
  }
  return (i = n) != null && (i = i.signal) != null && i.aborted || _.schedule_(), _.getDisposer_((o = n) == null ? void 0 : o.signal);
}
function IF(e, t) {
  return function() {
    try {
      return t.apply(this, arguments);
    } catch (n) {
      e.call(this, n);
    }
  };
}
var CF = "onBO", DF = "onBUO";
function iA(e, t, n) {
  return oA(CF, e, t, n);
}
function zh(e, t, n) {
  return oA(DF, e, t, n);
}
function oA(e, t, n, r) {
  var i = typeof r == "function" ? Kt(t, n) : Kt(t), o = oe(r) ? r : n, s = e + "L";
  return i[s] ? i[s].add(o) : i[s] = /* @__PURE__ */ new Set([o]), function() {
    var a = i[s];
    a && (a.delete(o), a.size === 0 && delete i[s]);
  };
}
var LF = "never", Ks = "always", FF = "observed";
function jF(e) {
  e.isolateGlobalState === !0 && _F();
  var t = e.useProxies, n = e.enforceActions;
  if (t !== void 0 && (O.useProxies = t === Ks ? !0 : t === LF ? !1 : typeof Proxy < "u"), t === "ifavailable" && (O.verifyProxies = !0), n !== void 0) {
    var r = n === Ks ? Ks : n === FF;
    O.enforceActions = r, O.allowStateChanges = !(r === !0 || r === Ks);
  }
  ["computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "disableErrorBoundaries", "safeDescriptors"].forEach(function(i) {
    i in e && (O[i] = !!e[i]);
  }), O.allowStateReads = !O.observableRequiresReaction, process.env.NODE_ENV !== "production" && O.disableErrorBoundaries === !0 && console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled."), e.reactionScheduler && SF(e.reactionScheduler);
}
function Uh(e, t, n, r) {
  process.env.NODE_ENV !== "production" && (arguments.length > 4 && E("'extendObservable' expected 2-4 arguments"), typeof e != "object" && E("'extendObservable' expects an object as first argument"), _e(e) && E("'extendObservable' should not be used on maps, use map.merge instead"), Ze(t) || E("'extendObservable' only accepts plain objects as second argument"), (Mr(t) || Mr(n)) && E("Extending an object with another observable (object) is not supported"));
  var i = lL(t);
  return dr(function() {
    var o = kr(e, r)[R];
    Ei(i).forEach(function(s) {
      o.extend_(
        s,
        i[s],
        // must pass "undefined" for { key: undefined }
        n && s in n ? n[s] : !0
      );
    });
  }), e;
}
function sA(e, t) {
  return aA(Kt(e, t));
}
function aA(e) {
  var t = {
    name: e.name_
  };
  return e.observing_ && e.observing_.length > 0 && (t.dependencies = zF(e.observing_).map(aA)), t;
}
function BF(e, t) {
  return uA(Kt(e, t));
}
function uA(e) {
  var t = {
    name: e.name_
  };
  return yF(e) && (t.observers = Array.from(bF(e)).map(uA)), t;
}
function zF(e) {
  return Array.from(new Set(e));
}
var UF = 0;
function Hu() {
  this.message = "FLOW_CANCELLED";
}
Hu.prototype = /* @__PURE__ */ Object.create(Error.prototype);
function VF(e) {
  return e instanceof Hu;
}
var wf = /* @__PURE__ */ Iw("flow"), qF = /* @__PURE__ */ Iw("flow.bound", {
  bound: !0
}), Nr = /* @__PURE__ */ Object.assign(function(t, n) {
  if (xs(n))
    return wf.decorate_20223_(t, n);
  if (un(n))
    return Ss(t, n, wf);
  process.env.NODE_ENV !== "production" && arguments.length !== 1 && E("Flow expects single argument with generator function");
  var r = t, i = r.name || "<unnamed flow>", o = function() {
    var a = this, u = arguments, f = ++UF, c = Wn(i + " - runid: " + f + " - init", r).apply(a, u), l, h = void 0, d = new Promise(function(_, v) {
      var g = 0;
      l = v;
      function y(m) {
        h = void 0;
        var A;
        try {
          A = Wn(i + " - runid: " + f + " - yield " + g++, c.next).call(c, m);
        } catch (S) {
          return v(S);
        }
        w(A);
      }
      function b(m) {
        h = void 0;
        var A;
        try {
          A = Wn(i + " - runid: " + f + " - yield " + g++, c.throw).call(c, m);
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
    return d.cancel = Wn(i + " - runid: " + f + " - cancel", function() {
      try {
        h && Yd(h);
        var _ = c.return(void 0), v = Promise.resolve(_.value);
        v.then(Qr, Qr), Yd(v), l(new Hu());
      } catch (g) {
        l(g);
      }
    }), d;
  };
  return o.isMobXFlow = !0, o;
}, wf);
Nr.bound = /* @__PURE__ */ qt(qF);
function Yd(e) {
  oe(e.cancel) && e.cancel();
}
function WF(e) {
  return e;
}
function xi(e) {
  return e?.isMobXFlow === !0;
}
function kF(e, t, n) {
  var r;
  if (_e(e) || Ge(e) || Lh(e))
    r = ln(e);
  else if (he(e)) {
    if (process.env.NODE_ENV !== "production" && !un(t))
      return E("InterceptReads can only be used with a specific property, not with an object in general");
    r = ln(e, t);
  } else if (process.env.NODE_ENV !== "production")
    return E("Expected observable map, object or array as first array");
  return process.env.NODE_ENV !== "production" && r.dehancer !== void 0 ? E("An intercept reader was already established") : (r.dehancer = typeof t == "function" ? t : n, function() {
    r.dehancer = void 0;
  });
}
function GF(e, t, n) {
  return oe(n) ? KF(e, t, n) : HF(e, t);
}
function HF(e, t) {
  return ln(e).intercept_(t);
}
function KF(e, t, n) {
  return ln(e, t).intercept_(n);
}
function fA(e, t) {
  if (t === void 0)
    return Rr(e);
  if (he(e) === !1 || !e[R].values_.has(t))
    return !1;
  var n = Kt(e, t);
  return Rr(n);
}
function YF(e) {
  return process.env.NODE_ENV !== "production" && arguments.length > 1 ? E("isComputed expects only 1 argument. Use isComputedProp to inspect the observability of a property") : fA(e);
}
function XF(e, t) {
  return process.env.NODE_ENV !== "production" && !un(t) ? E("isComputed expected a property name as second argument") : fA(e, t);
}
function cA(e, t) {
  return e ? t !== void 0 ? process.env.NODE_ENV !== "production" && (_e(e) || Ge(e)) ? E("isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.") : he(e) ? e[R].values_.has(t) : !1 : he(e) || !!e[R] || Ph(e) || Ca(e) || Rr(e) : !1;
}
function Mr(e) {
  return process.env.NODE_ENV !== "production" && arguments.length !== 1 && E("isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property"), cA(e);
}
function JF(e, t) {
  return process.env.NODE_ENV !== "production" && !un(t) ? E("expected a property name as second argument") : cA(e, t);
}
function Uo(e) {
  if (he(e))
    return e[R].keys_();
  if (_e(e) || le(e))
    return Array.from(e.keys());
  if (Ge(e))
    return e.map(function(t, n) {
      return n;
    });
  E(5);
}
function ZF(e) {
  if (he(e))
    return Uo(e).map(function(t) {
      return e[t];
    });
  if (_e(e))
    return Uo(e).map(function(t) {
      return e.get(t);
    });
  if (le(e))
    return Array.from(e.values());
  if (Ge(e))
    return e.slice();
  E(6);
}
function QF(e) {
  if (he(e))
    return Uo(e).map(function(t) {
      return [t, e[t]];
    });
  if (_e(e))
    return Uo(e).map(function(t) {
      return [t, e.get(t)];
    });
  if (le(e))
    return Array.from(e.entries());
  if (Ge(e))
    return e.map(function(t, n) {
      return [n, t];
    });
  E(7);
}
function lA(e, t, n) {
  if (arguments.length === 2 && !le(e)) {
    Ye();
    var r = t;
    try {
      for (var i in r)
        lA(e, i, r[i]);
    } finally {
      Xe();
    }
    return;
  }
  he(e) ? e[R].set_(t, n) : _e(e) ? e.set(t, n) : le(e) ? e.add(t) : Ge(e) ? (typeof t != "number" && (t = parseInt(t, 10)), t < 0 && E("Invalid index: '" + t + "'"), Ye(), t >= e.length && (e.length = t + 1), e[t] = n, Xe()) : E(8);
}
function ej(e, t) {
  he(e) ? e[R].delete_(t) : _e(e) || le(e) ? e.delete(t) : Ge(e) ? (typeof t != "number" && (t = parseInt(t, 10)), e.splice(t, 1)) : E(9);
}
function hA(e, t) {
  if (he(e))
    return e[R].has_(t);
  if (_e(e))
    return e.has(t);
  if (le(e))
    return e.has(t);
  if (Ge(e))
    return t >= 0 && t < e.length;
  E(10);
}
function tj(e, t) {
  if (hA(e, t)) {
    if (he(e))
      return e[R].get_(t);
    if (_e(e))
      return e.get(t);
    if (Ge(e))
      return e[t];
    E(11);
  }
}
function nj(e, t, n) {
  if (he(e))
    return e[R].defineProperty_(t, n);
  E(39);
}
function pA(e) {
  if (he(e))
    return e[R].ownKeys_();
  E(38);
}
function rj(e, t, n, r) {
  return oe(n) ? oj(e, t, n, r) : ij(e, t, n);
}
function ij(e, t, n) {
  return ln(e).observe_(t, n);
}
function oj(e, t, n, r) {
  return ln(e, t).observe_(n, r);
}
function Ys(e, t, n) {
  return e.set(t, n), n;
}
function Zr(e, t) {
  if (e == null || typeof e != "object" || e instanceof Date || !Mr(e))
    return e;
  if (Lh(e) || Rr(e))
    return Zr(e.get(), t);
  if (t.has(e))
    return t.get(e);
  if (Ge(e)) {
    var n = Ys(t, e, new Array(e.length));
    return e.forEach(function(s, a) {
      n[a] = Zr(s, t);
    }), n;
  }
  if (le(e)) {
    var r = Ys(t, e, /* @__PURE__ */ new Set());
    return e.forEach(function(s) {
      r.add(Zr(s, t));
    }), r;
  }
  if (_e(e)) {
    var i = Ys(t, e, /* @__PURE__ */ new Map());
    return e.forEach(function(s, a) {
      i.set(a, Zr(s, t));
    }), i;
  } else {
    var o = Ys(t, e, {});
    return pA(e).forEach(function(s) {
      Os.propertyIsEnumerable.call(e, s) && (o[s] = Zr(e[s], t));
    }), o;
  }
}
function sj(e, t) {
  return process.env.NODE_ENV !== "production" && t && E("toJS no longer supports options"), Zr(e, /* @__PURE__ */ new Map());
}
function dA() {
  if (process.env.NODE_ENV !== "production") {
    for (var e = !1, t = arguments.length, n = new Array(t), r = 0; r < t; r++)
      n[r] = arguments[r];
    typeof n[n.length - 1] == "boolean" && (e = n.pop());
    var i = aj(n);
    if (!i)
      return E("'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
    i.isTracing_ === $t.NONE && console.log("[mobx.trace] '" + i.name_ + "' tracing enabled"), i.isTracing_ = e ? $t.BREAK : $t.LOG;
  }
}
function aj(e) {
  switch (e.length) {
    case 0:
      return O.trackingDerivation;
    case 1:
      return Kt(e[0]);
    case 2:
      return Kt(e[0], e[1]);
  }
}
function Qt(e, t) {
  t === void 0 && (t = void 0), Ye();
  try {
    return e.apply(t);
  } finally {
    Xe();
  }
}
function uj(e, t, n) {
  return arguments.length === 1 || t && typeof t == "object" ? fj(e, t) : _A(e, t, n || {});
}
function _A(e, t, n) {
  var r;
  if (typeof n.timeout == "number") {
    var i = new Error("WHEN_TIMEOUT");
    r = setTimeout(function() {
      if (!s[R].isDisposed)
        if (s(), n.onError)
          n.onError(i);
        else
          throw i;
    }, n.timeout);
  }
  n.name = process.env.NODE_ENV !== "production" ? n.name || "When@" + mt() : "When";
  var o = ir(process.env.NODE_ENV !== "production" ? n.name + "-effect" : "When-effect", t), s = Bh(function(a) {
    var u = Dh(!1, e);
    u && (a.dispose(), r && clearTimeout(r), o());
  }, n);
  return s;
}
function fj(e, t) {
  var n;
  if (process.env.NODE_ENV !== "production" && t && t.onError)
    return E("the options 'onError' and 'promise' cannot be combined");
  if (t != null && (n = t.signal) != null && n.aborted)
    return Object.assign(Promise.reject(new Error("WHEN_ABORTED")), {
      cancel: function() {
        return null;
      }
    });
  var r, i, o = new Promise(function(s, a) {
    var u, f = _A(e, s, fn({}, t, {
      onError: a
    }));
    r = function() {
      f(), a(new Error("WHEN_CANCELLED"));
    }, i = function() {
      f(), a(new Error("WHEN_ABORTED"));
    }, t == null || (u = t.signal) == null || u.addEventListener == null || u.addEventListener("abort", i);
  }).finally(function() {
    var s;
    return t == null || (s = t.signal) == null || s.removeEventListener == null ? void 0 : s.removeEventListener("abort", i);
  });
  return o.cancel = r, o;
}
function vr(e) {
  return e[R];
}
var cj = {
  has: function(t, n) {
    return process.env.NODE_ENV !== "production" && O.trackingDerivation && to("detect new properties using the 'in' operator. Use 'has' from 'mobx' instead."), vr(t).has_(n);
  },
  get: function(t, n) {
    return vr(t).get_(n);
  },
  set: function(t, n, r) {
    var i;
    return un(n) ? (process.env.NODE_ENV !== "production" && !vr(t).values_.has(n) && to("add a new observable property through direct assignment. Use 'set' from 'mobx' instead."), (i = vr(t).set_(n, r, !0)) != null ? i : !0) : !1;
  },
  deleteProperty: function(t, n) {
    var r;
    return process.env.NODE_ENV !== "production" && to("delete properties from an observable object. Use 'remove' from 'mobx' instead."), un(n) ? (r = vr(t).delete_(n, !0)) != null ? r : !0 : !1;
  },
  defineProperty: function(t, n, r) {
    var i;
    return process.env.NODE_ENV !== "production" && to("define property on an observable object. Use 'defineProperty' from 'mobx' instead."), (i = vr(t).defineProperty_(n, r)) != null ? i : !0;
  },
  ownKeys: function(t) {
    return process.env.NODE_ENV !== "production" && O.trackingDerivation && to("iterate keys to detect added / removed properties. Use 'keys' from 'mobx' instead."), vr(t).ownKeys_();
  },
  preventExtensions: function(t) {
    E(13);
  }
};
function lj(e, t) {
  var n, r;
  return Sw(), e = kr(e, t), (r = (n = e[R]).proxy_) != null ? r : n.proxy_ = new Proxy(e, cj);
}
function Ot(e) {
  return e.interceptors_ !== void 0 && e.interceptors_.length > 0;
}
function $s(e, t) {
  var n = e.interceptors_ || (e.interceptors_ = []);
  return n.push(t), Mh(function() {
    var r = n.indexOf(t);
    r !== -1 && n.splice(r, 1);
  });
}
function Et(e, t) {
  var n = Wr();
  try {
    for (var r = [].concat(e.interceptors_ || []), i = 0, o = r.length; i < o && (t = r[i](t), t && !t.type && E(14), !!t); i++)
      ;
    return t;
  } finally {
    Mn(n);
  }
}
function Wt(e) {
  return e.changeListeners_ !== void 0 && e.changeListeners_.length > 0;
}
function Ns(e, t) {
  var n = e.changeListeners_ || (e.changeListeners_ = []);
  return n.push(t), Mh(function() {
    var r = n.indexOf(t);
    r !== -1 && n.splice(r, 1);
  });
}
function kt(e, t) {
  var n = Wr(), r = e.changeListeners_;
  if (r) {
    r = r.slice();
    for (var i = 0, o = r.length; i < o; i++)
      r[i](t);
    Mn(n);
  }
}
function hj(e, t, n) {
  return dr(function() {
    var r, i = kr(e, n)[R];
    process.env.NODE_ENV !== "production" && t && e[Ke] && E("makeObservable second arg must be nullish when using decorators. Mixing @decorator syntax with annotations is not supported."), (r = t) != null || (t = gL(e)), Ei(t).forEach(function(o) {
      return i.make_(o, t[o]);
    });
  }), e;
}
var Af = /* @__PURE__ */ Symbol("mobx-keys");
function pj(e, t, n) {
  return process.env.NODE_ENV !== "production" && (!Ze(e) && !Ze(Object.getPrototypeOf(e)) && E("'makeAutoObservable' can only be used for classes that don't have a superclass"), he(e) && E("makeAutoObservable can only be used on objects not already made observable")), Ze(e) ? Uh(e, e, t, n) : (dr(function() {
    var r = kr(e, n)[R];
    if (!e[Af]) {
      var i = Object.getPrototypeOf(e), o = new Set([].concat(Ei(e), Ei(i)));
      o.delete("constructor"), o.delete(R), Es(i, Af, o);
    }
    e[Af].forEach(function(s) {
      return r.make_(
        s,
        // must pass "undefined" for { key: undefined }
        t && s in t ? t[s] : !0
      );
    });
  }), e);
}
var Xd = "splice", zt = "update", dj = 1e4, _j = {
  get: function(t, n) {
    var r = t[R];
    return n === R ? r : n === "length" ? r.getArrayLength_() : typeof n == "string" && !isNaN(n) ? r.get_(parseInt(n)) : ft(Da, n) ? Da[n] : t[n];
  },
  set: function(t, n, r) {
    var i = t[R];
    return n === "length" && i.setArrayLength_(r), typeof n == "symbol" || isNaN(n) ? t[n] = r : i.set_(parseInt(n), r), !0;
  },
  preventExtensions: function() {
    E(15);
  }
}, Vh = /* @__PURE__ */ function() {
  function e(n, r, i, o) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "ObservableArray@" + mt() : "ObservableArray"), this.owned_ = void 0, this.legacyMode_ = void 0, this.atom_ = void 0, this.values_ = [], this.interceptors_ = void 0, this.changeListeners_ = void 0, this.enhancer_ = void 0, this.dehancer = void 0, this.proxy_ = void 0, this.lastKnownLength_ = 0, this.owned_ = i, this.legacyMode_ = o, this.atom_ = new pr(n), this.enhancer_ = function(s, a) {
      return r(s, a, process.env.NODE_ENV !== "production" ? n + "[..]" : "ObservableArray[..]");
    };
  }
  var t = e.prototype;
  return t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.dehanceValues_ = function(r) {
    return this.dehancer !== void 0 && r.length > 0 ? r.map(this.dehancer) : r;
  }, t.intercept_ = function(r) {
    return $s(this, r);
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
    }), Ns(this, r);
  }, t.getArrayLength_ = function() {
    return this.atom_.reportObserved(), this.values_.length;
  }, t.setArrayLength_ = function(r) {
    (typeof r != "number" || isNaN(r) || r < 0) && E("Out of range: " + r);
    var i = this.values_.length;
    if (r !== i)
      if (r > i) {
        for (var o = new Array(r - i), s = 0; s < r - i; s++)
          o[s] = void 0;
        this.spliceWithArray_(i, 0, o);
      } else
        this.spliceWithArray_(r, i - r);
  }, t.updateArrayLength_ = function(r, i) {
    r !== this.lastKnownLength_ && E(16), this.lastKnownLength_ += i, this.legacyMode_ && i > 0 && bA(r + i + 1);
  }, t.spliceWithArray_ = function(r, i, o) {
    var s = this;
    nn(this.atom_);
    var a = this.values_.length;
    if (r === void 0 ? r = 0 : r > a ? r = a : r < 0 && (r = Math.max(0, a + r)), arguments.length === 1 ? i = a - r : i == null ? i = 0 : i = Math.max(0, Math.min(i, a - r)), o === void 0 && (o = Na), Ot(this)) {
      var u = Et(this, {
        object: this.proxy_,
        type: Xd,
        index: r,
        removedCount: i,
        added: o
      });
      if (!u)
        return Na;
      i = u.removedCount, o = u.added;
    }
    if (o = o.length === 0 ? o : o.map(function(l) {
      return s.enhancer_(l, void 0);
    }), this.legacyMode_ || process.env.NODE_ENV !== "production") {
      var f = o.length - i;
      this.updateArrayLength_(a, f);
    }
    var c = this.spliceItemsIntoValues_(r, i, o);
    return (i !== 0 || o.length !== 0) && this.notifyArraySplice_(r, o, c), this.dehanceValues_(c);
  }, t.spliceItemsIntoValues_ = function(r, i, o) {
    if (o.length < dj) {
      var s;
      return (s = this.values_).splice.apply(s, [r, i].concat(o));
    } else {
      var a = this.values_.slice(r, r + i), u = this.values_.slice(r + i);
      this.values_.length += o.length - i;
      for (var f = 0; f < o.length; f++)
        this.values_[r + f] = o[f];
      for (var c = 0; c < u.length; c++)
        this.values_[r + o.length + c] = u[c];
      return a;
    }
  }, t.notifyArrayChildUpdate_ = function(r, i, o) {
    var s = !this.owned_ && Se(), a = Wt(this), u = a || s ? {
      observableKind: "array",
      object: this.proxy_,
      type: zt,
      debugObjectName: this.atom_.name_,
      index: r,
      newValue: i,
      oldValue: o
    } : null;
    process.env.NODE_ENV !== "production" && s && ct(u), this.atom_.reportChanged(), a && kt(this, u), process.env.NODE_ENV !== "production" && s && lt();
  }, t.notifyArraySplice_ = function(r, i, o) {
    var s = !this.owned_ && Se(), a = Wt(this), u = a || s ? {
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: Xd,
      index: r,
      removed: o,
      added: i,
      removedCount: o.length,
      addedCount: i.length
    } : null;
    process.env.NODE_ENV !== "production" && s && ct(u), this.atom_.reportChanged(), a && kt(this, u), process.env.NODE_ENV !== "production" && s && lt();
  }, t.get_ = function(r) {
    if (this.legacyMode_ && r >= this.values_.length) {
      console.warn(process.env.NODE_ENV !== "production" ? "[mobx.array] Attempt to read an array index (" + r + ") that is out of bounds (" + this.values_.length + "). Please check length first. Out of bound indices will not be tracked by MobX" : "[mobx] Out of bounds read: " + r);
      return;
    }
    return this.atom_.reportObserved(), this.dehanceValue_(this.values_[r]);
  }, t.set_ = function(r, i) {
    var o = this.values_;
    if (this.legacyMode_ && r > o.length && E(17, r, o.length), r < o.length) {
      nn(this.atom_);
      var s = o[r];
      if (Ot(this)) {
        var a = Et(this, {
          type: zt,
          object: this.proxy_,
          // since "this" is the real array we need to pass its proxy
          index: r,
          newValue: i
        });
        if (!a)
          return;
        i = a.newValue;
      }
      i = this.enhancer_(i, s);
      var u = i !== s;
      u && (o[r] = i, this.notifyArrayChildUpdate_(r, i, s));
    } else {
      for (var f = new Array(r + 1 - o.length), c = 0; c < f.length - 1; c++)
        f[c] = void 0;
      f[f.length - 1] = i, this.spliceWithArray_(o.length, 0, f);
    }
  }, e;
}();
function vj(e, t, n, r) {
  return n === void 0 && (n = process.env.NODE_ENV !== "production" ? "ObservableArray@" + mt() : "ObservableArray"), r === void 0 && (r = !1), Sw(), dr(function() {
    var i = new Vh(n, t, r, !1);
    Rw(i.values_, R, i);
    var o = new Proxy(i.values_, _j);
    return i.proxy_ = o, e && e.length && i.spliceWithArray_(0, 0, e), o;
  });
}
var Da = {
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
    for (var r = arguments.length, i = new Array(r > 2 ? r - 2 : 0), o = 2; o < r; o++)
      i[o - 2] = arguments[o];
    var s = this[R];
    switch (arguments.length) {
      case 0:
        return [];
      case 1:
        return s.spliceWithArray_(t);
      case 2:
        return s.spliceWithArray_(t, n);
    }
    return s.spliceWithArray_(t, n, i);
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
Z("at", wt);
Z("concat", wt);
Z("flat", wt);
Z("includes", wt);
Z("indexOf", wt);
Z("join", wt);
Z("lastIndexOf", wt);
Z("slice", wt);
Z("toString", wt);
Z("toLocaleString", wt);
Z("toSorted", wt);
Z("toSpliced", wt);
Z("with", wt);
Z("every", Yt);
Z("filter", Yt);
Z("find", Yt);
Z("findIndex", Yt);
Z("findLast", Yt);
Z("findLastIndex", Yt);
Z("flatMap", Yt);
Z("forEach", Yt);
Z("map", Yt);
Z("some", Yt);
Z("toReversed", Yt);
Z("reduce", vA);
Z("reduceRight", vA);
function Z(e, t) {
  typeof Array.prototype[e] == "function" && (Da[e] = t(e));
}
function wt(e) {
  return function() {
    var t = this[R];
    t.atom_.reportObserved();
    var n = t.dehanceValues_(t.values_);
    return n[e].apply(n, arguments);
  };
}
function Yt(e) {
  return function(t, n) {
    var r = this, i = this[R];
    i.atom_.reportObserved();
    var o = i.dehanceValues_(i.values_);
    return o[e](function(s, a) {
      return t.call(n, s, a, r);
    });
  };
}
function vA(e) {
  return function() {
    var t = this, n = this[R];
    n.atom_.reportObserved();
    var r = n.dehanceValues_(n.values_), i = arguments[0];
    return arguments[0] = function(o, s, a) {
      return i(o, s, a, t);
    }, r[e].apply(r, arguments);
  };
}
var gj = /* @__PURE__ */ hr("ObservableArrayAdministration", Vh);
function Ge(e) {
  return zu(e) && gj(e[R]);
}
var yj = {}, kn = "add", La = "delete", qh = /* @__PURE__ */ function() {
  function e(n, r, i) {
    var o = this;
    r === void 0 && (r = xr), i === void 0 && (i = process.env.NODE_ENV !== "production" ? "ObservableMap@" + mt() : "ObservableMap"), this.enhancer_ = void 0, this.name_ = void 0, this[R] = yj, this.data_ = void 0, this.hasMap_ = void 0, this.keysAtom_ = void 0, this.interceptors_ = void 0, this.changeListeners_ = void 0, this.dehancer = void 0, this.enhancer_ = r, this.name_ = i, oe(Map) || E(18), dr(function() {
      o.keysAtom_ = Ih(process.env.NODE_ENV !== "production" ? o.name_ + ".keys()" : "ObservableMap.keys()"), o.data_ = /* @__PURE__ */ new Map(), o.hasMap_ = /* @__PURE__ */ new Map(), n && o.merge(n);
    });
  }
  var t = e.prototype;
  return t.has_ = function(r) {
    return this.data_.has(r);
  }, t.has = function(r) {
    var i = this;
    if (!O.trackingDerivation)
      return this.has_(r);
    var o = this.hasMap_.get(r);
    if (!o) {
      var s = o = new Xn(this.has_(r), Vu, process.env.NODE_ENV !== "production" ? this.name_ + "." + hc(r) + "?" : "ObservableMap.key?", !1);
      this.hasMap_.set(r, s), zh(s, function() {
        return i.hasMap_.delete(r);
      });
    }
    return o.get();
  }, t.set = function(r, i) {
    var o = this.has_(r);
    if (Ot(this)) {
      var s = Et(this, {
        type: o ? zt : kn,
        object: this,
        newValue: i,
        name: r
      });
      if (!s)
        return this;
      i = s.newValue;
    }
    return o ? this.updateValue_(r, i) : this.addValue_(r, i), this;
  }, t.delete = function(r) {
    var i = this;
    if (nn(this.keysAtom_), Ot(this)) {
      var o = Et(this, {
        type: La,
        object: this,
        name: r
      });
      if (!o)
        return !1;
    }
    if (this.has_(r)) {
      var s = Se(), a = Wt(this), u = a || s ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: La,
        object: this,
        oldValue: this.data_.get(r).value_,
        name: r
      } : null;
      return process.env.NODE_ENV !== "production" && s && ct(u), Qt(function() {
        var f;
        i.keysAtom_.reportChanged(), (f = i.hasMap_.get(r)) == null || f.setNewValue_(!1);
        var c = i.data_.get(r);
        c.setNewValue_(void 0), i.data_.delete(r);
      }), a && kt(this, u), process.env.NODE_ENV !== "production" && s && lt(), !0;
    }
    return !1;
  }, t.updateValue_ = function(r, i) {
    var o = this.data_.get(r);
    if (i = o.prepareNewValue_(i), i !== O.UNCHANGED) {
      var s = Se(), a = Wt(this), u = a || s ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: zt,
        object: this,
        oldValue: o.value_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && s && ct(u), o.setNewValue_(i), a && kt(this, u), process.env.NODE_ENV !== "production" && s && lt();
    }
  }, t.addValue_ = function(r, i) {
    var o = this;
    nn(this.keysAtom_), Qt(function() {
      var f, c = new Xn(i, o.enhancer_, process.env.NODE_ENV !== "production" ? o.name_ + "." + hc(r) : "ObservableMap.key", !1);
      o.data_.set(r, c), i = c.value_, (f = o.hasMap_.get(r)) == null || f.setNewValue_(!0), o.keysAtom_.reportChanged();
    });
    var s = Se(), a = Wt(this), u = a || s ? {
      observableKind: "map",
      debugObjectName: this.name_,
      type: kn,
      object: this,
      name: r,
      newValue: i
    } : null;
    process.env.NODE_ENV !== "production" && s && ct(u), a && kt(this, u), process.env.NODE_ENV !== "production" && s && lt();
  }, t.get = function(r) {
    return this.has(r) ? this.dehanceValue_(this.data_.get(r).get()) : this.dehanceValue_(void 0);
  }, t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.keys = function() {
    return this.keysAtom_.reportObserved(), this.data_.keys();
  }, t.values = function() {
    var r = this, i = this.keys();
    return Jd({
      next: function() {
        var s = i.next(), a = s.done, u = s.value;
        return {
          done: a,
          value: a ? void 0 : r.get(u)
        };
      }
    });
  }, t.entries = function() {
    var r = this, i = this.keys();
    return Jd({
      next: function() {
        var s = i.next(), a = s.done, u = s.value;
        return {
          done: a,
          value: a ? void 0 : [u, r.get(u)]
        };
      }
    });
  }, t[Symbol.iterator] = function() {
    return this.entries();
  }, t.forEach = function(r, i) {
    for (var o = ei(this), s; !(s = o()).done; ) {
      var a = s.value, u = a[0], f = a[1];
      r.call(i, f, u, this);
    }
  }, t.merge = function(r) {
    var i = this;
    return _e(r) && (r = new Map(r)), Qt(function() {
      Ze(r) ? cL(r).forEach(function(o) {
        return i.set(o, r[o]);
      }) : Array.isArray(r) ? r.forEach(function(o) {
        var s = o[0], a = o[1];
        return i.set(s, a);
      }) : ki(r) ? (fL(r) || E(19, r), r.forEach(function(o, s) {
        return i.set(s, o);
      })) : r != null && E(20, r);
    }), this;
  }, t.clear = function() {
    var r = this;
    Qt(function() {
      Fh(function() {
        for (var i = ei(r.keys()), o; !(o = i()).done; ) {
          var s = o.value;
          r.delete(s);
        }
      });
    });
  }, t.replace = function(r) {
    var i = this;
    return Qt(function() {
      for (var o = bj(r), s = /* @__PURE__ */ new Map(), a = !1, u = ei(i.data_.keys()), f; !(f = u()).done; ) {
        var c = f.value;
        if (!o.has(c)) {
          var l = i.delete(c);
          if (l)
            a = !0;
          else {
            var h = i.data_.get(c);
            s.set(c, h);
          }
        }
      }
      for (var d = ei(o.entries()), _; !(_ = d()).done; ) {
        var v = _.value, g = v[0], y = v[1], b = i.data_.has(g);
        if (i.set(g, y), i.data_.has(g)) {
          var w = i.data_.get(g);
          s.set(g, w), b || (a = !0);
        }
      }
      if (!a)
        if (i.data_.size !== s.size)
          i.keysAtom_.reportChanged();
        else
          for (var m = i.data_.keys(), A = s.keys(), S = m.next(), P = A.next(); !S.done; ) {
            if (S.value !== P.value) {
              i.keysAtom_.reportChanged();
              break;
            }
            S = m.next(), P = A.next();
          }
      i.data_ = s;
    }), this;
  }, t.toString = function() {
    return "[object ObservableMap]";
  }, t.toJSON = function() {
    return Array.from(this);
  }, t.observe_ = function(r, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support fireImmediately=true in combination with maps."), Ns(this, r);
  }, t.intercept_ = function(r) {
    return $s(this, r);
  }, Gi(e, [{
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
}(), _e = /* @__PURE__ */ hr("ObservableMap", qh);
function Jd(e) {
  return e[Symbol.toStringTag] = "MapIterator", Hh(e);
}
function bj(e) {
  if (ki(e) || _e(e))
    return e;
  if (Array.isArray(e))
    return new Map(e);
  if (Ze(e)) {
    var t = /* @__PURE__ */ new Map();
    for (var n in e)
      t.set(n, e[n]);
    return t;
  } else
    return E(21, e);
}
var mj = {}, Wh = /* @__PURE__ */ function() {
  function e(n, r, i) {
    var o = this;
    r === void 0 && (r = xr), i === void 0 && (i = process.env.NODE_ENV !== "production" ? "ObservableSet@" + mt() : "ObservableSet"), this.name_ = void 0, this[R] = mj, this.data_ = /* @__PURE__ */ new Set(), this.atom_ = void 0, this.changeListeners_ = void 0, this.interceptors_ = void 0, this.dehancer = void 0, this.enhancer_ = void 0, this.name_ = i, oe(Set) || E(22), this.enhancer_ = function(s, a) {
      return r(s, a, i);
    }, dr(function() {
      o.atom_ = Ih(o.name_), n && o.replace(n);
    });
  }
  var t = e.prototype;
  return t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.clear = function() {
    var r = this;
    Qt(function() {
      Fh(function() {
        for (var i = ei(r.data_.values()), o; !(o = i()).done; ) {
          var s = o.value;
          r.delete(s);
        }
      });
    });
  }, t.forEach = function(r, i) {
    for (var o = ei(this), s; !(s = o()).done; ) {
      var a = s.value;
      r.call(i, a, a, this);
    }
  }, t.add = function(r) {
    var i = this;
    if (nn(this.atom_), Ot(this)) {
      var o = Et(this, {
        type: kn,
        object: this,
        newValue: r
      });
      if (!o)
        return this;
      r = o.newValue;
    }
    if (!this.has(r)) {
      Qt(function() {
        i.data_.add(i.enhancer_(r, void 0)), i.atom_.reportChanged();
      });
      var s = process.env.NODE_ENV !== "production" && Se(), a = Wt(this), u = a || s ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: kn,
        object: this,
        newValue: r
      } : null;
      s && process.env.NODE_ENV !== "production" && ct(u), a && kt(this, u), s && process.env.NODE_ENV !== "production" && lt();
    }
    return this;
  }, t.delete = function(r) {
    var i = this;
    if (Ot(this)) {
      var o = Et(this, {
        type: La,
        object: this,
        oldValue: r
      });
      if (!o)
        return !1;
    }
    if (this.has(r)) {
      var s = process.env.NODE_ENV !== "production" && Se(), a = Wt(this), u = a || s ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: La,
        object: this,
        oldValue: r
      } : null;
      return s && process.env.NODE_ENV !== "production" && ct(u), Qt(function() {
        i.atom_.reportChanged(), i.data_.delete(r);
      }), a && kt(this, u), s && process.env.NODE_ENV !== "production" && lt(), !0;
    }
    return !1;
  }, t.has = function(r) {
    return this.atom_.reportObserved(), this.data_.has(this.dehanceValue_(r));
  }, t.entries = function() {
    var r = this.values();
    return Zd({
      next: function() {
        var o = r.next(), s = o.value, a = o.done;
        return a ? {
          value: void 0,
          done: a
        } : {
          value: [s, s],
          done: a
        };
      }
    });
  }, t.keys = function() {
    return this.values();
  }, t.values = function() {
    this.atom_.reportObserved();
    var r = this, i = this.data_.values();
    return Zd({
      next: function() {
        var s = i.next(), a = s.value, u = s.done;
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
    if ($n(r) && !le(r))
      return r.intersection(this);
    var i = new Set(this);
    return i.intersection(r);
  }, t.union = function(r) {
    if ($n(r) && !le(r))
      return r.union(this);
    var i = new Set(this);
    return i.union(r);
  }, t.difference = function(r) {
    return new Set(this).difference(r);
  }, t.symmetricDifference = function(r) {
    if ($n(r) && !le(r))
      return r.symmetricDifference(this);
    var i = new Set(this);
    return i.symmetricDifference(r);
  }, t.isSubsetOf = function(r) {
    return new Set(this).isSubsetOf(r);
  }, t.isSupersetOf = function(r) {
    return new Set(this).isSupersetOf(r);
  }, t.isDisjointFrom = function(r) {
    if ($n(r) && !le(r))
      return r.isDisjointFrom(this);
    var i = new Set(this);
    return i.isDisjointFrom(r);
  }, t.replace = function(r) {
    var i = this;
    return le(r) && (r = new Set(r)), Qt(function() {
      Array.isArray(r) ? (i.clear(), r.forEach(function(o) {
        return i.add(o);
      })) : $n(r) ? (i.clear(), r.forEach(function(o) {
        return i.add(o);
      })) : r != null && E("Cannot initialize set from " + r);
    }), this;
  }, t.observe_ = function(r, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support fireImmediately=true in combination with sets."), Ns(this, r);
  }, t.intercept_ = function(r) {
    return $s(this, r);
  }, t.toJSON = function() {
    return Array.from(this);
  }, t.toString = function() {
    return "[object ObservableSet]";
  }, t[Symbol.iterator] = function() {
    return this.values();
  }, Gi(e, [{
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
}(), le = /* @__PURE__ */ hr("ObservableSet", Wh);
function Zd(e) {
  return e[Symbol.toStringTag] = "SetIterator", Hh(e);
}
var Qd = /* @__PURE__ */ Object.create(null), e_ = "remove", wc = /* @__PURE__ */ function() {
  function e(n, r, i, o) {
    r === void 0 && (r = /* @__PURE__ */ new Map()), o === void 0 && (o = kL), this.target_ = void 0, this.values_ = void 0, this.name_ = void 0, this.defaultAnnotation_ = void 0, this.keysAtom_ = void 0, this.changeListeners_ = void 0, this.interceptors_ = void 0, this.proxy_ = void 0, this.isPlainObject_ = void 0, this.appliedAnnotations_ = void 0, this.pendingKeys_ = void 0, this.target_ = n, this.values_ = r, this.name_ = i, this.defaultAnnotation_ = o, this.keysAtom_ = new pr(process.env.NODE_ENV !== "production" ? this.name_ + ".keys" : "ObservableObject.keys"), this.isPlainObject_ = Ze(this.target_), process.env.NODE_ENV !== "production" && !mA(this.defaultAnnotation_) && E("defaultAnnotation must be valid annotation"), process.env.NODE_ENV !== "production" && (this.appliedAnnotations_ = {});
  }
  var t = e.prototype;
  return t.getObservablePropValue_ = function(r) {
    return this.values_.get(r).get();
  }, t.setObservablePropValue_ = function(r, i) {
    var o = this.values_.get(r);
    if (o instanceof It)
      return o.set(i), !0;
    if (Ot(this)) {
      var s = Et(this, {
        type: zt,
        object: this.proxy_ || this.target_,
        name: r,
        newValue: i
      });
      if (!s)
        return null;
      i = s.newValue;
    }
    if (i = o.prepareNewValue_(i), i !== O.UNCHANGED) {
      var a = Wt(this), u = process.env.NODE_ENV !== "production" && Se(), f = a || u ? {
        type: zt,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        oldValue: o.value_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && u && ct(f), o.setNewValue_(i), a && kt(this, f), process.env.NODE_ENV !== "production" && u && lt();
    }
    return !0;
  }, t.get_ = function(r) {
    return O.trackingDerivation && !ft(this.target_, r) && this.has_(r), this.target_[r];
  }, t.set_ = function(r, i, o) {
    return o === void 0 && (o = !1), ft(this.target_, r) ? this.values_.has(r) ? this.setObservablePropValue_(r, i) : o ? Reflect.set(this.target_, r, i) : (this.target_[r] = i, !0) : this.extend_(r, {
      value: i,
      enumerable: !0,
      writable: !0,
      configurable: !0
    }, this.defaultAnnotation_, o);
  }, t.has_ = function(r) {
    if (!O.trackingDerivation)
      return r in this.target_;
    this.pendingKeys_ || (this.pendingKeys_ = /* @__PURE__ */ new Map());
    var i = this.pendingKeys_.get(r);
    return i || (i = new Xn(r in this.target_, Vu, process.env.NODE_ENV !== "production" ? this.name_ + "." + hc(r) + "?" : "ObservableObject.key?", !1), this.pendingKeys_.set(r, i)), i.get();
  }, t.make_ = function(r, i) {
    if (i === !0 && (i = this.defaultAnnotation_), i !== !1) {
      if (r_(this, i, r), !(r in this.target_)) {
        var o;
        if ((o = this.target_[Ke]) != null && o[r])
          return;
        E(1, i.annotationType_, this.name_ + "." + r.toString());
      }
      for (var s = this.target_; s && s !== Os; ) {
        var a = $a(s, r);
        if (a) {
          var u = i.make_(this, r, a, s);
          if (u === 0)
            return;
          if (u === 1)
            break;
        }
        s = Object.getPrototypeOf(s);
      }
      n_(this, i, r);
    }
  }, t.extend_ = function(r, i, o, s) {
    if (s === void 0 && (s = !1), o === !0 && (o = this.defaultAnnotation_), o === !1)
      return this.defineProperty_(r, i, s);
    r_(this, o, r);
    var a = o.extend_(this, r, i, s);
    return a && n_(this, o, r), a;
  }, t.defineProperty_ = function(r, i, o) {
    o === void 0 && (o = !1), nn(this.keysAtom_);
    try {
      Ye();
      var s = this.delete_(r);
      if (!s)
        return s;
      if (Ot(this)) {
        var a = Et(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: kn,
          newValue: i.value
        });
        if (!a)
          return null;
        var u = a.newValue;
        i.value !== u && (i = fn({}, i, {
          value: u
        }));
      }
      if (o) {
        if (!Reflect.defineProperty(this.target_, r, i))
          return !1;
      } else
        on(this.target_, r, i);
      this.notifyPropertyAddition_(r, i.value);
    } finally {
      Xe();
    }
    return !0;
  }, t.defineObservableProperty_ = function(r, i, o, s) {
    s === void 0 && (s = !1), nn(this.keysAtom_);
    try {
      Ye();
      var a = this.delete_(r);
      if (!a)
        return a;
      if (Ot(this)) {
        var u = Et(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: kn,
          newValue: i
        });
        if (!u)
          return null;
        i = u.newValue;
      }
      var f = t_(r), c = {
        configurable: O.safeDescriptors ? this.isPlainObject_ : !0,
        enumerable: !0,
        get: f.get,
        set: f.set
      };
      if (s) {
        if (!Reflect.defineProperty(this.target_, r, c))
          return !1;
      } else
        on(this.target_, r, c);
      var l = new Xn(i, o, process.env.NODE_ENV !== "production" ? this.name_ + "." + r.toString() : "ObservableObject.key", !1);
      this.values_.set(r, l), this.notifyPropertyAddition_(r, l.value_);
    } finally {
      Xe();
    }
    return !0;
  }, t.defineComputedProperty_ = function(r, i, o) {
    o === void 0 && (o = !1), nn(this.keysAtom_);
    try {
      Ye();
      var s = this.delete_(r);
      if (!s)
        return s;
      if (Ot(this)) {
        var a = Et(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: kn,
          newValue: void 0
        });
        if (!a)
          return null;
      }
      i.name || (i.name = process.env.NODE_ENV !== "production" ? this.name_ + "." + r.toString() : "ObservableObject.key"), i.context = this.proxy_ || this.target_;
      var u = t_(r), f = {
        configurable: O.safeDescriptors ? this.isPlainObject_ : !0,
        enumerable: !1,
        get: u.get,
        set: u.set
      };
      if (o) {
        if (!Reflect.defineProperty(this.target_, r, f))
          return !1;
      } else
        on(this.target_, r, f);
      this.values_.set(r, new It(i)), this.notifyPropertyAddition_(r, void 0);
    } finally {
      Xe();
    }
    return !0;
  }, t.delete_ = function(r, i) {
    if (i === void 0 && (i = !1), nn(this.keysAtom_), !ft(this.target_, r))
      return !0;
    if (Ot(this)) {
      var o = Et(this, {
        object: this.proxy_ || this.target_,
        name: r,
        type: e_
      });
      if (!o)
        return null;
    }
    try {
      var s;
      Ye();
      var a = Wt(this), u = process.env.NODE_ENV !== "production" && Se(), f = this.values_.get(r), c = void 0;
      if (!f && (a || u)) {
        var l;
        c = (l = $a(this.target_, r)) == null ? void 0 : l.value;
      }
      if (i) {
        if (!Reflect.deleteProperty(this.target_, r))
          return !1;
      } else
        delete this.target_[r];
      if (process.env.NODE_ENV !== "production" && delete this.appliedAnnotations_[r], f && (this.values_.delete(r), f instanceof Xn && (c = f.value_), Yw(f)), this.keysAtom_.reportChanged(), (s = this.pendingKeys_) == null || (s = s.get(r)) == null || s.set(r in this.target_), a || u) {
        var h = {
          type: e_,
          observableKind: "object",
          object: this.proxy_ || this.target_,
          debugObjectName: this.name_,
          oldValue: c,
          name: r
        };
        process.env.NODE_ENV !== "production" && u && ct(h), a && kt(this, h), process.env.NODE_ENV !== "production" && u && lt();
      }
    } finally {
      Xe();
    }
    return !0;
  }, t.observe_ = function(r, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support the fire immediately property for observable objects."), Ns(this, r);
  }, t.intercept_ = function(r) {
    return $s(this, r);
  }, t.notifyPropertyAddition_ = function(r, i) {
    var o, s = Wt(this), a = process.env.NODE_ENV !== "production" && Se();
    if (s || a) {
      var u = s || a ? {
        type: kn,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && a && ct(u), s && kt(this, u), process.env.NODE_ENV !== "production" && a && lt();
    }
    (o = this.pendingKeys_) == null || (o = o.get(r)) == null || o.set(!0), this.keysAtom_.reportChanged();
  }, t.ownKeys_ = function() {
    return this.keysAtom_.reportObserved(), Ei(this.target_);
  }, t.keys_ = function() {
    return this.keysAtom_.reportObserved(), Object.keys(this.target_);
  }, e;
}();
function kr(e, t) {
  var n;
  if (process.env.NODE_ENV !== "production" && t && he(e) && E("Options can't be provided for already observable objects."), ft(e, R))
    return process.env.NODE_ENV !== "production" && !(ln(e) instanceof wc) && E("Cannot convert '" + Vo(e) + `' into observable object:
The target is already observable of different type.
Extending builtins is not supported.`), e;
  process.env.NODE_ENV !== "production" && !Object.isExtensible(e) && E("Cannot make the designated object observable; it is not extensible");
  var r = (n = t?.name) != null ? n : process.env.NODE_ENV !== "production" ? (Ze(e) ? "ObservableObject" : e.constructor.name) + "@" + mt() : "ObservableObject", i = new wc(e, /* @__PURE__ */ new Map(), String(r), nF(t));
  return Es(e, R, i), e;
}
var wj = /* @__PURE__ */ hr("ObservableObjectAdministration", wc);
function t_(e) {
  return Qd[e] || (Qd[e] = {
    get: function() {
      return this[R].getObservablePropValue_(e);
    },
    set: function(n) {
      return this[R].setObservablePropValue_(e, n);
    }
  });
}
function he(e) {
  return zu(e) ? wj(e[R]) : !1;
}
function n_(e, t, n) {
  var r;
  process.env.NODE_ENV !== "production" && (e.appliedAnnotations_[n] = t), (r = e.target_[Ke]) == null || delete r[n];
}
function r_(e, t, n) {
  if (process.env.NODE_ENV !== "production" && !mA(t) && E("Cannot annotate '" + e.name_ + "." + n.toString() + "': Invalid annotation."), process.env.NODE_ENV !== "production" && !Ma(t) && ft(e.appliedAnnotations_, n)) {
    var r = e.name_ + "." + n.toString(), i = e.appliedAnnotations_[n].annotationType_, o = t.annotationType_;
    E("Cannot apply '" + o + "' to '" + r + "':" + (`
The field is already annotated with '` + i + "'.") + `
Re-annotating fields is not allowed.
Use 'override' annotation for methods overridden by subclass.`);
  }
}
var Aj = /* @__PURE__ */ yA(0), Oj = /* @__PURE__ */ function() {
  var e = !1, t = {};
  return Object.defineProperty(t, "0", {
    set: function() {
      e = !0;
    }
  }), Object.create(t)[0] = 1, e === !1;
}(), Of = 0, gA = function() {
};
function Ej(e, t) {
  Object.setPrototypeOf ? Object.setPrototypeOf(e.prototype, t) : e.prototype.__proto__ !== void 0 ? e.prototype.__proto__ = t : e.prototype = t;
}
Ej(gA, Array.prototype);
var kh = /* @__PURE__ */ function(e) {
  function t(r, i, o, s) {
    var a;
    return o === void 0 && (o = process.env.NODE_ENV !== "production" ? "ObservableArray@" + mt() : "ObservableArray"), s === void 0 && (s = !1), a = e.call(this) || this, dr(function() {
      var u = new Vh(o, i, s, !0);
      u.proxy_ = a, Rw(a, R, u), r && r.length && a.spliceWithArray(0, 0, r), Oj && Object.defineProperty(a, "0", Aj);
    }), a;
  }
  Nw(t, e);
  var n = t.prototype;
  return n.concat = function() {
    this[R].atom_.reportObserved();
    for (var i = arguments.length, o = new Array(i), s = 0; s < i; s++)
      o[s] = arguments[s];
    return Array.prototype.concat.apply(
      this.slice(),
      //@ts-ignore
      o.map(function(a) {
        return Ge(a) ? a.slice() : a;
      })
    );
  }, n[Symbol.iterator] = function() {
    var r = this, i = 0;
    return Hh({
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
  }, Gi(t, [{
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
}(gA);
Object.entries(Da).forEach(function(e) {
  var t = e[0], n = e[1];
  t !== "concat" && Es(kh.prototype, t, n);
});
function yA(e) {
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
function Sj(e) {
  on(kh.prototype, "" + e, yA(e));
}
function bA(e) {
  if (e > Of) {
    for (var t = Of; t < e + 100; t++)
      Sj(t);
    Of = e;
  }
}
bA(1e3);
function xj(e, t, n) {
  return new kh(e, t, n);
}
function Kt(e, t) {
  if (typeof e == "object" && e !== null) {
    if (Ge(e))
      return t !== void 0 && E(23), e[R].atom_;
    if (le(e))
      return e.atom_;
    if (_e(e)) {
      if (t === void 0)
        return e.keysAtom_;
      var n = e.data_.get(t) || e.hasMap_.get(t);
      return n || E(25, t, Vo(e)), n;
    }
    if (he(e)) {
      if (!t)
        return E(26);
      var r = e[R].values_.get(t);
      return r || E(27, t, Vo(e)), r;
    }
    if (Ph(e) || Rr(e) || Ca(e))
      return e;
  } else if (oe(e) && Ca(e[R]))
    return e[R];
  E(28);
}
function ln(e, t) {
  if (e || E(29), t !== void 0)
    return ln(Kt(e, t));
  if (Ph(e) || Rr(e) || Ca(e) || _e(e) || le(e))
    return e;
  if (e[R])
    return e[R];
  E(24, e);
}
function Vo(e, t) {
  var n;
  if (t !== void 0)
    n = Kt(e, t);
  else {
    if ($r(e))
      return e.name;
    he(e) || _e(e) || le(e) ? n = ln(e) : n = Kt(e);
  }
  return n.name_;
}
function dr(e) {
  var t = Wr(), n = Wu(!0);
  Ye();
  try {
    return e();
  } finally {
    Xe(), ku(n), Mn(t);
  }
}
var i_ = Os.toString;
function Gh(e, t, n) {
  return n === void 0 && (n = -1), Ac(e, t, n);
}
function Ac(e, t, n, r, i) {
  if (e === t)
    return e !== 0 || 1 / e === 1 / t;
  if (e == null || t == null)
    return !1;
  if (e !== e)
    return t !== t;
  var o = typeof e;
  if (o !== "function" && o !== "object" && typeof t != "object")
    return !1;
  var s = i_.call(e);
  if (s !== i_.call(t))
    return !1;
  switch (s) {
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
  e = o_(e), t = o_(t);
  var a = s === "[object Array]";
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
      if (!Ac(e[c], t[c], n - 1, r, i))
        return !1;
  } else {
    var l = Object.keys(e), h = l.length;
    if (Object.keys(t).length !== h)
      return !1;
    for (var d = 0; d < h; d++) {
      var _ = l[d];
      if (!(ft(t, _) && Ac(e[_], t[_], n - 1, r, i)))
        return !1;
    }
  }
  return r.pop(), i.pop(), !0;
}
function o_(e) {
  return Ge(e) ? e.slice() : ki(e) || _e(e) || $n(e) || le(e) ? Array.from(e.entries()) : e;
}
var s_, Rj = ((s_ = Bu().Iterator) == null ? void 0 : s_.prototype) || {};
function Hh(e) {
  return e[Symbol.iterator] = Tj, Object.assign(Object.create(Rj), e);
}
function Tj() {
  return this;
}
function mA(e) {
  return (
    // Can be function
    e instanceof Object && typeof e.annotationType_ == "string" && oe(e.make_) && oe(e.extend_)
  );
}
["Symbol", "Map", "Set"].forEach(function(e) {
  var t = Bu();
  typeof t[e] > "u" && E("MobX requires global '" + e + "' to be available or polyfilled");
});
typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ == "object" && __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
  spy: Qw,
  extras: {
    getDebugName: Vo
  },
  $mobx: R
});
const WB = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $mobx: R,
  FlowCancellationError: Hu,
  ObservableMap: qh,
  ObservableSet: Wh,
  Reaction: cn,
  _allowStateChanges: Dh,
  _allowStateChangesInsideComputed: Kd,
  _allowStateReadsEnd: ai,
  _allowStateReadsStart: Gu,
  _autoAction: Si,
  _endAction: Vw,
  _getAdministration: ln,
  _getGlobalState: vF,
  _interceptReads: kF,
  _isComputingDerivation: cF,
  _resetGlobalState: gF,
  _startAction: Uw,
  action: Wn,
  autorun: Bh,
  comparer: Sr,
  computed: Ts,
  configure: jF,
  createAtom: Ih,
  defineProperty: nj,
  entries: QF,
  extendObservable: Uh,
  flow: Nr,
  flowResult: WF,
  get: tj,
  getAtom: Kt,
  getDebugName: Vo,
  getDependencyTree: sA,
  getObserverTree: BF,
  has: hA,
  intercept: GF,
  isAction: $r,
  isBoxedObservable: Lh,
  isComputed: YF,
  isComputedProp: XF,
  isFlow: xi,
  isFlowCancellationError: VF,
  isObservable: Mr,
  isObservableArray: Ge,
  isObservableMap: _e,
  isObservableObject: he,
  isObservableProp: JF,
  isObservableSet: le,
  keys: Uo,
  makeAutoObservable: pj,
  makeObservable: hj,
  observable: ye,
  observe: rj,
  onBecomeObserved: iA,
  onBecomeUnobserved: zh,
  onReactionError: OF,
  override: EL,
  ownKeys: pA,
  reaction: PF,
  remove: ej,
  runInAction: Kd,
  set: lA,
  spy: Qw,
  toJS: sj,
  trace: dA,
  transaction: Qt,
  untracked: Fh,
  values: ZF,
  when: uj
}, Symbol.toStringTag, { value: "Module" }));
function wA(e, t) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function bn(e, t, n) {
  return e.context ? e.callback(n, ...t) : e.callback(...t);
}
class $j {
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
class mn {
  taps;
  interceptions;
  constructor() {
    this.taps = [], this.interceptions = new $j();
  }
  tap(t, n) {
    const r = typeof t == "string" ? {
      name: t,
      context: !1
    } : {
      context: !1,
      ...t
    }, o = {
      key: Symbol(r.name),
      ...r,
      callback: n
    };
    if (o.before) {
      let s = this.taps.length;
      const a = new Set(
        Array.isArray(o.before) ? o.before : [o.before]
      );
      for (s; s > 0 && a.size > 0; s--) {
        const u = this.taps[s - 1];
        if (a.has(u.name) && a.delete(u.name), u.before && wA(o.name, u.before))
          break;
      }
      this.taps.splice(s, 0, o);
    } else
      this.taps.push(o);
    return this.interceptions.tap(o), o;
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
class Nj extends mn {
  call(...t) {
    if (!this.isUsed())
      return;
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      this.taps.forEach((r) => {
        bn(r, t, n);
      });
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
    this.interceptions.done();
  }
}
class Mj extends mn {
  call(...t) {
    if (!this.isUsed())
      return;
    const n = {};
    this.interceptions.call(n, ...t);
    for (let r = 0; r < this.taps.length; r += 1) {
      const i = bn(this.taps[r], t, n);
      if (i !== void 0)
        return this.interceptions.result(i), i;
    }
    this.interceptions.done();
  }
}
class Pj extends mn {
  call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    let [r, ...i] = t;
    for (let o = 0; o < this.taps.length; o += 1) {
      const s = bn(this.taps[o], [r, ...i], n);
      s !== void 0 && (r = s);
    }
    return this.interceptions.result(r), r;
  }
}
class Ij extends mn {
  call(...t) {
    let n = !1;
    const r = {};
    this.interceptions.call(r, ...t);
    try {
      for (; n !== !0; ) {
        n = !0, this.interceptions.loop(...t);
        for (let i = 0; i < this.taps.length; i += 1)
          if (bn(this.taps[i], t, r) !== void 0) {
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
class Cj extends mn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t), await Promise.allSettled(this.taps.map((r) => bn(r, t, n))), this.interceptions.done();
  }
}
class Dj extends mn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      const r = await Promise.race(
        this.taps.map((i) => bn(i, t, n))
      );
      return this.interceptions.result(r), r;
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
  }
}
class Lj extends mn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      for (let r = 0; r < this.taps.length; r += 1)
        await bn(this.taps[r], t, n);
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
    this.interceptions.done();
  }
}
class Fj extends mn {
  async call(...t) {
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      for (let r = 0; r < this.taps.length; r += 1) {
        const i = await bn(this.taps[r], t, n);
        if (i !== void 0)
          return this.interceptions.result(i), i;
      }
    } catch (r) {
      throw this.interceptions.error(r), r;
    }
    this.interceptions.done();
  }
}
class jj extends mn {
  async call(...t) {
    let [n, ...r] = t;
    const i = {};
    this.interceptions.call(i, ...t);
    try {
      for (let o = 0; o < this.taps.length; o += 1) {
        const s = await bn(
          this.taps[o],
          [n, ...r],
          i
        );
        s !== void 0 && (n = s);
      }
    } catch (o) {
      throw this.interceptions.error(o), o;
    }
    return this.interceptions.result(n), n;
  }
}
class Bj extends mn {
  async call(...t) {
    let n = !1;
    const r = {};
    this.interceptions.call(r, ...t);
    try {
      for (; n !== !0; ) {
        n = !0, this.interceptions.loop(...t);
        for (let i = 0; i < this.taps.length; i += 1)
          if (await bn(this.taps[i], t, r) !== void 0) {
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
const kB = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AsyncParallelBailHook: Dj,
  AsyncParallelHook: Cj,
  AsyncSeriesBailHook: Fj,
  AsyncSeriesHook: Lj,
  AsyncSeriesLoopHook: Bj,
  AsyncSeriesWaterfallHook: jj,
  SyncBailHook: Mj,
  SyncHook: Nj,
  SyncLoopHook: Ij,
  SyncWaterfallHook: Pj,
  equalToOrIn: wA
}, Symbol.toStringTag, { value: "Module" }));
function Oc(e, t) {
  if (e === t) return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    if (e.constructor !== t.constructor) return !1;
    var n, r, i;
    if (Array.isArray(e)) {
      if (n = e.length, n != t.length) return !1;
      for (r = n; r-- !== 0; )
        if (!Oc(e[r], t[r])) return !1;
      return !0;
    }
    if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
    if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf();
    if (e.toString !== Object.prototype.toString) return e.toString() === t.toString();
    if (i = Object.keys(e), n = i.length, n !== Object.keys(t).length) return !1;
    for (r = n; r-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(t, i[r])) return !1;
    for (r = n; r-- !== 0; ) {
      var o = i[r];
      if (!Oc(e[o], t[o])) return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
class zj {
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
    return Oc(t, n);
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
class AA {
  static create(t, n) {
    return new AA(t, n);
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
    this.addOptionFromInstance(t, new zj(this.context, n));
  }
}
function GB(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce(
    (t, n) => (...r) => t(n(...r))
  );
}
function Uj(e) {
  return Vj(e) && !qj(e);
}
function Vj(e) {
  return !!e && typeof e == "object";
}
function qj(e) {
  var t = Object.prototype.toString.call(e);
  return t === "[object RegExp]" || t === "[object Date]" || Gj(e);
}
var Wj = typeof Symbol == "function" && Symbol.for, kj = Wj ? Symbol.for("react.element") : 60103;
function Gj(e) {
  return e.$$typeof === kj;
}
var Hj = Uj;
function Kj(e) {
  return Array.isArray(e) ? [] : {};
}
function qo(e, t) {
  return t.clone !== !1 && t.isMergeableObject(e) ? Wo(Kj(e), e, t) : e;
}
function Yj(e, t, n) {
  return e.concat(t).map(function(r) {
    return qo(r, n);
  });
}
function Xj(e, t) {
  if (!t.customMerge)
    return Wo;
  var n = t.customMerge(e);
  return typeof n == "function" ? n : Wo;
}
function Jj(e) {
  return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(e).filter(function(t) {
    return Object.propertyIsEnumerable.call(e, t);
  }) : [];
}
function a_(e) {
  return Object.keys(e).concat(Jj(e));
}
function OA(e, t) {
  try {
    return t in e;
  } catch {
    return !1;
  }
}
function Zj(e, t) {
  return OA(e, t) && !(Object.hasOwnProperty.call(e, t) && Object.propertyIsEnumerable.call(e, t));
}
function Qj(e, t, n) {
  var r = {};
  return n.isMergeableObject(e) && a_(e).forEach(function(i) {
    r[i] = qo(e[i], n);
  }), a_(t).forEach(function(i) {
    Zj(e, i) || (OA(e, i) && n.isMergeableObject(t[i]) ? r[i] = Xj(i, n)(e[i], t[i], n) : r[i] = qo(t[i], n));
  }), r;
}
function Wo(e, t, n) {
  n = n || {}, n.arrayMerge = n.arrayMerge || Yj, n.isMergeableObject = n.isMergeableObject || Hj, n.cloneUnlessOtherwiseSpecified = qo;
  var r = Array.isArray(t), i = Array.isArray(e), o = r === i;
  return o ? r ? n.arrayMerge?.(e, t, n) : Qj(e, t, n) : qo(t, n);
}
function eB(e, t) {
  if (!Array.isArray(e))
    throw new Error("first argument should be an array");
  return e.reduce(function(n, r) {
    return Wo(n, r, t);
  }, {});
}
Wo.all = eB;
function Yr(e, t = 0, n = 1) {
  return Math.min(Math.max(e, t), n);
}
function tB(e, t, n) {
  e /= 255, t /= 255, n /= 255;
  const r = Math.max(e, t, n), i = Math.min(e, t, n);
  let o = 0, s, a = (r + i) / 2;
  if (r == i)
    o = s = 0;
  else {
    const u = r - i;
    switch (s = a > 0.5 ? u / (2 - r - i) : u / (r + i), r) {
      case e:
        o = (t - n) / u + (t < n ? 6 : 0);
        break;
      case t:
        o = (n - e) / u + 2;
        break;
      case n:
        o = (e - t) / u + 4;
        break;
    }
    o /= 6;
  }
  return { h: o, s, l: a };
}
function u_(e, t, n) {
  let r, i, o;
  if (t == 0)
    r = i = o = n;
  else {
    const s = (f, c, l) => (l < 0 && (l += 1), l > 1 && (l -= 1), l < 0.16666666666666666 ? f + (c - f) * 6 * l : l < 0.5 ? c : l < 0.6666666666666666 ? f + (c - f) * (0.6666666666666666 - l) * 6 : f), a = n < 0.5 ? n * (1 + t) : n + t - n * t, u = 2 * n - a;
    r = s(u, a, e + 1 / 3), i = s(u, a, e), o = s(u, a, e - 1 / 3);
  }
  return { r: r * 255, g: i * 255, b: o * 255 };
}
function HB(e, t, n) {
  e /= 255, t /= 255, n /= 255;
  const r = Math.max(e, t, n), i = Math.min(e, t, n);
  let o = 0, s, a = r;
  const u = r - i;
  if (s = r == 0 ? 0 : u / r, r == i)
    o = 0;
  else {
    switch (r) {
      case e:
        o = (t - n) / u + (t < n ? 6 : 0);
        break;
      case t:
        o = (n - e) / u + 2;
        break;
      case n:
        o = (e - t) / u + 4;
        break;
    }
    o /= 6;
  }
  return { h: o, s, v: a };
}
function nB(e, t, n) {
  let r = 0, i = 0, o = 0;
  const s = Math.floor(e * 6), a = e * 6 - s, u = n * (1 - t), f = n * (1 - a * t), c = n * (1 - (1 - a) * t);
  switch (s % 6) {
    case 0:
      r = n, i = c, o = u;
      break;
    case 1:
      r = f, i = n, o = u;
      break;
    case 2:
      r = u, i = n, o = c;
      break;
    case 3:
      r = u, i = f, o = n;
      break;
    case 4:
      r = c, i = u, o = n;
      break;
    case 5:
      r = n, i = u, o = f;
      break;
  }
  return { r: r * 255, g: i * 255, b: o * 255 };
}
function KB(e, t, n) {
  const r = n + t * Math.min(n, 1 - n), i = r === 0 ? 0 : 2 * (1 - n / r);
  return { h: e, s: i, v: r };
}
function YB(e, t, n) {
  const r = (2 - t) * n / 2, i = t === 0 ? t : r <= 1 ? t * n / (2 - t * n) : t * n / (2 - t);
  return { h: e, s: i, l: r };
}
function rB(e) {
  typeof e == "string" && (e = e.replace("#", ""), e = e.length === 3 ? e.replace(/(\w)/g, "$1$1") : e, e = parseInt("0x" + e, 16));
  const t = e, n = t >> 16 & 255, r = t >> 8 & 255, i = t & 255;
  return { r: n, g: r, b: i };
}
function iB(e, t, n) {
  const r = e.r + (t.r - e.r) * n, i = e.g + (t.g - e.g) * n, o = e.b + (t.b - e.b) * n;
  return { r, g: i, b: o };
}
const f_ = {
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
class nt {
  static Transparent = nt.fromRGBA(0, 0, 0, 0);
  static BLACK = nt.fromRGB(0, 0, 0);
  static WHITE = nt.fromRGB(255, 255, 255);
  static isColor(t) {
    return typeof t == "string" || typeof t == "number" || t instanceof nt;
  }
  static parse(t) {
    const n = typeof t == "string";
    if (n && t.toLowerCase().startsWith("rgb")) {
      const r = t.match(/rgba?\s*\(([^)]+)\)\s*/i);
      if (r) {
        const i = r[1].split(",").map(parseInt), o = this.fromRGB(i[0], i[1], i[2]);
        return i.length === 4 && (o.alpha = i[3]), o;
      }
    } else if (n && t.startsWith("#") || typeof t == "number")
      return this.fromRGB(rB(t));
    if (n && f_[t]) {
      const r = f_[t];
      return this.fromRGB(r[0] * 255 >> 0, r[1] * 255 >> 0, r[2] * 255 >> 0);
    } else if (typeof t == "object" && t !== null)
      return this.fromRGB(t);
    return this.fromRGB(0, 0, 0);
  }
  static fromRGB(t, n, r) {
    return t !== null && typeof t == "object" ? new nt(t.r, t.g, t.b) : new nt(t, n, r);
  }
  static fromRGBA(t, n, r, i) {
    return t !== null && typeof t == "object" ? new nt(t.r, t.g, t.b, n) : new nt(t, n, r, i);
  }
  static fromHSL(t, n, r) {
    const { r: i, g: o, b: s } = u_(t, n, r);
    return new nt(i, o, s);
  }
  static fromHSV(t, n, r) {
    const { r: i, g: o, b: s } = nB(t, n, r);
    return new nt(i, o, s);
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
    return nt.fromRGB(0, 0, 0).copy(this);
  }
  setRGB(t, n, r) {
    return this._r = t, this._g = n, this._b = r, this;
  }
  normalize() {
    return this.r = Yr(this._r / 255, 0, 1), this.g = Yr(this._g / 255, 0, 1), this.b = Yr(this._b / 255, 0, 1), this;
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
    const { r: i, g: o, b: s } = iB(t, n, r);
    return new nt(i, o, s);
  }
  setRBG(t, n, r) {
    return this.r = t, this.g = n, this.b = r, this;
  }
  setRGBColor(t) {
    return this.r = t.r, this.g = t.g, this.b = t.b, this;
  }
  // 变亮
  brighten(t) {
    const { h: n, s: r, l: i } = tB(this.r, this.g, this.b);
    return this.setRGBColor(u_(n, r, i * (1 + t)));
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
    return this.r = Yr(this.r, t, n), this.g = Yr(this.g, t, n), this.b = Yr(this.b, t, n), this;
  }
  toCssRGB() {
    return `rgb(${Math.round(this.r)},${Math.round(this.g)},${Math.round(this.b)})`;
  }
}
const Ku = 3, oB = {
  grad: 360 / 400,
  turn: 360,
  rad: 360 / (Math.PI * 2)
}, Pn = (e) => typeof e == "string" ? e.length > 0 : typeof e == "number", me = (e, t = 0, n = Math.pow(10, t)) => Math.round(n * e) / n + 0, xt = (e, t = 0, n = 1) => e > n ? n : e > t ? e : t, EA = (e) => (e = isFinite(e) ? e % 360 : 0, e > 0 ? e : e + 360), sB = (e, t = "deg") => Number(e) * (oB[t] || 1), SA = (e) => ({
  r: xt(e.r, 0, 255),
  g: xt(e.g, 0, 255),
  b: xt(e.b, 0, 255),
  a: xt(e.a)
}), Kh = (e) => ({
  r: me(e.r),
  g: me(e.g),
  b: me(e.b),
  a: me(e.a, Ku)
}), aB = ({ r: e, g: t, b: n, a: r = 1 }) => !Pn(e) || !Pn(t) || !Pn(n) ? null : SA({
  r: Number(e),
  g: Number(t),
  b: Number(n),
  a: Number(r)
}), uB = /^#([0-9a-f]{3,8})$/i, fB = (e) => {
  const t = uB.exec(e);
  return t ? (e = t[1], e.length <= 4 ? {
    r: parseInt(e[0] + e[0], 16),
    g: parseInt(e[1] + e[1], 16),
    b: parseInt(e[2] + e[2], 16),
    a: e.length === 4 ? me(parseInt(e[3] + e[3], 16) / 255, 2) : 1
  } : e.length === 6 || e.length === 8 ? {
    r: parseInt(e.substr(0, 2), 16),
    g: parseInt(e.substr(2, 2), 16),
    b: parseInt(e.substr(4, 2), 16),
    a: e.length === 8 ? me(parseInt(e.substr(6, 2), 16) / 255, 2) : 1
  } : null) : null;
}, Xs = (e) => {
  const t = e.toString(16);
  return t.length < 2 ? "0" + t : t;
}, cB = (e) => {
  const { r: t, g: n, b: r, a: i } = Kh(e), o = i < 1 ? Xs(me(i * 255)) : "";
  return "#" + Xs(t) + Xs(n) + Xs(r) + o;
}, lB = (e) => ({
  h: EA(e.h),
  s: xt(e.s, 0, 100),
  v: xt(e.v, 0, 100),
  a: xt(e.a)
}), hB = (e) => ({
  h: me(e.h),
  s: me(e.s),
  v: me(e.v),
  a: me(e.a, Ku)
}), pB = ({ h: e, s: t, v: n, a: r = 1 }) => {
  if (!Pn(e) || !Pn(t) || !Pn(n)) return null;
  const i = lB({
    h: Number(e),
    s: Number(t),
    v: Number(n),
    a: Number(r)
  });
  return RA(i);
}, xA = ({ r: e, g: t, b: n, a: r }) => {
  const i = Math.max(e, t, n), o = i - Math.min(e, t, n), s = o ? i === e ? (t - n) / o : i === t ? 2 + (n - e) / o : 4 + (e - t) / o : 0;
  return {
    h: 60 * (s < 0 ? s + 6 : s),
    s: i ? o / i * 100 : 0,
    v: i / 255 * 100,
    a: r
  };
}, RA = ({ h: e, s: t, v: n, a: r }) => {
  e = e / 360 * 6, t = t / 100, n = n / 100;
  const i = Math.floor(e), o = n * (1 - t), s = n * (1 - (e - i) * t), a = n * (1 - (1 - e + i) * t), u = i % 6;
  return {
    r: [n, s, o, o, a, n][u] * 255,
    g: [a, n, n, s, o, o][u] * 255,
    b: [o, o, a, n, n, s][u] * 255,
    a: r
  };
}, TA = (e) => ({
  h: EA(e.h),
  s: xt(e.s, 0, 100),
  l: xt(e.l, 0, 100),
  a: xt(e.a)
}), $A = (e) => ({
  h: me(e.h),
  s: me(e.s),
  l: me(e.l),
  a: me(e.a, Ku)
}), dB = ({ h: e, s: t, l: n, a: r = 1 }) => {
  if (!Pn(e) || !Pn(t) || !Pn(n)) return null;
  const i = TA({
    h: Number(e),
    s: Number(t),
    l: Number(n),
    a: Number(r)
  });
  return NA(i);
}, _B = ({ h: e, s: t, l: n, a: r }) => (t *= (n < 50 ? n : 100 - n) / 100, {
  h: e,
  s: t > 0 ? 2 * t / (n + t) * 100 : 0,
  v: n + t,
  a: r
}), vB = ({ h: e, s: t, v: n, a: r }) => {
  const i = (200 - t) * n / 100;
  return {
    h: e,
    s: i > 0 && i < 200 ? t * n / 100 / (i <= 100 ? i : 200 - i) * 100 : 0,
    l: i / 2,
    a: r
  };
}, NA = (e) => RA(_B(e)), ko = (e) => vB(xA(e)), gB = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, yB = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, bB = (e) => {
  const t = gB.exec(e) || yB.exec(e);
  if (!t) return null;
  const n = TA({
    h: sB(t[1], t[2]),
    s: Number(t[3]),
    l: Number(t[4]),
    a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1)
  });
  return NA(n);
}, mB = (e) => {
  const { h: t, s: n, l: r, a: i } = $A(ko(e));
  return i < 1 ? `hsla(${t}, ${n}%, ${r}%, ${i})` : `hsl(${t}, ${n}%, ${r}%)`;
}, wB = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, AB = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, OB = (e) => {
  const t = wB.exec(e) || AB.exec(e);
  return !t || t[2] !== t[4] || t[4] !== t[6] ? null : SA({
    r: Number(t[1]) / (t[2] ? 100 / 255 : 1),
    g: Number(t[3]) / (t[4] ? 100 / 255 : 1),
    b: Number(t[5]) / (t[6] ? 100 / 255 : 1),
    a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1)
  });
}, EB = (e) => {
  const { r: t, g: n, b: r, a: i } = Kh(e);
  return i < 1 ? `rgba(${t}, ${n}, ${r}, ${i})` : `rgb(${t}, ${n}, ${r})`;
}, Ec = {
  string: [
    [fB, "hex"],
    [OB, "rgb"],
    [bB, "hsl"]
  ],
  object: [
    [aB, "rgb"],
    [dB, "hsl"],
    [pB, "hsv"]
  ]
}, c_ = (e, t) => {
  for (let n = 0; n < t.length; n++) {
    const r = t[n][0](e);
    if (r) return [r, t[n][1]];
  }
  return [null, void 0];
}, MA = (e) => typeof e == "string" ? c_(e.trim(), Ec.string) : typeof e == "object" && e !== null ? c_(e, Ec.object) : [null, void 0], SB = (e) => MA(e)[1], xB = (e, t) => ({
  r: e.r,
  g: e.g,
  b: e.b,
  a: t
}), Ef = (e, t) => {
  const n = ko(e);
  return {
    h: n.h,
    s: xt(n.s + t * 100, 0, 100),
    l: n.l,
    a: n.a
  };
}, Sf = (e) => (e.r * 299 + e.g * 587 + e.b * 114) / 1e3 / 255, l_ = (e, t) => {
  const n = ko(e);
  return {
    h: n.h,
    s: n.s,
    l: xt(n.l + t * 100, 0, 100),
    a: n.a
  };
}, RB = (e) => ({
  r: 255 - e.r,
  g: 255 - e.g,
  b: 255 - e.b,
  a: e.a
});
class Fa {
  parsed;
  rgba;
  constructor(t) {
    this.parsed = MA(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
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
    return me(Sf(this.rgba), 2);
  }
  /**
   * Same as calling `brightness() < 0.5`.
   */
  isDark() {
    return Sf(this.rgba) < 0.5;
  }
  /**
   * Same as calling `brightness() >= 0.5`.
   * */
  isLight() {
    return Sf(this.rgba) >= 0.5;
  }
  /**
   * Returns the hexadecimal representation of a color.
   * When the alpha channel value of the color is less than 1,
   * it outputs #rrggbbaa format instead of #rrggbb.
   */
  toHex() {
    return cB(this.rgba);
  }
  /**
   * Converts a color to RGB color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toRgb() {
    return Kh(this.rgba);
  }
  /**
   * Converts a color to RGB color space and returns a string representation.
   * Outputs an alpha value only if it is less than 1.
   */
  toRgbString() {
    return EB(this.rgba);
  }
  /**
   * Converts a color to HSL color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toHsl() {
    return $A(ko(this.rgba));
  }
  /**
   * Converts a color to HSL color space and returns a string representation.
   * Always includes an alpha value from 0 to 1.
   */
  toHslString() {
    return mB(this.rgba);
  }
  /**
   * Converts a color to HSV color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toHsv() {
    return hB(xA(this.rgba));
  }
  /**
   * Creates a new instance containing an inverted (opposite) version of the color.
   */
  invert() {
    return Jt(RB(this.rgba));
  }
  /**
   * Increases the HSL saturation of a color by the given amount.
   */
  saturate(t = 0.1) {
    return Jt(Ef(this.rgba, t));
  }
  /**
   * Decreases the HSL saturation of a color by the given amount.
   */
  desaturate(t = 0.1) {
    return Jt(Ef(this.rgba, -t));
  }
  /**
   * Makes a gray color with the same lightness as a source color.
   */
  grayscale() {
    return Jt(Ef(this.rgba, -1));
  }
  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  lighten(t = 0.1) {
    return Jt(l_(this.rgba, t));
  }
  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  darken(t = 0.1) {
    return Jt(l_(this.rgba, -t));
  }
  /**
   * Changes the HSL hue of a color by the given amount.
   */
  rotate(t = 15) {
    return this.hue(this.hue() + t);
  }
  alpha(t) {
    return typeof t == "number" ? Jt(xB(this.rgba, t)) : me(this.rgba.a, Ku);
  }
  hue(t) {
    const n = ko(this.rgba);
    return typeof t == "number" ? Jt({ h: t, s: n.s, l: n.l, a: n.a }) : me(n.h);
  }
  /**
   * Determines whether two values are the same color.
   */
  isEqual(t) {
    return this.toHex() === Jt(t).toHex();
  }
}
const Jt = (e) => e instanceof Fa ? e : new Fa(e), h_ = [], TB = (e) => {
  e.forEach((t) => {
    h_.indexOf(t) < 0 && (t(Fa, Ec), h_.push(t));
  });
}, $B = () => new Fa({
  r: Math.random() * 255,
  g: Math.random() * 255,
  b: Math.random() * 255
}), XB = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  colord: Jt,
  extend: TB,
  getFormat: SB,
  random: $B
}, Symbol.toStringTag, { value: "Module" }));
export {
  Xh as AT_TARGET,
  DA as BUBBLING_PHASE,
  CA as CAPTURING_PHASE,
  CB as Callbacks,
  nt as Color,
  Sc as Emitter4Event,
  NB as Event,
  xe as EventEmitter,
  PB as EventEmitter4,
  ja as EventPhase,
  ui as EventPropagation,
  ui as EventTarget,
  zB as Immutable,
  d_ as NONE,
  AA as Options,
  DB as PriorityQueue,
  jB as antvUtil,
  XB as colord,
  GB as compose,
  Wo as deepmerge,
  Oc as fastDeepEqual,
  rB as hexToRgb,
  KB as hslToHsv,
  u_ as hslToRgb,
  YB as hsvToHsl,
  nB as hsvToRgb,
  BB as immer,
  iB as lerpColor,
  FB as lodash,
  MB as mitt,
  WB as mobx,
  IB as observable,
  LB as radash,
  UB as reactivity,
  qB as redux,
  tB as rgbToHsl,
  HB as rgbToHsv,
  VB as signals,
  kB as tapable
};
