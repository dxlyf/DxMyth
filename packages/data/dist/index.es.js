const is = Symbol.for("immer-nothing"), Pn = Symbol.for("immer-draftable"), I = Symbol.for("immer-state"), Uu = process.env.NODE_ENV !== "production" ? [
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
function Z(e, ...t) {
  if (process.env.NODE_ENV !== "production") {
    const n = Uu[e], r = zt(n) ? n.apply(null, t) : n;
    throw new Error(`[Immer] ${r}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var T = /* @__PURE__ */ ((e) => (e[e.Object = 0] = "Object", e[e.Array = 1] = "Array", e[e.Map = 2] = "Map", e[e.Set = 3] = "Set", e))(T || {});
const Ve = Object, un = Ve.getPrototypeOf, wr = "constructor", Br = "prototype", io = "configurable", Ri = "enumerable", Ai = "writable", Er = "value";
let ot = (e) => !!e && !!e[I];
function Be(e) {
  return e ? ku(e) || qr(e) || !!e[Pn] || !!e[wr]?.[Pn] || Ur(e) || kr(e) : !1;
}
const El = Ve[Br][wr].toString(), Wa = /* @__PURE__ */ new WeakMap();
function ku(e) {
  if (!e || !Ln(e)) return !1;
  const t = un(e);
  if (t === null || t === Ve[Br]) return !0;
  const n = Ve.hasOwnProperty.call(t, wr) && t[wr];
  if (n === Object) return !0;
  if (!zt(n)) return !1;
  let r = Wa.get(n);
  return r === void 0 && (r = Function.toString.call(n), Wa.set(n, r)), r === El;
}
function Ol(e) {
  return ot(e) || Z(15, e), e[I].base_;
}
function Qn(e, t, n = !0) {
  cn(e) === T.Object ? (n ? Reflect.ownKeys(e) : Ve.keys(e)).forEach((i) => {
    t(i, e[i], e);
  }) : e.forEach((r, i) => t(i, r, e));
}
function cn(e) {
  const t = e[I];
  return t ? t.type_ : qr(e) ? T.Array : Ur(e) ? T.Map : kr(e) ? T.Set : T.Object;
}
let Vn = (e, t, n = cn(e)) => n === T.Map ? e.has(t) : Ve[Br].hasOwnProperty.call(e, t), Dt = (e, t, n = cn(e)) => (
  // @ts-ignore
  n === T.Map ? e.get(t) : e[t]
), Mi = (e, t, n, r = cn(e)) => {
  r === T.Map ? e.set(t, n) : r === T.Set ? e.add(n) : e[t] = n;
};
function Al(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
let qr = Array.isArray, Ur = (e) => e instanceof Map, kr = (e) => e instanceof Set, Ln = (e) => typeof e == "object", zt = (e) => typeof e == "function", Bs = (e) => typeof e == "boolean";
function Dl(e) {
  const t = +e;
  return Number.isInteger(t) && String(t) === e;
}
let Ku = (e) => Ln(e) ? e?.[I] : null, F = (e) => e.copy_ || e.base_, Il = (e) => {
  const t = Ku(e);
  return t ? t.copy_ ?? t.base_ : e;
}, No = (e) => e.modified_ ? e.copy_ : e.base_;
function so(e, t) {
  if (Ur(e))
    return new Map(e);
  if (kr(e))
    return new Set(e);
  if (qr(e)) return Array[Br].slice.call(e);
  const n = ku(e);
  if (t === !0 || t === "class_only" && !n) {
    const r = Ve.getOwnPropertyDescriptors(e);
    delete r[I];
    let i = Reflect.ownKeys(r);
    for (let s = 0; s < i.length; s++) {
      const o = i[s], a = r[o];
      a[Ai] === !1 && (a[Ai] = !0, a[io] = !0), (a.get || a.set) && (r[o] = {
        [io]: !0,
        [Ai]: !0,
        // could live with !!desc.set as well here...
        [Ri]: a[Ri],
        [Er]: e[o]
      });
    }
    return Ve.create(un(e), r);
  } else {
    const r = un(e);
    if (r !== null && n)
      return { ...e };
    const i = Ve.create(r);
    return Ve.assign(i, e);
  }
}
function ss(e, t = !1) {
  return os(e) || ot(e) || !Be(e) || (cn(e) > 1 && Ve.defineProperties(e, {
    set: hi,
    add: hi,
    clear: hi,
    delete: hi
  }), Ve.freeze(e), t && Qn(
    e,
    (n, r) => {
      ss(r, !0);
    },
    !1
  )), e;
}
function xl() {
  Z(2);
}
const hi = {
  [Er]: xl
};
function os(e) {
  return e === null || !Ln(e) ? !0 : Ve.isFrozen(e);
}
const Or = "MapSet", Ci = "Patches", oo = "ArrayMethods", Pi = {};
function fn(e) {
  const t = Pi[e];
  return t || Z(0, e), t;
}
let Fa = (e) => !!Pi[e];
function $o(e, t) {
  Pi[e] || (Pi[e] = t);
}
let Ar, Vi = () => Ar, Tl = (e, t) => ({
  drafts_: [],
  parent_: e,
  immer_: t,
  // Whenever the modified draft contains a draft from another scope, we
  // need to prevent auto-freezing so the unowned draft can be finalized.
  canAutoFreeze_: !0,
  unfinalizedDrafts_: 0,
  handledSet_: /* @__PURE__ */ new Set(),
  processedForPatches_: /* @__PURE__ */ new Set(),
  mapSetPlugin_: Fa(Or) ? fn(Or) : void 0,
  arrayMethodsPlugin_: Fa(oo) ? fn(oo) : void 0
});
function Ha(e, t) {
  t && (e.patchPlugin_ = fn(Ci), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function ao(e) {
  uo(e), e.drafts_.forEach(Rl), e.drafts_ = null;
}
function uo(e) {
  e === Ar && (Ar = e.parent_);
}
let Ga = (e) => Ar = Tl(Ar, e);
function Rl(e) {
  const t = e[I];
  t.type_ === T.Object || t.type_ === T.Array ? t.revoke_() : t.revoked_ = !0;
}
function Ya(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const n = t.drafts_[0];
  if (e !== void 0 && e !== n) {
    n[I].modified_ && (ao(t), Z(4)), Be(e) && (e = Xa(t, e));
    const { patchPlugin_: i } = t;
    i && i.generateReplacementPatches_(
      n[I].base_,
      e,
      t
    );
  } else
    e = Xa(t, n);
  return Ml(t, e, !0), ao(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== is ? e : void 0;
}
function Xa(e, t) {
  if (os(t)) return t;
  const n = t[I];
  if (!n)
    return Ni(t, e.handledSet_, e);
  if (!as(n, e))
    return t;
  if (!n.modified_)
    return n.base_;
  if (!n.finalized_) {
    const { callbacks_: r } = n;
    if (r)
      for (; r.length > 0; )
        r.pop()(e);
    Hu(n, e);
  }
  return n.copy_;
}
function Ml(e, t, n = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && ss(t, n);
}
function Wu(e) {
  e.finalized_ = !0, e.scope_.unfinalizedDrafts_--;
}
let as = (e, t) => e.scope_ === t;
const Cl = [];
function Fu(e, t, n, r) {
  const i = F(e), s = e.type_;
  if (r !== void 0 && Dt(i, r, s) === t) {
    Mi(i, r, n, s);
    return;
  }
  if (!e.draftLocations_) {
    const a = e.draftLocations_ = /* @__PURE__ */ new Map();
    Qn(i, (u, f) => {
      if (ot(f)) {
        const c = a.get(f) || [];
        c.push(u), a.set(f, c);
      }
    });
  }
  const o = e.draftLocations_.get(t) ?? Cl;
  for (const a of o)
    Mi(i, a, n, s);
}
function Pl(e, t, n) {
  e.callbacks_.push(function(i) {
    const s = t;
    if (!s || !as(s, i))
      return;
    i.mapSetPlugin_?.fixSetContents(s);
    const o = No(s);
    Fu(e, s.draft_ ?? s, o, n), Hu(s, i);
  });
}
function Hu(e, t) {
  if (e.modified_ && !e.finalized_ && (e.type_ === T.Set || e.type_ === T.Array && e.allIndicesReassigned_ || (e.assigned_?.size ?? 0) > 0)) {
    const { patchPlugin_: r } = t;
    if (r) {
      const i = r.getPath(e);
      i && r.generatePatches_(e, i, t);
    }
    Wu(e);
  }
}
function zi(e, t, n) {
  const { scope_: r } = e;
  if (ot(n)) {
    const i = n[I];
    as(i, r) && i.callbacks_.push(function() {
      dr(e);
      const o = No(i);
      Fu(e, n, o, t);
    });
  } else Be(n) && e.callbacks_.push(function() {
    const s = F(e);
    e.type_ === T.Set ? s.has(n) && Ni(n, r.handledSet_, r) : Dt(s, t, e.type_) === n && r.drafts_.length > 1 && (e.assigned_.get(t) ?? !1) === !0 && e.copy_ && Ni(
      Dt(e.copy_, t, e.type_),
      r.handledSet_,
      r
    );
  });
}
function Ni(e, t, n) {
  return !n.immer_.autoFreeze_ && n.unfinalizedDrafts_ < 1 || ot(e) || t.has(e) || !Be(e) || os(e) || (t.add(e), Qn(e, (r, i) => {
    if (ot(i)) {
      const s = i[I];
      if (as(s, n)) {
        const o = No(s);
        Mi(e, r, o, e.type_), Wu(s);
      }
    } else Be(i) && Ni(i, t, n);
  })), e;
}
function Vl(e, t) {
  const n = qr(e), r = {
    type_: n ? T.Array : T.Object,
    // Track which produce call this is associated with.
    scope_: t ? t.scope_ : Vi(),
    // True for both shallow and deep changes.
    modified_: !1,
    // Used during finalization.
    finalized_: !1,
    // Track which properties have been assigned (true) or deleted (false).
    // actually instantiated in `prepareCopy()`
    assigned_: void 0,
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
    isManual_: !1,
    // `callbacks` actually gets assigned in `createProxy`
    callbacks_: void 0
  };
  let i = r, s = $i;
  n && (i = [r], s = Dr);
  const { revoke: o, proxy: a } = Proxy.revocable(i, s);
  return r.draft_ = a, r.revoke_ = o, [a, r];
}
const $i = {
  get(e, t) {
    if (t === I) return e;
    if (t === "constructor" || t === "__proto__") {
      const a = F(e)[t];
      return new Proxy(a || {}, {
        get: (u, f) => f === "__proto__" || f === "prototype" ? Object.freeze(/* @__PURE__ */ Object.create(null)) : Reflect.get(u, f),
        set: () => !0,
        apply: (u, f, c) => Reflect.apply(u, f, c)
      });
    }
    let n = e.scope_.arrayMethodsPlugin_;
    const r = e.type_ === T.Array && typeof t == "string";
    if (r && n?.isArrayOperationMethod(t))
      return n.createMethodInterceptor(e, t);
    const i = F(e);
    if (!Vn(i, t, e.type_))
      return zl(e, i, t);
    const s = i[t];
    if (e.finalized_ || !Be(s) || r && e.operationMethod && n?.isMutatingArrayMethod(
      e.operationMethod
    ) && Dl(t))
      return s;
    if (s === qs(e.base_, t)) {
      dr(e);
      const o = e.type_ === T.Array ? +t : t, a = Ir(e.scope_, s, e, o);
      return e.copy_[o] = a;
    }
    return s;
  },
  has(e, t) {
    return t === "constructor" || t === "__proto__" || t === "prototype" ? !1 : t in F(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(F(e));
  },
  set(e, t, n) {
    if (t === "constructor" || t === "__proto__" || t === "prototype")
      return !0;
    const r = Gu(F(e), t);
    if (r?.set)
      return r.set.call(e.draft_, n), !0;
    if (!e.modified_) {
      const i = qs(F(e), t), s = i?.[I];
      if (s && s.base_ === n)
        return e.copy_[t] = n, e.assigned_.set(t, !1), !0;
      if (Al(n, i) && (n !== void 0 || Vn(e.base_, t, e.type_)))
        return !0;
      dr(e), ct(e);
    }
    return e.copy_[t] === n && // special case: handle new props with value 'undefined'
    (n !== void 0 || Vn(e.copy_, t, e.type_)) || // special case: NaN
    Number.isNaN(n) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = n, e.assigned_.set(t, !0), zi(e, t, n)), !0;
  },
  deleteProperty(e, t) {
    return dr(e), qs(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_.set(t, !1), ct(e)) : e.assigned_.delete(t), e.copy_ && delete e.copy_[t], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(e, t) {
    const n = F(e), r = Reflect.getOwnPropertyDescriptor(n, t);
    return r && {
      [Ai]: !0,
      [io]: e.type_ !== T.Array || t !== "length",
      [Ri]: r[Ri],
      [Er]: n[t]
    };
  },
  defineProperty() {
    Z(11);
  },
  getPrototypeOf(e) {
    return un(e.base_);
  },
  setPrototypeOf() {
    Z(12);
  }
}, Dr = {};
for (let e in $i) {
  let t = $i[e];
  Dr[e] = function() {
    const n = arguments;
    return n[0] = n[0][0], t.apply(this, n);
  };
}
Dr.deleteProperty = function(e, t) {
  return process.env.NODE_ENV !== "production" && isNaN(parseInt(t)) && Z(13), Dr.set.call(this, e, t, void 0);
};
Dr.set = function(e, t, n) {
  return process.env.NODE_ENV !== "production" && t !== "length" && isNaN(parseInt(t)) && Z(14), $i.set.call(this, e[0], t, n, e[0]);
};
function qs(e, t) {
  const n = e[I];
  return (n ? F(n) : e)[t];
}
function zl(e, t, n) {
  const r = Gu(t, n);
  return r ? Er in r ? r[Er] : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    r.get?.call(e.draft_)
  ) : void 0;
}
function Gu(e, t) {
  if (!(t in e)) return;
  let n = un(e);
  for (; n; ) {
    const r = Object.getOwnPropertyDescriptor(n, t);
    if (r) return r;
    n = un(n);
  }
}
function ct(e) {
  e.modified_ || (e.modified_ = !0, e.parent_ && ct(e.parent_));
}
function dr(e) {
  e.copy_ || (e.assigned_ = /* @__PURE__ */ new Map(), e.copy_ = so(
    e.base_,
    e.scope_.immer_.useStrictShallowCopy_
  ));
}
class Yu {
  autoFreeze_ = !0;
  useStrictShallowCopy_ = !1;
  useStrictIteration_ = !1;
  constructor(t) {
    Bs(t?.autoFreeze) && this.setAutoFreeze(t.autoFreeze), Bs(t?.useStrictShallowCopy) && this.setUseStrictShallowCopy(t.useStrictShallowCopy), Bs(t?.useStrictIteration) && this.setUseStrictIteration(t.useStrictIteration);
  }
  /**
   * The `produce` function takes a value and a "recipe function" (whose
   * return value often depends on the base state). The recipe function is
   * free to mutate its first argument however it wants. All mutations are
   * only ever applied to a __copy__ of the base state.
   *
   * Pass only a function to create a "curried producer" which relieves you
   * from passing the recipe function every time.
   *
   * Only plain objects and arrays are made mutable. All other objects are
   * considered uncopyable.
   *
   * Note: This function is __bound__ to its `Immer` instance.
   *
   * @param {any} base - the initial state
   * @param {Function} recipe - function that receives a proxy of the base state as first argument and which can be freely modified
   * @param {Function} patchListener - optional function that will be called with all the patches produced here
   * @returns {any} a new state, or the initial state if nothing was modified
   */
  produce = (t, n, r) => {
    if (zt(t) && !zt(n)) {
      const s = n;
      n = t;
      const o = this;
      return function(u = s, ...f) {
        return o.produce(u, (c) => n.call(this, c, ...f));
      };
    }
    zt(n) || Z(6), r !== void 0 && !zt(r) && Z(7);
    let i;
    if (Be(t)) {
      const s = Ga(this), o = Ir(s, t, void 0);
      let a = !0;
      try {
        i = n(o), a = !1;
      } finally {
        a ? ao(s) : uo(s);
      }
      return Ha(s, r), Ya(i, s);
    } else if (!t || !Ln(t)) {
      if (i = n(t), i === void 0 && (i = t), i === is && (i = void 0), this.autoFreeze_ && ss(i, !0), r) {
        const s = [], o = [];
        fn(Ci).generateReplacementPatches_(t, i, {
          patches_: s,
          inversePatches_: o
        }), r(s, o);
      }
      return i;
    } else Z(1, t);
  };
  produceWithPatches = (t, n) => {
    if (zt(t))
      return (o, ...a) => this.produceWithPatches(o, (u) => t(u, ...a));
    let r, i;
    return [this.produce(t, n, (o, a) => {
      r = o, i = a;
    }), r, i];
  };
  createDraft(t) {
    Be(t) || Z(8), ot(t) && (t = Xu(t));
    const n = Ga(this), r = Ir(n, t, void 0);
    return r[I].isManual_ = !0, uo(n), r;
  }
  finishDraft(t, n) {
    const r = t && t[I];
    (!r || !r.isManual_) && Z(9);
    const { scope_: i } = r;
    return Ha(i, n), Ya(void 0, i);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(t) {
    this.autoFreeze_ = t;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(t) {
    this.useStrictShallowCopy_ = t;
  }
  /**
   * Pass false to use faster iteration that skips non-enumerable properties
   * but still handles symbols for compatibility.
   *
   * By default, strict iteration is enabled (includes all own properties).
   */
  setUseStrictIteration(t) {
    this.useStrictIteration_ = t;
  }
  shouldUseStrictIteration() {
    return this.useStrictIteration_;
  }
  applyPatches(t, n) {
    let r;
    for (r = n.length - 1; r >= 0; r--) {
      const s = n[r];
      if (s.path.length === 0 && s.op === "replace") {
        t = s.value;
        break;
      }
    }
    r > -1 && (n = n.slice(r + 1));
    const i = fn(Ci).applyPatches_;
    return ot(t) ? i(t, n) : this.produce(
      t,
      (s) => i(s, n)
    );
  }
}
function Ir(e, t, n, r) {
  const [i, s] = Ur(t) ? fn(Or).proxyMap_(t, n) : kr(t) ? fn(Or).proxySet_(t, n) : Vl(t, n);
  return (n?.scope_ ?? Vi()).drafts_.push(i), s.callbacks_ = n?.callbacks_ ?? [], s.key_ = r, n && r !== void 0 ? Pl(n, s, r) : s.callbacks_.push(function(u) {
    u.mapSetPlugin_?.fixSetContents(s);
    const { patchPlugin_: f } = u;
    s.modified_ && f && f.generatePatches_(s, [], u);
  }), i;
}
function Xu(e) {
  return ot(e) || Z(10, e), Ju(e);
}
function Ju(e) {
  if (!Be(e) || os(e)) return e;
  const t = e[I];
  let n, r = !0;
  if (t) {
    if (!t.modified_) return t.base_;
    t.finalized_ = !0, n = so(e, t.scope_.immer_.useStrictShallowCopy_), r = t.scope_.immer_.shouldUseStrictIteration();
  } else
    n = so(e, !0);
  return Qn(
    n,
    (i, s) => {
      Mi(n, i, Ju(s));
    },
    r
  ), t && (t.finalized_ = !1), n;
}
function Nl() {
  process.env.NODE_ENV !== "production" && Uu.push(
    'Sets cannot have "replace" patches.',
    function(h) {
      return "Unsupported patch operation: " + h;
    },
    function(h) {
      return "Cannot apply patch, path doesn't resolve: " + h;
    },
    "Patching reserved attributes like __proto__, prototype and constructor is not allowed"
  );
  function t(h, p = []) {
    if (h.key_ !== void 0) {
      const b = h.parent_.copy_ ?? h.parent_.base_, S = Ku(Dt(b, h.key_)), O = Dt(b, h.key_);
      if (O === void 0 || O !== h.draft_ && O !== h.base_ && O !== h.copy_ || S != null && S.base_ !== h.base_)
        return null;
      const D = h.parent_.type_ === T.Set;
      let m;
      if (D) {
        const v = h.parent_;
        m = Array.from(v.drafts_.keys()).indexOf(h.key_);
      } else
        m = h.key_;
      if (!(D && b.size > m || Vn(b, m)))
        return null;
      p.push(m);
    }
    if (h.parent_)
      return t(h.parent_, p);
    p.reverse();
    try {
      n(h.copy_, p);
    } catch {
      return null;
    }
    return p;
  }
  function n(h, p) {
    let b = h;
    for (let S = 0; S < p.length - 1; S++) {
      const O = p[S];
      if (b = Dt(b, O), !Ln(b) || b === null)
        throw new Error(`Cannot resolve path at '${p.join("/")}'`);
    }
    return b;
  }
  const r = "replace", i = "add", s = "remove";
  function o(h, p, b) {
    if (h.scope_.processedForPatches_.has(h))
      return;
    h.scope_.processedForPatches_.add(h);
    const { patches_: S, inversePatches_: O } = b;
    switch (h.type_) {
      case T.Object:
      case T.Map:
        return u(
          h,
          p,
          S,
          O
        );
      case T.Array:
        return a(
          h,
          p,
          S,
          O
        );
      case T.Set:
        return f(
          h,
          p,
          S,
          O
        );
    }
  }
  function a(h, p, b, S) {
    let { base_: O, assigned_: D } = h, m = h.copy_;
    m.length < O.length && ([O, m] = [m, O], [b, S] = [S, b]);
    const v = h.allIndicesReassigned_ === !0;
    for (let w = 0; w < O.length; w++) {
      const A = m[w], C = O[w];
      if ((v || D?.get(w.toString())) && A !== C) {
        const Y = A?.[I];
        if (Y && Y.modified_)
          continue;
        const In = p.concat([w]);
        b.push({
          op: r,
          path: In,
          // Need to maybe clone it, as it can in fact be the original value
          // due to the base/copy inversion at the start of this function
          value: d(A)
        }), S.push({
          op: r,
          path: In,
          value: d(C)
        });
      }
    }
    for (let w = O.length; w < m.length; w++) {
      const A = p.concat([w]);
      b.push({
        op: i,
        path: A,
        // Need to maybe clone it, as it can in fact be the original value
        // due to the base/copy inversion at the start of this function
        value: d(m[w])
      });
    }
    for (let w = m.length - 1; O.length <= w; --w) {
      const A = p.concat([w]);
      S.push({
        op: s,
        path: A
      });
    }
  }
  function u(h, p, b, S) {
    const { base_: O, copy_: D, type_: m } = h;
    Qn(h.assigned_, (v, w) => {
      const A = Dt(O, v, m), C = Dt(D, v, m), j = w ? Vn(O, v) ? r : i : s;
      if (A === C && j === r) return;
      const Y = p.concat(v);
      b.push(
        j === s ? { op: j, path: Y } : { op: j, path: Y, value: d(C) }
      ), S.push(
        j === i ? { op: s, path: Y } : j === s ? { op: i, path: Y, value: d(A) } : { op: r, path: Y, value: d(A) }
      );
    });
  }
  function f(h, p, b, S) {
    let { base_: O, copy_: D } = h, m = 0;
    O.forEach((v) => {
      if (!D.has(v)) {
        const w = p.concat([m]);
        b.push({
          op: s,
          path: w,
          value: v
        }), S.unshift({
          op: i,
          path: w,
          value: v
        });
      }
      m++;
    }), m = 0, D.forEach((v) => {
      if (!O.has(v)) {
        const w = p.concat([m]);
        b.push({
          op: i,
          path: w,
          value: v
        }), S.unshift({
          op: s,
          path: w,
          value: v
        });
      }
      m++;
    });
  }
  function c(h, p, b) {
    const { patches_: S, inversePatches_: O } = b;
    S.push({
      op: r,
      path: [],
      value: p === is ? void 0 : p
    }), O.push({
      op: r,
      path: [],
      value: h
    });
  }
  function l(h, p) {
    return p.forEach((b) => {
      const { path: S, op: O } = b;
      let D = h;
      for (let A = 0; A < S.length - 1; A++) {
        const C = cn(D);
        let j = S[A];
        typeof j != "string" && typeof j != "number" && (j = "" + j), (C === T.Object || C === T.Array) && (j === "__proto__" || j === wr) && Z(19), zt(D) && j === Br && Z(19), D = Dt(D, j), Ln(D) || Z(18, S.join("/"));
      }
      const m = cn(D), v = _(b.value), w = S[S.length - 1];
      switch (O) {
        case r:
          switch (m) {
            case T.Map:
              return D.set(w, v);
            /* istanbul ignore next */
            case T.Set:
              Z(16);
            default:
              return D[w] = v;
          }
        case i:
          switch (m) {
            case T.Array:
              return w === "-" ? D.push(v) : D.splice(w, 0, v);
            case T.Map:
              return D.set(w, v);
            case T.Set:
              return D.add(v);
            default:
              return D[w] = v;
          }
        case s:
          switch (m) {
            case T.Array:
              return D.splice(w, 1);
            case T.Map:
              return D.delete(w);
            case T.Set:
              return D.delete(b.value);
            default:
              return delete D[w];
          }
        default:
          Z(17, O);
      }
    }), h;
  }
  function _(h) {
    if (!Be(h)) return h;
    if (qr(h)) return h.map(_);
    if (Ur(h))
      return new Map(
        Array.from(h.entries()).map(([b, S]) => [b, _(S)])
      );
    if (kr(h)) return new Set(Array.from(h).map(_));
    const p = Object.create(un(h));
    for (const b in h) p[b] = _(h[b]);
    return Vn(h, Pn) && (p[Pn] = h[Pn]), p;
  }
  function d(h) {
    return ot(h) ? _(h) : h;
  }
  $o(Ci, {
    applyPatches_: l,
    generatePatches_: o,
    generateReplacementPatches_: c,
    getPath: t
  });
}
function $l() {
  class e extends Map {
    [I];
    constructor(c, l) {
      super(), this[I] = {
        type_: T.Map,
        parent_: l,
        scope_: l ? l.scope_ : Vi(),
        modified_: !1,
        finalized_: !1,
        copy_: void 0,
        assigned_: void 0,
        base_: c,
        draft_: this,
        isManual_: !1,
        revoked_: !1,
        callbacks_: []
      };
    }
    get size() {
      return F(this[I]).size;
    }
    has(c) {
      return F(this[I]).has(c);
    }
    set(c, l) {
      const _ = this[I];
      return a(_), (!F(_).has(c) || F(_).get(c) !== l) && (r(_), ct(_), _.assigned_.set(c, !0), _.copy_.set(c, l), _.assigned_.set(c, !0), zi(_, c, l)), this;
    }
    delete(c) {
      if (!this.has(c))
        return !1;
      const l = this[I];
      return a(l), r(l), ct(l), l.base_.has(c) ? l.assigned_.set(c, !1) : l.assigned_.delete(c), l.copy_.delete(c), !0;
    }
    clear() {
      const c = this[I];
      a(c), F(c).size && (r(c), ct(c), c.assigned_ = /* @__PURE__ */ new Map(), Qn(c.base_, (l) => {
        c.assigned_.set(l, !1);
      }), c.copy_.clear());
    }
    forEach(c, l) {
      const _ = this[I];
      F(_).forEach((d, h, p) => {
        c.call(l, this.get(h), h, this);
      });
    }
    get(c) {
      const l = this[I];
      a(l);
      const _ = F(l).get(c);
      if (l.finalized_ || !Be(_) || _ !== l.base_.get(c))
        return _;
      const d = Ir(l.scope_, _, l, c);
      return r(l), l.copy_.set(c, d), d;
    }
    keys() {
      return F(this[I]).keys();
    }
    values() {
      const c = this.keys();
      return t({
        next: () => {
          const l = c.next();
          return l.done ? l : {
            done: !1,
            value: this.get(l.value)
          };
        }
      });
    }
    entries() {
      const c = this.keys();
      return t({
        next: () => {
          const l = c.next();
          if (l.done) return l;
          const _ = this.get(l.value);
          return {
            done: !1,
            value: [l.value, _]
          };
        }
      });
    }
    [Symbol.iterator]() {
      return this.entries();
    }
  }
  function t(f) {
    if (typeof Iterator < "u")
      return Iterator.from(f);
    const c = {
      ...f,
      [Symbol.iterator]: () => c
    };
    return c;
  }
  function n(f, c) {
    const l = new e(f, c);
    return [l, l[I]];
  }
  function r(f) {
    f.copy_ || (f.assigned_ = /* @__PURE__ */ new Map(), f.copy_ = new Map(f.base_));
  }
  class i extends Set {
    [I];
    constructor(c, l) {
      super(), this[I] = {
        type_: T.Set,
        parent_: l,
        scope_: l ? l.scope_ : Vi(),
        modified_: !1,
        finalized_: !1,
        copy_: void 0,
        base_: c,
        draft_: this,
        drafts_: /* @__PURE__ */ new Map(),
        revoked_: !1,
        isManual_: !1,
        assigned_: void 0,
        callbacks_: []
      };
    }
    get size() {
      return F(this[I]).size;
    }
    has(c) {
      const l = this[I];
      return a(l), l.copy_ ? !!(l.copy_.has(c) || l.drafts_.has(c) && l.copy_.has(l.drafts_.get(c))) : l.base_.has(c);
    }
    add(c) {
      const l = this[I];
      return a(l), this.has(c) || (o(l), ct(l), l.copy_.add(c), zi(l, c, c)), this;
    }
    delete(c) {
      if (!this.has(c))
        return !1;
      const l = this[I];
      return a(l), o(l), ct(l), l.copy_.delete(c) || (l.drafts_.has(c) ? l.copy_.delete(l.drafts_.get(c)) : (
        /* istanbul ignore next */
        !1
      ));
    }
    clear() {
      const c = this[I];
      a(c), F(c).size && (o(c), ct(c), c.copy_.clear());
    }
    values() {
      const c = this[I];
      return a(c), o(c), c.copy_.values();
    }
    entries() {
      const c = this[I];
      return a(c), o(c), c.copy_.entries();
    }
    keys() {
      return this.values();
    }
    [Symbol.iterator]() {
      return this.values();
    }
    forEach(c, l) {
      const _ = this.values();
      let d = _.next();
      for (; !d.done; )
        c.call(l, d.value, d.value, this), d = _.next();
    }
  }
  function s(f, c) {
    const l = new i(f, c);
    return [l, l[I]];
  }
  function o(f) {
    f.copy_ || (f.copy_ = /* @__PURE__ */ new Set(), f.base_.forEach((c) => {
      if (Be(c)) {
        const l = Ir(f.scope_, c, f, c);
        f.drafts_.set(c, l), f.copy_.add(l);
      } else
        f.copy_.add(c);
    }));
  }
  function a(f) {
    f.revoked_ && Z(3, JSON.stringify(F(f)));
  }
  function u(f) {
    if (f.type_ === T.Set && f.copy_) {
      const c = new Set(f.copy_);
      f.copy_.clear(), c.forEach((l) => {
        f.copy_.add(Il(l));
      });
    }
  }
  $o(Or, { proxyMap_: n, proxySet_: s, fixSetContents: u });
}
function jl() {
  const e = /* @__PURE__ */ new Set(["shift", "unshift"]), t = /* @__PURE__ */ new Set(["push", "pop"]), n = /* @__PURE__ */ new Set([
    ...t,
    ...e
  ]), r = /* @__PURE__ */ new Set(["reverse", "sort"]), i = /* @__PURE__ */ new Set([
    ...n,
    ...r,
    "splice"
  ]), s = /* @__PURE__ */ new Set(["find", "findLast"]), o = /* @__PURE__ */ new Set([
    "filter",
    "slice",
    "concat",
    "flat",
    ...s,
    "findIndex",
    "findLastIndex",
    "some",
    "every",
    "indexOf",
    "lastIndexOf",
    "includes",
    "join",
    "toString",
    "toLocaleString"
  ]);
  function a(m) {
    return i.has(m);
  }
  function u(m) {
    return o.has(m);
  }
  function f(m) {
    return a(m) || u(m);
  }
  function c(m, v) {
    m.operationMethod = v;
  }
  function l(m) {
    m.operationMethod = void 0;
  }
  function _(m, v, w = !0) {
    dr(m);
    const A = v();
    return ct(m), w && m.assigned_.set("length", !0), A;
  }
  function d(m) {
    m.allIndicesReassigned_ = !0;
  }
  function h(m, v) {
    return m < 0 ? Math.max(v + m, 0) : Math.min(m, v);
  }
  function p(m, v, w) {
    for (let A = 0; A < w.length; A++) {
      const C = v + A;
      m.assigned_.set(C, !0), zi(m, C, w[A]);
    }
  }
  function b(m, v, w) {
    return _(m, () => {
      const A = m.copy_.length, C = m.copy_[v](...w);
      return e.has(v) && d(m), v === "push" && w.length > 0 ? p(m, A, w) : v === "unshift" && w.length > 0 && p(m, 0, w), n.has(v) ? C : m.draft_;
    });
  }
  function S(m, v, w) {
    return _(
      m,
      () => (m.copy_[v](...w), d(m), m.draft_),
      !1
    );
  }
  function O(m, v) {
    return function(...A) {
      const C = v;
      c(m, C);
      try {
        if (a(C)) {
          if (n.has(C))
            return b(m, C, A);
          if (r.has(C))
            return S(m, C, A);
          if (C === "splice") {
            const j = _(
              m,
              () => m.copy_.splice(...A)
            );
            if (d(m), A.length > 2) {
              const Y = h(
                A[0] ?? 0,
                m.copy_.length
              );
              p(m, Y, A.slice(2));
            }
            return j;
          }
        } else
          return D(m, C, A);
      } finally {
        l(m);
      }
    };
  }
  function D(m, v, w) {
    const A = F(m);
    if (v === "filter") {
      const C = w[0], j = [];
      for (let Y = 0; Y < A.length; Y++)
        C(A[Y], Y, A) && j.push(m.draft_[Y]);
      return j;
    }
    if (s.has(v)) {
      const C = w[0], j = v === "find", Y = j ? 1 : -1, In = j ? 0 : A.length - 1;
      for (let Et = In; Et >= 0 && Et < A.length; Et += Y)
        if (C(A[Et], Et, A))
          return m.draft_[Et];
      return;
    }
    if (v === "slice") {
      const C = w[0] ?? 0, j = w[1] ?? A.length, Y = h(C, A.length), In = h(j, A.length), Et = [];
      for (let Ls = Y; Ls < In; Ls++)
        Et.push(m.draft_[Ls]);
      return Et;
    }
    return A[v](...w);
  }
  $o(oo, {
    createMethodInterceptor: O,
    isArrayOperationMethod: f,
    isMutatingArrayMethod: a
  });
}
const ye = new Yu(), Ll = ye.produce, Bl = /* @__PURE__ */ ye.produceWithPatches.bind(ye), ql = /* @__PURE__ */ ye.setAutoFreeze.bind(ye), Ul = /* @__PURE__ */ ye.setUseStrictShallowCopy.bind(ye), kl = /* @__PURE__ */ ye.setUseStrictIteration.bind(ye), Kl = /* @__PURE__ */ ye.applyPatches.bind(ye), Wl = /* @__PURE__ */ ye.createDraft.bind(ye), Fl = /* @__PURE__ */ ye.finishDraft.bind(ye);
let Hl = (e) => e, Gl = (e) => e;
const $g = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Immer: Yu,
  applyPatches: Kl,
  castDraft: Hl,
  castImmutable: Gl,
  createDraft: Wl,
  current: Xu,
  enableArrayMethods: jl,
  enableMapSet: $l,
  enablePatches: Nl,
  finishDraft: Fl,
  freeze: ss,
  immerable: Pn,
  isDraft: ot,
  isDraftable: Be,
  nothing: is,
  original: Ol,
  produce: Ll,
  produceWithPatches: Bl,
  setAutoFreeze: ql,
  setUseStrictIteration: kl,
  setUseStrictShallowCopy: Ul
}, Symbol.toStringTag, { value: "Module" })), Yl = {
  0: "Invalid value for configuration 'enforceActions', expected 'never', 'always' or 'observed'",
  1(e, t) {
    return `Cannot apply '${e}' to '${t.toString()}': Field not found.`;
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
  17(e, t) {
    return `[mobx.array] Index out of bounds, ${e} is larger than ${t}`;
  },
  18: "mobx.map requires Map polyfill for the current browser. Check babel-polyfill or core-js/es6/map.js",
  19(e) {
    return "Cannot initialize from classes that inherit from Map: " + e.constructor.name;
  },
  20(e) {
    return "Cannot initialize map from " + e;
  },
  21(e) {
    return `Cannot convert to map from '${e}'`;
  },
  22: "mobx.set requires Set polyfill for the current browser. Check babel-polyfill or core-js/es6/set.js",
  23: "It is not possible to get index atoms from arrays",
  24(e) {
    return "Cannot obtain administration from " + e;
  },
  25(e, t) {
    return `the entry '${e}' does not exist in the observable map '${t}'`;
  },
  26: "please specify a property",
  27(e, t) {
    return `no observable property '${e.toString()}' found on the observable object '${t}'`;
  },
  28(e) {
    return "Cannot obtain atom from " + e;
  },
  29: "Expecting some object",
  30: "invalid action stack. did you forget to finish an action?",
  31: "missing option for computed: get",
  32(e, t) {
    return `Cycle detected in computation ${e}: ${t}`;
  },
  33(e) {
    return `The setter of computed value '${e}' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?`;
  },
  34(e) {
    return `[ComputedValue '${e}'] It is not possible to assign a new value to a computed value.`;
  },
  35: "There are multiple, different versions of MobX active. Make sure MobX is loaded only once or use `configure({ isolateGlobalState: true })`",
  36: "isolateGlobalState should be called before MobX is running any reactions",
  37(e) {
    return `[mobx] \`observableArray.${e}()\` mutates the array in-place, which is not allowed inside a derivation. Use \`array.slice().${e}()\` instead`;
  },
  38: "'ownKeys()' can only be used on observable objects",
  39: "'defineProperty()' can only be used on observable objects"
}, Xl = __DEV__ ? Yl : {};
function y(e, ...t) {
  if (__DEV__) {
    let n = typeof e == "string" ? e : Xl[e];
    throw typeof n == "function" && (n = n.apply(null, t)), new Error(`[MobX] ${n}`);
  }
  throw new Error(
    typeof e == "number" ? `[MobX] minified error nr: ${e}${t.length ? " " + t.map(String).join(",") : ""}. See http://mobx.js.org/errors` : `[MobX] ${e}`
  );
}
const Jl = {};
function us() {
  return typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : Jl;
}
const Zu = Object.assign, ji = Object.getOwnPropertyDescriptor, yt = Object.defineProperty, Kr = Object.prototype, Li = [];
Object.freeze(Li);
const jo = {};
Object.freeze(jo);
const Zl = typeof Proxy < "u", Ql = Object.toString();
function Qu() {
  Zl || y(
    __DEV__ ? "`Proxy` objects are not available in the current environment. Please configure MobX to enable a fallback implementation.`" : "Proxy not available"
  );
}
function ur(e) {
  __DEV__ && g.verifyProxies && y(
    "MobX is currently configured to be able to run in ES5 mode, but in ES5 MobX won't be able to " + e
  );
}
function Ke() {
  return ++g.mobxGuid;
}
function Lo(e) {
  let t = !1;
  return function() {
    if (!t)
      return t = !0, e.apply(this, arguments);
  };
}
const Mn = () => {
};
function W(e) {
  return typeof e == "function";
}
function mt(e) {
  switch (typeof e) {
    case "string":
    case "symbol":
    case "number":
      return !0;
  }
  return !1;
}
function cs(e) {
  return e !== null && typeof e == "object";
}
function Ae(e) {
  if (!cs(e))
    return !1;
  const t = Object.getPrototypeOf(e);
  if (t == null)
    return !0;
  const n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return typeof n == "function" && n.toString() === Ql;
}
function ec(e) {
  const t = e?.constructor;
  return t ? t.name === "GeneratorFunction" || t.displayName === "GeneratorFunction" : !1;
}
function Wr(e, t, n) {
  yt(e, t, {
    enumerable: !1,
    writable: !0,
    configurable: !0,
    value: n
  });
}
function tc(e, t, n) {
  yt(e, t, {
    enumerable: !1,
    writable: !1,
    configurable: !0,
    value: n
  });
}
function Yt(e, t) {
  const n = "isMobX" + e;
  return t.prototype[n] = !0, function(r) {
    return cs(r) && r[n] === !0;
  };
}
function er(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Map]";
}
function eh(e) {
  const t = Object.getPrototypeOf(e), n = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(n) === null;
}
function It(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Set]";
}
const nc = typeof Object.getOwnPropertySymbols < "u";
function th(e) {
  const t = Object.keys(e);
  if (!nc)
    return t;
  const n = Object.getOwnPropertySymbols(e);
  return n.length ? [...t, ...n.filter((r) => Kr.propertyIsEnumerable.call(e, r))] : t;
}
const Bn = typeof Reflect < "u" && Reflect.ownKeys ? Reflect.ownKeys : nc ? (e) => Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e)) : (
  /* istanbul ignore next */
  Object.getOwnPropertyNames
);
function co(e) {
  return typeof e == "string" ? e : typeof e == "symbol" ? e.toString() : new String(e).toString();
}
function rc(e) {
  return e === null ? null : typeof e == "object" ? "" + e : e;
}
function Ne(e, t) {
  return Kr.hasOwnProperty.call(e, t);
}
const nh = Object.getOwnPropertyDescriptors || function(t) {
  const n = {};
  return Bn(t).forEach((r) => {
    n[r] = ji(t, r);
  }), n;
};
function Me(e, t) {
  return !!(e & t);
}
function Ce(e, t, n) {
  return n ? e |= t : e &= ~t, e;
}
const we = Symbol("mobx-stored-annotations");
function et(e) {
  function t(n, r) {
    if (Hr(r))
      return e.decorate_20223_(n, r);
    Fr(n, r, e);
  }
  return Object.assign(t, e);
}
function Fr(e, t, n) {
  if (Ne(e, we) || Wr(e, we, {
    // Inherit annotations
    ...e[we]
  }), __DEV__ && Bi(n) && !Ne(e[we], t)) {
    const r = `${e.constructor.name}.prototype.${t.toString()}`;
    y(
      `'${r}' is decorated with 'override', but no such decorated member was found on prototype.`
    );
  }
  rh(e, n, t), Bi(n) || (e[we][t] = n);
}
function rh(e, t, n) {
  if (__DEV__ && !Bi(t) && Ne(e[we], n)) {
    const r = `${e.constructor.name}.prototype.${n.toString()}`, i = e[we][n].annotationType_, s = t.annotationType_;
    y(
      `Cannot apply '@${s}' to '${r}':
The field is already decorated with '@${i}'.
Re-decorating fields is not allowed.
Use '@override' decorator for methods overridden by subclass.`
    );
  }
}
function ih(e) {
  return Ne(e, we) || Wr(e, we, { ...e[we] }), e[we];
}
function Hr(e) {
  return typeof e == "object" && typeof e.kind == "string";
}
function fs(e, t) {
  __DEV__ && !t.includes(e.kind) && y(
    `The decorator applied to '${String(e.name)}' cannot be used on a ${e.kind} element`
  );
}
const E = Symbol("mobx administration");
class Fe {
  /**
   * Create a new atom. For debugging purposes it is recommended to give it a name.
   * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
   */
  constructor(t = __DEV__ ? "Atom@" + Ke() : "Atom") {
    this.name_ = t;
  }
  static isBeingObservedMask_ = 1;
  static isPendingUnobservationMask_ = 2;
  static diffValueMask_ = 4;
  flags_ = 0;
  observers_ = /* @__PURE__ */ new Set();
  lastAccessedBy_ = 0;
  lowestObserverState_ = J.NOT_TRACKING_;
  // for effective unobserving. BaseAtom has true, for extra optimization, so its onBecomeUnobserved never gets called, because it's not needed
  get isBeingObserved() {
    return Me(this.flags_, Fe.isBeingObservedMask_);
  }
  set isBeingObserved(t) {
    this.flags_ = Ce(this.flags_, Fe.isBeingObservedMask_, t);
  }
  get isPendingUnobservation() {
    return Me(this.flags_, Fe.isPendingUnobservationMask_);
  }
  set isPendingUnobservation(t) {
    this.flags_ = Ce(this.flags_, Fe.isPendingUnobservationMask_, t);
  }
  get diffValue() {
    return Me(this.flags_, Fe.diffValueMask_) ? 1 : 0;
  }
  set diffValue(t) {
    this.flags_ = Ce(this.flags_, Fe.diffValueMask_, t === 1);
  }
  // onBecomeObservedListeners
  onBOL;
  // onBecomeUnobservedListeners
  onBUOL;
  onBO() {
    this.onBOL && this.onBOL.forEach((t) => t());
  }
  onBUO() {
    this.onBUOL && this.onBUOL.forEach((t) => t());
  }
  /**
   * Invoke this method to notify mobx that your atom has been used somehow.
   * Returns true if there is currently a reactive context.
   */
  reportObserved() {
    return Sc(this);
  }
  /**
   * Invoke this method _after_ this method has changed to signal mobx that all its observers should invalidate.
   */
  reportChanged() {
    Ee(), wc(this), Oe();
  }
  toString() {
    return this.name_;
  }
}
const Bo = Yt("Atom", Fe);
function qo(e, t = Mn, n = Mn) {
  const r = new Fe(e);
  return t !== Mn && Mc(r, t), n !== Mn && Go(r, n), r;
}
function sh(e, t) {
  return e === t;
}
function oh(e, t) {
  return ea(e, t);
}
function ah(e, t) {
  return ea(e, t, 1);
}
function uh(e, t) {
  return Object.is ? Object.is(e, t) : e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
const ln = {
  identity: sh,
  structural: oh,
  default: uh,
  shallow: ah
};
function hn(e, t, n) {
  return gn(e) ? e : Array.isArray(e) ? ie.array(e, { name: n }) : Ae(e) ? ie.object(e, void 0, { name: n }) : er(e) ? ie.map(e, { name: n }) : It(e) ? ie.set(e, { name: n }) : typeof e == "function" && !Kt(e) && !Un(e) ? ec(e) ? pn(e) : qn(n, e) : e;
}
function ch(e, t, n) {
  if (e == null || ne(e) || ve(e) || re(e) || te(e))
    return e;
  if (Array.isArray(e))
    return ie.array(e, { name: n, deep: !1 });
  if (Ae(e))
    return ie.object(e, void 0, { name: n, deep: !1 });
  if (er(e))
    return ie.map(e, { name: n, deep: !1 });
  if (It(e))
    return ie.set(e, { name: n, deep: !1 });
  __DEV__ && y(
    "The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets"
  );
}
function ls(e) {
  return e;
}
function fh(e, t) {
  return __DEV__ && gn(e) && y("observable.struct should not be used with observable values"), ea(e, t) ? t : e;
}
const ic = "override", lh = et({
  annotationType_: ic,
  make_: hh,
  extend_: _h,
  decorate_20223_: dh
});
function Bi(e) {
  return e.annotationType_ === ic;
}
function hh(e, t) {
  return __DEV__ && e.isPlainObject_ && y(
    `Cannot apply '${this.annotationType_}' to '${e.name_}.${t.toString()}':
'${this.annotationType_}' cannot be used on plain objects.`
  ), __DEV__ && !Ne(e.appliedAnnotations_, t) && y(
    `'${e.name_}.${t.toString()}' is annotated with '${this.annotationType_}', but no such annotated member was found on prototype.`
  ), H.Cancel;
}
function _h(e, t, n, r) {
  y(`'${this.annotationType_}' can only be used with 'makeObservable'`);
}
function dh(e, t) {
  console.warn(`'${this.annotationType_}' cannot be used with decorators - this is a no-op`);
}
function Gr(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: ph,
    extend_: gh,
    decorate_20223_: bh
  };
}
function ph(e, t, n, r) {
  if (this.options_?.bound)
    return this.extend_(e, t, n, !1) === null ? H.Cancel : H.Break;
  if (r === e.target_)
    return this.extend_(e, t, n, !1) === null ? H.Cancel : H.Continue;
  if (Kt(n.value))
    return H.Break;
  const i = sc(e, this, t, n, !1);
  return yt(r, t, i), H.Continue;
}
function gh(e, t, n, r) {
  const i = sc(e, this, t, n);
  return e.defineProperty_(t, i, r);
}
function bh(e, t) {
  __DEV__ && fs(t, ["method", "field"]);
  const { kind: n, name: r, addInitializer: i } = t, s = this, o = (a) => kt(s.options_?.name ?? r.toString(), a, s.options_?.autoAction ?? !1);
  if (n == "field")
    return function(a) {
      let u = a;
      return Kt(u) || (u = o(u)), s.options_?.bound && (u = u.bind(this), u.isMobxAction = !0), u;
    };
  if (n == "method")
    return Kt(e) || (e = o(e)), this.options_?.bound && i(function() {
      const a = this, u = a[r].bind(a);
      u.isMobxAction = !0, a[r] = u;
    }), e;
  y(
    `Cannot apply '${s.annotationType_}' to '${String(r)}' (kind: ${n}):
'${s.annotationType_}' can only be used on properties with a function value.`
  );
}
function yh(e, { annotationType_: t }, n, { value: r }) {
  __DEV__ && !W(r) && y(
    `Cannot apply '${t}' to '${e.name_}.${n.toString()}':
'${t}' can only be used on properties with a function value.`
  );
}
function sc(e, t, n, r, i = g.safeDescriptors) {
  yh(e, t, n, r);
  let { value: s } = r;
  return t.options_?.bound && (s = s.bind(e.proxy_ ?? e.target_)), {
    value: kt(
      t.options_?.name ?? n.toString(),
      s,
      t.options_?.autoAction ?? !1,
      // https://github.com/mobxjs/mobx/discussions/3140
      t.options_?.bound ? e.proxy_ ?? e.target_ : void 0
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
function oc(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: mh,
    extend_: vh,
    decorate_20223_: Sh
  };
}
function mh(e, t, n, r) {
  if (r === e.target_)
    return this.extend_(e, t, n, !1) === null ? H.Cancel : H.Continue;
  if (this.options_?.bound && (!Ne(e.target_, t) || !Un(e.target_[t])) && this.extend_(e, t, n, !1) === null)
    return H.Cancel;
  if (Un(n.value))
    return H.Break;
  const i = ac(e, this, t, n, !1, !1);
  return yt(r, t, i), H.Continue;
}
function vh(e, t, n, r) {
  const i = ac(e, this, t, n, this.options_?.bound);
  return e.defineProperty_(t, i, r);
}
function Sh(e, t) {
  __DEV__ && fs(t, ["method"]);
  const { name: n, addInitializer: r } = t;
  return Un(e) || (e = pn(e)), this.options_?.bound && r(function() {
    const i = this, s = i[n].bind(i);
    s.isMobXFlow = !0, i[n] = s;
  }), e;
}
function wh(e, { annotationType_: t }, n, { value: r }) {
  __DEV__ && !W(r) && y(
    `Cannot apply '${t}' to '${e.name_}.${n.toString()}':
'${t}' can only be used on properties with a generator function value.`
  );
}
function ac(e, t, n, r, i, s = g.safeDescriptors) {
  wh(e, t, n, r);
  let { value: o } = r;
  return Un(o) || (o = pn(o)), i && (o = o.bind(e.proxy_ ?? e.target_), o.isMobXFlow = !0), {
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
function Uo(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: Eh,
    extend_: Oh,
    decorate_20223_: Ah
  };
}
function Eh(e, t, n) {
  return this.extend_(e, t, n, !1) === null ? H.Cancel : H.Break;
}
function Oh(e, t, n, r) {
  return Dh(e, this, t, n), e.defineComputedProperty_(
    t,
    {
      ...this.options_,
      get: n.get,
      set: n.set
    },
    r
  );
}
function Ah(e, t) {
  __DEV__ && fs(t, ["getter"]);
  const n = this, { name: r, addInitializer: i } = t;
  let s;
  function o(a, u) {
    const f = {
      ...n.options_,
      get: e,
      context: a
    };
    return f.name ||= __DEV__ ? `${u.name_}.${r.toString()}` : `ObservableObject.${r.toString()}`, new X(f);
  }
  return i(function() {
    const a = vn(this)[E], u = this, f = a.values_.get(r);
    f instanceof X && f.derivation !== e && a.values_.delete(r), (a.lazyComputedKeys_ ??= /* @__PURE__ */ new Map()).set(r, () => o(u, a));
  }), function() {
    const a = this[E], u = a.values_.get(r);
    if (u instanceof X && u.derivation !== e) {
      let f = s?.get(this);
      return f || (f = o(this, a), (s ??= /* @__PURE__ */ new WeakMap()).set(this, f)), f.get();
    }
    return a.getObservablePropValue_(r);
  };
}
function Dh(e, { annotationType_: t }, n, { get: r }) {
  __DEV__ && !r && y(
    `Cannot apply '${t}' to '${e.name_}.${n.toString()}':
'${t}' can only be used on getter(+setter) properties.`
  );
}
function hs(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: Ih,
    extend_: xh,
    decorate_20223_: Th
  };
}
function Ih(e, t, n) {
  return this.extend_(e, t, n, !1) === null ? H.Cancel : H.Break;
}
function xh(e, t, n, r) {
  return Rh(e, this, t, n), e.defineObservableProperty_(
    t,
    n.value,
    this.options_?.enhancer ?? hn,
    r
  );
}
function Th(e, t) {
  if (__DEV__) {
    if (t.kind === "field")
      throw y(
        `Please use \`@observable accessor ${String(
          t.name
        )}\` instead of \`@observable ${String(t.name)}\``
      );
    fs(t, ["accessor"]);
  }
  const n = this, { kind: r, name: i } = t;
  if (r !== "accessor")
    return;
  function s(o, a) {
    const u = vn(o)[E];
    return (u.lazyObservableKeys_ ??= /* @__PURE__ */ new Map()).set(
      i,
      () => new qt(
        a,
        n.options_?.enhancer ?? hn,
        __DEV__ ? `${u.name_}.${i.toString()}` : `ObservableObject.${i.toString()}`,
        !1
      )
    ), u;
  }
  return {
    get() {
      return (this[E] ?? s(this, e.get.call(this))).getObservablePropValue_(i);
    },
    set(o) {
      return (this[E] ?? s(this, o)).setObservablePropValue_(i, o);
    },
    init(o) {
      return s(this, o), o;
    }
  };
}
function Rh(e, { annotationType_: t }, n, r) {
  __DEV__ && !("value" in r) && y(
    `Cannot apply '${t}' to '${e.name_}.${n.toString()}':
'${t}' cannot be used on getter/setter properties`
  );
}
const Mh = "true", Ch = uc();
function uc(e) {
  return {
    annotationType_: Mh,
    options_: e,
    make_: Ph,
    extend_: Vh,
    decorate_20223_: zh
  };
}
function Ph(e, t, n, r) {
  if (n.get)
    return Yr.make_(e, t, n, r);
  if (n.set) {
    const s = Kt(n.set) ? n.set : kt(t.toString(), n.set);
    return r === e.target_ ? e.defineProperty_(t, {
      configurable: g.safeDescriptors ? e.isPlainObject_ : !0,
      set: s
    }) === null ? H.Cancel : H.Continue : (yt(r, t, {
      configurable: !0,
      set: s
    }), H.Continue);
  }
  if (r !== e.target_ && typeof n.value == "function")
    return ec(n.value) ? (this.options_?.autoBind ? pn.bound : pn).make_(e, t, n, r) : (this.options_?.autoBind ? qn.bound : qn).make_(e, t, n, r);
  let i = this.options_?.deep === !1 ? ie.ref : ie;
  return typeof n.value == "function" && this.options_?.autoBind && (n.value = n.value.bind(e.proxy_ ?? e.target_)), i.make_(e, t, n, r);
}
function Vh(e, t, n, r) {
  return n.get ? Yr.extend_(e, t, n, r) : n.set ? e.defineProperty_(
    t,
    {
      configurable: g.safeDescriptors ? e.isPlainObject_ : !0,
      set: kt(t.toString(), n.set)
    },
    r
  ) : (typeof n.value == "function" && this.options_?.autoBind && (n.value = n.value.bind(e.proxy_ ?? e.target_)), (this.options_?.deep === !1 ? ie.ref : ie).extend_(e, t, n, r));
}
function zh(e, t) {
  y(`'${this.annotationType_}' cannot be used as a decorator`);
}
const Nh = "observable", $h = "observable.ref", jh = "observable.shallow", Lh = "observable.struct", cc = {
  deep: !0,
  name: void 0,
  defaultDecorator: void 0,
  proxy: !0
};
Object.freeze(cc);
function _i(e) {
  return e || cc;
}
const fo = hs(Nh), Bh = hs($h, {
  enhancer: ls
}), qh = hs(jh, {
  enhancer: ch
}), Uh = hs(Lh, {
  enhancer: fh
}), fc = et(fo);
function di(e) {
  return e.deep === !0 ? hn : e.deep === !1 ? ls : Kh(e.defaultDecorator);
}
function kh(e) {
  return e ? e.defaultDecorator ?? uc(e) : void 0;
}
function Kh(e) {
  return e ? e.options_?.enhancer ?? hn : hn;
}
function lc(e, t, n) {
  if (Hr(t))
    return fo.decorate_20223_(e, t);
  if (mt(t)) {
    Fr(e, t, fo);
    return;
  }
  return gn(e) ? e : Ae(e) ? ie.object(e, t, n) : Array.isArray(e) ? ie.array(e, t) : er(e) ? ie.map(e, t) : It(e) ? ie.set(e, t) : typeof e == "object" && e !== null ? e : ie.box(e, t);
}
Zu(lc, fc);
const Wh = {
  box(e, t) {
    const n = _i(t);
    return new qt(e, di(n), n.name, !0, n.equals);
  },
  array(e, t) {
    const n = _i(t);
    return (g.useProxies === !1 || n.proxy === !1 ? _d : rd)(e, di(n), n.name);
  },
  map(e, t) {
    const n = _i(t);
    return new Kc(e, di(n), n.name);
  },
  set(e, t) {
    const n = _i(t);
    return new Zo(e, di(n), n.name);
  },
  object(e, t, n) {
    return Xt(
      () => Yo(
        g.useProxies === !1 || n?.proxy === !1 ? vn({}, n) : Z_({}, n),
        e,
        t
      )
    );
  },
  ref: et(Bh),
  shallow: et(qh),
  deep: fc,
  struct: et(Uh)
};
var ie = Zu(lc, Wh);
const hc = "computed", Fh = "computed.struct", lo = Uo(hc), Hh = Uo(Fh, {
  equals: ln.structural
}), Yr = function(t, n) {
  if (Hr(n))
    return lo.decorate_20223_(t, n);
  if (mt(n))
    return Fr(t, n, lo);
  if (Ae(t))
    return et(Uo(hc, t));
  __DEV__ && (W(t) || y("First argument to `computed` should be an expression."), W(n) && y(
    "A setter as second argument is no longer supported, use `{ set: fn }` option instead"
  ));
  const r = Ae(n) ? n : {};
  return r.get = t, r.name ||= t.name || "", new X(r);
};
Object.assign(Yr, lo);
Yr.struct = et(Hh);
let qi = 0, Gh = 1;
const Yh = ji(() => {
}, "name")?.configurable ?? !1, Ja = {
  value: "action",
  configurable: !0,
  writable: !1,
  enumerable: !1
};
function kt(e, t, n = !1, r) {
  __DEV__ && (W(t) || y("`action` can only be invoked on functions"), (typeof e != "string" || !e) && y(`actions should have valid names, got: '${e}'`));
  function i() {
    return _c(e, n, t, r || this, arguments);
  }
  return i.isMobxAction = !0, i.toString = () => t.toString(), Yh && (Ja.value = e, yt(i, "name", Ja)), i;
}
function _c(e, t, n, r, i) {
  const s = dc(e, t, r, i);
  try {
    return n.apply(r, i);
  } catch (o) {
    throw s.error_ = o, o;
  } finally {
    pc(s);
  }
}
function dc(e, t, n, r) {
  const i = __DEV__ && ue() && !!e;
  let s = 0;
  if (__DEV__ && i) {
    s = Date.now();
    const l = r ? Array.from(r) : Li;
    $e({
      type: Fo,
      name: e,
      object: n,
      arguments: l
    });
  }
  const o = g.trackingDerivation, a = !t || !o;
  Ee();
  let u = g.allowStateChanges;
  a && (mn(), u = _s(!0));
  const f = ps(!0), c = {
    runAsAction_: a,
    prevDerivation_: o,
    prevAllowStateChanges_: u,
    prevAllowStateReads_: f,
    notifySpy_: i,
    startTime_: s,
    actionId_: Gh++,
    parentActionId_: qi
  };
  return qi = c.actionId_, c;
}
function pc(e) {
  qi !== e.actionId_ && y(30), qi = e.parentActionId_, e.error_ !== void 0 && (g.suppressReactionErrors = !0), ds(e.prevAllowStateChanges_), zn(e.prevAllowStateReads_), Oe(), e.runAsAction_ && Tt(e.prevDerivation_), __DEV__ && e.notifySpy_ && je({ time: Date.now() - e.startTime_ }), g.suppressReactionErrors = !1;
}
function ko(e, t) {
  const n = _s(e);
  try {
    return t();
  } finally {
    ds(n);
  }
}
function _s(e) {
  const t = g.allowStateChanges;
  return g.allowStateChanges = e, t;
}
function ds(e) {
  g.allowStateChanges = e;
}
const Xh = "create";
class qt extends Fe {
  constructor(t, n, r = __DEV__ ? "ObservableValue@" + Ke() : "ObservableValue", i = !0, s = ln.default) {
    super(r), this.enhancer = n, this.name_ = r, this.equals = s, this.value_ = n(t, void 0, r), __DEV__ && i && ue() && dn({
      type: Xh,
      object: this,
      observableKind: "value",
      debugObjectName: this.name_,
      newValue: "" + this.value_?.toString()
    });
  }
  hasUnreportedChange_ = !1;
  interceptors_;
  changeListeners_;
  value_;
  dehancer;
  dehanceValue(t) {
    return this.dehancer !== void 0 ? this.dehancer(t) : t;
  }
  set(t) {
    const n = this.value_;
    if (t = this.prepareNewValue_(t), t !== g.UNCHANGED) {
      const r = ue();
      __DEV__ && r && $e({
        type: Qe,
        object: this,
        observableKind: "value",
        debugObjectName: this.name_,
        newValue: t,
        oldValue: n
      }), this.setNewValue_(t), __DEV__ && r && je();
    }
  }
  prepareNewValue_(t) {
    if (pt(this), Ge(this)) {
      const n = Ye(this, {
        object: this,
        type: Qe,
        newValue: t
      });
      if (!n)
        return g.UNCHANGED;
      t = n.newValue;
    }
    return t = this.enhancer(t, this.value_, this.name_), this.equals(this.value_, t) ? g.UNCHANGED : t;
  }
  setNewValue_(t) {
    const n = this.value_;
    this.value_ = t, this.reportChanged(), nt(this) && rt(this, {
      type: Qe,
      object: this,
      newValue: t,
      oldValue: n
    });
  }
  get() {
    return this.reportObserved(), this.dehanceValue(this.value_);
  }
  intercept_(t) {
    return Xr(this, t);
  }
  observe_(t, n) {
    return n && t({
      observableKind: "value",
      debugObjectName: this.name_,
      object: this,
      type: Qe,
      newValue: this.value_,
      oldValue: void 0
    }), Jr(this, t);
  }
  raw() {
    return this.value_;
  }
  toJSON() {
    return this.get();
  }
  toString() {
    return `${this.name_}[${this.value_}]`;
  }
  valueOf() {
    return rc(this.get());
  }
  [Symbol.toPrimitive]() {
    return this.valueOf();
  }
}
const Ko = Yt("ObservableValue", qt);
class X {
  dependenciesState_ = J.NOT_TRACKING_;
  observing_ = [];
  // nodes we are looking at. Our value depends on these nodes
  newObserving_ = null;
  // during tracking it's an array with new observed observers
  observers_ = /* @__PURE__ */ new Set();
  runId_ = 0;
  lastAccessedBy_ = 0;
  lowestObserverState_ = J.UP_TO_DATE_;
  unboundDepsCount_ = 0;
  value_ = new Ui(null);
  name_;
  triggeredBy_;
  static isComputingMask_ = 1;
  static isRunningSetterMask_ = 2;
  static isBeingObservedMask_ = 4;
  static isPendingUnobservationMask_ = 8;
  static diffValueMask_ = 16;
  flags_ = 0;
  derivation;
  // N.B: unminified as it is used by MST
  setter_;
  isTracing_ = tt.NONE;
  scope_;
  equals_;
  requiresReaction_;
  keepAlive_;
  /**
   * Create a new computed value based on a function expression.
   *
   * The `name` property is for debug purposes only.
   *
   * The `equals` property specifies the comparer function to use to determine if a newly produced
   * value differs from the previous value. Two comparers are provided in the library; `defaultComparer`
   * compares based on identity comparison (===), and `structuralComparer` deeply compares the structure.
   * Structural comparison can be convenient if you always produce a new aggregated object and
   * don't want to notify observers if it is structurally the same.
   * This is useful for working with vectors, mouse coordinates etc.
   */
  constructor(t) {
    t.get || y(31), this.derivation = t.get, this.name_ = t.name || (__DEV__ ? "ComputedValue@" + Ke() : "ComputedValue"), t.set && (this.setter_ = kt(
      __DEV__ ? this.name_ + "-setter" : "ComputedValue-setter",
      t.set
    )), this.equals_ = t.equals || (t.compareStructural || t.struct ? ln.structural : ln.default), this.scope_ = t.context, this.requiresReaction_ = t.requiresReaction, this.keepAlive_ = !!t.keepAlive;
  }
  onBecomeStale_() {
    c_(this);
  }
  onBOL;
  onBUOL;
  onBO() {
    this.onBOL && this.onBOL.forEach((t) => t());
  }
  onBUO() {
    this.onBUOL && this.onBUOL.forEach((t) => t());
  }
  // to check for cycles
  get isComputing() {
    return Me(this.flags_, X.isComputingMask_);
  }
  set isComputing(t) {
    this.flags_ = Ce(this.flags_, X.isComputingMask_, t);
  }
  get isRunningSetter() {
    return Me(this.flags_, X.isRunningSetterMask_);
  }
  set isRunningSetter(t) {
    this.flags_ = Ce(this.flags_, X.isRunningSetterMask_, t);
  }
  get isBeingObserved() {
    return Me(this.flags_, X.isBeingObservedMask_);
  }
  set isBeingObserved(t) {
    this.flags_ = Ce(this.flags_, X.isBeingObservedMask_, t);
  }
  get isPendingUnobservation() {
    return Me(this.flags_, X.isPendingUnobservationMask_);
  }
  set isPendingUnobservation(t) {
    this.flags_ = Ce(this.flags_, X.isPendingUnobservationMask_, t);
  }
  get diffValue() {
    return Me(this.flags_, X.diffValueMask_) ? 1 : 0;
  }
  set diffValue(t) {
    this.flags_ = Ce(
      this.flags_,
      X.diffValueMask_,
      t === 1
    );
  }
  /**
   * Returns the current value of this computed value.
   * Will evaluate its computation first if needed.
   */
  get() {
    if (this.isComputing && y(32, this.name_, this.derivation), g.inBatch === 0 && // !globalState.trackingDerivatpion &&
    this.observers_.size === 0 && !this.keepAlive_)
      ho(this) && (this.warnAboutUntrackedRead_(), Ee(), this.value_ = this.computeValue_(!1), Oe());
    else if (Sc(this), ho(this)) {
      let n = g.trackingContext;
      this.keepAlive_ && !n && (g.trackingContext = this), this.trackAndCompute() && u_(this), g.trackingContext = n;
    }
    const t = this.value_;
    if (Di(t))
      throw t.cause;
    return t;
  }
  set(t) {
    if (this.setter_) {
      this.isRunningSetter && y(33, this.name_), this.isRunningSetter = !0;
      try {
        this.setter_.call(this.scope_, t);
      } finally {
        this.isRunningSetter = !1;
      }
    } else
      y(34, this.name_);
  }
  trackAndCompute() {
    const t = this.value_, n = (
      /* see #1208 */
      this.dependenciesState_ === J.NOT_TRACKING_
    ), r = this.computeValue_(!0), i = n || Di(t) || Di(r) || !this.equals_(t, r);
    return i && (this.value_ = r, __DEV__ && ue() && dn({
      observableKind: "computed",
      debugObjectName: this.name_,
      object: this.scope_,
      type: "update",
      oldValue: t,
      newValue: r
    })), i;
  }
  computeValue_(t) {
    this.isComputing = !0;
    const n = _s(!1);
    let r;
    if (t)
      r = gc(this, this.derivation, this.scope_);
    else if (g.disableErrorBoundaries === !0)
      r = this.derivation.call(this.scope_);
    else
      try {
        r = this.derivation.call(this.scope_);
      } catch (i) {
        r = new Ui(i);
      }
    return ds(n), this.isComputing = !1, r;
  }
  suspend_() {
    this.keepAlive_ || (_o(this), this.value_ = void 0, __DEV__ && this.isTracing_ !== tt.NONE && console.log(
      `[mobx.trace] Computed value '${this.name_}' was suspended and it will recompute on the next access.`
    ));
  }
  observe_(t, n) {
    let r = !0, i;
    return Ho(() => {
      let s = this.get();
      if (!r || n) {
        const o = mn();
        t({
          observableKind: "computed",
          debugObjectName: this.name_,
          type: Qe,
          object: this,
          newValue: s,
          oldValue: i
        }), Tt(o);
      }
      r = !1, i = s;
    });
  }
  warnAboutUntrackedRead_() {
    __DEV__ && (this.isTracing_ !== tt.NONE && console.log(
      `[mobx.trace] Computed value '${this.name_}' is being read outside a reactive context. Doing a full recompute.`
    ), (typeof this.requiresReaction_ == "boolean" ? this.requiresReaction_ : g.computedRequiresReaction) && console.warn(
      `[mobx] Computed value '${this.name_}' is being read outside a reactive context. Doing a full recompute.`
    ));
  }
  toString() {
    return `${this.name_}[${this.derivation.toString()}]`;
  }
  valueOf() {
    return rc(this.get());
  }
  [Symbol.toPrimitive]() {
    return this.valueOf();
  }
}
const _n = Yt("ComputedValue", X);
var J = /* @__PURE__ */ ((e) => (e[e.NOT_TRACKING_ = -1] = "NOT_TRACKING_", e[e.UP_TO_DATE_ = 0] = "UP_TO_DATE_", e[e.POSSIBLY_STALE_ = 1] = "POSSIBLY_STALE_", e[e.STALE_ = 2] = "STALE_", e))(J || {}), tt = /* @__PURE__ */ ((e) => (e[e.NONE = 0] = "NONE", e[e.LOG = 1] = "LOG", e[e.BREAK = 2] = "BREAK", e))(tt || {});
class Ui {
  constructor(t) {
    this.cause = t;
  }
}
function Di(e) {
  return e instanceof Ui;
}
function ho(e) {
  switch (e.dependenciesState_) {
    case 0:
      return !1;
    case -1:
    case 2:
      return !0;
    case 1: {
      const t = ps(!0), n = mn(), r = e.observing_, i = r.length;
      for (let s = 0; s < i; s++) {
        const o = r[s];
        if (_n(o)) {
          if (g.disableErrorBoundaries)
            o.get();
          else
            try {
              o.get();
            } catch {
              return Tt(n), zn(t), !0;
            }
          if (e.dependenciesState_ === 2)
            return Tt(n), zn(t), !0;
        }
      }
      return bc(e), Tt(n), zn(t), !1;
    }
  }
}
function Jh() {
  return g.trackingDerivation !== null;
}
function pt(e) {
  if (!__DEV__)
    return;
  const t = e.observers_.size > 0;
  !g.allowStateChanges && (t || g.enforceActions === "always") && console.warn(
    "[MobX] " + (g.enforceActions ? "Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: " : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, a computed value or the render function of a React component? You can wrap side effects in 'runInAction' (or decorate functions with 'action') if needed. Tried to modify: ") + e.name_
  );
}
function Zh(e) {
  __DEV__ && !g.allowStateReads && g.observableRequiresReaction && console.warn(
    `[mobx] Observable '${e.name_}' being read outside a reactive context.`
  );
}
function gc(e, t, n) {
  const r = ps(!0);
  bc(e), e.newObserving_ = new Array(
    // Reserve constant space for initial dependencies, dynamic space otherwise.
    // See https://github.com/mobxjs/mobx/pull/3833
    e.runId_ === 0 ? 100 : e.observing_.length
  ), e.unboundDepsCount_ = 0, e.runId_ = ++g.runId;
  const i = g.trackingDerivation;
  g.trackingDerivation = e, g.inBatch++;
  let s;
  if (g.disableErrorBoundaries === !0)
    s = t.call(n);
  else
    try {
      s = t.call(n);
    } catch (o) {
      s = new Ui(o);
    }
  return g.inBatch--, g.trackingDerivation = i, e_(e), Qh(e), zn(r), s;
}
function Qh(e) {
  __DEV__ && e.observing_.length === 0 && (typeof e.requiresObservable_ == "boolean" ? e.requiresObservable_ : g.reactionRequiresObservable) && console.warn(
    `[mobx] Derivation '${e.name_}' is created/updated without reading any observable value.`
  );
}
function e_(e) {
  const t = e.observing_, n = e.observing_ = e.newObserving_;
  let r = 0, i = 0, s = e.unboundDepsCount_;
  for (let o = 0; o < s; o++) {
    const a = n[o];
    a.diffValue === 0 && (a.diffValue = 1, i !== o && (n[i] = a), i++), a.dependenciesState_ > r && (r = a.dependenciesState_);
  }
  for (n.length = i, e.newObserving_ = null, s = t.length; s--; ) {
    const o = t[s];
    o.diffValue === 0 && mc(o, e), o.diffValue = 0;
  }
  for (; i--; ) {
    const o = n[i];
    o.diffValue === 1 && (o.diffValue = 0, a_(o, e));
  }
  r !== 0 && (e.dependenciesState_ = r, e.onBecomeStale_());
}
function _o(e) {
  const t = e.observing_;
  e.observing_ = [];
  let n = t.length;
  for (; n--; )
    mc(t[n], e);
  e.dependenciesState_ = -1;
}
function Wo(e) {
  const t = mn();
  try {
    return e();
  } finally {
    Tt(t);
  }
}
function mn() {
  const e = g.trackingDerivation;
  return g.trackingDerivation = null, e;
}
function Tt(e) {
  g.trackingDerivation = e;
}
function ps(e) {
  const t = g.allowStateReads;
  return g.allowStateReads = e, t;
}
function zn(e) {
  g.allowStateReads = e;
}
function bc(e) {
  if (e.dependenciesState_ === 0)
    return;
  e.dependenciesState_ = 0;
  const t = e.observing_;
  let n = t.length;
  for (; n--; )
    t[n].lowestObserverState_ = 0;
}
const t_ = [
  "mobxGuid",
  "spyListeners",
  "enforceActions",
  "computedRequiresReaction",
  "reactionRequiresObservable",
  "observableRequiresReaction",
  "allowStateReads",
  "disableErrorBoundaries",
  "runId",
  "UNCHANGED",
  "useProxies"
];
class pr {
  /**
   * MobXGlobals version.
   * MobX compatiblity with other versions loaded in memory as long as this version matches.
   * It indicates that the global state still stores similar information
   *
   * N.B: this version is unrelated to the package version of MobX, and is only the version of the
   * internal state storage of MobX, and can be the same across many different package versions
   */
  version = 6;
  /**
   * globally unique token to signal unchanged
   */
  UNCHANGED = {};
  /**
   * Currently running derivation
   */
  trackingDerivation = null;
  /**
   * Currently running reaction. This determines if we currently have a reactive context.
   * (Tracking derivation is also set for temporal tracking of computed values inside actions,
   * but trackingReaction can only be set by a form of Reaction)
   */
  trackingContext = null;
  /**
   * Each time a derivation is tracked, it is assigned a unique run-id
   */
  runId = 0;
  /**
   * 'guid' for general purpose. Will be persisted amongst resets.
   */
  mobxGuid = 0;
  /**
   * Are we in a batch block? (and how many of them)
   */
  inBatch = 0;
  /**
   * Observables that don't have observers anymore, and are about to be
   * suspended, unless somebody else accesses it in the same batch
   *
   * @type {IObservable[]}
   */
  pendingUnobservations = [];
  /**
   * List of scheduled, not yet executed, reactions.
   */
  pendingReactions = [];
  /**
   * Are we currently processing reactions?
   */
  isRunningReactions = !1;
  /**
   * Is it allowed to change observables at this point?
   * In general, MobX doesn't allow that when running computations and React.render.
   * To ensure that those functions stay pure.
   */
  allowStateChanges = !1;
  /**
   * Is it allowed to read observables at this point?
   * Used to hold the state needed for `observableRequiresReaction`
   */
  allowStateReads = !0;
  /**
   * If strict mode is enabled, state changes are by default not allowed
   */
  enforceActions = !0;
  /**
   * Spy callbacks
   */
  spyListeners = [];
  /**
   * Globally attached error handlers that react specifically to errors in reactions
   */
  globalReactionErrorHandlers = [];
  /**
   * Warn if computed values are accessed outside a reactive context
   */
  computedRequiresReaction = !1;
  /**
   * (Experimental)
   * Warn if you try to create to derivation / reactive context without accessing any observable.
   */
  reactionRequiresObservable = !1;
  /**
   * (Experimental)
   * Warn if observables are accessed outside a reactive context
   */
  observableRequiresReaction = !1;
  /*
   * Don't catch and rethrow exceptions. This is useful for inspecting the state of
   * the stack when an exception occurs while debugging.
   */
  disableErrorBoundaries = !1;
  /*
   * If true, we are already handling an exception in an action. Any errors in reactions should be suppressed, as
   * they are not the cause, see: https://github.com/mobxjs/mobx/issues/1836
   */
  suppressReactionErrors = !1;
  useProxies = !0;
  /*
   * print warnings about code that would fail if proxies weren't available
   */
  verifyProxies = !1;
  /**
   * False forces all object's descriptors to
   * writable: true
   * configurable: true
   */
  safeDescriptors = !0;
}
let Ii = !0, yc = !1, g = function() {
  let e = us();
  return e.__mobxInstanceCount > 0 && !e.__mobxGlobals && (Ii = !1), e.__mobxGlobals && e.__mobxGlobals.version !== new pr().version && (Ii = !1), Ii ? e.__mobxGlobals ? (e.__mobxInstanceCount += 1, e.__mobxGlobals.UNCHANGED || (e.__mobxGlobals.UNCHANGED = {}), e.__mobxGlobals) : (e.__mobxInstanceCount = 1, e.__mobxGlobals = new pr()) : (setTimeout(() => {
    yc || y(35);
  }, 1), new pr());
}();
function n_() {
  if ((g.pendingReactions.length || g.inBatch || g.isRunningReactions) && y(36), yc = !0, Ii) {
    let e = us();
    --e.__mobxInstanceCount === 0 && (e.__mobxGlobals = void 0), g = new pr();
  }
}
function r_() {
  return g;
}
function i_() {
  const e = new pr();
  for (let t in e)
    t_.indexOf(t) === -1 && (g[t] = e[t]);
  g.allowStateChanges = !g.enforceActions;
}
function s_(e) {
  return e.observers_ && e.observers_.size > 0;
}
function o_(e) {
  return e.observers_;
}
function a_(e, t) {
  e.observers_.add(t), e.lowestObserverState_ > t.dependenciesState_ && (e.lowestObserverState_ = t.dependenciesState_);
}
function mc(e, t) {
  e.observers_.delete(t), e.observers_.size === 0 && vc(e);
}
function vc(e) {
  e.isPendingUnobservation === !1 && (e.isPendingUnobservation = !0, g.pendingUnobservations.push(e));
}
function Ee() {
  g.inBatch++;
}
function Oe() {
  if (--g.inBatch === 0) {
    Ac();
    const e = g.pendingUnobservations;
    for (let t = 0; t < e.length; t++) {
      const n = e[t];
      n.isPendingUnobservation = !1, n.observers_.size === 0 && (n.isBeingObserved && (n.isBeingObserved = !1, n.onBUO()), n instanceof X && n.suspend_());
    }
    g.pendingUnobservations = [];
  }
}
function Sc(e) {
  Zh(e);
  const t = g.trackingDerivation;
  return t !== null ? (t.runId_ !== e.lastAccessedBy_ && (e.lastAccessedBy_ = t.runId_, t.newObserving_[t.unboundDepsCount_++] = e, !e.isBeingObserved && g.trackingContext && (e.isBeingObserved = !0, e.onBO())), e.isBeingObserved) : (e.observers_.size === 0 && g.inBatch > 0 && vc(e), !1);
}
function wc(e) {
  e.lowestObserverState_ !== J.STALE_ && (e.lowestObserverState_ = J.STALE_, e.observers_.forEach((t) => {
    t.dependenciesState_ === J.UP_TO_DATE_ && (__DEV__ && t.isTracing_ !== tt.NONE && Ec(t, e), t.onBecomeStale_()), t.dependenciesState_ = J.STALE_;
  }));
}
function u_(e) {
  e.lowestObserverState_ !== J.STALE_ && (e.lowestObserverState_ = J.STALE_, e.observers_.forEach((t) => {
    t.dependenciesState_ === J.POSSIBLY_STALE_ ? (t.dependenciesState_ = J.STALE_, __DEV__ && t.isTracing_ !== tt.NONE && Ec(t, e)) : t.dependenciesState_ === J.UP_TO_DATE_ && (e.lowestObserverState_ = J.UP_TO_DATE_);
  }));
}
function c_(e) {
  e.lowestObserverState_ === J.UP_TO_DATE_ && (e.lowestObserverState_ = J.POSSIBLY_STALE_, e.observers_.forEach((t) => {
    t.dependenciesState_ === J.UP_TO_DATE_ && (t.dependenciesState_ = J.POSSIBLY_STALE_, t.onBecomeStale_());
  }));
}
function Ec(e, t) {
  if (console.log(
    `[mobx.trace] '${e.name_}' is invalidated due to a change in: '${t.name_}'`
  ), e.isTracing_ === tt.BREAK) {
    const n = [];
    Oc(Pc(e), n, 1), new Function(
      `debugger;
/*
Tracing '${e.name_}'

You are entering this break point because derivation '${e.name_}' is being traced and '${t.name_}' is now forcing it to update.
Just follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update
The stackframe you are looking for is at least ~6-8 stack-frames up.

${e instanceof X ? e.derivation.toString().replace(/[*]\//g, "/") : ""}

The dependencies for this derivation are:

${n.join(`
`)}
*/
    `
    )();
  }
}
function Oc(e, t, n) {
  if (t.length >= 1e3) {
    t.push("(and many more)");
    return;
  }
  t.push(`${"	".repeat(n - 1)}${e.name}`), e.dependencies && e.dependencies.forEach((r) => Oc(r, t, n + 1));
}
class de {
  constructor(t = __DEV__ ? "Reaction@" + Ke() : "Reaction", n, r, i) {
    this.name_ = t, this.onInvalidate_ = n, this.errorHandler_ = r, this.requiresObservable_ = i;
  }
  observing_ = [];
  // nodes we are looking at. Our value depends on these nodes
  newObserving_ = [];
  dependenciesState_ = J.NOT_TRACKING_;
  runId_ = 0;
  unboundDepsCount_ = 0;
  static isDisposedMask_ = 1;
  static isScheduledMask_ = 2;
  static isTrackPendingMask_ = 4;
  static isRunningMask_ = 8;
  static diffValueMask_ = 16;
  flags_ = 0;
  isTracing_ = tt.NONE;
  get isDisposed() {
    return Me(this.flags_, de.isDisposedMask_);
  }
  set isDisposed(t) {
    this.flags_ = Ce(this.flags_, de.isDisposedMask_, t);
  }
  get isScheduled() {
    return Me(this.flags_, de.isScheduledMask_);
  }
  set isScheduled(t) {
    this.flags_ = Ce(this.flags_, de.isScheduledMask_, t);
  }
  get isTrackPending() {
    return Me(this.flags_, de.isTrackPendingMask_);
  }
  set isTrackPending(t) {
    this.flags_ = Ce(this.flags_, de.isTrackPendingMask_, t);
  }
  get isRunning() {
    return Me(this.flags_, de.isRunningMask_);
  }
  set isRunning(t) {
    this.flags_ = Ce(this.flags_, de.isRunningMask_, t);
  }
  get diffValue() {
    return Me(this.flags_, de.diffValueMask_) ? 1 : 0;
  }
  set diffValue(t) {
    this.flags_ = Ce(this.flags_, de.diffValueMask_, t === 1);
  }
  onBecomeStale_() {
    this.schedule_();
  }
  schedule_() {
    this.isScheduled || (this.isScheduled = !0, g.pendingReactions.push(this), Ac());
  }
  /**
   * internal, use schedule() if you intend to kick off a reaction
   */
  runReaction_() {
    if (!this.isDisposed) {
      Ee(), this.isScheduled = !1;
      const t = g.trackingContext;
      if (g.trackingContext = this, ho(this)) {
        this.isTrackPending = !0;
        try {
          this.onInvalidate_(), __DEV__ && this.isTrackPending && ue() && dn({
            name: this.name_,
            type: "scheduled-reaction"
          });
        } catch (n) {
          this.reportExceptionInDerivation_(n);
        }
      }
      g.trackingContext = t, Oe();
    }
  }
  track(t) {
    if (this.isDisposed)
      return;
    Ee();
    const n = ue();
    let r;
    __DEV__ && n && (r = Date.now(), $e({
      name: this.name_,
      type: "reaction"
    })), this.isRunning = !0;
    const i = g.trackingContext;
    g.trackingContext = this;
    const s = gc(this, t, void 0);
    g.trackingContext = i, this.isRunning = !1, this.isTrackPending = !1, this.isDisposed && _o(this), Di(s) && this.reportExceptionInDerivation_(s.cause), __DEV__ && n && je({
      time: Date.now() - r
    }), Oe();
  }
  reportExceptionInDerivation_(t) {
    if (this.errorHandler_) {
      this.errorHandler_(t, this);
      return;
    }
    if (g.disableErrorBoundaries)
      throw t;
    const n = __DEV__ ? `[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '${this}'` : `[mobx] uncaught error in '${this}'`;
    g.suppressReactionErrors ? __DEV__ && console.warn(`[mobx] (error in reaction '${this.name_}' suppressed, fix error of causing action below)`) : console.error(n, t), __DEV__ && ue() && dn({
      type: "error",
      name: this.name_,
      message: n,
      error: "" + t
    }), g.globalReactionErrorHandlers.forEach((r) => r(t, this));
  }
  dispose() {
    this.isDisposed || (this.isDisposed = !0, this.isRunning || (Ee(), _o(this), Oe()));
  }
  getDisposer_(t) {
    const n = () => {
      this.dispose(), t?.removeEventListener?.("abort", n);
    };
    return t?.addEventListener?.("abort", n), n[E] = this, "dispose" in Symbol && typeof Symbol.dispose == "symbol" && (n[Symbol.dispose] = n), n;
  }
  toString() {
    return `Reaction[${this.name_}]`;
  }
  trace(t = !1) {
    qc(this, t);
  }
}
function f_(e) {
  return g.globalReactionErrorHandlers.push(e), () => {
    const t = g.globalReactionErrorHandlers.indexOf(e);
    t >= 0 && g.globalReactionErrorHandlers.splice(t, 1);
  };
}
const Za = 100;
let po = (e) => e();
function Ac() {
  g.inBatch > 0 || g.isRunningReactions || po(l_);
}
function l_() {
  g.isRunningReactions = !0;
  const e = g.pendingReactions;
  let t = 0;
  for (; e.length > 0; ) {
    ++t === Za && (console.error(
      __DEV__ ? `Reaction doesn't converge to a stable state after ${Za} iterations. Probably there is a cycle in the reactive function: ${e[0]}` : `[mobx] cycle in reaction: ${e[0]}`
    ), e.splice(0));
    let n = e.splice(0);
    for (let r = 0, i = n.length; r < i; r++)
      n[r].runReaction_();
  }
  g.isRunningReactions = !1;
}
const ki = Yt("Reaction", de);
function h_(e) {
  const t = po;
  po = (n) => e(() => t(n));
}
function ue() {
  return __DEV__ && !!g.spyListeners.length;
}
function dn(e) {
  if (!__DEV__ || !g.spyListeners.length)
    return;
  const t = g.spyListeners;
  for (let n = 0, r = t.length; n < r; n++)
    t[n](e);
}
function $e(e) {
  if (!__DEV__)
    return;
  const t = { ...e, spyReportStart: !0 };
  dn(t);
}
const __ = { type: "report-end", spyReportEnd: !0 };
function je(e) {
  __DEV__ && dn(e ? { ...e, type: "report-end", spyReportEnd: !0 } : __);
}
function Dc(e) {
  return __DEV__ ? (g.spyListeners.push(e), Lo(() => {
    g.spyListeners = g.spyListeners.filter((t) => t !== e);
  })) : (console.warn("[mobx.spy] Is a no-op in production builds"), function() {
  });
}
const Fo = "action", d_ = "action.bound", Ic = "autoAction", p_ = "autoAction.bound", xc = "<unnamed action>", go = Gr(Fo), g_ = Gr(d_, {
  bound: !0
}), bo = Gr(Ic, {
  autoAction: !0
}), b_ = Gr(p_, {
  autoAction: !0,
  bound: !0
});
function Tc(e) {
  return function(r, i) {
    if (W(r))
      return kt(r.name || xc, r, e);
    if (W(i))
      return kt(r, i, e);
    if (Hr(i))
      return (e ? bo : go).decorate_20223_(
        r,
        i
      );
    if (mt(i))
      return Fr(r, i, e ? bo : go);
    if (mt(r))
      return et(
        Gr(e ? Ic : Fo, {
          name: r,
          autoAction: e
        })
      );
    __DEV__ && y("Invalid arguments for `action`");
  };
}
const Lt = Tc(!1);
Object.assign(Lt, go);
const qn = Tc(!0);
Object.assign(qn, bo);
Lt.bound = et(g_);
qn.bound = et(b_);
function Qa(e) {
  return _c(e.name || xc, !1, e, this, void 0);
}
function Kt(e) {
  return W(e) && e.isMobxAction === !0;
}
function Ho(e, t = jo) {
  __DEV__ && (W(e) || y("Autorun expects a function as first argument"), Kt(e) && y("Autorun does not accept actions since actions are untrackable"));
  const n = t?.name ?? (__DEV__ ? e.name || "Autorun@" + Ke() : "Autorun"), r = !t.scheduler && !t.delay;
  let i;
  if (r)
    i = new de(
      n,
      function() {
        this.track(s);
      },
      t.onError,
      t.requiresObservable
    );
  else {
    const o = Rc(t);
    let a = !1;
    i = new de(
      n,
      () => {
        a || (a = !0, o(() => {
          a = !1, i.isDisposed || i.track(s);
        }));
      },
      t.onError,
      t.requiresObservable
    );
  }
  function s() {
    e(i);
  }
  return t?.signal?.aborted || i.schedule_(), i.getDisposer_(t?.signal);
}
const y_ = (e) => e();
function Rc(e) {
  return e.scheduler ? e.scheduler : e.delay ? (t) => setTimeout(t, e.delay) : y_;
}
function m_(e, t, n = jo) {
  __DEV__ && ((!W(e) || !W(t)) && y("First and second argument to reaction should be functions"), Ae(n) || y("Third argument of reactions should be an object"));
  const r = n.name ?? (__DEV__ ? "Reaction@" + Ke() : "Reaction"), i = Lt(
    r,
    n.onError ? v_(n.onError, t) : t
  ), s = !n.scheduler && !n.delay, o = Rc(n);
  let a = !0, u = !1, f;
  const c = n.compareStructural ? ln.structural : n.equals || ln.default, l = new de(
    r,
    () => {
      a || s ? _() : u || (u = !0, o(_));
    },
    n.onError,
    n.requiresObservable
  );
  function _() {
    if (u = !1, l.isDisposed)
      return;
    let d = !1;
    const h = f;
    l.track(() => {
      const p = ko(!1, () => e(l));
      d = a || !c(f, p), f = p;
    }), (a && n.fireImmediately || !a && d) && i(f, h, l), a = !1;
  }
  return n?.signal?.aborted || l.schedule_(), l.getDisposer_(n?.signal);
}
function v_(e, t) {
  return function() {
    try {
      return t.apply(this, arguments);
    } catch (n) {
      e.call(this, n);
    }
  };
}
const S_ = "onBO", w_ = "onBUO";
function Mc(e, t, n) {
  return Cc(S_, e, t, n);
}
function Go(e, t, n) {
  return Cc(w_, e, t, n);
}
function Cc(e, t, n, r) {
  const i = typeof r == "function" ? at(t, n) : at(t), s = W(r) ? r : n, o = `${e}L`;
  return i[o] ? i[o].add(s) : i[o] = /* @__PURE__ */ new Set([s]), function() {
    const a = i[o];
    a && (a.delete(s), a.size === 0 && delete i[o]);
  };
}
const E_ = "never", pi = "always", O_ = "observed";
function A_(e) {
  e.isolateGlobalState === !0 && n_();
  const { useProxies: t, enforceActions: n } = e;
  if (t !== void 0 && (g.useProxies = t === pi ? !0 : t === E_ ? !1 : typeof Proxy < "u"), t === "ifavailable" && (g.verifyProxies = !0), n !== void 0) {
    const r = n === pi ? pi : n === O_;
    g.enforceActions = r, g.allowStateChanges = !(r === !0 || r === pi);
  }
  [
    "computedRequiresReaction",
    "reactionRequiresObservable",
    "observableRequiresReaction",
    "disableErrorBoundaries",
    "safeDescriptors"
  ].forEach((r) => {
    r in e && (g[r] = !!e[r]);
  }), g.allowStateReads = !g.observableRequiresReaction, __DEV__ && g.disableErrorBoundaries === !0 && console.warn(
    "WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled."
  ), e.reactionScheduler && h_(e.reactionScheduler);
}
function Yo(e, t, n, r) {
  __DEV__ && (arguments.length > 4 && y("'extendObservable' expected 2-4 arguments"), typeof e != "object" && y("'extendObservable' expects an object as first argument"), re(e) && y("'extendObservable' should not be used on maps, use map.merge instead"), Ae(t) || y("'extendObservable' only accepts plain objects as second argument"), (gn(t) || gn(n)) && y("Extending an object with another observable (object) is not supported"));
  const i = nh(t);
  return Xt(() => {
    const s = vn(e, r)[E];
    Bn(i).forEach((o) => {
      s.extend_(
        o,
        i[o],
        // must pass "undefined" for { key: undefined }
        n && o in n ? n[o] : !0
      );
    });
  }), e;
}
function Pc(e, t) {
  return Vc(at(e, t));
}
function Vc(e) {
  const t = {
    name: e.name_
  };
  return e.observing_ && e.observing_.length > 0 && (t.dependencies = I_(e.observing_).map(Vc)), t;
}
function D_(e, t) {
  return zc(at(e, t));
}
function zc(e) {
  const t = {
    name: e.name_
  };
  return s_(e) && (t.observers = Array.from(o_(e)).map(zc)), t;
}
function I_(e) {
  return Array.from(new Set(e));
}
let x_ = 0;
class Xo extends Error {
  constructor() {
    super("FLOW_CANCELLED"), Object.setPrototypeOf(this, new.target.prototype), this.name = "FlowCancellationError";
  }
  toString() {
    return `Error: ${this.message}`;
  }
}
function T_(e) {
  return e instanceof Xo;
}
const Us = oc("flow"), R_ = oc("flow.bound", { bound: !0 }), pn = Object.assign(
  function(t, n) {
    if (Hr(n))
      return Us.decorate_20223_(t, n);
    if (mt(n))
      return Fr(t, n, Us);
    __DEV__ && arguments.length !== 1 && y("Flow expects single argument with generator function");
    const r = t, i = r.name || "<unnamed flow>", s = function() {
      const o = this, a = arguments, u = ++x_, f = Lt(`${i} - runid: ${u} - init`, r).apply(o, a);
      let c, l;
      const _ = new Promise(function(d, h) {
        let p = 0;
        c = h;
        function b(D) {
          l = void 0;
          let m;
          try {
            m = Lt(
              `${i} - runid: ${u} - yield ${p++}`,
              f.next
            ).call(f, D);
          } catch (v) {
            return h(v);
          }
          O(m);
        }
        function S(D) {
          l = void 0;
          let m;
          try {
            m = Lt(
              `${i} - runid: ${u} - yield ${p++}`,
              f.throw
            ).call(f, D);
          } catch (v) {
            return h(v);
          }
          O(m);
        }
        function O(D) {
          if (W(D?.then)) {
            D.then(O, h);
            return;
          }
          return D.done ? d(D.value) : (l = Promise.resolve(D.value), l.then(b, S));
        }
        b(void 0);
      });
      return _.cancel = Lt(`${i} - runid: ${u} - cancel`, function() {
        try {
          l && eu(l);
          const d = f.return(void 0), h = Promise.resolve(d.value);
          h.then(Mn, Mn), eu(h), c(new Xo());
        } catch (d) {
          c(d);
        }
      }), _;
    };
    return s.isMobXFlow = !0, s;
  },
  Us
);
pn.bound = et(R_);
function eu(e) {
  W(e.cancel) && e.cancel();
}
function M_(e) {
  return e;
}
function Un(e) {
  return e?.isMobXFlow === !0;
}
function C_(e, t, n) {
  let r;
  if (re(e) || ve(e) || Ko(e))
    r = vt(e);
  else if (ne(e)) {
    if (__DEV__ && !mt(t))
      return y(
        "InterceptReads can only be used with a specific property, not with an object in general"
      );
    r = vt(e, t);
  } else if (__DEV__)
    return y("Expected observable map, object or array as first array");
  return __DEV__ && r.dehancer !== void 0 ? y("An intercept reader was already established") : (r.dehancer = typeof t == "function" ? t : n, () => {
    r.dehancer = void 0;
  });
}
function P_(e, t, n) {
  return W(n) ? z_(e, t, n) : V_(e, t);
}
function V_(e, t) {
  return vt(e).intercept_(t);
}
function z_(e, t, n) {
  return vt(e, t).intercept_(n);
}
function Nc(e, t) {
  if (t === void 0)
    return _n(e);
  if (ne(e) === !1)
    return !1;
  const n = e[E];
  if (n.lazyComputedKeys_?.has(t))
    return !0;
  if (!n.values_.has(t))
    return !1;
  const r = at(e, t);
  return _n(r);
}
function N_(e) {
  return __DEV__ && arguments.length > 1 ? y(
    "isComputed expects only 1 argument. Use isComputedProp to inspect the observability of a property"
  ) : Nc(e);
}
function $_(e, t) {
  return __DEV__ && !mt(t) ? y("isComputed expected a property name as second argument") : Nc(e, t);
}
function $c(e, t) {
  if (!e)
    return !1;
  if (t !== void 0) {
    if (__DEV__ && (re(e) || ve(e)))
      return y(
        "isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead."
      );
    if (ne(e)) {
      const n = e[E];
      return n.values_.has(t) || !!n.lazyComputedKeys_?.has(t) || !!n.lazyObservableKeys_?.has(t);
    }
    return !1;
  }
  return ne(e) || !!e[E] || Bo(e) || ki(e) || _n(e);
}
function gn(e) {
  return __DEV__ && arguments.length !== 1 && y(
    "isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property"
  ), $c(e);
}
function j_(e, t) {
  return __DEV__ && !mt(t) ? y("expected a property name as second argument") : $c(e, t);
}
function xr(e) {
  if (ne(e))
    return e[E].keys_();
  if (re(e) || te(e))
    return Array.from(e.keys());
  if (ve(e))
    return e.map((t, n) => n);
  y(5);
}
function L_(e) {
  if (ne(e))
    return xr(e).map((t) => e[t]);
  if (re(e))
    return xr(e).map((t) => e.get(t));
  if (te(e))
    return Array.from(e.values());
  if (ve(e))
    return e.slice();
  y(6);
}
function B_(e) {
  if (ne(e))
    return xr(e).map((t) => [t, e[t]]);
  if (re(e))
    return xr(e).map((t) => [t, e.get(t)]);
  if (te(e))
    return Array.from(e.entries());
  if (ve(e))
    return e.map((t, n) => [n, t]);
  y(7);
}
function jc(e, t, n) {
  if (arguments.length === 2 && !te(e)) {
    Ee();
    const r = t;
    try {
      for (let i in r)
        jc(e, i, r[i]);
    } finally {
      Oe();
    }
    return;
  }
  ne(e) ? e[E].set_(t, n) : re(e) ? e.set(t, n) : te(e) ? e.add(t) : ve(e) ? (typeof t != "number" && (t = parseInt(t, 10)), t < 0 && y(`Invalid index: '${t}'`), Ee(), t >= e.length && (e.length = t + 1), e[t] = n, Oe()) : y(8);
}
function q_(e, t) {
  ne(e) ? e[E].delete_(t) : re(e) || te(e) ? e.delete(t) : ve(e) ? (typeof t != "number" && (t = parseInt(t, 10)), e.splice(t, 1)) : y(9);
}
function Lc(e, t) {
  if (ne(e))
    return e[E].has_(t);
  if (re(e))
    return e.has(t);
  if (te(e))
    return e.has(t);
  if (ve(e))
    return t >= 0 && t < e.length;
  y(10);
}
function U_(e, t) {
  if (Lc(e, t)) {
    if (ne(e))
      return e[E].get_(t);
    if (re(e))
      return e.get(t);
    if (ve(e))
      return e[t];
    y(11);
  }
}
function k_(e, t, n) {
  if (ne(e))
    return e[E].defineProperty_(t, n);
  y(39);
}
function Bc(e) {
  if (ne(e))
    return e[E].ownKeys_();
  y(38);
}
function K_(e, t, n, r) {
  return W(n) ? F_(e, t, n, r) : W_(e, t, n);
}
function W_(e, t, n) {
  return vt(e).observe_(t, n);
}
function F_(e, t, n, r) {
  return vt(e, t).observe_(n, r);
}
function gi(e, t, n) {
  return e.set(t, n), n;
}
function Rn(e, t) {
  if (e == null || typeof e != "object" || e instanceof Date || !gn(e))
    return e;
  if (Ko(e) || _n(e))
    return Rn(e.get(), t);
  if (t.has(e))
    return t.get(e);
  if (ve(e)) {
    const n = gi(t, e, new Array(e.length));
    return e.forEach((r, i) => {
      n[i] = Rn(r, t);
    }), n;
  }
  if (te(e)) {
    const n = gi(t, e, /* @__PURE__ */ new Set());
    return e.forEach((r) => {
      n.add(Rn(r, t));
    }), n;
  }
  if (re(e)) {
    const n = gi(t, e, /* @__PURE__ */ new Map());
    return e.forEach((r, i) => {
      n.set(i, Rn(r, t));
    }), n;
  } else {
    const n = gi(t, e, {});
    return Bc(e).forEach((r) => {
      Kr.propertyIsEnumerable.call(e, r) && (n[r] = Rn(e[r], t));
    }), n;
  }
}
function H_(e, t) {
  return __DEV__ && t && y("toJS no longer supports options"), Rn(e, /* @__PURE__ */ new Map());
}
function qc(...e) {
  if (!__DEV__)
    return;
  let t = !1;
  typeof e[e.length - 1] == "boolean" && (t = e.pop());
  const n = G_(e);
  if (!n)
    return y(
      "'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly"
    );
  n.isTracing_ === tt.NONE && console.log(`[mobx.trace] '${n.name_}' tracing enabled`), n.isTracing_ = t ? tt.BREAK : tt.LOG;
}
function G_(e) {
  switch (e.length) {
    case 0:
      return g.trackingDerivation;
    case 1:
      return at(e[0]);
    case 2:
      return at(e[0], e[1]);
  }
}
function lt(e, t = void 0) {
  Ee();
  try {
    return e.apply(t);
  } finally {
    Oe();
  }
}
function Y_(e, t, n) {
  return arguments.length === 1 || t && typeof t == "object" ? X_(e, t) : Uc(e, t, n || {});
}
function Uc(e, t, n) {
  let r;
  if (typeof n.timeout == "number") {
    const o = new Error("WHEN_TIMEOUT");
    r = setTimeout(() => {
      if (!s[E].isDisposed)
        if (s(), n.onError)
          n.onError(o);
        else
          throw o;
    }, n.timeout);
  }
  n.name = __DEV__ ? n.name || "When@" + Ke() : "When";
  const i = kt(
    __DEV__ ? n.name + "-effect" : "When-effect",
    t
  );
  var s = Ho((o) => {
    ko(!1, e) && (o.dispose(), r && clearTimeout(r), i());
  }, n);
  return s;
}
function X_(e, t) {
  if (__DEV__ && t && t.onError)
    return y("the options 'onError' and 'promise' cannot be combined");
  if (t?.signal?.aborted)
    return Object.assign(Promise.reject(new Error("WHEN_ABORTED")), { cancel: () => null });
  let n, r;
  const i = new Promise((s, o) => {
    let a = Uc(e, s, { ...t, onError: o });
    n = () => {
      a(), o(new Error("WHEN_CANCELLED"));
    }, r = () => {
      a(), o(new Error("WHEN_ABORTED"));
    }, t?.signal?.addEventListener?.("abort", r);
  }).finally(() => t?.signal?.removeEventListener?.("abort", r));
  return i.cancel = n, i;
}
function nn(e) {
  return e[E];
}
const J_ = {
  has(e, t) {
    return __DEV__ && g.trackingDerivation && ur(
      "detect new properties using the 'in' operator. Use 'has' from 'mobx' instead."
    ), nn(e).has_(t);
  },
  get(e, t) {
    return nn(e).get_(t);
  },
  set(e, t, n) {
    return mt(t) ? (__DEV__ && !nn(e).values_.has(t) && ur(
      "add a new observable property through direct assignment. Use 'set' from 'mobx' instead."
    ), nn(e).set_(t, n, !0) ?? !0) : !1;
  },
  deleteProperty(e, t) {
    return __DEV__ && ur(
      "delete properties from an observable object. Use 'remove' from 'mobx' instead."
    ), mt(t) ? nn(e).delete_(t, !0) ?? !0 : !1;
  },
  defineProperty(e, t, n) {
    return __DEV__ && ur(
      "define property on an observable object. Use 'defineProperty' from 'mobx' instead."
    ), nn(e).defineProperty_(t, n) ?? !0;
  },
  ownKeys(e) {
    return __DEV__ && g.trackingDerivation && ur(
      "iterate keys to detect added / removed properties. Use 'keys' from 'mobx' instead."
    ), nn(e).ownKeys_();
  },
  preventExtensions(e) {
    y(13);
  }
};
function Z_(e, t) {
  return Qu(), e = vn(e, t), e[E].proxy_ ??= new Proxy(e, J_);
}
function Ge(e) {
  return e.interceptors_ !== void 0 && e.interceptors_.length > 0;
}
function Xr(e, t) {
  const n = e.interceptors_ || (e.interceptors_ = []);
  return n.push(t), Lo(() => {
    const r = n.indexOf(t);
    r !== -1 && n.splice(r, 1);
  });
}
function Ye(e, t) {
  const n = mn();
  try {
    const r = [...e.interceptors_ || []];
    for (let i = 0, s = r.length; i < s && (t = r[i](t), t && !t.type && y(14), !!t); i++)
      ;
    return t;
  } finally {
    Tt(n);
  }
}
function nt(e) {
  return e.changeListeners_ !== void 0 && e.changeListeners_.length > 0;
}
function Jr(e, t) {
  const n = e.changeListeners_ || (e.changeListeners_ = []);
  return n.push(t), Lo(() => {
    const r = n.indexOf(t);
    r !== -1 && n.splice(r, 1);
  });
}
function rt(e, t) {
  const n = mn();
  let r = e.changeListeners_;
  if (r) {
    r = r.slice();
    for (let i = 0, s = r.length; i < s; i++)
      r[i](t);
    Tt(n);
  }
}
function Q_(e, t, n) {
  return Xt(() => {
    const r = vn(e, n)[E];
    __DEV__ && t && e[we] && y(
      "makeObservable second arg must be nullish when using decorators. Mixing @decorator syntax with annotations is not supported."
    ), t ??= ih(e), Bn(t).forEach((i) => r.make_(i, t[i]));
  }), e;
}
const ks = Symbol("mobx-keys");
function ed(e, t, n) {
  return __DEV__ && (!Ae(e) && !Ae(Object.getPrototypeOf(e)) && y("'makeAutoObservable' can only be used for classes that don't have a superclass"), ne(e) && y("makeAutoObservable can only be used on objects not already made observable")), Ae(e) ? Yo(e, e, t, n) : (Xt(() => {
    const r = vn(e, n)[E];
    if (!e[ks]) {
      const i = Object.getPrototypeOf(e), s = /* @__PURE__ */ new Set([...Bn(e), ...Bn(i)]);
      s.delete("constructor"), s.delete(E), Wr(i, ks, s);
    }
    e[ks].forEach(
      (i) => r.make_(
        i,
        // must pass "undefined" for { key: undefined }
        t && i in t ? t[i] : !0
      )
    );
  }), e);
}
const tu = "splice", Qe = "update", td = 1e4, nd = {
  get(e, t) {
    const n = e[E];
    return t === E ? n : t === "length" ? n.getArrayLength_() : typeof t == "string" && !isNaN(t) ? n.get_(parseInt(t)) : Ne(Ki, t) ? Ki[t] : e[t];
  },
  set(e, t, n) {
    const r = e[E];
    return t === "length" && r.setArrayLength_(n), typeof t == "symbol" || isNaN(t) ? e[t] = n : r.set_(parseInt(t), n), !0;
  },
  preventExtensions() {
    y(15);
  }
};
class Jo {
  constructor(t = __DEV__ ? "ObservableArray@" + Ke() : "ObservableArray", n, r, i) {
    this.owned_ = r, this.legacyMode_ = i, this.atom_ = new Fe(t), this.enhancer_ = (s, o) => n(s, o, __DEV__ ? t + "[..]" : "ObservableArray[..]");
  }
  atom_;
  values_ = [];
  // this is the prop that gets proxied, so can't replace it!
  interceptors_;
  changeListeners_;
  enhancer_;
  dehancer;
  proxy_;
  lastKnownLength_ = 0;
  dehanceValue_(t) {
    return this.dehancer !== void 0 ? this.dehancer(t) : t;
  }
  dehanceValues_(t) {
    return this.dehancer !== void 0 && t.length > 0 ? t.map(this.dehancer) : t;
  }
  intercept_(t) {
    return Xr(this, t);
  }
  observe_(t, n = !1) {
    return n && t({
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: "splice",
      index: 0,
      added: this.values_.slice(),
      addedCount: this.values_.length,
      removed: [],
      removedCount: 0
    }), Jr(this, t);
  }
  getArrayLength_() {
    return this.atom_.reportObserved(), this.values_.length;
  }
  setArrayLength_(t) {
    (typeof t != "number" || isNaN(t) || t < 0) && y("Out of range: " + t);
    let n = this.values_.length;
    if (t !== n)
      if (t > n) {
        const r = new Array(t - n);
        for (let i = 0; i < t - n; i++)
          r[i] = void 0;
        this.spliceWithArray_(n, 0, r);
      } else
        this.spliceWithArray_(t, n - t);
  }
  updateArrayLength_(t, n) {
    t !== this.lastKnownLength_ && y(16), this.lastKnownLength_ += n, this.legacyMode_ && n > 0 && Hc(t + n + 1);
  }
  spliceWithArray_(t, n, r) {
    pt(this.atom_);
    const i = this.values_.length;
    if (t === void 0 ? t = 0 : t > i ? t = i : t < 0 && (t = Math.max(0, i + t)), arguments.length === 1 ? n = i - t : n == null ? n = 0 : n = Math.max(0, Math.min(n, i - t)), r === void 0 && (r = Li), Ge(this)) {
      const o = Ye(this, {
        object: this.proxy_,
        type: tu,
        index: t,
        removedCount: n,
        added: r
      });
      if (!o)
        return Li;
      n = o.removedCount, r = o.added;
    }
    if (r = r.length === 0 ? r : r.map((o) => this.enhancer_(o, void 0)), this.legacyMode_ || __DEV__) {
      const o = r.length - n;
      this.updateArrayLength_(i, o);
    }
    const s = this.spliceItemsIntoValues_(t, n, r);
    return (n !== 0 || r.length !== 0) && this.notifyArraySplice_(t, r, s), this.dehanceValues_(s);
  }
  spliceItemsIntoValues_(t, n, r) {
    if (r.length < td)
      return this.values_.splice(t, n, ...r);
    {
      const i = this.values_.slice(t, t + n);
      let s = this.values_.slice(t + n);
      this.values_.length += r.length - n;
      for (let o = 0; o < r.length; o++)
        this.values_[t + o] = r[o];
      for (let o = 0; o < s.length; o++)
        this.values_[t + r.length + o] = s[o];
      return i;
    }
  }
  notifyArrayChildUpdate_(t, n, r) {
    const i = !this.owned_ && ue(), s = nt(this), o = s || i ? {
      observableKind: "array",
      object: this.proxy_,
      type: Qe,
      debugObjectName: this.atom_.name_,
      index: t,
      newValue: n,
      oldValue: r
    } : null;
    __DEV__ && i && $e(o), this.atom_.reportChanged(), s && rt(this, o), __DEV__ && i && je();
  }
  notifyArraySplice_(t, n, r) {
    const i = !this.owned_ && ue(), s = nt(this), o = s || i ? {
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: tu,
      index: t,
      removed: r,
      added: n,
      removedCount: r.length,
      addedCount: n.length
    } : null;
    __DEV__ && i && $e(o), this.atom_.reportChanged(), s && rt(this, o), __DEV__ && i && je();
  }
  get_(t) {
    if (this.legacyMode_ && t >= this.values_.length) {
      console.warn(
        __DEV__ ? `[mobx.array] Attempt to read an array index (${t}) that is out of bounds (${this.values_.length}). Please check length first. Out of bound indices will not be tracked by MobX` : `[mobx] Out of bounds read: ${t}`
      );
      return;
    }
    return this.atom_.reportObserved(), this.dehanceValue_(this.values_[t]);
  }
  set_(t, n) {
    const r = this.values_;
    if (this.legacyMode_ && t > r.length && y(17, t, r.length), t < r.length) {
      pt(this.atom_);
      const i = r[t];
      if (Ge(this)) {
        const o = Ye(this, {
          type: Qe,
          object: this.proxy_,
          // since "this" is the real array we need to pass its proxy
          index: t,
          newValue: n
        });
        if (!o)
          return;
        n = o.newValue;
      }
      n = this.enhancer_(n, i), n !== i && (r[t] = n, this.notifyArrayChildUpdate_(t, n, i));
    } else {
      const i = new Array(t + 1 - r.length);
      for (let s = 0; s < i.length - 1; s++)
        i[s] = void 0;
      i[i.length - 1] = n, this.spliceWithArray_(r.length, 0, i);
    }
  }
}
function rd(e, t, n = __DEV__ ? "ObservableArray@" + Ke() : "ObservableArray", r = !1) {
  return Qu(), Xt(() => {
    const i = new Jo(n, t, r, !1);
    tc(i.values_, E, i);
    const s = new Proxy(i.values_, nd);
    return i.proxy_ = s, e && e.length && i.spliceWithArray_(0, 0, e), s;
  });
}
var Ki = {
  clear() {
    return this.splice(0);
  },
  replace(e) {
    const t = this[E];
    return t.spliceWithArray_(0, t.values_.length, e);
  },
  // Used by JSON.stringify
  toJSON() {
    return this.slice();
  },
  /*
   * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
   * since these functions alter the inner structure of the array, the have side effects.
   * Because the have side effects, they should not be used in computed function,
   * and for that reason the do not call dependencyState.notifyObserved
   */
  splice(e, t, ...n) {
    const r = this[E];
    switch (arguments.length) {
      case 0:
        return [];
      case 1:
        return r.spliceWithArray_(e);
      case 2:
        return r.spliceWithArray_(e, t);
    }
    return r.spliceWithArray_(e, t, n);
  },
  spliceWithArray(e, t, n) {
    return this[E].spliceWithArray_(
      e,
      t,
      n
    );
  },
  push(...e) {
    const t = this[E];
    return t.spliceWithArray_(t.values_.length, 0, e), t.values_.length;
  },
  pop() {
    return this.splice(Math.max(this[E].values_.length - 1, 0), 1)[0];
  },
  shift() {
    return this.splice(0, 1)[0];
  },
  unshift(...e) {
    const t = this[E];
    return t.spliceWithArray_(0, 0, e), t.values_.length;
  },
  reverse() {
    return g.trackingDerivation && y(37, "reverse"), this.replace(this.slice().reverse()), this;
  },
  sort() {
    g.trackingDerivation && y(37, "sort");
    const e = this.slice();
    return e.sort.apply(e, arguments), this.replace(e), this;
  },
  remove(e) {
    const t = this[E], n = t.dehanceValues_(t.values_).indexOf(e);
    return n > -1 ? (this.splice(n, 1), !0) : !1;
  }
};
q("at", We);
q("concat", We);
q("flat", We);
q("includes", We);
q("indexOf", We);
q("join", We);
q("lastIndexOf", We);
q("slice", We);
q("toString", We);
q("toLocaleString", We);
q("toSorted", We);
q("toSpliced", We);
q("with", We);
q("every", ut);
q("filter", ut);
q("find", ut);
q("findIndex", ut);
q("findLast", ut);
q("findLastIndex", ut);
q("flatMap", ut);
q("forEach", ut);
q("map", ut);
q("some", ut);
q("toReversed", ut);
q("reduce", kc);
q("reduceRight", kc);
function q(e, t) {
  typeof Array.prototype[e] == "function" && (Ki[e] = t(e));
}
function We(e) {
  return function() {
    const t = this[E];
    t.atom_.reportObserved();
    const n = t.dehanceValues_(t.values_);
    return n[e].apply(n, arguments);
  };
}
function ut(e) {
  return function(t, n) {
    const r = this[E];
    return r.atom_.reportObserved(), r.dehanceValues_(r.values_)[e]((s, o) => t.call(n, s, o, this));
  };
}
function kc(e) {
  return function() {
    const t = this[E];
    t.atom_.reportObserved();
    const n = t.dehanceValues_(t.values_), r = arguments[0];
    return arguments[0] = (i, s, o) => r(i, s, o, this), n[e].apply(n, arguments);
  };
}
const id = Yt(
  "ObservableArrayAdministration",
  Jo
);
function ve(e) {
  return cs(e) && id(e[E]);
}
const sd = {}, Bt = "add", Wi = "delete";
class Kc {
  constructor(t, n = hn, r = __DEV__ ? "ObservableMap@" + Ke() : "ObservableMap") {
    this.enhancer_ = n, this.name_ = r, W(Map) || y(18), Xt(() => {
      this.keysAtom_ = qo(__DEV__ ? `${this.name_}.keys()` : "ObservableMap.keys()"), this.data_ = /* @__PURE__ */ new Map(), this.hasMap_ = /* @__PURE__ */ new Map(), t && this.merge(t);
    });
  }
  [E] = sd;
  data_;
  hasMap_;
  // hasMap, not hashMap >-).
  keysAtom_;
  interceptors_;
  changeListeners_;
  dehancer;
  has_(t) {
    return this.data_.has(t);
  }
  has(t) {
    if (!g.trackingDerivation)
      return this.has_(t);
    let n = this.hasMap_.get(t);
    if (!n) {
      const r = n = new qt(
        this.has_(t),
        ls,
        __DEV__ ? `${this.name_}.${co(t)}?` : "ObservableMap.key?",
        !1
      );
      this.hasMap_.set(t, r), Go(r, () => this.hasMap_.delete(t));
    }
    return n.get();
  }
  set(t, n) {
    const r = this.has_(t);
    if (Ge(this)) {
      const i = Ye(this, {
        type: r ? Qe : Bt,
        object: this,
        newValue: n,
        name: t
      });
      if (!i)
        return this;
      n = i.newValue;
    }
    return r ? this.updateValue_(t, n) : this.addValue_(t, n), this;
  }
  delete(t) {
    if (pt(this.keysAtom_), Ge(this) && !Ye(this, {
      type: Wi,
      object: this,
      name: t
    }))
      return !1;
    if (this.has_(t)) {
      const n = ue(), r = nt(this), i = r || n ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: Wi,
        object: this,
        oldValue: this.data_.get(t).value_,
        name: t
      } : null;
      return __DEV__ && n && $e(i), lt(() => {
        this.keysAtom_.reportChanged(), this.hasMap_.get(t)?.setNewValue_(!1), this.data_.get(t).setNewValue_(void 0), this.data_.delete(t);
      }), r && rt(this, i), __DEV__ && n && je(), !0;
    }
    return !1;
  }
  updateValue_(t, n) {
    const r = this.data_.get(t);
    if (n = r.prepareNewValue_(n), n !== g.UNCHANGED) {
      const i = ue(), s = nt(this), o = s || i ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: Qe,
        object: this,
        oldValue: r.value_,
        name: t,
        newValue: n
      } : null;
      __DEV__ && i && $e(o), r.setNewValue_(n), s && rt(this, o), __DEV__ && i && je();
    }
  }
  addValue_(t, n) {
    pt(this.keysAtom_), lt(() => {
      const o = new qt(
        n,
        this.enhancer_,
        __DEV__ ? `${this.name_}.${co(t)}` : "ObservableMap.key",
        !1
      );
      this.data_.set(t, o), n = o.value_, this.hasMap_.get(t)?.setNewValue_(!0), this.keysAtom_.reportChanged();
    });
    const r = ue(), i = nt(this), s = i || r ? {
      observableKind: "map",
      debugObjectName: this.name_,
      type: Bt,
      object: this,
      name: t,
      newValue: n
    } : null;
    __DEV__ && r && $e(s), i && rt(this, s), __DEV__ && r && je();
  }
  get(t) {
    return this.has(t) ? this.dehanceValue_(this.data_.get(t).get()) : this.dehanceValue_(void 0);
  }
  getOrInsert(t, n) {
    return this.has(t) || this.set(t, n), this.get(t);
  }
  getOrInsertComputed(t, n) {
    return this.has(t) || this.set(t, n(t)), this.get(t);
  }
  dehanceValue_(t) {
    return this.dehancer !== void 0 ? this.dehancer(t) : t;
  }
  keys() {
    return this.keysAtom_.reportObserved(), this.data_.keys();
  }
  values() {
    const t = this, n = this.keys();
    return nu({
      next() {
        const { done: r, value: i } = n.next();
        return {
          done: r,
          value: r ? void 0 : t.get(i)
        };
      }
    });
  }
  entries() {
    const t = this, n = this.keys();
    return nu({
      next() {
        const { done: r, value: i } = n.next();
        return {
          done: r,
          value: r ? void 0 : [i, t.get(i)]
        };
      }
    });
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  forEach(t, n) {
    for (const [r, i] of this)
      t.call(n, i, r, this);
  }
  /** Merge another object into this object, returns this. */
  merge(t) {
    return re(t) && (t = new Map(t)), lt(() => {
      Ae(t) ? th(t).forEach(
        (n) => this.set(n, t[n])
      ) : Array.isArray(t) ? t.forEach(([n, r]) => this.set(n, r)) : er(t) ? (eh(t) || y(19, t), t.forEach((n, r) => this.set(r, n))) : t != null && y(20, t);
    }), this;
  }
  clear() {
    lt(() => {
      Wo(() => {
        for (const t of this.keys())
          this.delete(t);
      });
    });
  }
  replace(t) {
    return lt(() => {
      const n = od(t), r = /* @__PURE__ */ new Map();
      let i = !1;
      for (const s of this.data_.keys())
        if (!n.has(s))
          if (this.delete(s))
            i = !0;
          else {
            const a = this.data_.get(s);
            r.set(s, a);
          }
      for (const [s, o] of n.entries()) {
        const a = this.data_.has(s);
        if (this.set(s, o), this.data_.has(s)) {
          const u = this.data_.get(s);
          r.set(s, u), a || (i = !0);
        }
      }
      if (!i)
        if (this.data_.size !== r.size)
          this.keysAtom_.reportChanged();
        else {
          const s = this.data_.keys(), o = r.keys();
          let a = s.next(), u = o.next();
          for (; !a.done; ) {
            if (a.value !== u.value) {
              this.keysAtom_.reportChanged();
              break;
            }
            a = s.next(), u = o.next();
          }
        }
      this.data_ = r;
    }), this;
  }
  get size() {
    return this.keysAtom_.reportObserved(), this.data_.size;
  }
  toString() {
    return "[object ObservableMap]";
  }
  toJSON() {
    return Array.from(this);
  }
  get [Symbol.toStringTag]() {
    return "Map";
  }
  /**
   * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
   * for callback details
   */
  observe_(t, n) {
    return __DEV__ && n === !0 && y("`observe` doesn't support fireImmediately=true in combination with maps."), Jr(this, t);
  }
  intercept_(t) {
    return Xr(this, t);
  }
}
var re = Yt("ObservableMap", Kc);
function nu(e) {
  return e[Symbol.toStringTag] = "MapIterator", ta(e);
}
function od(e) {
  if (er(e) || re(e))
    return e;
  if (Array.isArray(e))
    return new Map(e);
  if (Ae(e)) {
    const t = /* @__PURE__ */ new Map();
    for (const n in e)
      t.set(n, e[n]);
    return t;
  } else
    return y(21, e);
}
const ad = {};
class Zo {
  constructor(t, n = hn, r = __DEV__ ? "ObservableSet@" + Ke() : "ObservableSet") {
    this.name_ = r, W(Set) || y(22), this.enhancer_ = (i, s) => n(i, s, r), Xt(() => {
      this.atom_ = qo(this.name_), t && this.replace(t);
    });
  }
  [E] = ad;
  data_ = /* @__PURE__ */ new Set();
  atom_;
  changeListeners_;
  interceptors_;
  dehancer;
  enhancer_;
  dehanceValue_(t) {
    return this.dehancer !== void 0 ? this.dehancer(t) : t;
  }
  clear() {
    lt(() => {
      Wo(() => {
        for (const t of this.data_.values())
          this.delete(t);
      });
    });
  }
  forEach(t, n) {
    for (const r of this)
      t.call(n, r, r, this);
  }
  get size() {
    return this.atom_.reportObserved(), this.data_.size;
  }
  add(t) {
    if (pt(this.atom_), Ge(this)) {
      const n = Ye(this, {
        type: Bt,
        object: this,
        newValue: t
      });
      if (!n)
        return this;
      t = n.newValue;
    }
    if (!this.has(t)) {
      lt(() => {
        this.data_.add(this.enhancer_(t, void 0)), this.atom_.reportChanged();
      });
      const n = __DEV__ && ue(), r = nt(this), i = r || n ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: Bt,
        object: this,
        newValue: t
      } : null;
      n && __DEV__ && $e(i), r && rt(this, i), n && __DEV__ && je();
    }
    return this;
  }
  delete(t) {
    if (Ge(this) && !Ye(this, {
      type: Wi,
      object: this,
      oldValue: t
    }))
      return !1;
    if (this.has(t)) {
      const n = __DEV__ && ue(), r = nt(this), i = r || n ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: Wi,
        object: this,
        oldValue: t
      } : null;
      return n && __DEV__ && $e(i), lt(() => {
        this.atom_.reportChanged(), this.data_.delete(t);
      }), r && rt(this, i), n && __DEV__ && je(), !0;
    }
    return !1;
  }
  has(t) {
    return this.atom_.reportObserved(), this.data_.has(this.dehanceValue_(t));
  }
  entries() {
    const t = this.values();
    return ru({
      next() {
        const { value: n, done: r } = t.next();
        return r ? { value: void 0, done: r } : { value: [n, n], done: r };
      }
    });
  }
  keys() {
    return this.values();
  }
  values() {
    this.atom_.reportObserved();
    const t = this, n = this.data_.values();
    return ru({
      next() {
        const { value: r, done: i } = n.next();
        return i ? { value: void 0, done: i } : { value: t.dehanceValue_(r), done: i };
      }
    });
  }
  intersection(t) {
    return It(t) && !te(t) ? t.intersection(this) : new Set(this).intersection(t);
  }
  union(t) {
    return It(t) && !te(t) ? t.union(this) : new Set(this).union(t);
  }
  difference(t) {
    return new Set(this).difference(t);
  }
  symmetricDifference(t) {
    return It(t) && !te(t) ? t.symmetricDifference(this) : new Set(this).symmetricDifference(t);
  }
  isSubsetOf(t) {
    return new Set(this).isSubsetOf(t);
  }
  isSupersetOf(t) {
    return new Set(this).isSupersetOf(t);
  }
  isDisjointFrom(t) {
    return It(t) && !te(t) ? t.isDisjointFrom(this) : new Set(this).isDisjointFrom(t);
  }
  replace(t) {
    return te(t) && (t = new Set(t)), lt(() => {
      Array.isArray(t) ? (this.clear(), t.forEach((n) => this.add(n))) : It(t) ? (this.clear(), t.forEach((n) => this.add(n))) : t != null && y("Cannot initialize set from " + t);
    }), this;
  }
  observe_(t, n) {
    return __DEV__ && n === !0 && y("`observe` doesn't support fireImmediately=true in combination with sets."), Jr(this, t);
  }
  intercept_(t) {
    return Xr(this, t);
  }
  toJSON() {
    return Array.from(this);
  }
  toString() {
    return "[object ObservableSet]";
  }
  [Symbol.iterator]() {
    return this.values();
  }
  get [Symbol.toStringTag]() {
    return "Set";
  }
}
var te = Yt("ObservableSet", Zo);
function ru(e) {
  return e[Symbol.toStringTag] = "SetIterator", ta(e);
}
const iu = /* @__PURE__ */ Object.create(null), su = "remove";
class yo {
  constructor(t, n = /* @__PURE__ */ new Map(), r, i = Ch) {
    this.target_ = t, this.values_ = n, this.name_ = r, this.defaultAnnotation_ = i, this.keysAtom_ = new Fe(__DEV__ ? `${this.name_}.keys` : "ObservableObject.keys"), this.isPlainObject_ = Ae(this.target_), __DEV__ && !Gc(this.defaultAnnotation_) && y("defaultAnnotation must be valid annotation"), __DEV__ && (this.appliedAnnotations_ = {});
  }
  keysAtom_;
  changeListeners_;
  interceptors_;
  proxy_;
  isPlainObject_;
  appliedAnnotations_;
  pendingKeys_;
  lazyComputedKeys_;
  lazyObservableKeys_;
  getObservablePropValue_(t) {
    return (this.values_.get(t) ?? this.materializeLazyComputed_(t) ?? this.materializeLazyObservable_(t)).get();
  }
  materializeLazyComputed_(t) {
    const n = this.lazyComputedKeys_?.get(t);
    if (!n)
      return;
    this.lazyComputedKeys_.delete(t), this.lazyComputedKeys_.size === 0 && (this.lazyComputedKeys_ = void 0);
    const r = n();
    return this.values_.set(t, r), r;
  }
  materializeLazyObservable_(t) {
    const n = this.lazyObservableKeys_?.get(t);
    if (!n)
      return;
    this.lazyObservableKeys_.delete(t), this.lazyObservableKeys_.size === 0 && (this.lazyObservableKeys_ = void 0);
    const r = n();
    return this.values_.set(t, r), r;
  }
  setObservablePropValue_(t, n) {
    const r = this.values_.get(t) ?? this.materializeLazyComputed_(t) ?? this.materializeLazyObservable_(t);
    if (r instanceof X)
      return r.set(n), !0;
    if (Ge(this)) {
      const i = Ye(this, {
        type: Qe,
        object: this.proxy_ || this.target_,
        name: t,
        newValue: n
      });
      if (!i)
        return null;
      n = i.newValue;
    }
    if (n = r.prepareNewValue_(n), n !== g.UNCHANGED) {
      const i = nt(this), s = __DEV__ && ue(), o = i || s ? {
        type: Qe,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        oldValue: r.value_,
        name: t,
        newValue: n
      } : null;
      __DEV__ && s && $e(o), r.setNewValue_(n), i && rt(this, o), __DEV__ && s && je();
    }
    return !0;
  }
  get_(t) {
    return g.trackingDerivation && !Ne(this.target_, t) && this.has_(t), this.target_[t];
  }
  /**
   * @param {PropertyKey} key
   * @param {any} value
   * @param {Annotation|boolean} annotation true - use default annotation, false - copy as is
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */
  set_(t, n, r = !1) {
    return Ne(this.target_, t) ? this.values_.has(t) ? this.setObservablePropValue_(t, n) : r ? Reflect.set(this.target_, t, n) : (this.target_[t] = n, !0) : this.extend_(
      t,
      { value: n, enumerable: !0, writable: !0, configurable: !0 },
      this.defaultAnnotation_,
      r
    );
  }
  // Trap for "in"
  has_(t) {
    if (!g.trackingDerivation)
      return t in this.target_;
    this.pendingKeys_ ||= /* @__PURE__ */ new Map();
    let n = this.pendingKeys_.get(t);
    return n || (n = new qt(
      t in this.target_,
      ls,
      __DEV__ ? `${this.name_}.${co(t)}?` : "ObservableObject.key?",
      !1
    ), this.pendingKeys_.set(t, n)), n.get();
  }
  /**
   * @param {PropertyKey} key
   * @param {Annotation|boolean} annotation true - use default annotation, false - ignore prop
   */
  make_(t, n) {
    if (n === !0 && (n = this.defaultAnnotation_), n === !1)
      return;
    if (uu(this, n, t), !(t in this.target_)) {
      if (this.target_[we]?.[t])
        return;
      y(1, n.annotationType_, `${this.name_}.${t.toString()}`);
    }
    let r = this.target_;
    for (; r && r !== Kr; ) {
      const i = ji(r, t);
      if (i) {
        const s = n.make_(this, t, i, r);
        if (s === H.Cancel)
          return;
        if (s === H.Break)
          break;
      }
      r = Object.getPrototypeOf(r);
    }
    au(this, n, t);
  }
  /**
   * @param {PropertyKey} key
   * @param {PropertyDescriptor} descriptor
   * @param {Annotation|boolean} annotation true - use default annotation, false - copy as is
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */
  extend_(t, n, r, i = !1) {
    if (r === !0 && (r = this.defaultAnnotation_), r === !1)
      return this.defineProperty_(t, n, i);
    uu(this, r, t);
    const s = r.extend_(this, t, n, i);
    return s && au(this, r, t), s;
  }
  /**
   * @param {PropertyKey} key
   * @param {PropertyDescriptor} descriptor
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */
  defineProperty_(t, n, r = !1) {
    pt(this.keysAtom_);
    try {
      Ee();
      const i = this.delete_(t);
      if (!i)
        return i;
      if (Ge(this)) {
        const s = Ye(this, {
          object: this.proxy_ || this.target_,
          name: t,
          type: Bt,
          newValue: n.value
        });
        if (!s)
          return null;
        const { newValue: o } = s;
        n.value !== o && (n = {
          ...n,
          value: o
        });
      }
      if (r) {
        if (!Reflect.defineProperty(this.target_, t, n))
          return !1;
      } else
        yt(this.target_, t, n);
      this.notifyPropertyAddition_(t, n.value);
    } finally {
      Oe();
    }
    return !0;
  }
  // If original descriptor becomes relevant, move this to annotation directly
  defineObservableProperty_(t, n, r, i = !1) {
    pt(this.keysAtom_);
    try {
      Ee();
      const s = this.delete_(t);
      if (!s)
        return s;
      if (Ge(this)) {
        const f = Ye(this, {
          object: this.proxy_ || this.target_,
          name: t,
          type: Bt,
          newValue: n
        });
        if (!f)
          return null;
        n = f.newValue;
      }
      const o = ou(t), a = {
        configurable: g.safeDescriptors ? this.isPlainObject_ : !0,
        enumerable: !0,
        get: o.get,
        set: o.set
      };
      if (i) {
        if (!Reflect.defineProperty(this.target_, t, a))
          return !1;
      } else
        yt(this.target_, t, a);
      const u = new qt(
        n,
        r,
        __DEV__ ? `${this.name_}.${t.toString()}` : "ObservableObject.key",
        !1
      );
      this.values_.set(t, u), this.notifyPropertyAddition_(t, u.value_);
    } finally {
      Oe();
    }
    return !0;
  }
  // If original descriptor becomes relevant, move this to annotation directly
  defineComputedProperty_(t, n, r = !1) {
    pt(this.keysAtom_);
    try {
      Ee();
      const i = this.delete_(t);
      if (!i)
        return i;
      if (Ge(this) && !Ye(this, {
        object: this.proxy_ || this.target_,
        name: t,
        type: Bt,
        newValue: void 0
      }))
        return null;
      n.name ||= __DEV__ ? `${this.name_}.${t.toString()}` : "ObservableObject.key", n.context = this.proxy_ || this.target_;
      const s = ou(t), o = {
        configurable: g.safeDescriptors ? this.isPlainObject_ : !0,
        enumerable: !1,
        get: s.get,
        set: s.set
      };
      if (r) {
        if (!Reflect.defineProperty(this.target_, t, o))
          return !1;
      } else
        yt(this.target_, t, o);
      this.values_.set(t, new X(n)), this.notifyPropertyAddition_(t, void 0);
    } finally {
      Oe();
    }
    return !0;
  }
  /**
   * @param {PropertyKey} key
   * @param {PropertyDescriptor} descriptor
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */
  delete_(t, n = !1) {
    if (pt(this.keysAtom_), !Ne(this.target_, t))
      return !0;
    if (Ge(this) && !Ye(this, {
      object: this.proxy_ || this.target_,
      name: t,
      type: su
    }))
      return null;
    try {
      Ee();
      const r = nt(this), i = __DEV__ && ue(), s = this.values_.get(t);
      let o;
      if (!s && (r || i) && (o = ji(this.target_, t)?.value), n) {
        if (!Reflect.deleteProperty(this.target_, t))
          return !1;
      } else
        delete this.target_[t];
      if (__DEV__ && delete this.appliedAnnotations_[t], s && (this.values_.delete(t), s instanceof qt && (o = s.value_), wc(s)), this.keysAtom_.reportChanged(), this.pendingKeys_?.get(t)?.set(t in this.target_), r || i) {
        const a = {
          type: su,
          observableKind: "object",
          object: this.proxy_ || this.target_,
          debugObjectName: this.name_,
          oldValue: o,
          name: t
        };
        __DEV__ && i && $e(a), r && rt(this, a), __DEV__ && i && je();
      }
    } finally {
      Oe();
    }
    return !0;
  }
  /**
   * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
   * for callback details
   */
  observe_(t, n) {
    return __DEV__ && n === !0 && y("`observe` doesn't support the fire immediately property for observable objects."), Jr(this, t);
  }
  intercept_(t) {
    return Xr(this, t);
  }
  notifyPropertyAddition_(t, n) {
    const r = nt(this), i = __DEV__ && ue();
    if (r || i) {
      const s = r || i ? {
        type: Bt,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        name: t,
        newValue: n
      } : null;
      __DEV__ && i && $e(s), r && rt(this, s), __DEV__ && i && je();
    }
    this.pendingKeys_?.get(t)?.set(!0), this.keysAtom_.reportChanged();
  }
  ownKeys_() {
    return this.keysAtom_.reportObserved(), Bn(this.target_);
  }
  keys_() {
    return this.keysAtom_.reportObserved(), Object.keys(this.target_);
  }
}
function vn(e, t) {
  if (__DEV__ && t && ne(e) && y("Options can't be provided for already observable objects."), Ne(e, E))
    return __DEV__ && !(vt(e) instanceof yo) && y(
      `Cannot convert '${Tr(e)}' into observable object:
The target is already observable of different type.
Extending builtins is not supported.`
    ), e;
  __DEV__ && !Object.isExtensible(e) && y("Cannot make the designated object observable; it is not extensible");
  const n = t?.name ?? (__DEV__ ? `${Ae(e) ? "ObservableObject" : e.constructor.name}@${Ke()}` : "ObservableObject"), r = new yo(
    e,
    /* @__PURE__ */ new Map(),
    String(n),
    kh(t)
  );
  return Wr(e, E, r), e;
}
const ud = Yt(
  "ObservableObjectAdministration",
  yo
);
function ou(e) {
  return iu[e] || (iu[e] = {
    get() {
      return this[E].getObservablePropValue_(e);
    },
    set(t) {
      return this[E].setObservablePropValue_(e, t);
    }
  });
}
function ne(e) {
  return cs(e) ? ud(e[E]) : !1;
}
function au(e, t, n) {
  __DEV__ && (e.appliedAnnotations_[n] = t), delete e.target_[we]?.[n];
}
function uu(e, t, n) {
  if (__DEV__ && !Gc(t) && y(`Cannot annotate '${e.name_}.${n.toString()}': Invalid annotation.`), __DEV__ && !Bi(t) && Ne(e.appliedAnnotations_, n)) {
    const r = `${e.name_}.${n.toString()}`, i = e.appliedAnnotations_[n].annotationType_, s = t.annotationType_;
    y(
      `Cannot apply '${s}' to '${r}':
The field is already annotated with '${i}'.
Re-annotating fields is not allowed.
Use 'override' annotation for methods overridden by subclass.`
    );
  }
}
const cd = Fc(0), fd = (() => {
  let e = !1;
  const t = {};
  return Object.defineProperty(t, "0", {
    set: () => {
      e = !0;
    }
  }), Object.create(t)[0] = 1, e === !1;
})();
let Ks = 0;
class Wc {
}
function ld(e, t) {
  Object.setPrototypeOf ? Object.setPrototypeOf(e.prototype, t) : e.prototype.__proto__ !== void 0 ? e.prototype.__proto__ = t : e.prototype = t;
}
ld(Wc, Array.prototype);
class Qo extends Wc {
  constructor(t, n, r = __DEV__ ? "ObservableArray@" + Ke() : "ObservableArray", i = !1) {
    super(), Xt(() => {
      const s = new Jo(r, n, i, !0);
      s.proxy_ = this, tc(this, E, s), t && t.length && this.spliceWithArray(0, 0, t), fd && Object.defineProperty(this, "0", cd);
    });
  }
  concat(...t) {
    return this[E].atom_.reportObserved(), Array.prototype.concat.apply(
      this.slice(),
      //@ts-ignore
      t.map((n) => ve(n) ? n.slice() : n)
    );
  }
  get length() {
    return this[E].getArrayLength_();
  }
  set length(t) {
    this[E].setArrayLength_(t);
  }
  get [Symbol.toStringTag]() {
    return "Array";
  }
  [Symbol.iterator]() {
    const t = this;
    let n = 0;
    return ta({
      next() {
        return n < t.length ? { value: t[n++], done: !1 } : { done: !0, value: void 0 };
      }
    });
  }
}
Object.entries(Ki).forEach(([e, t]) => {
  e !== "concat" && Wr(Qo.prototype, e, t);
});
function Fc(e) {
  return {
    enumerable: !1,
    configurable: !0,
    get: function() {
      return this[E].get_(e);
    },
    set: function(t) {
      this[E].set_(e, t);
    }
  };
}
function hd(e) {
  yt(Qo.prototype, "" + e, Fc(e));
}
function Hc(e) {
  if (e > Ks) {
    for (let t = Ks; t < e + 100; t++)
      hd(t);
    Ks = e;
  }
}
Hc(1e3);
function _d(e, t, n) {
  return new Qo(e, t, n);
}
function at(e, t) {
  if (typeof e == "object" && e !== null) {
    if (ve(e))
      return t !== void 0 && y(23), e[E].atom_;
    if (te(e))
      return e.atom_;
    if (re(e)) {
      if (t === void 0)
        return e.keysAtom_;
      const n = e.data_.get(t) || e.hasMap_.get(t);
      return n || y(25, t, Tr(e)), n;
    }
    if (t && !e[E] && e[t], ne(e)) {
      if (!t)
        return y(26);
      const n = e[E], r = n.values_.get(t) ?? n.materializeLazyComputed_(t) ?? n.materializeLazyObservable_(t);
      return r || y(27, t, Tr(e)), r;
    }
    if (Bo(e) || _n(e) || ki(e))
      return e;
  } else if (W(e) && ki(e[E]))
    return e[E];
  y(28);
}
function vt(e, t) {
  if (e || y(29), t !== void 0)
    return vt(at(e, t));
  if (Bo(e) || _n(e) || ki(e) || re(e) || te(e))
    return e;
  if (e[E])
    return e[E];
  y(24, e);
}
function Tr(e, t) {
  let n;
  if (t !== void 0)
    n = at(e, t);
  else {
    if (Kt(e))
      return e.name;
    ne(e) || re(e) || te(e) ? n = vt(e) : n = at(e);
  }
  return n.name_;
}
function Xt(e) {
  const t = mn(), n = _s(!0);
  Ee();
  try {
    return e();
  } finally {
    Oe(), ds(n), Tt(t);
  }
}
const cu = Kr.toString;
function ea(e, t, n = -1) {
  return mo(e, t, n);
}
function mo(e, t, n, r, i) {
  if (e === t)
    return e !== 0 || 1 / e === 1 / t;
  if (e == null || t == null)
    return !1;
  if (e !== e)
    return t !== t;
  const s = typeof e;
  if (s !== "function" && s !== "object" && typeof t != "object")
    return !1;
  const o = cu.call(e);
  if (o !== cu.call(t))
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
  e = fu(e), t = fu(t);
  const a = o === "[object Array]";
  if (!a) {
    if (typeof e != "object" || typeof t != "object")
      return !1;
    const f = e.constructor, c = t.constructor;
    if (f !== c && !(W(f) && f instanceof f && W(c) && c instanceof c) && "constructor" in e && "constructor" in t)
      return !1;
  }
  if (n === 0)
    return !1;
  n < 0 && (n = -1), r = r || [], i = i || [];
  let u = r.length;
  for (; u--; )
    if (r[u] === e)
      return i[u] === t;
  if (r.push(e), i.push(t), a) {
    if (u = e.length, u !== t.length)
      return !1;
    for (; u--; )
      if (!mo(e[u], t[u], n - 1, r, i))
        return !1;
  } else {
    const f = Object.keys(e), c = f.length;
    if (Object.keys(t).length !== c)
      return !1;
    for (let l = 0; l < c; l++) {
      const _ = f[l];
      if (!(Ne(t, _) && mo(e[_], t[_], n - 1, r, i)))
        return !1;
    }
  }
  return r.pop(), i.pop(), !0;
}
function fu(e) {
  return ve(e) ? e.slice() : er(e) || re(e) || It(e) || te(e) ? Array.from(e.entries()) : e;
}
const dd = us(), pd = dd.Iterator?.prototype || {};
function ta(e) {
  return e[Symbol.iterator] = gd, Object.assign(Object.create(pd), e);
}
function gd() {
  return this;
}
var H = /* @__PURE__ */ ((e) => (e[e.Cancel = 0] = "Cancel", e[e.Break = 1] = "Break", e[e.Continue = 2] = "Continue", e))(H || {});
function Gc(e) {
  return (
    // Can be function
    e instanceof Object && typeof e.annotationType_ == "string" && W(e.make_) && W(e.extend_)
  );
}
["Symbol", "Map", "Set"].forEach((e) => {
  typeof us()[e] > "u" && y(`MobX requires global '${e}' to be available or polyfilled`);
});
typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ == "object" && __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
  spy: Dc,
  extras: {
    getDebugName: Tr
  },
  $mobx: E
});
const jg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $mobx: E,
  FlowCancellationError: Xo,
  ObservableSet: Zo,
  _allowStateChanges: ko,
  _allowStateChangesInsideComputed: Qa,
  _allowStateReadsEnd: zn,
  _allowStateReadsStart: ps,
  _autoAction: qn,
  _endAction: pc,
  _getAdministration: vt,
  _getGlobalState: r_,
  _interceptReads: C_,
  _isComputingDerivation: Jh,
  _resetGlobalState: i_,
  _startAction: dc,
  action: Lt,
  autorun: Ho,
  comparer: ln,
  computed: Yr,
  configure: A_,
  createAtom: qo,
  defineProperty: k_,
  entries: B_,
  extendObservable: Yo,
  flow: pn,
  flowResult: M_,
  get: U_,
  getAtom: at,
  getDebugName: Tr,
  getDependencyTree: Pc,
  getObserverTree: D_,
  has: Lc,
  intercept: P_,
  isAction: Kt,
  isBoxedObservable: Ko,
  isComputed: N_,
  isComputedProp: $_,
  isFlow: Un,
  isFlowCancellationError: T_,
  isObservable: gn,
  isObservableArray: ve,
  isObservableMap: re,
  isObservableObject: ne,
  isObservableProp: j_,
  isObservableSet: te,
  keys: xr,
  makeAutoObservable: ed,
  makeObservable: Q_,
  observable: ie,
  observe: K_,
  onBecomeObserved: Mc,
  onBecomeUnobserved: Go,
  onReactionError: f_,
  override: lh,
  ownKeys: Bc,
  reaction: m_,
  remove: q_,
  runInAction: Qa,
  set: jc,
  spy: Dc,
  toJS: H_,
  trace: qc,
  transaction: lt,
  untracked: Wo,
  values: L_,
  when: Y_
}, Symbol.toStringTag, { value: "Module" })), Ws = () => Math.random().toString(36).substring(7).split("").join("."), Ut = {
  INIT: `@@redux/INIT${/* @__PURE__ */ Ws()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ Ws()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${Ws()}`
};
function gs(e) {
  if (typeof e != "object" || e === null) return !1;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function bd(e) {
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
  if (vd(e)) return "date";
  if (md(e)) return "error";
  const n = yd(e);
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
function yd(e) {
  return typeof e.constructor == "function" ? e.constructor.name : null;
}
function md(e) {
  return e instanceof Error || typeof e.message == "string" && e.constructor && typeof e.constructor.stackTraceLimit == "number";
}
function vd(e) {
  return e instanceof Date ? !0 : typeof e.toDateString == "function" && typeof e.getDate == "function" && typeof e.setDate == "function";
}
function At(e) {
  let t = typeof e;
  return process.env.NODE_ENV !== "production" && (t = bd(e)), t;
}
const lu = typeof Symbol == "function" && Symbol.observable || "@@observable";
function na(e, t, n) {
  if (typeof e != "function")
    throw new Error(
      `Expected the root reducer to be a function. Instead, received: '${At(
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
        `Expected the enhancer to be a function. Instead, received: '${At(
          n
        )}'`
      );
    return n(na)(
      e,
      t
    );
  }
  let r = e, i = t, s = /* @__PURE__ */ new Map(), o = s, a = 0, u = !1;
  function f() {
    o === s && (o = /* @__PURE__ */ new Map(), s.forEach((b, S) => {
      o.set(S, b);
    }));
  }
  function c() {
    if (u)
      throw new Error(
        "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store."
      );
    return i;
  }
  function l(b) {
    if (typeof b != "function")
      throw new Error(
        `Expected the listener to be a function. Instead, received: '${At(
          b
        )}'`
      );
    if (u)
      throw new Error(
        "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details."
      );
    let S = !0;
    f();
    const O = a++;
    return o.set(O, b), function() {
      if (S) {
        if (u)
          throw new Error(
            "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details."
          );
        S = !1, f(), o.delete(O), s = null;
      }
    };
  }
  function _(b) {
    if (!gs(b))
      throw new Error(
        `Actions must be plain objects. Instead, the actual type was: '${At(
          b
        )}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`
      );
    if (typeof b.type > "u")
      throw new Error(
        'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.'
      );
    if (typeof b.type != "string")
      throw new Error(
        `Action "type" property must be a string. Instead, the actual type was: '${At(
          b.type
        )}'. Value was: '${String(b.type)}' (stringified)`
      );
    if (u)
      throw new Error("Reducers may not dispatch actions.");
    try {
      u = !0, i = r(i, b);
    } finally {
      u = !1;
    }
    return (s = o).forEach((O) => {
      O();
    }), b;
  }
  function d(b) {
    if (typeof b != "function")
      throw new Error(
        `Expected the nextReducer to be a function. Instead, received: '${At(
          b
        )}'`
      );
    r = b, _({ type: Ut.REPLACE });
  }
  function h() {
    const b = l;
    return {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(S) {
        if (typeof S != "object" || S === null)
          throw new TypeError(
            `Expected the observer to be an object. Instead, received: '${At(
              S
            )}'`
          );
        function O() {
          const m = S;
          m.next && m.next(c());
        }
        return O(), { unsubscribe: b(O) };
      },
      [lu]() {
        return this;
      }
    };
  }
  return _({ type: Ut.INIT }), {
    dispatch: _,
    subscribe: l,
    getState: c,
    replaceReducer: d,
    [lu]: h
  };
}
function Sd(e, t, n) {
  return na(e, t, n);
}
function hu(e) {
  typeof console < "u" && typeof console.error == "function" && console.error(e);
  try {
    throw new Error(e);
  } catch {
  }
}
function wd(e, t, n, r) {
  const i = Object.keys(t), s = n && n.type === Ut.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
  if (i.length === 0)
    return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
  if (!gs(e))
    return `The ${s} has unexpected type of "${At(
      e
    )}". Expected argument to be an object with the following keys: "${i.join('", "')}"`;
  const o = Object.keys(e).filter(
    (a) => !t.hasOwnProperty(a) && !r[a]
  );
  if (o.forEach((a) => {
    r[a] = !0;
  }), !(n && n.type === Ut.REPLACE) && o.length > 0)
    return `Unexpected ${o.length > 1 ? "keys" : "key"} "${o.join('", "')}" found in ${s}. Expected to find one of the known reducer keys instead: "${i.join('", "')}". Unexpected keys will be ignored.`;
}
function Ed(e) {
  Object.keys(e).forEach((t) => {
    const n = e[t];
    if (typeof n(void 0, { type: Ut.INIT }) > "u")
      throw new Error(
        `The slice reducer for key "${t}" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`
      );
    if (typeof n(void 0, {
      type: Ut.PROBE_UNKNOWN_ACTION()
    }) > "u")
      throw new Error(
        `The slice reducer for key "${t}" returned undefined when probed with a random type. Don't try to handle '${Ut.INIT}' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.`
      );
  });
}
function Od(e) {
  const t = Object.keys(e), n = {};
  for (let o = 0; o < t.length; o++) {
    const a = t[o];
    process.env.NODE_ENV !== "production" && typeof e[a] > "u" && hu(`No reducer provided for key "${a}"`), typeof e[a] == "function" && (n[a] = e[a]);
  }
  const r = Object.keys(n);
  let i;
  process.env.NODE_ENV !== "production" && (i = {});
  let s;
  try {
    Ed(n);
  } catch (o) {
    s = o;
  }
  return function(a = {}, u) {
    if (s)
      throw s;
    if (process.env.NODE_ENV !== "production") {
      const l = wd(
        a,
        n,
        u,
        i
      );
      l && hu(l);
    }
    let f = !1;
    const c = {};
    for (let l = 0; l < r.length; l++) {
      const _ = r[l], d = n[_], h = a[_], p = d(h, u);
      if (typeof p > "u") {
        const b = u && u.type;
        throw new Error(
          `When called with an action of type ${b ? `"${String(b)}"` : "(unknown type)"}, the slice reducer for key "${_}" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.`
        );
      }
      c[_] = p, f = f || p !== h;
    }
    return f = f || r.length !== Object.keys(a).length, f ? c : a;
  };
}
function _u(e, t) {
  return function(...n) {
    return t(e.apply(this, n));
  };
}
function Ad(e, t) {
  if (typeof e == "function")
    return _u(e, t);
  if (typeof e != "object" || e === null)
    throw new Error(
      `bindActionCreators expected an object or a function, but instead received: '${At(
        e
      )}'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    );
  const n = {};
  for (const r in e) {
    const i = e[r];
    typeof i == "function" && (n[r] = _u(i, t));
  }
  return n;
}
function Yc(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce(
    (t, n) => (...r) => t(n(...r))
  );
}
function Dd(...e) {
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
    return s = Yc(...a)(i.dispatch), {
      ...i,
      dispatch: s
    };
  };
}
function Id(e) {
  return gs(e) && "type" in e && typeof e.type == "string";
}
const Lg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  __DO_NOT_USE__ActionTypes: Ut,
  applyMiddleware: Dd,
  bindActionCreators: Ad,
  combineReducers: Od,
  compose: Yc,
  createStore: na,
  isAction: Id,
  isPlainObject: gs,
  legacy_createStore: Sd
}, Symbol.toStringTag, { value: "Module" })), Fi = "@@__IMMUTABLE_INDEXED__@@";
function Ie(e) {
  return !!(e && // @ts-expect-error: maybeIndexed is typed as `{}`, need to change in 6.0 to `maybeIndexed && typeof maybeIndexed === 'object' && IS_INDEXED_SYMBOL in maybeIndexed`
  e[Fi]);
}
const Hi = "@@__IMMUTABLE_KEYED__@@";
function L(e) {
  return !!(e && // @ts-expect-error: maybeKeyed is typed as `{}`, need to change in 6.0 to `maybeKeyed && typeof maybeKeyed === 'object' && IS_KEYED_SYMBOL in maybeKeyed`
  e[Hi]);
}
function bs(e) {
  return L(e) || Ie(e);
}
const Xc = "@@__IMMUTABLE_ITERABLE__@@";
function xe(e) {
  return !!(e && // @ts-expect-error: maybeCollection is typed as `{}`, need to change in 6.0 to `maybeCollection && typeof maybeCollection === 'object' && IS_COLLECTION_SYMBOL in maybeCollection`
  e[Xc]);
}
class oe {
  constructor(t) {
    return xe(t) ? t : le(t);
  }
}
class qe extends oe {
  constructor(t) {
    return L(t) ? t : Zt(t);
  }
}
class it extends oe {
  constructor(t) {
    return Ie(t) ? t : Re(t);
  }
}
class ht extends oe {
  constructor(t) {
    return xe(t) && !bs(t) ? t : Qt(t);
  }
}
oe.Keyed = qe;
oe.Indexed = it;
oe.Set = ht;
const tr = 0, Ue = 1, ke = 2, vo = typeof Symbol == "function" && Symbol.iterator, Jc = "@@iterator", ys = vo || Jc;
let P = class {
  // TODO activate when using babel as buble does not support static class fields
  // static KEYS: number;
  // static VALUES: number;
  // static ENTRIES: number;
  // next: () => IteratorResult<V>;
  // inspect!: () => string;
  // toSource!: () => string;
  constructor(t) {
    this.next = t;
  }
  toString() {
    return "[Iterator]";
  }
};
P.KEYS = tr;
P.VALUES = Ue;
P.ENTRIES = ke;
P.prototype.inspect = P.prototype.toSource = function() {
  return this.toString();
};
P.prototype[ys] = function() {
  return this;
};
function U(e, t, n, r) {
  const i = e === tr ? t : e === Ue ? n : [t, n];
  return r ? r.value = i : r = {
    // @ts-expect-error ensure value is not undefined
    value: i,
    done: !1
  }, r;
}
function fe() {
  return { value: void 0, done: !0 };
}
function ra(e) {
  return Array.isArray(e) ? !0 : !!ms(e);
}
function du(e) {
  return !!(e && // @ts-expect-error: maybeIterator is typed as `{}`
  typeof e.next == "function");
}
function So(e) {
  const t = ms(e);
  return t && t.call(e);
}
function ms(e) {
  const t = e && // @ts-expect-error: maybeIterator is typed as `{}`
  (vo && e[vo] || // @ts-expect-error: maybeIterator is typed as `{}`
  e[Jc]);
  if (typeof t == "function")
    return t;
}
function xd(e) {
  const t = ms(e);
  return t && t === e.entries;
}
function Td(e) {
  const t = ms(e);
  return t && t === e.keys;
}
const Zr = "delete", $ = 5, ze = 1 << $, ge = ze - 1, M = {};
function wo() {
  return { value: !1 };
}
function Xe(e) {
  e && (e.value = !0);
}
function ia() {
}
function kn(e) {
  return e.size === void 0 && (e.size = e.__iterate(Zc)), e.size;
}
function Wt(e, t) {
  if (typeof t != "number") {
    const n = t >>> 0;
    if ("" + n !== t || n === 4294967295)
      return NaN;
    t = n;
  }
  return t < 0 ? kn(e) + t : t;
}
function Zc() {
  return !0;
}
function Qr(e, t, n) {
  return (e === 0 && !ef(e) || n !== void 0 && e <= -n) && (t === void 0 || n !== void 0 && t >= n);
}
function nr(e, t) {
  return Qc(e, t, 0);
}
function ei(e, t) {
  return Qc(e, t, t);
}
function Qc(e, t, n) {
  return e === void 0 ? n : ef(e) ? t === 1 / 0 ? t : Math.max(0, t + e) | 0 : t === void 0 || t === e ? e : Math.min(t, e) | 0;
}
function ef(e) {
  return e < 0 || e === 0 && 1 / e === -1 / 0;
}
const tf = "@@__IMMUTABLE_RECORD__@@";
function Jt(e) {
  return !!(e && // @ts-expect-error: maybeRecord is typed as `{}`, need to change in 6.0 to `maybeRecord && typeof maybeRecord === 'object' && IS_RECORD_SYMBOL in maybeRecord`
  e[tf]);
}
function Ze(e) {
  return xe(e) || Jt(e);
}
const Ft = "@@__IMMUTABLE_ORDERED__@@";
function st(e) {
  return !!(e && // @ts-expect-error: maybeOrdered is typed as `{}`, need to change in 6.0 to `maybeOrdered && typeof maybeOrdered === 'object' && IS_ORDERED_SYMBOL in maybeOrdered`
  e[Ft]);
}
const nf = "@@__IMMUTABLE_SEQ__@@";
function vs(e) {
  return !!(e && // @ts-expect-error: maybeSeq is typed as `{}`, need to change in 6.0 to `maybeSeq && typeof maybeSeq === 'object' && MAYBE_SEQ_SYMBOL in maybeSeq`
  e[nf]);
}
const rr = Object.prototype.hasOwnProperty;
function sa(e) {
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
class le extends oe {
  constructor(t) {
    return t == null ? aa() : Ze(t) ? t.toSeq() : Md(t);
  }
  toSeq() {
    return this;
  }
  toString() {
    return this.__toString("Seq {", "}");
  }
  cacheResult() {
    return !this._cache && this.__iterateUncached && (this._cache = this.entrySeq().toArray(), this.size = this._cache.length), this;
  }
  // abstract __iterateUncached(fn, reverse)
  __iterate(t, n) {
    const r = this._cache;
    if (r) {
      const i = r.length;
      let s = 0;
      for (; s !== i; ) {
        const o = r[n ? i - ++s : s++];
        if (t(o[1], o[0], this) === !1)
          break;
      }
      return s;
    }
    return this.__iterateUncached(t, n);
  }
  // abstract __iteratorUncached(type, reverse)
  __iterator(t, n) {
    const r = this._cache;
    if (r) {
      const i = r.length;
      let s = 0;
      return new P(() => {
        if (s === i)
          return fe();
        const o = r[n ? i - ++s : s++];
        return U(t, o[0], o[1]);
      });
    }
    return this.__iteratorUncached(t, n);
  }
}
class Zt extends le {
  constructor(t) {
    return t == null ? aa().toKeyedSeq() : xe(t) ? L(t) ? t.toSeq() : t.fromEntrySeq() : Jt(t) ? t.toSeq() : ua(t);
  }
  toKeyedSeq() {
    return this;
  }
}
class Re extends le {
  constructor(t) {
    return t == null ? aa() : xe(t) ? L(t) ? t.entrySeq() : t.toIndexedSeq() : Jt(t) ? t.toSeq().entrySeq() : rf(t);
  }
  static of() {
    return Re(arguments);
  }
  toIndexedSeq() {
    return this;
  }
  toString() {
    return this.__toString("Seq [", "]");
  }
}
class Qt extends le {
  constructor(t) {
    return (xe(t) && !bs(t) ? t : Re(t)).toSetSeq();
  }
  static of() {
    return Qt(arguments);
  }
  toSetSeq() {
    return this;
  }
}
le.isSeq = vs;
le.Keyed = Zt;
le.Set = Qt;
le.Indexed = Re;
le.prototype[nf] = !0;
class Kn extends Re {
  constructor(t) {
    this._array = t, this.size = t.length;
  }
  get(t, n) {
    return this.has(t) ? this._array[Wt(this, t)] : n;
  }
  __iterate(t, n) {
    const r = this._array, i = r.length;
    let s = 0;
    for (; s !== i; ) {
      const o = n ? i - ++s : s++;
      if (t(r[o], o, this) === !1)
        break;
    }
    return s;
  }
  __iterator(t, n) {
    const r = this._array, i = r.length;
    let s = 0;
    return new P(() => {
      if (s === i)
        return fe();
      const o = n ? i - ++s : s++;
      return U(t, o, r[o]);
    });
  }
}
class oa extends Zt {
  constructor(t) {
    const n = Object.keys(t).concat(
      Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(t) : []
    );
    this._object = t, this._keys = n, this.size = n.length;
  }
  get(t, n) {
    return n !== void 0 && !this.has(t) ? n : this._object[t];
  }
  has(t) {
    return rr.call(this._object, t);
  }
  __iterate(t, n) {
    const r = this._object, i = this._keys, s = i.length;
    let o = 0;
    for (; o !== s; ) {
      const a = i[n ? s - ++o : o++];
      if (t(r[a], a, this) === !1)
        break;
    }
    return o;
  }
  __iterator(t, n) {
    const r = this._object, i = this._keys, s = i.length;
    let o = 0;
    return new P(() => {
      if (o === s)
        return fe();
      const a = i[n ? s - ++o : o++];
      return U(t, a, r[a]);
    });
  }
}
oa.prototype[Ft] = !0;
class Rd extends Re {
  constructor(t) {
    this._collection = t, this.size = t.length || t.size;
  }
  __iterateUncached(t, n) {
    if (n)
      return this.cacheResult().__iterate(t, n);
    const r = this._collection, i = So(r);
    let s = 0;
    if (du(i)) {
      let o;
      for (; !(o = i.next()).done && t(o.value, s++, this) !== !1; )
        ;
    }
    return s;
  }
  __iteratorUncached(t, n) {
    if (n)
      return this.cacheResult().__iterator(t, n);
    const r = this._collection, i = So(r);
    if (!du(i))
      return new P(fe);
    let s = 0;
    return new P(() => {
      const o = i.next();
      return o.done ? o : U(t, s++, o.value);
    });
  }
}
let pu;
function aa() {
  return pu || (pu = new Kn([]));
}
function ua(e) {
  const t = ca(e);
  if (t)
    return t.fromEntrySeq();
  if (typeof e == "object")
    return new oa(e);
  throw new TypeError(
    "Expected Array or collection object of [k, v] entries, or keyed object: " + e
  );
}
function rf(e) {
  const t = ca(e);
  if (t)
    return t;
  throw new TypeError(
    "Expected Array or collection object of values: " + e
  );
}
function Md(e) {
  const t = ca(e);
  if (t)
    return xd(e) ? t.fromEntrySeq() : Td(e) ? t.toSetSeq() : t;
  if (typeof e == "object")
    return new oa(e);
  throw new TypeError(
    "Expected Array or collection object of values, or keyed object: " + e
  );
}
function ca(e) {
  return sa(e) ? new Kn(e) : ra(e) ? new Rd(e) : void 0;
}
function ti() {
  return this.__ensureOwner();
}
function ni() {
  return this.__ownerID ? this : this.__ensureOwner(new ia());
}
const cr = typeof Math.imul == "function" && Math.imul(4294967295, 2) === -2 ? Math.imul : function(t, n) {
  t |= 0, n |= 0;
  const r = t & 65535, i = n & 65535;
  return r * i + ((t >>> 16) * i + r * (n >>> 16) << 16 >>> 0) | 0;
};
function Ss(e) {
  return e >>> 1 & 1073741824 | e & 3221225471;
}
const Cd = Object.prototype.valueOf;
function pe(e) {
  if (e == null)
    return gu(e);
  if (typeof e.hashCode == "function")
    return Ss(e.hashCode(e));
  const t = Ld(e);
  if (t == null)
    return gu(t);
  switch (typeof t) {
    case "boolean":
      return t ? 1108378657 : 1108378656;
    case "number":
      return Pd(t);
    case "string":
      return t.length > Bd ? Vd(t) : Eo(t);
    case "object":
    case "function":
      return $d(t);
    case "symbol":
      return Nd(t);
    default:
      if (typeof t.toString == "function")
        return Eo(t.toString());
      throw new Error("Value type " + typeof t + " cannot be hashed.");
  }
}
function gu(e) {
  return e === null ? 1108378658 : (
    /* undefined */
    1108378659
  );
}
function Pd(e) {
  if (e !== e || e === 1 / 0)
    return 0;
  let t = e | 0;
  for (t !== e && (t ^= e * 4294967295); e > 4294967295; )
    e /= 4294967295, t ^= e;
  return Ss(t);
}
function Vd(e) {
  let t = Ys[e];
  return t === void 0 && (t = Eo(e), Gs === qd && (Gs = 0, Ys = {}), Gs++, Ys[e] = t), t;
}
function Eo(e) {
  let t = 0;
  for (let n = 0; n < e.length; n++)
    t = 31 * t + e.charCodeAt(n) | 0;
  return Ss(t);
}
const zd = (Math.random() * 1048576 | 1) % 1048576 || 40503;
function Fs(e) {
  if (typeof e != "string")
    return pe(e);
  let t = 0;
  for (let n = 0; n < e.length; n++)
    t = zd * t + e.charCodeAt(n) | 0;
  return t;
}
function Nd(e) {
  let t = mu[e];
  return t !== void 0 || (t = sf(), mu[e] = t), t;
}
function $d(e) {
  let t;
  if (Oo && (t = Ao.get(e), t !== void 0) || (t = e[sn], t !== void 0) || !yu && (t = e.propertyIsEnumerable && e.propertyIsEnumerable[sn], t !== void 0 || (t = jd(e), t !== void 0)))
    return t;
  if (t = sf(), Oo)
    Ao.set(e, t);
  else {
    if (bu !== void 0 && bu(e) === !1)
      throw new Error("Non-extensible objects are not allowed as keys.");
    if (yu)
      Object.defineProperty(e, sn, {
        enumerable: !1,
        configurable: !1,
        writable: !1,
        value: t
      });
    else if (e.propertyIsEnumerable !== void 0 && e.propertyIsEnumerable === e.constructor.prototype.propertyIsEnumerable)
      e.propertyIsEnumerable = function() {
        return this.constructor.prototype.propertyIsEnumerable.apply(
          this,
          // eslint-disable-next-line prefer-rest-params
          arguments
        );
      }, e.propertyIsEnumerable[sn] = t;
    else if (e.nodeType !== void 0)
      e[sn] = t;
    else
      throw new Error("Unable to set a non-enumerable property on object.");
  }
  return t;
}
const bu = Object.isExtensible, yu = function() {
  try {
    return Object.defineProperty({}, "@", {}), !0;
  } catch {
    return !1;
  }
}();
function jd(e) {
  if (e && e.nodeType > 0)
    switch (e.nodeType) {
      case 1:
        return e.uniqueID;
      case 9:
        return e.documentElement && e.documentElement.uniqueID;
    }
}
function Ld(e) {
  return e.valueOf !== Cd && typeof e.valueOf == "function" ? (
    // @ts-expect-error weird the "obj" parameter as `valueOf` should not have a parameter
    e.valueOf(e)
  ) : e;
}
function sf() {
  const e = ++Hs;
  return Hs & 1073741824 && (Hs = 0), e;
}
const Oo = typeof WeakMap == "function";
let Ao;
Oo && (Ao = /* @__PURE__ */ new WeakMap());
const mu = /* @__PURE__ */ Object.create(null);
let Hs = 0, sn = "__immutablehash__";
typeof Symbol == "function" && (sn = Symbol(sn));
const Bd = 16, qd = 255;
let Gs = 0, Ys = {};
class ws extends Zt {
  constructor(t, n) {
    this._iter = t, this._useKeys = n, this.size = t.size;
  }
  get(t, n) {
    return this._iter.get(t, n);
  }
  has(t) {
    return this._iter.has(t);
  }
  valueSeq() {
    return this._iter.valueSeq();
  }
  reverse() {
    const t = fa(this, !0);
    return this._useKeys || (t.valueSeq = () => this._iter.toSeq().reverse()), t;
  }
  map(t, n) {
    const r = ff(this, t, n);
    return this._useKeys || (r.valueSeq = () => this._iter.toSeq().map(t, n)), r;
  }
  __iterate(t, n) {
    return this._iter.__iterate((r, i) => t(r, i, this), n);
  }
  __iterator(t, n) {
    return this._iter.__iterator(t, n);
  }
}
ws.prototype[Ft] = !0;
class of extends Re {
  constructor(t) {
    this._iter = t, this.size = t.size;
  }
  includes(t) {
    return this._iter.includes(t);
  }
  __iterate(t, n) {
    let r = 0;
    return n && kn(this), this._iter.__iterate(
      (i) => t(i, n ? this.size - ++r : r++, this),
      n
    );
  }
  __iterator(t, n) {
    const r = this._iter.__iterator(Ue, n);
    let i = 0;
    return n && kn(this), new P(() => {
      const s = r.next();
      return s.done ? s : U(
        t,
        n ? this.size - ++i : i++,
        s.value,
        s
      );
    });
  }
}
class af extends Qt {
  constructor(t) {
    this._iter = t, this.size = t.size;
  }
  has(t) {
    return this._iter.includes(t);
  }
  __iterate(t, n) {
    return this._iter.__iterate((r) => t(r, r, this), n);
  }
  __iterator(t, n) {
    const r = this._iter.__iterator(Ue, n);
    return new P(() => {
      const i = r.next();
      return i.done ? i : U(t, i.value, i.value, i);
    });
  }
}
class uf extends Zt {
  constructor(t) {
    this._iter = t, this.size = t.size;
  }
  entrySeq() {
    return this._iter.toSeq();
  }
  __iterate(t, n) {
    return this._iter.__iterate((r) => {
      if (r) {
        Su(r);
        const i = xe(r);
        return t(
          i ? r.get(1) : r[1],
          i ? r.get(0) : r[0],
          this
        );
      }
    }, n);
  }
  __iterator(t, n) {
    const r = this._iter.__iterator(Ue, n);
    return new P(() => {
      for (; ; ) {
        const i = r.next();
        if (i.done)
          return i;
        const s = i.value;
        if (s) {
          Su(s);
          const o = xe(s);
          return U(
            t,
            o ? s.get(0) : s[0],
            o ? s.get(1) : s[1],
            i
          );
        }
      }
    });
  }
}
of.prototype.cacheResult = ws.prototype.cacheResult = af.prototype.cacheResult = uf.prototype.cacheResult = _a;
function cf(e) {
  const t = wt(e);
  return t._iter = e, t.size = e.size, t.flip = () => e, t.reverse = function() {
    const n = e.reverse.apply(this);
    return n.flip = () => e.reverse(), n;
  }, t.has = (n) => e.includes(n), t.includes = (n) => e.has(n), t.cacheResult = _a, t.__iterateUncached = function(n, r) {
    return e.__iterate((i, s) => n(s, i, this) !== !1, r);
  }, t.__iteratorUncached = function(n, r) {
    if (n === ke) {
      const i = e.__iterator(n, r);
      return new P(() => {
        const s = i.next();
        if (!s.done) {
          const o = s.value[0];
          s.value[0] = s.value[1], s.value[1] = o;
        }
        return s;
      });
    }
    return e.__iterator(
      n === Ue ? tr : Ue,
      r
    );
  }, t;
}
function ff(e, t, n) {
  const r = wt(e);
  return r.size = e.size, r.has = (i) => e.has(i), r.get = (i, s) => {
    const o = e.get(i, M);
    return o === M ? s : t.call(n, o, i, e);
  }, r.__iterateUncached = function(i, s) {
    return e.__iterate(
      (o, a, u) => i(t.call(n, o, a, u), a, this) !== !1,
      s
    );
  }, r.__iteratorUncached = function(i, s) {
    const o = e.__iterator(ke, s);
    return new P(() => {
      const a = o.next();
      if (a.done)
        return a;
      const u = a.value, f = u[0];
      return U(
        i,
        f,
        t.call(n, u[1], f, e),
        a
      );
    });
  }, r;
}
function fa(e, t) {
  const n = wt(e);
  return n._iter = e, n.size = e.size, n.reverse = () => e, e.flip && (n.flip = function() {
    const r = cf(e);
    return r.reverse = () => e.flip(), r;
  }), n.get = (r, i) => e.get(t ? r : -1 - r, i), n.has = (r) => e.has(t ? r : -1 - r), n.includes = (r) => e.includes(r), n.cacheResult = _a, n.__iterate = function(r, i) {
    let s = 0;
    return i && kn(e), e.__iterate(
      (o, a) => r(o, t ? a : i ? this.size - ++s : s++, this),
      !i
    );
  }, n.__iterator = (r, i) => {
    let s = 0;
    i && kn(e);
    const o = e.__iterator(ke, !i);
    return new P(() => {
      const a = o.next();
      if (a.done)
        return a;
      const u = a.value;
      return U(
        r,
        // `__iterator` is an arrow function, so `this` is not the reversed
        // sequence here — read `reversedSequence.size` explicitly.
        t ? u[0] : i ? n.size - ++s : s++,
        u[1],
        a
      );
    });
  }, n;
}
function lf(e, t, n, r) {
  const i = wt(e);
  return r && (i.has = (s) => {
    const o = e.get(s, M);
    return o !== M && !!t.call(n, o, s, e);
  }, i.get = (s, o) => {
    const a = e.get(s, M);
    return a !== M && t.call(n, a, s, e) ? a : o;
  }), i.__iterateUncached = function(s, o) {
    let a = 0;
    return e.__iterate((u, f, c) => {
      if (t.call(n, u, f, c))
        return a++, s(u, r ? f : a - 1, this);
    }, o), a;
  }, i.__iteratorUncached = function(s, o) {
    const a = e.__iterator(ke, o);
    let u = 0;
    return new P(() => {
      for (; ; ) {
        const f = a.next();
        if (f.done)
          return f;
        const c = f.value, l = c[0], _ = c[1];
        if (t.call(n, _, l, e))
          return U(s, r ? l : u++, _, f);
      }
    });
  }, i;
}
function Ud(e, t, n) {
  const r = Sn().asMutable();
  return e.__iterate((i, s) => {
    r.update(t.call(n, i, s, e), 0, (o) => o + 1);
  }), r.asImmutable();
}
function kd(e, t, n) {
  const r = L(e), i = (st(e) ? St() : Sn()).asMutable();
  e.__iterate((o, a) => {
    i.update(
      t.call(n, o, a, e),
      (u) => (u = u || [], u.push(r ? [a, o] : o), u)
    );
  });
  const s = ha(e);
  return i.map((o) => N(e, s(o))).asImmutable();
}
function Kd(e, t, n) {
  const r = L(e), i = [[], []];
  e.__iterate((o, a) => {
    i[t.call(n, o, a, e) ? 1 : 0].push(
      r ? [a, o] : o
    );
  });
  const s = ha(e);
  return i.map((o) => N(e, s(o)));
}
function la(e, t, n, r) {
  const i = e.size;
  if (Qr(t, n, i))
    return e;
  if (typeof i > "u" && (t < 0 || n < 0))
    return la(e.toSeq().cacheResult(), t, n, r);
  const s = nr(t, i), a = ei(n, i) - s;
  let u;
  a === a && (u = a < 0 ? 0 : a);
  const f = wt(e);
  return f.size = u === 0 ? u : e.size && u || void 0, !r && vs(e) && u >= 0 && (f.get = function(c, l) {
    return c = Wt(this, c), c >= 0 && c < u ? e.get(c + s, l) : l;
  }), f.__iterateUncached = function(c, l) {
    if (u === 0)
      return 0;
    if (l)
      return this.cacheResult().__iterate(c, l);
    let _ = 0, d = !0, h = 0;
    return e.__iterate((p, b) => {
      if (!(d && (d = _++ < s)))
        return h++, c(p, r ? b : h - 1, this) !== !1 && h !== u;
    }), h;
  }, f.__iteratorUncached = function(c, l) {
    if (u !== 0 && l)
      return this.cacheResult().__iterator(c, l);
    if (u === 0)
      return new P(fe);
    const _ = e.__iterator(c, l);
    let d = 0, h = 0;
    return new P(() => {
      for (; d++ < s; )
        _.next();
      if (++h > u)
        return fe();
      const p = _.next();
      return r || c === Ue || p.done ? p : c === tr ? U(c, h - 1, void 0, p) : U(c, h - 1, p.value[1], p);
    });
  }, f;
}
function Wd(e, t, n) {
  const r = wt(e);
  return r.__iterateUncached = function(i, s) {
    if (s)
      return this.cacheResult().__iterate(i, s);
    let o = 0;
    return e.__iterate(
      (a, u, f) => t.call(n, a, u, f) && ++o && i(a, u, this)
    ), o;
  }, r.__iteratorUncached = function(i, s) {
    if (s)
      return this.cacheResult().__iterator(i, s);
    const o = e.__iterator(ke, s);
    let a = !0;
    return new P(() => {
      if (!a)
        return fe();
      const u = o.next();
      if (u.done)
        return u;
      const f = u.value, c = f[0], l = f[1];
      return t.call(n, l, c, this) ? i === ke ? u : U(i, c, l, u) : (a = !1, fe());
    });
  }, r;
}
function hf(e, t, n, r) {
  const i = wt(e);
  return i.__iterateUncached = function(s, o) {
    if (o)
      return this.cacheResult().__iterate(s, o);
    let a = !0, u = 0;
    return e.__iterate((f, c, l) => {
      if (!(a && (a = t.call(n, f, c, l))))
        return u++, s(f, r ? c : u - 1, this);
    }), u;
  }, i.__iteratorUncached = function(s, o) {
    if (o)
      return this.cacheResult().__iterator(s, o);
    const a = e.__iterator(ke, o);
    let u = !0, f = 0;
    return new P(() => {
      let c, l, _;
      do {
        if (c = a.next(), c.done)
          return r || s === Ue ? c : s === tr ? U(s, f++, void 0, c) : U(s, f++, c.value[1], c);
        const d = c.value;
        l = d[0], _ = d[1], u && (u = t.call(n, _, l, this));
      } while (u);
      return s === ke ? c : U(s, l, _, c);
    });
  }, i;
}
class Fd extends le {
  constructor(t) {
    this._wrappedIterables = t.flatMap((n) => n._wrappedIterables ? n._wrappedIterables : [n]), this.size = this._wrappedIterables.reduce((n, r) => {
      if (n !== void 0) {
        const i = r.size;
        if (i !== void 0)
          return n + i;
      }
    }, 0), this[Hi] = this._wrappedIterables[0][Hi], this[Fi] = this._wrappedIterables[0][Fi], this[Ft] = this._wrappedIterables[0][Ft];
  }
  __iterateUncached(t, n) {
    if (this._wrappedIterables.length === 0)
      return;
    if (n)
      return this.cacheResult().__iterate(t, n);
    let r = 0;
    const i = L(this), s = i ? ke : Ue;
    let o = this._wrappedIterables[r].__iterator(
      s,
      n
    ), a = !0, u = 0;
    for (; a; ) {
      let f = o.next();
      for (; f.done; ) {
        if (r++, r === this._wrappedIterables.length)
          return u;
        o = this._wrappedIterables[r].__iterator(
          s,
          n
        ), f = o.next();
      }
      a = (i ? t(f.value[1], f.value[0], this) : t(f.value, u, this)) !== !1, u++;
    }
    return u;
  }
  __iteratorUncached(t, n) {
    if (this._wrappedIterables.length === 0)
      return new P(fe);
    if (n)
      return this.cacheResult().__iterator(t, n);
    let r = 0, i = this._wrappedIterables[r].__iterator(
      t,
      n
    );
    return new P(() => {
      let s = i.next();
      for (; s.done; ) {
        if (r++, r === this._wrappedIterables.length)
          return s;
        i = this._wrappedIterables[r].__iterator(
          t,
          n
        ), s = i.next();
      }
      return s;
    });
  }
}
function Hd(e, t) {
  const n = L(e), r = [e].concat(t).map((i) => (xe(i) ? n && (i = qe(i)) : i = n ? ua(i) : rf(Array.isArray(i) ? i : [i]), i)).filter((i) => i.size !== 0);
  if (r.length === 0)
    return e;
  if (r.length === 1) {
    const i = r[0];
    if (i === e || n && L(i) || Ie(e) && Ie(i))
      return i;
  }
  return new Fd(r);
}
function _f(e, t, n) {
  const r = wt(e);
  return r.__iterateUncached = function(i, s) {
    if (s)
      return this.cacheResult().__iterate(i, s);
    let o = 0, a = !1;
    function u(f, c) {
      f.__iterate((l, _) => ((!t || c < t) && xe(l) ? u(l, c + 1) : (o++, i(l, n ? _ : o - 1, r) === !1 && (a = !0)), !a), s);
    }
    return u(e, 0), o;
  }, r.__iteratorUncached = function(i, s) {
    if (s)
      return this.cacheResult().__iterator(i, s);
    let o = e.__iterator(i, s);
    const a = [];
    let u = 0;
    return new P(() => {
      for (; o; ) {
        const f = o.next();
        if (f.done !== !1) {
          o = a.pop();
          continue;
        }
        let c = f.value;
        if (i === ke && (c = c[1]), (!t || a.length < t) && xe(c))
          a.push(o), o = c.__iterator(i, s);
        else
          return n ? f : U(i, u++, c, f);
      }
      return fe();
    });
  }, r;
}
function Gd(e, t, n) {
  const r = ha(e);
  return e.toSeq().map((i, s) => r(t.call(n, i, s, e))).flatten(!0);
}
function Yd(e, t) {
  const n = wt(e);
  return n.size = e.size && e.size * 2 - 1, n.__iterateUncached = function(r, i) {
    let s = 0;
    return e.__iterate(
      (o) => (!s || r(t, s++, this) !== !1) && r(o, s++, this) !== !1,
      i
    ), s;
  }, n.__iteratorUncached = function(r, i) {
    const s = e.__iterator(Ue, i);
    let o = 0, a;
    return new P(() => (!a || o % 2) && (a = s.next(), a.done) ? a : o % 2 ? U(r, o++, t) : U(r, o++, a.value, a));
  }, n;
}
function Wn(e, t, n) {
  t || (t = df);
  const r = L(e);
  let i = 0;
  const s = e.toSeq().map((o, a) => [a, o, i++, n ? n(o, a, e) : o]).valueSeq().toArray();
  return s.sort((o, a) => t(o[3], a[3]) || o[2] - a[2]).forEach(
    r ? (o, a) => {
      s[a].length = 2;
    } : (o, a) => {
      s[a] = o[1];
    }
  ), r ? Zt(s) : Ie(e) ? Re(s) : Qt(s);
}
function bi(e, t, n) {
  if (t || (t = df), n) {
    const r = e.toSeq().map((i, s) => [i, n(i, s, e)]).reduce((i, s) => vu(t, i[1], s[1]) ? s : i);
    return r && r[0];
  }
  return e.reduce((r, i) => vu(t, r, i) ? i : r);
}
function vu(e, t, n) {
  const r = e(n, t);
  return r === 0 && n !== t && (n == null || n !== n) || r > 0;
}
function yi(e, t, n, r) {
  const i = wt(e), s = new Kn(n).map((o) => o.size);
  return i.size = r ? s.max() : s.min(), i.__iterate = function(o, a) {
    const u = this.__iterator(Ue, a);
    let f, c = 0;
    for (; !(f = u.next()).done && o(f.value, c++, this) !== !1; )
      ;
    return c;
  }, i.__iteratorUncached = function(o, a) {
    const u = n.map(
      (l) => (l = oe(l), So(a ? l.reverse() : l))
    );
    let f = 0, c = !1;
    return new P(() => {
      let l;
      return c || (l = u.map((_) => _.next()), c = r ? l.every((_) => _.done) : l.some((_) => _.done)), c ? fe() : U(
        o,
        f++,
        t.apply(
          null,
          l.map((_) => _.value)
        )
      );
    });
  }, i;
}
function N(e, t) {
  return e === t ? e : vs(e) ? t : e.constructor(t);
}
function Su(e) {
  if (e !== Object(e))
    throw new TypeError("Expected [K, V] tuple: " + e);
}
function ha(e) {
  return L(e) ? qe : Ie(e) ? it : ht;
}
function wt(e) {
  return Object.create(
    (L(e) ? Zt : Ie(e) ? Re : Qt).prototype
  );
}
function _a() {
  return this._iter.cacheResult ? (this._iter.cacheResult(), this.size = this._iter.size, this) : le.prototype.cacheResult.call(this);
}
function df(e, t) {
  return e === void 0 && t === void 0 ? 0 : e === void 0 ? 1 : t === void 0 ? -1 : e > t ? 1 : e < t ? -1 : 0;
}
function Do(e) {
  return !!(e && // @ts-expect-error: maybeValue is typed as `{}`
  typeof e.equals == "function" && // @ts-expect-error: maybeValue is typed as `{}`
  typeof e.hashCode == "function");
}
function se(e, t) {
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
  return !!(Do(e) && Do(t) && e.equals(t));
}
function da(e, t, n, r) {
  return wn(
    // @ts-expect-error Index signature for type string is missing in type V[]
    e,
    [t],
    n,
    r
  );
}
function pf(...e) {
  return bf(this, e);
}
function gf(e, ...t) {
  if (typeof e != "function")
    throw new TypeError("Invalid merger function: " + e);
  return bf(this, t, e);
}
function bf(e, t, n) {
  const r = [];
  for (let i = 0; i < t.length; i++) {
    const s = qe(t[i]);
    s.size !== 0 && r.push(s);
  }
  return r.length === 0 ? e : e.toSeq().size === 0 && !e.__ownerID && r.length === 1 ? Jt(e) ? e : e.constructor(r[0]) : e.withMutations((i) => {
    const s = n ? (o, a) => {
      da(
        i,
        a,
        M,
        (u) => u === M ? o : n(u, o, a)
      );
    } : (o, a) => {
      i.set(a, o);
    };
    for (let o = 0; o < r.length; o++)
      r[o].forEach(s);
  });
}
const Xd = Object.prototype.toString;
function pa(e) {
  if (!e || typeof e != "object" || Xd.call(e) !== "[object Object]")
    return !1;
  const t = Object.getPrototypeOf(e);
  if (t === null)
    return !0;
  let n = t, r = Object.getPrototypeOf(t);
  for (; r !== null; )
    n = r, r = Object.getPrototypeOf(n);
  return n === t;
}
function Ht(e) {
  return typeof e == "object" && (Ze(e) || Array.isArray(e) || pa(e));
}
function ri(e) {
  return typeof e == "string" && (e === "__proto__" || e === "constructor");
}
function _t(e, t) {
  t = t || 0;
  const n = Math.max(0, e.length - t), r = new Array(n);
  for (let i = 0; i < n; i++)
    r[i] = e[i + t];
  return r;
}
function Gi(e) {
  if (Array.isArray(e))
    return _t(e);
  const t = {};
  for (const n in e)
    ri(n) || rr.call(e, n) && (t[n] = e[n]);
  return t;
}
function Jd(e, ...t) {
  return si(e, t);
}
function Zd(e, t, ...n) {
  return si(t, n, e);
}
function Qd(e, ...t) {
  return ii(e, t);
}
function ep(e, t, ...n) {
  return ii(t, n, e);
}
function ii(e, t, n) {
  return si(e, t, tp(n));
}
function si(e, t, n) {
  if (!Ht(e))
    throw new TypeError(
      "Cannot merge into non-data-structure value: " + e
    );
  if (Ze(e))
    return typeof n == "function" && e.mergeWith ? e.mergeWith(n, ...t) : e.merge ? e.merge(...t) : e.concat(...t);
  const r = Array.isArray(e);
  let i = e;
  const s = r ? it : qe, o = r ? (a) => {
    i === e && (i = Gi(i)), i.push(a);
  } : (a, u) => {
    if (ri(u))
      return;
    const f = rr.call(i, u), c = f && n ? n(i[u], a, u) : a;
    (!f || c !== i[u]) && (i === e && (i = Gi(i)), i[u] = c);
  };
  for (let a = 0; a < t.length; a++)
    s(t[a]).forEach(o);
  return i;
}
function tp(e) {
  function t(n, r, i) {
    return Ht(n) && Ht(r) && np(n, r) ? si(n, [r], t) : e ? e(n, r, i) : r;
  }
  return t;
}
function np(e, t) {
  const n = le(e), r = le(t);
  return Ie(n) === Ie(r) && L(n) === L(r);
}
function yf(...e) {
  return ii(this, e);
}
function mf(e, ...t) {
  return ii(this, t, e);
}
function ga(e, ...t) {
  return wn(
    this,
    e,
    gt(),
    (n) => ii(n, t)
  );
}
function ba(e, ...t) {
  return wn(this, e, gt(), (n) => si(n, t));
}
function vf(e, t, n) {
  return wn(e, t, M, () => n);
}
function ya(e, t) {
  return vf(this, e, t);
}
function ma(e, t, n) {
  return arguments.length === 1 ? e(this) : da(this, e, t, n);
}
function va(e, t, n) {
  return wn(this, e, t, n);
}
function Sa() {
  return this.__altered;
}
function oi(e) {
  const t = this.asMutable();
  return e(t), t.wasAltered() ? t.__ensureOwner(this.__ownerID) : this;
}
const Sf = "@@__IMMUTABLE_MAP__@@";
function Es(e) {
  return !!(e && // @ts-expect-error: maybeMap is typed as `{}`, need to change in 6.0 to `maybeMap && typeof maybeMap === 'object' && IS_MAP_SYMBOL in maybeMap`
  e[Sf]);
}
function gr(e, t) {
  if (!e) throw new Error(t);
}
function Pe(e) {
  gr(
    e !== 1 / 0,
    "Cannot perform this action with an infinite size."
  );
}
let Sn = class extends qe {
  // @pragma Construction
  constructor(t) {
    return t == null ? gt() : Es(t) && !st(t) ? t : gt().withMutations((n) => {
      const r = qe(t);
      Pe(r.size), r.forEach((i, s) => n.set(s, i));
    });
  }
  toString() {
    return this.__toString("Map {", "}");
  }
  // @pragma Access
  get(t, n) {
    return this._root ? this._root.get(0, void 0, t, n) : n;
  }
  // @pragma Modification
  set(t, n) {
    return Ou(this, t, n);
  }
  remove(t) {
    return Ou(this, t, M);
  }
  deleteAll(t) {
    const n = oe(t);
    return n.size === 0 ? this : this.withMutations((r) => {
      n.forEach((i) => r.remove(i));
    });
  }
  clear() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._root = null, this.__hash = void 0, this.__altered = !0, this) : gt();
  }
  // @pragma Composition
  sort(t) {
    return St(Wn(this, t));
  }
  sortBy(t, n) {
    return St(Wn(this, n, t));
  }
  map(t, n) {
    return this.withMutations((r) => {
      r.forEach((i, s) => {
        r.set(s, t.call(n, i, s, this));
      });
    });
  }
  // @pragma Mutability
  __iterator(t, n) {
    return new rp(this, t, n);
  }
  __iterate(t, n) {
    let r = 0;
    return this._root && this._root.iterate((i) => (r++, t(i[1], i[0], this)), n), r;
  }
  __ensureOwner(t) {
    return t === this.__ownerID ? this : t ? wa(this.size, this._root, t, this.__hash) : this.size === 0 ? gt() : (this.__ownerID = t, this.__altered = !1, this);
  }
};
Sn.isMap = Es;
const k = Sn.prototype;
k[Sf] = !0;
k[Zr] = k.remove;
k.removeAll = k.deleteAll;
k.setIn = ya;
k.removeIn = k.deleteIn = Da;
k.update = ma;
k.updateIn = va;
k.merge = k.concat = pf;
k.mergeWith = gf;
k.mergeDeep = yf;
k.mergeDeepWith = mf;
k.mergeIn = ba;
k.mergeDeepIn = ga;
k.withMutations = oi;
k.wasAltered = Sa;
k.asImmutable = ti;
k["@@transducer/init"] = k.asMutable = ni;
k["@@transducer/step"] = function(e, t) {
  return e.set(t[0], t[1]);
};
k["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
class Os {
  constructor(t, n) {
    this.ownerID = t, this.entries = n;
  }
  get(t, n, r, i) {
    const s = this.entries;
    for (let o = 0, a = s.length; o < a; o++)
      if (se(r, s[o][0]))
        return s[o][1];
    return i;
  }
  update(t, n, r, i, s, o, a) {
    const u = s === M, f = this.entries;
    let c = 0;
    const l = f.length;
    for (; c < l && !se(i, f[c][0]); c++)
      ;
    const _ = c < l;
    if (_ ? f[c][1] === s : u)
      return this;
    if (Xe(a), (u || !_) && Xe(o), u && f.length === 1)
      return;
    if (!_ && !u && f.length >= cp)
      return ip(t, f, i, s);
    const d = t && t === this.ownerID, h = d ? f : _t(f);
    return _ ? u ? c === l - 1 ? h.pop() : h[c] = h.pop() : h[c] = [i, s] : h.push([i, s]), d ? (this.entries = h, this) : new Os(t, h);
  }
}
class ai {
  constructor(t, n, r) {
    this.ownerID = t, this.bitmap = n, this.nodes = r;
  }
  get(t, n, r, i) {
    n === void 0 && (n = pe(r));
    const s = 1 << ((t === 0 ? n : n >>> t) & ge), o = this.bitmap;
    return (o & s) === 0 ? i : this.nodes[Du(o & s - 1)].get(
      t + $,
      n,
      r,
      i
    );
  }
  update(t, n, r, i, s, o, a) {
    r === void 0 && (r = pe(i));
    const u = (n === 0 ? r : r >>> n) & ge, f = 1 << u, c = this.bitmap, l = (c & f) !== 0;
    if (!l && s === M)
      return this;
    const _ = Du(c & f - 1), d = this.nodes, h = l ? d[_] : void 0, p = Ea(
      h,
      t,
      n + $,
      r,
      i,
      s,
      o,
      a
    );
    if (p === h)
      return this;
    if (!l && p && d.length >= fp)
      return op(t, d, c, u, p);
    if (l && !p && d.length === 2 && Au(d[_ ^ 1]))
      return d[_ ^ 1];
    if (l && p && d.length === 1 && Au(p))
      return p;
    const b = t && t === this.ownerID, S = l ? p ? c : c ^ f : c | f, O = l ? p ? wf(d, _, p, b) : up(d, _, b) : ap(d, _, p, b);
    return b ? (this.bitmap = S, this.nodes = O, this) : new ai(t, S, O);
  }
}
class As {
  constructor(t, n, r) {
    this.ownerID = t, this.count = n, this.nodes = r;
  }
  get(t, n, r, i) {
    n === void 0 && (n = pe(r));
    const s = (t === 0 ? n : n >>> t) & ge, o = this.nodes[s];
    return o ? o.get(t + $, n, r, i) : i;
  }
  update(t, n, r, i, s, o, a) {
    r === void 0 && (r = pe(i));
    const u = (n === 0 ? r : r >>> n) & ge, f = s === M, c = this.nodes, l = c[u];
    if (f && !l)
      return this;
    const _ = Ea(
      l,
      t,
      n + $,
      r,
      i,
      s,
      o,
      a
    );
    if (_ === l)
      return this;
    let d = this.count;
    if (!l)
      d++;
    else if (!_ && (d--, d < lp))
      return sp(t, c, d, u);
    const h = t && t === this.ownerID, p = wf(c, u, _, h);
    return h ? (this.count = d, this.nodes = p, this) : new As(t, d, p);
  }
}
class ui {
  constructor(t, n, r) {
    this.ownerID = t, this.keyHash = n, this.entries = r, this._index = void 0;
  }
  // Returns the position of `key` in `this.entries`, or -1. Uses the secondary
  // index when present; builds it only when `buildIndex` is true (reads and
  // transient inserts, where the node is reused so the O(n) build amortizes).
  // Persistent inserts already pay an O(n) copy, so a throwaway index is skipped.
  _positionOf(t, n) {
    const r = this.entries;
    let i = this._index;
    if (i === void 0 && n && r.length >= hp && (i = this._buildIndex()), i !== void 0) {
      const s = i[Fs(t)];
      if (s !== void 0)
        for (let o = 0; o < s.length; o++) {
          const a = s[o];
          if (se(t, r[a][0]))
            return a;
        }
      return -1;
    }
    for (let s = 0, o = r.length; s < o; s++)
      if (se(t, r[s][0]))
        return s;
    return -1;
  }
  // Builds and memoizes the secondary index. A plain object, not `Map` — which
  // in this module resolves to the *Immutable* Map, not the native one.
  _buildIndex() {
    const t = /* @__PURE__ */ Object.create(null), n = this.entries;
    for (let r = 0, i = n.length; r < i; r++) {
      const s = Fs(n[r][0]), o = t[s];
      o !== void 0 ? o.push(r) : t[s] = [r];
    }
    return this._index = t, t;
  }
  get(t, n, r, i) {
    const s = this._positionOf(r, !0);
    return s === -1 ? i : this.entries[s][1];
  }
  update(t, n, r, i, s, o, a) {
    r === void 0 && (r = pe(i));
    const u = s === M;
    if (r !== this.keyHash)
      return u ? this : (Xe(a), Xe(o), Oa(this, t, n, r, [i, s]));
    const f = this.entries, c = f.length, l = t && t === this.ownerID, _ = this._positionOf(i, l), d = _ === -1 ? c : _, h = _ !== -1;
    if (h ? f[d][1] === s : u)
      return this;
    if (Xe(a), (u || !h) && Xe(o), u && c === 2)
      return new en(t, this.keyHash, f[d ^ 1]);
    const p = l ? f : _t(f);
    if (h)
      u ? (d === c - 1 ? p.pop() : p[d] = p.pop(), l && (this._index = void 0)) : p[d] = [i, s];
    else if (p.push([i, s]), l && this._index !== void 0) {
      const b = Fs(i), S = this._index[b];
      S !== void 0 ? S.push(c) : this._index[b] = [c];
    }
    return l ? (this.entries = p, this) : new ui(t, this.keyHash, p);
  }
}
class en {
  constructor(t, n, r) {
    this.ownerID = t, this.keyHash = n, this.entry = r;
  }
  get(t, n, r, i) {
    return se(r, this.entry[0]) ? this.entry[1] : i;
  }
  update(t, n, r, i, s, o, a) {
    const u = s === M, f = se(i, this.entry[0]);
    if (f ? s === this.entry[1] : u)
      return this;
    if (Xe(a), u) {
      Xe(o);
      return;
    }
    return f ? t && t === this.ownerID ? (this.entry[1] = s, this) : new en(t, this.keyHash, [i, s]) : (Xe(o), Oa(this, t, n, pe(i), [i, s]));
  }
}
Os.prototype.iterate = ui.prototype.iterate = function(e, t) {
  const n = this.entries;
  for (let r = 0, i = n.length - 1; r <= i; r++)
    if (e(n[t ? i - r : r]) === !1)
      return !1;
};
ai.prototype.iterate = As.prototype.iterate = function(e, t) {
  const n = this.nodes;
  for (let r = 0, i = n.length - 1; r <= i; r++) {
    const s = n[t ? i - r : r];
    if (s && s.iterate(e, t) === !1)
      return !1;
  }
};
en.prototype.iterate = function(e, t) {
  return e(this.entry);
};
class rp extends P {
  constructor(t, n, r) {
    this._type = n, this._reverse = r, this._stack = t._root && wu(t._root);
  }
  next() {
    const t = this._type;
    let n = this._stack;
    for (; n; ) {
      const r = n.node, i = n.index++;
      let s;
      if (r.entry) {
        if (i === 0)
          return Xs(t, r.entry);
      } else if (r.entries) {
        if (s = r.entries.length - 1, i <= s)
          return Xs(
            t,
            r.entries[this._reverse ? s - i : i]
          );
      } else if (s = r.nodes.length - 1, i <= s) {
        const o = r.nodes[this._reverse ? s - i : i];
        if (o) {
          if (o.entry)
            return Xs(t, o.entry);
          n = this._stack = wu(o, n);
        }
        continue;
      }
      n = this._stack = this._stack.__prev;
    }
    return fe();
  }
}
function Xs(e, t) {
  return U(e, t[0], t[1]);
}
function wu(e, t) {
  return {
    node: e,
    index: 0,
    __prev: t
  };
}
function wa(e, t, n, r) {
  const i = Object.create(k);
  return i.size = e, i._root = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
let Eu;
function gt() {
  return Eu || (Eu = wa(0));
}
function Ou(e, t, n) {
  let r, i;
  if (e._root) {
    const s = wo(), o = wo();
    if (r = Ea(
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
    i = e.size + (s.value ? n === M ? -1 : 1 : 0);
  } else {
    if (n === M)
      return e;
    i = 1, r = new Os(e.__ownerID, [[t, n]]);
  }
  return e.__ownerID ? (e.size = i, e._root = r, e.__hash = void 0, e.__altered = !0, e) : r ? wa(i, r) : gt();
}
function Ea(e, t, n, r, i, s, o, a) {
  return e ? e.update(
    t,
    n,
    r,
    i,
    s,
    o,
    a
  ) : s === M ? e : (Xe(a), Xe(o), new en(t, r, [i, s]));
}
function Au(e) {
  return e.constructor === en || e.constructor === ui;
}
function Oa(e, t, n, r, i) {
  if (e.keyHash === r)
    return new ui(t, r, [e.entry, i]);
  const s = (n === 0 ? e.keyHash : e.keyHash >>> n) & ge, o = (n === 0 ? r : r >>> n) & ge;
  let a;
  const u = s === o ? [Oa(e, t, n + $, r, i)] : (a = new en(t, r, i), s < o ? [e, a] : [a, e]);
  return new ai(t, 1 << s | 1 << o, u);
}
function ip(e, t, n, r) {
  e || (e = new ia());
  let i = new en(e, pe(n), [n, r]);
  for (let s = 0; s < t.length; s++) {
    const o = t[s];
    i = i.update(e, 0, void 0, o[0], o[1]);
  }
  return i;
}
function sp(e, t, n, r) {
  let i = 0, s = 0;
  const o = new Array(n);
  for (let a = 0, u = 1, f = t.length; a < f; a++, u <<= 1) {
    const c = t[a];
    c !== void 0 && a !== r && (i |= u, o[s++] = c);
  }
  return new ai(e, i, o);
}
function op(e, t, n, r, i) {
  let s = 0;
  const o = new Array(ze);
  for (let a = 0; n !== 0; a++, n >>>= 1)
    o[a] = n & 1 ? t[s++] : void 0;
  return o[r] = i, new As(e, s + 1, o);
}
function Du(e) {
  return e -= e >> 1 & 1431655765, e = (e & 858993459) + (e >> 2 & 858993459), e = e + (e >> 4) & 252645135, e += e >> 8, e += e >> 16, e & 127;
}
function wf(e, t, n, r) {
  const i = r ? e : _t(e);
  return i[t] = n, i;
}
function ap(e, t, n, r) {
  const i = e.length + 1;
  if (r && t + 1 === i)
    return e[t] = n, e;
  const s = new Array(i);
  let o = 0;
  for (let a = 0; a < i; a++)
    a === t ? (s[a] = n, o = -1) : s[a] = e[a + o];
  return s;
}
function up(e, t, n) {
  const r = e.length - 1;
  if (n && t === r)
    return e.pop(), e;
  const i = new Array(r);
  let s = 0;
  for (let o = 0; o < r; o++)
    o === t && (s = 1), i[o] = e[o + s];
  return i;
}
const cp = ze / 4, fp = ze / 2, lp = ze / 4, hp = 16;
function Ef(e) {
  if (sa(e) && typeof e != "string")
    return e;
  if (st(e))
    return e.toArray();
  throw new TypeError(
    "Invalid keyPath: expected Ordered Collection or Array: " + e
  );
}
function Rr(e) {
  try {
    return typeof e == "string" ? JSON.stringify(e) : String(e);
  } catch {
    return JSON.stringify(e);
  }
}
function Of(e, t) {
  return Ze(e) ? (
    // @ts-expect-error key might be a number or symbol, which is not handled be Record key type
    e.has(t)
  ) : (
    // @ts-expect-error key might be anything else than PropertyKey, and will return false in that case but runtime is OK
    Ht(e) && rr.call(e, t)
  );
}
function Aa(e, t, n) {
  return Ze(e) ? e.get(t, n) : Of(e, t) ? (
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
function Af(e, t) {
  if (!Ht(e))
    throw new TypeError(
      "Cannot update non-data-structure value: " + e
    );
  if (Ze(e)) {
    if (!e.remove)
      throw new TypeError(
        "Cannot update immutable value without .remove() method: " + e
      );
    return e.remove(t);
  }
  if (!rr.call(e, t))
    return e;
  const n = Gi(e);
  return Array.isArray(n) ? n.splice(t, 1) : delete n[t], n;
}
function Df(e, t, n) {
  if (ri(t))
    return e;
  if (!Ht(e))
    throw new TypeError(
      "Cannot update non-data-structure value: " + e
    );
  if (Ze(e)) {
    if (!e.set)
      throw new TypeError(
        "Cannot update immutable value without .set() method: " + e
      );
    return e.set(t, n);
  }
  if (rr.call(e, t) && n === e[t])
    return e;
  const r = Gi(e);
  return r[t] = n, r;
}
function wn(e, t, n, r) {
  r || (r = n, n = void 0);
  const i = If(
    Ze(e),
    // @ts-expect-error type issues with Record and mixed types
    e,
    Ef(t),
    0,
    n,
    r
  );
  return i === M ? n : i;
}
function If(e, t, n, r, i, s) {
  const o = t === M;
  if (r === n.length) {
    const c = o ? i : t, l = s(c);
    return l === c ? t : l;
  }
  if (!o && !Ht(t))
    throw new TypeError(
      "Cannot update within non-data-structure value in path [" + Array.from(n).slice(0, r).map(Rr) + "]: " + t
    );
  const a = n[r], u = o ? M : Aa(t, a, M), f = If(
    u === M ? e : Ze(u),
    // @ts-expect-error mixed type
    u,
    n,
    r + 1,
    i,
    s
  );
  return f === u ? t : f === M ? Af(t, a) : Df(
    o ? e ? gt() : {} : t,
    a,
    f
  );
}
function xf(e, t) {
  return wn(e, t, () => M);
}
function Da(e) {
  return xf(this, e);
}
const Tf = "@@__IMMUTABLE_LIST__@@";
function Ia(e) {
  return !!(e && // @ts-expect-error: maybeList is typed as `{}`, need to change in 6.0 to `maybeList && typeof maybeList === 'object' && IS_LIST_SYMBOL in maybeList`
  e[Tf]);
}
class ci extends it {
  // @pragma Construction
  constructor(t) {
    const n = xi();
    if (t == null)
      return n;
    if (Ia(t))
      return t;
    const r = it(t), i = r.size;
    return i === 0 ? n : (Pe(i), i > 0 && i < ze ? Mr(0, i, $, void 0, new on(r.toArray())) : n.withMutations((s) => {
      s.setSize(i), r.forEach((o, a) => s.set(a, o));
    }));
  }
  static of() {
    return this(arguments);
  }
  toString() {
    return this.__toString("List [", "]");
  }
  // @pragma Access
  get(t, n) {
    if (t = Wt(this, t), t >= 0 && t < this.size) {
      t += this._origin;
      const r = Rf(this, t);
      return r && r.array[t & ge];
    }
    return n;
  }
  // @pragma Modification
  set(t, n) {
    return _p(this, t, n);
  }
  remove(t) {
    return this.has(t) ? t === 0 ? this.shift() : t === this.size - 1 ? this.pop() : this.splice(t, 1) : this;
  }
  insert(t, n) {
    return this.splice(t, 0, n);
  }
  clear() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = this._origin = this._capacity = 0, this._level = $, this._root = this._tail = this.__hash = void 0, this.__altered = !0, this) : xi();
  }
  push() {
    const t = arguments, n = this.size;
    return this.withMutations((r) => {
      Pt(r, 0, n + t.length);
      for (let i = 0; i < t.length; i++)
        r.set(n + i, t[i]);
    });
  }
  pop() {
    return Pt(this, 0, -1);
  }
  unshift() {
    const t = arguments;
    return this.withMutations((n) => {
      Pt(n, -t.length);
      for (let r = 0; r < t.length; r++)
        n.set(r, t[r]);
    });
  }
  shift() {
    return Pt(this, 1);
  }
  shuffle(t = Math.random) {
    return this.withMutations((n) => {
      let r = n.size, i, s;
      for (; r; )
        i = Math.floor(t() * r--), s = n.get(i), n.set(i, n.get(r)), n.set(r, s);
    });
  }
  // @pragma Composition
  concat() {
    const t = [];
    for (let n = 0; n < arguments.length; n++) {
      const r = arguments[n], i = it(
        typeof r != "string" && ra(r) ? r : [r]
      );
      i.size !== 0 && t.push(i);
    }
    return t.length === 0 ? this : this.size === 0 && !this.__ownerID && t.length === 1 ? this.constructor(t[0]) : this.withMutations((n) => {
      t.forEach((r) => r.forEach((i) => n.push(i)));
    });
  }
  setSize(t) {
    return Pt(this, 0, t);
  }
  map(t, n) {
    return this.withMutations((r) => {
      for (let i = 0; i < this.size; i++)
        r.set(i, t.call(n, r.get(i), i, this));
    });
  }
  // @pragma Iteration
  slice(t, n) {
    const r = this.size;
    return Qr(t, n, r) ? this : Pt(
      this,
      nr(t, r),
      ei(n, r)
    );
  }
  __iterator(t, n) {
    let r = n ? this.size : 0;
    const i = Iu(this, n);
    return new P(() => {
      const s = i();
      return s === br ? fe() : U(t, n ? --r : r++, s);
    });
  }
  __iterate(t, n) {
    let r = n ? this.size : 0;
    const i = Iu(this, n);
    let s;
    for (; (s = i()) !== br && t(s, n ? --r : r++, this) !== !1; )
      ;
    return r;
  }
  __ensureOwner(t) {
    return t === this.__ownerID ? this : t ? Mr(
      this._origin,
      this._capacity,
      this._level,
      this._root,
      this._tail,
      t,
      this.__hash
    ) : this.size === 0 ? xi() : (this.__ownerID = t, this.__altered = !1, this);
  }
}
ci.isList = Ia;
const Q = ci.prototype;
Q[Tf] = !0;
Q[Zr] = Q.remove;
Q.merge = Q.concat;
Q.setIn = ya;
Q.deleteIn = Q.removeIn = Da;
Q.update = ma;
Q.updateIn = va;
Q.mergeIn = ba;
Q.mergeDeepIn = ga;
Q.withMutations = oi;
Q.wasAltered = Sa;
Q.asImmutable = ti;
Q["@@transducer/init"] = Q.asMutable = ni;
Q["@@transducer/step"] = function(e, t) {
  return e.push(t);
};
Q["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
class on {
  /**
   * @param {Array<VNode<T> | T | undefined>} array
   * @param {OwnerID} [ownerID]
   */
  constructor(t, n) {
    this.array = t, this.ownerID = n;
  }
  // TODO: seems like these methods are very similar
  removeBefore(t, n, r) {
    if ((r & (1 << n + $) - 1) === 0 || this.array.length === 0)
      return this;
    const i = r >>> n & ge;
    if (i >= this.array.length)
      return new on([], t);
    const s = i === 0;
    let o;
    if (n > 0) {
      const u = this.array[i];
      if (o = u && u.removeBefore(t, n - $, r), o === u && s)
        return this;
    }
    if (s && !o)
      return this;
    const a = Fn(this, t);
    if (!s)
      for (let u = 0; u < i; u++)
        a.array[u] = void 0;
    return o && (a.array[i] = o), a;
  }
  removeAfter(t, n, r) {
    if (r === (n ? 1 << n + $ : ze) || this.array.length === 0)
      return this;
    const i = r - 1 >>> n & ge;
    if (i >= this.array.length)
      return this;
    let s;
    if (n > 0) {
      const a = this.array[i];
      if (s = a && a.removeAfter(t, n - $, r), s === a && i === this.array.length - 1)
        return this;
    }
    const o = Fn(this, t);
    return o.array.splice(i + 1), s && (o.array[i] = s), o;
  }
}
const br = {};
function Iu(e, t) {
  const n = e._origin, r = e._capacity, i = Cr(r), s = e._tail;
  return o(e._root, e._level, 0);
  function o(f, c, l) {
    return c === 0 ? a(f, l) : u(f, c, l);
  }
  function a(f, c) {
    const l = c === i ? s && s.array : f && f.array;
    let _ = c > n ? 0 : n - c, d = r - c;
    return d > ze && (d = ze), () => {
      if (_ === d)
        return br;
      const h = t ? --d : _++;
      return l && l[h];
    };
  }
  function u(f, c, l) {
    let _;
    const d = f && f.array;
    let h = l > n ? 0 : n - l >> c, p = (r - l >> c) + 1;
    return p > ze && (p = ze), () => {
      for (; ; ) {
        if (_) {
          const S = _();
          if (S !== br)
            return S;
          _ = null;
        }
        if (h === p)
          return br;
        const b = t ? --p : h++;
        _ = o(
          d && d[b],
          c - $,
          l + (b << c)
        );
      }
    };
  }
}
function Mr(e, t, n, r, i, s, o) {
  const a = Object.create(Q);
  return a.size = t - e, a._origin = e, a._capacity = t, a._level = n, a._root = r, a._tail = i, a.__ownerID = s, a.__hash = o, a.__altered = !1, a;
}
function xi() {
  return Mr(0, 0, $);
}
function _p(e, t, n) {
  if (t = Wt(e, t), t !== t)
    return e;
  if (t >= e.size || t < 0)
    return e.withMutations((o) => {
      t < 0 ? Pt(o, t).set(0, n) : Pt(o, 0, t + 1).set(t, n);
    });
  t += e._origin;
  let r = e._tail, i = e._root;
  const s = wo();
  return t >= Cr(e._capacity) ? r = Io(r, e.__ownerID, 0, t, n, s) : i = Io(
    i,
    e.__ownerID,
    e._level,
    t,
    n,
    s
  ), s.value ? e.__ownerID ? (e._root = i, e._tail = r, e.__hash = void 0, e.__altered = !0, e) : Mr(e._origin, e._capacity, e._level, i, r) : e;
}
function Io(e, t, n, r, i, s) {
  const o = r >>> n & ge, a = e && o < e.array.length;
  if (!a && i === void 0)
    return e;
  let u;
  if (n > 0) {
    const f = e && e.array[o], c = Io(
      f,
      t,
      n - $,
      r,
      i,
      s
    );
    return c === f ? e : (u = Fn(e, t), u.array[o] = c, u);
  }
  return a && e.array[o] === i ? e : (s && Xe(s), u = Fn(e, t), i === void 0 && o === u.array.length - 1 ? u.array.pop() : u.array[o] = i, u);
}
function Fn(e, t) {
  return t && e && t === e.ownerID ? e : new on(e ? e.array.slice() : [], t);
}
function Rf(e, t) {
  if (t >= Cr(e._capacity))
    return e._tail;
  if (t < 1 << e._level + $) {
    let n = e._root, r = e._level;
    for (; n && r > 0; )
      n = n.array[t >>> r & ge], r -= $;
    return n;
  }
}
function dp(e, t, n) {
  const r = e._origin + (t === void 0 ? 0 : t), i = n === void 0 ? e._capacity : n < 0 ? e._capacity + n : e._origin + n;
  if (Number.isFinite(i) && i > mi || Number.isFinite(r) && r < -mi || Number.isFinite(i) && Number.isFinite(r) && i - r > mi)
    throw new RangeError(
      "Invalid List size: a List cannot hold more than " + mi + " (2 ** 30) values."
    );
}
function Pt(e, t, n) {
  dp(e, t, n), t !== void 0 && (t |= 0), n !== void 0 && (n |= 0);
  const r = e.__ownerID || new ia();
  let i = e._origin, s = e._capacity, o = i + t, a = n === void 0 ? s : n < 0 ? s + n : i + n;
  if (o === i && a === s)
    return e;
  if (o >= a)
    return e.clear();
  let u = e._level, f = e._root, c = 0;
  for (; o + c < 0; )
    f = new on(
      f && f.array.length ? [void 0, f] : [],
      r
    ), u += $, c += xu(u);
  c && (o += c, i += c, a += c, s += c);
  const l = Cr(s), _ = Cr(a);
  for (; _ >= xu(u + $); )
    f = new on(
      f && f.array.length ? [f] : [],
      r
    ), u += $;
  const d = e._tail;
  let h = _ < l ? Rf(e, a - 1) : _ > l ? new on([], r) : d;
  if (d && _ > l && o < s && d.array.length) {
    f = Fn(f, r);
    let p = f;
    for (let b = u; b > $; b -= $) {
      const S = l >>> b & ge;
      p = p.array[S] = Fn(p.array[S], r);
    }
    p.array[l >>> $ & ge] = d;
  }
  if (a < s && (h = h && h.removeAfter(r, 0, a)), o >= _)
    o -= _, a -= _, u = $, f = void 0, h = h && h.removeBefore(r, 0, o);
  else if (o > i || _ < l) {
    for (c = 0; f; ) {
      const p = o >>> u & ge;
      if (p !== _ >>> u & ge)
        break;
      p && (c += (1 << u) * p), u -= $, f = f.array[p];
    }
    f && o > i && (f = f.removeBefore(r, u, o - c)), f && _ < l && (f = f.removeAfter(
      r,
      u,
      _ - c
    )), c && (o -= c, a -= c);
  }
  return e.__ownerID ? (e.size = a - o, e._origin = o, e._capacity = a, e._level = u, e._root = f, e._tail = h, e.__hash = void 0, e.__altered = !0, e) : Mr(o, a, u, f, h);
}
function Cr(e) {
  return e < ze ? 0 : e - 1 >>> $ << $;
}
const mi = 2 ** 30;
function xu(e) {
  return e < 31 ? 1 << e : 2 ** e;
}
function xa(e) {
  return Es(e) && st(e);
}
class St extends Sn {
  // @pragma Construction
  constructor(t) {
    return t == null ? lr() : xa(t) ? t : lr().withMutations((n) => {
      const r = qe(t);
      Pe(r.size), r.forEach((i, s) => n.set(s, i));
    });
  }
  static of() {
    return this(arguments);
  }
  toString() {
    return this.__toString("OrderedMap {", "}");
  }
  // @pragma Access
  get(t, n) {
    const r = this._map.get(t);
    return r !== void 0 ? this._list.get(r)[1] : n;
  }
  // @pragma Modification
  clear() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._map.clear(), this._list.clear(), this.__altered = !0, this) : lr();
  }
  set(t, n) {
    return Ru(this, t, n);
  }
  remove(t) {
    return Ru(this, t, M);
  }
  __iterate(t, n) {
    return this._list.__iterate(
      (r) => r && t(r[1], r[0], this),
      n
    );
  }
  __iterator(t, n) {
    return this._list.fromEntrySeq().__iterator(t, n);
  }
  __ensureOwner(t) {
    if (t === this.__ownerID)
      return this;
    const n = this._map.__ensureOwner(t), r = this._list.__ensureOwner(t);
    return t ? Ta(n, r, t, this.__hash) : this.size === 0 ? lr() : (this.__ownerID = t, this.__altered = !1, this._map = n, this._list = r, this);
  }
}
St.isOrderedMap = xa;
St.prototype[Ft] = !0;
St.prototype[Zr] = St.prototype.remove;
function Ta(e, t, n, r) {
  const i = Object.create(St.prototype);
  return i.size = e ? e.size : 0, i._map = e, i._list = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
let Tu;
function lr() {
  return Tu || (Tu = Ta(gt(), xi()));
}
function Ru(e, t, n) {
  const r = e._map, i = e._list, s = r.get(t), o = s !== void 0;
  let a, u;
  if (n === M) {
    if (!o)
      return e;
    i.size >= ze && i.size >= r.size * 2 ? (u = i.filter((f, c) => f !== void 0 && s !== c), a = u.toKeyedSeq().map((f) => f[0]).flip().toMap(), e.__ownerID && (a.__ownerID = u.__ownerID = e.__ownerID)) : (a = r.remove(t), u = s === i.size - 1 ? i.pop() : i.set(s, void 0));
  } else if (o) {
    if (n === i.get(s)[1])
      return e;
    a = r, u = i.set(s, [t, n]);
  } else
    a = r.set(t, i.size), u = i.set(i.size, [t, n]);
  return e.__ownerID ? (e.size = a.size, e._map = a, e._list = u, e.__hash = void 0, e.__altered = !0, e) : Ta(a, u);
}
const Mf = "@@__IMMUTABLE_STACK__@@";
function Yi(e) {
  return !!(e && // @ts-expect-error: maybeStack is typed as `{}`, need to change in 6.0 to `maybeStack && typeof maybeStack === 'object' && MAYBE_STACK_SYMBOL in maybeStack`
  e[Mf]);
}
class Ds extends it {
  // @pragma Construction
  constructor(t) {
    return t == null ? vi() : Yi(t) ? t : vi().pushAll(t);
  }
  static of() {
    return this(arguments);
  }
  toString() {
    return this.__toString("Stack [", "]");
  }
  // @pragma Access
  get(t, n) {
    let r = this._head;
    for (t = Wt(this, t); r && t--; )
      r = r.next;
    return r ? r.value : n;
  }
  peek() {
    return this._head && this._head.value;
  }
  // @pragma Modification
  push() {
    if (arguments.length === 0)
      return this;
    const t = this.size + arguments.length;
    let n = this._head;
    for (let r = arguments.length - 1; r >= 0; r--)
      n = {
        value: arguments[r],
        next: n
      };
    return this.__ownerID ? (this.size = t, this._head = n, this.__hash = void 0, this.__altered = !0, this) : hr(t, n);
  }
  pushAll(t) {
    if (t = it(t), t.size === 0)
      return this;
    if (this.size === 0 && Yi(t))
      return t;
    Pe(t.size);
    let n = this.size, r = this._head;
    return t.__iterate(
      (i) => {
        n++, r = {
          value: i,
          next: r
        };
      },
      /* reverse */
      !0
    ), this.__ownerID ? (this.size = n, this._head = r, this.__hash = void 0, this.__altered = !0, this) : hr(n, r);
  }
  pop() {
    return this.slice(1);
  }
  clear() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._head = void 0, this.__hash = void 0, this.__altered = !0, this) : vi();
  }
  slice(t, n) {
    if (Qr(t, n, this.size))
      return this;
    let r = nr(t, this.size);
    if (ei(n, this.size) !== this.size)
      return it.prototype.slice.call(this, t, n);
    const s = this.size - r;
    let o = this._head;
    for (; r--; )
      o = o.next;
    return this.__ownerID ? (this.size = s, this._head = o, this.__hash = void 0, this.__altered = !0, this) : hr(s, o);
  }
  // @pragma Mutability
  __ensureOwner(t) {
    return t === this.__ownerID ? this : t ? hr(this.size, this._head, t, this.__hash) : this.size === 0 ? vi() : (this.__ownerID = t, this.__altered = !1, this);
  }
  // @pragma Iteration
  __iterate(t, n) {
    if (n)
      return new Kn(this.toArray()).__iterate(
        (s, o) => t(s, o, this),
        n
      );
    let r = 0, i = this._head;
    for (; i && t(i.value, r++, this) !== !1; )
      i = i.next;
    return r;
  }
  __iterator(t, n) {
    if (n)
      return new Kn(this.toArray()).__iterator(t, n);
    let r = 0, i = this._head;
    return new P(() => {
      if (i) {
        const s = i.value;
        return i = i.next, U(t, r++, s);
      }
      return fe();
    });
  }
}
Ds.isStack = Yi;
const me = Ds.prototype;
me[Mf] = !0;
me.shift = me.pop;
me.unshift = me.push;
me.unshiftAll = me.pushAll;
me.withMutations = oi;
me.wasAltered = Sa;
me.asImmutable = ti;
me["@@transducer/init"] = me.asMutable = ni;
me["@@transducer/step"] = function(e, t) {
  return e.unshift(t);
};
me["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
function hr(e, t, n, r) {
  const i = Object.create(me);
  return i.size = e, i._head = t, i.__ownerID = n, i.__hash = r, i.__altered = !1, i;
}
let Mu;
function vi() {
  return Mu || (Mu = hr(0));
}
function Cu(e, t, n, r, i, s) {
  return Pe(e.size), e.__iterate((o, a, u) => {
    i ? (i = !1, n = o) : n = t.call(r, n, o, a, u);
  }, s), n;
}
function pp(e, t) {
  return t;
}
function gp(e, t) {
  return [t, e];
}
function Js(e) {
  return function(...t) {
    return !e.apply(this, t);
  };
}
function Pu(e) {
  return function(...t) {
    return -e.apply(this, t);
  };
}
function Vu(e, t) {
  return e < t ? 1 : e > t ? -1 : 0;
}
function Ra(e, t) {
  if (e === t)
    return !0;
  if (!xe(t) || // @ts-expect-error size should exists on Collection
  e.size !== void 0 && t.size !== void 0 && e.size !== t.size || // @ts-expect-error __hash exists on Collection
  e.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  t.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  e.__hash !== t.__hash || L(e) !== L(t) || Ie(e) !== Ie(t) || // @ts-expect-error Range extends Collection, which implements [Symbol.iterator], so it is valid
  st(e) !== st(t))
    return !1;
  if (e.size === 0 && t.size === 0)
    return !0;
  const n = !bs(e);
  if (st(e)) {
    const o = e.entries();
    return t.every((a, u) => {
      const f = o.next().value;
      return f && se(f[1], a) && (n || se(f[0], u));
    }) && o.next().done;
  }
  let r = !1;
  if (e.size === void 0)
    if (t.size === void 0)
      typeof e.cacheResult == "function" && e.cacheResult();
    else {
      r = !0;
      const o = e;
      e = t, t = o;
    }
  let i = !0;
  const s = (
    // @ts-expect-error b is Range | Repeat | Collection<unknown, unknown> as it may have been flipped, and __iterate is valid
    t.__iterate((o, a) => {
      if (n ? (
        // @ts-expect-error has exists on Collection
        !e.has(o)
      ) : r ? (
        // @ts-expect-error type of `get` does not "catch" the version with `notSetValue`
        !se(o, e.get(a, M))
      ) : (
        // @ts-expect-error type of `get` does not "catch" the version with `notSetValue`
        !se(e.get(a, M), o)
      ))
        return i = !1, !1;
    })
  );
  return i && // @ts-expect-error size should exists on Collection
  e.size === s;
}
class Nt extends Re {
  constructor(t, n, r = 1) {
    if (!(this instanceof Nt))
      return new Nt(t, n, r);
    if (gr(r !== 0, "Cannot step a Range by 0"), gr(
      t !== void 0,
      "You must define a start value when using Range"
    ), gr(
      n !== void 0,
      "You must define an end value when using Range"
    ), r = Math.abs(r), n < t && (r = -r), this._start = t, this._end = n, this._step = r, this.size = Math.max(0, Math.ceil((n - t) / r - 1) + 1), this.size === 0) {
      if (Zs)
        return Zs;
      Zs = this;
    }
  }
  toString() {
    return this.size === 0 ? "Range []" : `Range [ ${this._start}...${this._end}${this._step !== 1 ? " by " + this._step : ""} ]`;
  }
  get(t, n) {
    return this.has(t) ? this._start + Wt(this, t) * this._step : n;
  }
  includes(t) {
    const n = (t - this._start) / this._step;
    return n >= 0 && n < this.size && n === Math.floor(n);
  }
  slice(t, n) {
    return Qr(t, n, this.size) ? this : (t = nr(t, this.size), n = ei(n, this.size), n <= t ? new Nt(0, 0) : new Nt(
      this.get(t, this._end),
      this.get(n, this._end),
      this._step
    ));
  }
  indexOf(t) {
    const n = t - this._start;
    if (n % this._step === 0) {
      const r = n / this._step;
      if (r >= 0 && r < this.size)
        return r;
    }
    return -1;
  }
  lastIndexOf(t) {
    return this.indexOf(t);
  }
  __iterate(t, n) {
    const r = this.size, i = this._step;
    let s = n ? this._start + (r - 1) * i : this._start, o = 0;
    for (; o !== r && t(s, n ? r - ++o : o++, this) !== !1; )
      s += n ? -i : i;
    return o;
  }
  __iterator(t, n) {
    const r = this.size, i = this._step;
    let s = n ? this._start + (r - 1) * i : this._start, o = 0;
    return new P(() => {
      if (o === r)
        return fe();
      const a = s;
      return s += n ? -i : i, U(t, n ? r - ++o : o++, a);
    });
  }
  equals(t) {
    return t instanceof Nt ? this._start === t._start && this._end === t._end && this._step === t._step : Ra(this, t);
  }
}
let Zs;
const Cf = "@@__IMMUTABLE_SET__@@";
function Is(e) {
  return !!(e && // @ts-expect-error: maybeSet is typed as `{}`,  need to change in 6.0 to `maybeSeq && typeof maybeSet === 'object' && MAYBE_SET_SYMBOL in maybeSet`
  e[Cf]);
}
let fi = class xo extends ht {
  // @pragma Construction
  constructor(t) {
    return t == null ? _r() : Is(t) && !st(t) ? t : _r().withMutations((n) => {
      const r = ht(t);
      Pe(r.size), r.forEach((i) => n.add(i));
    });
  }
  static of() {
    return this(arguments);
  }
  static fromKeys(t) {
    return this(qe(t).keySeq());
  }
  static intersect(t) {
    return t = oe(t).toArray(), t.length ? ce.intersect.apply(xo(t.pop()), t) : _r();
  }
  static union(t) {
    return t = oe(t).toArray(), t.length ? ce.union.apply(xo(t.pop()), t) : _r();
  }
  toString() {
    return this.__toString("Set {", "}");
  }
  // @pragma Access
  has(t) {
    return this._map.has(t);
  }
  // @pragma Modification
  add(t) {
    return Si(this, this._map.set(t, t));
  }
  remove(t) {
    return Si(this, this._map.remove(t));
  }
  clear() {
    return Si(this, this._map.clear());
  }
  // @pragma Composition
  map(t, n) {
    let r = !1;
    const i = Si(
      this,
      this._map.mapEntries(([, s]) => {
        const o = t.call(n, s, s, this);
        return o !== s && (r = !0), [o, o];
      }, n)
    );
    return r ? i : this;
  }
  union(...t) {
    return t = t.filter((n) => n.size !== 0), t.length === 0 ? this : this.size === 0 && !this.__ownerID && t.length === 1 ? this.constructor(t[0]) : this.withMutations((n) => {
      for (let r = 0; r < t.length; r++)
        typeof t[r] == "string" ? n.add(t[r]) : ht(t[r]).forEach((i) => n.add(i));
    });
  }
  intersect(...t) {
    if (t.length === 0)
      return this;
    t = t.map((r) => ht(r));
    const n = [];
    return this.forEach((r) => {
      t.every((i) => i.includes(r)) || n.push(r);
    }), this.withMutations((r) => {
      n.forEach((i) => {
        r.remove(i);
      });
    });
  }
  subtract(...t) {
    if (t.length === 0)
      return this;
    t = t.map((r) => ht(r));
    const n = [];
    return this.forEach((r) => {
      t.some((i) => i.includes(r)) && n.push(r);
    }), this.withMutations((r) => {
      n.forEach((i) => {
        r.remove(i);
      });
    });
  }
  sort(t) {
    return Gn(Wn(this, t));
  }
  sortBy(t, n) {
    return Gn(Wn(this, n, t));
  }
  wasAltered() {
    return this._map.wasAltered();
  }
  __iterate(t, n) {
    return this._map.__iterate((r) => t(r, r, this), n);
  }
  __iterator(t, n) {
    return this._map.__iterator(t, n);
  }
  __ensureOwner(t) {
    if (t === this.__ownerID)
      return this;
    const n = this._map.__ensureOwner(t);
    return t ? this.__make(n, t) : this.size === 0 ? this.__empty() : (this.__ownerID = t, this._map = n, this);
  }
};
fi.isSet = Is;
const ce = fi.prototype;
ce[Cf] = !0;
ce[Zr] = ce.remove;
ce.merge = ce.concat = ce.union;
ce.withMutations = oi;
ce.asImmutable = ti;
ce["@@transducer/init"] = ce.asMutable = ni;
ce["@@transducer/step"] = function(e, t) {
  return e.add(t);
};
ce["@@transducer/result"] = function(e) {
  return e.asImmutable();
};
ce.__empty = _r;
ce.__make = Pf;
function Si(e, t) {
  return e.__ownerID ? (e.size = t.size, e._map = t, e) : t === e._map ? e : t.size === 0 ? e.__empty() : e.__make(t);
}
function Pf(e, t) {
  const n = Object.create(ce);
  return n.size = e ? e.size : 0, n._map = e, n.__ownerID = t, n;
}
let zu;
function _r() {
  return zu || (zu = Pf(gt()));
}
function Ma(e, t, n) {
  const r = Ef(t);
  let i = 0;
  for (; i !== r.length; )
    if (e = Aa(e, r[i++], M), e === M)
      return n;
  return e;
}
function Vf(e, t) {
  return Ma(this, e, t);
}
function zf(e, t) {
  return Ma(e, t, M) !== M;
}
function bp(e) {
  return zf(this, e);
}
function Nf() {
  Pe(this.size);
  const e = {};
  return this.__iterate((t, n) => {
    ri(n) || (e[n] = t);
  }), e;
}
function Xi(e) {
  if (!e || typeof e != "object")
    return e;
  if (!xe(e)) {
    if (!Ht(e))
      return e;
    e = le(e);
  }
  if (L(e)) {
    const n = {};
    return e.__iterate((r, i) => {
      ri(i) || (n[i] = Xi(r));
    }), n;
  }
  const t = [];
  return e.__iterate((n) => {
    t.push(Xi(n));
  }), t;
}
function yp(e) {
  if (e.size === 1 / 0)
    return 0;
  const t = st(e), n = L(e);
  let r = t ? 1 : 0;
  return e.__iterate(
    n ? t ? (i, s) => {
      r = 31 * r + Nu(pe(i), pe(s)) | 0;
    } : (i, s) => {
      r = r + Nu(pe(i), pe(s)) | 0;
    } : t ? (i) => {
      r = 31 * r + pe(i) | 0;
    } : (i) => {
      r = r + pe(i) | 0;
    }
  ), mp(e.size, r);
}
function mp(e, t) {
  return t = cr(t, 3432918353), t = cr(t << 15 | t >>> -15, 461845907), t = cr(t << 13 | t >>> -13, 5), t = (t + 3864292196 | 0) ^ e, t = cr(t ^ t >>> 16, 2246822507), t = cr(t ^ t >>> 13, 3266489909), t = Ss(t ^ t >>> 16), t;
}
function Nu(e, t) {
  return e ^ t + 2654435769 + (e << 6) + (e >> 2) | 0;
}
function En(e, t) {
  const n = (r) => {
    e.prototype[r] = t[r];
  };
  return Object.keys(t).forEach(n), Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(t).forEach(n), e;
}
oe.Iterator = P;
En(oe, {
  // ### Conversion to other types
  toArray() {
    Pe(this.size);
    const e = new Array(this.size || 0), t = L(this);
    let n = 0;
    return this.__iterate((r, i) => {
      e[n++] = t ? [i, r] : r;
    }), e;
  },
  toIndexedSeq() {
    return new of(this);
  },
  toJS() {
    return Xi(this);
  },
  toKeyedSeq() {
    return new ws(this, !0);
  },
  toMap() {
    return Sn(this.toKeyedSeq());
  },
  toObject: Nf,
  toOrderedMap() {
    return St(this.toKeyedSeq());
  },
  toOrderedSet() {
    return Gn(L(this) ? this.valueSeq() : this);
  },
  toSet() {
    return fi(L(this) ? this.valueSeq() : this);
  },
  toSetSeq() {
    return new af(this);
  },
  toSeq() {
    return Ie(this) ? this.toIndexedSeq() : L(this) ? this.toKeyedSeq() : this.toSetSeq();
  },
  toStack() {
    return Ds(L(this) ? this.valueSeq() : this);
  },
  toList() {
    return ci(L(this) ? this.valueSeq() : this);
  },
  // ### Common JavaScript methods and properties
  toString() {
    return "[Collection]";
  },
  __toString(e, t) {
    return this.size === 0 ? e + t : e + " " + this.toSeq().map(this.__toStringMapper).join(", ") + " " + t;
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  concat(...e) {
    return N(this, Hd(this, e));
  },
  includes(e) {
    return this.some((t) => se(t, e));
  },
  entries() {
    return this.__iterator(ke);
  },
  every(e, t) {
    Pe(this.size);
    let n = !0;
    return this.__iterate((r, i, s) => {
      if (!e.call(t, r, i, s))
        return n = !1, !1;
    }), n;
  },
  filter(e, t) {
    return N(this, lf(this, e, t, !0));
  },
  partition(e, t) {
    return Kd(this, e, t);
  },
  find(e, t, n) {
    const r = this.findEntry(e, t);
    return r ? r[1] : n;
  },
  forEach(e, t) {
    return Pe(this.size), this.__iterate(t ? e.bind(t) : e);
  },
  join(e) {
    Pe(this.size), e = e !== void 0 ? "" + e : ",";
    let t = "", n = !0;
    return this.__iterate((r) => {
      n ? n = !1 : t += e, t += r != null ? r.toString() : "";
    }), t;
  },
  keys() {
    return this.__iterator(tr);
  },
  map(e, t) {
    return N(this, ff(this, e, t));
  },
  reduce(e, t, n) {
    return Cu(
      this,
      e,
      t,
      n,
      arguments.length < 2,
      !1
    );
  },
  reduceRight(e, t, n) {
    return Cu(
      this,
      e,
      t,
      n,
      arguments.length < 2,
      !0
    );
  },
  reverse() {
    return N(this, fa(this, !0));
  },
  slice(e, t) {
    return N(this, la(this, e, t, !0));
  },
  some(e, t) {
    Pe(this.size);
    let n = !1;
    return this.__iterate((r, i, s) => {
      if (e.call(t, r, i, s))
        return n = !0, !1;
    }), n;
  },
  sort(e) {
    return N(this, Wn(this, e));
  },
  values() {
    return this.__iterator(Ue);
  },
  // ### More sequential methods
  butLast() {
    return this.slice(0, -1);
  },
  isEmpty() {
    return this.size !== void 0 ? this.size === 0 : !this.some(() => !0);
  },
  count(e, t) {
    return kn(
      e ? this.toSeq().filter(e, t) : this
    );
  },
  countBy(e, t) {
    return Ud(this, e, t);
  },
  equals(e) {
    return Ra(this, e);
  },
  entrySeq() {
    const e = this;
    if (e._cache)
      return new Kn(e._cache);
    const t = e.toSeq().map(gp).toIndexedSeq();
    return t.fromEntrySeq = () => e.toSeq(), t;
  },
  filterNot(e, t) {
    return this.filter(Js(e), t);
  },
  findEntry(e, t, n) {
    let r = n;
    return this.__iterate((i, s, o) => {
      if (e.call(t, i, s, o))
        return r = [s, i], !1;
    }), r;
  },
  findKey(e, t) {
    const n = this.findEntry(e, t);
    return n && n[0];
  },
  findLast(e, t, n) {
    return this.toKeyedSeq().reverse().find(e, t, n);
  },
  findLastEntry(e, t, n) {
    return this.toKeyedSeq().reverse().findEntry(e, t, n);
  },
  findLastKey(e, t) {
    return this.toKeyedSeq().reverse().findKey(e, t);
  },
  first(e) {
    return this.find(Zc, null, e);
  },
  flatMap(e, t) {
    return N(this, Gd(this, e, t));
  },
  flatten(e) {
    return N(this, _f(this, e, !0));
  },
  fromEntrySeq() {
    return new uf(this);
  },
  get(e, t) {
    return this.find((n, r) => se(r, e), void 0, t);
  },
  getIn: Vf,
  groupBy(e, t) {
    return kd(this, e, t);
  },
  has(e) {
    return this.get(e, M) !== M;
  },
  hasIn: bp,
  isSubset(e) {
    return e = typeof e.includes == "function" ? e : oe(e), this.every((t) => e.includes(t));
  },
  isSuperset(e) {
    return e = typeof e.isSubset == "function" ? e : oe(e), e.isSubset(this);
  },
  keyOf(e) {
    return this.findKey((t) => se(t, e));
  },
  keySeq() {
    return this.toSeq().map(pp).toIndexedSeq();
  },
  last(e) {
    return this.toSeq().reverse().first(e);
  },
  lastKeyOf(e) {
    return this.toKeyedSeq().reverse().keyOf(e);
  },
  max(e) {
    return bi(this, e);
  },
  maxBy(e, t) {
    return bi(this, t, e);
  },
  min(e) {
    return bi(
      this,
      e ? Pu(e) : Vu
    );
  },
  minBy(e, t) {
    return bi(
      this,
      t ? Pu(t) : Vu,
      e
    );
  },
  rest() {
    return this.slice(1);
  },
  skip(e) {
    return e === 0 ? this : this.slice(Math.max(0, e));
  },
  skipLast(e) {
    return e === 0 ? this : this.slice(0, -Math.max(0, e));
  },
  skipWhile(e, t) {
    return N(this, hf(this, e, t, !0));
  },
  skipUntil(e, t) {
    return this.skipWhile(Js(e), t);
  },
  sortBy(e, t) {
    return N(this, Wn(this, t, e));
  },
  take(e) {
    return this.slice(0, Math.max(0, e));
  },
  takeLast(e) {
    return this.slice(-Math.max(0, e));
  },
  takeWhile(e, t) {
    return N(this, Wd(this, e, t));
  },
  takeUntil(e, t) {
    return this.takeWhile(Js(e), t);
  },
  update(e) {
    return e(this);
  },
  valueSeq() {
    return this.toIndexedSeq();
  },
  // ### Hashable Object
  hashCode() {
    return this.__hash || (this.__hash = yp(this));
  }
  // ### Internal
  // abstract __iterate(fn, reverse)
  // abstract __iterator(type, reverse)
});
const he = oe.prototype;
he[Xc] = !0;
he[ys] = he.values;
he.toJSON = he.toArray;
he.__toStringMapper = Rr;
he.inspect = he.toSource = function() {
  return this.toString();
};
he.chain = he.flatMap;
he.contains = he.includes;
En(qe, {
  // ### More sequential methods
  flip() {
    return N(this, cf(this));
  },
  mapEntries(e, t) {
    let n = 0;
    return N(
      this,
      this.toSeq().map((r, i) => e.call(t, [i, r], n++, this)).fromEntrySeq()
    );
  },
  mapKeys(e, t) {
    return N(
      this,
      this.toSeq().flip().map((n, r) => e.call(t, n, r, this)).flip()
    );
  }
});
const li = qe.prototype;
li[Hi] = !0;
li[ys] = he.entries;
li.toJSON = Nf;
li.__toStringMapper = (e, t) => Rr(t) + ": " + Rr(e);
En(it, {
  // ### Conversion to other types
  toKeyedSeq() {
    return new ws(this, !1);
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  filter(e, t) {
    return N(this, lf(this, e, t, !1));
  },
  findIndex(e, t) {
    const n = this.findEntry(e, t);
    return n ? n[0] : -1;
  },
  indexOf(e) {
    const t = this.keyOf(e);
    return t === void 0 ? -1 : t;
  },
  lastIndexOf(e) {
    const t = this.lastKeyOf(e);
    return t === void 0 ? -1 : t;
  },
  reverse() {
    return N(this, fa(this, !1));
  },
  slice(e, t) {
    return N(this, la(this, e, t, !1));
  },
  splice(e, t) {
    const n = arguments.length;
    if (t = Math.max(t || 0, 0), n === 0 || n === 2 && !t)
      return this;
    e = nr(e, e < 0 ? this.count() : this.size);
    const r = this.slice(0, e);
    return N(
      this,
      n === 1 ? r : r.concat(_t(arguments, 2), this.slice(e + t))
    );
  },
  // ### More collection methods
  findLastIndex(e, t) {
    const n = this.findLastEntry(e, t);
    return n ? n[0] : -1;
  },
  first(e) {
    return this.get(0, e);
  },
  flatten(e) {
    return N(this, _f(this, e, !1));
  },
  get(e, t) {
    return e = Wt(this, e), e < 0 || this.size === 1 / 0 || this.size !== void 0 && e > this.size ? t : this.find((n, r) => r === e, void 0, t);
  },
  has(e) {
    return e = Wt(this, e), e >= 0 && (this.size !== void 0 ? this.size === 1 / 0 || e < this.size : this.find((t, n) => n === e, void 0, M) !== M);
  },
  interpose(e) {
    return N(this, Yd(this, e));
  },
  interleave() {
    const e = [this].concat(_t(arguments)), t = yi(this.toSeq(), Re.of, e), n = t.flatten(!0);
    return t.size && (n.size = t.size * e.length), N(this, n);
  },
  keySeq() {
    return Nt(0, this.size);
  },
  last(e) {
    return this.get(-1, e);
  },
  skipWhile(e, t) {
    return N(this, hf(this, e, t, !1));
  },
  zip() {
    const e = [this].concat(_t(arguments));
    return N(this, yi(this, $u, e));
  },
  zipAll() {
    const e = [this].concat(_t(arguments));
    return N(this, yi(this, $u, e, !0));
  },
  zipWith(e) {
    const t = _t(arguments);
    return t[0] = this, N(this, yi(this, e, t));
  }
});
const ir = it.prototype;
ir[Fi] = !0;
ir[Ft] = !0;
En(ht, {
  // ### ES6 Collection methods (ES6 Array and Map)
  get(e, t) {
    return this.has(e) ? e : t;
  },
  includes(e) {
    return this.has(e);
  },
  // ### More sequential methods
  keySeq() {
    return this.valueSeq();
  }
});
const Hn = ht.prototype;
Hn.has = he.includes;
Hn.contains = Hn.includes;
Hn.keys = Hn.values;
En(Zt, li);
En(Re, ir);
En(Qt, Hn);
function $u() {
  return _t(arguments);
}
function Ca(e) {
  return Is(e) && st(e);
}
class Gn extends fi {
  // @pragma Construction
  constructor(t) {
    return t == null ? To() : Ca(t) ? t : To().withMutations((n) => {
      const r = ht(t);
      Pe(r.size), r.forEach((i) => n.add(i));
    });
  }
  static of() {
    return this(arguments);
  }
  static fromKeys(t) {
    return this(qe(t).keySeq());
  }
  toString() {
    return this.__toString("OrderedSet {", "}");
  }
}
Gn.isOrderedSet = Ca;
const On = Gn.prototype;
On[Ft] = !0;
On.zip = ir.zip;
On.zipWith = ir.zipWith;
On.zipAll = ir.zipAll;
On.__empty = To;
On.__make = $f;
function $f(e, t) {
  const n = Object.create(On);
  return n.size = e ? e.size : 0, n._map = e, n.__ownerID = t, n;
}
let ju;
function To() {
  return ju || (ju = $f(lr()));
}
const vp = {
  LeftThenRight: -1,
  RightThenLeft: 1
};
function Sp(e) {
  if (Jt(e))
    throw new Error(
      "Can not call `Record` with an immutable Record as default values. Use a plain javascript object instead."
    );
  if (Ze(e))
    throw new Error(
      "Can not call `Record` with an immutable Collection as default values. Use a plain javascript object instead."
    );
  if (e === null || typeof e != "object")
    throw new Error(
      "Can not call `Record` with a non-object as default values. Use a plain javascript object instead."
    );
}
class xs {
  constructor(t, n) {
    let r;
    Sp(t);
    const i = function(a) {
      if (a instanceof i)
        return a;
      if (!(this instanceof i))
        return new i(a);
      if (!r) {
        r = !0;
        const u = Object.keys(t), f = s._indices = {};
        s._name = n, s._keys = u, s._defaultValues = t;
        for (let c = 0; c < u.length; c++) {
          const l = u[c];
          f[l] = c, s[l] ? typeof console == "object" && console.warn && console.warn(
            "Cannot define " + Ro(this) + ' with property "' + l + '" since that property name is part of the Record API.'
          ) : wp(s, l);
        }
      }
      return this.__ownerID = void 0, this._values = ci().withMutations((u) => {
        u.setSize(this._keys.length), qe(a).forEach((f, c) => {
          u.set(this._indices[c], f === this._defaultValues[c] ? void 0 : f);
        });
      }), this;
    }, s = i.prototype = Object.create(B);
    return s.constructor = i, n && (i.displayName = n), i;
  }
  toString() {
    let t = Ro(this) + " { ";
    const n = this._keys;
    let r;
    for (let i = 0, s = n.length; i !== s; i++)
      r = n[i], t += (i ? ", " : "") + r + ": " + Rr(this.get(r));
    return t + " }";
  }
  equals(t) {
    return this === t || Jt(t) && xn(this).equals(xn(t));
  }
  hashCode() {
    return xn(this).hashCode();
  }
  // @pragma Access
  has(t) {
    return this._indices.hasOwnProperty(t);
  }
  get(t, n) {
    if (!this.has(t))
      return n;
    const r = this._indices[t], i = this._values.get(r);
    return i === void 0 ? this._defaultValues[t] : i;
  }
  // @pragma Modification
  set(t, n) {
    if (this.has(t)) {
      const r = this._values.set(
        this._indices[t],
        n === this._defaultValues[t] ? void 0 : n
      );
      if (r !== this._values && !this.__ownerID)
        return Qs(this, r);
    }
    return this;
  }
  remove(t) {
    return this.set(t);
  }
  clear() {
    const t = this._values.clear().setSize(this._keys.length);
    return this.__ownerID ? this : Qs(this, t);
  }
  wasAltered() {
    return this._values.wasAltered();
  }
  toSeq() {
    return xn(this);
  }
  toJS() {
    return Xi(this);
  }
  entries() {
    return this.__iterator(ke);
  }
  __iterator(t, n) {
    return xn(this).__iterator(t, n);
  }
  __iterate(t, n) {
    return xn(this).__iterate(t, n);
  }
  __ensureOwner(t) {
    if (t === this.__ownerID)
      return this;
    const n = this._values.__ensureOwner(t);
    return t ? Qs(this, n, t) : (this.__ownerID = t, this._values = n, this);
  }
}
xs.isRecord = Jt;
xs.getDescriptiveName = Ro;
const B = xs.prototype;
B[tf] = !0;
B[Zr] = B.remove;
B.deleteIn = B.removeIn = Da;
B.getIn = Vf;
B.hasIn = he.hasIn;
B.merge = pf;
B.mergeWith = gf;
B.mergeIn = ba;
B.mergeDeep = yf;
B.mergeDeepWith = mf;
B.mergeDeepIn = ga;
B.setIn = ya;
B.update = ma;
B.updateIn = va;
B.withMutations = oi;
B.asMutable = ni;
B.asImmutable = ti;
B[ys] = B.entries;
B.toJSON = B.toObject = he.toObject;
B.inspect = B.toSource = function() {
  return this.toString();
};
function Qs(e, t, n) {
  const r = Object.create(Object.getPrototypeOf(e));
  return r._values = t, r.__ownerID = n, r;
}
function Ro(e) {
  return e.constructor.displayName || e.constructor.name || "Record";
}
function xn(e) {
  return ua(e._keys.map((t) => [t, e.get(t)]));
}
function wp(e, t) {
  try {
    Object.defineProperty(e, t, {
      get: function() {
        return this.get(t);
      },
      set: function(n) {
        gr(this.__ownerID, "Cannot set on an immutable record."), this.set(t, n);
      }
    });
  } catch {
  }
}
class Cn extends Re {
  constructor(t, n) {
    if (!(this instanceof Cn))
      return new Cn(t, n);
    if (this._value = t, this.size = n === void 0 ? 1 / 0 : Math.max(0, n), this.size === 0) {
      if (eo)
        return eo;
      eo = this;
    }
  }
  toString() {
    return this.size === 0 ? "Repeat []" : "Repeat [ " + this._value + " " + this.size + " times ]";
  }
  get(t, n) {
    return this.has(t) ? this._value : n;
  }
  includes(t) {
    return se(this._value, t);
  }
  slice(t, n) {
    const r = this.size;
    return Qr(t, n, r) ? this : new Cn(
      this._value,
      ei(n, r) - nr(t, r)
    );
  }
  reverse() {
    return this;
  }
  indexOf(t) {
    return this.size !== 0 && se(this._value, t) ? 0 : -1;
  }
  lastIndexOf(t) {
    return this.size !== 0 && se(this._value, t) ? this.size - 1 : -1;
  }
  __iterate(t, n) {
    const r = this.size;
    let i = 0;
    for (; i !== r && t(this._value, n ? r - ++i : i++, this) !== !1; )
      ;
    return i;
  }
  __iterator(t, n) {
    const r = this.size;
    let i = 0;
    return new P(
      () => i === r ? fe() : U(t, n ? r - ++i : i++, this._value)
    );
  }
  equals(t) {
    return t instanceof Cn ? se(this._value, t._value) : Ra(this, t);
  }
}
let eo;
function Ep(e, t) {
  return jf(
    [],
    t || Op,
    e,
    "",
    t && t.length > 2 ? [] : void 0,
    { "": e }
  );
}
function jf(e, t, n, r, i, s) {
  if (typeof n != "string" && !Ze(n) && (sa(n) || ra(n) || pa(n))) {
    if (~e.indexOf(n))
      throw new TypeError("Cannot convert circular structure to Immutable");
    e.push(n), i && r !== "" && i.push(r);
    const o = t.call(
      s,
      r,
      le(n).map(
        (a, u) => jf(e, t, a, u, i, n)
      ),
      i && i.slice()
    );
    return e.pop(), i && i.pop(), o;
  }
  return n;
}
function Op(e, t) {
  return Ie(t) ? t.toList() : L(t) ? t.toMap() : t.toSet();
}
const Ap = "5.1.9", Dp = oe, Ug = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Collection: oe,
  Iterable: Dp,
  List: ci,
  Map: Sn,
  OrderedMap: St,
  OrderedSet: Gn,
  PairSorting: vp,
  Range: Nt,
  Record: xs,
  Repeat: Cn,
  Seq: le,
  Set: fi,
  Stack: Ds,
  fromJS: Ep,
  get: Aa,
  getIn: Ma,
  has: Of,
  hasIn: zf,
  hash: pe,
  is: se,
  isAssociative: bs,
  isCollection: xe,
  isImmutable: Ze,
  isIndexed: Ie,
  isKeyed: L,
  isList: Ia,
  isMap: Es,
  isOrdered: st,
  isOrderedMap: xa,
  isOrderedSet: Ca,
  isPlainObject: pa,
  isRecord: Jt,
  isSeq: vs,
  isSet: Is,
  isStack: Yi,
  isValueObject: Do,
  merge: Jd,
  mergeDeep: Qd,
  mergeDeepWith: ep,
  mergeWith: Zd,
  remove: Af,
  removeIn: xf,
  set: Df,
  setIn: vf,
  update: da,
  updateIn: wn,
  version: Ap
}, Symbol.toStringTag, { value: "Module" })), Ip = Symbol.for("preact-signals"), bt = 1, Yn = 2, Pr = 4, sr = 8, Ti = 16, Xn = 32;
function Ts() {
  Nn++;
}
function Rs() {
  if (Nn > 1) {
    Nn--;
    return;
  }
  let e, t = !1;
  for (Rp(); yr !== void 0; ) {
    let n = yr;
    for (yr = void 0, Ji++; n !== void 0; ) {
      const r = n._nextBatchedEffect;
      if (n._nextBatchedEffect = void 0, n._flags &= ~Yn, !(n._flags & sr) && qf(n))
        try {
          n._callback();
        } catch (i) {
          t || (e = i, t = !0);
        }
      n = r;
    }
  }
  if (Ji = 0, Nn--, t)
    throw e;
}
function Lf(e) {
  if (Nn > 0)
    return e();
  Mo = ++xp, Ts();
  try {
    return e();
  } finally {
    Rs();
  }
}
let K, He;
function or(e) {
  const t = K, n = He;
  K = void 0, He = void 0;
  try {
    return e();
  } finally {
    K = t, He = n;
  }
}
let yr, Nn = 0, Ji = 0, xp = 0, Mo = 0, Zi, Qi = 0;
function Tp(e) {
  Nn === 0 || Ji !== 0 || e._batchSnapshotVersion !== Mo && (e._batchSnapshotVersion = Mo, Zi = {
    _source: e,
    _value: e._value,
    _version: e._version,
    _next: Zi
  });
}
function Rp() {
  let e = Zi;
  for (Zi = void 0; e !== void 0; ) {
    const t = e._source;
    if (t._value === e._value)
      for (let n = t._targets; n !== void 0; n = n._nextTarget)
        n._version === e._version && (n._version = t._version);
    e = e._next;
  }
}
function Bf(e) {
  if (K === void 0)
    return;
  let t = e._node;
  if (t === void 0 || t._target !== K)
    return t = {
      _version: 0,
      _source: e,
      _prevSource: K._sources,
      _nextSource: void 0,
      _target: K,
      _prevTarget: void 0,
      _nextTarget: void 0,
      _rollbackNode: t
    }, K._sources !== void 0 && (K._sources._nextSource = t), K._sources = t, e._node = t, K._flags & Xn && e._subscribe(t), t;
  if (t._version === -1)
    return t._version = 0, t._nextSource !== void 0 && (t._nextSource._prevSource = t._prevSource, t._prevSource !== void 0 && (t._prevSource._nextSource = t._nextSource), t._prevSource = K._sources, t._nextSource = void 0, K._sources._nextSource = t, K._sources = t), t;
}
function _e(e, t) {
  this._value = e, this._version = 0, this._node = void 0, this._targets = void 0, this._batchSnapshotVersion = 0, this._watched = t?.watched, this._unwatched = t?.unwatched, this.name = t?.name;
}
_e.prototype.brand = Ip;
_e.prototype._refresh = function() {
  return !0;
};
_e.prototype._subscribe = function(e) {
  const t = this._targets;
  t !== e && e._prevTarget === void 0 && (e._nextTarget = t, this._targets = e, t !== void 0 ? t._prevTarget = e : or(() => {
    this._watched?.call(this);
  }));
};
_e.prototype._unsubscribe = function(e) {
  if (this._targets !== void 0) {
    const t = e._prevTarget, n = e._nextTarget;
    t !== void 0 && (t._nextTarget = n, e._prevTarget = void 0), n !== void 0 && (n._prevTarget = t, e._nextTarget = void 0), e === this._targets && (this._targets = n, n === void 0 && or(() => {
      this._unwatched?.call(this);
    }));
  }
};
_e.prototype.subscribe = function(e) {
  return Wf(
    () => {
      const t = this.value;
      or(() => e(t));
    },
    { name: "sub" }
  );
};
_e.prototype.valueOf = function() {
  return this.value;
};
_e.prototype.toString = function() {
  return this.value + "";
};
_e.prototype.toJSON = function() {
  return this.value;
};
_e.prototype.peek = function() {
  return or(() => this.value);
};
Object.defineProperty(_e.prototype, "value", {
  get() {
    const e = Bf(this);
    return e !== void 0 && (e._version = this._version), this._value;
  },
  set(e) {
    if (e !== this._value) {
      if (Ji > 100)
        throw new Error("Cycle detected");
      Tp(this), this._value = e, this._version++, Qi++, Ts();
      try {
        for (let t = this._targets; t !== void 0; t = t._nextTarget)
          t._target._notify();
      } finally {
        Rs();
      }
    }
  }
});
function Mp(e, t) {
  return new _e(e, t);
}
function qf(e) {
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
function Uf(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource) {
    const n = t._source._node;
    if (n !== void 0 && (t._rollbackNode = n), t._source._node = t, t._version = -1, t._nextSource === void 0) {
      e._sources = t;
      break;
    }
  }
}
function kf(e) {
  let t = e._sources, n;
  for (; t !== void 0; ) {
    const r = t._prevSource;
    t._version === -1 ? (t._source._unsubscribe(t), r !== void 0 && (r._nextSource = t._nextSource), t._nextSource !== void 0 && (t._nextSource._prevSource = r)) : n = t, t._source._node = t._rollbackNode, t._rollbackNode !== void 0 && (t._rollbackNode = void 0), t = r;
  }
  e._sources = n;
}
function tn(e, t) {
  _e.call(this, void 0, t), this._fn = e, this._sources = void 0, this._globalVersion = Qi - 1, this._flags = Pr;
}
tn.prototype = new _e();
tn.prototype._refresh = function() {
  if (this._flags &= ~Yn, this._flags & bt)
    return !1;
  if ((this._flags & (Pr | Xn)) === Xn || (this._flags &= ~Pr, this._globalVersion === Qi))
    return !0;
  if (this._globalVersion = Qi, this._flags |= bt, this._version > 0 && !qf(this))
    return this._flags &= ~bt, !0;
  const e = K;
  try {
    Uf(this), K = this;
    const t = this._fn();
    (this._flags & Ti || this._value !== t || this._version === 0) && (this._value = t, this._flags &= ~Ti, this._version++);
  } catch (t) {
    this._value = t, this._flags |= Ti, this._version++;
  }
  return K = e, kf(this), this._flags &= ~bt, !0;
};
tn.prototype._subscribe = function(e) {
  if (this._targets === void 0) {
    this._flags |= Pr | Xn;
    for (let t = this._sources; t !== void 0; t = t._nextSource)
      t._source._subscribe(t);
  }
  _e.prototype._subscribe.call(this, e);
};
tn.prototype._unsubscribe = function(e) {
  if (this._targets !== void 0 && (_e.prototype._unsubscribe.call(this, e), this._targets === void 0)) {
    this._flags &= ~Xn;
    for (let t = this._sources; t !== void 0; t = t._nextSource)
      t._source._unsubscribe(t);
  }
};
tn.prototype._notify = function() {
  if (!(this._flags & Yn)) {
    this._flags |= Pr | Yn;
    for (let e = this._targets; e !== void 0; e = e._nextTarget)
      e._target._notify();
  }
};
Object.defineProperty(tn.prototype, "value", {
  get() {
    if (this._flags & bt)
      throw new Error("Cycle detected");
    const e = Bf(this);
    if (this._refresh(), e !== void 0 && (e._version = this._version), this._flags & Ti)
      throw this._value;
    return this._value;
  }
});
function Cp(e, t) {
  return new tn(e, t);
}
function Kf(e) {
  const t = e._cleanup;
  if (e._cleanup = void 0, typeof t == "function") {
    Ts();
    const n = K;
    K = void 0;
    try {
      t();
    } catch (r) {
      throw e._flags &= ~bt, e._flags |= sr, Pa(e), r;
    } finally {
      K = n, Rs();
    }
  }
}
function Pa(e) {
  for (let t = e._sources; t !== void 0; t = t._nextSource)
    t._source._unsubscribe(t);
  e._fn = void 0, e._sources = void 0, Kf(e);
}
function Pp(e) {
  if (K !== this)
    throw new Error("Out-of-order effect");
  kf(this), K = e, this._flags &= ~bt, this._flags & sr && Pa(this), Rs();
}
function An(e, t) {
  this._fn = e, this._cleanup = void 0, this._sources = void 0, this._nextBatchedEffect = void 0, this._flags = Xn, this.name = t?.name, He && He.push(this);
}
An.prototype._callback = function() {
  const e = this._start();
  try {
    if (this._flags & sr || this._fn === void 0) return;
    const t = this._fn();
    typeof t == "function" && (this._cleanup = t);
  } finally {
    e();
  }
};
An.prototype._start = function() {
  if (this._flags & bt)
    throw new Error("Cycle detected");
  this._flags |= bt, this._flags &= ~sr, Kf(this), Uf(this), Ts();
  const e = K;
  return K = this, Pp.bind(this, e);
};
An.prototype._notify = function() {
  this._flags & Yn || (this._flags |= Yn, this._nextBatchedEffect = yr, yr = this);
};
An.prototype._dispose = function() {
  this._flags |= sr, this._flags & bt || Pa(this);
};
An.prototype.dispose = function() {
  this._dispose();
};
function Wf(e, t) {
  const n = new An(e, t);
  try {
    n._callback();
  } catch (i) {
    throw n._dispose(), i;
  }
  const r = n._dispose.bind(n);
  return r[Symbol.dispose] = r, r;
}
function Va(e) {
  return function(...n) {
    return Lf(() => or(() => e.apply(this, n)));
  };
}
function Vp() {
  let e = He;
  return He = [], function() {
    let n = He;
    return He && e && (e = e.concat(He)), He = e, n;
  };
}
const Ff = (e) => {
  for (const t in e) {
    const n = e[t];
    typeof n == "function" ? e[t] = Va(n) : typeof n == "object" && n !== null && !("brand" in n) && Ff(n);
  }
};
function zp(e) {
  return function(...n) {
    let r, i;
    const s = Vp();
    try {
      i = e(...n);
    } catch (o) {
      throw He = void 0, o;
    } finally {
      r = s();
    }
    return Ff(i), i[Symbol.dispose] = Va(function() {
      if (r)
        for (let a = 0; a < r.length; a++)
          r[a].dispose();
      r = void 0;
    }), i;
  };
}
const kg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Computed: tn,
  Effect: An,
  Signal: _e,
  action: Va,
  batch: Lf,
  computed: Cp,
  createModel: zp,
  effect: Wf,
  signal: Mp,
  untracked: or
}, Symbol.toStringTag, { value: "Module" }));
var R = /* @__PURE__ */ ((e) => (e[e.None = 0] = "None", e[e.Mutable = 1] = "Mutable", e[e.Watching = 2] = "Watching", e[e.RecursedCheck = 4] = "RecursedCheck", e[e.Recursed = 8] = "Recursed", e[e.Dirty = 16] = "Dirty", e[e.Pending = 32] = "Pending", e))(R || {});
function Hf({
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
    const _ = c.depsTail;
    if (_ !== void 0 && _.dep === f)
      return;
    const d = _ !== void 0 ? _.nextDep : c.deps;
    if (d !== void 0 && d.dep === f) {
      d.version = l, c.depsTail = d;
      return;
    }
    const h = f.subsTail;
    if (h !== void 0 && h.version === l && h.sub === c)
      return;
    const p = c.depsTail = f.subsTail = {
      version: l,
      dep: f,
      sub: c,
      prevDep: _,
      nextDep: d,
      prevSub: h,
      nextSub: void 0
    };
    d !== void 0 && (d.prevDep = p), _ !== void 0 ? _.nextDep = p : c.deps = p, h !== void 0 ? h.nextSub = p : f.subs = p;
  }
  function i(f, c = f.sub) {
    const { dep: l, prevDep: _, nextDep: d, nextSub: h, prevSub: p } = f;
    return d !== void 0 ? d.prevDep = _ : c.depsTail = _, _ !== void 0 ? _.nextDep = d : c.deps = d, h !== void 0 ? h.prevSub = p : l.subsTail = p, p !== void 0 ? p.nextSub = h : (l.subs = h) === void 0 && n(l), d;
  }
  function s(f, c) {
    let l = f.nextSub, _;
    e: do {
      const d = f.sub;
      let h = d.flags;
      if (h & 60 ? h & 12 ? h & 4 ? !(h & 48) && u(f, d) ? (d.flags = h | 40, h &= 1) : h = 0 : d.flags = h & -9 | 32 : h = 0 : (d.flags = h | 32, c && (d.flags |= 8)), h & 2 && t(d), h & 1) {
        const p = d.subs;
        if (p !== void 0) {
          const b = (f = p).nextSub;
          b !== void 0 && (_ = { value: l, prev: _ }, l = b);
          continue;
        }
      }
      if ((f = l) !== void 0) {
        l = f.nextSub;
        continue;
      }
      for (; _ !== void 0; )
        if (f = _.value, _ = _.prev, f !== void 0) {
          l = f.nextSub;
          continue e;
        }
      break;
    } while (!0);
  }
  function o(f, c) {
    let l, _ = 0, d = !1;
    e: do {
      const h = f.dep, p = h.flags;
      if (c.flags & 16)
        d = !0;
      else if ((p & 17) === 17) {
        const b = h.subs;
        e(h) && (b.nextSub !== void 0 && a(b), d = !0);
      } else if ((p & 33) === 33) {
        l = { value: f, prev: l }, f = h.deps, c = h, ++_;
        continue;
      }
      if (!d) {
        const b = f.nextDep;
        if (b !== void 0) {
          f = b;
          continue;
        }
      }
      for (; _--; ) {
        if (f = l.value, l = l.prev, d) {
          const S = c.subs;
          if (e(c)) {
            S.nextSub !== void 0 && a(S), c = f.sub;
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
      return d && !!c.flags;
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
const Kg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ReactiveFlags: R,
  createReactiveSystem: Hf
}, Symbol.toStringTag, { value: "Module" })), Vr = 64;
let Ms = 0, Jn = 0, Zn = 0, rn = 0, mr = 0, De;
const xt = [], {
  link: Cs,
  unlink: ar,
  propagate: Gf,
  checkDirty: Yf,
  shallowPropagate: za
} = Hf({
  update(e) {
    return "getter" in e ? Xf(e) : "currentValue" in e ? Jf(e) : (e.flags = R.Mutable, !0);
  },
  notify(e) {
    let t = mr, n = t;
    do
      if (xt[t++] = e, e.flags &= ~R.Watching, e = e.subs?.sub, e === void 0 || !(e.flags & R.Watching))
        break;
    while (!0);
    for (mr = t; n < --t; ) {
      const r = xt[n];
      xt[n++] = xt[t], xt[t] = r;
    }
  },
  unwatched(e) {
    "getter" in e ? e.depsTail !== void 0 && (e.flags = R.Mutable | R.Dirty, tl(e)) : "currentValue" in e || ("fn" in e ? $a.call(e) : Ps.call(e));
  }
});
function Np() {
  return De;
}
function Dn(e) {
  const t = De;
  return De = e, t;
}
function $p() {
  return Zn;
}
function jp() {
  ++Zn;
}
function Lp() {
  --Zn || Na();
}
function Bp(e) {
  return e.name === "bound " + Qf.name;
}
function qp(e) {
  return e.name === "bound " + Zf.name;
}
function Up(e) {
  return e.name === "bound " + $a.name;
}
function kp(e) {
  return e.name === "bound " + Ps.name;
}
function Kp(e) {
  return Qf.bind({
    currentValue: e,
    pendingValue: e,
    subs: void 0,
    subsTail: void 0,
    flags: R.Mutable
  });
}
function Wp(e) {
  return Zf.bind({
    value: void 0,
    subs: void 0,
    subsTail: void 0,
    deps: void 0,
    depsTail: void 0,
    flags: R.None,
    getter: e
  });
}
function Fp(e) {
  const t = {
    fn: e,
    cleanup: void 0,
    subs: void 0,
    subsTail: void 0,
    deps: void 0,
    depsTail: void 0,
    flags: R.Watching | R.RecursedCheck
  }, n = Dn(t);
  n !== void 0 && (Cs(t, n, 0), n.flags |= Vr);
  try {
    ++Jn, t.cleanup = t.fn();
  } finally {
    --Jn, De = n, t.flags &= ~R.RecursedCheck;
  }
  return $a.bind(t);
}
function Hp(e) {
  const t = {
    deps: void 0,
    depsTail: void 0,
    subs: void 0,
    subsTail: void 0,
    flags: R.Mutable
  }, n = Dn(t);
  n !== void 0 && (Cs(t, n, 0), n.flags |= Vr);
  try {
    e();
  } finally {
    De = n;
  }
  return Ps.bind(t);
}
function Gp(e) {
  const t = {
    deps: void 0,
    depsTail: void 0,
    flags: R.Watching | R.RecursedCheck
  }, n = Dn(t);
  ++Zn;
  try {
    e();
  } finally {
    De = n, t.flags = R.None;
    let r = t.deps;
    for (; r !== void 0; ) {
      const i = r.dep;
      r = ar(r, t);
      const s = i.subs;
      s !== void 0 && (Gf(s, !!Jn), za(s));
    }
    --Zn || Na();
  }
}
function Xf(e) {
  if (e.flags & Vr) {
    let n = e.depsTail;
    for (; n !== void 0; ) {
      const r = n.prevDep, i = n.dep;
      !("getter" in i) && !("currentValue" in i) && ar(n, e), n = r;
    }
  }
  e.depsTail = void 0, e.flags = R.Mutable | R.RecursedCheck;
  const t = Dn(e);
  try {
    ++Ms;
    const n = e.value;
    return n !== (e.value = e.getter(n));
  } finally {
    De = t, e.flags &= ~R.RecursedCheck, nl(e);
  }
}
function Jf(e) {
  return e.flags = R.Mutable, e.currentValue !== (e.currentValue = e.pendingValue);
}
function Yp(e) {
  const t = e.flags;
  if (t & R.Dirty || t & R.Pending && Yf(e.deps, e)) {
    if (t & Vr) {
      let r = e.depsTail;
      for (; r !== void 0; ) {
        const i = r.prevDep, s = r.dep;
        !("getter" in s) && !("currentValue" in s) && ar(r, e), r = i;
      }
    }
    if (e.cleanup && (el(e), !e.flags))
      return;
    e.depsTail = void 0, e.flags = R.Watching | R.RecursedCheck;
    const n = Dn(e);
    try {
      ++Ms, ++Jn, e.cleanup = e.fn();
    } finally {
      --Jn, De = n, e.flags &= ~R.RecursedCheck, nl(e);
    }
  } else e.deps !== void 0 && (e.flags = R.Watching | t & Vr);
}
function Na() {
  try {
    for (; rn < mr; ) {
      const e = xt[rn];
      xt[rn++] = void 0, Yp(e);
    }
  } finally {
    for (; rn < mr; ) {
      const e = xt[rn];
      xt[rn++] = void 0, e.flags |= R.Watching | R.Recursed;
    }
    rn = 0, mr = 0;
  }
}
function Zf() {
  const e = this.flags;
  if (e & R.Dirty || e & R.Pending && (Yf(this.deps, this) || (this.flags = e & ~R.Pending, !1))) {
    if (Xf(this)) {
      const n = this.subs;
      n !== void 0 && za(n);
    }
  } else if (!e) {
    this.flags = R.Mutable | R.RecursedCheck;
    const n = Dn(this);
    try {
      this.value = this.getter();
    } finally {
      De = n, this.flags &= ~R.RecursedCheck;
    }
  }
  const t = De;
  return t !== void 0 && Cs(this, t, Ms), this.value;
}
function Qf(...e) {
  if (e.length) {
    if (this.pendingValue !== (this.pendingValue = e[0])) {
      this.flags = R.Mutable | R.Dirty;
      const t = this.subs;
      t !== void 0 && (Gf(t, !!Jn), Zn || Na());
    }
  } else {
    if (this.flags & R.Dirty && Jf(this)) {
      const n = this.subs;
      n !== void 0 && za(n);
    }
    const t = De;
    return t !== void 0 && Cs(this, t, Ms), this.currentValue;
  }
}
function el(e) {
  const t = e.cleanup;
  e.cleanup = void 0;
  const n = De;
  De = void 0;
  try {
    t();
  } finally {
    De = n;
  }
}
function $a() {
  Ps.call(this), this.cleanup && el(this);
}
function Ps() {
  this.flags = R.None, tl(this);
  const e = this.subs;
  e !== void 0 && ar(e);
}
function tl(e) {
  let t = e.depsTail;
  for (; t !== void 0; ) {
    const n = t.prevDep;
    ar(t, e), t = n;
  }
}
function nl(e) {
  const t = e.depsTail;
  let n = t !== void 0 ? t.nextDep : e.deps;
  for (; n !== void 0; )
    n = ar(n, e);
}
const Wg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  computed: Wp,
  effect: Fp,
  effectScope: Hp,
  endBatch: Lp,
  getActiveSub: Np,
  getBatchDepth: $p,
  isComputed: qp,
  isEffect: Up,
  isEffectScope: kp,
  isSignal: Bp,
  setActiveSub: Dn,
  signal: Kp,
  startBatch: jp,
  trigger: Gp
}, Symbol.toStringTag, { value: "Module" }));
// @__NO_SIDE_EFFECTS__
function Xp(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const Jp = __DEV__ ? Object.freeze({}) : {};
__DEV__ && Object.freeze([]);
const Zp = () => {
}, zr = Object.assign, Qp = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, eg = Object.prototype.hasOwnProperty, es = (e, t) => eg.call(e, t), Mt = Array.isArray, $n = (e) => Vs(e) === "[object Map]", tg = (e) => Vs(e) === "[object Set]", Nr = (e) => typeof e == "function", ng = (e) => typeof e == "string", bn = (e) => typeof e == "symbol", yn = (e) => e !== null && typeof e == "object", rg = Object.prototype.toString, Vs = (e) => rg.call(e), rl = (e) => Vs(e).slice(8, -1), ig = (e) => Vs(e) === "[object Object]", zs = (e) => ng(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, sg = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, og = sg((e) => e.charAt(0).toUpperCase() + e.slice(1)), dt = (e, t) => !Object.is(e, t), ag = (e, t, n, r = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: r,
    value: n
  });
};
var ae = /* @__PURE__ */ ((e) => (e.GET = "get", e.HAS = "has", e.ITERATE = "iterate", e))(ae || {}), G = /* @__PURE__ */ ((e) => (e.SET = "set", e.ADD = "add", e.DELETE = "delete", e.CLEAR = "clear", e))(G || {}), x = /* @__PURE__ */ ((e) => (e.SKIP = "__v_skip", e.IS_REACTIVE = "__v_isReactive", e.IS_READONLY = "__v_isReadonly", e.IS_SHALLOW = "__v_isShallow", e.RAW = "__v_raw", e.IS_REF = "__v_isRef", e))(x || {});
function Te(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let ee;
class ug {
  // TODO isolatedDeclarations ReactiveFlags.SKIP
  constructor(t = !1) {
    this.detached = t, !t && ee && (ee.active ? (this.parent = ee, this.index = (ee.scopes || (ee.scopes = [])).push(
      this
    ) - 1) : (this._active = !1, this._warnOnRun = !1));
  }
  /**
   * @internal
   */
  _active = !0;
  /**
   * @internal track `on` calls, allow `on` call multiple times
   */
  _on = 0;
  /**
   * @internal
   */
  effects = [];
  /**
   * @internal
   */
  cleanups = [];
  _isPaused = !1;
  _warnOnRun = !0;
  /**
   * only assigned by undetached scope
   * @internal
   */
  parent;
  /**
   * record undetached scopes
   * @internal
   */
  scopes;
  /**
   * track a child scope's index in its parent's scopes array for optimized
   * removal
   * @internal
   */
  index;
  __v_skip = !0;
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
      const n = ee;
      try {
        return ee = this, t();
      } finally {
        ee = n;
      }
    } else __DEV__ && this._warnOnRun && Te("cannot run an inactive effect scope.");
  }
  prevScope;
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = ee, ee = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (ee === this)
        ee = this.prevScope;
      else {
        let t = ee;
        for (; t; ) {
          if (t.prevScope === this) {
            t.prevScope = this.prevScope;
            break;
          }
          t = t.prevScope;
        }
      }
      this.prevScope = void 0;
    }
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
function Fg(e) {
  return new ug(e);
}
function cg() {
  return ee;
}
function Hg(e, t = !1) {
  ee ? ee.cleanups.push(e) : __DEV__ && !t && Te(
    "onScopeDispose() is called when there is no active effect scope to be associated with."
  );
}
let V;
var Rt = /* @__PURE__ */ ((e) => (e[e.ACTIVE = 1] = "ACTIVE", e[e.RUNNING = 2] = "RUNNING", e[e.TRACKING = 4] = "TRACKING", e[e.NOTIFIED = 8] = "NOTIFIED", e[e.DIRTY = 16] = "DIRTY", e[e.ALLOW_RECURSE = 32] = "ALLOW_RECURSE", e[e.PAUSED = 64] = "PAUSED", e[e.EVALUATED = 128] = "EVALUATED", e))(Rt || {});
const to = /* @__PURE__ */ new WeakSet();
class ts {
  constructor(t) {
    this.fn = t, ee && (ee.active ? ee.effects.push(this) : this.flags &= -2);
  }
  /**
   * @internal
   */
  deps = void 0;
  /**
   * @internal
   */
  depsTail = void 0;
  /**
   * @internal
   */
  flags = 5;
  /**
   * @internal
   */
  next = void 0;
  /**
   * @internal
   */
  cleanup = void 0;
  scheduler = void 0;
  onStop;
  onTrack;
  onTrigger;
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, to.has(this) && (to.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || sl(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Lu(this), ol(this);
    const t = V, n = Le;
    V = this, Le = !0;
    try {
      return this.fn();
    } finally {
      __DEV__ && V !== this && Te(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), al(this), V = t, Le = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Ba(t);
      this.deps = this.depsTail = void 0, Lu(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? to.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Co(this) && this.run();
  }
  get dirty() {
    return Co(this);
  }
}
let il = 0, vr, Sr;
function sl(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Sr, Sr = e;
    return;
  }
  e.next = vr, vr = e;
}
function ja() {
  il++;
}
function La() {
  if (--il > 0)
    return;
  if (Sr) {
    let t = Sr;
    for (Sr = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; vr; ) {
    let t = vr;
    for (vr = void 0; t; ) {
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
function ol(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function al(e) {
  let t, n = e.depsTail, r = n;
  for (; r; ) {
    const i = r.prevDep;
    r.version === -1 ? (r === n && (n = i), Ba(r), fg(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = i;
  }
  e.deps = t, e.depsTail = n;
}
function Co(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (ul(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function ul(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === $r) || (e.globalVersion = $r, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Co(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = V, r = Le;
  V = e, Le = !0;
  try {
    ol(e);
    const i = e.fn(e._value);
    (t.version === 0 || dt(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    V = n, Le = r, al(e), e.flags &= -3;
  }
}
function Ba(e, t = !1) {
  const { dep: n, prevSub: r, nextSub: i } = e;
  if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), __DEV__ && n.subsHead === e && (n.subsHead = i), n.subs === e && (n.subs = r, !r && n.computed)) {
    n.computed.flags &= -5;
    for (let s = n.computed.deps; s; s = s.nextDep)
      Ba(s, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function fg(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function Gg(e, t) {
  e.effect instanceof ts && (e = e.effect.fn);
  const n = new ts(e);
  t && zr(n, t);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const r = n.run.bind(n);
  return r.effect = n, r;
}
function Yg(e) {
  e.effect.stop();
}
let Le = !0;
const qa = [];
function cl() {
  qa.push(Le), Le = !1;
}
function Xg() {
  qa.push(Le), Le = !0;
}
function fl() {
  const e = qa.pop();
  Le = e === void 0 ? !0 : e;
}
function Jg(e, t = !1) {
  V instanceof ts ? V.cleanup = e : __DEV__ && !t && Te(
    "onEffectCleanup() was called when there was no active effect to associate with."
  );
}
function Lu(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = V;
    V = void 0;
    try {
      t();
    } finally {
      V = n;
    }
  }
}
let $r = 0;
class lg {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
  /**
   * - Before each effect run, all previous dep links' version are reset to -1
   * - During the run, a link's version is synced with the source dep on access
   * - After the run, links with version -1 (that were never used) are cleaned
   *   up
   */
  version;
  /**
   * Pointers for doubly-linked lists
   */
  nextDep;
  prevDep;
  nextSub;
  prevSub;
  prevActiveLink;
}
class Ns {
  // TODO isolatedDeclarations ReactiveFlags.SKIP
  constructor(t) {
    this.computed = t, __DEV__ && (this.subsHead = void 0);
  }
  version = 0;
  /**
   * Link between this dep and the current active effect
   */
  activeLink = void 0;
  /**
   * Doubly linked list representing the subscribing effects (tail)
   */
  subs = void 0;
  /**
   * Doubly linked list representing the subscribing effects (head)
   * DEV only, for invoking onTrigger hooks in correct order
   */
  subsHead;
  /**
   * For object property deps cleanup
   */
  map = void 0;
  key = void 0;
  /**
   * Subscriber counter
   */
  sc = 0;
  /**
   * @internal
   */
  __v_skip = !0;
  track(t) {
    if (!V || !Le || V === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== V)
      n = this.activeLink = new lg(V, this), V.deps ? (n.prevDep = V.depsTail, V.depsTail.nextDep = n, V.depsTail = n) : V.deps = V.depsTail = n, ll(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const r = n.nextDep;
      r.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = r), n.prevDep = V.depsTail, n.nextDep = void 0, V.depsTail.nextDep = n, V.depsTail = n, V.deps === n && (V.deps = r);
    }
    return __DEV__ && V.onTrack && V.onTrack(
      zr(
        {
          effect: V
        },
        t
      )
    ), n;
  }
  trigger(t) {
    this.version++, $r++, this.notify(t);
  }
  notify(t) {
    ja();
    try {
      if (__DEV__)
        for (let n = this.subsHead; n; n = n.nextSub)
          n.sub.onTrigger && !(n.sub.flags & Rt.NOTIFIED) && n.sub.onTrigger(
            zr(
              {
                effect: n.sub
              },
              t
            )
          );
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      La();
    }
  }
}
function ll(e) {
  if (e.dep.sc++, e.sub.flags & Rt.TRACKING) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= Rt.TRACKING | Rt.DIRTY;
      for (let r = t.deps; r; r = r.nextDep)
        ll(r);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), __DEV__ && e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const ns = /* @__PURE__ */ new WeakMap(), an = Symbol(
  __DEV__ ? "Object iterate" : ""
), Po = Symbol(
  __DEV__ ? "Map keys iterate" : ""
), jr = Symbol(
  __DEV__ ? "Array iterate" : ""
);
function Se(e, t, n) {
  if (Le && V) {
    let r = ns.get(e);
    r || ns.set(e, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || (r.set(n, i = new Ns()), i.map = r, i.key = n), __DEV__ ? i.track({
      target: e,
      type: t,
      key: n
    }) : i.track();
  }
}
function $t(e, t, n, r, i, s) {
  const o = ns.get(e);
  if (!o) {
    $r++;
    return;
  }
  const a = (u) => {
    u && (__DEV__ ? u.trigger({
      target: e,
      type: t,
      key: n,
      newValue: r,
      oldValue: i,
      oldTarget: s
    }) : u.trigger());
  };
  if (ja(), t === G.CLEAR)
    o.forEach(a);
  else {
    const u = Mt(e), f = u && zs(n);
    if (u && n === "length") {
      const c = Number(r);
      o.forEach((l, _) => {
        (_ === "length" || _ === jr || !bn(_) && _ >= c) && a(l);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && a(o.get(n)), f && a(o.get(jr)), t) {
        case G.ADD:
          u ? f && a(o.get("length")) : (a(o.get(an)), $n(e) && a(o.get(Po)));
          break;
        case G.DELETE:
          u || (a(o.get(an)), $n(e) && a(o.get(Po)));
          break;
        case G.SET:
          $n(e) && a(o.get(an));
          break;
      }
  }
  La();
}
function hg(e, t) {
  const n = ns.get(e);
  return n && n.get(t);
}
function Tn(e) {
  const t = /* @__PURE__ */ z(e);
  return t === e ? t : (Se(t, ae.ITERATE, jr), /* @__PURE__ */ Je(e) ? t : t.map(Ct));
}
function Ua(e) {
  return Se(e = /* @__PURE__ */ z(e), ae.ITERATE, jr), e;
}
function ft(e, t) {
  return /* @__PURE__ */ Gt(e) ? Lr(/* @__PURE__ */ jn(e) ? Ct(t) : t) : Ct(t);
}
const _g = {
  __proto__: null,
  [Symbol.iterator]() {
    return no(this, Symbol.iterator, (e) => ft(this, e));
  },
  concat(...e) {
    return Tn(this).concat(
      ...e.map((t) => Mt(t) ? Tn(t) : t)
    );
  },
  entries() {
    return no(this, "entries", (e) => (e[1] = ft(this, e[1]), e));
  },
  every(e, t) {
    return Ot(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Ot(
      this,
      "filter",
      e,
      t,
      (n) => n.map((r) => ft(this, r)),
      arguments
    );
  },
  find(e, t) {
    return Ot(
      this,
      "find",
      e,
      t,
      (n) => ft(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return Ot(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Ot(
      this,
      "findLast",
      e,
      t,
      (n) => ft(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return Ot(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Ot(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return ro(this, "includes", e);
  },
  indexOf(...e) {
    return ro(this, "indexOf", e);
  },
  join(e) {
    return Tn(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return ro(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Ot(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return fr(this, "pop");
  },
  push(...e) {
    return fr(this, "push", e);
  },
  reduce(e, ...t) {
    return Bu(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Bu(this, "reduceRight", e, t);
  },
  shift() {
    return fr(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Ot(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return fr(this, "splice", e);
  },
  toReversed() {
    return Tn(this).toReversed();
  },
  toSorted(e) {
    return Tn(this).toSorted(e);
  },
  toSpliced(...e) {
    return Tn(this).toSpliced(...e);
  },
  unshift(...e) {
    return fr(this, "unshift", e);
  },
  values() {
    return no(this, "values", (e) => ft(this, e));
  }
};
function no(e, t, n) {
  const r = Ua(e), i = r[t]();
  return r !== e && !/* @__PURE__ */ Je(e) && (i._next = i.next, i.next = () => {
    const s = i._next();
    return s.done || (s.value = n(s.value)), s;
  }), i;
}
const dg = Array.prototype;
function Ot(e, t, n, r, i, s) {
  const o = Ua(e), a = o !== e && !/* @__PURE__ */ Je(e), u = o[t];
  if (u !== dg[t]) {
    const l = u.apply(e, s);
    return a ? Ct(l) : l;
  }
  let f = n;
  o !== e && (a ? f = function(l, _) {
    return n.call(this, ft(e, l), _, e);
  } : n.length > 2 && (f = function(l, _) {
    return n.call(this, l, _, e);
  }));
  const c = u.call(o, f, r);
  return a && i ? i(c) : c;
}
function Bu(e, t, n, r) {
  const i = Ua(e), s = i !== e && !/* @__PURE__ */ Je(e);
  let o = n, a = !1;
  i !== e && (s ? (a = r.length === 0, o = function(f, c, l) {
    return a && (a = !1, f = ft(e, f)), n.call(this, f, ft(e, c), l, e);
  }) : n.length > 3 && (o = function(f, c, l) {
    return n.call(this, f, c, l, e);
  }));
  const u = i[t](o, ...r);
  return a ? ft(e, u) : u;
}
function ro(e, t, n) {
  const r = /* @__PURE__ */ z(e);
  Se(r, ae.ITERATE, jr);
  const i = r[t](...n);
  return (i === -1 || i === !1) && /* @__PURE__ */ ka(n[0]) ? (n[0] = /* @__PURE__ */ z(n[0]), r[t](...n)) : i;
}
function fr(e, t, n = []) {
  cl(), ja();
  const r = (/* @__PURE__ */ z(e))[t].apply(e, n);
  return La(), fl(), r;
}
const pg = /* @__PURE__ */ Xp("__proto__,__v_isRef,__isVue"), hl = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(bn)
);
function gg(e) {
  bn(e) || (e = String(e));
  const t = /* @__PURE__ */ z(this);
  return Se(t, ae.HAS, e), t.hasOwnProperty(e);
}
class _l {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, r) {
    if (n === x.SKIP) return t[x.SKIP];
    const i = this._isReadonly, s = this._isShallow;
    if (n === x.IS_REACTIVE)
      return !i;
    if (n === x.IS_READONLY)
      return i;
    if (n === x.IS_SHALLOW)
      return s;
    if (n === x.RAW)
      return r === (i ? s ? ml : yl : s ? bl : gl).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(r) ? t : void 0;
    const o = Mt(t);
    if (!i) {
      let u;
      if (o && (u = _g[n]))
        return u;
      if (n === "hasOwnProperty")
        return gg;
    }
    const a = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ be(t) ? t : r
    );
    if ((bn(n) ? hl.has(n) : pg(n)) || (i || Se(t, ae.GET, n), s))
      return a;
    if (/* @__PURE__ */ be(a)) {
      const u = o && zs(n) ? a : a.value;
      return i && yn(u) ? /* @__PURE__ */ zo(u) : u;
    }
    return yn(a) ? i ? /* @__PURE__ */ zo(a) : /* @__PURE__ */ vl(a) : a;
  }
}
class dl extends _l {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, r, i) {
    let s = t[n];
    const o = Mt(t) && zs(n);
    if (!this._isShallow) {
      const f = /* @__PURE__ */ Gt(s);
      if (!/* @__PURE__ */ Je(r) && !/* @__PURE__ */ Gt(r) && (s = /* @__PURE__ */ z(s), r = /* @__PURE__ */ z(r)), !o && /* @__PURE__ */ be(s) && !/* @__PURE__ */ be(r))
        return f ? (__DEV__ && Te(
          `Set operation on key "${String(n)}" failed: target is readonly.`,
          t[n]
        ), !0) : (s.value = r, !0);
    }
    const a = o ? Number(n) < t.length : es(t, n), u = Reflect.set(
      t,
      n,
      r,
      /* @__PURE__ */ be(t) ? t : i
    );
    return t === /* @__PURE__ */ z(i) && u && (a ? dt(r, s) && $t(t, G.SET, n, r, s) : $t(t, G.ADD, n, r)), u;
  }
  deleteProperty(t, n) {
    const r = es(t, n), i = t[n], s = Reflect.deleteProperty(t, n);
    return s && r && $t(t, G.DELETE, n, void 0, i), s;
  }
  has(t, n) {
    const r = Reflect.has(t, n);
    return (!bn(n) || !hl.has(n)) && Se(t, ae.HAS, n), r;
  }
  ownKeys(t) {
    return Se(
      t,
      ae.ITERATE,
      Mt(t) ? "length" : an
    ), Reflect.ownKeys(t);
  }
}
class pl extends _l {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return __DEV__ && Te(
      `Set operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, n) {
    return __DEV__ && Te(
      `Delete operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
}
const bg = /* @__PURE__ */ new dl(), yg = /* @__PURE__ */ new pl(), mg = /* @__PURE__ */ new dl(!0), vg = /* @__PURE__ */ new pl(!0), Vo = (e) => e, wi = (e) => Reflect.getPrototypeOf(e);
function Sg(e, t, n) {
  return function(...r) {
    const i = this[x.RAW], s = /* @__PURE__ */ z(i), o = $n(s), a = e === "entries" || e === Symbol.iterator && o, u = e === "keys" && o, f = i[e](...r), c = n ? Vo : t ? Lr : Ct;
    return !t && Se(
      s,
      ae.ITERATE,
      u ? Po : an
    ), zr(
      // inheriting all iterator properties
      Object.create(f),
      {
        // iterator protocol
        next() {
          const { value: l, done: _ } = f.next();
          return _ ? { value: l, done: _ } : {
            value: a ? [c(l[0]), c(l[1])] : c(l),
            done: _
          };
        }
      }
    );
  };
}
function Ei(e) {
  return function(...t) {
    if (__DEV__) {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      Te(
        `${og(e)} operation ${n}failed: target is readonly.`,
        /* @__PURE__ */ z(this)
      );
    }
    return e === G.DELETE ? !1 : e === G.CLEAR ? void 0 : this;
  };
}
function wg(e, t) {
  const n = {
    get(i) {
      const s = this[x.RAW], o = /* @__PURE__ */ z(s), a = /* @__PURE__ */ z(i);
      e || (dt(i, a) && Se(o, ae.GET, i), Se(o, ae.GET, a));
      const { has: u } = wi(o), f = t ? Vo : e ? Lr : Ct;
      if (u.call(o, i))
        return f(s.get(i));
      if (u.call(o, a))
        return f(s.get(a));
      s !== o && s.get(i);
    },
    get size() {
      const i = this[x.RAW];
      return !e && Se(/* @__PURE__ */ z(i), ae.ITERATE, an), i.size;
    },
    has(i) {
      const s = this[x.RAW], o = /* @__PURE__ */ z(s), a = /* @__PURE__ */ z(i);
      return e || (dt(i, a) && Se(o, ae.HAS, i), Se(o, ae.HAS, a)), i === a ? s.has(i) : s.has(i) || s.has(a);
    },
    forEach(i, s) {
      const o = this, a = o[x.RAW], u = /* @__PURE__ */ z(a), f = t ? Vo : e ? Lr : Ct;
      return !e && Se(u, ae.ITERATE, an), a.forEach((c, l) => i.call(s, f(c), f(l), o));
    }
  };
  return zr(
    n,
    e ? {
      add: Ei(G.ADD),
      set: Ei(G.SET),
      delete: Ei(G.DELETE),
      clear: Ei(G.CLEAR)
    } : {
      add(i) {
        const s = /* @__PURE__ */ z(this), o = wi(s), a = /* @__PURE__ */ z(i), u = !t && !/* @__PURE__ */ Je(i) && !/* @__PURE__ */ Gt(i) ? a : i;
        return o.has.call(s, u) || dt(i, u) && o.has.call(s, i) || dt(a, u) && o.has.call(s, a) || (s.add(u), $t(s, G.ADD, u, u)), this;
      },
      set(i, s) {
        !t && !/* @__PURE__ */ Je(s) && !/* @__PURE__ */ Gt(s) && (s = /* @__PURE__ */ z(s));
        const o = /* @__PURE__ */ z(this), { has: a, get: u } = wi(o);
        let f = a.call(o, i);
        f ? __DEV__ && qu(o, a, i) : (i = /* @__PURE__ */ z(i), f = a.call(o, i));
        const c = u.call(o, i);
        return o.set(i, s), f ? dt(s, c) && $t(o, G.SET, i, s, c) : $t(o, G.ADD, i, s), this;
      },
      delete(i) {
        const s = /* @__PURE__ */ z(this), { has: o, get: a } = wi(s);
        let u = o.call(s, i);
        u ? __DEV__ && qu(s, o, i) : (i = /* @__PURE__ */ z(i), u = o.call(s, i));
        const f = a ? a.call(s, i) : void 0, c = s.delete(i);
        return u && $t(s, G.DELETE, i, void 0, f), c;
      },
      clear() {
        const i = /* @__PURE__ */ z(this), s = i.size !== 0, o = __DEV__ ? $n(i) ? new Map(i) : new Set(i) : void 0, a = i.clear();
        return s && $t(
          i,
          G.CLEAR,
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
    n[i] = Sg(i, e, t);
  }), n;
}
function $s(e, t) {
  const n = wg(e, t);
  return (r, i, s) => i === x.IS_REACTIVE ? !e : i === x.IS_READONLY ? e : i === x.RAW ? r : Reflect.get(
    es(n, i) && i in r ? n : r,
    i,
    s
  );
}
const Eg = {
  get: /* @__PURE__ */ $s(!1, !1)
}, Og = {
  get: /* @__PURE__ */ $s(!1, !0)
}, Ag = {
  get: /* @__PURE__ */ $s(!0, !1)
}, Dg = {
  get: /* @__PURE__ */ $s(!0, !0)
};
function qu(e, t, n) {
  const r = /* @__PURE__ */ z(n);
  if (r !== n && t.call(e, r)) {
    const i = rl(e);
    Te(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const gl = /* @__PURE__ */ new WeakMap(), bl = /* @__PURE__ */ new WeakMap(), yl = /* @__PURE__ */ new WeakMap(), ml = /* @__PURE__ */ new WeakMap();
function Ig(e) {
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
// @__NO_SIDE_EFFECTS__
function vl(e) {
  return /* @__PURE__ */ Gt(e) ? e : js(
    e,
    !1,
    bg,
    Eg,
    gl
  );
}
// @__NO_SIDE_EFFECTS__
function Zg(e) {
  return js(
    e,
    !1,
    mg,
    Og,
    bl
  );
}
// @__NO_SIDE_EFFECTS__
function zo(e) {
  return js(
    e,
    !0,
    yg,
    Ag,
    yl
  );
}
// @__NO_SIDE_EFFECTS__
function Qg(e) {
  return js(
    e,
    !0,
    vg,
    Dg,
    ml
  );
}
function js(e, t, n, r, i) {
  if (!yn(e))
    return __DEV__ && Te(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e[x.RAW] && !(t && e[x.IS_REACTIVE]) || e[x.SKIP] || !Object.isExtensible(e))
    return e;
  const s = i.get(e);
  if (s)
    return s;
  const o = Ig(rl(e));
  if (o === 0)
    return e;
  const a = new Proxy(
    e,
    o === 2 ? r : n
  );
  return i.set(e, a), a;
}
// @__NO_SIDE_EFFECTS__
function jn(e) {
  return /* @__PURE__ */ Gt(e) ? /* @__PURE__ */ jn(e[x.RAW]) : !!(e && e[x.IS_REACTIVE]);
}
// @__NO_SIDE_EFFECTS__
function Gt(e) {
  return !!(e && e[x.IS_READONLY]);
}
// @__NO_SIDE_EFFECTS__
function Je(e) {
  return !!(e && e[x.IS_SHALLOW]);
}
// @__NO_SIDE_EFFECTS__
function ka(e) {
  return e ? !!e[x.RAW] : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
  const t = e && e[x.RAW];
  return t ? /* @__PURE__ */ z(t) : e;
}
function eb(e) {
  return !es(e, x.SKIP) && Object.isExtensible(e) && ag(e, x.SKIP, !0), e;
}
const Ct = (e) => yn(e) ? /* @__PURE__ */ vl(e) : e, Lr = (e) => yn(e) ? /* @__PURE__ */ zo(e) : e;
// @__NO_SIDE_EFFECTS__
function be(e) {
  return e ? e[x.IS_REF] === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function xg(e) {
  return Sl(e, !1);
}
// @__NO_SIDE_EFFECTS__
function tb(e) {
  return Sl(e, !0);
}
function Sl(e, t) {
  return /* @__PURE__ */ be(e) ? e : new Tg(e, t);
}
class Tg {
  _value;
  _rawValue;
  dep = new Ns();
  [x.IS_REF] = !0;
  [x.IS_SHALLOW] = !1;
  constructor(t, n) {
    this._rawValue = n ? t : /* @__PURE__ */ z(t), this._value = n ? t : Ct(t), this[x.IS_SHALLOW] = n;
  }
  get value() {
    return __DEV__ ? this.dep.track({
      target: this,
      type: ae.GET,
      key: "value"
    }) : this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, r = this[x.IS_SHALLOW] || /* @__PURE__ */ Je(t) || /* @__PURE__ */ Gt(t);
    t = r ? t : /* @__PURE__ */ z(t), dt(t, n) && (this._rawValue = t, this._value = r ? t : Ct(t), __DEV__ ? this.dep.trigger({
      target: this,
      type: G.SET,
      key: "value",
      newValue: t,
      oldValue: n
    }) : this.dep.trigger());
  }
}
function nb(e) {
  e.dep && (__DEV__ ? e.dep.trigger({
    target: e,
    type: G.SET,
    key: "value",
    newValue: e._value
  }) : e.dep.trigger());
}
function Ka(e) {
  return /* @__PURE__ */ be(e) ? e.value : e;
}
function rb(e) {
  return Nr(e) ? e() : Ka(e);
}
const Rg = {
  get: (e, t, n) => t === x.RAW ? e : Ka(Reflect.get(e, t, n)),
  set: (e, t, n, r) => {
    const i = e[t];
    return /* @__PURE__ */ be(i) && !/* @__PURE__ */ be(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
  }
};
function ib(e) {
  return /* @__PURE__ */ jn(e) ? e : new Proxy(e, Rg);
}
class Mg {
  dep;
  _get;
  _set;
  [x.IS_REF] = !0;
  _value = void 0;
  constructor(t) {
    const n = this.dep = new Ns(), { get: r, set: i } = t(n.track.bind(n), n.trigger.bind(n));
    this._get = r, this._set = i;
  }
  get value() {
    return this._value = this._get();
  }
  set value(t) {
    this._set(t);
  }
}
function sb(e) {
  return new Mg(e);
}
// @__NO_SIDE_EFFECTS__
function ob(e) {
  __DEV__ && !/* @__PURE__ */ ka(e) && Te("toRefs() expects a reactive object but received a plain one.");
  const t = Mt(e) ? new Array(e.length) : {};
  for (const n in e)
    t[n] = wl(e, n);
  return t;
}
class Cg {
  constructor(t, n, r) {
    this._object = t, this._defaultValue = r, this._key = bn(n) ? n : String(n), this._raw = /* @__PURE__ */ z(t);
    let i = !0, s = t;
    if (!Mt(t) || bn(this._key) || !zs(this._key))
      do
        i = !/* @__PURE__ */ ka(s) || /* @__PURE__ */ Je(s);
      while (i && (s = s[x.RAW]));
    this._shallow = i;
  }
  [x.IS_REF] = !0;
  _value = void 0;
  _raw;
  _key;
  _shallow;
  get value() {
    let t = this._object[this._key];
    return this._shallow && (t = Ka(t)), this._value = t === void 0 ? this._defaultValue : t;
  }
  set value(t) {
    if (this._shallow && /* @__PURE__ */ be(this._raw[this._key])) {
      const n = this._object[this._key];
      if (/* @__PURE__ */ be(n)) {
        n.value = t;
        return;
      }
    }
    this._object[this._key] = t;
  }
  get dep() {
    return hg(this._raw, this._key);
  }
}
class Pg {
  constructor(t) {
    this._getter = t;
  }
  [x.IS_REF] = !0;
  [x.IS_READONLY] = !0;
  _value = void 0;
  get value() {
    return this._value = this._getter();
  }
}
// @__NO_SIDE_EFFECTS__
function ab(e, t, n) {
  return /* @__PURE__ */ be(e) ? e : Nr(e) ? new Pg(e) : yn(e) && arguments.length > 1 ? wl(e, t, n) : /* @__PURE__ */ xg(e);
}
function wl(e, t, n) {
  return new Cg(e, t, n);
}
class Vg {
  constructor(t, n, r) {
    this.fn = t, this.setter = n, this[x.IS_READONLY] = !n, this.isSSR = r;
  }
  /**
   * @internal
   */
  _value = void 0;
  /**
   * @internal
   */
  dep = new Ns(this);
  /**
   * @internal
   */
  __v_isRef = !0;
  // TODO isolatedDeclarations ReactiveFlags.IS_REF
  /**
   * @internal
   */
  __v_isReadonly;
  // TODO isolatedDeclarations ReactiveFlags.IS_READONLY
  // A computed is also a subscriber that tracks other deps
  /**
   * @internal
   */
  deps = void 0;
  /**
   * @internal
   */
  depsTail = void 0;
  /**
   * @internal
   */
  flags = Rt.DIRTY;
  /**
   * @internal
   */
  globalVersion = $r - 1;
  /**
   * @internal
   */
  isSSR;
  /**
   * @internal
   */
  next = void 0;
  // for backwards compat
  effect = this;
  // dev only
  onTrack;
  // dev only
  onTrigger;
  /**
   * Dev only
   * @internal
   */
  _warnRecursive;
  /**
   * @internal
   */
  notify() {
    if (this.flags |= Rt.DIRTY, !(this.flags & Rt.NOTIFIED) && // avoid infinite self recursion
    V !== this)
      return sl(this, !0), !0;
    __DEV__;
  }
  get value() {
    const t = __DEV__ ? this.dep.track({
      target: this,
      type: ae.GET,
      key: "value"
    }) : this.dep.track();
    return ul(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter ? this.setter(t) : __DEV__ && Te("Write operation failed: computed value is readonly");
  }
}
// @__NO_SIDE_EFFECTS__
function ub(e, t, n = !1) {
  let r, i;
  Nr(e) ? r = e : (r = e.get, i = e.set);
  const s = new Vg(r, i, n);
  return __DEV__ && t && !n && (s.onTrack = t.onTrack, s.onTrigger = t.onTrigger), s;
}
var zg = /* @__PURE__ */ ((e) => (e[e.WATCH_GETTER = 2] = "WATCH_GETTER", e[e.WATCH_CALLBACK = 3] = "WATCH_CALLBACK", e[e.WATCH_CLEANUP = 4] = "WATCH_CLEANUP", e))(zg || {});
const Oi = {}, rs = /* @__PURE__ */ new WeakMap();
let Vt;
function cb() {
  return Vt;
}
function Ng(e, t = !1, n = Vt) {
  if (n) {
    let r = rs.get(n);
    r || rs.set(n, r = []), r.push(e);
  } else __DEV__ && !t && Te(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function fb(e, t, n = Jp) {
  const { immediate: r, deep: i, once: s, scheduler: o, augmentJob: a, call: u } = n, f = (v) => {
    (n.onWarn || Te)(
      "Invalid watch source: ",
      v,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, c = (v) => i ? v : /* @__PURE__ */ Je(v) || i === !1 || i === 0 ? jt(v, 1) : jt(v);
  let l, _, d, h, p = !1, b = !1;
  if (/* @__PURE__ */ be(e) ? (_ = () => e.value, p = /* @__PURE__ */ Je(e)) : /* @__PURE__ */ jn(e) ? (_ = () => c(e), p = !0) : Mt(e) ? (b = !0, p = e.some((v) => /* @__PURE__ */ jn(v) || /* @__PURE__ */ Je(v)), _ = () => e.map((v) => {
    if (/* @__PURE__ */ be(v))
      return v.value;
    if (/* @__PURE__ */ jn(v))
      return c(v);
    if (Nr(v))
      return u ? u(
        v,
        2
        /* WATCH_GETTER */
      ) : v();
    __DEV__ && f(v);
  })) : Nr(e) ? t ? _ = u ? () => u(
    e,
    2
    /* WATCH_GETTER */
  ) : e : _ = () => {
    if (d) {
      cl();
      try {
        d();
      } finally {
        fl();
      }
    }
    const v = Vt;
    Vt = l;
    try {
      return u ? u(e, 3, [h]) : e(h);
    } finally {
      Vt = v;
    }
  } : (_ = Zp, __DEV__ && f(e)), t && i) {
    const v = _, w = i === !0 ? 1 / 0 : i;
    _ = () => jt(v(), w);
  }
  const S = cg(), O = () => {
    l.stop(), S && S.active && Qp(S.effects, l);
  };
  if (s && t) {
    const v = t;
    t = (...w) => {
      const A = v(...w);
      return O(), A;
    };
  }
  let D = b ? new Array(e.length).fill(Oi) : Oi;
  const m = (v) => {
    if (!(!(l.flags & Rt.ACTIVE) || !l.dirty && !v))
      if (t) {
        const w = l.run();
        if (v || i || p || (b ? w.some((A, C) => dt(A, D[C])) : dt(w, D))) {
          d && d();
          const A = Vt;
          Vt = l;
          try {
            const C = [
              w,
              // pass undefined as the old value when it's changed for the first time
              D === Oi ? void 0 : b && D[0] === Oi ? [] : D,
              h
            ];
            D = w, u ? u(t, 3, C) : (
              // @ts-expect-error
              t(...C)
            );
          } finally {
            Vt = A;
          }
        }
      } else
        l.run();
  };
  return a && a(m), l = new ts(_), l.scheduler = o ? () => o(m, !1) : m, h = (v) => Ng(v, !1, l), d = l.onStop = () => {
    const v = rs.get(l);
    if (v) {
      if (u)
        u(
          v,
          4
          /* WATCH_CLEANUP */
        );
      else
        for (const w of v) w();
      rs.delete(l);
    }
  }, __DEV__ && (l.onTrack = n.onTrack, l.onTrigger = n.onTrigger), t ? r ? m(!0) : D = l.run() : o ? o(m.bind(null, !0), !0) : l.run(), O.pause = l.pause.bind(l), O.resume = l.resume.bind(l), O.stop = O, O;
}
function jt(e, t = 1 / 0, n) {
  if (t <= 0 || !yn(e) || e[x.SKIP] || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ be(e))
    jt(e.value, t, n);
  else if (Mt(e))
    for (let r = 0; r < e.length; r++)
      jt(e[r], t, n);
  else if (tg(e) || $n(e))
    e.forEach((r) => {
      jt(r, t, n);
    });
  else if (ig(e)) {
    for (const r in e)
      jt(e[r], t, n);
    for (const r of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, r) && jt(e[r], t, n);
  }
  return e;
}
export {
  jr as ARRAY_ITERATE_KEY,
  Wg as AlienSignals,
  Kg as AlienSignalsSystem,
  Rt as EffectFlags,
  ug as EffectScope,
  an as ITERATE_KEY,
  $g as Immer,
  Ug as Immutable,
  Po as MAP_KEY_ITERATE_KEY,
  jg as Mobx,
  ts as ReactiveEffect,
  x as ReactiveFlags,
  Lg as Redux,
  kg as Signals,
  ae as TrackOpTypes,
  G as TriggerOpTypes,
  zg as WatchErrorCodes,
  ub as computed,
  sb as customRef,
  Gg as effect,
  Fg as effectScope,
  Xg as enableTracking,
  cg as getCurrentScope,
  cb as getCurrentWatcher,
  ka as isProxy,
  jn as isReactive,
  Gt as isReadonly,
  be as isRef,
  Je as isShallow,
  eb as markRaw,
  Jg as onEffectCleanup,
  Hg as onScopeDispose,
  Ng as onWatcherCleanup,
  cl as pauseTracking,
  ib as proxyRefs,
  vl as reactive,
  Tn as reactiveReadArray,
  zo as readonly,
  xg as ref,
  fl as resetTracking,
  Zg as shallowReactive,
  Ua as shallowReadArray,
  Qg as shallowReadonly,
  tb as shallowRef,
  Yg as stop,
  z as toRaw,
  Ct as toReactive,
  Lr as toReadonly,
  ab as toRef,
  ob as toRefs,
  rb as toValue,
  Se as track,
  jt as traverse,
  $t as trigger,
  nb as triggerRef,
  Ka as unref,
  fb as watch
};
