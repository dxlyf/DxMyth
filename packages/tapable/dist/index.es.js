const H = () => {
  console.warn("Hook.context is deprecated and will be removed");
};
class u {
  interceptors;
  taps;
  name;
  constructor(t) {
    this.name = t, this.taps = [], this.interceptors = [];
  }
  _tap(t, e, s) {
    if (typeof e == "string")
      e = {
        name: e.trim()
      };
    else if (typeof e != "object" || e === null)
      throw new Error("Invalid tap options");
    if (typeof e.name != "string" || e.name === "")
      throw new Error("Missing name for tap");
    typeof e.context < "u" && H(), e = Object.assign({ type: t, fn: s }, e), e = this._runRegisterInterceptors(e), this._insert(e);
  }
  tap(t, e) {
    this._tap("sync", t, e);
  }
  tapAsync(t, e) {
    this._tap("async", t, e);
  }
  tapPromise(t, e) {
    this._tap("promise", t, e);
  }
  _runRegisterInterceptors(t) {
    for (const e of this.interceptors)
      if (e.register) {
        const s = e.register(t);
        s !== void 0 && (t = s);
      }
    return t;
  }
  withOptions(t) {
    const e = (s) => Object.assign({}, t, typeof s == "string" ? { name: s } : s);
    return {
      name: this.name,
      tap: (s, o) => this.tap(e(s), o),
      tapAsync: (s, o) => this.tapAsync(e(s), o),
      tapPromise: (s, o) => this.tapPromise(e(s), o),
      intercept: (s) => this.intercept(s),
      isUsed: () => this.isUsed(),
      withOptions: (s) => this.withOptions(e(s))
    };
  }
  isUsed() {
    return this.taps.length > 0 || this.interceptors.length > 0;
  }
  intercept(t) {
    if (this.interceptors.push(Object.assign({}, t)), t.register)
      for (let e = 0; e < this.taps.length; e++) {
        let s = t.register(this.taps[e]);
        s && (this.taps[e] = s);
      }
  }
  callIntercept(t, e = [], s) {
    if (!(this.interceptors.length <= 0))
      for (const o of this.interceptors)
        o[t] && typeof o[t] == "function" && (o.context && s ? o[t](s, ...e) : o[t](...e));
  }
  needContext() {
    return this.taps.some((t) => t.context !== void 0);
  }
  _insert(t) {
    let e;
    typeof t.before == "string" ? e = /* @__PURE__ */ new Set([t.before]) : Array.isArray(t.before) && (e = new Set(t.before));
    let s = 0;
    typeof t.stage == "number" && (s = t.stage);
    let o = this.taps.length;
    for (; o > 0; ) {
      o--;
      const r = this.taps[o];
      this.taps[o + 1] = r;
      const m = r.stage || 0;
      if (e) {
        if (e.has(r.name)) {
          e.delete(r.name);
          continue;
        }
        if (e.size > 0)
          continue;
      }
      if (!(m > s)) {
        o++;
        break;
      }
    }
    this.taps[o] = t;
  }
  callTapsSeries(t, e, s) {
    const o = this.needContext(), r = o ? {} : void 0;
    this.callIntercept("call", e, o ? r : void 0);
    const m = this.taps, k = m.length;
    let d = 0;
    const x = (a) => a ? (this.callIntercept("error", e, r || void 0), s(a), !0) : !1, P = (a) => d >= k || (t === "Bail" || t === "Loop") && a !== void 0 ? (t == "Waterfall" && (a = e[0]), a !== void 0 ? this.callIntercept("result", [a], r || void 0) : this.callIntercept("done"), s(null, t == "Normal" ? void 0 : a), !0) : !1, n = (a, f) => {
      if (x(a))
        return;
      if (t == "Loop" && f !== void 0) {
        d = 0, n(null);
        return;
      }
      if (t === "Waterfall" && f !== void 0 && (e[0] = f), P(f))
        return;
      const c = m[d];
      d === 0 && t == "Loop" && this.callIntercept("loop", e, o ? r : void 0), this.callIntercept("tap", [c], r || void 0), d++;
      try {
        switch (c.type) {
          case "sync":
            c.context ? f = c.fn(r, ...e) : f = c.fn(...e);
            break;
          case "async":
            c.context ? c.fn(r, ...e, n) : c.fn(...e, n);
            return;
          case "promise":
            let p;
            c.context ? p = c.fn(r, ...e) : p = c.fn(...e), p && typeof p.then == "function" && typeof p.catch == "function" ? p.then((S) => {
              n(null, S);
            }).catch((S) => {
              n(S);
            }) : n(`Tap function (tapPromise) did not return promise (returned ' + _promise${d} + ')');
`);
            return;
        }
      } catch (p) {
        n(p);
        return;
      }
      n(null, f);
    };
    n(null);
  }
  callTapsLooping(t, e) {
    this.callTapsSeries("Loop", t, (s, o) => {
      if (s) {
        e(s);
        return;
      }
      e();
    });
  }
  callTapsParallel(t, e, s, o) {
    if (this.taps.length <= 1) {
      this.callTapsSeries(t, s, o);
      return;
    }
    let r = this.taps.length, m = this.taps, k = 0, d = r, x = new Array(r);
    const P = this.needContext(), n = P ? {} : void 0;
    this.callIntercept("call", s, P ? n : void 0);
    let a = !1;
    const f = (i) => {
      a || (this.callIntercept("error", s, n || void 0), o(i), a = !0);
    }, c = (i) => {
      a || (t == "Waterfall" && (i = s[0]), i !== void 0 ? this.callIntercept("result", [i], n || void 0) : this.callIntercept("done"), o(null, t == "Normal" ? void 0 : i), a = !0);
    }, p = (i) => (l, w) => {
      if (!a) {
        if (x[i] = { err: l, result: w }, d--, l) {
          f(l);
          return;
        }
        if (t == "Bail" && w !== void 0) {
          c(w);
          return;
        }
        if (d <= 0) {
          c(w);
          return;
        }
      }
    }, S = (i) => {
      let l = m[i], w;
      this.callIntercept("tap", [l], n || void 0);
      try {
        switch (l.type) {
          case "sync":
            l.context ? w = l.fn(n, ...s) : w = l.fn(...s), p(i)(null, w);
            break;
          case "async":
            l.context ? l.fn(n, ...s, p(i + 1)) : l.fn(...s, p(i));
            return;
          case "promise":
            let y;
            l.context ? y = l.fn(n, ...s) : y = l.fn(...s), y && typeof y.then == "function" && typeof y.catch == "function" ? y.then((A) => {
              p(i)(null, A);
            }).catch((A) => {
              f(A);
            }) : f(`Tap function (tapPromise) did not return promise (returned ' + _promise${k} + ')');
`);
            return;
        }
      } catch (y) {
        f(y);
        return;
      }
      p(i)(null, w);
    };
    (() => {
      let i = 0;
      for (; i < e && r > 0; )
        S(k + i), i++, r--;
      k += i;
    })();
  }
}
class E extends u {
  constructor(t) {
    super(t);
  }
  call(...t) {
    this.callTapsSeries("Normal", t, (e) => {
      if (e)
        throw e;
    });
  }
  callAsync(...t) {
    let e = t.pop();
    this.callTapsSeries("Normal", t, e);
  }
  promise(...t) {
    return new Promise((e, s) => {
      this.callTapsSeries("Normal", t, (o, r) => {
        if (o) {
          s(o);
          return;
        }
        e(r);
      });
    });
  }
  tapAsync() {
    throw new Error("tapAsync is not supported on a SyncHook");
  }
  tapPromise() {
    throw new Error("tapPromise is not supported on a SyncHook");
  }
}
class _ extends u {
  constructor(t) {
    super(t);
  }
  call(...t) {
    let e;
    return this.callTapsSeries("Bail", t, (s, o) => {
      if (s) throw s;
      e = o;
    }), e;
  }
  callAsync(...t) {
    let e = t.pop();
    this.callTapsSeries("Bail", t, e);
  }
  promise(...t) {
    return new Promise((e, s) => {
      this.callTapsSeries("Bail", t, (o, r) => {
        if (o) {
          s(o);
          return;
        }
        e(r);
      });
    });
  }
  tapAsync() {
    throw new Error("tapAsync is not supported on a SyncHook");
  }
  tapPromise() {
    throw new Error("tapPromise is not supported on a SyncHook");
  }
}
class I extends u {
  constructor(t) {
    super(t);
  }
  call(...t) {
    let e;
    return this.callTapsSeries("Waterfall", t, (s, o) => {
      if (s) throw s;
      e = o;
    }), e;
  }
  callAsync(...t) {
    let e = t.pop();
    this.callTapsSeries("Waterfall", t, e);
  }
  promise(...t) {
    return new Promise((e, s) => {
      this.callTapsSeries("Waterfall", t, (o, r) => {
        if (o) {
          s(o);
          return;
        }
        e(r);
      });
    });
  }
  tapAsync() {
    throw new Error("tapAsync is not supported on a SyncHook");
  }
  tapPromise() {
    throw new Error("tapPromise is not supported on a SyncHook");
  }
}
class g extends u {
  constructor(t) {
    super(t);
  }
  call(...t) {
    let e;
    return this.callTapsLooping(t, (s, o) => {
      if (s) throw s;
      e = o;
    }), e;
  }
  callAsync(...t) {
    let e = t.pop();
    this.callTapsLooping(t, e);
  }
  promise(...t) {
    return new Promise((e, s) => {
      this.callTapsLooping(t, (o, r) => {
        if (o) {
          s(o);
          return;
        }
        e(r);
      });
    });
  }
  tapAsync() {
    throw new Error("tapAsync is not supported on a SyncHook");
  }
  tapPromise() {
    throw new Error("tapPromise is not supported on a SyncHook");
  }
}
class B extends u {
  maxParallel = 10;
  constructor(t) {
    super(t);
  }
  call(...t) {
    throw new Error("call is not supported on a AsyncSeriesBailHook");
  }
  callAsync(...t) {
    let e = t.pop();
    this.callTapsParallel("Normal", this.maxParallel, t, e);
  }
  promise(...t) {
    return new Promise((e, s) => {
      this.callTapsParallel("Normal", this.maxParallel, t, (o, r) => {
        if (o) {
          s(o);
          return;
        }
        e(r);
      });
    });
  }
}
class L extends u {
  maxParallel = 10;
  constructor(t) {
    super(t);
  }
  call(...t) {
    throw new Error("call is not supported on a AsyncSeriesBailHook");
  }
  callAsync(...t) {
    let e = t.pop();
    this.callTapsParallel("Bail", this.maxParallel, t, e);
  }
  promise(...t) {
    return new Promise((e, s) => {
      this.callTapsParallel("Bail", this.maxParallel, t, (o, r) => {
        if (o) {
          s(o);
          return;
        }
        e(r);
      });
    });
  }
}
class C extends u {
  constructor(t) {
    super(t);
  }
  call(...t) {
    throw new Error("call is not supported on a AsyncSeriesHook");
  }
  callAsync(...t) {
    let e = t.pop();
    this.callTapsSeries("Normal", t, e);
  }
  promise(...t) {
    return new Promise((e, s) => {
      this.callTapsSeries("Normal", t, (o, r) => {
        if (o) {
          s(o);
          return;
        }
        e(r);
      });
    });
  }
}
class O extends u {
  constructor(t) {
    super(t);
  }
  call(...t) {
    throw new Error("call is not supported on a AsyncSeriesBailHook");
  }
  callAsync(...t) {
    let e = t.pop();
    this.callTapsSeries("Bail", t, e);
  }
  promise(...t) {
    return new Promise((e, s) => {
      this.callTapsSeries("Bail", t, (o, r) => {
        if (o) {
          s(o);
          return;
        }
        e(r);
      });
    });
  }
  tapAsync() {
    throw new Error("tapAsync is not supported on a SyncHook");
  }
  tapPromise() {
    throw new Error("tapPromise is not supported on a SyncHook");
  }
}
class W extends u {
  constructor(t) {
    super(t);
  }
  call(...t) {
    throw new Error("Method not implemented.");
  }
  callAsync(...t) {
    let e = t.pop();
    this.callTapsLooping(t, e);
  }
  promise(...t) {
    return new Promise((e, s) => {
      this.callTapsLooping(t, (o, r) => {
        if (o) {
          s(o);
          return;
        }
        e(r);
      });
    });
  }
}
class N extends u {
  constructor(t) {
    super(t);
  }
  call(...t) {
    throw new Error("call is not supported on a SyncHook");
  }
  callAsync(...t) {
    let e = t.pop();
    this.callTapsSeries("Waterfall", t, e);
  }
  promise(...t) {
    return new Promise((e, s) => {
      this.callTapsSeries("Waterfall", t, (o, r) => {
        if (o) {
          s(o);
          return;
        }
        e(r);
      });
    });
  }
}
const v = (h, t) => t;
class j {
  _map;
  name;
  _factory;
  _interceptors;
  constructor(t, e) {
    this._map = /* @__PURE__ */ new Map(), this.name = e, this._factory = t, this._interceptors = [];
  }
  get(t) {
    return this._map.get(t);
  }
  for(t) {
    const e = this.get(t);
    if (e !== void 0)
      return e;
    let s = this._factory(t);
    const o = this._interceptors;
    for (let r = 0; r < o.length; r++) {
      let m = o[r];
      m.factory && (s = m.factory(t, s));
    }
    return this._map.set(t, s), s;
  }
  intercept(t) {
    this._interceptors.push(
      Object.assign(
        {
          factory: v
        },
        t
      )
    );
  }
}
class T {
  hooks;
  name;
  constructor(t, e) {
    this.hooks = t, this.name = e;
  }
  tap(t, e) {
    for (const s of this.hooks)
      s.tap(t, e);
  }
  tapAsync(t, e) {
    for (const s of this.hooks)
      s.tapAsync(t, e);
  }
  tapPromise(t, e) {
    for (const s of this.hooks)
      s.tapPromise(t, e);
  }
  isUsed() {
    for (const t of this.hooks)
      if (t.isUsed()) return !0;
    return !1;
  }
  intercept(t) {
    for (const e of this.hooks)
      e.intercept(t);
  }
  withOptions(t) {
    return new T(
      this.hooks.map((e) => e.withOptions(t)),
      this.name
    );
  }
}
export {
  L as AsyncParallelBailHook,
  B as AsyncParallelHook,
  O as AsyncSeriesBailHook,
  C as AsyncSeriesHook,
  W as AsyncSeriesLoopHook,
  N as AsyncSeriesWaterfallHook,
  u as Hook,
  j as HookMap,
  T as MultiHook,
  _ as SyncBailHook,
  E as SyncHook,
  g as SyncLoopHook,
  I as SyncWaterfallHook
};
