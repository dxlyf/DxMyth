var bO = Object.prototype.hasOwnProperty, Ve = "~";
function Ms() {
}
Object.create && (Ms.prototype = /* @__PURE__ */ Object.create(null), new Ms().__proto__ || (Ve = !1));
function mO(e, t, r) {
  this.fn = e, this.context = t, this.once = r || !1;
}
function X_(e, t, r, n, i) {
  if (typeof r != "function")
    throw new TypeError("The listener must be a function");
  var s = new mO(r, n || e, i), o = Ve ? Ve + t : t;
  return e._events[o] ? e._events[o].fn ? e._events[o] = [e._events[o], s] : e._events[o].push(s) : (e._events[o] = s, e._eventsCount++), e;
}
function da(e, t) {
  --e._eventsCount === 0 ? e._events = new Ms() : delete e._events[t];
}
function Te() {
  this._events = new Ms(), this._eventsCount = 0;
}
Te.prototype.eventNames = function() {
  var t = [], r, n;
  if (this._eventsCount === 0) return t;
  for (n in r = this._events)
    bO.call(r, n) && t.push(Ve ? n.slice(1) : n);
  return Object.getOwnPropertySymbols ? t.concat(Object.getOwnPropertySymbols(r)) : t;
};
Te.prototype.listeners = function(t) {
  var r = Ve ? Ve + t : t, n = this._events[r];
  if (!n) return [];
  if (n.fn) return [n.fn];
  for (var i = 0, s = n.length, o = new Array(s); i < s; i++)
    o[i] = n[i].fn;
  return o;
};
Te.prototype.listenerCount = function(t) {
  var r = Ve ? Ve + t : t, n = this._events[r];
  return n ? n.fn ? 1 : n.length : 0;
};
Te.prototype.emit = function(t, r, n, i, s, o) {
  var a = Ve ? Ve + t : t;
  if (!this._events[a]) return !1;
  var u = this._events[a], f = arguments.length, c, l;
  if (u.fn) {
    switch (u.once && this.removeListener(t, u.fn, void 0, !0), f) {
      case 1:
        return u.fn.call(u.context), !0;
      case 2:
        return u.fn.call(u.context, r), !0;
      case 3:
        return u.fn.call(u.context, r, n), !0;
      case 4:
        return u.fn.call(u.context, r, n, i), !0;
      case 5:
        return u.fn.call(u.context, r, n, i, s), !0;
      case 6:
        return u.fn.call(u.context, r, n, i, s, o), !0;
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
          u[l].fn.call(u[l].context, r);
          break;
        case 3:
          u[l].fn.call(u[l].context, r, n);
          break;
        case 4:
          u[l].fn.call(u[l].context, r, n, i);
          break;
        default:
          if (!c) for (d = 1, c = new Array(f - 1); d < f; d++)
            c[d - 1] = arguments[d];
          u[l].fn.apply(u[l].context, c);
      }
  }
  return !0;
};
Te.prototype.on = function(t, r, n) {
  return X_(this, t, r, n, !1);
};
Te.prototype.once = function(t, r, n) {
  return X_(this, t, r, n, !0);
};
Te.prototype.removeListener = function(t, r, n, i) {
  var s = Ve ? Ve + t : t;
  if (!this._events[s]) return this;
  if (!r)
    return da(this, s), this;
  var o = this._events[s];
  if (o.fn)
    o.fn === r && (!i || o.once) && (!n || o.context === n) && da(this, s);
  else {
    for (var a = 0, u = [], f = o.length; a < f; a++)
      (o[a].fn !== r || i && !o[a].once || n && o[a].context !== n) && u.push(o[a]);
    u.length ? this._events[s] = u.length === 1 ? u[0] : u : da(this, s);
  }
  return this;
};
Te.prototype.removeAllListeners = function(t) {
  var r;
  return t ? (r = Ve ? Ve + t : t, this._events[r] && da(this, r)) : (this._events = new Ms(), this._eventsCount = 0), this;
};
Te.prototype.off = Te.prototype.removeListener;
Te.prototype.addListener = Te.prototype.on;
Te.prefixed = Ve;
Te.EventEmitter = Te;
const iu = {
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3
}, J_ = iu.NONE, wO = iu.CAPTURING_PHASE, xp = iu.AT_TARGET, AO = iu.BUBBLING_PHASE;
class Bz {
  static create(t, r, n) {
    return new this(t, r, n);
  }
  type = "none";
  parentNode = null;
  target = null;
  currentTarget = null;
  data = null;
  eventPhase = J_;
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
  constructor(t, r, n) {
    this.initEvent(t, r, n);
  }
  setData(t) {
    return this.data = t, this;
  }
  initEvent(t, r = !0, n = !0) {
    this.type = t, this.bubbles = r, this.cancelable = n;
  }
  /**
   * 
   * @returns {EventTarget[]}
   */
  composedPath() {
    let t = this.currentTarget, r = [];
    for (; t; )
      r.push(t), t = t.parent;
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
function Rp(e) {
  return (typeof e == "boolean" || !e) && (e = {
    capture: !!e
  }), e = { capture: !1, once: !1, ...e || {} }, e;
}
function Tp(e, t) {
  var r = e._events[t], n;
  if (!r) return [];
  if (r.fn) return [r];
  for (var i = 0, s = r.length, n = new Array(s); i < s; i++)
    n[i] = r[i];
  return n;
}
class Oi {
  parent = null;
  _bubble_emitter = new Te();
  _capture_emitter = new Te();
  addEventListener(t, r, n) {
    n = Rp(n);
    const i = n.capture ? this._capture_emitter : this._bubble_emitter;
    n && n.once ? i.once(t, r) : i.on(t, r);
  }
  removeEventListener(t, r, n) {
    n = Rp(n), (n.capture ? this._capture_emitter : this._bubble_emitter).off(t, r);
  }
  /**
   * 
   * @param {Event} e 
   */
  dispatchEvent(t) {
    t.currentTarget = this;
    const r = t.type, n = t.composedPath(), i = n.length;
    for (let s = i - 1; s >= 0; s--) {
      const o = n[s]._capture_emitter;
      if (o.listenerCount(r) > 0) {
        t.target = n[s], t.eventPhase = t.target !== this ? wO : xp;
        const u = Tp(o, r);
        for (let f = 0, c = u.length; f < c; f++) {
          const l = u[f];
          if (l.once && o.removeListener(r, l.fn, l.context, l.once), l.fn(t), t.immediateCancelBubble)
            break;
        }
      }
      if (t.cancelBubble)
        break;
    }
    if (!t.cancelBubble)
      for (let s = 0; s < i; s++) {
        const o = n[s]._bubble_emitter;
        if (o.listenerCount(r) > 0) {
          t.target = n[s], t.eventPhase = t.target !== this ? AO : xp;
          const u = Tp(o, r);
          for (let f = 0, c = u.length; f < c; f++) {
            const l = u[f];
            if (l.once && o.removeListener(r, l.fn, l.context, l.once), l.fn(t), t.immediateCancelBubble)
              break;
          }
        }
        if (t.cancelBubble || !t.bubbles)
          break;
      }
    return t.eventPhase = J_, !t.defaultPrevented;
  }
  removeAllListeners() {
    this._bubble_emitter.removeAllListeners(), this._capture_emitter.removeAllListeners();
  }
}
Oi.prototype.on = Oi.prototype.addEventListener;
Oi.prototype.off = Oi.prototype.removeEventListener;
Oi.prototype.emit = Oi.prototype.dispatchEvent;
function zz(e) {
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
    on(t, r) {
      const n = e.get(t);
      n ? n.push(r) : e.set(t, [r]);
    },
    /**
     * Remove an event handler for the given type.
     * If `handler` is omitted, all handlers of the given type are removed.
     * @param {string|symbol} type Type of event to unregister `handler` from (`'*'` to remove a wildcard handler)
     * @param {Function} [handler] Handler function to remove
     * @memberOf mitt
     */
    off(t, r) {
      const n = e.get(t);
      n && (r ? n.splice(n.indexOf(r) >>> 0, 1) : e.set(t, []));
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
    emit(t, r) {
      let n = e.get(t);
      n && n.slice().map((i) => {
        i(r);
      }), n = e.get("*"), n && n.slice().map((i) => {
        i(t, r);
      });
    }
  };
}
function Pp(e, t, r, n, i, s) {
  let o = Object.assign({
    once: !1,
    stage: 1 / 0
  }, s);
  e[t] || (e[t] = /* @__PURE__ */ Object.create(null));
  let a = e[t], u = a[n];
  if (u || (u = [], a[n] = u), u.some((l) => l.handle === i))
    return;
  let f = {
    handle: i,
    once: o.once,
    namespace: o.namespace,
    stage: o.stage
  }, c = -1;
  if (o.stage !== 1 / 0 && (c = u.findIndex((l) => l.handle < f.handle)), c !== -1 ? u.splice(c, 0, f) : u.push(f), o.namespace) {
    let l = e[r];
    l || (l = e[r] = /* @__PURE__ */ new Map());
    let h = l.get(o.namespace);
    h || l.set(o.namespace, /* @__PURE__ */ new Map()), h = l.get(o.namespace), h.has(n) ? h.set(n, h.get(n) + 1) : h.set(n, 1);
  }
}
function Is(e, t, r, n, i, s) {
  if (e[t]) {
    if (!n && !i) {
      e[t] = void 0, delete e[t];
      return;
    } else if (!n && i) {
      let o = e[r];
      if (!o || !o.has(i))
        return;
      o.get(i).forEach((u, f) => {
        Is(e, t, r, f, void 0, s);
      }), o.delete(i);
    } else if (n) {
      let o = e[t], a = o[n];
      a && (o[n] = a.filter((u) => {
        if ((!s || u.handle === s) && (!i || u.namespace === i)) {
          let f = e[r];
          if (u.namespace && f && f.has(u.namespace)) {
            let c = f.get(u.namespace);
            c.has(n) && c.set(n, c.get(n) - 1), c.get(n) <= 0 && c.delete(n);
          }
          return !1;
        }
        return !0;
      }));
    }
  }
}
function OO(e, t, r, n, ...i) {
  if (!e[t])
    return;
  let o = e[t][n];
  if (o)
    for (let a = 0; a < o.length; a++) {
      const u = o[a];
      u.handle(...i), u.once && Is(e, t, r, n, null, u.handle);
    }
}
function Np(e, t, r) {
  let n = e[t];
  return n ? n[r] || [] : [];
}
function EO(e, t, r) {
  e[t] = void 0, e[r] = void 0;
}
function SO(e, t, r) {
  let n = e[t];
  if (!n)
    return !1;
  let i = n[r];
  return i ? i.length > 0 : !1;
}
function xO(e) {
  if (!e._listeners)
    return [];
  let t = e._listeners;
  return Object.keys(t);
}
function RO(e, t, r, n, i) {
  i.currentTarget = e;
  const s = i.type, o = i.composedPath(e), a = o.length;
  for (let u = a - 1; u >= 0; u--) {
    const f = o[u];
    i.target = o[u], i.eventPhase = i.target !== e ? fi.CAPTURING_PHASE : fi.AT_TARGET;
    const c = Np(f, r, s);
    for (let l = 0, h = c.length; l < h; l++) {
      const d = c[l];
      if (d.once && Is(e, r, n, s, null, d.handle), d.handle(i), i.immediateCancelBubble)
        break;
    }
    if (i.cancelBubble)
      break;
  }
  if (!i.cancelBubble)
    for (let u = 0; u < a; u++) {
      const f = o[u];
      i.target = o[u], i.eventPhase = i.target !== e ? fi.BUBBLING_PHASE : fi.AT_TARGET;
      const c = Np(f, t, s);
      for (let l = 0, h = c.length; l < h; l++) {
        const d = c[l];
        if (d.once && Is(e, t, n, s, null, d.handle), d.handle(i), i.immediateCancelBubble)
          break;
      }
      if (i.cancelBubble || !i.bubbles)
        break;
    }
  return i.eventPhase = fi.NONE, !i.defaultPrevented;
}
const fi = {
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3
};
class el {
  static create(t, r) {
    return new el(t);
  }
  type;
  target = null;
  currentTarget = null;
  data = null;
  eventPhase = fi.NONE;
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
  constructor(t, r, n) {
    this.initEvent(t, r, n);
  }
  setData(t) {
    return this.data = t, this;
  }
  initEvent(t, r = !0, n = !0) {
    return this.type = t, this.bubbles = r, this.cancelable = n, this;
  }
  /**
   * 
   * @returns {EventTarget[]}
   */
  composedPath(t) {
    let r = t, n = [];
    for (; r; )
      n.push(r), r = r.parent;
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
const si = "_listeners", $p = "_listeners_capture", oi = "_listenersNs";
class Uz {
  parent;
  _listeners;
  _listenersNs;
  on(t, r, n) {
    return n && n.capture ? Pp(this, $p, oi, t, r, n) : Pp(this, si, oi, t, r, n), this;
  }
  emit(t, ...r) {
    return OO(this, si, oi, t, ...r), this;
  }
  createEvent(t, r) {
    return el.create(t, r);
  }
  emitBubble(t) {
    return RO(this, si, $p, oi, t);
  }
  off(t, r, n) {
    return Is(this, si, oi, t, n ? n.namespace : null, r), this;
  }
  eventNames() {
    return xO(this);
  }
  hasEventListener(t) {
    return SO(this, si, t);
  }
  removeAllListeners() {
    return EO(this, si, oi), this;
  }
}
const Z_ = (e) => !!Symbol[e], tl = (e) => Z_(e) ? Symbol[e] : "@@" + e, TO = tl("iterator"), Xf = tl("observable"), Q_ = tl("species");
function Ea(e, t) {
  let r = e[t];
  if (r != null) {
    if (typeof r != "function")
      throw new TypeError(r + " is not a function");
    return r;
  }
}
function cs(e) {
  let t = e.constructor;
  return t !== void 0 && (t = t[Q_], t === null && (t = void 0)), t !== void 0 ? t : Se;
}
function PO(e) {
  return e instanceof Se;
}
function Ei(e) {
  Ei.log ? Ei.log(e) : setTimeout(() => {
    throw e;
  });
}
function _a(e) {
  Promise.resolve().then(() => {
    try {
      e();
    } catch (t) {
      Ei(t);
    }
  });
}
function ev(e) {
  let t = e._cleanup;
  if (t !== void 0 && (e._cleanup = void 0, !!t))
    try {
      if (typeof t == "function")
        t();
      else {
        let r = Ea(t, "unsubscribe");
        r && r.call(t);
      }
    } catch (r) {
      Ei(r);
    }
}
function Jf(e) {
  e._observer = void 0, e._queue = void 0, e._state = "closed";
}
function NO(e) {
  let t = e._queue;
  if (t) {
    e._queue = void 0, e._state = "ready";
    for (let r = 0; r < t.length && (tv(e, t[r].type, t[r].value), e._state !== "closed"); ++r)
      ;
  }
}
function tv(e, t, r) {
  e._state = "running";
  let n = e._observer;
  try {
    let i = Ea(n, t);
    switch (t) {
      case "next":
        i && i.call(n, r);
        break;
      case "error":
        if (Jf(e), i) i.call(n, r);
        else throw r;
        break;
      case "complete":
        Jf(e), i && i.call(n);
        break;
    }
  } catch (i) {
    Ei(i);
  }
  e._state === "closed" ? ev(e) : e._state === "running" && (e._state = "ready");
}
function wf(e, t, r) {
  if (e._state !== "closed") {
    if (e._state === "buffering") {
      e._queue.push({ type: t, value: r });
      return;
    }
    if (e._state !== "ready") {
      e._state = "buffering", e._queue = [{ type: t, value: r }], _a(() => NO(e));
      return;
    }
    tv(e, t, r);
  }
}
class $O {
  constructor(t, r) {
    this._cleanup = void 0, this._observer = t, this._queue = void 0, this._state = "initializing";
    let n = this, i = {
      get closed() {
        return n._state === "closed";
      },
      next(s) {
        wf(n, "next", s);
      },
      error(s) {
        wf(n, "error", s);
      },
      complete() {
        wf(n, "complete");
      }
    };
    try {
      this._cleanup = r.call(void 0, i);
    } catch (s) {
      i.error(s);
    }
    this._state === "initializing" && (this._state = "ready");
  }
  get closed() {
    return this._state === "closed";
  }
  unsubscribe() {
    this._state !== "closed" && (Jf(this), ev(this));
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
    }), new $O(t, this._subscriber);
  }
  forEach(t) {
    return new Promise((r, n) => {
      if (typeof t != "function") {
        n(new TypeError(t + " is not a function"));
        return;
      }
      function i() {
        s.unsubscribe(), r();
      }
      let s = this.subscribe({
        next(o) {
          try {
            t(o, i);
          } catch (a) {
            n(a), s.unsubscribe();
          }
        },
        error: n,
        complete: r
      });
    });
  }
  map(t) {
    if (typeof t != "function")
      throw new TypeError(t + " is not a function");
    let r = cs(this);
    return new r((n) => this.subscribe({
      next(i) {
        try {
          i = t(i);
        } catch (s) {
          return n.error(s);
        }
        n.next(i);
      },
      error(i) {
        n.error(i);
      },
      complete() {
        n.complete();
      }
    }));
  }
  filter(t) {
    if (typeof t != "function")
      throw new TypeError(t + " is not a function");
    let r = cs(this);
    return new r((n) => this.subscribe({
      next(i) {
        try {
          if (!t(i)) return;
        } catch (s) {
          return n.error(s);
        }
        n.next(i);
      },
      error(i) {
        n.error(i);
      },
      complete() {
        n.complete();
      }
    }));
  }
  reduce(t) {
    if (typeof t != "function")
      throw new TypeError(t + " is not a function");
    let r = cs(this), n = arguments.length > 1, i = !1, o = arguments[1];
    return new r((a) => this.subscribe({
      next(u) {
        let f = !i;
        if (i = !0, !f || n)
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
        if (!i && !n)
          return a.error(new TypeError("Cannot reduce an empty sequence"));
        a.next(o), a.complete();
      }
    }));
  }
  async all() {
    let t = [];
    return await this.forEach((r) => t.push(r)), t;
  }
  concat(...t) {
    let r = cs(this);
    return new r((n) => {
      let i, s = 0;
      function o(a) {
        i = a.subscribe({
          next(u) {
            n.next(u);
          },
          error(u) {
            n.error(u);
          },
          complete() {
            s === t.length ? (i = void 0, n.complete()) : o(r.from(t[s++]));
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
    let r = cs(this);
    return new r((n) => {
      let i = [], s = this.subscribe({
        next(a) {
          if (t)
            try {
              a = t(a);
            } catch (f) {
              return n.error(f);
            }
          let u = r.from(a).subscribe({
            next(f) {
              n.next(f);
            },
            error(f) {
              n.error(f);
            },
            complete() {
              let f = i.indexOf(u);
              f >= 0 && i.splice(f, 1), o();
            }
          });
          i.push(u);
        },
        error(a) {
          n.error(a);
        },
        complete() {
          o();
        }
      });
      function o() {
        s.closed && i.length === 0 && n.complete();
      }
      return () => {
        i.forEach((a) => a.unsubscribe()), s.unsubscribe();
      };
    });
  }
  [Xf]() {
    return this;
  }
  static from(t) {
    let r = typeof this == "function" ? this : Se;
    if (t == null)
      throw new TypeError(t + " is not an object");
    let n = Ea(t, Xf);
    if (n) {
      let i = n.call(t);
      if (Object(i) !== i)
        throw new TypeError(i + " is not an object");
      return PO(i) && i.constructor === r ? i : new r((s) => i.subscribe(s));
    }
    if (Z_("iterator") && (n = Ea(t, TO), n))
      return new r((i) => {
        _a(() => {
          if (!i.closed) {
            for (let s of n.call(t))
              if (i.next(s), i.closed) return;
            i.complete();
          }
        });
      });
    if (Array.isArray(t))
      return new r((i) => {
        _a(() => {
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
    let r = typeof this == "function" ? this : Se;
    return new r((n) => {
      _a(() => {
        if (!n.closed) {
          for (let i = 0; i < t.length; ++i)
            if (n.next(t[i]), n.closed) return;
          n.complete();
        }
      });
    });
  }
  static get [Q_]() {
    return this;
  }
}
Object.defineProperty(Se, Symbol("extensions"), {
  value: {
    symbol: Xf,
    hostReportError: Ei
  },
  configurable: !0
});
function MO(...e) {
  return new Se((t) => {
    if (e.length === 0)
      return Se.from([]);
    let r = e.length, n = e.map((i) => Se.from(i).subscribe({
      next(s) {
        t.next(s);
      },
      error(s) {
        t.error(s);
      },
      complete() {
        --r === 0 && t.complete();
      }
    }));
    return () => n.forEach((i) => i.unsubscribe());
  });
}
function IO(...e) {
  return new Se((t) => {
    if (e.length === 0)
      return Se.from([]);
    let r = e.length, n = /* @__PURE__ */ new Set(), i = !1, s = e.map(() => {
    }), o = e.map((a, u) => Se.from(a).subscribe({
      next(f) {
        if (s[u] = f, !i) {
          if (n.add(u), n.size !== e.length)
            return;
          n = null, i = !0;
        }
        t.next(Array.from(s));
      },
      error(f) {
        t.error(f);
      },
      complete() {
        --r === 0 && t.complete();
      }
    }));
    return () => o.forEach((a) => a.unsubscribe());
  });
}
function DO(...e) {
  return new Se((t) => {
    if (e.length === 0)
      return Se.from([]);
    let r = e.map(() => []);
    function n() {
      return r.some((s, o) => s.length === 0 && i[o].closed);
    }
    let i = e.map((s, o) => Se.from(s).subscribe({
      next(a) {
        r[o].push(a), r.every((u) => u.length > 0) && (t.next(r.map((u) => u.shift())), n() && t.complete());
      },
      error(a) {
        t.error(a);
      },
      complete() {
        n() && t.complete();
      }
    }));
    return () => i.forEach((s) => s.unsubscribe());
  });
}
const Vz = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Observable: Se,
  combineLatest: IO,
  merge: MO,
  zip: DO
}, Symbol.toStringTag, { value: "Module" }));
function kz() {
  let e = [];
  const t = {
    add(r, n) {
      n = { stage: 0, once: !1, ...n ?? {} };
      let i = e.findIndex((o) => n.stage < o.stage);
      i !== -1 ? e.splice(i, 0, { fn: r, stage: n.stage, once: n.once }) : e.push({ fn: r, stage: n.stage, once: n.once });
      let s = !1;
      return () => {
        s || (s = !0, t.remove(r));
      };
    },
    remove(r) {
      e = e.filter((n) => n.fn !== r);
    },
    dispatch(...r) {
      let n = !1, i = !1;
      const s = {
        stop: () => {
          n = !0;
        },
        remove: () => {
          i = !0;
        }
      };
      e.some((o) => (o.fn(...r, s), (i || o.once) && t.remove(o.fn), n));
    },
    clear() {
      e.length = 0;
    }
  };
  return t;
}
class Wz {
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
    return this.destroyedList || (this.memory && !this.firing && (this.firingIndex = this.list.length - 1, this.queue.push(this.memory)), t.forEach((r) => {
      typeof r == "function" ? (!this.options.unique || !this.has(r)) && this.list.push(r) : r && r.length && Array.isArray(r) && this.add(...r);
    }), this.memory && !this.firing && this._fire()), this;
  }
  // Remove a callback from the list
  remove(...t) {
    return t.forEach((r) => {
      for (var n = 0; (n = this.list.indexOf(r, n)) > -1; )
        this.list.splice(n, 1), n <= this.firingIndex && this.firingIndex--;
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
  fireWith(t, r) {
    return this.locked || (r = r || [], r = [t, r.slice ? r.slice() : r], this.queue.push(r), this.firing || this._fire()), this;
  }
  // 用给定参数调用所有回调   
  fire(...t) {
    return this.fireWith(this, t), this;
  }
}
class qz {
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
    const t = this.heap[0], r = this.heap.pop();
    return this.isEmpty() || (this.heap[0] = r, this.siftDown(0)), t;
  }
  // 上浮操作
  siftUp(t) {
    for (; t > 0; ) {
      const r = Math.floor((t - 1) / 2);
      if (this.compare(this.heap[t], this.heap[r]) >= 0) break;
      this.swap(t, r), t = r;
    }
  }
  // 下沉操作
  siftDown(t) {
    const r = this.size;
    for (; t < r; ) {
      const n = 2 * t + 1, i = 2 * t + 2;
      let s = t;
      if (n < r && this.compare(this.heap[n], this.heap[s]) < 0 && (s = n), i < r && this.compare(this.heap[i], this.heap[s]) < 0 && (s = i), s === t) break;
      this.swap(t, s), t = s;
    }
  }
  // 交换元素
  swap(t, r) {
    [this.heap[t], this.heap[r]] = [this.heap[r], this.heap[t]];
  }
  /**
   * 清空队列
   */
  clear() {
    this.heap = [];
  }
}
const rv = (e) => !!e && e.constructor === Symbol, Ds = Array.isArray, rl = (e) => !!e && e.constructor === Object, nv = (e) => e == null || typeof e != "object" && typeof e != "function", uo = (e) => !!(e && e.constructor && e.call && e.apply), CO = (e) => typeof e == "string" || e instanceof String, LO = (e) => _i(e) && e % 1 === 0, jO = (e) => _i(e) && e % 1 !== 0, _i = (e) => {
  try {
    return Number(e) === e;
  } catch {
    return !1;
  }
}, iv = (e) => Object.prototype.toString.call(e) === "[object Date]", sv = (e) => !(!e || !e.then || !uo(e.then)), FO = (e) => {
  if (e === !0 || e === !1 || e == null) return !0;
  if (_i(e)) return e === 0;
  if (iv(e)) return isNaN(e.getTime());
  if (uo(e) || rv(e)) return !1;
  const t = e.length;
  if (_i(t)) return t === 0;
  const r = e.size;
  return _i(r) ? r === 0 : Object.keys(e).length === 0;
}, ov = (e, t) => {
  if (Object.is(e, t)) return !0;
  if (e instanceof Date && t instanceof Date)
    return e.getTime() === t.getTime();
  if (e instanceof RegExp && t instanceof RegExp)
    return e.toString() === t.toString();
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  const r = Reflect.ownKeys(e), n = Reflect.ownKeys(t);
  if (r.length !== n.length) return !1;
  for (let i = 0; i < r.length; i++)
    if (!Reflect.has(t, r[i]) || !ov(e[r[i]], t[r[i]])) return !1;
  return !0;
}, BO = (e, t) => e.reduce((r, n) => {
  const i = t(n);
  return r[i] || (r[i] = []), r[i].push(n), r;
}, {});
function zO(...e) {
  return !e || !e.length ? [] : new Array(Math.max(...e.map(({ length: t }) => t))).fill([]).map((t, r) => e.map((n) => n[r]));
}
function UO(e, t) {
  if (!e || !e.length)
    return {};
  const r = uo(t) ? t : Ds(t) ? (n, i) => t[i] : (n, i) => t;
  return e.reduce((n, i, s) => (n[i] = r(i, s), n), {});
}
const nl = (e, t) => !e || (e.length ?? 0) === 0 ? null : e.reduce(t);
function VO(e, t) {
  return (e || []).reduce((r, n) => r + (t ? t(n) : n), 0);
}
const kO = (e, t = void 0) => e?.length > 0 ? e[0] : t, WO = (e, t = void 0) => e?.length > 0 ? e[e.length - 1] : t, av = (e, t, r = !1) => {
  if (!e) return [];
  const n = (s, o) => t(s) - t(o), i = (s, o) => t(o) - t(s);
  return e.slice().sort(r === !0 ? i : n);
}, qO = (e, t, r = "asc") => {
  if (!e) return [];
  const n = (s, o) => `${t(s)}`.localeCompare(t(o)), i = (s, o) => `${t(o)}`.localeCompare(t(s));
  return e.slice().sort(r === "desc" ? i : n);
}, GO = (e, t) => e ? e.reduce((r, n) => {
  const i = t(n);
  return r[i] = (r[i] ?? 0) + 1, r;
}, {}) : {}, HO = (e, t, r) => {
  if (!e) return [];
  if (t === void 0) return [...e];
  for (let n = 0; n < e.length; n++) {
    const i = e[n];
    if (r(i, n))
      return [
        ...e.slice(0, n),
        t,
        ...e.slice(n + 1, e.length)
      ];
  }
  return [...e];
}, uv = (e, t, r = (n) => n) => e.reduce((n, i) => (n[t(i)] = r(i), n), {}), KO = (e, t, r) => e ? e.reduce((n, i, s) => (r(i, s) && n.push(t(i, s)), n), []) : [];
function YO(e, t) {
  const r = t ?? ((n) => n);
  return nl(e, (n, i) => r(n) > r(i) ? n : i);
}
function XO(e, t) {
  const r = t ?? ((n) => n);
  return nl(e, (n, i) => r(n) < r(i) ? n : i);
}
const JO = (e, t = 2) => {
  const r = Math.ceil(e.length / t);
  return new Array(r).fill(null).map((n, i) => e.slice(i * t, i * t + t));
}, ZO = (e, t) => {
  const r = e.reduce((n, i) => {
    const s = t ? t(i) : i;
    return n[s] || (n[s] = i), n;
  }, {});
  return Object.values(r);
};
function* il(e, t, r = (i) => i, n = 1) {
  const i = uo(r) ? r : () => r, s = t ? e : 0, o = t ?? e;
  for (let a = s; a <= o && (yield i(a), !(a + n > o)); a += n)
    ;
}
const sl = (e, t, r, n) => Array.from(il(e, t, r, n)), QO = (e) => e.reduce((t, r) => (t.push(...r), t), []), eE = (e, t, r) => {
  if (!e || !t) return !1;
  const n = r ?? ((s) => s), i = t.reduce((s, o) => (s[n(o)] = !0, s), {});
  return e.some((s) => i[n(s)]);
}, fv = (e, t) => e ? e.reduce(
  (r, n) => {
    const [i, s] = r;
    return t(n) ? [[...i, n], s] : [i, [...s, n]];
  },
  [[], []]
) : [[], []], tE = (e, t, r) => !t && !e ? [] : t ? e ? r ? e.reduce((n, i) => {
  const s = t.find((o) => r(i) === r(o));
  return s ? n.push(s) : n.push(i), n;
}, []) : e : [] : e, rE = (e, t, r) => {
  if (!e && !t) return [];
  if (!t) return [...e];
  if (!e) return [t];
  for (let n = 0; n < e.length; n++) {
    const i = e[n];
    if (r(i, n))
      return [
        ...e.slice(0, n),
        t,
        ...e.slice(n + 1, e.length)
      ];
  }
  return [...e, t];
}, nE = (e, t, r, n) => {
  if (!e && !t) return [];
  if (!e) return [t];
  if (!t) return [...e];
  const i = r ? (a, u) => r(a, u) === r(t, u) : (a) => a === t;
  return e.find(i) ? e.filter((a, u) => !i(a, u)) : (n?.strategy ?? "append") === "append" ? [...e, t] : [t, ...e];
}, iE = (e) => e?.filter((t) => !!t) ?? [], cv = (e, t, r) => {
  let n = r;
  for (let i = 1; i <= e; i++)
    n = t(n, i);
  return n;
}, sE = (e, t, r = (n) => n) => {
  if (!e?.length && !t?.length) return [];
  if (e?.length === void 0) return [...t];
  if (!t?.length) return [...e];
  const n = t.reduce((i, s) => (i[r(s)] = !0, i), {});
  return e.filter((i) => !n[r(i)]);
};
function oE(e, t) {
  if (e.length === 0) return e;
  const r = t % e.length;
  return r === 0 ? e : [...e.slice(-r, e.length), ...e.slice(0, -r)];
}
const aE = async (e, t, r) => {
  const n = r !== void 0;
  if (!n && e?.length < 1)
    throw new Error("Cannot reduce empty array with no init value");
  const i = n ? e : e.slice(1);
  let s = n ? r : e[0];
  for (const [o, a] of i.entries())
    s = await t(s, a, o);
  return s;
}, uE = async (e, t) => {
  if (!e) return [];
  let r = [], n = 0;
  for (const i of e) {
    const s = await t(i, n++);
    r.push(s);
  }
  return r;
}, fE = async (e) => {
  const t = [], r = (s, o) => t.push({
    fn: s,
    rethrow: o?.rethrow ?? !1
  }), [n, i] = await Si(e)(r);
  for (const { fn: s, rethrow: o } of t) {
    const [a] = await Si(s)(n);
    if (a && o) throw a;
  }
  if (n) throw n;
  return i;
};
class lv extends Error {
  errors;
  constructor(t = []) {
    super();
    const r = t.find((n) => n.name)?.name ?? "";
    this.name = `AggregateError(${r}...)`, this.message = `AggregateError with ${t.length} errors`, this.stack = t.find((n) => n.stack)?.stack ?? this.stack, this.errors = t;
  }
}
const cE = async (e, t, r) => {
  const n = t.map((f, c) => ({
    index: c,
    item: f
  })), i = async (f) => {
    const c = [];
    for (; ; ) {
      const l = n.pop();
      if (!l) return f(c);
      const [h, d] = await Si(r)(l.item);
      c.push({
        error: h,
        result: d,
        index: l.index
      });
    }
  }, s = sl(1, e).map(() => new Promise(i)), o = await Promise.all(s), [a, u] = fv(
    av(o.flat(), (f) => f.index),
    (f) => !!f.error
  );
  if (a.length > 0)
    throw new lv(a.map((f) => f.error));
  return u.map((f) => f.result);
};
async function lE(e) {
  const t = Ds(e) ? e.map((i) => [null, i]) : Object.entries(e), r = await Promise.all(
    t.map(
      ([i, s]) => s.then((o) => ({ result: o, exc: null, key: i })).catch((o) => ({ result: null, exc: o, key: i }))
    )
  ), n = r.filter((i) => i.exc);
  if (n.length > 0)
    throw new lv(n.map((i) => i.exc));
  return Ds(e) ? r.map((i) => i.result) : r.reduce(
    (i, s) => ({
      ...i,
      [s.key]: s.result
    }),
    {}
  );
}
const hE = async (e, t) => {
  const r = e?.times ?? 3, n = e?.delay, i = e?.backoff ?? null;
  for (const s of il(1, r)) {
    const [o, a] = await Si(t)((u) => {
      throw { _exited: u };
    });
    if (!o) return a;
    if (o._exited) throw o._exited;
    if (s === r) throw o;
    n && await Zf(n), i && await Zf(i(s));
  }
}, Zf = (e) => new Promise((t) => setTimeout(t, e)), Si = (e) => (...t) => {
  try {
    const r = e(...t);
    return sv(r) ? r.then((n) => [void 0, n]).catch((n) => [n, void 0]) : [void 0, r];
  } catch (r) {
    return [r, void 0];
  }
}, pE = (e, t) => {
  const r = (i) => {
    if (t && !t(i)) throw i;
  }, n = (i) => i instanceof Promise;
  try {
    const i = e();
    return n(i) ? i.catch(r) : i;
  } catch (i) {
    return r(i);
  }
};
function dE(...e) {
  return (...t) => e.slice(1).reduce((r, n) => n(r), e[0](...t));
}
function _E(...e) {
  return e.reverse().reduce((t, r) => r(t));
}
const vE = (e, ...t) => (...r) => e(...t, ...r), gE = (e, t) => (r) => e({
  ...t,
  ...r
}), yE = (e) => new Proxy(
  {},
  {
    get: (t, r) => e(r)
  }
), bE = (e, t, r, n) => function(...s) {
  const o = r ? r(...s) : JSON.stringify({ args: s }), a = e[o];
  if (a !== void 0 && (!a.exp || a.exp > (/* @__PURE__ */ new Date()).getTime()))
    return a.value;
  const u = t(...s);
  return e[o] = {
    exp: n ? (/* @__PURE__ */ new Date()).getTime() + n : null,
    value: u
  }, u;
}, mE = (e, t = {}) => bE({}, e, t.key ?? null, t.ttl ?? null), wE = ({ delay: e }, t) => {
  let r, n = !0;
  const i = (...s) => {
    n ? (clearTimeout(r), r = setTimeout(() => {
      n && t(...s), r = void 0;
    }, e)) : t(...s);
  };
  return i.isPending = () => r !== void 0, i.cancel = () => {
    n = !1;
  }, i.flush = (...s) => t(...s), i;
}, AE = ({ interval: e }, t) => {
  let r = !0, n;
  const i = (...s) => {
    r && (t(...s), r = !1, n = setTimeout(() => {
      r = !0, n = void 0;
    }, e));
  };
  return i.isThrottled = () => n !== void 0, i;
}, OE = (e, t) => {
  const r = () => {
  };
  return new Proxy(Object.assign(r, e), {
    get: (n, i) => n[i],
    set: (n, i, s) => (n[i] = s, !0),
    apply: (n, i, s) => t(Object.assign({}, n))(...s)
  });
};
function EE(e, t, r) {
  return typeof e == "number" && typeof t == "number" && (typeof r > "u" || typeof r == "number") ? (typeof r > "u" && (r = t, t = 0), e >= Math.min(t, r) && e < Math.max(t, r)) : !1;
}
const SE = (e, t) => {
  const r = t === void 0 ? 0 : t;
  if (e == null)
    return r;
  const n = parseFloat(e);
  return isNaN(n) ? r : n;
}, hv = (e, t) => {
  const r = t === void 0 ? 0 : t;
  if (e == null)
    return r;
  const n = parseInt(e);
  return isNaN(n) ? r : n;
}, xE = (e, t = (r) => r === void 0) => e ? Object.keys(e).reduce((n, i) => (t(e[i]) || (n[i] = e[i]), n), {}) : {}, ol = (e, t) => Object.keys(e).reduce((n, i) => (n[t(i, e[i])] = e[i], n), {}), RE = (e, t) => Object.keys(e).reduce((n, i) => (n[i] = t(e[i], i), n), {}), TE = (e, t) => e ? Object.entries(e).reduce((r, [n, i]) => {
  const [s, o] = t(n, i);
  return r[s] = o, r;
}, {}) : {}, PE = (e) => e ? Object.keys(e).reduce((r, n) => (r[e[n]] = n, r), {}) : {}, NE = (e) => ol(e, (t) => t.toLowerCase()), $E = (e) => ol(e, (t) => t.toUpperCase()), pv = (e) => {
  if (nv(e))
    return e;
  if (typeof e == "function")
    return e.bind({});
  const t = new e.constructor();
  return Object.getOwnPropertyNames(e).forEach((r) => {
    t[r] = e[r];
  }), t;
}, ME = (e, t) => {
  if (!e) return [];
  const r = Object.entries(e);
  return r.length === 0 ? [] : r.reduce((n, i) => (n.push(t(i[0], i[1])), n), []);
}, IE = (e, t) => e ? t.reduce((r, n) => (Object.prototype.hasOwnProperty.call(e, n) && (r[n] = e[n]), r), {}) : {}, DE = (e, t) => e ? !t || t.length === 0 ? e : t.reduce(
  (r, n) => (delete r[n], r),
  { ...e }
) : {}, dv = (e, t, r) => {
  const n = t.split(/[\.\[\]]/g);
  let i = e;
  for (const s of n) {
    if (i === null || i === void 0) return r;
    const o = s.replace(/['"]/g, "");
    o.trim() !== "" && (i = i[o]);
  }
  return i === void 0 ? r : i;
}, _v = (e, t, r) => {
  if (!e) return {};
  if (!t || r === void 0) return e;
  const n = t.split(/[\.\[\]]/g).filter((o) => !!o.trim()), i = (o) => {
    if (n.length > 1) {
      const a = n.shift(), u = hv(n[0], null) !== null;
      o[a] = o[a] === void 0 ? u ? [] : {} : o[a], i(o[a]);
    } else
      o[n[0]] = r;
  }, s = pv(e);
  return i(s), s;
}, vv = (e, t) => !e || !t ? e ?? t ?? {} : Object.entries({ ...e, ...t }).reduce(
  (r, [n, i]) => ({
    ...r,
    [n]: rl(e[n]) ? vv(e[n], i) : i
  }),
  {}
), gv = (e) => {
  if (!e) return [];
  const t = (r, n) => rl(r) ? Object.entries(r).flatMap(
    ([i, s]) => t(s, [...n, i])
  ) : Ds(r) ? r.flatMap((i, s) => t(i, [...n, `${s}`])) : [n.join(".")];
  return t(e, []);
}, CE = (e) => e ? uv(
  gv(e),
  (t) => t,
  (t) => dv(e, t)
) : {}, LE = (e) => e ? Object.keys(e).reduce((t, r) => _v(t, r, e[r]), {}) : {}, al = (e, t) => Math.floor(Math.random() * (t - e + 1) + e), jE = (e) => {
  const t = e.length;
  if (t === 0)
    return null;
  const r = al(0, t - 1);
  return e[r];
}, FE = (e) => e.map((t) => ({ rand: Math.random(), value: t })).sort((t, r) => t.rand - r.rand).map((t) => t.value), BE = (e, t = "") => {
  const r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" + t;
  return cv(
    e,
    (n) => n + r.charAt(al(0, r.length - 1)),
    ""
  );
}, zE = (e, t = (r) => `${r}`) => {
  const { indexesByKey: r, itemsByIndex: n } = e.reduce(
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
  ), i = (l, h) => r[t(l)] < r[t(h)] ? l : h, s = (l, h) => r[t(l)] > r[t(h)] ? l : h, o = () => n[0], a = () => n[e.length - 1], u = (l, h) => n[r[t(l)] + 1] ?? h ?? o(), f = (l, h) => n[r[t(l)] - 1] ?? h ?? a();
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
      return sl(0, _ - 1).reduce(
        (v) => h > 0 ? u(v) : f(v),
        l
      );
    }
  };
}, fo = (e) => {
  if (!e || e.length === 0) return "";
  const t = e.toLowerCase();
  return t.substring(0, 1).toUpperCase() + t.substring(1, t.length);
}, UE = (e) => {
  const t = e?.replace(/([A-Z])+/g, fo)?.split(/(?=[A-Z])|[\.\-\s_]/).map((r) => r.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.length === 1 ? t[0] : t.reduce((r, n) => `${r}${n.charAt(0).toUpperCase()}${n.slice(1)}`);
}, VE = (e, t) => {
  const r = e?.replace(/([A-Z])+/g, fo).split(/(?=[A-Z])|[\.\-\s_]/).map((i) => i.toLowerCase()) ?? [];
  if (r.length === 0) return "";
  if (r.length === 1) return r[0];
  const n = r.reduce((i, s) => `${i}_${s.toLowerCase()}`);
  return t?.splitOnNumber === !1 ? n : n.replace(/([A-Za-z]{1}[0-9]{1})/, (i) => `${i[0]}_${i[1]}`);
}, kE = (e) => {
  const t = e?.replace(/([A-Z])+/g, fo)?.split(/(?=[A-Z])|[\.\-\s_]/).map((r) => r.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.length === 1 ? t[0] : t.reduce((r, n) => `${r}-${n.toLowerCase()}`);
}, WE = (e) => {
  const t = e?.split(/[\.\-\s_]/).map((r) => r.toLowerCase()) ?? [];
  return t.length === 0 ? "" : t.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join("");
}, qE = (e) => e ? e.split(/(?=[A-Z])|[\.\-\s_]/).map((t) => t.trim()).filter((t) => !!t).map((t) => fo(t.toLowerCase())).join(" ") : "", GE = (e, t, r = /\{\{(.+?)\}\}/g) => Array.from(e.matchAll(r)).reduce((n, i) => n.replace(i[0], t[i[1]]), e), HE = (e, t = " ") => {
  if (!e) return "";
  const r = t.replace(/[\W]{1}/g, "\\$&"), n = new RegExp(`^[${r}]+|[${r}]+$`, "g");
  return e.replace(n, "");
}, Gz = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  all: lE,
  alphabetical: qO,
  assign: vv,
  boil: nl,
  callable: OE,
  camel: UE,
  capitalize: fo,
  chain: dE,
  clone: pv,
  cluster: JO,
  compose: _E,
  construct: LE,
  counting: GO,
  crush: CE,
  dash: kE,
  debounce: wE,
  defer: fE,
  diff: sE,
  draw: jE,
  first: kO,
  flat: QO,
  fork: fv,
  get: dv,
  group: BO,
  guard: pE,
  inRange: EE,
  intersects: eE,
  invert: PE,
  isArray: Ds,
  isDate: iv,
  isEmpty: FO,
  isEqual: ov,
  isFloat: jO,
  isFunction: uo,
  isInt: LO,
  isNumber: _i,
  isObject: rl,
  isPrimitive: nv,
  isPromise: sv,
  isString: CO,
  isSymbol: rv,
  iterate: cv,
  keys: gv,
  last: WO,
  list: sl,
  listify: ME,
  lowerize: NE,
  map: uE,
  mapEntries: TE,
  mapKeys: ol,
  mapValues: RE,
  max: YO,
  memo: mE,
  merge: tE,
  min: XO,
  objectify: uv,
  omit: DE,
  parallel: cE,
  partial: vE,
  partob: gE,
  pascal: WE,
  pick: IE,
  proxied: yE,
  random: al,
  range: il,
  reduce: aE,
  replace: HO,
  replaceOrAppend: rE,
  retry: hE,
  select: KO,
  series: zE,
  set: _v,
  shake: xE,
  shift: oE,
  shuffle: FE,
  sift: iE,
  sleep: Zf,
  snake: VE,
  sort: av,
  sum: VO,
  template: GE,
  throttle: AE,
  title: qE,
  toFloat: SE,
  toInt: hv,
  toggle: nE,
  trim: HE,
  try: Si,
  tryit: Si,
  uid: BE,
  unique: ZO,
  upperize: $E,
  zip: zO,
  zipToObject: UO
}, Symbol.toStringTag, { value: "Module" }));
var yv = typeof global == "object" && global && global.Object === Object && global, KE = typeof self == "object" && self && self.Object === Object && self, Ee = yv || KE || Function("return this")(), Ie = Ee.Symbol, bv = Object.prototype, YE = bv.hasOwnProperty, XE = bv.toString, ls = Ie ? Ie.toStringTag : void 0;
function JE(e) {
  var t = YE.call(e, ls), r = e[ls];
  try {
    e[ls] = void 0;
    var n = !0;
  } catch {
  }
  var i = XE.call(e);
  return n && (t ? e[ls] = r : delete e[ls]), i;
}
var ZE = Object.prototype, QE = ZE.toString;
function eS(e) {
  return QE.call(e);
}
var tS = "[object Null]", rS = "[object Undefined]", Mp = Ie ? Ie.toStringTag : void 0;
function qe(e) {
  return e == null ? e === void 0 ? rS : tS : Mp && Mp in Object(e) ? JE(e) : eS(e);
}
function se(e) {
  return e != null && typeof e == "object";
}
var nS = "[object Symbol]";
function nt(e) {
  return typeof e == "symbol" || se(e) && qe(e) == nS;
}
var iS = NaN;
function Ip(e) {
  return typeof e == "number" ? e : nt(e) ? iS : +e;
}
function ne(e, t) {
  for (var r = -1, n = e == null ? 0 : e.length, i = Array(n); ++r < n; )
    i[r] = t(e[r], r, e);
  return i;
}
var M = Array.isArray, Dp = Ie ? Ie.prototype : void 0, Cp = Dp ? Dp.toString : void 0;
function yt(e) {
  if (typeof e == "string")
    return e;
  if (M(e))
    return ne(e, yt) + "";
  if (nt(e))
    return Cp ? Cp.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function su(e, t) {
  return function(r, n) {
    var i;
    if (r === void 0 && n === void 0)
      return t;
    if (r !== void 0 && (i = r), n !== void 0) {
      if (i === void 0)
        return n;
      typeof r == "string" || typeof n == "string" ? (r = yt(r), n = yt(n)) : (r = Ip(r), n = Ip(n)), i = e(r, n);
    }
    return i;
  };
}
var mv = su(function(e, t) {
  return e + t;
}, 0), sS = /\s/;
function wv(e) {
  for (var t = e.length; t-- && sS.test(e.charAt(t)); )
    ;
  return t;
}
var oS = /^\s+/;
function Av(e) {
  return e && e.slice(0, wv(e) + 1).replace(oS, "");
}
function ie(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var Lp = NaN, aS = /^[-+]0x[0-9a-f]+$/i, uS = /^0b[01]+$/i, fS = /^0o[0-7]+$/i, cS = parseInt;
function pt(e) {
  if (typeof e == "number")
    return e;
  if (nt(e))
    return Lp;
  if (ie(e)) {
    var t = typeof e.valueOf == "function" ? e.valueOf() : e;
    e = ie(t) ? t + "" : t;
  }
  if (typeof e != "string")
    return e === 0 ? e : +e;
  e = Av(e);
  var r = uS.test(e);
  return r || fS.test(e) ? cS(e.slice(2), r ? 2 : 8) : aS.test(e) ? Lp : +e;
}
var jp = 1 / 0, lS = 17976931348623157e292;
function cr(e) {
  if (!e)
    return e === 0 ? e : 0;
  if (e = pt(e), e === jp || e === -jp) {
    var t = e < 0 ? -1 : 1;
    return t * lS;
  }
  return e === e ? e : 0;
}
function I(e) {
  var t = cr(e), r = t % 1;
  return t === t ? r ? t - r : t : 0;
}
var hS = "Expected a function";
function Ov(e, t) {
  if (typeof t != "function")
    throw new TypeError(hS);
  return e = I(e), function() {
    if (--e < 1)
      return t.apply(this, arguments);
  };
}
function Ge(e) {
  return e;
}
var pS = "[object AsyncFunction]", dS = "[object Function]", _S = "[object GeneratorFunction]", vS = "[object Proxy]";
function yr(e) {
  if (!ie(e))
    return !1;
  var t = qe(e);
  return t == dS || t == _S || t == pS || t == vS;
}
var va = Ee["__core-js_shared__"], Fp = function() {
  var e = /[^.]+$/.exec(va && va.keys && va.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}();
function gS(e) {
  return !!Fp && Fp in e;
}
var yS = Function.prototype, bS = yS.toString;
function qn(e) {
  if (e != null) {
    try {
      return bS.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
var mS = /[\\^$.*+?()[\]{}|]/g, wS = /^\[object .+?Constructor\]$/, AS = Function.prototype, OS = Object.prototype, ES = AS.toString, SS = OS.hasOwnProperty, xS = RegExp(
  "^" + ES.call(SS).replace(mS, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function Ev(e) {
  if (!ie(e) || gS(e))
    return !1;
  var t = yr(e) ? xS : wS;
  return t.test(qn(e));
}
function RS(e, t) {
  return e?.[t];
}
function Gn(e, t) {
  var r = RS(e, t);
  return Ev(r) ? r : void 0;
}
var Cs = Gn(Ee, "WeakMap"), Sa = Cs && new Cs(), Sv = Sa ? function(e, t) {
  return Sa.set(e, t), e;
} : Ge, Bp = Object.create, Vi = /* @__PURE__ */ function() {
  function e() {
  }
  return function(t) {
    if (!ie(t))
      return {};
    if (Bp)
      return Bp(t);
    e.prototype = t;
    var r = new e();
    return e.prototype = void 0, r;
  };
}();
function Ls(e) {
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
    var r = Vi(e.prototype), n = e.apply(r, t);
    return ie(n) ? n : r;
  };
}
var TS = 1;
function PS(e, t, r) {
  var n = t & TS, i = Ls(e);
  function s() {
    var o = this && this !== Ee && this instanceof s ? i : e;
    return o.apply(n ? r : this, arguments);
  }
  return s;
}
function bt(e, t, r) {
  switch (r.length) {
    case 0:
      return e.call(t);
    case 1:
      return e.call(t, r[0]);
    case 2:
      return e.call(t, r[0], r[1]);
    case 3:
      return e.call(t, r[0], r[1], r[2]);
  }
  return e.apply(t, r);
}
var NS = Math.max;
function xv(e, t, r, n) {
  for (var i = -1, s = e.length, o = r.length, a = -1, u = t.length, f = NS(s - o, 0), c = Array(u + f), l = !n; ++a < u; )
    c[a] = t[a];
  for (; ++i < o; )
    (l || i < s) && (c[r[i]] = e[i]);
  for (; f--; )
    c[a++] = e[i++];
  return c;
}
var $S = Math.max;
function Rv(e, t, r, n) {
  for (var i = -1, s = e.length, o = -1, a = r.length, u = -1, f = t.length, c = $S(s - a, 0), l = Array(c + f), h = !n; ++i < c; )
    l[i] = e[i];
  for (var d = i; ++u < f; )
    l[d + u] = t[u];
  for (; ++o < a; )
    (h || i < s) && (l[d + r[o]] = e[i++]);
  return l;
}
function MS(e, t) {
  for (var r = e.length, n = 0; r--; )
    e[r] === t && ++n;
  return n;
}
function ou() {
}
var IS = 4294967295;
function C(e) {
  this.__wrapped__ = e, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = IS, this.__views__ = [];
}
C.prototype = Vi(ou.prototype);
C.prototype.constructor = C;
function au() {
}
var ul = Sa ? function(e) {
  return Sa.get(e);
} : au, vi = {}, DS = Object.prototype, CS = DS.hasOwnProperty;
function ga(e) {
  for (var t = e.name + "", r = vi[t], n = CS.call(vi, t) ? r.length : 0; n--; ) {
    var i = r[n], s = i.func;
    if (s == null || s == e)
      return i.name;
  }
  return t;
}
function Lt(e, t) {
  this.__wrapped__ = e, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = void 0;
}
Lt.prototype = Vi(ou.prototype);
Lt.prototype.constructor = Lt;
function tt(e, t) {
  var r = -1, n = e.length;
  for (t || (t = Array(n)); ++r < n; )
    t[r] = e[r];
  return t;
}
function Tv(e) {
  if (e instanceof C)
    return e.clone();
  var t = new Lt(e.__wrapped__, e.__chain__);
  return t.__actions__ = tt(e.__actions__), t.__index__ = e.__index__, t.__values__ = e.__values__, t;
}
var LS = Object.prototype, jS = LS.hasOwnProperty;
function p(e) {
  if (se(e) && !M(e) && !(e instanceof C)) {
    if (e instanceof Lt)
      return e;
    if (jS.call(e, "__wrapped__"))
      return Tv(e);
  }
  return new Lt(e);
}
p.prototype = ou.prototype;
p.prototype.constructor = p;
function Qf(e) {
  var t = ga(e), r = p[t];
  if (typeof r != "function" || !(t in C.prototype))
    return !1;
  if (e === r)
    return !0;
  var n = ul(r);
  return !!n && e === n[0];
}
var FS = 800, BS = 16, zS = Date.now;
function Pv(e) {
  var t = 0, r = 0;
  return function() {
    var n = zS(), i = BS - (n - r);
    if (r = n, i > 0) {
      if (++t >= FS)
        return arguments[0];
    } else
      t = 0;
    return e.apply(void 0, arguments);
  };
}
var Nv = Pv(Sv), US = /\{\n\/\* \[wrapped with (.+)\] \*/, VS = /,? & /;
function kS(e) {
  var t = e.match(US);
  return t ? t[1].split(VS) : [];
}
var WS = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
function qS(e, t) {
  var r = t.length;
  if (!r)
    return e;
  var n = r - 1;
  return t[n] = (r > 1 ? "& " : "") + t[n], t = t.join(r > 2 ? ", " : " "), e.replace(WS, `{
/* [wrapped with ` + t + `] */
`);
}
function uu(e) {
  return function() {
    return e;
  };
}
var xa = function() {
  try {
    var e = Gn(Object, "defineProperty");
    return e({}, "", {}), e;
  } catch {
  }
}(), GS = xa ? function(e, t) {
  return xa(e, "toString", {
    configurable: !0,
    enumerable: !1,
    value: uu(t),
    writable: !0
  });
} : Ge, fl = Pv(GS);
function zt(e, t) {
  for (var r = -1, n = e == null ? 0 : e.length; ++r < n && t(e[r], r, e) !== !1; )
    ;
  return e;
}
function fu(e, t, r, n) {
  for (var i = e.length, s = r + (n ? 1 : -1); n ? s-- : ++s < i; )
    if (t(e[s], s, e))
      return s;
  return -1;
}
function $v(e) {
  return e !== e;
}
function HS(e, t, r) {
  for (var n = r - 1, i = e.length; ++n < i; )
    if (e[n] === t)
      return n;
  return -1;
}
function ki(e, t, r) {
  return t === t ? HS(e, t, r) : fu(e, $v, r);
}
function cu(e, t) {
  var r = e == null ? 0 : e.length;
  return !!r && ki(e, t, 0) > -1;
}
var KS = 1, YS = 2, XS = 8, JS = 16, ZS = 32, QS = 64, ex = 128, tx = 256, rx = 512, nx = [
  ["ary", ex],
  ["bind", KS],
  ["bindKey", YS],
  ["curry", XS],
  ["curryRight", JS],
  ["flip", rx],
  ["partial", ZS],
  ["partialRight", QS],
  ["rearg", tx]
];
function ix(e, t) {
  return zt(nx, function(r) {
    var n = "_." + r[0];
    t & r[1] && !cu(e, n) && e.push(n);
  }), e.sort();
}
function Mv(e, t, r) {
  var n = t + "";
  return fl(e, qS(n, ix(kS(n), r)));
}
var sx = 4, ox = 8, zp = 32, Up = 64;
function Iv(e, t, r, n, i, s, o, a, u, f) {
  var c = t & ox, l = c ? o : void 0, h = c ? void 0 : o, d = c ? s : void 0, _ = c ? void 0 : s;
  t |= c ? zp : Up, t &= ~(c ? Up : zp), t & sx || (t &= -4);
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
  ], g = r.apply(void 0, v);
  return Qf(e) && Nv(g, v), g.placeholder = n, Mv(g, e, t);
}
function Wi(e) {
  var t = e;
  return t.placeholder;
}
var ax = 9007199254740991, ux = /^(?:0|[1-9]\d*)$/;
function Vr(e, t) {
  var r = typeof e;
  return t = t ?? ax, !!t && (r == "number" || r != "symbol" && ux.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
var fx = Math.min;
function cx(e, t) {
  for (var r = e.length, n = fx(t.length, r), i = tt(e); n--; ) {
    var s = t[n];
    e[n] = Vr(s, r) ? i[s] : void 0;
  }
  return e;
}
var Vp = "__lodash_placeholder__";
function nn(e, t) {
  for (var r = -1, n = e.length, i = 0, s = []; ++r < n; ) {
    var o = e[r];
    (o === t || o === Vp) && (e[r] = Vp, s[i++] = r);
  }
  return s;
}
var lx = 1, hx = 2, px = 8, dx = 16, _x = 128, vx = 512;
function lu(e, t, r, n, i, s, o, a, u, f) {
  var c = t & _x, l = t & lx, h = t & hx, d = t & (px | dx), _ = t & vx, v = h ? void 0 : Ls(e);
  function g() {
    for (var y = arguments.length, b = Array(y), w = y; w--; )
      b[w] = arguments[w];
    if (d)
      var m = Wi(g), A = MS(b, m);
    if (n && (b = xv(b, n, i, d)), s && (b = Rv(b, s, o, d)), y -= A, d && y < f) {
      var S = nn(b, m);
      return Iv(
        e,
        t,
        lu,
        g.placeholder,
        r,
        b,
        S,
        a,
        u,
        f - y
      );
    }
    var T = l ? r : this, F = h ? T[e] : e;
    return y = b.length, a ? b = cx(b, a) : _ && y > 1 && b.reverse(), c && u < y && (b.length = u), this && this !== Ee && this instanceof g && (F = v || Ls(F)), F.apply(T, b);
  }
  return g;
}
function gx(e, t, r) {
  var n = Ls(e);
  function i() {
    for (var s = arguments.length, o = Array(s), a = s, u = Wi(i); a--; )
      o[a] = arguments[a];
    var f = s < 3 && o[0] !== u && o[s - 1] !== u ? [] : nn(o, u);
    if (s -= f.length, s < r)
      return Iv(
        e,
        t,
        lu,
        i.placeholder,
        void 0,
        o,
        f,
        void 0,
        void 0,
        r - s
      );
    var c = this && this !== Ee && this instanceof i ? n : e;
    return bt(c, this, o);
  }
  return i;
}
var yx = 1;
function bx(e, t, r, n) {
  var i = t & yx, s = Ls(e);
  function o() {
    for (var a = -1, u = arguments.length, f = -1, c = n.length, l = Array(c + u), h = this && this !== Ee && this instanceof o ? s : e; ++f < c; )
      l[f] = n[f];
    for (; u--; )
      l[f++] = arguments[++a];
    return bt(h, i ? r : this, l);
  }
  return o;
}
var kp = "__lodash_placeholder__", Af = 1, mx = 2, wx = 4, Wp = 8, hs = 128, qp = 256, Ax = Math.min;
function Ox(e, t) {
  var r = e[1], n = t[1], i = r | n, s = i < (Af | mx | hs), o = n == hs && r == Wp || n == hs && r == qp && e[7].length <= t[8] || n == (hs | qp) && t[7].length <= t[8] && r == Wp;
  if (!(s || o))
    return e;
  n & Af && (e[2] = t[2], i |= r & Af ? 0 : wx);
  var a = t[3];
  if (a) {
    var u = e[3];
    e[3] = u ? xv(u, a, t[4]) : a, e[4] = u ? nn(e[3], kp) : t[4];
  }
  return a = t[5], a && (u = e[5], e[5] = u ? Rv(u, a, t[6]) : a, e[6] = u ? nn(e[5], kp) : t[6]), a = t[7], a && (e[7] = a), n & hs && (e[8] = e[8] == null ? t[8] : Ax(e[8], t[8])), e[9] == null && (e[9] = t[9]), e[0] = t[0], e[1] = i, e;
}
var Ex = "Expected a function", Gp = 1, Sx = 2, Hp = 8, Kp = 16, Yp = 32, xx = 64, Xp = Math.max;
function kr(e, t, r, n, i, s, o, a) {
  var u = t & Sx;
  if (!u && typeof e != "function")
    throw new TypeError(Ex);
  var f = n ? n.length : 0;
  if (f || (t &= -97, n = i = void 0), o = o === void 0 ? o : Xp(I(o), 0), a = a === void 0 ? a : I(a), f -= i ? i.length : 0, t & xx) {
    var c = n, l = i;
    n = i = void 0;
  }
  var h = u ? void 0 : ul(e), d = [
    e,
    t,
    r,
    n,
    i,
    c,
    l,
    s,
    o,
    a
  ];
  if (h && Ox(d, h), e = d[0], t = d[1], r = d[2], n = d[3], i = d[4], a = d[9] = d[9] === void 0 ? u ? 0 : e.length : Xp(d[9] - f, 0), !a && t & (Hp | Kp) && (t &= -25), !t || t == Gp)
    var _ = PS(e, t, r);
  else t == Hp || t == Kp ? _ = gx(e, t, a) : (t == Yp || t == (Gp | Yp)) && !i.length ? _ = bx(e, t, r, n) : _ = lu.apply(void 0, d);
  var v = h ? Sv : Nv;
  return Mv(v(_, d), e, t);
}
var Rx = 128;
function cl(e, t, r) {
  return t = r ? void 0 : t, t = e && t == null ? e.length : t, kr(e, Rx, void 0, void 0, void 0, void 0, t);
}
function Wr(e, t, r) {
  t == "__proto__" && xa ? xa(e, t, {
    configurable: !0,
    enumerable: !0,
    value: r,
    writable: !0
  }) : e[t] = r;
}
function Ut(e, t) {
  return e === t || e !== e && t !== t;
}
var Tx = Object.prototype, Px = Tx.hasOwnProperty;
function co(e, t, r) {
  var n = e[t];
  (!(Px.call(e, t) && Ut(n, r)) || r === void 0 && !(t in e)) && Wr(e, t, r);
}
function br(e, t, r, n) {
  var i = !r;
  r || (r = {});
  for (var s = -1, o = t.length; ++s < o; ) {
    var a = t[s], u = n ? n(r[a], e[a], a, r, e) : void 0;
    u === void 0 && (u = e[a]), i ? Wr(r, a, u) : co(r, a, u);
  }
  return r;
}
var Jp = Math.max;
function Dv(e, t, r) {
  return t = Jp(t === void 0 ? e.length - 1 : t, 0), function() {
    for (var n = arguments, i = -1, s = Jp(n.length - t, 0), o = Array(s); ++i < s; )
      o[i] = n[t + i];
    i = -1;
    for (var a = Array(t + 1); ++i < t; )
      a[i] = n[i];
    return a[t] = r(o), bt(e, this, a);
  };
}
function D(e, t) {
  return fl(Dv(e, t, Ge), e + "");
}
var Nx = 9007199254740991;
function lo(e) {
  return typeof e == "number" && e > -1 && e % 1 == 0 && e <= Nx;
}
function He(e) {
  return e != null && lo(e.length) && !yr(e);
}
function ke(e, t, r) {
  if (!ie(r))
    return !1;
  var n = typeof t;
  return (n == "number" ? He(r) && Vr(t, r.length) : n == "string" && t in r) ? Ut(r[t], e) : !1;
}
function qi(e) {
  return D(function(t, r) {
    var n = -1, i = r.length, s = i > 1 ? r[i - 1] : void 0, o = i > 2 ? r[2] : void 0;
    for (s = e.length > 3 && typeof s == "function" ? (i--, s) : void 0, o && ke(r[0], r[1], o) && (s = i < 3 ? void 0 : s, i = 1), t = Object(t); ++n < i; ) {
      var a = r[n];
      a && e(t, a, n, s);
    }
    return t;
  });
}
var $x = Object.prototype;
function ho(e) {
  var t = e && e.constructor, r = typeof t == "function" && t.prototype || $x;
  return e === r;
}
function ll(e, t) {
  for (var r = -1, n = Array(e); ++r < e; )
    n[r] = t(r);
  return n;
}
var Mx = "[object Arguments]";
function Zp(e) {
  return se(e) && qe(e) == Mx;
}
var Cv = Object.prototype, Ix = Cv.hasOwnProperty, Dx = Cv.propertyIsEnumerable, sn = Zp(/* @__PURE__ */ function() {
  return arguments;
}()) ? Zp : function(e) {
  return se(e) && Ix.call(e, "callee") && !Dx.call(e, "callee");
};
function hu() {
  return !1;
}
var Lv = typeof exports == "object" && exports && !exports.nodeType && exports, Qp = Lv && typeof module == "object" && module && !module.nodeType && module, Cx = Qp && Qp.exports === Lv, ed = Cx ? Ee.Buffer : void 0, Lx = ed ? ed.isBuffer : void 0, Br = Lx || hu, jx = "[object Arguments]", Fx = "[object Array]", Bx = "[object Boolean]", zx = "[object Date]", Ux = "[object Error]", Vx = "[object Function]", kx = "[object Map]", Wx = "[object Number]", qx = "[object Object]", Gx = "[object RegExp]", Hx = "[object Set]", Kx = "[object String]", Yx = "[object WeakMap]", Xx = "[object ArrayBuffer]", Jx = "[object DataView]", Zx = "[object Float32Array]", Qx = "[object Float64Array]", e2 = "[object Int8Array]", t2 = "[object Int16Array]", r2 = "[object Int32Array]", n2 = "[object Uint8Array]", i2 = "[object Uint8ClampedArray]", s2 = "[object Uint16Array]", o2 = "[object Uint32Array]", ee = {};
ee[Zx] = ee[Qx] = ee[e2] = ee[t2] = ee[r2] = ee[n2] = ee[i2] = ee[s2] = ee[o2] = !0;
ee[jx] = ee[Fx] = ee[Xx] = ee[Bx] = ee[Jx] = ee[zx] = ee[Ux] = ee[Vx] = ee[kx] = ee[Wx] = ee[qx] = ee[Gx] = ee[Hx] = ee[Kx] = ee[Yx] = !1;
function a2(e) {
  return se(e) && lo(e.length) && !!ee[qe(e)];
}
function mt(e) {
  return function(t) {
    return e(t);
  };
}
var jv = typeof exports == "object" && exports && !exports.nodeType && exports, ws = jv && typeof module == "object" && module && !module.nodeType && module, u2 = ws && ws.exports === jv, Of = u2 && yv.process, jt = function() {
  try {
    var e = ws && ws.require && ws.require("util").types;
    return e || Of && Of.binding && Of.binding("util");
  } catch {
  }
}(), td = jt && jt.isTypedArray, Hn = td ? mt(td) : a2, f2 = Object.prototype, c2 = f2.hasOwnProperty;
function Fv(e, t) {
  var r = M(e), n = !r && sn(e), i = !r && !n && Br(e), s = !r && !n && !i && Hn(e), o = r || n || i || s, a = o ? ll(e.length, String) : [], u = a.length;
  for (var f in e)
    (t || c2.call(e, f)) && !(o && // Safari 9 has enumerable `arguments.length` in strict mode.
    (f == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    i && (f == "offset" || f == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    s && (f == "buffer" || f == "byteLength" || f == "byteOffset") || // Skip index properties.
    Vr(f, u))) && a.push(f);
  return a;
}
function Bv(e, t) {
  return function(r) {
    return e(t(r));
  };
}
var l2 = Bv(Object.keys, Object), h2 = Object.prototype, p2 = h2.hasOwnProperty;
function hl(e) {
  if (!ho(e))
    return l2(e);
  var t = [];
  for (var r in Object(e))
    p2.call(e, r) && r != "constructor" && t.push(r);
  return t;
}
function _e(e) {
  return He(e) ? Fv(e) : hl(e);
}
var d2 = Object.prototype, _2 = d2.hasOwnProperty, zv = qi(function(e, t) {
  if (ho(t) || He(t)) {
    br(t, _e(t), e);
    return;
  }
  for (var r in t)
    _2.call(t, r) && co(e, r, t[r]);
});
function v2(e) {
  var t = [];
  if (e != null)
    for (var r in Object(e))
      t.push(r);
  return t;
}
var g2 = Object.prototype, y2 = g2.hasOwnProperty;
function b2(e) {
  if (!ie(e))
    return v2(e);
  var t = ho(e), r = [];
  for (var n in e)
    n == "constructor" && (t || !y2.call(e, n)) || r.push(n);
  return r;
}
function Ke(e) {
  return He(e) ? Fv(e, !0) : b2(e);
}
var ec = qi(function(e, t) {
  br(t, Ke(t), e);
}), js = qi(function(e, t, r, n) {
  br(t, Ke(t), e, n);
}), Uv = qi(function(e, t, r, n) {
  br(t, _e(t), e, n);
}), m2 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, w2 = /^\w*$/;
function pl(e, t) {
  if (M(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || nt(e) ? !0 : w2.test(e) || !m2.test(e) || t != null && e in Object(t);
}
var Fs = Gn(Object, "create");
function A2() {
  this.__data__ = Fs ? Fs(null) : {}, this.size = 0;
}
function O2(e) {
  var t = this.has(e) && delete this.__data__[e];
  return this.size -= t ? 1 : 0, t;
}
var E2 = "__lodash_hash_undefined__", S2 = Object.prototype, x2 = S2.hasOwnProperty;
function R2(e) {
  var t = this.__data__;
  if (Fs) {
    var r = t[e];
    return r === E2 ? void 0 : r;
  }
  return x2.call(t, e) ? t[e] : void 0;
}
var T2 = Object.prototype, P2 = T2.hasOwnProperty;
function N2(e) {
  var t = this.__data__;
  return Fs ? t[e] !== void 0 : P2.call(t, e);
}
var $2 = "__lodash_hash_undefined__";
function M2(e, t) {
  var r = this.__data__;
  return this.size += this.has(e) ? 0 : 1, r[e] = Fs && t === void 0 ? $2 : t, this;
}
function $n(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
$n.prototype.clear = A2;
$n.prototype.delete = O2;
$n.prototype.get = R2;
$n.prototype.has = N2;
$n.prototype.set = M2;
function I2() {
  this.__data__ = [], this.size = 0;
}
function pu(e, t) {
  for (var r = e.length; r--; )
    if (Ut(e[r][0], t))
      return r;
  return -1;
}
var D2 = Array.prototype, C2 = D2.splice;
function L2(e) {
  var t = this.__data__, r = pu(t, e);
  if (r < 0)
    return !1;
  var n = t.length - 1;
  return r == n ? t.pop() : C2.call(t, r, 1), --this.size, !0;
}
function j2(e) {
  var t = this.__data__, r = pu(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function F2(e) {
  return pu(this.__data__, e) > -1;
}
function B2(e, t) {
  var r = this.__data__, n = pu(r, e);
  return n < 0 ? (++this.size, r.push([e, t])) : r[n][1] = t, this;
}
function qr(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
qr.prototype.clear = I2;
qr.prototype.delete = L2;
qr.prototype.get = j2;
qr.prototype.has = F2;
qr.prototype.set = B2;
var Bs = Gn(Ee, "Map");
function z2() {
  this.size = 0, this.__data__ = {
    hash: new $n(),
    map: new (Bs || qr)(),
    string: new $n()
  };
}
function U2(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function du(e, t) {
  var r = e.__data__;
  return U2(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function V2(e) {
  var t = du(this, e).delete(e);
  return this.size -= t ? 1 : 0, t;
}
function k2(e) {
  return du(this, e).get(e);
}
function W2(e) {
  return du(this, e).has(e);
}
function q2(e, t) {
  var r = du(this, e), n = r.size;
  return r.set(e, t), this.size += r.size == n ? 0 : 1, this;
}
function Gr(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
Gr.prototype.clear = z2;
Gr.prototype.delete = V2;
Gr.prototype.get = k2;
Gr.prototype.has = W2;
Gr.prototype.set = q2;
var G2 = "Expected a function";
function po(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function")
    throw new TypeError(G2);
  var r = function() {
    var n = arguments, i = t ? t.apply(this, n) : n[0], s = r.cache;
    if (s.has(i))
      return s.get(i);
    var o = e.apply(this, n);
    return r.cache = s.set(i, o) || s, o;
  };
  return r.cache = new (po.Cache || Gr)(), r;
}
po.Cache = Gr;
var H2 = 500;
function K2(e) {
  var t = po(e, function(n) {
    return r.size === H2 && r.clear(), n;
  }), r = t.cache;
  return t;
}
var Y2 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, X2 = /\\(\\)?/g, Vv = K2(function(e) {
  var t = [];
  return e.charCodeAt(0) === 46 && t.push(""), e.replace(Y2, function(r, n, i, s) {
    t.push(i ? s.replace(X2, "$1") : n || r);
  }), t;
});
function k(e) {
  return e == null ? "" : yt(e);
}
function hn(e, t) {
  return M(e) ? e : pl(e, t) ? [e] : Vv(k(e));
}
function mr(e) {
  if (typeof e == "string" || nt(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function Kn(e, t) {
  t = hn(t, e);
  for (var r = 0, n = t.length; e != null && r < n; )
    e = e[mr(t[r++])];
  return r && r == n ? e : void 0;
}
function _u(e, t, r) {
  var n = e == null ? void 0 : Kn(e, t);
  return n === void 0 ? r : n;
}
function dl(e, t) {
  for (var r = -1, n = t.length, i = Array(n), s = e == null; ++r < n; )
    i[r] = s ? void 0 : _u(e, t[r]);
  return i;
}
function pn(e, t) {
  for (var r = -1, n = t.length, i = e.length; ++r < n; )
    e[i + r] = t[r];
  return e;
}
var rd = Ie ? Ie.isConcatSpreadable : void 0;
function J2(e) {
  return M(e) || sn(e) || !!(rd && e && e[rd]);
}
function Pe(e, t, r, n, i) {
  var s = -1, o = e.length;
  for (r || (r = J2), i || (i = []); ++s < o; ) {
    var a = e[s];
    t > 0 && r(a) ? t > 1 ? Pe(a, t - 1, r, n, i) : pn(i, a) : n || (i[i.length] = a);
  }
  return i;
}
function _l(e) {
  var t = e == null ? 0 : e.length;
  return t ? Pe(e, 1) : [];
}
function Hr(e) {
  return fl(Dv(e, void 0, _l), e + "");
}
var kv = Hr(dl), vu = Bv(Object.getPrototypeOf, Object), Z2 = "[object Object]", Q2 = Function.prototype, eR = Object.prototype, Wv = Q2.toString, tR = eR.hasOwnProperty, rR = Wv.call(Object);
function Gi(e) {
  if (!se(e) || qe(e) != Z2)
    return !1;
  var t = vu(e);
  if (t === null)
    return !0;
  var r = tR.call(t, "constructor") && t.constructor;
  return typeof r == "function" && r instanceof r && Wv.call(r) == rR;
}
var nR = "[object DOMException]", iR = "[object Error]";
function gu(e) {
  if (!se(e))
    return !1;
  var t = qe(e);
  return t == iR || t == nR || typeof e.message == "string" && typeof e.name == "string" && !Gi(e);
}
var vl = D(function(e, t) {
  try {
    return bt(e, void 0, t);
  } catch (r) {
    return gu(r) ? r : new Error(r);
  }
}), sR = "Expected a function";
function gl(e, t) {
  var r;
  if (typeof t != "function")
    throw new TypeError(sR);
  return e = I(e), function() {
    return --e > 0 && (r = t.apply(this, arguments)), e <= 1 && (t = void 0), r;
  };
}
var oR = 1, aR = 32, _o = D(function(e, t, r) {
  var n = oR;
  if (r.length) {
    var i = nn(r, Wi(_o));
    n |= aR;
  }
  return kr(e, n, t, r, i);
});
_o.placeholder = {};
var qv = Hr(function(e, t) {
  return zt(t, function(r) {
    r = mr(r), Wr(e, r, _o(e[r], e));
  }), e;
}), uR = 1, fR = 2, cR = 32, yu = D(function(e, t, r) {
  var n = uR | fR;
  if (r.length) {
    var i = nn(r, Wi(yu));
    n |= cR;
  }
  return kr(t, n, e, r, i);
});
yu.placeholder = {};
function Ft(e, t, r) {
  var n = -1, i = e.length;
  t < 0 && (t = -t > i ? 0 : i + t), r = r > i ? i : r, r < 0 && (r += i), i = t > r ? 0 : r - t >>> 0, t >>>= 0;
  for (var s = Array(i); ++n < i; )
    s[n] = e[n + t];
  return s;
}
function dn(e, t, r) {
  var n = e.length;
  return r = r === void 0 ? n : r, !t && r >= n ? e : Ft(e, t, r);
}
var lR = "\\ud800-\\udfff", hR = "\\u0300-\\u036f", pR = "\\ufe20-\\ufe2f", dR = "\\u20d0-\\u20ff", _R = hR + pR + dR, vR = "\\ufe0e\\ufe0f", gR = "\\u200d", yR = RegExp("[" + gR + lR + _R + vR + "]");
function Hi(e) {
  return yR.test(e);
}
function bR(e) {
  return e.split("");
}
var Gv = "\\ud800-\\udfff", mR = "\\u0300-\\u036f", wR = "\\ufe20-\\ufe2f", AR = "\\u20d0-\\u20ff", OR = mR + wR + AR, ER = "\\ufe0e\\ufe0f", SR = "[" + Gv + "]", tc = "[" + OR + "]", rc = "\\ud83c[\\udffb-\\udfff]", xR = "(?:" + tc + "|" + rc + ")", Hv = "[^" + Gv + "]", Kv = "(?:\\ud83c[\\udde6-\\uddff]){2}", Yv = "[\\ud800-\\udbff][\\udc00-\\udfff]", RR = "\\u200d", Xv = xR + "?", Jv = "[" + ER + "]?", TR = "(?:" + RR + "(?:" + [Hv, Kv, Yv].join("|") + ")" + Jv + Xv + ")*", PR = Jv + Xv + TR, NR = "(?:" + [Hv + tc + "?", tc, Kv, Yv, SR].join("|") + ")", $R = RegExp(rc + "(?=" + rc + ")|" + NR + PR, "g");
function MR(e) {
  return e.match($R) || [];
}
function Qt(e) {
  return Hi(e) ? MR(e) : bR(e);
}
function Zv(e) {
  return function(t) {
    t = k(t);
    var r = Hi(t) ? Qt(t) : void 0, n = r ? r[0] : t.charAt(0), i = r ? dn(r, 1).join("") : t.slice(1);
    return n[e]() + i;
  };
}
var bu = Zv("toUpperCase");
function yl(e) {
  return bu(k(e).toLowerCase());
}
function bl(e, t, r, n) {
  var i = -1, s = e == null ? 0 : e.length;
  for (n && s && (r = e[++i]); ++i < s; )
    r = t(r, e[i], i, e);
  return r;
}
function ml(e) {
  return function(t) {
    return e?.[t];
  };
}
var IR = {
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
}, DR = ml(IR), CR = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, LR = "\\u0300-\\u036f", jR = "\\ufe20-\\ufe2f", FR = "\\u20d0-\\u20ff", BR = LR + jR + FR, zR = "[" + BR + "]", UR = RegExp(zR, "g");
function wl(e) {
  return e = k(e), e && e.replace(CR, DR).replace(UR, "");
}
var VR = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
function kR(e) {
  return e.match(VR) || [];
}
var WR = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
function qR(e) {
  return WR.test(e);
}
var Qv = "\\ud800-\\udfff", GR = "\\u0300-\\u036f", HR = "\\ufe20-\\ufe2f", KR = "\\u20d0-\\u20ff", YR = GR + HR + KR, eg = "\\u2700-\\u27bf", tg = "a-z\\xdf-\\xf6\\xf8-\\xff", XR = "\\xac\\xb1\\xd7\\xf7", JR = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", ZR = "\\u2000-\\u206f", QR = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rg = "A-Z\\xc0-\\xd6\\xd8-\\xde", eT = "\\ufe0e\\ufe0f", ng = XR + JR + ZR + QR, ig = "['’]", nd = "[" + ng + "]", tT = "[" + YR + "]", sg = "\\d+", rT = "[" + eg + "]", og = "[" + tg + "]", ag = "[^" + Qv + ng + sg + eg + tg + rg + "]", nT = "\\ud83c[\\udffb-\\udfff]", iT = "(?:" + tT + "|" + nT + ")", sT = "[^" + Qv + "]", ug = "(?:\\ud83c[\\udde6-\\uddff]){2}", fg = "[\\ud800-\\udbff][\\udc00-\\udfff]", ci = "[" + rg + "]", oT = "\\u200d", id = "(?:" + og + "|" + ag + ")", aT = "(?:" + ci + "|" + ag + ")", sd = "(?:" + ig + "(?:d|ll|m|re|s|t|ve))?", od = "(?:" + ig + "(?:D|LL|M|RE|S|T|VE))?", cg = iT + "?", lg = "[" + eT + "]?", uT = "(?:" + oT + "(?:" + [sT, ug, fg].join("|") + ")" + lg + cg + ")*", fT = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", cT = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", lT = lg + cg + uT, hT = "(?:" + [rT, ug, fg].join("|") + ")" + lT, pT = RegExp([
  ci + "?" + og + "+" + sd + "(?=" + [nd, ci, "$"].join("|") + ")",
  aT + "+" + od + "(?=" + [nd, ci + id, "$"].join("|") + ")",
  ci + "?" + id + "+" + sd,
  ci + "+" + od,
  cT,
  fT,
  sg,
  hT
].join("|"), "g");
function dT(e) {
  return e.match(pT) || [];
}
function Al(e, t, r) {
  return e = k(e), t = r ? void 0 : t, t === void 0 ? qR(e) ? dT(e) : kR(e) : e.match(t) || [];
}
var _T = "['’]", vT = RegExp(_T, "g");
function Ki(e) {
  return function(t) {
    return bl(Al(wl(t).replace(vT, "")), e, "");
  };
}
var hg = Ki(function(e, t, r) {
  return t = t.toLowerCase(), e + (r ? yl(t) : t);
});
function pg() {
  if (!arguments.length)
    return [];
  var e = arguments[0];
  return M(e) ? e : [e];
}
var gT = Ee.isFinite, yT = Math.min;
function Ol(e) {
  var t = Math[e];
  return function(r, n) {
    if (r = pt(r), n = n == null ? 0 : yT(I(n), 292), n && gT(r)) {
      var i = (k(r) + "e").split("e"), s = t(i[0] + "e" + (+i[1] + n));
      return i = (k(s) + "e").split("e"), +(i[0] + "e" + (+i[1] - n));
    }
    return t(r);
  };
}
var dg = Ol("ceil");
function El(e) {
  var t = p(e);
  return t.__chain__ = !0, t;
}
var bT = Math.ceil, mT = Math.max;
function _g(e, t, r) {
  (r ? ke(e, t, r) : t === void 0) ? t = 1 : t = mT(I(t), 0);
  var n = e == null ? 0 : e.length;
  if (!n || t < 1)
    return [];
  for (var i = 0, s = 0, o = Array(bT(n / t)); i < n; )
    o[s++] = Ft(e, i, i += t);
  return o;
}
function Yn(e, t, r) {
  return e === e && (r !== void 0 && (e = e <= r ? e : r), t !== void 0 && (e = e >= t ? e : t)), e;
}
function vg(e, t, r) {
  return r === void 0 && (r = t, t = void 0), r !== void 0 && (r = pt(r), r = r === r ? r : 0), t !== void 0 && (t = pt(t), t = t === t ? t : 0), Yn(pt(e), t, r);
}
function wT() {
  this.__data__ = new qr(), this.size = 0;
}
function AT(e) {
  var t = this.__data__, r = t.delete(e);
  return this.size = t.size, r;
}
function OT(e) {
  return this.__data__.get(e);
}
function ET(e) {
  return this.__data__.has(e);
}
var ST = 200;
function xT(e, t) {
  var r = this.__data__;
  if (r instanceof qr) {
    var n = r.__data__;
    if (!Bs || n.length < ST - 1)
      return n.push([e, t]), this.size = ++r.size, this;
    r = this.__data__ = new Gr(n);
  }
  return r.set(e, t), this.size = r.size, this;
}
function Kt(e) {
  var t = this.__data__ = new qr(e);
  this.size = t.size;
}
Kt.prototype.clear = wT;
Kt.prototype.delete = AT;
Kt.prototype.get = OT;
Kt.prototype.has = ET;
Kt.prototype.set = xT;
function gg(e, t) {
  return e && br(t, _e(t), e);
}
function RT(e, t) {
  return e && br(t, Ke(t), e);
}
var yg = typeof exports == "object" && exports && !exports.nodeType && exports, ad = yg && typeof module == "object" && module && !module.nodeType && module, TT = ad && ad.exports === yg, ud = TT ? Ee.Buffer : void 0, fd = ud ? ud.allocUnsafe : void 0;
function bg(e, t) {
  if (t)
    return e.slice();
  var r = e.length, n = fd ? fd(r) : new e.constructor(r);
  return e.copy(n), n;
}
function _n(e, t) {
  for (var r = -1, n = e == null ? 0 : e.length, i = 0, s = []; ++r < n; ) {
    var o = e[r];
    t(o, r, e) && (s[i++] = o);
  }
  return s;
}
function mu() {
  return [];
}
var PT = Object.prototype, NT = PT.propertyIsEnumerable, cd = Object.getOwnPropertySymbols, Sl = cd ? function(e) {
  return e == null ? [] : (e = Object(e), _n(cd(e), function(t) {
    return NT.call(e, t);
  }));
} : mu;
function $T(e, t) {
  return br(e, Sl(e), t);
}
var MT = Object.getOwnPropertySymbols, mg = MT ? function(e) {
  for (var t = []; e; )
    pn(t, Sl(e)), e = vu(e);
  return t;
} : mu;
function IT(e, t) {
  return br(e, mg(e), t);
}
function wg(e, t, r) {
  var n = t(e);
  return M(e) ? n : pn(n, r(e));
}
function nc(e) {
  return wg(e, _e, Sl);
}
function xl(e) {
  return wg(e, Ke, mg);
}
var ic = Gn(Ee, "DataView"), sc = Gn(Ee, "Promise"), gi = Gn(Ee, "Set"), ld = "[object Map]", DT = "[object Object]", hd = "[object Promise]", pd = "[object Set]", dd = "[object WeakMap]", _d = "[object DataView]", CT = qn(ic), LT = qn(Bs), jT = qn(sc), FT = qn(gi), BT = qn(Cs), En = qe;
(ic && En(new ic(new ArrayBuffer(1))) != _d || Bs && En(new Bs()) != ld || sc && En(sc.resolve()) != hd || gi && En(new gi()) != pd || Cs && En(new Cs()) != dd) && (En = function(e) {
  var t = qe(e), r = t == DT ? e.constructor : void 0, n = r ? qn(r) : "";
  if (n)
    switch (n) {
      case CT:
        return _d;
      case LT:
        return ld;
      case jT:
        return hd;
      case FT:
        return pd;
      case BT:
        return dd;
    }
  return t;
});
const hr = En;
var zT = Object.prototype, UT = zT.hasOwnProperty;
function VT(e) {
  var t = e.length, r = new e.constructor(t);
  return t && typeof e[0] == "string" && UT.call(e, "index") && (r.index = e.index, r.input = e.input), r;
}
var Ra = Ee.Uint8Array;
function Rl(e) {
  var t = new e.constructor(e.byteLength);
  return new Ra(t).set(new Ra(e)), t;
}
function kT(e, t) {
  var r = t ? Rl(e.buffer) : e.buffer;
  return new e.constructor(r, e.byteOffset, e.byteLength);
}
var WT = /\w*$/;
function qT(e) {
  var t = new e.constructor(e.source, WT.exec(e));
  return t.lastIndex = e.lastIndex, t;
}
var vd = Ie ? Ie.prototype : void 0, gd = vd ? vd.valueOf : void 0;
function GT(e) {
  return gd ? Object(gd.call(e)) : {};
}
function Ag(e, t) {
  var r = t ? Rl(e.buffer) : e.buffer;
  return new e.constructor(r, e.byteOffset, e.length);
}
var HT = "[object Boolean]", KT = "[object Date]", YT = "[object Map]", XT = "[object Number]", JT = "[object RegExp]", ZT = "[object Set]", QT = "[object String]", eP = "[object Symbol]", tP = "[object ArrayBuffer]", rP = "[object DataView]", nP = "[object Float32Array]", iP = "[object Float64Array]", sP = "[object Int8Array]", oP = "[object Int16Array]", aP = "[object Int32Array]", uP = "[object Uint8Array]", fP = "[object Uint8ClampedArray]", cP = "[object Uint16Array]", lP = "[object Uint32Array]";
function hP(e, t, r) {
  var n = e.constructor;
  switch (t) {
    case tP:
      return Rl(e);
    case HT:
    case KT:
      return new n(+e);
    case rP:
      return kT(e, r);
    case nP:
    case iP:
    case sP:
    case oP:
    case aP:
    case uP:
    case fP:
    case cP:
    case lP:
      return Ag(e, r);
    case YT:
      return new n();
    case XT:
    case QT:
      return new n(e);
    case JT:
      return qT(e);
    case ZT:
      return new n();
    case eP:
      return GT(e);
  }
}
function Og(e) {
  return typeof e.constructor == "function" && !ho(e) ? Vi(vu(e)) : {};
}
var pP = "[object Map]";
function dP(e) {
  return se(e) && hr(e) == pP;
}
var yd = jt && jt.isMap, Tl = yd ? mt(yd) : dP, _P = "[object Set]";
function vP(e) {
  return se(e) && hr(e) == _P;
}
var bd = jt && jt.isSet, Pl = bd ? mt(bd) : vP, gP = 1, yP = 2, bP = 4, Eg = "[object Arguments]", mP = "[object Array]", wP = "[object Boolean]", AP = "[object Date]", OP = "[object Error]", Sg = "[object Function]", EP = "[object GeneratorFunction]", SP = "[object Map]", xP = "[object Number]", xg = "[object Object]", RP = "[object RegExp]", TP = "[object Set]", PP = "[object String]", NP = "[object Symbol]", $P = "[object WeakMap]", MP = "[object ArrayBuffer]", IP = "[object DataView]", DP = "[object Float32Array]", CP = "[object Float64Array]", LP = "[object Int8Array]", jP = "[object Int16Array]", FP = "[object Int32Array]", BP = "[object Uint8Array]", zP = "[object Uint8ClampedArray]", UP = "[object Uint16Array]", VP = "[object Uint32Array]", X = {};
X[Eg] = X[mP] = X[MP] = X[IP] = X[wP] = X[AP] = X[DP] = X[CP] = X[LP] = X[jP] = X[FP] = X[SP] = X[xP] = X[xg] = X[RP] = X[TP] = X[PP] = X[NP] = X[BP] = X[zP] = X[UP] = X[VP] = !0;
X[OP] = X[Sg] = X[$P] = !1;
function It(e, t, r, n, i, s) {
  var o, a = t & gP, u = t & yP, f = t & bP;
  if (r && (o = i ? r(e, n, i, s) : r(e)), o !== void 0)
    return o;
  if (!ie(e))
    return e;
  var c = M(e);
  if (c) {
    if (o = VT(e), !a)
      return tt(e, o);
  } else {
    var l = hr(e), h = l == Sg || l == EP;
    if (Br(e))
      return bg(e, a);
    if (l == xg || l == Eg || h && !i) {
      if (o = u || h ? {} : Og(e), !a)
        return u ? IT(e, RT(o, e)) : $T(e, gg(o, e));
    } else {
      if (!X[l])
        return i ? e : {};
      o = hP(e, l, a);
    }
  }
  s || (s = new Kt());
  var d = s.get(e);
  if (d)
    return d;
  s.set(e, o), Pl(e) ? e.forEach(function(g) {
    o.add(It(g, t, r, g, e, s));
  }) : Tl(e) && e.forEach(function(g, y) {
    o.set(y, It(g, t, r, y, e, s));
  });
  var _ = f ? u ? xl : nc : u ? Ke : _e, v = c ? void 0 : _(e);
  return zt(v || e, function(g, y) {
    v && (y = g, g = e[y]), co(o, y, It(g, t, r, y, e, s));
  }), o;
}
var kP = 4;
function Rg(e) {
  return It(e, kP);
}
var WP = 1, qP = 4;
function wu(e) {
  return It(e, WP | qP);
}
var GP = 1, HP = 4;
function Tg(e, t) {
  return t = typeof t == "function" ? t : void 0, It(e, GP | HP, t);
}
var KP = 4;
function Pg(e, t) {
  return t = typeof t == "function" ? t : void 0, It(e, KP, t);
}
function oc() {
  return new Lt(this.value(), this.__chain__);
}
function Ng(e) {
  for (var t = -1, r = e == null ? 0 : e.length, n = 0, i = []; ++t < r; ) {
    var s = e[t];
    s && (i[n++] = s);
  }
  return i;
}
function $g() {
  var e = arguments.length;
  if (!e)
    return [];
  for (var t = Array(e - 1), r = arguments[0], n = e; n--; )
    t[n - 1] = arguments[n];
  return pn(M(r) ? tt(r) : [r], Pe(t, 1));
}
var YP = "__lodash_hash_undefined__";
function XP(e) {
  return this.__data__.set(e, YP), this;
}
function JP(e) {
  return this.__data__.has(e);
}
function Mn(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.__data__ = new Gr(); ++t < r; )
    this.add(e[t]);
}
Mn.prototype.add = Mn.prototype.push = XP;
Mn.prototype.has = JP;
function Nl(e, t) {
  for (var r = -1, n = e == null ? 0 : e.length; ++r < n; )
    if (t(e[r], r, e))
      return !0;
  return !1;
}
function zs(e, t) {
  return e.has(t);
}
var ZP = 1, QP = 2;
function Mg(e, t, r, n, i, s) {
  var o = r & ZP, a = e.length, u = t.length;
  if (a != u && !(o && u > a))
    return !1;
  var f = s.get(e), c = s.get(t);
  if (f && c)
    return f == t && c == e;
  var l = -1, h = !0, d = r & QP ? new Mn() : void 0;
  for (s.set(e, t), s.set(t, e); ++l < a; ) {
    var _ = e[l], v = t[l];
    if (n)
      var g = o ? n(v, _, l, t, e, s) : n(_, v, l, e, t, s);
    if (g !== void 0) {
      if (g)
        continue;
      h = !1;
      break;
    }
    if (d) {
      if (!Nl(t, function(y, b) {
        if (!zs(d, b) && (_ === y || i(_, y, r, n, s)))
          return d.push(b);
      })) {
        h = !1;
        break;
      }
    } else if (!(_ === v || i(_, v, r, n, s))) {
      h = !1;
      break;
    }
  }
  return s.delete(e), s.delete(t), h;
}
function $l(e) {
  var t = -1, r = Array(e.size);
  return e.forEach(function(n, i) {
    r[++t] = [i, n];
  }), r;
}
function Au(e) {
  var t = -1, r = Array(e.size);
  return e.forEach(function(n) {
    r[++t] = n;
  }), r;
}
var eN = 1, tN = 2, rN = "[object Boolean]", nN = "[object Date]", iN = "[object Error]", sN = "[object Map]", oN = "[object Number]", aN = "[object RegExp]", uN = "[object Set]", fN = "[object String]", cN = "[object Symbol]", lN = "[object ArrayBuffer]", hN = "[object DataView]", md = Ie ? Ie.prototype : void 0, Ef = md ? md.valueOf : void 0;
function pN(e, t, r, n, i, s, o) {
  switch (r) {
    case hN:
      if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
        return !1;
      e = e.buffer, t = t.buffer;
    case lN:
      return !(e.byteLength != t.byteLength || !s(new Ra(e), new Ra(t)));
    case rN:
    case nN:
    case oN:
      return Ut(+e, +t);
    case iN:
      return e.name == t.name && e.message == t.message;
    case aN:
    case fN:
      return e == t + "";
    case sN:
      var a = $l;
    case uN:
      var u = n & eN;
      if (a || (a = Au), e.size != t.size && !u)
        return !1;
      var f = o.get(e);
      if (f)
        return f == t;
      n |= tN, o.set(e, t);
      var c = Mg(a(e), a(t), n, i, s, o);
      return o.delete(e), c;
    case cN:
      if (Ef)
        return Ef.call(e) == Ef.call(t);
  }
  return !1;
}
var dN = 1, _N = Object.prototype, vN = _N.hasOwnProperty;
function gN(e, t, r, n, i, s) {
  var o = r & dN, a = nc(e), u = a.length, f = nc(t), c = f.length;
  if (u != c && !o)
    return !1;
  for (var l = u; l--; ) {
    var h = a[l];
    if (!(o ? h in t : vN.call(t, h)))
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
    if (n)
      var w = o ? n(b, y, h, t, e, s) : n(y, b, h, e, t, s);
    if (!(w === void 0 ? y === b || i(y, b, r, n, s) : w)) {
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
var yN = 1, wd = "[object Arguments]", Ad = "[object Array]", Zo = "[object Object]", bN = Object.prototype, Od = bN.hasOwnProperty;
function mN(e, t, r, n, i, s) {
  var o = M(e), a = M(t), u = o ? Ad : hr(e), f = a ? Ad : hr(t);
  u = u == wd ? Zo : u, f = f == wd ? Zo : f;
  var c = u == Zo, l = f == Zo, h = u == f;
  if (h && Br(e)) {
    if (!Br(t))
      return !1;
    o = !0, c = !1;
  }
  if (h && !c)
    return s || (s = new Kt()), o || Hn(e) ? Mg(e, t, r, n, i, s) : pN(e, t, u, r, n, i, s);
  if (!(r & yN)) {
    var d = c && Od.call(e, "__wrapped__"), _ = l && Od.call(t, "__wrapped__");
    if (d || _) {
      var v = d ? e.value() : e, g = _ ? t.value() : t;
      return s || (s = new Kt()), i(v, g, r, n, s);
    }
  }
  return h ? (s || (s = new Kt()), gN(e, t, r, n, i, s)) : !1;
}
function vo(e, t, r, n, i) {
  return e === t ? !0 : e == null || t == null || !se(e) && !se(t) ? e !== e && t !== t : mN(e, t, r, n, vo, i);
}
var wN = 1, AN = 2;
function Ml(e, t, r, n) {
  var i = r.length, s = i, o = !n;
  if (e == null)
    return !s;
  for (e = Object(e); i--; ) {
    var a = r[i];
    if (o && a[2] ? a[1] !== e[a[0]] : !(a[0] in e))
      return !1;
  }
  for (; ++i < s; ) {
    a = r[i];
    var u = a[0], f = e[u], c = a[1];
    if (o && a[2]) {
      if (f === void 0 && !(u in e))
        return !1;
    } else {
      var l = new Kt();
      if (n)
        var h = n(f, c, u, e, t, l);
      if (!(h === void 0 ? vo(c, f, wN | AN, n, l) : h))
        return !1;
    }
  }
  return !0;
}
function Ig(e) {
  return e === e && !ie(e);
}
function Il(e) {
  for (var t = _e(e), r = t.length; r--; ) {
    var n = t[r], i = e[n];
    t[r] = [n, i, Ig(i)];
  }
  return t;
}
function Dg(e, t) {
  return function(r) {
    return r == null ? !1 : r[e] === t && (t !== void 0 || e in Object(r));
  };
}
function Cg(e) {
  var t = Il(e);
  return t.length == 1 && t[0][2] ? Dg(t[0][0], t[0][1]) : function(r) {
    return r === e || Ml(r, e, t);
  };
}
function ON(e, t) {
  return e != null && t in Object(e);
}
function Lg(e, t, r) {
  t = hn(t, e);
  for (var n = -1, i = t.length, s = !1; ++n < i; ) {
    var o = mr(t[n]);
    if (!(s = e != null && r(e, o)))
      break;
    e = e[o];
  }
  return s || ++n != i ? s : (i = e == null ? 0 : e.length, !!i && lo(i) && Vr(o, i) && (M(e) || sn(e)));
}
function Ou(e, t) {
  return e != null && Lg(e, t, ON);
}
var EN = 1, SN = 2;
function jg(e, t) {
  return pl(e) && Ig(t) ? Dg(mr(e), t) : function(r) {
    var n = _u(r, e);
    return n === void 0 && n === t ? Ou(r, e) : vo(t, n, EN | SN);
  };
}
function Dl(e) {
  return function(t) {
    return t?.[e];
  };
}
function xN(e) {
  return function(t) {
    return Kn(t, e);
  };
}
function Cl(e) {
  return pl(e) ? Dl(mr(e)) : xN(e);
}
function $(e) {
  return typeof e == "function" ? e : e == null ? Ge : typeof e == "object" ? M(e) ? jg(e[0], e[1]) : Cg(e) : Cl(e);
}
var RN = "Expected a function";
function Fg(e) {
  var t = e == null ? 0 : e.length, r = $;
  return e = t ? ne(e, function(n) {
    if (typeof n[1] != "function")
      throw new TypeError(RN);
    return [r(n[0]), n[1]];
  }) : [], D(function(n) {
    for (var i = -1; ++i < t; ) {
      var s = e[i];
      if (bt(s[0], this, n))
        return bt(s[1], this, n);
    }
  });
}
function Bg(e, t, r) {
  var n = r.length;
  if (e == null)
    return !n;
  for (e = Object(e); n--; ) {
    var i = r[n], s = t[i], o = e[i];
    if (o === void 0 && !(i in e) || !s(o))
      return !1;
  }
  return !0;
}
function TN(e) {
  var t = _e(e);
  return function(r) {
    return Bg(r, e, t);
  };
}
var PN = 1;
function zg(e) {
  return TN(It(e, PN));
}
function Ug(e, t) {
  return t == null || Bg(e, t, _e(t));
}
function NN(e, t, r, n) {
  for (var i = -1, s = e == null ? 0 : e.length; ++i < s; ) {
    var o = e[i];
    t(n, o, r(o), e);
  }
  return n;
}
function Vg(e) {
  return function(t, r, n) {
    for (var i = -1, s = Object(t), o = n(t), a = o.length; a--; ) {
      var u = o[e ? a : ++i];
      if (r(s[u], u, s) === !1)
        break;
    }
    return t;
  };
}
var Ll = Vg();
function wr(e, t) {
  return e && Ll(e, t, _e);
}
function kg(e, t) {
  return function(r, n) {
    if (r == null)
      return r;
    if (!He(r))
      return e(r, n);
    for (var i = r.length, s = t ? i : -1, o = Object(r); (t ? s-- : ++s < i) && n(o[s], s, o) !== !1; )
      ;
    return r;
  };
}
var vn = kg(wr);
function $N(e, t, r, n) {
  return vn(e, function(i, s, o) {
    t(n, i, r(i), o);
  }), n;
}
function Eu(e, t) {
  return function(r, n) {
    var i = M(r) ? NN : $N, s = t ? t() : {};
    return i(r, e, $(n), s);
  };
}
var MN = Object.prototype, IN = MN.hasOwnProperty, Wg = Eu(function(e, t, r) {
  IN.call(e, r) ? ++e[r] : Wr(e, r, 1);
});
function qg(e, t) {
  var r = Vi(e);
  return t == null ? r : gg(r, t);
}
var DN = 8;
function Su(e, t, r) {
  t = r ? void 0 : t;
  var n = kr(e, DN, void 0, void 0, void 0, void 0, void 0, t);
  return n.placeholder = Su.placeholder, n;
}
Su.placeholder = {};
var CN = 16;
function xu(e, t, r) {
  t = r ? void 0 : t;
  var n = kr(e, CN, void 0, void 0, void 0, void 0, void 0, t);
  return n.placeholder = xu.placeholder, n;
}
xu.placeholder = {};
var As = function() {
  return Ee.Date.now();
}, LN = "Expected a function", jN = Math.max, FN = Math.min;
function jl(e, t, r) {
  var n, i, s, o, a, u, f = 0, c = !1, l = !1, h = !0;
  if (typeof e != "function")
    throw new TypeError(LN);
  t = pt(t) || 0, ie(r) && (c = !!r.leading, l = "maxWait" in r, s = l ? jN(pt(r.maxWait) || 0, t) : s, h = "trailing" in r ? !!r.trailing : h);
  function d(S) {
    var T = n, F = i;
    return n = i = void 0, f = S, o = e.apply(F, T), o;
  }
  function _(S) {
    return f = S, a = setTimeout(y, t), c ? d(S) : o;
  }
  function v(S) {
    var T = S - u, F = S - f, Rr = t - T;
    return l ? FN(Rr, s - F) : Rr;
  }
  function g(S) {
    var T = S - u, F = S - f;
    return u === void 0 || T >= t || T < 0 || l && F >= s;
  }
  function y() {
    var S = As();
    if (g(S))
      return b(S);
    a = setTimeout(y, v(S));
  }
  function b(S) {
    return a = void 0, h && n ? d(S) : (n = i = void 0, o);
  }
  function w() {
    a !== void 0 && clearTimeout(a), f = 0, n = u = i = a = void 0;
  }
  function m() {
    return a === void 0 ? o : b(As());
  }
  function A() {
    var S = As(), T = g(S);
    if (n = arguments, i = this, u = S, T) {
      if (a === void 0)
        return _(u);
      if (l)
        return clearTimeout(a), a = setTimeout(y, t), d(u);
    }
    return a === void 0 && (a = setTimeout(y, t)), o;
  }
  return A.cancel = w, A.flush = m, A;
}
function Gg(e, t) {
  return e == null || e !== e ? t : e;
}
var Hg = Object.prototype, BN = Hg.hasOwnProperty, Kg = D(function(e, t) {
  e = Object(e);
  var r = -1, n = t.length, i = n > 2 ? t[2] : void 0;
  for (i && ke(t[0], t[1], i) && (n = 1); ++r < n; )
    for (var s = t[r], o = Ke(s), a = -1, u = o.length; ++a < u; ) {
      var f = o[a], c = e[f];
      (c === void 0 || Ut(c, Hg[f]) && !BN.call(e, f)) && (e[f] = s[f]);
    }
  return e;
});
function ac(e, t, r) {
  (r !== void 0 && !Ut(e[t], r) || r === void 0 && !(t in e)) && Wr(e, t, r);
}
function ue(e) {
  return se(e) && He(e);
}
function uc(e, t) {
  if (!(t === "constructor" && typeof e[t] == "function") && t != "__proto__")
    return e[t];
}
function Fl(e) {
  return br(e, Ke(e));
}
function zN(e, t, r, n, i, s, o) {
  var a = uc(e, r), u = uc(t, r), f = o.get(u);
  if (f) {
    ac(e, r, f);
    return;
  }
  var c = s ? s(a, u, r + "", e, t, o) : void 0, l = c === void 0;
  if (l) {
    var h = M(u), d = !h && Br(u), _ = !h && !d && Hn(u);
    c = u, h || d || _ ? M(a) ? c = a : ue(a) ? c = tt(a) : d ? (l = !1, c = bg(u, !0)) : _ ? (l = !1, c = Ag(u, !0)) : c = [] : Gi(u) || sn(u) ? (c = a, sn(a) ? c = Fl(a) : (!ie(a) || yr(a)) && (c = Og(u))) : l = !1;
  }
  l && (o.set(u, c), i(c, u, n, s, o), o.delete(u)), ac(e, r, c);
}
function Ru(e, t, r, n, i) {
  e !== t && Ll(t, function(s, o) {
    if (i || (i = new Kt()), ie(s))
      zN(e, t, o, r, Ru, n, i);
    else {
      var a = n ? n(uc(e, o), s, o + "", e, t, i) : void 0;
      a === void 0 && (a = s), ac(e, o, a);
    }
  }, Ke);
}
function Yg(e, t, r, n, i, s) {
  return ie(e) && ie(t) && (s.set(t, e), Ru(e, t, void 0, Yg, s), s.delete(t)), e;
}
var Bl = qi(function(e, t, r, n) {
  Ru(e, t, r, n);
}), Xg = D(function(e) {
  return e.push(void 0, Yg), bt(Bl, void 0, e);
}), UN = "Expected a function";
function Jg(e, t, r) {
  if (typeof e != "function")
    throw new TypeError(UN);
  return setTimeout(function() {
    e.apply(void 0, r);
  }, t);
}
var Zg = D(function(e, t) {
  return Jg(e, 1, t);
}), Qg = D(function(e, t, r) {
  return Jg(e, pt(t) || 0, r);
});
function zl(e, t, r) {
  for (var n = -1, i = e == null ? 0 : e.length; ++n < i; )
    if (r(t, e[n]))
      return !0;
  return !1;
}
var VN = 200;
function go(e, t, r, n) {
  var i = -1, s = cu, o = !0, a = e.length, u = [], f = t.length;
  if (!a)
    return u;
  r && (t = ne(t, mt(r))), n ? (s = zl, o = !1) : t.length >= VN && (s = zs, o = !1, t = new Mn(t));
  e:
    for (; ++i < a; ) {
      var c = e[i], l = r == null ? c : r(c);
      if (c = n || c !== 0 ? c : 0, o && l === l) {
        for (var h = f; h--; )
          if (t[h] === l)
            continue e;
        u.push(c);
      } else s(t, l, n) || u.push(c);
    }
  return u;
}
var e0 = D(function(e, t) {
  return ue(e) ? go(e, Pe(t, 1, ue, !0)) : [];
});
function wt(e) {
  var t = e == null ? 0 : e.length;
  return t ? e[t - 1] : void 0;
}
var t0 = D(function(e, t) {
  var r = wt(t);
  return ue(r) && (r = void 0), ue(e) ? go(e, Pe(t, 1, ue, !0), $(r)) : [];
}), r0 = D(function(e, t) {
  var r = wt(t);
  return ue(r) && (r = void 0), ue(e) ? go(e, Pe(t, 1, ue, !0), void 0, r) : [];
}), n0 = su(function(e, t) {
  return e / t;
}, 1);
function i0(e, t, r) {
  var n = e == null ? 0 : e.length;
  return n ? (t = r || t === void 0 ? 1 : I(t), Ft(e, t < 0 ? 0 : t, n)) : [];
}
function s0(e, t, r) {
  var n = e == null ? 0 : e.length;
  return n ? (t = r || t === void 0 ? 1 : I(t), t = n - t, Ft(e, 0, t < 0 ? 0 : t)) : [];
}
function Tu(e, t, r, n) {
  for (var i = e.length, s = n ? i : -1; (n ? s-- : ++s < i) && t(e[s], s, e); )
    ;
  return r ? Ft(e, n ? 0 : s, n ? s + 1 : i) : Ft(e, n ? s + 1 : 0, n ? i : s);
}
function o0(e, t) {
  return e && e.length ? Tu(e, $(t), !0, !0) : [];
}
function a0(e, t) {
  return e && e.length ? Tu(e, $(t), !0) : [];
}
function Ar(e) {
  return typeof e == "function" ? e : Ge;
}
function fc(e, t) {
  var r = M(e) ? zt : vn;
  return r(e, Ar(t));
}
function kN(e, t) {
  for (var r = e == null ? 0 : e.length; r-- && t(e[r], r, e) !== !1; )
    ;
  return e;
}
var u0 = Vg(!0);
function Ul(e, t) {
  return e && u0(e, t, _e);
}
var f0 = kg(Ul, !0);
function cc(e, t) {
  var r = M(e) ? kN : f0;
  return r(e, Ar(t));
}
function c0(e, t, r) {
  e = k(e), t = yt(t);
  var n = e.length;
  r = r === void 0 ? n : Yn(I(r), 0, n);
  var i = r;
  return r -= t.length, r >= 0 && e.slice(r, i) == t;
}
function WN(e, t) {
  return ne(t, function(r) {
    return [r, e[r]];
  });
}
function qN(e) {
  var t = -1, r = Array(e.size);
  return e.forEach(function(n) {
    r[++t] = [n, n];
  }), r;
}
var GN = "[object Map]", HN = "[object Set]";
function l0(e) {
  return function(t) {
    var r = hr(t);
    return r == GN ? $l(t) : r == HN ? qN(t) : WN(t, e(t));
  };
}
var lc = l0(_e), hc = l0(Ke), KN = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, YN = ml(KN), h0 = /[&<>"']/g, XN = RegExp(h0.source);
function Vl(e) {
  return e = k(e), e && XN.test(e) ? e.replace(h0, YN) : e;
}
var p0 = /[\\^$.*+?()[\]{}|]/g, JN = RegExp(p0.source);
function d0(e) {
  return e = k(e), e && JN.test(e) ? e.replace(p0, "\\$&") : e;
}
function _0(e, t) {
  for (var r = -1, n = e == null ? 0 : e.length; ++r < n; )
    if (!t(e[r], r, e))
      return !1;
  return !0;
}
function ZN(e, t) {
  var r = !0;
  return vn(e, function(n, i, s) {
    return r = !!t(n, i, s), r;
  }), r;
}
function v0(e, t, r) {
  var n = M(e) ? _0 : ZN;
  return r && ke(e, t, r) && (t = void 0), n(e, $(t));
}
var QN = 4294967295;
function kl(e) {
  return e ? Yn(I(e), 0, QN) : 0;
}
function e$(e, t, r, n) {
  var i = e.length;
  for (r = I(r), r < 0 && (r = -r > i ? 0 : i + r), n = n === void 0 || n > i ? i : I(n), n < 0 && (n += i), n = r > n ? 0 : kl(n); r < n; )
    e[r++] = t;
  return e;
}
function g0(e, t, r, n) {
  var i = e == null ? 0 : e.length;
  return i ? (r && typeof r != "number" && ke(e, t, r) && (r = 0, n = i), e$(e, t, r, n)) : [];
}
function y0(e, t) {
  var r = [];
  return vn(e, function(n, i, s) {
    t(n, i, s) && r.push(n);
  }), r;
}
function b0(e, t) {
  var r = M(e) ? _n : y0;
  return r(e, $(t));
}
function m0(e) {
  return function(t, r, n) {
    var i = Object(t);
    if (!He(t)) {
      var s = $(r);
      t = _e(t), r = function(a) {
        return s(i[a], a, i);
      };
    }
    var o = e(t, r, n);
    return o > -1 ? i[s ? t[o] : o] : void 0;
  };
}
var t$ = Math.max;
function Wl(e, t, r) {
  var n = e == null ? 0 : e.length;
  if (!n)
    return -1;
  var i = r == null ? 0 : I(r);
  return i < 0 && (i = t$(n + i, 0)), fu(e, $(t), i);
}
var w0 = m0(Wl);
function A0(e, t, r) {
  var n;
  return r(e, function(i, s, o) {
    if (t(i, s, o))
      return n = s, !1;
  }), n;
}
function O0(e, t) {
  return A0(e, $(t), wr);
}
var r$ = Math.max, n$ = Math.min;
function ql(e, t, r) {
  var n = e == null ? 0 : e.length;
  if (!n)
    return -1;
  var i = n - 1;
  return r !== void 0 && (i = I(r), i = r < 0 ? r$(n + i, 0) : n$(i, n - 1)), fu(e, $(t), i, !0);
}
var E0 = m0(ql);
function S0(e, t) {
  return A0(e, $(t), Ul);
}
function pc(e) {
  return e && e.length ? e[0] : void 0;
}
function x0(e, t) {
  var r = -1, n = He(e) ? Array(e.length) : [];
  return vn(e, function(i, s, o) {
    n[++r] = t(i, s, o);
  }), n;
}
function yo(e, t) {
  var r = M(e) ? ne : x0;
  return r(e, $(t));
}
function R0(e, t) {
  return Pe(yo(e, t), 1);
}
var i$ = 1 / 0;
function T0(e, t) {
  return Pe(yo(e, t), i$);
}
function P0(e, t, r) {
  return r = r === void 0 ? 1 : I(r), Pe(yo(e, t), r);
}
var s$ = 1 / 0;
function N0(e) {
  var t = e == null ? 0 : e.length;
  return t ? Pe(e, s$) : [];
}
function $0(e, t) {
  var r = e == null ? 0 : e.length;
  return r ? (t = t === void 0 ? 1 : I(t), Pe(e, t)) : [];
}
var o$ = 512;
function M0(e) {
  return kr(e, o$);
}
var I0 = Ol("floor"), a$ = "Expected a function", u$ = 8, f$ = 32, c$ = 128, l$ = 256;
function D0(e) {
  return Hr(function(t) {
    var r = t.length, n = r, i = Lt.prototype.thru;
    for (e && t.reverse(); n--; ) {
      var s = t[n];
      if (typeof s != "function")
        throw new TypeError(a$);
      if (i && !o && ga(s) == "wrapper")
        var o = new Lt([], !0);
    }
    for (n = o ? n : r; ++n < r; ) {
      s = t[n];
      var a = ga(s), u = a == "wrapper" ? ul(s) : void 0;
      u && Qf(u[0]) && u[1] == (c$ | u$ | f$ | l$) && !u[4].length && u[9] == 1 ? o = o[ga(u[0])].apply(o, u[3]) : o = s.length == 1 && Qf(s) ? o[a]() : o.thru(s);
    }
    return function() {
      var f = arguments, c = f[0];
      if (o && f.length == 1 && M(c))
        return o.plant(c).value();
      for (var l = 0, h = r ? t[l].apply(this, f) : c; ++l < r; )
        h = t[l].call(this, h);
      return h;
    };
  });
}
var C0 = D0(), L0 = D0(!0);
function j0(e, t) {
  return e == null ? e : Ll(e, Ar(t), Ke);
}
function F0(e, t) {
  return e == null ? e : u0(e, Ar(t), Ke);
}
function B0(e, t) {
  return e && wr(e, Ar(t));
}
function z0(e, t) {
  return e && Ul(e, Ar(t));
}
function U0(e) {
  for (var t = -1, r = e == null ? 0 : e.length, n = {}; ++t < r; ) {
    var i = e[t];
    n[i[0]] = i[1];
  }
  return n;
}
function Pu(e, t) {
  return _n(t, function(r) {
    return yr(e[r]);
  });
}
function V0(e) {
  return e == null ? [] : Pu(e, _e(e));
}
function k0(e) {
  return e == null ? [] : Pu(e, Ke(e));
}
var h$ = Object.prototype, p$ = h$.hasOwnProperty, W0 = Eu(function(e, t, r) {
  p$.call(e, r) ? e[r].push(t) : Wr(e, r, [t]);
});
function Gl(e, t) {
  return e > t;
}
function Nu(e) {
  return function(t, r) {
    return typeof t == "string" && typeof r == "string" || (t = pt(t), r = pt(r)), e(t, r);
  };
}
var q0 = Nu(Gl), G0 = Nu(function(e, t) {
  return e >= t;
}), d$ = Object.prototype, _$ = d$.hasOwnProperty;
function v$(e, t) {
  return e != null && _$.call(e, t);
}
function H0(e, t) {
  return e != null && Lg(e, t, v$);
}
var g$ = Math.max, y$ = Math.min;
function b$(e, t, r) {
  return e >= y$(t, r) && e < g$(t, r);
}
function K0(e, t, r) {
  return t = cr(t), r === void 0 ? (r = t, t = 0) : r = cr(r), e = pt(e), b$(e, t, r);
}
var m$ = "[object String]";
function bo(e) {
  return typeof e == "string" || !M(e) && se(e) && qe(e) == m$;
}
function Hl(e, t) {
  return ne(t, function(r) {
    return e[r];
  });
}
function Xn(e) {
  return e == null ? [] : Hl(e, _e(e));
}
var w$ = Math.max;
function Y0(e, t, r, n) {
  e = He(e) ? e : Xn(e), r = r && !n ? I(r) : 0;
  var i = e.length;
  return r < 0 && (r = w$(i + r, 0)), bo(e) ? r <= i && e.indexOf(t, r) > -1 : !!i && ki(e, t, r) > -1;
}
var A$ = Math.max;
function X0(e, t, r) {
  var n = e == null ? 0 : e.length;
  if (!n)
    return -1;
  var i = r == null ? 0 : I(r);
  return i < 0 && (i = A$(n + i, 0)), ki(e, t, i);
}
function J0(e) {
  var t = e == null ? 0 : e.length;
  return t ? Ft(e, 0, -1) : [];
}
var O$ = Math.min;
function Kl(e, t, r) {
  for (var n = r ? zl : cu, i = e[0].length, s = e.length, o = s, a = Array(s), u = 1 / 0, f = []; o--; ) {
    var c = e[o];
    o && t && (c = ne(c, mt(t))), u = O$(c.length, u), a[o] = !r && (t || i >= 120 && c.length >= 120) ? new Mn(o && c) : void 0;
  }
  c = e[0];
  var l = -1, h = a[0];
  e:
    for (; ++l < i && f.length < u; ) {
      var d = c[l], _ = t ? t(d) : d;
      if (d = r || d !== 0 ? d : 0, !(h ? zs(h, _) : n(f, _, r))) {
        for (o = s; --o; ) {
          var v = a[o];
          if (!(v ? zs(v, _) : n(e[o], _, r)))
            continue e;
        }
        h && h.push(_), f.push(d);
      }
    }
  return f;
}
function Yl(e) {
  return ue(e) ? e : [];
}
var Z0 = D(function(e) {
  var t = ne(e, Yl);
  return t.length && t[0] === e[0] ? Kl(t) : [];
}), Q0 = D(function(e) {
  var t = wt(e), r = ne(e, Yl);
  return t === wt(r) ? t = void 0 : r.pop(), r.length && r[0] === e[0] ? Kl(r, $(t)) : [];
}), ey = D(function(e) {
  var t = wt(e), r = ne(e, Yl);
  return t = typeof t == "function" ? t : void 0, t && r.pop(), r.length && r[0] === e[0] ? Kl(r, void 0, t) : [];
});
function E$(e, t, r, n) {
  return wr(e, function(i, s, o) {
    t(n, r(i), s, o);
  }), n;
}
function ty(e, t) {
  return function(r, n) {
    return E$(r, e, t(n), {});
  };
}
var S$ = Object.prototype, x$ = S$.toString, ry = ty(function(e, t, r) {
  t != null && typeof t.toString != "function" && (t = x$.call(t)), e[t] = r;
}, uu(Ge)), ny = Object.prototype, R$ = ny.hasOwnProperty, T$ = ny.toString, iy = ty(function(e, t, r) {
  t != null && typeof t.toString != "function" && (t = T$.call(t)), R$.call(e, t) ? e[t].push(r) : e[t] = [r];
}, $);
function sy(e, t) {
  return t.length < 2 ? e : Kn(e, Ft(t, 0, -1));
}
function mo(e, t, r) {
  t = hn(t, e), e = sy(e, t);
  var n = e == null ? e : e[mr(wt(t))];
  return n == null ? void 0 : bt(n, e, r);
}
var oy = D(mo), ay = D(function(e, t, r) {
  var n = -1, i = typeof t == "function", s = He(e) ? Array(e.length) : [];
  return vn(e, function(o) {
    s[++n] = i ? bt(t, o, r) : mo(o, t, r);
  }), s;
}), P$ = "[object ArrayBuffer]";
function N$(e) {
  return se(e) && qe(e) == P$;
}
var Ed = jt && jt.isArrayBuffer, uy = Ed ? mt(Ed) : N$, $$ = "[object Boolean]";
function fy(e) {
  return e === !0 || e === !1 || se(e) && qe(e) == $$;
}
var M$ = "[object Date]";
function I$(e) {
  return se(e) && qe(e) == M$;
}
var Sd = jt && jt.isDate, cy = Sd ? mt(Sd) : I$;
function ly(e) {
  return se(e) && e.nodeType === 1 && !Gi(e);
}
var D$ = "[object Map]", C$ = "[object Set]", L$ = Object.prototype, j$ = L$.hasOwnProperty;
function hy(e) {
  if (e == null)
    return !0;
  if (He(e) && (M(e) || typeof e == "string" || typeof e.splice == "function" || Br(e) || Hn(e) || sn(e)))
    return !e.length;
  var t = hr(e);
  if (t == D$ || t == C$)
    return !e.size;
  if (ho(e))
    return !hl(e).length;
  for (var r in e)
    if (j$.call(e, r))
      return !1;
  return !0;
}
function yi(e, t) {
  return vo(e, t);
}
function py(e, t, r) {
  r = typeof r == "function" ? r : void 0;
  var n = r ? r(e, t) : void 0;
  return n === void 0 ? vo(e, t, void 0, r) : !!n;
}
var F$ = Ee.isFinite;
function dy(e) {
  return typeof e == "number" && F$(e);
}
function Xl(e) {
  return typeof e == "number" && e == I(e);
}
function _y(e, t) {
  return e === t || Ml(e, t, Il(t));
}
function vy(e, t, r) {
  return r = typeof r == "function" ? r : void 0, Ml(e, t, Il(t), r);
}
var B$ = "[object Number]";
function Jl(e) {
  return typeof e == "number" || se(e) && qe(e) == B$;
}
function gy(e) {
  return Jl(e) && e != +e;
}
var z$ = va ? yr : hu, U$ = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.";
function yy(e) {
  if (z$(e))
    throw new Error(U$);
  return Ev(e);
}
function by(e) {
  return e == null;
}
function my(e) {
  return e === null;
}
var V$ = "[object RegExp]";
function k$(e) {
  return se(e) && qe(e) == V$;
}
var xd = jt && jt.isRegExp, $u = xd ? mt(xd) : k$, Rd = 9007199254740991;
function wy(e) {
  return Xl(e) && e >= -Rd && e <= Rd;
}
function Ay(e) {
  return e === void 0;
}
var W$ = "[object WeakMap]";
function Oy(e) {
  return se(e) && hr(e) == W$;
}
var q$ = "[object WeakSet]";
function Ey(e) {
  return se(e) && qe(e) == q$;
}
var G$ = 1;
function Sy(e) {
  return $(typeof e == "function" ? e : It(e, G$));
}
var H$ = Array.prototype, K$ = H$.join;
function xy(e, t) {
  return e == null ? "" : K$.call(e, t);
}
var Ry = Ki(function(e, t, r) {
  return e + (r ? "-" : "") + t.toLowerCase();
}), Ty = Eu(function(e, t, r) {
  Wr(e, r, t);
});
function Y$(e, t, r) {
  for (var n = r + 1; n--; )
    if (e[n] === t)
      return n;
  return n;
}
var X$ = Math.max, J$ = Math.min;
function Py(e, t, r) {
  var n = e == null ? 0 : e.length;
  if (!n)
    return -1;
  var i = n;
  return r !== void 0 && (i = I(r), i = i < 0 ? X$(n + i, 0) : J$(i, n - 1)), t === t ? Y$(e, t, i) : fu(e, $v, i, !0);
}
var Ny = Ki(function(e, t, r) {
  return e + (r ? " " : "") + t.toLowerCase();
}), $y = Zv("toLowerCase");
function Zl(e, t) {
  return e < t;
}
var My = Nu(Zl), Iy = Nu(function(e, t) {
  return e <= t;
});
function Dy(e, t) {
  var r = {};
  return t = $(t), wr(e, function(n, i, s) {
    Wr(r, t(n, i, s), n);
  }), r;
}
function Cy(e, t) {
  var r = {};
  return t = $(t), wr(e, function(n, i, s) {
    Wr(r, i, t(n, i, s));
  }), r;
}
var Z$ = 1;
function Ly(e) {
  return Cg(It(e, Z$));
}
var Q$ = 1;
function jy(e, t) {
  return jg(e, It(t, Q$));
}
function Mu(e, t, r) {
  for (var n = -1, i = e.length; ++n < i; ) {
    var s = e[n], o = t(s);
    if (o != null && (a === void 0 ? o === o && !nt(o) : r(o, a)))
      var a = o, u = s;
  }
  return u;
}
function Fy(e) {
  return e && e.length ? Mu(e, Ge, Gl) : void 0;
}
function By(e, t) {
  return e && e.length ? Mu(e, $(t), Gl) : void 0;
}
function Ql(e, t) {
  for (var r, n = -1, i = e.length; ++n < i; ) {
    var s = t(e[n]);
    s !== void 0 && (r = r === void 0 ? s : r + s);
  }
  return r;
}
var eM = NaN;
function zy(e, t) {
  var r = e == null ? 0 : e.length;
  return r ? Ql(e, t) / r : eM;
}
function Uy(e) {
  return zy(e, Ge);
}
function Vy(e, t) {
  return zy(e, $(t));
}
var ky = qi(function(e, t, r) {
  Ru(e, t, r);
}), Wy = D(function(e, t) {
  return function(r) {
    return mo(r, e, t);
  };
}), qy = D(function(e, t) {
  return function(r) {
    return mo(e, r, t);
  };
});
function Gy(e) {
  return e && e.length ? Mu(e, Ge, Zl) : void 0;
}
function Hy(e, t) {
  return e && e.length ? Mu(e, $(t), Zl) : void 0;
}
function Ky(e, t, r) {
  var n = _e(t), i = Pu(t, n), s = !(ie(r) && "chain" in r) || !!r.chain, o = yr(e);
  return zt(i, function(a) {
    var u = t[a];
    e[a] = u, o && (e.prototype[a] = function() {
      var f = this.__chain__;
      if (s || f) {
        var c = e(this.__wrapped__), l = c.__actions__ = tt(this.__actions__);
        return l.push({ func: u, args: arguments, thisArg: e }), c.__chain__ = f, c;
      }
      return u.apply(e, pn([this.value()], arguments));
    });
  }), e;
}
var Yy = su(function(e, t) {
  return e * t;
}, 1), tM = "Expected a function";
function wo(e) {
  if (typeof e != "function")
    throw new TypeError(tM);
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
function rM(e) {
  for (var t, r = []; !(t = e.next()).done; )
    r.push(t.value);
  return r;
}
var nM = "[object Map]", iM = "[object Set]", Sf = Ie ? Ie.iterator : void 0;
function eh(e) {
  if (!e)
    return [];
  if (He(e))
    return bo(e) ? Qt(e) : tt(e);
  if (Sf && e[Sf])
    return rM(e[Sf]());
  var t = hr(e), r = t == nM ? $l : t == iM ? Au : Xn;
  return r(e);
}
function dc() {
  this.__values__ === void 0 && (this.__values__ = eh(this.value()));
  var e = this.__index__ >= this.__values__.length, t = e ? void 0 : this.__values__[this.__index__++];
  return { done: e, value: t };
}
function Xy(e, t) {
  var r = e.length;
  if (r)
    return t += t < 0 ? r : 0, Vr(t, r) ? e[t] : void 0;
}
function Jy(e, t) {
  return e && e.length ? Xy(e, I(t)) : void 0;
}
function Zy(e) {
  return e = I(e), D(function(t) {
    return Xy(t, e);
  });
}
function th(e, t) {
  return t = hn(t, e), e = sy(e, t), e == null || delete e[mr(wt(t))];
}
function sM(e) {
  return Gi(e) ? void 0 : e;
}
var oM = 1, aM = 2, uM = 4, Qy = Hr(function(e, t) {
  var r = {};
  if (e == null)
    return r;
  var n = !1;
  t = ne(t, function(s) {
    return s = hn(s, e), n || (n = s.length > 1), s;
  }), br(e, xl(e), r), n && (r = It(r, oM | aM | uM, sM));
  for (var i = t.length; i--; )
    th(r, t[i]);
  return r;
});
function Ao(e, t, r, n) {
  if (!ie(e))
    return e;
  t = hn(t, e);
  for (var i = -1, s = t.length, o = s - 1, a = e; a != null && ++i < s; ) {
    var u = mr(t[i]), f = r;
    if (u === "__proto__" || u === "constructor" || u === "prototype")
      return e;
    if (i != o) {
      var c = a[u];
      f = n ? n(c, u, a) : void 0, f === void 0 && (f = ie(c) ? c : Vr(t[i + 1]) ? [] : {});
    }
    co(a, u, f), a = a[u];
  }
  return e;
}
function eb(e, t, r) {
  for (var n = -1, i = t.length, s = {}; ++n < i; ) {
    var o = t[n], a = Kn(e, o);
    r(a, o) && Ao(s, hn(o, e), a);
  }
  return s;
}
function rh(e, t) {
  if (e == null)
    return {};
  var r = ne(xl(e), function(n) {
    return [n];
  });
  return t = $(t), eb(e, r, function(n, i) {
    return t(n, i[0]);
  });
}
function tb(e, t) {
  return rh(e, wo($(t)));
}
function rb(e) {
  return gl(2, e);
}
function fM(e, t) {
  var r = e.length;
  for (e.sort(t); r--; )
    e[r] = e[r].value;
  return e;
}
function nb(e, t) {
  if (e !== t) {
    var r = e !== void 0, n = e === null, i = e === e, s = nt(e), o = t !== void 0, a = t === null, u = t === t, f = nt(t);
    if (!a && !f && !s && e > t || s && o && u && !a && !f || n && o && u || !r && u || !i)
      return 1;
    if (!n && !s && !f && e < t || f && r && i && !n && !s || a && r && i || !o && i || !u)
      return -1;
  }
  return 0;
}
function cM(e, t, r) {
  for (var n = -1, i = e.criteria, s = t.criteria, o = i.length, a = r.length; ++n < o; ) {
    var u = nb(i[n], s[n]);
    if (u) {
      if (n >= a)
        return u;
      var f = r[n];
      return u * (f == "desc" ? -1 : 1);
    }
  }
  return e.index - t.index;
}
function ib(e, t, r) {
  t.length ? t = ne(t, function(s) {
    return M(s) ? function(o) {
      return Kn(o, s.length === 1 ? s[0] : s);
    } : s;
  }) : t = [Ge];
  var n = -1;
  t = ne(t, mt($));
  var i = x0(e, function(s, o, a) {
    var u = ne(t, function(f) {
      return f(s);
    });
    return { criteria: u, index: ++n, value: s };
  });
  return fM(i, function(s, o) {
    return cM(s, o, r);
  });
}
function sb(e, t, r, n) {
  return e == null ? [] : (M(t) || (t = t == null ? [] : [t]), r = n ? void 0 : r, M(r) || (r = r == null ? [] : [r]), ib(e, t, r));
}
function nh(e) {
  return Hr(function(t) {
    return t = ne(t, mt($)), D(function(r) {
      var n = this;
      return e(t, function(i) {
        return bt(i, n, r);
      });
    });
  });
}
var ob = nh(ne), lM = D, hM = Math.min, ab = lM(function(e, t) {
  t = t.length == 1 && M(t[0]) ? ne(t[0], mt($)) : ne(Pe(t, 1), mt($));
  var r = t.length;
  return D(function(n) {
    for (var i = -1, s = hM(n.length, r); ++i < s; )
      n[i] = t[i].call(this, n[i]);
    return bt(e, this, n);
  });
}), ub = nh(_0), fb = nh(Nl), pM = 9007199254740991, dM = Math.floor;
function _c(e, t) {
  var r = "";
  if (!e || t < 1 || t > pM)
    return r;
  do
    t % 2 && (r += e), t = dM(t / 2), t && (e += e);
  while (t);
  return r;
}
var _M = Dl("length"), cb = "\\ud800-\\udfff", vM = "\\u0300-\\u036f", gM = "\\ufe20-\\ufe2f", yM = "\\u20d0-\\u20ff", bM = vM + gM + yM, mM = "\\ufe0e\\ufe0f", wM = "[" + cb + "]", vc = "[" + bM + "]", gc = "\\ud83c[\\udffb-\\udfff]", AM = "(?:" + vc + "|" + gc + ")", lb = "[^" + cb + "]", hb = "(?:\\ud83c[\\udde6-\\uddff]){2}", pb = "[\\ud800-\\udbff][\\udc00-\\udfff]", OM = "\\u200d", db = AM + "?", _b = "[" + mM + "]?", EM = "(?:" + OM + "(?:" + [lb, hb, pb].join("|") + ")" + _b + db + ")*", SM = _b + db + EM, xM = "(?:" + [lb + vc + "?", vc, hb, pb, wM].join("|") + ")", Td = RegExp(gc + "(?=" + gc + ")|" + xM + SM, "g");
function RM(e) {
  for (var t = Td.lastIndex = 0; Td.test(e); )
    ++t;
  return t;
}
function Yi(e) {
  return Hi(e) ? RM(e) : _M(e);
}
var TM = Math.ceil;
function Ta(e, t) {
  t = t === void 0 ? " " : yt(t);
  var r = t.length;
  if (r < 2)
    return r ? _c(t, e) : t;
  var n = _c(t, TM(e / Yi(t)));
  return Hi(t) ? dn(Qt(n), 0, e).join("") : n.slice(0, e);
}
var PM = Math.ceil, NM = Math.floor;
function vb(e, t, r) {
  e = k(e), t = I(t);
  var n = t ? Yi(e) : 0;
  if (!t || n >= t)
    return e;
  var i = (t - n) / 2;
  return Ta(NM(i), r) + e + Ta(PM(i), r);
}
function gb(e, t, r) {
  e = k(e), t = I(t);
  var n = t ? Yi(e) : 0;
  return t && n < t ? e + Ta(t - n, r) : e;
}
function yb(e, t, r) {
  e = k(e), t = I(t);
  var n = t ? Yi(e) : 0;
  return t && n < t ? Ta(t - n, r) + e : e;
}
var $M = /^\s+/, MM = Ee.parseInt;
function bb(e, t, r) {
  return r || t == null ? t = 0 : t && (t = +t), MM(k(e).replace($M, ""), t || 0);
}
var IM = 32, Oo = D(function(e, t) {
  var r = nn(t, Wi(Oo));
  return kr(e, IM, void 0, t, r);
});
Oo.placeholder = {};
var DM = 64, Iu = D(function(e, t) {
  var r = nn(t, Wi(Iu));
  return kr(e, DM, void 0, t, r);
});
Iu.placeholder = {};
var mb = Eu(function(e, t, r) {
  e[r ? 0 : 1].push(t);
}, function() {
  return [[], []];
});
function CM(e, t) {
  return eb(e, t, function(r, n) {
    return Ou(e, n);
  });
}
var wb = Hr(function(e, t) {
  return e == null ? {} : CM(e, t);
});
function yc(e) {
  for (var t, r = this; r instanceof ou; ) {
    var n = Tv(r);
    n.__index__ = 0, n.__values__ = void 0, t ? i.__wrapped__ = n : t = n;
    var i = n;
    r = r.__wrapped__;
  }
  return i.__wrapped__ = e, t;
}
function Ab(e) {
  return function(t) {
    return e == null ? void 0 : Kn(e, t);
  };
}
function LM(e, t, r, n) {
  for (var i = r - 1, s = e.length; ++i < s; )
    if (n(e[i], t))
      return i;
  return -1;
}
var jM = Array.prototype, Pd = jM.splice;
function ih(e, t, r, n) {
  var i = n ? LM : ki, s = -1, o = t.length, a = e;
  for (e === t && (t = tt(t)), r && (a = ne(e, mt(r))); ++s < o; )
    for (var u = 0, f = t[s], c = r ? r(f) : f; (u = i(a, c, u, n)) > -1; )
      a !== e && Pd.call(a, u, 1), Pd.call(e, u, 1);
  return e;
}
function sh(e, t) {
  return e && e.length && t && t.length ? ih(e, t) : e;
}
var Ob = D(sh);
function Eb(e, t, r) {
  return e && e.length && t && t.length ? ih(e, t, $(r)) : e;
}
function Sb(e, t, r) {
  return e && e.length && t && t.length ? ih(e, t, void 0, r) : e;
}
var FM = Array.prototype, BM = FM.splice;
function xb(e, t) {
  for (var r = e ? t.length : 0, n = r - 1; r--; ) {
    var i = t[r];
    if (r == n || i !== s) {
      var s = i;
      Vr(i) ? BM.call(e, i, 1) : th(e, i);
    }
  }
  return e;
}
var Rb = Hr(function(e, t) {
  var r = e == null ? 0 : e.length, n = dl(e, t);
  return xb(e, ne(t, function(i) {
    return Vr(i, r) ? +i : i;
  }).sort(nb)), n;
}), zM = Math.floor, UM = Math.random;
function oh(e, t) {
  return e + zM(UM() * (t - e + 1));
}
var VM = parseFloat, kM = Math.min, WM = Math.random;
function Tb(e, t, r) {
  if (r && typeof r != "boolean" && ke(e, t, r) && (t = r = void 0), r === void 0 && (typeof t == "boolean" ? (r = t, t = void 0) : typeof e == "boolean" && (r = e, e = void 0)), e === void 0 && t === void 0 ? (e = 0, t = 1) : (e = cr(e), t === void 0 ? (t = e, e = 0) : t = cr(t)), e > t) {
    var n = e;
    e = t, t = n;
  }
  if (r || e % 1 || t % 1) {
    var i = WM();
    return kM(e + i * (t - e + VM("1e-" + ((i + "").length - 1))), t);
  }
  return oh(e, t);
}
var qM = Math.ceil, GM = Math.max;
function HM(e, t, r, n) {
  for (var i = -1, s = GM(qM((t - e) / (r || 1)), 0), o = Array(s); s--; )
    o[n ? s : ++i] = e, e += r;
  return o;
}
function Pb(e) {
  return function(t, r, n) {
    return n && typeof n != "number" && ke(t, r, n) && (r = n = void 0), t = cr(t), r === void 0 ? (r = t, t = 0) : r = cr(r), n = n === void 0 ? t < r ? 1 : -1 : cr(n), HM(t, r, n, e);
  };
}
var Nb = Pb(), $b = Pb(!0), KM = 256, Mb = Hr(function(e, t) {
  return kr(e, KM, void 0, void 0, void 0, t);
});
function Ib(e, t, r, n, i) {
  return i(e, function(s, o, a) {
    r = n ? (n = !1, s) : t(r, s, o, a);
  }), r;
}
function Db(e, t, r) {
  var n = M(e) ? bl : Ib, i = arguments.length < 3;
  return n(e, $(t), r, i, vn);
}
function YM(e, t, r, n) {
  var i = e == null ? 0 : e.length;
  for (n && i && (r = e[--i]); i--; )
    r = t(r, e[i], i, e);
  return r;
}
function Cb(e, t, r) {
  var n = M(e) ? YM : Ib, i = arguments.length < 3;
  return n(e, $(t), r, i, f0);
}
function Lb(e, t) {
  var r = M(e) ? _n : y0;
  return r(e, wo($(t)));
}
function jb(e, t) {
  var r = [];
  if (!(e && e.length))
    return r;
  var n = -1, i = [], s = e.length;
  for (t = $(t); ++n < s; ) {
    var o = e[n];
    t(o, n, e) && (r.push(o), i.push(n));
  }
  return xb(e, i), r;
}
function Fb(e, t, r) {
  return (r ? ke(e, t, r) : t === void 0) ? t = 1 : t = I(t), _c(k(e), t);
}
function Bb() {
  var e = arguments, t = k(e[0]);
  return e.length < 3 ? t : t.replace(e[1], e[2]);
}
var XM = "Expected a function";
function zb(e, t) {
  if (typeof e != "function")
    throw new TypeError(XM);
  return t = t === void 0 ? t : I(t), D(e, t);
}
function Ub(e, t, r) {
  t = hn(t, e);
  var n = -1, i = t.length;
  for (i || (i = 1, e = void 0); ++n < i; ) {
    var s = e?.[mr(t[n])];
    s === void 0 && (n = i, s = r), e = yr(s) ? s.call(e) : s;
  }
  return e;
}
var JM = Array.prototype, ZM = JM.reverse;
function Pa(e) {
  return e == null ? e : ZM.call(e);
}
var Vb = Ol("round");
function kb(e) {
  var t = e.length;
  return t ? e[oh(0, t - 1)] : void 0;
}
function QM(e) {
  return kb(Xn(e));
}
function Wb(e) {
  var t = M(e) ? kb : QM;
  return t(e);
}
function Du(e, t) {
  var r = -1, n = e.length, i = n - 1;
  for (t = t === void 0 ? n : t; ++r < t; ) {
    var s = oh(r, i), o = e[s];
    e[s] = e[r], e[r] = o;
  }
  return e.length = t, e;
}
function eI(e, t) {
  return Du(tt(e), Yn(t, 0, e.length));
}
function tI(e, t) {
  var r = Xn(e);
  return Du(r, Yn(t, 0, r.length));
}
function qb(e, t, r) {
  (r ? ke(e, t, r) : t === void 0) ? t = 1 : t = I(t);
  var n = M(e) ? eI : tI;
  return n(e, t);
}
function Gb(e, t, r) {
  return e == null ? e : Ao(e, t, r);
}
function Hb(e, t, r, n) {
  return n = typeof n == "function" ? n : void 0, e == null ? e : Ao(e, t, r, n);
}
function rI(e) {
  return Du(tt(e));
}
function nI(e) {
  return Du(Xn(e));
}
function Kb(e) {
  var t = M(e) ? rI : nI;
  return t(e);
}
var iI = "[object Map]", sI = "[object Set]";
function Yb(e) {
  if (e == null)
    return 0;
  if (He(e))
    return bo(e) ? Yi(e) : e.length;
  var t = hr(e);
  return t == iI || t == sI ? e.size : hl(e).length;
}
function Xb(e, t, r) {
  var n = e == null ? 0 : e.length;
  return n ? (r && typeof r != "number" && ke(e, t, r) ? (t = 0, r = n) : (t = t == null ? 0 : I(t), r = r === void 0 ? n : I(r)), Ft(e, t, r)) : [];
}
var Jb = Ki(function(e, t, r) {
  return e + (r ? "_" : "") + t.toLowerCase();
});
function oI(e, t) {
  var r;
  return vn(e, function(n, i, s) {
    return r = t(n, i, s), !r;
  }), !!r;
}
function Zb(e, t, r) {
  var n = M(e) ? Nl : oI;
  return r && ke(e, t, r) && (t = void 0), n(e, $(t));
}
var Qb = D(function(e, t) {
  if (e == null)
    return [];
  var r = t.length;
  return r > 1 && ke(e, t[0], t[1]) ? t = [] : r > 2 && ke(t[0], t[1], t[2]) && (t = [t[0]]), ib(e, Pe(t, 1), []);
}), aI = 4294967295, uI = aI - 1, fI = Math.floor, cI = Math.min;
function ah(e, t, r, n) {
  var i = 0, s = e == null ? 0 : e.length;
  if (s === 0)
    return 0;
  t = r(t);
  for (var o = t !== t, a = t === null, u = nt(t), f = t === void 0; i < s; ) {
    var c = fI((i + s) / 2), l = r(e[c]), h = l !== void 0, d = l === null, _ = l === l, v = nt(l);
    if (o)
      var g = n || _;
    else f ? g = _ && (n || h) : a ? g = _ && h && (n || !d) : u ? g = _ && h && !d && (n || !v) : d || v ? g = !1 : g = n ? l <= t : l < t;
    g ? i = c + 1 : s = c;
  }
  return cI(s, uI);
}
var lI = 4294967295, hI = lI >>> 1;
function Cu(e, t, r) {
  var n = 0, i = e == null ? n : e.length;
  if (typeof t == "number" && t === t && i <= hI) {
    for (; n < i; ) {
      var s = n + i >>> 1, o = e[s];
      o !== null && !nt(o) && (r ? o <= t : o < t) ? n = s + 1 : i = s;
    }
    return i;
  }
  return ah(e, t, Ge, r);
}
function em(e, t) {
  return Cu(e, t);
}
function tm(e, t, r) {
  return ah(e, t, $(r));
}
function rm(e, t) {
  var r = e == null ? 0 : e.length;
  if (r) {
    var n = Cu(e, t);
    if (n < r && Ut(e[n], t))
      return n;
  }
  return -1;
}
function nm(e, t) {
  return Cu(e, t, !0);
}
function im(e, t, r) {
  return ah(e, t, $(r), !0);
}
function sm(e, t) {
  var r = e == null ? 0 : e.length;
  if (r) {
    var n = Cu(e, t, !0) - 1;
    if (Ut(e[n], t))
      return n;
  }
  return -1;
}
function om(e, t) {
  for (var r = -1, n = e.length, i = 0, s = []; ++r < n; ) {
    var o = e[r], a = t ? t(o) : o;
    if (!r || !Ut(a, u)) {
      var u = a;
      s[i++] = o === 0 ? 0 : o;
    }
  }
  return s;
}
function am(e) {
  return e && e.length ? om(e) : [];
}
function um(e, t) {
  return e && e.length ? om(e, $(t)) : [];
}
var pI = 4294967295;
function fm(e, t, r) {
  return r && typeof r != "number" && ke(e, t, r) && (t = r = void 0), r = r === void 0 ? pI : r >>> 0, r ? (e = k(e), e && (typeof t == "string" || t != null && !$u(t)) && (t = yt(t), !t && Hi(e)) ? dn(Qt(e), 0, r) : e.split(t, r)) : [];
}
var dI = "Expected a function", _I = Math.max;
function cm(e, t) {
  if (typeof e != "function")
    throw new TypeError(dI);
  return t = t == null ? 0 : _I(I(t), 0), D(function(r) {
    var n = r[t], i = dn(r, 0, t);
    return n && pn(i, n), bt(e, this, i);
  });
}
var lm = Ki(function(e, t, r) {
  return e + (r ? " " : "") + bu(t);
});
function hm(e, t, r) {
  return e = k(e), r = r == null ? 0 : Yn(I(r), 0, e.length), t = yt(t), e.slice(r, r + t.length) == t;
}
function pm() {
  return {};
}
function dm() {
  return "";
}
function _m() {
  return !0;
}
var vm = su(function(e, t) {
  return e - t;
}, 0);
function gm(e) {
  return e && e.length ? Ql(e, Ge) : 0;
}
function ym(e, t) {
  return e && e.length ? Ql(e, $(t)) : 0;
}
function bm(e) {
  var t = e == null ? 0 : e.length;
  return t ? Ft(e, 1, t) : [];
}
function mm(e, t, r) {
  return e && e.length ? (t = r || t === void 0 ? 1 : I(t), Ft(e, 0, t < 0 ? 0 : t)) : [];
}
function wm(e, t, r) {
  var n = e == null ? 0 : e.length;
  return n ? (t = r || t === void 0 ? 1 : I(t), t = n - t, Ft(e, t < 0 ? 0 : t, n)) : [];
}
function Am(e, t) {
  return e && e.length ? Tu(e, $(t), !1, !0) : [];
}
function Om(e, t) {
  return e && e.length ? Tu(e, $(t)) : [];
}
function Em(e, t) {
  return t(e), e;
}
var Sm = Object.prototype, vI = Sm.hasOwnProperty;
function Nd(e, t, r, n) {
  return e === void 0 || Ut(e, Sm[r]) && !vI.call(n, r) ? t : e;
}
var gI = {
  "\\": "\\",
  "'": "'",
  "\n": "n",
  "\r": "r",
  "\u2028": "u2028",
  "\u2029": "u2029"
};
function yI(e) {
  return "\\" + gI[e];
}
var xm = /<%=([\s\S]+?)%>/g, bI = /<%-([\s\S]+?)%>/g, mI = /<%([\s\S]+?)%>/g, Na = {
  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  escape: bI,
  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  evaluate: mI,
  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  interpolate: xm,
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
    _: { escape: Vl }
  }
}, wI = "Invalid `variable` option passed into `_.template`", AI = /\b__p \+= '';/g, OI = /\b(__p \+=) '' \+/g, EI = /(__e\(.*?\)|\b__t\)) \+\n'';/g, SI = /[()=,{}\[\]\/\s]/, xI = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Qo = /($^)/, RI = /['\n\r\u2028\u2029\\]/g, TI = Object.prototype, $d = TI.hasOwnProperty;
function Rm(e, t, r) {
  var n = Na.imports._.templateSettings || Na;
  r && ke(e, t, r) && (t = void 0), e = k(e), t = js({}, t, n, Nd);
  var i = js({}, t.imports, n.imports, Nd), s = _e(i), o = Hl(i, s), a, u, f = 0, c = t.interpolate || Qo, l = "__p += '", h = RegExp(
    (t.escape || Qo).source + "|" + c.source + "|" + (c === xm ? xI : Qo).source + "|" + (t.evaluate || Qo).source + "|$",
    "g"
  ), d = $d.call(t, "sourceURL") ? "//# sourceURL=" + (t.sourceURL + "").replace(/\s/g, " ") + `
` : "";
  e.replace(h, function(g, y, b, w, m, A) {
    return b || (b = w), l += e.slice(f, A).replace(RI, yI), y && (a = !0, l += `' +
__e(` + y + `) +
'`), m && (u = !0, l += `';
` + m + `;
__p += '`), b && (l += `' +
((__t = (` + b + `)) == null ? '' : __t) +
'`), f = A + g.length, g;
  }), l += `';
`;
  var _ = $d.call(t, "variable") && t.variable;
  if (!_)
    l = `with (obj) {
` + l + `
}
`;
  else if (SI.test(_))
    throw new Error(wI);
  l = (u ? l.replace(AI, "") : l).replace(OI, "$1").replace(EI, "$1;"), l = "function(" + (_ || "obj") + `) {
` + (_ ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (a ? ", __e = _.escape" : "") + (u ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + l + `return __p
}`;
  var v = vl(function() {
    return Function(s, d + "return " + l).apply(void 0, o);
  });
  if (v.source = l, gu(v))
    throw v;
  return v;
}
var PI = "Expected a function";
function Tm(e, t, r) {
  var n = !0, i = !0;
  if (typeof e != "function")
    throw new TypeError(PI);
  return ie(r) && (n = "leading" in r ? !!r.leading : n, i = "trailing" in r ? !!r.trailing : i), jl(e, t, {
    leading: n,
    maxWait: t,
    trailing: i
  });
}
function Eo(e, t) {
  return t(e);
}
var NI = 9007199254740991, xf = 4294967295, $I = Math.min;
function Pm(e, t) {
  if (e = I(e), e < 1 || e > NI)
    return [];
  var r = xf, n = $I(e, xf);
  t = Ar(t), e -= xf;
  for (var i = ll(n, t); ++r < e; )
    t(r);
  return i;
}
function bc() {
  return this;
}
function Nm(e, t) {
  var r = e;
  return r instanceof C && (r = r.value()), bl(t, function(n, i) {
    return i.func.apply(i.thisArg, pn([n], i.args));
  }, r);
}
function vs() {
  return Nm(this.__wrapped__, this.__actions__);
}
function $m(e) {
  return k(e).toLowerCase();
}
function Mm(e) {
  return M(e) ? ne(e, mr) : nt(e) ? [e] : tt(Vv(k(e)));
}
var Md = 9007199254740991;
function Im(e) {
  return e ? Yn(I(e), -Md, Md) : e === 0 ? e : 0;
}
function Dm(e) {
  return k(e).toUpperCase();
}
function Cm(e, t, r) {
  var n = M(e), i = n || Br(e) || Hn(e);
  if (t = $(t), r == null) {
    var s = e && e.constructor;
    i ? r = n ? new s() : [] : ie(e) ? r = yr(s) ? Vi(vu(e)) : {} : r = {};
  }
  return (i ? zt : wr)(e, function(o, a, u) {
    return t(r, o, a, u);
  }), r;
}
function Lm(e, t) {
  for (var r = e.length; r-- && ki(t, e[r], 0) > -1; )
    ;
  return r;
}
function jm(e, t) {
  for (var r = -1, n = e.length; ++r < n && ki(t, e[r], 0) > -1; )
    ;
  return r;
}
function Fm(e, t, r) {
  if (e = k(e), e && (r || t === void 0))
    return Av(e);
  if (!e || !(t = yt(t)))
    return e;
  var n = Qt(e), i = Qt(t), s = jm(n, i), o = Lm(n, i) + 1;
  return dn(n, s, o).join("");
}
function Bm(e, t, r) {
  if (e = k(e), e && (r || t === void 0))
    return e.slice(0, wv(e) + 1);
  if (!e || !(t = yt(t)))
    return e;
  var n = Qt(e), i = Lm(n, Qt(t)) + 1;
  return dn(n, 0, i).join("");
}
var MI = /^\s+/;
function zm(e, t, r) {
  if (e = k(e), e && (r || t === void 0))
    return e.replace(MI, "");
  if (!e || !(t = yt(t)))
    return e;
  var n = Qt(e), i = jm(n, Qt(t));
  return dn(n, i).join("");
}
var II = 30, DI = "...", CI = /\w*$/;
function Um(e, t) {
  var r = II, n = DI;
  if (ie(t)) {
    var i = "separator" in t ? t.separator : i;
    r = "length" in t ? I(t.length) : r, n = "omission" in t ? yt(t.omission) : n;
  }
  e = k(e);
  var s = e.length;
  if (Hi(e)) {
    var o = Qt(e);
    s = o.length;
  }
  if (r >= s)
    return e;
  var a = r - Yi(n);
  if (a < 1)
    return n;
  var u = o ? dn(o, 0, a).join("") : e.slice(0, a);
  if (i === void 0)
    return u + n;
  if (o && (a += u.length - a), $u(i)) {
    if (e.slice(a).search(i)) {
      var f, c = u;
      for (i.global || (i = RegExp(i.source, k(CI.exec(i)) + "g")), i.lastIndex = 0; f = i.exec(c); )
        var l = f.index;
      u = u.slice(0, l === void 0 ? a : l);
    }
  } else if (e.indexOf(yt(i), a) != a) {
    var h = u.lastIndexOf(i);
    h > -1 && (u = u.slice(0, h));
  }
  return u + n;
}
function Vm(e) {
  return cl(e, 1);
}
var LI = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'"
}, jI = ml(LI), km = /&(?:amp|lt|gt|quot|#39);/g, FI = RegExp(km.source);
function Wm(e) {
  return e = k(e), e && FI.test(e) ? e.replace(km, jI) : e;
}
var BI = 1 / 0, zI = gi && 1 / Au(new gi([, -0]))[1] == BI ? function(e) {
  return new gi(e);
} : au, UI = 200;
function on(e, t, r) {
  var n = -1, i = cu, s = e.length, o = !0, a = [], u = a;
  if (r)
    o = !1, i = zl;
  else if (s >= UI) {
    var f = t ? null : zI(e);
    if (f)
      return Au(f);
    o = !1, i = zs, u = new Mn();
  } else
    u = t ? [] : a;
  e:
    for (; ++n < s; ) {
      var c = e[n], l = t ? t(c) : c;
      if (c = r || c !== 0 ? c : 0, o && l === l) {
        for (var h = u.length; h--; )
          if (u[h] === l)
            continue e;
        t && u.push(l), a.push(c);
      } else i(u, l, r) || (u !== a && u.push(l), a.push(c));
    }
  return a;
}
var qm = D(function(e) {
  return on(Pe(e, 1, ue, !0));
}), Gm = D(function(e) {
  var t = wt(e);
  return ue(t) && (t = void 0), on(Pe(e, 1, ue, !0), $(t));
}), Hm = D(function(e) {
  var t = wt(e);
  return t = typeof t == "function" ? t : void 0, on(Pe(e, 1, ue, !0), void 0, t);
});
function Km(e) {
  return e && e.length ? on(e) : [];
}
function Ym(e, t) {
  return e && e.length ? on(e, $(t)) : [];
}
function Xm(e, t) {
  return t = typeof t == "function" ? t : void 0, e && e.length ? on(e, void 0, t) : [];
}
var VI = 0;
function Jm(e) {
  var t = ++VI;
  return k(e) + t;
}
function Zm(e, t) {
  return e == null ? !0 : th(e, t);
}
var kI = Math.max;
function Lu(e) {
  if (!(e && e.length))
    return [];
  var t = 0;
  return e = _n(e, function(r) {
    if (ue(r))
      return t = kI(r.length, t), !0;
  }), ll(t, function(r) {
    return ne(e, Dl(r));
  });
}
function uh(e, t) {
  if (!(e && e.length))
    return [];
  var r = Lu(e);
  return t == null ? r : ne(r, function(n) {
    return bt(t, void 0, n);
  });
}
function Qm(e, t, r, n) {
  return Ao(e, t, r(Kn(e, t)), n);
}
function e1(e, t, r) {
  return e == null ? e : Qm(e, t, Ar(r));
}
function t1(e, t, r, n) {
  return n = typeof n == "function" ? n : void 0, e == null ? e : Qm(e, t, Ar(r), n);
}
var r1 = Ki(function(e, t, r) {
  return e + (r ? " " : "") + t.toUpperCase();
});
function n1(e) {
  return e == null ? [] : Hl(e, Ke(e));
}
var i1 = D(function(e, t) {
  return ue(e) ? go(e, t) : [];
});
function s1(e, t) {
  return Oo(Ar(t), e);
}
var o1 = Hr(function(e) {
  var t = e.length, r = t ? e[0] : 0, n = this.__wrapped__, i = function(s) {
    return dl(s, e);
  };
  return t > 1 || this.__actions__.length || !(n instanceof C) || !Vr(r) ? this.thru(i) : (n = n.slice(r, +r + (t ? 1 : 0)), n.__actions__.push({
    func: Eo,
    args: [i],
    thisArg: void 0
  }), new Lt(n, this.__chain__).thru(function(s) {
    return t && !s.length && s.push(void 0), s;
  }));
});
function a1() {
  return El(this);
}
function u1() {
  var e = this.__wrapped__;
  if (e instanceof C) {
    var t = e;
    return this.__actions__.length && (t = new C(this)), t = t.reverse(), t.__actions__.push({
      func: Eo,
      args: [Pa],
      thisArg: void 0
    }), new Lt(t, this.__chain__);
  }
  return this.thru(Pa);
}
function fh(e, t, r) {
  var n = e.length;
  if (n < 2)
    return n ? on(e[0]) : [];
  for (var i = -1, s = Array(n); ++i < n; )
    for (var o = e[i], a = -1; ++a < n; )
      a != i && (s[i] = go(s[i] || o, e[a], t, r));
  return on(Pe(s, 1), t, r);
}
var f1 = D(function(e) {
  return fh(_n(e, ue));
}), c1 = D(function(e) {
  var t = wt(e);
  return ue(t) && (t = void 0), fh(_n(e, ue), $(t));
}), l1 = D(function(e) {
  var t = wt(e);
  return t = typeof t == "function" ? t : void 0, fh(_n(e, ue), void 0, t);
}), h1 = D(Lu);
function p1(e, t, r) {
  for (var n = -1, i = e.length, s = t.length, o = {}; ++n < i; ) {
    var a = n < s ? t[n] : void 0;
    r(o, e[n], a);
  }
  return o;
}
function d1(e, t) {
  return p1(e || [], t || [], co);
}
function _1(e, t) {
  return p1(e || [], t || [], Ao);
}
var v1 = D(function(e) {
  var t = e.length, r = t > 1 ? e[t - 1] : void 0;
  return r = typeof r == "function" ? (e.pop(), r) : void 0, uh(e, r);
});
const x = {
  chunk: _g,
  compact: Ng,
  concat: $g,
  difference: e0,
  differenceBy: t0,
  differenceWith: r0,
  drop: i0,
  dropRight: s0,
  dropRightWhile: o0,
  dropWhile: a0,
  fill: g0,
  findIndex: Wl,
  findLastIndex: ql,
  flatten: _l,
  flattenDeep: N0,
  flattenDepth: $0,
  fromPairs: U0,
  head: pc,
  indexOf: X0,
  initial: J0,
  intersection: Z0,
  intersectionBy: Q0,
  intersectionWith: ey,
  join: xy,
  lastIndexOf: Py,
  nth: Jy,
  pull: Ob,
  pullAll: sh,
  pullAllBy: Eb,
  pullAllWith: Sb,
  pullAt: Rb,
  remove: jb,
  reverse: Pa,
  slice: Xb,
  sortedIndex: em,
  sortedIndexBy: tm,
  sortedIndexOf: rm,
  sortedLastIndex: nm,
  sortedLastIndexBy: im,
  sortedLastIndexOf: sm,
  sortedUniq: am,
  sortedUniqBy: um,
  tail: bm,
  take: mm,
  takeRight: wm,
  takeRightWhile: Am,
  takeWhile: Om,
  union: qm,
  unionBy: Gm,
  unionWith: Hm,
  uniq: Km,
  uniqBy: Ym,
  uniqWith: Xm,
  unzip: Lu,
  unzipWith: uh,
  without: i1,
  xor: f1,
  xorBy: c1,
  xorWith: l1,
  zip: h1,
  zipObject: d1,
  zipObjectDeep: _1,
  zipWith: v1
}, H = {
  countBy: Wg,
  every: v0,
  filter: b0,
  find: w0,
  findLast: E0,
  flatMap: R0,
  flatMapDeep: T0,
  flatMapDepth: P0,
  forEach: fc,
  forEachRight: cc,
  groupBy: W0,
  includes: Y0,
  invokeMap: ay,
  keyBy: Ty,
  map: yo,
  orderBy: sb,
  partition: mb,
  reduce: Db,
  reduceRight: Cb,
  reject: Lb,
  sample: Wb,
  sampleSize: qb,
  shuffle: Kb,
  size: Yb,
  some: Zb,
  sortBy: Qb
}, WI = {
  now: As
}, fe = {
  after: Ov,
  ary: cl,
  before: gl,
  bind: _o,
  bindKey: yu,
  curry: Su,
  curryRight: xu,
  debounce: jl,
  defer: Zg,
  delay: Qg,
  flip: M0,
  memoize: po,
  once: rb,
  overArgs: ab,
  partial: Oo,
  partialRight: Iu,
  rearg: Mb,
  rest: zb,
  spread: cm,
  throttle: Tm,
  unary: Vm,
  wrap: s1
}, P = {
  castArray: pg,
  clone: Rg,
  cloneDeep: wu,
  cloneDeepWith: Tg,
  cloneWith: Pg,
  conformsTo: Ug,
  eq: Ut,
  gt: q0,
  gte: G0,
  isArguments: sn,
  isArrayBuffer: uy,
  isArrayLike: He,
  isArrayLikeObject: ue,
  isBoolean: fy,
  isBuffer: Br,
  isDate: cy,
  isElement: ly,
  isEmpty: hy,
  isEqual: yi,
  isEqualWith: py,
  isError: gu,
  isFinite: dy,
  isFunction: yr,
  isInteger: Xl,
  isLength: lo,
  isMap: Tl,
  isMatch: _y,
  isMatchWith: vy,
  isNaN: gy,
  isNative: yy,
  isNil: by,
  isNull: my,
  isNumber: Jl,
  isObjectLike: se,
  isPlainObject: Gi,
  isRegExp: $u,
  isSafeInteger: wy,
  isSet: Pl,
  isString: bo,
  isSymbol: nt,
  isTypedArray: Hn,
  isUndefined: Ay,
  isWeakMap: Oy,
  isWeakSet: Ey,
  lt: My,
  lte: Iy,
  toArray: eh,
  toFinite: cr,
  toLength: kl,
  toNumber: pt,
  toPlainObject: Fl,
  toSafeInteger: Im,
  toString: k
}, Ye = {
  add: mv,
  ceil: dg,
  divide: n0,
  floor: I0,
  max: Fy,
  maxBy: By,
  mean: Uy,
  meanBy: Vy,
  min: Gy,
  minBy: Hy,
  multiply: Yy,
  round: Vb,
  subtract: vm,
  sum: gm,
  sumBy: ym
}, ch = {
  clamp: vg,
  inRange: K0,
  random: Tb
}, N = {
  assign: zv,
  assignIn: ec,
  assignInWith: js,
  assignWith: Uv,
  at: kv,
  create: qg,
  defaults: Kg,
  defaultsDeep: Xg,
  findKey: O0,
  findLastKey: S0,
  forIn: j0,
  forInRight: F0,
  forOwn: B0,
  forOwnRight: z0,
  functions: V0,
  functionsIn: k0,
  get: _u,
  has: H0,
  hasIn: Ou,
  invert: ry,
  invertBy: iy,
  invoke: oy,
  keysIn: Ke,
  mapKeys: Dy,
  mapValues: Cy,
  merge: ky,
  mergeWith: Bl,
  omit: Qy,
  omitBy: tb,
  pick: wb,
  pickBy: rh,
  result: Ub,
  set: Gb,
  setWith: Hb,
  toPairs: lc,
  toPairsIn: hc,
  transform: Cm,
  unset: Zm,
  update: e1,
  updateWith: t1,
  values: Xn,
  valuesIn: n1
}, Or = {
  at: o1,
  chain: El,
  commit: oc,
  next: dc,
  plant: yc,
  reverse: u1,
  tap: Em,
  toIterator: bc,
  value: vs,
  wrapperChain: a1
}, W = {
  camelCase: hg,
  capitalize: yl,
  deburr: wl,
  endsWith: c0,
  escape: Vl,
  escapeRegExp: d0,
  kebabCase: Ry,
  lowerCase: Ny,
  lowerFirst: $y,
  pad: vb,
  padEnd: gb,
  padStart: yb,
  parseInt: bb,
  repeat: Fb,
  replace: Bb,
  snakeCase: Jb,
  split: fm,
  startCase: lm,
  startsWith: hm,
  template: Rm,
  templateSettings: Na,
  toLower: $m,
  toUpper: Dm,
  trim: Fm,
  trimEnd: Bm,
  trimStart: zm,
  truncate: Um,
  unescape: Wm,
  upperCase: r1,
  upperFirst: bu,
  words: Al
}, G = {
  attempt: vl,
  bindAll: qv,
  cond: Fg,
  conforms: zg,
  constant: uu,
  defaultTo: Gg,
  flow: C0,
  flowRight: L0,
  iteratee: Sy,
  matches: Ly,
  matchesProperty: jy,
  method: Wy,
  methodOf: qy,
  noop: au,
  nthArg: Zy,
  over: ob,
  overEvery: ub,
  overSome: fb,
  property: Cl,
  propertyOf: Ab,
  range: Nb,
  rangeRight: $b,
  stubArray: mu,
  stubFalse: hu,
  stubObject: pm,
  stubString: dm,
  stubTrue: _m,
  times: Pm,
  toPath: Mm,
  uniqueId: Jm
};
function qI() {
  var e = new C(this.__wrapped__);
  return e.__actions__ = tt(this.__actions__), e.__dir__ = this.__dir__, e.__filtered__ = this.__filtered__, e.__iteratees__ = tt(this.__iteratees__), e.__takeCount__ = this.__takeCount__, e.__views__ = tt(this.__views__), e;
}
function GI() {
  if (this.__filtered__) {
    var e = new C(this);
    e.__dir__ = -1, e.__filtered__ = !0;
  } else
    e = this.clone(), e.__dir__ *= -1;
  return e;
}
var HI = Math.max, KI = Math.min;
function YI(e, t, r) {
  for (var n = -1, i = r.length; ++n < i; ) {
    var s = r[n], o = s.size;
    switch (s.type) {
      case "drop":
        e += o;
        break;
      case "dropRight":
        t -= o;
        break;
      case "take":
        t = KI(t, e + o);
        break;
      case "takeRight":
        e = HI(e, t - o);
        break;
    }
  }
  return { start: e, end: t };
}
var XI = 1, JI = 2, ZI = Math.min;
function QI() {
  var e = this.__wrapped__.value(), t = this.__dir__, r = M(e), n = t < 0, i = r ? e.length : 0, s = YI(0, i, this.__views__), o = s.start, a = s.end, u = a - o, f = n ? a : o - 1, c = this.__iteratees__, l = c.length, h = 0, d = ZI(u, this.__takeCount__);
  if (!r || !n && i == u && d == u)
    return Nm(e, this.__actions__);
  var _ = [];
  e:
    for (; u-- && h < d; ) {
      f += t;
      for (var v = -1, g = e[f]; ++v < l; ) {
        var y = c[v], b = y.iteratee, w = y.type, m = b(g);
        if (w == JI)
          g = m;
        else if (!m) {
          if (w == XI)
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
var eD = "4.17.21", tD = 2, rD = 1, nD = 3, g1 = 4294967295, iD = Array.prototype, sD = Object.prototype, y1 = sD.hasOwnProperty, Id = Ie ? Ie.iterator : void 0, oD = Math.max, Dd = Math.min, lh = /* @__PURE__ */ function(e) {
  return function(t, r, n) {
    if (n == null) {
      var i = ie(r), s = i && _e(r), o = s && s.length && Pu(r, s);
      (o ? o.length : i) || (n = r, r = t, t = this);
    }
    return e(t, r, n);
  };
}(Ky);
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
p.chain = Or.chain;
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
p.mixin = lh;
p.negate = wo;
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
p.tap = Or.tap;
p.throttle = fe.throttle;
p.thru = Eo;
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
lh(p, p);
p.add = Ye.add;
p.attempt = G.attempt;
p.camelCase = W.camelCase;
p.capitalize = W.capitalize;
p.ceil = Ye.ceil;
p.clamp = ch.clamp;
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
p.inRange = ch.inRange;
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
p.now = WI.now;
p.pad = W.pad;
p.padEnd = W.padEnd;
p.padStart = W.padStart;
p.parseInt = W.parseInt;
p.random = ch.random;
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
lh(p, function() {
  var e = {};
  return wr(p, function(t, r) {
    y1.call(p.prototype, r) || (e[r] = t);
  }), e;
}(), { chain: !1 });
p.VERSION = eD;
(p.templateSettings = W.templateSettings).imports._ = p;
zt(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(e) {
  p[e].placeholder = p;
});
zt(["drop", "take"], function(e, t) {
  C.prototype[e] = function(r) {
    r = r === void 0 ? 1 : oD(I(r), 0);
    var n = this.__filtered__ && !t ? new C(this) : this.clone();
    return n.__filtered__ ? n.__takeCount__ = Dd(r, n.__takeCount__) : n.__views__.push({
      size: Dd(r, g1),
      type: e + (n.__dir__ < 0 ? "Right" : "")
    }), n;
  }, C.prototype[e + "Right"] = function(r) {
    return this.reverse()[e](r).reverse();
  };
});
zt(["filter", "map", "takeWhile"], function(e, t) {
  var r = t + 1, n = r == rD || r == nD;
  C.prototype[e] = function(i) {
    var s = this.clone();
    return s.__iteratees__.push({
      iteratee: $(i),
      type: r
    }), s.__filtered__ = s.__filtered__ || n, s;
  };
});
zt(["head", "last"], function(e, t) {
  var r = "take" + (t ? "Right" : "");
  C.prototype[e] = function() {
    return this[r](1).value()[0];
  };
});
zt(["initial", "tail"], function(e, t) {
  var r = "drop" + (t ? "" : "Right");
  C.prototype[e] = function() {
    return this.__filtered__ ? new C(this) : this[r](1);
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
  return typeof e == "function" ? new C(this) : this.map(function(r) {
    return mo(r, e, t);
  });
});
C.prototype.reject = function(e) {
  return this.filter(wo($(e)));
};
C.prototype.slice = function(e, t) {
  e = I(e);
  var r = this;
  return r.__filtered__ && (e > 0 || t < 0) ? new C(r) : (e < 0 ? r = r.takeRight(-e) : e && (r = r.drop(e)), t !== void 0 && (t = I(t), r = t < 0 ? r.dropRight(-t) : r.take(t - e)), r);
};
C.prototype.takeRightWhile = function(e) {
  return this.reverse().takeWhile(e).reverse();
};
C.prototype.toArray = function() {
  return this.take(g1);
};
wr(C.prototype, function(e, t) {
  var r = /^(?:filter|find|map|reject)|While$/.test(t), n = /^(?:head|last)$/.test(t), i = p[n ? "take" + (t == "last" ? "Right" : "") : t], s = n || /^find/.test(t);
  i && (p.prototype[t] = function() {
    var o = this.__wrapped__, a = n ? [1] : arguments, u = o instanceof C, f = a[0], c = u || M(o), l = function(y) {
      var b = i.apply(p, pn([y], a));
      return n && h ? b[0] : b;
    };
    c && r && typeof f == "function" && f.length != 1 && (u = c = !1);
    var h = this.__chain__, d = !!this.__actions__.length, _ = s && !h, v = u && !d;
    if (!s && c) {
      o = v ? o : new C(this);
      var g = e.apply(o, a);
      return g.__actions__.push({ func: Eo, args: [l], thisArg: void 0 }), new Lt(g, h);
    }
    return _ && v ? e.apply(this, a) : (g = this.thru(l), _ ? n ? g.value()[0] : g.value() : g);
  });
});
zt(["pop", "push", "shift", "sort", "splice", "unshift"], function(e) {
  var t = iD[e], r = /^(?:push|sort|unshift)$/.test(e) ? "tap" : "thru", n = /^(?:pop|shift)$/.test(e);
  p.prototype[e] = function() {
    var i = arguments;
    if (n && !this.__chain__) {
      var s = this.value();
      return t.apply(M(s) ? s : [], i);
    }
    return this[r](function(o) {
      return t.apply(M(o) ? o : [], i);
    });
  };
});
wr(C.prototype, function(e, t) {
  var r = p[t];
  if (r) {
    var n = r.name + "";
    y1.call(vi, n) || (vi[n] = []), vi[n].push({ name: t, func: r });
  }
});
vi[lu(void 0, tD).name] = [{
  name: "wrapper",
  func: void 0
}];
C.prototype.clone = qI;
C.prototype.reverse = GI;
C.prototype.value = QI;
p.prototype.at = Or.at;
p.prototype.chain = Or.wrapperChain;
p.prototype.commit = Or.commit;
p.prototype.next = Or.next;
p.prototype.plant = Or.plant;
p.prototype.reverse = Or.reverse;
p.prototype.toJSON = p.prototype.valueOf = p.prototype.value = Or.value;
p.prototype.first = p.prototype.head;
Id && (p.prototype[Id] = Or.toIterator);
/**
 * @license
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="es" -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
const Hz = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: mv,
  after: Ov,
  ary: cl,
  assign: zv,
  assignIn: ec,
  assignInWith: js,
  assignWith: Uv,
  at: kv,
  attempt: vl,
  before: gl,
  bind: _o,
  bindAll: qv,
  bindKey: yu,
  camelCase: hg,
  capitalize: yl,
  castArray: pg,
  ceil: dg,
  chain: El,
  chunk: _g,
  clamp: vg,
  clone: Rg,
  cloneDeep: wu,
  cloneDeepWith: Tg,
  cloneWith: Pg,
  commit: oc,
  compact: Ng,
  concat: $g,
  cond: Fg,
  conforms: zg,
  conformsTo: Ug,
  constant: uu,
  countBy: Wg,
  create: qg,
  curry: Su,
  curryRight: xu,
  debounce: jl,
  deburr: wl,
  default: p,
  defaultTo: Gg,
  defaults: Kg,
  defaultsDeep: Xg,
  defer: Zg,
  delay: Qg,
  difference: e0,
  differenceBy: t0,
  differenceWith: r0,
  divide: n0,
  drop: i0,
  dropRight: s0,
  dropRightWhile: o0,
  dropWhile: a0,
  each: fc,
  eachRight: cc,
  endsWith: c0,
  entries: lc,
  entriesIn: hc,
  eq: Ut,
  escape: Vl,
  escapeRegExp: d0,
  every: v0,
  extend: ec,
  extendWith: js,
  fill: g0,
  filter: b0,
  find: w0,
  findIndex: Wl,
  findKey: O0,
  findLast: E0,
  findLastIndex: ql,
  findLastKey: S0,
  first: pc,
  flatMap: R0,
  flatMapDeep: T0,
  flatMapDepth: P0,
  flatten: _l,
  flattenDeep: N0,
  flattenDepth: $0,
  flip: M0,
  floor: I0,
  flow: C0,
  flowRight: L0,
  forEach: fc,
  forEachRight: cc,
  forIn: j0,
  forInRight: F0,
  forOwn: B0,
  forOwnRight: z0,
  fromPairs: U0,
  functions: V0,
  functionsIn: k0,
  get: _u,
  groupBy: W0,
  gt: q0,
  gte: G0,
  has: H0,
  hasIn: Ou,
  head: pc,
  identity: Ge,
  inRange: K0,
  includes: Y0,
  indexOf: X0,
  initial: J0,
  intersection: Z0,
  intersectionBy: Q0,
  intersectionWith: ey,
  invert: ry,
  invertBy: iy,
  invoke: oy,
  invokeMap: ay,
  isArguments: sn,
  isArray: M,
  isArrayBuffer: uy,
  isArrayLike: He,
  isArrayLikeObject: ue,
  isBoolean: fy,
  isBuffer: Br,
  isDate: cy,
  isElement: ly,
  isEmpty: hy,
  isEqual: yi,
  isEqualWith: py,
  isError: gu,
  isFinite: dy,
  isFunction: yr,
  isInteger: Xl,
  isLength: lo,
  isMap: Tl,
  isMatch: _y,
  isMatchWith: vy,
  isNaN: gy,
  isNative: yy,
  isNil: by,
  isNull: my,
  isNumber: Jl,
  isObject: ie,
  isObjectLike: se,
  isPlainObject: Gi,
  isRegExp: $u,
  isSafeInteger: wy,
  isSet: Pl,
  isString: bo,
  isSymbol: nt,
  isTypedArray: Hn,
  isUndefined: Ay,
  isWeakMap: Oy,
  isWeakSet: Ey,
  iteratee: Sy,
  join: xy,
  kebabCase: Ry,
  keyBy: Ty,
  keys: _e,
  keysIn: Ke,
  last: wt,
  lastIndexOf: Py,
  lodash: p,
  lowerCase: Ny,
  lowerFirst: $y,
  lt: My,
  lte: Iy,
  map: yo,
  mapKeys: Dy,
  mapValues: Cy,
  matches: Ly,
  matchesProperty: jy,
  max: Fy,
  maxBy: By,
  mean: Uy,
  meanBy: Vy,
  memoize: po,
  merge: ky,
  mergeWith: Bl,
  method: Wy,
  methodOf: qy,
  min: Gy,
  minBy: Hy,
  mixin: Ky,
  multiply: Yy,
  negate: wo,
  next: dc,
  noop: au,
  now: As,
  nth: Jy,
  nthArg: Zy,
  omit: Qy,
  omitBy: tb,
  once: rb,
  orderBy: sb,
  over: ob,
  overArgs: ab,
  overEvery: ub,
  overSome: fb,
  pad: vb,
  padEnd: gb,
  padStart: yb,
  parseInt: bb,
  partial: Oo,
  partialRight: Iu,
  partition: mb,
  pick: wb,
  pickBy: rh,
  plant: yc,
  property: Cl,
  propertyOf: Ab,
  pull: Ob,
  pullAll: sh,
  pullAllBy: Eb,
  pullAllWith: Sb,
  pullAt: Rb,
  random: Tb,
  range: Nb,
  rangeRight: $b,
  rearg: Mb,
  reduce: Db,
  reduceRight: Cb,
  reject: Lb,
  remove: jb,
  repeat: Fb,
  replace: Bb,
  rest: zb,
  result: Ub,
  reverse: Pa,
  round: Vb,
  sample: Wb,
  sampleSize: qb,
  set: Gb,
  setWith: Hb,
  shuffle: Kb,
  size: Yb,
  slice: Xb,
  snakeCase: Jb,
  some: Zb,
  sortBy: Qb,
  sortedIndex: em,
  sortedIndexBy: tm,
  sortedIndexOf: rm,
  sortedLastIndex: nm,
  sortedLastIndexBy: im,
  sortedLastIndexOf: sm,
  sortedUniq: am,
  sortedUniqBy: um,
  split: fm,
  spread: cm,
  startCase: lm,
  startsWith: hm,
  stubArray: mu,
  stubFalse: hu,
  stubObject: pm,
  stubString: dm,
  stubTrue: _m,
  subtract: vm,
  sum: gm,
  sumBy: ym,
  tail: bm,
  take: mm,
  takeRight: wm,
  takeRightWhile: Am,
  takeWhile: Om,
  tap: Em,
  template: Rm,
  templateSettings: Na,
  throttle: Tm,
  thru: Eo,
  times: Pm,
  toArray: eh,
  toFinite: cr,
  toInteger: I,
  toIterator: bc,
  toJSON: vs,
  toLength: kl,
  toLower: $m,
  toNumber: pt,
  toPairs: lc,
  toPairsIn: hc,
  toPath: Mm,
  toPlainObject: Fl,
  toSafeInteger: Im,
  toString: k,
  toUpper: Dm,
  transform: Cm,
  trim: Fm,
  trimEnd: Bm,
  trimStart: zm,
  truncate: Um,
  unary: Vm,
  unescape: Wm,
  union: qm,
  unionBy: Gm,
  unionWith: Hm,
  uniq: Km,
  uniqBy: Ym,
  uniqWith: Xm,
  uniqueId: Jm,
  unset: Zm,
  unzip: Lu,
  unzipWith: uh,
  update: e1,
  updateWith: t1,
  upperCase: r1,
  upperFirst: bu,
  value: vs,
  valueOf: vs,
  values: Xn,
  valuesIn: n1,
  without: i1,
  words: Al,
  wrap: s1,
  wrapperAt: o1,
  wrapperChain: a1,
  wrapperCommit: oc,
  wrapperLodash: p,
  wrapperNext: dc,
  wrapperPlant: yc,
  wrapperReverse: u1,
  wrapperToIterator: bc,
  wrapperValue: vs,
  xor: f1,
  xorBy: c1,
  xorWith: l1,
  zip: h1,
  zipObject: d1,
  zipObjectDeep: _1,
  zipWith: v1
}, Symbol.toStringTag, { value: "Module" }));
function b1(e) {
  return [parseInt(e.substr(1, 2), 16), parseInt(e.substr(3, 2), 16), parseInt(e.substr(5, 2), 16)];
}
function Rf(e) {
  const t = Math.round(e).toString(16);
  return t.length === 1 ? `0${t}` : t;
}
function m1(e) {
  return `#${Rf(e[0])}${Rf(e[1])}${Rf(e[2])}`;
}
const aD = /rgba?\(([\s.,0-9]+)\)/;
function uD() {
  const e = document.createElement("i");
  return e.title = "Web Colour Picker", e.style.display = "none", document.body.appendChild(e), e;
}
let ea;
function w1(e) {
  if (e[0] === "#" && e.length === 7)
    return e;
  ea || (ea = uD()), ea.style.color = e;
  let t = document.defaultView.getComputedStyle(ea, "").getPropertyValue("color");
  const n = aD.exec(t)[1].split(/\s*,\s*/).map((i) => Number(i));
  return t = m1(n), t;
}
function Tf(e, t, r, n) {
  return e[n] + (t[n] - e[n]) * r;
}
function fD(e, t) {
  const r = isNaN(Number(t)) || t < 0 ? 0 : t > 1 ? 1 : Number(t), n = e.length - 1, i = Math.floor(n * r), s = n * r - i, o = e[i], a = i === n ? o : e[i + 1];
  return m1([Tf(o, a, s, 0), Tf(o, a, s, 1), Tf(o, a, s, 2)]);
}
function cD(e) {
  const r = (typeof e == "string" ? e.split("-") : e).map((n) => b1(n.indexOf("#") === -1 ? w1(n) : n));
  return (n) => fD(r, n);
}
const lD = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i, hD = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i, pD = /[\d.]+:(#[^\s]+|[^)]+\))/gi;
function dD(e) {
  return /^[r,R,L,l]{1}[\s]*\(/.test(e);
}
function _D(e) {
  if (dD(e)) {
    let t = "", r;
    if (e[0] === "l") {
      const i = lD.exec(e), s = +i[1] + 90;
      r = i[2], t = `linear-gradient(${s}deg, `;
    } else e[0] === "r" && (t = "radial-gradient(", r = hD.exec(e)[4]);
    const n = r.match(pD);
    return n.forEach((i, s) => {
      const o = i.split(":");
      t += `${o[1]} ${Number(o[0]) * 100}%`, s !== n.length - 1 && (t += ", ");
    }), t += ")", t;
  }
  return e;
}
var Cd = typeof Float32Array < "u" ? Float32Array : Array;
function ju(e, t, r) {
  var n = t[0], i = t[1], s = t[2], o = t[3], a = t[4], u = t[5], f = t[6], c = t[7], l = t[8], h = r[0], d = r[1], _ = r[2], v = r[3], g = r[4], y = r[5], b = r[6], w = r[7], m = r[8];
  return e[0] = h * n + d * o + _ * f, e[1] = h * i + d * a + _ * c, e[2] = h * s + d * u + _ * l, e[3] = v * n + g * o + y * f, e[4] = v * i + g * a + y * c, e[5] = v * s + g * u + y * l, e[6] = b * n + w * o + m * f, e[7] = b * i + w * a + m * c, e[8] = b * s + w * u + m * l, e;
}
function vD(e, t) {
  return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = t[0], e[7] = t[1], e[8] = 1, e;
}
function gD(e, t) {
  var r = Math.sin(t), n = Math.cos(t);
  return e[0] = n, e[1] = r, e[2] = 0, e[3] = -r, e[4] = n, e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
}
function yD(e, t) {
  return e[0] = t[0], e[1] = 0, e[2] = 0, e[3] = 0, e[4] = t[1], e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
}
function bD() {
  var e = new Cd(2);
  return Cd != Float32Array && (e[0] = 0, e[1] = 0), e;
}
function mD(e, t) {
  var r = e[0], n = e[1], i = t[0], s = t[1];
  return Math.abs(Math.atan2(n * i - r * s, r * i + n * s));
}
(function() {
  var e = bD();
  return function(t, r, n, i, s, o) {
    var a, u;
    for (r || (r = 2), n || (n = 0), i ? u = Math.min(i * r + n, t.length) : u = t.length, a = n; a < u; a += r)
      e[0] = t[a], e[1] = t[a + 1], s(e, e, o), t[a] = e[0], t[a + 1] = e[1];
    return t;
  };
})();
function wD(e, t, r) {
  const n = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return vD(n, r), ju(e, n, t);
}
function AD(e, t, r) {
  const n = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return gD(n, r), ju(e, n, t);
}
function OD(e, t, r) {
  const n = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return yD(n, r), ju(e, n, t);
}
function ED(e, t, r) {
  return ju(e, r, t);
}
function SD(e, t) {
  const r = e ? [].concat(e) : [1, 0, 0, 0, 1, 0, 0, 0, 1];
  for (let n = 0, i = t.length; n < i; n++) {
    const s = t[n];
    switch (s[0]) {
      case "t":
        wD(r, r, [s[1], s[2]]);
        break;
      case "s":
        OD(r, r, [s[1], s[2]]);
        break;
      case "r":
        AD(r, r, s[1]);
        break;
      case "m":
        ED(r, r, s[1]);
        break;
    }
  }
  return r;
}
function A1(e, t) {
  return e[0] * t[1] - t[0] * e[1];
}
function xD(e, t, r) {
  const n = mD(e, t), i = A1(e, t) >= 0;
  return r ? i ? Math.PI * 2 - n : n : i ? n : Math.PI * 2 - n;
}
function RD(e, t, r) {
  return r ? (e[0] = t[1], e[1] = -1 * t[0]) : (e[0] = -1 * t[1], e[1] = t[0]), e;
}
function Xi(e) {
  return e.map((t) => Array.isArray(t) ? [].concat(t) : t);
}
function TD(e, t) {
  if (t === "off") return Xi(e);
  const r = typeof t == "number" && t >= 1 ? 10 ** t : 1;
  return e.map((n) => {
    const i = n.slice(1).map(Number).map((s) => t ? Math.round(s * r) / r : Math.round(s));
    return [n[0]].concat(i);
  });
}
function PD(e, t = "off") {
  return TD(e, t).map((r) => r[0] + r.slice(1).join(" ")).join("");
}
const O1 = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
};
function ND(e, t, r) {
  if (e[r].length > 7) {
    e[r].shift();
    const n = e[r];
    let i = r;
    for (; n.length; )
      t[r] = "A", e.splice(i += 1, 0, ["C"].concat(n.splice(0, 6)));
    e.splice(r, 1);
  }
}
const Os = {
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
function E1(e) {
  return Array.isArray(e) && e.every((t) => {
    const r = t[0].toLowerCase();
    return Os[r] === t.length - 1 && "achlmqstvz".includes(r);
  });
}
function S1(e) {
  return E1(e) && // @ts-ignore -- `isPathArray` also checks if it's `Array`
  e.every(([t]) => t === t.toUpperCase());
}
function x1(e) {
  return S1(e) && e.every(([t]) => "ACLMQZ".includes(t));
}
function Ld(e) {
  let t = e.pathValue[e.segmentStart], r = t.toLowerCase();
  const { data: n } = e;
  for (; n.length >= Os[r] && (r === "m" && n.length > 2 ? (e.segments.push([t].concat(n.splice(0, 2))), r = "l", t = t === "m" ? "l" : "L") : e.segments.push([t].concat(n.splice(0, Os[r]))), !!Os[r]); )
    ;
}
function $D(e) {
  const { index: t, pathValue: r } = e, n = r.charCodeAt(t);
  if (n === 48) {
    e.param = 0, e.index += 1;
    return;
  }
  if (n === 49) {
    e.param = 1, e.index += 1;
    return;
  }
  e.err = `[path-util]: invalid Arc flag "${r[t]}", expecting 0 or 1 at index ${t}`;
}
function MD(e) {
  return e >= 48 && e <= 57 || e === 43 || e === 45 || e === 46;
}
function ai(e) {
  return e >= 48 && e <= 57;
}
function ID(e) {
  const { max: t, pathValue: r, index: n } = e;
  let i = n, s = !1, o = !1, a = !1, u = !1, f;
  if (i >= t) {
    e.err = `[path-util]: Invalid path value at index ${i}, "pathValue" is missing param`;
    return;
  }
  if (f = r.charCodeAt(i), (f === 43 || f === 45) && (i += 1, f = r.charCodeAt(i)), !ai(f) && f !== 46) {
    e.err = `[path-util]: Invalid path value at index ${i}, "${r[i]}" is not a number`;
    return;
  }
  if (f !== 46) {
    if (s = f === 48, i += 1, f = r.charCodeAt(i), s && i < t && f && ai(f)) {
      e.err = `[path-util]: Invalid path value at index ${n}, "${r[n]}" illegal number`;
      return;
    }
    for (; i < t && ai(r.charCodeAt(i)); )
      i += 1, o = !0;
    f = r.charCodeAt(i);
  }
  if (f === 46) {
    for (u = !0, i += 1; ai(r.charCodeAt(i)); )
      i += 1, a = !0;
    f = r.charCodeAt(i);
  }
  if (f === 101 || f === 69) {
    if (u && !o && !a) {
      e.err = `[path-util]: Invalid path value at index ${i}, "${r[i]}" invalid float exponent`;
      return;
    }
    if (i += 1, f = r.charCodeAt(i), (f === 43 || f === 45) && (i += 1), i < t && ai(r.charCodeAt(i)))
      for (; i < t && ai(r.charCodeAt(i)); )
        i += 1;
    else {
      e.err = `[path-util]: Invalid path value at index ${i}, "${r[i]}" invalid integer exponent`;
      return;
    }
  }
  e.index = i, e.param = +e.pathValue.slice(n, i);
}
function DD(e) {
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
function ya(e) {
  const { pathValue: t, max: r } = e;
  for (; e.index < r && DD(t.charCodeAt(e.index)); )
    e.index += 1;
}
function CD(e) {
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
function LD(e) {
  return (e | 32) === 97;
}
function jD(e) {
  const { max: t, pathValue: r, index: n } = e, i = r.charCodeAt(n), s = Os[r[n].toLowerCase()];
  if (e.segmentStart = n, !CD(i)) {
    e.err = `[path-util]: Invalid path value "${r[n]}" is not a path command`;
    return;
  }
  if (e.index += 1, ya(e), e.data = [], !s) {
    Ld(e);
    return;
  }
  for (; ; ) {
    for (let o = s; o > 0; o -= 1) {
      if (LD(i) && (o === 3 || o === 4) ? $D(e) : ID(e), e.err.length)
        return;
      e.data.push(e.param), ya(e), e.index < t && r.charCodeAt(e.index) === 44 && (e.index += 1, ya(e));
    }
    if (e.index >= e.max || !MD(r.charCodeAt(e.index)))
      break;
  }
  Ld(e);
}
class FD {
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
function hh(e) {
  if (E1(e))
    return Xi(e);
  const t = new FD(e);
  for (ya(t); t.index < t.max && !t.err.length; )
    jD(t);
  return t.err ? t.err : t.segments;
}
function R1(e) {
  if (S1(e))
    return Xi(e);
  const t = hh(e);
  let r = 0, n = 0, i = 0, s = 0;
  return t.map((o) => {
    const a = o.slice(1).map(Number), [u] = o, f = u.toUpperCase();
    if (u === "M")
      return [r, n] = a, i = r, s = n, ["M", r, n];
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
            a[5] + r,
            a[6] + n
          ];
          break;
        case "V":
          c = [f, a[0] + n];
          break;
        case "H":
          c = [f, a[0] + r];
          break;
        default: {
          const h = a.map((d, _) => d + (_ % 2 ? n : r));
          c = [f].concat(h);
        }
      }
    else
      c = [f].concat(a);
    const l = c.length;
    switch (f) {
      case "Z":
        r = i, n = s;
        break;
      case "H":
        [, r] = c;
        break;
      case "V":
        [, n] = c;
        break;
      default:
        r = c[l - 2], n = c[l - 1], f === "M" && (i = r, s = n);
    }
    return c;
  });
}
function BD(e, t) {
  const [r] = e, { x1: n, y1: i, x2: s, y2: o } = t, a = e.slice(1).map(Number);
  let u = e;
  if ("TQ".includes(r) || (t.qx = null, t.qy = null), r === "H")
    u = ["L", e[1], i];
  else if (r === "V")
    u = ["L", n, e[1]];
  else if (r === "S") {
    const f = n * 2 - s, c = i * 2 - o;
    t.x1 = f, t.y1 = c, u = ["C", f, c].concat(a);
  } else if (r === "T") {
    const f = n * 2 - t.qx, c = i * 2 - t.qy;
    t.qx = f, t.qy = c, u = ["Q", f, c].concat(a);
  } else if (r === "Q") {
    const [f, c] = a;
    t.qx = f, t.qy = c;
  }
  return u;
}
function Fu(e) {
  if (x1(e))
    return Xi(e);
  const t = R1(e), r = { ...O1 }, n = t.length;
  let i = "";
  for (let s = 0; s < n; s += 1) {
    [i] = t[s], t[s] = BD(t[s], r);
    const o = t[s], a = o.length;
    r.x1 = +o[a - 2], r.y1 = +o[a - 1], r.x2 = +o[a - 4] || r.x1, r.y2 = +o[a - 3] || r.y1;
  }
  return t;
}
function zD(e) {
  return x1(e) && e.every(([t]) => "MC".includes(t));
}
function ta(e, t, r) {
  const n = e * Math.cos(r) - t * Math.sin(r), i = e * Math.sin(r) + t * Math.cos(r);
  return { x: n, y: i };
}
function T1(e, t, r, n, i, s, o, a, u, f) {
  let c = e, l = t, h = r, d = n, _ = a, v = u;
  const g = Math.PI * 120 / 180, y = Math.PI / 180 * (+i || 0);
  let b = [], w, m, A, S, T;
  if (f)
    [m, A, S, T] = f;
  else {
    w = ta(c, l, -y), c = w.x, l = w.y, w = ta(_, v, -y), _ = w.x, v = w.y;
    const ye = (c - _) / 2, qt = (l - v) / 2;
    let An = ye * ye / (h * h) + qt * qt / (d * d);
    An > 1 && (An = Math.sqrt(An), h *= An, d *= An);
    const bf = h * h, mf = d * d, Sp = (s === o ? -1 : 1) * Math.sqrt(Math.abs((bf * mf - bf * qt * qt - mf * ye * ye) / (bf * qt * qt + mf * ye * ye)));
    S = Sp * h * qt / d + (c + _) / 2, T = Sp * -d * ye / h + (l + v) / 2, m = Math.asin(((l - T) / d * 10 ** 9 >> 0) / 10 ** 9), A = Math.asin(((v - T) / d * 10 ** 9 >> 0) / 10 ** 9), m = c < S ? Math.PI - m : m, A = _ < S ? Math.PI - A : A, m < 0 && (m = Math.PI * 2 + m), A < 0 && (A = Math.PI * 2 + A), o && m > A && (m -= Math.PI * 2), !o && A > m && (A -= Math.PI * 2);
  }
  let F = A - m;
  if (Math.abs(F) > g) {
    const ye = A, qt = _, An = v;
    A = m + g * (o && A > m ? 1 : -1), _ = S + h * Math.cos(A), v = T + d * Math.sin(A), b = T1(_, v, h, d, i, 0, o, qt, An, [A, ye, S, T]);
  }
  F = A - m;
  const Rr = Math.cos(m), Ko = Math.sin(m), nr = Math.cos(A), Yo = Math.sin(A), as = Math.tan(F / 4), Xo = 4 / 3 * h * as, Jo = 4 / 3 * d * as, Tr = [c, l], Pr = [c + Xo * Ko, l - Jo * Rr], us = [_ + Xo * Yo, v - Jo * nr], fs = [_, v];
  if (Pr[0] = 2 * Tr[0] - Pr[0], Pr[1] = 2 * Tr[1] - Pr[1], f)
    return Pr.concat(us, fs, b);
  b = Pr.concat(us, fs, b);
  const yf = [];
  for (let ye = 0, qt = b.length; ye < qt; ye += 1)
    yf[ye] = ye % 2 ? ta(b[ye - 1], b[ye], y).y : ta(b[ye], b[ye + 1], y).x;
  return yf;
}
function UD(e, t, r, n, i, s) {
  const o = 0.3333333333333333, a = 2 / 3;
  return [
    o * e + a * r,
    // cpx1
    o * t + a * n,
    // cpy1
    o * i + a * r,
    // cpx2
    o * s + a * n,
    // cpy2
    i,
    s
    // x,y
  ];
}
function Tt(e, t, r) {
  const n = e[0], i = e[1], s = t[0], o = t[1];
  return [n + (s - n) * r, i + (o - i) * r];
}
function Ji(e, t) {
  return Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1]));
}
function Us(e, t, r, n, i) {
  const s = Ji([e, t], [r, n]);
  let o = { x: 0, y: 0 };
  if (typeof i == "number")
    if (i <= 0)
      o = { x: e, y: t };
    else if (i >= s)
      o = { x: r, y: n };
    else {
      const [a, u] = Tt([e, t], [r, n], i / s);
      o = { x: a, y: u };
    }
  return {
    length: s,
    point: o,
    min: {
      x: Math.min(e, r),
      y: Math.min(t, n)
    },
    max: {
      x: Math.max(e, r),
      y: Math.max(t, n)
    }
  };
}
function jd(e, t, r, n) {
  const s = [e, t], o = [r, n], a = Tt(s, o, 0.5), u = Tt(o, a, 0.5), f = Tt(a, u, 0.5), c = Tt(u, f, 0.5), l = Tt(f, c, 0.5), h = Us(s[0], s[1], a[0], a[1], f[0]).point, d = Us(l[0], l[1], c[0], c[1], u[0]).point;
  return [h.x, h.y, d.x, d.y, r, n];
}
function VD(e, t) {
  const [r] = e, n = e.slice(1).map(Number), [i, s] = n;
  let o;
  const { x1: a, y1: u, x: f, y: c } = t;
  switch ("TQ".includes(r) || (t.qx = null, t.qy = null), r) {
    case "M":
      return t.x = i, t.y = s, e;
    case "A":
      return o = [a, u].concat(n), ["C"].concat(
        T1(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9])
      );
    case "Q":
      return t.qx = i, t.qy = s, o = [a, u].concat(n), ["C"].concat(UD(o[0], o[1], o[2], o[3], o[4], o[5]));
    case "L":
      return ["C"].concat(jd(a, u, i, s));
    case "Z":
      return a === f && u === c ? ["C", a, u, f, c, f, c] : ["C"].concat(jd(a, u, f, c));
  }
  return e;
}
function P1(e, t = !1) {
  if (zD(e)) {
    const c = Xi(e);
    return t ? [c, []] : c;
  }
  const r = Fu(e), n = { ...O1 }, i = [];
  let s = "", o = r.length, a, u;
  const f = [];
  for (let c = 0; c < o; c += 1) {
    r[c] && ([s] = r[c]), i[c] = s;
    const l = VD(r[c], n);
    r[c] = l, ND(r, i, c), o = r.length, s === "Z" && f.push(c), a = r[c], u = a.length, n.x1 = +a[u - 2], n.y1 = +a[u - 1], n.x2 = +a[u - 4] || n.x1, n.y2 = +a[u - 3] || n.y1;
  }
  return t ? [r, f] : r;
}
function kD(e) {
  const t = e.slice(1).map(
    (r, n, i) => (
      // @ts-ignore
      n ? i[n - 1].slice(-2).concat(r.slice(1)) : e[0].slice(1).concat(r.slice(1))
    )
  ).map((r) => r.map((n, i) => r[r.length - i - 2 * (1 - i % 2)])).reverse();
  return [["M"].concat(t[0].slice(0, 2))].concat(
    t.map((r) => ["C"].concat(r.slice(2)))
  );
}
function Fd(e, t) {
  const { x: r, y: n } = e, { x: i, y: s } = t, o = r * i + n * s, a = Math.sqrt((r ** 2 + n ** 2) * (i ** 2 + s ** 2));
  return (r * s - n * i < 0 ? -1 : 1) * Math.acos(o / a);
}
function WD(e, t, r, n, i, s, o, a, u, f) {
  const { abs: c, sin: l, cos: h, sqrt: d, PI: _ } = Math;
  let v = c(r), g = c(n);
  const b = (i % 360 + 360) % 360 * (_ / 180);
  if (e === a && t === u)
    return { x: e, y: t };
  if (v === 0 || g === 0)
    return Us(e, t, a, u, f).point;
  const w = (e - a) / 2, m = (t - u) / 2, A = {
    x: h(b) * w + l(b) * m,
    y: -l(b) * w + h(b) * m
  }, S = A.x ** 2 / v ** 2 + A.y ** 2 / g ** 2;
  S > 1 && (v *= d(S), g *= d(S));
  const T = v ** 2 * g ** 2 - v ** 2 * A.y ** 2 - g ** 2 * A.x ** 2, F = v ** 2 * A.y ** 2 + g ** 2 * A.x ** 2;
  let Rr = T / F;
  Rr = Rr < 0 ? 0 : Rr;
  const Ko = (s !== o ? 1 : -1) * d(Rr), nr = {
    x: Ko * (v * A.y / g),
    y: Ko * (-(g * A.x) / v)
  }, Yo = {
    x: h(b) * nr.x - l(b) * nr.y + (e + a) / 2,
    y: l(b) * nr.x + h(b) * nr.y + (t + u) / 2
  }, as = {
    x: (A.x - nr.x) / v,
    y: (A.y - nr.y) / g
  }, Xo = Fd({ x: 1, y: 0 }, as), Jo = {
    x: (-A.x - nr.x) / v,
    y: (-A.y - nr.y) / g
  };
  let Tr = Fd(as, Jo);
  !o && Tr > 0 ? Tr -= 2 * _ : o && Tr < 0 && (Tr += 2 * _), Tr %= 2 * _;
  const Pr = Xo + Tr * f, us = v * h(Pr), fs = g * l(Pr);
  return {
    x: h(b) * us - l(b) * fs + Yo.x,
    y: l(b) * us + h(b) * fs + Yo.y
  };
}
function qD(e, t, r, n, i, s, o, a, u, f) {
  const c = typeof f == "number";
  let l = e, h = t, d = 0, _ = [l, h, d], v = [l, h], g = 0, y = { x: 0, y: 0 }, b = [{ x: l, y: h }];
  c && f <= 0 && (y = { x: l, y: h });
  const w = 100;
  for (let m = 0; m <= w; m += 1) {
    if (g = m / w, { x: l, y: h } = WD(e, t, r, n, i, s, o, a, u, g), b = b.concat({ x: l, y: h }), d += Ji(v, [l, h]), v = [l, h], c && d >= f && f > _[2]) {
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
function GD(e, t, r, n, i, s, o, a, u) {
  const f = 1 - u;
  return {
    x: f ** 3 * e + 3 * f ** 2 * u * r + 3 * f * u ** 2 * i + u ** 3 * o,
    y: f ** 3 * t + 3 * f ** 2 * u * n + 3 * f * u ** 2 * s + u ** 3 * a
  };
}
function N1(e, t, r, n, i, s, o, a, u) {
  const f = typeof u == "number";
  let c = e, l = t, h = 0, d = [c, l, h], _ = [c, l], v = 0, g = { x: 0, y: 0 }, y = [{ x: c, y: l }];
  f && u <= 0 && (g = { x: c, y: l });
  const b = 30;
  for (let w = 0; w <= b; w += 1) {
    if (v = w / b, { x: c, y: l } = GD(e, t, r, n, i, s, o, a, v), y = y.concat({ x: c, y: l }), h += Ji(_, [c, l]), _ = [c, l], f && h >= u && u > d[2]) {
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
function HD(e, t, r, n, i, s, o) {
  const a = 1 - o;
  return {
    x: a ** 2 * e + 2 * a * o * r + o ** 2 * i,
    y: a ** 2 * t + 2 * a * o * n + o ** 2 * s
  };
}
function KD(e, t, r, n, i, s, o) {
  const a = typeof o == "number";
  let u = e, f = t, c = 0, l = [u, f, c], h = [u, f], d = 0, _ = { x: 0, y: 0 }, v = [{ x: u, y: f }];
  a && o <= 0 && (_ = { x: u, y: f });
  const g = 30;
  for (let y = 0; y <= g; y += 1) {
    if (d = y / g, { x: u, y: f } = HD(e, t, r, n, i, s, d), v = v.concat({ x: u, y: f }), c += Ji(h, [u, f]), h = [u, f], a && c >= o && o > l[2]) {
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
function Bu(e, t) {
  const r = Fu(e), n = typeof t == "number";
  let i, s = [], o, a = 0, u = 0, f = 0, c = 0, l, h = [], d = [], _ = 0, v = { x: 0, y: 0 }, g = v, y = v, b = v, w = 0;
  for (let m = 0, A = r.length; m < A; m += 1)
    l = r[m], [o] = l, i = o === "M", s = i ? s : [a, u].concat(l.slice(1)), i ? ([, f, c] = l, v = { x: f, y: c }, g = v, _ = 0, n && t < 1e-3 && (b = v)) : o === "L" ? { length: _, min: v, max: g, point: y } = Us(s[0], s[1], s[2], s[3], (t || 0) - w) : o === "A" ? { length: _, min: v, max: g, point: y } = qD(
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
    ) : o === "C" ? { length: _, min: v, max: g, point: y } = N1(
      s[0],
      s[1],
      s[2],
      s[3],
      s[4],
      s[5],
      s[6],
      s[7],
      (t || 0) - w
    ) : o === "Q" ? { length: _, min: v, max: g, point: y } = KD(
      s[0],
      s[1],
      s[2],
      s[3],
      s[4],
      s[5],
      (t || 0) - w
    ) : o === "Z" && (s = [a, u, f, c], { length: _, min: v, max: g, point: y } = Us(s[0], s[1], s[2], s[3], (t || 0) - w)), n && w < t && w + _ >= t && (b = y), d.push(g), h.push(v), w += _, [a, u] = o !== "Z" ? l.slice(-2) : [f, c];
  return n && t >= w && (b = { x: a, y: u }), {
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
function YD(e) {
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
    min: { x: t, y: r },
    max: { x: n, y: i }
  } = Bu(e), s = n - t, o = i - r;
  return {
    width: s,
    height: o,
    x: t,
    y: r,
    x2: n,
    y2: i,
    cx: t + s / 2,
    cy: r + o / 2,
    // an estimted guess
    cz: Math.max(s, o) + Math.min(s, o) / 2
  };
}
function Es(e) {
  return Bu(e).length;
}
function XD(e) {
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
    min: { x: r, y: n },
    max: { x: i, y: s }
  } = Bu(e), o = i - r, a = s - n;
  return {
    length: t,
    width: o,
    height: a,
    x: r,
    y: n,
    x2: i,
    y2: s,
    cx: r + o / 2,
    cy: n + a / 2,
    // an estimted guess
    cz: Math.max(o, a) + Math.min(o, a) / 2
  };
}
function JD(e) {
  const t = e.length, r = t - 1;
  return e.map(
    (n, i) => e.map((s, o) => {
      let a = i + o, u;
      return o === 0 || e[a] && e[a][0] === "M" ? (u = e[a], ["M"].concat(u.slice(-2))) : (a >= t && (a -= r), e[a]);
    })
  );
}
function ZD(e, t) {
  const r = e.length - 1, n = [];
  let i = 0, s = 0;
  const o = JD(e);
  return o.forEach((a, u) => {
    e.slice(1).forEach((f, c) => {
      s += Ji(e[(u + c) % r].slice(-2), t[c % r].slice(-2));
    }), n[u] = s, s = 0;
  }), i = n.indexOf(Math.min.apply(null, n)), o[i];
}
function QD(e, t, r, n, i, s, o, a) {
  return 3 * ((a - t) * (r + i) - (o - e) * (n + s) + n * (e - i) - r * (t - s) + a * (i + e / 3) - o * (s + t / 3)) / 20;
}
function $1(e) {
  let t = 0, r = 0, n = 0;
  return P1(e).map((i) => {
    switch (i[0]) {
      case "M":
        return [, t, r] = i, 0;
      default:
        const [s, o, a, u, f, c] = i.slice(1);
        return n = QD(t, r, s, o, a, u, f, c), [t, r] = i.slice(-2), n;
    }
  }).reduce((i, s) => i + s, 0);
}
function eC(e) {
  return $1(e) >= 0;
}
function ba(e, t) {
  return Bu(e, t).point;
}
function tC(e, t) {
  const r = hh(e);
  if (typeof r == "string")
    throw TypeError(r);
  let n = r.slice(), i = Es(n), s = n.length - 1, o = 0, a = 0, u = r[0];
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
    return n = r.slice(0, -1), o = Es(n), a = i - o, {
      segment: r[s],
      index: s,
      length: a,
      lengthAtSegment: o
    };
  const h = [];
  for (; s > 0; )
    u = n[s], n = n.slice(0, -1), o = Es(n), a = i - o, i = o, h.push({
      segment: u,
      index: s,
      length: a,
      lengthAtSegment: o
    }), s -= 1;
  return h.find(({ lengthAtSegment: d }) => d <= t);
}
function rC(e, t) {
  const r = hh(e), n = Fu(r), i = Es(r), s = (m) => {
    const A = m.x - t.x, S = m.y - t.y;
    return A * A + S * S;
  };
  let o = 8, a, u = 0, f = { x: 0, y: 0 }, c = 0, l = 1 / 0;
  for (let m = 0; m <= i; m += o)
    a = ba(n, m), u = s(a), u < l && (f = a, c = m, l = u);
  o /= 2;
  let h, d, _ = 0, v = 0, g = 0, y = 0;
  for (; o > 0.5; )
    _ = c - o, h = ba(n, _), g = s(h), v = c + o, d = ba(n, v), y = s(d), _ >= 0 && g < l ? (f = h, c = _, l = g) : v <= i && y < l ? (f = d, c = v, l = y) : o /= 2;
  const b = tC(r, c), w = Math.sqrt(l);
  return { closest: f, distance: w, segment: b };
}
function nC(e, t) {
  const { distance: r } = rC(e, t);
  return Math.abs(r) < 1e-3;
}
function iC(e, t = 0.5) {
  const r = e.slice(0, 2), n = e.slice(2, 4), i = e.slice(4, 6), s = e.slice(6, 8), o = Tt(r, n, t), a = Tt(n, i, t), u = Tt(i, s, t), f = Tt(o, a, t), c = Tt(a, u, t), l = Tt(f, c, t);
  return [
    // @ts-ignore
    ["C"].concat(o, f, l),
    // @ts-ignore
    ["C"].concat(c, u, s)
  ];
}
function Bd(e) {
  return e.map((t, r, n) => {
    const i = r && n[r - 1].slice(-2).concat(t.slice(1)), s = r ? N1(
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
    return r ? o = s ? iC(i) : [t, t] : o = [t], {
      s: t,
      ss: o,
      l: s
    };
  });
}
function M1(e, t, r) {
  const n = Bd(e), i = Bd(t), s = n.length, o = i.length, a = n.filter((g) => g.l).length, u = i.filter((g) => g.l).length, f = n.filter((g) => g.l).reduce((g, { l: y }) => g + y, 0) / a || 0, c = i.filter((g) => g.l).reduce((g, { l: y }) => g + y, 0) / u || 0, l = r || Math.max(s, o), h = [f, c], d = [l - s, l - o];
  let _ = 0;
  const v = [n, i].map(
    (g, y) => (
      // @ts-ignore
      g.l === l ? g.map((b) => b.s) : g.map((b, w) => (_ = w && d[y] && b.l >= h[y], d[y] -= _ ? 1 : 0, _ ? b.ss : [b.s])).flat()
    )
  );
  return v[0].length === v[1].length ? v : M1(v[0], v[1], l);
}
const Kz = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angleTo: xD,
  clonePath: Xi,
  direction: A1,
  distanceSquareRoot: Ji,
  equalizeSegments: M1,
  getDrawDirection: eC,
  getPathArea: $1,
  getPathBBox: YD,
  getPathBBoxTotalLength: XD,
  getPointAtLength: ba,
  getRotatedCurve: ZD,
  getTotalLength: Es,
  gradient: cD,
  isPointInStroke: nC,
  normalizePath: Fu,
  path2Absolute: R1,
  path2Curve: P1,
  path2String: PD,
  reverseCurve: kD,
  rgb2arr: b1,
  toCSSGradient: _D,
  toRGB: w1,
  transform: SD,
  vertical: RD
}, Symbol.toStringTag, { value: "Module" }));
var zu = Symbol.for("immer-nothing"), bi = Symbol.for("immer-draftable"), U = Symbol.for("immer-state"), I1 = process.env.NODE_ENV !== "production" ? [
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
    const r = I1[e], n = typeof r == "function" ? r.apply(null, t) : r;
    throw new Error(`[Immer] ${n}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var In = Object.getPrototypeOf;
function zr(e) {
  return !!e && !!e[U];
}
function er(e) {
  return e ? D1(e) || Array.isArray(e) || !!e[bi] || !!e.constructor?.[bi] || So(e) || xo(e) : !1;
}
var sC = Object.prototype.constructor.toString();
function D1(e) {
  if (!e || typeof e != "object")
    return !1;
  const t = In(e);
  if (t === null)
    return !0;
  const r = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return r === Object ? !0 : typeof r == "function" && Function.toString.call(r) === sC;
}
function oC(e) {
  return zr(e) || ce(15, e), e[U].base_;
}
function xi(e, t) {
  Dn(e) === 0 ? Reflect.ownKeys(e).forEach((r) => {
    t(r, e[r], e);
  }) : e.forEach((r, n) => t(n, r, e));
}
function Dn(e) {
  const t = e[U];
  return t ? t.type_ : Array.isArray(e) ? 1 : So(e) ? 2 : xo(e) ? 3 : 0;
}
function Vs(e, t) {
  return Dn(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function Pf(e, t) {
  return Dn(e) === 2 ? e.get(t) : e[t];
}
function C1(e, t, r) {
  const n = Dn(e);
  n === 2 ? e.set(t, r) : n === 3 ? e.add(r) : e[t] = r;
}
function aC(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function So(e) {
  return e instanceof Map;
}
function xo(e) {
  return e instanceof Set;
}
function be(e) {
  return e.copy_ || e.base_;
}
function mc(e, t) {
  if (So(e))
    return new Map(e);
  if (xo(e))
    return new Set(e);
  if (Array.isArray(e))
    return Array.prototype.slice.call(e);
  const r = D1(e);
  if (t === !0 || t === "class_only" && !r) {
    const n = Object.getOwnPropertyDescriptors(e);
    delete n[U];
    let i = Reflect.ownKeys(n);
    for (let s = 0; s < i.length; s++) {
      const o = i[s], a = n[o];
      a.writable === !1 && (a.writable = !0, a.configurable = !0), (a.get || a.set) && (n[o] = {
        configurable: !0,
        writable: !0,
        // could live with !!desc.set as well here...
        enumerable: a.enumerable,
        value: e[o]
      });
    }
    return Object.create(In(e), n);
  } else {
    const n = In(e);
    if (n !== null && r)
      return { ...e };
    const i = Object.create(n);
    return Object.assign(i, e);
  }
}
function Uu(e, t = !1) {
  return Vu(e) || zr(e) || !er(e) || (Dn(e) > 1 && (e.set = e.add = e.clear = e.delete = uC), Object.freeze(e), t && Object.entries(e).forEach(([r, n]) => Uu(n, !0))), e;
}
function uC() {
  ce(2);
}
function Vu(e) {
  return Object.isFrozen(e);
}
var wc = {};
function Cn(e) {
  const t = wc[e];
  return t || ce(0, e), t;
}
function L1(e, t) {
  wc[e] || (wc[e] = t);
}
var ks;
function $a() {
  return ks;
}
function fC(e, t) {
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
function zd(e, t) {
  t && (Cn("Patches"), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function Ac(e) {
  Oc(e), e.drafts_.forEach(cC), e.drafts_ = null;
}
function Oc(e) {
  e === ks && (ks = e.parent_);
}
function Ud(e) {
  return ks = fC(ks, e);
}
function cC(e) {
  const t = e[U];
  t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function Vd(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const r = t.drafts_[0];
  return e !== void 0 && e !== r ? (r[U].modified_ && (Ac(t), ce(4)), er(e) && (e = Ma(t, e), t.parent_ || Ia(t, e)), t.patches_ && Cn("Patches").generateReplacementPatches_(
    r[U].base_,
    e,
    t.patches_,
    t.inversePatches_
  )) : e = Ma(t, r, []), Ac(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== zu ? e : void 0;
}
function Ma(e, t, r) {
  if (Vu(t))
    return t;
  const n = t[U];
  if (!n)
    return xi(
      t,
      (i, s) => kd(e, n, t, i, s, r)
    ), t;
  if (n.scope_ !== e)
    return t;
  if (!n.modified_)
    return Ia(e, n.base_, !0), n.base_;
  if (!n.finalized_) {
    n.finalized_ = !0, n.scope_.unfinalizedDrafts_--;
    const i = n.copy_;
    let s = i, o = !1;
    n.type_ === 3 && (s = new Set(i), i.clear(), o = !0), xi(
      s,
      (a, u) => kd(e, n, i, a, u, r, o)
    ), Ia(e, i, !1), r && e.patches_ && Cn("Patches").generatePatches_(
      n,
      r,
      e.patches_,
      e.inversePatches_
    );
  }
  return n.copy_;
}
function kd(e, t, r, n, i, s, o) {
  if (process.env.NODE_ENV !== "production" && i === r && ce(5), zr(i)) {
    const a = s && t && t.type_ !== 3 && // Set objects are atomic since they have no keys.
    !Vs(t.assigned_, n) ? s.concat(n) : void 0, u = Ma(e, i, a);
    if (C1(r, n, u), zr(u))
      e.canAutoFreeze_ = !1;
    else
      return;
  } else o && r.add(i);
  if (er(i) && !Vu(i)) {
    if (!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1)
      return;
    Ma(e, i), (!t || !t.scope_.parent_) && typeof n != "symbol" && Object.prototype.propertyIsEnumerable.call(r, n) && Ia(e, i);
  }
}
function Ia(e, t, r = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && Uu(t, r);
}
function lC(e, t) {
  const r = Array.isArray(e), n = {
    type_: r ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: t ? t.scope_ : $a(),
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
  let i = n, s = ph;
  r && (i = [n], s = Ws);
  const { revoke: o, proxy: a } = Proxy.revocable(i, s);
  return n.draft_ = a, n.revoke_ = o, a;
}
var ph = {
  get(e, t) {
    if (t === U)
      return e;
    const r = be(e);
    if (!Vs(r, t))
      return hC(e, r, t);
    const n = r[t];
    return e.finalized_ || !er(n) ? n : n === Nf(e.base_, t) ? ($f(e), e.copy_[t] = qs(n, e)) : n;
  },
  has(e, t) {
    return t in be(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(be(e));
  },
  set(e, t, r) {
    const n = j1(be(e), t);
    if (n?.set)
      return n.set.call(e.draft_, r), !0;
    if (!e.modified_) {
      const i = Nf(be(e), t), s = i?.[U];
      if (s && s.base_ === r)
        return e.copy_[t] = r, e.assigned_[t] = !1, !0;
      if (aC(r, i) && (r !== void 0 || Vs(e.base_, t)))
        return !0;
      $f(e), Mr(e);
    }
    return e.copy_[t] === r && // special case: handle new props with value 'undefined'
    (r !== void 0 || t in e.copy_) || // special case: NaN
    Number.isNaN(r) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = r, e.assigned_[t] = !0), !0;
  },
  deleteProperty(e, t) {
    return Nf(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_[t] = !1, $f(e), Mr(e)) : delete e.assigned_[t], e.copy_ && delete e.copy_[t], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(e, t) {
    const r = be(e), n = Reflect.getOwnPropertyDescriptor(r, t);
    return n && {
      writable: !0,
      configurable: e.type_ !== 1 || t !== "length",
      enumerable: n.enumerable,
      value: r[t]
    };
  },
  defineProperty() {
    ce(11);
  },
  getPrototypeOf(e) {
    return In(e.base_);
  },
  setPrototypeOf() {
    ce(12);
  }
}, Ws = {};
xi(ph, (e, t) => {
  Ws[e] = function() {
    return arguments[0] = arguments[0][0], t.apply(this, arguments);
  };
});
Ws.deleteProperty = function(e, t) {
  return process.env.NODE_ENV !== "production" && isNaN(parseInt(t)) && ce(13), Ws.set.call(this, e, t, void 0);
};
Ws.set = function(e, t, r) {
  return process.env.NODE_ENV !== "production" && t !== "length" && isNaN(parseInt(t)) && ce(14), ph.set.call(this, e[0], t, r, e[0]);
};
function Nf(e, t) {
  const r = e[U];
  return (r ? be(r) : e)[t];
}
function hC(e, t, r) {
  const n = j1(t, r);
  return n ? "value" in n ? n.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    n.get?.call(e.draft_)
  ) : void 0;
}
function j1(e, t) {
  if (!(t in e))
    return;
  let r = In(e);
  for (; r; ) {
    const n = Object.getOwnPropertyDescriptor(r, t);
    if (n)
      return n;
    r = In(r);
  }
}
function Mr(e) {
  e.modified_ || (e.modified_ = !0, e.parent_ && Mr(e.parent_));
}
function $f(e) {
  e.copy_ || (e.copy_ = mc(
    e.base_,
    e.scope_.immer_.useStrictShallowCopy_
  ));
}
var F1 = class {
  constructor(e) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.produce = (t, r, n) => {
      if (typeof t == "function" && typeof r != "function") {
        const s = r;
        r = t;
        const o = this;
        return function(u = s, ...f) {
          return o.produce(u, (c) => r.call(this, c, ...f));
        };
      }
      typeof r != "function" && ce(6), n !== void 0 && typeof n != "function" && ce(7);
      let i;
      if (er(t)) {
        const s = Ud(this), o = qs(t, void 0);
        let a = !0;
        try {
          i = r(o), a = !1;
        } finally {
          a ? Ac(s) : Oc(s);
        }
        return zd(s, n), Vd(i, s);
      } else if (!t || typeof t != "object") {
        if (i = r(t), i === void 0 && (i = t), i === zu && (i = void 0), this.autoFreeze_ && Uu(i, !0), n) {
          const s = [], o = [];
          Cn("Patches").generateReplacementPatches_(t, i, s, o), n(s, o);
        }
        return i;
      } else
        ce(1, t);
    }, this.produceWithPatches = (t, r) => {
      if (typeof t == "function")
        return (o, ...a) => this.produceWithPatches(o, (u) => t(u, ...a));
      let n, i;
      return [this.produce(t, r, (o, a) => {
        n = o, i = a;
      }), n, i];
    }, typeof e?.autoFreeze == "boolean" && this.setAutoFreeze(e.autoFreeze), typeof e?.useStrictShallowCopy == "boolean" && this.setUseStrictShallowCopy(e.useStrictShallowCopy);
  }
  createDraft(e) {
    er(e) || ce(8), zr(e) && (e = B1(e));
    const t = Ud(this), r = qs(e, void 0);
    return r[U].isManual_ = !0, Oc(t), r;
  }
  finishDraft(e, t) {
    const r = e && e[U];
    (!r || !r.isManual_) && ce(9);
    const { scope_: n } = r;
    return zd(n, t), Vd(void 0, n);
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
    let r;
    for (r = t.length - 1; r >= 0; r--) {
      const i = t[r];
      if (i.path.length === 0 && i.op === "replace") {
        e = i.value;
        break;
      }
    }
    r > -1 && (t = t.slice(r + 1));
    const n = Cn("Patches").applyPatches_;
    return zr(e) ? n(e, t) : this.produce(
      e,
      (i) => n(i, t)
    );
  }
};
function qs(e, t) {
  const r = So(e) ? Cn("MapSet").proxyMap_(e, t) : xo(e) ? Cn("MapSet").proxySet_(e, t) : lC(e, t);
  return (t ? t.scope_ : $a()).drafts_.push(r), r;
}
function B1(e) {
  return zr(e) || ce(10, e), z1(e);
}
function z1(e) {
  if (!er(e) || Vu(e))
    return e;
  const t = e[U];
  let r;
  if (t) {
    if (!t.modified_)
      return t.base_;
    t.finalized_ = !0, r = mc(e, t.scope_.immer_.useStrictShallowCopy_);
  } else
    r = mc(e, !0);
  return xi(r, (n, i) => {
    C1(r, n, z1(i));
  }), t && (t.finalized_ = !1), r;
}
function pC() {
  process.env.NODE_ENV !== "production" && I1.push(
    'Sets cannot have "replace" patches.',
    function(h) {
      return "Unsupported patch operation: " + h;
    },
    function(h) {
      return "Cannot apply patch, path doesn't resolve: " + h;
    },
    "Patching reserved attributes like __proto__, prototype and constructor is not allowed"
  );
  const t = "replace", r = "add", n = "remove";
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
        op: r,
        path: m,
        // Need to maybe clone it, as it can in fact be the original value
        // due to the base/copy inversion at the start of this function
        value: l(b[w])
      });
    }
    for (let w = b.length - 1; g.length <= w; --w) {
      const m = d.concat([w]);
      v.push({
        op: n,
        path: m
      });
    }
  }
  function o(h, d, _, v) {
    const { base_: g, copy_: y } = h;
    xi(h.assigned_, (b, w) => {
      const m = Pf(g, b), A = Pf(y, b), S = w ? Vs(g, b) ? t : r : n;
      if (m === A && S === t)
        return;
      const T = d.concat(b);
      _.push(S === n ? { op: S, path: T } : { op: S, path: T, value: A }), v.push(
        S === r ? { op: n, path: T } : S === n ? { op: r, path: T, value: l(m) } : { op: t, path: T, value: l(m) }
      );
    });
  }
  function a(h, d, _, v) {
    let { base_: g, copy_: y } = h, b = 0;
    g.forEach((w) => {
      if (!y.has(w)) {
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
    }), b = 0, y.forEach((w) => {
      if (!g.has(w)) {
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
    });
  }
  function u(h, d, _, v) {
    _.push({
      op: t,
      path: [],
      value: d === zu ? void 0 : d
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
        const S = Dn(y);
        let T = v[A];
        typeof T != "string" && typeof T != "number" && (T = "" + T), (S === 0 || S === 1) && (T === "__proto__" || T === "constructor") && ce(19), typeof y == "function" && T === "prototype" && ce(19), y = Pf(y, T), typeof y != "object" && ce(18, v.join("/"));
      }
      const b = Dn(y), w = c(_.value), m = v[v.length - 1];
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
        case r:
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
        case n:
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
    if (!er(h))
      return h;
    if (Array.isArray(h))
      return h.map(c);
    if (So(h))
      return new Map(
        Array.from(h.entries()).map(([_, v]) => [_, c(v)])
      );
    if (xo(h))
      return new Set(Array.from(h).map(c));
    const d = Object.create(In(h));
    for (const _ in h)
      d[_] = c(h[_]);
    return Vs(h, bi) && (d[bi] = h[bi]), d;
  }
  function l(h) {
    return zr(h) ? c(h) : h;
  }
  L1("Patches", {
    applyPatches_: f,
    generatePatches_: i,
    generateReplacementPatches_: u
  });
}
function dC() {
  class e extends Map {
    constructor(u, f) {
      super(), this[U] = {
        type_: 2,
        parent_: f,
        scope_: f ? f.scope_ : $a(),
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
      return o(c), (!be(c).has(u) || be(c).get(u) !== f) && (r(c), Mr(c), c.assigned_.set(u, !0), c.copy_.set(u, f), c.assigned_.set(u, !0)), this;
    }
    delete(u) {
      if (!this.has(u))
        return !1;
      const f = this[U];
      return o(f), r(f), Mr(f), f.base_.has(u) ? f.assigned_.set(u, !1) : f.assigned_.delete(u), f.copy_.delete(u), !0;
    }
    clear() {
      const u = this[U];
      o(u), be(u).size && (r(u), Mr(u), u.assigned_ = /* @__PURE__ */ new Map(), xi(u.base_, (f) => {
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
      if (f.finalized_ || !er(c) || c !== f.base_.get(u))
        return c;
      const l = qs(c, f);
      return r(f), f.copy_.set(u, l), l;
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
  function r(a) {
    a.copy_ || (a.assigned_ = /* @__PURE__ */ new Map(), a.copy_ = new Map(a.base_));
  }
  class n extends Set {
    constructor(u, f) {
      super(), this[U] = {
        type_: 3,
        parent_: f,
        scope_: f ? f.scope_ : $a(),
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
      return o(f), this.has(u) || (s(f), Mr(f), f.copy_.add(u)), this;
    }
    delete(u) {
      if (!this.has(u))
        return !1;
      const f = this[U];
      return o(f), s(f), Mr(f), f.copy_.delete(u) || (f.drafts_.has(u) ? f.copy_.delete(f.drafts_.get(u)) : (
        /* istanbul ignore next */
        !1
      ));
    }
    clear() {
      const u = this[U];
      o(u), be(u).size && (s(u), Mr(u), u.copy_.clear());
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
    return new n(a, u);
  }
  function s(a) {
    a.copy_ || (a.copy_ = /* @__PURE__ */ new Set(), a.base_.forEach((u) => {
      if (er(u)) {
        const f = qs(u, a);
        a.drafts_.set(u, f), a.copy_.add(f);
      } else
        a.copy_.add(u);
    }));
  }
  function o(a) {
    a.revoked_ && ce(3, JSON.stringify(be(a)));
  }
  L1("MapSet", { proxyMap_: t, proxySet_: i });
}
var At = new F1(), _C = At.produce, vC = At.produceWithPatches.bind(
  At
), gC = At.setAutoFreeze.bind(At), yC = At.setUseStrictShallowCopy.bind(At), bC = At.applyPatches.bind(At), mC = At.createDraft.bind(At), wC = At.finishDraft.bind(At);
function AC(e) {
  return e;
}
function OC(e) {
  return e;
}
const Yz = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Immer: F1,
  applyPatches: bC,
  castDraft: AC,
  castImmutable: OC,
  createDraft: mC,
  current: B1,
  enableMapSet: dC,
  enablePatches: pC,
  finishDraft: wC,
  freeze: Uu,
  immerable: bi,
  isDraft: zr,
  isDraftable: er,
  nothing: zu,
  original: oC,
  produce: _C,
  produceWithPatches: vC,
  setAutoFreeze: gC,
  setUseStrictShallowCopy: yC
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
var Ro = "delete", Y = 5, lt = 1 << Y, Be = lt - 1, L = {};
function Ec() {
  return { value: !1 };
}
function $t(e) {
  e && (e.value = !0);
}
function dh() {
}
function Ri(e) {
  return e.size === void 0 && (e.size = e.__iterate(U1)), e.size;
}
function an(e, t) {
  if (typeof t != "number") {
    var r = t >>> 0;
    if ("" + r !== t || r === 4294967295)
      return NaN;
    t = r;
  }
  return t < 0 ? Ri(e) + t : t;
}
function U1() {
  return !0;
}
function To(e, t, r) {
  return (e === 0 && !k1(e) || r !== void 0 && e <= -r) && (t === void 0 || r !== void 0 && t >= r);
}
function Zi(e, t) {
  return V1(e, t, 0);
}
function Po(e, t) {
  return V1(e, t, t);
}
function V1(e, t, r) {
  return e === void 0 ? r : k1(e) ? t === 1 / 0 ? t : Math.max(0, t + e) | 0 : t === void 0 || t === e ? e : Math.min(t, e) | 0;
}
function k1(e) {
  return e < 0 || e === 0 && 1 / e === -1 / 0;
}
var W1 = "@@__IMMUTABLE_ITERABLE__@@";
function it(e) {
  return !!(e && // @ts-expect-error: maybeCollection is typed as `{}`, need to change in 6.0 to `maybeCollection && typeof maybeCollection === 'object' && IS_COLLECTION_SYMBOL in maybeCollection`
  e[W1]);
}
var Da = "@@__IMMUTABLE_KEYED__@@";
function J(e) {
  return !!(e && // @ts-expect-error: maybeKeyed is typed as `{}`, need to change in 6.0 to `maybeKeyed && typeof maybeKeyed === 'object' && IS_KEYED_SYMBOL in maybeKeyed`
  e[Da]);
}
var Ca = "@@__IMMUTABLE_INDEXED__@@";
function st(e) {
  return !!(e && // @ts-expect-error: maybeIndexed is typed as `{}`, need to change in 6.0 to `maybeIndexed && typeof maybeIndexed === 'object' && IS_INDEXED_SYMBOL in maybeIndexed`
  e[Ca]);
}
function ku(e) {
  return J(e) || st(e);
}
var Oe = function(t) {
  return it(t) ? t : Ce(t);
}, Vt = /* @__PURE__ */ function(e) {
  function t(r) {
    return J(r) ? r : yn(r);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(Oe), Jn = /* @__PURE__ */ function(e) {
  function t(r) {
    return st(r) ? r : Wt(r);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(Oe), Qi = /* @__PURE__ */ function(e) {
  function t(r) {
    return it(r) && !ku(r) ? r : rs(r);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t;
}(Oe);
Oe.Keyed = Vt;
Oe.Indexed = Jn;
Oe.Set = Qi;
var q1 = "@@__IMMUTABLE_SEQ__@@";
function Wu(e) {
  return !!(e && // @ts-expect-error: maybeSeq is typed as `{}`, need to change in 6.0 to `maybeSeq && typeof maybeSeq === 'object' && MAYBE_SEQ_SYMBOL in maybeSeq`
  e[q1]);
}
var G1 = "@@__IMMUTABLE_RECORD__@@";
function gn(e) {
  return !!(e && // @ts-expect-error: maybeRecord is typed as `{}`, need to change in 6.0 to `maybeRecord && typeof maybeRecord === 'object' && IS_RECORD_SYMBOL in maybeRecord`
  e[G1]);
}
function kt(e) {
  return it(e) || gn(e);
}
var un = "@@__IMMUTABLE_ORDERED__@@";
function Yt(e) {
  return !!(e && // @ts-expect-error: maybeOrdered is typed as `{}`, need to change in 6.0 to `maybeOrdered && typeof maybeOrdered === 'object' && IS_ORDERED_SYMBOL in maybeOrdered`
  e[un]);
}
var es = 0, Ot = 1, Et = 2, Sc = typeof Symbol == "function" && Symbol.iterator, H1 = "@@iterator", qu = Sc || H1, j = function(t) {
  this.next = t;
};
j.prototype.toString = function() {
  return "[Iterator]";
};
j.KEYS = es;
j.VALUES = Ot;
j.ENTRIES = Et;
j.prototype.inspect = j.prototype.toSource = function() {
  return this.toString();
};
j.prototype[qu] = function() {
  return this;
};
function te(e, t, r, n) {
  var i = e === es ? t : e === Ot ? r : [t, r];
  return n ? n.value = i : n = {
    value: i,
    done: !1
  }, n;
}
function De() {
  return { value: void 0, done: !0 };
}
function _h(e) {
  return Array.isArray(e) ? !0 : !!Gu(e);
}
function Wd(e) {
  return e && typeof e.next == "function";
}
function xc(e) {
  var t = Gu(e);
  return t && t.call(e);
}
function Gu(e) {
  var t = e && (Sc && e[Sc] || e[H1]);
  if (typeof t == "function")
    return t;
}
function EC(e) {
  var t = Gu(e);
  return t && t === e.entries;
}
function SC(e) {
  var t = Gu(e);
  return t && t === e.keys;
}
var ts = Object.prototype.hasOwnProperty;
function vh(e) {
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
  function t(r) {
    return r == null ? yh() : kt(r) ? r.toSeq() : RC(r);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toSeq = function() {
    return this;
  }, t.prototype.toString = function() {
    return this.__toString("Seq {", "}");
  }, t.prototype.cacheResult = function() {
    return !this._cache && this.__iterateUncached && (this._cache = this.entrySeq().toArray(), this.size = this._cache.length), this;
  }, t.prototype.__iterate = function(n, i) {
    var s = this._cache;
    if (s) {
      for (var o = s.length, a = 0; a !== o; ) {
        var u = s[i ? o - ++a : a++];
        if (n(u[1], u[0], this) === !1)
          break;
      }
      return a;
    }
    return this.__iterateUncached(n, i);
  }, t.prototype.__iterator = function(n, i) {
    var s = this._cache;
    if (s) {
      var o = s.length, a = 0;
      return new j(function() {
        if (a === o)
          return De();
        var u = s[i ? o - ++a : a++];
        return te(n, u[0], u[1]);
      });
    }
    return this.__iteratorUncached(n, i);
  }, t;
}(Oe), yn = /* @__PURE__ */ function(e) {
  function t(r) {
    return r == null ? yh().toKeyedSeq() : it(r) ? J(r) ? r.toSeq() : r.fromEntrySeq() : gn(r) ? r.toSeq() : bh(r);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toKeyedSeq = function() {
    return this;
  }, t;
}(Ce), Wt = /* @__PURE__ */ function(e) {
  function t(r) {
    return r == null ? yh() : it(r) ? J(r) ? r.entrySeq() : r.toIndexedSeq() : gn(r) ? r.toSeq().entrySeq() : K1(r);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return t(arguments);
  }, t.prototype.toIndexedSeq = function() {
    return this;
  }, t.prototype.toString = function() {
    return this.__toString("Seq [", "]");
  }, t;
}(Ce), rs = /* @__PURE__ */ function(e) {
  function t(r) {
    return (it(r) && !ku(r) ? r : Wt(r)).toSetSeq();
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return t(arguments);
  }, t.prototype.toSetSeq = function() {
    return this;
  }, t;
}(Ce);
Ce.isSeq = Wu;
Ce.Keyed = yn;
Ce.Set = rs;
Ce.Indexed = Wt;
Ce.prototype[q1] = !0;
var Ti = /* @__PURE__ */ function(e) {
  function t(r) {
    this._array = r, this.size = r.length;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(n, i) {
    return this.has(n) ? this._array[an(this, n)] : i;
  }, t.prototype.__iterate = function(n, i) {
    for (var s = this._array, o = s.length, a = 0; a !== o; ) {
      var u = i ? o - ++a : a++;
      if (n(s[u], u, this) === !1)
        break;
    }
    return a;
  }, t.prototype.__iterator = function(n, i) {
    var s = this._array, o = s.length, a = 0;
    return new j(function() {
      if (a === o)
        return De();
      var u = i ? o - ++a : a++;
      return te(n, u, s[u]);
    });
  }, t;
}(Wt), gh = /* @__PURE__ */ function(e) {
  function t(r) {
    var n = Object.keys(r).concat(
      Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(r) : []
    );
    this._object = r, this._keys = n, this.size = n.length;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(n, i) {
    return i !== void 0 && !this.has(n) ? i : this._object[n];
  }, t.prototype.has = function(n) {
    return ts.call(this._object, n);
  }, t.prototype.__iterate = function(n, i) {
    for (var s = this._object, o = this._keys, a = o.length, u = 0; u !== a; ) {
      var f = o[i ? a - ++u : u++];
      if (n(s[f], f, this) === !1)
        break;
    }
    return u;
  }, t.prototype.__iterator = function(n, i) {
    var s = this._object, o = this._keys, a = o.length, u = 0;
    return new j(function() {
      if (u === a)
        return De();
      var f = o[i ? a - ++u : u++];
      return te(n, f, s[f]);
    });
  }, t;
}(yn);
gh.prototype[un] = !0;
var xC = /* @__PURE__ */ function(e) {
  function t(r) {
    this._collection = r, this.size = r.length || r.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.__iterateUncached = function(n, i) {
    if (i)
      return this.cacheResult().__iterate(n, i);
    var s = this._collection, o = xc(s), a = 0;
    if (Wd(o))
      for (var u; !(u = o.next()).done && n(u.value, a++, this) !== !1; )
        ;
    return a;
  }, t.prototype.__iteratorUncached = function(n, i) {
    if (i)
      return this.cacheResult().__iterator(n, i);
    var s = this._collection, o = xc(s);
    if (!Wd(o))
      return new j(De);
    var a = 0;
    return new j(function() {
      var u = o.next();
      return u.done ? u : te(n, a++, u.value);
    });
  }, t;
}(Wt), qd;
function yh() {
  return qd || (qd = new Ti([]));
}
function bh(e) {
  var t = mh(e);
  if (t)
    return t.fromEntrySeq();
  if (typeof e == "object")
    return new gh(e);
  throw new TypeError(
    "Expected Array or collection object of [k, v] entries, or keyed object: " + e
  );
}
function K1(e) {
  var t = mh(e);
  if (t)
    return t;
  throw new TypeError(
    "Expected Array or collection object of values: " + e
  );
}
function RC(e) {
  var t = mh(e);
  if (t)
    return EC(e) ? t.fromEntrySeq() : SC(e) ? t.toSetSeq() : t;
  if (typeof e == "object")
    return new gh(e);
  throw new TypeError(
    "Expected Array or collection object of values, or keyed object: " + e
  );
}
function mh(e) {
  return vh(e) ? new Ti(e) : _h(e) ? new xC(e) : void 0;
}
var Y1 = "@@__IMMUTABLE_MAP__@@";
function Hu(e) {
  return !!(e && // @ts-expect-error: maybeMap is typed as `{}`, need to change in 6.0 to `maybeMap && typeof maybeMap === 'object' && IS_MAP_SYMBOL in maybeMap`
  e[Y1]);
}
function wh(e) {
  return Hu(e) && Yt(e);
}
function Rc(e) {
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
  return !!(Rc(e) && Rc(t) && e.equals(t));
}
var ps = typeof Math.imul == "function" && Math.imul(4294967295, 2) === -2 ? Math.imul : function(t, r) {
  t |= 0, r |= 0;
  var n = t & 65535, i = r & 65535;
  return n * i + ((t >>> 16) * i + n * (r >>> 16) << 16 >>> 0) | 0;
};
function Ku(e) {
  return e >>> 1 & 1073741824 | e & 3221225471;
}
var TC = Object.prototype.valueOf;
function Je(e) {
  if (e == null)
    return Gd(e);
  if (typeof e.hashCode == "function")
    return Ku(e.hashCode(e));
  var t = DC(e);
  if (t == null)
    return Gd(t);
  switch (typeof t) {
    case "boolean":
      return t ? 1108378657 : 1108378656;
    case "number":
      return PC(t);
    case "string":
      return t.length > CC ? NC(t) : Tc(t);
    case "object":
    case "function":
      return MC(t);
    case "symbol":
      return $C(t);
    default:
      if (typeof t.toString == "function")
        return Tc(t.toString());
      throw new Error("Value type " + typeof t + " cannot be hashed.");
  }
}
function Gd(e) {
  return e === null ? 1108378658 : (
    /* undefined */
    1108378659
  );
}
function PC(e) {
  if (e !== e || e === 1 / 0)
    return 0;
  var t = e | 0;
  for (t !== e && (t ^= e * 4294967295); e > 4294967295; )
    e /= 4294967295, t ^= e;
  return Ku(t);
}
function NC(e) {
  var t = Df[e];
  return t === void 0 && (t = Tc(e), If === LC && (If = 0, Df = {}), If++, Df[e] = t), t;
}
function Tc(e) {
  for (var t = 0, r = 0; r < e.length; r++)
    t = 31 * t + e.charCodeAt(r) | 0;
  return Ku(t);
}
function $C(e) {
  var t = Yd[e];
  return t !== void 0 || (t = X1(), Yd[e] = t), t;
}
function MC(e) {
  var t;
  if (Pc && (t = Nc.get(e), t !== void 0) || (t = e[Rn], t !== void 0) || !Kd && (t = e.propertyIsEnumerable && e.propertyIsEnumerable[Rn], t !== void 0 || (t = IC(e), t !== void 0)))
    return t;
  if (t = X1(), Pc)
    Nc.set(e, t);
  else {
    if (Hd !== void 0 && Hd(e) === !1)
      throw new Error("Non-extensible objects are not allowed as keys.");
    if (Kd)
      Object.defineProperty(e, Rn, {
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
      }, e.propertyIsEnumerable[Rn] = t;
    else if (e.nodeType !== void 0)
      e[Rn] = t;
    else
      throw new Error("Unable to set a non-enumerable property on object.");
  }
  return t;
}
var Hd = Object.isExtensible, Kd = function() {
  try {
    return Object.defineProperty({}, "@", {}), !0;
  } catch {
    return !1;
  }
}();
function IC(e) {
  if (e && e.nodeType > 0)
    switch (e.nodeType) {
      case 1:
        return e.uniqueID;
      case 9:
        return e.documentElement && e.documentElement.uniqueID;
    }
}
function DC(e) {
  return e.valueOf !== TC && typeof e.valueOf == "function" ? e.valueOf(e) : e;
}
function X1() {
  var e = ++Mf;
  return Mf & 1073741824 && (Mf = 0), e;
}
var Pc = typeof WeakMap == "function", Nc;
Pc && (Nc = /* @__PURE__ */ new WeakMap());
var Yd = /* @__PURE__ */ Object.create(null), Mf = 0, Rn = "__immutablehash__";
typeof Symbol == "function" && (Rn = Symbol(Rn));
var CC = 16, LC = 255, If = 0, Df = {}, Yu = /* @__PURE__ */ function(e) {
  function t(r, n) {
    this._iter = r, this._useKeys = n, this.size = r.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.get = function(n, i) {
    return this._iter.get(n, i);
  }, t.prototype.has = function(n) {
    return this._iter.has(n);
  }, t.prototype.valueSeq = function() {
    return this._iter.valueSeq();
  }, t.prototype.reverse = function() {
    var n = this, i = Ah(this, !0);
    return this._useKeys || (i.valueSeq = function() {
      return n._iter.toSeq().reverse();
    }), i;
  }, t.prototype.map = function(n, i) {
    var s = this, o = tw(this, n, i);
    return this._useKeys || (o.valueSeq = function() {
      return s._iter.toSeq().map(n, i);
    }), o;
  }, t.prototype.__iterate = function(n, i) {
    var s = this;
    return this._iter.__iterate(function(o, a) {
      return n(o, a, s);
    }, i);
  }, t.prototype.__iterator = function(n, i) {
    return this._iter.__iterator(n, i);
  }, t;
}(yn);
Yu.prototype[un] = !0;
var J1 = /* @__PURE__ */ function(e) {
  function t(r) {
    this._iter = r, this.size = r.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.includes = function(n) {
    return this._iter.includes(n);
  }, t.prototype.__iterate = function(n, i) {
    var s = this, o = 0;
    return i && Ri(this), this._iter.__iterate(
      function(a) {
        return n(a, i ? s.size - ++o : o++, s);
      },
      i
    );
  }, t.prototype.__iterator = function(n, i) {
    var s = this, o = this._iter.__iterator(Ot, i), a = 0;
    return i && Ri(this), new j(function() {
      var u = o.next();
      return u.done ? u : te(
        n,
        i ? s.size - ++a : a++,
        u.value,
        u
      );
    });
  }, t;
}(Wt), Z1 = /* @__PURE__ */ function(e) {
  function t(r) {
    this._iter = r, this.size = r.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.has = function(n) {
    return this._iter.includes(n);
  }, t.prototype.__iterate = function(n, i) {
    var s = this;
    return this._iter.__iterate(function(o) {
      return n(o, o, s);
    }, i);
  }, t.prototype.__iterator = function(n, i) {
    var s = this._iter.__iterator(Ot, i);
    return new j(function() {
      var o = s.next();
      return o.done ? o : te(n, o.value, o.value, o);
    });
  }, t;
}(rs), Q1 = /* @__PURE__ */ function(e) {
  function t(r) {
    this._iter = r, this.size = r.size;
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.entrySeq = function() {
    return this._iter.toSeq();
  }, t.prototype.__iterate = function(n, i) {
    var s = this;
    return this._iter.__iterate(function(o) {
      if (o) {
        Jd(o);
        var a = it(o);
        return n(
          a ? o.get(1) : o[1],
          a ? o.get(0) : o[0],
          s
        );
      }
    }, i);
  }, t.prototype.__iterator = function(n, i) {
    var s = this._iter.__iterator(Ot, i);
    return new j(function() {
      for (; ; ) {
        var o = s.next();
        if (o.done)
          return o;
        var a = o.value;
        if (a) {
          Jd(a);
          var u = it(a);
          return te(
            n,
            u ? a.get(0) : a[0],
            u ? a.get(1) : a[1],
            o
          );
        }
      }
    });
  }, t;
}(yn);
J1.prototype.cacheResult = Yu.prototype.cacheResult = Z1.prototype.cacheResult = Q1.prototype.cacheResult = Sh;
function ew(e) {
  var t = Er(e);
  return t._iter = e, t.size = e.size, t.flip = function() {
    return e;
  }, t.reverse = function() {
    var r = e.reverse.apply(this);
    return r.flip = function() {
      return e.reverse();
    }, r;
  }, t.has = function(r) {
    return e.includes(r);
  }, t.includes = function(r) {
    return e.has(r);
  }, t.cacheResult = Sh, t.__iterateUncached = function(r, n) {
    var i = this;
    return e.__iterate(function(s, o) {
      return r(o, s, i) !== !1;
    }, n);
  }, t.__iteratorUncached = function(r, n) {
    if (r === Et) {
      var i = e.__iterator(r, n);
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
      r === Ot ? es : Ot,
      n
    );
  }, t;
}
function tw(e, t, r) {
  var n = Er(e);
  return n.size = e.size, n.has = function(i) {
    return e.has(i);
  }, n.get = function(i, s) {
    var o = e.get(i, L);
    return o === L ? s : t.call(r, o, i, e);
  }, n.__iterateUncached = function(i, s) {
    var o = this;
    return e.__iterate(
      function(a, u, f) {
        return i(t.call(r, a, u, f), u, o) !== !1;
      },
      s
    );
  }, n.__iteratorUncached = function(i, s) {
    var o = e.__iterator(Et, s);
    return new j(function() {
      var a = o.next();
      if (a.done)
        return a;
      var u = a.value, f = u[0];
      return te(
        i,
        f,
        t.call(r, u[1], f, e),
        a
      );
    });
  }, n;
}
function Ah(e, t) {
  var r = this, n = Er(e);
  return n._iter = e, n.size = e.size, n.reverse = function() {
    return e;
  }, e.flip && (n.flip = function() {
    var i = ew(e);
    return i.reverse = function() {
      return e.flip();
    }, i;
  }), n.get = function(i, s) {
    return e.get(t ? i : -1 - i, s);
  }, n.has = function(i) {
    return e.has(t ? i : -1 - i);
  }, n.includes = function(i) {
    return e.includes(i);
  }, n.cacheResult = Sh, n.__iterate = function(i, s) {
    var o = this, a = 0;
    return s && Ri(e), e.__iterate(
      function(u, f) {
        return i(u, t ? f : s ? o.size - ++a : a++, o);
      },
      !s
    );
  }, n.__iterator = function(i, s) {
    var o = 0;
    s && Ri(e);
    var a = e.__iterator(Et, !s);
    return new j(function() {
      var u = a.next();
      if (u.done)
        return u;
      var f = u.value;
      return te(
        i,
        t ? f[0] : s ? r.size - ++o : o++,
        f[1],
        u
      );
    });
  }, n;
}
function rw(e, t, r, n) {
  var i = Er(e);
  return n && (i.has = function(s) {
    var o = e.get(s, L);
    return o !== L && !!t.call(r, o, s, e);
  }, i.get = function(s, o) {
    var a = e.get(s, L);
    return a !== L && t.call(r, a, s, e) ? a : o;
  }), i.__iterateUncached = function(s, o) {
    var a = this, u = 0;
    return e.__iterate(function(f, c, l) {
      if (t.call(r, f, c, l))
        return u++, s(f, n ? c : u - 1, a);
    }, o), u;
  }, i.__iteratorUncached = function(s, o) {
    var a = e.__iterator(Et, o), u = 0;
    return new j(function() {
      for (; ; ) {
        var f = a.next();
        if (f.done)
          return f;
        var c = f.value, l = c[0], h = c[1];
        if (t.call(r, h, l, e))
          return te(s, n ? l : u++, h, f);
      }
    });
  }, i;
}
function jC(e, t, r) {
  var n = Qn().asMutable();
  return e.__iterate(function(i, s) {
    n.update(t.call(r, i, s, e), 0, function(o) {
      return o + 1;
    });
  }), n.asImmutable();
}
function FC(e, t, r) {
  var n = J(e), i = (Yt(e) ? pr() : Qn()).asMutable();
  e.__iterate(function(o, a) {
    i.update(
      t.call(r, o, a, e),
      function(u) {
        return u = u || [], u.push(n ? [a, o] : o), u;
      }
    );
  });
  var s = Eh(e);
  return i.map(function(o) {
    return K(e, s(o));
  }).asImmutable();
}
function BC(e, t, r) {
  var n = J(e), i = [[], []];
  e.__iterate(function(o, a) {
    i[t.call(r, o, a, e) ? 1 : 0].push(
      n ? [a, o] : o
    );
  });
  var s = Eh(e);
  return i.map(function(o) {
    return K(e, s(o));
  });
}
function Oh(e, t, r, n) {
  var i = e.size;
  if (To(t, r, i))
    return e;
  if (typeof i > "u" && (t < 0 || r < 0))
    return Oh(e.toSeq().cacheResult(), t, r, n);
  var s = Zi(t, i), o = Po(r, i), a = o - s, u;
  a === a && (u = a < 0 ? 0 : a);
  var f = Er(e);
  return f.size = u === 0 ? u : e.size && u || void 0, !n && Wu(e) && u >= 0 && (f.get = function(c, l) {
    return c = an(this, c), c >= 0 && c < u ? e.get(c + s, l) : l;
  }), f.__iterateUncached = function(c, l) {
    var h = this;
    if (u === 0)
      return 0;
    if (l)
      return this.cacheResult().__iterate(c, l);
    var d = 0, _ = !0, v = 0;
    return e.__iterate(function(g, y) {
      if (!(_ && (_ = d++ < s)))
        return v++, c(g, n ? y : v - 1, h) !== !1 && v !== u;
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
      return n || c === Ot || v.done ? v : c === es ? te(c, _ - 1, void 0, v) : te(c, _ - 1, v.value[1], v);
    });
  }, f;
}
function zC(e, t, r) {
  var n = Er(e);
  return n.__iterateUncached = function(i, s) {
    var o = this;
    if (s)
      return this.cacheResult().__iterate(i, s);
    var a = 0;
    return e.__iterate(
      function(u, f, c) {
        return t.call(r, u, f, c) && ++a && i(u, f, o);
      }
    ), a;
  }, n.__iteratorUncached = function(i, s) {
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
      return t.call(r, h, l, o) ? i === Et ? f : te(i, l, h, f) : (u = !1, De());
    });
  }, n;
}
function nw(e, t, r, n) {
  var i = Er(e);
  return i.__iterateUncached = function(s, o) {
    var a = this;
    if (o)
      return this.cacheResult().__iterate(s, o);
    var u = !0, f = 0;
    return e.__iterate(function(c, l, h) {
      if (!(u && (u = t.call(r, c, l, h))))
        return f++, s(c, n ? l : f - 1, a);
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
          return n || s === Ot ? l : s === es ? te(s, c++, void 0, l) : te(s, c++, l.value[1], l);
        var _ = l.value;
        h = _[0], d = _[1], f && (f = t.call(r, d, h, a));
      } while (f);
      return s === Et ? l : te(s, h, d, l);
    });
  }, i;
}
var UC = /* @__PURE__ */ function(e) {
  function t(r) {
    this._wrappedIterables = r.flatMap(function(n) {
      return n._wrappedIterables ? n._wrappedIterables : [n];
    }), this.size = this._wrappedIterables.reduce(function(n, i) {
      if (n !== void 0) {
        var s = i.size;
        if (s !== void 0)
          return n + s;
      }
    }, 0), this[Da] = this._wrappedIterables[0][Da], this[Ca] = this._wrappedIterables[0][Ca], this[un] = this._wrappedIterables[0][un];
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.__iterateUncached = function(n, i) {
    if (this._wrappedIterables.length !== 0) {
      if (i)
        return this.cacheResult().__iterate(n, i);
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
        var h = o ? n(l.value[1], l.value[0], this) : n(l.value, c, this);
        f = h !== !1, c++;
      }
      return c;
    }
  }, t.prototype.__iteratorUncached = function(n, i) {
    var s = this;
    if (this._wrappedIterables.length === 0)
      return new j(De);
    if (i)
      return this.cacheResult().__iterator(n, i);
    var o = 0, a = this._wrappedIterables[o].__iterator(
      n,
      i
    );
    return new j(function() {
      for (var u = a.next(); u.done; ) {
        if (o++, o === s._wrappedIterables.length)
          return u;
        a = s._wrappedIterables[o].__iterator(
          n,
          i
        ), u = a.next();
      }
      return u;
    });
  }, t;
}(Ce);
function VC(e, t) {
  var r = J(e), n = [e].concat(t).map(function(s) {
    return it(s) ? r && (s = Vt(s)) : s = r ? bh(s) : K1(Array.isArray(s) ? s : [s]), s;
  }).filter(function(s) {
    return s.size !== 0;
  });
  if (n.length === 0)
    return e;
  if (n.length === 1) {
    var i = n[0];
    if (i === e || r && J(i) || st(e) && st(i))
      return i;
  }
  return new UC(n);
}
function iw(e, t, r) {
  var n = Er(e);
  return n.__iterateUncached = function(i, s) {
    if (s)
      return this.cacheResult().__iterate(i, s);
    var o = 0, a = !1;
    function u(f, c) {
      f.__iterate(function(l, h) {
        return (!t || c < t) && it(l) ? u(l, c + 1) : (o++, i(l, r ? h : o - 1, n) === !1 && (a = !0)), !a;
      }, s);
    }
    return u(e, 0), o;
  }, n.__iteratorUncached = function(i, s) {
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
          return r ? f : te(i, u++, c, f);
      }
      return De();
    });
  }, n;
}
function kC(e, t, r) {
  var n = Eh(e);
  return e.toSeq().map(function(i, s) {
    return n(t.call(r, i, s, e));
  }).flatten(!0);
}
function WC(e, t) {
  var r = Er(e);
  return r.size = e.size && e.size * 2 - 1, r.__iterateUncached = function(n, i) {
    var s = this, o = 0;
    return e.__iterate(
      function(a) {
        return (!o || n(t, o++, s) !== !1) && n(a, o++, s) !== !1;
      },
      i
    ), o;
  }, r.__iteratorUncached = function(n, i) {
    var s = e.__iterator(Ot, i), o = 0, a;
    return new j(function() {
      return (!a || o % 2) && (a = s.next(), a.done) ? a : o % 2 ? te(n, o++, t) : te(n, o++, a.value, a);
    });
  }, r;
}
function Pi(e, t, r) {
  t || (t = sw);
  var n = J(e), i = 0, s = e.toSeq().map(function(o, a) {
    return [a, o, i++, r ? r(o, a, e) : o];
  }).valueSeq().toArray();
  return s.sort(function(o, a) {
    return t(o[3], a[3]) || o[2] - a[2];
  }).forEach(
    n ? function(o, a) {
      s[a].length = 2;
    } : function(o, a) {
      s[a] = o[1];
    }
  ), n ? yn(s) : st(e) ? Wt(s) : rs(s);
}
function ra(e, t, r) {
  if (t || (t = sw), r) {
    var n = e.toSeq().map(function(i, s) {
      return [i, r(i, s, e)];
    }).reduce(function(i, s) {
      return Xd(t, i[1], s[1]) ? s : i;
    });
    return n && n[0];
  }
  return e.reduce(function(i, s) {
    return Xd(t, i, s) ? s : i;
  });
}
function Xd(e, t, r) {
  var n = e(r, t);
  return n === 0 && r !== t && (r == null || r !== r) || n > 0;
}
function na(e, t, r, n) {
  var i = Er(e), s = new Ti(r).map(function(o) {
    return o.size;
  });
  return i.size = n ? s.max() : s.min(), i.__iterate = function(o, a) {
    for (var u = this.__iterator(Ot, a), f, c = 0; !(f = u.next()).done && o(f.value, c++, this) !== !1; )
      ;
    return c;
  }, i.__iteratorUncached = function(o, a) {
    var u = r.map(
      function(l) {
        return l = Oe(l), xc(a ? l.reverse() : l);
      }
    ), f = 0, c = !1;
    return new j(function() {
      var l;
      return c || (l = u.map(function(h) {
        return h.next();
      }), c = n ? l.every(function(h) {
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
  return e === t ? e : Wu(e) ? t : e.constructor(t);
}
function Jd(e) {
  if (e !== Object(e))
    throw new TypeError("Expected [K, V] tuple: " + e);
}
function Eh(e) {
  return J(e) ? Vt : st(e) ? Jn : Qi;
}
function Er(e) {
  return Object.create(
    (J(e) ? yn : st(e) ? Wt : rs).prototype
  );
}
function Sh() {
  return this._iter.cacheResult ? (this._iter.cacheResult(), this.size = this._iter.size, this) : Ce.prototype.cacheResult.call(this);
}
function sw(e, t) {
  return e === void 0 && t === void 0 ? 0 : e === void 0 ? 1 : t === void 0 ? -1 : e > t ? 1 : e < t ? -1 : 0;
}
function sr(e, t) {
  t = t || 0;
  for (var r = Math.max(0, e.length - t), n = new Array(r), i = 0; i < r; i++)
    n[i] = e[i + t];
  return n;
}
function Ss(e, t) {
  if (!e)
    throw new Error(t);
}
function ut(e) {
  Ss(e !== 1 / 0, "Cannot perform this action with an infinite size.");
}
function ow(e) {
  if (vh(e) && typeof e != "string")
    return e;
  if (Yt(e))
    return e.toArray();
  throw new TypeError("Invalid keyPath: expected Ordered Collection or Array: " + e);
}
var qC = Object.prototype.toString;
function xh(e) {
  if (!e || typeof e != "object" || qC.call(e) !== "[object Object]")
    return !1;
  var t = Object.getPrototypeOf(e);
  if (t === null)
    return !0;
  for (var r = t, n = Object.getPrototypeOf(t); n !== null; )
    r = n, n = Object.getPrototypeOf(r);
  return r === t;
}
function fn(e) {
  return typeof e == "object" && (kt(e) || Array.isArray(e) || xh(e));
}
function Gs(e) {
  try {
    return typeof e == "string" ? JSON.stringify(e) : String(e);
  } catch {
    return JSON.stringify(e);
  }
}
function aw(e, t) {
  return kt(e) ? (
    // @ts-expect-error key might be a number or symbol, which is not handled be Record key type
    e.has(t)
  ) : (
    // @ts-expect-error key might be anything else than PropertyKey, and will return false in that case but runtime is OK
    fn(e) && ts.call(e, t)
  );
}
function Rh(e, t, r) {
  return kt(e) ? e.get(t, r) : aw(e, t) ? (
    // @ts-expect-error weird "get" here,
    typeof e.get == "function" ? (
      // @ts-expect-error weird "get" here,
      e.get(t)
    ) : (
      // @ts-expect-error key is unknown here,
      e[t]
    )
  ) : r;
}
function La(e) {
  if (Array.isArray(e))
    return sr(e);
  var t = {};
  for (var r in e)
    ts.call(e, r) && (t[r] = e[r]);
  return t;
}
function uw(e, t) {
  if (!fn(e))
    throw new TypeError("Cannot update non-data-structure value: " + e);
  if (kt(e)) {
    if (!e.remove)
      throw new TypeError("Cannot update immutable value without .remove() method: " + e);
    return e.remove(t);
  }
  if (!ts.call(e, t))
    return e;
  var r = La(e);
  return Array.isArray(r) ? r.splice(t, 1) : delete r[t], r;
}
function fw(e, t, r) {
  if (!fn(e))
    throw new TypeError("Cannot update non-data-structure value: " + e);
  if (kt(e)) {
    if (!e.set)
      throw new TypeError("Cannot update immutable value without .set() method: " + e);
    return e.set(t, r);
  }
  if (ts.call(e, t) && r === e[t])
    return e;
  var n = La(e);
  return n[t] = r, n;
}
function Zn(e, t, r, n) {
  n || (n = r, r = void 0);
  var i = cw(
    kt(e),
    // @ts-expect-error type issues with Record and mixed types
    e,
    ow(t),
    0,
    r,
    n
  );
  return i === L ? r : i;
}
function cw(e, t, r, n, i, s) {
  var o = t === L;
  if (n === r.length) {
    var a = o ? i : t, u = s(a);
    return u === a ? t : u;
  }
  if (!o && !fn(t))
    throw new TypeError("Cannot update within non-data-structure value in path [" + Array.from(r).slice(0, n).map(Gs) + "]: " + t);
  var f = r[n], c = o ? L : Rh(t, f, L), l = cw(
    c === L ? e : kt(c),
    // @ts-expect-error mixed type
    c,
    r,
    n + 1,
    i,
    s
  );
  return l === c ? t : l === L ? uw(t, f) : fw(o ? e ? ar() : {} : t, f, l);
}
function lw(e, t, r) {
  return Zn(e, t, L, function() {
    return r;
  });
}
function Th(e, t) {
  return lw(this, e, t);
}
function hw(e, t) {
  return Zn(e, t, function() {
    return L;
  });
}
function Ph(e) {
  return hw(this, e);
}
function Nh(e, t, r, n) {
  return Zn(
    // @ts-expect-error Index signature for type string is missing in type V[]
    e,
    [t],
    r,
    n
  );
}
function $h(e, t, r) {
  return arguments.length === 1 ? e(this) : Nh(this, e, t, r);
}
function Mh(e, t, r) {
  return Zn(this, e, t, r);
}
function pw() {
  for (var e = [], t = arguments.length; t--; ) e[t] = arguments[t];
  return _w(this, e);
}
function dw(e) {
  for (var t = [], r = arguments.length - 1; r-- > 0; ) t[r] = arguments[r + 1];
  if (typeof e != "function")
    throw new TypeError("Invalid merger function: " + e);
  return _w(this, t, e);
}
function _w(e, t, r) {
  for (var n = [], i = 0; i < t.length; i++) {
    var s = Vt(t[i]);
    s.size !== 0 && n.push(s);
  }
  return n.length === 0 ? e : e.toSeq().size === 0 && !e.__ownerID && n.length === 1 ? gn(e) ? e : e.constructor(n[0]) : e.withMutations(function(o) {
    for (var a = r ? function(f, c) {
      Nh(
        o,
        c,
        L,
        function(l) {
          return l === L ? f : r(l, f, c);
        }
      );
    } : function(f, c) {
      o.set(c, f);
    }, u = 0; u < n.length; u++)
      n[u].forEach(a);
  });
}
function GC(e) {
  for (var t = [], r = arguments.length - 1; r-- > 0; ) t[r] = arguments[r + 1];
  return $o(e, t);
}
function HC(e, t) {
  for (var r = [], n = arguments.length - 2; n-- > 0; ) r[n] = arguments[n + 2];
  return $o(t, r, e);
}
function KC(e) {
  for (var t = [], r = arguments.length - 1; r-- > 0; ) t[r] = arguments[r + 1];
  return No(e, t);
}
function YC(e, t) {
  for (var r = [], n = arguments.length - 2; n-- > 0; ) r[n] = arguments[n + 2];
  return No(t, r, e);
}
function No(e, t, r) {
  return $o(e, t, XC(r));
}
function $o(e, t, r) {
  if (!fn(e))
    throw new TypeError(
      "Cannot merge into non-data-structure value: " + e
    );
  if (kt(e))
    return typeof r == "function" && e.mergeWith ? e.mergeWith.apply(e, [r].concat(t)) : e.merge ? e.merge.apply(e, t) : e.concat.apply(e, t);
  for (var n = Array.isArray(e), i = e, s = n ? Jn : Vt, o = n ? function(u) {
    i === e && (i = La(i)), i.push(u);
  } : function(u, f) {
    var c = ts.call(i, f), l = c && r ? r(i[f], u, f) : u;
    (!c || l !== i[f]) && (i === e && (i = La(i)), i[f] = l);
  }, a = 0; a < t.length; a++)
    s(t[a]).forEach(o);
  return i;
}
function XC(e) {
  function t(r, n, i) {
    return fn(r) && fn(n) && JC(r, n) ? $o(r, [n], t) : e ? e(r, n, i) : n;
  }
  return t;
}
function JC(e, t) {
  var r = Ce(e), n = Ce(t);
  return st(r) === st(n) && J(r) === J(n);
}
function vw() {
  for (var e = [], t = arguments.length; t--; ) e[t] = arguments[t];
  return No(this, e);
}
function gw(e) {
  for (var t = [], r = arguments.length - 1; r-- > 0; ) t[r] = arguments[r + 1];
  return No(this, t, e);
}
function Ih(e) {
  for (var t = [], r = arguments.length - 1; r-- > 0; ) t[r] = arguments[r + 1];
  return Zn(this, e, ar(), function(n) {
    return $o(n, t);
  });
}
function Dh(e) {
  for (var t = [], r = arguments.length - 1; r-- > 0; ) t[r] = arguments[r + 1];
  return Zn(
    this,
    e,
    ar(),
    function(n) {
      return No(n, t);
    }
  );
}
function Mo(e) {
  var t = this.asMutable();
  return e(t), t.wasAltered() ? t.__ensureOwner(this.__ownerID) : this;
}
function Io() {
  return this.__ownerID ? this : this.__ensureOwner(new dh());
}
function Do() {
  return this.__ensureOwner();
}
function Ch() {
  return this.__altered;
}
var Qn = /* @__PURE__ */ function(e) {
  function t(r) {
    return r == null ? ar() : Hu(r) && !Yt(r) ? r : ar().withMutations(function(n) {
      var i = e(r);
      ut(i.size), i.forEach(function(s, o) {
        return n.set(o, s);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.__toString("Map {", "}");
  }, t.prototype.get = function(n, i) {
    return this._root ? this._root.get(0, void 0, n, i) : i;
  }, t.prototype.set = function(n, i) {
    return e_(this, n, i);
  }, t.prototype.remove = function(n) {
    return e_(this, n, L);
  }, t.prototype.deleteAll = function(n) {
    var i = Oe(n);
    return i.size === 0 ? this : this.withMutations(function(s) {
      i.forEach(function(o) {
        return s.remove(o);
      });
    });
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._root = null, this.__hash = void 0, this.__altered = !0, this) : ar();
  }, t.prototype.sort = function(n) {
    return pr(Pi(this, n));
  }, t.prototype.sortBy = function(n, i) {
    return pr(Pi(this, i, n));
  }, t.prototype.map = function(n, i) {
    var s = this;
    return this.withMutations(function(o) {
      o.forEach(function(a, u) {
        o.set(u, n.call(i, a, u, s));
      });
    });
  }, t.prototype.__iterator = function(n, i) {
    return new ZC(this, n, i);
  }, t.prototype.__iterate = function(n, i) {
    var s = this, o = 0;
    return this._root && this._root.iterate(function(a) {
      return o++, n(a[1], a[0], s);
    }, i), o;
  }, t.prototype.__ensureOwner = function(n) {
    return n === this.__ownerID ? this : n ? Lh(this.size, this._root, n, this.__hash) : this.size === 0 ? ar() : (this.__ownerID = n, this.__altered = !1, this);
  }, t;
}(Vt);
Qn.isMap = Hu;
var re = Qn.prototype;
re[Y1] = !0;
re[Ro] = re.remove;
re.removeAll = re.deleteAll;
re.setIn = Th;
re.removeIn = re.deleteIn = Ph;
re.update = $h;
re.updateIn = Mh;
re.merge = re.concat = pw;
re.mergeWith = dw;
re.mergeDeep = vw;
re.mergeDeepWith = gw;
re.mergeIn = Ih;
re.mergeDeepIn = Dh;
re.withMutations = Mo;
re.wasAltered = Ch;
re.asImmutable = Do;
re["@@transducer/init"] = re.asMutable = Io;
re["@@transducer/step"] = function(e, t) {
  return e.set(t[0], t[1]);
};
re["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
var Hs = function(t, r) {
  this.ownerID = t, this.entries = r;
};
Hs.prototype.get = function(t, r, n, i) {
  for (var s = this.entries, o = 0, a = s.length; o < a; o++)
    if (we(n, s[o][0]))
      return s[o][1];
  return i;
};
Hs.prototype.update = function(t, r, n, i, s, o, a) {
  for (var u = s === L, f = this.entries, c = 0, l = f.length; c < l && !we(i, f[c][0]); c++)
    ;
  var h = c < l;
  if (h ? f[c][1] === s : u)
    return this;
  if ($t(a), (u || !h) && $t(o), !(u && f.length === 1)) {
    if (!h && !u && f.length >= iL)
      return QC(t, f, i, s);
    var d = t && t === this.ownerID, _ = d ? f : sr(f);
    return h ? u ? c === l - 1 ? _.pop() : _[c] = _.pop() : _[c] = [i, s] : _.push([i, s]), d ? (this.entries = _, this) : new Hs(t, _);
  }
};
var Ni = function(t, r, n) {
  this.ownerID = t, this.bitmap = r, this.nodes = n;
};
Ni.prototype.get = function(t, r, n, i) {
  r === void 0 && (r = Je(n));
  var s = 1 << ((t === 0 ? r : r >>> t) & Be), o = this.bitmap;
  return (o & s) === 0 ? i : this.nodes[yw(o & s - 1)].get(
    t + Y,
    r,
    n,
    i
  );
};
Ni.prototype.update = function(t, r, n, i, s, o, a) {
  n === void 0 && (n = Je(i));
  var u = (r === 0 ? n : n >>> r) & Be, f = 1 << u, c = this.bitmap, l = (c & f) !== 0;
  if (!l && s === L)
    return this;
  var h = yw(c & f - 1), d = this.nodes, _ = l ? d[h] : void 0, v = jh(
    _,
    t,
    r + Y,
    n,
    i,
    s,
    o,
    a
  );
  if (v === _)
    return this;
  if (!l && v && d.length >= sL)
    return tL(t, d, c, u, v);
  if (l && !v && d.length === 2 && t_(d[h ^ 1]))
    return d[h ^ 1];
  if (l && v && d.length === 1 && t_(v))
    return v;
  var g = t && t === this.ownerID, y = l ? v ? c : c ^ f : c | f, b = l ? v ? bw(d, h, v, g) : nL(d, h, g) : rL(d, h, v, g);
  return g ? (this.bitmap = y, this.nodes = b, this) : new Ni(t, y, b);
};
var Ks = function(t, r, n) {
  this.ownerID = t, this.count = r, this.nodes = n;
};
Ks.prototype.get = function(t, r, n, i) {
  r === void 0 && (r = Je(n));
  var s = (t === 0 ? r : r >>> t) & Be, o = this.nodes[s];
  return o ? o.get(t + Y, r, n, i) : i;
};
Ks.prototype.update = function(t, r, n, i, s, o, a) {
  n === void 0 && (n = Je(i));
  var u = (r === 0 ? n : n >>> r) & Be, f = s === L, c = this.nodes, l = c[u];
  if (f && !l)
    return this;
  var h = jh(
    l,
    t,
    r + Y,
    n,
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
  else if (!h && (d--, d < oL))
    return eL(t, c, d, u);
  var _ = t && t === this.ownerID, v = bw(c, u, h, _);
  return _ ? (this.count = d, this.nodes = v, this) : new Ks(t, d, v);
};
var $i = function(t, r, n) {
  this.ownerID = t, this.keyHash = r, this.entries = n;
};
$i.prototype.get = function(t, r, n, i) {
  for (var s = this.entries, o = 0, a = s.length; o < a; o++)
    if (we(n, s[o][0]))
      return s[o][1];
  return i;
};
$i.prototype.update = function(t, r, n, i, s, o, a) {
  n === void 0 && (n = Je(i));
  var u = s === L;
  if (n !== this.keyHash)
    return u ? this : ($t(a), $t(o), Fh(this, t, r, n, [i, s]));
  for (var f = this.entries, c = 0, l = f.length; c < l && !we(i, f[c][0]); c++)
    ;
  var h = c < l;
  if (h ? f[c][1] === s : u)
    return this;
  if ($t(a), (u || !h) && $t(o), u && l === 2)
    return new Ur(t, this.keyHash, f[c ^ 1]);
  var d = t && t === this.ownerID, _ = d ? f : sr(f);
  return h ? u ? c === l - 1 ? _.pop() : _[c] = _.pop() : _[c] = [i, s] : _.push([i, s]), d ? (this.entries = _, this) : new $i(t, this.keyHash, _);
};
var Ur = function(t, r, n) {
  this.ownerID = t, this.keyHash = r, this.entry = n;
};
Ur.prototype.get = function(t, r, n, i) {
  return we(n, this.entry[0]) ? this.entry[1] : i;
};
Ur.prototype.update = function(t, r, n, i, s, o, a) {
  var u = s === L, f = we(i, this.entry[0]);
  if (f ? s === this.entry[1] : u)
    return this;
  if ($t(a), u) {
    $t(o);
    return;
  }
  return f ? t && t === this.ownerID ? (this.entry[1] = s, this) : new Ur(t, this.keyHash, [i, s]) : ($t(o), Fh(this, t, r, Je(i), [i, s]));
};
Hs.prototype.iterate = $i.prototype.iterate = function(e, t) {
  for (var r = this.entries, n = 0, i = r.length - 1; n <= i; n++)
    if (e(r[t ? i - n : n]) === !1)
      return !1;
};
Ni.prototype.iterate = Ks.prototype.iterate = function(e, t) {
  for (var r = this.nodes, n = 0, i = r.length - 1; n <= i; n++) {
    var s = r[t ? i - n : n];
    if (s && s.iterate(e, t) === !1)
      return !1;
  }
};
Ur.prototype.iterate = function(e, t) {
  return e(this.entry);
};
var ZC = /* @__PURE__ */ function(e) {
  function t(r, n, i) {
    this._type = n, this._reverse = i, this._stack = r._root && Zd(r._root);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.next = function() {
    for (var n = this._type, i = this._stack; i; ) {
      var s = i.node, o = i.index++, a = void 0;
      if (s.entry) {
        if (o === 0)
          return Cf(n, s.entry);
      } else if (s.entries) {
        if (a = s.entries.length - 1, o <= a)
          return Cf(
            n,
            s.entries[this._reverse ? a - o : o]
          );
      } else if (a = s.nodes.length - 1, o <= a) {
        var u = s.nodes[this._reverse ? a - o : o];
        if (u) {
          if (u.entry)
            return Cf(n, u.entry);
          i = this._stack = Zd(u, i);
        }
        continue;
      }
      i = this._stack = this._stack.__prev;
    }
    return De();
  }, t;
}(j);
function Cf(e, t) {
  return te(e, t[0], t[1]);
}
function Zd(e, t) {
  return {
    node: e,
    index: 0,
    __prev: t
  };
}
function Lh(e, t, r, n) {
  var i = Object.create(re);
  return i.size = e, i._root = t, i.__ownerID = r, i.__hash = n, i.__altered = !1, i;
}
var Qd;
function ar() {
  return Qd || (Qd = Lh(0));
}
function e_(e, t, r) {
  var n, i;
  if (e._root) {
    var s = Ec(), o = Ec();
    if (n = jh(
      e._root,
      e.__ownerID,
      0,
      void 0,
      t,
      r,
      s,
      o
    ), !o.value)
      return e;
    i = e.size + (s.value ? r === L ? -1 : 1 : 0);
  } else {
    if (r === L)
      return e;
    i = 1, n = new Hs(e.__ownerID, [[t, r]]);
  }
  return e.__ownerID ? (e.size = i, e._root = n, e.__hash = void 0, e.__altered = !0, e) : n ? Lh(i, n) : ar();
}
function jh(e, t, r, n, i, s, o, a) {
  return e ? e.update(
    t,
    r,
    n,
    i,
    s,
    o,
    a
  ) : s === L ? e : ($t(a), $t(o), new Ur(t, n, [i, s]));
}
function t_(e) {
  return e.constructor === Ur || e.constructor === $i;
}
function Fh(e, t, r, n, i) {
  if (e.keyHash === n)
    return new $i(t, n, [e.entry, i]);
  var s = (r === 0 ? e.keyHash : e.keyHash >>> r) & Be, o = (r === 0 ? n : n >>> r) & Be, a, u = s === o ? [Fh(e, t, r + Y, n, i)] : (a = new Ur(t, n, i), s < o ? [e, a] : [a, e]);
  return new Ni(t, 1 << s | 1 << o, u);
}
function QC(e, t, r, n) {
  e || (e = new dh());
  for (var i = new Ur(e, Je(r), [r, n]), s = 0; s < t.length; s++) {
    var o = t[s];
    i = i.update(e, 0, void 0, o[0], o[1]);
  }
  return i;
}
function eL(e, t, r, n) {
  for (var i = 0, s = 0, o = new Array(r), a = 0, u = 1, f = t.length; a < f; a++, u <<= 1) {
    var c = t[a];
    c !== void 0 && a !== n && (i |= u, o[s++] = c);
  }
  return new Ni(e, i, o);
}
function tL(e, t, r, n, i) {
  for (var s = 0, o = new Array(lt), a = 0; r !== 0; a++, r >>>= 1)
    o[a] = r & 1 ? t[s++] : void 0;
  return o[n] = i, new Ks(e, s + 1, o);
}
function yw(e) {
  return e -= e >> 1 & 1431655765, e = (e & 858993459) + (e >> 2 & 858993459), e = e + (e >> 4) & 252645135, e += e >> 8, e += e >> 16, e & 127;
}
function bw(e, t, r, n) {
  var i = n ? e : sr(e);
  return i[t] = r, i;
}
function rL(e, t, r, n) {
  var i = e.length + 1;
  if (n && t + 1 === i)
    return e[t] = r, e;
  for (var s = new Array(i), o = 0, a = 0; a < i; a++)
    a === t ? (s[a] = r, o = -1) : s[a] = e[a + o];
  return s;
}
function nL(e, t, r) {
  var n = e.length - 1;
  if (r && t === n)
    return e.pop(), e;
  for (var i = new Array(n), s = 0, o = 0; o < n; o++)
    o === t && (s = 1), i[o] = e[o + s];
  return i;
}
var iL = lt / 4, sL = lt / 2, oL = lt / 4, mw = "@@__IMMUTABLE_LIST__@@";
function Bh(e) {
  return !!(e && // @ts-expect-error: maybeList is typed as `{}`, need to change in 6.0 to `maybeList && typeof maybeList === 'object' && IS_LIST_SYMBOL in maybeList`
  e[mw]);
}
var Co = /* @__PURE__ */ function(e) {
  function t(r) {
    var n = ma();
    if (r == null)
      return n;
    if (Bh(r))
      return r;
    var i = e(r), s = i.size;
    return s === 0 ? n : (ut(s), s > 0 && s < lt ? Ys(0, s, Y, null, new Zr(i.toArray())) : n.withMutations(function(o) {
      o.setSize(s), i.forEach(function(a, u) {
        return o.set(u, a);
      });
    }));
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.prototype.toString = function() {
    return this.__toString("List [", "]");
  }, t.prototype.get = function(n, i) {
    if (n = an(this, n), n >= 0 && n < this.size) {
      n += this._origin;
      var s = ww(this, n);
      return s && s.array[n & Be];
    }
    return i;
  }, t.prototype.set = function(n, i) {
    return aL(this, n, i);
  }, t.prototype.remove = function(n) {
    return this.has(n) ? n === 0 ? this.shift() : n === this.size - 1 ? this.pop() : this.splice(n, 1) : this;
  }, t.prototype.insert = function(n, i) {
    return this.splice(n, 0, i);
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = this._origin = this._capacity = 0, this._level = Y, this._root = this._tail = this.__hash = void 0, this.__altered = !0, this) : ma();
  }, t.prototype.push = function() {
    var n = arguments, i = this.size;
    return this.withMutations(function(s) {
      Kr(s, 0, i + n.length);
      for (var o = 0; o < n.length; o++)
        s.set(i + o, n[o]);
    });
  }, t.prototype.pop = function() {
    return Kr(this, 0, -1);
  }, t.prototype.unshift = function() {
    var n = arguments;
    return this.withMutations(function(i) {
      Kr(i, -n.length);
      for (var s = 0; s < n.length; s++)
        i.set(s, n[s]);
    });
  }, t.prototype.shift = function() {
    return Kr(this, 1);
  }, t.prototype.shuffle = function(n) {
    return n === void 0 && (n = Math.random), this.withMutations(function(i) {
      for (var s = i.size, o, a; s; )
        o = Math.floor(n() * s--), a = i.get(o), i.set(o, i.get(s)), i.set(s, a);
    });
  }, t.prototype.concat = function() {
    for (var n = arguments, i = [], s = 0; s < arguments.length; s++) {
      var o = n[s], a = e(
        typeof o != "string" && _h(o) ? o : [o]
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
  }, t.prototype.setSize = function(n) {
    return Kr(this, 0, n);
  }, t.prototype.map = function(n, i) {
    var s = this;
    return this.withMutations(function(o) {
      for (var a = 0; a < s.size; a++)
        o.set(a, n.call(i, o.get(a), a, s));
    });
  }, t.prototype.slice = function(n, i) {
    var s = this.size;
    return To(n, i, s) ? this : Kr(
      this,
      Zi(n, s),
      Po(i, s)
    );
  }, t.prototype.__iterator = function(n, i) {
    var s = i ? this.size : 0, o = r_(this, i);
    return new j(function() {
      var a = o();
      return a === xs ? De() : te(n, i ? --s : s++, a);
    });
  }, t.prototype.__iterate = function(n, i) {
    for (var s = i ? this.size : 0, o = r_(this, i), a; (a = o()) !== xs && n(a, i ? --s : s++, this) !== !1; )
      ;
    return s;
  }, t.prototype.__ensureOwner = function(n) {
    return n === this.__ownerID ? this : n ? Ys(
      this._origin,
      this._capacity,
      this._level,
      this._root,
      this._tail,
      n,
      this.__hash
    ) : this.size === 0 ? ma() : (this.__ownerID = n, this.__altered = !1, this);
  }, t;
}(Jn);
Co.isList = Bh;
var le = Co.prototype;
le[mw] = !0;
le[Ro] = le.remove;
le.merge = le.concat;
le.setIn = Th;
le.deleteIn = le.removeIn = Ph;
le.update = $h;
le.updateIn = Mh;
le.mergeIn = Ih;
le.mergeDeepIn = Dh;
le.withMutations = Mo;
le.wasAltered = Ch;
le.asImmutable = Do;
le["@@transducer/init"] = le.asMutable = Io;
le["@@transducer/step"] = function(e, t) {
  return e.push(t);
};
le["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
var Zr = function(t, r) {
  this.array = t, this.ownerID = r;
};
Zr.prototype.removeBefore = function(t, r, n) {
  if ((n & (1 << r + Y) - 1) === 0 || this.array.length === 0)
    return this;
  var i = n >>> r & Be;
  if (i >= this.array.length)
    return new Zr([], t);
  var s = i === 0, o;
  if (r > 0) {
    var a = this.array[i];
    if (o = a && a.removeBefore(t, r - Y, n), o === a && s)
      return this;
  }
  if (s && !o)
    return this;
  var u = Mi(this, t);
  if (!s)
    for (var f = 0; f < i; f++)
      u.array[f] = void 0;
  return o && (u.array[i] = o), u;
};
Zr.prototype.removeAfter = function(t, r, n) {
  if (n === (r ? 1 << r + Y : lt) || this.array.length === 0)
    return this;
  var i = n - 1 >>> r & Be;
  if (i >= this.array.length)
    return this;
  var s;
  if (r > 0) {
    var o = this.array[i];
    if (s = o && o.removeAfter(t, r - Y, n), s === o && i === this.array.length - 1)
      return this;
  }
  var a = Mi(this, t);
  return a.array.splice(i + 1), s && (a.array[i] = s), a;
};
var xs = {};
function r_(e, t) {
  var r = e._origin, n = e._capacity, i = Xs(n), s = e._tail;
  return o(e._root, e._level, 0);
  function o(f, c, l) {
    return c === 0 ? a(f, l) : u(f, c, l);
  }
  function a(f, c) {
    var l = c === i ? s && s.array : f && f.array, h = c > r ? 0 : r - c, d = n - c;
    return d > lt && (d = lt), function() {
      if (h === d)
        return xs;
      var _ = t ? --d : h++;
      return l && l[_];
    };
  }
  function u(f, c, l) {
    var h, d = f && f.array, _ = l > r ? 0 : r - l >> c, v = (n - l >> c) + 1;
    return v > lt && (v = lt), function() {
      for (; ; ) {
        if (h) {
          var g = h();
          if (g !== xs)
            return g;
          h = null;
        }
        if (_ === v)
          return xs;
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
function Ys(e, t, r, n, i, s, o) {
  var a = Object.create(le);
  return a.size = t - e, a._origin = e, a._capacity = t, a._level = r, a._root = n, a._tail = i, a.__ownerID = s, a.__hash = o, a.__altered = !1, a;
}
function ma() {
  return Ys(0, 0, Y);
}
function aL(e, t, r) {
  if (t = an(e, t), t !== t)
    return e;
  if (t >= e.size || t < 0)
    return e.withMutations(function(o) {
      t < 0 ? Kr(o, t).set(0, r) : Kr(o, 0, t + 1).set(t, r);
    });
  t += e._origin;
  var n = e._tail, i = e._root, s = Ec();
  return t >= Xs(e._capacity) ? n = $c(n, e.__ownerID, 0, t, r, s) : i = $c(
    i,
    e.__ownerID,
    e._level,
    t,
    r,
    s
  ), s.value ? e.__ownerID ? (e._root = i, e._tail = n, e.__hash = void 0, e.__altered = !0, e) : Ys(e._origin, e._capacity, e._level, i, n) : e;
}
function $c(e, t, r, n, i, s) {
  var o = n >>> r & Be, a = e && o < e.array.length;
  if (!a && i === void 0)
    return e;
  var u;
  if (r > 0) {
    var f = e && e.array[o], c = $c(
      f,
      t,
      r - Y,
      n,
      i,
      s
    );
    return c === f ? e : (u = Mi(e, t), u.array[o] = c, u);
  }
  return a && e.array[o] === i ? e : (s && $t(s), u = Mi(e, t), i === void 0 && o === u.array.length - 1 ? u.array.pop() : u.array[o] = i, u);
}
function Mi(e, t) {
  return t && e && t === e.ownerID ? e : new Zr(e ? e.array.slice() : [], t);
}
function ww(e, t) {
  if (t >= Xs(e._capacity))
    return e._tail;
  if (t < 1 << e._level + Y) {
    for (var r = e._root, n = e._level; r && n > 0; )
      r = r.array[t >>> n & Be], n -= Y;
    return r;
  }
}
function Kr(e, t, r) {
  t !== void 0 && (t |= 0), r !== void 0 && (r |= 0);
  var n = e.__ownerID || new dh(), i = e._origin, s = e._capacity, o = i + t, a = r === void 0 ? s : r < 0 ? s + r : i + r;
  if (o === i && a === s)
    return e;
  if (o >= a)
    return e.clear();
  for (var u = e._level, f = e._root, c = 0; o + c < 0; )
    f = new Zr(
      f && f.array.length ? [void 0, f] : [],
      n
    ), u += Y, c += 1 << u;
  c && (o += c, i += c, a += c, s += c);
  for (var l = Xs(s), h = Xs(a); h >= 1 << u + Y; )
    f = new Zr(
      f && f.array.length ? [f] : [],
      n
    ), u += Y;
  var d = e._tail, _ = h < l ? ww(e, a - 1) : h > l ? new Zr([], n) : d;
  if (d && h > l && o < s && d.array.length) {
    f = Mi(f, n);
    for (var v = f, g = u; g > Y; g -= Y) {
      var y = l >>> g & Be;
      v = v.array[y] = Mi(v.array[y], n);
    }
    v.array[l >>> Y & Be] = d;
  }
  if (a < s && (_ = _ && _.removeAfter(n, 0, a)), o >= h)
    o -= h, a -= h, u = Y, f = null, _ = _ && _.removeBefore(n, 0, o);
  else if (o > i || h < l) {
    for (c = 0; f; ) {
      var b = o >>> u & Be;
      if (b !== h >>> u & Be)
        break;
      b && (c += (1 << u) * b), u -= Y, f = f.array[b];
    }
    f && o > i && (f = f.removeBefore(n, u, o - c)), f && h < l && (f = f.removeAfter(
      n,
      u,
      h - c
    )), c && (o -= c, a -= c);
  }
  return e.__ownerID ? (e.size = a - o, e._origin = o, e._capacity = a, e._level = u, e._root = f, e._tail = _, e.__hash = void 0, e.__altered = !0, e) : Ys(o, a, u, f, _);
}
function Xs(e) {
  return e < lt ? 0 : e - 1 >>> Y << Y;
}
var pr = /* @__PURE__ */ function(e) {
  function t(r) {
    return r == null ? gs() : wh(r) ? r : gs().withMutations(function(n) {
      var i = Vt(r);
      ut(i.size), i.forEach(function(s, o) {
        return n.set(o, s);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.prototype.toString = function() {
    return this.__toString("OrderedMap {", "}");
  }, t.prototype.get = function(n, i) {
    var s = this._map.get(n);
    return s !== void 0 ? this._list.get(s)[1] : i;
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._map.clear(), this._list.clear(), this.__altered = !0, this) : gs();
  }, t.prototype.set = function(n, i) {
    return i_(this, n, i);
  }, t.prototype.remove = function(n) {
    return i_(this, n, L);
  }, t.prototype.__iterate = function(n, i) {
    var s = this;
    return this._list.__iterate(
      function(o) {
        return o && n(o[1], o[0], s);
      },
      i
    );
  }, t.prototype.__iterator = function(n, i) {
    return this._list.fromEntrySeq().__iterator(n, i);
  }, t.prototype.__ensureOwner = function(n) {
    if (n === this.__ownerID)
      return this;
    var i = this._map.__ensureOwner(n), s = this._list.__ensureOwner(n);
    return n ? zh(i, s, n, this.__hash) : this.size === 0 ? gs() : (this.__ownerID = n, this.__altered = !1, this._map = i, this._list = s, this);
  }, t;
}(Qn);
pr.isOrderedMap = wh;
pr.prototype[un] = !0;
pr.prototype[Ro] = pr.prototype.remove;
function zh(e, t, r, n) {
  var i = Object.create(pr.prototype);
  return i.size = e ? e.size : 0, i._map = e, i._list = t, i.__ownerID = r, i.__hash = n, i.__altered = !1, i;
}
var n_;
function gs() {
  return n_ || (n_ = zh(ar(), ma()));
}
function i_(e, t, r) {
  var n = e._map, i = e._list, s = n.get(t), o = s !== void 0, a, u;
  if (r === L) {
    if (!o)
      return e;
    i.size >= lt && i.size >= n.size * 2 ? (u = i.filter(function(f, c) {
      return f !== void 0 && s !== c;
    }), a = u.toKeyedSeq().map(function(f) {
      return f[0];
    }).flip().toMap(), e.__ownerID && (a.__ownerID = u.__ownerID = e.__ownerID)) : (a = n.remove(t), u = s === i.size - 1 ? i.pop() : i.set(s, void 0));
  } else if (o) {
    if (r === i.get(s)[1])
      return e;
    a = n, u = i.set(s, [t, r]);
  } else
    a = n.set(t, i.size), u = i.set(i.size, [t, r]);
  return e.__ownerID ? (e.size = a.size, e._map = a, e._list = u, e.__hash = void 0, e.__altered = !0, e) : zh(a, u);
}
var Aw = "@@__IMMUTABLE_STACK__@@";
function ja(e) {
  return !!(e && // @ts-expect-error: maybeStack is typed as `{}`, need to change in 6.0 to `maybeStack && typeof maybeStack === 'object' && MAYBE_STACK_SYMBOL in maybeStack`
  e[Aw]);
}
var Xu = /* @__PURE__ */ function(e) {
  function t(r) {
    return r == null ? ia() : ja(r) ? r : ia().pushAll(r);
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.prototype.toString = function() {
    return this.__toString("Stack [", "]");
  }, t.prototype.get = function(n, i) {
    var s = this._head;
    for (n = an(this, n); s && n--; )
      s = s.next;
    return s ? s.value : i;
  }, t.prototype.peek = function() {
    return this._head && this._head.value;
  }, t.prototype.push = function() {
    var n = arguments;
    if (arguments.length === 0)
      return this;
    for (var i = this.size + arguments.length, s = this._head, o = arguments.length - 1; o >= 0; o--)
      s = {
        value: n[o],
        next: s
      };
    return this.__ownerID ? (this.size = i, this._head = s, this.__hash = void 0, this.__altered = !0, this) : ys(i, s);
  }, t.prototype.pushAll = function(n) {
    if (n = e(n), n.size === 0)
      return this;
    if (this.size === 0 && ja(n))
      return n;
    ut(n.size);
    var i = this.size, s = this._head;
    return n.__iterate(
      function(o) {
        i++, s = {
          value: o,
          next: s
        };
      },
      /* reverse */
      !0
    ), this.__ownerID ? (this.size = i, this._head = s, this.__hash = void 0, this.__altered = !0, this) : ys(i, s);
  }, t.prototype.pop = function() {
    return this.slice(1);
  }, t.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._head = void 0, this.__hash = void 0, this.__altered = !0, this) : ia();
  }, t.prototype.slice = function(n, i) {
    if (To(n, i, this.size))
      return this;
    var s = Zi(n, this.size), o = Po(i, this.size);
    if (o !== this.size)
      return e.prototype.slice.call(this, n, i);
    for (var a = this.size - s, u = this._head; s--; )
      u = u.next;
    return this.__ownerID ? (this.size = a, this._head = u, this.__hash = void 0, this.__altered = !0, this) : ys(a, u);
  }, t.prototype.__ensureOwner = function(n) {
    return n === this.__ownerID ? this : n ? ys(this.size, this._head, n, this.__hash) : this.size === 0 ? ia() : (this.__ownerID = n, this.__altered = !1, this);
  }, t.prototype.__iterate = function(n, i) {
    var s = this;
    if (i)
      return new Ti(this.toArray()).__iterate(
        function(u, f) {
          return n(u, f, s);
        },
        i
      );
    for (var o = 0, a = this._head; a && n(a.value, o++, this) !== !1; )
      a = a.next;
    return o;
  }, t.prototype.__iterator = function(n, i) {
    if (i)
      return new Ti(this.toArray()).__iterator(n, i);
    var s = 0, o = this._head;
    return new j(function() {
      if (o) {
        var a = o.value;
        return o = o.next, te(n, s++, a);
      }
      return De();
    });
  }, t;
}(Jn);
Xu.isStack = ja;
var We = Xu.prototype;
We[Aw] = !0;
We.shift = We.pop;
We.unshift = We.push;
We.unshiftAll = We.pushAll;
We.withMutations = Mo;
We.wasAltered = Ch;
We.asImmutable = Do;
We["@@transducer/init"] = We.asMutable = Io;
We["@@transducer/step"] = function(e, t) {
  return e.unshift(t);
};
We["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
function ys(e, t, r, n) {
  var i = Object.create(We);
  return i.size = e, i._head = t, i.__ownerID = r, i.__hash = n, i.__altered = !1, i;
}
var s_;
function ia() {
  return s_ || (s_ = ys(0));
}
var Ow = "@@__IMMUTABLE_SET__@@";
function Ju(e) {
  return !!(e && // @ts-expect-error: maybeSet is typed as `{}`,  need to change in 6.0 to `maybeSeq && typeof maybeSet === 'object' && MAYBE_SET_SYMBOL in maybeSet`
  e[Ow]);
}
function Uh(e) {
  return Ju(e) && Yt(e);
}
function Vh(e, t) {
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
  var r = !ku(e);
  if (Yt(e)) {
    var n = e.entries();
    return t.every(function(u, f) {
      var c = n.next().value;
      return c && we(c[1], u) && (r || we(c[0], f));
    }) && n.next().done;
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
      if (r ? (
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
function ei(e, t) {
  var r = function(n) {
    e.prototype[n] = t[n];
  };
  return Object.keys(t).forEach(r), Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(t).forEach(r), e;
}
function Fa(e) {
  if (!e || typeof e != "object")
    return e;
  if (!it(e)) {
    if (!fn(e))
      return e;
    e = Ce(e);
  }
  if (J(e)) {
    var t = {};
    return e.__iterate(function(n, i) {
      t[i] = Fa(n);
    }), t;
  }
  var r = [];
  return e.__iterate(function(n) {
    r.push(Fa(n));
  }), r;
}
var Lo = /* @__PURE__ */ function(e) {
  function t(r) {
    return r == null ? bs() : Ju(r) && !Yt(r) ? r : bs().withMutations(function(n) {
      var i = e(r);
      ut(i.size), i.forEach(function(s) {
        return n.add(s);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.fromKeys = function(n) {
    return this(Vt(n).keySeq());
  }, t.intersect = function(n) {
    return n = Oe(n).toArray(), n.length ? xe.intersect.apply(t(n.pop()), n) : bs();
  }, t.union = function(n) {
    return n = Oe(n).toArray(), n.length ? xe.union.apply(t(n.pop()), n) : bs();
  }, t.prototype.toString = function() {
    return this.__toString("Set {", "}");
  }, t.prototype.has = function(n) {
    return this._map.has(n);
  }, t.prototype.add = function(n) {
    return sa(this, this._map.set(n, n));
  }, t.prototype.remove = function(n) {
    return sa(this, this._map.remove(n));
  }, t.prototype.clear = function() {
    return sa(this, this._map.clear());
  }, t.prototype.map = function(n, i) {
    var s = this, o = !1, a = sa(
      this,
      this._map.mapEntries(function(u) {
        var f = u[1], c = n.call(i, f, f, s);
        return c !== f && (o = !0), [c, c];
      }, i)
    );
    return o ? a : this;
  }, t.prototype.union = function() {
    for (var n = [], i = arguments.length; i--; ) n[i] = arguments[i];
    return n = n.filter(function(s) {
      return s.size !== 0;
    }), n.length === 0 ? this : this.size === 0 && !this.__ownerID && n.length === 1 ? this.constructor(n[0]) : this.withMutations(function(s) {
      for (var o = 0; o < n.length; o++)
        typeof n[o] == "string" ? s.add(n[o]) : e(n[o]).forEach(function(a) {
          return s.add(a);
        });
    });
  }, t.prototype.intersect = function() {
    for (var n = [], i = arguments.length; i--; ) n[i] = arguments[i];
    if (n.length === 0)
      return this;
    n = n.map(function(o) {
      return e(o);
    });
    var s = [];
    return this.forEach(function(o) {
      n.every(function(a) {
        return a.includes(o);
      }) || s.push(o);
    }), this.withMutations(function(o) {
      s.forEach(function(a) {
        o.remove(a);
      });
    });
  }, t.prototype.subtract = function() {
    for (var n = [], i = arguments.length; i--; ) n[i] = arguments[i];
    if (n.length === 0)
      return this;
    n = n.map(function(o) {
      return e(o);
    });
    var s = [];
    return this.forEach(function(o) {
      n.some(function(a) {
        return a.includes(o);
      }) && s.push(o);
    }), this.withMutations(function(o) {
      s.forEach(function(a) {
        o.remove(a);
      });
    });
  }, t.prototype.sort = function(n) {
    return Di(Pi(this, n));
  }, t.prototype.sortBy = function(n, i) {
    return Di(Pi(this, i, n));
  }, t.prototype.wasAltered = function() {
    return this._map.wasAltered();
  }, t.prototype.__iterate = function(n, i) {
    var s = this;
    return this._map.__iterate(function(o) {
      return n(o, o, s);
    }, i);
  }, t.prototype.__iterator = function(n, i) {
    return this._map.__iterator(n, i);
  }, t.prototype.__ensureOwner = function(n) {
    if (n === this.__ownerID)
      return this;
    var i = this._map.__ensureOwner(n);
    return n ? this.__make(i, n) : this.size === 0 ? this.__empty() : (this.__ownerID = n, this._map = i, this);
  }, t;
}(Qi);
Lo.isSet = Ju;
var xe = Lo.prototype;
xe[Ow] = !0;
xe[Ro] = xe.remove;
xe.merge = xe.concat = xe.union;
xe.withMutations = Mo;
xe.asImmutable = Do;
xe["@@transducer/init"] = xe.asMutable = Io;
xe["@@transducer/step"] = function(e, t) {
  return e.add(t);
};
xe["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
xe.__empty = bs;
xe.__make = Ew;
function sa(e, t) {
  return e.__ownerID ? (e.size = t.size, e._map = t, e) : t === e._map ? e : t.size === 0 ? e.__empty() : e.__make(t);
}
function Ew(e, t) {
  var r = Object.create(xe);
  return r.size = e ? e.size : 0, r._map = e, r.__ownerID = t, r;
}
var o_;
function bs() {
  return o_ || (o_ = Ew(ar()));
}
var Sw = /* @__PURE__ */ function(e) {
  function t(r, n, i) {
    if (i === void 0 && (i = 1), !(this instanceof t))
      return new t(r, n, i);
    if (Ss(i !== 0, "Cannot step a Range by 0"), Ss(
      r !== void 0,
      "You must define a start value when using Range"
    ), Ss(
      n !== void 0,
      "You must define an end value when using Range"
    ), i = Math.abs(i), n < r && (i = -i), this._start = r, this._end = n, this._step = i, this.size = Math.max(0, Math.ceil((n - r) / i - 1) + 1), this.size === 0) {
      if (Lf)
        return Lf;
      Lf = this;
    }
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.size === 0 ? "Range []" : "Range [ " + this._start + "..." + this._end + (this._step !== 1 ? " by " + this._step : "") + " ]";
  }, t.prototype.get = function(n, i) {
    return this.has(n) ? this._start + an(this, n) * this._step : i;
  }, t.prototype.includes = function(n) {
    var i = (n - this._start) / this._step;
    return i >= 0 && i < this.size && i === Math.floor(i);
  }, t.prototype.slice = function(n, i) {
    return To(n, i, this.size) ? this : (n = Zi(n, this.size), i = Po(i, this.size), i <= n ? new t(0, 0) : new t(
      this.get(n, this._end),
      this.get(i, this._end),
      this._step
    ));
  }, t.prototype.indexOf = function(n) {
    var i = n - this._start;
    if (i % this._step === 0) {
      var s = i / this._step;
      if (s >= 0 && s < this.size)
        return s;
    }
    return -1;
  }, t.prototype.lastIndexOf = function(n) {
    return this.indexOf(n);
  }, t.prototype.__iterate = function(n, i) {
    for (var s = this.size, o = this._step, a = i ? this._start + (s - 1) * o : this._start, u = 0; u !== s && n(a, i ? s - ++u : u++, this) !== !1; )
      a += i ? -o : o;
    return u;
  }, t.prototype.__iterator = function(n, i) {
    var s = this.size, o = this._step, a = i ? this._start + (s - 1) * o : this._start, u = 0;
    return new j(function() {
      if (u === s)
        return De();
      var f = a;
      return a += i ? -o : o, te(n, i ? s - ++u : u++, f);
    });
  }, t.prototype.equals = function(n) {
    return n instanceof t ? this._start === n._start && this._end === n._end && this._step === n._step : Vh(this, n);
  }, t;
}(Wt), Lf;
function kh(e, t, r) {
  for (var n = ow(t), i = 0; i !== n.length; )
    if (e = Rh(e, n[i++], L), e === L)
      return r;
  return e;
}
function xw(e, t) {
  return kh(this, e, t);
}
function Rw(e, t) {
  return kh(e, t, L) !== L;
}
function uL(e) {
  return Rw(this, e);
}
function Tw() {
  ut(this.size);
  var e = {};
  return this.__iterate(function(t, r) {
    e[r] = t;
  }), e;
}
Oe.Iterator = j;
ei(Oe, {
  // ### Conversion to other types
  toArray: function() {
    ut(this.size);
    var t = new Array(this.size || 0), r = J(this), n = 0;
    return this.__iterate(function(i, s) {
      t[n++] = r ? [s, i] : i;
    }), t;
  },
  toIndexedSeq: function() {
    return new J1(this);
  },
  toJS: function() {
    return Fa(this);
  },
  toKeyedSeq: function() {
    return new Yu(this, !0);
  },
  toMap: function() {
    return Qn(this.toKeyedSeq());
  },
  toObject: Tw,
  toOrderedMap: function() {
    return pr(this.toKeyedSeq());
  },
  toOrderedSet: function() {
    return Di(J(this) ? this.valueSeq() : this);
  },
  toSet: function() {
    return Lo(J(this) ? this.valueSeq() : this);
  },
  toSetSeq: function() {
    return new Z1(this);
  },
  toSeq: function() {
    return st(this) ? this.toIndexedSeq() : J(this) ? this.toKeyedSeq() : this.toSetSeq();
  },
  toStack: function() {
    return Xu(J(this) ? this.valueSeq() : this);
  },
  toList: function() {
    return Co(J(this) ? this.valueSeq() : this);
  },
  // ### Common JavaScript methods and properties
  toString: function() {
    return "[Collection]";
  },
  __toString: function(t, r) {
    return this.size === 0 ? t + r : t + " " + this.toSeq().map(this.__toStringMapper).join(", ") + " " + r;
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  concat: function() {
    for (var t = [], r = arguments.length; r--; ) t[r] = arguments[r];
    return K(this, VC(this, t));
  },
  includes: function(t) {
    return this.some(function(r) {
      return we(r, t);
    });
  },
  entries: function() {
    return this.__iterator(Et);
  },
  every: function(t, r) {
    ut(this.size);
    var n = !0;
    return this.__iterate(function(i, s, o) {
      if (!t.call(r, i, s, o))
        return n = !1, !1;
    }), n;
  },
  filter: function(t, r) {
    return K(this, rw(this, t, r, !0));
  },
  partition: function(t, r) {
    return BC(this, t, r);
  },
  find: function(t, r, n) {
    var i = this.findEntry(t, r);
    return i ? i[1] : n;
  },
  forEach: function(t, r) {
    return ut(this.size), this.__iterate(r ? t.bind(r) : t);
  },
  join: function(t) {
    ut(this.size), t = t !== void 0 ? "" + t : ",";
    var r = "", n = !0;
    return this.__iterate(function(i) {
      n ? n = !1 : r += t, r += i != null ? i.toString() : "";
    }), r;
  },
  keys: function() {
    return this.__iterator(es);
  },
  map: function(t, r) {
    return K(this, tw(this, t, r));
  },
  reduce: function(t, r, n) {
    return a_(
      this,
      t,
      r,
      n,
      arguments.length < 2,
      !1
    );
  },
  reduceRight: function(t, r, n) {
    return a_(
      this,
      t,
      r,
      n,
      arguments.length < 2,
      !0
    );
  },
  reverse: function() {
    return K(this, Ah(this, !0));
  },
  slice: function(t, r) {
    return K(this, Oh(this, t, r, !0));
  },
  some: function(t, r) {
    ut(this.size);
    var n = !1;
    return this.__iterate(function(i, s, o) {
      if (t.call(r, i, s, o))
        return n = !0, !1;
    }), n;
  },
  sort: function(t) {
    return K(this, Pi(this, t));
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
  count: function(t, r) {
    return Ri(
      t ? this.toSeq().filter(t, r) : this
    );
  },
  countBy: function(t, r) {
    return jC(this, t, r);
  },
  equals: function(t) {
    return Vh(this, t);
  },
  entrySeq: function() {
    var t = this;
    if (t._cache)
      return new Ti(t._cache);
    var r = t.toSeq().map(cL).toIndexedSeq();
    return r.fromEntrySeq = function() {
      return t.toSeq();
    }, r;
  },
  filterNot: function(t, r) {
    return this.filter(jf(t), r);
  },
  findEntry: function(t, r, n) {
    var i = n;
    return this.__iterate(function(s, o, a) {
      if (t.call(r, s, o, a))
        return i = [o, s], !1;
    }), i;
  },
  findKey: function(t, r) {
    var n = this.findEntry(t, r);
    return n && n[0];
  },
  findLast: function(t, r, n) {
    return this.toKeyedSeq().reverse().find(t, r, n);
  },
  findLastEntry: function(t, r, n) {
    return this.toKeyedSeq().reverse().findEntry(t, r, n);
  },
  findLastKey: function(t, r) {
    return this.toKeyedSeq().reverse().findKey(t, r);
  },
  first: function(t) {
    return this.find(U1, null, t);
  },
  flatMap: function(t, r) {
    return K(this, kC(this, t, r));
  },
  flatten: function(t) {
    return K(this, iw(this, t, !0));
  },
  fromEntrySeq: function() {
    return new Q1(this);
  },
  get: function(t, r) {
    return this.find(function(n, i) {
      return we(i, t);
    }, void 0, r);
  },
  getIn: xw,
  groupBy: function(t, r) {
    return FC(this, t, r);
  },
  has: function(t) {
    return this.get(t, L) !== L;
  },
  hasIn: uL,
  isSubset: function(t) {
    return t = typeof t.includes == "function" ? t : Oe(t), this.every(function(r) {
      return t.includes(r);
    });
  },
  isSuperset: function(t) {
    return t = typeof t.isSubset == "function" ? t : Oe(t), t.isSubset(this);
  },
  keyOf: function(t) {
    return this.findKey(function(r) {
      return we(r, t);
    });
  },
  keySeq: function() {
    return this.toSeq().map(fL).toIndexedSeq();
  },
  last: function(t) {
    return this.toSeq().reverse().first(t);
  },
  lastKeyOf: function(t) {
    return this.toKeyedSeq().reverse().keyOf(t);
  },
  max: function(t) {
    return ra(this, t);
  },
  maxBy: function(t, r) {
    return ra(this, r, t);
  },
  min: function(t) {
    return ra(
      this,
      t ? u_(t) : c_
    );
  },
  minBy: function(t, r) {
    return ra(
      this,
      r ? u_(r) : c_,
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
  skipWhile: function(t, r) {
    return K(this, nw(this, t, r, !0));
  },
  skipUntil: function(t, r) {
    return this.skipWhile(jf(t), r);
  },
  sortBy: function(t, r) {
    return K(this, Pi(this, r, t));
  },
  take: function(t) {
    return this.slice(0, Math.max(0, t));
  },
  takeLast: function(t) {
    return this.slice(-Math.max(0, t));
  },
  takeWhile: function(t, r) {
    return K(this, zC(this, t, r));
  },
  takeUntil: function(t, r) {
    return this.takeWhile(jf(t), r);
  },
  update: function(t) {
    return t(this);
  },
  valueSeq: function() {
    return this.toIndexedSeq();
  },
  // ### Hashable Object
  hashCode: function() {
    return this.__hash || (this.__hash = lL(this));
  }
  // ### Internal
  // abstract __iterate(fn, reverse)
  // abstract __iterator(type, reverse)
});
var Le = Oe.prototype;
Le[W1] = !0;
Le[qu] = Le.values;
Le.toJSON = Le.toArray;
Le.__toStringMapper = Gs;
Le.inspect = Le.toSource = function() {
  return this.toString();
};
Le.chain = Le.flatMap;
Le.contains = Le.includes;
ei(Vt, {
  // ### More sequential methods
  flip: function() {
    return K(this, ew(this));
  },
  mapEntries: function(t, r) {
    var n = this, i = 0;
    return K(
      this,
      this.toSeq().map(function(s, o) {
        return t.call(r, [o, s], i++, n);
      }).fromEntrySeq()
    );
  },
  mapKeys: function(t, r) {
    var n = this;
    return K(
      this,
      this.toSeq().flip().map(function(i, s) {
        return t.call(r, i, s, n);
      }).flip()
    );
  }
});
var jo = Vt.prototype;
jo[Da] = !0;
jo[qu] = Le.entries;
jo.toJSON = Tw;
jo.__toStringMapper = function(e, t) {
  return Gs(t) + ": " + Gs(e);
};
ei(Jn, {
  // ### Conversion to other types
  toKeyedSeq: function() {
    return new Yu(this, !1);
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  filter: function(t, r) {
    return K(this, rw(this, t, r, !1));
  },
  findIndex: function(t, r) {
    var n = this.findEntry(t, r);
    return n ? n[0] : -1;
  },
  indexOf: function(t) {
    var r = this.keyOf(t);
    return r === void 0 ? -1 : r;
  },
  lastIndexOf: function(t) {
    var r = this.lastKeyOf(t);
    return r === void 0 ? -1 : r;
  },
  reverse: function() {
    return K(this, Ah(this, !1));
  },
  slice: function(t, r) {
    return K(this, Oh(this, t, r, !1));
  },
  splice: function(t, r) {
    var n = arguments.length;
    if (r = Math.max(r || 0, 0), n === 0 || n === 2 && !r)
      return this;
    t = Zi(t, t < 0 ? this.count() : this.size);
    var i = this.slice(0, t);
    return K(
      this,
      n === 1 ? i : i.concat(sr(arguments, 2), this.slice(t + r))
    );
  },
  // ### More collection methods
  findLastIndex: function(t, r) {
    var n = this.findLastEntry(t, r);
    return n ? n[0] : -1;
  },
  first: function(t) {
    return this.get(0, t);
  },
  flatten: function(t) {
    return K(this, iw(this, t, !1));
  },
  get: function(t, r) {
    return t = an(this, t), t < 0 || this.size === 1 / 0 || this.size !== void 0 && t > this.size ? r : this.find(function(n, i) {
      return i === t;
    }, void 0, r);
  },
  has: function(t) {
    return t = an(this, t), t >= 0 && (this.size !== void 0 ? this.size === 1 / 0 || t < this.size : this.indexOf(t) !== -1);
  },
  interpose: function(t) {
    return K(this, WC(this, t));
  },
  interleave: function() {
    var t = [this].concat(sr(arguments)), r = na(this.toSeq(), Wt.of, t), n = r.flatten(!0);
    return r.size && (n.size = r.size * t.length), K(this, n);
  },
  keySeq: function() {
    return Sw(0, this.size);
  },
  last: function(t) {
    return this.get(-1, t);
  },
  skipWhile: function(t, r) {
    return K(this, nw(this, t, r, !1));
  },
  zip: function() {
    var t = [this].concat(sr(arguments));
    return K(this, na(this, f_, t));
  },
  zipAll: function() {
    var t = [this].concat(sr(arguments));
    return K(this, na(this, f_, t, !0));
  },
  zipWith: function(t) {
    var r = sr(arguments);
    return r[0] = this, K(this, na(this, t, r));
  }
});
var ns = Jn.prototype;
ns[Ca] = !0;
ns[un] = !0;
ei(Qi, {
  // ### ES6 Collection methods (ES6 Array and Map)
  get: function(t, r) {
    return this.has(t) ? t : r;
  },
  includes: function(t) {
    return this.has(t);
  },
  // ### More sequential methods
  keySeq: function() {
    return this.valueSeq();
  }
});
var Ii = Qi.prototype;
Ii.has = Le.includes;
Ii.contains = Ii.includes;
Ii.keys = Ii.values;
ei(yn, jo);
ei(Wt, ns);
ei(rs, Ii);
function a_(e, t, r, n, i, s) {
  return ut(e.size), e.__iterate(function(o, a, u) {
    i ? (i = !1, r = o) : r = t.call(n, r, o, a, u);
  }, s), r;
}
function fL(e, t) {
  return t;
}
function cL(e, t) {
  return [t, e];
}
function jf(e) {
  return function() {
    return !e.apply(this, arguments);
  };
}
function u_(e) {
  return function() {
    return -e.apply(this, arguments);
  };
}
function f_() {
  return sr(arguments);
}
function c_(e, t) {
  return e < t ? 1 : e > t ? -1 : 0;
}
function lL(e) {
  if (e.size === 1 / 0)
    return 0;
  var t = Yt(e), r = J(e), n = t ? 1 : 0;
  return e.__iterate(
    r ? t ? function(i, s) {
      n = 31 * n + l_(Je(i), Je(s)) | 0;
    } : function(i, s) {
      n = n + l_(Je(i), Je(s)) | 0;
    } : t ? function(i) {
      n = 31 * n + Je(i) | 0;
    } : function(i) {
      n = n + Je(i) | 0;
    }
  ), hL(e.size, n);
}
function hL(e, t) {
  return t = ps(t, 3432918353), t = ps(t << 15 | t >>> -15, 461845907), t = ps(t << 13 | t >>> -13, 5), t = (t + 3864292196 | 0) ^ e, t = ps(t ^ t >>> 16, 2246822507), t = ps(t ^ t >>> 13, 3266489909), t = Ku(t ^ t >>> 16), t;
}
function l_(e, t) {
  return e ^ t + 2654435769 + (e << 6) + (e >> 2) | 0;
}
var Di = /* @__PURE__ */ function(e) {
  function t(r) {
    return r == null ? Mc() : Uh(r) ? r : Mc().withMutations(function(n) {
      var i = Qi(r);
      ut(i.size), i.forEach(function(s) {
        return n.add(s);
      });
    });
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.of = function() {
    return this(arguments);
  }, t.fromKeys = function(n) {
    return this(Vt(n).keySeq());
  }, t.prototype.toString = function() {
    return this.__toString("OrderedSet {", "}");
  }, t;
}(Lo);
Di.isOrderedSet = Uh;
var ti = Di.prototype;
ti[un] = !0;
ti.zip = ns.zip;
ti.zipWith = ns.zipWith;
ti.zipAll = ns.zipAll;
ti.__empty = Mc;
ti.__make = Pw;
function Pw(e, t) {
  var r = Object.create(ti);
  return r.size = e ? e.size : 0, r._map = e, r.__ownerID = t, r;
}
var h_;
function Mc() {
  return h_ || (h_ = Pw(gs()));
}
var pL = {
  LeftThenRight: -1,
  RightThenLeft: 1
};
function dL(e) {
  if (gn(e))
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
var ve = function(t, r) {
  var n;
  dL(t);
  var i = function(a) {
    var u = this;
    if (a instanceof i)
      return a;
    if (!(this instanceof i))
      return new i(a);
    if (!n) {
      n = !0;
      var f = Object.keys(t), c = s._indices = {};
      s._name = r, s._keys = f, s._defaultValues = t;
      for (var l = 0; l < f.length; l++) {
        var h = f[l];
        c[h] = l, s[h] ? typeof console == "object" && console.warn && console.warn(
          "Cannot define " + qh(this) + ' with property "' + h + '" since that property name is part of the Record API.'
        ) : _L(s, h);
      }
    }
    return this.__ownerID = void 0, this._values = Co().withMutations(function(d) {
      d.setSize(u._keys.length), Vt(a).forEach(function(_, v) {
        d.set(u._indices[v], _ === u._defaultValues[v] ? void 0 : _);
      });
    }), this;
  }, s = i.prototype = Object.create(Z);
  return s.constructor = i, r && (i.displayName = r), i;
};
ve.prototype.toString = function() {
  for (var t = qh(this) + " { ", r = this._keys, n, i = 0, s = r.length; i !== s; i++)
    n = r[i], t += (i ? ", " : "") + n + ": " + Gs(this.get(n));
  return t + " }";
};
ve.prototype.equals = function(t) {
  return this === t || gn(t) && Ci(this).equals(Ci(t));
};
ve.prototype.hashCode = function() {
  return Ci(this).hashCode();
};
ve.prototype.has = function(t) {
  return this._indices.hasOwnProperty(t);
};
ve.prototype.get = function(t, r) {
  if (!this.has(t))
    return r;
  var n = this._indices[t], i = this._values.get(n);
  return i === void 0 ? this._defaultValues[t] : i;
};
ve.prototype.set = function(t, r) {
  if (this.has(t)) {
    var n = this._values.set(
      this._indices[t],
      r === this._defaultValues[t] ? void 0 : r
    );
    if (n !== this._values && !this.__ownerID)
      return Wh(this, n);
  }
  return this;
};
ve.prototype.remove = function(t) {
  return this.set(t);
};
ve.prototype.clear = function() {
  var t = this._values.clear().setSize(this._keys.length);
  return this.__ownerID ? this : Wh(this, t);
};
ve.prototype.wasAltered = function() {
  return this._values.wasAltered();
};
ve.prototype.toSeq = function() {
  return Ci(this);
};
ve.prototype.toJS = function() {
  return Fa(this);
};
ve.prototype.entries = function() {
  return this.__iterator(Et);
};
ve.prototype.__iterator = function(t, r) {
  return Ci(this).__iterator(t, r);
};
ve.prototype.__iterate = function(t, r) {
  return Ci(this).__iterate(t, r);
};
ve.prototype.__ensureOwner = function(t) {
  if (t === this.__ownerID)
    return this;
  var r = this._values.__ensureOwner(t);
  return t ? Wh(this, r, t) : (this.__ownerID = t, this._values = r, this);
};
ve.isRecord = gn;
ve.getDescriptiveName = qh;
var Z = ve.prototype;
Z[G1] = !0;
Z[Ro] = Z.remove;
Z.deleteIn = Z.removeIn = Ph;
Z.getIn = xw;
Z.hasIn = Le.hasIn;
Z.merge = pw;
Z.mergeWith = dw;
Z.mergeIn = Ih;
Z.mergeDeep = vw;
Z.mergeDeepWith = gw;
Z.mergeDeepIn = Dh;
Z.setIn = Th;
Z.update = $h;
Z.updateIn = Mh;
Z.withMutations = Mo;
Z.asMutable = Io;
Z.asImmutable = Do;
Z[qu] = Z.entries;
Z.toJSON = Z.toObject = Le.toObject;
Z.inspect = Z.toSource = function() {
  return this.toString();
};
function Wh(e, t, r) {
  var n = Object.create(Object.getPrototypeOf(e));
  return n._values = t, n.__ownerID = r, n;
}
function qh(e) {
  return e.constructor.displayName || e.constructor.name || "Record";
}
function Ci(e) {
  return bh(e._keys.map(function(t) {
    return [t, e.get(t)];
  }));
}
function _L(e, t) {
  try {
    Object.defineProperty(e, t, {
      get: function() {
        return this.get(t);
      },
      set: function(r) {
        Ss(this.__ownerID, "Cannot set on an immutable record."), this.set(t, r);
      }
    });
  } catch {
  }
}
var vL = /* @__PURE__ */ function(e) {
  function t(r, n) {
    if (!(this instanceof t))
      return new t(r, n);
    if (this._value = r, this.size = n === void 0 ? 1 / 0 : Math.max(0, n), this.size === 0) {
      if (Ff)
        return Ff;
      Ff = this;
    }
  }
  return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
    return this.size === 0 ? "Repeat []" : "Repeat [ " + this._value + " " + this.size + " times ]";
  }, t.prototype.get = function(n, i) {
    return this.has(n) ? this._value : i;
  }, t.prototype.includes = function(n) {
    return we(this._value, n);
  }, t.prototype.slice = function(n, i) {
    var s = this.size;
    return To(n, i, s) ? this : new t(
      this._value,
      Po(i, s) - Zi(n, s)
    );
  }, t.prototype.reverse = function() {
    return this;
  }, t.prototype.indexOf = function(n) {
    return we(this._value, n) ? 0 : -1;
  }, t.prototype.lastIndexOf = function(n) {
    return we(this._value, n) ? this.size : -1;
  }, t.prototype.__iterate = function(n, i) {
    for (var s = this.size, o = 0; o !== s && n(this._value, i ? s - ++o : o++, this) !== !1; )
      ;
    return o;
  }, t.prototype.__iterator = function(n, i) {
    var s = this, o = this.size, a = 0;
    return new j(
      function() {
        return a === o ? De() : te(n, i ? o - ++a : a++, s._value);
      }
    );
  }, t.prototype.equals = function(n) {
    return n instanceof t ? we(this._value, n._value) : Vh(this, n);
  }, t;
}(Wt), Ff;
function gL(e, t) {
  return Nw(
    [],
    t || yL,
    e,
    "",
    t && t.length > 2 ? [] : void 0,
    { "": e }
  );
}
function Nw(e, t, r, n, i, s) {
  if (typeof r != "string" && !kt(r) && (vh(r) || _h(r) || xh(r))) {
    if (~e.indexOf(r))
      throw new TypeError("Cannot convert circular structure to Immutable");
    e.push(r), i && n !== "" && i.push(n);
    var o = t.call(
      s,
      n,
      Ce(r).map(
        function(a, u) {
          return Nw(e, t, a, u, i, r);
        }
      ),
      i && i.slice()
    );
    return e.pop(), i && i.pop(), o;
  }
  return r;
}
function yL(e, t) {
  return st(t) ? t.toList() : J(t) ? t.toMap() : t.toSet();
}
var bL = "5.1.3", mL = Oe;
const Xz = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Collection: Oe,
  Iterable: mL,
  List: Co,
  Map: Qn,
  OrderedMap: pr,
  OrderedSet: Di,
  PairSorting: pL,
  Range: Sw,
  Record: ve,
  Repeat: vL,
  Seq: Ce,
  Set: Lo,
  Stack: Xu,
  fromJS: gL,
  get: Rh,
  getIn: kh,
  has: aw,
  hasIn: Rw,
  hash: Je,
  is: we,
  isAssociative: ku,
  isCollection: it,
  isImmutable: kt,
  isIndexed: st,
  isKeyed: J,
  isList: Bh,
  isMap: Hu,
  isOrdered: Yt,
  isOrderedMap: wh,
  isOrderedSet: Uh,
  isPlainObject: xh,
  isRecord: gn,
  isSeq: Wu,
  isSet: Ju,
  isStack: ja,
  isValueObject: Rc,
  merge: GC,
  mergeDeep: KC,
  mergeDeepWith: YC,
  mergeWith: HC,
  remove: uw,
  removeIn: hw,
  set: fw,
  setIn: lw,
  update: Nh,
  updateIn: Zn,
  version: bL
}, Symbol.toStringTag, { value: "Module" }));
/**
* @vue/reactivity v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function wL(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const r of e.split(",")) t[r] = 1;
  return (r) => r in t;
}
const AL = Object.freeze({}), OL = () => {
}, Ba = Object.assign, EL = (e, t) => {
  const r = e.indexOf(t);
  r > -1 && e.splice(r, 1);
}, SL = Object.prototype.hasOwnProperty, za = (e, t) => SL.call(e, t), Lr = Array.isArray, mi = (e) => Zu(e) === "[object Map]", xL = (e) => Zu(e) === "[object Set]", Js = (e) => typeof e == "function", RL = (e) => typeof e == "string", Fo = (e) => typeof e == "symbol", Ln = (e) => e !== null && typeof e == "object", TL = Object.prototype.toString, Zu = (e) => TL.call(e), $w = (e) => Zu(e).slice(8, -1), PL = (e) => Zu(e) === "[object Object]", Gh = (e) => RL(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, NL = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => t[r] || (t[r] = e(r));
}, $L = NL((e) => e.charAt(0).toUpperCase() + e.slice(1)), Qr = (e, t) => !Object.is(e, t), ML = (e, t, r, n = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: n,
    value: r
  });
};
function ot(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let $e;
class Mw {
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
      let t, r;
      if (this.scopes)
        for (t = 0, r = this.scopes.length; t < r; t++)
          this.scopes[t].pause();
      for (t = 0, r = this.effects.length; t < r; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, r;
      if (this.scopes)
        for (t = 0, r = this.scopes.length; t < r; t++)
          this.scopes[t].resume();
      for (t = 0, r = this.effects.length; t < r; t++)
        this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const r = $e;
      try {
        return $e = this, t();
      } finally {
        $e = r;
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
      let r, n;
      for (r = 0, n = this.effects.length; r < n; r++)
        this.effects[r].stop();
      for (this.effects.length = 0, r = 0, n = this.cleanups.length; r < n; r++)
        this.cleanups[r]();
      if (this.cleanups.length = 0, this.scopes) {
        for (r = 0, n = this.scopes.length; r < n; r++)
          this.scopes[r].stop(!0);
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
function IL(e) {
  return new Mw(e);
}
function Iw() {
  return $e;
}
function DL(e, t = !1) {
  $e ? $e.cleanups.push(e) : t || ot(
    "onScopeDispose() is called when there is no active effect scope to be associated with."
  );
}
let B;
const CL = {
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
}, Bf = /* @__PURE__ */ new WeakSet();
class Zs {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, $e && $e.active && $e.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Bf.has(this) && (Bf.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Cw(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, p_(this), Lw(this);
    const t = B, r = dt;
    B = this, dt = !0;
    try {
      return this.fn();
    } finally {
      B !== this && ot(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), jw(this), B = t, dt = r, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Yh(t);
      this.deps = this.depsTail = void 0, p_(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Bf.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Ic(this) && this.run();
  }
  get dirty() {
    return Ic(this);
  }
}
let Dw = 0, Rs, Ts;
function Cw(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Ts, Ts = e;
    return;
  }
  e.next = Rs, Rs = e;
}
function Hh() {
  Dw++;
}
function Kh() {
  if (--Dw > 0)
    return;
  if (Ts) {
    let t = Ts;
    for (Ts = void 0; t; ) {
      const r = t.next;
      t.next = void 0, t.flags &= -9, t = r;
    }
  }
  let e;
  for (; Rs; ) {
    let t = Rs;
    for (Rs = void 0; t; ) {
      const r = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (n) {
          e || (e = n);
        }
      t = r;
    }
  }
  if (e) throw e;
}
function Lw(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function jw(e) {
  let t, r = e.depsTail, n = r;
  for (; n; ) {
    const i = n.prevDep;
    n.version === -1 ? (n === r && (r = i), Yh(n), LL(n)) : t = n, n.dep.activeLink = n.prevActiveLink, n.prevActiveLink = void 0, n = i;
  }
  e.deps = t, e.depsTail = r;
}
function Ic(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Fw(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Fw(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Qs) || (e.globalVersion = Qs, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ic(e))))
    return;
  e.flags |= 2;
  const t = e.dep, r = B, n = dt;
  B = e, dt = !0;
  try {
    Lw(e);
    const i = e.fn(e._value);
    (t.version === 0 || Qr(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    B = r, dt = n, jw(e), e.flags &= -3;
  }
}
function Yh(e, t = !1) {
  const { dep: r, prevSub: n, nextSub: i } = e;
  if (n && (n.nextSub = i, e.prevSub = void 0), i && (i.prevSub = n, e.nextSub = void 0), r.subsHead === e && (r.subsHead = i), r.subs === e && (r.subs = n, !n && r.computed)) {
    r.computed.flags &= -5;
    for (let s = r.computed.deps; s; s = s.nextDep)
      Yh(s, !0);
  }
  !t && !--r.sc && r.map && r.map.delete(r.key);
}
function LL(e) {
  const { prevDep: t, nextDep: r } = e;
  t && (t.nextDep = r, e.prevDep = void 0), r && (r.prevDep = t, e.nextDep = void 0);
}
function jL(e, t) {
  e.effect instanceof Zs && (e = e.effect.fn);
  const r = new Zs(e);
  t && Ba(r, t);
  try {
    r.run();
  } catch (i) {
    throw r.stop(), i;
  }
  const n = r.run.bind(r);
  return n.effect = r, n;
}
function FL(e) {
  e.effect.stop();
}
let dt = !0;
const Xh = [];
function Jh() {
  Xh.push(dt), dt = !1;
}
function BL() {
  Xh.push(dt), dt = !0;
}
function Zh() {
  const e = Xh.pop();
  dt = e === void 0 ? !0 : e;
}
function zL(e, t = !1) {
  B instanceof Zs ? B.cleanup = e : t || ot(
    "onEffectCleanup() was called when there was no active effect to associate with."
  );
}
function p_(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const r = B;
    B = void 0;
    try {
      t();
    } finally {
      B = r;
    }
  }
}
let Qs = 0;
class UL {
  constructor(t, r) {
    this.sub = t, this.dep = r, this.version = r.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Qu {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(t) {
    if (!B || !dt || B === this.computed)
      return;
    let r = this.activeLink;
    if (r === void 0 || r.sub !== B)
      r = this.activeLink = new UL(B, this), B.deps ? (r.prevDep = B.depsTail, B.depsTail.nextDep = r, B.depsTail = r) : B.deps = B.depsTail = r, Bw(r);
    else if (r.version === -1 && (r.version = this.version, r.nextDep)) {
      const n = r.nextDep;
      n.prevDep = r.prevDep, r.prevDep && (r.prevDep.nextDep = n), r.prevDep = B.depsTail, r.nextDep = void 0, B.depsTail.nextDep = r, B.depsTail = r, B.deps === r && (B.deps = n);
    }
    return B.onTrack && B.onTrack(
      Ba(
        {
          effect: B
        },
        t
      )
    ), r;
  }
  trigger(t) {
    this.version++, Qs++, this.notify(t);
  }
  notify(t) {
    Hh();
    try {
      for (let r = this.subsHead; r; r = r.nextSub)
        r.sub.onTrigger && !(r.sub.flags & 8) && r.sub.onTrigger(
          Ba(
            {
              effect: r.sub
            },
            t
          )
        );
      for (let r = this.subs; r; r = r.prevSub)
        r.sub.notify() && r.sub.dep.notify();
    } finally {
      Kh();
    }
  }
}
function Bw(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let n = t.deps; n; n = n.nextDep)
        Bw(n);
    }
    const r = e.dep.subs;
    r !== e && (e.prevSub = r, r && (r.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const Ua = /* @__PURE__ */ new WeakMap(), en = Symbol(
  "Object iterate"
), Va = Symbol(
  "Map keys iterate"
), Li = Symbol(
  "Array iterate"
);
function Fe(e, t, r) {
  if (dt && B) {
    let n = Ua.get(e);
    n || Ua.set(e, n = /* @__PURE__ */ new Map());
    let i = n.get(r);
    i || (n.set(r, i = new Qu()), i.map = n, i.key = r), i.track({
      target: e,
      type: t,
      key: r
    });
  }
}
function Ir(e, t, r, n, i, s) {
  const o = Ua.get(e);
  if (!o) {
    Qs++;
    return;
  }
  const a = (u) => {
    u && u.trigger({
      target: e,
      type: t,
      key: r,
      newValue: n,
      oldValue: i,
      oldTarget: s
    });
  };
  if (Hh(), t === "clear")
    o.forEach(a);
  else {
    const u = Lr(e), f = u && Gh(r);
    if (u && r === "length") {
      const c = Number(n);
      o.forEach((l, h) => {
        (h === "length" || h === Li || !Fo(h) && h >= c) && a(l);
      });
    } else
      switch ((r !== void 0 || o.has(void 0)) && a(o.get(r)), f && a(o.get(Li)), t) {
        case "add":
          u ? f && a(o.get("length")) : (a(o.get(en)), mi(e) && a(o.get(Va)));
          break;
        case "delete":
          u || (a(o.get(en)), mi(e) && a(o.get(Va)));
          break;
        case "set":
          mi(e) && a(o.get(en));
          break;
      }
  }
  Kh();
}
function VL(e, t) {
  const r = Ua.get(e);
  return r && r.get(t);
}
function Sn(e) {
  const t = V(e);
  return t === e ? t : (Fe(t, "iterate", Li), Dt(e) ? t : t.map(Me));
}
function ef(e) {
  return Fe(e = V(e), "iterate", Li), e;
}
const kL = {
  __proto__: null,
  [Symbol.iterator]() {
    return zf(this, Symbol.iterator, Me);
  },
  concat(...e) {
    return Sn(this).concat(
      ...e.map((t) => Lr(t) ? Sn(t) : t)
    );
  },
  entries() {
    return zf(this, "entries", (e) => (e[1] = Me(e[1]), e));
  },
  every(e, t) {
    return Nr(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Nr(this, "filter", e, t, (r) => r.map(Me), arguments);
  },
  find(e, t) {
    return Nr(this, "find", e, t, Me, arguments);
  },
  findIndex(e, t) {
    return Nr(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Nr(this, "findLast", e, t, Me, arguments);
  },
  findLastIndex(e, t) {
    return Nr(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Nr(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Uf(this, "includes", e);
  },
  indexOf(...e) {
    return Uf(this, "indexOf", e);
  },
  join(e) {
    return Sn(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Uf(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Nr(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return ds(this, "pop");
  },
  push(...e) {
    return ds(this, "push", e);
  },
  reduce(e, ...t) {
    return d_(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return d_(this, "reduceRight", e, t);
  },
  shift() {
    return ds(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Nr(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return ds(this, "splice", e);
  },
  toReversed() {
    return Sn(this).toReversed();
  },
  toSorted(e) {
    return Sn(this).toSorted(e);
  },
  toSpliced(...e) {
    return Sn(this).toSpliced(...e);
  },
  unshift(...e) {
    return ds(this, "unshift", e);
  },
  values() {
    return zf(this, "values", Me);
  }
};
function zf(e, t, r) {
  const n = ef(e), i = n[t]();
  return n !== e && !Dt(e) && (i._next = i.next, i.next = () => {
    const s = i._next();
    return s.done || (s.value = r(s.value)), s;
  }), i;
}
const WL = Array.prototype;
function Nr(e, t, r, n, i, s) {
  const o = ef(e), a = o !== e && !Dt(e), u = o[t];
  if (u !== WL[t]) {
    const l = u.apply(e, s);
    return a ? Me(l) : l;
  }
  let f = r;
  o !== e && (a ? f = function(l, h) {
    return r.call(this, Me(l), h, e);
  } : r.length > 2 && (f = function(l, h) {
    return r.call(this, l, h, e);
  }));
  const c = u.call(o, f, n);
  return a && i ? i(c) : c;
}
function d_(e, t, r, n) {
  const i = ef(e);
  let s = r;
  return i !== e && (Dt(e) ? r.length > 3 && (s = function(o, a, u) {
    return r.call(this, o, a, u, e);
  }) : s = function(o, a, u) {
    return r.call(this, o, Me(a), u, e);
  }), i[t](s, ...n);
}
function Uf(e, t, r) {
  const n = V(e);
  Fe(n, "iterate", Li);
  const i = n[t](...r);
  return (i === -1 || i === !1) && ep(r[0]) ? (r[0] = V(r[0]), n[t](...r)) : i;
}
function ds(e, t, r = []) {
  Jh(), Hh();
  const n = V(e)[t].apply(e, r);
  return Kh(), Zh(), n;
}
const qL = /* @__PURE__ */ wL("__proto__,__v_isRef,__isVue"), zw = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Fo)
);
function GL(e) {
  Fo(e) || (e = String(e));
  const t = V(this);
  return Fe(t, "has", e), t.hasOwnProperty(e);
}
class Uw {
  constructor(t = !1, r = !1) {
    this._isReadonly = t, this._isShallow = r;
  }
  get(t, r, n) {
    if (r === "__v_skip") return t.__v_skip;
    const i = this._isReadonly, s = this._isShallow;
    if (r === "__v_isReactive")
      return !i;
    if (r === "__v_isReadonly")
      return i;
    if (r === "__v_isShallow")
      return s;
    if (r === "__v_raw")
      return n === (i ? s ? Hw : Gw : s ? qw : Ww).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(n) ? t : void 0;
    const o = Lr(t);
    if (!i) {
      let u;
      if (o && (u = kL[r]))
        return u;
      if (r === "hasOwnProperty")
        return GL;
    }
    const a = Reflect.get(
      t,
      r,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      Ue(t) ? t : n
    );
    if ((Fo(r) ? zw.has(r) : qL(r)) || (i || Fe(t, "get", r), s))
      return a;
    if (Ue(a)) {
      const u = o && Gh(r) ? a : a.value;
      return i && Ln(u) ? ka(u) : u;
    }
    return Ln(a) ? i ? ka(a) : Qh(a) : a;
  }
}
class Vw extends Uw {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, r, n, i) {
    let s = t[r];
    if (!this._isShallow) {
      const u = cn(s);
      if (!Dt(n) && !cn(n) && (s = V(s), n = V(n)), !Lr(t) && Ue(s) && !Ue(n))
        return u ? (ot(
          `Set operation on key "${String(r)}" failed: target is readonly.`,
          t[r]
        ), !0) : (s.value = n, !0);
    }
    const o = Lr(t) && Gh(r) ? Number(r) < t.length : za(t, r), a = Reflect.set(
      t,
      r,
      n,
      Ue(t) ? t : i
    );
    return t === V(i) && (o ? Qr(n, s) && Ir(t, "set", r, n, s) : Ir(t, "add", r, n)), a;
  }
  deleteProperty(t, r) {
    const n = za(t, r), i = t[r], s = Reflect.deleteProperty(t, r);
    return s && n && Ir(t, "delete", r, void 0, i), s;
  }
  has(t, r) {
    const n = Reflect.has(t, r);
    return (!Fo(r) || !zw.has(r)) && Fe(t, "has", r), n;
  }
  ownKeys(t) {
    return Fe(
      t,
      "iterate",
      Lr(t) ? "length" : en
    ), Reflect.ownKeys(t);
  }
}
class kw extends Uw {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, r) {
    return ot(
      `Set operation on key "${String(r)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, r) {
    return ot(
      `Delete operation on key "${String(r)}" failed: target is readonly.`,
      t
    ), !0;
  }
}
const HL = /* @__PURE__ */ new Vw(), KL = /* @__PURE__ */ new kw(), YL = /* @__PURE__ */ new Vw(!0), XL = /* @__PURE__ */ new kw(!0), Dc = (e) => e, oa = (e) => Reflect.getPrototypeOf(e);
function JL(e, t, r) {
  return function(...n) {
    const i = this.__v_raw, s = V(i), o = mi(s), a = e === "entries" || e === Symbol.iterator && o, u = e === "keys" && o, f = i[e](...n), c = r ? Dc : t ? Wa : Me;
    return !t && Fe(
      s,
      "iterate",
      u ? Va : en
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
function aa(e) {
  return function(...t) {
    {
      const r = t[0] ? `on key "${t[0]}" ` : "";
      ot(
        `${$L(e)} operation ${r}failed: target is readonly.`,
        V(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function ZL(e, t) {
  const r = {
    get(i) {
      const s = this.__v_raw, o = V(s), a = V(i);
      e || (Qr(i, a) && Fe(o, "get", i), Fe(o, "get", a));
      const { has: u } = oa(o), f = t ? Dc : e ? Wa : Me;
      if (u.call(o, i))
        return f(s.get(i));
      if (u.call(o, a))
        return f(s.get(a));
      s !== o && s.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && Fe(V(i), "iterate", en), i.size;
    },
    has(i) {
      const s = this.__v_raw, o = V(s), a = V(i);
      return e || (Qr(i, a) && Fe(o, "has", i), Fe(o, "has", a)), i === a ? s.has(i) : s.has(i) || s.has(a);
    },
    forEach(i, s) {
      const o = this, a = o.__v_raw, u = V(a), f = t ? Dc : e ? Wa : Me;
      return !e && Fe(u, "iterate", en), a.forEach((c, l) => i.call(s, f(c), f(l), o));
    }
  };
  return Ba(
    r,
    e ? {
      add: aa("add"),
      set: aa("set"),
      delete: aa("delete"),
      clear: aa("clear")
    } : {
      add(i) {
        !t && !Dt(i) && !cn(i) && (i = V(i));
        const s = V(this);
        return oa(s).has.call(s, i) || (s.add(i), Ir(s, "add", i, i)), this;
      },
      set(i, s) {
        !t && !Dt(s) && !cn(s) && (s = V(s));
        const o = V(this), { has: a, get: u } = oa(o);
        let f = a.call(o, i);
        f ? __(o, a, i) : (i = V(i), f = a.call(o, i));
        const c = u.call(o, i);
        return o.set(i, s), f ? Qr(s, c) && Ir(o, "set", i, s, c) : Ir(o, "add", i, s), this;
      },
      delete(i) {
        const s = V(this), { has: o, get: a } = oa(s);
        let u = o.call(s, i);
        u ? __(s, o, i) : (i = V(i), u = o.call(s, i));
        const f = a ? a.call(s, i) : void 0, c = s.delete(i);
        return u && Ir(s, "delete", i, void 0, f), c;
      },
      clear() {
        const i = V(this), s = i.size !== 0, o = mi(i) ? new Map(i) : new Set(i), a = i.clear();
        return s && Ir(
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
    r[i] = JL(i, e, t);
  }), r;
}
function tf(e, t) {
  const r = ZL(e, t);
  return (n, i, s) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? n : Reflect.get(
    za(r, i) && i in n ? r : n,
    i,
    s
  );
}
const QL = {
  get: /* @__PURE__ */ tf(!1, !1)
}, e3 = {
  get: /* @__PURE__ */ tf(!1, !0)
}, t3 = {
  get: /* @__PURE__ */ tf(!0, !1)
}, r3 = {
  get: /* @__PURE__ */ tf(!0, !0)
};
function __(e, t, r) {
  const n = V(r);
  if (n !== r && t.call(e, n)) {
    const i = $w(e);
    ot(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const Ww = /* @__PURE__ */ new WeakMap(), qw = /* @__PURE__ */ new WeakMap(), Gw = /* @__PURE__ */ new WeakMap(), Hw = /* @__PURE__ */ new WeakMap();
function n3(e) {
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
function i3(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : n3($w(e));
}
function Qh(e) {
  return cn(e) ? e : rf(
    e,
    !1,
    HL,
    QL,
    Ww
  );
}
function s3(e) {
  return rf(
    e,
    !1,
    YL,
    e3,
    qw
  );
}
function ka(e) {
  return rf(
    e,
    !0,
    KL,
    t3,
    Gw
  );
}
function o3(e) {
  return rf(
    e,
    !0,
    XL,
    r3,
    Hw
  );
}
function rf(e, t, r, n, i) {
  if (!Ln(e))
    return ot(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = i3(e);
  if (s === 0)
    return e;
  const o = i.get(e);
  if (o)
    return o;
  const a = new Proxy(
    e,
    s === 2 ? n : r
  );
  return i.set(e, a), a;
}
function wi(e) {
  return cn(e) ? wi(e.__v_raw) : !!(e && e.__v_isReactive);
}
function cn(e) {
  return !!(e && e.__v_isReadonly);
}
function Dt(e) {
  return !!(e && e.__v_isShallow);
}
function ep(e) {
  return e ? !!e.__v_raw : !1;
}
function V(e) {
  const t = e && e.__v_raw;
  return t ? V(t) : e;
}
function a3(e) {
  return !za(e, "__v_skip") && Object.isExtensible(e) && ML(e, "__v_skip", !0), e;
}
const Me = (e) => Ln(e) ? Qh(e) : e, Wa = (e) => Ln(e) ? ka(e) : e;
function Ue(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function Kw(e) {
  return Yw(e, !1);
}
function u3(e) {
  return Yw(e, !0);
}
function Yw(e, t) {
  return Ue(e) ? e : new f3(e, t);
}
class f3 {
  constructor(t, r) {
    this.dep = new Qu(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = r ? t : V(t), this._value = r ? t : Me(t), this.__v_isShallow = r;
  }
  get value() {
    return this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }), this._value;
  }
  set value(t) {
    const r = this._rawValue, n = this.__v_isShallow || Dt(t) || cn(t);
    t = n ? t : V(t), Qr(t, r) && (this._rawValue = t, this._value = n ? t : Me(t), this.dep.trigger({
      target: this,
      type: "set",
      key: "value",
      newValue: t,
      oldValue: r
    }));
  }
}
function c3(e) {
  e.dep && e.dep.trigger({
    target: e,
    type: "set",
    key: "value",
    newValue: e._value
  });
}
function tp(e) {
  return Ue(e) ? e.value : e;
}
function l3(e) {
  return Js(e) ? e() : tp(e);
}
const h3 = {
  get: (e, t, r) => t === "__v_raw" ? e : tp(Reflect.get(e, t, r)),
  set: (e, t, r, n) => {
    const i = e[t];
    return Ue(i) && !Ue(r) ? (i.value = r, !0) : Reflect.set(e, t, r, n);
  }
};
function p3(e) {
  return wi(e) ? e : new Proxy(e, h3);
}
class d3 {
  constructor(t) {
    this.__v_isRef = !0, this._value = void 0;
    const r = this.dep = new Qu(), { get: n, set: i } = t(r.track.bind(r), r.trigger.bind(r));
    this._get = n, this._set = i;
  }
  get value() {
    return this._value = this._get();
  }
  set value(t) {
    this._set(t);
  }
}
function _3(e) {
  return new d3(e);
}
function v3(e) {
  ep(e) || ot("toRefs() expects a reactive object but received a plain one.");
  const t = Lr(e) ? new Array(e.length) : {};
  for (const r in e)
    t[r] = Xw(e, r);
  return t;
}
class g3 {
  constructor(t, r, n) {
    this._object = t, this._key = r, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0;
  }
  get value() {
    const t = this._object[this._key];
    return this._value = t === void 0 ? this._defaultValue : t;
  }
  set value(t) {
    this._object[this._key] = t;
  }
  get dep() {
    return VL(V(this._object), this._key);
  }
}
class y3 {
  constructor(t) {
    this._getter = t, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
function b3(e, t, r) {
  return Ue(e) ? e : Js(e) ? new y3(e) : Ln(e) && arguments.length > 1 ? Xw(e, t, r) : Kw(e);
}
function Xw(e, t, r) {
  const n = e[t];
  return Ue(n) ? n : new g3(e, t, r);
}
class m3 {
  constructor(t, r, n) {
    this.fn = t, this.setter = r, this._value = void 0, this.dep = new Qu(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Qs - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !r, this.isSSR = n;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    B !== this)
      return Cw(this, !0), !0;
  }
  get value() {
    const t = this.dep.track({
      target: this,
      type: "get",
      key: "value"
    });
    return Fw(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter ? this.setter(t) : ot("Write operation failed: computed value is readonly");
  }
}
function w3(e, t, r = !1) {
  let n, i;
  Js(e) ? n = e : (n = e.get, i = e.set);
  const s = new m3(n, i, r);
  return t && !r && (s.onTrack = t.onTrack, s.onTrigger = t.onTrigger), s;
}
const A3 = {
  GET: "get",
  HAS: "has",
  ITERATE: "iterate"
}, O3 = {
  SET: "set",
  ADD: "add",
  DELETE: "delete",
  CLEAR: "clear"
}, E3 = {
  SKIP: "__v_skip",
  IS_REACTIVE: "__v_isReactive",
  IS_READONLY: "__v_isReadonly",
  IS_SHALLOW: "__v_isShallow",
  RAW: "__v_raw",
  IS_REF: "__v_isRef"
}, S3 = {
  WATCH_GETTER: 2,
  2: "WATCH_GETTER",
  WATCH_CALLBACK: 3,
  3: "WATCH_CALLBACK",
  WATCH_CLEANUP: 4,
  4: "WATCH_CLEANUP"
}, ua = {}, qa = /* @__PURE__ */ new WeakMap();
let Yr;
function x3() {
  return Yr;
}
function Jw(e, t = !1, r = Yr) {
  if (r) {
    let n = qa.get(r);
    n || qa.set(r, n = []), n.push(e);
  } else t || ot(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function R3(e, t, r = AL) {
  const { immediate: n, deep: i, once: s, scheduler: o, augmentJob: a, call: u } = r, f = (A) => {
    (r.onWarn || ot)(
      "Invalid watch source: ",
      A,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, c = (A) => i ? A : Dt(A) || i === !1 || i === 0 ? Dr(A, 1) : Dr(A);
  let l, h, d, _, v = !1, g = !1;
  if (Ue(e) ? (h = () => e.value, v = Dt(e)) : wi(e) ? (h = () => c(e), v = !0) : Lr(e) ? (g = !0, v = e.some((A) => wi(A) || Dt(A)), h = () => e.map((A) => {
    if (Ue(A))
      return A.value;
    if (wi(A))
      return c(A);
    if (Js(A))
      return u ? u(A, 2) : A();
    f(A);
  })) : Js(e) ? t ? h = u ? () => u(e, 2) : e : h = () => {
    if (d) {
      Jh();
      try {
        d();
      } finally {
        Zh();
      }
    }
    const A = Yr;
    Yr = l;
    try {
      return u ? u(e, 3, [_]) : e(_);
    } finally {
      Yr = A;
    }
  } : (h = OL, f(e)), t && i) {
    const A = h, S = i === !0 ? 1 / 0 : i;
    h = () => Dr(A(), S);
  }
  const y = Iw(), b = () => {
    l.stop(), y && y.active && EL(y.effects, l);
  };
  if (s && t) {
    const A = t;
    t = (...S) => {
      A(...S), b();
    };
  }
  let w = g ? new Array(e.length).fill(ua) : ua;
  const m = (A) => {
    if (!(!(l.flags & 1) || !l.dirty && !A))
      if (t) {
        const S = l.run();
        if (i || v || (g ? S.some((T, F) => Qr(T, w[F])) : Qr(S, w))) {
          d && d();
          const T = Yr;
          Yr = l;
          try {
            const F = [
              S,
              // pass undefined as the old value when it's changed for the first time
              w === ua ? void 0 : g && w[0] === ua ? [] : w,
              _
            ];
            w = S, u ? u(t, 3, F) : (
              // @ts-expect-error
              t(...F)
            );
          } finally {
            Yr = T;
          }
        }
      } else
        l.run();
  };
  return a && a(m), l = new Zs(h), l.scheduler = o ? () => o(m, !1) : m, _ = (A) => Jw(A, !1, l), d = l.onStop = () => {
    const A = qa.get(l);
    if (A) {
      if (u)
        u(A, 4);
      else
        for (const S of A) S();
      qa.delete(l);
    }
  }, l.onTrack = r.onTrack, l.onTrigger = r.onTrigger, t ? n ? m(!0) : w = l.run() : o ? o(m.bind(null, !0), !0) : l.run(), b.pause = l.pause.bind(l), b.resume = l.resume.bind(l), b.stop = b, b;
}
function Dr(e, t = 1 / 0, r) {
  if (t <= 0 || !Ln(e) || e.__v_skip || (r = r || /* @__PURE__ */ new Map(), (r.get(e) || 0) >= t))
    return e;
  if (r.set(e, t), t--, Ue(e))
    Dr(e.value, t, r);
  else if (Lr(e))
    for (let n = 0; n < e.length; n++)
      Dr(e[n], t, r);
  else if (xL(e) || mi(e))
    e.forEach((n) => {
      Dr(n, t, r);
    });
  else if (PL(e)) {
    for (const n in e)
      Dr(e[n], t, r);
    for (const n of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, n) && Dr(e[n], t, r);
  }
  return e;
}
const Jz = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ARRAY_ITERATE_KEY: Li,
  EffectFlags: CL,
  EffectScope: Mw,
  ITERATE_KEY: en,
  MAP_KEY_ITERATE_KEY: Va,
  ReactiveEffect: Zs,
  ReactiveFlags: E3,
  TrackOpTypes: A3,
  TriggerOpTypes: O3,
  WatchErrorCodes: S3,
  computed: w3,
  customRef: _3,
  effect: jL,
  effectScope: IL,
  enableTracking: BL,
  getCurrentScope: Iw,
  getCurrentWatcher: x3,
  isProxy: ep,
  isReactive: wi,
  isReadonly: cn,
  isRef: Ue,
  isShallow: Dt,
  markRaw: a3,
  onEffectCleanup: zL,
  onScopeDispose: DL,
  onWatcherCleanup: Jw,
  pauseTracking: Jh,
  proxyRefs: p3,
  reactive: Qh,
  reactiveReadArray: Sn,
  readonly: ka,
  ref: Kw,
  resetTracking: Zh,
  shallowReactive: s3,
  shallowReadArray: ef,
  shallowReadonly: o3,
  shallowRef: u3,
  stop: FL,
  toRaw: V,
  toReactive: Me,
  toReadonly: Wa,
  toRef: b3,
  toRefs: v3,
  toValue: l3,
  track: Fe,
  traverse: Dr,
  trigger: Ir,
  triggerRef: c3,
  unref: tp,
  watch: R3
}, Symbol.toStringTag, { value: "Module" })), T3 = Symbol.for("preact-signals"), ur = 1, ji = 2, eo = 4, is = 8, wa = 16, Fi = 32;
function nf() {
  Ns++;
}
function sf() {
  if (Ns > 1) {
    Ns--;
    return;
  }
  let e, t = !1;
  for (; Ps !== void 0; ) {
    let r = Ps;
    for (Ps = void 0, Cc++; r !== void 0; ) {
      const n = r._nextBatchedEffect;
      if (r._nextBatchedEffect = void 0, r._flags &= ~ji, !(r._flags & is) && Qw(r))
        try {
          r._callback();
        } catch (i) {
          t || (e = i, t = !0);
        }
      r = n;
    }
  }
  if (Cc = 0, Ns--, t)
    throw e;
}
function P3(e) {
  if (Ns > 0)
    return e();
  nf();
  try {
    return e();
  } finally {
    sf();
  }
}
let q;
function N3(e) {
  const t = q;
  q = void 0;
  try {
    return e();
  } finally {
    q = t;
  }
}
let Ps, Ns = 0, Cc = 0, Ga = 0;
function Zw(e) {
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
    }, q._sources !== void 0 && (q._sources._nextSource = t), q._sources = t, e._node = t, q._flags & Fi && e._subscribe(t), t;
  if (t._version === -1)
    return t._version = 0, t._nextSource !== void 0 && (t._nextSource._prevSource = t._prevSource, t._prevSource !== void 0 && (t._prevSource._nextSource = t._nextSource), t._prevSource = q._sources, t._nextSource = void 0, q._sources._nextSource = t, q._sources = t), t;
}
function je(e) {
  this._value = e, this._version = 0, this._node = void 0, this._targets = void 0;
}
je.prototype.brand = T3;
je.prototype._refresh = function() {
  return !0;
};
je.prototype._subscribe = function(e) {
  this._targets !== e && e._prevTarget === void 0 && (e._nextTarget = this._targets, this._targets !== void 0 && (this._targets._prevTarget = e), this._targets = e);
};
je.prototype._unsubscribe = function(e) {
  if (this._targets !== void 0) {
    const t = e._prevTarget, r = e._nextTarget;
    t !== void 0 && (t._nextTarget = r, e._prevTarget = void 0), r !== void 0 && (r._prevTarget = t, e._nextTarget = void 0), e === this._targets && (this._targets = r);
  }
};
je.prototype.subscribe = function(e) {
  return nA(() => {
    const t = this.value, r = q;
    q = void 0;
    try {
      e(t);
    } finally {
      q = r;
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
    const e = Zw(this);
    return e !== void 0 && (e._version = this._version), this._value;
  },
  set(e) {
    if (e !== this._value) {
      if (Cc > 100)
        throw new Error("Cycle detected");
      this._value = e, this._version++, Ga++, nf();
      try {
        for (let t = this._targets; t !== void 0; t = t._nextTarget)
          t._target._notify();
      } finally {
        sf();
      }
    }
  }
});
function $3(e) {
  return new je(e);
}
function Qw(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource)
    if (t._source._version !== t._version || !t._source._refresh() || t._source._version !== t._version)
      return !0;
  return !1;
}
function eA(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource) {
    const r = t._source._node;
    if (r !== void 0 && (t._rollbackNode = r), t._source._node = t, t._version = -1, t._nextSource === void 0) {
      e._sources = t;
      break;
    }
  }
}
function tA(e) {
  let t = e._sources, r;
  for (; t !== void 0; ) {
    const n = t._prevSource;
    t._version === -1 ? (t._source._unsubscribe(t), n !== void 0 && (n._nextSource = t._nextSource), t._nextSource !== void 0 && (t._nextSource._prevSource = n)) : r = t, t._source._node = t._rollbackNode, t._rollbackNode !== void 0 && (t._rollbackNode = void 0), t = n;
  }
  e._sources = r;
}
function ri(e) {
  je.call(this, void 0), this._fn = e, this._sources = void 0, this._globalVersion = Ga - 1, this._flags = eo;
}
ri.prototype = new je();
ri.prototype._refresh = function() {
  if (this._flags &= ~ji, this._flags & ur)
    return !1;
  if ((this._flags & (eo | Fi)) === Fi || (this._flags &= ~eo, this._globalVersion === Ga))
    return !0;
  if (this._globalVersion = Ga, this._flags |= ur, this._version > 0 && !Qw(this))
    return this._flags &= ~ur, !0;
  const e = q;
  try {
    eA(this), q = this;
    const t = this._fn();
    (this._flags & wa || this._value !== t || this._version === 0) && (this._value = t, this._flags &= ~wa, this._version++);
  } catch (t) {
    this._value = t, this._flags |= wa, this._version++;
  }
  return q = e, tA(this), this._flags &= ~ur, !0;
};
ri.prototype._subscribe = function(e) {
  if (this._targets === void 0) {
    this._flags |= eo | Fi;
    for (let t = this._sources; t !== void 0; t = t._nextSource)
      t._source._subscribe(t);
  }
  je.prototype._subscribe.call(this, e);
};
ri.prototype._unsubscribe = function(e) {
  if (this._targets !== void 0 && (je.prototype._unsubscribe.call(this, e), this._targets === void 0)) {
    this._flags &= ~Fi;
    for (let t = this._sources; t !== void 0; t = t._nextSource)
      t._source._unsubscribe(t);
  }
};
ri.prototype._notify = function() {
  if (!(this._flags & ji)) {
    this._flags |= eo | ji;
    for (let e = this._targets; e !== void 0; e = e._nextTarget)
      e._target._notify();
  }
};
Object.defineProperty(ri.prototype, "value", {
  get() {
    if (this._flags & ur)
      throw new Error("Cycle detected");
    const e = Zw(this);
    if (this._refresh(), e !== void 0 && (e._version = this._version), this._flags & wa)
      throw this._value;
    return this._value;
  }
});
function M3(e) {
  return new ri(e);
}
function rA(e) {
  const t = e._cleanup;
  if (e._cleanup = void 0, typeof t == "function") {
    nf();
    const r = q;
    q = void 0;
    try {
      t();
    } catch (n) {
      throw e._flags &= ~ur, e._flags |= is, rp(e), n;
    } finally {
      q = r, sf();
    }
  }
}
function rp(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource)
    t._source._unsubscribe(t);
  e._fn = void 0, e._sources = void 0, rA(e);
}
function I3(e) {
  if (q !== this)
    throw new Error("Out-of-order effect");
  tA(this), q = e, this._flags &= ~ur, this._flags & is && rp(this), sf();
}
function Bo(e) {
  this._fn = e, this._cleanup = void 0, this._sources = void 0, this._nextBatchedEffect = void 0, this._flags = Fi;
}
Bo.prototype._callback = function() {
  const e = this._start();
  try {
    if (this._flags & is || this._fn === void 0) return;
    const t = this._fn();
    typeof t == "function" && (this._cleanup = t);
  } finally {
    e();
  }
};
Bo.prototype._start = function() {
  if (this._flags & ur)
    throw new Error("Cycle detected");
  this._flags |= ur, this._flags &= ~is, rA(this), eA(this), nf();
  const e = q;
  return q = this, I3.bind(this, e);
};
Bo.prototype._notify = function() {
  this._flags & ji || (this._flags |= ji, this._nextBatchedEffect = Ps, Ps = this);
};
Bo.prototype._dispose = function() {
  this._flags |= is, this._flags & ur || rp(this);
};
function nA(e) {
  const t = new Bo(e);
  try {
    t._callback();
  } catch (r) {
    throw t._dispose(), r;
  }
  return t._dispose.bind(t);
}
const Zz = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Signal: je,
  batch: P3,
  computed: M3,
  effect: nA,
  signal: $3,
  untracked: N3
}, Symbol.toStringTag, { value: "Module" })), v_ = typeof Symbol == "function" && Symbol.observable || "@@observable", Vf = () => Math.random().toString(36).substring(7).split("").join("."), tn = {
  INIT: `@@redux/INIT${/* @__PURE__ */ Vf()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ Vf()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${Vf()}`
};
function of(e) {
  if (typeof e != "object" || e === null) return !1;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function D3(e) {
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
  if (j3(e)) return "date";
  if (L3(e)) return "error";
  const r = C3(e);
  switch (r) {
    case "Symbol":
    case "Promise":
    case "WeakMap":
    case "WeakSet":
    case "Map":
    case "Set":
      return r;
  }
  return Object.prototype.toString.call(e).slice(8, -1).toLowerCase().replace(/\s/g, "");
}
function C3(e) {
  return typeof e.constructor == "function" ? e.constructor.name : null;
}
function L3(e) {
  return e instanceof Error || typeof e.message == "string" && e.constructor && typeof e.constructor.stackTraceLimit == "number";
}
function j3(e) {
  return e instanceof Date ? !0 : typeof e.toDateString == "function" && typeof e.getDate == "function" && typeof e.setDate == "function";
}
function $r(e) {
  let t = typeof e;
  return process.env.NODE_ENV !== "production" && (t = D3(e)), t;
}
function np(e, t, r) {
  if (typeof e != "function")
    throw new Error(
      `Expected the root reducer to be a function. Instead, received: '${$r(
        e
      )}'`
    );
  if (typeof t == "function" && typeof r == "function" || typeof r == "function" && typeof arguments[3] == "function")
    throw new Error(
      "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example."
    );
  if (typeof t == "function" && typeof r > "u" && (r = t, t = void 0), typeof r < "u") {
    if (typeof r != "function")
      throw new Error(
        `Expected the enhancer to be a function. Instead, received: '${$r(
          r
        )}'`
      );
    return r(np)(
      e,
      t
    );
  }
  let n = e, i = t, s = /* @__PURE__ */ new Map(), o = s, a = 0, u = !1;
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
        `Expected the listener to be a function. Instead, received: '${$r(
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
    if (!of(g))
      throw new Error(
        `Actions must be plain objects. Instead, the actual type was: '${$r(
          g
        )}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`
      );
    if (typeof g.type > "u")
      throw new Error(
        'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.'
      );
    if (typeof g.type != "string")
      throw new Error(
        `Action "type" property must be a string. Instead, the actual type was: '${$r(
          g.type
        )}'. Value was: '${g.type}' (stringified)`
      );
    if (u)
      throw new Error("Reducers may not dispatch actions.");
    try {
      u = !0, i = n(i, g);
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
        `Expected the nextReducer to be a function. Instead, received: '${$r(
          g
        )}`
      );
    n = g, h({ type: tn.REPLACE });
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
            `Expected the observer to be an object. Instead, received: '${$r(
              y
            )}'`
          );
        function b() {
          const m = y;
          m.next && m.next(c());
        }
        return b(), { unsubscribe: g(b) };
      },
      [v_]() {
        return this;
      }
    };
  }
  return h({ type: tn.INIT }), {
    dispatch: h,
    subscribe: l,
    getState: c,
    replaceReducer: d,
    [v_]: _
  };
}
function F3(e, t, r) {
  return np(e, t, r);
}
function g_(e) {
  typeof console < "u" && typeof console.error == "function" && console.error(e);
  try {
    throw new Error(e);
  } catch {
  }
}
function B3(e, t, r, n) {
  const i = Object.keys(t), s = r && r.type === tn.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
  if (i.length === 0)
    return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
  if (!of(e))
    return `The ${s} has unexpected type of "${$r(
      e
    )}". Expected argument to be an object with the following keys: "${i.join('", "')}"`;
  const o = Object.keys(e).filter(
    (a) => !t.hasOwnProperty(a) && !n[a]
  );
  if (o.forEach((a) => {
    n[a] = !0;
  }), !(r && r.type === tn.REPLACE) && o.length > 0)
    return `Unexpected ${o.length > 1 ? "keys" : "key"} "${o.join('", "')}" found in ${s}. Expected to find one of the known reducer keys instead: "${i.join('", "')}". Unexpected keys will be ignored.`;
}
function z3(e) {
  Object.keys(e).forEach((t) => {
    const r = e[t];
    if (typeof r(void 0, { type: tn.INIT }) > "u")
      throw new Error(
        `The slice reducer for key "${t}" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`
      );
    if (typeof r(void 0, {
      type: tn.PROBE_UNKNOWN_ACTION()
    }) > "u")
      throw new Error(
        `The slice reducer for key "${t}" returned undefined when probed with a random type. Don't try to handle '${tn.INIT}' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.`
      );
  });
}
function U3(e) {
  const t = Object.keys(e), r = {};
  for (let o = 0; o < t.length; o++) {
    const a = t[o];
    process.env.NODE_ENV !== "production" && typeof e[a] > "u" && g_(`No reducer provided for key "${a}"`), typeof e[a] == "function" && (r[a] = e[a]);
  }
  const n = Object.keys(r);
  let i;
  process.env.NODE_ENV !== "production" && (i = {});
  let s;
  try {
    z3(r);
  } catch (o) {
    s = o;
  }
  return function(a = {}, u) {
    if (s)
      throw s;
    if (process.env.NODE_ENV !== "production") {
      const l = B3(
        a,
        r,
        u,
        i
      );
      l && g_(l);
    }
    let f = !1;
    const c = {};
    for (let l = 0; l < n.length; l++) {
      const h = n[l], d = r[h], _ = a[h], v = d(_, u);
      if (typeof v > "u") {
        const g = u && u.type;
        throw new Error(
          `When called with an action of type ${g ? `"${String(g)}"` : "(unknown type)"}, the slice reducer for key "${h}" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.`
        );
      }
      c[h] = v, f = f || v !== _;
    }
    return f = f || n.length !== Object.keys(a).length, f ? c : a;
  };
}
function y_(e, t) {
  return function(...r) {
    return t(e.apply(this, r));
  };
}
function V3(e, t) {
  if (typeof e == "function")
    return y_(e, t);
  if (typeof e != "object" || e === null)
    throw new Error(
      `bindActionCreators expected an object or a function, but instead received: '${$r(
        e
      )}'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    );
  const r = {};
  for (const n in e) {
    const i = e[n];
    typeof i == "function" && (r[n] = y_(i, t));
  }
  return r;
}
function iA(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce(
    (t, r) => (...n) => t(r(...n))
  );
}
function k3(...e) {
  return (t) => (r, n) => {
    const i = t(r, n);
    let s = () => {
      throw new Error(
        "Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch."
      );
    };
    const o = {
      getState: i.getState,
      dispatch: (u, ...f) => s(u, ...f)
    }, a = e.map((u) => u(o));
    return s = iA(...a)(i.dispatch), {
      ...i,
      dispatch: s
    };
  };
}
function W3(e) {
  return of(e) && "type" in e && typeof e.type == "string";
}
const Qz = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  __DO_NOT_USE__ActionTypes: tn,
  applyMiddleware: k3,
  bindActionCreators: V3,
  combineReducers: U3,
  compose: iA,
  createStore: np,
  isAction: W3,
  isPlainObject: of,
  legacy_createStore: F3
}, Symbol.toStringTag, { value: "Module" }));
var q3 = {
  0: "Invalid value for configuration 'enforceActions', expected 'never', 'always' or 'observed'",
  1: function(t, r) {
    return "Cannot apply '" + t + "' to '" + r.toString() + "': Field not found.";
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
  17: function(t, r) {
    return "[mobx.array] Index out of bounds, " + t + " is larger than " + r;
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
  25: function(t, r) {
    return "the entry '" + t + "' does not exist in the observable map '" + r + "'";
  },
  26: "please specify a property",
  27: function(t, r) {
    return "no observable property '" + t.toString() + "' found on the observable object '" + r + "'";
  },
  28: function(t) {
    return "Cannot obtain atom from " + t;
  },
  29: "Expecting some object",
  30: "invalid action stack. did you forget to finish an action?",
  31: "missing option for computed: get",
  32: function(t, r) {
    return "Cycle detected in computation " + t + ": " + r;
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
}, G3 = process.env.NODE_ENV !== "production" ? q3 : {};
function E(e) {
  for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)
    r[n - 1] = arguments[n];
  if (process.env.NODE_ENV !== "production") {
    var i = typeof e == "string" ? e : G3[e];
    throw typeof i == "function" && (i = i.apply(null, r)), new Error("[MobX] " + i);
  }
  throw new Error(typeof e == "number" ? "[MobX] minified error nr: " + e + (r.length ? " " + r.map(String).join(",") : "") + ". Find the full error at: https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/errors.ts" : "[MobX] " + e);
}
var H3 = {};
function af() {
  return typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : H3;
}
var sA = Object.assign, Ha = Object.getOwnPropertyDescriptor, lr = Object.defineProperty, zo = Object.prototype, Ka = [];
Object.freeze(Ka);
var ip = {};
Object.freeze(ip);
var K3 = typeof Proxy < "u", Y3 = /* @__PURE__ */ Object.toString();
function oA() {
  K3 || E(process.env.NODE_ENV !== "production" ? "`Proxy` objects are not available in the current environment. Please configure MobX to enable a fallback implementation.`" : "Proxy not available");
}
function _s(e) {
  process.env.NODE_ENV !== "production" && O.verifyProxies && E("MobX is currently configured to be able to run in ES5 mode, but in ES5 MobX won't be able to " + e);
}
function St() {
  return ++O.mobxGuid;
}
function sp(e) {
  var t = !1;
  return function() {
    if (!t)
      return t = !0, e.apply(this, arguments);
  };
}
var hi = function() {
};
function oe(e) {
  return typeof e == "function";
}
function dr(e) {
  var t = typeof e;
  switch (t) {
    case "string":
    case "symbol":
    case "number":
      return !0;
  }
  return !1;
}
function uf(e) {
  return e !== null && typeof e == "object";
}
function rt(e) {
  if (!uf(e))
    return !1;
  var t = Object.getPrototypeOf(e);
  if (t == null)
    return !0;
  var r = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return typeof r == "function" && r.toString() === Y3;
}
function aA(e) {
  var t = e?.constructor;
  return t ? t.name === "GeneratorFunction" || t.displayName === "GeneratorFunction" : !1;
}
function Uo(e, t, r) {
  lr(e, t, {
    enumerable: !1,
    writable: !0,
    configurable: !0,
    value: r
  });
}
function uA(e, t, r) {
  lr(e, t, {
    enumerable: !1,
    writable: !1,
    configurable: !0,
    value: r
  });
}
function bn(e, t) {
  var r = "isMobX" + e;
  return t.prototype[r] = !0, function(n) {
    return uf(n) && n[r] === !0;
  };
}
function ss(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Map]";
}
function X3(e) {
  var t = Object.getPrototypeOf(e), r = Object.getPrototypeOf(t), n = Object.getPrototypeOf(r);
  return n === null;
}
function Cr(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Set]";
}
var fA = typeof Object.getOwnPropertySymbols < "u";
function J3(e) {
  var t = Object.keys(e);
  if (!fA)
    return t;
  var r = Object.getOwnPropertySymbols(e);
  return r.length ? [].concat(t, r.filter(function(n) {
    return zo.propertyIsEnumerable.call(e, n);
  })) : t;
}
var Bi = typeof Reflect < "u" && Reflect.ownKeys ? Reflect.ownKeys : fA ? function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : (
  /* istanbul ignore next */
  Object.getOwnPropertyNames
);
function Lc(e) {
  return typeof e == "string" ? e : typeof e == "symbol" ? e.toString() : new String(e).toString();
}
function cA(e) {
  return e === null ? null : typeof e == "object" ? "" + e : e;
}
function _t(e, t) {
  return zo.hasOwnProperty.call(e, t);
}
var Z3 = Object.getOwnPropertyDescriptors || function(t) {
  var r = {};
  return Bi(t).forEach(function(n) {
    r[n] = Ha(t, n);
  }), r;
};
function ft(e, t) {
  return !!(e & t);
}
function ct(e, t, r) {
  return r ? e |= t : e &= ~t, e;
}
function b_(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Q3(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, tj(n.key), n);
  }
}
function os(e, t, r) {
  return t && Q3(e.prototype, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function pi(e, t) {
  var r = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r) return (r = r.call(e)).next.bind(r);
  if (Array.isArray(e) || (r = rj(e)) || t) {
    r && (e = r);
    var n = 0;
    return function() {
      return n >= e.length ? {
        done: !0
      } : {
        done: !1,
        value: e[n++]
      };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function _r() {
  return _r = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, _r.apply(null, arguments);
}
function lA(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, jc(e, t);
}
function jc(e, t) {
  return jc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r, n) {
    return r.__proto__ = n, r;
  }, jc(e, t);
}
function ej(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function tj(e) {
  var t = ej(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function rj(e, t) {
  if (e) {
    if (typeof e == "string") return b_(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? b_(e, t) : void 0;
  }
}
var Ze = /* @__PURE__ */ Symbol("mobx-stored-annotations");
function Xt(e) {
  function t(r, n) {
    if (ko(n))
      return e.decorate_20223_(r, n);
    Vo(r, n, e);
  }
  return Object.assign(t, e);
}
function Vo(e, t, r) {
  if (_t(e, Ze) || Uo(e, Ze, _r({}, e[Ze])), process.env.NODE_ENV !== "production" && Ya(r) && !_t(e[Ze], t)) {
    var n = e.constructor.name + ".prototype." + t.toString();
    E("'" + n + "' is decorated with 'override', but no such decorated member was found on prototype.");
  }
  nj(e, r, t), Ya(r) || (e[Ze][t] = r);
}
function nj(e, t, r) {
  if (process.env.NODE_ENV !== "production" && !Ya(t) && _t(e[Ze], r)) {
    var n = e.constructor.name + ".prototype." + r.toString(), i = e[Ze][r].annotationType_, s = t.annotationType_;
    E("Cannot apply '@" + s + "' to '" + n + "':" + (`
The field is already decorated with '@` + i + "'.") + `
Re-decorating fields is not allowed.
Use '@override' decorator for methods overridden by subclass.`);
  }
}
function ij(e) {
  return _t(e, Ze) || Uo(e, Ze, _r({}, e[Ze])), e[Ze];
}
function ko(e) {
  return typeof e == "object" && typeof e.kind == "string";
}
function ff(e, t) {
  process.env.NODE_ENV !== "production" && !t.includes(e.kind) && E("The decorator applied to '" + String(e.name) + "' cannot be used on a " + e.kind + " element");
}
var R = /* @__PURE__ */ Symbol("mobx administration"), mn = /* @__PURE__ */ function() {
  function e(r) {
    r === void 0 && (r = process.env.NODE_ENV !== "production" ? "Atom@" + St() : "Atom"), this.name_ = void 0, this.flags_ = 0, this.observers_ = /* @__PURE__ */ new Set(), this.lastAccessedBy_ = 0, this.lowestObserverState_ = z.NOT_TRACKING_, this.onBOL = void 0, this.onBUOL = void 0, this.name_ = r;
  }
  var t = e.prototype;
  return t.onBO = function() {
    this.onBOL && this.onBOL.forEach(function(n) {
      return n();
    });
  }, t.onBUO = function() {
    this.onBUOL && this.onBUOL.forEach(function(n) {
      return n();
    });
  }, t.reportObserved = function() {
    return PA(this);
  }, t.reportChanged = function() {
    Qe(), NA(this), et();
  }, t.toString = function() {
    return this.name_;
  }, os(e, [{
    key: "isBeingObserved",
    get: function() {
      return ft(this.flags_, e.isBeingObservedMask_);
    },
    set: function(n) {
      this.flags_ = ct(this.flags_, e.isBeingObservedMask_, n);
    }
  }, {
    key: "isPendingUnobservation",
    get: function() {
      return ft(this.flags_, e.isPendingUnobservationMask_);
    },
    set: function(n) {
      this.flags_ = ct(this.flags_, e.isPendingUnobservationMask_, n);
    }
  }, {
    key: "diffValue",
    get: function() {
      return ft(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(n) {
      this.flags_ = ct(this.flags_, e.diffValueMask_, n === 1);
    }
  }]);
}();
mn.isBeingObservedMask_ = 1;
mn.isPendingUnobservationMask_ = 2;
mn.diffValueMask_ = 4;
var op = /* @__PURE__ */ bn("Atom", mn);
function ap(e, t, r) {
  t === void 0 && (t = hi), r === void 0 && (r = hi);
  var n = new mn(e);
  return t !== hi && BA(n, t), r !== hi && dp(n, r), n;
}
function sj(e, t) {
  return e === t;
}
function oj(e, t) {
  return mp(e, t);
}
function aj(e, t) {
  return mp(e, t, 1);
}
function uj(e, t) {
  return Object.is ? Object.is(e, t) : e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
var jn = {
  identity: sj,
  structural: oj,
  default: uj,
  shallow: aj
};
function Fn(e, t, r) {
  return kn(e) ? e : Array.isArray(e) ? me.array(e, {
    name: r
  }) : rt(e) ? me.object(e, void 0, {
    name: r
  }) : ss(e) ? me.map(e, {
    name: r
  }) : Cr(e) ? me.set(e, {
    name: r
  }) : typeof e == "function" && !Un(e) && !Ui(e) ? aA(e) ? Vn(e) : zi(r, e) : e;
}
function fj(e, t, r) {
  if (e == null || de(e) || Xe(e) || ge(e) || pe(e))
    return e;
  if (Array.isArray(e))
    return me.array(e, {
      name: r,
      deep: !1
    });
  if (rt(e))
    return me.object(e, void 0, {
      name: r,
      deep: !1
    });
  if (ss(e))
    return me.map(e, {
      name: r,
      deep: !1
    });
  if (Cr(e))
    return me.set(e, {
      name: r,
      deep: !1
    });
  process.env.NODE_ENV !== "production" && E("The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
}
function cf(e) {
  return e;
}
function cj(e, t) {
  return process.env.NODE_ENV !== "production" && kn(e) && E("observable.struct should not be used with observable values"), mp(e, t) ? t : e;
}
var hA = "override", lj = /* @__PURE__ */ Xt({
  annotationType_: hA,
  make_: hj,
  extend_: pj,
  decorate_20223_: dj
});
function Ya(e) {
  return e.annotationType_ === hA;
}
function hj(e, t) {
  return process.env.NODE_ENV !== "production" && e.isPlainObject_ && E("Cannot apply '" + this.annotationType_ + "' to '" + e.name_ + "." + t.toString() + "':" + (`
'` + this.annotationType_ + "' cannot be used on plain objects.")), process.env.NODE_ENV !== "production" && !_t(e.appliedAnnotations_, t) && E("'" + e.name_ + "." + t.toString() + "' is annotated with '" + this.annotationType_ + "', but no such annotated member was found on prototype."), 0;
}
function pj(e, t, r, n) {
  E("'" + this.annotationType_ + "' can only be used with 'makeObservable'");
}
function dj(e, t) {
  console.warn("'" + this.annotationType_ + "' cannot be used with decorators - this is a no-op");
}
function Wo(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: _j,
    extend_: vj,
    decorate_20223_: gj
  };
}
function _j(e, t, r, n) {
  var i;
  if ((i = this.options_) != null && i.bound)
    return this.extend_(e, t, r, !1) === null ? 0 : 1;
  if (n === e.target_)
    return this.extend_(e, t, r, !1) === null ? 0 : 2;
  if (Un(r.value))
    return 1;
  var s = pA(e, this, t, r, !1);
  return lr(n, t, s), 2;
}
function vj(e, t, r, n) {
  var i = pA(e, this, t, r);
  return e.defineProperty_(t, i, n);
}
function gj(e, t) {
  process.env.NODE_ENV !== "production" && ff(t, ["method", "field"]);
  var r = t.kind, n = t.name, i = t.addInitializer, s = this, o = function(f) {
    var c, l, h, d;
    return ln((c = (l = s.options_) == null ? void 0 : l.name) != null ? c : n.toString(), f, (h = (d = s.options_) == null ? void 0 : d.autoAction) != null ? h : !1);
  };
  if (r == "field")
    return function(u) {
      var f, c = u;
      return Un(c) || (c = o(c)), (f = s.options_) != null && f.bound && (c = c.bind(this), c.isMobxAction = !0), c;
    };
  if (r == "method") {
    var a;
    return Un(e) || (e = o(e)), (a = this.options_) != null && a.bound && i(function() {
      var u = this, f = u[n].bind(u);
      f.isMobxAction = !0, u[n] = f;
    }), e;
  }
  E("Cannot apply '" + s.annotationType_ + "' to '" + String(n) + "' (kind: " + r + "):" + (`
'` + s.annotationType_ + "' can only be used on properties with a function value."));
}
function yj(e, t, r, n) {
  var i = t.annotationType_, s = n.value;
  process.env.NODE_ENV !== "production" && !oe(s) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + r.toString() + "':" + (`
'` + i + "' can only be used on properties with a function value."));
}
function pA(e, t, r, n, i) {
  var s, o, a, u, f, c, l;
  i === void 0 && (i = O.safeDescriptors), yj(e, t, r, n);
  var h = n.value;
  if ((s = t.options_) != null && s.bound) {
    var d;
    h = h.bind((d = e.proxy_) != null ? d : e.target_);
  }
  return {
    value: ln(
      (o = (a = t.options_) == null ? void 0 : a.name) != null ? o : r.toString(),
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
function dA(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: bj,
    extend_: mj,
    decorate_20223_: wj
  };
}
function bj(e, t, r, n) {
  var i;
  if (n === e.target_)
    return this.extend_(e, t, r, !1) === null ? 0 : 2;
  if ((i = this.options_) != null && i.bound && (!_t(e.target_, t) || !Ui(e.target_[t])) && this.extend_(e, t, r, !1) === null)
    return 0;
  if (Ui(r.value))
    return 1;
  var s = _A(e, this, t, r, !1, !1);
  return lr(n, t, s), 2;
}
function mj(e, t, r, n) {
  var i, s = _A(e, this, t, r, (i = this.options_) == null ? void 0 : i.bound);
  return e.defineProperty_(t, s, n);
}
function wj(e, t) {
  var r;
  process.env.NODE_ENV !== "production" && ff(t, ["method"]);
  var n = t.name, i = t.addInitializer;
  return Ui(e) || (e = Vn(e)), (r = this.options_) != null && r.bound && i(function() {
    var s = this, o = s[n].bind(s);
    o.isMobXFlow = !0, s[n] = o;
  }), e;
}
function Aj(e, t, r, n) {
  var i = t.annotationType_, s = n.value;
  process.env.NODE_ENV !== "production" && !oe(s) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + r.toString() + "':" + (`
'` + i + "' can only be used on properties with a generator function value."));
}
function _A(e, t, r, n, i, s) {
  s === void 0 && (s = O.safeDescriptors), Aj(e, t, r, n);
  var o = n.value;
  if (Ui(o) || (o = Vn(o)), i) {
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
function up(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: Oj,
    extend_: Ej,
    decorate_20223_: Sj
  };
}
function Oj(e, t, r) {
  return this.extend_(e, t, r, !1) === null ? 0 : 1;
}
function Ej(e, t, r, n) {
  return xj(e, this, t, r), e.defineComputedProperty_(t, _r({}, this.options_, {
    get: r.get,
    set: r.set
  }), n);
}
function Sj(e, t) {
  process.env.NODE_ENV !== "production" && ff(t, ["getter"]);
  var r = this, n = t.name, i = t.addInitializer;
  return i(function() {
    var s = ii(this)[R], o = _r({}, r.options_, {
      get: e,
      context: this
    });
    o.name || (o.name = process.env.NODE_ENV !== "production" ? s.name_ + "." + n.toString() : "ObservableObject." + n.toString()), s.values_.set(n, new Bt(o));
  }), function() {
    return this[R].getObservablePropValue_(n);
  };
}
function xj(e, t, r, n) {
  var i = t.annotationType_, s = n.get;
  process.env.NODE_ENV !== "production" && !s && E("Cannot apply '" + i + "' to '" + e.name_ + "." + r.toString() + "':" + (`
'` + i + "' can only be used on getter(+setter) properties."));
}
function lf(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: Rj,
    extend_: Tj,
    decorate_20223_: Pj
  };
}
function Rj(e, t, r) {
  return this.extend_(e, t, r, !1) === null ? 0 : 1;
}
function Tj(e, t, r, n) {
  var i, s;
  return Nj(e, this, t, r), e.defineObservableProperty_(t, r.value, (i = (s = this.options_) == null ? void 0 : s.enhancer) != null ? i : Fn, n);
}
function Pj(e, t) {
  if (process.env.NODE_ENV !== "production") {
    if (t.kind === "field")
      throw E("Please use `@observable accessor " + String(t.name) + "` instead of `@observable " + String(t.name) + "`");
    ff(t, ["accessor"]);
  }
  var r = this, n = t.kind, i = t.name, s = /* @__PURE__ */ new WeakSet();
  function o(a, u) {
    var f, c, l = ii(a)[R], h = new rn(u, (f = (c = r.options_) == null ? void 0 : c.enhancer) != null ? f : Fn, process.env.NODE_ENV !== "production" ? l.name_ + "." + i.toString() : "ObservableObject." + i.toString(), !1);
    l.values_.set(i, h), s.add(a);
  }
  if (n == "accessor")
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
function Nj(e, t, r, n) {
  var i = t.annotationType_;
  process.env.NODE_ENV !== "production" && !("value" in n) && E("Cannot apply '" + i + "' to '" + e.name_ + "." + r.toString() + "':" + (`
'` + i + "' cannot be used on getter/setter properties"));
}
var $j = "true", Mj = /* @__PURE__ */ vA();
function vA(e) {
  return {
    annotationType_: $j,
    options_: e,
    make_: Ij,
    extend_: Dj,
    decorate_20223_: Cj
  };
}
function Ij(e, t, r, n) {
  var i, s;
  if (r.get)
    return qo.make_(e, t, r, n);
  if (r.set) {
    var o = ln(t.toString(), r.set);
    return n === e.target_ ? e.defineProperty_(t, {
      configurable: O.safeDescriptors ? e.isPlainObject_ : !0,
      set: o
    }) === null ? 0 : 2 : (lr(n, t, {
      configurable: !0,
      set: o
    }), 2);
  }
  if (n !== e.target_ && typeof r.value == "function") {
    var a;
    if (aA(r.value)) {
      var u, f = (u = this.options_) != null && u.autoBind ? Vn.bound : Vn;
      return f.make_(e, t, r, n);
    }
    var c = (a = this.options_) != null && a.autoBind ? zi.bound : zi;
    return c.make_(e, t, r, n);
  }
  var l = ((i = this.options_) == null ? void 0 : i.deep) === !1 ? me.ref : me;
  if (typeof r.value == "function" && (s = this.options_) != null && s.autoBind) {
    var h;
    r.value = r.value.bind((h = e.proxy_) != null ? h : e.target_);
  }
  return l.make_(e, t, r, n);
}
function Dj(e, t, r, n) {
  var i, s;
  if (r.get)
    return qo.extend_(e, t, r, n);
  if (r.set)
    return e.defineProperty_(t, {
      configurable: O.safeDescriptors ? e.isPlainObject_ : !0,
      set: ln(t.toString(), r.set)
    }, n);
  if (typeof r.value == "function" && (i = this.options_) != null && i.autoBind) {
    var o;
    r.value = r.value.bind((o = e.proxy_) != null ? o : e.target_);
  }
  var a = ((s = this.options_) == null ? void 0 : s.deep) === !1 ? me.ref : me;
  return a.extend_(e, t, r, n);
}
function Cj(e, t) {
  E("'" + this.annotationType_ + "' cannot be used as a decorator");
}
var Lj = "observable", jj = "observable.ref", Fj = "observable.shallow", Bj = "observable.struct", gA = {
  deep: !0,
  name: void 0,
  defaultDecorator: void 0,
  proxy: !0
};
Object.freeze(gA);
function fa(e) {
  return e || gA;
}
var Fc = /* @__PURE__ */ lf(Lj), zj = /* @__PURE__ */ lf(jj, {
  enhancer: cf
}), Uj = /* @__PURE__ */ lf(Fj, {
  enhancer: fj
}), Vj = /* @__PURE__ */ lf(Bj, {
  enhancer: cj
}), yA = /* @__PURE__ */ Xt(Fc);
function ca(e) {
  return e.deep === !0 ? Fn : e.deep === !1 ? cf : Wj(e.defaultDecorator);
}
function kj(e) {
  var t;
  return e ? (t = e.defaultDecorator) != null ? t : vA(e) : void 0;
}
function Wj(e) {
  var t, r;
  return e && (t = (r = e.options_) == null ? void 0 : r.enhancer) != null ? t : Fn;
}
function bA(e, t, r) {
  if (ko(t))
    return Fc.decorate_20223_(e, t);
  if (dr(t)) {
    Vo(e, t, Fc);
    return;
  }
  return kn(e) ? e : rt(e) ? me.object(e, t, r) : Array.isArray(e) ? me.array(e, t) : ss(e) ? me.map(e, t) : Cr(e) ? me.set(e, t) : typeof e == "object" && e !== null ? e : me.box(e, t);
}
sA(bA, yA);
var qj = {
  box: function(t, r) {
    var n = fa(r);
    return new rn(t, ca(n), n.name, !0, n.equals);
  },
  array: function(t, r) {
    var n = fa(r);
    return (O.useProxies === !1 || n.proxy === !1 ? pB : nB)(t, ca(n), n.name);
  },
  map: function(t, r) {
    var n = fa(r);
    return new gp(t, ca(n), n.name);
  },
  set: function(t, r) {
    var n = fa(r);
    return new yp(t, ca(n), n.name);
  },
  object: function(t, r, n) {
    return wn(function() {
      return _p(O.useProxies === !1 || n?.proxy === !1 ? ii({}, n) : ZF({}, n), t, r);
    });
  },
  ref: /* @__PURE__ */ Xt(zj),
  shallow: /* @__PURE__ */ Xt(Uj),
  deep: yA,
  struct: /* @__PURE__ */ Xt(Vj)
}, me = /* @__PURE__ */ sA(bA, qj), mA = "computed", Gj = "computed.struct", Bc = /* @__PURE__ */ up(mA), Hj = /* @__PURE__ */ up(Gj, {
  equals: jn.structural
}), qo = function(t, r) {
  if (ko(r))
    return Bc.decorate_20223_(t, r);
  if (dr(r))
    return Vo(t, r, Bc);
  if (rt(t))
    return Xt(up(mA, t));
  process.env.NODE_ENV !== "production" && (oe(t) || E("First argument to `computed` should be an expression."), oe(r) && E("A setter as second argument is no longer supported, use `{ set: fn }` option instead"));
  var n = rt(r) ? r : {};
  return n.get = t, n.name || (n.name = t.name || ""), new Bt(n);
};
Object.assign(qo, Bc);
qo.struct = /* @__PURE__ */ Xt(Hj);
var m_, w_, Xa = 0, Kj = 1, Yj = (m_ = (w_ = /* @__PURE__ */ Ha(function() {
}, "name")) == null ? void 0 : w_.configurable) != null ? m_ : !1, A_ = {
  value: "action",
  configurable: !0,
  writable: !1,
  enumerable: !1
};
function ln(e, t, r, n) {
  r === void 0 && (r = !1), process.env.NODE_ENV !== "production" && (oe(t) || E("`action` can only be invoked on functions"), (typeof e != "string" || !e) && E("actions should have valid names, got: '" + e + "'"));
  function i() {
    return wA(e, r, t, n || this, arguments);
  }
  return i.isMobxAction = !0, i.toString = function() {
    return t.toString();
  }, Yj && (A_.value = e, lr(i, "name", A_)), i;
}
function wA(e, t, r, n, i) {
  var s = AA(e, t, n, i);
  try {
    return r.apply(n, i);
  } catch (o) {
    throw s.error_ = o, o;
  } finally {
    OA(s);
  }
}
function AA(e, t, r, n) {
  var i = process.env.NODE_ENV !== "production" && Re() && !!e, s = 0;
  if (process.env.NODE_ENV !== "production" && i) {
    s = Date.now();
    var o = n ? Array.from(n) : Ka;
    vt({
      type: hp,
      name: e,
      object: r,
      arguments: o
    });
  }
  var a = O.trackingDerivation, u = !t || !a;
  Qe();
  var f = O.allowStateChanges;
  u && (ni(), f = hf(!0));
  var c = df(!0), l = {
    runAsAction_: u,
    prevDerivation_: a,
    prevAllowStateChanges_: f,
    prevAllowStateReads_: c,
    notifySpy_: i,
    startTime_: s,
    actionId_: Kj++,
    parentActionId_: Xa
  };
  return Xa = l.actionId_, l;
}
function OA(e) {
  Xa !== e.actionId_ && E(30), Xa = e.parentActionId_, e.error_ !== void 0 && (O.suppressReactionErrors = !0), pf(e.prevAllowStateChanges_), Ai(e.prevAllowStateReads_), et(), e.runAsAction_ && jr(e.prevDerivation_), process.env.NODE_ENV !== "production" && e.notifySpy_ && gt({
    time: Date.now() - e.startTime_
  }), O.suppressReactionErrors = !1;
}
function fp(e, t) {
  var r = hf(e);
  try {
    return t();
  } finally {
    pf(r);
  }
}
function hf(e) {
  var t = O.allowStateChanges;
  return O.allowStateChanges = e, t;
}
function pf(e) {
  O.allowStateChanges = e;
}
var Xj = "create", rn = /* @__PURE__ */ function(e) {
  function t(n, i, s, o, a) {
    var u;
    return s === void 0 && (s = process.env.NODE_ENV !== "production" ? "ObservableValue@" + St() : "ObservableValue"), o === void 0 && (o = !0), a === void 0 && (a = jn.default), u = e.call(this, s) || this, u.enhancer = void 0, u.name_ = void 0, u.equals = void 0, u.hasUnreportedChange_ = !1, u.interceptors_ = void 0, u.changeListeners_ = void 0, u.value_ = void 0, u.dehancer = void 0, u.enhancer = i, u.name_ = s, u.equals = a, u.value_ = i(n, void 0, s), process.env.NODE_ENV !== "production" && o && Re() && zn({
      type: Xj,
      object: u,
      observableKind: "value",
      debugObjectName: u.name_,
      newValue: "" + u.value_
    }), u;
  }
  lA(t, e);
  var r = t.prototype;
  return r.dehanceValue = function(i) {
    return this.dehancer !== void 0 ? this.dehancer(i) : i;
  }, r.set = function(i) {
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
  }, r.prepareNewValue_ = function(i) {
    if (fr(this), Pt(this)) {
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
  }, r.setNewValue_ = function(i) {
    var s = this.value_;
    this.value_ = i, this.reportChanged(), Jt(this) && Zt(this, {
      type: Ht,
      object: this,
      newValue: i,
      oldValue: s
    });
  }, r.get = function() {
    return this.reportObserved(), this.dehanceValue(this.value_);
  }, r.intercept_ = function(i) {
    return Go(this, i);
  }, r.observe_ = function(i, s) {
    return s && i({
      observableKind: "value",
      debugObjectName: this.name_,
      object: this,
      type: Ht,
      newValue: this.value_,
      oldValue: void 0
    }), Ho(this, i);
  }, r.raw = function() {
    return this.value_;
  }, r.toJSON = function() {
    return this.get();
  }, r.toString = function() {
    return this.name_ + "[" + this.value_ + "]";
  }, r.valueOf = function() {
    return cA(this.get());
  }, r[Symbol.toPrimitive] = function() {
    return this.valueOf();
  }, t;
}(mn), cp = /* @__PURE__ */ bn("ObservableValue", rn), Bt = /* @__PURE__ */ function() {
  function e(r) {
    this.dependenciesState_ = z.NOT_TRACKING_, this.observing_ = [], this.newObserving_ = null, this.observers_ = /* @__PURE__ */ new Set(), this.runId_ = 0, this.lastAccessedBy_ = 0, this.lowestObserverState_ = z.UP_TO_DATE_, this.unboundDepsCount_ = 0, this.value_ = new Ja(null), this.name_ = void 0, this.triggeredBy_ = void 0, this.flags_ = 0, this.derivation = void 0, this.setter_ = void 0, this.isTracing_ = Ct.NONE, this.scope_ = void 0, this.equals_ = void 0, this.requiresReaction_ = void 0, this.keepAlive_ = void 0, this.onBOL = void 0, this.onBUOL = void 0, r.get || E(31), this.derivation = r.get, this.name_ = r.name || (process.env.NODE_ENV !== "production" ? "ComputedValue@" + St() : "ComputedValue"), r.set && (this.setter_ = ln(process.env.NODE_ENV !== "production" ? this.name_ + "-setter" : "ComputedValue-setter", r.set)), this.equals_ = r.equals || (r.compareStructural || r.struct ? jn.structural : jn.default), this.scope_ = r.context, this.requiresReaction_ = r.requiresReaction, this.keepAlive_ = !!r.keepAlive;
  }
  var t = e.prototype;
  return t.onBecomeStale_ = function() {
    fF(this);
  }, t.onBO = function() {
    this.onBOL && this.onBOL.forEach(function(n) {
      return n();
    });
  }, t.onBUO = function() {
    this.onBUOL && this.onBUOL.forEach(function(n) {
      return n();
    });
  }, t.get = function() {
    if (this.isComputing && E(32, this.name_, this.derivation), O.inBatch === 0 && // !globalState.trackingDerivatpion &&
    this.observers_.size === 0 && !this.keepAlive_)
      zc(this) && (this.warnAboutUntrackedRead_(), Qe(), this.value_ = this.computeValue_(!1), et());
    else if (PA(this), zc(this)) {
      var n = O.trackingContext;
      this.keepAlive_ && !n && (O.trackingContext = this), this.trackAndCompute() && uF(this), O.trackingContext = n;
    }
    var i = this.value_;
    if (Aa(i))
      throw i.cause;
    return i;
  }, t.set = function(n) {
    if (this.setter_) {
      this.isRunningSetter && E(33, this.name_), this.isRunningSetter = !0;
      try {
        this.setter_.call(this.scope_, n);
      } finally {
        this.isRunningSetter = !1;
      }
    } else
      E(34, this.name_);
  }, t.trackAndCompute = function() {
    var n = this.value_, i = (
      /* see #1208 */
      this.dependenciesState_ === z.NOT_TRACKING_
    ), s = this.computeValue_(!0), o = i || Aa(n) || Aa(s) || !this.equals_(n, s);
    return o && (this.value_ = s, process.env.NODE_ENV !== "production" && Re() && zn({
      observableKind: "computed",
      debugObjectName: this.name_,
      object: this.scope_,
      type: "update",
      oldValue: n,
      newValue: s
    })), o;
  }, t.computeValue_ = function(n) {
    this.isComputing = !0;
    var i = hf(!1), s;
    if (n)
      s = EA(this, this.derivation, this.scope_);
    else if (O.disableErrorBoundaries === !0)
      s = this.derivation.call(this.scope_);
    else
      try {
        s = this.derivation.call(this.scope_);
      } catch (o) {
        s = new Ja(o);
      }
    return pf(i), this.isComputing = !1, s;
  }, t.suspend_ = function() {
    this.keepAlive_ || (Uc(this), this.value_ = void 0, process.env.NODE_ENV !== "production" && this.isTracing_ !== Ct.NONE && console.log("[mobx.trace] Computed value '" + this.name_ + "' was suspended and it will recompute on the next access."));
  }, t.observe_ = function(n, i) {
    var s = this, o = !0, a = void 0;
    return pp(function() {
      var u = s.get();
      if (!o || i) {
        var f = ni();
        n({
          observableKind: "computed",
          debugObjectName: s.name_,
          type: Ht,
          object: s,
          newValue: u,
          oldValue: a
        }), jr(f);
      }
      o = !1, a = u;
    });
  }, t.warnAboutUntrackedRead_ = function() {
    process.env.NODE_ENV !== "production" && (this.isTracing_ !== Ct.NONE && console.log("[mobx.trace] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute."), (typeof this.requiresReaction_ == "boolean" ? this.requiresReaction_ : O.computedRequiresReaction) && console.warn("[mobx] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute."));
  }, t.toString = function() {
    return this.name_ + "[" + this.derivation.toString() + "]";
  }, t.valueOf = function() {
    return cA(this.get());
  }, t[Symbol.toPrimitive] = function() {
    return this.valueOf();
  }, os(e, [{
    key: "isComputing",
    get: function() {
      return ft(this.flags_, e.isComputingMask_);
    },
    set: function(n) {
      this.flags_ = ct(this.flags_, e.isComputingMask_, n);
    }
  }, {
    key: "isRunningSetter",
    get: function() {
      return ft(this.flags_, e.isRunningSetterMask_);
    },
    set: function(n) {
      this.flags_ = ct(this.flags_, e.isRunningSetterMask_, n);
    }
  }, {
    key: "isBeingObserved",
    get: function() {
      return ft(this.flags_, e.isBeingObservedMask_);
    },
    set: function(n) {
      this.flags_ = ct(this.flags_, e.isBeingObservedMask_, n);
    }
  }, {
    key: "isPendingUnobservation",
    get: function() {
      return ft(this.flags_, e.isPendingUnobservationMask_);
    },
    set: function(n) {
      this.flags_ = ct(this.flags_, e.isPendingUnobservationMask_, n);
    }
  }, {
    key: "diffValue",
    get: function() {
      return ft(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(n) {
      this.flags_ = ct(this.flags_, e.diffValueMask_, n === 1);
    }
  }]);
}();
Bt.isComputingMask_ = 1;
Bt.isRunningSetterMask_ = 2;
Bt.isBeingObservedMask_ = 4;
Bt.isPendingUnobservationMask_ = 8;
Bt.diffValueMask_ = 16;
var Bn = /* @__PURE__ */ bn("ComputedValue", Bt), z;
(function(e) {
  e[e.NOT_TRACKING_ = -1] = "NOT_TRACKING_", e[e.UP_TO_DATE_ = 0] = "UP_TO_DATE_", e[e.POSSIBLY_STALE_ = 1] = "POSSIBLY_STALE_", e[e.STALE_ = 2] = "STALE_";
})(z || (z = {}));
var Ct;
(function(e) {
  e[e.NONE = 0] = "NONE", e[e.LOG = 1] = "LOG", e[e.BREAK = 2] = "BREAK";
})(Ct || (Ct = {}));
var Ja = function(t) {
  this.cause = void 0, this.cause = t;
};
function Aa(e) {
  return e instanceof Ja;
}
function zc(e) {
  switch (e.dependenciesState_) {
    case z.UP_TO_DATE_:
      return !1;
    case z.NOT_TRACKING_:
    case z.STALE_:
      return !0;
    case z.POSSIBLY_STALE_: {
      for (var t = df(!0), r = ni(), n = e.observing_, i = n.length, s = 0; s < i; s++) {
        var o = n[s];
        if (Bn(o)) {
          if (O.disableErrorBoundaries)
            o.get();
          else
            try {
              o.get();
            } catch {
              return jr(r), Ai(t), !0;
            }
          if (e.dependenciesState_ === z.STALE_)
            return jr(r), Ai(t), !0;
        }
      }
      return SA(e), jr(r), Ai(t), !1;
    }
  }
}
function Jj() {
  return O.trackingDerivation !== null;
}
function fr(e) {
  if (process.env.NODE_ENV !== "production") {
    var t = e.observers_.size > 0;
    !O.allowStateChanges && (t || O.enforceActions === "always") && console.warn("[MobX] " + (O.enforceActions ? "Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: " : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, a computed value or the render function of a React component? You can wrap side effects in 'runInAction' (or decorate functions with 'action') if needed. Tried to modify: ") + e.name_);
  }
}
function Zj(e) {
  process.env.NODE_ENV !== "production" && !O.allowStateReads && O.observableRequiresReaction && console.warn("[mobx] Observable '" + e.name_ + "' being read outside a reactive context.");
}
function EA(e, t, r) {
  var n = df(!0);
  SA(e), e.newObserving_ = new Array(
    // Reserve constant space for initial dependencies, dynamic space otherwise.
    // See https://github.com/mobxjs/mobx/pull/3833
    e.runId_ === 0 ? 100 : e.observing_.length
  ), e.unboundDepsCount_ = 0, e.runId_ = ++O.runId;
  var i = O.trackingDerivation;
  O.trackingDerivation = e, O.inBatch++;
  var s;
  if (O.disableErrorBoundaries === !0)
    s = t.call(r);
  else
    try {
      s = t.call(r);
    } catch (o) {
      s = new Ja(o);
    }
  return O.inBatch--, O.trackingDerivation = i, eF(e), Qj(e), Ai(n), s;
}
function Qj(e) {
  process.env.NODE_ENV !== "production" && e.observing_.length === 0 && (typeof e.requiresObservable_ == "boolean" ? e.requiresObservable_ : O.reactionRequiresObservable) && console.warn("[mobx] Derivation '" + e.name_ + "' is created/updated without reading any observable value.");
}
function eF(e) {
  for (var t = e.observing_, r = e.observing_ = e.newObserving_, n = z.UP_TO_DATE_, i = 0, s = e.unboundDepsCount_, o = 0; o < s; o++) {
    var a = r[o];
    a.diffValue === 0 && (a.diffValue = 1, i !== o && (r[i] = a), i++), a.dependenciesState_ > n && (n = a.dependenciesState_);
  }
  for (r.length = i, e.newObserving_ = null, s = t.length; s--; ) {
    var u = t[s];
    u.diffValue === 0 && RA(u, e), u.diffValue = 0;
  }
  for (; i--; ) {
    var f = r[i];
    f.diffValue === 1 && (f.diffValue = 0, aF(f, e));
  }
  n !== z.UP_TO_DATE_ && (e.dependenciesState_ = n, e.onBecomeStale_());
}
function Uc(e) {
  var t = e.observing_;
  e.observing_ = [];
  for (var r = t.length; r--; )
    RA(t[r], e);
  e.dependenciesState_ = z.NOT_TRACKING_;
}
function lp(e) {
  var t = ni();
  try {
    return e();
  } finally {
    jr(t);
  }
}
function ni() {
  var e = O.trackingDerivation;
  return O.trackingDerivation = null, e;
}
function jr(e) {
  O.trackingDerivation = e;
}
function df(e) {
  var t = O.allowStateReads;
  return O.allowStateReads = e, t;
}
function Ai(e) {
  O.allowStateReads = e;
}
function SA(e) {
  if (e.dependenciesState_ !== z.UP_TO_DATE_) {
    e.dependenciesState_ = z.UP_TO_DATE_;
    for (var t = e.observing_, r = t.length; r--; )
      t[r].lowestObserverState_ = z.UP_TO_DATE_;
  }
}
var tF = ["mobxGuid", "spyListeners", "enforceActions", "computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "allowStateReads", "disableErrorBoundaries", "runId", "UNCHANGED", "useProxies"], $s = function() {
  this.version = 6, this.UNCHANGED = {}, this.trackingDerivation = null, this.trackingContext = null, this.runId = 0, this.mobxGuid = 0, this.inBatch = 0, this.pendingUnobservations = [], this.pendingReactions = [], this.isRunningReactions = !1, this.allowStateChanges = !1, this.allowStateReads = !0, this.enforceActions = !0, this.spyListeners = [], this.globalReactionErrorHandlers = [], this.computedRequiresReaction = !1, this.reactionRequiresObservable = !1, this.observableRequiresReaction = !1, this.disableErrorBoundaries = !1, this.suppressReactionErrors = !1, this.useProxies = !0, this.verifyProxies = !1, this.safeDescriptors = !0;
}, Oa = !0, xA = !1, O = /* @__PURE__ */ function() {
  var e = /* @__PURE__ */ af();
  return e.__mobxInstanceCount > 0 && !e.__mobxGlobals && (Oa = !1), e.__mobxGlobals && e.__mobxGlobals.version !== new $s().version && (Oa = !1), Oa ? e.__mobxGlobals ? (e.__mobxInstanceCount += 1, e.__mobxGlobals.UNCHANGED || (e.__mobxGlobals.UNCHANGED = {}), e.__mobxGlobals) : (e.__mobxInstanceCount = 1, e.__mobxGlobals = /* @__PURE__ */ new $s()) : (setTimeout(function() {
    xA || E(35);
  }, 1), new $s());
}();
function rF() {
  if ((O.pendingReactions.length || O.inBatch || O.isRunningReactions) && E(36), xA = !0, Oa) {
    var e = af();
    --e.__mobxInstanceCount === 0 && (e.__mobxGlobals = void 0), O = new $s();
  }
}
function nF() {
  return O;
}
function iF() {
  var e = new $s();
  for (var t in e)
    tF.indexOf(t) === -1 && (O[t] = e[t]);
  O.allowStateChanges = !O.enforceActions;
}
function sF(e) {
  return e.observers_ && e.observers_.size > 0;
}
function oF(e) {
  return e.observers_;
}
function aF(e, t) {
  e.observers_.add(t), e.lowestObserverState_ > t.dependenciesState_ && (e.lowestObserverState_ = t.dependenciesState_);
}
function RA(e, t) {
  e.observers_.delete(t), e.observers_.size === 0 && TA(e);
}
function TA(e) {
  e.isPendingUnobservation === !1 && (e.isPendingUnobservation = !0, O.pendingUnobservations.push(e));
}
function Qe() {
  O.inBatch++;
}
function et() {
  if (--O.inBatch === 0) {
    IA();
    for (var e = O.pendingUnobservations, t = 0; t < e.length; t++) {
      var r = e[t];
      r.isPendingUnobservation = !1, r.observers_.size === 0 && (r.isBeingObserved && (r.isBeingObserved = !1, r.onBUO()), r instanceof Bt && r.suspend_());
    }
    O.pendingUnobservations = [];
  }
}
function PA(e) {
  Zj(e);
  var t = O.trackingDerivation;
  return t !== null ? (t.runId_ !== e.lastAccessedBy_ && (e.lastAccessedBy_ = t.runId_, t.newObserving_[t.unboundDepsCount_++] = e, !e.isBeingObserved && O.trackingContext && (e.isBeingObserved = !0, e.onBO())), e.isBeingObserved) : (e.observers_.size === 0 && O.inBatch > 0 && TA(e), !1);
}
function NA(e) {
  e.lowestObserverState_ !== z.STALE_ && (e.lowestObserverState_ = z.STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === z.UP_TO_DATE_ && (process.env.NODE_ENV !== "production" && t.isTracing_ !== Ct.NONE && $A(t, e), t.onBecomeStale_()), t.dependenciesState_ = z.STALE_;
  }));
}
function uF(e) {
  e.lowestObserverState_ !== z.STALE_ && (e.lowestObserverState_ = z.STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === z.POSSIBLY_STALE_ ? (t.dependenciesState_ = z.STALE_, process.env.NODE_ENV !== "production" && t.isTracing_ !== Ct.NONE && $A(t, e)) : t.dependenciesState_ === z.UP_TO_DATE_ && (e.lowestObserverState_ = z.UP_TO_DATE_);
  }));
}
function fF(e) {
  e.lowestObserverState_ === z.UP_TO_DATE_ && (e.lowestObserverState_ = z.POSSIBLY_STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === z.UP_TO_DATE_ && (t.dependenciesState_ = z.POSSIBLY_STALE_, t.onBecomeStale_());
  }));
}
function $A(e, t) {
  if (console.log("[mobx.trace] '" + e.name_ + "' is invalidated due to a change in: '" + t.name_ + "'"), e.isTracing_ === Ct.BREAK) {
    var r = [];
    MA(UA(e), r, 1), new Function(`debugger;
/*
Tracing '` + e.name_ + `'

You are entering this break point because derivation '` + e.name_ + "' is being traced and '" + t.name_ + `' is now forcing it to update.
Just follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update
The stackframe you are looking for is at least ~6-8 stack-frames up.

` + (e instanceof Bt ? e.derivation.toString().replace(/[*]\//g, "/") : "") + `

The dependencies for this derivation are:

` + r.join(`
`) + `
*/
    `)();
  }
}
function MA(e, t, r) {
  if (t.length >= 1e3) {
    t.push("(and many more)");
    return;
  }
  t.push("" + "	".repeat(r - 1) + e.name), e.dependencies && e.dependencies.forEach(function(n) {
    return MA(n, t, r + 1);
  });
}
var vr = /* @__PURE__ */ function() {
  function e(r, n, i, s) {
    r === void 0 && (r = process.env.NODE_ENV !== "production" ? "Reaction@" + St() : "Reaction"), this.name_ = void 0, this.onInvalidate_ = void 0, this.errorHandler_ = void 0, this.requiresObservable_ = void 0, this.observing_ = [], this.newObserving_ = [], this.dependenciesState_ = z.NOT_TRACKING_, this.runId_ = 0, this.unboundDepsCount_ = 0, this.flags_ = 0, this.isTracing_ = Ct.NONE, this.name_ = r, this.onInvalidate_ = n, this.errorHandler_ = i, this.requiresObservable_ = s;
  }
  var t = e.prototype;
  return t.onBecomeStale_ = function() {
    this.schedule_();
  }, t.schedule_ = function() {
    this.isScheduled || (this.isScheduled = !0, O.pendingReactions.push(this), IA());
  }, t.runReaction_ = function() {
    if (!this.isDisposed) {
      Qe(), this.isScheduled = !1;
      var n = O.trackingContext;
      if (O.trackingContext = this, zc(this)) {
        this.isTrackPending = !0;
        try {
          this.onInvalidate_(), process.env.NODE_ENV !== "production" && this.isTrackPending && Re() && zn({
            name: this.name_,
            type: "scheduled-reaction"
          });
        } catch (i) {
          this.reportExceptionInDerivation_(i);
        }
      }
      O.trackingContext = n, et();
    }
  }, t.track = function(n) {
    if (!this.isDisposed) {
      Qe();
      var i = Re(), s;
      process.env.NODE_ENV !== "production" && i && (s = Date.now(), vt({
        name: this.name_,
        type: "reaction"
      })), this.isRunning = !0;
      var o = O.trackingContext;
      O.trackingContext = this;
      var a = EA(this, n, void 0);
      O.trackingContext = o, this.isRunning = !1, this.isTrackPending = !1, this.isDisposed && Uc(this), Aa(a) && this.reportExceptionInDerivation_(a.cause), process.env.NODE_ENV !== "production" && i && gt({
        time: Date.now() - s
      }), et();
    }
  }, t.reportExceptionInDerivation_ = function(n) {
    var i = this;
    if (this.errorHandler_) {
      this.errorHandler_(n, this);
      return;
    }
    if (O.disableErrorBoundaries)
      throw n;
    var s = process.env.NODE_ENV !== "production" ? "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'" : "[mobx] uncaught error in '" + this + "'";
    O.suppressReactionErrors ? process.env.NODE_ENV !== "production" && console.warn("[mobx] (error in reaction '" + this.name_ + "' suppressed, fix error of causing action below)") : console.error(s, n), process.env.NODE_ENV !== "production" && Re() && zn({
      type: "error",
      name: this.name_,
      message: s,
      error: "" + n
    }), O.globalReactionErrorHandlers.forEach(function(o) {
      return o(n, i);
    });
  }, t.dispose = function() {
    this.isDisposed || (this.isDisposed = !0, this.isRunning || (Qe(), Uc(this), et()));
  }, t.getDisposer_ = function(n) {
    var i = this, s = function o() {
      i.dispose(), n == null || n.removeEventListener == null || n.removeEventListener("abort", o);
    };
    return n == null || n.addEventListener == null || n.addEventListener("abort", s), s[R] = this, s;
  }, t.toString = function() {
    return "Reaction[" + this.name_ + "]";
  }, t.trace = function(n) {
    n === void 0 && (n = !1), YA(this, n);
  }, os(e, [{
    key: "isDisposed",
    get: function() {
      return ft(this.flags_, e.isDisposedMask_);
    },
    set: function(n) {
      this.flags_ = ct(this.flags_, e.isDisposedMask_, n);
    }
  }, {
    key: "isScheduled",
    get: function() {
      return ft(this.flags_, e.isScheduledMask_);
    },
    set: function(n) {
      this.flags_ = ct(this.flags_, e.isScheduledMask_, n);
    }
  }, {
    key: "isTrackPending",
    get: function() {
      return ft(this.flags_, e.isTrackPendingMask_);
    },
    set: function(n) {
      this.flags_ = ct(this.flags_, e.isTrackPendingMask_, n);
    }
  }, {
    key: "isRunning",
    get: function() {
      return ft(this.flags_, e.isRunningMask_);
    },
    set: function(n) {
      this.flags_ = ct(this.flags_, e.isRunningMask_, n);
    }
  }, {
    key: "diffValue",
    get: function() {
      return ft(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(n) {
      this.flags_ = ct(this.flags_, e.diffValueMask_, n === 1);
    }
  }]);
}();
vr.isDisposedMask_ = 1;
vr.isScheduledMask_ = 2;
vr.isTrackPendingMask_ = 4;
vr.isRunningMask_ = 8;
vr.diffValueMask_ = 16;
function cF(e) {
  return O.globalReactionErrorHandlers.push(e), function() {
    var t = O.globalReactionErrorHandlers.indexOf(e);
    t >= 0 && O.globalReactionErrorHandlers.splice(t, 1);
  };
}
var O_ = 100, Vc = function(t) {
  return t();
};
function IA() {
  O.inBatch > 0 || O.isRunningReactions || Vc(lF);
}
function lF() {
  O.isRunningReactions = !0;
  for (var e = O.pendingReactions, t = 0; e.length > 0; ) {
    ++t === O_ && (console.error(process.env.NODE_ENV !== "production" ? "Reaction doesn't converge to a stable state after " + O_ + " iterations." + (" Probably there is a cycle in the reactive function: " + e[0]) : "[mobx] cycle in reaction: " + e[0]), e.splice(0));
    for (var r = e.splice(0), n = 0, i = r.length; n < i; n++)
      r[n].runReaction_();
  }
  O.isRunningReactions = !1;
}
var Za = /* @__PURE__ */ bn("Reaction", vr);
function hF(e) {
  var t = Vc;
  Vc = function(n) {
    return e(function() {
      return t(n);
    });
  };
}
function Re() {
  return process.env.NODE_ENV !== "production" && !!O.spyListeners.length;
}
function zn(e) {
  if (process.env.NODE_ENV !== "production" && O.spyListeners.length)
    for (var t = O.spyListeners, r = 0, n = t.length; r < n; r++)
      t[r](e);
}
function vt(e) {
  if (process.env.NODE_ENV !== "production") {
    var t = _r({}, e, {
      spyReportStart: !0
    });
    zn(t);
  }
}
var pF = {
  type: "report-end",
  spyReportEnd: !0
};
function gt(e) {
  process.env.NODE_ENV !== "production" && zn(e ? _r({}, e, {
    type: "report-end",
    spyReportEnd: !0
  }) : pF);
}
function DA(e) {
  return process.env.NODE_ENV === "production" ? (console.warn("[mobx.spy] Is a no-op in production builds"), function() {
  }) : (O.spyListeners.push(e), sp(function() {
    O.spyListeners = O.spyListeners.filter(function(t) {
      return t !== e;
    });
  }));
}
var hp = "action", dF = "action.bound", CA = "autoAction", _F = "autoAction.bound", LA = "<unnamed action>", kc = /* @__PURE__ */ Wo(hp), vF = /* @__PURE__ */ Wo(dF, {
  bound: !0
}), Wc = /* @__PURE__ */ Wo(CA, {
  autoAction: !0
}), gF = /* @__PURE__ */ Wo(_F, {
  autoAction: !0,
  bound: !0
});
function jA(e) {
  var t = function(n, i) {
    if (oe(n))
      return ln(n.name || LA, n, e);
    if (oe(i))
      return ln(n, i, e);
    if (ko(i))
      return (e ? Wc : kc).decorate_20223_(n, i);
    if (dr(i))
      return Vo(n, i, e ? Wc : kc);
    if (dr(n))
      return Xt(Wo(e ? CA : hp, {
        name: n,
        autoAction: e
      }));
    process.env.NODE_ENV !== "production" && E("Invalid arguments for `action`");
  };
  return t;
}
var Xr = /* @__PURE__ */ jA(!1);
Object.assign(Xr, kc);
var zi = /* @__PURE__ */ jA(!0);
Object.assign(zi, Wc);
Xr.bound = /* @__PURE__ */ Xt(vF);
zi.bound = /* @__PURE__ */ Xt(gF);
function E_(e) {
  return wA(e.name || LA, !1, e, this, void 0);
}
function Un(e) {
  return oe(e) && e.isMobxAction === !0;
}
function pp(e, t) {
  var r, n, i, s;
  t === void 0 && (t = ip), process.env.NODE_ENV !== "production" && (oe(e) || E("Autorun expects a function as first argument"), Un(e) && E("Autorun does not accept actions since actions are untrackable"));
  var o = (r = (n = t) == null ? void 0 : n.name) != null ? r : process.env.NODE_ENV !== "production" ? e.name || "Autorun@" + St() : "Autorun", a = !t.scheduler && !t.delay, u;
  if (a)
    u = new vr(o, function() {
      this.track(l);
    }, t.onError, t.requiresObservable);
  else {
    var f = FA(t), c = !1;
    u = new vr(o, function() {
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
var yF = function(t) {
  return t();
};
function FA(e) {
  return e.scheduler ? e.scheduler : e.delay ? function(t) {
    return setTimeout(t, e.delay);
  } : yF;
}
function bF(e, t, r) {
  var n, i, s;
  r === void 0 && (r = ip), process.env.NODE_ENV !== "production" && ((!oe(e) || !oe(t)) && E("First and second argument to reaction should be functions"), rt(r) || E("Third argument of reactions should be an object"));
  var o = (n = r.name) != null ? n : process.env.NODE_ENV !== "production" ? "Reaction@" + St() : "Reaction", a = Xr(o, r.onError ? mF(r.onError, t) : t), u = !r.scheduler && !r.delay, f = FA(r), c = !0, l = !1, h, d = r.compareStructural ? jn.structural : r.equals || jn.default, _ = new vr(o, function() {
    c || u ? v() : l || (l = !0, f(v));
  }, r.onError, r.requiresObservable);
  function v() {
    if (l = !1, !_.isDisposed) {
      var g = !1, y = h;
      _.track(function() {
        var b = fp(!1, function() {
          return e(_);
        });
        g = c || !d(h, b), h = b;
      }), (c && r.fireImmediately || !c && g) && a(h, y, _), c = !1;
    }
  }
  return (i = r) != null && (i = i.signal) != null && i.aborted || _.schedule_(), _.getDisposer_((s = r) == null ? void 0 : s.signal);
}
function mF(e, t) {
  return function() {
    try {
      return t.apply(this, arguments);
    } catch (r) {
      e.call(this, r);
    }
  };
}
var wF = "onBO", AF = "onBUO";
function BA(e, t, r) {
  return zA(wF, e, t, r);
}
function dp(e, t, r) {
  return zA(AF, e, t, r);
}
function zA(e, t, r, n) {
  var i = typeof n == "function" ? tr(t, r) : tr(t), s = oe(n) ? n : r, o = e + "L";
  return i[o] ? i[o].add(s) : i[o] = /* @__PURE__ */ new Set([s]), function() {
    var a = i[o];
    a && (a.delete(s), a.size === 0 && delete i[o]);
  };
}
var OF = "never", la = "always", EF = "observed";
function SF(e) {
  e.isolateGlobalState === !0 && rF();
  var t = e.useProxies, r = e.enforceActions;
  if (t !== void 0 && (O.useProxies = t === la ? !0 : t === OF ? !1 : typeof Proxy < "u"), t === "ifavailable" && (O.verifyProxies = !0), r !== void 0) {
    var n = r === la ? la : r === EF;
    O.enforceActions = n, O.allowStateChanges = !(n === !0 || n === la);
  }
  ["computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "disableErrorBoundaries", "safeDescriptors"].forEach(function(i) {
    i in e && (O[i] = !!e[i]);
  }), O.allowStateReads = !O.observableRequiresReaction, process.env.NODE_ENV !== "production" && O.disableErrorBoundaries === !0 && console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled."), e.reactionScheduler && hF(e.reactionScheduler);
}
function _p(e, t, r, n) {
  process.env.NODE_ENV !== "production" && (arguments.length > 4 && E("'extendObservable' expected 2-4 arguments"), typeof e != "object" && E("'extendObservable' expects an object as first argument"), ge(e) && E("'extendObservable' should not be used on maps, use map.merge instead"), rt(t) || E("'extendObservable' only accepts plain objects as second argument"), (kn(t) || kn(r)) && E("Extending an object with another observable (object) is not supported"));
  var i = Z3(t);
  return wn(function() {
    var s = ii(e, n)[R];
    Bi(i).forEach(function(o) {
      s.extend_(
        o,
        i[o],
        // must pass "undefined" for { key: undefined }
        r && o in r ? r[o] : !0
      );
    });
  }), e;
}
function UA(e, t) {
  return VA(tr(e, t));
}
function VA(e) {
  var t = {
    name: e.name_
  };
  return e.observing_ && e.observing_.length > 0 && (t.dependencies = RF(e.observing_).map(VA)), t;
}
function xF(e, t) {
  return kA(tr(e, t));
}
function kA(e) {
  var t = {
    name: e.name_
  };
  return sF(e) && (t.observers = Array.from(oF(e)).map(kA)), t;
}
function RF(e) {
  return Array.from(new Set(e));
}
var TF = 0;
function _f() {
  this.message = "FLOW_CANCELLED";
}
_f.prototype = /* @__PURE__ */ Object.create(Error.prototype);
function PF(e) {
  return e instanceof _f;
}
var kf = /* @__PURE__ */ dA("flow"), NF = /* @__PURE__ */ dA("flow.bound", {
  bound: !0
}), Vn = /* @__PURE__ */ Object.assign(function(t, r) {
  if (ko(r))
    return kf.decorate_20223_(t, r);
  if (dr(r))
    return Vo(t, r, kf);
  process.env.NODE_ENV !== "production" && arguments.length !== 1 && E("Flow expects single argument with generator function");
  var n = t, i = n.name || "<unnamed flow>", s = function() {
    var a = this, u = arguments, f = ++TF, c = Xr(i + " - runid: " + f + " - init", n).apply(a, u), l, h = void 0, d = new Promise(function(_, v) {
      var g = 0;
      l = v;
      function y(m) {
        h = void 0;
        var A;
        try {
          A = Xr(i + " - runid: " + f + " - yield " + g++, c.next).call(c, m);
        } catch (S) {
          return v(S);
        }
        w(A);
      }
      function b(m) {
        h = void 0;
        var A;
        try {
          A = Xr(i + " - runid: " + f + " - yield " + g++, c.throw).call(c, m);
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
    return d.cancel = Xr(i + " - runid: " + f + " - cancel", function() {
      try {
        h && S_(h);
        var _ = c.return(void 0), v = Promise.resolve(_.value);
        v.then(hi, hi), S_(v), l(new _f());
      } catch (g) {
        l(g);
      }
    }), d;
  };
  return s.isMobXFlow = !0, s;
}, kf);
Vn.bound = /* @__PURE__ */ Xt(NF);
function S_(e) {
  oe(e.cancel) && e.cancel();
}
function $F(e) {
  return e;
}
function Ui(e) {
  return e?.isMobXFlow === !0;
}
function MF(e, t, r) {
  var n;
  if (ge(e) || Xe(e) || cp(e))
    n = gr(e);
  else if (de(e)) {
    if (process.env.NODE_ENV !== "production" && !dr(t))
      return E("InterceptReads can only be used with a specific property, not with an object in general");
    n = gr(e, t);
  } else if (process.env.NODE_ENV !== "production")
    return E("Expected observable map, object or array as first array");
  return process.env.NODE_ENV !== "production" && n.dehancer !== void 0 ? E("An intercept reader was already established") : (n.dehancer = typeof t == "function" ? t : r, function() {
    n.dehancer = void 0;
  });
}
function IF(e, t, r) {
  return oe(r) ? CF(e, t, r) : DF(e, t);
}
function DF(e, t) {
  return gr(e).intercept_(t);
}
function CF(e, t, r) {
  return gr(e, t).intercept_(r);
}
function WA(e, t) {
  if (t === void 0)
    return Bn(e);
  if (de(e) === !1 || !e[R].values_.has(t))
    return !1;
  var r = tr(e, t);
  return Bn(r);
}
function LF(e) {
  return process.env.NODE_ENV !== "production" && arguments.length > 1 ? E("isComputed expects only 1 argument. Use isComputedProp to inspect the observability of a property") : WA(e);
}
function jF(e, t) {
  return process.env.NODE_ENV !== "production" && !dr(t) ? E("isComputed expected a property name as second argument") : WA(e, t);
}
function qA(e, t) {
  return e ? t !== void 0 ? process.env.NODE_ENV !== "production" && (ge(e) || Xe(e)) ? E("isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.") : de(e) ? e[R].values_.has(t) : !1 : de(e) || !!e[R] || op(e) || Za(e) || Bn(e) : !1;
}
function kn(e) {
  return process.env.NODE_ENV !== "production" && arguments.length !== 1 && E("isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property"), qA(e);
}
function FF(e, t) {
  return process.env.NODE_ENV !== "production" && !dr(t) ? E("expected a property name as second argument") : qA(e, t);
}
function to(e) {
  if (de(e))
    return e[R].keys_();
  if (ge(e) || pe(e))
    return Array.from(e.keys());
  if (Xe(e))
    return e.map(function(t, r) {
      return r;
    });
  E(5);
}
function BF(e) {
  if (de(e))
    return to(e).map(function(t) {
      return e[t];
    });
  if (ge(e))
    return to(e).map(function(t) {
      return e.get(t);
    });
  if (pe(e))
    return Array.from(e.values());
  if (Xe(e))
    return e.slice();
  E(6);
}
function zF(e) {
  if (de(e))
    return to(e).map(function(t) {
      return [t, e[t]];
    });
  if (ge(e))
    return to(e).map(function(t) {
      return [t, e.get(t)];
    });
  if (pe(e))
    return Array.from(e.entries());
  if (Xe(e))
    return e.map(function(t, r) {
      return [r, t];
    });
  E(7);
}
function GA(e, t, r) {
  if (arguments.length === 2 && !pe(e)) {
    Qe();
    var n = t;
    try {
      for (var i in n)
        GA(e, i, n[i]);
    } finally {
      et();
    }
    return;
  }
  de(e) ? e[R].set_(t, r) : ge(e) ? e.set(t, r) : pe(e) ? e.add(t) : Xe(e) ? (typeof t != "number" && (t = parseInt(t, 10)), t < 0 && E("Invalid index: '" + t + "'"), Qe(), t >= e.length && (e.length = t + 1), e[t] = r, et()) : E(8);
}
function UF(e, t) {
  de(e) ? e[R].delete_(t) : ge(e) || pe(e) ? e.delete(t) : Xe(e) ? (typeof t != "number" && (t = parseInt(t, 10)), e.splice(t, 1)) : E(9);
}
function HA(e, t) {
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
function VF(e, t) {
  if (HA(e, t)) {
    if (de(e))
      return e[R].get_(t);
    if (ge(e))
      return e.get(t);
    if (Xe(e))
      return e[t];
    E(11);
  }
}
function kF(e, t, r) {
  if (de(e))
    return e[R].defineProperty_(t, r);
  E(39);
}
function KA(e) {
  if (de(e))
    return e[R].ownKeys_();
  E(38);
}
function WF(e, t, r, n) {
  return oe(r) ? GF(e, t, r, n) : qF(e, t, r);
}
function qF(e, t, r) {
  return gr(e).observe_(t, r);
}
function GF(e, t, r, n) {
  return gr(e, t).observe_(r, n);
}
function ha(e, t, r) {
  return e.set(t, r), r;
}
function li(e, t) {
  if (e == null || typeof e != "object" || e instanceof Date || !kn(e))
    return e;
  if (cp(e) || Bn(e))
    return li(e.get(), t);
  if (t.has(e))
    return t.get(e);
  if (Xe(e)) {
    var r = ha(t, e, new Array(e.length));
    return e.forEach(function(o, a) {
      r[a] = li(o, t);
    }), r;
  }
  if (pe(e)) {
    var n = ha(t, e, /* @__PURE__ */ new Set());
    return e.forEach(function(o) {
      n.add(li(o, t));
    }), n;
  }
  if (ge(e)) {
    var i = ha(t, e, /* @__PURE__ */ new Map());
    return e.forEach(function(o, a) {
      i.set(a, li(o, t));
    }), i;
  } else {
    var s = ha(t, e, {});
    return KA(e).forEach(function(o) {
      zo.propertyIsEnumerable.call(e, o) && (s[o] = li(e[o], t));
    }), s;
  }
}
function HF(e, t) {
  return process.env.NODE_ENV !== "production" && t && E("toJS no longer supports options"), li(e, /* @__PURE__ */ new Map());
}
function YA() {
  if (process.env.NODE_ENV !== "production") {
    for (var e = !1, t = arguments.length, r = new Array(t), n = 0; n < t; n++)
      r[n] = arguments[n];
    typeof r[r.length - 1] == "boolean" && (e = r.pop());
    var i = KF(r);
    if (!i)
      return E("'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
    i.isTracing_ === Ct.NONE && console.log("[mobx.trace] '" + i.name_ + "' tracing enabled"), i.isTracing_ = e ? Ct.BREAK : Ct.LOG;
  }
}
function KF(e) {
  switch (e.length) {
    case 0:
      return O.trackingDerivation;
    case 1:
      return tr(e[0]);
    case 2:
      return tr(e[0], e[1]);
  }
}
function or(e, t) {
  t === void 0 && (t = void 0), Qe();
  try {
    return e.apply(t);
  } finally {
    et();
  }
}
function YF(e, t, r) {
  return arguments.length === 1 || t && typeof t == "object" ? XF(e, t) : XA(e, t, r || {});
}
function XA(e, t, r) {
  var n;
  if (typeof r.timeout == "number") {
    var i = new Error("WHEN_TIMEOUT");
    n = setTimeout(function() {
      if (!o[R].isDisposed)
        if (o(), r.onError)
          r.onError(i);
        else
          throw i;
    }, r.timeout);
  }
  r.name = process.env.NODE_ENV !== "production" ? r.name || "When@" + St() : "When";
  var s = ln(process.env.NODE_ENV !== "production" ? r.name + "-effect" : "When-effect", t), o = pp(function(a) {
    var u = fp(!1, e);
    u && (a.dispose(), n && clearTimeout(n), s());
  }, r);
  return o;
}
function XF(e, t) {
  var r;
  if (process.env.NODE_ENV !== "production" && t && t.onError)
    return E("the options 'onError' and 'promise' cannot be combined");
  if (t != null && (r = t.signal) != null && r.aborted)
    return Object.assign(Promise.reject(new Error("WHEN_ABORTED")), {
      cancel: function() {
        return null;
      }
    });
  var n, i, s = new Promise(function(o, a) {
    var u, f = XA(e, o, _r({}, t, {
      onError: a
    }));
    n = function() {
      f(), a(new Error("WHEN_CANCELLED"));
    }, i = function() {
      f(), a(new Error("WHEN_ABORTED"));
    }, t == null || (u = t.signal) == null || u.addEventListener == null || u.addEventListener("abort", i);
  }).finally(function() {
    var o;
    return t == null || (o = t.signal) == null || o.removeEventListener == null ? void 0 : o.removeEventListener("abort", i);
  });
  return s.cancel = n, s;
}
function On(e) {
  return e[R];
}
var JF = {
  has: function(t, r) {
    return process.env.NODE_ENV !== "production" && O.trackingDerivation && _s("detect new properties using the 'in' operator. Use 'has' from 'mobx' instead."), On(t).has_(r);
  },
  get: function(t, r) {
    return On(t).get_(r);
  },
  set: function(t, r, n) {
    var i;
    return dr(r) ? (process.env.NODE_ENV !== "production" && !On(t).values_.has(r) && _s("add a new observable property through direct assignment. Use 'set' from 'mobx' instead."), (i = On(t).set_(r, n, !0)) != null ? i : !0) : !1;
  },
  deleteProperty: function(t, r) {
    var n;
    return process.env.NODE_ENV !== "production" && _s("delete properties from an observable object. Use 'remove' from 'mobx' instead."), dr(r) ? (n = On(t).delete_(r, !0)) != null ? n : !0 : !1;
  },
  defineProperty: function(t, r, n) {
    var i;
    return process.env.NODE_ENV !== "production" && _s("define property on an observable object. Use 'defineProperty' from 'mobx' instead."), (i = On(t).defineProperty_(r, n)) != null ? i : !0;
  },
  ownKeys: function(t) {
    return process.env.NODE_ENV !== "production" && O.trackingDerivation && _s("iterate keys to detect added / removed properties. Use 'keys' from 'mobx' instead."), On(t).ownKeys_();
  },
  preventExtensions: function(t) {
    E(13);
  }
};
function ZF(e, t) {
  var r, n;
  return oA(), e = ii(e, t), (n = (r = e[R]).proxy_) != null ? n : r.proxy_ = new Proxy(e, JF);
}
function Pt(e) {
  return e.interceptors_ !== void 0 && e.interceptors_.length > 0;
}
function Go(e, t) {
  var r = e.interceptors_ || (e.interceptors_ = []);
  return r.push(t), sp(function() {
    var n = r.indexOf(t);
    n !== -1 && r.splice(n, 1);
  });
}
function Nt(e, t) {
  var r = ni();
  try {
    for (var n = [].concat(e.interceptors_ || []), i = 0, s = n.length; i < s && (t = n[i](t), t && !t.type && E(14), !!t); i++)
      ;
    return t;
  } finally {
    jr(r);
  }
}
function Jt(e) {
  return e.changeListeners_ !== void 0 && e.changeListeners_.length > 0;
}
function Ho(e, t) {
  var r = e.changeListeners_ || (e.changeListeners_ = []);
  return r.push(t), sp(function() {
    var n = r.indexOf(t);
    n !== -1 && r.splice(n, 1);
  });
}
function Zt(e, t) {
  var r = ni(), n = e.changeListeners_;
  if (n) {
    n = n.slice();
    for (var i = 0, s = n.length; i < s; i++)
      n[i](t);
    jr(r);
  }
}
function QF(e, t, r) {
  return wn(function() {
    var n, i = ii(e, r)[R];
    process.env.NODE_ENV !== "production" && t && e[Ze] && E("makeObservable second arg must be nullish when using decorators. Mixing @decorator syntax with annotations is not supported."), (n = t) != null || (t = ij(e)), Bi(t).forEach(function(s) {
      return i.make_(s, t[s]);
    });
  }), e;
}
var Wf = /* @__PURE__ */ Symbol("mobx-keys");
function eB(e, t, r) {
  return process.env.NODE_ENV !== "production" && (!rt(e) && !rt(Object.getPrototypeOf(e)) && E("'makeAutoObservable' can only be used for classes that don't have a superclass"), de(e) && E("makeAutoObservable can only be used on objects not already made observable")), rt(e) ? _p(e, e, t, r) : (wn(function() {
    var n = ii(e, r)[R];
    if (!e[Wf]) {
      var i = Object.getPrototypeOf(e), s = new Set([].concat(Bi(e), Bi(i)));
      s.delete("constructor"), s.delete(R), Uo(i, Wf, s);
    }
    e[Wf].forEach(function(o) {
      return n.make_(
        o,
        // must pass "undefined" for { key: undefined }
        t && o in t ? t[o] : !0
      );
    });
  }), e);
}
var x_ = "splice", Ht = "update", tB = 1e4, rB = {
  get: function(t, r) {
    var n = t[R];
    return r === R ? n : r === "length" ? n.getArrayLength_() : typeof r == "string" && !isNaN(r) ? n.get_(parseInt(r)) : _t(Qa, r) ? Qa[r] : t[r];
  },
  set: function(t, r, n) {
    var i = t[R];
    return r === "length" && i.setArrayLength_(n), typeof r == "symbol" || isNaN(r) ? t[r] = n : i.set_(parseInt(r), n), !0;
  },
  preventExtensions: function() {
    E(15);
  }
}, vp = /* @__PURE__ */ function() {
  function e(r, n, i, s) {
    r === void 0 && (r = process.env.NODE_ENV !== "production" ? "ObservableArray@" + St() : "ObservableArray"), this.owned_ = void 0, this.legacyMode_ = void 0, this.atom_ = void 0, this.values_ = [], this.interceptors_ = void 0, this.changeListeners_ = void 0, this.enhancer_ = void 0, this.dehancer = void 0, this.proxy_ = void 0, this.lastKnownLength_ = 0, this.owned_ = i, this.legacyMode_ = s, this.atom_ = new mn(r), this.enhancer_ = function(o, a) {
      return n(o, a, process.env.NODE_ENV !== "production" ? r + "[..]" : "ObservableArray[..]");
    };
  }
  var t = e.prototype;
  return t.dehanceValue_ = function(n) {
    return this.dehancer !== void 0 ? this.dehancer(n) : n;
  }, t.dehanceValues_ = function(n) {
    return this.dehancer !== void 0 && n.length > 0 ? n.map(this.dehancer) : n;
  }, t.intercept_ = function(n) {
    return Go(this, n);
  }, t.observe_ = function(n, i) {
    return i === void 0 && (i = !1), i && n({
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: "splice",
      index: 0,
      added: this.values_.slice(),
      addedCount: this.values_.length,
      removed: [],
      removedCount: 0
    }), Ho(this, n);
  }, t.getArrayLength_ = function() {
    return this.atom_.reportObserved(), this.values_.length;
  }, t.setArrayLength_ = function(n) {
    (typeof n != "number" || isNaN(n) || n < 0) && E("Out of range: " + n);
    var i = this.values_.length;
    if (n !== i)
      if (n > i) {
        for (var s = new Array(n - i), o = 0; o < n - i; o++)
          s[o] = void 0;
        this.spliceWithArray_(i, 0, s);
      } else
        this.spliceWithArray_(n, i - n);
  }, t.updateArrayLength_ = function(n, i) {
    n !== this.lastKnownLength_ && E(16), this.lastKnownLength_ += i, this.legacyMode_ && i > 0 && eO(n + i + 1);
  }, t.spliceWithArray_ = function(n, i, s) {
    var o = this;
    fr(this.atom_);
    var a = this.values_.length;
    if (n === void 0 ? n = 0 : n > a ? n = a : n < 0 && (n = Math.max(0, a + n)), arguments.length === 1 ? i = a - n : i == null ? i = 0 : i = Math.max(0, Math.min(i, a - n)), s === void 0 && (s = Ka), Pt(this)) {
      var u = Nt(this, {
        object: this.proxy_,
        type: x_,
        index: n,
        removedCount: i,
        added: s
      });
      if (!u)
        return Ka;
      i = u.removedCount, s = u.added;
    }
    if (s = s.length === 0 ? s : s.map(function(l) {
      return o.enhancer_(l, void 0);
    }), this.legacyMode_ || process.env.NODE_ENV !== "production") {
      var f = s.length - i;
      this.updateArrayLength_(a, f);
    }
    var c = this.spliceItemsIntoValues_(n, i, s);
    return (i !== 0 || s.length !== 0) && this.notifyArraySplice_(n, s, c), this.dehanceValues_(c);
  }, t.spliceItemsIntoValues_ = function(n, i, s) {
    if (s.length < tB) {
      var o;
      return (o = this.values_).splice.apply(o, [n, i].concat(s));
    } else {
      var a = this.values_.slice(n, n + i), u = this.values_.slice(n + i);
      this.values_.length += s.length - i;
      for (var f = 0; f < s.length; f++)
        this.values_[n + f] = s[f];
      for (var c = 0; c < u.length; c++)
        this.values_[n + s.length + c] = u[c];
      return a;
    }
  }, t.notifyArrayChildUpdate_ = function(n, i, s) {
    var o = !this.owned_ && Re(), a = Jt(this), u = a || o ? {
      observableKind: "array",
      object: this.proxy_,
      type: Ht,
      debugObjectName: this.atom_.name_,
      index: n,
      newValue: i,
      oldValue: s
    } : null;
    process.env.NODE_ENV !== "production" && o && vt(u), this.atom_.reportChanged(), a && Zt(this, u), process.env.NODE_ENV !== "production" && o && gt();
  }, t.notifyArraySplice_ = function(n, i, s) {
    var o = !this.owned_ && Re(), a = Jt(this), u = a || o ? {
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: x_,
      index: n,
      removed: s,
      added: i,
      removedCount: s.length,
      addedCount: i.length
    } : null;
    process.env.NODE_ENV !== "production" && o && vt(u), this.atom_.reportChanged(), a && Zt(this, u), process.env.NODE_ENV !== "production" && o && gt();
  }, t.get_ = function(n) {
    if (this.legacyMode_ && n >= this.values_.length) {
      console.warn(process.env.NODE_ENV !== "production" ? "[mobx.array] Attempt to read an array index (" + n + ") that is out of bounds (" + this.values_.length + "). Please check length first. Out of bound indices will not be tracked by MobX" : "[mobx] Out of bounds read: " + n);
      return;
    }
    return this.atom_.reportObserved(), this.dehanceValue_(this.values_[n]);
  }, t.set_ = function(n, i) {
    var s = this.values_;
    if (this.legacyMode_ && n > s.length && E(17, n, s.length), n < s.length) {
      fr(this.atom_);
      var o = s[n];
      if (Pt(this)) {
        var a = Nt(this, {
          type: Ht,
          object: this.proxy_,
          // since "this" is the real array we need to pass its proxy
          index: n,
          newValue: i
        });
        if (!a)
          return;
        i = a.newValue;
      }
      i = this.enhancer_(i, o);
      var u = i !== o;
      u && (s[n] = i, this.notifyArrayChildUpdate_(n, i, o));
    } else {
      for (var f = new Array(n + 1 - s.length), c = 0; c < f.length - 1; c++)
        f[c] = void 0;
      f[f.length - 1] = i, this.spliceWithArray_(s.length, 0, f);
    }
  }, e;
}();
function nB(e, t, r, n) {
  return r === void 0 && (r = process.env.NODE_ENV !== "production" ? "ObservableArray@" + St() : "ObservableArray"), n === void 0 && (n = !1), oA(), wn(function() {
    var i = new vp(r, t, n, !1);
    uA(i.values_, R, i);
    var s = new Proxy(i.values_, rB);
    return i.proxy_ = s, e && e.length && i.spliceWithArray_(0, 0, e), s;
  });
}
var Qa = {
  clear: function() {
    return this.splice(0);
  },
  replace: function(t) {
    var r = this[R];
    return r.spliceWithArray_(0, r.values_.length, t);
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
  splice: function(t, r) {
    for (var n = arguments.length, i = new Array(n > 2 ? n - 2 : 0), s = 2; s < n; s++)
      i[s - 2] = arguments[s];
    var o = this[R];
    switch (arguments.length) {
      case 0:
        return [];
      case 1:
        return o.spliceWithArray_(t);
      case 2:
        return o.spliceWithArray_(t, r);
    }
    return o.spliceWithArray_(t, r, i);
  },
  spliceWithArray: function(t, r, n) {
    return this[R].spliceWithArray_(t, r, n);
  },
  push: function() {
    for (var t = this[R], r = arguments.length, n = new Array(r), i = 0; i < r; i++)
      n[i] = arguments[i];
    return t.spliceWithArray_(t.values_.length, 0, n), t.values_.length;
  },
  pop: function() {
    return this.splice(Math.max(this[R].values_.length - 1, 0), 1)[0];
  },
  shift: function() {
    return this.splice(0, 1)[0];
  },
  unshift: function() {
    for (var t = this[R], r = arguments.length, n = new Array(r), i = 0; i < r; i++)
      n[i] = arguments[i];
    return t.spliceWithArray_(0, 0, n), t.values_.length;
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
    var r = this[R], n = r.dehanceValues_(r.values_).indexOf(t);
    return n > -1 ? (this.splice(n, 1), !0) : !1;
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
Q("every", rr);
Q("filter", rr);
Q("find", rr);
Q("findIndex", rr);
Q("findLast", rr);
Q("findLastIndex", rr);
Q("flatMap", rr);
Q("forEach", rr);
Q("map", rr);
Q("some", rr);
Q("toReversed", rr);
Q("reduce", JA);
Q("reduceRight", JA);
function Q(e, t) {
  typeof Array.prototype[e] == "function" && (Qa[e] = t(e));
}
function xt(e) {
  return function() {
    var t = this[R];
    t.atom_.reportObserved();
    var r = t.dehanceValues_(t.values_);
    return r[e].apply(r, arguments);
  };
}
function rr(e) {
  return function(t, r) {
    var n = this, i = this[R];
    i.atom_.reportObserved();
    var s = i.dehanceValues_(i.values_);
    return s[e](function(o, a) {
      return t.call(r, o, a, n);
    });
  };
}
function JA(e) {
  return function() {
    var t = this, r = this[R];
    r.atom_.reportObserved();
    var n = r.dehanceValues_(r.values_), i = arguments[0];
    return arguments[0] = function(s, o, a) {
      return i(s, o, a, t);
    }, n[e].apply(n, arguments);
  };
}
var iB = /* @__PURE__ */ bn("ObservableArrayAdministration", vp);
function Xe(e) {
  return uf(e) && iB(e[R]);
}
var sB = {}, Jr = "add", eu = "delete", gp = /* @__PURE__ */ function() {
  function e(r, n, i) {
    var s = this;
    n === void 0 && (n = Fn), i === void 0 && (i = process.env.NODE_ENV !== "production" ? "ObservableMap@" + St() : "ObservableMap"), this.enhancer_ = void 0, this.name_ = void 0, this[R] = sB, this.data_ = void 0, this.hasMap_ = void 0, this.keysAtom_ = void 0, this.interceptors_ = void 0, this.changeListeners_ = void 0, this.dehancer = void 0, this.enhancer_ = n, this.name_ = i, oe(Map) || E(18), wn(function() {
      s.keysAtom_ = ap(process.env.NODE_ENV !== "production" ? s.name_ + ".keys()" : "ObservableMap.keys()"), s.data_ = /* @__PURE__ */ new Map(), s.hasMap_ = /* @__PURE__ */ new Map(), r && s.merge(r);
    });
  }
  var t = e.prototype;
  return t.has_ = function(n) {
    return this.data_.has(n);
  }, t.has = function(n) {
    var i = this;
    if (!O.trackingDerivation)
      return this.has_(n);
    var s = this.hasMap_.get(n);
    if (!s) {
      var o = s = new rn(this.has_(n), cf, process.env.NODE_ENV !== "production" ? this.name_ + "." + Lc(n) + "?" : "ObservableMap.key?", !1);
      this.hasMap_.set(n, o), dp(o, function() {
        return i.hasMap_.delete(n);
      });
    }
    return s.get();
  }, t.set = function(n, i) {
    var s = this.has_(n);
    if (Pt(this)) {
      var o = Nt(this, {
        type: s ? Ht : Jr,
        object: this,
        newValue: i,
        name: n
      });
      if (!o)
        return this;
      i = o.newValue;
    }
    return s ? this.updateValue_(n, i) : this.addValue_(n, i), this;
  }, t.delete = function(n) {
    var i = this;
    if (fr(this.keysAtom_), Pt(this)) {
      var s = Nt(this, {
        type: eu,
        object: this,
        name: n
      });
      if (!s)
        return !1;
    }
    if (this.has_(n)) {
      var o = Re(), a = Jt(this), u = a || o ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: eu,
        object: this,
        oldValue: this.data_.get(n).value_,
        name: n
      } : null;
      return process.env.NODE_ENV !== "production" && o && vt(u), or(function() {
        var f;
        i.keysAtom_.reportChanged(), (f = i.hasMap_.get(n)) == null || f.setNewValue_(!1);
        var c = i.data_.get(n);
        c.setNewValue_(void 0), i.data_.delete(n);
      }), a && Zt(this, u), process.env.NODE_ENV !== "production" && o && gt(), !0;
    }
    return !1;
  }, t.updateValue_ = function(n, i) {
    var s = this.data_.get(n);
    if (i = s.prepareNewValue_(i), i !== O.UNCHANGED) {
      var o = Re(), a = Jt(this), u = a || o ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: Ht,
        object: this,
        oldValue: s.value_,
        name: n,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && o && vt(u), s.setNewValue_(i), a && Zt(this, u), process.env.NODE_ENV !== "production" && o && gt();
    }
  }, t.addValue_ = function(n, i) {
    var s = this;
    fr(this.keysAtom_), or(function() {
      var f, c = new rn(i, s.enhancer_, process.env.NODE_ENV !== "production" ? s.name_ + "." + Lc(n) : "ObservableMap.key", !1);
      s.data_.set(n, c), i = c.value_, (f = s.hasMap_.get(n)) == null || f.setNewValue_(!0), s.keysAtom_.reportChanged();
    });
    var o = Re(), a = Jt(this), u = a || o ? {
      observableKind: "map",
      debugObjectName: this.name_,
      type: Jr,
      object: this,
      name: n,
      newValue: i
    } : null;
    process.env.NODE_ENV !== "production" && o && vt(u), a && Zt(this, u), process.env.NODE_ENV !== "production" && o && gt();
  }, t.get = function(n) {
    return this.has(n) ? this.dehanceValue_(this.data_.get(n).get()) : this.dehanceValue_(void 0);
  }, t.dehanceValue_ = function(n) {
    return this.dehancer !== void 0 ? this.dehancer(n) : n;
  }, t.keys = function() {
    return this.keysAtom_.reportObserved(), this.data_.keys();
  }, t.values = function() {
    var n = this, i = this.keys();
    return R_({
      next: function() {
        var o = i.next(), a = o.done, u = o.value;
        return {
          done: a,
          value: a ? void 0 : n.get(u)
        };
      }
    });
  }, t.entries = function() {
    var n = this, i = this.keys();
    return R_({
      next: function() {
        var o = i.next(), a = o.done, u = o.value;
        return {
          done: a,
          value: a ? void 0 : [u, n.get(u)]
        };
      }
    });
  }, t[Symbol.iterator] = function() {
    return this.entries();
  }, t.forEach = function(n, i) {
    for (var s = pi(this), o; !(o = s()).done; ) {
      var a = o.value, u = a[0], f = a[1];
      n.call(i, f, u, this);
    }
  }, t.merge = function(n) {
    var i = this;
    return ge(n) && (n = new Map(n)), or(function() {
      rt(n) ? J3(n).forEach(function(s) {
        return i.set(s, n[s]);
      }) : Array.isArray(n) ? n.forEach(function(s) {
        var o = s[0], a = s[1];
        return i.set(o, a);
      }) : ss(n) ? (X3(n) || E(19, n), n.forEach(function(s, o) {
        return i.set(o, s);
      })) : n != null && E(20, n);
    }), this;
  }, t.clear = function() {
    var n = this;
    or(function() {
      lp(function() {
        for (var i = pi(n.keys()), s; !(s = i()).done; ) {
          var o = s.value;
          n.delete(o);
        }
      });
    });
  }, t.replace = function(n) {
    var i = this;
    return or(function() {
      for (var s = oB(n), o = /* @__PURE__ */ new Map(), a = !1, u = pi(i.data_.keys()), f; !(f = u()).done; ) {
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
      for (var d = pi(s.entries()), _; !(_ = d()).done; ) {
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
  }, t.observe_ = function(n, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support fireImmediately=true in combination with maps."), Ho(this, n);
  }, t.intercept_ = function(n) {
    return Go(this, n);
  }, os(e, [{
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
}(), ge = /* @__PURE__ */ bn("ObservableMap", gp);
function R_(e) {
  return e[Symbol.toStringTag] = "MapIterator", wp(e);
}
function oB(e) {
  if (ss(e) || ge(e))
    return e;
  if (Array.isArray(e))
    return new Map(e);
  if (rt(e)) {
    var t = /* @__PURE__ */ new Map();
    for (var r in e)
      t.set(r, e[r]);
    return t;
  } else
    return E(21, e);
}
var aB = {}, yp = /* @__PURE__ */ function() {
  function e(r, n, i) {
    var s = this;
    n === void 0 && (n = Fn), i === void 0 && (i = process.env.NODE_ENV !== "production" ? "ObservableSet@" + St() : "ObservableSet"), this.name_ = void 0, this[R] = aB, this.data_ = /* @__PURE__ */ new Set(), this.atom_ = void 0, this.changeListeners_ = void 0, this.interceptors_ = void 0, this.dehancer = void 0, this.enhancer_ = void 0, this.name_ = i, oe(Set) || E(22), this.enhancer_ = function(o, a) {
      return n(o, a, i);
    }, wn(function() {
      s.atom_ = ap(s.name_), r && s.replace(r);
    });
  }
  var t = e.prototype;
  return t.dehanceValue_ = function(n) {
    return this.dehancer !== void 0 ? this.dehancer(n) : n;
  }, t.clear = function() {
    var n = this;
    or(function() {
      lp(function() {
        for (var i = pi(n.data_.values()), s; !(s = i()).done; ) {
          var o = s.value;
          n.delete(o);
        }
      });
    });
  }, t.forEach = function(n, i) {
    for (var s = pi(this), o; !(o = s()).done; ) {
      var a = o.value;
      n.call(i, a, a, this);
    }
  }, t.add = function(n) {
    var i = this;
    if (fr(this.atom_), Pt(this)) {
      var s = Nt(this, {
        type: Jr,
        object: this,
        newValue: n
      });
      if (!s)
        return this;
      n = s.newValue;
    }
    if (!this.has(n)) {
      or(function() {
        i.data_.add(i.enhancer_(n, void 0)), i.atom_.reportChanged();
      });
      var o = process.env.NODE_ENV !== "production" && Re(), a = Jt(this), u = a || o ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: Jr,
        object: this,
        newValue: n
      } : null;
      o && process.env.NODE_ENV !== "production" && vt(u), a && Zt(this, u), o && process.env.NODE_ENV !== "production" && gt();
    }
    return this;
  }, t.delete = function(n) {
    var i = this;
    if (Pt(this)) {
      var s = Nt(this, {
        type: eu,
        object: this,
        oldValue: n
      });
      if (!s)
        return !1;
    }
    if (this.has(n)) {
      var o = process.env.NODE_ENV !== "production" && Re(), a = Jt(this), u = a || o ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: eu,
        object: this,
        oldValue: n
      } : null;
      return o && process.env.NODE_ENV !== "production" && vt(u), or(function() {
        i.atom_.reportChanged(), i.data_.delete(n);
      }), a && Zt(this, u), o && process.env.NODE_ENV !== "production" && gt(), !0;
    }
    return !1;
  }, t.has = function(n) {
    return this.atom_.reportObserved(), this.data_.has(this.dehanceValue_(n));
  }, t.entries = function() {
    var n = this.values();
    return T_({
      next: function() {
        var s = n.next(), o = s.value, a = s.done;
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
    var n = this, i = this.data_.values();
    return T_({
      next: function() {
        var o = i.next(), a = o.value, u = o.done;
        return u ? {
          value: void 0,
          done: u
        } : {
          value: n.dehanceValue_(a),
          done: u
        };
      }
    });
  }, t.intersection = function(n) {
    if (Cr(n) && !pe(n))
      return n.intersection(this);
    var i = new Set(this);
    return i.intersection(n);
  }, t.union = function(n) {
    if (Cr(n) && !pe(n))
      return n.union(this);
    var i = new Set(this);
    return i.union(n);
  }, t.difference = function(n) {
    return new Set(this).difference(n);
  }, t.symmetricDifference = function(n) {
    if (Cr(n) && !pe(n))
      return n.symmetricDifference(this);
    var i = new Set(this);
    return i.symmetricDifference(n);
  }, t.isSubsetOf = function(n) {
    return new Set(this).isSubsetOf(n);
  }, t.isSupersetOf = function(n) {
    return new Set(this).isSupersetOf(n);
  }, t.isDisjointFrom = function(n) {
    if (Cr(n) && !pe(n))
      return n.isDisjointFrom(this);
    var i = new Set(this);
    return i.isDisjointFrom(n);
  }, t.replace = function(n) {
    var i = this;
    return pe(n) && (n = new Set(n)), or(function() {
      Array.isArray(n) ? (i.clear(), n.forEach(function(s) {
        return i.add(s);
      })) : Cr(n) ? (i.clear(), n.forEach(function(s) {
        return i.add(s);
      })) : n != null && E("Cannot initialize set from " + n);
    }), this;
  }, t.observe_ = function(n, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support fireImmediately=true in combination with sets."), Ho(this, n);
  }, t.intercept_ = function(n) {
    return Go(this, n);
  }, t.toJSON = function() {
    return Array.from(this);
  }, t.toString = function() {
    return "[object ObservableSet]";
  }, t[Symbol.iterator] = function() {
    return this.values();
  }, os(e, [{
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
}(), pe = /* @__PURE__ */ bn("ObservableSet", yp);
function T_(e) {
  return e[Symbol.toStringTag] = "SetIterator", wp(e);
}
var P_ = /* @__PURE__ */ Object.create(null), N_ = "remove", qc = /* @__PURE__ */ function() {
  function e(r, n, i, s) {
    n === void 0 && (n = /* @__PURE__ */ new Map()), s === void 0 && (s = Mj), this.target_ = void 0, this.values_ = void 0, this.name_ = void 0, this.defaultAnnotation_ = void 0, this.keysAtom_ = void 0, this.changeListeners_ = void 0, this.interceptors_ = void 0, this.proxy_ = void 0, this.isPlainObject_ = void 0, this.appliedAnnotations_ = void 0, this.pendingKeys_ = void 0, this.target_ = r, this.values_ = n, this.name_ = i, this.defaultAnnotation_ = s, this.keysAtom_ = new mn(process.env.NODE_ENV !== "production" ? this.name_ + ".keys" : "ObservableObject.keys"), this.isPlainObject_ = rt(this.target_), process.env.NODE_ENV !== "production" && !tO(this.defaultAnnotation_) && E("defaultAnnotation must be valid annotation"), process.env.NODE_ENV !== "production" && (this.appliedAnnotations_ = {});
  }
  var t = e.prototype;
  return t.getObservablePropValue_ = function(n) {
    return this.values_.get(n).get();
  }, t.setObservablePropValue_ = function(n, i) {
    var s = this.values_.get(n);
    if (s instanceof Bt)
      return s.set(i), !0;
    if (Pt(this)) {
      var o = Nt(this, {
        type: Ht,
        object: this.proxy_ || this.target_,
        name: n,
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
        name: n,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && u && vt(f), s.setNewValue_(i), a && Zt(this, f), process.env.NODE_ENV !== "production" && u && gt();
    }
    return !0;
  }, t.get_ = function(n) {
    return O.trackingDerivation && !_t(this.target_, n) && this.has_(n), this.target_[n];
  }, t.set_ = function(n, i, s) {
    return s === void 0 && (s = !1), _t(this.target_, n) ? this.values_.has(n) ? this.setObservablePropValue_(n, i) : s ? Reflect.set(this.target_, n, i) : (this.target_[n] = i, !0) : this.extend_(n, {
      value: i,
      enumerable: !0,
      writable: !0,
      configurable: !0
    }, this.defaultAnnotation_, s);
  }, t.has_ = function(n) {
    if (!O.trackingDerivation)
      return n in this.target_;
    this.pendingKeys_ || (this.pendingKeys_ = /* @__PURE__ */ new Map());
    var i = this.pendingKeys_.get(n);
    return i || (i = new rn(n in this.target_, cf, process.env.NODE_ENV !== "production" ? this.name_ + "." + Lc(n) + "?" : "ObservableObject.key?", !1), this.pendingKeys_.set(n, i)), i.get();
  }, t.make_ = function(n, i) {
    if (i === !0 && (i = this.defaultAnnotation_), i !== !1) {
      if (I_(this, i, n), !(n in this.target_)) {
        var s;
        if ((s = this.target_[Ze]) != null && s[n])
          return;
        E(1, i.annotationType_, this.name_ + "." + n.toString());
      }
      for (var o = this.target_; o && o !== zo; ) {
        var a = Ha(o, n);
        if (a) {
          var u = i.make_(this, n, a, o);
          if (u === 0)
            return;
          if (u === 1)
            break;
        }
        o = Object.getPrototypeOf(o);
      }
      M_(this, i, n);
    }
  }, t.extend_ = function(n, i, s, o) {
    if (o === void 0 && (o = !1), s === !0 && (s = this.defaultAnnotation_), s === !1)
      return this.defineProperty_(n, i, o);
    I_(this, s, n);
    var a = s.extend_(this, n, i, o);
    return a && M_(this, s, n), a;
  }, t.defineProperty_ = function(n, i, s) {
    s === void 0 && (s = !1), fr(this.keysAtom_);
    try {
      Qe();
      var o = this.delete_(n);
      if (!o)
        return o;
      if (Pt(this)) {
        var a = Nt(this, {
          object: this.proxy_ || this.target_,
          name: n,
          type: Jr,
          newValue: i.value
        });
        if (!a)
          return null;
        var u = a.newValue;
        i.value !== u && (i = _r({}, i, {
          value: u
        }));
      }
      if (s) {
        if (!Reflect.defineProperty(this.target_, n, i))
          return !1;
      } else
        lr(this.target_, n, i);
      this.notifyPropertyAddition_(n, i.value);
    } finally {
      et();
    }
    return !0;
  }, t.defineObservableProperty_ = function(n, i, s, o) {
    o === void 0 && (o = !1), fr(this.keysAtom_);
    try {
      Qe();
      var a = this.delete_(n);
      if (!a)
        return a;
      if (Pt(this)) {
        var u = Nt(this, {
          object: this.proxy_ || this.target_,
          name: n,
          type: Jr,
          newValue: i
        });
        if (!u)
          return null;
        i = u.newValue;
      }
      var f = $_(n), c = {
        configurable: O.safeDescriptors ? this.isPlainObject_ : !0,
        enumerable: !0,
        get: f.get,
        set: f.set
      };
      if (o) {
        if (!Reflect.defineProperty(this.target_, n, c))
          return !1;
      } else
        lr(this.target_, n, c);
      var l = new rn(i, s, process.env.NODE_ENV !== "production" ? this.name_ + "." + n.toString() : "ObservableObject.key", !1);
      this.values_.set(n, l), this.notifyPropertyAddition_(n, l.value_);
    } finally {
      et();
    }
    return !0;
  }, t.defineComputedProperty_ = function(n, i, s) {
    s === void 0 && (s = !1), fr(this.keysAtom_);
    try {
      Qe();
      var o = this.delete_(n);
      if (!o)
        return o;
      if (Pt(this)) {
        var a = Nt(this, {
          object: this.proxy_ || this.target_,
          name: n,
          type: Jr,
          newValue: void 0
        });
        if (!a)
          return null;
      }
      i.name || (i.name = process.env.NODE_ENV !== "production" ? this.name_ + "." + n.toString() : "ObservableObject.key"), i.context = this.proxy_ || this.target_;
      var u = $_(n), f = {
        configurable: O.safeDescriptors ? this.isPlainObject_ : !0,
        enumerable: !1,
        get: u.get,
        set: u.set
      };
      if (s) {
        if (!Reflect.defineProperty(this.target_, n, f))
          return !1;
      } else
        lr(this.target_, n, f);
      this.values_.set(n, new Bt(i)), this.notifyPropertyAddition_(n, void 0);
    } finally {
      et();
    }
    return !0;
  }, t.delete_ = function(n, i) {
    if (i === void 0 && (i = !1), fr(this.keysAtom_), !_t(this.target_, n))
      return !0;
    if (Pt(this)) {
      var s = Nt(this, {
        object: this.proxy_ || this.target_,
        name: n,
        type: N_
      });
      if (!s)
        return null;
    }
    try {
      var o;
      Qe();
      var a = Jt(this), u = process.env.NODE_ENV !== "production" && Re(), f = this.values_.get(n), c = void 0;
      if (!f && (a || u)) {
        var l;
        c = (l = Ha(this.target_, n)) == null ? void 0 : l.value;
      }
      if (i) {
        if (!Reflect.deleteProperty(this.target_, n))
          return !1;
      } else
        delete this.target_[n];
      if (process.env.NODE_ENV !== "production" && delete this.appliedAnnotations_[n], f && (this.values_.delete(n), f instanceof rn && (c = f.value_), NA(f)), this.keysAtom_.reportChanged(), (o = this.pendingKeys_) == null || (o = o.get(n)) == null || o.set(n in this.target_), a || u) {
        var h = {
          type: N_,
          observableKind: "object",
          object: this.proxy_ || this.target_,
          debugObjectName: this.name_,
          oldValue: c,
          name: n
        };
        process.env.NODE_ENV !== "production" && u && vt(h), a && Zt(this, h), process.env.NODE_ENV !== "production" && u && gt();
      }
    } finally {
      et();
    }
    return !0;
  }, t.observe_ = function(n, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && E("`observe` doesn't support the fire immediately property for observable objects."), Ho(this, n);
  }, t.intercept_ = function(n) {
    return Go(this, n);
  }, t.notifyPropertyAddition_ = function(n, i) {
    var s, o = Jt(this), a = process.env.NODE_ENV !== "production" && Re();
    if (o || a) {
      var u = o || a ? {
        type: Jr,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        name: n,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && a && vt(u), o && Zt(this, u), process.env.NODE_ENV !== "production" && a && gt();
    }
    (s = this.pendingKeys_) == null || (s = s.get(n)) == null || s.set(!0), this.keysAtom_.reportChanged();
  }, t.ownKeys_ = function() {
    return this.keysAtom_.reportObserved(), Bi(this.target_);
  }, t.keys_ = function() {
    return this.keysAtom_.reportObserved(), Object.keys(this.target_);
  }, e;
}();
function ii(e, t) {
  var r;
  if (process.env.NODE_ENV !== "production" && t && de(e) && E("Options can't be provided for already observable objects."), _t(e, R))
    return process.env.NODE_ENV !== "production" && !(gr(e) instanceof qc) && E("Cannot convert '" + ro(e) + `' into observable object:
The target is already observable of different type.
Extending builtins is not supported.`), e;
  process.env.NODE_ENV !== "production" && !Object.isExtensible(e) && E("Cannot make the designated object observable; it is not extensible");
  var n = (r = t?.name) != null ? r : process.env.NODE_ENV !== "production" ? (rt(e) ? "ObservableObject" : e.constructor.name) + "@" + St() : "ObservableObject", i = new qc(e, /* @__PURE__ */ new Map(), String(n), kj(t));
  return Uo(e, R, i), e;
}
var uB = /* @__PURE__ */ bn("ObservableObjectAdministration", qc);
function $_(e) {
  return P_[e] || (P_[e] = {
    get: function() {
      return this[R].getObservablePropValue_(e);
    },
    set: function(r) {
      return this[R].setObservablePropValue_(e, r);
    }
  });
}
function de(e) {
  return uf(e) ? uB(e[R]) : !1;
}
function M_(e, t, r) {
  var n;
  process.env.NODE_ENV !== "production" && (e.appliedAnnotations_[r] = t), (n = e.target_[Ze]) == null || delete n[r];
}
function I_(e, t, r) {
  if (process.env.NODE_ENV !== "production" && !tO(t) && E("Cannot annotate '" + e.name_ + "." + r.toString() + "': Invalid annotation."), process.env.NODE_ENV !== "production" && !Ya(t) && _t(e.appliedAnnotations_, r)) {
    var n = e.name_ + "." + r.toString(), i = e.appliedAnnotations_[r].annotationType_, s = t.annotationType_;
    E("Cannot apply '" + s + "' to '" + n + "':" + (`
The field is already annotated with '` + i + "'.") + `
Re-annotating fields is not allowed.
Use 'override' annotation for methods overridden by subclass.`);
  }
}
var fB = /* @__PURE__ */ QA(0), cB = /* @__PURE__ */ function() {
  var e = !1, t = {};
  return Object.defineProperty(t, "0", {
    set: function() {
      e = !0;
    }
  }), Object.create(t)[0] = 1, e === !1;
}(), qf = 0, ZA = function() {
};
function lB(e, t) {
  Object.setPrototypeOf ? Object.setPrototypeOf(e.prototype, t) : e.prototype.__proto__ !== void 0 ? e.prototype.__proto__ = t : e.prototype = t;
}
lB(ZA, Array.prototype);
var bp = /* @__PURE__ */ function(e) {
  function t(n, i, s, o) {
    var a;
    return s === void 0 && (s = process.env.NODE_ENV !== "production" ? "ObservableArray@" + St() : "ObservableArray"), o === void 0 && (o = !1), a = e.call(this) || this, wn(function() {
      var u = new vp(s, i, o, !0);
      u.proxy_ = a, uA(a, R, u), n && n.length && a.spliceWithArray(0, 0, n), cB && Object.defineProperty(a, "0", fB);
    }), a;
  }
  lA(t, e);
  var r = t.prototype;
  return r.concat = function() {
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
  }, r[Symbol.iterator] = function() {
    var n = this, i = 0;
    return wp({
      next: function() {
        return i < n.length ? {
          value: n[i++],
          done: !1
        } : {
          done: !0,
          value: void 0
        };
      }
    });
  }, os(t, [{
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
}(ZA);
Object.entries(Qa).forEach(function(e) {
  var t = e[0], r = e[1];
  t !== "concat" && Uo(bp.prototype, t, r);
});
function QA(e) {
  return {
    enumerable: !1,
    configurable: !0,
    get: function() {
      return this[R].get_(e);
    },
    set: function(r) {
      this[R].set_(e, r);
    }
  };
}
function hB(e) {
  lr(bp.prototype, "" + e, QA(e));
}
function eO(e) {
  if (e > qf) {
    for (var t = qf; t < e + 100; t++)
      hB(t);
    qf = e;
  }
}
eO(1e3);
function pB(e, t, r) {
  return new bp(e, t, r);
}
function tr(e, t) {
  if (typeof e == "object" && e !== null) {
    if (Xe(e))
      return t !== void 0 && E(23), e[R].atom_;
    if (pe(e))
      return e.atom_;
    if (ge(e)) {
      if (t === void 0)
        return e.keysAtom_;
      var r = e.data_.get(t) || e.hasMap_.get(t);
      return r || E(25, t, ro(e)), r;
    }
    if (de(e)) {
      if (!t)
        return E(26);
      var n = e[R].values_.get(t);
      return n || E(27, t, ro(e)), n;
    }
    if (op(e) || Bn(e) || Za(e))
      return e;
  } else if (oe(e) && Za(e[R]))
    return e[R];
  E(28);
}
function gr(e, t) {
  if (e || E(29), t !== void 0)
    return gr(tr(e, t));
  if (op(e) || Bn(e) || Za(e) || ge(e) || pe(e))
    return e;
  if (e[R])
    return e[R];
  E(24, e);
}
function ro(e, t) {
  var r;
  if (t !== void 0)
    r = tr(e, t);
  else {
    if (Un(e))
      return e.name;
    de(e) || ge(e) || pe(e) ? r = gr(e) : r = tr(e);
  }
  return r.name_;
}
function wn(e) {
  var t = ni(), r = hf(!0);
  Qe();
  try {
    return e();
  } finally {
    et(), pf(r), jr(t);
  }
}
var D_ = zo.toString;
function mp(e, t, r) {
  return r === void 0 && (r = -1), Gc(e, t, r);
}
function Gc(e, t, r, n, i) {
  if (e === t)
    return e !== 0 || 1 / e === 1 / t;
  if (e == null || t == null)
    return !1;
  if (e !== e)
    return t !== t;
  var s = typeof e;
  if (s !== "function" && s !== "object" && typeof t != "object")
    return !1;
  var o = D_.call(e);
  if (o !== D_.call(t))
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
      r >= 0 && r++;
      break;
  }
  e = C_(e), t = C_(t);
  var a = o === "[object Array]";
  if (!a) {
    if (typeof e != "object" || typeof t != "object")
      return !1;
    var u = e.constructor, f = t.constructor;
    if (u !== f && !(oe(u) && u instanceof u && oe(f) && f instanceof f) && "constructor" in e && "constructor" in t)
      return !1;
  }
  if (r === 0)
    return !1;
  r < 0 && (r = -1), n = n || [], i = i || [];
  for (var c = n.length; c--; )
    if (n[c] === e)
      return i[c] === t;
  if (n.push(e), i.push(t), a) {
    if (c = e.length, c !== t.length)
      return !1;
    for (; c--; )
      if (!Gc(e[c], t[c], r - 1, n, i))
        return !1;
  } else {
    var l = Object.keys(e), h = l.length;
    if (Object.keys(t).length !== h)
      return !1;
    for (var d = 0; d < h; d++) {
      var _ = l[d];
      if (!(_t(t, _) && Gc(e[_], t[_], r - 1, n, i)))
        return !1;
    }
  }
  return n.pop(), i.pop(), !0;
}
function C_(e) {
  return Xe(e) ? e.slice() : ss(e) || ge(e) || Cr(e) || pe(e) ? Array.from(e.entries()) : e;
}
var L_, dB = ((L_ = af().Iterator) == null ? void 0 : L_.prototype) || {};
function wp(e) {
  return e[Symbol.iterator] = _B, Object.assign(Object.create(dB), e);
}
function _B() {
  return this;
}
function tO(e) {
  return (
    // Can be function
    e instanceof Object && typeof e.annotationType_ == "string" && oe(e.make_) && oe(e.extend_)
  );
}
["Symbol", "Map", "Set"].forEach(function(e) {
  var t = af();
  typeof t[e] > "u" && E("MobX requires global '" + e + "' to be available or polyfilled");
});
typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ == "object" && __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
  spy: DA,
  extras: {
    getDebugName: ro
  },
  $mobx: R
});
const e5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $mobx: R,
  FlowCancellationError: _f,
  ObservableMap: gp,
  ObservableSet: yp,
  Reaction: vr,
  _allowStateChanges: fp,
  _allowStateChangesInsideComputed: E_,
  _allowStateReadsEnd: Ai,
  _allowStateReadsStart: df,
  _autoAction: zi,
  _endAction: OA,
  _getAdministration: gr,
  _getGlobalState: nF,
  _interceptReads: MF,
  _isComputingDerivation: Jj,
  _resetGlobalState: iF,
  _startAction: AA,
  action: Xr,
  autorun: pp,
  comparer: jn,
  computed: qo,
  configure: SF,
  createAtom: ap,
  defineProperty: kF,
  entries: zF,
  extendObservable: _p,
  flow: Vn,
  flowResult: $F,
  get: VF,
  getAtom: tr,
  getDebugName: ro,
  getDependencyTree: UA,
  getObserverTree: xF,
  has: HA,
  intercept: IF,
  isAction: Un,
  isBoxedObservable: cp,
  isComputed: LF,
  isComputedProp: jF,
  isFlow: Ui,
  isFlowCancellationError: PF,
  isObservable: kn,
  isObservableArray: Xe,
  isObservableMap: ge,
  isObservableObject: de,
  isObservableProp: FF,
  isObservableSet: pe,
  keys: to,
  makeAutoObservable: eB,
  makeObservable: QF,
  observable: me,
  observe: WF,
  onBecomeObserved: BA,
  onBecomeUnobserved: dp,
  onReactionError: cF,
  override: lj,
  ownKeys: KA,
  reaction: bF,
  remove: UF,
  runInAction: E_,
  set: GA,
  spy: DA,
  toJS: HF,
  trace: YA,
  transaction: or,
  untracked: lp,
  values: BF,
  when: YF
}, Symbol.toStringTag, { value: "Module" }));
function rO(e, t) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function Sr(e, t, r) {
  return e.context ? e.callback(r, ...t) : e.callback(...t);
}
class vB {
  interceptions;
  interceptionKeySet;
  constructor() {
    this.interceptions = [], this.interceptionKeySet = /* @__PURE__ */ new Set();
  }
  isUsed() {
    return this.interceptions.length > 0;
  }
  intercept(t) {
    this.interceptions.push(t), Object.keys(t).forEach((r) => {
      this.interceptionKeySet.add(r);
    });
  }
  tap(t) {
    this.interceptionKeySet.has("tap") && this.interceptions.forEach((r) => {
      r.tap?.(t);
    });
  }
  call(t, ...r) {
    this.interceptionKeySet.has("call") && this.interceptions.forEach((n) => {
      n.context ? n.call?.(t, ...r) : n.call?.(...r);
    });
  }
  loop(...t) {
    this.interceptionKeySet.has("loop") && this.interceptions.forEach((r) => {
      r.loop?.(...t);
    });
  }
  error(t) {
    if (this.interceptionKeySet.has("error") && t instanceof Error) {
      const r = t;
      this.interceptions.forEach((n) => {
        n.error?.(r);
      });
    }
  }
  result(t) {
    this.interceptionKeySet.has("result") && this.interceptions.forEach((r) => {
      r.result?.(t);
    });
  }
  done() {
    this.interceptionKeySet.has("done") && this.interceptions.forEach((t) => {
      t.done?.();
    });
  }
}
class xr {
  taps;
  interceptions;
  constructor() {
    this.taps = [], this.interceptions = new vB();
  }
  tap(t, r) {
    const n = typeof t == "string" ? {
      name: t,
      context: !1
    } : {
      context: !1,
      ...t
    }, s = {
      key: Symbol(n.name),
      ...n,
      callback: r
    };
    if (s.before) {
      let o = this.taps.length;
      const a = new Set(
        Array.isArray(s.before) ? s.before : [s.before]
      );
      for (o; o > 0 && a.size > 0; o--) {
        const u = this.taps[o - 1];
        if (a.has(u.name) && a.delete(u.name), u.before && rO(s.name, u.before))
          break;
      }
      this.taps.splice(o, 0, s);
    } else
      this.taps.push(s);
    return this.interceptions.tap(s), s;
  }
  untap(t) {
    this.taps = this.taps.filter((r) => r.key !== t.key);
  }
  isUsed() {
    return this.taps.length > 0 || this.interceptions.isUsed();
  }
  intercept(t) {
    this.interceptions.intercept(t);
  }
}
class gB extends xr {
  call(...t) {
    if (!this.isUsed())
      return;
    const r = {};
    this.interceptions.call(r, ...t);
    try {
      this.taps.forEach((n) => {
        Sr(n, t, r);
      });
    } catch (n) {
      throw this.interceptions.error(n), n;
    }
    this.interceptions.done();
  }
}
class yB extends xr {
  call(...t) {
    if (!this.isUsed())
      return;
    const r = {};
    this.interceptions.call(r, ...t);
    for (let n = 0; n < this.taps.length; n += 1) {
      const i = Sr(this.taps[n], t, r);
      if (i !== void 0)
        return this.interceptions.result(i), i;
    }
    this.interceptions.done();
  }
}
class bB extends xr {
  call(...t) {
    const r = {};
    this.interceptions.call(r, ...t);
    let [n, ...i] = t;
    for (let s = 0; s < this.taps.length; s += 1) {
      const o = Sr(this.taps[s], [n, ...i], r);
      o !== void 0 && (n = o);
    }
    return this.interceptions.result(n), n;
  }
}
class mB extends xr {
  call(...t) {
    let r = !1;
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      for (; r !== !0; ) {
        r = !0, this.interceptions.loop(...t);
        for (let i = 0; i < this.taps.length; i += 1)
          if (Sr(this.taps[i], t, n) !== void 0) {
            r = !1;
            break;
          }
      }
    } catch (i) {
      throw this.interceptions.error(i), i;
    }
    this.interceptions.done();
  }
}
class wB extends xr {
  async call(...t) {
    const r = {};
    this.interceptions.call(r, ...t), await Promise.allSettled(this.taps.map((n) => Sr(n, t, r))), this.interceptions.done();
  }
}
class AB extends xr {
  async call(...t) {
    const r = {};
    this.interceptions.call(r, ...t);
    try {
      const n = await Promise.race(
        this.taps.map((i) => Sr(i, t, r))
      );
      return this.interceptions.result(n), n;
    } catch (n) {
      throw this.interceptions.error(n), n;
    }
  }
}
class OB extends xr {
  async call(...t) {
    const r = {};
    this.interceptions.call(r, ...t);
    try {
      for (let n = 0; n < this.taps.length; n += 1)
        await Sr(this.taps[n], t, r);
    } catch (n) {
      throw this.interceptions.error(n), n;
    }
    this.interceptions.done();
  }
}
class EB extends xr {
  async call(...t) {
    const r = {};
    this.interceptions.call(r, ...t);
    try {
      for (let n = 0; n < this.taps.length; n += 1) {
        const i = await Sr(this.taps[n], t, r);
        if (i !== void 0)
          return this.interceptions.result(i), i;
      }
    } catch (n) {
      throw this.interceptions.error(n), n;
    }
    this.interceptions.done();
  }
}
class SB extends xr {
  async call(...t) {
    let [r, ...n] = t;
    const i = {};
    this.interceptions.call(i, ...t);
    try {
      for (let s = 0; s < this.taps.length; s += 1) {
        const o = await Sr(
          this.taps[s],
          [r, ...n],
          i
        );
        o !== void 0 && (r = o);
      }
    } catch (s) {
      throw this.interceptions.error(s), s;
    }
    return this.interceptions.result(r), r;
  }
}
class xB extends xr {
  async call(...t) {
    let r = !1;
    const n = {};
    this.interceptions.call(n, ...t);
    try {
      for (; r !== !0; ) {
        r = !0, this.interceptions.loop(...t);
        for (let i = 0; i < this.taps.length; i += 1)
          if (await Sr(this.taps[i], t, n) !== void 0) {
            r = !1;
            break;
          }
      }
    } catch (i) {
      throw this.interceptions.error(i), i;
    }
    this.interceptions.done();
  }
}
const t5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AsyncParallelBailHook: AB,
  AsyncParallelHook: wB,
  AsyncSeriesBailHook: EB,
  AsyncSeriesHook: OB,
  AsyncSeriesLoopHook: xB,
  AsyncSeriesWaterfallHook: SB,
  SyncBailHook: yB,
  SyncHook: gB,
  SyncLoopHook: mB,
  SyncWaterfallHook: bB,
  equalToOrIn: rO
}, Symbol.toStringTag, { value: "Module" }));
function Hc(e, t) {
  if (e === t) return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    if (e.constructor !== t.constructor) return !1;
    var r, n, i;
    if (Array.isArray(e)) {
      if (r = e.length, r != t.length) return !1;
      for (n = r; n-- !== 0; )
        if (!Hc(e[n], t[n])) return !1;
      return !0;
    }
    if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
    if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf();
    if (e.toString !== Object.prototype.toString) return e.toString() === t.toString();
    if (i = Object.keys(e), r = i.length, r !== Object.keys(t).length) return !1;
    for (n = r; n-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(t, i[n])) return !1;
    for (n = r; n-- !== 0; ) {
      var s = i[n];
      if (!Hc(e[s], t[s])) return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
class RB {
  name;
  fields;
  parent;
  context;
  options;
  current;
  dirty;
  constructor(t, r) {
    this.context = t, this.options = r, this.current = this.default(), this.dirty = !0, r.overrideMethods && Object.assign(this, r.overrideMethods), this.options.init?.call(this);
  }
  equal(t, r) {
    return Hc(t, r);
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
class nO {
  static create(t, r) {
    return new nO(t, r);
  }
  context;
  options = /* @__PURE__ */ new Map();
  optionClass = /* @__PURE__ */ new Map();
  constructor(t, r) {
    return this.context = t, r && this.initOptions(r), new Proxy(this, {
      get(n, i) {
        return n.options.has(i) ? n.getOption(i) : Reflect.get(n, i);
      }
    });
  }
  register(t, r) {
    this.optionClass.set(t, r);
  }
  defineGetter(t) {
    Object.defineProperty(this, t, {
      get: () => this.getOption(t),
      enumerable: !0
    });
  }
  initOptions(t) {
    for (let r in t)
      if (this.optionClass.has(r)) {
        const n = this.optionClass.get(r), i = new n(this.context, t[r]);
        this.addOptionFromInstance(r, i);
      } else
        this.addOptionFromConfig(r, t[r]);
  }
  getOption(t) {
    return this.options.get(t);
  }
  removeOption(t) {
    this.options.has(t) && (this.options.get(t).dispose(), this.options.delete(t));
  }
  addOptionFromInstance(t, r) {
    this.options.has(t) || (r.parent = this, r.name = t, this.options.set(t, r));
  }
  addOptionFromConfig(t, r) {
    this.addOptionFromInstance(t, new RB(this.context, r));
  }
}
function r5(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce(
    (t, r) => (...n) => t(r(...n))
  );
}
function TB(e) {
  return PB(e) && !NB(e);
}
function PB(e) {
  return !!e && typeof e == "object";
}
function NB(e) {
  var t = Object.prototype.toString.call(e);
  return t === "[object RegExp]" || t === "[object Date]" || IB(e);
}
var $B = typeof Symbol == "function" && Symbol.for, MB = $B ? Symbol.for("react.element") : 60103;
function IB(e) {
  return e.$$typeof === MB;
}
var DB = TB;
function CB(e) {
  return Array.isArray(e) ? [] : {};
}
function no(e, t) {
  return t.clone !== !1 && t.isMergeableObject(e) ? io(CB(e), e, t) : e;
}
function LB(e, t, r) {
  return e.concat(t).map(function(n) {
    return no(n, r);
  });
}
function jB(e, t) {
  if (!t.customMerge)
    return io;
  var r = t.customMerge(e);
  return typeof r == "function" ? r : io;
}
function FB(e) {
  return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(e).filter(function(t) {
    return Object.propertyIsEnumerable.call(e, t);
  }) : [];
}
function j_(e) {
  return Object.keys(e).concat(FB(e));
}
function iO(e, t) {
  try {
    return t in e;
  } catch {
    return !1;
  }
}
function BB(e, t) {
  return iO(e, t) && !(Object.hasOwnProperty.call(e, t) && Object.propertyIsEnumerable.call(e, t));
}
function zB(e, t, r) {
  var n = {};
  return r.isMergeableObject(e) && j_(e).forEach(function(i) {
    n[i] = no(e[i], r);
  }), j_(t).forEach(function(i) {
    BB(e, i) || (iO(e, i) && r.isMergeableObject(t[i]) ? n[i] = jB(i, r)(e[i], t[i], r) : n[i] = no(t[i], r));
  }), n;
}
function io(e, t, r) {
  r = r || {}, r.arrayMerge = r.arrayMerge || LB, r.isMergeableObject = r.isMergeableObject || DB, r.cloneUnlessOtherwiseSpecified = no;
  var n = Array.isArray(t), i = Array.isArray(e), s = n === i;
  return s ? n ? r.arrayMerge?.(e, t, r) : zB(e, t, r) : no(t, r);
}
function UB(e, t) {
  if (!Array.isArray(e))
    throw new Error("first argument should be an array");
  return e.reduce(function(r, n) {
    return io(r, n, t);
  }, {});
}
io.all = UB;
function ui(e, t = 0, r = 1) {
  return Math.min(Math.max(e, t), r);
}
function VB(e, t, r) {
  e /= 255, t /= 255, r /= 255;
  const n = Math.max(e, t, r), i = Math.min(e, t, r);
  let s = 0, o, a = (n + i) / 2;
  if (n == i)
    s = o = 0;
  else {
    const u = n - i;
    switch (o = a > 0.5 ? u / (2 - n - i) : u / (n + i), n) {
      case e:
        s = (t - r) / u + (t < r ? 6 : 0);
        break;
      case t:
        s = (r - e) / u + 2;
        break;
      case r:
        s = (e - t) / u + 4;
        break;
    }
    s /= 6;
  }
  return { h: s, s: o, l: a };
}
function F_(e, t, r) {
  let n, i, s;
  if (t == 0)
    n = i = s = r;
  else {
    const o = (f, c, l) => (l < 0 && (l += 1), l > 1 && (l -= 1), l < 0.16666666666666666 ? f + (c - f) * 6 * l : l < 0.5 ? c : l < 0.6666666666666666 ? f + (c - f) * (0.6666666666666666 - l) * 6 : f), a = r < 0.5 ? r * (1 + t) : r + t - r * t, u = 2 * r - a;
    n = o(u, a, e + 1 / 3), i = o(u, a, e), s = o(u, a, e - 1 / 3);
  }
  return { r: n * 255, g: i * 255, b: s * 255 };
}
function n5(e, t, r) {
  e /= 255, t /= 255, r /= 255;
  const n = Math.max(e, t, r), i = Math.min(e, t, r);
  let s = 0, o, a = n;
  const u = n - i;
  if (o = n == 0 ? 0 : u / n, n == i)
    s = 0;
  else {
    switch (n) {
      case e:
        s = (t - r) / u + (t < r ? 6 : 0);
        break;
      case t:
        s = (r - e) / u + 2;
        break;
      case r:
        s = (e - t) / u + 4;
        break;
    }
    s /= 6;
  }
  return { h: s, s: o, v: a };
}
function kB(e, t, r) {
  let n = 0, i = 0, s = 0;
  const o = Math.floor(e * 6), a = e * 6 - o, u = r * (1 - t), f = r * (1 - a * t), c = r * (1 - (1 - a) * t);
  switch (o % 6) {
    case 0:
      n = r, i = c, s = u;
      break;
    case 1:
      n = f, i = r, s = u;
      break;
    case 2:
      n = u, i = r, s = c;
      break;
    case 3:
      n = u, i = f, s = r;
      break;
    case 4:
      n = c, i = u, s = r;
      break;
    case 5:
      n = r, i = u, s = f;
      break;
  }
  return { r: n * 255, g: i * 255, b: s * 255 };
}
function i5(e, t, r) {
  const n = r + t * Math.min(r, 1 - r), i = n === 0 ? 0 : 2 * (1 - r / n);
  return { h: e, s: i, v: n };
}
function s5(e, t, r) {
  const n = (2 - t) * r / 2, i = t === 0 ? t : n <= 1 ? t * r / (2 - t * r) : t * r / (2 - t);
  return { h: e, s: i, l: n };
}
function WB(e) {
  typeof e == "string" && (e = e.replace("#", ""), e = e.length === 3 ? e.replace(/(\w)/g, "$1$1") : e, e = parseInt("0x" + e, 16));
  const t = e, r = t >> 16 & 255, n = t >> 8 & 255, i = t & 255;
  return { r, g: n, b: i };
}
function qB(e, t, r) {
  const n = e.r + (t.r - e.r) * r, i = e.g + (t.g - e.g) * r, s = e.b + (t.b - e.b) * r;
  return { r: n, g: i, b: s };
}
const B_ = {
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
    const r = typeof t == "string";
    if (r && t.toLowerCase().startsWith("rgb")) {
      const n = t.match(/rgba?\s*\(([^)]+)\)\s*/i);
      if (n) {
        const i = n[1].split(",").map(parseInt), s = this.fromRGB(i[0], i[1], i[2]);
        return i.length === 4 && (s.alpha = i[3]), s;
      }
    } else if (r && t.startsWith("#") || typeof t == "number")
      return this.fromRGB(WB(t));
    if (r && B_[t]) {
      const n = B_[t];
      return this.fromRGB(n[0] * 255 >> 0, n[1] * 255 >> 0, n[2] * 255 >> 0);
    } else if (typeof t == "object" && t !== null)
      return this.fromRGB(t);
    return this.fromRGB(0, 0, 0);
  }
  static fromRGB(t, r, n) {
    return t !== null && typeof t == "object" ? new at(t.r, t.g, t.b) : new at(t, r, n);
  }
  static fromRGBA(t, r, n, i) {
    return t !== null && typeof t == "object" ? new at(t.r, t.g, t.b, r) : new at(t, r, n, i);
  }
  static fromHSL(t, r, n) {
    const { r: i, g: s, b: o } = F_(t, r, n);
    return new at(i, s, o);
  }
  static fromHSV(t, r, n) {
    const { r: i, g: s, b: o } = kB(t, r, n);
    return new at(i, s, o);
  }
  _r = 0;
  _g = 0;
  _b = 0;
  _a = 1;
  // 构造函数，支持RGB、HSL和HSV初始化
  constructor(t = 0, r = 0, n = 0, i = 1) {
    this._r = t, this._g = r, this._b = n, this._a = i;
  }
  copy(t) {
    return this._r = t.r, this._g = t.g, this._b = t.b, this.alpha = t.alpha, this;
  }
  clone() {
    return at.fromRGB(0, 0, 0).copy(this);
  }
  setRGB(t, r, n) {
    return this._r = t, this._g = r, this._b = n, this;
  }
  normalize() {
    return this.r = ui(this._r / 255, 0, 1), this.g = ui(this._g / 255, 0, 1), this.b = ui(this._b / 255, 0, 1), this;
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
  mix(t, r, n = 0.5) {
    const { r: i, g: s, b: o } = qB(t, r, n);
    return new at(i, s, o);
  }
  setRBG(t, r, n) {
    return this.r = t, this.g = r, this.b = n, this;
  }
  setRGBColor(t) {
    return this.r = t.r, this.g = t.g, this.b = t.b, this;
  }
  // 变亮
  brighten(t) {
    const { h: r, s: n, l: i } = VB(this.r, this.g, this.b);
    return this.setRGBColor(F_(r, n, i * (1 + t)));
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
  clamp(t = 0, r = 1) {
    return this.r = ui(this.r, t, r), this.g = ui(this.g, t, r), this.b = ui(this.b, t, r), this;
  }
  toCssRGB() {
    return `rgb(${Math.round(this.r)},${Math.round(this.g)},${Math.round(this.b)})`;
  }
}
const vf = 3, GB = {
  grad: 360 / 400,
  turn: 360,
  rad: 360 / (Math.PI * 2)
}, Fr = (e) => typeof e == "string" ? e.length > 0 : typeof e == "number", Ae = (e, t = 0, r = Math.pow(10, t)) => Math.round(r * e) / r + 0, Mt = (e, t = 0, r = 1) => e > r ? r : e > t ? e : t, sO = (e) => (e = isFinite(e) ? e % 360 : 0, e > 0 ? e : e + 360), HB = (e, t = "deg") => Number(e) * (GB[t] || 1), oO = (e) => ({
  r: Mt(e.r, 0, 255),
  g: Mt(e.g, 0, 255),
  b: Mt(e.b, 0, 255),
  a: Mt(e.a)
}), Ap = (e) => ({
  r: Ae(e.r),
  g: Ae(e.g),
  b: Ae(e.b),
  a: Ae(e.a, vf)
}), KB = ({ r: e, g: t, b: r, a: n = 1 }) => !Fr(e) || !Fr(t) || !Fr(r) ? null : oO({
  r: Number(e),
  g: Number(t),
  b: Number(r),
  a: Number(n)
}), YB = /^#([0-9a-f]{3,8})$/i, XB = (e) => {
  const t = YB.exec(e);
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
}, pa = (e) => {
  const t = e.toString(16);
  return t.length < 2 ? "0" + t : t;
}, JB = (e) => {
  const { r: t, g: r, b: n, a: i } = Ap(e), s = i < 1 ? pa(Ae(i * 255)) : "";
  return "#" + pa(t) + pa(r) + pa(n) + s;
}, ZB = (e) => ({
  h: sO(e.h),
  s: Mt(e.s, 0, 100),
  v: Mt(e.v, 0, 100),
  a: Mt(e.a)
}), QB = (e) => ({
  h: Ae(e.h),
  s: Ae(e.s),
  v: Ae(e.v),
  a: Ae(e.a, vf)
}), ez = ({ h: e, s: t, v: r, a: n = 1 }) => {
  if (!Fr(e) || !Fr(t) || !Fr(r)) return null;
  const i = ZB({
    h: Number(e),
    s: Number(t),
    v: Number(r),
    a: Number(n)
  });
  return uO(i);
}, aO = ({ r: e, g: t, b: r, a: n }) => {
  const i = Math.max(e, t, r), s = i - Math.min(e, t, r), o = s ? i === e ? (t - r) / s : i === t ? 2 + (r - e) / s : 4 + (e - t) / s : 0;
  return {
    h: 60 * (o < 0 ? o + 6 : o),
    s: i ? s / i * 100 : 0,
    v: i / 255 * 100,
    a: n
  };
}, uO = ({ h: e, s: t, v: r, a: n }) => {
  e = e / 360 * 6, t = t / 100, r = r / 100;
  const i = Math.floor(e), s = r * (1 - t), o = r * (1 - (e - i) * t), a = r * (1 - (1 - e + i) * t), u = i % 6;
  return {
    r: [r, o, s, s, a, r][u] * 255,
    g: [a, r, r, o, s, s][u] * 255,
    b: [s, s, a, r, r, o][u] * 255,
    a: n
  };
}, fO = (e) => ({
  h: sO(e.h),
  s: Mt(e.s, 0, 100),
  l: Mt(e.l, 0, 100),
  a: Mt(e.a)
}), cO = (e) => ({
  h: Ae(e.h),
  s: Ae(e.s),
  l: Ae(e.l),
  a: Ae(e.a, vf)
}), tz = ({ h: e, s: t, l: r, a: n = 1 }) => {
  if (!Fr(e) || !Fr(t) || !Fr(r)) return null;
  const i = fO({
    h: Number(e),
    s: Number(t),
    l: Number(r),
    a: Number(n)
  });
  return lO(i);
}, rz = ({ h: e, s: t, l: r, a: n }) => (t *= (r < 50 ? r : 100 - r) / 100, {
  h: e,
  s: t > 0 ? 2 * t / (r + t) * 100 : 0,
  v: r + t,
  a: n
}), nz = ({ h: e, s: t, v: r, a: n }) => {
  const i = (200 - t) * r / 100;
  return {
    h: e,
    s: i > 0 && i < 200 ? t * r / 100 / (i <= 100 ? i : 200 - i) * 100 : 0,
    l: i / 2,
    a: n
  };
}, lO = (e) => uO(rz(e)), so = (e) => nz(aO(e)), iz = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, sz = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, oz = (e) => {
  const t = iz.exec(e) || sz.exec(e);
  if (!t) return null;
  const r = fO({
    h: HB(t[1], t[2]),
    s: Number(t[3]),
    l: Number(t[4]),
    a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1)
  });
  return lO(r);
}, az = (e) => {
  const { h: t, s: r, l: n, a: i } = cO(so(e));
  return i < 1 ? `hsla(${t}, ${r}%, ${n}%, ${i})` : `hsl(${t}, ${r}%, ${n}%)`;
}, uz = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, fz = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, cz = (e) => {
  const t = uz.exec(e) || fz.exec(e);
  return !t || t[2] !== t[4] || t[4] !== t[6] ? null : oO({
    r: Number(t[1]) / (t[2] ? 100 / 255 : 1),
    g: Number(t[3]) / (t[4] ? 100 / 255 : 1),
    b: Number(t[5]) / (t[6] ? 100 / 255 : 1),
    a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1)
  });
}, lz = (e) => {
  const { r: t, g: r, b: n, a: i } = Ap(e);
  return i < 1 ? `rgba(${t}, ${r}, ${n}, ${i})` : `rgb(${t}, ${r}, ${n})`;
}, Kc = {
  string: [
    [XB, "hex"],
    [cz, "rgb"],
    [oz, "hsl"]
  ],
  object: [
    [KB, "rgb"],
    [tz, "hsl"],
    [ez, "hsv"]
  ]
}, z_ = (e, t) => {
  for (let r = 0; r < t.length; r++) {
    const n = t[r][0](e);
    if (n) return [n, t[r][1]];
  }
  return [null, void 0];
}, hO = (e) => typeof e == "string" ? z_(e.trim(), Kc.string) : typeof e == "object" && e !== null ? z_(e, Kc.object) : [null, void 0], hz = (e) => hO(e)[1], pz = (e, t) => ({
  r: e.r,
  g: e.g,
  b: e.b,
  a: t
}), Gf = (e, t) => {
  const r = so(e);
  return {
    h: r.h,
    s: Mt(r.s + t * 100, 0, 100),
    l: r.l,
    a: r.a
  };
}, Hf = (e) => (e.r * 299 + e.g * 587 + e.b * 114) / 1e3 / 255, U_ = (e, t) => {
  const r = so(e);
  return {
    h: r.h,
    s: r.s,
    l: Mt(r.l + t * 100, 0, 100),
    a: r.a
  };
}, dz = (e) => ({
  r: 255 - e.r,
  g: 255 - e.g,
  b: 255 - e.b,
  a: e.a
});
class tu {
  parsed;
  rgba;
  constructor(t) {
    this.parsed = hO(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
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
    return Ae(Hf(this.rgba), 2);
  }
  /**
   * Same as calling `brightness() < 0.5`.
   */
  isDark() {
    return Hf(this.rgba) < 0.5;
  }
  /**
   * Same as calling `brightness() >= 0.5`.
   * */
  isLight() {
    return Hf(this.rgba) >= 0.5;
  }
  /**
   * Returns the hexadecimal representation of a color.
   * When the alpha channel value of the color is less than 1,
   * it outputs #rrggbbaa format instead of #rrggbb.
   */
  toHex() {
    return JB(this.rgba);
  }
  /**
   * Converts a color to RGB color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toRgb() {
    return Ap(this.rgba);
  }
  /**
   * Converts a color to RGB color space and returns a string representation.
   * Outputs an alpha value only if it is less than 1.
   */
  toRgbString() {
    return lz(this.rgba);
  }
  /**
   * Converts a color to HSL color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toHsl() {
    return cO(so(this.rgba));
  }
  /**
   * Converts a color to HSL color space and returns a string representation.
   * Always includes an alpha value from 0 to 1.
   */
  toHslString() {
    return az(this.rgba);
  }
  /**
   * Converts a color to HSV color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toHsv() {
    return QB(aO(this.rgba));
  }
  /**
   * Creates a new instance containing an inverted (opposite) version of the color.
   */
  invert() {
    return ir(dz(this.rgba));
  }
  /**
   * Increases the HSL saturation of a color by the given amount.
   */
  saturate(t = 0.1) {
    return ir(Gf(this.rgba, t));
  }
  /**
   * Decreases the HSL saturation of a color by the given amount.
   */
  desaturate(t = 0.1) {
    return ir(Gf(this.rgba, -t));
  }
  /**
   * Makes a gray color with the same lightness as a source color.
   */
  grayscale() {
    return ir(Gf(this.rgba, -1));
  }
  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  lighten(t = 0.1) {
    return ir(U_(this.rgba, t));
  }
  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  darken(t = 0.1) {
    return ir(U_(this.rgba, -t));
  }
  /**
   * Changes the HSL hue of a color by the given amount.
   */
  rotate(t = 15) {
    return this.hue(this.hue() + t);
  }
  alpha(t) {
    return typeof t == "number" ? ir(pz(this.rgba, t)) : Ae(this.rgba.a, vf);
  }
  hue(t) {
    const r = so(this.rgba);
    return typeof t == "number" ? ir({ h: t, s: r.s, l: r.l, a: r.a }) : Ae(r.h);
  }
  /**
   * Determines whether two values are the same color.
   */
  isEqual(t) {
    return this.toHex() === ir(t).toHex();
  }
}
const ir = (e) => e instanceof tu ? e : new tu(e), V_ = [], _z = (e) => {
  e.forEach((t) => {
    V_.indexOf(t) < 0 && (t(tu, Kc), V_.push(t));
  });
}, vz = () => new tu({
  r: Math.random() * 255,
  g: Math.random() * 255,
  b: Math.random() * 255
}), o5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  colord: ir,
  extend: _z,
  getFormat: hz,
  random: vz
}, Symbol.toStringTag, { value: "Module" }));
var gz = /* @__PURE__ */ ((e) => (e.create = "create", e.add = "add", e.modify = "modify", e.event = "event", e))(gz || {});
class a5 {
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
    Array.isArray(t) && t.forEach((n) => {
      this.initPreset(n);
    });
    const r = this.extraPresets;
    for (; r.length; )
      this.initPreset(r.shift());
  }
  resolvePlugins(t) {
    Array.isArray(t) && t.forEach((n) => {
      this.initPlugin(n);
    });
    const r = this.extraPlugins;
    for (; r.length; )
      this.initPlugin(r.shift());
  }
  getApplyMethods(t) {
    const r = this.methods.get(t) ?? [];
    return (...n) => r.length === 1 ? r[0](...n) : r.reduceRight((i, s) => (...o) => s(i(...o)))(...n);
  }
  applyMethods(t, ...r) {
    const n = this.methods.get(t) ?? [];
    return n.length === 1 ? n[0](...r) : n.reduceRight((i, s) => (...o) => s(i(...o)))(...r);
  }
  initPluginContext(t) {
    const r = {
      pluginName: t.name,
      registerMethod: this.registerMethod.bind(this),
      register: this.register.bind(this)
    };
    return new Proxy(r, {
      get: (n, i, s) => this.methods.has(i) ? this.getApplyMethods(i) : Reflect.get(n, i, s)
    });
  }
  initPreset(t) {
    this.registerPlugin(t);
    const r = this.initPluginContext(t), { plugins: n, presets: i } = t.apply(r, t.config);
    i && this.extraPresets.push(...i), n && this.extraPlugins.push(...n);
  }
  initPlugin(t) {
    this.registerPlugin(t);
    const r = this.initPluginContext(t);
    t.apply(r, t.config);
  }
  registerPlugin(t) {
    if (this.plugins.has(t.name))
      throw `${t.name}:已存在`;
    this.plugins.set(t.name, t);
  }
  register(t) {
    const r = this.hooks.get(t.name) ?? [];
    r.push(t), this.hooks.set(t.name, r);
  }
  registerMethod(t, r) {
    const n = this.methods.get(t) ?? [];
    n.push(r || ((i) => {
      this.register({ name: t, fn: i });
    })), this.methods.set(t, n);
  }
  async applyPlugins(t) {
    const r = typeof t == "string" ? { name: t, type: void 0 } : t;
    let { name: n, type: i } = r;
    i || (n.startsWith("modify") && (i = "modify"), n.startsWith("add") && (i = "add"), n.startsWith("on") && (i = "event"), n.startsWith("create") && (i = "create"));
    const s = (this.hooks.get(n) ?? []).slice();
    switch (s.sort((o, a) => {
      let u = o.order ?? 0, f = a.order ?? 0;
      return u - f;
    }), i) {
      case "create": {
        let o = r.initalValue;
        for (let a of s) {
          let u = await Promise.resolve().then(() => a.fn(r.args));
          if (u != null)
            return u;
        }
        return o;
      }
      case "add": {
        let o = r.initalValue ?? [];
        for (let a of s) {
          let u = await Promise.resolve().then(() => a.fn(r.args));
          u != null && o.push(u);
        }
        return o;
      }
      case "modify": {
        let o = r.initalValue ?? {};
        for (let a of s) {
          let u = await Promise.resolve().then(() => a.fn(o, r.args));
          u != null && (o = u);
        }
        return o;
      }
      case "event": {
        if (r.sync)
          for (let o of s)
            o.fn(r.args);
        else {
          let o = Promise.resolve();
          for (let a of s)
            o = o.then(() => {
              a.fn(r.args);
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
function oo(e, t, r, n, i) {
  if (e === t)
    return e ? [[he, e]] : [];
  if (r != null) {
    var s = xz(e, t, r);
    if (s)
      return s;
  }
  var o = Op(e, t), a = e.substring(0, o);
  e = e.substring(o), t = t.substring(o), o = gf(e, t);
  var u = e.substring(e.length - o);
  e = e.substring(0, e.length - o), t = t.substring(0, t.length - o);
  var f = yz(e, t);
  return a && f.unshift([he, a]), u && f.push([he, u]), Ep(f, i), n && wz(f), f;
}
function yz(e, t) {
  var r;
  if (!e)
    return [[ze, t]];
  if (!t)
    return [[ht, e]];
  var n = e.length > t.length ? e : t, i = e.length > t.length ? t : e, s = n.indexOf(i);
  if (s !== -1)
    return r = [
      [ze, n.substring(0, s)],
      [he, i],
      [ze, n.substring(s + i.length)]
    ], e.length > t.length && (r[0][0] = r[2][0] = ht), r;
  if (i.length === 1)
    return [
      [ht, e],
      [ze, t]
    ];
  var o = mz(e, t);
  if (o) {
    var a = o[0], u = o[1], f = o[2], c = o[3], l = o[4], h = oo(a, f), d = oo(u, c);
    return h.concat([[he, l]], d);
  }
  return bz(e, t);
}
function bz(e, t) {
  for (var r = e.length, n = t.length, i = Math.ceil((r + n) / 2), s = i, o = 2 * i, a = new Array(o), u = new Array(o), f = 0; f < o; f++)
    a[f] = -1, u[f] = -1;
  a[s + 1] = 0, u[s + 1] = 0;
  for (var c = r - n, l = c % 2 !== 0, h = 0, d = 0, _ = 0, v = 0, g = 0; g < i; g++) {
    for (var y = -g + h; y <= g - d; y += 2) {
      var b = s + y, w;
      y === -g || y !== g && a[b - 1] < a[b + 1] ? w = a[b + 1] : w = a[b - 1] + 1;
      for (var m = w - y; w < r && m < n && e.charAt(w) === t.charAt(m); )
        w++, m++;
      if (a[b] = w, w > r)
        d += 2;
      else if (m > n)
        h += 2;
      else if (l) {
        var A = s + c - y;
        if (A >= 0 && A < o && u[A] !== -1) {
          var S = r - u[A];
          if (w >= S)
            return k_(e, t, w, m);
        }
      }
    }
    for (var T = -g + _; T <= g - v; T += 2) {
      var A = s + T, S;
      T === -g || T !== g && u[A - 1] < u[A + 1] ? S = u[A + 1] : S = u[A - 1] + 1;
      for (var F = S - T; S < r && F < n && e.charAt(r - S - 1) === t.charAt(n - F - 1); )
        S++, F++;
      if (u[A] = S, S > r)
        v += 2;
      else if (F > n)
        _ += 2;
      else if (!l) {
        var b = s + c - T;
        if (b >= 0 && b < o && a[b] !== -1) {
          var w = a[b], m = s + w - b;
          if (S = r - S, w >= S)
            return k_(e, t, w, m);
        }
      }
    }
  }
  return [
    [ht, e],
    [ze, t]
  ];
}
function k_(e, t, r, n) {
  var i = e.substring(0, r), s = t.substring(0, n), o = e.substring(r), a = t.substring(n), u = oo(i, s), f = oo(o, a);
  return u.concat(f);
}
function Op(e, t) {
  if (!e || !t || e.charAt(0) !== t.charAt(0))
    return 0;
  for (var r = 0, n = Math.min(e.length, t.length), i = n, s = 0; r < i; )
    e.substring(s, i) == t.substring(s, i) ? (r = i, s = r) : n = i, i = Math.floor((n - r) / 2 + r);
  return pO(e.charCodeAt(i - 1)) && i--, i;
}
function W_(e, t) {
  var r = e.length, n = t.length;
  if (r == 0 || n == 0)
    return 0;
  r > n ? e = e.substring(r - n) : r < n && (t = t.substring(0, r));
  var i = Math.min(r, n);
  if (e == t)
    return i;
  for (var s = 0, o = 1; ; ) {
    var a = e.substring(i - o), u = t.indexOf(a);
    if (u == -1)
      return s;
    o += u, (u == 0 || e.substring(i - o) == t.substring(0, o)) && (s = o, o++);
  }
}
function gf(e, t) {
  if (!e || !t || e.slice(-1) !== t.slice(-1))
    return 0;
  for (var r = 0, n = Math.min(e.length, t.length), i = n, s = 0; r < i; )
    e.substring(e.length - i, e.length - s) == t.substring(t.length - i, t.length - s) ? (r = i, s = r) : n = i, i = Math.floor((n - r) / 2 + r);
  return dO(e.charCodeAt(e.length - i)) && i--, i;
}
function mz(e, t) {
  var r = e.length > t.length ? e : t, n = e.length > t.length ? t : e;
  if (r.length < 4 || n.length * 2 < r.length)
    return null;
  function i(d, _, v) {
    for (var g = d.substring(v, v + Math.floor(d.length / 4)), y = -1, b = "", w, m, A, S; (y = _.indexOf(g, y + 1)) !== -1; ) {
      var T = Op(
        d.substring(v),
        _.substring(y)
      ), F = gf(
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
    r,
    n,
    Math.ceil(r.length / 4)
  ), o = i(
    r,
    n,
    Math.ceil(r.length / 2)
  ), a;
  if (!s && !o)
    return null;
  o ? s ? a = s[4].length > o[4].length ? s : o : a = o : a = s;
  var u, f, c, l;
  e.length > t.length ? (u = a[0], f = a[1], c = a[2], l = a[3]) : (c = a[0], l = a[1], u = a[2], f = a[3]);
  var h = a[4];
  return [u, f, c, l, h];
}
function wz(e) {
  for (var t = !1, r = [], n = 0, i = null, s = 0, o = 0, a = 0, u = 0, f = 0; s < e.length; )
    e[s][0] == he ? (r[n++] = s, o = u, a = f, u = 0, f = 0, i = e[s][1]) : (e[s][0] == ze ? u += e[s][1].length : f += e[s][1].length, i && i.length <= Math.max(o, a) && i.length <= Math.max(u, f) && (e.splice(r[n - 1], 0, [
      ht,
      i
    ]), e[r[n - 1] + 1][0] = ze, n--, n--, s = n > 0 ? r[n - 1] : -1, o = 0, a = 0, u = 0, f = 0, i = null, t = !0)), s++;
  for (t && Ep(e), Ez(e), s = 1; s < e.length; ) {
    if (e[s - 1][0] == ht && e[s][0] == ze) {
      var c = e[s - 1][1], l = e[s][1], h = W_(c, l), d = W_(l, c);
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
var q_ = /[^a-zA-Z0-9]/, G_ = /\s/, H_ = /[\r\n]/, Az = /\n\r?\n$/, Oz = /^\r?\n\r?\n/;
function Ez(e) {
  function t(d, _) {
    if (!d || !_)
      return 6;
    var v = d.charAt(d.length - 1), g = _.charAt(0), y = v.match(q_), b = g.match(q_), w = y && v.match(G_), m = b && g.match(G_), A = w && v.match(H_), S = m && g.match(H_), T = A && d.match(Az), F = S && _.match(Oz);
    return T || F ? 5 : A || S ? 4 : y && !w && m ? 3 : w || m ? 2 : y || b ? 1 : 0;
  }
  for (var r = 1; r < e.length - 1; ) {
    if (e[r - 1][0] == he && e[r + 1][0] == he) {
      var n = e[r - 1][1], i = e[r][1], s = e[r + 1][1], o = gf(n, i);
      if (o) {
        var a = i.substring(i.length - o);
        n = n.substring(0, n.length - o), i = a + i.substring(0, i.length - o), s = a + s;
      }
      for (var u = n, f = i, c = s, l = t(n, i) + t(i, s); i.charAt(0) === s.charAt(0); ) {
        n += i.charAt(0), i = i.substring(1) + s.charAt(0), s = s.substring(1);
        var h = t(n, i) + t(i, s);
        h >= l && (l = h, u = n, f = i, c = s);
      }
      e[r - 1][1] != u && (u ? e[r - 1][1] = u : (e.splice(r - 1, 1), r--), e[r][1] = f, c ? e[r + 1][1] = c : (e.splice(r + 1, 1), r--));
    }
    r++;
  }
}
function Ep(e, t) {
  e.push([he, ""]);
  for (var r = 0, n = 0, i = 0, s = "", o = "", a; r < e.length; ) {
    if (r < e.length - 1 && !e[r][1]) {
      e.splice(r, 1);
      continue;
    }
    switch (e[r][0]) {
      case ze:
        i++, o += e[r][1], r++;
        break;
      case ht:
        n++, s += e[r][1], r++;
        break;
      case he:
        var u = r - i - n - 1;
        if (t) {
          if (u >= 0 && vO(e[u][1])) {
            var f = e[u][1].slice(-1);
            if (e[u][1] = e[u][1].slice(
              0,
              -1
            ), s = f + s, o = f + o, !e[u][1]) {
              e.splice(u, 1), r--;
              var c = u - 1;
              e[c] && e[c][0] === ze && (i++, o = e[c][1] + o, c--), e[c] && e[c][0] === ht && (n++, s = e[c][1] + s, c--), u = c;
            }
          }
          if (_O(e[r][1])) {
            var f = e[r][1].charAt(0);
            e[r][1] = e[r][1].slice(1), s += f, o += f;
          }
        }
        if (r < e.length - 1 && !e[r][1]) {
          e.splice(r, 1);
          break;
        }
        if (s.length > 0 || o.length > 0) {
          s.length > 0 && o.length > 0 && (a = Op(o, s), a !== 0 && (u >= 0 ? e[u][1] += o.substring(
            0,
            a
          ) : (e.splice(0, 0, [
            he,
            o.substring(0, a)
          ]), r++), o = o.substring(a), s = s.substring(a)), a = gf(o, s), a !== 0 && (e[r][1] = o.substring(o.length - a) + e[r][1], o = o.substring(
            0,
            o.length - a
          ), s = s.substring(
            0,
            s.length - a
          )));
          var l = i + n;
          s.length === 0 && o.length === 0 ? (e.splice(r - l, l), r = r - l) : s.length === 0 ? (e.splice(r - l, l, [ze, o]), r = r - l + 1) : o.length === 0 ? (e.splice(r - l, l, [ht, s]), r = r - l + 1) : (e.splice(
            r - l,
            l,
            [ht, s],
            [ze, o]
          ), r = r - l + 2);
        }
        r !== 0 && e[r - 1][0] === he ? (e[r - 1][1] += e[r][1], e.splice(r, 1)) : r++, i = 0, n = 0, s = "", o = "";
        break;
    }
  }
  e[e.length - 1][1] === "" && e.pop();
  var h = !1;
  for (r = 1; r < e.length - 1; )
    e[r - 1][0] === he && e[r + 1][0] === he && (e[r][1].substring(
      e[r][1].length - e[r - 1][1].length
    ) === e[r - 1][1] ? (e[r][1] = e[r - 1][1] + e[r][1].substring(
      0,
      e[r][1].length - e[r - 1][1].length
    ), e[r + 1][1] = e[r - 1][1] + e[r + 1][1], e.splice(r - 1, 1), h = !0) : e[r][1].substring(0, e[r + 1][1].length) == e[r + 1][1] && (e[r - 1][1] += e[r + 1][1], e[r][1] = e[r][1].substring(e[r + 1][1].length) + e[r + 1][1], e.splice(r + 1, 1), h = !0)), r++;
  h && Ep(e, t);
}
function pO(e) {
  return e >= 55296 && e <= 56319;
}
function dO(e) {
  return e >= 56320 && e <= 57343;
}
function _O(e) {
  return dO(e.charCodeAt(0));
}
function vO(e) {
  return pO(e.charCodeAt(e.length - 1));
}
function Sz(e) {
  for (var t = [], r = 0; r < e.length; r++)
    e[r][1].length > 0 && t.push(e[r]);
  return t;
}
function Kf(e, t, r, n) {
  return vO(e) || _O(n) ? null : Sz([
    [he, e],
    [ht, t],
    [ze, r],
    [he, n]
  ]);
}
function xz(e, t, r) {
  var n = typeof r == "number" ? { index: r, length: 0 } : r.oldRange, i = typeof r == "number" ? null : r.newRange, s = e.length, o = t.length;
  if (n.length === 0 && (i === null || i.length === 0)) {
    var a = n.index, u = e.slice(0, a), f = e.slice(a), c = i ? i.index : null;
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
      return Kf(v, y, b, f);
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
      return Kf(u, y, b, A);
    }
  }
  if (n.length > 0 && i && i.length === 0)
    e: {
      var v = e.slice(0, n.index), A = e.slice(n.index + n.length), _ = v.length, m = A.length;
      if (o < _ + m)
        break e;
      var g = t.slice(0, _), S = t.slice(o - m);
      if (v !== g || A !== S)
        break e;
      var y = e.slice(_, s - m), b = t.slice(_, o - m);
      return Kf(v, y, b, A);
    }
  return null;
}
function Pn(e, t, r, n) {
  return oo(e, t, r, n, !0);
}
Pn.INSERT = ze;
Pn.DELETE = ht;
Pn.EQUAL = he;
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2022 Joachim Wester
 * MIT licensed
 */
const Rz = Object.prototype.hasOwnProperty;
function Tz(e, t) {
  return Rz.call(e, t);
}
function Pz(e) {
  if (Array.isArray(e)) {
    const r = new Array(e.length);
    for (let n = 0; n < r.length; n++)
      r[n] = "" + n;
    return r;
  }
  if (Object.keys)
    return Object.keys(e);
  let t = [];
  for (let r in e)
    Tz(e, r) && t.push(r);
  return t;
}
function Wn(e) {
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
function Yc(e) {
  let t = 0;
  const r = e.length;
  let n;
  for (; t < r; ) {
    if (n = e.charCodeAt(t), n >= 48 && n <= 57) {
      t++;
      continue;
    }
    return !1;
  }
  return !0;
}
function Nz(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
function Xc(e) {
  if (e === void 0)
    return !0;
  if (e) {
    if (Array.isArray(e)) {
      for (let r = 0, n = e.length; r < n; r++)
        if (Xc(e[r]))
          return !0;
    } else if (typeof e == "object") {
      const r = Pz(e), n = r.length;
      for (var t = 0; t < n; t++)
        if (Xc(e[r[t]]))
          return !0;
    }
  }
  return !1;
}
function K_(e, t) {
  const r = [e];
  for (const n in t) {
    const i = typeof t[n] == "object" ? JSON.stringify(t[n], null, 2) : t[n];
    typeof i < "u" && r.push(`${n}: ${i}`);
  }
  return r.join(`
`);
}
class $z extends Error {
  constructor(t, r, n, i, s) {
    super(K_(t, { name: r, index: n, operation: i, tree: s })), this.name = r, this.index = n, this.operation = i, this.tree = s, Object.setPrototypeOf(this, new.target.prototype), this.message = K_(t, { name: r, index: n, operation: i, tree: s });
  }
}
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2013-2021 Joachim Wester
 * MIT license
 */
const ae = $z, Mz = Wn, di = {
  add: function(e, t, r) {
    return e[t] = this.value, { newDocument: r };
  },
  remove: function(e, t, r) {
    var n = e[t];
    return delete e[t], { newDocument: r, removed: n };
  },
  replace: function(e, t, r) {
    var n = e[t];
    return e[t] = this.value, { newDocument: r, removed: n };
  },
  move: function(e, t, r) {
    let n = ru(r, this.path);
    n && (n = Wn(n));
    const i = Nn(
      r,
      { op: "remove", path: this.from }
    ).removed;
    return Nn(r, { op: "add", path: this.path, value: i }), { newDocument: r, removed: n };
  },
  copy: function(e, t, r) {
    const n = ru(r, this.from);
    return Nn(
      r,
      { op: "add", path: this.path, value: Wn(n) }
    ), { newDocument: r };
  },
  test: function(e, t, r) {
    return { newDocument: r, test: ao(e[t], this.value) };
  },
  _get: function(e, t, r) {
    return this.value = e[t], { newDocument: r };
  }
};
var Iz = {
  add: function(e, t, r) {
    return Yc(t) ? e.splice(t, 0, this.value) : e[t] = this.value, { newDocument: r, index: t };
  },
  remove: function(e, t, r) {
    var n = e.splice(t, 1);
    return { newDocument: r, removed: n[0] };
  },
  replace: function(e, t, r) {
    var n = e[t];
    return e[t] = this.value, { newDocument: r, removed: n };
  },
  move: di.move,
  copy: di.copy,
  test: di.test,
  _get: di._get
};
function ru(e, t) {
  if (t == "")
    return e;
  var r = { op: "_get", path: t };
  return Nn(e, r), r.value;
}
function Nn(e, t, r = !1, n = !0, i = !0, s = 0) {
  if (r && (typeof r == "function" ? r(t, 0, e, t.path) : nu(t, 0)), t.path === "") {
    let o = { newDocument: e };
    if (t.op === "add")
      return o.newDocument = t.value, o;
    if (t.op === "replace")
      return o.newDocument = t.value, o.removed = e, o;
    if (t.op === "move" || t.op === "copy")
      return o.newDocument = ru(e, t.from), t.op === "move" && (o.removed = e), o;
    if (t.op === "test") {
      if (o.test = ao(e, t.value), o.test === !1)
        throw new ae("Test operation failed", "TEST_OPERATION_FAILED", s, t, e);
      return o.newDocument = e, o;
    } else {
      if (t.op === "remove")
        return o.removed = e, o.newDocument = null, o;
      if (t.op === "_get")
        return t.value = e, o;
      if (r)
        throw new ae("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", s, t, e);
      return o;
    }
  } else {
    n || (e = Wn(e));
    const a = (t.path || "").split("/");
    let u = e, f = 1, c = a.length, l, h, d;
    for (typeof r == "function" ? d = r : d = nu; ; ) {
      if (h = a[f], h && h.indexOf("~") != -1 && (h = Nz(h)), i && (h == "__proto__" || h == "prototype" && f > 0 && a[f - 1] == "constructor"))
        throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");
      if (r && l === void 0 && (u[h] === void 0 ? l = a.slice(0, f).join("/") : f == c - 1 && (l = t.path), l !== void 0 && d(t, 0, e, l)), f++, Array.isArray(u)) {
        if (h === "-")
          h = u.length;
        else {
          if (r && !Yc(h))
            throw new ae("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", s, t, e);
          Yc(h) && (h = ~~h);
        }
        if (f >= c) {
          if (r && t.op === "add" && h > u.length)
            throw new ae("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", s, t, e);
          const _ = Iz[t.op].call(t, u, h, e);
          if (_.test === !1)
            throw new ae("Test operation failed", "TEST_OPERATION_FAILED", s, t, e);
          return _;
        }
      } else if (f >= c) {
        const _ = di[t.op].call(t, u, h, e);
        if (_.test === !1)
          throw new ae("Test operation failed", "TEST_OPERATION_FAILED", s, t, e);
        return _;
      }
      if (u = u[h], r && f < c && (!u || typeof u != "object"))
        throw new ae("Cannot perform operation at the desired path", "OPERATION_PATH_UNRESOLVABLE", s, t, e);
    }
  }
}
function gO(e, t, r, n = !0, i = !0) {
  if (r && !Array.isArray(t))
    throw new ae("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
  n || (e = Wn(e));
  const s = new Array(t.length);
  for (let o = 0, a = t.length; o < a; o++)
    s[o] = Nn(e, t[o], r, !0, i, o), e = s[o].newDocument;
  return s.newDocument = e, s;
}
function Dz(e, t, r) {
  const n = Nn(e, t);
  if (n.test === !1)
    throw new ae("Test operation failed", "TEST_OPERATION_FAILED", r, t, e);
  return n.newDocument;
}
function nu(e, t, r, n) {
  if (typeof e != "object" || e === null || Array.isArray(e))
    throw new ae("Operation is not an object", "OPERATION_NOT_AN_OBJECT", t, e, r);
  if (di[e.op]) {
    if (typeof e.path != "string")
      throw new ae("Operation `path` property is not a string", "OPERATION_PATH_INVALID", t, e, r);
    if (e.path.indexOf("/") !== 0 && e.path.length > 0)
      throw new ae('Operation `path` property must start with "/"', "OPERATION_PATH_INVALID", t, e, r);
    if ((e.op === "move" || e.op === "copy") && typeof e.from != "string")
      throw new ae("Operation `from` property is not present (applicable in `move` and `copy` operations)", "OPERATION_FROM_REQUIRED", t, e, r);
    if ((e.op === "add" || e.op === "replace" || e.op === "test") && e.value === void 0)
      throw new ae("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_REQUIRED", t, e, r);
    if ((e.op === "add" || e.op === "replace" || e.op === "test") && Xc(e.value))
      throw new ae("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED", t, e, r);
    if (r) {
      if (e.op == "add") {
        var i = e.path.split("/").length, s = n.split("/").length;
        if (i !== s + 1 && i !== s)
          throw new ae("Cannot perform an `add` operation at the desired path", "OPERATION_PATH_CANNOT_ADD", t, e, r);
      } else if (e.op === "replace" || e.op === "remove" || e.op === "_get") {
        if (e.path !== n)
          throw new ae("Cannot perform the operation at a path that does not exist", "OPERATION_PATH_UNRESOLVABLE", t, e, r);
      } else if (e.op === "move" || e.op === "copy") {
        var o = { op: "_get", path: e.from, value: void 0 }, a = yO([o], r);
        if (a && a.name === "OPERATION_PATH_UNRESOLVABLE")
          throw new ae("Cannot perform the operation from a path that does not exist", "OPERATION_FROM_UNRESOLVABLE", t, e, r);
      }
    }
  } else throw new ae("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", t, e, r);
}
function yO(e, t, r) {
  try {
    if (!Array.isArray(e))
      throw new ae("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
    if (t)
      gO(Wn(t), Wn(e), r || !0);
    else {
      r = r || nu;
      for (var n = 0; n < e.length; n++)
        r(e[n], n, t, void 0);
    }
  } catch (i) {
    if (i instanceof ae)
      return i;
    throw i;
  }
}
function ao(e, t) {
  if (e === t) return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    var r = Array.isArray(e), n = Array.isArray(t), i, s, o;
    if (r && n) {
      if (s = e.length, s != t.length) return !1;
      for (i = s; i-- !== 0; )
        if (!ao(e[i], t[i])) return !1;
      return !0;
    }
    if (r != n) return !1;
    var a = Object.keys(e);
    if (s = a.length, s !== Object.keys(t).length)
      return !1;
    for (i = s; i-- !== 0; )
      if (!t.hasOwnProperty(a[i])) return !1;
    for (i = s; i-- !== 0; )
      if (o = a[i], !ao(e[o], t[o])) return !1;
    return !0;
  }
  return e !== e && t !== t;
}
const u5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JsonPatchError: ae,
  _areEquals: ao,
  applyOperation: Nn,
  applyPatch: gO,
  applyReducer: Dz,
  deepClone: Mz,
  getValueByPointer: ru,
  validate: yO,
  validator: nu
}, Symbol.toStringTag, { value: "Module" }));
var Jc;
((e) => {
  function t(s = {}, o = {}, a = !1) {
    typeof s != "object" && (s = {}), typeof o != "object" && (o = {});
    let u = wu(o);
    a || (u = Object.keys(u).reduce((f, c) => (u[c] != null && (f[c] = u[c]), f), {}));
    for (const f in s)
      s[f] !== void 0 && o[f] === void 0 && (u[f] = s[f]);
    return Object.keys(u).length > 0 ? u : void 0;
  }
  e.compose = t;
  function r(s = {}, o = {}) {
    typeof s != "object" && (s = {}), typeof o != "object" && (o = {});
    const a = Object.keys(s).concat(Object.keys(o)).reduce((u, f) => (yi(s[f], o[f]) || (u[f] = o[f] === void 0 ? null : o[f]), u), {});
    return Object.keys(a).length > 0 ? a : void 0;
  }
  e.diff = r;
  function n(s = {}, o = {}) {
    s = s || {};
    const a = Object.keys(o).reduce((u, f) => (o[f] !== s[f] && s[f] !== void 0 && (u[f] = o[f]), u), {});
    return Object.keys(s).reduce((u, f) => (s[f] !== o[f] && o[f] === void 0 && (u[f] = null), u), a);
  }
  e.invert = n;
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
})(Jc || (Jc = {}));
const xn = Jc;
var Zc;
((e) => {
  function t(r) {
    return typeof r.delete == "number" ? r.delete : typeof r.retain == "number" ? r.retain : typeof r.retain == "object" && r.retain !== null ? 1 : typeof r.insert == "string" ? r.insert.length : 1;
  }
  e.length = t;
})(Zc || (Zc = {}));
const Gt = Zc;
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
    const r = this.ops[this.index];
    if (r) {
      const n = this.offset, i = Gt.length(r);
      if (t >= i - n ? (t = i - n, this.index += 1, this.offset = 0) : this.offset += t, typeof r.delete == "number")
        return { delete: t };
      {
        const s = {};
        return r.attributes && (s.attributes = r.attributes), typeof r.retain == "number" ? s.retain = t : typeof r.retain == "object" && r.retain !== null ? s.retain = r.retain : typeof r.insert == "string" ? s.insert = r.insert.substr(n, t) : s.insert = r.insert, s;
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
        const t = this.offset, r = this.index, n = this.next(), i = this.ops.slice(this.index);
        return this.offset = t, this.index = r, [n].concat(i);
      }
    } else return [];
  }
}
const Cz = "\0", Y_ = (e, t) => {
  if (typeof e != "object" || e === null)
    throw new Error(`cannot retain a ${typeof e}`);
  if (typeof t != "object" || t === null)
    throw new Error(`cannot retain a ${typeof t}`);
  const r = Object.keys(e)[0];
  if (!r || r !== Object.keys(t)[0])
    throw new Error(
      `embed types not matched: ${r} != ${Object.keys(t)[0]}`
    );
  return [r, e[r], t[r]];
};
class Ne {
  static Op = Gt;
  static OpIterator = Rt;
  static AttributeMap = xn;
  static handlers = {};
  static registerEmbed(t, r) {
    this.handlers[t] = r;
  }
  static unregisterEmbed(t) {
    delete this.handlers[t];
  }
  static getHandler(t) {
    const r = this.handlers[t];
    if (!r)
      throw new Error(`no handlers for embed type "${t}"`);
    return r;
  }
  ops;
  constructor(t) {
    Array.isArray(t) ? this.ops = t : t != null && Array.isArray(t.ops) ? this.ops = t.ops : this.ops = [];
  }
  insert(t, r) {
    const n = {};
    return typeof t == "string" && t.length === 0 ? this : (n.insert = t, r != null && typeof r == "object" && Object.keys(r).length > 0 && (n.attributes = r), this.push(n));
  }
  delete(t) {
    return t <= 0 ? this : this.push({ delete: t });
  }
  retain(t, r) {
    if (typeof t == "number" && t <= 0)
      return this;
    const n = { retain: t };
    return r != null && typeof r == "object" && Object.keys(r).length > 0 && (n.attributes = r), this.push(n);
  }
  push(t) {
    let r = this.ops.length, n = this.ops[r - 1];
    if (t = wu(t), typeof n == "object") {
      if (typeof t.delete == "number" && typeof n.delete == "number")
        return this.ops[r - 1] = { delete: n.delete + t.delete }, this;
      if (typeof n.delete == "number" && t.insert != null && (r -= 1, n = this.ops[r - 1], typeof n != "object"))
        return this.ops.unshift(t), this;
      if (yi(t.attributes, n.attributes)) {
        if (typeof t.insert == "string" && typeof n.insert == "string")
          return this.ops[r - 1] = { insert: n.insert + t.insert }, typeof t.attributes == "object" && (this.ops[r - 1].attributes = t.attributes), this;
        if (typeof t.retain == "number" && typeof n.retain == "number")
          return this.ops[r - 1] = { retain: n.retain + t.retain }, typeof t.attributes == "object" && (this.ops[r - 1].attributes = t.attributes), this;
      }
    }
    return r === this.ops.length ? this.ops.push(t) : this.ops.splice(r, 0, t), this;
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
    const r = [], n = [];
    return this.forEach((i) => {
      (t(i) ? r : n).push(i);
    }), [r, n];
  }
  reduce(t, r) {
    return this.ops.reduce(t, r);
  }
  changeLength() {
    return this.reduce((t, r) => r.insert ? t + Gt.length(r) : r.delete ? t - r.delete : t, 0);
  }
  length() {
    return this.reduce((t, r) => t + Gt.length(r), 0);
  }
  slice(t = 0, r = 1 / 0) {
    const n = [], i = new Rt(this.ops);
    let s = 0;
    for (; s < r && i.hasNext(); ) {
      let o;
      s < t ? o = i.next(t - s) : (o = i.next(r - s), n.push(o)), s += Gt.length(o);
    }
    return new Ne(n);
  }
  compose(t) {
    const r = new Rt(this.ops), n = new Rt(t.ops), i = [], s = n.peek();
    if (s != null && typeof s.retain == "number" && s.attributes == null) {
      let a = s.retain;
      for (; r.peekType() === "insert" && r.peekLength() <= a; )
        a -= r.peekLength(), i.push(r.next());
      s.retain - a > 0 && n.next(s.retain - a);
    }
    const o = new Ne(i);
    for (; r.hasNext() || n.hasNext(); )
      if (n.peekType() === "insert")
        o.push(n.next());
      else if (r.peekType() === "delete")
        o.push(r.next());
      else {
        const a = Math.min(r.peekLength(), n.peekLength()), u = r.next(a), f = n.next(a);
        if (f.retain) {
          const c = {};
          if (typeof u.retain == "number")
            c.retain = typeof f.retain == "number" ? a : f.retain;
          else if (typeof f.retain == "number")
            u.retain == null ? c.insert = u.insert : c.retain = u.retain;
          else {
            const h = u.retain == null ? "insert" : "retain", [d, _, v] = Y_(
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
          const l = xn.compose(
            u.attributes,
            f.attributes,
            typeof u.retain == "number"
          );
          if (l && (c.attributes = l), o.push(c), !n.hasNext() && yi(o.ops[o.ops.length - 1], c)) {
            const h = new Ne(r.rest());
            return o.concat(h).chop();
          }
        } else typeof f.delete == "number" && (typeof u.retain == "number" || typeof u.retain == "object" && u.retain !== null) && o.push(f);
      }
    return o.chop();
  }
  concat(t) {
    const r = new Ne(this.ops.slice());
    return t.ops.length > 0 && (r.push(t.ops[0]), r.ops = r.ops.concat(t.ops.slice(1))), r;
  }
  diff(t, r) {
    if (this.ops === t.ops)
      return new Ne();
    const n = [this, t].map((u) => u.map((f) => {
      if (f.insert != null)
        return typeof f.insert == "string" ? f.insert : Cz;
      const c = u === t ? "on" : "with";
      throw new Error("diff() called " + c + " non-document");
    }).join("")), i = new Ne(), s = Pn(n[0], n[1], r, !0), o = new Rt(this.ops), a = new Rt(t.ops);
    return s.forEach((u) => {
      let f = u[1].length;
      for (; f > 0; ) {
        let c = 0;
        switch (u[0]) {
          case Pn.INSERT:
            c = Math.min(a.peekLength(), f), i.push(a.next(c));
            break;
          case Pn.DELETE:
            c = Math.min(f, o.peekLength()), o.next(c), i.delete(c);
            break;
          case Pn.EQUAL:
            c = Math.min(
              o.peekLength(),
              a.peekLength(),
              f
            );
            const l = o.next(c), h = a.next(c);
            yi(l.insert, h.insert) ? i.retain(
              c,
              xn.diff(l.attributes, h.attributes)
            ) : i.push(h).delete(c);
            break;
        }
        f -= c;
      }
    }), i.chop();
  }
  eachLine(t, r = `
`) {
    const n = new Rt(this.ops);
    let i = new Ne(), s = 0;
    for (; n.hasNext(); ) {
      if (n.peekType() !== "insert")
        return;
      const o = n.peek(), a = Gt.length(o) - n.peekLength(), u = typeof o.insert == "string" ? o.insert.indexOf(r, a) - a : -1;
      if (u < 0)
        i.push(n.next());
      else if (u > 0)
        i.push(n.next(u));
      else {
        if (t(i, n.next(1).attributes || {}, s) === !1)
          return;
        s += 1, i = new Ne();
      }
    }
    i.length() > 0 && t(i, {}, s);
  }
  invert(t) {
    const r = new Ne();
    return this.reduce((n, i) => {
      if (i.insert)
        r.delete(Gt.length(i));
      else {
        if (typeof i.retain == "number" && i.attributes == null)
          return r.retain(i.retain), n + i.retain;
        if (i.delete || typeof i.retain == "number") {
          const s = i.delete || i.retain;
          return t.slice(n, n + s).forEach((a) => {
            i.delete ? r.push(a) : i.retain && i.attributes && r.retain(
              Gt.length(a),
              xn.invert(i.attributes, a.attributes)
            );
          }), n + s;
        } else if (typeof i.retain == "object" && i.retain !== null) {
          const s = t.slice(n, n + 1), o = new Rt(s.ops).next(), [a, u, f] = Y_(
            i.retain,
            o.insert
          ), c = Ne.getHandler(a);
          return r.retain(
            { [a]: c.invert(u, f) },
            xn.invert(i.attributes, o.attributes)
          ), n + 1;
        }
      }
      return n;
    }, 0), r.chop();
  }
  transform(t, r = !1) {
    if (r = !!r, typeof t == "number")
      return this.transformPosition(t, r);
    const n = t, i = new Rt(this.ops), s = new Rt(n.ops), o = new Ne();
    for (; i.hasNext() || s.hasNext(); )
      if (i.peekType() === "insert" && (r || s.peekType() !== "insert"))
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
                  r
                )
              });
            }
          }
          o.retain(
            h,
            xn.transform(
              u.attributes,
              f.attributes,
              r
            )
          );
        }
      }
    return o.chop();
  }
  transformPosition(t, r = !1) {
    r = !!r;
    const n = new Rt(this.ops);
    let i = 0;
    for (; n.hasNext() && i <= t; ) {
      const s = n.peekLength(), o = n.peekType();
      if (n.next(), o === "delete") {
        t -= Math.min(s, t - i);
        continue;
      } else o === "insert" && (i < t || !r) && (t += s);
      i += s;
    }
    return t;
  }
}
const f5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AttributeMap: xn,
  Delta: Ne,
  Op: Gt,
  OpIterator: Rt,
  default: Ne
}, Symbol.toStringTag, { value: "Module" })), Yf = {};
class c5 {
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
  perform(t, r, n, i, s, o, a, u) {
    if (this.isInTransaction)
      return;
    let f, c;
    try {
      this._isInTransaction = !0, f = !0, this.initializeAll(0), c = t.call(r, n, i, s, o, a, u), f = !1;
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
    for (var r = this.transactionWrappers, n = t; n < r.length; n++) {
      var i = r[n];
      try {
        this.wrapperInitData[n] = Yf, this.wrapperInitData[n] = i.initialize ? i.initialize.call(this) : null;
      } finally {
        if (this.wrapperInitData[n] === Yf)
          try {
            this.initializeAll(n + 1);
          } catch {
          }
      }
    }
  }
  closeAll(t) {
    for (var r = this.transactionWrappers, n = t; n < r.length; n++) {
      var i = r[n], s = this.wrapperInitData[n], o;
      try {
        o = !0, s !== Yf && i.close && i.close.call(this, s), o = !1;
      } finally {
        if (o)
          try {
            this.closeAll(n + 1);
          } catch {
          }
      }
    }
    this.wrapperInitData.length = 0;
  }
}
const Qc = [];
let ms = -1;
const l5 = (e) => ({
  current: e
}), h5 = (e, t) => {
  Qc[++ms] = e.current, e.current = t;
}, p5 = (e) => {
  ms < 0 || (e.current = Qc[ms], Qc[ms] = null, ms--);
};
class Lz {
  available = [];
  inUse = /* @__PURE__ */ new Set();
  maxSize;
  create;
  reset;
  validate;
  totalCreated = 0;
  constructor(t) {
    this.maxSize = t.maxSize || 100, this.create = t.create, this.reset = t.reset, this.validate = t.validate;
    const r = t.preAllocate || 0;
    for (let n = 0; n < r && this.available.length < this.maxSize; n++) {
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
    t.forEach((r) => this.release(r));
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
class jz {
  constructor(t, r) {
    this.pool = t, this.obj = r;
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
class d5 extends Lz {
  /**
   * 获取对象并返回自动释放包装器
   */
  autoAcquire() {
    const t = this.acquire();
    return new jz(this, t);
  }
}
const Fz = (e) => {
  Tn && Tn.add(e);
};
let Tn = null;
class _5 {
  static add = Fz;
  static mixin(t, r = {}) {
    const n = t.prototype.dispose;
    t.prototype.__isDisposed = !1, t.prototype.isDisposed = function() {
      return !!this.__isDisposed;
    }, t.prototype.dispose = function() {
      this.__isDisposed || (this.__isDisposed = !0, r.dispose?.(), n?.call(t));
    }, t.prototype.disposeLater = function() {
      Tn && Tn.add(this);
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
    let r = Tn;
    try {
      return Tn = this, t();
    } finally {
      this.dispose(), Tn = r;
    }
  }
}
export {
  xp as AT_TARGET,
  d5 as AutoPool,
  AO as BUBBLING_PHASE,
  wO as CAPTURING_PHASE,
  Wz as Callbacks,
  at as Color,
  _5 as DisposableManager,
  el as Emitter4Event,
  Bz as Event,
  Te as EventEmitter,
  Uz as EventEmitter4,
  iu as EventPhase,
  Oi as EventPropagation,
  Oi as EventTarget,
  gz as HookType,
  Xz as Immutable,
  J_ as NONE,
  nO as Options,
  a5 as PluginService,
  Lz as Pool,
  qz as PriorityQueue,
  f5 as QuillDelta,
  kz as Signals,
  c5 as Transaction,
  Fz as addDisposable,
  Kz as antvUtil,
  o5 as colord,
  r5 as compose,
  l5 as createCursor,
  io as deepmerge,
  Hc as fastDeepEqual,
  Pn as fastDiff,
  u5 as fastJsonPatch,
  WB as hexToRgb,
  i5 as hslToHsv,
  F_ as hslToRgb,
  s5 as hsvToHsl,
  kB as hsvToRgb,
  Yz as immer,
  qB as lerpColor,
  Hz as lodash,
  zz as mitt,
  e5 as mobx,
  Vz as observable,
  p5 as pop,
  h5 as push,
  Gz as radash,
  Jz as reactivity,
  Qz as redux,
  VB as rgbToHsl,
  n5 as rgbToHsv,
  Zz as signals,
  t5 as tapable
};
